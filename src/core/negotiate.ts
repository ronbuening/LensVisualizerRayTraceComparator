// Capability negotiation: whether an engine can be asked a request about a case, decided from its descriptor alone.
import type { OpticalCase } from "../contract/case.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import { FEATURE_LIMITS, deriveFeatures } from "../contract/features.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { UnsupportedItem } from "../contract/result.ts";
import { isContractInRange } from "../contract/version.ts";

/**
 * Everything that keeps an engine from answering `request` about `opticalCase`, judged by its descriptor; an empty
 * list means the engine can be asked. Pure: the engine is not contacted and nothing is read but the arguments. The
 * order is fixed, so equal arguments give an equal list:
 *
 * 1. `contract`: a contract version the case or the request is written to that lies outside the range the engine
 *    speaks; one item per distinct version, the case's first;
 * 2. `quantity`: the request's quantity, when the engine does not offer it, or implements another version of its
 *    definition than `definitionVersion`, the comparator's own, where one is given: an answer to another definition
 *    is not an answer to what was asked, whatever it holds;
 * 3. `feature`: each feature flag of the case that the engine does not list as supported, in the case's order;
 * 4. `feature`: each numeric limit, in `FEATURE_LIMITS` order, for which the case needs more than the engine
 *    declares. The message names the limit and both numbers. A limit the engine leaves out is unbounded.
 *
 * The flags are the ones the case states; the limits are derived from its system and conditions. The first three
 * arguments are expected to be schema-valid. `definitionVersion` is the version of the quantity's definition that
 * whoever asks holds the answer to (`QuantityModule.version`); an engine that negotiates for itself, against its
 * own descriptor, gives none.
 */
export function negotiate(
  opticalCase: OpticalCase,
  request: QuantityRequest,
  descriptor: EngineDescriptor,
  definitionVersion?: number,
): UnsupportedItem[] {
  const items: UnsupportedItem[] = [];
  const { features, quantities } = descriptor.capabilities;

  const { min, max } = descriptor.contract;
  const documents = [
    ["the case", opticalCase.contract],
    ["the request", request.contract],
  ] as const;
  for (const version of new Set(documents.map(([, written]) => written))) {
    if (isContractInRange(version, descriptor.contract)) continue;
    const names = documents.filter(([, written]) => written === version).map(([name]) => name);
    const written = `${names.join(" and ")} ${names.length > 1 ? "are" : "is"} written to ${version}`;
    items.push({ code: "contract", item: version, message: `the engine speaks contract ${min} to ${max}; ${written}` });
  }

  if (!Object.hasOwn(quantities, request.quantity)) {
    items.push({ code: "quantity", item: request.quantity, message: `the engine does not offer ${request.quantity}` });
  } else if (definitionVersion !== undefined && quantities[request.quantity].version !== definitionVersion) {
    const implemented = quantities[request.quantity].version;
    const message = `the engine implements version ${implemented} of ${request.quantity}; the comparator asks for version ${definitionVersion}`;
    items.push({ code: "quantity", item: request.quantity, message });
  }

  for (const flag of opticalCase.features) {
    if (features.supported.includes(flag)) continue;
    items.push({ code: "feature", item: flag, message: `the engine does not support ${flag}` });
  }

  const needed = deriveFeatures(opticalCase.system, opticalCase.conditions).limits;
  for (const limit of FEATURE_LIMITS) {
    if (!Object.hasOwn(features.limits, limit) || needed[limit] <= features.limits[limit]) continue;
    const message = `the case needs ${limit} ${needed[limit]}; the engine handles at most ${features.limits[limit]}`;
    items.push({ code: "feature", item: limit, message });
  }
  return items;
}
