import {
  PageProps,
  SVGPresentationAttributes,
  SourceObject,
  Style,
  TextProps,
  ViewProps,
  DocumentProps,
} from "@react-pdf/types";
import { PropsWithChildren } from "react";

export type { Style };

export interface PropsView extends PropsWithChildren<ViewProps> {
  style?: Style | Style[];
}

export interface PropsText extends PropsWithChildren<TextProps> {
  style?: Style | Style[];
}

export interface PropsImage extends ImageWithSrcProp {
  style?: Style | Style[];
}

export interface PropsPage extends PropsWithChildren<PageProps> {
  style?: Style | Style[];
}

export interface PropsLink extends PropsWithChildren<LinkProps> {
  style?: Style | Style[];
}

export interface PropsSVG extends PropsWithChildren<SVGProps> {
  style?: Style | Style[];
}

export type PropsRect = PropsWithChildren<RectProps>;

export type PropsPath = PropsWithChildren<PathProps>;

export type PropsG = PropsWithChildren<SVGPresentationAttributes>;

export type PropsLine = PropsWithChildren<LineProps>;

export type PropsStop = PropsWithChildren<StopProps>;

export type PropsLinearGradient = PropsWithChildren<LinearGradientProps>;

export type PropsDefs = PropsWithChildren;

export type PropsDocument = PropsWithChildren<DocumentProps>;

export type { Style as StylePDF };

export type fontWeight =
  | number
  | "thin"
  | "hairline"
  | "ultralight"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "demibold"
  | "bold"
  | "ultrabold"
  | "extrabold"
  | "heavy"
  | "black";

// react-pdf/ types
interface NodeProps {
  id?: string;
  style?: Style | Style[];
  /**
   * Render component in all wrapped pages.
   * @see https://react-pdf.org/advanced#fixed-components
   */
  fixed?: boolean;
  /**
   * Force the wrapping algorithm to start a new page when rendering the
   * element.
   * @see https://react-pdf.org/advanced#page-breaks
   */
  break?: boolean;
  /**
   * Hint that no page wrapping should occur between all sibling elements following the element within n points
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  minPresenceAhead?: number;
}

interface BaseImageProps extends NodeProps {
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean;
  cache?: boolean;
}

interface ImageWithSrcProp extends BaseImageProps {
  src: SourceObject;
}

interface ImageWithSourceProp extends BaseImageProps {
  source: SourceObject;
}

interface LinkProps extends NodeProps {
  /**
   * Enable/disable page wrapping for element.
   * @see https://react-pdf.org/components#page-wrapping
   */
  wrap?: boolean;
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean;
  src: string;
}

interface SVGProps extends NodeProps {
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  preserveAspectRatio?: string;
}

interface RectProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes;
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
  rx?: string | number;
  ry?: string | number;
}

interface PathProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes;
  d: string;
}

interface LineProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes;
  x1: string | number;
  x2: string | number;
  y1: string | number;
  y2: string | number;
}

interface StopProps {
  offset: string | number;
  stopColor: string;
  stopOpacity?: string | number;
}

interface LinearGradientProps {
  id: string;
  x1: string | number;
  x2: string | number;
  y1: string | number;
  y2: string | number;
}
