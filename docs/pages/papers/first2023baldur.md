# Baldur: Whole-Proof Generation and Repair with Large Language Models

**Baldur** · ESEC/FSE 2023

Read: [PDF](https://arxiv.org/pdf/2303.04910) · [arXiv](https://arxiv.org/abs/2303.04910) · [DOI](https://doi.org/10.1145/3611643.3616243)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Fine-tuned LLMs generate whole Isabelle/HOL proofs at once, instead of one step at a time inside a search (abstract).
- A repair model gets the failed proof and the checker's error message (abstract).
- One round of propose → check → repair (one repair attempt per failed proof, §3.4), with a proof checker as the check.

## In plain words

Writing machine-checked correctness proofs by hand is "often prohibitive" in cost (§1). Earlier neural provers predict one proof step at a time and search over steps, checking each step (§1). Baldur fine-tunes Minerva, a language model pretrained on mathematics, to write a whole proof for a theorem in the Isabelle prover at once; the checker then accepts or rejects each sampled proof. A second fine-tuned model repairs a failed proof using the checker's error message, and a variant also reads the lines before the theorem in its source file (§2).

On 6,336 test theorems of the PISA benchmark (theorems from public Isabelle proof libraries), the authors report up to 47.9% proved, by their larger model with that context and 64 samples per theorem (Tab. 4). The Thor paper reports 39.0% for a step-by-step search-based model (§3.3). Together with Thor, a step-by-step prover that alone proves 57.0%, Baldur proves 65.7% (abstract, §1). The authors say the paper "demonstrates for the first time" that whole-proof generation "is possible and is as effective as search-based techniques without requiring costly search" (abstract).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [hammer (automated theorem proving)](#/glossary/hammer-automated-theorem-proving) · [pass@k](#/glossary/passk) · [top-k sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [data contamination](#/glossary/data-contamination) · [automated program repair](#/glossary/automated-program-repair) · [premise selection](#/glossary/premise-selection) (premises are "definitions and previously proven statements"; some provers, such as HOList, "focus entirely" on it, §2.3)

**The paper's own terms:**
- **proof step, proof state**: a proof is a sequence of proof steps; the proof state "consists of the current goal to prove and the list of known assumptions" (§1).
- **neural theorem prover**: a search-based tool whose neural network predicts the next proof step, which the proof assistant then evaluates (§1).
- **hammer**: "Hammers iteratively apply known mathematical facts using heuristics" (§1); Sledgehammer is Isabelle's. They "lack the ability to employ certain tactics, such as induction" (§5).
- **theory file context**: the lines of the Isabelle source file (theory file) before the theorem, which can include definitions, theorems, proofs and comments (§2.3).
- **declarative proofs**: Isabelle "uses a declarative proof language that is designed to be human-readable", unlike Coq, whose proofs are "typically written in a procedural style" (§2.1).
- **proof rate**: the share of test theorems for which Isabelle accepts at least one sampled proof (§2.1, Tab. 4); in the glossary's terms (ours), a pass@k with the proof checker as judge. Figs. 5–6 plot it against proof attempts, a repair counting as one (§3.4).
- **theorem-wise vs project-wise split**: test theorems drawn at random, so neighbouring theorems may be in training, against test projects kept apart from training ones (§4).

**Builds on:**
- Thor (Jiang et al., 2022, [33]): a 700-million-parameter language model in a step-by-step search that calls Sledgehammer; the main comparison and source of the baselines (§3.3, §3.7).
- LISA (Jiang et al., 2021, [34]): "the most closely related work" (§5), a fine-tuned language model inside a search; its PISA dataset and codebase supply Baldur's data and checker (§3.1–3.2).
- Minerva (Lewkowycz et al., 2022, [48]), pretrained on a mathematics corpus: the model Baldur fine-tunes (§2.4).
- Draft, Sketch, and Prove (DSP; Jiang et al., 2022, [35]): an LLM turns informal proofs into sketches that Sledgehammer completes; Baldur instead fine-tunes and needs neither (§5).

## Problem and setting

- **Questions (§3):** how well LLMs generate whole proofs (RQ1), repair them (RQ2), use context (RQ3), scale (RQ4), and compare with other provers (RQ5).
- **Data (§3.2):** Isabelle/HOL (Isabelle with its higher-order-logic library). PISA holds the Isabelle/HOL library and the Archive of Formal Proofs (AFP), a large collection of Isabelle developments, including "mathematics proofs and verification of software and hardware systems". The authors follow PISA's 95%/1%/4% train/validation/test split, which is random and theorem-wise (§4).
- **Test set (§3.2):** 6,336 theorems after dropping "lemmas" entries, which are not proper theorems. Prior work reported on 3,000 randomly chosen test theorems; the authors use the complete test set.
- **What counts as proved (§2.1, §3.1):** Isabelle accepts the sampled proof in the theorem's original context. The checker discards proofs containing "sorry" or "oops", keywords that skip a proof yet pass the checker, and times out each proof step after 10 seconds. The authors call the prover "an absolute oracle for the correctness of the proof" (§5).

## Approach

- **Proof generation model (§2.1, Fig. 1).** Whole proofs are rebuilt from PISA's per-step examples; the model learns to map a statement to its proof without the proof states, which "is not necessarily a problem" for declarative proofs, the authors argue. It samples a fixed number of proofs ("typically 16 or 64"), all checked. Sampling uses a temperature tuned between 0.0 and 1.4 (§2.1, §3.4) and top-k sampling with k = 40 (§2.4).
- **Proof repair model (§2.2, Figs. 2–3).** Training data: the generation model tries each training theorem once at temperature 0; each failure's statement, failed proof and error message form an input whose target is the human-written proof. Deduplicated failed proofs each get one repair attempt at temperature 0, and a control model sees the same inputs without the error message (§3.4).
- **Adding context (§2.3).** Up to 50 preceding statements of the theory file are prepended and cut from the left to fit. The authors set it apart from premise selection: it "only requires rudimentary text processing", "can only observe a small fraction of the available premises", and is mostly proofs.
- **Model details (§2.4).** Minerva 8b and 62b; 1,536 input and 512 target tokens in all experiments except the repair study, which used 1,024 and 1,024.

## Results

- **Whole proofs (§3.3).** The 8b model without context proves 34.8% with 16 samples and 40.7% with 64; Baldur variants reach "up to 47.9%". Against these the authors set Sledgehammer at 25.6% and Thor's search-based language-model baseline at 39.0%, both from the Thor paper. RA1: "LLMs can generate full proofs just as well as smaller language models augmented with a search strategy". By one measure, resources reserved per proof, that search takes an 8-core TPU for 216 seconds (Thor's figure, footnote 2) and Baldur about 35 seconds for 64 samples, "a difference of factor 6", leaving proof checking out on purpose. §6 calls the approach "more effective and more efficient than prior methods that use one-step-at-a-time search-based generation".
- **Repair (§3.4, Fig. 5).** Generate + repair proves 36.3% against 34.8% for generation alone at 16 samples, where repair uses half the samples plus one repair each (Tab. 4); §1 calls this 1.5% more "even when controlling for the computational cost". Without error messages, repair "does not surpass" generation at equal cost, which "suggests that the information in the error message is crucial". §5 calls the work "the first we are aware of to use error messages for a proof repair task".
- **Context (§3.5, App. A).** At 64 samples the 8b model rises from 40.7% to 47.5% with context. In 5 randomly sampled theorems solved only with context, "it appears that the model frequently makes use of similar proofs in the context", which "suggests that the addition of context does not play the same role as premise selection".
- **Model size (§3.6, Fig. 6).** With context, 62b adds 1.3 points over 8b at 16 samples (42.2%) and 0.4 at 64 (47.9%). RA4: performance "improves with the scale of the language model".
- **Against Thor (§3.7, Tab. 7).** Thor solves 57%, a "significant gap" to Baldur's best; Baldur 8b with context and Thor together reach 65.7%, which, they argue, supports that the two improve by "largely orthogonal" means. By AFP topic, Baldur does better than Thor on tools, similarly on logic and worse on mathematics and computer science; for mathematics they hypothesize that premise selection may be particularly useful and that Thor's use of Sledgehammer is "likely what gives it a leg up".
- **Repeated repair (§4).** At temperature 0, a second repair round proves slightly more than generation at an equal cost of three attempts.

## Limits the authors state

- "there is the potential for proofs from the test set to have leaked into the LLM pretraining data": Minerva's pretraining data excludes PISA but has code "that may include some Isabelle/HOL proofs found in PISA" (§3.2).
- 62b hyperparameters were not tuned as well "due to the higher cost of these experiments" (§3.6).
- Repair and generation sample counts don't align exactly, since duplicates are removed before repair (§3.4).
- The context examples are not "large enough to make quantitative judgements" (§3.5).
- "comparisons across different neural theorem provers are hard in general" (§3.7).
- Error messages report the first error, "typically from the first couple of lines of the predicted proof. So the proof repair model will only learn to address these types of errors"; future work needs repair data that "better mirrors the required changes", which could, for example, come from prefixes of human proofs (§4).
- A tool that may have seen proofs from the same development, "as may happen with a theorem-wise split", "may not perform as well" on entirely new projects, the setting of a project-wise split such as CoqGym's (a Coq benchmark); splits matched to goals are one of their three directions (§4).

## Open problems and building blocks

  - A learnable proof search that keeps repairing the repair model's own attempts (§4).
  - Porting the techniques across proof assistants for direct comparison; cross-assistant suites such as MiniF2F (Math Olympiad problems in several assistants) "still have their limitations" (§4).
  - Caching in LLM prediction servers could avoid re-encoding context at each search step, "beyond the scope of our work" (§1, footnote 1).
- **Released:** Nothing stated.
- **To reuse it:** a fine-tuned LLM (Baldur is designed "to be able to work with any LLM internally", §1; evaluated with Minerva 8b and 62b); TPUv3 hardware (§3.1); the PISA checker for Isabelle, run in Docker (§3.1); proofs without proof states as training data (§2.1).
- **Beyond its domain:** the authors name repair approaches "for proofs and, potentially, more traditional automated program repair tasks" as an avenue the work opens (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/prove-general">prove-general</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
