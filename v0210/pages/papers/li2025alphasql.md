# Alpha-SQL: Zero-Shot Text-to-SQL using Monte Carlo Tree Search

**Alpha-SQL** · ICML 2025

Read: [PDF](https://arxiv.org/pdf/2502.17248) · [arXiv](https://arxiv.org/abs/2502.17248)  
Code: [Alpha-SQL](https://github.com/HKUSTDial/Alpha-SQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Zero-shot text-to-SQL by MCTS over seven fixed SQL-construction actions (Table 1), each carried out by an LLM prompt (§4.1).
- Self-supervised reward from consistency of sampled results.
- Search over generations applied to SQL (borderline, kept as Adjacent).

## In plain words

The task is turning an English question into an SQL query with an LLM never fine-tuned for it. The authors' motivation is that with new LLMs arriving every few months, fine-tuning "has become incredibly costly, labor-intensive, and error-prone", and must be repeated as newer LLMs emerge (abstract, §1). They build Alpha-SQL: the query is built step by step (pick the relevant tables, spot the values to filter on, write the query, fix it), with a tree search that tries many paths through these steps and spends more tries on branches that scored well. Each step is one LLM prompt. A finished query is scored by how many other sampled queries return the same result on the database. The headline: 69.7% of the questions in the development set of BIRD, a text-to-SQL benchmark, answered with the right result, using a 32-billion-parameter open model without fine-tuning, 2.5 points above the best earlier method in the same no-fine-tuning setting, which uses GPT-4o (abstract). The authors present it as "a novel approach" (abstract), a "plug-and-play" framework improving on earlier zero-shot results (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) · [self-consistency](#/glossary/self-consistency-majority-voting) · [execution accuracy](#/glossary/execution-accuracy) · [reward model](#/glossary/reward-model) · [MinHash and locality-sensitive hashing (LSH)](#/glossary/locality-sensitive-hashing-minhash)

**The paper's own terms:**
- **zero-shot Text-to-SQL**: building the question-to-SQL mapping "without task-specific labeled data", "relying solely on pre-trained knowledge and the provided database schema" (§3.1); in the abstract, "without task-specific fine-tuning".
- **partial reasoning state (node)** and **action (edge)**: a node holds the question, the schema and the reasoning steps so far; an edge is one SQL construction step; a path from the root to a leaf is a **reasoning trajectory** that yields one candidate query (§3.1–3.2, Fig. 2).
- **LLM-as-Action-Model**: the LLM carries out the action the search chose, given the question, the schema, all earlier steps on the path and that action's prompt, and its chain of thought is stored in the new node (§1, §4.1).
- **action space A1–A7**: Question Rephrasing, Schema Selection (picking the tables and columns the question needs), Column Value Identification, Column Function Identification (aggregates like COUNT, scalar functions like STRFTIME), SQL Generation, SQL Revision, Termination (§4.1, Tab. 1).
- **self-supervised reward**: the share of sampled queries whose execution result on the database equals that of the candidate query; it needs no labelled data, unlike trained "Outcome Reward Models" and "Progress Reward Models" (§3.2).
- **rollout**: one round of the four MCTS phases (§4.2).
- **UCT** (Upper Confidence Bound applied to Trees): the score used to pick a child during selection, the average reward so far plus a bonus for children visited rarely (§4.2).
- **SDS** (Subsampled Development Set): 10% of each database from the BIRD development set, taken from CHESS-SQL; 147 questions (81 simple, 54 moderate, 12 challenging) (§5.1).
- **upper bound accuracy**: "the percentage of samples where the candidate SQL set contains the correct SQL query before the final SQL selection" (§5.3).

**Builds on:**
- rStar (Qi et al. 2024), MCTS-based reasoning for LLMs: cited for the question-rephrasing action and for the intuition behind the reward, that consistent answers signal confidence (§2, §3.2, §4.1). Not on this site.
- CHESS-SQL (Talaei et al. 2024), an LLM text-to-SQL pipeline: chain-of-thought schema selection, the two-stage value retrieval and the SDS subsample (§4.1, §4.3, §5.1). Not on this site.
- CHASE-SQL (Pourreza et al. 2025), a multi-step pipeline that generates and checks candidate queries: its divide-and-conquer chain of thought for SQL Generation and its upper-bound measure (§2, §4.1, §5.3). Not on this site.
- Test-time computation, spending more search or sampling at inference without changing the model ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)"), Tree of Thoughts [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")): "Alpha-SQL builds on test-time computation principles" (§2); and MCTS with UCT (§1, §4.2).

## Problem and setting

- **Question:** how to get accurate SQL from an LLM without task-specific fine-tuning, given the difficulty of "transferring and generalizing knowledge from pre-trained LLMs to the specific task of SQL generation" (§1). The paper casts it as finding the best reasoning path in a search tree over query-construction steps (§3.1).
- **Database:** a relational database given by its tables, columns and relationships such as primary-key/foreign-key constraints (§3.1). The goal is a "syntactically and semantically correct" query (§3.1).
- **Correctness:** [execution accuracy](#/glossary/execution-accuracy), the share of predicted queries whose execution results are identical to those of the reference queries (§5.1).
- **Benchmarks:** the development sets of Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), 1034 question–SQL pairs; a cross-domain benchmark over many databases) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"), 1534 pairs over large real-world databases, which the paper calls more complex, with keywords like CASE and IIF) (§5.1). §5.3–5.5 use the SDS "To facilitate more comparison experiments while reducing computational costs" (§5.1).
- **Models:** Qwen2.5-Coder 7B, 14B and 32B (open-source code LLMs) as inference models (§5.2); Phi-4 as a second inference model in §5.4.
- SQL dialect and NULLs: not discussed.

