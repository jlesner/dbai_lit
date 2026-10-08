# Finding Blind Spots in AppWorld and WorkArena Task Verifiers

**Finding Blind Spots in…** · NeurIPS 2026 workshop "Who Verifies the Agents?"

Read: [PDF](https://arxiv.org/pdf/2610.09142) · [arXiv](https://arxiv.org/abs/2610.09142)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits the shipped execution-based checkers of two agent benchmarks for false accepts: AppWorld's state-based unit tests over the application database and WorkArena's live validators on a hosted ServiceNow instance (abstract; §3.2). No model is called; AppWorld replays reference solutions and WorkArena runs the shipped drivers' `cheat` (§2; App. H; Reproducibility statement).
- Two arms: each task's reference trajectory graded by other tasks' checkers (intent swap, a rejection census), and mutation-inspired edits that make the effect wrong in a named way, such as a duplicated write or an extra form field (§2; §3.3; §3.5; App. A, Tab. 4). A pass counts as a false accept only when retained environment evidence confirms the wrong effect (§2).
- Benchmark checkers that accept wrong work (<a class="tag" href="#/tags/labels">labels</a>), in apps backed by a database: the author reports that in 2 of the 5 AppWorld scenario generators with non-idempotent writes the tests check field values but not how many rows a write added, so a duplicated write passes (§3.5; Tab. 2), and that WorkArena's out-of-scope-field flag is lost to a checker run after submit, when submit loads a new page; per-step checking was not tested (§3.5, Fig. 1, Tab. 2; App. E); the confirmed cases establish "a mechanism; it does not estimate a rate" (abstract). The assertion AppWorld's own guide documents catches the duplicates (§3.6).

## In plain words

Agent benchmarks such as AppWorld (everyday apps an agent drives through their APIs) and WorkArena (web tasks on the ServiceNow business platform) decide whether an agent succeeded with a checker over the application's final state. The author argues that "Leaderboards, model comparisons, and verifier-reward training inherit their errors" (abstract), and that published audits often study failed runs (§1). Without model calls, the paper edits correct reference solutions to be wrong in named ways and asks whether the unmodified shipped checkers still pass them. AppWorld's tests accepted a duplicated write that creates an extra record in 2 of 5 eligible task generators, 6 of 15 constructed cases (abstract). WorkArena's checker, run once after a form is submitted, passed all 23 rerun extra-field cells, 21 of which a direct read of the saved record confirmed as wrong; the 23 were chosen because they had already passed, and "This confirms a mechanism; it does not estimate a rate" (abstract). It presents an audit, having found "no published constructed-fault audit of false accepts for the shipped AppWorld or WorkArena task verifiers" (§1).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [mutation testing](#/glossary/mutation-testing) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)

**The paper's own terms:**
- **checker / verifier**: a fixed program attached to a task; it receives evidence about a finished run (final state and, for some families, the API calls made) and returns Pass, Fail or, in some configurations, refuses to score (§2).
- **false accept**: a Pass on work whose effect is wrong. A **confirmed** one needs "retained environment evidence" that the delivered effect differs from the correct one; "The verdict alone is insufficient" (§2). A false reject is the opposite error.
- **cell**: one graded run (§3). **Generator**: an AppWorld scenario generator; the 48 state-changing DEV (development split) tasks are "16 scenario generators at three daily variants each" (§5).
- **intent-swap arm**: task j's correct run is graded by task i's checker; cells are grouped by "severity rung", from Rung-0 (a twin task one parameter away) to Rung-3 (another scenario, disjoint effects), with Diag as the own-task control (§2).
- **fault arm** and **fault grammar**: mechanical edits of the correct run, each designed "to make the effect wrong in a named way" (§2), defined in Tab. 4 (App. A): for AppWorld Claim-Only, Omit, Partial, Wrong-Value, Extra (duplicate the last write) and Extra-NI (Extra on non-idempotent endpoints only); for WorkArena Omit-Field, Omit-Divergent, No-Submit, Extra-Field (write a field the task never mentions) and Claim-Only (§2).
- **degenerate edit**: an edit that leaves the effect correct, such as duplicating an idempotent write; excluded, and likened to equivalent mutants (§2, §6).
- **census**: a fixed enumeration of cells, not a random sample; its counts are "descriptive" (§1).
- **commit freeze**: protocol, code and census committed before scoring; "a prospective commit freeze, not a public preregistration" (§3.1).

**Missing glossary terms:**
- **idempotent**: having the same effect when repeated; a duplicated non-idempotent call (a POST that creates a payment request) leaves an extra record (Tab. 4, App. A).
- **Clopper–Pearson interval**: an exact confidence interval for a binomial proportion; §4 uses one as an "illustrative" bound.
- **exchangeability**: the assumption that evaluated and deployment items are interchangeable draws; a population claim would depend on it (§5 "Drift and re-evaluation").

**Builds on:**
- Mutation analysis and the test-oracle problem (Jia and Harman, 2011; Barr et al., 2015): the author adapts "that idea to task effects rather than checker source code" (§1); "Our unit of mutation is different" (§6).
- Dong et al. (2026), who audit failed verdicts and "leave the complementary PASS audit open" (§1).
- RLVεR (Rad et al., 2026; [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)")) and Zhang (2026; [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)")), cited for a policy trained on checker rewards producing "plausible-but-wrong work" (§2); §6 adds work on imperfect verifiers, including Plesner et al. (2026; [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)")).
- The audited benchmarks: AppWorld (Trivedi et al., 2024), "state-based unit tests over the application database", and WorkArena (Drouin et al., 2024), "live validators executed against a hosted ServiceNow pool instance" (§3.2).

## Problem and setting

- **Question:** does the checker's "acceptance boundary" separate plausible-but-wrong work from correct work (§2)? The adversary controls the run but "cannot modify the checker, its evidence channel, or the environment after task start" (§2).
- **Suites:** all 48 state-changing AppWorld DEV tasks (the sealed HOLDOUT split stays sealed) and all 13 pool-permitted state-changing L1 WorkArena templates (4 form, 9 catalog) at three configurations each (§3.2).
- **Delivery:** AppWorld replays recorded API programs on a fresh database per cell; WorkArena runs the shipped driver's `cheat` path through BrowserGym (the browser-agent environment WorkArena runs in) and Playwright (a browser-automation library), one cell at a time on a shared instance (§2; App. H).
- **Evidence of a wrong effect:** runner no-write records, replayed write counters (AppWorld), or a read of the exact record through ServiceNow's Table API (WorkArena) (Tab. 2).
- **Disclosure:** the author's company "offers commercial services based on the verification approach this paper describes" (Competing interests and funding).

## Approach

- **Two arms (§2).** A swap-arm Pass is "an off-diagonal checker acceptance, not automatically a confirmed false accept", because the data do not prove each target was unsatisfied; a fault-arm Pass stays a candidate until effect evidence confirms the wrong effect completed (§2).
- **Source-informed (§2).** The author reads checker and driver code to design tests but does not "modify the checker under test"; targeting refinements (e.g. an idempotence census for Extra-NI) were committed before the cells they enabled (App. A).
- **Exclusions (§2).** Degenerate edits are dropped; Extra-NI repeats Extra's transformations and counts once; the first WorkArena Extra-Field run, lacking post-submit readback, stays out of Tab. 2, where a prospective rerun of its 23 Pass cells with readback before the checker stands instead (App. F).
- **Rank consequences (§4):** which pairwise orders of archived official AppWorld results stay identified if the duplicate-write share of generators is an error budget (overlapping score intervals leave an order unidentified). **A later rate claim (§5)** needs its population, sampling, fault mixture and effect oracle fixed before outcomes are seen, an independent holdout, and readback of each claimed wrong effect.

## Results

- **AppWorld record-count blindness (§3.5; Fig. 1A; Tab. 2).** A duplicated non-idempotent write "leaves every field value the evaluator checks intact"; the verifier accepted all three daily variants of two affected generators, "2/5 eligible generators and 6/15 constructed effects" (§3.5). The test shown checks field values, never how many records were added.
- **WorkArena out-of-scope writes (§3.5; Fig. 1B; Tab. 2).** The extra-field flag lives in the page and submit loads a new page, so "A checker that looks only after submit cannot see it" (§3.5). In the rerun, the Table API showed a nondefault out-of-scope value in 21 of the 23 selected cells, the checker passed all 23, and the other two were display-label aliases of their defaults (§3.5; App. F).
- **Other families (§3.5; Tab. 5, App. G).** AppWorld Omit, Partial, Wrong-Value and Claim-Only, and WorkArena Claim-Only, No-Submit and Omit-Divergent, "returned Fail in every registered scored cell" (§3.5); "The remaining checker-PASS cells were effect-correct degeneracies" (abstract).
- **Intent-swap census (§3.3; Tab. 1).** Every diagonal control passed; no Pass came on 2,689 valid off-diagonal cells; 57 WorkArena cells used a session-scoped evidence path (§3.4), and the other 2,632 "remain unclassified by rejection cause and by independent target ground truth" — "a rejection baseline for future comparisons" (§3.3).
- **Repair (§3.6).** Adding `len(added_*)==N`, the assertion AppWorld's own generator guide documents, to copies of the six affected tests ("specified after the Extra-NI census") sent all six cells from Pass to Fail; the six controls stayed Pass, and Tab. 2 still reports the unmodified tests.
- **Rank orders (§4; Tab. 3).** Over 8,190 official AppWorld verdicts (14 configurations per test split), at the observed budget 0 of 91 pairwise orders stay identified on test_challenge and 6 of 91 on test_normal; "Overlap does not show a rank error" (Tab. 3). Official scores are "insulated" because both generators are DEV-only, but "Any training or selection loop that rewards DEV Task Goal Completion is not" (§4).

## Limits the authors state

- **No population sample:** the suites are "selected benchmark censuses"; no deployment rate or confidence limit is reported (§8).
- **Two suites:** other checker families, "such as OSWorld-Verified-class desktop environments, remain untested" (§8).
- **Synthetic-fixture scope:** "No live model-generated adversary, checker-aware search, or natural-failure corpus contributes to the results" (§8).
- **Unit of analysis:** cells within a generator "are close to perfectly correlated" (§8).
- **WorkArena selection:** the outcome-selected rerun "cannot estimate a false-accept rate" for registered, eligible, submitted or naturally occurring extra-field attempts (§8).
- **Untested:** per-step validation, with the extra write and the submit in different steps, and a patched WorkArena checker (§3.5; §3.6).
- **Environment:** one shared instance "constrained scheduling to sequential execution" (§8); the unretained host OS and Python patch version are "a replication gap" (App. H).
- **Rank analysis:** "DEV-to-test transfer is assumed", and a confidence reading "needs an unestablished exchangeability model" (§4).
- **No certificate:** the paper "does not supply a distribution-free certificate" (§5).

## Open problems and building blocks

  - An independent WorkArena holdout, sampled before checker outcomes are known, with the same pre-checker readback.
  - Estimate a verifier population's false-accept rate under a fixed grammar and "measure how that rate maps into a policy's silent-wrong-action rate".
  - Extend the audit to OSWorld-Verified-class checkers and archived agent runs, measuring rank tables before and after a checker change.
  - "replace recorded faults with model-generated candidates and measure selection under optimization pressure".
  - A tunable checker score "could also support" learn-then-test or conformal risk control (statistical methods that bound an error rate).
- **Released:** "An anonymous supplement accompanies the submission" with protocols, primary evidence, per-family counts, the copied Extra-NI tests and "a standard-library reproducer" (App. I).
- **To reuse it:** the pinned packages (App. H), a hosted ServiceNow instance, no model calls (§3.1); 531 s for the AppWorld grid, about 71 s per live WorkArena cell (§8).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a></span>
