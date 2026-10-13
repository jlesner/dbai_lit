# SPARQL 1.1 Query Language

**SPARQL 1.1 Query Language** · W3C Recommendation 21 March 2013 (a standard, not a paper; editors Harris and Seaborne)

Read: [Paper](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The W3C standard that "defines the syntax and semantics of the SPARQL query language for RDF" (abstract): graph pattern matching with optional parts, alternatives, negation, property paths, aggregates, subqueries and four query forms (§5–§16).
- Its formal definition translates a query string into an algebra over multisets and sequences of solution mappings (partial variable bindings) evaluated on an RDF dataset (§18.2, §18.5–§18.6); the grammar is EBNF, "LL(1) when the rules with uppercased names are used as terminals" (§19.8).

## In plain words

RDF, in the document's words, is "a directed, labeled graph data format for representing information in the Web" (abstract). SPARQL is the query language for such graphs, much as SQL is for tables. This W3C (the World Wide Web Consortium, the web's standards body) Recommendation, a standard rather than a research paper, "defines the syntax and semantics of the SPARQL query language for RDF" (abstract), to meet use cases and requirements gathered by a W3C working group (§1). It presents the language feature by feature, with examples (§2–§17), gives its full grammar (§19), and gives a formal definition: a query is translated into an expression of a small algebra whose operators work mostly on bags of variable bindings, and that expression is evaluated on a collection of graphs (§18). Version 1.1 adds to SPARQL 1.0 aggregates, subqueries, negation, path patterns, assignment and more (§ "Change Log", "Since SPARQL 1.0"). It reports no experiments; it presents itself as a standard "endorsed by the Director as a W3C Recommendation" (§ "Status of This Document").

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) · [bag semantics](#/glossary/bag-semantics) · [relational algebra](#/glossary/relational-algebra) · [outer join](#/glossary/outer-join) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form)

In the glossary's terms (our bridge): the algebra plays relational algebra's role, solutions are bags, OPTIONAL acts like a left outer join that leaves variables unbound instead of NULL, and MINUS resembles an anti-semijoin. The grammar uses EBNF, an extended BNF (§19.8).

**The paper's own terms:**
- **IRI, literal, blank node**: the three kinds of **RDF term**: a global identifier (a web-address-like name), a value (a string or number, optionally with a language tag or datatype), and an unnamed node (§1.2.4, §18.1.1). A **triple** is subject, predicate, object (§13).
- **RDF dataset**: one unnamed **default graph** plus zero or more **named graphs**, each named by an IRI; the **active graph** is the one patterns are matched against, changed by the `GRAPH` keyword (§13, §18.1.3).
- **Triple pattern**: a triple whose parts may be variables (`?x`); a **basic graph pattern** (BGP) is a set of them that must match together (§2, §5.1); a **group graph pattern** is the unit in braces that holds BGPs, filters and other patterns (§5.2).
- **Solution mapping**: a partial function from variables to RDF terms, one row of a result; "Variables are not required to be bound in a solution" (§1.2.3, §18.1.8). Two mappings are **compatible** when they agree on every variable both bind (§18.3).
- **Solution sequence** and **modifiers**: a result is a list of solutions, possibly unordered, reshaped by ORDER BY, projection, DISTINCT, REDUCED, OFFSET and LIMIT, in that order (§15).
- **Query forms**: SELECT (bindings), CONSTRUCT (a graph built from a template), ASK (yes/no) and DESCRIBE (a graph describing resources) (§16).
- **Property path**: a route between two nodes, written with operators for sequence, alternative, inverse, negation and repetition (§9).
- **Effective boolean value** (EBV): the rule that turns a filter's value into true or false; an expression can also give an **error**, e.g. on an unbound variable (§17.2, §17.2.2).
- **Entailment regime**: a rule set that says which graphs are well-formed and which statements follow from a graph, used to extend matching beyond plain subgraph matching (§18.7).

**Missing glossary terms:**
- **RDF**: the graph data format quoted above (abstract, §1): triples whose predicate labels an edge between two nodes.
- **Entailment**: graph G entails graph H when H's statements follow from G; under **simple entailment**, the base case, H's blank nodes can be replaced by terms so that H becomes part of G (general definition; §5.1.2 relies on it, §18.3.1).

**Builds on** (none on this site):
- SPARQL 1.0, the earlier Recommendation it extends (§ "Change Log", "Since SPARQL 1.0").
- The W3C drafts "RDF Data Access Use Cases and Requirements" and "SPARQL New Features and Rationale", whose use cases and requirements it is designed to meet (§1).
- XQuery 1.0 and XPath 2.0 (W3C query languages for XML) Functions and Operators, source of some of its functions and operators (§17.1).
- RDF Concepts and Abstract Syntax, for the data model's terms (§1.2.4), and RDF Semantics, for RDF merge and entailment (§13.1, §18.7.1).

## Problem and setting

- **The question:** what a query means: "defines the correct behavior for evaluation of graph patterns and solution modifiers, given a query string and an RDF dataset. It does not imply a SPARQL implementation must use the process defined here" (§18).
- **Normative scope:** "Unless otherwise noted in the section heading, all sections and appendices in this document are normative" (binding) (§1.1); §2, §3, §16.4 and §21 are marked informative (explanatory only). Update, federation, entailment regimes, result formats and the protocol are separate documents (§ "Status of This Document").
- **Bags:** solutions form "a multiset [multiset], also known as a bag" (§18.3); a query keeps duplicates unless DISTINCT removes them or REDUCED permits removing some (§15.3).
- **Missing values:** NULLs not discussed; a variable can be unbound, e.g. when an OPTIONAL part doesn't match (§6).
- **Errors in expressions:** a FILTER drops a solution whose expression is false or an error, and "These errors have no effect outside of FILTER evaluation" (§17); for `||` and `&&`, an error on one side can still give true or false (§17.2).
- **Matching:** "SPARQL evaluates basic graph patterns using subgraph matching, which is defined for simple entailment"; other entailment regimes are defined elsewhere (§5.1.2, §18.7).

## Approach

- **The pipeline:** query string → abstract syntax → an abstract query (algebra expression, dataset, query form) → evaluation (§18 intro, §18.1.10).
- **Translation to the algebra (§18.2).** Abbreviations are expanded and each group's FILTERs collected to apply to the whole group (§18.2.2.2). Inside a group, adjacent triple patterns become a BGP, OPTIONAL becomes LeftJoin, MINUS becomes Minus, BIND (assigning a computed value to a new variable) becomes Extend (the operator adding that binding), and the rest is joined (§18.2.2.5–8). Grouping, aggregates and modifiers follow (§18.2.4–§18.2.5).
- **Matching a BGP (§18.3.1):** a binding is a solution when replacing its variables, and the pattern's blank nodes, by terms turns the pattern into a subgraph of the active graph; its multiplicity is the number of distinct ways to replace the blank nodes.
- **The algebra (§18.5).** Join merges compatible pairs, and multiplicities multiply and add; LeftJoin is the filtered join plus the left solutions with no compatible partner that passes the filter; Union adds multiplicities; Filter keeps solutions whose expression has EBV true. Minus removes a left solution only when some right solution is compatible with it and shares a variable, since otherwise "P MINUS {} would otherwise be empty for any pattern P". Sequence operators (OrderBy, Project, Distinct, Reduced, Slice (the operator for OFFSET and LIMIT), …) and aggregate operators (§18.5.1) complete it.
- **Evaluation (§18.6):** each operator applies to its arguments' results; GRAPH switches the active graph, and EXISTS substitutes the current bindings into its pattern and tests for a non-empty result.
- **Paths (§18.4):** repetition is evaluated by a search that records visited nodes, and "Some operators only produce a set of solution mappings".
- **Two negations (§8):** FILTER NOT EXISTS tests a pattern under the current bindings, MINUS subtracts solutions; "In some cases they can produce different answers" (§8.3).
- **Extension points:** extensions may add operator mappings only where the standard gives a type error (§17.3.1), and "any function or operator that is specified to return an error under some conditions is a valid extension point" (§17.6). Entailment regimes must meet four conditions on BGP matching (§18.7).
- **Grammar (§19.8):** EBNF, case-insensitive keywords (except `a`), and "LL(1) when the rules with uppercased names are used as terminals" (a parser picks each rule from the next token).

## Results

No experiments (the document is a specification; § "Status of This Document"). Its design claims:
- BGP matching "is optimized for ease of computation rather than redundancy elimination" (§18.3.2).
- Path repetition "does not introduce duplicates", and "matching cycles does not lead to undefined or infinite results" (§9.4).
- A short argument that SPARQL meets its own entailment-regime conditions under simple entailment (§18.7.1).

## Limits the authors state

- Results may hold redundancies even when the active graph is lean (has no redundant blank-node triples), and "it allows logically equivalent datasets to yield different query results" (§18.3.2).
- "SPARQL does not define a total ordering of all possible RDF terms"; the relative order of two solutions is undefined when no ORDER BY expression separates them (§15.1), and subsets chosen with LIMIT and OFFSET "will not be useful unless the order is made predictable by using ORDER BY" (§15.4).
- REDUCED "does not guarantee a defined cardinality" (§18.5); SAMPLE (the aggregate that picks an arbitrary value from each group): "Sample is not required to be deterministic for a given input" (§18.5.1.8); for GroupConcat (string concatenation over a group), "The order of the strings is not specified" (§18.5.1.7); for DESCRIBE, "The description is determined by the query service" (§16.4).
- "The effect of a query on an inconsistent graph is not covered by this specification" (§18.7).
- On RDF URI references that are not IRIs, "The behavior of a SPARQL query against RDF statements composed of such RDF URI references is not defined" (§4.1.1); triple patterns with a literal subject never match (§18.1.5).
- "SPARQL queries using extension functions are likely to have limited interoperability" (§17.6); in a function call "The order of argument evaluation is not defined" (§17.2.1); the use of rdf:langString (the datatype returned for literals with a language tag) "should be considered experimental (and non-normative)" (§17.4.2.7).
- In SPARQL 1.0, where the simplification step (replacing a join with the empty pattern by its other argument) is applied made queries with a doubly nested filter inside OPTIONAL ambiguous; applying it after all translation is the preferred reading (§18.2.2).
- Security: FROM, FROM NAMED (clauses naming the graphs a query reads) or GRAPH may dereference URIs, the contents of file: URIs "can in some cases be accessed, processed and returned as results", and requests from an endpoint (a SPARQL query service on the web) "may be a source of indirection attacks" (attacks relayed through an endpoint inside a firewall) (§21).

## Open problems and building blocks

  - Matching conditions for all entailment regimes: "it is an open research problem to state such conditions in a single general form which applies to all forms of entailment and optimally eliminates needless or inappropriate redundancy" (§18.7).
  - Literal subjects: it quotes the RDF Core Working Group that "a future WG with a less restrictive charter may extend the syntaxes to allow literals as the subjects of statements" (§18.1.5).
- **Released:** the specification, with its grammar (§19.8) and the media type `application/sparql-query` (extension `.rq`, §22). §18.2.2 refers to two non-normative test cases.
- **To reuse it:** conformance rests on the grammar and the query forms, and the document "is intended for use in conjunction with" the SPARQL 1.1 Protocol and the result formats (§20).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
