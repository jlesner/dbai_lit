# A State-of-the-Art SQL Reasoning Model using RLVR

**A State-of-the-Art SQL Reasoning…** · (Databricks), preprint 2025

Read: [PDF](https://arxiv.org/pdf/2509.21459) · [arXiv](https://arxiv.org/abs/2509.21459)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A simple RLVR recipe for BIRD: prompt and model selection (GEPA mentioned), offline RL warm-up, then online RLVR.
- BIRD training set only, no proprietary models.
- The execution-match reward that an equivalence checker could replace (cf. [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)")) (borderline, kept as Adjacent: text-to-SQL RLVR without equivalence checking).

## In plain words

Text-to-SQL means turning an English question into a database query. The authors argue that off-the-shelf LLMs can struggle with bespoke enterprise tasks, such as using an organization's own terms, and that reinforcement learning (training by trial and reward) with rewards a program can check gives "one way to address this" (§1). They fine-tune an open-source 32-billion-parameter coding model on the training set of BIRD, a text-to-SQL benchmark. The recipe: choose model and prompt carefully, warm up with TAO, Databricks' method that learns from batches of answers already generated and scored, then train on fresh answers, rewarding queries whose result matches the reference query's and penalizing syntax errors. On BIRD's hidden test set, they report 73.56% with one answer per question and 75.68% with a vote over seven sampled answers, against 71.83% and 74.79% for the next single-model leaderboard entry in each category as of September 15, 2025 (abstract, §4). They present this as state-of-the-art accuracy reached with "our very first submission", using "no additional training data beyond the BIRD training set and no use of proprietary models" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [self-consistency](#/glossary/self-consistency-majority-voting) · [offline and online RL](#/glossary/online-and-offline-rl)

**The paper's own terms:**
- **RLVR**: as this paper puts it, RL fine-tuning of a pre-trained LLM "where the reward function measures an objective truth without needing any parametrized reward models" (§2).
- **Evidence**: BIRD's per-question field "providing additional instruction"; the authors merge it with the question into one user query (§2).
- **Accuracy (exact-match)** (the column header of Tab. 1–2): the captions call it "exact-match execution accuracy", BIRD's 0-1 check that the generated and gold SQL return matching outputs (§2). It is not a match of the query text.
- **TAO (Test-time Adaptive Optimization)**: "an offline RL approach pioneered at Databricks" (§3). Its role here is to "warm start the model for RLVR training by providing it with a good inductive bias" (§3).
- **Databricks-RLVR-32B**: the authors' name for their full model, Qwen2.5-32B-Coder-Instruct fine-tuned with TAO and RLVR (§4.1).
- **Test-time computation**: "any approach that spends more inference compute at test time to improve a model's performance" (§2); here, self-consistency.
- **Leaderboard categories**: Tab. 1 is the "single-model, single-call category (i.e., no self-consistency)", Tab. 2 the "single-model category with self-consistency"; the leaderboard bins the number of sampled responses as "few" (1–7), "many" (8–32) and "scale" (more than 32) (Tab. 2 caption).

**Builds on:**
- RLVR, cited to Tülu 3 ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)")) and other work, and GRPO from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which the authors' RLVR service is said to improve on (§1–3).
- TAO, Databricks' earlier offline RL method (§1, §3).
- Recent RL-trained text-to-SQL models, SQL-R1 and Arctic-Text2SQL-R1: "our work builds on this trend" (§5); Arctic-Text2SQL-R1-32B is also the next entry after the authors' model in Tab. 1.
- OmniSQL (a text-to-SQL study not listed here), whose prompt was the "good starting point" and whose best base model the authors' model choice matches (§3).

## Problem and setting

- **Question:** how to fine-tune an LLM for text-to-SQL with RLVR (§2), shown on BIRD; the authors motivate it with enterprise tasks that need organization-specific knowledge (§1).
- **Benchmark:** BIRD, with a train set of 9,428 examples, a dev set of 1,534 and a private test set of 1,789 (§2). Each example has a question, evidence, a database of several tables and a gold SQL query. The test set "is not publicly available", which the authors say avoids [data contamination](#/glossary/data-contamination) concerns (§2).
- **Data use:** training on the BIRD train set only, with the dev set for model and hyperparameter selection; "We do not use any additional training data" (§2).
- **What counts as correct:** BIRD's "strict 0-1 metric": both the gold and the generated SQL are run on the database and their outputs must match (§2).
- **Model:** Qwen2.5-32B-Coder-Instruct, an open-source 32-billion-parameter coding model, prompted to write a reasoning trace with the SQL marked by delimiters (§2–3).
- **Comparisons:** leaderboard results used directly, "current as of September 15th, 2025" (§4.1 footnote).
- How outputs are compared (row order, duplicates, NULLs) and which SQL engine runs the queries: not discussed.

## Approach

The recipe has four steps (§1, Fig. 1, §3):
1. **Prompt and model selection (§3).** The authors evaluated open-source and closed-source models on several prompts on BIRD dev (Fig. 2, greedy decoding except for O1 and O3-mini). Qwen 2.5 32B Coder Instruct gave the best dev score. The prompt starts from OmniSQL's, with two changes: a different encoding of the database, and added instructions to elicit reasoning, because "in our early study we found that the model was often not generating any reasoning trace" (§3). The introduction adds that the prompt "can be chosen using prompt optimization approaches such as GEPA" (§1; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")).
2. **Verifiable reward (§3 "Verifiable Reward").** BIRD's 0-1 execution metric, plus a penalty of −1 for syntactically incorrect SQL, used in both training stages. On [reward shaping](#/glossary/reward-shaping), the authors write that their "preliminary investigation using reward shaping did not yield any significant improvements".
3. **TAO warm-up (§3 "TAO Training").** One iteration generates several responses per training example with the current model, scores them with the reward, and runs TAO's offline RL on the collected set; "This entire procedure can be repeated multiple times". They used only "limited TAO training" (§4.1).
4. **Online RLVR (§3 "RLVR Training").** Run on the best TAO model with Databricks' fine-tuning service, which the authors say "performs several improvements on top of known state-of-the-art RLVR approaches such as GRPO", which "address various efficiency concerns such as ensuring the training focuses on challenging problems and to avoid reward saturation". From a hyperparameter sweep, "in general" a lower learning rate and a lower KL-divergence coefficient were desirable, and removing the KL term entirely "did not significantly hurt the performance".

At inference, self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")): 7 responses from Databricks-RLVR-32B and "a parameter-free weighted majority vote based approach to pick the best response" (§4.2).

## Results

All on BIRD, with leaderboard numbers as of September 15, 2025:
- **Single model, one call (Tab. 1, §4.1):** Databricks-RLVR-32B scores 73.56% on the test set against 71.83% for Arctic-Text2SQL-R1-32B, the next entry; the caption says the full method "achieves the best test accuracy".
- **Each stage on dev (Tab. 1):** base model 64.80%, with TAO 67.40%, full model 70.80%. TAO alone "would have placed it in the top 10 on the leaderboard by dev set performance" at the time of writing (§4.1).
- **Dev to test:** the authors read the rise from 70.80% to 73.56% as "stronger generalization than other top submissions" (§4.1).
- **Single model with self-consistency (Tab. 2, §4.2):** 75.68% on test with 7 responses, against 74.79% for Sophon-Text2SQL-32B (another BIRD leaderboard entry) in the 8–32 responses bin; the authors call it "state-of-the-art results in the BIRD single-model category" with "fewer LLM calls (7) than the next best submission (8–32)". They say the benefits of RLVR and self-consistency are complementary (§4.2).
- **Base models (Fig. 2, §3):** Qwen 2.5 Coder Instruct has the highest dev score among the models tried; the authors write that proprietary LLMs "do not do as well as Qwen and Llama on this task".
- **Examples (§7.2):** two successes and one failure, where the model took the type from the foreign_data table instead of the cards table, "even though the names are confusing", and "forgot to apply distinct".

## Limits the authors state

- "BIRD is only a proxy task" (abstract).
- TAO training was kept limited "since our preliminary experiments showed that over-training led to less overall gains in the later online RL stage" (§4.1).
- O1 and O3-mini were not run with greedy decoding, since they "only permit temperature based decoding" (Fig. 2 caption).

## Open problems and building blocks

- **Open:** why proprietary models trailed open ones in their model survey: "We leave further investigation of this for future work" (§3). More broadly, "An important current challenge is applying RLVR to complex enterprise tasks such as business analysis and data science workflows" (§2).
- **Released:** Nothing stated for code, data or models. The conclusion says the approach "will be rolling in our new Agent Bricks product" and "will be available to Databricks customers" (§6).
- **To reuse it:** Qwen2.5-32B-Coder-Instruct, the BIRD train set, Databricks' TAO and RLVR fine-tuning services (§3), and 7 samples per question at inference for the self-consistency result (§4.2).
- **Beyond its domain:** the authors say "the simplicity of our framework makes it broadly applicable to enterprise domains such as business intelligence, data science, and coding" (abstract; also §6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
