# Improving LLM Code Reasoning via Semantic Equivalence Self-Play with Formal Verification

**Semantic Equivalence Self-Play (SEQ/SINQ** · Haskell), Findings of ACL 2026

Read: [PDF](https://arxiv.org/pdf/2604.17010) · [arXiv](https://arxiv.org/abs/2604.17010) · [DOI](https://doi.org/10.18653/v1/2026.findings-acl.1615)  
Code: [llm-self-play-liquidhaskell](https://github.com/Baki-0501/llm-self-play-liquidhaskell)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A generator (Alice) writes a variant of a reference Haskell program, either equivalent with a Liquid Haskell proof (SEQ) or inequivalent with a diverging input that is executed (SINQ); an evaluator (Bob) judges whether the pair is equivalent, and its sampled success rate sets each instance's difficulty (abstract; §3.1, §3.3).
- Rejection-sampled supervised fine-tuning instead of RL (§3.4), of DeepSeek-R1-Distill-Qwen-7B with LoRA adapters (§4); Bob is trained once, after all seven rounds (App. E.1, E.4); transfer is tested on EquiBench, PySecDB, CodeXGLUE and Haskell HumanEval and MBPP (§5.2–5.3).
- Extends [Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)") from refutation to certified equivalence as well (our reading). Proofs are the bottleneck: it reports that 34 of 1,750 equivalence attempts in the main run passed Liquid Haskell (App. F.2, Tab. 6), yet the authors credit equivalence proofs as "uniquely responsible" for the evaluator's reasoning gains (abstract; §5.4.1, ablations of about 150 training pairs, Tab. 7–8).

## In plain words

Deciding whether two programs always agree is hard in general: the authors note current LLMs often fail to recognise when two pieces of code behave the same, and that test suites miss "deep semantic properties and edge cases" (§1, §2). They work in Haskell, where a checking tool, Liquid Haskell, can verify proofs that two functions agree on every input "for a subset of Haskell programs" (§1). One copy of a 7-billion-parameter model rewrites a function, either into an equivalent one with a proof or into a different one with an input on which the outputs differ; the tool checks the proof, or the input is run. A second copy judges whether the pair is equivalent. Both are fine-tuned on data built from their checked or correct outputs, the judge once, at the end (§3; App. E.1). Asked without examples, the trained judge gains up to 13.3 percentage points of accuracy over the untrained model on EquiBench, a benchmark of program pairs (abstract; §5.3.1). The authors present the work as extending an earlier inequivalence-only game with equivalence proofs (§2).

## Background and terms

**Terms to know:** [self-play](#/glossary/self-play) · [rejection sampling](#/glossary/rejection-sampling) · [LoRA](#/glossary/lora-low-rank-adaptation) · [SMT solvers](#/glossary/sat-and-smt-solvers) · [Rice's theorem](#/glossary/halting-problem-and-rices-theorem) · [curriculum learning](#/glossary/curriculum-learning) · [pass@k](#/glossary/passk) · [F1 score](#/glossary/f1-score)

**The paper's own terms:**
- **Alice and Bob**: the generator, which writes a variant Q of a reference program P, and the evaluator, which decides whether P and Q are equivalent (§3.1).
- **SEQ and SINQ**: the Semantic Equivalence and Semantic Inequivalence games. In SEQ, Alice writes a Q with P(x) = Q(x) for all inputs x, plus a Liquid Haskell proof; in SINQ, a Q that differs from P on at least one input, plus such a **diverging input** (§3.3 "Step 2a", "Step 2b"). Alice's SINQ prompt also counts different exceptions, or one program halting and the other not, as a difference (App. D.5).
- **Difficulty score**: Bob judges each pair N times, typically 10; the score is 10 × (1 − his share of correct verdicts), so 10 is hardest (§3.4.1, Eq. 1). Pairs above a threshold τ are "hard"; §3.4.1 gives τ = 5 as an example, and the runs use τ = 3 (App. E.2).
- **OpInstruct-HSx**: the authors' dataset of Haskell functions used as reference programs (§3.2).
- **Regimes E0–E3**: the main run and three ablations (§4, Tab. 1).

**Missing glossary terms:**
- **Refinement type**: a type with a logical condition its values must meet (for example, integers greater than zero). Liquid Haskell adds such types to Haskell and checks them with SMT solvers (§2). (General definition; the paper does not define it.)
- **Reflection and Proof by Logical Evaluation (PLE)**: the Liquid Haskell features used to build "machine-checkable lemmas" that two functions are equal pointwise (§2). Reflection makes a function's definition usable inside the logic; PLE unfolds such definitions automatically (general description; the paper does not define them).

**Builds on:**
- Miceli-Barone et al. (2025), the Semantic Inequivalence Game ([Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)")), the inequivalence-only Alice–Bob game; this paper adds SEQ and formal verification (§2) and follows its difficulty filtering (§3.4.1).
- Liquid Haskell (Vazou et al., 2014), the proof checker (§2).

## Problem and setting

- **Questions (§1):** whether an adversarial loop in a functional language can produce a "progressive curriculum" that improves semantic reasoning; whether the skills transfer to other languages and domains; and what equivalence proofs and execution-based counterexamples each contribute.
- **Programs:** single Haskell functions; the roughly 28,000 in OpInstruct-HSx were translated from nvidia-OpenCodeInstruct (a Python instruction corpus) by DeepSeek-R1-Distill-Llama-70B and kept only if they compile with GHC (the Glasgow Haskell Compiler) and run without error on one generated input (§3.2).
- **What counts as correct:** an equivalent pair needs a proof Liquid Haskell accepts; an inequivalent pair needs a diverging input that execution confirms; other samples are discarded (§3.3 "Step 3: Verification through Liquid Haskell or Execution").
- **Model:** DeepSeek-R1-Distill-Qwen-7B for both roles, with LoRA adapters (§4).
- **Evaluation**, against the untrained base model: Bob's accuracy on pairs the final Alice makes (§5.1.1); Haskell versions of the code-generation benchmarks HumanEval and MBPP from MultiPL-E (a translation of such benchmarks into many languages), averaged over 16 trials (§5.2.1); EquiBench, whose categories are algorithmic refactors (OJ_A), variable renaming (OJ_V), both (OJ_VA), and the low-level sets DCE (C pairs with "dead/live code variations"), STOKE and TVM (§5.3.1); PySecDB, security-related commits in Python (§5.3.2); and CodeXGLUE defect detection, C functions labelled for security defects (§5.3.3).

## Approach

- **The loop (§3.3, Fig. 1):** pick a reference program and play SEQ with 50% probability, otherwise SINQ. Alice is asked to target difficulty 10. Liquid Haskell checks SEQ proofs; SINQ inputs are executed. Bob sees only P and Q, and his sampled success rate sets the difficulty.
- **Rejection-sampled fine-tuning, not RL (§3.4):** the authors cite the practical challenges of [reinforcement learning](#/glossary/reinforcement-learning) (App. C: sparse rewards, credit assignment, compute). Alice gets three kinds of examples (§3.4.1): her generations (every hard pair, plus easy ones numbering a fifth of the hard ones); difficulty predictions, teaching her to predict Bob's score; and, for each proved SEQ pair, her reasoning and accepted proof. Bob trains on his correct verdicts (§3.4.2).
- **Schedule (App. E):** seven rounds; after each, Alice is fine-tuned on all retained examples, each time from the base model (App. E.3). Bob "is not fine-tuned iteratively but only once after all rounds are complete" (App. E.1), so a fixed untrained Bob scores difficulty (Fig. 3 caption).
- **Regimes (§4, Tab. 1; App. F):** E0 plays SEQ and SINQ 50/50 on 500 programs; E1 SINQ only on 500; E2 attempts SEQ 96% of the time so that verified SEQ and SINQ examples come out about even; E3 SINQ only on 40 programs, derived from E0's yields so that its expected verified pairs match E2's (App. F.3–F.4).

## Results

- **Harder instances (§5.1.1, Fig. 3):** mean difficulty rises from 0.50 to 1.18 by round 7: "Alice is crafting harder instances for a constant Bob".
- **In-domain (Tab. 2):** the trained Bob scores 88.79% against the base model's 88.24% on pairs from unseen test programs, and 91.34% against 87.57% on training programs, "modest improvements on unseen data" (§5.1.1).
- **Haskell code generation (Tab. 3):** Bob's pass@1 rises from 17.7% to 26.4% on HumanEval and from 26.7% to 36.9% on MBPP; Alice gains similarly, and compilation errors fall for both.
- **EquiBench (§5.3.1, Fig. 4–5):** the largest gains are on OJ_A and OJ_V; the abstract's 13.3 points match OJ_V accuracy, 56.5% → 69.8% (Fig. 4, from its value labels). The authors report "weaker or negligible improvements" on DCE, STOKE and TVM.
- **PySecDB (Tab. 4):** gains on all four metrics, for example F1 51.3% → 54.0%.
- **CodeXGLUE (Tab. 5):** both models are near random-guess accuracy, recall and F1 fall after training, and the authors find "no meaningful advantage" (§5.3.3).
- **Proof yield (§5.4; App. F.2, Tab. 6):** in E0, 34 of 1,750 SEQ attempts were validated against 903 of 1,750 SINQ attempts; the small model "often struggles to produce Liquid Haskell proofs" (§5.4).
- **Regimes (§5.4.1, Tab. 7–8):** the authors report that E0 beats the SINQ-only E1 "on semantic equivalence tasks" despite fewer verified pairs. With volume matched at about 150 pairs, E2 "yields consistent advantages on structural reasoning tasks" over E3, which the authors say "confirms that SEQ supervision confers a unique benefit"; the abstract says equivalence proofs are "uniquely responsible for the model's reasoning capabilities". They say E2's few verified pairs cause "performance degradation across all benchmarks" against E0, and call the 50/50 mix "an acceptable trade-off" (§5.4.1 "Volume Trade-offs").

## Limits the authors state

- **Proof bottleneck (§8):** "Alice rarely produces Liquid Haskell proofs that successfully pass PLE", so verified data is mostly SINQ; this is "likely exacerbated by the relatively small model size".
- **Liquid Haskell (§8):** "Non-terminating behaviors, partial functions, and large-scale algebraic rewrites are difficult to certify, and in some cases impossible" (partial functions: undefined on some inputs), and "not all Haskell programs are reflectable".
- **Transfer (§8):** Bob is "notably weaker on low-level or stateful semantics, including DCE, STOKE, TVM, and CodeXGlue" (memory, side effects, bit-level operations).
- **Small samples:** E2 and E3 "were limited by small sample sizes, which may not be representative of the true differences" between the two kinds of supervision (§7); the SEQ difficulty trend rests on a sample that "is not statistically significant" (App. H.1.1); matching volumes leaves differences from "the difficulty distribution of accepted items and class-imbalance within Bob's updates" (App. F.5).
- **Compute (App. E.2):** at most 500 programs per run and τ = 3 rather than the default 5; with more resources the authors recommend more programs and τ = 5 "to more closely simulate a fully adversarial setting".
- **Misuse (§9):** the training may teach models to "introduce obfuscated backdoors" as well as to detect vulnerabilities.

## Open problems and building blocks

- **Open (§7):** more rounds; larger models and full-parameter fine-tuning instead of LoRA; tasks that model memory, side effects and bit-level operations; a "dedicated Haskell Equivalence Evaluation test set" built from the pipeline; and RL again, since with reward-based updates "it may be possible to overcome the current proof bottleneck". The named bottleneck is proof synthesis (§8).
- **Released:** OpInstruct-HSx on Hugging Face (§3.2, footnote 2), and the code to create the data and replicate the experiments (§3.2, footnote 3; §4); the abstract says "The entire training pipeline and dataset are publicly released".
- **To reuse it:** DeepSeek-R1-Distill-Qwen-7B with LoRA (§4); GHC and Liquid Haskell with reflection and PLE (§3.2, App. D.3); DeepSeek-R1-Distill-Llama-70B for the translation (§3.2); a main run "takes about 3 days on 4 NVIDIA L40S GPUs" (App. E.2, footnote 5).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
