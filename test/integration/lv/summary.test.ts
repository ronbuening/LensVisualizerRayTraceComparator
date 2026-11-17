// LensVisualizer's summary tab against rung R1, and the engine `lv`'s `summary.native` against the tab. The tab
// presents first-order readouts of the prepared state (`computeOpticalSummary` of the analysis drawer's request); `lv`
// answers `paraxial.first-order` with LensVisualizer's paraxial kernel on the same state (`answerLvFirstOrder`), which
// R1 judges against `reference-tracer` and optiland. Held here, on every exported state of the benchmark, states and
// focus-stations suites on the reference line and the design plane (the tab is of the authored indices and of the
// prepared state's plane):
//
// - to the bit: the cardinal focal length and the back focus (R1's `efl`, `backFocus`), the front focus and the hiatus
//   (the first vertex less R1's `frontFocalZ`, R1's `frontPrincipalZ` less its `rearPrincipalZ`), the image plane and
//   the total track (the case's `imageZ`, less its first vertex): the tab's cardinal construction is the one `lv`'s R1
//   answer assembles, on the same rows;
// - to the bit: the physical stop, against twice the case's stop radius: since LV #933 the hook's stop is the stop rule's
//   at the slider's f-number, which is the case's stop radius itself (wide open the iris, stopped down the same rule);
// - derived from those, to the bit: the breathing percentage and the telephoto ratio, by the tab's own expressions;
// - measured margins, held only while LensVisualizer's engine closure and the case are the ones they were measured
//   with (`PINNED_CLOSURE`, `MEASURED_CASES`), so that a lens edit cannot turn this test red; elsewhere they are written
//   down. The current and infinity focal lengths within `MARGINS` units in the last place of R1's (`-1 / u'` of one
//   ray, or the focal length LensVisualizer stores for the zoom position, against the cardinal construction, which
//   divides by the system matrix's C and subtracts the rear principal point from the rear focal point; measured below
//   `MARGINS`). The entrance pupil, the "Image-space f/#" and,
//   at infinity focus, the "Paraxial working f/#" (LV #933) within `MARGINS` units in the last place of
//   twice R1's `entrancePupilSemiDiameter`, of R1's `efl` over that diameter, and of the same over the image space's
//   index: since #933 the hook's pupil is the stop radius over the paraxial marginal ray's height ratio at the stop, a
//   paraxial quantity as R1's is, so the two differ by roundings of two paraxial traces only.
//
// What R1 does not cover is listed in `NOT_COVERED_BY_R1`; its numbers are written as diagnostics. Then `lv`'s answer
// is held to the tab asked with a request spelled out a second time. Nothing is written. Measured at LV 607ff23ae
// (engine closure f016b35b), and again at 6287f4393 (closure fc5ae923, LV #940): the same cases and margins; at
// 55ddfb1e1, ff57c4469 and 290c6dd85 the same margins on the 123 cases of `MEASURED_CASES`, at 25f65d4b4 on 124, at
// 420b47555 on 138, and at f5b456fec on 563.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RunAperture } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { answerLvFirstOrder } from "../../../src/engines/lv/firstOrder.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvSummary, lvSummaryRequest } from "../../../src/engines/lv/summary.ts";
import type { LvOpticalSummary } from "../../../src/engines/lv/types.ts";
import { ulp } from "../../engines/ref/support.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The suites whose states the tab is held at. */
const SUITES = ["benchmark", "states", "focus-stations"] as const;

/**
 * The engine closure the margins were measured with (LensVisualizer f5b456fec; the same margins at 420b47555,
 * c5c5ba6d, 25f65d4b4, 4669921b, 290c6dd85, 0516a7c7, ff57c4469, 0b6c085a, 55ddfb1e1, ff0d938d, 6287f4393, fc5ae923,
 * and 607ff23ae, f016b35b).
 */
const PINNED_CLOSURE = "f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61";

/**
 * The first 16 hex digits of the id of each case the margins were measured on: 123 at 55ddfb1e1 (119 at 607ff23ae and
 * at 6287f4393; the Sigma 35 mm's rims and six lenses' focus stations moved 16 of them, and four stations are new); at
 * ff57c4469 the Thypoch Ksana 21's station moved with its re-solved focus gap (LV #954), the same at 290c6dd85; 124 at
 * 25f65d4b4, whose new Voigtlander Macro APO-Ultron 35 mm f/2 (LV #950) has a certified station; 138 at 420b47555,
 * whose six lens packages (LV #955, #956, #958, #959, #961) add 14 certified stations, every other case the same; 563
 * at f5b456fec, whose close-focus conjugates certified from patents (LV #990) and six lens packages add 425 certified
 * stations, every other case the same.
 */