## Approach

- **Search space (§3.1, §4.1).** Seven actions (A1–A7 above) with the order rules of Tab. 1, e.g. "the termination action must occur following either SQL Generation or SQL Revision actions". Each action may appear only once per path (§4.1 "Action Ordering and Constraints").
- **The actions (§4.1, prompts in App. A.2, Figs. 6–11).** Rephrasing splits the question into a list of conditions with few-shot prompting; Schema Selection uses chain-of-thought prompting, following CHESS-SQL; Generation uses CHASE-SQL's divide-and-conquer chain of thought; Revision gives the LLM the question, schema, failing query and its execution result, for several rounds until the query is valid or a cap N_revision is reached.
  - *Selection:* walk down from the root by highest UCT score, always trying unvisited children first.
  - *Expansion:* each valid action is sampled N_expansion times at temperature T_expansion, giving that many children per action. Redundant children are merged (e.g. samples of Schema Selection that pick the same schema subset become one node), which the authors say "significantly reduces the branching factor of the search tree without loss of information" (§4.2 "Pruning Strategies").
  - *Simulation:* keep selecting and expanding until a termination node.
  - *Backpropagation:* the action that produced the final query (A5 or A6) is sampled N_reward more times at temperature T_reward; the reward is the share of those samples whose result matches the predicted query's, and it is added to every node on the path. §1 adds that invalid sampled queries are filtered out.
- **Final selection (§4.2).** After N_rollout rollouts, all predicted queries are executed and the one with the highest execution-result consistency is returned, relying on "the convergent nature of Text-to-SQL: different reasoning paths yield equivalent SQL queries for a given question".
- **Database value retrieval (§4.3).** Offline, TEXT columns get MinHash signatures. Online, keywords are extracted from the question, which "can be guided by few-shot prompts" (App. A.3); LSH finds similar stored values, and these are filtered by edit similarity and by semantic similarity with OpenAI's text-embedding-3-large, then added to the schema prompt.
- **Settings (§5.2):** 24 rollouts; N_expansion = 3 at temperature 0.8; N_reward = 5 at temperature 1.0; N_revision = 10.

## Results

- **BIRD dev (§5.2, Tab. 2).** It reports 66.8% (7B), 68.7% (14B) and 69.7% (32B) against 67.2% for RSL-SQL, a zero-shot method on GPT-4o. The authors call the 7B result "comparable to the performance of RSL-SQL" and the 32B result "superior performance in the zero-shot scenario". Among fine-tuned methods, they say it is exceeded only by CHASE-SQL (which fine-tunes Gemini-1.5-Flash as its selection model) and XiYan-SQL (which fine-tunes a model the paper lists as unknown).
- **Spider dev (§5.2, Tab. 3).** With the 14B model the authors say it "outperforms existing methods", with 87.0%, 2.1 points above SFT CodeS-15B, a 15B model the authors describe as "specifically fine-tuned for the Spider dataset".
- **Fig. 1 (§1)** claims gains across Qwen2.5 sizes 7B–32B without fine-tuning, "surpassing even GPT-4o based zero-shot Text-to-SQL SOTA (RSL-SQL)" on BIRD dev.
- **Model size (§5.2, Fig. 4).** The authors say it shows Alpha-SQL "enabling smaller models, such as the 7B and 14B versions, to achieve accuracy comparable to or surpassing much larger models, including GPT-4o-based approaches".
- **Rollouts (§5.3, Fig. 5).** On the SDS with the 7B model, from 4 to 24 rollouts, they report "a positive correlation" between the number of rollouts and both upper-bound and final accuracy. They count "over 3000 possible reasoning paths for each text-to-SQL task" from Tab. 1, and say it "achieves significant performance improvements with just 24 MCTS rollouts", "suggesting" it can explore much larger search spaces efficiently.
- **Plain LLMs (§5.4, Tab. 4).** General LLMs (e.g. GPT-4o, DeepSeek-V3) and reasoning-optimized ones (e.g. DeepSeek-R1, Gemini-2.0-Flash-Thinking-Exp, which the paper calls "a sophisticated reasoning-optimized model") are prompted directly with "a standardized Text-to-SQL prompt" (App. A.4) on the SDS. Alpha-SQL with the 7B model "surpasses all baseline models in performance". It lifts Qwen2.5-Coder-7B from 47.6% to 64.6% (+17.0) and Phi-4 from 43.5% to 60.0% (+16.5). The authors read this as showing "that the Text-to-SQL task requires targeted reasoning optimization".
- **Ablation (§5.5, Tab. 5).** Removing A1, A2, A3, A4 or A6 one at a time on the SDS lowers accuracy by 0.4 to 1.8 points; the authors conclude "removing any action from the original action space negatively impacts performance". The largest drop is for SQL Revision, which they take as "highlighting the importance of database execution feedback for Text-to-SQL tasks".

## Limits the authors state

None stated.

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the code (abstract).
- **To reuse it:** an LLM as inference model (tested with Qwen2.5-Coder 7B–32B and Phi-4, §5.2, §5.4); the ability to execute queries on the database (§3.2, §4.1); MinHash preprocessing of the TEXT columns and OpenAI's text-embedding-3-large for value matching (§4.3). The authors ran the open models locally on 8 GPUs with 80GB of memory each (§5.1).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
