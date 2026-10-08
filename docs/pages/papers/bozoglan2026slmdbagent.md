# What Stops a Small Language Model From Driving a Database Agent

**What Stops a Small…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.21341) · [arXiv](https://arxiv.org/abs/2609.21341) · [DOI](https://doi.org/10.57967/hf/10485)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Drives the agent mode of LibreDB Studio, an open-source SQL client, with open-weight models served locally and one hosted control, across six task surfaces (abstract; §3; Tab. 1); the authors are contributors to the software evaluated (p. 1; § Conflict of interest).
- A server-side verifier ends each run with a verdict and refuses reports whose cited evidence does not resolve to a read or schema snapshot the run produced (§3); losses are classified from the run ledger as clock, capability (no tool invoked), verification or transport (tools used, no deliverable through) (§4.4), and five server-side changes are measured before and after (§7, Tabs. 7–8).
- Against the view that small models fail at agentic database work for lack of reasoning capacity (abstract): it reports that 75.7% of model-attributed agent-mode losses came from runs that had invoked at least one tool (abstract; §8.6), with capability the smallest class under the authors' adopted ordering but not under the alternative (Tab. 4, §5.3); the authors call the class ordering a property of this corpus (abstract).

## In plain words

Small open-weight language models are "assumed to fail at agentic database work because they lack the reasoning capacity for it" (abstract). For users who cannot send schemas and queries to a hosted service (§1), the authors drove the agent of LibreDB Studio, an open-source SQL client they contribute to, with 39 locally run models and one hosted model as a control on six kinds of read-only database task, and sorted failed runs by what each run's log shows. They report that 75.7% of failed agent runs with a known model had called at least one tool, a majority holding in 99.7% of resamples over models rather than runs (abstract): "Most failures are models that act, establish something true, and then lose it at the boundary between the model and the server" (§1). Five server-side fixes, changing no model or prompt, "moved six models by 6 to 21 cells out of 30" (abstract), which they call "field observations with known confounds, not an ablation" (§7).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [self-correction](#/glossary/self-correction) · [Wilson score interval](#/glossary/wilson-score-interval) · [sign test](#/glossary/sign-test) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [text-to-SQL](#/glossary/text-to-sql)

**The paper's own terms:**
- **surface**: one of six kinds of task, each with its own objective, tools and verifier; five run in agent mode, and planning gets no tools (§3).
- **tool contract with evidence; verdict**: every claim in a report must cite something the run produced; citations that don't resolve are refused. Each run ends `answered` or `unanswered`; a successful process exit is not a pass (§3).
- **ledger**: each run's stream of structured events, the source of analysis rather than the sweep logs; a refused call's entry never holds the model's arguments (§4.3).
- **cell, lock, sitting**: a cell is one model on one surface run five consecutive times; five consecutive passes lock it; a model's six cells must be read "in one sitting under one configuration" (§4.1).
- **loss classes**, applied in this order (§4.4): **clock** (timeout, turn limit or deadline), **capability** (no tool invoked), **verification** (a report listed and rejected), **transport** (tools used, time left, no deliverable through). Runs that both timed out and invoked no tool fit two classes; clock-first is the adopted ordering, capability-first the alternative.
- **model-attributed**: runs whose ledger records the model (Tab. 2).
- **pooled, session, row**: scorer modes that find five consecutive passes anywhere in a cell's history, within one sitting per cell, or for all six cells within one sitting (§5.4).

**Missing glossary terms:**
- **regression to the mean**: items chosen because they scored low tend to score higher when measured again, by chance alone (general definition; used in §8.6).

**Bridges to the glossary:** resampling models rather than runs (§8.6) is, in the glossary's terms, a bootstrap with the model as unit.

**Builds on:**
- **Feedback quality** (§2): Olausson et al. on self-repair ([Is Self-Repair a Silver…](#/papers/olausson2023selfrepair "Is Self-Repair a Silver Bullet for Code Generation? (2024)")); "Closest to the present work", Gumaan (2026) on why small agents repeat a call they just saw fail; also MINT, Huang et al. and CRITIC on feedback and self-correction.
- **The harness as a variable** (§2): Sigdel and Baral (two studies), AgentCheck and Xiong et al., which vary or perturb the tool interface; "That axis is not ours to claim"; they add "the setting and the provenance rather than the axis".
- **ToolFailBench** (Soni), which separates never-called from called-then-failed runs and finds the first much the larger class, single-turn with mock tools (§2 "The same separation, the opposite ordering").
- **AgentBench** (Liu et al.), an agent benchmark including a database environment, which attributes the open-versus-commercial gap to reasoning, decision making and instruction following: "the clearest statement of the position our results complicate" (§2).

## Problem and setting

- **Question:** "Which locally hosted models can actually drive that agent, and what has to change so that more of them can?", against the framing that "below some parameter count a model cannot sustain a tool-calling loop" (§1).
- **System:** LibreDB Studio's agent mode, which "plans and executes read-only database work through a fixed tool contract" (§1); the authors contribute to it (§ "Conflict of interest").
- **Models and apparatus:** 39 open-weight models served by Ollama (a local inference engine) and the hosted `gemini-3.5-flash-lite` (Tabs. 1–2), sized 1.7B to 35B where the model's name gives a size (§2); one 64 GB laptop; a "deliberately small and fixed" embedded SQLite sample database; context length unset for every figure in §5 (Tab. 1).
- **Corpus:** 8,199 runs over eleven days, 4,951 model-attributed (abstract; Tab. 2); run counts per model "allocated by operational interest rather than by design" (§8.4).
- **Correct** means the verifier's `answered` verdict (§3). Whether it checks a claim's content against the cited read: not discussed.

## Approach

- **Classify losses from the ledger** (§4.4), noting "the order is load-bearing": clock-first because nearly all runs that timed out without a tool call also emitted no text, the signature of the memory confound (§8.1); both orderings reported (Tab. 4), over agent mode only, since planning losses can only be clock or capability (§5.3).
- **Row scoring** for every per-model figure; the released scorer computes all three modes, since pooled, "the obvious implementation", overstates (§5.4).
- **Capture refused arguments** with a temporary dump, as the ledger omits them (§4.3; §6).
- **Five server-side interventions** touching no model, prompt, temperature or task (§7, Tab. 7): recognize calls written as text by their naming rather than a JSON parse, and four fixes that accept or redirect misplaced values (SQL in the wrong field, a renamed key, a lone object for a list, a sibling tool's field). Open cells were re-read with the same configuration and objectives (Tab. 8).
- **Uncertainty** (§8.6): Wilson intervals, then resampling models, "the correct unit"; a sign test on the interventions.

## Results

- **By surface** (Tab. 3): planning passes most and data analysis least; the ordering "does not track the intuitive difficulty of the question" but the number of schema-constrained objects to emit.
- **Taxonomy** (Tab. 4; §5.3), over 2,100 model-attributed agent-mode losses: transport is largest at 36.2% under both orderings; capability is smallest at 17.3% under clock-first but second at 24.3% under capability-first.
- **Resampling models** (§8.6): the tool-using majority (75.7%) holds in 99.7% of resamples and in most models with at least twenty losses; transport is largest "in 74.5% of resamples rather than in all of them", so the ordering is stated "as a property of this corpus".
- **Refusals** (Tab. 6): the report tool `compose_report` draws 69.3% of all refused calls, from bad shapes and unresolved citations.
- **Per model** (Tab. 5): 31 models with a complete reading, from several that lock all six surfaces (among them the 4B `qwen3:4b`) to one that locks none.
- **Transport shapes** (§6): complete tool calls written as reply text, none parseable as JSON (§6.1); for one model, correct values under wrong keys, resent in the same shape (§6.2); and a contract that demanded a field on one tool, forbade it on the sibling and failed the run for its absence, "The clearest defect we found" (§6.3).
- **Interventions** (Tab. 8): six models gained 6 to 21 cells; the text-channel fix alone moved four cells only within variance (§7). Because refusals naming the missing fields did not suffice, the authors read their data "as evidence against a purely informational account", in which refusals fail for lack of usable information (§9).
- **Memory confound** (§8.1): uncapped, one model held most of the machine's memory at its full context; a 3B model's planning cell failed every run uncapped and passed every run capped, which "reads in any log exactly like a model that cannot plan". Free-memory checks missed both this and swap pressure (§8.2).

## Limits the authors state

- §5's figures predate the cap, so rates are "a lower bound with unknown per-model bias"; the authors "expect the taxonomy shape to survive", though that cuts against them under the alternative ordering (§8.1).
- One machine, one schema, one agent: the orderings are properties of this tool contract (§8.3).
- Unequal sampling, "not a randomised comparison"; two model names may denote one model (§8.4).
- The run deadline stayed fixed, "a deliberate choice that costs us cells" (§8.5).
- "These are uncontrolled field observations", and "nothing here identifies a cause" (§8.6). Re-read cells were picked for scoring low, so regression to the mean predicts gains under zero true effect, except for the two rows starting at zero; the six are reported "not as an estimate of an effect size" (§8.6).
- For three intervention models, part of the gain comes from earlier figures that pooled readings from different days and settings; separating it would need re-reading prior rows, "which we have not done" (§7).
- The capture lacks run ids and order, so the authors "make no claim that the model deleted the field in response to being told to" (§6.3).
- Tab. 5 and Tab. 8 "can therefore differ by a cell or two for the same model" (Tab. 5).
- On AgentBench's attribution: "Our results do not refute that" (§9).

## Open problems and building blocks

- **Open:** "Re-reading the corpus under a fixed cap is the first item of future work" (§8.1). A contract with fewer structured artifacts per surface "should show a smaller transport class, which is a testable prediction" (§8.3). The authors would have leaderboards publish "the rejection-message text and the parser's tolerance" as benchmark artefacts (§9).
- **Released:** a dataset of run records, ledger events and refusal records, with the exporter, the scorer and a verifier that regenerates every figure; a reduced bundle accompanies the submission (§ "Data and code availability"); MIT licence (§ "Licence").
- **To reuse it:** run "the verifier before trusting a number here" (§ "Data and code availability"); the setup has a 90-second default turn limit and a 450-second run deadline (Tab. 1; §8.5). The authors advise recording refused calls' arguments, separating transport refusals from tried-and-failed runs before reporting a zero, checking the context size the serving engine loaded before trusting a timeout, and reading a model's cells in one sitting (§9 "Practical advice").
- **Beyond its domain:** the authors suggest that a benchmark fixing its rejection messages and argument parsing "is measuring the pair rather than the model" (§9).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
