# Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers

**Formalize, Don't Optimize** · (the heuristic trap in LLM-generated combinatorial solvers; CP-SynC-XL), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.12421) · [arXiv](https://arxiv.org/abs/2605.12421)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks how an LLM should write a solver for a combinatorial problem given in natural language, and whether it should also try to speed up the search: three frontier LLMs write a reusable solver as plain Python search, as a model for the OR-Tools CP-SAT solver through its Python API, or as a MiniZinc model run on the same CP-SAT, from a baseline prompt that asks for correctness and a heuristic prompt that also asks for efficiency (abstract; §1; §3.1).
- CP-SynC-XL, 100 constraint satisfaction and optimization problems from CSPLib and the PyCSP3 suite with 4,577 instances, scored per instance against a reference verifier of feasibility and optimality (§4.1–4.2); a refinement loop of up to four rounds whose checks test that the solver runs, returns output in the required format and finishes a harder instance in time, not that its answers are correct (§3.2); a five-way split of outcomes and a manual audit of the baseline wrong answers (§4.4, App. F), and source-level detectors for six failure modes of the heuristic prompt (§5.2, App. G).
- Evidence on which language to hand the solver in, and on letting the LLM tune the solver's search: the authors report that Python + OR-Tools "attains the highest correctness across LLMs", that MiniZinc + OR-Tools "has lower absolute coverage despite using the same OR-Tools back-end", and that native Python "is the most likely to return a schema-valid solution that fails verification" (abstract; Tab. 1); prompting for search optimization gives "only small median speed-ups" and a bimodal effect on correctness (abstract; §5); and in their audit of baseline wrong answers on Python + OR-Tools "every audited case is a natural-language-to-formal-language mistranslation" (§4.4).

## In plain words

LLMs struggle to solve hard combinatorial problems (scheduling, puzzles) by reasoning in text, so recent systems have them write a solver instead (abstract; §1). The authors ask in what form the LLM should write it, and whether it should also try to speed up the search. They built CP-SynC-XL (100 problems, 4,577 instances) and had three frontier LLMs write solvers three ways: plain Python search, a model for an off-the-shelf constraint solver written through its Python library, or a model in a constraint-modeling language run on that same solver (abstract; §1). At the time limit, the Python-library route gave the most verified-correct answers on every LLM, and plain Python was the most likely to return well-formed wrong answers (Tab. 1). Also asking for efficiency, against correctness alone, gave small median speed-ups, many slower instances and sharp correctness losses on some problems, traced by a code audit to a "heuristic trap" (abstract). An empirical study with a new benchmark; the authors say it supports having the LLM mainly state the problem for a verified solver, and checking any search optimization it writes (abstract).

## Background and terms

