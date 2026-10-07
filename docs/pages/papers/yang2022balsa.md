# Balsa: Learning a Query Optimizer Without Expert Demonstrations

**Balsa** · SIGMOD 2022

Read: [PDF](https://arxiv.org/pdf/2201.01441) · [arXiv](https://arxiv.org/abs/2201.01441) · [DOI](https://doi.org/10.1145/3514221.3517885)  
Code: [balsa](https://github.com/balsa-project/balsa)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A learned query optimizer trained by RL without expert demonstrations.
- Bootstrapped from a simple simulator.

## In plain words

A query optimizer chooses how a database runs each query: the join order and each join's method. The authors' motivation is cost: optimizers "take experts months to write and years to refine" (abstract). They ask whether an optimizer can be learned by trial and error, without learning from an existing optimizer. The obstacle is that "most execution plans for a query are slow" (§1), so a learner with no prior knowledge is likely to pick them, which "may prevent any progress". Their system, Balsa, first practises against a crude cost formula that runs nothing, then learns from measured run times, cutting off overlong plans and trying only plans it rates highly.

On the Join Order Benchmark (hard queries over a movie database), they report that Balsa matches PostgreSQL's optimizer and a commercial one "with two hours of learning" and beats them "by up to 2.8× in workload runtime after a few more hours" (abstract). They present showing that learning without an expert optimizer is "both possible and efficient" as a first, hedged "To our knowledge" (§1).

## Background and terms

**Terms to know:** [query optimizer](#/glossary/query-optimizer) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [cost-based optimization](#/glossary/cost-based-optimization) · [cardinality estimation](#/glossary/cardinality-estimation) · [join algorithms](#/glossary/join-algorithms-nested-loop-hash-and-merge-join) · [reinforcement learning](#/glossary/reinforcement-learning) · [value function](#/glossary/value-function) · [beam search](#/glossary/beam-search) · [query hint](#/glossary/query-hint) · [select-project-join (SPJ) block](#/glossary/select-project-join-spj-query) (Balsa optimizes such blocks, §2 "Assumptions") · [bushy and left-deep plans](#/glossary/left-deep-and-bushy-plans) (§3.2, §8.2, §9, Fig. 18)

**The paper's own terms:**
- **expert optimizer / expert demonstrations**: a mature, human-built optimizer, and the plans it produces (§1, §1.1).
- **value function, V_sim and V_real**: a network that, given a query and a partial plan, predicts the "overall cost/latency" of finishing the query from it; lower is better (§2.1). V_sim predicts simulator cost; V_real starts as its copy and learns measured latencies (§2.1).
- **simulator, C_out**: a cost formula that sums the estimated row counts of every table, filter and join in a plan, with no knowledge of the engine or join methods (§3.1); the estimates come from PostgreSQL's cardinality estimator (§1, §3.3).
- **safe execution**: timeouts on plan runs, with timed-out plans labelled very slow (§4.3).
- **safe exploration**: count-based exploration, running plans not yet executed among beam search's top plans (§5).
- **on-policy learning**: each update trains only on the latest iteration's executions, not on all of them; labels still use all of them (§4.1).
- **diversified experiences, Balsa-8x**: training a new agent, without running queries, on the merged executions of independently trained agents, eight for Balsa-8x (§6, §8.5); meant to cover several "modes", the kinds of plans one agent converges to (§6).
- **workload runtime, speedup**: the sum of per-query latencies, and the expert's workload runtime divided by Balsa's (§8.1).

**Builds on** (none is on this site; the paper's descriptions of them are flagged):
- **DQ** (Krishnan et al.): a learned value network plus plan search, learning from an expert's cost model; Balsa takes its dynamic-programming data collection and data augmentation (§1.1, §3.2, §9).
- **Neo** (Marcus et al.): learns from PostgreSQL's plans, then from real executions; Balsa reuses its plan encoding, network type and best-latency labels (§4.1, §7) and compares with it (§8.4).
- **Bao** (Marcus et al.): learns which hints to give an expert optimizer per query (§8.4.1).
- **The Join Order Benchmark** of Leis et al. (§8.1).

## Problem and setting

- **Question:** can an optimizer be learned "without learning from an existing expert optimizer" (§1), accessing the engine "only to execute plans and observe their runtimes" (§2)?
- **Task:** given data, an engine and training queries, learn to plan; then plan unseen queries on the same data, which may have new filters and join graphs (§2).
- **Assumptions:** "We assume the database content is kept static"; Balsa "currently optimizes select-project-join (SPJ) blocks" (§2 "Assumptions").
- **Correctness:** a plan is better when its measured latency is lower; checking that plans return the same result: not discussed.
- **Workloads (§8.1):** JOB, 113 queries over the Internet Movie Database with 3–16 joins, split two ways into 94 training and 19 test queries (random, and "JOB Slow", whose test set is the 19 slowest under an expert); TPC-H, a standard synthetic analytical benchmark, with 70 training and 10 test queries; Ext-JOB, 24 queries over the same data with new join templates (§8.5).
- **Engines:** PostgreSQL 12.5 and "CommDB", a commercial system anonymized for licensing reasons; Balsa's plans are forced through hints and compared with that engine's own optimizer (§8.1). Each experiment runs 8 times, reporting the median "unless specified otherwise" (§8.1).

## Approach

- **Planning (§2.1, §4.2).** Plans are built bottom-up: the value network scores each possible next join, and beam search keeps the 20 best partial states until it has 10 complete plans.
- **Bootstrapping from simulation (§3).** Dynamic programming enumerates bushy plans for each training query (skipping queries with 12 or more tables); each enumerated plan gets its C_out cost, each of its subplans is labelled with that same cost, and V_sim learns from these by supervised learning (§3.2). The aim is to "steer the agent away from definitively disastrous plans", "not to instill expert knowledge" (§3.1).
- **Learning from execution (§4).** Each iteration plans the training queries with V_real, runs the plans, and moves each subplan's prediction towards the best latency seen so far for that query among plans containing the subplan, a technique from Neo (§4.1). Updates are on-policy, which the authors credit with much faster training than Neo (§4.1). Iteration 0 runs to completion; later plans are stopped after twice the slowest query's time in iteration 0, a limit that tightens when a later iteration's slowest query is faster (§4.3).
- **Safe exploration (§5, Fig. 3).** An ε-greedy strategy that sometimes picks a random plan "often selected inferior plans that led to timeouts" in early experiments, so Balsa runs the best unseen plan of beam search's top 10, and the predicted-cheapest when all have run.
- **Diversified experiences (§6).** Eight agents' merged executions hold several times more unique plans than one agent's (Tab. 1).

## Results

- **Against the experts (§8.2, Fig. 6)**. On PostgreSQL, training-set speedups are 2.1× (JOB), 1.3× (JOB Slow) and 1.1× (TPC-H), and 1.7× on the JOB test set; on CommDB, 1.1–2.8× (training) and 1.0–1.9× (test), higher speedups the authors attribute to CommDB's "much smaller search space". They write that "On all workloads" Balsa surpasses the experts "by a sizable margin" (§8.2).
- **Learning time (§8.2, Fig. 7a).** On PostgreSQL, Balsa matches the expert after 1.4 hours (JOB), 2.5 (JOB Slow) and 1.5 (TPC-H), and reaches its peak "a few more hours" later (§8); matching takes a few thousand executions (Fig. 7b). Simulation takes "dozens of minutes" (Tab. 2).
- **Simulation (§3, §3.3, §8.3.1).** On 94 JOB queries, randomly initialized agents' plans run up to 79× slower than PostgreSQL's; after simulation alone, at most 5.8× slower. Without simulation, agents still finish training but "can fail at test time" (Fig. 10b).
- **Ablations (§8.3, JOB random split on PostgreSQL)**. Timeouts reach the expert faster and prevent spikes (Fig. 11); count-based exploration generalizes better than random-join exploration or none (Fig. 12); on-policy learning reaches the expert faster than retraining (Fig. 13); beam settings other than a beam of 1 give similar plan quality (Fig. 14).
- **Neo and Bao (§8.4)**. "Neo-impl", the authors' "best-effort reproduction" of Neo, needed about 25 hours for 100 iterations against Balsa's 2.6, and its test runtime fluctuates, at times several times slower than the expert, while Balsa stays faster (Fig. 15). Against Bao, run with two changes of the authors', Tab. 3 gives Balsa 2.1×/1.7× (JOB train/test) and 1.3×/1.3× (JOB Slow) against Bao's 1.6×/1.8× and 1.2×/1.1×; the authors write that Balsa "generally matches or outperforms Bao".
- **Generalization (§8.5)**. Balsa-8x improves speedups "in almost all cases" (Fig. 16). On Ext-JOB, neither single-agent Balsa nor Neo-impl beats the expert; Balsa-8x, after 50 more iterations, is 20% faster than the expert while Balsa-1x does not match it (Fig. 17).
- **Behaviour (§8.6, Fig. 18).** Balsa soon cuts its use of merge joins, prefers nested-loop joins, most of them the indexed variant, and picks plan shapes unlike PostgreSQL's.

## Limits the authors state

- The database is assumed static; changes "can be handled by retraining" (§2 "Assumptions"). Only SPJ blocks are optimized (§2).
- "Due to its simplicity, the cost model is inherently inaccurate" (§3.1).
- "Beam search is not guaranteed to return globally optimal plans" (§4.2).
- With exploration, "the new plans are still relatively confined to a single agent's mode" (§6).
- TPC-H templates with "advanced SQL features (views, sub-queries)" were avoided "due to a limitation in the pg_hint_plan extension" (§8.1, footnote 9).
- "On-policy has slightly higher variance due to performing SGD on much less data" (§8.3.4).
- "The planner is implemented in Python and thus leaves room for optimization" (§8.3.5).
- On Ext-JOB, "neither surpasses the expert on the Ext-JOB test set (although they come close)" with single-agent experience (§8.5).

## Open problems and building blocks

  - New data systems "may have" execution models or objectives that "go beyond our knowledge of query optimization"; "Balsa is a first step towards this exciting direction" (§11).
  - Engines with other objectives may bootstrap from C_out "or develop another minimal cost model tailored to the objective" (§3.3).
  - The authors "expect better estimates to lead to a better simulator, which would accelerate learning" (§10).
- **Released:** "Balsa is open sourced" (§1).
- **To reuse it:** an execution environment that "executes plans" with "support for timeouts", and the search space, "the set of query operators and the rules to compose them" (§7); a cardinality estimator (§3.3); a way to force plans, here hints (§8.1); training queries (§2). The authors trained on one Tesla M60 GPU with 8-core Azure VMs (§8.1); on one execution node, "peak performance is reached within single-digit hours" (§8.2).
- **Beyond its domain:** for on-policy learning, "We hypothesize that this technique may also improve other applications of value functions that predict runtimes" (§4.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-learned">qo-learned</a></span>
