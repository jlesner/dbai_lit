# Reflexion: Language Agents with Verbal Reinforcement Learning

**Reflexion** · preprint 2023

Read: [PDF](https://arxiv.org/pdf/2303.11366) · [arXiv](https://arxiv.org/abs/2303.11366)  
Code: [reflexion](https://github.com/noahshinn/reflexion)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The agent writes a verbal reflection after a failed attempt and keeps it in memory for the next attempt at the same task.
- Feedback from exact match with the gold answer (HotPotQA), environment signals and a heuristic (ALFWorld), or self-written unit tests (code) (§1, §3, §4).
- Self-improvement without weight updates; a precursor that GEPA and ACE cite as related work.

## In plain words

LLM agents struggle to learn quickly and efficiently from trial and error, the authors say, because traditional [reinforcement learning](#/glossary/reinforcement-learning) methods "require extensive training samples and expensive model fine-tuning" (abstract). Reflexion instead has the agent write a short reflection in words after a failed attempt, store it, and read it on its next attempt at the same task; the model's weights never change. The failure signal comes from comparing with the dataset's answer, from the environment, a hand-written rule or an LLM's judgment, or from tests the model writes for its own code.

The tests cover household text games (ALFWorld), multi-step Wikipedia questions (HotPotQA) and coding. Their headline: 91% of the HumanEval Python programming problems solved on the single submitted answer, after retries guided by its own tests, against 80% for GPT-4 (abstract). They also report absolute gains of 22% on ALFWorld within 12 attempts and 20% on HotPotQA over their baselines (§1). They present it as "a novel framework to reinforce language agents not by updating weights, but instead through linguistic feedback" (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) (the paper borrows its vocabulary) · [pass@k](#/glossary/passk) (the paper reports pass@1: one submitted answer per problem) · [credit assignment problem](#/glossary/credit-assignment-problem) (the authors say useful reflections require it, §1).

**The paper's own terms:**
- **Actor**: the LLM that produces text and actions, prompted as Chain of Thought (step-by-step reasoning before the answer) or ReAct (reasoning steps interleaved with actions such as searches) (§3).
- **Evaluator**: the part that scores an attempt; exact-match grading for reasoning, "pre-defined heuristic functions" for decision-making, and, for decision-making and programming, "a different instantiation of an LLM itself" (§3).
- **Self-Reflection model**: an LLM that takes a sparse reward (only success or failure), the attempt and the memory, and writes verbal feedback stored in memory (§3).
- **Trial** and **trajectory**: one attempt at a task, and its sequence of actions and observations (§3).
- **Short-term and long-term memory**: the current trajectory, and the stored reflections; the long-term memory is bounded to a number of stored reflections "usually set to 1-3" (§3).
- **Verbal reinforcement**: the paper's name for its kind of learning signal; the reflection "acts as a 'semantic' gradient signal by providing the agent with a concrete direction to improve upon" (§1).
- **Episodic memory (EPM)**, in the HotPotQA ablation: adding the most recent trajectory to the prompt, without a reflection (§4.2).
- **CoT (GT)**: Chain of Thought given the dataset's ground-truth context, to test reasoning alone (§4.2).
- **False positive / false negative** (of the self-written tests): the tests pass but the solution fails / the tests fail but the solution passes (Tab. 2 caption).
- **LeetcodeHardGym**: the authors' new benchmark, 40 Leetcode questions rated hard, released after "October 8, 2022, which is the pre-training cutoff date of GPT-4" (§4.3), in 19 programming languages (§1).

**Builds on:**
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), the reasoning-and-acting prompt style: the Actor for ALFWorld and HotPotQA, with ALFWorld's setup and few-shot examples taken from it (§4.1, §4.2).
- Chain of Thought (Wei et al.), the other Actor (§3, §4.2); not listed here.
- In-context policy iteration (Brooks et al.), which the authors say inspired the memory component (§3); not listed here.
- Code-generation work compared in §2: AlphaCode, Self-Debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and CodeRL, which test or repair code using execution feedback and, the authors say, "rely upon ground truth test cases that invalidate pass@1 eligibility, and do not use self-reflection"; and CodeT, which scores code with self-generated tests but has no self-learning step (§2).

## Problem and setting

- **Question:** can an LLM agent get better across repeated attempts at the same task by writing and rereading its own verbal feedback, without fine-tuning (§1)?
- **ALFWorld** (§4.1): 134 text-based environments across six task types, built on TextWorld (a learning environment for text games). ReAct is the Actor, with GPT-3 and two few-shot trajectories. Two self-evaluations decide when to reflect: an LLM classifier, or a heuristic triggering when the agent "executes the same action and receives the same response for more than 3 cycles, or if the number of actions taken in the current environment exceeds 30". Memory keeps the last 3 reflections; when a reflection is suggested, the baseline instead resets and retries without reflecting.
- **HotPotQA** (§4.2): a Wikipedia-based question-answering dataset needing reasoning over several documents; 100 questions (Fig. 4 caption). Actors: CoT (6-shot), CoT (GT), and ReAct with a Wikipedia API (2-shot). Between trials, "exact match answer grading using the environment" gives a binary success signal; memory holds 3 experiences. Reflexion retries a failed task until 3 consecutive failed attempts; the baselines are retried at temperature 0.7.
- **Programming** (§4.3): HumanEval and MBPP (writing a Python function body from a description), Rust versions of subsets of them made with MultiPL-E (compilers that translate Python benchmark questions to other languages), and LeetcodeHardGym. The Evaluator is a suite of at most 6 unit tests the model writes with Chain of Thought, kept only if they parse into a valid abstract syntax tree; memory holds 1 experience. The authors say this makes the results "eligible for pass@1 accuracy reporting".
- **Models:** GPT-3 for ALFWorld (§4.1); GPT-4 as base model in the programming ablation (Tab. 3 caption); other models in App. A.

## Approach

- **The loop** (§3, Fig. 2): the Actor makes an attempt, the Evaluator scores it, the Self-Reflection model writes a reflection that is appended to memory, and the Actor tries again with that memory, until the Evaluator "deems τt to be correct" (τt: the attempt at trial t) or a trial limit is reached.
- **What a reflection does** (§3, example of a multi-step decision task): on a failure signal the agent "can infer that a specific action ai led to subsequent incorrect actions" (ai: the action at step i), can state the action it should have taken, and can choose it in later trials.
- **Programming specifics** (§4.3 "Analysis"): the authors prefer false negatives to false positives, since the agent "may be able to use self-reflection to identify the incorrect test(s)", while a false positive makes it "prematurely report an invalid submission".

## Results

- **ALFWorld** (§4.1, Fig. 3): ReAct + Reflexion completes 130 of 134 tasks with the heuristic over 12 consecutive trials, an absolute 22% over the baselines (§1). ReAct alone stops improving "between trials 6 and 7". A common baseline failure: the agent thinks it holds an item it lacks (§4.1 "Analysis").
- **HotPotQA** (§4.2, Fig. 4): Reflexion "outperforms all baseline approaches by significant margins over several learning steps"; the gain is 20% (§1, §4). The baselines "fail to probabilistically improve on any tasks" after the first trial at temperature 0.7. Reflexion also raises CoT (GT) accuracy (Fig. 4(b)). In the ablation, self-reflection adds "an 8% absolute boost over the episodic memory learning advantage" (Fig. 4(c)).
- **Programming pass@1** (Tab. 1), Reflexion against the GPT-4 "SOTA Pass@1" column: 91.0 vs 80.1 on HumanEval Python, 15.0 vs 7.5 on Leetcode Hard Python, and 77.1 vs 80.1 on MBPP Python, the one benchmark where Reflexion is below (§4.3).
- **Test quality** (Tab. 2, §4.3): the authors trace the MBPP Python result to false positives of the self-written tests, 16.3% on MBPP Python against 1.4% on HumanEval Python.
- **Ablation** (Tab. 3, GPT-4 on the 50 hardest HumanEval Rust problems): base 0.60; without test generation 0.52; without self-reflection 0.60; full Reflexion 0.68. The authors conclude that "blind trial and error debugging techniques without self-reflection are ineffective on harder tasks such as writing complex programs in Rust" (§4.3).
- **Other models** (App. A): Reflexion gives no gain with starchat-beta (cited to StarCoder, an open code model) on HumanEval Python (Tab. 4), and gains with text-davinci-003, gpt-3.5-turbo and gpt-4, each with CoT (GT) and ReAct, on 100 HotPotQA questions (Tab. 5).
- **WebShop** (App. B.1, Fig. 6; a benchmark of shopping on a website): the agent showed no signs of improvement, so the runs were stopped after four trials; it "fails to significantly outperform ReAct" (Fig. 6 caption).

## Limits the authors state

- It relies on "the power of the LLM's self-evaluation capabilities (or heuristics)" and has no "formal guarantee for success" (§1).
- Improving the agent's policy (its behaviour) in natural language "may still succumb to non-optimal local minima solutions" (§5).
- Long-term memory is limited "to a sliding window with maximum capacity" (§5).
- For code, test-driven feedback has practical limits: "non-deterministic generator functions, impure functions that interact with APIs", hardware-dependent outputs, and parallel or concurrent behavior "that may be difficult to predict" (§5).
- Code agents "are bound to their ability to write diverse, comprehensive tests"; a flaky test suite can pass an incorrect solution (§4.3 "Analysis").
- "the ability to specify self-corrections is an emergent quality of stronger, larger models" (App. A).
- On WebShop the agent "does not generate helpful, intuitive self-reflections", and "Reflexion is unable to solve tasks that require a significant amount of diversity and exploration" (App. B.1).
- The generated code "is not validated before execution", so isolated execution environments are advised (§8); the work "also amplifies the risks when these agents were put into misuse" (§6).

## Open problems and building blocks

  - extend the memory "with more advanced structures such as vector embedding databases or traditional SQL databases" (§5);
  - bring in RL techniques "such as value learning in natural language or off-policy exploration techniques" (§7);
  - "more effort in safety and ethical considerations" (§6).
- **Released:** "We release all code, demos, and datasets" (abstract).
- **To reuse it:** an LLM for the Actor and the reflections, a success signal per task, memory of 1–3 reflections to fit the context window (§3), a strong model (App. A), and programming prompts with "strict instructions to produce function bodies only" (App. C).
- **Beyond its domain:** the authors say the code-generation implementations "are language-agnostic and can be used for interpreted and compiled languages" (§4.3).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