const MEASURED_CASES: ReadonlySet<string> = new Set([
  "007b3f60ef64e98c",
  "01204c554aa6d3bd",
  "01a6b6dbbf2ba0bb",
  "01f43956285ddda0",
  "0221da5b5bb203d8",
  "02820cf1696e9889",
  "02b1e001699f7823",
  "02dd902ccabd7e9e",
  "02f5edeb04aa2f48",
  "032904853c0718dd",
  "0506040b61fb5dca",
  "0542c0c0ef9c9810",
  "058eb38708f0ab99",
  "05dd837665b76e8d",
  "06387ad2a565df2c",
  "0659c248d82dbf06",
  "072a6f509735e134",
  "07decfcb265dc340",
  "081479b0cc17e7cc",
  "08560a0361261e6d",
  "0939568662f6e63e",
  "094c8ed68417c334",
  "09c166a3940fa77c",
  "09d642275bc71fbe",
  "0af7d9da80c52f9d",
  "0ba1f8b7b11f3795",
  "0bd69baad92b2cae",
  "0c1e3e17b791b8b7",
  "0c773c72ec1ce58d",
  "0c81bb5f0f5c7ba1",
  "0ca515278e703e89",
  "0df0a12e8bcd714c",
  "0e48e496478c8c82",
  "0f5f76a6967b584c",
  "0faacc06e86dae57",
  "10bff0b1d82d1387",
  "10dabd24f0793d13",
  "112ec19c8e3e4419",
  "11e8a91c1e7e9666",
  "11fe04d53f56df0f",
  "120f80d3effbe7e6",
  "12cac0eecbb93d1a",
  "131790e53beabbc8",
  "14041d465f783f71",
  "14740286e1d8e6a6",
  "159888aa342c8ae9",
  "15ce45a11fb8c25e",
  "1658ead4b9b8a694",
  "16a485abb2556812",
  "17d8f3a57a99e178",
  "18b137c95a0dea4a",
  "18ef72984fad20ad",
  "1954d56c9b208d2c",
  "199c2510c32fa327",
  "19b0b409c1d099a4",
  "1a0c0bc7d2d51d2f",
  "1a34a84b12ddaa76",
  "1a721be0c40439c6",
  "1a94040d1d518dd6",
  "1ad0d9cd4d627a5e",
  "1c088bb3ca6f4b62",
  "1ce110eb2269e161",
  "1ce1424fcf14f48f",
  "1d1a13beb4b3fdde",
  "1dc8e1fdfc7b7c77",
  "1e3c3ef09f59892c",
  "1e6042680d6d2e5a",
  "1e645acc20ab05c6",
  "1f15f45d7800074e",
  "1fc23e9a256680d7",
  "1fd3e0cb6537e5c0",
  "1ffeed7214f4c219",
  "20423bc3d2cf0c94",
  "2115b237f50b5656",
  "21897a227bbb853b",
  "22198c5be871fa98",
  "22ace4eee4599b1f",
  "22c3ce3c7b92bc22",
  "22f573c4dcca9f77",
  "23fc42411d1d3b37",
  "24e7b94a60cf8c68",
  "25da8f06a8d3bdf2",
  "26022f540fbb0f39",
  "26cb89d09f607ed3",
  "27b663a5615d91fe",
  "297a610a898bffb7",
  "29be9da4bd581c2f",
  "2a320d30f30f6b02",
  "2a8da6053f22442e",
  "2b44b4e897fbc575",
  "2b4eb17aff35f9e7",
  "2c3afcd18b34bc40",
  "2ce4c6b72c0f592d",
  "2ce77b8c8478f44c",
  "2d5162a5955e3083",
  "2de250f4482f4038",
  "2e2275a5128c4ac0",
  "2e81f5a8166158b3",
  "2ee3771ab72d0c28",
  "2f06f9bcbc1887e6",
  "2f48866c86a5c78c",
  "2ff0526dedc1d039",
  "3089070b40af08c3",
  "30adae30e309e63f",
  "30e4a4eec70f588e",
  "30fb79f1d45ba3d6",
  "3185e3128845048f",
  "31df4fbca3db4ce1",
  "31f53066dea2c629",
  "32d0f419c0c6019a",
  "32df41682ad6ae1d",
  "33128ead666fb36d",
  "349ab1eb303865b9",
  "34ad44c5ea418642",
  "34e849567f7c8092",
  "34f712da6c8468a7",
  "353273b2752db6c3",
  "3538c790a1ec7344",
  "35ac75877ed19b34",
  "367abc6436ca5668",
  "36985dc667666fea",
  "36e163b6e545a541",
  "3707ec6d0b2b18c5",
  "388cdbbd809ed767",
  "392f7858dd1be588",
  "393954eeb4eba052",
  "3a0e80a04ef80a6e",
  "3a6c0b2f69addb62",
  "3adadad88e3f9e78",
  "3d5a20b1376dd20d",
  "3d8ef6eae263508b",
  "3f67f17d8ce11038",
  "3f8466490daa4022",
  "4072db5bde9aaa40",
  "4152f2b7c34b5f44",
  "41e4575aed432625",
  "425064aee516a775",
  "42a23f2a0ae6b263",
  "42f1dbbc8e8b0605",
  "435a3d3755ba0748",
  "449063f9188b5228",
  "44d2f549841a23ea",
  "44def313f172415f",
  "44f1e51b55435c93",
  "4556b24f2345c91f",
  "45a7fba1662ebb81",
  "461df00281f0e763",
  "4687cf6f28faea86",
  "4709c8f33a736a0d",
  "473324337d1790b3",
  "48875681410df43c",
  "491592747df51132",
  "492bc1ba7a172500",
  "495e025cf111be79",
  "49c345c2e52f3954",
  "4a09d3a8f987ad3b",
  "4b0c13af1b80402b",
  "4bace493f4664aa0",
  "4c007de74973def2",
  "4c574d45acf293c2",
  "4d0027fc761e6ab1",
  "4da47b6461b25174",
  "4e0f4450b3b15800",
  "4e6a5b989dbe8b3f",
  "4e6d38646aa0a759",
  "4e764b1090416761",
  "5014298c052103c0",
  "5076dcdc32e65c58",
  "5233b189f5f1d6b2",
  "524c077c583638b3",
  "53c5ca7e688cbf9f",
  "54b85cd00d5757df",
  "564ff7cc88206b52",
  "568f93341d119dcc",
  "56fd1537e25aeb09",
  "57eede7a4660658d",
  "584b729ce8497874",
  "58a5c1eeaa94dbf9",
  "58eb582de9ad963e",
  "5ac566e7a358c1f2",
  "5acffd255bd16dec",
  "5af3e685a9cdeb32",
  "5b10afde2e0e4c2b",
  "5b2b3db5b33e53d2",
  "5b3114cea8941717",
  "5ba1047765a6aae7",
  "5bca6fc27b2fd6d1",
  "5c34668074f689cf",
  "5d99c73aca6f15ba",
  "5db1210c3a0639a8",
  "5fc447c1c97b82af",
  "601393a3044f1793",
  "6039d74b62d6fb47",
  "605fcb3a60139187",
  "60ef1083ef5b277e",
  "617deed34e0bc25b",
  "61a18f7079152b91",
  "61c16fa7a19d167d",
  "61dff6ad0f8653a7",
  "62c7c33f9322b262",
  "62d4f5600679b10f",
  "633723a1dc2769db",
  "63c31b9a55e5f68d",
  "644f8b54712f2e8e",
  "647232257bbf24ae",
  "64b6f1847543465f",
  "64c5132b877b8ca8",
  "650612fe98b240e9",
  "6615a48be75c6f6f",
  "664a578c48b55097",
  "66629bfed7b0cb8a",
  "673095cfc1f5665f",
  "67db6e012a0d70a8",
  "6804416e4035b07a",
  "684850d3964d47a1",
  "686e71c6302d2250",
  "68b35565f88f9174",
  "68fd449102898daf",
  "6977feb12c003abe",
  "69867866857b2411",
  "699a701d3a494ca1",
  "6acf99c154fb65f1",
  "6b2555e7c9c4874f",
  "6b5f11f070ec176f",
  "6bf046b2fca4fea5",
  "6c1a72f1e69116d0",
  "6c952bd3bd5ed38d",
  "6d49ddfb2101e973",
  "6e2c35ab174efbaa",
  "6e692a0e199cabf6",
  "6e70c91e6d7cc6e3",
  "70d5a589da4a7527",
  "72842c3de154ccbb",
  "728d6eb879bdd4c6",
  "7345ce6b72b8f9b2",
  "7485fec643f9963e",
  "74ba94d182bf9f34",
  "754f2b025e25a0d6",
  "75e87a15390874d2",
  "761065a107d93181",
  "7633bba353a8983b",
  "7651d8630259c429",
  "7654996fb632089d",
  "77240b3249fc2f96",
  "772babd6c9a9365f",
  "789c8f3bec5cd171",
  "790aa5cecdcc610c",
  "79efb42674743a70",
  "7a388e1ded3da769",
  "7a9028a0badf2cac",
  "7a92eb0b2623d19d",
  "7b1b24be56aa9ef6",
  "7b74926af86c489c",
  "7c3073c4e7dbedf0",
  "7c8acc3119b2e7ad",
  "7cdedfe0afa1f948",
  "7da5afc39f4d2091",
  "7eb9c1747c30cca2",
  "7f0c3394b7c516d1",
  "802d70438fb54dc5",
  "803b931ecef50d7d",
  "809dced0ccd1d744",
  "80efd11805c2f43e",
  "817dcdb72789e4f1",
  "8270906e01b3faca",
  "827ce23a9b1f784a",
  "831d890fac38889e",
  "8335a5251045d2e9",
  "835a3f4894190eac",
  "83609a5e72d9ce66",
  "83bc7aa668f82b6b",
  "83f213e2d7558446",
  "848e096ac814bc7e",
  "849578276ae0917f",
  "84a8304e46408c11",
  "84e21a2ef03892e1",
  "851b25697188fac9",
  "8572bf9def6e604f",
  "859e2d8473c40477",
  "85ef91b49c1fa042",
  "861a915ddd7dd32d",
  "867e8c02e2e51290",
  "8684236b453c59e4",
  "874854625cf1dd58",
  "8781ecb5ed087385",
  "87a4bd600ffd221c",
  "88fee4e84777e718",
  "894debefc6fdb16f",
  "8962fef3413f982a",
  "8aa5a1903fcbabfa",
  "8b15e190d96badcf",
  "8b2d93d21f796135",
  "8c8c77f96c10b8ea",
  "8ce40609635aa025",
  "8d3e9c7edae6b2c2",
  "8dc43e6156349059",
  "8dd3c38f79512c8e",
  "8e11925aa8e83363",
  "8ee6b705de575b51",
  "8f061a078ebc5c41",
  "8f8a78031bf7e8fc",
  "8f9101aff121f657",
  "8fb59498f29e1c7a",
  "8ff2779f4dbf10dc",
  "904ae8663e1e2381",
  "90cf96e171022d27",
  "917aabd708bd0c3a",
  "9276015f4a09ae0d",
  "927d7b116e4613a1",
  "931a2fd406cad927",
  "93370aead6b9eb8d",
  "9370a35911029626",
  "93952c999c082df5",
  "941b9f3552c17085",
  "9517919343753afb",
  "96317fcb0a131f9a",
  "975c342338c09237",
  "9876f2f2d40b0326",
  "9908419e0a2a982a",
  "994c354dbc1f23b3",
  "999ac964b757f064",
  "99ab56e036398a2f",
  "99b6b35e6ae7faa9",
  "99e6158c59a3c444",
  "9a99b242cacc763c",
  "9aee102182725025",
  "9ba05d040ce805b2",
  "9c98d0c2b41e30c6",
  "9cfb82047b41aaa7",
  "9da7115b90a353e7",
  "9ddf0f72e741c0ab",
  "9e3671b68b403840",
  "9e41b5bf7c9d9808",
  "9ef266fd9a3fabdb",
  "9fa80a8f8b76373a",
  "a0a15a83d3ed7673",
  "a0fab34e925d88be",
  "a15a42e1725b3dfd",
  "a29affd282fc0329",
  "a2d47f36c6de6e38",
  "a2f8c45732b7b0e7",
  "a331ea4d3d83ed0b",
  "a38d1660058fbc62",
  "a4839027e563f13d",
  "a4c88b2daaa7bc52",
  "a4dfa43e5f2ab842",
  "a50e4d560132582e",
  "a54061eb49a7332a",
  "a686006fbdc209c3",
  "a68b6e65c29807b2",
  "a6d17bd47a0871f5",
  "a76c758989f346f9",
  "a7e01309afe588ac",
  "a8ca108087cb4047",
  "a9fc28dc90bb6ec3",
  "aa15565b6f8e0b8a",
  "aae9784dbc44048c",
  "aaff9815c508484d",
  "ab34a3ff91510c89",
  "ac18424133a2877c",
  "ac19c63d75ccb57c",
  "ac23c5b2dc605591",
  "ac88de07818d1997",
  "acac46175d88ebc3",
  "acd45c4d3d13b956",
  "acd7822027052cc1",
  "ad75bc6dbf8cb4e2",
  "ad9124aebcc56a18",
  "adaa2817d924e9cf",
  "adb398c00f907f3e",
  "ade62a3814335cd5",
  "ae188d3eb305c520",
  "ae8bf10ab266a2ce",
  "af344b9a7e77fe21",
  "afd88c2a4303eb95",
  "b0898bf3156193b3",
  "b095f288ed25fe88",
  "b0be2f20e5b95353",
  "b0f8f5466dfaa4f6",
  "b24bae37c1ae83dc",
  "b2e66abb6142cc75",
  "b3211d4baf264bbb",
  "b33aa5339bb9ddeb",
  "b3794c6c5924cee4",
  "b4a9bef13532c716",
  "b4df0a69dc5cf780",
  "b549e5c3c090d253",
  "b57c2bcd2ba8aa92",
  "b61d935c9cf0e675",
  "b67aae200c54706f",
  "b79ae4124a45de47",
  "b86c34c5d24a108f",
  "b93af58a7695e819",
  "b9a9bc31d71e1800",
  "ba658fb5ff0e02c4",
  "bac47355d7cb929f",
  "baf2330f967ed007",
  "baf5883c8fe1fe3b",
  "bb27c7072ea9bd02",
  "bb2f07710783da47",
  "bb47082c2e9124e5",
  "bb7e2824a1284700",
  "bbc4882e5753115e",
  "bbd4687c1f32e281",
  "bc33e93ab5f2c875",
  "bc450fda457115ba",
  "bcb4e0d9695ea9a1",
  "bd1f4b506bafaa6b",
  "bd29ef5fd591536d",
  "bdb7bb2ffb29388e",
  "bdba0ea2e9d167e3",
  "bdc2ecb131b7c5c3",
  "bde4a846cf5bd611",
  "be30e882d556f3c9",
  "beba7c04a0ef502b",
  "bec4e1245fa65a0c",
  "bed3f4d42fa7546b",
  "bedbeafbd8b76df3",
  "bf2ae8d971feac5f",
  "bf3a63249af567f9",
  "c1cc4adf97b7f0c6",
  "c1d668465d6f4597",
  "c2f5f0cae70fe4f0",
  "c3f6ab9a4c36016c",
  "c462eae2e34a6ff9",
  "c4cafe389ff19f2b",
  "c59e472ec4b0a756",
  "c75804344ae15f0b",
  "c76e47f2877fc163",
  "c7f1b99704f56d90",
  "c85c649ac9839fed",
  "c969a54e33addead",
  "c976f174252a57c0",
  "ca4650a2f1cab812",
  "cc40fbe56d554487",
  "cc4c40bbff38b43f",
  "cc8c28a93b909714",
  "ccbca3c4799d7e3c",
  "ccc15ae0dac7f791",
  "cd0f69521e93cd74",
  "cd2d5eb4481fbd7b",
  "ce27fcfe8f43af2f",
  "ce59e97f80de480f",
  "ce632d6fe72f4ec5",
  "ce80398ec92f8320",
  "cf4bb2d23fa88ce9",
  "cf514c08dccef216",
  "cf5bfc19bb19d941",
  "cf90a40810f02e10",
  "cfd2f4b05ff51140",
  "cfdaf3f52ab425d4",
  "cfe08daed58c95d0",
  "d18f229aef311b3a",
  "d1ad44f0f8712fa0",
  "d1d8b2bd8829d3ad",
  "d1fd0633e961ca14",
  "d2b22ff17294de53",
  "d3441b94626128ca",
  "d348a69fbaf62f11",
  "d3ae321dda082702",
  "d3c8e53174c6be10",
  "d424d68bbbd3e550",
  "d48d25aa87a341c4",
  "d4ffbc92564c8a7e",
  "d6dd88710ac133d1",
  "d718e729027e34c4",
  "d74acafd5f1a120a",
  "d75d7b205f0834fb",
  "d78bb4326af3a9d0",
  "d7fd59e8546239bf",
  "d97afe6603d4b63f",
  "da0779f5c87036d8",
  "da13641599ed3385",
  "dad35d019b2439ac",
  "daf6cfe868bd42ca",
  "db455dd71151e3a2",
  "db4a7601df913863",
  "db842ef619ba37a5",
  "dc0cc7f4f4644e26",
  "dc3580db5fed1087",
  "dc6964ddf994f4ff",
  "dc7021dbc6deaddc",
  "dedd97fdf238f1a6",
  "deef946578878a59",
  "df218c15a379cb44",
  "df2e8df023f90e80",
  "e05ac48d6f62767a",
  "e130c3836ae82e58",
  "e170a27bf0f04b35",
  "e251d77e7e9131f9",
  "e2778a011e81560e",
  "e29835a068866e0e",
  "e2bc6480c13ead2b",
  "e2f043f6aa82be4c",
  "e3073666315beed7",
  "e3494e8829f87762",
  "e37ca0c74deea030",
  "e3849910ab68459a",
  "e3c1b9c0842d88e4",
  "e44ac8f3c84fa88e",
  "e4534f9312bc7116",
  "e46f7fc23b6b81b9",
  "e476455a4bdc2b93",
  "e47656015310f4c2",
  "e53f27ceace560d7",
  "e5652d1c3daaad6f",
  "e5c81ba6fc286de1",
  "e66d7ce98eb7ba9e",
  "e70a5e6c2523ef1c",
  "e737912bcbff82b3",
  "e812e383aefbf137",
  "e82d9f1b13e2dfec",
  "e92c44ff169ec871",
  "e9ad1a503946236f",
  "ea2d44532a8c91e0",
  "ea751965cfb356c7",
  "ea900cc01fb5f407",
  "eafde4b337d5f558",
  "ebbe710591c2d156",
  "ec7291d15103b514",
  "ed6e459641a35aad",
  "ed8aaa73b01961d3",
  "edbb96ac1dd518cf",
  "ee0b49410666fe2b",
  "ee5585114d371991",
  "ee99cc711bbba025",
  "eeb1536ebab03437",
  "ef717536eccebb3c",
  "efa48c25e865d81a",
  "f032558f1e6a2c97",
  "f0a449e22ef95a6b",
  "f0e136e0d546b163",
  "f1071f7701d95446",
  "f1649607a5646446",
  "f2ba46d7a8b2499a",
  "f3176f9fcc81f8ee",
  "f3b6869f0d15a83f",
  "f3fcc3b63cd7c8c3",
  "f4348412d8ada6b5",
  "f446a92e6cb96c11",
  "f5314d24ac520723",
  "f57b92aba3b70ab8",
  "f70e7ed164b5b561",
  "f725438a5cbe874b",
  "f738c7fd1c6b1e01",
  "f7393efc5b8bfd96",
  "f86c8e0d4e6f836c",
  "f8829f88dc97382f",
  "f8e388d76b003371",
  "f9ea0af71ddd36e4",
  "fa1f47fa266f2a3b",
  "fb063dc8a16a740e",
  "fb6313aafaef4cc6",
  "fb95d667fc58d585",
  "fc71d244aec38864",
  "fc812ae448306763",
  "fd2e77883f35206d",
  "fd45e49d468ba67f",
  "fdbd44e4a0309a7b",
  "fe2bc2c4bbffc728",
  "fec31ee7ac04ef67",
  "ff0673bd6d7835fc",
  "ffd2647be8fcac30",
]);

