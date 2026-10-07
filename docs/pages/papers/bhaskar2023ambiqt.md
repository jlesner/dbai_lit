# Benchmarking and Improving Text-to-SQL Generation under Ambiguity

**AmbiQT** · EMNLP 2023

Read: [PDF](https://arxiv.org/pdf/2310.13659) · [arXiv](https://arxiv.org/abs/2310.13659) · [DOI](https://doi.org/10.18653/v1/2023.emnlp-main.436)  
Code: [AmbiQT](https://github.com/testzer0/AmbiQT)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A text-to-SQL benchmark where each question has two plausible SQL readings, from lexical or structural ambiguity (abstract).
- LogicalBeam: a decoder that diversifies plan templates and branches only on schema names, aiming to get all readings into the top-k (abstract).
- Questions with more than one correct query, where a single gold query marks a right answer wrong (our reading). It reports over 3000 examples (abstract); [SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)") cites it as an ambiguity benchmark (PDF p. 23) (borderline, kept: an ambiguity benchmark with no equivalence check, cited by challenge and technique files).

## In plain words

Text-to-SQL benchmarks usually accept one correct query. The authors argue that questions over real databases "frequently involve significant ambiguity", from overlapping table or column names and confusing ways to join tables, and that an ideal system should list every valid reading among its top outputs for the user (abstract, §1). They build AmbiQT: over 3000 questions with two valid queries each, made by changing the database layouts of Spider, a standard benchmark. They find current systems, ChatGPT included, "far from this ideal", and blame mainly beam search, the usual decoder, and its variants for varying a query's wording rather than its structure (abstract). Their decoder, LogicalBeam, writes query skeletons with different numbers of joins and selected columns, then fills each with different table and column names. They report it is "up to 2.5× more effective than state-of-the-art models" at getting all readings into the top outputs (abstract), and that it raises top-five accuracy over a baseline model on two ordinary benchmarks (§6.4). They present AmbiQT, "To the best of our discernment", as "the first open benchmark" for this (§2).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [beam search](#/glossary/beam-search) · [execution accuracy](#/glossary/execution-accuracy) · [exact match](#/glossary/exact-match) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling)

**The paper's own terms:**
- **Gold queries**: the two valid SQL readings of an AmbiQT question, both built from one Spider query (§3).
- **C, T, J, P** (§3, Tab. 1): column ambiguity (two columns with synonym names), table ambiguity (two tables with synonym names), join ambiguity (a column is also in a split-off table, so a join may or may not be needed), precomputed aggregates (a table already holds an average or sum, which may be read or computed).
- **EitherInTopK / BothInTopK** (§6.2 "Evaluation Metrics"): whether either, or both, gold queries are among the top 5 outputs; BothInTopK is called **coverage**.
- **EXM, EM** (§6.2, App. C): Execution Match (the main metric, execution accuracy against each gold query) and Exact Set Match, which Tab. 7 and App. C also call "Exact Match".
- **Template** (§5.1, App. E): a query with column names, table names, numbers and strings replaced by placeholders, so only the structure remains.
- **Plan** (§5.1): a prefix "<J> joins | <S> selects" before the template. **Prefix enforcement** (Fig. 3) forces an output to start with a chosen plan.
- **Restricted Fill-In** (§5.2, Alg. 1): the second stage's beam search, branching only where a table or column name begins.

**Missing glossary terms:**
- **Typical sampling** (§6.2): "another recent diverse decoding algorithm", with a parameter like nucleus sampling's p, set to 0.9.

**Builds on:**
- Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), a cross-domain text-to-SQL benchmark, which AmbiQT modifies (§3).
- The baselines (§1, §6.2): T5-3B (a T5 model of about 3 billion parameters) fine-tuned on Spider, from the repository of PICARD (a constrained-decoding method); RESDSQL, a text-to-SQL model the authors call the best Spider method not using ChatGPT or GPT-4 at the time; OpenAI Codex; ChatGPT.
- Wang et al. (2022), earlier work that "only consider column ambiguity" (§2).
- Diverse decoding: template-based decoding and Narayan et al.'s plan-first generation (§2).

## Problem and setting

- **Question:** do text-to-SQL systems put all valid readings into their top-k outputs, and can a decoder do so (§1, §4)?
- **Data:** AmbiQT changes Spider's schemas, not its questions, "as that provides greater control over the modification process"; each entry is "designed so that both alternatives have a similar relevance to the question" (§3). Sizes: C 1240, T 1417, J 288, P 101 (Tab. 1).
- **Correct:** a gold query is found when an output matches it by EXM (EM in App. C), over the top 5 (§6.2).
- **Systems (§6.2):** ChatGPT, prompted one-shot for five queries "using an example outside of AmbiQT"; Codex `code-davinci-002`, two-shot, sampled at temperature 0.6 (App. A.4); RESDSQL-3B with its NatSQL intermediate form off; T5-3B with beam search and with top-k, nucleus and typical sampling; Flan-T5-XL, "the FLAN variant of the T5-3B model". Beam width is 10 "unless otherwise specified".

## Approach

  - **C:** ChatGPT gives two synonyms per column name; a column is replaced by two columns with those names and the query copied once with each. The original name isn't reused, as Spider questions often contain it verbatim.
  - **T:** the same with table names, motivated by databases that integrate several sources, such as web tables.
  - **J:** for a query selecting two or more columns from a table, one of them not the primary key (the column identifying each row), a new table holds the primary key and that column; the second gold query joins it. Motivated by production databases that often split a table "for efficient clustered access" (columns read together stored together).
  - **P:** for a query with an aggregate, a new table holds precomputed `avg`, `sum`, `min`, `max` columns plus the grouped-by columns; the second gold query reads them. Motivated by data warehouses such as Data Commons.
- **Why decoders fail (§4, §5, Fig. 2, Tab. 2):** beam search "tends to produce outputs that are minor tweaks of the best hypothesis"; nucleus and typical sampling "are designed for natural language". T5-3B's top errors (Tab. 2) include wrong join and column counts and wrong names, which LogicalBeam targets.
- **Stage 1, plan-based templates (§5.1):** a Text-to-Template model, trained on Spider's train split, writes a plan, then a template. After the unconstrained top template (j joins, s selections), four more plans are tried: (j−1, s), (j+1, s), (j, s−1), (j, s+1), skipping j < 0, j > 3 or s ≤ 0. Each plan is enforced as a prefix and decoded greedily: at most five templates.
- **Stage 2, schema-diverse filling (§5.2, Alg. 1):** beam search fills each template. Outside table and column names only the top token is kept; where a name begins, it may branch, but only to a whitelist of the schema's names (disallowed tokens get logit −∞, §6.1).
- **Ranking (§5.2):** ranking by probability was dropped: the models' distributions were "extremely skewed", and neural sequence models are, the authors note, poorly calibrated (their probabilities don't track correctness). The list takes the top-2 queries per template "along with the top−2 from vanilla beam-search without any templates", removes duplicates and returns the top 5; App. F says "the first two outputs of our approach are from T5-3B".

