# The Volcano optimizer generator: extensibility and efficient search

**The Volcano Optimizer Generator** · ICDE 1993

Read: [DOI](https://doi.org/10.1109/icde.1993.344061)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An optimizer generator: transformation and implementation rules in, a memoizing top-down search out.
- Physical properties, enforcers, branch-and-bound.
- With EXODUS, the base of Cascades ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)"), abstract), whose framework SQL Server's optimizer uses; QO-Verify searches that optimizer's memo ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)"), PDF p. 2). Calcite's planner uses "a dynamic programming algorithm, similar to Volcano" ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")).

## Problem and setting

The authors want a tool generating query optimizers for new data models (object-oriented, scientific) without giving up performance. Their earlier EXODUS generator showed the paradigm works, but "it was difficult to construct efficient, production-quality optimizers" with it. Five requirements follow (§1, PDF p. 1): stand-alone use; less optimization time and memory; support for physical properties such as sort order; heuristics to guide and prune the search; flexible cost models.

The generator assumes as little as possible about the data model (§2.2, PDF p. 2). A query is a tree of *logical* operators; a plan is a tree of *physical* operators (algorithms); optimization maps a logical expression to "the optimal equivalent physical algebra expression" (§2.2, PDF p. 3). Equivalences are the implementor's transformation rules, such as commutativity or associativity, with optional condition code (§2.2, PDF p. 3).

## Approach

**Generator paradigm** (Fig. 1, PDF p. 1): a model specification becomes optimizer source code, linked with Volcano's shared search engine.

**Design principles** (§2.1, PDF p. 2): two algebras; independent rules, combined only by the search engine; choices given as algebraic equivalences, without Starburst-style intermediate grammar levels, keeping "equivalence" apart from "search method"; compiled rules; dynamic programming.

**Implementor inputs** (§2.2, PDF pp. 2–4): logical operators and transformation rules; algorithms, *enforcers* (physical operators with no logical counterpart, such as sort, that only establish physical properties) and implementation rules; abstract data types (ADTs) for cost, logical properties and the *physical property vector*; per-algorithm applicability, cost and property functions. A goal is a logical expression plus a physical property vector; the applicability function says whether an algorithm can meet it and what its inputs must deliver (PDF p. 3).

**Search engine** (§3, PDF pp. 4–6; Fig. 2, PDF p. 5): `FindBestPlan(LogExpr, PhysProp, Limit)` first looks the goal up in a hash table of expressions and equivalence classes (sets of equivalent logical expressions and plans), which keeps the best plan per property combination already optimized. Otherwise it generates moves (a transformation; an algorithm delivering the required properties; an enforcer, then the expression under a relaxed vector), orders them by promise, and recurses on inputs with the remaining cost limit (branch-and-bound). Also (PDF pp. 5–6):
- expressions under optimization are marked "in progress", so mutually inverse rules do not loop;
- a transformation may create a new equivalence class (Fig. 3, the associativity rule, PDF p. 5);
- for operators that need only consistent input properties (sort-based intersection, parallel join), the implementor can list several property vectors to try;
- an "excluding physical property vector", not shown in Fig. 2 (PDF p. 5), stops an enforcer's input from being optimized by an algorithm that already met the requirement (merge join under a sort);
- both optimal plans and failures are stored, the latter reusable for the same or lower cost limits.

The authors call this top-down, goal-driven search "directed dynamic programming", backward chaining, against the forward chaining of EXODUS, System R and Starburst (§3, PDF p. 4).

## Results

Authors' claims:

- **Against EXODUS** (§4.1, PDF pp. 6–7): separate logical and physical nodes; required physical properties driving the search, "entirely absent in EXODUS"; top-down control, avoiding EXODUS's "reanalyzing" of plans; cost as an ADT; a hash table open to other search strategies.
- **Experiment** (§4.2, PDF pp. 7–8; Fig. 4, PDF p. 7): exhaustive optimization of select-join queries with 1 to 7 binary joins, 50 per size, relations of 1,200 to 7,200 records; both generators got the same operators, algorithms, rules and cost functions (sort an enforcer in Volcano, folded into merge join's cost in EXODUS) (PDF p. 7).
  - Volcano searched exhaustively for all queries "with less than 1MB of work space" (PDF p. 7).
  - EXODUS's effort "increases dramatically from 3 to 4 input relations", which they attribute to reanalysis (PDF p. 8).
  - For more complex queries the optimization times differ "by about an order of magnitude" (PDF p. 8).
  - Plan quality (estimated execution cost) is equal "up to 4 input relations" and significantly worse for EXODUS beyond, because it does not systematically exploit physical properties (PDF p. 8).
- **Use** (§6, PDF p. 9): optimizers built for scientific databases [20] and Texas Instruments' Open OODB [1, 19], both operational.
- **New features claimed** (§6, PDF pp. 9–10): heuristics versus costed search left to the implementor; enforcer costs subtracted from the bound at once; several property combinations per subexpression; a multi-way join needing "one or two implementation rules" against "almost the entire rule set" in Starburst (PDF p. 10).

## Limits the authors state

- The generator "will soon fulfill all the requirements above" (§1, PDF p. 1), so not all are met yet; search and pruning heuristics "will be" optional facilities (§2.1, PDF p. 2).
- "Currently, with only exhaustive search implemented, all moves are pursued"; move selection by an implementor function is future work (§3, PDF p. 5).
- Partial results are "reinitialized for each query"; longer-lived results are future research (§3, PDF p. 4).
- The experiment's data model is "rather small", select and join only (§4.2, PDF p. 7).
- EXODUS aborted on some complex queries, its measurements "were quite volatile", and Fig. 4 shows only queries EXODUS completed (PDF pp. 7–8).
- The comparison with EXODUS is "preliminary" (§6, PDF p. 9).
- Separating concerns into cooperating modules proved "extremely hard to maintain" in an implementation (§5, PDF p. 9).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
