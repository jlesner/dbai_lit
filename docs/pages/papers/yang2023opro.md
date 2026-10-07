# Large Language Models as Optimizers

**OPRO** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2309.03409) · [arXiv](https://arxiv.org/abs/2309.03409)  
Code: [opro](https://github.com/google-deepmind/opro)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM is the optimizer: it sees past prompts with their scores and proposes better ones.
- Meta-prompt holding the scored trajectory.
- Score-only feedback plus random task exemplars (§5.1); the authors report that error cases in the meta-prompt gave similar results (§7). Later work (MAGE) reports OPRO stuck at its seed prompt in its setup ([MAGE](#/papers/singh2026mage "MAGE: Understanding Stability-Performance Trade-offs in Multi-component Prompt Optimization (2026)") §5.2).

## In plain words

Optimization algorithms "typically" need customizing for each task, "especially for derivative-free optimization", the authors say, and the space of prompts is "large and discrete", hard to search "especially when only API access to the LLM is available" (§1). They propose OPRO (Optimization by PROmpting): describe the problem in plain language, show an LLM earlier solutions with their scores, and ask it for better ones, which are scored and added back (abstract). They try this on two small math problems, fitting a line and the traveling salesman problem, then on their main application: finding an instruction that raises an LLM's task accuracy. On GSM8K (grade-school math word problems), with Google's pre-trained PaLM 2-L answering zero-shot and its instruction-tuned version optimizing, the best instruction found scores 80.2 against 71.8 for "Let's think step by step." (Tab. 4). On Big-Bench Hard, 23 hard reasoning tasks, the abstract reports "the best prompts" beating human-designed ones "by up to 50%". They present OPRO as "a simple and effective approach" (abstract) that writes prompts from the whole scored history "instead of editing one input prompt" (§1).

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt) · [black-box optimization](#/glossary/black-box-optimization) · [evolutionary search](#/glossary/evolutionary-search) · [genetic algorithm](#/glossary/genetic-algorithm) · [textual gradient](#/glossary/textual-gradient)

**The paper's own terms:**
- **scorer LLM** and **optimizer LLM**: the model the instruction is applied to and scored on, and the model that writes new instructions; they "can be the same or different" (§4.1).
- **instruction**: the optimizer's output, "concatenated to the question part of every exemplar" given to the scorer (§4.1).
- **Q_begin, Q_end, A_begin**: the instruction goes before the question, after it, or at the start of the scorer's answer; A_begin suits pre-trained models prompted with question–answer pairs (§4.1, App. B).
- **optimization trajectory**: past solutions with their scores, "sorted in the ascending order" (§2.2).
- **optimality gap** (TSP): how much longer the found tour is than the optimal one, as a fraction of it; optimal tours come from the Gurobi solver (§3.2).
- **exploration–exploitation trade-off** (missing from the glossary): the optimizer "should be able to exploit promising areas of the search space where good solutions are already found, while also exploring new regions" (§2.1).

**Builds on:**
- APE (Zhou et al., 2022b; [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")) and APO (Pryzant et al., 2023; [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)"), listed as ProTeGi), earlier LLM prompt generators: APE has the LLM write a semantically similar variant of top instructions, APO has it write text feedback for editing one instruction (§1, §6). In the glossary's terms, APO's feedback is a textual gradient.
- The human-designed baselines "Let's think step by step." (Kojima et al., 2022, not listed here) and APE's "Let's work this out in a step by step way to be sure we have the right answer." (Tab. 4).
- EvoPrompt (Guo et al., 2023; [EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), compared in §5.5: its genetic-algorithm (GA) and differential-evolution (DE) meta-prompts ask the LLM to cross over and mutate two given prompts; the paper groups it with Promptbreeder (Fernando et al., 2023; [Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")) (§5.5).
- OptFormer (Chen et al., 2022, not listed here), a transformer trained on hyperparameter-optimization histories; OPRO works "solely by prompting without additional training" (§6).

## Problem and setting

- **Question:** can an LLM act as an iterative optimizer from a plain-language problem description and scored past solutions (§1, §2)? The main application: prompts for tasks "where both the input and output are in the text format" (§4.1).
- **Objective:** training accuracy; test accuracy is computed after optimization (§4.1). The authors "assume a training set is available" (§1) and say a small fraction, "e.g., 3.5% of the training set for GSM8K", 20% for Big-Bench Hard, "is sufficient" (§4.1). No validation set by default (§5.4).
- **Models:** optimizers pre-trained PaLM 2-L, its instruction-tuned PaLM 2-L-IT, text-bison (an instruction-tuned PaLM-2-family model), gpt-3.5-turbo and gpt-4; scorers pre-trained PaLM 2-L (A_begin) and text-bison (Q_begin or Q_end) (§1, §5.1).
- **Benchmarks:** GSM8K, 7,473 training and 1,319 test problems; BBH (Big-Bench Hard), 23 tasks "including symbolic manipulation and commonsense reasoning", up to 250 examples each, 20% for optimization (§5.1, §5.2.2); MultiArith and AQuA, two more math reasoning datasets, for transfer (§5.2.4).
- **Defaults** (§5.1): optimizer temperature 1.0 "unless otherwise specified", scorer temperature 0; 8 instructions per step; the meta-prompt holds the best 20 instructions and 3 random training exemplars; 200 steps (§5.2.1).
- **Math case studies:** linear regression with one input and an intercept on 50 synthetic points, with the formula kept out of the meta-prompt (§3.1); TSP on random points, 5 instances per size up to 50 nodes, against the nearest-neighbor and farthest-insertion heuristics, which build a tour node by node (§3.2, Tab. 3).

## Approach

- **The loop** (§2, Fig. 2): the optimizer LLM reads the meta-prompt and proposes solutions; they are evaluated and added; the loop stops when the LLM "is unable to propose new solutions with better optimization scores", or after a maximum number of steps.
- **The meta-prompt** (§2.2, §4.2, Fig. 3): the problem description and instructions on goal and output format, which can add soft constraints ("the instruction should be concise and generally applicable"); the trajectory, keeping only the highest-scoring instructions because of context length, with scores rounded to integers (§5.3); and, for prompts, a few training exemplars showing the task and where the instruction goes, sampled at random or chosen from those "the previous instructions fall short of" (§4.2).
- **Stability and exploration** (§2.3): several solutions per step, for stability; the sampling temperature trades exploration against exploitation.
- **Per-model meta-prompts:** "Different optimizer models work the best on different styles of meta-prompts" (App. C.2).

## Results

The authors report:
- **Linear regression** (§3.1, Tab. 2): each optimizer explores fewer pairs than exhaustive search, gpt-4 the fewest; targets farther from the start take more steps.
- **TSP** (§3.2, Tab. 3): at 10 nodes every LLM finds every optimal tour; gpt-4 "significantly outperforms" the other LLMs; as size grows the gaps "increase quickly" and farthest insertion "starts to outperform all LLMs".
- **GSM8K** (§5.2.1, Tab. 4, the instruction with the highest test accuracy per scorer–optimizer pair): with the PaLM 2-L scorer, "Take a deep breath and work on this problem step-by-step." (PaLM 2-L-IT optimizer) scores 80.2, against 71.8 for "Let's think step by step." and 58.8 for APE's prompt; with the text-bison scorer the best is 68.5 against 65.6 for APE's prompt. Curves show "an overall upward trend with several leaps" (Fig. 1).
- **BBH** (§5.2.2, PaLM 2-L-IT optimizer, from the empty instruction): found instructions beat "Let's think step by step." by over 5% on 19 of 23 tasks with the PaLM 2-L scorer and 15 of 23 with text-bison, and beat the empty start by over 5% "on most tasks".
- **Sensitivity** (§5.2.3): on GSM8K with the PaLM 2-L scorer, an instruction combining two others' meanings scored below both.
- **Transfer** (§5.2.4, Tab. 6): GSM8K-found instructions beat all baselines on MultiArith and AQuA with both scorers; with PaLM 2-L, 95.3 and 54.3 against the best baselines' 87.5 and 48.4.
- **Ablations** (§5.3, Figs. 7–10, GSM8K and BBH sports_understanding, 3 repetitions): ascending order beats descending and random; showing scores helps; exemplars are "critical", but more "do not necessarily improve the performance"; 8 instructions per step "overall" does best for a fixed number of evaluated instructions; temperature 1.0 does best; the starting instruction matters little with text-bison and more with the PaLM 2-L scorer, "especially at the beginning"; generating 50 instructions in one step "performs much worse".
- **Overfitting check** (§5.4, Fig. 11): with a validation set, "the validation accuracy curves trend up and down alongside the training curves" in both settings tried.
- **EvoPrompt** (§5.5, Fig. 12, gpt-3.5-turbo optimizer): on GSM8K from generic starts OPRO improves steadily while both EvoPrompt versions "even degrade the performance", which the authors attribute to EvoPrompt using no exemplars; from task-specific starts, EvoPrompt (DE) improves, but less stably than OPRO.

## Limits the authors state

- OPRO "is designed for neither outperforming the state-of-the-art gradient-based optimization algorithms" nor "specialized solvers"; the context window "makes it hard to fit" large problems, and on "too bumpy" landscapes optimization can "get stuck halfway" (§3.2).
- Failure cases "across all optimizer LLMs": hallucinated calculated values, not reliably avoiding old solutions, getting stuck at points "neither global nor local optimal", and the Rosenbrock function's narrow valley (App. A).
- "It is difficult to avoid overfitting"; training accuracies "are often 5%-20% higher" than test (§5.4).
- The optimizer "does not effectively utilize error cases": error cases in place of random exemplars gave "similar" results (§7).
- It needs a training set that "at least contains tens of samples" (§7).
- Low-quality solutions in the trajectory "sometimes" cause "optimization instability and large variance" (§2.3); with the PaLM 2-L scorer, from weaker starts the optimizer needs more steps "to get rid of worse instructions" (§5.3).
- With gpt-3.5-turbo, many A_begin instructions are questions or commands, better suited to the question part (App. E.2).

## Open problems and building blocks

  - "how to reduce the sensitivity to initialization and better balance exploitation with exploration remains a challenge" (§7);
  - richer feedback on error cases than the aggregated accuracy, and summarizing what separates good from bad prompts, which may "potentially further reduce the example set size" (§7);
  - "explicit natural language feedback on generated solutions" (§6);
  - when and how to call tools for calculations (App. A);
  - a larger training set and early stopping "may help reduce overfitting" (§5.4);
  - "how to safeguard model behavior remains valuable future work" (Ethics Statement).
- **Released:** code (abstract).
- **To reuse it:** a training set (§1, §7); a scorer and an optimizer LLM, which can be API models (the text-bison API and the 0613 GPT models, Reproducibility Statement); 8 optimizer calls per step and scoring each instruction on the training subset, whose size on GSM8K "balances the evaluation cost with the generalization performance" (§5.1, §5.2.1); 200 steps by default, though "much fewer steps" may do "if the goal is to find some outstanding instructions" (§5.2.1); a meta-prompt style suited to the optimizer (App. C.2).
- **Beyond its domain:** OPRO is presented as a general optimizer that "enables quick adaptation to different tasks by changing the problem description" (§1), shown on linear regression and TSP (§3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
