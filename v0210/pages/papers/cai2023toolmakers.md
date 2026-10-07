# Large Language Models as Tool Makers

**Large Language Models as Tool Makers** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2305.17126) · [arXiv](https://arxiv.org/abs/2305.17126)  
Code: [LLM-ToolMaker](https://github.com/ctlllll/LLM-ToolMaker)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A strong model writes a reusable Python function (a tool) for a class of tasks; a lighter model solves each instance by calling it (abstract).
- The tool maker proposes the tool from a few demonstrations, retrying when it fails to run, then checks it with unit tests on validation samples (a failed test fixes the test's calls, not the tool) and wraps it with call demonstrations for the user (§3.1).
- Frontier writes, compact uses, with a programmatic check: the authors report GPT-3.5 Turbo with GPT-4's tools performing on par with GPT-4 in both roles (abstract; §5.3, Tab. 2). The artifact is code, not a prompt.

## In plain words

LLMs can solve more with external tools, but the authors argue that tool use is "largely contingent on the availability of suitable tools" and, inspired by human tool-making, let the model write its own (§1). In their framework, LATM, a strong, expensive model (GPT-4) writes one reusable Python function for a type of task from a few solved examples, tests it on a few more, and packages it with examples of how to call it; a cheaper model (GPT-3.5 Turbo) then answers each new question by writing a call to that function (§3). A third, cheap model can route a stream of requests to stored tools or to new tool-making; they call the store of reusable tools a functional cache (§4). On six reasoning tasks, with GPT-4's tools, they report GPT-3.5 Turbo performing on par with GPT-4 in both roles, and well above GPT-3.5 Turbo with chain-of-thought or plain few-shot prompting, at much lower cost (abstract; §5.3). They call the work "an initial exploration" (§1).

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) (tool proposing follows the "programming by example" paradigm, §3.1); other glossary entries don't fit.

**The paper's own terms:**
- **LATM**: "LLMs As Tool Makers", the framework (abstract).
- **tool**: an LLM-written Python function that solves the instances of one type of task (abstract; §3.1).
- **tool maker**: the LLM that writes, tests and packages a tool; **tool user**: the LLM that turns each question into a call to the tool, and "can be either the same or a different LLM from the tool maker" (abstract).
- **wrapped tool**: the tool user's prompt: the function plus demonstrations of converting a question into a function call (§3.1; examples in App. D).
- **dispatcher** and **functional cache**: a lightweight LLM that matches each incoming request to a stored tool or flags it as a new task (§4); the store of tools it consults "stores the functionality of a class of requests instead of the natural language responses from LLMs" (abstract), unlike caches such as GPTCache that reuse responses for "textually" similar requests (§1).

**Missing glossary terms:** none.

**Builds on:**
- Tool-augmented LLMs such as ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), Toolformer and TALM; the authors "further advance this concept" (abstract; §1, §2). Chameleon also runs Python, but its "primary focus" is solving arithmetic sub-steps, as in PAL and Program of Thoughts; LATM makes tools reused across instances (§2).
- Chain-of-thought prompting (Wei et al.), the main baseline, with demonstrations from Suzgun et al. for four tasks (Tab. 2).
- Concurrent tool-making: Voyager, an LLM agent in Minecraft that acquires skills as programs, and CREATOR, which splits each instance into creating an abstract tool and applying it; the authors stress "tool reusability and cost-effectiveness stemming from the division of labor" (§2).
- Language-model cascades combining several LLMs, including FrugalGPT, which shows that identifying optimal LLM combinations "can help reduce costs while improving accuracy" (§2).

## Problem and setting

- **Question:** can LLMs make their own reusable tools, and can an expensive tool maker plus a cheap tool user keep accuracy while cutting serving cost (§1)?
- **Tasks:** six, each split into 3 training, 3 validation and 240 test instances (§5.1). Five are from BigBench (a large collection of LLM test tasks): Logical Deduction (order five objects from conditions, Fig. 3), Tracking Shuffled Objects (follow five objects through swaps), Dyck Language (bracket sequences), Word Sorting and Chinese Remainder Theorem (number puzzles about remainders). The authors built Schedule Meeting (earliest time slot fitting two people's availability) from a template (App. E).
- **Models:** tool making with GPT-4 or GPT-3.5 Turbo at temperature 0.3, keeping the whole chat history, with at most 3 retries for proposing and for verification; tool using is one call at temperature 0.0; GPT-3 models appear as tool users in an ablation (§5.1).
- **Correctness:** accuracy on the test instances; the generated call is executed, and "Optionally" post-processed into the answer format, such as a multiple-choice option (§3.1).
- **Scope:** a task type that one function can solve; the tool maker is asked for "only standard python libraries" (App. C).
- Which of the tool-making trials' tools the main results use, and how results vary across tools, is not discussed.

## Approach

- **Tool proposing (§3.1):** the tool maker writes a Python function that solves the demonstrations (3 in their experiments); if it is "unexecutable or encounters errors", the error goes into the history and it tries again.
- **Tool verification (§3.1):** the tool maker writes unit tests from 3 validation samples (parse the question into arguments, call the tool, assert the given answer; App. C) and runs them. On failure it fixes the tests only: this "will only correct the function calls in the unit test part and will not correct the function". The stage provides call examples and checks the tool's reliability, "enabling the entire process to be fully automated".
- **Tool wrapping (§3.1):** if execution or verification fails "over a preset threshold", tool making has failed; otherwise the function and the call examples from the unit tests become the wrapped tool.
- **Tool using (§3.1):** the cheap model writes each call by in-context learning from the wrapped tool, and the call is run. Tool making happens once per task type, so for n samples Tab. 2 gives a cost of order n·c + C with GPT-3.5 Turbo as tool user, against n·C with GPT-4, where C and c are the costs of one GPT-4 and one GPT-3.5 Turbo call and "C is over 15x larger than c" at the time of writing (Tab. 2 caption).
- **Tools made (Tab. 1, App. D):** GPT-4 wrote, for instance, a search over all orderings for Logical Deduction, a stack for Dyck Language, and interval intersections for Schedule Meeting.
- **Functional cache (§4; Fig. 4, App. A):** the dispatcher keeps tool descriptions; a request a tool fits goes to the tool user with that tool. Otherwise it is a new task, solved "with a powerful model or, if necessary, invoking a human labeler", and such instances are cached "until a sufficient number are amassed to craft a new tool" (§4).

## Results

- **Main comparison (§5.3, Tab. 2):** accuracy (%), GPT-4's tools, tasks in the order above. GPT-3.5 Turbo, chain of thought → LATM: 66.4 → 79.7, 61.6 → 99.6, 20.4 → 92.2, 59.2 → 98.3, 0.0 → 100.0, 18.9 → 100.0. GPT-4, chain of thought: 88.8, 100.0, 63.6, 90.9, 0.0, 55.6; GPT-4, LATM: 86.6, 100.0, 87.5, 99.1, 100.0, 100.0. The last two baselines are "direct few-shot prompting without CoT" (Tab. 2 caption). The authors conclude GPT-3.5 Turbo with the tool "can achieve performance on par with GPT-4" (§5.3); on Dyck Language GPT-4 as tool user "occasionally superfluously closes some brackets" in the argument (§5.3).
- **Verification (§5.2):** mainly a source of call examples; the authors "only observe 2 cases out of the 60 trials" where the tool maker corrected its mistakes from error messages.
- **Dispatcher (§5.4), GPT-3.5 Turbo:** choosing the right tool for 100 requests mixed from the six tasks, 95% ± 2% over five random test sets; deciding between a stored tool and new tool-making, with two of four test tasks unseen, 96% ± 3% "Over multiple runs".
- **Tool maker (§5.5, Tab. 3):** in 5 trials per task, GPT-3.5 Turbo made no valid tool for Logical Deduction, Tracking Shuffled Objects and Schedule Meeting, against 3/5, 4/5 and 3/5 for GPT-4; both succeeded 5/5 on the other three. For GPT-3.5 Turbo on hard tasks, the "major failure reason" is a tool "not general enough" that "may only work on the training samples" (§5.5).
- **Tool user (§5.5, Tab. 4):** with GPT-4's tools, GPT-3.5 Turbo "offers the best balance between performance and cost" of the models tested (text-davinci-002 and the GPT-3 models davinci, curie, babbage, ada). The authors found GPT-3 models before instruction tuning "often perform better" than their instruction-tuned versions; they hypothesize instruction tuning "may adversely impact the in-context learning ability".
- **Chain of thought instead of a tool (§5.5, Tab. 5):** GPT-3.5 Turbo given GPT-4's zero-shot chain of thought scores 36.8 and 63.2 on Logical Deduction and Tracking Shuffled Objects, against 66.4 and 61.6 with human-written chain of thought and 79.7 and 99.6 with LATM.

## Limits the authors state

- "we have not addressed these control and safety issues in depth"; made tools "may not always meet the standards or expectations set by human developers", and without safeguards models "could generate solutions that are suboptimal, incorrect, or even potentially harmful" (App. B).
- The framework, "while effective in the tested scenarios, is still in its early stages of development"; "the real-world performance and safety of the system may vary based on the complexity and nature of the tasks it is applied to" (App. B).
- Evaluating and validating made tools "in a real-world setting is a challenge that needs to be addressed" (App. B).
- GPT-3.5 Turbo as tool maker fails all 5 trials "on hard tasks like Logical Deduction and Tracking Shuffled Objects" (§5.5, Tab. 3); "the context length constraints" may also contribute to failures, since the whole history is kept; in that case "GPT-4 with 8192 context length is preferable" (§5.5).

## Open problems and building blocks

- **Open:** "a significant lack of high-quality datasets that authentically represent daily human-computer interactions", such as scheduling meetings or booking flights, which the authors hope the community will create; and, as future work, letting the tool maker "refine and upgrade existing tools to manage new problem instances" (§6).
- **Released:** the codebase (abstract).
- **To reuse it:** a strong tool maker (GPT-4; GPT-3.5 Turbo sufficed for easy tasks such as Word Sorting, §5.5), a tool user with in-context learning ability (§5.5), a Python executor, and 3 training plus 3 validation examples per task type (§5.1).
- **Beyond its domain:** the authors say the paradigm "can similarly be applied to recurring tasks in various workflows", such as parsing web documents into data formats, route planning under custom requirements, or games like the 24-game and Sudoku (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
