# PAL: Program-aided Language Models

**PAL (Program-aided Language Models)** · preprint 2022

Read: [PDF](https://arxiv.org/pdf/2211.10435) · [arXiv](https://arxiv.org/abs/2211.10435)  
Code: [pal](https://github.com/reasoning-machines/pal)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Few-shot prompts make the LLM write its reasoning steps as a Python program; a Python interpreter runs it and its result is the answer (abstract, §3).
- Codex with greedy decoding, against direct and chain-of-thought prompting, on math word problems and BIG-Bench Hard symbolic and algorithmic tasks (§4); adds GSM-HARD, GSM8K with larger numbers (§4.1).
- The base case for handing the computation to an executor: the authors report that on GSM-HARD chain of thought loses most of its GSM8K accuracy while PAL loses far less (§5.1, Tab. 1), and that as Colored Objects questions hold more objects, chain of thought's accuracy "is unstable and drops, while PAL remains consistently close to 100%" (§5.2, Fig. 6). The gain needs a model with enough code ability: with text-davinci-001 chain of thought does better (§6, Fig. 8).

## In plain words

Language models that reason step by step in prose (chain of thought) can split a word problem into sensible steps and still get it wrong: "LLMs often make logical and arithmetic mistakes in the solution part, even when the problem is decomposed correctly" (abstract). PAL shows the model a few worked examples written as short Python programs, has it write one for the new question, and lets a Python interpreter run it, so the model only breaks the problem down (abstract, §3). The authors present it as "a novel approach" and test it on 13 math, symbolic and algorithmic tasks (abstract).

With the code model Codex, they report state-of-the-art few-shot accuracy on GSM8K (grade-school math word problems), 15 points of top-1 accuracy (one answer per question) above chain of thought with the much larger PaLM-540B (abstract; §1). On their version of GSM8K with large numbers, chain of thought loses far more accuracy than PAL (§5.1, Tab. 1). The gain depends on the model: with the weakest text model they try, chain of thought does better (§6).

## Background and terms

**Terms to know:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [semantic parsing](#/glossary/semantic-parsing) · [least-to-most prompting](#/glossary/least-to-most-prompting) (App. I: PAL keeps its reducing prompt and writes the solving steps in Python)

In the glossary's terms, PAL is a program-of-thought method. The authors call PAL "a very general form of semantic parsing", into Python rather than a domain-specific language (§7).

**The paper's own terms:**
- **PAL (Program-Aided Language models)**: few-shot prompting in which each example pairs a question with "interleaved natural language (NL) and programming language (PL) statements" and gives no final answer; the generated program is passed to a solver and its "final run result" is the answer (§3); its prose steps are Python comments, which the interpreter ignores.
- **Direct prompting**: examples of questions with "immediate answers", no intermediate steps (§4 "Baselines").
- **Solve rate**: the percentage of problems solved (Tab. 1 caption).
- **GSM-HARD**: GSM8K's test questions where "one of the numbers in a question was replaced with a random integer of up to 7 digits" (§4.1). The new answers come from rerunning PAL's programs with the new numbers (sampling new programs where the first was wrong on GSM8K), plus the authors' own answers for the questions PAL never solved (App. H.1).
- **majority@40**: 40 sampled outputs per question, answer by majority vote (Tab. 3; §5.1 "Multi-sample Generation").
- **PAL−comment, PAL−comment−var**: the PAL prompt without its prose comments, and also with variable names replaced by random characters (§6 "Do variable names matter?").
- **LLM Simulating Runtime**: the model writes the program and then the answer itself, with no interpreter (App. B, Tab. 6; §6).
- **The models**: Codex means `code-davinci-002` unless stated otherwise (§4); `code-cushman-001` and `code-davinci-001` are the "weaker models of code" (§6); `text-davinci-001`, `-002` and `-003` are "LMs that were mainly trained for natural language" (§6).

**Builds on:**
- Chain-of-thought prompting, Wei et al. (2022), on top of few-shot prompting, Brown et al. (2020) (§2): PAL rewrites its examples as programs and uses it as the main baseline (§3, §4).
- Self-consistency, Wang et al. (2022b) ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")): the majority voting behind the multi-sample results (§5.1).
- Work it contrasts itself with (§7): calculators (Cobbe et al. (2021), [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"); Chowdhery et al. (2022); Wei et al. (2022)); "program of thought prompting" (Chen et al., 2022), which came shortly after PAL's preprint, "conceptually similar to ours"; and Binder (Cheng et al., 2022), "may be" the closest work technically, the authors say, but "addressed mostly answering questions about tables using SQL and SQL-like Python".

## Problem and setting

- **The question:** does handing the solving step to an interpreter make few-shot reasoning more accurate (§1)? §6 also asks whether it works with weaker or mainly-text models, whether the gain comes "because of the Python prompt or because of the interpreter", and whether variable names matter.
- **Tasks** (§4; App. H): eight datasets of algebra word problems "at grade-school level" (§4.1): GSM8K ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), GSM-HARD, SVAMP, ASDiv, and MAWPS's SingleEq, SingleOp, AddSub and MultiArith; three symbolic tasks from BIG-Bench Hard (Suzgun et al., 2022), a suite of hard reasoning tasks: Colored Objects (positions and colours of objects in a row), Penguins (a table of penguins, with additions and removals) and Date (date arithmetic) (§4.2); and two algorithmic tasks, "where a human programmer can write a deterministic program with prior knowledge of the question": Object Counting and Repeat Copy (writing out a word sequence from instructions) (§4.3).
- **Setup:** few-shot prompting, which "does not modify the underlying LLM" (§2); the examples of earlier chain-of-thought work where they exist, otherwise a fixed random set of the same size (3–6), used for both PAL and chain of thought (§3, §4); greedy decoding at temperature 0 (§4); "a single, post-hoc, execution" of each program (run once, after generation) (§3). For math, PAL's results average three orderings of the prompt examples (Tab. 1 caption, App. E). Tab. 1's direct-prompting, PaLM-540B, Minerva 540B (fine-tuned on mathematical content, §5.1), LaMDA-137B and UL2-20B (other large models) results come from earlier papers (Tab. 1 caption).
- What happens when a generated program fails to run, and how answers are matched with the gold answers, are not discussed.

## Approach

- **Prompts** (§3): each chain-of-thought example gets a program statement beside each prose step, "leveraging programming constructs such as for loops and dictionaries when needed", with variable names that "meaningfully reflect their roles". Math prompts keep only the meaningful names, since prose steps do "not further benefit these math reasoning tasks" (§4.1, Fig. 3). Colored Objects programs index a list of (object, colour) pairs (Fig. 4); Object Counting programs sum a dictionary of counts (Fig. 5).
- **Inference** (§3, Fig. 1): the test question is appended, the model writes the program, and a standard Python interpreter runs it.
- **Rationale:** the result is "a final answer that is guaranteed to be accurate, given the correctly predicted programmatic steps" (§8).

## Results

All with Codex unless noted.
- **Math** (§5.1, Tab. 1): PAL has the highest solve rate on all eight datasets. On GSM8K it reports 72.0% against 65.6% for chain of thought with Codex and 56.9% with PaLM-540B; on GSM-HARD, 61.2% against 23.1% for chain of thought. In most of 25 question pairs inspected, chain of thought wrote nearly identical steps with and without large numbers, "indicating that the primary failure mode is the inability to perform arithmetic accurately" (§5.1; Tab. 11). Prompts with large numbers bring chain of thought "only modest gains" on GSM-HARD (App. B, Tab. 5).
- **Many samples** (§5.1, Tab. 3): with majority@40 (nucleus sampling at temperature 0.7), PAL reaches 80.4% on GSM8K against 78.5% for Minerva 540B with as many samples; App. D (Fig. 12) covers 1 to 40 samples, with the baselines estimated in between, not run.
- **Symbolic and algorithmic tasks** (§5.2, Tab. 2): PAL beats chain of thought by 8.8 to 23.7 points across the five tasks.
- **Harder questions** (§5.2, Fig. 6): as Colored Objects questions hold more objects, chain of thought's accuracy "is unstable and drops", while PAL "remains consistently close to 100%".
- **Weaker code models** (§6, Fig. 7): "the relative improvement of PAL over CoT remains consistent across models".
- **Text models** (§6, Fig. 8; App. C): with `text-davinci-001` chain of thought scores 26.5% and PAL 8.6%; with `text-davinci-002` and `-003` PAL wins, and with `-003` it "performs almost as" with Codex.
- **Interpreter or prompt** (§6; App. B, Tab. 6): with PAL-style prompts but no interpreter, the GSM8K solve rate is 23.2 against PAL's 72.0. The authors say this reinforces their "hypothesis that the main benefit of PAL comes from the synergy with the interpreter, and not only from having a better prompt" (§6).
- **Variable names** (§6, Fig. 9; App. A): without comments PAL still beats chain of thought on Colored Objects and Date; without meaningful names as well, it falls below. On GSM8K, single-letter variable names drop PAL below chain of thought (Tab. 4).
- **Other analyses:** PAL also improves Least-to-Most prompting on 500-question subsets of GSM8K and SVAMP (App. I, Tab. 12); in 20 Colored Objects questions, chain of thought is often unsure of tokens for numbers, positions, colours and objects, while the model is "typically confident" writing PAL's programs (App. G); the spread over prompt orderings is "minimal" (App. E, Tab. 7).

## Limits the authors state

- **Model ability:** "when the base LM's 'code modeling ability' is weak (using text-davinci-001), CoT performs better than PAL"; PAL can work with text models "if they have a sufficiently high coding ability" (§6).
- **A correct program is assumed:** computations are accurate "given the correctly generated program" (§5.1); the conclusion's guarantee holds "given the correctly predicted programmatic steps" (§8).
- **Names and text matter:** meaningful variable names "are critical" (§3); without comments and meaningful names PAL "performs worse than CoT" on Colored Objects and Date (§6), and for GSM8K "just structure is not sufficient" (Tab. 4 caption).
- **GSM-HARD labels:** the construction "assumes that a program that produces a correct answer to a GSM8K question indicates the correctness of the program itself. While this is not guaranteed due to possible spurious correlations, we manually checked 25 programs and found all of them are correct" (App. H.1).
- **Token-level analysis:** presented as "initial attempts" (App. G).

## Open problems and building blocks

- **Open:** "it is also possible to incrementally run the PL segments and feed the execution results back to the LLM to generate the following blocks", which the experiments don't do (§3); the authors "believe that these results unlock exciting directions for future neuro-symbolic AI reasoners" (§8).
- **Released:** "Our code and data are publicly available" (abstract); the full prompts "can be found in our released code" (App. J).
- **To reuse it:** a model with "sufficiently high coding ability" (§6); a Python interpreter, or "any solver, interpreter or a compiler" (§3); a PAL prompt per task, made by turning chain-of-thought examples into code with meaningful variable names, which the authors say is generally "easy and quick" to write (§3).
- **Beyond its domain:** the authors "argue that symbolic reasoning is a crucial component in solving a wide range of tasks", and show ChatGPT examples "that may not initially appear to require using programs" (App. F).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
