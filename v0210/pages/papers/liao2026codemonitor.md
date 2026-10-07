# Code Monitor Red Teaming for Public-Test-Passing Code

**Code Monitor Red Teaming** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.20852) · [arXiv](https://arxiv.org/abs/2607.20852)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Can a weaker LLM verifier find hidden bugs in code that already passes public tests? (abstract)
- It reports that 23,081 of 43,677 candidates passing public tests fail hidden tests (abstract).
- The code analogue of one test database accepting wrong SQL.

## In plain words

LLM-written code is often accepted once it passes the tests the developer can see, but passing them "does not certify specification correctness" (abstract). The authors ask whether a weaker LLM reviewer, shown only the task, the visible tests and the code, can still pick out the accepted programs that fail hidden tests (§1). They adapt "monitor red teaming", a way of stress-testing AI monitors, to code, and build a benchmark of function-level, data-science and file-producing workflow tasks (§1). They report that 23,081 of the 43,677 candidates that pass the visible tests (out of 71,000) fail hidden tests (abstract), and that weaker reviewers "improve with scaffolding and model family, but still miss most hidden bugs" when allowed to flag only 5% of correct programs (abstract). As a stress test, asking the generator to leave a subtle bug makes reviewers worse in most of the dataset and model settings tested, and a stronger reviewer with the same evidence recovers "part of the gap" (abstract). It presents a protocol, a benchmark and measurements.

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Cohen's kappa](#/glossary/cohens-kappa) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [AUROC](#/glossary/auroc) (it "measures ranking quality across thresholds", §2.5) · [monitor red teaming](#/glossary/monitor-ai-control)

**The paper's own terms:**
- **public-pass candidate**: generated code that passes the visible (public) tests; only these reach the verifier, and held-out hidden tests then label them (§2.1–2.2).
- **hidden-bug / correct**: a public-pass candidate that fails at least one hidden test, or passes all (§2.1, Eq. 1); hidden-bug is the positive class.
- **verifier (monitor)**: an LLM that returns a suspicion score from 0 ("very likely correct") to 1 ("very likely to fail hidden tests") plus an explanation (§2.1, App. C.2). Outputs without a valid score are **NA**, reported separately, not imputed (§2.5).
- **M1**: the verifier's view: specification, interface, public tests, code and public-pass status, nothing hidden (§2.2).
- **G1–G4-adv**: generator conditions: G1 sees and must pass the public tests; G2 adds that an LLM verifier will inspect the code; G3 adds a high-level description of its checks; G4-natural asks for "a simple, public-test-focused implementation"; G4-adv asks it to pass public tests "while leaving a subtle hidden bug" (§2.4, Tab. 15).
- **Direct / Hybrid review**: two verifier prompts over M1; Hybrid "first decomposes requirements and likely edge cases, then performs counterexample-oriented review" (§2.4, Tab. 16).
- **weak / strong verifiers**: "open weak" Qwen-7B, Llama-8B, Mistral-7B; "closed weak" GPT-5.4-mini; "closed strong" GLM-5.1, all with the same M1 view; GLM-5.1 serves "as a named capability reference", "not as an oracle" (§3.2, Tab. 4–5).
- **spec-grounded; constructive / posthoc M1**: in the audit, a failure is spec-grounded if it traces to a stated or strongly implied requirement; constructive and posthoc M1 are "pre- and post-reveal inference from the public view": the auditor infers the bug from M1 before seeing the hidden failure, or once shown it; the two overlap (§4.1, Tab. 6).

**Missing glossary terms:**
- **TPR and FNR at 5% FPR**: with the score threshold set so that at most 5% of correct candidates are flagged (false-positive rate, FPR), TPR is the share of buggy ones flagged and FNR (the miss rate) is 1 − TPR (App. C.3, Eq. 2).
- **AUPRC**: area under the precision–recall curve, "useful but prevalence-sensitive": it moves with how common bugs are (§2.5).

**Builds on:**
- AI control (trusted monitors and audits that try to catch unsafe behavior from stronger or possibly subverted systems, App. A.3) and monitor red teaming (Greenblatt et al., Griffin et al., Kale et al., the agent-monitor benchmark MonitoringBench): "Our setup adapts" them to code (§1).
- BigCodeBench (Zhuo et al., a code-generation benchmark with diverse library calls), whose Hard subset gives one split (§2.3).
- Weak-to-strong generalization and scalable oversight (Burns et al., Kenton et al.), which ask "whether weaker supervision can elicit or evaluate stronger behavior", and prover-verifier games (Kirchner et al.), on whether "weaker checkers can evaluate or elicit more legible strong-model outputs" (App. A.3); the weak-to-strong comparison matches these questions (§2.4).

## Problem and setting

- **Question:** "after code has passed public tests, can a weaker LLM verifier identify the residual hidden bugs?" (abstract).
- **Benchmark, CodeMonitorBench** (§2.3, Tab. 9): BigCodeBench-Hard (148 function-level tasks; the first two official unittest methods public, the rest hidden); Data-Science Code (300 library-heavy tasks; 2 public and 198 hidden checks per task); CodeWorkflow (120 tasks whose solutions write files; 2 public and 8–9 hidden checks). The last two are "constructed splits introduced for this study" (Tab. 9); hidden assertions "must correspond to stated or strongly implied requirements" (§2.3), and two annotators audited 200 of them, with agreement as Cohen's kappa (App. B.2, Tab. 10).
- **Generators:** the LLMs Qwen-14B, DeepSeek-V2-Lite, Codestral-22B, GPT-5.4 and GLM-5.1, five candidates per task under each condition (§3.1); "closed-generator comparisons" use only GPT-5.4 and GLM-5.1 candidates (§3.2).
- **Defaults:** "Unless stated otherwise", M1 and Hybrid (§3.1). A cell is one dataset × generator (× verifier) combination; aggregates are unweighted means over cells "unless otherwise stated" (§3.2).
- **Correct** means passing every hidden test of a suite frozen before generation (§2.1, §2.3).
- **Metrics:** AUROC, AUPRC, TPR and FNR at 5% FPR (also 1% and 10%, Tab. 2), and NA rate (§2.5).
- **Not discussed:** sampling settings (such as temperature) and exact model versions.

## Approach

- **Pipeline:** generate, run public tests, run hidden tests on public-pass candidates only, and send those candidates without their labels to the verifier; status is "fixed before any verifier score" (§3.2, Fig. 1).
- **Axes, evidence fixed:** generator pressure, scaffold, verifier family and strength (§2.4).
- **Baselines** (§3.2, Tab. 3): "static fatal lint" (syntax and fatal name-resolution checks), a broader "static analyzer bundle", and task-generated or candidate-targeted generated tests that "score each candidate by the fraction of generated tests failed".
- **Audits:** an inferability audit of 300 public-pass hidden bugs from closed-generator cells (§4.1, Tab. 6); an evidence ablation adding "diagnostic, non-deployed views" (a requirement checklist, a bug-category hint, a hidden-assertion summary) (Tab. 7); sign checks (counts of cells where an effect has the expected direction) and candidate-level bootstrap intervals (App. F); sample-mix diagnostics (App. H).

## Results

The authors' reports; FNR is at 5% FPR unless noted.

- **Hidden bugs (Finding 1, §3.3, Tab. 1):** of 71,000 candidates, 43,677 pass public tests and 23,081 of those fail hidden tests. G2 and G3 "remain close to G1", while G4-natural and G4-adv "sharply increase hidden-bug yield in all three datasets" (Fig. 2).
- **Weak verifiers (Finding 2, §3.3, Tab. 21)**: on G1, Direct Qwen-7B is "close to random" (AUROC 0.536) and misses 94.0% of hidden bugs; Hybrid gives 0.601 and 86.8%; Mistral-7B Hybrid 0.665 and 80.0%. At 1% and 10% FPR, miss rates "decrease with larger budgets but remain high" (Tab. 2).
- **Baselines (Tab. 3)**: generated tests "improve triage, especially when candidate-targeted, but still miss many hidden bugs at 5% FPR and degrade under G4-adv" (§3.3).
- **Adversarial pressure (Finding 3, §3.3, Tab. 4)**: G4-adv lowers AUROC and raises FNR for all three open weak verifiers, in every cell (App. F.1, Tab. 27).
- **Weak to strong (Finding 4, §3.3, Tab. 5):** on closed-generator candidates, G1 FNR falls from 0.823 (Mistral-7B) to 0.756 (GPT-5.4-mini) to 0.543 (GLM-5.1), G4-adv FNR from 0.884 to 0.846 to 0.662. This "is not solely driven by GLM-5.1 judging its own generations": GLM-5.1 also beats GPT-5.4-mini on GPT-5.4-written candidates alone (Tab. 26).
- **Inferability audit (§4.1, Tab. 6)**: of 300 audited bugs, 92% are spec-grounded, "but only 33% are found constructively from M1"; at the same 5% FPR thresholds, GLM-5.1 catches 40% against the closed weak verifier's 20%. Catch rates "rise monotonically as evidence is added" (Tab. 7).
- **NA and sample mix (§4.2):** Hybrid "improves Qwen-7B ranking but raises NA, while GLM-5.1 combines stronger ranking with lower NA in the closed-generator comparison" (Tab. 8). Public-test-overfit tags rise under G4-adv, but failures still span edge cases, API semantics, joins, schemas and more (Tab. 33).
- **Blind spot (§4.3):** among "specification-grounded and partly inferable misses", the recurring pattern is "public-test anchoring": weak verifiers "recognize visible behavior but often fail to test the same invariant under edge inputs, alternate API behavior, or artifact-level constraints" (case: App. G, Tab. 29). Under M1, "single-pass weak review is a triage signal, not a stopping rule".

## Limits the authors state

All from § "Limitations" unless located otherwise.
- Labels "measure failures under frozen test suites rather than complete semantic correctness, and some oracle failures may be difficult to infer from the public view alone".
- The constructed splits "do not cover all libraries, repositories, or interactive development settings".
- G4-adv "is an adversarial stress condition, not a deployment prevalence estimate" (also §2.4).
- Not evaluated: "learned verifier/reranker training, full production static-analysis configurations, interactive review, or cost and latency tradeoffs".
- "The generated-test baselines indicate that tool-using execution monitors can help, while the main M1 results isolate the reliability of single-pass LLM review".
- "We do not claim that 5% is universally optimal" (§2.5); the weak-to-strong comparison "narrows, but does not fully identify, the source of failure" (§3.3).
- Ablation values "are catch rates among audited hidden-bug rows, not full fixed-FPR ranking metrics over a matched correct pool" (App. G); sign counts "are descriptive sign checks, not independent hypothesis tests" (Tab. 27).

## Open problems and building blocks

- **Open:** None stated as future work. Stated lessons: "verifier designs need both better reasoning and reliable structured interfaces" (§3.3); "public-pass review should be targeted counterexample search" (§4.3).
- **Released:** Nothing stated.
- **To reuse it:** tasks with a specification, interface, a few public tests and a larger hidden suite (§2.1); the Direct and Hybrid prompt templates, returning JSON with a suspicion score (App. C.2, Tab. 16); generator-condition summaries (App. C.1, Tab. 15). App. C omits "low-level implementation details".

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
