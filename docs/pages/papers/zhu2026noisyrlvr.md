# Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards

**Noisy Data is Destructive…** · preprint 2026 (v2)

Read: [PDF](https://arxiv.org/pdf/2603.16140) · [arXiv](https://arxiv.org/abs/2603.16140)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-examines claims that RLVR learns almost as well from wrong annotations: the authors re-verify the "incorrect" math training set of [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") with GPT-5 Pro, `math-verify`, a GPT-5 judge and manual checks, and remove the annotations that are in fact correct (abstract; §1; §3.3, Fig. 2).
- GRPO on Qwen2.5-Math-7B with clean, truly incorrect or random annotations and with format-only rewards (§4), five algorithm variants (Dr. GRPO, TIS, PGFC, DAPO, SAPO) at 50% noise (§5), and multi-turn text-to-SQL RLVR of five open models on a 600-item BIRD Train sample, as shipped and as corrected by two authors (§3.3; §6.1).
- Counter-evidence to "RLVR tolerates noisy labels", and a training result on text-to-SQL label noise: the authors report truly incorrect annotations doing no better than format-only rewards and well below clean data (abstract; §4.2), no tested variant compensating (§5), and the uncorrected BIRD items costing 5.7–12.1% accuracy against the corrected ones (§6.2, Fig. 9). Same group as [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)"), which trains on re-verified BIRD.

## In plain words

Reinforcement learning with verifiable rewards trains an LLM by rewarding answers that a program checks against a reference answer, so a wrong reference rewards wrong output. Recent studies suggest that improved algorithms let models learn about as well from wrong references as from right ones. The authors argue these findings are invalid because "the claimed 100% noisy training data is 'contaminated' with clean data" (abstract; §1). They re-check that math set with GPT-5 Pro, a symbolic checker, an LLM judge and manual review, dropping answers that are in fact correct. They report that a 7B math model trained on truly wrong answers scores 8–10% lower than one trained on correct answers across math benchmarks, and that five improved algorithms, trained on half-wrong data, do about as well as the basic algorithm (abstract; §4.2; §5.3). On BIRD, a text-to-SQL benchmark, five open models trained with the basic algorithm on 600 training items as shipped score 5.7–12.1% lower than on the authors' corrected copy (§6.2, Fig. 9). They present the work as an empirical study refuting prior findings (abstract).

## Background and terms

**Terms to know:** [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [pass@k](#/glossary/passk) · [reasoning boundary](#/glossary/reasoning-boundary) · [policy entropy](#/glossary/policy-entropy) · [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **annotation**: the reference a training item carries that the reward checks against, e.g. gold answers or unit tests (§2). Noise in the reward comes from annotation errors or from verifier errors (a flawed checking function) (§3.2).
- **noise models** (§3.2): *model-generated annotations*, wrong answers produced by the base model, the primary synthetic noise; *random annotations*, e.g. a random integer from 1 to 1000 as the answer to an AIME-style problem; *format reward*, a reward of 1 whenever the output contains `\boxed{}` (§4.1), simulating "a collapsed verifier"; *real-world noise*, human annotation errors.
- **truly noisy dataset**: the math training set after the re-verification pipeline removed annotations found to be correct (§3.3, Fig. 2).
- **contaminated**, two senses: a noisy training set that holds correct annotations (abstract; §1), and the usual [data contamination](#/glossary/data-contamination) of test sets: AIME 2025 and AMC 2024 were released after the base model's last weight update, "ensuring a contamination-free evaluation environment" (§4.1).
- **X% noise**: the share of training items with incorrect annotations (§4.2, Fig. 5); §5 trains at 50%.
- **BIRD-600-Original / BIRD-600-Corrected**: 600 random BIRD training items as shipped, and the authors' corrected version (§3.3); Fig. 9 prints them as BIRD-Original-600 and BIRD-Corrected-600.
- **confirmation bias loop**: the authors' explanation for the damage: the model is easily rewarded for reasoning paths it already favours, so it loses the incentive to explore alternatives (§4.2; App. A.1).

**Missing glossary terms:**
- **label noise (annotation noise)**: training labels that are wrong; here, reference answers in RLVR training data that don't answer the question (§1, §3.2).
- **dynamic sampling**: dropping rollout groups in which every sample got the same reward (all right or all wrong), since GRPO gets no gradient from them (§5.1).

**Builds on:**
- Shao et al., Spurious Rewards ([Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)")): the noisy math dataset (wrong answers of Qwen2.5-Math-7B on the DeepScaleR training set) and the training configuration reused here, and the claim re-examined; the authors characterize it as reporting MATH-500 accuracy close to clean-data training with 100% incorrect annotations (§1; §3.3; §4.1).
- Lv et al. (not listed here), who suggest clipped objectives let RLVR learn despite randomly flipped rewards; the authors argue it relies on a stochastic noise model that "misaligns with the practical RLVR that typically uses deterministic, rule-based verifiers" (§2).
- GRPO from DeepSeekMath, Shao et al. ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), the baseline algorithm (§2); the noise-correction methods of Cai et al. and Mansouri et al. and the clipping evidence of Park et al. that §2 discusses (none on this site); §5 tests Cai et al.'s PGFC.
- BIRD, Li et al. ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), and studies of its annotation errors: Wretblad et al. ([Understanding the Effects of…](#/papers/wretblad2024noise "Understanding the Effects of Noise in Text-to-SQL: An Examination of the BIRD-Bench Benchmark (2024)")), Pourreza and Rafiei ([Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)")), Jin et al. ([Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)")), and Arcwise's corrections of the BIRD Mini-Dev set, cited as a spreadsheet (§3.3; §6.1).

## Problem and setting

The question: "To what extent can RLVR, with algorithmic improvements, tolerate annotation noise?" (§1), split into three research questions: does the noise-robustness hypothesis hold on truly noisy data (RQ1, §4); can algorithmic improvements recover the loss (RQ2, §5); does it transfer to real human annotation errors, in text-to-SQL (RQ3, §6) (§3.1).

- **Math (§4.1).** Qwen2.5-Math-7B trained with GRPO (batch 64, group size 16) for three epochs; random-annotation runs stop at two epochs after a collapse in pilot runs. Reward 1 when `math-verify` (Hugging Face's symbolic answer-equivalence checker) matches the answer to the annotation, else 0. Evaluation with [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) on MATH-500, AIME 2024 and 2025, and AMC 2023 and 2024 (high-school competition math). How the clean and mixed-noise sets are built is not described (§3.3).
- **Text-to-SQL (§6.1).** Five open-weight models from 32B to 685B parameters (§6.2): Qwen3-235B-A22B-Instruct-2507, DeepSeek-V3.1, Qwen3-32B, GPT-OSS-120B-A5B and Llama-3.3-70B-Instruct (Fig. 9; Tab. 4). Multi-turn RLVR with iterative query refinement, after SkyRL-SQL (Liu et al., a multi-turn RL method for text-to-SQL), ten epochs, [LoRA](#/glossary/lora-low-rank-adaptation) rank 32 through the Tinker training service (§3.4). Reward: 1 if the generated and gold SQL return matching execution results, −1 if the output lacks solution tags, 0 otherwise. Test set: BIRD's Mini-Dev evaluation set as corrected by Arcwise, whose corrections two authors inspected and found "valid and sound"; greedy decoding. How results are compared (as sets or bags, NULLs) is not discussed.
- Verifier errors, "often fixable engineering issues", are set aside for annotation errors (§3.2).

## Approach

- **Re-verification pipeline (§3.3, Fig. 2).** A pilot check of 20 random "incorrect" examples "identified a high rate of invalid data", from two causes: *insufficient ground-truth annotation* (a problem can have several valid answers, but the reference records only one) and *inadequate equivalence checking* (a weak symbolic checker may miss equal answers in different formats). The pipeline, "targeting at reducing the number of correct annotations": (1) GPT-5 Pro lists all correct answers to each problem, given the problem and its original reference; (2) `math-verify` checks the "incorrect" annotation against that set; (3) a GPT-5 judge evaluates the "incorrect" annotations that passed the symbolic check, asking whether each equals any of the correct answers despite format differences (prompts in App. B); (4) manual inspection of 100 random samples, folding judge errors back into the prompt, for two rounds. Annotations found correct are dropped. The authors argue that a wrong GPT-5 Pro answer can only shrink the dataset, and that zero judge errors in the final 100-sample check bound its error rate statistically.
- **Algorithm variants (§5.1–5.2).** Five, in three groups: gradient-bias mitigation (Dr. GRPO, which removes a length bias in GRPO's loss, App. D.1; truncated importance sampling, TIS; and policy gradient with forward correction, PGFC, which corrects rewards given the noise rates, assuming noise that is independent and identically distributed, §2); dynamic sampling (TIS, DAPO); [clipping](#/glossary/importance-ratio-and-clipping) (DAPO, asymmetric; SAPO, adaptive). Each runs with its original papers' default hyperparameters; PGFC gets the ground-truth noise rates, "measuring the method's upper-bound performance" (§5.2).
- **BIRD correction (§3.3).** For each of 600 random BIRD Train instances, one author proposed a correction and a second verified it independently, repeating until it passed; another author resolved disagreements. They state that "no existing work has curated a clean Text2SQL dataset to serve as a reliable reference for the impact of noise" (§3.3).

## Results

- **Re-verification (§3.3).** The pipeline excluded 16.4% of the original noisy data (GPT-5 Pro flagged 9.0% for insufficient ground truth), leaving 12,769 problems; the judge's true error rate is "upper-bounded at 3% with 95% confidence".
- **RQ1, 100% truly incorrect annotations (§4.2, Fig. 3).** Against clean data, accuracy is 9.0% lower on MATH-500, 10.0% on AIME and 8.5% on AMC, and training on them "fails to outperform the format-reward baseline". Random annotations drop below the base model. The noisy-data model beats the base model in pass@k only at k=1 (Fig. 4; App. A.2); accuracy falls monotonically as the noise share rises, with no "safe" threshold (Fig. 5; App. A.3); responses get shorter than the clean-data model's (Fig. 6). They tie this to higher training reward and lower policy entropy (App. A.1, Fig. 10).
- **RQ2, algorithm variants at 50% noise (§5.3, Fig. 7).** "None of the evaluated algorithms achieved a consistent improvement" over GRPO at 50% noise, and all trail GRPO on clean data by 3.1–7.3%. None reaches a higher pass@k than GRPO at 50% noise (Fig. 8; App. A.5), none consistently gives longer responses (§5.3; App. A.6), and the training curves are "nearly indistinguishable" from noisy GRPO (App. A.4, Fig. 14).
- **RQ3, text-to-SQL (§6.2, Fig. 9).** The correction found and fixed 372 (62%) of the 600 BIRD instances (§3.3). Trained with GRPO, BIRD-600-Original gives 5.7–12.1% lower [execution accuracy](#/glossary/execution-accuracy) than BIRD-600-Corrected across the five models. PGFC "fails to consistently improve over GRPO", does significantly worse than GRPO on GPT-OSS-120B-A5B, and stays behind the clean-data models on all five (Fig. 9).

## Limits the authors state

- "A primary limitation of our study is its focus on outcome-based rewards and deterministic tasks (math and Text2SQL)" (§8); see [outcome and process rewards](#/glossary/outcome-and-process-rewards).
- The re-verification relies on LLMs: "GPT-5 Pro may produce incorrect annotations", which they argue only removes data (§3.3).

## Open problems and building blocks

- **Open:** "Future work could investigate whether this noise sensitivity persists in open-ended domains or when using process-based reward models that verify intermediate steps" (§8). They conclude that RLVR's risk of yielding suboptimal models without high-quality data "has not yet been addressed by existing algorithmic interventions" (§7).
- **Released:** "We have submitted our curated datasets and code in the Supplementary Material" (§3.4); the first contribution offers the truly noisy math set as "a reliable dataset to rigorously investigate the impact of data noise in RLVR" (§1).
- **To reuse it:** re-verification needs GPT-5 Pro, a GPT-5 judge, `math-verify` and manual checks (§3.3). Math runs used SkyRL (an RL training framework) on four A100s, a 64-core CPU and 512 GB RAM; large models were trained through Tinker with LoRA (§3.4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
