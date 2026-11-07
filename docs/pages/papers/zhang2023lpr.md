# LPR: Large Language Models-Aided Program Reduction

**LPR** · ISSTA 2024

Read: [PDF](https://arxiv.org/pdf/2312.13064) · [arXiv](https://arxiv.org/abs/2312.13064) · [DOI](https://doi.org/10.1145/3650212.3652126)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Shrinks programs that trigger compiler bugs, in C, Rust and JavaScript, to smaller ones that still trigger the bug, by having an LLM make the language-specific transformations that a language-generic reducer can't (abstract, §1).
- Alternates the syntax-guided reducer Perses with gpt-3.5-turbo prompted for five transformations (function inlining, loop unrolling, data type elimination, data type simplification, variable elimination); the LLM first lists the targets of a transformation, then transforms one target per query ("multi-level prompt"), and a result is kept only if the property test (the bug still triggers) passes (§2.1.1, §3.2–3.4, Alg. 1, §4.1).
- The authors report that running Vulcan on LPR's output gives a mean of 86.1 tokens on their 20 C programs against 85.7 for the C-specific reducer C-Reduce (Tab. 1).

## In plain words

When a compiler crashes or miscompiles a program, developers want the smallest program still showing the bug. Tools that shrink such programs either work for any language but know nothing about its meaning, or are hand-built for one language, which the authors say takes deep language knowledge and much engineering, so only a few languages have one (§1). LPR lets an LLM do the language-aware rewriting (such as inlining a function, unrolling a loop or removing a type alias) and leaves the deleting to a language-independent shrinker; a rewrite is kept only if the program still triggers the bug (§3.2). The authors present it as "the first LLMs-aided technique leveraging LLMs to perform language-specific program reduction for multiple languages" (abstract). On 50 bug-triggering programs in C, Rust and JavaScript, with GPT-3.5 and averaged over five runs, they report programs 24.93%, 4.47% and 11.71% smaller than those of Vulcan, which they call "the state-of-the-art language-generic program reducer" (abstract; Tab. 1). Running Vulcan after LPR gives C programs on par with those of C-Reduce, a shrinker built for C (abstract; §4.2).

## Background and terms

**Terms to know:** [delta debugging](#/glossary/delta-debugging) (the classic shrinking algorithm; the task is test-case reduction) · [context-free grammar](#/glossary/context-free-grammar) · [test oracle](#/glossary/test-oracle) · [fuzzing](#/glossary/fuzzing) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [data contamination](#/glossary/data-contamination) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy)

**The paper's own terms:**
- **program reduction**: given a program P and a property ψ that P has (e.g. triggering a compiler bug), search for a minimal program that still has ψ (§1, §2.1). A **program reducer** is a tool that does it.
- **property test**: running ψ on a candidate program, i.e. checking that the bug still triggers (§3.2, Alg. 1; §5.3). It is the only check a transformed program has to pass; in the glossary's terms it is the test oracle (ours).
- **language-generic and language-specific reducers**: the first work on any language given its formal syntax, the second transform programs with passes designed for one language's features (§2.1.1–2.1.2). In the glossary's terms the formal syntax is a grammar (ours).
- **the five transformations** (§3.3): **Function Inlining** replaces a function's call sites with its body; **Loop Unrolling** turns a loop into repeated copies of its body; **Data Type Elimination** replaces a type alias (C's `typedef`, Rust's `type`) by the type it names; **Data Type Simplification** turns variables of complex types (e.g. structures, arrays, pointers) into variables of primitive types; **Variable Elimination** removes intermediate and unused variables, including an unused parameter together with the arguments passed to it.
- **multi-level prompt**: a **primary question** asks the LLM to list the targets of one transformation (e.g. all functions that can be inlined), then one **follow-up question** per target asks it to apply the transformation to that target alone (§3.4, Fig. 3). The **single-level prompt** of §5.1 merges the two.
- **data leakage**: the paper's name for the risk that the LLM memorized the benchmarks' reduced programs, i.e. data contamination (§4.1, §5.4.1).
- Requesting n=5 responses per query and keeping the smallest that passes the property test (§4.1 "Configuration") is, in the glossary's terms, best-of-N sampling (ours).

**Builds on:**
- Perses (Sun et al., 2018), a grammar-guided reducer that avoids syntactically invalid variants; LPR calls it inside its loop (§2.1.1, §3.2, §4.1).
- Vulcan (Xu et al., 2023), which extends Perses with identifier and subtree replacement and local exhaustive search; the main baseline (§2.1.1, §4.1).
- C-Reduce (Regehr et al., 2012), a reducer with passes written for C, which the authors call "the most effective reduction tool for C code" (§2.1.2); a baseline.
- HDD (Misherghi and Su, 2006), which applies delta debugging's ddmin (Zeller and Hildebrandt, 2002) at each level of the parse tree (§2.1.1, §6.1). None of these is on this site.

## Problem and setting

**The question:** can an LLM supply the language-specific transformations a language-generic reducer lacks, across languages, without hand-written passes (§1)?

**Assumptions:**
- The property is a test run on the program (it still triggers the bug); each candidate the LLM returns is kept or discarded by this test alone (§3.2, Alg. 1; §5.3).
- **Benchmarks** (§4.1 "Benchmarks"): Benchmark-C, 20 large C programs that trigger real bugs in the compilers LLVM or GCC, from earlier studies; Benchmark-Rust, 20 bug-triggering Rust programs from prior research; Benchmark-JS, 10 programs the authors collected by fuzzing the JavaScript engine JavaScriptCore with the fuzzer FuzzJIT, each causing a miscompilation (wrong code) in its just-in-time compiler; they were not public at the time of the LLMs' training, so, the authors say, not in their training data.
- **Configuration** (§4.1 "Configuration"): "If not otherwise specified", the LLM is gpt-3.5-turbo-0613 through the OpenAI API, at temperature 1.0 with n=5, other settings at their defaults; the language-generic reducer is Perses.
- **Measures:** final program size in tokens, five runs per benchmark for LPR and LPR+Vulcan (Vulcan run on LPR's result, §4.1), mean and standard deviation (§4.2); wall-clock time as users perceive it (§4.3). How tokens are counted: not discussed.

## Approach

- **The loop** (§3.2, Fig. 2, Alg. 1). Perses first shrinks the program to a size the LLM can process. Then, for each transformation in turn: the primary question yields a target list; for each target, the follow-up question returns several transformed programs, of which LPR keeps the smallest that passes the property test, or the program from before the query if none passes; after each transformation, Perses runs again, since the transformation may have opened new chances to delete code. The outer loop repeats until the size stops decreasing (a fixpoint).
- **Why rewrites that grow the program help** (§3.1, Fig. 1): in the example LLVM-31259, the LLM fully unrolls nested loops, which makes the program temporarily larger, and Perses then deletes every line except the bug-relevant one; the results of Vulcan and C-Reduce keep loops.
- **Prompts** (§3.4, Fig. 3): each transformation is a pair of natural-language prompts; the authors say LPR is "easy and flexible to extend with new transformations by simply designing new prompts" (§1).

## Results

- **Program size** (§4.2, Tab. 1). The authors report LPR's programs 24.93%, 4.47% and 11.71% smaller than Vulcan's on C, Rust and JavaScript (abstract), on C "proved by a p-value of 0.002" (the chance of so large a difference if both did equally well). On Rust they describe Vulcan and LPR as complementary: Vulcan better on relatively smaller programs, LPR on larger ones. On C, LPR+Vulcan averages 86.1 tokens against 85.7 for C-Reduce. On Rust and JavaScript, C-Reduce's averages are larger than LPR's and Vulcan's, which the authors put down to its lacking transformations for those languages.
- **Time** (§4.3, Tab. 2). LPR takes 10.77%, 34.88% and 36.96% less time than Vulcan to finish all benchmarks of each suite (abstract), but on C, averaged per benchmark, it takes 45.83% more time than Vulcan: the authors say LPR is faster on large, complex programs and slower on small ones. Waiting for the LLM is 32.26%, 28.11% and 72.99% of LPR's time on the three suites. On C a benchmark costs $0.42 on average, with 41 queries of about 39 seconds each.
- **Each transformation** (§4.4, Figs. 4–6, on Benchmark-C). Function Inlining, Data Type Elimination and Variable Elimination are more likely to shrink programs on their own; Loop Unrolling and Data Type Simplification usually grow them, yet counted together with the Perses run that follows, all five result in size decreases (Fig. 4). Function Inlining accounts for most of the total decrease, Loop Unrolling for the least and on the fewest benchmarks (Figs. 5–6).
- **Multi-level against single-level prompts** (§5.1). On Benchmark-C over five runs, the single-level prompt ends at 155.0 ± 8.7 tokens against 105.8 ± 4.4 for the multi-level one.
- **Temperature and other LLMs** (§5.2, Tab. 3; §5.4.2, Tab. 4), on the 10 Benchmark-C programs that finish fastest: sizes are similar at temperatures from 0.25 to 1 and worse at 0; CodeLlama-13b and CodeLlama-34b (a family of open code LLMs) "show no significant differences from results on ChatGPT".

## Limits the authors state

- The measured time "cannot be directly used to compare the computational resources consumed by LPR with those consumed by other techniques": the LLM runs on GPUs behind the OpenAI API, and its resource use can't be measured (§4.3, footnote 1).
- The API runs "might have been limited by high user traffic and few computational resources allocated" (§4.3).
- On small, simple programs LPR is slower than Vulcan, because the LLM's time does not decrease significantly and dominates (§4.3).
- Both LPR and Vulcan can run for a very long time on some Rust benchmarks, often because Perses is called frequently for marginal progress, its slowness due mainly to Rust's strict syntax; since program reduction is NP-complete, "this inefficiency might be optimized in the future, whereas it cannot be completely eliminated" (§4.3).
- The LLM's randomness brings variability: on complex programs, such as GCC-59903, the spread across runs can be large, as the LLM "might not consistently execute accurate transformations" (§5.2).
- Variants that fail the property test are "common and acceptable": the LLM may transform a complex program wrongly, or a correct transformation may remove the pattern that triggers the bug (e.g. inlining the function call the compiler crashes on) (§5.3).
- Loop Unrolling and Data Type Simplification vary more across runs, which suggests they "present greater challenges for the LLM to effectively handle" (§4.4).
- Data leakage is the main internal threat; the authors argue that bug-triggering programs are random and unlikely to be memorized, and that Benchmark-JS is not public (§5.4.1).
- "LLMs used by LPR may have limited knowledge of certain languages, which may affect the performance of LPR" (§5.4.2).
- The temperature and CodeLlama experiments use 10 benchmarks "Due to limited resources and time" (§5.2, §5.4.2).

## Open problems and building blocks

- **Open:** for a new language that LLMs can't recognize, the authors propose adding few-shot examples to LPR's prompts: "Further exploration of this approach will be left as future work" (§5.4.2). None other stated.
- **Released:** "For replication, we have implemented LPR and released it publicly" (§8), citing an artifact on Zenodo.
- **To reuse it:** a language-generic reducer for the language (Perses in the experiments) (§4.1); an LLM through an API, gpt-3.5-turbo-0613 in the main runs, CodeLlama-13b or -34b also tested (§4.1, §5.4.2); a property-test script; two natural-language prompts per transformation (§3.4). The reported cost on C is about $0.42 and 41 queries per benchmark, and runs take hours on the larger programs (§4.3, Tab. 2).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a></span>
