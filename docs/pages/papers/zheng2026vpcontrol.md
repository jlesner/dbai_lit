# Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures

**Engineering Reliable Commit Gates…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.10969) · [arXiv](https://arxiv.org/abs/2609.10969) · [DOI](https://doi.org/10.6084/m9.figshare.33511441.v1)  
Code: [vpcontrol](https://doi.org/10.6084/m9.figshare.33511441.v1)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A gate between an agent's proposed state-changing action and its execution chooses a verification plan (re-check on the same source, another verifier model, an independent read, a transactional guard, deferral to a person) from metadata a deployment can observe, calibrated to a risk target (abstract; §III).
- A deterministic benchmark of 48 templates in six fault regimes, with frozen proposals from two local actor models and two small verifiers (§V-A–V-B); a 2×2 experiment varies the second call's model and evidence source; a FinQA check and a live HTTP/SQLite arm with concurrent writes (§V-C–V-D).
- Votes of different models fail together when they read the same stale evidence: the authors report that an independent source cut false approval of unsafe proposals by 40.9 points, against a much smaller effect for changing the verifier model (abstract; §VI-A, Tab. IV), with the source effect reversed on FinQA (§VI-C). In the live arm only a guard that checks the whole predicate inside the write transaction committed no unsafe effect (§VI-D), which the authors prefer over model checks when it is available (§VII).

## In plain words

The authors ask which checks a gate before an AI agent's state-changing actions should buy, since "add another verifier" silently assumes independent evidence (§I). They built VP-CONTROL, a gate design and simulated benchmark, and a live database test. On frozen proposals from two local agent models, an independent source for the second check cut approval of unsafe proposals by 40.9 percentage points, against 11.3 for switching the checker model (abstract); a financial question-answering check with the small checkers did not reproduce this. Live, checker-only gates failed when data changed after checking; a guard checking the whole condition inside the write recorded no unsafe effect (abstract). They present "an empirical account of these choices" (§I).

## Background and terms

**Terms to know:** [multiple testing](#/glossary/multiple-testing) · [Wilson score interval](#/glossary/wilson-score-interval) · [post-training quantization](#/glossary/post-training-quantization)

**The paper's own terms:**
- **unsafe commit**: executing when the precondition is false in the true state just before execution, or the effect already holds for an operation that must not repeat (§III-A); rates are per task, "not per executed action" (§V-B).
- **safe automated coverage**: share of tasks done safely without deferral (handing the decision to a person) (§V-B, §III-A).
- **views A, A′, B**: the actor's read; a second interface on the same upstream; an independent replica (§III-A).
- **common-mode data failure**: views sharing an upstream lineage (e.g. a replica or cache) go stale together, making different verifier models "agree on the same wrong state" (§I).
- **exact guard**: checks the part of the precondition the target system can express at commit time (§III-A); **partial** or **full** (the whole predicate); a **preflight** guard runs before, not inside, the write (§V-D).

**Missing glossary terms:**
- **atomic transaction**: reads and writes run as one indivisible step (general definition; §V-D).
- **idempotent request**: repeating it does not repeat its effect (§V-D).

**Builds on:**
- Learn-Then-Test, Angelopoulos et al. [12]: risk calibration whose fixed-sequence organization the selector follows (§II, §III-C).

## Problem and setting

- **Question** (§I): which evidence to buy, which clauses to enforce atomically, when to defer.
- **Benchmark** (§V-A): 48 templates, 2,880 scenarios in six fault regimes (e.g. only A stale, A and A′ stale together, all sources degraded); the test templates are locked before evaluation (§IV).
- **Models** (§V-B, Tab. II): actors Qwen3.5-9B and Gemma4-8B, verifiers Qwen3-4B and Phi-4-mini, quantized, local; proposals frozen and replayed for every controller.
- **Live arm** (§V-D; 216 episodes, §VI-D): a local HTTP service over SQLite (an embedded database), a concurrent writer, twelve business contracts (operation plus declared predicate), six injected conditions, eight policies.

## Approach

- **Portfolio controller** (§III-B): per bucket of observable metadata, picks one of 37 small decision trees over re-checks on A′, reads of B, a transactional guard and deferral, trading cost and coverage against priced risk (Eq. 1).
- **Calibration** (§III-C): policies tested in fixed order against a Wilson upper bound adjusted for within-template correlation. Targets are "empirical calibration settings, not finite-sample, distribution-free guarantees". Matched-budget variants "carry no risk guarantee".

## Results

- **RQ1** (§VI-A, Tab. IV): false approval of unsafe locked-test proposals by two-call votes, pooled over regimes: 74.2% same model and source, 62.9% cross-model, 33.3% independent source, 22.9% both. A rule-based arm with independent model errors agrees, placing the effect "in the evidence plumbing rather than in one pair of LLMs".
- **RQ2** (§VI-B, Tab. V): at a nominal 5% target, 1.9% unsafe with 38.2% coverage; 1% and 2% defer essentially everywhere. At the cross-model vote's budget, unsafe falls from 27.8% to 12.7%, coverage rises from 40.6% to 51.7%.
- **RQ3** (§VI-C, Tab. VII–VIII): unseen fault families "demonstrate a failure to maintain the nominal target"; after one bounded replan with independent evidence, most unsafe proposals stay unsafe; on 240 FinQA questions (financial-report arithmetic, tables corrupted; §V-C), Qwen3-4B approves 17% of unsafe answers from the corrupted shared rendering against 20% from the correct independent one.
- **RQ4** (§VI-D, Tab. IX): with a write forced between last check and action, each verifier-only policy commits the same twelve unsafe effects, the partial guard 16 as preflight and 9 inside the write transaction (not significant after Holm correction); the full atomic guard none in 216 episodes. The guarded portfolio: 4.2% unsafe, 68.5% safe completion, against 2.8% and 41.2% for the guarded independent vote; it "buys availability rather than lower risk here". Idempotent retries after lost responses caused no duplicate effect.

## Limits the authors state

- Only the ordering of mechanisms under the stated fault model is claimed; unit costs are modeled; human deferral is modeled as safe (§VII "Construct validity"; Tab. I).
- Eight calibration templates or twelve live contracts cannot support fine risk targets or precise differences; only preregistered comparisons are multiplicity-corrected (§VII "Internal and statistical validity").
- Quantized 4–10B models on one laptop; actors almost never abstain; the FinQA failure "limits the claim to domains where verifiers can interpret the evidence" (§VII "External validity").
- The forced race shows "an exposed window, not its frequency in an uncontrolled workload" (§VI-D).
- Lineage is supplied; no drift detector (Tab. I); one writer; lineage discovery and protection against forged provenance outside the implementation (§VII "Bind checks to execution"); long-horizon coordination outside the evaluated claim (§I).

## Open problems and building blocks

- **Open:** evaluations of larger models, distributed services, correlated human decisions, adversarial faults, longitudinal source drift (§VII "External validity").
- **Released:** an artifact (prompts, raw outputs, preregistrations, live service, table-regenerating scripts) (§VII "Reproducibility").
- **To reuse it:** when the system can evaluate the whole predicate inside the write transaction, the authors favor that guard; the portfolio is for guards that are partial or unavailable (§VII "Use full atomic…"). Platforms should attach lineage, observation time and health, among other fields, to every tool result (§VII "Expose failure lineage…").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
