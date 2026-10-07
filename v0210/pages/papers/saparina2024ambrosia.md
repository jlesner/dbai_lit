# AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries

**AMBROSIA** · NeurIPS 2024 (Datasets and Benchmarks)

Read: [PDF](https://arxiv.org/pdf/2406.19073) · [arXiv](https://arxiv.org/abs/2406.19073)  
Code: [ambrosia](https://github.com/saparina/ambrosia)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of ambiguous questions (scope, attachment, vagueness) with their interpretations and a SQL query for each (abstract).
- Databases are generated from scratch so that the ambiguity persists given the database (abstract).
- An ambiguity benchmark beside [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") ([SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)") cites both, PDF p. 23): two or three gold queries per ambiguous question, one per interpretation (§3.4) (borderline, kept: an ambiguity benchmark with no equivalence check, cited by challenge and technique files).

## In plain words

A database question can have several readings: "What activities does each gym offer?" can ask for the classes all gyms share, or for each gym's own list. AMBROSIA is a benchmark of such questions, of three kinds (scope, attachment, vagueness), for systems that translate questions into SQL queries. The authors argue that practical systems should handle ambiguous requests, and that earlier ambiguity datasets alter existing databases, cover a single kind of ambiguity and often give an artificial setting (§1). They generate databases from scratch with a 7-billion-parameter open language model, so that each question stays ambiguous given the data; crowdworkers write the questions and one unambiguous rewording per reading, each paired with a query (abstract, §3). Asked, without examples, to write one query per possible reading, the best of six models tested, Llama3-70B, finds about 31% of the correct queries for ambiguous questions against about 65% for unambiguous ones, and returns every reading for under 2% of ambiguous questions (§4.1). The authors present it as "a novel benchmark" (§1), not a new method.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [beam search](#/glossary/beam-search) · [semantic parsing](#/glossary/semantic-parsing) · [many-to-many relationship](#/glossary/many-to-many-relationship)

**The paper's own terms:**
- **ambiguous question**: on a given database with known schema and values, it maps to at least two non-equivalent SQL queries, i.e. queries that "produce different execution results, notwithstanding variations in layout or format" (§3.1, Definitions 1–2, adapted from Floratou et al.).
- **interpretation**: a human-written unambiguous rewording for one reading of an ambiguous question, with one gold query, the reference SQL a prediction is scored against (§3.4).
- **scope ambiguity**: it is unclear which elements a quantifier such as "each", "every" or "all" refers to; the collective reading takes it widely (classes common to all gyms), the distributive one takes each gym separately (§3.2, Fig. 1a).
- **attachment ambiguity**: it is unclear how a modifier or phrase attaches; in "Show the writers and editors on a work-for-hire", high attachment applies the phrase to both groups, low attachment to editors only (§3.2, Fig. 1b).
- **vagueness**: "context creates uncertainty about which set of entities is being referred to" (§3.2): "Who issued CD Special?" can mean the bank, the branch, or both (Fig. 1c). It is counted as ambiguity "for simplicity" (§1, footnote 1). For vague questions with three interpretations, predictions with one component are "Component" and those with all components "Full" (§4.2).
- **database configuration**: one way of mapping the generated concepts to tables or columns: four for attachment, two for vagueness, one for scope (§3.3, App. D).
- **recall, precision, AllFound**: correct predicted queries over gold queries; correct predicted queries over all predictions; whether every gold query of an ambiguous question is predicted, i.e. recall of 100% (§4, App. F). Recall on unambiguous questions, with one gold query, equals execution accuracy (§4.1).

**Builds on:**
- Floratou et al. 2024 ("NL2SQL is a solved problem... not!", Conference on Innovative Data Systems Research): the ambiguity definition is adapted from it (§3.1).
- AmbiQT ([AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)")) and NoisySP (Wang et al. 2023), earlier ambiguous text-to-SQL datasets compared in Tab. 1. The authors describe both as adding vagueness by modifying existing databases (§1): NoisySP builds on the text-to-SQL datasets WikiSQL and Squall, which have single-table databases, and AmbiQT modifies the cross-domain benchmark Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) with ChatGPT (§2).
- Stengel-Eskin et al. 2024 (parsing ambiguous sentences into [first-order logic](#/glossary/first-order-logic)) and AmbiQT: the Beam setting (a model's top 5 outputs from a beam of size 5) and the AllFound metric follow them (§4).

## Problem and setting

- **Question:** can LLMs spot an ambiguous question and write a query per reading (§1, §4)?
- **Scope:** linguistic ambiguity that "persists because the database context does not uniquely resolve the interpretations" (§3.1). Excluded: ambiguity from data management (formatting, coverage, handling of `NULL` values), underspecified output format (§3.1), and lexical ambiguity, one word with two meanings such as "Mississippi" as river or state (§3.2).
- **Data:** 846 SQLite databases in 16 domains, 4–6 tables and 3–5 rows per table on average (§3.3). 1,277 ambiguous questions with 2,965 interpretations, two per scope or attachment question and two or three per vague one (Tab. 1, totals ours; §3.4); 10% is reserved for few-shot examples (§4).
- **Models:** OpenChat-7B (the generator), instruction-tuned Llama3-8B, Llama3-70B and CodeLlama-70B (a code model), and OpenAI's GPT-3.5 Turbo and GPT-4o (§4). Each sees the full database as `CREATE TABLE` and `INSERT INTO` statements (§4).
- **Settings:** Prompt says questions may be ambiguous and asks for a query per interpretation, at temperature 0.5, averaging 5 seeds except for the OpenAI models, "due to cost constraints" (§4), which run at temperature 0 (App. F); Beam (open models only) gives standard instructions, at temperature 0 (§4).
- **Correct:** a prediction matches a gold query when their outputs match, each output represented "as a set of values" (App. F).

## Approach

- **Database generation (§3.3, Fig. 3, App. C–D).** Per ambiguity type, a template captures the structure it needs; OpenChat fills it with key concepts and relations for a domain from ten in-context examples; the authors filter unsuitable outputs by hand. OpenChat then writes `CREATE TABLE` and `INSERT INTO` statements zero-shot for a chosen configuration; outputs that don't execute or don't match it are rejected, and the authors filter databases they consider unnatural.
- **Scope and attachment (§3.4).** Gold queries come from templates per configuration, executed to check for non-empty, distinct results. 20 crowdworkers (on Prolific; native English speakers with SQL or database experience) turn generated question templates into ambiguous questions and interpretations, editing them substantially.
- **Vagueness (§3.4).** 10 experts write queries and questions from scratch on databases simplified by dropping and renaming tables or columns (e.g. one "Banking Institution" table); restoring the original tables yields a query per interpretation, checked by execution.
- **Scoring (§4, App. F).** Recall on ambiguous questions is the main metric. Precision isn't reported for Beam, which always outputs 5 queries. Attachment questions get "Show the results in one table", since models often wrote separate queries instead of one with `UNION`.

## Results

- **Zero-shot (§4.1, Tab. 2).** All models have much higher recall on unambiguous questions, and models generally fail to capture ambiguity, as "they rarely predict SQL queries for different interpretations". Llama3-70B (Prompt) is best on ambiguous questions: recall 30.7% against 64.5% on unambiguous ones, and AllFound 1.9%, "admittedly still very low". Models often return one correct reading for an ambiguous question, so precision exceeds recall, and sometimes several queries for an unambiguous one.
- **By type (§4.2, Tab. 3).** For Llama3-70B attachment is hardest, even on unambiguous questions, which the authors attribute to complex queries (often with `UNION`) and varied configurations. Scope is easiest; its single configuration "might be more familiar to LLMs due to the widespread use of many-to-many relationships". Prompt captures vagueness better than Beam, in recall and AllFound.
- **Bias (§4.2, Tab. 4).** The authors report "a clear bias towards one interpretation type": where at least one query is correct, Llama3-70B prefers the distributive reading for scope, almost always chooses high attachment, and, for vague questions with three interpretations, prefers one-component readings (Component) over the full one (Full); Prompt is more biased than Beam.
- **Few-shot (§4.3, Fig. 4, Tab. 5).** For Llama3-70B (Prompt), with random in-context examples, the largest gains come with one to three examples, and ambiguous recall stays well below unambiguous; more examples help, but "improvements are not statistically significant given the 2–7% standard deviation". One shot raises AllFound from 1.9% to 3.7% for Llama3-70B and from 0.4% to 4.5% for GPT-4o (3 seeds); the table's caption calls the differences between models and settings "negligible". More examples of one type help that type "but may negatively impact others".
- **Detection (App. G, Tab. 7).** Asked if a question is ambiguous, zero-shot Llama3-70B is right for 81.2% of ambiguous and 26.1% of unambiguous questions; the authors say it tends to overestimate ambiguity.
- **Errors (App. G).** Llama3-70B (Prompt) averages over one distinct query even on unambiguous questions (Tab. 6). In 50 sampled failures, the most frequent ambiguity error is variants of the same query.

## Limits the authors state

- They "cannot guarantee" an error-free dataset: interpretations may be unclear, fail to disambiguate the question, or be unnatural and overly explicit (§5), and generated databases might contain irrelevant tables (App. H, "Composition").
- The databases "generally have simple and clear names", while real ones might be incomplete or use abbreviations (§5).
- Showing full database content is "neither scalable nor safe for real-world applications", so the results "can be seen as an upper bound on semantic parsing performance with ambiguous questions" (§5). The prompt with all three types is an upper bound too, since examples for all ambiguities are unrealistic (§4.3).
- The dataset does not cover all cases of ambiguity (§3.2, §5).
- Set-of-values matching "might result in occasional false positives", which they found "rarely happens" (App. F).
- Prompting for ambiguity detection shows "a limitation of prompt-based approaches, which may confuse the model rather than provide helpful guidance" (App. G).
- Recruiting SQL-literate annotators "introduces a potential bias" (App. H, "Uses").

## Open problems and building blocks

- **Open:** methods to extract relevant entities from large databases, "we leave this to future work" (§4); more realistic databases (§5); more ambiguity types (§3.2, §5); generalization across domains and ambiguity types, and "cases where the database context helps clarify originally ambiguous questions" (§6); paraphrasing questions to reduce annotator bias (App. H, "Uses").
- **Released:** code and data (§1, footnote 2), under CC BY 4.0, with planned error fixes (App. A); annotation code and instructions (App. E).
- **To reuse it:** OpenChat-7B for generation (§3.3); one A100 GPU for 7B–8B models and two for 70B models (App. F); databases small enough to fit in context (§4). The authors add that their generation approach "could be used to augment existing text-to-SQL benchmarks, e.g., to assess robustness or out-of-domain generalization" (§3.5).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
