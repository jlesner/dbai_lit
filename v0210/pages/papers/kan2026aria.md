# Harnessing Code Agents for Automatic Software Verification

**Harnessing Code Agents for…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.06341) · [arXiv](https://arxiv.org/abs/2607.06341)  
Code: [CoqProver-Code](https://anonymous.4open.science/r/CoqProver-Code-57BB)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Hands each Coq lemma to a general code agent (e.g. Claude Code) inside a verification harness, with no fixed proof strategy (abstract).
- The authors say the harness accepts a proof only when the kernel closes it, and blocks dropped obligations and divergent tactics (abstract); the released hooks check less.
- A harness around a general agent, like Logos's; the authors report proving all 4,257 lemmas whose upstream proofs end in `Qed` in Iris's four core modules (abstract; population, §VI-A).

## In plain words

Proving software correct in a proof assistant, a tool that machine-checks every proof step, needs experts; the authors see these hand-written proofs as what keeps verified software from scaling (§I). In their account, earlier LLM provers wrap the model in a fixed procedure, such as predicting one step at a time. The authors instead give each lemma to an off-the-shelf coding agent, Claude Code running Claude Opus 4.7, inside a checking layer that runs the proof checker after each attempt, rejects skipped or deleted lemmas and returns errors for another try. Re-proving lemmas whose original proofs they removed, they report proving every targeted lemma with no failures, including all 4,257 whose original proofs end with the closing command Qed in the four core modules of Iris, a library for proving correct programs whose threads share memory. They call this, "to our knowledge", the "first empirical evidence" that a current LLM can write such proofs (§I).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) (the paper also says "interactive theorem prover (ITP)", §I) · [tactic](#/glossary/tactic).

**The paper's own terms:**
- **Code agent**: "an off-the-shelf coding tool built for everyday software engineering" (§I), here Claude Code, run unattended via `claude -p`.
- **Verification harness**: the checks around the agent that decide whether an attempt counts and send back feedback (§III-C); §VI-H adds a "soft" harness for style.
- **Hook**: a Python policy function bound to an agent event. A *pre-hook* can block a tool call (file write, shell command); a *post-hook* runs after it, or at the end of a *turn* (one round of model output and its tool calls), and can reject the attempt (§IV-A).
- **HHL** (Harness Hook Language): the authors' declarative language for writing hooks, run settings (*workspaces*) and *workflows* (§IV).
- **Sound, complete, terminating** (abstract): a proof is accepted only when the prover's kernel (its trusted checking core) closes it; no obligation (goal still to prove) is left unproved or silently dropped; no tactic runs forever. "Complete" here is not the glossary's sense.
- **Coverage**, two senses: the share of target theorems a system proves (§I, Tab. I; "full coverage", abstract), and a check inside `verify_proof` "that no target lemma was dropped or altered" (§IV-A).
- **`Qed` / `Admitted`**: Coq's endings for a finished proof and for a skipped, assumed one (§III-C, §VI-A).
- **Divergent tactic**: a proof step that neither succeeds nor fails but runs forever (§V-A, "Divergent-tactic check").
- **Retry, first-attempt success, model time**: a retry is one repair after a rejection; first-attempt success is zero retries; model time is "the wall-clock time the LLM spends reasoning and generating the proof" (§VI-A).

**Missing glossary terms:**
- **Separation logic**: a logic for program proofs whose central idea is "reasoning about disjoint regions of memory independently", which makes pointer-heavy code tractable (§II). Iris is a Coq framework built on it for concurrent programs with higher-order state (§I, §II).
- **Ghost resources**: "auxiliary, proof-only bookkeeping, invisible to the running program, that tracks how shared state is allowed to evolve" (§I).

**Builds on:**
- Rango ([Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)")), "retrieval-augmented step prediction" in Coq (§I), whose CoqStoq benchmark supplies reglang (§VI-D).
- COPRA ([COPRA](#/papers/thakur2023copra "An In-Context Learning Agent for Formal Theorem-Proving (2024)")), "an in-context LLM with backtracking" (§I, Tab. I).
- Cobblestone, which also checks every candidate with the Coq kernel and splits goals into subgoals; the authors call it "Closest to our setting" (§VIII).

## Problem and setting

- **Question:** can a general code agent with no fixed proof strategy, checked by a harness, prove every lemma of expert verification libraries (abstract, §I)?
- **Protocol:** each target lemma's proof is removed and its statement kept; the rest of the file and all imported libraries stay visible (§VI-A). The agent runs in "a sandbox with no network and no version control" (§VI-A).
- **Benchmarks** (§VI-A):
  - the Iris core: modules `algebra`, `bi`, `base_logic` and `program_logic`, "every lemma whose original, expert-written proof terminates in Qed", 113 files;
  - RustBelt's Iris-based Coq proofs that Rust library types such as `Arc`, `Mutex` and `RefCell` are safe (§VI-C);
  - reglang, a Coq library of regular-language theory and one of the twelve projects of Rango's benchmark CoqStoq (§VI-D);
  - iris-lean: three files of the unfinished Lean 4 port of Iris (`Function`, `Mra`, `UFrac`) not yet ported, checked by Lean's kernel (§VI-F).
- **Model:** Claude Opus 4.7 for all results unless stated (§VI-A).
- **What counts as proved:** acceptance by the harness (§V); reaching the cap of 30 retries without it is a failure (§VI-A).

## Approach

- **Three layers** (§III, Fig. 1): a *model layer* (any LLM), an *agent layer* that picks context and strategy, and a *harness layer* that wraps Coq, runs the policy checks and drives retries. Correctness "is decided by the Coq kernel, not the model or the agent, so no unverified proof can leave the system" (§III-C).
- **HHL by example** (§IV-A, Fig. 2): pre-hooks `check_imports` (no new `Require`/`Import`, the commands that load modules), `no_banned` (no `admit` or `Admitted`, which skip a goal or proof, and no `Axiom` that assumes the goal) and `safe_command` (blocks build and `rm` commands); turn post-hooks `iris_lint` (Iris style, placed after so the model first finds a working proof) and `verify_proof` (kernel check plus the coverage check). The prompt only names the lemma. A workflow loop retries with the previous error appended, and Aria resumes the same session across retries.
- **Compilation** (§IV-B, Tab. II): HHL compiles to Python on the Claude Code SDK, each model call one `claude -p` run.
- **Agents** (§V, Fig. 3): a driver runs an *Extractor* (finds unproved lemmas), a *Prover* (first attempt), a *Fixer* (repairs on error and goal) and a *Polish* agent (style).
- **Feedback** (§V-A): Coq checks the edited file step by step and returns the failing line, the error message and the pending goal. A per-tactic cap of 300 s turns a hang into a timeout report at the stuck step.
- **Sessions** (§V-B): retries continue one conversation; a session spans at most six consecutive lemmas of one file; Polish starts fresh.
- **Polishing** (§VI-H): Polish rewrites an accepted proof against five style criteria (conciseness, transparency, robustness, idiomatic style, reuse); Coq re-checks every rewrite.
- **Completeness** (§VIII): the authors say a sound verifier "is necessary but not sufficient": an agent that edits the file freely can drop or weaken the target lemma, so the harness must check it is "still present, unweakened, and actually proved".

## Results

- **Iris core** (§VI-B, Tab. III): the authors report all 4,257 lemmas proved with no failures, 3,373 (79.2%) on the first attempt, in roughly 380 hours of model time, over 4.7 hours for the hardest lemma. They say that apart from trivial one-line lemmas the proofs differ from the upstream ones (§VI-B).
- **RustBelt** (§VI-C, Tab. IV): all 217 lemmas across 25 files proved, 73% on the first attempt.
- **reglang** (§VI-D): all 318 lemmas proved, against "barely one in eight" for prior LLM provers such as Rango. One lemma, `nfa_ofP`, took about 5.8 hours, the longest proof in the study.
- **iris-lean** (§VI-F): all 72 Lean lemmas proved, 90.3% on the first attempt, against 75.5% on the 49 lemmas of the same three modules in Coq Iris. The authors read this as "methodological": smaller lemmas give the agent simpler obligations.
- **Models** (§VI-G, Fig. 6), on the 40 lemmas of one Iris file: Opus 4.7 and the open model Kimi K2.6 both prove all 40, with first-attempt rates of 72.5% against 55% and Kimi taking roughly seven times as long. DeepSeek V4 Pro tracked Kimi at two to three times the tokens. The authors report that on proofs beyond about fifty lines the open model often failed even after exhausting its retry budget while Opus 4.7 succeeded.
- **Agent behavior** (§VII, from logs): it often mimics the proofs of similar lemmas in scope; the authors conclude that a coarse agent-plus-verifier loop beats fixed strategies.

## Limits the authors state

- The six-lemma session window "is a rule of thumb that assumes such nearby lemmas are related" (§V-B).
- "Correctness, however, is the only hard constraint the Coq harness enforces; proof style is not"; if style criteria still fail after two polishing rounds, the proof is kept as is (§VI-H).
- The per-module breakdown omits lemmas whose file names occur in two modules (Fig. 4 caption).
- The 40 lemmas used to compare models "have short proofs, which is precisely why the open model keeps up" (§VI-G).

## Open problems and building blocks

- **Open:** "A natural next step is to apply the same agent-plus-harness recipe upstream, to generating the formal specifications that proving presupposes" (§IX).
- **Released:** "Our implementation of the agents is available in an anonymized repository" (§VI).
- **To reuse it:** an agent runtime with tool dispatch and pre/post-tool hooks (§III-B); Claude Opus 4.7 on a Claude Code subscription, which "significantly reduced cost" against the metered API (§VI); Coq or Lean. The HHL compiler currently targets only the Claude Code SDK (§IV-B).
- **Beyond its domain:** the authors say the approach "is not specific to Coq", from the Lean run (abstract, §VI-F), and that the lesson concerns "where the proof strategy should live" (§VII).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/prove-general">prove-general</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a></span>
