# Training Verifiers to Solve Math Word Problems

**GSM8K and trained verifiers** · preprint 2021

Read: [PDF](https://arxiv.org/pdf/2110.14168) · [arXiv](https://arxiv.org/abs/2110.14168)  
Code: [grade-school-math](https://github.com/openai/grade-school-math)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Introduces GSM8K and trains a verifier on final-answer correctness labels to rank sampled solutions (§4.2).
- Best-of-n with a learned verifier.
- Search against a learned verifier helps up to about 400 samples, then accuracy falls, which the authors attribute to "adversarial solutions that fool the verifier" (§5.1, Fig. 7a).

## In plain words

Language models still struggle with multi-step math: they are highly sensitive to single mistakes and cannot correct their own errors (§1). Extrapolating current trends, the authors say generation alone would need an "exorbitant parameter count" for even moderate performance on hard math, which motivates "the search for methods with more favorable scaling laws" (§1). They release GSM8K, about 8.5 thousand grade-school math word problems (abstract) with "natural language solutions" (§1). They train a second model, a verifier, to judge whether a sampled solution is correct, labelling training solutions only by their final answer; at test time they sample many solutions and return the verifier's top pick (§4). Trained on the full training set and ranking 100 samples, a 6-billion-parameter GPT-3 model with a verifier slightly beats a finetuned GPT-3 model about 30 times larger (§6). They report that verification does not help with small training sets but scales better with data than finetuning (abstract, §4.2), and that dropout, a guard against overfitting, helps both (§1). They call the verifier idea "similar to concurrent work" (§1).

## Background and terms

**Terms to know:** [best-of-N sampling](#/glossary/best-of-n-sampling) · [pass@k](#/glossary/passk) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [self-consistency](#/glossary/self-consistency-majority-voting) · [value function](#/glossary/value-function)

**The paper's own terms:**
- **GPT-3 family**: OpenAI's pretrained language models; the paper finetunes the 3B, 6B, 12B and 175B sizes (B = billion parameters), "primarily focusing on the 175B and 6B model sizes" (§4, Fig. 2).
- **finetuning (the baseline)**: training on the solutions with the ordinary language-modeling loss, then scoring one solution sampled at temperature 0 by whether its final answer is right (§4, §4.1).
- **generator**: the finetuned model that samples candidate solutions (§4.2).
- **verifier**: a language model that, "Conditioned on the problem and a candidate solution", "outputs the probability that the solution is correct" (§4.2). It has "a small scalar head": a bias and a gain applied to the output score of one reserved token (App. E).
- **test@N**: "the percentage of problems solved correctly at least once when allowing the model to make N separate guesses for each problem" (§4.1); this is pass@k with k = N.
- **token-level and solution-level verifiers**: a token-level verifier predicts correctness after every token of the solution, a solution-level one only after the last token (§4.3, Fig. 6a). Token-level is the default, and the paper says it "can be viewed as a token-level value function" (§4.3).
- **joint objective**: training the verifier on the language-modeling loss as well as the correctness prediction (§4.2, App. E, Fig. 12).
- **calculator annotations**: arithmetic written as `<<20+10=30>>` in the solutions; at test time, when a well-formatted annotation exists, a calculator (Python's `eval`) overrides the model's sampling for the result; an evaluation that times out or throws an error is skipped, and the model samples as usual (§4, App. C, Fig. 9).
- **residual dropout**: randomly dropping activations along each layer's residual paths during training, used as a regularizer against overfitting (§5.2).

**Builds on:**
- GPT-3 (Brown et al., 2020), whose models are the initialization and whose language-modeling objective the finetuning baseline uses (§4).
- Shen et al. (2021a), "Generate & Rank", concurrent and "closely related" work that jointly trains one model to generate and rank math solutions; the authors say they differ in using natural-language solutions, in their evidence on data scaling, and in using separate generator and verifier networks (§3.2).
- Earlier math word problem datasets, compared in §3.1: among them ASDiv, whose design principles GSM8K shares, and the harder MATH dataset.

## Problem and setting

- **The question:** can a verifier that ranks sampled solutions beat plain finetuning on grade-school math, and how do both methods scale with training data and model size (§4)?
- **The dataset:** GSM8K, 8.5K problems split into 7.5K training and 1K test problems (§2). Problems "take between 2 and 8 steps to solve", and solutions "primarily involve performing a sequence of elementary calculations using basic arithmetic operations" (§2). Contractors wrote the problems, optionally from seed questions generated by a few-shot prompted 175B GPT-3 model (App. A). The authors "estimate that less than 2 percent of problems contain breaking errors" (§2).
- **What counts as correct:** a solution is correct when its final answer is correct (§4, §4.2).
- **Models and runs:** GPT-3 family models, with the calculator for all models (§4). Fig. 2 and 5 show mean and standard deviation over 3 runs, "except for 175B verification which shows only a single run" (Fig. 5). Defaults are in Tab. 1, used "unless explicitly said otherwise" (App. B).

## Approach

- **Finetuning baseline:** cross-entropy loss over all training tokens for 20 epochs, one temperature-0 sample per test problem (§4.1, Tab. 1).
- **Verification** (Fig. 4, §4.2):
  1. Finetune a generator for 2 epochs. The authors chose 2 epochs because test@100 "peaks within the first few epochs" and solution diversity "begins to collapse after this point" (§4.1, §4.2, Fig. 3).
  2. Sample 100 solutions per training problem and label each by its final answer.
  3. Train a verifier for one epoch on these, with the joint objective; by default it has the generator's size and is initialized from the generator (§4.2, App. E).
  4. At test time, sample 100 solutions per problem at temperature 0.7, and return the one the verifier scores highest (§4.2, Tab. 1). For test@1 and test@100 in §4.1, the temperatures (0 and 0.7) were "chosen empirically to produce the best results".
- **Separate models:** generator and verifier are kept apart "to limit the generator's training and prevent overfitting" (§4.2).
- **Voting variant:** a majority vote over the final answers of the top verifier-ranked solutions, instead of taking only the top one (§5.1).
- **Dropout:** 20% residual dropout, after additional pretraining with dropout, since GPT-3 was pretrained without it (§5.2).

## Results

- **Finetuning scaling** (Fig. 2, §4.1): the 175B model "significantly outperforms the smaller models". "Assuming a log-linear trend", they "naively extrapolate" that 10^16 parameters would be needed for an 80% solve rate with the full training set; along the data dimension extrapolation is "even harder", but "it appears likely" that 175B would need much more data for 80% (§4.1).
- **Written steps matter:** finetuning a 6B model to output the final answer directly, with no intermediate steps, drops performance "drastically from 20.6% to 5.2%" (§4.1).
- **Verification against finetuning** (Fig. 5, §4.2): "it is not beneficial to use verification at low dataset sizes", which the authors believe is due to "the pressure to overfit to the correct answer"; "once we use a sufficiently large dataset, we see a strong boost from verifiers". 175B verifiers "take off" earlier than 6B ones. On the full dataset, 6B verification "slightly outperforms a finetuned 175B model", a boost "approximately equivalent to a 30x model size increase" (§6).
- **Ablations** (Fig. 6, §4.3): the token-level verifier trains more slowly at first but "ultimately outperforms the solution-level verifier", which "quickly shows signs of overfitting"; adding the language-modeling objective "is a strict improvement"; a large generator with a small verifier "performs significantly better" than the reverse. The authors take the last as a suggestion that "the verifier may often be relying on relatively coarse heuristics".
- **Test-time compute** (Fig. 7a, §5.1): for the 6B verifier, "performance improves as we increase the number of completions up to 400", then starts to decrease, which "suggests that the benefits of search are eventually outweighed by the risk of finding adversarial solutions that fool the verifier". The default of 100 completions "captures most of the benefits of verification with a relatively modest compute cost".
- **Voting** (Fig. 7b, §5.1): more samples let more top-ranked samples usefully vote.
- **Dropout** (6B models, Fig. 8, §5.2): a "significant improvement" for finetuning; it "significantly improves solution-level verifiers", bringing them to a level similar to token-level ones; token-level verifiers get "a slight gain" (Fig. 8c uses 4x larger batches and 300 completions, Tab. 1).
- **Verifier visualization** (App. F, Fig. 13): five "cherry-picked" samples with per-token scores show errors of both kinds; verifiers "occasionally make mistakes with performing this variable binding of quantities to their relationships".

## Limits the authors state

- Labels come from the final answer only, so "some solutions will reach the correct final answer using flawed reasoning, leading to false positives" (§4.2).
- Verification is not beneficial at small dataset sizes (§4.2), and for the 6B verifier, searching over more than 400 completions makes performance decrease (§5.1).
- The calculator used for all results "had some minor implementation bugs", so reported performance is "a slight underestimate"; fixing it improves verification "by about 1% when using the full GSM8K training set" (App. C). The annotation logic "is imperfect": it is "highly unlikely to generate any incorrect annotations", but "it is not uncommon for it to ignore some lines that could be annotated" (App. C).
- A second agreement check, on "a smaller subset of problems", found 1.7% still disagreeing, and "It is possible that a larger percentage of problems contain subtle errors" (App. A).
- The example solutions were "slightly cherry-picked for diversity" (App. D).

## Open problems and building blocks

- **Open:** combining generator and verifier into one model, which "in principle" should be possible (§4.2). The authors "expect verification to scale well to problem distributions that require more complex mathematical reasoning" and "hope GSM8K supports the development of new methods that scale even better" (§6).
- **Released:** the GSM8K dataset (§1, §2).
- **To reuse it:** training problems with known final answers, to label sampled solutions (§4.2); a generator with good coverage, since "Choosing a model with good coverage is critical to successfully train verifiers" (§4.1); "a sufficiently large dataset", as verification does not help at low dataset sizes (§4.2); in the default setup, 100 sampled solutions per training and test problem, and the calculator (§4, §4.2, Tab. 1). Verification "is still remarkably effective, even when the verifier is much smaller than the generator" (§4.3).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
