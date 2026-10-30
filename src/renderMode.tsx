import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

let isHtml = true;

// Holds false under RenderAsPDF. Undefined means the global flag decides.
const RenderModeContext = createContext<boolean | undefined>(undefined);
// The closest HTML parent that changes how Text and Link render.
export const ParentContext = createContext<"text" | "svg" | undefined>(undefined);

export const useIsHtml = () => useContext(RenderModeContext) ?? isHtml;

// What react-pdf passes to render props and Page layouts. HTML has no page
// breaks, so every Page is one page and has no sub-pages.
type PageNumbers = {
  pageNumber: number;
  totalPages: number;
  subPageNumber: number;
  subPageTotalPages: number;
};
export const PageContext = createContext<PageNumbers>({
  pageNumber: 1,
  totalPages: 1,
  subPageNumber: 1,
  subPageTotalPages: 1,
});

// Layout effects warn during server rendering, where they never run anyway.
export const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

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
