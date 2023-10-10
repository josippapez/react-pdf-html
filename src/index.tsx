'use client';

import {
  Defs,
  Document,
  G,
  Image,
  Line,
  LinearGradient,
  Link,
  Page,
  Path,
  Rect,
  Stop,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import React, { CSSProperties, FC, useState } from "react";
import {
  PropsDefs,
  PropsDocument,
  PropsG,
  PropsImage,
  PropsLine,
  PropsLinearGradient,
  PropsLink,
  PropsPage,
  PropsPath,
  PropsRect,
  PropsSVG,
  PropsStop,
  PropsText,
  PropsView,
  Style,
  fontWeight,
} from "./Types";

let isHtml = true;

export const usePDFComponentsAreHTML = () => {
  const [html, setHtml] = useState(isHtml);

  isHtml = html;

  return {
    isHTML: html,
    setHtml,
  };
};

const fontWeightConverter = (fontWeight?: fontWeight) => {
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

const adjustStyles = (style: Style) => {
  if (!style) return;

  Object.keys(style).forEach(key => {
    if (key === "paddingVertical") {
      style.paddingTop = style[key];
      style.paddingBottom = style[key];
    } else if (key === "paddingHorizontal") {
      style.paddingLeft = style[key];
      style.paddingRight = style[key];
    } else if (key === "fontWeight") {
      style.fontWeight = fontWeightConverter(style[key]);
    }
    return style;
  });
};
const mergeStylesIntoOne = (styles: Style[]) => {
  const mergedStyle: Style = {};

  if (!styles[0]) return mergedStyle;

  styles.forEach(style => {
    Object.keys(style).forEach(key => {
      mergedStyle[key as keyof Style] = style[key as keyof Style];
    });
  });
  return mergedStyle;
};

export const CustomView: FC<PropsView> = ({ children, style, ...rest }) => {
  const isDebug = rest.debug;
  if (isHtml) {
    let newStyle = style;
    if (Array.isArray(style)) {
      newStyle = mergeStylesIntoOne(style) as {
        [key: string]: string;
      };
    }

    adjustStyles(newStyle as { [key: string]: string });

    let styles: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      isolation: "isolate",
      left: 0,
      right: 0,
      ...(newStyle as { [key: string]: string }),
    };

    if (isDebug) {
      styles.border = "1px solid red";
    }

    return <div style={styles}>{children}</div>;
  }

  if (Array.isArray(style)) {
    style = [
      {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        left: 0,
        right: 0,
      },
      ...style,
    ];
  } else {
    style = {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      left: 0,
      right: 0,
      ...style,
    };
  }
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};

export const CustomText: FC<PropsText> = ({ children, style, ...rest }) => {
  let newStyle = style;
  if (Array.isArray(style)) {
    newStyle = mergeStylesIntoOne(style) as {
      [key: string]: string;
    };
  }

  if (isHtml) {
    const isDebug = rest.debug;
    adjustStyles(newStyle as { [key: string]: string });

    let styles: CSSProperties = {
      whiteSpace: "break-spaces",
      position: "relative",
      border: isDebug ? "1px solid red" : "none",
      ...(newStyle as { [key: string]: string }),
    };

    if (isDebug) {
      styles.border = "1px solid red";
    }

    return <div style={styles}>{children}</div>;
  }

  return (
    <Text
      style={{
        verticalAlign: "sub",
        ...newStyle,
      }}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const CustomImage: FC<PropsImage> = ({ style, ...rest }) => {
  if (isHtml) {
    let newStyle = style;
    if (Array.isArray(style)) {
      newStyle = mergeStylesIntoOne(style) as {
        [key: string]: string;
      };
    }
    adjustStyles(newStyle as { [key: string]: string });
    return (
      <img
        style={newStyle as { [key: string]: string }}
        src={rest.src as string}
      />
    );
  }
  return <Image style={style} {...rest} />;
};

export const CustomPage: FC<PropsPage> = ({ style, children, ...rest }) => {
  if (isHtml) {
    let newStyle = style;
    if (Array.isArray(style)) {
      newStyle = mergeStylesIntoOne(style) as {
        [key: string]: string;
      };
    }
    adjustStyles(newStyle as { [key: string]: string });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          isolation: "isolate",
          height: "100%",
          lineHeight: "initial",
          ...(newStyle as { [key: string]: string }),
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
  if (isHtml) {
    let newStyle = style;
    if (Array.isArray(style)) {
      newStyle = mergeStylesIntoOne(style) as {
        [key: string]: string;
      };
    }
    adjustStyles(newStyle as { [key: string]: string });
    return (
      <a {...rest} href={rest.src} target="_blank" rel="noopener noreferrer">
        <div style={newStyle as { [key: string]: string }}>{children}</div>
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
  if (isHtml) {
    return <g {...rest}>{children}</g>;
  }
  return <G {...rest}>{children}</G>;
};

export const CustomPath: FC<PropsPath> = ({ children, ...rest }) => {
  if (isHtml) {
    return <path {...rest}>{children}</path>;
  }
  return <Path {...rest}>{children}</Path>;
};

export const CustomRect: FC<PropsRect> = ({ children, ...rest }) => {
  if (isHtml) {
    return <rect {...rest}>{children}</rect>;
  }
  return <Rect {...rest}>{children}</Rect>;
};

export const CustomSVG: FC<PropsSVG> = ({ children, ...rest }) => {
  if (isHtml) {
    const style = {
      left: 0,
      right: 0,
      ...rest.style,
    };
    return (
      <svg
        {...rest}
        style={{
          ...(style as { [key: string]: string | number }),
        }}
      >
        {children}
      </svg>
    );
  }
  return <Svg {...rest}>{children}</Svg>;
};

export const CustomDefs: FC<PropsDefs> = ({ children, ...rest }) => {
  if (isHtml) {
    return <defs {...rest}>{children}</defs>;
  }
  return <Defs {...rest}>{children}</Defs>;
};

export const CustomLine: FC<PropsLine> = ({ children, ...rest }) => {
  if (isHtml) {
    return <line {...rest}>{children}</line>;
  }
  return <Line {...rest}>{children}</Line>;
};

export const CustomStop: FC<PropsStop> = ({ children, ...rest }) => {
  if (isHtml) {
    return <stop {...rest}>{children}</stop>;
  }
  return <Stop {...rest}>{children}</Stop>;
};

export const CustomLinearGradient: FC<PropsLinearGradient> = ({
  children,
  ...rest
}) => {
  if (isHtml) {
    return <linearGradient {...rest}>{children}</linearGradient>;
  }
  return <LinearGradient {...rest}>{children}</LinearGradient>;
};

export const CustomDocument: FC<PropsDocument> = ({ children, ...rest }) => {
  if (isHtml) {
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
  CustomDefs as Defs,
  CustomDocument as Document,
  CustomG as G,
  CustomImage as Image,
  CustomLine as Line,
  CustomLinearGradient as LinearGradient,
  CustomLink as Link,
  CustomPage as Page,
  CustomPath as Path,
  CustomRect as Rect,
  CustomStop as Stop,
  CustomSVG as Svg,
  CustomText as Text,
  CustomView as View,
};
