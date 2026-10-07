# SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning

**SPFT-SQL** · Findings of EMNLP 2025

Read: [PDF](https://arxiv.org/pdf/2509.03937) · [arXiv](https://arxiv.org/abs/2509.03937) · [DOI](https://doi.org/10.18653/v1/2025.findings-emnlp.59)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Self-play fine-tuning for text-to-SQL, with an error-driven loss on the opponent model's incorrect SQL (abstract).
- Before self-play, verification-based iterative fine-tuning synthesizes data from the schema and execution feedback on a synthesized validation set (abstract; §3.1.3).
- The self-play [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") calls "the closest T2SQL self-play", which "verifies pairs by execution but trains through SFT with seed supervision" (§2); its self-play stage itself uses a SPIN-style loss weighted by an execution-based reward (§3.2, our reading). Prior self-play work on SQL (a main model against an opponent model, not proposer–solver) (borderline, kept as Adjacent: text-to-SQL self-play judged by execution).

## In plain words

A text-to-SQL model turns a question about a database into an SQL query. The authors say fine-tuning open-source models for this needs data that typically requires expert labelling, and that recent data-synthesis methods still rely on closed-source models such as GPT-4, raising privacy concerns (§1). They tested self-play fine-tuning (SPIN), which trains a model against weaker copies of itself, and found that on their 7B test model it lowers accuracy (§1). SPFT-SQL first generates new question–query pairs from the database's tables and columns over several rounds, checking whether queries return the right result; then it trains its best model against its weakest one with a loss driven by the weaker model's wrong queries (§1).

On Qwen2.5-Coder-7B, an open 7-billion-parameter coding model, the share of questions answered with the right result on the test set of Spider (a benchmark over many databases) goes from 81.5% untuned to 79.0% with SPIN and 87.4% with SPFT-SQL (§1). The authors call it "the first effective implementation of the self-play method in text-to-SQL tasks" (§5).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [self-play](#/glossary/self-play) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [PPO](#/glossary/ppo) · [LoRA](#/glossary/lora-low-rank-adaptation) · [test-suite accuracy (TS)](#/glossary/test-suite-accuracy) · [valid efficiency score (VES)](#/glossary/valid-efficiency-score-ves)

**The paper's own terms:**
- **self-play**: here, a main model trained against an opponent model, both picked from the models the first stage produced (§3.2).
- **VBI-FT** (Verification-Based Iterative Fine-Tuning): the first stage; it synthesizes question–SQL pairs, fine-tunes on them, checks the model on a synthesized validation set and uses the outcome in the next round (§3.1, Fig. 2).
- **SQL template**: a query with column and value mentions replaced by typed slots and its `FROM` and `JOIN` clauses removed, keeping e.g. `SELECT`, `WHERE`, `GROUP BY`, `HAVING`; an LLM extracts it (prompt in App. A.1, Fig. 6) (§3.1.1).
- **SQL-to-Text model**: writes the question for a synthesized query; fine-tuned each round on pairs that passed the check (§3.1.1, §3.1.3).
- **y+ and y−** (Eq. 1): the model's queries on the validation set whose execution result equals, or differs from, that of the ground-truth query.
- **main model and opponent model**: the candidate models with the highest and the lowest accuracy on the synthesized validation set (§3.2).
- **error-driven loss** (Eq. 3) and its reward **R** (Eq. 2): R is 1 when the opponent's query returns a different result from the ground-truth query and 0 when it returns the same; λ is called "the regularization parameter" (§3.2).

**Builds on:**
- **SPIN** (Chen et al. 2024; not listed here): the method the authors evaluate first (§1, Fig. 1) and whose logistic loss they adopt (§3.2).
- **Template-based SQL synthesis** of Hu et al. 2023 (not listed here), which §3.1.1 follows.
- **Text-to-SQL models fine-tuned on synthesized data**, the main baselines (§1, §4.1 "Baselines"; none on this site): CodeS (open-source text-to-SQL models; §3.1.2's schema processing is "Inspired by" it), ROUTE (multi-task fine-tuning on data synthesized with open-source models), SENSE (data from weak and strong LLMs), DTS-SQL (decomposed text-to-SQL with small models), OmniSQL (data synthesis at scale).

## Problem and setting

- **The question:** can self-play fine-tuning improve open-source LLMs on single-turn text-to-SQL without closed-source models for data synthesis? The authors find two problems with SPIN: it "only synthesizes SQL queries from existing natural language questions, without generating new information", and it "treats all data generated by the opponent model as incorrect", so many valid queries are discarded (§1). They say the only earlier text-to-SQL self-play work is multi-turn and does not apply to single-turn tasks (§1, §2).
- **What counts as correct:** a query is correct when its execution result equals the ground-truth query's, E(y′) = E(y) (Eq. 1–2). How results are compared (row order, duplicates, NULLs) is not discussed.
- **Benchmarks** (§4.1 "Benchmarks"): Spider (7,000 training, 1,034 development and 2,147 test examples; 206 databases, 138 domains), BIRD (12,751 question–SQL pairs from 37 domains, "more complex domain-specific queries"), and three Spider variants: Spider-Syn (synonym substitution), Spider-Realistic (more natural questions) and Spider-DK (535 queries needing domain knowledge). Metrics: execution accuracy (EX) and TS on Spider and its variants, EX and VES on BIRD (§4.1 "Evaluation Metrics").
- **Models** (§4.1 "Models"): Llama3-8B-Instruct, Deepseek-Coder-7B-Instruct, Qwen2.5-Coder 1.5B–32B.
- **Baselines** (§4.1 "Baselines"): GPT-4 prompted directly and inside the prompting methods DIN-SQL, MAC-SQL, DAIL-SQL and MCS-SQL (GPT-4-based pipelines); the six base models zero-shot and after supervised fine-tuning (SFT, with LoRA via the Llama-Factory fine-tuning framework, App. A.4); the systems under Builds on; SPIN. "For fairness, we reproduce several baselines using open-source repositories" (§4.1).

## Approach

  - *Synthesis* (§3.1.1): a template is sampled "according to the training distribution", its slots filled at random with type-matching columns (weighted by schema distance) and with values from the database; the SQL-to-Text model writes the question.
  - *Schema processing* (§3.1.2): the input keeps the relevant tables and columns, matches values, and adds metadata (keys, types, annotations).
  - *Evaluation feedback* (§3.1.3): on the synthesized validation set, right queries (y+) train the SQL-to-Text model and the templates of wrong ones (y−) seed the next round. The rounds yield the candidate models for stage 2. 3,000 synthesized records per round gave the best results (Fig. 4, §4.4).
- **Stage 2, self-play fine-tuning (§3.2, Algorithm 1).** The best candidate trains against the weakest: the opponent generates y+ and y− pairs on the validation set; the main model is updated with the error-driven loss (Eq. 3) and added to the candidates. Eq. 3 uses SPIN's logistic loss (§3.2). The authors say "The first term encourages the main model to assign higher probability to correct SQL than the opponent model. The second term penalizes the main model for behaving similarly to the opponent model on incorrect SQL" (§3.2).
- **Contrast with DPO (§3.2, App. A.2).** The authors argue DPO's reward "vanishes" when the model's and reference model's outputs are similar, common in text-to-SQL "due to semantically equivalent SQL queries", while their execution-based reward "directly penalizes incorrect outputs" and they use "a dynamically updated opponent" (§3.2). App. A.2 adds that with execution-based rewards "we explicitly amplify gradient updates for incorrect SQL predictions" and that the binary reward "prevents gradient vanishing" (Eq. 5).

## Results

- **Main comparison (Tab. 1, Fig. 1, §4.2).** On Qwen2.5-Coder-7B, Spider test EX is 81.5 untuned, 79.0 with SPIN, 83.7 with SFT and 87.4 with SPFT-SQL; BIRD dev EX is 51.5, 34.8, 54.4 and 61.0. The authors report SPIN "not only lower than fine-tuning-based methods but also below that of the original model", from overfitting without new data (§4.2).
- **Against the strongest systems (§4.2, App. A.11).** With Qwen2.5-Coder-32B, Tab. 13 gives 89.1 Spider test EX against 87.6 for CHASE-SQL (with Gemini 1.5) and 89.6 for XiYan-SQL (multi-agent systems), and 65.2 BIRD dev EX against 73.0 and 73.3; §4.2 calls 89.1 "significantly narrowing the gap with GPT-4-based methods". The abstract states that experiments "on six open-source LLMs and five widely used benchmarks demonstrate that our approach outperforms existing state-of-the-art (SOTA) methods"; the contributions say "other SOTA methods based on open-source models" (§1).
- **Over iterations (§4.3, Fig. 3).** The authors report that SPIN's accuracy "continuously decreases" while SPFT-SQL "shows a steady improvement".
- **Synthesized data alone (§4.4, Fig. 5).** The authors report models fine-tuned on VBI-FT data beating CodeS, ROUTE, SENSE and DTS-SQL.
- **Ablation (Tab. 2, §4.5; Tab. 8, App. A.7).** On Qwen2.5-Coder-7B, VBI-FT adds 3.3–3.8 EX points on Spider and 6.8 on BIRD, the authors report, and self-play "0.6% to 0.8% on both datasets", which they read as self-play using the model's "intrinsic capabilities without external supervision" (§4.5).
- **Against DPO and PPO (Tab. 3, App. A.3).** On Qwen2.5-Coder-7B, Spider dev/test EX is 87.2/87.4 for SPFT-SQL against 84.7/84.6 for VBI-FT + DPO and 85.1/86.6 for VBI-FT + PPO. The authors attribute the gap to the error-driven loss.
- **Same base models (App. A.9, Tab. 10–11).** SPFT-SQL beats SENSE on CodeLlama-7B and ROUTE on Qwen2.5-7B on Spider dev, Spider test and BIRD dev; the authors say it "consistently outperforms SENSE".
- **Larger model (App. A.8, Tab. 9).** On Llama3-70B-Instruct, SPFT-SQL beats SFT and SPIN on Spider.
- **Question quality (App. A.10, Tab. 12).** For 200 sampled Spider dev pairs, human judges found the SQL-to-Text model's question semantically consistent with the original one for 56.5% before and 93.5% after iterative training (GPT-4 as judge: similar).
- **Cost (App. A.12, Tab. 14).** Against SFT, SPFT-SQL "roughly doubles computational time per iteration", uses the same two GPUs and about 19% more storage over five iterations.

## Limits the authors state

- Data synthesis and the extra evaluation steps add "some extra computational overhead during training" (§ Limitations).
- "There is still room for further exploration in data selection techniques", which "may lead to improvements in the overall quality and relevance of the generated data" (§ Limitations).
- No results on the BIRD test set, "Due to time constraints" (§4.2).
- On BIRD a gap to CHASE-SQL and XiYan-SQL remains, which the authors attribute to those systems' multi-agent frameworks, while SPFT-SQL "primarily focuses on single-model fine-tuning" (App. A.11).
- Too much synthesized data per round lowers accuracy, and generating it "could incur unnecessary time costs" (§4.4, App. A.6).

## Open problems and building blocks

- **Open:** "Future research will focus on exploring cross-domain generalization capabilities and developing efficient adversarial architectures" (§5); "potential enhancements by integrating multi-agent collaboration within our adaptive fine-tuning framework" (App. A.11).
- **Released:** Nothing stated.
- **To reuse it:** databases with schemas and values, and training queries to extract templates from (§3.1.1); an LLM for template extraction (App. A.1); an SQL executor (§3.1.3); a SQL-to-Text model (Qwen2.5-Coder-7B in App. A.10). For Qwen2.5-Coder-7B on Spider, Tab. 14 lists 1 hr 45 min per iteration on 2 GPUs (of eight 80GB NVIDIA A800s, App. A.12), with "7,000 real + 3,000 syn" training examples.
- **Beyond its domain:** none claimed.

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
