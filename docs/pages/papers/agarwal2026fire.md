# FIRE: Failure-Informed Runtime Engineering for Reliable Language-Model Agents

**FIRE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.26048) · [arXiv](https://arxiv.org/abs/2609.26048)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Runtime policies for a terminal coding agent (the Codex CLI on Terminal-Bench 2.1): short natural-language instructions or action denials that the harness applies when a trajectory reaches a state that preceded observed failures, with model weights and the user prompt unchanged (abstract; §3; §4).
- Authored by the authors from observed failures, with "expert judgement" (App. F; § Limitations), and frozen, then tested in a randomized five-arm panel against a sham that fires at the same moments with generic text, and against generic verify or reconsider prompts; also run on the full suite in three GPT-5.6 tiers (§4, Tab. 2).
- Targets delivery, not capability: the authors report that policies "chiefly convert reachable solutions into dependable delivery" (abstract). On the 14 tasks its policies cover, the mid tier with policies passes more attempts than the unassisted top tier at about half the cost, though the authors' interval includes zero (§5.5). The panel's tasks come from the population the policies were developed on (§ Limitations).

## In plain words

Terminal agents often reach a working solution, then lose it in delivery: in their runs, a server dies with the agent's shell, or a formatter run after exact edits changes protected bytes (§1). The authors write rules from such failures, with "expert judgement" (§ Limitations); at a risky moment the program around the agent adds a short instruction or blocks a command, leaving model and prompt unchanged (abstract; §3). On Terminal-Bench 2.1 (command-line tasks), with two attempts each, the share of tasks solved on both attempts rose in all three GPT-5.6 tiers, from 64.4% to 73.6% for the strongest, whose share solved at least once rose only 1.2 points (abstract; Tab. 5). In a randomized test on the 14 tasks the mid tier's rules target, real rules pass 61% of attempts, against 39% with none and 36% for a decoy interrupting at the same moments with generic text, a contrast the authors call "a large effect with a wide interval, not a settled one" (§5.1). They argue reliability "is also a systems property, not only a model property" (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk) · [pass^k (reliability over k trials)](#/glossary/passk-reliability-over-k-trials) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [self-correction](#/glossary/self-correction) · [test-time scaling](#/glossary/test-time-scaling)

**The paper's own terms:**
- **runtime policy**: an eligibility predicate (a test on the task description; in the frozen portfolio it "matches phrases in the task description"), a runtime predicate on the agent's action history, checked at prompt submission, before each tool call and at stop, an intervention, a release condition and tracked state (§3 "Policy abstraction"). The intervention either *instructs* (adds guidance and, at stop, requires another turn) or *denies* a tool call.
- **procedural loss**: a failure where there is evidence the agent can solve the task, an observable state precedes the failure, and a bounded intervention "could change the relevant state transition without supplying the solution" (§3 "Reachable versus delivered success").
- **pass@1, pass@2, pass^2**: over two attempts, mean attempt success, share of tasks passed at least once ("observed reach"), and share passed both times ("observed repeated delivery") (§3).
- **family, portfolio, frozen, routing**: one failure mechanism with its rules; a tier's set of families; source and analysis rules fixed and hashed before evaluation; which tasks a policy's eligibility test applies it to (§3; Tab. 1; App. G).
- **registered behavior**: the corrective action a family aims for, fixed in advance (Tab. 1); the **funnel** follows each attempt through risky state, policy firing, that behavior, and verifier pass (§1; Tab. 4).
- **eligible and silent tasks**: panel tasks the mid-tier portfolio applies to, and tasks it does not apply to, fixed in advance (preregistered), which measure off-target effects (§1; §4 "Four designs").
- **triggered sham, always-verify, reconsider**: control arms. The sham fires at the real rules' events with generic review text of similar length; the other two add a generic request to verify or to reconsider (§4 "Four designs").
- **Luna, Terra, Sol**: the authors' names for three GPT-5.6 provider routes, "in increasing order of success and price" (§4 "Setup").

**Missing glossary terms:**
- **paired sign-flip permutation test**: under the hypothesis of no effect, flip the sign of each task's difference between two conditions (100,000 random flips for the panel, all flips enumerated for the seven-task screens) and count how often the mean difference is as large in absolute value as observed; two-sided (§4 "Inference"; App. B).

**Builds on:**
- The two "standard" remedies (§1): self-checking ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)"); Self-Refine; more test-time computation, Snell et al., 2025, on this site as [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")) and runtime rule enforcement (NeMo Guardrails, AgentSpec, Progent: systems that program conversational rails, enforce rules or restrict tool privileges for LLM agents).
- AgentSpec (Wang et al., 2026), named the closest work: a rule language with triggers, predicates and enforcement, evaluated mainly on preventing unsafe actions (§2).
- Studies finding that intrinsic self-correction "often fails without external feedback" (Huang et al., 2024; Kamoi et al., 2024) (§1; §2).
- Terminal-Bench (Merrill et al., 2026), containerized command-line tasks with task-specific verifiers, and the pass^k of τ-bench, a benchmark of tool-agent-user interaction (Yao et al., 2025) (§2).

## Problem and setting

The question: "Does the model respond to what an in-context instruction says, or only to being interrupted?" (§1).

