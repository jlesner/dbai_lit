# SKILLER: Language-Level Reinforcement Learning for Reusable Skill Extraction in Small Language Models

**SKILLER** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.10538) · [arXiv](https://arxiv.org/abs/2608.10538)  
Code: [SKILLER](https://github.com/DANG-ai/SKILLER)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A frontier model (GPT-5.4) acts as critic and actor to write and revise a task-specific agent skill for a frozen small model (Qwen3.5-9B or Qwen3.5-4B) running in the OpenCode agent loop, rewarded by each benchmark's official verifier; the authors call it reinforcement learning in natural language, since every signal is text and no weights change (abstract; § "Method", § "Experimental Setup").
- Each step, the critic compares the small model's trajectory with a reference trajectory of a successful solution and the verifier's diagnostics, locates the earliest causal error and writes edit suggestions; the actor applies bounded Insert, Replace, Create and Delete edits and may add task-local helper scripts; a textual replay memory keeps failures, diagnoses and edits (§ "Natural-Language Skill Optimization"). Compared with skills from AutoSkill, EvoSkill, SkillX, Manus and human authors on SkillsBench, SkillLearnBench, SWE-Skills-Bench, GAIA and EarthBench (§ "Experimental Setup", Tab. 1).
- Frontier optimizes once, offline, for a compact executor that only runs the result, with a verifier and a reference solution in the loop ([Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)): the authors report Qwen3.5-4B with SKILLER's skills scoring above Qwen3.5-9B with every baseline's skills on SWE-Skills-Bench (§ "Main Results and Analysis", Tab. 1), while in the same table the 4B model trails SkillX on SkillsBench and GAIA. Skills are generated on one instance per task and scored on all of that task's instances, except GAIA and EarthBench, where half generates the skill and the other half is held out (§ "Experimental Setup"; Tab. 2).

## In plain words

Agent tools such as Codex follow skills (packaged instructions and helper scripts) well when an expensive frontier model drives them. The authors want cheap open models that fit on consumer GPUs to do the same, but argue (§ "Introduction") that "Skills crafted for strong frontier models do not natively transfer to small-scale LVLMs" (their name for the small models). SKILLER has a frontier model (GPT-5.4) write and revise one skill per task for a frozen small model (Qwen3.5-9B or 4B): the small model attempts the task, the benchmark's checker scores it, and the frontier model compares the attempt with a known successful solution, finds where it first went wrong, and edits the skill. No weights change; the authors frame this as reinforcement learning done in text (abstract). They report that with SKILLER's skills Qwen3.5-9B scores 4.4 points above Claude Opus 4.7 Max using curated skills on SkillsBench's single-skill tasks (SkillsBench: agent tasks paired with skills), at 167 times lower output-token price (Fig. 1). SKILLER outperforms four skill-writing methods across five benchmarks, they report (abstract). They present it as filling a gap: "there are currently no skill generation methods specifically tailored to" small models (§ "Related Work").

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [reinforcement learning](#/glossary/reinforcement-learning) (in the paper's own sense, below) · [experience replay](#/glossary/experience-replay) · [actor–critic](#/glossary/actor-critic)

**The paper's own terms:**
- **skill**: one per task, "an executable language artifact that specifies a prescriptive procedure, concrete tool calls and paths, output contracts, and, when beneficial, task-local helper scripts" (output contracts: the required output format and files) (§ "Natural-Language Skill Optimization").
- **small-scale LVLM, compact model**: the frozen small model that runs the skill; LVLM stands for Large Vision-Language Model (§ "Introduction").
- **model-mismatch problem**: frontier-written skills assume reasoning and error recovery a small model lacks, so it may "hallucinate arguments, skip essential verification steps, or become derailed by overly complex instructions" (§ "Introduction").
- **language-level reinforcement learning**: the skill text plays the policy, the small model's agent loop the environment, the official verifier gives the reward, and every signal and update is text, with no weight updates (§ "Method"). In the glossary's terms, close to [reflective prompt optimization](#/glossary/reflective-prompt-optimization) of a skill (ours).
- **actor and critic**: two prompts to the frontier model: the critic diagnoses the attempt and writes edit suggestions, the actor edits the skill (Eqs. 6–7).
- **reference trajectory**: "privileged evidence about a successful solution process", "never provided as a runtime input to the compact model" (§ "Problem Definition").
- **state**: the task, the attempt's trajectory, the reference trajectory and the verifier's diagnostics, e.g. per-test outcomes (Eq. 5).
- **reward**: the verifier's score from 0 to 1, binary success on pass/fail benchmarks and the normalized test pass rate when partial credit exists (§ "Natural-Language…").
- **replay memory**: a textual history of failure signatures, critic summaries, and accepted edits with their outcomes (§ "Natural-Language…").
- **zero-shot, out-of-distribution generalization**: here, scores on the held-out half of GAIA or EarthBench, "unseen instances from the same benchmark" (App. D; § "Zero-Shot Results and Analysis").

**Builds on:**
- The agent-skill format, citing Anthropic's documentation and SkillsBench ([SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)")) (§ "Introduction").
- The methods compared first (§ "Experimental Setup"): EvoSkill ([EvoSkill](#/papers/alzubi2026evoskill "EvoSkill: Automated Skill Discovery for Multi-Agent Systems (2026)")) and SkillX, which learn from successful agent rollouts, AutoSkill, which learns from interaction histories (§ "Related Work"), and the closed-source Manus system's skills (Manus: a commercial AI agent product).
- Skill acquisition and evolution work, e.g. Voyager ([Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")) and Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), which the authors call "predominantly optimized for massive frontier models" (§ "Related Work").

## Problem and setting

- **Question:** for a fixed small model, find the skill that maximizes the expected verifier reward on a task (§ "Problem Definition", Eq. 3).
- **Models:** Qwen3.5-9B and 4B in the skill-executing agent loop of OpenCode, an agent harness (§ "Introduction"); GPT-5.4 as actor and critic "exclusively during the offline skill-generation phase", with the small models' tokens left out of reported generation costs (§ "Experimental Setup").
- **Benchmarks** (§ "Experimental Setup"; App. D): SkillsBench (agents using task-paired skills across domains), 26 tasks each solvable with one skill; SWE-Skills-Bench (software-engineering tasks scored by execution-based tests), 117 instances under 10 skills, kept where the original benchmark reports that adding a skill changes performance; SkillLearnBench ([SkillLearnBench](#/papers/zhong2026skilllearnbench "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks (2026)"), continual skill generation), 100 verified instances; GAIA (multi-step information seeking), 165 validation tasks; EarthBench (Earth-science and data-processing workflows), 248 samples.
- **What generates the skill:** for the first three, "a single instance from each task is used to generate the corresponding skill before evaluating across all instances of that task"; GAIA and EarthBench are each one task, a stratified half (83 and 124 instances) generates the skill, and the other half gives "additional zero-shot test performance" (§ "Experimental Setup"; App. D).
- **Baselines:** no skill; AutoSkill, EvoSkill, SkillX; Manus-generated skills; human-authored skills "only when officially provided by the benchmark" (§ "Experimental Setup").
- **Protocol:** scores average three runs of the same skill; SKILLER uses "a five-step reinforcement learning schedule across all tasks" (§ "Experimental Setup"). App. E's released SkillsBench configuration runs three optimization rounds, with at most 30 tool steps per attempt.

## Approach

- **The loop** (§ "Natural-Language Skill Optimization", Fig. 2). Step 0 builds a skill with "a coarse execution workflow" (App. E: by refining the baseline skill with the task instruction and reference trajectory). Each step then:
  1. The small model runs the task under the skill (observe, act with a tool, read, reflect); the verifier returns reward and diagnostics.
  2. The critic (Eq. 6) reads the state, reward, skill and memory and contrasts the attempt with the reference "to locate the earliest causal divergence". It sorts the cause (missing guidance, tool misuse, output-contract violations, "non-actionable infrastructure failures"), marks content that works, and writes localized edit instructions.
  3. The actor (Eq. 7) applies Insert, Replace, Create and Delete edits to the skill bundle (the skill's folder of instructions and scripts), keeps what works, and may write deterministic helper scripts "when a small-scale LVLM would struggle with a long or error-prone procedure"; reference evidence is "never introduced as a direct runtime dependency or a precomputed answer".
  4. The memory stores the diagnosis, then the edit and its outcome.
- **Guards** (App. E): an update "is rejected if it directly uses oracle solver content" (the benchmark's reference solution); snapshots are saved every round, and the system "restores the most recent passing snapshot when a later update causes failure".

## Results

The authors report (three-run averages):
- **Main table** (Tab. 1): with Qwen3.5-9B, SKILLER is best or tied best on all five benchmarks, e.g. SWE-Skills-Bench 82.80 against 62.40 for Manus-generated skills and 26.20 with no skill. With 4B, Tab. 1 marks it best on SkillLearnBench and SWE-Skills-Bench, tied with Manus on EarthBench, and marks SkillX best on SkillsBench and GAIA. The authors call this "superior overall performance across both model scales" and see the model-mismatch problem in human-authored and Manus skills, which "frequently yield suboptimal gains or even degrade performance compared to standard automated evolution baselines" (§ "Main Results and Analysis").
- **Smaller beats larger:** on SWE-Skills-Bench, Qwen3.5-4B with SKILLER scores above Qwen3.5-9B with any other skill source (§ "Main Results…").
- **Against frontier models** (Fig. 1, SkillsBench single-skill tasks): Qwen3.5-9B with SKILLER sits 4.4 points above Claude Opus 4.7 Max with curated skills at 167 times lower output-token price; 4B with SKILLER sits below Claude Haiku 4.5 with curated skills.
- **Zero-shot halves** (Tab. 2): with 9B, SKILLER is best on GAIA and EarthBench; with 4B, best on GAIA and below Manus and AutoSkill on EarthBench. On 4B GAIA, Manus and SkillX skills fall below no skill, which the authors explain as "verbose domain context frequently triggers cognitive overload" (§ "Zero-Shot Results and Analysis").
- **Learning dynamics** (Fig. 3; § "Learning Dynamics"): on SWE-Skills-Bench both models gain over all five steps; on SkillLearnBench both converge within two. Tab. 8 (9B, SkillLearnBench) has step 2 best and later steps lower, all above the strongest baseline (App. G).
- **Skill structure** (Tab. 3, SkillsBench): SKILLER's skills are shorter than human-authored, AutoSkill and EvoSkill ones and hold the most scripts and code, which the authors read as moving procedure "from natural language into deterministic external tools" (§ "Structural Analysis…").
- **Cost** (Tab. 4, 9B, five benchmarks, GPT-5.4 prices): SKILLER spends $8.95 for an average score of 62.86, SkillX $14.55 for 52.60; AutoSkill and EvoSkill cost less and score lower.
- **Ablations** (9B on SkillsBench, SWE-Skills-Bench and GAIA; App. A–C, Tabs. 5–7): dropping the task instance or the current trajectory from the state hurts more than dropping the reference or the diagnostics, "particularly on SkillsBench and SWE-Skills-Bench", and dropping the reference hurts more than dropping diagnostics; the critic's edit-writing step matters most among its steps; among actor steps, removing helper scripts hurts most on SkillsBench and SWE-Skills-Bench (SWE-Skills-Bench 82.80 to 52.30, Tab. 7).

## Limits the authors state

- The SWE-Skills-Bench subset was chosen where skills have a measurable effect, so "its results should not be interpreted as estimates over every task in the original benchmark" (App. D).
- "procedural constraints cannot substitute for missing factual knowledge or complex mathematical reasoning during multi-hop retrieval" (§ "Main Results…"); GAIA's smaller sensitivity "suggests a boundary of prompt based skill repair"; one plausible explanation, they say, is that such tasks fail because evidence was not found, and "A critic can reshape the search policy, but it cannot supply missing facts." (App. B).
- The non-monotonic SkillLearnBench steps are "consistent with localized edits that repair a sampled failure while occasionally narrowing instructions that remain useful for other instances", so "the final update need not be the most transferable policy"; "The optimal stopping step can also vary with the benchmark and executor" (App. G).
- Tab. 8 gives per-step token use, so it "characterizes the efficiency of individual updates rather than the total expense of the full optimization trajectory"; Manus is left out "because its token usage is unavailable" (App. G).
- The skill-evolution case study "is qualitative rather than a standalone measure of average behavior" (App. F).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** code: "The project is available at" its GitHub repository (abstract); the critic and actor prompts in Figs. 4–5 are "drawn from the released implementation" (captions), and App. E describes "The released SkillsBench configuration".
- **To reuse it:** a frontier model as actor and critic (GPT-5.4 here; § "Experimental Setup"); per task, a reference trajectory of a successful solution and a verifier returning a score and diagnostics (§ "Problem Definition"); the small model in a tool-using agent loop; skill-generation cost as in Tab. 4; App. E's settings.

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
