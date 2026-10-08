# Dynamic Agent Skills: A Lifecycle Survey and Taxonomy of Evolving Skill Libraries

**Dynamic Agent Skills** · TMLR 2026

Read: [PDF](https://arxiv.org/pdf/2607.10113) · [arXiv](https://arxiv.org/abs/2607.10113)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Surveys how LLM agents' skill libraries (code functions, natural-language instructions, SKILL.md packages, workflow graphs, learned adapters) change over time, across what it calls a 124-paper 2023–2026 audit set (abstract; §2.1).
- A taxonomy of what papers call a "skill", a lifecycle architecture from evidence acquisition through verification/admission to maintenance and governance, and an operator vocabulary for library edits (§1.3); evidence-graded patterns drawn from the audit (§9).
- A map of where checks gate a library: the author calls the line between candidate and admitted skills "the most important boundary in the lifecycle" (§5.2) and names admission, verifier quality and maintenance/repair as the strongest patterns among the primary skill systems (§9), while calling most conclusions "architectural rather than causal" (§13).

## In plain words

LLM agents increasingly keep reusable procedures outside the model, often called skills: code functions, written instructions, SKILL.md folders (instructions with optional code), workflow graphs or small trained add-ons to the model that a later agent can look up and run (abstract). The author argues the bottleneck is also whether an agent can reuse procedures across recurring tasks "instead of re-deriving the same strategy inside every context window", while many libraries are still treated as static, written once and rarely revised (§1). This survey asks how skill libraries change over time, across a 124-paper audit set from 2023–2026 (abstract; §2.1). It offers a split of six things papers call a skill, an eight-stage lifecycle from gathering evidence through checking and admitting a skill to repair and governance, and a record format with ten named kinds of library edit (abstract). It draws seven patterns, each with a qualitative evidence grade; restricted to the primary skill systems, it names admission, verifier quality and maintenance/repair as the strongest (§9). It presents itself as a "taxonomy-driven survey" narrower in focus than prior surveys (abstract; §1.2).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [progressive disclosure](#/glossary/progressive-disclosure) · [LoRA](#/glossary/lora-low-rank-adaptation) · [reinforcement learning](#/glossary/reinforcement-learning) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Pareto front](#/glossary/pareto-front)

**The paper's own terms:**
- **skill** (§1): "a reusable procedure that an agent can call later", broader than the glossary's agent skill entry (the SKILL.md text form). Six senses (Tab. 1, §3.1): executable code; natural-language (NL) heuristic, a short lesson injected at retrieval time; SKILL.md package (routing metadata, instructions, optional code); parametric, e.g. a LoRA adapter; memory/trajectory (stored episodes); and capability label, grouped with registry-retrieved skills. By default "skill" means the first four; the last two are boundary cases (§3.1).
- **dynamic library** (§1.1): a skill collection whose contents or organization can change as evidence accumulates. "Retrieval changes the context; dynamic update changes the store" (§5.3).
- **skill record** (§3.2, Eq. 2): the four-tuple of Jiang et al. (2026b) (Eq. 1: applicability, policy, termination, interface) plus an edit field, a verification field (the check a candidate can pass before entering) and lineage (which version supersedes which). The author calls the notation "a comparison scaffold, not a separate model of skill learning" (§3).
- **operators** (§3.3): ten kinds of library edit: Add; Refine (content, same interface); Merge; Split; Prune (remove or quarantine); Distill (compress trajectories into a skill); Abstract (lift a procedure to a template); Compose (chain skills); Rewrite (body and possibly interface); Rerank (changes only which skills retrieval favours). Each library step applies a set of them, chosen from a trigger (e.g. task end) and a learning signal (e.g. reward) (Eq. 4).
- **admission** (§5.1): the gate a candidate passes to enter the library, as mature, tentative, quarantined or rejected.
- **two-timescale** (§3.3, §7.4): a fast loop edits external skills after tasks; a slow loop distills selected behaviour into adapters, weights or shared stores.
- **Distillation into compact models**, two senses: the Distill operator (§3.3), and the stage "Distillation into compact models and portability", moving knowledge between external artifacts, weights, agents, users or domains (§5.1).
- **evidence grades** (§2.5, App. A.2): A, several controlled ablations or one clean ablation plus independent corroboration; B, one controlled study or a strong benchmark or deployment measurement; C, convergent benchmark behaviour without a clean causal ablation; D, architectural corroboration only. They are "qualitative audit labels, not statistical confidence intervals" (App. A.2).
- **usage versus utility** (§8.1, §9.8): calling a skill, against the skill improving the outcome. **Operator velocity** (§8.2): counts of each edit kind per task or per dollar.
- **PPVH**: a family of executable libraries with execution-grounded admission (§6.1). §9.1 names its "practice + verify" phases; the acronym is not expanded.

**Missing glossary terms:**
- **options framework** (§3.2): from Sutton et al. (1999), a skill as a temporally extended action: a set of states where it can start, a policy, and a termination condition.

**Builds on:**
- Sutton et al. (1999), the options framework, as starting point (§2.6, §3.2).
- Jiang et al. (2026b), a systematization-of-knowledge (SoK) paper on agentic skills, whose four-tuple the skill record extends (§3.2).
- Voyager ([Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")) and LATM ([Large Language Models as Tool Makers](#/papers/cai2023toolmakers "Large Language Models as Tool Makers (2024)")), early code-skill libraries (§1).
- Surveys it calls complementary: Xu & Yan (2026), Fang et al. (2025), Zheng et al. (2025c), Zhou et al. (2026b), on agent skills, self-evolving agents and lifelong agent learning (§1.2, §2.6).

## Problem and setting

- **Question:** "we ask how an externally invocable artifact store changes, verifies, maintains, and governs itself" (§2.6).
- **Scope (§2, §2.2):** papers that treat skill libraries or skill-like external artifacts as dynamic. Excluded unless they produce an externally invocable skill or directly evaluate its lifecycle: classical option discovery, generic tool-use benchmarking and fine-tuning pipelines (§2); also papers whose only adaptation object is weights, prompt optimization, generic tool use or episodic memory without an invocable interface (§2.2).
- **Corpus (§2.1, Fig. 2):** 124 papers (2023: 2, 2024: 0, 2025: 19, 2026: 103), cut off at May 31, 2026 (§2.3), including boundary/context papers not treated as primary causal evidence. Found by database search and backward/forward snowballing (following references and citations), "rather than by a single PRISMA-style query" (§2.2; PRISMA: a systematic-review reporting standard).
- **Evidence (§2.5):** no cross-paper leaderboards "unless the harness is shared".

## Approach

- **Why static libraries fail (§4):** authoring cost, drifting correctness, harder selection as libraries grow, missing provenance, shifting tasks.
- **Lifecycle (§5.1, Fig. 1, Tab. 2):** evidence acquisition, proposal, verification and admission, organization and storage, retrieval and composition, maintenance and repair, Distillation into compact models and portability, governance and provenance; not "a waterfall" (§5.1). The author calls the candidate/admitted line "the most important boundary in the lifecycle" (§5.2).
- **Taxonomy (§6):** nine families (Tab. 3), e.g. executable PPVH libraries, skill-aware RL, skill optimization (e.g. [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), lifecycle benchmarks; Fig. 3 shows which stages each covers. Seven coding fields per system (§6.2) fill Tab. 11 (App. A.3).
- **Mechanisms (§7):** "Growth alone is not learning" (§7.1): mature systems add removing and merging operators. Verifiers (Tab. 4, §7.2): execution gates are "precise but narrow", judge gates broader "but vulnerable to evaluator drift and rubric hacking" (gaming the judge's rubric), rollback gates (revert edits that lower recent-task success, §4) measure regression "only on the probe set". "Two-timescale adaptation is not automatically superior" (§7.4, Tab. 5).
- **Evaluation (§8, Tab. 6):** a proposed protocol reports performance, skill count and retrieval quality over time, operator velocities, a drift condition and a maintenance-off ablation (§8.4).
- **Infrastructure and safety:** which operators each package, storage, market or pipeline choice makes cheap (§10, Tab. 8); eight safety surfaces, e.g. prompt injection through admitted skills (§11.1, Tab. 9).

## Results

No experiments (§2: a literature audit). The seven patterns (§9, Tab. 7), with the author's grades and evidence from cited papers:
- **Admission gates matter** (A/B, §9.1): it reports that removing CoEvoSkills' surrogate verifier (CoEvoSkills evolves multi-file SKILL.md packages, §7.1) drops the pass rate on SkillsBench ([SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)"), which measures skill usefulness, §8.1) from 71.1% to 41.1%. Caveat: some verification is "usually valuable, not that more verification is always better".
- **Verifier quality in skill-aware RL** (B, §9.2): "often one of the most load-bearing choices", specific to skill-aware RL.
- **Flat retrieval often drops at moderate scale** (B/C, §9.3): in Single-Agent-Skills' controlled sweep (many agents' skills compiled into one library), selection accuracy is 92% at 64 skills, 78% at 128, 64% at 256 (Fig. 4). Hierarchical, graph or ontology storage "can push the drop rightward", but "The literature has not shown general removal".
- **Several studies report larger relative gains for weaker backbones** (C, §9.4): "a deployment-facing hypothesis rather than" a comparable effect size.
- **Focused libraries often beat comprehensive ones** (B/C, §9.5): e.g. SWE-Skills-Bench (public software-engineering skills under deterministic tests) reports only +1.2% average pass-rate gain across 49 skills (§8.1).
- **Maintenance becomes load-bearing at moderate-to-large sizes** (B, §9.6): in the TravelPlanner (a travel-planning benchmark) ablation of AutoRefine (a system that maintains SKILL.md-style skills), removing periodic pruning and merging lowers the pass rate from 35.6% to 31.1%, grows the repository 4.5× and cuts utilization from 0.71 to 0.08. Exception: very short horizons.
- **Write-time abstraction usually beats read-time alone** (B/C, §9.7): "cleanest under reasonably stationary tasks".
- **Usage is not utility** (§9.8): in SkillFlow-Bench (166 sequential tasks where agents write and patch skills), Kimi K2.5 (a model) gains only +0.60 points despite 66.87% skill use (§8.1).
- **Safety (§11):** AgentSkills-Wild (a study of public skill registries) reports 26.1% of 31,132 public-registry skills contain at least one vulnerability pattern (§11.1); "The field has attack studies and partial defenses, but few defended lifecycle systems" (§11).

## Limits the authors state

- The corpus is frozen at the cutoff; later work "may change the evidence for individual patterns, especially in registry-scale retrieval and safety" (§13).
- The search is "broad but not exhaustive"; "false negatives are likely", e.g. for non-English papers or papers without the word "skill" (§13). No PRISMA exclusion flow (§2.2).
- The patterns "should not be read as pooled effects" (§9).
- The definition of skill "remains unstable", and the lifecycle framing is "imperfect" for purely parametric, memory-only, multimodal or embodied systems (§13).
- The operator vocabulary is "intentionally coarse", with no closure or composition laws (§13).
- "Most conclusions are architectural rather than causal": no single best verifier, storage, maintenance schedule or Distillation into compact models cadence, and no cross-paper leaderboard (§13).
- The survey "organizes design patterns that could be used to build more autonomous skill-generation pipelines" (§14).

## Open problems and building blocks

- **Open** (§12, Tab. 10, each with an evidence basis and a first experiment; the first four method-level, the last four needing infrastructure or community coordination):
  - compositional verifiers combining rollback checks and learned judges: "No surveyed method composes them" (§12.1);
  - admission under shifting task distributions, with a verifier that updates from downstream utility (§12.2);
  - principled maintenance schedules; published ones "are engineering defaults" (§12.3);
  - parametric collapse under repeated Distillation into compact models, marked speculative (§12.4);
  - retrieval and composition at 10,000–1,000,000 skills (§12.5);
  - portability: "when is a skill authored on agent A safe and useful on agent B?" (§12.6);
  - provenance at fast-loop edit rates (§12.7);
  - benchmarks reporting global library trajectory, operator velocity and usage versus utility (§12.8).
  - Also: no "standard scalar repair metric" (§8.2); a reporting checklist (§15).
- **Released:** nothing stated beyond the printed coding sheet (Tab. 11, App. A.3).
- **To reuse it:** nothing stated as a requirement.

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
