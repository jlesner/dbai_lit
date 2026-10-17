# Is Code Better Than Language for Algorithmic Reasoning?

**Is Code Better Than…** · (three-route framework), ICML 2026 (PMLR 306)

Read: [PDF](https://arxiv.org/pdf/2606.15589) · [arXiv](https://arxiv.org/abs/2606.15589)  
Code: [ToolProj](https://github.com/TerryTong-Git/ToolProj)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Separates the two things that change when an LLM switches from reasoning in text to writing code that Python runs: the form of the reasoning trace and who executes it. A middle route has the model write code and then simulate running it in text, so text reasoning (Route 1) and code simulated by the model (Route 2) differ only in the trace, and Route 2 and the same code run in Python (Route 3) only in the executor (abstract; §1, Fig. 1; §2.3; §3.1).
- Six models (four closed, two open) on 40 algorithmic tasks from CLRS-30, NP-Hard-Eval and a custom fine-grained suite, difficulty set by a parameter where applicable, three seeds, one forward pass each for Routes 1 and 2 with Route 3 running Route 2's code, compared by paired McNemar tests and cluster-bootstrap intervals (§3.1–3.2, Fig. 2); a linear model in which natural language carries code's surface variation plus extra (Asm. 4.1, Thm. 4.3), a test that feeds the model's code, translated into text, back as its reasoning (§4.3, Fig. 5), and a split of the Route 2–Route 3 gap into recovery and execution-win mass (§5.1, Fig. 6).
- Evidence that the gain from handing a procedure to an interpreter comes from running the code, not from writing it: the authors report that simulated code is not meaningfully different from text reasoning, while running the same code is +31.47 points above simulating it (§3.2), with the language routes falling further behind as difficulty grows (Fig. 4); most failures of executed code are wrong answers rather than syntax, runtime or time-limit failures (App. D.1, Tab. 7). Frontier models are checked only on a 350-instance subset, where the margins are smaller (§7; App. C.3, Tab. 6).

## In plain words

When an LLM solves an algorithmic problem by writing code that Python runs, two things change at once compared with reasoning in text: the form of the reasoning (code instead of prose) and who carries it out (the interpreter instead of the model). The authors say earlier comparisons mixed the two, so it is unclear whether the gains come from the code, the interpreter or both (§1). They add a middle route: the model writes code and then simulates running it in text, with no interpreter. On 40 algorithmic tasks, pooled over six models and three seeds, text reasoning scores 17.21%, simulated code 17.37% and the same code run in Python 48.84% (§3.2); the authors "do not conclude a meaningful difference" between the first two (§3.2). A simple linear model and a test that turns the code back into prose support, in their words, that representation "is not the primary bottleneck in this setting" (§1). They present this as an explanation of why tool use helps "in our evaluated setting" (abstract), and say their theory derives "its novelty from the application, rather than providing a new general theorem" (§7).

## Background and terms

**Terms to know:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [neuro-symbolic AI](#/glossary/neuro-symbolic-ai) · [paired comparison](#/glossary/paired-comparison) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) (here the clusters are problem instances, §3.2) · [confidence interval and coverage](#/glossary/confidence-interval-and-coverage) · [Bonferroni correction](#/glossary/bonferroni-correction) (the paper uses the Holm–Bonferroni version, §3.2) · [generalized linear mixed model (GLMM)](#/glossary/generalized-linear-mixed-model-glmm) (here a logistic regression of each answer's correctness on route, difficulty and their interaction, with random intercepts for instance and seed, §3.2).

**The paper's own terms:**
- **Trace** and **trace generator** (§2.2): a trace is "an object that stores intermediate reasoning", such as a natural-language chain of thought or a program; the trace generator is the model producing it from the task.
- **Executor** (§2.2): turns the trace into the answer, e.g. an LLM forward pass or an external runtime.
- **Route 1, Route 2, Route 3** (§2.3, Fig. 1): Route 1 is "Direct Natural Language" (prose trace, the model answers); Route 2 is "Code + NL Simulation" (code trace, the same model simulates it); Route 3 is "Code + Solver Execution" (the same code, run in Python).
- **Risk**: expected loss. The experiments use 0–1 loss: 1 when the answer differs from the ground truth, which is "unique, fixed, and externally verifiable" (§2.1); Thm. 4.3 uses squared loss.
- **Core and nuisance** (§4.1, Asm. 4.1): the core is "the answer-relevant core, or the sufficient statistic" (all the input the answer depends on) (for a dynamic-programming problem: the recurrence, boundary conditions and final query); the nuisance is "route-specific surface variation that should not change the answer once the core is fixed" (e.g. variable names and formatting in code; in prose also paraphrase, verbosity, ordering, style and prompt-form variation).
- **Representation-non-inferior** (Thm. 4.3): no predictor in the class has higher risk on code inputs than on language inputs, "with margin 0". A statement about population risk (expected loss over the whole input distribution) in the model, not a statistical test.
- **Loewner order** (§4.2): one matrix is below another when their difference is positive semidefinite (never negative in any direction).
- **Recovery mass** and **execution-win mass** (§5.1, Fig. 6): the share of cases in which simulation is right while running the same code gives a wrong answer or fails, and the share in which running is right while simulation is wrong.
- **Difficulty τ** (Fig. 4 caption): digit length for arithmetic, table dimensionality for dynamic programming, constraint-matrix dimensionality for integer linear programming (ILP).
- **Decision intervention** (§4.3; "reconstruction intervention" in the abstract): the code trace, translated into prose, is given to the model as its reasoning.

**Builds on:**
- Work showing that translating problems into solver-executable code and delegating execution "often outperforms end-to-end NL reasoning": Faithful chain of thought (Lyu et al., 2023) and Logic-LM (Pan et al., 2023; [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")) (§1); PAL (Gao et al., 2023; [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")) and ReAct (Yao et al., 2023; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) are among the agentic systems the introduction cites (§1).
- Xie et al. (2021), who model in-context learning as implicit Bayesian inference, "which we extend to compare different reasoning representations" (§6).
- Neuro-symbolic integration (Graves et al., 2014, and others) (§6).

## Problem and setting

- **Question:** whether code beats natural language for algorithmic reasoning (§2): does Route 1 ≈ Route 2 < Route 3 hold (§3), and is the trace (§4) or the execution (§5) the bottleneck?
- **Tasks:** a 40-task set drawn from CLRS-30 (a benchmark of classical textbook algorithms), NP-Hard-Eval (a benchmark of problems graded by complexity class) and a custom suite, spanning arithmetic, dynamic programming, graph and string algorithms, geometry, sorting and NP-hard optimization, with difficulty set by τ "when applicable"; 1,113 unique instances, three seeds, 20,034 paired route evaluations (§3.1).
- **Models:** closed Claude Haiku 4.5, GPT-4o-mini, Gemini 2.0 Flash and Gemini 2.5 Flash; open Mixtral-8x22B-Instruct and Codestral-2508 (§3.1).
- **Routes as run:** Routes 1 and 2 are each one forward pass "without pause"; Route 1's prompt forbids code; Route 2's prompt differs "only by the inclusion of a code-generation and simulation instruction" (§3.1, Fig. 2). Route 3 runs Route 2's code in Python 3 with SciPy, NumPy, pandas, PuLP (a linear-programming library) and PyTorch (§3.1), sandboxed with a 5-second limit and "no additional LLM call" (Fig. 2).
- **Statistics:** paired McNemar tests, 95% intervals by cluster bootstrap over instances, Holm–Bonferroni over the two tests at 5%, and a GLMM for difficulty (§3.2).
- **Theory setting:** a realizable (containing the true predictor) linear predictor class over the core and surface coordinates (Eq. 1, §4.1).

## Approach

- **Three routes** (§2.3, §3.1): Route 2 shares its trace generator with Route 3 and its executor class with Route 1.
- **The linear model** (§4.1–4.2): Asm. 4.1 assumes code's input is the core plus code-side variation, language's input is the same core plus that variation plus extra variation, and the label is linear in the core plus noise; the code-side variation has mean zero given the core, the extra language variation has mean zero given the core and the code-side variation, and the label noise has mean zero given all of them. Under it, Lemma 4.1.1 shows that, given the core, the surface coordinates have mean zero and are uncorrelated with the label noise (they "do not secretly carry residual label information"), Prop. 4.2 that language's surface variation is at least as spread out as code's in every linear direction (Loewner order), and Thm. 4.3 that, for squared loss and the linear class, every predictor's risk on code inputs is at most its risk on language inputs. Remark 4.4 adds finite-sample intuition from least squares: fitting irrelevant coordinates raises prediction error.
- **Decision intervention** (§4.3): on 1000 held-out instances, the model answers from the question alone, with its native prose trace, or with its code translated into prose; translators (Claude Haiku 4.5, Gemini 2.5 Flash, Mixtral-8x22B-Instruct) are matched to the code generator's model family "to avoid confounding functional losses with cross-model stylistic mismatch".
- **Risk decomposition** (§5.1): Route 2's risk minus Route 3's equals simulation errors on instances where the code runs correctly, minus simulation successes where it doesn't; "Route 3 dominates whenever the recovery mass is insufficient to offset simulation noise". The measured recovery mass is read as an upper bound on "recovery from flawed code", since the simulator "may partially ignore" the code.

## Results

- **Main comparison** (§3.2, Fig. 3): Route 2 − Route 1 is +0.15 percentage points (pp) (95% cluster-bootstrap interval −0.30 to +0.61, McNemar p = 0.39); Route 3 exceeds Route 2 by +31.47pp (interval +29.20 to +33.71). The abstract's +31.6pp is Route 3 against Route 1.
- **Difficulty** (§3.2, Fig. 4): on the seven tasks plotted, Route 3 "remains substantially higher as the language-based routes degrade" as difficulty grows.
- **By complexity class** (App. A.1, Tab. 1): within the larger strata, Route 3 − Route 2 is the largest change and Route 2 stays close to Route 1; all three routes score 0.0 on the O(n log n), O(n² log n) and O(n³) strata.
- **By model** (App. A.2, Tab. 2): Route 3 is above Route 2 for all six models; Route 2 − Route 1 "is small and changes sign across models".
- **Translated traces** (§4.3, Fig. 5): both trace conditions beat the question-only baseline, and the authors "fail to reject the null hypothesis of equal performance" between native and translated traces. In a shot ablation for Claude Haiku 4.5, translated traces stay below native ones in every row, by 4.50 to 13.29 points (App. B.1, Tab. 3).
- **Recovery** (§5.1, Fig. 6): recovery mass is 1.61% and execution-win mass 33.08% on the 40 tasks.
- **Other models** (App. C): under recursive language model execution (the model works on its prompt from a Python REPL and calls itself; [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)")), code and prose arms are mixed (Tab. 4); for coding-specialized models (Grok-code-fast-1, Qwen3-Coder, Codestral), running the code is the best arm in each row (Tab. 5); on a 350-instance subset, GPT-5.4 and Claude Opus 4.6 keep Route 3 ahead, "but the margins are smaller" (Tab. 6).
- **Why executed code fails** (App. D.1, Tab. 7): wrong answers are 70.43% of Route 3 code-execution failures overall, the rest syntax errors, runtime errors and time-outs; failures where the returned value failed parsing or type checks are left out; the authors say this supports that errors "often originate in the generated program specification rather than in the Python runtime itself".

## Limits the authors state

- "the main experiments do not fully cover frontier reasoning models"; the frontier subset "found that the results generally hold" (§7).
- "task coverage is limited to algorithmic problems with externally verifiable answers and reliable Python execution, so open-ended, ambiguous, unsafe, or weakly specified tool use may behave differently" (§7).
- The theory "mainly builds intuition through standard decision-theoretic ideas" (§7).
- The linear models and shared-core assumptions "may fail when code omits decision-relevant information, natural language carries useful signal, or executors exploit structure outside the modeled core" (§7).
- The similarity of translated to original traces "appears to depend heavily on the translating prompt" (§4.3).
- Extra wording "can be harmless in the infinite-data idealization" (Remark 4.4).
- The recursive-language-model results come from a 25% subset, used "as model-coverage evidence rather than as the main route estimate" (App. C.1).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the experiments: "All experiments are at" the authors' repository (abstract).
- **To reuse it:** tasks with a unique, externally verifiable answer (§2.1); a Python 3 runtime with §3.1's libraries, sandboxed with a 5-second limit (Fig. 2); for the translation test, a translator from the same model family as the code generator (§4.3).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
