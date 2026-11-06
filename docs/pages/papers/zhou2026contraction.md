# Many Steps into One: Reasoning Contraction and the Limits of Safe Memory Reuse for LLM Agents

**Many Steps into One** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.17544) · [arXiv](https://arxiv.org/abs/2610.17544)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Treats thought templates, skill libraries, agent memories and caches as one-step memories of multi-step derivations (each a "contracted memory") and trusting and retiring them as sequential tests; proves that clipped counters are change detectors testing a change nobody chose and that unclipped ones may never retire a partially stale memory ("vote counters (ExpeL, ACE) are change detectors tuned to the wrong change", §8), and gives a limit, in the worst case and as δ → 0, on how much reasoning any safe memory can skip when facts change and each memory is judged only by its own verified outcomes (abstract; §1; §3–4, Thm. 1, Thm. 3).
- Per-memory lifecycle: a betting certificate on the paired utility against live reasoning on the same query admits a memory, a likelihood-ratio CUSUM tuned to that memory's own failure rates retires it, and the test restarts at each edit notice (§5, Tab. 1); run on KQA-Stream (multi-hop questions over a knowledge base with controlled fact edits), a Wikidata timeline of real edits and EvalPlus code tasks, with five open models of up to 8B (§6).
- Admission and retirement of memory entries by an exact verifier, for memories that are executed derivations (a relation path over a knowledge base, a stored program) rather than text: the authors report that ExpeL- and ACE-style counters serve 7.0–13.5× more stale answers than their certificate given the same information on KQA-Stream (abstract; Tab. 2). Bears on [Checking a memory across problems before it is reused](#/challenges/verified_memory), including retiring entries once the facts behind them change.

## In plain words

Thought templates, skill libraries, agent memories and caches turn several reasoning steps into one stored step, called reasoning contraction (§1). Such a memory saves steps and errors "until its facts change, then quietly answers wrong" (abstract). Most systems trust memories by counting successes and failures; the authors prove these are badly tuned change detectors: one that counts both equally notices a change leaving the memory wrong under half the time far later than an optimal detector, and one banking unlimited credit may never notice it (abstract; §3). On five open LLMs answering questions over controlled fact edits, ExpeL- and ACE-style counters (from two memory systems) serve 7.0–13.5× more outdated answers than certified memories (trusted only after a statistical test) given the same information, and, counted in steps, 35–73× more on code tasks checked by tests (abstract; §6). When facts change and each memory is judged only by its own verified outcomes, they prove a worst-case limit, at near-zero risk, on how much reasoning any safe memory can skip, and give a recipe (§1; §4–5). They call the slowest of three delay cases and the diagram joining them "new" (§3).

## Background and terms

**Terms to know:** [sequential probability ratio test (SPRT)](#/glossary/sequential-probability-ratio-test-sprt) · [E-process (testing by betting)](#/glossary/e-process-testing-by-betting) · [KL divergence](#/glossary/kl-divergence) · [Zipf distribution](#/glossary/zipf-distribution) · [knowledge graph](#/glossary/knowledge-graph) · [CUSUM](#/glossary/cusum-cumulative-sum-change-detection) (Page's detector, §3)

**The paper's own terms:**
- **macro**: a one-step operator formed from a verified derivation (such as a composed relation, a lemma, an answer note) of a **template** (such as a relation path, lemma chain or tool-call sequence) (§2).
- **live, folded, shadow**: answered by full reasoning, by the trusted macro, or live with the macro evaluated alongside; an **audit** is a verifier label (exact match, execution, unit test) on some shadow or folded queries (§2).
- **break-even**: the macro accuracy above which folding pays, given live accuracy and cost and a price per error (Eq. 1, §2).
- **stale**: an edit raised the macro's failure rate (§2); **partially** if it stays under one-half (§3). A **stale answer** is a wrong one-step answer that was right when the macro formed (§6).
- **score rule (clipped counter)**: a running score, adding a bounded amount per verified outcome, floored at zero, retiring the macro at a threshold (Eq. 2, §3); **A** is its mean number of healthy uses before a false retirement. **LR-CUSUM** weighs each outcome by its log-likelihood ratio (how much likelier it is if stale than if healthy) under the memory's own failure rates (§3).
- **δ-safe**: in every epoch (between two changes of a template's facts), the chance of trusting a candidate bad in that epoch is at most δ (the risk tolerated) (Def. 1, §4).
- **coverage gap**: the long-run share of queries not answered in one step by a valid, certified macro; **certification load**: rate of change times ln(1/δ), over audit rate times the KL divergence between good and bad memories' outcomes (§4, Thm. 3).
- **notice**: an announcement of the templates whose gold answers an edit changes (§6).

**Builds on:**
- ExpeL (Zhao et al., 2024; [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")) and ACE (Zhang et al., 2026b; [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), memory systems whose votes, idealized as one per verified use, are the baselines (§2).
- Page's CUSUM and the Bernoulli (yes/no-outcome) CUSUM of Reynolds and Stoumbos (1999); the authors call the counter identity and their learning rates "instances of older work" (§3; App. F).
- The SPRT and testing by betting, as in B-PAC (Yu et al., 2026b), which certifies one global threshold (deciding when an LLM should think) (§4–5, §7).
- PACE (Shawn, 2026; [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)")), a discordant-pair test (scoring only items where two versions disagree); theirs, the authors say, can unlike it certify macros below live accuracy but above break-even (§5; Thm. 19).

## Problem and setting

When may a memory be trusted, when retired, and what share of queries can any safe system answer in one step (§2, §4)?

- **Assumptions:** verifier outcomes are Bernoulli (yes/no) given the past, with mean the current reliability (§2); Thm. 3 adds Poisson (random, constant-rate) demand and changes, one outcome per audit, unaudited agreement unseen (whether unaudited shadow answers match live ones), and good memories only barely good (App. B (A1)–(A5)).
- **Correct** means equal to the current gold answer (App. D "LLM paths") or passing EvalPlus's check for the current task version (App. D.6); the theory doesn't model routing errors (the one LLM call that picks the template) (App. D "Replay setting").
- **KQA-Stream:** from the KQA Pro knowledge base, 300 templates of 2–4 relation hops, three sequences of 24 fact edits, replayed on 200k-query Zipf streams with 10% audits; models Qwen3-8B, Qwen3-4B, Granite-3.3-8B, Mistral-7B, OLMo-3-7B (§6).
- Also a 1992–2016 Wikidata timeline of real edits (App. D.4.4), and 521 EvalPlus tasks (MBPP+ and HumanEval+, Python problems with extra hidden tests) with announced requirement revisions and unannounced API changes (App. D.6).

## Approach

- **Counters are detectors.** Each score rule is exactly Page's CUSUM for one implied change only (Rem. 1).
- **Phase diagram (Thm. 1).** For a clipped counter with a bounded score per verified outcome, outcomes independent and identically distributed before and after one change, as A grows, delay grows with the logarithm of A if the score drifts up after the change, with that logarithm's square if it doesn't drift, and as a power of A if it drifts down while a positive score stays possible, a power below 1 whenever, for yes/no outcomes, the stale failure rate exceeds the healthy one. Equal votes drift up only if the stale failure rate exceeds one-half.
- **Learning rates (Cor. 2).** A clipped Hebbian rule (a confidence nudged up on success, down on failure) is the likelihood-ratio CUSUM, optimal at the false-alarm horizons its thresholds attain, if and only if its ratio of learning rates matches a formula in the healthy and stale failure rates, when both can be estimated. Unclipped counters may never retire a partially stale memory (Rem. 2).
- **The limit (Thm. 3).** Under the assumptions above, every δ-safe policy leaves at least a fixed function of the certification load unanswered in one step, up to a factor tending to 1 as δ → 0; the SPRT restarted at each change is δ-safe and attains it within a factor also tending to 1. Under Zipf demand with exponent above 1 this gives a scaling law for small δ and load (Cor. 4): "popular problems can be contracted; rare ones change before they can be trusted" (§1).
- **Certificate (Thm. 6).** An SPRT using estimated live accuracy can break δ (Prop. 5), so the certificate bets on paired utility (steps saved plus error-weighted correctness gain over live reasoning), weighted by audit chances, and trusts the macro when wealth reaches 1/δ. A macro never more useful than live reasoning is trusted with probability at most δ, whatever the live accuracy and error correlation; with independent, identically distributed utilities, asymptotically no δ-safe rule seeing only audited utilities certifies faster. Both need a known bound on utility and audits with known probabilities, bounded below, independent of the hidden outcome.
- **Lifecycle (Tab. 1).** The restart-only certificate splits δ over a template's successive tests, each restarted at a notice; LR-CUSUM retires trusted macros. This is δ-safe per epoch when notices cover every change of the test's null (the macro being no more useful), including changes in live reasoning (§5). The recommended deployment also drops and re-forms notified macros (invalidation) (§5).

## Results

- **Stale answers (Tab. 2).** On every model counters serve 7.0–13.5× more than the certificate with every notice missed; with notices it serves none.
- **Detection (Fig. 2).** On the same 156 stale memories, counters leave about half in service at stream end against 2% for LR-CUSUM, and take about 60× more uses to retire them (a mean capped at a fixed number of uses). Their loss score (calls plus weighted errors) stays close as they answer more in one step, "so benchmarks must count stale answers" (§6).
- **Per-memory weights** detect faster than the best tested fixed weighting, significantly on Qwen3-8B, Qwen3-4B and OLMo-3-7B (App. D.2.1).
- **Safety (Fig. 3).** Scoring answers alone, the deployment makes no false certification (trusting a memory no more useful than live reasoning) at δ ≤ 0.1; with routing errors counted, the restart-only certificate's bad folds (trusting a below-break-even memory) stay below δ (App. D.4.1).
- **Accuracy (Tab. 3).** Qwen3-8B, perfect notices: 0.379 (live) → 0.648 with 21% fewer LLM calls; on OLMo-3-7B more calls than live (App. D).
- **Missed notices.** With 80%, 50% or no edits announced, the detector cuts stale answers 9–12× against invalidation alone, pooled over models (§6; App. D.4.2).
- **Natural edits.** Safety holds; counters keep more stale memories yet beat the restart-only certificate's accuracy, "because folding pays when staleness is mild" (§6).
- **Code (App. D.6).** Counted in steps, counters serve 35–73× more stale answers than the certificate given their information; it gains accuracy with fewer steps but more LLM calls, and ties with live reasoning make audits "nearly uninformative" in call accounting (§6).
- **Limit check (Fig. 1c).** Over 2,520 settings the restarted SPRT's gap is within 0.945–1.025 of the limit (§4).
- **Negative.** Noisy verifiers slow certification beyond the prediction for one noisy label, and a noise-aware variant doesn't help (App. D.2.3).

## Limits the authors state

- "Our results concern memories whose answers an exact verifier checks"; three domains, five open models of up to 8B, each instance decoded once per version (§ "Limitations").
- The theorems assume one verified outcome per audit and random change times; per-epoch safety needs notices for every change of the null, including live reasoning's, while theirs cover answer changes; some change information is needed on templates audited often enough (§ "Limitations"; Prop. 24).
- "we regard the accuracy gain as specific to this benchmark and the staleness result as the transferable one" (App. D); KQA-Stream's edits are synthetic, and transfer across correlated templates lies outside the limit (App. D "Replay setting").
- Matching false-retirement rates uses true reliabilities: "not a deployable tuning procedure" (App. D.2).
- API edits break few programs: "we claim no staleness magnitudes for real library drift" (App. D.6).
- "The guarantees hold only under the stated assumptions" (§ "Ethical considerations").

## Open problems and building blocks

- **Open:** a limit modelling how candidates form; noisy and LLM-judge verifiers, for text memories; longer natural edit histories; larger models; theory problems such as the optimal certifier for one template (§ "Limitations"). Also extending the cold-start law to safe folding (App. B), a verified semantic cache (App. D.2.4), shared and self-modifying memories (App. F).
- **Released:** prompts, seeds and scripts in "our code release" (§6); edit logs of all three domains; code under MIT (§ "Ethical considerations").
- **To reuse it:** an exact verifier, audits with known probabilities (Thm. 6), notices for per-epoch safety (§5); defaults, fixed on synthetic tables before any real-LLM run; one 16 GB GPU for all LLM runs (App. D).
- **Beyond its domain:** "Agent memories and skill libraries with a verifier should therefore adopt these changes, and memory benchmarks should edit facts" (§1).

## On this site

- **Discussed in:** [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a></span>
