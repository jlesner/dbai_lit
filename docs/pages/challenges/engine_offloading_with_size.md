# Reliability that holds with size, by handing the procedure to an engine

> When a compact model writes a DSL program and an engine runs it, does its success rate hold as tasks grow, in data and in composition, and does the model know when the engine is the right tool?

<p class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/general">general</a></p>

## Challenge
A model reasoning in text must carry every step itself, so its errors compound with the length of the job ([Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)). A model that writes a program hands the steps to an engine that runs them exactly. Two kinds of growth are worth separating:
- **Data:** more rows, nodes or events. The program stays the same length, so DSL use should hold where reasoning over the data in context fails (ours).
- **Composition:** more steps, joins, predicates or rule exceptions in the program the task needs. The program grows, so this is where writing it well, and a learned skill, should matter (ours).

Routed to a constraint solver, GPT-4o stayed steady on ordering puzzles of 3 to 7 objects while prompting fluctuated, the authors report ([Adaptive LLM-Symbolic Reasoning via…](#/papers/xu2025adaptive "Adaptive LLM-Symbolic Reasoning via Dynamic Logical Solver Composition (2026)") §3.5, Fig. 2). What is open is the same measurement on compact open models writing data DSLs (XPath, SQL, SPARQL, recurrence rules, regular expressions): a short search on 2026-10-13 found none. It includes the decision to use the engine at all, since "results from LLM written code are not always better than using textual reasoning, even if the task could be solved through code" ([Steering Large Language Models…](#/papers/chen2024steering "Steering Large Language Models between Code Execution and Textual Reasoning (2025)") abstract). On table questions, [exact match](#/glossary/exact-match) fell with table size before context limits came into play, and a generated row filter helped more as tables grew, but only behind a detector: applied to every question, it lowered OmniTab's score ([Externalising Reasoning by Teaching…](#/papers/gemmellgorriz2026externalising "Externalising Reasoning by Teaching Language Models to Use Programs as Tools (2026)") §6.3.1, Tabs. 6.3, 6.6, PDF pp. 90–99).

## Why it matters
- **It tests the brainstorm's premise directly:** that a DSL moves an LLM from informal to procedural reasoning, measured as reliability against size rather than accuracy at one size (ours).
- **For DSL users:** XPath, SQL and the rest run real systems; a model that writes them reliably as the request grows is the practical form of the gain.

**Size of the gain:** step change, measured as the composition level at which a compact model keeps a fixed success rate, with a learned skill against zero-shot DSL use. This is our estimate: the flattening is shown only with API models on arithmetic and logic tasks ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)"), [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), and not uniformly.

## Verifiable signal
The engine runs the model's program and the task's hidden program on the shown data and on held-out variants; the answer passes only if the results match on all of them. Success rate is reported per size bucket on each axis, with [pass^k](#/glossary/passk-reliability-over-k-trials) for reliability, and the arms are compared as [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) requires.

