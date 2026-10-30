import {
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
import React, {
  CSSProperties,
  FC,
  PropsWithChildren,
  SVGProps,
  createContext,
  useContext,
  useState,
} from "react";
import {
  PropsCircle,
  PropsClipPath,
  PropsDefs,
  PropsDocument,
  PropsEllipse,
  PropsG,
  PropsImage,
  PropsLine,
  PropsLinearGradient,
  PropsLink,
  PropsNote,
  PropsPage,
  PropsPath,
  PropsPolygon,
  PropsPolyline,
  PropsRadialGradient,
  PropsRect,
  PropsSVG,
  PropsStop,
  PropsText,
  PropsTspan,
  PropsView,
} from "./Types";

let isHtml = true;

// Holds false under RenderAsPDF. Undefined means the global flag decides.
const RenderModeContext = createContext<boolean | undefined>(undefined);
// The closest HTML parent that changes how Text and Link render.
const ParentContext = createContext<"text" | "svg" | undefined>(undefined);

const useIsHtml = () => useContext(RenderModeContext) ?? isHtml;

/**
 * Renders its children as @react-pdf/renderer components. Wrap the document
 * you hand to react-pdf (`pdf()`, `PDFDownloadLink`, `PDFViewer`, ...) so the
 * same components can show as HTML elsewhere on the page at the same time.
 */
export const RenderAsPDF: FC<PropsWithChildren> = ({ children }) => (
  <RenderModeContext.Provider value={false}>
    {children}
  </RenderModeContext.Provider>
);

export const usePDFComponentsAreHTML = () => {
  const mode = useContext(RenderModeContext);
  const [html, setHtml] = useState(isHtml);

  isHtml = html;

  return {
    isHTML: mode ?? html,
    setHtml,
  };
};

const fontWeightConverter = (fontWeight: unknown) => {
  if (typeof fontWeight === "number") return fontWeight;
  switch (fontWeight) {
    case "thin":
    case "hairline":
      return 100;
    case "ultralight":
    case "extralight":
      return 200;
    case "light":
      return 300;
    case "normal":
      return 400;
    case "medium":
      return 500;
    case "semibold":
    case "demibold":
      return 600;
    case "bold":
      return 700;
    case "ultrabold":
    case "extrabold":
      return 800;
    case "heavy":
    case "black":
      return 900;
    default:
      return 400;
  }
};

/**
 * Turns a react-pdf style prop (an object or a nested array of them, with
 * falsy entries allowed) into a new CSS style object.
 */
const toCSS = (style: unknown): CSSProperties => {
  const merged = Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  const css: Record<string, unknown> = {};

  Object.entries(merged).forEach(([key, value]) => {
    if (key === "paddingVertical") {
      css.paddingTop = value;
      css.paddingBottom = value;
    } else if (key === "paddingHorizontal") {
      css.paddingLeft = value;
      css.paddingRight = value;
    } else if (key === "marginVertical") {
      css.marginTop = value;
      css.marginBottom = value;
    } else if (key === "marginHorizontal") {
      css.marginLeft = value;
      css.marginRight = value;
    } else if (key === "fontWeight") {
      css.fontWeight = fontWeightConverter(value);
    } else {
      css[key] = value;
    }
  });

  // react-pdf sizes boxes border-box and draws a border as soon as it has a
  // width, while CSS also needs a border style. These go first so the
  // style's own values win.
  const defaults: Record<string, unknown> = { boxSizing: "border-box" };
  if (css.borderStyle === undefined) {
    ["Top", "Right", "Bottom", "Left"].forEach((side) => {
      if ((css.borderWidth ?? css[`border${side}Width`]) !== undefined) {
        defaults[`border${side}Style`] = "solid";
      }
    });
  }

  // Once the shorthands and font weights are expanded, the remaining
  // react-pdf style keys are CSS property names.
  return { ...defaults, ...css } as CSSProperties;
};

const svgProps = <P extends object>({
  style,
  ...rest
}: P & { style?: unknown }) => ({
  ...rest,
  strokeLinejoin: "round" as const,
  style: {
    ...toCSS(style),
    strokeLinejoin: "round" as const,
  },
});

export const CustomView: FC<PropsView> = ({ children, style, ...rest }) => {
  if (useIsHtml()) {
    let styles: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      isolation: "isolate",
      left: 0,
      right: 0,

      ...toCSS(style),
    };

    if (rest.debug) {
      styles.border = "1px solid red";
    }

    return <div style={styles}>{children}</div>;
  }

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "column",
          position: "relative",
          left: 0,
          right: 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export const CustomText: FC<PropsText> = (props) => {
  const parent = useContext(ParentContext);

  if (useIsHtml()) {
    const { children, style, ...rest } = props;

    if (parent === "svg") {
      return <text {...svgProps({ style, ...rest })}>{children}</text>;
    }

    if (parent === "text") {
      return <span style={toCSS(style)}>{children}</span>;
    }

    let styles: CSSProperties = {
      whiteSpace: "break-spaces",
      position: "relative",
      border: "none",
      ...toCSS(style),
    };

    if ("debug" in rest && rest.debug) {
      styles.border = "1px solid red";
    }

    return (
      <div style={styles}>
        <ParentContext.Provider value="text">{children}</ParentContext.Provider>
      </div>
    );
  }

  return <Text {...props} />;
};

export const CustomImage: FC<PropsImage> = ({ style, ...rest }) => {
  if (useIsHtml()) {
    const src = "src" in rest ? rest.src : rest.source;
    return (
      <img
        style={toCSS(style)}
        src={typeof src === "string" ? src : undefined}
      />
    );
  }
  return <Image style={style} {...rest} />;
};

export const CustomPage: FC<PropsPage> = ({ style, children, ...rest }) => {
  if (useIsHtml()) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          isolation: "isolate",
          height: "100%",
          lineHeight: "initial",
          flex: 1,
          ...toCSS(style),
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <Page style={style} {...rest}>
      {children}
    </Page>
  );
};

export const CustomLink: FC<PropsLink> = ({ children, style, ...rest }) => {
  const parent = useContext(ParentContext);

  if (useIsHtml()) {
    const Wrapper = parent === "text" ? "span" : "div";
    return (
      <a
        id={rest.id}
        href={rest.href ?? rest.src}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Wrapper style={toCSS(style)}>{children}</Wrapper>
      </a>
    );
  }
  return (
    <Link {...rest} style={style}>
      {children}
    </Link>
  );
};

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

// A PDF annotation (sticky note), which has no HTML counterpart.
export const CustomNote: FC<PropsNote> = (props) => {
  if (useIsHtml()) {
    return null;
  }
  return <Note {...props} />;
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

export const CustomDocument: FC<PropsDocument> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          isolation: "isolate",
          left: 0,
          right: 0,
          minHeight: "100%",
        }}
      >
        {children}
      </div>
    );
  }
  return <Document {...rest}>{children}</Document>;
};

export {
  CustomCircle as Circle,
  CustomClipPath as ClipPath,
  CustomDefs as Defs,
  CustomDocument as Document,
  CustomEllipse as Ellipse,
  CustomG as G,
  CustomImage as Image,
  CustomLine as Line,
  CustomLinearGradient as LinearGradient,
  CustomLink as Link,
  CustomNote as Note,
  CustomPage as Page,
  CustomPath as Path,
  CustomPolygon as Polygon,
  CustomPolyline as Polyline,
  CustomRadialGradient as RadialGradient,
  CustomRect as Rect,
  CustomStop as Stop,
  CustomSVG as Svg,
  CustomText as Text,
  CustomTspan as Tspan,
  CustomView as View,
};
