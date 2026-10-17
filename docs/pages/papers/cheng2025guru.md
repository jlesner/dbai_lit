# Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective

**Revisiting Reinforcement Learning for…** · NeurIPS 2025

Read: [PDF](https://arxiv.org/pdf/2506.14965) · [arXiv](https://arxiv.org/abs/2506.14965) · [DOI](https://doi.org/10.52202/085713-4479)  
Code: [Reasoning360](https://github.com/LLM360/Reasoning360)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A 92K-example RL corpus over six domains (Math, Code, Science, Logic, Simulation, Tabular), each with its own verifiable reward (abstract); the authors report that Math, Code and Science "easily benefit from cross-domain RL training", while Logic, Simulation and Tabular, which they describe as having "limited pretraining exposure", "require in-domain training to achieve meaningful performance gains" (abstract; §3.1, Fig. 3).
- Single-domain against mixed-domain GRPO runs from Qwen2.5-7B/32B base models (§3), a difficulty-filtering ablation (§3.3), the Guru-7B/32B models trained on the full corpus and compared on 17 benchmarks (§4.2, Tab. 3), and pass@k curves of base against RL models under several decoding settings (§4.3).
- Evidence on which checkable domains RL transfers between, from one base-model family: in its runs the domains the authors take to be less seen in pretraining (Tabular includes table question answering) gained mainly from in-domain RL, and harder training data helped in-domain while hurting easier tasks in other domains (§3.3); the per-domain reward designs and the weak/strong-model pass-rate filter (§2.3, §2.5) are reusable parts.

## In plain words

Reinforcement learning on answers a program can check has mostly trained language models on math and code, which the authors say limits what is known for general reasoning; a key challenge, they say, is the lack of "reliable, scalable RL reward signals across diverse reasoning domains" (abstract). They build Guru, a cleaned set of 92K checkable problems in six domains (math, code, science, logic puzzles, code-execution prediction, table questions), each with its own answer check (abstract, §2). Training Qwen2.5 base models (open models not yet instruction-tuned) on one domain at a time, they report that math, code and science improve even from other domains' data, while logic, code prediction and tables "require in-domain training to achieve meaningful performance gains", which they read as RL "likely" teaching new skills there (abstract; §3.1); at 32B, tables gain modestly from other domains too (App. D.1). Their Guru-7B and Guru-32B, trained on all six, beat the best of three (7B) and two (32B) open baselines trained from the same base models by 7.9 and 6.7 points on average over 17 benchmarks (abstract; Tab. 3), which they call "state-of-the-art" among open models RL-trained on public data (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [zero-RL training](#/glossary/zero-rl-training) · [pass@k](#/glossary/passk) · [reasoning boundary](#/glossary/reasoning-boundary) · [policy entropy](#/glossary/policy-entropy) · [tabular question answering (TQA)](#/glossary/tabular-question-answering-tqa)

**The paper's own terms:**
- **Domain**: one of six task kinds: Math, Code, Science, Logic (grid and ordering puzzles, graph search, ARC-style grid-transformation puzzles (ARC: the Abstraction and Reasoning Corpus)), Simulation (predicting a Python program's output from its input, or an input from its output, without running it) and Tabular (answering questions over one or more tables; hierarchical ones, whose headers have several levels, App. B.6) (§2.1).
- **Cross-domain transfer**: the gain on one domain's benchmarks from RL on another domain's data; "in-domain" means training and testing on the same domain (§3, Fig. 3).
- **Guru-18K**: 3K examples sampled from each domain, used for the single-domain and mixed-domain runs of §3 (§3).
- **Weak and strong model pass rates**: the share of 16 attempts that Qwen2.5-7B-Instruct (weak) and a Qwen3 30B model (strong) get right on a training example, used to filter by difficulty (§2.5).
- **Difficulty gap**: strong pass rate minus weak pass rate, used as "a proxy for the learnability of a sample" (§2.5).
- **Online and offline evaluation**: small benchmark samples checked every 10 RL steps to pick a checkpoint, against the full 17-benchmark evaluation of the final models (§3, §4.1).

**Builds on:**
- Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")): its report that RL fails to improve pass@k at large k is the claim §4.3 revisits (§1, §4.3).
- Work on RL eliciting what the base model already knows, cited together: spurious rewards (Shao et al., 2025a; [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)"), cited as its website), RL from a single example (Wang et al., 2025a) and entropy minimization (Agarwal et al., 2025) (§1, §5).
- The baselines General Reasoner (Ma et al., 2025; RL on mostly STEM data), Open-Reasoner-Zero (Hu et al., 2025a; math RL from a base model) and SimpleRL-Zoo (Zeng et al., 2025; math RL from base models) (§4.1, §5).
- GRPO (Shao et al., 2024; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")) run in verl (Sheng et al., 2024), an RL training framework for LLMs (§4.1).

## Problem and setting

The paper asks whether findings about RL for LLM reasoning, drawn mostly from math and code, hold across domains, and whether training on several domains at once gives better general reasoners (§1).

- **Models:** all runs start from the Qwen2.5-7B and Qwen2.5-32B base models (open models from Alibaba, not instruction-tuned), with no supervised fine-tuning first (§3, §4.1; App. A). The authors exclude baselines trained with supervised fine-tuning "to ensure a fair comparison" (§4.1).
- **What counts as correct:** binary rewards: 1 if the answer passes the domain's check, else 0 (§2.3). Math, Logic, Simulation and Tabular extract a marked final answer and match it strictly after normalizing (math also accepts numerically equal answers and differences SymPy (a Python symbolic-math library) simplifies to zero, App. B.1); Code must pass all test cases (at most 8 per problem, App. B.2); Science uses "a 1.5B verifier model" from General Reasoner that judges whether the response entails the reference answer (§2.3, App. B.3).
- **Training sources:** public math collections, coding-site, contest and synthetic coding problems, web-sourced science questions, three puzzle generators of their own plus ARC-AGI and BARC (grid-transformation puzzles), CodeI/O (Python functions with input–output pairs), and HiTab and MultiHiertt (questions over hierarchical tables) (§2.1, Tab. 1; links in Tab. 4).
- **Evaluation:** 17 benchmarks: math competitions (AIME24, MATH500), code with tests (HumanEval, MBPP, LiveCodeBench), graduate science (GPQA-diamond, SuperGPQA), logic puzzles (ARC-AGI, Zebra Puzzle), code-execution prediction (CodeI/O, CRUXEval), table questions (HiTab, MultiHiertt, FinQA), and two "unseen" ones (IFEval, instruction following; LiveBench, its language, reasoning and data-analysis subsets) (§4.1, App. C, Tab. 5). Sampling uses temperature 1.0 and top-p 0.7, averaging 4 samples (32 for AIME24) on smaller sets ([greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling), [top-p](#/glossary/top-k-and-nucleus-top-p-sampling)) (§4.1).
- **Pretraining exposure** of each domain is the authors' explanation, offered as a hypothesis (§3.1).

## Approach

- **Data pipeline (§2, Fig. 2).** Five stages: sourcing; removing a question when it is a strict substring of another (§2.2); per-domain reward design (§2.3); heuristic filters, such as dropping code whose reference solution fails its own tests, then capping each source near 10k (§2.4); and difficulty filtering (§2.5).
- **Difficulty filtering (§2.5).** Drops examples the weak model nearly always solves, examples the strong model never solves ("potentially noisy"), and examples the weak model solves more often than the strong one, which, the authors say, their empirical analysis "suggests" often stems from incorrect ground-truth labels. Math and Science get stricter cuts on the difficulty gap.
- **Logic generators (App. B.4).** Zebra puzzles (attribute grids built from a sampled solution), ordering puzzles (recover an order of up to 50 objects from relations, made unique by constraint propagation, which rules out orders the constraints forbid) and graph puzzles (multi-hop paths through implications written in English).
- **Cross-domain study (§3).** GRPO on each domain's 3K examples alone and on the mixed Guru-18K, from both base sizes; each run continues until validation accuracy plateaus, and the best checkpoint by average online score is kept (§3).
- **Main models (§4.1).** GRPO on the full corpus, 16 samples per prompt, no [KL](#/glossary/kl-penalty) or entropy loss (a bonus for keeping outputs varied); 3 epochs for 7B and 2 for 32B.

## Results

- **Transfer depends on the domain (§3.1, Fig. 3; 32B in App. D.1, Fig. 8).** The authors report that Math, Code and Science "consistently achieve stronger performance gains than other domains from cross-domain RL training", while Logic, Simulation and Tabular "show limited improvement under cross-domain training". At 32B "these benefits extend modestly to additional domains, including Tabular" (App. D.1). Easier benchmarks (MATH500, AMC (a math competition), HumanEval, MBPP) gain from other domains' data; harder ones (AIME24, LiveCodeBench) much less, and ARC-AGI and CodeI/O marginally or not at all (§3.1).
- **Mixing domains (§3.1).** Training on the uniform mix gives results "consistently comparable to, and sometimes surpassing" in-domain training, with "minimal apparent interference" among the six domains.
- **Response length (§3.2, Fig. 4).** In single-domain runs, Code, Logic and Tabular answers get shorter, Science and Math longer, and Simulation stays about the same.
- **Harder training data (§3.3, Tab. 2).** With Qwen2.5-7B and 200 RL steps, difficulty-filtered math against unfiltered math gains on AMC (+6.3) and AIME24 (+5.9) but loses on HumanEval (−9.2) and HiTab (−3.0), while the harder LiveCodeBench and MultiHiertt show "minimal negative impact or positive change".
- **Main comparison (§4.2, Tab. 3).** Average over 17 benchmarks: Guru-7B 43.29 against the best baseline's 35.42 (Open-Reasoner-Zero), Guru-32B 54.24 against 47.53 (Open-Reasoner-Zero). The authors report that math- and STEM-focused baselines "perform poorly on coding and logic tasks"; on Zebra Puzzle (scored with partial credit), Guru-7B scores 39.40 against at most 1.00 for the 7B baselines.
- **Pass@k (§4.3, Fig. 5).** On AIME24 the 7B RL and base curves cross at k = 64, the pattern Yue et al. report; together with §3.1, the authors say this suggests math gains "largely exploit the base model rather than introduce fundamentally new capabilities". The 32B curves on AIME24 never cross. On Zebra Puzzle both Guru models "effectively expand the reasoning boundary of the base model". Raising temperature or top-p raises pass@k at large k, counteracting the narrowing "to a certain degree". During 7B training, pass@1 rises while pass@k at the largest k falls sharply until about step 160, as entropy drops; after that both rise slowly (App. D.2, Fig. 9).

## Limits the authors state

- Training lasts only three epochs (7B) and two (32B) "due to computing resource constraints"; longer training "might yield even more pronounced results" (App. A).
- No supervised fine-tuning before RL, chosen so the cross-domain conclusions don't depend on fine-tuning data; they expect fine-tuning then RL "could further enhance performance largely" and plan to explore it (App. A).
- The variance in transfer, they say, "suggests that cross-domain RL alone is not sufficient to effectively develop models with general, complex reasoning capability" (§3.1).
- Harder data "can consistently enhance in-domain performance when using Qwen2.5 as the base model"; for transfer, it "introduces a risk of negative transfer to easier tasks in other domains" (§3.3).
- Pass@k is sensitive to decoding settings, so they suggest treating it as "an informative but not exhaustive indicator" and "interpreting it with caution" (§4.3).
- The online ARC-AGI subset (prompts under 4,096 tokens) differs from the offline set, which "partially explains the performance gap between online and offline settings" (App. C).
- Code covers only Python; other languages, to study cross-language transfer, are left as future work (App. B.2).

## Open problems and building blocks

  - Whether interference "remains negligible as the number and diversity of included domains is increased", which "might necessitate more refined domain balancing strategies" (§3.1; App. D.1).
  - "advanced data mixing and RL training strategies" (§4).
  - Entropy dynamics as a signal for pass@k behaviour, and entropy control as "a potentially powerful mechanism for shaping learning dynamics" (App. D.2).
- **Released:** "data, models, training and evaluation code" (abstract; §1, §6); App. B says all new assets and repurposed ones are open-source and publicly available.
- **To reuse it:** GRPO in verl, 8k-token generations, 20 nodes of 8 Hopper GPUs (an NVIDIA data-centre GPU generation) for about 3 days per model (§4.1); a 1.5B verifier model for Science (§2.3); a weak and a strong model run 16 times per example for difficulty filtering (§2.5).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
