/** Hand-written types for the JS Antigravity component. */
declare const Antigravity: (props: {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
  fieldStrength?: number;
  followWindowPointer?: boolean;
  dpr?: number | [number, number];
}) => React.JSX.Element;

export default Antigravity;
