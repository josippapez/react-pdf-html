# react-pdf-html

`react-pdf-html` gives you drop-in replacements for the `@react-pdf/renderer` components that render as plain HTML in the browser. Write your PDF template once, show it on the page as HTML for a fast live preview, and hand the same template to react-pdf when you need the real PDF.

## Installation

```bash
pnpm add @rawwee/react-pdf-html @react-pdf/renderer
```

It works with `@react-pdf/renderer` 3 and 4. The test suite runs against react-pdf 4.9 with React 19, and against 3.4 with React 18.

## Usage

Import the components from this package instead of `@react-pdf/renderer`:

```tsx
import { Document, Page, Text, View } from "@rawwee/react-pdf-html";

export const MyDocument = () => (
  <Document>
    <Page>
      <View>
        <Text>Hello, World!</Text>
      </View>
    </Page>
  </Document>
);
```

Rendered anywhere in your app, `<MyDocument />` shows as HTML.

### Making the PDF

Wrap the document in `RenderAsPDF` wherever you hand it to react-pdf. Everything inside renders as react-pdf components, while the HTML preview elsewhere on the page keeps working:

```tsx
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { RenderAsPDF } from "@rawwee/react-pdf-html";

const pdfDocument = (
  <RenderAsPDF>
    <MyDocument />
  </RenderAsPDF>
);

// A download link
<PDFDownloadLink document={pdfDocument} fileName="document.pdf">
  Download
</PDFDownloadLink>;

// Or a Blob
const blob = await pdf(pdfDocument).toBlob();
```

To branch inside your own components, read the mode with `usePDFComponentsAreHTML()`. Its `isHTML` is `false` inside `RenderAsPDF`.

`usePDFComponentsAreHTML().setHtml(false)` still switches every component to PDF mode at once, for code written before `RenderAsPDF` existed.

## Components

Every react-pdf component: `Document`, `Page`, `View`, `Text`, `Link`, `Image`, `Note` and `Canvas`, and the SVG components `Svg`, `G`, `Path`, `Rect`, `Line`, `Polyline`, `Polygon`, `Circle`, `Ellipse`, `Tspan`, `Defs`, `ClipPath`, `LinearGradient`, `RadialGradient` and `Stop`.

These need react-pdf 4: `ImageBackground`, `Marker` and the form fields `FieldSet`, `TextInput`, `Checkbox`, `Select` and `List`.

In HTML:

- `Page` has its `size` and `orientation`, A4 by default.
- `render` props and Page `layout` get the page's number and the page count.
- `Canvas` runs your `paint` function on an HTML canvas.
- `Text` inside `Svg` renders as SVG text.
- Form fields become native inputs.
- `Note` renders nothing.

## Differences from the PDF

- HTML has no page breaks. A page grows past its height instead of moving content to the next page, so each `Page` counts as one page.
- `fixed` and other pagination props have no effect in HTML.
- `Canvas` gradients draw nothing in either output, because react-pdf's painter does not return them.
- In react-pdf 4, a unitless `lineHeight` on an element without its own `fontSize` is multiplied by 18, not by the inherited font size. Set `fontSize` next to it so the preview and the PDF match.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

## Used by

- [CV Maker [josippapez/CV-Maker]](https://github.com/josippapez/CV-Maker)

## Contributing

Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request on GitHub.

## License

react-pdf-html is licensed under the MIT License.
