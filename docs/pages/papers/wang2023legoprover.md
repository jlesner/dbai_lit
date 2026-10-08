# LEGO-Prover: Neural Theorem Proving with Growing Libraries

**LEGO-Prover** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2310.00656) · [arXiv](https://arxiv.org/abs/2310.00656)  
Code: [LEGO-Prover](https://github.com/wiio12/LEGO-Prover)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Proves Isabelle theorems with ChatGPT block by block: a decomposer proposes sub-goal lemmas, a formalizer writes the proof using lemmas retrieved from a growing skill library, and an evolver generalizes library lemmas and proves the requested sub-goals (abstract; §3; ChatGPT, §4.1).
- Only lemmas Isabelle verifies, with no `sorry` or `oops`, enter the library; failed lemma statements are kept as requests for the evolver (§3.2, §3.3). Evaluated on miniF2F with 100 attempts per problem, in rounds so the library grows between attempts (§4.1).
- A memory across problems whose entries a sound checker admits. The authors report that 24% of the miniF2F-valid problems it proved used retrieved skills (§4.3.2); [Is This LLM Library…](#/papers/berlotattwell2025libraryfails "Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour (2026)") re-runs it and reports "no evidence of the direct reuse of learned lemmas" (abstract; one verbatim reuse in its Tab. 2). Bears on [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory).

## In plain words

Earlier LLM provers write each formal proof as one block and attack each problem alone; the authors argue that they "assume a fixed theorem library during the whole theorem proving process" (abstract), so lemmas that different problems may share are not reused once proved (§1). LEGO-Prover keeps a growing library of helper theorems (lemmas), each admitted only after the Isabelle proof checker accepts it. Per problem, ChatGPT proposes helper lemmas and writes a proof that may copy retrieved lemmas; new lemmas that check join the library. A second loop has ChatGPT generalize stored lemmas and prove lemmas the prover requested (§3). On miniF2F, high-school competition problems, they report success rates of 57.0% (validation half) and 50.0% (test half) against 48.0% and 45.5% for the strongest earlier method they compare with, at 100 attempts per problem, counting a problem solved with either model-written or human-written natural-language proofs (abstract, Tab. 1). They present this as advancing "the state-of-the-art pass rate" (abstract), and a growing skill library as "a gap that our work seeks to fill" among the methods they discuss (§2).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [autoformalization](#/glossary/autoformalization) · [tactic](#/glossary/tactic) · [hammer](#/glossary/hammer-automated-theorem-proving) · [dense retrieval](#/glossary/dense-retrieval) · [retrieval-augmented generation](#/glossary/retrieval-augmented-generation-rag) · [expert iteration](#/glossary/expert-iteration)

**The paper's own terms:**
- **skill**: a lemma that Isabelle has verified, stored with its statement and its proof; the paper uses "skill" and "lemma" interchangeably (§3.1). In the glossary's terms this is not an [agent skill](#/glossary/agent-skill) (a text file of instructions) but a checked piece of proof code (our bridge).
- **skill library**: three vector stores (§3.1): the *lemma* store (the verified skills), the *request* store (lemma statements the prover asked for) and the *problem* store (the formal statements of the miniF2F problems, which the evolver uses "as heuristics" to guide new lemmas).
- **request**: a lemma statement the decomposer proposes as possibly useful, preceded by chain-of-thought on why it is needed (§3.2); the statements of lemmas that failed verification are also added as requests (§3.2).
- **plain provers**: the authors' name for earlier methods that "generate the whole proof directly" (§1, Fig. 1(a)).
- **prover**: the three steps run per problem: the *informal solver* drafts a natural-language proof, the *decomposer* rewrites it step by step closer to Isabelle's structure and proposes requests, and the *formalizer* writes the Isabelle proof with retrieved skills in its prompt (§3.2, Fig. 2(a)).
- **evolver**: the second loop, with a *directional transformer* that rewrites a stored skill in one of four directions (extend dimensions, identify key concepts, parameterize, scale complexity; Tab. 2) and a *request solver* that tries to prove stored requests (§3.3, Fig. 2(b)).
- **valid proof**: one that contains no "cheating" keywords (`sorry` or `oops`, which "exit a proof without completing it") and that Isabelle verifies together with the problem's formal statement (§3.2).
- **LEGO-Prover\***: the "cumulative pass rate" over the runs with model-generated and with human-written informal proofs (Tab. 1 caption).
- **skill-evolving tree**: a lemma from the prover or the request solver as root, with the directional transformer's generalizations as children; the grown library is "a massive forest" of such trees (§4.3.1, Fig. 3(c)).
- **direct use / propose lemma by imitation**: the two ways a retrieved skill helps: copied into the proof as is, or used as a model for writing a new lemma (§4.3.2, Fig. 4).

**Missing glossary terms:**
- **vector store**: a store of documents with their embedding vectors that, given a query, embeds it and returns the nearest stored documents; here ChromaDB with an OpenAI embedding model and k-nearest-neighbour (k-NN) lookup (§3.1, footnote 2).

**Bridges to the glossary:** each problem gets 100 attempts and counts as a success when a proof is found; this is close to [pass@k](#/glossary/passk) at k = 100, except that the attempts are not independent, since the library grows between them (our reading of §4.1).

**Builds on:**
- Draft, Sketch, and Prove (Jiang et al., 2022b; not listed here), a three-step LLM approach that formalizes proofs "using natural language as guidance" (§2): LEGO-Prover follows its problem setting, model-written informal proofs, heuristic tactics and 100-attempt budget (§3, §3.2, §4.1).
- Subgoal-Learning (Zhao et al., 2023; not listed here), which the authors say "advances" Draft, Sketch, and Prove with cross-verified informal proofs (§2); the strongest baseline in Tab. 1.
- Thor (Jiang et al., 2022a) and Thor with expert iteration (Wu et al., 2022), search-based provers that "use a fine-tuned 700m language model" (§4.1); baselines, not listed here.
- Skill-based agents: Voyager (Wang et al., 2023a; [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")), a Minecraft agent with a "dynamic growing skill library", and Cai et al. (2023; [Large Language Models as Tool Makers](#/papers/cai2023toolmakers "Large Language Models as Tool Makers (2024)")), which makes reusable Python tools (§2).

## Problem and setting

- **Question:** can an LLM prover that proves and stores reusable lemmas, and keeps rewriting them, solve more formal math problems than provers that start from a fixed library (abstract, §1)?
- **Checker:** Isabelle, a proof assistant, driven through PISA, "a flexible Python REPL wrapper for Isabelle" that verifies code and reports proof states and errors (§4.1). When a proof step fails, the prover tries 11 heuristic tactics and Sledgehammer, Isabelle's hammer, as "auto-correction" (§3.2).
- **What "correct" means:** a valid proof as defined above (§3.2); the success rate is "the proportion of successful formal proofs found" (§4.2).
- **Benchmark:** miniF2F, 488 high-school competition problems from the MATH dataset (competition math problems), AIME (American Invitational Mathematics Examination) and IMO (International Mathematical Olympiad), split into valid and test sets of 244 each, in the version from Draft, Sketch, and Prove (§4.1).
- **Inputs assumed:** following Draft, Sketch, and Prove, "each theorem is equipped with an informal statement, a human-written informal proof, and a formal statement" (§3). Runs use either the human proof or one of up to 20 informal proofs pre-generated by GPT-4, picked at random per attempt (§4.1).
- **Models:** "ChatGPT", a random mix of five gpt-3.5-turbo versions per OpenAI API call, at temperature 0.7, for both prover and evolver (§4.1, footnote 3).
- **Budget:** 100 attempts per problem, run "through successive rounds, with each round addressing each valid/test set problem once", so the library grows between attempts; the ablation uses 50 attempts on the valid set only (§4.1).

## Approach

- **Skill library (§3.1).** Retrieval is by embedding similarity; only Isabelle-verified lemmas enter the lemma store.
- **Prover (§3.2, Fig. 2(a)).** The decomposer (3-shot prompt) produces a step-by-step informal proof and requests, which go into the request store. The formalizer retrieves skills using the requests and the problem statement as queries (6 skills on the valid set, 4 on test; §4.1) and is asked for the complete Isabelle source file, so it may state and prove lemmas before the main theorem (§3.2). After checking, "all validated lemmas or theorems" are added to the library and failed lemma statements become requests (§3.2).
- **Evolver (§3.3, Fig. 2(b)).** The directional transformer picks a least-evolved skill, retrieves related pending problem statements and requests, "arbitrarily selects" one direction and prompts for a new skill. The request solver picks a least-solved request, retrieves related skills, and prompts for a proof. Each result is checked by Isabelle and compared with existing skills (difflib's SequenceMatcher, threshold 0.85) "to mitigate the risk of redundancy" before it is added (§3.3).
- **Running:** prover and evolver run as parallel processes in a 3 : 8 ratio (§4.1); prompts in App. A.1 (Figs. 5–8).

## Results

- **Main comparison (Tab. 1, §4.2).** Against Subgoal-Learning's 48.0% (valid) and 45.5% (test), the authors report LEGO-Prover\* at 57.0% and 50.0%. With human-written informal proofs alone it reaches 55.3% and 50.0%, which they report as improvements of 7.3% and 4.5% over Subgoal-Learning (§4.2). With GPT-4-written informal proofs it reaches 52.4% and 45.5%, which the authors call "close to the results with human-written informal proofs" (§4.2). The other baselines score lower (Tab. 1).
- **Ablation (Tab. 1, §4.2, Fig. 3(a)).** At 50 attempts on the valid set, removing the growing library (and the evolver) lowers the success rate from 50.4% to 47.1%. The authors report that the gap is small at first and "widens consistently" as the library grows (§4.2).
- **The library (§4.3.1).** The grown library holds 22,532 skills ("over 20,000" in the abstract): 10.8% from the prover, 38.2% from the request solver and 51.1% from the directional transformer.
- **How skills are used (§4.3.2, Fig. 3(b), Fig. 4).** By manual inspection of the 135 miniF2F-valid problems proved (the human-informal-proof run, per Fig. 3(b)'s title), the authors report that 24% were completed with the aid of retrieved skills; of these, 51% used a retrieved skill directly and 49% wrote new lemmas modelled on retrieved ones. The section and Fig. 3(b) break the directly used skills down by the step that produced them.

## Limits the authors state

- The ablation was run only "under 50 proving attempts per problem on the miniF2F validation set", due to "limited resources and the expense of OpenAI API calls" (§4.1).
- Lemmas from the prover "are mostly problem-specific, rendering them non-reusable with limited applicability", and few (§3.3).
- "the advantage of adding the skill library is initially minimal, as the libraries are still underdeveloped and lack useful skills" (§4.2).
- "some lemmas are trivially true or already exist in Isabelle's theorem library" (§4.3.1).
- Direct reuse, "the most ideal usage", solved few problems: "the problems solved by directly reusing the skill are not substantial", which the authors attribute to many miniF2F problems being solvable "without requiring any skill as a reference" (§4.3.2).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "We also release our code and all the generated skills" (abstract); "Code and data can be found at" the authors' repository (abstract, footnote 1).
- **To reuse it:** Isabelle with PISA (§4.1); ChatGPT through the OpenAI API, plus GPT-4 for model-written informal proofs (§4.1); ChromaDB and an OpenAI embedding model for retrieval (§3.1, footnote 2); problems that come with a formal statement, an informal statement and, for the human-proof setting, an informal proof (§3); an API cost "Estimated to be around 300 dollars for one experiment with 100 proof attempts" (§4.1, footnote 4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
