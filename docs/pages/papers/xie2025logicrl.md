# Logic-RL: Unleashing LLM Reasoning with Rule-Based Reinforcement Learning

**Logic-RL** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2502.14768) · [arXiv](https://arxiv.org/abs/2502.14768)  
Code: [Logic-RL](https://github.com/Unakar/Logic-RL)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- RL with a rule-based reward on procedurally generated Knights and Knaves logic puzzles trains Qwen2.5-7B-Instruct-1M; the authors report that it develops reasoning skills such as reflection, verification and summarization that are absent from the logic corpus, and generalizes to the math benchmarks AIME and AMC (abstract; §4 "RQ 4"). Seven research questions cover, among others, RL algorithms, SFT against RL, curricula and response length (§4).
- A modified REINFORCE++ with a strict format reward (tags once each, in order) and an answer reward, written after observing reward hacking under earlier rules (§2.2–2.3); training data of about 5K puzzles (abstract; "fewer than 5,000", §3).
- Transfer from a checkable puzzle family to math benchmarks, which are still checkable, with weights trained against a rule-based check; its list of shortcuts the early format rules let through (§2.2) is a catalogue a rule-based reward has to close.

## In plain words

DeepSeek-R1 introduced reinforcement learning with rewards from simple rules that brought out reasoning patterns, but its authors released no training code or data, so this paper's authors ask whether such reasoning can emerge in a smaller model and how to reproduce it (§1). They train on generated Knights and Knaves logic puzzles (which islanders always lie, which always tell the truth) instead of math, because their difficulty can be controlled and their answers checked by rules (§1). A 7-billion-parameter Qwen model is trained on about 5,000 puzzles, rewarded for a correct, well-formed answer and penalized for shortcuts. The authors report that its average accuracy on the puzzles rises from 0.19 to 0.89, against 0.42 for OpenAI's o1 and 0.94 for its o3-mini-high (Tab. 2), and that after 1,500 training steps it solves 125% more problems of the AIME math competition and 38% more of AMC (American Mathematics Competitions) than the starting model (§1; §4 "RQ 4", Fig. 5). They present the work as a study of reasoning dynamics that makes "key technical contributions" to stable training (abstract), and list findings on, e.g., response length, language mixing and fine-tuning against RL (§1).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [policy gradient](#/glossary/policy-gradient) · [PPO](#/glossary/ppo) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [reward hacking](#/glossary/reward-hacking) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization)

**The paper's own terms:**
- **Knights and Knaves (K&K) puzzles** (§2.1): each character is a knight, who always tells the truth, or a knave, who always lies; the task is to say which is which from their statements. Difficulty is set by the number of characters (2–8) and the number of Boolean operators combined (1–4), and the generator guarantees one answer. The puzzles come from Xie et al. (2024) (§1).
- **Format reward and answer reward** (§2.2): the two parts of the reward. Format: +1 when the format is correct, else −1; the rules include, e.g., reasoning inside `<think>` tags and the answer inside `<answer>` tags, each tag "exactly once and in the correct sequential order". Answer: 2 when the answer "fully matches the ground truth", −1.5 for a partial mismatch, −2 when it can't be parsed or is missing.
- **Super OOD** (§4 "RQ 4"): the authors' name for testing the puzzle-trained model on competition math (AIME 2021–2024, AMC 2022–2023).
- **RFT** (§4 "RQ 5"): "Reject sampling Fine-Tuning", the paper's stand-in for supervised fine-tuning (SFT): sample from the starting model, keep "the correct yet the shortest response" by a rule-based best-of-N, and fine-tune on it; a form of [rejection sampling](#/glossary/rejection-sampling).
- **LiMem** (§4 "RQ 5"): the "Local Inconsistency-based Memorization Score", following Xie et al. (2024): accuracy on the training puzzles times (1 − the consistency ratio), the ratio being how many puzzles are still solved after a small change (one statement replaced, or the statements reordered) to how many were solved unchanged. A high score is read as memorization.
- **Cold start** (§1): the paper uses it for starting RL from an instruct model rather than the base model; the glossary's [cold start](#/glossary/cold-start) entry describes the usual sense, a small curated fine-tuning set before RL.
- **Aha moment** (§4 "RQ 3"): from the DeepSeek-R1 report, which the authors read as "the model's sudden acquisition of complex reasoning behaviors".
- **Language mixing** (§4 "RQ 2", §8): Chinese or other non-English tokens inside English reasoning.

**Builds on:**
- DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")): its rule-based RL and reward designs, which Logic-RL adopts (§1).
- REINFORCE++ (a policy-gradient RL algorithm) as the base algorithm (Hu, 2025; not listed here), changed as DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which introduced GRPO, recommends (§1, §2.3).
- Xie et al. (2024), "On memorization of large language models in logical reasoning" (not listed here): the puzzles and the memorization test (§1, §2.1, §4 "RQ 5").
- Chu et al. (2025) and Liu et al. (2025), neither on this site, whose findings on SFT against RL and on the aha moment the authors say theirs agree with (§4 "RQ 5", "RQ 3").

## Problem and setting

- **Questions** (§1): can R1-like reasoning emerge in smaller models, what training data fosters it, and which methods reliably replicate it. Seven research questions follow in §4: RL algorithms, thinking words and language mixing, the aha moment, transfer, SFT against RL, curricula, and response length.
- **Why puzzles** (§1): the authors argue that math sets such as GSM8K and Omni-MATH vary uncontrollably in difficulty, while K&K puzzles allow "controllable difficulty levels and ease of rule-based reward verification".
- **Model** (§3): Qwen2.5-7B-Instruct-1M. Qwen2.5-Math-7B kept writing Python code blocks that often broke the format rules; the base and instruct Qwen2.5-7B models trained almost identically, and the instruct one had "slightly higher test accuracy".
- **Data** (§2.4, §3): 3- to 7-person puzzles, "fewer than 5,000", mixed in difficulty; 2- and 8-person puzzles are also tested (Tab. 2), the 8-person ones as out of distribution.
- **Correct** means a full match with the generator's unique answer (§2.1–2.2).
- **Evaluation**: puzzle accuracy by number of people (Tab. 2); AIME 2021–2024 and AMC 2022–2023 (§4 "RQ 4"). The sampling settings and number of runs behind these scores are not discussed.

## Approach

- **Prompt and reward (§2.2).** The system prompt asks for reasoning in `<think>` tags, then the answer in `<answer>` tags; the authors recommend ending the prompt with a `<think>` tag, which "significantly reduces the difficulty for the base model". Under early rules they saw reward hacking, e.g. skipping the thinking, reasoning inside the answer tag, guessing repeatedly, or reopening the thinking after answering. They tightened the rules until, in their words, "a nearly unhackable, rule-based reward system" remained.
- **RL algorithm (§2.3).** A modified REINFORCE++, a policy-gradient method, chosen because it "demonstrated superior performance compared to GRPO in our experimental setup". Rewards are summed without discounting later ones. Following DeepSeekMath, the KL penalty moves from the reward into the loss, as in GRPO, and uses GRPO's estimator, which "ensures that the KL estimate is always non-negative".
- **Schedule (§2.4, Tab. 1).** 3,600 steps at a constant learning rate of 4×10⁻⁷ and [sampling temperature](#/glossary/greedy-decoding-and-temperature-sampling) 0.7, on mixed 3- to 7-person puzzles; batch size 8, 8 sampled responses per puzzle, KL coefficient 0.001, at most 4,096 response tokens.
- **Analyses (§4).** RQ 5 compares RFT with RL by test accuracy and LiMem; RQ 6 compares [curriculum learning](#/glossary/curriculum-learning), the 3- to 7-person sets in order for one epoch each, with all levels mixed in one epoch.

## Results

- **Puzzles (§3, Tab. 2).** Average accuracy over 2–8 people rises from 0.19 to 0.89; o3-mini-high scores 0.94, DeepSeek-R1 0.81, o1-2024-12-17 0.42 and GPT-4o 0.37. On 8-person puzzles, outside the training range, 0.01 becomes 0.67.
- **Length (§3).** Mean response length grows from about 500 to 2,000 tokens over the first 1k steps, and reflection and exploration of alternatives appear "with no related data in our training set".
- **Math transfer (§4 "RQ 4", Fig. 5).** The number of problems solved at step 1,500 against step 0 rises by 125% on AIME and 38% on AMC (bar labels 2.25x and 1.38x); the authors read this as RL facilitating "the emergence of robust and transferable reasoning strategies".
- **RQ 1 (Fig. 2).** PPO "achieved significant advantages in both accuracy and reward" but was "138% slower than REINFORCE++"; REINFORCE++ beat GRPO "across nearly all metrics", GRPO being the weakest of the three in their experiments.
- **RQ 2 (Fig. 3).** Responses with "verify" or "re-evaluate" scored significantly higher than those without; "recheck" lowered scores, "likely because its use signals the model's uncertainty"; language mixing "significantly decreases reasoning ability".
- **RQ 3 (Fig. 4).** Reflective words rise steadily over the first 1,800 steps, and some complex behaviours appear "even by step 10", so the authors conclude that a sudden aha moment is likely absent.
- **RQ 5 (Fig. 6).** RFT "slightly improves test accuracy at the expense of rapidly increasing" LiMem on the training set, while RL "achieves higher test accuracy with minimal or even negative increase" in it.
- **RQ 6 (Fig. 7).** Curriculum learning "yields slightly higher test scores during intermediate training phases", early differences are "statistically negligible", and "its practical necessity is not conclusively supported".
- **RQ 7 (Fig. 8).** One run's length fell while accuracy and reward rose; another's grew with no gain. The authors say the trends suggest length changes are "likely a byproduct of training dynamics rather than a causal driver of reasoning improvements".
- **Base against instruct (§7, Figs. 9–10).** Nearly the same curves; the base model's length grows faster.
- **Example outputs (§8, Tabs. 3–5).** Hesitation, self-verification, backtracking, formula use, language switching.

## Limits the authors state

- "our findings are based on a small-scale logic dataset", and generalization "to large-scale real-world mathematical or coding scenarios remains to be explored" (§5).
- Qwen2.5-Math-7B's code blocks often conflicted with the format rules, and despite mitigations "it remained challenging to fully address" (§3).

## Open problems and building blocks

  - "extending our approach to more diverse and complex datasets to further validate its effectiveness and robustness" (§5).
  - Turning long responses into shorter ones for token efficiency, since lengths "can expand by up to four times" (§5 "Chain-of-Thought Long to Short Methods").
  - Stabler RL: the authors found it "beneficial in some cases to eliminate KL constraints, especially when starting from a strong foundation model", and a higher temperature early "appears to provide the model with a more diverse starting point"; they plan to study how an SFT stage affects RL (§5 "Stablize RL Training").
  - Whether code-switching, or even random token switching, could aid reasoning (§5 "Mixed-Language Reasoning"), and "the need for a language consistency penalty in reward modeling" (§1).
  - "it remains an open question whether an entirely unconstrained or latent approach might yield better results" than the `<think>` format (§5 "Relaxing the Formatting Constraints").
- **Released:** the published text links no code or data; a title-page footnote calls the work an "Open-Source Research Project", and §5 says it will remain an open research project.
- **To reuse it:** a 7B instruct model (Qwen2.5-7B-Instruct-1M), the K&K puzzles of Xie et al. (2024), REINFORCE++ with the §2.3 changes, and the Tab. 1 settings (§2–3). Hardware, run time and cost are not stated.
- **Beyond its domain:** the authors say the math gains suggest "that RL-trained reasoning heuristics develop abstract problem-solving schemata rather than relying on domain-specific pattern matching" (§1), and that this "highlights RL's potential to generalize beyond their training environment" (§4 "RQ 4").

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
