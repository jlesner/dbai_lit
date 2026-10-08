# SWE-Proof: Can Language Models Resolve Real-World Issues with Machine-Checked Proofs?

**SWE-Proof** · preprint 2026 (v2)

Read: [PDF](https://arxiv.org/pdf/2609.21190) · [arXiv](https://arxiv.org/abs/2609.21190)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark that gives each of the 500 SWE-bench Verified issues a formal specification, a verifying reference implementation and its proof under three backends (Nagini for Python, Velvet in Lean, and pure Lean with agent-written proofs), extended to the Python instances of SWE-bench Pro (abstract; §1).
- Built by the Benchproofer pipeline: agents write the specification and summarize unchanged callees as fuzz-checked axioms, and an instance is admitted only once mechanical gates (it verifies, the pre-fix code and mutants don't) and adversarial LLM auditors who must exhibit concrete counterexamples agree (§3.2–3.3). Claude Opus 4.8 is evaluated in settings that vary what it is given (a verifier tool, the edit locations, the specification) and what a pass requires (Tab. 2), plus specification writing alone (§4.5).
- Proof-backed labels for code, and evidence on what a certificate leaves unchecked: the authors report that a counterexample audit overturns patches that pass every hidden test (§4.2; App. F.3 says the audited row "has not been run"), and that model-written specifications fail most often on faithfulness, constraining too little of the required behavior, on 42.5% of them (§4.5, Tab. 3).

## In plain words

Benchmarks such as SWE-bench (GitHub issues in Python repositories) grade patches by hidden tests, which the authors call "inherently incomplete and increasingly susceptible to memorization" (abstract). Their pipeline, Benchproofer, turns an issue with a known correct fix into a formally verified task: LLM agents write a precise statement of required behavior and summarize unchanged code the fix calls as tested assumptions; a task is admitted once automatic checks and LLM attackers fail to break it (§1; §3). Applied to the 500 issues of SWE-bench Verified, it yields SWE-Proof, extended to the larger tasks of SWE-bench Pro (abstract; §3.5). With Claude Opus 4.8, the authors report that an attacker overturns 26.8% of patches passing every hidden test (§4.2), and that a correct formal statement raises the issues resolved from 85% to 95%, while an agent writing its own gains nothing over an unaided one and only 56% of such statements pass their audit (abstract). They call SWE-Proof "to our knowledge the first benchmark to attach a verification oracle" (a checker that proves patches correct) "to real-world software engineering tasks" (§1).

## Background and terms

**Terms to know:** [formal specification](#/glossary/formal-specification) · [proof assistant](#/glossary/proof-assistant) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [test oracle](#/glossary/test-oracle) · [fuzzing](#/glossary/fuzzing) · [mutation testing](#/glossary/mutation-testing) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **backend**: Nagini, a verifier for statically typed Python, and Velvet, a small imperative language inside the Lean proof assistant, both proved by an SMT solver; or pure Lean, where an agent writes the proof and Lean's kernel checks it (§1; §2; App. D). EARS, structured English requirements with no verifier, is the non-formal control (§4.2; App. D.4). A **bundle** is one instance under one backend (App. A).
- **unchanged callee, axiom**: "a function the new code calls but does not modify" (§2), summarized by an axiom stating the properties the fix relies on, possibly less than the callee guarantees (§3.2).
- **reference and pre-fix implementations, equivalent patch**: the fix in the backend's language (must verify), the buggy code in it (must fail), and the Python diff making the same change (§2).
- **specification view**: specification and axioms without the implementation, what an agent is shown (§3.3 "Leakage gate").
- **five properties of a specification** (§4.5): *admissible* (its precondition excludes no input the corrected code legitimately handles), *sound* (a correct implementation can verify), *complete* (no buggy implementation can verify), these three from Feng et al. (2026); *sound axioms* (true of the real callee, and only about code the fix leaves alone); *faithful* (the modeled functions "cover the whole behavioral surface the issue requires").
- In the glossary's [soundness and completeness](#/glossary/soundness-and-completeness), which describe a checker, the words swap (our bridge): a specification accepting only correct implementations is glossary-sound and this paper's *complete*.
- **resolution rate**: the share of instances whose patch passes the hidden tests under the official harness (§4.1).
- **rows**: Tab. 2's settings 0–7, varying what the agent gets (a verifier tool; localization, i.e. which functions and files the fix touches; the specification view) and what a pass requires; Row 8 is specification synthesis alone (§4.5; Tab. 15).
- **counterexample audit**: an adversary must exhibit an input on which an accepted patch violates the formal ground truth; it counts only if, re-run, it fails under that patch and holds under the ground-truth patch (App. F.3).

**Missing glossary terms:** none.

**Builds on:**
- SWE-bench (Jimenez et al., 2024) and SWE-bench Verified (OpenAI, 2024), its human-validated 500-instance subset, whose task data SWE-Proof copies unchanged (§1; App. A; App. C).
- Verified code generation, where "most techniques take the formal specification as input", e.g. Verina (Ye et al., 2025; code, specification and proof generation in Lean, App. C) (§1).
- The specification criteria of Feng et al. (2026) (§4.5).
- The scaffold of SWE-agent (Yang et al., 2024), [SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") (§4.1); and, as motivation, audits finding test-passing but wrong SWE-bench patches (Aleithan et al., 2024; Zhong et al., 2025, [ImpossibleBench](#/papers/zhong2025impossiblebench "ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases (2025)")) (§1).

## Problem and setting

- **Questions** (§4): are hidden tests complete, must a specification be formal to close the gap, and does an agent gain from writing its own specification or from being handed one?
- **What "correct" means.** Claim 1 (§3.1): if an implementation in the instance's backend language verifies against the specification under its axioms, and a Python patch is equivalent to it in the repository, then the patch passes the hidden SWE-bench tests. The equivalence is "a hypothesis of the claim rather than a consequence of it" (§3.1).
- **Scope.** Python repositories, verified through models in each backend's language (§3.4). Specifications describe computed values, not names, import locations, class identity or effects visible only in process or filesystem state (App. D.5).
- **Evaluation.** One model, Claude Opus 4.8, over all 500 instances (§4.1), in one plain loop (shell, submit and, in most settings, a verify tool; App. F.2). Main-text numbers are single repetitions (App. F.4).

## Approach

**Construction (§3.2).** An agent writes the specification in a feedback loop, seeing (during construction only) the ground-truth patch, buggy code and tests, and renders the patched and buggy code into the backend's language. For each unchanged callee an agent drafts an axiom, revised until no fuzzed input violates it and the reference proof closes with it.

**Gates (§3.3; Tab. 1; App. E).** Admission checks; any counterexample sends the instance back.
- Mechanical: the reference implementation verifies; the pre-fix one doesn't; single-operator mutants of the reference must stop verifying (an 80% floor per bundle, Tab. 13); no escape hatch such as Lean's `sorry`; the ground-truth patch resolves in the official harness.
- Execution: auditors' inputs run on the real callee (one violation rejects the axiom), and the conformance gate compares an executable shadow of the reference implementation (under Velvet and Lean, an agent-written Python translation) with the patched function on at least 10^5 inputs.
- Adversarial auditors, without the ground-truth patch (App. E.1), hunt for inputs where specification and repository disagree, build wrong implementations that verify, and try to rebuild the fix from the view.

**Evaluation (§4.1; App. F).** Rows 3, 5 and 7 pass only when the patch resolves, the implementation verifies, and a majority of three auditors agree they correspond. In Row 8, and in a blind re-audit of Rows 2–3 specifications (§4.6), three tool-using auditors score the five properties; a pass needs a majority on all five (§4.5).

## Results

- **Corpus.** Every SWE-bench Verified bundle is admitted (Tab. 4), and most of the 266 SWE-bench Pro Python tasks under every backend; those failing under all backends make changes pre- and postconditions can't observe (§3.5; App. A.3).
- **Finding 1 (§4.2).** An auditor writes tests separating each test-passing patch from the ground-truth patch; the authors report 26.8% overturned, computed as Row 0 minus Row 1 (85.0 against 58.2, Tab. 2); on Row 1, see Limits. Given a specification, a resolving patch almost always also verifies on the formal backends (Rows 6–7, averaged); "EARS does not close it".
- **Finding 2 (§4.3).** Writing and verifying its own specification (Row 2) doesn't improve resolution over Row 0 under any backend; Row 3 stays close to Row 2 under every formal backend.
- **Finding 3 (§4.4).** A supplied specification (Row 6) raises resolution from 85.0% to 96.2% (Nagini), 94.0% (Velvet) and 95.2% (Lean); against Row 4 (localization alone) "most is not" localization. Row 7 against Row 3, differing only in whether the specification is given or self-written: +11.0, +8.6 and +9.0 points.
- **Finding 4 (§4.5; Tab. 3).** In specification synthesis, 46.0% (Nagini), 60.0% (Velvet) and 61.4% (Lean) of specifications pass the audit. Faithfulness fails on 42.5%, the most violated property under every backend: models "write specifications that are correct on the functions they model but cover too few of them". App. C calls this "the first measurement of the resulting faithfulness gap on real-world software issues".
- **Finding 5 (§4.6; Tab. 29).** Averaged over backends, specifications from unresolved instances fail 92.3% of the time, against 50.5% for resolved ones, widest on faithfulness and soundness.
- **Appendix.** On the Pro corpus a supplied specification no longer adds to localization, and synthesis stays the bottleneck (App. G.1). On Nagini's four repetitions, it helps most where the fix is least local, though for multi-file fixes most of its gain was localization (App. G.5).

## Limits the authors state

- "The verify-implies-resolve claim is not a proof" (Claim 1): it rests on two audited trust points, axiom soundness and the step from verified implementation to patch (§5).
- "no guarantee can be established that a specification matches informal natural language intent" (§3.4); the translated conformance shadow is one "which we treat as the weakest link in the guarantee" (§3.3).
- A few instances needed manual modeling beyond a backend's language (§5); the method applies where "a known gold patch exists and the requested change is observable as a change in computed values" (App. A.3).
- A few specification views reveal a little more than the issue, weakening the evaluation for those instances (§5; App. A.4).
- The specification audit's "verdicts are evidence rather than proof" (§5).
- On the counterexample audit, App. F.3 says of Row 1: "That cell has not been run, so the rate stands as a measurement on one backend."
- In this campaign no prover-accepted submission went through the counterexample audit, so the EARS comparison has no Nagini counterpart (App. G.5).
- The released specifications "have been revised since these runs" (App. G.3). Hosted models aren't reproducible (App. J).

## Open problems and building blocks

- **Open:** faithful specification synthesis from informal intent, "a concrete open problem" (abstract; §4.5; §6).
- **Released:** "We will release both artifacts described in this paper" (Reproducibility statement, after §6): Benchproofer (gates, scaffolds, prompts) and the corpus with each instance's artifacts and gate outcomes. App. J: MIT license, no model weights.
- **To reuse it:** a task with a known ground-truth patch "whose change an existing verifier can model" (§3.5); the source benchmarks' container images, Docker, Python 3.10+, and pinned verifiers and SMT solvers (App. J; pins in Tab. 49); "nothing in the pipeline requires a GPU" (App. J). Re-verifying all specifications takes 8.4 compute-hours; agentic checks need model access (App. J).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
