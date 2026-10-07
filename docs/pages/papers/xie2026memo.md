# MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games

**MEMO** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.09022) · [arXiv](https://arxiv.org/abs/2603.09022)  
Code: [MEMO](https://github.com/openverse-ai/MEMO)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Self-play that optimizes the inference-time context of agents in multi-turn, multi-agent text games (abstract).
- A persistent memory bank of insights from self-play, plus tournament-style prompt evolution with TrueSkill selection (abstract).
- Self-play whose updates are only prompts and memory, with game outcomes as the check; it has no task proposer (Proposer–solver self-play).

## In plain words

When LLMs play long two-player text games, results swing from run to run: an early slip changes the rest of the game, and small prompt wording changes reorder which model looks best. The authors argue this makes win rates and rankings unreliable, and that fixed prompts and existing prompt optimizers, which keep no memory between rounds, do not fix it (§1). MEMO changes only what the model is told, never its weights (§1): candidate prompts compete in rounds of games, reliable winners are kept, lessons from finished games go into a lasting notebook of tips, and some games restart from rare, decisive positions (abstract). Across five games, with 2,000 practice games per game, they report the average win rate against three outside opponent models rising from 25.1% to 49.5% for GPT-4o-mini and from 20.9% to 44.3% for Qwen-2.5-7B-Instruct, compared with the unoptimized default prompt (abstract, Tab. 2). They present it as outperforming prompt optimizers and, on Qwen, as competitive with reinforcement-learning training at 19 times fewer games, though such training "remains more effective in perfect-information settings" (abstract; §5).

## Background and terms

**Terms to know:** [self-play](#/glossary/self-play) · [reinforcement learning](#/glossary/reinforcement-learning) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Markov decision process](#/glossary/markov-decision-process).

**The paper's own terms:**
- **context**: everything that conditions the model before and during play: the instruction prompt fixed at game start plus a memory of insights injected at inference time (§2).
- **self-play**: games in which a candidate context plays against "a baseline agent, the same base model using only a default prompt" (§3.1); only contexts change, never weights.
- **generation**: one optimization round: tournament, selection, reflection, memory update, new candidates (§3, App. B Alg. 1).
- **population and candidate pool**: the 8 contexts tested in a generation, and the best contexts seen so far, from which the final one is picked (§3.1, §4.3).
- **insights and memory bank**: short typed lessons ("rule clarifications, legality constraints, and strategy priors") that the model writes after reading finished games, kept in a bank that persists across generations (§3.2).
- **Add / Remove / Edit**: how a new insight is merged into the bank: added if unlike any stored one, both removed if they contradict, merged if similar; the paper calls these "database-style" or CRUD-style operations (§3.2, §1).
- **random proposals and memory-augmented updates**: the two ways new candidate contexts are made: small length-bounded edits that give the base prompt a playstyle drawn from a fixed list (aggressive, deceptive, …), or edits that build in insights from the bank (§3.1, App. D.1).
- **RSE (relative standard error)**: the spread of the average win rate across independent runs of the whole optimization pipeline, as a percentage of the mean, divided by the square root of the number of runs; lower means more repeatable (§2).

**Missing glossary terms:**
- **partially observable Markov game**: the two-player version of a Markov decision process, in which players alternate moves, each sees only part of the state, and the game ends with win, draw or loss; zero-sum means one player's win is the other's loss (§2).
- **perfect- and imperfect-information games**: whether players see the whole state (a board) or not (hidden cards) (§4.1).
- **TrueSkill**: a Bayesian rating system that keeps, for each player, an estimated skill and how unsure that estimate is, updated from game results. MEMO scores contexts by estimate minus one unit of uncertainty (Eq. 1, §4.3), which "penalizes contexts with high uncertainty, favoring those that win reliably"; a context that wins 3 of 3 games "may simply be lucky" (§3.1).
- **prioritized replay**: storing past experience and revisiting some of it more often than the rest. MEMO stores game prefixes (the moves so far plus the random seed) and starts some new games from them, favouring rarely seen prefixes (§3.3).

**Builds on:**
- The experiential line: ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"); reasoning and acting within one episode), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)"); verbal feedback for retries) and ExpeL, which distills past games into lasting insight rules; MEMO "extends this experiential direction to adversarial multi-agent games" (§6.1).
- The prompt optimizers it compares against first: TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), MIPRO ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"), run as MIPROv2 in the prompt-optimization framework [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")) and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) (§4.2, App. H).
- Self-play RL: UnstableBaselines and SPIRAL as baselines (§4.2), with AlphaGo/AlphaZero as classical self-play (§6.3); none is on this site.
- TrueSkill (Herbrich et al., 2006) for selection (§3.1); the game suites TextArena (competitive text games ranked by TrueSkill) and SPIN-Bench (planning, cooperation, competition and negotiation) (§1, §6.2).

## Problem and setting

