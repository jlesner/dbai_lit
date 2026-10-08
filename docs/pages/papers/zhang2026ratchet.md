# Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill?

**Ratchet** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.22148) · [arXiv](https://arxiv.org/abs/2605.22148)  
Code: [Self-Evolving-Agents-Ratchet](https://github.com/amazon-science/Self-Evolving-Agents-Ratchet)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A skill library kept by one frozen LLM in five roles over an append-only log: a router picks at most one skill per task, a critic labels failures, a synthesizer writes skills from clustered failure patterns, and a curator retires a skill once its measured contribution (passes minus failures over its routed trials) falls to −τ after enough trials and caps the active library at a fixed width (§3); the authors prove a floor on how far below the no-skill control a governed library can fall, finite because of the width and τ (§4, Prop. 1).
- Modelling the grader as a channel with a false-pass and a pass-to-fail rate, they prove that a false-pass rate at or above (1−τ)/2 makes the rule retire nothing "at any sample size", while pass-to-fail errors cost resolution (abstract; §4.1, Prop. 2). Tested with unit-test grading on an MBPP+ slice (Claude Opus 4.7; §5), with error channels injected into the training reward on a long-form report-composition testbed and other slices (§6.2), and by an offline audit of one LLM judge against a deterministic citation grader and a held-out judge (§6.1).
- Pruning a memory needs a grader that rarely passes failures: past that boundary, genuine evictions fall to about zero while the end-task score moves little and not monotonically, so the authors call the score "the wrong alarm" (§6.2, Fig. 3); their audited strict judge has a pass-to-fail rate of about 0.95, safe in the fatal direction but barely able to tell good skills from bad (§6.1). The abstract's claim about LLM-written skills is SkillsBench's, not a result of this paper (§1).

## In plain words

An LLM agent writing its own library of reusable instructions (skills) must also decide which to discard, judging each only by its pass record. The authors say audits find the machinery to retire skills "is rarely built", so an unmaintained library can grow until using a skill does worse than none (abstract; §1). Ratchet retires a skill once its average of passes minus failures, over enough trials, falls to a margin below zero, and caps the active count. With unit-test grading on a hard 100-task slice of the MBPP+ programming benchmark and Claude Opus 4.7, held-out pass rate gains +0.328 (last ten rounds minus first ten) against +0.002 for the same loop never handing a skill to the model (§5). The main result is a proof about the grader: once it scores failures as passes at or above a rate set by the margin, the rule retires nothing at any sample size, while the opposite error costs "sample efficiency, which more trials buy back" (abstract; §4.1). They present this reliability condition as their contribution, one "no deployed system states" (abstract).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reference-free evaluation](#/glossary/reference-free-evaluation) · [pass@k](#/glossary/passk) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr)

**The paper's own terms:**
- **skill, shelf**: a written pattern whose body is prepended to the task (§3; App. G); the shelf is the set of active skills (§2).
- **library drift**: expected held-out pass@1 with the library falls below that of the same frozen model with no skill injected, in some round (§2, Eq. 1), which the authors attribute to near-duplicate and superseded skills crowding retrieval (§2).
- **measured contribution**: a skill's passes minus failures over the trials routed to it, divided by their count (§3, Eq. 2).
- **margin τ, evidence floor N_min, width C**: a skill is retired once it has at least N_min trials and contribution at or below −τ; at most C skills are active (§3; defaults 0.10, 100, 50).
- **false-pass and pass-to-fail rates**: the chance the grader scores a true failure as a pass, and a true pass as a failure, the two directions of a "two-parameter channel" (§4.1, Eq. 5); κ, one minus both rates, is its resolution.
- **π_τ = (1−τ)/2**: the false-pass rate at or above which nothing can be retired (§4.1).
- **governable region, starvation edge**: the rectangle of rate pairs with false-pass below π_τ and pass-to-fail below 1 − π_τ; the starvation edge is the second bound (§4.1, Fig. 1b; §6.1).
- **rolling gain**: mean held-out pass@1 of the last ten rounds minus the first ten, within a run (§5 "Protocol").

**Missing glossary terms:**
- **concentration inequality (Hoeffding's)**: bounds how far an average of independent bounded trials strays from its mean; here it gives the error radius ε from N_min and a per-skill failure probability δ (App. F).
- **union bound**: the chance of any of several events is at most the sum of theirs; it gives the C·δ term (App. F).

**Builds on:**
- Skill libraries that, the authors say, never retire an entry on its measured outcome: Voyager (Wang et al., 2023), ExpeL, Agent Workflow Memory, AutoManual (§2).
- Concurrent pruning systems ProcMEM (Mi et al., 2026), with a fixed-capacity pool, and MACLA (Forouzandeh et al., 2025), without one; the authors "reach ProcMEM's pairing from the bound of Section 4 instead" (§2).
- Noisy-verifier learning: Cai et al. (2025) use "the same abstraction we use" for policy gradients, and Plesner et al. (2026) ([An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)")) measure RL with verifiable rewards under noise (§1; §4.1).
- Their earlier reports (Zhang et al., 2026a, b), which this version "integrates and supersedes" (§1, footnote 2).

## Problem and setting

- **Question:** what keeps a maintained library above the no-skill control, and how reliable must the grader be for eviction to work (§1; §4).
- **The loop (§3; Alg. 1):** one frozen LLM, no weight updates, in five roles over an append-only log. A Router picks at most one skill per task or declines, a Solver attempts it, a Critic labels failures, a Synthesizer turns clustered failure patterns into skills, and a Curator holds the levers, reading only each skill's contribution and trial count.
- **Correct:** a graded pass: unit tests "with a near-zero false-pass rate" in §5; in §6.2 errors are injected into the training reward only, and evaluation uses the true grader.
- **Benchmarks:** MBPP+/100, 100 tasks of MBPP+, "the augmented-test-suite version of MBPP", that the frozen model fails on at least one probe seed; Opus 4.7, 100 rounds, three seeds (§5). Six more model families, single seed, and a 150-instance slice of SWE-bench Verified (real GitHub issues) with an agentic Solver (§5.2). The §6.2 sweep uses slices of "a reference-free long-form report-composition testbed" and MBPP+/100, with Claude Haiku 4.5 and a smaller budget (§6.2; App. G).
- **Assumptions:** a fixed task distribution, with contribution defined only on the tasks routed to a skill, "routed-conditional rather than a full-distribution contrast" (§3; §4, Eq. 3).

## Approach

- **Three levers (§3):** retire on measured contribution; when synthesis would exceed C, evict the lowest-contribution skill whatever its evidence; an authoring prior, one meta-skill document in the Synthesizer's prompt pushing toward reusable patterns.
- **Prop. 1 (§4):** the governed library's expected pass@1 is at most τ + ε + C·δ below the no-skill control (Eq. 4), provided (i) the Router returns a decline or a current shelf member for every task, and declining yields the no-skill pass probability; (ii) the measured contribution is unbiased and consistent for the routed contribution; (iii) N_min makes every active skill's estimate lie within ε of its true value simultaneously with probability at least 1 − C·δ, each skill adding at most δ. The authors say it is finite only because C and τ are, and "loose" at the defaults (§4; proof App. F).
- **Prop. 2 (§4.1):** a floor, under Prop. 1's Router condition, for a grader with known upper bounds on both rates and a known positive lower bound on κ, with N_min set so each active skill's scored pass rate is within ε of its mean with probability at least 1 − δ; the false-pass bound enters additively and κ as a divisor (Eq. 7).
- **The two edges (§4.1):** with scored pass rate concentrating on κ × true rate + false-pass rate (Eq. 6), a skill is retirable only if its true pass rate is below (π_τ − false-pass rate)/κ. That ceiling reaches 0 when the false-pass rate reaches π_τ, where "sample size does not enter", and 1 when the pass-to-fail rate reaches 1 − π_τ, where the rule acts on everything. Symmetric noise below one half keeps the order of skills, at the price of a higher effective threshold and more trials.
- **Offline audit (§6.1; App. C):** defects injected into clean report sections are caught by five deterministic checks or, for the two semantic classes, by a held-out judge from another model family; their union measures a candidate judge's two rates before any loop runs.

## Results

- **Lift (§5; Tab. 3):** rolling gain +0.328 against +0.002 with injection withheld (Opus 4.7, MBPP+/100, unit tests).
- **Ablations (§5.1, Tab. 2):** retrieval in place of the Router gives +0.077, removing the authoring prior +0.187, early eviction (N_min 20, τ 0) −0.019, below the no-skill control; four others land within about 0.04 of the Default, "so we claim no improvement from them".
- **Other models (§5.2; Tab. 4, single seed):** gains over each family's own control are +0.168 (Kimi K2.5), +0.105 (GLM-5), +0.087 (DeepSeek V3.2); Qwen3-Coder 480B, Mistral Large 3 and GPT-5.5 do not register a lift, which they attribute to a slice filtered by Opus 4.7's failures and, for GPT-5.5, to the statistic.
- **SWE-bench (§5.2):** injection raises the mean peak (preliminary).
- **Audit (§6.1; App. C):** on a strict, well-instructed training judge the audit measures false-pass ≈ 0.01 and pass-to-fail ≈ 0.95: "not the dangerous corner but the conservative one", with a resolution that "barely separates good skills from bad".
- **Sweep (§6.2; Fig. 3; Tab. 6):** false-pass bias drives genuine (contribution-driven) eviction to zero or nearly zero at every injected rate and starves synthesis too; symmetric noise only attenuates it; the audited judge retires far more skills per run than clean. Under bias, end-task pass rate is worst at the boundary (−0.065 against clean) and recovers past it (+0.039 at false-pass 0.70): "end-task score is the wrong alarm". On three further slices eviction also dies past the boundary; end-task cost shows on only the two failure-scarce slices of four. At false-pass 0.20, inside the rectangle, nothing is retired: the region is "necessary and not sufficient".
- **Floor (§6.2):** all means stayed within 0.125 of the no-skill control across the sweep.

## Limits the authors state

- "The corruption is exogenous": a library that learns to blind the judge is out of scope "and no fixed audit bounds it" (§7).
- "The audit certifies only enumerable classes" (§7; Broader impact).
- "The sensor is associational": "a causal reading needs randomised toggling" (§7).
- Three seeds don't support the ~0.04 differences; six families are single-seed (§7).
- "No governance bake-off" (§7).
- The floor constrains "the downside only" (§4).
- No task receives two skills; the Curator sees near-duplicates only through outcomes (§3).
- The judge's placement "rests on the looser" of its two estimates, though its interval lies wholly past the edge (App. C).
- From the audited judge's position, the lenient region "is easy to enter" (§6.1).

## Open problems and building blocks

- **Open:** judge stability under prompt variation "is itself an open measurement problem" (§6); they expect explicit deduplication "to matter on larger, more heterogeneous suites" (§5.1).
- **Released:** a code repository linked under the author list (title page).
- **To reuse it:** a frozen served LLM in five roles and "no accelerator of its own"; per round, one Router and one Solver call per task, one Critic call per failure, one Synthesizer call per uncovered cluster (§3). Defaults and role inputs: App. G. The authors advise measuring both grader rates offline first (§6.2).
- **Beyond its domain:** "Neither proposition mentions a skill"; a memory bank, retrieval corpus or score-pruned tool registry retired by a threshold "inherits the same floor" (§7).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
