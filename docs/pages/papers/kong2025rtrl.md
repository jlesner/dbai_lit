# Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs

**RTRL (Round-Trip Reinforcement Learning)** · COLM 2026

Read: [PDF](https://arxiv.org/pdf/2510.01527) · [arXiv](https://arxiv.org/abs/2510.01527)  
Code: [RTRL](https://github.com/LechengKong/RTRL)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains a chemical LLM for round-trip consistency on paired tasks (molecule ↔ caption, reactants ↔ product): the model's output for an input is rewarded by how likely a frozen copy of the model finds the original input when mapping back, so the training data can be unlabelled inputs from one side only (abstract; §4, §4.1).
- GRPO on the backward copy's length-normalized log-likelihood of the input plus a binary format reward (e.g. RDKit parsing) weighted by minus the lowest log-likelihood seen over preliminary training steps, which the authors say guarantees that an invalid output never outscores a valid one (§4.1, Eq. 9); an iterative variant swaps the forward and backward roles each round on unpaired data (§4.2, Eq. 10). Applied to the chemical LLMs ChemDFM and LlaSMol on CHEBI-20, LM-24, USPTO-Mixed and USPTO-50K in self-supervised, supervised and synthetic settings (§6).
- A label-free round-trip reward that is a model's likelihood, not a check: the authors report that the likelihood reward alone admits a shortcut, the forward model echoing its input, observed mainly in retrosynthesis, where exact match is 0.157 without the format reward against 0.323 with it (App. H, Tab. 17); the backward judge stays frozen, and letting it co-evolve is left open (§7; App. I.3).

## In plain words

Chemistry LLMs handle tasks in pairs that run both ways: describing a molecule and writing one from a description, or predicting a reaction's product and working back to its ingredients. The authors argue that such models often fail a round trip: a model "may successfully caption a molecule, yet be unable to accurately reconstruct the original structure from its own generated text", which they say suggests memorization (abstract). They train the model so its outputs survive the round trip: a frozen copy of the model scores each output by how likely it makes the original input, and that score is the reward in reinforcement learning (training by trial and reward) (abstract; §4.1). Only unlabelled inputs are needed, and the two directions can take turns (§4.2). Trained on unlabelled data, the chemistry model ChemDFM's exact ingredients → product → ingredients round trips rise from 0.547 to 0.821 (§6, Tab. 2), and in that setting trained models beat their untrained versions "on almost every task" (§6). The authors call RTRL "a novel framework" (abstract); earlier work mainly used round trips for evaluation or data augmentation (§1).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [exact match](#/glossary/exact-match) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [Levenshtein distance](#/glossary/levenshtein-distance) · [SMILES](#/glossary/smiles) (compared after canonicalization, §2, §6 "Baselines", App. D) · [reaction prediction and retrosynthesis](#/glossary/reaction-prediction-and-retrosynthesis) (§2) · [molecular fingerprint and Tanimoto similarity](#/glossary/molecular-fingerprint-and-tanimoto-similarity) (MACCS, RDKit and Morgan, App. D) · [Fréchet ChemNet Distance (FCD)](#/glossary/fréchet-chemnet-distance-fcd) (here against the test set, App. D)

**The paper's own terms:**
- **round-trip consistency (RTC)**: "a system's ability to take an input, map it to another domain, and then reliably reconstruct the original input from that output" (§3), measured as exact match between input and reconstruction (§3, Tab. 1; §6, Tab. 2).
- **forward and backward functions**: one LLM given a pair of inverse prompts (§4, Eq. 4). In training, the forward copy is the model being trained (the policy); the backward copy, kept frozen, scores it and is called the "judge" (§4.1; App. I.3).
- **round-trip reward**: the backward copy's log-probability of the original input, given the forward output, divided by the input's length; one forward pass, no generated reconstruction (§4.1, Eq. 8).
- **format reward**: a 0/1 score for a well-formed output, "for instance, this can be RDKit functionalities to validate and parse the output" (RDKit: an open-source cheminformatics toolkit), weighted by minus the lowest round-trip log-likelihood seen over "a preliminary set of training steps" (§4.1, Eq. 9; App. H).
- **iterative RTRL**: after each training epoch the forward and backward roles swap, and the new backward copy is the latest model (§4.2, Eq. 10; App. D).
- **self-supervised, supervised and synthetic settings** (§6): unlabelled data from one side only; fine-tuning on labelled pairs first, then adding the task's metric score to the reward; and starting from CHEBI-20 "with caption removed", the model generating the missing side.

**Builds on:**
- GRPO (Shao et al., 2024; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), the RL algorithm used (§2; App. G).
- The reported link between round-trip consistency and task performance: Liu et al. (2024a) in chemistry, Allamanis et al. (2024) for code ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)")) (§1; §3).
- Roots in machine translation: dual learning (Xia et al., 2017) (two inverse models training each other), cycle-consistency (Wangni, 2024) (a translation there and back should return the input), round-trip GRPO for low-resource languages (Attia & Aji, 2026) (§5).
- RTMol (Chen et al., 2025), concurrent round-trip training for chemical LLMs, rewarded by Tanimoto similarity after a full backward generation (§5; Tab. 5).

## Problem and setting

- **Question:** can round-trip consistency be trained as an objective, and does that improve consistency, the tasks themselves and other tasks? (Q1–Q6, §6).
- **Requirements:** a pair of mutually inverse tasks and "a base model with initial competence in both directions" (§7).
- **Models:** RTRL is applied to the chemical LLMs ChemDFM and LlaSMol (App. E adds two more). Baselines: GPT (a closed model, cited to OpenAI's GPT-4 report), the open-weight Qwen3-8B, the chemical LLMs Mol-Instructions, LlaSMol and ChemDFM, and, when supervised, GRPO+ChemDFM, rewarded by the metric scores alone (§6).
- **Data:** CHEBI-20 (about 33,000 molecule–description pairs from the ChEBI and PubChem databases) and LM-24 (pairs mined from US patents) for captioning and molecule generation; USPTO-Mixed (patent reactions, with reactants and reagents, the helper chemicals, mixed) for reaction prediction and USPTO-50K for retrosynthesis (USPTO: the US Patent and Trademark Office) (§6; App. A). Training data come from training splits, scores from held-out test splits (App. D).
- **What counts as correct:** for molecules, exact match after canonicalization, BLEU, Levenshtein distance, Tanimoto similarities, FCD and RDKit validity; for text, BLEU, ROUGE and METEOR (word overlap that also credits synonyms) (App. D).
- **Training:** 20,000 samples for one epoch, 12 sampled outputs each, a [KL penalty](#/glossary/kl-penalty), and [LoRA](#/glossary/lora-low-rank-adaptation) adapters (App. D).

## Approach

- **Objective.** The direct goal is to maximize the similarity between an input and its round trip (§4, Eq. 5). A hand-made similarity "may not capture true chemical similarity" and two full generations per reward are costly, so the surrogate is the backward model's likelihood of the input: it "uses the LLM itself as the judge" (§4.1, Eq. 6–7).
- **Training.** GRPO updates the forward copy; the backward copy stays fixed "For efficiency and to stabilize the reward landscape" (§4.1). The authors say the format weight "guarantees that a structurally invalid output, regardless of its round-trip likelihood, can never achieve a higher total reward than a format-correct output" (§4.1, Eq. 9).
- **Why the format reward.** When input and output are both molecules, the forward model "could theoretically maximize the round-trip reward by simply echoing the input reactants"; the authors report seeing this mostly in retrosynthesis and use RDKit to penalize outputs that "do not parse as distinct, valid multiple chemicals" (App. H). For molecule ↔ text tasks they argue the judge already gives an echo a low likelihood (App. H).
- **Variants.** The iterative runs use 4 iterations on unpaired data from both sides (§4.2; App. D).

## Results

- **The gap (§3, Tab. 1).** Exact round-trip consistency of untrained models is as low as 0.032 (ChemDFM, product → ingredients → product): "a systematic limitation in current models".
- **Q1 (§6, Tab. 2).** Trained on unlabelled one-side data, RTRL improves consistency "on all round-trip generation tasks"; for ChemDFM, reaction prediction → retrosynthesis goes from 0.547 to 0.821 exact match.
- **Q2 (§6, Tabs. 3–4).** Self-supervised: better than the base "on almost every task", e.g. ChemDFM's reaction-prediction exact match 0.601 against 0.559. Supervised: "improvement on most tasks"; against metric-only GRPO on the same setup, CHEBI-20 captioning BLEU-2 (BLEU over word pairs) is 0.492 against 0.418 (Tab. 4). The authors argue metric-reward GRPO cannot reach the self-supervised gains, since its rewards need reference labels (§6).
- **Against RTMol (§6, Tab. 5).** On CHEBI-20 text-based molecule generation, with the same backbone, data and reward budget, RTRL "attains comparable or better accuracy on all metrics except FCD while requiring 39% less training time".
- **Q3 (§6, Tab. 6; App. E, Tab. 13).** LlaSMol RTRL-trained on retrosynthesis and reaction prediction scores better on four property-prediction tasks it was not trained on; RTRL after fine-tuning also helps two classification tasks.
- **Q4–Q5 (§6, Fig. 2).** The authors report iterative RTRL "can continuously improve the model's ability in both directions", stopping at 4 iterations "based on diminishing returns observed in validation metrics" (App. D). Synthetic runs improve both directions, but "the improvement is less consistent" (§6).
- **Q6 (App. E, Tabs. 11–12).** RTRL beats fine-tuning on synthetic pairs, plain self-supervised training ("will sometimes cause performance collapse") and entropy minimization (a reward for the model's own confidence), which comes closer on molecules than on text.
- **Format reward (App. H, Tab. 17).** Without it, ChemDFM's retrosynthesis exact match falls from 0.323 to 0.157; the other two tasks barely change.

## Limits the authors state

- "(1) it relies on external seed data rather than operating in completely synthetic scenarios; (2) its likelihood objective prioritizes highly reliable pathways over diversity in one-to-many tasks; and (3) it uses a frozen backward model to maintain a strictly stationary reward landscape, leaving dynamic judge co-evolution unexplored" (a stationary reward: one that doesn't change during training) (§7). App. I adds: fully synthetic data risks "compounding hallucinations" (App. I.1); with narrow inputs such as conditional generation (molecules for a given label) the policy "can collapse onto a few" molecules, "a limitation shared by most self-evolving generative techniques" (App. I.2); co-evolving the judge "via EMA or alternating updates" (EMA: an exponential moving average of weights) is a direction (App. I.3).
- "our current empirical scope is chemistry" (App. C).
- Gains are "more modest on supervised USPTO-50K retrosynthesis, where high-quality verifiable rewards already exist" (§6). In App. E's USPTO-50K rows, not marked supervised, LlaSMol with RTRL is "only comparable with the base model", which the authors suspect is overfitting from prior exposure to the training data (App. E, Tab. 10).
- BLEU and Levenshtein distance on SMILES "can be noisy, since chemically equivalent molecules may be written as syntactically different strings" (App. D).
- Only instruction-tuned models that answer directly are tested, not reasoning models (App. I.4).

## Open problems and building blocks

  - "a more controlled synthesis process" for the synthetic variant (§6); the best frequency for switching roles (App. D).
  - Larger base models: RTRL "can potentially be applied to larger model whose ability to judge its own response is better" (App. E).
  - Ways "to enforce non-trivial transformations", e.g. min-max objectives (training against a worst-case opponent) penalizing input–output textual similarity, or secondary LLM judges (App. H); tighter integration with reasoning models (App. I.4).
- **Released:** the code repository (App. D), with the full prompt set (App. D.1).
- **To reuse it:** mutually inverse tasks and a base model already able to do both (§7); an 8-GPU Nvidia A40 node, where one epoch takes about 4 hours (USPTO-Mixed) or 5 (USPTO-50K) and 4 iterations about 16 or 20 hours (App. D "Computational cost").
- **Beyond its domain:** the authors call the prerequisites "domain-agnostic" and name code migration, low-resource machine translation and natural-language-to-code as candidates, to be validated in future work (App. C; §7).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/rlvr">rlvr</a></span>
