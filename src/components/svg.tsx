import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Tspan,
} from "@react-pdf/renderer";
import React, { FC, SVGProps } from "react";
import { Marker } from "../primitives";
import { ParentContext, useIsHtml } from "../renderMode";
import { svgProps, toCSS } from "../styles";
import type {
  PropsCircle,
  PropsClipPath,
  PropsDefs,
  PropsEllipse,
  PropsG,
  PropsLine,
  PropsLinearGradient,
  PropsMarker,
  PropsPath,
  PropsPolygon,
  PropsPolyline,
  PropsRadialGradient,
  PropsRect,
  PropsSVG,
  PropsStop,
  PropsTspan,
} from "../Types";

export const CustomG: FC<PropsG> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <g {...svgProps(rest)}>{children}</g>;
  }
  return <G {...rest}>{children}</G>;
};

export const CustomPath: FC<PropsPath> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <path {...svgProps(rest)}>{children}</path>;
  }
  return <Path {...rest}>{children}</Path>;
};

export const CustomRect: FC<PropsRect> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <rect {...svgProps(rest)}>{children}</rect>;
  }
  return <Rect {...rest}>{children}</Rect>;
};

export const CustomSVG: FC<PropsSVG> = ({
  children,
  style,
  debug,
  fixed,
  break: breakPage,
  minPresenceAhead,
  ...rest
}) => {
  if (useIsHtml()) {
    return (
      <svg
        // react-pdf's strokeLinejoin type also allows the linecap values
        // "butt" and "square", which React's SVG types reject.
        {...(rest as SVGProps<SVGSVGElement>)}
        style={{
          left: 0,
          right: 0,
          ...toCSS(style),
        }}
      >
        <ParentContext.Provider value="svg">{children}</ParentContext.Provider>
      </svg>
    );
  }
  return (
    <Svg
      style={style}
      debug={debug}
      fixed={fixed}
      break={breakPage}
      minPresenceAhead={minPresenceAhead}
      {...rest}
    >
      {children}
    </Svg>
  );
};

export const CustomPolygon: FC<PropsPolygon> = (props) => {
  if (useIsHtml()) {
    return <polygon {...svgProps(props)} />;
  }
  return <Polygon {...props} />;
};

export const CustomDefs: FC<PropsDefs> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <defs {...rest}>{children}</defs>;
  }
  return <Defs {...rest}>{children}</Defs>;
};

export const CustomLine: FC<PropsLine> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <line {...svgProps(rest)}>{children}</line>;
  }
  return <Line {...rest}>{children}</Line>;
};

export const CustomPolyline: FC<PropsPolyline> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <polyline {...svgProps(rest)}>{children}</polyline>;
  }
  return <Polyline {...rest}>{children}</Polyline>;
};

export const CustomCircle: FC<PropsCircle> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <circle {...svgProps(rest)}>{children}</circle>;
  }
  return <Circle {...rest}>{children}</Circle>;
};

export const CustomEllipse: FC<PropsEllipse> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <ellipse {...svgProps(rest)}>{children}</ellipse>;
  }
  return <Ellipse {...rest}>{children}</Ellipse>;
};

export const CustomTspan: FC<PropsTspan> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <tspan {...svgProps(rest)}>{children}</tspan>;
  }
  return <Tspan {...rest}>{children}</Tspan>;
};

export const CustomClipPath: FC<PropsClipPath> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <clipPath {...rest}>{children}</clipPath>;
  }
  return <ClipPath {...rest}>{children}</ClipPath>;
};

export const CustomRadialGradient: FC<PropsRadialGradient> = ({
  children,
  ...rest
}) => {
  if (useIsHtml()) {
    return <radialGradient {...rest}>{children}</radialGradient>;
  }
  return <RadialGradient {...rest}>{children}</RadialGradient>;
};

export const CustomStop: FC<PropsStop> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <stop {...rest}>{children}</stop>;
  }
  return <Stop {...rest}>{children}</Stop>;
};

export const CustomLinearGradient: FC<PropsLinearGradient> = ({
  children,
  ...rest
}) => {
  if (useIsHtml()) {
    return <linearGradient {...rest}>{children}</linearGradient>;
  }
  return <LinearGradient {...rest}>{children}</LinearGradient>;
};

export const CustomMarker: FC<PropsMarker> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return <marker {...rest}>{children}</marker>;
  }
  return <Marker {...rest}>{children}</Marker>;
};
