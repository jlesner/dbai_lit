# A logic for rule-based query optimization in graph-based data models

**A logic for rule-based…** · DOOD 1993 (LNCS 760)

Read: [PDF](https://link.springer.com/content/pdf/10.1007/3-540-57530-8_8.pdf) · [DOI](https://doi.org/10.1007/3-540-57530-8_8)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A wide-spectrum algebra and refinement calculus for graph-based data models (abstract).
- Queries denote sets of possible lists ("possible results semantics", §3); `(Ref E1 E2)` holds when ⟦E2⟧ ⊆ ⟦E1⟧ (Def. 4.1).
- Set-of-lists semantics and refinement for order-sensitive rewriting, as [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) uses them; cited by [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)").

## In plain words

A [query optimizer](#/glossary/query-optimizer) turns a user's query, step by step, into an access plan (a concrete evaluation strategy), applying [rewrite rules](#/glossary/query-rewriting-and-rewrite-rules). The authors want one language for query, plan and every step between, so that optimization becomes a chain of refinements whose correctness can be proved. They cite applications such as computer-aided design that need complex (nested) objects, and optimization gains that "can be measured in orders of magnitude" (§1, PDF pp. 1–2).

They define a query algebra over databases seen as labelled graphs, where a query means the set of all ordered result lists it may return, and a logic for stating that one query may replace another. They prove its inference steps sound: what they derive holds in every database where the premises hold (§4, PDF p. 18). They show no algorithmically listable set of axioms derives exactly its true sentences (§4.1, PDF p. 20). They derive, from three storage facts and five further axioms, that an employee-index scan answers a sorted query (§4.2, PDF pp. 21–23). They call the algebra "a preliminary design" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [query optimizer](#/glossary/query-optimizer) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [relational algebra](#/glossary/relational-algebra) · [formal semantics](#/glossary/formal-semantics) · [list semantics](#/glossary/list-semantics) · [nondeterministic query](#/glossary/nondeterministic-query) · [integrity constraint](#/glossary/integrity-constraint) · [soundness and completeness](#/glossary/soundness-and-completeness) · [semantic query optimization](#/glossary/semantic-query-optimization)

**The paper's own terms:**
- **wide-spectrum**: a language that can describe "high-level non-procedural user queries, low-level procedural evaluation strategies, and any level of detail in between" (§1, PDF p. 2); non-procedural means saying what to compute, not how.
- **rule**: a sentence of the calculus, of three kinds (Tab. 1, PDF p. 6): a refinement constraint `(Ref E1 E2)`; a syntactic constraint `(Neq S1 S2)`, saying two symbols are distinct; and an inference axiom `(Clause R R1 … Rn)`: if R1 … Rn hold, R holds (Def. 4.1, PDF p. 17).
- **refinement**: `(Ref E1 E2)` holds in a database when, for every binding of the parameters, every possible result of E2 is a possible result of E1 (Def. 4.1, PDF p. 17). In the examples E1 is the request, E2 the plan.
- **non-ground rule**: a rule with placeholders (S1 for a variable name, E1 for a subquery), standing for all its ground instances; an **indexed non-terminal grammar** (a context-free grammar plus numbered placeholders and substitution) defines them (§2, PDF pp. 7–8).
- **axiom**: a rule that holds in every database; **logical consequence**: a rule that holds in every database where the given rules hold (Def. 4.1, PDF p. 17).
- **possible results semantics**: a query denotes a non-empty set of lists of tuples (§3, PDF p. 9).
- **the operators**, fifteen in all (§3, PDF p. 10; §3.4, PDF pp. 13–16), include Keep (drop columns), Filter (drop each row that agrees on the named variables with an earlier row), Nest (run the second query once per row of the first and append the results) and Sort.

**Missing glossary terms:**
- **recursive axiomatization**: a set of axioms and inference steps that an algorithm can list, from which exactly the true sentences can be derived (Thm. 4.2, PDF p. 20).
- **uniform word problem for monoids**: given finitely many equations between strings of symbols, decide whether another equation follows; [undecidable](#/glossary/decidable-and-undecidable), the paper says, citing [15] (§4.1, PDF p. 20).

**Builds on** (none on this site):
- Algebras for complex objects [2, 5, 8, 9, 10, 17, 18]; those of Becker and Güting [2] and Vandenberg and DeWitt [18] "appear to satisfy all of the above requirements" but build in a type system (§1, PDF pp. 3–4).
- Refinement constraints for query algebras [5, 20], whose languages are "strictly first order" and "do not appear capable of reasoning about more general rewrite rules" (§1, PDF p. 4).

## Problem and setting

**The question:** can optimization be described as stepwise refinement in one language, from query to access plan, so that rewrite rules can be proved correct in a logic (§1, PDF pp. 2–3)?

**Requirements** (§1, PDF p. 2): results may contain duplicates; results have a well-defined order; queries may take parameters; the algebra is wide-spectrum.

**Assumptions:**
- **Data model** (§3.1, PDF pp. 10–11): a directed graph with labelled vertices (objects and values) and arcs, plus methods, indices (returning lists of vertices) and a total order on vertices. Objects and arcs are finite, values may be infinite, and no arc leaves a value. The authors view a relational database as "simply a bipartite directed graph" (§1, PDF p. 2).
- **No data definition language** (footnote 2, PDF p. 10): constraints such a language would imply are given as explicit rules.
- **SQL:** one subset of the operators can specify the semantics of "a significant subset of ANSI-standard SQL", the details being beyond the paper's scope (§1, PDF pp. 2–3). The example query is RELOOP-like (RELOOP: an object-oriented SQL dialect [8]) (§1, PDF p. 3; §2, PDF p. 5).
- **Correctness** of a plan for a query is refinement (Def. 4.1, PDF p. 17).
- Examples use a hypothetical employee database (Fig. 3, PDF p. 11).

## Approach

- **Syntax** (§2, PDF pp. 5–7): a grammar for queries and rules (Tab. 1, PDF p. 6). Rule (3) says a plan to "scan the employee index, returning the age field value of each entry" (2) refines a sorted-ages query (1).
- **Substitution** (§2, PDF pp. 8–9): Lemma 2.1 (PDF p. 9): once substitutions make a rule ground, further substitutions don't change it. Lemma 2.2 (PDF p. 9): well-formed substitutions keep a rule a rule.
- **Possible results** (§3, PDF p. 9): a request for all employees denotes all orderings of them, so refining it to an index scan that returns one order is justified; "Perhaps the most compelling" reason, the authors say. Filter "introduces the possibility of nondeterminism in our semantics": possible results of some expressions can include both empty and non-empty lists (§3.4, PDF p. 15).
- **Model theory** (Def. 4.1, PDF p. 17): a database satisfies an inference axiom when, if it satisfies every premise, it satisfies the conclusion, and a non-ground rule when it satisfies every ground instance.
- **Proof theory** (Def. 4.2, Tab. 3, PDF pp. 17–18): substitution, modus ponens (given an inference axiom and all its premises, conclude its conclusion), and any rule proved to be an axiom.
- **Constraints as rules** (§4.1, PDF pp. 19–20): two rules such that any database satisfying them has, respectively, a single name arc from each emp vertex and that arc leading to a string vertex; a derived attribute (boss as the department's manager); a key (unique names), where two `Neq` premises make S3 (the name compared against) a query parameter. Filter with no variables keeps only the first row, if any, the authors' algebraic equivalent of Prolog's cut (commit to the first solution) (PDF p. 20).
- **Storage as rules** (§4.2, PDF pp. 20–21): rules (7)–(10) say a function accAge reads an employee's age and an index empIndex lists employees by increasing age.

## Results

- **Thm. 4.1 (soundness, PDF p. 18)**: for any collection of rules, a rule derived from them with Tab. 3's inference steps is a logical consequence of them.
- **Thm. 4.2 (PDF p. 20):** there is no recursive axiomatization of the calculus defined by Tab. 1's grammar. The authors argue it from the undecidable uniform word problem for monoids: every database has finitely many objects, and it is "straightforward to devise" rules from the first three constraint examples (PDF p. 19) that encode any instance.
- **Lemma 4.1 (PDF p. 21):** transitivity (14) is an axiom.
- **Lemma A.2 (App. A, PDF pp. 24–25):** rule (5) is an axiom: if E2 refines E1 and E4 refines E3, then Nest of E2 and E4 refines Nest of E1 and E3.
- **The derivation (§4.2, PDF pp. 21–23):** (3) is derived from (7), (8) and (10) with five further axioms: (5), the analogues (11) and (12) for Keep and Sort, reflexivity (13) and transitivity (14). By Thm. 4.1, (3) is thus their logical consequence, given that all five are axioms (the paper proves two; see Limits).
- **Design claims** (§5, PDF pp. 23–24): the authors "believe" possible results are "crucial" for two different index scans both to implement one request.

## Limits the authors state

- Footnote 1 (§1, PDF p. 3): additional operators are needed for aggregates, GROUP BY and HAVING, and for SQL's procedural treatment of null values.
- Of the five axioms the derivation uses, only (14) and (5) are proved: "space prevents us from doing this for each axiom" (§4.2, PDF p. 21).
- Thm. 4.2 rules out a recursive axiomatization of the calculus defined by Tab. 1's grammar (PDF p. 6); the authors say this "is not an issue in view of the context of our investigations" (§4.1, PDF p. 20).

## Open problems and building blocks

- **Open:** Tab. 1's ellipses mark where extensions are "desirable": more constraint forms, and operators for access paradigms "not currently expressible" (§2, PDF p. 5). The language "should be viewed as a kernel", and "extensions to the language are desirable and likely" (§4.1, PDF p. 20). The goal: a logic to "prove the correctness of real-world rule-based query optimizers for graph-based data models" (§1, PDF p. 3).
- **Released:** Nothing stated.
- **Beyond its domain:** indexed non-terminal grammars "have a potential for more widespread use in defining higher-order syntax often required by logics that reason about programs", the authors believe (§5, PDF p. 24).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