- **Question:** can optimizing the context through self-play, without weight updates, raise win rates and cut run-to-run variance in multi-agent text games (§1)?
- **Games (§4.1, App. L):** negotiation: SimpleNegotiation (trading resources such as wood and wheat to raise inventory value) and TwoDollar (splitting $2.00, usually under private role instructions); imperfect information: KuhnPoker (three-card poker with one betting round) and Briscola (an Italian trick-taking card game with a trump suit); perfect information: SimpleTak (placing tiles on a grid to connect opposite sides).
- **Models:** GPT-4o-mini and Qwen-2.5-7B-Instruct as base models (§4.2); one table adds Gemini-2.5-Flash (App. K Tab. 14).
- **Evaluation (§4.2):** each prompt method runs three independent optimizations; each final context plays 50 games against each of three held-out opponents (Grok-4-Fast-Non-Reasoning, Gemini-2.5-Flash-Lite, Qwen3-235B-A22B-Instruct-2507), at temperature 1.0. RL methods train one policy and play its best checkpoint in three sets of 50 games.
- **Baselines (§4.2, App. H):** static prompts (the default TextArena prompt, chain-of-thought, tree-of-thought); TextGrad, MIPRO and GEPA, fed recorded games from the tournament, MIPRO and GEPA scored by whether they reproduce moves from won games and avoid moves from lost ones (App. H.2–H.3); the RL baselines UnstableBaselines (LoRA adapters, small added weight matrices, trained with REINFORCE, a basic RL update rule; App. H.4) and SPIRAL, on Qwen only, SPIRAL on three games (Tab. 2).
- **Fixed configuration:** one setting for all experiments: 8 contexts, 5 generations, 50 games per candidate per generation, 2,000 games in all (§4.3).

## Approach

- **Tournament selection (§3.1):** each context plays the baseline agent, roles swapped in asymmetric games, and is scored by TrueSkill (Eq. 1). The pool keeps the top contexts; the next population is filled by random proposals and memory-augmented updates. After the last generation MEMO returns the best-scoring context in the pool.
- **Reflection and memory (§3.2):** after each generation the model reads a sample of finished games and writes insights; these are merged into the bank by Add / Remove / Edit. A sampled subset of the bank is appended to the contexts of 75% of the population (§4.3), and it also drives the memory-augmented edits (App. E–F).
- **Prioritized replay (§3.3):** a buffer stores prefixes at every turn. With probability 0.4 a game starts from a stored prefix rather than fresh; rarer prefixes are picked more often (weight one over count, raised to the power 0.6; buffer of 100,000, §4.3).

## Results

- **Main results (Tab. 2):** the mean win rate rises from 25.1% to 49.5% (GPT-4o-mini) and from 20.9% to 44.3% (Qwen), against the default prompt.
- **Against prompt optimizers:** on GPT-4o-mini the authors report average gains of 14.9, 12.8 and 17.5 points over TextGrad, MIPRO and GEPA (§5 Obs. 1).
- **Against RL (Qwen, Tab. 2):** UnstableBaselines averages 45.0% against MEMO's 44.3%, and wins on Briscola (53.3% against 31.1%) and SimpleTak (47.3% against 34.0%). The authors call the margin to RL "smaller" and MEMO "competitive" while using 2,000 games against 38,000 (§5 Obs. 1, Fig. 1b).
- **Stability:** on GPT-4o-mini MEMO's mean RSE is 6.4%, against 44.9% for the default prompt and 12.4% for MIPRO (Tab. 2, §5). The authors report that UnstableBaselines shows increased RSE (§5).
- **Ablation (Tab. 3, GPT-4o-mini, TwoDollar, KuhnPoker, Briscola):** mean win rate 23.8% with no module, 27.1% with tournament only, 34.2% with memory only, 41.6% with tournament plus replay, 48.1% with tournament plus memory, 50.2% with all three. The authors conclude "memory is the dominant mechanism" (§5 Obs. 2).
- **Transfer across games (Tab. 4, GPT-4o-mini):** a context learned on one game often helps on another, unchanged; the authors report gains as large as +26.4 points (TwoDollar context on SimpleTak) and negative transfer from Briscola to SimpleTak (§5 Obs. 3).
- **Transfer across models (Fig. 4):** GPT-4o-mini's learned context helps the weaker Gemini-2.5-Flash-Lite on all three games tested, but lowers the stronger Grok-4-Fast-Non-Reasoning on Briscola and KuhnPoker (§5 Obs. 4).
- **Cost:** about 91K output tokens on average over three games, against 354K for MIPRO, 113K for GEPA and about 1K for TextGrad (Tab. 1; exact counts App. J).
- **Prompt sensitivity (App. A, Fig. 5):** six models on KuhnPoker under five prompts differing only in framing; the authors report that "absolute performance and pairwise rankings frequently reverse".
- **Hyperparameters (App. C):** intermediate memory fractions beat none or all (Tab. 5); replay probability is "the most sensitive parameter" (Tab. 6).

## Limits the authors state

- RL "remains more effective in perfect-information settings" (abstract; §1).
- "Learned context does not always transfer across models": transferred heuristics "can interfere" where the target model already plays well (§5 Obs. 4).
- Transfer across games is asymmetric: "not all retained insights generalize equally", and positive transfer "requires sufficient structural overlap between games" (§5 Obs. 3).
- Replay "must be balanced with fresh exploration"; heavier replay "substantially harms performance" (App. C.2).

## Open problems and building blocks

- **Open:** none stated. The authors recommend "prompt-variation reporting rather than reliance on single-prompt evaluations" (§1).
- **Released:** the title page gives a code repository and a project website (abstract box). The prompts are printed in App. D–G and the baselines' settings in App. H.
- **To reuse it:** a two-player, turn-based, zero-sum game environment (§2) that can restart from a stored prefix and random seed (§3.3); the base model writes the insights and the edits (§3.2, App. D.1); 2,000 games per game and the fixed hyperparameters of §4.3; no weight updates.

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
