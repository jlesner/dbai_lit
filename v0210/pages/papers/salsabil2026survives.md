# What Survives the Next Model? Benchmarking LLM-Based Techniques Against Single-Prompts

**What Survives the Next Model?** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.00468) · [arXiv](https://arxiv.org/abs/2609.00468)  
Code: [what-survives](https://anonymous.4open.science/r/ICSE2027-What_Survives_The_Next_Model)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests whether one automatically generated prompt on a newer model beats 35 LLM-based software-engineering techniques from ICSE 2026 (abstract).
- Runs two generated prompts (black-box and white-box) on each paper's benchmark, or a sample of it under a $15 budget per paper, scores them with the paper's metric and compares them with its reported result (§IV-C–IV-D).
- Bears on whether a technique outlasts the next model: it reports that a single prompt wins for 37% to 63% of the papers (abstract) (borderline, kept: one generated prompt against harness-based techniques, mixed evaluation).

## In plain words

Software-engineering researchers wrap LLMs in elaborate tools (agents, retrieval, feedback loops). The authors ask whether such tools outlast the next model, motivated by a case where a newer model with one simple prompt solved 81% of a benchmark of proving Rust code correct, against 20% for specialised agents (§I). For 35 LLM-based technique papers from the field's main 2026 conference, an LLM writes two replacement prompts from the paper's text and a few input/output examples, one also describing its method. Each gets one call per input to a newer model, with no refinement, tools or execution feedback, scored with the paper's own metric on its data or a budget-limited sample. The better prompt beats the published result consistently for 37% of the papers, and for 63% when partial wins (some datasets or metrics) count (abstract; §V-A). Code generation and repair are the most replaceable; survivors rely on "strategies that provide additional insights to the model", such as domain-specific procedures or added project knowledge (abstract; §V-B). The authors call their study "the first to systematically investigate" this question (§VI).

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt) · [pass@k](#/glossary/passk) · [fuzzing](#/glossary/fuzzing) · [SQL dialect](#/glossary/sql-dialect) · [benchmark leakage](#/glossary/data-contamination) (its effect here is unknown, §V-D)

**The paper's own terms:**
- **single-prompt (the baseline)**: one automatically generated, few-shot prompt sent in a single call to a newer model; it "involves no iterative refinement, requires no execution loops, and lacks access to external tools or infrastructure" (§I).
- **black-box prompt (P_b) and white-box prompt (P_w)**: the two prompts made for each paper. Both have the fields Role, Task, Input, Output, Example input-output pairs and Instructions; P_b never mentions the paper's method. P_w adds a field, Steps, that "embeds the paper's methodology as internal reasoning guidance" (§IV-B, Tab. I).
- **meta-prompt**: here, a fixed template sent together with a candidate paper to an LLM, which writes that paper's P_b and P_w in one go (§IV-B, Fig. 4). No scoring loop: the template was refined on 5 calibration papers by checking only the prompts' structure, never their task performance (§IV-B).
- **outcome labels**: + when the better of the two prompts "fully outperformed" the paper's technique; ± (mixed) when it won only on some datasets or metrics; − when it "consistently underperformed" (§V-A, Tab. II).
- **task and strategy categories**: each paper gets one or more task labels (code generation, bug finding, repair, impact analysis, requirement formalization, log analysis, test generation, verification) and strategy labels, coded by the authors (§IV-E). The strategies: Knowledge Grounding (injecting project context, API relations, dependency or static-analysis facts), Feedback and Validation (using execution results, tests or compiler messages as feedback), Structured Reasoning (explicit stages, agents or subtasks), Search and Selection (generating candidates and ranking or filtering them), Input/Output Control (constraining or decoding the model's input or output), Domain-Specific Processing (specialised rules, parsers or procedures for one domain), Model Adaptation (training or tuning a model) (§IV-E).
- **half-life**: the authors' word for how long a technique stays useful before newer models make it obsolete (§I, §II).

**Missing glossary terms:**
- **threats to validity**: the software-engineering convention of listing, by type, reasons a study's findings might not hold (§V-D).

**Builds on:**
- Sutton's essay *The Bitter Lesson*, which the authors read as a warning that hand-built workarounds risk being overtaken by scaling (§I).
- The AutoVerus system for LLM-based verification of Rust code and the later VeruSAGE benchmark, their motivating example (§I); not listed here.
- Surveys of LLMs in software engineering and of LLM benchmarks; unlike these, the authors keep tasks and data fixed and swap in a different technique (§II).
- The 35 evaluated ICSE 2026 papers, listed as "Evaluated Papers" [EP1]–[EP35] in the references; one is RISE ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)")), a dialect-translation tool.

## Problem and setting

- **Questions (§III):** RQ1, how well single-prompt inference on a newer model competes with a recent tool; RQ2, which factors make a technique replaceable; RQ3, how much P_w gains over P_b.
- **Papers (§IV-A, Fig. 3):** from the 321 Research Track papers of ICSE 2026 (the International Conference on Software Engineering, "the flagship conference in our field"), the authors keep technique papers that use an LLM, have public artifacts and a full dataset, need no manual evaluation or specialised software, don't focus on the model's internals, and have inputs of manageable size. That leaves 47; they study a random 35.
- **Model (§IV-C):** Claude Sonnet 4.6 (February 2026), called "trailing-edge": the frontier when the study began, cheaper than Opus, and "a capability floor" for later models.
- **Budget (§IV-C, Fig. 5):** $15 of LLM use per paper, with inputs sampled at random. The full dataset fit for 15 papers; 16 got 10% to 70% of it; 4 got 5%–7% and, "since the results were mostly negative, we did not pursue them further".
- **What counts as correct (§IV-D):** each paper's research question that "most directly measures the end-to-end performance" of its technique, with its metrics. For 18 papers the dataset gives explicit ground truth; for 17, it needs execution or a check of the generated output (tests, coverage tools, compilers, semantic equivalence checkers, benchmark harnesses). Each paper got its own evaluator script, cross-reviewed with a common checklist (§IV-E).
- **Baseline numbers:** the "Original Result" column is each paper's reported result; where a paper used several models, the strongest (§V-A).
- **Not discussed:** sampling settings, repeated runs of the prompts, and how the Pass@5 and Pass@10 rows of Tab. II are computed from a single call.

## Approach

- **Prompt generation (§IV-B, Tab. I, Fig. 4; pipeline in Fig. 2):** at least one input/output pair is taken from each paper's dataset, because "the manuscripts themselves rarely detail these concrete execution artifacts"; more where one could not show the full output format.
- **Execution (§IV-C):** inputs are prepared exactly as the paper's technique receives them (the authors redo any preprocessing), then sent with the prompt in one call.
- **Evaluation (§IV-D):** each paper's own protocol is rebuilt. For RISE's dialect translation, for example, identical data are loaded into PostgreSQL and MySQL to compare result sets.
- **Analysis:** outcome labels per paper (§V-A), counts by category (Tab. III), and a task × strategy heatmap scored from −1 (the prompt lost in every paper of the cell) to +1 (won in every one) (Fig. 6).

## Results

- **RQ1 (§V-A, Tab. II):** the prompt consistently beat the original technique for 13 of 35 papers and gave mixed results for 9 more; the authors' summary: between 37% and 63% "of recent SE techniques can be effectively replaced". For RISE ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)")) the prompts reached 60.61 and 61.62 translation accuracy against a reported 97.98 (outcome −).
- **RQ2, tasks (§V-B, Tab. III):** code generation was outperformed in 6 of 9 papers, and in every code-generation paper using Search and Selection. Repair techniques are "somewhat susceptible"; Structured Reasoning repair techniques gave only positive or mixed outcomes. Prompts "could not compete with tasks that require a deeper or specific semantic understanding", such as bug finding; impact analysis had no positive or mixed result.
- **RQ2, strategies (§V-B, Fig. 6):** Search and Selection techniques were the most replaceable (all positive), then Structured Reasoning; Domain-Specific Processing and Knowledge Grounding were the hardest: "a single-prompt struggles when the original approach's advantage comes from specialized procedures learned or constructed for a particular domain", and for Knowledge Grounding "the single-prompt approach could not derive such knowledge internally from the raw task input". The paper's box summary: replacement "remains challenging for Bug Finding, Program Analysis, and Requirement Formalization".
- **Other factors (§V-B):** the authors expected techniques on weaker models to be easier to replace, but "the diversity of models, tasks, and strategies obscures any definitive pattern". The prompt beat every technique evaluated on the code benchmark HumanEval (released 2021); leakage may affect old and new models alike.
- **RQ3 (§V-C, Tab. IV):** P_b beat P_w for 14 papers, P_w beat P_b for 12, and 9 were mixed, so the methodology guidance "did not provide a consistent advantage". Feedback and Validation was the only strategy where P_w came out slightly ahead. A closer look "hints at why": many techniques where P_b wins "depend on components or workflows that cannot be mimicked by the LLM", such as static analysis or a fuzzer. P_w prompts use on average 80% more tokens, which the authors conjecture "acts as a distraction" when the model can't use it; average cost per paper was $6.5 for P_b and $7.5 for P_w.

## Limits the authors state

- ICSE papers do "not capture the breath of software engineering", and model access changes (deprecation, cost, regional restrictions) may limit generalization (§V-D "External Validity").
- The replication "can only guarantee a best-effort approximation"; the categorization "may not be sufficient more broadly"; the budget limited depth for some papers; training exposure to benchmarks is "an unquantifiable threat" (§V-D "Internal Validity").
- The outcome labels are "necessarily coarse" and may miss smaller patterns (§V-D "Construct Validity").
- Heterogeneity and the small sample "prevent us from conducting a statistical significance tests"; findings are "indicative trends rather than definitive causal relationships" (§V-D "Conclusion Validity").
- Limits "regarding fixed execution budgets, dataset sampling constraints, and categorization schemas"; the work is "just the first step in this line of inquiry" (§VI).
- By design the model may not invoke tools or receive feedback (§V-C).

## Open problems and building blocks

- **Open:** "a natural next step is to explore agentic implementations" (§V-C); whether placing single prompts "within a basic loop, delegated to agents, or granted access to other tools" closes the remaining gaps, "something that future work should explicitly investigate" (§VI); future evaluations should use "multiple contemporary benchmarks" (§V-B); research should establish "where symbolic approaches can add complementary value" (§VI).
- **Released:** "Our source codes and results are made publicly available" (abstract); the evaluator scripts, generated outputs and results are in the replication repository (§IV-D).
- **To reuse it:** Claude Sonnet 4.6; up to $15 per paper; at least one input/output example from each target paper's dataset (§IV-B); a hand-built evaluator per paper, taking "several hours" each, sometimes with Docker environments (§IV-D).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [SQL dialect translation](#/challenges/dialect_translation) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
