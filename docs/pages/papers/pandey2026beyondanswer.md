# Beyond the Answer: Decoding the Behavior of LLMs as Scientific Reasoners

**Beyond the Answer** · Post-AGI Science and Society Workshop at ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2603.28038) · [arXiv](https://arxiv.org/abs/2603.28038)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes prompts with a simplified GEPA variant on DeepSeek-V3.2 for Lean proofs of MiniF2F problems ("Algebra") and GPQA Diamond multiple-choice science questions, then runs the same prompts on GPT-5.4-mini, GLM 5 and Claude Sonnet 4.6 (abstract; §3, Alg. 1).
- Compares four prompts per model and benchmark (a simple and a chain-of-thought hand-crafted prompt, GEPA's seed and its final prompt; §3, Tab. 1), and reads the prompts' evolution by hand, by length and by embedding drift (§4.2; Figs. 1–2).
- A small cross-model transfer test of an optimized prompt, whose optimizer scores Lean proofs with a Lean check on one of its two benchmarks (Alg. 1): the authors report that the final prompt's "superiority … does not reliably transfer to other models", with the hand-crafted chain-of-thought prompt ahead of it for GLM 5 on Algebra and for Claude Sonnet 4.6 on both benchmarks (§4.1, Tab. 1); they call the work "relatively preliminary" (§5 "Limitations") and don't state the evaluation set sizes or whether they are held out from the optimization (see ).

## In plain words

The authors ask how prompts shape an LLM's reasoning on scientific tasks, and whether a prompt tuned automatically for one model helps others. Their motivation is safety and collaboration: "natural language will likely be the primary interface for interacting with AGI systems" (abstract; §1). They run a simplified version of the prompt optimizer GEPA with DeepSeek-V3.2 on two tasks, machine-checked proofs of competition algebra problems and graduate-level multiple-choice science questions, then run the same prompts on three other models (§3). On DeepSeek-V3.2, the optimizing model, the final prompt scores highest on both tasks; on the others it is "rarely the undisputed best performer elsewhere", and a hand-written step-by-step prompt beats it for Claude Sonnet 4.6 on both tasks and for GLM 5 on the proofs (§4.1, Tab. 1). The authors read this as gains that "often correspond to model-specific heuristics that fail to generalize across systems, which we call 'local' logic" (abstract). They present the work as repositioning optimizers "as tools for understanding" rather than for accuracy (§2), and call it "relatively preliminary" (§5 "Limitations").

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [evolutionary search](#/glossary/evolutionary-search) · [Pareto front](#/glossary/pareto-front) · [proof assistant](#/glossary/proof-assistant)

**The paper's own terms:**
- **Algebra**: the paper's name for its first benchmark, formal theorem proving in Lean (a proof assistant) "from the MiniF2F dataset" (§3), a benchmark of formal olympiad-level mathematics problems (its reference list's title). The model writes a whole Lean proof, which Lean checks; the paper calls this task "open ended" (§3). §1 describes it as "a formally verified algebra dataset implemented in Lean".
- **GPQA**: the GPQA Diamond benchmark, which "tests graduate-level scientific reasoning" (§1) with multiple-choice questions (§3).
- **The four prompts** (§3): **Hand-Crafted Simple**, written "to emulate the prompting ability of average technical users"; **Hand-Crafted CoT**, a chain-of-thought prompt written "to emulate best practice prompting strategies to current knowledge"; **GEPA Optimized Baseline**, "The initial prompt from the GEPA optimization process"; **GEPA Optimized Final**, "The final prompt from the GEPA optimization process".
- **"local" logic**: the authors' name for what gains in scientific reasoning "often correspond to": "model-specific heuristics that fail to generalize across systems" (abstract).
- **closed epistemology**: what the authors say it suggests when "a reasoning strategy optimized for one model fails on another", and which "represents a detached form of intelligence that lacks a universal logical foundation" (§2 "Knowledge Transferability").
- **reasoning primitives**: "logical structures invariant across models", which the authors propose as a goal for future work (§5 "Future Work").

**Builds on:**
- GEPA (Agrawal et al., 2025; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), whose custom variant the paper runs (§1; §2 "Automated Prompt Engineering"; §3), with DSPy (Khattab et al., 2023; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a framework for programming LLM pipelines, cited beside it (§1).
- LLMs that optimize their own instructions: Zhou et al. (2022; [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")) and Yang et al. (2023a; [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) (§2).
- The benchmarks: GPQA (Rein et al., 2023) and MiniF2F (Zheng et al., 2022), with LeanDojo (Yang et al., 2023b; [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)")), a toolkit for LLM theorem proving in Lean, cited for the Lean dataset (§1; §3).
- Mirzadeh et al. (2025) (GSM-Symbolic, on the limits of LLM math reasoning), cited with the authors' finding that "high-performing prompts often rely on model-specific heuristics that fail to generalize across models" (§1).

## Problem and setting

- **Question:** which instructions give the best performance, which patterns in optimized prompts "elicit higher-level reasoning" (§1), and whether the optimized prompts transfer to other models or are brittle (abstract).
- **Models:** the whole GEPA optimization runs on DeepSeek-V3.2 (§3). The same prompts are then tested on GPT-5.4-mini (written "ChatGPT-5.4-mini" in §3), GLM 5 and Claude Sonnet 4.6, "all of which were released within the past few months" (§3).
- **What counts as correct** in the optimizer's scoring: a Lean proof passes Lean's check (`Lean_Verify`); a GPQA answer matches the key (`Check_Answer`) (§3, Alg. 1).
- **Design:** every combination of the four models and two benchmarks is run with all four prompts (§3).
- Not discussed: the iteration count and the per-iteration sample sizes, which Alg. 1 takes as inputs; on which scores one prompt dominates another in the Pareto update (Alg. 1); and which embedding model produced Fig. 2.

## Approach

- **A custom GEPA variant** (§3, Alg. 1), "simplified and adapted for Lean theorem proving and GPQA" (§3). From a seed prompt, each iteration:
  - picks a prompt from the Pareto set, or from the population while that set is empty;
  - samples some Lean theorems and some GPQA questions and scores the prompt on each (Lean check or answer check);
  - adds the prompt to the Pareto set "if non-dominated by existing prompts" and removes dominated ones;
  - has an LLM critic read the logs of the failed items and write a critique, from which an LLM writes a revised prompt;
  - keeps only the Pareto set plus the new prompt as the population.

  It returns the Pareto set (Alg. 1).
- **Comparison:** the four prompts on each model and benchmark (§3; Tab. 1).
- **Reading the prompts:** the authors analyse "the evolution of prompts over the course of GEPA optimization" by hand (§4.2), plot prompt length in characters and lines per iteration (Fig. 1), and plot the prompts' embeddings per iteration as t-SNE maps (a method that draws high-dimensional vectors as 2D points) (App. A.1, Fig. 2).

## Results

- **On the optimizing model:** with DeepSeek-V3.2 the final prompt scores 100.00% on Algebra and 94.44% on GPQA, against 97.22% and 91.67% for Hand-Crafted CoT (§4.1, Tab. 1). The authors say this "confirms that the GEPA optimization process is highly effective when evaluated on the same model used during optimization" (§4.1).
- **Transfer:** the authors report that "the superiority of the GEPA-optimized prompts does not reliably transfer to other models" (§4.1):
  - GPT-5.4-mini improves on Algebra from 50.00% to 61.11% with the final prompt, which they give as an example of "marginal benefits" (§4.1);
  - for Claude Sonnet 4.6, Hand-Crafted CoT scores 52.78% on Algebra and 83.33% on GPQA against 50.00% and 80.56% for the final prompt (Tab. 1);
  - for GLM 5, Hand-Crafted CoT is ahead of the final prompt on Algebra (Tab. 1).

  They conclude that "the optimization process is highly model-specific", suggest "a trade-off between prompt universality and performance", and say the evolved prompts "likely capture patterns specific to DeepSeek's architecture" (§4.1).
- **How prompts evolve** (§4.2):
  - prompts move from telling the model "what to do" to coaching it on "how to do it, similar to a human expert";
  - domain knowledge and best practices are often added, such as Eisenstein's Criterion (a sufficient test that a polynomial can't be factored) for minimal polynomials (Algebra) and "quantum field theory loop counting" (GPQA);
  - later Algebra prompts warn against pitfalls, "especially with regard to Lean formatting", and a protocol for "Handling False Statements" is "introduced to prevent hallucinating proofs".
- **Length:** the final prompt is "around twice as long as the initial prompt" (§4.2; Fig. 1), which the authors say "demonstrates that LLMs often rely on detailed prompting to fully elicit their reasoning capabilities" (§4.2).
- **Embedding drift:** the embeddings of proposed prompts "tends to drift in a consistent direction" (§4.2), with, for both benchmarks, "there seems to be a significant jump in embedding space at around iteration 12" (App. A.1, Fig. 2). The authors take this to suggest that "some regions of prompting space may offer more promising performance" (§4.2).
- **Conclusion** (§5): longer prompts, and prompts that guide the model on the how of a task, "tend to elicit superior reasoning capabilities in LLMs"; such prompts "can be optimized autonomously, and can beat hand-crafted baselines, even when we hand-craft prompts using state-of-the-art best practices". The authors suggest that "if current trends continue", post-AGI reasoning "may not manifest as a universal logic", but as "a collection of task-specific and model-specific heuristics that require precise coaching to elicit".

## Limits the authors state

- "Our work is still relatively preliminary, and is limited to two benchmarks and four models. We would need a broader experimental scope to more confidently confirm the validity of our hypotheses." (§5 "Limitations")
- "the stochastic nature of our LLM-driven prompt optimization loop could lead to inconsistency across multiple runs" (§5 "Limitations").
- "Our results are reproducible to the extent of nondeterminism in the outputs of LLMs used." (§6.2)
- Effective reasoning paths found this way "could potentially be repurposed for harmful tasks" (§6.1).
- Only the four Algebra prompts are printed; the four GPQA prompts are left out "for sake of brevity" (App. A.2).

## Open problems and building blocks

- **Open:** the authors say prompt optimization "remains dangerously architecture dependent", and that future research should identify "reasoning primitives", "logical structures invariant across models", and that "If AGI develops logic that humans cannot understand, we need to build automated tools to keep these systems interpretable" (§5 "Future Work"). They also aim to find heuristics in optimized prompts "that can be reverse engineered and transferred back to improve human-authored prompting methodologies" (§2 "Automated Prompt Engineering").
- **Released:** the four Algebra prompts (Hand-Crafted Simple, Hand-Crafted CoT, GEPA seed and final), printed as Listings 1–4 (App. A.2). No code release is stated; the authors "agree to NOT reveal examples from our evaluation datasets in plain text or images online" (§6.1).
- **To reuse it:** DeepSeek-V3.2 runs "the entirety of GEPA optimization" (§3), and the Algebra side needs a Lean checker (Alg. 1). No run time or cost is stated.

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
