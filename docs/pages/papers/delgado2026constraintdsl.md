# A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models

**A framework for assessing…** · Alloy) with LLMs, Journal of Systems and Software 238 (2026), 112871

Read: [PDF](https://arxiv.org/pdf/2603.05278) · [arXiv](https://arxiv.org/abs/2603.05278) · [DOI](https://doi.org/10.1016/j.jss.2026.112871)  
Code: [code-generation-framework-for-dsls](https://github.com/david-xander/code-generation-framework-for-dsls)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A configurable pipeline that turns natural-language constraint descriptions, plus a text description of the domain, a domain model or both, into code in the constraint languages OCL and Alloy, or in Python as a high-resource baseline, then checks each snippet for well-formedness and correctness, with an optional single round of LLM repair after each check (abstract; §3, Fig. 1–3).
- Nine prompt templates that vary how the domain is given (text description, PlantUML or natural-language model, or a model the LLM explains or writes first) (§3.1, Tab. 1), batch against one-by-one delivery of a domain's constraints, k = 1–3 attempts and repair; ANTLR parsers check well-formedness and GPT-4o-mini as an LLM judge checks correctness (§4.1–4.2); GPT-4o, GPT-4o-mini, DeepSeek Coder 6.7B and Llama 3.1 on 182 constraints from two OCL datasets with LLM-written domain descriptions (§5.2–5.3).
- Evidence on LLMs writing a low-resource DSL: the authors report less well-formed and less often correct code in OCL and Alloy than in Python (§5.3.1, Fig. 7), with the two open-source models (DeepSeek Coder 6.7B, Llama 3.1) doing "much worse" (§5.3.2). Correctness rests on an LLM judge, not on running the constraints: the authors compare four judges with manual labels and report "precision and recall typically ranging between 0.7 and 0.85" (§5.1, Tab. 2).

## In plain words

LLMs code well in popular languages, but their effectiveness "drops significantly" in less popular languages such as domain-specific languages, which have few public examples (abstract; §1). The authors study two constraint languages, OCL and Alloy (notations for rules a software system's data must obey), and argue they are harder still: each rule refers to a model of the domain that must be given or invented, and rules can't always be run (§1). They build a configurable pipeline that writes code from English descriptions of rules, checks it with a parser, lets an LLM judge decide whether it is correct, and can ask an LLM once to repair a failure. With it they compare languages, models, prompts, task delivery, attempts and repair (§3, §5.3). They report that "in general, LLMs have better performance for Python than for OCL and Alloy", that LLMs with smaller context windows, such as open-source ones, "may be unable to generate constraint-related code", and that repair and multiple attempts "can improve the quality" while the prompt template has "less impact" (abstract). They present the framework, the study and the experiments as "novel contributions" (§1).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk) · [automated program repair](#/glossary/automated-program-repair) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) (here OCL and Alloy, §1) · [low-resource programming language](#/glossary/low-resource-programming-language) (DSLs, §2.2) · [chi-square test of independence](#/glossary/chi-square-test-of-independence) (prompt template against correctness, §5.3.3, Eq. 5)

**The paper's own terms:**
- **OCL and Alloy**: "formal constraint and query languages" for integrity constraints of software systems, "such as invariants, pre-conditions and post-conditions" (rules that always hold, or hold before or after an operation) (§1). OCL (Object Constraint Language) states constraints over UML (a standard diagram notation for software models) class diagrams; Alloy is a declarative specification language checked with its tool, the Alloy Analyzer (general descriptions). USE ("UML-based Specification Environment") validates and tests OCL constraints within UML models (§5.1, §6).
- **Domain model** (or conceptual model): a software model of the domain, here a UML class diagram (classes and their associations), given in PlantUML (a text notation for diagrams) or in natural language (§2.1 footnote 2; §3.1). The **domain description** is an English text about the domain (§3).
- **Coding task**: the English description of one constraint (§3.1).
- **Well-formed**: code that "follows the syntactic rules of the language" (§3.3). **Correct**: code that is executable and "complies with the natural language specification" of its task (§3.4).
- **Prompt templates PT1–PT9**: which inputs the prompt carries: the domain description, a formal or natural-language domain model, or a model the LLM first explains ("Explain DM") or writes itself ("Code DM") (§3.1, Tab. 1). PT1 gives only the domain description.
- **Task delivery**: OP1 batch (all of a domain's constraints in one prompt), OP2 chained sequential, OP3 isolated (one prompt per constraint) (§3.1). The experiments compare batch and isolated (§5.3.4).
- **Accuracy**: the share of tasks correct at the first attempt, equal to pass@1 (§3.4, Eq. 2).
- **Precision and recall** of a check, against manual labels: of the snippets the check accepts, the share the manual evaluation also accepts; of those the manual evaluation accepts, the share the check accepts (§5.1, Eq. 3–4).

**Missing glossary terms:** none.

**Builds on:**
- Earlier OCL generation work, Abukhalaf et al. [39] with Codex and PathOCL [14] with GPT-4, and Pan et al. [13], who fine-tuned a model for OCL; the two datasets come from [14] and [13] (§5.2, §6).
- Hong et al. [41], a qualitative study of LLMs completing Alloy formulas (§6).
- Repair from compiler or test feedback as in Olausson et al. [19] ([Is Self-Repair a Silver…](#/papers/olausson2023selfrepair "Is Self-Repair a Silver Bullet for Code Generation? (2024)")) (§6).

## Problem and setting

- **Question:** one research question per factor: target language, LLM, prompt template, task delivery, and attempts with or without repair (§5.3.1–5.3.5).
- **Data:** 182 constraints from the two OCL datasets (§5.3). Neither had domain descriptions, so Gemini 2.5 Pro wrote them from the PlantUML model and the constraints (§5.2, Fig. 6). The datasets' reference solutions exist only in OCL and are not used (§5.2). The Pan et al. dataset is "not fully used", partly because prompts exceeded models' context windows (§5.2).
- **Output form:** one true-or-false Python function, or one Alloy `fact` (a constraint that always holds), per constraint; OCL needs no guideline (§4.3).
- **Checks:** well-formedness by ANTLR parsers (ANTLR: a parser generator; grammars from the grammars-v4 repository) for OCL, Alloy and Python (§4.1). Correctness by GPT-4o-mini as judge for every language, given the coding task and the domain description (§4.2, Fig. 4).
- **Models:** GPT-4o, GPT-4o-mini, DeepSeek Coder 6.7B and Llama 3.1 (§4.3; Llama's size isn't given in the text); temperature 0.3 for multiple attempts (§4.3). Metrics: accuracy and pass@k with k = 3 (§3.4, §5.3).

## Approach

- **Four stages** (§3, Fig. 1): (A) build prompts from a template; (B) call the LLM and extract one snippet per task (§3.2); (C) well-formedness check; (D) correctness check, only for well-formed snippets.
- **Repair** (§3.3–3.4, Fig. 2–3): a snippet that fails the parser goes, with the parser's error message, to an LLM that explains the error, then to a second LLM that writes a new version (one LLM and one prompt would also do); one that fails the judge goes, with the judge's feedback, to an LLM for a fix. Only one round: if the repaired snippet fails again, the task counts as failed (§3.3).
- **Prompt dimensions** (§3.1): "Augmentation", which uses "Chain of Reasoning (CoR) strategies, which encourage iterative prompting" (the Explain DM and Code DM templates use two prompts), and "Task-Oriented Prompting" (task delivery).
- **Pluggable parts:** the correctness validator is a "plug-and-play component" that could host e.g. unit testing (AUnit for Alloy) or formal verification tools (§3.4).

## Results

- **Validating the judge** (§5.1): one author evaluated 1,512 snippets by hand, running the syntactically valid ones in USE, the Alloy Analyzer or a Python interpreter. Four judges (GPT-4o-mini, DeepSeek, o3, Llama-3.3) reach "precision and recall typically ranging between 0.7 and 0.85" against these labels (Tab. 2), with o3 tending to overestimate correctness in Python relative to GPT-4o-mini. The authors say the parser agrees less with the manual well-formedness labels, since the manual check also ran the code (§5.1). The authors conclude that judges "provide a reliable approximation of human correctness judgments" (§5.1).
- **Language** (§5.3.1, Fig. 7): "Almost 100% of the Python code generated in the experiments is well-formed, but correctness is only achieved in (at most) 80% of the experiments"; OCL and Alloy "already have problems with well-formedness" and more correctness errors. Causes the authors suggest: niche operators such as Alloy's subset operator `in`, and no standard library for dates, so where dates are involved LLMs often invent date functions; derived attributes (values computed from others) and implicit logic are hard, multiplicity constraints (how many objects may be linked) mostly handled.
- **LLM** (§5.3.2, Fig. 7): GPT-4o is best, GPT-4o-mini close except on OCL. DeepSeek and Llama 3.1 do "much worse"; DeepSeek "has an edge when generating Alloy code" but reaches "40% of well-formed code snippets for Alloy and, within those, less than 15% of the correct ones", which makes open models "unusable in practice" for these DSLs in the authors' view. Later experiments use only the two GPT models.
- **Prompt template** (§5.3.3, Fig. 8, Tab. 4–5): a chi-square test finds a significant effect in 2 of 6 language–model pairs (Alloy with GPT-4o, OCL with GPT-4o-mini), with no shared trait among the best or worst templates; "This disproves our initial hypothesis". PT1 is recommended because "it uses the least number of tokens" (Tab. 4).
- **Task delivery** (§5.3.4, Fig. 9): comparable for batch and isolated, except OCL, "where there is a clear advantage from generating invariants individually". Separate calls may assume different structures for the same domain (an attribute in one, an association in another), so, also for cost, the authors prefer batch delivery.
- **Attempts and repair** (§5.3.5, Fig. 10; GPT-4o and GPT-4o-mini pooled): more attempts raise correctness with diminishing returns; one round of repair adds "10-20%" correctly generated tasks; both together give the best results at the highest cost. Multiple attempts "generally" beat repair after a failed attempt (§5.4).

## Limits the authors state

- Results "may differ for other general-purpose languages and DSLs", since performance depends on the language's presence in training data (§5.5).
- A fixed set of LLMs; others "may achieve different performance". Mistral 7b, Code Llama 7b, Qwen 2.5 Coder 7b and Granite Code 8b were dropped for reasons including hardware incompatibility (an RTX A5000 with 24 GB), freezing, or responses of 5–10 minutes (§5.5).
- The LLM judge is "less precise than manual evaluation" (§5.5). Automatic well-formedness "relies solely on a parser and checks only syntactic correctness" (§5.1).
- The datasets bring "external biases": some constraints, e.g. on dates, may be easier in Python, "leading to unfair comparison" (§5.5).
- The LLM-written domain descriptions may differ from human ones, e.g. being "more concise, less ambiguous or more predictable", "limiting our ability to generalize" (§5.5).
- Open models' context windows were too small for some tasks (§5.3), and the framework "does not currently implement or rely on RAG" (§4.3).
- The delivery comparison ignores whether separately generated constraints can be integrated (§5.3.4).

## Open problems and building blocks

- **Open:** future work (§7): RAG to retrieve "the relevant pieces of the domain model"; offering the checkers to LLMs as tools, e.g. through the Model Context Protocol (a standard for giving LLMs tools); using generated code as fine-tuning data; other datasets and languages. Future work could cover a broader range of low-resource DSLs, with fine-tuning or tailored prompting (§5.5). AUnit's test-case concepts "could be instrumental in automating correctness validation for generated code, even if further development is required" (§6).
- **Released:** "Our implementation of the framework, together with all the experiments reported in the following section, is available on our Github repository" (§4.3 "Replicability package"); "all the software artifacts used in an open source repository" (§7); the domain-description prompt (§5.2, footnote 6).
- **To reuse it:** a domain model in PlantUML or text, a domain description and English coding tasks (§3); a well-formedness validator "such as a parser or compiler" per language (§3.3); an LLM judge (GPT-4o-mini here, §4.2); GPT-4o supports up to 128,000 tokens of context, far more than DeepSeek Coder 6.7B (§4.3).
- **Beyond its domain:** "Our framework supports any language" (§4), would "also work for GPLs" (general-purpose languages; §3.1 footnote 3), and "some lessons learned can also be relevant to other DSLs" (§7).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
