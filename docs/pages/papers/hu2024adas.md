# Automated Design of Agentic Systems

**ADAS** · ICLR 2025 (per the paper's running header, PDF p. 1) · 2024

Read: [PDF](https://arxiv.org/pdf/2408.08435) · [arXiv](https://arxiv.org/abs/2408.08435)  
Code: [ADAS](https://github.com/ShengranHu/ADAS)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Meta Agent Search: a meta agent programs new agents in code (abstract), building on an archive of discovered agents (App. B).
- Its code search space, the authors argue, can in theory express any agent, including prompts, tool use, workflows and their combinations (abstract).
- Harness code as the object of optimization.

## In plain words

Combining pieces such as chain of thought, self-reflection and tool calls into LLM agents often takes manual tuning (§1). The authors argue that hand-designed solutions in machine learning are eventually replaced by learned ones (abstract, §1), and name a research area, Automated Design of Agentic Systems (ADAS), that searches for agent designs automatically. Their method, Meta Agent Search, has an LLM (the "meta agent") write each new agent as Python code, score it, and add it to an archive it reads before writing the next. Because agents are code, they argue the search can in theory reach any possible agent (abstract).

With agents run on GPT-3.5 and designed by GPT-4, the best discovered agent beats the best hand-designed agent by 13.6 points (out of 100) on a reading-comprehension benchmark and 14.4 accuracy points on a math benchmark (§4.2). The authors report the agents keep their advantage when moved to other tasks and models (abstract). They present Meta Agent Search as "one of the first algorithms in ADAS that enables complete design in code space" (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) (the paper says "agentic system"), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [bootstrap resampling](#/glossary/bootstrap-resampling), [F1 score](#/glossary/f1-score) (the reading-comprehension metric, 0–100, Tab. 1; not defined in the paper).

**The paper's own terms:**
- **Foundation Model (FM)**: a large pretrained model, e.g. GPT (§1).
- **Agent, agentic system**: a system that uses FMs "as modules in the workflow to solve tasks by planning, using tools, and carrying out multiple, iterative steps of processing" (§2).
- **ADAS**: the area, framed as "using a search algorithm to discover agentic systems across a search space that optimize an evaluation function" (§2). Its components (Fig. 2): the search space (which agents can be represented), the search algorithm (how it is explored), and the evaluation function (how a candidate is scored).
- **Meta agent**: the FM that writes new agents in code, told to explore "interestingly new (e.g., novel or worthwhile) agents" (§3).
- **Archive**: the agents found so far, with their evaluation metrics; optionally seeded with hand-designed agents (§3).
- **Framework, forward function**: a library of under 100 lines given to the meta agent, for querying FMs and formatting prompts. A new agent is one `forward` function from task to answer (§3, App. C).
- **Stepping stones**: earlier designs that later ones build on, even if not high-scoring at first (§4.1).

**Missing glossary terms:**
- **Turing complete**: able to express any computation; the authors rest the claim that code can express any agent on it (§1).
- **AutoML, Neural Architecture Search (NAS)**: learning usually hand-designed parts of machine-learning systems; NAS searches for neural-network architectures (§1, §5).
- **Open-endedness algorithms**: searches that keep an archive of diverse, interesting discoveries as stepping stones, not only chasing one score (§3, §4.1).

**Builds on:**
- Prompt-optimization methods, OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) and Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")), which the authors say "focus only on designing prompts" (§1). OPRO is their prompt-optimization baseline (§4.2).
- Methods that search workflows as graphs or networks (e.g. GPTSwarm) or also learn tools, which the authors say "either fail to cover all possible designs in agentic systems or have harder search spaces for search algorithms" (§5).
- FunSearch, an LLM-driven program search, whose one-function practice they follow (§3); FMs writing loss or reward functions (DiscoPOP, Eureka) (§5).
- Open-endedness algorithms that use human notions of interestingness (Zhang et al. 2024a; Intelligent Go-Explore, Lu et al. 2024c) (§1, §3).

## Problem and setting

- **Question:** "Can we automate the design of agentic systems?" (§1).
- **Tasks:** single-step question answering (§6).
  - **ARC** (Abstraction and Reasoning Corpus: grid puzzles where the system infers a transformation rule from a few examples, §4.1). Agents write code for the rule; accuracy is exact match (App. D). Grids ≤ 5×5 from the "Public Training Set (Easy)": 20 validation and 60 test questions, each evaluated five times; 25 iterations (§4.1).
  - **Four benchmarks** (§4.2): DROP (reading comprehension needing discrete reasoning over paragraphs; F1), MGSM (multilingual grade-school math), MMLU (multiple choice over many subjects, "Multi-task"), GPQA (graduate-level science multiple choice, "diamond" subset). 128 validation and 800 test questions per domain; GPQA 32 and 166, evaluated five times; 30 iterations; a separate search in each domain (§4.2, App. E).
- **Models:** meta agent "gpt-4o-2024-05-13" (called GPT-4); agents and baselines on "gpt-3.5-turbo-0125" "to reduce compute cost" (App. D, E); transfer to Claude-Haiku, GPT-4 and Claude-Sonnet (App. A).
- **What counts as better:** one performance number (accuracy, or F1 for DROP) on validation data during search (§3); tables give test scores with 95% bootstrap confidence intervals (Tab. 1 caption).

## Approach

- **The loop** (§3; Algorithm 1, App. H): (1) the archive is optionally seeded with baseline agents; (2) given the archive, the meta agent writes a high-level description of a new agent, then its code, followed by two self-reflection rounds "to make the generated agent novel and error-free" (App. B); (3) the agent runs on validation data, and on a runtime error the meta agent reflects and retries, up to five times; (4) the agent and its metrics join the archive, until the iteration limit.
- **The prompt** (App. B): domain description, framework code, output format, the archive, and examples of wrong implementations. Only the domain text changes between tasks (§4).
- **Why code** (§2): the authors argue a code space can in theory express any building block and combination, is readable, can reuse LangChain, and lets the FM's coding skill guide search, while graph spaces "may be much less efficient due to the absence of these priors".
- **Baselines**, built in the same framework (§4.1, §4.2, App. F); the five ARC ones also seed the ARC archive (§4.1): Chain-of-Thought (CoT); COT-SC (five CoT answers combined by majority vote or an FM query); Self-Refine (up to five critique-and-revise rounds); LLM Debate (role-assigned FMs debate two rounds); Quality-Diversity (a simplified Intelligent Go-Explore that ensembles diverse answers); Step-back Abstraction (first consider the principles involved); Role Assignment (pick a role, then answer in it). OPRO is also compared (§4.2).

## Results

- **ARC** (§4.1, Fig. 3, Tab. 3): with GPT-3.5, the authors report their best agent at 13.7% accuracy against 8.0% for the best baseline, COT-SC. Ensembling the best of several refined CoT answers appeared in iteration 3, and later designs tended to use it; the best agent's feedback mechanism combines ideas from iterations 5, 11 and 12 (§4.1).
- **Four domains** (Tab. 1, §4.2): the authors report Meta Agent Search ahead of every hand-designed agent and of OPRO in every domain. The gains are 13.6 F1 on DROP (79.4 against Role Assignment's 65.8) and 14.4 points on MGSM (53.4 against LLM Debate's 39.0). On Multi-task and Science the gap is smaller; the authors hypothesize that for challenging questions there the FMs' knowledge is not sufficient, "a problem that will diminish as FMs improve" (§4.2).
- **Transfer across domains** (§4.3, Tab. 2): the top 3 MGSM agents, moved to GSM8K and GSM-Hard (other grade-school math sets), beat the baselines by 25.9 and 13.2 points (69.5 against 43.6; 31.2 against 18.0). On MMLU and DROP the authors say they "still outperform state-of-the-art hand-designed baselines" (§4.3); App. A, adding Science, says they outperform "or match (in Science)" the baselines (Tab. 5).
- **Transfer across models** (§4.3, Tab. 3): the top 3 ARC agents by GPT-3.5 test accuracy are run on the three other models; the authors say they "consistently outperform the hand-designed agents, with a substantial gap". On Claude-Sonnet the best reaches 48.3% against Self-Refine's 39.3%.
- **No seed agents** (App. I, Tab. 6): unseeded search still beats all hand-designed baselines in every domain, the authors report. Seeding "generally leads to improved performance", except on math, where the empty start scores 67.5% against 53.4%; they hypothesize broader exploration.
- **Cost** (App. J): about $500 per ARC run, $300 per other-domain run.

## Limits the authors state

- "we only evaluate Meta Agent Search on single-step QA tasks in this paper"; they suggest multi-step, complex environments (§6 "Future Work").
- "We only consider one objective (i.e., performance) to optimize in this paper"; they suggest multi-objective search (§6).
- Scoring agents only by numbers on the evaluation set "is both expensive and misses a lot of information"; they suggest having the meta agent read running logs (§6; App. J).
- The search algorithm "is relatively simple, focusing solely on exploring interesting new designs" (§6).
- "we targeted only one domain during the search"; generalist agents searched across domains are left open (§6).
- Programming every component from scratch "is not efficient in practice" (§6; also §3).
- Agents transferred from math to non-math domains do "not fully match agents specifically designed for the target domains" (§4.3).
- Generated code "could still act destructively due to limitations in model capability or alignment" (§6 "Safety Considerations").

## Open problems and building blocks

- **Open** (§6 "Future Work" unless noted):
  - Higher-order ADAS: improving the meta agent by ADAS.
  - Online continual learning from feedback after deployment.
  - Learning about FMs from discovered agents; the authors read their transfer results as showing that GPT-3.5 "may have a worse capability in evaluating and refining the answers".
  - Seeding ADAS with existing tools (search engines, RAG, LangChain), vision, and a choice of FMs.
  - Evaluation functions for tasks with subjective answers.
  - What ADAS may show about how complexity emerges in human organizations.
  - Safe-ADAS algorithms, possibly with mechanisms like Constitutional AI (§6 "Safety Considerations").
  - How the choice and quality of the seed agents affect search in each domain (App. I).
- **Released:** "All code is open-sourced" (abstract).
- **To reuse it:** an FM that writes code as meta agent (GPT-4 here) and a cheaper one for the agents, through API access, "without requiring expensive hardware like GPUs" (§6); the framework (App. C); a domain description (App. B, D, E); scored validation data (§3); isolated execution for generated code (§6). The authors note that gpt-4o-mini, under a third of GPT-3.5's price with better performance, suggests improved results "at just one-third of the cost" (App. J).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
