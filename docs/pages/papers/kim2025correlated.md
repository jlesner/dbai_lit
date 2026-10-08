# Correlated Errors in Large Language Models

**Correlated Errors in Large Language Models** · ICML 2025

Read: [PDF](https://arxiv.org/pdf/2506.07962) · [arXiv](https://arxiv.org/abs/2506.07962)  
Code: [llm_correlated_errors](https://github.com/nikhgarg/llm_correlated_errors_public)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how often different LLMs make the same mistake: the rate at which two models give the same wrong answer when both are wrong, over hundreds of models on MMLU questions with labelled answers from the HuggingFace Open LLM Leaderboard and HELM, plus the correlation of residuals against hand labels on LLM resume ratings (abstract; §1; §3.1).
- A regression on model features: the same provider, the same base architecture and similar size go with more correlated errors, and so does higher accuracy, even across architectures and providers (abstract; §3.2, Tabs. 1–2). Two downstream uses follow: one model's answers used as the labels for grading the others, which the authors call LLM-as-judge (§4, Fig. 2), and simulated hiring markets (§5).
- Coinciding errors limit what voting, routing or a judge from another model can catch: listed [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") starts from it (§2). The authors report that on HELM models agree about 60% of the time when both are wrong (abstract; §3.2), and that a judge inflates the accuracy of models less accurate than itself, "especially" for models of its own provider or family, as its examples show (§1; §4, Fig. 2).

## In plain words

Diversity among LLMs in training data, architecture and provider is assumed to make them less alike, but the authors say "we lack empirical evidence on whether different LLMs differ meaningfully" (abstract). The answer matters for multi-agent systems and for hiring, where firms using one model could all reject the same people (§1). They measure how often two models pick the same wrong answer when both are wrong, for 349 and 71 models on two public leaderboards of multiple-choice questions, and how alike 20 models misjudge resumes against hand labels (§1). On one leaderboard, Stanford's HELM, pairs agree on average about 60% of the time when both are wrong; picking uniformly among the wrong answers would give one in three (§1). Models of the same company or base architecture, or of similar size, share more errors, and so do more accurate models even when those factors are accounted for (§1). Case studies follow on grading models against another model's answers and on simulated hiring (§4–5). The authors present the work as "an empirical foundation" for work assuming different models help (§2).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), in this paper's narrower sense below; other field terms under Missing glossary terms.

**The paper's own terms:**
- **agreement rate when both models are wrong**: for a pair of models, over the questions both get wrong, the fraction on which they pick the same wrong option (§3.1 "Measuring correlated error"). It aims to discount agreement that comes only from both models being accurate (§3.1). Overall agreement and agreement when either is wrong are alternates (App. B–C).
- **random baseline**: the agreement rate if each model picked uniformly among the wrong options; HELM questions have four options, HuggingFace's 3 to 10 (§3.2 and its footnote).
- **correlation in residuals**: on the Resumes data, a residual is a model's rating minus the human rating of a resume-job pair; the measure correlates two models' residuals (§3.1).
- **LLM-as-judge**: here, a judge model's own answers serve as the answer key for grading the other models; **accuracy inflation** is judged minus true accuracy (§4). In the glossary's terms, a special case of LLM-as-a-judge whose verdict is whether an answer matches the judge's.
- **firm preference methods**: how firms rank applicants: Same LLM, Same Company LLM (each firm a random model of one company), Latest LLM (each firm one of the newest models of each company), Random LLMs, and Uniformly Random (random rankings). They span "complete monoculture" to "complete polyculture" (§5).
- **average applicant ranking of match**: the average position of matched applicants' firms in their own preference lists; lower is better (§5.2, Eq. 2).
- **relative match probability**: the match probability of applicants applying to a given number of firms, divided by that of applicants applying to one (§5.2, Eq. 4).

**Missing glossary terms:**
- **algorithmic monoculture**: the situation "when many decision-makers use the same model" (§2).
- **systemic exclusion**: one applicant rejected from all jobs "because they all use the same algorithm" (§2). Its rate here is the fraction of applicants that no firm interviews, when each firm interviews only the top of its ranking, the top quarter in the experiments (§5.1, Eq. 1).
- **stable matching**: used but not defined in the paper (§5.2). In general, a pairing of applicants and firms in which no applicant and firm would both rather be paired with each other than keep their current assignment.

**Builds on** (none on this site):
- Peng & Garg (2024a), "Monoculture in matching markets": §5.2 tests its predictions on firm outcomes ("do firms collectively hire the best-fit applicants"), applicant outcomes and differential access ("some applicants apply to more jobs than do other applicants").
- Bommasani et al. (2022): systemic exclusion (§5) and, with Toups et al. (2023), the component sharing hypothesis (models sharing components have more correlated outputs), which the paper "can be viewed partially as studying … at a large scale" (§2).
- Kleinberg & Raghavan (2021): monoculture in hiring (§2, §5).
- Goel et al. (2025), concurrent: its similarity metric adjusts for accuracy, counts different wrong answers as disagreement and uses answer probabilities; this paper's meets the first two "but does not incorporate model probabilities" (§2).

## Problem and setting

The questions (§1): "How correlated are LLM errors", which model features predict it, "Are newer models more or less homogeneous?", and the downstream effects.

Data (§3.1, App. A):
- **HuggingFace**: answers of 349 models (filtered "for tractability" from 2041) from the Open LLM Leaderboard 2 (mostly open-source models), on 12,032 questions from MMLU (a multiple-choice benchmark across subjects), most with 10 options (App. A.1).
- **HELM**: answers of 71 open and proprietary models from Stanford's Holistic Evaluation of Language Models leaderboard on 14,042 four-option MMLU questions (App. A.1).
- **Resumes**: the authors' own: 60 resumes and 30 job descriptions picked by clustering large job-posting and resume datasets, giving 1,800 pairs scored 1–10 for fit by 20 LLMs from Meta, Mistral AI, Amazon, Anthropic and OpenAI; 450 pairs are hand-labelled "using the same criteria as our prompts" (§3.1, App. A.2; prompts Fig. 7).

Correct means the labelled answer (hand label on Resumes). Sampling settings for the resume ratings: not discussed.

## Approach

- **Pairwise agreement (§3.2, Fig. 1):** heatmaps, models sorted by accuracy.
- **What explains it (§3.2, Tab. 1; App. C, Tabs. 2–9):** a regression with one row per model pair on same company, same architecture (HuggingFace only), each model's accuracy and their product; HuggingFace adds features such as size, generation and parameter-count difference (Tab. 2). On Resumes, accuracy is each model's correlation with the human score (Tab. 8).
- **LLM-as-judge (§4, Fig. 2; App. B.1, Fig. 8):** the judge is the most accurate model of each provider (HELM) or architecture (HuggingFace); accuracy inflation is plotted against true accuracy.
- **Hiring (§5):** most results average 1,500 random markets. §5.1: firms interview their top quarter, sharing one job description; Fig. 3a varies the number of firms, each with a random LLM, from 1 to 20 (its caption counts distinct LLMs); Fig. 3b compares the five methods. §5.2: 60 applicants and 30 firms (or the hand-labelled 30 and 15), each hiring one, applicants' preferences uniformly random (LLM-set in App. B.2), matched by stable matching; outcomes in Figs. 4–5.

## Results

The authors report:
- **Agreement (§3.2, Fig. 1):** mean agreement when both are wrong of 0.423 on HuggingFace and 0.6 on HELM, against baselines of 0.127 and one in three, "about double or higher". All pairs on HuggingFace and 97.5% on HELM are above baseline.
- **Unexpected pairs (§3.2):** Google's text-unicorn@001 and Writer's palmyra-x-v3 agree on 0.9987 of the questions both get wrong (about 22% of all questions); "to our knowledge, there is no publicly stated direct relationship between the models."
- **Sources (§3.2, Tab. 1):** same developer, same base architecture and similar size go with higher agreement, and "more accurate models (and especially if both models are accurate) are more correlated". The features explain "between 34% and 62% of the variation in error agreement across the three datasets". Alternate measures give "similar results" (§6).
- **LLM-as-judge (§4, Fig. 2; Fig. 8):** "each judge systematically inflates the accuracy of models that are less accurate than itself", since a shared wrong answer is marked correct, and under-rates more accurate models; some judges "significantly inflate the accuracy of models from the same provider". They call it important "to calibrate error metrics for each model-judge pair using ground-truth data".
- **Systemic exclusion (§5.1, Fig. 3):** with random preferences the rate goes to 0 as firms are added; with a random LLM per firm, "even with 20 firms, around 20 percent of applicants continue to be systemically excluded". Same Company or Latest LLMs give "somewhat higher" exclusion than Random LLMs, a difference "fairly small" next to one shared LLM.
- **Firm outcomes (§5.2, Fig. 4):** among the LLM-based markets, one shared LLM gives the worst firm welfare ("relatively smaller match probabilities for the highest-ranked applicants"), and the latest LLMs maximize it; "LLM diversity may not yield wisdom-of-crowds effects that outperform choosing the best LLMs."
- **Applicant outcomes (§5.2, Fig. 5a):** one shared LLM gives the best average applicant ranking, worsening towards uniformly random firms: the opposite of the systemic exclusion trend, "as predicted by" Peng & Garg (2024a).
- **Differential access (§5.2, Fig. 5b):** with 30 applications instead of 1, an applicant is "approximately 7 times more likely to match" under uniformly random firm preferences, "approximately just 2 times" when firms use the same LLM.
- **LLM-set applicant preferences (App. B.2, Fig. 10):** "similar patterns hold relatively".

## Limits the authors state

- The human ratings used as "ground truth" are subjective (§3.1); model features are "not consistently available for the Helm and Resume models, which are often proprietary" (§3.1).
- The systemic exclusion rate "does not account for true resume-job fits", capacity limits or applicant preferences, and "some level of systemic exclusion may be acceptable if some resumes are definitely poor fits" (§5.1).
- Current metrics, theirs included, "treat incorrect answers identically", though some wrong answers may be "closer" to correct and some questions may be harder; "Future work should consider developing a metric that is robust to these characteristics" (§6 "Measure of correlation"). Goel et al.'s metric "may be preferable" when answer probabilities are available (same paragraph).
- Multiple-choice and offline numeric scores "provide only a limited view of LLM capabilities"; "Richer evaluation of open-ended generation and complex reasoning tasks remains an important direction for future work" (§6 "Multi-agent performance…").
- No direct measure of "correlations induced by LLMs helping write job descriptions or resumes" (§6); the analysis "is limited to a subset of tasks on which homogeneity may be a concern" (Impact Statement).

## Open problems and building blocks

- **Open:** the authors "encourage leaderboard developers to continuously track model correlation" (§6 "Implications for ecosystem monitoring"); for hiring audits, "empirical analyses of correlations across models or of multiple firms sharing algorithms are relatively unexplored" (same paragraph).
- **Released:** "Our code and data are available" (§1).
- **To reuse it:** per-question answers of many models on labelled questions, which leaderboards hold, "since benchmarks often repeat questions across models" (§6); the analysis grows with the number of questions times the number of model pairs (App. A.1, footnote). Resume ratings: models on Amazon Bedrock and the Anthropic and OpenAI APIs (App. A.2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
