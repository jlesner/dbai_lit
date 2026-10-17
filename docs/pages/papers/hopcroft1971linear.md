# A Linear Algorithm for Testing Equivalence of Finite Automata

**A Linear Algorithm for…** · Cornell University technical report TR 71-114, December 1971

Read: [PDF](https://ecommons.cornell.edu/handle/1813/5958)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Decides whether two finite automata with start states (deterministic in later terms: δ maps each state and symbol to one state, §II, PDF p. 4) accept the same strings, in time the authors bound by a constant times the size of the input alphabet times the number of states of the larger automaton (abstract, PDF p. 2; Thm. 1, PDF p. 6, gives the sum of both automata's states), on a random access computer (§IV, PDF p. 6).
- Merges the sets of the two start states, then for each merged pair merges the sets holding their successor states on every symbol, with a merge/find set structure taken from another report; the automata are equivalent if and only if, when no pairs remain, no set holds both a final and a non-final state (§I, §III, PDF pp. 3–5; Thm. 2, PDF p. 8).

## In plain words

Two finite automata (machines that read strings through finitely many states, accepting some) are equivalent if they accept the same strings. The authors say the tests in most texts take time growing with the square of the state count, and offer theirs for when the automata have start states and one wishes "solely to test equivalence" (§I, PDF p. 3). It merges groups of states that must behave alike if the automata are equivalent, then checks that no group mixes final (accepting) and non-final states. On a random access computer (a model of computer used to count steps), using a set-merging method from another report, they bound its time by a constant times the alphabet size times the larger automaton's states, and prove it correct (abstract, PDF p. 2; §I, §IV, PDF pp. 3–8).

## Background and terms

**Terms to know:** [finite-state machine](#/glossary/finite-state-machine) (its paragraph on finite automata); the rest are not in the glossary yet.

**The paper's own terms:**
- **finite automaton**: states, input symbols, a transition function giving one next state per state and symbol, a start state and final states; the function extends to strings (§II, PDF p. 4). In later terms, deterministic (ours).
- **equivalent states, equivalent automata**: every input string leads both states to final states or both to non-final ones; automata are equivalent if their start states are (§II, PDF p. 4). In the glossary's terms, a case of [program equivalence](#/glossary/program-equivalence) (ours).
- **right-invariant equivalence relation**: a grouping of the states of both automata into classes such that two states in one class have, on any symbol, next states in one class (§II, PDF p. 4).
- **linear list merging algorithm, MERGE, FIND**: a set structure from Hopcroft and Ullman's report [3]. From n one-element sets, MERGE(i, j, k) combines the sets named i and j into one named k; FIND(i) names the set holding i. Any sequence of these "whose length does not exceed a constant times n" takes time "bounded by a constant times n" (§I, PDF pp. 3–4).
- **pushdown store**: a stack of state pairs still to process (§III, PDF p. 5).
- **random access computer**: the machine model of the time bound (§IV, PDF p. 6); any memory cell is reached in one step (general definition).

**Missing glossary terms:**
- **union–find (disjoint-set) structure** (general definition): keeps disjoint sets under two operations, union of two sets and finding the set holding an element. The paper's MERGE and FIND are these (ours).

**Builds on:**
- Hopcroft's state-minimization algorithm [2], which "can be used to test the equivalence" of two automata (§I, PDF p. 3).
- The tests "given in most texts" [1, 5] (Harrison; McCluskey) (§I, PDF p. 3).
- Hopcroft and Ullman, "A Linear List Merging Algorithm", Cornell TR 71-111 [3] (§I, PDF p. 3).

None is on this site.

## Problem and setting

- **Question:** are two finite automata with start states equivalent (§II, PDF p. 4)?
- **Assumptions:** one set of input symbols for both; state sets assumed disjoint "to simplify notation", with one transition function covering both (§II, PDF p. 4); time counted on a random access computer (§IV, PDF p. 6).
- **Correct** means answering "equivalent" exactly when the start states are equivalent (§II, PDF p. 4).
- Not discussed: automata with several or no next states for a symbol.

## Approach

- **Idea (§III, PDF pp. 4–5).** Equivalent automata have equivalent start states, and equivalent states have equivalent next states. So sets are merged when a state in one "must be equivalent to a state in the other" for the automata to be equivalent.
- **Steps (§III, PDF p. 5)** (the paper calls the sets lists). (1) One set per state. (2) Merge the start states' sets; push the pair on the pushdown store. (3) Until the store is empty: pop a pair; for each symbol, FIND the sets of the two next states, and if they differ, MERGE them and push the pair of set names. (4) Equivalent "if and only if no list contains both a final and a non final state".
- **Time (§IV, PDF p. 6).** Each push comes with a merge that removes one set, so at most n − 1 pairs are pushed (n states in all); each popped pair costs a constant times the number of symbols.
- **Lemma 1 (§IV, PDF pp. 6–8).** The final lists form a right-invariant equivalence relation that puts the start states together, "the coarsest right invariant equivalence relation" doing so (coarsest: with the fewest classes), in the lemma's words.
- **Correctness (§IV, PDF p. 8).** The proof compares the final lists with the relation that holds when two states accept exactly the same strings, using Lemma 1.

## Results

Theory; no experiments.
- **Thm. 1 (§IV, PDF p. 6):** on a random access computer, time at most a constant times the number of input symbols times the two automata's total number of states; the abstract uses the larger automaton's states (PDF p. 2). The algorithm uses the MERGE/FIND structure of [3] (§I, PDF pp. 3–4).
- **Thm. 2 (§IV, PDF p. 8):** "The algorithm for testing the equivalence of finite automata is correct": some list mixes final and non-final states if and only if the automata are not equivalent.

## Limits the authors state

None stated as limits. The authors offer the method for when "the finite automata have start states and one wishes solely to test equivalence" (§I, PDF p. 3).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** the MERGE/FIND structure of [3] (§I, PDF pp. 3–4); a random access computer for the bound (§IV, PDF p. 6); two automata with start states over the same input symbols, one next state per state and symbol (§II, PDF p. 4).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/theory-misc">theory-misc</a></span>
