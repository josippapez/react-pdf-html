import { pdf, renderToBuffer } from "@react-pdf/renderer";
import React, { ComponentProps, ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  Canvas,
  Checkbox,
  Circle,
  ClipPath,
  Defs,
  Document,
  Ellipse,
  FieldSet,
  G,
  ImageBackground,
  Link,
  List,
  Marker,
  Note,
  Page,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  RenderAsPDF,
  Select,
  Svg,
  Text,
  TextInput,
  Tspan,
  View,
  usePDFComponentsAreHTML,
} from "../src/index";
import { Showcase } from "./Showcase";

type PdfNode = {
  type: string;
  style?: unknown;
  props: Record<string, unknown>;
  value?: string;
  children?: PdfNode[];
};

// react-pdf renders synchronously, so the node tree is ready right away.
const renderPdfTree = (element: ReactElement): PdfNode =>
  pdf(<RenderAsPDF>{element}</RenderAsPDF>).container.document;

const findNode = (node: PdfNode, type: string): PdfNode | undefined =>
  node.type === type
    ? node
    : node.children?.map((child) => findNode(child, type)).find(Boolean);

const inDocument = (children: ReactElement) => (
  <Document>
    <Page>{children}</Page>
  </Document>
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("render mode", () => {
  test("renders HTML by default", () => {
    expect(renderToStaticMarkup(<View />)).toMatch(/^<div /);
  });

  test("RenderAsPDF renders react-pdf primitives without the global flag", () => {
    const tree = renderPdfTree(inDocument(<Text>hi</Text>));

    expect(tree.type).toBe("DOCUMENT");
    expect(findNode(tree, "TEXT")).toBeDefined();
  });

  test("usePDFComponentsAreHTML reports PDF mode inside RenderAsPDF", () => {
    const Mode = () => {
      const { isHTML } = usePDFComponentsAreHTML();
      return <Text>{isHTML ? "html" : "pdf"}</Text>;
    };
    const tree = renderPdfTree(inDocument(<Mode />));

    expect(findNode(tree, "TEXT_INSTANCE")?.value).toBe("pdf");
  });
});

describe("Text", () => {
  test("does not shift PDF text with a default verticalAlign", () => {
    const tree = renderPdfTree(
      inDocument(<Text style={{ fontSize: 10 }}>hi</Text>),
    );

    expect(findNode(tree, "TEXT")?.style).toEqual({ fontSize: 10 });
  });

  test("keeps PDF style arrays as written, including falsy entries", () => {
    const style = [undefined, { color: "red" }];
    const tree = renderPdfTree(inDocument(<Text style={style}>hi</Text>));

    expect(findNode(tree, "TEXT")?.style).toEqual(style);
  });

  test("renders nested Text inline, like react-pdf does", () => {
    const html = renderToStaticMarkup(
      <Text>
        Name: <Text style={{ fontWeight: "bold" }}>Ana</Text>
      </Text>,
    );

    expect(html).toMatch(/<span style="[^"]*font-weight:700[^"]*">Ana<\/span>/);
  });

  test("renders a Link inside Text inline", () => {
    const html = renderToStaticMarkup(
      <Text>
        See <Link src="https://example.com">site</Link>
      </Text>,
    );

    expect(html).toMatch(/<span[^>]*>site<\/span>/);
  });
});

describe("HTML styles", () => {
  test("skips falsy entries in style arrays", () => {
    const html = renderToStaticMarkup(
      <View style={[undefined, { color: "red" }, null as never]} />,
    );

    expect(html).toContain("color:red");
  });

  test("flattens nested style arrays", () => {
    const html = renderToStaticMarkup(
      <View style={[[{ color: "red" }], { fontSize: 10 }]} />,
    );

    expect(html).toContain("color:red");
    expect(html).toContain("font-size:10px");
  });

  test("expands margin and padding shorthands", () => {
    const html = renderToStaticMarkup(
      <View style={{ marginVertical: 4, paddingHorizontal: 2 }} />,
    );

    expect(html).toContain("margin-top:4px;margin-bottom:4px");
    expect(html).toContain("padding-left:2px;padding-right:2px");
  });

  test("does not mutate the style object it is given", () => {
    const style = { paddingVertical: 4, fontWeight: "semibold" as const };
    renderToStaticMarkup(<Text style={style}>hi</Text>);

    expect(style).toEqual({ paddingVertical: 4, fontWeight: "semibold" });
  });

  test("lays out View children in a column, like react-pdf does", () => {
    expect(renderToStaticMarkup(<View />)).toContain("flex-direction:column");
  });

  test("includes padding and borders in widths, like react-pdf does", () => {
    const html = renderToStaticMarkup(
      <View style={{ width: 170, paddingHorizontal: 16 }} />,
    );

    expect(html).toContain("box-sizing:border-box");
  });

  test("draws borders that only set a width, like react-pdf does", () => {
    const side = renderToStaticMarkup(
      <View style={{ borderLeftWidth: 2, borderLeftColor: "red" }} />,
    );
    const all = renderToStaticMarkup(<View style={{ borderWidth: 1 }} />);
    const dashed = renderToStaticMarkup(
      <View style={{ borderWidth: 1, borderStyle: "dashed" }} />,
    );

    expect(side).toContain("border-left-style:solid");
    expect(side).not.toContain("border-top-style");
    expect(all).toContain("border-top-style:solid");
    expect(dashed).not.toContain("solid");
  });

  test("keeps G styles", () => {
    const html = renderToStaticMarkup(
      <svg>
        <G style={{ opacity: 0.5 }} />
      </svg>,
    );

    expect(html).toContain("opacity:0.5");
  });
});

describe("Link", () => {
  test("uses the href prop in HTML", () => {
    const html = renderToStaticMarkup(
      <Link href="https://example.com">a</Link>,
    );

    expect(html).toContain('href="https://example.com"');
  });

  test.each([
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
  ])("drops the unsafe link %j in HTML", (src) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(<Link src={src}>a</Link>);

    expect(html).not.toContain("href=");
  });

  test.each([
    "https://example.com",
    "mailto:ana@example.com",
    "tel:+385123",
    "/cv/ana",
    "#contact",
  ])("keeps the safe link %j in HTML", (src) => {
    const html = renderToStaticMarkup(<Link src={src}>a</Link>);

    expect(html).toContain(`href="${src}"`);
  });

  test("does not pass react-pdf props to the anchor", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderToStaticMarkup(
      <Link src="https://example.com" wrap={false} debug>
        a
      </Link>,
    );

    expect(error).not.toHaveBeenCalled();
  });
});

