// Prescription writers: an optical case and its request as a person types them into the lens data editor of the
// program they operate. A file-exchange engine (`src/transports/fileExchange.ts`) names the writers its operator
// wants; each writes one file of every job it hands over, beside the message itself, which stays the full record.
//
// A writer never leaves a member of the case out, and never rounds: every number is the shortest decimal that reads
// back as the same double, so a person who types what is written types the case. A member a writer does not know is
// an error that names it, since a prescription that silently lacks one would be another lens.
import type { OpticalCase } from "../contract/case.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { decodeNdArray, isNdArray } from "../core/numeric/ndarray.ts";
import type { PrescriptionWriterName } from "./names.ts";

/** What writes one prescription file of a job. */
export interface PrescriptionWriter {
  /** The name of the file it writes in an outbox job. */
  readonly file: string;
  /**
   * The case and the request as text. A pure function of the two: equal inputs give equal text. Throws an error
   * naming the member, by its path in the case or request, for any member the writer does not know.
   */
  write(opticalCase: OpticalCase, request: QuantityRequest): string;
}

/**
 * A number as the shortest decimal that reads back as the same double (`String`), and -0 as `-0`, which `String`
 * writes as `0`.
 */
export function exactNumber(value: number): string {
  return Object.is(value, -0) ? "-0" : String(value);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Throws for a member of `value` that is not one of `known`: the writer would otherwise leave it out. */
function knownMembers(writer: string, value: unknown, path: string, known: readonly string[]): void {
  if (!isRecord(value)) throw new Error(`prescription writer "${writer}": ${path} is not an object`);
  const unknown = Object.keys(value).find((name) => !known.includes(name));
  if (unknown !== undefined) {
    throw new Error(
      `prescription writer "${writer}": ${path}.${unknown} is a member it does not know, and it leaves none out`,
    );
  }
}

/** The rows as columns padded to their widest cell, two spaces apart, each line indented by two spaces. */
function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const widths = header.map((cell, column) => Math.max(cell.length, ...rows.map((row) => row[column].length)));
  const line = (cells: readonly string[]): string =>
    `  ${cells.map((cell, column) => cell.padEnd(widths[column])).join("  ")}`.trimEnd();
  return [line(header), ...rows.map(line)];
}

