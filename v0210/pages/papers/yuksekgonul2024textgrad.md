# TextGrad: Automatic "Differentiation" via Text

**TextGrad** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2406.07496) · [arXiv](https://arxiv.org/abs/2406.07496)  
Code: [textgrad](https://github.com/zou-group/textgrad)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Backpropagates natural-language feedback through a computation graph of LLM calls and tools.
- PyTorch-like API for "textual gradients".
- A GEPA baseline; general text optimization (code, molecules, prompts).

## In plain words

AI systems increasingly chain several LLM calls and tools; the authors say many are hand-crafted by experts and "tweaked through heuristics", so automating their optimization is "one of the most important new challenges" (abstract; §1). TextGrad treats such a system like a neural network: an LLM writes criticism of an output, the criticism is passed backwards to the pieces of text that produced it (a prompt, code, an answer, a molecule), and another LLM call rewrites each piece using it. The library copies PyTorch's interface. Refining each GPT-4o answer three times and taking a majority vote, the authors report 55% accuracy on GPQA, hard expert-written science questions, against 51% for one chain-of-thought answer and 53.6% reported by OpenAI (§3.2). On LeetCode Hard coding problems with GPT-4o, refined code solves 36% against 31% for Reflexion, a self-reflection method given one worked example (§3.1). They also apply it to prompts, drug-like molecules and radiotherapy plans, and present it as one general framework that carries textual feedback beyond prompt tuning (§4).

## Background and terms

**Terms to know:** [textual gradient](#/glossary/textual-gradient) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [automatic differentiation (backpropagation)](#/glossary/automatic-differentiation-backpropagation)

**The paper's own terms:**
- **compound AI system**: a system of several components, each of which "could be an LLM-based agent, a tool such as a simulator, or web search" (§1).
- **gradient** (as used here): natural-language criticism "describing how a variable should be changed to improve the system"; the authors "use differentiation and gradients as a metaphor for textual feedback from LLMs" (§1). A variable used in several places gets the union of the feedback from each (§2 "The general case", Eq. 11).
- **variable**: a graph node holding text, with a role description, gradients and predecessors (App. A.1). The **role description** says what it is for; the authors find it "can significantly steer the optimization process" (App. A.1).
- **backward engine**: the LLM that writes the gradients (App. A.2). **TGD (Textual Gradient Descent)**: the LLM call that rewrites a variable from its feedback (§2 "Warmup: system with two LLM calls"; App. A.4).
- **instance vs prompt optimization**: improving one solution (code, an answer, a molecule) at test time, versus one prompt for all of a task's queries (§2 "Instance vs Prompt Optimization").
- **test-time training** (the paper's sense): of refining a solution by self-evaluation, §3.2 says "More generally, this idea is known as test-time training"; here the updated variable is the solution text.
- **momentum, batches, constraints**: analogies the framework implements: TGD may see earlier versions of the variable; a batch's feedback is concatenated; natural-language rules go into the optimizer prompt (§2 "Optimization Techniques"; App. B).

**Builds on:**
- ProTeGi [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)"), which defines textual gradients for prompt optimization: "we expand this analogy more broadly to automatic differentiation" (§4).
- DSPy [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)"), which optimizes LLM systems written as programs: an inspiration (§4) and the prompt-optimization baseline (§3.3).
- Reflexion [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)"): source of the LeetCode Hard dataset and the code baseline (§3.1).
- Autodiff frameworks such as PyTorch, whose abstractions TextGrad mirrors (§1; Fig. 1(c)).

## Problem and setting

- **Question:** can LLM feedback, passed backwards through a computation graph, improve a system's text variables when users "only provide the objective function" (abstract)?
- **Assumption:** the framework assumes "the current state-of-the-art LLMs are able to reason about individual components and subtasks of the system that it tries to optimize" (§1).
- **Models:** gpt-4o; in prompt optimization the answering model is gpt-3.5-turbo-0125 and gpt-4o gives the feedback (§3.3).
  - *Code* (§3.1; App. C.1): 39 LeetCode Hard problems; the loss is an LLM critique of the code and its local test results; the metric, completion rate, is the share of problems passing LeetCode's hidden tests.
  - *Solutions* (§3.2; App. D.1): GPQA Diamond and the Machine Learning and College Physics subsets of MMLU, a multiple-choice exam benchmark. The loss asks an LLM why the answer could be wrong, without ground truth; scoring matches the final letter.
  - *Prompts* (§3.3; App. E.1): Object Counting and Word Sorting from Big-Bench Hard (hard reasoning tasks), described as "randomly split into 50/100/100 train/validation/test samples", and GSM8k grade-school math with DSPy's splits. Exact match on the last number, except Word Sorting, judged by prompting gpt-4o.
  - *Molecules* (§3.4; App. F): the 58 protein targets of DOCKSTRING, a benchmark of docking (simulating how a molecule binds a protein, to estimate binding strength); objectives are the Vina score of the docking simulator AutoDock Vina (more negative means stronger predicted binding) and QED, a 0–1 druglikeness score; the comparison is approved DrugBank drugs for the 29 targets that have them.
  - *Radiotherapy* (§3.5; App. G): plans for 5 prostate cancer patients, compared with their clinical plans.

## Approach

- **Backward pass:** each LLM call's backward function prompts the backward engine with the conversation, the variable's role and the downstream feedback, asking for criticism but not a new version (App. A.3); a variable's gradient collects the feedback from all its successors (Eq. 11). One iteration makes "at most n additional language model calls to compute gradients" for a graph with n edges (§2 "The general case").
- **Update:** TGD prompts an LLM with the variable, its context and feedback; the reply "will directly replace the variable" (App. A.4).
- **Generality:** all experiments use the same backward mode (App. A.3).
  - Code and solutions: one gpt-4o call each for loss, gradient and update per iteration (App. C.1; App. D.1); solutions get 3 updates, then "majority voting across all solutions" (§3.2).
  - Prompts: batches of 3 for 12 iterations; a new prompt is kept only if validation accuracy improves (§3.3).
  - Molecules: the variable is a SMILES string (a text encoding of a molecule); an LLM turns the Vina and QED scores into criticism, weighting docking 10 times druglikeness (App. F.2); 10 iterations from each of 3 starting fragments per target (§3.4).
  - Radiotherapy: TextGrad tunes the weights that matRad, a numerical plan optimizer, gives the planning target volume (PTV, the tumor plus a margin) and the organs at risk (bladder, rectum and others); an LLM judges each plan's dose-volume histogram (the share of each region's volume receiving more than each dose) against clinical protocols (§3.5; App. G.1). Updates see three clinician plans with their weights, and past iterations (App. G.3).

## Results

- **Code (Tab. 1):** completion rate 0.26 for zero-shot gpt-4o, 0.31 for Reflexion (1 demonstration, 5 iterations) and 0.36 for TextGrad (0 demonstrations, 5 iterations), "averaged over 5 seeds". The abstract calls this a "20% relative performance gain".
- **Solutions (Tab. 2):** accuracy from CoT (one chain-of-thought answer) to TextGrad: GPQA 51.0 → 55.0, against 53.6 reported for gpt-4o; MMLU Machine Learning 85.7 → 88.4; College Physics 91.2 → 95.1. The authors write "To our best knowledge, 55% is the best known result in the GPQA dataset so far" (§3.2).
- **Prompts (Tab. 3; gpt-3.5-turbo answers):** CoT / DSPy with 8 demonstrations / TextGrad instruction only: Object Counting 77.8 / 84.9 / 91.9; Word Sorting 76.7 / 79.8 / 79.8; GSM8k 72.9 / 81.1 / 81.1. §1 says this pushes "the performance of GPT-3.5 close to GPT-4 in several reasoning tasks".
- **Molecules (§3.4; Fig. 2(b)):** for all 58 targets TextGrad "consistently generates molecules with improved binding affinity and druglikeness", and for the 29 with approved drugs, "highly competitive affinity and druglikeness when compared to clinical molecules evaluated using the same loss function". By the 6th iteration 95% of generated molecules are novel, meaning no compound in the ChEMBL database is over 0.80 similar (Tanimoto score) (App. F.5; Supp. Fig. 2(a)). For the best molecule per fragment on each of those 29 targets (87 molecules; App. F.5), predicted mutagenicity (ability to cause genetic damage) and clinical toxicity from ADMET-AI, a deep learning predictor, "closely match the distributions of the clinically approved molecules" (App. F.6).
- **Radiotherapy (Fig. 3(d,e); Supp. Tabs. 1–2):** the authors report that TextGrad "outperforms the clinical plans across all metrics" for the PTV, with a D95 (the dose that 95% of the volume receives at least) "that exactly matches the prescribed dose", and lower mean bladder and rectum doses (§3.5).

## Limits the authors state

- The molecules and plans had only *in silico* (computer-simulated) validation: "the ultimate test requires experimental and clinical assessments, which are outside of the scope of this paper" (§5).
- They re-extracted LeetCode Hard, so "it is likely that the dataset we are using in this manuscript is not the same dataset that was used in the Reflexion paper" (App. C.1).
- Language models "can follow these simple constraints, although their reliability can reduce with too many constraints" (§2 "Optimization Techniques").
- Temperature 0 is used "to minimize randomness, however, discussions claim there may be other sources of non-determinism with gpt-4" (§3.2, footnote).
- Encoding every desirable molecule property in the objective "is not realistically feasible as not all criteria for desirability have mature computational metrics" (App. F.6).

## Open problems and building blocks

  - They hope to extend the operations to "tool use" and "retrieval-augmented generation systems" (§5).
  - Variance reduction or adaptive gradients (numerical-optimization methods for steadier gradient steps) or LLM self-verification for "increasing the stability of the optimization" (§5).
  - Meta-learning, optimizing the framework "using methods such as TextGrad itself", "an intriguing direction of future work" (§5).
  - Combine DSPy's demonstrations with TextGrad's instructions, "a fruitful direction"; on GSM8k this raised accuracy further (§3.3).
- **Released:** the framework, open source (§1; §5), linked as "Repository and Tutorials" on the title page.
- **To reuse it:** an objective function (abstract); gpt-4o as backward engine and optimizer in the experiments (App. C.1; App. D.1); AutoDock Vina via DOCKSTRING and the chemistry toolkit RDKit for molecules (App. F.1); matRad for radiotherapy (§3.5).
- **Beyond its domain:** the authors claim it "works out-of-the-box for a variety of tasks" (abstract) and hope it can "accelerate iterative processes in scientific discovery" (§5).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
