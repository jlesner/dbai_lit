# AlphaEvolve: A coding agent for scientific and algorithmic discovery

**AlphaEvolve** · preprint 2025 (Google DeepMind white paper)

Read: [PDF](https://arxiv.org/pdf/2506.13131) · [arXiv](https://arxiv.org/abs/2506.13131)  
Code: [alphaevolve_results](https://github.com/google-deepmind/alphaevolve_results)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An evolutionary coding agent: LLMs propose program changes, automated evaluators score them.
- Programs database plus prompt sampling.
- Evolution with a programmatic check at scale; the code-search cousin of GEPA.

## In plain words

LLMs help with parts of research, but "getting LLM pipelines all the way to making entirely new scientific or practical discoveries remains challenging" (§1). This Google DeepMind white paper presents AlphaEvolve: Gemini models repeatedly propose edits to a program, a scoring program written by the user rates each new version, and promising versions are stored and shown in later prompts, so the code improves over many rounds, as in an evolutionary search. It is built for problems whose candidate answers can be scored automatically (§6). The authors apply it to fast matrix multiplication, over 50 open mathematical problems, and four engineering problems at Google (§1). Headline results: multiplying two 4×4 complex-valued matrices with 48 multiplications, where Strassen's 1969 method applied recursively needs 49, "the first improvement, after 56 years, over Strassen's algorithm in this setting" (abstract); and matching the best known constructions on about 75% of the mathematical problems and beating them on about 20% (§1). They present it as "a substantial enhancement of FunSearch" (§1), their earlier system.

## Background and terms

**Terms to know:** [Distillation into compact models](#/glossary/distillation) · [reinforcement learning](#/glossary/reinforcement-learning) · [evolutionary search](#/glossary/evolutionary-search)

**The paper's own terms:**
- **`evaluate` (the function `h`)**: user code mapping a candidate solution to scalar scores, which are maximized (§2.1).
- **evolution blocks**: code between `# EVOLVE-BLOCK-START` and `# EVOLVE-BLOCK-END` comments; only these change, and their first version must be complete but "can be rudimentary" (§2.1, Fig. 3).
- **program database**: the store of evaluated programs and scores from which prompts are built, designed to balance improving the best programs against keeping diversity (§2.5).
- **meta prompt evolution**: "instructions and context suggested by the LLM itself in an additional prompt-generation step, co-evolved in a separate database analogous to the solution programs" (§2.2).
- **evaluation cascade**: test stages of increasing difficulty; a program goes on only if it did well enough in all earlier ones (§2.4).

**Missing glossary terms:**
- **rank of a matrix-multiplication tensor**: the number of simple ("rank-one") terms in a decomposition that encodes a multiplication algorithm; it equals the number of scalar multiplications needed, and such algorithms can be applied recursively to larger matrices (§3.1 and its footnote).
- **code superoptimization**: iteratively improving a program "using execution feedback" (§5 "Superoptimization and algorithm discovery").

**Builds on:**
- FunSearch (Romera-Paredes et al., 2023; not listed here), the authors' earlier LLM-guided evolution system, which they say AlphaEvolve extends: whole files instead of one function, any language instead of Python, several scores instead of one, frontier LLMs with rich context instead of relatively small code-only models; Tab. 1 lists these as "typical behaviours" (§1, Tab. 1, §5).
- AlphaTensor (Fawzi et al., 2022; not listed here), a deep reinforcement-learning system for matrix multiplication, which AlphaEvolve, "despite being general-purpose", "goes beyond" (§1, §3.1, §5).
- MAP-Elites (keeps the best candidate per kind of behaviour) and island models (separately evolving subpopulations), which inspire the program database (§2.5).
- Classical genetic programming and code superoptimization (§5).

## Problem and setting

- **Question:** can an LLM-driven evolutionary loop over code find new results on problems with "machine-gradeable solutions" (§2.1)?
- **Models:** Gemini 2.0 Flash (more candidates per unit time) plus Gemini 2.0 Pro ("occasional, higher-quality suggestions"), mixed "to balance computational throughput with the quality of generated solutions" (§2.3).
- **What counts as correct:** matrix-multiplication decompositions are rounded to integers or half-integers when scored, so they are exact (§3.1); mathematical constructions come with data and verification code in a Colab notebook (App. B); the scheduling heuristic is "effectively correct by construction", since it only ranks machines already able to run the job, and kernel tiling (how a matrix product is split into blocks) leaves the kernel's mathematical operation unchanged (§3.3.1–3.3.2); the circuit rewrite was "validated by TPU designers for correctness" (TPUs are Google's accelerator chips) (§3.3.3); compiler-code edits were checked against the original on randomized inputs, and the final version "rigorously confirmed by human experts to be correct for all possible inputs" (§3.3.4).

## Approach

- **The loop (§2, Fig. 2):** given an initial program and `evaluate`, prompts hold earlier programs and instructions, optionally with problem context, randomized template wording ("stochastic formatting"), rendered evaluation results and meta prompt evolution (§2.2). The LLMs answer with `SEARCH`/`REPLACE` diff blocks, or whole code blocks when configured (§2.3). Evaluation can use a cascade, scores from separate LLM calls, and parallel runs (§2.4). The authors find optimizing several scores "often improves results for the single target metric" (§2.4).
- **What to evolve (§2.1):** the answer itself, a function that constructs it, or a search algorithm that finds it within a fixed budget, possibly co-evolved with intermediate answers; the authors "hypothesize" constructor functions suit highly symmetric solutions and search algorithms non-symmetric ones.
- **Model quality (§2.3):** AlphaEvolve "is model-agnostic", but the authors report that in ablations it "performs increasingly better as the underlying LLM improves".
- **Matrix multiplication (§3.1):** evolves a gradient-based decomposition algorithm (initializer, loss, Adam optimizer), scored by the lowest rank reached on each target and the fraction of random seeds reaching it. Most results came from a simple initial program; for some sizes, seeding it with the authors' ideas "could further boost performance".
- **Mathematics (§3.2):** for many problems, evolves search heuristics, each given a fixed time budget (e.g. 1000 seconds) and the best construction so far; final constructions often come from a sequence of heuristics. "In all these cases, the initial starting point was a simple or a random construction".
- **Engineering (§3.3):** Borg's scheduling heuristic (Borg is Google's cluster manager), tuned in a simulator; tiling heuristics for a Pallas kernel (custom accelerator code in Google's JAX library) used to train Gemini, timed on TPUs; Verilog (a hardware description language) for a TPU arithmetic circuit; and the intermediate code the XLA compiler generates for FlashAttention (an attention kernel) on GPUs.

## Results

As the authors report:
- **Matrix multiplication:** for two 4×4 matrices, rank 48 against 49 for Strassen's algorithm applied recursively, which "works over any field" (any number system with the usual arithmetic, such as the reals); AlphaEvolve is "the first method to find a rank-48 algorithm" for complex-valued 4×4 matrices (§3.1, Tab. 2). Over 54 sizes tried, it matches the best known rank in 38, improves it in 14 and falls behind in 2 (App. A, Tab. 3).
- **Mathematics:** on over 50 problems (analysis, combinatorics, number theory, geometry and more, evaluated across numerous parameter settings) it matched the best known construction in about 75% of cases and beat it in about 20% (§1, §3.2); "in many cases" the matched ones "are likely to already be optimal" (§1). New results include several autocorrelation inequalities (bounds on a function convolved with itself), an uncertainty inequality from Fourier analysis, Erdős's minimum overlap problem (how much two complementary functions must overlap when shifted, App. B.5), the kissing number in 11 dimensions (how many non-overlapping unit spheres can touch one central unit sphere), and packing and Heilbronn problems (point sets avoiding small-area triangles); several improvements are described as slight (§3.2, Fig. 5, App. B).
- **Scheduling:** an early AlphaEvolve version found a heuristic that beat production on unseen simulated workloads; deployed fleet-wide, it "continuously recovers on average 0.7%" of Google's fleet-wide compute resources that would otherwise be stranded (left unusable) (§3.3.1, Fig. 6).
- **Gemini kernel:** "an average 23% kernel speedup across all kernels" over the expert-designed heuristic, and a corresponding 1% reduction in Gemini's overall training time (§3.3.2).
- **TPU circuit:** a rewrite removing unnecessary bits, integrated into an upcoming TPU (§3.3.3).
- **Compiler code:** speedups of the FlashAttention kernel for one configuration and of its pre- and postprocessing (§3.3.4).
- **Ablations (§4, Fig. 8):** removing evolution, prompt context, meta prompt evolution, full-file evolution, or the larger model by using only a small base LLM (matrix multiplication), and evolution or context (kissing number), three runs each; the authors conclude "each of the components is responsible for a significant improvement in the results".

## Limits the authors state

- The automated evaluator "is also a limitation", putting "tasks that require manual experimentation out of our scope" (§1); LLM-provided evaluation "is not a setting we have optimized for" (§6).
- Unless parallelized, slow evaluations "can slow down the rate at which new generations appear" (§2.4).
- "Anecdotally", beyond ⟨5,5,5⟩ (two 5×5 matrices) with 1000 random seeds on single-GPU evaluators "we often run out of memory", so larger sizes require "further optimization" (App. A).
- The circuit improvement "was also independently caught by downstream synthesis tools" (later chip-design steps that turn the code into circuits) (§3.3.3).
- On AlphaEvolve improving its own infrastructure and base LLMs: "Currently, the gains are moderate and the feedback loops for improving the next version of AlphaEvolve are on the order of months" (§6).
- A note says a 2019 paper by Cohn and Gonçalves had a better uncertainty-inequality constant; incorporating that approach, the authors improved their reported constant further, with details in the Colab (App. B.4).

## Open problems and building blocks

  - "a natural next step will be to consider" distilling the AlphaEvolve-augmented performance of the base LLMs into the next base models (§6).
  - "a natural step": linking LLM feedback on high-level ideas with machine-checked implementation (§6).
  - Other work's reinforcement learning (RL) fine-tuning of the LLM during evolution and natural-language concept learning: "More investigation is required" at AlphaEvolve's scale (§5).
  - The "potential" of putting discovered optimizations into existing compilers, or, "in the longer term", AlphaEvolve into the compiler workflow (§3.3.4).
  - More mathematical details "will be provided in an upcoming paper" (§3.2).
- **Released:** in an accompanying Google Colab, the discovered matrix-multiplication algorithms (§1 footnote, Tab. 2) and the mathematical constructions with their data and verification code (App. B). No release of AlphaEvolve itself is stated.
- **To reuse it:** an `evaluate` function and marked initial program (§2.1); Gemini 2.0 Flash and Pro; "thousands of LLM samples suffice", against FunSearch's millions, and evaluation "for hours, in parallel, on accelerators" in any language (Tab. 1).
- **Beyond its domain:** aimed at "the broad spectrum of scientific and engineering discovery problems in which the candidates of discovery can be automatically evaluated" (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
