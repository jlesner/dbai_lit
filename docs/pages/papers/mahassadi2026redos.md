# An Empirical Analysis of ReDoS Vulnerabilities and ReDoS Detection Tools

**An Empirical Analysis of…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.10294) · [arXiv](https://arxiv.org/abs/2609.10294)  
Code: [CVE-ReDoS-Analysis](https://github.com/JustinVallee/CVE-ReDoS-Analysis) · [ReDoS-Evaluation-Pipeline](https://github.com/ISMAELYVANN/ReDoS-Evaluation-Pipeline)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An empirical study of ReDoS (regular-expression denial of service) in two parts: CVEs from the NVD that report ReDoS, compared with all other CVEs on severity attributes, evidence of exploitation, exploitability scores, vendors and weakness labels (§4); and five ReDoS detectors (Saferegex, Rescue, ReDoSHunter, Revealer, RAT) and one repair tool (RegexScalpel) run on regexes from RegexLib and from the vulnerable and patched code of ReDoS CVEs in CVEfixes (§3, §5).
- An automated pipeline runs every detector on every regex and compares their verdicts (Tab. 2, Figs. 5–6, §5.2); a "multi-factor metric" calls a regex vulnerable when certain combinations of tools agree, criteria the authors "arrived at … experimentally" after examining a sample by hand (§5.4); RegexScalpel repairs the flagged regexes and the detectors are run again on its output (§3.2, §5.4).

## In plain words

Some regular expressions, used to check the format of user input, can take exponential or large polynomial time on a crafted input when the matching engine tries one way of matching after another; an attacker can use this to stall a service, an attack called ReDoS (§1). The authors say the literature disagrees on which patterns are dangerous, and that the tools developers may rely on "are often not in agreement" (§1). They compare 490 public vulnerability reports about ReDoS from the National Vulnerability Database with all other reports (§4), and run five published ReDoS detectors and one repair tool on over 3,000 real-life regular expressions (§5, §6). They report that 277 of the 286 ReDoS reports published in 2019–2023 appear in their earlier list of vulnerabilities exploited in the wild, adding "If these results bear out" (§4.3); and that 74% of the expressions any detector flags are flagged by one detector only, with all five agreeing on just 5 (§5.2, Fig. 5). The paper presents itself as an empirical study and releases two datasets (§1).

## Background and terms

**Terms to know:** [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking) · [regular expression and regular language](#/glossary/regular-expression-and-regular-language) · [fuzzing](#/glossary/fuzzing) · [true and false positive rates](#/glossary/true-and-false-positive-rates) · [automated program repair](#/glossary/automated-program-repair) · [chi-square test of independence](#/glossary/chi-square-test-of-independence) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test) · [CVE, NVD, CWE, CVSS and EPSS](#/glossary/vulnerability-records-cve-nvd-cwe-cvss-epss) (CWE-1333 names ReDoS, §3.1; CVSS, §4.2, Tab. 1; EPSS, §4.3)

**The paper's own terms:**
- **evil pattern**: a regex pattern that makes ReDoS possible on a backtracking engine; the literature "is not in agreement regarding the exact definition of these patterns", and Li et al.'s five (abbreviated EOD, EOA, POA, NQ and SLQ, not spelled out here) seem "to be the most thorough" (§1, §3.2).
- **static, dynamic and hybrid detectors**: static tools examine a regex for an evil pattern, dynamic tools generate and test inputs, hybrid tools do both (§3.2).
- **timeout (T.O.)**: Rescue's third verdict, "an indication that the regex is likely vulnerable" (§3.2).
- **Regex_before and Regex_after**: all regexes extracted from the vulnerable and the patched versions of the programs behind ReDoS reports in CVEfixes (§3.1 "CVEFixes").
- **HiLac**: high impact (an impact score, the CVSS sub-score for damage, above 7.0) and low attack complexity; earlier work by some of the authors found such vulnerabilities more likely to be exploited (§4.2).
- **exploitation and exploitability**: exploitation is "the determination that a vulnerability has been exploited in the wild"; exploitability, a metric of how likely it is to be exploited eventually (§4.3).
- **multi-factor metric**: a regex is vulnerable if both ReDoSHunter and Revealer flag it; or at least two of "the static or grey box tools: ReScue, RAT, SafeRegex" flag it; or a dynamic tool flags it (or times out) and a static tool flags it (§5.4). A repair is **adequate** when the metric no longer flags it (§5.4, table on PDF p. 14).

**Builds on:**
- Li et al.'s ReDoSHunter (USENIX Security 2021): its evil patterns (§1) and the tool (§3.2).
- Li et al.'s RegexScalpel (USENIX Security 2022), the repair tool evaluated (§2, §3.2).
- CVEfixes (Bhandari et al., 2021), vulnerable and patched code collected from the NVD (§3.1 "CVEFixes").
- The authors' earlier work: a list of vulnerabilities with evidence of exploitation (Khoury et al., 2025; §4.3) and the HiLac finding (Khoury et al., 2020; §4.2).

## Problem and setting

- **Questions:** how ReDoS vulnerabilities differ from others, and how effective and how consistent public ReDoS detectors and one repair tool are (§1; §5.1).
- **CVE data:** the NVD searched "As of September 2025" for CWE-1333 and for keywords such as "catastrophic backtracking" in descriptions: 490 ReDoS CVEs against 215,085 others (§3.1 "ReDoS CVE Dataset"; §4).
- **Regex data:** RegexLib, a public regex library, as cleaned by the RXXR2 project, 2,853 regexes kept (§3.1 "RegexLib"); Regex_before and Regex_after, 379 and 391 entries after removing malformed regexes (§3.1 "CVEFixes"); all sanitized to "ensure compatibility with the evaluation tools" (§5.1).
- **What "vulnerable" means:** each tool's verdict, then the multi-factor metric (§5.4). Only ReDoSHunter "includes a formal definition of the patterns deemed to be vulnerable", so the tools are compared by their verdicts (§5.1). Whether a flagged regex actually stalls a given engine on an attack input: not discussed; the other evidence is hand inspection of samples (§5.3, §5.4). Which regex dialect or engine: not discussed.

## Approach

- **CVE analysis (§4):** yearly counts (Fig. 1); CVSS attributes compared with chi-square tests (Tab. 1) and HiLac shares (§4.2); exploitation checked against the KEV catalogue (Known Exploited Vulnerabilities, kept by the Cybersecurity and Infrastructure Security Agency) and against the authors' earlier list, built from KEV and three industrial partners' data for 2019–2023 (§4.3); exploitability compared through references (links listed in a CVE report: counts, "Exploit" tags, .gov sites) and peak EPSS score and its timing, with Mann-Whitney U tests (§4.3); vendors from the reports' list of affected products (Fig. 2, §4.4) and CWE labels (Fig. 3, §4.5).
- **Tool pipeline (§3.2, §5.1, Fig. 4):** every regex goes through five detectors: Saferegex, static, "developed by Microsoft", using "a process similar to model checking" (exhaustively exploring a system's states); Rescue, dynamic, generating malicious inputs "using a gray-box approach" (with partial knowledge of the regex's structure); ReDoSHunter and Revealer, both hybrid; and RAT, a static analyzer "developed by Parolini et al.". Flagged regexes are repaired with RegexScalpel (one of several suggested repairs picked at random) and re-run through the detectors, with a second repair step for those still flagged (§3.2, §5.1). Pan et al.'s repair tool is excluded because "it cannot handle regexes that contain non-classical features such as backreferences" (references to an earlier group's matched text) (§3.2).
- **The metric's criteria** were found "experimentally after examining different versions and manually examining a sample of regexes" (§5.4).

## Results

- **CVEs (§4.1–4.2, Fig. 1, Tab. 1):** rare until a spike in 2020 that the authors say "seems to coincide" with malicious activity during the Covid confinement, steady since. ReDoS CVEs differ on every CVSS attribute: mostly network attacks needing no privileges or user interaction, with low attack complexity but also low impact. Only 0.43% are HiLac, against 42.33% of others, which "may lead security analysts to de-prioritize ReDoS vulnerabilities—mistakenly" (§4.2).
- **Exploitation (§4.3):** no ReDoS CVE is in KEV, but 277 of the 286 published in 2019–2023 are in the authors' list; "If these results bear out", ReDoS "may be the category of attacks most likely to be exploited". Exploitability signals are "inconclusive": slightly more references (significant, "though very small"), more often an "Exploit" reference, no .gov references; peak EPSS not significantly different, but reached significantly sooner, which the authors read as attackers writing attack code faster. They call the mismatch "a powerful indication of the limitations of these metrics".
- **Vendors and labels (§4.4–4.5):** Ruby programs are "preponderant"; Python is the most overrepresented vendor; CWE-1333 is the most common label, but many ReDoS CVEs carry others.
- **Detector agreement (§5.2, Tab. 2, Figs. 5–6):** "The tools exhibit greater disagreement than agreement"; the bulk of flagged regexes are flagged by Saferegex or ReDoSHunter, which agree little with each other or the rest, indicating "that either existing tools are inadequate, or they exhibit a high rate of false positives"; for ReDoSHunter the authors call this outcome "expected", since it detects patterns no other tool covers, while for Saferegex "it seems likely that many of the vulnerable verdicts are false positives". Rescue times out more often than it returns vulnerable; RAT flags few regexes, some of them flagged by no other tool; Rescue and Revealer tend to agree. The authors report that 15% of RegexLib regexes "are marked as vulnerable by at least one of the tools", and call borrowing regexes from public libraries "imprudent" (§5.2).
- **Case studies (§5.3):** the regex behind CVE-2018-20164 has a "very typical evil pattern" that only ReDoSHunter, Revealer and Rescue flag; some "obviously vulnerable" regexes "were deemed benign by every tool" (in the example, only a Rescue timeout hints otherwise); the regexes all five flag are "rather simple".
- **Repair (§5.4, table on PDF p. 14):** of 537 regexes the metric flags, RegexScalpel suggests a repair for 401, and 364 of those are adequate, with the RegexLib row far above the two CVEfixes rows. Repairs are "not always semantically equivalent to the original regex": bounding a quantifier (an operator such as * that repeats part of a pattern) and adding start and end anchors are common. The authors say this and "the discouraging results" in the table "strongly suggest that developers should not rely exclusively on regex correction tools", and name immune regex engines and time limits on matching as other defences (§5.4).

## Limits the authors state

- Regex_before and Regex_after "are not necessarily the vulnerable regexes that incurred the underlying vulnerability", nor necessarily their patched versions ("though that is surely the case for some regex pairs"), and "contain some duplicates" (§3.1 "CVEFixes").
- "Static analyzers are prone to false positives, while dynamic ones may miss vulnerable regexes" (§3.2); Rescue's timeouts "may also reflect a false positive" (§5.2).
- Only ReDoSHunter defines its patterns formally, "making a theoretical comparison of their capabilities difficult" (§5.1).
- RegexScalpel "does not always produce a corrected regex that is semantically equivalent to the original regex" (§3.2, §5.4).
- "reliable data on exploitation is scarce" (§4.3).
- CVEs with only a version 2.0 or 4.0 CVSS score are left out of the severity comparison, since comparing versions "would have been impractical" (§4.2).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** a dataset of 490 ReDoS CVEs, "useful for research purposes since ReDoS CVEs are often not labeled as such", and RegexLib labelled by the multi-factor metric (§1, contribution 3; §5.2); the CVE dataset on an author's GitHub (§3.1 "CVEFixes", footnote 5); "All the code is available on our Github repository" (§5.1, footnote 8).
- **To reuse it:** the five detectors and RegexScalpel (§3.2); NVD data as of September 2025 (§3.1); the exploitation comparison needs the authors' earlier list, built in part from industrial partners' data (§4.3).

## On this site

- **Discussed in:** [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/study">study</a><a class="tag sub" href="#/tags/dsl-regex">dsl-regex</a></span>
