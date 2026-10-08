# VeRA: Renewing Reasoning Benchmarks with Executable Specifications

**VeRA** · preprint 2026 (v2, a rewrite of v1)

Read: [PDF](https://arxiv.org/pdf/2602.13217) · [arXiv](https://arxiv.org/abs/2602.13217)  
Code: [VeRA](https://github.com/Marco-Cheng/VeRA)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Turns each item of a reasoning benchmark into an executable task family, a question template, an input generator and a deterministic answer program, so that new labelled instances come from running code; VeRA-E draws fresh instances of the same family, VeRA-H modifies the family toward harder tasks, and VeRA-H Pro keeps the judge-ranked best of up to five validated proposals per seed (abstract; §2.1–2.2).
- An LLM teacher (GPT-5 by default) writes each specification in a propose–execute–validate loop; execution checks, agreement with the seed's known answer (E), an LLM judge that must tell the program's answers from perturbed ones (H), and six STEM PhD auditors who solve the rendered questions independently decide what is released (§3.1–3.2; §4); GSM8K's E variants get the automatic checks only (§4). Evaluated with 16 models on GSM8K, AIME 2024 and 2025, Beyond-AIME and AMO-Bench (§4).
- Benchmark labels backed by an executable specification, and a measure of how much of a seed item's accuracy carries over to fresh instances (AIME-2024 accuracy falls on VeRA-E variants, abstract; §5.1, Tab. 2). A program label is not enough by itself: the authors report that the initial human audit accepts 75.38% of hardened candidates, before repair (§5.3, Tab. 4).

## In plain words

Fixed reasoning benchmarks wear out: the authors name "repeated exposure to fixed questions and shrinking headroom as models improve" (§1), headroom meaning room left for scores to rise, and say that writing and checking each new item by hand makes sustained renewal expensive (§1). VeRA has an LLM turn each benchmark question into a small program package: a question template, a generator of valid inputs, and an answer program that computes the label. Fresh copies of the same problem (VeRA-E) and harder modified problems (VeRA-H, and VeRA-H Pro, which keeps the candidate an LLM judge ranks hardest) then come from running code, after automatic checks and, except on GSM8K's fresh copies, independent solving by human experts. Averaged over the same 16 models, accuracy on the AIME 2024 competition problems falls from 84.46% on the originals to 70.25% on fresh copies, and on the AIME-2024-II source the human-audited H Pro release lowers it from 84.91% to 58.57% (abstract). The authors present the work as "an integrated method for specifying, validating, and renewing reasoning benchmarks" (§1).

## Background and terms

**Terms to know:** [data contamination](#/glossary/data-contamination) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning)

**The paper's own terms:**
- **seed**: an original benchmark question with its known answer; **teacher**: the LLM that writes specifications, by default GPT-5 with high reasoning effort; **student**: a model being evaluated (§2.1, §4).
- **specification (task family)**: a template that renders an input assignment (values for the question's "slots") as a question, a generator that samples assignments, and a verifier ("answer program") that returns a validity flag and the canonical answer; an instance is kept when the flag is true (§2.1, Eq. 1). A hash of seed, generator and sampling index makes each draw reproducible (§2.1).
- **VeRA-E** ("E"): varies numbers, entity names, narrative form or language within the seed's family; the specification must give the seed's answer at the seed's own input, called seed anchoring (§2.2).
- **VeRA-H** ("H"): the teacher adds slots, constraints, dependencies and solution structure "to seek more difficult problems" (§2.2). **VeRA-H Pro**: of up to five validated candidates per seed, a fixed difficulty judge keeps the highest-ranked (§2.2).
- **noise discrimination**: the H check; a judge sees two trials with the verifier's answer and three with perturbed answers, and must classify at least four correctly (§3.1).
- **semantic audit**: six STEM PhD auditors solve the rendered questions without seeing the verifier code and compare with its output; unresolved disagreements are rejected after a senior annotator's review (§3.1).
- **Avg@5**: correctness averaged over five sampled answers per problem, then over problems, then equally over the 16 models (§4, Eq. 2).
- **Verified and Verified Full**: Verified is the human-audited set of accepted H and H Pro items used for the main results; Verified Full fills rejected positions with accepted replacements, as a separate evaluation set (§4).
- **perturbation score**: a variant's distance in values and wording from its seed (App. C).
- **fallback**: an item restating the seed when synthesis yields no accepted variant (App. I.2).

**Missing glossary terms:**
- **multi-agent debate**: several LLM agents check an answer and exchange assessments over rounds before a decision; in this paper's version, five agents share one model with different verification roles, run up to five rounds, and accept an answer when at least three explicitly support it (App. L.2).

**Builds on:**
- Benchmarks that vary statements or numbers (GSM-Plus, GSM-Symbolic, GSM-Ranges, VAR-MATH) or use functional evaluation (Putnam-AXIOM, RV-Bench); VeRA "compiles reusable families and adds computation modification plus candidate selection to renew headroom" (§7).
- Dynamic construction: DyVal and DARG (reasoning graphs), MaSTer (challenging rewrites), AutoLogi (logic puzzles verified through execution) (§7).
- Execution: PAL and Program of Thoughts, which execute solutions, and EvalPlus ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")), which expands tests of generated code; here, "execution labels new benchmark instances" (§7).
- The sources: GSM8K (grade-school math word problems; [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), AIME 2024 and 2025, and Beyond-AIME and AMO-Bench, which "extend their difficulty range" (§4, §7).

## Problem and setting

- **Question:** can benchmark items become executable families giving fresh instances and harder tasks with reliable labels (§1)?
- **Domain:** math problems with one final answer that a program computes (§2.1, §4). A GPQA-Diamond extension (multiple-choice science questions) labels variants by model arbitration and is reported separately (App. F).
- **Evaluation:** 16 models (Tab. 5–6), zero-shot reasoning prompts, five responses per problem, Avg@5 (§4).
- **Cohorts (§4):** E uses GSM8K (1,319 seeds), both AIME years (30 each) and Beyond-AIME (100); the human audit covers the 220 AIME and Beyond-AIME variants, and GSM8K gets the automatic checks only. H and H Pro use AIME-2024-II (14 seeds), Beyond-AIME (100) and AMO-Bench (50). A historical AIME cohort (1983–2001) is in the release but not in the main hardening comparison (§5.3).
- **What "correct" means:** the label is the answer program's output, checked by the validation layers (§3.1). "The program supplies the label; student performance establishes empirical difficulty" (§2.1).

## Approach

- **Four kinds of H modification** (§2.3): "Constraint tightening" (e.g. requiring positive or coprime parameters), "Composition" (intermediate quantities or dependencies), "Parameter-regime search" (sampling elsewhere within a family), "Structural generalization" (a special condition replaced by a parameter, such as perpendicularity by an angle).
- **Validation layers** (§3.1, Tab. 1): schema and execution checks, generator coherence, seed anchoring (E), noise discrimination (H), the expert audit, then student evaluation. The four-of-five threshold "retains more usable candidates before the independent audit" than requiring five (§3.1).
- **Propose–execute–validate loop** (§3.2, App. I.2): the teacher revises on structured feedback (violated constraints, runtime errors, mismatched seed answers) within a proposal limit of 20, with five sampled assignments per proposal and a target of up to five accepted H candidates per seed. Generated code runs in child processes with timeouts and CPU and memory limits. Afterwards, new instances come from local execution: "Program runtime and valid yield determine marginal cost" (§3.2).
- **Repair** (§3.1): audit feedback targets the rendering, the answer program or the parameter regime; the repaired candidate is validated again.

## Results

As the authors report (Avg@5 over the 16 models unless noted):

- **Fresh instances (E; §5.1, Tab. 2):** AIME 2024 falls from 84.46% to 70.25%, AIME 2025 less; Beyond-AIME barely changes. GSM8K's mean barely moves, but Kimi K2 Thinking falls while "most other models improve slightly" (§5.1, Fig. 3). The authors report the same year ordering with Gemini 3 Pro and Claude Opus 4.6 as teachers (§5.1). The AIME years' perturbation scores are similar, their accuracy changes not (Fig. 4). The audit accepts all 220 audited E variants (§4).
- **Harder tasks (Verified; §5.2, Fig. 5, Tab. 3):** on AIME-2024-II, 84.91% on seeds, 68.71% on H, 58.57% on H Pro. On Beyond-AIME, H is close to the seeds and H Pro lower: "judge-based candidate selection supplies most of the added challenge". On AMO-Bench both releases score above the seeds, H Pro below H. H Pro is below H on all three sources, in the raw pool and in Verified (Tab. 3).
- **Audit and repair (§5.3, Tab. 4):** the initial audit accepts 1,733 of 2,299 hardened candidates (75.38%); repair adds 454, for 2,187 (95.13%). AMO-Bench's initial pass rates are lower than AIME-2024-II's.
- **Noise-filter calibration (§3.1):** on 50 calibration items, the threshold of four gives one false acceptance and three false rejections; requiring all five gives zero and fourteen.
- **Worked failures (§6, Fig. 6):** two models that solve a seed fail a variant through wrong grid dimensions (DeepSeek V3.2 Thinking) or an incomplete case analysis (Gemini 3 Pro).
- **Debate verifier (App. L.3, Tab. 15):** in a separate study of five GPT-5.2 agents against one GPT-5.2 judge, over three runs on 195 candidate answers from 58 problems, mean precision (the share of accepted answers that are correct) rises from 55.1% for the single judge to 92.5% for debate, with fewer false acceptances and fewer false rejections.
- **GPQA-Diamond:** the mean is nearly unchanged on variants (App. F).

## Limits the authors state

No limitations section; these caveats are scattered.

- On AMO-Bench, "both releases average higher accuracy than the seeds under the evaluated budget" (abstract); "the hardest candidates and their frequency are properties of the candidate-level distribution" (§5.2).
- Audits found "failures involving edge-case arithmetic, ambiguous renderings, and degenerate parameter regimes", which "motivate independent item review even after a program passes execution checks" (App. B).
- The noise filter's threshold admits one false acceptance on the calibration set and was chosen for yield (§3.1); "Class-conditional error rates additionally require the numbers of truly valid and invalid candidates" (App. I.4).
- GSM8K's E variants get only "the automatic specification checks" (§4).
- A fallback item "represents a different transformation from successful parameter resampling" (App. I.2); in the synthesis study some Beyond-AIME seeds ended in fallback (App. I.3, Tab. 8).
- "A judge's ranking of candidate difficulty can differ from a particular student's difficulty profile" (App. J).
- GPQA-Diamond's "label assurance comes from arbitration rather than an executable mathematical answer program" (App. F).
- The debate verifier still rejects correct answers, through "difficulty checking the hardest solutions, incorrect mathematical objections, and mixed evidence falling short of the acceptance threshold", and uses up to 25 calls per candidate against one (App. L.3).

## Open problems and building blocks

- **Open:** none called open. Directions: "a judge must establish the validity of a difficult argument as well as detect a flawed one" (App. L.3); "If task families are used for training, future evaluation should document that exposure and preserve an appropriate held-out family or input regime" (App. G).
- **Released:** the paper describes the Verified and Verified Full releases (§4, §5.3), whose manifest "identifies every accepted item" (App. B), and "the released helper" that runs generated code (App. I.2); the title page links a project page (title page).
- **To reuse it:** an LLM teacher and judge (GPT-5 by default, §4); seeds with known answers for E anchoring (§2.2); the synthesis budgets (App. I.2); sandboxed execution and human solvers (§3.1–3.2).
- **Beyond its domain:** the GPQA-Diamond extension "broadens the application domain", with labels from arbitration (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
