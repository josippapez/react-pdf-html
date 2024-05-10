# react-pdf-html

`react-pdf-html` is a package that provides components that can render `@react-pdf/renderer` components as HTML components.

This provides an alternative for rendering PDF on the fly to check the final PDF and it enables having one source of truth for your PDF templates/components.

## Installation

You can install `react-pdf-html` using npm/yarn/bun:

```bash
npm install @rawwee/react-pdf-html
```

## Usage

To use `react-pdf-html`, you need to import the components you want to use from the package and render them in your React application as you would when using `@react-pdf/renderer`. Here's an example:

#### Example when displaying it in application

```tsx
import React from "react";
// this replaces @react-pdf/renderer components
import { Document, Image, Page, View } from "@rawwee/react-pdf-html";

const MyDocument = () => (
  <Document>
    <Page>
      <Text>Hello, World!</Text>
    </Page>
  </Document>
);

// You can then render the component as an HTML component
const App = () => <MyDocument />;

export default App;
```

In this example, we're rendering a simple PDF document with a single page that contains the text "Hello, World!". We're using the PDFViewer component from react-pdf-html to render the PDF as an HTML component.

As you can see, you don't need the `@react-pdf/renderer`'s `PDFViewer` component to render the PDF (or `Document` component from `wojtekmaj/react-pdf`).

#### Example when rendering the PDF

The package provides a useful hook called `usePDFComponentsAreHTML()` which enables (or disables) the rendering of the components as HTML components. This is useful when you want to render the PDF conditionally (e.g. when you want to download the PDF).

```tsx
export const PDFDownload = ({ PdfInstance, show, closeModal }: Props) => {
  const { isHTML, setHtml } = usePDFComponentsAreHTML();
  const [download, setDownload] = useState(false);

  useEffect(() => {
    if (show) {
      // triggers the rendering of the PDF template component
      // which is defined as:
      // const TemplateNotHtml = useCallback(() => CVTemplate(pdfData), [isHTML, pdfData]);
      setHtml(false);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      position="center"
      closeModal={() => {
        setHtml(true);
        setDownload(false);
      }}
    >
      <div>
        <h1 className="text-2xl font-bold">Download CV</h1>
        <div>
          {PdfInstance &&
            (download ? (
              <PDFDownloadLink
                className="w-full bg-blue-500 p-2 text-center font-bold text-white shadow-[0_0_20px_-5px] hover:shadow-blue-800 focus:shadow-blue-800"
                document={!isHTML ? <PdfInstance /> : <></>}
                fileName={`${cvName}.pdf`}
              >
                {({ blob, url, loading, error }) => {
                  if (loading) return "Loading document...";
                  return "Download now!";
                }}
              </PDFDownloadLink>
            ) : (
              <button
                className="w-full bg-blue-500 p-2 text-center font-bold text-white shadow-[0_0_20px_-5px] hover:shadow-blue-800 focus:shadow-blue-800"
                onClick={() => setDownload(true)}
              >
                Download
              </button>
            ))}
        </div>
      </div>
    </Modal>
  );
};
```
As you can see, we're using the `usePDFComponentsAreHTML()` hook to set the `isHTML` value to `false` when the modal is shown. This triggers the rendering of the PDF template component. When the modal is closed, we set the `isHTML` value to `true` which triggers the rendering of the PDF as an HTML component.

## Used by
You can check the usage for this package in the following projects:
- [CV Maker [josippapez/CV-Maker]](https://github.com/josippapez/CV-Maker)

## Contributing

Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request on GitHub.

## License

react-pdf-html is licensed under the MIT License.