## Results

Top-5 EXM on AmbiQT unless stated.

- **Coverage (Tab. 3, §6.3)**: LogicalBeam 28.0 / 42.6 / 59.4 / 24.8 on C / T / J / P, against T5-3B with beam search 11.7 / 21.9 / 27.8 / 15.8, and against the best other system per split, ChatGPT 22.7 (C) and 37.3 (T), Codex 43.8 (J) and 24.7 (P). The authors call the gain "1.5 − 2.5× over the baselines across the board" (§1).
- **Baselines (§6.3, Tab. 3):** LogicalBeam's EitherInTopK is highest except on P (Codex). Existing systems "fail to cover both alternatives in Top-5" even when they do reasonably on EitherInTopK; RESDSQL's coverage drops to zero on J. Nucleus and typical sampling "perform worse than beam search", because of skewed token probabilities (Fig. 5, App. D).
- **Beam width and output count (Fig. 4)**: a larger beam "generally reduces coverage"; 3× more outputs "leads only to marginal improvements, except for Table Ambiguity" (§6.3).
- **Error catalog (Tab. 2):** T5-3B's top-1 output (beam width 25) is correct by EM on 70.31% of Spider dev.
- **Skew (§5.2):** top-p sampling with p = 0.9 "produced the same template in all infillings over 70% of the time".
- **Ordinary benchmarks (Tab. 5, §6.4)**: against T5-3B, top-5 EM / EXM go from 76.1 / 78.2 to 78.4 / 81.3 on Spider dev, and from 27.1 / 26.5 to 35.4 / 35.4 on Kaggle DBQA dev, an "in-the-wild" benchmark (§1).
- **Ablation (Tab. 4, §6.5)**: a single-stage version "lags behind LogicalBeam, and by a large margin for T and P"; counterfactual plans raise coverage on J and P; restricted filling on C and T.
- **Prompts (App. B, Tab. 8):** Liu et al.'s (2023) zero-shot prompt gives ChatGPT lower coverage than the authors' on all four kinds.
- **EM (App. C, Tabs. 6–7):** EM "follows the same trend" as EXM.
- **Examples (App. F, Figs. 7–10):** the authors observe LogicalBeam "is more consistent than the other two in incorporating all the possible queries".

## Limits the authors state

- "real-life databases may exhibit more numerous as well as varied forms of ambiguity" than AmbiQT (Limitations).
- AmbiQT "only consists of examples with questions in English" (Limitations).
- The two-step approach "incurs a higher number of decoding steps" than an end-to-end model, though it "falls not much beyond the baseline" (Limitations).
- ChatGPT and Codex, "the most powerful publicly available LLMs suitable for Text-to-SQL conversion" at the time, "are unable to exhibit sufficient diversity under ambiguity. Future versions or models may overcome this barrier" (Limitations).
- "On rare occasions" an output repeats another with alias t2 renamed t3, which the authors believe indicates "a strong bias of the underlying model towards a particular template" (§6.6).

## Open problems and building blocks

- **Open:** "The problem of debiasing the model makes for exciting future work" (§6.6); "finding an optimal trade-off between decoding steps and coverage remains an intriguing challenge" (Limitations); a study of ambiguity in other natural languages (Limitations); "generation under ambiguity in more detail, both in the domain of Text-to-SQL conversion and beyond" (§7).
- **Released:** "We release AmbiQT and LogicalBeam's implementation publicly" (abstract, footnote 1).
- **To reuse it:** two fine-tuned Flan-T5-3B models (about 300 epochs each, §6.1); the four extra plans skip j < 0, j > 3 or s ≤ 0 (§5.1); one 80GB A100 GPU; by the authors' estimate about 500 GPU hours in all and under $100 of ChatGPT and Codex calls (App. A.1).
- **Beyond its domain:** the authors say "we could do the same with almost any Sequence-to-Sequence task (for example, political alignment in news summarization)" (§6.6).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
