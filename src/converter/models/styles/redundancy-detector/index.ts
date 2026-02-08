export { RedundancyDetector } from "./redundancy-detector";
export type {
  RedundancyType,
  RedundancySeverity,
  RedundancyIssue,
} from "./types";
export {
  CSS_DEFAULT_VALUES,
  getDefaultValue,
  isDefaultValue,
  getDefaultDisplay,
} from "./default-values";
export {
  SHORTHAND_RULES,
  SHORTHAND_TO_LONGHANDS,
  canMergeToShorthand,
  buildShorthandValue,
  detectShorthandLonghandConflicts,
} from "./shorthand-rules";
export type { ShorthandRule } from "./shorthand-rules";
