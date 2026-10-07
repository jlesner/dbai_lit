# The Cascades Framework for Query Optimization

**The Cascades Framework for Query Optimization** · IEEE Data Eng. Bull. 18(3) 1995

Read: [Paper](http://sites.computer.org/debull/95SEP-CD.pdf)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Volcano's successor: rules and tasks as objects, a memo of groups, interleaved exploration and implementation.
- Its abstract says it "will serve as the foundation for new query optimizers" in Tandem NonStop SQL and Microsoft SQL Server (PDF p. 1).
- QO-Verify checks equivalence on the memo of SQL Server's Cascades-based optimizer ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)"), PDF p. 2).

## Problem and setting

The paper describes the design of an extensible, rule-based query optimizer meant to fix flaws the author found in the Volcano optimizer generator when using it for an object-oriented database system [BMG93] and a scientific database prototype [WoG93] (§1, PDF p. 1). As in EXODUS and Volcano, a *database implementor* (DBI) supplies the logical and physical algebras, rules, costs and properties, and the optimizer supplies the search. The optimizer assumes nothing about the algebras and has no built-in query or plan operators (§3.1, PDF p. 6). An *optimization goal* is a group or expression together with a cost limit and required and excluded physical properties; pursuing it yields a plan or a failure (§2, PDF p. 2).

## Approach

**Search as tasks** (§2, Fig. 1, PDF pp. 2–5). Six task types (Optimize Group, Optimize Expression, Explore Group, Explore Expression, Apply Rule, Optimize Inputs) are objects with a `perform` method, kept on a LIFO stack; a dependency graph for parallel search in shared memory is planned. Optimizing a group first checks whether the same goal was pursued before and reuses that plan (dynamic programming and memoization). *Exploration* replaces Volcano's first phase, which generated all logical expressions up front: a group is explored with transformation rules only on demand and only for the members that match a pattern (a subtree of a rule's antecedent). A DBI-managed *pattern memory* per group stops repeated exploration for the same pattern, and a per-expression bit map stops rules being reapplied (PDF pp. 3–4). Apply Rule iterates over bindings, copies each into an `EXPR` tree, checks the condition, inserts substitutes into the memo bottom-up with hash-based duplicate detection, and schedules follow-on tasks with the same goal or pattern (PDF pp. 4–5). Optimize Inputs resumes after each input and tightens the cost limit for the next one (PDF p. 5).

**Interface** (§3, PDF pp. 5–9). Every interface class is the root of a DBI subclass hierarchy (PDF p. 5).
- Operators (`OP-ARG`) carry their own arguments and declare `is-logical` and `is-physical`; one operator may be both (e.g. sargable predicates) or neither. `opt-cutoff` chooses how many moves to pursue, all by default (§3.1, PDF p. 6). Physical operators supply output properties, three cost methods, and `input-reqd-prop`, which turns a goal into a goal for an input (PDF pp. 6–7).
- `COST` has only comparison, and `REQD-PHYS-PROP` a covers test that can return `MORE` (§3.2, PDF p. 7).
- `GUIDANCE` objects pass search heuristics from one rule application to the next, e.g. `ONCE-RULE` for commutativity, or rule modules in the style of [MDZ93] (§3.4, PDF p. 7).
- Rules (`RULE`: name, antecedent, substitute) are objects. A substitute may be a complex expression, provided all but its top operator are logical (§3.6, PDF p. 8). *Promise* functions (one for optimization, one for exploration) run before exploration; a value of 0 or less stops work on the rule. Boolean *condition* functions run after it (PDF p. 8). A *reduction* rule's substitute is a leaf, and applying it merges two groups; an *expansion* rule's pattern is a leaf, and *enforcer* rules of this kind insert e.g. sorts (PDF p. 9). `FUNCTION-RULE` calls a DBI iterator that produces substitutes; with `TREE-OP` in the pattern it receives whole subtrees, so "tree operators and function rules permit the DBI to write just about any transformation" (PDF p. 9).

## Results

No experiments: the author states that "we have not performed any performance studies" (§1, PDF p. 2). The claims are design arguments:
- Exploring only for useful patterns makes Cascades more efficient than Volcano when guidance exists. Without guidance its efficiency "will equal that of the Volcano search strategy" (§2, PDF p. 4).
- Rule application is "guaranteed" correct for rules that are both transformation and implementation rules (§2, PDF p. 4).
- With exhaustive cutoff, promise values change only the order in which plans are found and the optimization time, not the final plan; the default promise is 0 when a physical property is required, 2 for an implementation substitute and 1 otherwise (§3.6, PDF p. 8).
- §5 (PDF p. 10) names three advantages over EXODUS and Volcano: predicates and other item operations modelled as algebra operators, enforcers inserted by explicit rules rather than as special operators, and DBI control over both exploration and optimization.

The abstract also lists schema-specific rules for materialized views, tracing support, and facilities for parallel search, partially ordered costs and dynamic plans (PDF p. 1).

## Limits the authors state

- The system "is not fully tuned yet"; efficiency analysis is left for further work (§1, PDF p. 2), and it "has not yet gone through a thorough evaluation and tuning phase" (§4, PDF p. 9).
- Without guidance, exhaustive enumeration of equivalent logical expressions "cannot be avoided"; a group explored for several patterns may see redundant derivations (§2, PDF pp. 3–4).
- "If such guidance is incorrect, incorrect pruning of the search space may occur"; the two planned guidance techniques (a rule reachability closure and DBI guidance) "are not implemented yet" (§2, PDF p. 4).
- The task structure is "restricted to a LIFO stack" for now (§2, PDF p. 2).
- The DBI must design promise and condition functions that avoid useless expansion-rule transformations (§3.6, PDF p. 9). Doing all transformations with function rules "would defeat some of the Cascades framework's purpose" (PDF p. 9).
- Extensibility came before speed: separating framework and DBI code brings virtual methods, many references and frequent allocation, with "room for improvement"; "de-modularization" should first be backed by a measurement study (§4, PDF p. 9).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
