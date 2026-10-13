# Steering Large Language Models between Code Execution and Textual Reasoning

**Steering Large Language Models…** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2410.03524) · [arXiv](https://arxiv.org/abs/2410.03524)  
Code: [CodeSteer-v1.0](https://github.com/yongchao98/CodeSteer-v1.0)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures when LLMs answer by writing and running code rather than in text, and how well 7 existing ways of steering that choice work (prompts asking for code or for text, AutoGen's system prompt, OpenAI's Code Interpreter), on 14 math, logic, robot-planning and symbolic tasks with 6 LLMs (abstract; §3.1).
- Success rates checked by predefined rules (GPT-4o adjusts answer formats if needed), with extracted code run under a 30-second limit, summarized as a score normalized by the best method per task (§3.1, Eq. 1); proposes three steering methods (Code Interpreter+, Code + Text + Sum., Self-estimate Score) and a multi-turn loop that returns execution results for refinement (§3.4), with token and runtime costs (§3.5, Tab. 4).
- Evidence that handing a task to an executor is a choice the model can get wrong: the authors report that "results from LLM written code are not always better than using textual reasoning, even if the task could be solved through code" (abstract), that prompting for code does as poorly as, or worse than, text on Game 24 (§2.3, Fig. 6), and that GPT-4o with Code Interpreter tends to answer medium-difficulty multiplications in text, which "sometimes is wrong", while GPT-4o-mini and GPT-3.5 "generate code all the time when encountering slightly complex questions" (§2.1–2.2, Fig. 3).

## In plain words

An LLM can answer in text or by writing code that a computer runs. The authors argue that text "is not the best format for precise computation and planning": GPT-4o miscounts the r's in "strawberry" in text but solves it when prompted to use code (§1, Fig. 1). The challenge is getting a model to pick code when needed.

They test seven existing ways of steering that choice on 14 math, logic, planning and symbolic tasks with six LLMs, and propose three more (abstract, §3). They find "no optimal method" among the existing ones, and that code answers "are not always better" than text, "even if the task could be solved through code" (abstract). With OpenAI's code-running tool, smaller GPT models sometimes beat GPT-4o, which more often answers in text (§2.2). Their best new method answers both ways and a third call combines them. Scores are success rates scaled by each task's best method, averaged over six models. It scores 79.5 against 77.2 for the best existing method (Tab. 2). They call the work "an in-depth investigation" (§1).

## Background and terms

**Terms to know:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [self-correction](#/glossary/self-correction) · [scaling law](#/glossary/scaling-law) · [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl). In the glossary's terms, the paper's All Code method is close to program-of-thought prompting, and Code Interpreter to tool-integrated reasoning.

**The paper's own terms:**
- **steering code/text generation**: deciding, or pushing, whether the LLM answers with executed code or with textual reasoning (abstract, §1).
- **Code Interpreter (CI)**: an OpenAI GPT function in which "models are trained to use an integrated coding platform as part of their reasoning"; the platform runs the code and returns the results, repeating until a final answer (§1).
- **task complexity**: a task's size, e.g. the digits of the numbers multiplied (§2, Fig. 3).
- **inverse scaling behavior**: here, smaller GPT models with CI outperforming larger ones on some tasks, "inverse to the well-known scaling law in LLMs" (§2.2).
- **text-like code**: a code answer in which "the code serves merely as a form of textual reasoning", calculating and checking values without efficiently helping find the answer (§2.2, Fig. 5).
- **Average Normalized Score**: for each task, a method's success rate divided by the best method's on that task, averaged over the tasks (§3.1, Eq. 1).
- **multi-agent framework**: in this paper, several calls of the same LLM with different prompts, e.g. two answerers and a summarizer (§3.4; App. A).

**Builds on:**
- The steering methods it examines first: OpenAI's GPT Code Interpreter (cited as Achiam et al., 2023; Dubey et al., 2024) and the system prompt of AutoGen (Wu et al., 2023), a multi-agent framework whose prompt has the LLM decide when to generate code (§1, App. E).
- Work that uses several LLM agents to refine answers, ReConcile (Chen et al., 2023) and Mixture-of-agents (Wang et al., 2024a), which inspires combining code and text answers (§1 item 4, §3.4).
- Tasks from earlier work, e.g. GSM-Hard from PAL (prompting the LLM to write its reasoning as a program), Gao et al. (2023; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")), and Game 24 from Tree of Thoughts (search over intermediate reasoning steps), Yao et al. (2024; [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")) (§3.1, App. D).
- Work it uses to explain its findings: Huang et al. (2023) ([Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)")) and Gou et al. (2023) on self-correction (§3.4).

## Problem and setting

- **Question:** can current methods make an LLM switch well between running code and reasoning in text (§2, §3)?
- **Tasks (§3.1, App. D):** 14, in four groups: math (Number Multiplying; Game 24, writing an equation that makes 24 from given integers; GSM-Hard, grade-school word problems with larger numbers; geometry and counting-and-probability questions from the MATH dataset (competition mathematics problems)), logical reasoning (four BIG-Bench-Hard puzzles (hard tasks from the BIG-Bench benchmark collection), e.g. Date Understanding), robot planning (BoxNet, moving boxes with robot arms; Path Plan, robot waypoints) and symbolic calculation (Letters, counting letters and their positions; BoxLift, assigning lifters to boxes; Blocksworld, stacking blocks). All "can all be solved through coding, though with varying levels of difficulty"; O1-preview gets only 5 tasks "where O1-preview still underperforms". Each task has "over 300 trials so that the variance caused by unstable LLM outputs can be neglected".
- **Models (§3.1):** O1-preview, GPT-4o, GPT-4o-mini, GPT-3.5, Claude-3-sonnet, Mixtral-8x7b. CI is run only on GPT-4o, GPT-4o-mini and GPT-3.5, since the other three models "lack CI functions"; O1-preview is not run with AutoGen System because "its system prompt cannot currently be modified".
- **Correctness (§3.1):** answers are checked "by predefined rules with the assistance of GPT-4o to adjust answer formats if needed"; code given as a final answer is extracted and run, and a run over 30 seconds is a failure. Metric: success rate, summed up as the Average Normalized Score.
- Prompts are the original datasets', "without any code/text generation hints" (§3.1).

## Approach

- **Probing CI (§2):** on Number Multiplying and Game 24, whose complexity "can be easily adjusted", they record each GPT model's code use and success with CI (Figs. 2–4), compare correct and text-like code (Fig. 5), and add the prompts "Use code to answer the following question" or "Use text to answer the following question" (§2.3, Fig. 6).
- **Seven baselines (§3.1):** Only Question; All Text and All Code (prompted to answer only in text, or only in code); All Code + CoT (chain of thought, then code); AutoGen's system prompt appended to the question (AutoGen Conca.) or used as the system prompt (AutoGen System); Code Interpreter.
- **Three proposed methods (§3.4, App. H):** Code Interpreter+, CI given the All Code prompt; Code + Text + Sum., in which the same LLM, prompted as a summarizer, reads an All Text and an All Code answer and is told to "try to choose the best answer and propose a new one" if it thinks both answers are wrong; Self-estimate Score, which asks the model to score its confidence (0–10) in solving by code and by text and start with the clearly higher one, or with text when the two are close (App. H).
- **Multi-turn refinement (§3.4):** after a response with code, the code is run and the results returned "for further self-reflection and refinement"; a response without code gets its own answer back. It stops at a 'Terminate' signal or the turn limit.
- **Costs (§3.5):** tokens and runtime per method.

## Results

- **CI and complexity (§2.1, Figs. 2–3):** GPT-4o with CI answers small multiplications in text and very large ones in code; on medium ones it "tends to be overconfident" and answers in text, "which sometimes is wrong".
- **Inverse scaling (§2.2, Figs. 3–4):** with CI, GPT-4o-mini and GPT-3.5 "achieve 100% success rates across all the task complexity" on Number Multiplying, and on Game 24 they use code in most cases and "notably outperform GPT-4o", "especially when task complexity is high". GPT-3.5 beats GPT-4o-mini on Game 24; the authors say GPT-4o-mini writes text-like code more often (Fig. 5).
- **Asking for code (§2.3, Fig. 6; Tab. 1):** prompting for code "performs just as poorly, or even worse, than" prompting for text on Game 24. GPT-4o on Game 24: All Text 23%, All Code 5%, AutoGen Conca. 88% (Tab. 1).
- **No single best method (§3.2; Tabs. 1–2, 7–12):** among the seven baselines none "always performs better than others for all the tasks", for all six models.
- **Why code loses (§3.3):** "Writing correct code is tough in certain tasks" (e.g. BoxLift; App. F), and "The coding format will limit the space of generated tokens", hurting e.g. Date Understanding (App. G).
- **Proposed methods (§3.4, Tab. 2):** Code + Text + Sum. has the best average score and average rank over all ten methods, 79.5 and rank 2.50, against All Code's 77.2 and 3.33. It beats both All Text and All Code in 4 of the 6 LLMs, not in GPT-3.5 or O1-preview.
- **Multi-turn (§3.4, Fig. 7, Tab. 3; Tab. 4):** all methods converge at turn 2, "when the LLM stops iterating or repeats the same answer". For GPT-4o and GPT-4o-mini, the methods that mostly answer in code (Tab. 3) "tend to improve", "likely because code execution provides additional feedback for reflection", while the decline of the text-based ones "suggests that LLMs can worsen answers through self-reflection alone". For GPT-3.5 all degrade. In Tab. 4's average score, All Code goes from 77.2 at turn 1 to 78.6 at turn 2.
- **Costs (§3.5, Fig. 8, Tab. 4):** Code + Text + Sum. and multi-turn All Code score higher but cost more tokens and time; Code + Text + Sum. averages 3679.8 tokens against 682.5 for All Code (Tab. 4).
- **Prompt ablations (§3.6, App. K, Tabs. 5–6):** other code-requesting prompts, the agent prompt of CAMEL (another multi-agent framework) and a paraphrased AutoGen prompt give "nearly identical performance" or slightly lower scores and leave the conclusions unchanged.

## Limits the authors state

- The proposed methods "are limited by the LLM's inherent capabilities and the frequency of code usage, which in turn increases runtime costs and token lengths" (§1 item 4); their effectiveness "depends largely on the capability of the LLMs" (§3.4).
- Code + Text + Sum. "may not achieve higher scores in GPT-3.5 because this LLM lacks the ability to effectively distinguish between better code or text-based answers", and might underperform in O1-preview (§3.4).
- GPT-3.5 "is not capable enough for self-reflection and refinement" (§3.4).
- "We still need a more efficient method that improves performance with fewer resources" (§3.5).
- That GPT-4o uses code only at very high Game 24 complexity rests on "additional tests (not included in the paper)" (§2.2).
- Some settings are "not tested due to LLM limitations" (Tab. 1 caption): CI on the models without it, and AutoGen System on O1-preview (§3.1).

## Open problems and building blocks

  - The authors see "a large potential for developing a method that can intelligently decide when to use code or text based on the input question" (§3.2).
  - "whether more delicate multi-agent frameworks" can improve on Code + Text + Sum. "while controlling the costs" (§4).
  - "whether we can build an extra scoring model or train the LLM to learn when to use code/text more effectively" (§4).
- **Released:** "Project Page, Datasets, and Codes are available at" a project page (abstract).
- **To reuse it:** code solutions use Python "as the default language" and "avoid special packages to ensure consistency across different execution environments" (§3.1); code runs under a 30-second limit, and answer checking uses GPT-4o for format adjustment (§3.1); CI needs a GPT model that offers it (§3.1); runtimes were measured on one Intel 16-core CPU (§3.5).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
