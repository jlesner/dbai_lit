# On the Generalization Gap in LLM Planning: Tests and Verifier-Reward RL

**On the Generalization Gap in LLM Planning** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2601.14456) · [arXiv](https://arxiv.org/abs/2601.14456)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Fine-tunes Qwen-3-1.7B to write PDDL plans from a domain and a problem, on generated problems from 10 IPC 2023 domains, and scores it by the share of plans the validator VAL accepts on held-out problems of those domains and on two domains absent from training, Rover and Briefcase (abstract; §3, §5); three diagnostic variants follow: per-tuple symbol anonymization, a compact plan format, and GRPO with a VAL-based reward (§1, §4.1–4.3).
- Training data from the Gideon generator, with reference plans from the planner Probe, each validated by VAL (§3); SFT for up to three epochs (§4); the RL variant starts from the one-epoch compact-format checkpoint and is rewarded from VAL's verbose report: full credit for a valid plan that reaches the goal, a small credit for a syntactically valid one that doesn't, a small penalty for unsatisfied preconditions (§4.3); greedy decoding, single runs (§5); per-domain results (Tab. 3).
- Weight-space evidence that gains made against a program check (a plan validator) can stay inside the training distribution: the authors report that the baseline and all variants, the VAL-rewarded one included, reach 0% valid plans on both unseen domains, which they call "strong evidence of a severe generalization gap in our setting rather than a definitive statement about all fine-tuning paradigms" for one 1.7B model and two unseen domains (§6.2); meaning-preserving changes of surface form (renamed symbols, a compact plan format) lowered in-domain validity (abstract; §6.3). PDDL is outside the <a class="tag" href="#/tags/dsl">dsl</a> family.

## In plain words

A program, the validator VAL, checks whether a plan for a problem in PDDL (a standard language for planning problems) obeys its rules and reaches its goal (§2). The authors ask whether an LLM fine-tuned on such problems learns planning that carries over to new domains or mainly learns "domain-specific superficial regularities", which they call "critical for their deployment in open-ended planning scenarios" (§1). They fine-tune a 1.7-billion-parameter open model on 40,000 solved problems from 10 planning-competition domains and test it on new problems from those domains and from two unseen ones. In their setting, after three epochs of supervised fine-tuning, 82.9% of its plans pass VAL on the familiar domains and 0% on the unseen ones (abstract; §6.1). Renaming symbols or shortening the plan format, though meaning is kept, caused "significant performance drops" on familiar domains; reinforcement learning (training on rewards for its own sampled plans) rewarded by VAL, starting from a one-epoch supervised checkpoint, levelled off in half the supervised epochs but "does not improve cross-domain generalization" (abstract). They present a diagnostic study that trains on VAL's verdicts, where prior work uses validation "mainly for filtering or evaluation" (§2).

## Background and terms

**Terms to know:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [curriculum learning](#/glossary/curriculum-learning) · [reward shaping](#/glossary/reward-shaping) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [satisficing planning](#/glossary/satisficing-planning) (the reference plans come from "the satisficing planner Probe", §3)

**The paper's own terms:**
- **domain–problem–plan tuple**: one data item: a PDDL domain (predicates and actions), a problem (objects, start state, goal) and a plan solving it (§3).
- **valid plan rate**: the share of generated plans that pass VAL: a plan is valid "if and only if all action preconditions are satisfied, and the goal state is achieved under the PDDL semantics", with no partial credit (§5 "Evaluation Metric").
- **in-domain and unseen domains**: held-out problems from the 10 training domains, against problems from Rover and Briefcase, absent from training (§5 "Data Splits", §6.2).
- **B, v1, v2, v3**: the supervised baseline and the three diagnostic variants (§4); "B-1e" to "B-3e" in Tab. 3 are B after one to three epochs.
- **instance-wise symbol anonymization (v1)**: action, predicate, object and type names are replaced by synthetic symbols such as `a_0`, consistently within a tuple but independently across tuples, so names carry neither meaning nor identity across problems (§3 "Anonymization", §4.1).
- **compact plan serialization or encoding (v2)**: plans without timestamps, parentheses and the closing `END`, decoded back to the standard form before VAL checks them (§4.2).
- **verifier-reward fine-tuning (v3)**: RL in which VAL's report on each sampled plan sets its reward, instead of a match with a reference plan (§4.3). In the glossary's terms, its partial credits and penalty make it a shaped reward (ours).
- **warm start**: the supervised checkpoint RL starts from; starting from the pretrained model "leads to extremely sparse rewards" (§4).

**Missing glossary terms:** none.

**Builds on:**
- Gideon (Attolino et al., 2025), a framework for generating validated planning datasets, which they extend with the anonymization module (§3).
- VAL (Howey et al., 2004), the plan validator, used here to check the data, as the metric and as the reward (§2, §3, §4.3, §5).
- Fine-tuning LLMs on PDDL (Pallagani et al., 2023; Verma et al., 2025), which the authors say "improve in-domain executability", and studies that "still report fragile behavior and limited transfer beyond trained domains" (Zhu et al., 2025; Mendez-Mendez, 2025) (§2).
- RLVR work such as Zhao et al. (2025) ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")), with Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")) among those cited for gains that "do not always translate into stronger underlying reasoning ability" (§2).

