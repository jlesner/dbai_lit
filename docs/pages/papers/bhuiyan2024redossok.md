# SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS)

**SoK** · ASIA CCS 2025

Read: [PDF](https://arxiv.org/pdf/2406.11618) · [arXiv](https://arxiv.org/abs/2406.11618) · [DOI](https://doi.org/10.1145/3708821.3733912)  
Code: [SoKReDoS-ASIACCS25](https://github.com/PurdueDualityLab/SoKReDoS-ASIACCS25)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A systematization of knowledge on ReDoS (regular-expression denial of service) in two parts: a literature review of 35 papers from security, software-engineering and programming-languages conferences, 2015–2024, sorted by research direction (detection, prevention, mitigation) and compared on threat model, definition of a vulnerability and evaluation method (§3, Fig. 4, Tabs. 2–4); and an engineering review of the regex engines of nine programming languages: which ReDoS defense each has, since when, at what code size, and whether it is on by default (§4.1, Tab. 5).
- The review starts from a keyword search of the venues' proceedings, decides inclusion from each paper's abstract, introduction and evaluation, and codes the included papers along those four dimensions (§3); the engine review draws on source code, issue trackers, documentation and maintainers' blog posts (§4), then times regexes that the tool vuln-regex-detector predicts super-linear, with attack strings from the same tool, on an old and the latest version of each engine, opt-in defenses switched on (§4.2, Fig. 5, Tab. 9).
- Evidence that whether a regex is "safe" depends on the engine and on a threshold the field has not agreed on: the authors find "no consensus on what constitutes a vulnerability" (§3.3, Tab. 3); they rate only Rust's and Go's engines safe, six engines partly safe (V8's and .NET's linear-time engines opt-in) and CPython's not safe (Tab. 5), and report exponential behavior persisting on the latest Ruby and Java and polynomial behavior on JavaScript and Java (§4.2).

## In plain words

Many programming languages match regular expressions (regexes) with an engine that tries one way of matching after another. For some regexes, a crafted input makes this take exponential or polynomial time, so an attacker can tie up a server: this is ReDoS. The authors write that despite much research "there has been no systematization of knowledge" on ReDoS, that is, no survey organizing the field (abstract). They review 35 ReDoS papers from leading conferences of 2015–2024, study the regex engines of nine programming languages, and time likely-vulnerable regexes on an old and the latest version of each engine (§3, §4). Their two headline findings (abstract): "almost no studies" test whether ReDoS can be used against real systems, and many mainstream engines have added partial or full defenses, "rendering many threat models obsolete" (a study's assumptions about attackers and systems). Even so, with the defenses switched on, some of their test regexes still showed exponential behavior on the latest Ruby and Java (§4.2). They present the work as a survey with an engineering review, not as a new tool.

## Background and terms

**Terms to know:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language) · [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking) · [finite-state machine](#/glossary/finite-state-machine) · [fuzzing](#/glossary/fuzzing) · [NFA](#/glossary/nondeterministic-finite-automaton-nfa) (and DFAs, the models of K-regexes, §2.1.1, Fig. 1; engines resolve the NFA's "ambiguity" differently, §2.2) · [threat model](#/glossary/threat-model) (ReDoS's three ingredients, §2.3.1; §3 item (2), §3.2) · [algorithmic complexity attack](#/glossary/algorithmic-complexity-attack) (ReDoS is one, §2.3.1) · [Brzozowski derivatives](#/glossary/brzozowski-derivatives) (.NET's non-backtracking engine, §4.1.3) · [CVE, NVD and CWE](#/glossary/vulnerability-records-cve-nvd-cwe-cvss-epss) (ReDoS is CWE-1333, §2.3.1; §2.3.2) · [memoization](#/glossary/memoization) (in regex matching, §3.1.2; "selective" memoization caches only some intermediate results, contrasted with Ruby's "full memoization" in §4.1.2) · [systematization of knowledge (SoK)](#/glossary/systematization-of-knowledge-sok) (here, one meant "to delineate the state of the art and identify opportunities for further research", abstract)

**The paper's own terms:**
- **K-regexes and E-regexes**: Kleene's original regexes (concatenation, either-or, unbounded repetition), which finite automata model, and the extended ones; some extensions stay regular, others, such as backreferences (matching a repeat of an earlier captured group), "exceed the boundaries of regular languages" (§2.1.1–2.1.2; feature list: App. A, Tab. 6).
- **Spencer-style and Thompson-style engines**: Spencer's algorithm (1994) searches depth-first, backtracking when a path fails; E-regex features are easy to add, but worst-case match time is polynomial or exponential. Thompson's (1968) searches breadth-first, tracking every state the match could be in: linear in the input length, with "Limited E-regex support" (§2.2, Tab. 1).
- **Super-linear regex, attack string, pumping**: a vulnerable regex has attack strings "that take polynomial or exponential time to match in the string length"; pumping repeats the problematic part of the input (§2.2, §2.3.1). The threat model, after Davis et al. [38], needs a backtracking engine, such a regex, and attacker-controlled input reaching it (§2.3.1).
- **Detection, prevention, mitigation**: the three research directions: finding vulnerable regexes; removing the cause with new matching algorithms or regex repair; limiting an attack at run time (§3, Fig. 4).
- **Resource capping, time-based or counter-based**: stopping a match after a time limit or after a count of steps (§4.1.5, Tab. 5).
- **Exponential, High-Polynomial, Low-Polynomial, Linear**: §4.2's classes for a regex on its attack string: over five seconds with fewer than 500 pumps; over five seconds with 500 or more; over 0.5 seconds but neither of those; never times out.
- **OWASP Top 10** (general definition): the OWASP foundation's list of ten categories of web-application security risk.

**Builds on:**
- Schloegel et al. [111] (2024, an SoK on fuzzing): the review method followed (§3).
- Thompson [130] (1968) and Spencer [119] (1994): the two models of engine behavior that "almost all prior works rely on" (§1, §2.2).
- Davis et al. [38] (2021, selective memoization against ReDoS): the threat-model definition (§2.3.1) and Ruby's defense (§4.1.2).
- Davis et al. [37] (2019, regex portability; [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)")): the polyglot corpus §4.2 samples, with Davis et al.'s detector vuln-regex-detector [35, 36] (§4.2).

## Problem and setting

- **Questions.** Which research directions, threat models, definitions of a vulnerability and evaluation methods ReDoS papers use (§3); and "(1) Do the measurements and assumptions in the academic literature accurately reflect the latest versions of these engines?" and "(2) What is the impact and adoption of ReDoS defenses proposed by researchers in real-world regex engines?" (§4).
- **Review scope.** Papers of 2015–2024 at ten security, software-engineering and programming-languages conferences; a keyword search in June 2024 found 93, of which 35 met the inclusion criteria (§3; exclusions: App. C, Tab. 7).
- **Engines.** One implementation per language, by adoption or else the official reference: Node.js–V8 (JavaScript), MRI/CRuby (Ruby), .NET (C#), OpenJDK (Java), the Zend Engine (PHP), perl5, rustc's regex crate, Go's gc and CPython (§4.1 "Selection Criteria", Tab. 8). The standalone engines RE2 and Hyperscan are left out (§4.1.6).
- **Measurement.** From Davis et al.'s polyglot corpus (about 500K regexes from open-source projects in eight languages), 500 regexes vuln-regex-detector labels exponential candidates and 500 polynomial ones, with attack strings from the same tool, on the old and new versions of Tab. 9, opt-in defenses (JavaScript, C#) switched on (§4.2).
- **CVE study.** NVD records of 2014–2023, found by keyword search and compared with OWASP Top 10 categories (§2.3.2, App. B).

## Approach

- **Literature review (§3).** Inclusion decided from each paper's abstract, introduction and evaluation; included papers coded on the four dimensions of the questions (§3 items (1)–(4); Fig. 4, Tabs. 2–4).
- **Engine review (§4.1).** Per engine: the original algorithm, the ReDoS defense and its year, its size in lines of code, and whether it is on by default, from source code, issue trackers, documentation and maintainers' posts (§4, Tab. 5).
- **Old against new (§4.2).** Each regex and attack string timed on both versions and sorted into the four classes (Fig. 5).
- **Developer discussions (App. E).** GitHub issues mentioning `redos`, filtered and hand-read (Tab. 10).

## Results

- **CVEs.** The authors report that, averaged over 2014–2023, the rate of ReDoS CVEs exceeds that of four OWASP Top 10 categories (§2.3.2, Fig. 3).
- **Threat models.** Only 10 papers (28%) define one explicitly; most analyze regexes in isolation, and "only a few" at the application level (§3.2, Tab. 2). All assume the attacker controls the input, and most that it reaches the regex, a slow or backtracking engine, and unhindered large or repeated requests (§3.2).
- **Definitions.** "No consensus on what constitutes a vulnerability" (§3.3): over half the papers in Tab. 3 (19/29) define ReDoS by slowdown, and the step thresholds §3.3 names range from 10⁵ to 10¹⁰ instructions. In the authors' own experiments, "under one-second slowdowns can be weaponized against a target server, with modest attacker resources" (§3.3).
- **Evaluations.** Only 7 studies (18%) ran an end-to-end attack simulation, and only Bai et al. measured the slowdown benign users see (§3.4).
- **Engines (§4.1, Tab. 5).** V8 added a Thompson-style engine in 2021, linear for the regexes it supports, but "in Node.js, it remains an experimental feature that is not enabled by default" (§4.1.1). Ruby 3.2 added memoization, on by default, with a timeout for regexes it doesn't support (§4.1.2). .NET's timeout and derivative-based engine are both opt-in (§4.1.3). OpenJDK has had an undocumented bounded cache, on by default, since Java 9 (§4.1.4). PHP and Perl use counter-based caps; Python has neither engine optimizations against ReDoS nor a timeout-like mechanism (§4.1.5). Tab. 5 rates Rust and Go Safe, CPython Not Safe and the other six Partial.
- **Old against new (§4.2, Fig. 5).** "For the engines with mitigations, there is a substantial decrease in the number of viable super-linear regexes"; "exponential behavior is resolved in C# and JavaScript but persists in Ruby and Java, while polynomial behavior continues to manifest in JavaScript and Java" (§4.2). Fig. 5 prints no values. The conclusion: the defenses "mitigate most ReDoS payloads, but they still leave significant room for attackers to maneuver" (§6).
- **Practice.** "To the best of our knowledge, there has been no public description of a DoS attack that exploited ReDoS"; maintainers have disputed several ReDoS CVEs (§5 (3)); the sampled comments "often reveal that developers do not perceive ReDoS vulnerabilities as relevant or critical" (App. E).

## Limits the authors state

- The developer-discussion study: "we acknowledge this aspect of our investigation is incomplete and bears further study" (App. E).
- RE2 and Hyperscan are "not included in our analysis" (§4.1.6).
- "Not all regexes were supported in all engines, so the candidate pool size is indicated for each engine" (§4.2).

## Open problems and building blocks

  - "The open challenges in ReDoS research are to evaluate emerging defenses and support engineers in migrating to defended engines" (abstract).
  - Analyses that model "the language-, engine-, and platform-specific details", or deploy code "under realistic conditions" (§5 (1)); studies of "how many regexes are actually reachable via attacker-controlled inputs" (§5 (2)); user studies with developers (§5 (3)).
  - Checking deployed fixes "to find potential bugs or misbehaving corner cases", and "automatic solutions for migrating to updated engines" (§5 (4)).
  - "Standardized definitions and evaluation criteria" (§3.3); "the more general problem of weaponizing slow computation" (§6).
- **Released:** an artifact with "the CVE data analyzed in §2.3.2, the super-linear regex corpus together with the reproduction scripts for the experiments described in §4.2, and the developer-discussion data and GitHub-crawler scripts from Appendix E" (§ "Data Availability").
- **To reuse it:** §4.2 needs vuln-regex-detector, for the regexes and attack strings, and the engine versions of Tab. 9, with opt-in defenses switched on (§4.2, App. D.2).
- **Beyond its domain:** "Many of our findings may also extend to other algorithmic complexity vulnerabilities", and most performance bugs "can probably be lifted to a DoS attack when malicious intent is assumed" (§5 (5)).

## On this site

- **Discussed in:** [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/study">study</a><a class="tag" href="#/tags/survey">survey</a><a class="tag sub" href="#/tags/dsl-regex">dsl-regex</a></span>
