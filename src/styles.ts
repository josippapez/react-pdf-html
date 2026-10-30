import type { CSSProperties } from "react";

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
export const toCSS = (style: unknown): CSSProperties => {
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

export const svgProps = <P extends object>({
  style,
  ...rest
}: P & { style?: unknown }): Omit<P, "style"> & {
  strokeLinejoin: "round";
  style: CSSProperties;
} => ({
  ...rest,
  strokeLinejoin: "round" as const,
  style: {
    ...toCSS(style),
    strokeLinejoin: "round" as const,
  },
});
