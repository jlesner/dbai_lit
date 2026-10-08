# Memory Reward Inflation in Self-Improving LLM Agents

**Memory Reward Inflation in…** · (Echo Gap, LUCID), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.00017) · [arXiv](https://arxiv.org/abs/2608.00017)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A memory agent stores each episode with a score it gives itself and reuses high-scored ones; the authors call the inflated scores of wrong episodes the "Echo Gap", argue that reuse compounds it, and state an Error-Independence Assumption (EIA): a correcting signal must track truth and have errors uncorrelated with the self-grade's (abstract; §1; §3).
- Measured after the fact on self-graded factual-QA banks, where cross-vendor LLM re-graders and their ensembles fail the EIA and a retrieval-based verifier passes it (§3.4; §4.2, Tab. 3); then LUCID, which demotes memories flagged by answer-free signals from the query and its execution (errors, timeouts, nondeterminism, empty or all-NULL results, literals not in the question), in a Memento-style text-to-SQL agent on the BIRD dev set, two seeds (§6.1–6.4).
- Why memory needs a check independent of the model that wrote it: the authors report that the Claude Haiku 4.5 self-grader endorses 31% of its own wrong answers (§3.4, Tab. 2; disputed by App. D's counts), and that stronger LLM re-graders do not fix this because their errors echo the self-grade (§4.2); the signal they report working on SQL is answer-free checks of the query and how it runs, not a judge (§6.3).

## In plain words

Some LLM agents improve without retraining by keeping a memory: each finished task is stored with a score and later shown as an example for similar tasks. Lacking correct answers, the model usually grades itself. Treating that score as a reward, the authors argue that when it overrates wrong episodes (their Echo Gap), the agent preferentially reuses its own mistakes, and the error compounds instead of averaging out (abstract; §1). They prove theorems on simple models of this compounding, test it on factual question banks, and state a condition they prove necessary for a fix: the checking signal must track the truth and its errors must not echo the self-grade's (abstract). Their method, LUCID, lowers the score of episodes flagged by cheap checks on the query and how it runs. On the BIRD text-to-SQL benchmark's development set, over two runs, they report 56.9% of questions correct, against 54.0% for a self-graded memory agent and 52.4% without memory (abstract; Tab. 5). They place the novelty not in a new bias but in its "loop-amplified, correctable form in self-improving memory agents" (§2).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reward hacking](#/glossary/reward-hacking) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [Pearson correlation](#/glossary/pearson-correlation) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [dense retrieval](#/glossary/dense-retrieval)

**The paper's own terms:**
- **Memory signals**: each stored episode (task, answer, score) has an LLM grade written when stored, usually the agent's **self-grade**; a **verifier score** from another channel; and the **ground-truth utility**, used only to measure afterwards. **Bias** and **verifier error** are each score minus truth (§3.1).
- **Echo Gap**: "frequency-correlated reward inflation in a memory loop": wrong memories are overrated on average, and among them the more overrated tend to be reused more (§3.2).
- **Leniency**, **sensitivity**: how often the grader calls a wrong, or a correct, episode correct (§3.4; §5.2).
- **EIA (Error-Independence Assumption)**: on a labelled validation bank, a verifier's error is nearly uncorrelated with the self-grade bias and its score correlates with truth, each against a cutoff (§3.3); the authors treat it "as directional rather than tied to a particular cutoff" (§3.3).
- **De-inflation**: lowering the stored score of memories that look overrated; in deployment, flagged memories are demoted from 1 to 0, not rewritten (§3.3; App. B.1). An **answer-free** signal reads neither the truth nor the reference answer (App. A). **Detector precision**: the share of flagged memories truly wrong (§3.3).
- **Memory-to-behavior coupling (κ)**: how much the agent's error rate rises with the share of wrong trusted memories; **corrupted attractor**: the share of wrong trusted memories at which the write-back loop settles (§5.2).

**Missing glossary terms:**
- **Fixed point and stability**: a state a repeated update maps to itself; stable when small nudges die out (general definition; §5.2).
- **Softmax retrieval with temperature T**: picking memories with probability proportional to e^(score/T); top-k is the limit as T goes to 0 (Thm. 1).

**Builds on:**
- Memento (Zhou et al. [4]), an agent learning from a case memory without fine-tuning, re-implemented for BIRD with its retriever (§6.1; App. F).
- Reward hacking (Pan et al. [8]), "The closest known relative" (§1); Tab. 1 (§2) also compares LLM-judge bias, self-correction failure (Huang et al. [33], [Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)")), memory poisoning and degradation.
- ReasoningBank (Ouyang et al. [13]), a memory of strategies from self-judged episodes, whose gains their results "do not contradict" (§2).

## Problem and setting

- **Question:** does self-grading inflate wrong memories, does reuse amplify it, which signals correct it, and does it hurt a full agent (§3.4; §6)?
- **Factual banks:** Claude Haiku 4.5 answers and grades itself; GPT-5.4-mini and GPT-5.4 banks test other model families, though "the gold-judging setup is not identical across all banks" (§3.4). Verifier and payoff tests use the Haiku bank (§4.1; Tab. 4). Calibration is tested on a separate 50-item SimpleQA bank, a short-answer factual benchmark (App. E).
- **BIRD:** the full development set, 1,534 questions over SQLite databases, official execution accuracy, two seeds, each a task order shared by all agents (§6.1; App. F). Retrieval is top-4 by similarity alone (SimCSE sentence encoder); the self-grade is shown to the planner, never used to re-rank; memory is append-only (App. F). Planner, executor and self-grader share one model (§6.1), not named in §6.1 or App. F.

## Approach

- **Amplification (Thm. 1, §3.2):** compare an honest bank with one that raises every wrong memory's score to some b in (0, 1], correct ones staying at 1. (i) Under softmax retrieval with T > 0 and flat trust, influence on wrong memories grows by a factor between 1 and e^(b/T) (1 under similarity-only retrieval). (ii) When retrieval ignores the stored score, and the agent's trust in a memory is strictly increasing between scores 0 and b and positive at 0, influence grows by trust(b)/trust(0) > 1. The authors place their BIRD agent in (ii).
- **EIA is necessary (Proposition 2, §3.3; proof App. B):** for a de-inflation that moves each stored score a step toward the verifier's, if the verifier's error follows the bias at least one-for-one (regression slope ≥ 1), the corrected bias spreads more than before at every step in (0, 1]; the best-step reduction grows as that slope goes to 0 and the remaining error shrinks.
- **Global calibration (Lemma 1, §5.1):** if two memories have equal stored scores but different truth, no label-blind map of the score can separate them; a monotone map leaves the top-k set unchanged.
- **Corrupted attractor (Thm. 2, §5.2):** in a mean-field model (one average share of wrong trusted memories, updated each round; error rate a base rate plus κ times that share, capped at 1; episodes admitted at the grader's leniency or sensitivity): (i) for κ > 0 the fixed point strictly exceeds the one-shot corruption without feedback; (ii) beyond a critical coupling the benign fixed point loses stability and the loop is driven to full corruption.
- **Precision (Proposition 1, §5.3):** if de-inflation acts only on flagged episodes, with expected gain g > 0 per truly wrong one and loss h > 0 per useful one, it helps in expectation whenever precision exceeds h/(g + h).
- **LUCID (§6.2–6.3; Fig. 1):** the same Memento agent, differing only in stored reward. Its detector reads the question, the SQL and how it runs: (i) execution: errors, timeouts, or different results across two identical runs; (ii) degeneracy: an empty or all-NULL result "for a question that expects an answer"; (iii) literal grounding: a filter on an entity-like string not in the question. It makes no model call (App. F).
- **Verifiers (§4.1):** same-model self-consistency and adversarial judge; GPT-5.4-nano, -mini and GPT-5.4 re-graders and ensembles; a retrieval-based verifier that "conditions on external evidence".

## Results

- **Leniency (Tab. 2, §3.4):** the authors report that the Haiku bank endorses 31% of its own wrong answers (95% CI 26–35%), GPT-5.4-mini 54% and GPT-5.4 41%, pooled over three seeds, "not an exact vendor comparison". Under score-ranked reuse, bias and reuse count are positively associated among wrong memories (§3.4).
- **EIA (Tab. 3, §4.2; App. C):** only the retrieval verifier passes (error correlation +0.05, truth correlation +0.76). The GPT-5.4 re-graders and ensembles that track truth at all have error correlation ≥ 0.30 and truth correlation ≤ 0.42, the gold-fit aggregator included; self-consistency is nearly decorrelated but weakly truth-tracking. Under leave-one-seed-out cross-validation the retrieval channel is the unique pass and best held-out signal in every fold.
- **Payoff (Tab. 4, §4.3):** de-inflating with the retrieval verifier lifts the correlation of stored score with truth from +0.22 to +0.81, against +0.97 with gold; the GPT-5.4 re-grader gains +0.10, GPT-5.4-nano loses 0.16, label-blind calibration nothing.
- **Not generic pruning (App. D, Tab. 7):** random demotion at the same budget harms the bank and self-consistency pruning gains little; the decorrelated demotion (labelled LUCID there) demotes no correct memory.
- **BIRD (Tab. 5, §6.4):** execution accuracy 56.9% for LUCID, 54.0% for the self-graded Memento agent and 52.4% without memory (two-seed means); per-seed 95% intervals of LUCID's paired gain exclude zero (+1.9 and +3.9 points). The authors write that removing the inflation "causally raises accuracy", citing also the within-band dose–response below.
- **Detector (App. F):** precision 0.90 against a base rate of wrong memories of about 0.46.
- **Loop on BIRD (§6.5; App. G, Fig. 2):** agent error rises with the share of retrieved memories trusted but wrong, within every difficulty band too; with measured parameters Thm. 2 predicts corruption 0.45, observed 0.42, a no-loop account 0.28. BIRD sits in the stable regime. A generation-free sweep of retrieval depth (1–8) finds corruption nearly flat, coupling growing.

## Limits the authors state

- "parametric judging is not claimed to be impossible in general" (§1); on this bank, capability, count and aggregation "did not manufacture the decorrelation EIA requires" (§4.2).
- Self-grade inflation "is not claimed here as a new species of bias" (§2).
- "Both theorems are minimal mechanism models"; the test is "of the prediction, not of the softmax, mean-field, or linear-dose idealizations" (§5.2).
- The condition behind EIA is "an explanatory design heuristic", "not a guarantee assumed here"; they do not claim EIA finely ranks the failing signals (App. C).
- Detector "recall is low but harmless for de-inflation" (App. F).
- Zero correct memories demoted is "a low-count estimate" (App. D).
- The calibration measures are "on a separate, smaller bank and are not directly comparable" to Tab. 4 (App. E).

## Open problems and building blocks

- **Open:** none stated. App. G predicts that agents with larger coupling "would cross the stability threshold" (Thm. 2(ii)); §7 recommends separating "memory writing from memory trust".
- **Released:** "Code, data, and per-episode memory traces" (§1, footnote); "All code, per-episode memory traces, exact run configurations, and result files" (App. F).
- **To reuse it:** pinned model snapshots; each query run twice in a sandbox with a 30-second timeout; three model calls per episode, none for the detector; on the order of 2.8×10⁴ generation calls for the BIRD study; SQL execution dominates wall-clock (App. F). Checking EIA needs a labelled validation bank (§3.3).
- **Beyond its domain:** the three channels "are not specific to SQL" (§6.3); Tab. 6 lists answer-free signals for research, code, math and tool-use agents (App. A); and to reinforcement-learned memory managers the Echo Gap and its correction "apply directly" (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
