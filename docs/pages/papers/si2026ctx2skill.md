# From Context to Skills: Can Language Models Learn from Context Skillfully?

**From Context to Skills** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.27660) · [arXiv](https://arxiv.org/abs/2604.27660)  
Code: [Ctx2Skill](https://github.com/S1s-Z/Ctx2Skill)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Builds a natural-language skill set for one long, unseen context (a short Markdown file prepended to the system prompt) so that an LLM answers new tasks over that context better, with no human annotation, no external feedback and no weight updates (abstract; §3.2).
- Self-play among frozen LLM roles: a Challenger writes tasks with binary rubrics, a Reasoner answers them with its skills, a Judge LLM grades every rubric, and a Proposer–Generator pair per side turns the failed cases into Reasoner skills and the solved ones into Challenger skills; Cross-Time Replay then picks the iteration whose Reasoner skills do best on hard and easy probe tasks kept from the loop (§3.3–3.4). Evaluated on CL-bench with GPT-4.1, GPT-5.1 and GPT-5.2 (§4.1).
- Proposer–solver self-play entirely in prompt space, whose only check is an LLM judge with rubrics the Challenger writes itself; the authors name extending it to verifiable domains, where "execution feedback or formal verification" could replace or complement the Judge, as future work (App. B): the gap Proposer–solver self-play names, a prompt-only loop whose proposer writes tasks under a sound check.

## In plain words

Many real tasks need a language model to learn from a long document it is given, such as a rulebook, beyond its training; the authors call this context learning (§1). Hand-writing reusable instructions ("skills") from such documents is costly, and the document alone gives no outside signal of whether a skill is right (abstract; §1). In Ctx2Skill, model roles play against each other on one document: one writes test tasks with pass/fail checklists, one answers using a skill file, a grading model checks the answers, and a pair of roles per side turns failures and successes into skill-file edits; a final step picks the round whose skill file does best on hard and easy tasks saved during play (§3). On CL-bench, expert-written tasks graded by a model, the skills raise GPT-4.1's share of tasks solved from 11.1% to 16.5% and GPT-5.1's from 21.1% to 25.8%, against the same model without skills, with that model in every role but the grader (Tab. 1; §4.1). The authors present it as needing "neither human annotation nor external feedback" (§1), not as a first.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reward hacking](#/glossary/reward-hacking) (here: skills that exploit the grading model's preferences, App. D) · [rubric](#/glossary/rubric) (here each rubric is one binary pass/fail criterion, and CL-bench grades each task against a set of them, Fig. 6, §3.2).

**The paper's own terms:**
- **context learning**: LMs (language models) "directly learn relevant knowledge from the given context" (abstract); the term is CL-bench's (§1). The authors set it apart from long-context tasks that primarily test retrieval or reading comprehension and from in-context learning of "simple task patterns via instructions and demonstrations" (§4.1).
- **skill set**: "a short Markdown file pre-pended to the system prompt of the LM at inference time" (§3.2). Building uses two, the Reasoner's and the Challenger's; only the Reasoner's is deployed (§3.2).
- **solving rate**: the share of tasks solved, where a task counts as solved "only when every rubric passes" (§3.2, Eq. 1).
- **backbone**: the model used in one setting for every role but the Judge, and by the baselines (§4.1).
- **adversarial collapse**: the risk that "the Challenger may generate increasingly extreme tasks while the Reasoner's skills over-specialize to these pathological cases" (§1, §3.4).
- **Laplace smoothing** (as used here): add one to the number of solved probe tasks and one to the probe-set size (Eq. 3), which keeps the product of the two rates "well-defined when a probe set is empty" (§3.4).
- **test set contamination** (the paper's sense): generated tasks that "closely replicate the test tasks" (App. D), not test items in training data.
- **self-play** (the paper's sense): two sides co-evolve "by iteratively updating their respective skill sets rather than model parameters" (§1); in our terms, the glossary's proposer–solver [self-play](#/glossary/self-play) with skill-file edits in place of training.

**Builds on:**
- CL-bench (Dou et al. [12], 2026): the benchmark, its definition of context learning and its grading protocol (§1, §3.2, §4.1).
- AutoSkill (Yang et al. [44], 2026), whose document variant AutoSkill4Doc is the main baseline (§4.1, App. B), and the other automated skill builders (AutoRefine, CoEvoSkills, EvoSkill, SkillX), which the authors say "rely on external feedback signals" (§2).
- Multi-agent self-play work, e.g. SPIRAL (Liu et al. [21]), and rubrics from Gunjal et al. [15] (§1). None of these is on this site.

## Problem and setting

- **Question:** can a model build skills for an unseen context from the context alone, with no human annotation, external feedback or parameter update, so that any LM solves unseen tasks over that context better (§3.2, §1)?
- **Task form** (§3.2): a context, tasks whose answers depend on it, and binary rubrics per task (Eq. 1).
- **Benchmark:** CL-bench, "500 complex contexts, 1,899 tasks, and 31,607 verification rubrics, all crafted by experienced domain experts", in four categories: Domain Knowledge Reasoning, Rule System Application, Procedural Task Execution, Empirical Discovery & Simulation (§4.1). Grading follows the benchmark's protocol, with GPT-5.1 as the LLM judge (§4.1).
- **Where skills come from:** one run of the loop per context (§4.1). The Challenger writes its own tasks "from the same context on which the CL-bench test tasks are built" (App. D); the Reasoner uses each context's bundled system prompt unchanged (App. B).
- **Models:** OpenAI's GPT-4.1, GPT-5.1 and GPT-5.2 as backbones; four other frontier models (Claude Opus 4.5, Gemini 3 Pro, Kimi K2.5, DeepSeek V3.2) only without skills; default reasoning effort where a model has a thinking mode (§4.1). The Judge is GPT-5.1 in every setting (§4.1, App. B), except one check in App. D; its prompt gives it the rubrics and the answer (Fig. 11).
- **Baselines:** Prompting, which asks the backbone to write a skill set from the context "in a single pass", and AutoSkill4Doc, which splits the context into windows, extracts skills per window and recombines them; both use the same backbone for skill writing and answering (§4.1).

## Approach

- **Five frozen-LM roles per iteration** (§3.3; Fig. 2):
  - the **Challenger** writes a batch of tasks with rubrics, guided by its own skills; the rubrics are meant to require "inducing the rules of C rather than paraphrasing surface spans" (C is the context);
  - the **Reasoner** answers each task given the context and its skills;
  - the **Judge** gives a pass/fail verdict per rubric and splits the batch into failed and solved tasks;
  - a **Proposer** per side analyzes all its routed cases together and writes a diagnosis: an action (add or merge), a skill name, a description and a justification;
  - a **Generator** per side turns the diagnosis into "a complete replacement skill set that adds or merges entries while preserving every unrelated entry".
- **Routing:** failed tasks go to the Reasoner's Proposer and Generator, to supply the missing contextual knowledge; solved tasks go to the Challenger's, to sharpen its task and rubric writing; "no prompt is ever conditioned on the opposing side's skill set" (§3.3).
- **Why a selection step:** collapse "is undetectable within the loop", since each Judge call only sees the newest tasks (§3.4).
- **Cross-Time Replay** (§3.4): each iteration adds its failed task with the lowest rubric pass rate to the hard probe set and its solved task with the fewest rubrics to the easy probe set. After the loop, the Reasoner re-answers all probe tasks under every iteration's skill set, the Judge re-grades them, and the skill set with the highest product of the smoothed hard and easy solving rates is kept (Eq. 3–4). The product rejects a skill set that fixes late failures at the cost of easy ones, and one that solves every easy probe but fails every hard one.
- **Use:** the selected skills are prepended to the system prompt for any unseen task over the same context; built once per context, "with no additional cost per deployed query" (§3.4).

## Results

- **Main results** (Tab. 1, §4.2): the gains above, and GPT-5.2 from 18.2% to 21.4%, in every category, "especially pronounced" in Procedural Task Execution and Empirical Discovery & Simulation. On GPT-4.1 the baselines reach 12.3% (Prompting) and 13.2% (AutoSkill4Doc), and they "occasionally degrade individual categories" (§4.2). Without skills the best model is GPT-5.1 (§4.2); GPT-4.1 with Ctx2Skill skills scores above Gemini 3 Pro without them (§4.2).
- **Skill quality** (Tab. 2), judged by GPT-4.1 on five criteria such as faithfulness and reusability: Ctx2Skill has the highest average on all three backbones.
- **Ablations** (Tab. 3, §4.3; GPT-4.1 and GPT-5.1): removing the Challenger's skill evolution "causes the largest drop" (13.8% on GPT-4.1) and removing Cross-Time Replay the second largest (14.7%); the hard probe set matters more than the easy one; dropping Laplace smoothing or merging Proposer and Generator into one agent also lowers scores.
- **Variants** (Tab. 3, §4.3; GPT-4.1): updating only the losing side, feeding both outcomes to both sides, and adding instead of multiplying the two probe rates each score lower.
- **Fixed iterations** (Tab. 3, §4.3; GPT-4.1): skills from a fixed iteration fall from 15.9% (Iter-1) to 14.7% (Iter-5), all below Cross-Time Replay's per-context choice. Early iterations are selected most often on all three backbones (Fig. 4, §4.3).
- **Transfer** (Tab. 3, §4.3): GPT-5.1's skills used by GPT-4.1 come close to GPT-4.1's own; GPT-4.1's skills used by GPT-5.1 help less than GPT-5.1's own.
- **Checks on the gains** (App. D): with GPT-5.2 instead of GPT-5.1 as the loop's judge (evaluation judge unchanged), Ctx2Skill on GPT-5.2 scores 21.2%, against 21.4% with the default loop judge (Tab. 11); no generated task shares any 50- or 100-word sequence with the test tasks of its context, over about 12,500 generated tasks (GPT-5.1 setting, Tab. 12); giving each context the skills of a random context from another sub-category (a finer topic within a category) yields 12.5% on GPT-4.1, against 11.1% without skills and 16.5% with matched skills (Tab. 13). The authors conclude that "none of these concerns holds" (App. D).
- **Loop dynamics** (App. A, Tab. 5–10): the Reasoner's in-loop solved rate rises on GPT-4.1, rises and then levels off on GPT-5.1, and falls on GPT-5.2, which the authors read as consistent with adversarial collapse; tasks, answers and skill sets grow longer over iterations, and the selected skill sets are shorter on average than the last iteration's (Tab. 10).

## Limits the authors state

- "Due to API budget constraints", only 5 iterations of 5 tasks each were run per context; "larger values may yield further improvements but remain unexplored" (App. B; also §4.1, which adds that the best skill set "is typically selected from early iterations").
- "For the same reason, we do not perform multiple independent runs to report error bars or confidence intervals"; they argue that covering all 500 contexts gives "a stable estimate of overall performance" (App. B).

## Open problems and building blocks

- **Open:** extending Ctx2Skill "to verifiable domains, e.g., mathematics, where execution feedback or formal verification can serve as an automatic reward signal, potentially replacing or complementing the Judge and enabling tighter co-evolution loops" (App. B).
- **Released:** a code repository linked on the title page (title page); the paper states nothing further about releases.
- **To reuse it:** frozen LLMs only, with "no parameter updates" (§2); in the paper the four non-judge roles run on the backbone and the Judge on GPT-5.1, one loop per context (§4.1, App. B); total API cost about $30K, "including exploratory runs" (App. B).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
