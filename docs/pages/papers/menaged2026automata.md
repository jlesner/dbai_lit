# Can Agents Infer Environment from Interaction? Evidence from Agentic Automata Learning

**Can Agents Infer Environment…** · preprint 2026 (under review at ICLR 2027, per the PDF header)

Read: [PDF](https://arxiv.org/pdf/2606.16576) · [arXiv](https://arxiv.org/abs/2606.16576)  
Code: [Agentic_Automata_Learning](https://github.com/reefmenaged/Agentic_Automata_Learning)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests whether tool-calling LLM agents can identify a hidden deterministic finite automaton (DFA) by asking an oracle membership queries (is this word accepted?) and equivalence queries (is this the target? if not, a counterexample word), within a query budget of twice what the better of the classic learners L* and TTT needs (abstract; §3; §4 "Query budget").
- Samples minimal DFAs over a binary alphabet by Boltzmann sampling, 160 instances at four sizes from 2–3 to 8–9 states (§3; §4 "Dataset construction"); runs three reasoning models under a stateless scaffold and a ReAct-style stateful one that carries a goal and a working memory (§4); splits failures into planning and reasoning failures by whether a classic passive learner can already infer the DFA from the agent's observations (§5.1), and compares the agents' query sequences with L*'s (§5).
- A procedurally generated agent task with a size dial and an exact oracle, on which the models write L* when given coding tools yet never exactly reproduce its query sequence when querying (§5): it separates knowing a procedure from executing it over a long tool loop, as [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability) asks. The authors report at most 57.5% success on 8–9-state DFAs, with the stateful scaffold (§5).

## In plain words

Agents increasingly must work out how something hidden behaves by interacting with it, such as a program they can run but not read (abstract). The authors build a test of this from a classic learning puzzle. A hidden automaton (a small machine that accepts or rejects strings of a's and b's) sits behind an oracle (the program that answers the agent's questions). The agent may ask whether one string is accepted, or propose a whole machine and get back acceptance or a string on which the two disagree (abstract, §1). They say this offers controlled difficulty, measurable efficiency and strong classic algorithms to compare against (abstract). With a budget of twice the questions the better classic algorithm needs, three reasoning models recover small machines reliably, but on the largest (8–9 states) the best success is 30.0%, rising to 57.5% when the agent must restate a goal and a working memory at every step (§1, §5). The models write the classic algorithm when given coding tools, yet never exactly reproduce its sequence of questions while playing (§5). The authors present an evaluation framework and show that identifying a solution is insufficient: reliably executing the plan is a distinct challenge (§1).

## Background and terms

**Terms to know:** [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries) · [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence) · [finite-state machine](#/glossary/finite-state-machine) · [symmetric difference](#/glossary/symmetric-difference) · [ReAct](#/glossary/react) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [passive automata learning](#/glossary/passive-automata-learning) (RPNI, EDSM and Blue-Fringe, §2, §2.2)

**The paper's own terms:**
- **agentic automata learning**: the task. An LLM agent identifies a hidden minimal DFA (deterministic finite automaton) through two tools (called by writing a JSON object in its text reply), a membership query `is_word_in_language` and an equivalence query `evaluate_dfa_candidate`; a run succeeds if the oracle accepts an equivalence query within the query budget, and its cost is the number of queries up to and including that one (§3 "Task definition"; App. A.1).
- **language, minimal DFA**: a DFA's language is the set of words (strings over the alphabet) it accepts; the minimal DFA has the fewest states for that language, and that number of states is the task's complexity (§2.1, §3).
- **L\* and TTT**: classic deterministic active-learning algorithms that, after each counterexample, ask membership queries to build a hypothesis with at least one more state; they "were proven to converge on the hidden DFA in polynomial time" (§2.1).
- **stateless and stateful scaffolds**: in the stateless one the model sees the full history and outputs only the next tool call; the "ReAct-style" stateful one also makes it write a goal, a working memory and a thought at every step (§4, Fig. 2; App. A.1).
- **query budget**: "at most twice the number of queries required by the better of L∗ and TTT" for that DFA (§4 "Query budget").
- **Success Rate** (Eq. 1) and **∆ Tool Calls from Deterministic Algorithms** (Eq. 2): the share of DFAs identified; and, over successful runs, the mean of the agent's tool calls minus the fewer of L*'s and TTT's (§4 "Models and metrics").
- **planning failure** and **reasoning failure**: a failed run from whose observations none of the three passive learners (RPNI, EDSM, Blue-Fringe) can infer the hidden DFA, or at least one can (§5.1).
- **non-informative query**: a membership query for a word already asked, or an equivalence query that repeats a hypothesis or contradicts an answer already received (§5.1).
- **Best Hypothesis Similarity**: the highest share, over a run's hypotheses, of words up to length 200 on which a hypothesis and the hidden DFA agree (App. A.3).

**Builds on:**
- Angluin's L* (Angluin, 1987; 1988) and TTT (Isberner et al., 2014): the baselines and the source of each budget (§1, §4).
- ReAct (Yao et al., 2023; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) and StateAct (Rozanov & Rei, 2025) (an LLM-agent method of self-prompting and state tracking): the stateful scaffold (§4).
- Boltzmann sampling (Bassino & Nicaud, 2007), which, for DFAs whose every state can be reached from the start, "samples uniformly from the space of accessible DFAs over a binary alphabet" (§3).
- The passive learners RPNI, EDSM and Blue-Fringe (Oncina & Garcia, 1992; Lang et al., 1998), used to split failures (§2.2, §5.1).

## Problem and setting

- **Question:** whether LLM agents "can infer a correct representation of the environment they interact with, or whether they rely on local patterns and shallow heuristics" (§1).
- **Instances:** 160 minimal DFAs over {a, b}, evenly split into levels of 2–3, 4–5, 6–7 and 8–9 states (§4 "Dataset construction"; App. A.1), non-minimal samples rejected (§3). The sampler "does not inherently restrict the alphabet size" (§3).
- **Correctness:** the hypothesis's language equals the target's, as the oracle decides (§3).
- **Budget:** twice the better classic count "guarantees that a correct solution exists within the allocated query budget"; malformed tool calls are discarded and not counted (§4 "Query budget").
- **Counterexamples:** short ones keep the classic algorithms' runs, and so the budget and cost, small, but a minimal one would leak that all shorter words agree; so the oracle picks among words of length k_min to k_min + 3 (k_min the shortest disagreement), by a seed hashed from the two DFAs, so runs repeat (§4 "Oracle counterexample selection strategy"; App. A.4).
- **Models:** DeepSeek-V4-Pro, Gemini 3.1 Pro Preview and Gemini 3.8 Flash, reasoning set to high, each under both scaffolds (§4; Tab. 3); 95% bootstrap intervals (§4).

## Approach

- **Oracle and tools** (§3; App. A.1): the agent submits a hypothesis as JSON (states, alphabet, start state, accepting states, transitions); the prompt says fewer tool calls for a correct DFA score higher and exceeding the budget scores 0.
- **Two scaffolds** (§4, Fig. 2; App. A.1.1–A.1.2): the stateless prompt forbids any text besides one tool action; the stateful prompt requires four blocks per step, the working memory being "a complete replacement for the previous working-memory summary".
- **Failure split** (§5.1): the words the agent labelled through membership queries go to RPNI, EDSM and Blue-Fringe; whether any recovers the DFA separates planning from reasoning failures.
- **Execution check** (§5): each agent's query sequence is compared with each algorithm's on the same instance, and with two properties of these algorithms' runs: equivalence queries at most the number of states, and hypothesis size growing monotonically.
- **Coding tools** (§5): the models get the OpenHands harness (an open agent platform), without Internet access, to see whether they identify and reproduce a classic algorithm.

## Results

- **Size** (§5, Fig. 3): success "generally declines" with the number of states for all models under both scaffolds. On 8–9 states the highest success rate is 57.5% under the stateful scaffold and 30.0% under the stateless one. Counting only successful runs, even the most efficient combination there, Gemini 3.1 Pro with the stateful scaffold, "uses approximately 23.5% more tool calls than TTT".
- **Scaffold** (§5, Fig. 3): the stateful scaffold "generally improves performance" and changes the ranking; DeepSeek-v4-Pro and Gemini 3.1 Pro "benefit substantially", while "the smaller Gemini 3.8 Flash model is harmed", which the authors suggest "may be" because the structured output is harder to satisfy, an interpretation they support with its invalid tool-call rate rising from 0.2% to 8.7% when state tracking is added (§5; Tab. 2).
- **Knowing against executing** (§5): with coding tools, "All examined models identify and write the code for the classic L∗ algorithm". Yet on no instance does a model exactly reproduce an algorithm's query sequence, and every model–scaffold combination breaks at least one of the two properties "in a substantial fraction of runs"; the closest, DeepSeek-v4-Pro with the stateful scaffold, satisfies both "in only 31% of runs".
- **Failures** (§5.1, Fig. 4): all models show both planning and reasoning failures, "In general" fewer under the stateful scaffold; the rate of non-informative queries increases as interactions grow longer, and the stateful scaffold reduces but does not eliminate them.
- **Cost** (§5.2): runtime and cost increase with DFA size (Fig. 9). The stateful scaffold reduces cost across models by cutting reasoning tokens per step; Gemini 3.1 Pro Preview's average cost per run falls from $10 to $3.25.
- **Budget** (§5.2, Fig. 5, stateless runs at 100% to 200% of the classic count): DeepSeek-v4-Pro improves from 3.1% to 55.6%, with gains of similar size at each step, while Gemini 3.1 Pro Preview's gains taper after 125%.
- **Context** (App. A.7, Fig. 8): no run reaches its context-window limit, so "the observed failures cannot be attributed to exceeding the available context window".

## Limits the authors state

The paper has no limitations section; its caveats:
- "Although DFAs are less complex than many real-world environments, this controlled setting makes failures in these capabilities easier to identify and analyze" (§3).
- The experiments keep the alphabet fixed (§3).
- OpenAI and Claude models are left out because evaluating their high-reasoning configurations at the same scale "would have substantially increased the total API cost" (§4 "Models and metrics").
- "Although additional instances can be generated automatically, evaluation remains expensive in runtime and monetary cost" (§4 "Dataset construction").
- A planning failure rests on an assumption: "we assume that the model did not collect sufficient information during interaction" (§5.1).
- The reasons for the scaffold effects are hedged: "One possible explanation" for the stronger models' gain, "This may be since" for Gemini 3.8 Flash's loss (§5).
- Fig. 4's query curves stop at step 100, "as only a small number of task instances continue beyond this point" (Fig. 4 caption).

## Open problems and building blocks

  - "Future work could extend the framework to nondeterministic or stochastic environments and use the framework for training agents that better interact with their environment" (§7).
  - The bottleneck they name: "reliably executing the resulting plan still poses a distinct challenge" (abstract); the results "motivate evaluations of how agents search, update beliefs, and use feedback over time" (§7).
- **Released:** "we publicly release our code as open source" (Reproducibility Statement), with a project page (footnote 1); the evaluated instances are named by their seeds (Reproducibility Statement; Tab. 3).
- **To reuse it:** API access to the models at high reasoning (Tab. 3); runs that reach up to about 16 million tokens, 20 hours and $50 each, $3000 for the whole suite (§5.2); L* and TTT on every instance to set its budget (§4); the three passive learners for the failure split (§5.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a></span>
