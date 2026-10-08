# Scope Before You Persist: Preventing Cross-Family Interference in Agent Memory

**Scope Before You Persist** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.29144) · [arXiv](https://arxiv.org/abs/2609.29144)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A frozen model edits a 360-character skill policy for a frozen actor round by round, and a gate (ORC: public examples, private tests and metamorphic checks, each with a paired-bootstrap bound, no regression on earlier families) decides each edit; the authors then retrieve each accepted skill only for the task family that produced it (§1; §3; §4).
- Their own 12-round code-repair stream, ProcStream-RSI, with Qwen3-Coder-Next as actor and editor, against Static, Latest-only, Self-judge, Replay and Batch-ORC controls (§5.1–5.2; §5.4), first as a fixed-completion re-scoring of the same accepted skills, then in 27 paired randomized-order streams (§5.3–5.4; §6).
- A check can be right where it looked and still do harm: every ORC acceptance passed its same-family probes, yet under global memory the authors report that six of eight accepted updates lowered the next hidden checkpoint and the agent ended below one that never updates (abstract; §6, Tab. 4; App. A). A case for deciding not only whether a memory edit is supported but where it may be used.

## In plain words

An LLM agent can improve without retraining by keeping a short advice text that a model rewrites after each round, with a check deciding which rewrites to keep. The authors ask when such edits help across recurring task kinds, "rather than only the family that produced the latest feedback" (§1). On their own 12-round code-repair stream with nine recurring task kinds and one frozen model as solver and editor (§5.1, §5.4), their strict check, which runs the repaired programs on private tests and checks, kept one edit per stream; given to every task, it lowered the held-back test score in six of eight streams (abstract; §6). Re-scoring the same archived outputs with each edit given only to its own task kind raises the average held-back score from 0.713 to 0.816, against 0.775 for an agent that never edits, with no harmful edit (abstract; Tab. 4). In 27 paired streams with random task order, this per-kind memory accepts 63 edits against 12, none harmful (abstract; Tab. 6). The authors present scope matching as "a complementary control for persistent agent memory" (abstract).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [automated program repair](#/glossary/automated-program-repair) · [metamorphic testing](#/glossary/metamorphic-testing) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [AUROC](#/glossary/auroc) · [multiple testing](#/glossary/multiple-testing) · [catastrophic forgetting](#/glossary/catastrophic-forgetting)

**The paper's own terms:**
- **skill (policy)**: a natural-language text padded to exactly 360 characters, given to the actor with every task; the only state carried between rounds (§3, §5.4).
- **actor, editor**: the same frozen model; the actor repairs buggy programs, the editor reads those programs and visible failures and proposes a new skill (§3).
- **task family**: one of nine code-repair conventions (boundary, rotation, ordering, normalization, nested, missing, prefix, chunk, tie-breaking) (§5.1).
- **discovery, probe, checkpoint and final tasks**: discovery tasks feed the editor, probe tasks the gate; fixed checkpoint and final banks are scored on hidden cases the agent never sees (§5.1, App. C).
- **hidden utility, mean trajectory utility**: the deployed skill's checkpoint-bank score, and its average over round 0 and all later rounds (§3).
- **harmful update**: an accepted update after which the hidden checkpoint score decreased (Tab. 1 caption).
- **cross-family interference**: a locally valid edit affecting unrelated families when deployed through one global skill (§1).
- **Global vs. Scoped**: Global replaces the one skill for all tasks; Scoped stores an accepted skill in the current family's slot and gives each task its family's slot, or the initial skill if there is none (§3.2).

**Missing glossary terms:**
- **backward transfer (BWT)**: the change in score on earlier tasks after later updates; negative means forgetting (named in §3; definition as in [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") §5.1).
- **paired sign-flip test**: a test that randomly flips the signs of paired per-stream differences to see how often so large a mean difference arises by chance; its p-values "require symmetry of seed-level differences" (Tab. 2 caption).

**Builds on:**
- Self-editing agents (§2 "Persistent agent change"): ADAS (Automated Design of Agentic Systems; Hu et al., 2025; [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)")), a search over agent designs; Gödel Agent (Yin et al., 2024), a self-referential agent; Darwin Gödel Machine (Zhang et al., 2025; [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)")), an archive of self-edited coding agents. The authors study the deployed lineage "rather than the best member of an archive".
- Wang et al. (2026a; [Do Agent Optimizers Compound?](#/papers/wang2026compound "Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0 (2026)")), "The closest continual evaluation", of agent optimizers over two phases (§2).
- Memory Reward Inflation (Asadolahi et al., 2026; [Memory Reward Inflation in…](#/papers/asadolahi2026memoryinflation "Memory Reward Inflation in Self-Improving LLM Agents (2026)")): corrective evidence must track truth and have sufficiently distinct errors, applied here at deployment (§2 "Evaluator error dependence").
- EvalPlus (Liu et al., 2023; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")), whose HumanEval+ (a code benchmark with added tests) is a transfer test (§2 "Code evaluation"; §5.4).

## Problem and setting

- **Question (§1):** when does persistent skill editing help a deployed agent across recurring task families? The central claim: memory needs two decisions, whether an update is supported and where it applies.
- **Benchmark (§5.1):** ProcStream-RSI v3.1 ("RSI" unexpanded in the paper), the authors' own: family order and oracle semantics (the "underlying convention" fixing correct outputs) are fixed across streams, while seeds vary tokens, names, program variants and cases. It "measures behavior on procedurally instantiated familiar contracts, not adaptation to randomized new semantics".
- **Model (§5.4):** the code model Qwen3-Coder-Next as actor and editor, temperature 0; a diagnostic runs the final skills with another model, GPT-OSS-120B, as actor.
- **Metrics and statistics (§3, §5.4):** mean trajectory utility, terminal (last-round) and final-bank scores, backward transfer, and worst-family retention (not defined further). The stream is the unit, with bootstrap 95% intervals, paired sign-flip tests and Holm correction over three primary contrasts.

## Approach

- **The loop (§3):** each round the actor solves discovery tasks, the editor proposes a new skill, and a gate deploys it or keeps the old one.
- **Proposition 1 (§3.1, proof App. B)** tells when a gate's deployments help on average. If each proposal is beneficial with some probability, with a positive mean gain if beneficial and a positive mean loss otherwise, and the gate accepts beneficial and harmful proposals with two separate probabilities, the expected deployed change is positive exactly when the probability-weighted gain from accepted good proposals exceeds the probability-weighted loss from accepted bad ones. For a gate that needs every evidence channel to pass, the harmful-acceptance rate is the product of the channels' false-acceptance rates when the channels are conditionally independent (roughly: their errors on harmful proposals are unrelated); when their false-acceptance events are identical, adding channels leaves it unchanged. "The proposition only covers outcomes represented in the gate evidence" (§3.1).
- **ORC, Orthogonal Regression Control (§4):** incumbent and candidate run on the same probe tasks through three channels: four public examples, four private exact-output tests hidden from actor and editor, and at least six answer-free metamorphic checks. For each channel and each family (current and earlier), ORC computes a one-sided 95% paired-bootstrap lower bound on the candidate's pass-rate gain. It deploys only if the current family's private-test bound is above zero, every other bound is at least −0.02, and no private or metamorphic evaluation reports an unsafe program (programs run in a checked sandbox, §8, App. G).
- **Scoped-ORC (§3.2):** ORC's proposal step and gate with Scoped deployment.
- **Controls (§5.2):** Static (never updates), Frozen-compute (ORC's calls, never deploys), Latest-only (deploys every well-formed proposal), Self-judge (the actor judges both programs), Replay (public-example gain, no public regression on earlier families), Batch-ORC (one cumulative update at the end).
- **Scope tests (§5.3–5.4, App. F):** on the eight main streams, a fixed-completion re-scoring that uses Global-ORC's archived completions on boundary tasks and Static's elsewhere; then 18 randomized-entry streams (first family varied by seed) with one update round; then a prespecified 27-stream extension in which paired Global- and Scoped-ORC evolve for all 12 rounds. Routing is studied with oracle family labels, a fallback-on-miss curve (tasks that miss their slot get the initial skill) and a text classifier trained on public prompts.

## Results

- **Global baselines (§6, Tab. 1).** Mean trajectory utility is 0.703 for Latest-only, 0.736 for Self-judge and 0.707 for Replay, against 0.775 for Static, each with negative backward transfer; 52.1%, 51.9% and 49.2% of their accepted updates were harmful. Frozen-compute equals Static at roughly five times Static's counterfactual endpoint cost (from token counts, §5.4).
- **ORC, global (§6, Tab. 1–2).** ORC accepts one proposal at round 0 in every stream and rejects all later ones; it scores 0.713, and its differences from Replay and Latest-only are "negligible". The accepted boundary rule helps the boundary family and hurts the missing, rotation, tie-breaking and chunk families.
- **Selection within scope (§6; App. A).** Over 479 proposal–round comparisons, AUROC for predicting "current hidden gain with no historical-family regression" is 0.752 for the public component, 0.998 for the private/metamorphic one. All eight ORC acceptances are safe on same-family gate probes, but six lower the next global checkpoint.
- **Fixed-completion scope test (§6, Tab. 4).** Scoped retrieval reaches 0.816 against 0.713 for Global-ORC and 0.775 for Static (sign-flip p = 0.03125 for both advantages); harmful updates go from six of eight to none.
- **Randomized entry (§6, Tab. 5).** Over 18 streams the shared gate accepts 5 candidates, 3 harmful under Global and none under Scoped; the primary Scoped-minus-Global checkpoint effect is 0.041 [−0.004, 0.107] (p = 0.1875).
- **Full extension (§6, Tab. 6, Fig. 1).** Over 27 streams, Scoped-ORC raises mean trajectory utility by 0.063 [0.037, 0.094] (Holm p < 10⁻⁴), accepts 63 updates against 12, with 0/63 harmful against 6/12. "On this templated benchmark", the learned router routes every held-out checkpoint prompt correctly.
- **Transfer (App. A, Tab. 3).** On 32 HumanEval+ tasks Global-ORC scores below Static. With GPT-OSS-120B as actor, scoped retrieval scores above Static (interval excluding zero) and above Global-ORC (interval including zero).

## Limits the authors state

- "The study covers inspectable scaffold edits with one frozen model and nine code-contract families" (§8).
- The proposition "cannot protect an unscoped global edit from interactions with task families that have not yet appeared" (§3.1).
- Repeated adaptation is shown, but "testing compounding additionally requires a cumulative one-shot comparator" (§6), i.e. a Batch-ORC-style control (§5.2).
- Router: "Prompt templates make this an in-distribution diagnostic"; the fallback curve "models conservative fallback, not misrouting to another learned slot" (App. F).
- Task-level results are descriptive (§5.4); the lineage examples are "mechanism illustrations" (App. D).
- "Full trajectories, bounded terminology, and cost accounting discourage overgeneralizing this scaffold-level result" (§8).

## Open problems and building blocks

- **Open:** "A cumulative one-shot control for compounding, open-world and wrong-slot routing, additional editor/search backbones, and automatically learned invariants remain future work" (§8).
- **Released:** "The supplement contains generator and evaluator code, public and sealed manifests", plus prompts, seeds, policies, traces and analysis scripts (§ "Reproducibility").
- **To reuse it:** a frozen code model at temperature 0 (§5.4); "a pinned, network-free Docker sandbox" for generated programs (§8); private tests and metamorphic checks per task (§4); a family label per task (§3.2). The authors report about $7 total spend (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
