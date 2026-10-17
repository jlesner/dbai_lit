# Which entries of a learned skill help

> The engine judges whole answers, but a skill holds many entries; measure each entry's effect on the engine's verdicts, per task family and size.

<p class="tags"><a class="tag" href="#/tags/promptopt">promptopt</a></p>

**Source:** added ([CORE (Contrastive Reflection)](#/papers/nasvytis2026core "CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning (2026)") §6).

## Challenge
A measured effect on engine verdicts for each entry of a skill document and each example in its library, per task family and size, kept current as entries are added. The loop keeps or prunes entries on whole-answer verdicts, so it can't tell an entry that helps from one that is never used or one that breaks other families (ours).

## What's known
- **The nearest work** attributes to parts other than skill entries, or by an LLM's judgment:
  - In LLM programs, one global score blames every module at once, and a prompted LLM judge ranks a component's outputs close to random (LLM program optimization).
  - SEPO records which training examples each prompt edit newly fixed and newly broke, and passes that record to later edits on its branch ([SEPO](#/papers/ma2026sepo "SEPO: Evidence-Grounded Prompt Optimization via Structural Editing (2026)") §3.3).
  - MIRA groups the edits of a SQL repair by dependency and reverts each group alone, keeping it only when an LLM judge accepts it ([MIRA (Memory-Item Reuse and Adaptation)](#/papers/liu2026mira "MIRA: Evidence-Verified Repair Memory for Text-to-SQL Correction (2026)") §3.2.2).
  - PCO splits a critic LLM's verdict so that each part updates only the piece it blames, and keeps a running success rate per codebook entry ([Prompt Codebooks (PCO)](#/papers/nath2026codebooks "Prompt Codebooks: Discrete Compositional Optimization for Language Model Instruction Refinement (2026)") §3.5–3.6).
  - Exemplar-Curation scores each stored trajectory by the success of the tasks it was retrieved for ([Self-Generated In-Context Examples Improve…](#/papers/sarukkai2025selfgenerated "Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks (2025)") §5.3); MEMCoder's error attributor, an LLM, judges which API caused a failure ([Learning from Execution](#/papers/li2026privatelibrary "Learning from Execution: Self-Evolving Memory for Private-Library Code Generation (2026)") §IV-D).
- CORE credits the checker's reward to every retrieved insight equally, leaving "finer-grained credit assignment among multiple insights unresolved" ([CORE (Contrastive Reflection)](#/papers/nasvytis2026core "CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning (2026)") §6).
- Open (ours): no listed work measures each entry's effect on verdicts from a sound check, per family.

## Why it matters
- **A net gain can hide entries that break whole families** (ours), and an edit that passes a gate on its own family can lower others (skill_scope_interference).
- **Pruning needs it:** a library whose entries are credited equally ([CORE (Contrastive Reflection)](#/papers/nasvytis2026core "CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning (2026)") §6) or by an LLM's blame can only be pruned blindly, and a library credited but never used reads as learning (engine_judged_skill_loop § What would answer it, Diagnostic).

**Size of the gain:** enabler, our estimate. The quantity it lifts is the one [Self-improvement that compounds](#/challenges/compounding_self_improvement) measures, held-out certified accuracy per round, here after pruning entries by measured effect against pruning by LLM blame. The reason: a loop that can't tell which entries help can only keep or drop a skill whole.

## Why it's hard
- **Entries interact:** the components of an evolved harness gave single-component gains that didn't add up to the full system's, and its authors leave "interaction-aware evolution to future work" ([Agentic Harness Engineering (AHE)](#/papers/lin2026ahe "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses (2026)") §4.4.1).
- **Per-entry tests are underpowered:** at the mask counts run, per-cell tests "cannot distinguish real heterogeneity from noise at the single-skill level" ([Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)") App. K.1).
- **Retrieval isn't use:** retrieval counts measure "exposure to a skill, not whether it was applied" ([ChipMEM](#/papers/alrabah2026chipmem "ChipMEM: Verification-Grounded Memory for EDA Agents (2026)") App. A.2.2).
- **An edit's damage shows late:** [Checking a memory across problems before it is reused](#/challenges/verified_memory) § What's known.

## Verifiable signal
Each entry's effect is the paired difference in engine verdicts on fresh gym tasks between runs with the entry present and masked, with entries masked at random so that interactions average out (ours). A pass is certified on the families whose engine verdict decides correctness.

