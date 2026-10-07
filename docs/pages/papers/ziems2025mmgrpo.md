# Composing Policy Gradients and Prompt Optimization for Language Model Programs

**mmGRPO** · ACM CAIS 2026

Read: [PDF](https://arxiv.org/pdf/2508.04660) · [arXiv](https://arxiv.org/abs/2508.04660) · [DOI](https://doi.org/10.1145/3786335.3813164)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- GRPO for multi-module LM programs, composed with prompt optimization.
- Groups module-level calls across rollouts; prompt optimization first, then weights.
- From the GEPA/DSPy group: the authors find prompts and weights complementary (§7), at far more GPU time than prompt optimization alone (§5.3); cf. the loop's choice of GEPA over RL.

## In plain words

Many AI systems are programs that chain several LLM calls (modules), each with its own prompt; the tuning algorithms are typically prompt optimizers that score only the final output. [GRPO](#/glossary/grpo), a [reinforcement learning](#/glossary/reinforcement-learning) method for LLMs, was originally designed for runs that are a single LLM call; the authors say it remains unclear how best to apply it to such programs, whose runs on one input can differ in length and structure (§1). They build mmGRPO, whose main variant groups each module's calls, position by position, across several runs of one input and gives each call its run's final score, and release it in DSPy, a library for such programs (abstract). Across three tasks and two 8-billion-parameter models, mmGRPO improves on plain chain-of-thought prompts by 7% on average; running the prompt optimizer MIPROv2 first and mmGRPO second improves on them by 11% on average, and on MIPROv2 alone by 5% (abstract, §1). The authors call mmGRPO "the first implementation of GRPO that applies to sophisticated pipelines of LMs" and name the comparison it allows their main contribution (§1).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) · [PPO](#/glossary/ppo) · [reinforcement learning](#/glossary/reinforcement-learning) · [KL penalty](#/glossary/kl-penalty) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [credit assignment problem](#/glossary/credit-assignment-problem) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [rejection sampling](#/glossary/rejection-sampling) · [online and offline RL](#/glossary/online-and-offline-rl) · [policy-gradient RL](#/glossary/policy-gradient) · [Recall@k](#/glossary/recallk-and-mean-reciprocal-rank-mrr)

**The paper's own terms:**
- **LM program**: LM modules and other tools (a retriever, an external model) run by ordinary control flow; each module has its own prompt template and LM weights and may be called several times per run (§2).
- **Trajectory**: the record of one run, the list of its LM calls in order, each with its module, input and output; other control logic is omitted (§2, Eq. 3).
- **Program-level metric**: the reward, a score for a whole run, typically based on whether the final output is correct; metadata such as gold answers may be used by the metric but is not visible to the program (§2, Eq. 6).
- **Module-level group**: the calls to one module at one position among that module's calls ("second call to" a module), collected across the runs of one input, each paired with its own run's final reward (§3, Fig. 2; App. A).
- **PO**: prompt optimization, which updates the prompt templates (instructions, few-shot examples), not weights (§2, §5.2).
- **Vanilla CoT**: the starting program, whose prompts ask for a reasoning field before each output; unless stated otherwise, PO and mmGRPO start from it (§5.2).
- **BetterTogether(PO, mmGRPO)**: optimize prompts with MIPROv2, fix them, then train weights with mmGRPO (§5.2).

**Builds on:**
- GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), whose objective and within-group reward normalization mmGRPO reuses (§2, Eq. 1–2).
- BetterTogether (Soylu et al., 2024; not listed here), which the authors say showed that combining prompt and weight optimization beats either alone, "specifically in the context of offline RL via rejection fine-tuning" (§4).
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), in which mmGRPO is built, and its prompt optimizer MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), the baseline (abstract, §5.2, §6).
- LangProBe (Tan et al., 2025; not listed here), a benchmark of LM programs, the source of the programs and data (§5.1).

## Problem and setting

The paper asks whether GRPO can be instantiated "for arbitrary multi-prompt programs" and work "robustly as an off-the-shelf optimizer for LM programs using the same abstractions and constraints typically involved for prompt optimization" (abstract), and compares prompt optimization, mmGRPO and their combination (§1).

