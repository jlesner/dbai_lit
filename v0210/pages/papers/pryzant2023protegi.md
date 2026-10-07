# Automatic Prompt Optimization with "Gradient Descent" and Beam Search

**ProTeGi** · EMNLP 2023

Read: [PDF](https://arxiv.org/pdf/2305.03495) · [arXiv](https://arxiv.org/abs/2305.03495) · [DOI](https://doi.org/10.18653/v1/2023.emnlp-main.494)  
Code: [LMOps](https://github.com/microsoft/LMOps)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Natural-language "gradients": an LLM criticizes a prompt on errors and edits it.
- Beam search with bandit selection over edited prompts.
- An early critique-and-edit optimizer (<a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a>).

## In plain words

LLM prompts are written by hand "with onerous trial-and-error effort" (abstract), and earlier automatic methods, the authors say, may need access to the model's internals, produce incomprehensible prompts, or search without direction (§1). ProTeGi improves a starting prompt using only training examples and an LLM API. An LLM reads the prompt's mistakes on a small batch of examples and writes a criticism, which the authors call a natural-language "gradient"; another LLM call edits the prompt to fix those problems. A beam search (keeping the few best prompts each round) carries edited prompts and their paraphrases forward, and a bandit procedure spends a limited evaluation budget to choose which candidates to keep (§2). They test it on four yes/no classification tasks, by default with gpt-3.5-turbo (§3.1–3.2). Their preliminary results suggest it can improve an initial prompt "by up to 31%" (abstract). On average it beat a sampling-based prompt search by 3.9% and a reinforcement-learning editing baseline by 8.2% (§3.4). They present it as "a novel technique for overcoming the discrete optimization barrier" (§5): prompts are text, so no numerical gradient exists.

## Background and terms

**Terms to know:** [textual gradient](#/glossary/textual-gradient) · [beam search](#/glossary/beam-search) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) · [F1 score](#/glossary/f1-score) · [best arm identification](#/glossary/best-arm-identification) (an arm is a candidate prompt and a pull is "evaluating the prompt on a randomly chosen data point", §2.2.2).

**The paper's own terms:**
- **gradient** (g): a natural-language summary of the current prompt's flaws, written by an LLM from the prompt and its errors on a minibatch; it represents "directions in a semantic space that are making the prompt worse" (§2.1).
- **∇ and δ**: the two fixed prompt templates of the gradient step. ∇ produces the gradient; δ takes the gradient and the prompt and edits the prompt "in the opposite semantic direction of g, i.e. fix the problems with p0 that are indicated by g" (§2.1; p0 is the starting prompt).
- **expansion and selection**: the two halves of each beam-search round: generate successor prompts, then keep the b best, b being the beam width (§2.2).
- **nonparametric**: the authors' word for their method (abstract, §1); it needs "no hyperparameter tuning or model training" (§5).
- **maxpooling over the final beam**: the reported score is the best of the final beam's candidates (§3.2).

**Builds on:**
- Automatic Prompt Engineering, APE (Zhou et al., 2022; [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")): the Monte Carlo baseline, which the authors call an "iterative but directionless monte carlo search over the space of prompts" (§3.3); its paraphrase prompt is reused for the Monte Carlo successors (App. A, §1.1).
- GrIPS (Prasad et al., 2022) and TEMPERA (Zhang et al., 2023): edit searches that add, paraphrase, swap and delete phrases of the prompt; their search space is the basis of the RL baseline (§3.3).
- Best arm identification in bandits (Audibert et al., 2010), and Successive Halving (Karnin et al., 2013): the framing and algorithms of the selection step (§1, §2.2.2).

## Problem and setting

- **Question:** how to improve a hand-written prompt automatically, "assuming access to training data and an LLM API" (abstract).
- **Formal setting (§2):** an initial prompt p0, i.i.d. training input–output pairs, and a black-box LLM API; the target is the prompt that maximizes a metric on in-domain test or development data, which the algorithm approximates.
- **Tasks (§3.1):** four binary classification tasks. Jailbreak, a new set of 452 multilingual, human-labelled user inputs, a jailbreak being "a user interaction strategy intended to get the AI to break its own rules"; Ethos, English hate speech (997 comments); Liar, English fake news (4000 statements with context); Sarcasm, Arabic sarcasm (10,000 comments).
- **Setup (§3.2):** per task, 50 random examples for development and 150 for test; results averaged over 3 trials; "test set binary F1 score throughout, based on maxpooling over the final beam of candidates". Unless otherwise stated: a January 2023 gpt-3.5-turbo, temperature 0.0 for classification and 1.0 elsewhere; minibatch 64, beam width b = 4, 6 optimization steps, 4 gradients per group of 4 errors, one edit per gradient, 2 Monte Carlo samples per new candidate, 8 successors sampled per parent before selection. The optimization target is F1 for all tasks. No hyperparameter search was run for ProTeGi or the baselines. A random pair of few-shot examples is held fixed during optimization. The starting prompts were written by ML engineers "in one quick pass" (App. A, §1.2).
- **Baselines (§3.3):** Monte Carlo (MC), APE's sampling search, with its sample count matched to ProTeGi's successors; Reinforcement Learning (RL), the authors' own RL-trained model over the GrIPS/TEMPERA phrase-level actions, which they say "suggests an upper bound on GRIPS performance" (footnote); AutoGPT, an open-source AI agent with its own feedback loop, given the same examples and errors for 6 turns. For selection, the baseline spreads the query budget evenly over candidates (uniform).

## Approach

- **Gradient step (§2.1, §2.2.1, Alg. 2):** run the prompt on a sampled minibatch and collect its errors; ∇ asks the LLM for reasons the prompt could have got them wrong; δ asks for improved prompts that fix those problems; a paraphrasing LLM adds Monte Carlo successors, prompts "worded differently but semantically similar". Edit size is left to the LLM, an "adaptive" step size (§2.1 footnote).
- **Beam search (§2.2, Alg. 1):** each round expands every prompt on the beam and selects b successors, up to a search depth r; the best prompt on the final beam is returned.
- **Selection as best arm identification (§2.2.2):** candidates are scored on random data samples, since full evaluation is expensive.
  - UCB (Alg. 3) keeps, for each prompt, what the paper calls its "estimated performance" and query count, and returns the b prompts with the highest estimate. UCB-E favours exploration, with "better theoretical convergence properties".
  - Successive Rejects (Alg. 4) runs n − 1 phases for n prompts, dropping the lowest-scoring prompt each phase. Citing Audibert et al., the authors call it "provably optimal for best arm identification", and say it "requires no hyperparameters unlike its UCB alternatives"; its per-phase sample size grows from phase to phase (Eq. 1).
  - Successive Halving is "more agressive", rejecting the bottom half each phase.

## Results

- **Main comparison (Fig. 3, §3.4):** the results "suggest that ProTeGi can outperform other state-of-the-art algorithms on all four datasets considered". On average it improved over MC and RL by 3.9% and 8.2%, called "significant", and over the original prompt by 15.3% and AutoGPT by 15.2%. The margin "remains relatively consistent" from 12 to 50 evaluations per candidate. §1 says the results suggest it can do so "while relying on fewer LLM API calls". RL stays near the starting prompt on Ethos and Sarcasm; on Jailbreak and Sarcasm, AutoGPT's feedback lowered the starting prompt's score.
- **Beam ablation (Tab. 1, §3.4):** at the same API budget, beam search scored 0.85 / 0.67 / 0.88 on Jailbreak / Liar / Sarcasm, against 0.80 / 0.63 / 0.87 for one flat enumerate-then-select step and 0.82 / 0.63 / 0.85 for greedy depth-first search.
- **Selection algorithms (Tab. 2, §3.4):** all best-arm algorithms beat uniform selection (at 50 queries per prompt on Jailbreak, UCB 0.85 against 0.77). "UCB-style algorithms consistently outperform successive rejects-style algorithms", contrary to the authors' hypothesis.
- **Learning curves (Fig. 4, §3.4):** the results suggest the process "can begin to overfit on the train data, or get caught in a local minima after only a few optimization steps; all datasets peaked at around 3 steps". Ethos and Sarcasm stay relatively stable, "possibly due to a better initial fit between the starting prompt and task".
- **Base models (Tab. 3, §3.4):** the RLHF-tuned models (trained with human feedback) "dramatically outperform GPT-3", with GPT-4 best, on Sarcasm and Jailbreak (Jailbreak 0.55 for GPT-3 davinci, 0.88 for GPT-4).
- **Qualitative (Tab. 4, §3.4):** the Ethos and Liar gradients reflect mismatches between the prompt and the example, while the Jailbreak gradient "appears less useful". ProTeGi's candidates vary more than the baselines'; "In some cases, this can hurt more than help", as when the new Jailbreak prompt "asks the LLM to solve a new task", and on Ethos ProTeGi used "its internal knowledge to redefine a concept" instead of the gradient.
- **Variance (Tab. 5, App. C):** with 6 queries per candidate and 12 replicates, ProTeGi "always works better" than MC but "can sometimes have higher variance".

## Limits the authors state

- The study is "a limited and preliminary case study" (§3).
- Efficiency is "limited in real terms by rate limiting on the LLM API"; the many API calls "can push the runtime of the optimization program past 1 hour even with a small query budget"; for "very large prompt spaces or urgent applications" it "might not be feasible" without significant compute (Limitations).
- ProTeGi "was only tested on four benchmark classification tasks". "Further testing and refinement may be needed for different types of tasks, especially those with more complex modeling requirements" (Limitations).
- UCB "is designed primarily for regret minimization" (maximizing the reward collected along the way), not best arm identification, and "can perform poorly if the exploration parameter c is not tuned appropriately"; UCB-E "remains stuck with hyperparameters" (§2.2.2).
- Overfitting or local minima after a few steps, edits that in some cases hurt, and sometimes higher variance than MC (§3.4, App. C).

## Open problems and building blocks

- **Open:** future work on "generalizing the technique to more tasks with new metric functions, incorporating step sizes into the learning process, and expanding the conceptual framework of textual gradient descent" (§5).
- **Released:** "Code and data available" (abstract footnote).
- **To reuse it:** an initial prompt, training data, a metric function and an LLM API (abstract, §2); no log-likelihoods, which "did not help our algorithm" in preliminary experiments (§3.2); no hyperparameter tuning or model training (§5).
- **Beyond its domain:** the authors say ProTeGi "could be applied to any problem such as parsing, chatbot design or summarization simply by choosing different metric functions" (§3.1).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
