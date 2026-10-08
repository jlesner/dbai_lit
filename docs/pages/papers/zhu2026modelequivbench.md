# ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models

**ModelEquivBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.29431) · [arXiv](https://arxiv.org/abs/2607.29431)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Grades an LLM-generated optimization model against a reference not with one equivalent/not-equivalent verdict but with a profile of seven relations, E0–E6: it builds and ingests, a verified variable map, feasible sets (same space or under an affine lift), objective order, optimal value, and optimizer sets (abstract; §1; Tab. 1). The authors say it is an evaluator, "not a new benchmark dataset": the problems come from Bench4Opt (§1).
- Each decided entry carries evidence an independent verifier re-checks in exact rational arithmetic: Farkas multipliers or other certificates for positive conclusions, witnesses for negatives that differ by level, such as a feasible point that breaks a constraint of the other model (Tab. 1); incomplete map search, unsupported structure and timeouts give typed UNKNOWN or N/A instead of a verdict (§1; §3.3; §4.1–4.2). Run on GPT-5.4, Claude Sonnet 4.6 and Qwen3.5-397B-A17B, one generation each, no repair (§5.1).
- A certificate-or-witness checker with abstention, outside SQL, and an audit of coarser grades: the authors report candidates that execute but are certified wrong on some relation, and structural (ORGEval-style) rejections of pairs whose feasible sets are certified equal, for all three models (abstract; §5.3, Tab. 2).

## In plain words

LLMs increasingly turn word problems into optimization models: variables, constraints, and an objective to minimize or maximize (§1). The authors say such outputs are often graded by whether the code runs, or by one equivalent/not-equivalent verdict against a reference model, "labels that are neither independently checkable nor faithful to the multiple distinct senses in which two formulations can agree" (abstract). Their evaluator reports seven separate relations instead: does the model build, do its variables match the reference's, do the allowed solutions coincide, do the objectives rank solutions alike, reach the same best value and pick the same best solutions. Each decided relation carries evidence that an independent checker re-checks exactly; an undecided one records why, instead of a guess (§1). They present it as an evaluator, "not a new benchmark dataset" (§1). With three LLMs on 173 problems, one generation per prompt and no repair, they report 49, 35 and 25 generated models that a run-only grader would accept but that are certified to disagree with the reference on some checked relation (abstract; §5.2; Tab. 2).

## Background and terms

**Terms to know:** [certificate](#/glossary/certificate) · [soundness and completeness](#/glossary/soundness-and-completeness) · [bijection](#/glossary/bijection) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [multiple testing](#/glossary/multiple-testing).

**Missing glossary terms:**
- **Optimization model (LP, MILP)**: continuous, integer or binary variables, linear constraints and a linear objective to minimize or maximize; a linear program (LP) when all variables are continuous, a mixed-integer one (MILP) otherwise (general definition; the paper's form: App. A.1, Def. A.1). Its **feasible set** is the points satisfying every constraint and domain; its **optimizer set** the feasible points reaching the best objective value, the **optimal value** (Def. A.1).
- **Farkas multipliers**: nonnegative weights on one system's inequalities (any weights on its equalities) whose weighted sum is exactly a target constraint's left side, with a combined bound no larger than the target's; then every point of the system satisfies the target (App. C.1, Prop. C.1). One set per constraint of the other model proves containment (Cor. C.2).
- **Weak duality**: for a continuous rational LP, a feasible point and a feasible point of its dual (a second LP whose values bound the first one's optimum; general definition) with equal objective values prove the exact optimum (App. E.2, Prop. E.4).

**The paper's own terms:**
- **Semantic profile E0–E6** (§1; Tab. 1), for a candidate (LLM-generated) and a reference (ground-truth) model: E0, the code runs and exports an LP or MPS file (standard text formats for optimization models) that reads into a valid exact model; E1, an admissible map from candidate to reference variables is found and checked; E2, the feasible-set relation under that map in the same space (equal, strict relaxation, strict restriction, incomparable, unknown); E3, the same question through a projection when the candidate has extra auxiliary variables; E4, both objectives rank feasible points alike; E5, equal optimal values; E6, the map pairs the optimizer sets one-to-one. They "form a profile, not a ladder" (§1).
- **Admissible map** (§3.2): a permutation of type-compatible variables with per-variable transforms (identity, x ↦ 1 − x for 0–1 variables, sign negation for free, i.e. sign-unrestricted, continuous ones), or an "affine lift" to a larger candidate: a projection onto the reference's variables and a section mapping reference points back, both affine (linear plus a constant). A fixed grammar proposes maps, with no LLM (App. F.2); no standalone sign-negation map is proposed in the reported run (App. B.2).
- **CMC (Certifying Mapped-Containment)**: proves each containment direction with Farkas multipliers or refutes it with a witness, a feasible point of one model that violates a constraint of the other (§1; §3.3).
- **Typed outcomes** (§3.1; App. A.2, Tab. 4): TRUE or FALSE, with evidence; UNKNOWN (neither side established); UNKNOWN_RESOURCE (budget exhausted); UNKNOWN_UNSUPPORTED (outside the implemented envelope, e.g. quadratic); N/A (mathematically inapplicable); ABSENT (an upstream prerequisite failed).
- **FALSE_WITHIN_DECLARED_UNIVERSE**: E2's only negative: every map in a universe declared complete separates with a re-verified witness; complete only when the permutation family can be fully enumerated (n ≤ 7, n the number of variables; App. A.1) and no binary variable is present (§3.3).
- **Cell**: one base problem under one of two paired prompt conditions, Structured or Unstructured, for one model (§5.1).

**Builds on:**
- ORGEval (Wang et al. 2025), which "compares optimization models by graph-theoretic canonicalization" (§2.2); its Bench4Opt (optimization-modeling problems with reference models) supplies the instances (§5.1). The baseline is "the ORGEval-style structural implementation used in our harness", not claimed to be the unmodified official one (§5.1).
- EquivaMap (Zhai et al. 2025), where an LLM proposes variable mappings that are then verified, and EquiBench (Wei et al. 2025; [EquiBench](#/papers/wei2025equibench "EquiBench: Benchmarking Large Language Models' Reasoning about Program Semantics via Equivalence Checking (2025)")); both "target an overall equivalence judgment" (§2.1).
- Certifying algorithms, Farkas' lemma (Schrijver 1986) and exact rational LP/MIP methods (Applegate et al. 2007; Cook et al. 2013), which the authors adapt (§2.2).

## Problem and setting

- **Question** (§1): "in which distinct semantic senses do they agree or disagree, and which of those conclusions can be independently certified?"
- **Models:** "the supported envelope of linear and bounded-discrete models" (§1).
- **Correct** means agreeing with the reference: "The reference is treated as ground truth" (App. L.2). Checks are exact (fractions, no rounding) for the serialized model and do not reconstruct values that "may have been rounded before serialization" (§4.1; App. A.1).
- **Cohort:** 173 of Bench4Opt's 197 base problems, chosen from the reference models alone (20 went to a pilot, 4 quadratic ones were unsupported) and frozen before generation (§5.1; App. G.1).
- **Protocol:** gpt-5.4, claude-sonnet-4-6 and Qwen3.5-397B-A17B; one generation per cell at temperature 0.0, no repair or resampling, one frozen prompt; a 30 s cap on running the program and one 120 s cap on the whole E1–E6 evaluation of a pair (§5.1; App. F.4).
- **Baselines:** solver-based value matching and the ORGEval-style structural comparison (§5.1). Gurobi, an optimization solver, builds and exports models and backs the baselines; it "does not certify any E1–E6 conclusion" (§4.1).

## Approach

- **Pipeline** (Fig. 1; App. F.1, Alg. 1): run the program and ingest its model exactly (E0); if that fails, E1–E6 are ABSENT. Try every map in the declared family (E1); with none admissible, E1 is UNKNOWN, never FALSE (§3.2). Then run E2–E6 and report a decided fact only if the independent verifier accepts its evidence.
- **E2** (§3.3; App. C): an exact-rational LP oracle searches for Farkas multipliers or a separating point in each direction; bounded 0–1 systems are enumerated (§4.1). TRUE if some map is certified equal, FALSE_WITHIN_DECLARED_UNIVERSE as above, else UNKNOWN, a policy that "deliberately sacrifices recall" (§3.3). Prop. C.6: TRUE means a named admissible map makes the feasible sets equal, FALSE_WITHIN that no map of the complete declared universe does, and neither covers maps outside the declared grammar.
- **E3** (§3.3; App. D, Prop. D.1): if the projection sends the candidate's feasible set into the reference's, the section sends the reference's into the candidate's, and projection after section is the identity, then the reference's feasible set is exactly the projection of the candidate's. Cases outside this one schema yield UNKNOWN.
- **E4–E6** (§3.4; App. E): Prop. E.2: if the senses agree and, on paired feasible points, the candidate's objective is a positive multiple of the reference's (through the map) plus a constant, E4 holds. E5 uses weak duality for continuous LPs only (Prop. E.4) or implication from E2/E3 equality with a preserved objective; bounded 0–1 cases "may instead use exact enumeration" (§3.4; App. E.2). Prop. E.6: if the map is a bijection between the feasible sets and E4 holds, it pairs the optimizers one-to-one; E6 is "positive-only in the current envelope" (§3.4).
- **Verifier** (§4.2): construction and acceptance are separate code paths; the verifier "does not trust solver status, LLM text, cached verdicts, or floating-point tolerances".

## Results

Authors' claims, for GPT-5.4, Claude Sonnet 4.6 and Qwen3.5-397B-A17B in that order.

- **Stages** (§5.2; Tab. 3): E0 is TRUE in 334, 156 and 196 of 346 cells. Among those, E1 finds a map in 82.9%, 83.3% and 83.7%. Among cells with a map, E2 is decided in 41.2%, 34.6% and 53.0%, which "does not define a global winner" (§5.2).
- **Baselines** (§5.2–5.3; Tab. 2): 49, 35 and 25 cells pass E0 yet carry a certified negative on at least one supported relation; "An execution-only evaluator would count every one of these as successful" (§5.2). The ORGEval-style baseline returns not_equivalent on 25, 8 and 18 cells where E2 certifies mapped feasible-set equality, which "does not by itself assert objective-order, optimal-value, or optimizer-set equivalence" (§5.3). "No batch exhibits a strict value-match false acceptance" (§5.3).
- **Re-verification** (§4.1; Tab. 3): all emitted certificates and witnesses were re-verified, in all three runs.
- **Abstention** (§5.4): no cell gets a decided E3; at least one dimension hits the 120 s cap in 70, 35 and 39 cells.
- **Prompts** (§5.4; App. I.1): Structured prompts show descriptive gains in E1/E2 coverage for GPT and Sonnet, "but no exact McNemar test survives Holm correction" (a multiple-testing adjustment).

## Limits the authors state

- "broader claims require more models and repeated sampling"; "Results may depend on provider-specific serving, and one sample per cell cannot quantify generation variance" (§6).
- Quadratic and general nonlinear models yield UNKNOWN_UNSUPPORTED (§6).
- "The finite E1 grammar is incomplete, E3 supports only the declared affine-lift schema, and E6 has no certified-negative type" (§6); "general-integer containment remains incomplete" (App. L).
- "the frozen cohort is not a random population sample" (§6).
- "empirical coverage of projected equivalence remains unestablished" (§6).
- The guarantees rest on "the correctness of the independent verifier", among other conditions, and "do not prove that the reference model captures the source natural-language intent" (App. L); the safeguards "reduce but cannot eliminate implementation defects" (App. L.2).
- "We claim neither universal superiority, state-of-the-art generation, nor completeness over all mathematical programs" (§5.4).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the authors describe "The accompanying reproducibility archive" (App. G.1): code, cohort records, per-cell profiles, candidate programs where available and analysis scripts, but not Bench4Opt itself (App. J.1).
- **To reuse it:** a reference model per problem (§4.2) and candidates that export LP or MPS (§4.1); Gurobi, Python's `fractions.Fraction`, NetworkX and NumPy (App. G.3); a local Bench4Opt copy (App. J.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/prove-general">prove-general</a></span>
