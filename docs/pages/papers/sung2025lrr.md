# Repairing Regex Vulnerabilities via Localization-Guided Instructions

**LRR (Localized Regex Repair)** · EACL 2026 (Volume 1: Long Papers)

Read: [PDF](https://arxiv.org/pdf/2510.09037) · [arXiv](https://arxiv.org/abs/2510.09037) · [DOI](https://doi.org/10.18653/v1/2026.eacl-long.379)  
Code: [LRR](https://github.com/cdltlehf/LRR)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Repairs regular expressions vulnerable to ReDoS (crafted inputs that make the regex engine's matching super-linear): a symbolic module localizes the vulnerable sub-pattern, then an LLM, prompted with that sub-pattern and five chain-of-thought repair examples, rewrites the whole regex (abstract; §4; App. B).
- The examples turn the rule-based tool RegexScalpel's heuristics into natural-language reasoning (§5.1); 1,000 ReDoS-vulnerable regexes from the Polyglot corpus, 500 that RegexScalpel makes invulnerable and 500 it doesn't (§5.3); six models of 7–20B parameters and GPT-5, nine settings in all with the reasoning modes, against RegexScalpel and Remedy (§5, Tab. 1); a repair counts when ReDoSHunter finds no vulnerability within one minute and the output is well-formed with nonzero Jaccard similarity on strings sampled from both regexes (§5.2.1, §5.2.3); ablations drop the localization, the examples or both (§6.2, Tab. 2; App. D, Tabs. 3–4).
- The closest listed work to giving a regex a property while keeping its meaning, with compact models, and its meaning check is similarity on sampled strings rather than an equivalence decision: the authors report that LRR with Phi4-14B repairs 59.00% against RegexScalpel's 43.60% (Tab. 1; a rate that doesn't fit the paper's own counts), and call their safety check "empirical, not a formal, provable guarantee of safety" (Limitations). The regex case of [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair).

## In plain words

Regular expressions (regexes) validate and parse input in much software. Some can take far longer than linear time on crafted strings, so an attacker can tie up a server: regular expression denial of service, ReDoS (§1). The authors say rule-based repair tools are precise but fail on unseen or complex patterns, while LLMs generalize but are unreliable where syntax and meaning must be kept (abstract). Their framework, LRR (localized regex repair), first has a deterministic module find the vulnerable part of the regex, then prompts an LLM with that part and five worked repair examples to rewrite the regex (§4, §5.1). A repair counts when a vulnerability detector finds no attack within one minute and the new regex, well-formed, still matches some of the same sampled strings (§5.2.1). On 1,000 vulnerable regexes, the best setting, the 14-billion-parameter Phi4, repairs 59.00% against 43.60% for the rule-based tool RegexScalpel (Tab. 1), which the abstract calls "improving the repair rate by 15.4%p over the state-of-the-art" (percentage points). They present a hybrid that improves on existing tools, not a first.

## Background and terms

**Terms to know:** [automated program repair](#/glossary/automated-program-repair) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) (regexes are one) · [program equivalence](#/glossary/program-equivalence) · [Levenshtein distance](#/glossary/levenshtein-distance) · [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking) (§1, §3) · [Jaccard similarity](#/glossary/jaccard-similarity) (here between two regexes' languages, from 100 strings drawn from each with the `xeger` package, duplicates allowed, scored as TP/(TP+FP+FN) over the union of both samples, §5.2.3).

**The paper's own terms:**
- **Sub-pattern** and **localization**: the part of the regex that causes the vulnerability, found by an analyzer built on existing rule-based repair heuristics as matching a known ReDoS pattern (§4); §6 describes LRR as incorporating "both RegexScalpel and LLM variants".
- **The four vulnerability types** of RegexScalpel's heuristics: nested quantifiers (a repeated group that itself repeats; the prompt's example turns `(?:a+)+` into `a+`, App. B), quantified overlapping disjunction (QOD) (a repeated choice whose options can match the same text), quantified overlapping adjacent (two neighbouring repeats that can match the same text), and starting with large quantifier (a regex that opens with a repeat) (§5.1; the glosses are general definitions).
- **Repair rate**: the share of the vulnerable regexes repaired; an ill-formed output or one with zero Jaccard similarity to the original counts as a failure (§5.2.1).
- **Well-formed (W.F.)**: the share of outputs that compile (Tab. 1 caption).
- **RLI** (relative length increase): how much longer the repaired regex is, as a share of the original's length; close to zero means the length is kept (§5.2.2).
- **NLS** (normalized Levenshtein similarity): one minus the edit distance divided by the longer regex's length; 1 means unchanged text (§5.2.2).
- **Precision, recall** (§5.2.3): over the sampled strings, a string is positive if the original regex matches it. High precision, which the paper calls "soundness", means strings the repaired regex matches are likely matched by the original; high recall ("completeness") the reverse. Not the glossary's soundness of a checker.
- **NR**: non-reasoning mode; in Tab. 1 the top four LRR rows are non-reasoning models, the bottom five reasoning ones (§6).
- **Negative look-ahead** `(?!...)`: asserts that what follows the current position does not match the pattern inside (App. C.1).

**Missing glossary terms:** none.

**Builds on:**
- RegexScalpel (Li et al., 2022), a rule-based tool that repairs "only the vulnerable spans of a given regex" (§2.4): the primary baseline and the model for the prompts' reasoning (§5.1, §6.1).
- Remedy (Chida and Terauchi, 2022), a repair tool that supports extended features such as look-aheads and back-references (references to text an earlier group matched), the secondary baseline (§2.4, §6.1).
- ReDoSHunter (Li et al., 2021), a detector that generates attack strings from vulnerability signatures (§2.3), used as the judge of invulnerability (§5.2.1).
- The Polyglot corpus (regexes collected from software in many programming languages) of Davis et al. (2019), [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)"), as the source of the regexes (§5.3).

## Problem and setting

- **The question:** given a ReDoS-vulnerable regex, produce a repaired regex that is "ReDoS-invulnerable" and "semantically and syntactically similar" to it (§3, Problem); §3's prose states the objective as a regex "safe from ReDoS attacks and semantically equivalent". The authors' hypothesis: a naive LLM approach is "ineffective for this task due to its difficulty in understanding the complex and subtle causes of a vulnerability" (§3).
- **Invulnerable** means ReDoSHunter "cannot identify a vulnerability within our one-minute timeout threshold" (§5.2.1).
- **Meaning** is measured by Jaccard, precision and recall on sampled strings with Python's `re` module; RegexScalpel was evaluated with a Java matcher, which the authors say "only has minor difference" (§5.2.3). Ill-formed outputs score zero, with no RLI (§5.2.2–5.2.3).
- **Data:** regexes from the Polyglot corpus that ReDoSHunter finds vulnerable, of length less than 1,024 "to meet our context size requirements"; 1,000 of them, 500 that RegexScalpel turns into invulnerable patterns and 500 where it times out within one minute or its output stays vulnerable (§5.3).
- **Models:** Qwen3-8B (with and without reasoning), Llama3.1-8B, Gemma3-12B, Phi4-14B, DeepSeek-R1-Distill-Qwen-7B, GPT-oss-20B in two settings marked "low" and "med." in Tab. 1, and GPT-5 (§5, Tab. 1). Decoding settings and the number of samples per regex: not discussed.

## Approach

- **Localize, then prompt** (§4, Fig. 2): the symbolic module marks the vulnerable sub-patterns; the prompt names them ("At least one of these subpattern causes catastrophic backtracking") and asks for "the repaired version of the entire pattern, not only a repaired subpattern" (App. B, LRR prompt).
- **Five chain-of-thought examples** (§4, §5.1): each gives a vulnerable regex, reasoning on how the sub-pattern causes the vulnerability and how rule-based methods modify it, and the repaired regex. The authors turned RegexScalpel's heuristics into this reasoning; one example combines three of the four rule types in a multi-step repair (all but QOD), and four more each apply one rule type in isolation (§5.1).
- **The aim:** that the LLM also uses the heuristics "to identify vulnerable sub-patterns missed by existing heuristics or to apply repair independently of the heuristic for the given sub-pattern" (§4).
- **Ablations** remove the localization, the examples, or both, leaving the basic prompt (§6.2, App. B).

## Results

- **Baselines** (§6.1, Tab. 1): RegexScalpel's output is always well-formed, but it repairs 43.60% and often roughly doubles the regex's length. Remedy's well-formed ratio is 46.10%, which the authors attribute to incomplete support for symbols such as `\d` and `\w` (App. C.2).
- **LRR** (§6.1, Tab. 1): averaged over the nine settings, it raises the repair rate from 43.60% to 49.90%; Phi4 gives the best, 59.00%, a 15.40-point gain. GPT-5 has the highest Jaccard and recall in Tab. 1, and RegexScalpel the highest precision.
- **Reasoning trade-off** (§6.1): non-reasoning Phi4 repairs more than reasoning Qwen3 (59.00% against 51.00%) but lengthens the regex more (RLI 100.43% against 68.79%); the authors write that "This empirically proves that vulnerability repair often requires an input regex to be much longer".
- **Ablation** (§6.2, Tab. 2): for Phi4, dropping the five examples hurts most (59.00% → 49.70%); for Qwen3, dropping localization hurts most (51.00% → 46.60%). The authors conclude that "Localization tells the model what to fix, which is especially crucial for reasoning models, while the 5-shot CoT prompting teaches the models how to fix" and say the full tables confirm this across models (App. D, Tabs. 3–4).
- **Syntactic similarity** (§6.3, Fig. 3: successful repairs only, and for LRR only those RegexScalpel does not already repair): RegexScalpel and Phi4 have higher RLI than Qwen3; the authors say the reasoning model tends "to apply the simplest strategy with the minimal modifications first", while non-reasoning models "often apply all applicable rules at once" (§6.3; examples in App. E).
- **Semantic similarity** (§6.4, Fig. 4): among successful repairs, Phi4's Jaccard scores are less concentrated at 1.0 than Qwen3's; the authors say this suggests the reasoning model is "more capable of maintaining semantic correctness".
- **Case study** (§6.5): repairs that use the regex's purpose, e.g. reading `@@ … @@` as a git diff header and bounding its line counts to "a more plausible range".
- **Baseline failures** (App. C.1): of RegexScalpel's 500 invulnerable outputs, 39 have zero Jaccard with the original; one adds a negative look-ahead that leaves a regex matching no string.

## Limits the authors state

- The localization module "relies on established heuristics derived from existing rule-based repair methods", potentially limiting its ability to localize vulnerability patterns outside "these known anti-patterns"; then "the LLM is forced to analyze the entire, unconstrained regex, which negates the core efficiency benefit of the localize-and-fix strategy" (Limitations).
- "the validation of our repair success is empirical, not a formal, provable guarantee of safety": invulnerability is ReDoSHunter's failure to find an attack string within one minute; and since ReDoS is "often context-dependent, varying across different execution environments and regex engines, there is no single, universally consistent standard for definitive invulnerability", so the repair rate "is best viewed as robust evidence of practical safety relative to the fidelity of the specific detection mechanism employed" (Limitations).
- RegexScalpel's invulnerable group "does not guarantee a successful repair since it includes cases with zero Jaccard similarity" (§5.3).
- LRR "exhibits a slightly reduced precision, by aiming to eliminate a greater number of vulnerabilities" (§6.4); and Phi4's higher repair rate over Qwen3 comes with longer regexes, a "clear trade-off" (§6.1).

## Open problems and building blocks

- **Open:** None stated as open problems; the conclusion closes on "a promising path for developing more adaptable and scalable solutions by combining precise analytical tools with powerful generative models" (§7).
- **Released:** the code (abstract).
- **To reuse it:** a localization analyzer built on rule-based ReDoS heuristics (§4; RegexScalpel's, §6); ReDoSHunter with a one-minute timeout as the judge (§5.2.1); the `xeger` package and Python's `re` for the semantic scores (§5.2.3); regexes of length under 1,024 for the context size (§5.3). Inference ran on one NVIDIA RTX A6000 GPU (App. A).
- **Beyond its domain:** the abstract says the work "provides a validated methodology for solving such problems in automated repair" (abstract).

## On this site

- **Discussed in:** [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
