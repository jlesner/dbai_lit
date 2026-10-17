# Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries

**Query4Regex** · Findings of EACL 2026

Read: [PDF](https://aclanthology.org/2026.findings-eacl.331.pdf) · [DOI](https://doi.org/10.18653/v1/2026.findings-eacl.331)  
Code: [Query4Regex](https://github.com/peer0/Query4Regex)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of regex transformation: given source regexes and a query naming one to three classical operations (union, intersection, concatenation, complement, Kleene star, bounded repetition), in English or in a small operation DSL, an LLM writes the resulting regex, which counts as correct only if a DFA equivalence test finds it equivalent to the target (abstract; §1, §3.1–3.3, PDF pp. 1–3).
- Targets are built by applying randomly sampled operation sequences to randomly sampled seed regexes (§3.2, PDF p. 3); six LLMs from 14B to 120B, loaded through Hugging Face, three of them reasoning models, zero- and five-shot with greedy decoding, scored on parsability, on equivalence over all instances and on equivalence over parsable outputs (§4–5, Tab. 2, PDF pp. 3–4; App. B, PDF p. 9), broken down by number of operations (Tabs. 3–4, PDF pp. 4–5) and, for two models in the DSL five-shot setting, by error type (Tab. 5, PDF p. 5).
- An exactly checked LLM benchmark for regular expressions with a composition-size setting (the number of operations) and compact models: the authors report that success falls as operations are added in both query formats (§5.2, PDF pp. 4–5), and that in their best setting unparsable outputs are "over half of the total instances" (§5.3, Tab. 5, PDF p. 5); they report the DSL's advantage as largest "for reasoning LLMs" (§6, PDF p. 5; §5.1, Tab. 2, PDF p. 4).

## In plain words

LLMs write code well, but the authors say their ability to precisely change existing structured data on instruction remains "relatively under-explored" (abstract, PDF p. 1). They pick regular expressions, whose transformations can be checked mathematically (§1, PDF p. 2). Their benchmark, Query4Regex, asks six LLMs to apply one to three operations, such as union or repetition, to given regexes, described in English or in a small program-like language. They report that the program-like format "significantly outperforms" English. They give "up to 6.74%p accuracy gains on average" (abstract, PDF p. 1) (%p meaning percentage points). Accuracy falls sharply as operations are added, and models often produce outputs that don't parse (abstract, PDF p. 1). They present it as "a new benchmark" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [finite-state machine](#/glossary/finite-state-machine) (see its finite-automaton paragraph) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [post-training quantization](#/glossary/post-training-quantization) (here NF4, a 4-bit format) · [regular expression and regular language](#/glossary/regular-expression-and-regular-language) (here "classical" operators only, §1, PDF p. 2) · [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence) (the paper's check, §4.3, PDF pp. 3–4).

**The paper's own terms:**
- **q_NL and q_DSL**: English queries, with "flexible and potentially ambiguous representations", or DSL queries `inputs :: op1 → var1; op2 → var2; …` naming each operation and intermediate result (§3.3, PDF p. 3).
- **Syn.**: share of all instances whose output parses; **Sem.**: share whose output accepts exactly the target's language (its set of matched strings) (§4.3, PDF pp. 3–4); **Sem.†**, **Filtered Ops**: Sem. over parsable outputs only, overall and per operation count (Tab. 2 caption; §5.2, PDF p. 4).
- **Reasoning LLMs**: Phi-4-reasoning and gpt-oss (Tab. 2 caption, PDF p. 4).

**Missing glossary terms:** none.

**Builds on** (§2, PDF p. 2):
- Regex generation from English "from scratch", unlike transforming given regexes: Park et al. (2019), Ye et al. (2020a,b; 2021), Mao et al. (2023).
- LLM program repair and bug detection, often checked by unit tests: Joshi et al. (2023), Chen et al. (2024) ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")), Wang et al. (2024), Wu et al. (2024) ([Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)")).

## Problem and setting