/**
 * The measured margins, in units in the last place (at 607ff23ae, on the 119 cases of `MEASURED_CASES`): the focal
 * lengths 16 (measured 15, the Olympus Zuiko Digital ED 7-14 mm, new at 607ff23ae, at its focus station of zoom
 * station 32; 7 at 098c91ef6 on the older cases), the pupil 0 (to the bit), the image-space and paraxial working
 * f-numbers 20 (measured 19 on the same station, and 3 for the paraxial working f-number at infinity). Measured again
 * at 6287f4393 (closure fc5ae923): 15, 0, 19 and 3 on the same 119 cases; at 55ddfb1e1 (closure ff0d938d): 15, 0, 19
 * and 3 again, on the 123 cases; the same at ff57c4469 (closure 0b6c085a) and 290c6dd85 (closure 0516a7c7), at
 * 25f65d4b4 (closure 4669921b) on the 124 cases, and at f5b456fec (closure f0066505) on the 563 cases.
 */
const MARGINS = { focalUnits: 16, pupilUnits: 0, fNumberUnits: 20 } as const;

/**
 * Each readout of the summary tab that R1 does not judge, and why, then what is presented beside the readouts. Each is
 * recorded by rung R12b where it is a value of `summary.native` (the half field, the working f-number), or in its
 * `sampling` (the focus distance); the controls are the state itself.
 */
