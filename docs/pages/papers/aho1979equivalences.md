# Equivalences among Relational Expressions

**Equivalences among Relational Expressions** · SIAM J. Comput. 8(2) 1979

Read: [DOI](https://doi.org/10.1137/0208017)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tableaux for select-project-join expressions; equivalence and minimization via containment mappings.
- Equivalence is polynomial for "simple" tableaux (Thm 10, PDF p. 24), though containment stays NP-complete for them (PDF p. 25); NP-complete in general (Thms 7–8, PDF p. 18).
- Tableaux are "a stylized notation for a subset of" Chandra–Merlin's conjunctive queries (§1); set semantics throughout.

## In plain words

Many queries only filter rows by a fixed value, keep some columns and combine tables on shared columns. How a query is written changes its cost a lot, so the authors ask how hard it is to decide whether two such queries always agree, "with an eye toward globally optimizing queries" (§1, PDF p. 1). They write each query as a tableau, a grid of placeholders for the rows an answer needs, and two tableaux with matching outputs are equivalent when row-to-row mappings exist both ways. The grid also absorbs functional dependencies, rules such as a paper number fixing its title, and deleting redundant rows removes joins.

Even for these queries, deciding equivalence is NP-complete, so no fast general algorithm is expected (§5, PDF p. 15). For a subclass, simple tableaux, they give a test whose time grows as a fixed power of the input size, and "feel that most practical queries that contain only selects, projects, and joins can be represented by simple tableaux" (§1, PDF p. 2). They claim no first: the work studies the problem's inherent complexity.

## Background and terms

**Terms to know:** [relational algebra](#/glossary/relational-algebra) · [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [conjunctive query](#/glossary/conjunctive-query) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [functional dependency](#/glossary/functional-dependency) · [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy) · [set semantics](#/glossary/set-semantics) · [3-SAT](#/glossary/3-sat)

**The paper's own terms:**
- **select, project, join** (σ, π, ⋈): keep rows whose attribute A equals a constant; keep some columns, merging rows that become identical; natural join. A **restricted relational expression** uses only these, over **relation schemes** (a table's attribute set, written AB for {A, B}) (§2.1–2.3, PDF pp. 2–3).
- **instance**: one table over all attributes, of which each stored table is a projection. **Weak equivalence** (just "equivalence"): equal values on every instance; **strong equivalence**: equal values for every independent choice of the tables (§2.6–2.7, PDF p. 4).
- **tableau**: a matrix with a column per attribute. Its first row, the **summary**, is the output; the other **rows** are tuples the instance must contain. Symbols are **distinguished variables** (output), **nondistinguished variables** (exist somewhere), constants and blanks; no variable appears in two columns. Its value is the set of summaries under every substitution of constants that puts all rows into the instance (§3.1, PDF pp. 5–6).
- **homomorphism**, here: a map from one tableau's symbols to another's that fixes constants, keeps distinguished variables distinguished (or sends them to the summary's constant) and sends rows to rows (§4.1, PDF p. 10). **Containment mapping**: the row-to-row form of the same idea (§4.2, PDF p. 11).
- **limit with respect to F**: the tableau left after equating every pair of symbols that a set F of functional dependencies forces equal (§4.3, PDF p. 14).
- **simple tableau**: in any column where a nondistinguished variable appears in two or more rows, no other symbol appears in more than one row (§6.1, PDF p. 19).
- **covers**: row x covers row w if x has a distinguished variable wherever w does and the same constant wherever w has one (§6.2, PDF p. 21). **Promotion**: treating a repeated nondistinguished variable as a constant (§6.4, PDF p. 23).
- **tagged tableau**: rows carry the name of the stored table they come from, for strong equivalence (§7, PDF p. 25).

**Builds on:**
- Chandra and Merlin [8] ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)")): Theorem 2's proof is theirs (PDF p. 11), Theorems 4–5 have "analogous results for conjunctive queries" (PDF p. 12), and the NP-completeness results "strengthen those in [8]" (§5, PDF pp. 15–16).
- Zloof's tabular query language Query-by-Example [27]: tableaux "may be viewed as a form of" it (§1, PDF p. 1).
- Aho, Beeri and Ullman [1]: the limit's algorithm is "essentially" theirs (§4.3, PDF p. 14).
- Earlier optimizers [17], [19]–[21], [23], [25], which "do not claim to produce an equivalent expression of least cost" (§1, PDF p. 1).

## Problem and setting

- **Question:** how hard is deciding containment or equivalence of select-project-join expressions, with or without functional dependencies (§1, PDF p. 1)?
- **Fragment:** the three operators above. A "complete" set would add union, set difference and comparisons between two components of a tuple (§2.3, PDF p. 3).
- **Semantics:** relations and tableau values are sets (§2.3, PDF p. 3; §3.1, PDF p. 6).
- **Equivalence:** weak for most of the paper, strong in §7 (PDF pp. 25–28); algebraic equivalence, with schemes as variable attribute sets, is set aside (§2.5, PDF p. 4).
- **Constraints:** functional dependencies only (§2.2, PDF p. 2).
- **NULLs:** not discussed.

## Approach

- **Expressions to tableaux.** Rules build, bottom-up, a tableau with the expression's value on every instance (Thm. 1, §3.3, PDF pp. 7–8).
- **Containment test.** One tableau is contained in another exactly when they have the same output columns and a homomorphism (Thm. 2) or containment mapping (Thm. 3) runs from the containing tableau to the contained one (PDF p. 11); equivalence needs identical summaries up to renaming of distinguished variables and mappings both ways (Cor. 1, PDF p. 11). The "only if" proof makes one tableau's rows a database of distinct constants (PDF p. 11).
- **Removing joins.** A row can be deleted if another row agrees with it wherever it does not hold a nondistinguished variable found nowhere else (Cor. 2, PDF p. 12). By Theorems 4–5 (PDF p. 12), deleting rows reaches a minimum-row equivalent, unique up to renaming and row order (PDF p. 13); this also removes common subexpressions (§1, PDF p. 1).
- **Functional dependencies.** One tableau contains another on every instance satisfying a set F of dependencies exactly when their limits under F are contained as tableaux (Thm. 6, PDF p. 14; corollary for equivalence, PDF p. 15).
- **Hardness.** From a 3-SAT formula they build one tableau with a row per clause and one with seven rows per clause, one per satisfying assignment of its variables; the first contains the second exactly when the formula is satisfiable (Lemma 4, PDF pp. 17–18). Hence, for tableaux of restricted expressions with no dependencies, containment, equivalence, and equivalence when one tableau is the other minus some rows are NP-complete (Thm. 7); likewise for general tableaux without constants (Thm. 8; both PDF p. 18).
- **Simple tableaux.** Without repeated nondistinguished variables, equivalence means identical summaries up to renaming of distinguished variables and every row covered by a row of the other tableau (Lemma 5, PDF p. 21). A repeated variable goes by merging its rows and rows linked through repeated variables where the cover differs (the closure), into one covering row (Lemma 6, PDF p. 21) or by promotion (Lemma 8, PDF p. 24). Fig. 5's procedure (PDF p. 25) decides equivalence of simple tableaux in O(s³t²) time for at most s rows and t columns (Thm. 10, PDF p. 24), O(n³) in the input size n (its corollary).
- **Strong equivalence.** It holds exactly when tag-preserving containment mappings exist both ways (Thm. 11, PDF p. 26). Dependencies link differently tagged rows only if they "apply to two or more relations jointly" (§7.2, PDF pp. 26–27). Weak and strong equivalence reduce to each other in polynomial time (Lemmas 9–10, PDF p. 27).

## Results

The authors' claims:
- **Thms. 7–8 (PDF p. 18), Thm. 10 and corollary (PDF p. 24):** under In brief; conditions under Approach.
- **Thm. 9 (PDF p. 19):** under given functional dependencies the same three problems stay NP-complete for tableaux of expressions without select.
- **The limit** takes time "proportional to the square of the input size" (§4.3, PDF p. 14).
- **Containment of simple tableaux** is NP-complete (§6.5, PDF p. 25).
- **Thm. 12 (PDF p. 27):** strong equivalence is NP-complete for tableaux without constants and no dependencies; for tableaux from expressions, constants allowed, no dependencies; and for tableaux from expressions without constants, dependencies allowed. **Thm. 13 (PDF p. 27):** it is decidable in polynomial time for expressions that have simple tableaux.

## Limits the authors state

- The theory "carries over to multivalued dependencies as well, although an efficient equivalence test in that case is elusive" (§2.2, PDF p. 2) (multivalued dependency: for fixed values in some columns, two other column groups vary independently).
- Some tableaux correspond to no expression (§3, PDF p. 5), simple ones included (§6.1, PDF p. 20); "We know of no natural set of operators that characterizes tableaux exactly" (§3.3, PDF p. 10).
- Queries with simple tableaux are "a proper subset of the set of relational expressions" (§1, PDF p. 2).
- For tableaux in reduced form (no repeated nondistinguished variables), row coverage is "a sufficient, but not a necessary, condition" for containment (§6.5, PDF p. 25).
- Left without proof: Theorem 1's projection case, as "straightforward" (PDF p. 8); Theorems 4–5 (PDF p. 12); §7's results, as "analogous" to the weak case (PDF p. 25).
- The general test takes exponential time; they "have not considered the natural next step", optimization under an arbitrary cost criterion, which "appears to be very hard" (§8, PDF p. 28).

## Open problems and building blocks

- **Open** (§8, PDF p. 28):
  - "How far can we extend the class of expressions for which equivalence is efficiently decidable?"
  - Can the test run in even exponential time under multivalued dependencies? The techniques of [1] give a doubly exponential algorithm.
  - "Find a complete axiom system to transform an expression into any equivalent one" (axiom system: a set of rewrite rules).
- **Released:** Nothing stated.
- **To reuse it:** input: two tableaux of select-project-join expressions, plus optional functional dependencies; the polynomial test needs simple tableaux (Thms. 10, 13, PDF pp. 24, 27). §7.4 (PDF pp. 27–28) sketches extending it to quasi-simple tagged tableaux (each tag's rows simple, plus a condition on variables shared across tags), and to any tableau whose constants or distinguished variables split the rows into sets that cannot map into each other.

## On this site

- **Discussed in:** [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
