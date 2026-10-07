# ReAct: Synergizing Reasoning and Acting in Language Models

**ReAct** · ICLR 2023

Read: [PDF](https://arxiv.org/pdf/2210.03629) · [arXiv](https://arxiv.org/abs/2210.03629)  
Code: [ReAct](https://github.com/ysymyth/ReAct)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Interleaves reasoning traces with tool actions and observations.
- Mainly prompting; also fine-tunes smaller PaLM models on its own trajectories (§3).
- The base agent loop.

## In plain words

Reasoning step by step and acting in an environment had "primarily been studied as separate topics" in language models (abstract). The authors argue that reasoning alone, not grounded in the outside world, can make up facts (§1). ReAct prompts a frozen large model with a few human-written runs alternating free-text thoughts, actions (a Wikipedia search) and their results (§2). On a household text game and a shopping website, prompted with one or two examples, it beats agents trained on 1,000 to 100,000 task instances by copying experts or by trial and reward, by an absolute 34% and 10% in success rate (§1; on the game, best of six prompt sets, Tab. 3). On question answering and fact checking with a Wikipedia tool, it beats acting alone and is "competitive with chain-of-thought reasoning"; combining the two does best (§1). The authors call ReAct a "novel prompt-based paradigm" (§1) and, "To our knowledge", the "first demonstration of combined reasoning and action using an LLM applied to an interactive environment within a closed-loop system" (§4), where environment feedback returns to the model.

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [self-consistency](#/glossary/self-consistency-majority-voting) · [reinforcement learning](#/glossary/reinforcement-learning) · [beam search](#/glossary/beam-search) · [imitation learning](#/glossary/imitation-learning)

**The paper's own terms:**
- **thought** (or **reasoning trace**): a free-text step the model writes that "does not affect the external environment, thus leading to no observation feedback"; it is added to the context to support later reasoning or acting (§2).
- **trajectory**: the sequence of thoughts, actions and observations (what the environment returns) for one task (§2).
- **dense and sparse thoughts**: on the reasoning tasks every step is thought, action, observation; on the decision tasks the model decides for itself when to write a thought (§2).
- **Standard, CoT, CoT-SC, Act**: the baselines, built by removing parts of the ReAct trajectories: Standard removes thoughts, actions and observations; CoT (chain of thought) removes actions and observations; CoT-SC (CoT with self-consistency) takes the majority answer of 21 CoT samples at temperature 0.7; Act removes the thoughts (§3.2).
- **ReAct → CoT-SC** and **CoT-SC → ReAct**: the two combinations. The first falls back to CoT-SC when ReAct gives no answer within 7 steps on HotpotQA (multi-hop questions) or 5 on Fever (fact checking); the second falls back to ReAct when the majority answer of n CoT-SC samples occurs fewer than n/2 times (§3.2).
- **ReAct-IM**: an ablation whose thoughts imitate Inner Monologue (robot-planning work, see Builds on): they only decompose the current goal and name the current subgoal (§4, App. B.2).
- **best of 6 / avg**: ALFWorld (the household game) results are given for the best and the average of the six prompt trials (Tab. 3).

**Builds on:**
- Chain-of-thought prompting (Wei et al. 2022) and self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)"), with Wang et al. 2022's rationale-augmented ensembles) as the reasoning-only baselines (§3.2).
- Language models that plan and act in interactive environments, such as SayCan (robot action planning) and WebGPT (a model that browses the web to answer questions, trained with imitation and reinforcement learning); Act "loosely" resembles WebGPT (§1, §3.2, §5).
- Inner Monologue (robot planning with environment feedback injected as text), which the authors call "the first work that demonstrates such a closed-loop system, which ReAct builds on" (§5).
- STaR (fine-tuning a model on its own correct outputs): the fine-tuning is a bootstrapping approach "similar to" it (§3.2).

## Problem and setting

The question: can a model that interleaves reasoning and acting do better, and be more interpretable and trustworthy, than one that only reasons or only acts (§1)?

- **Model:** mainly Google's PaLM-540B, frozen and prompted with few-shot examples (§2); PaLM-8B and 62B for fine-tuning (§3.2); GPT-3 (text-davinci-002) in App. A.1.
- **Knowledge tasks (§3.1; metrics in Tab. 1):** HotpotQA, multi-hop questions that need two or more Wikipedia passages, scored by exact match (EM); Fever, claims labelled SUPPORTS, REFUTES or NOT ENOUGH INFO, scored by accuracy. Both are run "question-only": no supporting paragraphs are given. The only tool is a Wikipedia API with three actions: search (first 5 sentences of a page, or 5 similar titles), lookup (the next sentence containing a string) and finish.
- **Decision tasks (§4):** ALFWorld, a text game in a simulated household with 6 task types, scored by success rate on 134 unseen games; WebShop, a simulated shopping site with 1.18M real products, scored on 500 test instructions by average score (share of desired attributes the chosen product covers) and success rate (share of episodes where it satisfies all of them).

## Approach

- **Thoughts as actions (§2):** the action space is extended with free text. A thought changes only the context, which then holds every earlier thought, action and observation.
- **Prompts:** 6 HotpotQA and 3 Fever examples taken at random from the training set and annotated by hand (§3.2); for ALFWorld, three annotated trajectories per task type, with six prompts per type from the ordered pairs of them, and Act prompts built from the same trajectories without thoughts (§4); for WebShop, one example (Tab. 6). All prompts are in App. C.
- **Combining internal and external knowledge (§3.2):** the two back-off heuristics above, motivated by the observation that ReAct is "more factual and grounded" while CoT "is more accurate in formulating reasoning structure but can easily suffer from hallucinated facts or thoughts".
- **Fine-tuning (§3.2, App. B.1):** 3,000 correct trajectories generated by ReAct (likewise for each baseline) fine-tune PaLM-8B/62B.
- **Human-in-the-loop editing (App. A.3):** a person edits two thoughts in a failing ALFWorld run and the run succeeds (Fig. 5).

## Results

All are the authors' reports.
- **HotpotQA and Fever (Tab. 1, PaLM-540B prompting):** ReAct beats Act on both tasks (§3.3). Against CoT, ReAct scores 27.4 vs 29.4 EM on HotpotQA and 60.9 vs 56.3 accuracy on Fever (§3.3).
- **Combinations (Tab. 1, Fig. 2):** the best prompting methods are ReAct → CoT-SC on HotpotQA (35.1 EM) and CoT-SC → ReAct on Fever (64.6), against CoT-SC's 33.4 and 60.4. Both combinations "significantly and consistently outperform CoT-SC across different number of samples, reaching CoT-SC performance with 21 samples using merely 3-5 samples" (§3.3).
- **Failure modes (Tab. 2, §3.3):** from hand-labelled HotpotQA trajectories, hallucination is CoT's major failure mode and absent from ReAct's failures; ReAct has more reasoning errors than CoT, including a frequent loop of repeated thoughts and actions, and non-informative searches derail it.
- **Fine-tuning (Fig. 3, §3.3):** ReAct goes from worst of four methods at 8B and 62B when prompted to best when fine-tuned, with "PaLM-62B finetuned ReAct outperforming all 540B prompting methods".
- **ALFWorld (Tab. 3, §4):** the best ReAct trial reaches 71% success against the best Act (45%) and BUTLER (37%) trials, and ReAct's advantage over Act holds in each of the six controlled trials. ReAct "substantially outperforms" IM-style prompting (ReAct-IM), with "consistent advantages on five out of six tasks".
- **WebShop (Tab. 4, §4):** one-shot Act is on par with the imitation (IL) and imitation + reinforcement learning (IL+RL) baselines, trained on 1,012 human trajectories and, for IL+RL, 10,587 more instructions, with results taken from the WebShop paper; ReAct reaches 40.0% success rate against their 29.1% and 28.7%.
- **GPT-3 (Tab. 5, App. A.1):** GPT-3 "consistently outperforms PaLM-540B on HotpotQA and ALFWorld".
- **Outdated labels (Fig. 4, App. A.2):** "some HotpotQA questions may contain outdated answer labels" (§3.3), and in Fig. 4's example only ReAct obtains the up-to-date answer.

## Limits the authors state

- The Wikipedia API "mostly can only retrieve a small part of a passage based on exact passage name, which is significantly weaker than state-of-the-art lexical or neural retrievers" (§3.1).
- Interleaving "also reduces its flexibility in formulating reasoning steps", leading to more reasoning errors than CoT; for the repetition loop "We suspect that this could be due to the sub-optimal greedy decoding procedure" (§3.3 and footnote).
- Non-informative search "derails the model reasoning and gives it a hard time to recover and reformulate thoughts", "perhaps an expected trade-off between factuality and flexibility" (§3.3).
- With PaLM-8/62B, prompted ReAct performs worst "due to the difficulty to learn both reasoning and acting from in-context examples" (§3.3).
- "all prompting methods are still significantly far from domain-specific state-of-the-art approaches" (§3.3, Tab. 1); on WebShop, methods are "still far from the performance of expert humans" (§4).
- Under prompting, ReAct has "limited support of reasoning and acting behaviors" (§1); "complex tasks with large action spaces require more demonstrations to learn well, which unfortunately can easily go beyond the input length limit of in-context learning" (§6).
- PaLM "is not an openly accessible model yet" (Reproducibility Statement); connecting a model to actions "has potential dangers", which the experiments minimize by limiting interactions to Wikipedia and WebShop (Ethics Statement).

## Open problems and building blocks

  - Better decoding "(e.g. beam search) might help address" the repetition loop (§3.3 footnote).
  - "finetuning with more human-written data might be a better way to unleash the power of ReAct" (§3.3; also §6).
  - Scaling ReAct with multi-task training and "combining it with complementary paradigms like reinforcement learning" (§1, §6).
  - Better incorporation of reasoning "might benefit recent Internet-augmented language models" (models that search the web) "for up-to-date task solving" (App. A.2).
  - Incorporating human feedback, left "for future work" (§5 footnote); a "more systematic study" of thought editing (App. A.3).
- **Released:** all prompts (App. C) and the GPT-3 ReAct prompting code (Reproducibility Statement; App. A.1); a project page with code (title-page footnote).
- **To reuse it:** a large prompted model (PaLM-540B, or GPT-3 text-davinci-002, App. A.1); one to six in-context examples written by hand (§2); a tool interface per task (§3.1, §4). Fine-tuning used 3,000 trajectories, batch size 64, and 1,000–4,000 steps (App. B.1).
- **Beyond its domain:** the authors say ReAct "works for diverse tasks with distinct action spaces and reasoning needs, including but not limited to QA, fact verification, text game, and web navigation" (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
