# Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions

**Why Aren't Regular Expressions…** · ESEC/FSE 2019

Read: [PDF](https://arxiv.org/pdf/2105.04397) · [arXiv](https://arxiv.org/abs/2105.04397) · [DOI](https://doi.org/10.1145/3338906.3338909)  
Code: [LinguaFranca-FSE19](https://github.com/SBULeeLab/LinguaFranca-FSE19)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A developer survey on regex re-use (§4), a corpus of regexes extracted from the module registries of eight programming languages (§5, Tab. 1), and measurements of how often the same regex is re-used (§6) and behaves differently across those languages' regex engines (§7).
- Each regex is matched on inputs from an ensemble of five regex input generators in each of the eight engines whose syntax accepts it, with default flags and partial matching; disagreements ("difference witnesses") are split into match, substring and capture types and sorted by cause (§7.1, Tabs. 3–4). Worst-case performance is tested with super-linear regex detectors, each predicted slow input run in every language (§7.2.1).
- Corpus-scale evidence that engines of one DSL family disagree silently on programs that compile in each: the authors report that 15% of regexes behave differently in at least one pair of languages (abstract; 15.4%, Tab. 3), under default flags and the generators' inputs (§7.1.1).

## In plain words

Programmers often copy a regular expression (regex: a short pattern describing a set of strings) from Stack Overflow or another project, sometimes across programming languages. The authors ask whether a regex that compiles in two languages matches the same strings, and is as fast in the worst case, in both: a different match can cause logic errors, a slower one a security vulnerability (abstract, §1). They surveyed 158 professional developers and built a corpus of 537,806 regexes from 193,524 projects in eight languages (abstract). In the survey, 94% of respondents say they re-use regexes, and 47% treat regexes as the same in every language (§4). Running the corpus in every language's engine on generated inputs, with default matching options in the semantic test (§7.1.1, §7.2.1), they report that "though most regexes compile across language boundaries, 15% exhibit semantic differences across languages and 10% exhibit performance differences across languages" (abstract). Bugs they reported have so far been confirmed in JavaScript's V8, Python, Ruby and Rust (§7.1.4). They claim not to be first to observe this, but "the first to provide evidence of the extent and impact of the phenomenon" (§1).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [fuzzing](#/glossary/fuzzing) · [finite-state machine](#/glossary/finite-state-machine) (its finite automaton, which most regex engines simulate, §2.2) · [regular expression and regular language](#/glossary/regular-expression-and-regular-language) (no standard syntax or semantics across languages, §2.1; tested under partial-match semantics, §7.1.1, §7.2.1) · [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking) (super-linear regexes, §2.2, §7.2).

**The paper's own terms:**
- **lingua franca**: a common language; here, the belief that a regex means the same in every programming language (§2.1; RQ3, §3).
- **module**: a package in a language's primary registry, e.g. npm for JavaScript or CPAN for Perl (§5, Tab. 1).
- **re-use**: "any pair of identical regexes (string equality)" of at least 15 characters in different modules (§6): an intra-language duplicate in the same registry, an inter-language one in another (§6.1.1), an Internet duplicate in RegExLib (a public regex library site) or on Stack Overflow (§6.2.1).
- **difference witness**: a (regex, input) pair that behaves differently in two languages, of three disjoint types: a match witness (they disagree on whether there is a match), a substring witness (they agree there is one but not on the matched substring), and a capture witness (they agree on both but split the substring differently into capture groups, the parenthesized parts a program can read back) (§7.1.1).
- **super-linear (SL) regex**: one whose match may take more than linear time in the length of the regex and the input, polynomial or exponential in the worst case (§2.2); in the experiments, a match that took more than 10 seconds in some language on a detector's proposed input (§7.2.1).
- **ReDoS (Regular expression Denial of Service)**: the security problem the paper ties to SL regexes, which it calls "potential ReDoS vectors" (§2.2, §8).
- **Spencer engines and Thompson's algorithm**: backtracking matching, "analogous to a depth-first traversal" of the regex's NFA (nondeterministic finite automaton), against Thompson's algorithm, "similar to a breadth-first traversal", linear-time but with fewer regex features (§7.2.3).

**Missing glossary terms:** none.

**Builds on:**
- Davis et al. [26] (ReDoS in practice, in JavaScript and Python modules, §7.2.2): the regex extraction method (§5) and the SL detection method and tools (§7.2.1).
- Chapman and Stolee [20], on regex use in Python; their survey of developers at one company is "the only previous qualitative perspective" on how developers approach regexes (§2.3).
- Cox [24], who suggested that languages fall into two performance classes (§2.2; §7.2.3).
- The regex input generators Rex, MutRex, EGRET, ReScue and Brics (§7.1.1), and an ensemble of SL regex detectors plus Shen et al.'s dynamic detector [87], ReScue again (§7.2.1).

None is on this site.

## Problem and setting

- **Questions** (§3): seven, in three themes: developers' re-use and beliefs (RQ1–RQ3, survey), measured re-use from software and the Internet (RQ4–RQ5), and semantic and performance portability (RQ6–RQ7).
- **Survey** (§4.1): 33 questions, spread through the authors' contacts and on Hacker News and Reddit, with a filter for invalid answers.
- **Corpus** (§5, Tab. 1): JavaScript, Java, PHP, Python, Ruby, Go, Perl and Rust; the top 25,000 modules by GitHub stars per registry, all modules for Perl and Rust; only statically declared regexes, from source files in the registry's language.
- **Engines** (Tab. 2): one version per language. A comparison of two languages uses the regexes valid in both (§7).
- **Semantic test** (§7.1.1): up to 10,000 inputs requested per generator within 10 seconds; default flags only, since with "around 20 distinct regex flags" evaluating a meaningful subset of the flag combinations "was infeasible" (footnote 5); partial matching. Here the authors "assumed that the regex engines were trustworthy" (§7.1.4).
- **Performance test** (§7.2.1): detectors get up to 60 seconds and 2 GB per regex; each predicted worst-case input is run in all eight languages.

## Approach

- **Re-use** (§6): exact matches as defined above, across modules and registries (§6.1.1) and against a RegExLib dump and Stack Overflow posts tagged "regex" (§6.2.1).
- **Semantic portability** (§7.1): a tester per language runs each regex on the generators' inputs, two generators modified (§7.1.1). The authors' Cross Examiner classifies witnesses by cause, with heuristics encoded while examining unclassified witnesses against the disagreeing languages' documentation (§7.1.3).
- **Performance portability** (§7.2.1): following [26], plus Shen et al.'s detector. The detectors are also queried with an anchored (pinned to the input's start and end) full-match variant of each unanchored regex and a variant with bounded repetitions made unbounded, since the static detectors assume full-match semantics and handle large NFAs badly; every predicted input is tested on the original regex.

## Results

- **Survey** (§4.2): 94% of respondents say they re-use regexes, most often from Stack Overflow and often from other code (Fig. 2); 47% "treat regexes like a lingua franca" (§4, findings box), with a design process that is not language-specific (Fig. 3).
- **Re-use** (§6.1.2, §6.2.2, Fig. 4): re-use in every language, within and across languages; Internet regexes are most common in JavaScript.
- **Semantic differences** (§7.1.2, Tab. 3): 15.4% of regexes have a difference witness in some pair of languages: 8.1% match, 4.2% substring and 7.5% capture witnesses.
- **Causes** (§7.1.3, Tab. 4): "Approximately 98% (80,736/82,582) of witnesses could be explained by one or more of these causes". Many of Tab. 4's unusual behaviours are unspecified in that language's documentation (grey cells): "Testing, not reading the manual, is the only way for developers to learn these behaviors." The contributions list says most of these problems "could not be explained using existing regex documentation" (§1).
- **Engine bugs** (§7.1.4, Tab. 4): cases where one language disagreed with the others and with its own documentation led to bug reports, confirmed in V8-JavaScript, Python, Ruby and Rust.
- **Performance differences** (§7.2.2–7.2.3, Figs. 6–7): 10% of regexes "exhibit performance differences due to regex engine algorithms and optimizations" (§7, findings box). SL regexes "may be more common — by up to an order of magnitude! — than was previously reported" in [26]; most of the newly found ones came from the variant queries (§7.2.2). Engines appear to form three families, Slow (JavaScript, Java, Python, Ruby), Medium (PHP, Perl) and Fast (Go, Rust); worst-case performance "generally worsens when moved between these families, but not within them" (§7.2.3). Go and Rust mainly use Thompson's algorithm; PHP and Perl stop matches that exceed a work counter and prune starting offsets, and Perl caches visited states: "to the best of our knowledge, this is the first description of these real-world regex engine mechanisms in the scientific literature" (§7.2.3).
- **Bugs in modules** (§8): linter-style tools flag regexes using a feature their language lacks as potential bugs (Tab. 4), with bug reports begun; responsible disclosure begun for potential ReDoS regexes.

## Limits the authors state

- "Our survey instrument has not been validated", and they assume the respondents who passed their filter "replied in good faith" (§10).
- The performance results "assume that the SL regex detector ensemble is effective"; the detectors were designed for Slow-family engines and "might miss SL regexes in the Medium and Fast families", and "it is not clear whether the defenses of PHP and Perl are sound or simply effective against these detectors' inputs" (§10).
- The corpus "is composed only of statically-declared regexes"; to generalize, they assume most regexes are static or dynamic ones similar (§10).
- Regexes come only from modules, so "our results may not generalize to applications" (§10).
- Exact matching of regexes of at least 15 characters may miss shorter re-used regexes, count longer independently written ones, and miss re-use with modifications; wholesale file duplication, unaccounted for, "would only affect our intra-language regex re-use results" (§10). The definition is "a first approximation" without string or behavioural similarity (§6).
- Only default flags were tested (footnote 5); the semantic experiment assumed the engines trustworthy (§7.1.4).
- Survey: "Due to space limits we do not report all results." (§4.1, footnote 1).

## Open problems and building blocks

- **Open** (all §9 unless marked):
  - Language designers could agree on "a universal regex specification".
  - Documentation should describe deviations from external specifications such as PCRE or POSIX, and worst-case performance.
  - Slow-family languages should adopt Medium-family techniques; they suggest most ReDoS vulnerabilities "can be solved at the regex engine level" by extending Perl's and PHP's optimizations, with care "to avoid changing regex semantics".
  - A regex "universal translator" to port regexes between languages, complicated by incomplete specifications, feature support and performance variations; van der Merwe et al.'s regex transformations that preserve semantics but change performance seem to them a promising starting point; "an opportunity for tools for regex migration" (§11).
  - "Testing regex engines by refining regex semantics and applying model-checking techniques" (exhaustively checking a model of the engine against a specification).
  - Corpus uses: semantic code search for regexes; whether regex needs differ by language.
  - Other "lingua franca problems", e.g. "SQL dialects, Markdown specifications, software compilers, and browser JavaScript support" (§9 "Other Lingua Francas").
- **Released:** "We have released our many-language tools" (§9); an artifact "containing our survey instrument, regex corpus, and analyses" (§ "Reproducibility").
- **To reuse it:** a tester per language at Tab. 2's versions, the five input generators (§7.1.1) and the detector ensemble (§7.2.1); the experiments ran on "a 10-node cluster of server-class nodes" (§7).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair) · [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
