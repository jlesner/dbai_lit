# CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning

**CSC-SQL** · Findings of IJCNLP-AACL 2025

Read: [PDF](https://arxiv.org/pdf/2505.13271) · [arXiv](https://arxiv.org/abs/2505.13271) · [DOI](https://doi.org/10.18653/v1/2025.findings-ijcnlp.91)  
Code: [csc_sql](https://github.com/CycloneBoy/csc_sql)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Takes the two most frequent sampled SQL outputs and has a merge-revision model correct them.
- GRPO fine-tunes both the generator and the reviser on execution rewards.
- Self-consistency plus RLVR on SQL (borderline, kept as Adjacent).

## In plain words

Systems that turn a question into an SQL query often sample many candidate queries from an LLM, run them, and return the one whose result comes up most often (majority voting). The authors argue that the vote may pick a wrong query despite its majority, and that asking a model to correct a single query "typically addresses only syntactic errors" (abstract). Their method, CSC-SQL, runs the vote, gives the two most-voted queries and their results to a second "merge revision" model that writes new candidates, and votes again among those. Both models are trained by trial and reward (reinforcement learning), rewarded when a query returns the same result as the benchmark's reference query. On the development set of BIRD, a text-to-SQL benchmark over large real databases, they report gains of 0.72 to 5.54 accuracy points over plain voting for the same model and sample count (§1, §3.2). On BIRD's hidden test set they report 71.72% accuracy with a 7B model and 73.67% with a 32B model (abstract). They present it as "a novel method that integrates Self-Consistency and Self-Correction" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [pass@k](#/glossary/passk) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [test-time scaling (TTS)](#/glossary/test-time-scaling) · [self-correction](#/glossary/self-correction)

**The paper's own terms:**
- **SC**: Self-Consistency, the majority vote over candidate queries grouped by their execution results; **self_consistency@k** is its accuracy with k candidates (Fig. 1 caption, §1).
- **CSC**: Corrective Self-Consistency, the paper's method; **correct_self_consistency@k** is its accuracy (Fig. 1 caption).
- **major_top2_pass@k**: a metric the authors propose, which "calculates pass@k based only on the top two voting groups, determined by SQL execution results" (§1); the authors say it "mitigates the gap between self_consistency@k and pass@k" (§1, Fig. 1).
- **SQL generation model** and **merge revision model**: the model that samples the candidates, and the second model that revises the top two (§2, Fig. 2).
- **n (G size) and m (R size)**: the number of samples from the generation model and from the merge revision model (Tab. 2 caption); §2 writes N and M.
- **Merge-Revision template**: the revision prompt, holding the schema, the question, two draft queries and their execution results (§2, App. F.2), taken from BASE-SQL (§1).
- **top k group size**: how many vote groups go into the template; 2 is the default, 1 is "standard revision mode, where each example is corrected individually" (App. D.2).
- **EX**: execution accuracy, the evaluation metric (§3.1).
- **GRPO rows**: models post-trained with GRPO, against rows marked "-" without it (Tab. 1).

**Builds on:**
- Self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), the voting step CSC runs twice (§1, §2).
- BASE-SQL (Sheng et al., 2025, by the same first two authors; not listed here), for the Merge-Revision template (§1, §2).
- GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")) with an execution reward and a format reward, following the SQL RL works Reasoning-SQL, SQL-R1 and Think2SQL (not listed here) (§1, §2).
- Fine-tuned selection models that pick among candidates instead of voting (CHASE-SQL, XiYan-SQL, MSc-SQL; not listed here), which the authors contrast: "training effective selection models requires high-quality labeled data, which is currently scarce" (§1).

## Problem and setting

- **The question:** can giving the two most-voted candidates to a trained reviser beat plain majority voting in text-to-SQL, for the same generation model and number of samples (§1, §3.2)?
- **Motivation (§1, Fig. 1):** with Qwen2.5-Coder-7B-Instruct at temperature 0.8 on BIRD dev, the gap between self_consistency@k and pass@k "widens as the number of candidates increases".
- **Benchmarks:** BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), with its development set of 1,534 questions (App. D.4) and its private test set; and Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), a cross-domain text-to-SQL benchmark), dev and test, using the models trained on BIRD "without retraining a new model" (App. D.1).
- **Models:** 11 open-source LLMs (App. B): the code models Qwen2.5-Coder at 3B, 7B, 14B and 32B; XiYanSQL-QwenCoder at 3B, 7B and 32B (base models from the XiYan-SQL work, §3.3); OmniSQL-7B; and the general-purpose models Meta-Llama-3.1-8B-Instruct, Meta-Llama-3.1-70B and gemma-3-12b-it (Tab. 1). GRPO trains four generation models and two merge revision models, Qwen2.5-Coder-3B-Instruct and Qwen2.5-Coder-7B-Instruct (App. B). The 3B generators use the 3B reviser, all others the 7B one (Tab. 1 caption).
- **Defaults:** "Unless otherwise specified", temperature 0.8 and 8 merge revision samples, with "the average performance over three runs for each experimental setting" (§3.1).
- **What "correct" means:** a query is correct when its execution result matches the gold query's on the benchmark database, for both the reward and the evaluation (§2, §3.1). Queries are SQLite (App. F). How results are compared (row order, duplicates) and NULLs are not discussed.

