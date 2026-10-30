import type {
  Canvas,
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
import type { ComponentProps, ComponentType, PropsWithChildren } from "react";

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
export type PropsCanvas = ComponentProps<typeof Canvas>;

// Components that only react-pdf 4 has. A named import would not type-check
// against react-pdf 3, so their props are looked up by name and are never
// there.
type ReactPDF = typeof import("@react-pdf/renderer");
type PropsOf<Name extends string> = Name extends keyof ReactPDF
  ? ReactPDF[Name] extends ComponentType<infer Props>
    ? Props
    : never
  : never;

export type PropsImageBackground = PropsOf<"ImageBackground">;
export type PropsMarker = PropsOf<"Marker">;
export type PropsFieldSet = PropsOf<"FieldSet">;
export type PropsTextInput = PropsOf<"TextInput">;
export type PropsCheckbox = PropsOf<"Checkbox">;
export type PropsSelect = PropsOf<"Select">;
export type PropsList = PropsOf<"List">;