- **Question:** can LLMs apply instructed operations to given regexes, and does a DSL instruction beat English (§1, PDF p. 2)?
- **Data:** 1,000 instances with one, two or three operations: 671, 182, 147 (Tab. 1, PDF p. 3). Random operation sequences applied to random "simple, atomic regexes" give the target; each becomes an English and a DSL query, checked by the authors to match (§3.2, PDF p. 3).
- **Prompting:** zero-shot, or five-shot from a disjoint pool built the same way (§3.3, PDF p. 3).
- **Models:** Phi-4 (14B), Phi-4-reasoning (14B), gemma-3 (27B), Llama-3.3 (70B), gpt-oss (20B, 120B) (Tab. 2, PDF p. 4); greedy decoding, NF4 quantization for "large-scale models" (App. B, PDF p. 9).
- **Correctness:** DFA equivalence with the target (§4.3, PDF p. 3). The regexes' alphabet is not discussed.

## Approach

The model returns one regex per query; a parser decides Syn., a DFA test (Pyformlang, a library for formal-language operations) Sem. (§4.3, PDF pp. 3–4; App. B, PDF p. 9).

## Results

- **DSL against English** (§5.1, Tab. 2, PDF p. 4): substantially higher semantic correctness with the DSL, particularly "for larger models and those specialized for reasoning"; e.g. gpt-oss (120B) five-shot Sem.† from 36.20% to 62.47%. Since Syn. is "relatively similar", the authors say the gap suggests English's ambiguity frequently leads to wrong outputs. Abstract (PDF p. 1): "up to 6.74%p accuracy gains on average".
- **Model size** (§5.1, Tab. 2, PDF p. 4): Phi-4-reasoning (14B) has the highest Sem., 29.2% (DSL, five-shot), against 28.3% for gpt-oss (120B); the authors infer that architecture and reasoning data "can be more critical than raw parameter scale alone".
- **Composition** (§5.2, Tabs. 3–4, PDF pp. 4–5): "a steep degradation" from one to three operations for all models with English; five-shot "generally provides a performance uplift for simpler, single-operation tasks" but does not substantially mitigate the collapse on multi-step ones. With the DSL accuracy also falls, from a start notably higher especially for single operations and reasoning models, e.g. Phi-4-reasoning five-shot from 35.32% to 12.93%.
- **Errors** (§5.3, Tab. 5, PDF p. 5; DSL, five-shot): unparsable outputs are 539 of 1,000 for Phi-4-reasoning and 547 for gpt-oss (120B): "most errors are syntactic". Dominant semantic failure modes: scope leakage (losing the scope and order of operators) and partial correctness (sometimes ignoring the final operation).

## Limits the authors state

- Lookarounds (conditions on neighbouring text) and backreferences (repeats of an earlier matched part) are excluded because their formal verification "is non-trivial" (Limitations, PDF p. 6); §1 cites measurements that they occur in "only a small fraction of real-world regexes" (PDF p. 2).
- 1,000 instances with up to three operations is "a trade-off between analytical depth and the significant computational cost of inference"; larger and more complex datasets "could yield further insights", though the authors find the current one sufficient for robustly evaluating core compositional reasoning (Limitations, PDF p. 6).
- The DSL "does not fully solve the core challenge of multi-step, compositional logic" (§5.2, PDF p. 5).

## Open problems and building blocks

- **Open:** how LLMs handle lookarounds and backreferences, an open question in the authors' words; they plan "a larger Query4Regex benchmark" with more complex features (Limitations, PDF p. 6). Named bottleneck: a "weakness in compositional reasoning" (§6, PDF p. 5).
- **Released:** code (abstract, PDF p. 1).
- **To reuse it:** Pyformlang 1.0.10; Hugging Face Transformers and Accelerate, PyTorch; the BitsAndBytes library for NF4; NVIDIA A6000 and RTX PRO 6000 Blackwell GPUs (App. B, PDF p. 9); classical operators only (§1, PDF p. 2).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
