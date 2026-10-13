# AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation

**AutoScraper** · EMNLP 2024 (main)

Read: [PDF](https://arxiv.org/pdf/2404.12753) · [arXiv](https://arxiv.org/abs/2404.12753) · [DOI](https://doi.org/10.18653/v1/2024.emnlp-main.141)  
Code: [AutoScraper](https://github.com/EZ-hwh/AutoScraper)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Has an LLM write a web scraper for one website, a sequence of XPath expressions built from a few seed pages, which a parser then runs on the site's other pages without the LLM (abstract; §3.1; §4.1).
- Progressive generation: the LLM writes an XPath, a parser runs it, and when the result doesn't match the value the LLM read, the search steps back up the page's element tree and retries on the smaller subtree (§4.2, Alg. 1); synthesis: the sequences from several seed pages are each run on all of them and the LLM picks one (§4.3; App. D.2, "Prompt of Synthesis"). Scored by a new "executability metric" over all of a site's test pages (abstract; §3.3), with closed and open LLMs on SWDE, Extended SWDE and DS1 (§5.1).
- Evidence on compact against frontier models writing programs in a small language checked by execution: the authors report that "models with small parameter sizes have significant difficulties in understanding and writing executable paths" (§5.2), and with AutoScraper Phi-3-medium writes a fully correct scraper for 24.06% of SWDE cases (Tab. 2), below every closed model in that table. A program written once is reused without the LLM (§6.3), but direct extraction by the LLM itself scores higher for every model except GPT-4-Turbo (§6.1, Tab. 4).

## In plain words

Pulling one kind of fact out of thousands of pages of one website is the job of a scraper, a small program written for that site. Wrapper-based methods struggle with entirely new site structures, and relying on powerful API-based LLMs to read the pages "incurs considerable time and financial costs" (§1). The authors "introduce the paradigm of generating web scrapers with LLMs" (abstract). AutoScraper has the LLM write the scraper from a few sample pages as a sequence of XPath expressions (paths that pick parts out of a page), narrowing the page step by step and choosing among versions written on different pages; the scraper then runs on the site's other pages without the LLM (§1; §4). They also propose a metric counting a scraper as correct only when its output is exactly right on all of a site's test pages (§3.3). With GPT-4-Turbo and no examples, on the SWDE benchmark (labelled pages from websites on cars, books, jobs and more), the scrapers were fully correct for 71.56% of cases (one site with one attribute to extract) against 67.50% for Reflexion (an agent that retries after reflecting on failures) and 61.88% for chain of thought (Tab. 2). They report "new state-of-the-art results in zero-shot settings" (§1), and that small models struggle (§5.2).

## Background and terms

**Terms to know:** [F1 score](#/glossary/f1-score) (the paper's precision, recall and macro-F1, the mean over cases, §5.1) · [self-correction](#/glossary/self-correction) (the retries after a failed XPath) · [agent harness](#/glossary/agent-harness) · [DOM tree](#/glossary/dom-tree) · [wrapper](#/glossary/wrapper-web-data-extraction) (the paper's gloss for learned wrappers: "a DOM-specific parser that can extract content", §2). In the glossary's terms, AutoScraper's generation loop is a small agent harness around a fixed LLM (our reading).

**Missing glossary terms:**
- **XPath**: a query language for picking nodes (elements, attributes, text) out of an HTML or XML document by their path in its tree (general definition; the paper only links Wikipedia, §4.1).

**The paper's own terms:**
- **Scraper generation task**: given pages from one website, each describing a subject entity, and a target attribute, produce an executable "rule/action sequence" that extracts the attribute from all of them (§3.1).
- **Case**: one website's sampled pages plus one extraction instruction, e.g. "Please extract the team of the player he plays now" on ESPN (§3.2).
- **Action sequence**: a list of XPath expressions run in order by a parser; all but the last prune the page, the last extracts the value (§4.1, Eq. 2).
- **Seed webpages**: the few pages of a case the scraper is generated from (§4.1).
- **Top-down / step-back**: the two moves of progressive generation, going down the DOM tree to the target node, and moving back up to a node that still holds the target (§4.2).
- **Executable evaluation**: each case is classed by the scraper's precision, recall and F1 over all its pages as Correct (all three equal 1), Prec. (only precision 1), Reca. (only recall 1), Unex. (un-executable, recall 0), Over. (over-estimate: precision 0, it extracts something where the ground truth is empty) or Else; each class is reported as its share of cases (§3.3, Eq. 1).
- **Direct extraction**: prompting the LLM to extract the value from each page itself, with no scraper (§6.1).
- **XPath fragility**: an XPath that stops matching the target on new pages, mainly because its conditions (predicates) name specific information such as text or `@class`; the paper studies the text case (App. B.2, Tab. 14).

**Builds on:**
- Wrapper-based extraction: rule-based, learned wrappers (e.g. Kushmerick, 1997; Dalvi et al., 2011), heuristics and neural models, which the authors say "demand substantial human involvement" (§2).
- Language agents that reflect on failures: chain of thought (Wei et al., 2023) and Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), its two baselines (§2; §5.1).
- Supervised extractors compared in §6.2: Render-Full (visual-distance heuristics), FreeDOM, SimpDOM, MarkupLM and WebFormer (neural models of page text and markup).

## Problem and setting

The question: can an LLM write, from a few pages, a scraper that extracts one attribute correctly from every page of a website, and do better than prompting baselines (§5, research questions)?

- **Data (§3.2, Tab. 1):** SWDE, a "Structured Web Data Extraction dataset" of 80 websites in 8 domains (e.g. auto, book, job, NBA player), each site with 3–5 attributes; Extended SWDE, a finer manual annotation of 21 SWDE sites in 3 domains (294 attributes kept, App. A.1); DS1, annotated pages from 30 real-life websites in books, shopping, hotels and movies. 100 pages are sampled per website as the test set (§3.2).
- **Pre-processing (§3.2):** script and style elements, and all attributes but `@class` (the element's style class), are removed.
- **Models (§5.1):** closed GPT-3.5-Turbo, Gemini Pro, GPT-4-o-mini and GPT-4-Turbo; open Phi-3-medium, CodeLlama-34B, Mixtral 8×7B and Deepseek-Coder-33B. "Due to the limited-length context of LLMs, all experiments are conducted under zero-shot settings" (§5.1).
- **Settings (§5.1):** 3 seed pages for SWDE and Extended SWDE, 1 for DS1, and at most 5 retries. DS1 has two pages per site, one used for generation and one for evaluation, so synthesis is not applied there (App. A.2).
- **Correctness:** a case is Correct only when the scraper's precision, recall and F1 on the case's pages all equal 1 (§3.3); the ground truth is the datasets' annotations. The seed pages are drawn from the case's own pages (§4.1); whether they are left out of the scoring is not discussed.

## Approach

- **Progressive generation (§4.2, Alg. 1).** The LLM sees the current HTML (first the whole page) and the instruction, writes an XPath to the node holding the target, and states the value it reads; a parser runs the XPath, and the LLM judges whether the result matches its value (§4.2). If not, the step-back move climbs from the failed node (appending `/..` to the XPath) until the subtree still contains the value, which the LLM judges with its own prompt (App. D.2); that XPath becomes a pruning step and top-down repeats on the smaller subtree. In the main setting the LLM finds the value itself; App. A.3 gives it the gold values instead.
- **Synthesis (§4.3).** One action sequence is generated per randomly chosen seed page; every sequence is run on all seed pages, and one "that can extract all the target information in the web pages" is chosen (§4.3), by an LLM given the sequences and their results (App. D.2, "Prompt of Synthesis").
- **Against the baselines (App. B.1, Fig. 4).** Chain of thought writes the XPath in one turn; Reflexion retries after failed execution but "does not effectively simplify the webpage".
- **Cost model (§6.3, Eq. 3–6).** Generation and synthesis once plus a parser run per page, against an LLM call per page; Eq. 6 gives the break-even page count.

## Results

- **Main comparison (§5.2, Tab. 2).** AutoScraper has the highest Correct and lowest Unexecutable ratios on SWDE for every model; with GPT-4-Turbo, Correct is 71.56% against 67.50% (Reflexion) and 61.88% (chain of thought). The authors note that Mixtral 8×7B with AutoScraper beats GPT-3.5-Turbo with Reflexion, and that precision, a traditional extraction metric, "fails to reveal the performance gap" because it ignores unexecutable or empty extractions (§5.2). Extended SWDE and DS1: Tab. 2 and Tab. 7–8 (App. A.1–A.2).
- **Gold values given (App. A.3, Tab. 9).** The authors report that AutoScraper still helps, and find the open models' "bottleneck … lies not in understanding the webpage content but in understanding the webpage's hierarchical structure itself."
- **Ablation (§5.3, Tab. 3).** Removing synthesis lowers GPT-4-Turbo + AutoScraper's Correct from 71.56% to 65.31%; the authors report that synthesis also improves the baselines. More seed pages raise Correct, with shrinking gains (§5.4, Fig. 3, GPT-4-Turbo and GPT-3.5-Turbo, no value labels).
- **Against direct extraction (§6.1, Tab. 4).** In F1, direct extraction beats AutoScraper for every model except GPT-4-Turbo, where AutoScraper scores 88.69 against 78.56 for direct extraction; Phi-3-medium, for one, scores 71.73 directly and 34.93 with AutoScraper. The authors read this as small models understanding content but not page structure.
- **Against supervised extractors (§6.2, Tab. 5).** GPT-4-Turbo + AutoScraper's F1 is above all five, the best, WebFormer, scoring 86.58; the supervised models are trained on one seed site each (Tab. 5 caption).
- **Efficiency (§6.3, Tab. 6).** On GPT-4-Turbo, one site per SWDE domain, the scraper pays off after "19.5 on average" pages, which the authors call "significantly lower than the average number of web pages per site" in SWDE.
- **Failures (§6.4; App. B.2).** In GPT-4-Turbo's traces: pages of one site that differ in structure, and targets found in several places on a page (§6.4). By the authors' manual count, stronger models produce fewer fragile XPaths, but "the current SoTA LLM GPT-4-Turbo still suffers from an XPath fragility problem" (SoTA: state of the art) (App. B.2, Tab. 13).

## Limits the authors state

- "our framework is restricted to the paradigm in the information extraction task for vertical web pages" (sites of one domain, such as book or job sites); LLMs with scrapers "can hardly transfer to existing web environments" such as Mind2Web and WebArena (web-agent benchmarks of tasks such as shopping or booking) (§ "Limitation").
- "our framework relies on the performance of backbone LLMs"; enhancing their ability to understand HTML is "a very valuable research question", which they will study "in future work" (§ "Limitation").
- "Models with small parameter sizes have significant difficulties in understanding and writing executable paths, so they can be considered challenging to apply in this task" (§5.2).
- The gain from more seed pages has "an upper limit" (§5.4).
- Unclear task descriptions in Extended SWDE (e.g. "Calendar System") "affect the wrapper generation performance of all methods" (App. A.1).
- They call the comparison with supervised extractors "unfair because our method is in zero-shot settings" (§6.2).
- The datasets come from public sources, but "we cannot guarantee that the datasets do not contain any socially harmful or toxic language" (§ "Ethic statement", "Risks").

## Open problems and building blocks

- **Open:** for multi-valued targets, "crafting a comprehensive action sequence that captures all of the information remains a challenge" (§6.4); "relying entirely on LLMs to generate reliable XPath still has some distance to go" (App. B.2); the bottleneck they name for open models is understanding page structure (App. A.3).
- **Released:** "Our work is now open-source", with a footnote pointing to the paper's resources (abstract, footnote 1).
- **To reuse it:** an LLM able to write XPath (8 tested, §5.1), an XPath parser, HTML cleaned as in §3.2, a few seed pages per site (3 in the main runs) and up to 5 retries (§5.1). Prompts: App. D.

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