## Problem and setting

- **Question:** "To what extent do fine-tuned LLMs acquire transferable planning competence across PDDL-compatible domains, or do they primarily learn domain-specific superficial regularities?" (§1).
- **Data:** 10 domains of the International Planning Competition (IPC) 2023 (Taitler et al., 2024), such as Blocksworld and Satellite (Tab. 1): 4,000 tuples per domain for training and validation (80/20), 100 held-out tuples per domain for the in-domain test, 250 per unseen domain (§3, §5 "Data Splits"). The generator "supports the core constructs of PDDL 2.1; general numeric fluents are excluded at this stage" (numeric fluents: quantities that actions change), and some domains got "minor adaptations" that the authors say "preserve the original planning semantics" (§3).
- **Reference plans:** from the planner Probe, each validated by VAL; duplicates are discarded "to eliminate the risk of data leakage across splits" (§3).
- **Model:** Qwen-3-1.7B, fine-tuned with the toolkit LLaMA-Factory (§4); it reads the domain and problem and writes the plan (Fig. 2). Inputs are capped at 4,096 tokens (§5).
- **Scoring:** valid plan rate under greedy decoding; outputs cut off at 2,048 tokens count as failures (§5 "Decoding Configuration"). Single runs, "which we consider sufficient for this exploratory study" (§5). v1 is anonymized at training and test time (§5 "Fairness Controls").
- Plan length or cost: not discussed.

## Approach

- **Data (Fig. 1, §3):** a Problem Generator samples start and goal states from per-domain rule files, avoiding "trivial, unsolvable, or degenerate cases"; a Plan Generator adds the reference plans.
- **B (§4):** supervised fine-tuning, a checkpoint after each of three epochs.
- **v1 (§4.1):** the training set is stacked three times and each tuple is anonymized with a probability rising linearly from 0 for the first tuple to 1 for the last, "from lexical grounding to purely structural supervision" (from meaningful names to none); one epoch over the result.
- **v2 (§4.2):** the compact format, three epochs; decoding for VAL "is purely syntactic and does not modify the generated action sequence".
- **v3 (§4.3, Fig. 3):** GRPO from v2's one-epoch checkpoint. Per problem the model samples a group of plans (three rollouts, Tab. 2), each decoded and run through VAL in verbose mode, which names the failure. Reward: +1.0 for a valid plan reaching the goal, +0.1 for a syntactically valid plan that doesn't, −0.1 for unsatisfied preconditions, 0.0 for syntax errors or other failures. One RL epoch, "after which performance saturates".
- **Cost argument (§6.4, App. A):** verifier-reward training needs no planner-made labels but validates sampled plans during training, a trade the authors call "potentially favorable when scaling to larger datasets" (§6.4); App. A gives asymptotic costs for both.

## Results

