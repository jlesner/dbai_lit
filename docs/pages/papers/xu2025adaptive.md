# Adaptive LLM-Symbolic Reasoning via Dynamic Logical Solver Composition

**Adaptive LLM-Symbolic Reasoning via…** · EACL 2026 (Volume 1: Long Papers)

Read: [PDF](https://arxiv.org/pdf/2510.06774) · [arXiv](https://arxiv.org/abs/2510.06774) · [DOI](https://doi.org/10.18653/v1/2026.eacl-long.54)  
Code: [adaptive_symbolic_reasoning](https://github.com/idiap/adaptive_symbolic_reasoning)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM reads a natural-language input, splits it into its problems and labels each with the kind of formal reasoning it needs (logic programming, first-order logic, constraint satisfaction or SMT); a router sends each problem to the matching solver, whose LLM front end translates it into that solver's language (abstract; §2, Fig. 1, Alg. 1).
- Solvers Pyke, Prover9, MiniZinc and Z3 (§3.1); GPT-4o, DeepSeek-V3.1 and three 7–8B open models, against zero-shot, chain-of-thought and symbolic chain-of-thought prompting with and without the router's hint, on PrOntoQA, ProofWriter, FOLIO, LogDed7 and TREC clinical-trial matching, alone and shuffled into one Mixed set, plus three-problem inputs (§3.1, §3.6); a random-routing ablation (§3.4, Tab. 3); the small models fine-tuned with LoRA on GPT-4o formalizations that run (§3.3, App. D.3).
- Evidence on choosing among several engines, not only using one: the authors report that frontier models pick the solver with routing accuracy "exceeding 98%" (§3.2, Tab. 1), and name "the auto-formalization stage" as "the primary factor hindering overall reasoning performance" (published §5): "Invalid Formalization constitutes the predominant error type for open-source models", while GPT-4o's errors are "primarily categorized as Semantic Errors", which typically come from formal code that is valid but wrong, or from the solver's output mapped to the wrong label (§3.7, Fig. 4).

## In plain words

An LLM can hand a logic problem to a solver by translating it into the solver's input language, but existing systems mostly fix the solver, and so the kind of logic, at design time (abstract); the authors argue that this "static paradigm" limits them on inputs that mix problem types (§1). They build a pipeline in which an LLM splits an input into its problems and labels each with the kind of formal reasoning it needs; a router then sends each problem to a matching solver, whose LLM front end translates it into that solver's language (abstract; §2). On a shuffled mix of five logic, constraint and clinical-trial benchmarks, GPT-4o picks the expected solver 98.0% of the time, and the pipeline answers 92.1% correctly, against 75.1% for the best prompting baseline, zero-shot prompting given the router's label (Tab. 1). Small open models pick solvers fairly well but often write solver code that doesn't run; fine-tuning on GPT-4o's code helps (§3.3). The authors call it a "novel framework" (§1) and say it "establishes the foundations for adaptive LLM-symbolic reasoning" (abstract).

## Background and terms

**Terms to know:** [autoformalization](#/glossary/autoformalization) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [logic programming](#/glossary/logic-programming) · [first-order logic](#/glossary/first-order-logic) · [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [pass@k](#/glossary/passk) · [Distillation into compact models](#/glossary/distillation) · [LoRA](#/glossary/lora-low-rank-adaptation)

**The paper's own terms:**
- **reasoning type**: the label given to each problem: LP (logic programming), FOL (first-order logic), CSP (constraint satisfaction problems) or SMT (satisfiability modulo theories); the definition leaves the set open with "…" (§2).
- **problem decomposition** (the Parser): an LLM step that finds how many problems an input holds, types each, and splits each into its "key components" (e.g. premises, hypothesis, options), returned as JSON (§2; App. F).
- **Router**: an LLM step that picks a solver per problem and writes an execution plan, a graph of modules that pass results through a shared Memory; when no solver fits, it "will instantiate a neural solver modules with LLM" (§2; App. B; App. G).
- **routing accuracy**: "the proportion of test cases where the Router correctly selects the expected solver" (§3.2).
- **autoformalization** (this paper's sense): an LLM translating each problem component into one solver's input syntax: rules for Pyke (a Python rule engine), formulas for Prover9 (a first-order theorem prover), SMT-LIB (the standard SMT input format) for Z3, models in MiniZinc (a constraint-modelling language) (§2; App. A).
- **Zero-shot, CoT, CoT_sym**: the prompting baselines: answer directly; answer with step-by-step reasoning; or translate the problem into a formal language and then reason over that with the LLM, no solver (Symbolic CoT) (§3.1; App. D.2).
- **w/o routing, w/ routing**: a baseline run plain, or with the Router's output prepended "as an auxiliary hint"; for CoT_sym with routing, the model is given the solver agent's formalization instead of writing its own (App. D.2).
- **Mixed**: all five benchmarks rewritten into one natural-language format by templates, then shuffled and merged, so the type must be inferred (§3.1; App. H).
- **Overall Accuracy**: on inputs of three concatenated problems, the share with all three answers right (§3.6).

**Missing glossary terms:** none.

**Builds on:**
- Logic-LM (Pan et al., 2023; [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), which supports several solvers but "requires specifying the reasoning strategy at design time" (§1); its data splits are reused (App. C; App. D.3).
- Single-paradigm translators: LogicLLaMA (first-order logic), Sat-LM (Boolean satisfiability) and LINC (first-order logic, published §1); and VERUS-LM, a framework that keeps domain knowledge separate from queries, which, with Logic-LM, the authors say "still largely rely on static solver integration" (§4).
- Symbolic CoT (Xu et al., 2024), the CoT_sym baseline (§3.1), and PEIRCE (Quan et al., 2025a; symbolic provers critique LLM hypotheses, arXiv v1 §4), whose "controlled autoformalization method" the LP and FOL solvers use (App. A.1).
- REST (Pan et al., 2025), a test posing several problems in one prompt, which inspired §3.6.

## Problem and setting

- **Question:** can an LLM find each problem's reasoning type, and so its solver, from raw natural language, and does composing solvers this way beat prompting, also on inputs mixing several problems (§1; §2)?
- **Input:** natural language "without prior knowledge of reasoning characteristics" (§2), with answer options (App. A).
- **Solvers:** Pyke (rule-based inference) for LP, Prover9 (first-order deduction) for FOL, Z3 (satisfiability of constraints) for SMT, and MiniZinc with the Gecode solver (combinatorial search) for CSP (§3.1; App. A.2).
- **Benchmarks** (§3.1; App. C), each assigned one type by the authors: PrOntoQA (synthetic five-hop deduction, 500 examples) and ProofWriter (depth-5 deduction, 600, labels proved, disproved or unknown) as LP; FOLIO (expert-written first-order problems, 204) as FOL; LogDed7 (ordering 7 objects, 700) from Logical Deduction in BIG-bench (a large collection of LLM tasks) as CSP; TREC_trials (300 trial–patient pairs) from the TREC 2021 Clinical Trials Track (a shared task on matching patients to trials) as SMT.
- **Metric:** accuracy against the gold label; pass@1 (one run) for GPT-4o and DeepSeek-V3.1, "To manage inference costs", and the mean of three seeds for small models (§3.1).
- **Models:** GPT-4o, DeepSeek-V3.1 (an open 671B-parameter model, Tab. 5), and the 7–8B Llama-3.1-8B, Qwen-2.5-7B and Qwen-2.5-Coder-7B; small models decompose and route with their pretrained versions (§3.1).
- **Fine-tuning data:** GPT-4o formalizations of training problems, kept only when the solver runs them, 5,125 in all (App. D.3, Tab. 6); LoRA, three epochs, two H100 GPUs (App. D.3).

## Approach

- **Three stages** (§2, Fig. 1, Alg. 1): decompose, route, reason.
- **Solver agents** (App. A): each derives from a base class, `LLMToolAgent`, with methods for formalizing, reasoning with the engine, and converting the result to an option label; new solvers are added by instantiating this interface (App. A.1). The LP and FOL solvers repair generated code that returns an error by "iterative refinement" from the error message (App. A.1), a form of [self-correction](#/glossary/self-correction).
- **Ablations** (§3.4): solvers assigned at random, each formalizing the original text; and, in the published PDF, a reading of the "w/ routing" baselines as the framework with the solver call bypassed.

## Results

- **Mixed set, frontier models** (§3.2, §3.4, Tab. 1): GPT-4o with the framework scores 92.1%, against 75.1% for zero-shot with the routing hint, the strongest alternative; the published abstract and §3.4 give the margins as "17% and 6% for GPT-4o and DeepSeek-V3.1"
- **Not best everywhere:** Tab. 1 bolds a prompting baseline on FOLIO for both models, and on LogDed7 and TREC_trials for DeepSeek-V3.1; the authors explain the weak FOLIO results by "the difference in formalizing first-order vs propositional logic" (propositional logic: true/false statements without objects or quantifiers), and DeepSeek-V3.1's lag behind GPT-4o, despite better routing, "primarily" by "differences in formalization quality" (§3.2).
- **Routing accuracy** (Tab. 1, Tab. 2): 98.0 for GPT-4o, 99.3 for DeepSeek-V3.1, 97.7 for Qwen-2.5-7B, 92.9 for Qwen-2.5-Coder-7B and 76.8 for Llama-3.1-8B.
- **The hint helps prompting** "in most cases, particularly for GPT-4o", most for CoT_sym (§3.2); with DeepSeek-V3.1, zero-shot and CoT score lower with the hint on Mixed (Tab. 1).
- **Small models** (§3.3, Tab. 2): the framework with pretrained small models scores 8.0, 12.6 and 26.2 on Mixed (Llama, Qwen, Qwen-Coder); after fine-tuning, 41.0, 50.1 and 59.6. Only Qwen-2.5-Coder-7B's fine-tuned framework is the best entry of its block on Mixed (Tab. 2, bold). The authors say pre-trained small models "lack structural abstraction over formal languages", which are "all 'under-resourced' formal languages" (§3.3).
- **Random routing** (§3.4, Tab. 3): GPT-4o falls from 92.1 to 29.0, and the authors report "significant performance degradation across all models".
- **Difficulty** (§3.5, Figs. 2–3; GPT-4o on 3, 5 and 7 objects): in the published text, zero-shot and CoT "fluctuate significantly" while the framework "maintains a stable accuracy profile"; it is slightly lower on LogDed3 than LogDed7, which the authors attribute to more Incorrect Decomposition (misclassifying the problem type, §3.7) on short problems. No value labels in the figure.
- **Three problems per input** (§3.6, Tab. 4): Overall Accuracy 54.4 for the framework, against 38.2 for CoT_sym with the hint and 27.3 at best without it.
- **Errors** (§1; §3.7, Fig. 4): for small models, "60-80% of errors stemming from invalid formalization" (§1); Invalid Formalization dominates for open-source models, DeepSeek included, and is "significantly reduced via fine-tuning"; GPT-4o's errors are "primarily categorized as Semantic Errors", which typically come from valid code that is wrong or a solver result mapped to the wrong label (§3.7).
- **Cost** (published App. L; 10 problems per type, GPT-4o and Qwen-2.5-Coder-7B): more inference time than zero-shot or single-pass CoT, from the extra LLM calls (App. L.1, Tab. 9); solver run time is "minimal" (App. L.2, Tab. 10).

## Limits the authors state

- **Model scale:** pretrained 7–8B models "show significant performance degradation when integrated with external solvers"; effective LLM-symbolic reasoning "may be constrained to frontier models or require substantial fine-tuning investments for smaller models" (Limitations).
- **Formalization bottleneck:** performance is "fundamentally limited by the quality of auto-formalization", which "may still limit the framework's applicability to domains with complex or non-standard logical structures"; they name "Few-shot learning approaches or domain-specific fine-tuning strategies" as ways to address it (Limitations).
- **Solver coverage:** four solver types; "Mathematical reasoning, probabilistic inference, temporal logic, and other specialized reasoning domains are not addressed", though new solvers can be added "without modifying the core routing framework" (Limitations).
- **Controlled benchmarks** (published §5 only): "the current benchmarks remain relatively controlled"; later work is to test "more heterogeneous and practical scenarios where reasoning requirements are more implicit and complex".
- **TREC labels:** "should be considered approximate rather than definitive", since patient descriptions typically don't cover all the variables in the trial criteria (App. C); unmentioned values needing guesses "are the norm in the TREC dataset" (App. J).
- **Latency:** the extra LLM calls are "a trade-off for the enhanced logical consistency and interpretability" (published App. L.1).

## Open problems and building blocks

- **Open:** "the path toward more capable neuro-symbolic agents lies in enhancing the reliability of formalization interfaces – perhaps through intermediate representations or iterative feedback loops" (published §5).
- **Released:** "The code and data are available online" (abstract footnote, published PDF; the arXiv v1 PDF prints no such statement).
- **To reuse it:** the four engines Pyke, Prover9, Z3 and MiniZinc with Gecode (§3.1; App. A); a frontier model, or 7–8B models fine-tuned with LoRA on teacher formalizations, for writing solver code (Limitations; §3.3; App. D.3); multiple-choice answers, which the converter maps solver output onto (App. A).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
