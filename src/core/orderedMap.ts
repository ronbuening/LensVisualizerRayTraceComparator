/** Bounded work admission; collection always follows input order. Rejections drain active tasks before throwing. */
export async function orderedMap<T, R>(
  values: readonly T[],
  jobs: number,
  act: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  const output: R[] = new Array(values.length);
  let next = 0;
  let failed = false;
  const workers = Array.from({ length: Math.min(jobs, values.length) }, async () => {
    while (!failed && next < values.length) {
      const index = next++;
      try {
        output[index] = await act(values[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  });
  const settled = await Promise.allSettled(workers);
  const failure = settled.find((result) => result.status === "rejected");
  if (failure?.status === "rejected") throw failure.reason;
  return output;
}
