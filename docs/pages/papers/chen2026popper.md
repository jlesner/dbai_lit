# Reason Popper-ly: Patching In-Context Reasoning with Inductive Logic Programming

**Reason Popper-ly** · accepted at the 20th Conference on Neurosymbolic Learning and Reasoning · 2026

Read: [PDF](https://arxiv.org/pdf/2607.23019) · [arXiv](https://arxiv.org/abs/2607.23019)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Checks each inferred step of an LLM's chain of thought against a table of kinship-composition rules, classifies each violation into one of four error types, rewrites the wrong step and has the LLM regenerate the rest of the trace from the corrected prefix, then answer from the repaired trace (abstract; §3.2).
- The rule table is learned offline by the inductive logic programming system Popper from composition triples extracted from the models' own traces on held-out two-hop instances, then validated against CLUTRR's gold composition table and "supplemented with any missing gold entries" (§3.1; §4); evaluated on CLUTRR kinship stories of 2 to 10 hops with three small local models and two frontier API models, against single-shot chain of thought and a pipeline where the LLM only extracts facts and the rule table composes them (§4, Tab. 1).
- A per-step symbolic check with repair, measured against chain length and model size: the authors report that at 8–10 hops it lifts Gemma-4:E4B from 14.39% to 62.74% terminal accuracy over chain of thought, with smaller gains for the frontier models (§4, Tab. 1), and that the pipeline handing the whole composition to the rule table "often matches or slightly exceeds" it on short chains but falls behind as chains grow (§4). One kinship benchmark, where "relation composition is well defined" (§6); the checker's table ends up completed from the benchmark's gold composition table (§3.1).

## In plain words

A chain of thought can contain steps that read well but do not follow from earlier ones, and the authors cite work finding that reasoning quality "degrades substantially as compositional depth increases" (§1). For puzzles about family relations, they build a checker: a table saying which relation two relations combine into (a father's sister is an aunt), learned from the models' own reasoning by a rule-learning system and completed from the benchmark's gold table (§3.1). Each derived step of the finished reasoning is checked against the table; a wrong step gets one of four error types and is rewritten, the model rewrites the steps after it, then answers (abstract; §3). On CLUTRR, a benchmark of family stories, the authors report gains over plain chain of thought for all five models and chain lengths, "up to 48 percentage points for small models and 15 points for frontier models on the longest chains" (abstract; Tab. 1), and beating a pipeline that hands all the combining to the table "on harder instances" (abstract). They present it as "a more targeted setting" than whole-problem or whole-trace methods (§1).

## Background and terms

**Terms to know:** [logic programming](#/glossary/logic-programming) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [self-correction](#/glossary/self-correction) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [exact match](#/glossary/exact-match) · [inductive logic programming (ILP)](#/glossary/inductive-logic-programming-ilp) (§2.2, Eqs. 1–2) · [answer set programming](#/glossary/answer-set-programming) (how Popper proposes candidate rules, §2.2)

**The paper's own terms:**
- **stated and inferred steps**: a step of the trace either restates information given in the input (stated) or derives new information from previous steps (inferred) (§2.1). The prompt makes the model label each step and give the indices of the earlier steps it rests on (§3.1).
- **sound step, sound trace**: an inferred step is sound with respect to a rule set if its conclusion follows from its cited premises under some rule; a trace is sound if every inferred step is (§2.1).
- **composition triple and composition table**: a triple (r1, r2, r3) says that relation r1 composed with relation r2 gives r3; the learned facts `compose(r1, r2, r3)` form a partial table from pairs of relations to a relation: not every pair has an entry (§2.2).
- **direction normalization**: turning each relation stated in the story into the direction the reasoning chain needs, with a gender-aware inverse map: from "Mildred is the daughter of Gerald", the relation from Gerald to Mildred is father (§3.1).
- **hops**: the length of the chain of relations an instance needs, binned as Short (2-3), Medium (4-5), Long (6-7) and Longer (8-10) (§4, Tab. 1).
- **endogenous and exogenous reasoning**: the two baselines. Endogenous is single-shot chain of thought, with no outside check. Exogenous uses the LLM "only to extract stated facts", then finds a path between the two queried people in a graph of the stated relations by breadth-first search and composes the relations along it with the learned table (§4 "Baselines").
- **terminal accuracy**: the share of instances whose extracted final answer exactly matches the gold relation label (§4 "Metric").
- **error types** (§3.2 "Step 2"): `wrong_rule` (right premise relations, wrong composed relation); `missing_inv` (a premise relation not inverted into the chain's direction before composing); `direction_rev` (the model predicts the inverse of the correct target relation); `hallucinated` (a premise relation not supported by the story or prior stated facts).

**Missing glossary terms:** none.

**Builds on:**
- Popper (Cropper and Morel [2021]), an ILP system "based on learning from failures": it proposes candidate rule sets with answer set programming, tests them against the examples in Prolog (a logic-programming language), and turns failed candidates into constraints that prune the search (§2.2).
- CLUTRR (Sinha et al. [2019]), the kinship benchmark used for evaluation and the source of the gold composition table (§3.1, §4).
- Logic-LM (Pan et al. [2023], [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")) and LINC (Olausson et al. [2023]), which translate a problem into formal logic and hand it to a solver, and SymbCoT (Xu et al. [2024]), which puts symbolic expressions into the chain of thought with an LLM-based verification stage: the authors contrast these as approaches that "typically operate at the level of the full problem or the full reasoning trace" (§1; §5).
- Retry-based refinement methods, Self-Refine (Madaan et al. [2023]) and CRITIC (Gou et al. [2024]), which "often discard the entire context and regenerate from scratch" (§1).

## Problem and setting

The research question: does step-level verification and repair improve terminal accuracy over both baselines below, "especially as compositional depth increases?" (§4).

- **Task:** each CLUTRR instance is a story about named family members, a query for the relation between two of them, and a gold label (§4). The answer is constrained to one of 21 CLUTRR relation labels "in order to reduce answer-format errors that are unrelated to reasoning quality" (§4 "Models").
- **Data:** 3,073 instances sampled at random, stratified across chains of 2 to 10 hops; 200 held-out 2-hop instances are reserved for rule learning and validation, and longer chains are used only at evaluation (§4).
- **Models:** three small local models, Qwen-3.5:4B, Gemma-4:E4B and LLaMA-3.2:3B, and two frontier API models, Claude Sonnet 4.6 and GPT-5.4; all get the same structured chain-of-thought prompt (§4 "Models").
- **What "correct" means:** a step is checked only against the learned table; a step whose relation pair is not in the table is "treated as unverifiable and left unchanged" (§3.2 "Step 1"). The final answer is scored by exact match with the gold label (§4 "Metric").
- **The key assumption:** the method assumes the written trace "remains causally relevant to the model's final answer, so that editing an intermediate step can redirect the downstream conclusion" (§6).
- The number of folds behind the "multi-fold evaluation" and its ± values (Tab. 1), and whether one table is learned per model or for all models together, are not discussed.

## Approach

Two phases (§3, Fig. 1):

- **Offline, learning the table (§3.1).** Each LLM writes structured traces on training stories; traces with a correct final answer give positive examples, those with a wrong one negative examples. Every inferred step that cites exactly two earlier steps yields a composition triple, after direction normalization. Popper receives these triples as examples of `compose/3` (the predicate `compose` with three arguments), with the hypothesis space (the programs the search may return) restricted to ground facts (facts without variables), so each learned clause (one fact or rule) is one table entry "rather than a higher-order rule schema" (a general rule over variables). The induced facts "are then validated against a gold kinship composition table derived from CLUTRR … and supplemented with any missing gold entries"; the result is frozen and reused for all test instances (§3.1).
- **Online, verify, diagnose, patch (§3.2).** The LLM first writes a complete trace; the procedure is post hoc and does "not intervene during autoregressive decoding itself".
  - *Verify:* each inferred step is parsed into a triple and looked up; if the pair is in the table and the table gives a different relation, the step is a violation.
  - *Diagnose:* the violation gets one of the four error types, by comparing the model's triple with the table entry and the inverse-relation map.
  - *Patch:* the step's relation is rewritten to the table's composition, keeping its people and context "as much as possible" (Eq. 3). When later steps follow from the wrong step, all steps after it are discarded and the model regenerates them "conditioned on the patched prefix and diagnosed errors". This repeats "until no further verifiable violations remain", and the repaired trace is given back to the LLM as context for its final answer.

## Results

Tab. 1 gives terminal accuracy by chain length:

- **Against chain of thought:** the authors report that "Across all models and all reasoning depths", the method outperforms single-shot chain of thought, with improvements "especially large for smaller models on long chains": at 8-10 hops Gemma goes from 14.39% to 62.74% and GPT-5.4 from 59.91% to 75.09% (§4 finding (1), Tab. 1).
- **Against the exogenous pipeline:** "At short chains, the exogenous pipeline often matches or slightly exceeds" the method; as chains grow the method overtakes it, and at 8-10 hops its advantage "ranges from 4.59 points for Claude Sonnet to 20.52 points for Gemma" (§4 finding (2)). The authors suggest that for longer chains extraction and graph-construction errors accumulate and harm the exogenous pipeline more (§4).
- **Frontier models** "still exhibit substantial degradation as reasoning depth increases", and still gain (§4 finding (3)).
- **Error types (Fig. 2):** small models show "a more balanced mix" of `wrong_rule`, `missing_inv` and `direction_rev`, with `wrong_rule` "the dominant category (43-49%)"; in frontier models `missing_inv` "accounts for 75% of GPT-5.4 errors and 78% of Sonnet-4.6 errors", while `wrong_rule` drops to 16% and 4% (§4 "Error Attribution Analysis"). `hallucinated` errors are "nearly absent across all models (0-2%)" (§4).

## Limits the authors state

- **Domain specificity:** in kinship "relation composition is well defined and grounding from natural language to structured predicates is relatively tractable through templated parsing", which "limits the immediate generality of our findings"; in domains such as legal reasoning or scientific argumentation, "both the grounding process and the induced rule space would be substantially more complex" (§6).
- **The trace may not drive the answer:** the assumption that the trace is causally relevant "is not guaranteed": "If the model has effectively committed to an answer before the full reasoning trace is produced, then patching intermediate steps may have limited influence on the final prediction". The authors say their results suggest the assumption "is at least partially valid in the evaluated setting" (§6).
- **Soundness is not correctness:** a sound trace "may still begin from incorrectly extracted or misinterpreted premises" (§2.1).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated. The paper's only code link is to the Popper system it uses (§2.2, footnote 1).
- **To reuse it:** an ILP system (Popper, §2.2); the structured, step-labelled prompt (§3.1); a gold composition table to validate and supplement the learned one (§3.1). The small models ran locally on an NVIDIA A6000 Ada GPU, the frontier ones through their APIs (§4 "Models").
- **Beyond its domain:** the authors suggest that "In compositional settings, a lightweight verifier that selectively repairs invalid steps can offer a practical middle ground between unconstrained CoT and full symbolic delegation" (§7), while §6 limits the generality of their findings (above).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
