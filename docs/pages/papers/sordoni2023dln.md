# Joint Prompt Optimization of Stacked LLMs using Variational Inference

**Deep Language Networks** · NeurIPS 2023

Read: [PDF](https://arxiv.org/pdf/2306.12509) · [arXiv](https://arxiv.org/abs/2306.12509)  
Code: [deep-language-networks](https://github.com/microsoft/deep-language-networks)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Two stacked LLM calls treated as layers whose prompts are learned jointly.
- Variational inference over the hidden layer's text.
- Joint optimization of multi-step prompts; arXiv v1 June 2023, before DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)"), arXiv October 2023) but after its first iteration, DSP ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §1 footnote; not listed).

## In plain words

A pipeline of LLM calls has one prompt per call to tune, but usually only the final output has a label. The authors treat LLMs as "stochastic language layers" whose learnable parameters are their prompts, and stack two into a Deep Language Network (abstract), motivated by the costs of ever larger LLMs (§1). They build a one-layer optimizer (DLN-1), where an LLM revises the prompt from current errors and the best-scoring candidate is kept, and extend it to two layers (DLN-2) by treating the first call's output as hidden text and tuning both prompts with variational inference, a probabilistic-modeling method (§2–3). With GPT-3 (text-davinci-003) on nine classification tasks, DLN-1 beats the best GPT-3 baseline by about 20, 10 and 7 points on three of them (§5.2). DLN-2 adds an average 7.2% absolute over DLN-1 on five tasks (§5.3). They say DLN-1 "can be seen as an extension of Automatic Prompt Engineer", an earlier optimizer (§2.2), and see "promise that we might reach comparable performance to GPT-4, even when each LLM in the network is smaller and less powerful" (abstract).

## Background and terms

**Terms to know:** [hill climbing](#/glossary/hill-climbing) · [meta-prompt](#/glossary/meta-prompt) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [latent variable](#/glossary/latent-variable) (here `h`, §3) · [variational inference and the ELBO (evidence lower bound)](#/glossary/variational-inference-and-the-elbo) (here `q` approximates the distribution of `h` once the label is known; the bound is Eq. 2; §3.1). In the glossary's terms (our bridge), DLN-1 is a hill-climbing form of reflective prompt optimization, and its backward template is a meta-prompt.

**The paper's own terms:**
- **language layer**: one LLM call that turns an input string `x` into an output `y`, steered by a prompt `π`, which plays the role of weights (§2.1).
- **DLN-1, DLN-2**: one layer; two stacked layers, where the first layer's output `h` (hidden text) goes, with `x` (a "residual connection"), into the second. `π0` and `π1` are the two prompts (§3, Eq. 1).
- **template**: a function that combines strings into the LLM's input. Forward templates run the network; backward templates ask the LLM for new prompts or hidden texts (§2.1, App. D).
- **hidden proposal**: ways to sample candidate hidden texts: `q_edit` rewrites the forward pass's `h` given the label `y` and `π1`; `q_pri` reruns the first layer; `q_pri+` reruns it with the label added (§3.1).
- **posterior sharpening**: reweighting each sampled hidden text by how well it explains `y` plus how likely the first layer is to produce it (§3.1).
- **meta-instructions**: hand-written messages put into the backward template ("shorten the previous instruction", "give useful examples") to vary the proposals (§4).
- **exploration reward**: a bonus for first-layer prompts that make hidden texts which led to wrong answers less likely (§4).

**Builds on:**
- Automatic Prompt Engineer (APE), Zhou et al. [57] ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")): DLN-1's procedure "can be seen as an extension" of it (§2.2).
- Chain of thought (CoT), Wei et al. [48], and zero-shot step-by-step prompting, Kojima et al. [17]: CoT "can be seen as a particular DLN-2" with set prompts (§1).
- Language model cascades, Dohan et al. [8], graphical models over strings: DLNs "can likewise be considered an instance", and the authors say they go "beyond the conceptual work" with an inference technique and experiments (§6).
- Variational inference, Blei et al. [3] and Kingma and Welling [16] (§3.1).

## Problem and setting

- **Question:** can stacked LLM calls be trained end to end through their prompts alone, without access to the LLM parameters (§3)? The experiments ask "Can we outperform APE and In-Context Learning (ICL) with a DLN-1?" and "Does network depth provide further improvement upon DLN-1?" (§5).
- **Access:** scoring assumes "access to the log-likelihoods" of the LLM (§2.2).
- **Models:** GPT-3 and GPT-4 "unless otherwise specified" (§5.1).
- **Tasks** (§5.1, Tab. 3): "We focus on classification tasks". From BigBench-Hard (BBH, hard BIG-bench reasoning tasks): Hyperbaton (Hyper., adjective order), Navigate (Nav.), Date Understanding (Date.), Logical Deduction with seven objects (Logic.7); Mpqa (sentiment), Trec (question type) and Subj (subjective or objective) from Lu et al. [23]; Disaster (relevance to a disaster) and Airline (tweet sentiment) from the Leopard collection.
- **Metric:** exact-match accuracy, handling issues like tokenization and capitalization (§5.1).
- **Protocol:** DLNs get a hyperparameter search, three seeds per setting, and the paper reports mean test accuracy of the setting with the best mean validation accuracy (§5.1, App. I). Batch size 20, 20 iterations, 20 prompt proposals and 5 hidden samples (§5.1).
- **Baselines** (§5.1), on GPT-3: 0-shot; 5-shot ICL with random examples; KATE (Liu et al. [20]: the five most similar training examples as in-context examples); APE-15 and APE-400 (the best LLM-proposed instruction from 15 or 400 examples, used 0-shot); zero-shot CoT, which "can be seen as DLN-2 without optimization". On GPT-4: 0-shot and ICL. Prompts start from a task description, so "at initialization, a 1-layer LN is equivalent to the 0-shot baseline" (App. B.2).

## Approach

- **DLN-1 (§2.2, Alg. 1).** Run the current prompt on a minibatch; show the LLM a backward template with the prompt, the examples it got right, and the ones it got wrong with its own outputs; sample `N` new prompts; score each by the length-normalized log-probability of the correct outputs; keep the best. Showing the model's own predictions is something "we found to empirically help performance".
- **Practical choices (§4).** Randomly sampled meta-instructions and batch subsets diversify proposals. Asking for examples lets the LLM propose prompts with synthetic task examples, which the authors found "often perform better than standard ICL". Backtracking keeps the current prompt among the candidates, and a memory keeps the best prompts by validation score.
- **DLN-2 (§3, Alg. 2).** The output probability sums over hidden texts (Eq. 1). The ELBO (Eq. 2) splits training into two prompt searches weighted by sampled hidden texts (Eq. 3): `π1` as in DLN-1 with those texts as extra inputs, `π0` with them as targets (§3.1). The bound "is only useful if it is close to the true value" (§3.1). The authors "found most effective to sample hidden states from a mixture" of `q_pri` and `q_pri+` (§3.1), then sharpen the weights.
- **Exploration reward (§4).** Because `π0` "was updating very slowly", a reward against hidden texts that led to wrong answers is added, its coefficient annealed to 0 from a start value chosen per task on validation.
- **More layers (App. E, Alg. 3):** a generalized algorithm for deeper networks.

## Results

- **DLN-1 on GPT-3 (§5.2, Tab. 1).** It matches the best GPT-3 method on Disaster, Mpqa and Airline, "narrowly beats" it on Logic.7 and Nav., and beats it on Hyper., Trec and Subj "by about 20, 10, and 7 percentage points, respectively". "On Hyper., Trec, and Disaster, it even surpasses GPT-4 baselines, unsurprisingly underperforming GPT-4 on all other tasks".
- **Learned prompt (§5.2, Fig. 2):** instructions plus training examples "automatically chosen by the optimizer".
- **DLN-2 on GPT-3 (§5.3, Tab. 2).** It reports "an average boost of 7.2% absolute score" over DLN-1 on five tasks. On Nav. and Date. it scores 83.1 and 75.2 against DLN-1's 68.5 and 55.7; on Logic.7 "all methods appear to perform similarly". On Subj and Disaster it reports "more than 20% in absolute improvement" on average over GPT-4 0-shot.
- **More baselines and models (App. C).** The authors say DLN-1 and DLN-2 outperform CoT+APE (Tab. 5) and that more ICL or KATE examples "cannot match DLN-1 and DLN-2 in general" (Tab. 6). With the open model WizardLM-13B, "DLN-1 outperforms ICL on all tasks here" (Tab. 7); Tab. 8 uses LLaMA2-70B-Chat, and Tab. 9 compares layerwise with end-to-end DLN-2 training.
- **Test-time cost (App. J, Tab. 11).** "DLN-1 improves over ICL on 5 out of 9 tasks on GPT-4 at a comparable token cost".

## Limits the authors state

- "we do rely on a good amount of prompt engineering for our templates" (§4).
- Optimization "is challenging due to the fact that we do not have gradient information and we sample a restricted set of candidates" (§4).
- On Date., DLN-1 "tends to systematically under-perform the 0-shot baseline both for GPT-3 and GPT-4"; it "overfits due to paucity of examples in the validation set" (§5.2).
- Logic.7 "could point to the fact that the task might be too hard for the base LLM" (§5.3).
- "we only tested 1-layer and 2-layer LNs so far" (§7).
- They noticed GPT-3 "has a tendency to always produce an answer given an example" (§7).
- DLN-2 on Subj uses another hidden template: "We couldn't run with the previous template due to lack of time" (App. D.1).
- "We didn't try other initializations for this hidden layer, we leave this for future explorations" (App. B.2).
- Artificial-task performance "is neither representative of performance in uncontrolled environments, nor enough to justify the deployment of these models in high stakes situations" (§7, "Impact statement").

## Open problems and building blocks

  - Learn parts of the templates: "we expect this to make the variational bound tighter" (§7).
  - Whether one can fine-tune "stackable" LLMs, and use DLNs to generate their training data (§7).
  - "the framework accommodates arbitrary directed acyclic graphs" (§7).
  - Possibly learning the meta-instructions (§4) and "a prompt for the posterior proposal" (App. D.2), and regularizing prompt length "in a more principled manner" (App. I).
- **Released:** "The DLN code is open source" (abstract, footnote 1).
- **To reuse it:** an LLM that exposes log-likelihoods, though "there is no restriction on the scoring function that can be used" (§2.2); the hand-written templates (App. D). One Hyperbaton training run cost "roughly 59 USD and 273 USD" for DLN-1 and DLN-2 at text-davinci-003 prices (App. J).
- **Beyond its domain:** "We believe the modularity of these architectures will make them more adaptable and reusable to new use cases" (§7).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
