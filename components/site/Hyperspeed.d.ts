/** Hand-written types for the JS Hyperspeed component. Every field is optional:
 *  the component deep-merges whatever is passed over its own defaults. */
export type HyperspeedOptions = {
  onSpeedUp?: (ev: Event) => void;
  onSlowDown?: (ev: Event) => void;
  distortion?: string;
  length?: number;
  roadWidth?: number;
  islandWidth?: number;
  lanesPerRoad?: number;
  fov?: number;
  fovSpeedUp?: number;
  speedUp?: number;
  carLightsFade?: number;
  totalSideLightSticks?: number;
  lightPairsPerRoadWay?: number;
  shoulderLinesWidthPercentage?: number;
  brokenLinesWidthPercentage?: number;
  brokenLinesLengthPercentage?: number;
  lightStickWidth?: [number, number];
  lightStickHeight?: [number, number];
  movingAwaySpeed?: [number, number];
  movingCloserSpeed?: [number, number];
  carLightsLength?: [number, number];
  carLightsRadius?: [number, number];
  carWidthPercentage?: [number, number];
  carShiftX?: [number, number];
  carFloorSeparation?: [number, number];
  colors?: {
    roadColor?: number;
    islandColor?: number;
    background?: number;
    shoulderLines?: number;
    brokenLines?: number;
    leftCars?: number[];
    rightCars?: number[];
    sticks?: number;
  };
};

declare const Hyperspeed: (props: {
  effectOptions?: HyperspeedOptions;
  /** Fired when the WebGL context is lost, so the host can remount for a rebuild. */
  onContextLost?: () => void;
}) => React.JSX.Element;
export default Hyperspeed;
