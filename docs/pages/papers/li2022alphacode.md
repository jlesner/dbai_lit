# Competition-Level Code Generation with AlphaCode

**AlphaCode** · Science 2022

Read: [PDF](https://arxiv.org/pdf/2203.07814) · [arXiv](https://arxiv.org/abs/2203.07814) · [DOI](https://doi.org/10.1126/science.abq1158)  
Code: [code_contests](https://github.com/google-deepmind/code_contests)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Competitive programming: an encoder-decoder transformer, pre-trained on GitHub code and fine-tuned on the authors' CodeContests dataset, samples up to millions of C++ and Python programs per problem; programs that fail the problem statement's example tests are dropped, and the rest are clustered by their outputs on inputs written by a separate test-input model, choosing at most 10 submissions (abstract; §4.4–4.6). Evaluated on CodeContests and in simulated Codeforces contests (§5.1–5.2).
- The authors report that solve rate scales roughly log-linearly with the number of samples, with steeper slopes for larger models (§5.3.1, Fig. 6), and that without filtering and clustering it stays flat as samples grow (§5.3.5, Fig. 8).
- Sample-and-check at scale, with test suites as the check, and a measurement of tests that accept wrong programs: hand-checking one solved solution on each of 50 problems, the authors report that existing datasets have "30% or more programs which pass all tests but are not actually correct" (§1; Tab. 2). CodeContests adds mutation-generated tests that 30 correct solutions must agree on (§3.2.1).

## In plain words

Competitive programming problems describe a task in long prose and need a complete program that passes hidden tests. The authors say code-writing language models "still perform poorly when evaluated on more complex, unseen problems that require problem-solving skills beyond simply translating instructions into code" (abstract). AlphaCode, their system, is a transformer trained on GitHub code, then on a new contest dataset, CodeContests. Per problem it draws up to millions of programs, drops those failing the statement's examples, groups the rest by behaviour on generated inputs, and submits at most 10 (§1; §4). In simulated runs of 10 Codeforces contests with over 5,000 participants each, it ranked on average in the top 54.3%, with at most 10 submissions per problem (abstract; §5.1). On CodeContests its "best model" solves 34.2% of validation problems with up to a million samples and 10 submissions, against previously reported rates of around 1–5% on other datasets (§1; §5.2). The authors call it, "To the best of our knowledge, … the first time that a computer system has been competitive with human participants in programming competitions" (§5.1).

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) · [pass@k](#/glossary/passk) · [masked language model](#/glossary/masked-language-model) · [online and offline RL](#/glossary/online-and-offline-rl) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [data contamination](#/glossary/data-contamination) (the paper's "data leakage", App. B.3)

**The paper's own terms:**
- **Example, hidden, generated tests:** printed in the statement; unseen, used by the judge; added to CodeContests (§2.1; §3.2).
- **n@k:** the share of problems solved when the system draws k samples and may submit n of them to the hidden tests, choosing them only from what competitors can see; 10@k models a contest, and pass@k (all k submitted) is its upper bound (§2.2).
- **False positive / slow positive:** a wrong program, or a correct one breaking time or memory limits, that the tests accept (§3.2.1).
- **Tempering:** dividing the output scores (logits) by a temperature during training; the authors observed that 0.2 "helps avoid overfitting to our fine-tuning dataset" (§4.3).
- **Value conditioning and prediction:** labelling each training submission correct or incorrect in the prompt and always asking for a correct one when sampling, plus a training-only correctness classifier (§4.3).
- **GOLD:** what the paper calls "an offline RL algorithm" (§4.3), applied to the fixed fine-tuning data: it weights each token's log-likelihood gradient by the model's own probability of that token, so the model can "learn from tokens it already assigns high likelihood to, and to ignore tokens that are not in its distribution" (§4.3; App. C.3).
- **Metadata conditioning:** tags (algorithm types such as "greedy" or "dp"), difficulty rating and language in the prompt, randomized when sampling, since contests hide them (§4.4; App. C.2).

**Missing glossary terms:**
- **Multi-query attention:** a full set of query heads but shared key and value heads per attention block, cutting the memory and cache-update costs that are "the main bottleneck during sampling" (§4.1).

**Builds on:**
- Codex (Chen et al., 2021), a GPT model trained on GitHub code, the "most relevant work to ours" (§7.2).
- Repeated sampling by Chen et al. (2021), Austin et al. (2021) and Cobbe et al. (2021) ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), similar "though on a much smaller scale" (§7.3).
- GOLD (Pang and He, 2020), tempering (Dabre and Fujita, 2020) and multi-query attention (Shazeer, 2019) (§4.1; §4.3).
- Contest datasets: Description2Code (Caballero et al., 2016) and CodeNet (Puri et al., 2021), merged into CodeContests; APPS (Hendrycks et al., 2021), 10,000 problems (§3.2; §5.4).

## Problem and setting

- **Question:** can a model write whole programs for unseen contest problems, under contest rules, at a level comparable with human competitors (§1; §2)?
- **Setting:** the full statement goes in; C++ or Python comes out (§4.4). Correct means passing every hidden (and, in CodeContests, generated) test within the time and memory limits; the judge ignores small float differences, case and whitespace, and checks multiple-output problems against the majority human output (App. A.2).
- **CodeContests:** training problems from a new Codeforces scrape plus Description2Code and CodeNet; validation and test from newer Codeforces problems, in a "strict temporal split": all training data appeared online before any validation problem, and validation before test (§3.2). Generated tests mutate existing inputs (for example bit flips or changed integers) and are kept when 30 correct solutions all give the same output; validation and test keep problems with at least 5 hidden or generated tests giving at least 2 different outputs (§3.2.1).
- **Codeforces:** the 10 contests from 1 to 28 December 2021 with over 5,000 participants, simulated live and submitted after they ended, with time and wrong-submission penalties, run three times (§5.1; App. D).

## Approach

Four steps (§4; Fig. 4):

1. **Pre-train** an encoder-decoder transformer (encoder reads the description, decoder writes the program) on 715.1 GB of GitHub code in 12 languages, with next-token loss for the decoder and masked language modelling for the encoder (§3.1; §4.2).
2. **Fine-tune** on CodeContests with tempering, value conditioning and prediction, GOLD and metadata conditioning (§4.3).
3. **Sample at scale:** half Python, half C++, random tags and ratings, and "a relatively high sampling temperature" for diversity; top-k and nucleus sampling gave no significant gain (§4.4; App. C.7).
4. **Select at most 10:** **filtering** keeps samples that pass the example tests; **clustering** groups the rest by identical outputs on generated inputs and submits one per cluster (§4.5–4.6). The inputs for clustering come from a separate test-input model trained on problem descriptions; they "are not guaranteed to be valid". Clusters are taken largest first. The dataset's mutation-based tests are not used here, because they need correct solutions "not available at test time" (§4.6).

On Codeforces the system pooled 41B and 9B model samples, with clustering (§5.1; App. C.1).

## Results

- **Codeforces (§5.1; Tab. 4):** average ranking of top 54.3% with 10 submissions per problem, averaged over the three runs.
- **CodeContests (§5.2; Tab. 5):** the 41B model with clustering solves 34.2% of validation problems at 10@1M and 29.6% of test problems at 10@100k; the 41B "consistently outperforms" the 9B, and clustering "consistently provides an improvement".
- **Scaling (§5.3.1; Fig. 6–7):** 10@k and pass@k grow approximately log-linearly with the number of samples, 10@k "bending down slightly at high sample budgets", with higher slopes for larger models; solve rate also scales approximately log-linearly with training compute "when we choose model sizes close to optimal for each compute allocation" (Fig. 7).
- **Build-up ablation (§5.3.4; Tab. 8):** on the 1B model, adding the enhancements one by one raises 10@100k from 15.2% to 24.1%, "although the contribution depends on the number of samples".
- **Filtering (§5.3.5; Tab. 9):** "Overall less than 1% of samples from our models pass example tests, though the percentage varies greatly across problems"; with a million samples the 41B model passes the example tests on over 90% of problems. Without filtering and clustering, solve rate stays flat as samples grow (Fig. 8).
- **Test quality (§3.2.1; Tab. 2):** hand-checking one solution on each of 50 random problems the 1B model solved, the authors estimate false positive rates of 60% for APPS, 30% for HumanEval (short Python functions), and 62% for CodeContests without generated tests and problem filtering against 4% with them; 46% of checked CodeContests solutions were false or slow positives.
- **Architecture (§5.3.2; Tab. 6):** the encoder-decoder with multi-query attention, chosen for speed, samples faster than the alternatives while "keeping the sample quality at the same level".
- **APPS (§5.4; Tab. 10):** fine-tuned on APPS without clustering, metadata or value conditioning, a 1B model beats GPT-Neo (a GPT-style model) at all difficulty levels and Codex 12B on the interview and competition levels.
- **Analysis (§6):** "no evidence that our model copies core logic from the training data" (§6.1); "notably worse" at dynamic programming and constructive algorithms (§6.2); solve rate drops when the description is obscured, little under synonyms (§6.3; Tab. 12).

## Limits the authors state

- CodeContests "has known weaknesses including false positives, accepting algorithmically inefficient solutions, and handling problems with multiple acceptable outputs" (§5.1); slow but correct solutions are still accepted on "a significant number of problems" (§3.2.1), especially high-difficulty ones (App. E.2).
- Judging against one output "can underestimate the actual model performance"; unhandled interactive problems "could lead to both false negatives and false positives" (App. A.2).
- Codeforces runs were simulated after the contests, so the "hacking" phase (finding bugs in others' code) was not fully considered; canonical example outputs for multiple-output problems give "a slight advantage" (§5.1, footnote 7; App. D.1); the three runs reused one sample set (App. D.2).
- The comparison covers only users who have tried such contests, "a self-selected subset of all programmers" (§1).
- "improving solve rate requires exponentially increasing amounts of samples and the costs quickly become prohibitive" (§5.3.1); selection leaves "a large gap" to the pass@k bound (§5.3.5).
- The Codeforces ensemble was "slightly worse than using the 41B model alone with clustering" (§5.1); the 41B model is "relatively undertrained" (§4.2); only Tab. 8 averages several fine-tuned models (App. A.3).
- Validation loss is "a poor proxy" for solve rate (§1; §6.5).
- Risks named include malware, unfair advantage in contests and interviews, and biased or insecure code (§8).

## Open problems and building blocks

  - "We leave a full investigation of the relationship between validation loss and solve rate to future work" (§6.5).
  - Log-linear scaling, the authors say, points to "improving model quality as an effective way to counter the exponential explosion of sample budget", and "an interesting trade-off" between training and sampling compute (§5.3.1).
  - Applications beyond contests "require varying amounts of future work" (§8.1).
- **Released:** the CodeContests dataset (§1, footnote 1; §3.2, footnote 6; "Data availability"); submitted programs on three Codeforces accounts (§5.1, footnote 8).
- **To reuse it:** 300M–41B models trained on TPUv4 accelerators (§4.1; Tab. 3); 3750 TPUv4 and 3750 TPUv4i chips per simulated contest (App. D.1); training and sampling "required hundreds of petaFLOPS days" (§8.2); 50 generated inputs over 8192 samples for clustering (App. C.4).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
