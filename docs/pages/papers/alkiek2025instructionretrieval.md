# Instruction Retrieval at Inference Time for Small Language Models

**Instruction Retrieval at Inference…** · preprint 2025 (v3, 2026)

Read: [PDF](https://arxiv.org/pdf/2510.13935) · [arXiv](https://arxiv.org/abs/2510.13935)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A teacher (GPT-5) writes one instruction per cluster of a domain's training questions, with background knowledge, a procedure and the common mistakes; a frozen small model retrieves the five instructions nearest its question and follows them, with no fine-tuning and no teacher call at inference (abstract; §3).
- Clusters of three training questions by embedding similarity; each instruction is written in one pass from its cluster's questions with their answers, and the mistakes from the wrong answers of four of the students (§3; App. A.1 "One request per cluster"). Five small students (Qwen 3.5 2B and 4B, Gemma 4 E2B and E4B, Ministral 3 3B) on MedQA, MMLU Professional Law and MathQA, all multiple choice, against zero-shot, few-shot, self-consistency, RICP, textbook passages (MedQA only) and random instructions (§4, Tab. 1); an error analysis reruns wrong development questions with each part of an instruction alone, thinking mode on, or self-consistency (§6.2).
- Frontier-written guidance for compact models, kept in the prompt with weights fixed, written from labeled questions and the students' errors but never revised against a check: the authors report that it raises the five students' mean MedQA accuracy by 10.6 points over zero-shot, more than retrieved textbook passages, while few-shot examples from the same teacher lower the mean on every task (Tab. 1; §5). Multiple choice only, which the authors name as untested beyond (§7).

## In plain words

Small language models, which can run on a laptop or a phone, store too few facts for expert questions, the authors say. They argue that fine-tuning must be repeated for every model and domain, and that a retrieved passage leaves the model to find and apply the relevant fact itself (abstract; §1). In instruction retrieval, a large teacher model (GPT-5) writes, once per domain, one instruction per small group of similar training questions: background facts, a procedure, and common mistakes. At test time an unchanged small model follows the five instructions whose training questions are most like its own (§3). Over five small models on medical, legal and math multiple-choice benchmarks, the authors report that mean accuracy on the medical one rises from 64.3% with no added text to 74.9%, against 68.1% with textbook passages and 62.6% with worked examples from the same teacher (Tab. 1); on math, voting over three sampled answers gains more than the instructions (§5). They present it as "a new approach to compress teacher knowledge into a reusable corpus of instructions" (§7).

## Background and terms

**Terms to know:** [Distillation into compact models](#/glossary/distillation) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [dense retrieval](#/glossary/dense-retrieval) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [pass@k](#/glossary/passk) · [data contamination](#/glossary/data-contamination) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [agglomerative clustering](#/glossary/agglomerative-clustering) (average linkage, cosine distance between question embeddings, §3)

**The paper's own terms:**
- **instruction retrieval**: "Distillation into compact models from a teacher model into a corpus rather than into weights" (§1); unlike the glossary's Distillation into compact models, the student is never trained.
- **Instruction Corpus**: a domain's teacher-written instructions, one per cluster of training questions (§3).
- **instruction I_j = (K_j, P_j, M_j)**: **background knowledge** K_j (the facts the cluster depends on), **procedure** P_j (steps for applying them) and **common mistakes** M_j (what separates the options students chose from the correct one) (§3).
- **frontier reference**: GPT-5's own zero-shot accuracy (§4).
- **always right, usually right, rarely right, always wrong**: all, three or four, one or two, or none of five sampled answers correct (§6.1); the authors read always-wrong as a missing fact, and the rest as a student that "wavers between options".
- **fixed**: a wrong question is fixed "if three fresh samples are all correct under it", reported minus what three fresh samples fix with nothing added (§6.2).
- **random instructions**: a control of five instructions drawn at random from the corpus (§4).
- **question-withheld check**: the student sees the retrieved texts and the options but not the question (§3 "Corpus validation").

**Missing glossary terms:** none.

**Bridge** (ours): an instruction is close to an [agent skill](#/glossary/agent-skill) written for a cluster of questions.

**Builds on:**
- Reasoning Distillation into compact models into weights (Ho et al., 2023, and others), including KARD (Knowledge-Augmented Reasoning Distillation; Kang et al., 2023); the authors' contrast is that each "fine-tunes every student it serves" (§2 "Distillation").
- Retrieval augmentation (Lewis et al., 2020); Wang et al. (2024)'s medical-textbook passages are the passage baseline (§2; §4).
- RICP (Retrieved In-Context Principles; Sun et al., 2024), which "shares the teacher-writes, student-retrieves design and is the baseline" (§2 "Error-driven corpora").
- Retrieved reasoning templates such as Buffer of Thoughts (Yang et al., 2024) and Self-Discover (Zhou et al., 2024; [Self-Discover](#/papers/zhou2024selfdiscover "SELF-DISCOVER: Large Language Models Self-Compose Reasoning Structures (2024)")), which the authors say make a model that already solves the problem more efficient (§2 "Retrieval augmentation").

## Problem and setting

Can a frozen small model, given teacher-written instructions retrieved per question, answer expert questions it gets wrong alone; which kind of wrong answer each part fixes; and why an instruction beats a passage holding the same fact (§1; §6 intro)?

- **Benchmarks** (§4 "Tasks"): MedQA (medical board-exam questions), MMLU Professional Law (law questions from MMLU, a multi-subject knowledge benchmark; re-split) and MathQA (math word problems), all multiple choice, each with training, development and test splits.
- **Students and teacher** (§4): Qwen 3.5 2B and 4B, Gemma 4 E2B and E4B (the 2B- and 4B-class Gemma 4 models), and Ministral 3 3B, thinking mode (long reasoning before the answer) off; GPT-5 is teacher, frontier reference and, in §6.3, judge (App. B).
- **Baselines** (§4): zero-shot, whose output format already asks for step-by-step reasoning; few-shot with five teacher-written worked examples, the same for every question; self-consistency over three samples (Wang et al., 2023; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")); RICP's principles, written by the teacher from the students' training mistakes; five textbook passages (MedQA only); random instructions.
- **Correct** (§4; App. B): the benchmark's keyed option, on the test split; greedy decoding except for self-consistency; paired bootstrap 95% intervals for each difference from zero-shot (App. C.1).

## Approach

- **Building the corpus** (§3 "Corpus construction"): training questions are embedded with OpenAI's `text-embedding-3-large` and clustered agglomeratively into groups of three, a size chosen on the development split (App. A.3, Tab. 2). For each cluster the teacher writes K_j and P_j from the questions and their answers, and M_j from the wrong answers of the four Qwen and Gemma students, so one corpus per domain serves every student.
- **Retrieval** (§3 "Retrieval"): each instruction is scored by the mean cosine similarity between the question and its three training questions, and the five nearest go into the prompt. The teacher is not called at inference.
- **Corpus validation** (§3; App. C.5): every instruction is checked for runs of 13, then 8, consecutive words shared with a test question (the contamination probe of Brown et al., 2020), and the question-withheld check is run.
- **Error analysis** (§6): five sampled answers per development question sort questions into the four kinds, following the pass@k framing (§6.1); wrong development questions of the four Qwen and Gemma students are rerun with thinking on, self-consistency, K_j, P_j or M_j alone, or the full instruction (§6.2); GPT-5 labels whether MedQA's retrieved passages or instructions hold the deciding fact and would mislead, after Joren et al. (2025) (§6.3).

## Results

- **Main comparison** (§5, Tab. 1): besides MedQA, the corpus raises the mean from 50.9% to 54.2% on MMLU Law and from 84.1% to 86.5% on MathQA. The 95% interval of the gain excludes zero for every student on MedQA and MathQA, but on MMLU Law only for Qwen 3.5 4B and Gemma 4 E2B; Qwen 3.5 2B "does not move" there (§5; App. C.1, Tab. 4). The smaller student of each family gains most on MedQA, which the authors attribute to its larger share of always-wrong questions (§5; Fig. 2).
- **Controls** (§5): random instructions and few-shot examples each lower the mean on every task, so the gain, the authors conclude, is not from instruction or teacher-written text as such; RICP's principles move it little, so "what the corpus adds is the content written for each cluster".
- **Self-consistency** (§5): on MathQA it gains 3.3 points against the corpus's 2.4, best for three of the five students; voting over the instruction run's samples beats the corpus alone on every task, so, per the authors, "the two gains come from different questions" (Tab. 4).
- **Frontier reference** (§5): with the corpus, Qwen 3.5 4B and Gemma 4 E4B match GPT-5 zero-shot on MathQA; MMLU Law is "the task where the students stand furthest from the reference and where the corpus moves them least".
- **Kinds of wrong answer** (§6.1, Fig. 3): the always-wrong share "depends on the task more than on the student", smallest on MathQA and largest on MMLU Law.
- **Interventions** (§6.2, Fig. 4; raw shares in App. C.3, Tab. 7): on every task self-consistency and thinking on each fix under 7% of always-wrong questions, while K_j alone fixes 20% of them on MedQA (development split, four students, net of the control). Which part helps most differs by task: K_j on MedQA, M_j for rarely-right questions on MMLU Law, while on MathQA no single part matches the full instruction. The abstract puts it as "only the background knowledge fixes the questions a small model always gets wrong".
- **Passages against instructions** (§6.3; App. C.4, Tab. 8): both hold the deciding fact for most MedQA questions, but the judge marks passages misleading for 22% of questions and instructions for 9%.
- **Leakage** (§3; App. C.5, Tabs. 9–11): no test question shares a 13-word run with an instruction; the 8-word matches are, the authors report, stock phrases. With the question withheld, MedQA students pick the keyed option 38.4% of the time from instructions, 39.8% from passages and 22.7% from the options alone, against 74.9% with the question; the authors conclude that an instruction carries "not the answer to any one question".

## Limits the authors state

- "Every benchmark here is multiple choice, so whether a student follows an instruction as well on a free-form answer, where no option narrows the choice, is untested" (§7).
- The teacher "may have seen these benchmarks in pretraining" and "it could restate a test question from memory inside an instruction"; the n-gram probes are their check (§3 "Corpus validation").
- "where that share is small, as on MathQA, self-consistency is the cheaper remedy" (§7), the share being always-wrong questions.
- "Most always-wrong questions stay wrong under every intervention, unless" K_j "of the retrieved instruction directly states the missing fact" (§6.2).
- In the sweep, "MMLU Law's 85 questions cannot separate the sizes and take MedQA's setting, as does MathQA" (App. A.3).
- Format failures (no readable answer) count as wrong; for Qwen 3.5 2B and Ministral 3 3B on MathQA, "the student keeps reasoning and never states an answer" (§4; Tab. 5).
- "Ministral 3 3B has no intervention runs" (App. C.3).

## Open problems and building blocks

- **Open** (§7): "reranking the retrieved instructions or training a retriever on question-to-instruction pairs is untested"; "a student could retrieve only when its confidence or the agreement among its samples says it should"; "whether an open-weight teacher, and how small a one, can write instructions a small model follows is open".
- **Released:** the corpus per domain, every prompt, the retrieval and evaluation code and every student output "are in the supplementary material and will be released on publication" (Reproducibility Statement; §1).
- **To reuse it:** a teacher (GPT-5 through the OpenAI API, default settings, App. B), an embedding model (§3), a domain's training questions with answers, and students' wrong answers for the mistakes (§3; App. A.1). Students ran on one GPU in half precision (App. B).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