describe("Svg", () => {
  test("does not pass react-pdf props to the svg element", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderToStaticMarkup(<Svg debug fixed />);

    expect(error).not.toHaveBeenCalled();
  });
});

describe("Polygon", () => {
  test("keeps its style in the PDF", () => {
    const tree = renderPdfTree(
      inDocument(
        <Svg>
          <Polygon points="0,0 1,1 1,0" style={{ fill: "red" }} />
        </Svg>,
      ),
    );

    expect(findNode(tree, "POLYGON")?.style).toEqual({ fill: "red" });
  });
});

describe("SVG components", () => {
  test.each([
    ["polyline", "POLYLINE", <Polyline points="0,0 1,1" />],
    ["circle", "CIRCLE", <Circle r={1} />],
    ["ellipse", "ELLIPSE", <Ellipse rx={1} ry={2} />],
    ["clipPath", "CLIP_PATH", <ClipPath />],
    ["radialGradient", "RADIAL_GRADIENT", <RadialGradient id="g" />],
  ])("renders <%s> in HTML and %s in the PDF", (tag, type, element) => {
    expect(renderToStaticMarkup(<Svg>{element}</Svg>)).toContain(`<${tag}`);
    expect(
      findNode(renderPdfTree(inDocument(<Svg>{element}</Svg>)), type),
    ).toBeDefined();
  });

  test("renders Text inside Svg as SVG text", () => {
    const html = renderToStaticMarkup(
      <Svg>
        <Text x={1} y={2}>
          <Tspan>hi</Tspan>
        </Text>
      </Svg>,
    );

    expect(html).toContain('<text x="1" y="2"');
    expect(html).toContain("<tspan");
  });
});

describe("Note", () => {
  test("renders nothing in HTML and a note in the PDF", () => {
    expect(renderToStaticMarkup(<Note>memo</Note>)).toBe("");
    expect(
      findNode(renderPdfTree(inDocument(<Note>memo</Note>)), "NOTE"),
    ).toBeDefined();
  });
});

describe("a document using every component", () => {
  const primitives = [
    "DOCUMENT",
    "PAGE",
    "VIEW",
    "TEXT",
    "LINK",
    "IMAGE",
    "NOTE",
    "SVG",
    "G",
    "PATH",
    "RECT",
    "LINE",
    "POLYLINE",
    "POLYGON",
    "CIRCLE",
    "ELLIPSE",
    "TSPAN",
    "DEFS",
    "LINEAR_GRADIENT",
    "RADIAL_GRADIENT",
    "STOP",
    "CLIP_PATH",
    "MARKER",
    "CANVAS",
    "IMAGE_BACKGROUND",
    "FIELD_SET",
    "TEXT_INPUT",
    "CHECKBOX",
    "SELECT",
    "LIST",
  ];
  const tags = [
    "div",
    "span",
    "a",
    "img",
    "svg",
    "g",
    "path",
    "rect",
    "line",
    "polyline",
    "polygon",
    "circle",
    "ellipse",
    "text",
    "tspan",
    "defs",
    "linearGradient",
    "radialGradient",
    "stop",
    "clipPath",
    "marker",
    "canvas",
    "fieldset",
    "input",
    "select",
    "option",
  ];

  test("renders as HTML without React warnings", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(<Showcase highlight />);

    expect(error).not.toHaveBeenCalled();
    for (const tag of tags) expect(html).toContain(`<${tag}`);
  });

  test("renders as a two-page PDF", async () => {
    const instance = pdf(
      <RenderAsPDF>
        <Showcase highlight />
      </RenderAsPDF>,
    );
    const types = new Set<string>();
    const collect = (node: PdfNode) => {
      types.add(node.type);
      node.children?.forEach(collect);
    };
    collect(instance.container.document);

    expect([...types]).toEqual(expect.arrayContaining(primitives));
    const buffer = await renderToBuffer(
      <RenderAsPDF>
        <Showcase highlight />
      </RenderAsPDF>,
    );
    const pdfText = buffer.toString("latin1");
    expect(pdfText.match(/\/Type \/Page\b/g)).toHaveLength(2);
  });
});

