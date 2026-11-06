# ArbiGraph: Composing Arbitrary Verifiable Tasks for Agent Evaluation

**ArbiGraph** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.20764) · [arXiv](https://arxiv.org/abs/2607.20764)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A framework that composes problems with verifiable answers (math, predicting Python output, RLVE algorithmic tasks, HotpotQA questions) into graphs of dependent tasks: to get a task's input the agent reports its prerequisites' answers to a tool, which returns the intended input if they are correct and otherwise an alternative input whose verified answer differs, so no conversion between task types is needed (abstract; §2.1–2.2; §2.4).
- Runs three open-weight models on the same problems alone and in 18-task chain, braid and fan-out/fan-in graphs, against an independent-error baseline (the product of the isolated accuracies of the target task and every task it depends on), then shuffles the task order, cuts branches the target doesn't need, and mixes categories (abstract; §3; §4.2–4.5; § "Reproducibility Statement").
- A direct test of the product-of-step-rates arithmetic of long jobs, with a verified answer at every node: the authors report target accuracy below that baseline in every condition, by 45.0 points averaged over topologies and categories for Gemma-4-31B-it (abstract; §4.2), the opposite sign to the chains of [APIFlow-Bench](#/papers/wan2026apiflowbench "APIFlow-Bench: Measuring Whether Agents Survive Long, Dependent API Workflows (2026)"). The checked intermediate answers locate where each failed run first goes wrong (§3, §4.2). Bears on [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability).

## In plain words

Agents built on language models must often solve a series of problems and keep earlier answers as the work grows; the authors argue that scoring problems one at a time "does not show how well agents retain and use earlier answers" (abstract). Their framework, ArbiGraph, joins problems with checkable answers (math, predicting what Python code returns, and others) into graphs of dependent tasks. To get a task's input, the agent reports the answers it depends on: correct reports unlock the intended input, a wrong one yields another input with a different checked answer, so tasks of different kinds connect without converting one's output into another's input (abstract; §2). Three open-weight models solved the same math and Python problems, chosen because each model solved them reliably alone (§6), both alone and inside 18-task graphs. Averaged over three graph shapes and both categories, final-task accuracy fell below the product of the isolated accuracies of that task and all it depends on by 45.0, 35.6 and 11.0 percentage points for Gemma-4-31B-it, Qwen3.8-27B and GPT-OSS-120B (abstract). The authors present a method, a framework and an evaluation (§1), claiming no first.

## Background and terms

**Terms to know:** [tool calling](#/glossary/tool-calling-function-calling) · [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [output and input prediction](#/glossary/output-and-input-prediction) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [exact match](#/glossary/exact-match) · [Wilson score interval](#/glossary/wilson-score-interval) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [Jeffreys interval](#/glossary/jeffreys-interval)

**The paper's own terms:**
- **instance, topology, target** (§2): an instance is one generated graph with a task at each node; its topology is the nodes and the dependency edges, each pointing from a prerequisite to a task that needs its answer; the target is the node whose answer alone sets the score. A **benchmark configuration** (topology, task pool, target, sampling rule) defines the possible instances.
- **intended input, alternative-input bank, answer comparator** (§2.1): each task stores its intended input and verified answer, a bank of other valid inputs whose verified answers differ from it and from one another, and a comparator that decides whether answers match: "it can require exact equality or allow a numerical tolerance". The agent does not see the stored answers.
- **parents, ancestors** (§2.2, §3): a node's direct prerequisites; every task the target depends on, directly or not.
- **`get_input`, `submit_answers`** (§1, §2.2): the tools that take reported parent answers and return an input, and that take the target answer for grading.
- **independent-error baseline, additional loss** (§3 "Metrics"): the product, over the target and its ancestors, of each problem's accuracy when run alone, averaged over instances; additional loss is that baseline minus measured target accuracy.
- **chain, braid, fan-out/fan-in, shuffled braid** (Fig. 3; §3 "Topologies"): 18-node shapes with one starting task and every other task an ancestor of the target: a single line, parallel strands with crossing edges, and one start feeding 16 tasks that all feed the target. The shuffled braid renumbers the braid's tasks, so some prerequisites are listed after the tasks that need them.
- **branch pruning** (§3; Tab. 2): cutting braid edge 1 leaves eight tasks unnecessary for the target but sharing its start ("Shared root"); cutting edge 2 too disconnects them ("Disconnected").
- **mixed instance; direct and adjusted difference** (§4.5): a math-only instance with nine non-target nodes swapped for Python, RLVE (generated algorithmic problems) and HotpotQA (multi-hop reading questions) tasks; the adjusted difference subtracts the baseline's change from the direct difference (mixed minus math-only target accuracy), which "removes the effect of the replacement tasks' difficulty".

**Missing glossary terms:** none.

**Builds on:**
- Compositional GSM (Hosseini et al., 2024), which puts one grade-school math problem's answer into a second and "finds accuracy below the product of the two isolated accuracies"; the authors "extend this baseline to graphs of 18 problems" (§5).
- Its task sources: RLVE-Gym (Zeng et al., 2026b; "Reinforcement Learning with Adaptive Verifiable Environments", §1), HotpotQA (Yang et al., 2018), a multi-hop question benchmark, and the LeetCode Dataset of coding problems (§2.4).
- Composition by passing outputs on, RACES (Xiang et al., 2026), Composition-RL (Xu et al., 2026) and h1 (Ivanova et al., 2026), which "require compatible formats or conversions between them" (§5; §2.3).
- Long-context and long-horizon evaluations, e.g. LOCA-bench (Zeng et al., 2026a; [LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)")) and Sinha et al. (2026; [The Illusion of Diminishing Returns](#/papers/sinha2025longhorizon "The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2026)")), which "vary context or interaction length for one task type" (§5).

## Problem and setting

The question: how agents perform "when the same problems are connected in different ways", with each problem's difficulty fixed (§1); then the effect of topology, task order, unnecessary branches and mixed categories (§4).

- **Tasks:** any with verifiable answers; a category needs "examples or a generator, an answer comparator, and alternative inputs with distinct answers" (§2.4). The framework "requires agents that can call tools" (§1).
- **Correctness:** integers exact, lists element by element, floating-point values within 10⁻³; HotpotQA by "the official joint exact match" of answer and supporting facts (§3 "Metrics"). Only an accepted target submission is graded; a run without one, a timeout or a context overflow counts as incorrect (§3).
- **Models and harness:** Qwen3.8-27B, GPT-OSS-120B and Gemma-4-31B-it, all open-weight (§ "Reproducibility Statement"), at temperature 1 and top-p 0.95 (§3). The prompt lists every task and dependency; a calculator tool is available; `get_input` allows at most five requests per node, "to limit guessing"; continuation prompts after malformed calls never correct a wrong reported value (§3).
- **Task selection:** each model keeps the math and Python tasks it solved on all eight inputs and whose banks have distinct answers (GPT-OSS also drops tasks with mean responses over 12,000 tokens), so task sets differ and each model is compared only with its own baseline (§4.2).

## Approach

- **Answer-gated inputs (§2.2).** `get_input` checks each reported parent answer with that parent's comparator and returns the intended input if all match, otherwise an input from the bank. Starting tasks and single-task runs also need a call, "which makes them directly comparable with larger topologies". A JSON file gives the topology.
- **Why not pass outputs on (§2.3).** That needs compatible formats or an adapter, a rule for combining parents, and prompt text explaining the conversion; it "can lead to difficulty accumulation", and "conversions could hide errors": rounding may map a wrong parent answer to the correct child input, "especially prevalent when the child task had few possible inputs". Two inputs may also share an answer; checking reports and choosing inputs with distinct answers "avoids both cases".
- **Task categories (§2.4).** 40 hand-selected math operators over lists and scalars, answers verified by Python solvers; 80 Python function/input variants from the LeetCode Dataset, traced "without using tools to run the code"; 40 adapted RLVE algorithmic objectives; 200 labelled HotpotQA questions with distractor paragraphs.
- **RLVR interface (§2.5).** Reward one if the accepted target answer matches, zero otherwise; correctness is recorded at every node.
- **Locating the first error (§3 "Answer Collection").** Each node's answer is read from its children's `get_input` calls, or else from the agent's text.
- **Statistics (§3; §4.3; §4.5).** Wilson intervals for accuracy, a bootstrap of solo runs for the baseline, inverse-variance weights (each estimate weighted by its precision) to pool math and Python topology differences, Jeffreys posterior draws for the adjusted mixed difference.

## Results

The authors report:
- **Single tasks (§4.1, Tab. 1).** All models solve "more than 91% of math, Python, and RLVE tasks"; HotpotQA accuracy is 30% to 40% under joint exact match. These runs only choose tasks.
- **Loss beyond the baseline (§4.2; Fig. 4; App. B, Tab. 3).** "Accuracy is below the baseline in every condition", by the averages given above (abstract); only GPT-OSS's math chain has an interval including zero, and chain and braid results "match a constant drop per node" (the same loss at each added node). They read this as "solving problems within a larger workflow adds difficulty beyond the accumulation of errors on isolated problems" (abstract).
- **Where failures begin (§4.2; Fig. 5).** Outside the shuffled braid, 78% to 100% of failed instances "first go wrong at a node that received its intended input"; Qwen loses accuracy even at the chain's start, which has no parents. "Most failures therefore begin with a wrong solution rather than a wrong report of a parent answer."
- **Topology and order (§4.3).** "We find no consistent effect of the edges on target accuracy, but small effects remain possible." Against the braid (± one standard error), the shuffled braid changes target accuracy by +5.7 ± 4.2 points for Qwen, −6.8 ± 3.4 for GPT-OSS and −16.3 ± 4.2 for Gemma.
- **Unnecessary branches (§4.4, Tab. 2).** "All three models sometimes solve the disconnected branch": GPT-OSS gets all seven checked tasks right in 83.2% of disconnected runs against 87.2% when required; Qwen and Gemma in 20.4% and 18.3%.
- **Mixed categories (§4.5; Fig. 6; App. B, Tab. 4).** GPT-OSS loses 21.9 points directly and 16.0 after adjustment (adjusted 95% interval −25.3 to −0.5); Qwen gains 7.1 and 6.0 (adjusted −1.5 to +18.3); Gemma changes by +2.1 and −2.3 (adjusted −7.3 to +13.5). The added RLVE and HotpotQA tasks "were almost always solved alone but were solved less often inside mixed instances".

## Limits the authors state

- "We intentionally selected tasks that each model solves reliably in isolation, so that the independent-error baseline stays high and any additional loss is attributable to the workflow" (§6).
- "Context overflow was rare in our experiments"; instances that exceed the context limit, or agents with memory and summarization tools, "would test whether topology matters once the agent must choose what to keep" (§6).
- Task sets differ between models; "we compare each model only with its own baseline" (§4.2).
- For the adjusted mixed-category difference, "For Qwen3.8-27B and Gemma-4-31B-it, the uncertainty intervals include zero" (§1).
- The RLVR interface is provided, but they "do not train models in this work" (§1).

## Open problems and building blocks

- **Open:** vary what the context contains, "such as the number of listed tasks or the retained reasoning from earlier tasks", to find which part causes the additional loss (§6); the verified intermediate answers "can also provide rewards for each node" in RLVR training (§6), or for [reward shaping](#/glossary/reward-shaping) or advantage attribution (crediting each step with its share of the outcome) (§2.5).
- **Released:** "ArbiGraph is available at" its GitHub repository (abstract); the Reproducibility Statement says "We will release the ArbiGraph code and all generated datasets upon acceptance" (§ "Reproducibility Statement").
- **To reuse it:** a tool-calling agent (§1); per new category, the three items listed under Problem and setting (§2.4); a JSON topology file (§2.2). The runs served the models with vLLM (an LLM inference server) on H100 GPUs, with 262k-token context budgets (131k for GPT-OSS) (App. A).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/math">math</a></span>