- **Unseen domains (§6.2):** B and all variants reach 0% valid plans on both Rover and Briefcase, against 82.9% in-domain for B after three epochs (Tab. 3). On inspection syntax and action parameters are correct and precondition violations "relatively rare"; instead "the model tends to get caught in loops or to wander without making progress toward the goal" (§6.2).
- **In-domain averages (§6.1, Tab. 3):** B scores 62.0%, 75.2% and 82.9% after one, two and three epochs; v1, v2 and v3 reach 71.4%, 72.2% and 78.1%.
- **v1 (§6.3):** a drop of 11.5 percentage points from B; most domains degrade moderately, but Maintenance collapses to 0% while others, such as Blocksworld, slightly improve.
- **v2 (§6.3):** a drop of over 10 percentage points on average, with Transport slightly up and Blocksworld down to 4% against 90% for B.
- **v3 (§6.3, Fig. 4):** from 51.9% at its starting checkpoint it reaches 80.1% within half an additional RL epoch, above B after two epochs (75.2%) and approaching its three-epoch score. Against v2 it lifts Blocksworld (92% against 4%) and Satellite (34% against 16%) but "can hurt" domains such as Parking (14% against 62%) (Tab. 3). The authors suggest that "a functional verifier-based reward can substantially mitigate this representational handicap for in-domain optimization, even though it does not improve cross-domain generalization" (the handicap: the compact format's) (§6.3).

## Limits the authors state

- Single runs, considered "sufficient for this exploratory study" (§5).
- With two unseen domains and one 1.7B model, they view the 0% result "as strong evidence of a severe generalization gap in our setting rather than a definitive statement about all fine-tuning paradigms" (§6.2).
- Anonymization and the compact format change token-level inputs, so the drops "may partially reflect the tokenizer behavior rather than purely semantic effects" (§6.6).
- "ten training domains and two unseen domains may be insufficient to induce abstract planning competence", since transferable behavior "may emerge only with substantially greater domain diversity" (§6.6).
- Anonymization both removes meaning and breaks symbol identity across problems: "These effects cannot be uncorrelated in the current setup" (§6.6).
- v3 removes the incentive to match reference plans, but "the model may still exploit surface regularities learned during the supervised warm-start phase" (§6.6).
- The plateaus "may reflect model capacity limits, irreducible domain difficulty, training data ambiguity, or optimization dynamics"; a more thorough analysis "will likely require larger models, broader domain coverage, or more structured datasets" (§6.6).
- RL needs a supervised warm start (§4), and in their setup "the total wall-clock time to reach saturation with verifier-reward RL is not lower than that of a purely supervised run" (§6.4).
- Gideon's PDDL support required domain adaptations and excludes general numeric fluents (§3).

## Open problems and building blocks

  - "Alternative bootstrapping strategies are left to future work" (§4).
  - The checkpoint RL starts from "could be optimized to maximize efficiency gains of Reinforcement Learning", and "in principle it may be possible to reduce the size of the training dataset while maintaining comparable performance" (App. A "Implications").
  - The bottleneck they name: "the main bottlenecks for cross-domain transfer in our setting lie in factors such as model capacity, domain diversity, or representation choices rather than the choice of optimization signal alone" (§6.5); on unseen domains the difficulty "lies in reliably steering behavior toward unseen goals in new domains rather than in basic PDDL syntax or precondition satisfaction" (§6.6).
  - Their variants and framework "could provide a foundation for future investigations into closing the gap between imitation at the surface and functional generalization" (§7).
- **Released:** §1 says "We provide a multi-domain benchmark, diagnostic stress tests, and a verifier-reward framework", and §7 speaks of "the released multi-domain dataset, representation stress tests, and VAL-based RL pipeline"; the footnotes in §3 and §5 read "Link: Code and data will be made available on publication."
- **To reuse it:** Qwen-3-1.7B; Gideon, Probe and VAL in verbose mode (§3, §4.3); PDDL 2.1 core without numeric fluents (§3); hyperparameters in Tab. 2. One 48 GB GPU for supervised fine-tuning, two for GRPO; B and v1 take about 54 hours for three epochs, and an RL epoch "roughly five times the wall-clock time" (§5 "Compute Environment").

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
