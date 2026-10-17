# STRuCT-LLM: Unifying Tabular and Graph Reasoning with Reinforcement Learning for Semantic Parsing

**STRuCT-LLM** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2506.21575) · [arXiv](https://arxiv.org/abs/2506.21575)  
Code: [STRuCT-LLM](https://github.com/bouv/STRuCT-LLM)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains Qwen models (1.5B to 32B) on text-to-SQL and text-to-Cypher together, then measures transfer: SQL-only, Cypher-only and joint runs compared on Spider, BIRD Mini-Dev, EHRSQL and Text2Cypher (§4.4, Tab. 1), zero-shot on table and knowledge-graph QA (CRT-QA, TableBench, CR-LT-KGQA; §4.5, Tab. 2) and on SM3, whose questions come with equivalent SQL, Cypher and MongoDB queries (App. C, Tab. C1).
- Supervised fine-tuning on chain-of-thought traces written by o3-mini and checked by a second model, then GRPO on BIRD and a Neo4j Text-to-Cypher split with three equally weighted rewards: an o3-mini judge grading against the gold query in five classes, string similarity, and a structural term, clause-level F1 for SQL and, for Cypher, one minus a normalized graph edit distance between the graphs the two queries target (§3.2, §3.3.2–3.3.3, Eq. 1, App. D.6).
- Evidence in weights that training on one engine-run query language carries over to another: the authors call the single-language effect "slight positive transfer" (§4.4) and report joint training above single-language training (§4.3–4.4). The rewards, as §3.3.2 describes them, compare the predicted query with the gold query's text; none is described as running a query, though §1 speaks of "execution, structural, and syntactical feedback".

## In plain words

Language models write prose well, but the authors say they "often falter on structured reasoning tasks involving tables and graphs" (§1). Writing SQL for tables and Cypher, a query language for graph databases, involves, in their view, shared abstractions such as filtering and joins, so they hypothesize that reinforcement learning (training on scores given to sampled answers) on both lets models "acquire complementary reasoning skills" (§1). They fine-tune open Qwen models on reasoning traces written by OpenAI's o3-mini, then train them by reinforcement learning on both languages together, with a reward they propose for Cypher that scores how close the predicted query's graph pattern is to the reference query's (§3). For their largest model, QwQ-32B, they report relative gains over the untrained model of 13.5% on Spider (SQL), 73.1% on Text2Cypher (BLEU), 8.5% on TableBench and 1.7% on CR-LT-KGQA, question-answering tests over tables and a knowledge graph (a graph of linked facts), "without any QA-specific supervision" (abstract; Tab. 1, Tab. 2). They present the Cypher reward as "enabling RL optimization in the graph domain for the first time" (§1).

## Background and terms

**Terms to know:** [semantic parsing](#/glossary/semantic-parsing) · [text-to-SQL](#/glossary/text-to-sql) · [GRPO](#/glossary/grpo) · [cold start](#/glossary/cold-start) · [execution accuracy](#/glossary/execution-accuracy) · [exact match](#/glossary/exact-match) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [tabular question answering (TQA)](#/glossary/tabular-question-answering-tqa) · [knowledge graph](#/glossary/knowledge-graph) (CR-LT-KGQA, §4.1) · [property graph](#/glossary/property-graph) (the reward's representation of each query's target, §3.3.2) · [graph edit distance](#/glossary/graph-edit-distance) (as the paper defines it above, §3.3.2)

**The paper's own terms:**
- **Text-to-Cypher**: writing a query in Cypher from an English question (§1). Cypher is the query language of the Neo4j graph database (general definition; the paper uses "the Neo4j Text-to-Cypher dataset", §3.2): a query matches patterns of nodes and relationships.
- **Cross-formalism transfer**: training on one query language raising scores on the other, "even without shared schemas" (abstract).
- **Joint training**: interleaving SQL and Cypher examples in both training stages (§1, §3.3.3).
- **Topology-aware reward / Graph Edit Distance-based Reward**: for Cypher, the authors build graphs of "the subgraphs targeted by the gold and predicted Cypher queries" and compute their graph edit distance, the "minimal set of edit operations required to transform a predicted subgraph into its gold-standard counterpart"; the reward is one minus that distance divided by the larger graph's count of nodes and edges (§3.3.2, Eq. 1).
- **Component-Level Matching Reward**: for SQL, an [F1 score](#/glossary/f1-score) of exact matches between the predicted and reference queries' clauses (e.g. `SELECT`, `WHERE`) (§3.3.2).
- **trained-SQL, trained-Cypher, trained-Both**: models trained on one language or both (Tab. 1). In the ablation, three digits mark which rewards were used: string matching, LLM judge, structural (Tab. B1); "Both-111" uses all three.
- **In-context / out-of-context performance**: the paper's names for query-writing scores (§4.4) and zero-shot question-answering scores (§4.5).
- **EXE, F1_exe**: execution accuracy, and an execution-based F1 taken from EHRSQL's authors (Tab. 1 caption).

**Missing glossary terms:** none.

**Builds on:**
- Stoisser et al. [30], Sparks of Tabular Reasoning ([Sparks of Tabular Reasoning](#/papers/stoisser2025sparks "Sparks of Tabular Reasoning via Text2SQL Reinforcement Learning (2025)")), by three of the authors, on SQL only: the continuous rewards are designed "similarly to [30]" and the clause reward is "as used in" [30] and [20] (§3.3.2); the prompts are "closely aligned with" it (App. D).
- GRPO, "originally introduced in" Shao et al. [27] ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")) (§3.3.1), and the reasoning system prompt of Guo et al. [5] ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")) (App. D.4).
- Ozsoy et al. [23]'s Neo4j Text-to-Cypher dataset, "over 44k examples" (§2).

## Problem and setting

- **Question:** does training on both languages beat training on one, carry between them, and carry to question answering over tables and graphs (§1, Fig. 1)?
- **Languages:** SQL in "SQLite as the query language" (§3.1), and Cypher. A query is correct if it "accurately retrieves the specific information from D requested by X", D being the data and X the question (§3.1). NULLs, bag or set semantics: not discussed.
- **Models:** "non-reasoning models (Qwen2.5-1.5B, Qwen2.5-14B) and reasoning models (QwQ-32B, Qwen3-14B)"; OpenAI's o3 and o3-mini as untrained references (§4.2, Tab. 1).
- **Training data:** fine-tuning traces for 24 public text-to-SQL datasets (Spider and EHRSQL excluded) and the Neo4j Text-to-Cypher data (§3.2, App. A.1); reinforcement learning on BIRD, without its evidence hints (per-question hints of outside knowledge), and a separate Text-to-Cypher split (§3.2). "Single-task training includes 7,000 SQL examples, while joint training allocates 3,500 examples to each SQL and Cypher" (§3.2).
- **Benchmarks:** for SQL, Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), BIRD Mini-Dev (a smaller BIRD test set, [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"), scored with evidence, Tab. 1) and EHRSQL (questions over the MIMIC hospital-records database, kept out of training to test "entirely unseen databases", App. A.2); for Cypher, the held-out Text2Cypher split (App. A.2). Zero-shot: CRT-QA and TableBench (questions over tables) and CR-LT-KGQA (knowledge-graph questions needing commonsense and rare entities, §2) (§4.1, App. A.2). SM3, a synthetic set of 40k samples across SQL, MQL (MongoDB Query Language), Cypher and SPARQL (a knowledge-graph query language) (§2), compares three languages on the same questions (App. C).
- **Metrics:** execution accuracy for Spider and BIRD, exact match and BLEU for Text2Cypher, F1_exe for EHRSQL (Tab. 1); exact match and ROUGE for question answering (Tab. 2); on SM3, "LLM execution accuracy" with o4-mini as judge (App. C, Tab. C1). Each score is the mean and standard deviation over five samples of 200 items (§4.2).

## Approach

- **Stage 1, supervised fine-tuning:** after a summarization step, o3-mini writes each query with natural-language reasoning, "verified by a second model for answer and reasoning coherence" (§3.2, App. D.1–D.3). This gives the cold start for stage 2 (§3.2).
- **Stage 2, GRPO:** six sampled queries per question (§4.2), scored by three rewards with weights all set to 1 "without tuning" (§3.3.3):
  - an o3-mini judge that grades the query against the reference query into five classes from "Very bad" to "Excellent" (§3.3.2, App. D.6);
  - string matching: "the longest contiguous matching subsequence between predicted and gold query strings" (§3.3.2);
  - a structural reward: component-level F1 for SQL, the graph-edit-distance reward for Cypher (§3.3.2, Eq. 1).
  The authors motivate continuous rewards by saying binary execution rewards are ineffective for nearly correct predictions "due to their lack of gradient information" (§3.3.2); in the glossary's terms, a form of [reward shaping](#/glossary/reward-shaping).
- **Joint training:** the authors' three motives are shared structural priors, a regularization effect against overfitting, and sample efficiency (§3.3.3).
- **Training setup:** VERL (an RL training library) for 14B and 32B models; Unsloth (a fine-tuning library) with QLoRA adapters (a [LoRA](#/glossary/lora-low-rank-adaptation) variant) of rank 16 for 1.5B models (§4.2).

## Results

- **Reward and language ablation (Qwen2.5-1.5B, §4.3, Tab. B1):** Tab. B1 prints Both-111 highest on every column but EHRSQL; the authors report Both-111 above Cypher-111 by 0.4 on Text2Cypher and above SQL-111 by 1.7 on Spider. Removing string matching "causes notable performance drops, especially in semantic parsing tasks", removing the LLM reward "leads to moderate degradation", and removing the structural reward "significantly impacts performance, especially on QA tasks" (§4.3).
- **Transfer between languages (§4.4, Tab. 1):** single-language training gives "slight positive transfer" to the other, e.g. Qwen3-14B trained on Cypher alone scores "(EXE: 74.2 vs. 73.7)" on Spider against its base, "and vice versa for Text2Cypher" (§4.4).
- **Joint against single-language training (§4.4, Tab. 1):** the authors report joint models "consistently outperforming single-task variants across all base models", e.g. Qwen2.5-14B-trained-Both above both single-language versions on all tasks (§4.4).
- **Largest model (Tab. 1):** QwQ-32B-trained-Both against untrained QwQ-32B: Spider 69.8 → 79.2, Text2Cypher exact match 3.7 → 12.0 and BLEU 19.3 → 33.4. The authors say it "approaches or exceeds" o3 and o3-mini, "particularly on Text2Cypher" (§4.4).
- **Zero-shot question answering (§4.5, Tab. 2):** "both SQL- and Cypher-trained models outperform baselines on CRT-QA and CR-LT-KGQA" (§4.5); QwQ-32B-trained-Both gains 8.5% on TableBench and 1.7% on CR-LT-KGQA (abstract).
- **SM3 (App. C, Tab. C1):** untrained models score higher on SQL than on Cypher and much lower on MQL, which the authors link to "data availability during pretraining"; trained models do better on Cypher than SQL, "likely due to Cypher's relative simplicity or the greater effectiveness of our structural reward" (App. C). The authors report joint training raising QwQ-32B over its base on the "completely unseen MQL", and few-shot examples that "further boosts performance across all settings" (App. C).
- **Discussion (§5):** the authors say joint training "acted as an effective regularizer", with "reduced overfitting to domain-specific patterns".

## Limits the authors state

- "The reliance on synthetic datasets—especially for Cypher—may affect generalization to real-world, noisy queries" (§6).
- Fine-tuning on LLM-written traces "may introduce verification noise or bias" (§6).
- The rewards "do not account for query efficiency or execution cost", and "LLM-based judges used for reward computation may not provide fully reliable metrics" (§6).
- "the model assumes schema-aware inputs and has not been tested in interactive or schema-free settings" (§6); interactive and schema-free settings "with user feedback in reward design" are future work (§5).
- CoT plus GRPO "introduces notable computational overhead, potentially limiting accessibility for low-resource users" (§6).
- More evaluation "across more diverse datasets and structural understanding tasks, such as table prediction, would be beneficial" (§6).
- "some indirect overlap exists": Spider "may share some Wikipedia tables with our training data, though this represents a small fraction of the evaluation set", and the QA tasks "may share some tables" with training data, "although they test fundamentally different reasoning capabilities" (§6).
- The SQL and Cypher benchmark scores "are not comparable to each other directly" (§4.4).

## Open problems and building blocks

  - Future work: "(i) support for additional query languages (SPARQL, MQL)", "(iii) probing compositional generalization through specialized benchmarks to assess reasoning depth" (§5); the Conclusion adds "interactive reasoning in agent systems with dynamic data sources" and compositional generalization "under schema drift" (§7).
  - "exploring adaptive weights remains future work" for the reward mix (§3.3.3).
- **Released:** code, "code available at" the authors' GitHub repository (abstract); "Additional hyperparameters are available in our GitHub repository" (§4.2).
- **To reuse it:** open Qwen models from 1.5B to 32B; o3-mini for the traces and the judge reward (§3.2, §3.3.2); VERL or Unsloth (§4.2); "32 H100 GPUs for 60 h for big models" (§4.2).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
