# When to Trust the Cheap Check: Weak and Strong Verification for Reasoning

**When to Trust the Cheap Check** · (weak and strong verification, SSV), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.17633) · [arXiv](https://arxiv.org/abs/2602.17633)  
Code: [weak-and-strong-verification](https://github.com/nooranisima/weak-and-strong-verification)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A policy decides for each output whether to accept or reject it on a cheap "weak" verifier's score (self-consistency, proxy rewards) or to defer to a costly "strong" verifier (a user, a check against ground truth); its errors are incorrect acceptance (type I) and incorrect rejection (type II) relative to the strong verdict, plus how often the strong verifier is called (abstract; §3).
- If the weak score is calibrated (Assumption 4.1), an optimal one-shot policy has two thresholds on it, and calibration and sharpness govern a weak verifier's value (§4, Thm. 4.2, Prop. 4.3); the online algorithm SSV tracks the thresholds and, the authors claim, keeps each error below its target plus a finite-sample slack with high probability, with no assumptions on the query stream, the model or the weak verifier (abstract; §5, Thm. 5.1; its printed proof needs repair). Tested on MATH candidates (DeepSeek-Chat scores them; an LLM compares the answer with the label as strong verifier: GPT-4o per App. B.4, gpt-4o-mini per the released data) and on 4×4 Sudoku moves checked by a program (§6; App. B.4).
- When a cheap verdict may stand and when to escalate to a sound check, with both error kinds bounded, the shape of a cascade from an LLM judge to a prover or test. On MATH the strong verifier is itself an LLM (App. B.4).

## In plain words

LLM systems check outputs with cheap signals such as [self-consistency](#/glossary/self-consistency-majority-voting) or proxy rewards (weak verification); user inspection is strong verification, trustworthy but costly (abstract). The authors seek strong checking's reliability while calling it on only "a small, carefully chosen fraction of the reasoning process" (§1). Policies use the weak score alone to accept, reject or call the strong check; they are scored by wrong acceptances and rejections (per the strong check) and strong calls (§3). In a one-shot population model with calibrated weak scores, an optimal policy uses two cut-offs (§4). Their online algorithm, Selective Strong Verification (SSV), tunes both cut-offs; they prove that, with high probability, each error rate stays below a user-set target plus a slack that shrinks over rounds, with no assumptions on the queries, model or weak verifier (abstract; §5). On 4×4 Sudoku with both targets at 0.01, it reports 43.1% accuracy with 2.87 strong calls per puzzle against 44.2% with 5.32 checking every step (§6.2, Tab. 1). They say this interaction, "To the best of our knowledge", "has not been explicitly formulated or analyzed" (§2).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [selective prediction](#/glossary/selective-prediction) · [Pareto front](#/glossary/pareto-front)

**The paper's own terms:**
- **weak verification**: a fast check scoring each prompt–response pair from 0 to 1, higher meaning more likely correct, e.g. self-consistency, learned critiques, proxy rewards (§1, §3); in the experiments, DeepSeek-Chat (a general LLM) prompted for a score (App. B.4).
- **strong verification**: a costly yes/no verdict, "such as human inspection or domain specific executions", that "serves as the ultimate criterion against which reasoning outcomes are evaluated" (§3). In the experiments: GPT-4o judging a MATH answer equivalent to the dataset's, and a program checking a Sudoku move against the solution (App. B.4).
- **weak–strong verification policy**: maps each weak score to accept, reject, or call the strong verifier and follow it (§3).
- **type-I error**: the share of responses the strong verifier would call incorrect that the policy accepted; **type-II error**: the share it would call correct that the policy rejected; **strong verification frequency**: the share of rounds that call it (§3). **α, β**: the user's targets for the two errors (§5).
- **sharpness**: how often the weak score lies near 0 or 1 (§4); App. B.3 measures it as the score's distance from 0.5.
- **exploration probabilities**: small chances that SSV calls the strong verifier even on decisive scores (§5, Alg. 1).
- **Strong-Only (Oracle)** calls the strong verifier on every query; **Weak-Only (Greedy)** generates n candidates and accepts the highest-scoring one, never calling it (§6 "Baselines"). "Oracle" means the strong verifier, not ground truth.

**Missing glossary terms:**
- **calibration**: a score is calibrated when, among responses scored p, a fraction p is correct; here, correct by the strong verifier (Assumption 4.1).
- **learning to defer (L2D)**: in the paper's words, it extends selective prediction "to human-AI collaboration, studying the optimal division of labor between model and expert" (§2).
- **online conformal prediction and quantile tracking**: methods that adjust a threshold after each outcome so a long-run error rate tracks a target, with no assumptions on the data (general definition; named, not defined, in §5).
- **importance weighting**: dividing an observed value by the chance it was observed, to keep averages unbiased (§5).

**Builds on:**
- Selective prediction and learning to defer, e.g. Gangrade et al. (2021), Mozannar and Sontag (2021): "Our setting can be viewed as an instance of L2D, where deferral means invoking strong verification" (§2).
- Online conformal prediction and quantile tracking (e.g. Gibbs and Candès 2021): one term of the bound is "the same fundamental limitation" as in these (§5).
- Outcome and process reward modeling, Cobbe et al. (2021) ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")) and Lightman et al. (2023) ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")): the two cases the query stream resembles (§3) and the experiments mirror (§6).
- Work improving the weak verifier, e.g. Zhang et al. (2025) ([Generative Verifiers (GenRM)](#/papers/zhang2024genrm "Generative Verifiers: Reward Modeling as Next-Token Prediction (2025)")): taken as fixed; their work is "orthogonal" (§2).

## Problem and setting

- **Question:** "Can we match the reliability we would get if strong verification were applied at every step, while deploying it on only a small, carefully chosen fraction of the reasoning process?" (§1)
- **Setting (§3):** an unrestricted stream of queries, e.g. a prompt (response: an answer) or a prompt plus partial solution (response: a step); it "may depend arbitrarily on past verification outcomes". The strong verdict is seen only when called.
- **Population analysis (§4):** a one-shot version (one prompt–response pair from a fixed distribution) to find the shape of optimal policies, not the sequential problem. Calibration is assumed only here: "we do not rely on calibration in the next section".
- **Experiments (§6, App. B.4):** MATH (Hendrycks et al.'s math problem-solving benchmark), difficulty levels 2, 3 and 5, GPT-4o-mini generating candidates one at a time until one is accepted or a budget n is used up; and 4×4 Sudoku (mini-sudoku dataset, Shahab, 2023), each query the board, each response GPT-4o-mini's next digit and cell.
- **Not discussed:** the published text gives no value for n, no count of problems or puzzles, no exploration probabilities used, and no definition of the accuracy reported.

## Approach

- **Two thresholds (Thm. 4.2):** in the one-shot population setting, if the weak verifier is calibrated with respect to the strong one (Assumption 4.1), then for any non-negative weights on the two errors in the objective (strong-verification rate plus weighted error rates, Eq. 1) there exists an optimal policy that rejects below a low threshold, calls the strong verifier between, and accepts above a high one.
- **Value of a weak verifier (Prop. 4.3):** under the same assumption, the best objective averages, over weak scores, the cheapest of three costs: a strong call, the weighted risk of a wrong acceptance, or of a wrong rejection. The "Takeaway": calibration "makes its scores interpretable as correctness probabilities, while sharpness makes it effective by producing decisive scores near 0 or 1" (§4).
- **SSV (§5, Alg. 1):** above an accept threshold it accepts, below a reject threshold it rejects, each except with a small exploration probability, when it calls the strong verifier; between them it always calls it. Thresholds move only when the strong verdict is seen: the accept threshold so that the share of strong-verifier-incorrect responses scoring above it tracks α (with importance weighting), the reject threshold likewise for β. Exploration gives feedback in decisive regions (§5 "Why randomized…").
- **Guarantee (Thm. 5.1):** for a fixed horizon, a constant step size, exploration probabilities fixed from past history, in (0, 1] with a positive minimum, and starting thresholds in [0, 1] with the reject threshold not above the accept one: for any confidence level, with at least that probability over the algorithm's own randomness, type-I error is at most α plus a slack and type-II at most β plus a slack, for any query stream. Each slack shrinks as the rounds the strong verifier would reject (or accept) grow, and grows as the step size or minimum exploration probability shrinks.

## Results

- **Error control (§6.1, Fig. 2):** with α = β = 0.15, running-average errors "stabilize near the nominal targets" on MATH and Sudoku. At α = β = 0.10 the final MATH type-II errors are .117 to .127 (App. B.1, Tab. 3).
- **Sudoku (§6.2, Tab. 1):** Strong-Only reaches 44.2% with 5.32 strong calls per puzzle; SSV at α = β = 0.01 reaches 43.1% with 2.87, "a 46% reduction in the load on the strong verifier"; Weak-Only reaches 33.6% with none. SSV uses 4.8–5.2 weak calls per puzzle against Weak-Only's 6.00 (§6.2).
- **MATH (§6.2, Fig. 3):** on the Easy subsets, steeper curves and "near-Oracle accuracy with only a fraction of the strong verifier calls" (plots only). On level 5, "higher accuracy requires an approximately proportional increase in strong verification": SSV reaches 60% with 2 calls per problem against Strong-Only's 63.5% with 2.8.
- **Weak scores (App. B.3):** mean sharpness is 0.467, 0.448 and 0.358 on levels 2, 3 and 5 (Tab. 7); the authors link the more linear level-5 curve to this and to more overlap between scores of correct and incorrect answers (Tab. 8, Figs. 12–14).
- **Asymmetric targets (App. B.2, Figs. 9–11):** fixing one target and sweeping the other gives "a family of frontiers indexed by which error type is held fixed".

## Limits the authors state

- "A key limitation of the current framework is that the decision to use strong verification depends only on the weak score, and not on the broader prompt–response context", so the guarantees hold "only in a marginal sense, averaged over all rounds". They "view this as a modeling choice rather than a fundamental limitation"; contextual policies need "more complex online calibration procedures, including context-dependent thresholds and conditional error control under partial feedback", left "as an important direction for future work" (§7).
- One term of the bound would remain even if the strong verdict were always seen: "the same fundamental limitation that appears in online conformal prediction and other quantile-tracking procedures" (§5).
- Larger exploration probabilities "make error control easier, but increase the frequency of strong verification calls"; they "should be treated as tunable hyperparameters" (§5).
- For fixed model and verifiers, "enforcing sufficiently small type-I and type-II error rates may necessarily require a higher frequency of strong verification calls" (§3).

## Open problems and building blocks

- **Open:** the context-dependent extension under the limits above (§7); none other stated.
- **Released:** code ("Code available at", footnote to the abstract); "all prompt templates for both tasks" (App. B.4); hyperparameters and final errors "for reproducibility" (App. B.1, Tabs. 2–6).
- **To reuse it:** a weak score in [0, 1] and a yes/no strong verdict; SSV takes the targets, exploration probabilities, step sizes and starting thresholds (Alg. 1). Experiments prompt GPT-4o-mini, DeepSeek-Chat and GPT-4o (App. B.4). No hardware, run time or cost is stated.
- **Beyond its domain:** the framework "applies to any reasoning procedure (single pass, iterative refinement, or tree search) and any scoring model", and its techniques "may be of independent interest to the broader umbrella of L2D" (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
