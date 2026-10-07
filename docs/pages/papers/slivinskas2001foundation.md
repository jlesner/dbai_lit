# A Foundation for Conventional and Temporal Query Optimization Addressing Duplicates and Ordering

**A Foundation for Conventional…** · IEEE TKDE 13(1) 2001

Read: [DOI](https://doi.org/10.1109/69.908979)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An algebra over lists, so it keeps duplicates and order, with temporal operations, and six kinds of equivalence: list, multiset and set, plus their snapshot forms (§3, §4).
- About 90 transformation rules, each labelled with the equivalence it preserves, and properties that say which equivalence a plan's subtree must keep (§5, §6).
- Defines `ORDER BY` equivalence as multiset equivalence plus list equivalence on the sort keys (§5.5), the notion [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) cites for ties.

## In plain words

Query optimizers rewrite queries into faster equivalent forms. Much data is valid over periods of time; the authors argue applications using it "may benefit substantially from built-in temporal support in the DBMS" (abstract, PDF p. 1; DBMS: database management system), possibly via a layer over one. Earlier query algebras (formal sets of table operations) treat a table as a set or a multiset (a bag: duplicate rows count, order does not); with multisets, the authors say, sorting is permitted "only at the outermost level", and all time-aware algebras known to them are set-based (§1, PDF p. 2). They define an algebra in which a table is a list, keeping duplicates and order, with time-aware operations; six senses in which two results can match; about 90 rewrite rules, each labelled with the sense it preserves; a procedure finding which sense each query part needs; and a plan-generation algorithm they state produces correct plans (§7, PDF p. 25). There are no experiments. They present a foundation "generalizing all existing approaches known to the authors" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [list semantics](#/glossary/list-semantics) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [relational algebra](#/glossary/relational-algebra) · [query equivalence](#/glossary/query-equivalence) · [query optimizer](#/glossary/query-optimizer) · [transformation and implementation rules](#/glossary/transformation-and-implementation-rules) · [valid time and snapshot](#/glossary/valid-time) · [coalescing](#/glossary/coalescing-temporal)

**The paper's own terms:**
- **relation**: a list, "a finite sequence of tuples" (Def. 3.2, PDF p. 4), so duplicates and order are significant.
- **temporal and snapshot relations**: a temporal relation has reserved attributes T1 and T2, the start and end of each row's closed-open validity period; a snapshot (conventional) relation has neither (§3.2, PDF p. 4).
- **value-equivalent**: rows with the same non-time values (§3.3.8, PDF p. 8). **Duplicates in snapshots**: a snapshot at some moment holds a row twice, e.g. from value-equivalent rows with overlapping periods; temporal duplicate elimination removes them and keeps the input's order (§3.3.10, PDF p. 9).
- **stratum**: a layer over a conventional database that maps temporal SQL to SQL (§1, PDF p. 1) and here also does some optimization and processing (§2, PDF p. 2); transfer operations move relations between the two (§5.5, PDF p. 17).
- **the six equivalence types**: list (identical), multiset (same rows and counts, any order), set (same rows), and their snapshot forms, which compare the snapshots at each moment (§4, PDF p. 13). "All equivalences are defined formally elsewhere [32]" (§4, PDF p. 13), the authors' report TimeCenter TR-49.
- **≡_{L,A}** (list equivalence on sort list A): the two relations are multiset equivalent and their projections on A are list equivalent (§5.5, PDF p. 17); a snapshot form follows in §6.2 (PDF p. 19).
- **top equivalence**: the equivalence the final result must keep, set from the query language and query (§6, PDF p. 18).
- **properties**: Boolean labels per operation, OrderRequired, DuplicatesRelevant and PeriodPreserving (Table 2, PDF p. 19), with helpers MayHaveDups, MayHaveDupsInSn and SequenceRequired (§6.2, PDF pp. 20–23).

**Builds on:**
- Garcia-Molina, Ullman and Widom's textbook [12], a multiset algebra with set- and multiset-preserving rewrites: the conventional rules "derive from the rules for multisets given by [12]" (§5.1, PDF p. 14).
- The multiset algebras of Albert [1] and Dayal et al. [10]; the union comes from Albert's (§3.3.1, PDF p. 4; §9, PDF p. 26).
- Böhlen, Snodgrass and Soo's coalescing [8], whose rules the coalescing rules extend (§5.3, PDF p. 16).
- Stratum architectures, e.g. Torp et al. [36] (§2, PDF p. 2).

## Problem and setting

- **Question:** how can an optimizer rewrite queries whose results carry duplicates, order and time periods, knowing which rewrites are safe where?
- **Data model:** lists; valid time only; single periods, used by operations only through start and end, to be "independent of the granularity of time" (§3.1, PDF p. 3).
- **Operations** (Table 1, PDF p. 5): selection, projection, union ALL (concatenation), product, difference, duplicate elimination, aggregation, sorting, coalescing and union, with temporal versions of five. The authors state they "are sufficient for SQL and a wide range of temporal query languages" (§3.4, PDF p. 11).
- **Correctness:** equivalence to the original plan, assumed correct, under the top equivalence (§6, PDF p. 18). For "some temporal variants of SQL", the top equivalence is multiset equivalence without ORDER BY and ≡_{L,A} with ORDER BY A (§6, PDF p. 18).
- **NULLs:** selection keeps a row when its predicate holds (§3.3.2, PDF p. 6); projection sets a new non-time attribute to NULL (§3.3.3, PDF p. 6).
- **No benchmarks:** one running example (Figs. 3 and 5, PDF pp. 4 and 8).

## Approach

- **Algebra (§3, PDF pp. 3–11).** Operations are defined recursively in λ-calculus (a notation for functions), which constrains implementations to the same results, "taking order and duplicates into account" (§3.3.1, PDF p. 6). Aggregation returns one row per distinct sequence of grouping values (§3.3.11, PDF p. 9). Table 1 gives each operation's result order, cardinality bounds, and effect on duplicates and coalescing (PDF p. 5).
- **Example (§3.5, PDF pp. 11–13).** Fig. 8 shades where rewrites need not preserve order, duplicates or exact periods.
- **Equivalences (§4, PDF pp. 13–14).** Thm. 4.1 lets an optimizer infer weaker equivalences from stronger: list implies multiset implies set equivalence, likewise for the snapshot forms, and, for temporal relations only, each type implies its snapshot form. Proof in [32].
- **Rules (§5, PDF pp. 14–18).** Each rule is an equivalence labelled with "the strongest equivalence type that holds", usable in both directions, with preconditions (PDF p. 14): groups G (conventional), D (duplicate elimination), C (coalescing), S (sorting) and T (transfer), Figs. 10–15. Sorting "can be eliminated" on already sorted input, where a multiset suffices, or before a later sort (§5.4, PDF p. 16). Moving an operation between stratum and DBMS keeps only multiset equivalence, sort excepted, "because we cannot be sure how the DBMS implementation of the operation will sort its result" (§5.5, PDF pp. 17–18).
- **Where rules apply (§6, PDF pp. 18–24).** The three properties and SequenceRequired propagate top-down, the other helpers bottom-up (PDF pp. 19–20, 23); Table 3 (PDF p. 19) maps each property combination to the equivalence required. §6.3 updates properties incrementally, mostly locally, after a rewrite (Tables 10–11, PDF p. 24).
- **Enumeration (§7, PDF pp. 24–26).** Fig. 16 applies a rule at a matching location when its local conditions hold and the top operation's properties allow the rule's type. Thm. 7.1 states the algorithm "generates correct query plans" (PDF p. 25), i.e. equivalent under the top equivalence; of the proof's six parts, one per rule type, [32] gives the part for multiset rules under top equivalence ≡_{L,A} or multiset. The worked example uses D2, transfer rules, C10, C2 and sorting rules to reach Fig. 17b (PDF pp. 25–26).

## Results

No measurements; the theorems are Thm. 4.1 (§4, PDF p. 13) and Thm. 7.1 (§7, PDF p. 25).
- Stated advantages: a rule set that "goes beyond all existing rule sets known to the authors" (§5, PDF p. 14); for the stratum, "even simple heuristics", e.g. always placing certain temporal operations there, "may result in substantial performance gains" (§3.5, PDF p. 12).
- The approach "partitions the work required by the database implementor to develop a provably correct query optimizer into four tasks" (§10, PDF p. 27).

## Limits the authors state

- The rules are "theorems amenable to formal proof", but "we have not written out all 90-odd proofs" (§5, PDF p. 14).
- To terminate, the rule set must restrict or exclude rules that introduce operations (§7, PDF p. 25).
- The algorithm "does not generate all possible plans" (§7, PDF p. 25); its performance is not considered, beyond noting that incremental property updates improve over full recomputation (§7, PDF p. 24).
- When four temporal operations get arguments that may have duplicates in snapshots, a base relation may need ≡_{L,A}, which in the stratum "cannot be satisfied if the underlying relations come from the DBMS in unknown order"; the mapping should then reject the query or add a sort on all attributes. Coalescing, or temporal difference whose result is later coalesced, combined with temporal duplicate elimination is exempt, being "insensitive to the order of their arguments" (§6.2, PDF p. 23).
- Expressive power (which queries the algebra can express) is not studied beyond showing it extends the conventional relational algebra (§9, PDF p. 27).

## Open problems and building blocks

  - Plan costing is "left for future work" (§2, PDF p. 3); in the stratum, "the challenge is to come up with a unified cost model for stratum and DBMS operations" (§10, PDF p. 27).
  - Dividing processing between stratum and DBMS (§10, PDF p. 27).
  - The mapping from a query to an initial plan is "not covered in this paper"; translation to SQL "is also left for future research" (§10, PDF pp. 27–28).
  - Extensions: list operations in the algebra, transaction time (when data is stored in the database), modifications (updates) and NOW-relative values (times relative to the current time) (§1, PDF p. 2; §10, PDF p. 28).
  - "It might be appropriate to use an automatic theorem prover to ensure the correctness of the transformations, the property definitions, and the plan enumeration algorithm for all cases" (§10, PDF p. 28).
- **Released:** Nothing stated. Formal definitions and the cited proofs are in report [32] (§4, PDF p. 13; §7, PDF p. 25).
- **To reuse it:** specify operations in λ-calculus, design and prove rules, set the properties, and ensure a correct initial plan (§10, PDF p. 27); a new operation also needs an extended correctness proof and, for a stratum, an SQL translation (§8, PDF p. 26).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
