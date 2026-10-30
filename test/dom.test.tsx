// @vitest-environment jsdom
import React, { act, ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { Canvas, Document, Page, Text, View } from "../src/index";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const render = (element: ReactElement) => {
  const container = document.createElement("div");
  document.body.append(container);
  act(() => createRoot(container).render(element));
  return container;
};

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

test("render props get each page's number and the page count", () => {
  const container = render(
    <Document>
      {["a", "b", "c"].map((id) => (
        <Page key={id}>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
          <View
            render={({ pageNumber }) => <Text>{`view ${pageNumber}`}</Text>}
          />
        </Page>
      ))}
    </Document>,
  );

  expect(container.textContent).toContain("1 / 3");
  expect(container.textContent).toContain("3 / 3");
  expect(container.textContent).toContain("view 2");
});

test("Canvas runs paint with react-pdf's painter API", () => {
  const calls: unknown[][] = [];
  const context = new Proxy(
    {},
    {
      get:
        (_, name) =>
        (...args: unknown[]) =>
          calls.push([name, ...args]),
      set: (_, name, value) => {
        calls.push(["set", name, value]);
        return true;
      },
    },
  );
  class FakePath2D {
    constructor() {
      calls.push(["Path2D"]);
    }
    moveTo = (...args: number[]) => calls.push(["moveTo", ...args]);
    lineTo = (...args: number[]) => calls.push(["lineTo", ...args]);
  }
  vi.stubGlobal("Path2D", FakePath2D);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(120);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(60);

  const paint = vi.fn((painter, width: number, height: number) => {
    painter.moveTo(0, 0).lineTo(width, height).lineWidth(2).stroke("red");
    return null;
  });
  render(<Canvas style={{ width: 120, height: 60 }} paint={paint} />);

  expect(paint).toHaveBeenCalledWith(expect.anything(), 120, 60);
  expect(calls).toContainEqual(["lineTo", 120, 60]);
  expect(calls).toContainEqual(["set", "lineWidth", 2]);
  expect(calls).toContainEqual(["set", "strokeStyle", "red"]);
  expect(calls.some(([name]) => name === "stroke")).toBe(true);
});
