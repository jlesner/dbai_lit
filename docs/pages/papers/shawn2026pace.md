# PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents

**PACE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.08106) · [arXiv](https://arxiv.org/abs/2606.08106)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Treats the keep-it-if-the-dev-score-went-up step of self-evolving agents as uncontrolled adaptive multiple testing on a reused dev set, and replaces it with a commit gate: candidate and incumbent are scored on the same items, and a testing-by-betting e-process on the discordant pairs commits once its wealth reaches 1/α (abstract; §3; §4).
- The bound on false commits holds per candidate under optional stopping, not over a run (§4, "Guarantee"); Qwen2.5 agents (0.5B–3B) evolve their system prompt on GSM8K, SVAMP and ARC-Challenge, in a controlled regime with one planted real gain and a stochastic one with none, every commit audited on a fresh 120-item pool the gate never sees (§5).
- Selection on a small reused dev set, measured on checked answers: it reports greedy acceptance committing 30–42% false edits when one real gain hides among noisy proposals (abstract; §5.1, Tab. 1). [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") runs PACE as published and reports that the degradation PACE finds with no real gain available did not replicate in its pre-registered runs (its §2).

## In plain words

A self-evolving agent improves itself in a loop: a proposer suggests a change (here, a system-prompt edit), and the usual rule keeps it if the score on a small, reused question set went up. The author argues that this rule, applied hundreds of times to the same noisy score, keeps changes that only looked better by chance (abstract; §1). PACE scores both versions on the same questions and keeps the change only when a running bet on the questions where exactly one is right gathers enough evidence. This bounds each candidate's chance of being kept when not better at a level the user sets, even when testing stops early (§4).

On open Qwen2.5 models (1.5 and 3 billion parameters) doing grade-school math, with one known good edit among noisy ones, a separate check set judges 30–42% of the usual rule's kept changes no better, while PACE keeps the good edit and "essentially nothing else" (abstract; Tab. 1). The author claims, "To our knowledge", the "first explicit treatment" of this step as such a test, the test itself being "standard" (§1).

## Background and terms

**Terms to know:** [McNemar's exact test](#/glossary/mcnemars-exact-test) · [sign test](#/glossary/sign-test) · [multiple testing](#/glossary/multiple-testing) · [statistical power](#/glossary/statistical-power) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [exact match](#/glossary/exact-match)

In the glossary's terms (our reading): PACE keeps McNemar's discordant pairs and the sign test's null hypothesis, but tests them with a bet that may stop at any point. Its "greedy" acceptance is not greedy decoding.

**The paper's own terms:**
- **acceptor (accept rule)**: "the rule that decides whether to commit a change" (abstract); the incumbent is the current configuration, the candidate the proposed one (§3 "Setup"; §4).
- **greedy acceptance**: commit exactly when the candidate's dev-set accuracy beats the incumbent's (§3, Eq. 1).
- **dev set, audit pool**: the small held-out set reused every round to decide (40 questions by default), and a disjoint, fresh pool of 120 used only to measure, which the accept rule never sees (§5 "Agents and task").
- **false and harmful commit**: an accepted change when no real improvement is available, harmful "if true accuracy strictly decreases" (§3); measured as a commit whose audit-pool accuracy change is ≤ 0 or < 0 (§5 "Metrics").
- **discordant pair**: a question on which exactly one of the two configurations is right; ties are discarded (§4).
- **wealth, bet fraction λ, level α**: wealth starts at 1 and, after each discordant pair, is multiplied by 1 + λ if the candidate was the one right and by 1 − λ otherwise (Eq. 2); commit once wealth reaches 1/α. Defaults: α = 0.05, λ = 0.5, "and a fixed batch size unless noted" (§4 "Testing by betting").
- **Δ**: the accuracy change on the audit pool, end to end (§5 "Metrics"), on a 0–1 scale.
- **controlled and stochastic regimes** (§5 "Two regimes"): the agent starts with "one deliberately harmful instruction" whose removal is a large known gain; or it is sampled at temperature 0.7 with no large gain available, audited at temperature 0.

**Missing glossary terms:**
- **e-process (testing by betting)**: a wealth starting at 1 is multiplied by bets that are fair if the null hypothesis holds, so it stays near 1 on average under the null and grows when the null is false (§4 "Testing by betting").
- **anytime-valid test, optional stopping**: a test whose error bound holds wherever the tester stops, even when stopping depends on the data (§2; §4 "Guarantee").
- **supermartingale, Ville's inequality**: a running value whose expected next value, given the past, is at most its current one (general definition); a nonnegative one starting at 1 ever reaches 1/α with probability at most α (§4 "Guarantee").
- **adaptive data analysis**: "reusing one validation set to steer a long, data-dependent sequence of choices" (§3).
- **familywise bound**: a bound on any false commit in a whole run, not per candidate (§4 "Guarantee"; general definition).
- **online FDR**: procedures that "bound error over streams of tests" (§2); FDR is the expected share of false discoveries among discoveries (general definition).

**Builds on:**
- Anytime-valid inference: Wald (1947), Shafer (2021), Ramdas et al. (2023) (§1; §2); not listed here.
- McNemar (1947), the discordant-pair comparison (§4); not listed here.
- Adaptive data analysis: Dwork et al. (2015) and Blum & Hardt (2015) (§3); not listed here.
- Self-evolving agents that "select modifications by an empirical score": ADAS, which programs agents in code ([ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)")), the Darwin Gödel Machine, which evolves self-modifying coding agents ([Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)")), and others (§2).

## Problem and setting

- **The question:** can an accept rule commit only on "reliable evidence" of improvement, keeping genuine gains with little evaluation and no training (§3 "What we want")?
- **Null hypothesis:** "the candidate is not better": given earlier outcomes, each discordant pair favours the candidate with probability at most ½ (§4 "Guarantee"). Outcomes are right/wrong per question; §1 also names "pairwise preferences".
- **Agents:** frozen Qwen2.5-Instruct models (0.5B, 1.5B, 3B parameters) steered by an editable system prompt solve GSM8K (grade-school math word problems), scored by exact match (§5 "Agents and task"). The proposer, "a separate LLM" the paper does not name, suggests one edit per round: add, rewrite, delete or merge an instruction (§3; quote: §5).
- **Seeds:** 5 in the controlled regime (Tab. 1), 3 in the stochastic, sensitivity and cross-task runs (Tab. 2, 4, 5). Rounds per run, batch size and evaluation budget are not given as numbers (Fig. 2 plots 35 steps).
- **0.5B** "cannot do GSM8K even with the handicap removed", so runs only in the stochastic regime (§5.1).
- **Baselines:** greedy, a fixed-n paired test, and an online-FDR variant (Tab. 1–2; §5.3).
- **More tasks:** SVAMP, "a second arithmetic benchmark", and ARC-Challenge, "multiple-choice science" (§5.4).

## Approach

- **Diagnosis (§3).** On a small dev set reused every round, a candidate that is not better still wins "with non-trivial probability": "adaptive multiple testing on a reused dataset". Bonferroni or α-spending corrections must know the number of tests in advance; a larger dev set "only postpones the problem".
- **Paired betting test (§4, Eq. 2; Alg. 1).** Both configurations answer the same questions; on each discordant pair wealth is updated; the candidate is committed once it reaches 1/α, and rejected "if the evaluation budget is exhausted without crossing the threshold".
- **The guarantee (§4 "Guarantee").** It bounds, for one candidate, the chance of ever committing it when it is not better: if each next discordant outcome, given the earlier ones, favours the candidate with probability at most ½, the probability of ever committing is at most α, for any α in (0, 1), any λ in [0, 1), and any data-dependent stopping. Scope: "validity is per candidate", "not a run-level familywise bound"; "we treat the loop-level adaptivity as an empirical matter, not a theoretical claim"; power is not controlled.
- **No correction across rounds (§4 "Why so simple…").** A decaying-memory FDR variant "sometimes missed the genuine improvement entirely"; the e-process, unlike a fixed-n test, "adapts the number of pairs to the evidence". PACE "adds no model calls beyond the evaluations greedy already performs, and typically fewer".

## Results

False and harmful rates are "audit-labelled", not ground truth (§5 "Metrics").
- **Controlled, GSM8K (§5.1, Tab. 1).** Greedy commits 3–3.4 changes per run, 30–42% false and 10–33% harmful; the fixed-n test and PACE commit "exactly the one real improvement and nothing else".
- **Held-out gain (§5.1, Tab. 1).** At 1.5B all three rules tie on Δ; at 3B PACE reaches +0.74 ± 0.04 against greedy's +0.54 ± 0.30, read as "reliability" rather than "a guaranteed mean margin (the +0.20 gap is within seed noise at n=5)".
- **Cost (§5.1).** PACE "uses ∼18% fewer dev evaluations than greedy", "though greedy runs no test at all".
- **Milder handicap, 1.5B, text only (§5.1).** PACE gains +0.14 at 0% false; greedy +0.18 "at the cost of 17% false and 17% harmful commits".
- **Stochastic, GSM8K (§5.2, Tab. 2).** Greedy commits 13.3–20.7 changes per run, 72–100% false; "every statistical gate" commits fewer than one. PACE's 33% false at 0.5B and 1.5B is over that fewer-than-one, "a near-empty denominator" (Tab. 2 caption).
- **Degradation (§5.2; Fig. 2 at 1.5B).** Greedy lowers the 0.5B agent's held-out accuracy by 4.9 ± 3.0 points; at 1.5B the drop is "real but seed-noisy"; 3B "escapes net damage".
- **Sensitivity (§5.3, Tab. 4; 1.5B, controlled).** Over α from 0.01 to 0.10 and dev size from 20 to 80, PACE commits the real improvement at every setting with 0% false; greedy keeps committing false changes throughout; online FDR lost the improvement "entirely" at α = 0.01.
- **Other tasks (§5.4, Tab. 5).** On SVAMP and ARC-Challenge the author reports "the same pattern throughout"; Tab. 5 has controlled rows for SVAMP only.
- **No handicap (§6).** On un-handicapped GSM8K greedy and the gate "alike commit essentially nothing".

## Limits the authors state

- "We demonstrate it only on prompt evolution, however, and so treat system-level generality as argued, not shown" (§1).
- PACE runs in the author's "own prompt-evolution loop rather than a third-party system"; "Evidence uses one model family and one proposer" (§6 "What PACE does…").
- Greedy's degradation "is strongest on small, fragile agents; the universally robust effect is false-commit suppression, not always a large accuracy rescue" (§6).
- The guarantee is per decision and does not control power (§4 "Guarantee").
- Audit labels are "observed (audit-labelled) false commits, not ground truth", while α bounds "the prospective false-commit probability" (§5 "Metrics").
- The gate is "the wrong tool when genuine gains are expected to be tiny and a missed improvement is costlier than a wrongly committed one" (§6 "When (not) to use it").
- It "cannot certify improvements the dev set cannot see" (§6).
- Neither regime "is a full agent-system deployment, which we leave to future work" (§5 "Two regimes").

## Open problems and building blocks

- **Open:** the author says the surveyed self-evolving systems "flag objective hacking and stability of self-modification as open problems" (§2).
- **Released:** Nothing stated.
- **To reuse it:** PACE "applies to any self-modification loop whose incumbent and candidate can be scored on shared instances (binary correctness, or pairwise preferences)", is "training-free" and "a single paired sequential test, ∼10 lines" (§1); its inputs are the configuration, a dev set, α and λ (Alg. 1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
