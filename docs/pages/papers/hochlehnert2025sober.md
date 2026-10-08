# A Sober Look at Progress in Language Model Reasoning: Pitfalls and Paths to Reproducibility

**A Sober Look at…** · COLM 2025

Read: [PDF](https://arxiv.org/pdf/2504.07086) · [arXiv](https://arxiv.org/abs/2504.07086)  
Code: [sober-reasoning](https://github.com/bethgelab/sober-reasoning)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how far math-reasoning scores of open 1.5B and 7B reasoning models move with evaluation choices alone: random seed, temperature and top-p, output-token limit, prompt template, hardware and evaluation framework, on AIME'24, AMC'23 and MATH500 (§3.1–3.4).
- Proposes practices (multi-seed means with standard deviations, per-model decoding parameters, long enough output limits, robust answer extraction, released outputs; §4.1), then re-evaluates RL- and SFT-trained models on six math benchmarks in one Docker and LightEval stack, with one-sided paired t-tests and Wilcoxon tests against each model's starting model (§4.2; Tab. 3–4).
- Comparisons of LLM training methods on small checked benchmarks (<a class="tag" href="#/tags/stats">stats</a>): the authors note that one question moves Pass@1 by 2.5–3.3 percentage points on AIME'24 and AMC'23 (§3.2), report that "most early RL-trained variants" of DeepSeek-R1-Distill "showed minimal gains" while some recent ones show promising improvements (§4.3), and that RL gains on AIME'24 do not carry over to AIME'25 while SFT gains do (§4.3; its own Tab. 3 marks none of the base-model RL gains on AIME'24 significant). Filed [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") evaluates with its prompt (App. I there).

## In plain words

Math is "one of the most widely used testbeds" for new reasoning-model methods (§1), and two of its test sets, AIME’24 and AMC’23, have only 30 and 40 problems (§3.2). The authors say reasoning progress "often outpaces methodological rigor", with evaluations that "lack transparency, robustness, or statistical grounding" (abstract). They measure how far the scores of open reasoning models move when only the evaluation changes: the random seed, sampling settings, output-length limit, prompt format, hardware and evaluation software (§3). Across 20 runs of nine 1.5-billion- and 7-billion-parameter models on three benchmarks, they report seed-to-seed standard deviations of 5 to 15 percentage points (§3.2). They then propose reporting practices and re-run many published models in one fixed setup, testing each against the model it was trained from (§4). They find "that most reinforcement learning (RL) approaches yield only modest improvements—far below prior claims—and are prone to overfitting, especially on small-scale benchmarks like AIME’24" (abstract). Supervised fine-tuning shows "consistently stronger generalization in the settings we study" (abstract). They present an empirical reproducibility study, not a new method.

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [reinforcement learning](#/glossary/reinforcement-learning) · [zero-RL training](#/glossary/zero-rl-training) · [Distillation into compact models](#/glossary/distillation) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization)

**The paper's own terms:**
- **Pass@1**: the main metric, the accuracy of one sampled answer per problem, reported as mean ± standard deviation over random seeds (§3.1; Tab. 3 caption).
- **Bootstrapping**: the paper's name for "averaging multiple evaluation runs to stabilize results" (§3.2.1). In our words, averaging over runs, not the glossary's [bootstrap resampling](#/glossary/bootstrap-resampling) of test items.
- **max_new_tokens**: the "number of tokens that models are allowed to generate" (Fig. 8 caption).
- **Prompt formats**: "Math" (a math instruction inside the model's chat template), "Default" (the chat template only) and "No Template" (the bare question) (§3.3; App. B, Tab. 6).
- **Diversity collapse**: the effect reported by Dang et al. (2025) and Yue et al. (2025a) that "improvements in Pass@1 achieved through supervised fine-tuning or RL can reduce Pass@k performance due to diminished output diversity" (§5.2).
- **The \lipsum prompt**: Lorem-ipsum filler text placed before the question, from Shao et al. (2025) (§5.3; App. B, Tab. 7).

**Missing glossary terms:**
- **Paired t-test (one-sided)**: tests whether the mean of paired differences (here, each problem's seed-averaged accuracy under the trained model minus under its starting model) is above zero, assuming roughly normal differences; one-sided means only an improvement counts (§4.2 uses it undefined; general definition).

**Builds on:**
- Calls for statistical rigor, e.g. error bars and multiple runs: Bowyer et al. (2025) ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)")), Biderman et al. (2024), Madaan et al. (2024) (§3.2).
- The published models it re-evaluates and their reported settings (Tab. 1), among them DeepSeek-R1-Distill (DeepSeek-AI, 2025; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)"), cited as its arXiv version), OpenRS (Dang & Ngo, 2025) and s1.1 (Muennighoff et al., 2025; [s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)")) (§3.1, §4.3).
- Earlier studies where simple well-tuned baselines outperform reported progress, in continual learning, active learning and test-time adaptation (§2 "Sobering Studies on ML Progress").
- The effects it re-tests: Wang et al. (2025) on long incorrect answers, Dang et al. (2025) and Yue et al. (2025a) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")) on diversity collapse, Shao et al. (2025) ([Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)")) on spurious prompts (§5).

## Problem and setting

The question: how much do math-reasoning scores depend on evaluation choices rather than on the model, and which reported gains from reinforcement learning (RL) and supervised fine-tuning (SFT) survive a standardized, multi-seed re-evaluation (§1, §3, §4)?

- **Models.** §3: DeepSeek-R1-Distill-1.5B (SFT from Qwen2.5-Math-1.5B, Tab. 1) and five RL-trained models initialized from it (DeepScaleR-1.5B, II-1.5B-Preview, OpenRS1–3); DeepSeek-R1-Distill-7B; S1.1-7B and OpenThinker-7B, Qwen2.5-7B-Instruct fine-tuned on DeepSeek-R1 traces (§3.1). §4 adds RL- and SFT-trained models from 1.5B to 32B, grouped by starting model (Tab. 3–4).
- **Benchmarks.** Math-reasoning test sets (§1): AIME'24 and AMC'23 (30 and 40 problems, §3.2) and the larger MATH500 in §3; §4 adds AIME'25 and the larger Minerva and OlympiadBench (§4.2; App. A).
- **Correctness.** The LightEval evaluation framework's "LaTeX-based answer extraction and evaluation pipeline" decides matches, "similar to math-verify", another answer checker (§4.2).
- **§3 defaults, "unless otherwise stated":** one 40 GB A100 GPU, a fixed Docker image, LightEval with the vLLM inference engine, temperature 0.8, top-p 0.9, a 32,768-token limit, 10 seeds for AIME'24 and AMC'23 and 3 for MATH500 (§3.1).

## Approach

**Sensitivity (§3).** One factor per sweep: 20 seeds per model (§3.2) and the variance of the mean over 1 to 60 averaged runs (§3.2.1); temperature and top-p, each from 0 to 1 (§3.2.2); the output-token limit (§3.3); three prompt formats (§3.3); five compute clusters, then three mitigation stages (the same Docker image on their cluster and on Runpod, "a cloud GPU service"; enforced CUDA determinism on A100 against H100; an updated stack on identical hardware) (§3.4); and two evaluation frameworks, `lighteval` and `evalchemy` (§3.4, Tab. 2).

**Practices (§4.1).** A Docker container runnable on Runpod; for small benchmarks "at least 30 random seeds", with mean and standard deviation; hyperparameters such as temperature and top-p tuned per model, then fixed across tasks; enough context, and for instruction-tuned models the right chat template; "a resilient answer extraction pipeline" rather than exact string matching; released code, prompts and outputs.

**Re-evaluation (§4.2).** Runpod, LightEval 0.8.1, vLLM; ten seeds for AIME'24, AIME'25 and AMC'23, three for the rest; per-model decoding parameters (App. G, Tab. 8). Each trained model is tested against its starting model: each problem's accuracy is averaged over seeds, problems are paired, and one-sided paired t-tests and Wilcoxon tests are run, reported at p < 0.01 and p < 0.001 (§4.2 "Statistical Significance Testing").

**Replication checks (§5).** Response length against correctness (§5.1); change in Pass@k, k up to 128, of DeepScaleR-1.5B and FastCuRL-1.5B against DeepSeek-R1-Distill-Qwen-1.5B (§5.2); the \lipsum prompt on four Qwen2.5-7B models (§5.3).

## Results

All are the authors' claims.

**Sensitivity (§3).**
- **Seeds:** Pass@1 standard deviations "ranging from 5 to 15 percentage points across seeds", "particularly severe for AIME’24 and AMC’23" (§3.2, Fig. 2). On AIME'24 the variance of the mean "reduces sharply for K ≥ 30" averaged runs (§3.2.1, Fig. 3; other benchmarks App. A, Tab. 5).
- **Temperature and top-p:** temperature causes variations "upto 15%" (Fig. 4); higher temperatures give "better peak accuracy but introduce instability" (Fig. 6), while higher top-p generally improves performance with similar variance (Fig. 7); "a consistent tradeoff between reproducibility and high performance" (§3.2.2).
- **Output length and prompts:** reducing max_new_tokens "harms performance—especially on long-form problems" (§3.3, Fig. 8); omitting templates "leads to performance drops, particularly for instruction-tuned models" (§3.3, Fig. 9).
- **Hardware:** across five clusters, performance "varied by up to 8% for OpenRS-1.5B and 6% for DeepSeek-R1-Distill-7B on AIME’24" (§3.4, Fig. 10). Differences persisted through all three mitigation stages, even between consecutive runs on one cluster (§3.4 "Mitigation strategies"); "performance differences of 2-5% persisting even under stringent controls" (§3.4, takeaway box).
- **Frameworks:** "generally small (1–2pp) but can still affect model rankings in tightly clustered scenarios" (§3.4, Tab. 2).

**Re-evaluation (§4.3; Tab. 3, PDF p. 26; Tab. 4, PDF p. 27).**
- **RL on DeepSeek-R1-Distill-1.5B:** OpenRS "reported strong gains (10–15%) on AIME, AMC, and OlympiadBench", but the replication "showed no statistically significant improvements"; "Only DeepscaleR and FastCuRL demonstrated statistically significant improvements across many benchmarks", and recent RL models like Nemotron-RR "deliver the first recipes with robust improvements" (§4.3 "RL-training on R1-Distill"). Takeaway: "Most early RL-trained variants of DeepSeek R1-Distill showed minimal gains".
- **RL on base models** (Qwen2.5 and Qwen2.5-Math): Oat-Zero, LIMR and SimpleRL-Zoo gave significant gains over the base, especially on MATH500, Minerva and OlympiadBench, but "often roughly comparable and sometimes slightly higher than" instruction tuning, and AIME'24 gains "did not carry over to AIME'25" (§4.3 "RL Training on Qwen2.5 Math and Base Models"); "instruction tuning often remains superior (except Open Reasoner Zero)" (takeaway; Open Reasoner Zero: RL from Qwen2.5-7B, Tab. 3).
- **SFT on reasoning traces:** methods like s1.1, Bespoke Stratos, OpenR1 and OpenThinker "consistently outperformed the instruct-tuned baseline across all benchmarks (even Minerva) and generalized comparatively well to AIME’25" (§4.3 "Effectiveness of Supervised Finetuning").
- **32B:** Light-R1 DS, SFT on DeepSeek-R1-Distill-32B, improves significantly; SFT-trained OpenThinker models gain strongly over the instruct model; the RL method DAPO beats its base and Qwen Instruct; INTELLECT-2, RL-trained from QwQ-32B, "shows no meaningful improvement over QwQ-32B" (§4.3 "Scaling to Larger Parameters"). The findings "remain robust to model scale" (takeaway).
- **AIME'24 against AIME'25:** RL-trained models "showed a pronounced performance drop between the two"; SFT models "maintained consistent improvements" (§4.3 "Overfitting and Generalization").

**Replication checks (§5).**
- Longer responses are more often wrong, for RL- and SFT-trained models, and truncation "is not the primary cause" (§5.1, Fig. 11; App. E).
- For both RL-trained models, "We do observe a minor diversity collapse": "Gains in Pass@1 generally come with regression in Pass@k, though the magnitude of the decay varies" (§5.2, Fig. 12); two SFT-trained models show none (App. F, Fig. 25).
- "While we cannot fully reproduce their reported gains, our experiments confirm that Qwen2.5 models exhibit a similar effect" with the \lipsum prompt (§5.3, Fig. 13).

## Limits the authors state

- Standardized runs use 10 seeds for AIME and AMC, not 30, "as a practical compromise between rigor and computational cost" (§4.2).
- The SFT finding holds "in the settings we study" (abstract); the study focuses "specifically on mathematical reasoning" (§1).
- Reproducibility requires "acknowledging the variation inherent to current inference systems" (§3.4, takeaway box).

## Open problems and building blocks

  - "a need to assess out-of-distribution generalization for reasoning models" (§4.3 "Overfitting and Generalization");
  - "broadly reliable RL training recipes are still lacking" (§4.3, takeaway after "RL Training on Qwen2.5…").
- **Released:** "all code, prompts, and model outputs" (abstract), in a Docker container with "step-by-step instructions for running experiments on Runpod" (§4.1); a leaderboard, code and evaluation logs (title page).
- **To reuse it:** a Runpod instance with one A100 PCIe GPU, 8 vCPUs and 128 GB RAM, LightEval 0.8.1 and vLLM (§4.2); at least 30 seeds for small benchmarks (§4.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
