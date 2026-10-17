# A Reality Check of Language Models as Formalizers on Constraint Satisfaction Problems

**A Reality Check of…** · COLM 2026 Workshop on Efficient Reasoning (v6 PDF header)

Read: [PDF](https://arxiv.org/pdf/2505.13252) · [arXiv](https://arxiv.org/abs/2505.13252)  
Code: [llm-csp](https://github.com/rikhil-amonkar/llm-csp)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares LLMs that translate a constraint satisfaction problem into a program an external solver or interpreter runs (LLM-as-formalizer: free-form Python, or Python code for the Z3 SMT solver) with the same LLMs answering directly (LLM-as-solver), with 4 reasoning and 2 non-reasoning models on three NaturalPlan planning domains (calendar, trip and meeting planning) and ZebraLogic logic grid puzzles (abstract; §1; §3).
- One-shot prompts that show only the output format, with up to 5 revisions of the program when it raises an error or finds no plan (§4); a plan counts as correct when it satisfies all of its problem's hand-annotated constraints (§3); accuracy per bucket of problems by number of constraints (§5.2, Fig. 3), program outcomes (§5.3, Fig. 4), hand-labelled semantic errors (§5.3) and hand-labelled reasoning chains (§5.4, Fig. 6).
- Counter-evidence to the premise that handing the procedure to an engine holds up as problems grow: the authors report that the formalizer "underperforms LLM-as-solver in 12 out of 16 LRM-dataset combinations and 4 out of 8 non-reasoning-LLM-dataset combinations" (§5.1, Fig. 2), that it "still drastically degrades as problem complexity increases similar to LLM-as-solver" (abstract; §5.2), that most semantic errors are wrongly defined constraints, which the solver's error messages can't catch (§5.3), and that reasoning models asked to formalize frequently reason like a solver, which sometimes ends in a program that hard-codes the answer and that a practitioner "would have no way of interpreting and verifying" (abstract; §5.4, Fig. 7).

## In plain words

Recent papers report that an LLM does better on reasoning problems when it translates the problem into a program that a solver runs (a formalizer) than when it works out the answer itself (a solver) (abstract). The authors note that this reported performance "predates the advance of large reasoning models" (models that spend extra reasoning text at inference time) (§1). They test it on [constraint satisfaction problems](#/glossary/constraint-satisfaction-problem): calendar scheduling, trip and meeting planning, and logic grid puzzles. Six LLMs, four of them reasoning models, give the answer or write either a Python program or code for the Z3 solver (a tool that searches for values meeting logical constraints). Prompts show only the output format; a program that crashes or finds no answer may be rewritten up to five times (§1, §4). The formalizer did worse in 12 of 16 combinations of a reasoning model with a benchmark, and 4 of 8 for the other models (§1, §5.1). Its accuracy also fell as problems gained constraints, as the solver's did, and reasoning models asked to formalize sometimes wrote the answer straight into the program (abstract; §5.2, §5.4). The authors present an evaluation, "a deep dive" (§2.3).

## Background and terms

**Terms to know:** [autoformalization](#/glossary/autoformalization) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [test-time scaling](#/glossary/test-time-scaling) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [low-resource programming language](#/glossary/low-resource-programming-language) · [declarative programming](#/glossary/declarative-programming) (the paper's "declarative component", §4; §5.2)

**The paper's own terms:**
- **LLM-as-solver**: "a paradigm when one or more LLMs generate optional intermediate tokens and eventually the solution to a logical reasoning problem" (§2.1). Labelled "Solution" in Fig. 2 and "Plan" in Figs. 3 and 5.
- **LLM-as-formalizer**: the LLM generates "neither the solution nor the chain-of-thought towards the solution" but translates the problem into "an executable program" (§2.2); §1 calls the field "neurosymbolic auto-formalization". In the glossary's terms, this is autoformalization with a solver or interpreter as the target (ours).
- **LRM** (large reasoning model): models "that scales reasoning tokens during inference time" (§1): DeepSeek-R1, Qwen3-32B, o3-mini-high and GPT-5. The non-reasoning models are DeepSeek-V3 and Qwen2.5-32B, marked with an asterisk in the figures (§1, Fig. 2).
- **Python code and SMT code**, the two formalization targets (§4). In Python "the model generates both the declarative component (i.e., the variables and constraints) and the search component" (the algorithm that searches for the plan); in SMT code, written with "the Z3 solver Python wrapper", "the search component is simply a call to the pre-defined solver function".
- **Revision ("+rev")**: when the program returns an error or no plan, "this signal is returned to the LLM to re-generate the program up to 5 times" (§4); wrong plans trigger no revision (Fig. 2, Fig. 4).
- **Complexity**: the number of constraints. NaturalPlan (the three planning domains' benchmark) problems are split into 5 roughly equal percentile buckets, ZebraLogic (logic grid puzzles) into the 4 strata the dataset provides (Fig. 3).
- **solver**, two senses: the LLM answering directly (LLM-as-solver, §2.1), or a program's search, model-written in Python or Z3's (§4).
- **Model-dataset combination**: one model on one domain (§1, §5.1).
- **Outcomes** of a program (§5.3): Error (it doesn't run), No plan, Wrong plan, Correct plan. Semantic errors split into missing constraint, wrong constraint and wrong solver ("wrongly defines or calls the solver").
- **Reasoning-chain types** (§5.4): code-related; solver-like, which "unnecessarily tries to solve the problem like LLM-as-solver, but still generates code that declares the constraints and calls a solver"; spurious, which "hard-codes the answer without the constraints and the solver within the code".

**Missing glossary terms:** none.

**Builds on:**
- Logic-LM (Pan et al., 2023; [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")) and SatLM (Ye et al., 2023), whose revision-by-error module the paper follows (§4); with PAL (Gao et al., 2023; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")), part of the formalization work it cites (§1).
- NaturalPlan (Zheng et al., 2024), a benchmark of planning tasks stated in English, on which "only LLM-as-solver methods have been evaluated", and ZebraLogic (Lin et al., 2025), logic grid puzzles (§3).
- Chen et al. (2025) ([Steering Large Language Models…](#/papers/chen2024steering "Steering Large Language Models between Code Execution and Textual Reasoning (2025)")), "The closest work to ours", which "did not consider any open-source model or inference-time scaling LRMs"; and Kagitha et al. (2025), on classical planning only (§2.3).

## Problem and setting

- **The questions** (RQ1–RQ4, §5.1–5.4): are LLMs better formalizers than solvers; are formalizers more robust to complexity; why do they underperform and fail to scale; are LRMs more efficient as formalizers.
- **The problems** (§3, Tab. 1): each has variables, their possible values and constraints, and a solution assigns every variable a value "that does not violate any constraints". The domains are NaturalPlan's calendar scheduling (a meeting time that fits everyone's calendar), trip planning (an itinerary over cities joined by direct flights, with set stays) and meeting planning (meeting friends across San Francisco given travel times) (App. A), plus ZebraLogic, "less natural but considered in past work" (§3).
- **Data**: "Bound by the cost of annotation, we randomly sample 100 out of 1,000 examples for each domain" (§3).
- **What counts as correct**: the authors "manually and formally annotate all constraints" and count a solution correct "if it formally satisfies all the constraints" (§3); for ZebraLogic a plan is wrong when it "does not exactly match the ground truth" (§5.3).
- **Prompts**: one shot, which "only illustrates the input-output format, containing neither an example solution nor an example formalized code" (§4); no "think step by step" (§4); NaturalPlan's wording as is, with a sentence asking for JSON, an added instruction for the formalizers, and post-processing by gpt-4.1-mini (App. A).
- **Left out on purpose**: specific-purpose formalization pipelines, and "more involved LLM-as-solver pipelines" (§4).
- Sampling temperature and repeated runs: not discussed.

## Approach

- **Three outputs per problem and model** (§4, Fig. 1): the answer, a Python program that is run, or Z3 code; each formalizer with and without revision.
- **Why formalizers are expected to scale** (§5.2, §5.4): solving end to end means searching a space that grows exponentially with variables and constraints, while formalizing, in theory, grows with the number of variables plus their domain size (the number of values a variable can take), "leading the community to expect substantially better robustness to complexity".
- **Analyses**: accuracy per model and domain (Fig. 2); accuracy per complexity bucket for Qwen2.5, DeepSeek-V3, Qwen3 and DeepSeek-R1 (Fig. 3); program outcomes for Qwen3 on Trip Planning and DeepSeek-R1 on Trip and Meeting Planning (Fig. 4); hand labels for 80 programs from Qwen3 and gpt-5 (§5.3); reasoning-token counts (Fig. 5) and 160 hand labels of the reasoning chains of DeepSeek-R1 and Qwen3 (§5.4, Fig. 6).

## Results

Figs. 2–5 print no value labels; the results are the authors' text.
- **RQ1 (§5.1, Fig. 2)**: the authors report that LLM-as-formalizer underperforms LLM-as-solver "in 12 out of 16 LRM-dataset combinations and 4 out of 8 non-reasoning-LLM-dataset combinations". On Trip Planning it "consistently underperforms"; the weakest model, Qwen2.5, does better as a formalizer than as a solver. Revision "induces consistent performance gain in many cases". Python beats Z3 code "in 15 out of 24 model-dataset combinations", although SMT is "arguably more suitable" for these tasks, while Python is "a higher-resource language during pre-training".
- **RQ2 (§5.2, Fig. 3)**: LRMs as solvers "quickly fail as the problems become complex in all domains other than the easiest Calendar Scheduling", which is then excluded. "For the better performing Python formalization, even with revision", the problems with the "top 20% most constraints" score "less than half" of those with the "top 20% least constraints" in 10 of 12 model-dataset combinations.
- **RQ3 (§5.3, Fig. 4)**: syntax errors "are rare but still existent", mostly removed by revision and "primarily dominated by erroneous use of APIs in the Z3 library for SMT generation"; revision largely fixes "no plan" too, and "The persistent and challenging error is a wrong plan". Of the hand-labelled semantic errors, "the majority … are due to wrongly defining constraints (95% of Qwen3)", and the solver's error message cannot catch them. Missing constraints and wrong solver calls are "much less common, though still existent".
- **RQ4 (§5.4, Figs. 5–7)**: "LRMs often generate significantly less reasoning tokens as a formalizer than as a solver", except Qwen3 on ZebraLogic, and Python formalization uses fewer tokens than Z3 code. Only "less than 75% of the reasoning chains of Qwen3 and less than 50% of those of DeepSeek-R1 are primarily code-related"; In spurious reasoning the program hard-codes the whole answer with no constraints or search (Fig. 7; App. D, Fig. 10), and "a practitioner would have no way of interpreting and verifying such a hard-coded program". "Unnecessary reasoning chains constitutes as much as 90% of programs generated by Deepseek-R1 in all domains". Their "likely explanation": "LRMs are trained to reason towards a solution, not formalize".

## Limits the authors state

No limitations section; caveats in the text:
- The sample: "Bound by the cost of annotation, we randomly sample 100 out of 1,000 examples for each domain" (§3).
- The scope: "only one-shot settings with a minimal instruction" (§1); no specific-purpose formalization pipelines, since that "defeats our purpose of studying general applications", and LLM-as-solver is used "as a lower bound to benchmark LLM-as-formalizer" (§4).
- ZebraLogic is "less natural" than the planning domains (§3).
- Programs are asked to print the required format, "though this cannot be guaranteed", so outputs are post-processed by a small LLM (App. A); after the few-shot study, "we relaxed the stringency on output format and rely more on post-processing for a fairer evaluation" (App. B).
- Revision's gains come "at the cost of more calls to the LLM" (§5.1).
- In real use, "validating the correctness of plans assumes much more resources and risks than validating the existence of a plan" (§5.3).

## Open problems and building blocks

  - "multiple future directions spanning performance, robustness, and efficiency of neurosymbolic auto-formalization" (§1);
  - formalizers' lack of robustness, "pointing towards open space for improvement" (§5.2);
  - "the need for a specific translation module beyond solely relying on LLMs to perform the translation from the problem description to the formal program" (§5.3);
  - solver-like reasoning that sometimes leads to hard-coded solutions, "a key challenge for improving LLM-based formalization" (abstract; §6).
- **Released:** code (abstract, footnote 1).
- **To reuse it:** the Z3 solver's Python wrapper (§4); NaturalPlan's prompts and data, licensed Apache 2.0 (App. A, App. E); hand-annotated constraints for each problem (§3); gpt-4.1-mini for post-processing (App. A); the six models of §1.

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