export const NOT_COVERED_BY_R1: Readonly<Record<string, string>> = Object.freeze({
  halfFieldDeg:
    "the hook's analysis field geometry (computeAnalysisFieldGeometry): the field whose solved real chief ray lands " +
    "at the image corner, half the stated image circle or the format's diagonal (a cylindrical image surface's " +
    "frame edge since LV #960, a state the exporter refuses), within 1e-4 mm; the last field " +
    "whose chief ray clears every aperture where one clips it short of the corner; or the projection's authored trace " +
    "field, no larger than the corner's; no engine has the quantity: R9a judges the chief ray at that angle (the " +
    "distortion curve's edge) at every infinity state, and the angle is LensVisualizer's solve",
  fullFieldDeg: "twice halfFieldDeg",
  focusDistanceM:
    "the object-to-image distance at which the state's authored rows are paraxially in focus, interpolated in inverse " +
    "distance between rows (LV #954, focusLabelDistanceM; the authored close focus over the focus position where it " +
    "models none: a folded path, or a focus that moves no gap): LensVisualizer's model of the focus, not the " +
    "conjugate the case states",
  zoomT: "the state's zoom control, which the case states as it is",
  focusT: "the state's focus control, which the case states as it is",
  aberrationT: "the aberration control, neutral in every case",
  "Current Perspective Pose":
    "the section the tab shows above the readouts where the request's pose is active (a shift or tilt): no case has " +
    "one, and the readouts are of the lens without it",
  workingFNumber:
    "1 / (2 n' sin t') of the real marginal ray aimed at the stop rim (LV #933, computeWorkingFNumber): no first-order " +
    "quantity; R12b records it beside optiland's own get_working_FNO at infinity focus, and at a finite focus, where " +
    "LensVisualizer's object is the paraxial conjugate of the image plane and not the case's, under sampling",
  "paraxial working f/":
    "the aperture control's readout beside the mark (LV #933, the summary's paraxial working f-number), shown only " +
    "where it differs from the mark by more than PARAXIAL_WORKING_NOTE_DIFFERENCE (0.05) and showEffectiveAperture is " +
    "on: the readout of paraxialWorkingFNumber, which is covered",
});

