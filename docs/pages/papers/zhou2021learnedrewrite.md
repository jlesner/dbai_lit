# A learned query rewrite system using Monte Carlo tree search

**LearnedRewrite** · PVLDB 15(1) 2022 · 2021

Read: [DOI](https://doi.org/10.14778/3485450.3485456)  
Code: [LearnedRewrite](https://github.com/XuanheZhou/LearnedRewrite)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Chooses the *order* of Calcite rewrite rules by Monte Carlo tree search.
- Guided by a learned estimator of future cost reduction; the authors say it has been applied in openGauss (§2.3, PDF p. 4).

## In plain words

A database can often run a slow SQL query much faster after rewriting it into an equivalent one; the authors say a slow query "can be improved by orders of magnitude if the SQL query is properly rewritten" (§1, PDF p. 1). Rules interact, so their order matters, and existing rewriters "only use a default order (e.g., top-down, arbitrary), which may fall in a local optimum" (§1, PDF p. 1). LearnedRewrite treats each order as a path in a tree of rewritten queries and searches it with Monte Carlo tree search, which balances promising paths against rarely tried ones. A neural network, trained on generated queries, predicts how much more a partly rewritten query could still gain. They present it as an improvement on existing rewriters, which it "significantly outperformed" (abstract, PDF p. 1). On TPC-H, a synthetic analytics benchmark, they report total time (rewriting plus running) over 46.9% lower than the PostgreSQL database's top-down rule order and 19.9% lower than a greedy rule-matching baseline (§6.2, PDF p. 10).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [phase ordering](#/glossary/phase-ordering) · [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [logical plan](#/glossary/logical-plan) · [query equivalence](#/glossary/query-equivalence) · [OLAP and OLTP](#/glossary/olap-and-oltp)

**The paper's own terms:**
- **rewrite rule**: an operator, a condition and an action; if the condition holds on the operator or its subtree, the action gives an equivalent query (Def. 1, §2.1, PDF p. 2). Tab. 1 (PDF p. 2) examples include removing redundant aggregates or splitting an OR predicate into a UNION ALL.
- **rewrite operation**: one (operator, rule) pair; a **rewrite order** is a sequence of them (Def. 2, §2.2, PDF p. 3).
- **policy tree**: the input query is the root, each child is its parent after one rewrite operation, a leaf is a query no rule can rewrite, and a root-to-node path is a rewrite order; the **optimal node** has the smallest cost (Def. 3–4, §3.1, PDF p. 4).
- **previous / subsequent cost reduction**: the drop in cost from the input query to a node, and the largest further drop from the node to any descendant, which is hard to obtain and so is estimated (§3.1, PDF p. 4). Their sum is the **node benefit** (Def. 5, PDF p. 5).
- **node utility**: node benefit plus an exploration bonus for rarely visited nodes, scaled by the exploration parameter γ; the authors call it the upper confidence bound (UCB) of the probability that the node lies on the path to the optimal node (Def. 6, PDF p. 5). §4.3's loss weight (PDF p. 8) is also printed γ.
- **model-based vs. model-free RL**: in the paper's usage, model-free methods (Q-learning, DDPG) update their policy during online use; model-based ones (here MCTS) use a pre-trained estimation model (§2.3 "Reinforcement Learning", PDF p. 4).

**Builds on:**
- MCTS [24, 7]: the authors replace the random exploration of descendants in "the traditional MCTS algorithm [7]" with a learned estimate (§3.2, PDF p. 5).
- Apache Calcite [6] ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), "an advanced query engine that independently encapsulates rewrite rules and supports user-defined rewrite orders": the rules come from it (§6.1, PDF p. 9).
- Baselines: PostgreSQL [3] and Calcite top-down, and a heuristic citing Starburst [32] ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)")) (§2.3, PDF p. 3; §6.1 "Baseline Methods", PDF p. 10).
- Learned cost estimators [28, 34], which estimate a plan's cost but not effectively the gain from rewriting it (§2.3, PDF pp. 3–4).

## Problem and setting

- **Question:** given a query and a rule set, find a sequence of rewrite operations whose result is equivalent to the query and has the lowest execution cost among all rewritten queries (Def. 2, §2.2, PDF p. 3), with costs from a cost estimator (§2.1, PDF p. 3). Equivalence rests on each rule's promise in Def. 1 (PDF p. 2).
- **SQL covered:** query trees of operators such as scan, filter, aggregate, join, subquery, union and intersect (§2.1, PDF p. 2). NULLs: not discussed.
- **Setup** (§6.1, PDF p. 9): Calcite's rules; rewritten queries run "in popular databases (e.g., PostgreSQL)". Benchmarks: TPC-H (10,673 synthetic queries over 1 s, at about 4.7 GB and 50 GB); JOB, an analytics benchmark on real IMDB movie data (15,750 synthesized queries over 1 s); XuetangX, which the authors call a real-world OLTP benchmark for online education (22,000 real queries over 1 s). Queries also come from tools like SQLSmith, a random query generator; splits are 8:1:1.
- **Metrics** (§6.1 "Rewrite Metrics", PDF p. 9): the optimizer's execution cost, rewrite latency, query latency and overall latency (rewrite plus query), each query run three times, at the median, 90th and 95th percentiles.

## Approach

