import type {
  Circle,
  ClipPath,
  Defs,
  Document,
  Ellipse,
  G,
  Image,
  Line,
  LinearGradient,
  Link,
  Note,
  Page,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
  View,
} from "@react-pdf/renderer";
import type { ComponentProps, PropsWithChildren } from "react";

// Props come from the consumer's installed @react-pdf/renderer, so they stay
// in sync with whichever major version (3 or 4) they use.
export type PropsView = ComponentProps<typeof View>;
// react-pdf types SVG text (Text inside Svg) without children.
export type PropsText = PropsWithChildren<ComponentProps<typeof Text>>;
export type PropsImage = ComponentProps<typeof Image>;
export type PropsPage = ComponentProps<typeof Page>;
export type PropsLink = ComponentProps<typeof Link>;
export type PropsSVG = ComponentProps<typeof Svg>;
export type PropsRect = ComponentProps<typeof Rect>;
export type PropsPath = ComponentProps<typeof Path>;
export type PropsG = ComponentProps<typeof G>;
export type PropsLine = ComponentProps<typeof Line>;
export type PropsStop = ComponentProps<typeof Stop>;
export type PropsLinearGradient = ComponentProps<typeof LinearGradient>;
export type PropsDefs = ComponentProps<typeof Defs>;
export type PropsDocument = ComponentProps<typeof Document>;
export type PropsPolygon = ComponentProps<typeof Polygon>;
export type PropsPolyline = ComponentProps<typeof Polyline>;
export type PropsCircle = ComponentProps<typeof Circle>;
export type PropsEllipse = ComponentProps<typeof Ellipse>;
export type PropsClipPath = ComponentProps<typeof ClipPath>;
export type PropsRadialGradient = ComponentProps<typeof RadialGradient>;
export type PropsTspan = ComponentProps<typeof Tspan>;
export type PropsNote = ComponentProps<typeof Note>;
