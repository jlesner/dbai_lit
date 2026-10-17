# claimcheck: Measuring and Improving Specification Faithfulness

**claimcheck** · preprint 2026 (PDF p. 1 footer: NeurIPS 2026 Workshop on AI for Verifiable Coding)

Read: [PDF](https://arxiv.org/pdf/2610.17358) · [arXiv](https://arxiv.org/abs/2610.17358)  
Code: [claimcheck](https://github.com/metareflection/claimcheck)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Checks whether a formal artifact means what its English requirement asks, a question no verifier asks: one model translates the artifact into English without seeing the requirement, and a second model, the judge, compares that text with the requirement (abstract; §3, Fig. 1).
- A benchmark of 3,234 requirement–artifact rows over Dafny contracts (from CloverBench) and Lean 4, Isabelle and Rocq theorem statements (from PutnamBench), about a third of them meaning-preserving rewrites kept as faithful, proved equivalent by Dafny or a Lean tactic list or argued once per propositional rule, so that spotting an edit no longer scores (abstract; §2, Tab. 1); compared with a single call shown both sides, and with that call given the judge's rewrite list, plus ablations and a sweep of four judges (§4, Tabs. 2–4).
- A blind back-translation check of intent outside SQL, measured against a direct judge given the same information: the authors report a gain of 4.2 to 6.0 points of macro recall over that informed single call (abstract; Tab. 2), and, for judges that also see the artifact, a gain that shrinks as the judge gets stronger (abstract; §5.3). Its proved-equivalent controls are a recipe for judge benchmarks that edit detection can't score (§2).

## In plain words

A program verifier proves code meets its formal specification, but never sees the English requirement behind it, so it cannot tell whether the specification asks for the right thing. This matters more, the authors argue, as LLMs write both code and specifications: a proof of a narrower property than requested "passes every check" (abstract). Their benchmark pairs requirements with formal texts in four languages; a third are meaning-preserving rewrites, so a judge cannot score by spotting edits (abstract). Their tool claimcheck has one model describe the formal text in English without seeing the requirement, and a second compare the two English texts (§3). With Claude Haiku 4.5 describing and Claude Sonnet 4.6 judging, it scores 8.2 to 9.8 points of macro recall (the average hit rate on faithful and unfaithful rows) above one call shown both sides, and 4.2 to 6.0 above that call given the same rewrite list (abstract; Tab. 2). For four judges that also see the formal text, the gain shrinks with judge strength, to within a point of the informed single call for the strongest (abstract). The describe-then-compare step "is not new", they say (§6).

## Background and terms

**Terms to know:** [formal specification](#/glossary/formal-specification) · [programming by contract](#/glossary/programming-by-contract) · [autoformalization](#/glossary/autoformalization) · [back-translation](#/glossary/back-translation) · [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [mutation testing](#/glossary/mutation-testing) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [macro recall](#/glossary/macro-recall-balanced-accuracy) (the mean of the `confirmed` and `disputed` recalls, with 95% intervals, Tab. 2 caption)

**The paper's own terms:**
- **spec formalization**: "given a natural-language requirement, produce a formal artifact whose meaning matches it" (§1).
- **requirement, formal artifact, context**: a row's English statement, the formal text meant to express it, and what is needed to read that text (§2). In Dafny (a language whose verifier checks code against contracts) the artifact is the contract: declaration, `requires` and `ensures` clauses (preconditions and postconditions), body stripped (§2.1). In Lean 4, Isabelle and Rocq (three proof assistants) it is a theorem statement, and the requirement is the problem's English statement (§2.2).
- **informalization** (also **back-translation**): the English account of what the artifact guarantees, written by the **informalizer** model without seeing the requirement; the **judge** model compares it with the requirement (§1, §3).
- **`confirmed` / `disputed`**: labels and verdicts: the artifact means what the requirement asks, or not (§2).
- **semantic mutation**: an edit to one side of a correct pair that changes its meaning, labelled `disputed`; a **control mutation** (control) rewrites the artifact keeping its meaning and stays `confirmed`, and has to be "shown to preserve meaning, not merely intended to" (§2).
- **baseline** and **baseline + list**: one call shown requirement, artifact and context, answering `YES` or `NO`, with no system message, worked examples, reasoning instruction or failure vocabulary; then the same call also given the judge's list of claim-preserving rewrites and kinds of mismatch, verbatim from the judge's tool (§4 "Baseline").
- **slice**: the benchmark's part for one language (§2).

**Builds on:**
- Clover (Sun et al., 2024), "the closest" work: it regenerates a docstring from the annotations without seeing the original and asks GPT-4 whether the two match; its CloverBench (textbook Dafny programs with docstrings and a taxonomy of incorrect variants) supplies the Dafny slice (§2.1, §6). Not on this site.
- PutnamBench (Tsoukalas et al., 2024): competition problems formalized in Lean, Isabelle and Rocq, one English statement per problem; source of the other slices (§2.2). Not on this site.
- Informalization and round trips: Wu et al. (2022), who proposed back-translation as a source of training data, and Amrollahi et al. (2026), a round trip whose two formalizations an SMT solver (an automatic logic solver) compares (§1, §6; [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)")).
- Direct judges shown both sides, which the baseline stands for: ProofFlow (Cabral et al., 2026), Zhang et al. (2026), FormalAlign (Lu et al., 2025) (§1, §6). Not on this site.

## Problem and setting

- **The question:** does comparing two English texts, one written blind to the requirement, catch unfaithful formal artifacts better than a model shown both sides (§1, §3)?
- **The benchmark:** 3,234 rows, 1,854 `confirmed`, 1,029 of them controls (§2); Dafny 362 rows from CloverBench; Lean 4 1,296, Isabelle 920, Rocq 656 from PutnamBench (§2, Tab. 1).
- **What "correct" means:** labels come from construction (which side was edited, by which rule) and, for controls, a proof or a per-rule argument that the rewrite keeps the meaning (§2.1–2.2). Every defective Dafny row still passes Dafny's verifier (§2.1).
- **Artifacts:** single contracts or theorem statements, short enough to view at once (§7). PutnamBench's answer constants are substituted back, "since a statement about an opaque constant reads as vacuous whatever it says" (§2.2).
- **Models:** informalizer `claude-haiku-4.5`, judge and baseline `claude-sonnet-4.6`, temperature 0, outputs through a tool call, one row per call, no row name in the prompts (§4 "Settings"; Tab. 2 caption). Sweep judges `gemini-3.7-flash`, `gpt-5.6-luna` and `deepseek-v4-pro` (reasoning off), through OpenRouter (an API gateway to many models) (§4). Runs are scored on the rows they answered (§4).

## Approach

- **The tool** (§3, Figs. 1–2): *informalize* reads the artifact and context, never the requirement; *compare* reads the requirement and the informalization, returns a verdict and names the discrepancy (e.g. `postcondition-too-weak`, Fig. 1). An informalization written with the requirement in view "would tend to echo it, and a near miss would read as a hit" (§3). A variant also shows the judge the artifact.
- **Prompt changes** (§4 "claimcheck"): the informalizer gets a list of structure carrying no meaning (e.g. a double negation, a conjunction with an always-true clause) to discard; the judge's tool lists per-language rewrites that leave a claim unchanged and kinds of mismatch; the judge is asked plainly whether the two express the same guarantee, where the original wording told it to be strict and to prefer flagging a mismatch.
- **Dafny slice** (§2.1; App. B, Tab. 5): 62 originals `confirmed`; classes `C1` (docstring mutated), `C2` (contract) and `C6` (contract and body) `disputed`; 118 controls over 45 programs, each kept only if Dafny proves it equivalent to the original under its preconditions, and only if Dafny cannot also prove that postcondition false, which "would make the equivalence vacuous" (true only trivially). Class `C3` is left out: its pairs often still agree, not reliably enough to label by rule in either direction (App. B).
- **PutnamBench slices** (§2.2, Tab. 1): five control rules, `true_and` (adds an always-true conjunct), `or_false` (adds an always-false disjunct), `double_neg` (adds a double negation), `forall_not_exists` (states a universal claim through its dual: no counterexample exists) and `iff_comm` (swaps the two sides of an if-and-only-if), and four semantic ones: `negate` (replaces the statement by its negation), `forall_to_exists` (yields a strictly weaker statement), and the Lean-only `bump_const`, which moves a numeral, and `strictness`, which loosens or tightens an inequality. Lean proves each control equivalent per row in PutnamBench's project under a fixed tactic list; in Isabelle and Rocq the rules are propositional schemas valid for every statement, argued once per rule.
- **Ablations and sweep** (§4): held-out rules (some rewrites removed from the lists, to test whether they act as an answer key); no back-translation (the judge compares requirement and artifact directly); informalizer sees requirement; and a sweep repeating both baselines and the variant whose judge also sees the artifact with three other judges, the informalizer fixed at `claude-haiku-4.5`.

## Results

The authors' claims, macro recall unless stated.
- **Main** (§5.1, Tab. 2): the zero-shot baseline reaches 79.6 to 84.0; claimcheck is 8.2 to 9.8 points higher on all four languages.
- **Against baseline + list** (§5.1, Tab. 2): 4.2 to 6.0 points higher, mostly on faithful rows, originals and controls alike; disputed recall rises on Dafny and falls elsewhere, most on Lean. Paired on the same rows, claimcheck fixes more of that baseline's errors than it introduces on every language (exact McNemar tests).
- **Judge also sees the artifact** (§5.1, Tab. 2): 1.4 to 4.5 points below claimcheck; it disputes more faithful rows.
- **Ablations** (§5.2, Tab. 3): removing the back-translation costs 2.8 to 6.0 points against the variant it runs on, ending below baseline + list everywhere; letting the informalizer see the requirement costs 0.8 to 3.0, on the disputed side, "the direction Section 3 predicts"; held-out rules move macro recall by at most 0.8, inside every interval.
- **Model sweep** (§5.3, Fig. 3; App. A, Tab. 4), for the variant whose judge also sees the artifact: over their zero-shot baselines `gpt-5.6-luna` gains 18.6 to 25.2 and `deepseek-v4-pro` 6.2 to 27.5, while `gemini-3.7-flash`, the strongest single call, ends within a point of its list baseline on every language. The authors call the gain "substitutive rather than additive" (§1.1).

## Limits the authors state

- The benchmark "may not be hard enough to separate systems clearly": single calls already score high, so "differences between systems compress into a few points" (§7).
- In Isabelle and Rocq `negate` is most of the disputed rows and "the easiest defect in the benchmark to catch", so those slices separate systems almost only on the confirmed side, where "the three trivial wrappers are about 45% of the rows"; Lean and Dafny are "where the disputed half discriminates" (§7).
- Semantic mutations rest on their rule; for `bump_const` and `strictness` "that is intent alone", since such a change "will in rare cases leave a statement equivalent to the one it replaced" (§7).
- Artifacts whose meaning lives in their structure, and developments too long to read in one pass, "are outside what we measure; finding such tasks is the main thing we would change before making a stronger claim" (§7).
- The list block given to baseline + list "mentions fields a bare YES/NO tool does not have" (§4 "Baseline").
- Earlier runs put row identifiers that record how a row was built into the claimcheck prompts only; they "are superseded and we do not reproduce them here" (App. C).

## Open problems and building blocks

- **Open:** labelling Clover's `C3` rows by hand "is future work"; Clover's annotation of how each variant diverges is kept, so a directional question (e.g. should a contract guaranteeing more than its docstring count as unfaithful?) "can be asked as a filter rather than baked into the labels" (App. B).
- **Released:** "Our code is available" (§ "Code Availability"); "The released code and data include" the earlier SQL slice derived from Spider (a text-to-SQL benchmark) and the superseded runs (App. C).
- **To reuse it:** two model calls per row, with per-language rewrite lists and error vocabularies, contract-shaped for Dafny and proposition-shaped for the others (§4 "Settings"). The controls were checked with Dafny's verifier and, for Lean, in PutnamBench's project; "no Isabelle or Rocq installation enters the construction" (§2.2).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
