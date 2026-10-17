# CodeI/O: Condensing Reasoning Patterns via Code Input-Output Prediction

**CodeI/O** · ICML 2025

Read: [PDF](https://arxiv.org/pdf/2502.07316) · [arXiv](https://arxiv.org/abs/2502.07316)  
Code: [CodeIO](https://github.com/hkust-nlp/CodeIO)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A first training stage before instruction tuning in which a model predicts, in a natural-language chain of thought, a function's output for a given input or a feasible input for a given output; the authors report gains over a single-stage baseline and over other first-stage datasets across symbolic, scientific, logic, math and commonsense benchmarks on four base models of 7B–27B parameters (abstract; §3.2, Tab. 1).
- DeepSeek-V2.5 rewrites about 810K raw code files (mostly Python) into executable functions with a query and a random input generator; running them gives input–output pairs, and DeepSeek-V2.5 writes the reasoning; predictions are checked by matching the output or re-running the code on the predicted input, and wrong ones get one feedback-driven revision concatenated into the response (CodeI/O++) (§2.1–2.4; App. C.1).
- Evidence in weight space on whether training on answers a program checks carries over to other reasoning, though most benchmarks used are still checkable; wrong teacher responses are kept in training, because the authors report that filtering them out "results in a general performance drop" (§4.1, Tab. 2), and they report that "in general, in first turn, 50% of the responses are correct" (§2.4).

## In plain words

Math and code have plenty of training data, but the authors argue that most other reasoning domains, such as logical deduction, scientific inference and symbolic reasoning, suffer "from sparse and fragmented supervision signals" (§1). They turn Python files into a training task: given a function, a problem statement and an input, predict the output; or given an output, find an input that produces it, reasoning in plain language, not code. A strong model, DeepSeek-V2.5, writes the reasoning; running the code checks every answer. In CodeI/O++, a wrong answer gets feedback and one retry, and both attempts are kept (§2). It is an extra stage before instruction tuning. On four base models of 7B to 27B parameters, the authors report higher average scores than instruction tuning alone and than other first-stage datasets of similar or larger size, with gains on most benchmarks but "nearly unchanged or even decreased performance on a small number of tasks" (§3.2, Tab. 1). They present it as "the first to train LLMs on large-scale, diverse code input-output predictions" for reasoning beyond code (§5).

## Background and terms

**Terms to know:** [Distillation into compact models](#/glossary/distillation) · [rejection sampling](#/glossary/rejection-sampling) · [self-correction](#/glossary/self-correction) · [data contamination](#/glossary/data-contamination) · [mixture of experts](#/glossary/mixture-of-experts-moe) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [continual pre-training](#/glossary/continual-pre-training) (CodeI/O is placed as a stage "Similar to continual pre-training on raw code", §1; the Python-Edu baseline uses "a standard language modeling loss", §3.1)

**The paper's own terms:**
- **CodeI/O**: the approach, and its dataset of about 3.5M prediction samples whose reasoning DeepSeek-V2.5 wrote in one turn, kept whether right or wrong (§1, §2.4).
- **CodeI/O++**: the same samples after one revision turn; the training response joins turn 1, its feedback, turn 2 and its feedback, with feedback "Success" when turn 1 was right (§2.4; a full sample in Tab. 11).
- **Input prediction and output prediction**: predict "feasible inputs given outputs" or "the execution outputs given inputs" (§1).
- **Unified format**: what DeepSeek-V2.5 rewrites each raw file into: cleaned reference code; a main entrypoint function whose inputs and outputs are JSON-serializable; a description of those inputs and outputs; a rule-based Python input generator that draws random valid inputs; and a query, a short problem statement (§2.2; example in Tab. 10).
- **CodeMix and PyEdu-R**: the two main code sources. CodeMix is in-house Python, minus overly simple or complex files; PyEdu-R is the part of Python-Edu on complex reasoning such as STEM, system modelling or logic puzzles, with algorithm and non-reasoning files removed (§2.1, App. C.1).
- **"2nd Stage Only"**: the main baseline, instruction tuning without the CodeI/O stage (§3.1).
- **LeetCode-O and BBH-ZH**: benchmarks the authors built. LeetCode-O asks for the outputs of LeetCode problems (an online coding-practice site) from the problem text alone, without code; a problem scores only if every output is right in both its English and Chinese versions. BBH-ZH translates 9 tasks of BBH (BIG-Bench Hard, 23 tasks hard for language models) into Chinese (App. B).

**Missing glossary terms:** none.

**Builds on:**
- Python-Edu (Ben Allal et al., 2024), a corpus of Python files scored for educational quality: the source of PyEdu-R and a raw-code baseline (§2.1, §3.1, App. C.1).
- CRUXEval (Gu et al., 2024), a benchmark for predicting a Python function's input or output, and earlier work on learning code execution, most of which, the authors say, targets output prediction alone or code generation (§5).
- Jiang et al. (2024b), who also learn from code execution for general reasoning, "but the involved functions are mainly LeetCode ones" (§5).
- Rejection sampling for training data (Yuan et al., 2023), which the authors test and set aside (§2.4, §4.1).

## Problem and setting

- **Question:** does learning to predict code inputs and outputs, reasoning in natural language, improve reasoning beyond code (§1)?
- **Data:** about 810.5K raw files (§2.1) give 3.5M instances from 454.9K files, roughly half of each kind (§2.3). Functions "that include randomness" are skipped so that outputs are deterministic (§2.3); each run has a 5-second limit, and inputs and outputs are capped in size, e.g. lists "less than 20" long and strings "no longer than 100 characters" (App. A).
- **Teacher** (the stronger model whose outputs the trained model learns from): DeepSeek-V2.5 does the rewriting and writes all responses (§2.2, §2.4). The prompt includes the reference code as a "Tip" (Fig. 8).
- **Models:** the base models Qwen 2.5 Coder 7B, LLaMA 3.1 8B, DeepSeek Coder v2 Lite 16B (a mixture-of-experts model) and Gemma 2 27B (§3.1, Tab. 1). Stage 2 uses an in-house instruction-tuning set of about 1.18M samples in several languages (§3.1); App. F repeats the Qwen runs with the public Tulu-3 data (Lambert et al., 2024; [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)")).
- **Benchmarks** (§3.1, App. B): DROP (numerical reasoning in reading comprehension), WinoGrande (commonsense pronoun resolution), GSM8K and MATH (grade-school and competition math), MMLU-STEM (STEM exam questions), BBH, GPQA (expert science questions), CRUXEval, ZebraLogic (logic-grid puzzles), KorBench (tasks with newly defined rules), LiveBench (a refreshed benchmark, without its code-generation and instruction-following tasks), BBH-ZH and LeetCode-O. Greedy decoding and zero-shot, except 3-shot for BBH and BBH-ZH (§3.1).
- **Correct** means the predicted output matches the stored ground truth, or the code re-run on the predicted input gives the stated output (abstract).
- **Baselines** (§3.1): stage 2 alone; and as stage 1, WebInstruct (instruction data mined from the web and refined by LLMs), OpenMathInstruct-2 (math problems augmented from GSM8K and MATH), OpenCoder-SFT-Stage-1 (question–answer pairs synthesized from code) and raw Python-Edu. WebInstruct and OpenMathInstruct-2 are cut to 3.5M samples "for most experiments", with full-size runs on Qwen.

## Approach

- **Collect and rewrite** (§2.1–2.2): code from CodeMix, PyEdu-R and smaller sources (App. C.1), rewritten into the unified format.
- **Input–output pairs** (§2.3): inputs drawn from the generator, outputs by execution; at most 3, 6 or 10 pairs per function depending on the source (App. C.2).
- **Responses** (§2.4): a natural-language chain of thought ending in a JSON answer (Fig. 2, Fig. 8). The authors chose LLM-written reasoning over execution traces because "Obtaining a deterministic reverse function for input prediction is impractical" and template traces lack the expressiveness and generalizability of free-form reasoning (§2.4).
- **Check and revise** (§2.4): every prediction is checked by execution. A wrong output prediction is told it is wrong; a wrong input prediction also gets the output its input really produces; execution errors are reported. DeepSeek-V2.5 answers once more, the new answer is re-checked, and all responses, correct or not, are kept.
- **Two-stage training** (§3.1, App. E), in most experiments: one epoch on CodeI/O or CodeI/O++, then instruction tuning; mixing the much larger CodeI/O data into the instruction data "would result in a biased distribution" (§3.1).

## Results

- **Main comparison** (§3.2, Tab. 1): on Qwen 2.5 Coder 7B the average goes from 54.8 (stage 2 only) to 57.2 with CodeI/O and 57.7 with CodeI/O++, against 56.0 for the best other dataset, the full 14M-sample OpenMathInstruct-2. The authors report that other datasets "may excel in specific tasks (e.g., OpenMathInstruct2 on math) but regress in others", while CodeI/O "shows consistent improvements"; raw Python-Edu gives "only minor, and occasionally even negative, improvements" (§3.2).
- **Input against output prediction** (§4.1, Tab. 2): "generally similar"; input prediction helps KorBench but slightly hurts GPQA, output prediction helps symbolic tasks such as BBH more.
- **Rejection sampling** (§4.1, Tab. 2): dropping wrong responses (about half the data) gives an average of 56.5 and replacing them with bare ground-truth answers 56.6, against 57.2 for full CodeI/O and 56.7 for a ∼50% subset of it; the authors suggest "a loss of data diversity".
- **Teacher** (§4.2, Fig. 3): WebInstruct with responses re-generated by DeepSeek-V2.5 beats the original but stays below CodeI/O on Qwen and LLaMA: improvement "beyond mere knowledge Distillation into compact models from an advanced model", the authors conclude.
- **Scaling** (§4.3, Fig. 4): more samples "generally" help; more pairs per function help too, though less.
- **Data format** (§4.4, Tab. 3): query and code in the prompt with reasoning in the response scores best; the query in the prompt and code in the response, like plain code generation, scores worst (54.9 against 57.2).
- **Revision turns** (§2.4, §4.5, Fig. 5, App. D): "In general", 50% of first-turn responses are correct and 10% of the wrong ones are fixed in the second turn (§2.4; approximately 16% for input and 10% for output prediction in App. D). A further turn fixes far fewer and gives a slight gain on LLaMA but a drop on Qwen (§4.5).
- **Two stages** (§4.6, Tab. 4): all two-stage variants beat single-stage training; the effect of mixing data "varies across models".
- **Contamination** (§4.7, Tab. 5–6): a check that tags a test question when any 13-gram of it (a run of 13 consecutive text units; punctuation, numbers and spaces removed) appears in the training data marks 21.5% of LeetCode-O as potentially leaked, KorBench less and most others none; gains on the unleaked parts are similar to those on the full sets (Tab. 6).
- **Other instruction data** (App. F, Tab. 9): with Tulu-3 as stage 2, both CodeI/O and CodeI/O++ still raise the average above stage 2 alone.

## Limits the authors state

- The authors "observed nearly unchanged or even decreased performance on a small number of tasks" (§3.2).
- A second revision turn adds little: "the model often repeats the same incorrect CoT without adding new useful information" (CoT: chain of thought; §4.5), so revision stops at one turn, partly "to save computing resources" (App. D).
- Overlap between training and test patterns is "unavoidable" given the data's diversity (§4.7).
- Many PyEdu-R samples "focus on complex calculations involving nontrivial floating-point numbers, but place less emphasis on high-level reasoning", which makes it "challenging for models to learn from effectively" (App. C.3).
- With Tulu-3, CodeI/O++ "performs slightly worse than" CodeI/O, possibly because Tulu-3 "does not cover as many instruction types" as the in-house data (App. F).

## Open problems and building blocks

- **Open:** "leaving optimal data-mixing strategies for future work" (§4.6); "Future work could explore refining or cleaning PyEdu-R" (App. C.3). The authors call CodeI/O "orthogonal" to inference-time scaling such as OpenAI's o1 and DeepSeek's R1, which "typically encourages models to generate ultra-long reasoning process" through large-scale reinforcement learning, and "hope it can provide a better basis to further incentivize the reasoning abilities of LLMs" (§5).
- **Released:** "Our data and models are available" (abstract).
- **To reuse it:** a strong model to rewrite code and write reasoning (DeepSeek-V2.5, chosen for "extremely low cost compared to other advanced LLMs", §2.4); a Python executor with a 5-second limit and the size checks, whose code App. A gives; stage 1 for one epoch at batch size 1024 and maximum sequence length 4096 (App. E); and a general instruction-tuning set for stage 2 (§3.1, App. F).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
