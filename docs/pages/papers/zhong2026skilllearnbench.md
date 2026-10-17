# SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks

**SkillLearnBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.20087) · [arXiv](https://arxiv.org/abs/2604.20087)  
Code: [SkillLearnBench](https://github.com/cxcscmu/SkillLearnBench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark for methods that have an LLM write agent skills from one seed instance of a task: 20 tasks, each with a deterministic pass/fail verifier, several instances that vary its parameters, and human-authored reference skills; every instance must be passed in at most half of 10 runs without skills and at least once by the same or a stronger LLM with the human-authored ones (abstract; §3.1, Eq. 1; §3.3).
- Compares One-Shot, Self Feedback, Teacher Feedback (a teacher that sees the human-authored skill gives hints after failures) and Anthropic's Skill Creator, each with six Claude and Gemini models writing the skills, all run by one solver (Claude Sonnet 4.6); scores skill quality and trajectories with a GPT-5-mini judge and outcomes with the verifiers (§3.2–3.3, §4.1).
- Evidence on LLM-written skills judged by verifiers rather than a judge: the authors report that generated skills beat no skills but "even the best method covers only about 45% of the gap between no-skill and human-authored performance" (§1), that stronger writer models don't reliably write better skills (§4.2), and that in four-round runs on one category self-feedback drifts while teacher feedback keeps gaining (§5.4, Fig. 4).

## In plain words

Agents can load skills: documents of instructions, workflows and know-how for a kind of task. The authors argue that for agents facing new tasks "pre-built skills will inevitably fall short", and that skill-generation methods were proposed "in various different settings" (§1). They build SkillLearnBench, which they call "the first benchmark for evaluating continual skill learning methods" (abstract): 20 tasks, each checked by a program and given in several variants, that a fixed agent passes at most half the time without skills but can solve with human-written ones; a skill written from one variant is tested on all (§3.1). They compare four skill-writing methods, each with six Claude and Gemini models writing and one fixed agent solving (§4.1). They report that all four beat no skills, but "even the best method covers only about 45% of the gap between no-skill and human-authored performance", and that stronger writer models don't reliably help (§1, §4.2). In four-round runs on one task category with Claude Sonnet 4.6, hints from a teacher model that sees the human-written skill keep raising accuracy, while self-revision drifts (§5.4).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [procedural memory](#/glossary/procedural-memory) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation). In the glossary's terms, the solver finds its skills by [progressive disclosure](#/glossary/progressive-disclosure): skills are copied into its skill directory and it invokes them "through its built-in Skill tool" (App. N.1).

**The paper's own terms:**
- M.1).
- **continual learning**, as this paper uses it: not weight updates but a "generate-store-reuse cycle" in which agents write skills from their experiences and reuse them (§1, §2), "a non-parametric approach to continual learning" without "the risk of catastrophic forgetting" (§3.3).
- **task, instance, seed instance**: a task is "a multi-step, verifiable procedural problem with multiple solvable instances" (§3.1); instances vary input data, numbers or wording; every method gets the task instruction and one seed instance, and the skill it writes is tested on all instances (§3.1, §3.3).
- **skill-dependent**: for every instance, a fixed agent run 10 times without skills passes at most half the time, and the same or a stronger LLM with the human-authored skills succeeds at least once (§3.1, Eq. 1).
- **human-authored skills**: the reference skills, for adapted tasks taken from SkillsBench, some refined by the authors (rewritten to target the task's bottleneck, unused ones removed, frontmatter rewritten so agents find them) (App. K.3).
- **oracle trajectory**: the trace of an agent that solves the instance with the human-authored skills (§3.2.1).
- **key points**: atomic, task-essential units of knowledge (a step, a rule, a usage pattern) that an LLM extracts from the instruction, the human-authored skills and the oracle trajectory (§3.2.1; App. L.1.1).
- **Patterns A, B, C**: skills with instructions only, plus scripts, or plus MCP (Model Context Protocol tool servers) or subagents, after Takeda (2026) (App. B).

**Builds on:**
- SkillsBench ([SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)")), which "measures whether providing a skill improves agent accuracy" (§2): 17 of the 20 tasks are adapted from it, and One-Shot follows its setup (§3.1, §3.3).
- The taxonomy of community skill usage by Ling et al. (2026), from which the categories and sub-domains come (§3.1).
- The methods it adapts: SkillRL (Xia et al., 2026) (reinforcement learning that co-evolves a skill library) for Self Feedback, the teacher-guided paradigm of Huang et al. (2025) for Teacher Feedback, and Anthropic's Skill Creator pipeline (§3.3).
- It contrasts itself with skill benchmarks that "treat skills as evaluation objects and rely on binary pass/fail outcomes" (§2): SkillsBench, LangChain's evaluations and Tessl's (with-versus-without comparisons of single skills).

## Problem and setting

The question: how well do current methods learn skills, and do failures come from the skill or from how the agent executes it (§1)?

- **Tasks:** 20 tasks, 100 instances, in six categories and 15 sub-domains (Tab. 1). Tasks an agent solves reliably without skills are filtered out (App. K.1–K.2). Instances vary wording, parameters, constraints or input data (App. K.4).
- **Correctness:** a task's test script runs once the agent stops; an instance passes only if all its test cases pass (App. N.2).
- **Methods:** One-Shot (write 1–5 skills in one pass, then solve), Self Feedback (one round of self-review of its own trajectory), Teacher Feedback (up to two rounds of hints, each after a failed attempt) and Skill Creator (structured skill-authoring guidance, single round) (§3.3, §4.1; App. M).
- **Models:** six skill writers, Claude Haiku 4.5, Sonnet 4.6, Opus 4.6 and Gemini 3.1 Flash Lite, 3 Flash, 3.1 Pro (three tiers per family, smallest first); one solver, Claude Sonnet 4.6 at temperature 0, for up to 100 turns in a Docker sandbox (an isolated container) with a 1,800-second timeout (§4.1; App. N.1). Teacher Feedback's default configuration uses Sonnet 4.6 as student and teacher (App. M.3); whether the teacher changes with the writer model is not discussed.
- **Judge:** GPT-5-mini (OpenAI's small model) scores Levels 1 and 2 (skill quality and trajectory) (§4.1).
- **Runs:** one trial per instance, checked by three-trial reruns of one instance per task (App. E).

## Approach

**Three evaluation levels** (§3.2), all scaled to 0–100 "unless otherwise noted":
- **Level 1, skill quality** (without running the skill): coverage, the share of key points the judge labels "mentioned" in the generated skills (partial coverage counts as missing); executability, averaging completeness, consistency, determinism (precise, unambiguous instructions) and usability (generalizing across instances); safety on six risk dimensions, higher meaning lower risk (§3.2.1; App. L.1).
- **Level 2, trajectory:** alignment with the oracle trajectory (key-point recall, execution order, completeness) and usage rate, the share of generated skills the agent invokes, detected from its skill tool calls (§3.2.2; App. L.2).
- **Level 3, outcome:** accuracy, averaged over each task's instances and then over tasks, and solving tokens (§3.2.3, Eq. 2).

**Teacher Feedback** gives the teacher the task instruction, the student's skill, the failure context and the human-authored skill; it "is restricted to giving concise modification suggestions only and is not allowed to reveal the full solution directly" (App. M.3). For Self Feedback only the final-round solution is scored (App. M.2).

N.1).

## Results

- **Main comparison (Tab. 2, §4.2):** the authors report that, averaged over the six writer models, accuracy is 27.33–31.08 for the four methods, against 10.17 with no skill and 74.50 with human-authored skills. Self Feedback is best on average and uses the fewest tokens, One-Shot close behind; Teacher Feedback has the lowest usage, "meaning its generated skills are most frequently ignored by the solving agent".
- **Writer models (§4.2; App. C, Fig. 5):** rankings shift across models and families; "stronger LLMs do not reliably produce better skills". From a case study the authors find that stronger models "tend to produce skills that are more precise but more prescriptive", hardcoding parameters, which can help when conditions match but "overconstrains the solving agent when task instances vary" (App. C, Fig. 6).
- **Categories (Tab. 3, §5.1):** the largest gains come in categories "with clear workflows, such as Software Engineering and Productivity Tools"; open-ended or instance-specific categories show smaller gains "and sometimes regress"; no method leads in every category.
- **Reusability (§5.2, Fig. 2):** most skills pass some instances, fail others; held-out accuracy is "comparable to, or even slightly better than" seed accuracy, so the authors locate the bottleneck not in overfitting but in skills that "fail to capture the core task logic".
- **Behavior (§5.3, Fig. 3):** the authors report shorter trajectories with Self Feedback; higher coverage but lower adoption and longer execution with Teacher Feedback; and Skill Creator's skills invoked most while its accuracy lags.
- **Rounds (§5.4, Fig. 4):** extended to four rounds on Productivity Tools with Claude Sonnet 4.6 writing, Self Feedback's alignment declines and its accuracy rises once then falls sharply, while Teacher Feedback's accuracy grows through round 4.
- **More seed instances (App. A, Tab. 4):** for One-Shot on Productivity Tools with Sonnet 4.6, accuracy is 56.67 with one seed instance, 23.33 with three and 27.78 with five.
- **Skill structure (App. B, Tab. 5):** averaged over writer models, at least 98.9% of each method's skills are instructions only, against 64.3% of human-authored skills; 33.3% of all human-authored skills add scripts.
- **Coverage is not accuracy (App. J):** in three case studies, e.g. on video-object-counting the lowest-coverage method (Teacher Feedback) is most accurate, above human-authored skills; the authors trace this to its skills hardcoding working parameters (Tab. 13).
- **Judge stability (App. L.3, Tab. 16):** two scoring runs on three tasks agree with Spearman ρ = 0.76 (executability) and 0.61 (safety).

## Limits the authors state

The paper has no limitations section; these caveats are scattered:
- Across three trials, accuracy "fluctuates more (std 13–17% for generated methods)" than alignment, though the authors conclude "single-trial evaluation provides reliable method comparisons" (App. E).
- The instance-count finding holds "at least for One-Shot generation" (App. A).
- Safety scores are near saturation for two dimensions, "offering limited differentiation" (App. H); the judge's lower safety agreement is "consistent with ceiling scores on several safety scores" (App. L.3).
- For the low completeness and determinism scores the authors offer a hypothesis: "We hypothesize that this is because the generated skills tend to rely on high-level concepts" (App. G).
- "coverage alone is an incomplete proxy for skill utility" (App. J, Case 2).
- Their category results suggest "that a rigid skill can hurt when the task does not match the learned template" (§5.1).

## Open problems and building blocks

- **Open:** the findings "suggest that advancing skill generation requires moving beyond specification richness" towards two properties current methods lack, "grounding skills in the core task logic and ensuring they are reliably adopted and followed by agents in practice" (§6); generated skills "rarely produce the executable artifacts present in human-curated skills, highlighting structural diversity as a promising direction for future work" (App. B).
- **Released:** "Our data and code" "are open-source to enable further studies of automatic skill generation and continual learning techniques" (abstract, with its footnote); App. M.3 refers to "the released implementation".
- **To reuse it:** Docker, with one image per task (App. N.1); the solver is Claude Sonnet 4.6 and the judge GPT-5-mini (§4.1); a solving run is capped at 100 turns and 1,800 seconds (App. N.1).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