/** The entries of `NOT_COVERED_BY_R1` that are no readout of `computeOpticalSummary`. */
const BESIDE_THE_READOUTS = ["Current Perspective Pose", "paraxial working f/"];

/** The readouts R1 or the case covers, and how: each is asserted below. */
const COVERED = [
  "currentEFLMm",
  "infinityEFLMm",
  "breathingPercent",
  "imageSpaceFNumber",
  "paraxialWorkingFNumber",
  "entrancePupilDiameterMm",
  "physicalStopDiameterMm",
  "imagePlaneZMm",
  "totalTrackMm",
  "telephotoRatio",
  "surfaceCount",
  "rearPlateCount",
  "rearPlateThicknessMm",
  "opticalPath",
  "cardinalEFLMm",
  "bfdMm",
  "ffdMm",
  "principalHiatusMm",
];

/** How far apart two doubles are, in units in the last place of the larger. */
function units(a: number, b: number): number {
  return a === b ? 0 : Math.abs(a - b) / ulp(Math.max(Math.abs(a), Math.abs(b)));
}

/** The relative difference of two numbers. */
function relative(a: number, b: number): number {
  return Math.abs(a - b) / Math.abs(b);
}

/** The value of a first-order answer at its only line. */
function valueOf(data: unknown, name: string): number {
  return decodeNdArray((data as Record<string, Parameters<typeof decodeNdArray>[0]>)[name]).values[0];
}

