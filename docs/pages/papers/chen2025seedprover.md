# Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving

**Seed-Prover** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2507.23726) · [arXiv](https://arxiv.org/abs/2507.23726)  
Code: [Seed-Prover](https://github.com/ByteDance-Seed/Seed-Prover)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A lemma-style Lean whole-proof model that refines its proof from Lean feedback, proved lemmas and self-summaries (abstract), trained with RL (§2.2.3).
- Three test-time strategies for "deep and broad reasoning", and the Seed-Geometry engine for geometry (abstract).
- The proof checker as both the RL reward and the feedback for test-time refinement, at IMO level (abstract; the RL reward, §2.2.3).

## In plain words

LLMs still struggle to prove theorems when they work only in natural language, because such proofs are hard to check, automatically or even by hand; the authors argue that a formal language such as Lean, where a program checks every proof, gives a clear signal that reinforcement learning can use (abstract, §1). They build Seed-Prover, an LLM that writes complete Lean proofs as helper lemmas plus a main theorem and revises them using the checker's messages, lemmas it has already proved and its own summaries of earlier attempts; three inference settings spend more and more effort per problem. A separate engine, Seed-Geometry, covers geometry, which Lean lacks support for (abstract). At the 2025 International Mathematical Olympiad (IMO), with human experts writing the formal statements, the two systems proved 4 of 6 problems before the deadline and a fifth after it (§3.2). On 155 past IMO problems the authors collected in Lean, Seed-Prover proves 121, with no earlier result to compare (§3.2). The authors present their benchmark results as "outperforming the previous state-of-the-art by a large margin" (abstract).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [Pass@k](#/glossary/passk) · [beam search](#/glossary/beam-search) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [data contamination](#/glossary/data-contamination) · [forward chaining](#/glossary/forward-chaining)

**The paper's own terms:**
- **Lean 4, Mathlib**: the proof assistant used, and its mathematics library (§1, §3.2).
- **Lemma-style proof**: a Lean file that first states and proves helper statements, each introduced by the keyword `lemma`, then proves the main statement (`theorem`) by applying them (§2.2.1, Fig. 2).
- **Lemma pool**: a store, for each difficult problem, of lemmas, proofs, proof difficulties and dependencies from all inference runs, "typically used to" retrieve relevant lemmas and sample the most difficult (§2.2.1).
- **Conjecture, proposer, conjecture pool**: a conjecture is a candidate property of the problem; the proposer module generates 10–50 per call, and the pool collects them (§2.2.2).
- **Self-summarization**: the model's summary of a failed attempt, fed into the next one (§1; Fig. 3).
- **Light, medium, heavy**: the three test-time settings (§2.2.4); n × m is a budget of Pass@n with up to m refinements per attempt (§2.2.4 "Light").
- **Proof rate**: how often attempts prove a statement (§2.2.3, §2.2.4).
- **MOHS**: the Math Olympiad Hardness Scale, a human difficulty rating (§2.2.4, footnote 1).
- **Auxiliary construction**: an extra point, line or circle added to a geometry diagram so that a proof goes through; Seed-Geometry's model proposes these (§1, §2.1).

**Missing glossary terms:**
- **Step-level vs whole-proof provers**: a step-level prover generates a Lean proof "line-by-line" in close interaction with Lean; a whole-proof prover generates "an entire Lean proof at once" (§1).

**Builds on:**
- Whole-proof provers with long chain of thought: Kimina-Prover, DeepSeek-Prover-V2 ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)")) and Goedel-Prover, which the authors say generate proofs starting with `theorem` (§1, §2.2.1).
- Iterative refinement from Lean compiler feedback, credited to an earlier cited work (§2.2.4 "Light").
- TongGeometry, which Seed-Geometry "builds" on with "a major redesign" (§2.1), and the AlphaGeometry line; AlphaGeometry 2 is the baseline (§1, §3.1).
- Draft, Sketch, Prove, contrasted with the proposer: it "presumes the ability to fully solve the problem upfront" (§2.2.2).

## Problem and setting

- **Question:** how far a Lean prover trained with RL, plus test-time search and a geometry engine, gets on olympiad-level problems (abstract, §2).
- **Correctness:** a statement counts as proved when Lean accepts the proof; Lean v4.14.0 with its Mathlib "Unless otherwise specified" (§3.2), v4.16.0 for MiniCTX-v2.
- **Benchmarks** (§3.2): IMO 2025; 155 past IMO problems the authors curated, "Most" adapted from Compfiles (a collection of formalized competition problems) and MiniF2F, with "a subset" added or corrected by human experts; MiniF2F (formal olympiad-level problems, valid and test splits); PutnamBench ("undergraduate math problems", from the Putnam competition); CombiBench (combinatorics problems, which "often involve newly-defined concepts"); MiniCTX-v2 ("context-rich problems from formalization repositories", written after Nov. 2024 "to prevent data contamination").
- **Settings per benchmark** (§3.2): light, then medium for unsolved problems on PutnamBench and CombiBench; heavy as well for the rest on IMO problems and MiniF2F; for past IMO, light and medium for problems "prior to 2017" and heavy "if the medium inference setting failed" for those "after 2017".
- **IMO 2025 inputs** (§3.2): human experts translated all problems into formal statements; for fill-in-the-blank problems, Seed1.6-Thinking (a Seed reasoning model) generated candidate answers before translation.
- Seed-Prover's base model and size: not discussed.

## Approach

**Seed-Prover** (§2.2):
- **Lemma-style proving** (§2.2.1, Fig. 2): the model must "generate some useful lemmas" before the main proof. Stated merits: proved and unproved lemmas are clearly identified, and lemmas "can be compiled independently, stored independently, and combined freely"; the authors call it the system's "most significant distinction from prior work" (§2.2).
- **Conjecture proposing** (§2.2.2): the proposer takes an unsolved problem and, optionally, proved lemmas, and lists candidate properties; this "emphasizes broad exploration of the problem space without committing to a particular approach".
- **Training** (§2.2.3): multi-stage, multi-task RL based on VAPO (an RL algorithm the paper cites). Reward 1 if Lean accepts the proof, 0 otherwise, plus a formatting penalty that pushes lemmas before the main theorem. Problem difficulty, quality and maximum output length rise during training; the proposer makes easier variants of too-hard problems, and problems with proof rate above 1/4 are excluded. Prompts "randomly" include natural-language hints and proofs, lemmas, failed attempts, summaries and compiler feedback.
- **Test-time scaling** (§2.2.4, Figs. 3–4), chosen "Depending on available inference budgets and problem difficulties":
  - *Light*: Pass@8–16, each attempt refined up to 8–16 times with compiler feedback and self-summarization, a budget the authors equate to Pass@64–256, taking 1–2 hours. It proves IMO 2022 P2, which "without refinement" "can only be proved in Pass@8192". Observed behaviors: fixing Lean syntax errors and refining proof sketches, "a process that might entirely alter the reasoning trajectory".
  - *Medium*: an outer loop refines the main proof as in light; an inner loop runs light (8 × 8) on hard lemmas the outer loop failed to prove, and any newly proved lemma is added to the outer prompt.
  - *Heavy*: the proposer fills a conjecture pool with "thousands of conjectures (by default 5000)"; light tries to prove or disprove each; proved ones enter the lemma pool and seed new conjectures. "After days of thinking", lemmas are scored by proof rate, relevance (judged by an LLM) and proof length ("empirically, lemmas with low proof rate are often crucial to the final proof"), and hundreds of top lemmas go to a medium run on the main problem.

**Seed-Geometry** (§2.1): a model proposes auxiliary constructions and a forward-chaining engine derives facts.
- Composite constructions in its description language (§2.1.1); an engine rewritten in C++, which the authors report made it much faster than TongGeometry's Python version (§2.1.2).
- One Seed-family LLM as the policy, trained on problem context and auxiliaries without the goal (§2.1.3), used in a beam search ranked by the model's own likelihood of the proposals (§2.1.4); training data of over 230 million generated problems (§3.1).
- The authors found a value model (estimating steps remaining) "could harm the general performance" under extensive search, and generating all auxiliaries at once "significantly inferior" to step-by-step beam search (§3.1).

**LooKeng** (App. B): the authors' Python interface to an interactive Lean session; its features include a `verify_proof` check of final proofs and complex tactics "with enhanced infotree integration to prevent false positive proofs", using Lean's internal record of the proof.

## Results

Tab. 3 compares Seed-Prover with the best earlier result per benchmark:
- **IMO 2025:** "4/6 (Heavy, 5/6 post-competition)" against "5/6 (Natural language, Gemini)", a natural-language result (Tab. 3). Seed-Geometry solved Problem 2; Seed-Prover proved Problem 5 under medium and Problems 1, 3 and 4 under heavy (§3.2).
- **Past IMO:** 121/155 (78.1%); by difficulty 47/55 easy, 47/56 medium, 27/44 hard; by subject 72/85 algebra, 42/55 number theory, 7/14 combinatorics (§3.2). The authors read this as "consistent capability on IMO problems across all years".
- **MiniF2F:** test 99.6% against 92.2% for Kimina-Prover (Tab. 3). Medium proves 99.6% of each split; heavy then proved the last valid problem (IMO 1990 P3) and failed on the last test problem, from the IMO Shortlist (IMOSL 2007 Algebra P6) (§3.2).
- **PutnamBench:** 201/657 under light alone, 331/657 with medium, against 86/657 for Goedel-Prover-V2 ([Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)")) (§3.2, Tab. 3).
- **CombiBench:** under medium, "outperforming previous work", DeepSeek-Prover-V2 in Tab. 3 (§3.2).
- **MiniCTX-v2:** 81.8% under light, against 44.3% for o4-mini (an OpenAI reasoning model) at Pass@8 (§3.2); the authors read this as "generalizing beyond standalone competition problems".

**Seed-Geometry** (§3.1): 43 IMO-AG-50 problems (IMO geometry 2000–2024) against 42 for AlphaGeometry 2, "Using the accounting method in IMO-AG-50"; Tab. 1 merges five problems that IMO-AG-50 splits in two. On the 39 shortlist geometry problems of Tab. 2, adding hard problems the IMOSL-AG-30 benchmark left out, it solves more than AlphaGeometry 2, whose unreported results are marked "NA". The authors conclude that "Both systems substantially outperform previous formal reasoning frameworks" (§4).

## Limits the authors state

- The MOHS scale for human contestants "may not be well-aligned with the difficulty of proving it in Lean using an LLM" (§2.2.4, footnote 1).
- The proof of IMO 2025 Problem 1 "was finished after the deadline" (§3.2).
- Among the hardest MiniF2F problems it solved are ones "relatively straightforward to reason about in natural language" that pose "significant challenges when formalized in Lean", "primarily from obstacles in applying Vieta's formulas or the non-triviality of counting roots" (formulas linking a polynomial's roots to its coefficients) (§3.2).
- On CombiBench, "relative to other benchmarks, our model still struggles with proving combinatorics problems" (§3.2).
- The IMO problems Seed-Geometry misses but AlphaGeometry 2 solves are "computation-based problems", which AlphaGeometry 2 "could potentially address using its algebraic engine" (§3.1).

## Open problems and building blocks

- **Open:** "Our future work will focus on combining formal systems with large language models to tackle open conjectures" (§4).
- **Released:** the title page lists a "Project Page", a GitHub repository; the paper does not say what it holds (title page).
- **To reuse it:** Lean v4.14.0 (§3.2); light runs take 1–2 hours and heavy "days of thinking" (§2.2.4); Seed-Geometry's data generation ran more than 7 days (§3.1), and its search uses GPUs with CPU thread pools (§2.1.4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
