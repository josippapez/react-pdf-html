import {
  Canvas,
  Document,
  Image,
  Link,
  Note,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import React, { CSSProperties, FC, useContext, useRef, useState } from "react";
import { createPainter } from "../canvasPainter";
import { pageSize } from "../pageSize";
import { ImageBackground } from "../primitives";
import {
  PageContext,
  ParentContext,
  useClientLayoutEffect,
  useIsHtml,
} from "../renderMode";
import { svgProps, toCSS } from "../styles";
import type {
  PropsCanvas,
  PropsDocument,
  PropsImage,
  PropsImageBackground,
  PropsLink,
  PropsNote,
  PropsPage,
  PropsText,
  PropsView,
} from "../Types";

const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

// Link URLs often come from user input, so a javascript: or data: URL must not
// become a clickable href. The URL parser strips the whitespace and tab tricks
// browsers also strip, and relative links resolve to the placeholder base.
const safeHref = (url?: string) => {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url, "https://relative.invalid");
    return SAFE_PROTOCOLS.includes(protocol) ? url : undefined;
  } catch {
    return undefined;
  }
};

export const CustomView: FC<PropsView> = ({ children, style, ...rest }) => {
  const pageNumbers = useContext(PageContext);

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

    return (
      <div style={styles}>
        {rest.render ? rest.render(pageNumbers) : children}
      </div>
    );
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
  const pageNumbers = useContext(PageContext);

  if (useIsHtml()) {
    const { children, style, ...rest } = props;

    if (parent === "svg") {
      return <text {...svgProps({ style, ...rest })}>{children}</text>;
    }

    const content =
      "render" in rest && rest.render ? rest.render(pageNumbers) : children;

    if (parent === "text") {
      return <span style={toCSS(style)}>{content}</span>;
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
        <ParentContext.Provider value="text">{content}</ParentContext.Provider>
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
  const ref = useRef<HTMLDivElement>(null);
  const [numbers, setNumbers] = useState({ pageNumber: 1, totalPages: 1 });

  // A page's number is its position among the pages of its Document.
  useClientLayoutEffect(() => {
    const page = ref.current;
    if (!page) return;
    const root =
      page.closest("[data-react-pdf-html=document]") ?? page.parentElement;
    const pages = Array.from(
      root?.querySelectorAll("[data-react-pdf-html=page]") ?? [page],
    );
    const pageNumber = pages.indexOf(page) + 1;
    const totalPages = pages.length;
    setNumbers((previous) =>
      previous.pageNumber === pageNumber && previous.totalPages === totalPages
        ? previous
        : { pageNumber, totalPages },
    );
  });

  if (useIsHtml()) {
    const { width, height } = pageSize(rest);
    const pageNumbers = { ...numbers, subPageNumber: 1, subPageTotalPages: 1 };

    // HTML cannot break content onto a next page, so a page grows past its
    // height instead of cutting content off.
    return (
      <div
        ref={ref}
        data-react-pdf-html="page"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          isolation: "isolate",
          width,
          minHeight: height,
          flexShrink: 0,
          lineHeight: "initial",
          ...toCSS(style),
        }}
      >
        <PageContext.Provider value={pageNumbers}>
          {rest.layout ? rest.layout({ ...pageNumbers, children }) : children}
        </PageContext.Provider>
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
        href={safeHref(rest.href ?? rest.src)}
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

// A PDF annotation (sticky note), which has no HTML counterpart.
export const CustomNote: FC<PropsNote> = (props) => {
  if (useIsHtml()) {
    return null;
  }
  return <Note {...props} />;
};

export const CustomDocument: FC<PropsDocument> = ({ children, ...rest }) => {
  if (useIsHtml()) {
    return (
      <div
        data-react-pdf-html="document"
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

export const CustomCanvas: FC<PropsCanvas> = ({ style, paint, ...rest }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useClientLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    // Like react-pdf, paint gets the size inside the padding. The canvas
    // draws at the screen's pixel ratio so lines stay sharp.
    const padding = getComputedStyle(canvas);
    const width =
      canvas.clientWidth -
      (parseFloat(padding.paddingLeft) || 0) -
      (parseFloat(padding.paddingRight) || 0);
    const height =
      canvas.clientHeight -
      (parseFloat(padding.paddingTop) || 0) -
      (parseFloat(padding.paddingBottom) || 0);
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint(createPainter(context), width, height);
  });

  if (useIsHtml()) {
    return <canvas ref={ref} style={toCSS(style)} />;
  }
  return <Canvas style={style} paint={paint} {...rest} />;
};

// CSS background sizes for react-pdf's objectFit values.
const BACKGROUND_SIZE: Record<string, string> = {
  contain: "contain",
  cover: "cover",
  none: "auto",
  // CSS has no scale-down for backgrounds. This matches it for images
  // larger than the box.
  "scale-down": "contain",
};

export const CustomImageBackground: FC<PropsImageBackground> = ({
  children,
  style,
  ...rest
}) => {
  if (useIsHtml()) {
    const src = "src" in rest ? rest.src : rest.source;
    const css = toCSS(style);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          ...css,
          backgroundImage:
            typeof src === "string" ? `url(${JSON.stringify(src)})` : undefined,
          backgroundSize: BACKGROUND_SIZE[String(css.objectFit)] ?? "100% 100%",
          backgroundPosition: css.objectPosition ?? "center",
          backgroundRepeat: "no-repeat",
          backgroundOrigin: "content-box",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <ImageBackground style={style} {...rest}>
      {children}
    </ImageBackground>
  );
};
