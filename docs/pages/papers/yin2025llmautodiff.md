# LLM-AutoDiff: Auto-Differentiate Any LLM Workflow

**LLM-AutoDiff (AdalFlow)** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2501.16673) · [arXiv](https://arxiv.org/abs/2501.16673)  
Code: [AdalFlow](https://github.com/SylphAI-Inc/AdalFlow)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Extends textual gradients to pipelines of several LLM calls and functional nodes, including cyclic ones (abstract).
- A frozen backward-engine LLM writes feedback for each sub-prompt (instructions, formats, few-shot examples) (abstract); feedback is computed only for error samples (§3.4.1).
- Implemented in the AdalFlow library (abstract); its baselines include TextGrad and DSPy's MIPROv2 (§4.1).

## In plain words

Many LLM applications chain several LLM calls with code steps such as a document retriever, sometimes in loops. The authors argue that hand-tuning each prompt "can be both time-consuming and error-prone", and that methods where an LLM critiques outputs and suggests prompt edits "do not fully address the intricacies of multi-component or cyclic pipelines" (§1).

They present LLM-AutoDiff, built into their AdalFlow library, as "a novel framework" extending those methods to whole pipelines, loops included (abstract). A fixed LLM writes feedback that is passed backwards from the final answer to every prompt, through code steps and repeated calls; another LLM rewrites the prompts. Detailed feedback is written only for answers scoring below a threshold. With GPT-3.5-turbo doing the tasks and GPT-4o writing feedback and prompts, it reports higher test accuracy than the optimizers TextGrad and DSPy on two single-call tasks (93.75% against 84.5% and 82.5% on object counting), and an agent pipeline doubling its starting accuracy in 12 training steps (§4.2). The abstract claims it "consistently outperforms existing textual gradient baselines in both accuracy and training cost".

## Background and terms

**Terms to know:** [textual gradient](#/glossary/textual-gradient) · [meta-prompt](#/glossary/meta-prompt) · [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [lost in the middle](#/glossary/lost-in-the-middle)

**The paper's own terms:**
- **Automatic LLM Application Optimization (ALAO)**: automatically tuning a system of several LLM-based modules, which "can include altering prompts, hyperparameters, or even partially finetuning"; **Automatic Prompt Engineering (APE)** is the part that optimizes only the prompts, the paper's focus (§3.1).
- **Backward engine**: the frozen LLM that writes textual gradients; the **optimizer LLM** proposes new prompts from them (§3.2, Eq. 6).
- **Parameter graph**: the directed acyclic graph AdalFlow records during one run (the forward pass), loops possibly unrolled; its nodes are parameters, which may be prompts, few-shot example sets, inputs and outputs, hyperparameters such as a retriever's top-k (§3.2).
- **Functional node**: a step with no prompt to train, such as a retriever or a step that merges and deduplicates document lists (§3.3.1).
- **Peers**: the separate parts of one LLM's prompt (task instruction, few-shot examples, output format), each its own parameter (§3.3.3, Eq. 9).
- **Meta-prompt**: here, any template given to the backward engine or the optimizer (§3.3.2, App. A).
- **Loss component**: a node holding a text description of the evaluation function, the output, the ground truth and the score, passed to the backward engine (§3.2, Eq. 3).
- **GDPO** (Gradient-Driven Prompt Optimizer): their optimizer, an extension of OPRO (§3.5).
- **DsPy(n+m)**: a DSPy baseline using "n demonstration samples plus m raw samples" (§4.1).

**Builds on:**
- Text-Grad, the authors' name for ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")) and TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), cited together: LLM critiques as gradients, shown, the authors say, on a single LLM node (§1, §2.2); TextGrad ("TG") is a baseline (§4.1).
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), which stores past prompts with their scores; GDPO extends it (§1, §3.5).
- DSPy with the MIPROv2 optimizer ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), the multi-node baseline (§4.1).
- GASO (Wang et al., not listed here), a recent multi-node method propagating "semantic gradients", which the authors say "focused largely on chain-structured tasks" (§2.2).

## Problem and setting

- **Question:** can textual-gradient prompt optimization be made to work, like automatic differentiation in PyTorch, on any LLM pipeline, including functional steps, repeated calls and cycles (§1, §2.3)?
- **Models:** GPT-3.5-turbo-0125 runs the tasks; GPT-4o-2024-08-16 is backward engine and optimizer (§4.1).
- **Pipelines** (§4.1, Tab. 1): two single-LLM tasks, ObjectCount (counting objects of a category, a BIG-Bench Hard task) and TREC-10 (classifying a question into one of 6 coarse classes); and four pipelines on HotPotQA, a multi-hop question-answering dataset: Vanilla RAG (retriever and generator), Multi-hop RAG (two sub-query generators), Multi-hop RAG (Cycle) (one sub-query generator called twice) and Agentic RAG (a ReAct-style agent, an LLM that alternates reasoning with tool calls, here Retriever and Finish).
- **Splits** (train/validation/test): ObjectCount 50/100/100; TREC-10 120/166/344; HotPotQA 50 "hard" training queries, 100 validation, 200 test (§4.1).
- **Training:** Ours runs 12 steps at batch size 4; the checkpoint with the best validation accuracy is reported on test (§4.1).
- **Correctness:** reported scores are exact match against labels (Tab. 2); on HotPotQA, F1 is the internal loss "as partial matches better reflect incremental improvements during minibatch validation" (§4.1). Ground truth is "optional if using an LLM judge" (§3.2).

## Approach

- **Graph and loss (§3.1–3.2).** The application is a directed graph whose LLM prompts are the trainable parameters; several subtask losses can be combined (Eq. 1). The backward engine writes feedback for the final output from the loss (Eq. 4); an earlier node gets feedback from each node that used its output (Eq. 5); the optimizer LLM then proposes a new prompt (Eq. 6).
- **Functional nodes (§3.3.1).** Feedback passes unchanged through a functional node with one input; with several inputs, the backward engine, given a template, passes each input "the relevant portion of the feedback" (Eq. 7). Identical feedback is merged, using keys "such as the data ID and call index".
- **Cycles (§3.3.2).** Each call of a repeated node keeps its own feedback with its call index, in time order (Eq. 8), and a meta-prompt line tells the backward engine about repeated calls.
- **Peers (§3.3.3).** One backward call writes feedback for all parts of a prompt together (Eq. 10), which the authors say avoids "confusion in multi-subprompt prompts".
- **Skip connections (§3.3.4, Fig. 3).** User-declared shortcuts, inspired by ResNets, send feedback from a late node straight to an early prompt, because signals "can diminish when LLM-based workflows grow deeper or more branched".
- **Error-only feedback (§3.4.1).** Samples scoring below a threshold get backward-engine feedback; the rest get only their score (Eq. 12). Motivation: when most samples are right, a small batch has a "nontrivial probability" of holding no error at all (Eq. 11), and textual gradient prompts "would merely rephrase existing prompts".
- **Two-stage validation (§3.4.2, Alg. 2).** Up to a set number of proposals per step are tried on the current batch; one that improves there is checked on the full validation set and kept only if it improves there too. The authors say these steps "can substantially reduce the computational and token costs".
- **GDPO (§3.5, Fig. 4).** Beyond OPRO's history of scored prompts, the optimizer sees the proposals already tried in the step, with the editing mode used ("four possible editing modes") and the rationale, plus the roles of the other parts of the same prompt (peers) and of the other prompts in the system, and a list of prompt-engineering techniques (Fig. 4).

## Results

All on Tab. 2 unless noted.
- **Single-LLM tasks:** test accuracy 93.75 (Ours) against 84.5 (TextGrad) and 82.5 (DsPy(5+2)) on ObjectCount, and 87.5 against 84.88 and 81.7 on TREC-10. The table prints values with ± and, in parentheses, "the highest observed accuracy within 12 steps".
- **HotPotQA:** the baselines are DSPy variants. The authors report "an average performance improvement of 10% across tasks" (§4.2). Agentic RAG goes from 16.5 to 32.25 test from its default prompts and tool descriptions, against 31 for DSPy as "reported" in its original paper. Against the best DSPy row, Ours scores 43.25 vs 42.375 (Vanilla), 48.25 vs 50.63 (Multi-hop, where DSPy is higher) and 49.625 vs 47.75 (Cycle); the authors call the Vanilla and Cycle gaps "a comfortable margin" (§4.2).
- **Ablations (§4.3, Tab. 3)**, on ObjectCount, TREC-10, Vanilla and Multi-hop RAG:
  - Replacing textual gradients by raw input-output-score pairs (OPRO with data) lowers test accuracy by 1, 2.4, 2.5 and 1.85 points and validation accuracy by 1, 2.7, 3.75 and 4.45. The authors conclude "Gradients Matter Most for Complex Pipelines".
  - Removing prompt-engineering cues from the optimizer lowers test accuracy by 7.75 points on ObjectCount and 2.25 on TREC-10.
  - They state that keeping a history of best prompts "consistently outperforms variants with minimal or no history".
  - Table 3 also reports how many proposals pass the minibatch and full-validation checks.
- **Efficiency:** §4.2 says that on ObjectCount Ours uses fewer tokens over 12 steps than TextGrad exploring 12 proposals, and "converges in less wall-clock time".

## Limits the authors state

- "skip connections are not automatically created for now"; "AdalFlow currently automates only standard LLM and retriever components; any additional functional node or feedback pathway (including skip connections) must be manually declared" (§3.3.4).
- Textual auto-differentiation "can be computationally expensive"; the backward pass "often dominates as the graph structure gets more complex" (§3.4).
- Agentic RAG "yields the lowest absolute accuracy across the board", which they suspect comes from the ReAct planner's "multi-task load" (§4.2).
- DSPy's agentic RAG "differs considerably, so we primarily cite reported metrics" (§4.1), which "may use slightly different dataset splits" (Tab. 2 caption).
- The work is "only the first step toward" ALAO "in truly general settings"; "the quality and quantity of labeled data strongly constrain what can be optimized" (§5).

## Open problems and building blocks

  - "automated skip-connection discovery" (§3.3.4).
  - Co-optimizing prompts with hyperparameters and partial finetuning; adaptive data labeling or LLM judges for unlabeled data; graphs whose structure changes over time; combining textual with numeric gradients; multimodal and code-centric pipelines (§5).
- **Released:** LLM-AutoDiff is implemented in AdalFlow (abstract, footnote 1); App. A gives the meta-prompt templates with their library paths, and Tab. 4 the training script for each pipeline.
- **To reuse it:** pipelines written as AdalFlow components (§3.1); a backward and optimizer LLM (GPT-4o here, App. B); labeled training and validation sets, or an LLM judge (§3.2, §5).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
