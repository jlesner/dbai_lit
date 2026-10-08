# The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis

**The Optimizer's Curse** · Management Science 2006

Read: [PDF](https://jimsmith.host.dartmouth.edu/wp-content/uploads/2022/04/The_Optimizers_Curse.pdf) · [DOI](https://doi.org/10.1287/mnsc.1050.0451)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Shows that choosing the alternative with the highest estimated value makes that estimate biased high even when every estimate is unbiased, so a decision maker should expect to be disappointed on average (abstract; §2.3, Prop. 1).
- Proposes ranking by Bayesian posterior means, which shrink each estimate toward a prior mean and carry no such bias (§3, Eq. (4), Prop. 2), with normal and hierarchical models (§3.1–3.4) and simulations on Kodak's decision-analysis studies (§2.2).
- The selection bias of keep-if-better loops on a noisy evaluation set, which listed [The Winner's Curse in…](#/papers/hu2026winnerscurse "The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules (2026)") (§1) and [Coding Agents are Strong Prompt Optimizers](#/papers/singh2026casd "Coding Agents are Strong Prompt Optimizers (2026)") (§6.4) cite it for; the authors report an expected disappointment of 0.85 standard deviations of the estimates when the best of three equally good alternatives is chosen (§2.1, PDF p. 2).

## In plain words

When you pick the best of several options by error-prone estimates, the winner's estimate tends to be too high, even when each estimate is right on average. The authors call this the optimizer's curse: someone who picks by the estimates "should expect to be disappointed on average", not because the estimates are biased "but because of the optimization-based selection process" (abstract, PDF p. 1). They say the curse "is not well understood or appreciated" in decision analysis and management science, and may feed decision makers' skepticism (abstract, PDF p. 1). They prove the bias in general, size it numerically, and propose a fix: rank by adjusted estimates that, in their models, average the analysis's estimate with a prior guess, weighted by how accurate each is (§3, PDF p. 6). With three equally good options and independent, identically and normally distributed, unbiased estimates, the winner is overestimated on average by 85% of the estimates' standard deviation (§2.1, PDF p. 2). They present it as naming an effect that "has been noted (but not named)" before (§1, PDF p. 1).

## Background and terms

**Terms to know:** none in the glossary yet.

**The paper's own terms:**
- **decision analysis**: typically, identify alternatives, compute each one's expected value or certainty equivalent (a sure amount judged equally good), recommend the highest (§1, PDF p. 1).
- **true value**: the expected value or utility an analysis would find with unlimited time, money and computation; not a realized outcome. A **value estimate** is what an actual analysis reports (§2 and footnote 1, PDF p. 2).
- **conditionally unbiased**: for any fixed true values, each estimate equals its true value on average (§2, PDF p. 2).
- **postdecision surprise**: realized value minus the chosen alternative's estimate; negative is disappointment (Harrison and March's term; §2, PDF p. 2). **Expected disappointment** is the chosen estimate minus its true value, on average (§2.1, PDF p. 2).
- **value added**: typically, the best alternative's estimated value minus a default plan's; Clemen and Kwit (2001) use the average of all alternatives instead (§2.2, PDF p. 4).
- **variance ratio**: the variance of an estimate's error over the prior variance of the true value; it sets the estimate's weight (§3.2, PDF p. 7).

**Missing glossary terms:**
- **prior, posterior, Bayes' rule**: the prior is a probability distribution over the true values before the analysis; Bayes' rule combines it with a model of the estimates' accuracy to give the posterior, the distribution after seeing the estimates; the posterior mean is its average (§3, PDF pp. 5–6).
- **shrinkage**: moving an estimate part way toward a prior mean or the average of all estimates (§3.2, PDF p. 7; §4, PDF pp. 10–11).
- **hierarchical model**: true values drawn from a distribution whose mean is itself uncertain and learned from the estimates (§3.4, PDF p. 8).
- **winner's curse**: "the tendency for the highest bidder in an auction with common or interdependent values to have overestimated the value of the item being sold" (§4, PDF p. 10).
- **regression to the mean**: the effect that, e.g., high scorers on one test are likely to do less well on later tests (§4, PDF p. 10).

**Builds on** (none is on this site):
- Harrison and March (1984), who named postdecision surprise, and Brown (1974) in finance; the authors say neither gave "a general result like our Proposition 1" or advice on a fix (§4, PDF p. 10).
- The winner's curse: Capen et al. (1971), Thaler (1992), Winkler and Brooks (1980) (§1, PDF p. 1; §4, PDF p. 10).
- Clemen and Kwit (2001): 38 decision-analysis studies at Eastman Kodak, 1990–1999, the simulations' data (§2.2, PDF p. 4).

## Problem and setting

- **Question:** how does picking the top estimate bias it, and "How should we adjust our value estimates to eliminate this effect?" (§3, PDF p. 5).
- **Selection:** choose the highest estimate; the realized outcome is viewed as a random draw whose mean is the true value, which is "typically never revealed" (§2, PDF p. 2).
- **Assumptions:** the general result needs only conditionally unbiased estimates and "does not rely on any of the specific assumptions (e.g., normal distributions) used in our illustrative examples" (§2.3, PDF p. 5). The Kodak simulations take Kodak's estimates as true values and add independent normal noise with standard deviation 5%, 10% or 25% of each value's size (§2.2, PDF p. 4). The authors add that disappointment would be greater if estimates were biased high (§5, PDF p. 11).

## Approach

- **Prop. 1 (§2.3, PDF p. 5).** If every estimate is conditionally unbiased and you choose the highest estimate, the chosen alternative's true value is on average at most its estimate; strictly less if there is some chance of choosing an alternative whose true value is not the highest. The proof compares the choice with the truly best alternative, whose estimate is unbiased (Eqs. 2–3).
- **The fix (§3, PDF pp. 5–6).** Put a prior on the true values, model the estimates' accuracy given the true values, apply Bayes' rule, and rank by posterior means. In the models of §3 (PDF p. 6), the posterior mean is a weighted average of estimate and prior mean (Eq. 4), with a weight between 0 and 1 "that depends on the relative accuracies of the prior estimate and value estimate".
- **Prop. 2 (§3, PDF p. 6).** If you rank by posterior means (the average true value given the observed estimates), the chosen alternative's true value minus its posterior mean is zero on average, both given any particular estimates and overall. The key is "proper conditioning": the raw estimates are unbiased given the true values, but the decision is made knowing only the estimates.
- **Models (§3.1–3.4, PDF pp. 6–9).** Multivariate normal (Eqs. 5a–5e); with independence the weight on the estimate is 1/(1 + variance ratio) (Eq. 6a, PDF p. 7). A shared prior mean and variance ratio keep the ranking; different ones can reorder it. If the covariance matrices of true values and estimates (how they vary and move together) are equal up to scale, correlations "cancel" in their effect on the adjusted estimates (§3.3, PDF pp. 7–8). The hierarchical model shrinks toward a mix of the prior mean and the average estimate (Eq. 8, PDF p. 8).
- **Assessment (§3.5, PDF pp. 9–10).** Elicit a prior mean with a range for its uncertainty and the estimate's accuracy, or the weight itself: "the fraction of the prior uncertainty about the value of alternative i (measured as a variance) eliminated by doing the analysis" (PDF p. 9).

## Results

- **Number of alternatives (§2.1, Figs. 1–2, PDF pp. 2–3).** Equal true values, independent standard normal estimates: expected disappointment rises at a diminishing rate, 0.85 standard deviations for three alternatives, 1.03 for four, 1.54 for ten.
- **Separation (Fig. 3, PDF p. 3).** For three alternatives with spread-out true values, expected disappointment falls as the spread grows.
- **Correlation (Tabs. 1–2, PDF pp. 3–4).** Positive correlation among estimates lowers it, among true values raises it. For four alternatives whose true values are uncertain (standard normal), and so may be separated: 73% of the common standard deviation of estimates and true values without correlation, 52% or 36% with both correlations at 0.5 or 0.75, which "remains substantial".
- **Kodak (§2.2, Fig. 4, PDF pp. 4–5).** Against a true value added of $487 million, the average claimed value added is $555 million, $678 million and $1.111 billion at 5%, 10% and 25% noise, overstating by 14%, 39% and 128%. With correlation 0.5 among each study's estimates (10% noise) the effect shrinks, but "it remains considerable".
- **Shrinkage on Kodak study 99-9 (§3.2, Fig. 5, PDF pp. 6–7).** Seven alternatives, variance ratio 20%, prior mean 0: the recommended alternative shrinks from $80.0 to $66.7 million, value added from $46.6 to $38.8 million. With ratios of 20% or 50%, the highest estimate is no longer preferred (Fig. 5(b)). In the limiting case of little prior information about the mean, the hierarchical version shrinks toward the average estimate without reordering, as equal variances are assumed (§3.4, Fig. 6, PDF pp. 8–9).
- **Representative weights (§3.5, Fig. 7, PDF pp. 9–10).** If an estimate's standard deviation is 20%–50% of the prior's, the weight on it would be 95%–80%.

## Limits the authors state

- The models of §§3.2–3.4 (PDF pp. 6–9) are "introduced primarily as examples that demonstrate Bayesian procedures for adjusting value estimates", though their simple calculations "may make them useful as rough approximations in practice" (§3.5, PDF p. 9).
- Alternatives "often evolve during the analysis, and it may be difficult to get a truly 'prior' assessment" (§3.5, PDF p. 9).
- They expect assessments and variance ratios "to vary significantly across different applications" (§3.5, PDF p. 9), and suggest the 20%–50% range "only as a representative range" (§3.5, PDF p. 10).
- "It would be interesting, but we suspect quite difficult, to document the optimizer's curse using field data": few firms keep careful records of their estimates, and actual values are hard to determine and separate from confounders (§5, PDF p. 11).
- "it may be difficult in practice to formulate and assess sophisticated models" of a complex analysis's uncertainty; the §3 models (PDF pp. 6–9) "could perhaps be used" approximately (§5, PDF p. 11).

## Open problems and building blocks

  - "it could be interesting to study the curse in a controlled laboratory experiment" (§5, PDF p. 11).
  - A hierarchical model with differing variances, where "we might find changes in rankings" (§3.4, PDF p. 9).
  - "The expert-use literature may provide suggestions for developing Bayesian models analogous to those discussed in §3" (§4, PDF p. 11).
- **Released:** Nothing stated.
- **To reuse it:** a prior mean and a variance ratio (or the weight) per alternative (§3.5, PDF p. 9); the §3 models assume normal distributions (§3.1–3.4, PDF pp. 6–9).
- **Beyond its domain:** "Other optimization-based processes operate in a similar manner" (abstract, PDF p. 1); the curse "potentially affects all kinds of intelligent decision making—attempts to optimize based on imperfect estimates—not just competitive bidding problems" (§1, PDF p. 1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
