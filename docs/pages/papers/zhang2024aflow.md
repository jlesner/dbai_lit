# AFlow: Automating Agentic Workflow Generation

**AFlow** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2410.10762) · [arXiv](https://arxiv.org/abs/2410.10762)  
Code: [AFlow](https://github.com/FoundationAgents/AFlow)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Searches the workflow itself: code-represented graphs of LLM-calling nodes (abstract).
- Monte Carlo tree search with LLM code edits, tree-structured experience and execution feedback (abstract).
- Changes how the steps connect, not just the prompts in a fixed pipeline; it argues that ADAS's linear heuristic search limits it (§1); benchmarks scored by solve rate, F1 and pass@1 (§5.1).

## In plain words

LLMs are often run inside hand-built workflows: fixed sequences of model calls, each with its own prompt, such as writing three answers and then picking one. The authors say building these by hand "requires significant human effort, limiting scalability and generalizability", and that "existing methods still rely on initial manual setup" (abstract). AFlow writes each workflow as a Python program that calls the model, and searches over such programs with a tree search: a strong LLM edits a chosen workflow, the new one is run several times on a held-out validation part of the benchmark and scored, and a tree records which edits helped (§4). On six question-answering, coding and math benchmarks, with GPT-4o-mini running every workflow, the authors report beating hand-built methods by 5.7% on average and an earlier automatic method, ADAS, by 19.5% (§5.2, Tab. 1). They also report that it lets smaller models beat GPT-4o "on specific tasks at 4.55% of its inference cost in dollars" (abstract). They present AFlow as "a novel framework for automated workflow optimization" (§6), improving on earlier automated methods.

## Background and terms

**Terms to know:** [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [pass@k](#/glossary/passk) · [F1 score](#/glossary/f1-score) · [self-consistency](#/glossary/self-consistency-majority-voting) · [Pareto front](#/glossary/pareto-front) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [multi-hop question answering](#/glossary/multi-hop-question-answering)

**The paper's own terms:**
- **agentic workflow**: LLM-calling nodes joined by edges that fix their execution order (§3.1); unlike an autonomous agent, it runs "through predefined processes with multiple LLM invocations" (§2). In the glossary's terms (ours), it is close to the prompts and control code of an [agent harness](#/glossary/agent-harness).
- **node**: one LLM call, set by its model, prompt, temperature and output format (§3.1).
- **edge**: how nodes connect; of graphs, neural networks and code, the paper picks code, which expresses sequences, conditions and loops (§3.1).
- **operator**: "predefined, reusable combinations of nodes representing common agentic operations" (§1): Generate, Format, Review and Revise, Ensemble, Test, Programmer, and Custom, the default for building a single node (§3.2, App. A.4).
- **optimizer and executor**: the LLM that edits workflows, and the LLM a workflow calls when it runs (§5.1).
- **the MCTS variant**: "each tree node represents a complete workflow rather than individual LLM-invoking node" (§4); a new workflow's value is its measured score, with no random playouts (§4).
- **tree-structured experience**: per workflow, the edits made to it, each child's score and whether it beat the parent (§4, App. C.1).
- **solve rate**: share of problems answered correctly (§5.1).

**Builds on:**
- ADAS (Hu et al., 2024; [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)")), where an LLM writes agent designs as code. AFlow adopts its code representation; the authors say ADAS is held back by "its linear heuristic search algorithm" (§1, §3.2) and keeps past workflows in "a linear list structure" (§2).
- Prompt optimizers inside a fixed workflow: DSPy (Khattab et al., 2024; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), which "requires manual workflow setup before automated prompt optimization" (§1), and TextGrad (Yüksekgönül et al., 2024; [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")) (§1, §2).
- GPTSwarm (Zhuge et al., 2024), graph-structured workflows optimized with reinforcement learning, which "struggles to represent workflows with conditional states" (§2).
- Hand-built workflows used as operators and baselines: chain of thought (Wei et al., 2022), self-consistency (Wang et al., 2022; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), Self-Refine (Madaan et al., 2023), MultiPersona (Wang et al., 2024a), MedPrompt (Nori et al., 2023) (§2, §3.2, §5.1).

## Problem and setting

- **Question:** find the workflow that maximizes an evaluation function on a task (§3.1), a formulation the authors say generalizes "prior approaches as specific cases" (§1).
- **Search space used:** key parameters such as the model, temperature and output format are fixed; AFlow searches prompts, connecting code and operator choice (§3.2, Eq. 1). Scope: "reasoning tasks with numerical evaluation functions" (§3.2).
- **Benchmarks** (§5.1): HumanEval and MBPP (Python function-writing problems checked by unit tests), GSM8K (grade-school math word problems, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), MATH (competition math; 617 level-5 problems of four types), HotpotQA (multi-hop questions over Wikipedia) and DROP (reading comprehension needing counting or arithmetic); 1,000 random samples each of HotpotQA and DROP, the others in full.
- **Splits:** 20% validation, 80% test, seed 42; the blank workflow runs five times on validation and its high-variance problems become the final validation set (§4).
- **Metrics:** solve rate (GSM8K, MATH), pass@1 (HumanEval, MBPP), F1 (HotpotQA, DROP); cost from token use (§5.1).
- **Models** (§5.1): optimizer Claude-3.5-sonnet; executors DeepSeek-V2.5, GPT-4o-mini, Claude-3.5-sonnet and GPT-4o; temperature 1 for DeepSeek-V2.5 and 0 for the others; 20 rounds.
- **Baselines** (§5.1): IO ("direct LLM invocation"), chain of thought, self-consistency with chain of thought (5 answers), MultiPersona Debate (LLM personas debate an answer), Self-Refine (the model critiques and revises its answer; at most 3 rounds), MedPrompt (an ensembling prompt recipe; 3 answers and 5 votes), and ADAS with Claude-3.5-sonnet as optimizer and GPT-4o-mini as executor, 30 rounds.

## Approach

Each workflow is a Python class whose call method invokes nodes and operators, starting from a blank template (§4, App. A.3). Each round of the search (§4, Alg. 1; detailed version App. A.6, also numbered Alg. 1):
- **Selection:** a parent is drawn from the top-k (the k best-scoring) workflows and the initial one, mixing uniform and score-weighted (softmax) probabilities; the authors say including the initial workflow keeps exploring and avoids local optima (§4, Eq. 3).
- **Expansion:** the optimizer gets the parent's code, its experience and "precise logs of predictions and expected output", and makes one change to prompts or code (§4; prompt in App. A.1).
- **Evaluation:** 5 runs on the validation set, mean and standard deviation (§4).
- **Backpropagation:** score, edit and success go into the parent's experience and a global record used for selection (§4).
- **Stop:** when the top-k average stops improving for a set number of rounds, or at the round limit (§4); App. A.6 sets the limit to 20 rounds, k to 3, and stops after 5 rounds without change.

Operators encode known patterns: Ensemble is cited to self-consistency, Review and Revise to Self-Refine, Test to Zhong et al. (2024a); Programmer writes and runs Python (§3.2, App. A.4). Without operators, AFlow "can construct different workflow nodes using the basic Custom operator" (§3.2).

**Theoretical properties** (App. G; discussion, no numbered theorems):
- AFlow can "traverse from any initial workflow to any point in the search space, avoiding local optima", given that code edges can express all valid node relationships and that LLM expansion produces valid modifications with non-zero probability (App. G.1).
- AFlow "achieves optimal performance within finite iterations" given a bounded evaluation function, valid workflows kept by the code edge structure, and a non-zero probability that the LLM generates an improvement (App. G.2).

For open-ended tasks, the optimizer prompt drops reasoning-specific instructions and a GPT-4o judge replaces the evaluation function (App. F.1).

## Results

- **Main comparison** (Tab. 1, Fig. 1; all executed with GPT-4o-mini on the test split, three runs averaged): AFlow is highest on all six benchmarks, averaging 80.3 against 76.0 for the best hand-built method (self-consistency) and 67.2 for ADAS; the authors word this as "outperform all manually designed methods by an average of 5.7% and surpass contemporary automatic workflow optimization work by 19.5%" (§5.2). They report improving over ADAS on MATH and MBPP "by 57%" (§5.2).
- **Transfer** (Tab. 2, HumanEval test set, three runs averaged): workflows found with GPT-4o-mini or DeepSeek-V2.5, run on four executors: "the vast majority demonstrate stronger performance than the baseline", but the DeepSeek-found workflow does "notably weaker" on GPT-4o-mini than the GPT-4o-mini one (§5.2).
- **Cost** (Fig. 4; App. D, table on PDF p. 30; HumanEval): AFlow can identify workflows "that allow weaker models to outperform stronger models on the pareto front of cost-effectiveness" (§5.2); the abstract reports smaller models outperforming GPT-4o on specific tasks at 4.55% of its inference cost (abstract).
- **Ablation** (Fig. 5(A), GSM8K): operators help AFlow find better workflows more efficiently; without operators the authors report 93.1%, "surpassing manual designs" (§5.2), and an ensemble-like structure emerges (App. B.1).
- **Case studies:** on GSM8K each round adds one operator or edits one prompt; Fig. 6 shows the path to the best-performing workflow and failed rounds (§5.2). On MBPP AFlow found a structure like AlphaCodium (Ridnik et al., 2024), a hand-built code flow with LLM-written tests (§5.2, App. B.1). App. C.2 credits execution feedback with "the ability to identify patterns in the scoring feedback without knowing the specific rules of the scoring function".
- **Open-ended tasks** (App. F.2, Tab. A1–A2; GPT-4o judge plus three human annotators): the authors report "significant improvements in both quality and efficiency compared to baseline responses" for novel writing (one prompt) and "substantial improvements in idea generation quality and specificity" (10 questions).

## Limits the authors state

- Applied to "reasoning tasks with numerical evaluation functions" (§3.2); for tasks without numerical feedback an LLM judge can address this "to some extent" (App. F.1).
- Key parameters such as the model, temperature and format are fixed to enhance search efficiency (§3.2).
- Five runs per workflow "increases per-iteration cost" (§4).
- "different language models require different workflows to achieve their optimal performance" (§5.2).
- Operators are "human-designed effort to enhance search efficiency" (§5.2).
- The Fig. 5 caption notes that GSM8K's larger data volume avoids "fluctuations in improvement due to small data size that could affect comparisons" (Fig. 5).
- Convergence "may not be strictly monotonic" (App. G.2).

## Open problems and building blocks

- **Open:** none named. The authors offer the formulation as "a unified framework for future research at both the node and workflow optimization levels" (§1) and say the operator set "can be easily expanded" (§3.2).
- **Released:** the code (abstract); "More optimization trajectories will be made available in an open-source repository upon publication" (App. C.1); full open-ended outputs "in the supplementary materials" (App. F.2).
- **To reuse it:** a task with a numerical evaluation function and data to split (§3.2, §4); optimizer and executor LLMs (§5.1); the operators, with public tests for Test (App. A.4); 20 rounds of 5 validation runs (§4, App. A.6).
- **Beyond its domain:** the authors adapt AFlow to open-ended tasks with an LLM judge, shown on novel and research-idea generation (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
