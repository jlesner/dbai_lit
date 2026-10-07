# SELF-DISCOVER: Large Language Models Self-Compose Reasoning Structures

**Self-Discover** · NeurIPS 2024

Read: [PDF](https://arxiv.org/pdf/2402.03620) · [arXiv](https://arxiv.org/abs/2402.03620) · [DOI](https://doi.org/10.52202/079017-4004)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The model selects, adapts and composes reasoning modules into an explicit reasoning structure once per task, then follows it on every instance of the task (abstract; §2).
- Seed only: meta-prompts and a few task examples without labels, no scores (§2.1); the reasoning modules are adopted from Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)"); App. A, Tab. 2).
- A frontier model writing the structure a weaker model follows: GPT-4's structures on Llama2-70B score 52% against CoT's 42% on one BBH task, and the authors report Llama2's own structures were low-quality (§5.2 and footnote); its "universally applicable" claim rests on six task-transfers.

## In plain words

Prompting methods such as chain of thought or splitting a problem into subproblems each assume one fixed way of reasoning; the authors argue instead that "each task has a unique intrinsic structure underlying the reasoning process" (§1). Self-Discover has the model write that structure itself, once per task: from a list of generic problem-solving hints and a few task examples without answers, it picks the useful hints, rewrites them for the task, and turns them into a step-by-step plan in a JSON-like format; the model then fills in that plan for every question (§2). With PaLM 2-L, the authors report that it beats chain of thought on most of 25 reasoning tasks, without any training labels (§1). On two tasks with GPT-4 it scores higher than sampling-and-voting methods while needing 10 to 40 times fewer model calls per question (§4.3). They also report that structures written by one model help another, and call them "universally applicable across model families" (abstract). They present Self-Discover as "the missing piece in the prompting literature" (§6.1), not as a first.

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [exact match](#/glossary/exact-match)

**The paper's own terms:**
- **reasoning module (RM)**: a natural-language description of a general problem-solving heuristic, such as "Critical Thinking" or "Let's think step by step"; the paper uses 39 of them, adopted from Promptbreeder (§2; App. A, Tab. 2).
- **reasoning structure**: a task-specific plan in key-value pairs "similar to JSON"; the model solves an instance by filling in the value of each key step by step (§2, Fig. 2).
- **meta-prompt**: here, the prompt for one of the three Stage 1 actions; it holds an instruction, reasoning module descriptions and task examples without labels, and no scores, unlike OPRO's (App. A, Fig. 10).
- **SELECT, ADAPT, IMPLEMENT**: the three actions of Stage 1 (§2.1). Ablation labels: -S (SELECT only), -SA (SELECT and ADAPT), SAI (all three) (§5.1).
- **Stage 1 / Stage 2**: Stage 1 runs once per task (the "task-level") to discover a structure; Stage 2 uses it on every instance (§2).
- **Majority voting of each RM** and **Best of each RM**: baselines that apply every module separately and vote, or pick the module with the highest accuracy using "oracle labels" (true answers) (§3.3).
- **universality / transferability**: the authors' names for applying structures discovered by one model to another model's decoding (§5, §5.2).

**Builds on:**
- Prompting methods the authors say each serve as "an atomic reasoning module": chain of thought, decomposition-based prompting such as least-to-most, and step-back prompting (§1); the two-stage design takes inspiration from how humans "devise a reasoning program" (Newell et al. 1958; Rasmussen 1983; §2).
- Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")), a method that evolves task prompts, the source of the 39 reasoning modules (App. A, Tab. 2).
- The baselines: direct prompting, zero-shot chain of thought, Plan-and-Solve (prompting the model to first plan, then solve), and chain of thought with self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")) (§3.3).
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), a prompt optimizer that needs a training set, compared in the transfer tests (§3.3, §5.2).

## Problem and setting

- **The question:** can an LLM compose a task-specific reasoning structure from generic modules, with no labels, and does following it improve reasoning efficiently (§1, §4)?
- **Tasks (§3.1):** BIG-Bench Hard (BBH), 23 "carefully-selected challenging tasks" from the BIG-Bench benchmark, which the paper groups into four categories after the BBH authors; Thinking for Doing (T4D), a "grounded social agent reasoning task" where the model must use mental state reasoning to choose an action; and 200 examples sampled from the test set of MATH, a benchmark of math problems. For MATH only, structures are generated per instance "via a one-shot demonstration" (§3.1).
- **Models (§3.2):** GPT-4 (gpt-4-turbo-preview), GPT-3.5-turbo (accessed October–December 2023, footnote 1), instruction-tuned PaLM 2-L, and the open-source Llama2-70B. For MATH, a PaLM 2-L with "stronger instruction tuning" is used (footnote 2).
- **Inputs to Stage 1:** the module list, a few task examples without labels, and, for IMPLEMENT, a human-written structure for another task (§2.1).
- **What counts as correct:** accuracy with exact matching; models end with "Thus, the final answer is [X]", and the authors extract answers with hand-designed heuristics per task, checking the MATH answers by hand (App. B). A structure is "correct" if "a human expert can solve the task by simply following the reasoning structure" (App. D).

## Approach

