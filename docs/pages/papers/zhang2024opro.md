# Revisiting OPRO: The Limitations of Small-Scale LLMs as Optimizers

**Revisiting OPRO** · Findings of ACL 2024

Read: [PDF](https://arxiv.org/pdf/2405.10276) · [arXiv](https://arxiv.org/abs/2405.10276) · [DOI](https://doi.org/10.18653/v1/2024.findings-acl.100)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reruns OPRO with small LLMs (the LLaMA-2 family, Mistral 7B) as the optimizer (abstract).
- Compares OPRO-found instructions with Zero-shot-CoT and Few-shot-CoT baselines (§3.1).

## In plain words

OPRO is a prompt optimizer: one LLM proposes instructions, another scores them on training questions, and the best one wins. The authors ask whether this still works when the LLMs are small, since OPRO was mostly tested on large models (§2). They re-evaluate OPRO on grade-school math word problems with three Llama-2 models and Mistral 7B, the same model proposing and scoring, and with Gemini-Pro as the large model (§3). They report that "OPRO shows limited effectiveness in small-scale LLMs" (abstract): for Mistral 7B and the 13B and 70B Llama-2 models, the instruction OPRO found scored below plain "Let's think step by step" and below two worked examples, while with Gemini-Pro it beat both (§3.2).

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt).

**The paper's own terms:**
- **OPRO** (Optimization by PROmpting): the method of [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") (abstract).
- **optimizer and scorer**: the LLM that writes candidate instructions, and the LLM whose accuracy with each one on sampled training questions is its score. In the main experiment both are the same model, as "two independent LLMs" (§3.1).
- **instruction words**: the instruction OPRO searches for, placed at the beginning of the model's answer (§3; Tab. 1).
- **meta-instruction**: the hand-written task description inside the meta-prompt (§4 "Human-Crafted Elements…"; App. C).
- **self-optimization**: an LLM improving prompts for itself, as both optimizer and scorer (§1, §4).
- **small-scale and large-scale**: small means LLaMa-2-7b, -13b, -70b and Mistral 7B; large means Gemini-Pro (abstract; §3.1).
- **Zero-shot-CoT and Few-shot-CoT**: the baselines: "Let's think step by step" before each answer, or two random training problems with worked solutions before the test question (App. A.2) plus that phrase (Tab. 1).

**Missing glossary terms:** none.

**Builds on:**
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), reproduced from its paper and code (§3.1, App. B).
- Zero-shot-CoT (Kojima et al., 2022) and Few-shot-CoT (Wei et al., 2022), the baselines (§3.1); not listed.
- EvoPrompt ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), another LLM-as-optimizer method, named with OPRO as motivation (§2).
- Zhou et al. (2023), cited as finding that manual prompting typically surpasses automated approaches (§4); not listed.

## Problem and setting

- **Question:** "Can small-scale LLMs also serve as optimizers?" (§2).
- **Motivating test** (§2, Fig. 1): LLaMa-2-13B, prompted like OPRO's linear-regression example, must propose better parameters for a line fit to 50 noisy points. The authors call the result negative: the model answers that gradient descent is not working.
- **Benchmark:** GSM8K, grade-school math word problems: 7,373 training, 1,319 test (§3.1), scored by test accuracy (Tab. 1).
- **Models:** Meta's open Llama-2 models (chat versions, App. A.1), Mistral 7B (an open 7-billion-parameter model) "to test the generalizability", and Gemini-Pro (Google's, through its API) as the large model (§3.1, App. A.1).

## Approach

OPRO runs (App. A.2): 100 iterations; each samples 3.5% of the GSM8K training set for the scorer, asks the optimizer for eight new instructions, and adds them with their scores to the history; the meta-prompt holds the top 20 instructions and three random training problems.

Two extra probes (§4):
- **Swapping the scorer:** LLaMa-2-13b optimizer, Gemini-Pro scorer (Fig. 2b against 2c).
- **Changing the meta-instruction:** four meta-instruction texts with LLaMa-2-13b (Tab. 2). Text 4 follows OPRO's design; the authors had ChatGPT write the other three from it, "To prevent human invention on the prompt design" (App. C, Tab. 4).

## Results

- **Main comparison** (Tab. 1, GSM8K test accuracy): OPRO against the better CoT baseline: 32.13% against 38.13% (Mistral 7B), 31.24% against 37.15% (LLaMa-2-13b) and 27.98% against 48.67% (LLaMa-2-70b); with Gemini-Pro, 76.92% against 71.29%; with LLaMa-2-7b, 29.81% against 24.87%. The authors report that for Mistral 7B, LLaMa-2-13B and LLaMa-2-70B OPRO falls short of both baselines and Few-shot-CoT is highest, "suggesting that for small-scale LLMs, direct instructions providing clear guidance on both the objectives and methodologies are most effective" (§3.2).
- **Scorer swap** (§4, Fig. 2): a Gemini-Pro scorer with the LLaMa-2-13b optimizer "yields a 5% accuracy increase", which the authors read as LLaMa-2-13b being inadequate as a scorer. They also write that "upgrading the scorer model only minimally affects performance", implying the optimizer may not fully use a better scorer.
- **Meta-instruction sensitivity** (§4, Tab. 2): accuracy ranges from 10.39% (Text 2) to 31.24% (Text 4). The authors conclude OPRO "remains reliant on human-crafted meta-instructions" (§4).
- **Cost** (§4 "Analysis of System Efficiency", Tab. 3): with Gemini Pro, until the best instruction was reached, OPRO took about 96,289 input and 170,448 output tokens (counted as words) and 21 hours, against 4 and 5 hours for the two baselines. They judge that this cost "may not align with the marginal performance enhancements it offers" (§4).

## Limits the authors state

- "Our study's scope was limited by computational resources, excluding other self-optimization strategies like EvoPrompt and APO due to their extensive prompt generation time." (§5). APO is Pryzant et al. (2023), [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") (§1).

## Open problems and building blocks

- **Open:** they suggest that future automatic prompt engineering consider "both model capabilities and system efficiencies" (§5), and recommend "direct instructions that clearly outline objectives and methodologies as robust prompt baselines" for small-scale LLMs (abstract). Their own future work: "enhancing the interpretability and depth of error analysis, alternative optimization metrics, bias considerations, or hyperparameter tuning impacts" (§5).
- **Released:** nothing stated; the paper reuses OPRO's open-source code (App. B).
- **To reuse it:** two NVIDIA A100 GPUs for the local Llama-2 models, and the Gemini API (App. A.1); settings in App. A.2.

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
