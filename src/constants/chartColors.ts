/**
 * CIAMIK Design System — Chart Color Palettes (§3.4)
 * Hardcoded constants for ECharts (canvas doesn't read CSS vars).
 */

/** Categorical — distinct series (brand colors first, then ramp derivatives) */
export const CHART_CATEGORICAL = [
  '#2F7A78', // teal-400
  '#FF7F50', // coral-400
  '#D4A017', // mustard-400
  '#3D4870', // navy-600
  '#5BA3A0', // teal-300
  '#C75A30', // coral-600
  '#E0B948', // mustard-300
  '#7B82A0', // navy-400
  '#A9D0CE', // teal-100
  '#FFA47A', // coral-200
] as const;

/** Sequential — single metric trend (teal ramp light→dark) */
export const CHART_SEQUENTIAL = [
  '#E9F2F1', // teal-50
  '#A9D0CE', // teal-100
  '#5BA3A0', // teal-300
  '#2F7A78', // teal-400
  '#1F5453', // teal-600
  '#123230', // teal-900
] as const;

/** Semantic — positive/negative (profit/loss) */
export const CHART_SEMANTIC = {
  positive: '#2F7A78', // teal-400
  negative: '#C0392B', // red-600
  neutral:  '#7B82A0', // navy-400
} as const;
