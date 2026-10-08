# When Does Continual Learning Require Learning

**When Does Continual Learning Require Learning** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.07847) · [arXiv](https://arxiv.org/abs/2607.07847)  
Code: [studying-cl](https://github.com/anneharrington/studying-cl)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares ways to keep improving an LLM as its tasks change, under one staged protocol on Qwen3-8B: prompt optimization (GEPA, ACE), supervised updates (SFT, SDFT), reinforcement learning (GRPO, SDPO) and context compression (Cartridges, In-place TTT) (abstract; §3.2, Tab. 1).
- Four settings: a chain of unrelated domains, Wikipedia facts that change between monthly snapshots, yearly SEC 10-K filings, and chains of dependent actions in a web app, each step checked by a programmatic verifier that reads the app's state (§4.1–§4.4). GRPO's reward is a check of the answer against the label (§3.2).
- Evidence against prompt-space loops as a way to accumulate: the authors report that prompt-based methods "fit each new stage quickly but degrade on future tasks" (abstract), e.g. GEPA's gain on one domain is mostly lost after training on the next (§4.1, Fig. 2), and that GRPO "remains sensitive to noisy reward signals" (abstract; §4.3). On the web-app chains an ACE playbook does beat its zero-shot baseline (§4.4, Fig. 6), though it was curated with "no held-out test" (App. A.2.5).

## In plain words

A deployed LLM's tasks and facts keep changing. The authors say the field "largely frames this as a problem of context management and mitigating forgetting", and argue that continual learning is "fundamentally about increasing model competence as the world changes" (abstract). They turn existing benchmarks into sequences of stages and compare eight ways of updating Qwen3-8B between stages: prompt optimizers, supervised fine-tuning, reinforcement learning (training on scores of the model's own sampled answers) and context compression. The settings are unrelated domains in a row, Wikipedia facts that change month to month, yearly company reports, and, for two of the methods, chains of dependent web-app actions (abstract; §4). They report trade-offs, not a winner. Prompt-based methods "fit each new stage quickly but degrade on future tasks"; methods that train the model toward its own earlier outputs "accumulate knowledge stably but struggle to update outdated facts" (abstract). Online reinforcement learning (trained on fresh samples) "adapts most effectively to knowledge updates but remains sensitive to noisy reward signals" (abstract). The work "does not propose a new training method" (App. B).

## Background and terms

**Terms to know:** [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [KL divergence](#/glossary/kl-divergence) · [LoRA](#/glossary/lora-low-rank-adaptation) · [F1 score](#/glossary/f1-score) · [agent harness](#/glossary/agent-harness)

**The paper's own terms:**
- **Continual learning**: "the problem of increasing competence as the world changes", along two axes: **space** (a new domain or task) and **time** (the task stays fixed while the data drifts). Time covers slow trends, discrete fact changes and **agentic accumulation**, where the environment drifts because of the model's own earlier actions (§1, Fig. 1).
- **Stage and update**: stages come in a fixed order; between stages an update may change weights, edit a system prompt, use external memory, attach an adapter, or do nothing, under a per-stage compute budget held constant across methods within a benchmark (§3.1).
- **Forgetting matrix**: accuracy after each stage on every stage's evaluation set, plus a row for the base model (§3.1).
- **BWT and FWT** (backward and forward transfer): BWT averages how much accuracy on each earlier stage changed between just after training on it and the end; negative BWT is catastrophic forgetting (§3.1, after Lopez-Paz and Ranzato [33]). FWT averages how much the model trained up to one stage beats the base model on the next, untrained stage; the authors call it "the sharper signal" (§3.1).
- **Catastrophic memorizing**: failing to rewrite a changed fact while leaving the rest of the model's knowledge untouched (§4.2).
- **Drift set and stable set**: Wikipedia facts whose value changed between two monthly snapshots, and held-out facts unchanged over the window, a forgetting probe (§4.2).
- **SDFT** (self-distillation): training under a forward-KL loss toward a teacher's output probabilities; in the sequential version the teacher is the previous-stage model (§3.2).
- **SDPO**: §3.2 calls it "sequential DPO", with the previous-stage model generating both the chosen and rejected continuations; App. A.2.1 describes a DPO-style pairwise objective over scored sampled answers against a frozen reference model; §2 lists it among methods that "learn from self-distillation".
- **Cartridges**: freezes the model and learns a small per-stage component, distilled from a teacher's output (§3.2); here a trainable 2,048-token KV cache (cached attention keys and values of a prefix) trained on question-answer pairs the model writes about the data seen so far (App. A.2.1).
- **In-place TTT** (test-time training): an input-conditioned weight update at inference with a self-supervised loss, reset between inputs, included "as a locality reference" (§3.2); configured as continual pretraining with fast-weight (inner, per-input) updates on a sparse set of layers (App. A.2.1).

**Builds on:**
- GEPA (Agrawal et al. [2], [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which evolves a system prompt through a reflect-and-mutate loop, and ACE (Zhang et al. [59], [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), which edits a markdown playbook (§3.2).
- SDFT (Shenfeld et al. [48]) and SDPO (Hübotter et al. [19]) (§3.2, Tab. 1).
- GRPO (Shao et al. [46], [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")) (§3.2).
- Cartridges (Eyuboglu et al. [10]) and In-place TTT (Feng et al. [11]) (§3.2).

## Problem and setting

The question: which patterns of change determine "when adaptation must be learned inside model weights and when it can be achieved through external scaffolding" (abstract). The authors say continual-learning evaluations are typically tied to one method, so "prompt, weight, and architectural updates are rarely compared fairly against one another" (§3.1).

- **Model:** Qwen3-8B (an open-weight LLM), non-thinking mode (§3.2); in the agentic setting ACE runs on Qwen3-32B and SFT on Qwen3-8B (App. A.2.5; printed "Qwen-32B" and "Qwen-8B" in §4.4).
- **Budget:** weight-update methods share, within a benchmark, a batch of 32, one epoch over 500 examples per phase (≈16 optimizer steps) and full-weight updates (App. A.1). Prompt methods carry the previous prompt or playbook forward with no replay of earlier data (§3.2).
- **Reward:** GRPO uses "a verifiable reward"; for 10-K and TempWiki, a binary correctness signal from the ground-truth label (§3.2).
- **Correctness:** in domain transfer a wrong output format scores zero (App. A.2.1); a TempWiki answer is a hit when its word-level F1 is at least 0.5, averaged over 8 samples (App. A.2.2); an agentic chain succeeds only if every step passes a programmatic verifier that reads the app's state (App. A.2.5).
- **Domain transfer** (§4.1): ToolUse, FinQA and SciKE-Bio (a tool-call task, numeric finance questions, biology questions answered with a letter; Tab. 3) in that order; the best checkpoint on the current task is carried forward.
- **Catastrophic memorizing** (§4.2): TempWiki, from four monthly Wikipedia snapshots after the pretraining cutoff.
- **Noisy temporal drift** (§4.3): predict whether a stock goes up or down in the 30 days after its 10-K filing (a US company's annual report), training year by year from 2015 to 2020; the target is "intentionally weak-signal" (App. A.2.4).
- **Agentic task** (§4.4): chains of 1, 3, 5 or 10 web-app steps, each depending on the previous step's state, built on WebArena-Infinity (a generator of browser environments with verifiable tasks, per its cited title); 510 chains across four apps (App. A.2.5). A `browser-use` agent (an LLM-driven browser agent) keeps one conversation across a chain (§4.4).

## Approach

The method is the protocol: run each method stage by stage, evaluate on every stage after each, and summarize with the forgetting matrix, BWT and FWT (§3.1). Tab. 1 lists each method's stage-by-stage version (§3.2). In the agentic setting, learning is added two ways (§4.4, App. A.2.5): an ACE playbook on Qwen-32B, curated from batches of live chains with "no held-out test"; and LoRA supervised fine-tuning (SFT) of Qwen3-8B on successful traces of a stronger teacher agent.

## Results

The authors' overall finding: "prompt-based methods alone are insufficient across most regimes, calling for actual learning" (§1); context compression "improves efficiency without substantially improving the ability to learn new tasks" (abstract). The figures print no values; numbers below are from the text.
- **Domain transfer** (§4.1, Fig. 2): GEPA gains "almost 40%" during the FinQA stage, then after biology training drops almost back to its pre-training accuracy; ACE "similarly improves and then immediately degrades". SDFT is the only method whose three final scores are all at or above zero-shot. Cartridges and In-place TTT stay largely flat or degrade.
- **TempWiki** (§4.2, Fig. 3): SDFT's stable-fact F1 falls from ≈0.30 to ≈0.15; SDPO "shows the same effect at smaller magnitude". GEPA reaches the highest drift F1 while its stable F1 falls. GRPO's jump on the second slice (+6.2 points) is "the largest measured gain of any weight update method", and it is the only weight-update method whose stable F1 does not move against its drift F1 (Fig. 3 caption).
- **TempWiki-Easy** (App. A.2.3, Fig. 7), a filtered re-cut: SDFT's and SDPO's stable F1 stay flat; most methods sit on the zero-shot drift baseline; SDPO and GRPO rise above it on the last slice.
- **10-K** (§4.3, Fig. 4): from a baseline around 50%, SDFT's future-year accuracy climbs to ≈0.62 by 2020; "Cartridges is the most stable method we tested"; GRPO drops on past and future years ("If the reward is noisy, the algorithm may reinforce the wrong answer"); GEPA and ACE degrade on future years (Fig. 4 caption); "SFT stays near chance throughout". GEPA adds "generic financial-analysis heuristics" (Fig. 5) and lowers a trading rule's forward profit (App. A.2.4, Fig. 8).
- **Agentic, Gmail** (§4.4, Fig. 6): the ACE playbook beats Qwen-32B zero-shot at every length, most at 3 steps (32.4% → 46.5%). Qwen-8B zero-shot falls to zero past one step; SFT reaches 60.0% at 1 step (above both Qwen-32B lines), 40.0% at 3, 20.0% at 5 and 6.7% at 10. "Absolute success still decays with chain length for every configuration".

## Limits the authors state

- One model only: "the relative behavior of the tested methods may change for larger models or models in reasoning mode" (§5.2).
- The suite "captures only a subset of realistic environmental change"; results "should therefore be read as evidence about which update behaviors are required in different regimes, not as a definitive ranking of continual-learning algorithms" (§5.2).
- In the main TempWiki cut, "many Wikipedia diffs are not genuine world-knowledge updates" and the scorer "is effectively binary at the string level"; "Both effects inflate the apparent divergence between drift and stable curves" (App. A.2.3).
- Training the agentic SFT model beyond one epoch overfit and lowered performance on some tasks (App. A.2.5).
- Dual use: a model that quickly takes in new information "could more easily be steered toward harmful or false beliefs through targeted data injection" (App. B).

## Open problems and building blocks

  - "An important but underexplored regime involves severely constrained updates": very few gradient steps and tightly limited compute (§2).
  - "future work could go deeper on this realistic agentic setting" (§4.4).
  - The bottleneck the authors suggest for the zero-shot agents: "the agent's ability to actually use long trajectory information rather than raw context capacity" (App. A.2.5).
- **Released:** code (footnote "Code:" to the abstract, PDF p. 1).
- **To reuse it:** each training phase "took no longer than 1 hour on a node of 8 H100s"; the prompt methods used cloud API models through OpenRouter (an API service for many models); all experiments cost $1000, development and tuning included (App. A.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
