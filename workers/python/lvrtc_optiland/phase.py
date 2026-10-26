"""Build a native radial phase profile in radians; preserve and verify its design coordinates.

The native real-ray interaction is PhaseInteractionModel, not the constant-period grating model.
No replacement real or paraxial trace is installed.
"""
from __future__ import annotations
import math
from typing import Any


def phase_profile(phase: dict[str, Any]) -> Any:
    from optiland.phase.radial import RadialPhaseProfile
    if any(term["radialPower"] % 2 for term in phase["terms"]):
        raise ValueError("optiland-odd-radial-phase: native radial profile is even only")
    coeffs = [0.0] * (max(term["radialPower"] for term in phase["terms"]) // 2)
    for term in phase["terms"]:
        coeffs[term["radialPower"] // 2 - 1] = float(term["coefficient"])
    scale = 2 * math.pi * phase["diffractionOrder"] / (phase["referenceWavelengthNm"] * 1e-6)
    profile = RadialPhaseProfile(coefficients=[scale * c for c in coeffs])
    # Design coordinates are part of the built model. verify_phase checks both them and every native radian coefficient.
    profile.design_terms = [dict(term) for term in phase["terms"]]
    profile.reference_wavelength_nm = phase["referenceWavelengthNm"]
    profile.diffraction_order = phase["diffractionOrder"]
    return profile


def read_phase(model: Any) -> dict[str, Any] | None:
    profile = getattr(model, "phase_profile", None)
    if profile is None:
        return None
    return {"kind": "radial-polynomial", "referenceWavelengthNm": profile.reference_wavelength_nm,
            "diffractionOrder": profile.diffraction_order, "terms": [dict(term) for term in profile.design_terms]}


def verify_phase(surface: Any, phase: dict[str, Any] | None, hold: Any, where: str) -> None:
    model = surface.interaction_model
    if phase is None:
        hold(where, "phase profile", getattr(model, "phase_profile", None), None)
        return
    profile = getattr(model, "phase_profile", None)
    hold(where, "phase profile class", type(profile).__name__, "RadialPhaseProfile")
    hold(where, "phase model class", type(model).__name__, "PhaseInteractionModel")
    hold(where, "phase parent", model.parent_surface is surface, True)
    hold(where, "phase profile parent", profile.parent_surface is surface, True)
    hold(where, "phase reflection", model.is_reflective, False)
    hold(where, "phase efficiency", profile.efficiency, 1.0)
    held = read_phase(model)
    for key in ("referenceWavelengthNm", "diffractionOrder", "terms"):
        hold(where, "phase " + key, held[key], phase[key])
    expected = [0.0] * (max(term["radialPower"] for term in phase["terms"]) // 2)
    scale = 2 * math.pi * phase["diffractionOrder"] / (phase["referenceWavelengthNm"] * 1e-6)
    for term in phase["terms"]:
        expected[term["radialPower"] // 2 - 1] = scale * term["coefficient"]
    hold(where, "phase radian coefficients", list(profile.coefficients), expected)