- **Reward only at the end:** every method gets the same program-level metric and no "intermediate module-level supervision" (§5.2). Rollouts come from the program being trained (on-policy, §3).
- **One set of weights:** mmGRPO allows separate weights per module, but all experiments share one LoRA adapter across modules (§3, §5.1).
- **Models:** Llama 3.1 8B Instruct and Qwen3 8B (§5.1).
- **Tasks** (§5.1; programs in App. B):
  - Banking77: assign a banking customer query to one of 77 intents, scored by [exact match](#/glossary/exact-match); one chain-of-thought module, a "sanity check" where both variants reduce to standard GRPO; 250 training, 500 evaluation examples.
  - PAPILLON, on the PUPA (Private User Prompt Annotations) benchmark (answer user queries without exposing private information to external APIs): one module writes a redacted request to an untrusted but stronger model (GPT-4.1 mini), another the final answer; the score combines answer quality and leaked private information, both judged by a large LM ([LLM-as-a-judge](#/glossary/llm-as-a-judge)); 111 training, 221 evaluation examples.
  - HoVer: multi-hop claim verification; a 4-hop program whose query-generation and fact-summarization modules are called repeatedly, retrieving Wikipedia snippets with ColBERTv2; scored by Recall@100; 500 training, 500 evaluation examples.
- **Runs:** each Table 1 cell is "averaged over 3 seeds" (Tab. 1 caption).

## Approach

- **Same interface as prompt optimizers:** mmGRPO reads the traces DSPy already collects, so "learning algorithms can be swapped without modifying the program itself" (§3).
- **Loop (Alg. 1):** each step samples training inputs, runs the program several times on each, turns the runs into groups and applies a GRPO update to each group; the two variants differ only in how groups are formed and in the loss (§3).
- **Module-level groups (Alg. 2, App. A):** calls are aligned across runs by module and position, each carrying its run's final reward; unlike standard GRPO, calls in one group may have different prompts (§3). When runs differ in structure, `truncate` drops positions missing from some run, and `fill`, used in the experiments, pads each run's calls to a module by sampling with replacement from that run's own calls (App. A). SelectKDiverseElements then sets each group's size, "favoring selections that increase reward variance" (App. A).
- **Loss (Eq. 7):** GRPO's objective, with clipping (a cap on how far one update moves the model) and a KL penalty, applied per group, with rewards normalized within the group (Eq. 2).
- **Trajectory-level variant (Eq. 9):** each whole run is one group member, its reward applied to all its tokens and normalized by the run's total generated length rather than each call's. Module-level was chosen for the main experiments because it maps onto existing prompt–completion GRPO trainers, and "we might expect it to be more suitable when different parts of a program generate outputs of very different sizes" (§3).
- **Composition (§4):** MIPROv2 prompts first, then mmGRPO on the weights; the authors say "We extend the BetterTogether approach to the online RL setting for the first time".

## Results

Tab. 1 and §5.3 unless noted; module-level mmGRPO.
- **Against the baselines:** the authors report the mmGRPO row "consistently higher" than Vanilla CoT, 7% on average, and BetterTogether(PO, mmGRPO) with "consistent gains" over MIPROv2, 5% on average.
- **mmGRPO against PO:** MIPROv2 alone gains 6% on average over Vanilla CoT against mmGRPO's 7%, and "neither consistently dominates the other" (Tab. 1 caption). mmGRPO runs took 18.7 hours on 2 H100 GPUs on average, MIPROv2 1.4 hours on 1, so PO is "likely more feasible for settings with lower computation budgets".
- **The combination:** BetterTogether(PO, mmGRPO) "performs the best in most task pairs", gaining 11% on Vanilla CoT, 5% on MIPROv2 and 3% on mmGRPO on average. The authors' explanation: "When the base policy is too weak, exploration bottlenecks can limit" mmGRPO (a weak starting program rarely finds high-reward runs to learn from), as for HoVer, while prompt optimization gives "a more favorable initialization"; "This also can help explain why BetterTogether consistently surpasses either method alone".
- **Trajectory-level (§5.4):** on HoVer with Qwen3 only, a variant "developed since running the main experiments", with the CISPO loss (an RL loss from the MiniMax-M1 report that clips importance-sampling weights, the new-to-old probability ratios, rather than token updates; not described in the paper) and "additional tuning of group and batch sizes", reaches Recall@100 of 75.3 against module-level's 71.0.
- **Case studies (§5.5):** on HoVer, in "several improved cases" mmGRPO's queries become compact keyword lists, and its fact-summarization module "sometimes" records which facts retrieval has not yet supported; "not intended as a complete causal explanation of the gains".
- **Conclusion (§7):** mmGRPO "is highly effective in navigating challenging credit assignment problems without requiring intermediate supervision"; the combination gives "the strongest overall performance in the majority of settings".

## Limits the authors state

- 8-billion-parameter models only, "which may not reflect how mmGRPO performs with larger models" (§7).
- LoRA, which "may limit training performance compared to full-parameter updates" (§7).
- "we evaluate only two mmGRPO implementations despite many possible alternative formulations" (§7).
- Banking77 gives rewards from rollouts only, not intent labels; whether current methods do well on such rewards alone: "Our results suggest that this is not yet the case" (§7).
- mmGRPO "does not always surpass the prompt optimized programs" (§1); "MIPROv2 achieved these results significantly faster while using fewer GPU-hours" (§5.3).

## Open problems and building blocks

  - Sampling from "teacher programs" with the same module interfaces but other prompts or larger models, for partly off-policy training: "We leave this exploration to future work" (§3).
  - "a much larger possible design space of more powerful policy-gradient RL algorithms for multi-module systems to be explored in future work", where newer prompt optimizers such as GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) and Meta-Harness ([Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)")) "could further improve" the composition (§5.4).
  - Combining policy-gradient RL and prompt optimization: "future work exploring their integration in offline and online settings" (§1).
- **Released:** "We open-source multi-module GRPO in the DSPy library" (abstract).
- **To reuse it:** a DSPy program and a program-level metric (§3, §5.2); the GRPO trainer of HuggingFace's TRL (Transformers Reinforcement Learning) library, with LoRA, 750 steps of 4 inputs with 12 rollouts each (§5.2).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
