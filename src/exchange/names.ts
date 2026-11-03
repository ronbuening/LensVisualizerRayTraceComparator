// The names of the prescription writers, apart from the writers themselves: the configuration checks a definition's
// `prescriptions` against them without loading a writer. `PRESCRIPTION_WRITERS` (`prescription.ts`) has one writer
// for each name, and the type check fails until the two agree.

/** Every prescription writer there is, by the name a file-exchange definition gives it under `prescriptions`. */
export const PRESCRIPTION_WRITER_NAMES = ["table"] as const;
/** The name of one prescription writer. */
export type PrescriptionWriterName = (typeof PRESCRIPTION_WRITER_NAMES)[number];

/** Whether `name` is the name of a prescription writer. */
export function isPrescriptionWriterName(name: unknown): name is PrescriptionWriterName {
  return (PRESCRIPTION_WRITER_NAMES as readonly unknown[]).includes(name);
}
