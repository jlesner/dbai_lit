# Self-Play Only Evolves When Self-Synthetic Pipeline Ensures Learnable Information Gain

**Self-Play Only Evolves When…** · (position paper), ICML 2026 (position track)

Read: [PDF](https://arxiv.org/pdf/2603.02218) · [arXiv](https://arxiv.org/abs/2603.02218)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Argues that self-evolving loops in which one LLM plays proposer, solver and verifier plateau because the loop "synthesises more data without increasing learnable information" (abstract), and proposes three designs: asymmetric co-evolution, capacity growth and proactive information seeking (abstract; §3).
- Measures learnable information as epiplexity, estimated by prequential MDL coding after Finzi et al. (2026), on Absolute Zero's code tasks: data from three proposer models observed by Qwen2.5 solvers of several sizes (up to 72B in Fig. 5), and a nine-iteration Absolute Zero self-play run of Qwen2.5 3B (§4; App. A).
- A diagnosis of why proposer–solver self-play with an execution checker ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")) stalls: in its run the solver rewards rise while epiplexity fluctuates, a pattern App. C offers a test for (reward redistribution rather than learning) without ruling on its own run (App. C, Tab. A1). The authors call the experiments "diagnostic rather than exhaustive" (§4).

## In plain words

Some LLM training loops try to improve a model without outside data: the same model writes tasks, solves them and judges the solutions, then trains on the result. The authors say many such loops "often plateau quickly", and name as a central failure that "the loop synthesises more data without increasing learnable information for the next iteration" (abstract). Their position: what the model can still learn from its own data should grow from round to round (§1). They propose three designs: let the task-writing and judging roles train a stronger solving role and pass its gains back to them, grow the model's size and thinking budget over rounds, and actively bring in outside material (abstract; §3). Small experiments on the coding tasks of an earlier self-play system, Absolute Zero, estimate learnable information with a recent compression-based measure (§4). In one nine-round run of a 3-billion-parameter model, they report that rewards rise while the measure jumps up and down instead of growing (App. A; App. C). It is a position paper, with experiments called "diagnostic rather than exhaustive" (§4).

## Background and terms

**Terms to know:** [self-play](#/glossary/self-play) · [reinforcement learning](#/glossary/reinforcement-learning) · [minimum description length (MDL)](#/glossary/minimum-description-length-mdl) · [LoRA](#/glossary/lora-low-rank-adaptation) · [test-time scaling](#/glossary/test-time-scaling) · [reward hacking](#/glossary/reward-hacking) · [curriculum learning](#/glossary/curriculum-learning).

**The paper's own terms:**
- **Proposer, Solver, Verifier**: the three roles one LLM plays; the Proposer "generates tasks", the Solver "attempts solutions", the Verifier "provides training signals" (abstract). Proposer and Verifier form the **internal environment**; an **external environment**, when present, supplies "information sources such as documents or interactive worlds" (§2.1). A **triadic** loop evolves all three, which "share one base model" (§2.1).
- **Synthetic direction**: what a role makes from the shared weights: questions with reference answers, solutions, or feedback (§3.1); in the experiments, the task types.
- **Learnable information**: "the part of data that a learner can capture as a reusable structure"; **unlearnable information** "remains unpredictable or incompressible given the learner’s assumptions, capacity, and training method" (§2.2). Both depend on the observer (the learning model).
- **Epiplexity and bounded entropy** (§2.2, Eqs. 1–4): among the observers within a parameter budget and an inference-time budget, take the one that minimizes the length of describing it plus the coded length of the data under it. Epiplexity is that observer's description length, which the authors "treat as a proxy for learnable information"; bounded entropy is the remaining coded length, "what still appears random to the bounded observer". From Finzi et al. (2026).
- **Weak-to-strong and strong-to-weak**: the current proposing and verifying ability "can supervise the training of a stronger Solver (weak-to-strong)", which then "needs to be synchronised back into the internal environment (strong-to-weak)" (§3.1, Fig. 4).
- **Abduction, deduction, induction** (Absolute Zero's code tasks, §4; App. D): from a program and its output, give an input; from a program and an input, the output; from input–output pairs, the program.

**Missing glossary terms:**
- **Shannon entropy**: the total uncertainty of a probability distribution, in bits; it "does not distinguish reusable structure from randomness" (§2.2).
- **Prequential coding**: coding data item by item, each with the model trained on the items before it (§4, Eq. 7).
- **One-way permutation**: a one-to-one function that is easy to compute but that no efficient (polynomial-time, possibly randomized) algorithm can invert except with negligible (vanishingly small) probability; "non-uniform" inverters may use extra advice fixed for each input size (general definition; §3.1 uses it undefined).

**Builds on:**
- Finzi et al. (2026): epiplexity, its prequential estimate and the one-way-permutation gap (§2.2; §3.1); the authors "extend" its estimation method (§4; App. B). Not on this site.
- Zhao et al. (2025a), Absolute Zero ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")), self-play on "code-based tasks verified by execution" (§6): the experiments follow its data and self-play setup and public repository (§4; App. A).
- Self-play and triadic loops the authors call "often fragile" (§1; §6), e.g. R-Zero (pseudo-labels from majority voting) and SPICE (tasks grounded in external corpora); not listed here.

## Problem and setting

- **Question:** why self-evolving loops plateau, and what sustained improvement needs.
- **Setting:** one LLM, updated each iteration on the tasks, solutions and verification signals it produced, with "no external labelled dataset, teacher model, or reward model"; proposing is "optionally conditioned on external context" (§2.1).
- **Measurement (§4; App. A):** epiplexity by prequential coding (Alg. 1), with LoRA fine-tuning of Qwen2.5 models as observers, and 10% of each dataset held out for bounded entropy.
- **Experiment 1:** data from three proposer LLMs (Qwen2.5 7B, Qwen2.5 14B, Qwen3 4B) on the three task types, observed by Qwen2.5 solvers of several sizes (§4; App. A; Fig. 5). The paper calls these proposers increasingly "stronger" (§4); how strength is ranked is not discussed.
- **Experiment 2:** Absolute Zero's RL self-play on Qwen2.5 3B for nine iterations; that model is also the observer (App. A; App. C).

## Approach

- **Asymmetric co-evolution (§3.1, Fig. 4).** The premise: "In many tasks, proposing and verifying are substantially easier than solving". RL can let the internal environment train a stronger Solver; for sustained self-evolution its gains must flow back so the Verifier's capacity scales with it and the Proposer "remains at the Solver frontier". Transformations of a fixed source "do not create new Shannon information", but "can redistribute learnable information across forward and inverse directions under bounded computation when the inverse mapping is computationally hard". Illustration (Eq. 5, citing Finzi et al. (2026)): for a polynomial-time computable one-way permutation, secure against non-uniform probabilistic polynomial-time inverters with negligible success probability, applied to a uniformly random input, predicting the input from the output is harder for polynomial-time observers than the reverse, by at least a logarithmic number of bits. A gap beyond the Solver's capacity "appears as time-bounded randomness": structure it cannot find within its compute looks like noise. Practice suggestions: order synthetic directions by the gap between proposing or verifying and solving, an "asymmetry ladder"; Proposer rewards such as a 50% Solver pass rate can "partially address synchronisation", though "multi-reward training is often unstable"; or proposer data can be back-translated, i.e. questions written from a stronger Solver's solutions.
- **Capacity growth (§3.2).** "Most self-play loops fix the observer across iterations"; sustainable self-evolution "instead requires budgets that grow with iteration". If every observer within the smaller budgets is also within the larger ones, the bounded MDL under the larger budgets is no larger. When tasks demand longer reasoning and the inference budget stays fixed, "errors stem from truncated inference rather than learnable deficiencies". Practice suggestions: a smaller Proposer/Verifier trains a larger Solver and is refreshed from it; parameters are added across iterations; reasoning length adapts.
- **Proactive information seeking (§3.3).** "A closed self-play loop without external interaction is bounded by information already present in the current system", and a fixed corpus does not resolve this. The authors formalise external context used only as conditioning, with a conditional bounded MDL (Eq. 6). Practice suggestions: the Proposer writes queries from Solver failures, Verifier disagreement or persistent error patterns; retrieved context becomes tasks of several difficulties; retrieval, reranking and memory co-evolve.
- **Synergy (§3.4, Fig. 3):** co-evolution as "generator", capacity growth as "receiver", information seeking as "open feeder".
- **Estimator (§4, Eq. 7, Alg. 1; App. B):** epiplexity is the prequential pass's loss minus the trained model's loss, read at the epoch that minimizes a per-token MDL score (epiplexity plus validation loss).

## Results

- **Experiment 1 (§4, Fig. 5; no value labels in the PDF).** The authors report that (1) stronger proposers' data contains more learnable information; (2) as Solver size grows, learnable information "first increases and then decreases", which they explain as a model past "a certain budget threshold" opting "for direct memorisation"; (3) induction is "substantially higher than abduction and deduction". They write that these "preliminary experiments support our claim": "effective co-evolution is necessary to continuously increase learnable information; otherwise, simply increasing the proposer’s capacity may in fact reduce the information content" (§4).
- **Experiment 2 (§4, Fig. 6; App. C, Tab. A1).** Information "does not increase steadily but instead fluctuates dramatically"; without a mechanism to close the loop and with only multi-reward RL (several rewards at once), "the model fails to achieve sustained evolution", which "manifests as a decline in Solver capability and a collapse of the problem patterns generated by the proposer" (§4). In Tab. A1 the induction epiplexity moves between 75.7 and 474.3 thousand bits across iterations, while, for example, the abduction solver reward rises from 0.147 to 0.941. The authors write that this divergence "illustrates why monitoring reward alone is insufficient to detect the collapse phenomena" (App. C). They say epiplexity can indicate whether Absolute Zero's "reward seesaw" (rewards swinging between the roles), which they reproduce, reflects learnable structure or "merely zero-sum reward redistribution between the proposer and solver" (App. C).
- **Alternative views (§5):** reward optimisation is "necessary but not sufficient"; so is capacity scaling ("rather than a sufficient explanation on its own").

## Limits the authors state

- "a preliminary approach", "far from a fully mature, off-the-shelf solution" (§7).
- "closing the asymmetry gap is currently applicable only in domains that are easy to verify"; the hard-to-verify side needs "more cross-domain, generalizable methods" (§7).
- Learnable information "cannot replace metrics related to final task accuracy": "not all learnable information is necessarily useful for task completion", so both are needed (§7).
- Epiplexity "isn't yet widely validated" (§7).
- Proactive information seeking "remains a major challenge": the model must recognise what it does not know and phrase it as a query, "an inherently difficult research problem" (§7).
- The experiments are "small-scale" and "diagnostic rather than exhaustive" (§4).
- A robust self-evolving system "still requires overcoming numerous challenges" in models, data, algorithms and infrastructure (§8).

## Open problems and building blocks

  - "it is less clear whether improvements in the Solver reliably induce corresponding gains in the Proposer and Verifier" (§3.1 Gaps).
  - Verifier-free RL, where the reward is "typically" the probability of the reference answer given the model's reasoning (§3.1 Practice); "activated subset growing", activating more of a sparse model, e.g. experts or layers (§3.2).
  - Evaluating progress "not solely by downstream accuracy" but by bounded-observer metrics such as epiplexity (§8).
- **Released:** Nothing stated.
- **To reuse it:** the public Absolute Zero repository and hyperparameters, LoRA observers and App. A's settings; App. B adapts the estimator to small datasets.

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
