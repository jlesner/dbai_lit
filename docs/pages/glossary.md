# Glossary

Plain definitions of the field's terms, for readers who know LLMs and programming but not database theory, formal methods or RL.

<!-- filter -->

<p class="jump"><a href="#/glossary/letter-a">A</a> · <a href="#/glossary/letter-b">B</a> · <a href="#/glossary/letter-c">C</a> · <a href="#/glossary/letter-d">D</a> · <a href="#/glossary/letter-e">E</a> · <a href="#/glossary/letter-f">F</a> · <a href="#/glossary/letter-g">G</a> · <a href="#/glossary/letter-h">H</a> · <a href="#/glossary/letter-i">I</a> · <a href="#/glossary/letter-j">J</a> · <a href="#/glossary/letter-k">K</a> · <a href="#/glossary/letter-l">L</a> · <a href="#/glossary/letter-m">M</a> · <a href="#/glossary/letter-n">N</a> · <a href="#/glossary/letter-o">O</a> · <a href="#/glossary/letter-p">P</a> · <a href="#/glossary/letter-q">Q</a> · <a href="#/glossary/letter-r">R</a> · <a href="#/glossary/letter-s">S</a> · <a href="#/glossary/letter-t">T</a> · <a href="#/glossary/letter-u">U</a> · <a href="#/glossary/letter-v">V</a> · <a href="#/glossary/letter-w">W</a> · <a href="#/glossary/letter-z">Z</a></p>

<a id="3-sat"></a>

## 3-SAT

