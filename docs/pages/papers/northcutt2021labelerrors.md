# Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks

**Pervasive Label Errors in…** · NeurIPS 2021 (Datasets and Benchmarks)

Read: [PDF](https://arxiv.org/pdf/2103.14749) · [arXiv](https://arxiv.org/abs/2103.14749)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Finds label errors in the test sets of 10 common image, text and audio datasets, among them ImageNet, CIFAR-10, IMDB and AudioSet: confident learning flags likely errors from a model's out-of-sample predicted probabilities, and five Mechanical Turk workers judge each flagged example, or a random sample of them for QuickDraw and Amazon Reviews (abstract; §3; §4; Tab. 1).
- Re-scores 34 pretrained ImageNet and 13 CIFAR-10 models on corrected labels: rankings on the whole test set barely change, but on the originally mislabeled examples the higher-capacity models do worse, and as the share of mislabeled test data grows, model selection by original accuracy is "more likely to select" models that are worse on corrected labels (§5; §5.1, Fig. 3; §5.2).
- A classical audit of benchmark ground truth (<a class="tag" href="#/tags/labels">labels</a>), with no LLM, which listed [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") (§5.1.2) and [Certified Against Which Oracle?](#/papers/liu2026whichoracle "Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL (2026)") (§2) cite for label noise in test sets. The authors estimate at least 3.3% label errors on average across the 10 test sets (abstract; §1; Tab. 1); only flagged examples were checked, except for an expert sample of unflagged ImageNet examples (§6).

## In plain words

Researchers rank machine learning models by accuracy on a benchmark's test set, whose labels are often treated as correct. The authors call this "a fallacy": if label errors "occurred profusely", they "could potentially undermine the framework by which we measure progress" (§1). An algorithm flagged likely wrong labels in the test sets of 10 widely used image, text and audio datasets, and paid online crowd workers judged the flagged examples. They estimate "an average of at least 3.3% errors across the 10 datasets"; on average 51% of flagged candidates were confirmed (abstract). On corrected labels, rankings over the whole ImageNet test data barely change, but on the originally mislabeled examples the models best on the old labels are worst on the corrected ones (§5, §5.1). On ImageNet with corrected labels, the smaller ResNet-18 "outperforms ResNet-50 if the prevalence of originally mislabeled test examples increases by just 6%" (abstract). They present "the first study that systematically characterizes label errors across 10 datasets commonly used for benchmarking" (§1), a measurement study rather than a new method (§1).

## Background and terms

**Terms to know:** none in the glossary yet; see Missing glossary terms below.

**The paper's own terms:**
- **label error**: a flagged example counts as an error when fewer than 3 of 5 crowd workers agree it has its given label, the **agreement threshold** (§4); 4 and 5 of 5 are also reported (App. F). Errors are "correctable" (a majority agree on the suggested label), "multi-label" (both labels), "neither", or "non-agreement" (no majority) (§4).
- **original accuracy**: accuracy against the given labels, "the standard way practitioners evaluate their models today" (§5, Def. 1). **Corrected accuracy**: accuracy after identified errors were corrected by humans "when possible and removed when not" (§5, Def. 2).
- **benign, unknown-label, pruned and correctable sets** (§5, Defs. 3–6): benign examples were not flagged, or were kept by the workers; unknown-label examples got no agreed single label; the pruned set drops them; the correctable set is the flagged examples relabeled by consensus.
- **noise prevalence**: the correctable set's share of the pruned set (§5, Def. 7); it "differs from the fraction of label errors originally found in each of the test sets" (§5), Tab. 1's "% error".
- **capacity**: roughly model size: "higher-capacity models (like NASNet)" against "models with fewer parameters (like ResNet-18)" (§1). NASNet, Xception, ResNet and VGG are image classifiers of different sizes.

**Missing glossary terms:**
- **label noise**: wrong labels in a dataset. The paper assumes it is **class-conditional**, depending "only on the latent true class, not the data" (§3).
- **confident learning (CL)**: a method of Northcutt, Jiang and Chuang [33] that estimates, from a model's predicted probabilities and the given labels, how often each true class carries each given label, hence how many labels are wrong; the paper flags that many examples, those where the model most prefers another class to the given one (§3; App. C).
- **out-of-sample predicted probabilities**: a model's class probabilities for examples it was not trained on, here by cross-validation (§3).
- **top-1 and top-5 accuracy**: the share of examples whose true label is the model's first guess, or among its five top guesses (App. F).

**Builds on:**
- Confident learning [33], used as a filter; the contribution "is not in the methodology" (§3).
- Recht et al. [37], whose observation they confirm: benchmark conclusions "are largely unchanged" on a corrected test set (§5).
- Confusion-matrix label-error finders, which the authors say lack "either robustness to class imbalance or theoretical support" for realistic noise; and crowd-sourced label curation, applied here only to flagged subsets because of cost (§2).

## Problem and setting

How common are label errors in widely used test sets, and do they change which model a benchmark favors (§1)?

- **Datasets** (Tab. 1; App. A): images: MNIST (handwritten digits), CIFAR-10 and CIFAR-100 (small images, 10 or 100 classes), Caltech-256 (256 object classes), ImageNet (1,000 classes; its validation set stands in for the unpublished test set), QuickDraw (doodles from a game); text: 20news (newsgroup posts), IMDB (movie-review sentiment), Amazon Reviews (star-rated reviews, 2- and 4-star removed); audio: AudioSet (10-second YouTube sound clips). Datasets without an explicit test set are studied whole (Tab. 1).
- **Correctness:** an error is what the workers judge at the agreement threshold (§4); an expert review checks them (§6).
- **Scope:** workers saw only flagged examples, all of them except a random sample for QuickDraw and Amazon Reviews (§4); errors among unflagged examples are estimated only for ImageNet (§6).
- **Models:** pretrained checkpoints fit to the original training sets, 34 for ImageNet and 13 for CIFAR-10 (§5; §5.1).

## Approach

1. **Flag** (§3; App. C): a model per dataset (Tab. 1) gives out-of-sample probabilities, pre-trained on the train set (or an open-sourced pretrained model) and fine-tuned on the test set with cross-validation, or cross-validated over the whole dataset when there is no explicit test set; confident learning picks the examples.
2. **Validate** (§4; Fig. S1): five workers see each flagged example with its given and suggested labels and high-confidence examples of both classes, and answer given, suggested, both or neither.
3. **Re-score** (§5): original against corrected accuracy, on the whole test data and on the correctable set (§5.1).
4. **Simulate noisier test sets** (§5.2): benign examples are removed at random, raising noise prevalence until only the correctable set is left; expected accuracy is interpolated between the pruned and correctable sets. Where two models' curves cross, their ranking flips (Figs. 4–5).
5. **Expert review** (§6; App. G): the three authors and an experienced labeler reviewed one unflagged ImageNet image per class and one flagged image where the class had one, each by at least two experts.

## Results

- **Error rates** (abstract; Tab. 1): at least 3.3% on average across the 10 test sets, lowest for MNIST, highest for QuickDraw; 51% of flagged candidates confirmed on average. QuickDraw and Amazon Reviews counts are estimated from the sample (Tab. 1).
- **Kinds** (Tab. 2): the authors say the noise is "primarily systematic mislabeling, not just random noise or lack of signal" (§2).
- **Whole test set** (§5, Fig. 3a): on ImageNet, "benchmark conclusions are largely unchanged by using a corrected test set, i.e. in our case by removing errors".
- **Correctable set** (§5.1, Fig. 3b–c; Tab. S1): NASNet-large drops from rank 1/34 by original accuracy to 29/34 by corrected accuracy; ResNet-18 rises from 34/34 to 1/34. "The same trend" holds on 13 CIFAR-10 models, e.g. VGG-11 over VGG-19 (§5.1). The authors say this "may indicate" that lower-capacity models are "more resistant to learning the asymmetric distribution of noisy labels", and that newer models' design was tuned on original test accuracy (§5.1). For top-1 the reversal holds at all three agreement thresholds; for top-5 "this negative correlation no longer holds" (App. F, Fig. S3).
- **Instability** (§5.2; Figs. 4–5): by original accuracy "more flexible/recent architectures tend to be favored"; by corrected accuracy the order "strongly depends on the degree of noise prevalence". On ImageNet, ResNet-50 and ResNet-18 cross in corrected accuracy at noise prevalence 9%, against 2.9% measured (Fig. 4 caption); the abstract gives a similar crossover for VGG-11 and VGG-19 on CIFAR-10. Where errors are common, "a practitioner is more likely to select a model (based on original accuracy) that is not actually the best model" (§5.2).
- **Expert review** (§6; Tab. 3): a flagged image "was 2.6x as likely to be erroneously labeled" as an unflagged one; the authors estimate that the ImageNet validation set contains "closer to 20% label errors (up from the 6% reported in Table 1)". Workers "favored correcting labels in cases where experts agreed neither label was appropriate", but "overall agree" with the experts (§6).
- **Dataset quirks** (§7): missing global indexes (IMDB, QuickDraw, Caltech-256), duplicate images in Caltech-256, duplicate class labels in ImageNet.

## Limits the authors state

- Even when all 5 workers agree, the corrected label "is not always actually correct", though "these failure mode cases are rare"; confident learning also flags correct labels (§4.1; Fig. 2; App. D).
- §5 "only presents a loose lower bound" because of errors in unflagged data; the correctable sets are "likely larger", so noise prevalence estimates "are optimistic in favor of higher capacity models" (§5.2).
- Unknown-label examples are ignored: "it is unclear how to measure corrected accuracy" for them (§5).
- The analysis before §6 missed the errors among unflagged ImageNet images (§6).
- CIFAR-10's correctable set is small: "Discretization of accuracies occurs due to the limited number of corrected examples" (Tab. S2).
- "Results would likely improve with a larger budget" for crowd work (App. B).
- The paper "does not address whether the apparent overfitting of high-capacity models versus low-capacity models is due to overfitting to train set noise, overfitting to validation set noise during hyper-parameter tuning, or heightened sensitivity to train/test label distribution shift", left "for future work" (§7).

## Open problems and building blocks

- **Open:** "How to best allocate a given human label verification budget between training and test data also remains an open question" (§7). The authors suggest "keeping some correct labels on a secret correctable set of label errors may provide a useful framework for detecting overfitting on test sets" (App. F).
- **Released:** "Open-sourced resources to clean and correct each test set" (§1, contribution 2); a gallery of the errors and code to reproduce them (abstract; Fig. 1; §3; App. E); index files for datasets without a global index (§7, footnote 1).
- **To reuse it:** confident learning needs out-of-sample predicted probabilities and the given labels (§3); the code relies on the authors' open-source confident learning implementation (§3). Errors were found on a server with one RTX 2080 Ti GPU; reproducing them with the tutorial "takes about 5 minutes on a modern consumer-grade laptop" (App. E). Crowd work cost $1,623.29 (App. B). The authors recommend confident learning "to prioritize examples when verifying the labels in a large dataset" (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
