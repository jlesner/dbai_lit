# Attention Tax, Handoff Tax: A Stylised Model of When Multi-Agent LLM Systems Help

**Attention Tax, Handoff Tax** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.06069) · [arXiv](https://arxiv.org/abs/2610.06069)  
Code: [attention-handoff-tax](https://github.com/akshitanchan/attention-handoff-tax)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A stylised reliability model of single- against multi-agent LLM systems: per-step failure rises with the context an agent attends over, handing work to a fresh agent costs a "handoff tax" per boundary, and parallel samples share part of their failures (abstract; §3).
- Proves, inside the model, when decomposition wins (Thm. 1–4) and when equal-budget parallel sampling beats one agent thinking longer (Thm. 6), and places published single- and multi-agent results in its regimes (§8); measures the context curve with gpt-oss-20b on arithmetic word problems (§9), and the curve and the handoff tax on a ledger-reconciliation task with exact balances (§10).
- A per-step model of long-job reliability in which context load, not only step count, drives failure: from single-agent and handoff runs alone it predicted the decomposed system's success to within 9 points at depths 20, 50 and 100 (abstract; §10, Tab. 6), all past its predicted crossover at depth 10, which was not run (§1, §10); along one trajectory it still assumes independent step failures (§11). Bears on [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability).

## In plain words

Should one LLM agent do a long job alone, or split it among agents that hand work on to each other? Published results disagree (abstract); the authors claim "much of the contradiction comes from bookkeeping" (§1). They model a step's failure rate as possibly rising with the context it reads and each handoff to a fresh agent as possibly losing information, and prove, inside the model, when splitting wins and when parallel answers at equal compute eventually beat one agent thinking longer (§4–§5). On a ledger-reconciliation task with the open-weight gpt-oss-20b, they measured both effects from single-agent and handoff runs alone; the model then put the crossover (the job length past which splitting wins) at 10 steps and predicted five-step agents to win at 20, 50 and 100 steps. They did, with the split system's success within 9 percentage points of the prediction at each length (abstract), though all tested lengths lie past the crossover (§1). The authors present this as "a measurable architecture-selection rule in the regime tested here" (§12).

## Background and terms

**Terms to know:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [test-time scaling](#/glossary/test-time-scaling) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **step, depth L**: a chain of L steps, each one LLM call; a single agent's context grows by k tokens per step (Assumption 3).
- **log-loss**: the negative log of the probability that a step "produces a usable result", so step losses add up; measured in nats (natural-log units) (§3.1, Eq. 1).
- **context degradation curve**: per-step failure as a function of context load at a fixed thinking budget, assumed nondecreasing in load (Assumption 2). A **flat curve** means accuracy does not depend on load.
- **decomposition, chunk size m**: each agent does up to m steps in a fresh context; every agent after the first starts from a summary (handoff note) of length s written by its predecessor (Assumption 3).
- **handoff tax h**: the extra log-loss of a chunk started from the summary instead of the full history, once the load difference is added back via the curve: "the part of the summary's effect that is not explained by load" (Def. 1, §3.2); assumed nonnegative (Assumption 4).
- **attention tax**: the extra log-loss the single agent pays at a step compared with a fresh agent (Eq. 7, §4); the **total avoidable tax** sums, over a fresh agent's steps, the gap between a saturating curve's ceiling and the fresh agent's loss (Eq. 9).
- **redundancy**: N parallel calls at one step, combined by a majority vote on correctness or a selector that picks a correct sample, when one exists, with some probability. In the **latent-rate mixture model** samples are independent given a hidden per-item failure rate; its worked example, the **common-shock law**, copies one draw to all samples with probability ρ, their pairwise correlation (§3.4).
- **shared-failure mass**: the probability that the hidden rate is above one half (plus half the mass at exactly one half), the failure a majority vote tends to as N grows (Thm. 5); **thinking floor**: one agent's failure as its budget grows without bound (Thm. 6).
- **stationary grading**: each step is graded on its increment (whether the balance moved by the right amount), and each note must carry the balance forward; fee steps (a percentage of the balance) are excluded, since they "measure the state carried into them rather than the step itself" (§10).

**Builds on:**
- "Sceptics" (§2): Tran and Kiela [1] (at equal reasoning-token budgets a single agent is more information-efficient than summary-passing systems) and Ao et al. [2] (without new outside signals, a centralised decision maker with the same information dominates any delegated network); the flat-curve case corresponds to both (Tab. 3).
- "Optimists" (§2): Tang et al. [3] (multi-agent gain grows without bound in depth) and Meyerson et al. [4] ([Solving a Million-Step LLM…](#/papers/meyerson2025maker "Solving a Million-Step LLM Task with Zero Errors (2025)"); a million-step task split into single-step subtasks with voting). The authors read [3] as a redundancy result (§7).
- Xu et al. [25], a noise decomposition of divide-and-conquer long-input processing, "The closest precursor to the decomposition side of our model" (§2).

## Problem and setting

When does splitting a chain of LLM steps among fresh agents beat one agent, and when do N parallel samples beat one call with N times the thinking budget (§4, §5)? Assumptions: steps fail independently given load and budget, and the task needs every step (product form); monotone curve; linear context growth; a nonnegative handoff tax, the same at every boundary (Assumptions 1–4, §3); budgets matched per step (§3.1 "Budget"). Measurements use gpt-oss-20b at low reasoning level (§9, §10).

## Approach

**Decomposition (§4):**
- **Thm. 1:** under Assumptions 1–4, with fixed budget, summary length and handoff cost (tax plus note-writing overhead), one step per agent: if the single agent's extra per-step loss far into the run exceeds the handoff cost, a unique depth L\* ≥ 2 exists from which on decomposition wins; otherwise it never wins.
- **Cor. 1:** if failure does not depend on load, the single agent weakly beats every decomposition at every depth and chunk size, for any nonnegative handoff tax and overhead.
- **Thm. 2:** for a saturating curve, no summary overhead and the same tax at every chunk size, some chunk size wins at all large depths if and only if the total avoidable tax exceeds the handoff tax; for an unbounded curve every chunk size eventually wins for every finite tax.
- **Thm. 3 (§4.1):** for one step per agent, a log-loss linear in load (slope λ > 0) on the loads visited, no overhead and L ≥ 2, decomposition wins exactly when L > 2(h + λs)/(λk), giving L\* in closed form (Eq. 11). **Prop. 1** approximates L\* for a curve flat up to a knee and then linear, "a derived approximation, numerically checked" (Tab. 1).
- **Thm. 4 (§4.1):** in the linear regime, for chunk sizes dividing L, positive handoff tax and k > 2s/L, the continuous optimum chunk size tends to √(2h/(λk)) for long tasks (Eq. 14), clipped to [1, L], treating the tax as fixed in chunk size.

**Redundancy (§5).** **Thm. 5:** for samples independent given a hidden rate, average failure below one half and odd N, majority-vote failure tends to the shared-failure mass as N grows. **Cor. 3**, in the same setting, bounds that mass from failure rate and pairwise correlation alone. **Thm. 6:** for a thinking curve that saturates in budget and per-sample failure below one half, a majority vote over N samples at budget b beats one call at Nb for all large N if the shared-failure mass is below the thinking floor, and loses if above. **Cor. 4:** with one-step agents and per-step voting, keeping success above a fixed target as depth grows needs the per-step vote failure and handoff tax both to shrink at least as fast as one over the depth.

**Verification (§6).** **Prop. 3**: with generator failure, recall, budget and a retry that can succeed fixed, if a fresh-context verifier shares fewer failure causes with the generator than a self-check does, verification gains "accrue disproportionately to decomposed systems".

Proofs: App. A. §7 (Tab. 3) maps prior results onto the model; §8 places published results in regimes (Fig. 4).

## Results

- **Pilot (§9, Tab. 4):** at low reasoning and a 1,024-token budget, arithmetic problems padded with irrelevant prose to five loads up to about 63k tokens. Graded on the arithmetic, no slope is detectable; graded on the requested answer line, omissions rise from 0 to 25.5% at the top load, so the curve's shape "depends on what one counts as a step failure" (§1).
- **In-task curve (§10, Tab. 5):** on the ledger task (exact balances; two transaction kinds refer back by id only), at a 512-token budget, single-agent per-step failure rises from 2.7% below 2k tokens to 71% above 36k.
- **Handoff tax (§10):** from paired continue-versus-note runs, the tax on increment correctness is 0.077, 0.026 and 0.015 nats for notes of 137, 183 and 255 tokens; a bootstrap gives it a 95% interval of [−0.11, 0.16] nats; a separate balance-preservation cost is paid per handoff.
- **Prediction and head-to-head (§10, Tab. 6):** predicted crossover L\* = 10 (bootstrap quantiles 6 and 27). On 100 paired ledgers per depth, stationary success, single against decomposed, was 0.50 against 0.69, 0.06 against 0.24 and 0.00 against 0.11 at depths 20, 50 and 100 (McNemar p ≤ 0.014); decomposition also won on final balance. The single agent did no worse than predicted, the direction product form implies "when a single agent's failures cluster on hard ledgers"; the decomposed misses have "no consistent sign" (§10).

## Limits the authors state

- The model "is first order in three places" (§11): product form "ignores dependence along a trajectory" and, when failures cluster on hard instances, "overstates the single agent's loss, which is the direction seen on the ledger"; budgets are fixed per step; the handoff tax is one scalar per boundary.
- "The redundancy floor depends on the whole mixing law" (§11), i.e. on the hidden failure rate's whole distribution; ρ times the failure rate "is the common-shock floor and not a general one" (§5).
- "The measurements cover one model on two tasks" (§11).
- The runs test the winner past the crossover, not the crossing (§1); "runs at depths either side of it are the natural next measurement" (§10 "Scope").
- The pilot's padding is "not the distribution of material a real agent trajectory accumulates" (§9).
- The ledger analysis choices "were fixed once all runs were complete" (§10 "Analysis"); single-agent calls hit the token budget far more often, counted as failures (§10).
- Regime placements are "qualitative" (§8.3); Prop. 3 rests on "an untested hypothesis about verifiers" (Tab. 1).

## Open problems and building blocks

- **Open:** six falsifiable predictions (§8.4) on the crossover, chunk size, summary length, redundancy and verification; §10 tests the first "on one task and one model, on the winning side of the crossover".
- **Open:** "a dependent-failure version of the crossover"; next to measure: boundary verifier recall, the thinking floor, curves for further models (§11).
- **Released:** "Code and data": scripts, stored pilot responses and per-step records of all 40,600 calls (App. B).
- **To reuse it:** a curve from single-agent runs and a handoff tax from paired continue-versus-handoff runs; the experiment cost "about ten dollars, and 27 minutes of wall-clock time" (§10).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
