# How LensVisualizer's MTF is compared

The [validation statement](../reports/validation-statement.md) is the measured account. Its JSON holds the
same figures, input hashes, limits, counts, named states and external-counterpart coverage. It is made from
committed baselines, without asking an engine. The statement distinguishes configurations, engine pairs and
requests; a named state is counted within its suite, and the repeated R4 record is counted once.

The supportable sentence is:

> On 251 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 9.7e-13 mm (gate 1e-8 mm), optical path 3.9e-9 waves (2e-5), geometric MTF 1.5e-11 (1e-7), wave MTF 1.2e-9 (2e-8); the benchmark covers six wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.31, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.026. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

The ladder starts with the system each engine built. R0 checks layout, surface shape, sampled sag, apertures
and indices; R1 checks first-order quantities and pupils. Their limits and worst residuals are in the
statement's [rung table and metric maxima](../reports/validation-statement.md#rungs). These checks establish
the inputs for the later comparisons; they do not check the source glass catalog or a physical lens.

R2 hands the same launch rays to LensVisualizer, optiland and the reference tracer, and compares hits,
directions, image landings and masks. R3 compares optical path, path to the image and chief-relative OPD of
those rays. R4 applies the comparator's geometric OTF to the rays valid in both engines of each pair,
combining the weighted complex contributions before the modulus. These are gated comparisons of identical
rays, with [separate limits and metric maxima](../reports/validation-statement.md#limits-and-metric-maxima).

R4f connects that geometric sum to LensVisualizer's displayed geometric MTF. Replay obtains LV's own
sampling and applies the comparator's sum; the rung checks both the curve and the sampling/field identities.
Its [statement row](../reports/validation-statement.md#rungs) is a gate on this replay comparison.
R5g, separately, records geometric MTF on each method's own pupil sampling. On one line optiland uses its
geometric class and bins; on several lines the worker sums optiland's landings as complex contributions.
The R5g difference is recorded, with an attention band, rather than held to the identical-ray gate.

R6a applies the comparator's wave OTF to each tracer's identical rays on a refined lattice. It gates the
wave MTF only where phase steps and grid doubling permit a measured comparison. A PASS request can contain
fields set aside for sampling. The statement's R6a metric measurement count and diagnostics make that
qualification visible; the [supportable sentence](../reports/validation-statement.md#supportable-sentence)
counts only configurations with a measured gated metric for both LV/external pairs on each required rung.
R6b records the comparator's wave estimate on LV rays beside LV's product sheared diffraction estimate.
That connection compares two methods; it has an attention band and supplies no accuracy claim.

There are two external diffraction counterparts, displayed side by side in the statement's
[external diffraction section](../reports/validation-statement.md#external-diffraction-counterparts):

- R5 records optiland's own FFT MTF. It has its own stop grid, reference sphere and frequency axes, and
  answers one line only. A request on photopic lines has no FFT curve. The statement retains that absence,
  along with the requested and answered lines, named states, fields, classes and statuses.
- R6c records the comparator's OTF of optiland's own raw wavefront samples. On one line the comparator
  evaluates a complex OTF; on photopic lines it shifts each line by its chief landing relative to the first
  line, weights by the supplied line weight and transmitted flux, sums, then takes the modulus. This is a
  comparator sum of optiland wavefronts, rather than a polychromatic curve from optiland's FFT class.

Each counterpart has its own worst banded difference and worst shown difference set aside for sampling
or another method condition. Sorting precedes subtraction: unavailable curves and differing inputs do not
produce a difference; numerical rows remain apart; method rows whose curves stand enter an attention band.
The statement lists the selected chief-landing sorting limits by request, including the several-line limit.
Neither counterpart is preferred or used as an arbiter of the other. Their requested fields and states
should not be read as fields on which both methods supplied settled curves.

The Z 50/1.2 FFT offset is attributed to class **method** on the settled best-focus half field; the earlier
numerical and unsupported outcomes are retained. The [investigation](z50f12-investigation.md) supplies that
attribution and its reproduction, and the [statement](../reports/validation-statement.md#external-diffraction-counterparts)
supplies the aggregate figures. A class on that settled comparison does not replace the class of another
state or field.

The [states by suite](../reports/validation-statement.md#states-by-suite) section names every benchmark,
feature, state-matrix and declared focus-station run, with case hashes and coded refusals. The baselines retain
those names and identities, but do not retain enough information to recover numeric slider positions, stop
radii or plane shifts. Wavelength values explicitly retained by the benchmark's recorded diffraction answers
are distinguished from the other suites' per-line data, which these baselines do not hold.

The statement's fixed [Not covered block](../reports/validation-statement.md#not-covered) excludes dispersion,
white-light weighting beyond the supplied lines, focus choice, stop sizing, unnamed states and the catalog
beyond these suites. Agreement on the gated rungs does not extend the scope of the recorded diffraction rows.

Regenerate with `node bin/lvrtc.mjs statement`. Check both statement files and the per-suite reports byte for
byte with `node bin/lvrtc.mjs verify`. Neither command needs LensVisualizer or optiland; engine/input drift
still requires `lvrtc baseline check`.
