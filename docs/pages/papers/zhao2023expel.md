# ExpeL: LLM Agents Are Experiential Learners

**ExpeL** · AAAI 2024

Read: [PDF](https://arxiv.org/pdf/2308.10144) · [arXiv](https://arxiv.org/abs/2308.10144) · [DOI](https://doi.org/10.1609/aaai.v38i17.29936)  
Code: [ExpeL](https://github.com/LeapLabTHU/ExpeL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An agent gathers experience on training tasks by retrying them with Reflexion, then at test time adds natural-language insights drawn from that experience, and retrieved successful trajectories, to its ReAct prompt, without weight updates (§1, §4.1–§4.3).
- An LLM compares failed and successful trajectories of the same task, and successes across tasks, and edits an insight list with ADD, EDIT, UPVOTE and DOWNVOTE; an insight whose count reaches zero is removed (§4.2). Evaluated on HotpotQA, ALFWorld and WebShop, with transfer to FEVER (§5.1, §5.4).
- An early memory of lessons drawn from checked outcomes (exact match, task completion, attribute match, §5.1); the authors added the voting because "even successful trajectories can be suboptimal and mislead the generated insights" (§4.2). A baseline in [DIVE](#/papers/xiong2026dive "DIVE: Unlocking Self-Improvement in Frozen Language Models Through Diversity-Driven Skill Evolution (2026)").

## In plain words

An LLM agent that works through many tasks usually starts each one fresh: unless the model is fine-tuned, nothing learned on earlier tasks carries over. The authors argue that fine-tuning "is resource-intensive and may diminish the model's generalization capabilities", and that the strongest models are "primarily accessible through API calls" (abstract). They build ExpeL, "a novel LLM agent that autonomously learns from experience without gradient updates" (§1). On training tasks it retries failures, up to a set number of times, after reflecting on them, and keeps every attempt; an LLM then turns the stored successes and failures into a list of lessons, which the paper calls insights. Each new task gets one attempt, with those insights and the most similar past successes in the prompt (§4). With gpt-3.5-turbo acting and gpt-4 writing insights, it reports higher success rates than ReAct, a standard agent that interleaves reasoning and actions, on question answering (39% against 28%), household tasks (59% against 40%) and online shopping (41% against 35%) (Fig. 5, §5.1). The authors also claim "a novel setting of transfer learning" (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [dense retrieval](#/glossary/dense-retrieval) · [exact match](#/glossary/exact-match) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [imitation learning](#/glossary/imitation-learning) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

In the glossary's terms (our wording), ExpeL changes only the prompts of an agent harness, and its recall of past successes is dense retrieval.

**The paper's own terms:**
- **trajectory**: the record of one attempt at a task, step by step (§4.1, Alg. 3).
- **experience pool**: the store of the trajectories gathered on training tasks (§4, §4.1).
- **insights**: natural-language lessons an LLM extracts from the pool, pasted in full into the task specification at test time (§4.2, §4.3; examples in App. G).
- **importance count**: a score per insight; a new insight starts at two, `UPVOTE` and `EDIT` raise it by one, `DOWNVOTE` lowers it by one, and an insight at zero is removed (§4.2 "Learning from Successes and Failures").
- **experience recall**: retrieving the successful training trajectories whose tasks are most similar to the new one, as few-shot examples (§4.2 "Similar Experiences as Demonstrations").
- **R1–R3**: the first to third Reflexion retry; R0 is the first attempt (Fig. 5 legend, Tab. 2).
- **"finetune"** (in the paper's quotation marks): rewriting source-task insights with an LLM so they fit a target task, not a weight update (§4.4).

**Missing glossary terms:**
- **off-policy learning**: in [reinforcement learning](#/glossary/reinforcement-learning), learning from experience produced by another policy (a "behavior policy"); the authors liken insight extraction to it (§4; App. A.4).
- **experience replay**: storing past interactions and reusing them later; the authors liken their retrieval step to it (App. A.4).

**Builds on:**
- ReAct (Yao et al. 2023b; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")): the base planning algorithm, main baseline, and source of the prompts and few-shot examples (§3 "ReAct and Reflexion", §4.1, §5.1, App. D.2).
- Reflexion (Shinn et al. 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")): used to retry training tasks and gather experience (§4.1), and compared against at test time (§5.2 "Cross-task learning").
- Liu et al. (2022): semantically similar in-context examples help, which motivates experience recall (§4.2).

## Problem and setting

- **Question:** can an LLM agent improve from its own experience across tasks, with no parameter updates, then attempt unseen tasks "with a single try" (§4)?
- **Tasks:** "complex interactive tasks" of observations, actions and a goal; "We only deal with deterministic environments in this work" (§3).
- **Benchmarks (§5.1):** HotpotQA, question answering with a Wikipedia search tool; ALFWorld, text-based household tasks; WebShop, a simulated shopping website; FEVER, fact verification with the same tool, the transfer target. The task sets are 100 HotpotQA, 134 ALFWorld and 100 WebShop tasks, as in ReAct and Reflexion (App. D.1).
- **What counts as success (§5.1):** exact match of the answer for HotpotQA and FEVER, "completing the task in time" for ALFWorld, and "purchasing the item that matches all attributes" for WebShop. WebShop also gets a reward score between 0 and 1 (App. D.4).
- **Splits:** "All experiments use four-fold validation", with the mean and standard error over the folds (§5.1); App. D.1 describes training "on one half of the dataset" and evaluating "on the other half, and vice versa".
- **Models:** gpt-3.5-turbo-0613 acts in all evaluation agents and runs Reflexion during gathering (its 16k version when the context overflows); gpt-4-0613 extracts insights; temperature 0, greedy decoding (§5.1, App. D.5).
- **Baselines:** ReAct; Act, which is ReAct without reasoning steps; imitation learning results "taken from the ReAct paper" (§5.1); Reflexion (§5.2).
- **WebShop changes:** average prices instead of sampled ones, for determinism, and 10 items per page instead of 3 (App. D.3).

## Approach

- **Gathering experience (§4.1, Alg. 1).** Each training task is run with ReAct and the hand-written few-shot examples; every trajectory goes into the pool. On failure the agent reflects on the trajectory, adds the reflection to earlier ones, and retries with them in context, up to a set number of retries (three, Tab. 4). This yields more successes to recall and "valuable success/failure pairs" (§4.1).
- **Extracting insights (§4.2 "Learning from Successes and Failures", Fig. 2, Alg. 2).** Starting from an empty list, an LLM is shown, in turn, a failed and a successful trajectory of the same task, or a list of up to a set number of successes from different tasks. It answers with operations on the list: `ADD`, `EDIT`, `UPVOTE` or `DOWNVOTE`. The authors say the counts make this robust, since "even successful trajectories can be suboptimal and mislead the generated insights".
- **Recalling experience (§4.2 "Similar Experiences as Demonstrations").** Successful trajectories are stored in Faiss (a vector-search library) with all-mpnet-base-v2 (a sentence-embedding model) embeddings; the top-k by task similarity are retrieved.
- **Task inference (§4.3, Fig. 3, Alg. 3).** The task specification gets the full list of insights, and the retrieved trajectories serve as its few-shot examples; the agent then attempts the task once.
- **Transfer (§4.4, Fig. 4).** gpt-4-0613 rewrites source-task insights for a target task, given the target's few-shot examples, which the authors hypothesize "can better ground the insights into the target task and mitigate hallucinations". With no target pool, the agent uses fixed few-shot examples (§5.4).
- **Claimed strengths (§4.5):** "inherent interpretability" (users can inspect, modify or remove potentially harmful insights and trajectories), no retries at deployment, and "not restricted to specific language models".

## Results

- **Main results (Fig. 5, p. 8).** It reports ExpeL against ReAct at 39% against 28% (HotpotQA), 59% against 40% (ALFWorld) and 41% against 35% (WebShop); the caption says ExpeL "consistently outperforms the baselines on all domains".
- **The two learning modes (§5.2 "Experiential learning").** Insights-only against retrieve-only gives 36% against 31% on HotpotQA and 50% against 55% on ALFWorld, and near equal on WebShop; the authors read the two modes as "synergistic".
- **Against Reflexion (§5.2 "Cross-task learning").** The authors say ExpeL "matches Reflexion's performance (40% at R3 vs. 39%)" on HotpotQA and "even outperforms it for ALFWorld (54% at R3 vs. 59%) without repeated attempts".
- **Transfer to FEVER (Tab. 1, §5.4).** It reports 70% for ExpeL Transfer against 63% for ReAct and 65% when insights are rewritten without target examples.
- **Retries at test time (Tab. 2, §5.5).** On ALFWorld, ExpeL plus Reflexion goes from 59.0% (first attempt) to 64.2% at R3, against 54.4% for ReAct plus Reflexion at R3.
  - Insight extraction on HotpotQA (Tab. 3, upper): ExpeL 39.0% against 32.0% with hand-crafted insights, 32.0% with gpt-3.5-turbo as the insight writer, 29.0% when reflections are added to the insight inputs, and 28.0% for ReAct.
  - Retrieval on ALFWorld (Tab. 3, lower): task similarity performs best; random sampling has "a significant drop" and similarity of reasoning steps "a noticeable dip".
  - Experience (Fig. 6, HotpotQA): insights from the few-shot examples alone have "no advantage compared to the ReAct agent"; experience gathered with ReAct helps, with Reflexion more.
- **Behaviour (§5.3, App. H).** From manual inspection, the authors describe behaviours they attribute, with hedges such as "possibly", to specific insights: a best-guess answer instead of "Unknown" (HotpotQA), searching likelier places, and putting back a wrongly taken object (ALFWorld).
- **Extra metrics:** per-type and reward scores (Tab. 5); per-trajectory step and token counts (Tab. 6).

## Limits the authors state

- "we investigated tasks with textual observation, which is limiting in real-world scenarios"; adding images via vision-language or captioning models "could be an interesting new avenue of research" (§6 "Limitations").
- "we investigated the efficacy of our method by using closed-source API LLMs, which can be off-limits in some applications"; open-source LLMs are "another promising future work" (§6).
- The insights fit in the context window here, but "extra retrieval steps for insights might be needed for truly lifelong learning agents" (§6; also §4.3).
- "unlike reinforcement learning methods, prompting techniques lack theoretical underpinnings that could potentially impact the efficiency of the resulting policies"; future work should integrate the two (§6).
- "We only deal with deterministic environments in this work" (§3).
- On WebShop "there remains room for improvement", with ExpeL "approaching the lower side of Reflexion's success rates" (§5.2).
- gpt-4-0613 followed the operator instructions better than gpt-3.5-turbo-0613 "and hallucinated less" (§4.2); reflections may hallucinate and mislead insight extraction (§5.6).
- The reattempt results are "preliminary findings" and not "the central focus of our study" (§5.5).
- The §5.2 claims rest on "a deep understanding of each environment", the insights and retrieved examples, and run statistics (§5.2).
- Agents given internet access may "cause unexpected harm" (App. B).

## Open problems and building blocks

- **Open:** none stated beyond the directions given with the limits above (§6).
- **Released:** code and a project page (abstract footnote), with "full trajectory demos" on the page (§5.3); prompt templates in App. F.
- **To reuse it:** the OpenAI API (gpt-3.5-turbo-0613 to act and reflect, gpt-4-0613 for insights) through Langchain (App. D.5); Faiss and all-mpnet-base-v2 (§4.2); a success signal per training attempt, since retries follow failures (§4.1); per-benchmark settings (Tab. 4). All runs used one desktop with a single RTX 2080 Ti (App. C).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
