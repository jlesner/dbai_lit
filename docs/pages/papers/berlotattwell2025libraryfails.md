# Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour

**Is This LLM Library…** · EACL 2026

Read: [PDF](https://arxiv.org/pdf/2504.03048) · [arXiv](https://arxiv.org/abs/2504.03048) · [DOI](https://doi.org/10.18653/v1/2026.eacl-long.163)  
Code: [llm_lib_learning_fails](https://github.com/ikb-a/llm_lib_learning_fails)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-runs three in-context library-learning systems, LEGO-Prover (Isabelle lemmas, miniF2F), TroVE and AgentOptimizer (Python functions and tools, MATH and table QA), and measures whether what they learn is reused directly (all three, §3.1–3.2) or by editing (LEGO-Prover only, §3.2) (abstract; §1; §3).
- Gives the LEGO-Prover and TroVE baselines about the same compute, matched by a token-cost proxy (§4.1); AgentOptimizer showed no gain over its baseline even without that correction, so none was run (§4.1–4.2, Tab. 4). LEGO-Prover runs with five LLMs, from Llama3.1-8B to o3-mini (§3.2, Tab. 2–3).
- A library whose entries a prover checks is still barely reused: the authors report "no evidence of the direct reuse of learned lemmas" in LEGO-Prover (abstract), though their Tab. 2 shows one lemma reused verbatim (App. H), and evidence against soft reuse (§3.2, Fig. 4), and accuracy gains that "often vanish or reverse" once compute is matched (abstract; §4.2, Fig. 6–7), which they suggest "may be largely or wholly due to hidden test-time scaling" (§6). Bears on [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory).

## In plain words

Some LLM systems learn a "library": while solving problems they write helper functions, tools or lemmas, store them and use them again, by prompting alone. Such systems often promise better accuracy and lower cost. The authors argue that "a large number" of these works "do not correct for the difference in computational cost" between baseline and library-learning system (abstract, PDF p. 1). They re-run three published systems, count how often stored items are reused, and compare each with its baseline while accounting for compute. They report that "all of them fail to consistently outperform the simple baseline of prompting the model", as gains "often vanish or reverse" once compute is accounted for (abstract, PDF p. 1). In the theorem-proving system they study in depth, they find "no evidence of the direct reuse of learned lemmas" and evidence against reuse by editing (abstract, PDF p. 1). The authors present negative results from what they call "the first cost-controlled comparison of LLM library learners that we are aware of" (§6, PDF p. 9).

## Background and terms

**Terms to know:** [compute-matched comparison](#/glossary/compute-matched-comparison) · [test-time scaling](#/glossary/test-time-scaling) · [proof assistant](#/glossary/proof-assistant) · [autoformalization](#/glossary/autoformalization) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)

**The paper's own terms:**
- **Library learning**: "the creation and exploitation of reusable and composable functions, tools, or lemmas" (abstract, PDF p. 1), here by in-context learning (ICL). "Genuine library learning requires reuse, rather than (single) use"; creating a bespoke tool useful for one query only is a form of test-time scaling (§3, PDF p. 2).
- **Direct use and reuse** (§3.2, PDF p. 4): a retrieved lemma is used if its text (**verbatim use**) or its name (**name use**) appears in LEGO-Prover's output, and "reused n times" if used in n + 1 proofs. For TroVE and AgentOptimizer, reuse is calling a library function or learned tool in a correct solution (§3.1, PDF p. 3).
- **Soft use and soft reuse** (§3.2, PDF p. 4; App. F, PDF p. 24): reuse of "fragments reproduced with minor edits" (§3, PDF p. 2). The **soft-use score** is the share of a lemma's tokens appearing in order in the proof (longest common subsequence over lemma length). At a threshold τ, a solved task shows soft use if a retrieved lemma scores at least τ, and soft reuse if another task soft-uses it too; **survival curves** plot these shares against τ.
- **CC↓ and CC↑** (compute-corrected; Fig. 6, PDF p. 6): "LP (CC↓)" is LEGO-Prover with iterations cut to match its baseline's cost; "Direct (CC↑)" is TroVE's baseline given more samples.
- **PROVER and EVOLVER** (§2, PDF p. 2): LEGO-Prover's two process pools; the PROVER formalizes proofs using retrieved lemmas, the EVOLVER proves, revises and adds requested lemmas.
- **SKIP, IMPORT, CREATE** (§2, PDF p. 2): TroVE's prompt modes (5 samples each): answer directly, use the library, or write and use a new function.

**Builds on:**
- LEGO-Prover (Wang et al., 2024b; [LEGO-Prover](#/papers/wang2023legoprover "LEGO-Prover: Neural Theorem Proving with Growing Libraries (2024)")), which turns natural-language proofs into proofs checked by the Isabelle proof assistant, growing a lemma library; its baseline Draft-Sketch-Prove (DSP; Jiang et al., 2023) uses ICL and post-processing heuristics to produce an Isabelle proof (§2, PDF p. 2).
- TroVE (Wang et al., 2024d), which writes Python for math word problems and grows a function library online; AgentOptimizer (Zhang et al., 2024), which trains a library of Python tools offline, against ReAct (Yao et al., 2023; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), a reason-and-act agent with a Python interpreter (§2, PDF p. 2).
- Berlot-Attwell et al. (2024), whose reuse test the paper uses (§3.2, PDF p. 4) and who reported low direct reuse (§5, PDF p. 8).

## Problem and setting

- **Questions** (§1, PDF p. 2): "1) Do these systems exhibit library learning behaviours? 2) Does this behaviour improve performance?"
- **The flaw** (§4, PDF pp. 5–6): typically, comparing at equal iterations, "a standard practice seen in many ICL library learning works", e.g. the LLM agents Voyager and Dynasaur. TroVE and AgentOptimizer compare single attempts, ignoring "the cost of creating and ingesting the library"; LEGO-Prover's attempt count ignores its EVOLVER.
- **Benchmarks:** LEGO-Prover on the Isabelle miniF2F test set (244 formal olympiad-level problems; App. J, PDF p. 34) with human-written proofs as input (App. B, PDF p. 13); TroVE on MATH (competition math) and the table question-answering sets TabMWP, HiTab and WTQ; AgentOptimizer on MATH with random 20-problem training and 80-problem test subsets (§3.1, PDF p. 3; App. G.3, PDF p. 32).
- **Models:** LEGO-Prover with gpt-4o-mini and Llama3.1-8B on the full test set, o3-mini, Qwen3-14B and gpt-4o on 10% or 20% subsets (Fig. 6, PDF p. 6); TroVE with CodeLlama-7B and Llama-3.1-8B; AgentOptimizer with gpt-4o-mini, and gpt-4o on two MATH splits (§3.1, PDF p. 3).
- **Correctness:** a proof counts when Isabelle verifies it (§2, PDF p. 2); reuse counts only in correct answers, since "reuse in wrong answers cannot explain performance gains"; for this count a TroVE problem is solved, "optimistically", if one IMPORT solution succeeded (§3.1, PDF p. 3).
- **Compute** is "approximately" equalized by "matching a weighted sum of input and output tokens", weighted by API price for proprietary models and 1:1 for open ones (§4.1, PDF p. 6).

## Approach

- **Reuse** (§3.1–3.2, PDF pp. 3–5): the measures above (3 runs), plus each lemma's embedding similarity to its two most similar proofs (Fig. 5), control lemma pools (App. C.1, PDF pp. 13–15) and the original LEGO-Prover logs (App. C.1.2, PDF p. 14).
- **Compute matching** (§4.1, PDF pp. 6–7): cut LEGO-Prover's iterations to DSP's cost (Tab. 3), or raise DSP's (Fig. 7); give TroVE's SKIP-only baseline 15 samples, not 5, and replace TroVE's two-stage vote by one majority vote over all 15 answers (App. G.2, PDF p. 32); count AgentOptimizer's training cost (Tab. 4).

## Results

- **TroVE and AgentOptimizer** (§3.1, PDF p. 3): both show direct reuse, but "TroVE does not reliably learn functions", and its learned functions are "largely trivial"; AgentOptimizer's "tend to be extremely generic" (Tab. 19, PDF p. 33).
- **LEGO-Prover reuse** (§3.2, PDF pp. 4–5): "Virtually zero reuse is observed in our data, or the original Wang et al. (2024b) logs" (Tab. 2); with Llama3.1 on the full test set, one of 721 retrieved lemmas was reused verbatim. The soft-reuse curves "rapidly reach zero for even moderate similarity thresholds" while soft use stays "relatively high" (Fig. 4), which "suggests that soft reuse is not occurring" (§3.2, PDF p. 5); semantic similarity shows "a sharp drop" after the most similar proof (Fig. 5).
- **Cost** (§4.1, PDF p. 6): LEGO-Prover "requires 6-14 times more compute per iteration" than DSP (Tab. 3).
- **LEGO-Prover at matched compute** (Tab. 3, PDF p. 6): e.g. gpt-4o-mini 25.8% at equal iterations and 17.5% at DSP's cost, against DSP's 35.9%. With Llama3.1 the cut LEGO-Prover still leads, 15.7% against DSP's 8.2%. Given more iterations, DSP "typically remains within one standard deviation or outperforms LEGO-Prover throughout"; "Llama3.1 is the exception" (§4.2, Fig. 7, PDF p. 7).
- **Ablation** (§4.2, PDF p. 7): Llama3.1 LEGO-Prover with no lemma sharing between problems scores 30.9 ± 1.3% against 29.0 ± 2.1% for the full system, which the authors say shows its gain over DSP is "not attributable to any form of reuse".
- **TroVE** (Tab. 5, PDF p. 6): "the performance gap typically vanishes" at matched budget (§4.2, PDF p. 7); with Llama3.1 the baseline "consistently outperforms or matches TroVE across all domains", and with CodeLlama it "achieves results similar to TroVE" (App. G.2, PDF p. 32).
- **AgentOptimizer** (§4.2, PDF p. 7): "no improvement over the baseline under the original evaluation methodology while still incurring higher costs", e.g. gpt-4o on MATH geometry 64.2% against ReAct's 66.3%, at $11.22 against $1.28 (Tab. 4, PDF p. 6); counting training, it uses "5-8 times more compute" (§4.1, PDF p. 7).
- **Reading** (§6, PDF pp. 8–9): the benefits "may be largely or wholly due to hidden test-time scaling", though the findings "do not demonstrate that ICL LLM library learning cannot work".

## Limits the authors state

- Three LLMs ran on miniF2F subsets for cost (§7, PDF p. 9); gpt-4o and o3-mini scores "appear low" there, likely from harder problems, the authors suspect (§7, PDF p. 10).
- Fig. 7's average cost per attempt is "a slight distortion" for DSP (§7, PDF p. 9).
- The released LEGO-Prover code seeds the EVOLVER with all miniF2F test queries even on subsets; the authors "do not believe this impacts our results" (§7, PDF p. 9).
- The soft-use score misses "forms of soft reuse divorced from syntax (e.g., involving heavy paraphrasing)" and "likely scores short lemmas higher on average" (§7, PDF pp. 9–10).
- o3-mini formatting "remains imperfect" and "may reduce LEGO-Prover performance"; prompts are "suboptimal" for reasoning models (§7, PDF p. 10).
- Imbalanced compute "cannot wholly explain why LEGO-Prover outperforms Draft-Sketch-Prove under Llama3.1"; their speculation, that Llama3.1 refines code better than it writes it zero-shot, is left "for future work" (§7, PDF p. 10).
- All datasets are English; other languages are "unstudied" (App. I, PDF p. 34).

## Open problems and building blocks

  - Suspected bottleneck: these systems "may be held back by an inability to reliably produce general tools and would perform better with human-created libraries" (§5, PDF p. 8).
  - Directions (§6, PDF p. 9): add symbolic refactoring "known to work" (e.g. LILO); fine-tuning or RL "may be worthwhile", "e.g., via GRPO" (an RL method), with rewards "possibly based on compression"; stronger scaffolding may help (e.g. Librarian).
  - Evaluation (§6, PDF p. 9): library learners "should be evaluated with respect to both accuracy accounting for computational budget, and the system's behaviour", plus "a synthetic diagnostic dataset based on a known ground truth library".
- **Released:** "our collected data and code" (§7, PDF p. 9; footnote 1, PDF p. 1), including the AgentOptimizer questions (App. J, PDF p. 34).
- **To reuse it:** Isabelle 2022; LEGO-Prover used about 4.5 CPU-days (proprietary models) and 30 GPU-days (open models) (App. A, PDF pp. 12–13), TroVE about 550 GPU-hours (App. G.2, PDF p. 32).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
