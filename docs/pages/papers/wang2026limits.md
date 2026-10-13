# Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning

**Know Your Limits** · (LLMs as solvers and autoformalizers in legal reasoning), preprint 2026 (accepted by the AI4Law and AI4Math workshops at ICML)

Read: [PDF](https://arxiv.org/pdf/2606.16118) · [arXiv](https://arxiv.org/abs/2606.16118)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares three ways of deciding whether a contract clause entails, contradicts or is neutral to a hypothesis: the LLM classifies the text directly, the LLM classifies after autoformalizing both into first-order logic, and the Z3 SMT solver decides over that formalization; on a hand re-annotated subset of ContractNLI, with five LLMs (abstract; §1; §3).
- Labels redefined by satisfiability (entailed when premise ∧ ¬hypothesis is unsatisfiable), 400 examples re-annotated by hand and grown to 610 with minimal pairs that add the missing assumption (§3.1, Tab. 1); a four-stage autoformalization prompt, Z3 Python code repaired from its error messages for up to three rounds (§3.2; App. A.1); three failure modes named in its error analysis, two of them from disagreements between the LLM's and the solver's verdicts and one from faulty Z3 code (§5.4).
- Evidence that an LLM asked to reason over a solver formalization can't stand in for running the solver: the authors name "scope laundering", classifications presented as if solver-derived that actual solver execution doesn't give, and report it in every model, up to 52.5% for Qwen when invalid inputs are counted (§5.4). They attribute the LLMs' higher accuracy to implicit or unverified assumptions that are absent from the formalization the solver checks (§5.1–5.2).

## In plain words

LLMs score well on reasoning, but the authors say it is unclear "whether this reflects faithful logical inference or heuristic approximation" (abstract), and that legal use needs "faithful and verifiable reasoning" (§1). They test this on contract clauses: does a clause support a statement, rule it out, or neither? They relabel part of a contract dataset under strict logic and compare three ways of answering, with five LLMs: from the text; by the LLM reading its own translation of both texts into logic; or by a logic solver run on that translation (abstract; §1).

The authors report that adding formal structure helps, with the LLM reading its own translation reaching "the highest accuracy for several models" (§4.1): for Claude Sonnet 4.6, 83.0%, against 74.5% for the solver and 63.1% from the text alone (Tab. 3). But they find this does not mean faithful reasoning: in every model, the LLM reading its translation sometimes gives a definite answer, presented as solver-derived, where running the solver gives none (abstract; §5.4). They present the work as "a systematic study" (§6).

## Background and terms

**Terms to know:** [autoformalization](#/glossary/autoformalization) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [Cohen's kappa](#/glossary/cohens-kappa) · [natural language inference (NLI)](#/glossary/natural-language-inference-nli) (ContractNLI's entailment tasks on contracts, §2; labels redefined in §3.1)

**The paper's own terms:**
- **autoformalization**: an LLM translating natural-language legal text (premise and hypothesis) into first-order logic (FOL) that a solver can check (§1; §3.2).
- **Entailment, Contradiction, Neutral** (§3.1 "Label Redefinition"): a hypothesis is entailed by a premise when premise-and-not-hypothesis is unsatisfiable, contradicted when premise-and-hypothesis is unsatisfiable, and Neutral otherwise. Neutral covers both unrelated hypotheses and hypotheses the premise can't support "without additional assumptions".
- **minimal pairs** (§3.1 "Dataset Augmentation"): for an example labelled Neutral because information is missing, a minimally changed hypothesis that supplies the missing assumption and so becomes entailed or contradicted.
- **The four modes** (Tab. 3 caption): **Simple**, the LLM classifies with the annotation guideline (App. A.2) as its prompt; **Structured**, the LLM classifies with "the same prompt as LLM-Formal Reasoning, but direction classification as outputs"; **LLM-FR** (LLM-based formal reasoning; "LLM-Formal" in Tab. 4), the texts are autoformalized and the LLM produces the classification; **Solver-FR** ("Z3-Formal" in Tab. 4), the Z3 solver classifies the autoformalized texts.
- **Invalid** (App. A.1): no code returned, unparseable output, or code that "failed the premise sanity check by yielding a contradictory result" (the premises alone came out contradictory), after three rounds of repair.
- **scope laundering, implicit constraint blindness, program synthesis failures**: the three failure modes the paper names (abstract; §5.4), defined under Results.
- **faithfulness**: not defined formally; contrasted with "heuristic approximation", and asked of LLM-based formal reasoning "as a proxy for symbolic execution" (running the solver; abstract).

**Missing glossary terms:** none.

**Builds on:**
- ContractNLI (Koreeda & Manning, 2021), an NLI dataset derived from 607 non-disclosure agreements (NDAs), which the paper re-annotates; the authors call it "the only publicly available real legal contract dataset" (§2; §3.1).
- Neuro-symbolic pipelines in which an LLM formalizes and a solver reasons, such as Logic-LM (Pan et al., 2023; [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), cited with Vakharia et al. (2024) for formalizations that "are often incomplete or inconsistent" (§2).
- Work that uses the LLM itself as the solver (Li et al., 2024; Xu et al., 2024; Feng et al., 2024), which the authors say did not test whether its gains "came at the cost of faithfulness to the results generated by the symbolic solver" (§2).
- Round-trip equivalence checking of formalizations (Amrollahi et al., 2026; [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)")), which the authors say "does not study which unstated assumptions are justified" (§2).

## Problem and setting

- **Question:** does the accuracy gain from formal structure reflect faithful reasoning, and where do the modes fail (abstract; §1)?
- **Data:** a subset of ContractNLI re-annotated by hand under the strict definitions: 400 examples, grown to 610 with minimal pairs (§3.1). Two annotators (Tab. 2); "In cases of disagreement, a logician adjudicates the final label" (§3.1 "Dataset Label Annotation"). The annotation guideline asks for "strict textual entailment, not general plausibility or likely interpretation" (App. A.2).
- **Models:** GPT-OSS-120B, Claude Sonnet 4.6, Llama-3.1-8B, DeepSeek-V3.2, Qwen2.5-72B (§1).
- **Formalism:** FOL, run as code for the Z3 SMT solver's Python interface (§3.2.2; §5.4; App. A.1).
- **Metric:** accuracy against the re-annotated labels, with a majority-class baseline of 48% (Tab. 3 caption), and the share of each kind of misclassification (Tab. 4).
- Decoding settings and the number of runs per model: not discussed.

## Approach

- **Autoformalizer** (§3.2.1), a structured prompt in four stages: (1) find the clauses relevant to the hypothesis, following legal practices such as IRAC (Issue, Rule, Application, Conclusion: a common outline for legal analysis); (2) align expressions with the same meaning in premise and hypothesis (predicate normalization); (3) translate both into FOL, prompted also "to encode assumptions in legal contract context as explicit logical statements"; (4) global constraints, such as "prohibiting degenerate solutions (e.g., non-existence assumptions)". Fig. 2 shows the pipeline.
- **Solver** (§3.2.2): Z3 classifies by the satisfiability checks above. The same model is also prompted to classify over the formal representations itself (LLM-FR); comparing the two is meant to separate errors of formalization from errors of reasoning over the formalization.
- **Code repair** (App. A.1): code that fails is sent back to its model with the error message, for three rounds; code still broken is marked Invalid.
- **Failure modes** (§5.4), named from the error analysis:
  - **scope laundering**: the LLM gives Entailment or Contradiction while actual solver execution gives Neutral, "reasoning informally and presenting its output as if derived from symbolic execution";
  - **implicit constraint blindness**: the solver gives the correct non-neutral answer and LLM-FR does not, because the LLM overlooks constraints in the formalization, "such as universals encoded within existential structures" (a for-all condition nested inside a there-exists);
  - **program synthesis failures**: wrong Z3 code, such as sort mismatches (a sort is a Z3 type), malformed quantifiers and type inconsistencies.

## Results

- **Re-annotation** (§3.1, Tab. 1): most label changes under the strict definitions are to Neutral: 71 examples from Entailment to Neutral and 18 from Contradiction to Neutral. The authors read this as "a systematic gap between pragmatic interpretation and formal reasoning" (§3.1).
- **Agreement** (Tab. 2): 81.0% between the two annotators, Cohen's κ 0.627 ("Substantial"), with disagreements "concentrated between Entailment and Neutral" (§3.1).
- **Accuracy** (Tab. 3): the authors report that structure improves performance, with LLM-FR reaching "the highest accuracy for several models", and that solver-based classification is "the most conservative" (§4.1). The table's highest value is Claude's LLM-FR (figures above); Llama is lowest in every mode.
- **Error patterns** (§4.1; Tab. 4): Simple and Structured often turn Neutral into Entailment, which the authors read as "reliance on implicit assumptions"; Solver-FR labels many examples Neutral "due to insufficient information"; confusions between Entailment and Contradiction are rare.
- **Scope laundering** (§5.4): found in all models, from 15.3% for GPT up to 52.5% for Qwen (28.6% if invalid inputs are excluded). Implicit constraint blindness is found across models at lower rates.
- **Code** (§5.4; App. A.1, Tab. 5): Claude "performs best" at writing Z3 code and Llama "performs poorly", "often mixing SMT-LIB with Python or failing to produce executable code" (SMT-LIB: the solver's own text input language). The share of Invalid code after repair runs from 0 for Claude to 28.7% for Llama; the authors attribute Claude's result to "a much more significant exposure to Z3 python code compared to other models" (App. A.1).
- **Autoformalization** is "the primary bottleneck in neuro-symbolic systems" (§5.3): even with explicit instructions to surface assumptions, the formalizations "remain incomplete or incorrect", and autoformalization "can introduce ungrounded assumptions" (§5.3 example; §5.4 "Translation Error Analysis").
- **Interpretation** (§5.1–5.2): "it is fundamentally unclear which assumptions are permissible in legal reasoning, and LLMs frequently introduce ungrounded ones"; LLM-based methods "achieve higher accuracy by leveraging implicit or unverified assumptions".

## Limits the authors state

- "The dataset is relatively small and drawn from a single source, with an imbalanced label distribution" (§5.5).
- "Annotation remains subjective in edge cases, particularly when distinguishing between 'entailment' and 'neutral'" (§5.5); the labels reflect "the specific interpretations and educational backgrounds of our annotators" and may not fit all jurisdictions (Ethics Statement).
- Some autoformalization outputs stayed invalid after the three-round repair and "required manual correction due to execution errors" (§5.5).
- The goal "is not to optimize benchmark performance" but to examine how the reasoning modes diverge under strict logical semantics on long, complex legal sentences (§5.5).
- The code-repair findings are not claimed for other code: "our situation is limited to Z3 python code that follows a specific format" (App. A.1).
- The models are "general-purpose systems not specifically optimized for legal autoformalization" (§5.6 "Learning for Faithful Formalization").
- The reasoning's fidelity "is strictly dependent on the quality of the autoformalization stage, which remains susceptible to translation errors" (Ethics Statement).

## Open problems and building blocks

  - The bottleneck they name: autoformalization (§5.3), and deciding "which implicit assumptions should be made explicit" (§5.3).
  - Larger and more diverse datasets (§5.5).
  - Better autoformalization: normalizing synonyms with embeddings or legal ontologies, splitting the pipeline into specialized agents, document-level reasoning across clauses, and richer formalisms such as deontic logic (a logic of obligations and permissions) (§5.6 "Improving Autoformalization").
  - Surfacing Minimal Correction Subsets (MCS) with SMT solvers, following Singh et al. (2026): "the minimal set of axioms whose acceptance would shift the classification from Neutral to Entailment or Contradiction", presented to legal practitioners "as structured entry points for resolving ambiguity"; also, integrating structured legal knowledge, such as ontologies or rule-based systems, with LLMs that propose context-dependent assumptions (§5.6 "Assumptions and Ambiguity…"; §6).
  - Training with solver feedback, "such as satisfiability signals", and training curricula and benchmarks for legal autoformalization (§5.6 "Learning for Faithful Formalization").
- **Released:** Nothing stated. The annotation guideline, also the Simple prompt, is printed in App. A.2.
- **To reuse it:** Z3 through its Python API, an LLM that writes Z3 code, up to three repair rounds per example, and manual correction for some outputs (App. A.1; §5.5). No run time or cost stated.
- **Beyond its domain:** "This framework extends to domains such as financial regulation and cybersecurity compliance" (§5.6 "Beyond Legal Domain").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/smt-misc">smt-misc</a></span>
