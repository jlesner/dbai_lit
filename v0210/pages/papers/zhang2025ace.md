# Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models

**ACE** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2510.04618) · [arXiv](https://arxiv.org/abs/2510.04618)  
Code: [ace](https://github.com/ace-agent/ace)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Contexts as evolving playbooks, built by a generator, reflector and curator.
- Incremental structured updates avoid "context collapse" from repeated rewriting.
- Offline (system prompts) and online (agent memory) context optimization; without ground-truth labels its online memory scores below the base model on FiNER (§4.4), a case for checking memory against verified outcomes.

## In plain words

Many LLM applications improve without fine-tuning, by changing the model's input: instructions, strategies, a memory of past attempts. The authors argue that existing methods tend to shrink prompts into short generic advice, and that an LLM repeatedly rewriting a growing memory in full erodes its details over time, which they call context collapse (abstract, §1). In their system, ACE, one role (the Generator) attempts a task, a second (the Reflector) extracts lessons from the attempt, and a third (the Curator) adds them as small separate entries to a growing playbook instead of rewriting it. ACE builds a system prompt from training data, or updates a memory after each test question. With DeepSeek-V3.1, averaged over offline and online settings, the authors report margins over the baselines (example-filled prompts, prompt optimizers, a memory method) of 10.6% on an agent benchmark and 8.6% on finance benchmarks (abstract). They present ACE as removing two limitations of existing methods (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) (BIRD-SQL answers are graded by GPT-4o-mini, §4.1) · [pass@1](#/glossary/passk)

**The paper's own terms:**
- **context adaptation** (also "context engineering"): improving a model by building or modifying its inputs rather than its weights (§2.1).
- **offline / online adaptation**: offline builds the context (e.g. a system prompt) on the training split and scores it on the test split; online answers each test sample with the current context, then updates the context from it (§4.1).
- **playbook, bullet**: ACE's context is a list of itemized bullets. Each bullet has metadata (an identifier and counters of how often it was marked helpful or harmful) and content (a strategy, domain concept or failure mode) (§3.1).
- **delta context**: the small set of new candidate bullets merged into the playbook; in the experiments, one per sample (§3.1, §4.2).
- **grow-and-refine**: new bullets are appended, existing ones updated in place (e.g. counters), then a de-duplication step compares bullets by embeddings, either after each delta or only when the context window is exceeded (§3.2).
- **brevity bias**: "the tendency of optimization to collapse toward short, generic prompts" (§2.2).
- **context collapse**: an LLM rewriting the whole accumulated context at each step compresses it into a much shorter, less informative one (§2.2).
- **GT labels**: whether the Reflector sees ground-truth answers during adaptation; without them it uses execution feedback such as code success or failure (Tab. 1 caption, §4.3).
- **TGC / SGC**: Task Goal Completion and Scenario Goal Completion, AppWorld's official scores, each reported on its test-normal and test-challenge splits (§4.1).
- **rollout**: the paper's unit of adaptation cost, counted per role in Tab. 12–13.

**Missing glossary terms:**
- **KV (key-value) cache reuse, prompt caching**: reusing the state computed for a repeated input instead of recomputing it (§4.7).

**Builds on:**
- Dynamic Cheatsheet (DC, [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)")), a test-time memory of strategies the model rewrites: ACE is "Inspired by the agentic design of Dynamic Cheatsheet" (§3).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a prompt optimizer that reflects on execution traces and evolves whole prompts, which the paper says outperforms reinforcement learning methods such as GRPO (§4.2, App. C.1).
- MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), the DSPy library's optimizer of instructions and demonstrations by Bayesian optimization, a model-guided search over candidates (§4.2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), an agent loop interleaving reasoning and tool calls; AppWorld's official ReAct code is the base of all AppWorld runs (§4.2).

## Problem and setting

- **Question:** can a context grown by small itemized updates beat prompt optimizers and memory methods, offline and online, at lower adaptation cost (§1, §3)?
- **Model:** one LLM, the non-thinking mode of DeepSeek-V3.1 (671B), plays all three roles (§4.2); App. A.1 swaps in three other LLMs.
- **Settings:** batch size 1, at most 5 Reflector rounds and 5 offline epochs (§4.2); original train/validation/test splits, one shuffled test split for all methods (§4.1).
- **Benchmarks** (§4.1):
  - AppWorld: agent tasks calling the APIs of everyday apps (e.g. email, file system), at normal and challenge difficulty.
  - FiNER (tag tokens in XBRL filings, the eXtensible Business Reporting Language, with one of 139 entity types) and Formula (financial numerical reasoning), scored by exact-match accuracy.
  - DDXPlus (medical diagnosis) and BIRD-SQL (text-to-SQL), both from the StreamBench suite, offline only, adapting on 1000 sampled training examples (App. A.2).
- **Baselines** (§4.2): the base model (ReAct on AppWorld); in-context learning (ICL) with as many training examples as fit; MIPROv2 and GEPA (in DSPy); DC.
- SQL semantics and NULLs: not discussed.

## Approach

- **Three roles** (§3, Fig. 4): the Generator produces reasoning trajectories and marks which bullets were useful or misleading (§3.1); the Reflector critiques the trace to extract lessons, optionally over several rounds; the Curator turns the lessons into delta entries, "merged deterministically into the existing context by lightweight, non-LLM logic" (§3).
- **Incremental delta updates** (§3.1), one of three "key innovations" with the Reflector and grow-and-refine (§3): only the relevant bullets change, deltas can be merged in parallel, and the design allows "efficient merging, pruning, and de-duplication".
- **Multi-epoch adaptation** revisits training queries (§3); **offline warmup** starts online adaptation from an offline-built context (§4.6).

## Results

- **Collapse case** (§2.2, Fig. 2): with DC on AppWorld, the context had 18,282 tokens and accuracy 66.7 at step 60, then 122 tokens and 57.1 at the next step, below the 63.7 of no adaptation. The authors call it "a fundamental risk" of full rewriting.
- **AppWorld** (Tab. 1, §4.3): ACE beats ICL and GEPA offline and DC online, by an average of 10.6%. Without labels it still improves over ReAct. It "matches" the top leaderboard agent, IBM CUGA (built on GPT-4.1), on average, and online ACE surpasses it on test-challenge (§4.3, App. D Fig. 5); §1 says it surpasses CUGA.
- **Finance** (Tab. 2, §4.4): with labels ACE beats ICL, MIPROv2 and GEPA offline and DC online; §4 gives "an average performance gain of 8.6% over strong baselines". Without labels, online ACE falls to 67.3 on FiNER against the base model's 70.7, and DC also degrades.
- **Other domains** (App. A.2, Tab. 10–11): DDXPlus 90.2 for ACE against 76.4 for GEPA and 75.2 for the base model; BIRD-SQL average 52.9 against 52.2 and 47.8, with GEPA ahead on the Moderate and Challenging subsets.
- **Other LLMs** (App. A.1, Tab. 5–9): ACE improves over the base model with all four, with smaller gains for Llama-3.3-70B than for GPT-5.1 or GPT-OSS-120B.
- **Ablations:** Tab. 3 compares ACE with and without the Reflector, multi-epoch adaptation and offline warmup. §4 says the Reflector, multi-epoch refinement and incremental delta update each contribute "substantial performance gains". Without delta updates, test-normal TGC/SGC is 67.3/46.4 against 76.2/64.3 with them (App. A.5, Tab. 18).
- **Robustness** (App. A.4, Tab. 16–17): on FiNER, ACE with a weaker Reflector (GPT-OSS-120B) still beats the base model, and so does ACE with injected harmful reflections, unless injected every step.
- **Hyperparameters** (App. A.6, Tab. 19–21): 5 reflection rounds is "a good balance" and 10 can degrade; the de-duplication threshold and the pruning trigger (10K–100K tokens) change accuracy modestly.
- **Cost** (§4.7, Tab. 4): adaptation latency 86.9% lower on average (§4) than GEPA (offline AppWorld) and DC (online FiNER), fewer rollouts than GEPA, lower token cost than DC. Also fewer adaptation tokens than GEPA (App. A.3), and in a GPT-5.1 caching study most evaluation input tokens came from cache (§4.7).

## Limits the authors state

- "A limitation of ACE is its reliance on a reasonably strong Reflector"; otherwise the context "may become noisy or even harmful" (§5).
- Where no model can extract useful insights, the context will lack them; and not every task needs rich contexts, e.g. HotPotQA (multi-hop question answering) or the puzzle Game of 24 (§5).
- Without ground-truth supervision or reliable execution signals, "both ACE and DC may degrade" (§4.4).
- Weaker models "naturally generate noisier feedback", giving smaller gains (App. A.1).
- At evaluation ACE uses more raw input tokens per query than GEPA; the cost study ran ACE with 1 epoch and 1 Reflector round, and more "will increase cost" (App. A.3).
- CUGA is "a rough contextual reference", not a baseline (§4.3, footnote).

## Open problems and building blocks

- **Open:** online and continual learning, and selective unlearning, as "promising directions for future work" (§5). Contradiction detection, prioritising high-confidence updates and periodic pruning as "compatible extensions" (App. A.4).
- **Released:** the code (Reproducibility Statement); the prompts of ACE's roles and of the AppWorld baselines (App. F, Figs. 6–14).
- **To reuse it:** an LLM for the three roles (one model in the main runs, §4.2), swappable "without changing the algorithm or prompts" (§4.5); a feedback signal, ground-truth labels or execution outcomes (§4.4); an embedding model for de-duplication (§3.2). Adaptation took 9,517 s offline on AppWorld and 5,503 s and $2.9 of tokens online on FiNER (Tab. 4).
- **Beyond its domain:** "ACE is not finance-specific" (§4.4), and "a generalizable method for test-time context evolution across LLM families" (§4.5).

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
