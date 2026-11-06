# ExPairT-LLM: Exact Learning for LLM Code Selection by Pairwise Queries

**ExPairT-LLM** · AAAI 2026 (per the PDF's copyright line, p. 1)

Read: [PDF](https://arxiv.org/pdf/2511.10855) · [arXiv](https://arxiv.org/abs/2511.10855)  
Code: [ExPairT-LLM](https://github.com/TomYuviler/ExPairT-LLM)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Code selection as exact learning with an LLM as the oracle: candidate programs are clustered by their outputs on a few inputs, a round-robin tournament of "pairwise membership" queries (which of two output lists better fits the task) picks a cluster, and "pairwise equivalence" queries ask the LLM for an input on which two programs of that cluster differ; an input confirmed by running both programs splits the cluster and the loop repeats (abstract; § "Introduction"; § "Exact Learning by Pairwise Queries to LLMs", Alg. 1).
- With an oracle that always answers correctly it returns a correct program (Thm. 4); with an imperfect one, under independence assumptions, the authors give a lower bound on choosing the correct cluster and the probability of finding a differentiating input (Thms. 5–6; Thm. 6 also needs a random order its statement omits), and at most |P|-choose-2 queries of each type for |P| candidates (Thm. 7). Evaluated on HumanEval, MBPP-sanitized and APPS against B4 and CodeT, and with o1-mini, DeepSeek-R1 and Gemini 2.5 Flash on APPS and LiveCodeBench (§ "Evaluation").
- An LLM as a source of distinguishing inputs whose disagreement is confirmed by execution, while its NO_DIFF answer and its pick of the better outputs stay unchecked: a code analogue of LLM-written databases that separate SQL candidates agreeing on a test database (LLM-generated test databases). The authors report that the equivalence queries raise pass@1 on HumanEval by +7.7% on average over the variant without them (§ "Evaluation", "Importance of Our Queries"; Fig. 6).

## In plain words

Code selection methods sample many LLM-written candidate programs and pick one. Existing selectors, the authors argue, "can fail to identify the correct program", because they may not separate programs that behave differently or assume an LLM always knows the right output (abstract). They recast selection as exact learning (learning a hidden target by asking a teacher questions), asking an LLM two kinds of questions they call "simpler for LLMs" (abstract): which of two output lists fits the task better, and whether two programs behave alike, with an input where they differ if not. A tournament of the first question picks a group of programs with equal outputs; an input from the second, checked by running both programs, splits it. They prove a correct program is returned if the LLM never errs, some candidate is correct, and all candidates are deterministic and halt. With o1-mini as the LLM, pass@1 (success rate) beats B4, a prior selector they call "the state-of-the-art", by +13.0% on average on three benchmarks; three reasoning LLMs writing their own candidates gain +24.0% over their first program (abstract). They present the advance as "two new types of queries" (abstract).

## Background and terms

**Terms to know:** [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [program equivalence](#/glossary/program-equivalence) · [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis) · [McNemar's exact test](#/glossary/mcnemars-exact-test) (the paper says only "McNemar's test") · [Copeland's method](#/glossary/copelands-method) (its tournament over clusters by pairwise membership queries, § "Pairwise Membership…", "Pairwise Comparisons")

**The paper's own terms:**
- **code selection**: given a coding task (a natural-language description, possibly with input-output examples) and a finite set of candidate programs that contains a correct one, return a correct program (§ "Problem Definition").
- **exact learning**: in the glossary's terms, query learning (§ "Pairwise Membership & Equivalence Queries", "Exact Learning"). Its classic queries would ask whether one input-output pair fits the task, or whether a program satisfies it; the authors say the first may need "an excessively large number of interactions" for one input's output and call the second "too challenging for LLMs" (same place).
- **pairwise membership query**: the task, a list of inputs and two lists of outputs; the oracle (the teacher, here an LLM) says which list is more suitable (§ "Pairwise Membership…", "Pairwise Queries").
- **pairwise equivalence query**: the task and two programs; the oracle says whether they are "semantically equivalent with respect to t" (the task) and, if not, gives a **differentiating input**, on which their outputs differ (same place).
- **cluster**: the candidates with identical outputs on the current inputs (Alg. 1).
- **accurate oracle**: one that answers every query correctly; given two wrong output lists, it picks either (§ "Exact Learning by Pairwise Queries to LLMs", "Guarantees" and "Example").
- **p and p′**, two senses of p: in Thm. 5, the chance that the oracle answers a pairwise membership query correctly when one of the two clusters is the correct one; in Thm. 6, the chance that it returns a differentiating input for a correct and an incorrect program, with p′ that chance for two incorrect programs (§ "Exact Learning by…", "Guarantees").
- **pass@1**: the percentage of tasks for which the selector returns a correct program (Eq. 1), correct meaning that it passes the dataset's hidden tests; tasks whose candidates are all correct or all wrong are left out (§ "Evaluation", "Setup").
- **Original**: the LLM's first program, unselected (§ "Evaluation").

**Builds on:**
- Exact learning from queries, Angluin (1987a, 1987b), which the authors "extend … to the problem of LLM code selection" (§ "Introduction"); not listed here.
- The baselines (§ "Evaluation", "Baseline Comparisons"): B4 (Chen et al. 2024a), which "defines the optimal selection strategy using a Bayesian framework" over which candidates pass which generated tests (not listed here); and CodeT (Chen et al. 2023a; [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)")), which selects by "dual execution agreement" (passing generated tests and agreeing with other candidates' outputs) with LLM-generated tests.
- LLMCodeChoice (Fan et al. 2024), which seeks differentiating inputs by fuzzing and symbolic execution (generated inputs, and running code on unknowns); the authors say "it is not robust to LLM errors, and fuzzing and symbolic execution tend to fail on tasks with complex input constraints" (§ "Introduction"); not listed here.

## Problem and setting

- **Question:** how to pick a correct program among LLM-written candidates for a task given in natural language (and possibly examples), with no user to ask, using an LLM oracle that can be wrong (§ "Problem Definition", "Challenges").
- **Assumptions:** the candidate set is finite and contains a correct program, and the programs are deterministic and terminate on every input; "stochastic or nonterminating programs can be removed in a preprocessing step", and obtaining the candidates is "orthogonal to our problem" (§ "Problem Definition", "Tasks and Programs").
- **Main setup** (§ "Evaluation", "Setup"), "Unless otherwise specified": 25 candidates per task, five initial inputs written by GPT-4o, o1-mini as the oracle. Benchmarks (of code generation from task descriptions) with hidden tests: HumanEval (164 tasks, its in-task examples removed), MBPP-sanitized (427) and the APPS test set (5,000). Candidates from five code models (Codex, CodeLlama, StarCoder, DeepSeek-Coder, CodeGen), taken from B4's repository; APPS with Codex only.
- **Reasoning-LLM setup** (§ "Evaluation", "LLMs with Complex Reasoning"): the reasoning LLMs o1-mini, DeepSeek-R1 and Gemini 2.5 Flash each write 10 candidates and five inputs and act as the oracle, on 150 random APPS tasks and LiveCodeBench (a code-generation benchmark; 511 tasks).

## Approach

- **The loop** (§ "Exact Learning by…", "Pseudocode"; Alg. 1, Fig. 1; example in Fig. 3). Start with all candidates as the selected cluster. Run it on the current inputs and split it into clusters (line 3). Pose one pairwise membership query per pair of clusters; the highest-scoring cluster becomes the selected cluster (lines 5–10). Compare its first program with each other one by pairwise equivalence queries (lines 12–13). If the LLM returns an input on which the two programs' outputs really differ when run (line 14), it becomes the only input and the loop repeats (line 15); otherwise the first program is returned (line 16).
- **Prompts** (§ "LLM Prompt Examples for Pairwise Queries", Figs. 7–8): the membership prompt shows the inputs on which the two output lists differ and asks for "Program 1" or "Program 2"; the equivalence prompt asks for a differentiating input or "NO_DIFF".
- **Advantages the authors claim** (§ "Exact Learning by…", "Advantages"): it is "robust to some LLM errors" through the tournament's aggregate score and by validating differentiating inputs, and, unlike fuzzing and symbolic execution, it "can handle tasks with complex input constraints".
- **Guarantees** (§ "Exact Learning by…", "Guarantees"; proofs in § "Proofs"), all for a finite candidate set that contains a correct program and holds only deterministic, terminating programs:
  - It stops within as many iterations as there are candidates (Lemma 1).
  - With an accurate oracle, a correct program stays in the selected cluster (Lemma 2), a differentiating input is returned whenever that cluster holds an incorrect program (Lemma 3), and so a correct program is returned (Thm. 4).
  - Assuming independent oracle answers, correct with a probability p above one half when the correct cluster is one of the two compared and one half otherwise (assumptions "common in tournaments"), Thm. 5 lower-bounds the probability that the correct cluster gets the highest score, in terms of p, the number of incorrect clusters and a real parameter from 1 to that number minus 1. The authors say "These assumptions hold in practice" (independent API calls; p measured).
  - Assuming independent answers to pairwise equivalence queries, with p and p′ as above, Thm. 6 gives the exact probability of finding a differentiating input, from the cluster's size and its number of incorrect programs; its proof also takes the programs' order in the cluster to be uniformly random (§ "Proofs").
  - At most |P| choose 2 queries of each type, |P| being the number of candidates (Thm. 7).

## Results

- **Against the selectors** (§ "Evaluation", "Baseline Comparisons"; Tab. 1, main setup): pass@1 above B4 by +13.0% on average and up to +27.1% (abstract); on APPS, 81.4 against 54.3; on MBPP with Codex candidates both score 84.4. It also beats CodeT and Original on average. By McNemar's test the authors report it significantly better than each baseline on every dataset.
- **With reasoning LLMs** (Tab. 2): above the LLM's first program by +32.8% for o1-mini, +20.4% for DeepSeek-R1 and +18.9% for Gemini 2.5 Flash, +24.0% on average (§ "Conclusion"), significant on both datasets.
- **Ablation** (§ "Evaluation", "Importance of Our Queries"; Fig. 6), HumanEval: pass@1 higher on average by +7.7% than without equivalence queries (return the tournament winner's first program) and by +24.6% than without membership queries (take the largest cluster), both significant.
- **Query counts** (§ "Evaluation", "Total Queries"; Tab. 3), HumanEval with 25 candidates: on average about as many queries in total as candidates, a small share of Thm. 7's worst case.
- **Oracle accuracy** (§ "Exact Learning by…", "Guarantees"), o1-mini on HumanEval: correct pairwise membership answers estimated at 0.87 of cases over CodeLlama's programs and 0.96 over DeepSeek-Coder's; differentiating inputs for a correct and an incorrect program with p of 0.72 and 0.61 respectively.
- **Simulations** (same place): Thm. 5's bound tightens as incorrect clusters grow in number (Fig. 4); Thm. 6's probability is high when p is at least one half and at least five programs are incorrect, "even for low p′" (Fig. 5).

## Limits the authors state

- "it targets tasks that can be implemented as stateless functions"; "It is not designed for programs that do not take any input (e.g., retrieving static configuration settings), do not generate explicit outputs (e.g., updating storage without direct feedback), or exhibit nondeterminism or nontermination", which they relate to specialized code-generation benchmarks such as DS-1000 and BigCodeBench (§ "Exact Learning by…", "Limitations").
- APPS is evaluated with Codex candidates only, "Due to the substantially larger number of coding tasks in APPS" (§ "Evaluation", "Setup").

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the code, linked from the title block ("Code", title page); the prompts of both query types (§ "LLM Prompt Examples for Pairwise Queries").
- **To reuse it:** an LLM that answers both query types, initial inputs "provided by the user or LLM-generated" (§ "Exact Learning by…", "Pseudocode"), running every candidate on them, and tasks implementable as stateless functions. Query budget: Thm. 7 and Tab. 3.

## On this site

- **Discussed in:** [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/scaling">scaling</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a></span>
