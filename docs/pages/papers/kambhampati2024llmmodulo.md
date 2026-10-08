# Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks

**LLM-Modulo ("LLMs Can't Plan** · But Can Help Planning in LLM-Modulo Frameworks"), ICML 2024 position paper

Read: [PDF](https://arxiv.org/pdf/2402.01817) · [arXiv](https://arxiv.org/abs/2402.01817)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Argues that autoregressive LLMs cannot plan or verify plans by themselves, so cannot improve by critiquing their own output, drawing mainly on the authors' earlier studies (abstract; §2.1–2.2).
- Proposes LLM-Modulo frameworks, a generate-test-critique loop: the LLM proposes candidate plans, a bank of critics checks them, and a controller feeds critiques back until every hard critic accepts; hard critics are sound, often model-based (e.g. the VAL plan validator) but possibly simulators, and soft ones may be LLMs (§3, §3.1–3.2). Two case studies, Blocks World with VAL and the TravelPlanner benchmark, report preliminary results detailed in other papers (§4).
- The authors' claim that the framework's soundness "is inherited from the soundness of the correctness (hard) critics" (§3.1) is the case for sound external checking of LLM proposals; listed [On the Self-Verification Limitations…](#/papers/stechly2024selfverification "On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks (2024)"), from the same group, tests the self-critique half, and listed [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") (§2) and [The Illusion of Diminishing Returns](#/papers/sinha2025longhorizon "The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2026)") (§1) cite it.

## In plain words

Many papers claim that LLMs can plan (produce a sequence of actions that reaches a goal) and can fix their plans by critiquing their own output. In this position paper the authors argue that autoregressive LLMs "cannot, by themselves, do planning or self-verification" (abstract), reviewing the literature, including their own studies (§1, §2). They write to bring "some clarity" to a field "oscillating between over-optimism and over-pessimism" (§1). Their LLM-Modulo framework lets the LLM guess candidate plans while external checkers test each guess and send criticism back until every correctness checker accepts, so correctness rests on checkers that never accept a wrong plan, not on the LLM (§3, §3.1). They say the framework "is being proposed in general form here for the first time" (§5). In case studies reported in other papers, feedback from an automatic plan validator raises LLM performance on a block-stacking puzzle to 82% within 15 rounds, and preliminary results on a travel-planning benchmark show "6x of baselines" even with at most 10 rounds and weaker models such as GPT-3.5-turbo (§4).

## Background and terms

**Terms to know:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [soundness and completeness](#/glossary/soundness-and-completeness) · [self-correction](#/glossary/self-correction) · [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) · [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers)

**The paper's own terms:**
- **LLM-Modulo framework**: a Generate-Test-Critique loop in which the LLM generates candidate plans and a bank of critics critiques them (§3, Fig. 3). The name is "loosely inspired by SAT Modulo Theories" (§1).
- **Autonomous mode**: the LLM's plan is used as it comes out, with no external check (§2.1), as in "sending an unvetted plan out to execution" (§3.5).
- **Self-critique / self-verification**: the LLM checks its own candidate (§2.2); in the glossary's terms, self-correction with the model's own critique as feedback.
- **Hard and soft critics**: hard critics check correctness, which "can include causal correctness, timeline correctness, resource constraint correctness as well as unit tests"; soft (style) critics check qualities such as "style, explicability, preference conformance" and may be based on LLMs (§3.1).
- **Constructive critic**: a critic that offers "alternatives plan/subplan suggestions", for example one built on a partial planner (§3.1).
- **Reformulator**: a module that translates the candidate plan into a critic's formal representation, largely supportable by LLMs, the authors say (§3.1).
- **Backprompt (Meta) Controller**: pools the critiques and passes a processed version to the LLM as its next prompt ("back prompting"), e.g. by round-robin selection, an LLM-written summary or "prompt diversification" (§3.2).
- **Soundness and completeness of the system**: plans have "soundness guarantees because of the external sound critics"; completeness (finding a plan when one exists) rests on the LLM's candidates (§3; see Limits).
- **Approximate knowledge source**: LLMs as a source of ideas and domain knowledge, "albeit sans guarantees" (§1, §2.3).
- **VAL**: an automatic plan validator for PDDL that works off a domain model (§3.1).

**Missing glossary terms:**
- **System 1 / System 2**: fast, intuitive thinking against slow, deliberate reasoning (Kahneman, 2011); the paper calls LLMs "a giant pseudo System 1" (§1, Fig. 1).
- **Clever Hans effect**: an apparent ability that in fact comes from cues the human supplies; the authors say iterative human prompting is "notorious" for it (§3).
- **Neuro-symbolic**: combining neural models with symbolic, model-based components; the authors call LLM-Modulo a "better neuro-symbolic approach" than pipelines that only translate text for a solver (abstract; §1).

**Builds on:**
- The authors' planning studies: Valmeekam et al. (2023c), and PlanBench (Valmeekam et al., 2023b), planning problems in domains like those of the International Planning Competition (§2.1, §4).
- Their verification studies: Valmeekam et al. (2023a) on plan self-critique; Stechly et al. (2023) on graph coloring; Stechly et al. (2024a), [On the Self-Verification Limitations…](#/papers/stechly2024selfverification "On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks (2024)"), which adds the 24 puzzle, an arithmetic game (§2.2).
- Guan et al. (2023), on getting domain models from LLMs with human curation (§2.3, §3.3).
- Gundawar et al. (2024), where the travel-planning case study is reported, on the TravelPlanner benchmark of Xie et al. (2024) (§4).

## Problem and setting

- **Question:** can autoregressive LLMs plan, or verify plans, by themselves, and if not, what roles can they play in planning (§1–§3)?
- **Setting:** "planning tasks, especially as studied in the automated planning community" (§1), with PDDL as the concrete case (§5). A plan counts as correct when it is "executable without errors and goal-reaching" (§2.1), checked by planning tools.
- **Models:** the earlier studies tested GPT-4, GPT-3.5, InstructGPT-3 and GPT-3 (§2.1); Tab. 1 adds GPT-4o, GPT-4-Turbo, Claude-3-Opus, LLaMA-3 70B and Gemini Pro, one-shot and zero-shot, with natural-language prompts on 600 instances per domain (500 for Gemini Pro on Mystery BW).
- **Domains:** Blocksworld (stacking blocks to a goal arrangement); Mystery BW (Deceptive), the same domain with action and object names obfuscated (§2.1, §4); Logistics, another classical domain (§4); TravelPlanner, "a rich mix of travel constraints presented in flexible natural language form" (§4).

## Approach

- **LLMs can't plan (§2.1).** They cite their studies: poor plans in autonomous mode, fine-tuning that "does not seem to have a major effect", and worse results with obfuscated names, which "further suggests that LLMs are more likely doing approximate retrieval of plans than actual planning"; chain-of-thought and ReAct-style prompting were "largely ineffective".
- **LLMs can't verify (§2.2).** They argue that, in general, without training on "corrections data" there is no a priori reason LLM critiques would be relevant. Their graph-coloring study with GPT-4 ("a canonical NP-complete reasoning problem") reports LLMs, in direct mode, poor at solving and "no better at verifying solutions", and self-critique worse than the baseline, as it passes over correct colorings. A corollary, they argue: LLMs can't self-improve by critiquing their own plans and fine-tuning on them.
- **Why contrary claims appear (§2.3).** Many papers confuse general planning knowledge with executable plans; examining several works "suggests" to the authors that they work where subgoal interactions "can be safely ignored" or leave the reasoning to humans in the loop. Self-verification claims come from tasks with "little possibility of a verifier" (e.g. essay writing) or where simulators or operating-system calls verify. Tree of Thoughts ([Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")), a tree-search prompting method, gets its guarantees, "if any", from "the external verifier"; on the 24 puzzle the LLM's own criticisms are "often quite off the mark". The LLM agents ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) and Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) "largely ignore these interactions" (footnote 4).
- **The loop (§3, Fig. 3).** The LLM receives the specification and proposes a plan; critics test it; if "at least all the hard critics sign off", it is returned as a valid solution; otherwise feedback runs from "No, try again" to all that is wrong (§3.1). The framework's soundness, they state, "is inherited from the soundness of the correctness (hard) critics" (§3.1), and that vetted plans give "a better corpus of synthetic data" for fine-tuning (§3).
- **Design choices (§3).** The LLM works with critics rather than as a front end to solvers, so it can "guess/generate candidates to satisfy the critics" without the solvers' expressiveness and search-complexity limits; critics are "more naturally composable". Humans stay out of the inner loop.
- **Humans and LLM roles (§3.3–3.4).** Humans act "once per domain" (experts acquire the domain model with LLM help) and "once per problem" (end users refine the specification). The LLM guesses plans, reformats them, helps refine specifications and build models and critics, and can help list the critics needed "(once again with a human in the loop)".
- **Why not a planner alone (§3.5).** LLMs "may likely be good at generating plausible (but not guaranteed to be correct) plan heuristics/suggestions in many more scenarios" than a planner, and unlike traditional planners, which limit in advance how expressive a problem may be, LLM-Modulo "puts no such restrictions", like NASA mission planning, where critics are "at best able to give 'no objection' certificates".

## Results

- **Autonomous planning (§2.1).** From their earlier studies, "On average, only about 12% of the plans that the best LLM (GPT-4) generates are actually executable without errors and goal-reaching", and "the choice of LLM doesn't have much bearing on this".
- **Newer models (Tab. 1).** The best Blocksworld result is Claude-3-Opus zero-shot, 356/600 (59.3%); on Mystery BW no model passes 26/600 (4.3%, GPT-4 one-shot).
- **Blocks World with VAL (§4).** Citing §5.2 and Tab. 4 of Valmeekam et al. (2023c), back prompting from VAL raises LLM performance to 82% within 15 rounds; Logistics also improves; Mystery BW reaches "about 10%", and any plan returned "is thus guaranteed correct by its model".
- **TravelPlanner (§4, Fig. 5).** The benchmark's authors report that on GPT-3.5-Turbo the current best strategies reach "a startlingly low 0.7%". LLM-Modulo with automated critics "significantly improves the performance (6x of baselines) even with a limit of 10 back prompting cycles, and weaker models such as GPT-3.5-turbo" (preliminary). In Fig. 5 the GPT-4-Turbo final pass rate rises over 10 iterations, well above four GPT-3.5-Turbo variants. LLMs also wrote the hard and several common-sense critics, reliably reformatted plans, and listed the critics needed "with light human supervision".

## Limits the authors state

- When a combinatorial solver can solve the problem, using it "can be orders of magnitue more resource efficient" (§3.5).
- Completeness depends on the LLM generating all potentially relevant candidates (§3); on Mystery BW, LLM-Modulo "doesn't help as much" because LLMs struggle to generate plausible candidates (§4).
- A verifier "may be more complex and can involve substantial work", and a simulator must be written by someone too (§2.3).
- LLMs "cannot take on the role of hard critics with soundness guarantees", only aspects of soft critics (§3.1).
- The travel-planning results are "preliminary" (§4).

## Open problems and building blocks

- **Open:** none named as open; the authors' "million dollar question" is "how would you do robust planning if you have some doddering know-it-all ready to give you any kind of knowledge?" (§2.3). For multimodal LLMs, "it is not clear that this gives them System 2 competence" (§5).
- **Released:** Nothing stated.
- **To reuse it:** sound hard critics, e.g. VAL working off a domain model (§3.1); humans for once-per-domain and once-per-problem input (§3.3); reformulators and a backprompt controller (§3.1–3.2). Feedback was capped at 15 rounds (Blocks World) and 10 cycles (TravelPlanner) (§4).
- **Beyond its domain:** the authors believe versions of the architecture "can be of use in a wide variety of planning or reasoning tasks" (§3) and that its essence is "equally applicable" to reinforcement learning with simulators (§5).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