## Approach

- **Sampling responses (§2, Fig. 2):** the generation model samples n candidate queries; they are run, grouped by execution result, and the groups ranked by size.
- **SQL merge revision (§2):** if the candidates agree, the answer is output directly. Otherwise the top two groups' queries and their execution results fill the Merge-Revision template; the merge revision model samples m revised queries, and a second majority vote over them picks the output. The prompts are in App. F.
- **Reinforcement training (§2, Eq. 1–3):** both models are trained with GRPO. The reward is 1 for a query whose execution results match the gold query's, plus 0.1 times a format reward of 1 when the output puts its reasoning in think tags and its answer in answer tags.
- **Revision training data (§2):** on the BIRD training set, Qwen2.5-Coder-7B-Instruct and its GRPO-trained variant sample eight candidates; the two largest vote groups form the merge revision examples.
- **Schema in the prompt (App. B):** CREATE TABLE statements with column descriptions, representative values and question-relevant values in comments, following OmniSQL (a text-to-SQL work that fine-tunes models on "high-quality rationales", App. A).

## Results

- **CSC against SC on BIRD dev (Tab. 1, §3.2):** "For the same model and samples size n", the authors report that CSC "consistently outperforms" SC, by 0.72 to 5.54 points, across 15 model and training rows and n from 4 to 64. "In most models", the gain grows with n (§3.2, Fig. 1).
- **GRPO (§3.2):** it "generally improves EX" under both methods, but its benefit shrinks as n grows: for Qwen2.5-Coder-7B-Instruct, +2.77 (SC) and +2.68 (CSC) points at n=8, against +1.70 and +0.49 at n=64.
- **Smaller with CSC against larger with SC (§3.2, Tab. 1):** at n=64, Qwen2.5-Coder-7B-Instruct with CSC (68.70) is reported above the 14B (67.19) and 32B (68.67) models with SC; the authors read this as "efficiency benefits of CSC".
- **Against other systems (§3.3, Tab. 3, App. C):** on the BIRD test set, the 32B model (base XiYanSQL-QwenCoder-32B-2412) reaches 73.67%, which the authors report as "surpassing all other methods using open source models" and 4.64 points above its base model; the 7B model (base Qwen2.5-Coder-7B-Instruct) reaches 71.72%, "surpassing all other methods using the same base model". App. C reads the remaining gap to CHASE-SQL, which uses the closed Gemini-1.5-Pro, as a gap "between open-source and closed-source LLMs".
- **What drives the gain (§3.4, Tab. 2):** a merge revision model without GRPO "often results in degraded performance"; with a single revision sample and no second vote, the GRPO-trained one "still demonstrates strong error correction capabilities". Once m reaches 4–16, reviser size and m have "minimal impact"; the authors take this to suggest that "the primary factor influencing CSC performance is the number of samples generated by the SQL generation model", because more samples make it likelier that a right query is among the top two (major_top2_pass@k, Fig. 1).
- **Group size (App. D.2, Tab. 5):** on BIRD dev with m=8, passing two groups works best; one group gives "limited improvement and, in some cases, performance degradation".
- **Spider (App. D.1, Tab. 4):** with the BIRD-trained 3B models, the authors report that CSC "consistently outperforms" SC, which they read as "strong generalization ability" of the reviser.
- **Difficulty (App. D.3, Tab. 6):** CSC is reported above SC at all three BIRD difficulty levels.
- **Cost (App. D.4, Tab. 7):** on one rented H800 GPU (about $2.0 per hour), the share of time added by revision falls as n grows; with the 32B generator at 16 candidates, revision adds "only about 7%" of time, at $0.0014 per question.
- **Temperature (App. D.5, Fig. 3):** lower temperatures give lower scores through less diversity; 0.8 and 1.0 differ little, and 0.8 is adopted.

## Limits the authors state

- "The CSC-SQL method requires more computational resources than the standard Self-Consistency approach", since merging and correction follow the sampling (§5).
- "CSC-SQL relies on sufficient diversity among sampled results; if the model generates mostly consistent outputs, the CSC-SQL method may not yield significant performance improvements" (§5).
- The failure cases show "that the merge revision model also has certain limitations and does not work in some situations" (App. E.2).
- A merge revision model without GRPO training shows "limited error correction capability" (§3.4).

## Open problems and building blocks

- **Open:** integrating Adaptive Self-Consistency and Soft Self-Consistency (cited for sampling efficiency) "to improve the efficiency of parallel sampling" (§4, §5); using CSC-SQL in other text-to-SQL systems "as a replacement for the Self-Consistency component" (App. C); analysing the failure cases "to improve the merge revision model" (App. E.2).
- **Released:** the code, which "has been open sourced" (abstract).
- **To reuse it:** the experiments use open-source models from 3B to 70B; GRPO through the TRL library, one epoch, six completions per prompt, on four 80 GB GPUs, with vLLM for inference (App. B); a training set with gold queries and databases to execute against (§2); SQLite prompts (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
