# Propose, Solve, Verify: Self-Play Through Formal Verification

**PSV (Propose** · Solve, Verify), preprint 2025

Read: [PDF](https://arxiv.org/pdf/2512.18160) · [arXiv](https://arxiv.org/abs/2512.18160)  
Code: [psv](https://github.com/abwilf/psv)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Self-play where a formal verifier (Verus) checks generated programs, and a proposer writes new specifications at difficulty levels set from the solver's pass rates, easy ones included (§3.1).
- Expert iteration for the solver; difficulty-aware proposals.
- A close non-SQL analogue of the SQL ↔ text ↔ verify loop (our judgement): a sound checker filters what self-play trains on, though sound only against a spec the proposer writes.

## In plain words

Self-play means a model improves by setting itself practice problems and learning from its own correct answers. In code, the authors argue, the usual check is unit tests, which wrong programs can pass, so errors leak into training (§1). This paper uses a formal verifier instead: a tool that proves a program does what a written description demands for every allowed input. One model writes such descriptions, aiming at chosen difficulty levels judged from how often the solver currently succeeds; the solver writes Rust programs with proofs and is fine-tuned on those the verifier accepts (§3). Starting from a small open code model, the authors report gains of up to 9.6 times in first-try success over a prompting-only method and over repeated fine-tuning on the starting problems alone (abstract). They present formal verification as a way to "unlock a new paradigm for self-play in code generation" (§1).

## Background and terms

**Terms to know:** [self-play](#/glossary/self-play) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [soundness and completeness](#/glossary/soundness-and-completeness) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [reward hacking](#/glossary/reward-hacking)

**The paper's own terms:**
- **PSV**: Propose, Solve, Verify, the method; **PSV-Verus** is the model it trains (abstract).
- **Verus**: a framework for formally verifying Rust programs (§1), covering a subset of Rust (§3 "Problem setting"); it turns program and spec into conditions an SMT solver proves (App. F). **Dafny** is another verification language (§3).
- **formal specification (spec)**: a function's signature plus preconditions (`requires`: which inputs are allowed) and postconditions (`ensures`: what the output must satisfy) (§1, App. A, App. D).
- **verifier**: returns 1 if the code meets the spec, else 0 (§3 "Problem setting").
- **solution**: an implementation plus any proof code the verifier needs, such as **loop invariants** (statements true on every pass through a loop; example in App. D) (§3 "Problem setting").
- **proposer / solver**: the model that writes new specs, and the model that writes code for them (§1).
- **pass rate**: the share of the solver's attempts at one spec that verify; it sets the spec's difficulty class: Easy, Medium, Hard, or Impossible when no attempt passes (§3.1).
- **question budget**, two senses: the number of new specs proposed per iteration (§3.1, Algorithm 1); and in §6.2 and Fig. 6, a "fixed total question budget" spread over all iterations.
- **RFT (rejection fine-tuning)**, also called expert iteration: sample solutions, keep only the verified ones, and fine-tune on them (§3.1). The name covers both PSV's solver update (§3.1) and a baseline that runs iterative RFT on the seed problems without proposing new ones (§4).
- **pass@k**: the chance that at least one of k sampled solutions verifies, estimated from 100 samples per problem (§4).
- **transfer learning / test-time training**: the two settings (§4). Transfer: seed the loop with Dafny2Verus, test on MBPP and HumanEval. Test-time training: seed it with the specs (not solutions) of the benchmark being scored, and run on that benchmark alone.
- **spec verifier**: a filter that checks a proposed spec compiles and is well-formed, by running Verus with the function body left unchecked (§3.1, App. D).

**Builds on:**
- AlphaVerus (Aggarwal et al., 2024; not listed here): a prompting method for Verus code, "the previous SOTA", run here with 50 in-domain examples and no "treefinement" step (§4). PSV takes its seed corpus (§1) and its few-shot setup, with one example (§3.1); it is a baseline (§4).
- Expert iteration (Singh et al., 2024; not listed here): the solver's training and a baseline (§3.1, §4).
- STP ([STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)")): self-play for formal theorem proving (§1); the Medium threshold is set "similar to" it (§4).
- Absolute Zero ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")): proposer–solver self-play on easy-to-check coding tasks (§1, §2).

## Problem and setting

- **Question:** can proposer–solver self-play improve LLM code generation with a formal verifier as the check? With unit tests, self-play in code is "an open problem" (§1).
- **What "correct" means:** the verifier accepts the code against the spec. The authors state that Verus is sound with respect to the specification (App. F), so a verified program meets its spec for all inputs (§1).
- **Benchmarks** (§4), all asking for Rust+Verus code that passes Verus: Dafny2Verus (274 problems: Dafny problems translated into Verus via the AlphaVerus pipeline), MBPP-Verified (78; Verus versions of MBPP, short Python programming tasks) and HumanEval-Verified (85 functions from 49 programs; Verus translations of HumanEval, a Python function-writing benchmark).
- **Model:** Qwen2.5-Coder-3B-Instruct, a 3-billion-parameter open code model (§4). The paper does not say separately which model proposes.
- **Human data:** the seed corpus comes from human-written problems (§1); the authors state that "human-written solutions are never trained on" (§4).
- **Evaluation:** transfer learning and test-time training (above); pass@1, 5 and 10, means over 5 random seeds (§4, Tab. 1).

## Approach

- **The loop** (§3.1, Algorithm 1, Fig. 3). Each iteration: (1) the solver samples 10 solutions per spec, with a 1-shot prompt (§3.1, §4); (2) Verus checks each; (3) the solver is retrained from the base model on the verified solutions, at most one per spec; (4) the proposer writes new specs, which join the pool (§3.1).
- **Solver training** (§3.1). RFT with the usual next-token loss on verified solutions only; the authors note it "can be seen as an offline RL algorithm based on expectation-maximization": it learns from batches of samples collected beforehand (offline), alternating between producing and filtering samples and fitting the model to them. They chose it over "advantage-weighted" RL such as GRPO (which also pushes down below-average outputs) because Verus is "sound but not complete" (it can reject correct code, App. F), so such algorithms "could incorrectly punish models for correct solutions" (§3.1).
- **Difficulty-aware proposing** (§3.1, §4). A spec's difficulty comes from the current solver's pass rate: Easy at 0.8 or above, Medium from 0.2 up to 0.8, Hard above 0 but below 0.2, Impossible at 0. The proposer is prompted with 12 sampled specs (3 per class), each labelled with its difficulty, and asked for a spec at a target level, a quarter of the budget per class (§4). The proposer's weights are not trained: refreshing its examples updates it "through in-context learning" (§3.1; prompt in App. A).
- **Filtering proposals** (§3.1, App. D). New specs are parsed, deduplicated and passed through the spec verifier.

## Results

- **Main table** (Tab. 1, §5). The authors report that PSV-Verus "consistently outperforms" both baselines on all metrics, improving across iterations (Fig. 4).
  - Test-time training, Dafny2Verus pass@1: 65.63%, against 34.46% for RFT and 24.06% for AlphaVerus (§5).
  - Test-time training, MBPP pass@1: 36.78%, against 3.83% for RFT (the 9.61× of §5, the abstract's "up to 9.6×") and 6.48% for AlphaVerus.
  - Transfer learning, pass@1: MBPP 25.25% and HumanEval 16.18%, against AlphaVerus's 6.48% and 7.24% and RFT's 10.99% on both (§5).
- **More questions per iteration** (§6.1, Fig. 5). In test-time training, Dafny2Verus pass@1 rises from 59.5% to 74.3% from 4k to 32k questions, with gains on MBPP and HumanEval too. In transfer learning, MBPP improves but HumanEval pass@1 stays flat (App. C).
- **More iterations at a fixed budget** (§6.2, Fig. 6). Splitting a fixed question budget over more iterations beats one large iteration, at 1k, 2k and 4k budgets.
- **Ablations** (§6.3, Tab. 2, transfer setting). Tab. 2's "Avg" column: 43.31 for PSV-Verus, against 27.90 when solutions are trained on without verification, 40.87 without difficulty labels in the proposer prompt (App. G), and 38.71 with a fixed instead of refreshed proposer prompt. The authors trace the diversity gain to more unique and more solvable proposed questions. Dropping the spec verifier brought no performance gain and cost 2.1× the inference compute (§6.3).
- **Proposal settings** (App. B, Tab. 3). Examples of all classes in, uniform targets out, did best of four settings.

## Limits the authors state

- Hyperparameters were "selected to provide a proof of concept of our idea at minimal compute scale" (§4).
- Difficulty prompting gives "partial but incomplete control": easy-, medium- and hard-targeted specs have mean pass rates of 0.55, 0.45 and 0.36, with large overlap (§6.3).
- Several difficulty and diversity ablation drops on MBPP and HumanEval are not statistically significant (§6.3).
- Transfer from Dafny2Verus to HumanEval shows "minimal scaling effects", in line with prior work (App. C).
- Verus is sound only "up to the trusted computing base" (the parts assumed correct rather than proven, such as the verifier and solver themselves), and such tools "are incomplete" (App. F).
- Self-improvement through self-play comes "with ethical concerns" (§ Impact Statement).

## Open problems and building blocks

  - Applying PSV to other problems with a sound verifier "is left for future work" (§3 "Problem setting").
  - "Future work on on-policy RL algorithms for formally verified self-play may investigate more performant RL algorithms in this setting" (§3.1).
  - Bottleneck: "solving is the most computationally intensive part of the pipeline", so more few-shot examples, which helped, were not used (§3.1).
  - Better control of proposed difficulty is "an area that future work may find fruitful to improve upon" (§6.3).
  - The authors call the work "an exciting first step in understanding the limits of scaling for self-play reasoning training" (§7).
- **Released:** "We release our code and models" (§1); App. E adds that the fine-tuning code and configurations are in the repository.
- **To reuse it:** Verus; Qwen2.5-Coder-3B-Instruct; SGLang (an LLM serving engine) for sampling (§4); LoRA fine-tuning with Hugging Face `trl` on one A6000 GPU (App. E, Tabs. 4–5). The main experiment takes about 24 hours on one machine with 8 L40S GPUs (§4).
- **Beyond its domain:** "in principle our methods apply to any problem with a sound verifier" (§3 "Problem setting").

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
