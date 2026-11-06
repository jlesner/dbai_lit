# LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata

**LARA (Lookahead Automata ReDoS Analyzer)** · ASE 2026

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3832783.3837475) · [DOI](https://doi.org/10.1145/3832783.3837475)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A static detector of ReDoS (regexes whose backtracking match time grows super-linearly with the input) for regexes with lookahead assertions: it compiles the regex into an automaton with lookahead transitions, replaces each lookahead by ε-transitions into the lookahead's own automaton (the "matching NFA"), and runs classical ambiguity analysis on the result (abstract, PDF p. 1; §3.1, PDF p. 4). The authors state the matching NFA is not language-equivalent to the regex, and prove that on every input its degree of match, a count of the (state, position) pairs backtracking visits, equals the regex's lookahead-aware count (Thm. 3.3, PDF p. 5; the proof is in supplementary material the PDF does not link).
- Exponential and polynomial ambiguity are checked on 2- and 3-fold product automata, and a witness (prefix, pumpable infix, suffix) is extracted and replayed on Node.js, Python and Java engines (§3.4, PDF p. 6; §4.2, PDF pp. 6–7); written in Rust and compared with six static, dynamic and hybrid detectors on 42,794 lookahead regexes from the corpus of [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)"), against a reference set made of every tool's engine-confirmed attacks, and on 400 vulnerable regexes from 177 CVEs (§4.2–4.6, PDF pp. 6–10).
- A static check for one safety property of a DSL's programs, catastrophic backtracking in regular expressions, extended to lookahead by a reduction the authors prove (Thm. 3.3): the kind of safety gate the regex case of [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair) needs. As a gate it over-reports: the authors report that of 100 sampled reports that no tool's attack confirmed, 67 were false positives (§4.3, Tab. 2, PDF p. 7), and they state that its reference benchmark is built by the evaluated tools themselves (§4.2, PDF p. 7; §4.7, PDF p. 10). Backreferences, atomic groups and lookbehind are outside its scope (§4.7, PDF p. 10; §5, PDF p. 11).

## In plain words

Backtracking regular-expression engines try one way of matching after another, and for some patterns a crafted input makes matching time grow faster than the input, a denial-of-service attack called [ReDoS](#/glossary/redos-and-catastrophic-backtracking). The authors target patterns with lookahead (a check on the rest of the input that consumes nothing). They say static detectors (which analyse a pattern without running it) cannot capture the cost of re-running the lookahead, while dynamic detectors (which run it on generated inputs) and hybrid ones (which combine both) are costly or miss cases (abstract, PDF p. 1). Their static detector, Lara, turns such a pattern into an ordinary automaton (a state machine that reads the input) that, they prove, keeps the same upper bound on matching cost, so standard analyses apply (abstract, PDF p. 1). On a reference set of 5,889 vulnerable patterns, each confirmed on a real engine by some tool's attack, Lara covers 5,871, against 5,027 for the next best tool (§4.3, Tab. 1, PDF p. 7). On 400 vulnerable patterns from 177 published vulnerability reports it finds 99.50%, against 95.50% for the next best (Tab. 5, PDF p. 10). The authors call it "the first static ReDoS detection tool that systematically addresses lookahead assertions through a principled NFA construction" (§5, PDF p. 11) (an NFA is a nondeterministic finite automaton).

## Background and terms

**Terms to know:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language) (with full-match and partial-match semantics) · [finite-state machine](#/glossary/finite-state-machine) (finite automata) · [fuzzing](#/glossary/fuzzing) · [true and false positive rates](#/glossary/true-and-false-positive-rates) · [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation) · [NFA and ε-transition](#/glossary/nondeterministic-finite-automaton-nfa) (§2.3, PDF p. 3) · [Thompson's construction](#/glossary/thompsons-construction) (§3.2, PDF p. 4) · [infinite ambiguity](#/glossary/infinite-ambiguity-of-an-automaton) ("a proxy for the upper bound on matching cost", §2.3, PDF p. 3) · [product automaton](#/glossary/product-automaton) (§3.4, PDF p. 6) · [strongly connected component (SCC)](#/glossary/strongly-connected-component-scc) (§3.1, PDF p. 4)

**The paper's own terms:**
- **REwLA**: a regular expression with lookahead; it "subsumes standard regexes" (abstract, PDF p. 1).
- **la-NFA**: an NFA with lookahead transitions, which move on only if the rest of the input is *not* accepted by a sub-automaton; positive lookahead is a double negation (Def. 3.1, PDF p. 4).
- **Matching NFA**: the plain NFA made by replacing each lookahead transition with two ε-transitions, one to its target and one into the lookahead's own matching NFA (Def. 3.2, PDF p. 4). It "may accept strings that the lookahead regex rejects" (§3.3, PDF p. 5).
- **Degree of match**: the (state, position) pairs backtracking visits on an input, counted over all paths, used "as an upper bound on matching cost"; the **degree of la-match** adds, per lookahead transition and position, the paths reaching it times the lookahead's cost on the rest of the input (§3.3, PDF p. 5).
- **Attack pattern**: a prefix reaching the vulnerable structure, an infix repeated to grow the cost, a suffix that makes the match fail (§3.4, PDF p. 6).
- **𝒱, the unified reference benchmark**: the regexes for which at least one tool's attack succeeded on a real engine (§4.2, PDF p. 7). A tool's **Ref. Cov.** is how many of them it reports; its **unconfirmed** reports lie outside 𝒱 (Tab. 1, PDF p. 7).

**Builds on:** static ReDoS detection on Thompson's NFA (§2.3, PDF p. 3); the ambiguity criteria of Weber and Seidl and of Allauzen, Mohri and Rastogi (§3.4, PDF p. 6); the comparison methodology of Regulator (a fuzzing-based detector) and the corpus of Davis et al. ([Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)")) (§4.2, PDF p. 6).

## Problem and setting

Can static analysis detect ReDoS caused by lookahead, where each backtracking step of the main pattern re-runs the lookahead? In `\d*(?=\w*\s)` (digits, then a lookahead for word characters and a space) both parts are safe alone, yet under full matching on n digits it takes time quadratic in n (§2.4, Fig. 1, PDF pp. 3–4). The authors say static tools' workarounds, such as treating lookahead as a plain ε-transition or rewriting length-1 lookaheads, miss the cost when the lookahead itself iterates, and hybrid tools lack patterns for ReDoS "independently caused by lookahead interaction" (§2.4, PDF pp. 3–4).

- **Risk:** "there exist inputs triggering super-linear matching complexity under the backtracking model" (§2.1, PDF p. 3).
- **Semantics:** full-match throughout, as "the same regex may exhibit different worst-case behavior under partial-match semantics" (§4.2, PDF p. 6).
- **A confirmed vulnerability:** an attack whose input, its infix repeated to 1 MB, takes over 10 seconds or 16 GB on Node.js-14, Python-3.10 or Java-11 (§4.2, PDF pp. 6–7).

## Approach

Four steps (§3.1, PDF p. 4; Fig. 2, PDF p. 5): a la-NFA by Thompson's construction extended to lookahead; the matching NFA, labelled "Only lookahead-specific step" in Fig. 2; ambiguity tests on product automata and SCCs; attack extraction.

**Matching NFA and Thm. 3.3** (§3.3, PDF pp. 4–6). In the example, the `\d` and `\w` loops land in different SCCs joined one way, the pattern the polynomial-ambiguity criterion detects (PDF p. 5; Fig. 4, PDF p. 6). For any la-NFA and every input string, the matching NFA's degree of match equals the la-NFA's degree of la-match, so both share one cost bound (Thm. 3.3, PDF p. 5). The authors place its proof, "by structural induction on lookahead nesting depth" (proving it for each nesting depth from the one below), in the supplementary material, with the claim that the two measures "share the same growth classification" (finite, polynomial or exponential), from which product-automaton conditions on the matching NFA "soundly characterize super-linear or exponential growth of this matching-cost upper bound" on the original (PDF p. 5).

**Detection** (§3.4, PDF p. 6). Exponential: in the 2-fold product, reachable distinct states q and q′ with (q, q′) in the same SCC as a diagonal state (p, p) (a state paired with itself). Polynomial: in the 3-fold product, reachable states p and q in different SCCs with a path from (p, p, q) to (p, q, q). The checks take time of order n⁴ and n⁶ in the matching NFA's state count n, which "is typically small for real-world regexes".

## Results

**Setup** (§4.2, PDF pp. 6–7): 42,794 deduplicated lookahead regexes from Davis et al.'s corpus; baselines Regexploit (static, pattern heuristics), ReScue and Regulator (dynamic, fuzzing-based), and ReDoSHunter, Rengar and Revealer (static patterns, then validation by running) (§5, PDF pp. 10–11); one CPU core, 16 GB and 10 CPU minutes per regex. The authors call 𝒱 "a tool-assisted benchmark rather than an independently labeled ground-truth set" (PDF p. 7).

- **Coverage (research question RQ1; Tab. 1, PDF p. 7).** Lara covers 5,871 of 𝒱's 5,889, missing 18; ReDoSHunter covers 5,027, Regulator 5,016. The authors put all 18 misses down to timeouts, memory exhaustion or engine-specific constructs outside the REwLA grammar (§4.3.1, PDF pp. 7–8).
- **False positives (Tab. 2, PDF p. 7).** Of 100 sampled reports outside 𝒱 (no tool's attack confirmed them), a manual audit found 33 real vulnerabilities and 67 false positives: 36 from bounded counting (repetition capped at a fixed count, too strict for ReDoS in practice), 30 from constraints that block or bound attacks, 1 from the matching NFA's over-approximation.
- **Exploits (RQ2; Tab. 3, PDF p. 8).** Lara's attacks succeed on some engine for 75.87% of 𝒱, third behind ReDoSHunter (84.68%) and Regulator (84.39%).
- **Efficiency (RQ3; Tab. 4, PDF p. 10).** Median 0.05 s of CPU time and 7.67 MB per regex, against 2.35 s and 148.34 MB for ReDoSHunter (§4.5, PDF p. 9).
- **CVEs (RQ4; Tab. 5, PDF p. 10).** On 400 vulnerable regexes from 177 CVEs (published vulnerability reports), recall is 99.50%, against 95.50% for Rengar and 92.50% for ReDoSHunter; both misses were timeouts. Only 13 of the 400 contain lookahead; on the rest Lara is standard Thompson-NFA analysis (§4.6, PDF p. 9).

## Limits the authors state

- 𝒱 "is not independent of the evaluated tools"; real vulnerabilities may stay outside it if no current tool can trigger them, and RQ1 and RQ2's uniqueness results are "not … direct estimates of true recall over the full vulnerability space" (§4.7, PDF p. 10).
- Unconfirmed reports "require exploit validation or manual triage before being treated as actionable findings" (§4.3, PDF p. 7).
- Lara "does not solve all reachability constraints needed to make those witnesses trigger a real engine"; its main failure modes are character-class constraints between lookaheads, anchors and boundaries, polynomial cases beyond the 1 MB cap, engine-level pruning (engine optimizations that cut backtracking short) (§4.4, PDF p. 8).
- It has timeouts and out-of-memory cases where most weaker baselines have none, judged acceptable given its coverage (§4.5, PDF p. 9); the misses show "resource-intensive analysis on a very small tail of large regexes and incomplete support for dialect-specific constructs" (§4.3.1, PDF p. 8).
- Exploits are validated on three engine versions; "Results may differ on other engines or future versions" (§4.7, PDF p. 10).
- Excluded CVEs and regexes "may exhibit different vulnerability patterns", and the cases "may still be biased toward ecosystems with better-documented disclosures and code availability" (§4.7, PDF p. 10).
- Regexes using features such as backreferences or atomic groups "are outside the scope of this paper and remain future work" (§4.7, PDF p. 10).

## Open problems and building blocks

  - Offer the matching NFA and its witnesses (the attack patterns it extracts) as an interface to hybrid and dynamic detectors, which would supply constraint solving and engine validation (§6, PDF p. 11); "mostly an engineering problem, but not a plug-and-play substitution", as tools taking only regex syntax would need the automaton turned back into a regex (§5, PDF p. 11).
  - Broader dialect support needs a broader parser and la-NFA construction; fewer resource misses call for, e.g., "simplification, memoization, and more incremental product construction" (§4.3.1, PDF p. 8).
  - For non-REwLA features such as lookbehind, a workflow "can combine" Lara with engine-native or feature-specific detectors (§5, PDF p. 11).
- **Released:** "All data and reproduction artifacts underlying the results reported in this paper are publicly available in a DOI-backed Zenodo archive" (Data Availability Statement, PDF p. 12). The authors place the full proofs and detection details in supplementary material (§1, PDF pp. 2–3; §3.3, PDF p. 5; §3.4, PDF p. 6).
- **To reuse it:** REwLA regexes under full-match semantics (§4.2, PDF p. 6); the tool is in Rust, its parser a modified regex-lite (a lightweight Rust regex crate) (§4, PDF p. 6).

## On this site

- **Discussed in:** [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/dsl-regex">dsl-regex</a></span>