/** Whether a case is the tab's: the reference line of authored indices, on the prepared state's image plane. */
function isTabCase(opticalCase: OpticalCase, model: LvCaseModel): boolean {
  const { lines, imageZ } = opticalCase.conditions;
  return lines.length === 1 && lines[0].indexSource === "authored" && imageZ === model.state.imgZ;
}

/** One state of the tab: a run's case, rebuilt as LensVisualizer holds it, and the aperture the run asked. */
interface TabState {
  readonly name: string;
  readonly model: LvCaseModel;
  readonly aperture: RunAperture | undefined;
}

/** The tab's states of the three suites: each case once, rebuilt as LensVisualizer holds it. */
async function tabStates(binding: LvBinding): Promise<TabState[]> {
  const build = createLensBuilder(binding);
  const sources = { lv: createLvCaseSource(LV_PATH) };
  const seen = new Set<string>();
  const states: TabState[] = [];
  for (const suiteName of SUITES) {
    const suite = await loadSuite(suitePath(suiteName), { rootDir: REPO_ROOT, sources });
    for (const { spec, opticalCase } of suite.runs) {
      if (opticalCase === null || seen.has(opticalCase.id)) continue;
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      assert.ok(rebuilt.ok, spec.name);
      if (!isTabCase(opticalCase, rebuilt.model)) continue;
      seen.add(opticalCase.id);
      states.push({ name: `${suiteName}/${spec.name}`, model: rebuilt.model, aperture: spec.aperture });
    }
  }
  return states;
}

