# CodeARC: Benchmarking Reasoning Capabilities of LLM Agents for Inductive Program Synthesis

**CodeARC** · COLM 2025 (per the arXiv v2 PDF's running header)

Read: [PDF](https://arxiv.org/pdf/2503.23145) · [arXiv](https://arxiv.org/abs/2503.23145)  
Code: [CodeARC](https://github.com/Anjiang-Wei/CodeARC)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of inductive program synthesis (programming by example) for LLM agents: hidden Python functions taken from HumanEval+, MBPP+ and APPS, shown only through input-output examples, with their original names kept or replaced by a generic one (abstract; §3.3; §4, Tab. 1).
- An interactive protocol: the agent may run the hidden function on inputs it chooses and submit candidates to a differential-testing oracle built from two test tools, Pynguin and Mokav, which returns an input where the candidate and the hidden function differ, under budgets on both actions (§3.1–3.2; §4). A fine-tuning recipe distils traces of a GPT-4o teacher that is shown the hidden function into Llama-3.1-8B-Instruct (§3.4; §4).
- An examples-only check measured against a stronger, test-based one in programs from examples (<a class="tag" href="#/tags/cex">cex</a>, <a class="tag" href="#/tags/labels">labels</a>): the authors report that o3-mini's first synthesized function passed the initial examples but failed the oracle in 640 problems (28.7%), counted over both versions (§5.2, Tab. 3). The oracle is itself approximate: two tools combined because no perfect equivalence oracle exists (§3.1; App. A.3).

## In plain words

Programming by example asks for a program that fits a few input-output examples and also behaves right on inputs nobody showed. The authors argue that the current test for LLMs, fixed examples followed by held-out tests, can leave the target under-specified and gives no feedback on wrong answers, and that existing benchmarks cover domain-specific tasks, not general-purpose code (§1). In CodeARC, an agent sees examples of a hidden Python function, may run it on inputs it picks, and may submit a candidate to a checker that generates tests for both programs and, when it finds a difference, returns that input (abstract; §3.2). Of 18 models, OpenAI's o3-mini does best: 52.7% of problems solved with function names hidden, 59.5% with names shown, within the default limits on queries and checks (§4; §5.1, Tab. 2). Fine-tuning an 8-billion-parameter Llama model on traces of a stronger model that was shown the hidden function gives up to a 31% relative gain, with names shown (abstract; Tab. 5). The authors call it "the first large-scale benchmark for general-purpose inductive program synthesis" (abstract).

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) · [differential testing](#/glossary/differential-testing) · [test oracle](#/glossary/test-oracle) · [program equivalence](#/glossary/program-equivalence) · [self-correction](#/glossary/self-correction) · [Distillation into compact models](#/glossary/distillation) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries) (the setup "parallels the classic learnability framework of queries and counterexamples", §1)

**The paper's own terms:**
- **inductive program synthesis** (programming by example): "synthesizing functions that satisfy given input-output examples and generalize to unseen inputs", with no natural-language description of the task (§1).
- **ground-truth (hidden) function**: the Python function the agent must reproduce; the agent sees only its behavior (§3.1).
- **differential testing oracle**: a checker that takes the candidate and the hidden function and "attempts to identify inputs on which their behaviors differ" on test inputs it selects itself; it returns Pass, or Fail with a counterexample, the input together with both outputs (§3.1–3.2). A raised error counts as behavior: the App. A.1 counterexample reads "'Error' != 'No Error'". Pass means no difference was found, not proved equivalence (§3.1).
- **function calls / invocations**: here, running the hidden function on an input the agent chooses and seeing its output (§1; §3.2 "Action Space"), not an API's tool calling.
- **budgets**: one limits the input-output examples the agent can observe in total, the other the oracle invocations (§3.2 "Budget Constraints").
- **success rate**: the share of problems whose final program, produced within the budgets, passes the oracle; efficiency is the average number of queries and oracle calls per problem (§3.2 "Evaluation Metrics").
- **annotated and anonymized versions**: function names that reflect the task (e.g. `is_palindrome`) are kept, or all are replaced with `solution` (§3.3).
- **reasoning models**: the paper's name for o3-mini, o1-mini and DeepSeek-R1 (§5.1).

**Missing glossary terms:** none.

**Bridges to the glossary:** in the glossary's terms, submitting candidates and getting counterexamples back is a loop like [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis), with an LLM as the synthesizer and test generators instead of a checker that proves equivalence (our reading).

**Builds on:**
- Li and Ellis (2025), "Is programming by example solved by LLMs?": what the authors call "the state-of-the-art protocol", 10 fixed examples then held-out tests, whose limits motivate CodeARC (§1) and whose 10-example count §5.2 tests. Not on this site.
- Pynguin (Lukasczyk and Fraser, 2022), an automated unit-test generator for Python, and Mokav (Etemadi et al., 2024), an execution-driven differential-testing tool that uses LLMs (titles per the bibliography): the two tools behind the oracle (§4; App. A.3). Not on this site.
- HumanEval+ and MBPP+ (Liu et al., 2023b; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")) and APPS (Hendrycks et al., 2021), code-generation benchmarks whose functions CodeARC reuses without their descriptions (§3.3; §4).
- Angluin (1987), the queries-and-counterexamples framework above (§1). Not on this site.

## Problem and setting

- **The question:** can LLM agents infer a general-purpose Python function from its input-output behavior when they may query it and get counterexamples, and how do the query and oracle budgets and fine-tuning change that (§1; §5.3–5.4)?
- **What "correct" means:** the goal is a program equal to the hidden function on every input (§3.1); success is passing the oracle, which tests only inputs it generates, because "program equivalence checking is fundamentally undecidable, and thus no perfect oracle exists" (§3.1).
- **Functions:** 1,114, from HumanEval+ (78), MBPP+ (131) and APPS (905), 2 to 74 lines long; only function bodies are used (§3.3; §4, Tab. 1). HumanEval and MBPP "primarily consist of simple, entry-level programming tasks", while APPS problems "resemble competition-level code exercises" (§3.3).
- **Initial examples:** 10 per function; GPT-4o writes the inputs and running the original gives the outputs (§3.3).
- **Defaults:** 30 observed input-output pairs and 2 oracle calls, "chosen based on practical constraints such as API cost and runtime" (§4). No Python interpreter by default (§6.2).
- **Models:** 18, from Llama-3.2-3B to o3-mini; "All open-source models are instruction-tuned" (Tab. 2).
- Whether the hidden functions are deterministic is not discussed.

## Approach

- **Protocol (§3.2, Fig. 1).** The agent starts with the initial examples and either queries the hidden function on a new input or writes a candidate and calls the oracle. On Fail it receives the counterexample and may query more or try again.
- **Oracle (§3.1; App. A.3).** Two test tools combined, which the authors say "reduces the likelihood of overlooking behavioral discrepancies".
- **Fine-tuning (§3.4; §3.3; App. A.2).** GPT-4o, as teacher, runs the protocol with a prefix giving the hidden function's body and telling it to query informative inputs, explain why, and write the implementation "only when confident". The authors give the teacher the function because "the teacher is often too weak to generate meaningful queries or explanations" without it. The student, Llama-3.1-8B-Instruct, is trained with LoRA on the recorded conversations, with the prefix left out of the loss; the authors say it learns "without seeing the teacher's prompt that includes the target function". The training functions are 5,405 that GPT-4o wrote from 50 seed functions disjoint from the evaluation set, kept if they ran and deduplicated by name.

## Results

- **Main results (§5.1, Tab. 2).** o3-mini is the only model above 50% on both versions: 59.5% with names shown, 52.7% with names hidden. The reasoning models score highest and use fewer queries and oracle calls. Every model drops on the anonymized version, but "the overall ranking remains largely consistent"; Llama-3.2-3B is last on both. Larger models "generally achieve better performance"; all families show scaling trends, "though with varying consistency", and Llama-3.2 plateaus at larger sizes (Fig. 2).
- **The initial examples under-specify (§5.2, Tab. 3).** For o3-mini's first synthesized function, counted over problems of both versions, 1,506 (67.6%) pass the 10 initial examples but 866 (38.9%) pass the oracle: 640 problems (28.7%) "where the initial examples fail to uniquely specify the target function".
- **Budgets (§5.3).** With 10, 20 and 30 observable examples, o3-mini's success rate rises from 51.3% to 53.8% to 56.1%, and o1-mini's rises too (Tab. 4, both versions). "More oracle calls consistently improve performance" for the four models tested on both versions (Fig. 3, no value labels printed).
- **Fine-tuning (§5.4, Tab. 5).** Llama-3.1-8B-Instruct goes from 19.3% to 25.3% (+31% relative) with names shown and from 13.7% to 15.0% (+9.5%) with names hidden. On BigCodeBench (code generation from natural-language descriptions), its [pass@1](#/glossary/passk) falls by what the authors call "a marginal decrease", which they relate to catastrophic forgetting.
- **More domains (§6.1, Tab. 6).** On 200 functions sampled from BigCodeBench (library-heavy tasks such as NumPy, pandas and matplotlib), o1-mini and o3-mini score lower than on CodeARC and the non-reasoning models higher; the fine-tuned model shows "a substantial gain over the base model".
- **A Python interpreter (§6.2, Tab. 7).** On 100 sampled problems, o3-mini goes from 69.0% to 71.0% with an interpreter and gpt-4o from 48.5% to 46.0%: access "does not uniformly improve model performance".
- **The two oracle tools (App. A.3).** They give identical outcomes on 75.4% of problems; Mokav finds additional bugs in 18.8% of cases that Pynguin misses, and the reverse holds in 5.9%.

## Limits the authors state

- "Note that program equivalence checking is fundamentally undecidable, and thus no perfect oracle exists" (§3.1); "no oracle can guarantee perfect correctness checking" (App. A.3).
- The budgets were "chosen based on practical constraints such as API cost and runtime" (§4).
- Without the hidden function, "the teacher is often too weak to generate meaningful queries or explanations, limiting the effectiveness of the resulting supervision" (§3.4).
- "While fine-tuning helps, there remains substantial room for further improvement", with gains "more limited" on the anonymized version (§5.4).
- Fine-tuning lowered BigCodeBench pass@1 slightly; the authors "consider this small degradation acceptable given the gains in inductive program synthesis" (§5.4).
- Expanding the agent's action space with an interpreter "may sometimes lead to suboptimal behavior" (§6.2).

## Open problems and building blocks

  - The authors suggest that "future research may focus on enhancing the quality and diversity of the fine-tuning dataset, particularly for the anonymized variant" (§5.4).
  - "Another promising direction is to explore reinforcement learning approaches", "potentially overcoming limitations of supervised fine-tuning alone" (§5.4).
- **Released:** "Our code, data, and models are publicly available" (abstract).
- **To reuse it:** Python functions and two test tools, Pynguin and Mokav, for the oracle (§4); a GPT-4o teacher and a Llama-3.1-8B-Instruct student fine-tuned with LoRA for the training recipe (§4; App. A.2, Tab. 8). The authors call the protocol "domain-agnostic and readily extensible to any Python program" (§6.1), and say it "can easily incorporate" tools such as an interpreter "via additional actions" (§6.2).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
