# Faithful Autoformalization via Roundtrip Verification and Repair

**Faithful Autoformalization via Roundtrip…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.25031) · [arXiv](https://arxiv.org/abs/2604.25031)  
Code: [roundtrip-autoformalization](https://github.com/daneshvar-amrollahi/roundtrip-autoformalization)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Checks an LLM's translation of a natural-language rule into logic with no reference translation: formalize, translate back to English, formalize again, and ask an SMT solver whether the two formalizations are equivalent; when they are not, an LLM judge names the first translation step that lost meaning and only that step is repaired (abstract; §3–§4, Alg. 1).
- Many-sorted first-order logic in SMT-LIB over a hand-and-LLM-built domain schema, checked by Z3, on rules from two Texas statutory codes with Claude Opus 4.6 and GPT-5.2; compared with no repair, repair of a random step and full regeneration (§6, Tab. 1); a bidirectional NLI model (BART-large-MNLI) serves only as an after-the-fact check of meaning (§5).
- A round trip ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)")) that ends in a solver's equivalence verdict and starts from natural language, with blame assigned to one step: evidence that the blame step can be the weak part (GPT's sequential diagnosis picks the first step almost always, §7.5, Tab. 3) and that agreement is not faithfulness: the check can't see an error both formalizations share (Limitations), and the authors report that about 16% of formally equivalent rules still drift on NLI (§8).

## In plain words

When an LLM translates an English rule into machine-checkable logic, there is usually no correct translation to compare with, so nobody knows whether the meaning survived. The authors say existing evaluations check only well-formedness or later task success, not meaning, and repair regenerates everything (§1). Their check translates the rule into logic, back into English, and into logic again, then asks a solver (a program that decides logic questions) whether the two logic versions agree. If not, an LLM names the first step that went wrong and only that step is redone. On rules from two Texas statutory codes with Claude Opus 4.6 and GPT-5.2, under their full repair system, rules that fail the check drift from the original meaning 1.4× to 2.5× more often than rules that pass, as judged by a model of whether one sentence follows from another (abstract). Targeted repair leads when Claude does every step; GPT's diagnosis is unreliable, and a Claude diagnoser restores the lead at lower cost (§1). They present a framework; to their knowledge, none of the repair systems they discuss pins the error on one step (§2).

## Background and terms

**Terms to know:** [autoformalization](#/glossary/autoformalization) · [back-translation](#/glossary/back-translation) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reference-free evaluation](#/glossary/reference-free-evaluation) · [natural language inference (NLI)](#/glossary/natural-language-inference-nli) (run both ways between a rule and its back-translation, §5) · [many-sorted first-order logic](#/glossary/many-sorted-first-order-logic) (named in §1; sorts declared in App. B, Listings 2–3)

**The paper's own terms:**
- **autoformalization**: "the automatic translation of natural-language statements into formal, machine-checkable representations" (§1); here statutes into logic.
- **stages T1, T2, T3**: formalize the rule (T1, giving the original formalization), translate it back into English (T2), formalize that English again (T3, giving the roundtrip formalization) (§1, §3). Each is one stateless LLM call (§6.2).
- **UNSAT and SAT**: Z3's verdicts on whether the two formalizations can differ: UNSAT means equivalent, SAT means not (§6.2). Unknown or error verdicts are counted with SAT (Tab. 5 caption).
- **domain schema**: per corpus, a fixed vocabulary of SMT declarations (object types, functions, predicates) put into every prompt; drafted by hand, extended by an LLM, curated against design principles (§6.2, App. B).
- **diagnosis function**: an LLM judge that reads the rule, both formulas and the back-translation, and returns the first failed stage with an explanation limited to that stage's input and output (§4.1). The **sequential checking protocol** makes it check stages in order and stop at the first problem (§4.1; App. A, Listing 1).
- **scoped repair (operators R1–R3)**: an LLM call that fixes only the diagnosed stage's output, guided by the explanation; later stages are rerun and the check repeated (§4.2–4.3, Alg. 1).
- **No Repair, Random Stage, Regenerate, Full**: keep the first verdict; repair a random stage (no diagnosis); rerun the whole pipeline (no scoping); diagnosis plus scoped repair (§6.3).
- **drift**: the share of rules whose back-translation the NLI model classes as Unrelated or Contradiction to the rule, two of the six categories of the NLI check (§5, Fig. 3; Tab. 2 caption).

**Missing glossary terms:** none.

**Builds on:**
- Autoformalization as posed by Wu et al. (2022) (§1).
- Roundtrip agreement in machine translation, and roundtrip correctness in code generation, Allamanis et al. (2024) ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)")) (§2).
- "Closest to our setting": Karia et al. (2025) (AutoEval), which starts from grammar-generated formulas and so measures how well LLMs translate, not a given input's formalization (§2).
- LLMs translating problems for a solver: Pan et al. (2023) ([Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), Olausson et al. (2023) (LINC), Ye et al. (2023) (SATLM), with Logic-LM feeding solver errors back; where feedback drives repair, the authors say, the system regenerates the artifact it checked (§2).

## Problem and setting

- **Question:** "when an LLM produces a formalization, how do we know it faithfully captures the meaning of the original text?" (§1), with no ground-truth formalizations, and how to repair failures.
- **Formalism:** the framework needs only well-formed expressions and a notion of equivalence (§3). Here: many-sorted first-order logic in SMT-LIB (the solvers' input language), with Z3 4.15.3 deciding equivalence; all queries resolve in under one second (§6.2). Up to five LLM attempts per formula fix syntax errors (§3).
- **Data:** 150 rules from the Texas Transportation Code (traffic) and 77 from the Texas Parks and Wildlife Code (wildlife) (§6.1); one wildlife rule is left out of GPT counts (Tab. 1 caption). Rules are formalized one at a time (Limitations); how they were chosen is not discussed.
- **Models:** Claude Opus 4.6 and GPT-5.2, temperature 0.3, same prompts; at most three repair iterations; one run per reported result, plus two replicates (§6.2, App. G).
- **What "correct" means:** agreement of the two formulas is "necessary but not sufficient": both can settle on a meaning that differs from the rule (§3). Meaning is checked by an NLI model, BART-large fine-tuned on MultiNLI (a dataset of sentence pairs labelled for entailment), comparing rule and back-translation, "only for post-hoc analysis", never inside the repair loop (§5, §6.2).

## Approach

- **Roundtrip check (§3, Fig. 1).** If T1 captured the rule, going back and forth should recover the same formal meaning; a disagreement points to the step that lost it (§3).
- **Diagnosis and scoped repair (§4, Fig. 2, Alg. 1).** On SAT the judge, told that "Z3 returned SAT" (Listing 1), names the stage; its repair operator rewrites that output; since this invalidates later stages, they are regenerated and the check reruns, until equivalence or the iteration limit.
- **NLI cross-check (§5, Fig. 3).** Entailment both ways asks whether anything was lost or added; a decision tree with fixed thresholds on the probabilities assigns one of six categories.

## Results

- **Repair (§7.1, Tab. 1).** The authors report that on traffic with Claude Full reaches 85.3% verified-equivalent rules against 66.7% for Random Stage and 64.7% for Regenerate, from 44.7% with no repair, with the fewest LLM calls per repair. With GPT diagnosing its own pipeline, Regenerate beats Full on equivalence in both domains, and Full costs most, since repairing T1 forces fresh T2 and T3 calls (§7.2).
- **Diagnosis (§7.2, §7.5, Tab. 3).** Claude spreads its diagnoses over the stages, concentrating on T3; under the sequential protocol GPT picks T1 in 83% of iterations on traffic and 97% on wildlife. Random Stage is roughly uniform, so the authors attribute the concentration to the diagnosis function, not the data.
- **Fixing GPT's diagnosis (§7.5).** Re-diagnosing GPT's failed rules without the in-order instruction makes T1 a minority choice on both domains: "The protocol explains most of the collapse." With Claude as diagnoser only, equivalence rises and cost per repair falls on both domains, and Full regains its lead (Tab. 1): "The diagnosis function was the bottleneck, not the pipeline or the repair operators."
- **Formal agreement against meaning (§7.3, Tab. 2, Fig. 4).** Under Full, rules not verified equivalent drift 1.45× to 2.52× more often than verified ones across the four domain-model pairs; the gap holds with the baselines included and before any repair (App. E, Tab. 6). "About 16 % of formally equivalent rules still drift on NLI" (§8).
- **Residual failures (§7.4).** Inspecting rules no method repairs, the authors find missing schema vocabulary, compound AND/OR conditions, exception clauses that T2 restates positively, and thresholds that depend on another variable: "The bottleneck is intrinsic rule structure, not iteration budget."
- **Human checks (App. F, Tab. 7).** One author, blind to the verdict, judged formalizations of passing rules not faithful in 1 of 14 cases, against 3 of 11 for failing rules (all minor). On those 11, annotator and diagnosis agreed on the failed stage in 7.
- **Variance (App. G, Tab. 8).** Under Full every reported count falls inside its replicate range.

## Limits the authors state

- **Domain scope:** "Both corpora are English statutory text from Texas"; "We do not claim the framework transfers to other genres such as code or scientific text without further evaluation." (Limitations)
- **Not a proof:** the check "cannot detect errors that affect both stages in the same way", e.g. a condition T1 drops and T3 drops again (Limitations); a reported success "does not guarantee correctness with respect to the original natural-language intent" (§4.3).
- **Noisy semantic check:** the NLI cross-check "is a partial mitigation", from a general-purpose model with "known lexical-overlap biases" (leaning on shared words) on legal text, "so its drift signal is itself noisy" (Limitations); Strengthened (reconstruction stricter than the original) arises "even when the formalization is faithful" (§7.3).
- **Rules in isolation:** densely cross-referenced rules "likely" need the connected cluster as input; "We leave this to future work." (Limitations)
- **Diagnosis:** effectiveness is "contingent on the reliability of the diagnosis function" (abstract).
- **Human studies:** "a single annotator on a small sample from the Claude pipeline", read "as a directional anchor rather than an exact rate" (App. F).
- **Single runs:** one run per reported result (§6.2); on wildlife with Claude, Full's lead over Regenerate on equivalent-rule count disappears across replicates, though Full still beats Random and keeps its cost advantage (App. G).
- **Use:** outputs, "including those that pass roundtrip verification, should not be used in safety-critical applications" without "independent review by a qualified formal methods expert" (Risks).

## Open problems and building blocks

- **Open:** "Future work could integrate additional checks into the repair loop, such as NLI or an LLM-based check, rather than relying on formal equivalence alone." (§8). Named bottleneck for scoped repair: the diagnosis step, "not the pipeline or repair operators" (§8, on GPT pipelines).
- **Released:** "Code, data, prompts, and domain schemas are publicly available." (App. H)
- **To reuse it:** a formalism with an equivalence check (§3); an SMT solver and a domain schema per corpus (§6.2, App. B); API LLMs, the dominant cost (§6.2); no training (Risks).
- **Beyond its domain:** the authors say it "applies whenever a target formalism admits an equivalence check, e.g., automated reasoning tools for logical formulas, type-checkers for proof assistants, test suites for code, etc." (§1), "in principle" (§1, contribution (i)).

## On this site

- **Discussed in:** [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/smt-misc">smt-misc</a></span>
