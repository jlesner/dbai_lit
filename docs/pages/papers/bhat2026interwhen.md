# interwhen: A Generalizable Framework for Steering Reasoning Models with Test-time Verification

**interwhen** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.11202) · [arXiv](https://arxiv.org/abs/2602.11202)  
Code: [interwhen](https://github.com/microsoft/interwhen)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Steers a single reasoning or agent trajectory with verifiers that run alongside generation: a forked copy of the model (on τ²-bench and VitaBench, a separate Qwen2.5-3B-Instruct, §5) periodically extracts verifiable states from the partial trace, and a violation goes back to the model as feedback (§1; §4.1).
- A frontier LLM generates the verifiers from a natural-language policy, as Python code or, in a Lean variant, as a specification, a verifier and machine-checked proofs of its soundness and completeness (§1; §4.2; Fig. 3; Tab. 7). Evaluated on τ²-bench, Agent-SafetyBench and VitaBench and on puzzle, spatial-reasoning and Lean-code tasks (§5; Tab. 1), mostly with Qwen3-30B-A3B.
- A program check at intermediate steps that lifts a mid-size open model, but not certified end to end: state extraction is done by an LLM (§4.4), and the τ²-bench telecom gain in the abstract needs, beyond the policy-derived verifiers, rules "debugged from a small set of execution traces" and task-specific checks from the user prompt (§5; Tab. 3).

## In plain words

Checking only a reasoning model's final answer misses early mistakes, searching over many partial attempts multiplies cost, and most real agent tasks need custom checkers (abstract; §1). The authors build interwhen, which steers one run: at intervals a forked model call pulls the values a checker needs out of the output so far, program checkers test them while generation goes on, and a violation goes back as feedback (abstract; §4.1). A frontier LLM writes the checkers from a plain-text policy document, optionally in the proof language Lean with machine-checked proofs (§4.2). They present it as "a plug-and-play test-time verification system" (abstract). Headline: on τ²-bench's telecom tasks (tool-use tasks under a policy), the reasoning model Qwen3-30B completes 87.70% of tasks on all four tries against 32.17% for plain chain-of-thought, in solo mode (user's details given up front) and with checkers from the policy plus rules from inspected traces and task-specific checks from the user's request (abstract; Tab. 3).

## Background and terms

**Terms to know:** [test-time scaling](#/glossary/test-time-scaling) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [proof assistant](#/glossary/proof-assistant) · [formal specification](#/glossary/formal-specification) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [pass^k](#/glossary/passk-reliability-over-k-trials)

**The paper's own terms:**
- **LLM-Process-Modulo**: checking the process (steps, tool calls), not only the final output as LLM-Modulo does (§1).
- **rule, policy, compliance** (Defs. 3.2–3.4): a rule maps a partial trace to true, false or unknown (not enough information yet); a policy is a set of rules; a trace is compliant if no partial trace violates any rule.
- **state extractor** (Def. 4.1): returns the values the checkers need (e.g. tool-call arguments, a game move, a partial answer) from a partial trace; usually a prompted LLM in a forked call (§4; §4.1).
- **policy verifiers** (Def. 4.2): programs that return each rule's verdict from the extracted state, with text feedback on a violation.
- **IW variants** (§5), IW for interwhen: IW (policy) uses policy checkers; (policy + trace) adds rules "debugged from a small set of execution traces"; (policy + trace + prompt), "pol. + trc. + cmp." in Tab. 3, adds task checks from the user prompt. IW-GT-k repeats IW runs, up to k in all, while the final answer fails its check.
- **solo and dual modes** (§5; §5.1): in solo mode the agent gets the user's information up front; in dual mode it talks with an LLM-simulated user.
- **pass^4** (Tab. 3): a τ²-bench task scores 1 only if the final environment state and the write actions are right on four independent runs; also called reward. **Token %**: tokens relative to chain-of-thought, verification included (§5).
- **sound and complete**: of the translation, soundness is "verifier's output matches the corresponding rule on all inputs" and completeness "every rule is encoded in some verifier" (§4.2); in the conclusion, complete checkers "catch all violating trajectories" (§7).

**Missing glossary terms:**
- **Markov chain, stationary distribution**: a random process whose next state depends only on its current one; the stationary distribution is the long-run share of time in each state (§4.4).

**Builds on:**
- LLM-Modulo, Kambhampati et al. (2024) ([LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)")): verify the final output and retry (§1); the Generate-Test baseline (retry after a critic checks the whole answer) follows it (§5).
- Tree of Thoughts, Yao et al. (2023) ([Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")): a search baseline (§5).
- Process reward models, Lightman et al. (2024) ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")): "Complementary to our work", they "can be directly plugged in as verifiers in the interwhen framework" (§2).

## Problem and setting

The goal (§3): for each instance, a trace that is provably compliant or no answer at all; ideally also a correct one (Remark 3.5).

- **Agentic benchmarks** (§5; Tab. 1): τ²-bench telecom (114 tool-use tasks under a policy document, §5.1), Agent-SafetyBench (tool tasks to finish safely; it supplies failure modes) and VitaBench OTA (its travel-booking domain; no policy). States are tool calls and responses; on τ²-bench and VitaBench, Qwen2.5-3B-Instruct extracts them.
- **Non-agentic benchmarks** (§5; Tab. 1): Maze and SpatialMap (spatial reasoning), Game of 24 (arithmetic), ZebraLogic (logic-grid puzzles) and Verina (writing Lean 4 code or specifications), checked by Python rules, the Z3 SMT solver or the Lean 4 compiler. A forked call to the same model extracts states after every 40 blank-line separators.
- **Models** (§5): mostly Qwen3-30B-A3B-Thinking-2507; Claude Haiku 4.5, GPT-5.4 Mini and GPT-5.4 on some agentic runs (Tab. 2); Claude-Opus-4.7 writes checkers; GPT-4.1 grades τ²-bench and VitaBench.
- **Baselines** (§5): chain-of-thought and bigger models; on the non-agentic tasks also best-of-N with the same model as critic, Generate-Test (whole answer, critic feedback, up to four rounds) and Tree of Thoughts ([beam search](#/glossary/beam-search), width 2).

## Approach

- **Online steering (§4.1; Alg. 1):** step boundaries come from markers such as blank lines, "But wait" or tool calls. At each, a forked call extracts the state (tool calls are parsed directly) and the applicable checkers run asynchronously. On a failure it discards the tokens after the fork point, adds the feedback and resumes; beyond 5 retries it outputs "No solution". Write tool calls are checked before they run (§4.1).
- **Offline checker generation (§4.2):** a frontier LLM turns the policy and task description into a checker per rule and a map from states to checkers.
- **Lean variant (§4.2; Fig. 3):** the LLM writes a Lean specification, checker and equivalence proof; "The verifier function is accepted only when the equivalence proof is successful" (Fig. 3). Humans need only confirm that the specification matches the text policy and has no unsatisfiable or conflicting rules (§4.2).
- **Theory (§4.4; proofs App. A):** compliance of the trace so far is a two-state Markov chain; one verifier misses some violations and raises false alarms; feedback fixes a violation, or keeps a compliant step compliant, with given probabilities; the steered system is also Markov and starts compliant (App. A).
  - Thm. 4.3 ("Long-Horizon"): when the base model recovers from a violation on its own with nonzero probability, interwhen's long-run (stationary) chance of compliance is at least the base model's if and only if the base model's ratio of recovery rate to violation rate is at most the steered system's. When the base model never recovers, interwhen is superior "for all fixed horizons T in the stationary distribution regime".
  - Thm. 4.4 ("Finite-horizon policy soundness"): if (1) in the base model a compliant step stays compliant at least as often as a violating one recovers, (2) feedback on a true violation repairs it at least as often as the base model recovers unaided, and (3) either the verifier never flags a compliant step or feedback on such a false alarm keeps it compliant at least as often as no feedback would, then at every horizon (number of steps) of one or more, a compliant trace is at least as likely with interwhen.

## Results

- **τ²-bench telecom, Qwen3-30B (Tab. 3; §5.1):** solo-mode pass^4 rises from 32.17% (chain-of-thought) to 87.70% with IW (policy + trace + prompt) at 96.93% of the tokens; dual mode from 24.56% to 55.26%. In solo mode the policy checkers alone give 42.11%, adding trace rules 71.10%; the trace rules caught gaps in the policy (§5.1). The same checkers also raise pass^4 for Claude Haiku 4.5 and GPT-5.4 Mini (Tab. 2).
- **Agent-SafetyBench (Tab. 4):** safety rises from 48.75% to 58.34% with policy checkers and 72.31% with prompt checkers added, while helpfulness on safely completable tasks falls from 98.24% to 89.26%, which the authors attribute often to over-blocking under a vague policy (§5.1).
- **VitaBench (Tab. 2; §5.1):** gains of a few points on these "harder" tasks.
- **Non-agentic (Tab. 5; §5.2):** the authors report that IW outperforms chain-of-thought and Generate-Test, the baselines of comparable token cost, "across all datasets and models", and IW-GT-k leads its budget group; the gain "is higher for harder tasks" (§1); Tree of Thoughts "collapses on logic and verification tasks".
- **Lean (Tab. 7; §6.2):** on τ²-bench telecom (solo), generated and proved Lean checkers reach 83.77% pass^4 against 87.70% for "manually-validated" Python checkers, which the authors call "comparable".
- **Process against final-answer checks (Tab. 8; §6.3):** Generate-Test checking only the final answer with the same checkers never beats IW-GT-k, e.g. Maze 88.80% against 97.93%; process checks help "especially when the final answer verifiers are not perfect".
- **Ablations (§6.1; §6.4; §6.5):** on Maze and SpatialMap, feedback raises the probability of the right answer (Tab. 6); IW helps a non-reasoning model on ZebraLogic (Tab. 9); a 3B extractor matches GPT-5.4 on every τ²-bench metric (Tab. 10).
- **Early stopping (Tab. 11; App. B):** k-Stable Answer, which stops once the model has restated the same answer k times in a row, with k chosen per setting by a sweep, cuts tokens without losing accuracy on every one of three models and five datasets; DEER (Dynamic Early Exit in Reasoning Models) sometimes saves more (Tab. 11).

## Limits the authors state

- "While ensuring that the verifiers are sound is tractable, a limitation of our work is ensuring that the verifiers are complete, i.e., they catch all violating trajectories, especially when the policy encodes implicit rules" (§7).
- State extraction "is still model-based and can lead to erroneous verification" (§4.4); the output is sound "modulo any LLM-based variable extraction errors" (§1); extraction errors from the user query "propagate through the entire trajectory" (§6.5).
- Policies were in some cases incomplete, so "creating verifiers may be an iterative process, where the initial policy may need to be updated" (§5.1).
- With a vague policy, "our verifiers err on the side of caution, and may cause over-blocking in some cases" (§5.1).
- "Improvements for any finite T require further assumptions on false alarms" (App. A; T is the number of steps).

## Open problems and building blocks

- **Open:** None stated beyond verifier completeness (§7; under Limits).
- **Released:** code (abstract).
- **To reuse it:** a text policy and task description (§4.2); a frontier LLM to write checkers (§5); an extractor model (§5; §6.5); Lean for proved checkers (§4.2). The steering "can work even for black-box LLMs" (§2).
- **Beyond its domain:** checker generation "can help scale process supervision to any domain" (§2); the operations also serve early stopping (§6.6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
