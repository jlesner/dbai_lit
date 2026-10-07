# HoTTSQL: proving query rewrites with univalent SQL semantics

**HoTTSQL** · PLDI 2017

Read: [PDF](https://arxiv.org/pdf/1607.04822) · [arXiv](https://arxiv.org/abs/1607.04822) · [DOI](https://doi.org/10.1145/3062341.3062348)  
Code: [Cosette](https://github.com/uwdb/Cosette)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Machine-checkable denotational SQL semantics in Coq: K-relations plus homotopy type theory, covering bags, correlated subqueries, aggregation.
- Proves rewrite rules from the literature and real optimizers interactively.
- The Coq half of Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)") §4.1, PDF p. 4) and the start of the Cosette → UDP line ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §3.1).

## In plain words

Database systems speed up queries by rewriting them into queries that should return the same rows; a wrong rewrite rule returns wrong answers. The authors write that, to their knowledge, of the many published rules "only the trivial ones have been formally proven to be semantically preserving" (§1). They give SQL a precise meaning in the proof checker Coq: a table becomes a function giving each row's number of copies; a join multiplies these counts, a union adds them. Tables may hold infinitely many rows and copies; they call this, to their knowledge, "the first SQL semantics that interprets relations as both finite and infinite" (§1). With it they prove 23 rewrite rules from research papers and real optimizers, each in at most a few dozen lines of proof (§1, §5); one rule, commutativity of selection, takes them 10 lines against 65 in earlier list-based work (§2). For one simple class of queries (joins with equality filters, duplicates removed) the check is automatic. They claim: "Several of these rewrite rules have never been previously proven correct" (abstract).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [formal semantics](#/glossary/formal-semantics) · [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [conjunctive query](#/glossary/conjunctive-query) · [K-relation](#/glossary/k-relation-and-semiring-semantics) · [magic set rewrites](#/glossary/magic-sets)

**The paper's own terms:**
- **Denotational semantics**: the meaning of each SQL construct is given as a mathematical function, built from the meanings of its parts (Fig. 7), here implemented in Coq (§5).
- **HoTTSQL**: the SQL-like language in which rules are written (§3.2, syntax in Fig. 5).
- **HoTT-relation**: a relation read as a function from each tuple to a type (homotopy type, below) whose size is the tuple's number of copies (§2).
- **UniNomial**: the algebra the queries are translated into: empty type 0, one-element type 1, sum +, product ×, negation (n → 0), squash, and summation over a possibly infinite type (Def. 3.1, §3.4).
- **Squash type**: a type cut down to 0 or 1 elements; it stands for a yes/no fact and denotes `DISTINCT` (§3.4).
- **Schema as a tree; paths `Left`, `Right`**: schemas are unnamed binary trees of column types, a tuple is a nested pair of the same shape, and `Left`/`Right` pick a half (§3.1).
- **Context**: the tuples of all enclosing query scopes, passed to each subquery so a correlated subquery can read outer columns (§4, Fig. 6).
- **Meta-variables, `CASTPRED`, `CASTEXPR`**: placeholders for any query, predicate or expression, so a rule is stated for all of them; the casts say which part of the input tuple each may read (§3.3).
- **DopCert** ("Database OPtimizations CERTified"): the Coq system built on HoTTSQL: semantics, lemma and tactic library, decision procedure (an automatic yes-or-no check) and rule proofs (§1, §5).
- **Ltac**: Coq's language for writing tactics (§2, §5.2).
- **Functional extensionality**: two functions are equal if they agree on every input; implied by the Univalence Axiom (homotopy type theory's axiom that equivalent types are equal; §5.1.1 footnote 4).

**Missing glossary terms:**
- **Homotopy type theory and univalent types**: a recent "generalization of classical type theory by adding membership and equality proofs" (§1); the paper uses a univalent type as a count, finite or infinite, whose equality to another count can be proved (§1, §2).

**Builds on:**
- K-relations, Green et al. [23] ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)")), which the semantics generalizes in two ways: no finite support, and univalent types in place of numbers (§1, §2).
- Homotopy type theory [46] and its Coq library [24] (§1, §5).
- Earlier SQL semantics over lists [35, 53, 54], whose proofs the authors call lengthy, among them Malecha et al.'s verified Coq database [35] (§1, §2, §6.2).
- The rules' sources: magic sets as three [semijoin](#/glossary/semijoin-and-anti-semijoin) rules (Seshadri et al. [44]), `GROUP BY` as a correlated subquery (Buneman et al. [6]), and an index as a relation (Tsatalos et al. [49]) (§4.2, §5.1.3, §6.2).

## Problem and setting

- **Question:** can a SQL semantics make proofs that a rewrite rule's two sides are equal short enough to write and machine-check in Coq (§1, §2)?
- **What a rule must satisfy:** "both sides of each rule need to return the same relation for all schemas and instances" (§3.3); relations here may be infinite, with infinite multiplicities (§1, §7).
- **Semantics:** bags, with sets through `DISTINCT` (§2, §3.4). `EXCEPT` keeps a tuple's copies from the first query when the tuple is absent from the second (Fig. 7).
- **Fragment** (Fig. 5): `SELECT`, `FROM`, `WHERE`, `UNION ALL`, `EXCEPT`, `DISTINCT`, `EXISTS`, equality, `AND`/`OR`/`NOT`, [uninterpreted functions](#/glossary/uninterpreted-function) for arithmetic and constants (§3.2), and aggregates applied to a query's result (Fig. 7). [Correlated subqueries](#/glossary/correlated-subquery) work through contexts (§4). `GROUP BY`, keys, [functional dependencies](#/glossary/functional-dependency) and indexes are defined by rewriting into this core (§4.2).
- **Not supported:** [NULLs with three-valued logic](#/glossary/null-and-three-valued-logic), outer joins and [window functions](#/glossary/window-function) (§7 "Limitations").

## Approach

- **Translation** (Fig. 7): `FROM` multiplies the multiplicities of the parts; `WHERE` multiplies by the predicate's 0 or 1; `UNION ALL` adds; `DISTINCT` squashes; `SELECT` sums the multiplicities of all input tuples whose projection equals the output tuple; `EXISTS` squashes such a sum. Because the sum may range over infinitely many tuples, no finiteness proof is needed (§2).
- **Proof styles** (§2, Figs. 1–2, §5.1.1): after functional extensionality, either rewrite with semiring laws, or, when both sides are squash types, prove each side implies the other.
- **Derived constructs** (§4.2): `GROUP BY` becomes `SELECT DISTINCT` with an aggregate over a correlated subquery; k is a key of R when R equals its self-join on k; an index on column a is `SELECT k, a FROM R` for a key k.
- **Library lemmas** (§5.1): Lemma 5.1 lets a sum over pairs swap the pair's halves; Lemma 5.2 writes a value P x as a sum of P x′ over all x′ equal to x; Lemma 5.3 says that for any type T, if T implies a yes/no fact P (a type that is 0 or 1), then T × P = T.
- **Decision procedure** (§5.2): for conjunctive queries in the form `DISTINCT SELECT p FROM q WHERE b`, with p a list of projected attributes, q a cross product of input relations and b a conjunction of equalities between attributes, both sides become squash types; the procedure turns the goal into two implications, tries every way to pick the summed-over tuples with Ltac's backtracking, rewrites the equalities and applies hypotheses (Fig. 10).
- **Completeness** (§7 "Finite v.s. Infinite…"): the authors argue that, because relations may be infinite, Gödel's completeness theorem (in [first-order logic](#/glossary/first-order-logic), whatever holds in every model has a proof) gives a proof for every pair of equivalent queries; over finite relations alone, no [complete](#/glossary/soundness-and-completeness) proof system can exist, by Trakhtenbrot's theorem (whether a first-order sentence has a finite model is undecidable).

## Results

- **Rules proved** (§5.1, Fig. 8): 23 rules, 8 basic, 1 aggregation, 2 subquery, 7 magic set, 3 index, 2 conjunctive query, with an average of 25.2 lines of proof per rule; the conjunctive-query rules take 1 line, automatically.
- **Examples:** selection push-down (filtering right after a table scan) and join commutativity (§5.1.1); filtering on the group key before rather than after a `GROUP BY` with `SUM` (§5.1.2); the three magic-set semijoin rules, with proofs shown for two and omitted for the third (§5.1.3); a rule turning a full scan into an index lookup plus join, proof omitted (§5.1.4).
- **Against list semantics:** commutativity of selection takes 10 lines here against 65 in [35] (§2).
- **Size:** the trusted code base (what the proofs take on trust) holds 296 lines of HoTTSQL's specification, "fewer than 300 lines" in the abstract (§5).
- **Novelty claims:** the magic-set rewrite's "correctness has not been formally proven before", to the authors' "best knowledge" (§6.1).
- **Complexity table** (§5.2, Fig. 9): known results for [containment](#/glossary/query-containment) and equivalence of conjunctive queries, their unions, those with ≠, ≥, ≤, and first-order queries, under set and bag semantics.

## Limits the authors state

- "Our system does currently not support three SQL features" NULLs, outer joins and window functions; they say all "can be expressed" at "some added complexity" (§7 "Limitations").
- Encoding three-valued logic as external functions "hides from the rewrite rules the equality predicate, which plays a key role in joins" (§7 "Limitations").
- The system "cannot check the equivalence of two SQL expressions that return the same results on all finite relations, but differ on some infinite relations" (§7 "Finite v.s. Infinite…"); they argue that none of the optimization rules they found in the literature and discussed in the paper encode an infinity axiom (a first-order sentence that has only infinite models).
- Finding a proof is undecidable: "our system does not search for the proof, instead the user has to find it, and our system will verify it" (§7).
- "Unlike [35], we did not build an end to end formally verified database system" (§6.2).

## Open problems and building blocks

- **Open:** "In future versions, we plan to offer native support for NULL's" (§7 "Limitations"). Fig. 9 marks bag containment of conjunctive queries and bag equivalence of their unions "Open" (§5.2).
- **Released:** "All definitions and proofs presented in this paper are open-source and available online" (§1, footnote 1).
- **To reuse it:** Coq with the Homotopy Type Theory library and the Univalence Axiom (§2 footnote 2, §5); outside conjunctive queries the user writes the proof, helped by the library's lemmas and "heuristic tactics" (§1, §5, §7).

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-sql">itp-sql</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
