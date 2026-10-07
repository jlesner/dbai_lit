# On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks

**On the Self-Verification Limitations…** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2402.08115) · [arXiv](https://arxiv.org/abs/2402.08115)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- GPT-4 critiquing its own answers vs a sound external verifier, on Game of 24, graph coloring and STRIPS planning (abstract).
- Ablates the content of the critiques (abstract).

## In plain words

Many LLM systems let the model check and criticise its own answer and then try again, on the belief that checking an answer is easier than producing one; the authors doubt that this belief carries over to LLMs (abstract; §1). They test GPT-4 on three puzzle-like tasks whose answers a short program can check exactly: making 24 from four numbers, colouring a graph so that no two connected points share a colour, and planning moves in a block-stacking world. They compare GPT-4 checking its own answers with an exact checking program, and then strip the feedback down until none is left (abstract). They report that self-checking made results worse than a single attempt on three of their four task sets: on graph colouring, 16% solved with one attempt fell to 2%, while the exact checker giving only yes/no feedback raised it to 38%, and simply asking the same question up to 15 times until the checker accepted an answer reached 40% (§5). They present this as contradicting earlier work that was "very optimistic about LLM self-critique abilities" (§6).

## Background and terms

**Terms to know:** [soundness and completeness](#/glossary/soundness-and-completeness) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [self-consistency](#/glossary/self-consistency-majority-voting) · [rejection sampling](#/glossary/rejection-sampling) · [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy) · [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl)

**The paper's own terms:**
- **LLM+LLM (self-critique):** one LLM both generates a solution and, in a separate query, verifies and criticises it (§1; §4).
- **Backprompt:** the follow-up prompt built from a critique; it holds the whole history of earlier attempts and their feedback and goes back to the generator (§1; §4).
- **Three roles:** answer guesser, binary (yes/no) verifier and critique generator (§4); the conclusion calls the parts verification, critique generation and critique consideration, the last being how the generator uses a critique (§6).
- **Sound verifier (LLM+Sound Verifier; "LLM+Sound Critique" in Tab. 1):** an exact checking program in place of the LLM verifier. The paper relies on it in both directions: it rejects wrong answers, and "every correct answer will be accepted properly" (§5), so it is also complete in the glossary's sense.
- **Feedback levels:** binary feedback (B.F., only "the previous answer was wrong"), first error feedback (F.E.F.) and all errors feedback (A.E.F.); Game of 24 has no third level (§5.2; Tab. 1).
- **Sampling (k = 15, 25):** the same base prompt, with no history, is sent again until the sound verifier accepts or the limit of k queries is reached (§5.2).
- **Standard prompting (S.P.):** one query; the baseline (§5).
- **False positive / false negative rate (F.P.R., F.N.R.):** Tab. 2's counts show the F.P.R. is the share of wrong answers the LLM verifier accepts and the F.N.R. the share of correct answers it rejects.
- **Approximate retrieval:** what the authors suggest LLMs may be doing in place of reasoning, cited to earlier work and not defined here (abstract; §1).
- **LLM-Modulo:** a framework from the authors' earlier work in which the LLM's guesses are checked by external sound systems (§1; §6).

**Missing glossary terms:** none.

**Builds on:**
- Self-critique works whose claims it tests: Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Self-Refine (Madaan et al.), Self-Debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")), Weng et al. (§1; §2).
- Tree of Thoughts ([Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")), whose Game of 24 data and test instances it reuses (§3.1) and which it compares against directly in App. A.2.
- PlanBench (Valmeekam et al., a planning benchmark with two of these authors), the source of both Blocksworld sets (§3.3).
- Earlier negative results on self-correction (Huang et al.; CRITIC), which the authors say they extend with ablations, more rounds (up to 15) and new domains (§2).

## Problem and setting

- **Question:** does letting GPT-4 verify and criticise its own answers improve it on formally checkable reasoning and planning tasks, and which of the three roles carries any gain (§1; §4)?
- **Why formal tasks:** answers are machine-checkable, new instances can be generated (less risk of training-data overlap), and solution spaces are large, unlike multiple-choice sets (§2; §3).
  - **Game of 24** (§3.1): combine four numbers (typically 1–12) with +, −, ×, ÷ and parentheses into an expression equal to 24. Problems come from 4nums.com, ordered by average human solving time; generation uses instances 901–1000 as Tree of Thoughts did, verification-only tests 1–1000. Verifier: SymPy, a Python library for symbolic mathematics, evaluates the expression; malformed expressions get a message saying so.
  - **Graph coloring** (§3.2): 100 small planar graphs (drawable without crossing edges), built by a random-graph method (Erdős–Rényi variant, edge probability 0.4), given with their chromatic number (the fewest colours that work); the answer must use that many colours with no edge joining two same-coloured vertices. The authors note it is NP-complete. Verifier: a single Python loop over the edges.
  - **STRIPS planning** (§3.3): Blocksworld (stacking blocks, a domain from the International Planning Competitions) and Mystery Blocksworld (the same domain with obfuscated names), instances from PlanBench. Verifier: VAL, a plan validator reporting violated preconditions and unmet goals.
- **Setup:** 100 instances per domain; a run stops when the verifier accepts or after 15 rounds (§5). "Correct" means accepted by the domain's sound verifier.
- **Model:** GPT-4 (§1). The model version and decoding settings are not discussed, apart from a t=1 note on the sampling runs (§5.2).

## Approach

- **The loop (Fig. 1; §4):** a template turns the instance into a prompt; GPT-4 answers; a verification prompt sends the answer back to GPT-4; if it says correct the run stops, otherwise its critique is appended to the full history as a backprompt, until the timeout.
- **Ablations (§4; §5.2):** replace the LLM verifier with the sound verifier; reduce its feedback from all errors to the first error to binary; then drop feedback and history entirely (sampling). A self-consistency baseline picks the most common of 15 answers.
- **Verification and critique tests (§5.1; App. A.3.1, A.4.1, A.5.1):** GPT-4 judges constructed candidates (correct, deliberately flawed, random, its own) and is scored against the sound verifier.
- **Robustness (App. A.1):** variant verification prompts, including chain-of-thought ones.

## Results

- **Main comparison (Tab. 1),** accuracy as standard prompting → LLM+LLM; sound verifier with binary / first error / all errors feedback; sampling k=15 / k=25: Game of 24 5% → 3%; 36% / 38% / N/A; 28% / 42%. Graph coloring 16% → 2%; 38% / 37% / 34%; 40% / 44%. Blocksworld 40% → 55%; 60% / 87% / 83%; 68% / 72%. Mystery Blocksworld 4% → 0%; 10% / 8% / 6%; 9% / 14%. The authors call Blocksworld's self-critique gain "a modest improvement", still well below the sound verifier (§5).
- **Over rounds (Fig. 2):** with the sound verifier performance rises to an asymptote; with the LLM verifier "performance collapses immediately" (caption).
- **Verifier errors (Tab. 2):** false negative rates of 20.7% (Game of 24), 95.8% (graph coloring), 15.48% (Blocksworld) and 97.09% (Mystery Blocksworld); in graph coloring and Mystery Blocksworld, the authors say, the system rejects most answers and times out on later, worse ones (§5).
- **Critique quality (§5.1):** the authors find critiques "full of unhelpful hallucinations and mistakes". In Game of 24 GPT-4 labels 79.1% of correct expressions as correct but evaluates 81.6% of them to 24 (§5.1; Tab. A3). Graph-coloring critiques name non-existent edges and misstate vertex colours (App. A.4.1; Tab. A4); planning critiques misjudge whether preconditions hold (Tab. A5–A6).
- **Feedback content (§5.2):** very little difference between feedback levels, and "in two of our domains, increasing the amount of feedback actually leads to a decrease in performance". Sampling gives comparable gains at a token cost "quadratically lower"; self-consistency "shows no improvement over standard prompting". The authors conclude: "We therefore see the LLM primarily as an idea generator."
- **Chain-of-thought verification (App. A.1; Tab. A1–A2):** on Game of 24 it raises verification accuracy from 87% to 99%, yet in the full loop "a 6 percentage point gap still remains" against the sound verifier, at 17 times the output tokens.
- **Tree of Thoughts (App. A.2):** with 150 queries and a sound verifier (about Tree of Thoughts' per-problem cost), the authors report 70% on the same Game of 24 test set, against Tree of Thoughts' reported 74%.

## Limits the authors state

- The conclusions are scoped to the tasks tested: "in our domains, the information in critiques does not have as much of an effect on performance as previous literature claimed it should" (§5.2).
- "LLM results are well-known to be brittle to choice and phrasing of prompt"; they ran prompt variants for this reason, and chain-of-thought verification helped in some, not all, cases (App. A.1).
- Formal, fully specified problems "may at first seem like a very narrow class"; the authors argue they are fundamental (§2).
- The main Game of 24 self-verification setting "is not directly comparable to that of" Tree of Thoughts (App. A.2).
- Their proposal holds "when possible" and needs "some kind of signal for when a guess is good enough", "Ideally" a sound verifier; in real-world use they expect "a menagerie of partial critics" (§6).

## Open problems and building blocks

- **Open:** none called open. Directions: future LLM reasoning systems "should take the form of LLM-Modulo systems" with external sound verification (§1); in real applications the authors expect the verifier role to be played by "a menagerie of partial critics" whose consensus counts as verification (§6).
- **Released:** nothing stated; the appendices print the prompts and example traces (App. A.3–A.5).
- **To reuse it:** GPT-4; a sound verifier for the domain; up to 15 queries per instance, with prompts that grow with the history in the critique loop (§5; §5.2).
- **Beyond its domain:** the authors argue any other reasoning task "must include components that test these same capabilities" (§2), and propose, "when possible, to embed LLMs in systems which allow them to guess at solutions multiple times" with a signal for when a guess is good enough, "Ideally" a sound verifier (§6).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
