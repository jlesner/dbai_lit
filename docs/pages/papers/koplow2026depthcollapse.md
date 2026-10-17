# Tool Use Reduces Depth-Induced Collapse in OOD Reasoning

**Tool Use Reduces Depth-Induced…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.21061) · [arXiv](https://arxiv.org/abs/2602.21061)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A synthetic benchmark of out-of-distribution reasoning: the model rebuilds a random Boolean polynomial over GF(2) one term at a time; each step's labels are the next term XORed with a mask made of the earlier terms, which a solver given the earlier terms can strip and which, for one without them, hides each row more strongly as the number of earlier terms (the depth) grows; it measures next-step accuracy against depth, with and without code execution (abstract; §1; §3.1–3.2, Eq. 3).
- Proves, under the construction's sampling assumptions, that the earlier terms alone give no better than a chance guess at the next one (Lem. 3.1), that each data row alone is masked more strongly with depth (row-wise only, Lem. C.2, Cor. C.3), and that with the earlier terms known a polynomial-time decoder recovers the next term with high probability from a number of rows that does not grow with depth (Thm. D.1, Cor. D.2); checks with simulated estimators whether correlations across rows leave a shortcut (§3.2; §4.1, Fig. 3); runs four Qwen3-2507 models (4B and 30B-A3B, Instruct and Thinking) to depth 31 with a sandboxed Python loop of up to 10 runs (§4.2), and two frontier models, Sol 5.6 and Opus 4.8, at depths 15, 127 and 255 with the provider's code-execution tool (§4.3); an ablation keeps a successful tool step's history but disables execution (App. A, Fig. 5).
- Evidence that handing the step's computation to an interpreter keeps per-step success from decaying as composition depth grows, in both frontier models and the compact Thinking models: the authors report that without tools both frontier models get at most 1 of 100 next steps right at depth 255, while with tools they stay near perfect (§4.3; Fig. 4); small Instruct models still decline with depth even with tools (Fig. 4 caption), and the authors say the depth of collapse depends on the task (§5).

## In plain words

The authors argue that an LLM's out-of-distribution reasoning is "intractable to robustly measure" on ordinary tasks, which split into steps in many ways, some possibly memorized (abstract). They build a synthetic benchmark in which a model rebuilds a random formula of XORs of ANDs over bits, one term at a time, from labelled data. The data hide each new term behind a mask that the earlier terms cancel, and that grows stronger with depth, so the number of earlier terms measures depth (§1, §3.2). Without tools, they report, next-step accuracy "collapses as depth grows" in small and frontier models (abstract; §5): at depth 255, both frontier models get at most 1 in 100 right, against near-perfect accuracy when they can run code (§4.3). The abstract says code execution "prevents this collapse in both small and frontier LLMs"; the body says it "substantially mitigates" it (§1), and small Instruct (non-thinking) models still decline with tools (Fig. 4). They present the benchmark as filling a gap: "no method has been proposed to measure performance degradation as a function of compositional complexity" (§1).

## Background and terms

**Terms to know:** [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [exact match](#/glossary/exact-match) · [Bayesian credible interval](#/glossary/bayesian-credible-interval) · [GF(2) and algebraic normal form](#/glossary/gf2-and-algebraic-normal-form) (§1, §3.1) · [Jeffreys interval](#/glossary/jeffreys-interval) (the shaded intervals of Figs. 3–4)

**The paper's own terms:**
- **OOD reasoning**: "searching for and constructing novel recombinations of learned relationships to solve new problems" (abstract); the term applies "When both the problem and the decomposition required to solve it fall outside a model's training distribution" (§1).
- **Target, terms, address and payload bits** (§3.1): the hidden function is an XOR of n terms; term j is one *address bit* times an AND of d − 1 *payload bits* (d is the term's degree) (its *support*, a set of payload positions). An *instance* is the ordered list of supports, sampled once.
- **Depth g and prefix** (§3.1): at step g the model is given the first g terms (the *prefix*) and a fresh batch of labelled rows, and must name term g + 1.
- **Step success γ_g** (Eq. 1, §3.1): the probability that the proposed next term is exactly right; the trivial baseline γ_triv is chance (§4.2).
- **Estimator classes** (§3.1), by what they see: *Diligent* (𝒜: prefix and data), *Data-only* (ℬ), *History-only* (𝒞) and *Partial* (𝒟: part of both).
- **Statistical obfuscation sampler** (§3.2): the data generator; it sets the next term's address bit, clears later ones and flips fair coins for earlier ones, so each label is the next term's value XOR a mask from the active earlier terms (Eq. 3); payload rows have a fixed number of ones, chosen so each term is 1 as close to half the time as possible.
- **Effective prefix k⋆(g)** (§4.2, Fig. 10): the prefix length at which the partial estimator would match a model's observed accuracy, "the effective prefix the LLM behaves as if it integrated".

**Missing glossary terms:** none.

**Builds on:**
- The Diligent Learner of Shalev-Shwartz & Shashua (2025), which models reasoning as validator-guided search and shows that search can remain efficient when γ, the chance of proposing a next step that keeps the prefix completable, is bounded away from zero; it "does not measure whether modern LLMs satisfy this condition"; the authors "produce an empirical upper bound for this quantity" (§2).
- Program-aided reasoning and Reflexion, which it says it complements: "executable state can prevent the per-step success probability from decaying as the horizon grows" (§2; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)"), [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")).

## Problem and setting

- **Question:** "when a model is placed inside a search procedure, does it continue to assign nontrivial probability to the correct next step as the reasoning depth grows?" (§2).
- **Design goal:** the benchmark is designed so that the diligent solver stays above a constant while the other classes stay near chance (Eq. 2, §3.1).
- **Assumptions:** supports drawn independently and uniformly, with replacement (§3.2); payloads uniform among rows with a fixed number of ones (§3.2).
- **Prompt** (§3.3): single-turn, with the prefix as logical clauses and 32 rows of bits. The prompt names the active address variable, so the model must find only the d − 1 payload positions; a regex parser extracts the answer.
- **Correct** means the predicted payload positions exactly match the true ones, an O(d) check (§3.3).
- **Settings:** 12 payload bits and terms of degree 4 (3 payload bits each), so chance is 1/220 (Fig. 4).
- **Small models** (§4.2): Qwen3-2507 4B and 30B-A3B, each Instruct and Thinking, in vLLM (an LLM inference server), on 3000 instances split over depths 0, 1, 3, 7, 15 and 31. With tools, code blocks run in a RestrictedPython sandbox (a restricted Python runtime) and the result or error is appended, for up to 10 iterations.
- **Frontier models** (§4.3): Sol 5.6 and Opus 4.8 at high reasoning effort, at depths 15, 127 and 255; the tool condition exposes "the provider's code-execution tool". Per model, 10 requests per condition at depth 15, and 100 without tools and 50 with tools at each larger depth; accuracy is "among completed responses".

## Approach

- **History-only is chance** (Lem. 3.1): if supports are drawn independently and uniformly with replacement from all sets of d − 1 payload positions, then at every step the next support stays uniform and independent of the prefix, so any history-only estimator names it with probability at most one over the number of such sets.
- **Row-wise masking** (Lem. C.2, Cor. C.3): with supports drawn the same way, independently of the sampled rows, one row's label tells a solver that lacks the earlier supports about the next term only by an advantage that, when each term fires (evaluates to 1) with probability away from 0 and 1, shrinks exponentially with that row's number of active earlier terms; for a fixed batch size, the chance that any row has few of them also falls exponentially with depth. It is "a row-wise guarantee" that "does not by itself exclude information carried by correlations across rows", tested by simulation instead (§3.2).
- **Recovery** (App. D, Thm. D.1, Cor. D.2): with the prefix known, a solver XORs out the mask and intersects the payload sets of the rows labelled 1, an explicit polynomial-time decoder. For a fixed instance and payloads drawn independently and uniformly with a fixed number of ones (at least d − 1, fewer than all), the theorem bounds this decoder's failure chance in terms of how many rows are labelled 1; the corollary gives a sufficient batch size for any chosen failure chance, which doesn't grow with depth "in the benchmark regime of fixed degree, constant firing probability", with the chance that a given wrong position is set in a row labelled 1 "bounded away from 1" (§3.2).

## Results

- **Estimators** (§4.1, Fig. 3): only the diligent estimator keeps high step success; "For g ≥ 31, no partial-information estimator is able to solve the task".
- **Small models without tools** (§4.2, Fig. 4): "All models degrade as g increases"; 30B-A3B-Thinking "still deteriorates and collapses by g = 31".
- **Small models with tools** (Fig. 4, no value labels): tools help the Instruct models, but "accuracy still declines with depth"; "4B-Thinking sustains high accuracy and 30B-Thinking recovers near-perfect performance at larger depths", with no collapse "on the range tested for thinking models".
- **Effective prefix** (§4.2, Fig. 10): without tools, k⋆ grows with slope 0.71–0.85 for the 30B variants, so the gap to full integration widens; with tools, slopes are 0.96–1.08 across all four models and "error rate is essentially independent of depth".
- **Frontier** (§4.3): without tools, 10/10 (Sol) and 6/10 (Opus) at depth 15, falling to 1/100 and 0/100 at depth 255. With tools at depth 255, 44/46 (Sol) and 49/50 (Opus) among completed responses, or 88% for Sol counting four failed requests as failures.
- **Execution control** (App. A, Fig. 5): after a successful tool step at depth 31 (tool accuracy 0.870 for 4B-Thinking, 0.748 for 30B-Thinking), the history is kept but execution disabled; at depth 32, accuracy over up to three revisions is 0.2% falling to 0% for 4B-Thinking and 0.4% for 30B-Thinking, "near chance".
- **Why tools help:** the gain "arises in part from externalizing computation, reducing the compounding of errors within each reasoning step" (§5; argued in §4.3). "Smaller models collapse at lower depths than frontier models" (§1).
- **Tokens** (App. A, Fig. 7): at depth 31, tools raise average total tokens by at most about 35%, for 4B models making several calls.

## Limits the authors state

- "the rate of degradation and the depth at which collapse occurs will vary across tasks and depend on the factors discussed above" (§1); "The depth at which this collapse occurs and the tools that could mitigate it in practice depend on the task" (§5).
- The masking guarantee "is row-wise"; whether correlations across a batch give a shortcut is tested only empirically (§3.2).
- Frontier "Sampling is concentrated at the larger depths, so these measurements do not locate the precise onset of collapse"; the allocation was made "to reduce inference costs"; four Sol tool requests at depth 255 ended in server-overload errors (§4.3).
- "the evaluation scores individual proposals from supplied prefixes" (Fig. 2).
- 4B-Thinking's no-tool slope of 1.04 "is misleading": partial integration can give correct answers at small depths (§4.2, Fig. 10).

## Open problems and building blocks

  - "We hope future work builds on these findings to develop tools that support OOD reasoning on general natural-language problems" (§5).
  - "future research into tool-augmented systems for general natural-language tasks" (§1).
- **Released:** Nothing stated.
- **To reuse it:** "Consistent decoding required long contexts" (32,768 tokens for the 4B models, 81,920 for the 30B), and all small-model results took "under 80 hours of A100 compute" (§4.2); the frontier runs use the provider's code-execution tool (§4.3).
- **Beyond its domain:** the authors call the benchmark "general, as any computable function can be represented as a sufficiently large" GF(2) "polynomial" (abstract), and say the findings "establish a role for tools in supporting OOD reasoning beyond their conventional roles for augmenting knowledge and capabilities" (§1).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
