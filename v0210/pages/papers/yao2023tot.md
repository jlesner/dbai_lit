# Tree of Thoughts: Deliberate Problem Solving with Large Language Models

**Tree of Thoughts** · NeurIPS 2023

Read: [PDF](https://arxiv.org/pdf/2305.10601) · [arXiv](https://arxiv.org/abs/2305.10601)  
Code: [tree-of-thought-llm](https://github.com/princeton-nlp/tree-of-thought-llm)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Search over intermediate thoughts with self-evaluation, BFS or DFS.
- Deliberate search instead of left-to-right decoding.
- Search over partial generations; LITHE's MCTS does this at token level.

## In plain words

A language model writes its answer one token at a time, left to right. The authors argue that models therefore "can fall short in tasks that require exploration, strategic lookahead, or where initial decisions play a pivotal role" (abstract). They propose Tree of Thoughts (ToT): the model writes the solution in intermediate steps ("thoughts"), produces several candidates for each step, judges in words how promising each partial solution is, and a breadth-first or depth-first search uses those judgments to keep the best branches, look ahead and backtrack when necessary (abstract, §3). They test it with GPT-4 on "three novel tasks requiring non-trivial planning or search" (abstract): Game of 24 (an arithmetic puzzle), Creative Writing and 5×5 Mini Crosswords. On Game of 24, GPT-4 with chain-of-thought prompting solved 4% of games. ToT, keeping the 5 best candidates per step, solved 74% (abstract, Tab. 2). The authors present ToT as a framework that "generalizes over" chain of thought (abstract), and call using the model's own reasoning to guide the search "novel" (§1).

## Background and terms

**Terms to know:** [test-time scaling](#/glossary/test-time-scaling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [beam search](#/glossary/beam-search) · [pass@k](#/glossary/passk) · [self-correction](#/glossary/self-correction) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts)

**The paper's own terms:**
- **thought**: "a coherent language sequence that serves as an intermediate step toward problem solving" (§1): a line of equation, a writing plan or a couple of words, by task (§3, Tab. 1).
- **state**: a tree node, the input plus the thoughts so far, "representing a partial solution" (§3).
- **thought generator**: makes k candidate next thoughts, by *sampling* them independently, which "works better when the thought space is rich", or by *proposing* them in one call, when the space is "more constrained" (§3).
- **state evaluator**: the model judges states by *value* (each alone, as a score or a class such as sure/likely/impossible) or by *vote* (compare states, vote for the most promising) (§3). It is the search's **heuristic**, deciding "which states to keep exploring and in which order" (§3).
- **b**: the breadth limit, states kept per step in breadth-first search (also "beam size", App. B.3); **T**: the step limit (§3).
- **IO prompting**: plain input-output prompting with instructions and/or few-shot examples; **CoT-SC**: self-consistency over chains of thought (§2).
- **best of k**: an "oracle setup" that scores the best of k IO or CoT samples (§4.1); in the glossary's terms, pass@k.
- **IO + Refine**: up to 10 rounds asking the model, when its output is wrong, to "reflect on your mistakes and generate a refined answer", which "uses groundtruth feedback signals" (§4.1); in Creative Writing, up to 5 rounds without ground truth (§4.2). A form of self-correction.
- **System 1 / System 2**: from "dual process" models of cognition, a fast automatic mode and a slow deliberate one; the authors liken token-level choices to System 1 (§1).

**Builds on:**
- Chain-of-thought prompting, Wei et al. [38] (§2), which ToT "generalizes over" (abstract).
- Self-consistency, Wang et al. [36] ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), the baseline CoT-SC (§2).
- Newell, Shaw and Simon's view of problem solving as "search through a combinatorial problem space, represented as a tree" (§1; [21, 22]).
- Related tree searches they name (§5): RAP, Hao et al. [9], "a concurrent work" with "a MCTS-based method similar to ToT", and "self-eval guided decoding", Xie et al. [39], a work "very relevant to ours" that "also follows a tree-search procedure" but represents thoughts as code.

## Problem and setting

The paper asks: "Is such a simple mechanism sufficient for a LM to be built toward a general problem solver?" (§1).

Setting (§4): GPT-4 in Chat Completion mode at temperature 0.7, "Unless otherwise stated". Three tasks (Tab. 1), tested on 100, 100 and 20 instances:
- **Game of 24 (§4.1):** reach 24 from 4 numbers with + − × ÷; 100 "relatively hard" games from 4nums.com; success is a valid equation equal to 24 using each number exactly once. IO and CoT are averaged over 100 samples per game; baselines include CoT-SC, IO + Refine and the best-of-k oracle.
- **Creative Writing (§4.2):** from 4 random sentences, write a coherent 4-paragraph passage whose paragraphs end in them; 100 inputs, no ground truth. Coherency is scored 1–10 by a zero-shot GPT-4 prompt, and compared pairwise (CoT against ToT) in a blind study by "a subset of the authors".
- **Mini Crosswords (§4.3):** fill a 5×5 grid from 10 clues; 20 test games from GooBix; success counted for letters, words and whole games.
- **Extra (App. B):** GPT-3.5-turbo on Game of 24 and Creative Writing; 100 questions each from GSM8K (grade-school math word problems, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")) and StrategyQA (yes/no questions, App. B.1).

## Approach

- **Four design questions (§3):** how to split the process into thoughts, generate candidates, evaluate states, and search. IO, CoT, CoT-SC and self-refinement "can be seen as special cases of ToT", and "No extra training is needed, just a pre-trained LM is sufficient" (§3).
- **Breadth-first search (Alg. 1, §3):** extend every kept state, evaluate the candidates, keep the b best; after T steps, generate the output from the best state. Used for Game of 24 and Creative Writing, where the tree is shallow (T ≤ 3) and early steps can be pruned to a small set (b ≤ 5).
- **Depth-first search (Alg. 2, §3):** explore the most promising state first until an output is reached or the evaluator deems the problem impossible to solve from the state, which prunes that subtree; in both cases it backtracks to the parent.
- **Game of 24 (§4.1, Fig. 2):** three thoughts, each an equation; a propose prompt lists next steps, the model rates each "sure/maybe/impossible" for reaching 24 (3 samples), and breadth-first search keeps b = 5.
- **Creative Writing (§4.2, Fig. 4):** write 5 plans, vote 5 times for the best, then write 5 passages from it and vote again; b = 1.
- **Mini Crosswords (§4.3, Fig. 6):** depth-first search over words; filled words become letter constraints for the other clues, proposals with confidences are merged into a sorted list, and a state is pruned when any remaining clue is deemed "impossible" to fill. After 100 steps it outputs the deepest explored state.

## Results

Each is the authors' claim, with GPT-4 unless stated.
- **Game of 24 (Tab. 2):** success IO 7.3%, CoT 4.0%, CoT-SC 9.0%, IO + Refine 27%; ToT 45% with b = 1 and 74% with b = 5. The best-of-100 oracle reaches 33% (IO) and 49% (CoT), "still much worse than exploring more nodes in ToT" with b above 1 (§4.1, Fig. 3(a)).
- **Where CoT fails (Fig. 3(b)):** "around 60% of CoT samples already failed the task after generating the first step", which "highlights the issues with direct left-to-right decoding" (§4.1).
- **Creative Writing (§4.2, Fig. 5):** mean GPT-4 coherency score ToT 7.56, CoT 6.93, IO 6.19; the human judges preferred ToT in 41 of 100 pairs, CoT in 21, and found 38 "similarly coherent". Iterative refinement raises the scores of both IO and ToT.
- **Mini Crosswords (Tab. 3):** word-level success under 16% for IO and CoT, 60% for ToT, which solves 4 of 20 games; outputting the oracle best state solves 7 of 20. Without pruning, performance is "generally worse"; without backtracking it "performs poorly" (§4.3).
- **Other models and tasks (App. B):** "ToT improves over CoT on both tasks (but only slightly" on GSM8K and StrategyQA (App. B.1, Tab. 4). With GPT-3.5, ToT on Game of 24 is "far worse than" with GPT-4, and runs mixing the two models suggest "the game's bottleneck is thought generation" (App. B.2; GPT-3.5 alone in Tab. 5). On Creative Writing, GPT-3.5 with ToT beats GPT-4 with IO and is "similar to GPT-4+CoT" (App. B.2, Tab. 6).

## Limits the authors state

- "Deliberate search such as ToT might not be necessary for many existing tasks that GPT-4 already excels at" (§6); on GSM8K and StrategyQA the gain is slight, and "StrategyQA's bottleneck is external knowledge, not reasoning" (App. B.1).
- "as an initial step this work only explores three relatively simple tasks that challenges GPT-4" (§6).
- ToT "requires more resources (e.g. GPT-4 API cost) than sampling methods in order to improve task performances" (§6), and "could require 5-100 times more generated tokens than CoT", depending highly on the prompts and search algorithms (App. B.3).
- In Crosswords, sometimes when a game is actually solved, the evaluator "might still deem some words as 'impossible' and prune", possibly because of "some rare or obselete words that GPT-4 cannot recognize" (§4.3).
- The GPT-4 coherency score "might be noisy" (§4.2).
- Future applications that interact with environments or humans "could bring potential danger" (§ "Broader Impact").

## Open problems and building blocks

  - more advanced search algorithms, such as A* and MCTS, are left "for future work" (§3);
  - fine-tuning LMs with "ToT-style high-level counterfactual decision making" (§6);
  - "better heuristics for DFS pruning are critical for problem solving in this case", and "our simple output heuristics can be readily improved" (§4.3);
  - refining old thoughts as "a third approach to thought generation" (§4.2);
  - external retrieval or web interaction "could augment LM for problem solving under knowledge uncertainty" (§4.3, footnote);
  - efficiency: "BFS could early stop when solution is found" (App. B.3), and separate models for generation and evaluation "might attain decent results while reducing costs" (App. B.2).
- **Released:** "All code is available", with all prompts and trajectories (App. A; abstract).
- **To reuse it:** a pre-trained LM, "No extra training is needed" (§3); the prompts are in the code release (App. A). The main Game of 24 and Creative Writing ToT runs cost "around" 106 dollars, and the Crosswords runs "should be also within" 100 dollars (App. B.3). For GPT-3.5, the Game of 24 proposal prompt went from 1-shot to 3-shot "to make it work" (App. B.2).
- **Beyond its domain:** "we believe applying ToT to new tasks could be straightforward" (App. B.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
