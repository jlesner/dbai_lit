# Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning

**Logic-LM** · Findings of EMNLP 2023

Read: [PDF](https://arxiv.org/pdf/2305.12295) · [arXiv](https://arxiv.org/abs/2305.12295) · [DOI](https://doi.org/10.18653/v1/2023.findings-emnlp.248)  
Code: [Logic-LLM](https://github.com/teacherpeterpan/Logic-LLM)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM translates a logic problem stated in natural language into a symbolic formulation, and a deterministic solver infers the answer from it; when the solver returns an error, the LLM is prompted with the error message to revise the formulation (abstract; §3, §3.3).
- Four formulations, each with its solver: logic programs (Pyke), first-order logic (Prover9), constraint satisfaction (python-constraint) and SAT/SMT constraints (Z3), written from few-shot prompts that give the language's grammar (§3.1–3.2, Tab. 1); compared with standard and chain-of-thought prompting on ChatGPT, GPT-3.5 and GPT-4 over PrOntoQA, ProofWriter, FOLIO, LogicalDeduction and AR-LSAT (§4). The main results fall back on chain of thought's answer where a formulation doesn't run (§4.1).
- Evidence on handing the reasoning to a solver, and on where that breaks: the authors report that on ProofWriter Logic-LM "becomes increasingly effective as the required reasoning depth increases" (§4.3, Fig. 3), that writing the formulation is harder on real-world, expert-written problems, with GPT-4's formulations executable for 32.6% of AR-LSAT before self-refinement (§4.2, Tab. 3), and that error feedback helps make formulations valid, while "a valid symbolic representation does not necessarily equate to a 'correct' problem formulation" (§4.4).

## In plain words

LLMs can be prompted to reason step by step, but the authors cite studies finding that LLMs occasionally write conclusions that do not follow from their own reasoning, and say that as "black-box probabilistic models" they lack "a mechanism to guarantee the faithfulness of reasoning" (§1). Solvers reason exactly, but only on problems written in their formal language. Logic-LM splits the work: an LLM, shown a few examples, translates a logic puzzle stated in natural language into a formal problem; an existing solver computes the answer; and when the solver reports an error, the LLM is asked to fix its translation (abstract, §3). On five logical-reasoning datasets, the authors report average gains of 39.2% over asking the LLM for the answer directly and 18.4% over step-by-step prompting (abstract), measured without the error-fixing step and with the step-by-step answer used wherever a translation does not run (§4.1, Tab. 2). They call it a "novel framework" (abstract) and say their work "pioneers in extending the concept of auto-formalization to a broader range of logical reasoning tasks with modern LLMs" (turning natural language into formal logic) (§2).

## Background and terms

**Terms to know:** [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) · [forward chaining](#/glossary/forward-chaining) (the entry also defines backward chaining) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [self-correction](#/glossary/self-correction) · [autoformalization](#/glossary/autoformalization) (the paper's broader sense below) · [logic programming](#/glossary/logic-programming) (the paper adopts Prolog's grammar of facts, rules and queries, §3.1)

**The paper's own terms:**
- **Unfaithful reasoning**: "the derived conclusion does not follow the previously generated reasoning chain" (§1). The authors claim that with a solver "the reasoning is guaranteed to be faithful as long as the problem formulation is correct" (§3).
- **Problem Formulator, Symbolic Reasoner, Result Interpreter**: the three modules, which translate the problem, solve it, and translate the solver's answer back to natural language (§3, Fig. 2). A fourth, the **Self-Refiner**, revises formulations the solver rejects (§3.3).
- **Auto-formalization**: in this paper, "converting natural language into symbolic representations" (§2), which the authors extend from mathematics to logical reasoning; the glossary's sense is narrower (mathematics for a proof assistant).
- **Exe_Rate and Exe_Acc**: the share of formulations the solver can execute, which "only reflects the grammar correctness", and the accuracy on those executable ones, which measures "semantic" correctness (§4.2, Tab. 3).
- **Standard and CoT**: the baselines; Standard answers directly from in-context examples, CoT generates "explanations before providing the final answer" (§4 "Baselines").

**Builds on:**
- Chain-of-thought prompting (Wei et al., 2022b), one of the two baselines (§4 "Baselines").
- PAL (Gao et al., 2023; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")) and Program of Thoughts (Chen et al., 2022), where the LLM writes Python for arithmetic problems; the authors say the idea "has not been extended to logical reasoning problems", mainly because their "non-linear" reasoning is hard to write as functional programs, so Logic-LM describes the problem instead of the procedure (§2 "Tool-augmented Language Models").
- Self-debugging (Chen et al., 2023; [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and Self-Refine (Madaan et al., 2023), which use similar ideas to improve code generation; the Self-Refiner applies them to logic forms (§3.3).
- The SAT grammar of Ye et al. (2023), used for the analytical-reasoning problems (§3.1).

## Problem and setting

- **Question:** does an LLM that only translates a logic problem into a solver's language, leaving the inference to the solver, beat LLMs that reason in text (§1, §3)?
- **Input:** a problem in natural language and a goal, a question; all examples are converted to multiple choice (§3, §4).
- **Datasets** (§4 "Datasets"; sizes in App. B, Tab. 5):
  - PrOntoQA, synthetic deductive reasoning: the hardest version (fictional characters) and its 5-hop subset (five reasoning steps).
  - ProofWriter, deductive reasoning in more natural wording: the open-world-assumption subset (a fact that can't be proved is unknown, not false), whose labels are proved, disproved or unknown, at depth 5 (up to five reasoning steps), with 600 test examples sampled "To reduce overall experimentation costs".
  - FOLIO, expert-written problems that need first-order logic.
  - LogicalDeduction (a task of the BigBench collaborative benchmark): mostly ordering objects from a minimal set of conditions.
  - AR-LSAT, the analytical-reasoning questions of the Law School Admission Test, 1991–2016.
- **Models:** ChatGPT (`gpt-3.5-turbo`), GPT-3.5 (`text-davinci-003`) and GPT-4, at temperature 0, picking "the response with the highest probability"; the same in-context examples for every method, 1–5 per dataset from its training set (§4); App. C describes prompts of 2 demonstrations and prints one of each.
- **Correct** means selecting the right option; the metric is accuracy (§4).
- **Not discussed:** which base model the depth study uses (§4.3, Fig. 3), and how many refinement rounds Tab. 3 uses (Fig. 4 tests 0–3 on FOLIO).

## Approach

- **Problem Formulator (§3.1, Tab. 1):** a few-shot prompt gives the grammar of the target language and demonstrations; the LLM writes the problem's facts and rules in that language. Four languages: logic programs for deductive reasoning (PrOntoQA, ProofWriter); first-order logic premises and a conclusion to prove for FOLIO; a constraint problem as variables, domains and constraints for LogicalDeduction; and Ye et al.'s SAT formulation, constraints under a theory plus a query, for AR-LSAT. In the demonstrations, each formula is paired with the sentence it encodes.
- **Symbolic Reasoner (§3.2):** a deterministic solver per language. Pyke, an expert system (a rule-based inference program), applies forward and backward chaining; Prover9, an automated theorem prover for first-order logic, converts formulas to clause form (conjunctive normal form: an AND of ORs of possibly negated atoms) and applies resolution (a proof-search rule) to decide whether the conclusion is true, false or unknown; python-constraint solves constraint problems over finite domains; Z3, Microsoft's SMT solver, handles the SAT formulations.
- **Self-Refiner (§3.3):** when the solver returns an execution error, the LLM gets "the erroneous logic form, the solver's error message, and a set of demonstrations showing common error cases" with their fixes; this repeats until no error is returned or a maximum number of revisions is reached.
- **Result Interpreter (§3.4, App. D):** rule-based or LLM-based; for AR-LSAT, each option is proved separately.
- **Fallback:** a formulation with grammar errors gets no answer from the solver; for these cases the main results use chain of thought's prediction (§4.1).

## Results

- **Main results (§4.1, Tab. 2; without self-refinement, with the fallback):** the abstract reports average gains of 39.2% over Standard and 18.4% over CoT; §4.1 states the first "With GPT-3.5". Tab. 2 shows Logic-LM below CoT on PrOntoQA with ChatGPT and with GPT-4.
- **Where CoT helps (§4.1, observation 3):** on FOLIO, LogicalDeduction and AR-LSAT, CoT's benefit over Standard is "comparatively less substantial or even negative" than on PrOntoQA and ProofWriter. The authors' "plausible explanation" is that CoT mimics forward-chaining reasoning, while first-order logic and constraint problems "often necessitate more sophisticated reasoning strategies".
- **Translation quality (§4.2, Tab. 3):** the authors report execution rates near 100% on PrOntoQA, ProofWriter and LogicalDeduction. On the real-world, expert-written FOLIO and AR-LSAT, GPT-4's formulations are executable 79.9% and 32.6% of the time before self-refinement. Executable GPT-4 formulations "generally achieve high Exe_Acc, even for the most challenging AR-LSAT dataset".
- **Reasoning depth (§4.3, Fig. 3):** on 300 examples from each ProofWriter subset (0 to at most 5 reasoning steps), Logic-LM beats CoT by 7.1% at depth 0 and by 39.4% at depth 5, and the authors say it "becomes increasingly effective as the required reasoning depth increases". The performance of Standard and CoT "declines precipitously" with depth, while the trend is "less prominent" for Logic-LM. The authors read this as validating their assumption that formalizing a problem should, "Ideally", stay about equally hard whatever the reasoning depth.
- **Self-refinement (§4.4, Tab. 3, Fig. 4):** it raises Exe_Rate "by 5.01 on average" (Tab. 3). On FOLIO, over 0–3 rounds, the authors find the executable share "consistently increases, leading to an enhancement in the final performance", while accuracy "tends to stagnate in subsequent rounds" (Fig. 4). Tab. 3 shows GPT-4's Exe_Acc on FOLIO and AR-LSAT falling slightly after refinement.
- **Error cases (§4.5; App. E, Fig. 6):** in the examples, GPT-4 defines predicates that don't fit together, confuses "below" with "above", and writes formulas that break the first-order grammar.

## Limits the authors state

- Applicability is "inherently bounded by the expressiveness of the symbolic solver", "for example, not all problems can be easily encoded in first-order logic". The authors say integrating more kinds of solvers can mitigate this, and that the framework's flexible design makes that easier (§ Limitations).
- Translation by in-context learning with self-refinement "may face difficulties when dealing with logical representations with intricate grammar structures, such as probabilistic soft logic" (a logic of weighted rules with soft truth values), because complex grammar rules are hard to convey "through a limited number of demonstrations within a constrained context size"; as a potential solution they name specialized modules, "e.g., fine-tuning LLMs with synthetic data generated via symbolic solvers" (§ Limitations).
- The near-100% execution rates on the mostly synthetic datasets are "somewhat anticipated", given their limited language variability; real-world problems are harder to convert (§4.2).
- The Self-Refiner's only feedback is the solver's error message, which helps turn invalid formulations into valid ones, but "a valid symbolic representation does not necessarily equate to a 'correct' problem formulation". The authors suggest feedback "beyond the error message, e.g., a reward signal from an additional module evaluating the accuracy of a generated symbolic form", and leave it "as a promising direction for future exploration" (§4.4).
- "transforming problems into logical forms remains a challenging task for modern LLMs" (§4.5).
- The LLMs whose APIs they use, "especially GPT-4, consume significant energy" (§ Ethics Statement).

## Open problems and building blocks

  - Extending Logic-LM to "more flexible and powerful logic systems", e.g. statistical relational learning systems (logics whose rules carry weights or soft truth values) such as Markov logic networks and probabilistic soft logic, for reasoning under uncertainty (§5).
  - Reasoning problems that need commonsense, which "remains a significant challenge" (§5).
- **Released:** "Code and data are publicly available" (abstract footnote).
- **To reuse it:** few-shot prompts that state each language's grammar, with demonstrations (§3.1; full prompts in App. C); the solvers Pyke, Prover9, python-constraint and Z3 (§3.2); OpenAI's API models at temperature 0 (§4); and their work "performs few-shot in-context learning instead of training models from scratch" (§ Ethics Statement).
- **Beyond its domain:** "By defining additional problem-specific formulations, our framework retains the flexibility to accommodate a wider range of reasoning tasks" (§3.1).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
