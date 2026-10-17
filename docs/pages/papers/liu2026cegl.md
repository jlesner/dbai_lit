# Counterexample Guided Learning in the Large using Reasoning Agents

**Counterexample Guided Learning in…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.11521) · [arXiv](https://arxiv.org/abs/2606.11521)  
Code: [CEGML](https://github.com/Lhtie/CEGML)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM learner infers a regular expression from labeled strings; a teacher builds automata for the candidate and the target, decides whether they are equivalent and, if not, returns strings on which they disagree as positive or negative counterexamples, and the loop repeats until equivalence or a round budget (abstract; §3; §4 "Teacher-Learner Iterative Framework").
- Counterexamples are sampled along paths of the difference automata and can be "clustered" into strings of character classes (§4 "Improving Effectiveness of Counterexamples"); an outer reflection loop and an inner repair loop that retries until the regex compiles and labels every counterexample so far correctly (§4 "Agentic Workflow", App. B); prompt-level regularization (§4 "Regularization"); compared with prompting on growing sets of random labeled strings and with single-inference use of counterexamples, on Simple Regex (alphabet a, b, c; textbook operators) and Extended Regex (adapted from KB13), grouped by minimal-DFA state count and star depth, with gpt-oss-120b as the main learner and Qwen3-235B and GPT-5.4 in a model comparison (§5, App. D).
- An exactly checked equivalence-query loop for a DSL with an LLM as the learner, with difficulty set on two axes and ablations of the form the counterexamples take (clustered or not, Tab. 3) and of the loop's parts (Tabs. 4, 7); the authors report that the benefit of counterexamples "becomes more significant as tasks become harder" (§5.1). No compact models are compared (gpt-oss-120b, Qwen3-235B, GPT-5.4; §5.3, App. D).

## In plain words

LLMs should improve when given feedback, but the authors say it is hard to tell when they can, because feedback is "heterogeneous, domain-specific, and difficult to control" (abstract). They propose learning a regular expression (a text pattern describing a set of strings) from strings labeled in or out as "a clean testbed for measuring this capability" (§1): a checker can compare a guess with the hidden target exactly and return strings on which they disagree. They build an LLM learner that receives these strings, optionally grouped into patterns of character classes (sets of characters such as any digit), and an agentic version that reflects on why its last guess failed and retries, within a budget, until the guess is valid and fits every string seen so far. With gpt-oss-120b on the hardest groups (the deepest nesting of repetition), they report success rising from 3.2% to 38.1% on one regex family and from 38.9% to 74.1% on the other, against prompting with random labeled strings only (abstract; §5.1, Tab. 1). They call their strategies "novel" (abstract) and present a framework plus an evaluation (§1); they claim no first.

## Background and terms

**Terms to know:** [finite-state machine](#/glossary/finite-state-machine) (its finite-automaton paragraph) · [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis) · [program synthesis](#/glossary/program-synthesis) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [self-correction](#/glossary/self-correction) · [Pareto front](#/glossary/pareto-front) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [regular expression and regular language](#/glossary/regular-expression-and-regular-language) (§3; App. C, Tab. 5) · [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence) (the minimized DFA's states as a complexity measure, §5 "Data") · [symmetric difference](#/glossary/symmetric-difference) (where counterexamples lie: positive ones in the target only, negative ones in the candidate only, §4; App. A) · [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries) (App. A)

**The paper's own terms:**
- **Teacher and learner** (§3 "Oracle-Guided Learning"): the learner proposes a candidate language; the teacher returns labeled elements "that witness the incorrectness of the proposed candidate". The paper calls this active learning, "where a learner actively solicits feedback from a teacher" (§3), and the teacher picks the feedback "based on the learner's current errors" (§4 "Teacher-Learner Iterative Framework").
- **Clustered counterexample** (§4, "Clustered Counterexamples"): in the minimal difference automaton (one accepting the strings where candidate and target disagree), characters leading from one state to the same next state form one "super-character" class such as [A-Za-z]; a clustered counterexample is a path from start to accepting state, one class per step ("S[0-9]#run" stands for S2#run, S8#run and so on), accepted "only if every string represented by it is accepted".
- **Reflection** (§4 "Agentic Workflow"): the next prompt gives back the last regex, its short reasoning trace and the new counterexamples, and asks what failed.
- **Repair loop** (§4, "Repair Loop"): retries until a candidate compiles and labels every counterexample seen so far correctly, or a retry budget runs out; it keeps the best candidate by a score of half for compiling plus half the share of counterexamples labeled correctly.
- **Regularization** (§4 "Regularization"): prompt instructions to prefer simpler regexes, capping length and star nesting (App. F); not weight regularization.
- **Standard, Single, Agentic** (§5.1): random labeled strings at growing sizes, no counterexamples; clustered counterexamples in single inference; the full framework. All three use regularization.
- **#States and StarDepth** (§5 "Data"): the number of states of the target's minimal automaton, and its maximum nesting of Kleene stars (zero-or-more repetition); the authors find StarDepth "a stronger indicator of learning difficulty than the number of states" (App. E.1).
- **Run-level success ratio** (App. D): successful runs over all runs; learning succeeds when hypothesis and target languages are equal (App. A).
- **Diff Ratio** (footnote 1, PDF p. 3): the share of strings up to a fixed length on which hypothesis and target disagree, "normalized by the strings accepted by either regex".
- **In the large:** instances that "accrue many counterexamples over many rounds" (§3).

**Missing glossary terms:** none.

**Builds on:**
- Angluin's L* (Angluin, 1987), learning regular sets from membership and equivalence queries: "this oracle setting closely matches ours" (§2).
- CEGIS (Solar-Lezama, 2013; Abate et al., 2018), adapted to a learner that "must interpret counterexamples and revise its own symbolic hypothesis" (§2).
- LLM self-refinement, e.g. Madaan et al. (2023), Shinn et al. (2023, [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) (§4 "Agentic Workflow").
- The automata library pyformlang (Romero, 2021) (§3, App. D); KB13 (Kushman and Barzilay, 2013), a regex dataset the extended regexes are adapted from (§5 "Data"); the prompt optimizer GEPA (Agrawal et al., 2026; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) for one prompt component (§5.4).

## Problem and setting

The question: "what can LLMs and Agents bring to counterexample-guided learning in the large?" (§3), split into five research questions (§5).

- **Languages:** strings over a finite alphabet, targets any regex or finite automaton can represent (§3). The teacher knows the target and samples from the symmetric difference, possible "because regular languages are closed under Boolean operations" (union, intersection and complement of regular languages are regular) (§3); equivalence "is decidable, and can be performed efficiently by existing libraries" (§4).
- **Data** (§5 "Data"; App. C): Simple Regex uses concatenation, union, Kleene star and epsilon (the empty string) over a, b, c, from randomly sampled syntax trees (App. C); Extended Regex, adapted from KB13, adds one-or-more, optional parts, counted repetition, character classes, intersection and complement over letters, digits and # (Tab. 5). The authors select three languages per combination of #States (3–9) and StarDepth (0–4 for Simple, 0–2 for Extended).
- **Setup** (App. D): gpt-oss-120b, plus Qwen3-235B and GPT-5.4 at reasoning effort medium and xhigh for RQ3; three runs per regex in the main experiments, one for RQ3–RQ5; temperature 0.0; training strings up to length 32. Standard starts with 3 random examples and scales logarithmically up to 3,000 "before reporting failure"; counterexample settings start with at most 8 examples, run at most 12 epochs (outer rounds) and add at most 250 counterexamples per round; repair budget 3.

## Approach

- **The loop** (§4 "Teacher-Learner Iterative Framework"; Fig. 2): each round the learner proposes a regex; if it is not equivalent, the counterexamples join the set in the prompt, until the target or an attempt bound.
- **Counterexamples** (§4 "Improving Effectiveness of Counterexamples"): sampled along different paths of the difference automata; because many characters induce the same transition and loops yield infinitely many counterexamples, they can be clustered.
- **Agentic workflow** (§4 "Agentic Workflow"; App. B, Algs. 1–2, PDF pp. 23–24): an outer loop accumulates feedback and adds reflection; an inner repair loop retries with "pointed feedback on the failures" and returns early when the teacher finds a candidate equivalent (Alg. 2).
- No theorems.

## Results

Learner gpt-oss-120b unless named.

- **Feedback helps, more on harder targets** (§5.1, Tab. 1, three runs per regex): at Simple depth 4 Standard reaches 3.2%, Single 23.8%, Agentic 38.1%; at Extended depth 2, 38.9%, 68.5% and 74.1%. The authors say this "suggests that counterexamples are most useful when the initial labeled examples underdetermine the target language and the model must recover more complex symbolic structure" (§5.1).
- **Cost** (§5.2, Fig. 3): Agentic beats Single at every nontrivial depth on both datasets; for most such depths Single beats Standard with fewer total tokens, and Agentic "typically achieves the highest success rate".
- **Backbones** (§5.3, Tab. 2, Simple, one run per regex): Agentic improves over Standard "for every tested model and every nontrivial StarDepth level"; At depth 4, Agentic GPT-5.4 xHigh reaches 85.7% against 38.1% for gpt-oss-120b (§5.3).
- **Prompts** (App. E.3, Tab. 6, Single with non-clustered counterexamples, no regularization or agentic steps): compared with naive prompting, specifying regex syntax and answer format raises success at depths 1–3 from 14.3%/0.0%/4.8% to 71.4%/33.3%/23.8%; the GEPA strategy gives some benefit, mainly at lower depths (§5.4).
- **Clustered counterexamples** (§5.5, Tab. 3, full workflow, one run): the authors report that they "consistently improve success rates" on both datasets, e.g. at Simple depth 2 from 47.6% to 85.7%.
- **Ablations** (§5.6, Tab. 4, Simple, one run): at depths 1–3 the full workflow reaches 100.0%/85.7%/76.2%, without the repair loop 85.7%/66.7%/66.7%, without reflection 95.2%/76.2%/76.2%, without regularization 100.0%/85.7%/71.4%; "repair loops provide the larger gain". A ten-candidate repair variant "does not outperform Single" (§5.6).
- **Sample efficiency** (App. E.2, Figs. 6–7; Fig. 1): Agentic "generally reaches higher evaluation accuracy at the same sample budget" than Standard.

## Limits the authors state

- The agentic workflow "requires more tokens due to additional reflection and repair rounds" (§5.2).
- Extended Regex reaches StarDepth 2 only, "due to limitations of the original KB13 dataset" (§5 "Data").
- "the absolute performance still varies across models" (§5.3).
- Prompting for chain of thought "does not consistently improve final success" (§5.4).
- The GEPA strategy's "gain is limited and becomes less clear on harder regexes", which "may indicate mild overfitting" (§5.4).
- "Regularization has only a small effect on final success"; without it the model "is more likely to overfit early" (§5.6).
- "broader candidate exploration alone is insufficient to improve refinement" (§5.6).
- On Extended Regex "the effect of each individual component is not strictly monotonic", and "removing regularization or reflection can sometimes achieve comparable or higher success" (App. E.4).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** The paper's text states no release; it prints its prompt templates (App. F). The arXiv listing's comment says that code, data and resources are public for research use (not printed in the PDF).
- **To reuse it:** pyformlang (App. D); a teacher that can build the difference automaton (§3). For gpt-oss-120b, 2 NVIDIA L40S GPUs, under 64GB CPU memory and 200GB disk; context window 65,536 and output limit 32,768 tokens (App. D).
- **Beyond its domain:** the authors write that "in verifiable domains, for which informative failures can be synthesized, LLM agents can use structured feedback to move beyond merely fitting examples and toward reliable iterative refinement" (§6), and that the results open "the door for robust verifier-guided methods for LLM-based program synthesis and formal reasoning" (abstract); in a concrete realization of the framework, a teacher "does not necessarily need access to the target concept" and can analyze the candidate against "test cases, constraints, or other properties it knows to be true about the target" (§3).

## On this site

- **Discussed in:** [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
