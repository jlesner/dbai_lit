# Language Models as Higher-Order Planning Formalizers

**Language Models as Higher-Order…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.23844) · [arXiv](https://arxiv.org/abs/2603.23844)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks whether LLM formalizers, which translate a natural-language planning problem into PDDL for a classical planner, keep scaling when a short description denotes a very large planning instance ("unraveling problems"), and proposes the higher-order formalizer: the LLM writes a program (Python in the experiments) that, when run, emits the PDDL problem file, which then goes to the planner (abstract; §1; §3.1; §3.3).
- BlocksWorld-XXL (line-by-line descriptions, 5 to 100 blocks) and the Unravel benchmark (compact descriptions in BlocksWorld, OpenStacks, Transport and ChildSnack) (§2.2, §3.2); Gemini 3 Flash, DeepSeek-V4-Flash and Qwen2.5-Coder-32B-Instruct as planner, formalizer and higher-order formalizer, scored by comparing the generated problem file with the ground-truth file, since the planner times out on large instances (§2.2, Fig. 5); a divide-and-conquer formalizer prompt for the Qwen model, and a second "pattern review" prompt for the higher-order formalizer, ablated with the Qwen model (§2.2, §3.3, §5, Fig. 6).
- Evidence that handing the search to an engine moves the size problem into the formalization the LLM must write out: the authors report that formalizers "do not always scale" on compact descriptions, degrading or fluctuating in BlocksWorld and Transport, while the generator-program formalizer "matches or outperforms Formalizer in nearly all cases" (abstract; §4, Fig. 5). Correctness is judged by the authors' own parsers, which match the generated problem file against the ground-truth one, adopted because the planner times out as problems grow (§2.2; §3.3; App. E).

## In plain words

An LLM can solve a planning problem (finding a sequence of actions that reaches a goal) in two ways: write the plan itself, or translate the problem description into PDDL, a standard planning language, and let a classical planner search for the plan. The authors argue that the second way, the "Formalizer", may look better than it is, because standard benchmarks often map each sentence of a description to about one line of PDDL, while real descriptions can be short and denote huge problems: one sentence about 10,000 blocks becomes tens of thousands of lines (abstract; §1). They build such "unraveling" problems in four planning domains and report that Formalizers "do not always scale" on them (abstract). Their fix, the Higher-Order Formalizer, has the LLM write a Python program that prints the PDDL file, so the LLM's output can stay short (abstract; §3.1). On their benchmark, they report, Gemini 3 Flash and DeepSeek-V4-Flash then "scale nearly perfectly", and an open 32B Qwen model improves "in most cases" (§1). They present it as "a new planning paradigm" (§1).

## Background and terms

**Terms to know:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [autoformalization](#/glossary/autoformalization) · [test-time scaling](#/glossary/test-time-scaling) · [grounding and lifted planning](#/glossary/grounding-and-lifted-planning) (a lifted planner as one way to expand an H-O program, §3.1, §8). In the glossary's terms, the Formalizer is autoformalization into a planner's input, and the paper's "inference-time scaling" (§2.1) is test-time scaling.

**The paper's own terms:**
- **LLM-as-Planner**: the LLM writes the action sequence directly from the domain and problem descriptions (§1, §2.2).
- **LLM-as-Formalizer**: the LLM writes the PDDL problem file (objects, initial state, goal); a planner finds the plan. The PDDL domain file (the actions, with their preconditions and effects) is given (§2.2).
- **LLM-as-Higher-Order-Formalizer (H-O Formalizer)**: the LLM writes a program, in Python here, whose run emits the PDDL problem file (§3.1, §3.3).
- **Unraveling problem**: one whose description is succinct while the planning instance it denotes is "significantly larger" (§3.1).
- **Ground fluents**: the true-or-false facts about specific objects ("block 3 is on top of block 5", Listing 6), from which states are built (§2.1).
- **The spaces of a planning instance** (§2.1, Fig. 2): fluents, grounded actions (actions applied to specific objects), states, the search space (states linked by actions) and plans; each paradigm, the authors argue, makes the LLM generate tokens "tantamount to the complexity of different spaces" (Fig. 2 caption).
- **LRM** (large reasoning model): LLMs "trained to scale their reasoning trace" (§1).
- **Divide-and-conquer (D&C)**: one call writes the problem file's header and objects; then each sentence of the description is given alone, with the domain, and the LLM writes one PDDL line for it; the lines are merged (§2.2).
- **Pattern review**: the H-O Formalizer's second prompt, which asks the LLM to review the loops in its draft generator and regenerate it (§3.3; Listing 25).
- **Batch**: the 10 problems made for each size in each domain (§3.2).

**Missing glossary terms:** none.

**Builds on:**
- Huang and Zhang (2025), "On the limit of language models as planning formalizers": the task formulation, and the BlocksWorld dataset the authors extend (§2.2; App. D).
- Huang et al. (2025) and Kagitha et al. (2025a): the Formalizer's effectiveness on standard benchmarks (§1).
- Kagitha et al. (2025b), code as an intermediate representation for PDDL formalization; Stein et al. (2026) and Silver et al. (2023), LLM-written code that produces plans, where this paper's code formalizes the environment instead (§6).
- Li et al. (2026), the one exception the authors name to "no work has been done on unraveling problems" (§6).

## Problem and setting

- **The question:** do LLM Formalizers keep scaling when a compact description denotes a large instance, and does writing a generator program instead help (§1)?
- **Task** (§2.2): from a domain specification (natural language and PDDL) and a problem description, output a plan, validated by simulation; the domain is fixed and given.
- **Checking:** the planner `dual-bfws-ffparser` from Planning.Domains (an online collection of planning tools) (Muise, 2016) and the plan validator VAL (§2.2). Because the planner times out on large problems, the authors' own parsers compare the generated problem file with the ground-truth one: the problems being always solvable, a perfect match of objects, initial state and goal counts as a valid plan, any mismatch as invalid (§2.2; App. E). The metric is plan accuracy, "the percentage that can be executed to achieve the goal state" (§2.2). How a correct file written differently (other object names) is treated: not discussed.
- **BlocksWorld-XXL** (§2.2; App. D): BlocksWorld (rearranging stacks of blocks), 200 problems of 5 to 100 blocks with "moderately templated", line-by-line descriptions.
- **Unravel** (§3.2): 280 problems in four domains of the International Planning Competition: BlocksWorld, OpenStacks (customer orders that each need products, with stacks opened to fill them; Listing 16), Transport (vehicles with a capacity carrying packages between locations; Listing 20) and ChildSnack (making sandwiches, some gluten-free, and serving them to children by tray; §3.2). Sizes run from 5 to 100 (Transport: 10 to 100 locations), 10 problems per size; one main parameter varies, the others are fixed at "low-medium-level difficulty" (§3.2; Tab. 1). Goals are still randomized and listed one by one; only the initial-state part of the description stays constant in size (§3.2).
- **Models** (§2.2): Gemini 3 Flash (G3F, a closed LRM), DeepSeek-V4-Flash (DS-V4, an open LRM) and Qwen2.5-Coder-32B-Instruct (Q25, an open non-reasoning LLM; "Qwen2.5-32B" in §1 and Fig. 5). Open models run with KANI (a toolkit for running LLMs) at default temperature on one H100 GPU.

## Approach

- **A size argument, not a theorem** (§2.1, Fig. 2). For a fixed domain whose predicates and actions have a fixed number of arguments, fluents and grounded actions grow polynomially with the number of objects, while states grow exponentially with the number of fluents and candidate plans exponentially with their length. A Planner must search within one inference pass, "often infeasible" say the authors; inference-time scaling, they argue, "changes the amount of search performed, not the nature of the search problem" (§2.1). A Formalizer writes only fluents, polynomially many, and leaves the search to the planner (§2.1), but in an unraveling problem it "must still explicitly emit polynomially many facts from the compact description" (§3.1). An H-O program can stay small even when the instance is large (§3.1).
- **H-O Formalizer** (§3.3). The LLM gets the natural-language domain and problem descriptions, the ground-truth PDDL domain file and the authors' "proprietary H-O Formalizer prompts", and writes a Python program that produces the PDDL problem file when run. The prompt requires that facts be derived "algorithmically from compact structure, not hardcoded full fact lists" and shows an example generator (Listing 25). A second prompt has the LLM review the repeating patterns in its draft before finalizing (pattern review); Planner and Formalizer get one prompt each (§3.3). The authors' rationale: the Formalizer "can be seen as" relying on code execution, which needs state tracking and is "more demanding than code generation" (§1).
- **Building Unravel** (§3.2, Figs. 3–4): one easily described scenario per domain; rotation rules help keep a batch's problems distinct.

## Results

- **BlocksWorld-XXL** (§2.2, Fig. 5a). The authors report that all three models fall to 20% accuracy or worse as Planners at 30 blocks. As Formalizers, G3F stays at 100% up to 100 blocks, while Q25 "remains above 70% until 80 blocks but sharply degrades thereafter". Q25's errors are most often extra initial conditions and missing goals. D&C raises Q25 as Formalizer from 30% to 100% at 100 blocks.
- **Unravel** (§4, Fig. 5b–e; the PDF prints no value labels). Planners score near zero except G3F and DS-V4 in OpenStacks, which mainly use brute force. The Formalizer "fluctuates or degrades" in BlocksWorld and Transport, where the H-O Formalizer outperforms it; in OpenStacks and ChildSnack, Formalizers with G3F and DS-V4 stay robust and the H-O Formalizer matches them. Overall, "H-O Formalizer matches or outperforms Formalizer in nearly all cases" (§4).
- **Larger Formalizer tests** (§4). At 300 orders in OpenStacks, G3F and DS-V4 keep 90% and 100%, and at 300 children in ChildSnack 80% and 90%. At 1,000, only DS-V4 completes the OpenStacks problems, with 70%. The authors read this as "likely true scalability" (§4).
- **Pattern review with Q25** (§5, Fig. 6). In an error analysis of the version without the review (at most 10 errors from two random batches per domain), errors concentrate in a few spots: in OpenStacks mostly the loop listing each order's products, in Transport the object-type listing and the loops assigning packages and capacities, in ChildSnack the loop assigning children their waiting places (§5; Listings 1–3). With the review, Q25 rises from 45% to 55% on OpenStacks, 66% to 87% on Transport and 23% to 41% on ChildSnack (Fig. 6).

## Limits the authors state

- Only classical symbolic planning with fixed domain specifications; they name extending unraveling problems to "partially observable, stochastic, temporal, or multi-agent domains" as future work (§8).
- The H-O Formalizer relies on Python generator programs and handcrafted prompts, including the pattern-reflection stage, and "does not yet explore whether the generated higher-order representations are optimal, minimal, or transferable across domains"; future work may study "more principled intermediate representations, learned compilation strategies, or tighter integration between higher-order formalization and lifted planning systems" (§8).
- The planner times out on large problems, so Formalizer results rest on comparing files with the ground truth (§2.2; App. E).
- Parameters other than the main one are fixed, to study one at a time (§3.2).
- Formalizer performance "starts to decline slightly as the problems become extremely large" (§4).
- Each experiment is run once; the authors' reason is that each result only takes extreme values, all or nothing (App. H).
- Formalizer methods "may still experience issues like hallucination, especially if they are applied in the real world" (App. F).

## Open problems and building blocks

- **Open:** none stated beyond the two future directions attached to the limits of §8 (under Limits).
- **Released:** "Code and data attached with the submission." (abstract footnote).
- **To reuse it:** the ground-truth PDDL domain file, the natural-language domain and problem descriptions, a Python interpreter for the generator, the planner, VAL and the authors' parsers, and one H100 GPU for open models (§2.2, §3.3). The full prompts are Listings 21–34 (App. E). The authors say their "data creation process can be extended to any similar planning domain", and the dataset "can be expanded without costs" by changing the numbers in the descriptions (§3.2).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
