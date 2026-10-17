# Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks

**PoT (Program of Thoughts prompting)** · TMLR 2023

Read: [PDF](https://arxiv.org/pdf/2211.12588) · [arXiv](https://arxiv.org/abs/2211.12588)  
Code: [Program-of-Thoughts](https://github.com/wenhuchen/Program-of-Thoughts)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Prompts an LLM (mainly Codex) to write its reasoning as a Python program with meaningful variable names; a Python interpreter, with SymPy for equations, runs it and its result is the answer, so the computation is taken out of the model's text (abstract, §2.2).
- Few-shot and zero-shot prompts (zero-shot with the comment token `#` pushed down), greedy and self-consistency decoding, against direct answers, chain of thought, and chain of thought with a calculator, on five math word-problem datasets and three financial question-answering datasets over tables and text (§3.1, Tab. 1); ablations of the backbone model, the exemplars, variable names and multi-step programs (§3.3).
- Engine against text on the same numerical tasks, table questions included: the authors report "an average performance gain over CoT of around 12% across all datasets" (abstract), largest on FinQA and ConvFinQA, which they attribute mainly to miscalculation of large numbers (§3.2), while a calculator added to chain of thought gives only "mild improvement over CoT on MWP datasets" (§3.2); with open 7B–16B models PoT falls far behind Codex, a gap they conjecture "could be attributed to non-sufficient pre-training and model size" (§3.3, Tab. 4).

## In plain words

With chain of thought, an LLM both plans the steps and does the arithmetic in text. The authors argue that LLMs "are very prone to arithmetic calculation errors, especially when dealing with large numbers", cannot solve complex equations, and are inefficient at expressing long iterations (§1). Program of Thoughts (PoT) has the model write the steps as a Python program with meaningful variable names; a Python interpreter runs it to do the computation (abstract, §2.2). They test mainly OpenAI's Codex, on five math word-problem and three financial question-answering datasets, few-shot and zero-shot (abstract, §3.1).

The headline: PoT has "an average performance gain over CoT of around 12% across all datasets" (abstract): the few-shot averages with Codex and greedy decoding differ by that much (Tab. 2), as does zero-shot PoT against zero-shot chain of thought run with GPT-3 (§3.2, Tab. 3). With majority voting over sampled answers, they report "the best-known results on all the evaluated MWP datasets" (math word problems), leaving out GPT-4's results (§1). They present PoT as "augmenting CoT with external tools (Python)", concurrent with PaL, a program-writing method (§4.3).

## Background and terms

**Terms to know:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [exact match](#/glossary/exact-match) · [tabular question answering (TQA)](#/glossary/tabular-question-answering-tqa) · [logit bias](#/glossary/logit-bias) (on the `#` token, §3.1)

**The paper's own terms:**
- **PoT (program of thoughts)**: a prompt that makes the LLM express its reasoning as a multi-step Python program, handing computation steps to the interpreter (§1); equations go to SymPy (a Python library for symbolic math), whose `solve` finds the unknown (§2.2, Fig. 1).
- **Semantic binding** and **multiple steps**: the two properties the authors call core to PoT: variable names that carry meaning (`interest_rate` rather than `a, b, c`), and a program broken into steps rather than one equation (§2.2, §3.3 "Semantic Binding…").
- **Direct**: the model outputs the answer with no reasoning; **CoT_calc** (CoT + calc): chain of thought whose equations are corrected by an external calculator afterwards (§3.1 "Baselines").
- **PoT as an intermediate step**: the program's result is fed back with the question, and the model finishes in text with chain of thought; used only for AQuA's multiple-choice answers (§2.3, Fig. 4).
- **Suppressing the `#` token**: in zero-shot PoT the model can write its reasoning in comments instead of code, so the authors lower the score of the comment token `#` by a fixed bias (a logit bias) (§2.2, §3.1).
- **Symbolic execution**, in this paper: executing the program the LLM generates (§6, § Limitations). It is not the glossary's [symbolic execution](#/glossary/symbolic-execution), running a program on unknown inputs.

**Builds on:**
- Chain of thought, Wei et al. (2022): the main baseline; PoT is its alternative for the computation (§1, §2.1).
- Zero-shot chain of thought, Kojima et al. (2022): the zero-shot baseline, whose results Tab. 3 takes from that paper (§3.2).
- Self-consistency, Wang et al. (2022b), [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)"): the voting used for PoT-SC and CoT-SC (§3.1, §3.2).
- PaL, Gao et al. (2022), [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)"): "proposed at the same time as ours" (§4.3), compared in Tab. 5 (§3.3).

## Problem and setting

- **The question:** does handing the computation to an interpreter, with the model writing only the program, beat chain of thought on numerical reasoning (§1)?
- **Datasets** (§3.1, Tab. 1): math word problems GSM8K (grade-school), AQuA (algebra, multiple choice), SVAMP, MultiArith and TabMWP (questions over a table); financial QA FinQA, ConvFinQA (conversational) and TAT-QA (TATQA in the paper) over tables and text. Test sets, except TAT-QA's dev set. Tables are written into the prompt as text, columns split by `|` and rows by newlines.
- **Models** (§3.1): mainly Codex (code-davinci-002); also GPT-3 (text-davinci-002), ChatGPT (gpt-3.5-turbo), and the open models CodeGen and CodeT5+ (16B) and XGen (7B) for ablations. PaLM (Google's model) results are taken from earlier papers; LaMDA (Google's dialogue model) appears as one CoT-SC row (Tab. 2). Programs run in Python 3.8 with SymPy.
- **Prompts:** 4–8 examples from the training set per dataset, picked by tuning on a small validation set (§3.1). Zero-shot PoT uses only an instruction (Fig. 3, right).
- **Decoding:** greedy, or self-consistency with temperature 0.4 over 40 samples (§3.2).
- **What counts as correct** (§3.1 "Metrics"): exact match after rounding the prediction to a set precision (GSM8K, SVAMP, MultiArith); for AQuA the model picks the option closest to PoT's result; official scripts for TabMWP, ConvFinQA, TAT-QA; for FinQA the check is relaxed for CoT to a relative tolerance of 0.001, "because LLMs cannot perform the computation precisely".
- **Safety:** the program may not import modules beyond pre-defined ones (§ Limitations).

## Approach

- **Few-shot PoT** (§2.2, Fig. 3, left): exemplar pairs of question and program are prefixed to the prompt; the program sets named variables step by step and stores the answer in `ans`, which the interpreter returns.
- **Zero-shot PoT** (§2.2, Fig. 3, right): an instruction asks for a Python `solver` function written step by step. Unlike zero-shot chain of thought, no extra step is needed to extract the answer. Because the model "can fall back to generating a reasoning chain in comments rather than in the program", the `#` token is pushed down by a bias of −2, the best value in a preliminary study (§3.1).
- **Not equation generation** (§2.2): rather than one equation for `solve`, PoT splits it into steps and binds meanings to variables, which the authors found gives "more accurate programs".
- **PoT then CoT** (§2.3, Fig. 4, App. 7.1 with pseudocode): when the model's output signals "keep prompting", the program's result goes back into the prompt and chain of thought finishes (e.g. turning 2.05 hours into a clock time to match an option); "only needed for the AQuA".
- **PoT-SC:** self-consistency over sampled programs' executed answers (§3.2).

## Results

- **Few-shot, greedy** (§3.2, Tab. 2): PoT-Codex averages 68.9 against Codex CoT's 56.7, the "around 12%" of the abstract. The gain is largest on FinQA and ConvFinQA, "roughly 20% on FinQA/ConvFinQA and 8% on TATQA", which the authors attribute "mainly" to miscalculation of large numbers "(e.g. in the millions)". CoT with a calculator shows "mild improvement over CoT on MWP datasets, much behind PoT", blamed on its "rigid post-processing step".
- **With self-consistency** (§3.2, Tab. 2): PoT-SC beats CoT-SC "by an average of 10%" across all datasets (§1); on the financial datasets "self-consistency decoding is less impactful for both PoT and CoT". The authors report the best-known results on the math datasets and "near best-known results on the financial datasets", GPT-4 left out (§1); Tab. 2's Published SoTA row stays ahead on ConvFinQA and TAT-QA. With GPT-4, PoT also beats CoT on the four datasets reported (Tab. 2).
- **Zero-shot** (§3.2, Tab. 3): PoT beats zero-shot CoT "by an average of 12%", with the baseline taken from Kojima et al. (2022) and run with GPT-3 (Tab. 3); "On TabMWP, zero-shot PoT is even higher than few-shot CoT."
- **Backbones** (§3.3, Tab. 4): gpt-3.5-turbo scores highest; text-davinci-002 is below Codex, which they attribute "mainly" to text instruction tuning that "undermines the models' capabilities to generate code"; the open 7B–16B models are "significantly behind", conjectured to be due to "non-sufficient pre-training and model size".
- **Exemplars** (§3.3, Fig. 5): more examples help GSM8K more than FinQA, and "when given fewer exemplars, PoT's performance variance is larger".
- **Against PaL** (§3.3, Tab. 5): "in general better than PaL, especially on SVAMP and ASDIV", on six math sets including GSM8K-Hard (GSM8K with larger numbers); PaL is ahead on GSM8K and ADDSUB.
- **Binding and steps** (§3.3, Tab. 6): "removing the binding will in general hurt the model's performance", more on GSM8K; one-equation generation drops further.
- **By question type, AQuA** (§3.3, Fig. 6): the largest gains are on linear and polynomial equations, iterative, symbolic and combinatorics questions; on arithmetic, probability and geometric questions the authors find PoT and CoT similar.
- **Errors** (§3.3, Fig. 7): of 198 failures of PoT (greedy) on TAT-QA numerical questions, 47% are value grounding errors, 33% logic errors, 15% both, and in 5% the authors believe the answer is actually correct; "the majority of the errors are value grounding errors".

## Limits the authors state

- Running generated code is risky; "We have blocked the LLM from importing any additional modules and restrict it to using the pre-defined modules." This "works reasonable for math QA, however, for other unknown symbolic tasks, it might hurt the PoT's generalization" (§ Limitations, PDF p. 12).
- "PoT still struggles with AQuA dataset with complex algebraic questions with only 58% accuracy", mainly owing to question diversity "which the demonstration cannot possibly cover"; so "the future research should discuss how to further prompt LLMs to generate code for highly diversified Math questions" (§ Limitations).
- "For semantic reasoning tasks like commonsense reasoning (StrategyQA), we conjecture that PoT is not the best option"; chain of thought covers broader tasks (§5).

## Open problems and building blocks

- **Open:** "We believe our work can inspire more work to combine symbolic execution with LLMs to achieve better performance on other symbolic reasoning tasks" (§6). Follow-up work that adds self-evaluation or planning on top of PoT is listed in §4.4.
- **Released:** "All of our data and code will be released" (abstract); the GSM8K and AQuA prompts and exemplars are printed "To enable better reproducibility" (App. 7.2).
- **To reuse it:** the results mainly use Codex, and PoT does worse with text-tuned and small open models (§3.3); Python with SymPy (§3.1); an executor restricted to pre-defined modules (§ Limitations); 4–8 written exemplars per dataset (§3.1); for zero-shot, a bias on the `#` token's logit (§3.1).
- **Beyond its domain:** "We believe PoT is suitable for problems which require highly symbolic reasoning skills" (§5).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
