# From Test-Time Scaling to Reusable Memory: Measuring Crystallization in Text-to-SQL

**Measuring Crystallization in Text-to-SQL** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.07213) · [arXiv](https://arxiv.org/abs/2608.07213)  
Code: [memory-crystallization](https://github.com/ai-jiaqian/text-to-sql-memory-crystallization)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures the later value of stored, verified repair episodes: replay, cross-question retention, and held-out transfer on the same database, with the single-shot solver held fixed (abstract).
- Varies one memory choice at a time: episode source, verification, card format, retrieval (abstract; §3).
- Checked memory measured on SQL: it reports +4.34 points held-out first-attempt accuracy on BIRD from storing verified corrected queries (abstract). "Verified" is a gold-result oracle (strict BIRD EX against the gold query, §3.5; `repair.py:40`), not a check available at deployment.

## In plain words

A text-to-SQL system can fix a wrong first query by spending extra compute on a repair loop, but that work is normally thrown away once the answer is delivered. Systems that keep repaired examples as memory report gains, but the authors argue one score "cannot distinguish replay on recurring questions from help on unseen questions, or identify the responsible memory choice" (abstract). They frame measuring this "future value" as a measurement problem: the answering model stays fixed and one memory choice changes at a time (how examples are collected, checked, written and retrieved) (abstract; §1). On the BIRD benchmark with the open-weight model Qwen3.5-27B, storing checked, corrected queries word for word raises first-try accuracy on new questions over the same databases by 4.34 percentage points over no memory, averaged over three data splits; they report this as 44.4% of what an on-demand repair loop gains on those questions (abstract; §5.1). They present the work as a measurement problem and a controlled evaluation of "mechanisms rather than whole systems" (§1; §2).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [schema linking](#/glossary/schema-linking) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [equivalence test (TOST)](#/glossary/equivalence-test-tost) · [McNemar's exact test](#/glossary/mcnemars-exact-test)

**The paper's own terms:**
- **test-time episode**: question, first attempt, accepted candidate and interaction trace (§3.1).
- **card, writers W0–W5**: a card is the stored form of an episode: W0 Verbatim (question and corrected query), W1 Trace (whole repair trajectory), W2 Diff (syntax-tree diff of the edit), W3 Diff+Mode (plus a failure-mode label), W3+A Anchor (W3 plus the corrected query), W4 Diff+Guard (W3 plus a fixed-template condition for when it applies), W5 Capsule (an LLM-written summary) (§3.2; §4 "Card formats"). The writer never sees the gold query (§3.2).
- **sources T1–T4**: ways to produce an episode, within three attempts, for a collection question (one of the 70% that build memory) the solver got wrong: T1 resamples with no feedback; T2 retries on one correct/not-correct bit; T3 (main) runs read-only probe queries on the database between attempts; T4 takes the majority answer of five samples (§3.1; §4 "Episode sources").
- **verification regimes**: "benchmark verification" (an oracle gives per-attempt correctness bits from the gold result), a deployment check such as user confirmation, and "ungated self-vote storage", which stores the vote winner unchecked (§3.5).
- **replay, retention, transfer**: exact-query replay re-answers a collection question with its own card retrievable; cross-question retention does so with its own card removed; transfer is first-attempt accuracy on held-out questions of the same databases (§3.3).
- **P0, PM, PK and the crystallization ratio (CR)**: held-out accuracy without memory, with memory, and after an oracle-triggered repair pass whose episodes are never stored; CR = (PM − P0)/(PK − P0) (§3.4, Eq. 3), "descriptive, not a probability".
- **two-stage hierarchical bootstrap**: resamples the 11 databases, then questions within each, keeping a question's seed results together (§4 "Statistical protocol").

**Missing glossary terms:** none needed.

**Builds on:**
- **Self-evolving text-to-SQL systems** that keep corrected queries, self-correction guidelines (MAGIC), agent memories or distilled domain knowledge (ORANGE), or run evolution loops ([RoboPhD](#/papers/borthwick2026robophd "RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution (2026)")): they "directly motivate our study" (§2); Tab. 19 re-creates their mechanisms as single controlled changes.
- **Execution-guided repair**, e.g. Self-Debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and multi-agent repair (MAC-SQL), which the authors call "sequential test-time scaling" in the sense of [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") (§2).
- **Agent memory** distilled from trajectories (ReasoningBank, Dynamic Cheatsheet [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)"), Agent Workflow Memory, ExpeL) (§1).
- **Mechanistic studies of demonstrations** (Min et al. 2022; Wang et al. 2023; not listed here), which the interventions "follow" (§2).

## Problem and setting

- **Question:** "how do verified test-time episodes create value for future questions over the same database?" (§1), as research questions RQ1 (how much value), RQ2 (what information carries transfer) and RQ3 (which memory choices matter).
- **Data:** the BIRD development set ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"), a text-to-SQL benchmark over real databases), 1,534 questions over 11 databases; Spider dev ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), a cross-domain benchmark) (§4). Per seed (three seeds), a 70/30 split within each database: 1,073 collection and 461 held-out questions, so "transfer" means same-database transfer (§4).
- **Models:** Qwen3.5-27B; full replication on Qwen3.5-9B; Gemma4-E4B, Gemma4-31B, gpt-oss-20b and Hunyuan-A13B (open-weight models of four families) as probes; greedy decoding, reasoning disabled, except sampling inside T1 (one candidate) and T4 (five) at temperature 0.8 (§4).
- **Solver:** one greedy call over the full schema with no schema-linking step, so the memory block is the only content that varies (§4 "Solver context").
- **Correctness:** execution accuracy (EX), "correct iff the result set matches the gold query's; unevaluable counts as wrong" (§4); the gold execution result decides which episodes are stored (§3.5). NULL handling: not discussed.
- **Statistics:** four confirmatory comparisons (W0 vs no memory, verified vs unverified storage, k=10 vs k=1 retrieved cards, question–SQL correspondence); the rest is exploratory, and runs with fewer than three seeds preliminary (§4).

## Approach

- **One choice at a time:** source, verification, format and retrieval; defaults T3, W0, k=5 (§3; §4; Fig. 2).
- **Episodes:** T4 clusters samples by result set and takes the majority; the oracle bit then controls storage in the verified arm (§4). For the origin contrast, first-try-correct answers are banked too, downsampled to the repair-bank count (§4).
- **Bank and retrieval:** per-database banks (Eq. 1); top-k cards by similarity of the new question to each card's original question (Qwen3-Embedding-0.6B), so no format gets a retrieval advantage (§3.3; §4). A sentinel test checks that gold SQL never reaches cards or prompts (§3.2).
- **Mechanism controls (RQ2):** banks from other databases, lesson-only cards (local cards reduced to natural-language lessons), random same-database retrieval, and a permuted bank that mispairs every SQL with another question of its database while keeping cards, retrieval and prompt form (§5.2; Tab. 16).

## Results

- **RQ1 (§5.1, Tab. 1, Fig. 3):** held-out accuracy rises from 62.04% without memory to 66.38% with W0 (+4.34 percentage points (pp), 95% confidence interval (CI) [+1.50, +7.49]), against 71.8% for the repair reference; CR is 44.4% (CI [24, 65]%). On collection questions, replay reaches 96.1% with the own card and retention 56.0% without it.
- **RQ2 (§5.2, Tab. 17, Fig. 4):** local cards beat equally valid foreign cards; lesson-only cards lose accuracy; similarity targeting beats random local cards. A fully mispaired local bank keeps 73% of the aligned lift; correct pairing adds an amount whose interval includes zero. The authors conclude "the cards mainly provide database-specific information rather than matched examples to copy".
  - *Verification:* verified self-vote cards beat the matched unverified bank by 4.85pp; the ungated bank is below no memory in all three seeds. Flipping 5–20% of verification decisions synthetically "leaves transfer above the no-memory floor at every level", though synthetic noise and self-vote errors "are not interchangeable" (App. C "Oracle scope").
  - *Source:* repaired vs matched first-try-success banks: intervals include zero; T1 and T2 "underperform interactive, probe-grounded repair at matched bank sizes".
  - *Format:* W0 has the highest point estimate, all richer writers' intervals cross zero, and "None passes hierarchical equivalence even at a ±2.5pp margin"; format matters more for replay.
  - *Retrieval:* k=10 beats k=1 by 3.18pp, single steps not significant; half the bank matches the full bank, a quarter falls (Fig. 6); BM25 (a keyword-matching ranker) matches dense embeddings.
- **Cost (§5.4, Tab. 2):** memory does not raise accuracy after repair, so the two gains "mainly substitute". W0 uses 2.6× fewer recurring prompt tokens per lift point than serve-time repair, with a token crossover after roughly 7.5–9.9K future queries.
- **Robustness (§5.4, Tab. 3):** Qwen3.5-9B replicates lift and CR, which "does not show that the benefit increases with model size"; other families give positive single-seed estimates without CR; Spider's small deltas are, per the authors, consistent with little repair headroom. Over a chain-of-thought base the lift is smaller but positive.

## Limits the authors state

- "The results favour a simple operating point, not a universal recipe": same-database reuse on BIRD with a fixed single-shot solver; family cells are single-seed probes (§6 "Scope and open questions").
- The controls "locate an operating ingredient, not causal shares" (§6); the data "do not establish that all formats are equivalent" (§5.3).
- Two development-set benchmarks; "Absolute levels may inherit development-set optimism"; enterprise-scale settings such as ScienceBenchmark and Spider 2.0 (real-world text-to-SQL benchmarks) are outside the study (§7 "Benchmark scope").
- The protocol gives conditional values, not their prevalence in a workload; no expected-utility or break-even claim (§7 "Deployment workload").
- "greedy decoding is not bit-stable across serving environments" (App. D).
- The construction "is not oracle-free"; "we do not claim that the model can safely decide what to store on its own" (App. C "Oracle scope").
- EX "can pass a semantically wrong query on a lucky database state" (App. C "Gauge and metric"); absolute levels "and possibly crystallization fractions are coupled to this base" (App. C "Base pipeline").
- The token account is "not a dollar, latency, energy, or total-cost-of-ownership estimate" (§5.4).

## Open problems and building blocks

  - Near-duplicate schemas across tenants, moving cards into model weights, forgetting less useful cards, and multi-agent solvers "remain untested" (§6; App. C).
  - The small positive residual for correct pairing "remains unresolved under the hierarchical test" (§6).
  - Which deployment signal can verify: "Our experiments measure how reliable the signal must be (Section 5.3), not which source provides it" (§3.5).
  - "Applying the results requires a target workload's recurrence distribution and cost model" (§7).
- **Released:** "Open-source code, evaluation artifacts, and reproduction instructions" (abstract): solver, repair, memory, retrieval and evaluation code, a locked environment, tests, frozen aggregate results and figure and table scripts. BIRD databases, the "quality-controlled split" and raw transcripts are not redistributed; commands for a replication on BIRD Mini-Dev (a smaller public BIRD evaluation set) are provided (App. E "Reproducibility").
- **To reuse it:** a locally served solver model, an embedding model, a verification signal for storage and read-only database access for T3 probes; SQLite queries (§4; App. E). Building a T3 bank costs 5.90–6.04M tokens and about 4.3K database probes per seed; serving adds 604 prompt tokens per question at k=5 (§5.4; Tab. 2).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
