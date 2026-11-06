# Socratic Skill Learning: Interleaving Teaching and Practice for Transferable Agent Skills

**SSL ("Socratic Skill Learning")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.17860) · [arXiv](https://arxiv.org/abs/2610.17860)  
Code: [Socratic-Skill-Learning](https://github.com/NJU-LINK/Socratic-Skill-Learning)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A Student model practises on one anchor task and writes an agent skill package itself while an Educator model reviews its work and the live package read-only and explains, challenges, diagnoses or stays silent; fresh solver sessions then use the frozen package on held-out members of the task's family, in the authors' SkillTransferBench (35 task families, 408 executable cases with private tests, six domains) (abstract; §3–4).
- Two review schedules: Fixed-Window SSL reviews after every g Student tool calls; Issue-Guided SSL keeps a tree of learning issues, each with an acceptance criterion, and after an initial review reviews only when an unresolved issue opens, changes or reopens (§4.2–4.3). Compared with the Educator model writing the package itself (Expert Authoring) and one review after each round (Post-hoc Teaching) on Qwen, DeepSeek and Kimi model pairs, and with adapted Trace2Skill and SKILL-KD on the Qwen pair (§5.1–5.2, App. C.3, App. D.3).
- Who writes the skill, scored by verifiers on held-out cases: the authors report that the Student's package under Fixed-Window SSL beats the Educator model's own by 7.29 points (paired family-bootstrap 95% CI [3.62, 11.44]) on the Qwen main cohort (App. D.1), while on the 10-family subset shared by the three model pairs every interval for that contrast includes zero (Tab. 13). A learning issue closes on the Student's own declaration (verified, bounded or rejected, the last two on stated evidence only) or on Educator silence, which "records Educator silence rather than verified correctness" (App. C.2).

## In plain words

An LLM agent can be given a skill: instructions and helper scripts it reads before a task. The authors ask how an expert model should help a learner model write a skill that also works on new variants of the task it practised on (§1). In Socratic Skill Learning (SSL), the learner (Student) acts in the task environment and writes the skill itself, while the expert (Educator) reviews its recent work and explains, challenges, diagnoses or stays silent (§4). Their SkillTransferBench has 35 task families whose held-out variants are scored by hidden tests in fresh sessions (abstract; §3.2). On 22 main families, with Qwen models in both roles, the version reviewing at fixed intervals passes on average 0.801 of the hidden checks, against 0.723 with no skill and 0.761 and 0.751 for two adapted methods that turn recorded attempts into skills (abstract; §5.1). A version that tracks open questions to select and focus reviews reaches 0.805 with 61.7% fewer Educator tokens than the fixed one (abstract). They present it as a new protocol compared with existing skill-induction methods (§1), claiming no "first".

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [tool calling](#/glossary/tool-calling-function-calling) · [paired comparison](#/glossary/paired-comparison) · [cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap)

**The paper's own terms:**
- C.1). Written K in the paper.
- **Task family, anchor, family specification**: a family is a set of executable task variants sharing one goal; the anchor is the one fixed case used for practice; the public specification states the invariant goal and what may vary, e.g. "WAL encoding, integrity, and recovery depth" (§3.1). WAL is a database's write-ahead log.
- **Fresh solver**: the target model in a new session per case, loading only the frozen package, with other skills disabled (§3.1, App. C.1).
- **Student, Educator**: the Student is the target model, sole environment operator and package author; the Educator, a second model, reads recent Student work and the package and at each review gives a lesson or stays silent (§4.1, App. C.1).
- **Round**: one authoring trajectory, then a fresh solver tests the package on the reset anchor and its feedback enters the next round; each authoring and teaching protocol uses 3 rounds (§4.1, Tab. 7).
- **Utility (family-macro Avg@3)**: the share of a case's private checks that pass (timeouts score zero), averaged over each family's held-out cases, then over families with equal weight, then over 3 repeats (Eq. 2, §3.3). **Transfer gain** is the difference from No Skill in percentage points; the **full-pass rate** counts a case only when every check passes (§3.3).
- **Learning issue, Learning-Issue Tree**: a lesson's learning focus and acceptance criterion ("what to investigate and what observable evidence would resolve it"), kept with linked evidence and revisions; a concern raised inside an investigation becomes a child issue (§4.3).
- **Revision**: a group of file edits the Student commits with a summary, evidence and the issue it addresses (§4.3, App. C.2).
- **Main cohort, lite subset**: 22 families with 155 held-out cases, and 10 of those families with 77 cases, used for the other model pairs (§3.2).
- **Teaching efficiency**: transfer gain per Educator token; acquisition tokens (spent building the package) include cached input (App. C.3).

**Builds on:**
- Trace2Skill (Ni et al., 2026), which distills trajectory lessons into skills and tests held-out transfer; adapted as a baseline (§2, App. C.3). Not on this site.
- SKILL-KD (Shi et al., 2026), whose consolidation agent derives skill patches from Teacher–Student trajectory contrasts and validates them through Student reruns (§2); adapted as a baseline (App. C.3.1). [SKILL-KD](#/papers/shi2026skillkd "SKILL-KD: Contrastive Skill Distillation for LLM Agents (2026)").
- SkillLearnBench's Teacher Feedback (Zhong et al., 2026), advice after failed attempts using a reference skill (§1; App. A, Tab. 4), [SkillLearnBench](#/papers/zhong2026skilllearnbench "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks (2026)"); and SkillsBench (Li et al., 2026b), which measures skill utility (§1, §2), [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)").
- Ideas the design connects: Socratic dialogue (Liu et al., 2024a), learner construction (Chi et al., 2001), feedback on the learning process (Hattie and Timperley, 2007) (§2).

## Problem and setting

- **Question:** "how should external expertise guide the learner while it is still gathering evidence?" (§1), split into four research questions: transfer, organizing guidance, how guidance enters skill development, and review with less supervision (§1, §5).
- **Benchmark:** cases adapted from six agent and coding benchmarks (Terminal-Bench, AgentIF-OneDay, SpreadsheetBench, CodeContests, FullStackBench, OfficeBench) and grown into families by experts working with agents (§3.2). Each case has a resettable environment, a reference solution and private tests, with Docker builds checked; an expert other than the author reviews each case (§3.2, App. B.3). The main cohort keeps families with at least 5 verified held-out cases and at least two non-perfect outcomes in No-Skill screening (§3.2).
- **Isolation:** held-out materials stay inaccessible during acquisition (App. C.1).
- **Models:** Qwen3.7 Plus as Student and solver with Qwen3.7 Max as Educator or direct author; the DeepSeek pair (V4 Flash / V4 Pro) and the Kimi pair (K2.5 / K3) (§5.1, App. C.1). Qwen uses 3 independent acquisition runs per family and method; DeepSeek and Kimi one, on the lite subset (§3.3, Tab. 2).
- **Uncertainty:** paired 95% bootstrap intervals that resample whole families (§3.3).

## Approach

- **Shared process (§4.1).** The Student explores the anchor guided by the specification, tests candidate procedures and decides what to keep; it "can question, test, adapt, or reject advice". Only the final package goes to held-out cases.
- **Fixed-Window SSL (§4.2).** The Educator reviews after every g completed Student tool calls (g = 10 in the main runs), seeing the specification, recent reasoning and tool calls, prior lessons, anchor feedback and the whole package; the Student may respond, followed by at most one Educator reply (App. C.2).
- **Issue-Guided SSL (§4.3).** Each lesson opens a persistent learning issue. An addressed issue can close, with a changed package, when the Student verifies the revision ("Verified closure requires a successful post-lesson check"), documents where the procedure applies, or rejects the guidance on evidence; a review that ends in silence records a no-lesson closure (App. C.2). After an initial review, the Educator is called only when an unresolved issue opens, changes or reopens, and sees a focused context (the active issue and its ancestors, the latest revision, recent tool calls). Contradicting anchor feedback can reopen an issue (§4.3, App. C.2).
- **Comparators (App. C.3, Tab. 7).** No Skill; Expert Authoring (the Educator's model explores and writes the package); Post-hoc Teaching (the Student writes, with one review after each round's trajectory); adapted Trace2Skill (parallel patch proposals consolidated from independent anchor trajectories); adapted SKILL-KD (rule edits proposed by a critic from Teacher and Student trajectories, accepted only after a fully successful fresh Student rerun, App. C.3.1).

## Results

- **Transfer (§5.1, Tab. 1, Tab. 8).** On the Qwen main cohort, utility is 0.723 without a skill, 0.728 for Expert Authoring, 0.748 for Post-hoc Teaching, 0.761 and 0.751 for adapted Trace2Skill and SKILL-KD, 0.801 for Fixed-Window SSL and 0.805 for Issue-Guided SSL (Tab. 8). The two SSL schedules "rank first and second overall and in each of the six domains"; the full-pass rate rises too, and the paired interval against Trace2Skill excludes zero (§5.1).
- **Student-written against expert-written (App. D.1).** Fixed-Window SSL's paired gain over Expert Authoring is 7.29 points (95% interval [3.62, 11.44]); the interval for Post-hoc Teaching against Expert Authoring includes zero.
- **Across model pairs (§5.2, Tab. 2(a), App. D.3).** On the shared 10 families, both interleaved schedules rank above Expert Authoring, and Post-hoc Teaching ranks last, for every pair. Tab. 13 gives the paired intervals: for Fixed-Window SSL against Expert Authoring they include zero on all three pairs.
- **How teaching enters (§5.3, Fig. 4, App. E).** As anchor scores improve, the share of regular reviews (those every g tool calls, not end-of-round ones) that give a lesson falls sharply across rounds and advice "shifts from reasoning toward diagnosis"; under the three-round protocol, packages still change in nearly every round after a perfect anchor score. After a lesson the Student's next call is 23.9 points more likely to write or edit a file, and the package 38.6 points more likely to change within ten calls, than after silence (adjusted for round). A case study shows the Student replacing an Educator-suggested generic arithmetic check with financial relations after its first version flagged correct entries (Tab. 3, App. G.1).
- **Review cost (§5.3).** Tokens per review grow 5.3-fold from the first round to the last as context accumulates; in the last round, reviews ending in silence take most review tokens (before follow-up dialogue).
- **Selective review (§5.4, Fig. 5, Tab. 17).** Against Fixed-Window SSL at g = 10, Issue-Guided SSL reaches 0.805 against 0.801 with 61.7% fewer Educator tokens, 16.9% fewer acquisition tokens and 2.75 times the transfer gain per Educator token; g = 5 and g = 20 both score lower.
- **Selective review on other pairs (§5.4, App. F.1).** On the shared 10 families, Educator tokens fall 63.8% (DeepSeek) and 77.4% (Kimi) with utility within one point; total acquisition tokens fall for Kimi but rise for DeepSeek, where the Student does more work.

## Limits the authors state

- "Our study evaluates complete Skill-learning protocols under a shared single-anchor setting. Further controlled comparisons could isolate how much the Educator, review timing, and issue structure each contribute to transfer performance and teaching cost." (App. H)
- Issue-Guided SSL changes several things at once: "triggers, context, and follow-up policy change together" (App. C.2; also App. F.1).
- The process analyses are associations: "review decisions respond to the Student's ongoing work" (App. E.2).
- "A no-lesson closure records Educator silence rather than verified correctness." (App. C.2)
- Saving on total cost is model-dependent: "the consistent reduction in external supervision" is distinguished "from the model-dependent change in total acquisition cost" (App. F.1).
- Cost scopes differ: DeepSeek and Kimi totals cover only the author and Educator sessions (App. C.3), and the adapted baselines have no common-scope cost; SKILL-KD's audit "follows a different scope" (App. C.3.1, App. D.1).

## Open problems and building blocks

- **Open:** none stated beyond App. H's further controlled comparisons, listed under Limits.
- **Released:** "Benchmark tasks, acquisition and evaluation code, and released trajectories" (§ "Reproducibility Statement"; also §1, footnote 1); scores and frozen skills directly, with the remaining Qwen session logs restorable by a script (App. C.4).
- **To reuse it:** Node.js 22.19 or later and Docker, with `SSL_URL` and `SSL_KEY` set in `.env` (App. C.4); the harness runs on the Pi coding agent 0.81.1 (an existing coding-agent program) and TypeScript 5.9.3 (App. C.1). On Qwen, acquisition averages 6.89M tokens per run for Fixed-Window SSL and 5.72M for Issue-Guided SSL (Tab. 17).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
