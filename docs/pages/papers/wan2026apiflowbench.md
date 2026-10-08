# APIFlow-Bench: Measuring Whether Agents Survive Long, Dependent API Workflows

**APIFlow-Bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.29128) · [arXiv](https://arxiv.org/abs/2608.29128)  
Code: [APIFlow-Bench](https://github.com/postmanlabs/APIFlow-Bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of long, dependent REST-API workflows in procedurally generated mock worlds, graded deterministically on both the backend state (a mock-minted canary traced through the call path) and a typed answer card (abstract; §3; §5).
- Validates its generated graders with a self-test triad that uses no LLM, an oracle solvability gate and golden replay; an adversarial audit then found grader exploits that this automated validation had missed (§1; §4; §5, App. G). A panel of frontier and open-weight models runs under Inspect AI's stock `react` loop (§6).
- Tests the pⁿ arithmetic of long jobs directly: it reports pass rates on 20-subtask chains 33 percentage points above the product of the subtask rates (abstract; §8.5). The authors attribute the gap partly to chain grading, which checks the final subtask plus dependency-critical earlier checks, and partly to correlated competence (§8.5). Most failures on the clean slice reached the correct state and failed only at final delivery (§8.3).

## In plain words

Tool-using agents are commonly scored by one bit: did the workflow finish? The authors argue this fails to distinguish failures that matter in production, such as expired credentials, malformed request fields, unverified writes, or correct work followed by a wrong final answer (abstract; §1). They build APIFlow-Bench: generated tasks where an agent repairs and completes jobs against simulated web APIs, chained into workflows of up to 20 dependent steps and graded deterministically on both backend state and the returned answer (abstract; §1; §3). They "treat benchmark validation as a first-class contribution" (§1): each step's grader is tested before any model sees it, and a later adversarial audit found six grader exploits, which they fixed (§1). Across 19 models, they report pass rates falling from 93% on single steps to 74% on clean 20-step chains (61% including the chain trials a screen flags as passed by no model), and 20-step chains passing 33 percentage points more often than multiplying the single-step rates predicts, a gap they call partly an effect of chain grading checking only selected earlier steps (abstract; §8.5; §9).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [pass^k (reliability over k trials)](#/glossary/passk-reliability-over-k-trials) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **world, subtask, solo and `chain-1tok` tasks**: a world is one procedurally generated mock-API environment whose storyline segments each freeze into a subtask, shipped alone as a solo task; a `chain-1tok` task starts from the initial world with one compressed goal centred on segment k, so the agent must re-earn whatever earlier state the final grading checks (§3).
- **headline slice**: the 20-subtask chains of the eleven full-length worlds (two of the 13 were cut short) (§4). **Clean** results leave out the two **screened families** of worlds that hold most flagged cells (§7; §8.1; §8.3).
- **cell, model-consensus screen**: a cell is one world at one chain length; the screen flags cells that no model in the panel passes, for manual root-cause analysis, and "nominates and does not prove" (§7).
- **canary**, two senses: a value hard-coded in the mock, reachable only along the correct call path and different on each decoy route; "Nearly all tasks" have one (§5). Also a GUID string each task carries against training contamination (§2; §9).
- **G1 (state), G2 (answer), provenance-gated grading**: a run passes only if G1 finds the canary in the final workspace (28 of 241 solo tasks have no state check, §5), tied by a data-flow check to the response it had to come from, and G2 matches a typed **answer card** field by field. Provenance-gated means a leaked expected answer alone does not pass (§5; Fig. 1, PDF p. 4). Not the glossary's data provenance.
- **zero-LLM self-test triad (Gate 1)**: with no LLM involved, a blank exam (the agent does nothing) must fail, the answer key must pass, and a sabotaged exam (each check's evidence corrupted in place) must fail (§4).
- **oracle, pass@10 ≥ 3 (Gate 2)**: a model from a lower capability tier than the generator attempts each subtask ten times in the scoring harness; the subtask is admitted only if at least three attempts pass (§4).
- **two-sided golden replay (Gate 3)**: an assembled chain's reference solution must pass; where a later subtask depends on an earlier one, running only the final segment's reference from the initial state must fail (§4).
- **coupling**: forced cross-subtask dependencies, e.g. an identifier minted early and consumed later (§4).
- **discoverable gates**: each requirement on the success path must be learnable from the served spec or a truthful error hint (§4 "Gates need to be discoverable").
- **epoch, pass@5, pass^1, pass^5**: each task runs five epochs per model; any epoch passed, the mean, and all five passed (§6; §8.4). Intervals are cluster bootstraps that keep each world's epochs together (§6).

**Builds on:**
- τ-bench (Yao et al., 2025), customer-service agents graded on final database state and the source of pass^k (§2; §8.4), and AppWorld (Trivedi et al., 2024), coding agents in a world of apps: state-based benchmarks whose single pass/fail outcome, the paper says, cannot tell correct state from correct delivery (§1; Tab. 1, App. C).
- Inspect AI (UK AI Security Institute, 2024), an evaluation framework whose stock `react` agent loop runs all models (§6).
- BIG-Bench (Srivastava et al., 2023), whose training-data canary the paper follows (§2; §9).

## Problem and setting

How do agents fail on long, dependent REST-API workflows, and can a generated benchmark for them be shown solvable, correctly graded and resistant to shortcuts (§1)? Agents act through exactly seven tools; two (`clarify`, `report_blocked`) let an agent stop, which forfeits the ranked metric (§3). Tasks cover seven axes: authentication, discovery, schema repair, multistep execution, error recovery, pagination and statefulness (§1; Tab. 2, App. D). The frozen 1.0 bank has 467 tasks in 13 worlds, 241 solo and 226 chain (§3). Nineteen frontier and open-weight models run five epochs per task at temperature 1.0 under the stock `react` loop, with no custom planner, summarizer or retry logic (§6).

## Approach

- **Forward generation (§4; Fig. 5, App. B).** Each subtask is proposed against the state of a run that passed; a seed makes worlds regenerate deterministically.
- **Validation (§4).** Gates 1 and 2 run per subtask. A failing subtask is repaired by a model of the generator's family, else the chain is truncated at the last solid subtask. Gate 3 runs on assembled chains, and a static leak check blocks publication when a seed-workspace value equals an answer-card value. One adversarial reviewer then attacked the finished grader (§5).
- **Grading (§5).** Format is normalized, structure strict; checkpoints (such as backoff after an HTTP 429) are diagnostics only.

## Results

- **Level collapse (§8.1; Fig. 2a).** Pooled over the panel, pass rates fall from 92.9% on solo tasks to 74.4% on the nine clean 20-subtask chains, 60.9% with the screened cells, at a fixed world set, tool surface and difficulty labelling. All cluster-bootstrap intervals overlap, so model separation is "unresolvable here" at this bank size (§8.1).
- **Headline slice (§8.2; Fig. 3a; Tab. 3, App. E).** Point estimates put gpt-5.5 first and deepseek-v4-flash ("a cheap open-weight model") tied with claude-opus-4-8 for second; all intervals overlap. Price "sharpens the interleaving" of closed- and open-weight models (Fig. 6, App. E).
- **Failures at final delivery (§8.3; Fig. 2b).** On the clean slice abstention is nearly absent, and 77% of failing runs (169) left every state check green and failed only the answer card; 167 of those sit in two worlds, so lost delivery is "a property of specific world–task shapes, not a uniform tax" (§8.3; Fig. 8, App. F).
- **Consistency ranking (§8.4; Fig. 3b).** Over all 467 tasks (cells with fewer than five completed epochs excluded), best-of-five spans seven points across the panel and all-five-of-five spans 44, against a binomial noise floor "near seven points" that world-level clustering raises. The authors argue pass^5 is "the operationally relevant statistic" since an agent on side-effecting APIs "does not get free retries".
- **Not the product of independent steps (§8.5; Fig. 4, App. A).** The prediction multiplies each segment's solo pass rate, estimated per model and world. On the nine clean full-length worlds, observed and predicted curves agree at length 2 and diverge by 33 percentage points at length 20 (74.4% observed vs. 41.4% predicted). Two mechanisms "plausibly produce the gap": selective chain grading and strongly correlated within-session competence. The independent-step account "is inconsistent with the data for these agents under chain grading".
- **Screen (§7).** It flags 18 of 226 chain cells, 8.0% of chain trials; in each, the assembled grader checks mid-chain steps the compressed instruction does not state, yet a reference solution passes, and the cause of the zero pass rate is left open. These cells "compress aggregate pass rates but do not reorder models".
- **Grader audit (§5; Tab. 4, App. G).** Six attacks succeeded (two false negatives, four false positives) on four of the seven axes, e.g. a total leaked on a summary endpoint. All were "implementation errors instead of flaws in the grading design"; reported numbers come after the fixes.

## Limits the authors state

- Eleven sampling units on the headline slice: intervals are wide, all overlap, "and the top reads as a tie" (§9).
- Entanglement: one frontier family generated all worlds, a sibling was the oracle, a same-family reviser repaired gate failures, and that family's models are ranked; "A generator-family advantage remains possible" (§9).
- Mocks "trade realism for replayability"; a high score is "not running arbitrary production systems"; the 1.0 bank is REST only (§9).
- Later runs can be contaminated (§9; §5).
- The audit "was one reviewer's single pass", coverage uninstrumented; finding no exploit on the remaining axes "does not establish that they are exploit-free" (§5).
- Assembled chains are "not oracle-solved end to end"; the oracle certifies solvability "without ensuring difficulty parity" (§4).
- The screen has known escapes, leaves some low-pass cells unadjudicated, and carries no specificity claim; flagged cells stay unrepaired so the frozen bank stays reproducible (§7).
- The descent with length is "not monotone" (Fig. 7, App. E); the cost comparison is "not a serving-efficiency claim" (Fig. 6, App. E). The gates' internal logs remain unreleased (§5).

## Open problems and building blocks

- **Open:** "more worlds and longer chains, a cross-family re-gating control", and, for cells no model passes, "methods that preserve requirement discoverability under compression or grading that gates only what the served instruction states" (§9). A controlled-injection study of the screen's precision and recall "is the natural next step" (§7). A refreshed bank with a private held-out split is planned (App. H).
- **Released:** a content-hash-pinned manifest and 44,362 unredacted transcripts (§1); expected answers and segment-level reference solutions (§5); harness, bank, scoring code and leaderboard builder under Apache-2.0 (App. H).
- **To reuse it:** replay and bank-verification scripts run on local mocks with no network or credentials; the leaderboard needs provider API keys, and the full 467 × 5 grid cost "between roughly $8 and $730 in total" per model at pinned prices (App. H). Third-party task banks "should be treated like other executed code" (App. H).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
