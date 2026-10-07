# Large Language Models Are Human-Level Prompt Engineers

**APE** · ICLR 2023

Read: [PDF](https://arxiv.org/pdf/2211.01910) · [arXiv](https://arxiv.org/abs/2211.01910)  
Code: [automatic_prompt_engineer](https://github.com/keirp/automatic_prompt_engineer)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM proposes instructions from input–output examples; the best-scoring one is kept.
- Generate and score; resampling around the top candidates (iterative APE) is optional and off by default (§3.3).
- The sample-and-select baseline; its authors found iterative resampling gave only marginal gains (§3.3, §5.3).

## In plain words

How well an LLM does a task depends greatly on its instruction's wording, and most of the instructions that work well have been written by hand (abstract); the authors want to reduce the effort of writing and testing them (§1). Their Automatic Prompt Engineer (APE) has an LLM read a few input–output examples of a task and propose many candidate instructions, scores each (by default, by how often a target model following it gives the expected output on training examples), and keeps the best; optionally, an LLM writes variants of the best (§3). With InstructGPT (an instruction-tuned OpenAI model) following them, they report that APE's instructions do better than or comparably to human-written ones on 24 of 24 short language tasks and 17 of 21 curated tasks from BIG-Bench, a large suite of evaluation tasks (abstract, §4). They also use it to find a better step-by-step reasoning trigger and to steer answers toward truthfulness (abstract). They present APE as a "novel algorithm" (§1) whose instructions outperform "the prior LLM baseline by a large margin" (abstract), not as a first.

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) · [meta-prompt](#/glossary/meta-prompt) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [Pareto front](#/glossary/pareto-front) · [interquartile mean (IQM)](#/glossary/interquartile-mean-iqm)

**The paper's own terms:**
- **natural language program synthesis**: finding one instruction that makes a model give the right output for each input; the instruction is the "program" (abstract, §3).
- **prompt engineering**: "optimizing the language in a prompt in order to elicit the best possible performance", excluding prompts that chain LLM calls or use tools (abstract, footnote).
- **forward mode / reverse mode generation**: the LLM continues the demonstrations with an instruction, or a model that can fill a blank writes the missing instruction, so it can sit anywhere in the text (§3.1, Fig. 2).
- **execution accuracy**: not the text-to-SQL score, but, "In most cases", the share of examples on which the model, given the instruction and input, outputs exactly the expected answer; "On some tasks" it allows invariants such as order-invariant set matching (§3.2).
- **iterative APE**: an LLM is asked for instructions similar to the high scorers, and scoring repeats (§3.3, Fig. 3).
- **Greedy**: Honovich et al.'s method, "a greedy version of APE, without a search and selection process" (§4.1).
- **Human**: on instruction induction, Honovich et al.'s gold instructions, "manually verified for correctness"; on BBII (BIG-Bench Instruction Induction, see Problem and setting), the task's default human prompt (§4.1 footnote, §4.2).
- **Zero-Shot-CoT**: putting "Let's think step by step." at the start of the model's answer (§4.3).

**Builds on:**
- Honovich et al. (2022), instruction induction: the 24 tasks, forward template, execution accuracy, gold instructions and Greedy (§3.1, §3.2, §4.1). Not on this site.
- Discrete prompt search, whose generation, scoring and paraphrasing components they "borrow"; they say "the entire search can be conducted by a single LLM" (§2). AutoPrompt ([AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)")) is cited among automatic methods (§2).
- Program synthesis with inference models that narrow the search: "Inspired by this, we use LLMs as approximate inference models" (§2).
- Kojima et al. (Zero-Shot-CoT) and Lin et al. (TruthfulQA, questions that test truthful answers), the human baselines of §4.3 and §4.4; the CoT procedure is "inspired by" Zelikman et al. (§4.3). None is on this site.

## Problem and setting

- **Question:** find the instruction that maximizes the expected per-example score over the task's input–output pairs (§3, Eq. 1); the input may be empty.
- **Black box:** gradient-based prompt tuning becomes "less practical with scale", as access "shifts to APIs that may not provide gradient access" (§2); APE uses only model outputs, and answer probabilities for the log probability score (§3.2).
- **Models:** InstructGPT (`text-davinci-002`, OpenAI API) proposes and executes in the main runs (§4.1 footnote); §5.1 compares eight OpenAI models (GPT-3 and instruction-tuned) as proposers; App. C.4 adds the forward-mode LLMs OPT-175B and Codex and the infilling LLM GLM-130B.
- **Instruction induction (§4.1, Tab. 1):** 24 short tasks, e.g. pluralization, antonyms, translation; five training pairs sampled per task, five random seeds; correct means execution accuracy on held-out test data (§3.2).
- **BBII (§4.2, App. B.1):** the authors' 21 BIG-Bench tasks with "a clear, human-written instruction that can be applied to all examples", scored by BIG-Bench's normalized metric (100 is human expert, 0 random guessing, App. C.2).
- **Zero-shot CoT (§4.3):** Kojima et al.'s reasoning tasks (12 in Fig. 10), including MultiArith (arithmetic word problems) and GSM8K (grade-school math, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")).
- **TruthfulQA (§4.4):** 817 questions in 38 categories; 100 train, 717 test; % True and % Info, the shares of answers judged true and informative (Fig. 5), come from Lin et al.'s fine-tuned GPT-judge and GPT-info models.

## Approach

- **Search (Algorithm 1):** an LLM samples candidates; while not converged, each is scored on a random training subset and the top k% are kept, or resampled by an LLM; the best on all training data is returned (§3, Fig. 1a).
- **Proposal (§3.1):** forward, reverse or a customized template (for TruthfulQA, from the dataset's human instructions).
- **Scoring (§3.2):** execution accuracy, the default "unless otherwise stated" because, in Spearman correlation, it "aligns better with the test performance" (§5.2, Fig. 7 middle), or the log probability of the expected answer. Candidates above a threshold on a small subset get more examples, until a few remain.
- **Defaults:** 50 candidates (§5.2) and "APE without iterative search as default unless otherwise stated" (§3.3).
- **CoT use (§4.3):** InstructGPT reasons with "Let's think step by step.", wrong answers are dropped, and APE seeks a prompt starting with "Let's" that maximizes the likelihood of the correct reasoning steps.

## Results

- **Instruction induction (§4.1, Fig. 4):** the authors report that APE "outperforms “Greedy” on every task and achieves equal or better than human performance on 24 of 24 tasks", with an IQM of 0.810 against 0.749 for human instructions (Fig. 1b).
- **Few-shot (§4.1, App. C.1):** the APE instruction before the in-context examples "achieves a comparable or better test performance than the standard in-context learning performance on 21 of 24 tasks" (Fig. 8); adding examples hurts Rhymes, Large Animal and Second Letters; selecting instead by few-shot execution accuracy "achieves comparable or slightly better than the zero-shot metric except for Rhymes" (Fig. 14).
- **BBII (§4.2, Tab. 6):** "comparable or better performance than the default human prompt on 17 out of 21 tasks".
- **Zero-shot CoT (§4.3; Tab. 7 for MultiArith):** "Let’s work this out in a step by step way to be sure we have the right answer." raises InstructGPT from 78.7 to 82.0 on MultiArith and from 40.7 to 43.0 on GSM8K, against "Let's think step by step.".
- **TruthfulQA (§4.4, Fig. 5):** reporting averages over the top 10 of 200 candidates, they find APE "achieves over 40% accuracy in providing both true and informative answers (v.s. 30% by the “help” prompt from humans)"; its instructions "can achieve very high truthfulness with answers such as" "No comment" that "provide little information", and "tend to target the two ends" of the truthfulness–informativeness Pareto frontier.
- **Proposal and selection (§5.1–5.2):** larger and instruction-tuned models "tend to produce better proposal distributions" (Fig. 6 left), though for InstructGPT on a harder task "half of the instructions are off-topic and perform poorly" (Fig. 28); the best instruction shows "a monotonically increasing trend with a diminishing return" from 4 to 128 candidates, averaged over 6 tasks (Fig. 7 left).
- **Iterative search (§3.3, §5.3):** the survival plot (share of instructions above each test-accuracy threshold, §5.1) "suggests that iterative search does result in a higher-quality proposal set", whose quality "seems to stabilize after three rounds" (Fig. 6 right); on six tasks, iterative search "marginally improves performance on tasks where APE underperforms humans but achieves similar performance on the other tasks" (Fig. 7 right).
- **Other proposers and transfer (App. C.4, figures in App. F)**: on six tasks, Codex and OPT "nearly match" InstructGPT and GLM gives the poorest zero-shot performance; GPT-3's own instructions steer GPT-3 well; the proposal template "makes a difference, improving the performance on some tasks while impairing others" (Fig. 21–22).
- **Cost (App. D):** larger, instruction-tuned proposers "dominate the accuracy-cost frontier", since they tend to write more concise instructions, which cuts the scoring cost (Fig. 11); APE instructions are "token efficient compared to using five in-context examples" (Fig. 13).

## Limits the authors state

- TruthfulQA results are "not in any way compatible with the original benchmarks" and not "true few-shot learning" (§4.4); "This result by itself is not surprising as the human baseline is not carefully chosen" (§4.4).
- Few-shot: selected instructions may "overfit the zero-shot learning scenario" (their conjecture, §4.1).
- Rhymes: instructions that echo the input "effectively hack the evaluation … as every word rhymes with itself" (App. C.1).
- Forward mode "requires custom engineering across different tasks" (§3.1).
- InstructGPT's instructions "do not transfer well to a different model like GPT-3"; some OPT instructions contain in-context examples (App. C.4).
- App. F's visualizations are "based on a previous iteration of APE" that reached human level on fewer tasks (App. F).
- "We hypothesize Shuffled Objects and Last Letter are hard to optimize on with a general prompt" (Fig. 10).

## Open problems and building blocks

- **Open:** "We leave to future work the exploration of meta prompt engineering for better proposal distributions" (App. C.4); "Future work exploring optimizing the prompt length can further reduce costs" (App. D).
- **Released:** "Our code is available" (abstract, footnote).
- **To reuse it:** a proposer LLM (an infilling one for reverse mode), a target model run on scored training examples, a few demonstrations and a candidate budget (default 50, §5.2). The authors "recommend using the larger and human-aligned instruction generation models whenever possible" (App. D), meaning models trained to follow human instructions.
- **Beyond its domain:** Algorithm 1 "could be applied to steer other models with natural language interfaces so long as an appropriate proposal method and scoring function can be designed" (App. A).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
