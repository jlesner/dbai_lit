# The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines

**The Hallucination Snowball** · ICML 2026 FAGEN workshop

Read: [PDF](https://arxiv.org/pdf/2608.14588) · [arXiv](https://arxiv.org/abs/2608.14588)  
Code: [hallucination-snowball](https://github.com/prabhjotschugh/hallucination-snowball)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Injects wrong numbers into the first agent's output of a four-agent LangGraph pipeline (Researcher → Analyst → Writer → Reviewer) on FinanceBench questions and tracks at each stage whether a gpt-4o judge without ground truth and a numeric matcher against reference values still detect them (§3.1–3.2); a second experiment compares five LLMs as skeptics at the first stage (§3.3).
- Then compares no check, one deterministic numeric gate at the end, and the same gate at every handoff, with refuted values annotated for the next agent (§3.4), and fits a four-state Markov model of escape probabilities to the per-gate detection rates (§4).
- A check's position in a multi-agent pipeline, not only its strength: the authors' claim is that "When you verify matters more than whether you verify" (abstract), since checkable numbers turn into derived figures and prose that a later check can no longer match (§4).

## In plain words

In a chain of LLM agents, each gets only the previous agent's text, with "no provenance metadata, no confidence scores, and no access to source documents"; the authors study such chains because they have "become the dominant architecture for complex, high-stakes AI tasks" (§1). They inject 346 wrong numbers into the first agent's output in a four-agent financial-analysis pipeline of gpt-4o-mini agents and report that the wrong numbers turn into computed changes, then prose, then approved conclusions, getting harder to catch (abstract). A gpt-4o judge with no access to the true values catches 72.0% at the first stage and 50.9% at the last (Tab. 1). With gemini-2.5-flash agents, the same rule-based number check after every handoff leaves 16.2% of the wrong numbers in the final report, against 58.4% for one check at the end and 60.7% with no check (Tab. 3). They model the spread as four states with a chance of escaping each check (§4) and present the work as filling a gap: "No prior work provides a mathematical framework for hallucination transformation across sequential agents" (§2.6).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reference-free evaluation](#/glossary/reference-free-evaluation) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [McNemar's exact test](#/glossary/mcnemars-exact-test)

**The paper's own terms:**
- **Raw Fact, Derived, Narrative, Invisible** (S1 to S4): the four states, the form a hallucination takes at the Researcher, Analyst, Writer and Reviewer stages (abstract, Fig. 1).
- **Escape probability** (s_k): the chance a hallucination passes a boundary between two states; the authors take it as one minus the Experiment 3 gate's detection rate there (§4 "Measured Transition Probabilities", Tab. 5).
- **Boundary gate**: a numeric check on an agent's output before the next agent reads it, annotating refuted values (§3.4). The paper calls it "RAG verification" (abstract) but says it "is a deterministic numeric matcher (zero LLM calls) rather than a retrieval system" (§2.4).
- **Laundering**: a wrong figure turned into derived claims and approved prose (§1).
- **Survival**, in three senses: undetected by both instruments in the final output (Experiment 1, §3.2); 100% minus a model's Stage 1 detection (Tab. 2); injected value still present in the final report (Experiment 3, Tab. 3, Fig. 3).
- **Suppression-without-restoration**: the gate removes the wrong value but the next agent does not carry the annotated correction forward (§3.4).
- **McNemar tests**: the paper prints their chi-squared statistics (App. A.2–A.3). **pp**: percentage points.

**Missing glossary terms:**
- **First-order Markov process**: a model of a sequence of states in which the next step depends only on the current state (general definition; used undefined, §4).
- **Cohen's h**: an effect size for the difference between two proportions (general definition; used undefined, App. A.3).

**Builds on** (none on this site):
- Single-output hallucination detectors FActScore (Min et al., 2023), CoVe (Dhuliawala et al., 2024), VeriScore (Song et al., 2024) and SAFE (Wei et al., 2024), which check claims against a knowledge source, by self-verification or by search; the authors call the "finding a better detector" framing "fundamentally incomplete for sequential multi-agent systems" (§1, §2.1).
- Retrieval-augmented generation (Lewis et al., 2021): the gate is "inspired by this line of work but deployed at a fundamentally different layer" (§2.4).
- Multi-agent debate, Du et al. (2024) and MAD (Liang et al., 2024), whose "parallel topologies" the authors contrast with sequential chains (§2.2).
- Concurrent work (§2.5): AgentHallu (Liu et al., 2026), attributing hallucinations to agents after the fact; VERIMAP (Xu et al., 2026), per-subtask verification in workflow graphs; CaveAgent (Ran et al., 2026), which avoids lossy text handoffs.

## Problem and setting

- **Question:** how a wrong figure from the first agent loses detectability as later agents transform it, whether a stronger LLM detector removes that loss, and whether where an identical check sits matters more than having one (§1, §3.2–3.4).
- **Pipeline** (§3.1 "Pipeline"): Researcher → Analyst → Writer → Reviewer in LangGraph (a library for agent workflows). The Researcher "extracts exact figures from SEC filings" (US companies' financial reports), the Analyst computes year-over-year changes and ratios, the Writer writes a 300–500-word narrative, and the Reviewer "performs internal consistency checking only, with no access to source documents". §3.1's agents use gpt-4o-mini; Experiment 3 uses "a full gemini-2.5-flash pipeline" (§3.4).
- **Data** (§3.1 "Dataset"): 140 of FinanceBench's "150 expert-annotated financial QA pairs from real SEC filings with exact numeric ground truth", each rewritten by gpt-4o-mini into a multi-part analytical directive.
- **Injection** (§3.1 "Injection Protocol", App. B): 2–3 regex-based perturbations per question, right after Stage 1: dollar amounts and large numbers shifted by 15–40%, percentages by 3–12 pp. Every error studied is injected, not produced by the agents.
- **Detection** (§3.1 "Detection Instruments"): the gpt-4o Judge is "a forensic financial auditor with no ground truth access"; the Retrieval Checker matches numbers against FinanceBench ground truth, evidence strings and the pre-injection researcher output at 1% tolerance and, per the authors, "represents the theoretical detection ceiling". Experiment 3's gate uses 2% tolerance; its reference values are not discussed.
- **Experiment 2's models** (§3.3, Tab. 2): "Four state-of-the-art models" (Meta-Llama-3-70B-Instruct, gemini-2.5-flash, DeepSeek-V3.2, Qwen3.5-397B-A17B) plus gpt-4o, as skeptics at Stage 1.

## Approach

- **Experiment 1** (§3.2): both instruments check every stage's output; per-hallucination detection patterns are in App. A.1 (Tab. 6).
- **Experiment 2** (§3.3): five models judge Stage 1, "the best-case position"; bootstrap confidence intervals (Tab. 2), pairwise McNemar tests (App. A.2), detection by injection type (App. A.4, Tab. 8).
- **Experiment 3** (§3.4): Vanilla (no verification), End-Check (the gate after the last agent) and Ours ("identical deterministic gates after every agent handoff, with annotated corrections passed downstream"); the authors say this "isolates placement as the sole variable".
- **State-transition model** (§4): a first-order Markov process whose states are "defined by irreversible transformation"; once a raw fact is inside a derived computation, the checkable claim is "structurally destroyed". For a linear pipeline, predicted survival is the product of the boundaries' escape probabilities (§4 "Predictive Formula"), and the authors draw gate-placement prescriptions from it (§4 "Design Prescriptions"). No theorems.

## Results

- **Decay** (§3.2, Tab. 1): the gpt-4o Judge falls from 72.0% at Stage 1 to 50.9% at Stage 4; the other instruments also end lower than they start. The authors call the decay "boundary-concentrated, not uniform", largest at Researcher→Analyst and "essentially inert" at Writer→Reviewer. They report that 23.7% of hallucinations "survive completely undetected by either instrument in the final output" and conclude "The pipeline, not the hallucination itself, is what produces invisibility" (§3.2).
- **Stronger detectors** (§3.3, Tab. 2): Stage 1 detection ranges from 51.4% (Meta-Llama-3-70B-Instruct) to 87.0% (Qwen3.5-397B-A17B), and "No model approaches 100%". Dollar amounts are caught less often than percentages (App. A.4); the authors conclude "The ceiling is structural, not a model quality problem" and project lower Stage 4 detection even for the strongest model (§3.3).
- **Placement** (§3.4, Tab. 3): final-report survival is 60.7% (Vanilla), 58.4% (End-Check) and 16.2% (Ours), Cohen's h −0.911 for Ours against End-Check, confirmed by five statistical tests (App. A.3). Gate 1 alone catches nearly as much as all three gates combined (Tab. 4).
- **Quality cost** (§3.4, Tab. 3): the 1–5 internal-consistency score drops from 4.44 (End-Check) to 3.93 (Ours); the authors attribute this primarily to suppression-without-restoration (§3.4, §6), not to false positives: "the gate almost never refutes a reference-correct value".
- **Model** (§4, Tab. 5): escape probabilities of 24.6%, 48.3% and 89.3% at the three boundaries. The product formula predicts lower survival than measured; the authors attribute the gap to "gate false negatives from value reformatting", rounding and unit conversion, and state that "measured detection probabilities provide a lower bound on survival" (§4 "Predictive Formula"). They prescribe investing in the first gate first and call the last gate "economically unjustified in resource-constrained deployments" (§4 "Design Prescriptions").

## Limits the authors state

- **Domain:** finance only; "Detection rates and decay slopes may differ in domains where facts are less crisply verifiable"; the mechanism is domain-agnostic, "the specific rates are not" (§5 "Limitations").
- **Topology:** "a strictly linear 4-agent topology"; branching, parallel and cyclic pipelines "have different propagation dynamics that the current Markov formulation does not capture", and transition matrices for them "remain future work" (§5 "Limitations").
- **Error size:** "Subtle hallucinations below 5% perturbation" "are not tested and would likely produce lower gate detection rates given the 2% matching tolerance" (§5 "Limitations").
- **No structured-handoff baselines** (typed JSON fields, citation passing, provenance-preserving state), which "may independently reduce laundering"; comparing them "is a direct avenue for future work" (§5 "Limitations"; §2.5).
- **Quality metric:** it "scores internal consistency without access to ground truth", so the authors say their quality scores "systematically underestimate the true benefit of our intervention"; a joint accuracy-and-coherence metric is "a direct avenue for future work and a prerequisite for fair evaluation of any boundary-gating system" (§5 "The Quality Metric is Structurally Blind to the Intervention's Primary Benefit").
- **Correction by annotation:** "the hallucination is suppressed but the correct value is not always propagated" (§5 "Annotation-Based Correction vs. Source Grounding").
- **Matching:** some injections go unmatched even at Stage 1 because their logged scale differs from their text form, which the 2% tolerance "cannot bridge" (§3.4, footnote 3).

## Open problems and building blocks

- **Open:** source-grounded correction, "injecting the correct value explicitly into agent context", which the authors expect to "close this gap substantially" (§3.4, §5 "Annotation-Based…"). For other topologies they prescribe gates "at every merge point" and "verification before any memory write" (§5 "Generalization to Other Pipeline Topologies").
- **Released:** "Code and results available at" the authors' repository (§1, footnote).
- **To reuse it:** each gate is "fully deterministic (zero LLM calls)"; the three gates add about 0.9 seconds in their setup (§5 "Annotation-Based…"). The pipelines use LangGraph and OpenAI, Google GenAI and HuggingFace Router APIs (App. C).
- **Beyond its domain:** the authors claim "the transformation mechanism is domain-agnostic", naming medical, legal and research-automation pipelines, with escape rates needing domain-specific calibration (§1, §5 "Why This Matters Beyond Finance").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
