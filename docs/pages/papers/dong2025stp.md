# STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving

**STP** · ICML 2025

Read: [PDF](https://arxiv.org/pdf/2502.00212) · [arXiv](https://arxiv.org/abs/2502.00212)  
Code: [STP](https://github.com/kfdong/STP)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- One model is both conjecturer and prover: conjectures barely provable by the current prover train the conjecturer, and the prover uses expert iteration (abstract).
- Checked by Lean and Isabelle (abstract).
- Proposer–solver self-play with a sound checker (our characterization), cited by [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") (§1): it reports proving 28.5% of LeanWorkbook, its own training set, cumulatively over the whole training run (abstract, §4.2).

## In plain words

LLM provers are often improved by sampling many proofs, keeping those a proof checker accepts, and fine-tuning on them. The authors say this "quickly plateaus due to the scarcity of correct proofs": on hard problems correct samples are rare, and a fixed problem set limits how hard training can get (abstract, §1). They build STP, in which one model plays two roles: a conjecturer that writes new statements related to ones already proved, and a prover that tries to prove the dataset's problems and these conjectures. The conjecturer is trained on conjectures the current prover proves in only a small share of attempts, pushing it towards harder ones (abstract, §1).

With the Lean proof checker, STP proves 28.5% of its training problems (LeanWorkbook, math problems machine-translated into Lean) over the whole run, which the authors call "doubling the previous best result of 13.2% achieved through expert iteration" (abstract). They report "state-of-the-art performance among whole-proof generation methods" (writing a complete proof per attempt) on three test benchmarks at 3,200 samples per problem (abstract). They present it as an improvement.

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [expert iteration](#/glossary/expert-iteration) · [self-play](#/glossary/self-play) · [curriculum learning](#/glossary/curriculum-learning) · [pass@k](#/glossary/passk) · [autoformalization](#/glossary/autoformalization) · [tactic](#/glossary/tactic) · [reinforcement learning](#/glossary/reinforcement-learning) · [Wasserstein distance](#/glossary/wasserstein-distance)

**The paper's own terms:**
- **statement / conjecture**: a problem from a given dataset, and one the model generated, "Unless otherwise stated" (§3).
- **lemma**: a result used inside a proof. The conjecturer gets a seed statement, its proof and one lemma that proof uses; a fixed trivial lemma lets the model conjecture "without focusing on any particular direction" (§3.1; App. A.1).
- **expert iteration**: alternating between generating proofs and fine-tuning on the correct ones (abstract); §1 says RL (reinforcement learning) on datasets without solutions is "Often referred to as expert iteration".
- **empirical pass rate**: the share of the K proofs sampled for one statement or conjecture that the checker accepts (§3.2). The conjecturer trains on conjectures with a pass rate in (0, 1/4] (§3.2), the paper's "barely provable" (abstract).
- **cumulative pass rate**: "the fraction of statements proved during the entire training", the main measure of training progress (§4.2).
- **whole-proof generation vs tree search**: whole-proof methods sample complete proofs, budgeted by proof count; tree-search methods "use LLMs to generate single proof steps conditioned on the current verifier's proof state", budgeted in proof steps, with one exception (§4.2, Tab. 1 and its footnotes).
- **elegancy filter**: drops conjectures whose shortest correct proof, divided by the conjecture's length, is in the lowest 20% (§3.2; App. A.3, Alg. 2).

**Builds on:**
- Expert iteration (Anthony et al., 2017) and its use in provers (Kaliszyk et al., 2018; Xin et al., 2024b; Ying et al., 2024; others), which STP's prover keeps (§1). None on this site.
- Wu et al. (2024), InternLM2.5-StepProver, a tree-search prover: its finding that expert iteration "often saturates at a low pass rate" and its 13.2% on LeanWorkbook motivate STP (§1). Not on this site.
- DeepSeek-Prover-V1.5 (Xin et al., 2024b), an LLM prover for Lean: its SFT (supervised fine-tuning) model is the Lean base model; its SFT and RL models are baselines (§4.2, Tab. 1, Fig. 3). Not on this site.
- Poesia et al. (2024), "The closest related work": conjecturing–proving self-play with a finite action space, trained from scratch (§2). Not on this site.

## Problem and setting

- **Question:** can a prover keep improving with no new problems? "We need an algorithm that can run and self-improve indefinitely" without more data (§1).
- **Correctness:** the checker accepts the proof. Lean: all tactics allowed, 200 s and 15 GB per proof (§4.1). Isabelle: through PISA (an interface to Isabelle), 10 s per step and 360 s per proof, with the advanced tactics `sledgehammer, mason, smt, metis, sos` disabled because they "require huge CPU compute" (§4.1).
- **Data:** LeanWorkbook de-duplicated to 89,221 Lean 4 statements (App. A.4). For Isabelle, the LLM DeepSeek V2.5 translated them (§4.1). The Lean run also trains on miniF2F-valid and ProofNet-valid, validation splits of two test benchmarks (§4.1).
- **Models:** Lean starts from DeepSeek-Prover-V1.5-SFT, itself trained by expert iteration on public datasets, among them LeanWorkbook, miniF2F-valid and ProofNet-valid, and proprietary ones (§4.2). Isabelle starts from Llemma-7b, a "generic math-focused model" (§1).
- **Budgets:** K = 32 proofs per statement or conjecture for STP, 64 for the baselines; with conjectures capped at the number of unproved statements, STP "has the same sample budget as the baseline methods per iteration" (§4.1).
- **Test benchmarks:** miniF2F-test and ProofNet-test, "formal statements of high-school level and college level math questions, respectively", and PutnamBench, "undergraduate-level mathematics competition questions" (§4.2), at commit d49896f (App. B.2).

## Approach

Three stages (§3, Fig. 1):
- **Fine-tuning (§3.1).** Prover data: statement–proof pairs from proof libraries. Conjecturer data: (lemma, theorem X, theorem Y) triples from one library file, in that order, where the lemma is used in both proofs; input the lemma and X with its proof, output Y.
  - Step 1: conjecturer inputs come from dataset statements with generated proofs and a lemma the checker extracts, de-duplicated, with over-frequent lemmas thinned (App. A.2, Alg. 1). Conjectures are subsampled to at most the number of unproved statements.
  - Steps 2–3: the prover samples K proofs for every conjecture and unproved statement; the checker keeps the correct ones.
  - Step 4, the conjecturer's reward: keep conjectures with an empirical pass rate in (0, 1/4] whose correct proof uses the given lemma, apply the elegancy filter, then re-weight them so their distribution is as close as possible, in Wasserstein distance, to the unproved statements, with the negative cosine similarity of the model's embeddings as the cost. The aim is to preserve diversity across topics (§3.2, App. A.5). The practical Alg. 4 caps each conjecture's weight (App. A.5). In the Lean run, miniF2F-valid and ProofNet-valid statements get matching weight 128 (the number of conjectures each is matched to) after iteration 24, against 1 before (App. A.5).
  - Prover data: correct proofs of items with an empirical pass rate below 1/2; the prover trains on a replay buffer, a pool of such proofs from the last three iterations.
  - Step 5: weighted cross-entropy, with penalties favouring shorter proofs and, in Lean, faster checking.
- **Final re-training (§3.3).** The final model is re-trained from the base model on the fine-tuning data plus all correct proofs of items with an empirical pass rate of at most 1/4, keeping at most 16 distinct proofs per item. A similar procedure refreshes the model periodically (§4.1).

## Results

- **Lean training (§4.2, Fig. 2).** After 48 iterations, 3.6M conjectures, 241M proofs and 51.3B tokens, STP's cumulative pass rate on LeanWorkbook is 28.5%, against the previous best of 13.2%, by Wu et al.'s expert iteration (§1). Fig. 2 shows "a much better scaling", in generated proofs, than expert iteration and parallel sampling (sampling with no further training).
- **Ceiling (§4.2, App. B.3).** From 20 random unproved statements judged by hand, the authors suggest that the best possible pass rate on LeanWorkbook is between 38.7% and 68.5% at 95% confidence.
- **Test benchmarks (§4.2, Tab. 1).** The final model reaches 65.0% on miniF2F-test and 23.9% on ProofNet-test at pass@3200, against 54.9% and 22.0% for DeepSeek-Prover-V1.5-RL at that budget. The authors say Tab. 1 indicates it also outperforms prior tree-search methods at "similar (estimated) inference-time budgets"; on miniF2F-test, the Fig. 3 caption says it "consistently outperforms the DeepSeek-Prover-V1.5 series". A model trained 24 iterations on LeanWorkbook alone, without the verification-time penalty (footnote 5), shows, they say, STP "also generalizes to out-of-domain theorems" (§4.2).
- **PutnamBench (§4.2, Tab. 3).** 7 of 644 problems at 128 samples and 8 at 3,200, against a prior best of 6.
- **Isabelle (§4.3, Fig. 4 Left and Middle).** Switching to the baselines from two checkpoints of a 58-iteration run, STP "consistently achieves a better scaling across the training process"; its miniF2F pass rate rises during training.
- **Ablations (§4.4).** At one Isabelle checkpoint, only 131 of 2.5M proofs for the 79K unproved statements are correct, so "expert iteration plateaus", while "at least 47%" of conjectures are proved (§1, Fig. 4 Right). Re-training with the conjecture proofs, against the proved statements alone, gives "about 2-3% performance gain (for pass@128)" on miniF2F-test and ProofNet-test (App. B.1, Tab. 2).

## Limits the authors state

- Disabling the Isabelle tactics means "sacrificing verification strength and overall performance" (§4.1).
- LeanWorkbook statements can be unprovable "due to missing assumptions in the corresponding natural language statement" (§4.2).
- Tree-search budgets are "not directly comparable" with whole-proof ones (§4.2, Tab. 1 caption).
- In preliminary experiments without the verification-time penalty, Lean checking on CPU outlasted proof sampling on TPU "for our cluster setup", a "bottleneck for STP training" (§3.2, footnote 3).
- "the model may forget some proof skills learned in the SFT stage after many iterations" with a limited replay buffer (§4.1); self-play's changing data can cause "training instability" (§3.3).
- In early experiments, "the generated conjectures tend to have mode collapse issue after several iterations of self-play training", which motivates the re-weighting (App. A.5).
- Example 2's conjecture "is somewhat unusual and the inequality is not tight" (§4.5).

## Open problems and building blocks

- **Open:** no future-work section; one direction: "it's conceivable that tree search methods can also be used with STP" (§4.2).
- **Released:** "We release our code, model, and dataset" (abstract).
- **To reuse it:** a proof checker (Lean 4 with its proof library Mathlib, or Isabelle through PISA), a pretrained base model (DeepSeek-Prover-V1.5-SFT or Llemma-7b), and statements without proofs (§4.1–4.3). Compute: mainly TPU-v4 VMs with 32 nodes of 4 TPU chips, 240 CPU cores and 400G memory each; vLLM for generation, Levanter for training (App. A.9).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
