# ReplayLens: Auditing Agents' Use of Outcomes

**ReplayLens** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.34177) · [arXiv](https://arxiv.org/abs/2609.34177)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A black-box audit of what an agent takes from a log of past actions and their scores: it rebuilds the memory from the log with one relationship changed (scores swapped between actions, intact action–score pairs moved to other record slots, actions renamed in both log and menu, or names moved over unchanged scores) and measures how many later decisions change and what that does to externally scored utility (abstract; §3).
- Checked first on synthetic memory writers whose update laws are known, including two learned writers with identical aligned and memory-off decisions that separate under pair moves (§4.2–4.3); then on the hosted model GPT-6 Astra choosing data-sampling strategies from designed histories over two public classification datasets (§4.4), on four bounded-memory pipelines restored in a different order (§4.5), and on GPT-6 Astra agents for sequential experiment planning and for 24 code-debugging tasks scored by hidden tests (§4.6–4.7).
- A shuffled-verdict control for memory carried across problems: it tests whether reuse follows the recorded checked outcomes, the labels or the record order (our reading). The authors report that swapping scores between actions changed a repeat-corrected 0.807 of GPT-6 Astra's decisions while moving intact pairs changed none (§4.4, Tab. 3). Bears on [Checking a memory across problems before it is reused](#/challenges/verified_memory).

## In plain words

An agent that reuses a log of past actions and their scores may base a later choice on the scores, on the actions' names, or on where each record sits; the authors say standard memory evaluations "do not reveal which relationship drives that change" (abstract), so an end-result check can approve a migration that changed later decisions (§1). Their audit, ReplayLens, treats the agent as a black box: it rebuilds the memory from the log with one relationship changed (scores swapped between actions, intact action–score pairs moved, or actions renamed in both the log and the list of choices) and measures how many later decisions change and how an outside score moves (§3). With the hosted model GPT-6 Astra on designed histories, swapping scores changed 0.807 of its decisions while moving intact pairs changed none (§4.4, Tab. 3); in a code-debugging agent, swapped scores alone lowered the average hidden-test score (§4.7). They present it as an audit "for deciding whether logged experience can be merged, reordered, or reindexed safely" (abstract).

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling) · [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) · [Bonferroni correction](#/glossary/bonferroni-correction) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [derangement](#/glossary/derangement) (App. A.1) · [off-policy evaluation](#/glossary/off-policy-evaluation) (which ReplayLens does not do, §2) · [underspecification](#/glossary/underspecification) (§2)

**The paper's own terms:**
- **memory writer**: "the procedure that converts these records into retained state" (a text summary, key-value store or learned representation, §1); a **policy** reads that state to choose a future action (§3.1).
- **key, outcome, slot**: in a log of (task, action, utility) records, the action's identifier, its observed utility (score), and the record's position (§3.1).
- **The four interventions** (§3, §3.1, Fig. 2), each compared with the **aligned** (unchanged) history: **outcome (value) reassignment** keeps keys in place and shuffles their scores; **pair transport** moves intact key–score pairs to new slots; **consistent renaming** relabels actions in both history and future menu, then decodes back (maps the chosen label to its original action); **key-slot reassignment** moves keys over unchanged scores, "changing both attachment and position". Slot moves stay within a **block** (one task family and context); a **stream** is one replicated history, the bootstrap's unit (§3.1, §4.1).
- **action disagreement**: "the fraction of future tasks that receive a different action after the intervention" (§3.2, Eq. 2); the **rekey response** averages it over relabeling the keys by the nine derangements of four actions (§3.2).
- **repeat-corrected response** (T_gr): disagreement between two conditions minus that between two fresh calls within each, for hosted models; zero in expectation when both share one action distribution, possibly negative in finite samples (§3.2, Eq. 3).
- **endpoint evaluation**: judging a memory only by its decisions and utility on the original history, memory-on versus memory-off included (§3.3).

**Builds on:**
- Underspecification (D'Amour et al., 2022): "Our endpoint-separation result instantiates this issue for memory writers" (§2).
- Experience-reuse methods, which decide "what experience reaches future decisions": Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Voyager (Wang et al., 2023; [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")), Chain-of-Experience (Tu et al., 2026) (§2).
- Memory diagnostics it contrasts with (Minerva, MemFail, MEMPROBE, PAST-Bench), which "test whether an agent recalls the correct fact and whether retrieval degrades under load" (§2).

## Problem and setting

- **Question:** which relationship ("the score, the label, or the position") drives the decision (§2), and which history transformations are safe (§1).
- **Boundary:** writer, policy and evaluator are black boxes; every replay uses the same initial state, writer, future query and external evaluator (§3); an intervention "changes only the records supplied to the writer" (§3.1). "A changed choice may be better or worse", so utility is measured separately (§3.2).
- **Main black-box task** (§4.1): the model picks one of four sampling strategies, each selecting 24 observations for a classifier; a hidden ridge-regularized logistic model (logistic regression penalizing large weights) fits on them, and utility is the exponential of minus its log loss (average negative log probability of true labels) on a disjoint pool. Data: Breast Cancer Wisconsin (Diagnostic) and Wine Quality (public tabular datasets from the UCI repository), each in an i.i.d. (independent and identically distributed) and a shifted context (pools split by one feature's value).
- **Models:** GPT-6 Astra, a hosted model run at "max reasoning effort", whose interface "does not expose a parameter count" (§4.1); three archived GPT-5.6 deployments (other hosted models) and a frozen Qwen3-8B (a public checkpoint) in §4.8 (App. J.2–J.3).
- **Histories:** 48 streams of 24-record histories built "so that fixed competing reference rules disagree": "a retrospective test on designed histories" (§4.1).
- **Inference:** the memory-selection test uses "individual 97.5% intervals", others 95% (§4.1).

## Approach

- **The audit** (§3, Fig. 1–2): rebuild memory from each intervention's history and compare future decisions and utility with the aligned baseline, without access to the agent's internal state (§1).
- **Endpoint-matched separation** (§3.3; proofs App. A.1, A.5–A.6): for a fixed history and a fixed, finite set of future queries, a lookup table can copy any stateful writer's decisions and so match every endpoint measure, memory-on versus memory-off included, while not responding to any replay, whereas the writer may respond; so replay "strictly refines conventional evaluation". The proof assumes the writer class contains such finite lookup writers (App. A.1).
- **Pair-transport zero law** (§3.3, Eq. 4): if a writer's state per block is an initial state plus a sum of a feature of each (key, score) pair that does not depend on slot position, and blocks combine additively, then moving intact pairs within a block leaves the state, and every future decision, unchanged (citing Zaheer et al., 2017); the appendix version also requires a deterministic readout of the final state and fixed future (App. A.8). "A nonzero pair-transport response therefore diagnoses a violation of order invariance" (§3.3).
- **Practical guidelines** (§5): "A nonzero action response flags a compatibility risk, and the paired utility contrast measures its downstream consequence."

## Results

- **Endpoint separation** (§4.2, Tab. 1): five independently fitted additive–recurrent writer pairs (one sums per-key scores, one updates a hidden state), trained to one target, match on aligned and memory-off actions; pair transport changed 0.538–0.796 of the recurrent writers' holdout decisions and none of the additive writers'. A same-architecture control trained on permuted records "fails the learning-quality gate" (a preset fit-quality threshold) (§4.2).
- **Calibration** (§4.3, Tab. 2): on four writer families with known laws, "All parameterizations are classified correctly"; value reassignment separates counting keys from using scores. A family-blind challenge (unseen writer laws, threshold fixed in advance) classifies 63 of 64 hidden writers correctly, with no false positive (Tab. 32; App. E.6).
- **Black box** (§4.4, Tab. 3–4): for GPT-6 Astra, value reassignment changed 0.807 of decisions against the full history and pair transport none, under readable and opaque labels alike; key-slot reassignment also changed decisions. With scores shown, renaming history and menu together changed none and renaming the history alone changed all; with scores removed, renaming did change readable-label decisions. Astra agrees with the historical-mean rule (pick the highest mean past score) on full and value-reassigned histories.
- **Memory migration** (§4.5, Tab. 5–6): of four bounded-memory pipelines, reordering events changed only FIFO's (first-in, first-out) summaries and retrieved text; on new histories FIFO "remains order-sensitive and loses utility under reordered ingestion", "while the selected binned-mean pipeline preserves retrieved text" (mean scores per action and descriptor bin). The audit and an endpoint-only selector (aligned utility alone) chose the same pipeline.
- **Sequential planning** (§4.6, Tab. 7): an Astra agent starts from eight measured trials, runs three new configurations and submits one. Value reassignment changes the first experiment and submission; final-test utility falls from 0.618 to 0.359 (Bonferroni-adjusted interval of the contrast −0.330 to −0.190, Tab. 90) "despite three fresh experiments"; pair transport and renaming give "much smaller responses".
- **Code debugging** (§4.7, Tab. 8): on 24 bug-fixing tasks, value reassignment is "the only condition with a negative held-out utility contrast": hidden-test utility 1.000 aligned against 0.875 (descriptive 95% interval of the difference −0.292 to 0.000, Tab. 93); pair transport and renaming leave the final submission unchanged "on these tasks".
- **Cross-model** (§4.8, Tab. 9): in all four protocols value reassignment exceeds pair transport; Qwen3-8B has the largest pair response, 0.154 against at most 0.017 for GPT-5.6.

## Limits the authors state

- The evaluation covers "four discrete sampling actions and a twelve-candidate code-debugging menu"; "continuous action spaces require application-specific map families" (sets of relabelings to apply); "Hosted calls may drift with provider updates" (§5).
- "The current evidence covers these measured interfaces; broader action spaces, longer-horizon trajectories, and continuous-integration workflows remain extensions" (§5).
- Reference-rule agreement "is a behavioral description on the tested support, not a claim about the model's internal mechanism" (§4.4); a zero distance on these fixed histories "does not establish population invariance" (App. T).
- Four items share each request, so the protocol "does not isolate the effect of changing one item while holding the other three histories fixed" (App. Q.2).
- "the finite query set limits diagnostic resolution" (§4.3); the blind challenge gives "finite calibration results for the declared interface, not a population-generalization rate" (App. E.6).
- The permutation-trained control runs "do not establish a target-consistent learned shortcut response" (every fit failed the preset fit-quality check) (App. Q.3).
- Memory selection: "the required joint criterion for additional audit selection value is not met" (audit selection did not beat both preset comparators), and the FIFO comparison "does not isolate an aggregation mechanism at equal observation coverage" (App. Q.1).
- Code debugging is "not evidence about open-ended repository repair or unrestricted code generation" (App. S).
- Cross-model rows are different evidence tiers, "so only within-row contrasts share an estimand" (the quantity estimated), and the Qwen3-8B difference "does not identify a model-size effect" (§4.8). For archival GPT-5.6 runs "matched fresh repeats are unavailable" (App. P), and their "time-labelled" cells moved complete pairs, not the intended key-only change (App. J.2).

## Open problems and building blocks

- **Open:** none beyond the extensions under Limits (§5).
- **Released:** for the planning agent, a supplement with "task definitions, frozen prompts, tool schemas, complete public tool trajectories, and analysis code" (App. R); a "compact public export" for code debugging, "sufficient to recompute the table without making additional model calls" (App. S); per-cell matrices "retained in the reproducibility archive" (App. T).
- **To reuse it:** a logged key, an observed outcome and a declared placement (§5); a fixed external evaluator (§3); two fresh calls per cell for hosted models (§3.2). The joint Astra matrix used 3,840 requests and 69,055,719 input tokens (App. T).
- **Beyond its domain:** the audit "can be applied to learned representations, retrieval-augmented pipelines, and prompted LLMs with in-context memory" (§3) and "covers systems whose decisions depend on structured logs with identifiable keys, measured outcomes, and ordered records" (§5).

## On this site

- **Discussed in:** [Which entries of a learned skill help](#/challenges/skill_entry_attribution)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/placebo">placebo</a></span>
