# Language Models as Higher-Order Planning Formalizers

**Language Models as Higher-Order…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.23844) · [arXiv](https://arxiv.org/abs/2603.23844)  
Code: [formalizer-scaling](https://github.com/oj79/formalizer-scaling)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks whether LLM formalizers, which translate a natural-language planning problem into PDDL for a classical planner, keep scaling when a short description denotes a very large planning instance ("unraveling problems"), and proposes the higher-order formalizer: the LLM writes a program (Python in the experiments) that, when run, emits the PDDL problem file, which then goes to the planner (abstract; §1; §3.1; §3.3).
- BlocksWorld-XXL (line-by-line descriptions, 5 to 100 blocks) and the Unravel benchmark (compact descriptions in BlocksWorld, Elevators, Transport and ChildSnack) (§2.2, §3.2); Gemini 3 Flash, DeepSeek-V4-Flash and Qwen2.5-Coder-32B-Instruct as planner, formalizer and higher-order formalizer, scored by comparing the generated problem file with the ground-truth file, since the planner times out on large instances (§2.2, Fig. 4); a divide-and-conquer formalizer prompt for the Qwen model, and a second review prompt for both formalizers, ablated for the higher-order one with the Qwen model (§2.2, §3.3, §5, Fig. 7).
- Evidence that handing the search to an engine moves the size problem into the formalization the LLM must write out: the authors report that formalizers "do not always scale" on compact descriptions, falling at the largest Elevators and Transport sizes even for frontier models, while the generator-program formalizer "outperforms Formalizer in nearly all domains" (abstract; §4, Fig. 4; v2's "fluctuates or degrades" in BlocksWorld was dropped, its frontier formalizers now scoring 100% there). Correctness is judged by the authors' own parsers, which match the generated problem file against the ground-truth one, adopted because the planner times out as problems grow (§2.2; §3.3; App. F; §8).

## In plain words

An LLM can solve a planning problem (finding a sequence of actions that reaches a goal) in two ways: write the plan itself, or translate the problem description into PDDL, a standard planning language, and let a classical planner search for the plan. The authors argue that the second way, the "Formalizer", may look better than it is, because standard benchmarks are small and often map each sentence of a description to about one line of PDDL, while real descriptions can be short and denote huge problems: one sentence about 10,000 blocks becomes tens of thousands of lines (abstract; §1). They build such "unraveling" problems in four planning domains and report that Formalizers "do not always scale" on them (abstract). Their fix, the Higher-Order Formalizer, has the LLM write a Python program that prints the PDDL file, so the LLM's output can stay short (abstract; §3.1). On their benchmark, they report, their best frontier models then "scale perfectly", and weaker models improve notably (§1). They present it as "a new planning paradigm" (§1).

## Background and terms

**Terms to know:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [autoformalization](#/glossary/autoformalization) · [test-time scaling](#/glossary/test-time-scaling) · [grounding and lifted planning](#/glossary/grounding-and-lifted-planning) (a lifted planner as one way to expand an H-O program, §3.1, §8). In the glossary's terms, the Formalizer is autoformalization into a planner's input, and the paper's "inference-time scaling" (§2.1) is test-time scaling.

**The paper's own terms:**
- **LLM-as-Planner**: the LLM writes the action sequence directly from the domain and problem descriptions (§1, §2.2).
- **LLM-as-Formalizer**: the LLM writes the PDDL problem file (objects, initial state, goal); a planner finds the plan. The PDDL domain file (the actions, with their preconditions and effects) is given (§2.2).
- **LLM-as-Higher-Order-Formalizer (H-O Formalizer)**: the LLM writes a program, in Python here, whose run emits the PDDL problem file (§3.1, §3.3).
- **Unraveling problem**: one whose description is succinct while the planning instance it denotes is "significantly larger" (§3.1).
- **Ground fluents**: the true-or-false facts about specific objects ("block 3 is on top of block 5", Listing 5), from which states are built (§2.1).
- **The spaces of a planning instance** (§2.1, Fig. 2): fluents, grounded actions (actions applied to specific objects), states, the search space (states linked by actions) and plans; each paradigm, the authors argue, makes the LLM generate tokens "tantamount to the complexity of different spaces" (Fig. 2 caption).
- **LRM** (large reasoning model): LLMs "trained to scale their reasoning trace" (§1).
- **Divide-and-conquer (D&C)**: one call writes the problem file's header and objects; then each sentence of the description is given alone, with the domain, and the LLM writes one PDDL line for it; the lines are merged (§2.2).
- **Pattern review** and **plain review**: a second prompt in which the LLM reviews and regenerates its draft: the H-O generator's loops, or the Formalizer's PDDL (§3.3; Listings 20 and 24; Fig. 4 legend).
- **Batch**: the 10 problems of one size in one domain (§3.2).

**Missing glossary terms:** none.

**Builds on:**
- Huang and Zhang (2025), "On the limit of language models as planning formalizers": the task formulation, and the BlocksWorld dataset the authors extend (§2.2; App. E).
- Huang et al. (2025) and Kagitha et al. (2025a): the Formalizer's effectiveness on standard benchmarks (§1).
- Kagitha et al. (2025b), code as an intermediate representation for PDDL formalization; Stein et al. (2026) and Silver et al. (2023), LLM-written code that produces plans, where this paper's code formalizes the environment instead (§6).
- Li et al. (2026), the one exception the authors name to "no work has been done on unraveling problems", set apart as about mixed-integer optimization (§6).

## Problem and setting

- **The question:** do LLM Formalizers keep scaling when a compact description denotes a large instance, and does writing a generator program instead help (§1)?
- **Task** (§2.2): from a domain specification (natural language and PDDL) and a problem description, output a plan, validated by simulation; the domain is fixed and given.
- **Checking:** the planner `dual-bfws-ffparser` from Planning.Domains (an online collection of planning tools) (Muise, 2016) and the plan validator VAL (§2.2). Because the planner times out on large problems, the authors' own parsers compare the generated problem file with the ground-truth one: the problems being always solvable, a perfect match of objects, initial state and goal counts as a valid plan, any mismatch as invalid (§2.2; App. F). The metric is plan accuracy, "the percentage that can be executed to achieve the goal state" (§2.2).
- **BlocksWorld-XXL** (§2.2; App. E): BlocksWorld (rearranging stacks of blocks), 200 problems of 5 to 100 blocks with "moderately templated", line-by-line descriptions.
- **Unravel** (§3.2): 270 problems in four domains of the International Planning Competition: BlocksWorld, Elevators (moving passengers between floors by slow and fast elevators; Listing 14), Transport (vehicles with a capacity carrying packages between locations; Listing 18) and ChildSnack (making sandwiches, some gluten-free, and serving them to children by tray; §3.2). Sizes run from 5 to 100 (Elevators: 10 to 100 floors; Transport: 10 to 100 locations), 10 problems per size; one main parameter varies, the others are fixed at "medium-level difficulty" (§3.2; Tab. 1). The authors say the input size stays constant as problems grow (§3.2).
- **Models** (§2.2): Gemini 3 Flash (G3F, a closed LRM), DeepSeek-V4-Flash (DS-V4, an open LRM, "re-routed to DeepSeek-V4.1-Flash since September 10, 2026" per a footnote) and Qwen2.5-Coder-32B-Instruct (Q25, an open non-reasoning LLM; "Qwen2.5-32B" in Fig. 4). Open models run with KANI (a toolkit for running LLMs) at default temperature on one H100 GPU.

## Approach

- **A size argument, not a theorem** (§2.1, Fig. 2). For a fixed domain whose predicates and actions have a fixed number of arguments, fluents and grounded actions grow polynomially with the number of objects, while states grow exponentially with the number of fluents and candidate plans exponentially with their length. A Planner must search within one inference pass, "often infeasible" say the authors; inference-time scaling, they argue, "changes the amount of search performed, not the nature of the search problem" (§2.1). A Formalizer writes only fluents, polynomially many, and leaves the search to the planner (§2.1), but in an unraveling problem it "must still explicitly emit polynomially many facts from the compact description" (§3.1). An H-O program can stay small even when the instance is large (§3.1).
- **H-O Formalizer** (§3.3). The LLM gets the natural-language domain and problem descriptions, the ground-truth PDDL domain file and the authors' H-O Formalizer prompts, and writes a Python program that produces the PDDL problem file when run. The prompt requires that facts be derived "algorithmically from compact structure, not hardcoded full fact lists" and shows an example generator (Listing 24). A second prompt has the LLM review the repeating patterns in its draft before finalizing (pattern review); "for fairness of comparison" the Formalizer also gets a second prompt, focused on PDDL errors; the Planner gets one prompt (§3.3; Listings 20–33). Rationale: the Formalizer "resembles code execution", which needs demanding state tracking; the H-O Formalizer uses code generation (§1).
- **Building Unravel** (§3.2, Fig. 3): one easily described scenario per domain; rotation rules keep a batch's problems distinct.

## Results

- **BlocksWorld-XXL** (§2.2, Fig. 4a). The authors report that all three models fall to 20% accuracy or worse as Planners at 30 blocks. As Formalizers, G3F stays at 100% up to 100 blocks, while Q25 "remains above 70% until 80 blocks but sharply degrades thereafter". Q25's errors are mostly extra initial conditions and missing goals. D&C raises Q25 as Formalizer from 30% to 100% at 100 blocks.
- **Unravel** (§4, Fig. 4b–e; the PDF prints no value labels). Planners score near zero. "H-O Formalizer outperforms Formalizer in nearly all domains, especially for more complex problems" (§4); in the plot data, G3F and DS-V4 score 100% at every size as H-O Formalizers, and fall at the largest sizes in Elevators and Transport as Formalizers.
- **Larger Formalizer test** (§4). At 300 children in ChildSnack, G3F and DS-V4 keep 80% and 90%; at 1,000 the models "are not able to complete the problems". The authors read this as "likely true scalability" (§4).
- **Tokens** (§4, Figs. 5–6; App. A, Fig. 8). With DS-V4, the Formalizer uses "1.5 to nearly 4 times more reasoning tokens" than the H-O Formalizer on larger ChildSnack and Elevators problems, the authors report, and the H-O Formalizer's stay low at every size.
- **Pattern review with Q25** (§5, Fig. 7). Without the review (at most 10 errors analysed, from two batches in two domains), errors concentrate in Transport in the object-type listing (Listing 1) and the loops assigning packages and capacities, in ChildSnack the loop assigning children their waiting places (Listing 2) (§5). With the review, Q25 rises from 40% to 46% on BlocksWorld, 6% to 13% on Elevators, 66% to 79% on Transport and 19% to 51% on ChildSnack (Fig. 7).

## Limits the authors state

- Accuracy comes from exact-match parsers, so the percentages "could represent stricter lower-bounds"; future work could allow more room for semantic correctness (§8).
- Only classical symbolic planning with fixed domain specifications; they name extending unraveling problems to "partially observable, stochastic, temporal, or multi-agent domains" as future work (§8).
- The H-O Formalizer relies on Python generator programs and handcrafted prompts, including the pattern-reflection stage, and "does not yet explore whether the generated higher-order representations are optimal, minimal, or transferable across domains"; future work may study "more principled intermediate representations, learned compilation strategies, or tighter integration between higher-order formalization and lifted planning systems" (§8).
- The planner times out on large problems, so Formalizer results rest on comparing files with the ground truth (§2.2; App. F).
- Parameters other than the main one are fixed, to study one at a time (§3.2).
- Each experiment is run once; the authors' reason is that each result only takes extreme values, all or nothing (App. I).
- Formalizer methods "may still experience issues like hallucination, especially if they are applied in the real world" (App. G).

## Open problems and building blocks

- **Open:** none stated beyond the future directions attached to the limits of §8 (under Limits).
- **To reuse it:** the ground-truth PDDL domain file, the natural-language domain and problem descriptions, a Python interpreter for the generator, the planner, VAL and the authors' parsers, and one H100 GPU for open models (§2.2, §3.3). The full prompts are Listings 20–33 (App. F). The authors say their "data creation process can be extended to any similar planning domain", and the dataset "can be expanded without costs" by changing the numbers in the descriptions (§3.2).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/offload">offload</a><a class="tag" href="#/tags/scaling">scaling</a></span>
