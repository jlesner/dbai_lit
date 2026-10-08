# Solving a Million-Step LLM Task with Zero Errors

**Solving a Million-Step LLM…** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2511.09030) · [arXiv](https://arxiv.org/abs/2511.09030)  
Code: [neuro-san-benchmarking](https://github.com/cognizant-ai-lab/neuro-san-benchmarking)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Solves a Towers of Hanoi instance whose solution takes over one million LLM steps, with zero errors (abstract; §4.4); the solution strategy is given in every agent's prompt, so only execution is tested (§4.1).
- Decomposes the task into one-step micro-agents, picks each step by first-to-ahead-by-k voting over exact-match samples, and discards ("red-flags") overlong or misformatted outputs (§3.1–3.3); the run uses gpt-4.1-mini, chosen over reasoning models on projected cost (§4.3–4.4).
- Per-step correction against the compounding of errors over long jobs, by agreement among samples rather than a program check (§3.2): the authors note it depends on errors being decorrelated across samples (§4.3), which red-flagging helps (§4.5). Takes its plan-in-the-prompt execution framing from [The Illusion of Diminishing Returns](#/papers/sinha2025longhorizon "The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2026)") (§4.1).

## In plain words

LLMs err occasionally at every step, so a long chain of dependent steps almost surely breaks: the authors cite Towers of Hanoi experiments in which the process "inevitably becomes derailed after at most a few hundred steps" (abstract). They want LLM systems that carry out processes at the scale of organizations and societies (abstract). Their system, MAKER, gives each move to a separate LLM call, samples several answers per move and accepts one only when it leads every other answer by a set number of votes, and throws away answers that are too long or badly formatted. They also model how success and cost grow with task length. With gpt-4.1-mini and the solution strategy written into every prompt, MAKER solved a 20-disk Towers of Hanoi, over one million moves, with zero errors (§4.1, §4.4), against single models whose error-free run lengths are computed from their error rates (Fig. 1). The authors call MAKER "the first system that successfully solves a task with over one million LLM steps with zero errors, and, in principle, scales far beyond this level" (abstract).

## Background and terms

**Terms to know:** [test-time scaling](#/glossary/test-time-scaling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling). Our bridge: MAKER applies self-consistency per step, and red-flagging resembles [rejection sampling](#/glossary/rejection-sampling).

**The paper's own terms:**
- **Towers of Hanoi**: move a stack of disks from the first of three pegs to the third, one disk at a time, never a larger disk on a smaller one; D disks take 2^D − 1 moves at best (§2.3).
- **Subtask, agent**: m steps (moves) given to one LLM call, an agent. **Single-agent** means one call for all steps; **maximal agentic decomposition (MAD)** means one step per agent (§3.1, Eqs. 4–7).
- **MDAP (massively decomposed agentic processes)**: the authors' framework of decomposition into minimal subtasks, voting on each subtask, and red-flagging (§1). **MAKER** is "a first implementation" of it (§1).
- **First-to-ahead-by-k voting**: sample answers until one has been sampled k times more than any other (§3.2, Alg. 2). **First-to-k**: the first answer with k votes wins (§4.4). In this paper's experiments votes must match exactly, though "in general, a classification function could be used" (§3.2).
- **Red-flagging**: discarding and resampling a response with a sign of unreliability, here "overly long responses" and "incorrectly formatted responses" (§3.3). The **repairing parser** instead tries to fix formatting errors (§4.2, App. C).
- **p, k_min**: the per-step chance that one sample is correct; the smallest vote margin that reaches a target probability of solving the whole task (§3.2, Eq. 14).
- **Correlated errors**: steps with unusually high error rates; a **collision** is a step whose first two votes are both wrong (§4.5).
- **Multi-agent advantage**: "a solution to a problem that is not solvable by a monolithic single-agent system" (§1).
- **Scaling laws**: here, formulas from a probability model of voting (Eqs. 13–19), not fitted curves.

**Missing glossary terms:**
- **Sequential probability ratio test (SPRT)**: a test that takes observations one at a time and stops once the evidence for one hypothesis over another passes a threshold (general definition); cited as the motivation for first-to-ahead-by-k voting (§3.2).
- **Gambler's ruin**: a random walk that moves up or down one unit per round until it hits one of two bounds; its formulas give the chance of hitting each bound and the expected rounds (general definition); used for the vote race (§3.2).

**Builds on:**
- Shojaee et al. (2025), "The illusion of thinking": proposed Towers of Hanoi as an LLM reasoning benchmark; MAKER's prompts derive from its single-agent prompts (§2.3, §4.1, App. C). Not on this site.
- Sinha et al. (2025), "The illusion of diminishing returns" ([The Illusion of Diminishing Returns](#/papers/sinha2025longhorizon "The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2026)")): long-horizon execution with the plan given (§2.1, §4.1).
- Meyerson and Qiu (2025), a position paper: smallest-subtask decomposition and cost analysis in LLM calls (§1, §2.1, §3.2). Not on this site.
- Voting: Wald's sequential analysis and Lee et al.'s ConSol, which uses that test to find consistent LLM reasoning paths (§3.2); self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")) and AlphaCode, which vote over complete answers (§2.2).

## Problem and setting

- **Question:** "how/whether LLMs can execute large tasks with extreme precision" (§1), and "How does the decomposition of the task into subtasks affect its solvability?" (§3.1).
- **Task:** 20-disk Towers of Hanoi (§4). Each agent gets the current state and previous move and must output the next move and next state in a fixed format (§4.1, App. C).
- **The strategy is given** in every prompt, as in prior work, which "effectively isolates the ability of agents to execute clear instructions from the ability of LLMs to have insights" (§4.1). So every step's correct answer is known, and per-step error rates can be measured on random steps (§4.2). Correct means the whole sequence with zero errors (§4).
- **Models:** nine LLMs, four proprietary and five open-source, without tools (§4.2, Fig. 6b, App. E).
- **Analysis assumptions:** the correct answer races a single alternative (the worst case), errors are independent and identically distributed across steps, and p is above 0.5, where voting converges (§3.2, §4.3, §5).

## Approach

- **Decompose maximally (§3.1).** A single agent's outputs become increasingly unreliable as its context grows; with MAD each agent sees only what its step needs, also allowing smaller LLMs.
- **Vote on each step (§3.2, Alg. 1–3).** Under the assumptions above, some k reaches any target per-step error rate (Eq. 9). The derived k_min grows with the logarithm of the number of steps "no matter the decomposition level" (Eq. 14; App. B assumes a target above 1/e). With one step per agent and p, call cost and target held constant, expected cost grows like steps × log(steps) (Eq. 18); with more steps per agent it grows exponentially in their number, since long answers rarely match across samples (Eq. 17, Fig. 5). The approximations hold "when the error tolerance is low"; votes can run in parallel, so time grows linearly (§3.2).
- **Pick the model first (§3.2–3.3, §4.2):** the LLM with the lowest cost relative to its estimated p.
- **Red-flag (§3.3).** Hypothesis: discarding flagged responses raises p and "meaningfully" reduces correlated errors; Eq. 19 gives the cost with discards.
- **Full run (§4.4):** gpt-4.1-mini, a 750-token limit, the red-flagging parser, k = 3, temperature 0 for "The first step" and 0.1 for "all subsequent votes".

## Results

- **The million-step run (§4.4).** "the full system solved the problem perfectly", which the authors call "the first successful solution of a task with one million LLM steps with zero errors". Undecided steps then fall exponentially, so most cost is spent in the first three rounds, an effect of a high enough p (Fig. 8). First-to-k voting also solved it.
- **Models (§4.2–4.3, Fig. 6b).** From estimates without red-flagging, for a 0.95 target: gpt-4.1-mini at temperature 0.1 has error rate .0022 and projected cost $3.5K, against .0018 and $9.4K for o3-mini at low reasoning effort, and $1.7K for gpt-oss-20B, the lowest. Error rates of "relatively small non-reasoning models are comparable to more advanced reasoning models"; per-step error rates are "remarkably stable as the number of disks increases" (§4.2). gpt-4.1-mini was run for its more reliable API (§4.3). In two runs on 10K random samples, no step erred in both (§4.3).
- **Red-flagging (§4.5, Fig. 9).** Past about 700 tokens, p is "still around 90%", against error rates "on the order of 1-in-1000" for shorter responses; as few responses are that long, k_min doesn't rise. The authors find "the impact on correlated errors turns out to be a much more important effect": with high token limits, collisions are much higher than independence predicts, especially with the repairing parser, and red-flagging "successfully reduces some of these correlated errors".
- **One pathological step** needed far more votes than any other, yet was decided correctly (Fig. 11).
- **Multiplication (App. F, Fig. 12).** A recursive MAKER with four agent types (§5, Alg. 4), on gpt-4.1-mini with decomposition depth fixed at 5, reaches 100% on 5×5-digit and 95% on 6×6-digit multiplication by k = 10, against single-agent baselines of 35% and 10%; "promising" preliminary results (§5).

## Limits the authors state

- Informally, steps must be "small enough that, for each step, a correct solution is likely to be sampled, and no incorrect solution is more likely" (§2.1).
- The paper "focused on execution", not insights, which "may come with irreducible step-wise uncertainty"; extending to them needs unknown step counts, mixed step types and success rates, and "inexact matches between insight steps" (§5 "More General Applications").
- For other problems, p may not be as easy to estimate, though it should be possible "to a practical degree" (§4.2); the estimates are useful only if errors are "sufficiently decorrelated across runs" (§4.3).
- The vote analysis has no known closed form for many candidates, so it assumes one alternative (§3.2); the theory assumes independent errors, yet "a few steps … had substantially higher inherent error rates than others" (§5).
- Steps needing many more rounds "could be cause for concern" (§4.4); other cases may need "more sophisticated decorrelation methods", such as paraphrased or noised prompts, per-step success rates or more diverse LLMs; such errors are "an open foundational problem in machine learning" (§5).
- All agents used one LLM, with prompts differing only in the subtask (§5).
- MAKER assumes a decomposition into steps an agent solves "with reasonable probability" (§5 "Limits of Decomposition").

## Open problems and building blocks

  - Discovering optimal decompositions automatically, "an orthogonal open question" (§2.1); which tasks resist decomposition (§5 "Limits of Decomposition").
  - Lessons from microservice architectures (§5 "Parallels with microservices").
- **Released:** code for the multiplication experiment (App. F); prompts and parsers printed in App. C.
- **To reuse it:** steps whose answers can be compared (§3.2), a model with p above 0.5 estimated before the run (§3.3, §4.3), and an API reliable for "millions of agentic calls" (§4.3).
- **Beyond its domain:** MDAPs "may provide a way to efficiently solve problems at the level of organizations and societies" (abstract); App. F's mechanism allows "reliable multi-step inference beyond the arithmetic domain" (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
