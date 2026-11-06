# Finding Side-Effect Loopholes in Verifiable Rewards

**Finding Side-Effect Loopholes in…** · NeurIPS 2026 workshop "Who Verifies the Agents?"

Read: [PDF](https://arxiv.org/pdf/2610.09142) · [arXiv](https://arxiv.org/abs/2610.09142)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits whether the shipped verifiers of two agent benchmarks, whose verdicts become RL rewards, notice a run that does the task and also makes an unrequested change: AppWorld's unit tests over the app database and WorkArena's form and catalog verifiers on a hosted ServiceNow instance (abstract; §1; §4.1). No model is called; AppWorld replays the shipped solutions and WorkArena runs the shipped drivers' `cheat` (§3; §7; App. H).
- Mutation testing of verifiers: hand-written edits to a correct run leave work missing or wrong or add one unrequested change (a repeated write, an extra form field), and a pass counts as a false positive only when an end-state check, separate from the verifier, shows the wrong change; a wrong-task test grades one task's correct run with another task's verifier (§1; §3; Tab. 1; App. A, Tab. 5). It also derives what three RL methods' reward formulas pay a duplicate (§5).
- Benchmark checkers that accept wrong work (<a class="tag" href="#/tags/labels">labels</a>), in apps backed by a database: the author reports that in 2 of the 5 AppWorld task templates where a repeated write changes data the tests do not count what a run added, so a duplicated write passes and, by the author's derivation, earns full reward under three RL methods (§4.2; §5), and that WorkArena's form verifier, called once after submit, passed an extra field in every valid pair, while per-step validation rejected some extra fields and paid others (§4.4–4.5; v1's 23-run WorkArena rerun was withdrawn in v2 for a runner defect, App. F); every false positive came from an unrequested change (abstract), and the results are "existence proofs" (§1). One count assertion per template catches the duplicates (§4.3).

## In plain words

When a model is trained by reinforcement learning on an agent benchmark, the program that grades each run (the verifier) supplies the reward (abstract). Most audits look for runs that pass without doing the task; the author asks about runs that do the task but also change something nobody asked for: "Do RL reward verifiers notice such a run?" (abstract). Without calling any model, the paper edits correct runs of AppWorld (simulated everyday apps driven through API calls) and WorkArena (forms on the ServiceNow business platform), and counts a pass as a false positive only when its own read of the final state shows the result wrong (§1). The author reports that "Every false positive came from an unrequested change, none from missing or wrong work" (abstract). AppWorld's tests passed a duplicated last write that changes the data, in every task of two templates, and WorkArena's form verifier, called once after submission, passed forms carrying an extra field in all 36 valid pairs (abstract). The author calls these "existence proofs" with no rate (§1).

## Background and terms

**Terms to know:** [mutation testing](#/glossary/mutation-testing) · [test oracle](#/glossary/test-oracle) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [reward hacking](#/glossary/reward-hacking) · [idempotent operation](#/glossary/idempotent-operation) · [frame condition](#/glossary/frame-condition) (§1; §2) · [negative side effects](#/glossary/negative-side-effects) (named beside reward hacking by Amodei et al. (2016), §1)

**The paper's own terms:**
- **verifier**: the program that decides whether a run succeeded; its verdicts make the score and, in RLVR, the reward (§1).
- **correct run / edited run**: the benchmark's own solution, replayed, and that run with one hand-written edit (§1; §3.1).
- **two kinds of edit** (Tab. 1; App. A, Tab. 5): **missing or wrong work** (claim success without writing, drop the last write, change a written value, leave a form unsubmitted or a task field out) and **unrequested change** (in AppWorld, repeat the last write; in WorkArena, also fill an **extra field**, one the task never mentions).
- **wrong-task test**: one task's correct run graded by another task's verifier; a pass there is not counted as a false positive (§3.1; App. C).
- **end-state check**: the audit's own read of what a run changed, taken before the verifier is called and separate from its code (§1; §3.2).
- **false positive / harmless edit**: a pass on an edited run whose end state is wrong, and one whose end state is still correct (a repeated call that changes nothing), likened to an equivalent mutant (§2; §3.3).
- **loophole**: a kind of wrong run that the verifiers pass in more than one task, so a policy could learn it (§1).
- **task template**: AppWorld builds several tasks ("versions") from one template (§4.1).
- **monitor**: a script on WorkArena's form pages meant to flag changes to fields outside the task (§4.4; App. E).
- **per-step validation**: calling the verifier after every step, as BrowserGym (the environment that runs WorkArena agents) does (§4.1; §4.5).

**Builds on:**
- Mutation testing (Jia and Harman, 2011) and the oracle problem (Barr et al., 2015), with the verifier as the test suite and the end-state check as the oracle (§1; §2).
- Frame conditions (McCarthy and Hayes, 1969; Borgida et al., 1995) and negative side effects (Amodei et al., 2016) (§1).
- Sun (2026), "The closest precedent", which mutates snapshots of valid final states (§1; §6).
- AppWorld (Trivedi et al., 2024), WorkArena (Drouin et al., 2024), and the RL methods CANOPY, Entropy-Preserving RL and ProCredit, which compute rewards from AppWorld's tests (§1; §5).

## Problem and setting

- **Question:** "Do the verifiers whose verdicts become rewards notice a run that does the work and also makes an unrequested change?" (§1).
- **Correct** means each requested record exists with the requested values and nothing else changes, ignoring ids and timestamps (§2). The adversary acts only through the benchmark's normal actions and cannot modify the verifier, its evidence or the environment (§2).
- **Suites (§4.1):** 48 AppWorld tasks, 16 data-changing templates at three versions, 8 from the official train split and 8 from dev, none from a test split; 13 WorkArena tasks (4 forms, 9 service-catalog orders) at three configurations, with the verifier called once at the end except under per-step validation.
- **No model calls:** "No run in this paper calls a model" (§7).
- **Disclosure:** the author founded MLDSAI Inc. (OpenAdapt.AI), which makes GUI automation tools "including tools that check whether an automated action had its intended effect" (Acknowledgments and Disclosure of Funding).

## Approach

- **Edits** are designed after reading the verifier and driver source, and are "not a sample of agent errors or of verifier defects" (§3.1).
- **Replay and end-state check (§3.2):** each run starts from a reset state. AppWorld's check counts writes per table against the correct run's, comparing no values; WorkArena's paired experiment, each edited run beside its own correct run, reads the saved record through ServiceNow's Table API (a REST interface to its records).
- **Outcomes (§3.3):** a fixed rule labels each run rejected, harmless edit or false positive, fixed before each experiment's graded runs except one AppWorld write-count comparison. A repair is a hand-patched verifier copy that must fail the edited run and pass the correct one.
- **Preconditions (§3.4; App. L):** six, from resettable start states to a way to pin what the verifier expects.
- **Rewards (§5):** each RL method's reward for the duplicate is derived from its published formula.
- **A correction:** v2 withdraws the reviewed version's WorkArena rerun, whose driver had overwritten the verifier's expected serial number in its hardware-asset runs, for the paired experiment (App. F).

## Results

- **AppWorld (§4.2; Fig. 1; App. G, Tab. 10).** The tests passed 39 of 48 repeated-write runs; 33 were harmless, leaving 6 false positives in all three versions of two templates, a work-dinner payment task (an extra request and notification) and a song-queue task (a song queued twice). Of the 5 templates where a repeat changes data, the tests of 3 reject it; the other two match requests by receiver or compare the queue as a set (§4.2).
- **Repair (§4.3).** One count assertion per template failed all 6 edited runs and passed all 6 correct runs, and rejected none of the 13 archived agent runs the original tests accept.
- **WorkArena, one call after submit (§4.4; App. G, Tab. 11).** In all 36 complete valid pairs of 84 scheduled, the verifier passed both runs, though the end-state check confirmed the extra field was saved; they cover 12 fields in two forms. The monitor's flag was unset whenever the verifier read it.
- **WorkArena, per-step (§4.5; Tab. 3; App. E, Tab. 8).** An extra field filled first, or a drop-down filled last, ended the run with reward 0 before submit; a text or reference field (a link to another record) filled last got reward 1, in 7 of 11 runs. A verifier copy that keeps the flag across the page load rejected every edited run and passed every correct one.
- **Missing or wrong work, wrong tasks (§4.6; Tab. 2).** The verifiers rejected 252 of 261 such runs; the 9 passes omitted a field whose default is the requested value. They passed none of 2,689 wrong-task runs (App. C, Tab. 6).
- **Rewards (§5; Tab. 4).** All three RL methods train on the payment template, and by the author's derivation each duplicate earns the correct run's reward. None of AppWorld's 1,277 released passing baseline runs repeats either call, so the loophole is "latent in these released runs" (§5).
- **Rank orders (App. J).** Break-even false-positive rates (the rate at which an order would flip) for pairs of AppWorld's released configurations; each "does not show that any order changed".

## Limits the authors state

- The audit "cannot show that a verifier is sound, cannot find a loophole that no edit reaches", and tests false rejections only through correct runs and patched copies (§7).
- "The counts give no population rate"; verdicts within a template almost never differ, so a binomial interval (a confidence interval for a pass rate) over runs would overcount (§7).
- Hand-written edits only, and AppWorld's check compared no values, "so the counts are a lower bound" (§7).
- WorkArena: two of four form templates; the 12 fields are those of an earlier rerun "whose verdicts we had seen"; results "hold for one verifier call after submit"; the per-step run used one seed, another instance and the field only first or last (§7).
- "We trained no policy, so whether RL optimization would find these loopholes is open" (§1); 8 of AppWorld's 30 train templates were audited (§5).
- Comparing the created record's other fields with their defaults is proposed but not run (§4.5).
- "Each new benchmark needs its own harness, and we have not run it on a third benchmark" (§3.4), a harness being the code that replays and checks runs; the host OS and Python patch version, not retained for the grids, leave "a gap for replication" (App. H).

## Open problems and building blocks

  - Whether RL optimization finds the duplicate, by training on the original and the repaired AppWorld tests.
  - How far LLM-proposed loopholes can replace hand-written edits, with confirmation and repair as the bottleneck; "That study is in progress and reports nothing in this paper" (App. M).
- **Released:** a supplementary archive on OpenReview with protocols, manifests, pins, verdict vectors and a standard-library reproducer of the counts; AppWorld's terms keep the copied tests to SHA-256 digests (App. I).
- **To reuse it:** a harness per benchmark meeting the six preconditions (§3.4); the pinned packages (App. H); a hosted ServiceNow instance, one episode at a time (App. H); no model calls (§3). The wrong-task grids took about 80 minutes (AppWorld) and 11 hours (WorkArena) (App. C).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/study">study</a></span>
