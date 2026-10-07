# Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain

**Teacher-Free Self-Training Amplifies but…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.07856) · [arXiv](https://arxiv.org/abs/2606.07856)  
Code: [trapdoor-loom](https://github.com/izzortsi/trapdoor-loom)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A generator and a learned critic (LoRA adapters on one 4-bit Qwen3-4B) with the DSL interpreter as a free exact verifier, on a FlashFill-style "trapdoor" DSL (abstract; §4.1).
- STaR rounds of self-training on verified outputs; pass@K of the trained generators against gen_v0, the generator before self-training, which it calls the base (abstract; §6.5; Fig. 2).
- Against "gains compound": it reports gen_v0 overtaking the trained generator at pass@64 on every trajectory, calling K=4 trajectories "indicative" (abstract; §8); the released training data overlap its hard eval bank.

## In plain words

When a language model trains on its own checked outputs, does it acquire capability, or only get better at answers it could already find with enough tries? The author argues two habits blur this: most loops include a stronger teacher, capping any novelty at its level, and "emergence" is declared when a score leaves an apparent zero, even when that zero is a sampling artifact (§1). The paper builds a teacher-free loop on a small string-transformation language whose interpreter checks programs exactly and for free (abstract). Two rounds of self-training raise the share of tasks where some of 8 sampled programs is correct, but the gain never speeds up across four training runs, a sample called "indicative" (abstract). On the easier tasks, with one random choice of which examples are shown, the trained generator beats the generator before self-training with 8 tries per task (53.0% against 46.0%), but with 64 tries the latter wins (68.0% against 61.5%) (§7). The author calls this "amplification, not compounding" (abstract), confirming an expected effect "in a regime that line has not examined" (§7).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk), [rejection sampling](#/glossary/rejection-sampling), [expert iteration](#/glossary/expert-iteration), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [Distillation into compact models](#/glossary/distillation), [LoRA adapter](#/glossary/lora-low-rank-adaptation), [programming by example](#/glossary/program-synthesis).

**The paper's own terms:**
- **amplification**: per-round gain that is monotone but not accelerating, with a ceiling at the operating budget under the base model's large-K pass@K curve (§1).
- **compounding**: per-round gain that accelerates, or a ceiling that breaks above that curve (§1).
- **trapdoor domain**: generating verified (problem, solution) pairs forward is cheap, solving backward is hard for the model, and checking is free, total and exact (§1).
- **constellation**: verifier (the interpreter of the DSL, a small domain-specific language), generator and critic (two LoRA adapters on one shared base), and a model-free conductor (§4.1).
- **naive-pick**: "verifier-filtered best-of-k", the baseline selector (§2, §6.1).
- **verifier ceiling**: the share of tasks for which some sampled program generalizes; Fig. 1 equates it with pass@8 at the default 8 samples.
- **divergence**: the share of tasks whose surviving candidates disagree on held-out inputs, the only place a selector can change the outcome (§6.1, §6.3).
- **atoms**: a program concatenates atoms, each a constant string, a substring, or a case change of an atom (§3.1); the easy and hard banks differ in their maximum atom count (§5).
- **gen_v0, v1, v2**: the generator before self-training and after STaR rounds 1 and 2 (§6.4); §6.5 says gen_v0 was trained only on tasks of up to 3 atoms. The paper calls gen_v0 "the base" in the crossover (Fig. 2 caption).
- **structural classes**: atom count plus flags for constructs used, for analysis only: sub (substring), const (constant string), match (token-match position), case (case change), neg (not defined in the paper) (§3.1, §3.3).
- **axis**: one of four overlapping groups of tasks picked by flags: const-anchored, match-without-const (the "weak axis"), neg-bearing, case-bearing (§3.3).
- **headroom-closed**: an axis's ceiling gain divided by the room it had left (§4.4).
- **visible and held-out examples, split seed**: each task's 12 examples are split at random at evaluation time, the seed fixing the split; the generator sees only the visible ones, and the held-out ones decide whether a pick generalizes (§4.2, §5).
- **K, two senses**: samples in pass@K (§1), and independent training runs, K = 4, in the replication called Tier 3; t0 is the original run (abstract, §6.4).
- **CI**: confidence interval (§6.2).

**Missing glossary terms:**
- **elicitation vs. acquisition**: whether training on verified outputs draws out capability the base had or adds new capability, "the central open question of the current RLVR literature" (§2).

**Builds on:**
- Yue et al. [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)"): the instrument, pass@k at large k; in the paper's account RL-trained models beat their base at low k and are overtaken at large k (§2 "Elicitation vs. acquisition").
- ProRL [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)"), prolonged RL: the counter-case, described as raising pass@k across the whole range and solving instances the base fails at any budget (§2 "The counter-case").
- STaR (Zelikman et al.), rejection-sampling fine-tuning and ReST: keep verifier-confirmed model outputs as fine-tuning targets, retrain (§2 "Self-training / bootstrapping"); none is on this site.
- Cobbe et al. [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"), cited for naive-pick as "the standard baseline a learned selector must beat" (§2 "What we baseline against").

## Problem and setting

- **Question:** does teacher-free self-training lift a model past its base's reach, or only surface what the base could reach (§1)?
- **Language (§3.1):** FlashFill-style string transforms. The interpreter raises an error on an out-of-range position instead of clamping it. Correct means exact string equality on held-out examples (§3.1, §4.2).
- **Tasks** are built forward: a random program run on random inputs (§3.2).
- **Model:** Qwen3-4B-Instruct-2507, a 4-billion-parameter open model, quantized to 4 bits, with rank-16 LoRA adapters, on one 24 GB RTX 3090 (§5).
- **Banks:** easy (at most 3 atoms) and hard (at most 4 atoms), 200 tasks each, described as "never trained on", the hard one as "an out-of-training atom count" (§5). Default: 2 visible examples, 8 generator samples (§5).
- **Seeds:** six split seeds for baseline, critic and trajectory; pass@64 at one (§8).

## Approach

- **The loop (§4.2):** the generator proposes k programs from the visible examples; the verifier drops those failing a visible example; the critic ranks the survivors and the top one is picked; the verifier judges it on held-out examples.
- **Critic (§4.1, App. B):** a LoRA adapter answering yes or no to whether a candidate generalizes, trained on the generator's verifier-labelled candidates; survivors are ranked by the yes-minus-no first-token logit margin. Needed because the verifier can't judge generalization before a pick (§4.1); used only at evaluation (§2).
- **Self-training (§4.3):** each round runs the current generator on fresh, non-bank tasks and keeps its own verifier-confirmed generalizing programs as fine-tuning targets; a task's secret program is never a target. Each round trains on its own data only, to make any collapse visible and hold the method fixed.
- **Gradient metric (§4.4):** headroom-closed per axis, so a low-starting axis isn't credited just for starting lower, with the neg-bearing axis as a low-starting control.
- **Adjudication (§4.4):** the trained generator against the base's pass@K at large K. The author argues the difference from ProRL is regime-bound and "possibly induced by our free exact verifier" (§2).

## Results

- **Critic vs. naive (§6.3):** across six split seeds the critic beats naive-pick by +9.1 pp on average, positive on 6/6. On both seeds of Tab. 3 the overall gain equals the gain on divergent tasks exactly, which the author reads as "the signature of amplification".
- **Trajectory (§6.4, Tab. 4–5):** the six-seed ceiling rises every round on both banks; on t0 the hard bank is, on its face, a mild increase, which Tier 3 tests.
- **Tier 3 (§6.4, Tab. 6):** mean per-round gains over the four trajectories go from +7.2 to +1.9 pp (easy) and +5.1 to +2.8 pp (hard); the author reports "no trajectory shows acceleration" and that every trajectory decelerates.
- **No collapse (§6.4):** distinct generalizing programs per solved task in the STaR data rose from 2.79 to 4.05. §7 names as a contribution "the dissociation between rising harvest diversity and narrowing model coverage".
- **No clean zero frontier (§6.5):** gen_v0 already solves some unseen 4-atom classes on the hard bank, and the zero cells are small, "undersampling artifacts"; so the usual test of emergence by a climb from zero is invalid here (abstract).
- **Wall above the ceiling (§6.5):** at 64 samples the base fits the visible examples on about 11 pp (22 tasks) more tasks than it generalizes on, on both banks: the author's "real generator-capacity bound".
- **Crossover (§7, §8):** at split seed 1234, v2 beats the base with 8 samples (53.0%/46.0% against 46.0%/38.0%, easy/hard), and the base beats v2 with 64 (68.0%/57.5% against 61.5%/52.5%). Every v2 pass@64 stays below the base's in all four trajectories on both banks (§8); on the easy bank, going from 8 to 64 samples adds much more for the base than for v2 (§7).
- **Selector value erodes (§7):** divergence fell as the generator sharpened.
- **Weak axis (App. C, Tab. 9):** only in round 1 did the weak axis close the most headroom on both banks; in round 2 its easy-bank lead is "a 1-task noise move" and the hard bank inverts: "a one-round transient" (single seed).

## Limits the authors state

- K = 4 trajectories: "indicative, not a robust CI", five or more wanted; the replication covers no-acceleration but "not every per-round magnitude"; the weak-axis gradient is single-seed (§8 "Statistical power").
- pass@64 only lower-bounds unlimited sampling, and its ceilings are "single eval-seed", a dependence the author argues the gap sizes make not fragile (§8).
- One base model, one GPU, one DSL, one program prior; "domain-internal" (§8).
- Generator and critic share one frozen base; "a separately-based critic would be a cleaner test, and we have not done it" (§8).
- Only two STaR rounds: no-acceleration "rests on two paired steps", and "the still-climbing hard bank could behave differently with more rounds" (§8).
- No accuracy on a standard PBE benchmark such as SyGuS, a program-synthesis competition set (§8).
- "no compounding" "may be a property of this verification regime rather than of self-training in general"; "A noisy verifier, a learned reward model, or a teacher could behave differently" (§7 "Scope").
- The diversity metric differs from the collapse literature's, so "the comparison is qualitative rather than a refutation" (§2).
- Per-class tables are single-seed and "diagnostic" (App. A).

## Open problems and building blocks

- **Open:** a train-seed interval with five or more seeds, and per-point error bars for the pass@64 ceilings, are "left to future work" (§8).
- **Released:** "The code and all result artifacts", under CC0 1.0 (§9).
- **To reuse it:** one 24 GB GPU, 4-bit Qwen3-4B, two LoRA adapters run as sequential passes (§5); a pure-stdlib, unit-tested analysis core (§9).
- **Beyond its domain:** "a practical lesson" for such constellations: "improving one role can shrink another role's niche" (§7). Existence-of-compounding claims resting on zero-pass@k cells "must first establish those cells non-trivial at population scale" (§7), which §6.5 states for "a compositional domain".

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
