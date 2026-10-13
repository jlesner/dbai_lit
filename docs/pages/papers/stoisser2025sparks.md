# Sparks of Tabular Reasoning via Text2SQL Reinforcement Learning

**Sparks of Tabular Reasoning** · Table Representation Learning Workshop (ACL) 2025

Read: [PDF](https://arxiv.org/pdf/2505.00016) · [arXiv](https://arxiv.org/abs/2505.00016) · [DOI](https://doi.org/10.18653/v1/2025.trl-1.20)  
Code: [sparks_of_tabular_reasoning](https://github.com/josefastoisser/sparks_of_tabular_reasoning)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains two 7–8B models on text-to-SQL only (§4.1), then tests whether the gain carries over to answering questions over tables (CRT-QA) with no SQL output required (§1, Fig. 1, §4.5).
- Supervised fine-tuning of a 4-bit distilled LLaMA 8B and Qwen-7B-Instruct on o3-mini chain-of-thought traces for the Clinton text-to-SQL collection, filtered by an LLM verifier, then GRPO on BIRD with string-match, per-clause F1 and two o3-mini-judged rewards (§3, §3.2.2, §4.1); o3-mini also grades the text-to-SQL scores "as a proxy for execution" (§4.1) and the CRT-QA answers (Limitations).
- Evidence on near transfer in weight space from a SQL training task to table QA: the authors report a relative 33.9% gain in tabular reasoning accuracy for the distilled-quantized LLaMA model (abstract; Tab. 1). The training signal is string- or LLM-based rather than an execution match (§3.2.2; App. C's "execution-guided rewards computed via SQLite" contradicts it), and the evaluation is an LLM proxy (§4.1).

## In plain words

The authors note that text-to-SQL, turning a question into a database query, "is frequently treated as a standalone task", and that fine-tuning and prompting for it "often narrowly optimize for syntactic correctness or execution accuracy, overlooking deeper reasoning over underlying data structures" (§1). They ask whether training on text-to-SQL alone can also make a model better at answering questions directly from a table, with no query required (§1, Fig. 1). They fine-tune two open models, Qwen-7B-Instruct and a compressed LLaMA 8B, first on step-by-step reasoning written by OpenAI's o3-mini, then by reinforcement learning (training by trial and reward) on the BIRD text-to-SQL benchmark, rewarded by similarity to a reference query and by o3-mini's grades (§3). On CRT-QA (complex questions over tables), graded by o3-mini (Limitations), they report relative gains of 33.9% for the LLaMA model (distilled and stored at 4-bit precision) and 14.5% for Qwen, over the untrained models (abstract; Tab. 1). They present this as bridging two tasks: "our key contribution lies in bridging Text-to-SQL with general tabular reasoning" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [tabular question answering](#/glossary/tabular-question-answering-tqa) (here graded by an LLM judge, not by exact match) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [gold query](#/glossary/gold-query) (the paper says "reference" or "gold" SQL) · [F1 score](#/glossary/f1-score) · [Distillation into compact models](#/glossary/distillation) · [post-training quantization](#/glossary/post-training-quantization)

**The paper's own terms:**
- **The models** (§4.1): Qwen-7B-Instruct, and "a 4-bit quantized version of the distilled DeepSeek LLaMA 8B model". OpenAI's o1 is a reference row in Tab. 1; OpenAI's o3-mini writes the training traces (§3.1), scores the LLM-based rewards (§3.2.2) and grades the test answers (§4.1; Limitations).
- **Clinton dataset** (App. A): `Clinton/Text-to-sql-v1` on Hugging Face, a compilation of text-to-SQL datasets such as Spider (cross-domain), WikiSQL (Wikipedia tables), ATIS (airline travel) and the clinical MIMICSQL and eICU. Used for fine-tuning and as the in-domain test.
- **BIRD**: a text-to-SQL benchmark over large real-world databases ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")); here the reinforcement learning set and a test column.
- **CRT-QA** (§4.1): a table question-answering benchmark that "focuses on complex table-based reasoning"; the model answers from the table, zero-shot (§4.5).
- **Base, SFT, SFT-CoT, SFT-CoT-GRPO** (Tab. 1 caption): untrained; supervised fine-tuning (SFT) on Clinton; fine-tuned on Clinton with chain-of-thought traces; and SFT-CoT followed by GRPO on BIRD.
- **LLM-EXE** (Tab. 1, Tab. 2): the text-to-SQL score. The paper calls it execution accuracy, "defined as the exact match between the predicted and reference SQL queries", and, "Due to the partial absence of full database access", uses o3-mini "as a proxy for execution, assessing query correctness based on structural and semantic alignment" (§4.1). In the glossary's terms, this is not [execution accuracy](#/glossary/execution-accuracy), which runs both queries on a database.
- **LLM-ACC** (Tab. 2 caption): CRT-QA accuracy "assessed by an LLM judge", o3-mini (Limitations).
- **Tabular Aha-Moments** (§4.2): behaviours seen during GRPO that "resemble the Aha Moment described in DeepSeek-R1" (in DeepSeek-R1's RL training, the model learning to stop and rethink), such as occasional schema-aware reasoning without access to the table's content.

**Builds on:**
- DeepSeek-R1 [10] ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")): the two-stage recipe is "inspired by DeepSeek-R1" (§3.2), and §4.2 borrows its "Aha Moment".
- GRPO from DeepSeekMath [29] ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), a paper on an open math-reasoning model (§3.2.1).
- RL for SQL generation, Reasoning-SQL [27] and SQL-R1 [20] (§1); the class-based judge reward extends Reasoning-SQL's LLM rewards (§3.2.2). Not on this site.
- Table question-answering methods H-STAR [1] and Plan-of-SQLs [4], which the authors say "tend to bias the model toward SQL-centric reasoning, potentially limiting generalization" (§1).

## Problem and setting

- **Questions** (§4): whether synthetic reasoning traces help text-to-SQL (research question 1, RQ1); whether supervised fine-tuning plus GRPO can induce "transferable tabular reasoning capabilities" (RQ2); and which GRPO rewards matter most (RQ3).
- **Training data:** Clinton for fine-tuning, BIRD for GRPO (Fig. 2). Each GRPO instance is a question and its database schema (§4.1); the trace-generation prompt asks for SQLite (an embedded database engine) syntax (App. B.1).
- **What "correct" means:** decided by o3-mini, for text-to-SQL "as a proxy for execution" (§4.1) and for CRT-QA as "an automated judge" (Limitations). NULLs, set or [bag](#/glossary/bag-semantics) results and SQL fragments: not discussed.
- **Settings** (§4.1): supervised learning rate 2×10⁻⁴, batch size 1; GRPO learning rate 1×10⁻⁶, 8 completions per prompt.

## Approach

**Synthetic traces (§3.1).** o3-mini answers Clinton questions with reasoning steps in natural language (prompt in App. B.1). A second model, told to return only "Correct" or "Wrong" against the reference query (App. B.2), filters them. A subset of 3,500 examples "containing only correctly reasoned outputs" is used for fine-tuning (§3.1).

**GRPO (§3.2.1, Eq. 1).** For each question and schema, the model samples a group of candidate queries; each is scored, and its advantage is its reward relative to the group. The objective clips how far one update can move the model and adds a penalty for drifting from a frozen reference model.

**Rewards (§3.2.2).**
- **Execution-Based Reward**: a language model counts "orthographic changes" (such as token insertions, deletions or substitutions) between the predicted and reference query; the reward is 1/(x+1) for x changes (Eq. 2; prompt in App. B.3). The authors motivate it by "Traditional binary execution rewards offer no gradient for near-correct predictions."
- **String Matching Reward:** based on the longest contiguous matching subsequence of the two query strings.
- **Component-Level Matching Reward:** token-level F1 per clause, such as `SELECT`, `WHERE` and `GROUP BY`.
- **LLM Judge Reward with Classes:** the judge sorts each query into ordinal classes from "Very Bad" to "Excellent" (prompt in App. B.4).

The ablation combines them (Tab. 2 caption): the best single reward is string matching, the best two add the LLM judge, and the best four use all of them.

## Results

All scores are graded by o3-mini (§4.1; Limitations).
- **Table QA transfer (Tab. 1).** From Base to SFT-CoT-GRPO, the authors report CRT-QA rising from 41.3% to 55.3% for LLaMA and from 49.0% to 56.1% for Qwen; the caption calls this "Our main result". The abstract and §5 give these as relative gains of 33.9% and 14.5%. On BIRD, the same rows rise from 2.8% to 8% and from 11.9% to 15.5%.
- **Against o1 (Tab. 1).** o1 scores above every trained model on BIRD (25.4%) and CRT-QA (69.6%).
- **Clinton (Tab. 1).** Plain SFT gives the highest trained Clinton scores (62.1% LLaMA, 56.6% Qwen); SFT-CoT-GRPO reaches 57.0% and 52.2%. The authors read GRPO as encouraging "broader SQL comprehension and reasoning capabilities" beyond BIRD (§4.4).
- **Chain-of-thought supervision (§4.3).** The authors report that traces "slightly reduces performance on the in-domain Clinton dataset, but improves generalization to unseen SQL benchmarks (BIRD) and table-based reasoning tasks (CRT-QA)"; for LLaMA, CRT-QA goes from 33.7% (SFT) to 43.7% (SFT-CoT) (Tab. 1). They attribute LLaMA's larger gain from the traces, against Qwen's, to its "compressed nature".
- **Reward ablation (§4.6, Tab. 2).** String matching alone gives CRT-QA 51.7% (LLaMA) and 54.3% (Qwen); the four rewards give 55.3% and 56.1%. The authors call string matching "the most effective single reward due to its continuous nature", say "exclusive reliance on string matching can lead to diminished performance in later training stages", and name string matching with the class judge "the most promising two-reward combination".
- **Qualitative (§4.2, Fig. 3–4).** During GRPO the model "occasionally demonstrated schema-aware reasoning", and in table QA it "frequently utilizes SQL-like structures as intermediate reasoning tools" (Fig. 3).

## Limits the authors state

- The models are medium-scale with "undocumented" pretraining corpora, so the authors "cannot determine coverage or gaps across domains, languages, or proprietary material", which "complicates any analysis of domain blind spots, spurious correlations, or memorization risks"; and "the relatively modest parameter counts of these models may limit performance on tasks requiring deep domain expertise" (Limitations).
- o3-mini as CRT-QA judge "lacks the nuance of human evaluation, particularly for complex reasoning and semantic alignment" (Limitations). For text-to-SQL, the o3-mini proxy "is not a substitute for full SQL execution against a live database", and "Future work will incorporate actual DBMS-based evaluation" (a database management system) (§4.1).
- Standard benchmarks "may under-represent the ambiguity and noise present in real-world data, making our results more indicative of structured reasoning progress than deployment readiness" (Limitations).
- Only two training stages, which "may sacrifice opportunities for deeper alignment or curriculum structuring" (ordering training data from easy to hard); additional stages "such as pre-CoT bootstrapping or domain-adaptive pretraining" (a warm-up stage before trace training; further pretraining on domain text) may "further enhance generalization and robustness in real-world table reasoning" (Limitations).
- Future research "should address these limitations by exploring larger, better-documented models, human-in-the-loop evaluation, and more diverse datasets" (Limitations).
- The aha-moment observations are "exploratory", and "rigorous measurement of such schema-grounded generalization" is left "to future work" (§4.2).

## Open problems and building blocks

- **Open:** "explore richer reward configurations, and extend the framework to other formal languages and real-world datasets" (§5).
- **Released:** Nothing stated.
- **To reuse it:** o3-mini for the traces, the LLM rewards and the grading (§3.1, §3.2.2, §4.1); the Unsloth fine-tuning framework with QLoRA adapters (small trainable adapters on a quantized model) and 4×A100 80GB GPUs in mixed precision (FP16, 16-bit floating point) (App. C); the prompts in App. B.

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
