# SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning

**SemCoder** · NeurIPS 2024

Read: [PDF](https://arxiv.org/pdf/2406.01006) · [arXiv](https://arxiv.org/abs/2406.01006)  
Code: [SemCoder](https://github.com/ARiSE-Lab/SemCoder)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Fine-tunes DeepSeekCoder-6.7B jointly on writing Python from English and on "monologue reasoning", natural-language explanations of a function's purpose, the properties and constraints that always hold, and its execution, forward to the output and backward to a possible input; the authors report "competitive performance with GPT-3.5-turbo on code generation and execution reasoning tasks" (abstract; §6.1, Tab. 1), and that SemCoder-S, the variant also trained on extra instruction data, outperforms four open instruction-tuned models at iterative debugging and self-refinement (§6.3, Tab. 3).
- Data (PyX): GPT-3.5-turbo writes problems from parsable code seeds and only solutions that run are kept (§3.1, §5); a teacher LLM writes monologues, kept only when the predicted output or input matches execution (rejection sampling, §4.2.3); PyX-R keeps debugging rationales whose patches pass differential testing against the ground truth (§3.3).
- Weight-space evidence on training a code model to predict execution, with answers a program checks, alongside generation; the check is on final answers only, and the authors report intermediate monologue steps "occasionally flawed" (App. A); they report that about 26.9% of OSS-Instruct's 43.1k LLM-written Python solutions do not execute (§3.1).

## In plain words

Code models trained mostly on source text often miss what a program does when it runs, which the authors say often leads to poor debugging and repair (abstract; §1). They fine-tune a 6.7-billion-parameter code model, SemCoder, jointly on writing Python from English and "monologue reasoning", where the model explains in words what a function is for, which properties always hold, and how the variables change, forward from an input to the output or backward from an output to a possible input (abstract; §4). A more powerful model writes these explanations; only those whose prediction a real run confirms are kept (§4.2.3; App. A). Prompted to reason this way, both SemCoder variants beat GPT-3.5-turbo, prompted with chain of thought, at predicting code's inputs and outputs on two benchmarks; SemCoder-S, trained with extra instruction data, also beats it on the HumanEval code-writing benchmark (scored by first-try pass rate) (§5; §6.1, Tab. 1). Over five rounds of testing and fixing its own code on two benchmarks, SemCoder-S outperforms four open models of similar size (§6.3). The authors present monologue reasoning as "a novel strategy" (abstract).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) (results are pass@1: the first answer must pass the tests) · [rejection sampling](#/glossary/rejection-sampling) · [self-correction](#/glossary/self-correction) · [automated program repair](#/glossary/automated-program-repair) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [data contamination](#/glossary/data-contamination) · [branch and path coverage](#/glossary/branch-and-path-coverage) · [execution trace](#/glossary/execution-trace) (§1) · [output and input prediction](#/glossary/output-and-input-prediction) (the two execution-reasoning tasks, §5, App. H) · [rubber-duck debugging](#/glossary/rubber-duck-debugging) ("human verbal debugging", abstract; evaluated as "verbally and statically explaining why the bug happens", §6.3)

**The paper's own terms:**
- **Program semantics, four modalities** (§2): *approximate* (a program's purpose in English, as in a docstring), *symbolic* (meaning carried by the code's symbols and structure), *operational* (how each step changes the program's state) and *abstract* (key properties and constraints that hold for every input). Apart from the code, the training data states them in natural language (abstract).
- **Monologue reasoning** (§1; §4.2): the model explains code to itself, from purpose to properties to execution, given the code and an input or output but not the original English description (§4.2).
- **Forward monologue** (§4.2.1): from code and an input, a step-by-step account of the lines with side effects, each loop iteration and each variable change, ending in the predicted output.
- **Backward monologue** (§4.2.2): from code and an output, a description of earlier states as abstract constraints where they cannot be uniquely determined (e.g. after sorting or aggregation), then a concrete input that satisfies them.
- **PyX** (§3): the authors' synthetic dataset of executable Python problems with English descriptions, solutions and tests. **PyX-R** (§3.3): buggy LLM-written solutions to PyX problems, each with a debugging rationale and a patch (App. F).
- **[Differential testing](#/glossary/differential-testing) against the ground truth** (§3.3): the check a PyX-R patch must pass: its outputs must match the ground truth's.
- **SemCoder and SemCoder-S** (§5): the base version is trained only on PyX; SemCoder-S also on Evol-instruct (decontaminated instruction-following data) and 4.3k CodeContest (competitive-programming) problems with at least one correct LLM-written solution.
- **Task-specific prefix** (§4.3; App. H): an instruction at the start of each training example naming its task.

**Missing glossary terms:** none.

**Builds on:**
- OSS-Instruct [16] (Magicoder's generator: an LLM writes a problem and solution inspired by a code snippet), which the authors improve with parsable seeds and execution filtering (§3.1). Not on this site.
- Scratchpad [2] (intermediate states written out) and NExT [13] (code models reasoning over execution traces), the trace formats monologues are compared with (§1; §6.2); PyX-R's refine plans follow NExT (§1). Not on this site.
- Self-Debugging [39] ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and CYCLE [40]: the iterative self-refinement setting of the evaluation (§5).
- EvalPlus [31] ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")): a benchmark here, and the input-expansion method the authors follow (§3.2).

## Problem and setting

- **The question:** does training a code model to reason about program semantics at several levels, alongside writing code, make it better at generating code, reasoning about its execution, debugging and refining it (§1)?
- **Programs:** Python; PyX's are synthetic, "relatively short single-function programs that do not have complicated branches" (App. F). The execution data excludes programs that interact with external resources (e.g. keyboard input, file system changes), because the trace representation "only captures variable state changes", and programs with randomness (§3.2). Interactions with resources "commonly required in scenarios like database, web and UI design are not allowed" in the execution environment (App. F).
- **What counts as correct:** a forward monologue is accepted when its predicted output matches the actual output; backward monologues follow "a similar strategy" (§4.2.3). Generated code is scored by the benchmarks' tests, reported as pass@1 (§6.1).
- **Models:** DeepSeekCoder-6.7B base is the starting point (§5). GPT-3.5-turbo writes the coding problems; GPT-4o-mini writes solutions and monologues (§5).
- **Benchmarks:** EvalPlus (HumanEval+ and MBPP+, Python function-writing problems with extra tests) and LiveCodeBench-Lite (a code-generation set) for generation; CRUXEval (short Python functions; input and output prediction, CRUXEval-I and CRUXEval-O) and LiveCodeBench's code-execution task (LCB-Exec) for execution reasoning (§5).
- **Prompting:** baselines get two-shot chain-of-thought prompts, SemCoder a zero-shot monologue prompt; "Inferences all follow the benchmark's original settings" (§5).
- **Baselines:** 13 open models of the Code Llama, StarCoder2, DeepSeekCoder and Magicoder families (6.7B–15B, base and instruct), and GPT-3.5-turbo (§6.1).
- **Decontamination:** monologue samples sharing an input–output pair with CRUXEval are removed (App. F).

## Approach

- **PyX (§3.1–3.2; App. F, Fig. 4).** Seeds are syntax-tree fragments of existing programs, so they parse; an LLM writes a problem and solution in the OSS-Instruct style; failing code goes back to the generator to debug "until the code runs correctly", and only samples that run are kept. For the execution subset, inputs are expanded by type-aware mutation (changing known inputs by rules for each data type) and LLM generation, each kept if it runs without exceptions; the inputs and their outputs become unit tests (App. F).
- **Monologues (§4.2; Fig. 2; App. G).** Forward and backward monologues as defined above.
- **Annotation by rejection sampling (§4.2.3).** The LLM writes a monologue from few-shot examples and system instructions; the code is executed, and the monologue is kept if the actual output matches its prediction and rejected otherwise.
- **Joint training (§4.3).** One model is trained on English-to-code examples and forward and backward monologues with next-token prediction; the loss counts only code and monologue tokens.
- **PyX-R (§3.3; App. F, Example 2).** An LLM's solutions to PyX problems that fail at least one test are kept as buggy code; rubber-duck debugging rationales are rejection-sampled, and only those that lead to correct patches are kept.

## Results

Each result is the authors' claim.
- **Main comparison (§6.1, Tab. 1).** SemCoder-S against GPT-3.5-turbo: HumanEval 79.3 vs 76.8, LiveCodeBench-Lite 27.5 vs 23.9, CRUXEval-I 63.6 vs 50.3, CRUXEval-O 63.9 vs 59.0 (abstract; Tab. 1); GPT-3.5-turbo stays ahead on MBPP. The conclusion says the SemCoder variants achieve "SOTA performance, among all less-than-15B open-source models" in generation, input and output prediction, debugging and self-refinement (§8).
- **Gain over the starting checkpoint (§6.1).** SemCoder beats DeepSeekCoder-6.7B by 23.0, 23.9 and 23.6 points on CRUXEval-I, CRUXEval-O and LCB-Exec.
- **Reasoning against direct answers (§6.1; App. C.2, Tab. 5).** Free-form chain of thought "can hardly help model reason about execution", while monologue reasoning gives "up to 21.7% absolute improvement in output prediction" over answering directly.
- **Monologues against traces (§6.2, Tab. 2).** DeepSeekCoder-6.7B base fine-tuned for 3 epochs on the same PyX samples in each format: monologues reach 61.8 / 63.5 / 58.5 on CRUXEval-I / CRUXEval-O / LCB-Exec, the trace formats (scratchpad, NExT, and the authors' concise trace) at most 52.1 / 55.6 / 39.9, and few-shot prompting without training 39.5 / 41.2 / 36.1. The authors attribute the gap to monologues "keeping track of only key properties and values".
- **Debugging and self-refinement (§6.3, Tab. 3).** Five rounds on EvalPlus with greedy decoding, against Llama-3.1-Instruct-8B, DeepSeekCoder-Instruct-6.7B, Magicoder-DS and Magicoder-S-DS: zero-shot, SemCoder-S reaches 84.8 on HumanEval against 77.4 for the best baseline. The authors report that fine-tuning on PyX-R "significantly improves iterative programming performance", less so for some models. Rationales with real traces in NExT's format instead of monologue reasoning are "comparably effective" (§6.3; App. C.1, Tab. 4). SemCoder-S keeps improving over refinement steps, also at high temperature (App. D, Fig. 3).
- **Data quality (§3.1; App. E–F).** About 26.9% (11.6k of 43.1k) of OSS-Instruct's Python solutions do not execute (§3.1; error types in Tab. 7). Training on PyX alone performs "just marginally better" than OSS-Instruct on code generation (Tab. 8), and the authors conclude that executable-only training "does not necessarily improve" it (App. F).

## Limits the authors state

- Intermediate reasoning in the monologues and PyX-R rationales is "occasionally flawed": the model "makes incorrect assumptions about code properties but still reaches the right result", which "might have negative impacts" on further improving code reasoning; they encourage automatic process supervision for code reasoning (App. A; also §6.2).
- Annotation relies on "a more powerful LLM", "since our base model is relatively small with 6.7B parameters"; they encourage trying the training on a larger base model that could write its own monologues, as Ni et al. [13] did (App. A).
- PyX-R "provides limited improvement" to the SemCoder variants and Llama-3.1-Inst; the authors "speculate" that these models "are already trained with high-quality reasoning" and that "occasional errors in PyX-R debugging rationale" hold them back (§6.3).
- Input generation seeks only diversity of values and "does not try to fully exercise different execution paths", as coverage-guided testing does; for short single-function programs the authors call the approach "light-weight yet effective for the current setting" (App. F).
- "It is possible but unlikely" that the models generate buggy or wrong code; the authors suggest using them to assist developers rather than for full automation (App. B).

## Open problems and building blocks

- **Open:** have the model "first self-verify its own solution by generating forward monologue" for the test cases in the specification before finalizing it, and use its own execution reasoning directly in generation and self-refinement (App. A). The other two directions of App. A are under Limits.
- **Released:** "all the data, code, and model checkpoints" (App. B; also abstract).
- **To reuse it:** DeepSeekCoder-6.7B base as the starting checkpoint; GPT-3.5-turbo for problems and GPT-4o-mini for solutions and monologues; training for 2 epochs on eight NVIDIA RTX A6000 GPUs with batch size 512 and context length 2,048 (§5); a Python interpreter to run every sample (§3.1; §4.2.3); programs without external resources or randomness (§3.2).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
