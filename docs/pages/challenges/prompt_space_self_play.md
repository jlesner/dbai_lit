# Prompt-space self-play judged by an engine

> Can a proposer–solver loop with no labels, judged only by a DSL's engine, teach a compact model through what it writes into prompts (a skill document and a library of verified examples), and does it matter whether the compact model or a frontier model writes them?

<p class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/rlvr">rlvr</a></p>

## Challenge
Engine-judged [self-play](#/glossary/self-play) exists, but the listed loops with a sound check learn in weights: a code executor judges Absolute Zero ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")) and SQLite judges SQL-Zero ([SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)")) (Proposer–solver self-play). In prompt space, the closest listed works differ:
- Ctx2Skill runs prompt-only self-play that edits skill files, but an LLM with [rubrics](#/glossary/rubric) is the judge ([From Context to Skills](#/papers/si2026ctx2skill "From Context to Skills: Can Language Models Learn from Context Skillfully? (2026)") §3.3); its authors name "verifiable domains, e.g., mathematics, where execution feedback or formal verification can serve as an automatic reward signal, potentially replacing or complementing the Judge" as future work (App. B).
- Traj-Bootstrap stores an agent's own trajectories as in-context examples, where "only successful trajectories ($s = 1$) are stored in the database" ([Self-Generated In-Context Examples Improve…](#/papers/sarukkai2025selfgenerated "Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks (2025)") §5.1), growing the database "as the agent successfully completes training tasks" (§5.1), which come from each benchmark rather than from a proposer.

The challenge is the loop in between: a proposer writes DSL problems at the edge of what the solver can do, the engine judges every answer, and what passes becomes a skill document and a library of verified examples, with the weights fixed.

## Why it matters
- **It keeps the weights fixed** while keeping the one thing weight-space self-play has and prompt-space loops mostly lack: a judge that can't be talked into a wrong verdict (ours).
- **It would teach a DSL with no labels at all**, since the engine makes every verdict, so the same loop serves any language with an engine ([Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)).
- **It answers an open question either way:** evidence leans against compact models writing their own lessons (below), so a compact model that teaches itself with engine feedback, or a clear gap to a frontier teacher, is a finding (ours).

**Size of the gain:** enabler, shown in [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size): the loop is what would turn zero-shot DSL use into a skill that holds with size. Our estimate.

## Verifiable signal
Every task and answer is judged by the engine (results on the shown data and on held-out variants). The loop's effect is held-out success with the skill document and example library against without, per writer (compact or frontier), on fresh tasks the loop never saw, with a fixed thinking budget; each round's change is kept only if earlier tasks don't regress.