- **Tree search (§3.2, Alg. 1, PDF pp. 5–6; Fig. 2, PDF p. 4).** Each iteration (1) selects the highest-utility node, descending through expanded nodes, and expands it with every applicable (operator, rule) pair; (2) estimates that node's subsequent cost reduction with the learned model; (3) raises its ancestors' visit counts, and their subsequent cost reduction when the new node's benefit is higher. It stops at a maximum iteration count "or meeting the performance expectation" and returns the node with the largest previous cost reduction.
- **Estimator (§4, Fig. 3, PDF pp. 6–8).** Inputs: a rules × operators matrix of optimizer-estimated cost reductions (0 where a rule doesn't apply), which operator uses which column, and per-column index flags and distinct-value ratios (§4.2.1, PDF p. 6). Attention over the rules learns their interactions, e.g. conflicts; fully connected layers mix in the column features and pick the best rule combination; a second attention layer and a ReLU output the estimated subsequent cost reduction (§4.2.2–4.2.4, PDF pp. 7–8).
- **Training (§4.3, PDF p. 8).** Slow queries are assembled randomly and generated with SQLSmith. Labels are costly ("months to run all rule combinations for 1K queries"), so queries are clustered (e.g., with DBSCAN, a density-based method) by cost vectors; 5% of each cluster get their optimal rewrite by enumeration, and the cluster's average cost reduction labels all its queries. The loss adds to the squared error a "Laplacian regularization term" that pulls predictions within a cluster together.
- **Parallel selection (§5, Def. 7, Fig. 4, PDF pp. 8–9).** Each round selects τ nodes of largest total utility with no ancestor–descendant pair, since selecting a node changes its ancestors' utilities. Greedy choice can miss the best set, so a bottom-up dynamic program computes it in time quadratic in τ and linear in the tree size.

## Results

Baselines (§6.1 "Baseline Methods", PDF p. 10): TopdownPostgre and TopdownCalcite (default top-down orders), Heuristic (match rules iteratively until none applies), Arbitrary (rewrite any operators until none can be).
- **Running example (§1, Fig. 1, PDF pp. 1–2).** The better order gives "over 600x speedup than PostgreSQL that rewrites q in a top-down manner".
- **Main comparison (§6.2, Figs. 5–7, PDF p. 10).** It reports the lowest execution cost and query latency on 1 GB TPC-H, JOB and XuetangX. On TPC-H, overall latency is "over 46.9% less than TopdownPostgre, 52.3% less than TopdownCalcite, 80.9% less than Arbitrary, and 19.9% less than Heuristic"; the summary gives "37.5% latency reduction on TPC-H, 30% on JOB, and 29.3% on XuetangX". The authors credit TPC-H's many removable subqueries for its larger gain than on JOB.
- **50 GB TPC-H averages (Tab. 4, PDF p. 10).** Query latency 224.5 s against 331.7 s (Heuristic) to 553.2 s (Arbitrary); rewrite latency 6.1–69.8 ms against 0.3–3.9 ms for TopdownPostgre. It "took the highest rewrite latency, but achieved the lowest overall latency".
- **Exploration (§6.3.1, Fig. 8, PDF pp. 10–11).** Larger γ raises rewrite latency and lowers query latency up to γ = 1.4 × 10⁵, chosen for slow queries; fast queries could use a smaller one (e.g., around 2 × 10⁴).
- **Search (§6.3.2, Fig. 11, PDF p. 11).** MCTS beats best-first and depth-first search with the same estimator.
- **Estimator (§6.3.3, Fig. 9, PDF p. 11).** Accuracy "over 29% higher than Rewrite(S)", which samples orders and costs them with a deep network; enumerating all orders takes "much longer rewrite time (e.g., over 2000ms)", while the model "can give relatively accurate results within 10ms".
- **Parallel (§6.3.4, Fig. 10, PDF pp. 11–12).** Multi-node selection cuts search time; the dynamic program beats greedy top-τ and single-node selection on query latency.
- **Scaling (§6.4, Figs. 12–13, PDF p. 12).** With 10 to 80 rules, its TPC-H latency falls as rules are added and JOB's stays "relatively stable"; it does better as operators grow.
- **Deployment (§2.3, PDF p. 4).** It "has been applied in openGauss", a database.

## Limits the authors state

- Subsequent cost reduction is estimated "because we cannot actually rewrite all the descendant nodes and derive the optimal one" (§3.1, PDF p. 4).
- "there are many noises in the training data (i.e., we label the queries based on a small part of the queries)" (§4.3, PDF p. 8).
- A large tree may need hundreds of iterations, "not tolerable for queries that require to be answered within milliseconds" (§5, PDF p. 8).
- "High rewrite latency may slow down the overall latency, especially for relatively simple queries in OLTP workloads" (§6.1, PDF p. 9).
- One network per dataset (§6.1, PDF p. 9); it "can generalize to any queries on the same dataset" (§6.2, PDF p. 10).
- "the methods had similar performance when the operator number was small (e.g., less than 5)" (§6.4.2, PDF p. 12).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "Our system was open-sourced and publicly available on Github" (§6.1, PDF p. 9).
- **To reuse it:** a rule library with per-application optimizer cost estimates (§4.2.1, PDF p. 6); generated slow queries labelled by enumeration (§4.3, PDF p. 8); PyTorch, an 11 GB GPU, 2 epochs (§6.1, PDF p. 9).
- **Beyond its domain:** not claimed.

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/qo-learned">qo-learned</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a></span>
