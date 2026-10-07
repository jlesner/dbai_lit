# The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs

**The Illusion of Diminishing Returns** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2509.09677) · [arXiv](https://arxiv.org/abs/2509.09677)  
Code: [measuring-execution](https://github.com/long-horizon-execution/measuring-execution)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures long-horizon execution with the knowledge and plan given, so only execution can fail (abstract).
- Shows per-step accuracy falling as steps accumulate, partly through "self-conditioning" on the model's own earlier errors, alongside long-context effects (abstract; §3.2, Result 3).

## In plain words

LLMs that solve hard reasoning problems can fail when a simple task is made longer. They ask whether this is a failure to reason or to carry out a known plan, and whether short-task benchmarks give an "illusion of slowing progress" (abstract). Their argument: if every step must succeed, small gains in per-step accuracy can compound into a much longer task a model can finish, once that accuracy is already high (§1, §2.1). To measure execution alone, they give the model plan and knowledge: a word-to-number dictionary, and words whose values it must keep summing (§2.2, §3).

They report that larger models keep the total right for many more turns even when small models get the first step almost always right, and that accuracy per turn falls over the task, partly because models make more mistakes when their own earlier mistakes are in the context (abstract). Bigger models do not reduce this effect; thinking before answering mitigates it (abstract). In one turn without step-by-step reasoning, DeepSeek-V3 fails at four steps while its thinking version R1 does over 100 (§1).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning); the other field terms are not in the glossary yet and are defined below.

**The paper's own terms:**
- **Planning, execution, knowledge**: deciding which steps to take and in what order; carrying out those steps; information about the kinds of steps and how to combine them (§2, "Key Terms").
- **Retrieve-then-compose step**: one step in which the model looks something up and combines it with its current state (§2.2).
- **Turn**: one exchange with the model; it may hold several steps. **Turn complexity (K)**: steps per turn; in the task, words per turn (§2).
- **Step / turn accuracy**: the fraction of samples whose update from one step (or turn) to the next is correct, whether or not the state before it was correct. **Task accuracy**: the fraction that complete a task of a given length with no mistake (§2, "Evaluation Metrics").
- **Horizon length**: the first task length at which mean task accuracy drops below a chosen success rate, one half unless stated (§2).
- **Self-conditioning**: the model "conditions on its own past mistakes" and becomes more likely to err after seeing its own earlier errors (§3.2).
- **Induced error rate / healed history**: the fraction of earlier answers the authors replace with wrong ones; a healed history has none (§3.2, Fig. 5).
- **Thinking models vs chain-of-thought (CoT) prompting**: thinking models are trained with reinforcement learning to reason before answering, and here their reasoning is removed from the history; CoT prompting asks a standard model to reason step by step, and its reasoning stays in the history (§3.2, App. G.3).

**Missing glossary terms:**
- **Long-context degradation**: worse performance as the input grows longer, whatever it contains (§3.2).

**Builds on:**
- Shojaee et al. (2025), which claims thinking models give only an "illusion of thinking" as they fail when tasks get longer; this paper argues those failures are in execution, since the models there know the plan (§1).
- Kwa et al. (2025), from the AI-evaluation group METR, whose horizon length on software engineering tasks this paper adapts, with the same 50% success threshold (§2, §2.1).
- LeCun (2023), whose assumptions the two of §2.1 are "similar to" (§2.1).
- Zhou et al. (2025a), GSM-Infinite, a synthetic benchmark of reasoning over growing context, cited for long-context degradation, the explanation the paper separates from self-conditioning (§3.2).
- None is on this site.

## Problem and setting

How many steps can an LLM reliably execute when planning and knowledge are given (§1)? The hypothesis: "Even if planning and world knowledge are perfected, LLMs will still make mistakes in execution over a long-horizon." (§2).

- The prompt holds a dictionary from common five-letter English words to whole numbers drawn uniformly from −99 to 99, with few-shot examples (§3, App. G.1–G.2).
- Each turn gives K words; the model must add their values to the previous total (starting at 0) and output the new total. Task length is turns times K (§2.2, §3).
- Models: the Qwen3 (4, 8, 14, 32B) and Gemma3 (4, 12, 27B) families, and frontier models through OpenRouter, a service that routes requests to many hosted models (§3.1, §3.3, App. G.5). 100 samples per Qwen3 and Gemma3 experiment, 20–50 for frontier models because of cost (App. G.1).
- A format error counts as an error (App. H).

## Approach

**The compounding argument (§2.1).** Assume each step succeeds with the same probability, independently, and that the model never self-corrects, so one error fails the task. Then Prop. 1 gives the horizon length at a success rate as the logarithm of the success rate divided by the logarithm of the step accuracy, rounded up (derivation in App. J). The authors call it "illustrative" and say it applies to any long-horizon task (§2.1). They draw:
- horizon length grows hyperbolically with step accuracy, sharply beyond 80% step accuracy (§2.1, Fig. 2);
- near perfect accuracy, the horizon gain from a fixed accuracy gain grows quadratically as step accuracy approaches 1 (App. J.1);
- exponential growth of horizon length over time needs only step-accuracy gains that shrink, "a diminishing function" (§2.1, Fig. 1).

**Isolating execution (§2.2, Fig. 3).** A word is one step of the plan; its value is the retrieved knowledge or tool output.

**Experiments.**
- Many turns, one word each, answering directly without reasoning tokens (§3.1).
- A counterfactual on the chat history: replace earlier answers to set an error rate from 0% to 100%, and measure accuracy at turn 100. A drop with a correct history is attributed to long context; a drop that grows with the error rate supports self-conditioning (§3.2).
- Single-turn length: binary search for the largest K a model sums with at least 80% accuracy (§3.3).

## Results

- **Execution alone is hard (§3.1, Fig. 4).** All models except Gemma3-4B and Qwen3-4B are near-perfect on the first step, yet task accuracy falls fast; the best, Qwen3-32B, falls below 50% within 15 turns.
- **Model size (§3.1, Fig. 4b).** Horizon length rises clearly with size; with at most four sizes per family the authors fit no scaling law, but say "the improvements do not seem diminishing". [Majority voting](#/glossary/self-consistency-majority-voting) over parallel samples matched to CoT's token count matches neither a larger model nor CoT (App. D, Figs. 10b and 11, Gemma3-12B).
- **Self-conditioning (§3.2, Fig. 5).** With a correct history, turn-100 accuracy is below its initial value; as injected errors rise it falls further. Frontier non-thinking models above 200B parameters (Kimi-K2, DeepSeek-V3, Qwen3-235B-Instruct-2507) are near-perfect at turn 100 on a healed history but still degrade; the Fig. 5 caption says scaling model size "increases self-conditioning".
- **Thinking (§3.2, Fig. 6).** Qwen3 thinking models do not self-condition: turn-100 accuracy is stable at every error rate. The authors suggest RL training, or the removal of earlier reasoning from the history, as reasons. CoT prompting with generated traces does not remove it in Gemma3 (App. I, Fig. 17).
- **Fixes (App. C).** A sliding window, keeping only the most recent turns in the context, "indeed mitigates self-conditioning" (§3.2; App. C.2, Fig. 10a, Gemma3-12B). Self-verification prompting helps Gemma3 with CoT early, then collapses faster as outputs fill the context; Qwen3 thinking models gain negligibly (App. C.1, Fig. 9).
- **One turn (§3.3, Fig. 7).** Without CoT, Qwen3-32B, Gemma3-27B, DeepSeek-V3 and Kimi K2 fail beyond a turn complexity of six. With thinking, GPT-5 reaches 2176 steps against Claude-4 Sonnet's 432, Grok 4's 384 and Gemini 2.5 Pro's 120. Qwen3-Next, which combines another layer type, Gated DeltaNet, with standard attention, beats larger standard-attention models, "hinting" that architecture matters. In the matrix variant, models without CoT or thinking fail even very short chains (App. B, Fig. 8).
- **Realistic agents (App. A).** From annotated failed trajectories, the authors estimate the share of failures similar to self-conditioning at roughly 20% for GAIA (general-assistant questions), 48% for ALFWorld (text-based household tasks) and 33% for WebShop (simulated shopping) (one estimate, compared across benchmarks).
- **Where errors arise (App. F, Fig. 15).** Retrieval alone and addition alone are near-perfect; a running sum of given numbers degrades slowly; the authors say this suggests state management is the main source.
- Format errors are not the main failure (App. H); trends hold at temperature 0 and with thinking (Figs. 13–14).

## Limits the authors state

- The task is synthetic: improvement on it is "necessary, but not sufficient for long-horizon execution on real-world tasks"; it lacks the many possible actions, varying action accuracy and multiple correct plans of real agentic tasks (§5 "Limitations").
- The results "are observations about current LLMs, and not inherent properties of transformers", and might change with task-specific fine-tuning (§5).
- The single-turn task is in theory parallelizable inside a transformer, so that study "is not future-proof"; the multi-turn experiments are unaffected (§5; App. B).
- Task accuracy does not account for self-correction (§5).
- In realistic tasks, step correctness is subjective to determine, limiting App. A as a quantitative study (App. A).
- Faithful CoT self-conditioning tests are hard (context length, unfaithful injected traces), so the analysis covers non-thinking and thinking models (App. I).
- The sliding window relies on the task being Markovian (each turn needs only the current total), so suits only tasks without long-range dependencies (App. C.2, Fig. 10).

## Open problems and building blocks

  - Self-correction is "a promising direction" where mistakes are acceptable and easy to undo (§5).
  - Context management that keeps errors out of the context is "a promising direction for improving long-horizon reliability in LLM agents" (App. C.2).
  - More inherently sequential tasks to future-proof the benchmark (§5; App. B).
  - Empirical scaling laws for horizon length in agents (§4); "a clear opportunity to improve current open-weight models" (§3.3).
- **Released:** the title block links "Code" and "Dataset"; the reproducibility statement says source code, data-generation scripts and exact datapoints are in the supplementary material (§ "Reproducibility Statement").
- **To reuse it:** examples are generated programmatically, which the authors call "contamination-free" (§3.3); open models ran on 4 NVIDIA A100 GPUs, frontier models through OpenRouter (App. G.5).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
