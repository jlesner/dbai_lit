# Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory

**Dynamic Cheatsheet** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2504.07952) · [arXiv](https://arxiv.org/abs/2504.07952)  
Code: [dynamic-cheatsheet](https://github.com/suzgunmirac/dynamic-cheatsheet)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A persistent, evolving memory of strategies and code snippets reused across problems at test time.
- Curated by the model itself, without ground-truth labels (§2.1.2).
- Memory across problems; an ACE baseline.

## In plain words

Language models usually answer each question on its own and keep nothing from earlier attempts, so they rediscover the same solutions and repeat the same mistakes (abstract, §1). The authors build Dynamic Cheatsheet, a framework that gives an unchanged model, used through its API, a memory written in plain text. Around each question the model itself decides which strategies and code snippets to store, revise or drop, without being shown the correct answers (§2). They test it on maths competition problems, arithmetic puzzles and science and engineering quizzes. With the retrieval variant, GPT-4o solves 99% of Game of 24 puzzles once it stores and reuses a Python brute-force solver, against 10% with a plain prompt and 19% with the same detailed prompt but an empty memory (§4.1). Under the cumulative variant, Claude 3.5 Sonnet's accuracy on the 2024 AIME maths exam more than doubles against a plain prompt (§1). The authors present it as "a simple and intuitive framework" (§1) compared against four baselines, not as a first.

## Background and terms

**Terms to know:** [test-time training](#/glossary/test-time-training) (weight-updating methods the paper contrasts itself with, App. A.1) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [curriculum learning](#/glossary/curriculum-learning) (proposed for the order of test questions, §4.6).

**The paper's own terms:**
- **Dynamic Cheatsheet (DC)**: an external, "non-parametric" memory (text outside the model's weights) that "evolves in tandem with the LLM's inference process" (§2). The authors used "cheatsheet" and "memory" interchangeably "during the initial phases of our experiments" and write the memory at step i as M_i (Fig. 13 caption).
- **Test-time learning**: a model "updates its predictions by incorporating information seen during inference" without full offline fine-tuning (App. A.1); DC uses no weight update (§2).
- **Generator (Gen), curator (Cur), retriever (Retr)**: the three roles. Generation and curation "can easily operate on top of the same LM (prompted differently) or on separate LMs" (§2.1); the experiments use "the same black-box LLMs" for both. The retriever ranks past inputs by cosine similarity to the current query (Fig. 3 caption).
- **DC-Cu (DC-Cumulative)**: answer with the current memory, then update it (Eqs. 1–2, §2.1).
- **DC-RS (Retrieval & Synthesis)**: retrieve the most similar earlier questions with the model's own earlier answers, let the curator update the memory with them, then answer (Eqs. 3–5, §2.2).
- **Baselines** (§2.3): **BL**, a plain prompt "with minimal instructions"; **DC-∅**, the DC answer prompt with an empty memory, called "a strong baseline"; **FH** (full history), all earlier questions and answers appended without curation; **DR** (dynamic retrieval), the most similar earlier pairs pasted in verbatim, without curation.
- **Soft Match (SM)** and **Functionally Correct (FC)**: SM accepts a match to the reference up to punctuation or whitespace (multiple-choice sets); FC checks whether the output satisfies the task's constraints (Game of 24, Math Equation Balancer, AIME) (§3.3.1).

**Missing glossary terms:**
- **Online learning**: learning from inputs that arrive one at a time, updating after each. The paper calls its setting "a typical setting in online learning" (§2.1.1) and test-time learning "also referred to as online or incremental learning" (App. A.1).

**Builds on:**
- Feedback loops that correct a solution: Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Self-Refine, Meta-Prompting, TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")). DC "differs by focusing explicitly on storing generalizable heuristics" reused across tasks (App. A.1).
- Memories of reasoning: Thought-Retriever (stores past chains of thought) and Buffer-of-Thoughts (distils "thought templates") (App. A.3).
- Inference-time compute: Tree of Thoughts ([Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")) and majority voting ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), "typically ephemeral" across questions (App. A.2); Game of 24 is cited to both Tree of Thoughts and Meta-Prompting (§3.1).
- Set against test-time weight updates and retrieval from a fixed corpus (§1, App. A.1, A.3).

## Problem and setting

- **Question:** can a black-box model improve across a sequence of test questions, drawn from one unknown distribution (§2.1.1), by curating its own memory, "without needing explicit ground-truth labels or human feedback" (abstract) and without weight updates (§2)?
- **Correctness:** the curator "does not have access to ground-truth labels" and must judge correctness itself (§2.1.2). Final answers are extracted from `<answer>` tags and scored against references (§3.3).
- **Benchmarks** (§3.1):
  - AIME 2024 (30 questions), AIME 2025 (30) and AIME 2020–2024 (133), from the American Invitational Mathematics Examination, a high-school maths competition;
  - GPQA-Diamond: 198 expert-validated natural-science questions, multiple choice;
  - Game of 24: 100 puzzles, combine four given numbers, each used once, into an expression equal to 24;
  - Math Equation Balancer: 250 expressions the authors compiled; insert the operators in e.g. "1 ? 2 ? 3 = 6";
  - MMLU-Pro Engineering and Physics, described as "A professional-level subset of the MMLU benchmark" (a multiple-choice exam benchmark): 250 questions sampled from each.
- **Models** (§3.2): Claude 3.5 Sonnet and GPT-4o; their smaller versions Claude 3.5 Haiku and GPT-4o-mini; reasoning models DeepSeek R1 and o1 (§5).
- **Tools:** the answer prompt "explicitly encourages Python code generation and execution for computational tasks" (Fig. 13 caption), with a Python interpreter only (§4.4).

## Approach

- **Generation and curation** (§2.1): the generator answers from the question and the current memory (Eq. 1); the curator then rewrites the memory from the old memory, the question and the answer (Eq. 2). It mainly weighs whether the answer is correct or generalizable enough to distil, whether an entry is wrong or superseded and should be updated or removed, and whether the memory stays compact. One model does this in the experiments; in practice, the authors add, it "can be implemented as a series of steps that instruct multiple tools and models" to verify solutions.
- **DC-RS** (§2.2) addresses "two potential drawbacks" of DC-Cu: it curates before answering, and it retrieves the k most similar past questions, embedded with OpenAI's `text-embedding-3-small` model, with their answers; k = 3, and 5 and 7 were initially considered, "but the gain was insignificant" (§2.2 footnote).
- **Curator prompt** (Figs. 14–15): keep reusable code and heuristics in sections, replace a strategy when a better one appears, keep a usage counter.

## Results

The authors report accuracy in %:

- **Game of 24** (Tab. 1, §4.1): GPT-4o 10 (BL) → 19 (DC-∅) → 99 (DC-RS); early in the sequence it found a Python brute-force solver, stored it and reused it (Fig. 5). Claude 3.5 Sonnet "showed marginal gain".
- **AIME** (Tab. 1, §4.2): Claude under DC-Cu rises from 23.3 to 50.0 on AIME 2024 and from 6.7 to 36.7 on AIME 2025, against 36.7 and 23.3 with DC-∅. GPT-4o does best under DC-RS on all three AIME sets.
- **GPQA-Diamond** (Tab. 1, §4.2): Claude 59.6 (BL), 60.1 (DC-∅), 63.6 (DR), 68.7 (DC-RS); retrieval alone helps and the further jump "highlights how memory curation and synthesis can yield additional benefits". GPT-4o gains little; retrieval "can, in some cases, introduce confusion".
- **Math Equation Balancer** (abstract, Tab. 1): both models reach near-perfect accuracy by reusing stored code, where their baselines "stagnated around 50%".
- **MMLU-Pro** (§4.2): Claude shows "consistent gains"; GPT-4o shows "slight decreases from the baseline".
- **Curation vs full history** (Tab. 2, §4.3; FH run only on AIME 2024 and 2025): Claude reaches 26.7 on AIME 2024 with FH against 50.0 with DC-Cu; GPT-4o with FH falls below its plain-prompt baseline.
- **Smaller models** (Tab. 3, §4.5): Claude 3.5 Haiku rises from 10.0 to 36.7 on AIME 2024 under DC-Cu, with weaker AIME 2025 gains; GPT-4o-mini under DC-Cu and DC-RS falls below its baseline on AIME 2024.
- **Majority voting** (Tab. 4, §5; Claude 3.5 Sonnet only): on AIME 2024 and 2025, voting over three plain-prompt answers gives no gain; DC-Cu scores higher.
- **Efficiency** (§5 "Time and token complexity"): although DC curates after each query, the authors state it "optimizes efficiency over time by reducing redundant computation and token usage".
- **Figures**: Claude's cumulative GPQA-Diamond accuracy "steadily improves" (Fig. 7); correct and incorrect answers "often cluster" by question embedding (Fig. 10).

## Limits the authors state

- "DC is not a panacea": smaller models "benefit from DC in limited amounts", and DC "can amplify the strengths of models that can already produce high-quality outputs, but not fix foundational gaps in reasoning" (§1).
- In small models the stored knowledge "consists mostly of incorrect or partial attempts", and they "often fail to retrieve the most relevant past solutions or misapply retrieved knowledge" (§4.5).
- DeepSeek R1 and o1 "showed minimal or inconsistent improvements"; memory transfer to smaller models gave "mixed results" (§5).
- "faulty heuristics that slip into memory can be equally amplified" (§5 "Clustering of errors and corrections").
- Models sometimes abbreviate the memory ("Previous content [...] preserved") instead of rewriting it, which "can reduce the quality of stored heuristics over time" (§5 "Long-context generation versus understanding").
- Poorly filtered retrieval "can introduce confusion", particularly with highly diverse or loosely related queries (§5 "Retrieval bottlenecks and noise").
- "the initial cost of discovering a robust approach and curating it remains non-trivial" (§5 "Reasoning and information efficiency"), and the sequential structure "poses challenges for large-scale parallel or batch tasks" (§5 "Time and token complexity").
- Zero-shot chain of thought was left out as it "did not yield any gains" in preliminary runs (§2.3 footnote).

## Open problems and building blocks

  - A curator made of several steps, tools and models that verify solutions (§2.1.2).
  - Suggested only, not tested: related questions early "may accelerate and improve" test-time learning; "curriculum-style" ordering, simpler or archetypal problems first, "may potentially bootstrap performance" (§4.6).
  - A "broader suite of tools" than Python (§4.4).
  - A structured external database instead of regenerated memory; per-topic memories; better retrieval (§5).
- **Released:** the abstract footnote: "We release all our data, results, and code"; a §3.1 footnote: "We release all the original input-output pairs in our codebase".
- **To reuse it:** a black-box LLM API for generator and curator, a Python interpreter (§4.4), an embedding model for DC-RS (§2.2), the prompts of App. B.4 (Figs. 12–15), questions processed in sequence (§5), and a base model that can "produce correct solutions with sufficient frequency" (§4.5). Tokens: on AIME 2024 Claude averaged 370 with BL, 494 with DC-∅, 1035 with DC-RS and 1831 with DC-Cu (§5 footnote).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
