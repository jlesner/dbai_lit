# Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns

**Same Pattern** · Different Answer (GQL and SQL/PGQ path patterns), preprint 2026 (a PVLDB-format submission copy is in the artifact repository)

Read: [PDF](https://arxiv.org/pdf/2609.23032) · [arXiv](https://arxiv.org/abs/2609.23032)  
Code: [gpml-conformance](https://github.com/samyama-ai/gpml-conformance)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures what graph engines return for path patterns whose meaning the two ISO standards GQL and SQL/PGQ fix in their shared core, GPML: a 17-construct suite on six releases of five products (Kùzu, DuckPGQ, two Neo4j releases, Memgraph, Apache AGE), each cell scored as conforming, diverging, rejected or inexpressible (abstract; §4–5). The authors develop one of the engines they measure (Samyama-Graph) and keep its row out of every statistic (§8).
- The expected answers come from an executable reference semantics of the GPML path core (restrictors, selectors, quantified segments) that consults no engine and must first reproduce six answers printed in the standard's reference exposition (§3, §3.1); answers are compared as multisets of endpoint pairs (§4); divergences are rescored against the path mode each engine's manual declares (§6), and three metamorphic relations over quantifier bounds check each engine against itself (§7).
- A standard-backed answer key for a query DSL that several engines implement differently, and evidence that their differences are mostly silent: the authors report that 15 of 26 disagreements return a different answer with no error (abstract; Tab. 2).

## In plain words

Graph databases answer queries for paths through networks of nodes and edges. Two recent ISO standards, GQL and the graph part of SQL (SQL/PGQ), share one pattern language whose answers for such paths are precisely defined. The authors say what engines compute for these patterns "has never been measured": work on GQL "is theoretical and runs no engine", and cross-engine work measures performance (abstract). They wrote a program that computes the standard's answer directly, checked it against six answers printed in the standard's reference paper, and ran 17 test patterns on six releases of five graph engines, sorting each result as conforming, diverging, rejected or not expressible (abstract). They report that nine of the 17 patterns draw more than one answer across the engines that accepted them, and that 15 of 26 disagreements are silent: the query runs and returns a different answer with no error (abstract; Tab. 2, one row per product, the authors' own engine left out). They present the work as "the first answer-level divergence map over six releases of five products" (§1).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [metamorphic testing](#/glossary/metamorphic-testing) · [test oracle](#/glossary/test-oracle) · [bag semantics](#/glossary/bag-semantics) · [formal semantics](#/glossary/formal-semantics) · [SQL standard](#/glossary/sql-standard) · [nondeterministic query](#/glossary/nondeterministic-query)

**The paper's own terms:**
- **GQL, SQL/PGQ, GPML**: GQL (ISO/IEC 39075:2024) is called "the first international standard for a graph query language"; SQL/PGQ is Part 16 of SQL:2023; both build on the same pattern-matching core, GPML (§1).
- **path**: an alternating sequence of nodes and edges that starts and ends with a node; graph theory calls it a walk, "the standard calls it a path" (§2).
- **restrictor**: a keyword limiting which paths count: TRAIL (no repeated edges), ACYCLIC (no repeated nodes), SIMPLE (no repeated nodes except that first and last may coincide), or none, meaning any walk (§1; Tab. 1).
- **selector**: ALL, ANY, ALL SHORTEST or ANY SHORTEST; it groups matches by their two endpoints and picks within each group, after the restrictor is applied (Tab. 1). ANY returns one match per endpoint pair, "unspecified which" (Tab. 1).
- **quantified segment**: an edge pattern repeated a bounded (`{1,3}`) or unbounded number of times; "Every unbounded quantifier must sit inside the scope" of a restrictor or selector so the answer is finite (§1). The quantifier binds the edge pattern, so nodes inside the repetition are unconstrained (§2).
- **reference semantics**: the authors' program that implements the standard's definitions "with no optimisation and no engine in the loop" (§3).
- **Gate B**: the requirement that the reference semantics reproduce the six printed answers before any engine is measured (§3.1).
- **conforming, diverging, rejected, inexpressible**: the four scores of a cell; inexpressible means the dialect has no syntax for the construct (§4).
- **S1, silence ratio (S2)**: S1 is divergences over the cells an engine answered; S2 is divergences over divergences plus rejections, "the share of disagreements the user is not told about" (Tab. 2).
- **documented language difference / departure from the standard**: a divergence that the engine's own manual explains, against one it doesn't (§6; Fig. 2).
- **openCypher**: the query language that Neo4j, Memgraph, Apache AGE and Kùzu implement, with its descendants (§8); it has no restrictor keyword (§4).

**Missing glossary terms:**
- **property graph**: a graph of node and edge identifiers in which each edge connects an ordered (directed) or unordered (undirected) pair of nodes, each element carries a set of labels, and elements may have named property values; parallel edges and self-loops are allowed (§2).

**Builds on:**
- Deutsch et al. (2022), the reference exposition of GPML written by members of the standards committee, whose six worked answers Gate B uses (§1; §3.1).
- Correa and Riedewald (2026), the cross-engine path-query paper the authors call about performance, with all queries under trail semantics (§1; §9).
- Rigger and Su (2020a, b, c) and Ba and Rigger (2023), database-testing oracles (pivoted query synthesis, non-optimising reference engines, query partitioning, plan coverage) that the authors call "internal": they compare a system to itself (§9).
- Chen et al. (1998) and Segura et al. (2016), the source of metamorphic relations (§7).

## Problem and setting

- **Question:** the standard "answers, unambiguously," what a path pattern returns; "The question this paper asks is what engines return" (§1). The authors say formal GQL work (Francis et al. 2023; Gheerbrant et al. 2025; Thimmaiah et al. 2026) runs no database (§1).
- **Scope:** the GPML path core: restrictors, selectors, quantified segments (§3); out of scope are, e.g., writes, aggregation, subqueries and performance (§8).
- **Engines:** Kùzu (a graph database system), DuckPGQ (property-graph queries inside DuckDB, an analytical database), Neo4j at 5.26.30 and 2026.04.0, Memgraph and Apache AGE (graph databases; AGE runs inside PostgreSQL), plus the authors' own Samyama-Graph, shown but kept out of every statistic (§4; Tab. 2; Fig. 1).
- **Cases and data:** 17 cases, each with an abstract pattern, an openCypher rendering and a SQL/PGQ rendering (§4); six tiny hand-checkable graphs, one of them the reconstructed graph of the reference paper's Figure 1 (§4).
- **What "correct" means:** the reference semantics' output, compared as the multiset (bag) of endpoint identifier pairs (§4). For ANY selectors the oracle returns the set of admissible answers plus a count per endpoint group, and "We never score a permitted choice as a divergence" (§3). Each cell is run three times; "no engine was nondeterministic" (Fig. 1).
- **Aggregation:** the headline takes one row per product at its newest measured version (Tab. 2 notes).

## Approach

- **Reference semantics (§3).** Enumerate paths, filter by the restrictor, then apply the selector. An unbounded quantifier gets a finite bound derived per case: at most the number of edges under TRAIL, the number of nodes under ACYCLIC or SIMPLE, and one less than the number of nodes for a walk with a shortest selector. An unbounded walk with ANY has an infinite set of admissible answers, "so no finite oracle exists; the implementation raises rather than guesses". Pruning partial paths must respect that SIMPLE, unlike TRAIL and ACYCLIC, is not prefix-closed (a partial path back at its start is legal only if it stops).
- **Gate B (§3.1).** The reference graph is a figure, so its Transfer sub-graph is rebuilt from the printed paths. An oracle that checks the node pattern at every repetition fails three of the six checks.
- **Paired cases (§4).** Some cases separate the walk and trail readings of the same openCypher text, asking "which of the two meanings that one query has".
- **Attribution (§6).** Each answer is scored a second time against the path mode the engine's manual declares: TRAIL for Neo4j, Memgraph and Apache AGE (openCypher's relationship uniqueness), walk for Kùzu, which documents its deviation, and none for DuckPGQ, "because the dialect it implements is the standard".
- **Reference-free layer (§7).** Three relations that hold under every path mode, writing A(lo, hi) for the answer with at least lo and at most hi repetitions: raising hi only adds answers (M1), lowering lo only adds answers (M2), and A(lo, hi) equals the multiset union of the answers for each exact length (M3). Run on six graphs, with hi up to four (Fig. 3).

## Results

- **Portability (§5).** Nine of 17 constructs draw more than one answer across the engines that accepted them; seven draw one, "including parallel edges, both direction forms, and all shortest" (§8).
- **Silence (§5; Tab. 2).** In the headline aggregation, 15 of 26 disagreements are silent, a ratio of 0.58. The authors report it changes little under the two other aggregations (Tab. 2 notes).
- **Positive control (§5).** Both Neo4j releases, Memgraph and Apache AGE conform on the trail example whose answer the reference paper prints.
- **Keyword spelling (§5; Tab. 3).** Kùzu, DuckPGQ, Memgraph and Apache AGE parse neither restrictor nor selector prefixes; the others disagree on which they parse. For the standard's restrictor-then-variable order (`MATCH TRAIL p = (...)`), "No external engine we measured parses it"; the authors' engine does because they fixed it after this suite reported the gap.
- **Versions (§5).** The two Neo4j releases agree on 14 of 17 constructs, and "Nothing regressed".
- **Attribution (§6; Fig. 2).** 9 of the 15 divergences are documented language differences (every Kùzu and openCypher one); the other 6 are DuckPGQ's departures from the standard it implements.
- **Metamorphic layer (§7; Fig. 3).** 39 violations, all in Kùzu and DuckPGQ, reduce to two defects: Kùzu, with a lower bound of zero, returns every path ending at its start twice and drops the zero-length path; DuckPGQ's quantified pattern differs from the standard in three ways, one self-contradictory (its `{2,2}` misses a path its own `{0,2}` finds). No query errored on any engine in this run (Fig. 3).

## Limits the authors state

- "The suite is narrow by design": seventeen constructs of the path core, no writes, transactions, schema, aggregation, subqueries or graph construction, and "no timing number" (§8).
- Four engines implement "openCypher and its descendants, not GQL"; they are placed against the ISO semantics as "the only common yardstick", and §6 exists so this "is not mistaken for a conformance verdict" (§8).
- Endpoint-level comparison "can only under-count divergence"; "some divergences are certainly missed" (§8).
- A query that errors can't violate a relation, so "a crash can hide a violation but never add one" (§8).
- The reconstruction of the reference paper's Figure 1 "could in principle be wrong"; six published answers validate it, "which is strong but not a proof" (§8).
- Conflict of interest: the authors develop Samyama-Graph; its measured release "carries fixes this suite prompted" after an earlier release scored worse, "So the row is not evidence that this engine is better"; it rejects nothing, so its divergences are all silent (§8; Tab. 2 notes).
- "One vendor pair is not a trend" (§5).

## Open problems and building blocks

- **Open:** connecting the mechanised semantics of Thimmaiah et al. (2026) to the suite "is the natural next step" (§9). The authors "would like it to become the thing an engine runs before it claims to implement GQL" (§10).
- **Released:** "Reference semantics, suite, adapters, reproducers, raw results and figure code", under Apache-2.0 (§10 "Artifact"); standalone reproducer scripts for both defects (§7); the Figure 1 reconstruction and its witnesses (§8).
- **To reuse it:** `./run.sh` "starts the engines in Docker and regenerates every number and figure" (§10); each reproducer is under sixty lines "with no dependency on the rest of the suite" (§7). The oracle covers only the GPML path core (§3; §8).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a></span>
