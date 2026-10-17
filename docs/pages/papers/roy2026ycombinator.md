# The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus

**λ-RLM ("The Y-Combinator for LLMs")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.20105) · [arXiv](https://arxiv.org/abs/2603.20105)  
Code: [lambda-RLM](https://github.com/lambda-calculus-LLM/lambda-RLM)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Replaces the open-ended loop of Recursive Language Models, in which the model writes Python in a REPL over a prompt stored as a variable, with a fixed library of typed combinators (Split, Peek, Map, Filter, Reduce, Concat, Cross) run by a deterministic executor; the LLM picks a task type from a menu once and is otherwise called on leaf chunks small enough for its context window, plus a final synthesis call for some task types (abstract; §3.1, Tab. 1; §3.2, Alg. 1–2; App. D).
- A planner fixes the split count, leaf size and composition operator before execution, and the authors prove termination, a call count, a cost bound, an accuracy lower bound and a cost-minimising split count under a simple cost model (§4, Thms. 1–4, Cor. 5; several of these don't hold as stated); nine open-weight models from 7B to 405B in three tiers, against direct calls and the original RLM, on four long-context tasks (S-NIAH, OOLONG, OOL-Pairs, CodeQA) derived from the RLM paper's suite (§5, Tabs. 2–3).
- Evidence that taking the control flow of long-input work away from model-written code, and giving it to a small fixed operator set, helps compact models most: the authors report wins in all 12 weak-tier cells against 6 of 12 strong-tier ones (§5.1, Tab. 6), that "An 8B model with λ-RLM matches a 70B model with Normal RLM" on average accuracy (§5.1 C2, Tab. 9), and that free-form code still wins 7 of 36 model-task cells, which "All involve either strong coding models (Llama-405B, Codestral-22B) or the CodeQA task" (§5.1, Tab. 8). The LLM writes no program here; a planner builds it (§3.2).

## In plain words

Long inputs such as long documents or whole codebases don't fit an LLM's fixed context window. Recursive Language Models (RLMs) keep the input outside the model, in a code interpreter, and let the model write code that cuts it up and calls the model again on the pieces. The authors argue that this open-ended loop makes execution "difficult to verify, predict, and analyse" (abstract). Their λ-RLM takes the code away from the model: a planner arranges a fixed library of pre-written operators that split, filter, recurse over and combine the input, and the model picks a task type from a menu and answers pieces small enough to read (§3). They prove that, under stated assumptions, it always stops and its calls and cost can be bounded before it runs (§4). With nine open models on four long-input tasks, averaged over input lengths, they report it beating the original RLM in 29 of 36 model–task pairs, and adding 21.9 accuracy points over RLM on Qwen3-8B (abstract; §5.1, Tab. 9). They present it as giving "formal guarantees absent from standard RLMs" (abstract).

## Background and terms

**Terms to know:** [F1 score](#/glossary/f1-score) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [least-to-most prompting](#/glossary/least-to-most-prompting) · [finite-state machine](#/glossary/finite-state-machine) · [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [lambda calculus and beta-reduction](#/glossary/lambda-calculus-and-beta-reduction) (§2) · [fixed-point combinator (Y combinator)](#/glossary/fixed-point-combinator-y-combinator) (§2, Def. 1) · [REPL (read-eval-print loop)](#/glossary/repl-read-eval-print-loop) (here holding the prompt and offering model sub-calls, §3.1)

**The paper's own terms:**
- **Normal RLM (P2)**: Zhang et al.'s system. Each turn the model writes code, a REPL holding the prompt runs it, and the output joins the history, until the code sets a final answer (§3.1, Eq. 3). In the glossary's terms, an [agent harness](#/glossary/agent-harness) (our bridge).
- **λ-RLM (P3)** is the authors' system; **Direct (P1)** feeds the whole prompt in one call and, past the window, truncates it or scores the run 0%, depending on the model (§5).
- **Combinator library** (§3.1, Tab. 1 Panel A): SPLIT (cut a string into k contiguous chunks), PEEK (a substring by position), MAP, FILTER, REDUCE (fold a list with a binary operator), CONCAT, CROSS (Cartesian product), and M, the model call, "the only neural primitive". Every combinator except M is "deterministic and pre-verified".
- **Task type, ⊕ and π** (Tab. 1 Panel B): six task types (search, classify, aggregate, pairwise, summarise, multi_hop), each with a fixed combinator chain π and a rule ⊕ for combining partial results, such as merging counts.
- **k\*, τ\*, d** (§4): the partition size (chunks per split, k\* ≥ 2), the leaf threshold (the largest piece handed to the model, τ\* ≤ K, the context window) and the depth d = ⌈log_k\*(n/τ\*)⌉ for an input of length n.
- **Cost function** (Def. 3, Eq. 1): C(n) = c_in·n + c_out·n̄_out, priced input plus expected output.
- **Accuracy decay** (Def. 4, Eq. 2): A(n) = A₀·ρ^(n/K), a peak accuracy A₀ times a "context-rot decay factor" ρ in (0, 1], once per window's worth of input: the paper's model of context rot.
- **A⊕** (§4, A5): "the probability that ⊕ preserves the correct answer given correct inputs".
- **Tiers** (Tab. 2): weak 7–8B; medium 32B, 70B and Mixtral-8x22B; strong 235B, 405B and the code model Codestral-22B.

**Missing glossary terms:** none.

**Builds on:**
- Recursive Language Models, Zhang et al. (2026), [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)"): the "most direct predecessor" (§6), the main baseline, and the source of the tasks and the baseline's prompts (§5).
- "Least-to-Most" prompting (Zhou et al., 2023) and "Tree-of-Thoughts" (Yao et al., 2023a, [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")), the "lineage of hierarchical prompting strategies" it follows (§6).

## Problem and setting

The question is whether "a restricted, typed functional runtime provides a more reliable and efficient foundation for long-context reasoning" (§5). Hypotheses: "formal control structures can effectively substitute for raw model parameter scale", and one deterministic chain cuts latency and its variance (§5).

- **Models** (Tab. 2): open-weight, "served via vLLM" (an LLM serving engine), windows of 32K–128K; one model is both root and leaf (§5).
- **Tasks** (Tab. 3), "derived from" Zhang et al. (2026): S-NIAH ("simple needle-retrieval" of one planted fact, §5; F1), OOLONG (aggregating labels over many entries, e.g. "classifying 1000 questions", App. A; a score), OOL-Pairs (questions over pairs of entries, F1) and CodeQA (questions over code, accuracy, 23K–4.2M tokens). The others run at 8K–128K, and the paper reports "macro-averages across all non-empty buckets" (§5).
- **Runs** (§5): each configuration "is run twice, and the results are averaged"; the planner's accuracy target is α = 0.80.
- **Theory** (§4) assumes: the model halts in bounded time on inputs up to its window (A1); every other combinator is total and deterministic (A2); cost doesn't fall as input grows (A3); per-call accuracy doesn't rise with input length up to the window (A4); A⊕ lies in (0, 1] (A5).
- How the combinators are pre-verified is not discussed.

## Approach

**The core term** (§3.2, Eq. 4): fix applied to a function that calls M on a prompt of at most τ\* and otherwise splits it into k\* pieces, solves each recursively and combines them with REDUCE and ⊕. A planner, "a non-neural routine", builds it, not the LLM (§3.2).

**The pipeline** (Alg. 1): a REPL holds the prompt, the library and a model sub-call; one model call picks the task type from a peek at the prompt; a prompt that fits the window is answered directly; otherwise the planner computes k\*, τ\* and d, and the executor Φ (Alg. 2) runs once, pruning chunks where the plan says so. App. D's planner (Alg. 3) sets k\* by a square-root formula in input length and prices, raised (up to n/K) while the predicted accuracy A(K)^d·A⊕^d is below α.

**Task-specific plans** (§3.2; Algs. 5–6): for pairwise tasks the model only labels chunks and the quadratic pairing is symbolic; multi-hop search filters documents by previews (the model then reads the retained ones), then makes one synthesis call.

**Theorems** (§4; proofs App. C), Thms. 1–3 "for any valid choice" with k\* ≥ 2 and τ\* ≤ K:
- **Termination:** if the model halts on every input within its window (A1) and the other combinators are total and deterministic (A2), Φ halts on every finite input, with exactly (k\*)^d + 1 model calls, the leaves plus task detection (Thm. 1).
- **Cost:** under A1–A3, total cost follows the recurrence of Eq. 6 and is at most (nk\*/τ\*)·C(τ\*) plus a composition term that is zero for a purely symbolic ⊕ (Eq. 7), computable before execution (Thm. 2).
- **Accuracy:** under A4–A5: with no split (d = 0) accuracy is A(τ\*); with a split and imperfect leaves it is at least A(τ\*)^(nk\*/τ\*)·A⊕^d (Eq. 8); with perfect leaves at least A⊕^d; for "decomposable tasks" (A⊕ = 1, independent sub-queries) per-query accuracy is A(τ\*), "constant in n"; direct inference gets A₀·ρ^(n/K) (Thm. 3). The proof uses "conditional independence of leaf evaluations on disjoint chunks".
- **Optimal partition:** under A3, for the cost function of Def. 3 and a "constant per-level composition cost" C⊕(k) = c⊕·k, the cost-minimising partition size for recurrence (6) is k\* = 2 (Thm. 4).
- **Scaling laws:** for fixed α and window, as n grows, direct accuracy falls to zero exponentially; λ-RLM's worst case is Ω(n^−c) with c = −log_k\*(A(τ\*)·A⊕) > 0, a power law; for decomposable tasks it stays at least A(τ\*) (Cor. 5).

## Results

Accuracy is macro-averaged over length buckets (Tab. 4). They report:
- **Wins:** λ-RLM beats Normal RLM in 29 of 36 cells: 12/12 weak, 11/12 medium and 6/12 strong, where "powerful code-generating models can partially compensate for the lack of formal structure" (§5.1, Tab. 6).
- **Same model** (C1): on Qwen3-8B, 13.8% under Normal RLM against 35.7% under λ-RLM (+21.9 points), at 4.0× lower latency (§5.1, Tab. 9).
- **Small against large** (C2): Qwen3-8B with λ-RLM is "statistically tied with Llama-70B under Normal RLM at 36.1%", 3.1× faster, and more accurate than Direct Llama-405B (C3) (§5.1, Tab. 9).
- **Coding ability:** the Mistral-7B to Codestral-22B gap shrinks under λ-RLM (C4); at 405B Normal RLM wins CodeQA but narrowly loses on average (C5) (§5.1).
- **By task:** the gain is largest on OOL-Pairs, "where the quadratic cross-product is handled symbolically", and smallest on CodeQA (§5.1, Tab. 7).
- **Latency:** λ-RLM is "faster than Normal RLM in every cell", Direct fastest but least accurate (Tab. 5); reductions of 3.3× to 4.1× (§1).
- **Losses** (§5.1, Tab. 8): Normal RLM's 7 wins "All involve either strong coding models (Llama-405B, Codestral-22B) or the CodeQA task", with a reason given for each.
- **Ablations** (Qwen3-8B on OOLONG, Tab. 10): free-form code costs 24.2 points, random k 16.8, a fixed task type 7.1, an LLM as ⊕ 4.7 (nearly doubling latency), no pre-filter 1.5 (§5.1).

## Limits the authors state

- "We do not claim that this library is unique or exhaustive"; which operators are needed "can depend on the structure of the tasks under consideration" (§3.1).
- On CodeQA, strong models' own code enables strategies ("multi-pass reading, function-level chunking") "that the fixed combinator library cannot express" (§5.1).
- The library "reduces but does not eliminate the benefit of coding ability", since the leaf sub-prompts still benefit from the model's language understanding (§5.1 C4).
- Direct inference is faster than λ-RLM (§5.1 C3; Tab. 5).
- Termination holds "under mild conditions on the splitting operator", and the cost bounds "under standard size-decreasing decomposition assumptions" (§1).

## Open problems and building blocks

- **Open:** the library "may benefit from task-specific extensions for code understanding" (§5.1 C5); it is "an extensible basis rather than a closed vocabulary", and "New typed combinators can be added conservatively" (§3.1).
- **Released:** "The complete implementation of λ-RLMs, is open-sourced for the community" (abstract); "we open-source the library with a lightweight interface to support such extensions" (§3.1).
- **To reuse it:** per-token prices and an accuracy target for the planner (§5), plus A(K) and A⊕ in App. D's planner (Alg. 3); a REPL holding the prompt (Alg. 1); a task that fits one of the six plans of Tab. 1.
- **Beyond its domain:** the authors say the principle, "treating the LLM as a bounded oracle within a formal functional structure, has broader implications for the design of intelligent systems" (§7).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
