# Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents

**Grounding Agent Memory** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.11060) · [arXiv](https://arxiv.org/abs/2609.11060)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- After each task a separate curator agent writes the agent's long-term memory from the trajectory and its grade (§3.2); this paper gives that curator read-only environment tools to check, narrow or refresh a candidate memory before committing it ("propose–probe–commit", §3.3).
- Task agent, retriever and memory format are unchanged (§3.3); run in a GitHub Copilot SDK harness on CLBench (data analysis over a hidden SQLite schema that changes mid-stream) and adapted APEX management-consulting tasks (§4).
- Memory checked against the environment, on a SQL database among others, though the check is the curator's own reading of its probes, not a sound checker. The abstract measures the CLBench gain against no memory; trajectory-only memory reaches most of it, and probing adds a smaller step whose intervals overlap memory's (Tab. 1 (a), our reading; §5.3).

## In plain words

Agents that work across sessions increasingly keep a long-term memory: after each task, a separate curator LLM reads what the agent did and how it was graded, and writes short lessons for later tasks. The authors argue that one attempt is a weak basis for a lesson: such a curator "can preserve errors, overgeneralize partial evidence, or retain stale knowledge" (abstract). Their fix gives the curator read-only access to the same environment (for example the database) so it can test a lesson before saving it; the working agent, the retrieval and the memory format stay unchanged (§1, §3.3). They present it as "a deployment-compatible extension" of existing curation (abstract), not as a first.

On a data-analysis benchmark over a hidden database whose schema changes midway, run with GPT-5.4, the pass rate is 39% with no memory, 70% with ordinary memory and 73% with probing, and the working agent's dollar cost is lowest with probing (Tab. 1 (a)). On 90 consulting tasks in six document collections, every memory variant beats no memory in mean reward in every collection (Tab. 2).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [dense retrieval](#/glossary/dense-retrieval).

**The paper's own terms:**
- **task agent**: a fresh LLM session per task that solves it with the environment's tools and can only read memory (§3.1).
- **curator agent**: a separate session started after the task closes; it gets the trajectory (the task agent's request, actions, observations and answer), the grade and related records, and is the only agent that may create, update or delete records (§3.1–§3.2).
- **trajectory Distillation into compact models**: turns the raw trajectory into a compact "evidence packet" for the curator; the distiller sees no grade and has no tools (§3.2, Eq. 2, App. D.1). A summary of one run, not the glossary's model-training sense of Distillation into compact models.
- **record** and **lemma**: a record has a category, a confidence, an `applies_to` retrieval scope and a lemma, "one concise, actionable claim" (App. D.2), not a mathematical lemma.
- **propose–probe–commit**: the probing curator proposes a candidate record, makes "targeted read-only tool calls" to test it, then creates, revises, narrows, deletes or skips it (§3.3).
- **drift** (migration): an unannounced schema change partway through the task stream: renamed tables, split columns, soft deletes (§4, App. B.1).
- **pass-discounted reward** (Eq. 3, §4): 0 for a failed task, otherwise 1 minus the share of a tool-call budget used (15 SQL queries on CLBench, 100 tool calls on APEX); a task with several grading criteria passes only if all pass. "Total reward" sums it over tasks, "mean reward" averages it (App. B.3). Memory calls don't count.
- **The four systems** (§4): GHCP (No Memory), stateless; GHCP + Full ICL, which puts prior trajectories into the prompt; GHCP + Mem, trajectory-only memory; GHCP + Mem (w/ Env Probing). GHCP is GitHub Copilot, run through its SDK.

**Missing glossary terms:**
- **MCP (Model Context Protocol)**: a standard way for a server to offer tools to an agent; the paper says MCP servers "expose callable tools and file-like resources such as API responses and document contents" (App. A.2).
- **CRUD**: create, read, update, delete; here the memory tools (§3.2).
- **soft delete**: marking a row deleted (for example by a flag) instead of removing it, so queries must filter it out (§4).
- **Student-t confidence interval**: an interval for a mean estimated from few runs, using the t distribution (§4).

**Builds on:**
- **CLBench** (Asawa et al. 2026, not listed here), a continual-learning benchmark: the authors cite its finding that memory "can encode spurious generalizations and stale beliefs under environment drift" (§1), and use its database-exploration streams (§4).
- **APEX Agents** (Vidgen et al. 2026, not listed here): workplace tasks in consulting, law and finance; the paper uses the consulting subset (App. B.1).
- **Post-task curation** that the authors say works mainly from records, trajectories, grades and usage signals: Mem0, Claude Managed Agents Dreams, ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), ReasoningBank and ReMe (§1, §2).
- **Procedural memory** such as Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), ExpeL ([ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")), dynamic cheatsheets ([Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)")) and Voyager ([Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")); the authors call their contribution "orthogonal" to such changes in memory content or retrieval (§2).

## Problem and setting

- **Question:** does a post-task curator write better memory if it may check lessons against the live environment, all else fixed (§1, §3.3)?
- **Online setting** (§3.1): a stream of related tasks, each closed before the next is revealed, none revisited; weights fixed; the environment may change unannounced. Probes "cannot mutate the environment, enter the task trajectory, consume the task agent's budget, or expose future tasks or labels" (§3.3).
- **What varies:** only the curator's tools and two prompt blocks; the task agent's model, prompt and tools are the same in all memory conditions (§3.1, App. D.3).
- **Benchmarks** (§4, App. B.1): CLBench, SQL questions over a hidden SQLite database with traps such as prices in dollars versus cents; a 40-question drift schedule (migration after question 20) and a 30-question schedule without drift. Adapted APEX: 90 consulting tasks over six "worlds" of PDF, spreadsheet, Word and slide files, with code execution and MCP-style tools.
- **Models** (App. B.2): GPT-5.4 at xhigh effort for all roles in the main runs; the no-drift study uses Sonnet 4.6 (high) and Opus 4.7 (xhigh). Retrieval uses e5-base-v2, a text-embedding model.
- **Runs** (§4, App. B.2): five per configuration (three for APEX without memory); Tab. 1 (a) and Tab. 3 give 95% Student-t intervals, Tab. 1 (b) standard deviations.
- **Costs** cover the task agent only; distiller and curator usage "is tracked separately" (App. B.3).

## Approach

- **Baseline curation** (§3.2, App. D.2): the curator proposes atomic candidate records, checks each for support, transfer value, scope, actionability, current validity and redundancy, reconciles them with existing records, and commits the fewest create, update or delete calls. Its prompt warns: "A successful task does not validate every intermediate assumption."
- **The addition** (§3.3, App. D.3): the curator also gets the task's read-only tools (the database query interface on CLBench, a read-only MCP configuration on APEX; App. A.1) and two prompt blocks, one granting the tools and one telling it to verify records "whenever correctness, scope, freshness, or actionability is uncertain" and to "Probe only to evaluate a candidate memory, not to solve a future task".
- **What a probe can do** (§3.3): tell an incidental answer from a reusable relation, compare a procedure with a shorter one, test a relation on another slice, check preconditions, inspect states the trajectory never visited, or re-query after suspected drift. On CLBench probes inspect "tables, join keys, encodings, or post-migration fields".
- **Hypothesis:** "Our hypothesis is that this limited read-only interaction is an effective way to produce environment-informed memory records" (§3.3).

## Results

- **CLBench with drift, GPT-5.4** (Tab. 1 (a), §5.1). Pass rate and total reward over 40 tasks, ± 95% intervals: no memory 39 ± 4% and 8.60 ± 0.83; Full ICL 61 ± 11% and 21.39 ± 3.83; trajectory-only memory 70 ± 16% and 20.00 ± 6.52; probing 73 ± 5% and 22.60 ± 2.07. Queries per question: 8.8, 3.0, 5.6 and 4.7; task-agent cost $3.38, $2.01, $1.99 and $1.68. Full ICL uses 5.42M input tokens, against 2.13M for memory and 1.69M with probing, because "its context grows with the stream" (§5.1).
- **Over time** (Fig. 2 (a), §5.1): probing leads trajectory-only memory at the migration and after it, which the authors say "is consistent with curator-side probes refreshing schema lemmas".
- **CLBench without drift** (Tab. 1 (b), §5.1): mean-reward lift over paired no-memory runs is +0.351 (memory) and +0.421 (probing) on Sonnet 4.6, +0.252 and +0.263 on Opus 4.7.
- **APEX** (Tab. 2, §5.2): all 18 reward gains over no memory (six worlds, three systems) are positive; probing gives the best gain per task-agent dollar in five of six worlds, with trajectory-only memory "marginally better" in the sixth. The abstract reports task-agent tool calls falling by 16–75%. Full ICL "can win raw reward in individual worlds" but costs more, in one world more than no memory (§5.2).
- **Probing against memory on APEX** (§5.3): reward improves in five of six worlds, by up to +1.77 (world `2a87e5cb`), and changes by −0.04 in `941eba66`. The authors say this variation "is consistent with probing being most useful when a trajectory leaves a join, workbook location, or procedure unresolved".
- **Qualitative** (§5.3, Fig. 3): trajectory-only records can keep a rejected answer or a table name removed by migration; the probed samples state tables, join key, filters and current schema. In the matched cases (App. E.2–E.3), no memory fails, memory passes, and probing passes with fewer calls.

## Limits the authors state

- On the variation in probing's effect: "Because uncertainty intervals overlap, we treat this as a mechanism interpretation rather than a resolved subgroup effect" (§5.3).
- "These selected cases do not establish the aggregate effect" (§5.3); "The examples do not imply that every probed record is complete" (App. E.1).
- "If no safe read surface exists, the curator agent falls back to trajectory-only curation" (§3.3).
- Trajectory-only records "are not uniformly wrong: they recover useful domain mappings and warnings" (App. E.1).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated. The distiller and curator prompts are printed in App. D.
- **To reuse it:** a read-only subset of the task's tools for the curator; "no model retraining" and no change to the task agent, retriever, memory format or production write authority (abstract). The runs use the GitHub Copilot SDK and the models above (App. A.1, App. B.2).
- **Beyond its domain:** the authors claim that "Structured databases, document corpora, and enterprise applications can therefore all instantiate the environment-tool interface used by our curator agent" (App. A.2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
