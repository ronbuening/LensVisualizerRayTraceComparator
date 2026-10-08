import { SELFTEST_ECHO, SELFTEST_ECHO_VERSION } from "../contract/quantities/selftestEcho.ts";
import { schemaQuantity } from "./module.ts";
import type { QuantityModule } from "./module.ts";

/** The conformance quantity `selftest.echo`, validated by its two schema files. */
export const selftestEchoQuantity: QuantityModule = schemaQuantity(SELFTEST_ECHO, SELFTEST_ECHO_VERSION);
