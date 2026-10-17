# Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs

**Tokenization counts** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2402.14903) · [arXiv](https://arxiv.org/abs/2402.14903)  
Code: [TokenizationCounts](https://github.com/aadityasingh/TokenizationCounts)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how the direction in which digits are grouped into tokens changes GPT-3.5's and GPT-4's accuracy on few-shot addition of 7- to 9-digit numbers: the tokenizer's default 3-digit chunks from the left (L2R) against chunks from the right (R2L), forced by writing a comma, or another single-token separator, every three digits from the right (§2; §3.1–3.2).
- Controls for comma familiarity with other single-token separators (the authors conclude tokenization "is likely the dominant effect", §3.2) and for extra tokens, which they say their controls "effectively rule out" (§3.3); analyses the errors by answer length, number of carries and digit position (§4), prompts the model to repeat the problem in R2L form before answering (§5), and reruns the comparison on five "held-out" OpenAI models: newer GPT-3.5 checkpoints, two GPT-4 versions and GPT-4 Turbo (§6).
- The authors report that with L2R tokens, GPT-3.5's accuracy on problems whose answer is longer than both addends drops "down to 8.25%", while both directions perform similarly when the answer's length matches an addend (§4.1).

## In plain words

Language models read text as tokens, chunks of characters picked by a tokenizer. GPT-3.5 and GPT-4 cut a long number into 3-digit chunks from the left, so 8302080 becomes 830, 208, 0, and a sum's chunks need not line up with those of the numbers added (Fig. 1). The authors say tokenization "could be the source of useful or harmful inductive biases" (abstract) (built-in leanings that shape what a model does easily). They test it on few-shot addition of 7- to 9-digit numbers: commas every three digits from the right make the chunks start from the right, with the numbers unchanged. With 8 worked examples in the prompt, GPT-3.5's accuracy rises from 75.6% to 97.8% and GPT-4's from 84.4% to 98.9% (March 2023 models, Fig. 1; §3.1). The errors under left-to-right chunks follow fixed patterns; asking the model to rewrite the problem with commas before answering recovers nearly all the accuracy; and the gap shrinks in larger models (abstract; §5.1; §6). They present this as "the first study of how number tokenization choices lead to differences in model performance on arithmetic tasks" (abstract).

## Background and terms

**Terms to know:** [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) (§2.1) · [Shannon entropy](#/glossary/shannon-entropy) (App. D) · [Distillation into compact models](#/glossary/distillation) (§6, §8) · [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe) (§1) · [inductive bias](#/glossary/inductive-bias) (abstract, §1).

**The paper's own terms:**
- **L2R and R2L tokenization**: whether a number's digits are grouped into 3-digit tokens from the left (the default of the GPT-3.5 and GPT-4 tokenizer, `cl100k_base`) or from the right; R2L is forced by inserting a separator every 3 digits from the right, which works because "the tokenizer doesn't contain any tokens with numbers and commas" (§2.2).
- **Length match and length mismatch**: whether the answer has the same number of digits as one of the addends, or is longer than both because of a final carry (§4.1).
- **"Digit 4" error**: the error pattern on length-mismatch problems under L2R, where the fourth digit of the answer, the first digit of its second token, is wrong (§4.3).
- **Thinking tokens**: extra, predictable tokens that might give the model more computation steps (§3.3).
- **Repeat style**: a few-shot prompt whose examples restate the problem in a different tokenization direction and then answer it (§5.1, Fig. 10).
- **Merge rank**: the order in which the tokenizer's training created a token, used as a stand-in for how frequent the token was (App. C).

**Missing glossary terms:** none.

**Systems named:** the OpenAI chat models `gpt-3.5-turbo` (checkpoints 0301, 0613, 1106), `gpt-4` (0314, 0613) and GPT-4 Turbo (`gpt-4-1106-preview`), through the OpenAI Chat Completions API (§2.1, §6); the tokenizers `p50k_base` (GPT-3's) and `cl100k_base` (GPT-3.5's and GPT-4's) (§1, Fig. 2–3). Tab. 1 gives other models' number tokenization.

**Builds on:**
- Nye et al. (2021) and Zhou et al. (2022), who used formatting such as spaces or commas to separate digits, so that each digit is one token (§1).
- McCoy et al. (2023), on models doing better on forms common in training, which motivates the separator control (§3.2).
- Razeghi et al. (2022), on how pretraining term frequency can affect arithmetic in GPT-J (models trained on the Pile dataset); App. C tests frequency with merge ranks (§7).
- Lundberg (2023) (token healing: removes a prompt's last tokens for the model to regenerate) and Deng et al. (2023) (rephrase-and-respond: the model rephrases a question, then answers), which the authors connect to their repeat prompts (§7).

## Problem and setting

The question: does the direction in which numbers are cut into tokens change how well frontier models add, and if so, why (§1)?

- **Task:** few-shot addition with 1, 2, 4 or 8 examples given as a multi-turn chat; the examples match the query's digit lengths and tokenization direction (§2.1; prompts in App. E.3). Main results are 8-shot (§3.1).
- **Problems:** for most experiments, 90 random problems with addends of 7 to 9 digits, chosen "since this way each addend is 3 tokens long", 10 per pair of addend lengths (§2.1); for the error analysis, 1,300 problems, 100 for each of 13 triples of addend and answer lengths (§4.1; App. E.1).
- **Models and decoding:** mostly `gpt-3.5-turbo-0301`; default system prompt "You are a helpful assistant."; greedy decoding at temperature 0; accuracy is computed by extracting numbers from the responses (§2.1).
- Other arithmetic operations: not discussed. Claude's tokenizer is only inspected (App. A).

## Approach

- **Change the tokens through the text** (§2.2): commas every 3 digits from the right force R2L tokens.
- **Controls** (§3.2–3.3): other single-token separators (space, period, `$`, `#`) for R2L, in case commas help only because they are a familiar way to write numbers; for L2R, separators every 3 digits from the left (matching R2L's prompt token count) or 1 or 2 extra spaces around `+` and `=`, in case more tokens give more computation.
- **Error analysis** (§4): accuracy by length match and by number of carries, which digit is wrong and by how much, and where off-by-one errors fall within a token; App. C tests token frequency through merge ranks, and App. D the top-5 log probabilities the API returns, with a lower bound on each output token's entropy.
- **Repeat prompts** (§5): few-shot examples show restating an L2R problem in R2L form, then answering; a control (§5.2) answers in R2L form without restating.
- **Later models** (§6): the main comparison rerun on five "held-out" OpenAI checkpoints (Fig. 12), and the length analysis on four of them (Fig. 13).

## Results

The authors report (all on few-shot addition, GPT models through the API):
- **Main effect** (§3.1, Fig. 1, Fig. 4): R2L beats L2R at every shot count; more shots help L2R more ("from 68.5% 1-shot to 75.6% 8-shot") than R2L ("from 95.6% 1-shot to 97.8% 8-shot"), on `gpt-3.5-turbo-0301`.
- **Controls** (§3.2–3.3, Fig. 5–6): the model is "largely agnostic to the separator used"; neither L2R control recovers R2L's accuracy, and separators in L2R form "often hurt performance".
- **Answer length** (§4.1, Fig. 7): when the answer's length matches an addend, both directions "perform similarly"; on length mismatch, L2R accuracy drops "down to 8.25%". Accuracy shows no clear trend with the number of carries (§4.2, Fig. 8).
- **"Digit 4" errors** (§4.3, Fig. 9): on length-mismatch problems under L2R, apart from the 8.25% answered correctly and 0.5% with no valid answer or one of the wrong length, the model "always gets digit 4 wrong" (91.25%) and "always gets the first 3 digits correct"; the size of the digit-4 error leans slightly to off-by-one but otherwise "appears quite haphazard". The pattern "is not present when using R2L tokenization". The authors read it as "highly suggestive of some underlying algorithm" rather than fuzzy matching to training problems.
- **Remaining errors** (§4.4): 24 of R2L's 25 errors (of 1,300 problems) and 53 of L2R's 56 length-match errors (of 900) are off by one, and nearly all of these fall in "the last digit of an output token".
- **Frequency and log probabilities** (App. C–D): "mild to no evidence of token frequency effects" (App. C); on length-mismatch problems under L2R the model is about as uncertain when right as when wrong, "suggesting that it might just be guessing" the second token (App. D).
- **Repeat prompts** (§5, Fig. 10–11): models that restate an L2R problem in R2L form perform "nearly as well" as when given R2L input, more so with more shots; answering in R2L form without restating does not recover accuracy to that degree. Models "can convert between tokenizations to solve problems correctly, but do not do so implicitly in the forward pass" (§5.1).
- **Later models** (§6, Fig. 12–13): later GPT-3.5 checkpoints "exhibit as strong an effect"; the effect is "mitigated slightly in GPT-4's March version, and mitigated strongly in GPT-4's most recent version", and "becomes stronger again" in GPT-4 Turbo. The authors believe GPT-4's larger training scale lets it "better override the tokenization-induced inductive bias".

## Limits the authors state

- The "gold experiment", training the same architecture on the same data with different number tokenizations, was not run: its expense makes it "intractable in academic settings", and how to control for compute is open, since 3-digit tokens let a model see more data for the same number of tokens (§8). The authors hope practitioners will run it "with proper controls" (§8; abstract).
- The API "only allows for input text, not input tokens, so it's tricky to conduct tokenization-varying experiments" (§2.2).
- Model sizes are assumptions: GPT-4 is "presumably larger" (§2.1), and GPT-4 Turbo is assumed to be "a smaller, maybe distilled, version of GPT-4" (§6 footnote); "without knowing what these updates entail, however, it's hard to draw conclusions" about why GPT-4's update helped and GPT-3.5's did not (§6 footnote).
- The token-boundary account of off-by-one errors is a "hypothesis, with preliminary evidence" (§4.4); the "auto-corrects" behaviour under L2R separators comes from "qualitative inspection of a few examples" (§3.3); "the mechanism for addition in LLMs remains unclear" (§4.3).
- Merge ranks are an "imperfect" measure of frequency, used because the pretraining data are not available (App. C).
- Some "non-determinism, even at temperature 0" was seen with the fixed checkpoints (App. E.2), and `gpt-4-0314` was withdrawn from the API before the length analysis could be run on it (Fig. 13 footnote; App. E.2).

## Open problems and building blocks

  - Interpretability: "it would be interesting to elucidate the mechanisms behind systematic error patterns, especially in the case of multi-token operands" (§8); prior circuit work (on the sub-networks that compute a behaviour) covered "single token operands" only.
  - "Future work could study such associations further in newer, larger models with open pretraining data" (App. C).
- **Released:** "All code and full results tables" (§2.1); "All code and raw results" (App. E).
- **To reuse it:** access to the OpenAI Chat Completions API and the named checkpoints, of which the authors could no longer reach `gpt-4-0314` (§2.1, §6; App. E.2); a tokenizer that has no tokens mixing digits and the separator, so the separator forces the split (§2.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
