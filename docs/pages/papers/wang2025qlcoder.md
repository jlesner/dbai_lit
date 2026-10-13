# QLCoder: A Query Synthesizer For Static Analysis of Security Vulnerabilities

**QLCoder** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2511.08462) · [arXiv](https://arxiv.org/abs/2511.08462)  
Code: [qlcoder](https://github.com/neuralprogram/qlcoder)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An agent built on Claude Code that writes a CodeQL static-analysis query from a CVE's metadata; a query counts as successful only if it compiles, reports a dataflow path through the patched code in the vulnerable version, and reports none through it in the fixed version (§3.1); the authors report success for 53.4% of 176 Java CVEs (abstract; Tab. 1).
- Each of up to 10 iterations runs an inner tool loop of up to 50 turns against a ChromaDB vector database (vulnerability notes and diffs, CWE definitions, same-version CodeQL documentation, sample queries, AST snippets) and the authors' CodeQL language-server MCP server (completion, diagnostics, definitions); a validator then runs the query on both versions and returns a report of compilation, match counts, recall and coverage, counterexample hits and template-generated next steps (§3.2–3.3, App. D.2).

## In plain words

Static analysis tools such as CodeQL detect potential vulnerabilities with queries over code, but writing them takes knowledge of an unfamiliar query language, program analysis and security (abstract; §1). The authors call existing query collections "severely limited in coverage of vulnerabilities and precision", while vulnerability reports, which record buggy and fixed code, remain "largely untapped" for building queries (§1). QLCoder, an agent built on Claude Code (Anthropic's coding agent), writes a CodeQL query from a vulnerability report: it retrieves documentation and examples, consults a language checker, and runs each draft on both versions until the query detects the vulnerability in the buggy version, not the fixed one, or rounds run out (abstract; §3). It succeeds for 53.4% of 176 Java vulnerabilities; Claude Code without QLCoder's tools succeeds for 10% on a 20-vulnerability subset where QLCoder reaches 50% (abstract; Tab. 4). Its queries average F1 0.7, against 0.048 and 0.073 for the general query suites of IRIS (an LLM-assisted static analyzer) and CodeQL, on 130 shared vulnerabilities (abstract; Tab. 2). The authors call it "a novel integration of execution-guided synthesis, semantic retrieval, and structured reasoning" (§1).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [low-resource programming language](#/glossary/low-resource-programming-language) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [vector store](#/glossary/vector-store) · [tool calling](#/glossary/tool-calling-function-calling) · [F1 score](#/glossary/f1-score) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **Vulnerability path query**: a CodeQL query that, run on a program's dataflow graph (how values flow between program points, across functions), returns paths from a source to a sink (§3.1).
- **Additional taint step**: an edge the query itself adds, to make up for flows missing from CodeQL's graph (§3.1).
- **Patched region**: the graph nodes for the code the fix changed (§3.1).
- **Valid** and **successful** query: valid when it compiles and runs; successful when it also meets the two conditions below (§3.1).
- **Context engineering**: the authors' name for designing the agent's initial prompt and toolbox (§3.2–3.3).

**Missing glossary terms:**
- **Static analysis**: "a technique to analyze programs without executing them" (§1).
- **Taint analysis (source, sink, sanitizer)**: finding dataflow paths from a source, where untrusted data enters (e.g. an API endpoint accepting user input), to a sink where it does harm (e.g. a database write), that "lack proper sanitization" (e.g. filtering malicious data) (§3.1).
- **CVE and CWE**: a CVE (Common Vulnerabilities and Exposures entry) is one recorded vulnerability, whose databases hold a description and the buggy and patched versions (§1); a CWE (Common Weakness Enumeration category) is a weakness type, such as path traversal (§1; Tab. 1).
- **Model Context Protocol (MCP)**: a protocol through which an agent calls tools that a separate server provides (general definition).
- **Language Server Protocol (LSP)**: the protocol editors use to ask a language's server for completions, error diagnostics and definitions (general definition); QLCoder uses it "for syntax guidance" (abstract).

**Bridge:** in the glossary's terms, QLCoder is an [agent harness](#/glossary/agent-harness) around Claude Code.

**Builds on:**
- IRIS (Li et al., 2025b), "a recent LLM-assisted static analyzer" whose LLM finds sources and sinks for CodeQL; its benchmark CWE-Bench-Java (Java CVEs with metadata and fix commits) is the dataset, and its queries a baseline (§1; §4.1; §6). Not on this site.
- CodeQL's own security queries, version 2.22.2, the other baseline (§4.1; App. A).
- Claude Code (Anthropic, 2025a), the framework QLCoder runs on, with Gemini CLI and Codex (Google's and OpenAI's coding agents) as alternatives (§4.1; §4.5).
- KNighter (Yang et al., 2025), which writes static-analysis checkers in C from a fix commit, and MocQ (Li et al., 2025a), which has an LLM derive a subset of CodeQL and Joern (another code-query tool) and loops on feedback; the authors contrast both with QLCoder (§6). Not on this site.

## Problem and setting

- **Question:** from a vulnerable project version, its fixed version and the CVE's text, synthesize a CodeQL query that captures the vulnerability (§3.1).
- **Correct (§3.1):** the query compiles and runs under the latest CodeQL syntax; it reports at least one path in the vulnerable version through the patched region; and no path it reports on the fixed version passes through the patched locations. The authors note these criteria may admit false positive paths (see Limits).
- **Metrics (§4.2):** per query, recall is 1 if some vulnerable-version path passes through the patch, else 0; precision is the share of its vulnerable-version paths that do; F1 combines them. The feedback and example queries count hits per method (App. D.2–D.3).
- **Data (§4.1; §1):** CWE-Bench-Java and its 2025 update, as far as the authors could build them: 176 CVEs across 111 projects and 42 CWE categories, 65 of them from 2025.
- **Models (§4.1; Tab. 5):** Claude Sonnet 4 in Claude Code; baselines Codex with GPT-5 (minimal and medium reasoning effort) or the open model gpt-oss-20b, and Gemini CLI with Gemini 2.5 Flash or Pro.

## Approach

- **Loop (§3.2, Fig. 3).** The agent proposes a query; a validator compiles it and runs it on both versions, derived from the patch commit in the CVE metadata, and the loop stops on success or after 10 iterations. The report holds compilation results, match counts, recall and coverage, counterexample traces and hit locations, and next steps generated from a template (§3.2; App. D.2).
- **Inner loop (§3.2).** Up to 50 tool calls per draft; history is not carried across iterations, "to keep context compact and relevant". The first prompt holds a query skeleton to fill in, later ones the goal, the previous query and its report (§3.3; App. D.1).
- **Vector database (§3.3).** A ChromaDB server (a vector database) holds vulnerability notes and diffs, CWE definitions, same-version CodeQL documentation, example queries, and AST snippets of the patched files (extracted by a CodeQL query, App. D.4); the authors filtered patch diffs by hand to the CVE.
- **Language server (§3.3; App. C).** The authors' MCP server passes completion, diagnostics and go-to-definition calls to CodeQL's language server, helping the agent find correct API and AST names and see compile errors.
- **Rejected designs (§3.4; App. B).** Free compiling and running ("expensive operations that the LLM soon overused"), web search, which "pollutes the working context", a large toolbox ("a small, well-scoped toolbox yields more reliable actions"), and full histories across iterations, which "induced context rot and ballooning prompt sizes" (context rot: worse answers as the context fills).

## Results

- **Overall (§1; Tab. 1).** 94 of 176 CVEs succeed (53.4%); 99.4% of queries compile. The group of CWEs with four or fewer CVEs has the lowest success (Tab. 1; App. A, Tab. 6).
- **Against static analyzers (Tab. 2, 130 shared CVEs).** Average F1 0.700 against 0.048 (IRIS) and 0.073 (CodeQL); recall 80.0% against 35.4% and 20.0%. The authors attribute the baselines' low precision to missing true-positive recall; IRIS's queries define no sanitizers or taint steps (§4.3). On 102 CVEs, CodeQL, IRIS and QLCoder show "significantly higher" recall than the analyzers Snyk and SpotBugs (§4.3; Fig. 5).
- **Training cut-off (§4.3; Tab. 3).** The authors say QLCoder "performs consistently regardless of CVEs before or after the cut-off period"; Tab. 3 gives lower success, precision and F1 for the 2025 CVEs.
- **Ablation (§4.4; Tab. 4, 20 CVEs).** Success falls from 50% to 25% without the language server, 20% without documentation and examples, 25% without AST snippets, and 10% for Claude Code with only the feedback loop. Recall holds without AST snippets but falls without the language server or documentation, which the authors read as "the LSP and documentation lookup impact the synthesis performance more"; Claude Code without tools reached high recall "yet failed to synthesize queries without false positives when executed on the fixed version".
- **Other agents (§4.5; Tab. 5, a different list of 20 CVEs from 2025, Tab. 9).** With QLCoder, Claude Code rises from 10% to 35% success and Codex with GPT-5 at medium effort from 0% to 20%; both Gemini models stay at 0%, though they compile more. Without QLCoder, the Gemini 2.5 Flash and both GPT-5 runs compile on none of the CVEs (App. A, Fig. 7).
- **Cost (§4.6).** 3712 seconds and 2.90 USD per query on average; queries finishing in under 3000 seconds mostly succeed (Fig. 6).
- **Variant analysis (§5.2).** Running one synthesized query on other repositories, the authors "reported 2 unknown bugs in 2 different repositories".

## Limits the authors state

- The success criteria "may admit potentially false positive paths in both versions"; precision constraints "might further complicate synthesis" (§3.1).
- "We omit CVEs where the vulnerability involves non-Java code such as configuration files or other languages" (§7, "Limitations").
- "QLCoder can be used with exploit generation to find vulnerabilities that are realized during dynamic execution" (§7, "Limitations"); exploit generation means producing inputs that trigger the bug.
- Claude Sonnet 4's "official training cut-off is March 2025, however the 2025 CVEs evaluated were reported between January to August 2025" (§7).
- Only 111 of 120 IRIS CVEs and 65 of 91 CVEs from 2025 could be built and used (§4.1).
- Codex CLI had no maximum-turns setting as of 9/23/2025, so "we were not able to force Codex to always take up to 50 max turns each context window" (App. A.1).
- IRIS supports only some CWEs, and 24 of the 65 2025 CVEs could be used with it; for IRIS queries that ran out of memory, "we treat those as queries with 0 results and false recall" (App. A.1).
- "Not all of CWEs represented in our evaluation have corresponding CodeQL CWE queries" (App. A).
- For gpt-oss-20b, "we had to break down our prompts into smaller tasks and increase query writing iterations" (§4.5).

## Open problems and building blocks

  - Future work: "explore efficient ways to synthesize, and to combine our synthesized queries with dynamic analysis tools" (§7), i.e. tools that analyze programs by running them.
  - Other CodeQL versions and languages need matching documentation and queries in the database (§5.1; §7); other engines could be reached through their language servers (Semgrep, Snyk) or an MCP server wrapping their commands (§5.1).
  - "one could consider an early stop policy around 3000 seconds" (§4.6).
- **Released:** "QLCoder is available at" a GitHub repository (abstract); the language-server MCP server's code is linked (App. C); the conclusion says "We will also open source our CodeQL LSP MCP server and QLCoder" (§7).
- **To reuse it:** Claude Code with Claude Sonnet 4, CodeQL 2.22.2 and stated hardware (§4.1); a ChromaDB MCP server (§3.3); the patch commit in the CVE metadata (§3.2); hand-filtered patch diffs (§3.3).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
