# EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers

**EvoPrompt** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2309.08532) · [arXiv](https://arxiv.org/abs/2309.08532)  
Code: [EvoPrompt](https://github.com/beeevita/EvoPrompt)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLMs act as crossover and mutation operators (GA and DE) over a prompt population.
- Evolutionary algorithms (a genetic algorithm, differential evolution) with LLM operators (§3).
- The evolutionary prompt optimizer GEPA's related work names ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") §6).

## In plain words

An LLM's results depend strongly on its instruction, and designing one "typically requires substantial human effort and expertise" (§1); earlier automatic methods usually need token probabilities, which "may not always be accessible through APIs" (§1). EvoPrompt runs an evolutionary search over prompts: an LLM combines and alters prompts by following the written steps of a genetic algorithm or of differential evolution, each new prompt is scored on a small development set, and the better ones are kept, with no gradients or model parameters (§3; abstract). On seven classification datasets with the open-source Alpaca-7b, averaged over three seeds, the differential-evolution variant averages 77.05 accuracy against 73.80 for the automatic method APE and 71.07 for manual instructions (Tab. 1). On the reasoning tasks of BIG-Bench Hard with GPT-3.5 and 3-shot chain-of-thought examples, the differential-evolution variant gains "up to 25%" on its best task over the prompt "Let's think step by step." (abstract; §4.4). Those GPT-3.5 results come from one seed (§4.1). The authors present the work as "a novel framework for discrete prompt optimization" (abstract), with no claim to be first.

## Background and terms

**Terms to know:** [evolutionary search](#/glossary/evolutionary-search) · [genetic algorithm](#/glossary/genetic-algorithm) · [black-box optimization](#/glossary/black-box-optimization) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [top-p sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [differential evolution (DE)](#/glossary/differential-evolution) (§3.3: "A modified version of DE uses the current best solution as vector a") · [exploration and exploitation](#/glossary/exploration-and-exploitation) (the paper contrasts "exploring diverse prompts" with "exploiting upon the current identified good prompts", §1)

**The paper's own terms:**
- **discrete prompt**: an instruction in words added to the input text (§1), as opposed to continuous prompts, which "tune parameters of some input tokens" (§2).
- **population and score**: the current set of prompts; a prompt's score on the development set is its fitness (§3.1; Alg. 2).
- **Evo(·)**: the instruction that makes the operator LLM carry out one evolutionary step on parent prompts, with a one-shot example of the algorithm's execution prepended (Alg. 1; App. B.2).
- **roulette wheel selection**: a parent is chosen with probability equal to its score divided by the sum of all scores (§3.2).
- **basic prompt, different parts, Prompt 3**: in the DE variant, each prompt in turn is the basic prompt; the LLM finds where two other, randomly selected prompts differ (the different parts), mutates only those parts, merges them into the current best prompt (Prompt 3), and crosses the result with the basic prompt (§3.3, Fig. 2).
- **normalized score** (BBH): "The accuracy difference between a given prompt and the baseline prompt 'Let's think step by step.'" (§4.4, footnote 1).

**Builds on:**
- APE (Zhou et al., 2022; [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), an automatic baseline, described as "an iterative Monte Carlo Search strategy, emphasizing on exploration" (§4.1), that is, picking the best of many sampled candidates (§2); its resampling template makes variations of initial prompts (§5.3, Fig. 4).
- APO (Pryzant et al., 2023; [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), which "harnesses incorrectly predicted instances as 'pseudo-gradient' to iteratively refine the original prompt, which emphasizes exploitation" (§4.1); in the glossary's terms, a [textual gradient](#/glossary/textual-gradient) method.
- LLMs imitating GA mutation (Lehman et al., 2022) or crossover (Meyerson et al., 2023), and LLMs with GA for neural architecture search (Chen et al., 2023) (§2).
- Classic GA (Holland, 1975) and DE (Storn & Price, 1997) (§3).

## Problem and setting

- **Question:** can an LLM following an evolutionary algorithm's steps write "coherent and human-readable" prompts (abstract) that improve without gradients or parameters (§1, §3)?
- **Models:** GPT-3.5 performs the evolutionary steps; prompts are optimized for the open-source Alpaca-7b and the closed-source GPT-3.5 (text-davinci-003) (§4.1).
- **Selection and seeds:** "We pick the prompt with the highest score on the development set and report its score on the test set"; Alpaca results average 3 seeds, and for GPT-3.5 the authors "report results of one seed due to budget limitation" (§4.1).
  - accuracy on seven classification sets, with one example per class prepended: the sentiment sets SST-2, MR, CR and SST-5, the topic sets AG's News and TREC, and the subjectivity set Subj (§4.2);
  - dialogue summarization on SAMSum (ROUGE-1/2/L) and text simplification on ASSET, scored by SARI, "an n-gram-based scoring system extensively utilized for text editing tasks" (§4.3);
  - BIG-Bench Hard (BBH), "a suite of 23 challenging BIG-Bench tasks requiring multi-step reasoning", on GPT-3.5 only, with 3-shot chain-of-thought examples; the development set is "a subset from the test set" (§4.4), and one task already at 100% with the manual prompt is removed (§4.4).
- **Baselines:** MI (task-specific manual instructions from earlier works); PromptSource and Natural Instructions (NI), repositories of human-written prompts; APE, re-run with equal population sizes; APO, re-run only on binary classification (§4.1).
- **Budgets:** population 10 and 10 steps; development sets of 200 (classification), 100 (generation) and 50 (BBH) examples (Tab. 11).

## Approach

- **Framework (§3.1, Alg. 1):** the initial population holds manual prompts plus some LLM-generated ones, for diversity. Each iteration selects parents, applies Evo(·), scores the new prompt on the development set and updates the population; at the end the best prompt on the development set is returned.
- **GA variant (§3.2, Fig. 1, Alg. 2):** roulette wheel selection picks two parents; the LLM crosses them (a child inheriting parts of both), then mutates the child. Each iteration makes as many new prompts as the population holds, then keeps that many of the best among old and new.
- **DE variant (§3.3, Fig. 2, Alg. 3):** the LLM mutates only where two prompts differ, since "the shared components of two prompts tend to have a positive impact on the performance, and thus need to be preserved" (§3.3); it merges the mutated parts into the current best prompt and crosses the result with the basic prompt. The better of the basic prompt and its child stays.
- **Claimed advantages (§1):** no access to parameters or gradients; "a balance between exploration and exploitation leading to better results"; human-readable prompts. They also present it as showing that LLMs can implement several types of evolutionary algorithms when given appropriate instructions (§1).

## Results

- **Classification (Tab. 1, Alpaca-7b):** the authors report both variants deliver "significantly better results" than earlier prompt-generation methods and human-written instructions (§4.2). GA is "slightly better" on sentiment and DE better on topic; DE's lead on Subj "may be contributed by the exceptional ability of DE to evade local optima when the initial prompts are not of high quality" (§4.2).
- **Generation (Tabs. 2–3):** the authors report "an improvement of over 3 points in SARI scores across both Alpaca and GPT-3.5 API" over manual prompts, and that EvoPrompt "consistently outperforms" APE (§4.3). On SAMSum, DE has the highest ROUGE scores for both models (Tab. 2); it "notably outperforms" GA on summarization and is comparable on simplification (§4.3).
- **BBH (Fig. 3, GPT-3.5):** they report EvoPrompt "obtains better prompts for all 22 tasks" (§4.4). DE reaches "up to a 25% improvement with an average of 3.5%", and GA a lower peak and average (§4.4). The authors conclude "the DE version is generally a good choice for these challenging tasks" (§4.4). App. C.2 adds APE's chain-of-thought prompt (Fig. 8, Tab. 12).
  - roulette wheel selection "achieves higher scores" than tournament selection (the best of a few random draws wins) and random selection (Tab. 4);
  - DE's default (mutate only the different parts, best prompt as Prompt 3) scores 75.55 on Subj against 69.87 mutating everything, 69.82 with a random Prompt 3 and 69.07 without Prompt 3 (Tab. 5);
  - on SST-5, "Crafted design of initial prompts is not essential"; from the worst initial prompts DE beats GA, which "indicates that DE is a better choice when the available manual prompts are not of high quality" (§5.3, Tab. 6).
- **App. C:** the authors suggest "for relatively simple tasks large populations are unnecessary" (App. C.1, Fig. 6). At the same number of iterations both variants beat APE "while introducing only a slight overhead in terms of the number of tokens", on one seed (App. C.3, Tab. 13).

## Limits the authors state

- GPT-3.5 results use "one seed due to budget limitation" (§4.1).
- "Intuitively, a trade-off exists between the performance and the overhead caused by the population size" (App. C.1).
- On BBH they "use the same initial population for all the 22 BBH tasks without priori knowledge of each task"; task-specific prompts "may further enhance the performance" (App. C.2).

## Open problems and building blocks

- **Open:** applying LLMs to other conventional algorithms such as particle swarm optimization and ant colony optimization (population searches modeled on flocks and on ant trails) and Quality-Diversity algorithms (seeking many good, different solutions) (§6), where "The main challenge is adapting the specific elements of traditional algorithms to work within LLMs" (App. D); and more advanced DE variants, for example with adaptive control parameters, whose challenge "lies in assessing the capacity of LLMs to adapt to these continuous control parameters" (App. D).
- **Released:** code (abstract) and "the optimal prompts" found for the understanding, generation and BBH tasks (App. C.4, Tabs. 14–18; §1).
- **To reuse it:** an operator LLM (GPT-3.5 in the paper) given the step-by-step GA or DE instruction with a one-shot example (App. B.2), sampling with Top-p (temperature 0.5, P = 0.95; App. B.3), a development set, and initial prompts (§3.1). The evaluation overhead is population size × development-set size × iterations, and the total number of API requests is "the same as APE" (App. C.3).
- **Beyond its domain:** "more applications can be explored, including game levels generation, text-to-images generation, non-trivial NP-hard problems (e.g. traveling salesman problem), etc." (App. D).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
