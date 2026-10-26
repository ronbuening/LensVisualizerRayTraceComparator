#!/usr/bin/env node
// `npm run verify:real`: the committed baselines against the live LensVisualizer and optiland, one check at a time.
import { mainVerifyReal } from "../src/cli/verifyReal.ts";

process.exitCode = await mainVerifyReal(process.argv.slice(2));
