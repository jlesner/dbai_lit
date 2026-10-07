# RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution

**RoboPhD** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2601.01126) · [arXiv](https://arxiv.org/abs/2601.01126)  
Code: [RoboPhD](https://github.com/andborth/RoboPhD)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An evolution agent rewrites a text-to-SQL agent (a database-analysis script and SQL-generation instructions) from performance feedback, with ELO-based selection (abstract).
- Starts from a 70-line baseline agent; evaluated on BIRD (abstract).
- Agent evolution for SQL without training, with compact models: it reports its largest gains on cheaper models, +8.9 points over a naive Claude Haiku against +2.3 over Opus 4.5 (abstract), which bears on [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy).

## In plain words

Turning English questions into database queries usually needs prompts and tools that experts tune by hand; the authors ask whether an AI agent can do that research itself, with no text-to-SQL advice from them (§1). RoboPhD hands a coding agent (Claude Code) a trivial 70-line starting system and the training databases of BIRD, a benchmark of questions over real databases. Each round, it reads earlier versions' mistakes and writes a new version: a Python script that summarizes each database in advance, and instructions for the model that writes the SQL. Versions compete on small random samples of questions, and a chess-style rating keeps score across rounds (abstract, §3). On BIRD's development set the evolved system gains most with the cheapest model (Claude Haiku 4.5: 57.2% to 66.1% correct) and least with the strongest (Opus 4.5: 69.0% to 71.3%); on BIRD's official test set, with Opus 4.5, it scores 73.67% against 72.16% for the starting system (§4). The authors present the rating-based selection as the "First application of ELO ratings for evolutionary prompt/agent optimization" (§1), ELO being that chess rating.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [self-consistency](#/glossary/self-consistency-majority-voting) · [Elo rating](#/glossary/elo-rating) · [evolutionary algorithm](#/glossary/evolutionary-search)

**The paper's own terms:**
- **Evolution agent** (also "Evolution AI", "evolutionary agent"): Claude Code, Anthropic's coding-agent tool, running Claude Sonnet 4.5 or Opus 4.5; it writes each new agent version (§3.1, §3.2.4).
- **Agent** (also "agent package"): what is evolved, two artifacts (§3.2.1): the **Database Analysis Tool**, a deterministic Python script that reads a SQLite database (schema and rows) before any question is seen and writes a text report; and the **Eval Instructions**, guidance for the SQL-writing model, which never sees the schema directly, only the report.
- **Naive agent**: the starting point and baseline: a 50-line script that "only dumps raw DDL schema statements" (the table definitions) plus about 20 lines of instructions (§3, §4.2; in full in App. E).
- **Tool-only execution**: the report comes from the script alone, with no LLM call (§3.2.2).
- **Evidence**: BIRD's per-question hint field, which supplies "hints about the domain/schema and clarifications for the question" (§3.2.3).
- **Cross-pollination**: the main evolution strategy, a hand-written prompt (about 240 lines) telling the evolution agent to combine the best techniques of top-scoring agents and fix the round's error patterns (§3.2.4, App. C).
- **Deep Focus**: before entering the competition, a new agent is tested against earlier rounds' agents on their questions and refined in the same session; `k` test rounds, default 1 (§3.2.4).
- **Universal verification**: the model sees its query's result and replies `CORRECT` or with a better query, up to 2 times, plus one extra retry on an error or empty result (§3.2.3).
- **"skip a tier"**: the authors' name for deploying an evolved cheaper model in place of a naive more expensive one (abstract, §4.2).

**Missing glossary terms:**
- **Non-transitivity**: A beats B and B beats C on some samples, yet C beats A on another, as in rock-paper-scissors (§3.2.5).

**Builds on:**
- Prompt optimizers APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), TextGrad (cited in its *Nature* version; the collection holds the preprint, [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")) and ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")): these optimize prompts, RoboPhD whole agents; its use of earlier agents' errors is likened to TextGrad's "text gradients" (§2.1).
- Evolutionary algorithms for architecture search and hyperparameter tuning, which the authors "extend" to whole agents (§2.1).
- Elo ratings and Chatbot Arena (a crowd-voted LLM leaderboard), which use ratings "for passive evaluation and ranking", not selection (§2.1).
- Hand-designed BIRD leaderboard systems, among them CHASE-SQL, XiYan-SQL, CSC-SQL ([CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)")) and CHESS, whose manual design the authors contrast with their "autonomous discovery" (§2.1).

## Problem and setting

- **Question:** can an AI agent, from a trivial start and with only process-level guidance (no author-written text-to-SQL techniques), build a strong text-to-SQL agent (§1, §3.1)?
- **Data:** BIRD, a "large-scale cross-domain dataset with 69 training databases and 11 development databases" (§4.1); evolution uses only the training set (§3), 5 databases and 30 questions each per round, to prevent overfitting (§3.2.6).
- **Models:** SQL is written by Claude Haiku 4.5, Sonnet 4.5 or Opus 4.5 through the Claude API; evolution runs in Claude Code with Sonnet 4.5 or Opus 4.5 (App. A.1). What evolves is the two artifacts (§3.2.1).
- **What counts as correct:** BIRD's "set-based comparison (row order ignored, exact match required)" (§3.2.5); returning extra columns counts as a failure (§3.2.3). Databases and SQL are SQLite (App. E).
- **Deployment constraint, set by the authors:** one fixed report per database, made without seeing questions, fitting Claude's 200K-token context (§3.2.2, §4.3).
- NULL handling and duplicate rows: not discussed.

## Approach

- **The loop (Alg. 1, Fig. 2):** each round, three agents (the last winner, the newly evolved agent, and one picked at random from the top two by rating) answer the same sampled questions. The three-way result is split into three head-to-head results, and ratings are updated (§3.2.5–3.2.6).
- **Why ratings (§3.2.5):** agents joining at different times are compared fairly; non-transitive results are absorbed; and win/loss scoring normalizes for sample difficulty, since "accuracy commonly swings from 60% to 80% on different database samples" while rankings on the same sample stay stable.
- **Late rounds (App. D):** from round 12, some rounds evolve nothing and test 4 existing agents.
- **At answer time (§3.2.3, §5.1):** the prompt is the analysis report, then the instructions, the question and BIRD's evidence, joined end to end; universal verification follows. The authors contrast this with systems that generate many candidates and vote (self-consistency), citing OpenSearch-SQL (§3.2.3).
- **What evolution produced (§4.3):** the best agent, `iter18_hybrid_comprehensive_analyzer`, came from round 18 by combining three parents. Its roughly 1000-line script writes a 10-part report (schema, sample values, key relationships, value lists, formats, per-database pitfalls and more) and cuts detail as databases grow, from 10 sample values per column to 1 above 400 columns (Tab. 3); large databases "previously caused 0% accuracy due to context overflow". Its 527-line instructions include rules on returning only the requested columns, reading the evidence field, exact string matching, percentages, and `LIMIT 1` only for superlatives (§3.2.3, §4.3).

## Results

- **Development set, naive against best evolved (Tab. 1):** Opus 4.5 69.0% → 71.3%, Sonnet 4.5 65.7% → 69.2%, Haiku 4.5 57.2% → 66.1%. The authors read this as gains shrinking as models get stronger, and suggest stronger models "already capture much of what can be learned through prompting and tooling" (§4.2). Evolution raises cost per query (Haiku 0.34¢ → 0.51¢), yet evolved Haiku beats naive Sonnet, and evolved Sonnet naive Opus, at lower cost (§4.2).
- **Official test set, Opus 4.5, run by the BIRD team (Tab. 2, App. A.5):** 72.16% → 73.67% overall; by difficulty, simple questions 81.35% → 81.03%, moderate 68.65% → 70.45%, challenging 48.42% → 55.44%. They report this places RoboPhD "16th overall on the BIRD leaderboard as of December 2025" (§4.2).
- **The best agent's parents** had "each reached 76% training accuracy on the 17th iteration" with different approaches (§4.3).
- **Design comparisons (§3.2.2, §3.2.4):** tool-only analysis beat LLM-only and hybrid analysis, at $0.00 per database against $0.50; against refinement, research-driven and error-focused strategies, "cross-pollination with tool-only emphasis consistently produced our strongest agents"; of `k` from 0 to 3, one Deep Focus round "provides meaningful refinement opportunities".

## Limits the authors state

- The system is "well short of a full self-improving system" (§1) and "operates within the bounded domain of database queries" (§6).
- The fixed per-database report is a constraint the authors imposed; "An alternate architecture which allowed for dynamic per-question analysis might yield higher accuracy", at the cost of harder deployment (§4.3).
- Overly long instructions "can be counterproductive", and may use up "too much of Claude's 200K token limit" (§3.2.3).
- Reruns may differ: "small variations in one iteration, may lead to amplified differences in subsequent iterations" because of uncontrollable API non-determinism (App. B).
- Generated code runs "without human review", "an open challenge for autonomous AI systems"; evolved tools "could potentially be manipulated by adversarial inputs", so production needs sandboxing and audits (Ethics Statement).

## Open problems and building blocks

  - Evolving the hand-written evolution strategies themselves ("meta-evolution"), left out of the paper "due to insufficient experimental evidence": preliminary results "remain ambiguous", and it may mainly help runs longer than 30 rounds (§5.2, §3.2.4, App. A.2).
  - A middle ground between script-only and LLM analysis: scripts that call the LLM where meaning matters, such as "inferring implicit relationships or disambiguating column purposes" (§5.2).
  - Other benchmarks: Spider 2.0 (enterprise-scale databases) and BIRD-Critic (fixing wrong SQL) (§5.3).
  - A research-driven strategy (the evolution agent reads papers), likely "superseded by meta-evolution" (§5.2).
- **Released:** the code, open-sourced (§1, §6, App. B); rerunning it reproduces "agents similar to the ones featured" (App. B).
- **To reuse it:** Claude Code with Sonnet or Opus 4.5 for evolution and the Claude API for SQL writing (App. A.1); one round with Haiku writing SQL costs about $2 and 22 minutes, and a 30-round run about 12% of a Claude Max plan's weekly quota, on a laptop or an 8-vCPU VM (§4.1). Deployment needs only the script (run once per database), the instructions and the verification step, not Claude Code (§5.1).
- **Beyond its domain:** the authors "would expect RoboPhD to generalize beyond Text-to-SQL", code generation being "particularly promising" (§5.3); the offline/online split "generalizes to other tasks with similar structure" (§1).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a></span>
