# From Raw Experience to Skill Consumption: A Systematic Study of Model-Generated Agent Skills

**From Raw Experience to Skill Consumption** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.23899) · [arXiv](https://arxiv.org/abs/2605.23899)  
Code: [SkillLens](https://github.com/microsoft/SkillLens)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures whether one domain-level skill that an extractor model distills from a target model's own trajectories helps that target on held-out tasks, for five extractors, six targets and five agentic domains (ALFWorld, SpreadsheetBench, SWE-bench-Verified, SEAL-0, BFCL-v4 multi-turn) (abstract; §4.1, Tab. 1).
- A deliberately minimal extractor (per-trajectory success and failure patterns, merged level by level into one skill placed in the target's system prompt, §3.2, §4.1), scored as the change against no skill averaged over three runs (§4.1), then per extractor (Extraction Efficacy) and per target (Target Evolvability) (§3.3); follow-ups vary the pool's success ratio, the skill's format and the consuming model and test an LLM judge of skill texts (§5), and add a rubric of three utility-validated dimensions to the extractor's prompt as a "meta-skill" (§6).
- Who writes the skill, measured across writers and readers: the authors report that 25% of extractor–target entries lower the target's score (§4.2), that a strong executor is not necessarily a strong extractor (§4.2), and that an unguided GPT-5.4 judge picks the more useful of two skills no better than chance (§5.2); Qwen3.5-9B is a target only, since it "cannot reliably follow the structured extraction protocol" (§4.1). Each skill is distilled once from the target's own pool and used with no check of its utility before use; only its schema and length are validated (§3.1, §3.2, App. B.3; our reading).

## In plain words

Agents increasingly reuse skills: short written procedures, distilled from earlier attempts and put into the prompt at run time. The authors say methods that generate skills keep multiplying, but no comprehensive study covers the whole lifecycle, from collecting an agent's attempts to writing the skill to using it, to ask whether such skills work (abstract; §1). They let one model (the extractor) write a single skill from a target model's own attempts on half of a benchmark's tasks, give it back to that target, and measure the change on the other half: five extractors, six targets and five agent benchmarks (§4.1). They report that the skills help on average, yet a quarter of the extractor–target entries lower the score, and that a strong model is not necessarily a good skill writer (§4.2). Shown two skills with no evaluation criteria, a GPT-5.4 judge picks the more useful 46.4% of the time, "indistinguishable from random" (§5.2). Calling it a systematic study, the authors turn its findings into three quality criteria for the writer's prompt, which beat the unguided prompt in all nine settings (§6).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [negative transfer](#/glossary/negative-transfer) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [rubric](#/glossary/rubric) · [progressive disclosure](#/glossary/progressive-disclosure) · [tool calling](#/glossary/tool-calling-function-calling) · [agent harness](#/glossary/agent-harness) · [Friedman test](#/glossary/friedman-test) (task instances as blocks, skill formats or extractors as treatments, App. C; §5.2)

**The paper's own terms:**
- **skill lifecycle**: experience generation (the agent runs tasks, its trajectories are logged), skill extraction (knowledge is distilled from them) and skill consumption (the skill is used at inference) (§1).
- **domain-level skill**: an artifact, or a coordinated set, packaging a domain's recurring procedures for new tasks in it, "rather than per-task optimization" (§1). The main experiments use one skill per extractor, target and domain (§4.1), with a default cap of 3,000 characters (App. B.5, Tab. 7).
- **target and extractor**: the target both generates the experience and consumes the skill; the extractor, "(possibly different)", writes it (§3.1).
- **experience pool**: the target's task, trajectory and outcome records on the experience-generation split, "containing both successful and failed trajectories" (§3.1).
- **success and failure patterns**: what the extractor writes per trajectory: strategies that led to completion, or error modes and pitfalls (§3.2).
- **Δ (the skill's gain)**: the target's held-out score with the skill minus without it, in percentage points, averaged over three runs (§3.3, Eq. 3; §4.1); below zero is negative transfer (§3.3).
- **Extraction Efficacy (EE)** and **Target Evolvability (TE)**: per domain, Δ averaged over all targets for one extractor, and over all extractors for one target (§3.3, Eqs. 4–5).
- **strong-pool and weak-pool skill**: two SpreadsheetBench skills by GPT-5.4-mini, from the pool of the strongest-baseline target (GPT-5.4) and of the weakest (Qwen3.5-9B) (§5.3).
- **plausibility, raw and validated rubrics; better-rate**: the plausibility rubric is seven criteria GPT-5.4 lists when asked directly, such as clarity and conciseness (App. H.1, Tab. 12); the raw rubric is seven dimensions an automated pipeline draws from skill pairs with very different gains (App. H.2, Tab. 13); a dimension's better-rate is the share of pairs where the higher-gain skill is judged better on it; the three that "consistently align with utility" form the validated rubric (§6).
- **meta-skill**: the validated rubric as "a generation-time prior inserted into the extractor's system prompt" (§6).

**Missing glossary terms:** none.

**Builds on:**
- Trace2Skill [9]: the extraction framework borrows its two-stage structure but drops "its sub-agent fleet, conflict resolution, and skill-deepening mechanisms" (§3.2).
- Benchmarks of skill consumption: SkillsBench [11] ([SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)")), with "task-seeded, human-authored skills", and SWE-Skills-Bench [12] and Skills-in-the-Wild [13], with skills from public repositories; all leave extraction "outside the loop" (§1; §2).
- SkillCraft [14], "Most closely related to our setting": it extracts skills as compositions of atomic tools, restricted to "executable function compositions" (§1; §2).
- The Agent Skills open standard, for the skill schema (§3.2, footnote).

## Problem and setting

- **Questions** (§1): do model-generated, domain-level skills "reliably benefit downstream agents across targets, extractors, and domains" (RQ1); what drives a skill's utility at each lifecycle stage (RQ2); can the findings become "a concrete, drop-in improvement to skill extraction itself" (RQ3).
- **Protocol:** each benchmark's tasks are split 1:1 into an experience-generation split and a held-out test split (sampled from an official training split where one exists), shared by all extractor–target pairs (§4.1; App. B.2). The skill goes into the target's system prompt (§4.1). The authors call this "extractor-assisted single-step evolution" (§3.1).
- **Benchmarks** (§4.1): ALFWorld (embodied household tasks), SpreadsheetBench (spreadsheet manipulation), SWE-bench-Verified (real software-engineering tasks ending in a patch), SEAL-0 (web-search question answering) and BFCL-v4 (tool calling; its multi-turn subset).
- **Models** (§4.1): GPT-5.4, GPT-5.4-mini, Gemini-3.1-Pro, Gemini-3.1-Flash-Lite, Qwen3.5-35B and Qwen3.5-9B, all six as targets; Qwen3.5-9B is not an extractor, since in preliminary experiments it "cannot reliably follow the structured extraction protocol".
- **What counts as correct:** "the domain-specific task metric" of each benchmark (§3.3); how each domain is scored is not discussed further. §6 does not name the extractor of the meta-skill runs.

## Approach

- **Extraction** (§3.2; App. B.3, Tabs. 2–4): "intentionally minimal structure: no domain-specific heuristics, filtering rules, or optimization tricks". Per-trajectory analysis writes up to K patterns per trajectory (Eq. 1); hierarchical consolidation merges pattern sets in groups, deduplicating and generalizing, until one set remains (Eq. 2); skill synthesis turns it into a skill through tool calls with schema validation and a character budget.
- **Lifecycle analyses** (§5):
  - pools with five success ratios, from all-success to all-failure, their skills written by GPT-5.4-mini and scored on three domains with three targets (§5.1);
  - one SpreadsheetBench skill rewritten into four formats (ordered list, unordered list, checklist, prose), compared with a Friedman test (§5.2; App. C);
  - a GPT-5.4 judge choosing the better of two skills for the same target and domain, on 151 pairs whose gains differ by more than 0.5 points, by majority of nine votes (§5.2; App. E);
  - the strong- and weak-pool skills given to all six targets, and the trajectories of GPT-5.4 and Qwen3.5-9B inspected (§5.3; App. D).
- **Meta-skill** (§6): GPT-5.4 lists how the better skill of each high-gap pair beats the worse one, and the differences are merged into the raw rubric, from 17 pairs (App. H.2). Pairwise evaluation keeps Failure Mechanism Encoding ("identifies why agents fail, not just that they fail"), Actionable Specificity (step-level procedures naming domain objects or tools) and High-Risk Action Blacklist ("forbids specific harmful action patterns") (Tab. 13). This validated rubric is tested as the judge's criteria, and as the meta-skill against the unguided extractor prompt and the plausibility rubric.
- **Robustness check** (App. F, Tab. 10): a subset of conditions rerun on SpreadsheetBench in the agentic harnesses Claude Code (Opus 4.6, Sonnet 4.6) and Codex (GPT-5.4, GPT-5.4-mini).

## Results

- **Main matrix** (§4.2, Tab. 1): the authors report that skills improve 75% of entries while 25% have negative Δ, lowest on SpreadsheetBench and SWE-bench-Verified (13%), highest on ALFWorld (47%); "positive average gains mask a substantial risk of negative transfer".
- **Writer against executor** (§4.2): on SpreadsheetBench "the lightweight Gemini-3.1-Flash-Lite achieves the highest" EE, while GPT-5.4 ranks last "despite having the strongest baseline among the targets"; the authors call choosing an extractor "a compatibility problem between extractor, target, and domain".
- **Target-dependent gains** (§4.2): on ALFWorld GPT-5.4 gains from all five extractors, while Gemini-3.1-Flash-Lite, Qwen3.5-35B and Qwen3.5-9B "all have negative" TE.
- **Experience** (§5.1, Fig. 2): the best mix is domain-specific: SpreadsheetBench favours more successes, SWE-bench-Verified peaks with a mostly successful pool, ALFWorld does best with failure-heavy pools; "all-failure pools consistently perform worst". The Finding box hedges: skill quality "appears to be largely influenced by" the mix.
- **Format** (§5.2; App. C, Tab. 8): on SpreadsheetBench, format is non-significant on every target (all p > 0.34), while swapping the extractor is significant on 5 of 6 targets (p < 0.01).
- **Judging skill text** (§5.2, Fig. 3): the unguided judge's accuracy falls as the gap between the skills grows; on pairs at least 5 points apart it picks the better skill "only 15.8% of the time".
- **Consumption** (§5.3, Fig. 4; App. D): with the skill text fixed, per-target gains "differ sharply"; the strong-pool skill improves every target, the weak-pool one causes negative transfer on some (e.g. GPT-5.4). In the two targets inspected, skill consumption "reshapes the default policy": it often moves GPT-5.4 from writing formulas to computing values in Python, and makes Qwen3.5-9B more likely to follow a workbook-native workflow (editing the workbook in place, not via a dataframe), whose gain in structure "sometimes comes with a drop in robustness".
- **Meta-skill** (§6; Fig. 5; App. G, Tab. 11): the validated dimensions have better-rates of 64–66%. With them the judge's overall accuracy on the same 151 pairs rises from 46.4% to 73.8%. As extractor guidance, against the unguided prompt, the plausibility rubric averages −0.59 points (worse in 6 of 9 cells) and the validated rubric +1.55, better in all nine: three targets on ALFWorld, SpreadsheetBench and SWE-bench.
- **Other harnesses** (App. F, Tab. 10): "modest positive gains on average" with "substantial variance across targets"; with GPT-5.4's skills the stronger targets gain, while the weakest, Codex with GPT-5.4-mini, "shows no benefit".

## Limits the authors state

- "Our experimental design intentionally favors interpretability over coverage": one domain-level skill per target, given directly in the system prompt, so the change can be attributed to the skill rather than "retrieval policies, agentic scaffolding, or other confounding components in the pipeline" (App. A). They view the extensions below "as complementary to the present study rather than as gaps in it" (App. A).
- The qualitative skill pair of §5.2: "We treat this as motivation" (§5.2).
- Skills that raise task success "can be repurposed for misuse", and skills from imperfect pools "may carry over biases or unsafe shortcuts from those traces" (App. A, "Broader impact").

## Open problems and building blocks

- **Open:** "scaling to richer agent harnesses (for example, with retrieval, planning, or tool-use scaffolds)", and "scaling to substantially larger skill libraries containing many fine-grained skills, where additional questions of skill selection, composition, and interference become first-class concerns" (App. A); "evaluating skill safety in richer agentic harnesses and at larger library scales" (App. A, "Broader impact").
- The paper reproduces its prompts (App. B.3–B.4; App. E) and rubrics (App. H).
- **To reuse it:** API access to the GPT and Gemini models, and vLLM on "a single node equipped with 8 NVIDIA B200 GPUs" for the open models (App. B.2, B.6). The authors say the meta-skill plugs into "any extractor's system prompt without modifying the underlying extraction pipeline" (§6).

## On this site

- **Discussed in:** [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
