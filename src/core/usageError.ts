/**
 * What was asked for cannot be done as it was asked: a suite file that is not a suite, a rung or an engine that does
 * not exist, a suite whose name cannot be a run directory. It is thrown before anything is run or written, so
 * nothing needs undoing. The command line reports it and exits with its usage code, not its failure code.
 */
export class UsageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UsageError";
  }
}
