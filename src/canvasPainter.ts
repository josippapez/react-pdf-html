type Color = string | number[];
type Point = [number, number];

const FILL_RULE = /(even-?odd)|(non-?zero)/;

// pdfkit takes CSS colors, RGB arrays (0-255) and CMYK arrays (0-100).
const toCanvasColor = (color: Color) => {
  if (!Array.isArray(color)) return color;
  if (color.length === 4) {
    const [c, m, y, k] = color.map((value) => value / 100);
    const [r, g, b] = [c, m, y].map((value) =>
      Math.round(255 * (1 - value) * (1 - k)),
    );
    return `rgb(${r} ${g} ${b})`;
  }
  return `rgb(${color.join(" ")})`;
};

const toCanvasRule = (rule?: string): CanvasFillRule =>
  rule && /even-?odd/.test(rule) ? "evenodd" : "nonzero";

/**
 * Lets a react-pdf Canvas `paint` callback draw on an HTML canvas. react-pdf
 * hands `paint` a pdfkit document limited to these methods, each returning
 * the painter (see @react-pdf/render), so this mirrors the same calls.
 */
export const createPainter = (ctx: CanvasRenderingContext2D) => {
  let path = new Path2D();
  let opacity = { fill: 1, stroke: 1 };
  const savedOpacity: (typeof opacity)[] = [];
  let font = { name: "Helvetica", size: 12 };

  const applyFont = () => {
    const bold = /bold/i.test(font.name) ? "bold " : "";
    const italic = /oblique|italic/i.test(font.name) ? "italic " : "";
    const family = font.name.replace(/-.*$/, "");
    ctx.font = `${italic}${bold}${font.size}px ${family}`;
  };

  const fillPath = (rule?: string) => {
    ctx.globalAlpha = opacity.fill;
    ctx.fill(path, toCanvasRule(rule));
  };

  const strokePath = () => {
    ctx.globalAlpha = opacity.stroke;
    ctx.stroke(path);
  };

  const painter = {
    save: () => {
      ctx.save();
      savedOpacity.push({ ...opacity });
      return painter;
    },
    restore: () => {
      ctx.restore();
      opacity = savedOpacity.pop() ?? opacity;
      return painter;
    },
    moveTo: (x: number, y: number) => {
      path.moveTo(x, y);
      return painter;
    },
    lineTo: (x: number, y: number) => {
      path.lineTo(x, y);
      return painter;
    },
    bezierCurveTo: (
      ...args: [number, number, number, number, number, number]
    ) => {
      path.bezierCurveTo(...args);
      return painter;
    },
    quadraticCurveTo: (...args: [number, number, number, number]) => {
      path.quadraticCurveTo(...args);
      return painter;
    },
    rect: (x: number, y: number, w: number, h: number) => {
      path.rect(x, y, w, h);
      return painter;
    },
    roundedRect: (
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number | number[] = 0,
    ) => {
      path.roundRect(x, y, w, h, radius);
      return painter;
    },
    ellipse: (x: number, y: number, r1: number, r2 = r1) => {
      path.moveTo(x + r1, y);
      path.ellipse(x, y, r1, r2, 0, 0, 2 * Math.PI);
      return painter;
    },
    circle: (x: number, y: number, radius: number) =>
      painter.ellipse(x, y, radius),
    polygon: (...points: Point[]) => {
      points.forEach(([x, y], index) =>
        index ? path.lineTo(x, y) : path.moveTo(x, y),
      );
      path.closePath();
      return painter;
    },
    path: (svgPath: string) => {
      path.addPath(new Path2D(svgPath));
      return painter;
    },
    fill: (color?: Color, rule?: string) => {
      if (typeof color === "string" && FILL_RULE.test(color)) {
        rule = color;
      } else if (color) {
        painter.fillColor(color);
      }
      fillPath(rule);
      path = new Path2D();
      return painter;
    },
    stroke: (color?: Color) => {
      if (color) painter.strokeColor(color);
      strokePath();
      path = new Path2D();
      return painter;
    },
    fillAndStroke: (
      fillColor?: Color,
      strokeColor = fillColor,
      rule?: string,
    ) => {
      if (typeof fillColor === "string" && FILL_RULE.test(fillColor)) {
        rule = fillColor;
      } else if (fillColor) {
        painter.fillColor(fillColor);
        if (strokeColor) painter.strokeColor(strokeColor);
      }
      fillPath(rule);
      strokePath();
      path = new Path2D();
      return painter;
    },
    clip: (rule?: string) => {
      ctx.clip(path, toCanvasRule(rule));
      path = new Path2D();
      return painter;
    },
    fillColor: (color: Color, value?: number) => {
      ctx.fillStyle = toCanvasColor(color);
      if (value != null) opacity.fill = value;
      return painter;
    },
    strokeColor: (color: Color, value?: number) => {
      ctx.strokeStyle = toCanvasColor(color);
      if (value != null) opacity.stroke = value;
      return painter;
    },
    opacity: (value: number) => {
      opacity = { fill: value, stroke: value };
      return painter;
    },
    fillOpacity: (value: number) => {
      opacity.fill = value;
      return painter;
    },
    strokeOpacity: (value: number) => {
      opacity.stroke = value;
      return painter;
    },
    lineWidth: (width: number) => {
      ctx.lineWidth = width;
      return painter;
    },
    lineCap: (cap: CanvasLineCap) => {
      ctx.lineCap = cap;
      return painter;
    },
    lineJoin: (join: CanvasLineJoin) => {
      ctx.lineJoin = join;
      return painter;
    },
    miterLimit: (limit: number) => {
      ctx.miterLimit = limit;
      return painter;
    },
    dash: (
      length: number | number[],
      { space, phase = 0 }: { space?: number; phase?: number } = {},
    ) => {
      ctx.setLineDash(
        Array.isArray(length) ? length : [length, space ?? length],
      );
      ctx.lineDashOffset = phase;
      return painter;
    },
    translate: (x: number, y: number) => {
      ctx.translate(x, y);
      return painter;
    },
    rotate: (angle: number, { origin }: { origin?: Point } = {}) => {
      const [x, y] = origin ?? [0, 0];
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.translate(-x, -y);
      return painter;
    },
    scale: (
      xFactor: number,
      yFactor?: number | { origin?: Point },
      options: { origin?: Point } = {},
    ) => {
      if (typeof yFactor === "object") options = yFactor;
      const y = typeof yFactor === "number" ? yFactor : xFactor;
      const [ox, oy] = options.origin ?? [0, 0];
      ctx.translate(ox, oy);
      ctx.scale(xFactor, y);
      ctx.translate(-ox, -oy);
      return painter;
    },
    font: (name: string, family?: string | number, size?: number) => {
      font = {
        name,
        size: typeof family === "number" ? family : (size ?? font.size),
      };
      return painter;
    },
    fontSize: (size: number) => {
      font = { ...font, size };
      return painter;
    },
    text: (text: string, x = 0, y = 0) => {
      applyFont();
      ctx.textBaseline = "top";
      ctx.globalAlpha = opacity.fill;
      ctx.fillText(text, x, y);
      return painter;
    },
    // react-pdf's painter returns itself instead of the pdfkit gradient, so
    // a paint callback cannot add stops to one. These draw nothing.
    linearGradient: () => painter,
    radialGradient: () => painter,
  };

  return painter;
};