/** A scalar of the spec or of the options as text: a string quoted, a number exact. */
function scalarText(value: unknown): string {
  if (typeof value === "number") return exactNumber(value);
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

/**
 * Every leaf of a JSON value as `[path, text]`, keys in sorted order. An encoded array is named with its type and
 * shape, its values being in the message; a list of scalars is written on one line.
 */
function leaves(value: unknown, path: string, into: [string, string][]): void {
  if (isNdArray(value)) {
    const { dtype, shape } = value.$nd;
    into.push([path, `${dtype} array of shape [${shape.join(", ")}]; its values are in message.json`]);
  } else if (Array.isArray(value)) {
    if (value.every((element) => !isRecord(element) && !Array.isArray(element))) {
      into.push([path, `[${value.map(scalarText).join(", ")}]`]);
    } else value.forEach((element, index) => leaves(element, `${path}[${index}]`, into));
  } else if (isRecord(value)) {
    const names = Object.keys(value).sort();
    if (names.length === 0) into.push([path, "{}"]);
    for (const name of names) leaves(value[name], `${path}.${name}`, into);
  } else into.push([path, scalarText(value)]);
}

const CASE_MEMBERS = ["contract", "kind", "id", "systemId", "label", "system", "conditions", "features", "provenance"];
const LABEL_MEMBERS = ["name", "lensKey", "zoomT", "focusT"];
const SYSTEM_MEMBERS = ["surfaces", "stopIndex", "lastLensSurfaceIndex", "designImageZ", "opticalPath"];
const SURFACE_MEMBERS = ["label", "z", "thickness", "shape", "aperture", "elementId", "synthetic", "diffractive"];
const SHAPE_MEMBERS: Readonly<Record<string, readonly string[]>> = {
  plane: ["kind"],
  conic: ["kind", "radius", "conic"],
  asphere: ["kind", "radius", "conic", "terms"],
};
const TERM_MEMBERS = ["power", "coeff"];
const APERTURE_MEMBERS = ["semiDiameter", "nominalSemiDiameter", "innerSemiDiameter"];
const PHASE_MEMBERS = ["kind", "referenceWavelengthNm", "diffractionOrder", "terms"];
const PHASE_TERM_MEMBERS = ["radialPower", "coefficient"];
const STEP_MEMBERS = [
  "surfaceIndex",
  "interaction",
  "mediumAfter",
  "reverseMediumAfter",
  "incidentSide",
  "inactiveSide",
];
const CONDITION_MEMBERS = ["object", "stopSemiDiameter", "imageZ", "lines", "indexAfterSurface"];
const OBJECT_MEMBERS: Readonly<Record<string, readonly string[]>> = { infinity: ["kind"], finite: ["kind", "z"] };
const LINE_MEMBERS = ["wavelengthNm", "weight", "indexSource"];
const PROVENANCE_MEMBERS = ["source", "lv", "notes", "producer"];
const SOURCE_MEMBERS: Readonly<Record<string, readonly string[]>> = {
  "lv-lens": ["kind", "lensKey", "file", "fileSha256", "zoomT", "focusT"],
  fixture: ["kind", "name"],
};
const LV_MEMBERS = ["commit", "dirty", "closureHash"];
const PRODUCER_MEMBERS = ["tool", "version"];
const REQUEST_MEMBERS = ["contract", "kind", "id", "caseId", "quantity", "quantityVersion", "spec", "engineOptions"];

/**
 * The writer "table": the case as tables of rows a person types into a lens data editor, surface by surface, then
 * the request. Every surface states its index, vertex, thickness to the next vertex, shape (plane; radius and conic;
 * an asphere's radius or flat base, conic and every term as power and coefficient), clip semi-diameter or that it
 * does not clip, nominal and inner semi-diameters, element, and the medium after it at every line with the line's
 * index source; then any diffractive phase and the fixed optical path of a folded case, and the object, stop, image
 * plane and lines. The request is its quantity, version and spec, an encoded array named with its type and shape.
 */
function writeTable(opticalCase: OpticalCase, request: QuantityRequest): string {
  const check = (value: unknown, path: string, known: readonly string[]): void =>
    knownMembers("table", value, path, known);
  const kindOf = (value: unknown, path: string, kinds: Readonly<Record<string, readonly string[]>>): string => {
    const kind = isRecord(value) ? value.kind : undefined;
    if (typeof kind !== "string" || !Object.hasOwn(kinds, kind)) {
      throw new Error(`prescription writer "table": ${path}.kind is ${JSON.stringify(kind)}, which it does not know`);
    }
    check(value, path, kinds[kind]);
    return kind;
  };
  const n = exactNumber;

  check(opticalCase, "case", CASE_MEMBERS);
  const { label, system, conditions, provenance } = opticalCase;
  check(label, "case.label", LABEL_MEMBERS);
  check(system, "case.system", SYSTEM_MEMBERS);
  check(conditions, "case.conditions", CONDITION_MEMBERS);
  check(provenance, "case.provenance", PROVENANCE_MEMBERS);
  check(provenance.producer, "case.provenance.producer", PRODUCER_MEMBERS);
  const { surfaces } = system;
  const { lines } = conditions;
  const surfaceName = (index: number): string => `${index} (${JSON.stringify(surfaces[index]?.label ?? "?")})`;

  const out: string[] = [
    `Prescription of an optical case for an engine operated by hand, written by lvrtc (writer "table").`,
    "Every number is the shortest decimal that reads back as the same double; -0 is written -0.",
    "Lengths are mm. Light travels toward +z and the first vertex is at z = 0. A radius above 0 puts the centre of",
    "curvature toward +z. Sag: z(r) = c r^2 / (1 + sqrt(1 - (1 + k) c^2 r^2)) + sum of a_p r^p, with c = 1 / radius,",
    "and c = 0 for a plane or a flat base. A clip semi-diameter stops a ray above it; a ray exactly at it passes.",
    "",
    "Case",
  ];
  const facts: [string, string][] = [
    ["id", opticalCase.id],
    ["system id", opticalCase.systemId],
    ["contract", opticalCase.contract],
    ["name", JSON.stringify(label.name)],
  ];
  if (label.lensKey !== undefined) facts.push(["lens key", label.lensKey]);
  if (label.zoomT !== undefined) facts.push(["zoom position", n(label.zoomT)]);
  if (label.focusT !== undefined) facts.push(["focus position", n(label.focusT)]);
  facts.push(["features", opticalCase.features.length === 0 ? "none" : opticalCase.features.join(", ")]);
  const source = provenance.source;
  if (kindOf(source, "case.provenance.source", SOURCE_MEMBERS) === "fixture" && source.kind === "fixture") {
    facts.push(["source", `fixture ${JSON.stringify(source.name)}`]);
  } else if (source.kind === "lv-lens") {
    const at = [
      ...(source.zoomT === undefined ? [] : [`zoom ${n(source.zoomT)}`]),
      ...(source.focusT === undefined ? [] : [`focus ${n(source.focusT)}`]),
    ];
    facts.push([
      "source",
      `LensVisualizer lens ${source.lensKey}, file ${source.file} (sha256 ${source.fileSha256})` +
        (at.length === 0 ? "" : `, ${at.join(", ")}`),
    ]);
  }
  if (provenance.lv !== undefined) {
    check(provenance.lv, "case.provenance.lv", LV_MEMBERS);
    const { commit, dirty, closureHash } = provenance.lv;
    const state = dirty === null ? "unknown" : dirty ? "dirty" : "clean";
    facts.push(["LensVisualizer", `commit ${commit ?? "unknown"}, work tree ${state}, closure ${closureHash}`]);
  }
  if (provenance.notes !== undefined) {
    facts.push(["notes", provenance.notes.length === 0 ? "none" : provenance.notes.join(", ")]);
  }
  facts.push(["producer", `${provenance.producer.tool} ${provenance.producer.version}`]);
  out.push(...table(["", ""], facts).slice(1));

  const object = conditions.object;
  const objectText =
    kindOf(object, "case.conditions.object", OBJECT_MEMBERS) === "finite" && object.kind === "finite"
      ? `on the plane z = ${n(object.z)}`
      : "at infinity";
  out.push(
    "",
    "Conditions",
    ...table(
      ["", ""],
      [
        ["object", objectText],
        ["stop", `surface ${surfaceName(system.stopIndex)}, semi-diameter ${n(conditions.stopSemiDiameter)}`],
        ["image plane", `z = ${n(conditions.imageZ)}`],
        ["design image plane", `z = ${n(system.designImageZ)}`],
        ["last lens surface", surfaceName(system.lastLensSurfaceIndex)],
      ],
    ).slice(1),
  );

  lines.forEach((line, index) => check(line, `case.conditions.lines[${index}]`, LINE_MEMBERS));
  out.push(
    "",
    "Lines (line 0 is the reference line)",
    ...table(
      ["line", "wavelength nm", "weight", "index source"],
      lines.map((line, index) => [String(index), n(line.wavelengthNm), n(line.weight), line.indexSource]),
    ),
  );

  const terms: string[][] = [];
  const phases: string[][] = [];
  const rows = surfaces.map((surface, index): string[] => {
    const path = `case.system.surfaces[${index}]`;
    check(surface, path, SURFACE_MEMBERS);
    check(surface.aperture, `${path}.aperture`, APERTURE_MEMBERS);
    const shape = surface.shape;
    const kind = kindOf(shape, `${path}.shape`, SHAPE_MEMBERS);
    let radius = "-";
    let conic = "-";
    if (shape.kind === "conic") [radius, conic] = [n(shape.radius), n(shape.conic)];
    if (shape.kind === "asphere") {
      [radius, conic] = [shape.radius === null ? "flat base" : n(shape.radius), n(shape.conic)];
      shape.terms.forEach((term, at) => {
        check(term, `${path}.shape.terms[${at}]`, TERM_MEMBERS);
        terms.push([String(index), n(term.power), n(term.coeff)]);
      });
    }
    if (surface.diffractive !== undefined) {
      const phase = surface.diffractive;
      kindOf(phase, `${path}.diffractive`, { "radial-polynomial": PHASE_MEMBERS });
      phase.terms.forEach((term, at) => {
        check(term, `${path}.diffractive.terms[${at}]`, PHASE_TERM_MEMBERS);
        phases.push([
          String(index),
          n(phase.referenceWavelengthNm),
          n(phase.diffractionOrder),
          n(term.radialPower),
          n(term.coefficient),
        ]);
      });
    }
    if (surface.synthetic !== undefined && surface.synthetic !== "rearPlate") {
      throw new Error(`prescription writer "table": ${path}.synthetic is ${JSON.stringify(surface.synthetic)}`);
    }
    const { semiDiameter, nominalSemiDiameter, innerSemiDiameter } = surface.aperture;
    const notes = [
      ...(index === system.stopIndex ? ["stop"] : []),
      ...(index === system.lastLensSurfaceIndex ? ["last lens surface"] : []),
      ...(surface.synthetic === "rearPlate" ? ["rear plate the case source generated"] : []),
    ];
    return [
      String(index),
      JSON.stringify(surface.label),
      n(surface.z),
      n(surface.thickness),
      kind,
      radius,
      conic,
      semiDiameter === null ? "does not clip" : n(semiDiameter),
      n(nominalSemiDiameter),
      n(innerSemiDiameter),
      n(surface.elementId),
      notes.join(", "),
    ];
  });
  out.push(
    "",
    "Surfaces (thickness: to the next vertex; after the last surface, to the design image plane)",
    ...table(
      [
        "surface",
        "label",
        "z",
        "thickness",
        "shape",
        "radius",
        "conic",
        "clip semi-diameter",
        "nominal semi-diameter",
        "inner semi-diameter",
        "element",
        "note",
      ],
      rows,
    ),
    "",
  );
  if (terms.length === 0) out.push("Asphere terms: none");
  else out.push("Asphere terms (every term of every asphere)", ...table(["surface", "power", "coefficient"], terms));

  const indices = decodeNdArray(conditions.indexAfterSurface);
  if (indices.shape.length !== 2 || indices.shape[0] !== lines.length || indices.shape[1] !== surfaces.length) {
    throw new Error(
      `prescription writer "table": case.conditions.indexAfterSurface has the shape [${indices.shape.join(", ")}], ` +
        `not [${lines.length}, ${surfaces.length}]`,
    );
  }
  out.push(
    "",
    "Medium after each surface: its refractive index at each line (air is 1)",
    ...table(
      ["surface", ...lines.map((line, index) => `line ${index} (${n(line.wavelengthNm)} nm, ${line.indexSource})`)],
      surfaces.map((_surface, index) => [
        String(index),
        ...lines.map((_line, row) => n(indices.values[row * surfaces.length + index])),
      ]),
    ),
    "",
  );

  if (phases.length === 0) out.push("Diffractive phase: none");
  else {
    out.push(
      "Diffractive phase: an optical path W(r) = sum of c_p r^p added at the surface, mm, at its design wavelength",
      ...table(["surface", "design wavelength nm", "order", "power", "coefficient"], phases),
    );
  }
  out.push("");

  if (system.opticalPath === undefined) out.push("Optical path: sequential, the surfaces in their order");
  else {
    const medium = (value: number | null | undefined): string =>
      value === undefined ? "-" : value === null ? "air" : `column of surface ${value}`;
    out.push(
      "Optical path: the visits in order; a medium is the index column of the surface named, or air",
      ...table(
        ["step", "surface", "interaction", "medium after", "reverse medium after", "incident side", "inactive side"],
        system.opticalPath.map((step, at) => {
          check(step, `case.system.opticalPath[${at}]`, STEP_MEMBERS);
          return [
            String(at),
            String(step.surfaceIndex),
            step.interaction,
            medium(step.mediumAfter),
            medium(step.reverseMediumAfter),
            step.incidentSide ?? "-",
            step.inactiveSide ?? "-",
          ];
        }),
      ),
    );
  }

  check(request, "request", REQUEST_MEMBERS);
  const asked: [string, string][] = [];
  leaves(request.spec, "spec", asked);
  const options: [string, string][] = [];
  if (request.engineOptions !== undefined) leaves(request.engineOptions, "engineOptions", options);
  out.push(
    "",
    "Request",
    ...table(
      ["", ""],
      [
        ["id", request.id],
        ["case", request.caseId],
        ["contract", request.contract],
        ["quantity", request.quantity],
        ["version", request.quantityVersion === undefined ? "the original definition" : n(request.quantityVersion)],
        ...asked,
        ...(options.length === 0 ? [["engine options", "none"] as [string, string]] : options),
      ],
    ).slice(1),
    "",
  );
  return out.join("\n");
}

/** Every prescription writer, by the name a definition gives it. */
export const PRESCRIPTION_WRITERS: { readonly [Name in PrescriptionWriterName]: PrescriptionWriter } = {
  table: { file: "prescription-table.txt", write: writeTable },
};
