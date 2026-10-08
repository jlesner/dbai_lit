# When Self-Evolution Backfires: Pre-Commit Gating against Skill Contamination in LLM Agents

**VaG ("When Self-Evolution Backfires")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.05810) · [arXiv](https://arxiv.org/abs/2608.05810)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Finds that a self-evolving agent that admits every skill it distills from its own trajectories improves, peaks and then degrades as the pool grows, and argues that removing a defective skill afterwards cannot undo the skills later distilled with it in context (abstract; Introduction; Methodology).
- Verifier-as-Gatekeeper admits a skill only if a schema check, a single-skill A-B replay on held-out Terminal-Bench 2 tasks and one LLM review all pass it, then promotes a subset to the agent's context by greedy marginal gain on joint replays; the benchmark's deterministic checker grades the tasks (abstract; Methodology; Experiments).
- A check on what enters an agent's memory before it can steer later rounds: the authors report that removing the culprit skills afterwards recovers "only 17% of the degradation" (Introduction). Its round-by-round curves are on the tasks the skills were distilled from, which the authors call "an optimistic upper bound"; the held-out split is used only for transfer (Experiments, Tabs. 1 and 3).

## In plain words

Self-evolving LLM agents write natural-language skills from their own runs into a pool that later rounds use. The authors argue that admitting every skill backfires: a bad skill misleads the agent and shapes later skills, so deleting it afterwards recovers only a small part of the loss (abstract; § "Introduction"). Their Verifier-as-Gatekeeper (VaG) lets a skill into the agent's context only after three checks alone and a test with the others. On the 50 command-line tasks the skills came from, which they call an optimistic upper bound, they report VaG rising every round to 72% solved, while admitting everything peaks at 62% and ends at 50% (Tab. 1). They present a phenomenon, argument and method, claiming no priority.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk) · [Wilson score interval](#/glossary/wilson-score-interval) · [statistical power](#/glossary/statistical-power)

**The paper's own terms:**
- **skill**: "a structured experience unit written in natural language" (§ "Methodology", "Problem Formalization…"). Distilled: an LLM writes them from trajectories, with the current pool in context.
- **individual, combinatorial, systemic contamination**: one skill lowers success alone; skills each harmless can lower it together (Eq. 3); together they make success rise, then fall as the pool grows, peaking at the **tipping point** (Eq. 4).
- **descendants, lineage**: skills distilled later with a given skill in their context (§ "Methodology", "Irreversibility…").
- **Cold, Warm, Hot**: tiers; new skills start Cold (invisible), Gate 1 promotes to Warm, Gate 2 to Hot; only Hot skills enter the prompt (Fig. 2).

**Missing glossary terms:**
- **submodular function**: diminishing returns: an item adds no more to a larger set than to a smaller one. The paper's utility is "neither known to be submodular nor monotone" (§ "Methodology", Gate 2).

**Builds on** (all § "Related Work"):
- Voyager (Wang et al. 2023), which checks only that a skill completes its own task.
- AHE (Lin et al. 2026, [Agentic Harness Engineering (AHE)](#/papers/lin2026ahe "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses (2026)")), which evolves a whole harness and scores only the aggregate; ACE (Zhang et al. 2025, [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), context-level evolution with the same unconditional admission.
- MetaClaw (Xia et al. 2026), which needs model weights.

## Problem and setting

Does admitting every skill make performance peak then fall, and can gating prevent it?
- **Benchmark** (§ "Experiments", "Benchmarks"): Terminal-Bench 2 (TB2), "hard, verifier-checked terminal tasks" in a sandboxed shell, graded deterministically. Stratified by difficulty into Event (50 tasks: Distillation into compact models and the round curves), Holdout (14: only inside the gates) and Test (25: final evaluation only). Transfer: 200 InterCode NL2Bash tasks (instruction to one bash command).
- **Agent:** a ReAct loop (the model emits a shell command or stops). The primary backbone is Hy3, which the paper does not describe; four other LLMs (DeepSeek-V4-Pro, GPT-5.4, Claude Sonnet 4.5, Qwen3.6-35B-A3B) test transfer (§ "Agent and backbones").
- **Configurations:** Seed (three hand-written skills), Ungated, Post-hoc Rollback (of Ungated's round 5), VaG; five rounds, 3 rollouts per task, pass@1, no LLM grader (§ "Configurations", "Implementation details").

## Approach

- **Irreversibility** (§ "Methodology", "Irreversibility…"): removing only a bad skill leaves a worse pool than removing it with its descendants (Eq. 5), the authors argue, whenever at least one descendant inherited its flawed reasoning. Hence contamination "must be intercepted before skills enter the agent's runtime context".
- **Gate 1** (§ "Methodology", "Pre-commit Gating…"): a skill must pass SchemaCritic (required fields), ExecCritic (a single-skill A-B replay on Holdout; success must not drop) and AgentCritic (one LLM call checking for fabricated facts, contradictions with existing skills, or unsafe operations).
- **Gate 2:** from an empty set, add the Warm skill with the largest estimated joint gain, keep it only if it strictly improves measured Holdout performance (mean of 3 replays), stop when none helps. The authors call it "a heuristic", with no worst-case optimality guarantee.

## Results

- **Curves** (Event, Tab. 1, Fig. 3): Ungated peaks at round 3, then falls to roughly its round-1 level; VaG improves every round, ending 10 points above Ungated's best round with 37 skills against 179.
- **Rollback** (Fig. 4; § "Post-hoc Rollback…"): of the 12.3-point drop from Ungated's peak, source-only removal recovers 1.7 points and oracle full-lineage cleanup (which "requires provenance a real system lacks") 6.7.
- **Ablation** (Tab. 2): every removal lowers pass@1: schema −2 points, semantic −4, Holdout replay −10; without Gate 2, −8 with the pool growing from 37 to 58. The authors read this as each critic catching "a largely disjoint class of harmful skills" (§ "Methodology", Gate 1).
- **Transfer:** the frozen round-5 pool gives "positive lift on all five backbones" on Test (+8 to +16 points, Tab. 3); NL2Bash: VaG 69.0%, Ungated 65.5%, Seed 57.5% (Tab. 4).

## Limits the authors state

- Event numbers "are an optimistic upper bound, whereas Test is the honest held-out estimate" (§ "Experiments", "Benchmarks").
- The 95% Wilson bands (about 30 points wide) "overlap at intermediate rounds, so per-round point tests are underpowered" (§ "Main Results").
- ACE and AHE scores on TB2 "are not head-to-head baselines" (§ "Main Results").
- VaG "gives up a little while the pool is small, since gating also rejects some benign skills" (Fig. 1 caption).
- Lineage cleanup is "out of reach in practice": libraries do not record which skills were in context (§ "Introduction").

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** scored held-out tasks for the replays; one LLM call per candidate; for Gate 2, under one joint replay per Warm candidate, with at most 15 candidates per round (§ "Methodology", Gate 2; § "Main Results").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
