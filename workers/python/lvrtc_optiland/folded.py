"""Conditional visit policies around optiland's native intersection, reflection and Snell kernels.

LV's active annulus is an interaction window: its hole transmits unchanged. An opaque annulus stops its band,
not its complement. RadialAperture alone cannot express either. These policies are installed on the Optic;
all points and outgoing directions still come from optiland. No optics is imported before hygiene.prepare.
"""

from __future__ import annotations

import copy
import functools
from typing import Any


@functools.lru_cache(maxsize=1)
def model_class():
    from optiland.interactions.base import BaseInteractionModel
    from optiland.interactions.refractive_reflective_model import RefractiveReflectiveModel

    class FoldedInteraction(BaseInteractionModel):
        interaction_type = "refractive_reflective"

        def __init__(self, surface, step, aperture, front_index, rear_index, np):
            native = surface.interaction_model
            super().__init__(parent_surface=surface, is_reflective=native.is_reflective)
            self.paraxial_native = native
            self.reflection_native = RefractiveReflectiveModel(parent_surface=surface, is_reflective=True)
            self.step = copy.deepcopy(step)
            self.outer = aperture["semiDiameter"]
            self.inner = float(aperture["innerSemiDiameter"])
            self.front_index = float(front_index)
            self.rear_index = float(rear_index)
            self.np = np

        def interact_real_rays(self, rays):
            np = self.np
            before = tuple(np.copy(value) for value in (rays.L, rays.M, rays.N))
            medium = getattr(rays, "_lvrtc_medium", np.ones_like(rays.opd))
            previous_path = getattr(rays, "_lvrtc_path", np.zeros_like(rays.opd))
            nominal = self.parent_surface.material_pre.n(rays.w)
            # Surface._trace_real charged its line parameter to material_pre. The conditional material is a
            # per-ray one; retain the native parameter and charge that same stretch to the actual medium.
            increment = rays.opd - previous_path
            rays.opd = rays.opd + increment * ((medium - nominal) / nominal)
            rays._lvrtc_path = np.copy(rays.opd)
            nx, ny, nz = self.geometry.surface_normal(rays)
            front = (before[0] * nx + before[1] * ny + before[2] * nz) * np.where(nz < 0, -1.0, 1.0) >= 0
            configured = self.step.get("incidentSide", "both")
            active = np.ones_like(front) if configured == "both" else front if configured == "front" else ~front
            radius = np.sqrt(rays.x * rays.x + rays.y * rays.y)
            within = radius >= self.inner
            if self.outer is not None:
                within = within & (radius <= self.outer)
            kind = self.step["interaction"]
            opaque = (~active) & within & (self.step.get("inactiveSide", "ignore") == "block")
            if kind == "block":
                opaque = opaque | (active & within)
            elif kind != "pass" and self.outer is not None:
                opaque = opaque | (active & (radius > self.outer))
            interact = active & within
            if kind == "reflect":
                self.reflection_native.interact_real_rays(rays)
            elif kind == "refract":
                target = np.where(front, self.front_index, self.rear_index)
                # Native RealRays.refract is the same kernel the standard interaction model calls, now with
                # the visit's actual per-ray incident medium and side-dependent transmitted medium.
                rays.refract(nx, ny, nz, medium, target)
                rays._lvrtc_medium = np.where(interact, target, medium)
            if kind in ("reflect", "refract"):
                rays.L, rays.M, rays.N = (
                    np.where(interact, new, old) for new, old in zip((rays.L, rays.M, rays.N), before)
                )
            rays.i = np.where(opaque, 0.0, rays.i)
            if kind != "refract":
                rays._lvrtc_medium = medium
            return rays

        def interact_paraxial_rays(self, rays):
            return self.paraxial_native.interact_paraxial_rays(rays)

        def flip(self):
            raise ValueError("a verified folded visit cannot be flipped")

    return FoldedInteraction


def install(optic: Any, case: dict[str, Any], line: int, physical_indices: list[float], np: Any) -> None:
    path = case["system"]["opticalPath"]
    cls = model_class()
    for at, step in enumerate(path):
        surface = optic.surfaces[at + 1]
        aperture = case["system"]["surfaces"][step["surfaceIndex"]]["aperture"]
        front = step.get("mediumAfter")
        rear = step.get("reverseMediumAfter", front)
        surface.interaction_model = cls(
            surface,
            step,
            aperture,
            1.0 if front is None else physical_indices[front],
            1.0 if rear is None else physical_indices[rear],
            np,
        )
    # Charge the image stretch in the actual final medium too, without adding a path step to the answer.
    image = optic.surfaces[len(path) + 1]
    image.interaction_model = cls(
        image, {"surfaceIndex": 0, "interaction": "pass"}, {"semiDiameter": None, "innerSemiDiameter": 0}, 1, 1, np
    )


def read_policy(model: Any) -> dict[str, Any] | None:
    if type(model).__name__ != "FoldedInteraction":
        return None
    return {
        "step": copy.deepcopy(model.step),
        "outer": model.outer,
        "inner": model.inner,
        "front_index": model.front_index,
        "rear_index": model.rear_index,
        "reflection_model": type(model.reflection_native).__name__,
        "reflection_enabled": bool(model.reflection_native.is_reflective),
        "paraxial_model": type(model.paraxial_native).__name__,
        "paraxial_reflective": bool(model.paraxial_native.is_reflective),
    }
