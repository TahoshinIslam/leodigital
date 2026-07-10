import type { ReactNode } from "react";

/** Hand-written types for the JS BorderGlow component. */
declare const BorderGlow: (props: {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  /** Rotate the border shine continuously, no hover required. */
  autoShine?: boolean;
  /** Degrees-per-second multiplier for the auto shine. */
  shineSpeed?: number;
  colors?: string[];
  fillOpacity?: number;
}) => React.JSX.Element;

export default BorderGlow;