test(
  "the summary tab's first-order readouts are lv's R1 answer and the case's, at every state of three suites",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const exporter = createLvExporter(binding);
    const build = createLensBuilder(binding);
    const states = await tabStates(binding);
    const pinnedClosure = binding.fingerprint().engineClosureHash === PINNED_CLOSURE;
    const worst = { focal: 0, pupil: 0, fNumber: 0, paraxialWorking: 0 };
    const where = { focal: "", fNumber: "" };
    let held = 0;
    let finite = 0;
    const infinityEfl = new Map<string, number>();
    for (const { name, model } of states) {
      const summary: LvOpticalSummary = api.computeOpticalSummary(lvSummaryRequest(api, model));
      const answer = answerLvFirstOrder(api, model);
      assert.ok(answer.supported, name);
      const r1 = (value: string): number => valueOf(answer.data, value);
      const { exported, state, runtime } = model;
      const z0 = exported.system.surfaces[0].z;
      const { imageZ, stopSemiDiameter } = exported.conditions;
      // To the bit: the tab's cardinal construction is the one lv's R1 answer assembles.
      assert.equal(summary.cardinalEFLMm, r1("efl"), `${name}: cardinal EFL`);
      assert.equal(summary.bfdMm, r1("backFocus"), `${name}: BFD`);
      assert.equal(summary.ffdMm, z0 - r1("frontFocalZ"), `${name}: FFD`);
      assert.equal(summary.principalHiatusMm, r1("frontPrincipalZ") - r1("rearPrincipalZ"), `${name}: hiatus`);
      assert.equal(summary.imagePlaneZMm, imageZ, `${name}: image plane`);
      assert.equal(summary.totalTrackMm, imageZ - z0, `${name}: total track`);
      // A measured margin, held at the pinned closure and case: -1 / u' of one ray, or the stored focal length at
      // infinity, against the cardinal construction.
      const pinned = pinnedClosure && MEASURED_CASES.has(exported.id.slice(0, 16));
      if (pinned) held++;
      const current = units(summary.currentEFLMm!, r1("efl"));
      if (pinned)
        assert.ok(current <= MARGINS.focalUnits, `${name}: current EFL ${summary.currentEFLMm} against ${r1("efl")}`);
      const zoomKey = `${runtime.source.key}@${state.zoomT}`;
      if (!infinityEfl.has(zoomKey)) {
        const infinity = await exporter.exportLens(runtime.source.key, { state: { zoomT: state.zoomT } });
        assert.ok(infinity.ok, zoomKey);
        const rebuilt = await rebuildCase(binding, build, infinity.opticalCase);
        assert.ok(rebuilt.ok, zoomKey);
        const atInfinity = answerLvFirstOrder(api, rebuilt.model);
        assert.ok(atInfinity.supported, zoomKey);
        infinityEfl.set(zoomKey, valueOf(atInfinity.data, "efl"));
      }
      const infinity = units(summary.infinityEFLMm!, infinityEfl.get(zoomKey)!);
      if (pinned) {
        assert.ok(
          infinity <= MARGINS.focalUnits,
          `${name}: infinity EFL ${summary.infinityEFLMm} against ${infinityEfl.get(zoomKey)}`,
        );
      }
      if (Math.max(current, infinity) > worst.focal) where.focal = name;
      worst.focal = Math.max(worst.focal, current, infinity);
      // To the bit: the hook's stop is the stop rule's, which is the case's stop radius (LV #933).
      assert.equal(summary.physicalStopDiameterMm, 2 * stopSemiDiameter, `${name}: physical stop`);
      // A measured margin: the hook's paraxial pupil, and the f-numbers formed of it, against R1's paraxial ones.
      const diameter = 2 * r1("entrancePupilSemiDiameter");
      const pupil = units(summary.entrancePupilDiameterMm!, diameter);
      const fNumber = units(summary.imageSpaceFNumber!, Math.abs(r1("efl")) / diameter);
      if (pinned) {
        assert.ok(pupil <= MARGINS.pupilUnits, `${name}: entrance pupil ${pupil} units`);
        assert.ok(fNumber <= MARGINS.fNumberUnits, `${name}: Image-space f/# ${fNumber} units`);
      }
      worst.pupil = Math.max(worst.pupil, pupil);
      if (fNumber > worst.fNumber) where.fNumber = name;
      worst.fNumber = Math.max(worst.fNumber, fNumber);
      // At infinity focus the paraxial working f-number is the image-space one over the image space's index, the
      // marginal ray being parallel to the axis: R1's efl over its pupil's diameter, which lv states.
      if (exported.conditions.object.kind === "infinity") {
        const indices = decodeNdArray(exported.conditions.indexAfterSurface).values;
        const imageIndex = indices[exported.system.surfaces.length - 1];
        const working = units(summary.paraxialWorkingFNumber!, Math.abs(r1("efl")) / (imageIndex * diameter));
        if (pinned) assert.ok(working <= MARGINS.fNumberUnits, `${name}: Paraxial working f/# ${working} units`);
        worst.paraxialWorking = Math.max(worst.paraxialWorking, working);
      }
      // Derived, to the bit, by the tab's own expressions of the readouts held above.
      const breathing = (100 * (summary.currentEFLMm! - summary.infinityEFLMm!)) / summary.infinityEFLMm!;
      assert.equal(summary.breathingPercent, breathing, `${name}: breathing`);
      assert.equal(summary.telephotoRatio, summary.totalTrackMm! / Math.abs(summary.currentEFLMm!), `${name}: ratio`);
      // The structure of the case: its surfaces, a rear plate being two of them, and a sequential path.
      assert.equal(summary.surfaceCount + 2 * summary.rearPlateCount, exported.system.surfaces.length, name);
      assert.equal(summary.opticalPath, "sequential", name);
      const plates = exported.system.surfaces.filter((surface) => surface.synthetic === "rearPlate");
      const thickness = plates
        .filter((_plate, index) => index % 2 === 0)
        .reduce((sum, plate) => sum + plate.thickness, 0);
      assert.ok(Math.abs(summary.rearPlateThicknessMm - thickness) <= 1e-12, `${name}: plate thickness`);
      if (exported.conditions.object.kind === "finite") finite++;
    }
    assert.ok(states.length >= 100 && finite > 0, `${states.length} states, ${finite} finite`);
    // Every readout is either covered above or listed as not covered.
    const presented = Object.keys(api.computeOpticalSummary(lvSummaryRequest(api, states[0].model))).sort();
    const notCovered = Object.keys(NOT_COVERED_BY_R1).filter((name) => !BESIDE_THE_READOUTS.includes(name));
    assert.deepEqual(presented, [...COVERED, ...notCovered].sort());
    t.diagnostic(
      `${binding.fingerprint().commit}: ${states.length} states (${finite} finite), the margins held on ${held}; worst: focal lengths ` +
        `${worst.focal} units (${where.focal}), pupil ${worst.pupil} units, Image-space f/# ${worst.fNumber} units ` +
        `(${where.fNumber}), Paraxial working f/# at infinity ${worst.paraxialWorking} units`,
    );
  },
);

test(
  "what R1 does not cover: the half field, the focus distance, and the f-numbers LensVisualizer marks",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const states = await tabStates(binding);
    let authoredField = 0;
    // The landing of the solved chief ray at each half field that is not authored, mm to 1e-3: the image corners.
    const landings = new Map<string, number>();
    let largestMarked = { name: "", value: 0 };
    let largestWorking = { name: "", value: 0 };
    let vignettedMarginal = 0;
    let largestFocus = { name: "", value: 0 };
    for (const { name, model } of states) {
      const answer = answerLvSummary(api, model, { lines: [0] });
      assert.ok("data" in answer, name);
      const [line] = answer.data.lines;
      // The tab's half field is the projection's authored trace field where the lens states one.
      const { data } = await binding.lens(model.runtime.source.key);
      const projection = (data as { projection?: { maxTraceFieldDeg?: number; fullFieldDeg?: number } }).projection;
      const authored = projection?.maxTraceFieldDeg ?? (projection?.fullFieldDeg ?? Number.NaN) / 2;
      if (line.halfFieldDeg === authored) authoredField++;
      else {
        const { state, runtime } = model;
        const geometry = api.computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, runtime, 0);
        const landing = api.chiefRayImageHeightAccurateForRuntimeLens(
          line.halfFieldDeg!,
          [...state.z],
          state.focusT,
          state.zoomT,
          runtime,
          geometry,
          0,
        );
        const key = Math.abs(landing).toFixed(3);
        landings.set(key, (landings.get(key) ?? 0) + 1);
      }
      // The marked f-number against the tab's "Image-space f/#", and the real marginal ray's against it, at infinity.
      if (model.exported.conditions.object.kind === "infinity") {
        const marked = relative(line.imageSpaceFNumber!, line.nominalFNumber!);
        if (marked > largestMarked.value) largestMarked = { name, value: marked };
        if (line.workingFNumber !== null) {
          const working = relative(line.workingFNumber, line.imageSpaceFNumber!);
          if (working > largestWorking.value) largestWorking = { name, value: working };
        } else vignettedMarginal++;
      } else {
        // The focus distance readout against the case's object, measured to the image plane, in metres.
        const object = model.exported.conditions.object as { kind: "finite"; z: number };
        const distance = (model.exported.conditions.imageZ - object.z) / 1000;
        const apart = Math.abs(line.sampling.focusDistanceM - distance);
        if (apart > largestFocus.value) largestFocus = { name, value: apart };
      }
    }
    t.diagnostic(
      `${binding.fingerprint().commit}: ${authoredField} of ${states.length} states have the authored half field, ` +
        `the others' chief rays land at ${[...landings].map(([mm, count]) => `${mm} mm (${count})`).join(", ")}; ` +
        `the tab's Image-space f/# is furthest from the marked f-number at ${largestMarked.name}, ` +
        `${(100 * largestMarked.value).toFixed(4)}%; its Working f/# from its Image-space f/# at ${largestWorking.name}, ` +
        `${(100 * largestWorking.value).toFixed(2)}% (${vignettedMarginal} infinity states without one: the marginal ray ` +
        `vignetted, unaimed or not traced); the focus readout is furthest from the case's object distance ` +
        `at ${largestFocus.name}, ${(1000 * largestFocus.value).toFixed(3)} mm`,
    );
  },
);

