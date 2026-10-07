# The Verifier is the Curriculum: Precision Sets the Return on Search in Code Self-Distillation

**The Verifier is the Curriculum** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.09709) · [arXiv](https://arxiv.org/abs/2607.09709)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Rejection-sampling self-distillation of a code generator, gated by whether the generated game project launches cleanly, with no judge (abstract).
- Varies the gate's precision: a lenient build check, a partial-credit gate, and noisy "fuel" on APPS (abstract).
- Verifier precision governs the loop at a fixed admitted count: it reports that swapping only the gate for a lenient build check erases the gain (abstract).

## In plain words

One way to improve a code-writing model is to have it generate outputs, keep those a checker accepts, and retrain on them. The authors argue that a learned judge as checker can be fooled by cheap surface changes, so they use a fixed program: it accepts a generated game project only if it launches cleanly in a game engine (§1). With a 14-billion-parameter model, three rounds raise the share of generated projects that launch cleanly, on game families never trained on, from 8.8% to 42.2% (abstract). On programming problems checked by unit tests, with the number of kept programs fixed, they report that the gain is roughly proportional to the share of kept programs that are correct, from a quarter to all (abstract; §1), while rejecting up to three quarters of the correct ones costs almost nothing as long as enough remain (§1). They present the work as identifying the checker's precision (the share of accepted outputs that are correct) as what governs the loop at a fixed number of kept outputs, and pricing it (§1).

## Background and terms

**Terms to know:** [rejection sampling](#/glossary/rejection-sampling) · [expert iteration](#/glossary/expert-iteration) (the paper's iterated "self-distillation", §5) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reward hacking](#/glossary/reward-hacking) · [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **curriculum**: the training data the acceptance filter lets through; "what it certifies is what the model learns" (§1).
- **STRICT-LAUNCH**: the training gate. A candidate passes if the Godot engine, run headless (no display), exits with code 0 and prints no parse, load or resource error, found by matching error patterns (§1, App. B). **BUILD**, the weaker rung, only opens the project and quits; parse errors are not fatal (§4). Both are rungs of a ladder of signals ordered by how much they certify, topped by the benchmark's visual judge (§4, Fig. 4).
- **gold**, **fuel**: the benchmark's reference projects; and the clean self-generated set a round keeps and adds to the gold pool (§5).
- **SFT**, **RFT-rt**: the model trained on gold only (also M0), and the model after t filtered rounds (§5).
- **per-candidate clean-launch rate**: share of all candidates for held-out tasks that pass STRICT-LAUNCH, the primary metric; **coverage@K**: share of tasks with a clean candidate among K, by the pass@k estimator (§5).
- **fuel precision π**: fraction of admitted candidates that pass all tests (§8, Fig. 1). **Count-matched** arms admit the same number of rows (§8).
- **false positive / false negative** of a gate: admitting a wrong candidate / rejecting a correct one, created by masking correct candidates (§8).
- **harvest budget**: candidates sampled per brief or problem (§5).
- **execution grounding**: a readout, never a training signal, that steps the running game and scores observable state change (§6, App. B).
- **cluster-permutation test**: shuffles arm labels within each task, so the 25 held-out tasks are the unit of evidence (§5, App. C).

**Missing glossary terms:**
- **Youden index**: a verifier's true-positive rate minus its false-positive rate (§1, §8).

**Builds on:**
- STaR, ReST and rejection-sampling fine-tuning for math (Yuan et al., 2023): the method is that procedure "with one deliberate choice", the STRICT-LAUNCH gate (§5, §2).
- GameCraft-Bench, 140 game-generation tasks, and APPS, competitive-programming problems with hidden unit tests (§3, §8).
- Concurrent work on noisy verifiers in online RL: [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)"), Cai et al. (2025), and Rad et al.'s analysis of GRPO under noisy verification, where the Youden index alone governs drift on wrong reasoning; the authors' two corrupted arms share that index "yet do not train alike" (§2).
- Work on whether self-training adds capability, with exact or self-verifiers: [Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)"), [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") (§2); also [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") (App. D).

## Problem and setting

- **Question:** what about an acceptance filter governs the held-out gain of self-distillation, and how does precision trade against recall, harvest budget and model scale (§1, §10)?
- **Game setting (§3):** a short brief must become a complete Godot 4 project (configuration, scenes, scripts, a recorded input trace); the official score comes from a GPT-5.5 visual judge. Of 140 tasks in 15 families, 10 families (111 gold projects) train, four (25 tasks) are held out, one is excluded. Harvesting uses training-family briefs only (App. C).
- **Models:** Qwen3-14B with LoRA (low-rank adapters, a light fine-tuning method), 8 candidates per brief, evaluated on 800 candidates per model over four decoding seeds (§5, App. C); replications at 8B and 4B (§9).
- **What "correct" means:** launching cleanly; functionality and brief compliance are measured separately by two readouts (§6, App. B); on APPS, passing all hidden tests (§8).
- **Programming setting (§8):** Qwen3-4B lightly supervised on 300 APPS-introductory solutions is M0; fuel comes from 1,500 training problems; evaluation uses up to 470 held-out problems (150, plus 320 added later as a replication), over eight training seeds for most experiments and 23 for the precision ladder.

## Approach

- **The loop (§5, Alg. 1 in App. C):** each round samples from the previous model on training briefs, keeps candidates with at least three files that pass STRICT-LAUNCH (at most two per brief), adds them to gold, and retrains a fresh LoRA from the base.
- **Matched controls at round 1's fuel budget (§7)**: duplicated gold (CTRL); the same loop with BUILD as filter; round 1's count of fuel from a later generator (GEN-SWAP).
- **APPS ladders (§8):** count-matched fuel admitted by STRICT (all tests pass), PARTIAL (at least half, not all) and LENIENT (syntax-valid, not all) (Tab. 6); a constructed ladder that injects false positives at precision 1 down to 0.25 and compares each gain with precision times the clean gain (Fig. 1); and an error-direction ladder of false-positive, false-negative and mixed arms at a fixed count (Fig. 5).
- **GRPO arms (§8, Tab. 3)**: the same two errors at a 25% dose with GRPO in place of rejection fine-tuning, at matching Youden index; Qwen3-4B, 300 steps (App. C).
- **Search cross (§10, Fig. 2):** gate (STRICT or PARTIAL) × harvest budget (8 or 32).
- **Cost accounting (§10)**: each axis priced in verifier calls and generated tokens.

## Results

- **Compounding (§6, Tab. 1):** the authors report the clean-launch rate rising from 8.8% (SFT) to 42.2% after three rounds, round 3 beating SFT on all 25 held-out tasks, and coverage at 32 candidates rising from 84% to 100%, the gold ceiling. Three retraining seeds give climbs "monotone in every seed". Two readouts the gate never optimizes also rise each round (Fig. 6).
- **Controls (§7, Tab. 1)**: against SFT's 8.8%, BUILD-gated reaches 8.6% and round 1 13.6%, while duplicated gold falls to 5.6%; in paired tests BUILD-gated is indistinguishable from SFT and below round 1. The authors write that changing only the verifier's precision "erases the entire first-round gain". GEN-SWAP beats round 1, which they read as each round's fuel being better, not just larger, and the fuel reaches more training tasks each round (Fig. 3).
- **APPS gate ladder (§8, Tab. 6):** STRICT beats every other arm in every training seed; LENIENT leaves pass@1 unchanged.
- **Linear pricing (§8, Fig. 1)**: over 23 seeds, fuel at precision 0.5 returns +3.59 percentage points (pp) against the +3.69 the linear rate predicts; every residual interval covers zero, and the pattern repeats on the 320-problem replication.
- **Error direction (§8, Fig. 5):** over eight seeds, masking three quarters of each problem's correct candidates moves held-out pass@1 by −0.03pp relative to the clean arm; a quarter of false positives moves it by −1.58pp.
- **GRPO (§8, Tab. 3)**: the false-negative arm has the fewest groups with no learning signal and, in every seed, more gradient than the clean arm; its rollouts score lower than the clean arm's under the uncorrupted verifier. The authors write: "What eight seeds resolve here is the training signal, which separates in every one of them; held-out transfer points the same way".
- **Search (§10, Fig. 2):** over eight seeds, quadrupling the harvest is worth +1.62pp behind STRICT and +0.31pp, indistinguishable from zero, behind PARTIAL; STRICT at the low budget still beats PARTIAL at four times the budget.
- **Scale (§9, Tab. 2):** three rounds also compound at 8B, one round helps at 4B, and every base tried, across three model families, yields clean fuel under a matched recipe.
- **Pricing (§10)**: the authors say the yield cost of a stricter gate falls as the loop runs, and conclude: "In our setting, precision is the cheapest of the three axes and the one that returns the most".
- **Efficiency, not reach (App. D):** on four tasks where SFT has no clean project among 32 candidates, 512 fresh draws find some; the authors read the gap as sampling efficiency.

## Limits the authors state

- "Our main compounding loop is studied on a single engine"; with 25 held-out tasks "only single-round differences well above the per-task variability are resolvable", and drawing more candidates per task does not reduce that between-task variability (Limitations).
- Execution grounding "is a lower bound on functionality" (Limitations).
- The error-cost ranking "is a statement about offline rejection sampling" (§8); a gate may spend three quarters of its recall for free "as long as the surviving pool still fills the quota" (§1).
- At a fixed admitted count a stricter gate needs more generation, in inverse proportion to its yield (§10).
- The judge-gaming probe is "a separate setting from the from-scratch generator studied in the main text" (App. A).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "Code, the harvested fuel, and one adapter per reported arm will be released upon publication" (App. C "Data and split").
- **To reuse it:** the Godot 4 engine, Qwen3-14B with LoRA, vLLM; a single 96 GB GPU, and "on the order of tens of GPU-hours" for a three-round loop (App. C).
- **Beyond its domain:** "The gate needs no domain-specific retuning: the same all-or-nothing rule applies to a launch check and to a unit-test check. Where a verifiable predicate exists for the artifact, precision is what to buy first." (§11)

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
