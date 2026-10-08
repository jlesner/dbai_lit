# Commit-first LLM judging inherits the judge's own errors

**Commit-first LLM judging inherits…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.00088) · [arXiv](https://arxiv.org/abs/2609.00088)  
Code: [evaluator-integrity](https://github.com/idilgozel/evaluator-integrity)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits the default LLM-judge configurations of eight evaluation frameworks for commit-first judging (in the author's definition, the judge commits its own answer before it sees the candidate and accepts only a match (abstract); in [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)"), commit-first keeps the candidate in view and blind-solve withholds it (App. A)): the author reports that none of the 24 in-scope configurations implements it and nine use what it calls the "recompute" form, which that work reports ineffective (abstract; §2).
- A plain best-of-N loop (Claude Sonnet 5 generating, 12 rounds of 8) optimizes four small Python tasks against DeepEval's G-Eval with Claude Opus 4.8 as documented, plus visible unit tests; held-out suites, validated against broken implementations and traced to the task specs, measure correctness (§3.1–3.2). Commit-first judging, a strict mode, a smaller judge (Claude Haiku 4.5) and a probe of each judge solving the tasks itself follow (§3.4–3.6).
- A shipped judge config gamed by search with no tricks, and the limit of the fix: the author reports that under the shipped config 90 of 96 interval-merging candidates scored at least 0.8 while failing the held-out suite (§3.3, first seed), and that commit-first judging removed this but made a task the judge itself cannot solve worse, in one seed pinning the population at the judge's own score (§3.4). Four small tasks, gaming in two of them, two seeds, one judge family (§5).

## In plain words

When teams select systems by an LLM judge's score, "If the judge can be satisfied by wrong outputs, selection will find those outputs." (§1). Earlier work found a working defence: the judge solves the task and commits to its answer before seeing a candidate, which it accepts only if the two match: commit-first judging (abstract). The author reports that none of the 24 in-scope default judge setups in eight widely used evaluation frameworks implements it (§2). In an experiment, a keep-the-best search, blind to correct answers, codes four small Python tasks against one shipped setup, as documented. On interval merging, 90 and 93 of 96 candidates in two seeds scored as good while failing hidden tests; commit-first judging cut this to 0 of 96 (§3.3–3.4). On duration parsing, where the judge's own answer was wrong, it made matters worse in both seeds (§3.4). Main finding: the evaluation becomes "only as good as the judge is at the task" (abstract), and having the judge solve the tasks itself predicted, on these tasks, where the defence helped and backfired (§1; §3.6).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [reward hacking](#/glossary/reward-hacking) · [test oracle](#/glossary/test-oracle) · [mutation testing](#/glossary/mutation-testing) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

**The paper's own terms:**
- **commit-first judging**: the judge gets the question alone and produces its own answer in a parseable form, fixed before the candidate is shown; the candidate is accepted only if it matches (§1). The candidate may stay in view: "Commitment, not blindness, is the operative variable." (§1). The run records call it `deanchored`; "The two names mean the same thing." (§6).
- **recompute form**: telling the judge to work the problem out step by step with the candidate already in context (§2), the defence Zhou measured as not working (§1).
- **shipped configuration**: a framework's default judge template, used as documented (§2; §3.1).
- **best-of-N selection**, as used here: a generator writes eight candidates, the evaluator scores each, "The best two are kept and seed the next batch.", for twelve rounds (§3.1). Unlike the glossary's best-of-N, rounds build on earlier winners (our note).
- **evaluator score**: half the pass rate on the visible unit tests, half the judge's score (§3.1).
- **visible and held-out suites**: the visible tests feed the evaluator score; the held-out suite measures real correctness and is "never returned to the selector" (§3.1).
- **diverged**: the evaluator scores a candidate at or above 0.8 while it fails the held-out suite; this count is the paper's measure of gaming (§3.1).
- **reachable check**: a held-out check that "some known incorrect implementation fails it while passing every visible test" (§3.2).
- **negative-control probes**: sixteen deliberately broken implementations run against the held-out suite (§3.2); in the glossary's terms, hand-written mutants (ours).
- **lock-in**: the population's final correctness coming to rest at the held-out score of the judge's own committed answer (§3.2; §3.4).

**Builds on:**
- Zhou (2026), "More Convincing, Not More Correct" ([More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)")): showed a judge's pass rate rising under self-play while true accuracy stayed flat; the recompute form leaves the false positive rate on wrong answers at 0.719, commit-first drops it to 0.012 (§1). The commit-first form used here is Zhou's (§6).
- Chalamalasetti and Vajjala (2026), on how far judges over-credit without a reference answer (§1; §2).

## Problem and setting

- **Questions** (§1): does shipped software implement commit-first judging, what happens when a standard optimisation loop meets a shipped configuration, and what does commit-first judging cost?
- **Census** (§2): default judge templates and documented examples of the evaluation frameworks DeepEval, Ragas, Promptfoo, OpenAI Evals, Braintrust autoevals, LangChain, Arize Phoenix and MLflow: nine packages from eight vendors, 27 configurations, three on subjective tasks and out of scope for this criterion. A configuration passes if the judge commits its own parseable answer before any comparison and acceptance is decided by matching against it "rather than by a holistic score"; both are required.
- **Experiment** (§3.1): the judge is DeepEval's G-Eval metric, version 4.1.5 (an LLM-judge metric, here with explicit evaluation steps, a rubric and the default threshold), with Claude Opus 4.8; "Where the documentation offered a choice we took the stronger option". The generator is Claude Sonnet 5 at temperature 1.0; 96 candidates per run; no jailbreaks or prompt injection. The main conditions ran on two seeds (§5).
- **Correct** means passing the held-out suite; the author traced every held-out check to a sentence of the task specification and flagged those that could not be traced (§3.2).

## Approach

- **Validating the held-out suite in both directions** (§3.2): whether it catches bad code (the probes), and whether it demands anything the specification never asked for. A replay script runs every stored candidate against each held-out check on its own.
- **Commit-first arm** (§3.4): every run is repeated with the judge solving each task once before scoring and candidates compared against that solution, which, where logged, is also scored on the held-out suite.
- **Controls** (§3.5): strict mode, a G-Eval option that "binarises the judge score", and a smaller judge, Claude Haiku 4.5, under both configurations.
- **Judge competence probe** (§3.6): each judge solves each task directly, three samples per task, scored on the held-out checks, under its arm's sampling conditions (§3.5).
- **Citation ledger** (§4): every quantitative claim in the author's criteria must resolve to a verbatim quote from its pinned source, checked in continuous integration.

## Results

- **Census** (§2): of the 24 in-scope configurations, none implements the defence; each is "a single call in which the candidate, the question, and any reference appear together and the judge returns a holistic score". Nine use the recompute form and share a common ancestor prompt, traced through a copied typographical error. Thirteen supply a reference answer: for the author, a different question. A re-check against current releases on the day of submission changed no verdict.
- **Shipped configuration** (§3.3, Fig. 1): on interval merging, 90 of 96 candidates diverged in one seed and 93 of 96 in the other; every candidate passed every visible test. The winning candidate merges intervals "that do not touch" ((1, 2) and (3, 4) into (1, 4)); the judge gave it a perfect score citing that line. The visible touching test (merging (1, 2) and (2, 3)) can't tell the two apart. Duration parsing diverged too, but recovered to fully correct by the final round in both seeds. The other two tasks show nothing: the generator is correct from the first round.
- **Commit-first** (§3.4, Fig. 2): on interval merging, 0 of 96 diverged in both seeds, and the committed solution, where logged, passes every held-out check. On duration parsing, diverged candidates rose from 37 and 41 (shipped) to 50 and 75; the judge's committed answer is wrong, its parser accepting inputs it should reject. One seed ended above the judge's own score; in the other, final correctness came to rest at exactly the held-out score of the judge's answer while the evaluator read near perfect. "Gaming replicated tightly" across seeds; "The repair did not".
- **Controls** (§3.5, Fig. 3): strict mode did not prevent the effect. The smaller judge was "barely gamed at all" on interval merging under the shipped configuration, and showed no divergence under commit-first.
- **Probe** (§3.6, Fig. 4): the frontier judge solves interval merging 1 time in 3, its answers carrying "variants of the same touching-intervals misconception"; the smaller judge 3 of 3; neither solves duration parsing once. The author concludes "Judge reliability is a property of the judge and task pair, not of the model tier." and that the precondition is measurable in advance "for pennies", with checks the judge has never seen.
- **Instrument checks** (§3.2): the suite misses a probe that sorts the caller's list in place. Two checks the specification does not justify (`test_no_mutation_of_input`, `test_does_not_accept_none_or_bytes`) reached the paid runs; neither changes any divergence count, and the lock-in result holds either way. Every held-out check but `test_no_mutation_of_input` is reachable.
- **Own claims** (§4): the ledger failed five of fifteen first-draft claims (one contradicted by its source, four stated too broadly); all were corrected.

## Limits the authors state

- "Four small tasks, one judge family, one generator." "This is a controlled demonstration, not a survey." (§5).
- Lock-in appeared in one seed of two: "we claim that commit-first judging can lock the judge's error in place, not that it must" (§5).
- The commit-first null tasks, the strict control and both smaller-judge arms are single runs; the first commit-first seeds have no recorded judge answers; solve rates come from a separate probe (§5).
- Verdicts cover default templates and "do not transfer to a modified configuration automatically" (§5); they can go stale (§2).
- If SpecBench's trend (a coding-agent benchmark's worst-case visible-to-held-out gap growing with code size, on a weak fit) holds at this scale, "the effects we measure are understatements rather than exaggerations"; the single-function tasks sit well below the sizes it was fitted on (§5).
- The frontier commit-first judge ran at default sampling, not the specified temperature zero; "The asymmetry affects only comparisons across judge models." (§3.5).
- The admission rule fixed in advance excluded all four tasks; reported anyway and called "a design error that writing it down in advance made visible"; one expectation was committed late (§3.1).
- The failure mode under commit-first "is still invisible from inside the system" (§3.4).
- The author is founding a company on assessing automated evaluators (§ "Competing interests").

## Open problems and building blocks

- **Open:** None stated. The paper calls the failure being more reproducible than the fix "itself a reason to measure whether the fix will work rather than assume it" (§3.4).
- **Released** (§6): the criteria, scored corpus, citation ledger and verification tooling; as ancillary files, the run records (one per candidate), the results digest, the figure data and the spend ledger; the replication set (task prompts, both suites, reference solutions, the probes, the replay script). Unpublished: search code, prompts; the two judge setups "are reconstructible from their sources" (§6).
- **To reuse it:** commit-first judging needs a parseable answer (§1) and a task where committing to an answer in advance has a clear meaning (§2). The probe needs held-out checks the judge never sees: twelve calls per judge, about 3 pence (smaller judge) and 15 pence (frontier) (§3.6). The experiment cost about 27 pounds (§3.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
