# Grammar Prompting for Domain-Specific Language Generation with Large Language Models

**Grammar Prompting** · NeurIPS 2023

Read: [PDF](https://arxiv.org/pdf/2305.19234) · [arXiv](https://arxiv.org/abs/2305.19234)  
Code: [grammar-prompting](https://github.com/berlino/grammar-prompting)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Few-shot generation of programs in domain-specific languages (DSLs): each demonstration carries the minimal subset of the DSL's BNF grammar needed for its output, and the LLM first predicts such a grammar for the test input, then the program (abstract; §3.1).
- The demonstrations' grammars are derived by parsing their outputs with the full grammar (§3.1); an Earley parser constrains decoding for API-only models (§3.2, Alg. 1); tested on semantic parsing (SMCalFlow, GeoQuery, Overnight), PDDL planning and SMILES molecule generation (§4).
- Evidence on teaching an LLM a rarely seen language through its grammar in the prompt, with a parser as the syntactic check; the authors report no improvement for DSLs "likely to have been frequently encountered during pretraining (e.g., regular expressions, SQL)" (§5), and a large gap between predicted and oracle grammars (§4.1).

## In plain words

Large language models learn many tasks from a few examples in the prompt, but the authors argue this falls short for domain-specific languages (small special-purpose languages, such as a calendar assistant's command language): such languages are "unlikely to have been encountered often enough (or at all) during pretraining for the LLM to acquire its full syntax" (§1). Grammar prompting adds to each example the grammar rules its answer uses, written in BNF (a standard notation for grammars). For a new request the model first writes the rules it expects to need, then a program that follows them, and a parser can enforce both steps (§3). With 16 to 32 examples and OpenAI's Codex model, it beats plain prompting on three benchmarks that turn requests into programs, even without the parser, but stays far below the accuracy reached when the model is given the true rules (§4.1, Tab. 1). The authors present it as "a simple approach" (abstract) and say they "are not aware of any existing work that uses formal grammars as the intermediate reasoning step" (§6). It brought no gains for languages likely common in pretraining, such as SQL (§5).

## Background and terms

**Terms to know:** [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form) · [semantic parsing](#/glossary/semantic-parsing) · [constrained decoding](#/glossary/constrained-decoding) · [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl) · [best-first search](#/glossary/best-first-search) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [context-free grammar](#/glossary/context-free-grammar) (the paper assumes each DSL's grammar is one, written in BNF, §2.1) · [Earley parser](#/glossary/earley-parser) (used to find the longest valid prefix and the terminals that can follow it, §3.2, citing Earley 1970)

**The paper's own terms:**
- **DSL**: a domain-specific language whose syntax an expert-written grammar fully specifies; the paper assumes that grammar is context-free and written in BNF (§2.1).
- **Specialized grammar**: a grammar made of a subset of the full grammar's rules (§3.1).
- **Minimal specialized grammar** of a program: a specialized grammar that can generate the program and from which no rule can be dropped without losing it. It is obtained by parsing the program with the full grammar and keeping the rules the parse used (§3.1). A program "may have more than one" because of extended BNF rules (rules with repetition operators such as +), but "In most applications we consider" there is one (§3.1, footnote 3).
- **Metalanguage**: "languages used to describe other languages" (§3); BNF is one, expected in training corpora "with some frequency" (§3).
- **Metagrammar**: the grammar of grammars, used to check the model's predicted grammar (§3.2).
- **Grammar constraint / program constraint**: the predicted rules must come from the full grammar; the program must parse under the predicted rules (§3.2, Tab. 1).
- **Oracle grammar**: the reference program's own minimal grammar given to the model in place of a predicted one (Tab. 1).
- **Program accuracy / execution accuracy**: the predicted program equals the reference program, or, where possible, the two give the same result when run (§4.1).
- **True few-shot setting**: only 16–32 demonstrations, against **retrieval-based in-context learning**, which picks the demonstrations from a large training set by similarity (§4.1).
- **Macro-operators**: actions that combine several planning actions, e.g. pick up and stack (§4.3, footnote 10).

**Builds on:**
- Prompts with intermediate reasoning steps (§1, §6): scratchpads (Nye et al., 2021), PAL (Program-aided Language Models) (Gao et al., 2022; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")), chain of thought (Wei et al., 2022) and self-consistency (Wang et al., 2023; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")).
- Grammar-constrained decoding for semantic parsing (Shin et al., 2021; Scholak et al., 2021, PICARD (parsing incrementally to constrain decoding)), used as a baseline (§4.1).
- Silver et al. (2022): an LLM-written plan starts the planner's search; the planning baseline (§4.3).
- Guo et al. (2022): the few-shot molecule setting and its graph-grammar baseline (§4.2).

## Problem and setting

- **Question:** whether LLMs "can improve upon standard prompting for few-shot DSL generation by learning to predict and use grammars during in-context learning"; the experiments "are not necessarily intended to improve upon the state-of-the-art" (§4).
- **Assumptions:** access to the expert-defined grammar (§2.1); a parse proves syntax only, since "not all syntactically valid programs are semantically valid" (§2.1). The full grammar goes into the instruction when small enough (GeoQuery, Overnight-B, SMILES; tasks described below) (§3, footnote 2); SMCalFlow's, "around 4k tokens", does not (App. B).
- **Semantic parsing (§4.1):** SMCalFlow (human-written calendar requests), GeoQuery (questions about a US geography database) and Overnight-Blocks (questions about a synthetic block world). Main model: Codex (`code-davinci-002`, OpenAI's code model); Tab. 3 adds GPT-3.5, GPT-4 and Google's PaLM 2-L on 100 test examples, with fewer demonstrations because of GPT-3.5's context limit (§4.1).
- **Molecule generation (§4.2):** SMILES (a text notation for molecules) strings for three classes of monomers (molecules that link into polymers): Acrylates, Chain Extenders and Isocyanates, given 32, 11 and 11 example molecules; 100 molecules generated per class with GPT-3.5. Metrics: validity, diversity (average pairwise Tanimoto distance over Morgan fingerprints, a measure of structural difference), retrosynthesis score (share judged synthesizable, approximately via the Retro* model, a retrosynthesis planner) and class membership.
- **PDDL planning (§4.3):** Blocks, Depot and Satellite (three classic planning domains) from Pyperplan (a Python classical planner), 5 tasks as demonstrations and 10 for evaluation, GPT-3.5, three runs (Tab. 5). Metrics: search nodes created and expanded, and success rate.

## Approach

- **Prompt (§3.1, Fig. 2):** each demonstration is an input, its minimal specialized grammar and its program. At test time the model predicts a grammar, then a program conditioned on it: chain of thought whose intermediate thought is a grammar, though the grammar does not fix the program (§3.1).
- **Constrained decoding (§3.2, Alg. 1, Fig. 3):** per-token constraints would need an API call at each step, "which is prohitively expensive" for API-only models. Instead the model decodes a whole program; if it doesn't parse, an Earley parser returns the longest valid prefix and the terminals that may follow, and the LLM's probabilities pick one. The prefix plus that terminal goes back to the model for continuation. Codex scores each candidate; above 16 candidates, Sentence-BERT (a sentence-embedding model) first keeps the 16 closest to the failed prediction (App. A.1). Later models (e.g. GPT-3.5 and GPT-4) expose no such scores, so the planning runs use Sentence-BERT alone (App. A.1). Grammar prediction is constrained the same way, with the metagrammar (§3.2).
- **Molecules (§4.2, App. A.2):** grammars and molecules are sampled rather than decoded greedily, without constrained decoding, "as constrained decoding was found to decrease the diversity of samples".
- **Planning (§4.3, Fig. 5):** the predicted grammar lists the actions a plan needs; the LLM writes a plan within those actions; that plan seeds a greedy best-first search (GBFS) restricted to the predicted actions. Restricting the objects as well proved "too restrictive", helping only in Blocks, so only the action types are restricted (App. A.3).

## Results

- **Few-shot semantic parsing (Tab. 1, Codex):** with both constraints, grammar prompting reaches 88.9 execution accuracy on GeoQuery against 81.5 for standard prompting, 52.4 against 46.4 program accuracy on SMCalFlow, and 60.9 against 54.7 execution accuracy on Overnight-Blk. It also beats prompting with the linearized derivation tree (the parse tree written out as text), which carries more information (§4.1).
- **The oracle gap (Tab. 1):** with the oracle grammar the same columns reach 96.1, 80.0 and 94.2, "a large gap between using the predicted grammar versus using the oracle grammar" (§4.1).
- **Cost (§4.1, Tab. 7):** "constrained decoding requires roughly three times more API calls than unconstrained decoding".
- **Retrieval and out-of-distribution (Tab. 2):** grammar prompting "can improve results even in this setting, although the improvements are less pronounced" with retrieved demonstrations (§4.1), and on GeoQuery's Template, TMCD (target maximum compound divergence: seen symbols, new combinations) and Length splits (Shaw et al., 2021), which differ structurally between training and test. With eight functions held out of the retrieval set but present in the full grammar, execution accuracy rises from 63.3 to 90.8 (NewFunc).
- **Other LLMs (Tab. 3):** gains "in the majority of the settings", except SMCalFlow with GPT-3.5, "where both methods performed poorly", and GeoQuery with PaLM 2-L, "where standard prompting already performed well" (§4.1).
- **Molecules (Tab. 4):** better than standard prompting on all metrics for Acrylates and Chain Extenders (Chain Extenders validity 96.3 against 60.3), "mixed results for Isocyanates"; the authors write that both prompting methods "outperform the graph grammar baseline in terms of Retro score" (§4.2).
- **Planning (Tab. 5):** fewer nodes in Blocks with every task solved; in Depot, grammar prompting with macro actions "improves the success rate by 20% over the best competing baseline" (0.8 against 0.6); in Satellite, the authors find primitive actions give "the best performance" (§4.3).

## Limits the authors state

- "Grammar prompting did not yield any improvements for DSLs that were likely to have been frequently encountered during pretraining (e.g., regular expressions, SQL)" (§5).
- Constrained generation "led to increased API calls, and was not always beneficial for tasks beyond semantic parsing"; in molecule generation constraints "can sometimes result in lower diversity" (§5).
- With Earley-constrained generation, molecule validity improved but "other metrics, such as the retrosynthesis score, decreased significantly"; the capacity to apply BNF rules "still remains limited in text-focused LLMs" (App. A.2).
- In planning, "the constraints applied to prune objects can sometimes negatively impact performance, suggesting that relevant object selection is still very challenging for LLMs" (§5).
- SMILES "does not guarantee that a generated string corresponds to a valid molecule" (§4.2, footnote 9).
- The base-LLM comparison uses 100 test examples "Due to API cost" (§4.1); the planning runs are not meant to compete with state-of-the-art planners (§4.3).

## Open problems and building blocks

  - The predicted-to-oracle gap, "indicating opportunities for further work in this area" (§4.1).
  - Whether LLMs "can tackle DSL-open benchmarks such as LARC" (benchmarks with no fixed DSL, such as English-described puzzles) (§4.1).
  - Using the approach on molecule notations that guarantee validity, such as SELFIES, "remains an interesting avenue for future work" (§4.2, footnote 9).
  - Whether "finetuning of moderately-sized LLMs using specialized grammars can lead to better grammar-based models for DSL generation" (§5).
  - Using the annotated rules (App. A.1), and "strategies for more cost-efficient constrained decoding" (App. A.1).
- **Released:** "Code and data" (abstract, footnote).
- **To reuse it:** a context-free grammar of the DSL in BNF (§2.1) and a parser for it (§3.2); Codex-style log-probabilities for candidate scoring, else Sentence-BERT (App. A.1); room in the context for the full grammar, or leaving it out as for SMCalFlow (App. B).
- **Beyond its domain:** the authors suggest such techniques "can widen the scope of scientific problems for which LLMs could be effectively applied", since hypotheses can be written as DSL programs (§5), and that the results indicate potential for tool use and for "domains that intrinsically depend on DSLs" (§7).

## On this site

- **Discussed in:** [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