- **Stage 1 (§2.1, Fig. 3, Eqs. 1–3):** three calls to the same model, each with its own meta-prompt (App. A, Fig. 10).
  - SELECT picks the modules useful for the task from the full list, given the unlabeled examples.
  - ADAPT rephrases each selected module to fit the task, e.g. "break the problem into sub-problems" becomes "calculate each arithmetic operation in order" for arithmetic.
  - IMPLEMENT turns the adapted descriptions into a key-value plan "with specified instruction on what to generate for each step", shown a human-written structure for another task as a demonstration.
- **Stage 2 (§2.2, App. A):** the structure is appended to every instance after a fixed instruction beginning "Follow the step-by-step reasoning plan in JSON to correctly solve the task", and the model fills in the values to reach an answer.
- **Why JSON:** "due to interpretability and findings on following JSON boosts reasoning and generation quality" (§2).
- **Cost:** one call per instance, plus three task-level calls (§4.3, Fig. 5; on MATH structures are made per instance, §3.1); the authors acknowledge the inputs and outputs are longer than with chain of thought (Fig. 5 caption).

## Results

All results are the authors' claims; the baselines are zero-shot prompting methods (§3.3).

- **Main table (Tab. 1):** Self-Discover against chain of thought: with PaLM 2-L, 67% vs 60% on BBH, 69% vs 40% on T4D, 50.5% vs 42% on MATH; with GPT-4, 81% vs 75%, 85% vs 52%, and 73% vs 71%. Plan-and-Solve and direct prompting score lower than Self-Discover in every cell. The authors call the MATH gain "moderate" (§4.1).
- **T4D (§4.1):** the authors report it "significantly outperforming" Foresee and Reflect (FaR), an earlier prompting method "which employs an expert-designed reasoning structure", while Self-Discover builds its structure "without human interventions".
- **Per task (Fig. 1, App. C Tab. 3):** with PaLM 2-L, better than direct answering and than chain of thought on most of the 25 tasks (Fig. 1 caption).
- **By category (§4.2, Fig. 4):** with PaLM 2-L it improves over direct answering and chain of thought in all four BBH categories, most on tasks needing world knowledge (e.g. sports understanding, movie recommendation) and moderately on algorithmic ones.
- **Cost against accuracy (§4.3, Fig. 5):** on two BBH tasks (movie recommendation, geometric shapes) with GPT-4, Self-Discover scores higher than chain of thought with self-consistency (10 samples) and majority voting of each RM (40 calls per instance), while "requiring 10-40x fewer inference compute" in the words of the abstract. Best of each RM, which needs gold labels, is plotted for comparison.
- **MATH error analysis (§4.1, App. D, Tabs. 4–5):** the authors' manual annotation judged most PaLM 2-L structures correct; of the wrong predictions, 74.7% come from errors in intermediate calculations rather than from wrong structures.
- **Ablation (§5.1, Fig. 8):** with GPT-4 on four tasks, the authors report that zero-shot accuracy improves "consistently across tasks" with each added action, and all three (SAI) give the most gain.
  - Structures discovered by PaLM 2-L and used by GPT-4 beat OPRO prompts optimized on PaLM 2-L on 3 of 4 tasks, "despite that OPRO used 20% data to optimize the prompt".
  - Structures discovered by GPT-4 lift Llama2-70B on disambiguation QA to 52% from chain of thought's 42% (zero-shot), and GPT-3.5-turbo on geometry to 56% from 51% "with 3-shot demonstration from structured reasoning process".
  - The conclusion states that the structures are "universally transferable between LLMs" (§7).
- **Human comparison (App. E, Fig. 11):** in a case study on the BBH navigation task, human-written and model-written structures share traits such as a mental note after each movement.

## Limits the authors state

- Self-Discover's "input and output are longer than CoT and Direct prompting, increasing cost" (Fig. 5 caption).
- Gains are moderate on MATH and on the algorithmic BBH category (§4.1, §4.2); most MATH failures are calculation errors (App. D).
- Some generated structures are wrong: the model "misunderstands the task, or makes an error in one of the steps or adds unnecessary steps" (App. D, Tab. 4).
- Llama2 wrote low-quality structures itself: "We tried zero-shot meta prompting Llama2 but observed low-quality structure outputs" (footnote 3).
- The baselines that use the seed modules, and self-consistency, are compared only on a subset of tasks (§3.3), self-consistency "due to the cost of repetitive queries" (§3.3); §4.3 uses two BBH tasks.
- Extracting MATH answers was "challenging", so the authors subsampled 200 test examples and checked them by hand (App. B).

## Open problems and building blocks

  - "future improvements should aim at improving the step-wise calculation accuracy of LLMs, such as using tools or code generation" (App. D).
  - More work "on structured reasoning for solving challenging problems using LLMs" (§1) and on "potentials for Human-AI collaboration" (§7; App. E).
- **Released:** Nothing stated. App. A prints the 39 modules (Tab. 2), the meta-prompt layouts (Fig. 10) and the Stage 2 instruction.
- **To reuse it:** a model that can follow structured plans (for MATH the authors use a PaLM 2-L with stronger instruction tuning, footnote 2); a few unlabeled examples per task; a human-written example structure for another task (§2.1); three task-level calls plus one per instance (§4.3).
- **Beyond its domain:** the conclusion calls it a framework to "self-discover a reasoning structure for any task from a seed set of general problem-solving skills" (§7); §6.2 contrasts it with methods that induce one structure per dataset, since real user queries "can be diverse covering various reasoning structures".

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