**Terms to know:** [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) (CSP) · [symmetry breaking](#/glossary/symmetry-breaking) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [constraint optimization problem (COP)](#/glossary/constraint-optimization-problem-cop) (§4.2) · [constraint propagation](#/glossary/constraint-propagation) (Modes B and F, §5.2) · [search annotation](#/glossary/search-annotation) (§3.1: MiniZinc's `int_search`, CP-SAT's `AddDecisionStrategy`) · [big-M constraint](#/glossary/big-m-constraint) (with MTZ, "strictly weaker for CP-SAT" than the reified form, a constraint switched on by a true/false variable, App. G, Mode B) · [complete and incomplete search](#/glossary/complete-and-incomplete-search) (Mode D, App. G)

**The paper's own terms:**
- **paradigm** (§3.1): **Python**, a standalone algorithm on the standard library, no solver allowed; **Python + OR-Tools**, variables, constraints and an optional objective declared through the Python API of CP-SAT, the constraint solver in Google's OR-Tools, which does the search; **MiniZinc + OR-Tools**, a model in MiniZinc, "a high-level, solver-independent declarative modeling language", plus a Python output formatter, solved by the same CP-SAT.
- **baseline / heuristic prompt**: the baseline asks only for a correct solver; the heuristic prompt adds efficiency techniques such as variable and value ordering and pruning (Python), or tighter bounds, redundant constraints, symmetry breaking and search annotations (solver-backed) (§3.1; verbatim in App. B).
- **artefact**: the reusable solver the LLM writes; **first-working** is the earliest revision to pass the smoke check, **final** the first to also pass the scaling check, or else the last revision (§3.2).
- **smoke / scaling check**: runs and returns schema-valid output on a small instance; still finishes on a harder one under a tighter limit. "Neither stage verifies solution correctness against the reference solver" (§3.2, Fig. 2).
- **Provided, Correct, fidelity**: an output in the required format (schema-conformant) within 256 s; one that also passes the reference verifier; correct divided by provided (§4.2).
- **outcome bins**: correct, suboptimal, UNSAT (unsatisfiable: pinning the returned solution into the reference verifier makes a feasible instance infeasible), invalid, no solution (§4.4, Fig. 3).
- **representational divergence**: LLMs "are more successful with a Python solver API than with a declarative modeling language, even when both use the same OR-Tools back-end" (§1).
- **heuristic trap**: "the recurring pattern in which an efficiency-oriented prompt induces unverified bounds, local approximations, or overcomplicated constraints that sometimes target speed but reduce correctness or fidelity" (§1).
- **M1–M4**: causes of baseline wrong answers: the LLM imposing a known problem's template, dropped constraints, output-schema ambiguity, misread sentinel values (§4.4; App. F.2); **M5**, search-procedure bugs, Python only (App. F.4).
- **Modes A–F** (§5.2): what the heuristic prompt newly changes. On Python + OR-Tools: A unverified "tight" bounds, B big-M / MTZ rewrites that weaken propagation, C hand-computed seeding; on Python: D silent loss of completeness; on MiniZinc + OR-Tools: E an optimization problem collapsed into satisfaction against an unproven optimum, F redundant-machinery blow-ups.

**Missing glossary terms:** none.

**Builds on:**
- CP-SynC (Song and Cohen, 2026), the same 100 problems with one instance each, which CP-SynC-XL extends (§4.1); the MiniZinc pipeline of Song and Cohen (2025), "a strong MiniZinc baseline" (§3.1). Neither is on this site.
- Translation to solvers, e.g. Logic-LM ([Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), PAL ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")) and NL4Opt (optimization modeling), which "typically evaluate one surface at a time, one or a few instances per problem, or problem-level success" (§2).
- LLMs as heuristic designers (FunSearch, Evolution-of-Heuristics: evolutionary search over LLM-written programs), which "typically rely on a problem-specific scoring oracle"; this paper studies "single-shot generation with a bounded refinement loop" (§2).

## Problem and setting

- **Question:** how the LLM should represent the solver, and whether it should optimize search; each comparison holds the LLM, decoding, instances, evaluator, timeouts and refinement budget fixed (§3).
- **Benchmark:** 58 satisfaction and 42 optimization problems from CSPLib and the PyCSP3 suite (public collections of constraint problems), each with a natural-language description, typed inputs, an output format and a reference verifier "for CSP feasibility and COP optimality against a curated reference solver" (§4.1). Public instances (from sources including CSPLib, MiniZinc challenges and XCSP3 competitions) for 13 problems, generators at increasing scale for the rest (§4.1). Instances whose reference validation didn't finish within 256 s are excluded, leaving 2,565 "in the final evaluation set reported in the figures and tables" (App. B.3).
- **Models:** GPT-5.3-Codex, Gemini 3.1 Pro and DeepSeek-V3.2 through OpenRouter (an API gateway), greedy decoding, medium reasoning effort where supported (App. B).
- **Controls:** the framework sets all time limits; prompts forbid internal ones and, for Python + OR-Tools, any pure-Python fallback (§3.3).
- **Refinement:** up to four rounds, fed back by the smoke and scaling checks; both artefacts then run on every instance (§3.2).
- Repeated runs or statistical tests of the differences: not discussed.

## Approach

- Three LLMs × three paradigms × two prompts (§3), scored by the fraction solved correctly by each time up to 256 s (§4.2, Fig. 1).
- A manual audit of the twelve problems with the most UNSAT verdicts on the Python + OR-Tools baseline (App. F.3, Tab. 7).
- A paired audit of heuristic against baseline code: construct frequencies and outcomes (App. B.4–B.5, Tabs. 3–4), and six modes, each "marked by a conservative source-level detector" (§5.2, Tab. 2; App. G).

## Results

- **Correctness:** Python + OR-Tools > Python ≳ (roughly equal or above) MiniZinc + OR-Tools on every LLM (§4.3); e.g. GPT-5.3-Codex's baseline solvers are correct on 0.702 of instances against 0.634 (Python) and 0.522 (MiniZinc) (Tab. 1). With CP-SAT behind both, MiniZinc's shortfall "is consistent with a surface-fluency bottleneck rather than a weaker back-end" (§4.3).
- **Fidelity inverts it:** MiniZinc keeps ≥ 83% on every LLM and prompt; Python bottoms at 51.9% (DeepSeek-V3.2, heuristic) (§4.3, Tab. 1). The authors put this down to the checks an answer must clear first in each paradigm (§4.3).
- **Heuristic prompt:** small gains and losses on GPT-5.3-Codex and Gemini 3.1 Pro; on DeepSeek-V3.2, −7.4 percentage points (pp) of correctness and −16.1 pp of fidelity on Python + OR-Tools (§4.3). Median speed-ups are "only small" (1.03–1.12×) (abstract), and the per-problem median shows essentially no speed-up on Python and Python + OR-Tools for any LLM (§5.1).
- **Baseline audit:** "every audited case is a natural-language-to-formal-language mistranslation", M2 38%, M3 36%, M1 16%, M4 10% of the audited UNSAT count (§4.4); four problems the authors name fail on all three LLMs (App. F.3).
- **Modes:** F is the most common and drives both MiniZinc + OR-Tools' real speed-ups and its heaviest regressions; B and E are rare but "cripple correctness when triggered", −33.4 pp mean for E on GPT-5.3-Codex (§5.2, Tab. 2). Three construct families "regress at high rates regardless of LLM": aggressive value selectors (which value to try first) and lex / value-precede chains (symmetry-breaking orderings) in MiniZinc, and iteration caps in Python (DeepSeek-V3.2 only) (App. B.5). GPT-5.3-Codex is "the only LLM whose" heuristic prompt is net positive on every paradigm, which the authors say is largely explained by its preference, "when in doubt", for native solver hooks (the solver's own search strategies and built-in constraints) (App. H).
- **Refinement** "does not measurably accelerate solvers", is "an error-recovery loop", and under the heuristic prompt is "partially counterproductive" (App. C, Tab. 5).

## Limits the authors state

- "future or smaller models may exhibit different paradigm preferences, and absolute fidelity numbers should be read as a snapshot rather than an upper bound" (App. A).
- The divergence finding "should be read as evidence for this CP-SAT-backed API/declarative pairing rather than as a claim about all MIP-, SAT-, or CP-modeling pipelines" (App. A); MIP is mixed-integer programming, SAT Boolean satisfiability ([SAT solvers](#/glossary/sat-and-smt-solvers)), CP constraint programming.
- The heuristic-trap claims "concern bounded-refinement deployment settings rather than the population-and-selection regimes used by FunSearch-style algorithm-synthesis loops"; fine-tuning, tool-augmented agents and multi-instance amortised solving are out of scope (App. A).
- The detectors are "reproducible proxies for recurring code patterns, not formal proofs that the pattern caused every downstream failure"; incidence "should be read as lower bounds"; "unflagged solvers may still contain related mistakes in forms the detectors do not cover" (App. G).
- Mode F's effect is "an outcome we cannot predict before the run" (§5.2).
- Instances were filtered "Due to time and compute constraints" (App. B.3); the Python mechanism split is an "approximate decomposition" (App. F.6).

## Open problems and building blocks

- **Open:** "A natural future direction is therefore to train or adapt models with stronger fluency in declarative modeling languages such as MiniZinc" (§4.3). The bottleneck they name: refinement can't fix dropped constraints, so "M2 is the formal reason that loop has a hard ceiling on baseline correctness" (App. F.3). Their recommendation: "subject LLM-authored search optimizations to independent validation" (§6).
- **Released:** "All scripts, raw per-instance solver logs, generated solution pickles, and evaluation transcripts are released alongside the paper" (App. B.2, "Computing infrastructure"); the detector script is "released with the benchmark", with per-problem mode labels (App. G); the benchmark is a stated contribution (§1).
- **To reuse it:** MiniZinc 2.9.6, OR-Tools CP-SAT 9.15; 256 s per instance, 128 s per verification; Xeon servers (App. B.2); prompts verbatim (App. B).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
