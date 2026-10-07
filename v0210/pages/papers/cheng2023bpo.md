# Black-Box Prompt Optimization: Aligning Large Language Models without Model Training

**BPO** · ACL 2024

Read: [PDF](https://arxiv.org/pdf/2311.04155) · [arXiv](https://arxiv.org/abs/2311.04155) · [DOI](https://doi.org/10.18653/v1/2024.acl-long.176)  
Code: [BPO](https://github.com/thu-coai/BPO)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains a small model that rewrites user prompts so a black-box LLM answers better.
- Learned from preference data.
- Prompt rewriting as alignment; preference-based, not a checkable reward.

## In plain words

LLMs are "often not well aligned with human intents": they follow a user's request less well than they could. The usual fix, further training on human preferences, is "usually expensive" in compute, and some models, such as those reached only through an API, cannot be trained by their users at all (abstract, §1). The authors instead train a small rewriter that turns a user's prompt into a clearer, more detailed one before it reaches an unchanged LLM. Its training pairs come from preference datasets: ChatGPT reads a preferred and a rejected answer to the same prompt and rewrites the prompt to ask for what made the preferred answer better (§1, §3.2). With GPT-4 judging pairs of answers, the abstract reports that rewritten prompts give ChatGPT "a 22% increase in the win rate against its original version and 10% for GPT-4". It also reports that models used with the rewriter "can outperform the same models aligned by PPO and DPO", two preference-training methods. The authors present it as "a conceptually new perspective" on alignment (Fig. 1).

## Background and terms

**Terms to know:** [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [PPO](#/glossary/ppo) · [reinforcement learning](#/glossary/reinforcement-learning) · [reward model](#/glossary/reward-model) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [positional bias](#/glossary/positional-bias) · [BLEU](#/glossary/bleu-and-rouge) · [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) (§2 describes its "standard framework" as "reward modeling and policy training")

**The paper's own terms:**
- **alignment**: making an LLM's outputs follow user intent and human preferences (abstract, §2).
- **BPO (Black-Box Prompt Optimization)**: the method; its trained rewriter is the "prompt preference optimizer" (§1).
- **black-box**: the LLM is used only through its input and output; its weights are neither read nor changed (abstract, §3.4). In the glossary's terms, this is not [black-box optimization](#/glossary/black-box-optimization) (tuning from scores alone): BPO's rewriter is trained on example rewrites (§3.3).
- **sequence-to-sequence model**: here, a model fine-tuned to output the optimized prompt given the user's prompt (Eq. 1, §3.3).
- **A win / tie / B win, ΔWR**: shares of pairwise judgments that method A wins, ties or loses against method B ("ori." is the original prompt or model); §4.5 ties ΔWR to Fig. 3, whose caption reads "Difference of win rate and lose rate" (Tab. 3, §4.5).
- **w/o FDBK**: the ablation in which `gpt-3.5-turbo` optimizes prompts directly, without preference data (Tab. 7).
- **self-BLEU, distinct score**: diversity measures; training prompts are filtered with self-BLEU, each sample's [BLEU](#/glossary/bleu-and-rouge) score against the others, and Tab. 1 reports Distinct-4, the share of distinct 4-word sequences (§3.2).

**Builds on:**
- RLHF with PPO (Ouyang et al., 2022) and DPO (Rafailov et al., 2023), the training-based methods it compares against first (§1, Tab. 2, §4.3).
- Automated prompt engineering: AutoPrompt (Shin et al., 2020; [AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)")), prompt tuning (Liu et al., 2021; Lester et al., 2021), whose soft form "requires tuning of the model parameters" (§2), and LLM prompt optimizers such as Zhou et al. (2022; [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")) and Pryzant et al. (2023; [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), which §2 says "primarily focus on specific tasks rather than alignment" (§1, §2).
- OPRO (Yang et al., 2023; [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), an LLM that searches for one prompt per task using scores on training examples (Tab. 2, §3.4, App. H).
- The MT-bench judge prompt (Zheng et al., 2023) and the Alpaca Eval prompt (Li et al., 2023) (§4.1, App. D).

## Problem and setting

- **Question:** can a rewriter of inputs, learned once from preference data, align an LLM without training it, and how does it compare with PPO, DPO and prompt search (§1, §3.4)?
- **Setting:** "we mainly focus on single-turn response generation" (§3.2). Target LLMs use "the default decoding strategies" (App. C).
- **What "better" means:** in the main experiments, a pairwise judgment by `gpt-4` with the MT-bench prompt (ties allowed) or by `claude-v1.3` with the Alpaca Eval prompt (win or lose), at temperature 0, with answer order randomly shuffled "to mitigate position bias and reduce the cost" (§4.1, App. C–D). The authors note that "it remains a significant challenge to comprehensively evaluate a language model's alignment quality" (§4.1).
- **Training data (App. A, Tab. 1):** prompts with a preferred and a rejected answer from OASST1 (crowd-sourced, human quality ratings), HH-RLHF (human preferences on helpfulness and harmfulness), Chatbot Arena Conversations (collected from humans on Chatbot Arena) and the Alpaca-GPT4 comparison subset (preferences by GPT-4); about 14k pairs after filtering.
- **Target LLMs:** the API models `gpt-3.5-turbo`, `gpt-4`, `claude-instant-1.2`, `claude-2` and `text-bison` (Tab. 3), and the open-source chat models `llama-2-chat` (7B, 13B, 70B) and `vicuna-v1.3` (7B, 13B) (Tab. 4).
- **Test sets (§4.1):** Vicuna Eval (80 diverse questions), Self-Instruct Eval (252 expert-written instructions), Dolly Eval (200 items sampled from the human-written dolly dataset) and BPO-test Eval (200 held-out samples from the four training datasets).

## Approach

- **Rewrite pairs (§3.1–3.2, App. B).** Sampled prompts are filtered with hand-written rules (e.g. too-short instructions) and a self-BLEU diversity filter. ChatGPT gets each prompt with its preferred and rejected answers, is asked to criticize them, and refines the prompt to "explicitly incorporate the features that shift the responses from unfavorable to favorable" (§1), using one of two templates (Fig. 5). Rule-based filters then drop wrong rewrites (e.g. in the wrong format).
- **The rewriter (§3.3, App. C).** `llama2-7b-chat`, fine-tuned for three epochs on (original, rewritten) prompt pairs (Eq. 1).
- **Use.** The rewriter rewrites each user prompt (top-p 0.9, temperature 0.6, App. C) and the unchanged LLM answers it. Tab. 2 marks BPO as free of reward and policy training and as LLM- and task-agnostic; PPO, DPO and OPRO each lack some of these marks, and all three lack LLM-agnostic. §3.4 says BPO, "once learned, is model-agnostic", while OPRO uses one learned prompt for all samples of a task, "which can cause low stability".
- **Other uses tested.** BPO on PPO- or DPO-trained models (§4.3); rewriting the instructions of Alpaca, an instruction-tuning dataset, and regenerating answers with `text-davinci-003` to fine-tune `llama-7b` and `llama-13b` (§4.4); repeated rewriting (§4.5).

## Results

Results are LLM judgments: pairwise by `gpt-4` for Tab. 3–7, repeated with `claude-v1.3` in App. F (Tab. 8–12), which reports Tab. 8–9 "consistent with the results of gpt-4"; the OPRO study instead scores single answers against a reference (App. H).

- **Unchanged models (§4.2, Tab. 3–4).** The authors report a higher win rate with rewritten prompts than with original ones "on all datasets across all models". ΔWR is +22.0 for `gpt-3.5-turbo` and +10.1 for `gpt-4` (Tab. 3). They say that on closed tasks "such as mathematics, reasoning, and coding" BPO "also demonstrates excellent performance" (§4.2).
- **Smaller against larger (§4.2, Tab. 4, Fig. 7).** With BPO, `llama-2-13b-chat` beats the original `llama-2-70b-chat` under both judges; the 7B model matches or beats it on some test sets, and nearly reaches it under Claude's judging.
- **Against PPO and DPO (§4.3, Tab. 5).** On `vicuna-7b` and `vicuna-13b`, BPO alone has positive ΔWR against the PPO-trained models, and +0.2 and +0.9 against the DPO-trained ones. Adding BPO to PPO- or DPO-trained models gains further; with DPO, both "can achieve around 30% win rate increases" over the originals (§4.3).
- **Training data (§4.4, Tab. 6).** `llama-13b` trained on the 52k BPO-rewritten Alpaca data wins 93.8% to 1.2% on Vicuna Eval against the one trained on the original data; a model trained on 1k rewritten samples "can surpass" the one trained on the original 52k.
- **Repeated rewriting (§4.5, Fig. 3).** With `gpt-3.5-turbo` on Vicuna Eval, ΔWR improves through four rounds, with "a small decline on the fifth iteration". The authors find the rewriter "has a high probability of preserving the input prompt when it is already good enough".
- **Feedback ablation (§4.6, Tab. 7).** Rewriting by `gpt-3.5-turbo` without preference data reaches ΔWR +4.6, against BPO's +22.0; under Claude's judging it "may bring a decline in some datasets" (App. F).
- **Against OPRO (App. H, Fig. 10).** On eight Dolly categories, with OPRO searching on a training split of each and answers evaluated by a reference-based GPT-4 judge, BPO "achieves stable improvements across most categories", while OPRO lowers the score on a majority of them, with a negative average. The authors conjecture that OPRO's one prompt per task may hurt some samples.
- **What the rewrites do (§5, Fig. 4).** From 500 examined samples, the authors name four common strategies: explanation generation, prompt elaboration, providing hints and safety enhancement; "those strategies are not mutually exclusive".

## Limits the authors state

- The rewriter "is only trained on 14k pairs" from a few academic feedback datasets, "covers a limited spectrum of scenarios and has not been trained on large amounts of data yet", and "may not be as good as expected for very general usage" (§ "Limitations").
- Long inputs: for summarization it "tends to alter the instructional prompt as well as the original passage for summarization (which should not be changed)" (§ "Limitations").
- Math: it "seems to fail to learn how to change their inputs for better performance"; the authors believe more attention to such topics in data construction could improve this (§ "Limitations").
- Error cases (App. I, Fig. 11): over-specification, which "limits the LLM's output too much"; a rewrite inconsistent with the original instruction, traced "back to low-quality training data"; and a rewrite that "neglects the additional context, making the instruction under-specified".

## Open problems and building blocks

- **Open:** "leave the multi-turn setting for our future work" (§3.2); "we leave the model scaling explorations to future work" (§3.3); "there is still great room to further explore in depth" (§6).
- **Released:** "Code and datasets are released" (abstract); the Limitations mention "the currently released optimizer" (§ "Limitations").
- **To reuse it:** a `Llama-2-7b-chat` backbone fine-tuned with DeepSpeed ZeRO-2, a memory-saving multi-GPU training mode (App. C); rewrite data written by ChatGPT from preference-labelled prompts (§3.2); experiments ran on eight 80GB A800 GPUs (App. C). API models qualify, as the LLM is not changed (§3.4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
