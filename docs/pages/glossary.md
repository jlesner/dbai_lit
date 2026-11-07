<!-- filter -->

<p class="jump"><a href="#/glossary/letter-a">A</a> · <a href="#/glossary/letter-b">B</a> · <a href="#/glossary/letter-c">C</a> · <a href="#/glossary/letter-d">D</a> · <a href="#/glossary/letter-e">E</a> · <a href="#/glossary/letter-f">F</a> · <a href="#/glossary/letter-g">G</a> · <a href="#/glossary/letter-h">H</a> · <a href="#/glossary/letter-i">I</a> · <a href="#/glossary/letter-j">J</a> · <a href="#/glossary/letter-k">K</a> · <a href="#/glossary/letter-l">L</a> · <a href="#/glossary/letter-m">M</a> · <a href="#/glossary/letter-n">N</a> · <a href="#/glossary/letter-o">O</a> · <a href="#/glossary/letter-p">P</a> · <a href="#/glossary/letter-q">Q</a> · <a href="#/glossary/letter-r">R</a> · <a href="#/glossary/letter-s">S</a> · <a href="#/glossary/letter-t">T</a> · <a href="#/glossary/letter-u">U</a> · <a href="#/glossary/letter-v">V</a> · <a href="#/glossary/letter-w">W</a> · <a href="#/glossary/letter-x">X</a> · <a href="#/glossary/letter-y">Y</a> · <a href="#/glossary/letter-z">Z</a> · <a href="#/glossary/letter-š">Š</a></p>

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


<a id="accessibility-tree"></a>

## Accessibility tree

A text version of a web page that browsers build for assistive tools such as screen readers: a tree of the page's elements, each with a role (button, link, text box) and a name, with the elements inside it as children (general definition). Web agents read it instead of the raw HTML or a screenshot. It can be long: [Are Online Skill and…](#/papers/hajimiri2026worthtokens "Are Online Skill and Memory Modules Always Worth Their Tokens? A Budget-Constrained Study of Web Agents (2026)") gives one baseline a rule that removes text repeated between a node and its direct children, "a common pattern in accessibility-trees that inflates context length without adding information" (§3.2).

**Learn more:** [Are Online Skill and…](#/papers/hajimiri2026worthtokens "Are Online Skill and Memory Modules Always Worth Their Tokens? A Budget-Constrained Study of Web Agents (2026)") §2, §3.2 and §5.3, which use it without defining it (general definition).

**Related:** [agent harness](#/glossary/agent-harness), [context compaction](#/glossary/context-compaction)


<a id="active-learning"></a>

## Active learning

Choosing which unlabelled examples to have labelled, instead of labelling a random sample, so that each costly label teaches the model more. Example: in [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §4.2 a small reward model scores many sampled solutions per problem, and the training data is drawn mostly (80%) from the most convincing wrong-answer solutions, the ones it scores highest despite a wrong final answer; the authors report that active learning gives "a 2.6× improvement in the data efficiency of process supervision" (§1).

**Learn more:** [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §1 and §4.2, which use the term without defining it (general definition).

**Related:** [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward model](#/glossary/reward-model), [weak supervision](#/glossary/weak-supervision)


<a id="active-testing"></a>

## Active testing

Estimating a model's error from labels on only some test items, chosen adaptively (for example where a second model predicts the largest error) rather than at random, with the labels reweighted so that the estimate stays unbiased despite the non-random choice (general definition). Example: [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §2 "Label-efficient evaluation" says active testing and model-assisted evaluation "reduce labels for estimating a single model's risk"; its active-testing baseline "routes labels adaptively by the same judge on all points with floor 0.1 and Horvitz–Thompson correction" (§6.4), which weights each label by one over its chance of being chosen.

**Learn more:** [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §2 "Label-efficient evaluation" and §6.4, which use the term without defining it (general definition), citing Kossen et al. (2021), not listed here.

**Related:** [active learning](#/glossary/active-learning), [importance sampling and importance weighting](#/glossary/importance-sampling-and-importance-weighting), [prediction-powered inference (PPI)](#/glossary/prediction-powered-inference-ppi)


<a id="actor-critic"></a>

## Actor-critic

A family of [reinforcement learning](#/glossary/reinforcement-learning) methods that train two parts together: the actor, the policy that chooses actions, and the critic, a learned [value function](#/glossary/value-function) that estimates how good the actor's situation or choice is and serves as the baseline when the actor's updates are computed (general definition). [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") calls [PPO](#/glossary/ppo) "an actor-critic RL algorithm" (§4.1.1), and says [GRPO](#/glossary/grpo) "foregoes the critic model, instead estimating the baseline from group scores" (§1.1).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §1.1 and §4.1.1; [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §2.3, on RLHF methods that "typically rely on Actor-Critic algorithms". Both use the term without defining it (general definition).

**Related:** [policy gradient](#/glossary/policy-gradient), [value function](#/glossary/value-function), [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo)


<a id="adaptive-data-analysis"></a>

## Adaptive data analysis

Analysis in which each new question or hypothesis is chosen after seeing the results of earlier ones on the same data. The guarantees of a test planned in advance then no longer hold: "Reusing a holdout set adaptively multiple times can easily lead to overfitting to the holdout set itself" ([Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") abstract). That paper formalizes the problem and gives ways to reuse a holdout set safely, one of them based on [differential privacy](#/glossary/differential-privacy) (§1.1).

Example: [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") calls a self-evolving agent's loop, which keeps changes that score higher on one small held-out set, "a textbook case of *adaptive data analysis*: reusing one validation set to steer a long, data-dependent sequence of choices" (§3).

**Learn more:** [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") abstract and §1.1, the paper that names the problem; [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §3.

**Related:** [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [multiple testing](#/glossary/multiple-testing), [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm), [pre-registration](#/glossary/pre-registration)


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


<a id="agglomerative-clustering"></a>

## Agglomerative clustering

Grouping items from the bottom up: start with each item as its own cluster and repeatedly merge the two closest clusters, until a set number of clusters or a distance cut is reached (general definition). A linkage rule gives the distance between two clusters; with average linkage it is the mean distance between their members. [Instruction Retrieval at Inference…](#/papers/alkiek2025instructionretrieval "Instruction Retrieval at Inference Time for Small Language Models (2025)") groups a benchmark's training questions this way, with average linkage and cosine distance between question embeddings, and has a teacher model write one instruction per cluster (§3).

**Learn more:** [Instruction Retrieval at Inference…](#/papers/alkiek2025instructionretrieval "Instruction Retrieval at Inference Time for Small Language Models (2025)") §3 "Corpus construction", which uses it without defining it (general definition).

**Related:** [cosine similarity](#/glossary/cosine-similarity), [dense retrieval](#/glossary/dense-retrieval)


<a id="ai-operator"></a>

## AI operator

A function inside a SQL query that sends a value (text, an image, audio) and a natural-language prompt to an LLM, so that the query can filter, classify or join on unstructured data; database products also call them AI functions, and research systems semantic operators (general definition). Examples from [The Stochastic Shift](#/papers/alrashed2026stochastic "The Stochastic Shift: A New Evaluation Paradigm for Text-to-SQL with AI Operators (2026)") §2: BigQuery's `AI.IF` and ThalamusDB's `NLfilter` and `NLjoin`. Because the LLM's answers can change with the prompt's wording, comparing exact query results can reject a query the authors judge correct: in the paper's example the generated query counts 11 positive reviews and the benchmark's 9, and [execution accuracy](#/glossary/execution-accuracy) "falsely rejects the generated query" (§3).

**Learn more:** [The Stochastic Shift](#/papers/alrashed2026stochastic "The Stochastic Shift: A New Evaluation Paradigm for Text-to-SQL with AI Operators (2026)") §1 and §2, which describe AI operators through examples without a general definition (general definition); [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") ([PDF p. 10](https://arxiv.org/pdf/2501.18197#page=10)) §5.4.1 "Mitigation Approaches" (PDF p. 10), which suggests extending the database "with semantic operators to filter tuples based on semantic similarity".

**Related:** [text-to-SQL](#/glossary/text-to-sql), [execution accuracy](#/glossary/execution-accuracy), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="akaike-information-criterion-aic"></a>

## Akaike information criterion (AIC)

A score for choosing among statistical models fitted to the same data: it rewards a good fit and charges for each extra parameter, and the model with the lowest score is preferred. It keeps a more flexible curve from winning only because it can bend to the noise.

**Learn more:** [How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") ([PDF p. 5](https://arxiv.org/pdf/2609.01660#page=5)) §3.4 (PDF p. 5), which uses it to choose among geometric, threshold and linear decay of success with horizon, without defining it (general definition). The criterion's original paper is not listed here.

**Related:** [Wilson score interval](#/glossary/wilson-score-interval), [Bayesian information criterion (BIC)](#/glossary/bayesian-information-criterion-bic)


<a id="algebraic-datatype"></a>

## Algebraic datatype

A type defined by listing the forms its values can take, each made by a constructor that may carry fields, like a tagged union. The option type is the standard small example: a value is either "none" or "some(v)". [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") notes that SMT solvers' user-defined algebraic datatypes could in principle encode nullable SQL values, "as nullable types are a form of option types", but that this is "not enough" because every operator must also be lifted to nullable arguments, so it extends cvc5's datatypes solver with built-in nullable sorts (§4).

**Learn more:** [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 14](https://arxiv.org/pdf/2405.03057#page=14)) §4 (PDF p. 14) and abstract, which builds its theory of nullable sorts as "an extension of the theory of algebraic datatypes"; it uses the term without defining it (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="algorithmic-complexity-attack"></a>

## Algorithmic complexity attack

An attack that makes a system do far more work than usual by sending inputs that hit its worst case, so that a cheap request costs the victim a lot of time or memory. [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1 describes it as "characterized by the small cost to create a malicious input and the large cost to process it", with [ReDoS](#/glossary/redos-and-catastrophic-backtracking) as one example (citing Crosby and Wallach 2003, not listed here).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1.

**Related:** [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [threat model](#/glossary/threat-model), [vulnerability records (CVE, NVD, CWE, CVSS, EPSS)](#/glossary/vulnerability-records-cve-nvd-cwe-cvss-epss)


<a id="algorithmic-monoculture"></a>

## Algorithmic monoculture

Many decision-makers relying on the same model, or on models that make the same mistakes, so that their errors are correlated instead of averaging out. [Correlated Errors in Large Language Models](#/papers/kim2025correlated "Correlated Errors in Large Language Models (2025)") uses the term for "when many decision-makers use the same model" and studies one consequence, systemic exclusion, "when one worker is rejected from all jobs because they all use the same algorithm" (§2); it measures how correlated the errors of over 350 LLMs are (abstract).

**Learn more:** [Correlated Errors in Large Language Models](#/papers/kim2025correlated "Correlated Errors in Large Language Models (2025)") §2, citing Kleinberg and Raghavan (2021) and others, not listed here.

**Related:** [common-mode failure](#/glossary/common-mode-failure), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="analysis-of-variance-anova-and-the-f-test"></a>

## Analysis of variance (ANOVA) and the F-test

Splitting the spread (variance) of a measured score into parts due to each experimental factor, their interaction and leftover noise (the residual), to see which factors matter; a two-way ANOVA has two factors, and blocking first removes a nuisance factor such as the difficulty of each question (general definition). Each part's sum of squares divided by its degrees of freedom gives a mean square, and the F-test divides a factor's mean square by the residual's: with no real effect F is expected near 1, so F below 1 means the factor moves the score less than noise does, and the p-value comes from the F distribution (general definition).

Example: [Prompt Optimization Is a Coin Flip](#/papers/zhang2026coinflip "Prompt Optimization Is a Coin Flip: Diagnosing When It Helps in Compound AI Systems (2026)") scores a two-agent pipeline on a 10 × 10 grid of prompts for agent A and agent B and uses "Two-way ANOVA with question blocking" to split the variance into "question difficulty, Agent A main effect, Agent B main effect, A×B interaction, and residual" (§3.1); App. A notes that the interaction has 81 degrees of freedom against 9 for each main effect, so a larger share of total variance can still give a smaller F.

**Learn more:** [Prompt Optimization Is a Coin Flip](#/papers/zhang2026coinflip "Prompt Optimization Is a Coin Flip: Diagnosing When It Helps in Compound AI Systems (2026)") ([PDF p. 2](https://arxiv.org/pdf/2604.14585#page=2)) §3.1 (PDF p. 2), Tab. 1 (PDF p. 3) and App. A (PDF p. 9), which give the formulas for the sums of squares but don't define the F-test (general definition).

**Related:** [p-value](#/glossary/p-value), [Friedman test](#/glossary/friedman-test), [statistical power](#/glossary/statistical-power), [multiple testing](#/glossary/multiple-testing)


<a id="answer-set-programming"></a>

## Answer set programming

A form of [logic programming](#/glossary/logic-programming) for search problems: the program's rules and constraints say what a solution must satisfy, and a solver finds the answer sets, the sets of facts that satisfy all of them (general definition). The inductive logic programming system Popper uses it to propose candidate rules, which it then tests against the examples in Prolog ([Reason Popper-ly](#/papers/chen2026popper "Reason Popper-ly: Patching In-Context Reasoning with Inductive Logic Programming (2026)") §2.2).

**Learn more:** [Reason Popper-ly](#/papers/chen2026popper "Reason Popper-ly: Patching In-Context Reasoning with Inductive Logic Programming (2026)") §2.2, which uses it without defining it (general definition).

**Related:** [logic programming](#/glossary/logic-programming), [stable model (answer set)](#/glossary/stable-model-answer-set), [strong equivalence (logic programs)](#/glossary/strong-equivalence-logic-programs), [inductive logic programming (ILP)](#/glossary/inductive-logic-programming-ilp), [declarative programming](#/glossary/declarative-programming), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers)


<a id="anytime-algorithm"></a>

## Anytime algorithm

An algorithm that can be stopped at any time and still return a usable answer, the best found so far, whose quality only improves the longer it runs (general definition). [Verified LLM-Based Query Rewriting…](#/papers/lee2026mssqlrewrite "Verified LLM-Based Query Rewriting for Microsoft SQL Server (2026)") describes its query-tuning loop as one: it "can be stopped at any moment and still return the best solution it has found so far, with solution quality monotonically improving the longer it runs" (§3.1, PDF p. 3).

**Learn more:** [Verified LLM-Based Query Rewriting…](#/papers/lee2026mssqlrewrite "Verified LLM-Based Query Rewriting for Microsoft SQL Server (2026)") §3.1 and Algorithm 1 (PDF p. 3).

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [test-time scaling](#/glossary/test-time-scaling)


<a id="approximate-nearest-neighbour-search-anns"></a>

## Approximate nearest-neighbour search (ANNS)

Finding stored vectors close to a query vector quickly, with an index that gives up the guarantee of returning the exact nearest ones. It is how embedding-based search scales to large collections. GEqO uses it to find likely-equivalent pairs among many query subexpressions, calling it "a popular, high-performance technique … with moderate precision" ([GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1).

**Learn more:** [GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1 and §2.2.1, which use it without defining it (general definition).

**Related:** [locality-sensitive hashing (MinHash)](#/glossary/locality-sensitive-hashing-minhash), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [contrastive learning](#/glossary/contrastive-learning)


<a id="at-least-once-delivery"></a>

## At-least-once delivery

A delivery guarantee of messaging and streaming systems: no message is lost, but some may arrive more than once, for example again after a crash and restart. A consumer that adds each message's amount to a running total then counts some amounts twice, unless its processing is an [idempotent operation](#/glossary/idempotent-operation). [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") quotes Kafka's documentation: "messages are never lost but may be redelivered" (§1).

**Learn more:** [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") §1, which quotes the Kafka documentation; its duplicate-delivery and crash-and-retry hazards replay such deliveries to agent-written pipelines (§3). The Kafka documentation is not listed here.

**Related:** [idempotent operation](#/glossary/idempotent-operation), [watermark (stream processing)](#/glossary/watermark-stream-processing), [fault injection](#/glossary/fault-injection)


<a id="attack-success-rate-asr"></a>

## Attack success rate (ASR)

The share of attack attempts that achieve the attacker's goal, the usual headline number in security and red-teaming evaluations; lower is better for the defender (general definition). Each paper sets what counts as a success. [Scalable Weak-to-Strong Verifier Hardening…](#/papers/zeng2026hardening "Scalable Weak-to-Strong Verifier Hardening for Agent Environments (2026)") reports it per task and per trial for agents trying to hack a verifier's reward: an attempt counts only if it reaches the reward threshold and an LLM judgment confirms a reward hack, so rewarded legitimate solutions don't count (Fig. 1 caption, App. D.2).

**Learn more:** [Scalable Weak-to-Strong Verifier Hardening…](#/papers/zeng2026hardening "Scalable Weak-to-Strong Verifier Hardening for Agent Environments (2026)") Fig. 1 and App. D.2, which uses the term without a general definition (general definition).

**Related:** [reward hacking](#/glossary/reward-hacking), [threat model](#/glossary/threat-model), [weak-to-strong supervision](#/glossary/weak-to-strong-supervision)


<a id="auprc"></a>

## AUPRC

Area under the precision–recall curve: as a score's threshold moves, it traces the precision (share of flagged cases that are truly positive) against the recall (share of positives flagged), and AUPRC is the area under that curve (general definition). Unlike [AUROC](#/glossary/auroc), it depends on how common positives are: a score that ranks no better than chance gets about the positives' share of the data, so AUPRC can rise when positives become more common even if the ranking gets worse. [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") calls it "useful but prevalence-sensitive" (§2.5) and notes that under one generator condition "the positive class becomes more common, so AUPRC can improve even when score ordering worsens" (§3.3).

**Learn more:** [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") §2.5 and §3.3, which use it without defining it (general definition).

**Related:** [AUROC](#/glossary/auroc), [F1 score](#/glossary/f1-score), [true and false positive rates](#/glossary/true-and-false-positive-rates)


<a id="auroc"></a>

## AUROC

Area under the ROC curve: how well a score separates two classes over all possible thresholds. It equals the chance that a randomly chosen positive (say, buggy code) scores above a randomly chosen negative; 0.5 is chance and 1 is perfect. Because it ignores where the threshold sits, papers that care about few false alarms also report the true-positive rate at a fixed low false-positive rate.

**Learn more:** [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") §2.5, which reports AUROC with TPR and FNR at 5% FPR, "the low-false-positive regime where extra review is costly"; [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") Tab. 1.

**Related:** [F1 score](#/glossary/f1-score)


<a id="autoformalization"></a>

## Autoformalization

Translating natural-language statements into a formal language that a machine can check. In mathematics the target is a [proof assistant](#/glossary/proof-assistant) such as Lean: a problem statement (sometimes its proof) is formalized so that a machine can check proofs of it. Training sets for LLM theorem provers are built this way: [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") says they are "typically derived by formalizing existing natural-language mathematical corpora" (§2.1). In logical reasoning the target is a solver's input: [first-order logic](#/glossary/first-order-logic) as code for the Z3 solver in legal entailment ([Know Your Limits](#/papers/wang2026limits "Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning (2026)") §1, §3.2), rules, formulas, SMT-LIB or constraint models for four solvers ([Adaptive LLM-Symbolic Reasoning via…](#/papers/xu2025adaptive "Adaptive LLM-Symbolic Reasoning via Dynamic Logical Solver Composition (2026)") §2, App. A), statutes as SMT-LIB ([Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") §1).

Gotcha: a formal statement can say something other than the original, and a proof of it then proves nothing about the original. Goedel-Prover-V2's authors report that in existing Lean datasets "over 80% of unsolved problems are incorrectly formalized", from a human evaluation of a sample ([Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.2). In the solver setting, [Know Your Limits](#/papers/wang2026limits "Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning (2026)") reports formalizations that add assumptions the text doesn't state (§5.3).

**Learn more:** [STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") ([PDF p. 4](https://arxiv.org/pdf/2502.00212#page=4)) §2 (PDF p. 4), which defines it as "translating natural language math statements and/or proofs to formal language"; [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 4](https://arxiv.org/pdf/2306.15626#page=4)) §2 (PDF p. 4); [Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") ([PDF p. 3](https://arxiv.org/pdf/2508.03613#page=3)) §2.2 (PDF p. 3), on training a formalizer and judging whether its output is faithful; [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 6](https://arxiv.org/pdf/2504.21801#page=6)) §2.3 (PDF p. 6), which adds "problems derived from autoformalization" to its training data. Beyond mathematics: [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") ([PDF p. 1](https://arxiv.org/pdf/2604.25031#page=1)) §1 (PDF p. 1), which defines it as "the automatic translation of natural-language statements into formal, machine-checkable representations"; [Know Your Limits](#/papers/wang2026limits "Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning (2026)") ([PDF p. 1](https://arxiv.org/pdf/2606.16118#page=1)) §1 (PDF p. 1) and §3.2 (PDF p. 5); [Adaptive LLM-Symbolic Reasoning via…](#/papers/xu2025adaptive "Adaptive LLM-Symbolic Reasoning via Dynamic Logical Solver Composition (2026)") ([PDF p. 3](https://arxiv.org/pdf/2510.06774#page=3)) §2 (PDF p. 3).

**Related:** [proof assistant](#/glossary/proof-assistant), [formal specification](#/glossary/formal-specification), [expert iteration](#/glossary/expert-iteration), [first-order logic](#/glossary/first-order-logic), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [neuro-symbolic AI](#/glossary/neuro-symbolic-ai)


<a id="automated-program-repair"></a>

## Automated program repair

Research on fixing bugs in code automatically: given a faulty program and a signal of what is wrong (failing tests, a compiler or runtime error), produce a corrected version. [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") §6 calls program repair "an area of research concerned with fixing bugs in code" and contrasts earlier work, which trained a separate repair model, with its own approach, which teaches a pretrained LLM to debug its own code "via few-shot prompting".

**Learn more:** [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") ([PDF p. 13](https://arxiv.org/pdf/2304.05128#page=13)) §6 (PDF p. 13).

**Related:** [self-correction](#/glossary/self-correction), [reranking](#/glossary/reranking), [test oracle](#/glossary/test-oracle)


<a id="automated-theorem-prover-atp"></a>

## Automated theorem prover (ATP)

A program that searches for a proof of a conjecture from a set of axioms, usually in [first-order logic](#/glossary/first-order-logic), without human guidance; it answers "proved", "disproved" (for some provers) or runs out of time (general definition). Unlike a [proof assistant](#/glossary/proof-assistant), it is not driven step by step. [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") turns an equivalence claim about logic programs into problems in the TPTP format, "a standard format for Automated Theorem Prover (ATP) systems", and hands them to the prover vampire (§2).

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §2, which uses the term without defining it (general definition).

**Related:** [hammer (automated theorem proving)](#/glossary/hammer-automated-theorem-proving), [proof assistant](#/glossary/proof-assistant), [first-order logic](#/glossary/first-order-logic), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers)


<a id="automatic-differentiation-backpropagation"></a>

## Automatic differentiation (backpropagation)

Computing the gradient of a program's output with respect to all its parameters automatically, from the record of the operations it ran, as frameworks such as PyTorch do for neural networks; backpropagation (reverse mode) passes derivatives backwards through that record with the chain rule, and a forward mode also exists ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") App. B). TextGrad and Trace borrow the idea for LLM systems: they record a pipeline's computation graph and pass information other than numbers backwards through it. TextGrad passes LLM-written textual feedback (see [textual gradient](#/glossary/textual-gradient)), while Trace passes the output feedback together with "minimal subgraphs" of that graph ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") §3.3, §5.5).

**Learn more:** [Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)") App. B ("AutoDiff and Back-propagation"), §1.1 and §5.5 (Trace compared with TextGrad); [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)") §1, which presents TextGrad as "automatic differentiation via text". The original backpropagation paper, which Trace cites, is not listed here.

**Related:** [textual gradient](#/glossary/textual-gradient), [black-box optimization](#/glossary/black-box-optimization)


<a id="automatic-prompt-engineering-ape"></a>

## Automatic prompt engineering (APE)

Improving a prompt automatically instead of by hand: a program, usually driven by an LLM, rewrites "a seed prompt to maximise a metric on a labeled dataset" ([SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)") §1). [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") describes the usual pipeline: expand the set of candidate prompts, evaluate each on the target model, and select the best (§3, Fig. 3); its goal is the prompt that "maximizes the performance of the target model" (§2.3).

Gotcha: APE is also the name of one such method, [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")'s Automatic Prompt Engineer (§1).

**Learn more:** [SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)") §1; [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") §2.3 and §3 (Fig. 3); [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") §1.

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [meta-prompt](#/glossary/meta-prompt), [evolutionary search](#/glossary/evolutionary-search), [textual gradient](#/glossary/textual-gradient)


<a id="automl-and-neural-architecture-search-nas"></a>

## AutoML and neural architecture search (NAS)

AutoML is research that replaces parts of a machine-learning system usually designed by hand with parts found by search or learning; neural architecture search (NAS), its best-known case, searches for a neural network's architecture instead of designing it (general definition). [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)") says research in AI-generating algorithms and AutoML "aims to replace handcrafted components in AI systems by learning them", and that Neural Architecture Search "exemplifies the first pillar" of that field (meta-learning architectures) "by automating neural network design" (§5), and frames its own search for agent designs as an optimization process like these (§2).

**Learn more:** [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)") §5 (paragraph "AI-Generating Algorithms and AutoML") and §2, which cite surveys not listed here (Hutter et al. 2019; Elsken et al. 2019).

**Related:** [hyperparameter optimization](#/glossary/hyperparameter-optimization), [black-box optimization](#/glossary/black-box-optimization), [evolutionary search](#/glossary/evolutionary-search), [open-endedness](#/glossary/open-endedness)


<a id="average-treatment-effect-ate"></a>

## Average treatment effect (ATE)

The average change in an outcome caused by a treatment, compared with no treatment, over a population (general definition). When the treatment is assigned at random, the difference between the average outcomes with and without it is an unbiased estimate. [Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)") treats including one skill in an agent's context as the treatment: with skills included independently at random, an entry of its matrix estimates "the average treatment effect (ATE) of including skill s_j on task d_i, marginalised over the distribution of co-occurring skills" (§2.1).

**Learn more:** [Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)") §2.1, which uses the term without a general definition (general definition).

**Related:** [agent skill](#/glossary/agent-skill), [permutation test](#/glossary/permutation-test)


<a id="letter-b"></a>

<a id="back-translation"></a>

## Back-translation

Translating a text back into the language it came from. In machine translation it is "a data augmentation technique" ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §5) that makes extra training pairs by translating target-language text into the source language (general definition; the original papers are not listed here). In text-to-SQL it is used as a check: GBV-SQL has an LLM explain a generated query in words and compare the explanation with the question, to catch queries that are valid SQL but answer a different question ([GBV-SQL](#/papers/chen2025gbvsql "GBV-SQL: Guided Generation and SQL2Text Back-Translation Validation for Multi-Agent Text2SQL (2025)") §3.4), and round-trip correctness similarly evaluates a model by a trip there and back ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §1).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §5, which names it without describing it (general definition); [GBV-SQL](#/papers/chen2025gbvsql "GBV-SQL: Guided Generation and SQL2Text Back-Translation Validation for Multi-Agent Text2SQL (2025)") §3.4.

**Related:** [text-to-SQL](#/glossary/text-to-sql), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="backward-and-forward-transfer-bwt-and-fwt"></a>

## Backward and forward transfer (BWT and FWT)

Two scores for a model trained on a sequence of stages (continual learning). Backward transfer averages how much accuracy on each earlier stage changed between just after training on it and the end; negative backward transfer is [catastrophic forgetting](#/glossary/catastrophic-forgetting). Forward transfer averages how much the stages trained so far help on the next stage, before it is trained on, compared with the base model.

Example: with R_{i,k} the accuracy on stage k after training through stage i (R_{0,k} for the base model) and K stages, [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") defines BWT = (1/(K−1)) Σ_{k=1}^{K−1} (R_{K,k} − R_{k,k}) and FWT = (1/(K−1)) Σ_{k=2}^{K} (R_{k−1,k} − R_{0,k}) (§3.1).

**Learn more:** [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") §3.1, which takes BWT from Lopez-Paz and Ranzato (2017), not listed here; [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") §5.3, which measures backward transfer of an agent's instructions across shifts in its tasks.

**Related:** [catastrophic forgetting](#/glossary/catastrophic-forgetting), [self-distillation](#/glossary/self-distillation)


<a id="backward-chaining"></a>

## Backward chaining

Rule-based reasoning that starts from the goal and works back: find a rule whose conclusion matches the goal, make the rule's conditions the new subgoals, and repeat until every subgoal is a known fact or no rule applies. It is how a Prolog interpreter answers a query. [Probing for Long-Horizon Deductive…](#/papers/alnegheimish2026prolong "Probing for Long-Horizon Deductive Reasoning Capabilities in Language Models with Prolog (2026)") §1 describes it as "starting from the query and recursively resolving each subgoal against the rules until all branches terminate in facts or fail", and its Fig. 1 shows a depth-4 proof of this kind. [Forward chaining](#/glossary/forward-chaining) goes the other way, from the facts.

**Learn more:** [Probing for Long-Horizon Deductive…](#/papers/alnegheimish2026prolong "Probing for Long-Horizon Deductive Reasoning Capabilities in Language Models with Prolog (2026)") §1 and Fig. 1; [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.12295#page=5)) §3.2 (PDF p. 5), whose engine Pyke uses both directions.

**Related:** [forward chaining](#/glossary/forward-chaining), [logic programming](#/glossary/logic-programming), [unification](#/glossary/unification), [Datalog](#/glossary/datalog)


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


<a id="bayes-rule-prior-and-posterior"></a>

## Bayes' rule, prior and posterior

The prior is a probability distribution over an unknown quantity before seeing the data. Bayes' rule combines it with a model of how likely the data are for each value of the quantity (the likelihood) to give the posterior, the distribution after seeing the data: the posterior is proportional to likelihood × prior. The posterior mean, the posterior's average, is a common single estimate (general definition).

Example: [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") corrects the [winner's curse](#/glossary/winners-curse-optimizers-curse) this way: put a prior on each option's true value, model the estimates' accuracy, apply Bayes' rule, and rank the options by their posterior means (§3, PDF pp. 5–6).

**Learn more:** [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") §3 (PDF pp. 5–6); [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3, which computes posteriors for a model's accuracy on a benchmark.

**Related:** [Bayesian credible interval](#/glossary/bayesian-credible-interval), [Beta distribution](#/glossary/beta-distribution), [shrinkage](#/glossary/shrinkage), [hierarchical model](#/glossary/hierarchical-model), [latent variable](#/glossary/latent-variable)


<a id="bayesian-credible-interval"></a>

## Bayesian credible interval

An interval that holds an unknown quantity with a stated probability under its posterior distribution, e.g. a 95% credible interval for a model's accuracy. It is a statement about the quantity given the data, while a [confidence interval](#/glossary/confidence-interval-and-coverage) is a statement about a procedure; [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") calls the two "fundamentally different in their interpretation" (§3). Credible intervals are not unique (§3): a common choice cuts off equal probability in each tail, and the highest posterior density interval (HDI) is the narrowest interval with the stated probability (general definition).

Example: for an accuracy measured as S correct answers out of N, [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") uses the Beta-Bernoulli posterior Beta(1 + S, 1 + N − S) and reports that its credible interval and the [Wilson score interval](#/glossary/wilson-score-interval) reach their nominal coverage for small N, where intervals based on the [central limit theorem](#/glossary/central-limit-theorem-clt) do not (§3, §3.1).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3 and §3.1.

**Related:** [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior), [Beta distribution](#/glossary/beta-distribution), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval)


<a id="bayesian-information-criterion-bic"></a>

## Bayesian information criterion (BIC)

A score for choosing among statistical models fitted to the same data, like the [AIC](#/glossary/akaike-information-criterion-aic): lower is better, and it "rewards a better fit and charges for every extra parameter" ([Which Decisions Low-Bit Quantization…](#/papers/wu2026lowbit "Which Decisions Low-Bit Quantization Breaks, and How to Predict Them (2026)") §3). Its charge per parameter grows with the logarithm of the number of data points, so on large data it favours simpler models more than the AIC does (general definition). [Which Decisions Low-Bit Quantization…](#/papers/wu2026lowbit "Which Decisions Low-Bit Quantization Breaks, and How to Predict Them (2026)") treats a BIC difference above 10 as "conventionally decisive" (App. A.5).

**Learn more:** [Which Decisions Low-Bit Quantization…](#/papers/wu2026lowbit "Which Decisions Low-Bit Quantization Breaks, and How to Predict Them (2026)") §3 and App. A.5. Schwarz's original paper is not listed here.

**Related:** [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl)


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


<a id="beta-distribution"></a>

## Beta distribution

A probability distribution over a number between 0 and 1, such as an unknown success rate, with two shape parameters a and b; Beta(1, 1) is uniform (general definition). It pairs with yes/no outcomes: starting from the prior Beta(a, b) and observing S successes in N trials gives the posterior Beta(a + S, b + N − S), the Beta-Bernoulli model, which [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") uses with a = b = 1 (§3.1).

Example: [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") models the expected accuracy of a model with mean accuracy p on each question as drawn from Beta(p, 1 − p), and reports that this fits the observed spread of question difficulty and predicts a paired prediction variance of p(1 − p) (§5.1.3, App. B).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.1; [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §5.1.3 and App. B.

**Related:** [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior), [Bayesian credible interval](#/glossary/bayesian-credible-interval), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval)


<a id="bi-level-optimization"></a>

## Bi-level optimization

An optimization problem with another nested inside it: each choice in the outer problem is scored by solving the inner problem with that choice fixed (general definition). Tuning a learning procedure's settings (outer) by the results of running it (inner) is the classic case. [Recursive self-improvement of AI…](#/papers/srikanth2026aide2 "Recursive self-improvement of AI research agents (2026)") frames recursive self-improvement this way: an inner loop of agents optimizing code on tasks at a fixed budget, and an outer loop that improves the inner-loop agent's ability to optimize (§2).

**Learn more:** [Recursive self-improvement of AI…](#/papers/srikanth2026aide2 "Recursive self-improvement of AI research agents (2026)") §2 (general definition).

**Related:** [hyperparameter optimization](#/glossary/hyperparameter-optimization), [agent harness](#/glossary/agent-harness), [meta-prompt](#/glossary/meta-prompt)


<a id="big-m-constraint"></a>

## Big-M constraint

A way to write a condition such as "if x = 1 then u_j ≥ u_i + 1" as one linear inequality, u_j ≥ u_i + 1 − M(1 − x): a large constant M makes the inequality hold trivially when the 0–1 variable x is 0 (general definition). Integer-programming models use it to switch constraints on and off. [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") App. G (Mode B) reports an LLM swapping a constraint stated as "enforced only if x" for this "textbook big-M encoding", which it calls "strictly weaker for CP-SAT"; §5.2 lists such rewrites as weakening [constraint propagation](#/glossary/constraint-propagation). The example is a Miller–Tucker–Zemlin (MTZ) ordering constraint, the standard way to rule out subtours in routing models (general definition).

**Learn more:** [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §5.2 and App. G, Mode B, which use it without defining it (general definition).

**Related:** [linear programming (LP and MILP)](#/glossary/linear-programming-lp-and-milp), [constraint propagation](#/glossary/constraint-propagation), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem)


<a id="bijection"></a>

## Bijection

A one-to-one pairing between two collections that uses every element of each exactly once, so the two have the same size. SPES proves two queries equivalent under [bag semantics](#/glossary/bag-semantics) by showing that on every input there is a "bijective, identity map" between their outputs: "a one-to-one map that maps a tuple in one output table to an unique, identical tuple in the other output table", so duplicates are matched one for one ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)") §3.1).

**Learn more:** [SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)") ([PDF p. 3](https://arxiv.org/pdf/2004.00481#page=3)) §3.1 (PDF p. 3).

**Related:** [bag semantics](#/glossary/bag-semantics), [query equivalence](#/glossary/query-equivalence)


<a id="binary-decision-diagram-bdd"></a>

## Binary decision diagram (BDD)

A compact graph form of a Boolean function: each node tests one variable and branches on its value, and identical subgraphs are shared, so a large set of bit vectors (the inputs on which the function is true) can be stored and combined without listing its members (general definition). [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") stores the sets its satisfiability solver works on this way: each basic formula gets one BDD variable, a node description (ψ-type) becomes a bit vector, and "A BDD with m variables is then used to represent a set of such bit vectors"; the solver's fixpoint computation runs on BDDs (§7, PDF p. 8).

**Learn more:** [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §7 (PDF p. 8) and [XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") §4, which use BDDs without defining them (general definition); both cite Bryant (1986), not listed here.

**Related:** [modal μ-calculus](#/glossary/modal-μ-calculus), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [satisfiable and valid](#/glossary/satisfiable-and-valid)


<a id="binomial-test"></a>

## Binomial test

An exact test of whether a success rate exceeds (or differs from) a fixed value q: if each of m independent trials succeeds with probability q, the number of successes follows a binomial distribution, and the p-value is the chance of a count at least as extreme as the one observed (general definition). The [sign test](#/glossary/sign-test) is the case q = ½ applied to wins and losses. [SAGE (Statistical Acceptance Gate)](#/papers/wang2026sage "SAGE: A Statistical Acceptance Gate for Self-Evolving Agents (2026)") gates a skill edit with "a one-sided exact conditional binomial test on the discordant pairs" (the questions where the old and the new skill disagree), which at its boundary setting "reduces to the one-sided exact McNemar test" (§3.3).

**Learn more:** [SAGE (Statistical Acceptance Gate)](#/papers/wang2026sage "SAGE: A Statistical Acceptance Gate for Self-Evolving Agents (2026)") §3.3 (general definition).

**Related:** [sign test](#/glossary/sign-test), [McNemar's exact test](#/glossary/mcnemars-exact-test), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval), [Fisher's exact test](#/glossary/fishers-exact-test)


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


<a id="bonferroni-correction"></a>

## Bonferroni correction

The simplest correction for [multiple testing](#/glossary/multiple-testing): with m tests, test each at level α/m. The chance of at least one false alarm among them (the familywise error rate) then stays at most α, whatever the dependence between the tests, at the price of power when the tests are many or correlated (general definition). Holm–Bonferroni is a step-by-step version that is never less powerful.

Example: [The Regression Tax](#/papers/tank2026regressiontax "The Regression Tax: Decomposing Why Skills Help -- and Hurt -- LLM Agents (2026)") runs eighteen simultaneous comparisons and applies a Bonferroni correction (α/18 = 0.0028) (§4.3); [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") calls it "valid under any dependence" but conservative (§1).

**Learn more:** [The Regression Tax](#/papers/tank2026regressiontax "The Regression Tax: Decomposing Why Skills Help -- and Hurt -- LLM Agents (2026)") §4.3; [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") §1. Neither defines it (general definition).

**Related:** [multiple testing](#/glossary/multiple-testing), [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr), [union bound](#/glossary/union-bound), [statistical power](#/glossary/statistical-power)


<a id="boolean-matrix-multiplication"></a>

## Boolean matrix multiplication

The product of two matrices of 0s and 1s (true and false) computed with "and" in place of times and "or" in place of plus: entry (i, k) of the product is 1 when some j has a 1 at (i, j) in the first matrix and at (j, k) in the second (general definition). A join is such a product: in [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)")'s example, for each fixed value of one column the join "can be obtained as the result of a matrix multiplication", "where × is boolean matrix multiplication (treating P'x2, Qx2 as boolean matrices)", and the authors note that "techniques for boolean matrix multiplication can be used to advantage for computing joins" (§3, PDF p. 4).

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §3 (PDF p. 4), which applies it to joins without defining it (general definition).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [relational algebra](#/glossary/relational-algebra)


<a id="boolean-minimization"></a>

## Boolean minimization

Finding a smallest Boolean formula with a given truth table. Rows marked "don't-care" may take either output, which gives the minimizer room to find a shorter formula. It is hard: [Qr-Hint](#/papers/hu2024qrhint "Qr-Hint: Actionable Hints Towards Correcting Wrong SQL Queries (2024)") cites it as lying on the second level of the polynomial hierarchy (Σ₂ᵖ) (§1).

Example: Qr-Hint uses it to suggest a smallest fix to a wrong WHERE clause; because its atomic predicates are not independent, it marks the combinations of predicate values that cannot occur (tested with Z3) as don't-cares, and also uses don't-cares to encode a bound from the target query (§5.2).

**Learn more:** [Qr-Hint](#/papers/hu2024qrhint "Qr-Hint: Actionable Hints Towards Correcting Wrong SQL Queries (2024)") §1 and §5.2. The complexity result it cites (Buchfuhrer and Umans) is not listed here.

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [disjunctive normal form (DNF)](#/glossary/disjunctive-normal-form-dnf), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers)


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

**Related:** [multiple testing](#/glossary/multiple-testing), [McNemar's exact test](#/glossary/mcnemars-exact-test), [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap), [permutation test](#/glossary/permutation-test)


<a id="bounded-verification"></a>

## Bounded verification

Checking a property only for inputs up to a size limit. For SQL equivalence: checking that two queries agree on every database whose tables each hold at most K rows (and that satisfies the schema's constraints). A counterexample found this way is real if the checker models SQL exactly (see [spurious counterexample](#/glossary/spurious-counterexample)), but "no counterexample up to K" does not show that the queries agree on larger databases, unless a theorem says K is large enough (see [small counterexample property](#/glossary/small-counterexample-property)).

For programs, bounded model checking (BMC) is the same idea: it unrolls loops up to a bound and searches, usually with an SMT solver, for a counterexample within that many steps; on its own it "cannot prove loop invariants" ([Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") App. A), which [k-induction](#/glossary/k-induction) can.

A (PDF p. 13), for bounded model checking.

**Related:** [counterexample database](#/glossary/counterexample-database), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [soundness and completeness](#/glossary/soundness-and-completeness), [small-scope hypothesis](#/glossary/small-scope-hypothesis), [k-induction](#/glossary/k-induction), [abstract interpretation](#/glossary/abstract-interpretation)


<a id="bradley-terry-model"></a>

## Bradley-Terry model

A model that turns pairwise judgments ("A beats B") into one score per item: it assumes that A beats B with probability s_A / (s_A + s_B), equivalently a logistic function of the difference of their log-scores, and fits the scores to the observed wins (general definition). Reward models for RLHF are commonly trained under it, and [Elo ratings](#/glossary/elo-rating) rest on the same idea. [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)") converts an LLM judge's pairwise comparisons into a ranking with it (App. A, App. B).

**Learn more:** [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)") App. A and App. B; [SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)") §3.2, which notes that DPO's implicit reward is "based on the Bradley-Terry model". Neither defines it (general definition).

**Related:** [Elo rating](#/glossary/elo-rating), [reward model](#/glossary/reward-model), [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo), [reinforcement learning from human feedback (RLHF)](#/glossary/reinforcement-learning-from-human-feedback-rlhf)


<a id="branch-and-path-coverage"></a>

## Branch and path coverage

Measures of how thoroughly tests exercise a program. Branch coverage is the share of the program's branches (each way out of a decision, such as the true and the false side of an `if`) that at least one test executes; path coverage is the share of complete routes through the program's control flow that the tests execute. Path coverage is stricter, and a loop can make the number of paths unbounded.

Example: `if a: f` followed by `if b: g` has four branches, all covered by the two tests (a, b) = (true, true) and (false, false); it has four paths, which need all four combinations. EvalPlus's authors note that high coverage is not enough: a test that covers code "is not necessarily effective in finding critical defects in its covered code" ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") §2.2), which is why they also use [mutation testing](#/glossary/mutation-testing).

For SQL, ParSEval defines a query's paths on its [logical plan](#/glossary/logical-plan) and treats each behaviour of an operator as a branch; for a filter, one test row that passes the condition and one that fails it ([ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §1, Tab. 2).

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5); [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §1 (PDF p. 2), §2.2 (PDF p. 3) and Tab. 2 (PDF p. 5).

**Related:** [mutation testing](#/glossary/mutation-testing), [fuzzing](#/glossary/fuzzing), [symbolic execution](#/glossary/symbolic-execution), [logical plan](#/glossary/logical-plan), [line and statement coverage](#/glossary/line-and-statement-coverage)


<a id="branch-distance"></a>

## Branch distance

In search-based test generation, a number that says how far a condition in the code is from being true for a given input: zero when it holds, and smaller the closer the input comes. Used as a fitness score, it steers a search, such as a [genetic algorithm](#/glossary/genetic-algorithm), towards inputs that take a branch not yet covered (general definition). EvoSQL uses Korel's standard branch distance for comparisons of numbers and booleans when generating test data for SQL queries: for the condition `price=10` the distance is abs(price − 10), and for an `AND` of conditions it is the sum of their distances ([EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §3.2.2); strings get an edit distance instead.

**Learn more:** [EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §3.2.2 (PDF pp. 3–4), which cites Korel [22] for the standard distance without defining it (general definition) and defines distances for SQL's `BETWEEN`, `IN`, `LIKE`, `EXISTS`, `IS NULL` and join conditions. Korel's paper is not listed here.

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [genetic algorithm](#/glossary/genetic-algorithm), [fuzzing](#/glossary/fuzzing)


<a id="brute-force-solution"></a>

## Brute-force solution

A program that solves a problem by trying every possibility: correct, but too slow for large inputs (general definition). Testers use one as a reference: run it and the program under test on many small random inputs, and an input on which their outputs differ is a counterexample, provided the brute-force program itself is right.

Example: [REFUTE ("Can Language Models Falsify?")](#/papers/sinha2025refute "Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation (2025)") App. A.1 asks a model for a random input generator and "an inefficient solution to the problem", such as brute-force enumeration for small constraints, and searches for an input on which it and the incorrect code disagree. In §5.2 the authors report that, of the searches that ended with an incorrect counterexample (on average 35% of all samples), 86% "result from incorrect brute-force code".

**Learn more:** [REFUTE ("Can Language Models Falsify?")](#/papers/sinha2025refute "Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation (2025)") App. A.1 and §5.2, which describe the term without a formal definition (general definition).

**Related:** [differential testing](#/glossary/differential-testing), [test oracle](#/glossary/test-oracle)


<a id="brzozowski-derivatives"></a>

## Brzozowski derivatives

A way to match a regular expression without backtracking: after each input character c, rewrite the expression into its derivative with respect to c, an expression for what the rest of the input must match; the input matches if the final expression accepts the empty string (general definition; Brzozowski 1964 is not listed here). Matching then takes time linear in the input. [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") lists a "Brzozowski Derivatives Engine" as the non-backtracking engine .NET added against [ReDoS](#/glossary/redos-and-catastrophic-backtracking) (the engine table of §4.1, and §4.1.3).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §4.1 and §4.1.3, which use the term without defining it (general definition).

**Related:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa)


<a id="letter-c"></a>

<a id="calibration"></a>

## Calibration

A score is calibrated when it means what it says as a probability: among the cases scored p, a fraction p turn out correct (general definition). Calibration alone is not enough: a score that gives every case the same middling value can be calibrated and useless. [When to Trust the Cheap Check](#/papers/kiyani2026weakstrong "When to Trust the Cheap Check: Weak and Strong Verification for Reasoning (2026)") names calibration and sharpness as the two properties that govern how useful a cheap verifier is (§1), and assumes a weak verifier calibrated against a strong one: among responses it scores p, a fraction p pass the strong verifier (Assumption 4.1).

**Learn more:** [When to Trust the Cheap Check](#/papers/kiyani2026weakstrong "When to Trust the Cheap Check: Weak and Strong Verification for Reasoning (2026)") §1 and Assumption 4.1.

**Related:** [selective prediction](#/glossary/selective-prediction), [AUROC](#/glossary/auroc), [reward model](#/glossary/reward-model), [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control)


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


<a id="central-limit-theorem-clt"></a>

## Central limit theorem (CLT)

The result that the average of many independent random values with finite variance is approximately normally distributed, whatever the values' own distribution, with a spread that shrinks like 1/√N ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §2). It justifies the common "mean ± 1.96 [standard errors](#/glossary/standard-error)" 95% interval. [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") argues that intervals based on it are appropriate for benchmarks of thousands of examples but "fail to provide adequate uncertainty estimates" for small, specialized ones; its title is "Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints" (abstract).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") abstract and §2; [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §4.1, which applies it to turn z-scores into p-values when N > 100.

**Related:** [standard error](#/glossary/standard-error), [z-score](#/glossary/z-score), [Wald interval](#/glossary/wald-interval), [delta method](#/glossary/delta-method), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage)


<a id="certificate"></a>

## Certificate

Evidence for an answer that a program can check without trusting whoever produced it. For SQL equivalence: a [counterexample database](#/glossary/counterexample-database) for "different", or a machine-checked proof for "equivalent".

**Related:** [counterexample database](#/glossary/counterexample-database), [proof assistant](#/glossary/proof-assistant), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="chase"></a>

## Chase

A procedure that rewrites a query so that it states what the schema's constraints imply. For a foreign key it adds the referenced table's row to the query; for a key it merges terms that the key forces to be equal. It repeats until nothing changes; for some constraints it never stops, but for acyclic ones it does. Equivalence under the constraints can then be decided by comparing the chased queries, for the semantics and constraints these papers treat.

**Learn more:** [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") §5 (PDF p. 8); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 9](https://arxiv.org/pdf/2609.09978#page=9)) §4 (PDF pp. 9–10), for keys and foreign keys.

**Related:** [integrity constraint](#/glossary/integrity-constraint), [conjunctive query](#/glossary/conjunctive-query)


<a id="chat-template"></a>

## Chat template

The wrapper a chat model expects around each conversation: role markers (system, user, assistant) and special tokens that the model saw in fine-tuning, sometimes with a default system message (general definition). A prompt sent without the template, or with another model's, is out of distribution for the model. [Same Answer, New Box](#/papers/lyu2026sameanswer "Same Answer, New Box: How Much of RLVR's Out-of-Domain Gain Is Answer Format? (2026)") sends its prompts in each checkpoint's own template and keeps its default system message, which for one model asks for the answer in a box (§3, §6); it leaves out of its pooled results a pair whose base and RL models ship different templates (App. A).

**Learn more:** [Same Answer, New Box](#/papers/lyu2026sameanswer "Same Answer, New Box: How Much of RLVR's Out-of-Domain Gain Is Answer Format? (2026)") §3, §6 and App. A, which use it without defining it (general definition).

**Related:** [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)


<a id="chi-square-test-of-independence"></a>

## Chi-square test of independence

A test of whether two categorical variables are related, from a table of counts: for each cell it compares the observed count O with the count E expected if the variables were independent, and sums (O − E)²/E; a large sum, and so a small p-value, is evidence that they are related (general definition). [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") uses it to ask whether the prompt template affects whether generated code is correct, one test per language and model, with the null hypothesis of "no association between the prompt template and accuracy" (§5.3.3, Eq. 5, Tab. 5). With small expected counts the approximation fails, and [Fisher's exact test](#/glossary/fishers-exact-test) is the usual alternative (general definition).

**Learn more:** [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") ([PDF p. 21](https://arxiv.org/pdf/2603.05278#page=21)) §5.3.3 (PDF pp. 21–22), which gives the statistic and its use but not the test's derivation (general definition); the original paper is not listed here.

**Related:** [Fisher's exact test](#/glossary/fishers-exact-test), [McNemar's exact test](#/glossary/mcnemars-exact-test), [multiple testing](#/glossary/multiple-testing)


<a id="church-rosser-property"></a>

## Church-Rosser property

A set of rewrite steps has it when the order of applying them doesn't change where you can end up: whenever an object can be rewritten in two different ways, each by any number of steps, both results can be rewritten further to a common result. "Finite Church–Rosser" adds that every sequence of steps stops; then applying the steps in any order until none applies gives one normal form, so two objects can be compared by their normal forms (general definition; with every sequence stopping, it is enough to check single steps). [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") proves that foldings of a conjunctive query are Church–Rosser up to isomorphism (Thm. 9, PDF p. 6), and [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") gives transformations of unions of elementary differences that are finite Church–Rosser (§7, PDF pp. 13–14).

**Learn more:** [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §7 (PDF pp. 13–14), which takes the term from Aho, Sethi and Ullman (ref. [6], not listed here); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 9 (PDF p. 6) and §7 (PDF p. 10). Both use the term without defining it (general definition).

**Related:** [query equivalence](#/glossary/query-equivalence), [tableau](#/glossary/tableau), [conjunctive query](#/glossary/conjunctive-query)


<a id="clarks-completion-and-tight-programs"></a>

## Clark's completion and tight programs

Clark's completion reads a logic program's rules for each predicate as an if-and-only-if definition: if the only rules for p are p ← a and p ← b, the completion says p ↔ (a ∨ b), so p holds exactly when some rule's body does (general definition). A program is tight when no atom depends on itself through a cycle of positive (un-negated) body atoms (general definition). For tight programs the two views coincide: [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §3.2.2 states that "Clark's Completion characterizes the stable models of a logic program as the models of a classical first-order theory" for the "so-called tight programs" (citing Fandinno et al. 2020, Section 6), which lets a first-order prover reason about [stable models](#/glossary/stable-model-answer-set).

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §3.2.2. Clark (1978) is not listed here.

**Related:** [stable model (answer set)](#/glossary/stable-model-answer-set), [answer set programming](#/glossary/answer-set-programming), [negation as failure](#/glossary/negation-as-failure), [first-order logic](#/glossary/first-order-logic)


<a id="classical-planning-strips-and-pddl"></a>

## Classical planning (STRIPS and PDDL)

Finding a sequence of actions that takes a world from a given start state to a state that meets a goal, where the world is discrete and each action has a fixed, certain effect. Each action has preconditions (what must hold before it) and effects (what it changes). STRIPS is the classic formalism for such problems, and PDDL is the standard language for writing them down: a domain (predicates and actions), an initial state and a goal. Because a plan can be simulated step by step, a program can check it.

Example: Blocksworld, where the actions pick up, put down and stack blocks to reach a goal arrangement.

**Learn more:** [On the Self-Verification Limitations…](#/papers/stechly2024selfverification "On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks (2024)") ([PDF p. 5](https://arxiv.org/pdf/2402.08115#page=5)) §3.3 (PDF p. 5), which describes STRIPS planning and the three parts of a PDDL specification; its App. A.5.1 checks plans with the validator VAL.

**Related:** [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="clever-hans-effect"></a>

## Clever Hans effect

An apparent ability that comes from cues the questioner unknowingly supplies, named after a horse that seemed to do arithmetic but was reading its trainer's reactions (general definition). [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") warns that iterative prompting, where a human keeps correcting an LLM's plan until it is right, is "notorious for" it, since the corrections may carry the answer (§3).

**Learn more:** [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") §3, which cites Wikipedia for it (general definition).

**Related:** [self-correction](#/glossary/self-correction), [LLM-as-a-judge](#/glossary/llm-as-a-judge), [data contamination](#/glossary/data-contamination)


<a id="clopper-pearson-interval"></a>

## Clopper-Pearson interval

An exact confidence interval for a success rate from k successes in n trials. It is built from binomial tail probabilities instead of a normal approximation, so it covers the true rate at least as often as its nominal level for every n, at the price of being wider than needed (general definition). A one-sided version gives an upper bound on a failure rate, as in [ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") (§3) and [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") (§5).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") App. A.3, which describes it, citing Clopper and Pearson (1934), not listed here; [ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") §3 and App. A.2.

**Related:** [Wilson score interval](#/glossary/wilson-score-interval), [Wald interval](#/glossary/wald-interval), [binomial test](#/glossary/binomial-test), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [Beta distribution](#/glossary/beta-distribution)


<a id="closed-book-question-answering"></a>

## Closed-book question answering

Answering questions only from what the model learned in training, with no documents retrieved or supplied (general definition); the opposite of open-book or [retrieval-augmented](#/glossary/retrieval-augmented-generation-rag) answering. [Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)") tests self-correction on HotpotQA "in a closed-book setting" (§3.1), and [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") groups BoolQ and HotpotQA under "Closed-Book Question Answering" (§3.3).

**Learn more:** [Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)") §3.1; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") §3.3. Neither defines it (general definition).

**Related:** [multi-hop question answering](#/glossary/multi-hop-question-answering), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [self-correction](#/glossary/self-correction)


<a id="clustered-standard-errors-and-cluster-bootstrap"></a>

## Clustered standard errors and cluster bootstrap

When test items come in groups whose results are correlated (several questions about one passage, several runs in one environment), treating them as independent understates the uncertainty. Clustered standard errors compute the variance from per-cluster sums instead of per-item values, and a cluster bootstrap resamples whole clusters, so that correlated items stay together (general definitions).

Example: [APIFlow-Bench](#/papers/wan2026apiflowbench "APIFlow-Bench: Measuring Whether Agents Survive Long, Dependent API Workflows (2026)") reports "90% cluster bootstraps over worlds (2,000 resamples), keeping each world's epochs together" (§6). [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") discusses clustered standard errors (§3.2) and reports that with clustered questions and little data neither simple nor clustered CLT-based intervals reach the intended coverage (§3).

**Learn more:** [APIFlow-Bench](#/papers/wan2026apiflowbench "APIFlow-Bench: Measuring Whether Agents Survive Long, Dependent API Workflows (2026)") §6; [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.2, which cites Miller (2024) and Abadie et al. (2023) for clustered standard errors, neither on this site.

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling), [standard error](#/glossary/standard-error), [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt)


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


<a id="code-as-action"></a>

## Code as action

An agent design in which the agent acts by writing code that is then executed, instead of choosing among predefined tool calls. [SWE-SQL (BIRD-CRITIC)](#/papers/li2025swesql "SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications (2025)") sorts agents by action type: Tool-Act agents use "pre-defined tools tailored to specific tasks", while Code-Act "allows for more flexible, free-form actions where LLMs generate code to perform operations" (§6.1). The pattern comes from CodeAct (Wang et al., 2024, not listed here), which [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") describes as an agent "that can execute code inside of a ReAct loop" (§3.2).

**Learn more:** [SWE-SQL (BIRD-CRITIC)](#/papers/li2025swesql "SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications (2025)") §6.1; [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §3.2; [SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)") §2, which ports "the code-as-action paradigm of CodeAct" to prompt optimization.

**Related:** [tool calling (function calling)](#/glossary/tool-calling-function-calling), [ReAct](#/glossary/react), [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning), [agent harness](#/glossary/agent-harness)


<a id="code-coverage"></a>

## Code coverage

How much of a program a set of tests or inputs exercises, measured by a coverage criterion: the share of the program's statements (or lines), or of its branches, that at least one test executes. Tools such as Coverage.py report it by running the program on the tests. Example: [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)") App. H.2 uses "the code coverage measurement" with "two coverage criterias --- the statement coverage and the branch coverage" to judge LLM-generated tests on HumanEval; [PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)") keeps a candidate query only if it "can increase the code coverage of the parser" (§3.2), without saying which criterion.

**Learn more:** [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)") ([PDF p. 16](https://arxiv.org/pdf/2207.10397#page=16)) App. H.2 (PDF p. 16); [PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)") §3.2 Step 2.

**Related:** [line and statement coverage](#/glossary/line-and-statement-coverage), [branch and path coverage](#/glossary/branch-and-path-coverage), [mutation testing](#/glossary/mutation-testing), [fuzzing](#/glossary/fuzzing)


<a id="coding-agent"></a>

## Coding agent

An LLM-driven program that works on a code base through tools, running code, reading files and editing them, over many steps, to complete a software task. [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") §2 describes tool-using coding agents such as SWE-agent, OpenHands and Claude Code as interleaving "code execution, file inspection, and editing to resolve software tasks"; [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") §3 defines one as "a single system, implemented with a code repository and powered by frozen pretrained foundation models (FMs), capable of reading, writing, and executing code".

Example: [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") uses an unmodified coding agent as a prompt optimizer: it writes and runs analysis code over a corpus of logged agent runs and then writes the improved prompt (§1, §2).

**Learn more:** [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.26261#page=3)) §2 (PDF p. 3); [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") ([PDF p. 4](https://arxiv.org/pdf/2505.22954#page=4)) §3 (PDF p. 4). ([Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") has an open erratum on another sentence of §3, whether each parent agent diagnoses its own logs; the definition is not affected.)

**Related:** [agent harness](#/glossary/agent-harness), [trajectory (agent)](#/glossary/trajectory-agent), [agent skill](#/glossary/agent-skill)


<a id="coefficient-of-variation"></a>

## Coefficient of variation

A measure of spread relative to the average: the standard deviation divided by the mean, often given as a percentage, so that spreads around different averages can be compared (general definition). Example: [DBLifeBench](#/papers/zheng2026dblifebench "Evaluating LLMs in Database Scenarios: A Lifecycle Benchmark for Assessing Their Potential in Core Database Tasks (2026)") Tab. 3 gives each model's coefficient of variation across three schema variants of one database, smaller for its P-Text2SQL task than for plain Text2SQL (§5.1); for the GPT-4o and Llama3 rows the printed values (5.30 / 4.30 and 9.30 / 7.57) equal the population standard deviation of the three scores in Tab. 5 divided by their mean, in percent (our computation). An open erratum says Tab. 3's Qwen2.5 and CodeQwen rows are identical; the rows used here are not affected.

**Learn more:** [DBLifeBench](#/papers/zheng2026dblifebench "Evaluating LLMs in Database Scenarios: A Lifecycle Benchmark for Assessing Their Potential in Core Database Tasks (2026)") ([PDF p. 6](https://arxiv.org/pdf/2608.03794#page=6)) (unchecked) §5.1 and Tab. 3 (PDF p. 6), which use it without defining it, citing Reed et al. (2002), not listed here (general definition); [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") (unchecked) §5.3 and App. G.2 also report run-to-run coefficients of variation.

**Related:** [standard error](#/glossary/standard-error)


<a id="coevolution"></a>

## Coevolution

Evolving two or more parts of a system together so that each one's selection depends on the others, for example solvers together with the environments or task curricula they are trained on, so that the tasks change as the solvers improve (general definition). [Self-Modifying Lean Proof Agents](#/papers/li2026selfmodifying "Self-Modifying Lean Proof Agents with Verifier-Grounded Benchmark Coevolution (2026)") names POET, MCC and PAIRED as examples outside formal proof, contrasts the Red Queen Gödel Machine, which "coevolves the criterion of success", with its own system, which "keeps the criterion fixed and coevolves the difficulty distribution" of its proof tasks (§2), and hardens its benchmark as its agents improve (§3.3).

**Learn more:** [Self-Modifying Lean Proof Agents](#/papers/li2026selfmodifying "Self-Modifying Lean Proof Agents with Verifier-Grounded Benchmark Coevolution (2026)") §2 ("Coevolution and automatic curricula") and §3.3, which use the term without defining it (general definition). POET, MCC and PAIRED are not listed here.

**Related:** [curriculum learning](#/glossary/curriculum-learning), [self-play](#/glossary/self-play), [open-endedness](#/glossary/open-endedness), [evolutionary search](#/glossary/evolutionary-search)


<a id="cohens-h"></a>

## Cohen's h

An effect size for the difference between two proportions p₁ and p₂: h = 2·arcsin√p₁ − 2·arcsin√p₂ (general definition). The arcsine transform makes equal values of h about equally easy to detect whether the proportions are near 50% or near 0% or 100%; by Cohen's usual rule of thumb, about 0.2 is small, 0.5 medium and 0.8 large (general definition).

Example: [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") reports Cohen's h = −0.911, "large effect", for hallucination survival of 16.2% with boundary gates against 58.4% with a single end-of-pipeline check (App. A.3); the formula gives −0.911 from those two rates (our check).

**Learn more:** [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") ([PDF p. 9](https://arxiv.org/pdf/2608.14588#page=9)) App. A.3 (PDF p. 9), which uses it without defining it (general definition). Cohen's book is not listed here. App. A.3 has an open erratum on its McNemar contingency labels and odds ratios, not on the h values.

**Related:** [test of two proportions](#/glossary/test-of-two-proportions), [odds ratio](#/glossary/odds-ratio), [statistical power](#/glossary/statistical-power), [McNemar's exact test](#/glossary/mcnemars-exact-test)


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

Example: for DeepSeek-R1-Zero the authors "bypass the conventional supervised fine-tuning (SFT) phase before RL training" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") introduction). For DeepSeek-R1, to fix R1-Zero's "poor readability and language mixing", they first "collect thousands of cold-start data that exhibit a conversational, human-aligned thinking process" (§ "DeepSeek-R1"): "a small amount of long CoT data to fine-tune the model as the initial RL actor" (Supp. 2.3.2). DeepSeek-Prover-V2 makes its cold-start data synthetically: DeepSeek-V3 splits a theorem into subgoals, a smaller prover proves them, and the combined proof is paired with V3's chain of thought ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") §1, §2.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 1](https://arxiv.org/pdf/2501.12948#page=1)) introduction (PDF p. 1) and § "DeepSeek-R1" (PDF p. 2), and Supp. 2.3.2 (SI PDF p. 13); [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.21801#page=2)) §1 (PDF p. 2) and §2.2 (PDF p. 5).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [distillation](#/glossary/distillation), [rejection sampling](#/glossary/rejection-sampling), [curriculum learning](#/glossary/curriculum-learning)


<a id="combinatory-logic"></a>

## Combinatory logic

A way of writing functions with no variables at all: every function is built by applying a few fixed functions, the combinators, to each other (general definition). Three suffice: i returns its argument, k makes a constant function, and s passes one argument to two functions and applies the first result to the second. It computes the same functions as the [lambda calculus](#/glossary/lambda-calculus-and-beta-reduction). The esoteric language Unlambda is built on s, k and i ([EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") §3.2, App. B).

**Learn more:** [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") §3.2 and App. B, which use it without defining it (general definition).

**Related:** [lambda calculus and beta-reduction](#/glossary/lambda-calculus-and-beta-reduction), [fixed-point combinator (Y combinator)](#/glossary/fixed-point-combinator-y-combinator), [esoteric programming language (esolang)](#/glossary/esoteric-programming-language-esolang), [Turing-complete](#/glossary/turing-complete)


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


<a id="common-mode-failure"></a>

## Common-mode failure

A failure that hits several supposedly independent checks at once because they share a cause, so that adding more of them adds no independent evidence (general definition, from reliability engineering). [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") §I: two interfaces may be backed by the same replica, cache or extraction job, and "a stale upstream can then make different verifier models agree on the same wrong state. More votes do not repair a common-mode data failure."

**Learn more:** [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") §I.

**Related:** [algorithmic monoculture](#/glossary/algorithmic-monoculture), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [test oracle](#/glossary/test-oracle)


<a id="complete-and-incomplete-search"></a>

## Complete and incomplete search

A complete search keeps going until it finds a solution or proves that none exists (for an optimization problem, until it proves that its best solution is optimal); an incomplete one, such as local search, random restarts or a fixed iteration cap, can stop without that guarantee and return a wrong "no solution" or a suboptimal answer (general definition). [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §5.2 names "silent loss of completeness" (Mode D) as one way LLM-written Python solvers go wrong when the prompt asks for speed; App. B.4 counts local search, multiple restarts and iteration caps among the changes.

**Learn more:** [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §5.2, App. B.4 and App. G, Mode D, which use it without defining it (general definition).

**Related:** [constraint optimization problem (COP)](#/glossary/constraint-optimization-problem-cop), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem), [hill climbing](#/glossary/hill-climbing), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="compound-ai-system-lm-program"></a>

## Compound AI system (LM program)

A program that combines several calls to language models, possibly interleaved with tool calls (such as retrieval), under ordinary control flow, so that each call (a module) has its own prompt. [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") defines a compound AI system as "any modular system composed of one or more language model (LLM) invocations, potentially interleaved with external tool calls, orchestrated through arbitrary control flow", which covers agents and multi-agent systems, and gives each module its own prompt (§2); [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") calls the same kind of program a Language Model Program, "sophisticated pipelines of modular language model (LM) calls" (abstract). Prompt optimizers such as MIPRO and GEPA tune each module's prompt against a score for the whole program.

**Learn more:** [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") ([PDF p. 2](https://arxiv.org/pdf/2507.19457#page=2)) §2 (PDF p. 2); [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") ([PDF p. 1](https://arxiv.org/pdf/2406.11695#page=1)) abstract (PDF p. 1).

**Related:** [agent harness](#/glossary/agent-harness), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="compute-matched-comparison"></a>

## Compute-matched comparison

Comparing two methods at equal compute or cost rather than one call each. A method that spends extra tokens (a self-critique round, say) is compared with a baseline given the same budget, such as more samples with a majority vote. Without the matching, a method can look better only because it uses more compute.

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §1, a "FLOPs-matched comparison" of a smaller model with extra test-time compute against a larger model; [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") §4.5 and Tab. 2, whose cost-matched difference compares each method with the baseline at the method's mean cost.

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="concentration-inequality"></a>

## Concentration inequality

A bound on the chance that the average of independent random values lands far from its expected value (general definition). Papers turn them into a radius: how far an observed rate can be from the true one, except with a chosen small probability.

Kinds: Hoeffding's inequality uses only the values' range: for n values in [0, 1], the chance that their average exceeds its expected value by more than t is at most exp(−2nt²). Bernstein's and Bennett's inequalities also use the variance, so they are tighter when the variance is small; empirical-Bernstein versions estimate the variance from the data.

Examples: [Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)") uses a Hoeffding radius for a skill's measured success rate (§4); [BudgetAPO](#/papers/liu2026budgetapo "How Should a Prompt Optimizer Spend a Tight Budget? BudgetAPO with Noise-Adaptive Evaluation (2026)") a Bernstein bound that ties the number of paired comparisons to the chance of a wrong decision (App. A.2); [Certified Long-Horizon Code Agent…](#/papers/wang2026valve "Certified Long-Horizon Code Agent Evolution via Validation-Gated Skill Optimization (2026)") a one-sided Bennett radius (§3.1, App. A.2).

**Learn more:** [Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)") §4; [BudgetAPO](#/papers/liu2026budgetapo "How Should a Prompt Optimizer Spend a Tight Budget? BudgetAPO with Noise-Adaptive Evaluation (2026)") App. A.2; [Certified Long-Horizon Code Agent…](#/papers/wang2026valve "Certified Long-Horizon Code Agent Evolution via Validation-Gated Skill Optimization (2026)") App. A.2. None states the general definition (general definition).

**Related:** [union bound](#/glossary/union-bound), [confidence sequence (anytime-valid inference)](#/glossary/confidence-sequence-anytime-valid-inference), [learn-then-test (LTT)](#/glossary/learn-then-test-ltt), [standard error](#/glossary/standard-error)


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


<a id="conditional-average-treatment-effect-cate"></a>

## Conditional average treatment effect (CATE)

The [average treatment effect](#/glossary/average-treatment-effect-ate) within a subgroup that shares some covariates, such as the prompts of one dataset or task type (general definition). It shows whether a treatment helps some kinds of cases and hurts others. [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") reports "naive (unweighted) CATE" per dataset for two kinds of prompt edit, beside its weighted estimates (App. F, Tab. 6; §5.2).

**Learn more:** [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") App. F and §5.2, which use the term without defining it (general definition).

**Related:** [average treatment effect (ATE)](#/glossary/average-treatment-effect-ate), [propensity score and inverse probability weighting (IPTW)](#/glossary/propensity-score-and-inverse-probability-weighting-iptw), [confounder](#/glossary/confounder)


<a id="conditional-independence"></a>

## Conditional independence

Two random quantities A and B are conditionally independent given a third, C, when once C is known, learning A tells nothing more about B: P(A, B | C) = P(A | C) · P(B | C). They may still be strongly correlated when C is unknown, because both depend on it.

Example: [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") assumes that several verifiers' verdicts on a response are conditionally independent given whether the response is truly correct, "one common assumption" of weak-supervision methods (§4.2.1); it reduces the number of parameters to estimate "from O(2^m) to O(m)" for m verifiers (App. B.1). [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") tests whether the outcome after two steps depends on the starting outcome only through the outcome after one, and notes that agreement of the composed and direct transition tables "is not itself a proof of conditional independence" (§5.1).

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") ([PDF p. 5](https://arxiv.org/pdf/2506.18203#page=5)) §4.2.1 (PDF p. 5) and App. B.1 (PDF p. 19); [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") ([PDF p. 12](https://arxiv.org/pdf/2604.18245#page=12)) §5.1 (PDF p. 12). [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") has an open erratum on App. B.1.1 Eq. 8 (wrong arguments in the pairwise moment equation derived under this assumption), so cite §4.2.1 and App. B.1 for the assumption, not App. B.1.1.

**Related:** [weak supervision](#/glossary/weak-supervision), [latent variable](#/glossary/latent-variable), [Markov chain](#/glossary/markov-chain), [exchangeability](#/glossary/exchangeability)


<a id="confidence-interval-and-coverage"></a>

## Confidence interval and coverage

A 95% confidence interval comes from a procedure that, over many repeats of the experiment, would give intervals containing the true value 95% of the time; 95% is its nominal coverage. A single computed interval either contains the truth or not; the 95% describes the procedure. The actual coverage, the share of repeats in which the interval really contains the truth, can fall short of the nominal one when the procedure's assumptions fail, for instance with few data points ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §1).

In [Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)")'s words, "if we rerun the experiment and construct the CI using a different set of runs, the fraction of calculated CIs ... that contain the true score would tend towards α × 100%, where ... α is the nominal coverage rate" (§2).

**Learn more:** [Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)") §2; [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §1 and §3, which measure the coverage of several interval methods.

**Related:** [Bayesian credible interval](#/glossary/bayesian-credible-interval), [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt), [Wilson score interval](#/glossary/wilson-score-interval), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval), [Wald interval](#/glossary/wald-interval), [bootstrap resampling](#/glossary/bootstrap-resampling), [confidence sequence (anytime-valid inference)](#/glossary/confidence-sequence-anytime-valid-inference)


<a id="confidence-sequence-anytime-valid-inference"></a>

## Confidence sequence (anytime-valid inference)

A sequence of confidence intervals, one after each new observation, that all contain the true value at the same time with probability at least 1 − δ. An ordinary interval is valid only at a sample size fixed in advance: checking it again and again and stopping when it looks good breaks its guarantee. A confidence sequence, like anytime-valid tests in general, stays valid wherever one stops, even when the stopping time depends on the data (general definition).

Example: [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") wraps its estimator in "an empirical-Bernstein confidence sequence" (§1), whose width adapts to the observed variance (see [concentration inequality](#/glossary/concentration-inequality)), so that its verdicts hold "simultaneously for all t ≥ 1" (§5.1).

**Learn more:** [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §1, §4 and §5.1, citing Howard et al. (2021) and Waudby-Smith and Ramdas (2024), not listed here; [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §2 and §4, for anytime-valid tests.

**Related:** [E-process (testing by betting)](#/glossary/e-process-testing-by-betting), [sequential probability ratio test (SPRT)](#/glossary/sequential-probability-ratio-test-sprt), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [concentration inequality](#/glossary/concentration-inequality)


<a id="conformal-prediction-and-conformal-risk-control"></a>

## Conformal prediction and conformal risk control

Methods that turn any model's scores into guarantees using a held-out calibration set, assuming only that calibration cases and test cases are [exchangeable](#/glossary/exchangeability) (general definition). Split conformal prediction picks a score threshold on the calibration set so that prediction sets contain the true answer at a chosen rate. Conformal risk control "extends split conformal prediction to expected control of monotone losses" ([Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") §2): it "selects a threshold on a calibration set so that the expected value of a bounded, monotone loss is at most a nominal level α on exchangeable test data" (§1).

For abstention the loss is 1 when the system answers and is wrong, so the guarantee bounds the rate of wrong answers.

Variants on this site: conformal selection, which picks the test cases to accept while bounding the [false discovery rate](#/glossary/false-discovery-rate-fdr) among them, e.g. by split-conformal Benjamini–Hochberg ([ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") §2); and online conformal prediction, which adjusts a threshold after each outcome so that a long-run error rate tracks a target (general definition), named by [When to Trust the Cheap Check](#/papers/kiyani2026weakstrong "When to Trust the Cheap Check: Weak and Strong Verification for Reasoning (2026)") §5 as sharing a limitation of its own threshold updates.

Other senses: [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") calls the resulting promise a "conformal abstention certificate"; it is a statistical guarantee, not checkable evidence in the sense of this glossary's [certificate](#/glossary/certificate).

**Learn more:** [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") §1 and §2, citing Angelopoulos et al. (2024), not listed here; [ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") §2, citing Jin and Candès (2023), not listed here.

**Related:** [selective prediction](#/glossary/selective-prediction), [learn-then-test (LTT)](#/glossary/learn-then-test-ltt), [exchangeability](#/glossary/exchangeability), [calibration](#/glossary/calibration), [certificate](#/glossary/certificate)


<a id="confounder"></a>

## Confounder

A variable that affects both which cases get a treatment and their outcome, so that a raw comparison of treated and untreated cases mixes the treatment's effect with the variable's (general definition). Example: [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") treats the prompt's state before an edit as the confounder of an edit's effect on accuracy (§2), and names unmeasured ones, such as optimizers inserting meta-instructions after earlier failures (§4.1).

**Learn more:** [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") §2 and §4.1, which use the term without defining it (general definition).

**Related:** [propensity score and inverse probability weighting (IPTW)](#/glossary/propensity-score-and-inverse-probability-weighting-iptw), [exchangeability](#/glossary/exchangeability), [average treatment effect (ATE)](#/glossary/average-treatment-effect-ate)


<a id="confusion-matrix"></a>

## Confusion matrix

A table of a classifier's results with one row per true class and one column per predicted class: each cell counts the items of that true class given that predicted label, so the diagonal holds the correct ones and the other cells show which classes are mistaken for which (general definition). With two classes its four cells are the true and false positives and negatives. [SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)")'s optimizer builds "the EXPECTED×PARSED confusion matrix" of a judge prompt's labels and targets "the most-confused class pair" (§1).

**Learn more:** [SPEAR](#/papers/lu2026spear "SPEAR: Code-Augmented Agentic Prompt Optimization (2026)") §1, which uses it without defining it (general definition).

**Related:** [true and false positive rates](#/glossary/true-and-false-positive-rates), [F1 score](#/glossary/f1-score), [macro recall (balanced accuracy)](#/glossary/macro-recall-balanced-accuracy), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="conjunctive-query"></a>

## Conjunctive query

A query built only from joins, equality conditions and projection: in SQL, `SELECT … FROM … WHERE` with `AND`ed equalities, and no `OR`, `NOT`, aggregates or subqueries. In logic it reads "the output values for which there exist values of the other variables that make all these facts true". Many papers extend the class with comparisons such as `<` and `≤` between variables and constants (e.g. [On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)"), "conjunctive queries containing inequalities"); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") §5 treats such comparisons.

Example ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2): "departments that sell pens and pencils" is `(x). Sales(x, pen) ∧ Sales(x, pencil)`, or in SQL `SELECT s1.dept FROM Sales s1, Sales s2 WHERE s1.dept = s2.dept AND s1.item = 'pen' AND s2.item = 'pencil'`.

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2), which defines it under set semantics; [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §3.1 (PDF p. 3), for the SQL form and its bag semantics.

**Related:** [union of conjunctive queries](#/glossary/union-of-conjunctive-queries), [homomorphism](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment)


<a id="consensus-clustering"></a>

## Consensus clustering

Combining several clusterings of the same items into one: run each clustering, record for each pair of items how often they land in the same cluster, and cluster again on that co-assignment frequency, which is steadier than any single run (general definition). [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") clusters per-task skill cards nine ways (three linkage rules, each at three cluster counts); "that co-occurrence frequency becomes a consensus similarity", and its final skill families come from clustering on it (§3.3; App. B).

**Learn more:** [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") §3.3 and App. B.

**Related:** [agglomerative clustering](#/glossary/agglomerative-clustering), [silhouette score](#/glossary/silhouette-score), [knee point (Kneedle)](#/glossary/knee-point-kneedle), [ensemble methods](#/glossary/ensemble-methods)


<a id="constrained-decoding"></a>

## Constrained decoding

Generating text while allowing, at each step, only the tokens that keep the output valid under a grammar or format, so that the result is guaranteed to parse (as SQL or JSON, say). [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §4.3.1 describes it as decoding that "allows only outputs following some fixed grammar" (it writes "constraint decoding"), and names its costs for SQL: the full grammar over arbitrary schemas is hard to capture, and checking it while decoding adds latency.

**Learn more:** [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §4.3.1.

**Related:** [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling)


<a id="constraint-optimization-problem-cop"></a>

## Constraint optimization problem (COP)

A [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) with an objective to minimize or maximize: a solution must meet every constraint and also be optimal (general definition). A checker for one must therefore test optimality, not only feasibility. [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §4.1 draws its benchmark's problems, some of each kind, from CSPLib and other sources, and each ships with a verifier for "CSP feasibility and COP optimality".

**Learn more:** [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §4.1–4.2, which use it without defining it (general definition).

**Related:** [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem), [linear programming (LP and MILP)](#/glossary/linear-programming-lp-and-milp), [complete and incomplete search](#/glossary/complete-and-incomplete-search)


<a id="constraint-propagation"></a>

## Constraint propagation

A constraint solver's step of removing, from each variable's possible values, those that cannot be part of any solution given the constraints, before and between search decisions; each removal can enable more (general definition). How well a model propagates depends on how its constraints are written: [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §5.1–5.2 reports LLM-written rewrites that "weaken propagation" (Mode B) and redundant machinery added where "CP-SAT's propagation already does the work".

**Learn more:** [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §5.1–5.2, which use it without defining it (general definition).

**Related:** [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem), [big-M constraint](#/glossary/big-m-constraint), [search annotation](#/glossary/search-annotation), [symmetry breaking](#/glossary/symmetry-breaking)


<a id="constraint-satisfaction-problem"></a>

## Constraint satisfaction problem

A problem stated as variables, the values each may take, and constraints that the values must satisfy together; a solution gives every variable a value that meets all the constraints (general definition). Constraint solvers search for such solutions. EvoSQL's authors describe earlier SQL test-data generators that "transform the test data generation problem into a constraint satisfaction problem" and solve it with tools such as Alloy and Choco. They report that, because of "limitations of the existing constraint solver tools", these approaches commonly do not support strings, and that "mapping the entire SQL language to a constraint satisfaction problem is a highly complex task", so joins and subqueries are often unsupported too; EvoSQL uses search instead ([EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §1).

**Learn more:** [EvoSQL](#/papers/castelein2018evosql "Search-Based Test Data Generation for SQL Queries (2018)") §1 (PDF p. 1), which cites Tsang's textbook (not listed here) without defining the term (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [branch distance](#/glossary/branch-distance), [symmetry breaking](#/glossary/symmetry-breaking)


<a id="context-compaction"></a>

## Context compaction

A harness feature that shortens an agent's conversation history when it grows too long for the context window, typically by replacing older turns with a summary (general definition). [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") modifies one harness "to enable context compaction" for its long multi-turn coding sessions (§4), and lists "calling tools during compaction" among the agents' infrastructure failures (§5).

**Learn more:** [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") §4 and §5, which use the term without defining it (general definition).

**Related:** [agent harness](#/glossary/agent-harness), [lost in the middle](#/glossary/lost-in-the-middle), [progressive disclosure](#/glossary/progressive-disclosure)


<a id="context-engineering"></a>

## Context engineering

Choosing and arranging what goes into a model's context window, and managing it as a task runs: which instructions, documents, tool results and history to include, where, and what to drop or summarize. [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") defines it as "the careful construction and management of a model's context window" and argues that "where and how information is presented in a model's context strongly influences task performance" (§ "Limitations & Future Work", PDF p. 42).

**Learn more:** [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") § "Limitations & Future Work" (PDF p. 42).

**Related:** [context rot](#/glossary/context-rot), [context compaction](#/glossary/context-compaction), [agent harness](#/glossary/agent-harness), [progressive disclosure](#/glossary/progressive-disclosure)


<a id="context-rot"></a>

## Context rot

A model's answers getting worse as its input grows longer, even well within its context window. [LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)") §1: "As more tokens are added, performance often becomes less consistent and more error-prone, an effect commonly referred to as 'context rot'"; [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §1 describes quality that "degrades steeply as prompts get longer". Both papers cite [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") for the term, a report from Chroma titled "Context Rot", which measures the effect by extending [needle-in-a-haystack](#/glossary/needle-in-a-haystack-niah) tests (PDF p. 3). It is related to, but wider than, [lost in the middle](#/glossary/lost-in-the-middle), which is about where in the input the needed part sits.

**Learn more:** [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") (title, PDF p. 1; the test, PDF p. 3); [LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)") §1; [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §1.

**Related:** [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah), [lost in the middle](#/glossary/lost-in-the-middle), [context engineering](#/glossary/context-engineering), [context compaction](#/glossary/context-compaction)


<a id="context-free-grammar"></a>

## Context-free grammar

A grammar in which every rule rewrites one non-terminal symbol into a sequence of terminal and non-terminal symbols, wherever that non-terminal appears. [A logic for rule-based…](#/papers/coburn1993logic "A logic for rule-based query optimization in graph-based data models (1993)") §2 gives the formal version: a grammar is a set of non-terminal symbols, a set of terminal symbols, a start symbol and a finite set of production rules, and "In a context-free grammar the left-hand-side of each production rule contains a single element of N" (the non-terminals). [BNF](#/glossary/bnf-backus-naur-form) is a notation for such grammars: [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") assumes each domain-specific language's grammar "is a context-free grammar in Backus–Naur Form (BNF)" (§2.1), with rules of the form `<symbol> ::= <expr1> | <expr2> | ...`, where each alternative "is a sequence of nonterminal and terminal symbols" (§3).

**Learn more:** [A logic for rule-based…](#/papers/coburn1993logic "A logic for rule-based query optimization in graph-based data models (1993)") §2 (PDF p. 5); [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") ([PDF p. 2](https://arxiv.org/pdf/2305.19234#page=2)) §2.1 and §3 (PDF pp. 2–3).

**Related:** [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [Earley parser](#/glossary/earley-parser), [constrained decoding](#/glossary/constrained-decoding), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)


<a id="contextual-bandit"></a>

## Contextual bandit

A one-step decision problem: each round the learner sees a context (a situation, such as a prompt), picks one action, and gets a reward for that action alone; the action does not change later contexts, so there is no credit to assign across steps (general definition). It is [reinforcement learning](#/glossary/reinforcement-learning) with episodes one step long, and a [multi-armed bandit](#/glossary/multi-armed-bandit-ucb) whose best arm depends on the context.

Examples: [Learning to Self-Evolve (LSE)](#/papers/chen2026lse "Learning to Self-Evolve (2026)") trains its context editor on single edits "rewarded immediately", which "reduces the problem to a contextual bandit and avoids the long-horizon credit-assignment difficulty" (§3.3). [Verifier Errors in RLVR](#/papers/moya2026verifiererrors "Verifier Errors in RLVR: Reward Hacking, Limits of Feedback, and Selective Control (2026)") tests its theory first in "Gaussian contextual bandits", a controlled setting with fixed prompts, each with fixed candidate responses chosen by a softmax policy over response features, before a language model (§6.1; App. D.1).

**Learn more:** [Learning to Self-Evolve (LSE)](#/papers/chen2026lse "Learning to Self-Evolve (2026)") ([PDF p. 5](https://arxiv.org/pdf/2603.18620#page=5)) §3.3 (PDF p. 5); [Verifier Errors in RLVR](#/papers/moya2026verifiererrors "Verifier Errors in RLVR: Reward Hacking, Limits of Feedback, and Selective Control (2026)") ([PDF p. 8](https://arxiv.org/pdf/2609.35677#page=8)) §6.1 (PDF p. 8) and App. D.1 (PDF p. 31). Neither defines the term (general definition). [Learning to Self-Evolve (LSE)](#/papers/chen2026lse "Learning to Self-Evolve (2026)") has an open erratum on another claim of §3.3 (the post-edit reward's "bias"), not on this sentence.

**Related:** [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb), [reinforcement learning](#/glossary/reinforcement-learning), [credit assignment problem](#/glossary/credit-assignment-problem), [Markov decision process](#/glossary/markov-decision-process)


<a id="continual-learning"></a>

## Continual learning

Learning from a sequence of tasks or a changing environment, so that later learning builds on earlier learning without losing it; the main failure is [catastrophic forgetting](#/glossary/catastrophic-forgetting) (general definition). [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") argues that the field's framing as "context management and mitigating forgetting" is incomplete: "continual learning is fundamentally about increasing model competence as the world changes" (abstract). LLM agents can also learn continually without changing weights: [ContinualSkillBench](#/papers/guan2026continualskill "ContinualSkillBench: Can LLM Agents Truly Evolve Their Capabilities? (2026)") §2 has agents "achieve lifelong learning" through a growing skill library "without fine-tuning their parameters".

**Learn more:** [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") abstract; [ContinualSkillBench](#/papers/guan2026continualskill "ContinualSkillBench: Can LLM Agents Truly Evolve Their Capabilities? (2026)") §2. Neither gives a formal definition (general definition).

**Related:** [catastrophic forgetting](#/glossary/catastrophic-forgetting), [backward and forward transfer (BWT and FWT)](#/glossary/backward-and-forward-transfer-bwt-and-fwt), [agent skill](#/glossary/agent-skill), [procedural memory](#/glossary/procedural-memory)


<a id="continual-pre-training"></a>

## Continual pre-training

Continuing a pretrained model's next-token training on new raw text, such as code or a domain's documents, before any instruction tuning (general definition). [CodeI/O](#/papers/li2025codeio "CodeI/O: Condensing Reasoning Patterns via Code Input-Output Prediction (2025)") places its own training stage "Similar to continual pre-training on raw code", before general instruction tuning (§1), and [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") explains which domains gain from other domains' RL data by the base model's exposure "during continual pretraining" (§1).

**Learn more:** [CodeI/O](#/papers/li2025codeio "CodeI/O: Condensing Reasoning Patterns via Code Input-Output Prediction (2025)") §1; [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") §1. Neither defines it (general definition).

**Related:** [catastrophic forgetting](#/glossary/catastrophic-forgetting), [distillation](#/glossary/distillation)


<a id="contrastive-learning"></a>

## Contrastive learning

Training an encoder so that matching pairs (a query and a useful example for it, two forms of the same item) get similar vectors and non-matching pairs get dissimilar ones. Hard negatives are non-matching items that the current encoder already places close: CrackSQL selects samples that "have different functionality" from an SQL syntax element "but … possess embeddings similar to" it, so that its encoder learns to tell them apart ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") §5.2.2, PDF p. 13). LLM-R² trains a query encoder this way to choose demonstrations for its rewriting prompts ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §5.1).

**Learn more:** [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") ([PDF p. 13](https://arxiv.org/pdf/2504.00882#page=13)) §5.2.2 (PDF p. 13); [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §5.1, with its loss. Neither defines the general term (general definition).

**Related:** [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="control-variate"></a>

## Control variate

A term with a known expected value (often zero) subtracted from a random estimate to cancel part of its noise: the estimate's expected value is unchanged, but when the term moves together with the estimate its variance drops (general definition). In [policy gradient](#/glossary/policy-gradient) methods, a baseline that doesn't depend on the action is one. Example: [Learning to Self-Evolve (LSE)](#/papers/chen2026lse "Learning to Self-Evolve (2026)") uses the context's reward before an edit as the baseline: "Because R̄(c₀) is action-independent, using it as a baseline does not alter the expected gradient. It is, however, a control variate that cancels prompt-specific offsets" (§3.3).

**Related:** [policy gradient](#/glossary/policy-gradient) (where baseline and advantage are defined), [value function](#/glossary/value-function), [actor-critic](#/glossary/actor-critic)


<a id="coordinate-ascent"></a>

## Coordinate ascent

Improving a function of several variables by changing one variable (or one block of them) at a time while the rest stay fixed, cycling through them. It stops where no single-variable change helps, which need not be the best point overall. OPTIMAS argues that its component-by-component updates of a multi-component LLM system amount to "coordinate maximization", so convergence results for that method apply, and notes that such round-robin updates "do not guarantee global optimality" ([Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §4.4).

**Learn more:** [Optimas](#/papers/wu2025optimas "Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards (2026)") §4.4 and App. B (proof of its convergence theorem).

**Related:** [hill climbing](#/glossary/hill-climbing), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="copelands-method"></a>

## Copeland's method

A voting rule that compares every pair of candidates head to head: the winner of each comparison gets a point, and the candidate with the most points wins (Copeland 1951, not listed here). [ExPairT-LLM](#/papers/yuviler2025expairt "ExPairT-LLM: Exact Learning for LLM Code Selection by Pairwise Queries (2026)") § "Pairwise Membership & Equivalence Queries" calls it "a voting system that determines the winner by head-to-head comparisons between each pair" of candidates and uses it to pick a program: the candidates are clusters of programs with the same outputs, and each comparison asks an LLM which of two output lists fits the task (same section, Alg. 1).

**Learn more:** [ExPairT-LLM](#/papers/yuviler2025expairt "ExPairT-LLM: Exact Learning for LLM Code Selection by Pairwise Queries (2026)") § "Pairwise Membership & Equivalence Queries" (its sections are unnumbered).

**Related:** [Bradley-Terry model](#/glossary/bradley-terry-model), [Elo rating](#/glossary/elo-rating), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="copula"></a>

## Copula

A way to build a joint distribution of several random quantities from their separate (marginal) distributions plus a chosen form of dependence between them (general definition). In a Gaussian copula the quantities are driven by correlated hidden normal scores, and a single-factor version has one shared hidden factor; a Clayton copula gives joint extreme lows more weight (positive lower tail dependence). Example: [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") models LLMs' errors with a single-factor Gaussian copula and notes that a Gaussian copula with correlation below one "has zero lower tail dependence", so the chance that every model in a large pool fails together goes to zero as the pool grows (§5, Prop. 2 (i), citing Sibuya and Embrechts et al., not listed here); it checks this against "an exchangeable Clayton copula" (§5).

**Learn more:** [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") §5 and App. B (which has entries on Prop. 2 and on tail dependence). It treats the Gaussian copula as standard without defining copulas (general definition).

**Related:** [tetrachoric correlation](#/glossary/tetrachoric-correlation), [Pearson correlation](#/glossary/pearson-correlation)


<a id="coreset"></a>

## Coreset

A small subset of a dataset chosen so that a computation on it (training a model, scoring a candidate) gives nearly the result the whole set would, at a fraction of the cost (general definition). In prompt and harness optimization it is a subset of tasks chosen once, before the search starts, on which candidates are then verified. [HarnessLens ("Verify Smarter](#/papers/xu2026harnesslens "Verify Smarter, Evolve Further: Efficient Harness Evolution through Behavior-Aware Verification (2026)") contrasts its own per-modification choice of tasks with methods that use "task subsets preselected before evolution" (§1) or "reduce cost using a globally preselected coreset" (§2).

**Learn more:** [HarnessLens ("Verify Smarter](#/papers/xu2026harnesslens "Verify Smarter, Evolve Further: Efficient Harness Evolution through Behavior-Aware Verification (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.27311#page=1)) §1 and §2 (PDF pp. 1–3), which use the term without defining it (general definition). They cite Pan et al. (2026), which is not listed here.

**Related:** [agent harness](#/glossary/agent-harness), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="correlated-subquery"></a>

## Correlated subquery

A subquery that refers to a column of the outer query, so that conceptually it runs again for every outer row. Optimizers rewrite such queries into joins ("decorrelation" or "unnesting").

Example ([Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1): in `SELECT s.name, e.course FROM students s, exams e WHERE s.id = e.sid AND e.grade = (SELECT min(e2.grade) FROM exams e2 WHERE s.id = e2.sid)`, the inner query uses `s.id` from the outer one. The paper's rewrite computes each student's best grade once with `GROUP BY` and joins it in. Such rewrites have gone wrong: a published unnesting algorithm returned wrong answers for subqueries with `COUNT`, the "COUNT bug" ([Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.1, PDF p. 3).

**Learn more:** [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1 (PDF pp. 1–2); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §2.2.2 (PDF p. 3), on how correlated subqueries with aggregates are evaluated.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="cosine-similarity"></a>

## Cosine similarity

A score of how closely two vectors point the same way: their dot product divided by the product of their lengths, which is the cosine of the angle between them, 1 for the same direction and 0 for perpendicular ones (general definition). On text embeddings it is the usual measure of how close two texts are in meaning. [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") uses it to measure how similar each needle is to its question and to the surrounding text (PDF pp. 9, 11–12, 19).

**Learn more:** [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") (PDF pp. 9, 11–12, 19), which uses it without defining it (general definition).

**Related:** [dense retrieval](#/glossary/dense-retrieval), [vector store](#/glossary/vector-store), [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns)


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


<a id="covering-index"></a>

## Covering index

An [index](#/glossary/index-database) that holds every column a query needs from its table, so the query can be answered from the index alone (an index-only scan) without reading the table (general definition). Its **key columns** are the ones it is sorted on, in order, so a lookup (seek) or ordered read on them is fast; its **included columns** are only stored in it, to cover the query. [LLM-driven index tuning on SQL Server](#/papers/wang2026indextuning "Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server (2026)") §4.1 lists among GPT-5's rules of thumb "introduce covering indexes when possible to enable index‑only scans and avoid expensive full table scans" (PDF p. 7); its rule-based tuner orders key columns by when the query plan first uses them (filter, then join, then ordering in its example) and adds "Any additional referenced columns from the same table (e.g., those needed by projection)" as included columns (§4.2).

**Learn more:** [LLM-driven index tuning on SQL Server](#/papers/wang2026indextuning "Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server (2026)") ([PDF p. 7](https://arxiv.org/pdf/2603.09181#page=7)) §4.1–4.2 (PDF p. 7) and §2.2.1, which use the terms without a general definition (general definition).

**Related:** [index (database)](#/glossary/index-database), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [query optimizer](#/glossary/query-optimizer)


<a id="covering-number"></a>

## Covering number

For a set with a notion of distance, the ε-covering number is the smallest number of points such that every member of the set lies within distance ε of one of them; such a set of points is an ε-cover. It measures how large or varied a set is at resolution ε (general definition). Learning theory uses it as one measure of how complex a hypothesis class is in [uniform convergence](#/glossary/uniform-convergence) bounds: [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") names "VC dimension, covering numbers, fat-shattering dimension and Rademacher complexity" among the notions such arguments rest on (§2.2). [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") uses it to measure an attacker's work. It argues that if the behaviour its probe generator lets a model exploit "admits an ε-cover of size N(ε)", defeating its probe rotation costs Θ(N(ε)), not the size of the probe pool (§3.4; App. D.3). It leaves "the generator's covering number as the open question" (§5).

**Learn more:** [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") ([PDF p. 7](https://arxiv.org/pdf/1506.02629#page=7)) §2.2 (PDF p. 7); [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") ([PDF p. 6](https://arxiv.org/pdf/2609.04665#page=6)) §3.4 (PDF p. 6), §5 (PDF p. 9) and App. D.3 (PDF p. 14), which defines N(ε) as the ε-covering number of a function family under a pseudometric. Neither states the general definition (general definition).

**Related:** [uniform convergence](#/glossary/uniform-convergence) (proposed below), [concentration inequality](#/glossary/concentration-inequality)


<a id="credit-assignment-problem"></a>

## Credit assignment problem

Working out which of an agent's earlier actions caused a later success or failure, when the feedback comes only at the end. [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §1 says useful verbal reflections require solving it, citing Sutton and Barto.

**Learn more:** [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)") §1; nothing on this site treats it in depth.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward shaping](#/glossary/reward-shaping)


<a id="critical-batch-size"></a>

## Critical batch size

In training with gradient steps, the batch size beyond which larger batches stop shortening training much: below it, doubling the batch roughly halves the steps needed; above it, the gain shrinks (general definition, after McCandlish et al. 2018, not listed here). [Combee](#/papers/li2026combee "Combee: Scaling Parallel Prompt Learning for Self-Improving LLM Agents (2026)") uses it as an analogy for its prompt-learning batches: as batch size grows, per-epoch delay falls "but with diminishing returns, analogous to the critical batch size concept from distributed training" (§3.3).

**Learn more:** [Combee](#/papers/li2026combee "Combee: Scaling Parallel Prompt Learning for Self-Improving LLM Agents (2026)") §3.3, which names the concept and cites McCandlish et al. (2018) without defining it (general definition).


<a id="cross-encoder"></a>

## Cross-encoder

A model that reads the query and a candidate answer or document together, as one concatenated input, and outputs a single score for the pair (general definition, matching [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") §6). It is usually more accurate than encoding the two separately and comparing their vectors, as [dense retrieval](#/glossary/dense-retrieval) does, but it must be run once per pair (general definition).

Example: [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") distills its ensemble of verifiers into a 400M-parameter cross-encoder: "the input is a concatenated query-response pair, while the output is" the ensemble's estimated probability that the response is correct (§6).

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") ([PDF p. 10](https://arxiv.org/pdf/2506.18203#page=10)) §6 (PDF p. 10).

**Related:** [dense retrieval](#/glossary/dense-retrieval), [reranking](#/glossary/reranking), [distillation](#/glossary/distillation), [reward model](#/glossary/reward-model)


<a id="cross-fitting"></a>

## Cross-fitting

Split the items into k folds; for each fold, estimate the parameters a method needs on the other k − 1 folds and apply the method to the held-out fold; then pool the held-out results. No item is used both to fit the parameters and to evaluate the decision made with them, which keeps the evaluation from rewarding parameters fitted to the items they are scored on. [VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") calibrates its stopping rule this way with five folds (App. B).

**Learn more:** [VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") App. B, "Calibration protocol and cross-fitting".

**Related:** [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [expectation-maximization (EM)](#/glossary/expectation-maximization-em)


<a id="cross-validation-and-out-of-sample-predictions"></a>

## Cross-validation and out-of-sample predictions

Split the data into k parts (folds); for each fold, fit on the other folds and predict or evaluate on the held-out one, so that every item gets a prediction from a model that never saw it: an out-of-sample prediction (general definition). It keeps a result from rewarding a fit to the very items it is scored on.

Examples: [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") picks its best test-time strategy per difficulty bin with "two-fold cross validation": it selects the strategy on one fold, measures it on the other, and vice versa (§3.2). [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") fine-tunes on a test set "using cross-validation to ensure" the predicted class probabilities "are out-of-sample", the input its label-error finder needs (§3).

**Learn more:** [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") ([PDF p. 6](https://arxiv.org/pdf/2408.03314#page=6)) §3.2 (PDF p. 6); [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") ([PDF p. 4](https://arxiv.org/pdf/2103.14749#page=4)) (unchecked) §3 (PDF p. 4). Neither defines the term (general definition).

**Related:** [cross-fitting](#/glossary/cross-fitting), [overfitting](#/glossary/overfitting), [label noise](#/glossary/label-noise), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


<a id="crud"></a>

## CRUD

Create, Read, Update, Delete: the four basic kinds of operation on stored data. In SQL they correspond to `INSERT`, `SELECT`, `UPDATE` and `DELETE` (general definition), and [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") App. C gives the standard "CRUD (Create, Read, Update, Delete) mapping" of a [REST API](#/glossary/rest-api): POST creates an entity, GET lists or reads, PATCH updates, DELETE removes. Text-to-SQL benchmarks are compared by how much of this range they cover: [DySQL-Bench](#/papers/sun2025dysqlbench "Rethinking Text-to-SQL: Dynamic Multi-turn SQL Interaction for Real-world Database Exploration (2025)") says most of them "still emphasize read-only SELECT queries and provide little to no assessment of write operations, INSERT/UPDATE/DELETE" (§I), and [BIRD-INTERACT](#/papers/huo2025birdinteract "BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions (2026)") describes its tasks as "spanning the full CRUD spectrum (Create, Read, Update, and Delete)" (§3.4). [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") uses the word for an agent memory's write tools: a post-task curator agent is set up "with memory CRUD" (§1).

**Learn more:** [BIRD-INTERACT](#/papers/huo2025birdinteract "BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions (2026)") §3.4; [DySQL-Bench](#/papers/sun2025dysqlbench "Rethinking Text-to-SQL: Dynamic Multi-turn SQL Interaction for Real-world Database Exploration (2025)") §I; [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") ([PDF p. 18](https://arxiv.org/pdf/2606.19613#page=18)) (unchecked) App. C (PDF p. 18); [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") §1 and §3.3. The first two spell the acronym out without defining it further (general definition).

**Related:** [SQL statement categories (DDL, DML, DQL, DCL, TCL)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl), [text-to-SQL](#/glossary/text-to-sql), [REST API](#/glossary/rest-api)


<a id="curriculum-learning"></a>

## Curriculum learning

Training on tasks in a planned order, usually from easy to hard, so that the model gets a learning signal early and moves on to harder tasks once it handles the easier ones. The RL papers here use two forms: choosing or generating tasks by difficulty, and switching on harder reward targets in stages.

Examples: DeepSeek-Prover-V2 turns the subgoals of hard theorems into easier lemma statements and adds them to its training rounds, "progressively increasing the difficulty of training tasks" ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") §1, §2.1). E3-Rewrite trains first with only its executability and equivalence rewards and adds its performance reward once the model "consistently satisfies correctness constraints" ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") § "Reinforcement Learning for SQL Rewriting", not latency). SPA's PGARS "functions as a query-level curriculum": a reward for a higher milestone (syntax validity, semantic equivalence, plan divergence, runtime speedup, in that order) "is unlocked only when the rollout group exhibits consistent success in all preceding milestones" ([SPA](#/papers/huang2026spa "SPA: A SQL-Plan-Aware Reinforcement Learning Framework for Query Rewriting with LLMs (2026)") §3.5), a form of [reward shaping](#/glossary/reward-shaping).

**Learn more:** [DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.21801#page=2)) §1 (PDF p. 2) and §2.1 (PDF p. 4); [E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)") ([PDF p. 4](https://arxiv.org/pdf/2508.09023#page=4)) § "Reinforcement Learning for SQL Rewriting" (PDF pp. 4–5); [SPA](#/papers/huang2026spa "SPA: A SQL-Plan-Aware Reinforcement Learning Framework for Query Rewriting with LLMs (2026)") ([PDF p. 6](https://arxiv.org/pdf/2606.08620#page=6)) §3.5 (PDF p. 6). Bengio et al. (2009), which E3-Rewrite cites for the idea, is not listed here.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [reward shaping](#/glossary/reward-shaping), [expert iteration](#/glossary/expert-iteration), [cold start](#/glossary/cold-start), [self-play](#/glossary/self-play)


<a id="cusum-cumulative-sum-change-detection"></a>

## CUSUM (cumulative-sum change detection)

Page's (1954) detector for a change in a stream of observations: add a score for each observation (positive when it looks like the changed regime, negative otherwise), reset the running sum to zero whenever it goes below zero, and raise an alarm when it crosses a threshold (general definition; Page's paper is not listed here). [Many Steps into One](#/papers/zhou2026contraction "Many Steps into One: Reasoning Contraction and the Limits of Safe Memory Reuse for LLM Agents (2026)") shows that the up-and-down counters agents use to trust or drop stored memories are of this form: "Every score rule … is exactly Page's CUSUM" for one particular change, and it sets each memory's scores from its own failure rates (§3).

**Learn more:** [Many Steps into One](#/papers/zhou2026contraction "Many Steps into One: Reasoning Contraction and the Limits of Safe Memory Reuse for LLM Agents (2026)") §3.

**Related:** [sequential probability ratio test (SPRT)](#/glossary/sequential-probability-ratio-test-sprt), [e-process (testing by betting)](#/glossary/e-process-testing-by-betting), [confidence sequence (anytime-valid inference)](#/glossary/confidence-sequence-anytime-valid-inference)


<a id="cyclomatic-complexity"></a>

## Cyclomatic complexity

A count of the independent paths through a piece of code: one plus the number of decision points (each if, loop condition or case branch) in it, so straight-line code scores 1 and every branch or loop adds one (general definition). It is a common measure of how hard code is to read and test. Example: [ProcArena](#/papers/zhang2026procarena "ProcArena: A Multi-Scenario Benchmark for LLMs on Direct and Interactive PL/SQL Development from Natural Language (2026)") reports that the reference procedures of its PL/SQL benchmark average "32.1 statements and 18.6 cyclomatic complexity, compared with 10.7 statements and 6.8 cyclomatic complexity for PLForge Hard" (§4.1, Tab. 3).

**Learn more:** [ProcArena](#/papers/zhang2026procarena "ProcArena: A Multi-Scenario Benchmark for LLMs on Direct and Interactive PL/SQL Development from Natural Language (2026)") ([PDF p. 7](https://arxiv.org/pdf/2609.06527#page=7)) §4.1 and Tab. 3 (PDF p. 7), which use the term without defining it (general definition).

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [stored procedure and trigger](#/glossary/stored-procedure-and-trigger)


<a id="letter-d"></a>

<a id="dapo"></a>

## DAPO

Decoupled Clip and Dynamic Sampling Policy Optimization, a variant of [GRPO](#/glossary/grpo) by Yu et al. (2025), "specifically designed to maintain exploration and output diversity" ([ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") §2.3). Its two main changes: decoupled clipping ("clip-higher"), which sets the upper clipping bound of the [importance ratio](#/glossary/importance-ratio-and-clipping) separately from the lower one; and dynamic sampling, which drops prompts whose sampled answers all got the same reward (all right or all wrong), because GRPO's group-relative advantages are then zero and give no learning signal ([ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") §2.3; [Noisy Data is Destructive…](#/papers/zhu2026noisyrlvr "Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards (2026)") §5.1).

Gotcha: [Noisy Data is Destructive…](#/papers/zhu2026noisyrlvr "Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards (2026)") notes that with noisy rewards, dynamic sampling "may implicitly filter out failures caused by noise" (§5.1).

**Learn more:** [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") §2.3, which adopts both components; [Noisy Data is Destructive…](#/papers/zhu2026noisyrlvr "Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards (2026)") §5.1. The DAPO paper is not listed here.

**Related:** [GRPO](#/glossary/grpo), [importance ratio and clipping](#/glossary/importance-ratio-and-clipping), [policy entropy](#/glossary/policy-entropy), [PPO](#/glossary/ppo)


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


<a id="data-warehouse"></a>

## Data warehouse

A database built for analysis rather than for running day-to-day transactions: it collects data from many sources and serves complex, read-mostly queries over it, often laid out as fact tables with dimension tables (general definition). A cloud data warehouse is one run as a service by a cloud provider, which stores the data and runs the queries (general definition): [Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)") gathers its databases "from cloud data warehouses, including BigQuery public data, Snowflake Marketplace data, and other platforms" (§2.2), and sets them beside locally hosted databases (Postgres, ClickHouse) and lightweight systems (SQLite, DuckDB) (§2.3). [ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)") uses the cloud warehouse Snowflake "to store extracted data and execute transformation queries that generate target data models" (§2.3), and [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") describes TPC-DS as a decision support benchmark that "models the database and the workload for the data warehouse of a retail product supplier" (§1, PDF p. 1).

**Learn more:** [ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)") §1 and §2.3; [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §1 (PDF p. 1); [Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)") §2.2 and §2.3. None of them defines it (general definition).

**Related:** [ELT pipeline](#/glossary/elt-pipeline), [star and snowflake schemas](#/glossary/star-and-snowflake-schemas), [OLAP and OLTP](#/glossary/olap-and-oltp), [materialized view](#/glossary/materialized-view)


<a id="data-query-and-combined-complexity"></a>

## Data, query and combined complexity

Three ways to measure how hard a database problem is: data complexity lets only the database grow, with the query fixed; query complexity lets only the query grow, with the database fixed; combined complexity lets both grow ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §3, citing Vardi 1982). Because queries are usually "substantially shorter than the entire data base" ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §4, PDF p. 5), "the standard practice is to consider data complexity" ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §7.1), though a problem that is polynomial in data complexity can still blow up as the query grows (same place).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §3 and §7.1 ("SCP vs. SWP"). For a hardness result that counts the database as part of the input, see [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §4 (PDF p. 5); Vardi's paper is not listed here.

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [witness (provenance)](#/glossary/witness-provenance)


<a id="database-migration"></a>

## Database migration

Moving a database from one database system to another: recreating its schema objects (tables, views, stored procedures) in the target system's [SQL dialect](#/glossary/sql-dialect) and, when the data move too, converting types and values so that the same queries still work (general definition). Horizon's authors: "Database migration is a common problem faced by organizations that need to switch between database management systems (DBMS) for reasons such as cost, performance, or features", and schema migration "involves the recreation of database metadata such as tables, views, and stored procedures within the target DBMS to ensure functional equivalence" ([Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §1, PDF p. 1). UniQL migrates BIRD's SQLite databases to 15 other systems with "type mapping, identifier normalization, namespace adaptation, and necessary formatting changes" ([UniQL](#/papers/gao2026uniql "UniQL: Towards Dialect-Universal Benchmarking for Text-to-SQL (2026)") §3.1).

**Learn more:** [Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §1 (PDF p. 1); [UniQL](#/papers/gao2026uniql "UniQL: Towards Dialect-Universal Benchmarking for Text-to-SQL (2026)") §3.1.

**Related:** [SQL dialect](#/glossary/sql-dialect), [transpiler](#/glossary/transpiler), [stored procedure and trigger](#/glossary/stored-procedure-and-trigger), [query equivalence](#/glossary/query-equivalence)


<a id="dataframe"></a>

## Dataframe

A table held in memory by a data-analysis library: rows, and named columns that each hold one type of value. pandas's `DataFrame` for Python is one; Spark, Dask and others offer DataFrame APIs too (general definition).

Example: [RuleFlow](#/papers/singh2026ruleflow "RuleFlow: Generating Reusable Program Optimizations with LLMs (2026)") calls the pandas API "dataframe-centric" (§1); its example rewrite rule applies at run time only "if the matched element is a dataframe" (§2.3), and its runtime checks test properties such as "DataFrame shapes or column types" (§3.3).

**Learn more:** [RuleFlow](#/papers/singh2026ruleflow "RuleFlow: Generating Reusable Program Optimizations with LLMs (2026)") ([PDF p. 1](https://arxiv.org/pdf/2602.09051#page=1)) §1 (PDF p. 1), §2.3 (PDF p. 4) and §3.3 (PDF p. 5), which use it without defining it (general definition).


<a id="datalog"></a>

## Datalog

A query language of logical rules, each written head ← body. The body is a list of atoms over tables, variables and constants, called the rule's subgoals; the head says what the rule derives for every choice of variable values that makes all the subgoals true (general definition; this "subgoal" is not the proof-assistant one in [tactic](#/glossary/tactic)). A program can be recursive, using what it derives to derive more: `Anc(x, y) ← Parent(x, y)` and `Anc(x, z) ← Parent(x, y), Anc(y, z)` compute all ancestors. Database theory often reasons about SQL through non-recursive rules; [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") writes that equivalence testing "is usually performed over Datalog queries (by first translating SQL into Datalog)" (§1).

Example ([Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") Ex. 1.1 and 2.4, PDF pp. 2 and 5): `SELECT DISTINCT Sal FROM Emp E, WorksIn W, Dept D WHERE E.EName = W.EName AND W.Dno = D.Dno AND D.Loc = 'NY'` becomes `Q1(x) ← Emp(y, x) ∧ WorksIn(y, z) ∧ Dept(z, NY)`: one atom per table in `FROM`, with the join conditions turned into shared variables (§1, PDF p. 3). The paper's syntax also lists which variables count toward duplicates, none here.

Neither defines plain Datalog (general definition).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [union of conjunctive queries](#/glossary/union-of-conjunctive-queries), [combined semantics](#/glossary/combined-semantics), [first-order logic](#/glossary/first-order-logic), [magic sets](#/glossary/magic-sets)


<a id="dataset-shift"></a>

## Dataset shift

A difference between the data a model or a quantity is estimated on and the data it is later applied to, such as a change in the mix of input kinds, in how inputs relate to outputs, or in the labels' frequencies (general definition). Estimates that hold on the first population can then be wrong on the second. Also called distribution shift.

Example: [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") notes that its correction and corruption rates differ across task groups, so changing the groups' weights changes what a pooled rate represents, and calls such "changes in the composition of an evaluation task distribution … a form of dataset shift" (§6).

**Learn more:** [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") ([PDF p. 14](https://arxiv.org/pdf/2604.18245#page=14)) §6 (PDF p. 14), which uses it without defining it, citing Quiñonero-Candela et al. (2009) and Sugiyama and Kawanabe (2012), not listed here (general definition).

**Related:** [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [data contamination](#/glossary/data-contamination), [exchangeability](#/glossary/exchangeability), [subpopulation shift](#/glossary/subpopulation-shift)


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


<a id="declarative-programming"></a>

## Declarative programming

Writing a program as a description of what a solution must satisfy, such as variables and constraints, and leaving how to find it to a solver or search procedure (general definition). SQL, [Datalog](#/glossary/datalog) and constraint-modelling languages are declarative. [A Reality Check of…](#/papers/amonkar2025realitycheck "A Reality Check of Language Models as Formalizers on Constraint Satisfaction Problems (2026)") splits an LLM's formalization of a planning problem into a "declarative component (i.e., the variables and constraints)" and a search component (§4), and says formalization "decouples problem description from solution via declarative programming, leaving the heavy-lifting of search to the solver" (§5.2).

**Learn more:** [A Reality Check of…](#/papers/amonkar2025realitycheck "A Reality Check of Language Models as Formalizers on Constraint Satisfaction Problems (2026)") §4 and §5.2, which use it without defining it (general definition).

**Related:** [logic programming](#/glossary/logic-programming), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem), [answer set programming](#/glossary/answer-set-programming), [autoformalization](#/glossary/autoformalization)


<a id="decoder-only-and-encoder-decoder-models"></a>

## Decoder-only and encoder-decoder models

Two transformer designs. A decoder-only model, such as the GPT and Llama families, reads and writes one sequence left to right; at each position it "may only attend to prior tokens" ([Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)") §4.1). An encoder-decoder model, such as T5, first reads the whole input with a "bidirectional encoder", so each part is processed in light of what comes before and after it, and then a decoder generates the output (§4.1–4.2). The authors report that encoder-decoder models are more robust to where the relevant information sits, but only on inputs no longer than those seen in training (§1, §4.1).

**Learn more:** [Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)") §4.1–4.2.

**Related:** [lost in the middle](#/glossary/lost-in-the-middle), [masked language model](#/glossary/masked-language-model), [KV cache](#/glossary/kv-cache)


<a id="delta-debugging"></a>

## Delta debugging

An algorithm that automatically shrinks a failure-inducing input (a long SQL query that crashes a database, say): it repeatedly removes parts and keeps each smaller version that still fails, until removing any further part makes the failure go away. Test-case reduction is the general task; delta debugging (Zeller and Hildebrandt, 2002, not listed here) is the classic method for it.

**Learn more:** [ACME](#/papers/jiang2026acme "ACME: Automated Clause Mapping Engine for Testing Emerging Database Systems (2026)") §5.1 (PDF p. 12), which reduces its bug-triggering queries with it; [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §6.2, test-case reduction of SQL queries as a query-rewriting use case.

**Related:** [fuzzing](#/glossary/fuzzing), [differential testing](#/glossary/differential-testing)


<a id="delta-method"></a>

## Delta method

A way to get an approximate [standard error](#/glossary/standard-error), and so an interval based on the [central limit theorem](#/glossary/central-limit-theorem-clt), for a smooth function of estimates (a ratio, an F1 score), by a first-order Taylor expansion around the estimates ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.5, App. A.4). Like the CLT it relies on large samples.

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.5 and App. A.4, citing Oehlert (1992), not listed here.

**Related:** [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt), [odds ratio](#/glossary/odds-ratio), [F1 score](#/glossary/f1-score)


<a id="denotation-accuracy"></a>

## Denotation accuracy

The share of questions whose predicted answer equals the gold answer, where the answer (the denotation) is what a query or logical form evaluates to, or what a model outputs directly. TAPEX's metric for table question answering "checks whether the predicted answer(s) is equal to the ground-truth answer(s)" ([TAPEX](#/papers/liu2021tapex "TAPEX: Table Pre-training via Learning a Neural SQL Executor (2022)") §4), with answers generated directly, not by running a query. In text-to-SQL, the denotation is a query's result on a database ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §2), and comparing denotations on the one database a dataset ships ("single denotation evaluation", §1) is [execution accuracy](#/glossary/execution-accuracy), which the paper calls "single execution accuracy" (§6.3).

**Learn more:** [TAPEX](#/papers/liu2021tapex "TAPEX: Table Pre-training via Learning a Neural SQL Executor (2022)") §4 ("Dataset and Evaluation"); [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §1, §2 and §6.3.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [exact match](#/glossary/exact-match), [test-suite accuracy](#/glossary/test-suite-accuracy), [semantic parsing](#/glossary/semantic-parsing), [tabular question answering (TQA)](#/glossary/tabular-question-answering-tqa)


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


<a id="derangement"></a>

## Derangement

A permutation that moves every element: σ(t) ≠ t for all t. Of the n! orderings of n items, about n!/e are derangements (general definition). [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") relabels an agent's actions with derangements, so that every label changes, and checks whether the agent's decisions follow the relabelling (§3.2; App. A).

**Learn more:** [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") App. A, which uses the term (general definition).

**Related:** [permutation test](#/glossary/permutation-test)


<a id="dfa-minimization-and-equivalence"></a>

## DFA minimization and equivalence

A deterministic finite automaton (DFA) is a [finite-state machine](#/glossary/finite-state-machine) over strings with exactly one next state for each state and character. Every regular language has a unique DFA with the fewest states, its minimal DFA, and two automata accept the same strings exactly when their minimal DFAs match (general definition). Equivalence can also be tested directly: [A Linear Algorithm for…](#/papers/hopcroft1971linear "A Linear Algorithm for Testing Equivalence of Finite Automata (1971)") gives an algorithm whose running time is "bounded by a constant times the product of the number of states of the larger automaton with the size of the input alphabet" (abstract, PDF p. 2), and notes that a minimization algorithm also tests equivalence (§I). Since a [regular expression](#/glossary/regular-expression-and-regular-language) converts to a DFA, this decides whether two regexes match the same strings: [Query4Regex](#/papers/hahn2026query4regex "Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries (2026)") scores model-written regexes by it (§4.3, PDF pp. 3–4), and [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") measures a regex's complexity by its minimal DFA's number of states (§5).

**Learn more:** [A Linear Algorithm for…](#/papers/hopcroft1971linear "A Linear Algorithm for Testing Equivalence of Finite Automata (1971)") abstract (PDF p. 2), §I and §III; [Query4Regex](#/papers/hahn2026query4regex "Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries (2026)") §4.3 (PDF pp. 3–4); [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §5 "Data", which uses "minimized DFA" without defining it (general definition).

**Related:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [finite-state machine](#/glossary/finite-state-machine), [program equivalence](#/glossary/program-equivalence), [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries)


<a id="dice-coefficient"></a>

## Dice coefficient

A set overlap score: twice the number of shared elements divided by the sum of the two sets' sizes, 2|A ∩ B| / (|A| + |B|); 1 for equal sets, 0 for disjoint ones. It ranks pairs the same way as [Jaccard similarity](#/glossary/jaccard-similarity) J, since Dice = 2J / (1 + J) (general definition). [CypherLens](#/papers/mohammadi2026cypherlens "CypherLens: An Interactive Demo for Evaluating and Diagnosing NL-to-Cypher Systems (2026)") reports it beside exact and soft match to compare two queries' results (PDF p. 3).

**Learn more:** [CypherLens](#/papers/mohammadi2026cypherlens "CypherLens: An Interactive Demo for Evaluating and Diagnosing NL-to-Cypher Systems (2026)") §2.1 (PDF p. 3), which names it without defining it (general definition).

**Related:** [Jaccard similarity](#/glossary/jaccard-similarity), [F1 score](#/glossary/f1-score), [execution accuracy](#/glossary/execution-accuracy)


<a id="differential-evolution"></a>

## Differential evolution

An [evolutionary search](#/glossary/evolutionary-search) method for vectors of numbers. For each member x of the population it builds a mutant y = a + F(b − c) from three randomly chosen members, adding the scaled difference of two of them to the third; it mixes x and y coordinate by coordinate (crossover), and the result replaces x only if it scores better ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)") §3.3). A variant uses the current best member as a. EvoPrompt imitates these steps on text with an LLM: it finds the parts in which two prompts differ, mutates only those parts, and combines them with the current best prompt (§3.3).

**Learn more:** [EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)") ([PDF p. 6](https://arxiv.org/pdf/2309.08532#page=6)) §3.3 (PDF p. 6), citing Storn and Price 1997 (not listed here).

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm), [exploration and exploitation](#/glossary/exploration-and-exploitation)


<a id="differential-privacy"></a>

## Differential privacy

A guarantee about a randomized algorithm run on a dataset: changing any single record changes the probability of any set of outputs by at most a factor e^ε (pure ε-differential privacy), or by that factor plus a small slack δ ((ε, δ)-differential privacy) ([Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") §2.1). It is usually achieved by adding random noise; the Laplace mechanism adds noise from the Laplace distribution, "a symmetric exponential distribution", to a released number (§4.1). [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") uses it for [adaptive data analysis](#/glossary/adaptive-data-analysis), building on a known connection between differentially private algorithms and generalization (§1.1).

**Learn more:** [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") §1.1, §2.1 and §4.1.

**Related:** [adaptive data analysis](#/glossary/adaptive-data-analysis), [mutual information](#/glossary/mutual-information)


<a id="differential-testing"></a>

## Differential testing

Testing by running the same input on several implementations that should behave alike (different database engines, or two versions of one engine) and comparing their outputs: a disagreement points to a bug in at least one of them, and nobody needs to know the correct answer. It works only for inputs that all the implementations are meant to handle the same way.

Example: RAGS generated random SQL statements and ran each one on several vendors' database systems, comparing the number of rows returned and a checksum of the results; its author notes that the comparison "only works for SQL statements that will execute on more than one vendor's database" ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2).

It differs from [metamorphic testing](#/glossary/metamorphic-testing), which runs two related inputs on one implementation.

**Learn more:** [Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)") §2 (PDF pp. 1–2); [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") §VII (PDF p. 11), which describes it as "executing the same test case in different implementations to verify if they yield matching results" and explains why it suits query rewriters poorly. The earlier work [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") cites for it (McKeeman; Evans and Savoia) is not listed here.

**Related:** [test oracle](#/glossary/test-oracle), [metamorphic testing](#/glossary/metamorphic-testing), [fuzzing](#/glossary/fuzzing)


<a id="diffusion-language-model"></a>

## Diffusion language model

A language model that writes a whole passage at once by repeated denoising: it starts from a sequence of masked or noisy tokens and fills in or corrects many positions in parallel over several steps, instead of producing one token after another from left to right (general definition). [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") includes two, Dream-v0-7B and LLaDA-8B (§3.1), to test whether "parallel denoising yields a different serialization", and reports that it "does not escape the bottleneck" the paper finds in left-to-right models (§3.1–3.2).

**Learn more:** [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") §3.1–3.2, which use it without defining it (general definition).

**Related:** [decoder-only and encoder-decoder models](#/glossary/decoder-only-and-encoder-decoder-models), [masked language model](#/glossary/masked-language-model)


<a id="diophantine-inequality"></a>

## Diophantine inequality

An inequality between polynomials whose unknowns must take whole-number values, such as x² − 2y² ≥ 1 over the natural numbers. Deciding whether an arbitrary one has a solution is undecidable, through its link to [Hilbert's tenth problem](#/glossary/hilberts-tenth-problem): "deciding the existence of a Diophantine solution for an arbitrary polynomial inequality is, in general, undecidable" ([Attacking Diophantus](#/papers/konstantinidis2026diophantus "Attacking Diophantus: Special Cases of Bag Containment (2026)") §5, PDF p. 37, citing Ioannidis and Ramakrishnan). [Attacking Diophantus](#/papers/konstantinidis2026diophantus "Attacking Diophantus: Special Cases of Bag Containment (2026)") reduces bag containment of queries to the solvability of such inequalities of a special shape (abstract, §3.1).

**Learn more:** [Attacking Diophantus](#/papers/konstantinidis2026diophantus "Attacking Diophantus: Special Cases of Bag Containment (2026)") ([PDF p. 37](https://arxiv.org/pdf/2609.30956#page=37)) §5 (PDF p. 37) and §1, where Ioannidis and Ramakrishnan ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)")) reduce "from the validity problem of Diophantine inequalities" to show undecidability for unions of conjunctive queries.

**Related:** [Hilbert's tenth problem](#/glossary/hilberts-tenth-problem), [bag semantics](#/glossary/bag-semantics), [query containment](#/glossary/query-containment), [decidable and undecidable](#/glossary/decidable-and-undecidable)


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

Example: the DeepSeek-R1 authors fine-tune Qwen and Llama models on a curated set of 800,000 samples, with supervised fine-tuning only and no RL stage ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 6).

Other senses: the word also names compressing data rather than a model. Test-suite accuracy "distills a small test suite of databases that achieves high code coverage for the gold query from a large number of randomly generated databases" ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") abstract), and CASD has a coding agent turn a corpus of agent runs into an improved system prompt in a "Distillation into compact models pass" ([Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") §3.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 53](https://arxiv.org/pdf/2501.12948#page=53)) Supp. 6 (SI PDF p. 53); [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") ([PDF p. 1](https://arxiv.org/pdf/2010.02840#page=1)) abstract (PDF p. 1); [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.26261#page=3)) §3.2 (PDF p. 3).

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [rejection sampling](#/glossary/rejection-sampling), [expert iteration](#/glossary/expert-iteration), [cold start](#/glossary/cold-start), [self-distillation](#/glossary/self-distillation)


<a id="dom-tree"></a>

## DOM tree

The tree a browser or HTML parser builds from a web page (the Document Object Model): each element, such as a `<div>` or a `<td>`, is a node whose children are the elements and text nested inside it, and its attributes (`class`, `href`) belong to the node (general definition). XPath expressions and CSS selectors pick nodes out of it by their path from the root. Example: [AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §4.2 prunes the DOM tree before asking an LLM for an XPath, moving down from the root towards the node that holds the target value ("top-down"), and back up to "a more reliable and broadly applicable node" when needed ("step-back").

**Learn more:** [AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") ([PDF p. 5](https://arxiv.org/pdf/2404.12753#page=5)) §4.2 (PDF p. 5), which uses it without defining it (general definition).

**Related:** [wrapper (web data extraction)](#/glossary/wrapper-web-data-extraction), [accessibility tree](#/glossary/accessibility-tree)


<a id="domain-specific-language-dsl"></a>

## Domain-specific language (DSL)

A language made for one kind of task rather than for general programming: OCL and Alloy state constraints on a software model, against general-purpose languages (GPLs) such as Python, Java or C ([A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") §1); SQL and regular expressions are DSLs too ([Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") §5). [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") treats a DSL as the set of strings valid for "an application of interest" (§2.1) and says DSLs are "by definition specialized and thus unlikely to have been encountered often enough (or at all) during pretraining" (§1), so many are [low-resource](#/glossary/low-resource-programming-language); common ones such as SQL are not (§5).

**Learn more:** [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") ([PDF p. 1](https://arxiv.org/pdf/2305.19234#page=1)) §1 (PDF p. 1), §2.1 and §5; [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") ([PDF p. 2](https://arxiv.org/pdf/2603.05278#page=2)) §1 (PDF p. 2), which uses the term without defining it.

**Related:** [low-resource programming language](#/glossary/low-resource-programming-language), [semantic parsing](#/glossary/semantic-parsing), [context-free grammar](#/glossary/context-free-grammar), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form)


<a id="dtd-document-type-definition"></a>

## DTD (document type definition)

A schema, written inside or alongside an [XML](#/glossary/xml) document, that declares which elements and attributes the document may contain, with attribute types and default values (general definition). XPath 1.0 takes two things from it: an element's unique ID is "the value of the attribute that is declared in the DTD as type ID" ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") §5.2.1), and an element gets attribute nodes for attributes "explicitly declared in the DTD with a default value" (§5.3).

**Learn more:** [XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") (unchecked) §5.2.1 and §5.3, which use the term without defining it (general definition); the XML 1.0 Recommendation, which defines it, is not listed here.

**Related:** [XML](#/glossary/xml), [JSON Schema](#/glossary/json-schema), [DOM tree](#/glossary/dom-tree)


<a id="letter-e"></a>

<a id="e-process-testing-by-betting"></a>

## E-process (testing by betting)

A running measure of evidence against a null hypothesis that may be checked after every observation. In testing by betting it is a gambler's wealth: start with 1 and, at each observation, bet a fraction of it at odds that are fair if the null hypothesis is true. Under the null the wealth stays near 1 on average; when the null is false it tends to grow.

Ville's inequality says that a nonnegative wealth that does not grow on average under the null (a supermartingale) ever reaches 1/α with probability at most α, so rejecting the null as soon as the wealth reaches 1/α gives a test that stays valid however and whenever one stops ([PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §4; supermartingale: general definition).

Example: PACE commits a candidate change to an agent as soon as such a wealth, betting on the candidate winning the pairs where it and the incumbent disagree, reaches 1/α ([PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §4).

**Learn more:** [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §2 and §4.

**Related:** [confidence sequence (anytime-valid inference)](#/glossary/confidence-sequence-anytime-valid-inference), [sequential probability ratio test (SPRT)](#/glossary/sequential-probability-ratio-test-sprt), [McNemar's exact test](#/glossary/mcnemars-exact-test), [sign test](#/glossary/sign-test)


<a id="earley-parser"></a>

## Earley parser

A parsing algorithm for [context-free grammars](#/glossary/context-free-grammar), from Earley (1970), whose paper [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") cites as "An efficient context-free parsing algorithm". It reads the text left to right, so it can tell where a text stops being valid and which symbols may come next (general definition). [Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") consults an Earley parser built from a predicted grammar to extract "the longest valid prefix" of an LLM's program, "along with a set of valid terminals that can follow the prefix", and lets the LLM choose among those terminals (§3.2, Alg. 1). That is a form of [constrained decoding](#/glossary/constrained-decoding) for models reached only through an API.

Earley's paper is not listed here.

**Related:** [context-free grammar](#/glossary/context-free-grammar), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [constrained decoding](#/glossary/constrained-decoding)


<a id="elicitation-vs-acquisition"></a>

## Elicitation vs. acquisition

In papers on RL for LLM reasoning: whether training on a model's own verified outputs only draws out (elicits) abilities the base model already had, or adds (acquires) new ones. [Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)") §2 calls it "the central open question of the current RLVR literature". The elicitation side, as other papers state it: [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") §2.2 cites "a nascent hypothesis in the literature: that RLVR, at least at the compute scales of open-source post-training pipelines, does not teach models new reasoning capabilities, but instead triggers latent ones already present in the base model"; [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") §1: "prior work suggests RL primarily elicits existing knowledge from pretrained models rather than learning new capabilities". [Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)") §2 takes from this literature that the two hypotheses "are separated by pass@k at large k, not by pass@1", that is, by the [reasoning boundary](#/glossary/reasoning-boundary).

**Learn more:** [Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)") §2 "Elicitation vs. acquisition"; [Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)") §2.2; [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") §1. None defines the pair formally (general definition).

**Related:** [reasoning boundary](#/glossary/reasoning-boundary), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr), [pass@k](#/glossary/passk), [expert iteration](#/glossary/expert-iteration)


<a id="elo-rating"></a>

## Elo rating

A rating for players (here, candidate agents) from pairwise results. Each comparison moves both ratings toward what happened: the winner gains, the loser loses, by a step K times the gap between the actual result and the result the rating difference predicted. New players can join at any time and be compared fairly with old ones.

**Learn more:** [RoboPhD](#/papers/borthwick2026robophd "RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution (2026)") §3.2.5 and Alg. 1, which ranks evolved text-to-SQL agents this way with K = 32. The original (Elo, 1978) is not listed here.

**Related:** [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb)


<a id="elt-pipeline"></a>

## ELT pipeline

Extract-Load-Transform: a data pipeline that extracts data from its sources, loads it raw into a [data warehouse](#/glossary/data-warehouse), and then transforms it there, typically with SQL, into the tables analysts need. The older ETL (Extract-Transform-Load) order transforms the data before loading it. [ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)") §1: "Compared to traditional Extract-Transform-Load (ETL) pipelines, ELT pipelines ingest data directly into data warehouses".

Example ([ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") Fig. 2, PDF p. 2): data is extracted from sources such as databases, APIs and flat files with connectors like Airbyte, loaded "in raw form into a cloud data warehouse such as Snowflake", and reshaped by transformation logic "typically written as SQL models in dbt".

**Learn more:** [ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)") §1; [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") ([PDF p. 2](https://arxiv.org/pdf/2603.29399#page=2)) §1 and Fig. 2 (PDF p. 2).

**Related:** [data warehouse](#/glossary/data-warehouse), [text-to-SQL](#/glossary/text-to-sql)


<a id="empirical-risk-minimization-erm"></a>

## Empirical risk minimization (ERM)

Choosing the candidate (a model, a prompt) that scores best on the available sample of examples, as a stand-in for the one that would score best on the unknown distribution those examples come from. The winner's sample score tends to overstate its true score: the [winner's curse](#/glossary/winners-curse-optimizers-curse), worse when many candidates are compared on few examples (see [multiple testing](#/glossary/multiple-testing)). SAMMO frames prompt optimization this way, using "a sampled score in the spirit of empirical risk minimization (ERM)" ([SAMMO](#/papers/schnabel2024sammo "Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization (2024)") §3, Eq. 3).

**Learn more:** [SAMMO](#/papers/schnabel2024sammo "Symbolic Prompt Program Search: A Structure-Aware Approach to Efficient Compile-Time Prompt Optimization (2024)") §3 (general definition; the paper uses the term without defining it).

**Related:** [multiple testing](#/glossary/multiple-testing), [bootstrap resampling](#/glossary/bootstrap-resampling), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


<a id="ensemble-methods"></a>

## Ensemble methods

Combining several learned models, for example by voting or averaging, so that their individual errors partly cancel. [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1 describes them as methods that "aggregate results from multiple learners to combat overfitting (and underfitting)" and, inspired by them, runs several copies of a program-synthesis tool with different grammars in parallel.

**Learn more:** [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1, which cites Dietterich (2000, not listed here).

**Related:** [overfitting](#/glossary/overfitting), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [weight averaging](#/glossary/weight-averaging)


<a id="enumerative-synthesis"></a>

## Enumerative synthesis

[Program synthesis](#/glossary/program-synthesis) by listing a grammar's programs from smallest to largest and checking each against the specification. [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §4.2 describes it as a technique that "enumerates expressions within a given grammar in order of size and returns the first candidate that satisfies the given examples". Because it returns the smallest fitting program, it prefers simple answers, but the number of candidates grows fast with size.

**Learn more:** [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §4.2 (its hybrid enumeration extends it).

**Related:** [program synthesis](#/glossary/program-synthesis), [syntax-guided synthesis (SyGuS)](#/glossary/syntax-guided-synthesis-sygus), [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis)


<a id="equisatisfiable"></a>

## Equisatisfiable

Two formulas are equisatisfiable if both are satisfiable or neither is. They need not be equivalent (they may even use different variables), but a solver can decide one by deciding the other, which is how solvers translate formulas into forms they handle. SQLSolver relies on a theorem that every LIA* formula has an equisatisfiable [linear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic) formula ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1, Thm. 4.1).

**Learn more:** [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §3 (PDF p. 8), which defines it: "Two formulas are equisatisfiable iff one formula is satisfiable whenever the other one is also satisfiable, and vice versa"; §4.1, Thm. 4.1 (PDF p. 10).

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [linear and nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic)


<a id="equivalence-test-tost"></a>

## Equivalence test (TOST)

A test that shows two results are the same within a chosen margin, instead of failing to show they differ. It runs two one-sided tests (TOST): one that the difference is above −margin and one that it is below +margin; passing both supports equivalence. A plain significance test that finds "no difference" does not show this, since a small or noisy sample can miss a real one.

**Learn more:** [Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)") § "Experimental Setup" ("equivalence tests (two one-sided tests, TOST) at ±7.5 points") and § "Final Task Reward…".

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing), [noninferiority test](#/glossary/noninferiority-test)


<a id="esoteric-programming-language-esolang"></a>

## Esoteric programming language (esolang)

A programming language made to be strange or hard on purpose, as a joke, a puzzle or a test of an idea, not for practical use; Brainfuck, with eight one-character commands moving a pointer over a tape, is the best known. [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") uses five as a benchmark, describing their "hard-by-design primitives" and "negligible deployment value" (abstract, §1); all five are [Turing-complete](#/glossary/turing-complete), so the problems stay solvable while the languages are rare in training data (§1). [Frontier Coding Agents Use…](#/papers/sharma2026metaprogramming "Frontier Coding Agents Use Metaprogramming to Adapt to Unfamiliar Programming Languages (2026)") uses them as "controlled proxies for unfamiliar executable interfaces" (§1).

**Learn more:** [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") abstract, §1, §3.2 and App. B (the five languages); [Frontier Coding Agents Use…](#/papers/sharma2026metaprogramming "Frontier Coding Agents Use Metaprogramming to Adapt to Unfamiliar Programming Languages (2026)") §1.

**Related:** [low-resource programming language](#/glossary/low-resource-programming-language), [data contamination](#/glossary/data-contamination), [Turing-complete](#/glossary/turing-complete), [combinatory logic](#/glossary/combinatory-logic)


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


<a id="exact-cover"></a>

## Exact cover

Given a collection of sets, choose some of them so that every element lies in exactly one chosen set: the chosen sets cover everything and do not overlap (general definition). Deciding whether such a choice exists is NP-complete, and hardness proofs reduce it to other problems.

Example: [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") reduces exact cover to containment of [tableaux](#/glossary/tableau), with one row per element in one tableau and one row per set in the other; the second is contained in the first exactly when the sets have an exact cover (Lemma 13), so containment is NP-complete even for project-join expressions (Thm. 14).

**Learn more:** [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §8 (PDF pp. 15–16), which calls it "the exact cover problem (shown to be NP-complete in [16])" without defining it (general definition), and §9 (PDF p. 19), which uses the version where each element is in at most three sets. Its reference [16] is not listed here.

**Related:** [set cover problem](#/glossary/set-cover-problem), [3-SAT](#/glossary/3-sat), [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [query containment](#/glossary/query-containment)


<a id="exact-match"></a>

## Exact match

A score that counts an answer as right only if it equals the gold answer, usually after light normalization or answer extraction. In text-to-SQL it means the predicted query equals the gold query as text; Spider's exact set match compares the two clause by clause, ignoring the order of columns and predicates. Neither checks meaning, so an equivalent query written differently fails.

**Learn more:** [FAPO](#/papers/kassianik2026fapo "FAPO: Fully Automated Prompt Optimization of Multi-Step LLM Pipelines (2026)") §4.1 (EM on HotpotQA); [LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)") §1 ("exact SQL string match"); [Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)") §1 and §4, for exact set match.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [gold query](#/glossary/gold-query), [query equivalence](#/glossary/query-equivalence)


<a id="exchangeability"></a>

## Exchangeability

A sequence of random cases is exchangeable when every reordering of it has the same joint distribution: no case is special because of its position (general definition). Independent draws from one distribution are exchangeable. It is the assumption behind [conformal](#/glossary/conformal-prediction-and-conformal-risk-control) guarantees: the calibration cases and the cases met later must be exchangeable, which drift or a changed task can break (general definition).

In causal inference the word has another sense: treated and untreated cases are exchangeable when whether a case got the treatment says nothing about the outcomes it would have had either way; *conditional* exchangeability asks this only among cases with the same measured covariates, that is, no [confounder](#/glossary/confounder) is left unmeasured (general definition). [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") assumes that, given a prompt's pre-edit state, "treatment assignment is conditionally independent of untreated potential outcomes", and calls it "unlikely to hold exactly" (§4.1).

**Learn more:** [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") §1 ("exchangeable test data"); [ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") §3, whose "certificate exchangeability" assumes that accepted deployment certificates are exchangeable with the calibration ones. Neither defines it (general definition). Causal sense: [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") §4.1.

**Related:** [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [learn-then-test (LTT)](#/glossary/learn-then-test-ltt), [propensity score and inverse probability weighting (IPTW)](#/glossary/propensity-score-and-inverse-probability-weighting-iptw)


<a id="execution-accuracy"></a>

## Execution accuracy

The usual text-to-SQL score: the share of questions for which the system's query, run on the benchmark's database, returns the same result as the [gold query](#/glossary/gold-query). What "the same" means is the benchmark's choice: BIRD compares results as sets, ignoring row order and duplicates ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") App. B.7, PDF p. 24).

A match on one database doesn't make the queries equivalent: a wrong query can return the right rows there by chance (a false positive). Test-suite accuracy runs both queries on several generated databases to catch more of these ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §1, PDF p. 1), and SpotIt searches for a database that tells them apart ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §2).

**Learn more:** [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 6](https://arxiv.org/pdf/2305.03111#page=6)) §5 (PDF p. 6) for the definition; [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") §1; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF p. 2), Eq. 1.

**Related:** [text-to-SQL](#/glossary/text-to-sql), [gold query](#/glossary/gold-query), [query equivalence](#/glossary/query-equivalence), [counterexample database](#/glossary/counterexample-database)


<a id="execution-trace"></a>

## Execution trace

A record of a program's run: the statements executed, in order, with the values of its variables after each (general definition). [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") counts program traces as "concrete semantics" that "capture actual execution effects" (§2), and its trace representation "only captures variable state changes", so it keeps only programs without external resources such as files or keyboard input (§3.2). Agent papers use "trace" for a different record: the log of an agent's steps and tool calls.

**Learn more:** [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") §2, §3.2, which uses the term without defining it (general definition).

**Related:** [output and input prediction](#/glossary/output-and-input-prediction), [formal semantics](#/glossary/formal-semantics)


<a id="expectation-maximization-em"></a>

## Expectation-maximization (EM)

A way to fit a model with a hidden variable (a [latent variable](#/glossary/latent-variable)) that is never observed: alternate an E-step, which computes for each data point how likely each value of the hidden variable is under the current parameters, and an M-step, which re-estimates the parameters from those weighted assignments, until the fit stops improving. It can settle on a local optimum, so it is often run from several random starts (general definition). Example ([VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") App. A.4): each answer's count of accepting votes out of M calls to an LLM judge is modelled as a mixture of two binomial distributions, one for valid answers and one for invalid ones; EM estimates the share of valid answers and the two acceptance rates, and so the judge's false-accept and false-reject rates, without labels.

**Learn more:** [VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") App. A.4, which gives the E- and M-steps for this mixture and keeps the best of several random restarts; App. E shows the estimate degrading as the judge stops telling valid from invalid answers. The general description is not taken from a source on this site (general definition).

**Related:** [latent variable](#/glossary/latent-variable), [identifiability](#/glossary/identifiability), [Youden's index](#/glossary/youdens-index)


<a id="experience-replay"></a>

## Experience replay

Storing an agent's past interactions and reusing them later for learning, instead of learning only from the newest one (general definition, from RL). [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)") likens its agent's reuse of past experience to it (App. A.4).

**Learn more:** [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)") App. A.4, citing Lin (1992), not listed here (general definition).

**Related:** [off-policy learning](#/glossary/off-policy-learning), [procedural memory](#/glossary/procedural-memory), [reinforcement learning](#/glossary/reinforcement-learning)


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


<a id="fail_to_pass-and-pass_to_pass-tests"></a>

## FAIL_TO_PASS and PASS_TO_PASS tests

The two test lists that grade an instance of a SWE-bench-style coding benchmark: FAIL_TO_PASS tests fail on the code before the reference fix and pass after it, so they check the requested change; PASS_TO_PASS tests pass both before and after, so they catch regressions (general definition; the SWE-bench paper is not listed here). [SWE-Proof](#/papers/ma2026sweproof "SWE-Proof: Can Language Models Resolve Real-World Issues with Machine-Checked Proofs? (2026)") grades its instances this way, with pass-to-pass tests "that guard against regression" (App. A.1). [Skill Issue](#/papers/kozyrev2026skillissue "Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents (2026)") builds tasks the other way round, by reverting a merged change, and admits a task only if tests that passed at the unmodified base now fail: "the FAIL_TO_PASS set has to be the specification of that one reversion" (App. C).

**Learn more:** [SWE-Proof](#/papers/ma2026sweproof "SWE-Proof: Can Language Models Resolve Real-World Issues with Machine-Checked Proofs? (2026)") (unchecked) App. A.1; [Skill Issue](#/papers/kozyrev2026skillissue "Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents (2026)") §3.1 ("Validation and grading") and App. C. Neither defines the lists in general (general definition).

**Related:** [gold patch](#/glossary/gold-patch), [resolve rate](#/glossary/resolve-rate), [plausible patch](#/glossary/plausible-patch), [regression testing](#/glossary/regression-testing)


<a id="false-discovery-rate-fdr"></a>

## False discovery rate (FDR)

Among the results declared significant, the expected share that are false alarms. Controlling it, instead of the chance of any false alarm (the familywise error rate; see [Bonferroni correction](#/glossary/bonferroni-correction)), keeps more power when many tests are run and many effects are real.

Procedures: The Benjamini–Hochberg procedure is the usual way: sort the m p-values and declare significant the k smallest, for the largest k whose p-value is at most kα/m. Online FDR procedures do the same for a stream of tests decided one at a time (general definitions).

Example: [Phantom Gains](#/papers/xu2026phantomgains "Phantom Gains: Auditing Self-Improvement Against a Measured Null (2026)") tests each problem's gain after self-training "with a one-sided Fisher exact test under FDR control", and notes that such a procedure is adaptive: "an arm containing many true effects raises its own admissible cutoff" (§4.2).

**Learn more:** [Phantom Gains](#/papers/xu2026phantomgains "Phantom Gains: Auditing Self-Improvement Against a Measured Null (2026)") §4.2 and App. D.1; [ADMITOR ("Admission Without Answers")](#/papers/lian2026admitor "Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling (2026)") abstract and §1, which bounds the FDR among accepted values; [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") §4, which finds an online FDR correction unnecessary for its per-decision guarantee. Benjamini and Hochberg's paper is not listed here.

**Related:** [multiple testing](#/glossary/multiple-testing), [Bonferroni correction](#/glossary/bonferroni-correction), [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control), [Fisher's exact test](#/glossary/fishers-exact-test)


<a id="false-premise"></a>

## False premise

A false statement that a question or task presents as given, such as a question that assumes something that is not true (general definition). [Verification Trap](#/papers/he2026verificationtrap "Verification Trap: Understanding Test-Time Selection Failures under False Premises in Code Generation (2026)") builds false-premise versions of coding tasks by inserting "a localized misleading premise" into the task description while keeping the hidden tests (§3.1), for example "Important: the input sequence is guaranteed to already be sorted in non-decreasing order." (App. S4.2).

**Learn more:** [Verification Trap](#/papers/he2026verificationtrap "Verification Trap: Understanding Test-Time Selection Failures under False Premises in Code Generation (2026)") §3.1 and App. S4.2, which use the term without a general definition (general definition); the false-premise question-answering papers it cites (§1) are not listed here.

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [test-time scaling](#/glossary/test-time-scaling)


<a id="familywise-error-rate-fwer"></a>

## Familywise error rate (FWER)

The chance of at least one false alarm among all the tests in a family, such as all the decisions of one run; a familywise bound keeps that chance at most α (general definition). A per-test bound α is weaker: over many tests where nothing is real, the expected number of false alarms grows with the number of tests. The [Bonferroni correction](#/glossary/bonferroni-correction) gives a familywise bound by testing each of m tests at α/m.

Example: [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") bounds each candidate change's chance of a false commit at α and says this "is not a run-level familywise bound": across many non-improving candidates the expected number of false commits grows by at most α per candidate (§4 "Guarantee").

**Learn more:** [PACE](#/papers/shawn2026pace "PACE: Anytime-Valid Acceptance Tests for Self-Evolving Agents (2026)") ([PDF p. 5](https://arxiv.org/pdf/2606.08106#page=5)) §4 "Guarantee" (PDF p. 5), which uses it without defining it (general definition); the [Bonferroni correction](#/glossary/bonferroni-correction) and [multiple testing](#/glossary/multiple-testing) entries already define the term inline.

**Related:** [multiple testing](#/glossary/multiple-testing), [Bonferroni correction](#/glossary/bonferroni-correction), [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr), [e-process (testing by betting)](#/glossary/e-process-testing-by-betting), [union bound](#/glossary/union-bound)


<a id="farkas-lemma"></a>

## Farkas' lemma

A theorem about systems of linear inequalities that yields checkable [certificates](#/glossary/certificate). In the form [ModelEquivBench](#/papers/zhu2026modelequivbench "ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models (2026)") uses: if nonnegative weights on the inequalities of a system P (and weights of any sign on its equalities) combine its rows into exactly the left-hand side of a constraint a·x ≤ b, with a combined right-hand side no larger than b, then every point satisfying P satisfies that constraint (App. C.1, Prop. C.1); the weights are called Farkas multipliers, and one set per constraint of a second system Q proves that P's solutions all satisfy Q (Cor. C.2). The lemma also gives the converse when P has a solution (every constraint P implies has such weights), and a certificate that a system has no solution; a checker verifies either by arithmetic alone (general definition).

**Learn more:** [ModelEquivBench](#/papers/zhu2026modelequivbench "ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models (2026)") ([PDF p. 11](https://arxiv.org/pdf/2607.29431#page=11)) App. C.1, Prop. C.1 and Cor. C.2 (PDF p. 11), which prove the certificate direction and cite Schrijver (1986), not listed here, for the lemma. C.1 leaves them unrestricted") says §3.3 states the equality weights as nonnegative; cite App. C.1, not §3.3.

**Related:** [linear programming (LP and MILP)](#/glossary/linear-programming-lp-and-milp), [certificate](#/glossary/certificate), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="fault-injection"></a>

## Fault injection

Making a component fail on purpose during a test (a tool call that errors or times out, a corrupted value) to see whether the system notices and recovers (general definition). [Quantization Effects on Tool-Failure…](#/papers/hu2026toolrecovery "Quantization Effects on Tool-Failure Recovery Vary Across Prompts and Evaluation Designs (2026)") injects transient failures "at every valid site on the required tool" of an agent's tool calls (§1); [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") injects hallucinations at the first stage of a multi-agent pipeline and tracks how they spread (abstract).

**Learn more:** [Quantization Effects on Tool-Failure…](#/papers/hu2026toolrecovery "Quantization Effects on Tool-Failure Recovery Vary Across Prompts and Evaluation Designs (2026)") §1; [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") abstract. Neither defines it (general definition).

**Related:** [mutation testing](#/glossary/mutation-testing), [fuzzing](#/glossary/fuzzing), [idempotent operation](#/glossary/idempotent-operation)


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

**Related:** [LIKE and ILIKE](#/glossary/like-and-ilike), [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence)


<a id="first-order-logic"></a>

## First-order logic

The logic of statements about objects and the relations between them (`Emp(x)`, `x = y`, `x > 3`), built with the connectives ∧ (and), ∨ (or), ¬ (not) and → (implies) and the quantifiers ∀ ("for every object") and ∃ ("there is an object"). "First-order" means the quantifiers range over individual objects, not over sets or functions of them. Whether a first-order formula is [valid](#/glossary/satisfiable-and-valid) is undecidable in general, so solvers handle restricted fragments or specific theories.

Example: "every employee works in some department" is `∀x (Emp(x) → ∃y (Dept(y) ∧ WorksIn(x, y)))`.

Why it matters here: [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") cites Codd's theorem that relational algebra and relational calculus ("formulas of first-order logic on database instances") are equivalent in expressive power, and concludes "Thus, the equivalence between two SQL queries is in general undecidable" (§6.1). Checkers translate queries or rewrite rules into first-order formulas for an [SMT solver](#/glossary/sat-and-smt-solvers): WeTune's rule verifier does so ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §5.1, Fig. 6), and SQLSolver describes such "semantics-based" checkers as reducing equivalence "to deciding the satisfiability of a first-order logic formula" ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 11](https://arxiv.org/pdf/1607.04822#page=11)) §6.1 (PDF p. 11); [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §5.1 (PDF p. 6) and Fig. 6 (PDF p. 8); [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1 (PDF p. 2). No paper on this site defines the logic itself (general definition); Codd's paper, cited by [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), is not listed here.

**Related:** [satisfiable and valid](#/glossary/satisfiable-and-valid), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [decidable and undecidable](#/glossary/decidable-and-undecidable), [conjunctive query](#/glossary/conjunctive-query), [uninterpreted function](#/glossary/uninterpreted-function)


<a id="fishers-exact-test"></a>

## Fisher's exact test

An exact test of whether two groups' success rates differ, from the 2×2 table of their successes and failures: it computes the probability of tables at least as extreme as the observed one among all tables with the same row and column totals (general definition). Unlike a two-proportion z-test, which compares the two rates with a normal approximation, it stays valid for small counts. [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") notes that inverting it gives a confidence interval for the [odds ratio](#/glossary/odds-ratio) that "guarantees coverage of at least 1 − α at any dataset size" (§3.3).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.3; [Phantom Gains](#/papers/xu2026phantomgains "Phantom Gains: Auditing Self-Improvement Against a Measured Null (2026)") §4.2. Fisher's 1922 paper is not listed here.

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [binomial test](#/glossary/binomial-test), [odds ratio](#/glossary/odds-ratio), [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr)


<a id="fixed-point"></a>

## Fixed point

A value that an update maps to itself: x is a fixed point of f when f(x) = x. Repeating the update may settle at a fixed point; the fixed point is stable when runs started near it return to it, which for a smooth update of one number holds when the slope of f at the point lies between −1 and 1 (general definition). In [Datalog](#/glossary/datalog), a program's answer is its [least fixed point](#/glossary/least-fixed-point).

Example: [Memory Reward Inflation in…](#/papers/asadolahi2026memoryinflation "Memory Reward Inflation in Self-Improving LLM Agents (2026)") models the share p of wrong trusted memories as updated by a map q each round; "A fixed point satisfies p = q(p)" (App. B, proof of Thm. 2(i), PDF p. 18), and Thm. 2(ii) states the stability condition as q′(p*) < 1 (§5.2, PDF p. 14).

**Learn more:** [Memory Reward Inflation in…](#/papers/asadolahi2026memoryinflation "Memory Reward Inflation in Self-Improving LLM Agents (2026)") ([PDF p. 14](https://arxiv.org/pdf/2608.00017#page=14)) §5.2 (PDF p. 14) and App. B (PDF p. 18), which use the stability notion without defining it (general definition).

**Related:** [least fixed point](#/glossary/least-fixed-point), [Datalog](#/glossary/datalog), [fixed-point combinator (Y combinator)](#/glossary/fixed-point-combinator-y-combinator) (a different use of the word)


<a id="fixed-parameter-tractable"></a>

## Fixed-parameter tractable

A problem is fixed-parameter tractable in a parameter k (a measure of the input other than its size n) when it can be solved in time f(k)·p(n), with f any function and p a polynomial: the cost may explode in k but grows only polynomially in n, so the problem is practical when k is small (general definition). [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") applies the term to a count, not a running time: Thm. 5.2 bounds the number of test databases that decide containment of conjunctive queries with nulls and comparisons by a function of three "local" parameters of the two queries, and concludes "The size of the family is therefore fixed-parameter tractable in (Δ, w, |Ecycle(q)|)" (§5, PDF p. 14).

**Learn more:** [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") ([PDF p. 14](https://arxiv.org/pdf/2609.16218#page=14)) §1 and Thm. 5.2 (§5, PDF p. 14), which use the term without defining it (general definition).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [query containment](#/glossary/query-containment)


<a id="fixed-point-combinator-y-combinator"></a>

## Fixed-point combinator (Y combinator)

A function fix such that fix(g) = g(fix(g)) for every g, which makes recursion possible without naming the function being defined: g describes one step and receives the finished solver as its argument ([λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") §2). In the untyped [lambda calculus](#/glossary/lambda-calculus-and-beta-reduction), the Y combinator, λg. (λx. g (x x)) (λx. g (x x)), is one such term (§2, Def. 1). [λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") builds its recursive long-context reasoning on one, so that the model never manages function names (§1).

**Learn more:** [λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") §2 (Def. 1 and a worked factorial example).

**Related:** [lambda calculus and beta-reduction](#/glossary/lambda-calculus-and-beta-reduction), [combinatory logic](#/glossary/combinatory-logic)


<a id="fleiss-kappa"></a>

## Fleiss' kappa

An agreement score for three or more raters who each put the same items into categories: like [Cohen's kappa](#/glossary/cohens-kappa), it compares observed agreement with the agreement expected by chance, 1 for perfect agreement and 0 for chance level (general definition). [Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") reports it for its annotators' quality ratings, describing it as "agreement beyond chance; higher is better" (§5.2, Tab. 3 caption); [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") reports it for three annotators of a benchmark audit (§1).

**Learn more:** [Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") §5.2, Tab. 3 caption; [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") §1 and §3.1.3. Neither defines its formula (general definition).

**Related:** [Cohen's kappa](#/glossary/cohens-kappa)


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

A rule-based reasoning method that starts from known facts and keeps applying every rule whose conditions hold, adding its conclusions as new facts, until nothing new follows (general definition; [backward chaining](#/glossary/backward-chaining) instead starts from a goal and looks for rules that would prove it). Seed-Geometry's engine follows "the forward-chaining design", in which it "derives all known facts by checking applicable rules until closure is reached" ([Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)") §1). Starburst's query rewrite rules are "fired by a forward chaining rule engine" ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §6.1).

**Learn more:** [Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)") ([PDF p. 2](https://arxiv.org/pdf/2507.23726#page=2)) §1 (PDF p. 2); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 11](https://arxiv.org/pdf/1607.04822#page=11)) §6.1 (PDF p. 11). Neither defines the term (general definition).

**Related:** [production rule (rule engine)](#/glossary/production-rule-rule-engine), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="frame-condition"></a>

## Frame condition

The part of a specification that says what an operation must leave unchanged, beside the postcondition, which says what it must achieve. Specifications often leave it out, because listing everything that must stay the same is hard: the frame problem ([Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") §2 "Postconditions and frame conditions"). Example: in the agent benchmarks [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") audits, a task's frame condition says that nothing changes beyond the requested records, which also rules out a second copy of a requested record; a verifier that checks the postcondition but not the frame condition passes runs that make an unrequested change (§1, §2).

**Learn more:** [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") §1 and §2 "Postconditions and frame conditions", citing McCarthy and Hayes (1969) and Borgida et al. (1995), not listed here.

**Related:** [formal specification](#/glossary/formal-specification), [Hoare triple](#/glossary/hoare-triple), [negative side effects](#/glossary/negative-side-effects), [test oracle](#/glossary/test-oracle)


<a id="fréchet-chemnet-distance-fcd"></a>

## Fréchet ChemNet Distance (FCD)

A score of how closely a set of generated molecules resembles a reference set as a whole: both sets are passed through a pretrained chemistry network (ChemNet), and the distance between the two distributions of its internal features is measured; lower is better (general definition, after Preuer et al. 2018, not listed here). [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") uses it to evaluate "the global distributional quality and diversity of the generated molecule sets", "computed directly against the target test sets" (App. D).

**Learn more:** [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") App. D and its result tables (§6), which use the score without defining it (general definition).

**Related:** [SMILES](#/glossary/smiles), [molecular fingerprint and Tanimoto similarity](#/glossary/molecular-fingerprint-and-tanimoto-similarity)


<a id="friedman-test"></a>

## Friedman test

A rank-based test for comparing several treatments measured on the same blocks (subjects, tasks): within each block the treatments are ranked, and the test asks whether some treatment ranks consistently higher than the rest, without assuming normal data. [From Raw Experience to Skill Consumption](#/papers/huang2026skillconsumption "From Raw Experience to Skill Consumption: A Systematic Study of Model-Generated Agent Skills (2026)") calls it "a non-parametric repeated-measures analysis of variance" in which "each task instance [is] a block and each format (or extractor) [is] a treatment", testing "the null hypothesis that all treatments produce equal performance" (App. C; also §5.2).

**Learn more:** [From Raw Experience to Skill Consumption](#/papers/huang2026skillconsumption "From Raw Experience to Skill Consumption: A Systematic Study of Model-Generated Agent Skills (2026)") §5.2 and App. C.

**Related:** [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [paired comparison](#/glossary/paired-comparison), [multiple testing](#/glossary/multiple-testing)


<a id="full-and-block-sparse-attention"></a>

## Full and block-sparse attention

In full attention every token attends to every earlier token, so reading (pre-filling) a long input costs time quadratic in its length. Block-sparse attention restricts which tokens attend to which, to cut that cost (general definition). [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §4.1 studies the form used for collections of documents: "pre-filling each document independently so that they attend to tokens within the same document only, with only a small number of query and answer tokens attending globally".

**Learn more:** [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §4.1.

**Related:** [hybrid architecture (attention and recurrent layers)](#/glossary/hybrid-architecture-attention-and-recurrent-layers), [long-context language model (LCLM)](#/glossary/long-context-language-model-lclm), [KV cache](#/glossary/kv-cache)


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

<a id="gamblers-ruin"></a>

## Gambler's ruin

A random walk that moves up or down one step each round until it reaches one of two bounds, as when a gambler wins or loses a unit per bet until going broke or reaching a target; its formulas give the chance of reaching each bound first (the hitting probability) and the expected number of rounds (the hitting time) (general definition). [Solving a Million-Step LLM…](#/papers/meyerson2025maker "Solving a Million-Step LLM Task with Zero Errors (2025)") analyses its first-to-ahead-by-k voting, sampling until one answer leads every other by k votes, as "a generalization of the classic gambler's ruin problem", and uses the hitting-probability and hitting-time formulas for a correct answer racing a single alternative (§3.2).

**Learn more:** [Solving a Million-Step LLM…](#/papers/meyerson2025maker "Solving a Million-Step LLM Task with Zero Errors (2025)") §3.2, which uses it without defining it, citing Bernoulli (1713) and Ross (2025), neither on this site (general definition).

**Related:** [sequential probability ratio test (SPRT)](#/glossary/sequential-probability-ratio-test-sprt), [Markov chain](#/glossary/markov-chain), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="generalized-linear-mixed-model-glmm"></a>

## Generalized linear mixed model (GLMM)

A regression for outcomes that are not normal, such as right/wrong, that has two kinds of terms: fixed effects for the conditions being compared, and random effects, one per group (an instance, a seed), drawn from a normal distribution so that repeated measurements of one group are not treated as independent (general definition). [Is Code Better Than…](#/papers/tong2026codevslanguage "Is Code Better Than Language for Algorithmic Reasoning? (2026)") §3.2 fits one to per-run accuracy, with a logistic link, fixed effects for route, difficulty and their interaction, and random intercepts per instance and per seed.

**Learn more:** [Is Code Better Than…](#/papers/tong2026codevslanguage "Is Code Better Than Language for Algorithmic Reasoning? (2026)") §3.2, which writes out the model's equations.

**Related:** [hierarchical model](#/glossary/hierarchical-model), [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap), [item response theory (IRT)](#/glossary/item-response-theory-irt)


<a id="genetic-algorithm"></a>

## Genetic algorithm

An [evolutionary search](#/glossary/evolutionary-search) method that keeps a population of candidates, chooses parents by fitness, and makes children by mutation and crossover (combining parts of two parents) (general definition). Promptbreeder runs a binary tournament: "we sample two individuals from the population, we take the individual with the higher fitness, mutate it … and overwrite the loser with the mutated copy of the winner" ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)") §3); for crossover it picks the donor by fitness-proportionate (roulette-wheel) selection, in which "an individual is chosen in proportion to its fitness in the population" (§3.2.5, App. A). When a run gets trapped on a local optimum it also applies fitness sharing, which lowers the fitness of candidates similar to others (App. J.2; the gloss is ours, the paper names the method).

**Learn more:** [Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)") ([PDF p. 17](https://arxiv.org/pdf/2309.16797#page=17)) §3, §3.2.5, App. A (PDF p. 17) and App. J.2 (PDF p. 27), which use the term without defining it (general definition). Harvey's microbial genetic algorithm, which it cites for the tournament, is not listed here.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [estimation of distribution algorithm (EDA)](#/glossary/estimation-of-distribution-algorithm-eda), [island model](#/glossary/island-model)


<a id="gf2-and-algebraic-normal-form"></a>

## GF(2) and algebraic normal form

GF(2) is arithmetic on the two values 0 and 1, where addition is XOR and multiplication is AND (general definition). Every Boolean function can be written as a polynomial over it, an XOR of monomials, each monomial an AND of some of the variables; this is its algebraic normal form (ANF). For example, x OR y is x ⊕ y ⊕ xy. [Tool Use Reduces Depth-Induced…](#/papers/koplow2026depthcollapse "Tool Use Reduces Depth-Induced Collapse in OOD Reasoning (2026)") builds its benchmark from Boolean functions in this form: "Every Boolean function admits a polynomial representation over this field" (§1), written "as XORs of monomials" (§3.1).

**Learn more:** [Tool Use Reduces Depth-Induced…](#/papers/koplow2026depthcollapse "Tool Use Reduces Depth-Induced Collapse in OOD Reasoning (2026)") §1 and §3.1, which use them without defining GF(2) (general definition).

**Related:** [Boolean minimization](#/glossary/boolean-minimization), [disjunctive normal form (DNF)](#/glossary/disjunctive-normal-form-dnf)


<a id="ghost-resources"></a>

## Ghost resources

Bookkeeping that exists only in a program's proof, not in the running program: extra state that the specification and proof use to track how shared state may change or what a piece of code is entitled to do. [Harnessing Code Agents for…](#/papers/kan2026aria "Harnessing Code Agents for Automatic Software Verification (2026)") §I, on the separation logic framework Iris: "auxiliary, proof-only bookkeeping, invisible to the running program, that tracks how shared state is allowed to evolve" (PDF p. 1).

Example ([SWE-Proof](#/papers/ma2026sweproof "SWE-Proof: Can Language Models Resolve Real-World Issues with Machine-Checked Proofs? (2026)") App. H.1, PDF p. 64): in a contract for the Python verifier Nagini, three ghost resources carry the state the contract talks about; one, `RemovalBudget`, is the entitlement to issue one row-removal statement, "held rather than read, so an implementation can spend it but can learn nothing from it".

**Learn more:** [Harnessing Code Agents for…](#/papers/kan2026aria "Harnessing Code Agents for Automatic Software Verification (2026)") ([PDF p. 1](https://arxiv.org/pdf/2607.06341#page=1)) §I (PDF p. 1); [SWE-Proof](#/papers/ma2026sweproof "SWE-Proof: Can Language Models Resolve Real-World Issues with Machine-Checked Proofs? (2026)") ([PDF p. 64](https://arxiv.org/pdf/2609.21190#page=64)) (unchecked) App. H.1 (PDF p. 64).

**Related:** [separation logic](#/glossary/separation-logic), [proof assistant](#/glossary/proof-assistant), [Hoare triple](#/glossary/hoare-triple)


<a id="gödel-machine"></a>

## Gödel machine

A theoretical self-improving program, proposed by Schmidhuber (2007), that may rewrite any part of its own code, but only after formally proving that the rewrite is beneficial. [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") keeps the self-rewriting but drops the proofs, arguing that "in practice and without restrictive assumptions about the system, it is impossible to formally prove whether a modification" helps; its Darwin Gödel Machine instead evaluates each self-modification on coding benchmarks (§1).

**Learn more:** [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") §1. Schmidhuber's paper is not listed here.

**Related:** [open-endedness](#/glossary/open-endedness), [agent harness](#/glossary/agent-harness), [evolutionary search](#/glossary/evolutionary-search)


<a id="gold-patch"></a>

## Gold patch

The reference fix that comes with a benchmark issue, such as one from SWE-bench: "the official or correct fix patch" ([SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") App. A.1.5). It is the code counterpart of a [gold query](#/glossary/gold-query). A generated patch is judged by whether it passes the instance's tests, which a [plausible patch](#/glossary/plausible-patch) can do while still being wrong.

**Learn more:** [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") §3 and App. A.1.5.

**Related:** [gold query](#/glossary/gold-query), [plausible patch](#/glossary/plausible-patch), [resolve rate](#/glossary/resolve-rate), [test oracle](#/glossary/test-oracle)


<a id="gold-query"></a>

## Gold query

The human-written reference SQL query for a benchmark question ("gold SQL"); a system's query is scored by comparing its result with the gold query's. Gold queries can be wrong: SpotIt's authors report that when a generated query and the gold query disagreed, it was often the gold query that was incorrect ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §1, PDF p. 2).

**Learn more:** [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 1](https://arxiv.org/pdf/2510.26840#page=1)) §1–2 (PDF pp. 1–2). The challenge in this repo: [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification).

**Related:** [execution accuracy](#/glossary/execution-accuracy), [text-to-SQL](#/glossary/text-to-sql), [gold patch](#/glossary/gold-patch)


<a id="goodharts-law"></a>

## Goodhart's law

"When a measure becomes a target, it ceases to be a good measure" ([Scaling Laws for Reward…](#/papers/gao2022overoptimization "Scaling Laws for Reward Model Overoptimization (2023)") §1). In machine learning it describes optimizing a proxy, such as a learned [reward model](#/glossary/reward-model), until it stops tracking the goal it stood in for.

**Learn more:** [Scaling Laws for Reward…](#/papers/gao2022overoptimization "Scaling Laws for Reward Model Overoptimization (2023)") abstract and §1. Goodhart's own writing is not listed here.

**Related:** [reward model overoptimization](#/glossary/reward-model-overoptimization), [reward hacking](#/glossary/reward-hacking), [reward tampering](#/glossary/reward-tampering)


<a id="gpu-kernel-and-kernel-fusion"></a>

## GPU kernel and kernel fusion

A GPU kernel is a function that runs on a graphics processor: one launch runs the same code in many parallel threads, each on its own part of the data, usually to perform one operation such as a matrix multiplication or a convolution (general definition). Kernels are written in CUDA or in higher-level languages such as Triton ([TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") §1). Kernel fusion combines several operations into one kernel, so that intermediate results need not be written to GPU memory by one kernel and read back by the next (general definition). KernelBench's Level 2 consists of "100 simple fusion tasks, such as conv+bias+ReLU" ([TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") §3.1); the prompt TritonRL uses to label tasks by level describes Level 2 as "multiple primitive operations, which can be fused into a single kernel for improved performance" (App. G.1).

**Learn more:** [TritonRL](#/papers/woo2025tritonrl "TritonRL: Training LLMs to Think and Code Triton Without Cheating (2025)") ([PDF p. 3](https://arxiv.org/pdf/2510.17891#page=3)) §2.1.2 (PDF p. 3) and §3.1 (PDF p. 6), which split tasks into single-kernel (Level 1) and fusion (Level 2) tasks, and the labeling prompt in App. G.1 (PDF p. 17); it defines neither term (general definition).

**Related:** [program synthesis](#/glossary/program-synthesis)


<a id="gradient-boosted-decision-trees-gbdt"></a>

## Gradient-boosted decision trees (GBDT)

A model made of many small decision trees added one at a time, each new tree trained to correct the errors left by the trees before it; the prediction is the weighted sum of all trees' outputs (general definition, matching [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)")'s description). [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") describes GBDT as building trees in which "each tree is trained to correct the residuals (prediction errors) of previous trees", each added "along the negative gradient direction" of a loss, and implements it with the LightGBM library (§V-A2); [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") uses scikit-learn's `GradientBoostingClassifier` (App. G).

**Learn more:** [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") ([PDF p. 10](https://arxiv.org/pdf/2603.04169#page=10)) §V-A2 (PDF pp. 10–11); [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") ([PDF p. 22](https://arxiv.org/pdf/2609.21509#page=22)) §3.3 and App. G (PDF p. 22), which fits a "gradient-boosted decision tree (GBT) classifier" to predict failures.

**Related:** [learning to rank](#/glossary/learning-to-rank)


<a id="graph-edit-distance"></a>

## Graph edit distance

The smallest number (or total cost) of edits, such as adding, deleting or relabelling a node or an edge, that turns one graph into another (general definition); [tree edit distance](#/glossary/tree-edit-distance) is the same idea for trees. Computing it exactly is hard for large graphs. [STRuCT-LLM](#/papers/stoisser2025structllm "STRuCT-LLM: Unifying Tabular and Graph Reasoning with Reinforcement Learning for Semantic Parsing (2025)") §3.3.2 builds a reward from it: it turns the subgraphs that a predicted and a gold Cypher query target into [property graphs](#/glossary/property-graph) and measures "the minimal set of edit operations required to transform a predicted subgraph into its gold-standard counterpart".

**Learn more:** [STRuCT-LLM](#/papers/stoisser2025structllm "STRuCT-LLM: Unifying Tabular and Graph Reasoning with Reinforcement Learning for Semantic Parsing (2025)") §3.3.2.

**Related:** [tree edit distance](#/glossary/tree-edit-distance), [graph isomorphism](#/glossary/graph-isomorphism), [Levenshtein distance](#/glossary/levenshtein-distance), [reward shaping](#/glossary/reward-shaping)


<a id="graph-isomorphism"></a>

## Graph isomorphism

Deciding whether two graphs are the same up to renaming their nodes. It is in NP but "not known to be NP-hard" ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1, PDF p. 2), and GI is "the class of problems that are many-one-reducible to the graph isomorphism problem" ([Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") §5.3 fn. 6, PDF p. 22), so a GI-complete problem is as hard as graph isomorphism and no harder. In database theory, isomorphism of conjunctive queries is logspace equivalent to graph isomorphism ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 8, PDF p. 6), and two conjunctive queries are equivalent under [bag semantics](#/glossary/bag-semantics) exactly when they are isomorphic, so bag equivalence has the same complexity ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1, Thm. 5.2).

**Learn more:** [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §1 (PDF p. 2) and §5 (Thm. 5.2, PDF p. 7); [Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") §5.2–5.3 (PDF pp. 21–22), which calls graph isomorphism "a task for which no polynomial time algorithm is known" (§5.2); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") Thm. 8 (PDF p. 6).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [query equivalence](#/glossary/query-equivalence), [bag semantics](#/glossary/bag-semantics)


<a id="graph-neural-network-gnn"></a>

## Graph neural network (GNN)

A neural network for data shaped as a graph: each node keeps a vector, and each layer updates it from its neighbours' vectors, so after k layers a node's vector reflects its k-step neighbourhood (general definition). [Unified Multi-Dimensional Benchmark for…](#/papers/wang2026graphgym "Unified Multi-Dimensional Benchmark for Complex Graph Reasoning in Large Language Models (2026)") App. E.10 describes them as "neural architectures designed to learn representations over graph-structured data", and the paper compares LLMs with four variants (GCN, GAT, GIN and GraphSAGE) trained per task (§4.2, App. E.1).

**Learn more:** [Unified Multi-Dimensional Benchmark for…](#/papers/wang2026graphgym "Unified Multi-Dimensional Benchmark for Complex Graph Reasoning in Large Language Models (2026)") App. E.10; §4.2 and App. E.1 for the variants.

**Related:** [Weisfeiler-Lehman graph kernel](#/glossary/weisfeiler-lehman-graph-kernel), [graph isomorphism](#/glossary/graph-isomorphism)


<a id="greedy-decoding-and-temperature-sampling"></a>

## Greedy decoding and temperature sampling

Two ways to choose an LLM's next token. Greedy decoding always takes the most likely token, so a prompt always gets the same single answer. Temperature sampling draws the token at random after dividing the model's scores (logits) by a temperature T: below 1 the distribution sharpens towards the greedy choice, above 1 it flattens and outputs vary more (general definition). Self-consistency replaces greedy decoding in chain-of-thought prompting with sampling, to get several different reasoning paths; its authors say greedy decoding suffers from "repetitiveness and local-optimality" ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") §1), and they sample at T = 0.5 or 0.7, for some models restricted to the 40 most likely tokens (§3.1).

**Learn more:** [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") ([PDF p. 4](https://arxiv.org/pdf/2203.11171#page=4)) §3.1 (PDF p. 4) and §2, which use both terms without defining them (general definition); [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)") ([PDF p. 4](https://arxiv.org/pdf/2309.03409#page=4)) §2.3 (PDF p. 4), which tunes the temperature to balance [exploration and exploitation](#/glossary/exploration-and-exploitation).

**Related:** [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling), [beam search](#/glossary/beam-search), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="grounding-and-lifted-planning"></a>

## Grounding and lifted planning

A planning problem written in PDDL describes actions as schemas over variables, such as move(?from, ?to). Grounding replaces the variables with every combination of the problem's objects, giving the full list of concrete actions and facts (ground fluents); most planners ground first, and that list can grow very fast with the number of objects. A lifted planner searches over the schemas directly, without grounding everything first (general definition). [Language Models as Higher-Order…](#/papers/jiang2026higherorder "Language Models as Higher-Order Planning Formalizers (2026)") §2.1 counts a problem's ground fluents, induced by its objects and relations, and names a lifted planner as one way to expand its higher-order programs (§3.1, §8).

**Learn more:** [Language Models as Higher-Order…](#/papers/jiang2026higherorder "Language Models as Higher-Order Planning Formalizers (2026)") §2.1, §3.1 and §8, which use the terms without defining lifted planning (general definition).

**Related:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl), [satisficing planning](#/glossary/satisficing-planning), [first-order logic](#/glossary/first-order-logic)


<a id="grpo"></a>

## GRPO

Group Relative Policy Optimization, an RL algorithm for LLMs that drops PPO's value model. For each prompt it samples a group of outputs and scores them; each output's reward minus the group's mean, divided by the group's standard deviation, says how strongly to reinforce it (its "advantage"). SQL-Zero notes that because the baseline is the group mean, a reward that is too sparse makes the advantages zero ([SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") §2, PDF p. 2).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 11](https://arxiv.org/pdf/2402.03300#page=11)) §4.1.1–4.1.2 (PDF pp. 11, 14), which introduces it (with a learned reward model); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 7](https://arxiv.org/pdf/2501.12948#page=7)) Methods "GRPO" and "Reward design" (PDF p. 7), which uses it with rule-based rewards.

**Related:** [PPO](#/glossary/ppo), [reinforcement learning](#/glossary/reinforcement-learning), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [DAPO](#/glossary/dapo)


<a id="gspo"></a>

## GSPO

Group Sequence Policy Optimization, a variant of [GRPO](#/glossary/grpo) that keeps GRPO's group-normalized advantages but computes the [importance ratio and clipping](#/glossary/importance-ratio-and-clipping) once per whole sequence instead of per token. [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)") App. E: GSPO "retains group-normalized advantages but uses sequence-level importance ratios and clipping"; it uses GSPO instead of GRPO for one task "with the aim of stabilizing training" (§6.1).

**Learn more:** [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)") §6.1 and App. E. Its original paper (Zheng et al., 2025) is not listed here.

**Related:** [GRPO](#/glossary/grpo), [DAPO](#/glossary/dapo), [PPO](#/glossary/ppo), [importance ratio and clipping](#/glossary/importance-ratio-and-clipping)


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


<a id="hidden-state"></a>

## Hidden state

The vector a neural network's layer computes for one input position; in a transformer, each layer turns each token's vector into a new one, and the last layer's vectors are used to predict the next token (general definition). Studies of what a model represents read these vectors, for instance with a [linear probe](#/glossary/linear-probe). [TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §5.2 compares a code model's hidden states before and after a meaning-preserving rewrite of the input, using the last token's state.

**Learn more:** [TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §5.2, which uses it without defining it (general definition).

**Related:** [linear probe](#/glossary/linear-probe), [KV cache](#/glossary/kv-cache), [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe)


<a id="hierarchical-model"></a>

## Hierarchical model

A model in which the values for individual units (options, questions, models) are themselves drawn from a shared distribution whose parameters are learned from all units together. Each unit's estimate is then pulled toward the group average, more strongly when its own data are noisy (general definition; see [shrinkage](#/glossary/shrinkage)). [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") §3.4: "it is as if we draw true values at random" from a distribution whose mean is uncertain; its hierarchical model shrinks the estimates toward a mix of the prior mean and the average estimate (PDF p. 8).

**Learn more:** [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") §3.4 (PDF p. 8).

**Related:** [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior), [shrinkage](#/glossary/shrinkage), [item response theory (IRT)](#/glossary/item-response-theory-irt), [random-effects meta-analysis](#/glossary/random-effects-meta-analysis)


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


<a id="hit1"></a>

## Hit@1

For a system that returns a ranked list of answers, the share of questions whose top-ranked answer is in the set of correct answers. [Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)") App. G.3: "Hit@1 measures whether the model's top-ranked answer appears in the ground-truth set"; the authors report it beside precision, recall and F1 because Hit@1 "alone could obscure over-generation" (App. G).

**Learn more:** [Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)") App. G.3.

**Related:** [recall@k and mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr), [exact match](#/glossary/exact-match), [knowledge graph](#/glossary/knowledge-graph)


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


<a id="homotopy-type-theory-and-univalent-types"></a>

## Homotopy type theory and univalent types

Homotopy type theory (HoTT) is, in [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")'s words, "a generalization of classical type theory by adding membership and equality proofs" (§1); type theory is the logic behind [proof assistants](#/glossary/proof-assistant) such as Coq (general definition). In the SQL work of the collection a univalent type serves as a count: a cardinal number, finite or infinite, together with the ability to prove equality (§1). HoTTSQL maps each tuple to such a type whose size is the tuple's multiplicity, and these types "form a commutative semi-ring" (§2): the empty type is 0, the unit type 1, product is ×, sum is +, and truncation (the squash type) turns a count into yes or no (§2).

The HoTT book is not listed here.

**Related:** [K-relation and semiring semantics](#/glossary/k-relation-and-semiring-semantics), [proof assistant](#/glossary/proof-assistant), [formal semantics](#/glossary/formal-semantics), [bag semantics](#/glossary/bag-semantics)


<a id="hungarian-algorithm"></a>

## Hungarian algorithm

A classic algorithm for the assignment problem: given a cost (or score) for every pairing of items from two sets, it finds the one-to-one pairing with the lowest total cost (highest total score) in polynomial time (general definition). [DPC (Dual-Paradigm Consistency)](#/papers/li2026dpc "DPC: Training-Free Text-to-SQL Candidate Selection via Dual-Paradigm Consistency (2026)") models aligning the rows of two query results as "a Maximum Weight Bipartite Matching problem" over a cost matrix and solves it with the Hungarian algorithm (§3.5, Alg. 1).

**Learn more:** [DPC (Dual-Paradigm Consistency)](#/papers/li2026dpc "DPC: Training-Free Text-to-SQL Candidate Selection via Dual-Paradigm Consistency (2026)") §3.5 and Algorithm 1, which name the algorithm without describing it (general definition).


<a id="hybrid-architecture-attention-and-recurrent-layers"></a>

## Hybrid architecture (attention and recurrent layers)

A language model that mixes full-attention layers with cheaper layers that carry a fixed-size state from token to token, such as state-space models or gated delta net (GDN). [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §4.2 describes the cheaper layers: they "replace all-to-all token interactions with a recurrent state update, giving linear computation and constant memory", and notes that pure-GDN models have proven insufficient, so models such as Qwen3.5 "have mixed GDN with full attention rather than replacing it".

**Learn more:** [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §4.2.

**Related:** [full and block-sparse attention](#/glossary/full-and-block-sparse-attention), [long-context language model (LCLM)](#/glossary/long-context-language-model-lclm), [hidden state](#/glossary/hidden-state)


<a id="hyperparameter-optimization"></a>

## Hyperparameter optimization

Searching over the settings of a learning or prompting pipeline that are fixed before it runs (a learning rate, the number of demonstrations, which instruction to use) to maximize a validation score; methods include grid search, random search and model-based search such as [Bayesian optimization](#/glossary/bayesian-optimization). DSPy notes that once each parameter has a discrete set of candidates, "Many hyperparameter tuning algorithms (e.g., random search or Tree-structured Parzen Estimators …) can be applied for selection among candidates" ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4).

**Learn more:** [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §4, which uses the term without defining it (general definition), and §2, which mentions "Bayesian hyperparameter optimization methods".

**Related:** [Bayesian optimization](#/glossary/bayesian-optimization), [black-box optimization](#/glossary/black-box-optimization)


<a id="hypothesis-test"></a>

## Hypothesis test

A procedure that decides whether data rule out a stated value or claim, the null hypothesis: it computes a test statistic and rejects the null hypothesis when the statistic is more extreme than a threshold set by the significance level α (usually 0.05 or 0.01); otherwise it fails to reject it ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §2.2). A test and a confidence interval built from the same statistic correspond: the two-sided test at level α rejects a value exactly when the 1 − α confidence interval does not contain it (same section).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §2.2, and App. A.3, which builds the Clopper-Pearson interval from the values a binomial test does not reject.

**Related:** [p-value](#/glossary/p-value), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [binomial test](#/glossary/binomial-test), [statistical power](#/glossary/statistical-power), [multiple testing](#/glossary/multiple-testing)


<a id="letter-i"></a>

<a id="idempotent-operation"></a>

## Idempotent operation

An operation whose effect is the same whether it runs once or several times: "set the balance to 10" is idempotent, "add 10 to the balance" is not (general definition). It matters for agents that retry: retrying a non-idempotent write after a timeout can perform it twice. [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") studies idempotent request identifiers for retries (abstract, §I); [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") reports that in AppWorld "repeating a run's last write changed nothing in 33 of 48 tasks, but in every task of two templates the tests passed a duplicate write" (abstract).

**Learn more:** [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") abstract and §I; [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") abstract. Neither defines it (general definition).

**Related:** [transaction (atomicity)](#/glossary/transaction-atomicity), [test oracle](#/glossary/test-oracle), [fault injection](#/glossary/fault-injection)


<a id="identifiability"></a>

## Identifiability

A model is identifiable when different parameter values always give different distributions of the observable data, so that enough data can in principle pin the parameters down; when two settings give the same distribution, no amount of data tells them apart (general definition). [VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") states that its two-binomial mixture of judge votes is identifiable "if and only if the two component acceptance rates differ", that is, when the judge's [Youden's index](#/glossary/youdens-index) J is not 0 (App. A.4), and asks only that the sign of a gain be identifiable (§1).

**Learn more:** [VRR-Stop ("Verify](#/papers/wu2026vrrstop "Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents (2026)") App. A.4 and §4.2, which use the term without defining it (general definition).

**Related:** [expectation-maximization (EM)](#/glossary/expectation-maximization-em), [latent variable](#/glossary/latent-variable), [Youden's index](#/glossary/youdens-index)


<a id="ieee-754-floating-point"></a>

## IEEE 754 floating point

The standard binary format for floating-point numbers; besides ordinary numbers it has a Not-a-Number value (NaN), positive and negative infinity, and positive and negative zero (general definition). Query and path languages inherit its rules: in XPath 1.0 "A number can have any double-precision 64-bit format IEEE 754 value. These include a special 'Not-a-Number' (NaN) value, positive and negative infinity, and positive and negative zero" ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") §3.5, citation marker dropped), and numbers are compared for equality by IEEE 754 (§3.4).

**Learn more:** [XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") (unchecked) §3.4 and §3.5, which use the standard without defining it (general definition); the standard itself is not listed here.

**Related:** [XML](#/glossary/xml)


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

**Related:** [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [policy gradient](#/glossary/policy-gradient), [policy entropy](#/glossary/policy-entropy), [KL penalty](#/glossary/kl-penalty), [DAPO](#/glossary/dapo), [off-policy learning](#/glossary/off-policy-learning)


<a id="importance-sampling-and-importance-weighting"></a>

## Importance sampling and importance weighting

Estimating an average over one distribution from samples drawn from another (the proposal): each sample is weighted by the ratio of its probability under the target distribution to its probability under the proposal (general definition). The Horvitz–Thompson estimator is the survey version: when each item is chosen for labelling with a known probability π, dividing each labelled value by its π gives an unbiased estimate of the total or the mean, though only some items were labelled (general definition).

Examples: [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") labels only some of the cases where two model versions disagree and uses an "importance-weighted (Horvitz–Thompson) increment" (§4.2); [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") approximates Bayesian posteriors by importance sampling with the prior as proposal (§3.2); [STaR (Self-Taught Reasoner)](#/papers/zelikman2022star "STaR: Bootstrapping Reasoning With Reasoning (2022)") suggests that its rationalization step "could be framed as an off-policy estimate of the objective …, sampling from the hint-augmented model as a proposal distribution" (§5). The [importance ratio](#/glossary/importance-ratio-and-clipping) of PPO-style RL is the same weight, per token.

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.2; [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §4.2. Neither defines it (general definition).

**Related:** [importance ratio and clipping](#/glossary/importance-ratio-and-clipping), [off-policy learning](#/glossary/off-policy-learning), [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior)


<a id="in-context-reward-hacking-icrh"></a>

## In-context reward hacking (ICRH)

An LLM at test time, not in training, optimizing an objective it was deployed with in a way that also causes harmful side effects; the term and the formal version are from [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)"): a trajectory shows ICRH when both the proxy objective R and an implicit measure of side effects S are higher at its end than at its start (§3.2 "Optimization drives ICRH"). Example: an agent told to raise tweet engagement makes its tweets more controversial, raising engagement and toxicity together (abstract). The authors contrast it with reward hacking that arises in training by changing model weights (§3.3); our critique says that line is less sharp than they state. [ImpossibleBench](#/papers/zhong2025impossiblebench "ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases (2025)") uses the term more loosely, for an agent "maximizing its reward in unintended ways through undesired behaviors during inference", and counts its test-gaming agents as "a form of" it (App. A).

**Learn more:** [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)") ([PDF p. 4](https://arxiv.org/pdf/2402.06627#page=4)) §3.2 and §3.3 (PDF p. 4); [ImpossibleBench](#/papers/zhong2025impossiblebench "ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases (2025)") ([PDF p. 13](https://arxiv.org/pdf/2510.20270#page=13)) App. A (PDF p. 13).

**Related:** [reward hacking](#/glossary/reward-hacking), [agent harness](#/glossary/agent-harness)


<a id="incorrectness-logic"></a>

## Incorrectness logic

A program logic, introduced by O'Hearn (2019, not listed here), for showing that a program can really reach certain outcomes, such as a bug, rather than that it never goes wrong: its claims under-approximate what the program can do, so every outcome it reports is one the program really reaches, and a bug it reports is not a false alarm (general definition). [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") takes its idea of a reachable output from it, an output that "can indeed be returned by the program on an input" (§1), says its own under-approximation notion "is consistent with the under-approximation idea from O'Hearn's seminal paper on incorrectness logic" (§3.2), and that the work "is inspired by" it (§5).

**Learn more:** [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.06542#page=2)) §1 (PDF p. 2), §3.2 (PDF p. 7) and §5 (PDF p. 20), which use the term without defining it (general definition). O'Hearn's paper is not listed here.

**Related:** [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation), [symbolic execution](#/glossary/symbolic-execution), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="independence-assumption"></a>

## Independence assumption

In [cardinality estimation](#/glossary/cardinality-estimation), assuming that the values of different columns, in one table or across joined tables, are statistically independent, so the share of rows matching several conditions is estimated as the product of each condition's own share (general definition). [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") measures its error: it estimates "the cardinality with the product of marginal probabilities of the values in the corresponding tables assuming independence" and reports the [q-errors](#/glossary/q-error) of those estimates (§6.4, PDF p. 9); its benchmark adds correlations because TPC-DS "mostly assumes independence between columns and across tables" (§1, PDF p. 1).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §6.4 (PDF p. 9) and §1 (PDF p. 1).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [selectivity](#/glossary/selectivity), [q-error](#/glossary/q-error)


<a id="index-database"></a>

## Index (database)

A data structure kept beside a table, often a B-tree or a hash table on one or more columns, that lets the database find the rows matching a condition without scanning the whole table, at the cost of storage and slower writes. Whether a query can use an index can depend on how its condition is written: QueryBooster's example rewrites a `STRPOS(LOWER(content), s)` condition, which PostgreSQL can't answer from an index, into an equivalent `ILIKE` predicate that a trigram index (an index on three-character pieces of the text) can answer, and reports the rewritten query "runs 100 times faster" ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §1). BIRD shows indexes added to speed up queries "without rewriting them" ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") App. B.5, Fig. 10).

**Learn more:** [QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §1 (Fig. 2 and its text); [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") ([PDF p. 25](https://arxiv.org/pdf/2305.03111#page=25)) App. B.5 (Fig. 10, PDF p. 25). Neither defines the term (general definition).

**Related:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [query optimizer](#/glossary/query-optimizer), [LIKE and ILIKE](#/glossary/like-and-ilike), [cost-based optimization](#/glossary/cost-based-optimization)


<a id="inductive-bias"></a>

## Inductive bias

The assumptions built into a model or learning method that make it prefer some solutions over others that fit the training data equally well; without some such preference, a learner cannot generalize beyond the examples it has seen (general definition). A model's architecture, its training data's format and its tokenizer all carry such biases. [Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") argues that tokenization "could be the source of useful or harmful inductive biases" for arithmetic (abstract, §1).

**Learn more:** [Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") abstract and §1, which use it without defining it (general definition).

**Related:** [no-free-lunch theorem](#/glossary/no-free-lunch-theorem), [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization)


<a id="inductive-logic-programming-ilp"></a>

## Inductive logic programming (ILP)

Learning a [logic program](#/glossary/logic-programming) from examples. Given background knowledge B, positive examples E⁺ and negative examples E⁻, ILP looks for a program H such that B together with H entails every positive example and none of the negative ones ([Reason Popper-ly](#/papers/chen2026popper "Reason Popper-ly: Patching In-Context Reasoning with Inductive Logic Programming (2026)") §2.2, Eqs. 1–2; [LLMs Gaming Verifiers](#/papers/helff2026gaming "LLMs Gaming Verifiers: RLVR can Lead to Reward Hacking (2026)") §2 calls the two conditions completeness and consistency). Example ([LLMs Gaming Verifiers](#/papers/helff2026gaming "LLMs Gaming Verifiers: RLVR can Lead to Reward Hacking (2026)") §3): from trains labelled eastbound or not, learn the rule `eastbound(T) :- has_car(T,C), car_color(C,red).`

**Learn more:** [Reason Popper-ly](#/papers/chen2026popper "Reason Popper-ly: Patching In-Context Reasoning with Inductive Logic Programming (2026)") §2.2 (Eqs. 1–2; its system Popper); [LLMs Gaming Verifiers](#/papers/helff2026gaming "LLMs Gaming Verifiers: RLVR can Lead to Reward Hacking (2026)") ([PDF p. 2](https://arxiv.org/pdf/2604.15149#page=2)) §2 (PDF p. 2).

**Related:** [logic programming](#/glossary/logic-programming), [answer set programming](#/glossary/answer-set-programming), [program synthesis](#/glossary/program-synthesis), [Datalog](#/glossary/datalog)


<a id="infinite-ambiguity-of-an-automaton"></a>

## Infinite ambiguity (of an automaton)

An automaton is ambiguous when some input has more than one accepting path through it; it is infinitely ambiguous when the number of such paths grows without bound as inputs get longer, polynomially or exponentially (general definition). For backtracking regex engines, which may try every path, this is the structural cause of [ReDoS](#/glossary/redos-and-catastrophic-backtracking): [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §2.3 calls infinite ambiguity "structural conditions under which exponentially or polynomially many accepting paths exist for some inputs", used as "a proxy for the upper bound on matching cost", and tests it with [product automata](#/glossary/product-automaton) (§3.4).

**Learn more:** [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §2.3 (PDF p. 3) and §3.4 (PDF p. 6).

**Related:** [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa), [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [product automaton](#/glossary/product-automaton), [strongly connected component (SCC)](#/glossary/strongly-connected-component-scc)


<a id="information-dispersion"></a>

## Information dispersion

How spread out, across a long input, the information a task needs is. A low-dispersion task needs only a few short passages, as in [needle-in-a-haystack](#/glossary/needle-in-a-haystack-niah) tests; a high-dispersion one needs information from much of the input. [LongProc ("Long Procedural Generation")](#/papers/ye2025longproc "LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation (2025)") §1 says most long-context benchmarks "only test low-dispersion scenarios, requiring LCLMs to locate and use a few relevant snippets within the long contexts", and §2 rates benchmarks by it, citing Goldman et al. (2024, not listed here) for the notion.

**Learn more:** [LongProc ("Long Procedural Generation")](#/papers/ye2025longproc "LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation (2025)") §1 and §2 (Tab. 1).

**Related:** [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah), [context rot](#/glossary/context-rot), [lost in the middle](#/glossary/lost-in-the-middle)


<a id="integrity-constraint"></a>

## Integrity constraint

A rule that every legal database of a schema must satisfy. Common kinds: a primary key (no two rows share the key, and key columns are not NULL), a foreign key (each value must appear in a column of the referenced table), NOT NULL, and CHECK (a condition on each row) ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §3.4). Equivalence is then judged only over legal databases: some rewrites are correct only because of a constraint, and a counterexample that breaks a constraint refutes nothing.

Example: `SELECT DISTINCT id FROM Emp` and `SELECT id FROM Emp` return the same rows, duplicates included, only on databases where no `id` repeats, which a key on `id` guarantees.

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 10](https://arxiv.org/pdf/2403.03193#page=10)) §3.4 (PDF p. 10); [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.09978#page=3)) §2 (PDF p. 3), for keys and foreign keys in the theory. The challenge in this repo: [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence).

**Related:** [chase](#/glossary/chase), [counterexample database](#/glossary/counterexample-database), [spurious counterexample](#/glossary/spurious-counterexample)


<a id="interquartile-mean-iqm"></a>

## Interquartile mean (IQM)

The mean of the middle half of a set of scores: sort them, drop the lowest and highest quarters, and average the rest. It is less swayed by a few extreme scores than the mean, and uses more of the data than the median. APE reports the IQM over 24 tasks, citing Agarwal et al. 2021 ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") §4.1), which proposes it as a robust aggregate across runs and tasks ([Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)") §4.3).

**Learn more:** [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") ([PDF p. 6](https://arxiv.org/pdf/2211.01910#page=6)) §4.1 (PDF p. 6), which uses it without defining it (general definition).

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling)


<a id="island-model"></a>

## Island model

An evolutionary algorithm that splits its population into several sub-populations ("islands") that evolve mostly in isolation, with occasional migration of candidates between them, so that the population stays diverse instead of converging on one family of solutions. C-Evolve evolves prompts on islands "mostly in isolation", builds voting groups from one prompt per island ([C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §1), and migrates 10% between islands "to avoid getting stuck in local optima" (§5.3).

**Learn more:** [C-Evolve](#/papers/li2025cevolve "C-Evolve: Consensus-based Evolution for Prompt Groups (2025)") §1, §4.1 and §5.3.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm), [exponential moving average (EMA)](#/glossary/exponential-moving-average-ema)


<a id="item-response-theory-irt"></a>

## Item response theory (IRT)

A family of models from educational testing that explain each test-taker's result on each question by a hidden ability of the taker and a difficulty (sometimes also a discrimination) of the question (general definition). The Rasch model, the simplest, gives the chance of a correct answer as σ(ability − difficulty), with σ the logistic function. In LLM evaluation the takers are models or prompts: [Towards Reliable LLM Evaluation](#/papers/xu2026siren "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking (2026)") compares its method with PromptEval, which fits a Rasch model over prompts and benchmark items (§4.3, App. C.3), and [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") writes that "Large prediction noise has impact on modeling question difficulty using the Item Response Theory (IRT)" (§6.4).

**Learn more:** [Towards Reliable LLM Evaluation](#/papers/xu2026siren "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking (2026)") §4.3 and App. C.3; [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §6.4. Neither defines it (general definition).

**Related:** [latent variable](#/glossary/latent-variable), [hierarchical model](#/glossary/hierarchical-model), [Bradley-Terry model](#/glossary/bradley-terry-model)


<a id="letter-j"></a>

<a id="jaccard-similarity"></a>

## Jaccard similarity

The size of the overlap of two sets divided by the size of their union, |A ∩ B| / |A ∪ B|: 1 for equal sets, 0 for disjoint ones (also called the Jaccard index). A related score, containment, divides by one set's size instead, |A ∩ B| / |A|. [SketchOps](#/papers/song2026sketchops "Mergeable Model-Side Aggregation States for Long-Context Language Models (2026)") App. B.2 defines both and sets them to zero when the denominator's set is empty; [What Drives Recovery in…](#/papers/prokopiou2026lastcq "What Drives Recovery in Agentic Text-to-Cypher? LAST-CQ: An LLM Agent Self-Refinement Framework (2026)") applies it to two query results as sets of canonicalized rows (App. C "Set-metric definitions", PDF p. 15); [LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") §5.2.3 estimates it between two regular expressions' languages from 100 strings sampled from each. [MinHash](#/glossary/locality-sensitive-hashing-minhash) estimates it without comparing the sets in full.

**Learn more:** [SketchOps](#/papers/song2026sketchops "Mergeable Model-Side Aggregation States for Long-Context Language Models (2026)") App. B.2; [What Drives Recovery in…](#/papers/prokopiou2026lastcq "What Drives Recovery in Agentic Text-to-Cypher? LAST-CQ: An LLM Agent Self-Refinement Framework (2026)") ([PDF p. 15](https://arxiv.org/pdf/2609.12746#page=15)) App. C (PDF p. 15); [LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") §5.2.3; [DBLifeBench](#/papers/zheng2026dblifebench "Evaluating LLMs in Database Scenarios: A Lifecycle Benchmark for Assessing Their Potential in Core Database Tasks (2026)") §2.2.2.

**Related:** [locality-sensitive hashing (MinHash)](#/glossary/locality-sensitive-hashing-minhash), [F1 score](#/glossary/f1-score), [streaming sketch (HyperLogLog and Count-Min)](#/glossary/streaming-sketch-hyperloglog-and-count-min)


<a id="jaro-winkler-similarity"></a>

## Jaro-Winkler similarity

A string similarity between 0 and 1 that counts the characters two strings share within a small distance of each other's position, discounts those that appear in a different order, and gives extra weight to a shared prefix; it was designed for matching short strings such as names (general definition). [Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") uses it to compare generated graph queries with the gold ones as text, "to quantify whether the predicted query follows a similar writing style" (§6), citing Winkler (1990, not listed here).

**Learn more:** [Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") §1 and §6, which use it without defining it (general definition).

**Related:** [Levenshtein distance](#/glossary/levenshtein-distance), [BLEU and ROUGE](#/glossary/bleu-and-rouge), [exact match](#/glossary/exact-match)


<a id="jeffreys-interval"></a>

## Jeffreys interval

An interval for a success rate estimated from s successes in m trials: the equal-tailed Bayesian [credible interval](#/glossary/bayesian-credible-interval) from the Beta(½, ½) prior, that is, the 2.5% and 97.5% quantiles of a Beta(s + ½, m − s + ½) [distribution](#/glossary/beta-distribution) for a 95% interval (general definition). It behaves well near 0% and 100%, where the [Wald interval](#/glossary/wald-interval) fails. [Tool Use Reduces Depth-Induced…](#/papers/koplow2026depthcollapse "Tool Use Reduces Depth-Induced Collapse in OOD Reasoning (2026)") shades 95% Jeffreys intervals around its accuracy curves (§3.1, §4, §4.3) without defining them.

**Learn more:** [Tool Use Reduces Depth-Induced…](#/papers/koplow2026depthcollapse "Tool Use Reduces Depth-Induced Collapse in OOD Reasoning (2026)") §3.1, §4 and §4.3, which use it without defining it (general definition).

**Related:** [Bayesian credible interval](#/glossary/bayesian-credible-interval), [beta distribution](#/glossary/beta-distribution), [Wilson score interval](#/glossary/wilson-score-interval), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval)


<a id="jeffreys-smoothing"></a>

## Jeffreys smoothing

Estimating a rate from s successes in m trials as (s + ½) / (m + 1) instead of s / m. It keeps small groups from giving extreme estimates of 0 or 1, at the price of pulling them toward ½; it is the mean of the Beta(s + ½, m − s + ½) posterior that the Jeffreys prior gives (general definition for the posterior).

Example: [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") estimates its correction and corruption rates this way and says Jeffreys smoothing "stabilizes estimates when the conditioning set is small, while shrinking them toward 1/2"; for an empty group it reports the rate as undefined rather than ½ (§3).

**Learn more:** [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") ([PDF p. 6](https://arxiv.org/pdf/2604.18245#page=6)) §3 (PDF p. 6).

**Related:** [Jeffreys interval](#/glossary/jeffreys-interval), [beta distribution](#/glossary/beta-distribution), [shrinkage](#/glossary/shrinkage)


<a id="join-algorithms-nested-loop-hash-and-merge-join"></a>

## Join algorithms (nested-loop, hash and merge join)

The main ways a database computes a join: a nested-loop join compares each row of one input with every row of the other; a hash join builds a hash table on one input's join column and looks up each row of the other input in it; a merge join sorts both inputs on the join column and scans them side by side. Nested loops take time proportional to the product of the input sizes and the others roughly to their sum (plus sorting, for a merge join): [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") says that unnesting, "Depending on the query", replaces "an O(n²) algorithm (nested loop join) with an O(n) algorithm (hash join, joining keys)" (§1, PDF p. 3). The optimizer chooses one per join ([cost-based optimization](#/glossary/cost-based-optimization)).

**Learn more:** [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §1 (PDF p. 3); [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §3 (PDF p. 2), where System R chooses between nested iteration and merge join, and §7.2 (PDF p. 8), with cost formulas. Neither defines the algorithms (general definition).

**Related:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [correlated subquery](#/glossary/correlated-subquery), [outer join](#/glossary/outer-join)


<a id="json-schema"></a>

## JSON Schema

A JSON document that describes what other JSON documents may contain: which fields, their value types, which are required, and how they nest, so that a document can be validated against it (general definition). [jqBench](#/papers/verbruggen2026jqbench "jqBench: A Benchmark for Reading and Editing JSON from Natural Language and/or Examples (2026)") gives JSON schemas to models as part of a task's specification, beside natural language and examples, and builds its JQ-Spider set "with instructions and JSON Schema" (PDF pp. 1–2; §2.2.1, PDF p. 5).

**Learn more:** [jqBench](#/papers/verbruggen2026jqbench "jqBench: A Benchmark for Reading and Editing JSON from Natural Language and/or Examples (2026)") §2.2.1 (PDF p. 5), which uses it without defining it (general definition).

**Related:** [integrity constraint](#/glossary/integrity-constraint), [constrained decoding](#/glossary/constrained-decoding)


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


<a id="kendalls-tau"></a>

## Kendall's tau

A rank correlation between two orderings of the same items, computed from pairs of items: a pair is concordant if both orderings put it in the same order and discordant otherwise, and τ = (concordant − discordant) / number of pairs, from 1 (same order) to −1 (reversed). τ_b adds a correction for ties ([MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") App. A).

Example: [SALUS](#/papers/zhou2026salus "SALUS: Automated Auditing of NL-to-SQL Benchmarks through Weak Supervision of Multi-Agent Output (2026)") compares a benchmark's ranking of systems on its development set with their ranking on the hidden test set this way, and derives an expected τ under its noise model (§5.5, App. B.3).

**Learn more:** [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") App. A, which gives τ_b, citing Kendall (1938), not listed here; [SALUS](#/papers/zhou2026salus "SALUS: Automated Auditing of NL-to-SQL Benchmarks through Weak Supervision of Multi-Agent Output (2026)") §5.5 and App. B.3.

**Related:** [Spearman's rank correlation](#/glossary/spearmans-rank-correlation), [Pearson correlation](#/glossary/pearson-correlation)


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


<a id="knee-point-kneedle"></a>

## Knee point (Kneedle)

The point where a curve bends most sharply from rising fast to flattening, used to pick a setting (such as a number of clusters) past which more buys little. The Kneedle method (Satopää et al., not listed here) finds it by normalizing both axes and taking the point farthest from the straight line joining the curve's ends (general definition). [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") picks its number of skill families at the Kneedle knee point of the silhouette curve (§3.3), the K "with the largest perpendicular distance from the chord" joining the curve's ends (App. B).

**Learn more:** [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") §3.3 and App. B.

**Related:** [silhouette score](#/glossary/silhouette-score), [consensus clustering](#/glossary/consensus-clustering), [agglomerative clustering](#/glossary/agglomerative-clustering)


<a id="knowledge-conflict"></a>

## Knowledge conflict

The case where evidence given to a model in its input contradicts what it learned in training (its parametric knowledge), for example a table stating a fact that differs from the real world. [ContraTable ("The Table Says Otherwise")](#/papers/wang2026contratable "The Table Says Otherwise: Testing LLMs with Counterfactual Relational Data (2026)") §2 cites Longpre et al., who "show that models may prefer memorized answers when contextual evidence conflicts with their parametric knowledge" (PDF p. 2), and builds a benchmark of counterfactual databases to measure "table grounding under knowledge conflict" (§6).

**Learn more:** [ContraTable ("The Table Says Otherwise")](#/papers/wang2026contratable "The Table Says Otherwise: Testing LLMs with Counterfactual Relational Data (2026)") ([PDF p. 2](https://arxiv.org/pdf/2606.23667#page=2)) §2 (PDF p. 2) and §6. Longpre et al. (2021) is not listed here.

**Related:** [knowledge editing](#/glossary/knowledge-editing), [data contamination](#/glossary/data-contamination), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="knowledge-editing"></a>

## Knowledge editing

Changing a specific fact that a trained model has stored in its weights, without retraining it, and testing that the change holds on related questions without disturbing others (general definition). Its benchmarks use counterfactual facts: [ContraTable ("The Table Says Otherwise")](#/papers/wang2026contratable "The Table Says Otherwise: Testing LLMs with Counterfactual Relational Data (2026)") §1 says knowledge-editing research uses counterfactual facts "to test whether a model follows newly provided information or returns a familiar real-world answer", and §2 says those benchmarks "generally evaluate edited model parameters or isolated textual facts" (PDF p. 2).

**Learn more:** [ContraTable ("The Table Says Otherwise")](#/papers/wang2026contratable "The Table Says Otherwise: Testing LLMs with Counterfactual Relational Data (2026)") ([PDF p. 1](https://arxiv.org/pdf/2606.23667#page=1)) §1 and §2 (PDF pp. 1–2), which describe the research without defining it (general definition). No knowledge-editing paper is on this site.

**Related:** [knowledge conflict](#/glossary/knowledge-conflict), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="knowledge-graph"></a>

## Knowledge graph

Facts stored as a graph: nodes are entities (people, places, works) and labelled edges are relations between them. [Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)") §4 writes one as a set of triples (subject, predicate, object), each "a factual statement"; [Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") §1 describes knowledge graphs as "structured data models where nodes represent unique entities and oriented edges denote their properties and interactions". The main standard model is RDF, in which "every resource, relationship or property is represented as a triple" ([Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") §1), queried with the W3C language SPARQL ([SPARQL 1.1 Query Language](#/papers/harris2013sparql "SPARQL 1.1 Query Language (2013)")); the other common model is the [property graph](#/glossary/property-graph). Knowledge graph question answering (KGQA) answers natural-language questions from a knowledge graph's facts ([Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)")).

**Learn more:** [Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)") §4 "Notations"; [Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") §1 and §4.1 (RDF triples against property-graph objects); [SPARQL 1.1 Query Language](#/papers/harris2013sparql "SPARQL 1.1 Query Language (2013)"), the SPARQL standard.

**Related:** [property graph](#/glossary/property-graph), [multi-hop question answering](#/glossary/multi-hop-question-answering), [Hit@1](#/glossary/hit1), [semantic parsing](#/glossary/semantic-parsing)


<a id="kv-cache"></a>

## KV cache

The attention keys and values that a transformer stores for the tokens so far and reuses at each new step instead of recomputing them: "the attention keys and values stored and reused during generation" ([Which Decisions Low-Bit Quantization…](#/papers/wu2026lowbit "Which Decisions Low-Bit Quantization Breaks, and How to Predict Them (2026)") App. A.14). It grows with the context length and often limits how many sequences fit in memory. Multi-query attention shrinks it by "using a full set of query heads but sharing key and value heads per attention block", which "significantly reduces memory usage and cache update costs" ([AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)") §4.1).

**Learn more:** [Which Decisions Low-Bit Quantization…](#/papers/wu2026lowbit "Which Decisions Low-Bit Quantization Breaks, and How to Predict Them (2026)") App. A.14; [AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)") §4.1, citing Shazeer (2019), not listed here.

**Related:** [post-training quantization](#/glossary/post-training-quantization), [mixture of experts (MoE)](#/glossary/mixture-of-experts-moe)


<a id="letter-l"></a>

<a id="label-noise"></a>

## Label noise

Wrong labels in a dataset: examples whose given label differs from the true one. In class-conditional noise the chance that a label is wrong, and what it is changed to, depends only on the true class (a cat mislabelled as a dog more often than as a car), not on the particular example; [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") contrasts it with symmetric noise (§2). Confident learning, the method that paper uses, estimates how often each true class carries each given label from a model's out-of-sample predicted probabilities (here from cross-validation) and flags likely errors, which the authors then had crowd workers check (abstract, §3).

In RL with verifiable rewards the labels are reference answers or a verifier's verdicts: [Noisy Data is Destructive…](#/papers/zhu2026noisyrlvr "Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards (2026)") studies training on incorrect annotations (abstract), and [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") flips a verifier's verdict with probability ε (§6; ε is that paper's flip rate, not the clipping threshold of [importance ratio and clipping](#/glossary/importance-ratio-and-clipping)).

**Learn more:** [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") §2 and §3, which builds on the confident-learning paper (Northcutt, Jiang and Chuang), not listed here; [Noisy Data is Destructive…](#/papers/zhu2026noisyrlvr "Noisy Data is Destructive to Reinforcement Learning with Verifiable Rewards (2026)") abstract; [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") §6.

**Related:** [weak supervision](#/glossary/weak-supervision), [gold query](#/glossary/gold-query), [reward hacking](#/glossary/reward-hacking), [test oracle](#/glossary/test-oracle)


<a id="lambda-calculus-and-beta-reduction"></a>

## Lambda calculus and beta-reduction

A minimal programming language with only three kinds of expressions: variables, functions of one argument written λx. e (nameless), and applications of one expression to another. It computes by beta-reduction, applying a function by substitution: (λx. e) a reduces to e with every free x replaced by a ([λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") §2). Example: (λx. x) y reduces to y. Despite its size it can express any computation, with recursion supplied by a [fixed-point combinator](#/glossary/fixed-point-combinator-y-combinator).

**Learn more:** [λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") §2, "A Short Primer on λ-Calculus", with worked examples.

**Related:** [fixed-point combinator (Y combinator)](#/glossary/fixed-point-combinator-y-combinator), [combinatory logic](#/glossary/combinatory-logic), [De Bruijn index](#/glossary/de-bruijn-index), [Turing-complete](#/glossary/turing-complete)


<a id="language-server-protocol-lsp"></a>

## Language Server Protocol (LSP)

A standard protocol through which an editor asks a separate language server for help with code in one language: completions, error and warning diagnostics, the definition of a name (general definition). Agents can call such a server as a tool: [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") exposes the CodeQL language server through an MCP server, forwarding calls "such as complete(file, loc, char), diagnostics(file), and definition(file, loc, char)", so that completion helps the agent "discover correct API or AST names" and diagnostics "reveal compile or linter errors" (§3.3, PDF p. 7).

**Learn more:** [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") ([PDF p. 7](https://arxiv.org/pdf/2511.08462#page=7)) §3.3 (PDF p. 7), which uses the protocol without defining it (general definition).

**Related:** [Model Context Protocol (MCP)](#/glossary/model-context-protocol-mcp), [tool calling (function calling)](#/glossary/tool-calling-function-calling), [agent harness](#/glossary/agent-harness)


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


<a id="law-of-total-variance"></a>

## Law of total variance

Total variance = the variance of the conditional means + the mean of the conditional variances (general definition). In LLM evaluation, with questions x and several sampled answers per question, it splits the variance of a score into data variance (questions differ in difficulty) and prediction variance (the model answers the same question differently from sample to sample) ([Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §1, §3.1).

**Learn more:** [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §1 and §3.1.

**Related:** [standard error](#/glossary/standard-error), [paired comparison](#/glossary/paired-comparison), [bootstrap resampling](#/glossary/bootstrap-resampling)


<a id="learn-then-test-ltt"></a>

## Learn-then-test (LTT)

A method for choosing settings (a threshold, a configuration) from a family of candidates so that a risk, such as an error rate, stays below a target with high probability: compute for each candidate a p-value against the claim that its risk exceeds the target, and accept candidates with a [multiple-testing](#/glossary/multiple-testing) procedure, for example by testing them in a fixed order (general description). [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") describes it as calibrating "a family of predictive procedures against a risk requirement" (§II), and [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") as giving "high-probability control of more general risks" than conformal risk control (§2).

Example: [Selection Without Signal, Recovery…](#/papers/iscan2026falsification "Selection Without Signal, Recovery Through Expression: A Measurement Study of Post-Hoc Falsification Operators for Frozen Small Code Models (2026)") issues a certificate from "the Hoeffding--Bentkus (HB) Learn-then-Test bound": it turns the harm rate observed on n examples into a p-value against the claim that the true rate exceeds α, and the certificate issues if that p-value is at most δ (§2.1, Eq. 1).

**Learn more:** [Selection Without Signal, Recovery…](#/papers/iscan2026falsification "Selection Without Signal, Recovery Through Expression: A Measurement Study of Post-Hoc Falsification Operators for Frozen Small Code Models (2026)") §2.1; [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") §II; [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") §2. The original paper (Angelopoulos et al., 2021) is not listed here.

**Related:** [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control), [concentration inequality](#/glossary/concentration-inequality), [multiple testing](#/glossary/multiple-testing), [certificate](#/glossary/certificate)


<a id="learning-to-defer"></a>

## Learning to defer

Designing a model together with a rule for when to hand a case to a human expert, or to a stronger and costlier system, instead of answering itself, so that the pair does best overall (general definition). It extends [selective prediction](#/glossary/selective-prediction), where abstained cases simply go unanswered: in [When to Trust the Cheap Check](#/papers/kiyani2026weakstrong "When to Trust the Cheap Check: Weak and Strong Verification for Reasoning (2026)")'s words, the learning-to-defer literature "extends selective prediction to human-AI collaboration, studying the optimal division of labor between model and expert" (§2). Its own policies decide when to defer from a cheap verifier to a strong one.

**Learn more:** [When to Trust the Cheap Check](#/papers/kiyani2026weakstrong "When to Trust the Cheap Check: Weak and Strong Verification for Reasoning (2026)") §2.

**Related:** [selective prediction](#/glossary/selective-prediction), [calibration](#/glossary/calibration), [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control)


<a id="learning-to-rank"></a>

## Learning to rank

Training a model to put a list of items in order, most relevant first, judged by a ranking metric over the list such as [NDCG](#/glossary/normalized-discounted-cumulative-gain-ndcg) rather than by how well it scores each item alone (general definition). Pairwise methods learn from pairs of items in the wrong order. LambdaMART (Burges, not listed here) is one such method: [gradient-boosted decision trees](#/glossary/gradient-boosted-decision-trees-gbdt) trained with a pairwise loss in which each pair is weighted by "the change in NDCG when the ranks of two items are swapped" ([SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") §V-A3).

Example: [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") ranks candidate query rewrite rules with LambdaMART, labelling a rule 1 if it reduces execution time and 0 otherwise, and keeps the top-ranked ones (§III-C, §V-A3).

**Learn more:** [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") ([PDF p. 6](https://arxiv.org/pdf/2603.04169#page=6)) §III-C (PDF p. 6) and §V-A3 (PDF p. 11), which describe LambdaMART but don't define learning to rank (general definition).

**Related:** [gradient-boosted decision trees (GBDT)](#/glossary/gradient-boosted-decision-trees-gbdt), [normalized discounted cumulative gain (NDCG)](#/glossary/normalized-discounted-cumulative-gain-ndcg), [Spearman's rank correlation](#/glossary/spearmans-rank-correlation), [Kendall's tau](#/glossary/kendalls-tau)


<a id="least-fixed-point"></a>

## Least fixed point

The meaning of a [Datalog](#/glossary/datalog) program on given input facts: start from the input, apply every rule to derive new facts, and repeat until nothing new is derived. [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") defines a program's output as "the least fixed point reached by applying the rules until nothing new is derived" (§3, PDF p. 3). For a program without negation, the facts reached are the smallest set that contains the input and is closed under the rules; with recursive rules this computes, for example, the transitive closure of a graph (§3).

**Related:** [Datalog](#/glossary/datalog), [logic programming](#/glossary/logic-programming), [stratified negation](#/glossary/stratified-negation)


<a id="least-to-most-prompting"></a>

## Least-to-most prompting

A prompting method (Zhou et al., not listed here) in two stages, each with its own prompt: the first reduces a problem to simpler sub-questions, the second answers them one after another, so later answers can use earlier ones. [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") App. I describes it this way: "Problem reducing stage turns the problem into sub-problems, and the solving stage solves them sequentially. It keeps two prompts, each for an individual stage." [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 8.1 calls it a method that "decomposes complex problems into sequential subquestions that are solved incrementally".

Example ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") App. I, PDF p. 24): the reducing prompt turns "how old is Kody?" into the sub-questions "How old is Mohamed?", "How old was Mohamed four years ago?" and "How old was Kody four years ago?"; the solving prompt answers "How old was Mohamed four years ago?" (56) and then uses that answer for "How old is Kody?" (32).

**Learn more:** [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") ([PDF p. 24](https://arxiv.org/pdf/2211.10435#page=24)) App. I (PDF pp. 24–25); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 58](https://arxiv.org/pdf/2501.12948#page=58)) Supp. 8.1 (SI PDF p. 58).

**Related:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


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


<a id="length-generalization"></a>

## Length generalization

A model working well on inputs longer than those it was trained on (general definition). For long-context models it is a way to save compute: [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §1 defines it as "fine-tuning a long-context model on shorter contexts than the intended context length at test time" (citing Gao et al. 2024, not listed here), and §4.3 tests it on models trained to 32k tokens and evaluated at up to 128k.

**Learn more:** [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §1 and §4.3.

**Related:** [long-context language model (LCLM)](#/glossary/long-context-language-model-lclm), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [context rot](#/glossary/context-rot)


<a id="levenshtein-distance"></a>

## Levenshtein distance

The edit distance between two strings: the fewest single-character insertions, deletions and substitutions that turn one into the other (general definition). [Is This LLM Library…](#/papers/berlotattwell2025libraryfails "Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour (2026)") computes it, as "the minimum number of deletions, replacements, or insertions required to convert the lemma into the proof", to score how much of a lemma reappears in a proof (App. F, PDF p. 24). [UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") keeps a (buggy code, fixed code) pair only if a similarity based on it is at least 0.95, to leave out rewrites from scratch (§3.2, App. C.5).

**Learn more:** [Is This LLM Library…](#/papers/berlotattwell2025libraryfails "Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour (2026)") ([PDF p. 24](https://arxiv.org/pdf/2504.03048#page=24)) App. F (PDF p. 24), citing Levenshtein (1966), not listed here; [UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") §3.2 and App. C.5.

**Related:** [tree edit distance](#/glossary/tree-edit-distance), [exact match](#/glossary/exact-match), [BLEU and ROUGE](#/glossary/bleu-and-rouge)


<a id="lexicase-selection"></a>

## Lexicase selection

A way of picking parents in evolutionary search that rewards candidates for solving particular examples, not for their average score: it goes through the training examples in a random order and at each one keeps only the candidates that do best on it, so candidates that solve rare or hard examples ("specialists") can be chosen (general definition). SEPO selects its next parent this way with probability 0.8, and uniformly at random otherwise; "Lexicase filters candidates using a randomly ordered sequence of training examples, preserving specialists for difficult cases" ([SEPO](#/papers/ma2026sepo "SEPO: Evidence-Grounded Prompt Optimization via Structural Editing (2026)") §3.4).

**Learn more:** [SEPO](#/papers/ma2026sepo "SEPO: Evidence-Grounded Prompt Optimization via Structural Editing (2026)") §3.4, citing Spector (2012), not listed here; the filtering step's details are a general definition.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm), [Pareto front](#/glossary/pareto-front), [novelty search](#/glossary/novelty-search)


<a id="lexing"></a>

## Lexing

The first step of parsing a program: turning its stream of characters into a sequence of tokens (keywords, names, numbers, operators) according to the language's grammar, which a parser then builds into an [abstract syntax tree](#/glossary/abstract-syntax-tree-ast) ([TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §2.2). It is deterministic, and in most languages formatting changes such as extra spaces don't change the tokens. An LLM's tokenizer splits code differently, by learned statistics rather than the grammar, which is the mismatch [TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") studies (abstract; §2).

**Learn more:** [TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §2.2.

**Related:** [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [context-free grammar](#/glossary/context-free-grammar)


<a id="library-learning"></a>

## Library learning

Building up a library of reusable pieces (functions, tools, lemmas, checklists) while solving tasks, and reusing them on later tasks. [Is This LLM Library…](#/papers/berlotattwell2025libraryfails "Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour (2026)") describes it as "the creation and exploitation of reusable and composable functions, tools, or lemmas" (abstract, PDF p. 1); having found that three such systems "fail to consistently outperform the simple baseline of prompting the model" once computational cost is accounted for, the authors conclude that "a serious re-examination of ICL LLM-based library learning is in order" (abstract; §1, PDF p. 2).

**Learn more:** [Is This LLM Library…](#/papers/berlotattwell2025libraryfails "Is This LLM Library Learning? Evaluation Must Account For Compute and Behaviour (2026)") ([PDF p. 1](https://arxiv.org/pdf/2504.03048#page=1)) abstract (PDF p. 1) and §1 (PDF p. 2); [LEGO-Prover](#/papers/wang2023legoprover "LEGO-Prover: Neural Theorem Proving with Growing Libraries (2024)") §3.1, a library of lemmas kept in [vector stores](#/glossary/vector-store).

**Related:** [agent skill](#/glossary/agent-skill), [procedural memory](#/glossary/procedural-memory), [vector store](#/glossary/vector-store)


<a id="like-and-ilike"></a>

## LIKE and ILIKE

SQL's pattern-matching conditions on strings: `s LIKE 'ab%'` is true when s starts with "ab", where `%` matches any run of characters (including none) and `_` exactly one character (general definition); ILIKE is the "case insensitive like" ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") §4.1). XData generates test data that tells apart queries whose LIKE operators differ (LIKE, ILIKE and their NOT forms), or whose patterns differ by a `_` in place of a `%` (or the reverse) or a missing one (§4.3).

**Learn more:** [XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)") §4.1 and §4.3, which don't define the wildcards (general definition); App. B.1, which solves string conditions with [finite automata](#/glossary/finite-state-machine).

**Related:** [finite-state machine](#/glossary/finite-state-machine), [index (database)](#/glossary/index-database), [mutation testing](#/glossary/mutation-testing)


<a id="likert-scale"></a>

## Likert scale

A rating on a fixed number of ordered, labelled points, such as 1 "strongly disagree" to 5 "strongly agree"; the points are ordered but not necessarily evenly spaced, so averages of Likert ratings are an approximation (general definition). [GQLBench](#/papers/su2026gqlbench "GQLBench: A Large-Scale Cross-Domain, Cross-Dialect Benchmark for NL2GQL (2026)") has judges rate alignment "using a Likert scale ranging from 1 to 5, where 1 denotes completely irrelevant and 5 denotes perfectly aligned" (§6.2, PDF p. 6); [Developing and Benchmarking Verification…](#/papers/alrashed2026verification "Developing and Benchmarking Verification Algorithms to Improve Text-to-SQL Generation (2026)") tried continuous, binary and Likert verifier outputs and found "a discrete 5-point Likert scale" best (§3, PDF p. 3).

**Learn more:** [GQLBench](#/papers/su2026gqlbench "GQLBench: A Large-Scale Cross-Domain, Cross-Dialect Benchmark for NL2GQL (2026)") §6.2 (PDF p. 6); [Developing and Benchmarking Verification…](#/papers/alrashed2026verification "Developing and Benchmarking Verification Algorithms to Improve Text-to-SQL Generation (2026)") §3 (PDF p. 3). Neither defines the scale (general definition).

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [rubric](#/glossary/rubric), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="line-and-statement-coverage"></a>

## Line and statement coverage

The share of a program's lines, or statements, that at least one test executes. In [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)")'s words, line coverage "measures the percentage of executed lines of the source code against the total lines of code when running the test suite" (§2.2, PDF p. 3); [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)") defines statement coverage the same way for statements (App. H.2). Both are weaker than [branch coverage](#/glossary/branch-and-path-coverage): a line can run in a test without its wrong cases being tested.

**Learn more:** [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)") §2.2 (PDF p. 3); [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)") App. H.2.

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [mutation testing](#/glossary/mutation-testing), [online judge](#/glossary/online-judge), [test oracle](#/glossary/test-oracle)


<a id="linear-and-nonlinear-integer-arithmetic"></a>

## Linear and nonlinear integer arithmetic

Linear integer arithmetic (LIA) is the logic of formulas over integer variables built from +, multiplication by a constant, if-then-else, ≤ and =, the Boolean connectives and quantifiers, but never a product of two variables ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1). Solvers can decide it, which is why SQLSolver translates equivalence questions into it ("a LIA formula that can be decided using existing SMT solvers", abstract). Nonlinear integer arithmetic allows products of variables and is undecidable in general: [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") needs it to encode SQL joins, "at the cost of losing decidability in that case" (§2.1, footnote, PDF p. 7).

**Learn more:** [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §4.1 (PDF p. 10); [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 7](https://arxiv.org/pdf/2405.03057#page=7)) §2.1 (PDF p. 7).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [decidable and undecidable](#/glossary/decidable-and-undecidable), [equisatisfiable](#/glossary/equisatisfiable), [first-order logic](#/glossary/first-order-logic)


<a id="linear-probe"></a>

## Linear probe

A linear classifier trained on a frozen model's hidden states (its internal activations) to predict some label, such as a fact the input states or the answer to a multiple-choice question; the model's own weights never change (general definition). [The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)") uses one as a cheap way to fit a model to training data, "linear classifiers trained on frozen model hidden states" (§4), and [AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") calls such "probing classifiers" open to false positives, since high probe accuracy doesn't show the model holds the knowledge (§1).

**Learn more:** [The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)") §4, App. D; [AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") §1. Neither gives a general definition (general definition).

**Related:** [contrastive learning](#/glossary/contrastive-learning)


<a id="linear-programming-lp-and-milp"></a>

## Linear programming (LP and MILP)

An optimization model with a linear objective and linear constraints: minimize cᵀx subject to Ax ≤ b. In a mixed-integer linear program (MILP) some variables must take integer values. The points that satisfy the constraints form the feasible set; the best objective value is the optimal value, and the points that reach it are the optimizers ([ModelEquivBench](#/papers/zhu2026modelequivbench "ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models (2026)") §3.1).

Relaxation and duality: The LP relaxation of a MILP drops the integer requirements and bounds its optimal value. Duality supplies checkable [certificates](#/glossary/certificate): the value of every feasible solution of the dual LP bounds the primal optimal value (weak duality), so a primal and a dual solution with equal values prove both optimal, and Farkas' lemma gives a certificate that a system of linear inequalities has no solution (general definitions).

Example: [ModelEquivBench](#/papers/zhu2026modelequivbench "ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models (2026)") asks whether an LLM-written optimization model is equivalent to a reference model in several senses (same feasible set, same optimal value, optimizer sets in bijection), and backs positive answers with exact certificates such as Farkas and primal–dual evidence (§1, §3.1).

**Learn more:** [ModelEquivBench](#/papers/zhu2026modelequivbench "ModelEquivBench: Certifying Multi-Relational Evaluation of LLM-Generated Optimization Models (2026)") §1, §2.2 and §3.1 (general definitions).

**Related:** [certificate](#/glossary/certificate), [query equivalence](#/glossary/query-equivalence), [optimizing SMT solver](#/glossary/optimizing-smt-solver), [set cover problem](#/glossary/set-cover-problem)


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


<a id="log-linear-model"></a>

## Log-linear model

A model that scores each candidate by a weighted sum of its features and turns the scores into probabilities with an exponential, normalized over all candidates: P(c) = exp(w·f(c)) / Σ exp(w·f(c′)). The weights w are learned from data (general definition; it is the same form as softmax over linear scores). [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") §6.3 uses "a discriminative log-linear model" over features of the English sentence to rank the parses (derivations) of a regex description.

**Learn more:** [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") §6.3.

**Related:** [semantic parsing](#/glossary/semantic-parsing), [negative log-likelihood (NLL)](#/glossary/negative-log-likelihood-nll), [beam search](#/glossary/beam-search)


<a id="logic-of-here-and-there"></a>

## Logic of here-and-there

A logic, introduced by Heyting (1930, not listed here), between classical and intuitionistic logic, whose models have two worlds, "here" and "there", with everything true here also true there (general definition). It matters for [answer set programming](#/glossary/answer-set-programming): the [stable models](#/glossary/stable-model-answer-set) of a program are its equilibrium models, the here-and-there models whose two worlds coincide and that are minimal (Pearce 2006, not listed here). [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") translates logic programs into here-and-there formulas and from there into classical logic, so a first-order prover can check that two programs are [strongly equivalent](#/glossary/strong-equivalence-logic-programs) (§2, §3.2.1).

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §2 and §3.2.1.

**Related:** [stable model (answer set)](#/glossary/stable-model-answer-set), [strong equivalence (logic programs)](#/glossary/strong-equivalence-logic-programs), [answer set programming](#/glossary/answer-set-programming), [first-order logic](#/glossary/first-order-logic)


<a id="logic-programming"></a>

## Logic programming

Programming by stating what is true, as facts and if-then rules in logic, and asking queries that an inference engine answers by deduction, instead of writing out the steps of the computation (general definition). [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") §3.1 calls Prolog "arguably the most prominent symbolic language to describe deductive reasoning problems" and adopts its grammar "to represent a problem as facts, rules, and queries": a fact is a predicate with arguments, such as Age(Peter, 31) for "Peter's age is 31"; a rule says that if some facts are true, further facts are also true; a query "is simply another fact required to be proved based on known facts and rules". Its engine, Pyke, answers by [forward and backward chaining](#/glossary/forward-chaining) (§3.2). Inductive logic programming goes the other way and learns such a program from examples ([LLMs Gaming Verifiers](#/papers/helff2026gaming "LLMs Gaming Verifiers: RLVR can Lead to Reward Hacking (2026)") §2).

**Learn more:** [Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") ([PDF p. 4](https://arxiv.org/pdf/2305.12295#page=4)) §3.1 (PDF p. 4) and §3.2 (PDF p. 5); [LLMs Gaming Verifiers](#/papers/helff2026gaming "LLMs Gaming Verifiers: RLVR can Lead to Reward Hacking (2026)") ([PDF p. 2](https://arxiv.org/pdf/2604.15149#page=2)) §2 (PDF p. 2), on inductive logic programming.

**Related:** [Datalog](#/glossary/datalog), [forward chaining](#/glossary/forward-chaining), [first-order logic](#/glossary/first-order-logic), [production rule (rule engine)](#/glossary/production-rule-rule-engine)


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


<a id="logit-bias"></a>

## Logit bias

A fixed amount added to a token's score (logit) before sampling, which makes the model choose that token more or less often; many model APIs let the caller set one per token (general definition). [PoT (Program of Thoughts prompting)](#/papers/chen2022pot "Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (2023)") §3.1 lowers the score of the `#` token "by a small bias", −2, so that zero-shot programs aren't written as comments.

**Learn more:** [PoT (Program of Thoughts prompting)](#/papers/chen2022pot "Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (2023)") §3.1, which uses it without naming the general term (general definition).

**Related:** [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling), [constrained decoding](#/glossary/constrained-decoding)


<a id="long-context-language-model-lclm"></a>

## Long-context language model (LCLM)

A language model built to read long inputs in one go: [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §1 describes LCLMs as "trained to process large inputs (e.g., 32K tokens or more)", whose attention lets them retrieve and reason across a whole corpus in context. How well they use that context as it grows is a separate question ([context rot](#/glossary/context-rot), [lost in the middle](#/glossary/lost-in-the-middle)).

**Learn more:** [No More Free Lunch](#/papers/singhal2026ctcbench "No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow (2026)") §1.

**Related:** [context rot](#/glossary/context-rot), [lost in the middle](#/glossary/lost-in-the-middle), [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah), [length generalization](#/glossary/length-generalization), [full and block-sparse attention](#/glossary/full-and-block-sparse-attention)


<a id="loop-invariant"></a>

## Loop invariant

A condition that holds each time a loop is about to check whether to run again: it is true before the first iteration, and each iteration keeps it true. When the loop ends, the invariant together with the reason the loop stopped is what lets a verifier prove what holds afterwards. Verifiers generally need invariants written for them as proof annotations; PSV's authors trace that need to verifiers' incompleteness ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. F).

Example ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. D): `max_element` scans `a` with index `i`, keeping `max` as the largest element seen so far. Its invariants say that every `a[j]` with `j < i` is at most `max` and that some `a[j]` with `j < i` equals `max`. When the loop exits, `i` equals the length of `a`, so the invariants become the [formal specification](#/glossary/formal-specification)'s postconditions.

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 13](https://arxiv.org/pdf/2512.18160#page=13)) App. D (PDF pp. 13–14), and §3 (PDF p. 3), where invariants are part of the proof code a solver must write; [Lemur](#/papers/wu2023lemur "Lemur: Integrating Large Language Models in Automated Program Verification (2024)") ([PDF p. 8](https://arxiv.org/pdf/2310.04870#page=8)) §5.2 (PDF p. 8) uses LLMs to propose loop invariants for a verifier, but doesn't define the term; neither does [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") (general definition).

**Related:** [formal specification](#/glossary/formal-specification), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="lora-low-rank-adaptation"></a>

## LoRA (low-rank adaptation)

A cheap way to fine-tune a large model: its weights stay frozen, and small added matrices (an "adapter") are trained whose product is added to some of the weight matrices. The adapter is stored and swapped separately from the model. QLoRA trains such adapters on a copy of the model whose frozen weights are stored in low precision (4-bit), to cut memory further (general definition).

**Learn more:** nothing on this site defines it (general definition; Hu et al., 2021, is not listed here). [Naive Prompt Optimization (NPO)](#/papers/chang2026npo "Naive Prompt Optimization: Rethinking the Need for Complex Prompt Search (2026)") §2.6 trains a LoRA adapter for its GRPO baseline. QLoRA: [The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)") §4 (citing Dettmers et al., 2023, not listed here) and [Sparks of Tabular Reasoning](#/papers/stoisser2025sparks "Sparks of Tabular Reasoning via Text2SQL Reinforcement Learning (2025)") App. C fine-tune with it.

**Related:** [GRPO](#/glossary/grpo), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="lossless-join-decomposition"></a>

## Lossless-join decomposition

A split of a table into smaller tables such that joining them back (a natural join on their shared columns) gives exactly the original table, with no rows lost and no spurious rows added. Normalizing a schema should split tables only this way. [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") checks it symbolically with the [chase](#/glossary/chase) over the [functional dependencies](#/glossary/functional-dependency): a decomposition passes if "the natural join of the generated relations reconstructs the original table without spurious tuples" (§3.2 "Criterion 1", PDF p. 4).

**Learn more:** [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") ([PDF p. 4](https://arxiv.org/pdf/2609.11141#page=4)) (unchecked) §3.2 "Criterion 1" (PDF p. 4).

**Related:** [normalized schema](#/glossary/normalized-schema), [normal forms (1NF, 2NF, 3NF, BCNF)](#/glossary/normal-forms-1nf-2nf-3nf-bcnf), [functional dependency](#/glossary/functional-dependency), [chase](#/glossary/chase)


<a id="lost-in-the-middle"></a>

## Lost in the middle

The finding, from [Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)"), that LLMs use information at the start or end of a long input better than information in its middle: "performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts" (abstract; §1). [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)") §5.1 reports the same on its table tasks: ChatGPT and CodeLlama "achieve higher performance when the answer is located at the beginning or end of the context, compared to when it appears in the middle". LLM-AutoDiff cites the effect as one reason to send feedback only on failed examples, so that errors aren't "diluted within a large block" of correct ones ([LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §3.4.1).

**Learn more:** [Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)") abstract and §1, which reports it; [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)") §5.1; [LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §3.4.1.

**Related:** [positional bias](#/glossary/positional-bias)


<a id="low-resource-programming-language"></a>

## Low-resource programming language

A programming language with little public code to train on, so code LLMs write it worse than well-represented, high-resource ones: [MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") names Java, Python and JavaScript as high-resource and OCaml and Racket as low-resource (abstract). The terms come from machine translation, where a language is "high resource" with many public high-quality training samples and "low resource" with only a few; DSLs "tend to be at the lower end" ([A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") §2.2). One remedy is training data translated from a high-resource language and kept only when translated tests pass ([MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") abstract).

**Learn more:** [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") ([PDF p. 4](https://arxiv.org/pdf/2603.05278#page=4)) §2.2 (PDF p. 4); [MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") ([PDF p. 1](https://arxiv.org/pdf/2308.09895#page=1)) abstract (PDF p. 1).

**Related:** [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl), [distillation](#/glossary/distillation)


<a id="lower-confidence-bound"></a>

## Lower confidence bound

A one-sided [confidence interval](#/glossary/confidence-interval-and-coverage): a number computed from the data that lies below the true quantity except with a chosen small probability δ. [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") App. A.1, Lemma A1 (PDF p. 14): for independent, identically distributed paired score differences in [−1, 1] with mean μ, the probability that μ falls below the computed bound is at most δ. REUSE computes one for each candidate's population improvement over the current system (§2.2).

**Learn more:** [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") ([PDF p. 14](https://arxiv.org/pdf/2609.33180#page=14)) App. A.1, Lemma A1 (PDF p. 14), and App. A.3 (one for pass/fail scores).

**Related:** [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [union bound](#/glossary/union-bound), [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) (its upper counterpart)


<a id="letter-m"></a>

<a id="macro-recall-balanced-accuracy"></a>

## Macro recall (balanced accuracy)

The mean of the recalls on each class, each class's recall being the share of its items that are labelled correctly; with two classes it is also called balanced accuracy (general definition). Unlike plain accuracy, it doesn't let a large class hide poor results on a small one. [claimcheck](#/papers/amster2026claimcheck "claimcheck: Measuring and Improving Specification Faithfulness (2026)") reports it as the mean of the `confirmed` and `disputed` recalls (Tab. 2 caption).

**Learn more:** [claimcheck](#/papers/amster2026claimcheck "claimcheck: Measuring and Improving Specification Faithfulness (2026)") §5.1, Tab. 2 caption.

**Related:** [true and false positive rates](#/glossary/true-and-false-positive-rates), [F1 score](#/glossary/f1-score), [Youden's index](#/glossary/youdens-index)


<a id="magic-sets"></a>

## Magic sets

A query rewrite that first computes the set of values the rest of the query can actually use (the "magic" set) and then restricts an expensive part of the query to those values. Example ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §5.1.3): a query needs departments' average salaries only for departments with a young employee and a large budget, so the rewrite computes the averages for those departments alone instead of for all. It was first used for recursive queries in deductive databases, then for complex decision-support queries, and was implemented in IBM's DB2 (same place, which says, after Seshadri et al., that all magic-set rewrites can be composed from three basic semijoin rules, and proves two of them in Coq).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 9](https://arxiv.org/pdf/1607.04822#page=9)) §5.1.3 (PDF p. 9); [Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)") §6 (PDF p. 17), whose sideways information passing "resembles the magic set transformations". The original papers are not listed here.

**Related:** [correlated subquery](#/glossary/correlated-subquery), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="magma"></a>

## Magma

A set with one binary operation (a rule that combines any two elements into a third, written x * y) and no further laws: the operation need not be associative or commutative, nor have an identity element (general definition). An equation such as x = x * (y * x) holds in some magmas and fails in others. "Equation 1 implies equation 2 over all magmas" means that every magma satisfying the first also satisfies the second. [DIVE](#/papers/xiong2026dive "DIVE: Unlocking Self-Improvement in Frozen Language Models Through Diversity-Driven Skill Evolution (2026)") uses such questions, from the Equational Theories set, as one of its tasks: "Each problem presents two identities over a magma and asks whether the first equation logically implies the second over all possible magmas" (Supp. "Dataset Statistics").

**Learn more:** [DIVE](#/papers/xiong2026dive "DIVE: Unlocking Self-Improvement in Frozen Language Models Through Diversity-Driven Skill Evolution (2026)") ([PDF p. 18](https://arxiv.org/pdf/2608.12486#page=18)) Supp. "Dataset Statistics" (PDF p. 18), which uses the term without defining it (general definition).

**Related:** [first-order logic](#/glossary/first-order-logic)


<a id="mann-whitney-u-test"></a>

## Mann-Whitney U test

A significance test for whether values from one group tend to be larger than values from another, independent group: it ranks all values together and compares the two groups' ranks (general definition). Unlike the [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), it needs no pairing between the groups. SQLess uses it to test whether its query simplification ratios beat those of two other tools ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §5.3).

**Learn more:** [SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)") §5.3 (PDF p. 9), which uses it without defining it (general definition).

**Related:** [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [sign test](#/glossary/sign-test), [multiple testing](#/glossary/multiple-testing), [statistical power](#/glossary/statistical-power)


<a id="many-sorted-first-order-logic"></a>

## Many-sorted first-order logic

[First-order logic](#/glossary/first-order-logic) in which every object has a type, called a sort, and each function and predicate fixes the sorts of its arguments and result, so a formula can't apply a vehicle's predicate to a person (general definition). [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") writes its formalizations in it, as SMT-LIB for an SMT solver (§1); its schemas declare sorts and typed functions, such as `(declare-sort Vehicle 0)` and `(declare-fun speed (Vehicle Int) Real)` (App. B).

**Learn more:** [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") ([PDF p. 1](https://arxiv.org/pdf/2604.25031#page=1)) §1 (PDF p. 1), which names it without defining it, and App. B (PDF p. 13); [Verifying SQL Queries using…](#/papers/mohamed2024cvc5sql "Verifying SQL Queries using Theories of Tables and Relations (2024)") ([PDF p. 3](https://arxiv.org/pdf/2405.03057#page=3)) §1.2 (PDF p. 3), which works in many-sorted logic and sets out its notation (signatures, sorts), and §2 (PDF p. 4), a many-sorted theory of database tables. The textbook definition is not listed here (general definition).

**Related:** [first-order logic](#/glossary/first-order-logic), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [uninterpreted function](#/glossary/uninterpreted-function)


<a id="many-to-many-relationship"></a>

## Many-to-many relationship

A link between two kinds of things in which an item on either side can be linked to several on the other, such as gyms and fitness classes: "a gym can offer multiple classes and a class can be offered by multiple gyms" ([AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") §3.3). A relational schema stores it as a separate table of pairs, each column a foreign key to one side (general definition), like AMBROSIA's "Gyms_Classes" table (§3.2, Fig. 1a). AMBROSIA builds its scope-ambiguity questions ("What activities does each gym offer?") on such a relationship with a class common to several gyms (§3.3).

**Learn more:** [AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)") ([PDF p. 4](https://arxiv.org/pdf/2406.19073#page=4)) §1, §3.2 (PDF p. 4) and §3.3 (PDF p. 5), which use the term without defining it (general definition).

**Related:** [normalized schema](#/glossary/normalized-schema), [integrity constraint](#/glossary/integrity-constraint)


<a id="markov-chain"></a>

## Markov chain

A random process moving between states in which the next state depends only on the current one, not on the path that led there, with fixed transition probabilities (general definition). A stationary distribution is a distribution over the states that one step leaves unchanged; many chains settle into it over time.

Example: [interwhen](#/papers/bhat2026interwhen "interwhen: A Generalizable Framework for Steering Reasoning Models with Test-time Verification (2026)") models an LLM's reasoning as a two-state Markov chain, compliant or not, with transition probabilities such as Pr(P_{t+1} = 1 | P_t = 1) = 1 − δ, and compares the chains with and without verification-based steering (§4.4, App. A). [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") models the form a hallucination takes from stage to stage of a pipeline as "a first-order Markov process over four states" (§4).

**Learn more:** [interwhen](#/papers/bhat2026interwhen "interwhen: A Generalizable Framework for Steering Reasoning Models with Test-time Verification (2026)") §4.4 and App. A; [The Hallucination Snowball](#/papers/singh2026snowball "The Hallucination Snowball: Modeling Error Propagation as State Transitions in Multi-Agent LLM Pipelines (2026)") §4. Neither defines it (general definition).

**Related:** [Markov decision process](#/glossary/markov-decision-process), [finite-state machine](#/glossary/finite-state-machine)


<a id="markov-decision-process"></a>

## Markov decision process

The formal setting of [reinforcement learning](#/glossary/reinforcement-learning): a set of states, a set of actions, transition probabilities that give the chance of each next state after an action in a state (in QUITE and in token generation the next state is fixed), and a reward for each step, often with a discount factor γ < 1 that makes later rewards count less. A policy chooses an action in each state; the goal is a policy with the highest expected total (discounted) reward. "Markov" means the next state depends only on the current state and action, not on how the process got there.

Example: QUITE models query rewriting as an MDP (S, A, T, r, γ): a state is the current form of the query, an action is a refinement "(e.g., join reordering, predicate pushdown)" or a terminal action that emits the final query, the transition is deterministic (§4.1), and a refinement's reward is the drop in "the DBMS optimizer's estimated execution cost (via EXPLAIN) and LLM's evaluation" ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") §4.1). Its policy is a prompted reasoning LLM (DeepSeek-R1), and QUITE is "training-free" (§1), so here the MDP frames the agent's reasoning rather than an RL training run. In text generation more generally a state is the prompt plus the tokens so far and an action is the next token; LITHE frames its token-level search this way ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §5).

**Learn more:** [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") ([PDF p. 5](https://arxiv.org/pdf/2506.07675#page=5)) §4.1 (PDF p. 5); [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 10](https://arxiv.org/pdf/2502.12918#page=10)) §5 (PDF p. 10). LITHE cites Puterman's 1994 book on MDPs (ref. [41], PDF p. 27) and QUITE his 1990 handbook chapter (ref. [62], PDF p. 14); neither is on this site.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts), [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [POMDP (partially observable Markov decision process)](#/glossary/pomdp-partially-observable-markov-decision-process), [Markov chain](#/glossary/markov-chain)


<a id="masked-language-model"></a>

## Masked language model

A language model trained to fill in hidden tokens using the text on both sides of them, such as BERT and RoBERTa, rather than to predict the next token from the left (general definition). AutoPrompt uses one by putting a single `[MASK]` token in a prompt: the model's probability distribution over that slot gives the answer, for a classification task through the probabilities of chosen label words ([AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") §2.1).

**Learn more:** [AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)") §1 and §2.1, which use the term without defining it (general definition).


<a id="materialized-view"></a>

## Materialized view

A query result that the database computes in advance and stores like a table, so that later queries can read it instead of recomputing it; the optimizer can rewrite a query to use it, and it must be updated when the underlying tables change. Calcite's authors call "the precomputation of relevant summaries or materialized views" one of the most powerful techniques for speeding up data-warehouse queries ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §6), and GEqO's authors name materialized-view selection and matching among the uses of finding equivalent subexpressions ([GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1). EQUITAS's authors measure the speedup from materializing sub-queries shared by recurring production queries ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §6.3, PDF p. 11).

**Learn more:** [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)") §6; [GEqO](#/papers/haynes2024geqo "GEqO: ML-Accelerated Semantic Equivalence Detection (2023)") §1.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [query equivalence](#/glossary/query-equivalence), [common table expression (CTE)](#/glossary/common-table-expression-cte)


<a id="matthews-correlation-coefficient-mcc"></a>

## Matthews correlation coefficient (MCC)

A score for a yes/no classifier that uses all four cells of the confusion matrix (true and false positives and negatives): MCC = (TP·TN − FP·FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN)). It is a correlation between predicted and true labels, from −1 (always wrong) through 0 (no better than chance) to 1 (always right) (range: general definition). [ROSE](#/papers/pei2026rose "ROSE: An Intent-Centered Evaluation Metric for NL2SQL (2026)") reports it beside Cohen's kappa, accuracy and F1 because it "is reliable when class sizes differ substantially" (§5.1.2).

**Learn more:** [ROSE](#/papers/pei2026rose "ROSE: An Intent-Centered Evaluation Metric for NL2SQL (2026)") ([PDF p. 4](https://arxiv.org/pdf/2604.12988#page=4)) §5.1.2 (PDF p. 4) and App. D (PDF p. 12), which gives the formula; the original paper (Matthews, 1975) is not listed here.

**Related:** [Cohen's kappa](#/glossary/cohens-kappa), [F1 score](#/glossary/f1-score), [true and false positive rates](#/glossary/true-and-false-positive-rates), [macro recall (balanced accuracy)](#/glossary/macro-recall-balanced-accuracy), [Pearson correlation](#/glossary/pearson-correlation)


<a id="mcnemars-exact-test"></a>

## McNemar's exact test

A significance test for comparing two systems scored right or wrong on the same examples. It ignores the examples both get right or both get wrong, and asks whether the examples where exactly one is right (the "discordant pairs") split more unevenly than chance allows. Pairing makes it sharper than comparing two accuracies with separate confidence intervals. The exact version counts the discordant pairs against a fair coin (a binomial test); the chi-square version approximates it for larger counts, χ² = (b − c)²/(b + c) for b and c discordant pairs of each kind, or (|b − c| − 1)²/(b + c) with Yates' continuity correction (general definition). [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") uses the chi-square version "with Yates' continuity correction" to test whether disagreements between a scoring script and human labels "are symmetric or systematically biased in one direction" (§3.2.2).

**Learn more:** [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") ([PDF p. 7](https://arxiv.org/pdf/2609.04697#page=7)) §5 (PDF p. 7), which uses it on 1,534 shared dev examples and reports the discordant-pair counts; [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)") ([PDF p. 6](https://arxiv.org/pdf/2603.29399#page=6)) §3.2.2 (PDF p. 6), which uses the chi-square version with Yates' correction (not the test); [SAGE (Statistical Acceptance Gate)](#/papers/wang2026sage "SAGE: A Statistical Acceptance Gate for Self-Evolving Agents (2026)") ([PDF p. 6](https://arxiv.org/pdf/2609.36043#page=6)) §3.3 (PDF p. 6), which describes the exact version's null as "each discordant pair as a fair coin flip". The test's original paper is not listed here.

**Related:** [execution accuracy](#/glossary/execution-accuracy), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing)


<a id="mean-field-approximation-mean-field-ode"></a>

## Mean-field approximation (mean-field ODE)

Describing a random process with many interacting parts by the deterministic evolution of its average state, ignoring the random fluctuations around it (general definition). A mean-field ODE is the differential equation that average follows.

Example: [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") treats each training update's expected change to the probabilities of a model's reasoning modes as one forward-Euler step of a continuous-time ODE (App. C.3), and its Theorem 6.1 gives the mean-field ODE for the total probability on wrong modes under GRPO (§6). [Memory Reward Inflation in…](#/papers/asadolahi2026memoryinflation "Memory Reward Inflation in Self-Improving LLM Agents (2026)") analyzes "a stylized mean-field model" of an agent's memory write-back loop (§5.2).

**Learn more:** [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") ([PDF p. 14](https://arxiv.org/pdf/2601.04411#page=14)) (unchecked) §6 (PDF p. 14) and App. C.3 ("From Expectation-Based Updates to ODEs: The Small-Step Bridge", PDF p. 29), which derive it without a general definition (general definition). [Memory Reward Inflation in…](#/papers/asadolahi2026memoryinflation "Memory Reward Inflation in Self-Improving LLM Agents (2026)") has an open erratum on its mean-field Theorem 2(ii), so don't cite that result for the term.

**Related:** [policy gradient](#/glossary/policy-gradient), [GRPO](#/glossary/grpo), [replicator dynamics](#/glossary/replicator-dynamics)


<a id="memo"></a>

## Memo

The data structure in which a Volcano/Cascades [query optimizer](#/glossary/query-optimizer) stores every alternative it has considered, compactly. Equivalent expressions are kept together in a group, and an expression's inputs are groups rather than concrete subtrees, so one stored expression stands for every combination of its inputs' alternatives, and nothing is derived twice.

Example ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2.1, Fig. 2): for `SELECT * FROM A, B, C WHERE A.x = B.y AND B.p = C.q`, group 4 holds `Join(1, 2)` and `Join(2, 1)`, the join of A and B both ways round, and the root group's expression `Join(4, 3)` stands for both `Join(Join(A,B),C)` and `Join(Join(B,A),C)`. QO-Verify builds the memo of each of two queries and declares them equivalent if it finds a logical expression common to both (§1, §2.2).

**Learn more:** [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2.1 (PDF p. 3); [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §3 (PDF p. 4), where it is "a hash table of expressions and equivalence classes"; [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2 (PDF pp. 2–4), which calls it the "memo" structure and drops "exact replicas of expressions that already exist" when adding new ones.

**Related:** [query optimizer](#/glossary/query-optimizer), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [logical plan](#/glossary/logical-plan)


<a id="memoization"></a>

## Memoization

Caching the results of a computation so that a repeated call reuses them instead of redoing the work (general definition). In regex matching it speeds up a backtracking engine by "caching intermediate results, significantly reducing redundant computations" ([SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §3.1.2, describing Davis et al.'s method), which defends against [ReDoS](#/glossary/redos-and-catastrophic-backtracking); "selective" memoization caches only some of them, and Ruby's engine uses "full memoization rather than selective memoization despite the higher space complexity" (§4.1.2). Not the same as a query optimizer's [memo](#/glossary/memo).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §3.1.2 and §4.1.2. The Davis et al. paper it cites is not listed here.

**Related:** [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [memo](#/glossary/memo)


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


<a id="min-ones-satisfiability"></a>

## Min-ones satisfiability

A version of [SAT](#/glossary/sat-and-smt-solvers) that asks for a satisfying assignment with few variables set to true: "given a Boolean formula φ, it checks whether φ is satisfiable with at most k variables set to true" ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §4); the optimization version asks for the fewest. RATest maps its smallest witness problem (the fewest input rows that still put one output row in the difference of two queries, a step towards a small [counterexample database](#/glossary/counterexample-database)) to it: one Boolean variable per input row, the output row's Boolean provenance as the formula, and a true variable meaning the row is in the witness (§4, §4.1).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §4 and §4.1 (the smallest witness problem: Def. in §2.2), citing Kratsch et al. (2010), not listed here.

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [optimizing SMT solver](#/glossary/optimizing-smt-solver), [data provenance](#/glossary/data-provenance), [witness (provenance)](#/glossary/witness-provenance), [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy)


<a id="minimax-optimality"></a>

## Minimax optimality

An algorithm is minimax optimal when its worst-case cost (error, number of samples) matches, up to constant or stated factors, a lower bound that no algorithm can beat in the worst case (general definition). [Self-Improvement in Language Models](#/papers/huang2024sharpening "Self-Improvement in Language Models: The Sharpening Mechanism (2025)") proves lower bounds for its setting and states that its SFT-based approach "is minimax optimal" under stated conditions (abstract, §1.2).

**Learn more:** [Self-Improvement in Language Models](#/papers/huang2024sharpening "Self-Improvement in Language Models: The Sharpening Mechanism (2025)") abstract and §1.2, which use the term without defining it (general definition).

**Related:** [best arm identification](#/glossary/best-arm-identification), [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy)


<a id="minimum-description-length-mdl"></a>

## Minimum description length (MDL)

A rule for choosing among explanations of data: prefer the one that minimizes the total length of describing the explanation plus the data given the explanation, which penalizes both needlessly complex explanations and ones that explain too little. QueryBooster uses it to choose rewrite rules that generalize a user's example rewrites without under- or overfitting them; the principle "minimizes the total length required to describe the underlying patterns in the data" ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §5.1, citing Rissanen 1978, not listed here).

**Learn more:** [QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)") §5.1, which states the principle in one line but not its two-part form (general definition).

**Related:** [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic), [hill climbing](#/glossary/hill-climbing)


<a id="mixture-of-experts-moe"></a>

## Mixture of experts (MoE)

A model built from several sub-networks ("experts") and a gating network that, for each input, weights the experts or picks a few of them, and combines their outputs. In current LLMs it is a way to grow total size without growing the cost per token: DeepSeek-V3, an MoE model, has 671 billion parameters, of which 37 billion are activated per token ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 1.1). CrackSQL uses the dense form, in which every expert contributes: several encoders whose embeddings of a syntax specification are combined with softmax weights from a gating network ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") §5.1, Eqs. 2–3, PDF p. 11).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 5](https://arxiv.org/pdf/2501.12948#page=5)) Supp. 1.1 (SI PDF p. 5); [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)") ([PDF p. 10](https://arxiv.org/pdf/2504.00882#page=10)) §5.1 (PDF pp. 10–11). Neither defines the term (general definition).

**Related:** [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation), [post-training quantization](#/glossary/post-training-quantization)


<a id="modal-μ-calculus"></a>

## Modal μ-calculus

A logic of formulas that hold at nodes of a graph or tree: ⟨a⟩φ says that one move along a reaches a node where φ holds, and fixpoint operators define properties recursively, μ taking the least solution and ν the greatest. "Alternation-free" means no least and greatest fixpoints depend on each other, and "with converse" adds backward moves, such as to the parent (general definition).

It recalls that the propositional modal µ-calculus "has been shown to be as expressive as nondeterministic tree automata" (§9, PDF p. 9).

**Learn more:** [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §4 (PDF pp. 2–3), Figs. 1–2, the syntax and meaning of its formulas, and §9 (PDF p. 9); [XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") §4. Kozen's original paper (1983) is not listed here.

**Related:** [first-order logic](#/glossary/first-order-logic), [monadic second-order logic (MSO)](#/glossary/monadic-second-order-logic-mso), [regular tree language and tree automaton](#/glossary/regular-tree-language-and-tree-automaton), [satisfiable and valid](#/glossary/satisfiable-and-valid), [query containment](#/glossary/query-containment), [decidable and undecidable](#/glossary/decidable-and-undecidable)


<a id="model-collapse"></a>

## Model collapse

The degradation of a model trained repeatedly on model-generated data, its own or other models', for example outputs that lose diversity. [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") §7 says that "one of the most effective strategies to prevent model collapse during self-training is the use of a reliable verifier", citing Gillman et al.

**Learn more:** [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") §1 and §7, with citations to the model-collapse literature (none of it on this site).

**Related:** [distillation](#/glossary/distillation), [expert iteration](#/glossary/expert-iteration), [rejection sampling](#/glossary/rejection-sampling)


<a id="model-context-protocol-mcp"></a>

## Model Context Protocol (MCP)

An open protocol through which a server offers tools and data to an LLM agent in a standard form, so one harness can use any MCP server without custom glue (general definition; introduced by Anthropic in 2024). [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") says MCP servers "expose callable tools and file-like resources such as API responses and document contents" (App. A.2); [ProgAgent](#/papers/li2026progagent "ProgAgent: Learning Tool Orchestration through Programmatic Training (2026)") exposes its runtime to the model "as an MCP server" (§3.2), following [LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)").

**Learn more:** [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") App. A.2; [ProgAgent](#/papers/li2026progagent "ProgAgent: Learning Tool Orchestration through Programmatic Training (2026)") §3.2. Neither defines the protocol (general definition).

**Related:** [tool calling (function calling)](#/glossary/tool-calling-function-calling), [agent harness](#/glossary/agent-harness), [agent skill](#/glossary/agent-skill)


<a id="molecular-fingerprint-and-tanimoto-similarity"></a>

## Molecular fingerprint and Tanimoto similarity

A molecular fingerprint is a fixed-length bit vector recording which substructures (atom groups, paths, ring patterns) a molecule contains; MACCS, RDKit and Morgan fingerprints differ in which substructures they record. Tanimoto similarity compares two fingerprints as the bits set in both over the bits set in either, the [Jaccard similarity](#/glossary/jaccard-similarity) of the two bit sets (general definition). [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") scores generated molecules by MACCS, RDKit and Morgan similarity to the reference (§6, its result tables; App. D).

**Learn more:** [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") §6 and App. D, which use the scores without defining them (general definition).

**Related:** [Jaccard similarity](#/glossary/jaccard-similarity), [SMILES](#/glossary/smiles), [reaction prediction and retrosynthesis](#/glossary/reaction-prediction-and-retrosynthesis)


<a id="monadic-second-order-logic-mso"></a>

## Monadic second-order logic (MSO)

[First-order logic](#/glossary/first-order-logic) extended with variables that stand for sets of elements (on trees, sets of nodes) and quantifiers over them, so a formula can say that some set of nodes with a given property exists (general definition). [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") names first-order logic and MSO as "the two logics used for unranked trees" in work on XML, and calls MSO's weak variant over two successors (WS2S) "one of the most expressive decidable logic used when both regular types and queries" are considered, with non-elementary satisfiability (§9, PDF p. 9).

**Learn more:** [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §9 (PDF p. 9) and [XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") §4, which use it without defining it (general definition).

**Related:** [first-order logic](#/glossary/first-order-logic), [modal μ-calculus](#/glossary/modal-μ-calculus), [regular tree language and tree automaton](#/glossary/regular-tree-language-and-tree-automaton), [decidable and undecidable](#/glossary/decidable-and-undecidable)


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

What a node is varies: in LaSER a node is a whole SQL query and an edge a cost-increasing transformation, and "simulation" means running the query, "Unlike standard MCTS formulations that rely on stochastic rollouts" ([LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §4.2); in LITHE a node is a partial LLM output and an edge a token, with branching only where the model is unsure of the next token ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") §5); LearnedRewrite searches over orders of rewrite-rule applications ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §1). Snell et al. call their lookahead search "a special case of MCTS" with its stochastic elements removed ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") §5.2). The DeepSeek-R1 authors tried MCTS for training and report that token generation "presents an exponentially larger search space" than chess and that the value model guiding the search is hard to train ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 7.2).

**Learn more:** [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") ([PDF p. 5](https://arxiv.org/pdf/2604.06804#page=5)) §4.2, Eq. 1 and Fig. 2 (PDF pp. 5–6); [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)") ([PDF p. 10](https://arxiv.org/pdf/2502.12918#page=10)) §5 (PDF pp. 10–13); [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §1 (PDF p. 1); [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") ([PDF p. 8](https://arxiv.org/pdf/2408.03314#page=8)) §5.2 (PDF p. 8); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 57](https://arxiv.org/pdf/2501.12948#page=57)) Supp. 7.2 (SI PDF p. 57).

**Related:** [beam search](#/glossary/beam-search), [Markov decision process](#/glossary/markov-decision-process), [reinforcement learning](#/glossary/reinforcement-learning), [phase ordering](#/glossary/phase-ordering)


<a id="multi-agent-debate"></a>

## Multi-agent debate

Several LLM agents answer or check the same question and exchange their reasoning over rounds, revising their positions, before a final answer or verdict is taken, often by vote (general definition, after Du et al. 2023, not listed here). [VeRA](#/papers/cheng2026vera "VeRA: Renewing Reasoning Benchmarks with Executable Specifications (2026)") checks answers by structured debate with "five agents and up to five rounds" (App. L). [Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)") argues that multi-agent debate "does not outperform self-consistency" with the same number of responses (§4).

**Learn more:** [VeRA](#/papers/cheng2026vera "VeRA: Renewing Reasoning Benchmarks with Executable Specifications (2026)") App. L; [Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)") §4.

**Related:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [self-correction](#/glossary/self-correction), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="multi-armed-bandit-ucb"></a>

## Multi-armed bandit (UCB)

Choosing repeatedly among options ("arms") whose payoff is unknown, balancing trying the ones that look best against trying the ones not yet tried enough. UCB (upper confidence bound) picks the arm with the highest mean reward so far plus a bonus that shrinks as the arm is tried more often.

**Learn more:** [Learning from Prompt itself](#/papers/chen2026attribution "Learning from Prompt itself: the Hierarchical Attribution Prompt Optimization (2026)") § "UCB-based Edit Selection", where each arm is a candidate prompt edit and its reward the change in dev-set accuracy. The original UCB papers are not listed here.

**Related:** [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts), [Elo rating](#/glossary/elo-rating), [best arm identification](#/glossary/best-arm-identification), [exploration and exploitation](#/glossary/exploration-and-exploitation)


<a id="multi-fidelity-optimization"></a>

## Multi-fidelity optimization

Searching with a cheaper, less exact version of an expensive objective (fewer data, a smaller budget, a surrogate model) for most evaluations, and the full objective for few (general definition). [Optimize Cheap](#/papers/oved2026crosstier "Optimize Cheap, Deploy Strong: Cost-Aware Cross-Tier Transfer for Evolutionary Optimization (2026)") traces it to "surrogate-assisted and multi-fidelity evolutionary algorithms that approximate the expensive objective with a cheaper one" (§1); in that work, it says, "Fidelity there is data-subset size, budget, or a surrogate of the same objective", while the paper makes "fidelity the model tier itself": prompts are searched with a cheap model and deployed on a stronger one (§7).

**Learn more:** [Optimize Cheap](#/papers/oved2026crosstier "Optimize Cheap, Deploy Strong: Cost-Aware Cross-Tier Transfer for Evolutionary Optimization (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.10694#page=1)) §1 (PDF p. 1) and §7 (PDF p. 8). The multi-fidelity papers it cites are not listed here.

**Related:** [hyperparameter optimization](#/glossary/hyperparameter-optimization), [Bayesian optimization](#/glossary/bayesian-optimization), [black-box optimization](#/glossary/black-box-optimization), [evolutionary search](#/glossary/evolutionary-search), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="multi-hop-question-answering"></a>

## Multi-hop question answering

Questions whose answer needs facts from several documents, found one after another: "where was the director of film X born?" needs the director first, then the birthplace. Systems answer them by retrieving several times, each search informed by what earlier ones found. DSPy's case study uses HotPotQA, a benchmark of such questions, with multi-hop retrieval ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7).

**Learn more:** [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7, which uses the term without defining it (general definition).

**Related:** [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [recall@k and mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr)


<a id="multi-query-attention"></a>

## Multi-query attention

A transformer attention layout in which each block keeps its full set of query heads but all of them share one key head and one value head, which shrinks the [KV cache](#/glossary/kv-cache) and so speeds up sampling. [AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)") adopts it from Shazeer (2019) because "sharing key and value heads per attention block significantly reduces memory usage and cache update costs, which are the main bottleneck during sampling" (§4.1; "one shared attention head for keys and one for values each block", §5.3.2).

**Learn more:** [AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)") §4.1 and §5.3.2; [Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)") §2.4, "a single key-value pair per token per layer for faster decoding". Shazeer (2019) is not listed here.

**Related:** [KV cache](#/glossary/kv-cache)


<a id="multiple-testing"></a>

## Multiple testing

The problem that comes with making many comparisons at once: even when no difference is real, the chance that at least one looks significant by luck grows with the number of comparisons. Corrections such as Holm–Bonferroni raise the bar for each comparison so that the chance of any false alarm in the whole family stays at the chosen level.

Example: [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") compares seven methods with a baseline in each setting and adjusts the p-values (each the chance of a difference at least this large if the method were no better than the baseline) with the Holm–Bonferroni procedure, which "controls the chance of any false alarm inside a setting" (§4.5, §4.7).

[ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") uses the term for a related effect, selecting a winner: choosing the best of about 10 prompts on 30 validation examples is "a multiple-testing problem: a candidate may rank first due to favorable noise rather than true quality" (§3.4). Its remedy is [bootstrap resampling](#/glossary/bootstrap-resampling), not a p-value correction.

**Learn more:** [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") ([PDF p. 8](https://arxiv.org/pdf/2607.28576#page=8)) §4.5 (PDF p. 8) and §4.7 (PDF p. 10); [ESPO](#/papers/liu2026espo "ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize (2026)") ([PDF p. 4](https://arxiv.org/pdf/2609.04197#page=4)) §3.4 (PDF p. 4). Holm's paper, which [Sample More, Reflect Less](#/papers/mirzaei2026samplemore "Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B (2026)") cites, is not listed here.

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling), [McNemar's exact test](#/glossary/mcnemars-exact-test), [Bonferroni correction](#/glossary/bonferroni-correction), [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


<a id="mutation-testing"></a>

## Mutation testing

A way to judge a test suite: make many copies of the program (mutants), each with one small deliberate change such as `<` replaced by `<=`, and count how many of them the tests tell apart from the original; a test that does so is said to kill the mutant. A mutant that happens to be equivalent to the original can never be killed, so the goal is to kill all the non-equivalent ones.

For SQL, the program is a query and the mutants model likely mistakes in writing it; a test database kills a mutant if the query and the mutant return different results on it ([Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") §1), which makes it a [counterexample database](#/glossary/counterexample-database) for that pair. Example: to kill the mutant `r.A <= 5` of the condition `r.A < 5`, a database needs a row with `r.A = 5` that changes the query's result.

Mutation testing changes the program; mutation-based [fuzzing](#/glossary/fuzzing) changes the inputs.

**Learn more:** [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)") ([PDF p. 5](https://arxiv.org/pdf/2305.01210#page=5)) §2.2 (PDF p. 5), for programs ("also known as mutation analysis"); [Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") ([PDF p. 1](https://arxiv.org/pdf/2409.18821#page=1)) §1 (PDF p. 1) and §2 (PDF p. 2), for SQL queries and the XData line of test-data generators.

**Related:** [branch and path coverage](#/glossary/branch-and-path-coverage), [counterexample database](#/glossary/counterexample-database), [fuzzing](#/glossary/fuzzing)


<a id="mutual-information"></a>

## Mutual information

How much knowing one random quantity tells about another: the reduction in uncertainty ([Shannon entropy](#/glossary/shannon-entropy)) about one from learning the other, zero exactly when they are independent (general definition). [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)") gives a lower bound on the conditional mutual information between a judge's "own" committed answer and the candidate answer it was shown, as a measure of how much the candidate leaks into the judge's answer (§4).

**Learn more:** [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)") §4, which uses it without defining it (general definition).

**Related:** [Shannon entropy](#/glossary/shannon-entropy), [KL divergence](#/glossary/kl-divergence), [self-information](#/glossary/self-information)


<a id="letter-n"></a>

<a id="named-entity-recognition-ner"></a>

## Named-entity recognition (NER)

Finding the names of things in a text (people, places, drugs, symptoms) and labelling each with its type (general definition). It can check a generated text against its source: an entity in the output that the source never mentions is a likely hallucination. [SynTra (Synthetic Transfer)](#/papers/jones2023syntra "Teaching Language Models to Hallucinate Less with Synthetic Tasks (2023)") counts such "ungrounded" entities in clinical notes with a commercial NER service (§3.3, App. B.5).

**Learn more:** [SynTra (Synthetic Transfer)](#/papers/jones2023syntra "Teaching Language Models to Hallucinate Less with Synthetic Tasks (2023)") §3.3, App. B.5, which uses the term without defining it (general definition).

**Related:** [reference-free evaluation](#/glossary/reference-free-evaluation)


<a id="natural-language-inference-nli"></a>

## Natural language inference (NLI)

Deciding whether a hypothesis text follows from a premise text (entailment), contradicts it, or neither (neutral) (general definition). Models trained for it give a probability for each label and serve as a check of meaning: [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") runs one both ways between a rule and its back-translation, since texts with the same meaning should entail each other (§5). Gotcha: a dataset's labels may record a reader's interpretation rather than strict logic. [Know Your Limits](#/papers/wang2026limits "Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning (2026)") says so of ContractNLI's, re-annotates a subset so that a hypothesis is entailed only when premise ∧ ¬hypothesis is unsatisfiable, and finds most changed labels moving to Neutral (§3.1, Tab. 1).

**Learn more:** [Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") ([PDF p. 4](https://arxiv.org/pdf/2604.25031#page=4)) §5 (PDF p. 4); [Know Your Limits](#/papers/wang2026limits "Know Your Limits: On the Faithfulness of LLMs as Solvers and Autoformalizers in Legal Reasoning (2026)") ([PDF p. 3](https://arxiv.org/pdf/2606.16118#page=3)) §3.1 (PDF p. 3). Neither defines the task, and no paper on this site does (general definition).

**Related:** [back-translation](#/glossary/back-translation), [satisfiable and valid](#/glossary/satisfiable-and-valid), [reference-free evaluation](#/glossary/reference-free-evaluation), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="needle-in-a-haystack-niah"></a>

## Needle in a haystack (NIAH)

A long-context test in which "a known sentence (the 'needle') is placed in a long document of unrelated text (the 'haystack'), and the model is prompted to retrieve it" ([Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") PDF p. 3). It is easy to scale, but [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") calls it "fundamentally a simple retrieval task" that mostly tests direct word matching (PDF p. 3), and [LongProc ("Long Procedural Generation")](#/papers/ye2025longproc "LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation (2025)") §2 notes that its extensions still need only a few snippets of the input. Variants hide several needles ([LongProc ("Long Procedural Generation")](#/papers/ye2025longproc "LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation (2025)") §2) or keep the needle fixed while the text grows ([RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §3). The original test is Kamradt (2023), not listed here.

**Learn more:** [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") (PDF pp. 3–4); [LongProc ("Long Procedural Generation")](#/papers/ye2025longproc "LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation (2025)") §2; [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)") §1, Fig. 1; [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §3.

**Related:** [context rot](#/glossary/context-rot), [lost in the middle](#/glossary/lost-in-the-middle), [information dispersion](#/glossary/information-dispersion)


<a id="negation-as-failure"></a>

## Negation as failure

In logic programming, `not p` holds when p cannot be derived from the program, not when p is proved false: a closed-world reading in which what can't be shown is taken as false (general definition). It makes a program's meaning depend on what is absent, which is why [answer set programming](#/glossary/answer-set-programming) defines its meaning through [stable models](#/glossary/stable-model-answer-set). [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §2 allows rule literals "possibly preceded by one or two negation-as-failure symbols".

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §2, which uses the term without defining it (general definition).

**Related:** [logic programming](#/glossary/logic-programming), [stable model (answer set)](#/glossary/stable-model-answer-set), [Datalog](#/glossary/datalog), [Clark's completion and tight programs](#/glossary/clarks-completion-and-tight-programs)


<a id="negative-log-likelihood-nll"></a>

## Negative log-likelihood (NLL)

Minus the logarithm of the probability a model assigns to a given text (or the average over its tokens): lower means the model finds the text likelier (general definition). It is the usual training loss for language models, and its per-token average, exponentiated, is [perplexity](#/glossary/perplexity). [Reasoning Core](#/papers/sileo2026reasoningcore "Reasoning Core: Designing Broad Procedural Data for Completion-Supervised Reasoning Training (2026)") measures how adding a collection of auxiliary training data changes a model's NLL on evaluation sets (§4.2).

**Learn more:** [Reasoning Core](#/papers/sileo2026reasoningcore "Reasoning Core: Designing Broad Procedural Data for Completion-Supervised Reasoning Training (2026)") §4.1–4.2, which use it without defining it (general definition).

**Related:** [perplexity](#/glossary/perplexity), [KL divergence](#/glossary/kl-divergence), [Shannon entropy](#/glossary/shannon-entropy)


<a id="negative-side-effects"></a>

## Negative side effects

An agent disturbing something its objective never mentions while it completes its task. [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") §1 names it, after Amodei et al. (2016, not listed here), as one of two AI-safety problems beside [reward hacking](#/glossary/reward-hacking): "negative side effects, in which an agent completes its task and also disturbs something the reward never mentions". Example: [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)") treats side effects as "an implicit measure of harmful side effects" that users want kept low beside the proxy objective, such as the toxicity of an agent's tweets or a banking agent's unauthorized money transfers (§1, §3.2).

**Learn more:** [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") §1; [Feedback Loops With Language…](#/papers/pan2024feedbackloops "Feedback Loops With Language Models Drive In-Context Reward Hacking (2024)") §1 and §3.2.

**Related:** [reward hacking](#/glossary/reward-hacking), [frame condition](#/glossary/frame-condition)


<a id="negative-transfer"></a>

## Negative transfer

When training on, or reusing what was learned from, one task or domain lowers performance on another (general definition). Example: [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") reports that RL on harder math data "introduces a risk of negative transfer to easier tasks in other domains" (§3.3); [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") reports a context learned on one game lowering scores on another (§5); [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") uses the term for memories carried from other coding benchmarks that hurt, and analyses it per task (§4.4.1).

**Learn more:** [Revisiting Reinforcement Learning for…](#/papers/cheng2025guru "Revisiting Reinforcement Learning for LLM Reasoning from A Cross-Domain Perspective (2025)") §3.3; [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") §5; [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") abstract, §4.4.1. None defines it (general definition).

**Related:** [catastrophic forgetting](#/glossary/catastrophic-forgetting), [backward and forward transfer (BWT and FWT)](#/glossary/backward-and-forward-transfer-bwt-and-fwt), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization)


<a id="neuro-symbolic-ai"></a>

## Neuro-symbolic AI

Systems that combine neural models, such as LLMs, which are good at producing plausible candidates, with symbolic, model-based components such as planners, solvers or verifiers, which reason with explicit rules and can give guarantees (general definition). [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") argues for such a combination for planning, with LLMs as "approximate knowledge sources" and external verifiers checking their plans (abstract, §1).

**Learn more:** [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") abstract and §1 (general definition).

**Related:** [System 1 and System 2](#/glossary/system-1-and-system-2), [autoformalization](#/glossary/autoformalization), [proof assistant](#/glossary/proof-assistant), [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis)


<a id="newcombe-confidence-interval"></a>

## Newcombe confidence interval

A confidence interval for the difference between two success rates by Newcombe's "hybrid score" method, which combines the [Wilson score intervals](#/glossary/wilson-score-interval) of the two rates; there are versions for independent samples and for paired data, where both rates are measured on the same items (general definition). [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.3 (PDF p. 6), comparing two models on independent questions, notes that "better frequentist methods exist, e.g. the hybrid score interval introduced in Newcombe (1998)" than the CLT-based interval, but "they are harder to implement and are not available in standard libraries". [The Regression Tax](#/papers/tank2026regressiontax "The Regression Tax: Decomposing Why Skills Help -- and Hurt -- LLM Agents (2026)") Tab. 2 gives each skill library's "paired difference in pass rate in percentage points with a 95% Newcombe confidence interval".

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") ([PDF p. 6](https://arxiv.org/pdf/2503.01747#page=6)) §3.3 (PDF p. 6); [The Regression Tax](#/papers/tank2026regressiontax "The Regression Tax: Decomposing Why Skills Help -- and Hurt -- LLM Agents (2026)") ([PDF p. 4](https://arxiv.org/pdf/2607.22520#page=4)) (unchecked) Tab. 2 (PDF p. 4). Neither defines it (general definition); Newcombe's papers are not listed here.

**Related:** [Wilson score interval](#/glossary/wilson-score-interval), [paired comparison](#/glossary/paired-comparison), [McNemar's exact test](#/glossary/mcnemars-exact-test), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage)


<a id="nexptime-and-conexptime"></a>

## NEXPTIME and coNEXPTIME

Complexity classes far above [NP](#/glossary/np-complete-and-the-polynomial-hierarchy). A yes/no problem is in NEXPTIME when every "yes" answer has a certificate of at most exponential size that can be checked in exponential time; it is in coNEXPTIME when every "no" answer has one (general definition). 2NEXPTIME and 2coNEXPTIME are the same with doubly exponential bounds. Example: [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") states that equivalence of conjunctive queries with safe negation is "coNEXPTIME-complete in general", citing Geck et al. (2016) (§1, PDF p. 1).

**Learn more:** [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 1](https://arxiv.org/pdf/1607.04822#page=1)) §1 (PDF p. 1), which uses the class without defining it (general definition).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [PSPACE](#/glossary/pspace), [data, query and combined complexity](#/glossary/data-query-and-combined-complexity)


<a id="no-free-lunch-theorem"></a>

## No-free-lunch theorem

A family of results saying that no learner is best on every problem: in [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)")'s words, "for every learner there exists a function that cannot be efficiently learned, where efficiency is defined by the number of examples required" (§1). A learner does well only on problems that fit its [inductive bias](#/glossary/inductive-bias). [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") proves such theorems for syntax-guided synthesis with counterexample-guided synthesis (§1, §3).

**Learn more:** [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1 and §3, which cite Shalev-Shwartz and Ben-David (§5.1 of their textbook, not listed here).

**Related:** [overfitting](#/glossary/overfitting), [inductive bias](#/glossary/inductive-bias), [syntax-guided synthesis (SyGuS)](#/glossary/syntax-guided-synthesis-sygus)


<a id="non-transitivity"></a>

## Non-transitivity

A comparison is transitive when A beating B and B beating C imply A beating C; it is non-transitive when such a cycle can occur, as in rock-paper-scissors, so no ranking agrees with every pairwise result (general definition). [RoboPhD](#/papers/borthwick2026robophd "RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution (2026)") describes agents for which "on one sample of databases and questions, Agent A beats B, on another sample B beats C, but on a third sample C beats A", a situation it calls "common when different agents have different strengths and weaknesses", and uses Elo ratings to handle it (§3.2.5, PDF p. 7).

**Learn more:** [RoboPhD](#/papers/borthwick2026robophd "RoboPhD: Self-Improving Text-to-SQL Through Autonomous Agent Evolution (2026)") ([PDF p. 7](https://arxiv.org/pdf/2601.01126#page=7)) §3.2.5 (PDF p. 7); [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") ([PDF p. 26](https://arxiv.org/pdf/2609.25938#page=26)) App. D (PDF p. 26), where an equivalence relation built from pairwise flags is "non-transitive" on some questions and a union-find takes its transitive closure. Neither defines it (general definition).

**Related:** [Elo rating](#/glossary/elo-rating), [paired comparison](#/glossary/paired-comparison), [union-find (disjoint-set structure)](#/glossary/union-find-disjoint-set-structure)


<a id="nondeterministic-finite-automaton-nfa"></a>

## Nondeterministic finite automaton (NFA)

A finite automaton that may have several transitions on the same character from one state, and ε-transitions that move without reading a character, so one input can follow many paths; it accepts the input if any path ends in an accepting state (general definition). Every NFA can be converted into a deterministic one (DFA), with one next state per character, "at the cost of potentially higher state complexity" ([SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.1.1), up to exponentially many states. Regex engines differ in how they handle the choice: a backtracking engine tries paths one after another, which is where [ReDoS](#/glossary/redos-and-catastrophic-backtracking) comes from, while others track all paths at once ([SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.2). [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") builds NFAs from regexes by [Thompson's construction](#/glossary/thompsons-construction) (§2.3, §3.2).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.1.1 and §2.2; [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §2.3 (PDF p. 3).

**Related:** [finite-state machine](#/glossary/finite-state-machine), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [Thompson's construction](#/glossary/thompsons-construction), [infinite ambiguity (of an automaton)](#/glossary/infinite-ambiguity-of-an-automaton)


<a id="nondeterministic-query"></a>

## Nondeterministic query

A query that can legally return different results on the same database, for example top-k with ties (`ORDER BY … LIMIT k` when rows tie on every sort key, so which of the tied rows make the cut is open), or `random`. For such queries, "the two results differ" no longer proves two queries inequivalent, and each use must say which notion of equivalence it means.

**Learn more:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) § What's known (the home of this term: its subsections Sources of nondeterminism and Candidate definitions of equivalence); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF pp. 1–2) on "tie-sensitive top-k" and why one engine run can't show two such queries differ.

**Related:** [list semantics](#/glossary/list-semantics), [spurious counterexample](#/glossary/spurious-counterexample), [query equivalence](#/glossary/query-equivalence)


<a id="nondeterministic-turing-machine"></a>

## Nondeterministic Turing machine

A Turing machine (the standard mathematical model of a computer: a finite control that reads and writes an unbounded tape) that may have several possible next steps; it accepts an input if some sequence of choices leads to acceptance (general definition). [Word Problems Requiring Exponential Time](#/papers/stockmeyer1973word "Word Problems Requiring Exponential Time (Preliminary Report) (1973)") §2 assumes the notion and defines its cost: the time a nondeterministic machine needs to accept an input is the length of the shortest accepting computation (PDF p. 2). Classes such as NP and nondeterministic linear space are the sets such machines accept within those bounds.

**Learn more:** [Word Problems Requiring Exponential Time](#/papers/stockmeyer1973word "Word Problems Requiring Exponential Time (Preliminary Report) (1973)") §2 (PDF p. 2), which defines acceptance time but takes the machine itself as known (general definition).

**Related:** [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), [PSPACE](#/glossary/pspace), [Turing-complete](#/glossary/turing-complete)


<a id="noninferiority-test"></a>

## Noninferiority test

A test that a new version is not worse than the old one by more than a chosen margin δ: it passes when the lower end of the confidence interval for (new − old) lies above −δ (general definition). It is one of the two one-sided tests of an [equivalence test](#/glossary/equivalence-test-tost); a plain test that finds "no significant difference" does not show it. [What Does a Harness…](#/papers/xu2026harnessrepair "What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects (2026)") tests a simpler setting for non-inferiority against a comparator with the rule "holds if the lower bound of θ > −δ" (§3.3); [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") calls its Safe(ε) verdict "a tolerance statement in the spirit of noninferiority testing" (§3).

**Learn more:** [What Does a Harness…](#/papers/xu2026harnessrepair "What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects (2026)") §1 and §3.3; [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §3. Neither defines it (general definition).

**Related:** [equivalence test (TOST)](#/glossary/equivalence-test-tost), [statistical power](#/glossary/statistical-power), [regression testing](#/glossary/regression-testing)


<a id="normal-forms-1nf-2nf-3nf-bcnf"></a>

## Normal forms (1NF, 2NF, 3NF, BCNF)

Successively stricter conditions on a table's design, each ruling out one kind of redundancy, stated through [functional dependencies](#/glossary/functional-dependency) and keys. A table violates 1NF if a cell holds several values; 2NF if a non-key column depends on only part of a composite key; 3NF if a non-key column depends on the key only through another non-key column (a transitive dependency); BCNF (Boyce–Codd normal form) if the determining columns of any non-trivial dependency are not a [superkey](#/glossary/superkey-and-candidate-key) (general definition for "non-trivial"). [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") states these rules in its prompts (App. J.1, J.4) and lists the violation patterns "multivalued cells violating 1NF, partial dependencies violating 2NF, transitive dependencies violating 3NF, and non-superkey determinants violating BCNF" (§3.1).

**Learn more:** [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") ([PDF p. 26](https://arxiv.org/pdf/2609.11141#page=26)) (unchecked) §3.1 ("Stage 2"), App. J.1 (Prompt 1, PDF p. 26) and App.

**Related:** [normalized schema](#/glossary/normalized-schema), [functional dependency](#/glossary/functional-dependency), [superkey and candidate key](#/glossary/superkey-and-candidate-key), [lossless-join decomposition](#/glossary/lossless-join-decomposition)


<a id="normalized-discounted-cumulative-gain-ndcg"></a>

## Normalized discounted cumulative gain (NDCG)

A score for a ranked list that rewards putting relevant items near the top. Each item in the top n contributes its relevance gain divided by a discount that grows with its position, and the sum (DCG@n) is divided by the sum the best possible order would get (IDCG@n), so a perfect ranking scores 1. [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") uses DCG@n = Σᵢ (2^relᵢ − 1) / log₂(i + 1) over the top n positions, with relevance 1 for a rule that reduces execution time and 0 otherwise (§V-A3).

**Learn more:** [SLER](#/papers/zhang2026sler "Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank (2026)") ([PDF p. 11](https://arxiv.org/pdf/2603.04169#page=11)) §V-A3 (PDF p. 11), which gives the formula.

**Related:** [learning to rank](#/glossary/learning-to-rank)


<a id="normalized-gain"></a>

## Normalized gain

How much of the possible improvement a change achieves: (score after − score before) / (maximum score − score before). Going from 40% to 70% pass rate closes 30 of the 60 points left, a normalized gain of 50%. It lets gains be compared between systems that start at different levels.

**Learn more:** [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)") §4, which uses it for the gain from skills (citing Hake 1998, not listed here).


<a id="normalized-schema"></a>

## Normalized schema

A schema designed so that each fact is stored in one place, with tables split along [functional dependencies](#/glossary/functional-dependency) and linked by keys, so that updates can't leave contradictory copies. In an unnormalized schema the same fact can be stored twice and the copies can disagree, so two reasonable queries that read different copies return different results: [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §5.2 reports schemas that are not normalized in "all BIRD databases and some of the Spider databases", where one question can be answered by joining two different sets of tables with different results on the shipped data.

**Learn more:** [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") §5.2, which uses the term without defining it (general definition).

**Related:** [functional dependency](#/glossary/functional-dependency), [integrity constraint](#/glossary/integrity-constraint), [many-to-many relationship](#/glossary/many-to-many-relationship), [gold query](#/glossary/gold-query)


<a id="novelty-search"></a>

## Novelty search

Search that rewards finding solutions or behaviours unlike those found before, instead of progress toward a fixed objective, which can lead into dead ends (general definition). [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)") says its automatic curriculum, built around the goal of "discovering as many diverse things as possible", "can be perceived as an in-context form of novelty search" (§1).

**Learn more:** [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)") §1, which cites novelty-search work not listed here (general definition).

**Related:** [open-endedness](#/glossary/open-endedness), [evolutionary search](#/glossary/evolutionary-search), [exploration and exploitation](#/glossary/exploration-and-exploitation), [island model](#/glossary/island-model)


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

<a id="occlusion-attribution"></a>

## Occlusion attribution

Estimating how much a part of an input contributes to a model's output by masking (occluding) that part and measuring how much the output, or its loss, changes (general definition). Example: [Learning from Prompt itself](#/papers/chen2026attribution "Learning from Prompt itself: the Hierarchical Attribution Prompt Optimization (2026)") scores each unit of a prompt "by counterfactual occlusion": it masks the unit and averages the change in loss over the training examples the prompt got wrong (§ "Dynamic Attribution Mechanism", Eq. 4); an open erratum notes that with the 0–1 loss the paper gives as an example, this score can never be positive.

**Learn more:** [Learning from Prompt itself](#/papers/chen2026attribution "Learning from Prompt itself: the Hierarchical Attribution Prompt Optimization (2026)") ([PDF p. 3](https://arxiv.org/pdf/2601.02683#page=3)) § "Dynamic Attribution Mechanism", Eq. 4 (PDF p. 3), which uses the term without defining it (general definition).

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="odds-ratio"></a>

## Odds ratio

A comparison of two success rates θ_A and θ_B through their odds: OR = [θ_A / (1 − θ_A)] / [θ_B / (1 − θ_B)]; 1 means no difference ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.3).

**Learn more:** [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") §3.3.

**Related:** [Fisher's exact test](#/glossary/fishers-exact-test), [delta method](#/glossary/delta-method)


<a id="off-policy-evaluation"></a>

## Off-policy evaluation

Estimating how well a policy would do from data logged while a different policy was acting, without running the new policy; the estimate must correct for the mismatch between the two policies (general definition). [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") §2 describes it as estimating "a policy's value from logged trajectories, often with importance weighting or doubly robust estimators" (citing Jiang and Li 2016, not listed here), and says its own replay audit has a different estimand.

**Learn more:** [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") §2.

**Related:** [off-policy learning](#/glossary/off-policy-learning), [importance sampling and importance weighting](#/glossary/importance-sampling-and-importance-weighting), [online and offline RL](#/glossary/online-and-offline-rl)


<a id="off-policy-learning"></a>

## Off-policy learning

In RL, learning from experience generated by a different policy (the behaviour policy, often an older version of the model) than the one being improved; on-policy learning uses only fresh samples from the current policy (general definition). Off-policy updates are usually reweighted, for instance by the [importance ratio](#/glossary/importance-ratio-and-clipping), to correct for the mismatch. It is not the same as [offline RL](#/glossary/online-and-offline-rl), which learns from a fixed dataset, though offline RL is off-policy.

Examples: [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") makes GRPO training "deliberately off-policy" by using each batch of samples for 32 consecutive optimizer steps, so that by the end "the data is 32 policy updates stale", and compares ways of correcting for it (§5). [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)") says its agent "uses off-policy learning", gathering experience with one policy and improving another (App. A.4).

**Learn more:** [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") §5; [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)") App. A.4, citing Watkins and Dayan (1992), not listed here. Neither defines it (general definition).

**Related:** [online and offline RL](#/glossary/online-and-offline-rl), [importance ratio and clipping](#/glossary/importance-ratio-and-clipping), [importance sampling and importance weighting](#/glossary/importance-sampling-and-importance-weighting), [experience replay](#/glossary/experience-replay), [PPO](#/glossary/ppo), [off-policy evaluation](#/glossary/off-policy-evaluation)


<a id="olap-and-oltp"></a>

## OLAP and OLTP

Two kinds of database workload. OLTP (online transaction processing) runs many short queries and updates that each touch a few rows, such as placing an order; OLAP (online analytical processing) runs fewer, complex, read-mostly queries over large data, such as sales by region and quarter. SQLGovernor's authors write that "OLTP queries are simple and execute within milliseconds", while OLAP queries run on large data volumes, "often ranging from seconds to minutes" ([SQLGovernor (Tencent)](#/papers/jiang2025sqlgovernor "SQLGovernor: An LLM-powered SQL Toolkit for Real World Application (2025)") §1). Benchmarks are labelled by kind: [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §6.1 calls TPC-H and JOB OLAP benchmarks and XuetangX an OLTP one.

**Learn more:** [SQLGovernor (Tencent)](#/papers/jiang2025sqlgovernor "SQLGovernor: An LLM-powered SQL Toolkit for Real World Application (2025)") §1; [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)") §6.1 (PDF p. 9). Neither defines the terms (general definition).

**Related:** [query optimizer](#/glossary/query-optimizer), [materialized view](#/glossary/materialized-view)


<a id="online-and-offline-rl"></a>

## Online and offline RL

In online RL the model being trained keeps generating new outputs, which are scored and learned from as training goes on; in offline RL it learns from a fixed set of outputs collected and scored beforehand. [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") §5.1 calls [PPO](#/glossary/ppo) "online reinforcement learning" and [DPO](#/glossary/direct-preference-optimization-dpo) "offline preference tuning"; [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") calls [GRPO](#/glossary/grpo) "an online policy gradient method" (§2). [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") first warms up its model with an offline RL method (TAO) and then performs "online RL with verifiable rewards (RLVR)" (§3).

**Learn more:** [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 21](https://arxiv.org/pdf/2411.15124#page=21)) §5.1.2 (PDF p. 21) and §8.2 (PDF p. 48), which calls standard DPO's preference data "collected ahead of time, often from a distinct language model, and are thus considered as offline", in contrast to "online methods like PPO where the RM provides online feedback to generations from the policy"; [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)") §2 and §5.2; [A State-of-the-Art SQL Reasoning…](#/papers/ali2025sqlrlvr "A State-of-the-Art SQL Reasoning Model using RLVR (2025)") §3.

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [policy gradient](#/glossary/policy-gradient), [rejection sampling](#/glossary/rejection-sampling), [expert iteration](#/glossary/expert-iteration), [off-policy learning](#/glossary/off-policy-learning)


<a id="online-judge"></a>

## Online judge

A platform that hosts programming problems and automatically judges submitted solutions by running them on a predefined test suite for each problem: "Online Judge (OJ) systems are designed for providing coding tasks and then evaluating the solutions submitted by users" ([Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)") §1, PDF p. 1). A solution the tests accept may still be wrong. Some judges let users "hack" an accepted solution with an input that makes it fail; UOJ's hacks are "fully verifiable" because every hackable problem has a correct reference solution and an input validator ([UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") §3.1). A problem with several correct outputs needs a special judge, a checker program in place of an exact comparison with the expected output (general definition).

**Learn more:** [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)") §1 (PDF p. 1); [UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") §3.1.

**Related:** [test oracle](#/glossary/test-oracle), [line and statement coverage](#/glossary/line-and-statement-coverage), [plausible patch](#/glossary/plausible-patch), [Pass@k](#/glossary/passk)


<a id="online-learning"></a>

## Online learning

Learning from data that arrive one at a time, updating the model, or what it keeps in memory, after each item, instead of training once on a fixed dataset beforehand (general definition). [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)") §2.1.1 calls its setting, a sequence of queries from one unknown distribution answered in order with a memory updated between them, "a typical setting in online learning", and App. A.1 says test-time learning is "also referred to as online or incremental learning (adaptation)". Not the same as [online RL](#/glossary/online-and-offline-rl), where "online" means the model is trained on outputs it keeps generating.

**Learn more:** [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)") ([PDF p. 3](https://arxiv.org/pdf/2504.07952#page=3)) §2.1.1 (PDF p. 3) and App. A.1 (PDF p. 14), which use the term without defining it (general definition).

**Related:** [test-time training](#/glossary/test-time-training), [online and offline RL](#/glossary/online-and-offline-rl)


<a id="open-coding"></a>

## Open coding

A qualitative research method for building categories from the data instead of fixing them in advance: read the cases one by one, label each with short descriptive codes, and group similar codes into categories as they emerge (general definition). DLBench sorts the errors in 300 randomly sampled SQL translations this way into four main categories, from E1 (syntax errors) on ([DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §VI-C).

**Learn more:** [DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)") §VI-C (PDF p. 9), which cites Khandkar (not listed here) without describing the method (general definition).

**Related:** [Cohen's kappa](#/glossary/cohens-kappa)


<a id="open-endedness"></a>

## Open-endedness

A system's ability to keep producing new and interesting artifacts without end, instead of converging on one solution. [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") cites Hughes et al. (2024), not listed here, who "characterized open-endedness as a system's capacity to generate sequences of artifacts that are both novel and learnable from an observer's perspective" (§2). Open-ended search keeps an archive of stepping stones, "interesting yet suboptimal solutions or features that may enable future breakthroughs" (§1).

**Learn more:** [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") §1 and §2; [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)") §1, an open-ended agent in Minecraft.

**Related:** [novelty search](#/glossary/novelty-search), [Gödel machine](#/glossary/gödel-machine), [evolutionary search](#/glossary/evolutionary-search), [island model](#/glossary/island-model)


<a id="optimal-computing-budget-allocation-ocba"></a>

## Optimal computing budget allocation (OCBA)

A method from simulation optimization for dividing a limited number of noisy evaluations among candidates so as to maximize the Probability of Correct Selection, the chance that the candidate with the best measured mean is truly the best (general definition). Under independent normal scores, its asymptotic conditions give more of the budget to candidates whose mean is close to the current best's and whose variance is high ([RuleEvolve](#/papers/jiang2026ruleevolve "Self-Evolving Coding Rules for AI Coding Agents (2026)") App. B, Eqs. 8–10).

**Learn more:** [RuleEvolve](#/papers/jiang2026ruleevolve "Self-Evolving Coding Rules for AI Coding Agents (2026)") ([PDF p. 13](https://arxiv.org/pdf/2610.00650#page=13)) App. B (PDF p. 13), which restates OCBA's goal and allocation conditions, citing Chen and Lee (2011), not listed here.

**Related:** [best arm identification](#/glossary/best-arm-identification), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


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


<a id="options-framework"></a>

## Options framework

A way to represent skills in RL: an option is a temporally extended action, "a triple ⟨I, π, β⟩ of an initiation set I ⊆ S, a policy π, and a termination condition β" ([Dynamic Agent Skills](#/papers/li2026dynamicskills "Dynamic Agent Skills: A Lifecycle Survey and Taxonomy of Evolving Skill Libraries (2026)") §3.2): the states where it can start, how it acts, and when it stops. An agent can choose among options as it chooses among single actions.

**Learn more:** [Dynamic Agent Skills](#/papers/li2026dynamicskills "Dynamic Agent Skills: A Lifecycle Survey and Taxonomy of Evolving Skill Libraries (2026)") §3.2, after Sutton et al. (1999), not listed here.

**Related:** [agent skill](#/glossary/agent-skill), [Markov decision process](#/glossary/markov-decision-process), [reinforcement learning](#/glossary/reinforcement-learning)


<a id="out-of-distribution-generalization"></a>

## Out-of-distribution generalization

How well a model does on inputs that come from a different source or distribution than its training data, as opposed to held-out examples of the same kind. [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") tests its reward models on 224 questions from recent AP and AMC exams, released after its pre-training data was compiled (§5).

**Learn more:** [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") §5, which uses the term without defining it (general definition).

**Related:** [data contamination](#/glossary/data-contamination)


<a id="outcome-and-process-rewards"></a>

## Outcome and process rewards

An outcome reward scores only the final result of a model's answer (is the final answer right?); a process reward scores the steps that led to it, for example whether each reasoning step is correct. Outcome rewards are cheap when answers can be checked automatically, but they can't tell sound reasoning from a flawed path that happens to reach the right answer; process rewards need step-level labels, from people or from rules. A reward model trained on such labels is an outcome-supervised (ORM) or process-supervised (PRM) reward model.

Example: ReViSQL's authors argue that a query that ignored the question's evidence but "coincidentally returns the correct result" and one that used the evidence correctly "are indistinguishable to an outcome reward" ([ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") §4.1). Their process reward is a rule, not a judgment of each step: it subtracts penalties when the reasoning lacks the required blocks that translate and check each evidence entry (§4.2).

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 1](https://arxiv.org/pdf/2211.14275#page=1)) §1 (PDF p. 1), which compares the two kinds of supervision on math word problems; [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") ([PDF p. 2](https://arxiv.org/pdf/2305.20050#page=2)) §1 (PDF p. 2) for ORMs and PRMs, and §2 (PDF p. 3), on why outcome labels can be automated and process labels needed human labellers; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 57](https://arxiv.org/pdf/2501.12948#page=57)) Supp. 7.2 (SI PDF p. 57), on why DeepSeek-R1 did not use a PRM (steps are hard to define, and a model-based PRM "inevitably leads to reward hacking").

**Related:** [reinforcement learning](#/glossary/reinforcement-learning), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [reward shaping](#/glossary/reward-shaping), [reward hacking](#/glossary/reward-hacking), [best-of-N sampling](#/glossary/best-of-n-sampling), [beam search](#/glossary/beam-search)


<a id="outer-join"></a>

## Outer join

A join that also keeps the rows that find no match, filling the other side's columns with NULL. A left outer join keeps every row of the left table, a right outer join every row of the right, and a full outer join both (general definition; the cited paper doesn't name the three kinds). Ganski and Wong use it to fix the COUNT bug of an unnesting rewrite, whose ordinary join dropped groups with no matching rows, whose count should be 0 ([Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.2, PDF p. 4).

**Learn more:** [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)") §5.2 (PDF p. 4), which takes the definition from Codd: the outer join includes all values from the columns participating in the join, with NULLs in the opposite column where a value has no match. Codd's paper is not listed here.

**Related:** [NULL-rejecting](#/glossary/null-rejecting), [correlated subquery](#/glossary/correlated-subquery), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin), [join algorithms (nested-loop, hash and merge join)](#/glossary/join-algorithms-nested-loop-hash-and-merge-join), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="output-and-input-prediction"></a>

## Output and input prediction

Two tasks about a given program: predict its output for a given input, or find an input that produces a given output. Running the program checks both answers: the output against the actual one, an input by running it and comparing the result (several inputs may be right). [CodeI/O](#/papers/li2025codeio "CodeI/O: Condensing Reasoning Patterns via Code Input-Output Prediction (2025)") trains on them "given a function along with its corresponding textual query", with answers in natural language (§1), and keys each instance by executing the code (§2); [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") evaluates and trains on the same pair (§5, App. H).

**Learn more:** [CodeI/O](#/papers/li2025codeio "CodeI/O: Condensing Reasoning Patterns via Code Input-Output Prediction (2025)") §1–§2; [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") §5, App. H.

**Related:** [execution trace](#/glossary/execution-trace), [test oracle](#/glossary/test-oracle)


<a id="over-approximation-and-under-approximation"></a>

## Over-approximation and under-approximation

An over-approximation of what a program can do includes everything it can really do, and possibly more; an under-approximation includes only things it can really do, but possibly not all of them. Reasoning over an over-approximation can prove properties, but may report counterexamples that can't happen; reasoning over an under-approximation finds only real counterexamples, but may miss some.

Example: modelling aggregates such as `SUM` as [uninterpreted functions](#/glossary/uninterpreted-function) over-approximates them and "can admit spurious counterexamples that cannot arise under concrete SQL semantics" ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1, PDF p. 1). Polygon instead searches under-approximations, each covering a subset of the outputs a query can really produce ([Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") §1, PDF p. 2).

**Learn more:** [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 1](https://arxiv.org/pdf/2608.15709#page=1)) §1 (PDF p. 1); [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)") ([PDF p. 2](https://arxiv.org/pdf/2504.06542#page=2)) §1 (PDF p. 2).

**Related:** [spurious counterexample](#/glossary/spurious-counterexample), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="overfitting"></a>

## Overfitting

A learned function fitting the examples it was given but not the cases beyond them. [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1: "Overfitting occurs when a learned function explains a given set of observations but does not generalize correctly beyond it"; it shows that program synthesis overfits too: with a more expressive grammar, more wrong programs fit the examples. A benchmark can be overfit the same way, by tuning a method to its test items.

**Learn more:** [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1.

**Related:** [no-free-lunch theorem](#/glossary/no-free-lunch-theorem), [ensemble methods](#/glossary/ensemble-methods), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [data contamination](#/glossary/data-contamination), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


<a id="overload-resolution"></a>

## Overload resolution

Choosing which version of an overloaded operator or function a call runs, from the types of its arguments: integer `+`, real `+`, or, in some engines, `+` on strings (general definition). [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") models it as an engine-dependent operator `resolve` that "determines which specific operation among a set of overloaded ones should be called based on the provided arguments during invocation" (§3.2). Engines resolve differently, which changes results. For `SELECT '1' + '1' FROM R` the paper reports that PostgreSQL gives a static error, MSSQL returns '11' "as addition is overloaded for string", and the other engines return 2, casting the strings to numbers (§2.1, E5).

**Learn more:** [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") §3.2 (PDF p. 8) and §2.1 (PDF p. 5).

**Related:** [SQL dialect](#/glossary/sql-dialect), [formal semantics](#/glossary/formal-semantics)


<a id="letter-p"></a>

<a id="p-value"></a>

## p-value

The probability, assuming the null hypothesis (no effect, no difference, no correlation) is true, of a result at least as extreme as the one observed. A small p-value says the data would be surprising if there were no effect; it is not the probability that the null hypothesis is true, and it says nothing about the effect's size (general definition). [Understanding LLM Performance Degradation…](#/papers/chen2026multiinstance "Understanding LLM Performance Degradation in Multi-Instance Processing: The Roles of Instance Count and Context Length (2026)") §6.2 reports p-values "below 0.001, indicating that the correlations are highly unlikely to arise by chance".

**Learn more:** [Understanding LLM Performance Degradation…](#/papers/chen2026multiinstance "Understanding LLM Performance Degradation in Multi-Instance Processing: The Roles of Instance Count and Context Length (2026)") §6.2 and Tab. 4, which use it without defining it (general definition); the [binomial test](#/glossary/binomial-test) entry shows one computed.

**Related:** [binomial test](#/glossary/binomial-test), [statistical power](#/glossary/statistical-power), [multiple testing](#/glossary/multiple-testing), [permutation test](#/glossary/permutation-test), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage)


<a id="pac-bayes"></a>

## PAC-Bayes

Generalization bounds for a learned distribution over hypotheses (the posterior) whose cost term is the posterior's divergence from a prior chosen before seeing the data, instead of the number of hypotheses; for a single hypothesis from a countable set the cost is minus the log of its prior probability, so hypotheses the prior finds likely get tighter bounds (general definition). [What Fits (Into Few Tokens) Doesn't Overfit](#/papers/bertran2026compression "What Fits (Into Few Tokens) Doesn't Overfit: Compression and Generalization in ML Research Agents (2026)") notes that a "sharper PAC-Bayes analysis" could replace its count-based term, which gives every B-token prompt equal weight, with the negative log-probability of the prompt "under an appropriate language-model prior over messages" (§3.1), and cites Akinwande et al. (2024), who use "a language model as the prior over discrete prompts to obtain non-vacuous generalization bounds" (App. A).

**Learn more:** [What Fits (Into Few Tokens) Doesn't Overfit](#/papers/bertran2026compression "What Fits (Into Few Tokens) Doesn't Overfit: Compression and Generalization in ML Research Agents (2026)") §3.1 and App. A, which use it without a general definition (general definition). Akinwande et al. (2024) is not listed here.

**Related:** [union bound](#/glossary/union-bound), [concentration inequality](#/glossary/concentration-inequality), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl), [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior)


<a id="paired-comparison"></a>

## Paired comparison

Comparing two systems on the same test items by analysing the per-item differences, instead of comparing their two averages. Items differ greatly in difficulty and similar systems tend to get the same items right, so the differences vary much less than the scores, and a paired test detects a smaller real difference with the same items (general definition). [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") reports that "a greatly reduced noise is possible only if paired comparison is used" (§1) and measures paired variances for all pairs of models (§1, §4.1).

**Learn more:** [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §1 and §4.1.

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [sign test](#/glossary/sign-test), [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [Student's t-test and t-interval](#/glossary/students-t-test-and-t-interval), [permutation test](#/glossary/permutation-test), [bootstrap resampling](#/glossary/bootstrap-resampling), [law of total variance](#/glossary/law-of-total-variance)


<a id="parallel-scan-prefix-sum"></a>

## Parallel scan (prefix sum)

Combining a sequence of items step by step with an associative operation (such as addition, giving running totals) in a tree of parallel rounds, so that the chain of dependent steps grows with the logarithm of the length instead of the length itself. [Combee](#/papers/li2026combee "Combee: Scaling Parallel Prompt Learning for Self-Improving LLM Agents (2026)") calls it "the classical technique for combining a sequence under an associative operator with logarithmic rather than linear dependency depth" and treats merging agents' reflections as the combining operation (§3.1).

**Learn more:** [Combee](#/papers/li2026combee "Combee: Scaling Parallel Prompt Learning for Self-Improving LLM Agents (2026)") §3.1, citing Blelloch (1990), not listed here.


<a id="parametric-and-non-parametric-learning"></a>

## Parametric and non-parametric learning

Two ways a language model can improve from experience: parametric methods change its weights (fine-tuning, RL); non-parametric methods keep it frozen and change what it is given to read, such as its prompt, retrieved memories or skill files. [CORE (Contrastive Reflection)](#/papers/nasvytis2026core "CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning (2026)") §2: "Parametric methods update model weights … Non-parametric methods keep the model frozen and instead improve its context". Not to be confused with parametric and non-parametric models and tests in statistics, where the words mean a fixed or a data-dependent number of parameters, or an assumed or no assumed distribution (general definition).

Examples: Dynamic Cheatsheet keeps "an external, non-parametric memory" instead of fine-tuning the weights ([Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)") §2); [SkillLearnBench](#/papers/zhong2026skilllearnbench "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks (2026)") calls skill generation "a non-parametric approach to continual learning" (§3.3).

**Learn more:** [CORE (Contrastive Reflection)](#/papers/nasvytis2026core "CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning (2026)") ([PDF p. 3](https://arxiv.org/pdf/2605.28742#page=3)) §2 (PDF p. 3); [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)") ([PDF p. 3](https://arxiv.org/pdf/2504.07952#page=3)) §2 (PDF p. 3); [SkillLearnBench](#/papers/zhong2026skilllearnbench "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks (2026)") ([PDF p. 5](https://arxiv.org/pdf/2604.20087#page=5)) §3.3 (PDF p. 5).

**Related:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [continual learning](#/glossary/continual-learning), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [agent skill](#/glossary/agent-skill), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)


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


<a id="partial-identification-sharp-identified-set"></a>

## Partial identification (sharp identified set)

When the data can't pin a quantity down to one value, even with unlimited data, partial identification reports the set of all values consistent with what is observed (the identified set) instead of a point; the set is sharp when every value in it could actually have produced the data, so it can't be narrowed without new assumptions (general definition). [Better Policies, Worse Verifier Audits](#/papers/cieslak2026audits "Better Policies, Worse Verifier Audits (2026)") derives "a sharp identified set" for a checker's quality on one kind of failure from the on-policy audit data (abstract; §4, Prop. 1), and its proof shows "every point in the set is attainable" (App. P).

**Learn more:** [Better Policies, Worse Verifier Audits](#/papers/cieslak2026audits "Better Policies, Worse Verifier Audits (2026)") §4 (Prop. 1) and App. P.

**Related:** [identifiability](#/glossary/identifiability), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage)


<a id="partially-observable-markov-game"></a>

## Partially observable Markov game

The multi-player version of a [Markov decision process](#/glossary/markov-decision-process): several players act on a shared state, the next state depends on their actions, and each player sees only an observation of the state, not the state itself (general definition). [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") §2 formalizes its LLM games as "a two-player, turn-based, zero-sum, partially observable Markov game (S, A, O, P, Ω, ρ)", with states, actions ("each action is a complete model response"), observations, transitions, a map from states to "partial observations", and an outcome of win, draw or loss at the end; zero-sum means one player's win is the other's loss (PDF p. 3).

**Learn more:** [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") ([PDF p. 3](https://arxiv.org/pdf/2603.09022#page=3)) §2 (PDF p. 3), which gives its own two-player instance, not the general definition (general definition).

**Related:** [POMDP (partially observable Markov decision process)](#/glossary/pomdp-partially-observable-markov-decision-process), [Markov decision process](#/glossary/markov-decision-process), [self-play](#/glossary/self-play)


<a id="passk"></a>

## Pass@k

The chance that at least one of k sampled answers to a problem is correct, averaged over problems; a "pass" means passing the unit tests for code, or the verifier or proof checker for verified code and proofs. It is usually estimated by drawing n ≥ k samples per problem, counting the c correct ones, and computing 1 − C(n−c, k) / C(n, k), where C is the binomial coefficient. It credits a problem if any sample is right, so it presumes a way to recognize the right sample; without a checker, choosing among samples is a separate and harder problem.

Example: Brown et al. report that on MATH with Llama-3-8B-Instruct, coverage (their name for pass@k) rose from 82.9% at 100 samples to 98.44% at 10,000, while the biggest gain from choosing an answer by majority vote or a reward model was "only from 40.50% to 41.41%" over the same range ([Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") §1).

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 5](https://arxiv.org/pdf/2512.18160#page=5)) §4 (PDF p. 5), for the estimator; [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") ([PDF p. 4](https://arxiv.org/pdf/2407.21787#page=4)) §2 (PDF p. 4), Eq. 1, which calls it coverage. Chen et al. (2021), which both cite for the metric, is not listed here.

**Related:** [self-consistency](#/glossary/self-consistency-majority-voting), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="passk-reliability-over-k-trials"></a>

## Pass^k (reliability over k trials)

The share of tasks on which all k independent trials succeed: a reliability measure. It falls as k grows unless the agent succeeds every time, unlike [pass@k](#/glossary/passk), where one success in k is enough.

**Learn more:** [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") ([PDF p. 10](https://arxiv.org/pdf/2607.09175#page=10)) §5.1 (PDF p. 10), which contrasts pass@k's "best-of-k criterion" with pass^k's "trial-level reliability under an all-k" criterion and reports pass^3; the metric comes from τ-bench ([τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")).

**Related:** [pass@k](#/glossary/passk)


<a id="passive-automata-learning"></a>

## Passive automata learning

Inferring an automaton (usually a DFA) from a fixed set of labelled examples, without asking any questions. [Can Agents Infer Environment…](#/papers/menaged2026automata "Can Agents Infer Environment from Interaction? Evidence from Agentic Automata Learning (2026)") §2.2: "the learner does not query an oracle. Instead, it receives a fixed labeled sample of accepted and rejected words and must infer a DFA consistent with that sample"; it names RPNI, EDSM and Blue-Fringe as classic algorithms (citing Oncina and García 1992 and Lang et al. 1998, not listed here). Active learning asks questions instead ([query learning](#/glossary/query-learning-membership-and-equivalence-queries)).

**Learn more:** [Can Agents Infer Environment…](#/papers/menaged2026automata "Can Agents Infer Environment from Interaction? Evidence from Agentic Automata Learning (2026)") §2.2 and §5.1.

**Related:** [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [inductive logic programming (ILP)](#/glossary/inductive-logic-programming-ilp)


<a id="pearson-correlation"></a>

## Pearson correlation

A number from −1 to +1 for how closely two lists of paired values follow a straight line: +1 means one rises exactly linearly with the other, −1 that it falls exactly linearly, 0 that there is no linear relation. [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) is Pearson's computed on ranks. Round-trip correctness reports both against existing benchmark scores ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.1).

**Learn more:** [Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)") §4.1, which uses it without defining it (general definition).

**Related:** [Spearman's rank correlation](#/glossary/spearmans-rank-correlation), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="perfect--and-imperfect-information-games"></a>

## Perfect- and imperfect-information games

In a perfect-information game every player sees the whole state of play (chess, Go); in an imperfect-information game some of it is hidden from some players (other players' cards in poker) (general definition). [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") §4.1 groups its games this way: imperfect-information games "require reasoning under uncertainty and partial observability", perfect-information games "emphasize planning and long-horizon decision-making with full state visibility" (PDF p. 6).

**Learn more:** [MEMO](#/papers/xie2026memo "MEMO: Memory-Augmented Model Context Optimization for Robust Multi-Turn Multi-Agent LLM Games (2026)") ([PDF p. 6](https://arxiv.org/pdf/2603.09022#page=6)) §4.1 (PDF p. 6).

**Related:** [partially observable Markov game](#/glossary/partially-observable-markov-game), [self-play](#/glossary/self-play)


<a id="permutation-test"></a>

## Permutation test

A test that compares an observed statistic with its values after randomly reshuffling labels that, if the null hypothesis is true, don't matter; the p-value is the share of reshuffles that give a value at least as extreme as the observed one (general definition). The paired sign-flip version flips the sign of each item's difference at random: if the two systems are equally good, each difference is as likely to be negative as positive (this assumes the differences are symmetric). With few items all 2ⁿ sign patterns can be enumerated, giving an exact p-value.

Example: [FIRE](#/papers/agarwal2026fire "FIRE: Failure-Informed Runtime Engineering for Reliable Language-Model Agents (2026)") uses "two-sided paired sign-flip permutation tests over tasks", with exact sign-flip p-values for small screens (§4, §5.3, App. B); [Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)") reports that its per-skill permutation tests lack power at its number of random masks (App. K.1).

**Learn more:** [FIRE](#/papers/agarwal2026fire "FIRE: Failure-Informed Runtime Engineering for Reliable Language-Model Agents (2026)") §4 and App. B; [Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)") App. K.1. Neither defines it (general definition).

**Related:** [sign test](#/glossary/sign-test), [paired comparison](#/glossary/paired-comparison), [bootstrap resampling](#/glossary/bootstrap-resampling), [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [statistical power](#/glossary/statistical-power)


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


<a id="phase-transition"></a>

## Phase transition

A sudden, qualitative change in a system's behaviour as one parameter crosses a critical value, named after physical changes of state such as water freezing (general definition).

Example: [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") asks whether RL training with a noisy checker has "a critical threshold beyond which learning abruptly fails or reverses direction, analogous to a phase transition in physical systems" (§1), and finds "a sharp phase transition at the critical boundary TPR = FPR", where its [Youden's index](#/glossary/youdens-index) J is zero (§3); a KL penalty turns it into a smooth interior equilibrium (§6.1).

**Learn more:** [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") ([PDF p. 4](https://arxiv.org/pdf/2601.04411#page=4)) (unchecked) §1 (PDF p. 4), §3 (PDF p. 7) and §6.1 (PDF p. 16), which use it without defining it (general definition).

**Related:** [Youden's index](#/glossary/youdens-index)


<a id="placebo-control"></a>

## Placebo control

In an experiment, a comparison arm that keeps everything about the intervention except the one ingredient under test, so that the difference between the two arms measures that ingredient alone (general definition; the term comes from drug trials, where the placebo is an inactive pill). [Auditing and Decomposing Feedback-Driven…](#/papers/liang2026testgen "Auditing and Decomposing Feedback-Driven Evolution in LLM Test Generation under the Oracle Problem (2026)") uses a "density-matched placebo" arm for this purpose (§1, §2.4, §3.3).

**Learn more:** [Auditing and Decomposing Feedback-Driven…](#/papers/liang2026testgen "Auditing and Decomposing Feedback-Driven Evolution in LLM Test Generation under the Oracle Problem (2026)") §1, §2.4 and §3.3, which use it without defining the general term (general definition).

**Related:** [confounder](#/glossary/confounder), [average treatment effect (ATE)](#/glossary/average-treatment-effect-ate), [compute-matched comparison](#/glossary/compute-matched-comparison)


<a id="plausible-patch"></a>

## Plausible patch

A patch, or program, that passes all the tests of a given suite but may still be wrong, because the tests miss its bug. [TrickCatcher](#/papers/liu2024trickcatcher "LLM-Powered Test Case Generation for Detecting Bugs in Plausible Programs (2025)") calls such programs plausible programs, "those that pass existing test suites yet still contain bugs" (abstract); [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") shows a patch by a top SWE-Bench agent that "is plausible but incorrect", passing the original tests while violating the actual requirement (§1).

**Learn more:** [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") §1; [TrickCatcher](#/papers/liu2024trickcatcher "LLM-Powered Test Case Generation for Detecting Bugs in Plausible Programs (2025)") abstract.

**Related:** [gold patch](#/glossary/gold-patch), [automated program repair](#/glossary/automated-program-repair), [test oracle](#/glossary/test-oracle), [mutation testing](#/glossary/mutation-testing), [resolve rate](#/glossary/resolve-rate)


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


<a id="polynomial-delay"></a>

## Polynomial delay

An enumeration algorithm (one that lists all answers to a problem one by one) runs with polynomial delay when the time before the first answer, between consecutive answers and after the last is polynomial in the input size, however many answers there are (general definition). [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") Thm. 4.21 (§4.4, PDF p. 13): the feedback queries that decide containment "can be generated with polynomial delay in the sizes of q and q′", using a cited enumeration of minimal feedback vertex sets with polynomial delay.

**Learn more:** [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") ([PDF p. 13](https://arxiv.org/pdf/2609.16218#page=13)) Thm. 4.21 (§4.4, PDF p. 13), which uses the term without defining it (general definition).

**Related:** [query containment](#/glossary/query-containment), [fixed-parameter tractable](#/glossary/fixed-parameter-tractable)


<a id="pomdp-partially-observable-markov-decision-process"></a>

## POMDP (partially observable Markov decision process)

A [Markov decision process](#/glossary/markov-decision-process) in which the agent does not see the state itself, only observations that depend on it, so it must act on the history of what it has observed (general definition). [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)") formulates each τ-bench task as a POMDP (S, A, O, T, R, U), with state, action and observation spaces, a transition function, a reward function and an instruction space (§3).

**Learn more:** [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)") §3 (general definition).

**Related:** [Markov decision process](#/glossary/markov-decision-process), [reinforcement learning](#/glossary/reinforcement-learning), [Pass^k (reliability over k trials)](#/glossary/passk-reliability-over-k-trials)


<a id="population-based-training"></a>

## Population-based training

Training several copies of a learner in parallel and, at intervals, replacing the worst performers with copies of the best, so that effort moves to the most promising runs. In its original form (Jaderberg et al. 2017, not listed here) the copies are neural networks trained with different hyperparameters, and a replaced copy takes over a better one's weights and then perturbs its hyperparameters (general definition). [Self-Generated In-Context Examples Improve…](#/papers/sarukkai2025selfgenerated "Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks (2025)") applies the idea to databases of agent trajectories: it keeps a population of 5 databases and, following what it calls "standard population-based training practices", replaces "the bottom 20% of databases (based on validation performance)" with "copies of the top 20%" (App. B.3).

**Learn more:** [Self-Generated In-Context Examples Improve…](#/papers/sarukkai2025selfgenerated "Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks (2025)") ([PDF p. 5](https://arxiv.org/pdf/2505.00234#page=5)) §5.2 (PDF p. 5) and App.

**Related:** [evolutionary search](#/glossary/evolutionary-search), [island model](#/glossary/island-model), [hyperparameter optimization](#/glossary/hyperparameter-optimization)


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


<a id="pre-registration"></a>

## Pre-registration

Fixing a study's hypotheses, design, endpoints and decision rules in a dated written plan before the data are collected, so that the analysis cannot be tuned to the results; later changes are reported as deviations (general definition). [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") fixed its confirmatory study's settings "in a dated written plan before the first run started" (§5.3); [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") froze its panel, seeds, split schemes and decision rules "before any pool of the panel was generated" (§3.5); [What Does a Harness…](#/papers/xu2026harnessrepair "What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects (2026)") preregistered two studies and reports all their primary endpoints (abstract).

**Learn more:** [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") §5.3; [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") §3.5; [What Does a Harness…](#/papers/xu2026harnessrepair "What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects (2026)") abstract (general definition).

**Related:** [adaptive data analysis](#/glossary/adaptive-data-analysis), [multiple testing](#/glossary/multiple-testing), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [statistical power](#/glossary/statistical-power)


<a id="predicate-invention"></a>

## Predicate invention

Making up the intermediate relations (predicates) a logic program needs but that its input and output schemas don't name, and defining them by rules. In [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)")'s words, "the auxiliary predicates that make a decomposition work are absent from the schema, so the program must invent them, name them, and, in Soufflé, declare them with typed attributes" (§3, PDF p. 3). The term comes from [inductive logic programming](#/glossary/inductive-logic-programming-ilp), which "has long studied predicate invention" (§2).

**Learn more:** [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.37233#page=3)) §3 (PDF p. 3), §2 and §4.1.

**Related:** [Datalog](#/glossary/datalog), [logic programming](#/glossary/logic-programming), [inductive logic programming (ILP)](#/glossary/inductive-logic-programming-ilp), [program synthesis](#/glossary/program-synthesis)


<a id="prediction-powered-inference-ppi"></a>

## Prediction-powered inference (PPI)

Estimating a quantity from a model's predictions on every item, used as a stand-in for the label (a surrogate), together with true labels on a random sample, which correct the surrogate's bias; the estimate stays valid however poor the surrogate, and a good surrogate means fewer labels are needed (general definition). Example: [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)")'s PPI-style baseline gets a surrogate on every point and labels each point with probability q, adding the surrogate value plus the labelled correction divided by q, D̂ + (L/q)(D − D̂) (§6.4); PPI++ adds a power-tuning weight λ that "interpolates between the classical estimator (λ = 0) and full PPI (λ = 1)" (App. E). The authors place PPI's "home setting" at "single-model means with strong surrogates" (§6.4).

**Learn more:** [DISCERN ("Pay Only for Disagreement")](#/papers/balachandran2026discern "Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds (2026)") §2 "Label-efficient evaluation", §6.4 and App. E, which use it without a general definition (general definition), citing Angelopoulos et al. (2023), not listed here.

**Related:** [active testing](#/glossary/active-testing), [importance sampling and importance weighting](#/glossary/importance-sampling-and-importance-weighting), [LLM-as-a-judge](#/glossary/llm-as-a-judge)


<a id="prefix-tuning"></a>

## Prefix-tuning

Keeping a model's weights fixed and training a few continuous vectors that are added to its input as if they were extra tokens, though they stand for no real word, by gradient descent (a "soft prompt"). [SynTra (Synthetic Transfer)](#/papers/jones2023syntra "Teaching Language Models to Hallucinate Less with Synthetic Tasks (2023)") appends such vectors to the system message, "Following Li et al." (§2.1 footnote), since "the set of possible system messages is discrete, precluding continuous optimization" (§2.3); [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") lists prefix tuning among soft-prompt methods that "freeze original parameters and fine-tune only a small number of additional soft prompt" tokens (§2.2.2).

**Learn more:** [SynTra (Synthetic Transfer)](#/papers/jones2023syntra "Teaching Language Models to Hallucinate Less with Synthetic Tasks (2023)") §2.1, §2.3, App. A; [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") §2.2.2. Li and Liang (2021) is not listed here.

**Related:** [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation), [textual gradient](#/glossary/textual-gradient)


<a id="premise-selection"></a>

## Premise selection

Choosing, from a large library of proven lemmas and definitions, the few likely to help prove the current goal, so that a prover or LLM can use them without seeing the whole library. LeanDojo's authors: "Premises are existing lemmas or definitions useful for proving a theorem. They are used as arguments in tactics" ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") §3); its prover retrieves 100 of the premises accessible to the theorem with a [dense retriever](#/glossary/dense-retrieval) and concatenates them with the proof state, truncated to a fixed length, as the tactic generator's input (§5). Example (§3): the tactic `rewrite mod_self` rewrites the goal with the premise `mod_self`, defined in another file.

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 5](https://arxiv.org/pdf/2306.15626#page=5)) §3 (PDF p. 5) and §5 (PDF pp. 7–8); [Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)") ([PDF p. 5](https://arxiv.org/pdf/2303.04910#page=5)) §2.3 (PDF p. 5), which calls premises "definitions and previously proven statements" and contrasts premise selection with adding the preceding lines of the theory file to the prompt, and §3.7 (PDF p. 8), where its authors hypothesize that premise selection, which Thor leaves to the [hammer](#/glossary/hammer-automated-theorem-proving) Sledgehammer, is what gives Thor its lead on mathematics proofs.

**Related:** [tactic](#/glossary/tactic), [hammer (automated theorem proving)](#/glossary/hammer-automated-theorem-proving), [proof assistant](#/glossary/proof-assistant), [dense retrieval](#/glossary/dense-retrieval), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


<a id="prequential-coding"></a>

## Prequential coding

Measuring how many bits a sequence of data takes to send when each item is coded with a model trained only on the items before it, so the total reflects both how well the model ends up predicting the data and how much it had to learn on the way (general definition). [Self-Play Only Evolves When…](#/papers/liu2026infogain "Self-Play Only Evolves When Self-Synthetic Pipeline Ensures Learnable Information Gain (2026)") writes Pᵢ for "the predictive distribution of the model before observing Zᵢ" and estimates learnable information (epiplexity) as the sum, over training tokens, of each token's code length under Pᵢ minus its code length under the fully trained model (§4, Eq. 7), extending a method of Finzi et al. (2026), not listed here.

**Learn more:** [Self-Play Only Evolves When…](#/papers/liu2026infogain "Self-Play Only Evolves When Self-Synthetic Pipeline Ensures Learnable Information Gain (2026)") (unchecked) §4, Eq. 7 and App. B, which use the term without defining it (general definition).

**Related:** [minimum description length (MDL)](#/glossary/minimum-description-length-mdl), [Shannon entropy](#/glossary/shannon-entropy), [negative log-likelihood (NLL)](#/glossary/negative-log-likelihood-nll)


<a id="primary-key-foreign-key-join"></a>

## Primary key-foreign key join

A join of a table's foreign-key column with the primary key it refers to, such as each sale with its product (general definition). Each row on the foreign-key side matches at most one row on the other side, so the join never returns more rows than that side has. DSB's authors write that the joins in TPC-DS "are mostly between a primary key and a foreign key or between a primary key and another primary key", while queries in modern decision-support workloads "sometimes join tables on columns that are neither primary keys nor foreign keys, e.g., many-to-many joins" ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §1).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §1 (PDF p. 1) and §3 (PDF p. 4), whose data generator picks foreign keys in a fact table that point into two dimension tables; neither defines the term (general definition).

**Related:** [integrity constraint](#/glossary/integrity-constraint), [many-to-many relationship](#/glossary/many-to-many-relationship), [star and snowflake schemas](#/glossary/star-and-snowflake-schemas), [cardinality estimation](#/glossary/cardinality-estimation)


<a id="principal-component-analysis-pca"></a>

## Principal component analysis (PCA)

Finds the few directions along which a set of vectors varies most, so that high-dimensional data, such as a model's hidden states, can be projected onto them and compared (general definition). [Does Math Reasoning Improve…](#/papers/huan2025mathtransfer "Does Math Reasoning Improve General LLM Capabilities? Understanding Transferability of LLM Reasoning (2025)") projects hidden states before and after fine-tuning onto their first principal components to measure how far training moved them (§3).

**Learn more:** [Does Math Reasoning Improve…](#/papers/huan2025mathtransfer "Does Math Reasoning Improve General LLM Capabilities? Understanding Transferability of LLM Reasoning (2025)") §1, §3, which uses it without defining it (general definition).

**Related:** [t-SNE](#/glossary/t-sne)


<a id="procedural-memory"></a>

## Procedural memory

An agent's stored know-how about how to act, kept across tasks: lessons drawn from its earlier successes and failures that are "stored and injected in context at test time", which "leaves model weights untouched" ([DAEDALUS](#/papers/edy2026daedalus "DAEDALUS: Bootstrapping Agent Memory from Self-Generated Tasks (2026)") §1).

**Learn more:** [DAEDALUS](#/papers/edy2026daedalus "DAEDALUS: Bootstrapping Agent Memory from Self-Generated Tasks (2026)") §1; [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)"), one such system, which that section cites.

**Related:** [agent skill](#/glossary/agent-skill), [library learning](#/glossary/library-learning), [experience replay](#/glossary/experience-replay), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="product-automaton"></a>

## Product automaton

An automaton that runs two or more automata side by side on the same input: its states are tuples of their states, and it moves all of them on each character (general definition). Products answer questions about pairs of runs: the product of two automata accepts their intersection, and the product of an NFA with itself has one state per pair of paths, so a cycle in it on which the two copies differ shows that some inputs have many accepting paths. [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") tests [infinite ambiguity](#/glossary/infinite-ambiguity-of-an-automaton) this way and extracts attack strings from the product (§3.4, PDF p. 6).

**Learn more:** [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §3.4 (PDF p. 6), which uses it without defining it (general definition).

**Related:** [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa), [infinite ambiguity (of an automaton)](#/glossary/infinite-ambiguity-of-an-automaton), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence)


<a id="production-rule-rule-engine"></a>

## Production rule (rule engine)

A rule made of a condition and an action: whenever the condition holds, the action may be run ("fired"). A rule engine repeatedly finds the rules whose conditions hold and fires one of them; how it chooses among several eligible rules is its conflict-resolution scheme. Starburst's Query Rewrite expresses its rewrite heuristics as production rules, which its authors say "frees us of this burden" of fixing the order in which rules apply, and it supports two conflict-resolution schemes, one that cycles through an ordered set of rules and one that "always fires the highest order rule that has its condition satisfied" ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4, PDF pp. 8–9).

**Learn more:** [Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)") §4 (PDF pp. 8–9).

**Related:** [forward chaining](#/glossary/forward-chaining), [phase ordering](#/glossary/phase-ordering), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="program-equivalence"></a>

## Program equivalence

Two programs are equivalent if they behave the same on every input: "if, for every input x, they either both halt with the same output or both fail to halt" ([Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)") §2.1). Proving it is undecidable in general (see [Rice's theorem](#/glossary/halting-problem-and-rices-theorem)), while showing that two programs differ needs only one input on which they disagree. [Query equivalence](#/glossary/query-equivalence) is the special case for database queries.

**Learn more:** [Program Semantic Inequivalence Game…](#/papers/micelibarone2025sinq "Program Semantic Inequivalence Game with Large Language Models (2025)") §2.1; [Semantic Equivalence Self-Play (SEQ/SINQ](#/papers/poon2026selfplay "Improving LLM Code Reasoning via Semantic Equivalence Self-Play with Formal Verification (2026)") § "Step 2a" and App. A, which proves Haskell functions equivalent with Liquid Haskell.

**Related:** [query equivalence](#/glossary/query-equivalence), [translation validation](#/glossary/translation-validation), [differential testing](#/glossary/differential-testing), [refinement type](#/glossary/refinement-type), [halting problem and Rice's theorem](#/glossary/halting-problem-and-rices-theorem)


<a id="program-sketch-sketching"></a>

## Program sketch (sketching)

A partial program with holes, written by a person or a model, whose holes a synthesizer fills so that the completed program meets a specification (general definition). In Sketch (Solar-Lezama 2008, not listed here) and its variants the holes are constants a solver computes; [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") instead generates sketches from English, and in them "the holes in the sketch represent arbitrary regexes rather than constants" (§10), each hole carrying hints from the description (§4).

**Learn more:** [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") §2, §4 and §10.

**Related:** [program synthesis](#/glossary/program-synthesis), [syntax-guided synthesis (SyGuS)](#/glossary/syntax-guided-synthesis-sygus), [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis), [enumerative synthesis](#/glossary/enumerative-synthesis)


<a id="program-slicing"></a>

## Program slicing

Finding the parts of a program that can affect, or be affected by, chosen lines, by following data dependencies (which values flow where) and control dependencies (which conditions decide whether a line runs). A backward slice collects what the chosen lines depend on, a forward slice what depends on them; an intraprocedural slice stays within one function (general definition). [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") computes "the forward and backward slice from modified lines" of a patch on a program dependence graph, to aim new tests at the code the patch can affect (§3.1.3).

**Learn more:** [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") §3.1.3 and App. A.3.2.

**Related:** [symbolic execution](#/glossary/symbolic-execution), [delta debugging](#/glossary/delta-debugging), [branch and path coverage](#/glossary/branch-and-path-coverage)


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


<a id="programmable-logic-controller-plc"></a>

## Programmable logic controller (PLC)

An industrial computer that runs control logic for machines and processes in a fixed loop. [Compilation Is Not Correctness](#/papers/chen2026cyclebench "Compilation Is Not Correctness: Scan-by-Scan Evaluation of LLM-Generated PLC Programs (2026)") describes PLCs as automating "industrial processes through repeated scans, each reading inputs, executing control logic, and updating outputs" (abstract), so a program's state carries from one scan to the next. Engineers write that logic mostly in Structured Text (ST), "a high-level textual language defined by IEC 61131-3" (§1).

**Learn more:** [Compilation Is Not Correctness](#/papers/chen2026cyclebench "Compilation Is Not Correctness: Scan-by-Scan Evaluation of LLM-Generated PLC Programs (2026)") abstract, §1 and §2.1.

**Related:** [finite-state machine](#/glossary/finite-state-machine), [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl)


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


<a id="prompt-caching"></a>

## Prompt caching

A model provider's reuse of the computation it did for an input prefix it has seen recently (the [KV cache](#/glossary/kv-cache) for those tokens), so that a later request starting with the same text is faster and cheaper (general definition). It rewards putting long, fixed material first. [Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)") asks 25 questions about each long context window "to allow for prompt caching, reducing the time to evaluate local models and the cost to evaluate on most APIs" (§2.2); [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)") argues that it makes a long, growing context cheaper to serve (§4.7, App. A.3).

**Learn more:** [Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)") §2.2; [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)") §4.7 and App. A.3. Neither defines it (general definition).

**Related:** [KV cache](#/glossary/kv-cache), [context compaction](#/glossary/context-compaction)


<a id="proof-assistant"></a>

## Proof assistant

Software in which definitions, theorems and proofs are written in a formal language and every proof is checked by machine; the final check is done by the tool's kernel. Examples: Coq (renamed Rocq; [Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §1), Isabelle and Lean. A proof the kernel accepts is a [certificate](#/glossary/certificate) for the theorem exactly as stated, so it is only as good as the definitions it uses, such as the [formal semantics](#/glossary/formal-semantics) of SQL.

Gotcha: a proof file can compile with steps marked as skipped (`Admitted` in Rocq; [Quarry ("Planning to Hammer")](#/papers/zhang2026quarry "Planning to Hammer: Difficulty-Aware Decomposition for Automating Rocq Proofs (2026)") §4.2, PDF p. 9, relies on Rocq accepting such lemmas), so a checker must also confirm that nothing was admitted.

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 1](https://arxiv.org/pdf/2306.15626#page=1)) §1 (PDF p. 1); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §1 (PDF p. 1); [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") ([PDF p. 2](https://arxiv.org/pdf/2608.15709#page=2)) §1 (PDF p. 2), whose proofs are "checked in isolation by the Rocq kernel".

**Related:** [tactic](#/glossary/tactic), [formal semantics](#/glossary/formal-semantics), [certificate](#/glossary/certificate), [autoformalization](#/glossary/autoformalization)


<a id="propensity-score-and-inverse-probability-weighting-iptw"></a>

## Propensity score and inverse probability weighting (IPTW)

A propensity score is a case's estimated chance of getting a treatment given its measured covariates. Inverse probability of treatment weighting (IPTW) weights each treated case by one over that chance and each untreated case by one over the chance of no treatment, so that in the weighted data the covariates no longer predict treatment, and treated and untreated outcomes can be compared as if treatment had been assigned at random, provided no [confounder](#/glossary/confounder) is left unmeasured (general definition). Example: [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") fits a logistic propensity model on each prompt's pre-edit state, computes stabilized weights capped at 10, and compares accuracy gains with and without an edit type under them (§4.2).

**Learn more:** [Why Prompt Optimization Works,…](#/papers/gong2026whypo "Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis (2026)") §2, §4.1–4.2, which cites Rosenbaum and Rubin (1983) and Robins et al. (2000), neither on this site.

**Related:** [confounder](#/glossary/confounder), [exchangeability](#/glossary/exchangeability), [average treatment effect (ATE)](#/glossary/average-treatment-effect-ate), [conditional average treatment effect (CATE)](#/glossary/conditional-average-treatment-effect-cate)


<a id="property-graph"></a>

## Property graph

A graph data model in which nodes and edges each carry labels (their kind) and key–value properties. [Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §3.1: nodes model entities, edges model relationships, and each stores "pairs of property keys and values" and a label; [Same Pattern](#/papers/mandarapu2026divergence "Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns (2026)") §2 gives the formal version: node and edge identifiers, a map sending each edge to an ordered (directed) or unordered pair of nodes, a set of labels per element and a partial map from element and property name to value, with parallel edges and self-loops allowed. Unlike RDF, where every fact is a triple, a property graph stores properties on the nodes and edges themselves ([Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") §1; see [knowledge graph](#/glossary/knowledge-graph)). Cypher is its most widely used query language, and GQL and SQL/PGQ are newer ISO standards ([Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") §1, §3); their queries match patterns such as variable-length paths, e.g. `(a)-[*1..3]->(b)` for paths of one to three edges ([Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") App. B.4).

**Learn more:** [Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §3.1 (Defs. 3.1–3.3); [Same Pattern](#/papers/mandarapu2026divergence "Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns (2026)") §2; [Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") §1 and §4.1; [Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") §1 and §3.

**Related:** [knowledge graph](#/glossary/knowledge-graph), [graph edit distance](#/glossary/graph-edit-distance), [schema mapping](#/glossary/schema-mapping), [query equivalence](#/glossary/query-equivalence)


<a id="property-based-testing"></a>

## Property-based testing

Testing that states a property the code must always satisfy and checks it on many random inputs, rather than on hand-picked cases; inputs that break the code's preconditions are discarded. [Disproving Program Equivalence with LLMs](#/papers/allamanis2025disproving "Disproving Program Equivalence with LLMs (2025)") §4.2 calls it "a form of fuzzing or random testing", and random differential testing one form of it.

**Learn more:** [Disproving Program Equivalence with LLMs](#/papers/allamanis2025disproving "Disproving Program Equivalence with LLMs (2025)") §4.2.

**Related:** [fuzzing](#/glossary/fuzzing), [differential testing](#/glossary/differential-testing), [metamorphic testing](#/glossary/metamorphic-testing), [test oracle](#/glossary/test-oracle)


<a id="pseudo-relevance-feedback"></a>

## Pseudo-relevance feedback

In search, treating the top-ranked results of a query as relevant, without anyone judging them, and using what they share, usually their common words, to improve the search, for example by expanding the query (general definition). [Externalising Reasoning by Teaching…](#/papers/gemmellgorriz2026externalising "Externalising Reasoning by Teaching Language Models to Use Programs as Tools (2026)") uses it in decoding instead: BM25 retrieves training pairs whose English descriptions match the input, and the frequencies of words in their code, weighted by retrieval score, are mixed into the model's next-token probabilities (§4.2.2–4.2.4, Eqs. 4.1–4.2, PDF pp. 53–55).

**Learn more:** [Externalising Reasoning by Teaching…](#/papers/gemmellgorriz2026externalising "Externalising Reasoning by Teaching Language Models to Use Programs as Tools (2026)") §4.2.2–4.2.4 (PDF pp. 53–55), which builds on Lavrenko and Croft's relevance models, not listed here; the search sense is a general definition.

**Related:** [BM25](#/glossary/bm25), [TF-IDF](#/glossary/tf-idf), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)


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


<a id="query-learning-membership-and-equivalence-queries"></a>

## Query learning (membership and equivalence queries)

A learning setting in which the learner asks a teacher questions instead of only receiving examples. A membership query asks whether one input is in the target (or what the target outputs on it); an equivalence query proposes a whole hypothesis, which the teacher accepts or answers with a counterexample, an input on which the two differ ([Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") App. A). Angluin's L* algorithm learns regular languages from such queries ([Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §2). [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") notes that "finitely many membership labels are generally insufficient to identify the full target language" (App. A); [CodeARC](#/papers/wei2025codearc "CodeARC: Benchmarking Reasoning Capabilities of LLM Agents for Inductive Program Synthesis (2025)") says its program-synthesis setup "parallels the classic learnability framework of queries and counterexamples" (§1). Angluin (1987) is not listed here.

**Learn more:** [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §2 and App. A; [CodeARC](#/papers/wei2025codearc "CodeARC: Benchmarking Reasoning Capabilities of LLM Agents for Inductive Program Synthesis (2025)") §1 and §3.1.

**Related:** [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis), [active learning](#/glossary/active-learning), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [symmetric difference](#/glossary/symmetric-difference)


<a id="query-optimizer"></a>

## Query optimizer

The database component that turns a query into an executable [plan](#/glossary/query-plan-and-explain): it considers equivalent ways to compute the query (join orders, where to apply filters, which algorithm for each operator) and picks the one it estimates to be cheapest ([cost-based optimization](#/glossary/cost-based-optimization)).

Volcano and Cascades are Graefe's designs for extensible optimizers, built from rules plus a generic search engine: [transformation rules](#/glossary/transformation-and-implementation-rules) produce equivalent logical expressions, implementation rules map them to algorithms, and the search uses dynamic programming over a [memo](#/glossary/memo), so that no alternative is optimized twice ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2–3; [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2). Volcano first derived all logical alternatives and then chose algorithms; Cascades abolishes this "separation into two phases" and explores alternatives only on demand ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2). QO-Verify's authors state that Microsoft SQL Server's optimizer "uses the Cascades framework" ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §2), and use it to prove queries equivalent.

Gotcha: an optimizer used as a prover can prove only what its rules can derive. QO-Verify "can be expected to verify equivalence only when the transformation rules required to transform Q to Q′ already exist in the optimizer" ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1), and otherwise answers Unknown.

**Learn more:** [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)") §2.1–2.2 (PDF pp. 2–3) and §3 (PDF p. 4); [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)") §2 (PDF pp. 2–5); [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §1–2 (PDF p. 2).

**Related:** [memo](#/glossary/memo), [transformation and implementation rules](#/glossary/transformation-and-implementation-rules), [cost-based optimization](#/glossary/cost-based-optimization), [cardinality estimation](#/glossary/cardinality-estimation), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [logical plan](#/glossary/logical-plan), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="query-performance-regression-qpr"></a>

## Query performance regression (QPR)

A query that runs slower after a change meant to speed it up, such as new indexes or a rewrite, than it did before (general definition). [LLM-driven index tuning on SQL Server](#/papers/wang2026indextuning "Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server (2026)") §3.1 reports one case: "DTA's recommendation results in a severe QPR for query 22 (nearly a 10× slowdown in execution time)" (PDF p. 5); [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") says rule-based query rewriters "may lead to performance regressions" (abstract). Optimizers' cost estimates can be wrong, so a change predicted to help can still hurt ([LLM-driven index tuning on SQL Server](#/papers/wang2026indextuning "Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server (2026)") §1).

**Learn more:** [LLM-driven index tuning on SQL Server](#/papers/wang2026indextuning "Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server (2026)") ([PDF p. 5](https://arxiv.org/pdf/2603.09181#page=5)) §1 and §3.1 (PDF p. 5), which use the term without defining it (general definition); [QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)") abstract.

**Related:** [optimizer cost estimate](#/glossary/optimizer-cost-estimate), [cardinality estimation](#/glossary/cardinality-estimation), [regression testing](#/glossary/regression-testing), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


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

<a id="random-effects-meta-analysis"></a>

## Random-effects meta-analysis

Combining one effect estimate from each of several studies (or models) into an average while allowing the true effect to differ between them: each estimate is weighted by the inverse of its own variance plus an estimated between-study variance τ², for which DerSimonian–Laird is a standard estimator (general definition; [Auditing Reward Hackability in…](#/papers/rajan2026hackability "Auditing Reward Hackability in Code RL Training Environments (2026)") §5). I² is the share of the spread among the estimates beyond what chance alone would produce; 0% means they agree as well as their noise allows (general definition).

Example: [Auditing Reward Hackability in…](#/papers/rajan2026hackability "Auditing Reward Hackability in Code RL Training Environments (2026)") pools per-model effects over 134 SWE-bench Verified submissions this way (§5).

**Learn more:** [Auditing Reward Hackability in…](#/papers/rajan2026hackability "Auditing Reward Hackability in Code RL Training Environments (2026)") §5 (general definitions).

**Related:** [standard error](#/glossary/standard-error), [hierarchical model](#/glossary/hierarchical-model), [multiple testing](#/glossary/multiple-testing)


<a id="react"></a>

## ReAct

A prompting pattern for LLM agents that interleaves reasoning with actions: the model writes a thought, takes an action (a tool call, a search), reads the result, and repeats. Its authors describe it as using LLMs "to generate both reasoning traces and task-specific actions in an interleaved manner" ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)") abstract). It underlies many agent harnesses.

**Learn more:** [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)") abstract and §1; [UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") §4.3, which uses "a ReAct framework" for its agentic evaluation.

**Related:** [agent harness](#/glossary/agent-harness), [tool calling (function calling)](#/glossary/tool-calling-function-calling), [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning)


<a id="reaction-prediction-and-retrosynthesis"></a>

## Reaction prediction and retrosynthesis

Two inverse tasks in chemistry: reaction prediction gives the products of a reaction from its reactants, and retrosynthesis goes back from a target product to reactants that could make it (general definition). [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") treats them as a pair of "bidirectional" tasks for chemical LLMs and trains for round-trip consistency between them (abstract; §1, §2).

**Learn more:** [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") abstract and §2.

**Related:** [SMILES](#/glossary/smiles), [molecular fingerprint and Tanimoto similarity](#/glossary/molecular-fingerprint-and-tanimoto-similarity), [back-translation](#/glossary/back-translation)


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


<a id="recursive-self-improvement-rsi"></a>

## Recursive self-improvement (RSI)

AI systems that propose changes to themselves (their code, tools or prompts), with an evaluation deciding which changes are kept and become the starting point of the next round (general definition). [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") (abstract): "RSI typically relies on finite evaluation resources, such as fixed benchmarks, to determine which modifications are retained and what is proposed next"; its §1 examples include agents that "rewrite their own tools". [Recursive self-improvement of AI…](#/papers/srikanth2026aide2 "Recursive self-improvement of AI research agents (2026)") (abstract) uses a narrower sense, an AI research agent optimizing its own code: "each accepted rewrite becomes the agent that the next round edits. We refer to this loop as recursive self-improvement."

**Learn more:** [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") abstract and §1; [Recursive self-improvement of AI…](#/papers/srikanth2026aide2 "Recursive self-improvement of AI research agents (2026)") abstract.

**Related:** [bi-level optimization](#/glossary/bi-level-optimization), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [adaptive data analysis](#/glossary/adaptive-data-analysis), [self-evolving agent](#/glossary/self-evolving-agent)


<a id="redos-and-catastrophic-backtracking"></a>

## ReDoS and catastrophic backtracking

ReDoS (regular expression denial of service) is an attack in which "a malicious user submits a crafted string that forces the regex engine into a prolonged, resource-intensive matching process, leading to resource exhaustion and service failure" ([LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") §1). Its cause is catastrophic backtracking: most regex engines match by trying one way of matching after another, and for some regexes, such as `(a+)+$` on a long run of a's followed by a b, the number of ways grows exponentially (general definition for the mechanism). [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)") §2.2 calls such a "super-linear (SL) match" one that "may require polynomial or exponential time in the worst case", and finds that "some regex engines fall prey to super-linear behavior and others avoid it" (§7.2.3).

**Learn more:** [LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") §1 and §3; [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)") §2.2 and §7.2.3.

**Related:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [fuzzing](#/glossary/fuzzing)


<a id="reference-free-evaluation"></a>

## Reference-free evaluation

Judging an output without a reference answer, tests or other ground truth; for code, from the task description and the code alone. LLM judges are used in such settings "by taking only the task description and the generated code as input to determine whether the code fulfills the intended functionality" ([Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") §1).

**Learn more:** [Don't Judge Code by Its Cover](#/papers/moon2025codejudge "Don't Judge Code by Its Cover: Exploring Biases in LLM Judges for Code Evaluation (2025)") §1, which uses the term without defining it (general definition).

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [test oracle](#/glossary/test-oracle)


<a id="refinement-type"></a>

## Refinement type

A type with a logical condition that its values must satisfy, such as "integers greater than 0" or "lists of length n"; a checker, often an [SMT solver](#/glossary/sat-and-smt-solvers), proves at compile time that the code respects the conditions (general definition). Liquid Haskell "embeds refinement types into the language", which [Semantic Equivalence Self-Play (SEQ/SINQ](#/papers/poon2026selfplay "Improving LLM Code Reasoning via Semantic Equivalence Self-Play with Formal Verification (2026)") uses to prove two Haskell functions equivalent (§2).

**Learn more:** [Semantic Equivalence Self-Play (SEQ/SINQ](#/papers/poon2026selfplay "Improving LLM Code Reasoning via Semantic Equivalence Self-Play with Formal Verification (2026)") §2 (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [formal specification](#/glossary/formal-specification), [Hoare triple](#/glossary/hoare-triple), [program equivalence](#/glossary/program-equivalence), [proof assistant](#/glossary/proof-assistant)


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


<a id="regression-to-the-mean"></a>

## Regression to the mean

Items picked because they scored unusually high (or low) on one noisy measurement tend to score closer to the average when measured again, by chance alone. [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") relates the [optimizer's curse](#/glossary/winners-curse-optimizers-curse) to it: "high performers on one test are likely to perform less well on subsequent tests" (§4, PDF p. 10). [What Stops a Small…](#/papers/bozoglan2026slmdbagent "What Stops a Small Language Model From Driving a Database Agent (2026)") notes that items re-read because they had scored low are expected to improve by regression to the mean alone (§8.6).

**Learn more:** [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") §4 (PDF p. 10); [What Stops a Small…](#/papers/bozoglan2026slmdbagent "What Stops a Small Language Model From Driving a Database Agent (2026)") §8.6.

**Related:** [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [shrinkage](#/glossary/shrinkage), [hierarchical model](#/glossary/hierarchical-model)


<a id="regular-expression-and-regular-language"></a>

## Regular expression and regular language

A regular expression (regex) is a pattern that describes a set of strings. In the classical sense of automata theory it is built from single characters with concatenation, union (either-or) and the Kleene star (zero or more repetitions), and the strings it matches form a regular language, exactly the languages a [finite automaton](#/glossary/finite-state-machine) recognizes ([Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §3). [Query4Regex](#/papers/hahn2026query4regex "Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries (2026)") adds intersection, complement and bounded repetition, which keep its task "within regular languages", so that answers can be checked exactly (§1, PDF p. 2). Practical regex engines differ: "Most programming languages support regexes", but "PCRE … and POSIX Regular Expressions … have influenced but not standardized the various regex dialects" ([Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)") §2.1), and features such as backreferences and lookarounds go beyond regular languages ([Query4Regex](#/papers/hahn2026query4regex "Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries (2026)") §1). Engines also differ in what counts as a match: under full-match semantics the regex must match the whole input, under partial-match semantics any part of it (general definition; [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)") §7.1.1 tests with the latter).

**Learn more:** [Why Aren't Regular Expressions…](#/papers/davis2021lingua "Why Aren't Regular Expressions a Lingua Franca? An Empirical Study on the Re-use and Portability of Regular Expressions (2019)") §2.1; [Query4Regex](#/papers/hahn2026query4regex "Query4Regex: Verifiable Regex Transformation through Formal Operations from NL and DSL Queries (2026)") §1 (PDF p. 2); [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §3 and App. C (Tab. 5); [Word Problems Requiring Exponential Time](#/papers/stockmeyer1973word "Word Problems Requiring Exponential Time (Preliminary Report) (1973)"), on how hard it is to decide whether two regular expressions are equivalent (introduction).

**Related:** [finite-state machine](#/glossary/finite-state-machine), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [LIKE and ILIKE](#/glossary/like-and-ilike), [context-free grammar](#/glossary/context-free-grammar)


<a id="regular-tree-language-and-tree-automaton"></a>

## Regular tree language and tree automaton

A tree automaton is a finite-state machine that reads a tree instead of a string, giving each node a state from its label and its children's states; the sets of trees such automata accept are the regular tree languages, which regular tree grammars also define (general definition). They are the types XML documents are checked against: [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") says regular tree languages "gather" XML type formalisms such as DTD, XML Schema and Relax NG (§5.2, PDF p. 5), and [XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") says tree automata "provide the foundation for the Relax NG language" (§4).

**Learn more:** [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §5.2 (PDF p. 5), which gives a grammar of binary regular tree types; [XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") §3.2 ("Supported XML Types") and §4. Neither defines tree automata (general definition).

**Related:** [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [finite-state machine](#/glossary/finite-state-machine), [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa), [modal μ-calculus](#/glossary/modal-μ-calculus), [monadic second-order logic (MSO)](#/glossary/monadic-second-order-logic-mso)


<a id="reinforce"></a>

## REINFORCE++

A [policy-gradient](#/glossary/policy-gradient) RL algorithm for LLMs (Hu, 2025, not listed here) that, as [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") describes it, uses [PPO](#/glossary/ppo)'s clipped objective with each reward normalized by the mean and standard deviation of rewards over the whole batch, one global baseline, instead of per question as in [GRPO](#/glossary/grpo) (App. A; §3.3.5). AZR's own variant, Task-Relative REINFORCE++, computes a separate baseline for each of its six task-and-role combinations, which the authors call "an interpolation between per-question baselines, as in GRPO, and a global baseline" (§3.3.5).

**Learn more:** [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") ([PDF p. 23](https://arxiv.org/pdf/2505.03335#page=23)) App. A (PDF p. 23) and §3.3.5 (PDF p. 8). An open erratum (slip) says App. [Logic-RL](#/papers/xie2025logicrl "Logic-RL: Unleashing LLM Reasoning with Rule-Based Reinforcement Learning (2025)") ([PDF p. 4](https://arxiv.org/pdf/2502.14768#page=4)) §2.3 (PDF pp. 4–5) adopts "a modified version" of it that moves the KL penalty from the reward into the loss and uses GRPO's KL estimator.

**Related:** [policy gradient](#/glossary/policy-gradient), [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [KL penalty](#/glossary/kl-penalty)


<a id="reinforcement-learning"></a>

## Reinforcement learning

Training by trial and reward instead of from correct examples. The model being trained is the **policy**; it produces **rollouts** (sampled outputs, for an LLM whole responses to a prompt); a **reward** scores each rollout; and each update makes high-reward outputs more likely. For LLMs it usually follows supervised fine-tuning, and the reward comes from a learned reward model or from rules such as checking the final answer ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 1.2).

**Learn more:** [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 6](https://arxiv.org/pdf/2501.12948#page=6)) Supp. 1.2 (SI PDF p. 6) and Methods "GRPO" (PDF p. 7); [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 11](https://arxiv.org/pdf/2402.03300#page=11)) §4.1.1 (PDF p. 11).

**Related:** [PPO](#/glossary/ppo), [GRPO](#/glossary/grpo), [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [reward hacking](#/glossary/reward-hacking), [self-play](#/glossary/self-play), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward shaping](#/glossary/reward-shaping), [Markov decision process](#/glossary/markov-decision-process), [expert iteration](#/glossary/expert-iteration), [curriculum learning](#/glossary/curriculum-learning), [cold start](#/glossary/cold-start)


<a id="reinforcement-learning-from-human-feedback-rlhf"></a>

## Reinforcement learning from human feedback (RLHF)

Fine-tuning an LLM towards what people prefer, in two stages: train a [reward model](#/glossary/reward-model) on human judgments of responses, then train the LLM with [reinforcement learning](#/glossary/reinforcement-learning), for example [PPO](#/glossary/ppo), to produce responses that the reward model scores highly. BPO's authors describe "the standard framework" as consisting "of reward modeling and policy training", applied after supervised fine-tuning ([BPO](#/papers/cheng2023bpo "Black-Box Prompt Optimization: Aligning Large Language Models without Model Training (2024)") §2). RLAIF uses an AI's feedback instead of people's, and [DPO](#/glossary/direct-preference-optimization-dpo) learns from the preference pairs without a separate reward model.

**Learn more:** [BPO](#/papers/cheng2023bpo "Black-Box Prompt Optimization: Aligning Large Language Models without Model Training (2024)") ([PDF p. 3](https://arxiv.org/pdf/2311.04155#page=3)) §2 (PDF p. 3), citing Stiennon et al. 2020 and Ouyang et al. 2022 (not listed here).

**Related:** [reward model](#/glossary/reward-model), [PPO](#/glossary/ppo), [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo), [KL penalty](#/glossary/kl-penalty), [reward hacking](#/glossary/reward-hacking)


<a id="rejection-sampling"></a>

## Rejection sampling

In the LLM papers here: sample several outputs for each prompt, check each one (the final answer is correct, a verifier accepts it, a format or length rule holds), keep those that pass and discard the rest. The kept outputs usually become fine-tuning data ("rejection sampling fine-tuning", RFT); at inference time the same loop returns an output that passes. The name comes from a statistics method that draws exact samples from a target distribution by accepting or rejecting proposals with computed probabilities; the LLM usage keeps only the accept-or-reject idea.

Examples: DeepSeekMath defines RFT as fine-tuning "on the filtered outputs sampled from the SFT model", filtered "based on the correctness of their answers" ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") §5.2.1); DeepSeek-R1 samples multiple responses per prompt and retains "only the correct ones" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Supp. 2.3.3). Other papers mean something else. Tülu 3's authors, who tried it with little gain, describe a reward model or LLM judge ranking n responses so that "the best response is kept" ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") §8.2), which is [best-of-N](#/glossary/best-of-n-sampling) used to make data. s1's "rejection sampling" is sampling "until the generation fits a specific length" ([s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)") §5.2).

Gotcha: the data is only as good as the check. [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") argues that verifiers that accept some wrong outputs, such as unit tests with limited coverage, let mislabeled examples into datasets "curated through rejection sampling" (§6).

**Learn more:** [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)") ([PDF p. 19](https://arxiv.org/pdf/2402.03300#page=19)) §5.2.1 (PDF p. 19); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 19](https://arxiv.org/pdf/2501.12948#page=19)) Supp. 2.3.3 (SI PDF p. 19); [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") ([PDF p. 48](https://arxiv.org/pdf/2411.15124#page=48)) §8.2 (PDF p. 48); [s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)") ([PDF p. 8](https://arxiv.org/pdf/2501.19393#page=8)) §5.2 (PDF p. 8); [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)") ([PDF p. 9](https://arxiv.org/pdf/2411.17501#page=9)) §6 (PDF p. 9).

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


<a id="repl-read-eval-print-loop"></a>

## REPL (read-eval-print loop)

An interactive programming session: it reads a piece of code, runs it, prints the result and waits for the next piece, keeping variables and other state between pieces (general definition), as Python's interactive shell does. [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §1 initializes a "Read-Eval-Print Loop (REPL) programming environment" in which a long prompt is stored "as the value of a variable" that the model inspects with code; [λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") replaces that open-ended loop with a fixed library of combinators (abstract, §1).

**Learn more:** [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") §1–2; [λ-RLM ("The Y-Combinator for LLMs")](#/papers/roy2026ycombinator "The Y-Combinator for LLMs: Solving Long-Context Rot with $\lambda$-Calculus (2026)") abstract and §1. Neither defines it (general definition).

**Related:** [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning), [agent harness](#/glossary/agent-harness), [ReAct](#/glossary/react)


<a id="replicator-dynamics"></a>

## Replicator dynamics

A model from evolutionary game theory of how the shares of competing types in a population change: each type's share grows when its fitness is above the population's average fitness and shrinks when it is below, in proportion to its current share.

Example: [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") shows that GRPO's expected update moves probability between a model's reasoning modes in this form, so that mass flows between modes "strictly based on their advantage relative to the mean" (§2.1, §5).

**Learn more:** [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") ([PDF p. 6](https://arxiv.org/pdf/2601.04411#page=6)) (unchecked) §2.1 ("Interpretation", PDF p. 6), which defines it, citing Cressman (2003), not listed here.

**Related:** [GRPO](#/glossary/grpo), [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb), [policy gradient](#/glossary/policy-gradient), [mean-field approximation (mean-field ODE)](#/glossary/mean-field-approximation-mean-field-ode)


<a id="reranking"></a>

## Reranking

Choosing the final output from several sampled candidates by scoring them, with a trained model, a verifier, or agreement among the candidates' execution results, instead of taking the first sample. For code generation, [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") §2 describes one line of work that picks the program with the most frequent execution result and others that "design reranking schemes"; it compares Self-Debugging with such "code reranking baselines" (§5).

**Learn more:** [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") ([PDF p. 7](https://arxiv.org/pdf/2304.05128#page=7)) §2 and §5 (PDF p. 7).

**Related:** [best-of-N sampling](#/glossary/best-of-n-sampling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [reward model](#/glossary/reward-model)


<a id="resolve-rate"></a>

## Resolve rate

The share of a coding benchmark's instances that an agent solves. On SWE-bench, "% Resolved ... is the proportion of instances for which all tests pass successfully after the model generated patch is applied to the repository" ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") §4). A resolved instance may still be wrong if its tests are weak (see [plausible patch](#/glossary/plausible-patch)).

**Learn more:** [SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") §4, citing the SWE-bench paper, not listed here.

**Related:** [Pass@k](#/glossary/passk), [gold patch](#/glossary/gold-patch), [plausible patch](#/glossary/plausible-patch), [execution accuracy](#/glossary/execution-accuracy)


<a id="rest-api"></a>

## REST API

A web-server interface (REST: Representational State Transfer) that exposes typed resources at URLs and operates on them with HTTP methods, such as POST to create, GET to read, PATCH to update and DELETE to remove, typically with JSON payloads and outcomes signalled by HTTP status codes. Because "the contract is fully expressed through URL paths, JSON bodies, and status codes, a REST server can be evaluated as a black box" ([StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") App. C).

**Learn more:** [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") ([PDF p. 18](https://arxiv.org/pdf/2606.19613#page=18)) (unchecked) App. C (PDF p. 18), a one-page primer.

**Related:** [CRUD](#/glossary/crud)


<a id="retrieval-augmented-generation-rag"></a>

## Retrieval-augmented generation (RAG)

A pipeline that retrieves passages relevant to a question from a corpus and gives them to the LLM as context for its answer. R-Bot's authors describe it as "indexing task-specific knowledge, retrieving relevant content for a given query, and generating answers based on the retrieved context" ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §2.2). Multi-hop pipelines retrieve in several rounds, each with a new query based on what was found ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §7).

**Learn more:** [R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)") §2.2; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)") §3.2 and §7; [LLM-AutoDiff (AdalFlow)](#/papers/yin2025llmautodiff "LLM-AutoDiff: Auto-Differentiate Any LLM Workflow (2025)") §2.1. The original RAG paper is not listed here.

**Related:** [BM25](#/glossary/bm25), [multi-hop question answering](#/glossary/multi-hop-question-answering), [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [reciprocal rank fusion (RRF)](#/glossary/reciprocal-rank-fusion-rrf)


<a id="reward-hacking"></a>

## Reward hacking

The policy raises its reward by exploiting flaws in how the reward is computed instead of doing the task better. The DeepSeek-R1 authors avoid learned reward models for reasoning tasks because they are "susceptible to reward hacking", and warn that with a model-assigned reward "the policy model may find shortcuts to hack the reward model" ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") Methods "Reward design", § "Conclusion, limitation and future work"). A rule-based check can be gamed too if it accepts wrong answers, e.g. a reward that only compares results on one test database.

**Learn more:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation) (the home of this challenge); [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") ([PDF p. 7](https://arxiv.org/pdf/2501.12948#page=7)) Methods "Reward design" (PDF p. 7) and § "Conclusion, limitation and future work" (PDF p. 5).

**Related:** [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr), [execution accuracy](#/glossary/execution-accuracy), [soundness and completeness](#/glossary/soundness-and-completeness), [reward shaping](#/glossary/reward-shaping), [best-of-N sampling](#/glossary/best-of-n-sampling), [reward model overoptimization](#/glossary/reward-model-overoptimization)


<a id="reward-model"></a>

## Reward model

A model trained to score responses, often from human preference comparisons, and used as the reward in RL fine-tuning or to pick the best of several samples. Unlike an exact check, its scores can be wrong, and a policy optimized against it can learn to exploit its errors.

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") (abstract, §1), which says "a significant performance gap remains" between LM judges or reward models and oracle verifiers; [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)") §4.3, which compares its benchmark with RewardBench, a benchmark for reward models.

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [reward hacking](#/glossary/reward-hacking), [best-of-N sampling](#/glossary/best-of-n-sampling), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="reward-model-overoptimization"></a>

## Reward model overoptimization

Optimizing a policy so hard against a learned [reward model](#/glossary/reward-model) that the true objective it stands in for gets worse while the reward model's score keeps rising; an instance of [Goodhart's law](#/glossary/goodharts-law). [Scaling Laws for Reward…](#/papers/gao2022overoptimization "Scaling Laws for Reward Model Overoptimization (2023)") §1: "Optimizing too much against such a model eventually hinders the true objective, a phenomenon we refer to as *overoptimization*"; the paper measures how this effect scales (title, abstract). [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") describes it as "a proxy reward going up while the true objective falls" (§7).

**Learn more:** [Scaling Laws for Reward…](#/papers/gao2022overoptimization "Scaling Laws for Reward Model Overoptimization (2023)") abstract and §1; [Prompt Dominance and Asymmetric…](#/papers/hou2026grpo "Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K (2026)") §7.

**Related:** [reward hacking](#/glossary/reward-hacking), [KL penalty](#/glossary/kl-penalty), [Goodhart's law](#/glossary/goodharts-law), [reward model](#/glossary/reward-model), [best-of-N sampling](#/glossary/best-of-n-sampling)


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


<a id="rogan-gladen-correction"></a>

## Rogan-Gladen correction

A correction of a rate measured with an imperfect detector. If the detector flags a fraction e_det of the items and has true- and false-positive rates TPR and FPR, then e_det = TPR · e_true + FPR · (1 − e_true), so the true rate is estimated as (e_det − FPR) / (TPR − FPR) ([SALUS](#/papers/zhou2026salus "SALUS: Automated Auditing of NL-to-SQL Benchmarks through Weak Supervision of Multi-Agent Output (2026)") §5.4). The denominator is [Youden's index](#/glossary/youdens-index): when the detector barely tells the classes apart, the correction becomes unstable.

**Learn more:** [SALUS](#/papers/zhou2026salus "SALUS: Automated Auditing of NL-to-SQL Benchmarks through Weak Supervision of Multi-Agent Output (2026)") §5.4, citing Rogan and Gladen (1978), not listed here.

**Related:** [true and false positive rates](#/glossary/true-and-false-positive-rates), [Youden's index](#/glossary/youdens-index), [label noise](#/glossary/label-noise)


<a id="rollout"></a>

## Rollout

One run of the system being trained or optimized on one input, together with the scoring of its output; budgets for RL and for prompt and agent optimizers are often counted in rollouts. [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") §2 "Sample-Efficient Optimization": "rollouts—concretely, invocations of Φ [the LLM system] plus evaluation by μ [the metric]—are often computationally, monetarily, or timewise expensive", so the optimizer "is thus limited to at most B rollouts" (PDF p. 4). In RL for LLMs a rollout is a sampled response to a prompt (see [reinforcement learning](#/glossary/reinforcement-learning)); in [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts) it is the random playout that estimates a new node's value in the simulation phase ([LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") §4.2 contrasts its execution-based simulation with "standard MCTS formulations that rely on stochastic rollouts").

**Learn more:** [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") ([PDF p. 4](https://arxiv.org/pdf/2507.19457#page=4)) §2 (PDF p. 4); [LASER](#/papers/li2026laser "LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO (2026)") ([PDF p. 5](https://arxiv.org/pdf/2604.06804#page=5)) §4.2 (PDF p. 5); [HarnessLens ("Verify Smarter](#/papers/xu2026harnesslens "Verify Smarter, Evolve Further: Efficient Harness Evolution through Behavior-Aware Verification (2026)") ([PDF p. 11](https://arxiv.org/pdf/2608.27311#page=11)) App. A.1 (PDF p. 11), where "Every task rollout and LLM session consumes one unit of the interaction budget B", and §5.1 (PDF p. 6), which compares methods by the training rollouts they consume.

**Related:** [trajectory (agent)](#/glossary/trajectory-agent), [reinforcement learning](#/glossary/reinforcement-learning), [reflective prompt optimization](#/glossary/reflective-prompt-optimization), [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts)


<a id="round-trip-property"></a>

## Round-trip property

A property for testing a parser together with its printer: parsing a text into a tree and printing the tree back gives the original text. It needs no labelled answers, so it can test a parser on any input; [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") adopts it as a form of [property-based testing](#/glossary/property-based-testing), calling it "a widely used round-trip property" (§7.1 "Metrics"). Example: that paper's Q-RT rate requires a query to stay identical through two parse–print cycles, ignoring whitespace and parentheses (§7.1, Eq. 1).

**Learn more:** [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §7.1 "Metrics".

**Related:** [property-based testing](#/glossary/property-based-testing), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [concrete syntax tree (CST)](#/glossary/concrete-syntax-tree-cst), [back-translation](#/glossary/back-translation) (a round trip through another language)


<a id="rtl-and-the-chip-design-flow"></a>

## RTL and the chip design flow

Terms of hardware design, where LLM agents now also work (general definitions). RTL (register-transfer level) code describes a chip as registers and the logic between them, in a hardware description language such as Verilog. Logic synthesis compiles RTL into logic gates, and technology mapping maps those gates onto a library's cells; the result is judged by PPA, power, performance (timing) and area.

A testbench is code that drives a design in simulation with inputs (stimulus) and checks its outputs (a checker), and an equivalence check proves that a rewritten design keeps the original's behaviour. The software for these steps is called EDA (electronic design automation) tools, not to be confused with an [estimation of distribution algorithm (EDA)](#/glossary/estimation-of-distribution-algorithm-eda).

Example: [ChipMEM](#/papers/alrabah2026chipmem "ChipMEM: Verification-Grounded Memory for EDA Agents (2026)") optimizes RTL for area "using Yosys for synthesis and equivalence and ABC for technology mapping", and also generates testbench stimulus and checkers (§4).

**Learn more:** [ChipMEM](#/papers/alrabah2026chipmem "ChipMEM: Verification-Grounded Memory for EDA Agents (2026)") §1 and §4, which use the terms without defining them (general definitions).

**Related:** [translation validation](#/glossary/translation-validation), [test oracle](#/glossary/test-oracle), [program equivalence](#/glossary/program-equivalence)


<a id="rubber-duck-debugging"></a>

## Rubber-duck debugging

Debugging by explaining a program line by line, out loud, as if to a rubber duck: putting each step into words exposes where the code's behaviour departs from the intent (general definition). LLM papers borrow it for a model explaining code to itself: [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") names it as the analogy for its explanation step (§1, §3), and [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") trains a model on "verbally and statically explaining why the bug happens" (§6.3; abstract: "human verbal debugging").

**Learn more:** [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)") §1, §3; [SemCoder](#/papers/ding2024semcoder "SemCoder: Training Code Language Models with Comprehensive Semantics Reasoning (2024)") abstract, §6.3. Neither gives a general definition (general definition).

**Related:** [self-correction](#/glossary/self-correction)


<a id="rubric"></a>

## Rubric

A grading guide for open-ended answers: a set of criteria stated in words, each checked separately, often by an [LLM judge](#/glossary/llm-as-a-judge), whose verdicts together make the grade (general definition). In CL-bench, as [From Context to Skills](#/papers/si2026ctx2skill "From Context to Skills: Can Language Models Learn from Context Skillfully? (2026)") uses it, each criterion is itself called a rubric, "a single sentence defining one specific, binary (pass/fail) criterion for judging a model's response" (the Challenger's prompt, Fig. 6), and a task counts as solved "only when every rubric passes" (§3.2). [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)") §1 likens a set of unit tests to "a set of text-based rubric criteria".

**Learn more:** [From Context to Skills](#/papers/si2026ctx2skill "From Context to Skills: Can Language Models Learn from Context Skillfully? (2026)") ([PDF p. 32](https://arxiv.org/pdf/2604.27660#page=32)) Fig. 6 (PDF p. 32) and §3.2 (PDF p. 4); [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)") ([PDF p. 2](https://arxiv.org/pdf/2604.07666#page=2)) §1 (PDF p. 2).

**Related:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [reference-free evaluation](#/glossary/reference-free-evaluation), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr)


<a id="rule-of-three"></a>

## Rule of three

When n independent trials show zero failures, about 3/n is a one-sided 95% upper confidence bound on the true failure rate: zero failures in 40 trials is consistent with a true rate near 7.5%. The 3 comes from solving (1 − p)ⁿ = 0.05, which gives p ≈ −ln(0.05)/n ≈ 3/n (general derivation). It replaces intervals that collapse on an all-zero sample: [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") notes that a bootstrap over such a sample returns [0.0, 0.0], "which reads as certainty and is not" (§3).

**Learn more:** [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") §3, "Zero-event rates and determinism", which uses it for every rate of exactly 0% or 100% without deriving it. The derivation is not taken from a source on this site (general definition).

**Related:** [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval), [bootstrap resampling](#/glossary/bootstrap-resampling)


<a id="letter-s"></a>

<a id="safety-datalog-rules"></a>

## Safety (Datalog rules)

A condition that keeps a Datalog rule's answers finite and determined by the database: every variable in the rule's head, in a negated atom, or in a comparison must also occur in a positive atom of its body. [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") states it this way (App. A, PDF p. 14). Without it, `Q(x) ← not R(x)` would ask for every value not in R (general definition). [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") §1 (PDF p. 1) gives the complexity of equivalence for conjunctive queries "with safe negation".

**Learn more:** [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") ([PDF p. 14](https://arxiv.org/pdf/2609.37233#page=14)) App. A (PDF p. 14); [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") ([PDF p. 1](https://arxiv.org/pdf/1607.04822#page=1)) §1 (PDF p. 1).

**Related:** [Datalog](#/glossary/datalog), [stratified negation](#/glossary/stratified-negation), [negation as failure](#/glossary/negation-as-failure)


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


<a id="satisficing-planning"></a>

## Satisficing planning

Planning that accepts any valid plan, not necessarily a shortest or cheapest one; an optimal planner must also prove that no better plan exists, which is usually much slower (general definition). [On the Generalization Gap in LLM Planning](#/papers/belcamino2026generalizationgap "On the Generalization Gap in LLM Planning: Tests and Verifier-Reward RL (2026)") takes its reference plans from "the satisficing planner Probe" (§3) and compares models' plans with them (§4.2), so a reference plan need not be the shortest.

**Learn more:** [On the Generalization Gap in LLM Planning](#/papers/belcamino2026generalizationgap "On the Generalization Gap in LLM Planning: Tests and Verifier-Reward RL (2026)") §3 and §4.2, which use it without defining it (general definition).

**Related:** [classical planning (STRIPS and PDDL)](#/glossary/classical-planning-strips-and-pddl), [grounding and lifted planning](#/glossary/grounding-and-lifted-planning), [best-first search](#/glossary/best-first-search)


<a id="scalable-oversight"></a>

## Scalable oversight

The problem of supervising AI systems whose outputs people can't reliably check, because the tasks are beyond them or the systems may outperform them (general definition). [The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)") gives it as "how to give a good reward signal to a model when it is difficult to assess if its outputs are correct" (§1, citing Amodei et al., 2016), and [Easy-to-Hard Generalization](#/papers/sun2024easytohard "Easy-to-Hard Generalization: Scalable Alignment Beyond Human Supervision (2024)") as supervising AI systems "that can potentially outperform humans in most skills" (§1, citing Bowman et al., 2022). Training on easy items people can label and testing on hard ones is one way to study it.

**Learn more:** [The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)") §1–§2; [Easy-to-Hard Generalization](#/papers/sun2024easytohard "Easy-to-Hard Generalization: Scalable Alignment Beyond Human Supervision (2024)") §1, §2.1. Neither cited source is on this site.

**Related:** [weak-to-strong supervision](#/glossary/weak-to-strong-supervision), [monitor (AI control)](#/glossary/monitor-ai-control), [reward model](#/glossary/reward-model)


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


<a id="schema-mapping"></a>

## Schema mapping

A declarative statement of how data in one database schema correspond to data in another, usually as rules from patterns over the source to facts over the target, which can be used to translate a database from one schema to the other (general definition). [Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") adapts the idea to translate a graph database into an equivalent relational one, and says its rule language "generalizes the standard concept of schema mapping" (§4.1; also §1–2), citing the Clio papers (not listed here).

**Learn more:** [Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §1, §2 and §4.1, which use it without defining it (general definition).

**Related:** [property graph](#/glossary/property-graph), [chase](#/glossary/chase), [integrity constraint](#/glossary/integrity-constraint), [query equivalence](#/glossary/query-equivalence)


<a id="search-annotation"></a>

## Search annotation

An instruction in a constraint model that tells the solver how to search: which variable to decide next and which of its values to try first (general definition). It changes how fast a solver finds a solution, not which solutions exist. [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §3.1 names "explicit search annotations (e.g. `int_search` in MiniZinc, `AddDecisionStrategy` in CP-SAT)" among the efficiency techniques its prompt suggests, and App. B.4–B.5 reports how often LLM-written solvers added them and how their correctness changed.

**Learn more:** [Formalize, Don't Optimize](#/papers/wang2026heuristictrap "Formalize, Don't Optimize: The Heuristic Trap in LLM-Generated Combinatorial Solvers (2026)") §3.1 and App. B.4–B.5, which use it without defining it (general definition).

**Related:** [constraint propagation](#/glossary/constraint-propagation), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem), [query hint](#/glossary/query-hint)


<a id="select-project-join-spj-query"></a>

## Select-project-join (SPJ) query

A query built only from selections (filters on rows), projections (keeping some columns) and joins: in SQL, a single `SELECT … FROM … WHERE` block without grouping, aggregates, `UNION` or subqueries (general definition). With only equality conditions it is what database theory calls a [conjunctive query](#/glossary/conjunctive-query). Balsa "currently optimizes select-project-join (SPJ) blocks", in line with the classical treatment (System R) of "decomposing a query into simple SPJ blocks and optimizing them block-by-block" ([Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") §2). DSB adds single-block SPJ queries derived from its templates for evaluating techniques such as join ordering ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §4.5).

**Learn more:** [Balsa](#/papers/yang2022balsa "Balsa: Learning a Query Optimizer Without Expert Demonstrations (2022)") ([PDF p. 3](https://arxiv.org/pdf/2201.01441#page=3)) §2 (PDF p. 3); [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §4.5 (PDF p. 5) and §2 (PDF p. 2). Neither defines the term (general definition).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [tableau](#/glossary/tableau), [relational algebra](#/glossary/relational-algebra), [left-deep and bushy plans](#/glossary/left-deep-and-bushy-plans), [query optimizer](#/glossary/query-optimizer)


<a id="selective-prediction"></a>

## Selective prediction

Letting a model abstain on the inputs it is least sure of and measuring its error only on the rest. [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") abstains when the reward model's score of the selected answer falls below a threshold, and reports a final-answer error of 2.7% when the model may abstain on 30% of questions (§3.4, §1).

**Learn more:** [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)") ([PDF p. 10](https://arxiv.org/pdf/2211.14275#page=10)) §3.4 (PDF p. 10).

**Related:** [reward model](#/glossary/reward-model), [best-of-N sampling](#/glossary/best-of-n-sampling), [learning to defer](#/glossary/learning-to-defer), [conformal prediction and conformal risk control](#/glossary/conformal-prediction-and-conformal-risk-control)


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

Weighted voting is the same, "but weights each solution according to its RM score", a [reward model](#/glossary/reward-model)'s ([Easy-to-Hard Generalization](#/papers/sun2024easytohard "Easy-to-Hard Generalization: Scalable Alignment Beyond Human Supervision (2024)") §3.4, citing [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)")).

**Learn more:** [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") ([PDF p. 3](https://arxiv.org/pdf/2203.11171#page=3)) §2 (PDF pp. 3–4), which introduces it as a decoding strategy that takes "a majority vote" over the sampled answers; [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") ([PDF p. 10](https://arxiv.org/pdf/2603.20004#page=10)) §5.2 (PDF p. 10); weighted voting: [Easy-to-Hard Generalization](#/papers/sun2024easytohard "Easy-to-Hard Generalization: Scalable Alignment Beyond Human Supervision (2024)") §3.4.

**Related:** [pass@k](#/glossary/passk), [execution accuracy](#/glossary/execution-accuracy), [best-of-N sampling](#/glossary/best-of-n-sampling)


<a id="self-correction"></a>

## Self-correction

Having an LLM revise its own output, usually after feedback such as an error message, an execution result or its own critique, in one or more rounds. In text-to-SQL, [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") names self-correction and self-consistency as "the most prevalent" [test-time scaling](#/glossary/test-time-scaling) strategies (§1).

**Learn more:** [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)") §1, which uses the term without defining it (general definition).

**Related:** [test-time scaling](#/glossary/test-time-scaling), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [automated program repair](#/glossary/automated-program-repair), [reflective prompt optimization](#/glossary/reflective-prompt-optimization)


<a id="self-distillation"></a>

## Self-distillation

[Distillation](#/glossary/distillation) in which the teacher is the model itself, under different inputs or at an earlier stage, instead of a stronger model. [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") §3.2: SDFT "is self-distillation under a forward-KL loss against soft targets from a teacher; in the original work the teacher is the model itself on demonstration-conditioned inputs". In its sequential version the teacher is the previous stage's model, which pulls the student "toward its own previous-stage distribution".

**Learn more:** [When Does Continual Learning Require Learning](#/papers/harrington2026continual "When Does Continual Learning Require Learning (2026)") §3.2. The SDFT paper (Shenfeld et al.) is not listed here.

**Related:** [distillation](#/glossary/distillation), [catastrophic forgetting](#/glossary/catastrophic-forgetting), [backward and forward transfer (BWT and FWT)](#/glossary/backward-and-forward-transfer-bwt-and-fwt), [KL divergence](#/glossary/kl-divergence)


<a id="self-evolving-agent"></a>

## Self-evolving agent

An LLM agent that improves itself from its own runs instead of keeping a fixed, hand-designed workflow. The improvement can go into its code or prompts, its designs, or programs evolved against an automatic evaluator ([Self-Modifying Lean Proof Agents](#/papers/li2026selfmodifying "Self-Modifying Lean Proof Agents with Verifier-Grounded Benchmark Coevolution (2026)") §2), or into memory and a library of skills distilled from past tasks ([SkillSandbox](#/papers/kim2026skillsandbox "SkillSandbox: Skill Verification via Dynamic Scenario Synthesis (2026)") abstract and §1, [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") §1). The Darwin Gödel Machine, for example, keeps an archive of coding agents that rewrite their own code and picks which to modify next by their benchmark scores ([Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") §1, §3).

**Learn more:** [Self-Modifying Lean Proof Agents](#/papers/li2026selfmodifying "Self-Modifying Lean Proof Agents with Verifier-Grounded Benchmark Coevolution (2026)") §2 ("Self-evolving agents"), citing two surveys not listed here; [SkillSandbox](#/papers/kim2026skillsandbox "SkillSandbox: Skill Verification via Dynamic Scenario Synthesis (2026)") abstract and §1; [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") §1; [Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)") §1 and §3.

**Related:** [recursive self-improvement (RSI)](#/glossary/recursive-self-improvement-rsi), [Gödel machine](#/glossary/gödel-machine), [open-endedness](#/glossary/open-endedness), [evolutionary search](#/glossary/evolutionary-search), [agent harness](#/glossary/agent-harness), [adaptive data analysis](#/glossary/adaptive-data-analysis)


<a id="self-information"></a>

## Self-information

How surprising an outcome is under a probability model: an outcome with probability p carries −log p of information, so a rare outcome carries much and a near-certain one almost none (general definition). Prompt compressors use a language model's token probabilities this way. Selective Context, as [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") describes it, computes each token's self-information from next-token probabilities, averages it over phrases or sentences, and filters out the least informative ones (§4.2.1).

**Learn more:** [Efficient Prompting Methods for…](#/papers/chang2024promptsurvey "Efficient Prompting Methods for Large Language Models: A Survey (2024)") ([PDF p. 19](https://arxiv.org/pdf/2404.01077#page=19)) §4.2.1 (PDF p. 19), citing Shannon 1948 (not listed here), without defining it (general definition).

**Related:** [perplexity](#/glossary/perplexity), [KL divergence](#/glossary/kl-divergence), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl), [Shannon entropy](#/glossary/shannon-entropy)


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


<a id="separation-logic"></a>

## Separation logic

A logic for proving programs correct whose central idea, in [Harnessing Code Agents for…](#/papers/kan2026aria "Harnessing Code Agents for Automatic Software Verification (2026)")'s words, is "reasoning about disjoint regions of memory independently", which "makes verification of pointer-heavy code tractable" (§II, PDF p. 3). A proof about one region of memory then needs no reasoning about code that touches only other regions (general definition). Iris, a Coq library built on it, extends it to "concurrency, higher-order functions, and the fine-grained sharing of mutable memory" (§II, PDF p. 3); its proofs also use [ghost resources](#/glossary/ghost-resources) (§I).

**Learn more:** [Harnessing Code Agents for…](#/papers/kan2026aria "Harnessing Code Agents for Automatic Software Verification (2026)") ([PDF p. 3](https://arxiv.org/pdf/2607.06341#page=3)) §II (PDF p. 3), citing O'Hearn, Reynolds and Yang (2001), not listed here.

**Related:** [Hoare triple](#/glossary/hoare-triple), [proof assistant](#/glossary/proof-assistant), [ghost resources](#/glossary/ghost-resources)


<a id="sequential-probability-ratio-test-sprt"></a>

## Sequential probability ratio test (SPRT)

A test that looks at observations one at a time and stops as soon as the evidence is strong enough: it tracks the ratio of the data's probability under the two hypotheses and stops when the ratio crosses an upper or a lower threshold. Among tests with the same error rates it needs the fewest observations on average (Wald; general definition). [Solving a Million-Step LLM…](#/papers/meyerson2025maker "Solving a Million-Step LLM Task with Zero Errors (2025)") draws answers for a step "until one has been sampled k times more than any other" (first-to-ahead-by-k voting), "motivated by the optimality of such an approach in the sequential probability ratio test (SPRT)", and analyses it as a generalization of the gambler's ruin problem, the classic question of how likely a random walk is to reach one boundary before another (§3.2).

**Learn more:** [Solving a Million-Step LLM…](#/papers/meyerson2025maker "Solving a Million-Step LLM Task with Zero Errors (2025)") §3.2, which cites Wald's book, not listed here (general definition).

**Related:** [E-process (testing by betting)](#/glossary/e-process-testing-by-betting), [confidence sequence (anytime-valid inference)](#/glossary/confidence-sequence-anytime-valid-inference), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


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


<a id="severe-test"></a>

## Severe test

A test that a claim "would probably have failed were it false". In the error-statistical view of Mayo and Spanos that [Selection Without Signal, Recovery…](#/papers/iscan2026falsification "Selection Without Signal, Recovery Through Expression: A Measurement Study of Post-Hoc Falsification Operators for Frozen Small Code Models (2026)") cites, "a claim is corroborated only to the extent that it has passed" such a test (§1). Passing a test that the claim would have passed even if false is no evidence for it.

**Learn more:** [Selection Without Signal, Recovery…](#/papers/iscan2026falsification "Selection Without Signal, Recovery Through Expression: A Measurement Study of Post-Hoc Falsification Operators for Frozen Small Code Models (2026)") §1, citing Mayo and Spanos (2006), not listed here.

**Related:** [test oracle](#/glossary/test-oracle), [statistical power](#/glossary/statistical-power), [mutation testing](#/glossary/mutation-testing), [certificate](#/glossary/certificate)


<a id="shannon-entropy"></a>

## Shannon entropy

The average surprise of a random outcome: H = −Σ p(x) log p(x), the expected [self-information](#/glossary/self-information). It is 0 when the outcome is certain and largest when all outcomes are equally likely (general definition). [Self-Play Only Evolves When…](#/papers/liu2026infogain "Self-Play Only Evolves When Self-Synthetic Pipeline Ensures Learnable Information Gain (2026)") §2.2 says it "characterises the total uncertainty of a distribution" and "does not distinguish reusable structure from randomness".

**Learn more:** [Self-Play Only Evolves When…](#/papers/liu2026infogain "Self-Play Only Evolves When Self-Synthetic Pipeline Ensures Learnable Information Gain (2026)") §2.2, citing Shannon (1948), not listed here (general definition).

**Related:** [self-information](#/glossary/self-information), [KL divergence](#/glossary/kl-divergence), [mutual information](#/glossary/mutual-information), [policy entropy](#/glossary/policy-entropy), [minimum description length (MDL)](#/glossary/minimum-description-length-mdl)


<a id="shap"></a>

## SHAP

A way to explain one prediction of a model by giving each input feature a share of it, based on Shapley values from game theory: a feature's share is its average contribution to the prediction over all orders in which features could be added (general definition). The shares add up to the difference between the prediction and the average prediction. [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") trains a classifier on its results, asks "What predicts failure?", and reports each feature's mean absolute SHAP value as a share of the total (§3.3, App. G), citing Lundberg and Lee (2017, not listed here).

**Learn more:** [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") §3.3 and App. G, which use it without defining Shapley values (general definition).

**Related:** [linear probe](#/glossary/linear-probe), [identifiability](#/glossary/identifiability)


<a id="shrinkage"></a>

## Shrinkage

Pulling noisy individual estimates part way toward a common value, such as a prior mean or the average of all estimates, more strongly the noisier they are. It trades a little bias for less error, and it undoes the upward bias of picking the top estimate (the [winner's curse](#/glossary/winners-curse-optimizers-curse)). In [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)")'s normal models the adjusted estimate is a weighted average of the estimate and the prior mean, with weight 1/(1 + variance ratio) on the estimate (§3.2, Eq. 6a, PDF p. 7).

Example: [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") shrinks each accepted change's measured advantage by its loop's own estimate of how much of the spread between candidates is real, and reports that this "largely removes the average bias" (§6).

**Learn more:** [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") §3.2 (PDF p. 7); [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") §5.1 and §6.

**Related:** [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior), [hierarchical model](#/glossary/hierarchical-model), [regression to the mean](#/glossary/regression-to-the-mean)


<a id="letter-š"></a>

<a id="šidák-correction"></a>

## Šidák correction

A correction for [multiple testing](#/glossary/multiple-testing). To keep the chance of any false alarm among m tests (the familywise error rate) at α, test each at level 1 − (1 − α)^(1/m); equivalently, adjust the smallest p-value p to 1 − (1 − p)^m. The guarantee is exact when the m p-values are independent and uniformly distributed under the null. The threshold is slightly less strict than [Bonferroni](#/glossary/bonferroni-correction)'s α/m, which holds under any dependence (general definition). [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") fuses six p-values this way. Under independent uniform p-values the chance that the smallest is at most u is 1 − (1 − u)^m, so "flagging at τ costs family-wise error exactly 1−τ" (§3.2, Eq. 2). The same section says its statistics "are not independent", so Eq. 2 is "a design principle" there, and App. H gives a Bonferroni fallback. [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") (unchecked) uses Šidák's count as the reference point at the independence boundary of its sensitivity curve (§3).

**Learn more:** [HackProbe](#/papers/yang2026hackprobe "Harness-agnostic detection and immunization of reward hacking in self-evolving language models (2026)") ([PDF p. 5](https://arxiv.org/pdf/2609.04665#page=5)) §3.2, Eq. 2 (PDF p. 5) and App. H (PDF p. 18), citing Šidák (1967), which is not listed here; [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") ([PDF p. 4](https://arxiv.org/pdf/2609.28177#page=4)) (unchecked) §3 (PDF p. 4). Neither states the per-test level (general definition).

**Related:** [Bonferroni correction](#/glossary/bonferroni-correction), [multiple testing](#/glossary/multiple-testing), [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr), [union bound](#/glossary/union-bound)


<a id="letter-s"></a>

<a id="sign-test"></a>

## Sign test

A test of whether one system beats another more often than chance, using only the cases where they disagree: if neither is better, each wins half of those, so the number of wins follows a binomial distribution with p = ½. It makes no assumption about the size of score differences.

**Learn more:** [Skill Issue](#/papers/kozyrev2026skillissue "Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents (2026)") §4.2; [Which Self-Improvements Should We…](#/papers/sun2026reuse "Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks (2026)") §2.2 and Eq. 3, an exact one-sided paired sign test used as an acceptance gate.

**Related:** [McNemar's exact test](#/glossary/mcnemars-exact-test), [multiple testing](#/glossary/multiple-testing), [statistical power](#/glossary/statistical-power), [binomial test](#/glossary/binomial-test), [permutation test](#/glossary/permutation-test)


<a id="silhouette-score"></a>

## Silhouette score

A measure of how well items fit their clusters: for each item, a is its mean distance to the other items in its cluster and b its mean distance to the items of the nearest other cluster; its silhouette is (b − a) / max(a, b), from −1 (misplaced) to 1 (well placed), and the score averages it over items (Rousseeuw 1987, not listed here; general definition). Plotted against the number of clusters, it helps choose that number. [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") picks its cluster count at the [knee](#/glossary/knee-point-kneedle) of the silhouette curve (§3.3; App. B).

**Learn more:** [SkillGLoW (Global–Local Weave)](#/papers/yan2026skillglow "SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams (2026)") §3.3 and App. B, which use it without defining it (general definition).

**Related:** [knee point (Kneedle)](#/glossary/knee-point-kneedle), [consensus clustering](#/glossary/consensus-clustering), [agglomerative clustering](#/glossary/agglomerative-clustering)


<a id="slepians-inequality"></a>

## Slepian's inequality

A comparison result for Gaussian (normally distributed) random vectors. Suppose two such vectors have the same means and the same variances, and every pairwise covariance of the first is at least the matching covariance of the second. Then for every threshold m, the chance that all of the first vector's entries stay at or below m is at least that chance for the second. In words, more strongly correlated values are less likely to produce one large maximum (general definition). [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") (unchecked) applies it under exactly these conditions, "(equal means, equal variances, Cov(D′_u, D′_v) ≥ Cov(D_u, D_v) entrywise)" (App. B.2), to prove its Lemma 2 (§3). The lemma says that the least-favorable tail does not grow as the siblings' correlation grows; that tail is the chance, under the paper's null, that the best of k sibling variants beats the comparator by a given margin.

**Learn more:** [How Sensitive Are LLM…](#/papers/yang2026leaderboard "How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection? (2026)") ([PDF p. 12](https://arxiv.org/pdf/2609.28177#page=12)) (unchecked) App. B.2 (PDF p. 12, proof of Lemma 2) and §3 (PDF p. 4). They use the inequality without stating it in general (general definition). Slepian's paper is not listed here.

**Related:** [multiple testing](#/glossary/multiple-testing), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [Šidák correction](#/glossary/šidák-correction) (proposed below)


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


<a id="smiles"></a>

## SMILES

A one-line text notation for a molecule (Simplified Molecular Input Line Entry System), which writes atoms, bonds, branches and rings as characters, such as CCO for ethanol (general definition). [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") §2 calls it a "1-D unambiguous representation of a molecule". One molecule can be written as several valid strings, so generated molecules are compared after canonicalization, rewriting each into one standard string (§6 "Baselines"; App. D).

**Learn more:** [RTRL (Round-Trip Reinforcement Learning)](#/papers/kong2025rtrl "Round-trip Reinforcement Learning: Self-Consistent Training for Better Chemical LLMs (2026)") §2, §6 and App. D.

**Related:** [molecular fingerprint and Tanimoto similarity](#/glossary/molecular-fingerprint-and-tanimoto-similarity), [reaction prediction and retrosynthesis](#/glossary/reaction-prediction-and-retrosynthesis), [exact match](#/glossary/exact-match)


<a id="soft-delete"></a>

## Soft delete

Marking a database row as deleted, for example with a flag or a deletion-time column, instead of removing it: the row stays, and every query must filter it out (general definition). In [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") a mid-stream schema change "adds soft deletes" (§4; App. B.1), one of the changes that stale agent memories must survive; [DAEDALUS](#/papers/edy2026daedalus "DAEDALUS: Bootstrapping Agent Memory from Self-Generated Tasks (2026)") App. F.3 notes an app operation that "soft-deleted related records".

**Learn more:** [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") §4 and App. B.1; [DAEDALUS](#/papers/edy2026daedalus "DAEDALUS: Bootstrapping Agent Memory from Self-Generated Tasks (2026)") App. F.3. Neither defines it (general definition).

**Related:** [CRUD](#/glossary/crud)


<a id="soundness-and-completeness"></a>

## Soundness and completeness

A checker is sound if everything it accepts is truly correct, and complete if it accepts everything that is correct. For an equivalence checker, say which verdict is meant: a refuter is sound if every counterexample it returns is genuine; a prover is sound if every pair it calls equivalent is equivalent, and complete if it can prove every equivalent pair.

Example: a test suite used as a checker is unsound, since a wrong program can pass every test ([PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") App. F).

**Learn more:** [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") ([PDF p. 15](https://arxiv.org/pdf/2512.18160#page=15)) App. F (PDF p. 15). The challenge in this repo: [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness).

**Related:** [decidable and undecidable](#/glossary/decidable-and-undecidable), [spurious counterexample](#/glossary/spurious-counterexample), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation), [test oracle](#/glossary/test-oracle), [formal specification](#/glossary/formal-specification)


<a id="sparse-vector-algorithm"></a>

## Sparse vector algorithm

A tool of [differential privacy](#/glossary/differential-privacy) that takes a sequence of queries and, for each, attempts to determine only whether its value on the private data is above or below a fixed threshold ([Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") §4.1). Example: Thresholdout runs it, with a parameter c set to its budget B, on the gap between a query's holdout and training means; when the gap is above the threshold it releases the holdout mean with Laplace noise, and "Each time the difference is above threshold the 'overfitting' budget B is reduced by one. Once it is exhausted, Thresholdout stops answering queries" (§4.1).

**Learn more:** [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") §4.1, which describes it, citing Dwork and Roth's textbook (Algorithm 2), not listed here.

**Related:** [differential privacy](#/glossary/differential-privacy), [adaptive data analysis](#/glossary/adaptive-data-analysis)


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


<a id="sql-anti-pattern"></a>

## SQL anti-pattern

A way of writing SQL that works but is poor practice, one that "could cause performance and maintainability issues" ([SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §6.1); SQL linters such as SQLFluff and SQLCheck detect them. Example: `SELECT *`, which the paper says is discouraged in production because "it can lead to inefficiencies and cause schema changes to remain undetected" (§6.1).

**Learn more:** [SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §6.1, citing Karwin's *SQL Antipatterns* (2010), not listed here.

**Related:** [SQL dialect](#/glossary/sql-dialect), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)


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


<a id="stable-model-answer-set"></a>

## Stable model (answer set)

The meaning of a logic program with [negation as failure](#/glossary/negation-as-failure) in [answer set programming](#/glossary/answer-set-programming): a set of atoms that the program's rules justify exactly, once every `not p` is read against that same set; a program may have none, one or several (general definition). Solvers work on a ground program, one without variables, which a grounder makes by replacing each variable with values (general definition). [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") uses both terms without defining them: two programs are compared by their stable models (§1), and earlier verification tools "are limited to ground programs" (§1).

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §1, which uses the terms without defining them (general definition).

**Related:** [answer set programming](#/glossary/answer-set-programming), [negation as failure](#/glossary/negation-as-failure), [strong equivalence (logic programs)](#/glossary/strong-equivalence-logic-programs), [logic of here-and-there](#/glossary/logic-of-here-and-there), [Clark's completion and tight programs](#/glossary/clarks-completion-and-tight-programs)


<a id="standard-error"></a>

## Standard error

The typical error of an estimate such as an average: the standard deviation it would have across repeats of the experiment. For the mean of n independent values with standard deviation σ it is σ/√n, so four times the data halves it ([BudgetAPO](#/papers/liu2026budgetapo "How Should a Prompt Optimizer Spend a Tight Budget? BudgetAPO with Noise-Adaptive Evaluation (2026)") §3.1). Example: [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") computes that a model with 50% accuracy on HumanEval's 164 questions has an unpaired standard error of about 4% (§3.1, Example 2).

**Learn more:** [BudgetAPO](#/papers/liu2026budgetapo "How Should a Prompt Optimizer Spend a Tight Budget? BudgetAPO with Noise-Adaptive Evaluation (2026)") §3.1; [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §3.1 and §4.1.

**Related:** [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt), [z-score](#/glossary/z-score), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [bootstrap resampling](#/glossary/bootstrap-resampling), [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap), [law of total variance](#/glossary/law-of-total-variance)


<a id="star-and-snowflake-schemas"></a>

## Star and snowflake schemas

Layouts for a data warehouse. A large fact table records events, such as one row per sale, with foreign keys into smaller dimension tables that describe them (product, store, customer, date). In a star schema each dimension is a single table joined directly to the fact table; in a snowflake schema dimension tables are split further into tables that point to other tables, such as a product table pointing to a category table (general definition). TPC-DS, on which DSB builds, "consists of multiple snowflake schemas with shared dimension tables" ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §2).

**Learn more:** [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)") §2 (PDF p. 2) and §3 (PDF p. 4), whose correlation algorithm for a fact table and two dimension tables "can be further extended" to "a fact table and chains of dimension tables with PKFK joins, i.e., snowflake queries"; neither defines the terms (general definition).

**Related:** [primary key-foreign key join](#/glossary/primary-key-foreign-key-join), [OLAP and OLTP](#/glossary/olap-and-oltp), [normalized schema](#/glossary/normalized-schema)


<a id="static-analysis"></a>

## Static analysis

Analysing a program's code to find properties or bugs without running it, as opposed to testing, which runs it. [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") §1: "Static analysis, a technique to analyze programs without executing them, is a common way of detecting vulnerabilities"; its tools, such as CodeQL, run queries that "encode vulnerable code patterns" (abstract).

**Learn more:** [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") ([PDF p. 1](https://arxiv.org/pdf/2511.08462#page=1)) §1 (PDF p. 1) and abstract.

**Related:** [symbolic execution](#/glossary/symbolic-execution), [abstract interpretation](#/glossary/abstract-interpretation), [taint analysis](#/glossary/taint-analysis)


<a id="static-type-checking-static-typing"></a>

## Static type checking (static typing)

Checking the types of a program or query from its text alone, before running it, so that type errors are reported early instead of during execution (general definition). [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)"): "Static type analysis infers the output type of an expression based on the type of its input expressions", and "static typing allows early detection of type errors" (§1). In TRAF's model of SQL, a query the typechecker rejects stops with "a static type error" before evaluation ([TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") PDF p. 3).

**Learn more:** [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)") (unchecked) §1; [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") (PDF p. 3).

**Related:** [type safety and type soundness](#/glossary/type-safety-and-type-soundness), [formal semantics](#/glossary/formal-semantics)


<a id="statistical-power"></a>

## Statistical power

The chance that a test detects an effect of a given size when the effect is really there. It grows with sample size. An underpowered test can miss real effects, so a null result from it says little. A power analysis fixes the sample size, or the smallest detectable effect, in advance.

**Learn more:** [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)") §4.7, which gives a minimum detectable slope at 80% power.

**Related:** [multiple testing](#/glossary/multiple-testing), [equivalence test (TOST)](#/glossary/equivalence-test-tost), [sign test](#/glossary/sign-test)


<a id="step-level-and-whole-proof-provers"></a>

## Step-level and whole-proof provers

Two ways an LLM writes a formal proof. In [Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)")'s description, "Step-level provers incrementally generate Lean code line-by-line", which "enables close interaction with the Lean environment" but "requires special scaffolding to generate a complete Lean proof"; "whole-proof models generate an entire Lean proof at once, but typically lack interaction with the Lean compiler" (§1). [Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)") uses LLMs "to generate whole proofs for theorems at once, rather than one step at a time", contrasting this with models that predict one proof step at a time and search through the space of possible proofs (abstract), on Isabelle/HOL theorems.

**Learn more:** [Seed-Prover](#/papers/chen2025seedprover "Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving (2025)") §1; [Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)") abstract and §1.

**Related:** [proof assistant](#/glossary/proof-assistant), [tactic](#/glossary/tactic)


<a id="stochastic-dominance"></a>

## Stochastic dominance

A random score X stochastically dominates another, Y, if X is at least as likely as Y to exceed every threshold τ and strictly more likely for some τ: P(X > τ) ≥ P(Y > τ) for all τ ([Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)") §4.3, footnote). On a performance profile, a plot of the share of runs or tasks that reach each threshold, which [Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)") proposes for RL benchmarks (§4.2), the dominating method's curve lies on or above the other's everywhere. The authors note that with many tasks such curves often cross, so stochastic dominance "is rarely observed" (§4.3).

**Learn more:** [Deep Reinforcement Learning at…](#/papers/agarwal2021rliable "Deep Reinforcement Learning at the Edge of the Statistical Precipice (2021)") §4.2 and §4.3.

**Related:** [interquartile mean (IQM)](#/glossary/interquartile-mean-iqm), [Pareto front](#/glossary/pareto-front), [Mann-Whitney U test](#/glossary/mann-whitney-u-test)


<a id="stored-procedure-and-trigger"></a>

## Stored procedure and trigger

A stored procedure is a named program kept in the database and run by calling it. It is written in the system's procedural SQL language (Oracle's PL/SQL, SQL Server's T-SQL, PostgreSQL's PL/pgSQL), which wraps SQL statements in variables, `IF`/`WHILE`/`FOR` control flow and exception handling. A trigger is such code that the database runs by itself when a given event happens, such as an `INSERT` into a table. Both can change the stored data (side effects), so checking a translated version means comparing database states, not only query results.

Example: the SQLProcBench procedures that RISE translates "exhibit complex control flows (e.g., IF-ELSE conditions, WHILE and FOR loops), individual SQL statements (e.g., SELECT, UPDATE, DELETE), variable management" ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") §2.1.1). AgentMigrate's author calls procedural code ("stored procedures, functions, triggers, and packages that embed business logic, transaction semantics, and exception handling") "the hard part" of database migration ([AgentMigrate](#/papers/yu2026agentmigrate "Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation (2026)") §1). Horizon's execution-based checks cover queries, views and functions but leave procedures and triggers out, because verifying them through execution "is tricky as they can have side effects like updating the database state" ([Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §2.2).

**Learn more:** [AgentMigrate](#/papers/yu2026agentmigrate "Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation (2026)") §1 (PDF p. 1); [RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") ([PDF p. 2](https://arxiv.org/pdf/2601.05579#page=2)) §2.1.1 (PDF p. 2); [Horizon](#/papers/emani2025horizon "Horizon: Robust Checks for SQL Migration Using LLMs (2025)") §2.2 (PDF p. 3).

**Related:** [SQL dialect](#/glossary/sql-dialect), [test oracle](#/glossary/test-oracle)


<a id="stratified-negation"></a>

## Stratified negation

A restriction that gives Datalog programs with negation a clear meaning: no cycle of rules may pass through a negated atom, so the program splits into layers (strata) and every negated predicate is fully computed in a lower layer before a higher one uses it. [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") states it as "no cycle in the dependency graph passes through a negated literal, so every negated predicate is fully computed before it is used" (§3, PDF p. 3); its engine, Soufflé, rejects programs that break it.

**Learn more:** [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") ([PDF p. 3](https://arxiv.org/pdf/2609.37233#page=3)) §3 (PDF p. 3) and §4.2.

**Related:** [Datalog](#/glossary/datalog), [negation as failure](#/glossary/negation-as-failure), [least fixed point](#/glossary/least-fixed-point), [stable model (answer set)](#/glossary/stable-model-answer-set)


<a id="streaming-sketch-hyperloglog-and-count-min"></a>

## Streaming sketch (HyperLogLog and Count-Min)

A fixed-size summary of a stream of items from which certain questions can be answered approximately, however long the stream (general definition). HyperLogLog (HLL) estimates the number of distinct items: it keeps m registers, uses some bits of each item's hash to pick a register and the rest to compute a rank (one plus their number of leading zeros), and each register keeps the largest rank it has seen; two sketches merge by taking the larger value in each register, and the estimate's relative error is about 1.04/√m ([SketchOps](#/papers/song2026sketchops "Mergeable Model-Side Aggregation States for Long-Context Language Models (2026)") §2.3, §5.4, App. C.1). Count-Min estimates how often an item occurs: it keeps rows of counters with one hash per row, adds one to a counter in each row per occurrence, and reads an item's frequency as the smallest of its counters (App. D). [SketchOps](#/papers/song2026sketchops "Mergeable Model-Side Aggregation States for Long-Context Language Models (2026)") calls distinct counting "cardinality estimation" (§2.3), which is not the optimizer's [cardinality estimation](#/glossary/cardinality-estimation) of result sizes.

**Learn more:** [SketchOps](#/papers/song2026sketchops "Mergeable Model-Side Aggregation States for Long-Context Language Models (2026)") §2.3, §4.1, §5.4, App. C (HLL) and App. D (Count-Min). The original papers (Flajolet et al., 2007; Cormode and Muthukrishnan, 2004) are not listed here.

**Related:** [locality-sensitive hashing (MinHash)](#/glossary/locality-sensitive-hashing-minhash), [Jaccard similarity](#/glossary/jaccard-similarity), [idempotent operation](#/glossary/idempotent-operation), [cardinality estimation](#/glossary/cardinality-estimation)


<a id="strong-equivalence-logic-programs"></a>

## Strong equivalence (logic programs)

Two logic programs are equivalent when they have the same [stable models](#/glossary/stable-model-answer-set); they are strongly equivalent when they stay equivalent inside any larger program, so one can replace the other anywhere. [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §1: programs Π1 and Π2 "are called strongly equivalent if replacing Π1 by Π2 within any larger program does not affect its stable models" (citing Lifschitz, Pearce and Valverde 2001, not listed here). It is the logic-programming counterpart of [query equivalence](#/glossary/query-equivalence) under every context, and it is decided through the [logic of here-and-there](#/glossary/logic-of-here-and-there).

**Learn more:** [anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §1 and §3.2.1.

**Related:** [stable model (answer set)](#/glossary/stable-model-answer-set), [logic of here-and-there](#/glossary/logic-of-here-and-there), [program equivalence](#/glossary/program-equivalence), [answer set programming](#/glossary/answer-set-programming)


<a id="strongest-postcondition"></a>

## Strongest postcondition

For a precondition P and a program fragment S, the strongest postcondition describes exactly the states that S can end in when started from a state satisfying P. Every other valid postcondition follows from it, so the [Hoare triple](#/glossary/hoare-triple) {P} S {Q} holds exactly when it implies Q (general definition). Example: from x > 0, the assignment x := x + 1 ends in exactly the states with x > 1. Mediator defines strongest postconditions for database updates by treating each update as an assignment to a table; deleting the rows of R that satisfy φ, for instance, becomes R := σ_{¬φ}(R) ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") §6.1, Fig. 10).

**Learn more:** [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)") ([PDF p. 16](https://arxiv.org/pdf/1710.07660#page=16)) §6.1 and Fig. 10 (PDF p. 16), which uses the notion without defining it (general definition), whose rules for deletes and updates are unsound when the condition contains a subquery that reads the updated table.

**Related:** [Hoare triple](#/glossary/hoare-triple), [symbolic execution](#/glossary/symbolic-execution), [loop invariant](#/glossary/loop-invariant)


<a id="strongly-connected-component-scc"></a>

## Strongly connected component (SCC)

In a directed graph, a largest set of nodes in which every node can reach every other along the edges. Any directed graph splits into SCCs, and they can be found in linear time (Tarjan's algorithm; general definition). In an automaton a loop lives inside an SCC, so ambiguity checks look there: [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") analyzes the SCCs of product automata to find inputs with many accepting paths (§3.1, PDF p. 4).

**Learn more:** [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §3.1 (PDF p. 4), which uses it without defining it (general definition).

**Related:** [product automaton](#/glossary/product-automaton), [infinite ambiguity (of an automaton)](#/glossary/infinite-ambiguity-of-an-automaton), [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa)


<a id="structural-induction"></a>

## Structural induction

Proving a property for every object built by a grammar (every query, formula or program) by proving it for the smallest ones (base cases) and showing, for each way of building a larger object, that it holds whenever it holds for the parts (inductive cases) (general definition). Examples: [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") proves a lemma "by structural induction" on its sketches, with base cases for holes and concrete regular expressions and an inductive case per operator (App. A, PDF pp. 15–17); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") proves its translations between SQL and its algebra by "(mutual) structural induction over queries and formulae", carried out as induction on their sizes (§4.3, PDF p. 11).

**Learn more:** [Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") ([PDF p. 15](https://arxiv.org/pdf/1908.03316#page=15)) App. A (PDF pp. 15–17); [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)") §4.3 (PDF p. 11). Both use it without defining it (general definition).

**Related:** [k-induction](#/glossary/k-induction), [proof assistant](#/glossary/proof-assistant)


<a id="students-t-test-and-t-interval"></a>

## Student's t-test and t-interval

Tests and intervals for a mean when the standard deviation is estimated from a small sample: they use the t distribution, which has heavier tails than the normal and approaches it as the sample grows (general definition). A paired t-test applies this to the per-item differences between two systems (see [paired comparison](#/glossary/paired-comparison)); a one-sided test asks only whether the difference is positive. It assumes roughly normal differences, which is why [A Sober Look at…](#/papers/hochlehnert2025sober "A Sober Look at Progress in Language Model Reasoning: Pitfalls and Paths to Reproducibility (2025)") pairs it with the [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), "to ensure robustness to distributional assumptions" (§4.2).

Example: [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") reports run-level means "with 95% Student-t confidence intervals" (§4).

**Learn more:** [A Sober Look at…](#/papers/hochlehnert2025sober "A Sober Look at Progress in Language Model Reasoning: Pitfalls and Paths to Reproducibility (2025)") §4.2; [Grounding Agent Memory](#/papers/suresh2026grounding "Grounding Agent Memory: Environment-Probing Curation for Enterprise Agents (2026)") §4 and App. B.2. Neither defines it (general definition).

**Related:** [paired comparison](#/glossary/paired-comparison), [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test), [standard error](#/glossary/standard-error), [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt)


<a id="submodular-function"></a>

## Submodular function

A set function with diminishing returns: adding an item to a set gains at most as much as adding it to a smaller subset of that set, f(A ∪ {x}) − f(A) ≥ f(B ∪ {x}) − f(B) when A ⊆ B (general definition). For such functions that also never decrease, greedily adding the item with the largest gain gets within a factor 1 − 1/e of the best set of a given size (Nemhauser, Wolsey and Fisher 1978, not listed here). [VaG ("When Self-Evolution Backfires")](#/papers/shang2026vag "When Self-Evolution Backfires: Pre-Commit Gating against Skill Contamination in LLM Agents (2026)") argues that the value of an agent's set of skills shows "bounded submodularity": a further skill from a domain the set already covers adds less (§ "Methodology").

**Learn more:** [VaG ("When Self-Evolution Backfires")](#/papers/shang2026vag "When Self-Evolution Backfires: Pre-Commit Gating against Skill Contamination in LLM Agents (2026)") ([PDF p. 2](https://arxiv.org/pdf/2608.05810#page=2)) § "Related Work" (PDF p. 2) and § "Methodology" (PDF p. 5) (general definition).

**Related:** [set cover problem](#/glossary/set-cover-problem), [agent skill](#/glossary/agent-skill)


<a id="subpopulation-shift"></a>

## Subpopulation shift

A distribution shift in which the same groups (subpopulations) of inputs occur before and after the shift, but in different proportions. [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") alternates its agent's batches of experience between two mixtures of user intents in this way, "matching the subpopulation-shift setting of" Koh et al. (2021), "where the same subpopulations are observed across distributions but their relative frequencies differ" (§5.1, App. A).

**Learn more:** [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") §5.1 and App. A. The WILDS paper it cites (Koh et al. 2021) is not listed here.

**Related:** [dataset shift](#/glossary/dataset-shift), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [continual learning](#/glossary/continual-learning), [catastrophic forgetting](#/glossary/catastrophic-forgetting), [backward and forward transfer (BWT and FWT)](#/glossary/backward-and-forward-transfer-bwt-and-fwt)


<a id="subquery-nested-query"></a>

## Subquery (nested query)

A complete `SELECT` query used inside another query: in `WHERE` or `HAVING` (with `IN`, `EXISTS` or a comparison), in `FROM` as a derived table, or in the `SELECT` list (general definition). Example ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)") Fig. 1): "What are the name and budget of the departments with average instructor salary greater than the overall average?" needs one, `… GROUP BY T1.department_id HAVING avg(T1.salary) > (SELECT avg(salary) FROM instructor)`. Spider counts nested queries among the features that make a query hard (§6).

**Learn more:** [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)") ([PDF p. 1](https://arxiv.org/pdf/1809.08887#page=1)) Fig. 1 (PDF p. 1) and §6, which use the term without defining it (general definition).

**Related:** [correlated subquery](#/glossary/correlated-subquery), [scalar subquery](#/glossary/scalar-subquery), [LATERAL](#/glossary/lateral), [common table expression (CTE)](#/glossary/common-table-expression-cte), [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)


<a id="superkey-and-candidate-key"></a>

## Superkey and candidate key

A superkey of a table is a set of columns whose values determine all the other columns, so no two rows can agree on it; a candidate key is a minimal superkey, one with no column that can be dropped (general definition for "minimal"). [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)")'s prompts compute superkeys from [functional dependencies](#/glossary/functional-dependency): a set of columns is a superkey when its closure under them "contains every column of that relation" (App. J.4, PDF p. 37). A primary key is the candidate key chosen to identify rows.

**Learn more:** [Can LLMs Normalize Databases?…](#/papers/koh2026dnbench "Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization (2026)") ([PDF p. 37](https://arxiv.org/pdf/2609.11141#page=37)) (unchecked) App. J.4 (PDF p. 37) and §3.1.

**Related:** [functional dependency](#/glossary/functional-dependency), [normal forms (1NF, 2NF, 3NF, BCNF)](#/glossary/normal-forms-1nf-2nf-3nf-bcnf), [integrity constraint](#/glossary/integrity-constraint), [primary key-foreign key join](#/glossary/primary-key-foreign-key-join)


<a id="superoptimization"></a>

## Superoptimization

Searching for the best program equivalent to a given one, instead of improving it with fixed rewrite rules as a compiler does. [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") describes compiler superoptimization as finding "a semantically equivalent optimal code sequence through the exhaustive search" (§1); [EquiBench](#/papers/wei2025equibench "EquiBench: Benchmarking Large Language Models' Reasoning about Program Semantics via Equivalence Checking (2025)") says "A superoptimizer searches a space of programs to find one equivalent to the target. Test cases efficiently prune incorrect candidates, while formal verification guarantees the correctness of the optimized program", and uses one, Stoke, to make equivalent assembly pairs (§3.3).

Other senses: [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") uses "code superoptimization" more loosely, for a method that "iteratively improves an initial program using execution feedback", and traces the idea to the 1980s (§5); there a candidate is scored by an evaluation function the user supplies (§2.1).

**Learn more:** [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §1 (PDF p. 1); [EquiBench](#/papers/wei2025equibench "EquiBench: Benchmarking Large Language Models' Reasoning about Program Semantics via Equivalence Checking (2025)") ([PDF p. 5](https://arxiv.org/pdf/2502.12466#page=5)) §3.3 (PDF p. 5); [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") ([PDF p. 20](https://arxiv.org/pdf/2506.13131#page=20)) §5 (PDF p. 20). Massalin's 1987 paper, which [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") and [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") cite, is not listed here.

**Related:** [program equivalence](#/glossary/program-equivalence), [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [enumerative synthesis](#/glossary/enumerative-synthesis), [evolutionary search](#/glossary/evolutionary-search), [translation validation](#/glossary/translation-validation)


<a id="surrogate-loss-and-01-loss"></a>

## Surrogate loss and 0–1 loss

The 0–1 loss scores a prediction 1 when it is wrong and 0 when it is right, so its average over a dataset is the error rate. A surrogate loss is a stand-in that is easier to optimize or analyse, usually convex (cross-entropy, hinge, logistic). It is often chosen so that it is never below the 0–1 loss; a bound on the surrogate then also bounds the error rate (general definition). [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)") assumes this, "The 0–1 loss is upper-bounded by the surrogate loss" (§3.3, A5), which it says is needed to "translate guarantees on the differentiable training loss to the classification error". Its own surrogate is bounded between 0 and 1 (§3). Usage varies: [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") says its execution accuracy "is simply defined as the 0-1 loss" (§3.2), but its formula scores 1 for a correct answer, the opposite way round.

**Learn more:** [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)") ([PDF p. 3](https://arxiv.org/pdf/2505.19514#page=3)) §3 (PDF p. 3) and §3.3, A5 (PDF p. 6); [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") ([PDF p. 5](https://arxiv.org/pdf/2211.01910#page=5)) §3.2 (PDF p. 5). Neither defines the surrogate loss in general (general definition). A5 is an assumption of [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)")'s Theorem 3.1, whose proof has an open erratum; the definition does not rest on the theorem.

**Related:** [uniform convergence](#/glossary/uniform-convergence) (proposed below), [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm)


<a id="symbolic-equivalence"></a>

## Symbolic equivalence

Two algebraic expressions being equal for every value of their variables, such as (x + 1)² and x² + 2x + 1 (general definition). A computer algebra system can check it by simplifying the difference of the two to zero, though a simplifier that fails to reach zero doesn't prove they differ. [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") uses it as an exact check of a recovered expression: "sympy.simplify" of the difference equals 0 (§2.2).

**Learn more:** [The Communication Bottleneck](#/papers/suau2026bottleneck "The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models (2026)") §2.2, which uses it without defining it (general definition).

**Related:** [program equivalence](#/glossary/program-equivalence), [query equivalence](#/glossary/query-equivalence), [decidable and undecidable](#/glossary/decidable-and-undecidable)


<a id="symbolic-execution"></a>

## Symbolic execution

Running a program or query on unknowns instead of concrete values, so that the result is a formula over those unknowns. A solver can then look for values that make the formula true. Equivalence checkers use it on two queries over a symbolic database (tables of unknown rows, up to a size bound): a solution of "the two results differ" decodes into a [counterexample database](#/glossary/counterexample-database).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 3](https://arxiv.org/pdf/2403.03193#page=3)) §1 and Fig. 1 (PDF p. 3), whose symbolic database stands for every database up to a size bound; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 3](https://arxiv.org/pdf/2510.26840#page=3)) §2 (PDF p. 3), which describes VeriEQL's encoding of "the symbolic execution of the two SQL queries", and §4.1 (PDF p. 5), which states as a theorem that SpotIt's symbolic execution matches concrete execution.

**Related:** [bounded verification](#/glossary/bounded-verification), [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [counterexample database](#/glossary/counterexample-database), [concolic testing](#/glossary/concolic-testing)


<a id="symmetric-difference"></a>

## Symmetric difference

The elements in exactly one of two sets: A △ B = (A − B) ∪ (B − A). For two languages, it is the strings that one accepts and the other doesn't, so two languages are equal exactly when it is empty. In [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") an equivalence oracle answers a wrong hypothesis with counterexamples drawn from the symmetric difference of the hypothesis's language and the target's (§3, App. A).

**Learn more:** [Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §3 and App. A.

**Related:** [query learning (membership and equivalence queries)](#/glossary/query-learning-membership-and-equivalence-queries), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [Jaccard similarity](#/glossary/jaccard-similarity)


<a id="symmetry-breaking"></a>

## Symmetry breaking

In constraint solving, ruling out candidate solutions that are only rearrangements of others, so that the solver explores one representative of each group of equivalent candidates instead of all of them (general definition). Example (ours): if a query's result does not depend on the order of a table's rows, a solver looking for a three-row counterexample table need not try all six orderings of the same rows; requiring the rows to be sorted keeps one. [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") notes that the equivalence checkers Qex and Cosette include symmetry-breaking modules for compiling into SMT formulas, and breaks symmetry at a higher level instead, "by identifying table equivalence given the semantics of the input queries" (§7).

**Learn more:** [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") §7 (PDF p. 21), which uses the term without defining it (general definition).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [bounded verification](#/glossary/bounded-verification), [counterexample database](#/glossary/counterexample-database), [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem)


<a id="syntax-directed-translation"></a>

## Syntax-directed translation

Defining a translation from one language into another along the source language's grammar: each grammar rule gets a translation rule that builds the translation of a construct from the translations of its parts. [Formal semantics of SQL queries](#/papers/negri1991semantics "Formal semantics of SQL queries (1991)") gives SQL a formal meaning this way: each translation rule "defines that the translation TR⟨X⟩ of the nonterminal ⟨X⟩ on the LHS of the syntax rule is the concatenation of the translations TR⟨Y₁⟩ … TR⟨Yₙ⟩ with some additional E3VPC symbols interleaved", where E3VPC is the authors' extended three-valued predicate calculus (§3).

**Related:** [formal semantics](#/glossary/formal-semantics), [BNF (Backus-Naur form)](#/glossary/bnf-backus-naur-form), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)


<a id="syntax-guided-synthesis-sygus"></a>

## Syntax-guided synthesis (SyGuS)

A form of [program synthesis](#/glossary/program-synthesis) in which the problem gives "a logical specification for the desired functionality" and "a grammar of allowed implementations" ([Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1), over a background theory (such as integer arithmetic) that fixes the meaning of the grammar's symbols; a solution is an expression from the grammar that makes the specification valid for every input (Def. 1, §3.1). SyGuS solvers often use [counterexample-guided synthesis](#/glossary/counterexample-guided-inductive-synthesis-cegis), and a richer grammar can make them [overfit](#/glossary/overfitting) the examples ([Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1).

**Learn more:** [Overfitting in Synthesis](#/papers/padhi2019overfitting "Overfitting in Synthesis: Theory and Practice (2019)") §1 and §3.1 (Def. 1), which takes the definition from Alur et al. (2013, not listed here).

**Related:** [program synthesis](#/glossary/program-synthesis), [counterexample-guided inductive synthesis (CEGIS)](#/glossary/counterexample-guided-inductive-synthesis-cegis), [enumerative synthesis](#/glossary/enumerative-synthesis), [formal specification](#/glossary/formal-specification)


<a id="system-1-and-system-2"></a>

## System 1 and System 2

Kahneman's names for fast, automatic, intuitive thinking (System 1) and slow, deliberate, effortful reasoning (System 2) (general definition). LLM papers use them loosely: [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") pictures an LLM as "a pseudo System 1" (Fig. 1) and argues that LLMs are unlikely to have System 2 competencies by themselves but can be valuable resources in solving System 2 tasks (§1).

**Learn more:** [LLM-Modulo ("LLMs Can't Plan](#/papers/kambhampati2024llmmodulo "Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (2024)") §1 and Fig. 1, citing Kahneman (2011), not listed here (general definition).

**Related:** [neuro-symbolic AI](#/glossary/neuro-symbolic-ai), [test-time scaling](#/glossary/test-time-scaling)


<a id="systematization-of-knowledge-sok"></a>

## Systematization of knowledge (SoK)

A kind of survey paper, common at security venues, whose title starts "SoK:": it organizes the published work on one topic into a framework, to set out what is known and what is open (general definition). [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") presents itself as one, meant "to delineate the state of the art and identify opportunities for further research" (abstract), and follows the review method of an earlier SoK on fuzzing (§3).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") abstract, §1 and §3, which use the term without defining it (general definition).

**Related:** none.


<a id="letter-t"></a>

<a id="t-sne"></a>

## t-SNE

A method that draws high-dimensional vectors, such as embeddings, as a 2-D map in which points that are near neighbours in the original space stay near; distances between far-apart clusters on the map mean little (general definition). [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") uses it to show memory embeddings clustering by benchmark or mixing across benchmarks (§4.3.1, Fig. 4).

**Learn more:** [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)") §4.3.1, Fig. 4, which uses it without defining it (general definition).

**Related:** [principal component analysis (PCA)](#/glossary/principal-component-analysis-pca)


<a id="table-statistics-and-analyze"></a>

## Table statistics and ANALYZE

Stored summaries of a table's data, such as row counts, numbers of distinct values and per-column histograms, from which the [query optimizer](#/glossary/query-optimizer) makes its [cardinality estimates](#/glossary/cardinality-estimation); in PostgreSQL the `ANALYZE` command collects them (not to be confused with `EXPLAIN ANALYZE`, which runs a query and reports its plan: [query plan and EXPLAIN](#/glossary/query-plan-and-explain)), and they go stale when the data changes after the last collection (general definition). Example: in a [DBA-Bench](#/papers/chen2026dbabench "DBA-Bench: A Production-Fidelity Benchmark for LLM-Based Database Operations Agents (2026)") scenario, statistics are collected on "a 300K-row baseline", then 1.2M rows for one key are inserted with autovacuum disabled; the resulting cardinality error makes a long scan hold a lock, and the reference fix finds the "stale statistics, runs ANALYZE, and verifies recovery" (§4.3).

**Learn more:** [DBA-Bench](#/papers/chen2026dbabench "DBA-Bench: A Production-Fidelity Benchmark for LLM-Based Database Operations Agents (2026)") ([PDF p. 6](https://arxiv.org/pdf/2607.22165#page=6)) §4.3 (PDF pp. 6–7), which uses the term without defining it (general definition).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [query plan and EXPLAIN](#/glossary/query-plan-and-explain), [independence assumption](#/glossary/independence-assumption)


<a id="tableau"></a>

## Tableau

A table-shaped notation for a [select-project-join](#/glossary/select-project-join-spj-query) query. Its columns are the database's attributes; the top row, the summary, gives the output, and each other row is a pattern of constants, distinguished variables (which appear in the output) and nondistinguished ones (which don't). On a database it returns the summary under every assignment of constants to the variables that turns all the rows into stored tuples ([Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §2.4, PDF pp. 3–4). Tableaux are "a stylized notation for a subset of" [conjunctive queries](#/glossary/conjunctive-query) ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §1, PDF p. 1), and containment between them is tested with [homomorphisms or containment mappings](#/glossary/homomorphism-containment-mapping).

**Learn more:** [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §2.4 (PDF pp. 3–4); [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") §1–4 (PDF pp. 1–11).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping), [query containment](#/glossary/query-containment), [union of conjunctive queries](#/glossary/union-of-conjunctive-queries)


<a id="tabular-question-answering-tqa"></a>

## Tabular question answering (TQA)

Answering a natural-language question from a given table, using only what the table holds, scored by [exact match](#/glossary/exact-match) with the gold answer ([Externalising Reasoning by Teaching…](#/papers/gemmellgorriz2026externalising "Externalising Reasoning by Teaching Language Models to Use Programs as Tools (2026)") §6.2, PDF p. 88). Models typically read the table flattened into text beside the question (§6.2.2, PDF p. 89). Unlike [text-to-SQL](#/glossary/text-to-sql), no query is required, and cells that mix words and values make a purely programmatic answer difficult (§6.2.1, PDF p. 89).

**Learn more:** [Externalising Reasoning by Teaching…](#/papers/gemmellgorriz2026externalising "Externalising Reasoning by Teaching Language Models to Use Programs as Tools (2026)") §6.2 (PDF pp. 88–89).

**Related:** [exact match](#/glossary/exact-match), [text-to-SQL](#/glossary/text-to-sql), [semantic parsing](#/glossary/semantic-parsing), [lost in the middle](#/glossary/lost-in-the-middle)


<a id="tactic"></a>

## Tactic

A command in a proof assistant that turns the current proof goal into simpler subgoals, for example by splitting it, rewriting it with a known lemma, or starting an induction. A proof is a sequence of tactics applied until no goals remain, and the LeanDojo authors suggest thinking of tactics "as programs in a domain-specific language" (§3). They describe LLM-based provers as generating the next tactic from the current proof state (§1).

**Learn more:** [LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)") ([PDF p. 2](https://arxiv.org/pdf/2306.15626#page=2)) §1 (PDF pp. 2–3) and §3 (PDF pp. 4–5).

**Related:** [proof assistant](#/glossary/proof-assistant)


<a id="taint-analysis"></a>

## Taint analysis

A [static analysis](#/glossary/static-analysis) that follows how data flows through a program, looking for paths from a **source**, where untrusted data enters, to a **sink**, where it can do harm, that pass no **sanitizer** (code that cleans or checks the data). [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") §3.1: the goal of a query is "to find dataflow paths from a source (e.g., an API endpoint accepting user input) to a sink (e.g., a database write) that lack proper sanitization (e.g., filtering malicious data)" (PDF p. 5). An SQL injection is such a path: user input reaching a query string unescaped.

**Learn more:** [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") ([PDF p. 5](https://arxiv.org/pdf/2511.08462#page=5)) §3.1 (PDF p. 5). (The SQL-injection example is a general one, not the paper's.)

**Related:** [static analysis](#/glossary/static-analysis), [vulnerability records (CVE, NVD, CWE, CVSS, EPSS)](#/glossary/vulnerability-records-cve-nvd-cwe-cvss-epss), [program slicing](#/glossary/program-slicing)


<a id="teacher-forcing"></a>

## Teacher forcing

Running a model over a given text, feeding it the true previous tokens at each step instead of its own outputs, so that one forward pass gives the model's probability of every token of that text without generating anything (general definition). It is how language models are trained, and how a text's likelihood under a model is measured. [CaLIF](#/papers/yoon2026calif "Diagnosing and Correcting Reward Hacking in Verifiable Instruction Following (2026)") needs "at most one extra teacher-forced forward pass per rollout" to score a response's likelihood under a reference model (§1, §4).

**Learn more:** [CaLIF](#/papers/yoon2026calif "Diagnosing and Correcting Reward Hacking in Verifiable Instruction Following (2026)") §1 and §4, which use it without defining it (general definition).

**Related:** [negative log-likelihood (NLL)](#/glossary/negative-log-likelihood-nll), [perplexity](#/glossary/perplexity), [KL penalty](#/glossary/kl-penalty)


<a id="tensor-rank-matrix-multiplication"></a>

## Tensor rank (matrix multiplication)

A way of counting the cost of a matrix-multiplication algorithm. The product of an m×n and an n×p matrix can be written as a 3D tensor; an algorithm corresponds to writing that tensor as a sum of simple ("rank-one") tensors, and the number of terms is the number of scalar multiplications the algorithm needs. [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") §3.1: algorithms "can be represented as decompositions of a given 3D tensor into rank-one tensors. The rank (number of terms) of the decomposition exactly specifies the number of scalar multiplications needed". The rank of the tensor is the smallest such number, so a decomposition with fewer terms gives an algorithm with fewer multiplications and a lower upper bound on the rank.

Example: for two 2×2 matrices the best known rank is 7, from Strassen (1969) ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") Tab. 3), against 8 multiplications for the schoolbook method (general definition).

**Learn more:** [AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)") ([PDF p. 9](https://arxiv.org/pdf/2506.13131#page=9)) §3.1 and Tab. 2 (PDF p. 9), Tab. 3 (App. A, PDF p. 34). Strassen's paper is not listed here.

**Related:** [evolutionary search](#/glossary/evolutionary-search)


<a id="test-of-two-proportions"></a>

## Test of two proportions

A significance test of whether two groups' success rates (proportions) differ, usually the large-sample z-test: the difference of the two rates divided by its standard error under the pooled rate (general definition). It is the normal approximation that [Fisher's exact test](#/glossary/fishers-exact-test) avoids for small counts. [SQLRepair](#/papers/preslermarshall2021sqlrepair "SQLRepair: Identifying and Repairing Mistakes in Student-Authored SQL Queries (2021)") uses it to compare two courses' shares of correct SQL queries, 12.4% (94 of 760) against 7.8% (157 of 2,022), and reports the difference significant (p < .001) (§IV-A).

**Learn more:** [SQLRepair](#/papers/preslermarshall2021sqlrepair "SQLRepair: Identifying and Repairing Mistakes in Student-Authored SQL Queries (2021)") ([PDF p. 6](https://arxiv.org/pdf/2102.05729#page=6)) §IV-A (PDF p. 6), which uses it without defining it (general definition).

**Related:** [Fisher's exact test](#/glossary/fishers-exact-test), [chi-square test of independence](#/glossary/chi-square-test-of-independence), [binomial test](#/glossary/binomial-test), [p-value](#/glossary/p-value), [standard error](#/glossary/standard-error), [Cohen's h](#/glossary/cohens-h)


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


<a id="tetrachoric-correlation"></a>

## Tetrachoric correlation

The correlation between two yes/no outcomes measured as the correlation of hidden, normally distributed scores assumed to lie behind them, each outcome being "yes" when its score passes a threshold (general definition). [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") says a single-factor model of LLM errors "must be calibrated with the tetrachoric (latent) correlation, not the Pearson correlation of 0/1 correctness indicators", "a century-old psychometric point" (§5, citing Pearson 1900, not listed here), and that the Pearson coefficient of 0/1 indicators biases the correlation downward (App. A.2, after Prop. 7).

**Learn more:** [When Does Combining Language…](#/papers/chen2026cofailure "When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models (2026)") ([PDF p. 19](https://arxiv.org/pdf/2606.27288#page=19)) §5 and App. A.2 (Prop. 7, PDF pp. 19–20), whose model has a latent score per model, correct when it is above zero (general definition).

**Related:** [Pearson correlation](#/glossary/pearson-correlation), [copula](#/glossary/copula)


<a id="text-to-sql"></a>

## Text-to-SQL

Translating a natural-language question about a database into an SQL query whose result answers the question ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") §2). Systems are scored by comparing their query's result with that of a human-written [gold query](#/glossary/gold-query).

**Learn more:** [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") ([PDF p. 2](https://arxiv.org/pdf/2510.26840#page=2)) §2 (PDF p. 2); [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") §1. The challenge in this repo: [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification).

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


<a id="thinking-and-non-thinking-modes"></a>

## Thinking and non-thinking modes

A setting of some models (Qwen3 among them) that switches between writing a reasoning trace before the final answer (thinking) and answering directly (non-thinking), in one set of weights (general definition). [CaLIF](#/papers/yoon2026calif "Diagnosing and Correcting Reward Hacking in Verifiable Instruction Following (2026)") evaluates models "including both thinking and non-thinking modes" (§1, §5), and scores likelihoods in non-thinking mode over final-answer tokens only (App. B).

**Learn more:** [CaLIF](#/papers/yoon2026calif "Diagnosing and Correcting Reward Hacking in Verifiable Instruction Following (2026)") §1, §5 and App. B, which use the terms without defining them (general definition).

**Related:** [test-time scaling](#/glossary/test-time-scaling), [chat template](#/glossary/chat-template), [System 1 and System 2](#/glossary/system-1-and-system-2)


<a id="thompsons-construction"></a>

## Thompson's construction

The standard way to compile a regular expression into a [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa): each character becomes a two-state piece, and concatenation, alternation and star join pieces with ε-transitions (Thompson 1968, not listed here; general definition). The NFA's size is linear in the regex's: [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") notes that "Thompson's construction is linear in the regex size" (§3.2, PDF p. 4), and extends it to regexes with lookahead.

**Learn more:** [LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") §3.2 (PDF p. 4); [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.1.1, which cites it for modelling regexes as NFAs.

**Related:** [nondeterministic finite automaton (NFA)](#/glossary/nondeterministic-finite-automaton-nfa), [regular expression and regular language](#/glossary/regular-expression-and-regular-language), [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence)


<a id="threat-model"></a>

## Threat model

The assumptions a security analysis makes about the attacker and the system: what the attacker can see and do, what the system does, and what counts as a successful attack. A defense is only claimed to hold under its threat model (general definition). [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1 gives the threat model of a ReDoS attack, following Davis et al., as three ingredients: a backtracking regex engine, a vulnerable regex, and an input the attacker controls; it argues that engine defenses have made "many threat models obsolete" (abstract).

**Learn more:** [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1 and §3.

**Related:** [algorithmic complexity attack](#/glossary/algorithmic-complexity-attack), [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [attack success rate (ASR)](#/glossary/attack-success-rate-asr)


<a id="threats-to-validity"></a>

## Threats to validity

A section that empirical software-engineering papers conventionally include, listing by kind the reasons the study's findings might not hold: internal validity (whether something other than the studied factor could explain the results), external validity (whether they generalize beyond the studied sample), construct validity (whether the measures capture what they are meant to) and conclusion validity (whether the data and statistics support the conclusions) (general definition).

Example: [What Survives the Next Model?](#/papers/salsabil2026survives "What Survives the Next Model? Benchmarking LLM-Based Techniques Against Single-Prompts (2026)") §V-D has one paragraph for each of these four kinds; under conclusion validity it says the papers' heterogeneity and the small sample "prevent us from conducting a statistical significance tests on our observations".

**Learn more:** [What Survives the Next Model?](#/papers/salsabil2026survives "What Survives the Next Model? Benchmarking LLM-Based Techniques Against Single-Prompts (2026)") §V-D, which uses the four kinds without defining the convention (general definition); [Rango](#/papers/thompson2024rango "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification (2025)") §V-H and [SWE-ABS](#/papers/yu2026sweabs "SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark (2026)") (unchecked) App. A.12 have such sections too.

**Related:** [pre-registration](#/glossary/pre-registration)


<a id="tokenization-and-byte-pair-encoding-bpe"></a>

## Tokenization and byte-pair encoding (BPE)

Tokenization is "the segmenting of an input sequence of bytes into discrete tokens", with a vocabulary of tokens learned beforehand from a corpus ([Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") §1); each token is one step of the model. Byte-pair encoding is the most common way to learn the vocabulary: start from single characters (in practice bytes), repeatedly add the most frequent adjacent pair as a new token until a set vocabulary size is reached, and cut new text by applying the merges in the learned order ([Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") §1). WordPiece follows the same principle with a different merge rule, and a pre-tokenization step, such as splitting at whitespace, usually stops tokens from spanning word boundaries ([TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §2.1). Because the vocabulary comes from statistics, not grammar, similar strings can be cut very differently: [Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") §1, Fig. 2, shows that only some 3-digit numbers get a token of their own in GPT-3's tokenizer.

**Learn more:** [Tokenization counts](#/papers/singh2024tokenization "Tokenization counts: the impact of tokenization on arithmetic in frontier LLMs (2024)") §1; [TokDrift](#/papers/li2025tokdrift "TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar (2025)") §2.1.

**Related:** [lexing](#/glossary/lexing), [inductive bias](#/glossary/inductive-bias), [hidden state](#/glossary/hidden-state)


<a id="tool-calling-function-calling"></a>

## Tool calling (function calling)

An LLM API mode in which the caller declares functions with a schema (name, parameters and their types), and the model can answer with a structured call, a function name with arguments, instead of free text; the harness runs the function and returns the result to the model (general definition). Benchmarks grade the call's structure: [Noise Floor Audit for Agent Benchmarks](#/papers/chen2026noisefloor "Noise Floor Audit for Agent Benchmarks (2026)") calls each endpoint "through their native tool or function-calling interface" and scores the predicted calls by "AST exactness" against reference calls (§3). An agent can also be given a text protocol in its prompt instead of the API mode: [Can Agents Infer Environment…](#/papers/menaged2026automata "Can Agents Infer Environment from Interaction? Evidence from Agentic Automata Learning (2026)") has its agents write each call as a JSON object inside a `<TOOL_ACTION>` block of their reply (App. A.1.1), which the harness parses, and counts the malformed calls by type (App. A.5).

**Learn more:** [Noise Floor Audit for Agent Benchmarks](#/papers/chen2026noisefloor "Noise Floor Audit for Agent Benchmarks (2026)") §1 and §3 (general definition); [Can Agents Infer Environment…](#/papers/menaged2026automata "Can Agents Infer Environment from Interaction? Evidence from Agentic Automata Learning (2026)") App. A.1.1 and App. A.5, for a prompted text protocol.

**Related:** [agent harness](#/glossary/agent-harness), [ReAct](#/glossary/react), [constrained decoding](#/glossary/constrained-decoding), [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast), [Model Context Protocol (MCP)](#/glossary/model-context-protocol-mcp)


<a id="top-k-accuracy-top-1-and-top-5"></a>

## Top-k accuracy (top-1 and top-5)

For a model that ranks its guesses, the share of examples whose correct answer is its first guess (top-1) or among its first k guesses (top-k, often top-5); top-1 accuracy is ordinary accuracy (general definition). [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)") reports top-1 to top-5 accuracy of its skill retrieval and notes that it puts "the top-5 relevant skills in the prompt" (App. B.4.4, Tab. A.4); [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") plots ImageNet models' top-1 accuracy on original and corrected labels (§5.1, Fig. 4), and top-1 and top-5 accuracy in App. F (Fig. S3).

**Learn more:** [Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)") ([PDF p. 42](https://arxiv.org/pdf/2305.16291#page=42)) App. B.4.4 (PDF p. 42); [Pervasive Label Errors in…](#/papers/northcutt2021labelerrors "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks (2021)") ([PDF p. 8](https://arxiv.org/pdf/2103.14749#page=8)) (unchecked) §5.1 (PDF p. 8) and App. F (PDF p. 21). Neither defines the term (general definition).

**Related:** [Hit@1](#/glossary/hit1), [recall@k and mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr), [exact match](#/glossary/exact-match), [pass@k](#/glossary/passk), [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling) (a different use of "top-k")


<a id="top-k-and-nucleus-top-p-sampling"></a>

## Top-k and nucleus (top-p) sampling

Ways to sample an LLM's next token from only part of its distribution, to avoid unlikely tokens while keeping variety. Top-k sampling draws from the k most likely tokens; nucleus (top-p) sampling draws from the most likely tokens that together hold probability p. [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") uses k = 50 and p = 0.9 as decoding baselines for producing several different SQL queries, alongside typical sampling, "another recent diverse decoding algorithm" (§6.2).

**Learn more:** [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") §6.2; the original papers it cites are not listed here.

**Related:** [beam search](#/glossary/beam-search), [constrained decoding](#/glossary/constrained-decoding), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)


<a id="totalized-functions-junk-values"></a>

## Totalized functions (junk values)

Proof assistants such as Lean define partial operations on all inputs by giving them default ("junk") values where they are mathematically undefined: in Lean, 2 / 0 = 0, and subtraction of natural numbers stops at zero, so 2 − 3 = 0 (general definition). A formal statement that leaves out a side condition can then be true for the wrong reason, or mean something other than intended. [Faults in Our Formal Benchmarking](#/papers/ammanamanchi2026leandefects "Faults in Our Formal Benchmarking: Dataset Defects and Evaluation Failures in Lean Theorem Proving (2026)") builds checkers for issues "arising from Lean's totalized arithmetic, where division by zero returns zero (2/0=0)", and for natural-number subtraction "that may truncate to zero" (§4.1).

**Learn more:** [Faults in Our Formal Benchmarking](#/papers/ammanamanchi2026leandefects "Faults in Our Formal Benchmarking: Dataset Defects and Evaluation Failures in Lean Theorem Proving (2026)") §4.1 (general definition).

**Related:** [proof assistant](#/glossary/proof-assistant), [autoformalization](#/glossary/autoformalization), [formal specification](#/glossary/formal-specification), [soundness and completeness](#/glossary/soundness-and-completeness)


<a id="trajectory-agent"></a>

## Trajectory (agent)

The record of one agent attempt at a task: its reasoning steps, tool calls and their results, in order, ending in an output that an evaluator scores (general definition). Agent-learning methods mine trajectories for lessons and skills: [SKILL-KD](#/papers/shi2026skillkd "SKILL-KD: Contrastive Skill Distillation for LLM Agents (2026)") contrasts a weak student's failed trajectory with a teacher's trajectory on the same task to write a skill patch (abstract; §3.1). It is the agent counterpart of a program's [execution trace](#/glossary/execution-trace).

**Learn more:** [SKILL-KD](#/papers/shi2026skillkd "SKILL-KD: Contrastive Skill Distillation for LLM Agents (2026)") §3.1, which uses the term without defining it (general definition).

**Related:** [execution trace](#/glossary/execution-trace), [agent skill](#/glossary/agent-skill), [agent harness](#/glossary/agent-harness), [ReAct](#/glossary/react)


<a id="transaction-atomicity"></a>

## Transaction (atomicity)

A group of database reads and writes that runs as one unit: either all its changes take effect or none do (atomicity), and concurrent transactions do not see each other's unfinished work (isolation) (general definition). [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") compares checks made before an agent's write with "atomic guards" that check and write as one step, so the data cannot change in between, and reports that a full atomic guard recorded no unsafe effects in its episodes (abstract).

**Learn more:** [Engineering Reliable Commit Gates…](#/papers/zheng2026vpcontrol "Engineering Reliable Commit Gates for Agentic AI: Cost-Aware Verification Portfolios under Common-Mode Data Failures (2026)") abstract and §I. Nothing on this site defines it (general definition).

**Related:** [idempotent operation](#/glossary/idempotent-operation), [OLAP and OLTP](#/glossary/olap-and-oltp), [stored procedure and trigger](#/glossary/stored-procedure-and-trigger), [SQL statement categories (DDL, DML, DQL, DCL, TCL)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl)


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


<a id="transpiler"></a>

## Transpiler

A tool that translates source code from one language or dialect into another at the same level of abstraction, as opposed to a compiler that lowers it to machine code (general definition). For SQL it rewrites a query from one engine's dialect into another's. [QueryHouse](#/papers/oh2026queryhouse "QueryHouse: Cross-DBMS Differential Testing with LLM and Query Transpilation (2026)") builds a customized transpiler on SQLGlot, "the open-source transpiler", to run one test query on several engines (abstract; §3.2, PDF p. 6).

**Learn more:** [QueryHouse](#/papers/oh2026queryhouse "QueryHouse: Cross-DBMS Differential Testing with LLM and Query Transpilation (2026)") §3.2 (PDF p. 6), which uses the word without defining it (general definition).

**Related:** [SQL dialect](#/glossary/sql-dialect), [syntax-directed translation](#/glossary/syntax-directed-translation), [differential testing](#/glossary/differential-testing)


<a id="tree-edit-distance"></a>

## Tree edit distance

The smallest total cost of node insertions, deletions and relabellings that turns one tree into another, computed by dynamic programming. Applied to query trees, it measures how different two queries' structures are: LLM-R² can choose as a prompt demonstration the candidate query with the minimum tree edit distance to the input query ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §4.1), and [Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") contrasts its partial-credit grading of student queries, based on canonicalization and edit sequences, with tree edit distance in its related work (§5, PDF p. 8).

**Learn more:** [Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)") ([PDF p. 8](https://arxiv.org/pdf/1912.09019#page=8)) §5 (PDF p. 8), which points to a survey (not listed here); [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)") §4.1. Neither defines it (general definition).

**Related:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)


<a id="true-and-false-positive-rates"></a>

## True and false positive rates

For a binary checker (a test, a judge, a verifier): the true-positive rate (TPR, also sensitivity or recall) is the share of truly positive cases it flags as positive, and the false-positive rate (FPR) the share of truly negative cases it flags as positive; specificity is 1 − FPR (general definition). Which side counts as positive varies between papers. For an LLM judge, [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)") takes acceptance as positive: TPR = Pr[judge accepts | answer correct] and FPR = Pr[accepts | answer wrong] (§3). In that convention a pass on wrong work is a false positive, as [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") calls it (§3.3), and a fail on correct work, its "false rejection" (§7), is a false negative.

**Learn more:** [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)") §3; [Finding Side-Effect Loopholes in…](#/papers/abrich2026blindspots "Finding Side-Effect Loopholes in Verifiable Rewards (2026)") §3.3; §7.

**Related:** [Youden's index](#/glossary/youdens-index), [Rogan-Gladen correction](#/glossary/rogan-gladen-correction), [AUROC](#/glossary/auroc), [F1 score](#/glossary/f1-score), [soundness and completeness](#/glossary/soundness-and-completeness), [test oracle](#/glossary/test-oracle)


<a id="trusted-computing-base"></a>

## Trusted computing base

The components that must be correct for a system's guarantee to hold; a bug anywhere in them can break the guarantee unnoticed (general definition, from computer security). For a proof assistant it is ideally a small kernel that checks proofs. [Faults in Our Formal Benchmarking](#/papers/ammanamanchi2026leandefects "Faults in Our Formal Benchmarking: Dataset Defects and Evaluation Failures in Lean Theorem Proving (2026)") notes that Lean's `native_decide` "expands the trusted computing base beyond the kernel by trusting the compiler/codegen result", so that bugs in native code generation become a risk to soundness (§3.2).

**Learn more:** [Faults in Our Formal Benchmarking](#/papers/ammanamanchi2026leandefects "Faults in Our Formal Benchmarking: Dataset Defects and Evaluation Failures in Lean Theorem Proving (2026)") §3.2 (general definition).

**Related:** [proof assistant](#/glossary/proof-assistant), [certificate](#/glossary/certificate), [soundness and completeness](#/glossary/soundness-and-completeness), [extraction (proof assistants)](#/glossary/extraction-proof-assistants)


<a id="turing-complete"></a>

## Turing-complete

Able to express any computation that a general-purpose programming language can, given enough memory and time (general definition). Most programming languages are, and so are very small systems such as the [lambda calculus](#/glossary/lambda-calculus-and-beta-reduction). [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") relies on it so that "the same algorithmic problems that are solvable in Python or JavaScript are in principle solvable" in each of its five esoteric languages (abstract, §1); [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)") rests its claim that searching over code can find "any possible agentic systems" on Python being Turing complete (§1).

**Learn more:** [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)") abstract, §1 and §3.2; [ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)") §1. Neither defines it (general definition).

**Related:** [halting problem and Rice's theorem](#/glossary/halting-problem-and-rices-theorem), [decidable and undecidable](#/glossary/decidable-and-undecidable), [esoteric programming language (esolang)](#/glossary/esoteric-programming-language-esolang), [expressive power](#/glossary/expressive-power)


<a id="type-safety-and-type-soundness"></a>

## Type safety and type soundness

Guarantees, proved about a typed language's semantics, that its type checker can be trusted at run time. [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") (§5, Thm. 5.1–5.2, PDF p. 27) separates two: type safety, "well-typed queries either reduce to a table or raise a (controlled) type error", so evaluation "does not get stuck"; and type soundness, which adds that "the resulting table indeed has the type of the query". [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)") states the guarantee its static typing gives: "If static typing of an expression does not raise a type error, then dynamic evaluation of the same expression will not raise a type error" (§3.2.1).

**Learn more:** [TRAF](#/papers/ye2026traf "A Formal Framework for Typing and Cast Semantics in SQL Engines (2026)") §5 (PDF p. 27; the prose quoted here is not affected); [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)") (unchecked) §3.2.1, and §5.15, which uses "type soundness" without defining it.

**Related:** [static type checking (static typing)](#/glossary/static-type-checking-static-typing), [soundness and completeness](#/glossary/soundness-and-completeness) (a different sense: of a checker's verdicts), [formal semantics](#/glossary/formal-semantics)


<a id="letter-u"></a>

<a id="u-expression"></a>

## U-expression

The expression a SQL query is translated into by the equivalence prover UDP: a function giving, for every possible row, how many times that row appears in the query's result (its multiplicity), built from the tables' counts, 0/1 tests of conditions, a squash that turns any positive count into 1 (duplicate removal) and sums over all possible rows (projection). Two queries are equivalent when their U-expressions always give the same multiplicity. [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §3.2: "Every SQL query is translated into a U-expression, which denotes the K-relation of the query's answer" (PDF p. 4); [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1: "the U-expression of a query is an algebraic expression 𝑓(𝑡), which returns the multiplicity of the tuple 𝑡 in the query result. Two queries are equivalent if their U-expressions always return the same result" (PDF p. 2). WeTune and SQLSolver reuse it ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §5.1.1; [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1); QED defines its own "Q-expressions", "similar to U-expressions" ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)") §1).

**Learn more:** [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") ([PDF p. 4](https://arxiv.org/pdf/1802.02229#page=4)) §3.2 (PDF pp. 4–5, Def. 3.2); [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)") §1 (PDF p. 2). None disputes the definition above.

**Related:** [bag semantics](#/glossary/bag-semantics), [K-relation and semiring semantics](#/glossary/k-relation-and-semiring-semantics), [query equivalence](#/glossary/query-equivalence), [U-semiring](#/glossary/u-semiring)


<a id="u-semiring"></a>

## U-semiring

An algebra for proving SQL queries equivalent, under [bag semantics](#/glossary/bag-semantics) as well as set semantics, introduced by [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") as the "unbounded semiring": a commutative semiring, as in [K-relations](#/glossary/k-relation-and-semiring-semantics), extended with a squash operation that models `DISTINCT`, a negation that models `NOT EXISTS`, and an unbounded summation over all tuples that models projection, each governed by a few axioms (Def. 3.1, §3.1, PDF p. 3). A query is converted into a U-semiring expression, and deciding whether two queries are equivalent becomes deciding whether their two expressions are (§1).

**Learn more:** [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") ([PDF p. 3](https://arxiv.org/pdf/1802.02229#page=3)) §1 and §3.1 (Def. 3.1, PDF p. 3); [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") §2.3 (PDF p. 4), which builds on Ding et al.'s extension of it, used by SQLSolver.

**Related:** [K-relation and semiring semantics](#/glossary/k-relation-and-semiring-semantics), [bag semantics](#/glossary/bag-semantics), [query equivalence](#/glossary/query-equivalence), [U-expression](#/glossary/u-expression)


<a id="underspecification"></a>

## Underspecification

A training setup is underspecified when it admits many models that score alike on the test data but behave differently elsewhere, so the test score doesn't determine deployed behaviour (general definition, after D'Amour et al. 2022, not listed here). [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") §2: "similar test performance can conceal different deployment behavior", and its memory writers with identical endpoint decisions differ under replay (§4.2).

**Learn more:** [ReplayLens](#/papers/xu2026replaylens "ReplayLens: Auditing Agents' Use of Outcomes (2026)") §2 and §4.2.

**Related:** [out-of-distribution generalization](#/glossary/out-of-distribution-generalization), [identifiability](#/glossary/identifiability), [Clever Hans effect](#/glossary/clever-hans-effect)


<a id="unification"></a>

## Unification

Finding values for variables that make two terms identical: unifying p(X, b) with p(a, Y) gives X = a and Y = b, while p(a) and p(b) don't unify. A logic-programming interpreter unifies each goal with a rule's head, and the values found carry into the rule's body (general definition; Robinson 1965 is not listed here). [Probing for Long-Horizon Deductive…](#/papers/alnegheimish2026prolong "Probing for Long-Horizon Deductive Reasoning Capabilities in Language Models with Prolog (2026)") §1 says a model answering its Prolog queries "must correctly unify variables" and follow argument orders through rule heads and bodies.

**Learn more:** [Probing for Long-Horizon Deductive…](#/papers/alnegheimish2026prolong "Probing for Long-Horizon Deductive Reasoning Capabilities in Language Models with Prolog (2026)") §1, which uses the term without defining it (general definition).

**Related:** [backward chaining](#/glossary/backward-chaining), [logic programming](#/glossary/logic-programming), [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping)


<a id="uniform-convergence"></a>

## Uniform convergence

A guarantee that, with high probability, the loss measured on a sample is close to the true expected loss for every hypothesis in a class at the same time (every model, or every prompt in a set), not only for one fixed in advance. It is what makes the sample score of whichever hypothesis a learner picks trustworthy. The sample size it needs grows with the class's size or complexity; for a finite class, with the logarithm of its size (general definition). [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)") assumes a bound of this kind for prompts, "A3 (Uniform convergence)". It assumes that for every prompt the empirical loss is within q of its population value with probability 1 − δ, where "a standard form" of q is Õ(√((log|P| + log(1/δ))/N)), with N the number of examples (§3.3). [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") says generalization bounds of this type "follow from uniform convergence arguments based on various notions of complexity of hypotheses classes" (§2.2).

**Learn more:** [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)") ([PDF p. 7](https://arxiv.org/pdf/1506.02629#page=7)) §2.2 (PDF p. 7); [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)") ([PDF p. 5](https://arxiv.org/pdf/2505.19514#page=5)) §3.3, A3 (PDF p. 5), citing Wang et al. (2022), which is not listed here. Neither defines the term (general definition). A3 is an assumption of [SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)")'s Theorem 3.1, whose proof has an open erratum; the definition does not rest on the theorem.

**Related:** [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse), [concentration inequality](#/glossary/concentration-inequality), [union bound](#/glossary/union-bound), [covering number](#/glossary/covering-number) (proposed above)


<a id="uninterpreted-function"></a>

## Uninterpreted function

A function symbol in a solver formula about which the solver assumes nothing except that it is a function: equal inputs give equal outputs. Checkers use it for operations they don't model exactly (string and date functions, multiplication, aggregates). It keeps the formula simple but loses facts: EQUITAS can prove `a × b = c × d` only when `a = c` and `b = d` ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §3.4.1), and it can produce spurious counterexamples ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §1).

**Learn more:** [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") ([PDF p. 6](https://arxiv.org/pdf/2403.03193#page=6)) §3.1 (PDF p. 6); [EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)") §3.4.1 (PDF p. 7).

**Related:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers), [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation)


<a id="union-bound"></a>

## Union bound

The chance that at least one of several events happens is at most the sum of their chances (general definition). It is how a guarantee for one test becomes a guarantee for many: testing each of K candidates at failure probability δ/K keeps the chance that any of them fails below δ, as in the [Bonferroni correction](#/glossary/bonferroni-correction), at a cost that grows with K. [Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)") notes that its guarantee needs a bounded candidate set, since otherwise "the union bound runs over an unbounded set" (§4).

**Learn more:** [Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)") §3 and §4; [Certified Long-Horizon Code Agent…](#/papers/wang2026valve "Certified Long-Horizon Code Agent Evolution via Validation-Gated Skill Optimization (2026)") App. A. Neither defines it (general definition).

**Related:** [concentration inequality](#/glossary/concentration-inequality), [Bonferroni correction](#/glossary/bonferroni-correction), [multiple testing](#/glossary/multiple-testing), [learn-then-test (LTT)](#/glossary/learn-then-test-ltt)


<a id="union-of-conjunctive-queries"></a>

## Union of conjunctive queries

A query that is the union of several [conjunctive queries](#/glossary/conjunctive-query) with the same output columns: conjunctive queries combined with OR, or with SQL's `UNION` (`UNION ALL` when duplicates count, under bag semantics). Example: "departments that sell pens or pencils" is `(x). Sales(x, pen) ∪ (x). Sales(x, pencil)`.

Under set semantics, one union is contained in another exactly when the two have the same output columns and each member of the first is contained in some member of the second. [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") proves this for unions of [tableaux](#/glossary/tableau) (Thm. 3, PDF p. 9) and says "Analogous results are easily obtained for conjunctive queries" (§2.5, PDF p. 4). Under bag semantics the member-by-member test fails ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") Proposition 6.3), and containment is undecidable ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)") Theorem 6.2).

**Learn more:** [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") §2 (PDF p. 2); [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)") §3–4 (PDF pp. 4–9); [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") §6 (PDF pp. 8–9), which requires the members to have the same arity and the same set of distinguished variables (§6.2, PDF p. 8).

**Related:** [conjunctive query](#/glossary/conjunctive-query), [query containment](#/glossary/query-containment), [decidable and undecidable](#/glossary/decidable-and-undecidable), [tableau](#/glossary/tableau)


<a id="union-find-disjoint-set-structure"></a>

## Union-find (disjoint-set structure)

A data structure that keeps elements in disjoint sets under two operations: union, which merges two sets into one, and find, which names the set an element is in; it is used to grow equivalence classes as pairs of elements are found equal (general definition). [A Linear Algorithm for…](#/papers/hopcroft1971linear "A Linear Algorithm for Testing Equivalence of Finite Automata (1971)") tests whether two finite automata are equivalent this way: it starts with one set per state, and "MERGE(i,j,k) causes the set named i and the set named j to be combined into a single set named k", while "FIND(i) determines the name of the set currently containing i" (§I, PDF pp. 3–4; the one set per state: §III, PDF p. 4). [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") groups candidate SQL queries into equivalence classes from pairwise comparisons with one: "the union-find takes the transitive closure, so a gold-free class is a connected component" (App. D, PDF p. 26).

**Learn more:** [A Linear Algorithm for…](#/papers/hopcroft1971linear "A Linear Algorithm for Testing Equivalence of Finite Automata (1971)") §I (PDF pp. 3–4) and §III (PDF p. 4), which takes the structure from a Hopcroft and Ullman report not listed here (general definition); [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") ([PDF p. 26](https://arxiv.org/pdf/2609.25938#page=26)) App. D (PDF p. 26).

**Related:** [DFA minimization and equivalence](#/glossary/dfa-minimization-and-equivalence), [finite-state machine](#/glossary/finite-state-machine), [non-transitivity](#/glossary/non-transitivity)


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


<a id="vector-store"></a>

## Vector store

A store of documents together with their embedding vectors, from an embedding model, that, given a query, embeds it and returns the documents whose vectors are nearest (general definition). [LEGO-Prover](#/papers/wang2023legoprover "LEGO-Prover: Neural Theorem Proving with Growing Libraries (2024)") keeps its lemma library in vector stores, each of which "maintains its data in pairs consisting of documents and their corresponding embeddings" (§3.1).

**Learn more:** [LEGO-Prover](#/papers/wang2023legoprover "LEGO-Prover: Neural Theorem Proving with Growing Libraries (2024)") §3.1.

**Related:** [dense retrieval](#/glossary/dense-retrieval), [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns), [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag), [library learning](#/glossary/library-learning)


<a id="vibe-coding"></a>

## Vibe coding

Building software by asking an AI coding agent in natural language and letting it write the code, over many back-and-forth requests (general definition). [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") §1, footnote 1 (PDF p. 2): "Vibe coding is an approach to software development where the developer collaborates with AI tools to brainstorm, code, test and debug." [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") ties it to long sessions, "real vibe-coding where sessions run dozens or hundreds of turns" (abstract).

**Learn more:** [A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") ([PDF p. 2](https://arxiv.org/pdf/2603.05278#page=2)) §1, footnote 1 (PDF p. 2); [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") (unchecked) abstract.

**Related:** [agent harness](#/glossary/agent-harness)


<a id="vulnerability-records-cve-nvd-cwe-cvss-epss"></a>

## Vulnerability records (CVE, NVD, CWE, CVSS, EPSS)

The public catalogues of software security problems. A CVE (Common Vulnerabilities and Exposures) entry records one disclosed vulnerability under an identifier such as CVE-2018-20164; the NVD (National Vulnerability Database) publishes CVEs with severity scores, weakness labels and affected products; a CWE (Common Weakness Enumeration) is a weakness type used to label them (general definitions). CWE-1333, "Inefficient Regular Expression Complexity", names [ReDoS](#/glossary/redos-and-catastrophic-backtracking) ([SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1; [An Empirical Analysis of…](#/papers/mahassadi2026redos "An Empirical Analysis of ReDoS Vulnerabilities and ReDoS Detection Tools (2026)") §3.1.1). Two scores rate CVEs: CVSS "measures the severity of the vulnerability according to multiple factors", in versions 2.0 to 4.0 ([An Empirical Analysis of…](#/papers/mahassadi2026redos "An Empirical Analysis of ReDoS Vulnerabilities and ReDoS Detection Tools (2026)") §4.2), and EPSS is "computed daily and measures the likelihood that a CVE will be exploited in the subsequent 30 days" (§4.3).

**Learn more:** [An Empirical Analysis of…](#/papers/mahassadi2026redos "An Empirical Analysis of ReDoS Vulnerabilities and ReDoS Detection Tools (2026)") §3.1.1, §4.2 and §4.3; [SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §2.3.1–2.3.2; [QLCoder](#/papers/wang2025qlcoder "QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities (2026)") §1, which counts its CVEs by CWE category. None defines CVE or NVD (general definition).

**Related:** [ReDoS and catastrophic backtracking](#/glossary/redos-and-catastrophic-backtracking), [algorithmic complexity attack](#/glossary/algorithmic-complexity-attack), [threat model](#/glossary/threat-model)


<a id="letter-w"></a>

<a id="wald-interval"></a>

## Wald interval

The textbook confidence interval: estimate ± z × standard error, about ± 1.96 standard errors for 95%, from the normal approximation of the [central limit theorem](#/glossary/central-limit-theorem-clt) (general definition). For a success rate p̂ from n trials it is p̂ ± 1.96 √(p̂(1 − p̂)/n): too narrow for small n or rates near 0 or 1, and of zero width when p̂ is 0 or 1, which the [Wilson score interval](#/glossary/wilson-score-interval) avoids. [Towards Reliable LLM Evaluation](#/papers/xu2026siren "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking (2026)") shows a further failure: a Wald interval computed on the same items used to select a winner inherits the winner's upward bias (§4, §4.1).

**Learn more:** [Towards Reliable LLM Evaluation](#/papers/xu2026siren "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking (2026)") §4 and §4.1 (general definition).

**Related:** [Wilson score interval](#/glossary/wilson-score-interval), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval), [standard error](#/glossary/standard-error), [confidence interval and coverage](#/glossary/confidence-interval-and-coverage), [winner's curse (optimizer's curse)](#/glossary/winners-curse-optimizers-curse)


<a id="wasserstein-distance"></a>

## Wasserstein distance

A distance between two probability distributions: the least total cost of moving the probability mass of one onto the other, where moving mass between two points costs more the more different they are. Unlike measures that compare probabilities point by point, it takes into account how close the points are. STP re-weights the conjectures it has selected into the training distribution closest in this distance to the unproved theorems, the cost between a conjecture and a theorem being the negative cosine similarity of their embeddings ([STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") §3.2, App. A.5).

**Learn more:** [STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)") ([PDF p. 19](https://arxiv.org/pdf/2502.00212#page=19)) §3.2 and App. A.5 (PDF p. 19), which defines it as an optimal-transport problem over a matching between the two distributions.

**Related:** [KL penalty](#/glossary/kl-penalty)


<a id="watermark-stream-processing"></a>

## Watermark (stream processing)

In a stream processor, a threshold on how late data may arrive: events older than it are dropped instead of updating results. Spark's guide, as [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") quotes it: "data later than the threshold will start getting dropped" (§1). Dropping late data is the documented behaviour, so whether a pipeline that drops it is wrong depends on what the task asks: ArrivalBench requires the final result to match a recomputation over all the data and grades the drop as a failure "by design" (App. B).

**Learn more:** [ArrivalBench](#/papers/kothari2026arrivalbench "ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time (2026)") §1, which quotes Spark's guide, and App. B, "Watermarks and the late-arrival hazard". Spark's guide is not listed here.

**Related:** [at-least-once delivery](#/glossary/at-least-once-delivery)


<a id="weak-supervision"></a>

## Weak supervision

Statistical methods that combine several cheap, noisy labelling sources (heuristics, crowd workers, weak models) into better labels without ground truth, by estimating how accurate each source is from where they agree and disagree. [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") §1 describes it as "a family of statistical techniques developed for data labeling" and applies it to combining verifiers.

**Learn more:** [Weaver](#/papers/saadfalcon2025weaver "Shrinking the Generation-Verification Gap with Weak Verifiers (2025)") §1 and §4.2.

**Related:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting), [LLM-as-a-judge](#/glossary/llm-as-a-judge), [Cohen's kappa](#/glossary/cohens-kappa)


<a id="weak-to-strong-supervision"></a>

## Weak-to-strong supervision

Training or guiding a stronger model with signals from a weaker one: a teacher that, "despite being weaker than the learner", "still provides useful guidance" ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") §5). It reverses the usual direction of [distillation](#/glossary/distillation). Example: MultiPL-T fine-tunes CodeLlama-34B and 70B on data generated by StarCoderBase-15B, which its authors call "a form of weak-to-strong supervision …, where a smaller model is used to generate data for training a larger model" ([MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") §2.1). Work on overseeing stronger models asks the same: "whether weaker supervision can elicit or evaluate stronger behavior" ([Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") App. A.3). The work all three cite, Burns et al., is not listed here.

**Learn more:** [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") ([PDF p. 14](https://arxiv.org/pdf/2505.03335#page=14)) §5 (PDF p. 14); [MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") ([PDF p. 6](https://arxiv.org/pdf/2308.09895#page=6)) §2.1 (PDF p. 6); [Code Monitor Red Teaming](#/papers/liao2026codemonitor "Code Monitor Red Teaming for Public-Test-Passing Code (2026)") ([PDF p. 11](https://arxiv.org/pdf/2607.20852#page=11)) App. A.3 (PDF p. 11).

**Related:** [distillation](#/glossary/distillation), [monitor (AI control)](#/glossary/monitor-ai-control), [weak supervision](#/glossary/weak-supervision) (a different idea: combining noisy labelling sources)


<a id="weight-averaging"></a>

## Weight averaging

Combining models that share a starting point, such as a base model and a copy fine-tuned from it, into one by averaging their weights. Goedel-Prover-V2 averages the base model θ₀ and a fine-tuned model θ as (1 − α)θ₀ + αθ, after supervised fine-tuning and again after RL, because late in training pass@1 rose while pass@N fell, a loss of output diversity that averaging recovers ([Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.3).

**Learn more:** [Goedel-Prover-V2](#/papers/lin2025goedelproverv2 "Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction (2025)") §2.3, which calls it "model averaging", doesn't define it (general definition), and cites Wortsman et al. (not listed here).

**Related:** [pass@k](#/glossary/passk), [catastrophic forgetting](#/glossary/catastrophic-forgetting)


<a id="weisfeiler-lehman-graph-kernel"></a>

## Weisfeiler-Lehman graph kernel

A similarity score between graphs that repeatedly relabels each node with a compressed label combining its own label and its neighbours' labels, then compares how many labels of each kind the two graphs have after a few rounds (general definition; the subtree kernel is the common version). It is fast, and graphs it scores as different can't be isomorphic, but some different graphs score the same. [Can Large Language Models…](#/papers/lin2026procedures "Can Large Language Models Generalize Procedures Across Representations? (2026)") uses it with 3 iterations to compare the structure of procedures written as graphs (§5.1).

**Learn more:** [Can Large Language Models…](#/papers/lin2026procedures "Can Large Language Models Generalize Procedures Across Representations? (2026)") §5.1, which uses it without defining it (general definition); Shervashidze et al. (2011) is not listed here.

**Related:** [graph isomorphism](#/glossary/graph-isomorphism), [graph neural network (GNN)](#/glossary/graph-neural-network-gnn), [graph edit distance](#/glossary/graph-edit-distance)


<a id="welchs-t-test"></a>

## Welch's t-test

A [t-test](#/glossary/students-t-test-and-t-interval) comparing the means of two independent groups that does not assume the groups have equal variances (general definition). A one-sided version asks only whether one mean is larger. [Benchmarking Prompt Optimization of…](#/papers/lesort2026chess "Benchmarking Prompt Optimization of Large Language Models With Chess (2026)") marks gains over a baseline with "an unadjusted one-sided Welch test (p<0.05)" over three runs per condition (Tab. 3 caption, §5.1); [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") reports Welch p-values alongside a permutation test for five runs per group (§5.2).

**Learn more:** [Benchmarking Prompt Optimization of…](#/papers/lesort2026chess "Benchmarking Prompt Optimization of Large Language Models With Chess (2026)") §5.1 (Tab. 3 caption) and §5.4; [GRACE](#/papers/hsu2026grace "Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift (2026)") §5.2. Neither defines it (general definition).

**Related:** [Student's t-test and t-interval](#/glossary/students-t-test-and-t-interval), [permutation test](#/glossary/permutation-test), [multiple testing](#/glossary/multiple-testing)


<a id="wilcoxon-signed-rank-test"></a>

## Wilcoxon signed-rank test

A significance test for paired scores, such as two methods run on the same tasks: it ranks the absolute differences between the pairs and asks whether the positive differences have larger ranks than chance allows. Unlike the [sign test](#/glossary/sign-test) it uses how large each difference is, though only through its rank. MIPRO marks its best results as supported by Wilcoxon signed-rank tests ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §6, results table caption).

**Learn more:** [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)") §6, which uses it without defining it (general definition). Wilcoxon's paper is not listed here.

**Related:** [sign test](#/glossary/sign-test), [McNemar's exact test](#/glossary/mcnemars-exact-test), [bootstrap resampling](#/glossary/bootstrap-resampling), [multiple testing](#/glossary/multiple-testing)


<a id="wilson-score-interval"></a>

## Wilson score interval

A confidence interval for a success rate measured over n trials. Unlike the simple "rate ± two standard errors" interval, it stays inside 0–1 and remains sensible when the rate is near 0 or 1 or n is small.

**Learn more:** [How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") ([PDF p. 5](https://arxiv.org/pdf/2609.01660#page=5)) §3.4 (PDF p. 5), which uses it "since several cells involve success rates close to 0 or 1". Wilson's paper is not listed here.

**Related:** [bootstrap resampling](#/glossary/bootstrap-resampling), [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic), [Clopper-Pearson interval](#/glossary/clopper-pearson-interval), [Wald interval](#/glossary/wald-interval)


<a id="window-function"></a>

## Window function

An SQL function computed over a set of rows related to the current row (its window, set by `OVER (PARTITION BY … ORDER BY …)`) that, unlike GROUP BY, keeps every row: a running total, or a rank within each group.

**Learn more:** [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §2, Example 1 and Tab. 2 (PDF p. 3), where an unnecessary window function makes a query slow and a rewrite replaces it with aggregation and GROUP BY.

**Related:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules)


<a id="winners-curse-optimizers-curse"></a>

## Winner's curse (optimizer's curse)

When the best of several options is chosen by noisy estimates, the winner's estimate is biased upward, even if each estimate is unbiased on its own: the winner is likely to be one that got lucky. [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") §1: "When the best of several noisy estimates is selected, its estimate is biased upward." [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") calls the decision-analysis version the optimizer's curse: whoever picks by estimates "should expect to be disappointed on average" (abstract, PDF p. 1); the auction version, the winner's curse, is "the tendency for the highest bidder in an auction with common or interdependent values to have overestimated the value of the item being sold" (§4, PDF p. 10).

Example: in prompt and agent optimization, the best candidate's score on the validation set that picked it overstates its score on fresh data; [Towards Reliable LLM Evaluation](#/papers/xu2026siren "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking (2026)") writes that "the observed winner's score need not estimate the fresh-data performance" of the procedure (abstract), and [SAGE (Statistical Acceptance Gate)](#/papers/wang2026sage "SAGE: A Statistical Acceptance Gate for Self-Evolving Agents (2026)") calls edits that a naive gate keeps because they were lucky the Optimizer's Curse (§3.1).

**Learn more:** [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)") abstract (PDF p. 1) and §4 (PDF p. 10); [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") §1.

**Related:** [shrinkage](#/glossary/shrinkage), [regression to the mean](#/glossary/regression-to-the-mean), [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm), [multiple testing](#/glossary/multiple-testing), [adaptive data analysis](#/glossary/adaptive-data-analysis), [pre-registration](#/glossary/pre-registration)


<a id="witness-provenance"></a>

## Witness (provenance)

A set of input rows on which a query still produces a given output row: given a database D, a query Q and a row t of Q(D), a witness is a part D′ of D with t in Q(D′). It captures why-provenance, and a row can have several witnesses ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §2.2, after Buneman et al.). RATest reduces finding a smallest [counterexample database](#/glossary/counterexample-database) to finding, for each row on which two queries differ, a smallest witness of that row in the difference of the queries, and keeping the smallest of these (§2.2); its faster algorithm does this for one such row only, and may then miss the overall smallest (§4.2, §7.1).

**Learn more:** [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)") §2.2. Buneman et al.'s paper is not listed here.

**Related:** [data provenance](#/glossary/data-provenance), [counterexample database](#/glossary/counterexample-database), [optimizing SMT solver](#/glossary/optimizing-smt-solver)


<a id="wrapper-web-data-extraction"></a>

## Wrapper (web data extraction)

A program that pulls given fields out of the pages of one website by their place in the page's structure, the tree of nested HTML elements, often as an XPath expression, a path through that tree to the node that holds the value (general definition; [AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §4.1: "the wrapper method that generates an XPath"). The authors gloss learned wrappers as "a DOM-specific parser that can extract content" (§2), and say wrapper-based methods suit "structured websites with stable layouts" but struggle with entirely new site structures, which need new customized functions written by hand (§1).

**Learn more:** [AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") ([PDF p. 1](https://arxiv.org/pdf/2404.12753#page=1)) §1 (PDF p. 1), §2 (PDF p. 2) and §4.1 (PDF p. 5).

**Related:** [accessibility tree](#/glossary/accessibility-tree), [DOM tree](#/glossary/dom-tree)


<a id="letter-x"></a>

<a id="xml"></a>

## XML

Extensible Markup Language: a text format for tree-shaped documents made of nested, named elements that can carry attributes and contain text, e.g. `<book><price>40</price></book>` (general definition). "The primary purpose of XPath is to address parts of an XML document" ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") §1, citation marker dropped); XPath 1.0 models a document as a tree of seven node types: root, element, text, attribute, namespace, processing instruction and comment (§5).

**Learn more:** [XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") (unchecked) §1 and §5, which rely on the XML 1.0 Recommendation (not listed here) without restating it (general definition); [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)") (unchecked) §2.3.1, on the values XQuery and XPath 2.0 work on.

**Related:** [DOM tree](#/glossary/dom-tree), [XML namespace](#/glossary/xml-namespace), [DTD (document type definition)](#/glossary/dtd-document-type-definition), [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl)


<a id="xml-namespace"></a>

## XML namespace

A URI (a web-address-style identifier) that qualifies element and attribute names so that names from different vocabularies don't clash; a document binds a short prefix to it, as in `xsl:template` (general definition). XPath 1.0 "fully supports XML Namespaces", so a node's name is "a pair consisting of a local part and a possibly null namespace URI; this is called an expanded-name" ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") §1); two expanded-names are equal when their local parts are equal and their namespace URIs are both null or equal (§5).

**Learn more:** [XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") (unchecked) §1 and §5, which rely on Namespaces in XML (not listed here) (general definition).

**Related:** [XML](#/glossary/xml)


<a id="xpath"></a>

## XPath

A query language for picking parts out of an [XML](#/glossary/xml) document, also run on HTML pages. It models the document as a tree of nodes (elements, attributes, text), and its main expression, the location path, "selects a set of nodes relative to the context node" ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)") §1, PDF p. 3), one location step at a time; each step names an axis (the tree relationship, such as child), a node test, and zero or more predicates in square brackets that filter the nodes (§2.1, PDF p. 6). Example (§2, PDF p. 4): `child::para[position=1]` "selects the first para child of the context node". Web scrapers use XPath expressions to pull values out of a page's [DOM tree](#/glossary/dom-tree) ([AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §4.1).

**Related:** [XML](#/glossary/xml), [DOM tree](#/glossary/dom-tree), [wrapper (web data extraction)](#/glossary/wrapper-web-data-extraction)


<a id="letter-y"></a>

<a id="youdens-index"></a>

## Youden's index

A binary checker's true-positive rate minus its false-positive rate, J = TPR − FPR, from −1 to 1: 1 is a perfect checker, 0 one at chance level (it accepts right and wrong cases equally often), and below 0 an inverted one ([RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") §1). [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") reads it as a reward checker's "net discriminative power"; [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)") calls the same quantity a judge's discrimination (§3).

**Learn more:** [RLVεR ("Rate or Fate?")](#/papers/rad2026rlver "Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards (2026)") §1, citing Youden (1950), not listed here.

**Related:** [true and false positive rates](#/glossary/true-and-false-positive-rates), [Rogan-Gladen correction](#/glossary/rogan-gladen-correction), [AUROC](#/glossary/auroc), [reward model](#/glossary/reward-model)


<a id="letter-z"></a>

<a id="z-score"></a>

## z-score

A difference expressed in standard errors: for two systems' mean scores, z = (Ā − B̄) / SE[A − B] ([Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §4.1). When N is moderately large the [central limit theorem](#/glossary/central-limit-theorem-clt) makes it roughly standard normal if there is no real difference, so |z| > 1.96 corresponds to a two-sided p-value below 0.05 (§4.1).

**Learn more:** [Measuring all the noises of LLM Evals](#/papers/wang2025evalnoise "Measuring all the noises of LLM Evals (2025)") §4.1 and App. D.

**Related:** [standard error](#/glossary/standard-error), [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt), [paired comparison](#/glossary/paired-comparison), [Wald interval](#/glossary/wald-interval)


<a id="zero-rl-training"></a>

## Zero-RL training

Reinforcement learning applied directly to a pretrained base model, with no supervised fine-tuning ([cold start](#/glossary/cold-start)) before it. [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") describes zero-RL training as applying "RL directly to the base model without any supervised fine-tuning (SFT)" (§2.1), and [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") calls this the "zero setting" (abstract).

**Learn more:** [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") §2.1; [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)") abstract and §1; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning (2025)") § "DeepSeek-R1-Zero", whose DeepSeek-R1-Zero is trained this way.

**Related:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr), [cold start](#/glossary/cold-start), [reasoning boundary](#/glossary/reasoning-boundary)


<a id="zipf-distribution"></a>

## Zipf distribution

A skewed distribution in which the k-th most common value occurs with frequency proportional to 1/k^z: with z = 0 all values are equally common, and the larger the exponent z (the skew factor), the more a few values dominate (general definition). Database experiments use it to generate skewed data: [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") runs on TPC-H Skew data "with Zipfian factors: 1, 2, 3, and 4", where "the bigger the factor is, the higher the degree of skewness of the data" (§VI-A), and [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") (§8.1, §8.3) and [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") (§5.1) test query rewrites on Zipfian as well as uniform data.

**Learn more:** [Query Weak Equivalence and…](#/papers/you2025weakeq "Query Weak Equivalence and its Verification in Analytical Databases (2025)") §VI-A (PDF p. 10); [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)") §8.1 (PDF p. 10) and §8.3 (PDF p. 11); [SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") §5.1 (PDF p. 9). None defines it (general definition).

**Related:** [cardinality estimation](#/glossary/cardinality-estimation), [selectivity](#/glossary/selectivity)

