# XML Path Language (XPath) Version 1.0

**XML Path Language (XPath) Version 1.0** · W3C Recommendation 16 November 1999 (status updated October 2016); a standard, filed as a paper

Read: [Paper](https://www.w3.org/TR/1999/REC-xpath-19991116)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Defines XPath 1.0, "a language for addressing parts of an XML document" made for XSLT and XPointer (abstract; §1), with a grammar in EBNF (§1), a tree data model of seven node types (§5) and a core function library every implementation must support (§1; §4).
- Location paths are steps of axis, node test and predicates (§2.1); a comparison of a node-set with a number or a string is true "if and only if there is a node" in it for which the comparison holds (§3.4), so `price>30` and `price<=30` are both false for an element with no `price` child (our reading of the rule).
- W3C plans no further maintenance and points to later versions (§ "Status of this document").

## In plain words

XPath is a small language for picking out parts of an XML document (a text file of nested, named elements), written as a path like a web address (§1). The editors call it the result of an effort to provide "a common syntax and semantics" for what two languages of the W3C (the World Wide Web Consortium, a web standards body) share: XSLT, which transforms XML, and XPointer, which points into it (§1). The document defines, in English with a grammar, how a document is seen as a tree, how a path walks it, the four kinds of value, the required functions and how values compare (§1–§5).

It has no experiments or theorems and presents itself as a W3C Recommendation (an endorsed W3C standard), "a stable document" (§ "Status of this document"). Comparing a set of tree nodes with a number or a string is true exactly when some node in the set passes, so for a book with no price, both price above 30 and price at most 30 are false (§3.4; our reading). A 2016 status note says later versions exist and no further maintenance is planned (§ "Status of this document").

## Background and terms

**Terms to know:** [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form) (the grammar uses the EBNF notation of the XML Recommendation, an extended BNF, §1) · [DOM tree](#/glossary/dom-tree) (XPath's tree is its own model, which the document says differs from the DOM in places, §5, §5.3).

**The paper's own terms:**
- **node**: one of seven types: root, element, text, attribute, namespace, processing instruction (an instruction to an application embedded in the XML) and comment (§5). The root is the parent of the top element (§5.1); an element is the parent of its attributes and namespace nodes, but they are not its children (§5.3, §5.4).
- **string-value**: the text of a node; for an element or the root, all the text inside it joined in document order (§5.1, §5.2).
- **document order**: the order in which each node's first character appears in the document after general entities are expanded (§5).
- **expanded-name**: a node's name as a pair of a local part and a possibly null namespace URI (a web-address-style identifier) (§1, §5).
- **context**: what an expression is evaluated against: a context node, a context position and size (two positive integers), variable bindings, a function library and namespace declarations; XSLT and XPointer say how it is set (§1).
- **location path** and **location step**: a path is steps separated by `/`, each picking nodes relative to the nodes the previous step picked; a path starting with `/` starts at the root (§2). A step has an **axis** (the tree relation to follow), a **node test** (which kind or name of node to keep) and zero or more **predicates** (filters in square brackets) (§2.1).
- **axes**: thirteen, e.g. child, descendant, parent, ancestor, following-sibling, attribute and self (§2.2); **forward** axes count positions in document order, **reverse** axes (ancestor, preceding, …) backwards (§2.4).
- **abbreviated syntax**: `child::` may be left out, `@` stands for `attribute::`, `//` for this node or any descendant, `.` and `..` for self and parent (§2.5).
- **node-set**: "an unordered collection of nodes without duplicates", one of four value types with boolean, number and string (§1).

**Missing glossary terms:**
- **XML** (general definition): a text format for tree-shaped documents made of nested, named elements with attributes and text, e.g. `<book><price>40</price></book>`; the document relies on the XML 1.0 Recommendation (App. A.1).
- **XML namespace** (general definition): a URI that qualifies element and attribute names, usually through a prefix such as `xsl:`; documents must conform to Namespaces in XML (§5).
- **IEEE 754** (general definition, with this document's use): the standard for binary floating-point numbers; every XPath number is an IEEE 754 double, including "Not-a-Number" (NaN), infinities and two zeros (§3.5).
- **DTD** (document type definition; general definition): a schema inside or alongside an XML file that declares its elements and attributes; XPath takes unique IDs and attribute defaults from it (§5.2.1, §5.3).

**Bridges to the glossary:** in the glossary's terms, XPath is a [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) (ours).

**Builds on:**
- XML 1.0 and Namespaces in XML, its normative (binding) references (App. A.1; §5).
- IEEE 754 for numbers (§3.5; App. A.1).
- XSLT and XPointer, the two languages it was made for; at the time XSLT was a Recommendation and XPointer a Working Draft (§1; App. A.2).
- The XML Information Set, a W3C draft describing the information a document holds, which App. B maps onto XPath's tree (non-normative).

## Problem and setting

- **The question:** one syntax and meaning for addressing parts of an XML document, shared by XSLT and XPointer, plus "basic facilities for manipulation of strings, numbers and booleans" (§1). It is designed to have a "natural subset" that can be used for matching nodes against patterns, a use XSLT describes (§1).
- **What it works on:** "the abstract, logical structure of an XML document, rather than its surface syntax" (§1), modelled as a tree (§5).
- **What "correct" means:** the prose rules of §2–§4 for each construct, with the grammar of numbered productions. The host language supplies the context (§1), and XPath sets no conformance rules of its own (§6).
- **Values and types:** four basic types; variables may hold further types (§1), which XSLT and XPointer define, and their conversions are then "dependent on that type" (§4.2–§4.4). A string converts to a number only when it has XPath's number syntax, with optional whitespace and minus sign; any other string becomes NaN (§4.4).
- **DTDs:** "If a document does not have a DTD, then no element in the document will have a unique ID" (§5.2.1).

## Approach

- **Paths:** a step's nodes come from its axis and node test, then each predicate filters them in turn (§2.1). The steps of a path compose left to right: each node picked so far becomes the context for the next step, and the results are united (§2).
- **Predicates and positions:** a predicate whose value is a number keeps the node at that position, so `para[3]` means `para[position=3]`; any other value is turned into true or false (§2.4). Positions depend on the axis: `//para[1]` "does not mean the same" as `/descendant::para[1]` (§2.5), and `preceding::foo[1]` differs from `(preceding::foo)[1]` (§3.3).
- **Comparisons (§3.4):** when a node-set is compared with another node-set, a number or a string, the result is true if and only if some node (or pair of nodes) makes the comparison true, after converting its string-value to a number when the other side is a number; with a boolean, the node-set is first turned into true (non-empty) or false. Without node-sets, `=` and `!=` convert both sides to a common type (boolean, else number, else string), and `<`, `<=`, `>`, `>=` convert both to numbers. The document's own note: for a node-set `$x`, `$x="foo"` is true when "some node in $x has the string-value foo", while `not($x!="foo")` is true when "all nodes in $x have the string-value foo".
- **Operators:** `or` and `and` skip the right side when the left decides (§3.4); precedence runs, lowest first, `or`, `and`, equality, relational, all left-associative, so "3 > 2 > 1 is equivalent to (3 > 2) > 1, which evaluates to false" (§3.4); `div` is floating-point division and `mod` a truncating remainder (§3.5); `|` unites node-sets (§3.3).
- **Conversions (§4.2–§4.4):** a node-set becomes a string through its first node in document order, a boolean by being non-empty, and a number through its string.
- **Core function library (§4):** functions "that XPath implementations must always include", in four groups: node-set (`last`, `position`, `count`, `id`, names), string (`concat`, `contains`, `substring`, `translate`, …), boolean (`not`, `lang`, …) and number (`sum`, `floor`, `round`, …), 27 in all (§4.1–§4.4, our count).
- **Tokens (§3.7):** the longest token wins, and ordered rules decide whether `*` or a name like `div` is an operator.
- **Data model (§5):** the seven node types, their string-values and names, document order, and how entities (named text substitutions), CDATA sections (literal text blocks) and defaulted attributes appear in the tree.

## Results

No experiments and no theorems (§1–§6): a specification. Its stated design claims:
- A "compact, non-XML syntax to facilitate use of XPath within URIs and XML attribute values" (§1).
- A core function library "that all XPath implementations must support" (§1).
- The ancestor, descendant, following, preceding and self axes "partition a document (ignoring attribute and namespace nodes)": they do not overlap and together contain every node (§2.2).
- Endorsed as a W3C Recommendation, "a stable document" (§ "Status of this document"); the 2016 update says it "remains widely used, and is referenced normatively from other W3C specifications" (same place).

## Limits the authors state

- "no further maintenance (including correction of reported errors) is planned for this document"; later versions exist (§ "Status of this document").
- XPath "does not define any conformance criteria for independent implementations of XPath", leaving them to the specifications that use it (§6).
- Expressions "may return unexpected results unless both the characters in the XPath expression and in the XML document have been normalized into a canonical form" (one Unicode spelling per character) (§3.6).
- `translate` "is not a sufficient solution for case conversion in all languages" (§4.2); `string` "is not intended for converting numbers into strings for presentation to users" (§4.2).
- `number` "should not be used for conversion of numeric data occurring in an element in an XML document unless the element is of a type that represents numeric data in a language-neutral format" (§4.4).
- A stylesheet that assumes attribute defaults from an external DTD "may not work with some non-validating XML processors" (parsers that skip the DTD) (§5.3).
- The relative order of namespace nodes and of attribute nodes is implementation-dependent (§5); `name` typically returns the name as written in the source, but may not when several prefixes map to one namespace, unless the implementation keeps the original prefix (§4.1).
- App. B is written for a new version of the XML Information Set draft, "expected to be released at the same time or shortly after" this version of XPath (App. B).

## Open problems and building blocks

- **Open:** "A future version of XPath may provide additional functions for case conversion" (§4.2). No other open problem stated.
- **Released:** the specification, "available in XML or HTML" (front matter), with a W3C list of known errors (§ "Status of this document").
- **To reuse it:** a host language that sets the context (§1); the full core function library (§4); documents that conform to Namespaces in XML (§5); in languages whose strings are 16-bit code units, a surrogate pair (two such units that encode one character) must count as one character (§3.6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
