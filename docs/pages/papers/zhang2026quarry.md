# Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs

**Quarry ("Planning to Hammer")** · preprint 2026 (submitted to OOPSLA 2026)

Read: [PDF](https://arxiv.org/pdf/2606.17981) · [arXiv](https://arxiv.org/abs/2606.17981)  
Code: [QUARRY](https://github.com/ningZhang-cs/QUARRY)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The LLM proposes decompositions of a Rocq goal into sublemmas, and CoqHammer discharges the pieces (abstract).
- Candidates are type-checked with the sublemmas admitted, ranked by a proof-state-based difficulty model that estimates hammer solvability, and solved recursively within a budget (abstract).
- LLM planning plus a symbolic hammer in Rocq, the proof assistant of FormalSQL ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)")); the released verifier's `admit` screen misses `Admitted.`.

## In plain words

Proving a program correct in a proof assistant such as Rocq (formerly Coq) means writing long machine-checked proofs, which the authors say "remains labor-intensive" and demands expertise that limits adoption (§1). LLMs "can propose high-level proof strategies but lack local rigor", while automatic tools called hammers "can reliably discharge many local goals, but lack long-range planning capabilities" (abstract). Quarry lets an LLM propose several ways to split a goal into smaller lemmas, checks in Rocq that each split would prove the goal if its lemmas were true, ranks the splits by a learned estimate of how hard their lemmas are for the hammer, and proves the lemmas recursively, hammer first.

Under a uniform 10-minute budget per theorem, with GPT-5.2 as the LLM of every LLM-based system, the authors report gains of 7 to 13 percentage points in success rate over the strongest baseline on three benchmarks (§1). They present it as an improvement over existing provers, concluding that planning is "a more effective strategy for automated proof synthesis than reactive step-by-step proving" (§9).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [formal specification](#/glossary/formal-specification) · [hammer](#/glossary/hammer-automated-theorem-proving) (CoqHammer; ATPs, automated theorem provers such as E, Vampire and Z3, §2.2)

**The paper's own terms:**
- **Rocq**: the proof assistant formerly called Coq (§2.1); its kernel checks the final proof (§1). A **proof state** is a goal plus its context of hypotheses and known facts (§2.1).
- **`Admitted`**: the Rocq command that accepts a lemma without a proof, so later steps can use it (§4.2).
- **Sublemmas** and **target proof**: a candidate decomposition is a set of lemma statements plus a tactic script meant to close the goal "assuming these sublemmas hold" (§1, §4.2).
- **Valid candidate**: its sublemmas are accepted as `Admitted`, its target proof then type-checks and closes the goal (the goal is "conditionally closed"), and it is not a trivial circularity (§4.2).
- **Difficulty model**: a linear score over 28 features of a sublemma estimating how hard it is for the hammer; easier means "more tractable for the backend, not logically weaker" (§5.4).
- **Intros-state**: the proof state after `repeat intro`, in which "all top-level universal quantifiers have been moved into the context" (§5.3).
- **Rollout budget *k*** and **top-*B***: candidates proposed per node, and ranked candidates tried per node (default 1) (§4.2, §4.3).
- **Added value AV(X | Y)**: theorems X proves that Y doesn't, as a fraction of those Y proves (§6.1.3).
- **"Internal progress"**: proofs needing long runs of rewriting or unfolding before any case split creates new goals (§6.5).

**Missing glossary terms:**
- **SerAPI**: a programmatic interface to the Rocq proof engine for submitting tactics, reading goals and collecting errors (§2.3).

**Builds on:**
- CoqHammer (Czajka and Kaliszyk 2018), the leaf solver at every node (§2.2, §4.3), and SerAPI, used to validate candidates and extract proof states (§2.3).
- Cobblestone (Kasibatla et al. 2026), called "the state-of-the-art LLM-based proof-repair method" and the "most closely related experimental baseline": it generates whole proofs and retries the failing subproofs, splitting only along Rocq's own subgoals (§3.3, §8).
- Goedel-Code-Prover (Li et al. 2026), "Closest in spirit": it also scores candidate decompositions, with an AST-based score and property-based testing, which the authors say requires executable code with generatable tests (§8).

## Problem and setting

- **Question:** given a theorem about a program and its surrounding Rocq development, "produce a complete, kernel-checked proof without manual intervention" (§1). The metric is success rate, the "fraction of theorems proven" (§6.1.3).
- **Benchmarks** (§6.1.1): CoqGym100, 100 theorems sampled from projects of CoqGym (a corpus of Coq projects); Wigderson100, 100 theorems from the coq-wigderson graph-theory verification project; and the new TransBench58, 58 problems translated to Rocq from Rust/Verus (Verus is a verifier for Rust) from the AutoVerus and VeruSAGE benchmark suites, which the authors call "substantially harder" and absent from known public Rocq proof corpora.
- **Budget** (§6.1.4): 10 minutes wall clock per theorem and 30 seconds per CoqHammer goal; "unless otherwise stated", *k* = 8, *B* = 1, recursion depth at most 5 and at most 60 LLM requests per theorem.
- **Models:** "All main comparisons (including the baselines that require LLM calls) use GPT-5.2" as the shared LLM, at temperature 1.0 (§6.1.4); other models appear only as sensitivity runs (§6.5).

## Approach

Quarry runs a Generate–Rank–Solve loop at each proof node (§4.1, Fig. 2, Alg. 1).

- **Generate (§4.2):** the LLM writes up to *k* candidates as `[LEMMA]` blocks and one `[TARGET]` block; unparseable answers are dropped, and a Rocq-based verifier keeps only valid candidates. Fig. 3 walks the running example's root goal through this step.
- **Rank (§5.3–5.4, Tab. 1):** each sublemma's difficulty is a weighted sum of 19 intros-state features (sizes of goal and hypotheses, counts of logical and program constructs) and 9 raw-statement features. A candidate's score is, by default, the maximum over its sublemmas (mean or sum are options), penalizing a single "bottleneck" sublemma; candidates are tried easiest first. The ranker "deliberately avoids expensive semantic analysis such as recursive unfolding".
- **Learning the weights (§5.5, Alg. 2):** runs log every candidate and whether its recursive attempt succeeded; in "dense-supervision mode" all candidates at every node are tried, so other ranking policies can be scored by replaying logs without new LLM calls (§4.3). A pairwise margin loss pushes successful candidates below failed ones at the same node, trained on 200 goals from CoqGym projects disjoint from all three test benchmarks.
- **Solve (§4.3, Alg. 1):** depth-first; CoqHammer is tried first at every node, and the LLM decomposes only if it fails. With *B* = 1 the node commits to the top candidate and fails, with no alternative tried, if any sublemma fails. The authors state that "a goal is returned as solved only after Rocq has accepted a proof script in which all previously admitted sublemmas have been discharged".
- **Why decompose (§5.1):** in a "simplified tactic-level proof-search model", cost grows exponentially with proof length, so splitting a goal into independent subgoals whose depths sum to the original length is cheaper, least costly when the depths are equal, "in this model"; the authors argue the same holds for hammers, whose cost "grows superlinearly with goal complexity", and prefer subgoals "of roughly equal and individually low difficulty".

## Results

The authors' results; "The reported main results are single runs" (§6.5).

- **Main comparison (Tab. 2, §6.2):** Quarry proves 55%, 52% and 16% (9 of 58) on CoqGym100, Wigderson100 and TransBench58, against 48%, 39% and 3% for the strongest baseline, PALM (a retrieval-augmented LLM prover), and 38%, 35% and 2% for Cobblestone. Other baselines: CoqHammer alone, Proverbot9001 (neural tactic prediction with search), Tactician (online-learned tactics), ChainOfThought (one whole proof per prompt) and Rango (a Coq prover with a fine-tuned LLM that retrieves premises and similar proofs; [Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)")). The non-LLM baselines prove no TransBench58 theorem.
- **Stronger leaf solver (§6.2, Fig. 7):** Cobblestone instead of CoqHammer at the leaves, with a 20-minute budget, proves 126 of 258 theorems against 116.
- **Efficiency (§6.3, Figs. 4–5):** "The majority of successful proofs complete quickly". Quarry uses fewer LLM requests per theorem than Cobblestone on all three benchmarks, and more tokens on Wigderson100. The authors attribute Cobblestone's lower scores to repair loops exceeding the time limit.
- **Ablations (Tab. 3, §6.4):** without ranking, success falls from 55/52/16% to 51/49/12%, with more LLM requests on CoqGym100 and Wigderson100. Without CoqHammer it is 41/23/9%; hammer on the root goal only, then Quarry without the hammer, gives 49/40/9%.
- **Budget and models (§6.5, Figs. 6, 8):** more candidates per node help until gains "plateau". GPT-5.4 does better than GPT-5.2; Claude Sonnet 4.6 with thinking, MiniMax-M2.5 and DeepSeek-v3.2 do worse, the last two still beating CoqHammer alone. Three MiniMax-M2.5 runs show "standard deviations of at most 1.5 percentage points".
- **Proof trees (Tab. 4, §6.5):** for the 116 proved theorems, the authors conclude "a single round of decomposition is usually sufficient to reduce goals to the backend's reach".
- **Ranking design (Tab. 5, §6.6):** in offline replay, all 28 features and max aggregation are best on all three benchmarks; statement-only features fall below no ranking on CoqGym100 and TransBench58, which the authors attribute to distribution shift.

## Limits the authors state

- Proofs with "internal progress" "lack natural decomposition points", and Quarry "provides no benefit over monolithic tactics for such sequential obligations" (§7); "when even the LLM cannot identify a meaningful decomposition, Quarry still fails" (§6.5).
- "Quarry's pipeline is one-shot: it cannot use execution feedback to generate new candidates" when all pre-generated decompositions "fail for the same reason" (§7).
- "the overall ceiling is largely determined by CoqHammer's capabilities"; "goals requiring induction or higher-order reasoning remain difficult even after decomposition" (§7).
- Rocq-specific: porting to Lean 4 or Isabelle "would require reimplementing the proof-state interface and leaf-solver integration" (§7).
- The ranker "can miss difficulty hidden behind opaque definitions or relations" (§5.4).
- Threats: possible overlap of benchmarks with LLM training data; performance "can vary with the LLM backend, prompt template, Rocq version, and ATP configuration"; and the budgets (§7). "The reported main results are single runs" (§6.5).

## Open problems and building blocks

- **Open:** an "agentic" architecture, "a proof agent that observes execution failures and revises its decomposition strategy", including for "internal progress" proofs; porting to Lean 4 or Isabelle "to test the generality of the framework" (§9).
- **Released:** the source code, the three benchmarks with their Rocq project environments, "the learned difficulty model weights", prompt templates and reproduction scripts (§ "Data-Availability Statement").
- **To reuse it:** Python on SerAPI and CoqHammer (§6.1.4); no model fine-tuning, which the authors say makes it "straightforward to swap in stronger LLMs" (§8); logged runs to fit the ranking weights (§5.5). The framework is "agnostic to the choice of automation backend" (§4.1).
- **Beyond its domain:** "the general idea is applicable to other ITPs" (interactive theorem provers) (§1).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/prove-general">prove-general</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
