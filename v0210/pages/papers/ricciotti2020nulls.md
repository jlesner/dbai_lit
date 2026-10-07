# A Formalization of SQL with Nulls

**A Formalization of SQL with Nulls** · J. Autom. Reasoning 66(4) 2022

Read: [PDF](https://arxiv.org/pdf/2003.11331) · [arXiv](https://arxiv.org/abs/2003.11331) · [DOI](https://doi.org/10.1007/s10817-022-09632-4)  
Code: [nullSQL](https://github.com/wricciot/nullSQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A Coq mechanization of SQL semantics with set and bag operations, lateral joins, nested subqueries and NULLs, with key metatheoretic properties validated (abstract).
- Gives a 3-valued and a Boolean semantics (§5) and mechanizes Guagliardo and Libkin's proof that 3VL adds no expressive power, the 3VL → 2VL direction only (§7, Theorem 3); also a certified translation of a flat relational calculus's normal forms into SQL (abstract; §8).
- Credits [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") with the first on-paper formal semantics of SQL with nulls (§1), more than that paper claims. Its abstract warns that semantics ignoring NULLs can "prove query equivalences that are unsound in realistic databases".

## In plain words

SQL's standard is ambiguous English, and NULL (a missing value) can make a condition neither true nor false. The authors say without a precise definition it is "very difficult to validate the soundness of candidate rewriting rules" (optimizer patterns for faster equivalent queries), and that NULL-free definitions can prove equivalences that fail on real databases (abstract, §1). They write one in Coq, a proof assistant (proof-checking software), for SQL with or without duplicate removal, nested or LATERAL subqueries (which may use earlier tables), and NULLs (abstract). They prove two rewrite rules (§6), show every meaningful query under SQL's three-valued logic has an equivalent under true/false logic (§7), and verify a translation into SQL for simplified-shape queries of a relational calculus, a core language behind programming-language queries (§8).

Presenting this as machine-checking a published definition, they claim "the first ever mechanized proofs of the expressive equivalence of two-valued and three-valued SQL queries" (§10). They also claim "the first ever verified translation of relational calculus queries to SQL queries" and "the first formalization of SQL to consider queries with lateral inputs" (§10).

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) · [proof assistant](#/glossary/proof-assistant) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [correlated subquery](#/glossary/correlated-subquery) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [K-relation](#/glossary/k-relation-and-semiring-semantics) · [LATERAL](#/glossary/lateral) · [de Bruijn index](#/glossary/de-bruijn-index) · [language-integrated query and NRC](#/glossary/language-integrated-query) · [expressive power](#/glossary/expressive-power)

**The paper's own terms:**
- **NullSQL**: the authors' name for Guagliardo and Libkin's on-paper semantics of SQL with nulls (§1), and for the SQL fragment formalized here (§2).
- **3VL and 2VL**: three-valued logic (true, false, unknown), SQL's standard behaviour, and Boolean two-valued logic (§5; truth tables in Fig. 2).
- **frame and generator**: a frame is a comma-separated list of FROM items that can't refer to one another; a generator is a sequence of frames joined by LATERAL, where an item may use variables of a previous frame (§3).
- **schema (σ, τ), context (Γ), environment**: a schema is a list of attribute names; a context assigns a schema to each table declared in a FROM clause (§3); an environment gives values to a context's attributes, and an expression's evaluation maps environments to results (§5.2).
- **(·)^tt and (·)^ff**: the translations of §7: c^tt is true under 2VL when c is true under 3VL, and c^ff when c is false.
- **heterogeneous equality (≃)**: equality between values whose types Coq can't see to be the same, "John Major" equality (§1, §6).

**Builds on:**
- Guagliardo and Libkin's NullSQL semantics and their proof relating 3VL and 2VL, which this paper mechanizes (§1, §7, §10; [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)")).
- Green, Karvounarakis and Tannen's K-relations (§4; [Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)")).
- Compared against first: HoTTSQL by Chu et al., a Coq semantics of SQL built on homotopy type theory (a type theory with a univalence axiom: equivalent types are equal), without incomplete information ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")), and SQLCoq by Benzaken and Contejean, a Coq semantics of a NullSQL variant with grouping and aggregates ([A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)")) (§1, §9). Against SQLCoq, which gives free attribute names default values, the authors claim "a more accurate formalization of well-formedness constraints" (§1 "Contributions").
- The authors' own NRC variants mixing sets and bags (§1, §8; refs. [21–23], not listed here).

## Problem and setting

- **Question:** can SQL with nulls, 3VL, bags and LATERAL get a Coq semantics over which rewrite rules and Guagliardo and Libkin's 3VL result are proved (§1)?
- **Fragment (§3):** SELECT-FROM-WHERE queries (with SELECT *), correlated subqueries under EXISTS and IN, UNION, INTERSECT and EXCEPT, set and bag semantics through DISTINCT and ALL, and LATERAL. No grouping or aggregation (§1, §10).
- **Syntax (§3):** tables referenced by de Bruijn index; AS renaming and WHERE mandatory.
- **Data (§3, §5.1):** constants and NULL, with "no assumption over the semantics of constants", assumed linearly ordered; base predicates are any Coq function on constants, and give unknown when an argument is NULL.
- **What "correct" means:** a rewrite is correct when both queries' evaluations agree in every environment (§6).

## Approach

- **Relations as an abstract data type (§4).** Proofs use only its declared operations (union, difference, product and others) and their axioms. The authors call this "Our key contribution" (§1 "Representation of tables").
- **One semantics, two logics (§5.1–5.2).** A Coq functor (a module parameterized by another) takes the truth-value type; the 2VL instance maps unknown to false. The semantics is a set of inductive judgments (rules defining a relation), which "has proven considerably easier to reason on" than a function (§5).
- **IN (§5.3).** It counts the subquery's tuples surely equal to the tested tuple and those equal up to NULLs: true if the first count is positive, unknown if only the second is, else false.
- **LATERAL (§5.3).** For each tuple of the first frame, the rest of the generator is evaluated in the extended environment and paired with that tuple, and the results are unioned.
- **Eliminating 3VL (§7, Fig. 4).** (·)^tt is defined together with (·)^ff: NOT c becomes c^ff; t NOT IN Q becomes NOT EXISTS over the rows of Q^tt that may equal t (at each position, equal or either side NULL); a predicate's ^ff form requires it false and no argument NULL. It extends Guagliardo and Libkin's translation with LATERAL and IS TRUE (true when its condition is true, else false; never unknown, §5.2).
- **Relational calculus to SQL (§8).** A heterogeneous NRC with sets, bags and NULL; normal forms of flat type (Fig. 5), a 3VL semantics (§8.1), and a translation (Figs. 7–8) that declares all FROM inputs LATERAL, since a nested comprehension may reference earlier generators (§8.2).

## Results

- **Thm. 1 (§6):** swapping two FROM tables is correct: if SELECT * over T1 and T2, and the query selecting T1's then T2's columns over T2 and T1, both have a semantics, and the second's output schema is as long as both schemas together, their evaluations are equal (≃) in every environment.
- **Thm. 2 (§6):** unnesting is correct: an outer SELECT over one FROM subquery (SELECT u FROM T WHERE c) and the query substituting u into the outer SELECT list and reading T with WHERE c have equal (≃) evaluations in every environment, whenever both have a semantics.
- **Thm. 3 (§7):** for every query Q, if Q has a 3VL semantics in a context Γ with output schema τ, then Q^tt has a 2VL semantics in Γ with schema τ, and the two agree in every environment.
- **Thm. 4 (§8.2):** if a normal-form collection M (set or bag, schema σ) has a semantics, every SQL query the translation produces from M has a 3VL semantics with schema σ that agrees with M's in every environment.

## Limits the authors state

- "Our work does not deal with grouping and aggregation" (§1 "Contributions"), "but as a result it may be simpler and easier to use, when these features are not needed" (§10).
- A small "formalization gap": "our (formally validated) Coq definitions might differ from their (empirically validated) Python implementation" (§9).
- Deriving a realistic semantics from a null-free one via (·)^tt works "in principle", but rewrite proofs would then reason on Q^tt, which "would greatly complicate the proof" (§7).
- The relation type is specialized to N-relations (K-relations over the natural numbers: bags); general semirings need "some adaptations", since difference is "not available in a semi-ring" (§4).
- Streicher's K axiom (all proofs of one equality are equal), needed for their heterogeneous equality, is incompatible with HoTTSQL's univalence axiom, which "would make it challenging to merge the two efforts" (§9).

## Open problems and building blocks

  - "Even for a particular system, mechanically checked formalization of all widely-used features of SQL remains an open problem" (abstract).
  - Whether the 3VL/2VL result holds with grouping and aggregation "does not appear to have been investigated" (§1; §9).
  - It "could be worthwhile" to derive an executable semantics and test it on Guagliardo and Libkin's examples (§9).
  - Grouping can be expressed, "in principle", by desugaring to correlated subqueries, "which we could also adapt to our setting", though SQLCoq shows grouping intricacies that make it "difficult to get such a desugaring right" (§9).
  - It "would be enlightening" to relate it formally to SQLCoq "and establish whether equivalences proved in NullSQL are still valid in SQLCoq" (§9).
  - It "could be interesting" to add SQL-style nulls to a verified query compiler such as QCert, a query compiler prototyped in Coq (§9).
  - Envisioned: certified optimizers giving "a checkable proof that the two queries are equivalent" (§1).
- **Released:** the Coq development, which "can be publicly accessed at its GitHub repository" (§1 "Contributions").
- **To reuse it:** Coq, assuming heterogeneous equality and functional extensionality (functions equal on every input are equal) (§1); a total order on values for the list model (§4.1).
- **Beyond its domain:** "we fully believe our technique can be adapted to general commutative semi-rings (including the provenance semi-rings that provided the original motivation for K-relations)" (§4); provenance semirings record how each result row was derived ([data provenance](#/glossary/data-provenance)).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-sql">itp-sql</a></span>