describe("Page size", () => {
  test.each<[string, ComponentProps<typeof Page>, string, string]>([
    ["the default A4", {}, "width:595.28px", "min-height:841.89px"],
    [
      "a named landscape size",
      { size: "LETTER", orientation: "landscape" },
      "width:792px",
      "min-height:612px",
    ],
    [
      "a size in points",
      { size: [300, 400] },
      "width:300px",
      "min-height:400px",
    ],
    [
      "a size in inches",
      { size: ["8.5in", "11in"] },
      "width:612px",
      "min-height:792px",
    ],
  ])("renders %s like react-pdf", (_, props, width, minHeight) => {
    const html = renderToStaticMarkup(<Page {...props} />);

    expect(html).toContain(width);
    expect(html).toContain(minHeight);
  });

  test("grows with its content when no height is given", () => {
    const html = renderToStaticMarkup(<Page size={{ width: 200 }} />);

    expect(html).toContain("width:200px");
    expect(html).not.toContain("min-height");
  });

  test("renders the layout prop around the page content", () => {
    const html = renderToStaticMarkup(
      <Page
        layout={({ children, pageNumber }) => (
          <View>
            <Text>{`Header ${pageNumber}`}</Text>
            {children}
          </View>
        )}
      >
        <Text>Body</Text>
      </Page>,
    );

    expect(html).toContain("Header 1");
    expect(html).toContain("Body");
  });
});

describe("react-pdf 4 components", () => {
  test("ImageBackground draws its image behind the children", () => {
    const html = renderToStaticMarkup(
      <ImageBackground
        src="https://example.com/a.png"
        style={{ width: 100, height: 50, objectFit: "cover" }}
      >
        <Text>Over</Text>
      </ImageBackground>,
    );

    expect(html).toContain("background-image:url(");
    expect(html).toContain("background-size:cover");
    expect(html).toContain("Over");
  });

  test("Marker renders an SVG marker", () => {
    const html = renderToStaticMarkup(
      <Svg>
        <Defs>
          <Marker id="arrow" markerWidth={4} markerHeight={4}>
            <Path d="M0 0 L4 2 L0 4 Z" />
          </Marker>
        </Defs>
      </Svg>,
    );

    expect(html).toContain('<marker id="arrow"');
  });

  test("form fields render as native form controls", () => {
    const html = renderToStaticMarkup(
      <FieldSet name="profile">
        <TextInput name="first" defaultValue="Ana" />
        <TextInput name="bio" multiline value="Hi" />
        <Checkbox name="ok" checked />
        <Select
          name="lang"
          select={["en", "hr"]}
          value="hr"
          edit={false}
          noSpell={false}
        />
        <List
          name="skills"
          select={["a", "b", "c"]}
          edit={false}
          noSpell={false}
        />
      </FieldSet>,
    );

    expect(html).toMatch(/<fieldset[^>]*name="profile"/);
    expect(html).toMatch(/<input[^>]*name="first"[^>]*value="Ana"/);
    expect(html).toMatch(/<textarea[^>]*name="bio"[^>]*>Hi<\/textarea>/);
    expect(html).toMatch(/<input[^>]*type="checkbox"[^>]*checked/);
    expect(html).toMatch(/<option[^>]*value="hr"[^>]*selected/);
    expect(html).toMatch(/<select[^>]*name="skills"[^>]*size="3"/);
  });

  test("render react-pdf's own components in the PDF", () => {
    const tree = renderPdfTree(
      inDocument(
        <View>
          <ImageBackground src="https://example.com/a.png" />
          <Canvas paint={() => null} />
          <Svg>
            <Defs>
              <Marker id="m" />
            </Defs>
          </Svg>
          <FieldSet name="f">
            <TextInput name="t" />
            <Checkbox name="c" />
            <Select name="s" select={["a"]} edit={false} noSpell={false} />
            <List name="l" select={["a"]} edit={false} noSpell={false} />
          </FieldSet>
        </View>,
      ),
    );
    const types = new Set<string>();
    const collect = (node: PdfNode) => {
      types.add(node.type);
      node.children?.forEach(collect);
    };
    collect(tree);

    expect([...types]).toEqual(
      expect.arrayContaining([
        "IMAGE_BACKGROUND",
        "CANVAS",
        "MARKER",
        "FIELD_SET",
        "TEXT_INPUT",
        "CHECKBOX",
        "SELECT",
        "LIST",
      ]),
    );
  });
});
