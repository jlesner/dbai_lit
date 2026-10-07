# DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines

**DSPy** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2310.03714) · [arXiv](https://arxiv.org/abs/2310.03714)  
Code: [dspy](https://github.com/stanfordnlp/dspy)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Declarative LM pipelines with a compiler that bootstraps and selects few-shot demonstrations (or finetunes) to maximize a metric; instructions are named as parameters, but this version focuses on demonstrations (§4).
- Signatures composed into programs.
- GEPA ships as the DSPy optimizer `dspy.GEPA` (gepa README); GEPA also runs standalone.

## In plain words

Pipelines that chain several language-model calls are usually driven by long hand-written prompt strings found by trial and error. The authors argue this "can be brittle and unscalable", like hand-tuning a classifier's weights, and that a prompt tuned for one pipeline may not carry over to other pipelines, models, data or inputs (§1). They build DSPy, a Python framework in which each model call is declared by its inputs and outputs, calls are composed into ordinary programs, and a "compiler" runs the program on a few training inputs, keeps the runs that a user-chosen score accepts, and uses them as worked examples in the prompts or as finetuning data. On two tasks, grade-school math and multi-step question answering over Wikipedia, they report that a few lines of DSPy, after minutes of compiling, beat standard few-shot prompting "generally by over 25% and 65%" for GPT-3.5 and Llama2-13b-chat, and also beat pipelines with expert-written examples (abstract). They present it as "the first programming model that translates prompting techniques into parameterized declarative modules" (§1).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [rejection sampling](#/glossary/rejection-sampling) · [Distillation into compact models](#/glossary/distillation) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [hyperparameter optimization](#/glossary/hyperparameter-optimization)

**The paper's own terms:**
- **signature**: a "natural-language typed declaration of a function": input and output fields plus an optional instruction, saying what a call must do, not how to prompt for it; shorthand `question -> answer` (§3.1, App. A).
- **module**: a callable that implements any signature with a prompting technique by calling the core `Predict` module one or more times (§3.2); a **predictor** is a `Predict` inside a program (§4).
- **parameters** of a module: the LM to call, the prompt instructions, the string prefix (label) of each field in the prompt, and the demonstrations (few-shot examples, or training data for finetuning) (§3.2).
- **program**: Python code that declares modules and calls them in a `forward` method with any control flow, "define-by-run" as in PyTorch (§3.2).
- **teleprompter**: an optimizer that takes a program, a training set and a metric and returns an optimized program; **compiling** is running one. A **teacher** program supplies the demonstrations, so one compiled program can train another (§3.3).
- **compilation settings** in the tables (§6): `none` (zero-shot), `fewshot` (`LabeledFewShot`: k=8 random training examples, inputs and final answers only, "the average of 3–5 runs"), `bootstrap` (bootstrapped demonstrations chosen by random search), `bootstrap×2` (bootstrapping again with the first result as teacher), `+ensemble` (majority vote over the top 7 candidate programs), `+human_CoT` (§6) and `+human_r` (§7) (human-written reasoning added); Tab. 2 labels its ensemble row `ensemble`.

**Builds on:**
- DSP (Demonstrate–Search–Predict, Khattab et al. 2022), the authors' earlier framework; DSPy is its "second iteration" (§1, footnote 1).
- Neural-network frameworks (Torch, Theano, Chainer, PyTorch): composable layers trained by optimizers; PyTorch's syntax (§1, §2).
- The prompting techniques it turns into modules: Chain of Thought (Wei et al. 2022), Program of Thoughts (Chen et al. 2022, reasoning written as code), multi-chain comparison (Yoran et al. 2023) and ReAct (Yao et al. 2022, [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"), an agent that interleaves reasoning and tool calls) (§3.2, footnote 5).
- Prompt optimizers that use discrete optimization or RL "generally for a single logical LM call", which DSPy "seeks to generalize": Guo et al. 2023 ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), Pryzant et al. 2023 ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), Huang et al. 2022, Yang et al. 2023 ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) (§2).

## Problem and setting

- **Question:** can concise modules plus automatic compiling replace hand-crafted prompt strings in LM pipelines? §5's hypotheses: modules replace prompt strings "without reducing quality or expressive power"; optimization makes DSPy better at adapting to different LMs, and it "may outperform expert-written prompts"; modularity lets one explore complex pipelines more thoroughly.
- **Models:** GPT-3.5 and Llama2-13b-chat prompted, T5-Large (770M parameters) finetuned (§6, §7). Which GPT-3.5 version is used is not discussed.
- **GSM8K** (grade-school math word problems, Cobbe et al. 2021, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")): 200 training and 300 development questions sampled from the official training set; the 1.3k official test examples for final runs; accuracy is the final number in the LM output (§6). "We report extensive comparisons on the development set to avoid overfitting on test" (§6).
- **HotPotQA** (multi-hop questions over Wikipedia, Yang et al. 2018) in the open-domain "fullwiki" setting (answers come from retrieval over Wikipedia, not given paragraphs), with a ColBERTv2 retriever (a neural passage retriever) over Wikipedia 2017 abstracts; 1000 sampled official validation questions as test set; 200 training and 300 development examples, "hard" ones only (§7). Metrics: answer exact match (Ans) and pair-retrieval accuracy (Psg), which the paper names without further definition (Tab. 2).
- **Labels:** "typically" at most for the program's final output (§3.3).

## Approach

- **Writing programs (§3).** A user declares modules with signatures and wires them in Python. Built-in modules include `ChainOfThought`, `ProgramOfThought`, `MultiChainComparison` and `ReAct` (§3.2). `ChainOfThought` just adds a reasoning output field before the answer and calls `Predict`. Tools are modules too: `dspy.Retrieve` (ColBERTv2, Pyserini, Pinecone retrievers), and the experimental `dspy.SQL` (runs SQL queries) and `dspy.PythonInterpreter` (§3.2).
- **Metrics (§3.3)** can be exact match or F1, or "entire DSPy programs"; the authors suggest that grounding of answers in passages "might be more accurately checked by another DSPy program".
- **The compiler (§4)**, three stages that "typical teleprompters go through", not enforced:
  1. *Candidate generation:* find every predictor; the teleprompter may propose candidate values for its parameters. "In this iteration of DSPy, we focus on demonstrations", with "rejection-sampling-like approaches": `BootstrapFewShot` runs a teacher (or the zero-shot program) on training inputs, possibly at high temperature, and the metric filters the multi-stage traces; the good traces become potential demonstrations for all the program's signatures, "though these design decisions are under user control".
  2. *Parameter optimization:* choose among candidates by hyperparameter optimization (`BootstrapFewShotWithRandomSearch`, `BootstrapFewShotWithOptuna`, App. E.2–E.3), "typically" maximizing average metric over the training set or a validation set; or finetune each predictor's LM on the demonstrations (`BootstrapFinetune`).
  3. *Higher-order optimization:* change control flow; the case studies use ensembles of bootstrapped copies, reduced e.g. by majority vote.
- **Programs tested.** GSM8K (§6): `vanilla` (one `Predict`), `CoT` (one `ChainOfThought`), `reflection` (five sampled reasoning chains compared by `MultiChainComparison`). HotPotQA (§7): `vanilla`, `CoT RAG`, `react` (the `dspy.ReAct` agent with a retriever), and `multihop` (two rounds of query generation and retrieval, 3 passages per hop); `multihop_t5` finetunes T5-Large on runs of a llama2-13b-chat `multihop` ensemble (§7).

## Results

- **GSM8K (Tab. 1, §6).** The authors report that compiling the right modules "improves different LMs from 4–20% accuracy to 49–88% accuracy" (Tab. 1 caption, §6). For GPT-3.5 `CoT`, `bootstrap` without human reasoning chains scores 80.3 dev / 72.9 test against 78.6 / 72.4 with human chains (`+human_CoT`), which they say `bootstrap` can "match or surpass". They call `reflection` "a clear winner, though CoT is quite effective with ensemble", and report that "overall" `bootstrap` gives "large gains for every program, across both LMs" (§6). For `vanilla`, bootstrapped prompts let the LM reason inside the answer field, which the metric allows (§6, App. F). Informally, the llama2-13b-chat program is "competitive with" the Llama2 authors' 34b results (§6).
- **HotPotQA (Tab. 2, §7).** The authors find that "overall, a simple multihop program performs the best" (§7). On test answer exact match (EM), `vanilla` `fewshot` 31.5 rises to 45.6 for `multihop` `ensemble` with GPT-3.5, the latter "evaluated on 50% of our test set due to cost", and 21.8 → 41.0 with llama2-13b-chat (Tab. 2). `bootstrap` (and/or `bootstrap×2`) "can outperform" `fewshot` for `multihop` and human reasoning (`+human_r`, a ReAct prompt adapted from Yao et al.) for `react`; compiling makes llama2-13b-chat "competitive with GPT-3.5" (§7).
- **Finetuning (§7).** `multihop_t5` (T5-Large) scores 39.3% answer EM and 46.0% passage accuracy on dev, from 200 labeled and 800 unlabeled questions; the authors say it "would impose orders of magnitude lower costs for inference" than GPT-3.5. The abstract calls programs compiled to T5 and llama2-13b-chat competitive with expert-written prompt chains for GPT-3.5.
- **Hand-written prompts in other libraries (App. B–C).** In an "informal study", the authors count many strings over 1000 characters, "generally prompts", in LangChain (an LM application toolkit) and none in DSPy (App. B); App. C sizes eight hand-written prompts.

## Limits the authors state

- Instructions and field descriptions are parameters, but "In this iteration of DSPy, we focus on demonstrations" (§4).
- Typed output fields (bool, int) are "not core to DSPy at the time of writing" (§3.1, footnote 4).
- Training sets "may be small, potentially a handful of examples, though larger data enables more powerful optimization" (§3.3).
- Comparisons with published systems are informal: "We can informally compare with the following" (§6); for HotPotQA "there is significant variation in evaluation methodology and test set samples across studies in this space" (§7). The GPT-3.5 `multihop` `ensemble` test score covers half the test set "due to cost" (Tab. 2).
- `CoT RAG` "relies entirely on the ColBERTv2 retriever to find relevant passages directly from the original questions, limiting its passage recall" (§7).

## Open problems and building blocks

  - "In future work, this stage can easily accommodate techniques for more dynamic (i.e., test-time) bootstrapping as well as automatic backtracking-like logic" (§4, Stage 3).
  - Other tasks the authors have compiled programs for, "from information extraction to low-resource synthetic data generation": "we leave reporting on such tasks under controlled experimental conditions to future work" (§8).
  - Teleprompters could "in principle" use RL and LM feedback, or Bayesian hyperparameter optimization (§2).
- **Released:** DSPy, open source (abstract; §8); bootstrapped prompts printed in App. F.
- **To reuse it:** Python; one or more LMs, promptable or finetuneable (§3, footnote 3); a metric and a few training inputs (§3.3); a retriever for retrieval programs (§3.2); compiling "generally runs on the order of minutes (or tens of minutes)" (§6).
- **Beyond its domain:** the `"question -> answer"` signature "is universal enough that it will work for this task (and many others) when compiled appropriately" (§7); the compiler will "optimize any DSPy pipeline" (abstract).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
