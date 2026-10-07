# An In-Context Learning Agent for Formal Theorem-Proving

**COPRA** · COLM 2024

Read: [PDF](https://arxiv.org/pdf/2310.04353) · [arXiv](https://arxiv.org/abs/2310.04353)  
Code: [copra](https://github.com/trishullab/copra)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- GPT-4 proposes tactics from inside a stateful backtracking search, in Lean and Coq (abstract).
- Execution feedback, search history and lemmas retrieved from a database build each next prompt; evaluated on miniF2F and CompCert tasks (abstract).
- An in-context agent around a general-purpose, black-box LLM (GPT-4-turbo), not trained or fine-tuned on a proof framework (§1); Logos's proof agent is also a general-purpose GPT model, `gpt-5.6-sol` ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §5.1).

## In plain words

Proof assistants such as Lean and Coq check proofs written as a sequence of small steps. The authors note that state-of-the-art provers for them are fine-tuned on proof data from one specific proof assistant, while in many tasks it is now best practice to prompt a general-purpose model instead (abstract, §1). They built COPRA, an agent that asks GPT-4-turbo for one proof step at a time inside a search that can backtrack. Each step is run in the proof assistant, and the next prompt is built from the resulting error message, the steps already known to fail, and lemmas found by keyword search in a library (abstract, §3). On 244 competition-style math problems in Lean, with one attempt of at most 60 model calls at temperature zero, COPRA proves 26.63%, against 13.52% for asking GPT-4 for a whole proof from worked examples (§4). With retrieval it proves 29.09%, above the fine-tuned prover ReProver's 25.00% in the authors' own runs, which allow ReProver thousands of model calls (§4). The authors present COPRA as "the first in-context learning agent for theorem-proving" (§5).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [pass@k](#/glossary/passk) · [BM25](#/glossary/bm25) · [data contamination](#/glossary/data-contamination) · [autoformalization](#/glossary/autoformalization) · [hammer](#/glossary/hammer-automated-theorem-proving)

**The paper's own terms:**
- **proof obligation** `(g, h)`: a goal `g` (what remains to be proved) with a hypothesis `h`, the set of assumptions usable for it (§2).
- **state**: a set of obligations, or an **error state**, an obligation set paired with the proof assistant's error message; the goal state **QED** is the empty set (§2).
- **global context**: optional natural-language text describing the theorem and hints for proving it (§2).
- **informal proof**: a natural-language proof, written by the LLM from the problem's informal statement with fixed few-shot examples and added to the global context (§4 "Implementing COPRA").
- **progress check** ("at least as hard"): one state is at least as hard as another when, for every obligation of the second, the first has an obligation with the same goal and a subset of its hypotheses; a new state that is at least as hard as some state already on the search stack is rejected (§3 "Progress Checks", Fig. 3).
- **failure dictionary** `Bad`: for each state, the tactics already found "unproductive" there; they are listed in later prompts (§3).
- **prompt serialization protocol**: the routines that build the prompt (a fixed "system prompt" with rules and an output grammar, plus an "agent prompt" generated from a context-free grammar) and parse the reply into a tactic, re-asking the LLM when the reply is badly formatted (§3, Fig. 3).
- **query**: one LLM call returning a single response, which holds exactly one action (a sequence of tactics) (§4 "Metric").
- **pass@k-with-n-queries**: the number of correct proofs a prover finds with k attempts, each allowed n queries to the LLM or neural model (§4 "Metric").

**Builds on:**
- Proverbot9001, a Coq prover that is "not LLM-based": COPRA's progress check follows it (§3), and it is the Coq baseline (§4 "Baselines"). Not on this site.
- ReProver from the LeanDojo project ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)")), a retrieval-augmented model fine-tuned on proof steps from Lean's `mathlib`, the Lean baseline (§4 "Baselines").
- In-context learning agents: ReAct, Voyager and Reflexion ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"), [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) (§1).
- DSP (Draft, Sketch, and Prove), which inspired the use of informal proofs (§4 "Implementing COPRA"). Not on this site.

## Problem and setting

- **Question:** can a general-purpose LLM used only in context, with search and feedback from the proof assistant, prove formal theorems as well as provers fine-tuned on proof data (§1)?
- **Problem:** given a start state and an optional global context, find a tactic sequence that takes the start state to QED (§2, Problem 1).
- **Benchmarks** (§4 "Benchmarks"): miniF2F-test in Lean, 244 formalized math problems from the MATH problem set, high-school competitions and hand-made problems of similar difficulty; and, in Coq, 118 of the 501 theorems from the CompCert verified-compiler project on which Proverbot9001 was evaluated, chosen "Due to budgetary constraints": all 98 that Proverbot9001 proved plus a random sample.
- **Model and budget:** GPT-4-turbo (called GPT-4 throughout, §1 footnote), at temperature 0 unless otherwise specified (Tab. 1 caption); for most experiments a cap of 60 queries and 600 seconds per theorem, whichever runs out first (App. A.1.1).
- **Retrieval:** BM25 search over `mathlib`, the Lean community's math library, and over the CompCert training set for Coq, with no training (§4 "Implementing COPRA").
- **Correct** means the proof assistant accepts the proof (§2).

## Approach

- **Search** (§3, Fig. 3): a depth-first search over tactic sequences. At each state COPRA pushes the state on a stack, retrieves lemmas and definitions, then repeatedly prompts the LLM with the stack, the state's failed tactics, the retrieved text and the global context, and executes the returned tactic. Reaching QED ends the search; an error, or a new state that fails the progress check, adds the tactic to the failure dictionary; otherwise the search recurses into the new state. After a few queries at a state it backtracks. The authors say the progress check lets COPRA avoid "cyclic tactic sequences that would cause nontermination" (§3).
- **Prompts** (§3, Fig. 4; Figs. 13–14): current goals and hypotheses, steps so far, steps not to repeat, and the last step with its error message, trimmed to fit the context window.
- **Ensemble** (§4, App. A.1.1): COPRA first runs without retrieval; on problems still unsolved it restarts with retrieval, and then with informal proofs, within one shared 60-query cap and 10-minute timeout.
- The implementation is "LLM-agnostic", working as long as the model's replies parse by the output grammar (§4).

## Results

- **miniF2F, against few-shot GPT-4** (Tab. 1, §4 "COPRA vs. Few-Shot…"): COPRA 26.63% against 13.52% for few-shot GPT-4, which writes the whole proof in one reply. Giving few-shot GPT-4 at temperature 0.7 as many attempts per theorem as COPRA used queries yields 15.98%.
- **miniF2F, against fine-tuned provers** (Tab. 1, Fig. 5, §4 "Comparison with Finetuned…"): COPRA with retrieval 29.09%, and 29.92% adding informal proofs, against ReProver 25.00% (3751 queries), Llemma-7b 26.23% and Llemma-34b 25.82% (3200 queries; CodeLlama models further pretrained on math, §5). The authors say COPRA without retrieval also outperforms ReProver, and that the informal-proof run outperforms PACT (a language-model prover trained with extra self-supervised tasks, §5) and the [expert iteration](#/glossary/expert-iteration) method of Polu et al. (§4). Raising the cap to 100 queries (and the timeout to 1,200 s) gives a further gain (Tab. 1).
- **Speed** (§4, App. A.1.3, Tabs. 2–3, Fig. 6): on solved problems COPRA uses "16x fewer queries" than ReProver and finds proofs "almost 3x faster" in wall-clock time, although each GPT-4 query takes longer.
- **Ablations** (Tab. 1, §4): without backtracking COPRA proves 24.59%; the authors find "backtracking is useful when proofs are longer or more complex". COPRA with GPT-3.5 (60 queries) or with CodeLlama, a code LLM (500 queries), beats their few-shot use but stays well below COPRA with GPT-4. The authors find retrieval "helps in proving more problems" and reduces hallucinated lemma names; Fig. 7 shows a retrieval example.
- **Categories** (§4, Figs. 8–9): COPRA with retrieval and informal proofs proves more theorems than ReProver in most miniF2F categories and uses fewer steps in all; International Mathematics Olympiad (IMO) problems and induction problems are hard for both.
- **CompCert** (§4 "Coq Experiments", Fig. 16): COPRA "slightly outperforms" Proverbot9001 at equal query counts; with retrieval it proves 57 of 118 theorems within 60 queries, against 36 for few-shot GPT-4 and 10 for few-shot GPT-3.5.
- **Leakage check** (§4 "Test-Set Memorization…", App. A.1.4, Tab. 4): against the 80 proofs checked into the miniF2F repository, COPRA (with retrieval and informal proofs) "reproduces none of the" long proofs, and the authors report that, setting aside single-tactic proofs, most of its proofs differ from the repository's or have no counterpart there.

## Limits the authors state

- "we cannot be certain that COPRA does not benefit from such leakage" from GPT-4's pretraining data (App. A.1.4).
- The GPT-4 and GPT-3.5 models served by the APIs "may change over time"; running the code needs one's own OpenAI API keys (§7).
- Weaker models such as GPT-3.5 or CodeLlama "have a reduced ability to generate responses following the specified output format" (§4).
- Comparing the difficulty of arbitrary proof states "is not well-defined"; the progress check "helps us eliminate some straightforward cases" (§3).
- Retrieved lemmas "may also be misleading", and informal proofs "can potentially increase the number of steps needed in a formal proof" (App. A.1.1).
- The matched-budget few-shot comparison "is not completely fair for COPRA", since its queries see one proof step and not the original goal (App. A.1.1).
- No informal-proof runs on CompCert, whose tasks lack informal specifications (§4).
- Access to informal proofs "shifts the problem of synthesizing the formal proof towards an autoformalization problem", since the LLM is likely to have seen natural-language proofs of miniF2F problems (App. A.1.5).

## Open problems and building blocks

  - Whether the learning dynamics "would drastically change with a much larger inference budget" than 60 queries "remains to be seen" (§6).
  - Whether a GPT-4-scale model is "truly essential"; a Llama-scale model fine-tuned on model–environment interactions might do better, with such data possibly generated "synthetically using the search mechanism of COPRA" (§6).
  - Integrating hammer-prediction ideas from Thor (an Isabelle prover) with COPRA, "an interesting subject of future work" (§5).
  - Extending COPRA to more proof languages (App. A.1.1); letting COPRA write its own retrieval query (Fig. 18 caption).
- **Released:** "all the code needed to run COPRA", with its system prompts and data (§7, abstract), including a common Lean/Coq proof environment that "can also be used by any other approach" (App. A.1.1).
- **To reuse it:** an LLM whose replies follow the output grammar (GPT-4-turbo in the main runs) and OpenAI API keys (§4, §7); Lean 3 (Fig. 13) or Coq; a lemma corpus for BM25. The authors estimate about 13 seconds per GPT-4 response (App. A.1.3); prompt sizes are in Tab. 5.

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
