# Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation

**Don't Judge Code by Its Cover** · EACL 2026 Findings (per the arXiv comment) · 2025

Read: [PDF](https://arxiv.org/pdf/2505.16222) · [arXiv](https://arxiv.org/abs/2505.16222)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests whether LLM judges grade code consistently under six injected, semantics-preserving biases: authority, self-declared correctness, reverse-authority and misleading-task comments, variable renaming, and unused dummy functions (§1, §3); the abstract also names formatting, which isn't tested.
- Judge biases measured on equivalent variants (abstract).
- LLM judges of code correctness without a reference, not of equivalence between programs.

## In plain words

LLMs are increasingly asked to judge whether code solves a task from the task description and the code alone, with no reference solution or tests. The authors argue that a reliable judge should not change its verdict when code changes only on the surface, since such changes do not affect correctness (§1). They take human-written solutions to beginner contest problems in five languages, one correct and one wrong per problem, and add six kinds of surface change: a comment saying an expert or a novice wrote it, a comment saying it is correct, wrong comments about what it does, random variable names, and an unused extra function (§3, §4). Six LLM judges label each version correct or incorrect. The authors report that every judge is swayed, towards both inflated and unfairly low scores, GPT-4o's accuracy falling by up to 26.7 percentage points below that on the unchanged code (abstract, §5). Having the judge write test cases first does not remove the shifts (abstract, §6). They call this "the first comprehensive study" of the issue (abstract).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk) · [positional bias](#/glossary/positional-bias) · [reference-free evaluation](#/glossary/reference-free-evaluation) · [length bias](#/glossary/length-bias)

**The paper's own terms:**
- **positive bias / negative bias**: a surface change that pushes the judge towards a "correct" verdict regardless of the ground truth, or towards an "incorrect" one (§1). Positive bias raises accuracy on correct code and lowers it on incorrect code; negative bias does the reverse (§5.3).
- **The six biases** (§3; how each is injected: §4.2, App. C):
  - **authority**: a one-line comment claiming expert authorship, one of 10 templates (Tab. 6), e.g. "This code has been produced by an expert developer and guarantees a correct solution."
  - **self-declared correctness**: the comment "correct code" at the start of the code.
  - **reverse authority**: a comment claiming novice authorship, one of 10 templates (Tab. 6).
  - **misleading task**: two or three LLM-written comments "describing the functionality of the original code inaccurately" (§4.2).
  - **variable change** (also "variable renaming"): variable names and function parameters replaced by random strings (§4.2).
  - **illusory complexity**: "dummy functions", defined but never called, taken from correct submissions to other contest problems (§4.2).
- **Corr. / Incorr.**: accuracy reported separately on the correct and the incorrect code samples (Tab. 2).
- **%p and MAD**: robustness degradation is the percentage-point (%p) difference in accuracy between original and biased code; MAD, mean absolute deviation, is "the average of absolute values of the percentage point deviations from the original accuracy", used to compare groups (§5.2).
- **direct vs test-case-based evaluation**: the judge inspects the code directly, or first generates test cases and judges the code against them (§6.3).

**Builds on:**
- Known biases of LLM judges in other domains: length bias, position bias and sensitivity to expressions of uncertainty (§2.1), and authority cues such as fabricated citations (Chen et al., 2024b; §3).
- Reference-free LLM code judges: ICE-Score, where an LLM scores code on several dimensions, and CodeJudge (Tong and Zhang, 2024), which asks the LLM for "slow thinking" (§2.2); the judging prompt follows CodeJudge and G-Eval with chain of thought (§5.1). Neither is on this site.
- Test-case-based evaluation, CodeT (Chen et al., 2022) and Li and Yuan (2024), which the paper tries as a mitigation (§6.3).
- CodeNet (Puri et al., 2021), the source of the human-written code (§4.1).

## Problem and setting

- **Question:** "Can LLM judges fairly and robustly evaluate semantically equivalent code with superficial variations?" (abstract).
- **Setting:** reference-free; the judge sees the task description and the code, writes a brief reasoning, and gives a final judgment of correct or incorrect (Fig. 5). The study "focuses on reference-free evaluation settings" (Limitations).
- **Data** (§4.1): problems from the AtCoder Beginner Contest only, "to control evaluation variations caused by differences in coding problem difficulty", drawn from CodeNet, in C++, Python, Java, JavaScript and Go. Per language, 200 problems, each with one correct and one incorrect solution chosen at random. Incorrect solutions are "Wrong Answer" submissions; the submitters' comments are removed. 2,000 samples in all.
- **Semantics kept:** all biased code is checked by compilation; for the LLM-written misleading comments, three co-authors also check that the code's function is not impaired, and outputs are regenerated until it is not (App. B).
- **Judges** (§5.1, App. A.3): GPT-4o, GPT-4o-mini, Gemini-2.0-Flash, Claude-3.5-Sonnet (closed API models) and LLaMA-3.1-70B-Instruct and 8B-Instruct (open-weight). Temperature 0.0 (deterministic decoding for LLaMA). Closed-model results are averaged over three trials and open models are run once, as they behave deterministically.
- **Main-experiment settings:** variable names become random 24-character alphabetic strings and illusory complexity adds a single dummy function (§5.1, §6.1).
- Overlap between the judges' training data and CodeNet: not discussed.

## Approach

- Build a matched benchmark: each original sample and its six biased versions differ only in comments, names or unused code (§3–§4). A robust judge should give identical accuracy on the original and biased versions, "assuming the underlying functionality remains unchanged" (§5.3).
- Measure accuracy on correct and incorrect code for each judge, language and bias, and summarise shifts by MAD across models, languages and biases (§5.2–§5.3).
- Follow-up analyses on Gemini-2.0-Flash, chosen as the model with "the most balanced base evaluation performance", focusing on Python (§6):
  - variable-name lengths of 1, 2, 8, 12, 16, 24 and 48 characters (§6.1);
  - 1, 2, 4, 6 and 8 dummy functions (§6.2);
  - a two-phase test-case prompt: the LLM generates at least three test cases (input and expected output) from the task description, then the same LLM judges the code against them, "simulating or reasoning about their execution" (§6.3, App. D, Figs. 6–7).
- Case studies show judges' reasoning before and after each bias (App. F, Tabs. 7–16).

## Results

All are the authors' claims.

- **No judge is robust:** "none of the tested models are resilient to the presence of superficial code biases"; GPT-4o's accuracy drops "by as much as 26.7%p" (§5.3); in Tab. 2 this is Java correct code under the misleading task.
- **Direction by bias** (§5.3, Tab. 2, Tab. 5):
  - self-declared correctness shows "the most pronounced effect across all evaluated models and programming languages" among the positive biases;
  - authority cues "tend to function as positive biases", though authority bias "appears relatively robust";
  - misleading-task comments are negative "in all cases except one", with a MAD of 15.3%p, "strongly impairing evaluative accuracy";
  - reverse-authority comments are negative in nearly all cases, and variable renaming is positive in most;
  - for illusory complexity, "no clear directional pattern is observed".
- **Across languages:** the vulnerabilities appear in all five languages; C++ "exhibits marginally better robustness", and the authors call the differences among languages "minimal" (§5.3).
- **Model scale** (§5.3, Fig. 3): for misleading-task bias, GPT-4o (20.8%p) and LLaMA-3.1-70B (19.1%p) are more vulnerable than GPT-4o-mini (16.1%p) and LLaMA-3.1-8B (11.7%p). The authors conclude that robustness "is largely independent of model scale", that larger models "may, under certain conditions, even be more susceptible", and that only Gemini-2.0-Flash shows "marginally improved robustness".
- **Name length** (§6.1, Fig. 4): one-character names give a negative bias; "from two characters onward, evaluators consistently judge both correct and incorrect code samples more positively than the unbiased baseline", and longer names strengthen the positive bias. The authors suggest judges "may interpret longer variable names as indicative of greater abstraction or sophistication".
- **Dummy functions** (§6.2, Tab. 3): adding more dummy functions lengthens the code and gives a "stronger positive bias", which the authors relate to length bias. With one dummy function there is no clear direction, which they say "may be due to evaluative noise" offsetting the length effect.
- **Test-case prompting** (§6.3, Tab. 4): MAD goes from 5.2 / 8.44 (correct / incorrect code) with the original prompt to 4.21 / 4.09, "a modest reduction in MAD in certain cases"; "vulnerability to bias remains evident across most conditions". It "appears somewhat more resilient against negative biases" with "comparable susceptibility to positive biases", and with one exception the directions stay "largely consistent". Unbiased accuracy falls slightly, from 71.6% to 66.75%, averaged over correct and incorrect code.
- **Case studies** (App. F): under a misleading comment the judge "accepts the misleading information and incorporates it into its reasoning"; under self-correctness and authority comments it "produces logically sound reasoning but nonetheless concludes with an incorrect judgment"; under variable renaming "the reasoning itself becomes flawed".

## Limits the authors state

- The study "does not address language-specific biases", such as "Python-specific formatting practices such as indentation style or whitespace usage" (Limitations).
- Biases such as illusory complexity make the code longer, so "the experimental results may reflect a combined effect of these two factors", code length and the bias itself (Limitations).
- Name-length trend: it "may diverge from human judgment", as people might find long random names harder to read (§6.1).

## Open problems and building blocks

  - "it remains an open question whether—and to what extent—the same forms of superficial bias identified here manifest in reference-based evaluation settings"; "Future work is needed to examine whether the presence of reference code mitigates or exacerbates these biases" (Limitations).
  - "the necessity for further development of more robust, effective, and bias-resistant LLM-based code evaluation methodologies" (§6.3); the abstract likewise names "the need for more robust code evaluation methods".
- **Released:** "we will publicly release the source code, generated datasets, and configuration settings used in our experiments" (App. A.1).
- **To reuse it:** an LLM judge with the chain-of-thought prompt of Fig. 5; the authority and reverse-authority templates (Tab. 6); o4-mini with low reasoning effort and the prompt of Fig. 8 to write misleading comments (App. C); human checking of those comments (App. B); two NVIDIA A100 80GB GPUs for the experiments (App. A.2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
