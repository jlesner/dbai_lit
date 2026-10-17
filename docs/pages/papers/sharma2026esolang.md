# EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages

**EsoLang-Bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.09678) · [arXiv](https://arxiv.org/abs/2603.09678)  
Code: [EsolangBench](https://github.com/Lossfunk/EsolangBench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of 80 programming problems in four difficulty tiers, each to be solved in five Turing-complete esoteric languages (Brainfuck, Befunge-98, Whitespace, Unlambda, Shakespeare) that the authors choose for their scarcity on GitHub, with the same problems run in Python and JavaScript as an in-distribution baseline (abstract; §3; §5.1).
- Five API models under five prompting strategies: zero-shot and few-shot with the language's documentation in the prompt, and three loops of up to 5 iterations fed by interpreter output (one model alone, a coder with a separate critic, and a planner–coder–critic pipeline); a problem counts as solved only if its program's stdout matches all 6 test cases byte for byte (§3.1; §4.2–4.3; App. J).
- Evidence on whether frontier models can write programs in languages they have barely seen, from documentation and an interpreter: the authors report that the same 80 problems "reach 100% accuracy on top frontier models" in Python or JavaScript while the esoteric versions "score only 0–11%" (abstract), with nothing solved beyond the Easy tier (Tab. 1 caption; App. E.1) and few-shot examples and interpreter feedback failing to close the gap (§5.2–5.3); the interpreters and problems are released for reuse (App. R).

## In plain words

Code benchmarks such as HumanEval use languages like Python that appear at scale in the models' training data (abstract); the authors measure how well models carry algorithmic skill into languages they have barely seen (§1). They pick five deliberately strange Turing-complete languages (able to express any computation), each with far fewer public GitHub repositories than Python (abstract), and argue that, being of little practical use, these languages are unlikely to be added to post-training data (§1). They write 80 problems in four difficulty tiers and run five frontier models under five prompting strategies, scoring each program by running it on test cases (§3–4).

The authors report that the same 80 problems "reach 100% accuracy on top frontier models" in Python or JavaScript, while the esoteric versions "score only 0–11%" (abstract), and that showing worked examples or feeding back the interpreter's output does not close the gap (abstract; §5.2–5.3). They present a new benchmark (§1), "unique in this set" of code benchmarks it compares, for combining scarce languages with an argument that they stay out of training data (App. P, Tab. 12).

## Background and terms

**Terms to know:** [low-resource programming language](#/glossary/low-resource-programming-language) · [data contamination](#/glossary/data-contamination) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [self-correction](#/glossary/self-correction) · [pass@k](#/glossary/passk) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test) · [Turing-complete](#/glossary/turing-complete) (why each problem stays solvable in every language, abstract) · [combinatory logic](#/glossary/combinatory-logic) (Unlambda's s, k and i, App. B)

**The paper's own terms:**
- **Esoteric language**: a programming language whose syntax is "deliberately exotic by design (hence the name esoteric)" (§3.1). The five (§3.2; App. B): Brainfuck (8 one-character commands moving a pointer over a memory tape), Befunge-98 (a 2D grid of instructions with a stack and a moving instruction pointer), Whitespace (a stack language in which only space, tab and newline mean anything), Unlambda (functions built from combinators, see below) and Shakespeare (programs written as a play's dialogue).
- **Difficulty tiers**: Easy (one primitive, e.g. adding two integers), Medium (a few composed steps, e.g. a Caesar cipher), Hard (non-trivial structure, e.g. balanced parentheses) and Extra-Hard (classical algorithms, e.g. longest increasing subsequence), 20 problems each, assigned from pseudocode by an author before any model was run (§3.1; App. C.2, Tab. 4).
- **Self-Scaffolding**: one model rewrites its program for up to 5 iterations after reading the interpreter's raw output (expected and actual output, error type, error messages), with no separate critic (§4.2; App. J).
- **Textual Self-Scaffolding (TSS)**: the same loop with a second LLM call per iteration, a critic that "explicitly cannot write code" and gives debugging advice in words (§4.2).
- **ReAct pipeline**: the paper's three-stage version, "inspired by" [ReAct](#/glossary/react): a planner writes pseudocode, a code editor translates it, a critic feeds failures back to the planner (§4.2). It is not the interleaved think–act loop of the glossary entry.
- **Compile, runtime and logic errors**: output the interpreter rejects, programs that crash mid-run, and programs that run but print the wrong output (§6).
- **GitHub topic-tag counts**: the scarcity measure, the repository count on each language's GitHub topic page (App. I.1; Fig. 2).

**Missing glossary terms:** none.

**Builds on:**
- Wang et al. [2025], which the authors call "Most directly related": in-context learning on four esoteric languages the authors call Python-derived (Minipy, Pyth, Rhokell, 0815); the authors present their five languages as having no such bridge to Python (§2.1). Not on this site.
- HumanEval and MBPP (function-level Python benchmarks checked by tests), SWE-bench (repository-level tasks) and LiveCodeBench (released in rolling batches against leakage), which the paper contrasts itself with (§2.1–2.2; Tab. 12).
- Self-improvement methods that App. L maps onto its strategies (Tab. 11): Self-Refine (the model critiques and revises its own output), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) (verbal self-reflection between attempts), Self-debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and OpenCodeInterpreter (loops over code and interpreter feedback), with ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) as the model for its pipeline (§4.2).

## Problem and setting

- **Question:** does algorithmic problem-solving that models show in mainstream languages carry over to languages outside their training distribution (App. N "Motivation")?
- **Why these languages:** the authors argue that scarcity on GitHub plus "negligible deployment value" makes "large-scale contamination unlikely at corpus scale" (§1), and that Turing-completeness keeps every problem solvable, which "decouples problem solvability (preserved by Turing-completeness) from familiarity to the model (eliminated by data scarcity)" (§1).
- **Correct:** a program is run in the language's sandboxed interpreter on 6 test cases; "the problem is declared solved if and only if all 6 test cases pass. There is no partial credit." (§3.1). Accuracy: solved out of 80 per language (§5).
- **What the model sees:** the language's documentation (App. I.3 gives Brainfuck's in full), the problem description, for Few-Shot three solved Easy-tier programs (App. K, Tab. 10), and in the loops the interpreter feedback (App. J.1); no web access (§4.3).
- **Models and decoding:** GPT-5.4 xhigh, O4-mini-high (the suffixes are reasoning-effort settings), Gemini 3.1 Pro, Qwen3-235B and Kimi K2.5 (from OpenAI, Google, Alibaba and Moonshot), all through OpenRouter (one API for many providers' models) (§4.1, §4.3); temperature 0.2 and up to 32,000 output tokens in all primary runs (§4.3). Failed API requests count as failures (App. R).

## Approach

- **Dataset (§3; App. C, App. H):** 80 problems in nine algorithmic categories (Tab. 5), also run in Python and JavaScript as the in-distribution baseline (§5.1; App. D).
- **Feasibility check (App. I.4):** an author wrote reference solutions "for the majority of problems across all five esoteric languages from scratch", using only the in-prompt documentation and the interpreter, to validate the harness and the documentation.
- **Five strategies (§4.2):** Zero-Shot, Few-Shot, and the three loops above, which stop early once all tests pass (App. J.2).
- **Statistics (§5.2–5.3):** paired Wilcoxon tests on per-problem solves, [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) with a [bootstrap](#/glossary/bootstrap-resampling) interval, and a zero-shot pass@k study with 8 samples per problem at [temperature](#/glossary/greedy-decoding-and-temperature-sampling) 0.8 (Tab. 3).

## Results

- **Mainstream against esoteric (§5.1; Fig. 3; App. D, Tab. 6):** top models reach 100% on every tier in Python and JavaScript; the best esoteric result is 11.2%, by GPT-5.4 xhigh with Self-Scaffolding on Befunge-98, which the authors call an "89-point collapse".
- **By tier (§5.2):** the authors report solves only in the Easy tier (Tab. 1 caption; App. E.1, Tab. 7–9); GPT-5.4 xhigh with Self-Scaffolding solves 9 of 20 Easy Befunge-98 problems, and the authors describe "a hard performance cliff" between Easy and the higher tiers. All models score 0% on Whitespace (§5.2; App. M.1).
- **Few-shot (§5.2):** the mean lift over zero-shot is +0.8 percentage points, Wilcoxon p = 0.505 (not significant); under pass@k the strongest cell "rises only modestly" (Tab. 3).
- **Loops (§5.3; Tab. 2):** Self-Scaffolding yields "the best overall result"; TSS tracks it with Spearman ρ = 0.94 and Wilcoxon p = 0.803 despite twice the compute per iteration, from which the authors conclude that "direct interpreter feedback already captures the benefit and the textual critic adds nothing".
- **Error analysis (§6; Fig. 4, GPT-5.4 xhigh zero-shot):** on Whitespace, Unlambda and Shakespeare, 70–100% of attempts "fail before execution starts"; on Brainfuck and Befunge-98 "the model produces parsable code but implements the wrong algorithm". The authors read this as two failure regimes, a syntax-acquisition ceiling and a semantics-translation ceiling, "a categorical shift in which kind of failure dominates rather than a smooth accuracy degradation" (§6). Per App. M (Fig. 7), error profiles are "remarkably consistent across models".
- **Whitespace (App. M.1):** the authors rule out tokenizer and prompt artefacts: tokenizers reproduce a known-good program byte for byte, and with an explicit whitespace-only prompt models still emit visible characters (Fig. 8).
- **Tractability against scarcity (App. Q):** from olympiad mathematics, algorithmic discovery, lower-resource mainstream languages and a composition-depth benchmark, the authors argue that hardness alone doesn't explain single-digit accuracy, and read the pattern as "consistent with corpus scarcity and lack of post-training incentive being the load-bearing factor".
- **Prior methods (App. L, Tab. 11):** the authors map Self-Refine, Reflexion, Self-debugging, OpenCodeInterpreter and ARCS (retrieval plus a synthesise–execute–repair loop) onto their strategies and conclude that "The bottleneck across all of these methods is foundational language knowledge, not the refinement mechanism layered on top."

## Limits the authors state

- "We acknowledge two limitations": "Error classification is coarse (compile, runtime, logic)", and 80 problems per language, "a planning choice rather than a budget constraint", mitigated by paired tests, bootstrap and the pass@k study (§7).
- "most Medium, Hard, and Extra-Hard cells remain at 0% across all five models and all five strategies, so present discriminative power is concentrated on the Easy tier of Brainfuck, Befunge-98, and Shakespeare" (§7).
- "We do not have direct visibility into the training corpora of frontier closed models" (§1); a causal claim "would require a controlled intervention such as a synthetic mini-language with matched syntax complexity and varied training-time exposure" (App. M.1; App. Q).
- GitHub topic-tag counts under-estimate true repository counts; the authors argue the ratios still hold (§3.2; App. I.1).
- Reference solutions cover "the majority of problems", and "We make no claim about how a typical programmer would perform on this benchmark and report no human baseline" (App. I.4).
- "The contamination-resistance argument is strongest at release and weakens monotonically as compute scales" (App. N).
- The size is "a deliberate trade-off" against author-verified solutions in every language (App. P).

## Open problems and building blocks

  - An official leaderboard with held-out test sets, new languages and problems, and compute-versus-accuracy curves (App. O).
  - A private evaluation set from a rotating pool of less-known or new esoteric languages, refreshed every six months from 1 November 2026, with candidates such as Malbolge, INTERCAL and Piet (other esoteric languages) (App. N).
  - Whitespace as "a natural canary" for whether the syntax ceiling moves as models scale (App. M.1).
- **Released:** the dataset on Hugging Face under CC BY 4.0 (a license allowing reuse with credit) (problems, test cases, tiers, documentation bundle, few-shot set, and a Croissant metadata file (a machine-readable dataset description)), and code under an OSI-approved license (an open-source license) (the five interpreters, prompt templates, OpenRouter harness, scoring and reproducibility scripts); the authors say raw generations, reference solutions and replay scripts will be added (App. R; title-page footnote).
- **To reuse it:** API access to the models (inference only, no GPU training), a "standard CPU workstation" for the Python interpreters (§ "NeurIPS Paper Checklist", "Experiments compute resources"; App. G).
- **Beyond its domain:** the authors intend the benchmark as "a template for future OOD benchmarks" (out-of-distribution) (§8).

## On this site

- **Discussed in:** [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
