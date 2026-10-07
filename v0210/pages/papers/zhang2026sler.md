# Efficient Query Rewrite Rule Discovery via Standardized Enumeration and Learning-to-Rank

**SLER** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.04169) · [arXiv](https://arxiv.org/abs/2603.04169)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Rule discovery with standardized plan templates and a learning-to-rank pre-filter, scaling to larger plans.
- Candidates verified with Z3 over FOL semantics.
- It calls its library the largest *empirically validated* rewrite-rule library to date (abstract), though the body gives no count for the abstract's size; the rules are not released.

## In plain words

Databases speed up badly written SQL by rewriting it with rules: a pattern of operations, a smaller pattern that gives the same answer, and the conditions under which the swap is safe. The leading automatic rule finder, WeTune, tries every pair of small operation trees; the authors argue that this brute force is slow, yields mostly redundant rules, and cannot reach trees of five or more operations, while most real queries are larger (§I). They build SLER, which enumerates only trees already in one fixed standard shape, drops redundant rules during enumeration, and can use a learned ranking model to try only the most promising pairs when trees get large. For five- and six-operation rules, where they estimate WeTune would run over ten years, they report finishing in about 30 and 395 days on their 16-thread server and adding 679,316 new rules (§VI-B, §VI-C). The abstract calls the result a library "exceeding 1 million rules", "the largest empirically validated rewrite rule library to date". They present the advance as reaching rule sizes "previously inaccessible" (§I).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [logical plan](#/glossary/logical-plan) · [query optimizer](#/glossary/query-optimizer) · [query equivalence](#/glossary/query-equivalence) · [integrity constraint](#/glossary/integrity-constraint) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [first-order logic](#/glossary/first-order-logic)

**The paper's own terms:**
- **node**: one operator in a plan tree; sizes are counted in nodes (abstract).
- **plan template**: a tree of operators over symbolic tables, attribute lists and predicates, with "data-specific details removed" (abstract, §III-A). The operators are Input, Project, Filter, InnerJoin, LeftJoin, RightJoin, InSub (keeps the rows whose value occurs in another relation, as in `IN (SELECT …)`) and Distinct (§III-A).
- **query rewrite rule** (Def. 1, §III-A): a source template, a destination template, a mapping between their symbols, and a constraint set C that guarantees the two are "semantically equivalent". C can equate two tables, attribute lists or predicates, or state conditions on the data: one attribute list is contained in another, every value of an attribute occurs in another table (RefAttrs), values are unique, or not NULL. A rule is **valid** when the destination has fewer nodes than the source and C is minimal: removing any one constraint breaks the equivalence.
- **redundant rule**: a rule whose removal from a rule set changes the rewrite result of no query (§IV-A, §IV-B).
- **standardized rule** (Def. 4, §IV-A): a rule with no constraints whose two templates become identical after swapping two adjacent operators or removing one operator. Swaps follow a fixed priority, Project > Distinct > Filter, so that repeated swaps settle into one canonical shape; operators with two inputs are excluded (§IV-A1).
- **small-to-large hypothesis** (Def. 2, §III-B): the idea that rules shrinking a large plan can be composed from rules over intermediate sizes, so large rules need not be enumerated directly.
- **RTP (Reduce by Template Pair)**: deduplication during enumeration, per pair of templates (Alg. 2, §IV-B).
- **effective rule**: a rule labelled 1 because rewriting with it reduced execution time in SQL Server, otherwise 0 (§V-A3, §V-B, §VI-A).

**Missing glossary terms:**
- **learning to rank, LambdaMART**: training a model to put the most relevant items of a list first, rather than to score each item in isolation; LambdaMART does it with boosted decision trees, weighting each wrongly ordered pair by how much swapping the two would change NDCG (§III-C, §V-A2–V-A3).
- **NDCG@n (normalized discounted cumulative gain)**: a ranking score that sums the gains of relevant items in the top n, each discounted by the logarithm of its position, divided by the score of the best possible order (§V-A3).
- **gradient-boosted decision trees (GBDT)**: an ensemble of decision trees in which each new tree is fitted to the prediction errors of the trees before it; the paper uses the LightGBM library (§V-A2).

**Builds on:**
- WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), "the state-of-the-art (SOTA) rule enumeration engine" (§I): SLER takes its operator set "In line with WeTune" (§III-A), follows its workload method and uses it as the main baseline (§VI-A).
- LambdaMART (Burges; not listed here) for the ranker (§III-B, §V).
- Tree-convolution plan encoders of the learned optimizers Bao, Neo and Lero (not listed here), which the ranker's template encoder draws on while leaving out costs, cardinalities and table data (§V-A1).

## Problem and setting

- **Question:** how to enumerate rules over five or more nodes without redundant candidates and verifier calls, and tell effective rules from trivial ones (§I "Challenges", §II "Research Gaps").
- **Operators:** Input, Project, Filter, inner, left and right joins, InSub and Distinct, which the authors say form "the backbone of most SPJ-style (Select-Project-Join) queries" (§VII "Scope and Limitations").
- **What "correct" means:** a rule's constraints must make source and destination semantically equivalent (Def. 1). An equivalence checker validates candidates (§III-C, §IV-A1); the paper names Z3, an SMT solver, as an example (§III-B), and says new operators need first-order-logic semantics "to enable Z3 verification" (§VII). Tab. IV gives each operator a formula, with NULL tests in the join and InSub formulas.
- **Workload:** 8,518 queries from unit tests of 15 open-source web applications, plus 3,000 commercial queries from Yashan DB, a production database, 11,518 in all (§VI-A).
- **Setup:** one server run with 16 threads; SQL Server 2019 gives the ranker's latency labels (§VI-A "Testbed").

## Approach

- **Motivation.** The authors test the small-to-large hypothesis and report that it "often fails": only 9% of 4→2-node rules can be composed from 4→3- and 3→2-node rules, so "most complex rules require direct enumeration" (§III-B). They also argue that solver proof lengths are unreliable measures of rule quality, especially for larger plans (§I).
- **Enumerator (§IV-A).** Algorithm 1 builds candidate standardized rules from each template by removing one single-input operator or swapping it with its parent by priority; the checker keeps the valid ones as a standardized rule base (§IV-A1). When some standardized rule rewrites an instantiated source template, the template counts as redundant and gets no rules; otherwise SLER enumerates minimal constraints for the pair (§IV-A2). The underlying property, that a non-standardized rule is redundant once a standardized rule exists for its source, the authors "informally validate through two cases" (§IV-A). They state that this cuts verification of redundant rules "from exponential to polynomial" (§IV-A), "for certain redundant templates" (§III-C).
- **Deduplicator (§IV-B).** Two changes against WeTune's pairwise de-redundancy: split the rule set into subsets, deduplicate each, then merge, justified by a proof sketch that a rule redundant in a subset is redundant in the whole set; and RTP, which keeps a rule base per template pair, discards a verified rule when adding it doesn't change how that base rewrites the rule's own source, and stops enumerating it (Alg. 2).
- **Ranker (§V).** Each rule becomes nine features: the distance and cosine similarity between tree-convolution embeddings of its two templates, and seven complexity counts from the operator formulas of Tab. IV (§V-A1). A LightGBM LambdaMART model, trained with the binary latency labels, scores rules (§V-A2–V-B). The ranker can optionally pre-filter template pairs so that only the top k are enumerated; a larger k keeps more of the rules a full enumeration finds, but takes longer (§V-C).

## Results

The authors report:

- **Speed against WeTune (Tab. V).** For 4-node rules, enumeration takes 20h 49m against WeTune's 67h 4m, and de-redundancy 9m 57s against 20d 19h. For 5 and 6 nodes, WeTune is "timeout", an estimated run of over 10 years, while SLER takes 29d 23h and 395d. The authors give no timelines for 7 or more nodes (§VI-B).
- **Rule count.** 26,508 new rules for 5 nodes and 652,808 for 6, 679,316 in all (§VI-A, §VI-C).
- **Ablation (Tab. VII).** At 4 nodes, verification calls fall from 314,860,926 without either part to 31.99% of that with standardized enumeration (OPT1) and 28.97% with RTP added (OPT2).
- **Ranker filtering (Fig. 7).** With 4-node rules, "a 40% template filtering rate yields over 80% effective rule coverage in just 143 minutes" (§VI-B). For 10-node templates, scaling to 5k templates yields "over 5.1k effective rules in 523 minutes" (§VI-B).
- **Ranking quality (Tab. IX, Fig. 8, §VI-D).** In SQL Server tests mixing 50–1,000 top-ranked with up to 200 low-ranked rules, top-ranked rules were applied and low-ranked ones never, and sorted rule lists rewrite queries with fewer rules than random orders.
- **New rules (Tab. X).** Twenty higher-ranked rules that, the authors say, WeTune did not discover (§VI-C); with Table I's examples they argue that SLER's larger rules rewrite in one step where WeTune needs several or fails (§VI-C).
- **End-to-end (Fig. 9, §VI-E).** "9 representative queries are selected to demonstrate superior results": SLER reaches WeTune's final plan in fewer steps (Q1–Q3), improves more (Q4–Q6), or improves where WeTune doesn't (Q7–Q9). They state that MySQL results were consistent (§VI-E).

## Limits the authors state

- Only the operators above are supported (§VII "Scope and Limitations").
- Even SLER's efficiency "degrades significantly beyond six nodes", with verification impractical from 7 nodes (§III-B); with the ranker, SLER "possibly facilitates scalable (but incomplete) enumeration" there (§VI-B).
- A small k risks "potentially missing some lower-ranked but still valuable rules"; they recommend tuning k per workload (§V-C).
- "Beyond 10 nodes, rules become overly specific and rarely triggered in real-world queries" (§VII "The Practical Bound…").
- The RTP ablation leaves out templates above 5 nodes, which the unoptimized baseline can't finish (§VI-D).
- The framework is "particularly effective for ORM-generated SQL queries" (§VII).

## Open problems and building blocks

- **Open:** extending SLER to aggregates, group-by and window functions, which needs their first-order-logic semantics for Z3 and matching standardized templates; "This represents a promising direction for future work" (§VII). They single out 7 to 9 nodes as the range to target (§VII "The Practical Bound…").
- **Released:** Nothing stated.
- **To reuse it:** an equivalence checker (Z3, §III-B, §VII); SQL Server latency runs for labels (§VI-A); LightGBM with learning rate 0.1, 62 leaves and 100 trees (§V-A2); run times as in Tab. V on 16 threads. They note "the enumeration is a one-time process" whose rules can then be put into a database system (§VII).

## On this site

- **Discussed in:** [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/prove-smt">prove-smt</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-smt">rewrite-smt</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