Deciding whether a formula of a fixed shape can be made true: an AND of clauses, each an OR of three literals (a variable or its negation), such as (x ∨ ¬y ∨ z) ∧ (¬x ∨ y ∨ w). It is NP-complete, and hardness proofs start from it: to show a query problem NP-hard, they turn any 3-SAT formula into an instance of that problem. A quantified version asks whether every setting of some of the variables can be completed to a satisfying one; [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") calls it Q3-SAT and uses its Π₂ᵖ-completeness to prove that equivalence of select-project-join-union queries is Π₂ᵖ-complete (§10, PDF pp. 19–21).

Example ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §5.1–5.3, PDF pp. 16–18): from a 3-SAT formula the authors build one [tableau](#/glossary/tableau) with a row per clause and another with seven rows per clause, one per satisfying assignment of that clause's three variables; the first contains the second exactly when the formula is satisfiable (Lemma 4), so tableau containment is NP-complete (Thm. 7).

**Learn more:** [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §5.1 (PDF p. 16), which calls it "the 3-satisfiability problem, shown NP-complete in [12]"; [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §10 (PDF pp. 19–21). The original NP-completeness paper is not listed here.

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [tableau](#/glossary/tableau), [query containment](#/glossary/query-containment)


<a id="letter-a"></a>

<a id="abstract-interpretation"></a>

## Abstract interpretation

Proving properties of a program by reasoning about simplified (abstract) versions of its states, for example "x is positive" instead of x's exact value. [Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") App. A describes it this way: if a property holds for the abstract program it holds for the real one, but not the reverse, so when the abstract check fails the abstraction is refined to exclude the counterexample and the check is repeated. It is an [over-approximation](#/glossary/over-approximation-and-under-approximation).

**Learn more:** [Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") ([PDF p. 13](https://arxiv.org/pdf/2310.04870#page=13)) App. A (PDF p. 13), an overview of bounded model checking, k-induction and abstract interpretation, and §5.1, where UAutomizer, one of its two verifiers, "is based on predicate abstraction".

**Related:** [k-induction](#/glossary/k-induction), [bounded verification](#/glossary/bounded-verification), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation), [spurious counterexample](#/glossary/spurious-counterexample), [loop invariant](#/glossary/loop-invariant)


<a id="abstract-syntax-tree-ast"></a>

## Abstract syntax tree (AST)

The tree a parser builds from program or query text: each node is a construct (a SELECT clause, a join, an expression), with its parts as children. Query-rewriting tools parse a query into an AST, change the tree, and print it back as text; [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §1 says the grammar-based parsers these tools use often fail on dialect-specific syntax.

**Learn more:** [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §1; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §4.3, which keeps a self-written unit test only if it parses into a valid AST.

**Related:** [SQL dialect](#/glossary/sql-dialect), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="active-learning"></a>

## Active learning

Choosing which unlabelled examples to have labelled, instead of labelling a random sample, so that each costly label teaches the model more. Example: in [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §4.2 a small reward model scores many sampled solutions per problem, and the training data is drawn mostly (80%) from the most convincing wrong-answer solutions, the ones it scores highest despite a wrong final answer; the authors report that active learning gives "a 2.6× improvement in the data efficiency of process supervision" (§1).

**Learn more:** [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §1 and §4.2, which use the term without defining it (general definition).

**Related:** [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward model](#/glossary/reward-model), [weak supervision](#/glossary/weak-supervision)


<a id="agent-harness"></a>

## Agent harness

The code and text around a fixed LLM that turn it into an agent: its prompts, the context it is given, the tool definitions, and the control code that runs the loop. Harness optimization changes these and leaves the model's weights alone; [Do Agent Optimizers Compound?](#/papers/wang2026compound "Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0 (2026)") describes it as treating the harness around a fixed LLM "(its prompts, context, tool definitions, and control code)" as a search space.

**Learn more:** [Do Agent Optimizers Compound?](#/papers/wang2026compound "Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0 (2026)") §2.1; [HarnessLens ("Verify Smarter](#/papers/xu2026harnesslens "Verify Smarter, Evolve Further: Efficient Harness Evolution through Behavior-Aware Verification (2026)") §1, which evolves the harnesses of three coding agents.

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="agent-skill"></a>

## Agent skill

A text file of instructions, procedures and know-how that an agent loads into its context before a task, so that the know-how can be edited, shared and optimized without changing the model. Some papers use "skill" for executable code instead, e.g. compiled Python procedures ([SKILL-DISCO](#/papers/guo2026skilldisco "SKILL-DISCO: Distilling and Compiling Agent Traces into Reusable Procedural Skills (2026)")); their summaries say so. [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)") §1 defines a skill as "a portable natural-language artifact that packages procedures, domain heuristics, tool policies, output constraints, and failure modes".

[SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)") measures curated and self-written skills against none (§5.1, App. D.6).

**Related:** [agent harness](#/glossary/agent-harness), [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [meta-prompt](#/glossary/meta-prompt)


<a id="akaike-information-criterion-aic"></a>

## Akaike information criterion (AIC)

A score for choosing among statistical models fitted to the same data: it rewards a good fit and charges for each extra parameter, and the model with the lowest score is preferred. It keeps a more flexible curve from winning only because it can bend to the noise.

**Learn more:** [How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") ([PDF p. 5](https://arxiv.org/pdf/2609.01660#page=5)) §3.4 (PDF p. 5), which uses it to choose among geometric, threshold and linear decay of success with horizon, without defining it (general definition). The criterion's original paper is not listed here.

**Related:** [Wilson score interval](#/glossary/wilson-score-interval)


<a id="algebraic-datatype"></a>

## Algebraic datatype

A type defined by listing the forms its values can take, each made by a constructor that may carry fields, like a tagged union. The option type is the standard small example: a value is either "none" or "some(v)". [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") notes that SMT solvers' user-defined algebraic datatypes could in principle encode nullable SQL values, "as nullable types are a form of option types", but that this is "not enough" because every operator must also be lifted to nullable arguments, so it extends cvc5's datatypes solver with built-in nullable sorts (§4).

**Learn more:** [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 14](https://arxiv.org/pdf/2405.03057#page=14)) §4 (PDF p. 14) and abstract, which builds its theory of nullable sorts as "an extension of the theory of algebraic datatypes"; it uses the term without defining it (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="approximate-nearest-neighbour-search-anns"></a>

## Approximate nearest-neighbour search (ANNS)

Finding stored vectors close to a query vector quickly, with an index that gives up the guarantee of returning the exact nearest ones. It is how embedding-based search scales to large collections. GEqO uses it to find likely-equivalent pairs among many query subexpressions, calling it "a popular, high-performance technique … with moderate precision" ([GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1).

**Learn more:** [GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1 and §2.2.1, which use it without defining it (general definition).

**Related:** [locality-sensitive hashing (MinHash)](#/glossary/locality-sensitive-hashing-minhash), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [contrastive learning](#/glossary/contrastive-learning)


<a id="auroc"></a>

## AUROC

Area under the ROC curve: how well a score separates two classes over all possible thresholds. It equals the chance that a randomly chosen positive (say, buggy code) scores above a randomly chosen negative; 0.5 is chance and 1 is perfect. Because it ignores where the threshold sits, papers that care about few false alarms also report the true-positive rate at a fixed low false-positive rate.

**Learn more:** [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") §2.5, which reports AUROC with TPR and FNR at 5% FPR, "the low-false-positive regime where extra review is costly"; [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") Tab. 1.

**Related:** [F1 score](#/glossary/f1-score)


<a id="autoformalization"></a>

## Autoformalization

Translating mathematics written in natural language (a problem statement, sometimes its proof) into the formal language of a [proof assistant](#/glossary/proof-assistant) such as Lean, so that a machine can check proofs of it. Training sets for LLM theorem provers are built this way: [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") says they are "typically derived by formalizing existing natural-language mathematical corpora" (§2.1).

Gotcha: a formal statement can say something other than the original, and a proof of it then proves nothing about the original. Goedel-Prover-V2's authors report that in existing Lean datasets "over 80% of unsolved problems are incorrectly formalized", from a human evaluation of a sample ([Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.2).

**Learn more:** [STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") ([PDF p. 4](https://arxiv.org/pdf/2502.00212#page=4)) §2 (PDF p. 4), which defines it as "translating natural language math statements and/or proofs to formal language"; [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 4](https://arxiv.org/pdf/2306.15626#page=4)) §2 (PDF p. 4); [Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") ([PDF p. 3](https://arxiv.org/pdf/2508.03613#page=3)) §2.2 (PDF p. 3), on training a formalizer and judging whether its output is faithful; [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 6](https://arxiv.org/pdf/2504.21801#page=6)) §2.3 (PDF p. 6), which adds "problems derived from autoformalization" to its training data.

**Related:** [proof assistant](#/glossary/proof-assistant), [formal specification](#/glossary/formal-specification), [expert iteration](#/glossary/expert-iteration)


<a id="automated-program-repair"></a>

## Automated program repair

Research on fixing bugs in code automatically: given a faulty program and a signal of what is wrong (failing tests, a compiler or runtime error), produce a corrected version. [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") §6 calls program repair "an area of research concerned with fixing bugs in code" and contrasts earlier work, which trained a separate repair model, with its own approach, which teaches a pretrained LLM to debug its own code "via few-shot prompting".

**Learn more:** [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") ([PDF p. 13](https://arxiv.org/pdf/2304.05128#page=13)) §6 (PDF p. 13).

**Related:** [self-correction](#/glossary/self-correction), [reranking](#/glossary/reranking), [test oracle](#/glossary/test-oracle)


<a id="automatic-differentiation-backpropagation"></a>

## Automatic differentiation (backpropagation)

Computing the gradient of a program's output with respect to all its parameters automatically, from the record of the operations it ran, as frameworks such as PyTorch do for neural networks; backpropagation (reverse mode) passes derivatives backwards through that record with the chain rule, and a forward mode also exists ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") App. B). TextGrad and Trace borrow the idea for LLM systems: they record a pipeline's computation graph and pass information other than numbers backwards through it. TextGrad passes LLM-written textual feedback (see [textual gradient](#/glossary/textual-gradient)), while Trace passes the output feedback together with "minimal subgraphs" of that graph ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") §3.3, §5.5).

**Learn more:** [Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") App. B ("AutoDiff and Back-propagation"), §1.1 and §5.5 (Trace compared with TextGrad); [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)") §1, which presents TextGrad as "automatic differentiation via text". The original backpropagation paper, which Trace cites, is not listed here.

**Related:** [textual gradient](#/glossary/textual-gradient), [black-box optimization](#/glossary/black-box-optimization)


<a id="letter-b"></a>

<a id="back-translation"></a>

## Back-translation

Translating a text back into the language it came from. In machine translation it is "a data augmentation technique" ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §5) that makes extra training pairs by translating target-language text into the source language (general definition; the original papers are not listed here). In text-to-SQL it is used as a check: GBV-SQL has an LLM explain a generated query in words and compare the explanation with the question, to catch queries that are valid SQL but answer a different question ([GBV-SQL](#/papers/chen2025gbvsql "GBV-SQL: Guided Generation and SQL2Text Back-Translation Validation for Multi-Agent Text2SQL (2025)") §3.4), and round-trip correctness similarly evaluates a model by a trip there and back ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §1).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §5, which names it without describing it (general definition); [GBV-SQL](#/papers/chen2025gbvsql "GBV-SQL: Guided Generation and SQL2Text Back-Translation Validation for Multi-Agent Text2SQL (2025)") §3.4.

**Related:** [text-to-SQL](#/glossary/text-to-sql), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="bag-semantics"></a>

## Bag semantics

Tables and query results are bags (multisets): a row can appear several times, and how many times counts. This is SQL's default; duplicates are removed only when a query asks (`DISTINCT`, or `UNION`, `INTERSECT` and `EXCEPT` without `ALL`).

Example: if table `Emp(name)` holds "Ann" twice, `SELECT name FROM Emp` returns "Ann" twice and `SELECT DISTINCT name FROM Emp` once. The two queries are equivalent under [set semantics](#/glossary/set-semantics) but not under bag semantics. A sharper case: `Q(X) :- p(X)` and `Q'(X) :- p(X), p(X)` agree as sets, but if `p(a)` is stored twice, Q returns `a` twice and Q′ four times ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") Example 5.1).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1–2 (PDF pp. 1–2) and §5 (PDF p. 7); [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 8](https://arxiv.org/pdf/2403.03193#page=8)) §3.3 (PDF p. 8) for an equivalence checker built on bag semantics. [Attacking Diophantus](#/papers/konstantinidis2026diophantus "Attacking Diophantus: Special Cases of Bag Containment (2026)") ([PDF p. 9](https://arxiv.org/pdf/2609.30956#page=9)) §3.1 (PDF p. 9) calls it "bag-bag semantics".

**Related:** [set semantics](#/glossary/set-semantics), [bag-set semantics](#/glossary/bag-set-semantics), [list semantics](#/glossary/list-semantics), [combined semantics](#/glossary/combined-semantics), [query equivalence](#/glossary/query-equivalence)


<a id="bag-set-semantics"></a>

## Bag-set semantics

Stored tables are sets (no duplicate rows), but query results are bags: each way of matching the query to the data adds one copy of the output row. It models SQL without `DISTINCT` over tables that have keys, where duplicates come only from projection.

Example ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") Example 7.2): `Q(age) :- Student(id, age), Emp(id, job)` returns a student's age once per job the student holds. So it is contained in `Q'(age) :- Student(id, age)` under set semantics, but not under bag-set semantics.

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §7 (PDF p. 9), which studies it as queries over "set-valued databases"; [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") §2.2 (PDF p. 4). The papers agree on the meaning but not the name: [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") marks it with the subscript M (multiset) and [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") §2 calls such queries "multiset queries". [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") ([PDF p. 11](https://arxiv.org/pdf/1802.02229#page=11)) §6.2 (PDF p. 11) uses "mixed bag-set semantic queries" for queries that mix set and bag operations, which is closer to [combined semantics](#/glossary/combined-semantics).

**Related:** [bag semantics](#/glossary/bag-semantics), [set semantics](#/glossary/set-semantics), [combined semantics](#/glossary/combined-semantics)


<a id="bayesian-optimization"></a>

## Bayesian optimization

Tuning choices that are expensive to score by fitting a cheap surrogate model to the scores measured so far and using it to pick what to try next, balancing promising regions against unexplored ones. MIPRO uses it to choose combinations of instructions and demonstrations: "a surrogate model learns to predict the quality of different parameter combinations from previous evaluations, allowing us to focus future exploration on the promising regions of the search space" ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §3.2). Its surrogate is Optuna's implementation of the Tree-structured Parzen Estimator (TPE) (§4.3; §3.2 calls it the "Tree Structured Parzen Optimizer"), which DSPy also names ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4).

**Learn more:** [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §3.2 and §4.3; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4. The TPE paper (Bergstra et al.) is not listed here.

**Related:** [hyperparameter optimization](#/glossary/hyperparameter-optimization), [black-box optimization](#/glossary/black-box-optimization), [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb)


<a id="beam-search"></a>

## Beam search

Building an answer step by step while keeping only a fixed number of the best partial answers (the beam): at each step every kept partial answer is extended in several ways, the extensions are scored, and only the best are kept. Unlike [best-of-N sampling](#/glossary/best-of-n-sampling), which scores only finished answers, it needs a score for partial ones: the language model's own probability in classic decoding, a process reward model (PRM; see [outcome and process rewards](#/glossary/outcome-and-process-rewards)) in [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)"), or a learned value network over partial query plans in [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)"). Pruning early can discard the path to the best answer; Balsa's authors note that it "is not guaranteed to return globally optimal plans" (§4.2).

Example ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §5.2): with N beams and beam width M, sample N first steps, score them with the PRM, keep the top N/M, sample M next steps from each, and repeat. The paper's Fig. 2 caption says "top M" instead, but "as the budget is scaled up, these improvements greatly diminish, with beam search often underperforming the best-of-N baseline" (§5.3).

Other uses: prompt optimizers keep a beam of candidate prompts ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") §2.2).

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") ([PDF p. 7](https://arxiv.org/pdf/2408.03314#page=7)) §5.2 (PDF p. 7) and §5.3 (PDF p. 9); [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 5](https://arxiv.org/pdf/2201.01441#page=5)) §4.2 (PDF pp. 5–6); [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") ([PDF p. 3](https://arxiv.org/pdf/2305.03495#page=3)) §2.2 (PDF p. 3).

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts), [outcome and process rewards](#/glossary/outcome-and-process-rewards)


<a id="best-arm-identification"></a>

## Best arm identification

A bandit problem whose goal is to find the best option (or the best few) with as few trials as possible, rather than to collect as much reward as possible along the way; ProTeGi's authors note that UCB "is designed primarily for regret minimization", the second goal ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") §2.2.2). ProTeGi uses it to choose which candidate prompts to keep: each arm is a prompt, its hidden value is the prompt's score on the dataset, and one "pull" evaluates the prompt on one randomly chosen example, so the goal is "to find the b best arms with as few pulls as possible". One of the algorithms it tries, Successive Rejects, evaluates the surviving prompts on more data in each round and drops the lowest-scoring one.

**Learn more:** [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") ([PDF p. 4](https://arxiv.org/pdf/2305.03495#page=4)) §2.2.2 (PDF p. 4), which cites Audibert et al. 2010 (not listed here) for the problem.

**Related:** [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb), [exploration and exploitation](#/glossary/exploration-and-exploitation), [beam search](#/glossary/beam-search)


<a id="best-first-search"></a>

## Best-first search

A search that keeps every state it has found but not yet expanded, and always expands the one with the best score next (general definition). Unlike [beam search](#/glossary/beam-search), it does not discard states, so a branch that looked poor can be taken up again if the better-looking ones fail. LeanDojo's prover searches over proof states this way, following the earlier provers its §5 cites: each step generates 64 candidate [tactics](#/glossary/tactic), and states are ranked "by the sum of log-likelihoods of tactics leading to that state" ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") App. C.1).

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 24](https://arxiv.org/pdf/2306.15626#page=24)) App. C.1 (PDF p. 24); its §5 (PDF p. 7) calls it "a standard best-first search algorithm" without defining it (general definition).

**Related:** [beam search](#/glossary/beam-search), [tactic](#/glossary/tactic), [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts), [premise selection](#/glossary/premise-selection)


<a id="best-of-n-sampling"></a>

## Best-of-N sampling

Sample N complete answers independently and return the one that a scorer rates highest: a learned verifier or reward model, unit tests, or a proof checker. [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") defines it as "sampling N outputs in 'parallel' from a base LLM and selecting the one that scores the highest per a learned verifier or a reward model" (§1).

How it differs from its neighbours: [self-consistency](#/glossary/self-consistency-majority-voting) also samples many answers but returns the most frequent one, with no scorer. [Pass@k](#/glossary/passk) credits a problem if any of k samples is right, as if a perfect scorer did the choosing, so best-of-N over the same samples can only match it, never beat it. A mixed variant, "best-of-N weighted", adds up the scorer's scores of all samples with the same final answer and returns the answer with the highest total ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §5.1).

Gotcha: it rewards whatever the scorer rates highly, flaws included. Snell et al. found a PRM trained on the PRM800k data "easy to exploit … via even naïve strategies such as best-of-N sampling" (§5.1), and [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") argues that when a verifier accepts some wrong answers, resampling against it has an accuracy ceiling "regardless of compute budget" (abstract).

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") ([PDF p. 2](https://arxiv.org/pdf/2408.03314#page=2)) §1 (PDF p. 2), §2 (PDF p. 4) and §5.1 (PDF p. 7); [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") ([PDF p. 1](https://arxiv.org/pdf/2411.17501#page=1)) abstract (PDF p. 1).

**Related:** [self-consistency](#/glossary/self-consistency-majority-voting), [pass@k](#/glossary/passk), [beam search](#/glossary/beam-search), [rejection sampling](#/glossary/rejection-sampling), [reward hacking](#/glossary/reward-hacking), [outcome and process rewards](#/glossary/outcome-and-process-rewards)


<a id="bijection"></a>

## Bijection

A one-to-one pairing between two collections that uses every element of each exactly once, so the two have the same size. SPES proves two queries equivalent under [bag semantics](#/glossary/bag-semantics) by showing that on every input there is a "bijective, identity map" between their outputs: "a one-to-one map that maps a tuple in one output table to an unique, identical tuple in the other output table", so duplicates are matched one for one ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)") §3.1).

**Learn more:** [SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)") ([PDF p. 3](https://arxiv.org/pdf/2004.00481#page=3)) §3.1 (PDF p. 3).

**Related:** [bag semantics](#/glossary/bag-semantics), [query equivalence](#/glossary/query-equivalence)


<a id="bisimulation"></a>

## Bisimulation

A relation between the states of two systems such that related states give the same observable results and stay related after every pair of matching steps (general definition). Finding one proves the two systems equivalent, since no sequence of steps can make them differ. Mediator proves two versions of a database application equivalent this way. Its "bisimulation invariant" is a formula relating the two databases, built from equalities such as Π_{sid, sname}(Subscriber) = Π_{sid′, sname′}(Subscriber′) between projections of their tables (§2). The formula must hold for two empty databases, be kept by every pair of corresponding updates, and imply that corresponding queries return the same results ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §4.1).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 10](https://arxiv.org/pdf/1710.07660#page=10)) §4.1 (PDF p. 10), which calls finding a bisimulation relation "a standard methodology for proving equivalence between any two systems", and §9 (PDF p. 23), on its use in [translation validation](#/glossary/translation-validation).

**Related:** [Hoare triple](#/glossary/hoare-triple), [loop invariant](#/glossary/loop-invariant), [monomial predicate abstraction](#/glossary/monomial-predicate-abstraction), [query equivalence](#/glossary/query-equivalence)


<a id="black-box-optimization"></a>

## Black-box optimization

Optimizing parameters using only the scores they receive, without gradients or any view inside the system being tuned. Trace compares itself with two such methods, Gaussian-process minimization (a form of [Bayesian optimization](#/glossary/bayesian-optimization)) and particle swarm optimization ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") §5.2), and treats LLM optimizers such as OPRO, which see only past inputs and scores, as black-box optimizers too (App. I.3).

**Learn more:** [Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") §5.2 and App. I.3, which use the term without defining it (general definition).

**Related:** [Bayesian optimization](#/glossary/bayesian-optimization), [evolutionary search](#/glossary/evolutionary-search), [automatic differentiation (backpropagation)](#/glossary/automatic-differentiation-backpropagation)


<a id="bleu-and-rouge"></a>

## BLEU and ROUGE

Scores that compare a generated text with reference texts by counting shared words and word sequences (n-grams); BLEU is precision-oriented (how much of the output appears in the references), ROUGE recall-oriented (how much of the reference appears in the output). They reward wording, not meaning: [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") notes that such metrics "rely on lexical overlap, against reference texts", and that on editing tasks a baseline that returns its input unchanged "fares well" on them (§4.3).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.3, which uses them without defining them (general definition); the original papers are not listed here.

**Related:** [exact match](#/glossary/exact-match), [F1 score](#/glossary/f1-score)


<a id="bm25"></a>

## BM25

A classic keyword-based ranking function for search: it scores a document by the query words it contains, giving more weight to rare words and less to repeated words and long documents. It is the usual lexical ("sparse") retriever, as opposed to [dense retrieval](#/glossary/dense-retrieval), which compares learned embeddings.

**Learn more:** nothing on this site defines it (general definition). [Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)") §4.2 compares BM25 with dense retrieval; [FAPO](#/papers/kassianik2026fapo "FAPO: Fully Automated Prompt Optimization of Multi-Step LLM Pipelines (2026)") §4.1 uses it in a HotpotQA pipeline.


<a id="bnf-backus-naur-form"></a>

## BNF (Backus-Naur form)

A standard notation for a language's grammar: rules that expand non-terminal symbols (a clause, an expression) into sequences of terminal symbols (keywords, literals) and other non-terminals, e.g. `<select> ::= SELECT <columns> FROM <table>`. A parser built from such a grammar turns text into a syntax tree. CrackSQL writes each database system's syntax in one BNF format, so that in a syntax tree "the leaf nodes represent BNF terminal symbols (e.g., SQL literals), and the internal nodes represent non-terminal symbols (e.g., SQL clauses or functions)" ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") §4.1).

**Learn more:** [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") ([PDF p. 8](https://arxiv.org/pdf/2504.00882#page=8)) §4.1 (PDF p. 8), which uses the term without defining it (general definition).

**Related:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [concrete syntax tree (CST)](#/glossary/concrete-syntax-tree-cst), [SQL dialect](#/glossary/sql-dialect), [parser error recovery](#/glossary/parser-error-recovery)


<a id="boolean-query"></a>

## Boolean query

A query with no output columns: it only asks whether the pattern it describes occurs in the database. Under [set semantics](#/glossary/set-semantics) the answer is yes or no; under [bag semantics](#/glossary/bag-semantics) it is a count of the ways the pattern occurs. [Bag Semantics Conjunctive Query…](#/papers/marcinkowski2025smallsteps "Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability. (2024)") defines the answer of a Boolean [conjunctive query](#/glossary/conjunctive-query) ψ on a database D as ψ(D) = |Hom(ψ, D)|, the number of [homomorphisms](#/glossary/homomorphism-containment-mapping) from the query into the database (§2.1), so [query containment](#/glossary/query-containment) between two Boolean queries becomes the inequality ψ_s(D) ≤ ψ_b(D) for every D (§1.2).

Example (ours): `SELECT 1 FROM Emp e, Dept d WHERE e.dept = d.id AND d.city = 'NY'` asks whether some employee works in a New York department; under bag semantics its answer is the number of rows it returns.

**Learn more:** [Bag Semantics Conjunctive Query…](#/papers/marcinkowski2025smallsteps "Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability. (2024)") ([PDF p. 5](https://arxiv.org/pdf/2503.18003#page=5)) §2.1 (PDF p. 5) and §1.2 (PDF p. 3).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [bag semantics](#/glossary/bag-semantics), [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment)


<a id="bootstrap-resampling"></a>

## Bootstrap resampling

A way to estimate how much a measured result depends on which test items happened to be used: draw many new samples of the same size from the original items with replacement (so some items appear twice and some not at all), recompute the result on each, and look at how much it varies. A paired bootstrap resamples the shared items once for both systems being compared, so it measures the uncertainty of their difference.

Example: [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") puts confidence intervals on accuracy differences with a paired bootstrap over questions with 10,000 resamples, because "questions are the unit of resampling, since they are what we wish to generalise over" (§4.5). [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") uses it to pick a prompt: it redraws the validation set 20 times and returns the candidate that ranks first on the most redraws (§3.4).

Not to be confused with DSPy's BootstrapFewShot, a baseline in [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") (§4.1) that builds few-shot demonstrations, not resamples.

**Learn more:** [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") ([PDF p. 8](https://arxiv.org/pdf/2607.28576#page=8)) §4.5 (PDF p. 8); [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") ([PDF p. 4](https://arxiv.org/pdf/2609.04197#page=4)) §3.4 (PDF p. 4). Efron's 1979 paper (cited by [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)")) and Efron and Tibshirani's 1993 textbook (cited by [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)")) are not listed here.

**Related:** [multiple testing](#/glossary/multiple-testing), [McNemar's exact test](#/glossary/mcnemars-exact-test)


<a id="bounded-verification"></a>

## Bounded verification

Checking a property only for inputs up to a size limit. For SQL equivalence: checking that two queries agree on every database whose tables each hold at most K rows (and that satisfies the schema's constraints). A counterexample found this way is real if the checker models SQL exactly (see [spurious counterexample](#/glossary/spurious-counterexample)), but "no counterexample up to K" does not show that the queries agree on larger databases, unless a theorem says K is large enough (see [small counterexample property](#/glossary/small-counterexample-property)).

For programs, bounded model checking (BMC) is the same idea: it unrolls loops up to a bound and searches, usually with an SMT solver, for a counterexample within that many steps; on its own it "cannot prove loop invariants" ([Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") App. A), which [k-induction](#/glossary/k-induction) can.

A (PDF p. 13), for bounded model checking.

**Related:** [counterexample database](#/glossary/counterexample-database), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [soundness and completeness](#/glossary/soundness-and-completeness), [small-scope hypothesis](#/glossary/small-scope-hypothesis), [k-induction](#/glossary/k-induction), [abstract interpretation](#/glossary/abstract-interpretation)


<a id="branch-and-path-coverage"></a>

## Branch and path coverage

Measures of how thoroughly tests exercise a program. Branch coverage is the share of the program's branches (each way out of a decision, such as the true and the false side of an `if`) that at least one test executes; path coverage is the share of complete routes through the program's control flow that the tests execute. Path coverage is stricter, and a loop can make the number of paths unbounded.

Example: `if a: f` followed by `if b: g` has four branches, all covered by the two tests (a, b) = (true, true) and (false, false); it has four paths, which need all four combinations. EvalPlus's authors note that high coverage is not enough: a test that covers code "is not necessarily effective in finding critical defects in its covered code" ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") §2.2), which is why they also use [mutation testing](#/glossary/mutation-testing).

For SQL, ParSEval defines a query's paths on its [logical plan](#/glossary/logical-plan) and treats each behaviour of an operator as a branch; for a filter, one test row that passes the condition and one that fails it ([ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §1, Tab. 2).

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5); [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §1 (PDF p. 2), §2.2 (PDF p. 3) and Tab. 2 (PDF p. 5).

**Related:** [mutation testing](#/glossary/mutation-testing), [fuzzing](#/glossary/fuzzing), [symbolic execution](#/glossary/symbolic-execution), [logical plan](#/glossary/logical-plan)


<a id="branch-distance"></a>

## Branch distance

In search-based test generation, a number that says how far a condition in the code is from being true for a given input: zero when it holds, and smaller the closer the input comes. Used as a fitness score, it steers a search, such as a [genetic algorithm](#/glossary/genetic-algorithm), towards inputs that take a branch not yet covered (general definition). EvoSQL uses Korel's standard branch distance for comparisons of numbers and booleans when generating test data for SQL queries: for the condition `price=10` the distance is abs(price − 10), and for an `AND` of conditions it is the sum of their distances ([EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §3.2.2); strings get an edit distance instead.

**Learn more:** [EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §3.2.2 (PDF pp. 3–4), which cites Korel [22] for the standard distance without defining it (general definition) and defines distances for SQL's `BETWEEN`, `IN`, `LIKE`, `EXISTS`, `IS NULL` and join conditions. Korel's paper is not listed here.

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [genetic algorithm](#/glossary/genetic-algorithm), [fuzzing](#/glossary/fuzzing)


<a id="letter-c"></a>

<a id="canonical-database"></a>

## Canonical database

The database made from a conjunctive query by "freezing" each variable into a constant, so that the query's body becomes a set of rows. Containment can be tested by evaluating the other query over it: q ⊆ q′ exactly when q′ returns q's frozen head tuple there, a characterization [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") §1 credits to Chandra and Merlin. With nulls or comparisons a single canonical database no longer suffices, and the known tests use an exponential family of them (same place).

**Learn more:** [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") §1. [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §5 (PDF p. 5) builds the same database under the name "natural model", but states only an equivalence test (homomorphisms both ways, Lemma 13, PDF p. 7); the one-way containment test is implicit in its proof.

**Related:** [conjunctive query](#/glossary/conjunctive-query), [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment), [counterexample database](#/glossary/counterexample-database)


<a id="cardinality-estimation"></a>

## Cardinality estimation

The optimizer's estimate of how many rows each step of a plan will produce: after a filter, a join, a grouping. The [optimizer cost estimate](#/glossary/optimizer-cost-estimate) of a plan is computed from these numbers, so a bad cardinality estimate can make a slow plan look cheap. Estimates come from stored statistics (row counts, numbers of distinct values, histograms) combined by simplifying assumptions such as independence between columns; for a filter, the estimate is the input's rows times the condition's [selectivity](#/glossary/selectivity).

Example: [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") describes PostgreSQL's estimator as using "per-column histograms; heuristically assumes independence for joins; 'magic constants' for complex filters" (§3.3), and its authors, citing Leis et al. (not listed here), write that "In traditional optimizers, cardinality estimates are known to be highly inaccurate", which "can lead to poor plans" (§10). LITHE puts selectivities obtained "via calls to the cardinality estimation modules of the query optimizer" into its prompts ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §4.2).

**Learn more:** [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 4](https://arxiv.org/pdf/2201.01441#page=4)) §3.1 (PDF p. 4), whose minimal cost model sums estimated cardinalities, §3.3 (PDF p. 5) and §10 (PDF p. 13); [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §6.4 (PDF p. 9), which measures misestimates on a benchmark and states that their accuracy "is crucial for the plan quality".

**Related:** [selectivity](#/glossary/selectivity), [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [cost-based optimization](#/glossary/cost-based-optimization), [query optimizer](#/glossary/query-optimizer)


<a id="catastrophic-forgetting"></a>

## Catastrophic forgetting

When a model, or an optimized prompt or harness, is updated on new tasks and loses performance on tasks it handled before. Continual-learning methods try to keep the old skills while adding new ones.

**Learn more:** [Do Agent Optimizers Compound?](#/papers/wang2026compound "Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0 (2026)") §2.2, which defines it as "the tendency of a model updated on new data to lose performance on previously learned tasks" and studies the same question for harness optimizers; [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") §5.1 measures it as backward transfer.

**Related:** [agent harness](#/glossary/agent-harness)


<a id="certificate"></a>

## Certificate

Evidence for an answer that a program can check without trusting whoever produced it. For SQL equivalence: a [counterexample database](#/glossary/counterexample-database) for "different", or a machine-checked proof for "equivalent".

**Related:** [counterexample database](#/glossary/counterexample-database), [proof assistant](#/glossary/proof-assistant), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="chase"></a>

## Chase

A procedure that rewrites a query so that it states what the schema's constraints imply. For a foreign key it adds the referenced table's row to the query; for a key it merges terms that the key forces to be equal. It repeats until nothing changes; for some constraints it never stops, but for acyclic ones it does. Equivalence under the constraints can then be decided by comparing the chased queries, for the semantics and constraints these papers treat.

**Learn more:** [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") §5 (PDF p. 8); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 9](https://arxiv.org/pdf/2609.09978#page=9)) §4 (PDF pp. 9–10), for keys and foreign keys.

**Related:** [integrity constraint](#/glossary/integrity-constraint), [conjunctive query](#/glossary/conjunctive-query)


<a id="church-rosser-property"></a>

## Church-Rosser property

A set of rewrite steps has it when the order of applying them doesn't change where you can end up: whenever an object can be rewritten in two different ways, each by any number of steps, both results can be rewritten further to a common result. "Finite Church–Rosser" adds that every sequence of steps stops; then applying the steps in any order until none applies gives one normal form, so two objects can be compared by their normal forms (general definition; with every sequence stopping, it is enough to check single steps). [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") proves that foldings of a conjunctive query are Church–Rosser up to isomorphism (Thm. 9, PDF p. 6), and [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") gives transformations of unions of elementary differences that are finite Church–Rosser (§7, PDF pp. 13–14).

**Learn more:** [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §7 (PDF pp. 13–14), which takes the term from Aho, Sethi and Ullman (ref. [6], not listed here); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 9 (PDF p. 6) and §7 (PDF p. 10). Both use the term without defining it (general definition).

**Related:** [query equivalence](#/glossary/query-equivalence), [tableau](#/glossary/tableau), [conjunctive query](#/glossary/conjunctive-query)


<a id="classical-planning-strips-and-pddl"></a>

## Classical planning (STRIPS and PDDL)

Finding a sequence of actions that takes a world from a given start state to a state that meets a goal, where the world is discrete and each action has a fixed, certain effect. Each action has preconditions (what must hold before it) and effects (what it changes). STRIPS is the classic formalism for such problems, and PDDL is the standard language for writing them down: a domain (predicates and actions), an initial state and a goal. Because a plan can be simulated step by step, a program can check it.

Example: Blocksworld, where the actions pick up, put down and stack blocks to reach a goal arrangement.

**Learn more:** [On the Self-Verification Limitations…](#/papers/stechly2024selfverification "On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks (2024)") ([PDF p. 5](https://arxiv.org/pdf/2402.08115#page=5)) §3.3 (PDF p. 5), which describes STRIPS planning and the three parts of a PDDL specification; its App. A.5.1 checks plans with the validator VAL.

**Related:** [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="co-np"></a>

## co-NP

The class of yes/no problems whose "no" answers have a short proof that can be checked quickly: the mirror image of NP, where the "yes" answers have one (general definition). Typical members ask whether something holds in every case, such as whether a formula is true under every assignment of its variables; a single case where it fails is the short proof of "no". Example: for queries over databases that record only partial information about the order of events, van der Meyden reports that every query can be answered in co-NP in the size of the database, and that some query is co-NP-hard ([querying indefinite order data](#/papers/vandermeyden1992indefinite "The complexity of querying indefinite data about linearly ordered domains (1992)") §1, Tab. 1).

**Learn more:** [querying indefinite order data](#/papers/vandermeyden1992indefinite "The complexity of querying indefinite data about linearly ordered domains (1992)") §1 and Tab. 1 (PDF p. 4), which use the class without defining it (general definition).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [data, query and combined complexity](#/glossary/data-query-and-combined-complexity), [satisfiable and valid](#/glossary/satisfiable-and-valid)


<a id="coalescing-temporal"></a>

## Coalescing (temporal)

In a temporal database, merging rows that have the same values and time periods that meet into one row whose period covers both: a row saying Ann worked in Sales from January to March and one saying she did from April to June become one row, January to June. [A Foundation for Conventional…](#/papers/slivinskas2001foundation "A Foundation for Conventional and Temporal Query Optimization Addressing Duplicates and Ordering (2001)") describes it as "tuples with adjacent time periods and otherwise identical attribute values are consolidated" (§1, PDF p. 1). Definitions differ on overlapping periods: its coalescing merges only adjacent ones, while Böhlen et al.'s also merges overlapping ones (§3.3.1, PDF p. 4).

**Learn more:** [A Foundation for Conventional…](#/papers/slivinskas2001foundation "A Foundation for Conventional and Temporal Query Optimization Addressing Duplicates and Ordering (2001)") §1 (PDF p. 1) and §3.3.1 (PDF p. 4); Böhlen et al.'s paper is not listed here.

**Related:** [valid time](#/glossary/valid-time), [bag semantics](#/glossary/bag-semantics), [list semantics](#/glossary/list-semantics)


<a id="cohens-kappa"></a>

## Cohen's kappa

A score for how often two raters (two people, or a metric and a human expert) give an item the same label, corrected for the agreement they would reach by chance given how often each uses each label: κ = (p_o − p_e) / (1 − p_e), where p_o is the share of items they agree on and p_e the agreement expected by chance. κ = 1 means perfect agreement, 0 means chance level, and it is negative when they agree less often than chance.

Example (our arithmetic, from the formula): two raters agree on 90 of 100 items. If each says "correct" half the time, p_e = 0.5 and κ = 0.8; if each says "correct" 90% of the time, p_e = 0.82 and κ ≈ 0.44. The same raw agreement gives a lower κ when one label dominates.

[ROSE](#/papers/pei2026rose "ROSE: An Intent-Centered Evaluation Metric for NL2SQL (2026)") makes κ its primary measure for comparing text-to-SQL metrics with expert labels and describes it as "robust under skewed distributions" (§5.1.2). That claim has not been checked here against a source on κ itself; read it beside the example above, where κ falls as one label comes to dominate.

**Learn more:** [ROSE](#/papers/pei2026rose "ROSE: An Intent-Centered Evaluation Metric for NL2SQL (2026)") ([PDF p. 12](https://arxiv.org/pdf/2604.12988#page=12)) App. D (PDF p. 12), for the formula with p_e computed from each rater's label frequencies; §5.1.2 (PDF p. 4). Cohen's original paper, which it cites, is not listed here.

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [McNemar's exact test](#/glossary/mcnemars-exact-test)


<a id="cold-start"></a>

## Cold start

In LLM training, a small set of curated examples used to fine-tune a model before reinforcement learning, so that RL starts from a model that already answers in the wanted form instead of from the raw pretrained model. (In recommender systems the term means something unrelated: a new user or item with no history.)

Example: DeepSeek-R1-Zero "relies exclusively on reinforcement learning without supervised fine-tuning" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") §2). For DeepSeek-R1, to fix R1-Zero's "poor readability, and language mixing", the authors first "collect thousands of cold-start data that exhibits a conversational, human-aligned thinking process" (§3): "a small amount of long CoT data to fine-tune the model as the initial RL actor" (App. B.3.2). DeepSeek-Prover-V2 makes its cold-start data synthetically: DeepSeek-V3 splits a theorem into subgoals, a smaller prover proves them, and the combined proof is paired with V3's chain of thought ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") §1, §2.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 2](https://arxiv.org/pdf/2501.12948#page=2)) §2 (PDF p. 2), §3 (PDF p. 6) and App. B.3.2 (PDF p. 20); [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.21801#page=2)) §1 (PDF p. 2) and §2.2 (PDF p. 5).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [distillation](#/glossary/distillation), [rejection sampling](#/glossary/rejection-sampling), [curriculum learning](#/glossary/curriculum-learning)


<a id="combined-semantics"></a>

## Combined semantics

A semantics for queries that mix set and bag behaviour, as real SQL does: a `DISTINCT` block or an `EXISTS` subquery ignores duplicates, while a plain `SELECT` keeps them. Each variable of the query is declared a set variable (different values don't add copies of an answer) or a multiset variable (they do).

Example ([Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") Example 1): `SELECT DISTINCT name FROM Customer WHERE type='vip'` returns each name once, while `SELECT name FROM (SELECT DISTINCT cid, name FROM Customer WHERE type='vip') D` returns each name once per distinct customer with that name.

**Learn more:** [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") Def. 2.3 (§2.2, PDF p. 3), which introduces it; [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 2](https://arxiv.org/pdf/2609.09978#page=2)) §1–2 (PDF pp. 2–4), which assumes stored tables are sets; [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") (abstract) extends it to stored tables with duplicates.

**Related:** [set semantics](#/glossary/set-semantics), [bag-set semantics](#/glossary/bag-set-semantics), [small counterexample property](#/glossary/small-counterexample-property)


<a id="common-table-expression-cte"></a>

## Common table expression (CTE)

A named subquery defined in a `WITH` clause at the start of a query and then used like a table in the rest of it. It makes a query easier to read and lets a repeated computation be written once. Whether the engine computes it once and stores the result (materializes it) or substitutes its definition wherever it is used (inlines it) depends on the engine, its version and how the CTE is used.

Example: `WITH totals AS (SELECT cust, SUM(amount) AS s FROM sales GROUP BY cust) SELECT cust FROM totals WHERE s > (SELECT AVG(s) FROM totals)` writes the per-customer totals once and uses them twice. LaSER's case study rewrites a query that repeats an aggregation this way: the model "extracts the repeated logic into a CTE, which is computed once and then reused" ([LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §6.8).

So QUITE's "By default, PostgreSQL materializes CTEs" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §6.1) holds only for CTEs referenced more than once, recursive CTEs and CTEs with side effects.

**Learn more:** [GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)") ([PDF p. 3](https://arxiv.org/pdf/2403.09060#page=3)) §2.1 (PDF p. 3), whose TPC-DS Q11 example starts from a CTE; [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") ([PDF p. 8](https://arxiv.org/pdf/2506.07675#page=8)) §6.1 and Tab. 3 (PDF p. 8), which adds a NOT_MATERIALIZE [query hint](#/glossary/query-hint) that forces inlining; [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") ([PDF p. 12](https://arxiv.org/pdf/2604.06804#page=12)) §6.8 (PDF p. 12). These papers use the term without defining it (general definition).

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [correlated subquery](#/glossary/correlated-subquery), [query hint](#/glossary/query-hint)


<a id="compute-matched-comparison"></a>

## Compute-matched comparison

Comparing two methods at equal compute or cost rather than one call each. A method that spends extra tokens (a self-critique round, say) is compared with a baseline given the same budget, such as more samples with a majority vote. Without the matching, a method can look better only because it uses more compute.

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §1, a "FLOPs-matched comparison" of a smaller model with extra test-time compute against a larger model; [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") §4.5 and Tab. 2, whose cost-matched difference compares each method with the baseline at the method's mean cost.

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="concolic-testing"></a>

## Concolic testing

Testing that runs a program on concrete inputs while also recording, as formulas, the conditions of the branches it takes; a solver then negates one of those conditions to find new concrete inputs that take a different path (general definition). The name joins "concrete" and "symbolic". [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") reports that its search-space refinement speeds up the concolic test engine CATG on pairs of SQL queries that the authors translated by hand into Java programs (§6.3).

**Learn more:** [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") §6.3 (PDF p. 18) and §7 (PDF p. 21), which use the term without defining it (general definition).

**Related:** [symbolic execution](#/glossary/symbolic-execution), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [branch and path coverage](#/glossary/branch-and-path-coverage), [fuzzing](#/glossary/fuzzing)


<a id="concrete-syntax-tree-cst"></a>

## Concrete syntax tree (CST)

The full parse tree of a program's text under its grammar, keeping every token, keywords and punctuation included, which an [abstract syntax tree](#/glossary/abstract-syntax-tree-ast) drops or folds into its nodes. Round-trip correctness picks the code that a model must describe and then re-implement as runs of statements, where "each statement corresponds to a node on the concrete syntax tree (CST) of the code" ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.2).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.2, which uses the term without defining it (general definition).

**Related:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form)


<a id="conjunctive-query"></a>

## Conjunctive query

A query built only from joins, equality conditions and projection: in SQL, `SELECT … FROM … WHERE` with `AND`ed equalities, and no `OR`, `NOT`, aggregates or subqueries. In logic it reads "the output values for which there exist values of the other variables that make all these facts true". Many papers extend the class with comparisons such as `<` and `≤` between variables and constants (e.g. [On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)"), "conjunctive queries containing inequalities"); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") §5 treats such comparisons.

Example ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2): "departments that sell pens and pencils" is `(x). Sales(x, pen) ∧ Sales(x, pencil)`, or in SQL `SELECT s1.dept FROM Sales s1, Sales s2 WHERE s1.dept = s2.dept AND s1.item = 'pen' AND s2.item = 'pencil'`.

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2), which defines it under set semantics; [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §3.1 (PDF p. 3), for the SQL form and its bag semantics.

**Related:** [union of conjunctive queries](#/glossary/union-of-conjunctive-queries), [homomorphism](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment)


<a id="constrained-decoding"></a>

## Constrained decoding

Generating text while allowing, at each step, only the tokens that keep the output valid under a grammar or format, so that the result is guaranteed to parse (as SQL or JSON, say). [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §4.3.1 describes it as decoding that "allows only outputs following some fixed grammar" (it writes "constraint decoding"), and names its costs for SQL: the full grammar over arbitrary schemas is hard to capture, and checking it while decoding adds latency.

**Learn more:** [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §4.3.1.

**Related:** [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling)


<a id="constraint-satisfaction-problem"></a>

## Constraint satisfaction problem

A problem stated as variables, the values each may take, and constraints that the values must satisfy together; a solution gives every variable a value that meets all the constraints (general definition). Constraint solvers search for such solutions. EvoSQL's authors describe earlier SQL test-data generators that "transform the test data generation problem into a constraint satisfaction problem" and solve it with tools such as Alloy and Choco. They report that, because of "limitations of the existing constraint solver tools", these approaches commonly do not support strings, and that "mapping the entire SQL language to a constraint satisfaction problem is a highly complex task", so joins and subqueries are often unsupported too; EvoSQL uses search instead ([EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §1).

**Learn more:** [EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §1 (PDF p. 1), which cites Tsang's textbook (not listed here) without defining the term (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [branch distance](#/glossary/branch-distance), [symmetry breaking](#/glossary/symmetry-breaking)


<a id="contrastive-learning"></a>

## Contrastive learning

Training an encoder so that matching pairs (a query and a useful example for it, two forms of the same item) get similar vectors and non-matching pairs get dissimilar ones. Hard negatives are non-matching items that the current encoder already places close: CrackSQL selects samples that "have different functionality" from an SQL syntax element "but … possess embeddings similar to" it, so that its encoder learns to tell them apart ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") §5.2.2, PDF p. 13). LLM-R² trains a query encoder this way to choose demonstrations for its rewriting prompts ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §5.1).

**Learn more:** [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") ([PDF p. 13](https://arxiv.org/pdf/2504.00882#page=13)) §5.2.2 (PDF p. 13); [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §5.1, with its loss. Neither defines the general term (general definition).

**Related:** [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="coordinate-ascent"></a>

## Coordinate ascent

Improving a function of several variables by changing one variable (or one block of them) at a time while the rest stay fixed, cycling through them. It stops where no single-variable change helps, which need not be the best point overall. OPTIMAS argues that its component-by-component updates of a multi-component LLM system amount to "coordinate maximization", so convergence results for that method apply, and notes that such round-robin updates "do not guarantee global optimality" ([Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §4.4).

**Learn more:** [Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §4.4 and App. B (proof of its convergence theorem).

**Related:** [hill climbing](#/glossary/hill-climbing), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="correlated-subquery"></a>

## Correlated subquery

A subquery that refers to a column of the outer query, so that conceptually it runs again for every outer row. Optimizers rewrite such queries into joins ("decorrelation" or "unnesting").

Example ([Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1): in `SELECT s.name, e.course FROM students s, exams e WHERE s.id = e.sid AND e.grade = (SELECT min(e2.grade) FROM exams e2 WHERE s.id = e2.sid)`, the inner query uses `s.id` from the outer one. The paper's rewrite computes each student's best grade once with `GROUP BY` and joins it in. Such rewrites have gone wrong: a published unnesting algorithm returned wrong answers for subqueries with `COUNT`, the "COUNT bug" ([Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.1, PDF p. 3).

**Learn more:** [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1 (PDF pp. 1–2); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §2.2.2 (PDF p. 3), on how correlated subqueries with aggregates are evaluated.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="cost-based-optimization"></a>

## Cost-based optimization

Choosing a query's execution plan by generating many equivalent alternatives (join orders, where to apply filters, which algorithm for each step) and keeping the one with the lowest [optimizer cost estimate](#/glossary/optimizer-cost-estimate). Heuristic rewriting instead applies rules that are expected to help, without comparing costs. In many systems the two run as separate phases, rewriting first: ReSequel's authors describe rule-based rewrites "applied heuristically before the cost-based optimization of join orders and physical operators" ([ReSequel](#/papers/fathollahzadeh2026resequel "ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling (2026)") §1), and Starburst's Query Rewrite runs "to precede plan optimization" ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §1). Volcano/Cascades optimizers mix the two (see [query optimizer](#/glossary/query-optimizer)); ReSequel's authors describe Cascades as "intertwining rewrite application with cost-based join enumeration" (§8).

Example: for a join of tables A, B and C, the optimizer might compare (A ⋈ B) ⋈ C using hash joins against (B ⋈ C) ⋈ A using an index lookup, estimate each from [cardinality estimates](#/glossary/cardinality-estimation), and run the cheaper one.

Gotcha: the choice is only as good as the estimates. QUITE forces the plans its agents chose with [query hints](#/glossary/query-hint), "avoiding unintended modifications by the query optimizer due to inaccurate cost estimations" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §1).

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.1 (PDF p. 2), whose optimizers use "transformations within the logical algebra and cost-based mapping of logical operators to algorithms"; [ReSequel](#/papers/fathollahzadeh2026resequel "ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling (2026)") ([PDF p. 1](https://arxiv.org/pdf/2606.20853#page=1)) §1 (PDF p. 1) and §2.1 (PDF p. 2); [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 4](https://arxiv.org/pdf/2201.01441#page=4)) §3.1 (PDF p. 4), for a minimal cost model. Selinger et al.'s System R paper, which Balsa cites, is not listed here.

**Related:** [query optimizer](#/glossary/query-optimizer), [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [cardinality estimation](#/glossary/cardinality-estimation), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [phase ordering](#/glossary/phase-ordering)


<a id="counterexample-database"></a>

## Counterexample database

A concrete database on which two queries return different results. It refutes equivalence, and it can be checked by running both queries on it, provided each query has one stable answer there and the engine follows the semantics being checked (see [nondeterministic query](#/glossary/nondeterministic-query)). Logos argues that one concrete run can't certify non-equivalence for order-sensitive queries, and accepts it only through a countermodel checked against its full formal semantics ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §4). It counts only if it satisfies the schema's [integrity constraints](#/glossary/integrity-constraint) ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §1, PDF p. 2). Papers also call it a "differentiating database" ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)")); Logos's "countermodel" is such a database together with a machine-checked proof that the queries differ on it ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1, §4).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 2](https://arxiv.org/pdf/2403.03193#page=2)) §1 (PDF pp. 2–3); [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF p. 2). Smallest ones: [Minimal counterexamples](#/challenges/minimal_counterexamples).

**Related:** [certificate](#/glossary/certificate), [spurious counterexample](#/glossary/spurious-counterexample), [bounded verification](#/glossary/bounded-verification), [nondeterministic query](#/glossary/nondeterministic-query), [proof assistant](#/glossary/proof-assistant), [mutation testing](#/glossary/mutation-testing), [data provenance](#/glossary/data-provenance)


<a id="counterexample-guided-inductive-synthesis-cegis"></a>

## Counterexample-guided inductive synthesis (CEGIS)

A loop between a synthesizer and a checker. The synthesizer proposes a candidate that is correct on every counterexample found so far; the checker either accepts it or returns a new counterexample, which joins the set. The loop ends when the checker accepts.

**Learn more:** [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §1 (PDF p. 2) and §4.1 (PDF p. 5), which uses it to search for faster SQL queries equivalent to a given one.

**Related:** [program synthesis](#/glossary/program-synthesis), [counterexample database](#/glossary/counterexample-database), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [spurious counterexample](#/glossary/spurious-counterexample)


<a id="credit-assignment-problem"></a>

## Credit assignment problem

Working out which of an agent's earlier actions caused a later success or failure, when the feedback comes only at the end. [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §1 says useful verbal reflections require solving it, citing Sutton and Barto.

**Learn more:** [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §1; nothing on this site treats it in depth.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward shaping](#/glossary/reward-shaping)


<a id="curriculum-learning"></a>

## Curriculum learning

Training on tasks in a planned order, usually from easy to hard, so that the model gets a learning signal early and moves on to harder tasks once it handles the easier ones. The RL papers here use two forms: choosing or generating tasks by difficulty, and switching on harder reward targets in stages.

Examples: DeepSeek-Prover-V2 turns the subgoals of hard theorems into easier lemma statements and adds them to its training rounds, "progressively increasing the difficulty of training tasks" ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") §1, §2.1). E3-Rewrite trains first with only its executability and equivalence rewards and adds its performance reward once the model "consistently satisfies correctness constraints" ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") § "Reinforcement Learning for SQL Rewriting", not latency). SPA's PGARS "functions as a query-level curriculum": a reward for a higher milestone (syntax validity, semantic equivalence, plan divergence, runtime speedup, in that order) "is unlocked only when the rollout group exhibits consistent success in all preceding milestones" ([SPA](#/papers/huang2026spa "SPA: A SQL-Plan-Aware Reinforcement Learning Framework for Query Rewriting with LLMs (2026)") §3.5), a form of [reward shaping](#/glossary/reward-shaping).

**Learn more:** [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.21801#page=2)) §1 (PDF p. 2) and §2.1 (PDF p. 4); [E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") ([PDF p. 4](https://arxiv.org/pdf/2508.09023#page=4)) § "Reinforcement Learning for SQL Rewriting" (PDF pp. 4–5); [SPA](#/papers/huang2026spa "SPA: A SQL-Plan-Aware Reinforcement Learning Framework for Query Rewriting with LLMs (2026)") ([PDF p. 6](https://arxiv.org/pdf/2606.08620#page=6)) §3.5 (PDF p. 6). Bengio et al. (2009), which E3-Rewrite cites for the idea, is not listed here.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [reward shaping](#/glossary/reward-shaping), [expert iteration](#/glossary/expert-iteration), [cold start](#/glossary/cold-start), [self-play](#/glossary/self-play)


<a id="letter-d"></a>

<a id="data-contamination"></a>

## Data contamination

Test items, or close copies of them, that appear in a model's training data, so that a benchmark score can reflect memory rather than ability. Benchmarks guard against it with data released after a model's training cutoff, or refreshed regularly.

**Learn more:** [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") §3, which draws on LiveBench, which "releases new data monthly to avoid contamination", and on LiveCodeBench; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §4.3, whose LeetcodeHardGym takes problems released after the date it gives as GPT-4's pre-training cutoff.


<a id="data-provenance"></a>

## Data provenance

Information kept with each row of a query's result about which input rows produced it, and how. Its simplest form, why-provenance, is the set of input rows that contributed to an output row; [Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §4 treats it as the same thing as lineage (other work separates the two). Green et al.'s provenance polynomials also record how the rows combined: rows used together, as in a join, are multiplied, and alternative ways of deriving the same row, as in a union or projection, are added ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §2–4).

Example ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §4, Fig. 5): with the input rows tagged p, r and s, the output row (f, e) has why-provenance {r, s} but provenance polynomial 2s² + rs, read as: (f, e) "is computed by q in three different ways; two of them use the input tuple s twice; the third uses input tuples r and s".

Use here: provenance shows which input rows matter to a difference between two queries' results. RATest connects finding the smallest [counterexample database](#/glossary/counterexample-database) to data provenance ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §1). [data-aware NL2SQL candidate selection](#/papers/kikot2026separating "Data-aware candidate selection in NL2SQL translation via small separating instances (2026)") runs two candidate queries on a database system "with a provenance support" and builds a small separating database from the difference between the rows that contributed to each (§I-h); it defines provenance as "the derivation metadata that track the origin and query-level transformation of relational tables" (§I-d).

**Learn more:** [Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §4 (PDF p. 4, which has entries on §4); [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") ([PDF p. 1](https://arxiv.org/pdf/1904.04467#page=1)) abstract (PDF p. 1) and §1 (PDF p. 2); [data-aware NL2SQL candidate selection](#/papers/kikot2026separating "Data-aware candidate selection in NL2SQL translation via small separating instances (2026)") ([PDF p. 1](https://arxiv.org/pdf/2605.12319#page=1)) §I-d (PDF p. 1), §I-h (PDF p. 2) and §II-b (PDF p. 4).

**Related:** [counterexample database](#/glossary/counterexample-database), [bag semantics](#/glossary/bag-semantics), [small-scope hypothesis](#/glossary/small-scope-hypothesis)


<a id="data-query-and-combined-complexity"></a>

## Data, query and combined complexity

Three ways to measure how hard a database problem is: data complexity lets only the database grow, with the query fixed; query complexity lets only the query grow, with the database fixed; combined complexity lets both grow ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §3, citing Vardi 1982). Because queries are usually "substantially shorter than the entire data base" ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §4, PDF p. 5), "the standard practice is to consider data complexity" ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §7.1), though a problem that is polynomial in data complexity can still blow up as the query grows (same place).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §3 and §7.1 ("SCP vs. SWP"). For a hardness result that counts the database as part of the input, see [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §4 (PDF p. 5); Vardi's paper is not listed here.

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [witness (provenance)](#/glossary/witness-provenance)


<a id="datalog"></a>

## Datalog

A query language of logical rules, each written head ← body. The body is a list of atoms over tables, variables and constants, called the rule's subgoals; the head says what the rule derives for every choice of variable values that makes all the subgoals true (general definition; this "subgoal" is not the proof-assistant one in [tactic](#/glossary/tactic)). A program can be recursive, using what it derives to derive more: `Anc(x, y) ← Parent(x, y)` and `Anc(x, z) ← Parent(x, y), Anc(y, z)` compute all ancestors. Database theory often reasons about SQL through non-recursive rules; [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") writes that equivalence testing "is usually performed over Datalog queries (by first translating SQL into Datalog)" (§1).

Example ([Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") Ex. 1.1 and 2.4, PDF pp. 2 and 5): `SELECT DISTINCT Sal FROM Emp E, WorksIn W, Dept D WHERE E.EName = W.EName AND W.Dno = D.Dno AND D.Loc = 'NY'` becomes `Q1(x) ← Emp(y, x) ∧ WorksIn(y, z) ∧ Dept(z, NY)`: one atom per table in `FROM`, with the join conditions turned into shared variables (§1, PDF p. 3). The paper's syntax also lists which variables count toward duplicates, none here.

Neither defines plain Datalog (general definition).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [union of conjunctive queries](#/glossary/union-of-conjunctive-queries), [combined semantics](#/glossary/combined-semantics), [first-order logic](#/glossary/first-order-logic), [magic sets](#/glossary/magic-sets)


<a id="de-bruijn-index"></a>

## De Bruijn index

Referring to a bound name by a number giving its position instead of by the name, so that renaming can never cause clashes; formal developments use it to avoid reasoning about renaming. [A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") refers to the tables of a FROM clause by "a 0-based de Bruijn index rather than by name; however, attributes are still referenced by name" (§3).

**Learn more:** [A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") ([PDF p. 7](https://arxiv.org/pdf/2003.11331#page=7)) §3 (PDF p. 7), which uses the term without defining it (general definition), and §5.3 (PDF p. 18), where the formalization "rule[s] out name clashes syntactically, thanks to the use of de Bruijn indices".

**Related:** [formal semantics](#/glossary/formal-semantics), [proof assistant](#/glossary/proof-assistant)


<a id="decidable-and-undecidable"></a>

## Decidable and undecidable

A yes/no problem is decidable if some algorithm always stops with the correct answer, and undecidable if no algorithm can. A checker for an undecidable problem must therefore sometimes answer "unknown", run forever, or be wrong.

Examples: Chaudhuri and Vardi state that equivalence of relational queries is undecidable in general ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1, PDF p. 1; [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") § Related work cites Trakhtenbrot 1950 for it), which is why checkers restrict SQL to fragments or bound the database size. Containment of conjunctive queries under set semantics is decidable. Under bag semantics, containment of unions of conjunctive queries is undecidable ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)") Theorem 6.2, PDF p. 30), and so is containment of conjunctive queries with ≠ ([The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)") abstract).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF pp. 1–2); [The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)") §1.

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [soundness and completeness](#/glossary/soundness-and-completeness), [bounded verification](#/glossary/bounded-verification), [first-order logic](#/glossary/first-order-logic)


<a id="delta-debugging"></a>

## Delta debugging

An algorithm that automatically shrinks a failure-inducing input (a long SQL query that crashes a database, say): it repeatedly removes parts and keeps each smaller version that still fails, until removing any further part makes the failure go away. Test-case reduction is the general task; delta debugging (Zeller and Hildebrandt, 2002, not listed here) is the classic method for it.

**Learn more:** [ACME](#/papers/jiang2026acme "ACME: Automated Clause Mapping Engine for Testing Emerging Database Systems (2026)") §5.1 (PDF p. 12), which reduces its bug-triggering queries with it; [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §6.2, test-case reduction of SQL queries as a query-rewriting use case.

**Related:** [fuzzing](#/glossary/fuzzing), [differential testing](#/glossary/differential-testing)


<a id="dense-domain"></a>

## Dense domain

An ordered set of values in which another value always lies strictly between any two different ones, such as the rational numbers; the integers are not dense (general definition). It matters for queries with comparisons: `1 < X < Y < 3` has a solution over the rationals but not over the integers, so whether such a query can be satisfied, or is contained in another, can depend on the domain ([Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") Remark 4.2).

**Learn more:** [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") Remark 4.2 (PDF p. 10), which assumes a dense domain in its §4 "to simplify the exposition" and says the results extend to the integers; [querying indefinite order data](#/papers/vandermeyden1992indefinite "The complexity of querying indefinite data about linearly ordered domains (1992)") §1 (PDF p. 4), which also considers "the class Q of dense linear orders isomorphic to the rationals".

**Related:** [conjunctive query](#/glossary/conjunctive-query), [query containment](#/glossary/query-containment), [linear and nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic)


<a id="dense-retrieval"></a>

## Dense retrieval

Retrieval by learned vectors rather than shared words: an encoder turns the query and every document into vectors, and the documents whose vectors are most similar to the query's (for example by cosine similarity) are returned. Sparse retrieval such as [BM25](#/glossary/bm25) or [TF-IDF](#/glossary/tf-idf) scores shared words instead; Rango's authors put the difference as retrieving "based on word counts" versus "based on vector embeddings derived from a neural network" ([Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)") §V-D). DPR (Dense Passage Retriever) is one such method; LeanDojo builds its premise retriever on it, training with a contrastive loss so that each proof state's correct premise scores above the other ("in-batch negative") premises in the training batch ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") §5). Dense is not always better: Rango's authors report that BM25 proved 46% more theorems than CodeBERT embeddings when retrieving proofs (§V-D).

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 7](https://arxiv.org/pdf/2306.15626#page=7)) §5 (PDF pp. 7–8); [Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)") ([PDF p. 8](https://arxiv.org/pdf/2412.14063#page=8)) §V-D (PDF p. 8). DPR's paper is not listed here.

**Related:** [BM25](#/glossary/bm25), [TF-IDF](#/glossary/tf-idf), [contrastive learning](#/glossary/contrastive-learning), [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [premise selection](#/glossary/premise-selection)


<a id="differential-evolution"></a>

## Differential evolution

An [evolutionary search](#/glossary/evolutionary-search) method for vectors of numbers. For each member x of the population it builds a mutant y = a + F(b − c) from three randomly chosen members, adding the scaled difference of two of them to the third; it mixes x and y coordinate by coordinate (crossover), and the result replaces x only if it scores better ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)") §3.3). A variant uses the current best member as a. EvoPrompt imitates these steps on text with an LLM: it finds the parts in which two prompts differ, mutates only those parts, and combines them with the current best prompt (§3.3).

**Learn more:** [EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)") ([PDF p. 6](https://arxiv.org/pdf/2309.08532#page=6)) §3.3 (PDF p. 6), citing Storn and Price 1997 (not listed here).

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm), [exploration and exploitation](#/glossary/exploration-and-exploitation)


<a id="differential-testing"></a>

## Differential testing

Testing by running the same input on several implementations that should behave alike (different database engines, or two versions of one engine) and comparing their outputs: a disagreement points to a bug in at least one of them, and nobody needs to know the correct answer. It works only for inputs that all the implementations are meant to handle the same way.

Example: RAGS generated random SQL statements and ran each one on several vendors' database systems, comparing the number of rows returned and a checksum of the results; its author notes that the comparison "only works for SQL statements that will execute on more than one vendor's database" ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2).

It differs from [metamorphic testing](#/glossary/metamorphic-testing), which runs two related inputs on one implementation.

**Learn more:** [Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2 (PDF pp. 1–2); [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §VII (PDF p. 11), which describes it as "executing the same test case in different implementations to verify if they yield matching results" and explains why it suits query rewriters poorly. The earlier work [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") cites for it (McKeeman; Evans and Savoia) is not listed here.

**Related:** [test oracle](#/glossary/test-oracle), [metamorphic testing](#/glossary/metamorphic-testing), [fuzzing](#/glossary/fuzzing)


<a id="direct-preference-optimization-dpo"></a>

## Direct preference optimization (DPO)

A way to fine-tune a model's weights on pairs of answers, one preferred and one rejected, so that the model makes the preferred answer more likely relative to a frozen reference copy of itself. Unlike RLHF with [PPO](#/glossary/ppo), it needs no separately trained reward model.

**Learn more:** [SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)") §3.2 and App. A.2, which contrast their self-play fine-tuning loss with DPO's; [ExSPIN](#/papers/yan2025exspin "ExSPIN: Explicit Feedback-Based Self-Play Fine-Tuning for Text-to-SQL Parsing (2025)") §2.1 (PDF p. 4) mentions it. DPO's original paper is not listed here.

**Related:** [PPO](#/glossary/ppo), [KL penalty](#/glossary/kl-penalty), [self-play](#/glossary/self-play), [reinforcement learning](#/glossary/reinforcement-learning)


<a id="disjunctive-normal-form-dnf"></a>

## Disjunctive normal form (DNF)

A formula written as an OR of clauses, each an AND of simple conditions or their negations, such as `(a ∧ ¬b) ∨ c`. Every propositional formula can be rewritten into it, though the result can be exponentially longer. SQLSolver converts query predicates into DNF before reasoning about them ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.2), and [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") puts its tableau expressions into a "disjunctive" normal form, a union of elementary differences (§6, PDF p. 12).

**Learn more:** [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.2 (PDF p. 13), which uses the term without defining it (general definition).

**Related:** [3-SAT](#/glossary/3-sat), [first-order logic](#/glossary/first-order-logic), [satisfiable and valid](#/glossary/satisfiable-and-valid)


<a id="distillation"></a>

## Distillation

Training a smaller or cheaper model (the student) to imitate a stronger one (the teacher). In the LLM papers here it means supervised fine-tuning of the student on outputs the teacher generated, such as reasoning traces with their answers.

Example: the DeepSeek-R1 authors fine-tune Qwen and Llama models on a curated set of 800,000 samples, with supervised fine-tuning only and no RL stage ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") App. F).

Other senses: the word also names compressing data rather than a model. Test-suite accuracy "distills a small test suite of databases that achieves high code coverage for the gold query from a large number of randomly generated databases" ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") abstract), and CASD has a coding agent turn a corpus of agent runs into an improved system prompt in a "Distillation into compact models pass" ([Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") §3.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 60](https://arxiv.org/pdf/2501.12948#page=60)) App. F (PDF p. 60); [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") ([PDF p. 1](https://arxiv.org/pdf/2010.02840#page=1)) abstract (PDF p. 1); [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.26261#page=3)) §3.2 (PDF p. 3).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [rejection sampling](#/glossary/rejection-sampling), [expert iteration](#/glossary/expert-iteration), [cold start](#/glossary/cold-start)


<a id="letter-e"></a>

<a id="elo-rating"></a>

## Elo rating

A rating for players (here, candidate agents) from pairwise results. Each comparison moves both ratings toward what happened: the winner gains, the loser loses, by a step K times the gap between the actual result and the result the rating difference predicted. New players can join at any time and be compared fairly with old ones.

**Learn more:** [RoboPhD](#/papers/borthwick2026robophd "RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution (2026)") §3.2.5 and Alg. 1, which ranks evolved text-to-SQL agents this way with K = 32. The original (Elo, 1978) is not listed here.

**Related:** [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb)


<a id="empirical-risk-minimization-erm"></a>

## Empirical risk minimization (ERM)

Choosing the candidate (a model, a prompt) that scores best on the available sample of examples, as a stand-in for the one that would score best on the unknown distribution those examples come from. The winner's score on the sample tends to overstate its true score, the more so when many candidates are compared on few examples (see [multiple testing](#/glossary/multiple-testing)). SAMMO frames prompt optimization this way, using "a sampled score in the spirit of empirical risk minimization (ERM)" ([SAMMO](#/papers/schnabel2024sammo "Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization (2024)") §3, Eq. 3).

**Learn more:** [SAMMO](#/papers/schnabel2024sammo "Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization (2024)") §3 (general definition; the paper uses the term without defining it).

**Related:** [multiple testing](#/glossary/multiple-testing), [bootstrap resampling](#/glossary/bootstrap-resampling)


<a id="equisatisfiable"></a>

## Equisatisfiable

Two formulas are equisatisfiable if both are satisfiable or neither is. They need not be equivalent (they may even use different variables), but a solver can decide one by deciding the other, which is how solvers translate formulas into forms they handle. SQLSolver relies on a theorem that every LIA* formula has an equisatisfiable [linear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic) formula ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1, Thm. 4.1).

**Learn more:** [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §3 (PDF p. 8), which defines it: "Two formulas are equisatisfiable iff one formula is satisfiable whenever the other one is also satisfiable, and vice versa"; §4.1, Thm. 4.1 (PDF p. 10).

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [linear and nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic)


<a id="equivalence-test-tost"></a>

## Equivalence test (TOST)

A test that shows two results are the same within a chosen margin, instead of failing to show they differ. It runs two one-sided tests (TOST): one that the difference is above −margin and one that it is below +margin; passing both supports equivalence. A plain significance test that finds "no difference" does not show this, since a small or noisy sample can miss a real one.

**Learn more:** [Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)") § "Experimental Setup" ("equivalence tests (two one-sided tests, TOST) at ±7.5 points") and § "Final Task Reward…".

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing)


<a id="estimation-of-distribution-algorithm-eda"></a>

## Estimation of distribution algorithm (EDA)

An evolutionary method that, instead of mutating and crossing individual candidates, fits a probability model to the best candidates so far and samples new candidates from it. Promptbreeder defines it as "An optimization algorithm that iteratively refines a probabilistic model of promising solutions, often using the whole population as a guide" (App. A), and imitates it by showing an LLM a list of current prompts and asking it to continue the list (§3.2.2).

**Learn more:** [Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)") ([PDF p. 17](https://arxiv.org/pdf/2309.16797#page=17)) App. A (PDF p. 17) and §3.2.2.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm)


<a id="evolutionary-search"></a>

## Evolutionary search

Gradient-free search that keeps a population of candidates (prompts, programs), scores each one (its fitness), and makes new candidates by mutating or combining the best ones. In LLM work an LLM usually writes the mutations, and scoring candidates on examples is often most of the cost.

**Learn more:** [Optimize Cheap](#/papers/oved2026crosstier "Optimize Cheap, Deploy Strong: Cost-Aware Cross-Tier Transfer for Evolutionary Optimization (2026)") (abstract), which says evolutionary optimization of prompts and agent programs is "dominated by fitness evaluation"; [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") (abstract), an evolutionary coding agent.

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [Pareto front](#/glossary/pareto-front)


<a id="exact-match"></a>

## Exact match

A score that counts an answer as right only if it equals the gold answer, usually after light normalization or answer extraction. In text-to-SQL it means the predicted query equals the gold query as text; Spider's exact set match compares the two clause by clause, ignoring the order of columns and predicates. Neither checks meaning, so an equivalent query written differently fails.

**Learn more:** [FAPO](#/papers/kassianik2026fapo "FAPO: Fully Automated Prompt Optimization of Multi-Step LLM Pipelines (2026)") §4.1 (EM on HotpotQA); [LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)") §1 ("exact SQL string match"); [Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)") §1 and §4, for exact set match.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [gold query](#/glossary/gold-query), [query equivalence](#/glossary/query-equivalence)


<a id="execution-accuracy"></a>

## Execution accuracy

The usual text-to-SQL score: the share of questions for which the system's query, run on the benchmark's database, returns the same result as the [gold query](#/glossary/gold-query). What "the same" means is the benchmark's choice: BIRD compares results as sets, ignoring row order and duplicates ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") App. B.7, PDF p. 24).

A match on one database doesn't make the queries equivalent: a wrong query can return the right rows there by chance (a false positive). Test-suite accuracy runs both queries on several generated databases to catch more of these ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §1, PDF p. 1), and SpotIt searches for a database that tells them apart ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §2).

**Learn more:** [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 6](https://arxiv.org/pdf/2305.03111#page=6)) §5 (PDF p. 6) for the definition; [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §1; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF p. 2), Eq. 1.

**Related:** [text-to-SQL](#/glossary/text-to-sql), [gold query](#/glossary/gold-query), [query equivalence](#/glossary/query-equivalence), [counterexample database](#/glossary/counterexample-database)


<a id="expert-iteration"></a>

## Expert iteration

A training loop that alternates two steps: use the current model plus extra effort (search, many samples, a checker) to produce outputs better than the model gives alone, then fine-tune the model on those outputs; repeat with the improved model. [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") describes it as a meta-algorithm alternating "policy improvement", in which "we combine a base policy with a search procedure to produce samples from a so-called expert policy", and "Distillation into compact models", in which "we perform supervised learning on these expert samples" (§2.6).

Example: in theorem proving the extra effort is sampling many proofs and keeping those the proof checker accepts. DeepSeek-Prover-V2's current best prover attempts the problems still unsolved, the attempts that Lean verifies join the fine-tuning data, and the next model is trained on it ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") §2.3); its authors call this "a widely adopted framework for developing formal theorem provers", citing Polu and Sutskever (2020, not listed here). When the checker is the only improvement, the loop is iterated [rejection sampling](#/glossary/rejection-sampling) fine-tuning: PSV describes its iterative RFT baseline as performing "expert iteration without proposing new problems" ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") §4).

Sense difference: in uesato2022process's description the expert is the policy combined with a search procedure, not just a filter. Balsa's authors say their own loop, a learned value network guiding plan search, "can be thought of as either value iteration or expert iteration" ([Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") §4.1).

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 5](https://arxiv.org/pdf/2211.14275#page=5)) §2.6 (PDF p. 5); [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 6](https://arxiv.org/pdf/2504.21801#page=6)) §2.3 (PDF p. 6); [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 3](https://arxiv.org/pdf/2512.18160#page=3)) §3.1 (PDF pp. 3–4) and §4 (PDF p. 5); [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 5](https://arxiv.org/pdf/2201.01441#page=5)) §4.1 (PDF p. 5). Anthony et al. (2017), which uesato2022process and Balsa cite for it, is not listed here.

**Related:** [rejection sampling](#/glossary/rejection-sampling), [distillation](#/glossary/distillation), [self-play](#/glossary/self-play), [reinforcement learning](#/glossary/reinforcement-learning), [curriculum learning](#/glossary/curriculum-learning), [autoformalization](#/glossary/autoformalization)


<a id="exploration-and-exploitation"></a>

## Exploration and exploitation

The trade-off a search or learning method faces between trying new options that might turn out better (exploration) and refining the options already known to be good (exploitation). Too little exploration gets stuck on the first good option; too little exploitation never improves on it. OPRO's authors: the optimizer LLM "should be able to exploit promising areas of the search space where good solutions are already found, while also exploring new regions of the search space so as to not miss potentially better solutions" ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") §2.1). They balance the two with the sampling [temperature](#/glossary/greedy-decoding-and-temperature-sampling), and report that at temperatures 0.0 and 0.5 the optimizer "often gets stuck at the same instruction for tens of steps" (§5.3).

**Learn more:** [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") ([PDF p. 3](https://arxiv.org/pdf/2309.03409#page=3)) §2.1 (PDF p. 3), §2.3 (PDF p. 4) and §5.3 (PDF p. 18); [EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)") ([PDF p. 2](https://arxiv.org/pdf/2309.08532#page=2)) §1 (PDF p. 2), whose authors claim their evolutionary prompt search "strikes a balance between exploration and exploitation".

**Related:** [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb), [best arm identification](#/glossary/best-arm-identification), [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts), [evolutionary search](#/glossary/evolutionary-search)


<a id="exponential-moving-average-ema"></a>

## Exponential moving average (EMA)

A running average updated as new = α · old + (1 − α) · current value, with α between 0 and 1, so that recent values weigh most and older ones fade away geometrically. C-Evolve smooths each prompt's fitness across iterations this way, α "balancing the weight of historical performance and current performance" ([C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §4.1).

**Learn more:** [C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §4.1.

**Related:** [island model](#/glossary/island-model), [evolutionary search](#/glossary/evolutionary-search)


<a id="expressive-power"></a>

## Expressive power

Which queries a language can express. Two languages have the same expressive power when every query of each has a query in the other that returns the same result on every database. Codd showed that relational algebra and [relational calculus](#/glossary/relational-calculus) have the same expressive power ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.1; [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §5, PDF p. 7), and Guagliardo and Libkin prove that three-valued logic adds none to basic SQL: every query has a two-valued counterpart and every two-valued query a three-valued one (Thm. 2, PDF p. 10).

**Related:** [relational calculus](#/glossary/relational-calculus), [relational algebra](#/glossary/relational-algebra), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic), [first-order logic](#/glossary/first-order-logic)


<a id="extraction-proof-assistants"></a>

## Extraction (proof assistants)

Turning definitions written in a proof assistant into an ordinary program that runs outside it, so that code proved correct inside can be used directly. [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") uses "the Coq extraction mechanism to Ocaml" to produce "a Coq certified semantic analyser for a SQL compiler" (abstract, PDF p. 1).

**Learn more:** [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") abstract (PDF p. 1) and §1 (PDF p. 2), which use the term without defining it (general definition).

**Related:** [proof assistant](#/glossary/proof-assistant), [formal semantics](#/glossary/formal-semantics)


<a id="letter-f"></a>

<a id="f1-score"></a>

## F1 score

The harmonic mean of precision (the share of predicted positives that are right) and recall (the share of actual positives found). With several classes, macro-F1 averages the per-class F1 scores with equal weight, and micro-F1 pools all decisions before computing one F1. Token F1, used for short text answers, compares the answer's words with the gold answer's.

**Learn more:** nothing on this site defines it (general definition). Uses: [ContraPrompt](#/papers/rishav2026contraprompt "ContraPrompt: Contrastive Prompt Optimization via Dyadic Reasoning Trace Analysis (2026)") §5 (token F1), [SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)") App. P (macro-F1), [FLARE](#/papers/sundararaman2026flare "FLARE: Few-shot Learning-based Adaptive Reflective Engine (2026)") (abstract; micro-F1).

**Related:** [AUROC](#/glossary/auroc), [exact match](#/glossary/exact-match)


<a id="federated-query-processing"></a>

## Federated query processing

Answering one query over data held in several separate systems (databases, file stores, streams) by sending parts of the query to each system and combining their results, without first moving the data into one place. Calcite's authors describe their system as able to run as a standalone engine "that federates multiple storage and processing backends", and describe FORWARD as decomposing "federated queries written in SQL++ into subqueries" that it executes "on the underlying databases" ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §2).

**Learn more:** [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §2, which uses the term without defining it (general definition), and §5, which describes how Calcite answers "queries involving tables across multiple backends by pushing down all possible logic to each backend and then performing joins and aggregations on the resulting data".

**Related:** [query optimizer](#/glossary/query-optimizer), [SQL dialect](#/glossary/sql-dialect)


<a id="finite-state-machine"></a>

## Finite-state machine

A system with a finite set of states and a finite set of actions, where each action taken in a state leads to one definite next state. A household-robot task can be modelled this way: "at the counter, holding nothing" plus "take apple" leads to "at the counter, holding the apple".

A finite automaton is such a machine whose actions are the characters of a string: it reads the string one character at a time, moving from state to state, and accepts the string if it ends in an accepting state. XData converts each comparison or LIKE condition on a string value into a regular expression and then an automaton, intersects the automata for one value, and takes "the lexicographically smallest string" that the result accepts, within length bounds, as test data ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") App. B.1).

**Learn more:** [SKILL-DISCO](#/papers/guo2026skilldisco "SKILL-DISCO: Distilling and Compiling Agent Traces into Reusable Procedural Skills (2026)") §2.1, which treats an agent's successful runs as paths through such a machine; [XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") App. B.1, for automata over strings (uses the term; general definition).

**Related:** [LIKE and ILIKE](#/glossary/like-and-ilike)


<a id="first-order-logic"></a>

## First-order logic

The logic of statements about objects and the relations between them (`Emp(x)`, `x = y`, `x > 3`), built with the connectives ∧ (and), ∨ (or), ¬ (not) and → (implies) and the quantifiers ∀ ("for every object") and ∃ ("there is an object"). "First-order" means the quantifiers range over individual objects, not over sets or functions of them. Whether a first-order formula is [valid](#/glossary/satisfiable-and-valid) is undecidable in general, so solvers handle restricted fragments or specific theories.

Example: "every employee works in some department" is `∀x (Emp(x) → ∃y (Dept(y) ∧ WorksIn(x, y)))`.

Why it matters here: [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") cites Codd's theorem that relational algebra and relational calculus ("formulas of first-order logic on database instances") are equivalent in expressive power, and concludes "Thus, the equivalence between two SQL queries is in general undecidable" (§6.1). Checkers translate queries or rewrite rules into first-order formulas for an [SMT solver](#/glossary/sat-and-smt-solvers): WeTune's rule verifier does so ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §5.1, Fig. 6), and SQLSolver describes such "semantics-based" checkers as reducing equivalence "to deciding the satisfiability of a first-order logic formula" ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 11](https://arxiv.org/pdf/1607.04822#page=11)) §6.1 (PDF p. 11); [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §5.1 (PDF p. 6) and Fig. 6 (PDF p. 8); [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1 (PDF p. 2). No paper on this site defines the logic itself (general definition); Codd's paper, cited by [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), is not listed here.

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [decidable and undecidable](#/glossary/decidable-and-undecidable), [conjunctive query](#/glossary/conjunctive-query), [uninterpreted function](#/glossary/uninterpreted-function)


<a id="formal-semantics"></a>

## Formal semantics

A precise mathematical definition of what each program means, here a function from databases to query results, instead of the SQL standard's English text, which is ambiguous and which vendors read differently. A **mechanized** semantics is one written inside a [proof assistant](#/glossary/proof-assistant), so that proofs about it are machine-checked and it can often be run. A formal semantics is a model of SQL, and a proof is only as right as the model; Guagliardo and Libkin validate theirs by comparing its results with real database engines ([A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §4).

**Learn more:** [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §1 (PDF p. 1); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §1 (PDF p. 1), for a mechanized one in Coq; [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF pp. 1–2), for one in Rocq that covers ordering.

**Related:** [proof assistant](#/glossary/proof-assistant), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic), [list semantics](#/glossary/list-semantics)


<a id="formal-specification"></a>

## Formal specification

A precise statement, in a language a verification tool can check, of what a program must do: which inputs are allowed (preconditions) and what must hold of the output for every allowed input (postconditions). A verifier that accepts a program shows only that the program meets the specification; a specification that says too little (in the extreme, a postcondition that is always true) accepts wrong programs.

Example ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. D, in Verus, a verifier for Rust): `max_element(a)` `requires a.len > 0` and `ensures` that every element of `a` is at most the result and that some element equals it.

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 1](https://arxiv.org/pdf/2512.18160#page=1)) §1 (PDF p. 1), which defines specifications as "statements that mathematically describe all possible permitted inputs plus the desired output behavior of a program with respect to those inputs", and App. F (PDF p. 15), on why passing a verifier is sound with respect to the specification while passing tests is not.

**Related:** [loop invariant](#/glossary/loop-invariant), [soundness and completeness](#/glossary/soundness-and-completeness), [test oracle](#/glossary/test-oracle), [formal semantics](#/glossary/formal-semantics)


<a id="forward-chaining"></a>

## Forward chaining

A rule-based reasoning method that starts from known facts and keeps applying every rule whose conditions hold, adding its conclusions as new facts, until nothing new follows (general definition; backward chaining instead starts from a goal and looks for rules that would prove it). Seed-Geometry's engine follows "the forward-chaining design", in which it "derives all known facts by checking applicable rules until closure is reached" ([Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)") §1). Starburst's query rewrite rules are "fired by a forward chaining rule engine" ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.1).

**Learn more:** [Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)") ([PDF p. 2](https://arxiv.org/pdf/2507.23726#page=2)) §1 (PDF p. 2); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 11](https://arxiv.org/pdf/1607.04822#page=11)) §6.1 (PDF p. 11). Neither defines the term (general definition).

**Related:** [production rule (rule engine)](#/glossary/production-rule-rule-engine), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="functional-dependency"></a>

## Functional dependency

A rule that the values in some columns determine the values in others: any two rows that agree on the first columns also agree on the second. For example, a country code determines the country name. A key is the special case where the key columns determine all the other columns. Functional dependencies are a kind of [integrity constraint](#/glossary/integrity-constraint).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") ([PDF p. 2](https://arxiv.org/pdf/1904.04467#page=2)) §2 (PDF p. 2), which lists them among the standard integrity constraints; [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 8](https://arxiv.org/pdf/2609.09978#page=8)) §4 (PDF p. 8), which reads each key as a functional dependency; [SpotIt+](#/papers/tremante2026spotitplus "SpotIt+: Verification-based Text-to-SQL Evaluation with Database Constraints (2026)") ([PDF p. 7](https://arxiv.org/pdf/2603.04334#page=7)) App. A-A(d) (PDF p. 7), which mines them from data by checking that grouping by one column gives one value of the other (the country example: §IV-B, PDF p. 4).

**Related:** [integrity constraint](#/glossary/integrity-constraint), [chase](#/glossary/chase)


<a id="fuzzing"></a>

## Fuzzing

Automated testing that feeds a program large numbers of generated inputs, often random or semi-random, and watches for failures such as crashes. Generation-based fuzzers build inputs from scratch (for SQL, from the language's grammar); mutation-based fuzzers make small changes to existing inputs; coverage-guided fuzzers use which code an input reached to steer the next inputs. To catch wrong answers rather than crashes, a fuzzer also needs a [test oracle](#/glossary/test-oracle).

Example: ARG fuzzes query rewriters, steering query generation toward rewrite rules that its tests have not yet triggered ([ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §I, PDF p. 2).

Mutation-based fuzzing changes the inputs; [mutation testing](#/glossary/mutation-testing) changes the program.

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 10](https://arxiv.org/pdf/2305.01210#page=10)) §4 (PDF p. 10), where fuzz testing "feeds random inputs (e.g., random bytes) to the system under test (SUT), without knowing its source code"; [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §VII (PDF p. 10), for SQL fuzzers of both kinds.

**Related:** [test oracle](#/glossary/test-oracle), [differential testing](#/glossary/differential-testing), [metamorphic testing](#/glossary/metamorphic-testing), [branch and path coverage](#/glossary/branch-and-path-coverage)


<a id="letter-g"></a>

<a id="genetic-algorithm"></a>

## Genetic algorithm

An [evolutionary search](#/glossary/evolutionary-search) method that keeps a population of candidates, chooses parents by fitness, and makes children by mutation and crossover (combining parts of two parents) (general definition). Promptbreeder runs a binary tournament: "we sample two individuals from the population, we take the individual with the higher fitness, mutate it … and overwrite the loser with the mutated copy of the winner" ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)") §3); for crossover it picks the donor by fitness-proportionate (roulette-wheel) selection, in which "an individual is chosen in proportion to its fitness in the population" (§3.2.5, App. A). When a run gets trapped on a local optimum it also applies fitness sharing, which lowers the fitness of candidates similar to others (App. J.2; the gloss is ours, the paper names the method).

**Learn more:** [Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)") ([PDF p. 17](https://arxiv.org/pdf/2309.16797#page=17)) §3, §3.2.5, App. A (PDF p. 17) and App. J.2 (PDF p. 27), which use the term without defining it (general definition). Harvey's microbial genetic algorithm, which it cites for the tournament, is not listed here.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [estimation of distribution algorithm (EDA)](#/glossary/estimation-of-distribution-algorithm-eda), [island model](#/glossary/island-model)


<a id="gold-query"></a>

## Gold query

The human-written reference SQL query for a benchmark question ("gold SQL"); a system's query is scored by comparing its result with the gold query's. Gold queries can be wrong: SpotIt's authors report that when a generated query and the gold query disagreed, it was often the gold query that was incorrect ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §1, PDF p. 2).

**Learn more:** [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 1](https://arxiv.org/pdf/2510.26840#page=1)) §1–2 (PDF pp. 1–2). The challenge in this repo: [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification).

**Related:** [execution accuracy](#/glossary/execution-accuracy), [text-to-SQL](#/glossary/text-to-sql)


<a id="gpu-kernel-and-kernel-fusion"></a>

## GPU kernel and kernel fusion

A GPU kernel is a function that runs on a graphics processor: one launch runs the same code in many parallel threads, each on its own part of the data, usually to perform one operation such as a matrix multiplication or a convolution (general definition). Kernels are written in CUDA or in higher-level languages such as Triton ([TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") §1). Kernel fusion combines several operations into one kernel, so that intermediate results need not be written to GPU memory by one kernel and read back by the next (general definition). KernelBench's Level 2 consists of "100 simple fusion tasks, such as conv+bias+ReLU" ([TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") §3.1); the prompt TritonRL uses to label tasks by level describes Level 2 as "multiple primitive operations, which can be fused into a single kernel for improved performance" (App. G.1).

**Learn more:** [TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") ([PDF p. 3](https://arxiv.org/pdf/2510.17891#page=3)) §2.1.2 (PDF p. 3) and §3.1 (PDF p. 6), which split tasks into single-kernel (Level 1) and fusion (Level 2) tasks, and the labeling prompt in App. G.1 (PDF p. 17); it defines neither term (general definition).

**Related:** [program synthesis](#/glossary/program-synthesis)


<a id="graph-isomorphism"></a>

## Graph isomorphism

Deciding whether two graphs are the same up to renaming their nodes. It is in NP but "not known to be NP-hard" ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1, PDF p. 2), and GI is "the class of problems that are many-one-reducible to the graph isomorphism problem" ([Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") §5.3 fn. 6, PDF p. 22), so a GI-complete problem is as hard as graph isomorphism and no harder. In database theory, isomorphism of conjunctive queries is logspace equivalent to graph isomorphism ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 8, PDF p. 6), and two conjunctive queries are equivalent under [bag semantics](#/glossary/bag-semantics) exactly when they are isomorphic, so bag equivalence has the same complexity ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1, Thm. 5.2).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF p. 2) and §5 (Thm. 5.2, PDF p. 7); [Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") §5.2–5.3 (PDF pp. 21–22), which calls graph isomorphism "a task for which no polynomial time algorithm is known" (§5.2); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 8 (PDF p. 6).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [query equivalence](#/glossary/query-equivalence), [bag semantics](#/glossary/bag-semantics)


<a id="greedy-decoding-and-temperature-sampling"></a>

## Greedy decoding and temperature sampling

Two ways to choose an LLM's next token. Greedy decoding always takes the most likely token, so a prompt always gets the same single answer. Temperature sampling draws the token at random after dividing the model's scores (logits) by a temperature T: below 1 the distribution sharpens towards the greedy choice, above 1 it flattens and outputs vary more (general definition). Self-consistency replaces greedy decoding in chain-of-thought prompting with sampling, to get several different reasoning paths; its authors say greedy decoding suffers from "repetitiveness and local-optimality" ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") §1), and they sample at T = 0.5 or 0.7, for some models restricted to the 40 most likely tokens (§3.1).

**Learn more:** [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") ([PDF p. 4](https://arxiv.org/pdf/2203.11171#page=4)) §3.1 (PDF p. 4) and §2, which use both terms without defining them (general definition); [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") ([PDF p. 4](https://arxiv.org/pdf/2309.03409#page=4)) §2.3 (PDF p. 4), which tunes the temperature to balance [exploration and exploitation](#/glossary/exploration-and-exploitation).

**Related:** [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling), [beam search](#/glossary/beam-search), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="grpo"></a>

## GRPO

Group Relative Policy Optimization, an RL algorithm for LLMs that drops PPO's value model. For each prompt it samples a group of outputs and scores them; each output's reward minus the group's mean, divided by the group's standard deviation, says how strongly to reinforce it (its "advantage"). SQL-Zero notes that because the baseline is the group mean, a reward that is too sparse makes the advantages zero ([SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") §2, PDF p. 2).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 11](https://arxiv.org/pdf/2402.03300#page=11)) §4.1.1–4.1.2 (PDF pp. 11, 14), which introduces it (with a learned reward model); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 2](https://arxiv.org/pdf/2501.12948#page=2)) §2.1–2.2 (PDF pp. 2–4), which uses it with rule-based rewards.

**Related:** [PPO](#/glossary/ppo), [reinforcement learning](#/glossary/reinforcement-learning), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="letter-h"></a>

<a id="halting-problem-and-rices-theorem"></a>

## Halting problem and Rice's theorem

The halting problem asks whether a given program stops on a given input; no algorithm decides it for every program and input. Rice's theorem generalizes this: no algorithm decides any non-trivial property of what programs compute (one that some programs' behaviour has and others' lacks), so, for example, program equivalence is undecidable in general (general definitions; the paper below defines only the halting problem and cites Rice). [Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)") App. I uses both to argue that deciding whether two programs are equivalent is undecidable, "a trivial consequence of Rice's theorem", and that inputs on which they differ "cannot be computed in the general case".

**Learn more:** [Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)") ([PDF p. 19](https://arxiv.org/pdf/2505.03818#page=19)) App. I (PDF pp. 19–21), which defines the halting problem as determining whether A(n) ≠ ⊥ (PDF p. 20) and cites Rice (1953, not listed here); Rice's theorem is a general definition.

**Related:** [decidable and undecidable](#/glossary/decidable-and-undecidable), [query equivalence](#/glossary/query-equivalence)


<a id="hammer-automated-theorem-proving"></a>

## Hammer (automated theorem proving)

A tool that tries to prove a goal in a proof assistant automatically by handing it to external automated theorem provers (ATPs), such as SMT solvers. CoqHammer selects relevant lemmas, translates the goal and the lemmas into first-order logic and calls the provers; if one succeeds, it rebuilds a proof that the proof assistant's kernel checks ([Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §2.2). The same section says CoqHammer does well on equational and set-theoretic goals and on combinations of known facts, and struggles with goals that need induction, deep case analysis or long chains of steps.

**Learn more:** [Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §2.2.

**Related:** [proof assistant](#/glossary/proof-assistant), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [tactic](#/glossary/tactic), [first-order logic](#/glossary/first-order-logic)


<a id="hilberts-tenth-problem"></a>

## Hilbert's tenth problem

The problem of deciding, for any polynomial equation with integer coefficients, whether it has a solution in whole numbers. It is undecidable: no algorithm answers it correctly for every equation (general definition; the proof, by Matiyasevich building on Davis, Putnam and Robinson, is not listed here). All the undecidability results in [bag-semantics](#/glossary/bag-semantics) database theory that [Bag Semantics Conjunctive Query…](#/papers/marcinkowski2025smallsteps "Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability. (2024)") knows of, such as those for [query containment](#/glossary/query-containment), start from it: the database supplies values for the polynomial's variables, query answers count tuples and so compute polynomial values, and "for every database" stands in for "for every value of the variables" (§1.2). [Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)") uses it to show that containment of unions of conjunctive queries is undecidable (§6), and [The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)") for conjunctive queries with ≠ (§1).

**Learn more:** [Bag Semantics Conjunctive Query…](#/papers/marcinkowski2025smallsteps "Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability. (2024)") ([PDF p. 23](https://arxiv.org/pdf/2503.18003#page=23)) Thm. 6 in App. B.1 (PDF p. 23), which states the version it uses (over natural numbers), and §1.2 (PDF p. 4); [The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)") §1 (PDF p. 2); [Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)") §6 (PDF pp. 29–30), via Diophantine equations.

**Related:** [decidable and undecidable](#/glossary/decidable-and-undecidable), [halting problem and Rice's theorem](#/glossary/halting-problem-and-rices-theorem), [query containment](#/glossary/query-containment), [union of conjunctive queries](#/glossary/union-of-conjunctive-queries)


<a id="hill-climbing"></a>

## Hill climbing

Local search that starts from a candidate and keeps moving to the best neighbouring candidate (one small change away) as long as that improves the score, stopping when none does; it can stop at a local optimum. QueryBooster's rule suggester "follows the hill-climbing paradigm", exploring at each iteration a set of candidate rules as possible next directions ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §6.1).

**Learn more:** [QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §6.1, which cites a textbook (Russell and Norvig, not listed here).

**Related:** [coordinate ascent](#/glossary/coordinate-ascent), [evolutionary search](#/glossary/evolutionary-search), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl)


<a id="hoare-triple"></a>

## Hoare triple

A statement {P} S {Q} about a program fragment S: if the precondition P holds before S runs and S finishes, then the postcondition Q holds afterwards (general definition). Example: {x = 1} x := x + 1 {x = 2}. Mediator proves that a formula Φ relating two databases is kept by a pair of corresponding updates U and U′ by checking the triple {Φ ∧ x = y} U; U′ {Φ}, where x and y are the updates' arguments ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §4.1, §6.1).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 10](https://arxiv.org/pdf/1710.07660#page=10)) §4.1 (PDF p. 10) and §6.1 (PDF p. 16), which use triples without defining them (general definition). Hoare's paper is not listed here.

**Related:** [strongest postcondition](#/glossary/strongest-postcondition), [loop invariant](#/glossary/loop-invariant), [formal specification](#/glossary/formal-specification), [bisimulation](#/glossary/bisimulation)


<a id="homomorphism-containment-mapping"></a>

## Homomorphism (containment mapping)

A mapping from the variables of one conjunctive query to the terms of another that keeps constants and output variables fixed and sends every atom of the first query to an atom of the second. Under [set semantics](#/glossary/set-semantics), Q1 is contained in Q2 exactly when there is a homomorphism from Q2 to Q1 (note the reversed direction), and Q1 ≡ Q2 exactly when there are homomorphisms both ways.

Example: `Q1(x) :- Sales(x, pen), Sales(x, pencil)` and `Q2(x) :- Sales(x, pen)`. Sending Q2's only atom to Q1's first atom is a homomorphism from Q2 to Q1, so Q1 is contained in Q2: every department that sells both sells pens.

This test holds only under set semantics. Under bag semantics two conjunctive queries are equivalent only when they are identical up to renaming variables and reordering atoms ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §5, Theorem 5.2). Combined semantics uses a stricter variant, the multiset-homomorphism ([Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") Def. 3.1, PDF p. 4).

Names vary. [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §4.2 calls the variable-to-variable map above a containment mapping. [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") keeps two maps apart, on [tableaux](#/glossary/tableau): a homomorphism sends symbols to symbols (§4.1, PDF p. 10), and a containment mapping sends the rows of one tableau to rows of the other (§4.2, PDF p. 11); each row map induces a homomorphism, so the authors "shall sometimes fail to distinguish" them (PDF p. 11).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §4.2 (PDF p. 5), which states the containment test and credits [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)"); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Lemma 13 (PDF p. 7), for equivalence; [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §4 (PDF pp. 8–9); [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") Theorems 2–3 (PDF p. 11), the two forms of the test for tableaux.

**Related:** [conjunctive query](#/glossary/conjunctive-query), [query containment](#/glossary/query-containment), [bag semantics](#/glossary/bag-semantics), [tableau](#/glossary/tableau), [canonical database](#/glossary/canonical-database)


<a id="hyperparameter-optimization"></a>

## Hyperparameter optimization

Searching over the settings of a learning or prompting pipeline that are fixed before it runs (a learning rate, the number of demonstrations, which instruction to use) to maximize a validation score; methods include grid search, random search and model-based search such as [Bayesian optimization](#/glossary/bayesian-optimization). DSPy notes that once each parameter has a discrete set of candidates, "Many hyperparameter tuning algorithms (e.g., random search or Tree-structured Parzen Estimators …) can be applied for selection among candidates" ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4).

**Learn more:** [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4, which uses the term without defining it (general definition), and §2, which mentions "Bayesian hyperparameter optimization methods".

**Related:** [Bayesian optimization](#/glossary/bayesian-optimization), [black-box optimization](#/glossary/black-box-optimization)


<a id="letter-i"></a>

<a id="imitation-learning"></a>

## Imitation learning

Training an agent to copy an expert's demonstrated actions instead of learning from rewards, most simply by supervised learning on the states the expert saw and the actions it took. ReAct compares its few-shot prompted agent with BUTLER, "an imitation learning agent trained on 10⁵ expert trajectories for each task type" ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)") §4).

**Learn more:** [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)") §4, which uses the term without defining it (general definition).

**Related:** [distillation](#/glossary/distillation), [reinforcement learning](#/glossary/reinforcement-learning)


<a id="importance-ratio-and-clipping"></a>

## Importance ratio and clipping

In PPO-style RL for LLMs, a token's importance ratio is its probability under the model being updated divided by its probability under the model that generated the sample. The objective multiplies each token's advantage by this ratio, but clips the ratio to [1 − ε, 1 + ε] and takes the smaller of the clipped and unclipped terms, so that one batch of samples can't push the model far ([Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") §4, Eq. 1, where ε is the "clipping threshold"). Clip-higher, from DAPO, sets the upper bound above the lower one so that unlikely tokens can gain more probability; ProRL adopts it against [entropy collapse](#/glossary/policy-entropy) ([ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") §2.3).

Gotcha: clipping is not neutral. [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") reports that GRPO's clipping term "can amplify high-prior behaviors learned during pre-training even without informative rewards" (abstract), and that without clipping, random rewards give no training signal (§4).

**Learn more:** [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") ([PDF p. 5](https://arxiv.org/pdf/2506.10947#page=5)) §4, Eq. 1 (PDF p. 5); [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") §2.3, for DAPO's decoupled clipping; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §4.1.1, for PPO and GRPO.

**Related:** [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [policy gradient](#/glossary/policy-gradient), [policy entropy](#/glossary/policy-entropy), [KL penalty](#/glossary/kl-penalty)


<a id="index-database"></a>

## Index (database)

A data structure kept beside a table, often a B-tree or a hash table on one or more columns, that lets the database find the rows matching a condition without scanning the whole table, at the cost of storage and slower writes. Whether a query can use an index can depend on how its condition is written: QueryBooster's example rewrites a `STRPOS(LOWER(content), s)` condition, which PostgreSQL can't answer from an index, into an equivalent `ILIKE` predicate that a trigram index (an index on three-character pieces of the text) can answer, and reports the rewritten query "runs 100 times faster" ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §1). BIRD shows indexes added to speed up queries "without rewriting them" ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") App. B.5, Fig. 10).

**Learn more:** [QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §1 (Fig. 2 and its text); [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 25](https://arxiv.org/pdf/2305.03111#page=25)) App. B.5 (Fig. 10, PDF p. 25). Neither defines the term (general definition).

**Related:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [query optimizer](#/glossary/query-optimizer), [LIKE and ILIKE](#/glossary/like-and-ilike), [cost-based optimization](#/glossary/cost-based-optimization)


<a id="integrity-constraint"></a>

## Integrity constraint

A rule that every legal database of a schema must satisfy. Common kinds: a primary key (no two rows share the key, and key columns are not NULL), a foreign key (each value must appear in a column of the referenced table), NOT NULL, and CHECK (a condition on each row) ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §3.4). Equivalence is then judged only over legal databases: some rewrites are correct only because of a constraint, and a counterexample that breaks a constraint refutes nothing.

Example: `SELECT DISTINCT id FROM Emp` and `SELECT id FROM Emp` return the same rows, duplicates included, only on databases where no `id` repeats, which a key on `id` guarantees.

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 10](https://arxiv.org/pdf/2403.03193#page=10)) §3.4 (PDF p. 10); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.09978#page=3)) §2 (PDF p. 3), for keys and foreign keys in the theory. The challenge in this repo: [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence).

**Related:** [chase](#/glossary/chase), [counterexample database](#/glossary/counterexample-database), [spurious counterexample](#/glossary/spurious-counterexample)


<a id="interquartile-mean-iqm"></a>

## Interquartile mean (IQM)

The mean of the middle half of a set of scores: sort them, drop the lowest and highest quarters, and average the rest. It is less swayed by a few extreme scores than the mean, and uses more of the data than the median. APE reports the IQM over 24 tasks, citing Agarwal et al. (2021, not listed here) ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") §4.1).

**Learn more:** [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") ([PDF p. 6](https://arxiv.org/pdf/2211.01910#page=6)) §4.1 (PDF p. 6), which uses it without defining it (general definition).

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling)


<a id="island-model"></a>

## Island model

An evolutionary algorithm that splits its population into several sub-populations ("islands") that evolve mostly in isolation, with occasional migration of candidates between them, so that the population stays diverse instead of converging on one family of solutions. C-Evolve evolves prompts on islands "mostly in isolation", builds voting groups from one prompt per island ([C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §1), and migrates 10% between islands "to avoid getting stuck in local optima" (§5.3).

**Learn more:** [C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §1, §4.1 and §5.3.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm), [exponential moving average (EMA)](#/glossary/exponential-moving-average-ema)


<a id="letter-j"></a>

<a id="join-algorithms-nested-loop-hash-and-merge-join"></a>

## Join algorithms (nested-loop, hash and merge join)

The main ways a database computes a join: a nested-loop join compares each row of one input with every row of the other; a hash join builds a hash table on one input's join column and looks up each row of the other input in it; a merge join sorts both inputs on the join column and scans them side by side. Nested loops take time proportional to the product of the input sizes and the others roughly to their sum (plus sorting, for a merge join): [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") says that unnesting, "Depending on the query", replaces "an O(n²) algorithm (nested loop join) with an O(n) algorithm (hash join, joining keys)" (§1, PDF p. 3). The optimizer chooses one per join ([cost-based optimization](#/glossary/cost-based-optimization)).

**Learn more:** [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1 (PDF p. 3); [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §3 (PDF p. 2), where System R chooses between nested iteration and merge join, and §7.2 (PDF p. 8), with cost formulas. Neither defines the algorithms (general definition).

**Related:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [correlated subquery](#/glossary/correlated-subquery), [outer join](#/glossary/outer-join)


<a id="letter-k"></a>

<a id="k-induction"></a>

## k-induction

A way to prove that a property holds at every step of a program's run: first check that it holds for the first k steps from a valid start (a failure here is a counterexample), then check that whenever it holds for k steps in a row, it also holds at the next one. If both checks pass, it holds forever; if only the second fails, k is increased or the answer is unknown ([Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") App. A). Unlike [bounded model checking](#/glossary/bounded-verification) it can prove loop invariants, but it is incomplete: "there are properties that are not k-inductive for any k" (same place).

**Learn more:** [Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") ([PDF p. 13](https://arxiv.org/pdf/2310.04870#page=13)) App. A (PDF p. 13), and §5.1, where ESBMC, one of its two verifiers, "is based on k-induction".

**Related:** [loop invariant](#/glossary/loop-invariant), [bounded verification](#/glossary/bounded-verification), [abstract interpretation](#/glossary/abstract-interpretation), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="k-relation-and-semiring-semantics"></a>

## K-relation and semiring semantics

A semiring is a set with an addition and a multiplication that obey the laws of natural-number arithmetic used in queries: both associative and commutative, with identities 0 and 1, multiplication distributing over addition, and 0 × x = 0 ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §3.1, footnote). A K-relation models a table as a function from rows to K that is nonzero for only finitely many rows ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") Def. 3.1); for the usual query identities to hold, K must be a commutative semiring (same paper, Prop. 3.4, PDF p. 3). With K the natural numbers the value is the row's multiplicity ([bag semantics](#/glossary/bag-semantics)) and with K the Booleans whether the row is present ([set semantics](#/glossary/set-semantics)); query operators become arithmetic on these values, union adding them and join multiplying them ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §3), and the same rules give [provenance polynomials](#/glossary/data-provenance).

**Learn more:** [Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)") §3 (PDF p. 3); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §2, which generalizes K-relations; [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §3.1; [QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)") §3.2, which uses semiring semantics.

**Related:** [bag semantics](#/glossary/bag-semantics), [set semantics](#/glossary/set-semantics), [data provenance](#/glossary/data-provenance), [formal semantics](#/glossary/formal-semantics)


<a id="kl-divergence"></a>

## KL divergence

A measure of how different one probability distribution is from another: KL(p ‖ q) is zero when p and q are the same, and grows where q gives little probability to outcomes that p makes likely. It is not symmetric, KL(p ‖ q) and KL(q ‖ p) generally differ, so it is not a true distance (general definition). Uses on this site: the drift penalty in RL training of LLMs ([KL penalty](#/glossary/kl-penalty)); a training loss that makes a model given a compressed prompt produce the same output distribution as with the original prompt ([Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") §4.1.1); and the gap between the [ELBO](#/glossary/variational-inference-and-the-elbo) and the true log-likelihood ([Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") §3.1).

**Learn more:** [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") ([PDF p. 6](https://arxiv.org/pdf/2404.01077#page=6)) §2.3 (PDF p. 6) and §4.1.1 (PDF p. 15); [Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") ([PDF p. 5](https://arxiv.org/pdf/2306.12509#page=5)) §3.1 (PDF p. 5). Neither defines it (general definition).

**Related:** [KL penalty](#/glossary/kl-penalty), [variational inference and the ELBO](#/glossary/variational-inference-and-the-elbo), [distillation](#/glossary/distillation)


<a id="kl-penalty"></a>

## KL penalty

A term in RL training of an LLM that penalizes the trained model for drifting away from a reference model, usually the model training started from. It measures the drift with the [KL divergence](#/glossary/kl-divergence), and a coefficient sets how strongly it pulls back. DeepSeekMath describes it as the standard way to mitigate over-optimizing the reward model; PPO adds it to the reward, and GRPO adds it to the loss instead.

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 13](https://arxiv.org/pdf/2402.03300#page=13)) §4.1.1 (PDF p. 13). [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") ([PDF p. 12](https://arxiv.org/pdf/2609.04697#page=12)) trains with no KL penalty (App. C, PDF p. 12) and names "a KL term against the base model" as one way to counter falling [policy entropy](#/glossary/policy-entropy) (§6, PDF p. 8).

**Related:** [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [reward hacking](#/glossary/reward-hacking)


<a id="letter-l"></a>

<a id="language-integrated-query"></a>

## Language-integrated query

Writing database queries inside a general-purpose programming language, as typed expressions of a sublanguage that is translated into SQL, instead of as SQL strings. [A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") names Kleisli, Links and Microsoft's C# and F# as languages with it, and the nested relational calculus (NRC), a core query language over nested collections, as its theoretical basis: every NRC query from flat tables to flat tables can be normalized to one without nested intermediate data, and "Such flat queries correspond closely to SQL queries" (§1, PDF p. 5).

**Learn more:** [A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") ([PDF p. 5](https://arxiv.org/pdf/2003.11331#page=5)) §1 (PDF p. 5), which cites the NRC papers (not listed here).

**Related:** [relational calculus](#/glossary/relational-calculus), [formal semantics](#/glossary/formal-semantics), [LATERAL](#/glossary/lateral)


<a id="latent-variable"></a>

## Latent variable

A quantity in a probabilistic model that is never observed but helps explain what is observed; using the model means reasoning over its possible values (general definition). Deep Language Networks treat the text that a first LLM call passes to a second as latent: the probability of answer y given input x sums, over every possible intermediate text h, the probability of h given x times the probability of y given h and x ([Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") §3).

**Learn more:** [Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") ([PDF p. 2](https://arxiv.org/pdf/2306.12509#page=2)) §1 (PDF p. 2) and §3 (PDF p. 4), which use the term without defining it (general definition).

**Related:** [variational inference and the ELBO](#/glossary/variational-inference-and-the-elbo)


<a id="lateral"></a>

## LATERAL

An SQL keyword for a subquery in the FROM clause that may refer to columns of the FROM items before it. Ordinary FROM items are evaluated independently, but a LATERAL subquery "needs to be evaluated once for every tuple in the preceding FROM items" ([A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") §1, PDF p. 5), so it acts like a [correlated subquery](#/glossary/correlated-subquery) in the FROM clause (our gloss).

Example: `SELECT d.name, t.name FROM dept d, LATERAL (SELECT e.name FROM emp e WHERE e.dept = d.id ORDER BY e.salary DESC LIMIT 3) t` lists each department's three best-paid employees.

**Learn more:** [A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)") ([PDF p. 5](https://arxiv.org/pdf/2003.11331#page=5)) §1 (PDF p. 5), whose formal semantics covers it.

**Related:** [correlated subquery](#/glossary/correlated-subquery), [formal semantics](#/glossary/formal-semantics)


<a id="lattice"></a>

## Lattice

A partially ordered set in which every pair of elements has a least upper bound (the smallest element above both) and a greatest lower bound (the largest element below both) ([Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") §II-B). Example: the subsets of a set, ordered by inclusion; the bounds of two subsets are their union and their intersection. [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)")'s Query Lattice orders the filter conditions of cached queries by implication, to find a cached query whose result can answer a new one (§III-A).

**Related:** [query containment](#/glossary/query-containment), [monotone aggregate function](#/glossary/monotone-aggregate-function)


<a id="left-deep-and-bushy-plans"></a>

## Left-deep and bushy plans

Shapes of a join plan, a tree of joins that each take two inputs. In a left-deep plan every join's second (inner) input is a single table, so the plan adds one table at a time: ((A ⋈ B) ⋈ C) ⋈ D. A bushy plan may also join two intermediate results: (A ⋈ B) ⋈ (C ⋈ D) (general definition). [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") describes left-deep trees as having "no composite inner" (§5). Allowing bushy plans makes the search space much larger and can admit faster plans: [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") estimates that a commercial engine that does not expose bushy plans as hints has a search space about 1000× smaller than PostgreSQL's for an average-sized JOB query (§8.2).

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §4.2 (PDF p. 7) and §5 (PDF p. 8); [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 4](https://arxiv.org/pdf/2201.01441#page=4)) §3.2 (PDF p. 4), §8.2 (PDF p. 8) and §9 (PDF p. 13). Neither defines the shapes beyond these phrases (general definition).

**Related:** [join algorithms (nested-loop, hash and merge join)](#/glossary/join-algorithms-nested-loop-hash-and-merge-join), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [cost-based optimization](#/glossary/cost-based-optimization), [query hint](#/glossary/query-hint)


<a id="length-bias"></a>

## Length bias

An LLM judge's tendency to rate longer inputs more favourably: "a phenomenon in which longer inputs tend to receive more favorable evaluations" ([Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") §6.2). There, inserting more and more dummy (never-called) functions into code made the LLM evaluators' positive bias stronger, which the authors call "consistent with length bias"; a single dummy function gave no clear direction (§6.2).

**Learn more:** [Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") ([PDF p. 8](https://arxiv.org/pdf/2505.16222#page=8)) §6.2 (PDF p. 8), which cites Wu and Aji (2023) and Koo et al. (2023), not listed here.

**Related:** [positional bias](#/glossary/positional-bias), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="like-and-ilike"></a>

## LIKE and ILIKE

SQL's pattern-matching conditions on strings: `s LIKE 'ab%'` is true when s starts with "ab", where `%` matches any run of characters (including none) and `_` exactly one character (general definition); ILIKE is the "case insensitive like" ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") §4.1). XData generates test data that tells apart queries whose LIKE operators differ (LIKE, ILIKE and their NOT forms), or whose patterns differ by a `_` in place of a `%` (or the reverse) or a missing one (§4.3).

**Learn more:** [XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") §4.1 and §4.3, which don't define the wildcards (general definition); App. B.1, which solves string conditions with [finite automata](#/glossary/finite-state-machine).

**Related:** [finite-state machine](#/glossary/finite-state-machine), [index (database)](#/glossary/index-database), [mutation testing](#/glossary/mutation-testing)


<a id="linear-and-nonlinear-integer-arithmetic"></a>

## Linear and nonlinear integer arithmetic

Linear integer arithmetic (LIA) is the logic of formulas over integer variables built from +, multiplication by a constant, if-then-else, ≤ and =, the Boolean connectives and quantifiers, but never a product of two variables ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1). Solvers can decide it, which is why SQLSolver translates equivalence questions into it ("a LIA formula that can be decided using existing SMT solvers", abstract). Nonlinear integer arithmetic allows products of variables and is undecidable in general: [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") needs it to encode SQL joins, "at the cost of losing decidability in that case" (§2.1, footnote, PDF p. 7).

**Learn more:** [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1 (PDF p. 10); [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 7](https://arxiv.org/pdf/2405.03057#page=7)) §2.1 (PDF p. 7).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [decidable and undecidable](#/glossary/decidable-and-undecidable), [equisatisfiable](#/glossary/equisatisfiable), [first-order logic](#/glossary/first-order-logic)


<a id="list-semantics"></a>

## List semantics

Query results are ordered lists, so the same rows in a different order count as a different result. It is needed for queries with `ORDER BY`: VeriEQL treats relations as bags and switches to lists when a query sorts ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §3.3). SQL leaves the order of tied rows open, so a sorted query can have several legal lists; Logos therefore gives each query the set of all its legal ordered lists ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 8](https://arxiv.org/pdf/2403.03193#page=8)) §3.3 (PDF p. 8); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF pp. 1–2).

**Related:** [bag semantics](#/glossary/bag-semantics), [nondeterministic query](#/glossary/nondeterministic-query)


<a id="llm-as-a-judge"></a>

## LLM-as-a-judge

Using an LLM to grade outputs (decide whether an answer is correct, or which of two answers is better) in place of a human or an exact check. It is cheap to scale, but its verdict is a model output that can be wrong; how often is measured by comparing its verdicts with trusted labels.

Example: Argus's authors replaced their SQL equivalence prover with an LLM judge and collected 20 bug reports; all 20 were false positives. The judge was wrong on only 1 of 20 pairs of query templates it called equivalent, and the authors explain that real bugs are so rare that "even a low false positive rate can generate a volume of false reports that overwhelmingly drown out true positives" ([Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") §7.4).

**Learn more:** [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") ([PDF p. 1](https://arxiv.org/pdf/2410.12784#page=1)) §1 (PDF p. 1), which presents LLM-based judges as a scalable alternative to human evaluation, also used as reward models and as verifiers, and asks how reliable they are; [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)") ([PDF p. 6](https://arxiv.org/pdf/2510.04618#page=6)) §4.1 (PDF p. 6), which grades BIRD-SQL answers with GPT-4o-mini "under LLM-as-a-judge"; [Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") ([PDF p. 20](https://arxiv.org/pdf/2510.06663#page=20)) §7.4 (PDF p. 20). The work [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") and [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)") cite for the paradigm (Zheng et al.) is not listed here.

**Related:** [Cohen's kappa](#/glossary/cohens-kappa), [test oracle](#/glossary/test-oracle), [reward hacking](#/glossary/reward-hacking)


<a id="locality-sensitive-hashing-minhash"></a>

## Locality-sensitive hashing (MinHash)

Hashing designed so that similar items are likely to land in the same bucket, which finds near matches without comparing a query with every stored item. MinHash is such a scheme for sets (for strings, sets of their pieces): it gives each item a short signature, and the share of matching signature entries estimates how much two sets overlap. Alpha-SQL stores MinHash signatures of database values and uses LSH to find stored values close to a question's keywords ([Alpha-SQL](#/papers/li2025alphasql "Alpha-SQL: Zero-Shot Text-to-SQL using Monte Carlo Tree Search (2025)") §4.3).

**Learn more:** [Alpha-SQL](#/papers/li2025alphasql "Alpha-SQL: Zero-Shot Text-to-SQL using Monte Carlo Tree Search (2025)") §4.3, which uses them without defining them (general definition).

**Related:** [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [schema linking](#/glossary/schema-linking)


<a id="logical-bug"></a>

## Logical bug

In database testing, a bug that makes the database system return a wrong result without crashing or reporting an error. QTRAN's authors describe logical bugs as those "that result in incorrect result sets being returned without obvious symptoms" ([QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §1). Since nothing signals them, finding them needs a [test oracle](#/glossary/test-oracle), a way to tell a wrong result from a right one ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §7), such as [metamorphic testing](#/glossary/metamorphic-testing), which compares the results of queries built to give equal or related results, or [differential testing](#/glossary/differential-testing), which compares the results of different database systems ([QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §6).

**Learn more:** [QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §1 (PDF p. 2) and §6 (PDF p. 19), which sorts logical-bug oracles into differential, oracle-guided synthesis and metamorphic ones; [SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §7 (PDF p. 11), which contrasts them with crashes.

**Related:** [metamorphic testing](#/glossary/metamorphic-testing), [differential testing](#/glossary/differential-testing), [test oracle](#/glossary/test-oracle), [delta debugging](#/glossary/delta-debugging)


<a id="logical-plan"></a>

## Logical plan

A tree of relational operations (scan a table, filter, join, group, project) that says what a query computes but not how. The database's optimizer turns it into a physical plan, which picks an algorithm for each step (for a join, hash join or sort-merge join, say), so one logical plan can run as many different physical plans.

Example: `SELECT name FROM Emp WHERE age > 30` has the logical plan: scan `Emp`, then filter `age > 30`, then project `name`.

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.1 (PDF p. 2), whose optimizer generator uses "the logical and the physical algebras" and maps "an expression of the logical algebra (a query) into an expression of the physical algebra (a query evaluation plan consisting of algorithms)"; [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §1 (PDF p. 2), which defines test coverage on the logical plan because the physical plan "may bear little resemblance to the query syntax"; [Can the Rookies Cut…](#/papers/singh2024sqlequiquest "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)") ([PDF p. 6](https://arxiv.org/pdf/2412.05561#page=6)) §4.2 (PDF p. 6), which adds unoptimized logical plans to LLM prompts.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [branch and path coverage](#/glossary/branch-and-path-coverage), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [query optimizer](#/glossary/query-optimizer), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules)


<a id="loop-invariant"></a>

## Loop invariant

A condition that holds each time a loop is about to check whether to run again: it is true before the first iteration, and each iteration keeps it true. When the loop ends, the invariant together with the reason the loop stopped is what lets a verifier prove what holds afterwards. Verifiers generally need invariants written for them as proof annotations; PSV's authors trace that need to verifiers' incompleteness ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. F).

Example ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. D): `max_element` scans `a` with index `i`, keeping `max` as the largest element seen so far. Its invariants say that every `a[j]` with `j < i` is at most `max` and that some `a[j]` with `j < i` equals `max`. When the loop exits, `i` equals the length of `a`, so the invariants become the [formal specification](#/glossary/formal-specification)'s postconditions.

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 13](https://arxiv.org/pdf/2512.18160#page=13)) App. D (PDF pp. 13–14), and §3 (PDF p. 3), where invariants are part of the proof code a solver must write; [Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") ([PDF p. 8](https://arxiv.org/pdf/2310.04870#page=8)) §5.2 (PDF p. 8) uses LLMs to propose loop invariants for a verifier, but doesn't define the term; neither does [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") (general definition).

**Related:** [formal specification](#/glossary/formal-specification), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="lora-low-rank-adaptation"></a>

## LoRA (low-rank adaptation)

A cheap way to fine-tune a large model: its weights stay frozen, and small added matrices (an "adapter") are trained whose product is added to some of the weight matrices. The adapter is stored and swapped separately from the model.

**Learn more:** nothing on this site defines it (general definition; Hu et al., 2021, is not listed here). [Naive Prompt Optimization (NPO)](#/papers/chang2026npo "Naive Prompt Optimization: Rethinking the Need for Complex Prompt Search (2026)") §2.6 trains a LoRA adapter for its GRPO baseline.

**Related:** [GRPO](#/glossary/grpo), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="lost-in-the-middle"></a>

## Lost in the middle

The finding, from Liu et al. (not listed here), that LLMs use information at the start or end of a long input better than information in its middle. [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)") §5.1 reports the same on its table tasks: ChatGPT and CodeLlama "achieve higher performance when the answer is located at the beginning or end of the context, compared to when it appears in the middle". LLM-AutoDiff cites the effect as one reason to send feedback only on failed examples, so that errors aren't "diluted within a large block" of correct ones ([LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §3.4.1).

**Learn more:** [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)") §5.1; [LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §3.4.1.

**Related:** [positional bias](#/glossary/positional-bias)


<a id="letter-m"></a>

<a id="magic-sets"></a>

## Magic sets

A query rewrite that first computes the set of values the rest of the query can actually use (the "magic" set) and then restricts an expensive part of the query to those values. Example ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §5.1.3): a query needs departments' average salaries only for departments with a young employee and a large budget, so the rewrite computes the averages for those departments alone instead of for all. It was first used for recursive queries in deductive databases, then for complex decision-support queries, and was implemented in IBM's DB2 (same place, which says, after Seshadri et al., that all magic-set rewrites can be composed from three basic semijoin rules, and proves two of them in Coq).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 9](https://arxiv.org/pdf/1607.04822#page=9)) §5.1.3 (PDF p. 9); [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §6 (PDF p. 17), whose sideways information passing "resembles the magic set transformations". The original papers are not listed here.

**Related:** [correlated subquery](#/glossary/correlated-subquery), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="mann-whitney-u-test"></a>

## Mann-Whitney U test

A significance test for whether values from one group tend to be larger than values from another, independent group: it ranks all values together and compares the two groups' ranks (general definition). Unlike the [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), it needs no pairing between the groups. SQLess uses it to test whether its query simplification ratios beat those of two other tools ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §5.3).

**Learn more:** [SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §5.3 (PDF p. 9), which uses it without defining it (general definition).

**Related:** [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [sign test](#/glossary/sign-test), [multiple testing](#/glossary/multiple-testing), [statistical power](#/glossary/statistical-power)


<a id="many-to-many-relationship"></a>

## Many-to-many relationship

A link between two kinds of things in which an item on either side can be linked to several on the other, such as gyms and fitness classes: "a gym can offer multiple classes and a class can be offered by multiple gyms" ([AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") §3.3). A relational schema stores it as a separate table of pairs, each column a foreign key to one side (general definition), like AMBROSIA's "Gyms_Classes" table (§3.2, Fig. 1a). AMBROSIA builds its scope-ambiguity questions ("What activities does each gym offer?") on such a relationship with a class common to several gyms (§3.3).

**Learn more:** [AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") ([PDF p. 4](https://arxiv.org/pdf/2406.19073#page=4)) §1, §3.2 (PDF p. 4) and §3.3 (PDF p. 5), which use the term without defining it (general definition).

**Related:** [normalized schema](#/glossary/normalized-schema), [integrity constraint](#/glossary/integrity-constraint)


<a id="markov-decision-process"></a>

## Markov decision process

The formal setting of [reinforcement learning](#/glossary/reinforcement-learning): a set of states, a set of actions, transition probabilities that give the chance of each next state after an action in a state (in QUITE and in token generation the next state is fixed), and a reward for each step, often with a discount factor γ < 1 that makes later rewards count less. A policy chooses an action in each state; the goal is a policy with the highest expected total (discounted) reward. "Markov" means the next state depends only on the current state and action, not on how the process got there.

Example: QUITE models query rewriting as an MDP (S, A, T, r, γ): a state is the current form of the query, an action is a refinement "(e.g., join reordering, predicate pushdown)" or a terminal action that emits the final query, the transition is deterministic (§4.1), and a refinement's reward is the drop in "the DBMS optimizer's estimated execution cost (via EXPLAIN) and LLM's evaluation" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §4.1). Its policy is a prompted reasoning LLM (DeepSeek-R1), and QUITE is "training-free" (§1), so here the MDP frames the agent's reasoning rather than an RL training run. In text generation more generally a state is the prompt plus the tokens so far and an action is the next token; LITHE frames its token-level search this way ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §5).

**Learn more:** [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") ([PDF p. 5](https://arxiv.org/pdf/2506.07675#page=5)) §4.1 (PDF p. 5); [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 10](https://arxiv.org/pdf/2502.12918#page=10)) §5 (PDF p. 10). LITHE cites Puterman's 1994 book on MDPs (ref. [41], PDF p. 27) and QUITE his 1990 handbook chapter (ref. [62], PDF p. 14); neither is on this site.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts), [optimizer cost estimate](#/glossary/optimizer-cost-estimate)


<a id="masked-language-model"></a>

## Masked language model

A language model trained to fill in hidden tokens using the text on both sides of them, such as BERT and RoBERTa, rather than to predict the next token from the left (general definition). AutoPrompt uses one by putting a single `[MASK]` token in a prompt: the model's probability distribution over that slot gives the answer, for a classification task through the probabilities of chosen label words ([AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") §2.1).

**Learn more:** [AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") §1 and §2.1, which use the term without defining it (general definition).


<a id="materialized-view"></a>

## Materialized view

A query result that the database computes in advance and stores like a table, so that later queries can read it instead of recomputing it; the optimizer can rewrite a query to use it, and it must be updated when the underlying tables change. Calcite's authors call "the precomputation of relevant summaries or materialized views" one of the most powerful techniques for speeding up data-warehouse queries ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §6), and GEqO's authors name materialized-view selection and matching among the uses of finding equivalent subexpressions ([GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1). EQUITAS's authors measure the speedup from materializing sub-queries shared by recurring production queries ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §6.3, PDF p. 11).

**Learn more:** [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §6; [GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [query equivalence](#/glossary/query-equivalence), [common table expression (CTE)](#/glossary/common-table-expression-cte)


<a id="mcnemars-exact-test"></a>

## McNemar's exact test

A significance test for comparing two systems scored right or wrong on the same examples. It ignores the examples both get right or both get wrong, and asks whether the examples where exactly one is right (the "discordant pairs") split more unevenly than chance allows. Pairing makes it sharper than comparing two accuracies with separate confidence intervals.

**Learn more:** [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") ([PDF p. 7](https://arxiv.org/pdf/2609.04697#page=7)) §5 (PDF p. 7), which uses it on 1,534 shared dev examples and reports the discordant-pair counts. The test's original paper is not listed here.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing)


<a id="memo"></a>

## Memo

The data structure in which a Volcano/Cascades [query optimizer](#/glossary/query-optimizer) stores every alternative it has considered, compactly. Equivalent expressions are kept together in a group, and an expression's inputs are groups rather than concrete subtrees, so one stored expression stands for every combination of its inputs' alternatives, and nothing is derived twice.

Example ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2.1, Fig. 2): for `SELECT * FROM A, B, C WHERE A.x = B.y AND B.p = C.q`, group 4 holds `Join(1, 2)` and `Join(2, 1)`, the join of A and B both ways round, and the root group's expression `Join(4, 3)` stands for both `Join(Join(A,B),C)` and `Join(Join(B,A),C)`. QO-Verify builds the memo of each of two queries and declares them equivalent if it finds a logical expression common to both (§1, §2.2).

**Learn more:** [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2.1 (PDF p. 3); [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §3 (PDF p. 4), where it is "a hash table of expressions and equivalence classes"; [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2 (PDF pp. 2–4), which calls it the "memo" structure and drops "exact replicas of expressions that already exist" when adding new ones.

**Related:** [query optimizer](#/glossary/query-optimizer), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [logical plan](#/glossary/logical-plan)


<a id="meta-prompt"></a>

## Meta-prompt

The prompt given to an LLM that writes prompts, as opposed to the prompt being optimized. In OPRO it holds earlier candidate prompts with their scores, a description of the task with a few training examples, and instructions on what to output. At each step the LLM proposes new prompts, which are scored and added to the meta-prompt for the next step.

**Learn more:** [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") §1, where the term is named ("we name it the \emph{meta-prompt}"), and §2; §4.2 keeps only the highest-scoring instructions in it. [Revisiting OPRO](#/papers/zhang2024opro "Revisiting OPRO: The Limitations of Small-Scale LLMs as Optimizers (2024)") App. A.2 and App. B show one used with small models.

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="metamorphic-testing"></a>

## Metamorphic testing

Testing without knowing the correct output, by checking a relation that must hold between the outputs for related inputs (a metamorphic relation). For databases: rewrite a query into one whose result must be the same (or a subset, or a superset), run both on the same database, and report a bug if the relation fails.

Example: Ternary Logic Partitioning (TLP) splits a query Q by a condition P into `Q WHERE P`, `Q WHERE NOT P` and `Q WHERE P IS NULL`; under three-valued logic every row falls in exactly one part, so together the parts must return the same rows as Q, and "If a DBMS returns different results for the original query and its partitioned version, that indicates a bug" ([Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") §1). A relation need not be equality: adding `DISTINCT` to a query must give a result contained in the original's ([QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") Fig. 1).

It differs from [differential testing](#/glossary/differential-testing), which runs one input on two implementations.

**Learn more:** [QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §2 (PDF pp. 4–5), which defines it for database testing with a relation that is "either equivalence (=) or an approximate relation based on a predefined metamorphic relationship"; [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §VII (PDF p. 11). The technique's original paper is not listed here.

**Related:** [test oracle](#/glossary/test-oracle), [differential testing](#/glossary/differential-testing), [query equivalence](#/glossary/query-equivalence), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="minimum-description-length-mdl"></a>

## Minimum description length (MDL)

A rule for choosing among explanations of data: prefer the one that minimizes the total length of describing the explanation plus the data given the explanation, which penalizes both needlessly complex explanations and ones that explain too little. QueryBooster uses it to choose rewrite rules that generalize a user's example rewrites without under- or overfitting them; the principle "minimizes the total length required to describe the underlying patterns in the data" ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §5.1, citing Rissanen 1978, not listed here).

**Learn more:** [QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §5.1, which states the principle in one line but not its two-part form (general definition).

**Related:** [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic), [hill climbing](#/glossary/hill-climbing)


<a id="mixture-of-experts-moe"></a>

## Mixture of experts (MoE)

A model built from several sub-networks ("experts") and a gating network that, for each input, weights the experts or picks a few of them, and combines their outputs. In current LLMs it is a way to grow total size without growing the cost per token: DeepSeek-V3, an MoE model, has 671 billion parameters, of which 37 billion are activated per token ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") App. A.1). CrackSQL uses the dense form, in which every expert contributes: several encoders whose embeddings of a syntax specification are combined with softmax weights from a gating network ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") §5.1, Eqs. 2–3, PDF p. 11).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 13](https://arxiv.org/pdf/2501.12948#page=13)) App. A.1 (PDF p. 13); [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") ([PDF p. 10](https://arxiv.org/pdf/2504.00882#page=10)) §5.1 (PDF pp. 10–11). Neither defines the term (general definition).

**Related:** [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation), [post-training quantization](#/glossary/post-training-quantization)


<a id="model-collapse"></a>

## Model collapse

The degradation of a model trained repeatedly on model-generated data, its own or other models', for example outputs that lose diversity. [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") §7 says that "one of the most effective strategies to prevent model collapse during self-training is the use of a reliable verifier", citing Gillman et al.

**Learn more:** [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") §1 and §7, with citations to the model-collapse literature (none of it on this site).

**Related:** [distillation](#/glossary/distillation), [expert iteration](#/glossary/expert-iteration), [rejection sampling](#/glossary/rejection-sampling)


<a id="monitor-ai-control"></a>

## Monitor (AI control)

A separate model or check that watches another model's outputs, and sometimes its reasoning, for unwanted behaviour (bugs, reward hacking, sabotage) and flags it for review. A chain-of-thought (CoT) monitor reads the model's reasoning as well as its output. Monitor red teaming tests how easily a monitor is fooled when the watched model is under pressure or tries to evade it.

**Learn more:** [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") §1 and §2.4, on monitor red teaming for code that passes its public tests; [CATCH](#/papers/wang2026catch "CATCH: A Controllable Analysis Testbed for Reward Hacking in Coding RL (2026)") §4.2.1, a CoT monitor used as a reward penalty against reward hacking.

**Related:** [reward hacking](#/glossary/reward-hacking), [LLM-as-a-judge](#/glossary/llm-as-a-judge), [test oracle](#/glossary/test-oracle)


<a id="monomial-predicate-abstraction"></a>

## Monomial predicate abstraction

A way to find an invariant automatically, as an AND of predicates drawn from a fixed, finite set of candidates: start with the AND of all candidates, and keep dropping any candidate that a step of the program can make false, until what remains is preserved (general definition; "monomial" means a conjunction). The result is the strongest invariant of that form. Mediator uses it to find the formula relating two versions of a database: its candidates are equalities between projections of tables or of joins of two tables in the two schemas, and it removes a predicate whenever a pair of corresponding updates does not preserve it, until the formula is an inductive [bisimulation](#/glossary/bisimulation) invariant or too weak to prove equivalence ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §6.2).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 16](https://arxiv.org/pdf/1710.07660#page=16)) §6.2 and Algorithm 1 (PDF pp. 16–17), and §1 (PDF p. 3), which says it generates "the strongest conjunctive bisimulation invariant over this universe". The technique's original papers are not listed here.

**Related:** [bisimulation](#/glossary/bisimulation), [loop invariant](#/glossary/loop-invariant), [abstract interpretation](#/glossary/abstract-interpretation), [strongest postcondition](#/glossary/strongest-postcondition)


<a id="monotone-aggregate-function"></a>

## Monotone aggregate function

An aggregate whose result can only move one way as rows are added to its input: COUNT and MAX never decrease, MIN never increases, and SUM never decreases when all values are non-negative. AVG is not monotone: adding a small value lowers it (general definition). Monotonicity bounds a query's result by results over fewer or more rows: [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") notes that "as the input numbers of SUM are all non-negative", a query over a subset of another's rows has a SUM no larger (§II-A), and handles AVG separately, through SUM and COUNT (§III-C).

**Related:** [lattice](#/glossary/lattice), [query containment](#/glossary/query-containment), [materialized view](#/glossary/materialized-view)


<a id="monte-carlo-tree-search-mcts"></a>

## Monte Carlo tree search (MCTS)

A search method for sequences of decisions that grows a search tree selectively, spending more effort on promising branches. Each round has four phases ([LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §4.2): **selection** walks down from the root, at each node taking the child with the best score, which balances a high average reward (exploitation) against few visits so far (exploration), usually by the UCT or UCB formula; **expansion** adds children to the leaf reached; **simulation** estimates the new node's value, classically by a random playout to the end; **backpropagation** updates the rewards and visit counts along the path.

What a node is varies: in LaSER a node is a whole SQL query and an edge a cost-increasing transformation, and "simulation" means running the query, "Unlike standard MCTS formulations that rely on stochastic rollouts" ([LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §4.2); in LITHE a node is a partial LLM output and an edge a token, with branching only where the model is unsure of the next token ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §5); LearnedRewrite searches over orders of rewrite-rule applications ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §1). Snell et al. call their lookahead search "a special case of MCTS" with its stochastic elements removed ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §5.2). The DeepSeek-R1 authors tried MCTS for training and report that token generation "presents an exponentially larger search space" than chess and that the value model guiding the search is hard to train ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") App. G.2).

**Learn more:** [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") ([PDF p. 5](https://arxiv.org/pdf/2604.06804#page=5)) §4.2, Eq. 1 and Fig. 2 (PDF pp. 5–6); [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 10](https://arxiv.org/pdf/2502.12918#page=10)) §5 (PDF pp. 10–13); [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §1 (PDF p. 1); [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") ([PDF p. 8](https://arxiv.org/pdf/2408.03314#page=8)) §5.2 (PDF p. 8); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 63](https://arxiv.org/pdf/2501.12948#page=63)) App. G.2 (PDF pp. 63–64).

**Related:** [beam search](#/glossary/beam-search), [Markov decision process](#/glossary/markov-decision-process), [reinforcement learning](#/glossary/reinforcement-learning), [phase ordering](#/glossary/phase-ordering)


<a id="multi-armed-bandit-ucb"></a>

## Multi-armed bandit (UCB)

Choosing repeatedly among options ("arms") whose payoff is unknown, balancing trying the ones that look best against trying the ones not yet tried enough. UCB (upper confidence bound) picks the arm with the highest mean reward so far plus a bonus that shrinks as the arm is tried more often.

**Learn more:** [Learning from Prompt itself](#/papers/chen2026attribution "Learning from Prompt itself: the Hierarchical Attribution Prompt Optimization (2026)") § "UCB-based Edit Selection", where each arm is a candidate prompt edit and its reward the change in dev-set accuracy. The original UCB papers are not listed here.

**Related:** [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts), [Elo rating](#/glossary/elo-rating), [best arm identification](#/glossary/best-arm-identification), [exploration and exploitation](#/glossary/exploration-and-exploitation)


<a id="multi-hop-question-answering"></a>

## Multi-hop question answering

Questions whose answer needs facts from several documents, found one after another: "where was the director of film X born?" needs the director first, then the birthplace. Systems answer them by retrieving several times, each search informed by what earlier ones found. DSPy's case study uses HotPotQA, a benchmark of such questions, with multi-hop retrieval ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7).

**Learn more:** [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7, which uses the term without defining it (general definition).

**Related:** [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [recall@k and mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr)


<a id="multiple-testing"></a>

## Multiple testing

The problem that comes with making many comparisons at once: even when no difference is real, the chance that at least one looks significant by luck grows with the number of comparisons. Corrections such as Holm–Bonferroni raise the bar for each comparison so that the chance of any false alarm in the whole family stays at the chosen level.

Example: [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") compares seven methods with a baseline in each setting and adjusts the p-values (each the chance of a difference at least this large if the method were no better than the baseline) with the Holm–Bonferroni procedure, which "controls the chance of any false alarm inside a setting" (§4.5, §4.7).

[ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") uses the term for a related effect, selecting a winner: choosing the best of about 10 prompts on 30 validation examples is "a multiple-testing problem: a candidate may rank first due to favorable noise rather than true quality" (§3.4). Its remedy is [bootstrap resampling](#/glossary/bootstrap-resampling), not a p-value correction.

**Learn more:** [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") ([PDF p. 8](https://arxiv.org/pdf/2607.28576#page=8)) §4.5 (PDF p. 8) and §4.7 (PDF p. 10); [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") ([PDF p. 4](https://arxiv.org/pdf/2609.04197#page=4)) §3.4 (PDF p. 4). Holm's paper, which [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") cites, is not listed here.

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling), [McNemar's exact test](#/glossary/mcnemars-exact-test)


<a id="mutation-testing"></a>

## Mutation testing

A way to judge a test suite: make many copies of the program (mutants), each with one small deliberate change such as `<` replaced by `<=`, and count how many of them the tests tell apart from the original; a test that does so is said to kill the mutant. A mutant that happens to be equivalent to the original can never be killed, so the goal is to kill all the non-equivalent ones.

For SQL, the program is a query and the mutants model likely mistakes in writing it; a test database kills a mutant if the query and the mutant return different results on it ([Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") §1), which makes it a [counterexample database](#/glossary/counterexample-database) for that pair. Example: to kill the mutant `r.A <= 5` of the condition `r.A < 5`, a database needs a row with `r.A = 5` that changes the query's result.

Mutation testing changes the program; mutation-based [fuzzing](#/glossary/fuzzing) changes the inputs.

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5), for programs ("also known as mutation analysis"); [Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") ([PDF p. 1](https://arxiv.org/pdf/2409.18821#page=1)) §1 (PDF p. 1) and §2 (PDF p. 2), for SQL queries and the XData line of test-data generators.

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [counterexample database](#/glossary/counterexample-database), [fuzzing](#/glossary/fuzzing)


<a id="letter-n"></a>

<a id="nondeterministic-query"></a>

## Nondeterministic query

A query that can legally return different results on the same database, for example top-k with ties (`ORDER BY … LIMIT k` when rows tie on every sort key, so which of the tied rows make the cut is open), or `random`. For such queries, "the two results differ" no longer proves two queries inequivalent, and each use must say which notion of equivalence it means.

**Learn more:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) § Challenge (the home of this term: sources of nondeterminism and candidate definitions of equivalence); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF pp. 1–2) on "tie-sensitive top-k" and why one engine run can't show two such queries differ.

**Related:** [list semantics](#/glossary/list-semantics), [spurious counterexample](#/glossary/spurious-counterexample), [query equivalence](#/glossary/query-equivalence)


<a id="normalized-gain"></a>

## Normalized gain

How much of the possible improvement a change achieves: (score after − score before) / (maximum score − score before). Going from 40% to 70% pass rate closes 30 of the 60 points left, a normalized gain of 50%. It lets gains be compared between systems that start at different levels.

**Learn more:** [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)") §4, which uses it for the gain from skills (citing Hake 1998, not listed here).


<a id="normalized-schema"></a>

## Normalized schema

A schema designed so that each fact is stored in one place, with tables split along [functional dependencies](#/glossary/functional-dependency) and linked by keys, so that updates can't leave contradictory copies. In an unnormalized schema the same fact can be stored twice and the copies can disagree, so two reasonable queries that read different copies return different results: [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §5.2 reports schemas that are not normalized in "all BIRD databases and some of the Spider databases", where one question can be answered by joining two different sets of tables with different results on the shipped data.

**Learn more:** [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §5.2, which uses the term without defining it (general definition).

**Related:** [functional dependency](#/glossary/functional-dependency), [integrity constraint](#/glossary/integrity-constraint), [many-to-many relationship](#/glossary/many-to-many-relationship), [gold query](#/glossary/gold-query)


<a id="np-complete-and-the-polynomial-hierarchy"></a>

## NP-complete and the polynomial hierarchy

Classes that say how hard a yes/no problem gets as its input grows. A problem is in NP if every "yes" answer has a short proof that can be checked quickly (for query containment, the [homomorphism](#/glossary/homomorphism-containment-mapping) itself); NP-complete problems are the hardest in NP, and no algorithm is known that solves them in polynomial time in the worst case. The polynomial hierarchy stacks further levels above NP; its second level, Π₂ᵖ, holds problems of the form "for every X there is a Y such that …", and is believed to be strictly harder than NP.

Chaudhuri and Vardi note that such complexity is "in terms of the size of the queries, which is typically much smaller than the size of the database", so the test is practical for many real queries ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §4.3, PDF p. 7).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF p. 2) and §4.3 (PDF p. 7); [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §5 (PDF pp. 15–18), the reduction from [3-SAT](#/glossary/3-sat). [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §4 (PDF p. 5) proves a different NP-completeness result, for answering a conjunctive yes/no query when the database counts as part of the input (Thm. 7); it never states containment's complexity in those words.

**Related:** [decidable and undecidable](#/glossary/decidable-and-undecidable), [query containment](#/glossary/query-containment), [3-SAT](#/glossary/3-sat), [PSPACE](#/glossary/pspace), [graph isomorphism](#/glossary/graph-isomorphism)


<a id="null-and-three-valued-logic"></a>

## NULL and three-valued logic

NULL marks a missing value. A comparison with NULL gives a third truth value, unknown, which passes through AND, OR and NOT by fixed truth tables; `WHERE` keeps only rows whose condition is true, dropping both false and unknown. SQL is not uniform about it: in set operations such as `EXCEPT` and `INTERSECT`, two NULLs count as equal ([A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §1).

Example: for a row whose `age` is NULL, both `WHERE age > 30` and `WHERE NOT (age > 30)` drop the row. VeriEQL's authors report that some earlier checkers, such as HoTTSQL, do not model NULL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §1, PDF p. 2).

**Learn more:** [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §1 and Fig. 1 (PDF pp. 1–2); [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 9](https://arxiv.org/pdf/2403.03193#page=9)) §3.3 (PDF p. 9).

**Related:** [formal semantics](#/glossary/formal-semantics), [query equivalence](#/glossary/query-equivalence)


<a id="null-rejecting"></a>

## NULL-rejecting

A condition is NULL-rejecting on a column if it can't be true when that column is NULL; `x = 'Biology'` is, since with a NULL it evaluates to unknown and `WHERE` drops the row. Optimizers use this to simplify [outer joins](#/glossary/outer-join): above a left outer join, a NULL-rejecting condition on a column of the right input discards every row the join padded with NULLs, so the outer join can be replaced by an inner join ([Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") App. B.2, which gives this rule with an example).

**Learn more:** [Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") App. B.2 and §3.2; [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §4 (PDF p. 14), which relies on a join being NULL-rejecting without defining the term.

**Related:** [NULL and three-valued logic](#/glossary/null-and-three-valued-logic), [outer join](#/glossary/outer-join), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="letter-o"></a>

<a id="olap-and-oltp"></a>

## OLAP and OLTP

Two kinds of database workload. OLTP (online transaction processing) runs many short queries and updates that each touch a few rows, such as placing an order; OLAP (online analytical processing) runs fewer, complex, read-mostly queries over large data, such as sales by region and quarter. SQLGovernor's authors write that "OLTP queries are simple and execute within milliseconds", while OLAP queries run on large data volumes, "often ranging from seconds to minutes" ([SQLGovernor (Tencent)](#/papers/jiang2025sqlgovernor "SQLGovernor: An LLM-powered SQL Toolkit for Real World Application (2025)") §1). Benchmarks are labelled by kind: [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §6.1 calls TPC-H and JOB OLAP benchmarks and XuetangX an OLTP one.

**Learn more:** [SQLGovernor (Tencent)](#/papers/jiang2025sqlgovernor "SQLGovernor: An LLM-powered SQL Toolkit for Real World Application (2025)") §1; [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §6.1 (PDF p. 9). Neither defines the terms (general definition).

**Related:** [query optimizer](#/glossary/query-optimizer), [materialized view](#/glossary/materialized-view)


<a id="online-and-offline-rl"></a>

## Online and offline RL

In online RL the model being trained keeps generating new outputs, which are scored and learned from as training goes on; in offline RL it learns from a fixed set of outputs collected and scored beforehand. [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") §5.1 calls [PPO](#/glossary/ppo) "online reinforcement learning" and [DPO](#/glossary/direct-preference-optimization-dpo) "offline preference tuning"; [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") calls [GRPO](#/glossary/grpo) "an online policy gradient method" (§2). [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") first warms up its model with an offline RL method (TAO) and then performs "online RL with verifiable rewards (RLVR)" (§3).

**Learn more:** [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 21](https://arxiv.org/pdf/2411.15124#page=21)) §5.1.2 (PDF p. 21) and §8.2 (PDF p. 48), which calls standard DPO's preference data "collected ahead of time, often from a distinct language model, and are thus considered as offline", in contrast to "online methods like PPO where the RM provides online feedback to generations from the policy"; [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") §2 and §5.2; [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") §3.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [policy gradient](#/glossary/policy-gradient), [rejection sampling](#/glossary/rejection-sampling), [expert iteration](#/glossary/expert-iteration)


<a id="open-coding"></a>

## Open coding

A qualitative research method for building categories from the data instead of fixing them in advance: read the cases one by one, label each with short descriptive codes, and group similar codes into categories as they emerge (general definition). DLBench sorts the errors in 300 randomly sampled SQL translations this way into four main categories, from E1 (syntax errors) on ([DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §VI-C).

**Learn more:** [DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §VI-C (PDF p. 9), which cites Khandkar (not listed here) without describing the method (general definition).

**Related:** [Cohen's kappa](#/glossary/cohens-kappa)


<a id="optimizer-cost-estimate"></a>

## Optimizer cost estimate

The number a query optimizer computes for a plan in order to compare alternatives, from a cost model and [cardinality estimates](#/glossary/cardinality-estimation). It is a prediction in the optimizer's own units, not a measured time: Volcano lets the implementor choose cost to be "a number (e.g., estimated elapsed time), a record (e.g., estimated CPU time and I/O count), or any other type" ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.2). `EXPLAIN` prints it without running the query (see [query plan and EXPLAIN](#/glossary/query-plan-and-explain)).

Use here: LLM query rewriters use it as a cheap stand-in for speed.

Gotcha: estimate and run time can disagree. LITHE's authors cite "material discrepancies between optimizer cost predictions and actual execution times" and add checks that discard "brittle" rewrites ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §1), and they report estimated-cost and wall-clock results separately (§7.1). QUITE's decision agent avoids "relying solely on EXPLAIN cost estimates" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §4.2.2).

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.2 (PDF p. 3); [E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") ([PDF p. 4](https://arxiv.org/pdf/2508.09023#page=4)) Eq. 4 (PDF p. 4); [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 2](https://arxiv.org/pdf/2502.12918#page=2)) §1 (PDF pp. 2–3) and §7.1 (PDF pp. 16–17).

**Related:** [cost-based optimization](#/glossary/cost-based-optimization), [cardinality estimation](#/glossary/cardinality-estimation), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [reward hacking](#/glossary/reward-hacking)


<a id="optimizing-smt-solver"></a>

## Optimizing SMT solver

An SMT solver that does more than find values satisfying a formula: "Given a formula φ and an objective function F, an optimizing SMT Solver finds a satisfying assignment of φ that maximizes or minimizes the value of F" ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §4.2). RATest uses one (Z3) to find a smallest [witness](#/glossary/witness-provenance): the formula says the chosen input rows still produce a given output row, and the objective is the number of rows chosen. It frames this as the min-ones satisfiability problem, which asks whether a Boolean formula "is satisfiable with at most k variables set to true" (§4).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §4 and §4.2; §6 names Z3 as "an efficient optimizing SMT Solver".

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [counterexample database](#/glossary/counterexample-database), [data provenance](#/glossary/data-provenance), [witness (provenance)](#/glossary/witness-provenance)


<a id="out-of-distribution-generalization"></a>

## Out-of-distribution generalization

How well a model does on inputs that come from a different source or distribution than its training data, as opposed to held-out examples of the same kind. [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") tests its reward models on 224 questions from recent AP and AMC exams, released after its pre-training data was compiled (§5).

**Learn more:** [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §5, which uses the term without defining it (general definition).

**Related:** [data contamination](#/glossary/data-contamination)


<a id="outcome-and-process-rewards"></a>

## Outcome and process rewards

An outcome reward scores only the final result of a model's answer (is the final answer right?); a process reward scores the steps that led to it, for example whether each reasoning step is correct. Outcome rewards are cheap when answers can be checked automatically, but they can't tell sound reasoning from a flawed path that happens to reach the right answer; process rewards need step-level labels, from people or from rules. A reward model trained on such labels is an outcome-supervised (ORM) or process-supervised (PRM) reward model.

Example: ReViSQL's authors argue that a query that ignored the question's evidence but "coincidentally returns the correct result" and one that used the evidence correctly "are indistinguishable to an outcome reward" ([ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") §4.1). Their process reward is a rule, not a judgment of each step: it subtracts penalties when the reasoning lacks the required blocks that translate and check each evidence entry (§4.2).

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 1](https://arxiv.org/pdf/2211.14275#page=1)) §1 (PDF p. 1), which compares the two kinds of supervision on math word problems; [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") ([PDF p. 2](https://arxiv.org/pdf/2305.20050#page=2)) §1 (PDF p. 2) for ORMs and PRMs, and §2 (PDF p. 3), on why outcome labels can be automated and process labels needed human labellers; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 63](https://arxiv.org/pdf/2501.12948#page=63)) App. G.2 (PDF p. 63), on why DeepSeek-R1 did not use a PRM (steps are hard to define, and a model-based PRM "inevitably leads to reward hacking").

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [reward shaping](#/glossary/reward-shaping), [reward hacking](#/glossary/reward-hacking), [best-of-N sampling](#/glossary/best-of-n-sampling), [beam search](#/glossary/beam-search)


<a id="outer-join"></a>

## Outer join

A join that also keeps the rows that find no match, filling the other side's columns with NULL. A left outer join keeps every row of the left table, a right outer join every row of the right, and a full outer join both (general definition; the cited paper doesn't name the three kinds). Ganski and Wong use it to fix the COUNT bug of an unnesting rewrite, whose ordinary join dropped groups with no matching rows, whose count should be 0 ([Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.2, PDF p. 4).

**Learn more:** [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.2 (PDF p. 4), which takes the definition from Codd: the outer join includes all values from the columns participating in the join, with NULLs in the opposite column where a value has no match. Codd's paper is not listed here.

**Related:** [NULL-rejecting](#/glossary/null-rejecting), [correlated subquery](#/glossary/correlated-subquery), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin), [join algorithms (nested-loop, hash and merge join)](#/glossary/join-algorithms-nested-loop-hash-and-merge-join), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="over-approximation-and-under-approximation"></a>

## Over-approximation and under-approximation

An over-approximation of what a program can do includes everything it can really do, and possibly more; an under-approximation includes only things it can really do, but possibly not all of them. Reasoning over an over-approximation can prove properties, but may report counterexamples that can't happen; reasoning over an under-approximation finds only real counterexamples, but may miss some.

Example: modelling aggregates such as `SUM` as [uninterpreted functions](#/glossary/uninterpreted-function) over-approximates them and "can admit spurious counterexamples that cannot arise under concrete SQL semantics" ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1, PDF p. 1). Polygon instead searches under-approximations, each covering a subset of the outputs a query can really produce ([Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") §1, PDF p. 2).

**Learn more:** [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF p. 1); [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.06542#page=2)) §1 (PDF p. 2).

**Related:** [spurious counterexample](#/glossary/spurious-counterexample), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="letter-p"></a>

<a id="pareto-front"></a>

## Pareto front

Among candidates scored on several criteria, the Pareto front (or Pareto frontier) is the set that no other candidate beats on one criterion without losing on another: no other candidate is at least as good on every criterion and strictly better on at least one. It shows the trade-offs, such as accuracy against cost, instead of naming a single winner.

Example: SEPO's authors report that their prompt optimizer lies on the Pareto frontiers of accuracy against cost, both for the optimization run and at test time ([SEPO](#/papers/ma2026sepo "SEPO: Evidence-Grounded Prompt Optimization via Structural Editing (2026)") abstract).

Reflective prompt optimizers use a variant in which each training example is a criterion. [What Should the Reflector See?](#/papers/zhou2026reflector "What Should the Reflector See? An Empirical Study of Evidence in Reflective Prompt Optimization (2026)") keeps the full front: "A prompt is on the strict Pareto front if no other calibrated prompt is at least as good on every calibration example and strictly better on at least one" (§3.1). GEPA's "Pareto frontier" keeps only the candidates that have the best score on at least one training example, then prunes dominated ones ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") §3.1); by our reading this can drop a candidate that is second-best on every example yet beaten by no single other candidate.

**Learn more:** [What Should the Reflector See?](#/papers/zhou2026reflector "What Should the Reflector See? An Empirical Study of Evidence in Reflective Prompt Optimization (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.32452#page=3)) §3.1 (PDF p. 3); [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") ([PDF p. 2](https://arxiv.org/pdf/2507.19457#page=2)) §1 (PDF p. 2), which keeps a front to avoid evolving "only the global best prompt", and §3.1 (PDF p. 7); [SEPO](#/papers/ma2026sepo "SEPO: Evidence-Grounded Prompt Optimization via Structural Editing (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.28067#page=1)) abstract (PDF p. 1).

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="parser-error-recovery"></a>

## Parser error recovery

A parser's ability to carry on after meeting text its grammar doesn't accept, for example by skipping the offending tokens, instead of stopping at the first error. QTRAN feeds a query written in one SQL dialect to a standard parser and uses the error recovery of ANTLR parsers to skip the dialect-specific tokens, which then mark the features it must translate ([QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §3.1.2, PDF p. 8).

**Learn more:** [QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)") §3.1.2 (PDF p. 8), which takes the method from SQLess ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)")).

**Related:** [SQL dialect](#/glossary/sql-dialect), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)


<a id="passk"></a>

## Pass@k

The chance that at least one of k sampled answers to a problem is correct, averaged over problems; a "pass" means passing the unit tests for code, or the verifier or proof checker for verified code and proofs. It is usually estimated by drawing n ≥ k samples per problem, counting the c correct ones, and computing 1 − C(n−c, k) / C(n, k), where C is the binomial coefficient. It credits a problem if any sample is right, so it presumes a way to recognize the right sample; without a checker, choosing among samples is a separate and harder problem.

Example: Brown et al. report that on MATH with Llama-3-8B-Instruct, coverage (their name for pass@k) rose from 82.9% at 100 samples to 98.44% at 10,000, while the biggest gain from choosing an answer by majority vote or a reward model was "only from 40.50% to 41.41%" over the same range ([Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") §1).

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 5](https://arxiv.org/pdf/2512.18160#page=5)) §4 (PDF p. 5), for the estimator; [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") ([PDF p. 4](https://arxiv.org/pdf/2407.21787#page=4)) §2 (PDF p. 4), Eq. 1, which calls it coverage. Chen et al. (2021), which both cite for the metric, is not listed here.

**Related:** [self-consistency](#/glossary/self-consistency-majority-voting), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="passk-reliability-over-k-trials"></a>

## Pass^k (reliability over k trials)

The share of tasks on which all k independent trials succeed: a reliability measure. It falls as k grows unless the agent succeeds every time, unlike [pass@k](#/glossary/passk), where one success in k is enough.

**Learn more:** [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") ([PDF p. 10](https://arxiv.org/pdf/2607.09175#page=10)) §5.1 (PDF p. 10), which contrasts pass@k's "best-of-k criterion" with pass^k's "trial-level reliability under an all-k" criterion and reports pass^3; the metric comes from τ-bench, which is not listed here.

**Related:** [pass@k](#/glossary/passk)


<a id="pearson-correlation"></a>

## Pearson correlation

A number from −1 to +1 for how closely two lists of paired values follow a straight line: +1 means one rises exactly linearly with the other, −1 that it falls exactly linearly, 0 that there is no linear relation. [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) is Pearson's computed on ranks. Round-trip correctness reports both against existing benchmark scores ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.1).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.1, which uses it without defining it (general definition).

**Related:** [Spearman's rank correlation](#/glossary/spearmans-rank-correlation), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="perplexity"></a>

## Perplexity

How surprised a language model is by a text: the exponential of the average negative log-probability per token that the model assigns to it. Lower perplexity means the model finds the text more likely. [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") defines it this way and uses it to ask whether the reasoning an RL-trained model writes was already likely under the base model (§4.1).

**Learn more:** [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") §4.1.

**Related:** [reasoning boundary](#/glossary/reasoning-boundary), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="phase-ordering"></a>

## Phase ordering

The problem of choosing the order in which a system applies its transformations, when one can enable or block another. The name is borrowed from compilers, where it is the order of optimization passes. ReSequel's authors use it for query rewrite rules: the order "is determined heuristically by experts", and "An incorrect ordering may cause a rewrite to destroy the source pattern required by a more impactful rewrite" ([ReSequel](#/papers/fathollahzadeh2026resequel "ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling (2026)") §2.1); they list phase ordering among the reasons DBMSs fail to fully optimize messy queries (§9). QUITE's authors make the same point: "each transformation step changes the query structure and limits future optimization options" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §4.1).

Example: Starburst's authors found that rule interactions make it "very difficult to explicitly express the order in which rules should be applied", and control it through rule classes, each with its own scheme for choosing the next rule to fire ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4). LearnedRewrite searches over rule orders with [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts) ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §1).

**Learn more:** [ReSequel](#/papers/fathollahzadeh2026resequel "ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling (2026)") ([PDF p. 2](https://arxiv.org/pdf/2606.20853#page=2)) §2.1 (PDF p. 2), Fig. 2 (PDF p. 3) and §9 (PDF p. 12); [Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4 (PDF pp. 8–9). Nothing on this site defines the compiler term (general definition).

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [cost-based optimization](#/glossary/cost-based-optimization), [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts)


<a id="policy-entropy"></a>

## Policy entropy

How spread out an LLM's next-token choices are while it is trained with RL (the "policy" is the model). High entropy means the model still tries different outputs; entropy falling toward zero means it keeps producing nearly the same output, so it explores less.

**Learn more:** [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") ([PDF p. 8](https://arxiv.org/pdf/2604.06804#page=8)) §5.2 (PDF p. 8), which measures it as "the token-level average entropy" and uses it as a sign of where to explore; [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") ([PDF p. 8](https://arxiv.org/pdf/2609.04697#page=8)) §6 (PDF p. 8), which reports it falling across self-play iterations.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [KL penalty](#/glossary/kl-penalty)


<a id="policy-gradient"></a>

## Policy gradient

A family of RL methods, [PPO](#/glossary/ppo) and [GRPO](#/glossary/grpo) among them, that train the policy directly: sample outputs, score them, and change the weights to raise the log-probability of outputs whose advantage (reward minus a baseline) is positive and lower it for the rest. One update averages advantage × gradient of the log-probability over a group of sampled responses ([Reinforcement Learning with Verifiable…](#/papers/wen2025rlvr "Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs (2025)") §4, Eq. 3, citing Sutton et al. 1999). The baseline, a value subtracted from each reward, separates better-than-usual outputs from worse ones: GRPO uses the mean of each prompt's group, REINFORCE++ one global baseline, and Absolute Zero one per task type and role ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") §3.3.5).

**Learn more:** [Reinforcement Learning with Verifiable…](#/papers/wen2025rlvr "Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs (2025)") ([PDF p. 20](https://arxiv.org/pdf/2506.14245#page=20)) §4 (Eq. 3) and App. A.7 (PDF p. 20), which lists PPO among policy-gradient approaches; [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") ([PDF p. 8](https://arxiv.org/pdf/2505.03335#page=8)) §3.3.5 (PDF p. 8); [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") §2, which calls GRPO a policy-gradient method. Sutton et al.'s paper is not listed here.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [importance ratio and clipping](#/glossary/importance-ratio-and-clipping), [online and offline RL](#/glossary/online-and-offline-rl), [value function](#/glossary/value-function)


<a id="positional-bias"></a>

## Positional bias

An LLM judge's tendency to let the order in which two answers are shown sway its verdict. The usual guard is to judge each pair twice, with the order swapped. A related bias, self-enhancement bias, is a judge favouring answers written by its own model.

**Learn more:** [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") §4 (positional bias and the swapped-order trials) and §3 (self-enhancement bias).

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [Elo rating](#/glossary/elo-rating)


<a id="post-training-quantization"></a>

## Post-training quantization

Storing an already trained model's weights (and sometimes activations) in fewer bits, e.g. 4 instead of 16, to cut memory and speed up inference, without retraining. Its cost is small numerical errors in every computation, usually measured by benchmark scores.

**Learn more:** [Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)") abstract and § "Related Work", which test the claim that 4-bit weights are "nearly lossless" on multi-turn tool-calling agents.

**Related:** [distillation](#/glossary/distillation)


<a id="ppo"></a>

## PPO

Proximal Policy Optimization, the RL algorithm that the DeepSeekMath authors describe as "widely used in the RL fine-tuning stage of LLMs" ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §4.1.1) and that GRPO modifies. Besides the model being trained, it trains a value model (critic) of similar size that estimates how good a partial output is, and uses it as a baseline when deciding how much to raise or lower each token's probability; a clipping term limits how far one update can move the model.

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 11](https://arxiv.org/pdf/2402.03300#page=11)) §4.1.1 (PDF pp. 11–13); [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") ([PDF p. 2](https://arxiv.org/pdf/2609.04697#page=2)) §2 (PDF p. 2). [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 30](https://arxiv.org/pdf/2411.15124#page=30)) §6 (PDF pp. 30–31) trains its RLVR stage with PPO.

**Related:** [GRPO](#/glossary/grpo), [reinforcement learning](#/glossary/reinforcement-learning)


<a id="premise-selection"></a>

## Premise selection

Choosing, from a large library of proven lemmas and definitions, the few likely to help prove the current goal, so that a prover or LLM can use them without seeing the whole library. LeanDojo's authors: "Premises are existing lemmas or definitions useful for proving a theorem. They are used as arguments in tactics" ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") §3); its prover retrieves 100 of the premises accessible to the theorem with a [dense retriever](#/glossary/dense-retrieval) and concatenates them with the proof state, truncated to a fixed length, as the tactic generator's input (§5). Example (§3): the tactic `rewrite mod_self` rewrites the goal with the premise `mod_self`, defined in another file.

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 5](https://arxiv.org/pdf/2306.15626#page=5)) §3 (PDF p. 5) and §5 (PDF pp. 7–8); [Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)") ([PDF p. 5](https://arxiv.org/pdf/2303.04910#page=5)) §2.3 (PDF p. 5), which calls premises "definitions and previously proven statements" and contrasts premise selection with adding the preceding lines of the theory file to the prompt, and §3.7 (PDF p. 8), where its authors hypothesize that premise selection, which Thor leaves to the [hammer](#/glossary/hammer-automated-theorem-proving) Sledgehammer, is what gives Thor its lead on mathematics proofs.

**Related:** [tactic](#/glossary/tactic), [hammer (automated theorem proving)](#/glossary/hammer-automated-theorem-proving), [proof assistant](#/glossary/proof-assistant), [dense retrieval](#/glossary/dense-retrieval), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="primary-key-foreign-key-join"></a>

## Primary key-foreign key join

A join of a table's foreign-key column with the primary key it refers to, such as each sale with its product (general definition). Each row on the foreign-key side matches at most one row on the other side, so the join never returns more rows than that side has. DSB's authors write that the joins in TPC-DS "are mostly between a primary key and a foreign key or between a primary key and another primary key", while queries in modern decision-support workloads "sometimes join tables on columns that are neither primary keys nor foreign keys, e.g., many-to-many joins" ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §1).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §1 (PDF p. 1) and §3 (PDF p. 4), whose data generator picks foreign keys in a fact table that point into two dimension tables; neither defines the term (general definition).

**Related:** [integrity constraint](#/glossary/integrity-constraint), [many-to-many relationship](#/glossary/many-to-many-relationship), [star and snowflake schemas](#/glossary/star-and-snowflake-schemas), [cardinality estimation](#/glossary/cardinality-estimation)


<a id="production-rule-rule-engine"></a>

## Production rule (rule engine)

A rule made of a condition and an action: whenever the condition holds, the action may be run ("fired"). A rule engine repeatedly finds the rules whose conditions hold and fires one of them; how it chooses among several eligible rules is its conflict-resolution scheme. Starburst's Query Rewrite expresses its rewrite heuristics as production rules, which its authors say "frees us of this burden" of fixing the order in which rules apply, and it supports two conflict-resolution schemes, one that cycles through an ordered set of rules and one that "always fires the highest order rule that has its condition satisfied" ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4, PDF pp. 8–9).

**Learn more:** [Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4 (PDF pp. 8–9).

**Related:** [forward chaining](#/glossary/forward-chaining), [phase ordering](#/glossary/phase-ordering), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="program-synthesis"></a>

## Program synthesis

Automatically constructing a program that meets a specification (input–output examples, a reference program, a logical formula) by searching a space of programs. Programming by example is the case where the specification is a set of examples.

**Learn more:** [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §1 (PDF p. 2), which synthesizes SQL queries equivalent to a slow one; [Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)") §2, for programming by example.

**Related:** [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis)


<a id="program-of-thought-and-tool-integrated-reasoning"></a>

## Program-of-thought and tool-integrated reasoning

Two ways to let an LLM compute with code while solving a problem. In program-of-thought prompting the model writes a program (in DeepSeekMath's evaluation, Python using libraries such as math and sympy), and "The execution result of the program is evaluated as the answer" ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §2.3). Tool-integrated reasoning mixes prose and code: models are allowed to "integrate natural language reasoning and program-based tool use for problem solving" (§3.2).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §2.3 and §3.2, which cite the original papers (not listed here).

**Related:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="programming-by-contract"></a>

## Programming by contract

Writing a function's assumptions and promises into the code as checked conditions: preconditions that callers must meet, postconditions the function guarantees, and invariants (general definition; also called design by contract). EvalPlus adds preconditions to HumanEval tasks as assertions such as `assert n > 0`, so that generated test inputs that break them are discarded instead of testing undefined behaviour ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") §2.3); 83 of the 164 tasks get such contracts (§3).

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.3 (PDF p. 5), citing Meyer (not listed here); it does not define the term (general definition).

**Related:** [formal specification](#/glossary/formal-specification), [property-based testing](#/glossary/property-based-testing), [Hoare triple](#/glossary/hoare-triple)


<a id="progressive-disclosure"></a>

## Progressive disclosure

How agents find their skills in the Agent Skills format: the task doesn't name the skills to use; the agent sees each skill's name and one-line description and opens the full skill when it judges it relevant. A badly worded description can leave a useful skill unread.

**Learn more:** [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)") §3, where agents "discover and activate Skills through the standard progressive-disclosure mechanism", and App. D.5 (the name and description are "used by agents for skill discovery"); Anthropic's Agent Skills documentation, which the paper cites (not listed here).

**Related:** [agent skill](#/glossary/agent-skill)


<a id="proof-assistant"></a>

## Proof assistant

Software in which definitions, theorems and proofs are written in a formal language and every proof is checked by machine; the final check is done by the tool's kernel. Examples: Coq (renamed Rocq; [Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §1), Isabelle and Lean. A proof the kernel accepts is a [certificate](#/glossary/certificate) for the theorem exactly as stated, so it is only as good as the definitions it uses, such as the [formal semantics](#/glossary/formal-semantics) of SQL.

Gotcha: a proof file can compile with steps marked as skipped (`Admitted` in Rocq; [Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §4.2, PDF p. 9, relies on Rocq accepting such lemmas), so a checker must also confirm that nothing was admitted.

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 1](https://arxiv.org/pdf/2306.15626#page=1)) §1 (PDF p. 1); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §1 (PDF p. 1); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 2](https://arxiv.org/pdf/2608.15709#page=2)) §1 (PDF p. 2), whose proofs are "checked in isolation by the Rocq kernel".

**Related:** [tactic](#/glossary/tactic), [formal semantics](#/glossary/formal-semantics), [certificate](#/glossary/certificate), [autoformalization](#/glossary/autoformalization)


<a id="property-based-testing"></a>

## Property-based testing

Testing that states a property the code must always satisfy and checks it on many random inputs, rather than on hand-picked cases; inputs that break the code's preconditions are discarded. [Disproving Program Equivalence with LLMs](#/papers/allamanis2025disproving "Disproving Program Equivalence with LLMs (2025)") §4.2 calls it "a form of fuzzing or random testing", and random differential testing one form of it.

**Learn more:** [Disproving Program Equivalence with LLMs](#/papers/allamanis2025disproving "Disproving Program Equivalence with LLMs (2025)") §4.2.

**Related:** [fuzzing](#/glossary/fuzzing), [differential testing](#/glossary/differential-testing), [metamorphic testing](#/glossary/metamorphic-testing), [test oracle](#/glossary/test-oracle)


<a id="pspace"></a>

## PSPACE

The class of yes/no problems an algorithm can solve with memory that grows at most polynomially with the input, however long it runs. It contains NP and the whole [polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), and is believed to be larger. Deciding whether a first-order query is true on a database, both given as input, is PSPACE-complete: [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") states it as "logspace complete in polynomial space" (Thm. 6, PDF p. 5), against NP-completeness for conjunctive queries (Thm. 7).

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 6 (PDF p. 5); [Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") Thm. 8.9 (PDF p. 38), which places equivalence of some aggregate queries in PSPACE (table on PDF p. 22). Neither defines the class (general definition).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [decidable and undecidable](#/glossary/decidable-and-undecidable)


<a id="letter-q"></a>

<a id="q-error"></a>

## q-error

A measure of how far an estimate is from the true value by ratio rather than difference: the larger of estimate/true and true/estimate, so 1 is a perfect estimate and 10 is off by a factor of ten in either direction (general definition). DSB uses it to score [cardinality estimates](#/glossary/cardinality-estimation) made under the assumption that columns and tables are independent, reporting percentiles of the q-errors for parts of its queries and comparing them with TPC-DS ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §6.4, Tab. 5).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §6.4 and Tab. 5 (PDF p. 9), which cites Moerkotte et al. 2009 (not listed here) without defining it (general definition).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [selectivity](#/glossary/selectivity)


<a id="query-containment"></a>

## Query containment

Q1 is contained in Q2 if, on every database, Q1's result is part of Q2's: a subset under set semantics, or a sub-bag (no row more often) under bag semantics. Two queries are equivalent exactly when each is contained in the other, so equivalence is usually studied through containment.

Example ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") Example 4.2): `Q(X) :- p(X), q(X)` is contained in `Q'(X) :- p(X)` as sets, but not as bags: if `q(a)` is stored twice and `p(a)` once, Q returns `a` twice and Q′ once.

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF pp. 1–2) and §4.1 (PDF p. 5); [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §4 (PDF pp. 8–9; Thm. 3, PDF p. 9), for unions.

**Related:** [query equivalence](#/glossary/query-equivalence), [homomorphism](#/glossary/homomorphism-containment-mapping), [bag semantics](#/glossary/bag-semantics), [set semantics](#/glossary/set-semantics)


<a id="query-equivalence"></a>

## Query equivalence

Two queries are equivalent if they return the same result on every database of the given schema. What "the same result" means depends on the semantics (as [sets](#/glossary/set-semantics), as [bags](#/glossary/bag-semantics) or as ordered [lists](#/glossary/list-semantics)), and so does which databases count: all of them, only those that satisfy the [integrity constraints](#/glossary/integrity-constraint), or, in [bounded verification](#/glossary/bounded-verification), only small ones.

Example: `SELECT name FROM Emp` and `SELECT DISTINCT name FROM Emp` are equivalent under set semantics; under bag semantics they agree only on databases where no name repeats, for example because `name` is a key.

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2), for the set-semantics definition; [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §5 (PDF p. 7), for bags; [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 11](https://arxiv.org/pdf/2403.03193#page=11)) Def. 3.5 (PDF p. 11), for the bounded version under constraints; [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF p. 1), for equivalence "without any preset bound on relation cardinality". The challenge in this repo: [Query equivalence: prove or refute](#/challenges/query_equivalence).

**Related:** [query containment](#/glossary/query-containment), [counterexample database](#/glossary/counterexample-database), [nondeterministic query](#/glossary/nondeterministic-query), [decidable and undecidable](#/glossary/decidable-and-undecidable)


<a id="query-hint"></a>

## Query hint

An instruction embedded in a query that tells the optimizer how to run it (which join algorithm, join order, index or scan method) without changing what the query computes. QUITE defines query hints as "SQL extensions that provide instructions to the database's query engine to influence the selection of execution plans" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §2.2). It uses the pg_hint_plan extension for PostgreSQL, where hints are written as comments: `/*+ HashJoin(employees departments) */` "forces the query engine to use a hash join" and "can override the optimizer's default cost-based plan selection" (§2.2). QUITE also adds a NOT_MATERIALIZE hint that inlines a [CTE](#/glossary/common-table-expression-cte) (§6.1, Tab. 3).

Sense difference: some papers use "hint" for text given to an LLM, not to the optimizer. E3-Rewrite's "execution hint" is the query's EXPLAIN plan placed before the query in the prompt ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") § "Execution Hint Injection"), and GenRewrite's natural-language rewrite rules "serve as hints for the LLM" ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)") abstract).

**Learn more:** [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") ([PDF p. 3](https://arxiv.org/pdf/2506.07675#page=3)) §2.2 (PDF p. 3) and §6.1 (PDF p. 8).

**Related:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [cost-based optimization](#/glossary/cost-based-optimization), [common table expression](#/glossary/common-table-expression-cte)


<a id="query-optimizer"></a>

## Query optimizer

The database component that turns a query into an executable [plan](#/glossary/query-plan-and-explain): it considers equivalent ways to compute the query (join orders, where to apply filters, which algorithm for each operator) and picks the one it estimates to be cheapest ([cost-based optimization](#/glossary/cost-based-optimization)).

Volcano and Cascades are Graefe's designs for extensible optimizers, built from rules plus a generic search engine: [transformation rules](#/glossary/transformation-and-implementation-rules) produce equivalent logical expressions, implementation rules map them to algorithms, and the search uses dynamic programming over a [memo](#/glossary/memo), so that no alternative is optimized twice ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2–3; [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2). Volcano first derived all logical alternatives and then chose algorithms; Cascades abolishes this "separation into two phases" and explores alternatives only on demand ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2). QO-Verify's authors state that Microsoft SQL Server's optimizer "uses the Cascades framework" ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2), and use it to prove queries equivalent.

Gotcha: an optimizer used as a prover can prove only what its rules can derive. QO-Verify "can be expected to verify equivalence only when the transformation rules required to transform Q to Q′ already exist in the optimizer" ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1), and otherwise answers Unknown.

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.1–2.2 (PDF pp. 2–3) and §3 (PDF p. 4); [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2 (PDF pp. 2–5); [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1–2 (PDF p. 2).

**Related:** [memo](#/glossary/memo), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [cost-based optimization](#/glossary/cost-based-optimization), [cardinality estimation](#/glossary/cardinality-estimation), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [logical plan](#/glossary/logical-plan), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="query-plan-and-explain"></a>

## Query plan and EXPLAIN

A query plan (execution plan, physical plan) is the tree of operations the database will actually run for a query, each with its algorithm: how each table is read (a full scan or an index), which join method is used (hash join, merge join, nested loop), and in what order. It is the [optimizer's](#/glossary/query-optimizer) output; a [logical plan](#/glossary/logical-plan) says what to compute, a physical plan how. `EXPLAIN` followed by a query prints the plan the optimizer chose, with [cost estimates](#/glossary/optimizer-cost-estimate) and estimated row counts, without running the query; in PostgreSQL `EXPLAIN ANALYZE` also runs it and reports measured times and row counts for each operator.

Example: E3-Rewrite puts such a plan, as indented text with lines like `Parallel Seq Scan on movie_info_idx mi_idx`, before the query in its model's prompt; it uses EXPLAIN ANALYZE during training and EXPLAIN at inference ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") § "Execution Hint Injection", Fig. 2). GenRewrite compares rewrites' plans obtained "via EXPLAIN (which reports the plan without executing the query)" ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)") §4.1), and analyzes bottlenecks with plans from execution history that include "actual runtime metrics (e.g., actual time, rows, loops)" (§4.2).

**Learn more:** [E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") ([PDF p. 3](https://arxiv.org/pdf/2508.09023#page=3)) § "Execution Hint Injection" (PDF pp. 3–4); [GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)") ([PDF p. 6](https://arxiv.org/pdf/2403.09060#page=6)) §4.1 (PDF p. 6) and §4.2 (PDF p. 7); [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.1 (PDF p. 2), where a plan is "a query evaluation plan consisting of algorithms". The PostgreSQL documentation, which E3-Rewrite cites, is not listed here.

**Related:** [logical plan](#/glossary/logical-plan), [query optimizer](#/glossary/query-optimizer), [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [cardinality estimation](#/glossary/cardinality-estimation), [query hint](#/glossary/query-hint)


<a id="query-rewriting-and-rewrite-rules"></a>

## Query rewriting and rewrite rules

Query rewriting replaces a query with an equivalent one that runs faster; database optimizers do it, and now LLMs are used for it too. A rewrite rule is a reusable pattern: a source template, a target template, and conditions (such as "this column is a key") under which the two are equivalent; wherever part of a query matches the source and the conditions hold, it can be replaced ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §4). A rule that is wrong in a corner case (NULLs, empty groups, duplicates) silently changes answers.

**Learn more:** [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §1 and §4 (PDF pp. 1, 4); [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.1 (PDF p. 3), for a published rewrite that returned wrong answers.

**Related:** [query equivalence](#/glossary/query-equivalence), [correlated subquery](#/glossary/correlated-subquery), [integrity constraint](#/glossary/integrity-constraint), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [cost-based optimization](#/glossary/cost-based-optimization), [phase ordering](#/glossary/phase-ordering)


<a id="letter-r"></a>

<a id="reasoning-boundary"></a>

## Reasoning boundary

In papers on RL for reasoning, the set of problems a model can solve at all when allowed many attempts, measured by [pass@k](#/glossary/passk) at large k (such as 256), as opposed to its average accuracy (pass@1). [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") reports that as RLVR training goes on, pass@1 rises while pass@256 falls, "indicating a reduction in LLM's reasoning boundary" (Fig. 1 caption); [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") reports tasks where prolonged RL training expands it (abstract, §1).

**Learn more:** [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") Fig. 1 and §2.2, which measures the "reasoning capacity boundary" with pass@k; [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") abstract.

**Related:** [pass@k](#/glossary/passk), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr), [zero-RL training](#/glossary/zero-rl-training), [perplexity](#/glossary/perplexity)


<a id="recallk-and-mean-reciprocal-rank-mrr"></a>

## Recall@k and mean reciprocal rank (MRR)

Two scores for a ranked list of retrieved items. Recall@k is the share of the relevant (gold) items that appear among the top k results. Mean reciprocal rank averages, over queries, 1 divided by the rank of the first relevant result: 1 if it comes first, ½ if second. mmGRPO scores HoVer retrieval with Recall@100, "whether the gold passages are found within the returned passages" ([mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") §5.1), and OPTIMAS scores STaRK-Prime with MRR ([Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §5).

**Learn more:** [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") §5.1; [Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §5. Neither defines them (general definitions).

**Related:** [reciprocal rank fusion (RRF)](#/glossary/reciprocal-rank-fusion-rrf), [BM25](#/glossary/bm25), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="reciprocal-rank-fusion-rrf"></a>

## Reciprocal rank fusion (RRF)

Merging several ranked lists into one by giving each item, in each list, the score 1/(α + its rank) and adding its scores across the lists (0 for a list it is missing from); items ranked high in several lists come first. R-Bot merges the results retrieved with different embeddings this way, with α = 60 by default ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §5.2.2, citing Cormack et al. 2009, not listed here).

**Learn more:** [R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §5.2.2.

**Related:** [recall@k and mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="reference-free-evaluation"></a>

## Reference-free evaluation

Judging an output without a reference answer, tests or other ground truth; for code, from the task description and the code alone. LLM judges are used in such settings "by taking only the task description and the generated code as input to determine whether the code fulfills the intended functionality" ([Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") §1).

**Learn more:** [Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") §1, which uses the term without defining it (general definition).

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [test oracle](#/glossary/test-oracle)


<a id="reflective-prompt-optimization"></a>

## Reflective prompt optimization

Improving a prompt by having an LLM read how the current prompt performed (its outputs, reasoning traces, errors and scores on some examples), diagnose in words what went wrong, and write a revised prompt, which is kept if it scores better. Only the prompt text changes, not the model's weights.

Example: GEPA runs a candidate prompt on a small batch of training examples, shows a reflection LLM the prompt, the execution trace, the score and textual feedback such as compiler errors, and asks it to "reflectively attribute successes or failures to prompt elements and propose revised instructions"; the new prompt joins the pool if it scores better on that batch ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") §3).

**Learn more:** [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") ([PDF p. 2](https://arxiv.org/pdf/2507.19457#page=2)) §1 (PDF p. 2), which presents GEPA as "a reflective prompt optimizer for compound AI systems", and §3 (PDF p. 5); [What Should the Reflector See?](#/papers/zhou2026reflector "What Should the Reflector See? An Empirical Study of Evidence in Reflective Prompt Optimization (2026)") ([PDF p. 1](https://arxiv.org/pdf/2609.32452#page=1)) (abstract, PDF p. 1), a study of which evidence the reflecting LLM should see.

**Related:** [Pareto front](#/glossary/pareto-front), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="regression-testing"></a>

## Regression testing

Re-running tests on a new version of a system to catch behaviour that changed from the previous version. RAGS compares the reports of its runs of random SQL statements, and "The comparison can be between different vendors or different versions of the same system (regression testing)" ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2, PDF p. 2).

**Learn more:** [Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2 (PDF p. 2).

**Related:** [differential testing](#/glossary/differential-testing), [fuzzing](#/glossary/fuzzing), [test oracle](#/glossary/test-oracle)


<a id="reinforcement-learning"></a>

## Reinforcement learning

Training by trial and reward instead of from correct examples. The model being trained is the **policy**; it produces **rollouts** (sampled outputs, for an LLM whole responses to a prompt); a **reward** scores each rollout; and each update makes high-reward outputs more likely. For LLMs it usually follows supervised fine-tuning, and the reward comes from a learned reward model or from rules such as checking the final answer ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") App. A.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 13](https://arxiv.org/pdf/2501.12948#page=13)) App. A.2 (PDF p. 13) and §2.1 (PDF pp. 2–3); [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 11](https://arxiv.org/pdf/2402.03300#page=11)) §4.1.1 (PDF p. 11).

**Related:** [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [reward hacking](#/glossary/reward-hacking), [self-play](#/glossary/self-play), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward shaping](#/glossary/reward-shaping), [Markov decision process](#/glossary/markov-decision-process), [expert iteration](#/glossary/expert-iteration), [curriculum learning](#/glossary/curriculum-learning), [cold start](#/glossary/cold-start)


<a id="reinforcement-learning-from-human-feedback-rlhf"></a>

## Reinforcement learning from human feedback (RLHF)

Fine-tuning an LLM towards what people prefer, in two stages: train a [reward model](#/glossary/reward-model) on human judgments of responses, then train the LLM with [reinforcement learning](#/glossary/reinforcement-learning), for example [PPO](#/glossary/ppo), to produce responses that the reward model scores highly. BPO's authors describe "the standard framework" as consisting "of reward modeling and policy training", applied after supervised fine-tuning ([BPO](#/papers/cheng2023bpo "Black-Box Prompt Optimization: Aligning Large Language Models without Model Training (2024)") §2). RLAIF uses an AI's feedback instead of people's, and [DPO](#/glossary/direct-preference-optimization-dpo) learns from the preference pairs without a separate reward model.

**Learn more:** [BPO](#/papers/cheng2023bpo "Black-Box Prompt Optimization: Aligning Large Language Models without Model Training (2024)") ([PDF p. 3](https://arxiv.org/pdf/2311.04155#page=3)) §2 (PDF p. 3), citing Stiennon et al. 2020 and Ouyang et al. 2022 (not listed here).

**Related:** [reward model](#/glossary/reward-model), [PPO](#/glossary/ppo), [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo), [KL penalty](#/glossary/kl-penalty), [reward hacking](#/glossary/reward-hacking)


<a id="rejection-sampling"></a>

## Rejection sampling

In the LLM papers here: sample several outputs for each prompt, check each one (the final answer is correct, a verifier accepts it, a format or length rule holds), keep those that pass and discard the rest. The kept outputs usually become fine-tuning data ("rejection sampling fine-tuning", RFT); at inference time the same loop returns an output that passes. The name comes from a statistics method that draws exact samples from a target distribution by accepting or rejecting proposals with computed probabilities; the LLM usage keeps only the accept-or-reject idea.

Examples: DeepSeekMath defines RFT as fine-tuning "on the filtered outputs sampled from the SFT model", filtered "based on the correctness of their answers" ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §5.2.1); DeepSeek-R1 samples multiple responses per prompt and retains "only the correct ones" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") App. B.3.3). Other papers mean something else. Tülu 3's authors, who tried it with little gain, describe a reward model or LLM judge ranking n responses so that "the best response is kept" ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") §8.2), which is [best-of-N](#/glossary/best-of-n-sampling) used to make data. s1's "rejection sampling" is sampling "until the generation fits a specific length" ([s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)") §5.2).

Gotcha: the data is only as good as the check. [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") argues that verifiers that accept some wrong outputs, such as unit tests with limited coverage, let mislabeled examples into datasets "curated through rejection sampling" (§6).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 19](https://arxiv.org/pdf/2402.03300#page=19)) §5.2.1 (PDF p. 19); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 26](https://arxiv.org/pdf/2501.12948#page=26)) App. B.3.3 (PDF p. 26); [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 48](https://arxiv.org/pdf/2411.15124#page=48)) §8.2 (PDF p. 48); [s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)") ([PDF p. 8](https://arxiv.org/pdf/2501.19393#page=8)) §5.2 (PDF p. 8); [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") ([PDF p. 9](https://arxiv.org/pdf/2411.17501#page=9)) §6 (PDF p. 9).

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [expert iteration](#/glossary/expert-iteration), [distillation](#/glossary/distillation), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [cold start](#/glossary/cold-start)


<a id="relational-algebra"></a>

## Relational algebra

A small set of operators on tables (filter rows, compute or keep columns, cross product or join, union, intersection, difference, duplicate removal) that SQL queries can be translated into. A query plan is a tree of such operators.

**Learn more:** [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") §3.1 and Fig. 2 (PDF pp. 7–8), which translates SQL into a core relational algebra before typechecking.

**Related:** [logical plan](#/glossary/logical-plan), [formal semantics](#/glossary/formal-semantics), [bag semantics](#/glossary/bag-semantics)


<a id="relational-calculus"></a>

## Relational calculus

A declarative query language in which a query describes its result with a formula of [first-order logic](#/glossary/first-order-logic) over the tables ("names of employees for whom there exists a department such that …"), without saying how to compute it. Codd proved it has the same [expressive power](#/glossary/expressive-power) as [relational algebra](#/glossary/relational-algebra); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.1 describes it as "formulas of first-order logic on database instances", and [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §5 calls it "the basic declarative query language" and notes that the core of SQL is based on it (PDF p. 7).

**Learn more:** [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") §5 (PDF p. 7); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.1. Codd's papers are not listed here.

**Related:** [relational algebra](#/glossary/relational-algebra), [first-order logic](#/glossary/first-order-logic), [expressive power](#/glossary/expressive-power), [language-integrated query](#/glossary/language-integrated-query)


<a id="reranking"></a>

## Reranking

Choosing the final output from several sampled candidates by scoring them, with a trained model, a verifier, or agreement among the candidates' execution results, instead of taking the first sample. For code generation, [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") §2 describes one line of work that picks the program with the most frequent execution result and others that "design reranking schemes"; it compares Self-Debugging with such "code reranking baselines" (§5).

**Learn more:** [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") ([PDF p. 7](https://arxiv.org/pdf/2304.05128#page=7)) §2 and §5 (PDF p. 7).

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [reward model](#/glossary/reward-model)


<a id="retrieval-augmented-generation-rag"></a>

## Retrieval-augmented generation (RAG)

A pipeline that retrieves passages relevant to a question from a corpus and gives them to the LLM as context for its answer. R-Bot's authors describe it as "indexing task-specific knowledge, retrieving relevant content for a given query, and generating answers based on the retrieved context" ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §2.2). Multi-hop pipelines retrieve in several rounds, each with a new query based on what was found ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7).

**Learn more:** [R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §2.2; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §3.2 and §7; [LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §2.1. The original RAG paper is not listed here.

**Related:** [BM25](#/glossary/bm25), [multi-hop question answering](#/glossary/multi-hop-question-answering), [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [reciprocal rank fusion (RRF)](#/glossary/reciprocal-rank-fusion-rrf)


<a id="reward-hacking"></a>

## Reward hacking

The policy raises its reward by exploiting flaws in how the reward is computed instead of doing the task better. The DeepSeek-R1 authors avoid learned reward models for reasoning tasks because they are "susceptible to reward hacking", and warn that with a model-assigned reward "the policy model may find shortcuts to hack the reward model" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") §2.2, §6). A rule-based check can be gamed too if it accepts wrong answers, e.g. a reward that only compares results on one test database.

**Learn more:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation) (the home of this challenge); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") ([PDF p. 4](https://arxiv.org/pdf/2501.12948#page=4)) §2.2 (PDF p. 4) and §6 (PDF p. 11).

**Related:** [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [execution accuracy](#/glossary/execution-accuracy), [soundness and completeness](#/glossary/soundness-and-completeness), [reward shaping](#/glossary/reward-shaping), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="reward-model"></a>

## Reward model

A model trained to score responses, often from human preference comparisons, and used as the reward in RL fine-tuning or to pick the best of several samples. Unlike an exact check, its scores can be wrong, and a policy optimized against it can learn to exploit its errors.

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") (abstract, §1), which says "a significant performance gap remains" between LM judges or reward models and oracle verifiers; [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") §4.3, which compares its benchmark with RewardBench, a benchmark for reward models.

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward hacking](#/glossary/reward-hacking), [best-of-N sampling](#/glossary/best-of-n-sampling), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="reward-shaping"></a>

## Reward shaping

Changing a task's basic reward (say, 1 if the answer is right and 0 if not) to steer what reinforcement learning learns: partial credit, penalties for unwanted behaviour, or bonuses for good intermediate steps. The policy learns whatever the shaped reward pays for, so a badly chosen term can be exploited ([reward hacking](#/glossary/reward-hacking)).

Example: ReViSQL's reward gives 0 when the query's result differs from the gold query's; 1 when it matches and an equivalence checker (VeriEQL) confirms equivalence, times out or can't handle the query; and 1 − β when it matches but the checker refutes equivalence (β = 0.2 in its runs, §4.3). It then subtracts penalties when the reasoning skips required checks of the question's evidence ([ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") §4.2). Not every attempt pays off: the authors of [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") report that a "preliminary investigation using reward shaping did not yield any significant improvements" (§3).

**Learn more:** [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") ([PDF p. 8](https://arxiv.org/pdf/2603.20004#page=8)) §4.2 (PDF pp. 8–9); [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") ([PDF p. 4](https://arxiv.org/pdf/2509.21459#page=4)) §3 (PDF p. 4). No paper on this site defines the general term (general definition).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward hacking](#/glossary/reward-hacking), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [curriculum learning](#/glossary/curriculum-learning)


<a id="reward-tampering"></a>

## Reward tampering

An agent corrupting the mechanism that produces its own reward or feedback instead of doing the task, as a coding agent would by editing the tests or the checker (general usage). [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") describes the concern as RL agents that "corrupt their feedback mechanisms in order to receive positive feedback", with the hypothetical example of an assistant that steers users towards preferences that are easier to satisfy, and argues that process-based supervision avoids incentives for it (§4.1.3, PDF p. 12). Compare [reward hacking](#/glossary/reward-hacking), which exploits flaws in how the reward is computed; the cited source doesn't relate the two.

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 12](https://arxiv.org/pdf/2211.14275#page=12)) §4.1.3 (PDF p. 12), citing Everitt et al. (2017, not listed here).

**Related:** [reward hacking](#/glossary/reward-hacking), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [monitor (AI control)](#/glossary/monitor-ai-control)


<a id="rl-with-verifiable-rewards-rlvr"></a>

## RL with verifiable rewards (RLVR)

Reinforcement learning in which the reward comes from a program that checks the answer (answer matching, running tests, a proof checker) instead of a learned reward model: the policy is rewarded only when its output is verified correct. [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") names the method.

**Learn more:** RL with verifiable rewards (RLVR / GRPO) (the home of this technique: how it works, limits, uses in SQL); [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 30](https://arxiv.org/pdf/2411.15124#page=30)) §6 (PDF p. 30).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [GRPO](#/glossary/grpo), [reward hacking](#/glossary/reward-hacking), [certificate](#/glossary/certificate), [outcome and process rewards](#/glossary/outcome-and-process-rewards)


<a id="letter-s"></a>

<a id="sat-and-smt-solvers"></a>

## SAT and SMT solvers

A SAT solver decides whether a formula of true/false variables joined by AND, OR and NOT can be made true, and if so returns values that make it true. An SMT (satisfiability modulo theories) solver does the same for formulas that also talk about integers, strings, functions and other "theories" with fixed meanings; Z3 and cvc5 are examples. SQL checkers such as VeriEQL encode "the two queries give different results on some database" as an SMT formula: a satisfying assignment decodes to a counterexample database, and "unsatisfiable" means no counterexample exists within what the encoding covers ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §2).

**Learn more:** [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 3](https://arxiv.org/pdf/2405.03057#page=3)) §1.2 (PDF p. 3), for theories and satisfiability; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF pp. 2–3); [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 3](https://arxiv.org/pdf/2403.03193#page=3)) §1 (PDF p. 3).

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [bounded verification](#/glossary/bounded-verification), [uninterpreted function](#/glossary/uninterpreted-function), [unsat core](#/glossary/unsat-core)


<a id="satisfiable-and-valid"></a>

## Satisfiable and valid

A formula is satisfiable if at least one assignment of values to its variables makes it true, unsatisfiable if none does, and valid if every assignment does. So a formula is valid exactly when its negation is unsatisfiable, which is how solvers prove things: to show that two queries always agree, ask whether "they disagree" is satisfiable.

Example: `x > 3 ∧ x < 5` is satisfiable (x = 4); `x > 3 ∧ x < 2` is unsatisfiable; `x > 3 ∨ x ≤ 3` is valid.

**Learn more:** [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 3](https://arxiv.org/pdf/2405.03057#page=3)) §1.2 (PDF p. 3), which defines satisfiable and unsatisfiable relative to a theory ("valid" is the standard term, a general definition; no paper on this site defines it); [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 3](https://arxiv.org/pdf/2403.03193#page=3)) §1 (PDF p. 3), for how an equivalence checker reads the two outcomes.

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [unsat core](#/glossary/unsat-core), [first-order logic](#/glossary/first-order-logic)


<a id="scalar-subquery"></a>

## Scalar subquery

A subquery that returns a single value and is used where a value is expected, e.g. `WHERE (SELECT COUNT(*) FROM t1 WHERE …) > 2`. If it returns more than one row, most database systems raise an error.

**Learn more:** [GRewriter](#/papers/jiang2025grewriter "GRewriter: Practical Query Rewriting with Automatic Rule Set Expansion in GaussDB (2025)") Tab. 1 (PDF p. 3) and §8.2 (PDF p. 9).

**Related:** [correlated subquery](#/glossary/correlated-subquery), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="scaling-law"></a>

## Scaling law

A fitted formula, usually a power law, that predicts how a model's performance changes with a resource such as training compute, data or model size.

**Learn more:** [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") ([PDF p. 7](https://arxiv.org/pdf/2407.21787#page=7)) §3 and §3.1 (PDF pp. 7–8); the training scaling-law papers it cites are not listed here.

**Related:** [test-time scaling](#/glossary/test-time-scaling), [pass@k](#/glossary/passk)


<a id="schema-linking"></a>

## Schema linking

In [text-to-SQL](#/glossary/text-to-sql), working out which tables, columns and values of the database the words of a question refer to, e.g. that "customers in Ohio" means a condition on the customer table's state column. A query can be valid SQL and still be wrong because it used the wrong column.

**Learn more:** [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") §6.6, which reports that ChatGPT "erroneously associates" questions with inappropriate columns and tables and that schema linking "continues to be a significant obstacle for models". The papers that introduced the term are not listed here.

**Related:** [text-to-SQL](#/glossary/text-to-sql), [execution accuracy](#/glossary/execution-accuracy)


<a id="select-project-join-spj-query"></a>

## Select-project-join (SPJ) query

A query built only from selections (filters on rows), projections (keeping some columns) and joins: in SQL, a single `SELECT … FROM … WHERE` block without grouping, aggregates, `UNION` or subqueries (general definition). With only equality conditions it is what database theory calls a [conjunctive query](#/glossary/conjunctive-query). Balsa "currently optimizes select-project-join (SPJ) blocks", in line with the classical treatment (System R) of "decomposing a query into simple SPJ blocks and optimizing them block-by-block" ([Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") §2). DSB adds single-block SPJ queries derived from its templates for evaluating techniques such as join ordering ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §4.5).

**Learn more:** [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 3](https://arxiv.org/pdf/2201.01441#page=3)) §2 (PDF p. 3); [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §4.5 (PDF p. 5) and §2 (PDF p. 2). Neither defines the term (general definition).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [tableau](#/glossary/tableau), [relational algebra](#/glossary/relational-algebra), [left-deep and bushy plans](#/glossary/left-deep-and-bushy-plans), [query optimizer](#/glossary/query-optimizer)


<a id="selective-prediction"></a>

## Selective prediction

Letting a model abstain on the inputs it is least sure of and measuring its error only on the rest. [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") abstains when the reward model's score of the selected answer falls below a threshold, and reports a final-answer error of 2.7% when the model may abstain on 30% of questions (§3.4, §1).

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 10](https://arxiv.org/pdf/2211.14275#page=10)) §3.4 (PDF p. 10).

**Related:** [reward model](#/glossary/reward-model), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="selectivity"></a>

## Selectivity

The fraction of rows that satisfy a condition: a filter that keeps 5 of 100 rows has selectivity 0.05. Multiplied by the number of input rows it gives the [cardinality estimate](#/glossary/cardinality-estimation) of the filter's output; optimizers estimate it from column statistics.

Gotcha: "high" and "low" selectivity are used both ways. QUITE calls a join that cuts 10 M rows to about 100 K "highly selective", meaning it keeps few rows ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §1). LITHE gives selectivities as fractions in its prompts (0.7385 in its Rule 5 example, App. D) and advises EXISTS "for high selectivity values and IN for low values" ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §4.2), where, judging by its App. D example (a selectivity of 0.7385 leads to EXISTS), high means many rows pass (our reading; LITHE doesn't say). D example.

**Learn more:** [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 9](https://arxiv.org/pdf/2502.12918#page=9)) §4.2 (PDF p. 9) and App. D (PDF p. 37); [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") ([PDF p. 2](https://arxiv.org/pdf/2506.07675#page=2)) §1 (PDF p. 2). No paper on this site defines the term (general definition).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [cost-based optimization](#/glossary/cost-based-optimization)


<a id="self-consistency-majority-voting"></a>

## Self-consistency (majority voting)

Sample several answers to the same question (with chain of thought, at a temperature above zero) and return the answer that comes up most often. It needs a way to tell when two answers are the same: its authors say it "can be applied only to problems where the final answer is from a fixed answer set" ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") §2). For SQL, candidate queries are grouped by their execution results.

Example: ReViSQL samples n candidate queries, groups them by execution result, and returns a random query from the largest group, which its authors call "the standard procedure used in prior work" ([ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") §5.2).

**Learn more:** [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") ([PDF p. 3](https://arxiv.org/pdf/2203.11171#page=3)) §2 (PDF pp. 3–4), which introduces it as a decoding strategy that takes "a majority vote" over the sampled answers; [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") ([PDF p. 10](https://arxiv.org/pdf/2603.20004#page=10)) §5.2 (PDF p. 10).

**Related:** [pass@k](#/glossary/passk), [execution accuracy](#/glossary/execution-accuracy), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="self-correction"></a>

## Self-correction

Having an LLM revise its own output, usually after feedback such as an error message, an execution result or its own critique, in one or more rounds. In text-to-SQL, [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") names self-correction and self-consistency as "the most prevalent" [test-time scaling](#/glossary/test-time-scaling) strategies (§1).

**Learn more:** [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") §1, which uses the term without defining it (general definition).

**Related:** [test-time scaling](#/glossary/test-time-scaling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [automated program repair](#/glossary/automated-program-repair), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="self-information"></a>

## Self-information

How surprising an outcome is under a probability model: an outcome with probability p carries −log p of information, so a rare outcome carries much and a near-certain one almost none (general definition). Prompt compressors use a language model's token probabilities this way. Selective Context, as [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") describes it, computes each token's self-information from next-token probabilities, averages it over phrases or sentences, and filters out the least informative ones (§4.2.1).

**Learn more:** [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") ([PDF p. 19](https://arxiv.org/pdf/2404.01077#page=19)) §4.2.1 (PDF p. 19), citing Shannon 1948 (not listed here), without defining it (general definition).

**Related:** [perplexity](#/glossary/perplexity), [KL divergence](#/glossary/kl-divergence), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl)


<a id="self-play"></a>

## Self-play

Training in which a model learns by playing against copies of itself rather than from fixed human data; [SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)") §2 (PDF p. 3) describes it as learning "by competing against itself". The form most used here is proposer–solver self-play: one role writes tasks that the current solver solves only sometimes, a checker validates the tasks and the answers, and the solver (sometimes the proposer too) trains on what passes. SQL-Zero is an example in text-to-SQL, with tasks checked by running SQL ([SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") §1).

**Learn more:** Proposer–solver self-play (the home of this technique: variants and examples).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [reward hacking](#/glossary/reward-hacking), [expert iteration](#/glossary/expert-iteration)


<a id="semantic-parsing"></a>

## Semantic parsing

Translating natural-language sentences into a formal, executable representation, such as a logical form, a domain-specific language or SQL; [text-to-SQL](#/glossary/text-to-sql) is a kind of semantic parsing. AMBROSIA defines it as translating "natural language utterances to logical forms or executable programs in some machine-readable language (e.g., SQL)" ([AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") §1).

**Learn more:** [AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") §1; [SAMMO](#/papers/schnabel2024sammo "Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization (2024)") §5.2, for a domain-specific-language target; [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 8](https://arxiv.org/pdf/2305.03111#page=8)) §6.4 (PDF p. 8), which calls converting questions into SQL queries the semantic-parsing sub-stage.

**Related:** [text-to-SQL](#/glossary/text-to-sql)


<a id="semantic-query-optimization"></a>

## Semantic query optimization

Optimizing a query with facts known to hold in every legal database of the schema, such as keys, foreign keys and other [integrity constraints](#/glossary/integrity-constraint): the rewritten query is equivalent to the original on databases that satisfy the constraints, though not necessarily on all databases. Example: with `id` a key of `Emp`, `SELECT DISTINCT id FROM Emp` can drop its `DISTINCT`. The chase and backchase algorithm "guarantees to find a minimal semantic equivalent query for conjunctive queries under constraints" ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §7).

**Learn more:** [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") ([PDF p. 12](https://arxiv.org/pdf/1802.02229#page=12)) §7 (PDF p. 12); [A logic for rule-based…](#/papers/coburn1993logic "A logic for rule-based query optimization in graph-based data models (1993)") abstract (PDF p. 1). Both use the term without defining it (general definition).

**Related:** [integrity constraint](#/glossary/integrity-constraint), [chase](#/glossary/chase), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="semijoin-and-anti-semijoin"></a>

## Semijoin and anti-semijoin

Two join variants that filter one table by another. The semijoin of R with S keeps each row of R that has at least one matching row in S, as often as it occurs in R (several matches add no copies), and adds no columns from S; the anti-semijoin keeps the rows of R that have no match in S. `EXISTS` and `NOT EXISTS` subqueries can be rewritten into them.

Example ([Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") §6.2): `SELECT R.A, R.B FROM R WHERE EXISTS (SELECT S.A FROM S WHERE S.B = R.A)` becomes a semijoin of R with S on `S.B = R.A`, and the same query with `NOT EXISTS` becomes an anti-semijoin.

Gotcha: `x NOT IN (subquery)` is not the same as `NOT EXISTS` once NULLs appear: if the subquery returns a NULL, `NOT IN` is never true, while the anti-semijoin still keeps rows with no match.

**Learn more:** [Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") ([PDF p. 5](https://arxiv.org/pdf/2409.18821#page=5)) §4.1 (PDF pp. 5–6), on how many copies of each row the result has, and §6.2 (PDF pp. 10–11).

**Related:** [correlated subquery](#/glossary/correlated-subquery), [logical plan](#/glossary/logical-plan), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="set-cover-problem"></a>

## Set cover problem

Given a collection of sets, find the fewest of them that together contain every element any of them contains (general definition). It is NP-hard, so it is usually solved approximately by the greedy algorithm, which repeatedly takes the set that covers the most still-uncovered elements (general definition); EvalPlus runs such a greedy set cover algorithm ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") §1). Its [test-suite reduction](#/glossary/test-suite-reduction) is a set cover problem: each test is the set of testing requirements it meets, and the reduced suite must still meet them all (§2.2).

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5), which says finding a minimal representative subset "is equivalent to the set covering problem", citing Feige 1998 (not listed here); it does not define the problem (general definition).

**Related:** [test-suite reduction](#/glossary/test-suite-reduction), [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy)


<a id="set-semantics"></a>

## Set semantics

Tables and query results are sets: a row is either present or not, and how often it would appear doesn't matter. It matches SQL with `DISTINCT` everywhere. Classic database theory assumes it ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 says this research "almost invariably" did), while SQL keeps duplicates by default.

In SQL-checking and benchmark papers the term often means only that results are compared as sets; BIRD's scorer is an example ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") App. B.7).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF p. 1); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2), where a query's result is defined as a set.

**Related:** [bag semantics](#/glossary/bag-semantics), [bag-set semantics](#/glossary/bag-set-semantics), [query equivalence](#/glossary/query-equivalence)


<a id="sign-test"></a>

## Sign test

A test of whether one system beats another more often than chance, using only the cases where they disagree: if neither is better, each wins half of those, so the number of wins follows a binomial distribution with p = ½. It makes no assumption about the size of score differences.

**Learn more:** [Skill Issue](#/papers/kozyrev2026skillissue "Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents (2026)") §4.2; [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") §2.2 and Eq. 3, an exact one-sided paired sign test used as an acceptance gate.

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [multiple testing](#/glossary/multiple-testing), [statistical power](#/glossary/statistical-power)


<a id="small-counterexample-property"></a>

## Small counterexample property

A class of queries has it if any two inequivalent queries in the class already differ on a small database, about the size of the queries: [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") §2.3 states it as a database with as many rows as the queries have atoms. Then a bounded search up to that size decides equivalence instead of only refuting it. [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") §1 calls such a bound a "completeness threshold".

Example: the two queries of [combined semantics](#/glossary/combined-semantics)'s example ([Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") Example 1) agree on every one-row table and differ only when two VIP customers share a name, so a size bound of one row fails for them.

**Learn more:** [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") §2.3 (PDF p. 4); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 1](https://arxiv.org/pdf/2609.09978#page=1)) §1 (PDF pp. 1–2).

**Related:** [bounded verification](#/glossary/bounded-verification), [counterexample database](#/glossary/counterexample-database), [combined semantics](#/glossary/combined-semantics), [small-scope hypothesis](#/glossary/small-scope-hypothesis)


<a id="small-scope-hypothesis"></a>

## Small-scope hypothesis

The working assumption that if a query or program is wrong, some small input already shows it, so checking all small inputs catches most errors. It is a bet about typical cases, not a theorem; compare the [small counterexample property](#/glossary/small-counterexample-property), which is proved for a class of queries. It is what makes [bounded verification](#/glossary/bounded-verification) useful in practice.

Example: VeriEQL's authors write that their evaluation "echos the small-scope hypothesis discussed in prior work": "mistakes in most of the queries may be explained by only a small number of tuples" ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §6.2). They name what can break it, `LIMIT` and "aggregation function COUNT with a large constant", and found two benchmarks that needed a relation with more than 1000 rows to show the queries differ, both with a clause like `COUNT(a) > 1000` (§6.2).

The prior work is RATest, which writes that "the mistakes in most of the queries can be explained with only a small number of tuples" ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §1) but doesn't use the name; VeriEQL's quotation is close to this wording but not exact.

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 23](https://arxiv.org/pdf/2403.03193#page=23)) §6.2 (PDF p. 23); [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") ([PDF p. 1](https://arxiv.org/pdf/1904.04467#page=1)) §1 (PDF p. 1). Where the name comes from is not listed here.

**Related:** [small counterexample property](#/glossary/small-counterexample-property), [bounded verification](#/glossary/bounded-verification), [counterexample database](#/glossary/counterexample-database), [data provenance](#/glossary/data-provenance)


<a id="soundness-and-completeness"></a>

## Soundness and completeness

A checker is sound if everything it accepts is truly correct, and complete if it accepts everything that is correct. For an equivalence checker, say which verdict is meant: a refuter is sound if every counterexample it returns is genuine; a prover is sound if every pair it calls equivalent is equivalent, and complete if it can prove every equivalent pair.

Example: a test suite used as a checker is unsound, since a wrong program can pass every test ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. F).

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 15](https://arxiv.org/pdf/2512.18160#page=15)) App. F (PDF p. 15). The challenge in this repo: [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness).

**Related:** [decidable and undecidable](#/glossary/decidable-and-undecidable), [spurious counterexample](#/glossary/spurious-counterexample), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation), [test oracle](#/glossary/test-oracle), [formal specification](#/glossary/formal-specification)


<a id="spearmans-rank-correlation"></a>

## Spearman's rank correlation

A number from −1 to +1 for how well two rankings of the same items agree: the ordinary (Pearson) correlation computed on ranks instead of values. Papers use it to ask whether a change to a benchmark reorders the systems it ranks.

**Learn more:** [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)") §1 and §5.2, on agent rankings before and after correcting annotation errors; [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)") §1.

**Related:** [Cohen's kappa](#/glossary/cohens-kappa), [Elo rating](#/glossary/elo-rating)


<a id="spurious-counterexample"></a>

## Spurious counterexample

A reported counterexample that does not really show the queries differ: the database breaks an integrity constraint, the two queries in fact return the same result on it, or it exists only because the checker models SQL more loosely than SQL behaves (an over-approximation). VeriEQL's authors call a counterexample genuine if it satisfies the integrity constraints and the two queries yield different outputs on it ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §6.3). For [nondeterministic queries](#/glossary/nondeterministic-query), two runs can differ without the queries being inequivalent.

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 23](https://arxiv.org/pdf/2403.03193#page=23)) §6.3 (PDF p. 23); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF p. 1).

**Related:** [counterexample database](#/glossary/counterexample-database), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation), [integrity constraint](#/glossary/integrity-constraint)


<a id="sql-dialect"></a>

## SQL dialect

The version of SQL that one database system accepts. Each vendor implements part of the SQL standard and adds its own syntax, functions and semantics, so a query written for one system may fail on another, or run and mean something else. RISE's authors: database systems "incorporate vendor-specific extensions and unique nuances, resulting in a wide variety of SQL dialects", which "introduces both syntax and semantic discrepancies" ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") §1).

Example: limiting a result to ten rows is `LIMIT 10` in PostgreSQL, MySQL and SQLite but `SELECT TOP 10 …` in Microsoft SQL Server's T-SQL.

Translating between dialects is the task of [RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") and [PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)") (queries) and of [Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") and [AgentMigrate](#/papers/yu2026agentmigrate "Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation (2026)") (database migration).

**Related:** [stored procedure and trigger](#/glossary/stored-procedure-and-trigger), [query equivalence](#/glossary/query-equivalence), [text-to-SQL](#/glossary/text-to-sql)


<a id="sql-standard"></a>

## SQL standard

The official specification of SQL, published by ANSI and ISO and revised several times; SQL-92 is the 1992 edition. Database systems implement parts of it and add their own extensions, which gives each system its [SQL dialect](#/glossary/sql-dialect) (general definition). The HoTTSQL authors note that the standard "is loosely described in English and leads to conflicting interpretations" ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.2). DLBench treats SQL-92 as "a common baseline": it drops the statements that an SQL-92 parser accepts, so that its translation tasks stay dialect-specific ([DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §III-A).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 11](https://arxiv.org/pdf/1607.04822#page=11)) §6.2 (PDF p. 11); [DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §III-A (PDF p. 4). Neither defines the standard (general definition).

**Related:** [SQL dialect](#/glossary/sql-dialect), [SQL statement categories (DDL, DML, DQL, DCL, TCL)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl), [formal semantics](#/glossary/formal-semantics)


<a id="sql-statement-categories-ddl-dml-dql-dcl-tcl"></a>

## SQL statement categories (DDL, DML, DQL, DCL, TCL)

A grouping of SQL statements by what they act on: DQL (data query language) reads data (`SELECT`); DML (data manipulation language) changes rows (`INSERT`, `UPDATE`, `DELETE`); DDL (data definition language) changes the schema (`CREATE`, `ALTER`, `DROP`); DCL (data control language) manages permissions (`GRANT`, `REVOKE`); and TCL (transaction control language) manages transactions (`COMMIT`, `ROLLBACK`) (general definition). Some authors count `SELECT` as DML. DLBench sorts the statements of its ButterTrans dataset into these categories and finds DQL the most common, followed by DDL and DML ([DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §III-B, Fig. 4).

**Related:** [SQL standard](#/glossary/sql-standard), [SQL dialect](#/glossary/sql-dialect), [stored procedure and trigger](#/glossary/stored-procedure-and-trigger)


<a id="star-and-snowflake-schemas"></a>

## Star and snowflake schemas

Layouts for a data warehouse. A large fact table records events, such as one row per sale, with foreign keys into smaller dimension tables that describe them (product, store, customer, date). In a star schema each dimension is a single table joined directly to the fact table; in a snowflake schema dimension tables are split further into tables that point to other tables, such as a product table pointing to a category table (general definition). TPC-DS, on which DSB builds, "consists of multiple snowflake schemas with shared dimension tables" ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §2).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §2 (PDF p. 2) and §3 (PDF p. 4), whose correlation algorithm for a fact table and two dimension tables "can be further extended" to "a fact table and chains of dimension tables with PKFK joins, i.e., snowflake queries"; neither defines the terms (general definition).

**Related:** [primary key-foreign key join](#/glossary/primary-key-foreign-key-join), [OLAP and OLTP](#/glossary/olap-and-oltp), [normalized schema](#/glossary/normalized-schema)


<a id="statistical-power"></a>

## Statistical power

The chance that a test detects an effect of a given size when the effect is really there. It grows with sample size. An underpowered test can miss real effects, so a null result from it says little. A power analysis fixes the sample size, or the smallest detectable effect, in advance.

**Learn more:** [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)") §4.7, which gives a minimum detectable slope at 80% power.

**Related:** [multiple testing](#/glossary/multiple-testing), [equivalence test (TOST)](#/glossary/equivalence-test-tost), [sign test](#/glossary/sign-test)


<a id="stored-procedure-and-trigger"></a>

## Stored procedure and trigger

A stored procedure is a named program kept in the database and run by calling it. It is written in the system's procedural SQL language (Oracle's PL/SQL, SQL Server's T-SQL, PostgreSQL's PL/pgSQL), which wraps SQL statements in variables, `IF`/`WHILE`/`FOR` control flow and exception handling. A trigger is such code that the database runs by itself when a given event happens, such as an `INSERT` into a table. Both can change the stored data (side effects), so checking a translated version means comparing database states, not only query results.

Example: the SQLProcBench procedures that RISE translates "exhibit complex control flows (e.g., IF-ELSE conditions, WHILE and FOR loops), individual SQL statements (e.g., SELECT, UPDATE, DELETE), variable management" ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") §2.1.1). AgentMigrate's author calls procedural code ("stored procedures, functions, triggers, and packages that embed business logic, transaction semantics, and exception handling") "the hard part" of database migration ([AgentMigrate](#/papers/yu2026agentmigrate "Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation (2026)") §1). Horizon's execution-based checks cover queries, views and functions but leave procedures and triggers out, because verifying them through execution "is tricky as they can have side effects like updating the database state" ([Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §2.2).

**Learn more:** [AgentMigrate](#/papers/yu2026agentmigrate "Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation (2026)") §1 (PDF p. 1); [RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") ([PDF p. 2](https://arxiv.org/pdf/2601.05579#page=2)) §2.1.1 (PDF p. 2); [Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §2.2 (PDF p. 3).

**Related:** [SQL dialect](#/glossary/sql-dialect), [test oracle](#/glossary/test-oracle)


<a id="strongest-postcondition"></a>

## Strongest postcondition

For a precondition P and a program fragment S, the strongest postcondition describes exactly the states that S can end in when started from a state satisfying P. Every other valid postcondition follows from it, so the [Hoare triple](#/glossary/hoare-triple) {P} S {Q} holds exactly when it implies Q (general definition). Example: from x > 0, the assignment x := x + 1 ends in exactly the states with x > 1. Mediator defines strongest postconditions for database updates by treating each update as an assignment to a table; deleting the rows of R that satisfy φ, for instance, becomes R := σ_{¬φ}(R) ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §6.1, Fig. 10).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 16](https://arxiv.org/pdf/1710.07660#page=16)) §6.1 and Fig. 10 (PDF p. 16), which uses the notion without defining it (general definition), whose rules for deletes and updates are unsound when the condition contains a subquery that reads the updated table.

**Related:** [Hoare triple](#/glossary/hoare-triple), [symbolic execution](#/glossary/symbolic-execution), [loop invariant](#/glossary/loop-invariant)


<a id="subquery-nested-query"></a>

## Subquery (nested query)

A complete `SELECT` query used inside another query: in `WHERE` or `HAVING` (with `IN`, `EXISTS` or a comparison), in `FROM` as a derived table, or in the `SELECT` list (general definition). Example ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)") Fig. 1): "What are the name and budget of the departments with average instructor salary greater than the overall average?" needs one, `… GROUP BY T1.department_id HAVING avg(T1.salary) > (SELECT avg(salary) FROM instructor)`. Spider counts nested queries among the features that make a query hard (§6).

**Learn more:** [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)") ([PDF p. 1](https://arxiv.org/pdf/1809.08887#page=1)) Fig. 1 (PDF p. 1) and §6, which use the term without defining it (general definition).

**Related:** [correlated subquery](#/glossary/correlated-subquery), [scalar subquery](#/glossary/scalar-subquery), [LATERAL](#/glossary/lateral), [common table expression (CTE)](#/glossary/common-table-expression-cte), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="symbolic-execution"></a>

## Symbolic execution

Running a program or query on unknowns instead of concrete values, so that the result is a formula over those unknowns. A solver can then look for values that make the formula true. Equivalence checkers use it on two queries over a symbolic database (tables of unknown rows, up to a size bound): a solution of "the two results differ" decodes into a [counterexample database](#/glossary/counterexample-database).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 3](https://arxiv.org/pdf/2403.03193#page=3)) §1 and Fig. 1 (PDF p. 3), whose symbolic database stands for every database up to a size bound; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 3](https://arxiv.org/pdf/2510.26840#page=3)) §2 (PDF p. 3), which describes VeriEQL's encoding of "the symbolic execution of the two SQL queries", and §4.1 (PDF p. 5), which states as a theorem that SpotIt's symbolic execution matches concrete execution.

**Related:** [bounded verification](#/glossary/bounded-verification), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [counterexample database](#/glossary/counterexample-database), [concolic testing](#/glossary/concolic-testing)


<a id="symmetry-breaking"></a>

## Symmetry breaking

In constraint solving, ruling out candidate solutions that are only rearrangements of others, so that the solver explores one representative of each group of equivalent candidates instead of all of them (general definition). Example (ours): if a query's result does not depend on the order of a table's rows, a solver looking for a three-row counterexample table need not try all six orderings of the same rows; requiring the rows to be sorted keeps one. [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") notes that the equivalence checkers Qex and Cosette include symmetry-breaking modules for compiling into SMT formulas, and breaks symmetry at a higher level instead, "by identifying table equivalence given the semantics of the input queries" (§7).

**Learn more:** [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") §7 (PDF p. 21), which uses the term without defining it (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [bounded verification](#/glossary/bounded-verification), [counterexample database](#/glossary/counterexample-database), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem)


<a id="syntax-directed-translation"></a>

## Syntax-directed translation

Defining a translation from one language into another along the source language's grammar: each grammar rule gets a translation rule that builds the translation of a construct from the translations of its parts. [Formal semantics of SQL queries](#/papers/negri1991semantics "Formal semantics of SQL queries (1991)") gives SQL a formal meaning this way: each translation rule "defines that the translation TR⟨X⟩ of the nonterminal ⟨X⟩ on the LHS of the syntax rule is the concatenation of the translations TR⟨Y₁⟩ … TR⟨Yₙ⟩ with some additional E3VPC symbols interleaved", where E3VPC is the authors' extended three-valued predicate calculus (§3).

**Related:** [formal semantics](#/glossary/formal-semantics), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="letter-t"></a>

<a id="tableau"></a>

## Tableau

A table-shaped notation for a [select-project-join](#/glossary/select-project-join-spj-query) query. Its columns are the database's attributes; the top row, the summary, gives the output, and each other row is a pattern of constants, distinguished variables (which appear in the output) and nondistinguished ones (which don't). On a database it returns the summary under every assignment of constants to the variables that turns all the rows into stored tuples ([Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §2.4, PDF pp. 3–4). Tableaux are "a stylized notation for a subset of" [conjunctive queries](#/glossary/conjunctive-query) ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §1, PDF p. 1), and containment between them is tested with [homomorphisms or containment mappings](#/glossary/homomorphism-containment-mapping).

**Learn more:** [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §2.4 (PDF pp. 3–4); [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §1–4 (PDF pp. 1–11).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment), [union of conjunctive queries](#/glossary/union-of-conjunctive-queries)


<a id="tactic"></a>

## Tactic

A command in a proof assistant that turns the current proof goal into simpler subgoals, for example by splitting it, rewriting it with a known lemma, or starting an induction. A proof is a sequence of tactics applied until no goals remain, and the LeanDojo authors suggest thinking of tactics "as programs in a domain-specific language" (§3). They describe LLM-based provers as generating the next tactic from the current proof state (§1).

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 2](https://arxiv.org/pdf/2306.15626#page=2)) §1 (PDF pp. 2–3) and §3 (PDF pp. 4–5).

**Related:** [proof assistant](#/glossary/proof-assistant)


<a id="test-oracle"></a>

## Test oracle

The part of a test that decides whether an observed output is correct. The correct output is often unknown, so oracles use indirect checks: compare with another implementation ([differential testing](#/glossary/differential-testing)), compare runs on related inputs ([metamorphic testing](#/glossary/metamorphic-testing)), or check a property such as "doesn't crash". A weak oracle lets bugs through; one that compares query results on a single database, for example, passes wrong queries that happen to give the right rows there (see [execution accuracy](#/glossary/execution-accuracy)).

Argus's authors call it "a mechanism for verifying whether a system's output is correct for a given input", and in database testing usually a rewrite of a query into an equivalent one whose results are compared ([Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") §2).

Other senses: Argus also uses "test oracle" for one artifact, a proven-equivalent pair of query templates with its schema ([Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") §5.3, PDF p. 10). An "oracle verifier" in [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") §2 is one that knows the correct final answer, and Lemur's "oracle calls" are queries to an LLM that proposes properties ([Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") §3, PDF p. 3).

**Learn more:** [Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)") ([PDF p. 2](https://arxiv.org/pdf/2510.06663#page=2)) §1 (PDF p. 2), which says an oracle "can determine the correctness of a query's output without access to the ground truth", and §2 (PDF p. 5); [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §III-C (PDF pp. 5–6).

**Related:** [differential testing](#/glossary/differential-testing), [metamorphic testing](#/glossary/metamorphic-testing), [fuzzing](#/glossary/fuzzing), [soundness and completeness](#/glossary/soundness-and-completeness), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="test-suite-accuracy"></a>

## Test-suite accuracy

A [text-to-SQL](#/glossary/text-to-sql) score that counts a predicted query as correct only if it returns the same result as the [gold query](#/glossary/gold-query) on every database of a test suite. The suite is distilled "from a large number of randomly generated databases" to achieve "high code coverage for the gold query" ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") abstract), so wrong queries are likely to differ on one of them. It catches many false positives of [execution accuracy](#/glossary/execution-accuracy), which compares results on one database; its authors call it "a tight upper-bound for semantic accuracy" (abstract).

**Learn more:** [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") ([PDF p. 1](https://arxiv.org/pdf/2010.02840#page=1)) abstract (PDF p. 1) and §1; [SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)") §4.1 reports it beside execution accuracy.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [gold query](#/glossary/gold-query), [counterexample database](#/glossary/counterexample-database), [distillation](#/glossary/distillation)


<a id="test-suite-reduction"></a>

## Test-suite reduction

Choosing a smaller subset of a test suite that still meets every testing requirement the full suite meets, such as covering the same branches, so that the tests run faster with little loss of effectiveness. EvalPlus defines it this way and notes that finding a minimal such subset "is equivalent to the set covering problem" ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") §2.2). It uses three kinds of requirement: [branch coverage](#/glossary/branch-and-path-coverage), killing [mutants](#/glossary/mutation-testing), and catching the wrong solutions that LLMs actually wrote ("LLM sample killings").

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5).

**Related:** [set cover problem](#/glossary/set-cover-problem), [mutation testing](#/glossary/mutation-testing), [branch and path coverage](#/glossary/branch-and-path-coverage), [delta debugging](#/glossary/delta-debugging)


<a id="test-time-scaling"></a>

## Test-time scaling

Getting better outputs by spending more computation at inference, without changing the model's weights: sampling many answers and voting or choosing with a verifier, searching, or revising answers. [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") names self-consistency and self-correction as the most prevalent such strategies in text-to-SQL (§1), and [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") studies when extra test-time compute beats a larger model (abstract, §1).

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §1; [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") §1.

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [self-correction](#/glossary/self-correction), [beam search](#/glossary/beam-search), [compute-matched comparison](#/glossary/compute-matched-comparison)


<a id="test-time-training"></a>

## Test-time training

Updating a model's weights at test time using the test inputs themselves, without their answers, so that the model trains on the very problems it will be scored on. Its scores therefore measure something different from performance on problems the model has never seen.

Example: PSV runs its self-play loop in two settings. In "transfer learning" it starts from one benchmark's problems and is scored on two others; in "test-time training" it starts from the specifications (problems without solutions) of the benchmark being scored and runs on that benchmark alone, noting that "human-written solutions are never trained on" ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") §4).

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 5](https://arxiv.org/pdf/2512.18160#page=5)) §4 (PDF p. 5), which uses the term rather than defining it (general definition), citing Sun et al. (2020), which is not listed here.

**Related:** [self-play](#/glossary/self-play), [formal specification](#/glossary/formal-specification)


<a id="text-to-sql"></a>

## Text-to-SQL

Translating a natural-language question about a database into an SQL query whose result answers the question ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §2). Systems are scored by comparing their query's result with that of a human-written [gold query](#/glossary/gold-query).

**Learn more:** [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF p. 2); [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") §1. The challenge in this repo: [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification).

**Related:** [execution accuracy](#/glossary/execution-accuracy), [gold query](#/glossary/gold-query), [SQL dialect](#/glossary/sql-dialect)


<a id="textual-gradient"></a>

## Textual gradient

Written feedback from an LLM on a piece of text (a prompt, an answer) that says how to change it to reduce an error; another LLM call then edits the text accordingly. The name is a metaphor for a gradient step. [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") (ProTeGi, "Prompt Optimization with Textual Gradients", §1) uses it to optimize prompts, and [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)") §1 extends it to systems of several LLM calls.

**Learn more:** [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)") §1; [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)") §1; [Prompt Codebooks (PCO)](#/papers/nath2026codebooks "Prompt Codebooks: Discrete Compositional Optimization for Language Model Instruction Refinement (2026)") §3.5 and Eq. 9.

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [meta-prompt](#/glossary/meta-prompt)


<a id="tf-idf"></a>

## TF-IDF

A classic way to score how well a document matches a query by the words they share: a shared word counts more the more often it occurs in the document (term frequency) and the fewer documents contain it at all (inverse document frequency), so rare, specific words weigh most (general definition). [BM25](#/glossary/bm25) refines the same idea. Rango uses it to pick lemmas for a Coq proof step: "the 'query' given to TF-IDF is the current proof state, the set of 'documents' are the lemmas in the lemma bank, and the 'words' in a lemma correspond to the identifiers in the lemma" ([Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)") §III-B).

**Learn more:** [Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)") ([PDF p. 3](https://arxiv.org/pdf/2412.14063#page=3)) §III-B (PDF p. 3), citing Spärck Jones 1972 (not listed here), and §V-D (PDF p. 8), which compares it with BM25 and dense retrieval for retrieving proofs; neither defines it (general definition).

**Related:** [BM25](#/glossary/bm25), [dense retrieval](#/glossary/dense-retrieval), [premise selection](#/glossary/premise-selection)


<a id="top-k-and-nucleus-top-p-sampling"></a>

## Top-k and nucleus (top-p) sampling

Ways to sample an LLM's next token from only part of its distribution, to avoid unlikely tokens while keeping variety. Top-k sampling draws from the k most likely tokens; nucleus (top-p) sampling draws from the most likely tokens that together hold probability p. [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") uses k = 50 and p = 0.9 as decoding baselines for producing several different SQL queries, alongside typical sampling, "another recent diverse decoding algorithm" (§6.2).

**Learn more:** [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") §6.2; the original papers it cites are not listed here.

**Related:** [beam search](#/glossary/beam-search), [constrained decoding](#/glossary/constrained-decoding), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="transformation-and-implementation-rules"></a>

## Transformation and implementation rules

The two kinds of rules in a Volcano/Cascades [query optimizer](#/glossary/query-optimizer). A transformation rule turns a logical expression into an equivalent logical expression (join commutativity, A ⋈ B to B ⋈ A; join associativity); an implementation rule maps a logical operator to an algorithm (a join to a hash join or a merge join), producing part of a physical plan. Volcano: "The algebraic rules of expression equivalence, e.g., commutativity or associativity, are specified using transformation rules. The possible mappings of operators to algorithms are specified using implementation rules" ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.2). Cascades notes that one rule may be both ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2).

How they differ from [rewrite rules](#/glossary/query-rewriting-and-rewrite-rules): a query rewrite rule replaces the query, usually before cost-based optimization; Starburst applies its rules because they are expected to help, and WeTune then picks among its rewritten queries by the database's cost estimate ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §6); a transformation rule adds an alternative to the [memo](#/glossary/memo), keeps the original, and leaves the choice to [cost-based optimization](#/glossary/cost-based-optimization). QO-Verify relies on the rules being sound ("each transformation rule is known to be sound", [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1): two queries whose explored logical expressions meet are equivalent. It turns implementation rules off, since it needs only logical expressions (§2.2).

Example: from `Join(Join(A,B),C)` transformation rules derive `Join(Join(B,A),C)` and `Join(A,Join(B,C))`; implementation rules then offer, for each join, a hash join, a merge join or a nested-loop join.

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.2 (PDF p. 3); [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2 (PDF pp. 3–4); [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1 (PDF p. 2) and §2.1–2.2 (PDF p. 3); [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §6 (PDF p. 10).

**Related:** [query optimizer](#/glossary/query-optimizer), [memo](#/glossary/memo), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [logical plan](#/glossary/logical-plan), [phase ordering](#/glossary/phase-ordering)


<a id="translation-validation"></a>

## Translation validation

Checking each output of a compiler or translator instead of proving the translator correct once for all inputs: after every translation, a checker tries to prove that this particular output is equivalent to its input (general definition). Mediator's authors describe it as an application of equivalence checking "where the goal is to prove that the compiled version of the code is equivalent to the original one" ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §9). For SQL, PolyGon suggests validating a query rewrite by checking that the original and rewritten queries are equivalent; a counterexample then helps fix the faulty rewrite rule ([Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") §2).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 23](https://arxiv.org/pdf/1710.07660#page=23)) §9 (PDF p. 23); [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") ([PDF p. 3](https://arxiv.org/pdf/2504.06542#page=3)) §2 (PDF p. 3); [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 2](https://arxiv.org/pdf/2305.01210#page=2)) §1 (PDF p. 2), which calls verifying domain-specific problems this way "already challenging enough". None defines the term beyond Mediator's phrase (general definition); the original papers are not listed here.

**Related:** [query equivalence](#/glossary/query-equivalence), [bisimulation](#/glossary/bisimulation), [certificate](#/glossary/certificate), [differential testing](#/glossary/differential-testing)


<a id="tree-edit-distance"></a>

## Tree edit distance

The smallest total cost of node insertions, deletions and relabellings that turns one tree into another, computed by dynamic programming. Applied to query trees, it measures how different two queries' structures are: LLM-R² can choose as a prompt demonstration the candidate query with the minimum tree edit distance to the input query ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §4.1), and [Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") contrasts its partial-credit grading of student queries, based on canonicalization and edit sequences, with tree edit distance in its related work (§5, PDF p. 8).

**Learn more:** [Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") ([PDF p. 8](https://arxiv.org/pdf/1912.09019#page=8)) §5 (PDF p. 8), which points to a survey (not listed here); [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §4.1. Neither defines it (general definition).

**Related:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)


<a id="letter-u"></a>

<a id="uninterpreted-function"></a>

## Uninterpreted function

A function symbol in a solver formula about which the solver assumes nothing except that it is a function: equal inputs give equal outputs. Checkers use it for operations they don't model exactly (string and date functions, multiplication, aggregates). It keeps the formula simple but loses facts: EQUITAS can prove `a × b = c × d` only when `a = c` and `b = d` ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §3.4.1), and it can produce spurious counterexamples ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 6](https://arxiv.org/pdf/2403.03193#page=6)) §3.1 (PDF p. 6); [EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §3.4.1 (PDF p. 7).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation)


<a id="union-of-conjunctive-queries"></a>

## Union of conjunctive queries

A query that is the union of several [conjunctive queries](#/glossary/conjunctive-query) with the same output columns: conjunctive queries combined with OR, or with SQL's `UNION` (`UNION ALL` when duplicates count, under bag semantics). Example: "departments that sell pens or pencils" is `(x). Sales(x, pen) ∪ (x). Sales(x, pencil)`.

Under set semantics, one union is contained in another exactly when the two have the same output columns and each member of the first is contained in some member of the second. [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") proves this for unions of [tableaux](#/glossary/tableau) (Thm. 3, PDF p. 9) and says "Analogous results are easily obtained for conjunctive queries" (§2.5, PDF p. 4). Under bag semantics the member-by-member test fails ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") Proposition 6.3), and containment is undecidable ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)") Theorem 6.2).

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2); [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §3–4 (PDF pp. 4–9); [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §6 (PDF pp. 8–9), which requires the members to have the same arity and the same set of distinguished variables (§6.2, PDF p. 8).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [query containment](#/glossary/query-containment), [decidable and undecidable](#/glossary/decidable-and-undecidable), [tableau](#/glossary/tableau)


<a id="unsat-core"></a>

## Unsat core

When a solver finds a set of constraints unsatisfiable, an unsat core is a subset of them that is already unsatisfiable on its own. It locates the conflict: to make the whole set satisfiable, something inside the core must change. Solvers report cores in terms of labelled constraints, and a core need not be the smallest such subset.

Example: Polygon labels the constraint for each query node it has fixed; when the whole formula is unsatisfiable, it reads the conflicting nodes off the unsat core and changes only those ([Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") §3.6). Its authors report that "conflict extraction from unsatisfiability core" is one of the design choices that "play an important role" in its performance (§4.3).

**Learn more:** [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") ([PDF p. 14](https://arxiv.org/pdf/2504.06542#page=14)) §3.6 (PDF p. 14) and §4.3 (PDF p. 20), which use it rather than define it; nothing on this site defines it (general definition).

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation)


<a id="letter-v"></a>

<a id="valid-efficiency-score-ves"></a>

## Valid efficiency score (VES)

BIRD's speed score for text-to-SQL. A predicted query whose result differs from the gold query's scores 0; one whose result matches scores the square root of the gold query's running time divided by its own, so a correct query as fast as the gold one scores 1 and a faster one more; VES averages this over all questions ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") §5, Eq. 4). The square root is meant "to minimize random instances that are abnormally faster or slower than the ground-truth SQLs" (same place).

**Learn more:** [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 6](https://arxiv.org/pdf/2305.03111#page=6)) §5 (PDF p. 6) and App.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [gold query](#/glossary/gold-query), [text-to-SQL](#/glossary/text-to-sql)


<a id="valid-time"></a>

## Valid time

In a temporal database, the time when a fact is true in the modelled world, recorded with each row as a period: it "captures when data was, is, or will be true in the modeled reality" ([A Foundation for Conventional…](#/papers/slivinskas2001foundation "A Foundation for Conventional and Temporal Query Optimization Addressing Duplicates and Ordering (2001)") §1, PDF p. 2). The snapshot of a temporal table at a time t is the ordinary table of the rows whose periods contain t, with the periods dropped; two temporal relations are snapshot-equivalent when all their snapshots agree (same place).

**Learn more:** [A Foundation for Conventional…](#/papers/slivinskas2001foundation "A Foundation for Conventional and Temporal Query Optimization Addressing Duplicates and Ordering (2001)") §1 (PDF pp. 1–2), citing its ref. [18] for the term (not listed here).

**Related:** [coalescing (temporal)](#/glossary/coalescing-temporal), [query equivalence](#/glossary/query-equivalence)


<a id="value-function"></a>

## Value function

In reinforcement learning, the expected eventual reward from a given state (or from a state after a given action). For an LLM writing an answer, a state is a partial answer, so a value function predicts how likely a partial solution is to end well. Cobbe et al.'s verifier, trained to predict correctness after every token, "can be viewed as a token-level value function" ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)") §4.3); [PPO](#/glossary/ppo)'s value model is another.

**Learn more:** [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)") ([PDF p. 9](https://arxiv.org/pdf/2110.14168#page=9)) §4.3 (PDF p. 9), which uses the term without defining it (general definition).

**Related:** [Markov decision process](#/glossary/markov-decision-process), [PPO](#/glossary/ppo), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts), [policy gradient](#/glossary/policy-gradient)


<a id="variational-inference-and-the-elbo"></a>

## Variational inference and the ELBO

A way to fit a model with a [latent variable](#/glossary/latent-variable) h when the exact distribution of h given the data (the posterior) is too costly to compute: choose a simpler distribution q(h) and maximize the evidence lower bound (ELBO), a quantity that is never above the log-likelihood of the observed data (general definition for the expansion). The gap between the two is the [KL divergence](#/glossary/kl-divergence) between q(h) and the true posterior, so the bound is useful only when q is close to it ([Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") §3.1). Deep Language Networks use it to learn the prompts of two stacked LLM calls, with the first call's output text as h: the bound splits the search into one optimization per prompt (§3.1).

**Learn more:** [Deep Language Networks](#/papers/sordoni2023dln "Joint Prompt Optimization of Stacked LLMs using Variational Inference (2023)") ([PDF p. 4](https://arxiv.org/pdf/2306.12509#page=4)) §3.1 (PDF pp. 4–5), citing Blei et al. and Kingma and Welling (not listed here); it never expands "ELBO" (general definition for the expansion).

**Related:** [latent variable](#/glossary/latent-variable), [KL divergence](#/glossary/kl-divergence)


<a id="letter-w"></a>

<a id="wasserstein-distance"></a>

## Wasserstein distance

A distance between two probability distributions: the least total cost of moving the probability mass of one onto the other, where moving mass between two points costs more the more different they are. Unlike measures that compare probabilities point by point, it takes into account how close the points are. STP re-weights the conjectures it has selected into the training distribution closest in this distance to the unproved theorems, the cost between a conjecture and a theorem being the negative cosine similarity of their embeddings ([STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") §3.2, App. A.5).

**Learn more:** [STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") ([PDF p. 19](https://arxiv.org/pdf/2502.00212#page=19)) §3.2 and App. A.5 (PDF p. 19), which defines it as an optimal-transport problem over a matching between the two distributions.

**Related:** [KL penalty](#/glossary/kl-penalty)


<a id="weak-supervision"></a>

## Weak supervision

Statistical methods that combine several cheap, noisy labelling sources (heuristics, crowd workers, weak models) into better labels without ground truth, by estimating how accurate each source is from where they agree and disagree. [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") §1 describes it as "a family of statistical techniques developed for data labeling" and applies it to combining verifiers.

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") §1 and §4.2.

**Related:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [LLM-as-a-judge](#/glossary/llm-as-a-judge), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="weight-averaging"></a>

## Weight averaging

Combining models that share a starting point, such as a base model and a copy fine-tuned from it, into one by averaging their weights. Goedel-Prover-V2 averages the base model θ₀ and a fine-tuned model θ as (1 − α)θ₀ + αθ, after supervised fine-tuning and again after RL, because late in training pass@1 rose while pass@N fell, a loss of output diversity that averaging recovers ([Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.3).

**Learn more:** [Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.3, which calls it "model averaging", doesn't define it (general definition), and cites Wortsman et al. (not listed here).

**Related:** [pass@k](#/glossary/passk), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="wilcoxon-signed-rank-test"></a>

## Wilcoxon signed-rank test

A significance test for paired scores, such as two methods run on the same tasks: it ranks the absolute differences between the pairs and asks whether the positive differences have larger ranks than chance allows. Unlike the [sign test](#/glossary/sign-test) it uses how large each difference is, though only through its rank. MIPRO marks its best results as supported by Wilcoxon signed-rank tests ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §6, results table caption).

**Learn more:** [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §6, which uses it without defining it (general definition). Wilcoxon's paper is not listed here.

**Related:** [sign test](#/glossary/sign-test), [McNemar's exact test](#/glossary/mcnemars-exact-test), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing)


<a id="wilson-score-interval"></a>

## Wilson score interval

A confidence interval for a success rate measured over n trials. Unlike the simple "rate ± two standard errors" interval, it stays inside 0–1 and remains sensible when the rate is near 0 or 1 or n is small.

**Learn more:** [How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") ([PDF p. 5](https://arxiv.org/pdf/2609.01660#page=5)) §3.4 (PDF p. 5), which uses it "since several cells involve success rates close to 0 or 1". Wilson's paper is not listed here.

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling), [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic)


<a id="window-function"></a>

## Window function

An SQL function computed over a set of rows related to the current row (its window, set by `OVER (PARTITION BY … ORDER BY …)`) that, unlike GROUP BY, keeps every row: a running total, or a rank within each group.

**Learn more:** [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §2, Example 1 and Tab. 2 (PDF p. 3), where an unnecessary window function makes a query slow and a rewrite replaces it with aggregation and GROUP BY.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="witness-provenance"></a>

## Witness (provenance)

A set of input rows on which a query still produces a given output row: given a database D, a query Q and a row t of Q(D), a witness is a part D′ of D with t in Q(D′). It captures why-provenance, and a row can have several witnesses ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §2.2, after Buneman et al.). RATest reduces finding a smallest [counterexample database](#/glossary/counterexample-database) to finding, for each row on which two queries differ, a smallest witness of that row in the difference of the queries, and keeping the smallest of these (§2.2); its faster algorithm does this for one such row only, and may then miss the overall smallest (§4.2, §7.1).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §2.2. Buneman et al.'s paper is not listed here.

**Related:** [data provenance](#/glossary/data-provenance), [counterexample database](#/glossary/counterexample-database), [optimizing SMT solver](#/glossary/optimizing-smt-solver)


<a id="letter-z"></a>

<a id="zero-rl-training"></a>

## Zero-RL training

Reinforcement learning applied directly to a pretrained base model, with no supervised fine-tuning ([cold start](#/glossary/cold-start)) before it. [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") describes zero-RL training as applying "RL directly to the base model without any supervised fine-tuning (SFT)" (§2.1), and [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") calls this the "zero setting" (abstract).

**Learn more:** [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") §2.1; [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") abstract and §1; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)") §2, whose DeepSeek-R1-Zero is trained this way.

**Related:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr), [cold start](#/glossary/cold-start), [reasoning boundary](#/glossary/reasoning-boundary)


<a id="zipf-distribution"></a>

## Zipf distribution

A skewed distribution in which the k-th most common value occurs with frequency proportional to 1/k^z: with z = 0 all values are equally common, and the larger the exponent z (the skew factor), the more a few values dominate (general definition). Database experiments use it to generate skewed data: [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") runs on TPC-H Skew data "with Zipfian factors: 1, 2, 3, and 4", where "the bigger the factor is, the higher the degree of skewness of the data" (§VI-A), and [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") (§8.1, §8.3) and [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") (§5.1) test query rewrites on Zipfian as well as uniform data.

**Learn more:** [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") §VI-A (PDF p. 10); [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §8.1 (PDF p. 10) and §8.3 (PDF p. 11); [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §5.1 (PDF p. 9). None defines it (general definition).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [selectivity](#/glossary/selectivity)

