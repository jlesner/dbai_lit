# Combee: Scaling Parallel Prompt Learning for Self-Improving LLM Agents

**Combee** · COLM 2026

Read: [PDF](https://arxiv.org/pdf/2604.04247) · [arXiv](https://arxiv.org/abs/2604.04247)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Runs ACE/GEPA-style prompt learning in parallel over many agent traces.
- Parallel-scan aggregation, augmented shuffling and a batch-size controller against what it calls "context overload" from naive parallel updates (§2.2, §3).
- Scaling context optimization to many traces at once.

## In plain words

Methods such as ACE and GEPA improve an LLM agent without retraining: an LLM reflects on past runs, and another call folds the lessons into the system prompt. The authors say these methods "primarily focus on single-agent or low-parallelism settings" (abstract), while agents now produce many traces ideally learned from at once (§1). Merging many reflections in one call fails, they argue: the merging LLM keeps generic advice and drops specific lessons, which they call "context overload" (§1). Combee sits on top of ACE or GEPA: it merges reflections in small groups, then merges the results, by default gives each reflection two chances by copying and shuffling, and picks the batch size from measured training time. On Terminal-Bench 2.0, a set of command-line tasks, with ACE underneath, learning from existing traces rather than new runs, they report over 17 times less training time than one-at-a-time ACE, at 35.6% against 37.9% accuracy averaged over three runs on 29 held-out tasks (§4.2). They present Combee as a scaling layer, not a new learning method (§1), and as "a first step" (§6).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [self-consistency](#/glossary/self-consistency-majority-voting)

**The paper's own terms:**
- **prompt learning**: an "inference-time learning paradigm" in which an agent turns trajectories, tool traces or documents into reusable artifacts such as playbooks, memories or skill libraries, "without any weight updates" (§2.1).
- **generate-reflect-update loop**: "an agent executes a task, reflects on its trajectory to extract useful insights, and updates a shared context artifact for future iterations" (§2.1).
- **ACE and GEPA**: ACE "accumulates strategies into text-based playbooks", GEPA "optimizes system prompts via evolutionary search" (§4.1).
- **playbook**: ACE's learned system prompt, a list of entries, each marked helpful (h) or harmful (r) during inference (§2.2).
- **aggregator** or **curator**: the LLM call that turns reflections into one context update (§1, App. I).
- **batch size**: "the number of parallel agent trajectories or reflections aggregated before producing one context update in an iteration" (§2.2). Batch 1 is sequential learning; a larger fixed batch without Combee is naive or "Normal parallel" scaling (Tab. 8).
- **context overload**: as batch size grows, the aggregator must distill more reflections into one update, "producing far fewer and lower-quality entries" (§2.2).

**Missing glossary terms:**
- **parallel scan (prefix sum)**: in the authors' words, "the classical technique for combining a sequence under an associative operator with logarithmic rather than linear dependency depth" (§3.1).
- **critical batch size**: a distributed-training notion of where larger batches stop paying off; the authors liken to it how per-epoch delay falls as batch size grows, "but with diminishing returns" (§3.3).

**Builds on:**
- ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")) and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), the methods Combee runs on and is compared against (§1, §4.1).
- The parallel scan for prefix sums (Blelloch), its use in sequence models (Mamba), and MapReduce-style splitting of long documents for LLMs (LLMxMapReduce) (§3.1).
- Large-batch distributed training, for the controller (§3.3) and App. D's analogy, where "contexts play a role similar to gradients".
- Self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), whose principle duplication is said to echo (§3.2).

## Problem and setting

- **Question:** scale the loop "to high parallelism, spinning up multiple agents concurrently per iteration, while preserving the quality of the resulting context updates" (§2.1).
- **Base method:** any generate-reflect-update loop "producing textual reflections" merged into a shared context artifact; its generation and update stay unchanged (§1, §3).
- **Models:** DeepSeek-V3.1 (128K context) "for majority of experiments" (§4.1, §2.2); GPT-OSS 120B for one check on Formula (App. F); Gemini-3.5-Flash as judge (App. G).
- **Benchmarks (§4.1):** AppWorld, multi-step API tasks scored by Task and Scenario Goal Completion (TGC, SGC), 90 training tasks and the held-out Test-Normal split, with a ReAct agent ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"): reasoning interleaved with tool actions). Terminal-Bench 2.0, 89 command-line software-engineering tasks: training on 60 released trajectories, with no new runs during learning; the agent harness Terminus-2 is scored by Accuracy@1 averaged over three runs on 29 held-out tasks. Two finance NLP sets: FiNER, entity typing in XBRL (machine-readable financial report) documents, 500 training samples; Formula, numerical reasoning over structured filings, 250 (§4.3).
- **Runs:** Fig. 4's GEPA values are "the single representative run shown in the figure" (Tab. 6); Combee + GEPA and the GEPA batch sizes "with comparable delay" were re-run three times (App. E).

## Approach

- **Map-Shuffle-Reduce (§1, Fig. 3):** agents work on separate shards (Map), reflections are copied and shuffled (Shuffle), and a two-level merge of mini-batches builds the update (Reduce).
- **Parallel scan aggregation (§3.1):** the n reflections are split into k mini-batches, each merged into an update, then the k updates are merged into one. By default k is the square root of n, rounded down, so both levels handle about as many items. This "structurally bounds the number of reflections any single aggregator call must process". The square root "consistently lies close to the optimum" in their experiments, though the best mini-batch size "is not always exactly" it.
- **Augmented shuffling (§3.2):** each reflection is copied p times (default 2) and the set shuffled, giving each reflection several chances and groupings, so "co-dependent insights are more likely to be extracted together".
- **Dynamic batch size controller (§3.3):** one trial iteration per candidate batch size measures delay; a power law of epoch time against batch size is fitted, and the controller picks the batch size where the time saved per extra unit of batch falls below a threshold τ, set to 1.6% of the steepest slope (footnote). τ "is deliberately set conservatively so the controller stops before measurable quality loss".
- **Baselines (§4.1):** naive fixed batches, and three aggregation baselines: Top-K Retrieval (cluster the reflections, pass one per cluster), Summarization, and Hierarchical Summarization (summarize each reflection, then condense the summaries), "using the same batch size as Combee".

## Results

- **Context overload (§2.2, Fig. 2):** with naive batching, Formula falls from 87.0% at batch 1 to 72.5% at batch 100, FiNER from 76.0% to 70.6%; entries marked helpful three or more times "vanish entirely" (Formula at batch 100, FiNER at batch 125).
- **AppWorld (§4.2, Tab. 1):** average score 53.3 without learning, 58.1 for sequential ACE (86 min), 55.7 for naive batch 40, and 65.8 for Combee at batch 40 (7 min), the highest average and SGC.
- **Terminal-Bench 2.0 (§4.2, Tab. 2):** 32.2% without learning, 37.9% for sequential ACE (42.4 min), 31.0% for naive batch 30, 35.6% for Combee at batch 30 (2.4 min). App. H's re-run gives Combee "12 extra LLM calls and roughly \$0.04" more curation cost than naive batching.
- **Finance (§4.3, Figs. 4–5, Tabs. 6–7):** the controller picked batch sizes 84 and 94 for GEPA, 80 and 64 for ACE (Formula, FiNER). With GEPA, Combee "matches the best fixed-batch accuracy on FiNER and achieves competitive accuracy on Formula with less than half of the time by fixed-batch baseline". With ACE, it "achieves the highest accuracy on Formula and FiNER", training more than 2.4 times faster than "the quality-comparable baselines". Top-K and Summarization "achieved much worse generation quality compared with Combee or naive ACE methods". Over three runs, Combee + GEPA matches GEPA at batch 5 and 10 "within one standard deviation while running 3.4–7.4× faster" (App. E).
- **Hierarchical Summarization (§4.3):** Combee "outperforms it by wide margins on both datasets and both frameworks", e.g. 0.857 against 0.650 on Formula with GEPA.
- **Ablations (§4.4, Formula; Tab. 3 both sets):** without the controller, a fixed batch "may choose a necessarily small batch size, causing a delay increase with little quality change" (Fig. 6). Without augmented shuffling, "quality fluctuates and is significantly worse than Combee" (Fig. 7). In all four settings, accuracy rises from one copy to two "and then plateaus or degrades" (Tab. 3).
- **GPT-OSS 120B (App. F, Tab. 10):** Combee "follows the same pattern: superior quality over fixed-batch baselines with much reduced training time".
- **Playbook quality (App. G, Tab. 11):** over five judging runs on FiNER, Combee + ACE scores 83.6 coverage and 93.8 specificity, against 90.4 and 96.0 for sequential ACE, with naive batch 60 and 125 lower; Combee "nearly matches sequential ACE on specificity, comes close on coverage".

## Limits the authors state

- Only ACE and GEPA were tested; methods with "structurally different context artifacts" are still to be validated (App. B).
- The controller's power-law model and fixed τ "may require adjustment for workloads with substantially different latency profiles", and each candidate is profiled once (App. B).
- The design "assumes synchronous parallel execution within each iteration" (App. B).
- Hierarchical aggregation "may degrade": a rare reflection "can still be diluted at the reduce level", contradictions split across mini-batches are left to the final call, and co-dependent insights benefit from sharing a grouping, "which shuffling encourages but cannot guarantee" (App. B "Failure Modes…").
- The evaluation "is bounded by the scale of available open-source agentic benchmarks", so the largest-scale regime "remains untested"; the finance sets "are not agentic" (App. B "Scaling to Larger Trace Volumes").
- Playbook size is left to the base method (App. B); only Combee + GEPA and the GEPA batch sizes "with comparable delay" were re-run, as the full suite "is computationally and financially expensive to repeat at scale" (App. E).

## Open problems and building blocks

- **Open (App. B):** a sensitivity analysis over τ and the candidate grid; asynchronous variants, "analogous to asynchronous SGD in distributed training"; "designing aggregation operators that are robust to" rare, contradictory and co-dependent reflections; "whether accumulated information becomes redundant or contradictory, is an open question"; deeper aggregation trees as training sets "grow into the thousands"; "better aggregation strategies, alternative shuffling or partitioning schemes".
- **Released:** "The source code will be released upon publication" (Reproducibility Statement).
- **To reuse it:** a base method producing textual reflections (§3), an LLM for reflection and merging (DeepSeek-V3.1 in most runs, §4.1), one profiling iteration per candidate batch size (§3.3).
- **Beyond its domain:** the authors "expect it to generalize to other generate-reflect-update frameworks with minimal changes" (§1) and to "work along with existing memory frameworks" (§5).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