- Terminal-Bench 2.1 in Harbor containers (a framework for running agents in containers), English task descriptions; two of its 89 tasks are excluded because their images could not install the agent (abstract footnote).
- The Codex CLI v0.146.0 (a coding agent that runs in the terminal, per its cited title) at medium reasoning effort (§4 "Setup").
- Correct means the task's verifier passes; timeouts and agent failures count as failures; "nothing was tuned on evaluation runs" (§4 "Setup").
- Tasks are the unit of inference; the primary contrast, real policy minus sham on eligible tasks, was fixed in advance (§4 "Inference").
- Both authors are co-founders of Failproof AI, "which develops the runtime infrastructure used to implement the policies" (§ Ethical Considerations).

## Approach

- **Deriving policies (§3 "Deriving and freezing a portfolio").** Run the policy-free agent twice per task; inspect failed attempts of tasks solved once, and unsolved tasks showing "a concrete procedural omission". Exclude provider and verifier faults, missing competence, and failures with no observable intervention point; cluster by mechanism; write predicates "that name no task"; screen on positive and nearby-negative tasks; admit a family only with "a positive focused result in which it fired" (a targeted run, our reading) and an acceptable routing audit; freeze. Policies "do not supply a missing algorithm or missing domain knowledge" (§3).
- **The mid-tier portfolio (Tab. 1).** Eight families, 11 rules, preceded by 13 evaluated Terra configurations (§3). Two deny: deployment preservation and database evidence (no mutating open or repair of a database before a byte copy including its side files exists). Others instruct, e.g. service persistence (relaunch a server detached from the shell and probe it later; Fig. 2), exact replacement, a LaTeX log check, answer enumeration, and binary equivalence (at stop, measure output match and size; change method on a miss). Luna's portfolio shares five sources; Sol's has five broader families (App. F).
- **Designs (Tab. 2).** A randomized five-arm panel on Terra (14 eligible plus 16 silent tasks, 300 attempts, hashed before the first attempt); service-persistence screens on Sol and Luna (seven tasks); the complete suite in all three tiers (1,044 attempts) (§4).

## Results

- **Panel (§5.1; Fig. 1; Tab. 3).** On eligible tasks the real portfolio passes 17/28 attempts, against 11/28 baseline, 10/28 sham, 11/28 always-verify, 12/28 reconsider. Real minus sham is +25.0 points (95% CI [7.1, 46.4], p = 0.061). The sham fires on almost every eligible attempt "yet does no better than baseline"; generic arms "end at or near baseline". The real portfolio never fires on silent tasks and leaves their success unchanged, though the interaction (how much larger the gain is on eligible than on silent tasks) is "imprecise".
- **Funnel (§5.2; Tab. 4).** The risky state arises about equally in every arm, but the registered behavior appears in 22 of 24 coded real-policy attempts against 11–14 of 24 elsewhere, coded by deterministic extractors, no LLM judge. Binary equivalence fixes the procedure yet fails, as the policy "could not supply the missing reimplementation"; the behavior "is necessary but not sufficient".
- **Two-tier replication (§5.3; Tab. 9).** The service-persistence policy raises success for Sol and Luna with no task going from pass to fail; seven tasks "allow little inference".
- **Complete suite (§5.4; Tab. 5).** pass^2 rises 50.6% → 54.0% (Luna), 55.2% → 60.9% (Terra), 64.4% → 73.6% (Sol); for Sol, pass@2 rises by only 1.2 points. The authors call the tiers' direction "consistent but individually imprecise" (§1); the pass@1 intervals include zero, or start at zero for Sol (Tab. 5). Cost "depends on routing breadth": Terra's targeted portfolio barely changes it; Sol's, firing on most tasks, raises it most.
- **Mid tier against top tier (§5.5; Tab. 8).** On the 14 tasks Terra's portfolio covers, Terra with policies passes 71.4% of attempts against 64.3% for Sol without, at $7.19 against $14.48; the difference in success has 95% CI [−21.4, 35.7], p = 0.82; "this is not a claim that Terra is generally superior to Sol".

## Limits the authors state

- pass^2 "is an observed rate, not an estimate of each task's long-run reliability" (§ Limitations).
- Panel tasks come from the development population: a "content effect on this distribution, not generalization" (§ Limitations). Silent tasks are easier, so the eligible–silent comparison "mixes mechanism with headroom" (§4).
- One English benchmark, harness, model family and reasoning effort; models identified by provider route (§ Limitations).
- The randomized panel supports causal attribution; cross-date complete-suite comparisons "provide supporting evidence"; tiers do not compare identical policies; "we did not run the planned leave-one-family-out ablation" (§ Limitations).
- Behavior coding covers each family's marker, "not every way an agent could satisfy the verifier" (§ Limitations).
- "Authoring required expert judgement, and researcher hours were not logged" (§ Limitations).
- Policies "protect delivery but do not add capability" and "can add latency, disturb prompt caching, and, when broad, cancel their own gains" (§ Limitations).
- Deny rules could "restrict an agent in ways its users do not intend"; persistence raises "the stakes of an agent acting on a mistaken goal" (§ Ethical Considerations).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** policy source, configuration and run-selection records, per-attempt outcomes and analysis outputs (§ Ethical Considerations); per App. A, enough to "support recomputation of the reported aggregate results without querying the model again", code under Apache 2.0 and records under CC BY 4.0. App. H prints the full Terra policy source; Tab. 10 its hashes.
- **To reuse it:** a hook layer around Codex observing prompt-submission, pre-tool-use and stop events (App. G); the printed policies are `.mjs` files (JavaScript modules, by our reading) importing a `failproofai` hook API (App. H). Authoring is manual (§3). Costs per tier: Tab. 7.
- **Beyond its domain:** "Where failures are recognizable and repeatable, engineering the harness can recover an observed model-tier gap at substantially lower cost" (§5.5).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
