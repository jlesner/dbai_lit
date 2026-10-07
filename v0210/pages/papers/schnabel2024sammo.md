# Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization

**SAMMO** · Findings of EMNLP 2024

Read: [PDF](https://arxiv.org/pdf/2404.02319) · [arXiv](https://arxiv.org/abs/2404.02319) · [DOI](https://doi.org/10.18653/v1/2024.findings-emnlp.37)  
Code: [sammo](https://github.com/microsoft/sammo)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compile-time search over prompt programs represented symbolically (abstract).
- Searches structural transformations of the program, not only its wording, for instruction tuning, RAG pipeline tuning and prompt compression (abstract; operators, §4.2, Tab. 1).
- Tunes a prompt program's structure; the authors report DSPy's COPRO doing worse than the baseline prompt in their instruction-tuning runs (§5.1).

## In plain words

Many LLM applications, such as retrieval-augmented generation, call one long, structured prompt repeatedly with different inputs. The authors treat such prompts as programs and call optimizing them "a big practical challenge", since earlier work "mostly focused on either simple prompt programs or assumed that the general structure of a prompt program is fixed" (abstract). They build SAMMO, a framework that stores a prompt program as a graph of parts and searches, once before deployment and seeing only the model's text replies, over edits to its wording, formatting and structure, such as dropping a section or changing how data is laid out.

Against the starting prompt, with three or four LLMs per task, they report gains of 10–100% in instruction tuning and 26–133% in tuning a retrieval-augmented prompt (§1). For prompt compression they report costs cut by over 40% at the starting prompt's accuracy (§1, §5.3). They present SAMMO as one that "generalizes previous methods" (abstract) and, "to the best of our knowledge", as "the first optimization method that can also optimize for large structural changes and data formatting" (§4.2).

## Background and terms

**Terms to know:** [beam search](#/glossary/beam-search) · [evolutionary search](#/glossary/evolutionary-search) · [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm) · [semantic parsing](#/glossary/semantic-parsing)

**The paper's own terms:**
- **SAMMO**: "Structure-Aware Multi-objective Metaprompt Optimization" (§4 heading), the framework and its library.
- **prompt program**: a function that takes input data and maps it to an output string (§2).
- **symbolic prompt program (SPP)**: a prompt program stored as a directed acyclic graph whose nodes are functions with attributes (for example, a node that renders the text "Instructions:", or one that renders input examples in a chosen format) and whose edges are call dependencies; the whole graph is held symbolically through PyGlove (Peng et al., 2020), a library for symbolic programming, so it can be inspected and edited (§2.1, Fig. 1).
- **static prompt program**: one with "a fixed structure which limits the operations to mostly changes in a node's attributes, e.g., by paraphrasing text"; the paper names DSPy programs as an example (§2).
- **compile-time vs run-time optimization**: compile-time optimization runs "only once before deployment", so its cost is amortized over many calls and the run-time setup stays unchanged; run-time methods (for example token pruning) run before every call (§1, §3).
- **black-box model access**: "the only information returned is the response text and no probabilities" (§3).
- **mutation operator**: a probabilistic rule that turns one SPP into an edited one (§4.2); Table 1 groups examples by what they change: text attributes (paraphrase, induce instructions from examples, shorten, turn into bullet points, remove stopwords, the common filler words), other attributes (section format, data format such as JSON or XML, fewer in-context examples) and structure (drop or repeat a section).
- **enumerative vs iterative search**: enumerative search tries a search space given up front as a set of choices (in its current version SAMMO implements grid search and random search); iterative search starts from a prompt and grows new candidates by applying mutation operators (§4.1).
- **search budget B**: the number of candidate evaluations each method may spend (§5).
- **weighted costs**: input tokens with weight one plus output tokens with weight two, "to reflect current billing schemes of popular LLM providers" (§5.3).

**Builds on:**
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a framework that composes LLM calls into programs: SAMMO "naturally extends previous prompt programming approaches such as DSpy" (§1); its COPRO optimizer (not described in the paper) and MIPRO, "a method that optimizes few-shot examples as well the instructions", are baselines (§5.1, §5.2).
- APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), which "generates instruction candidates from a few input-output pairs, and then uses beam search over paraphrased candidates" (§6), and GrIPS (Prasad et al., 2023), which edits the parse tree of the instructions with add, delete, swap and paraphrase steps (§4.3), are shown as special cases of SAMMO (§4.3); with APO ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), which "re-writes instructions by generating explanations for errors" (§6), all three are baselines (§5.1).
- Bogin et al. (2023), whose splits, DSLs and starting prompt format the RAG experiment reuses (§5.2); and the batching format of Cheng et al. (2023) (§5.3).

## Problem and setting

- **The question:** given labelled samples and an objective, return a better-performing prompt program, found by search over a space of SPPs (§3, Eqs. 1–3).
- **Assumptions:** black-box LLM access (§3); datasets "on the order of hundreds of examples", which the authors call a reasonable amount to hand-label (§3); n = 100 training and 100 test examples "unless noted otherwise" (§5); a budget of B = 48 candidate evaluations, the same for all baselines, unless noted otherwise (§5).
- **Back-end LLMs:** Mixtral 8x7B and Llama-2 70B (open models), GPT-3.5 and GPT-4 (closed) (§5; versions in App. A.1).
  - instruction tuning on eight BigBench zero-shot classification tasks (a large collection of LLM test tasks), sampled from tasks where GPT-3.5's starting accuracy was below 0.9; GPT-4 is left out since it "showed negligible headroom for improving instructions in these simple prompt programs in pilot experiments" (§5.1);
  - retrieval-augmented semantic parsing on three datasets, GeoQuery, SMCalFlow and Overnight (questions or requests mapped to a formal language), with 500 examples to retrieve from, 100 of them for training scores, and B = 24 (§5.2);
  - prompt compression on ten Super-NaturalInstructions classification tasks (a benchmark of tasks with written instructions) whose instructions have 1,000 characters or more; the objective is weighted costs, with accuracy required to stay above the baseline's with margin ε = 0.02 (§5.3).
- **What "correct" means:** task accuracy on the held-out test sample (Figs. 3, 4, 6).

## Approach

- **Running an SPP:** each node does a top-down step that passes state to its children and a bottom-up step that combines their results (§2.2); the Fig. 1 program joins text spans with the input, sends it to the LLM and parses the reply (§2).
- **Iterative search** (Alg. 1): start from candidates made from the baseline prompt; each round, sample active candidates, apply mutators that fit each one, and prune the pool by the objective on the training set; return the best. Choices of these functions give beam search, regularized evolutionary search or breadth-first search (§4.1); SAMMO runs with beam search "unless noted otherwise" (§5).
- **Mutators** come from Table 1 or are written by users "to encode domain-specific heuristics" (§4.2).
  - instruction tuning uses the default beam search (§5);
  - RAG uses enumerative search over the in-context example format, their grouping, their number and the DSL specification (§5.2, App. A.5);
  - compression uses "all mutation operators listed in Table 1", picked uniformly at random (§5.3), with input batch sizes chosen per model in pilot runs (§5.3).

## Results

- **Instruction tuning** (Fig. 3; per task in Tab. 2): SAMMO "is able to outperform all other baselines" with GPT-3.5, Llama-2 and Mixtral (§5.1). DSPy COPRO "performed even worse than the baseline prompt", since DSPy's prompting "often caused the model to not adhere to the output format" (§5.1, App. A.2.1). As "a side note", baseline performance "seems to be correlated with how much performance we gain": Llama-2 about 2x, GPT-3.5 around 10% (§5.1).
- **RAG** (Fig. 4): "substantial gains across most datasets and backend LLMs"; average gains of 133% for Llama-2, 44% for Mixtral and 30% for GPT-4 over the baseline prompt; the authors note that "relative gains decrease with increasing model strength" (§5.2). DSPy MIPRO does worse than SAMMO "in all but one setting", from wrong-format answers and overfitting, with training accuracies that "can reach 100%" (§5.2, Fig. 8).
- **Transfer across LLMs:** the training scores of the 24 RAG candidates, averaged over the three datasets, correlate only weakly between LLMs (0.37–0.54 pairwise, Fig. 5), "which indicates that prompts may need to be optimized separately for each LLM" (§5.2).
- **Compression** (Fig. 6, Tab. 3): SAMMO reduces costs "by over 40% while maintaining the accuracy of the baseline prompt" for all back-end models (§5.3). STDC (which prunes the instruction's syntax tree) and the stopword baseline compress only moderately, "most likely because their mutation operations are limited"; APE and GPT-4 Rewrite (ten shortening templates) compress more but "can result in prompts that do not generalize well to the test set": with GPT-3.5, test accuracy 0.464 (APE) and 0.484 (Rewrite) against 0.587 for the baseline and 0.599 for SAMMO (Tab. 3).
- **Which operators help** (Fig. 7, "a rough idea" of each operator's contribution): success "depends on the backend LLM"; rewriting and dropping in-context examples were the most useful, and GPT-4 tolerated fewer examples and a dropped introduction better than the other LLMs (§5.3).

## Limits the authors state

- Results "could be sensitive to search hyperparameter choices"; they "could not afford to run a full hyperparameter search" (Limitations).
- Due to SAMMO's high-level operators, "we did not observe substantial drops in performance between training and test sets", but methods "that mostly optimize in-context examples like DSPy showed a large risk of overfitting" (Limitations).
- All datasets are English; "performances for lower-resource language are likely to be lower" (Limitations).
- "tasks need to have a certain level of downstream usage in order to compensate for the upfront costs of optimization" (Limitations).
- SAMMO "adopts a supervised learning scenario where labels are required" (Limitations).

## Open problems and building blocks

  - "more research is needed to understand when and how overfitting occurs" in prompt optimization (Limitations);
  - future research "could also combine run-time optimization with compile-time optimization" (Limitations);
  - "we plan to address more unsupervised tasks in the future" (Limitations);
  - the authors "will explore more sophisticated search strategies in future work" (§4.1).
- **Released:** "all code available open-source" (abstract), under an MIT license (§1), and as "an open-source project" (§7).
- **To reuse it:** black-box API access to an LLM (§3); a few hundred labelled examples (§3, §5); a budget of 24–48 candidate evaluations per run (§5); for RAG, an embedding model for retrieval (App. A.5).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
