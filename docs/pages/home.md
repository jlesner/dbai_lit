# Research path: self-taught DSL skills

**The 10× claim:** compact open models, taught to use domain-specific languages (XPath, SQL, SPARQL, iCalendar recurrence rules, regular expressions) through label-free proposer–solver [self-play](#/glossary/self-play) against each language's engine, with what they learn kept in prompts, keep their success rate on tasks ten times larger. The engine runs the procedure exactly; the model writes a short program, and a skill learned from the engine's verdicts tells it how to write it and when to use it.

This is one candidate research path among several, not a chosen plan. Its challenges sit in the search area [LLM methods on checkable problems](#/tags:llm-methods-on-checkable-problems).

---

## The four challenge areas

- **C1, the gym:** task families in each DSL whose answer keys are made by code (predict a program's output, write a program from examples, write one from English, decide whether two programs agree and show where they don't), each with a size setting on two axes: the data (rows, nodes, events) and the composition (steps, joins, predicates, rule exceptions). Everything else is scored here, so the checks must not accept wrong answers.
- **C2, reach with size:** the measurement behind the claim. Data size separates DSL use from plain-text reasoning, since the program stays the same length while the data grows; composition separates a learned skill from zero-shot DSL use. The 10× is claimed on composition, at a fixed success rate.
- **C3, learning in prompts without labels:** a proposer writes problems at the edge of what the solver can do, the engine judges the answers, and the passing work becomes a skill document and a library of verified examples. Who writes the skill is the experiment: the compact model itself, or a frontier model writing for it.
- **C4, learning or recall:** the same loop on a DSL with little training data, K through the open-source ngn/k engine, shows whether the loop teaches or only reminds.
- **Across areas, comparison under noise:** every claim is a comparison between arms on generated tasks, with the usual risks of noise and of scoring on the set that picked the winner.

## How they connect

```
 DSL engines: XPath, SQL, SPARQL, RRULE, regex; K (ngn/k) as the control (C4)
     │ run every program and judge every answer
     ▼
 the gym (C1) ──► proposer: a problem at the solver's edge
                      │
                      ▼
                  solver: a compact model writes a program ──► engine ──► verdict
                      ▲                                                    │
                      │                                                    ▼
                  skill document + verified-example library ◄── written by the compact
                      (C3)                                         model or a frontier teacher
                      │
                      ▼
 success as tasks grow (C2), against: the same model with the engine and no skill;
 plain text where the data fits in context; a frontier model
```

C1 supplies and scores the tasks. C3 is the loop. C2 is what the loop is for, and C4 is its control. The engine is the only judge, so no label comes from a person or an LLM.

## Challenges by area

- **C1, the gym:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation).
- **C2, reach with size:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability) · [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy).
- **C3, learning in prompts:** [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Self-improvement that compounds](#/challenges/compounding_self_improvement).
- **C4, learning or recall:** [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts).
- **Across areas:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise).

## The agenda

```
 reliability holds with size: a compact model's success rate holds    (C2)
   on 10× more composed tasks, in several DSLs
   ▲
 the loop: skill document + example library from the engine's         (C3)
   verdicts; compact-written against frontier-written; learns when
   to use the engine as well as how
   ▲                                ▲
 the gym, XPath first (C1)          the control: the same loop on K (C4)

 techniques: program_aided_reasoning (the solver's move) · proposer_solver_self_play (the loop)
             · prompt_evolution and cross_problem_memory (the store) · propose_and_verify (the judge)
```

Why this shape:
- **Each step feeds the next.** The gym gives the loop its problems and verdicts; the loop gives the measurement its arms; the control says whether the measurement shows learning.
- **The attack leaves the weights fixed**. Engine-judged self-play is known in weight space, for Python ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")) and SQL ([SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)")). In prompt space, the closest works found use an LLM judge ([From Context to Skills](#/papers/si2026ctx2skill "From Context to Skills: Can Language Models Learn from Context Skillfully? (2026)")) or accumulate the agent's own successes without a proposer ([Self-Generated In-Context Examples Improve…](#/papers/sarukkai2025selfgenerated "Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks (2025)")); the Ctx2Skill authors name a sound check in place of their judge as future work (App. B), so the gap may not stay open for long. A quick search on 2026-10-13 (16 queries) found no work that runs the whole loop; this is our reading, not a survey.
- **Easy to explain:** the model writes a short program, the engine runs it, and the skill grows only from what the engine accepted.

**The first experiment:**
- **DSL:** XPath 1.0, with lxml as the engine and elementpath as a second implementation that cross-checks every answer key. K (ngn/k), the control, joins once the loop shows a gain on XPath: the control only matters when there is a gain to explain.
- **Learner:** one open model family at three sizes (about 4B, 8B and 32B), so "compact" is a curve. **Teacher:** the learner itself, or a frontier model.
- **Families:** output prediction; path from examples, checked on held-out pages rendered from the same hidden template (a path that hard-codes the shown nodes fails there); path from an English question rendered by code from a hidden gold path; equivalence with a distinguishing document. The engine is always used: tasks answerable in text, where the skill must learn when not to call it, are a later step.
- **Size:** document size, and steps and predicates per path.
- **Arms:** no skill (zero-shot DSL use, the main baseline), self-written skill, frontier-written skill; plain text where the document fits in context; a frontier model with the engine.
- **Stop rule:** if zero-shot XPath on the small model already holds its success rate across the composition range, the headroom isn't there: move the first experiment to another DSL before building the loop.

**[Certificates](#/glossary/certificate) this path produces:** the engine's verdict on every answer; distinguishing documents (or databases) for every pair of programs found to differ; and skill entries admitted only with the verified examples behind them.

## Milestones

None yet.

## Open

- **Can compact models write useful skills?** The evidence found leans against it: Dynamic Cheatsheet's authors tie its gains to model scale ([Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)") §4.5), and skill packs frontier agents wrote for themselves before solving scored below no skills on all three configurations tested ([SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)") App. D.6). With the engine's verdicts as feedback, it is open.
- **Does handing the procedure to an engine help compact models at all?** Code written by the model "is not always better" than textual reasoning, and the choice between them scales inversely in the authors' tests ([Steering Large Language Models…](#/papers/chen2024steering "Steering Large Language Models between Code Execution and Textual Reasoning (2025)") abstract); the gains that grow with problem size were shown with API models ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") §5.2, [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") §4.3).
- **XPath still needs its gate check** before the gym is built on it.

## Explore

- **[Papers](#/papers)**: what each paper does, with links to the paper and its code.
- **[Tags](#/tags)**: topic tags linking papers, projects and challenges.
- **[Challenges](#/challenges)**: open research challenges, why they matter, and what signal can check an answer.
- **[Glossary](#/glossary)**: the field's terms in plain words.
