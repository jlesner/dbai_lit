# ChipMEM: Verification-Grounded Memory for EDA Agents

**ChipMEM** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.27067) · [arXiv](https://arxiv.org/abs/2609.27067)  
Code: [ChipMEM](https://github.com/aalrabah/ChipMEM)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A memory layer for LLM agents that optimize RTL hardware designs or write testbenches: skills retrieved by task similarity, plus Bayesian (Beta) estimates of tool-call success that advise on retries (abstract; §3).
- A skill is stored only after the task's output gets a PASS from "a deterministic domain evaluation harness, not an LLM judge"; for design optimization that means synthesis, functional equivalence and a positive audited improvement (§3), with Yosys for synthesis and equivalence on the two public benchmarks (§4).
- Memory gated by an equivalence check in a checkable domain, the shape a memory of verified SQL rewrites would take; the authors' transfer test is small, ten unseen tasks per category run once per setting (Tab. 2; §6), and the main runs use a proprietary agent, Cadence ChipStack 2.0 (§4), which the repo doesn't hold.

## In plain words

LLM agents that improve chip designs call design tools: synthesis (compiling a design into logic gates), simulation, and checks that a rewritten design still behaves like the original. Methods that turn such runs into reusable skills are, the authors say, "typically evaluated on the tasks that produced the experience" (abstract; §1). ChipMEM is a memory layer added to an existing agent: an LLM writes a skill (short do's and don'ts) from a run only if its result passes the tools' checks; a new task receives the skills of similar earlier tasks; and per-tool success counts advise when a retry is unlikely to work and which recovery worked before (abstract; §3). Against the same agent with memory off, it reports equivalence-passing outputs on 39 of 54 scored designs of RTLRewriter-Bench (a hardware-rewriting benchmark) against 35, same model and tools, and 20 of 20 accepted outcomes against 18 on unseen test-writing tasks, with a frozen library and one run per setting (abstract). They present a memory design plus a transfer test, and make no claim to be first.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [dense retrieval](#/glossary/dense-retrieval) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [mutation testing](#/glossary/mutation-testing) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [Wilson score interval](#/glossary/wilson-score-interval)

**Missing glossary terms** (general definitions; the paper doesn't define them):
- **RTL (register-transfer level)**: a hardware design in a description language such as Verilog, as registers and the logic between them (abstract).
- **EDA (Electronic Design Automation) tools**: software that compiles, simulates and checks chip designs (abstract).
- **Synthesis and technology mapping**: compiling RTL into gates, then into a cell library's cells, after which area, power and timing can be measured; on two benchmarks the paper uses Yosys (an open-source synthesis tool) and ABC (a logic-synthesis tool) (§4 "PPA metric scope").
- **Functional equivalence check**: a proof that a rewritten design has the original's input-output behaviour (§3).
- **PPA**: power, performance (timing) and area (§1, §4).
- **Testbench**: code that drives a design in simulation (stimulus) and checks its outputs (checker) (§4 "Tasks").
- **Beta distribution**: a distribution over an unknown success rate; Beta(1,1) is uniform, and counted successes and failures update it (§3).

**The paper's own terms:**
- **Domain evaluation harness**: the grader, "a deterministic domain evaluation harness, not an LLM judge" (§3 "Agent adapter and verification"). In the glossary's terms (ours), ChipMEM itself changes part of an [agent harness](#/glossary/agent-harness): the agent's context.
- **Audited gain**: improvement after synthesis and equivalence; failed, invalid, unproven, unchanged and non-improving outputs "receive zero gain" (§4 "Evaluation metrics").
- **Cumulative Pass@k**: the fraction of tasks solved by attempt k, "reported as a sequential curve rather than an independent sampling estimate" (§4 "Evaluation metrics").

**Builds on:**
- Agents that keep experience for reuse: Voyager (Wang et al., 2023; [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")), Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), ReasoningBank (Ouyang et al., 2025) and SkillOpt (Yang et al., 2026; [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")); "ChipMEM extends this direction" (§2).
- The closest EDA work, which the authors contrast with ChipMEM: agents that evolve skills from execution traces (Du and Pinckney, 2026; Fang et al., 2026; Wang et al., 2026) (§1, §2).

## Problem and setting

- **Question:** whether skills distilled from verified runs transfer to later tasks and unseen designs, and whether accumulated tool outcomes improve decisions during a run (§1). Naively exposing the agent to memories from dissimilar tasks, they note, "may even be counterproductive" (§1).
- **Tasks (§4 "Tasks"):** PPA optimization (rewriting RTL for better area, power or timing without changing behaviour) on RTL-OPT (Lu et al., 2026; 38 design-level tasks), RTLRewriter-Bench (Yao et al., 2024; 59 available cases, 54 short and five long), a custom set of 20 open-source designs, and ten IP blocks (design modules) of OpenTitan (an open-source security chip) at five attempts per mode; testbench generation on 40 tasks of CVDP (Pinckney et al., 2025; an RTL design and verification benchmark), 20 training and 20 held out (disjoint), split evenly between stimulus (CID012) and checker (CID013) generation.
- **Models (§4 "Implementation details"):** GPT-5.5 for RTL-OPT, RTLRewriter-Bench, the custom designs and CVDP; Qwen3.8-27B for OpenTitan. The GPT-5.5 runs use Cadence ChipStack 2.0, "a proprietary system actively used in production by leading chip-design companies" (footnote 3, §4).
- **Correctness (§3):** PPA acceptance "requires successful synthesis, functional equivalence, and a positive audited improvement"; CVDP requires hidden simulation, coverage and mutation checks to pass, with hidden tests outside the agent's workspace (§4).
- **Measured (§4 "PPA metric scope"):** mapped area on RTL-OPT and RTLRewriter-Bench (plus cell and wire counts on the latter); area, power and timing on the custom set and OpenTitan.
- **Baseline:** memory disabled, with "the same model, task, prompt, tools, and budget" (§4 "Baselines and ablations").

## Approach

- **Procedural memory (§3; Alg. 1).** The new task's artifact is embedded, and the stored skills with the most similar keys (cosine similarity above a threshold; at most two at 0.6 in the experiments, §4) go to the agent. In evolving mode, a pass verdict may add a skill that an LLM distils from the trajectory, "for the source task if none exist"; a fail or invalid verdict creates none, and frozen mode keeps the library read-only (§3). The Distillation into compact models prompt asks for DO and AVOID sections: "A failed or regressed action belongs in AVOID" (App. A.8).
- **Retry predictor (§3, Eq. 1).** It estimates a tool call's chance of success at three increasingly specific levels: command type, then the previous error class for that call type (e.g. syntax error, missing library, failed timing), then the session's count of earlier such calls (capped at three). Each level blends its own success and failure counts with the broader level's estimate, starting from Beta(1,1); a weight K (8 in the experiments) "essentially controls the weight placed on prior history", and "a lower value of K makes the model more myopic".
- Every completed tool call updates both predictors, within the session too (§3).
- **Adapter (§1, §3).** It feeds the agent task, skills and advice, records tool calls and returns the artifact to the evaluator, without modifying the agent or tools (§1, contribution 2).

## Results

Memory on against off, same agent and model.
- **RTLRewriter-Bench (Tab. 3(b); abstract):** equivalence-passing outputs on 39 of 54 scored designs against 35; on the 49-design short suite, mean area gain 8.69% against 5.66%. Equivalence counts include "unchanged outputs accepted as trivially equivalent" and exclude unproven ones (Tab. 3 caption).
- **RTL-OPT (Tab. 3(a); Fig. 3):** higher mean area gain, same equivalence-passing count; here "ChipMEM selects the best valid result per design across three result sets" (Tab. 3 caption).
- **Custom designs (Tab. 3(c); Tab. 5):** higher mean area and power gains, but cumulative synthesis completion below the baseline's at every attempt count (Tab. 5).
- **OpenTitan (Tab. 3(d); Tab. 8):** designs passing the full PPA gate (best of five attempts) rise from 1 of 10 to 4 of 10, equivalence unchanged; ChipMEM has no pass in the first two attempts, the baseline one design from the first (Tab. 8). Cost (Fig. 4; Tab. 10): mean LLM calls fall 11.2% and tool calls 15.0%, while output tokens rise 55.0% and session wall time 14.9%.
- **Ablation (Tab. 1; §5 "Memory ablation"):** on five RTL-OPT designs, strict passes are 3 (memory off), 4 (procedural only), 4 (Bayesian only) and 5 (both); the combined row "records the capability of the full system after both memories accumulated prior experience on the same design sequence".
- **CVDP transfer (Tab. 2):** with the library frozen, 20 of 20 held-out tasks pass against 18 of 20, the gain coming from checker generation. On training tasks ChipMEM is slightly lower on stimulus and higher on checkers (Tab. 4).
- **Held-out PPA designs (§5; App. A.2):** on 36 unseen designs, run once with the library still growing, most retrieved skills concern RTL optimization or the tool flow (Fig. 5; Tab. 7); many designs gave no PPA comparison (Tab. 6).
- **Software pilot (App. A.7):** on SWE-bench Pro (Deng et al., 2025; software-engineering tasks), SWE-agent (a coding agent; [SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)")) resolves more tasks with ChipMEM than without (Fig. 6; Tab. 15).

## Limits the authors state

- Retrieval is fixed (top two at 0.6), and the component and frozen-transfer studies cover five RTL-OPT designs and ten unseen CVDP tasks per category; "Future work should test broader retrieval settings, additional EDA tasks, and controlled runtime environments" (§6).
- The OpenTitan run "mined a skill after every memory-on session", failed ones included, so its results are "descriptive of this run rather than a clean evaluation of the current PASS-only learning rule" (App. A.4).
- OpenTitan efficiency: "clustered confidence intervals cross zero except for output tokens, which increase with memory" (Tab. 11).
- Retrieval counts measure "exposure to a skill, not whether it was applied or caused the resulting PPA outcome" (App. A.2.2).
- Without a matched power or timing flow for RTL-OPT and RTLRewriter-Bench, "we do not report unmeasured power or performance values" (§4).
- The held-out CVDP result comes from "a single evaluation per setting" (abstract).
- SWE-bench Pro: per-task outcomes were not preserved, "so we do not report a paired significance test" (Tab. 15).

## Open problems and building blocks

- **Open:** "Future work should isolate the contribution of individual retrieved skills to flow completion and PPA improvement through paired, skill-level ablations" (§5 "What the memory learns"); "Future work should test larger memories and broader cross-domain transfer" (§7).
- **Released:** code (footnote 2, §1).
- **To reuse it:** a deterministic evaluator for the agent's output, an embedding model, and an LLM for Distillation into compact models and recovery planning (§3); the open model and embedder ran on one NVIDIA A100 80GB GPU (§4).
- **Beyond its domain:** the SWE-bench Pro pilot "extends the evaluation to software engineering and motivates testing ChipMEM across additional domains" (§7; App. A.7).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