test(
  "lv's summary.native is the tab asked with a request spelled out again, at every state",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const states = await tabStates(binding);
    let exact = 0;
    for (const { name, model, aperture } of states) {
      const { state, runtime, exported } = model;
      const { focusT, zoomT } = state;
      // The hook, as useLensComputation.ts writes it (LV #933), with the aperture slider at the f-number the run asked:
      // wide open, a number, or 8 for the MTF tab's f/8 comparison, whose stop is the slider's f/8 to the bit.
      const firstOrderRequest = api.createAnalysisRequest({
        preparedState: api.prepareRuntimeState(runtime, focusT, zoomT, 0),
        dynamicEFL: runtime.EFL as number,
        currentEPSD: (runtime.EP as { epSD: number }).epSD,
        currentPhysStopSD: runtime.stopPhysSD,
      });
      const dynamicEFL = api.computeFocusEFL(firstOrderRequest);
      const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, 0);
      const slider = api.fNumberAtStopdown(0, zoomT, runtime);
      const fNumber =
        aperture?.kind === "f-number" ? aperture.value : aperture?.kind === "lv-f8-comparison" ? 8 : slider;
      const currentPhysStopSD = api.stopSemiDiameterForFNumber(fNumber, zoomT, runtime);
      const currentEPSD = api.entrancePupilAtState(currentPhysStopSD, focusT, zoomT, runtime, fieldGeometry, 0).epSD;
      const marked = fNumber;
      // The drawer, as AnalysisDrawerContent.tsx writes it, settled.
      const request = api.createAnalysisRequest({
        preparedState: state,
        dynamicEFL,
        currentEPSD,
        currentPhysStopSD,
        fieldGeometry,
      });
      const tab = api.computeOpticalSummary(request);
      const answer = answerLvSummary(api, model, { lines: [0] });
      assert.ok("data" in answer, name);
      const [line] = answer.data.lines;
      const atInfinity = exported.conditions.object.kind === "infinity";
      const traced = tab.workingFNumber.status === "traced" ? tab.workingFNumber.value : null;
      const presented: [string, number | null, number | null][] = [
        ["focalLengthMm", line.focalLengthMm, tab.currentEFLMm],
        ["entrancePupilDiameterMm", line.entrancePupilDiameterMm, tab.entrancePupilDiameterMm],
        ["stopDiameterMm", line.stopDiameterMm, tab.physicalStopDiameterMm],
        ["imageSpaceFNumber", line.imageSpaceFNumber, tab.imageSpaceFNumber],
        ["paraxialWorkingFNumber", line.paraxialWorkingFNumber, atInfinity ? tab.paraxialWorkingFNumber : null],
        ["workingFNumber", line.workingFNumber, atInfinity ? traced : null],
        ["totalTrackMm", line.totalTrackMm, tab.totalTrackMm],
        ["halfFieldDeg", line.halfFieldDeg, tab.halfFieldDeg],
      ];
      // The case's stop is the hook's to the bit, wide open and stopped down (LV #933): every value is the tab's.
      for (const [value, answered, expected] of presented) assert.equal(answered, expected, `${name}: ${value}`);
      if (!atInfinity) {
        assert.equal(line.sampling.lvParaxialWorkingFNumberAtParaxialObject, tab.paraxialWorkingFNumber, name);
        if (traced !== null) assert.equal(line.sampling.lvWorkingFNumberAtParaxialObject, traced, name);
      }
      // The mark: the slider's own wide open, and otherwise the rule's f-number taken back from the stop radius.
      const wideOpen = aperture === undefined || aperture.kind === "wide-open";
      if (wideOpen) assert.equal(line.nominalFNumber, marked, `${name}: nominalFNumber`);
      else assert.ok(units(line.nominalFNumber!, marked) <= 4, `${name}: nominalFNumber ${line.nominalFNumber}`);
      exact++;
      assert.equal(stopOf(exported), currentPhysStopSD, name);
      assert.ok(!("lvThinLensEffectiveFNumber" in line.sampling), name);
      assert.equal(line.rearFocalZ, api.computeCardinalElementsFromState(state)!.points.rearFocal.z, name);
    }
    assert.ok(exact > 0);
    t.diagnostic(
      `${binding.fingerprint().commit}: ${states.length} states; every value the tab's to the bit on ${exact}`,
    );
  },
);

/** The case's stop radius. */
function stopOf(opticalCase: OpticalCase): number {
  return opticalCase.conditions.stopSemiDiameter;
}
