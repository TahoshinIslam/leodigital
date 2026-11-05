/** Hand-written types for the JS Orb component. */
declare const Orb: (props: {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
}) => React.JSX.Element;

export default Orb;
