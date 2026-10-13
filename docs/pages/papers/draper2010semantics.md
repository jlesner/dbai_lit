# XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition)

**XQuery 1.0 and XPath…** · W3C Recommendation 2010, revised 2015 (a standard, not a paper)

Read: [Paper](http://www.w3.org/TR/2010/REC-xquery-semantics-20101214/)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- W3C's formal semantics of XQuery 1.0 and XPath 2.0: each expression is rewritten ("normalized") into a smaller Core language, which gets static typing rules and dynamic evaluation rules, written as inference rules (§3.2; §4).
- The static semantics (typing rules) is normative, as are §3.1.1 and §8's auxiliary judgments; the dynamic evaluation rules of §3–5 are only explanatory, since the XQuery and XPath specifications define the dynamic semantics normatively (§1.1). It covers XPath 2.0 only with the XPath 1.0 compatibility rules off (§1), and leaves conformance to host languages (§6).

## In plain words

XPath and XQuery are languages for querying XML documents, set by W3C (the World Wide Web Consortium, the web's standards body) (§3.4: "most generally used to process documents"), and their main specifications define them in English. This W3C Recommendation, a standard rather than a paper, sets out to define their meaning "with mathematical rigor", which it says "ensures that no corner cases are left out" (§2.1). Each expression is first rewritten into a smaller core language; an optional typing step then works out the type of its result without reading the data (schemas aside); and evaluation computes its value. Each step is written as rules that derive one fact from others (§3.2). There are no experiments or theorems: the contribution is the definition itself. The typing rules are binding (normative); the evaluation rules of §3–5 are only explanatory, since the XQuery and XPath specifications define evaluation normatively (§1.1). It covers XPath 2.0 only when the XPath 1.0 compatibility rules (a mode that mimics the older version) are off (§1), and its front matter says it "is currently not maintained".

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) (here: what each XQuery or XPath expression yields, and its type) · [BNF](#/glossary/bnf-backus-naur-form) (App. A's grammars use the XML specification's EBNF, an extended form) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [finite-state machine](#/glossary/finite-state-machine) (finite automata, suggested for computing subtyping, §8.3.2).

**The document's own terms:**
- **XPath / XQuery** (written "[XPath/XQuery]" where a rule serves both): XPath 2.0 locates nodes in a tree by path expressions (§4.2); XQuery 1.0 adds e.g. FLWOR expressions (for, let, where, order by, return), constructors (expressions that build new XML nodes) and a prolog (the declarations that open a query) (§4.7–4.8; §5). Both are "functional" and "typed" (§1).
- **XDM (the data model)**: the values these languages work on, defined in a companion W3C document (§1). A **value** is "a sequence of zero or more items", an **item** an atomic value or a node (element, attribute, document, text, comment, processing instruction, i.e. a note to the consuming application) (§2.3.1).
- **judgment**: a statement that holds or not, e.g. `Expr => Value` ("yields") and `Expr : Type` ("has type") (§2.1.2).
- **inference rule**: premises above a line, a conclusion below; if all premises hold, the conclusion holds (§2.1.4).
- **environment**: a dictionary from names (e.g. variables, functions) to objects (e.g. types, values, function bodies); `statEnv` is the static one, `dynEnv` the dynamic one (§2.1.3; §3.1).
- **normalization**: rewriting an expression into its equivalent in the Core by mapping rules (§3.2.2); "nothing to do with Unicode Normalization" (§3.2.1).
- **XQuery Core**: the subset of XQuery that normalization targets; static typing and evaluation are defined only on Core expressions (§3.2.1; App. A).
- **types**: item types combined by sequence, choice (|), interleaving (&: two sequences merged, each keeping its own order), the occurrence marks ?, + and *, `empty` (matches the empty sequence) and `none` (matches no values) (§2.4.3).
- **subtyping**: one type is a subtype of another when every value that matches the first also matches the second (§8.3.2).
- **host language**: a specification that includes this one normatively, such as XQuery 1.0 or XSLT 2.0 (W3C's XML transformation language) (§ "Status of this Document"; §6).

**Missing glossary terms:**
- **static type checking (static typing)**: in the document's words, "Static type analysis infers the output type of an expression based on the type of its input expressions", which allows "early detection of type errors" (§1).
- **type soundness**: used (§5.15; §8.4) but not defined; §3.2.1 comes closest: "If static typing of an expression does not raise a type error, then dynamic evaluation of the same expression will not raise a type error".

**Builds on:**
- The companion W3C specifications: XQuery 1.0, XPath 2.0, Functions and Operators, the Data Model and Serialization (§1); none is on this site.
- XML Schema Parts 1 and 2 (W3C's languages for document structure and data types), on which the type system is based (§2.4.1).
- Tree grammars and tree automata (finite-state machines that read trees), for computing matching and subtyping: background reading it points to, the Handbook of Formal Languages (Rozenberg and Salomaa) and Tree Automata Techniques and Applications (Comon et al.) (§8.3.1–8.3.2; App. E.3).

## Problem and setting

- **The question:** a precise formal meaning for each expression of XQuery 1.0 and XPath 2.0 "in terms of the [XPath/XQuery] data model" (§1), and the rules that decide whether an expression is well typed (§3.2.3).
  - The reader "is already familiar with the [XPath/XQuery] language" (§1).
  - All URIs are absolute (§2.2); data model constraints hold (§2.3); schema import gets "a legal schema as input" (App. D.1.1).
  - Static typing assumes a static type analysis phase "that precedes any access to the input data" (§3.2.1). Documents without a schema get a standard type that "may include any legal XML content" (§3.2.1).
- **What "correct" means:** an expression yields a value when the evaluation judgment can be derived by the rules, and has a type when the typing judgment can (§2.1.5). Dynamic errors are not formalized, except the rules to detect type errors statically (§3.3).

## Approach

- **Two phases** (§3.2.1, Fig. 1): static analysis (parsing, the static context, normalization, optional static typing), then dynamic evaluation. The document says this processing model "is not intended to describe an actual implementation", but "any implementation should produce the same results" as following it (§3.2.1).
- **Normalization** (§3.2.2; §4): e.g. a path `A/B` becomes a `for` loop over the nodes of `A`, wrapped in a call that returns resulting nodes in document order (the order they appear in the document) without duplicates (§4.2).
- **Static typing** (§3.2.3): rules compute an expression's type from its parts' types, so the type "depends only on the type of its sub-expressions"; if no rule applies, the expression is not well typed. A type inferred this way is one "such that any evaluation of that [expression/query] is guaranteed to yield a value that belongs to that type" (§3.2.3).
- **The empty-type rule** (§4): most expressions with the empty type are a static type error, which catches e.g. misspelled element names (§4 Example).
- **Evaluation rules** (§3.2.4): relate Core expressions to values.
- **Types and subtyping** (§2.4; §8.3): the type system "captures most of the features of [Schema Part 1]" (§1). Since subtyping by value inclusion "does not give a simple means to compute subtyping", the document notes that it can be computed as inclusion between finite automata, modelling the structure of types by regular expressions (§8.3.2).
- **Function typing** (§7): extra rules for functions whose signatures give "little useful type information" (§2.5).
- **Schema import and validation** (App. D; App. F): a mapping from XML Schema into the type system, with a table marking each feature handled, ignored, not handled or "Not in v1.0" (App. D.1.1), and a partial model of validation (checking a document against a schema, which annotates it with types) (App. F).
- **Conformance** (§6): left to the specifications that use this one, which "must not relax the constraints" it expresses; a **static typing extension** "must always provide a more precise type" than the one defined here (§6.1.1).

## Results

No experiments (the document is a specification, § "Status of this Document"), and no theorems. The authors' stated advantages and design claims:
- A rigorous semantics "clarifies the intended meaning of the English specification, ensures that no corner cases are left out, and provides a reference for implementation" (§2.1).
- Static typing allows "early detection of type errors, and can be used as the basis for certain classes of optimization" (§1); "dynamic type checking can be avoided when static typing is enabled", though evaluation "may still raise a non-type error" (§3.2.1).
- Implementability "has been tested in the context of its normative inclusion in host languages" (§ "Status of this Document").

## Limits the authors state

- The document "is currently not maintained"; "no further maintenance (including correction of reported errors) is planned", nor "further development of the XQuery and XPath Formal Semantics" (front matter, informative note).
- Not normative: the dynamic semantics rules of §3–5, the examples and the notes are "provided for explanatory purposes" (§1.1); the schema mapping (App. D) and the validation semantics (App. F) "are informative and do not handle every feature of XML Schema" (§1.1).
- Covers XPath 2.0 "only when the XPath 1.0 backward compatibility rules are not in effect" (§1).
- The type system "does not model uniqueness constraints and facet constraints on simple types" (§1; also §2.4.1; i.e. keys, and limits such as a value range); some schema features are "Not in v1.0" or "Not handled" (App. D.1.1); schema include, redefine and import are "not specified here" (App. D.2.2–D.2.4); attribute group and model group definitions "are not currently handled by the mapping" (App. D.7–D.8).
- Not specified formally: the conditions for dynamic errors, error codes, and "the rules about errors and optimization" (§3.3); parsing (§3.2.1); relative URI resolution (§2.2); boundary-space behaviour (whether whitespace between constructor tags is kept) (§3.1.1; §5.3); the normalization of direct constructors' content and attribute values (§4.7.1; §4.7.1.1); how namespaces are copied in element constructors (§4.7.3.1); the version-declaration error (raised for an unsupported language version) (§5.1); and the dynamic semantics of `order by` and of the ordering mode (whether results must keep document order) in FLWOR expressions, "as it would require the introduction of tuples" (§4.8; §4.8.4). No inference rules for the namespace axis (§8.2.2.1.6).
- Static typing "is optional" (§3.2.1), "catches only certain classes of errors" (§3.2.1), and some rules "are not very precise", e.g. for the parent, ancestor and ancestor-or-self axes (directions a path step moves in) and `fn:root` (§6.1.1); the FLWOR result type "is not the most specific type possible" (§4.8.2).
- Not for stand-alone use: "it is not intended to be implemented outside a host language" (§ "Status of this Document").

## Open problems and building blocks

- **Open:** one "open issue" in an editorial note: how attribute-declaration derivation and "prohibited" attribute uses map into the type system (App. D.1.4.1). The ancestor-axis rule is formulated as it is partly "in case the static typing for the parent axis gets improved in a future version" (§8.2.2.1.9).
- **Released:** the specification, also in non-normative "XML and Change markings relative to first edition" formats (front matter). Nothing else stated.
- **To reuse it:** a host language that references it normatively (§ "Status of this Document"; §6); for static typing, a static analysis phase before data access (§3.2.1); a legal input schema for schema import (App. D.1.1). An implementation supporting schema import and validation "must take simple type facets and identity constraints into account" (§2.4.1; identity constraints are XML Schema's keys and references). Any implementation must guarantee that external functions return their declared types, "To ensure type soundness" (§5.15).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
