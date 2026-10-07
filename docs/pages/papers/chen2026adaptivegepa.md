# Adaptive-GEPA: Make Your Harness Fit Heterogeneous Requests

**Adaptive-GEPA** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.38762) · [arXiv](https://arxiv.org/abs/2609.38762)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves a router and a library of specialist programs under one search budget.
- Specialists are aligned by the requests they handle when merging.
- Heterogeneous requests; reports beating GEPA's full-program adapter and GRPO (abstract); final selection reuses the validation set (App. L).

## In plain words

One LLM service often receives very different requests (fact lookup, maths, privacy-sensitive rewriting, constrained writing), and the authors argue that improving it "requires learning both useful procedures and when each procedure should be used" (§1). One shared program leaves the division of work implicit; one program per request family fixes it beforehand (abstract). Adaptive-GEPA instead evolves, in one search, a router plus a small library of specialists, each a plain-text description paired with program code; an LLM edits them from feedback, and when two search branches are combined, specialists are matched by the requests they handled (abstract, §1).

On a fixed mix of four benchmarks, one Qwen3-8B run, whose router and editing model get no family labels, raises the average test score from 52.6 to 70.6, against 62.5 for GEPA's single-program optimizer and 54.0 for reinforcement-learning fine-tuning, at a nominal budget of 18,000 scored calls that "do not equate total compute" (abstract). The authors present a representation and a merge rule, not a first: joint optimization and heterogeneous routing "also appear in recent systems" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [agent harness](#/glossary/agent-harness) · [Pareto front](#/glossary/pareto-front) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **full-program optimization**: editing a program's prompts, modules, control flow, tool use and inference settings, as executable source, with model weights fixed (§2).
- **harness**: the evolved router and library (title, Fig. 3); App. L's "benchmark harness" is the evaluation code.
- **specialist (expert)**: a description of its responsibility, a program, and an on/off flag; five slots in the main runs (§3.1).
- **router**: a prompted LLM that reads the request and the active descriptions (not the code) and picks a specialist or the fallback (§3.1).
- **fallback (P0), "generic seed"**: a fixed generic single-predictor program in DSPy (an LLM-programming framework, [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")); search starts from it (App. B, App. D). Not to be confused with random seed 43 (§4.1).
- **actor**: the LLM that routes requests and makes the model calls inside programs (Fig. 2).
- **footprint**: the set of validation requests a specialist actually executed (§3.3).
- **scored call**: one run of a program on one example plus its evaluation; the budget unit (§4.1).
- **execution profile**: Qwen3's thinking ("deep") or non-thinking ("fast") mode (§4.1).
- **family mean**: the unweighted average of the four task scores, times 100; the example mean weights each test example equally (§4.1, Tab. 2).
- **feedback set / validation set**: examples for reflection, and a separate set (the Pareto set) for selection; 45 per family each (§3.1, App. B).

**Missing glossary terms:**
- **Jaccard overlap**: for two sets, the size of their intersection divided by the size of their union; zero when the union is empty (§3.3).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")): its reflective search, per-request [Pareto](#/glossary/pareto-front) parent selection and merge eligibility rules are kept (§3.4, App. A, §5); its full-program adapter, evolving one program on the whole mixture (GEPA-FPA-ALL), is the "closest baseline" (§4.1).
- Mixture-of-Prompts (MoP; not listed here), which routes requests to instruction clusters by nearest embedding centroid, compared as a baseline (Tab. 1, App. D).
- GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), used to fine-tune all Qwen3-8B weights as a baseline (§4.1).

## Problem and setting

- **Question:** can one search learn the division of requests and the specialists' programs together, and combine branches whose slot numbers don't identify roles (§1)?
- **Objective:** maximize the expected score over the request mixture; a new search iteration starts only while scored calls are below the budget, so the final count "can therefore exceed the nominal budget" (§2, Eq. 2).
- **Tasks** (§4.1, App. C): HotpotQA (multi-hop factual questions, token F1, i.e. word overlap with the reference; 300 test), AIME (competition maths, exact match; the 30 AIME 2025 problems, five attempts each averaged "to estimate pass@1, not pass@5"), PUPA (privacy-preserving delegation to an untrusted external model, averaging answer quality and one minus privacy leakage; 221 test), and LiveBench-IF (text generation under constraints, combining complete and partial constraint satisfaction; 100 test).
- **Labels:** "Task-family labels are withheld from the router, specialists, and reflection model", but "support sampling and evaluator selection" (§3.1).
- **Models** (§4.1, App. B): actor Qwen3-8B, reflection GPT-5.5, ColBERTv2 retrieval (a neural search index) over Wikipedia abstracts, five slots, random seed 43. PUPA's quality and privacy judges are local Qwen3-8B. Generated code runs in a sandbox (App. B).

## Approach

- **Candidate:** router, up to five specialists and the fallback; all slots start inactive (§3.1, Eq. 3–4).
- **Choose an action, then edit (§3.2, App. E Tab. 6).** On a feedback minibatch, the reflection model reads traces, scores, feedback, the router, all descriptions and the action history, but no program source, and picks an action: activate a specialist, rewrite a program, rewrite the router, rewrite a description, or deactivate. A second call writes the edit (none for deactivation); it sees the target's source only for program or description rewrites.
- **Acceptance (§3.4, App. A.1):** an edited child must strictly beat its parent on the same minibatch; a merged child must match or exceed the stronger parent on five validation examples. Passing children are fully validated and archived. Parents are chosen by GEPA's per-request Pareto selection.
- **Aligned merge (§3.3, App. A.2):** the initial alignment pairs specialists in two parents by the Jaccard overlap of their footprints, keeping mutual best matches with positive overlap; unmatched specialists take free slots; with none free, one can compete with its strongest positive-overlap partner, a fallback that "need not be a mutual-best match" (App. A.2). The authors call the rule "a local matching heuristic over executed traffic, not a maximum-weight assignment or a test of semantic equivalence" (§3.3). Each description is copied together with its program; if both parents changed an aligned pair, the one with the higher mean on requests both handled is kept "when the required evidence exists"; otherwise other rules apply, including GEPA's aggregate-parent rule with random tie breaking (App. A.2). No task labels are used; the child is re-evaluated.
- **Final choice:** the archived candidate with the highest validation mean (§3.4, Eq. 8). Specialists the router never selected after a merge are deactivated (§3.4).
- **Profiles:** each generated program declares its own profile; GEPA-FPA-ALL must choose one global profile (App. B, App. D).

## Results

All are the authors' reports.

- **Main comparison (Tab. 2, Qwen3-8B, test family means):** generic seed 52.6; MoP 51.2 at about 1k calls; GRPO 54.0 at 18k calls and 56.3 at a retrospective 90k cutoff; GEPA-FPA-ALL 62.5; Adaptive-GEPA 70.6; per-family GEPA-FPA, given the true labels at inference, 73.0. Adaptive-GEPA improves all four families over the generic seed; GEPA-FPA-ALL leads on LiveBench-IF but falls below it on PUPA (§4.2).
- **PUPA's share (§4.2, App. G.1 Tab. 8):** PUPA contributes 6.0 of the 8.1-point gap over GEPA-FPA-ALL; the difference "stays positive for every excluded family, without candidate reselection".
- **GPT-4.1 as actor (§4.3, Tab. 3):** 71.5 against 69.8 for GEPA-FPA-ALL and 74.9 for the label-routed reference.
- **Routing (§4.4, Tab. 4):** the final router matches the post-hoc family mapping (each specialist assigned, after search, the family most of its requests come from) on all 651 test requests, against 93.1% for MoP; this "measures partition agreement, not selection of the best-performing expert for each request".
- **Merges (§4.5, App. H Tab. 10):** of 26 accepted merges, ten keep pairs from both parents, and all ten have higher validation means than both parents, median gain 3.2 points; thirteen match a parent. Replaying historical merges with projected (not executed) children, no event with complete projections scores lower under alignment than under index-based merging, i.e. copying specialists by slot number as earlier versions did (App. I.2).
- **Edits (§4.6, Tab. 5):** 60 of 76 local proposals activate a specialist or rewrite a program.
- **Specialists (§4.4, Fig. 3):** maths "can answer directly or review four attempts".

## Limits the authors state

- "The final method is evaluated with one seed on four fixed task families"; two seeds exist only for an earlier version (§6, App. I.1).
- It does not study "online task discovery, overlapping capabilities, or distribution shift"; "Some programs contain benchmark-specific branches" (§6). Held-out evaluation "tests new instances, not new domains or problem structures" (App. L).
- "The comparison changes both search representation and profile allocation, so it does not isolate individual operations" (§6).
- Reusing validation requests for search and final selection "can favor noisy high scores"; this was not measured on a fresh selection set (§6).
- "Researchers saw periodic test results during development, although candidate selection used validation scores alone" (§6).
- PUPA "can reward empty delegated requests even when runtime failures score zero"; leakage is not clipped, so if the judge overcounts, utility can be negative (§6, App. L).
- The GPT-4.1 run, after resumptions and an evaluator outage, is "supporting evidence rather than a clean replication" (§6).
- "We make no claim about latency or total compute savings" (§6); the budget "does not equate model generations, tokens, or total compute" (§4.1).
- Footprint overlap "does not establish semantic equivalence", and the records do not establish superiority over maximum-weight matching, descriptor similarity or hybrid rules in a controlled full search (App. A.2). Alignment and corrected failure scoring arrived together (App. L).
- Merges are "selected observations, not controlled estimates of the merge operator's effect" (§4.5) and "do not show those merges were counterfactually necessary" (App. H); edit "Counts do not isolate performance contributions" (§4.6).
- MoP and GRPO are "contextual comparisons; they do not rank optimization paradigms under matched capabilities or compute" (§4.1); the GRPO runs "do not establish that RL with an agentic tool interface is intrinsically weaker" (App. L). Per-family GEPA-FPA "is a reference, not a strict upper bound" (§4.1). Results "may depend on the executor, tools, and reflection model" (App. L).

## Open problems and building blocks

- **Open:** None stated as future work.
- **Released:** Nothing stated (Reproducibility statement).
- **To reuse it:** a reflection LLM (GPT-5.5 here), an actor LLM, per-request scores and optional text feedback from an evaluator (§2), DSPy and a code sandbox (App. B). Reflection used about 11.9M tokens, against 5.4M for GEPA-FPA-ALL (App. K).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
