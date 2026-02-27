import { test, expect } from "vitest";
import { convertHTMLToFigma } from "./index";

test("convertHTMLToFigma - シンプルなdiv要素 - 変換できる", async () => {
  const html = "<div>Hello World</div>";
  const result = await convertHTMLToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("div");
});

test("convertHTMLToFigma - 空のHTML - エラーにならない", async () => {
  const html = "";
  const result = await convertHTMLToFigma(html);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("Root");
});

test("convertHTMLToFigma - オプション指定 - 寸法が反映される", async () => {
  const html = "<div>Test</div>";
  const options = {
    containerWidth: 1024,
    containerHeight: 768,
  };
  const result = await convertHTMLToFigma(html, options);

  expect(result.width).toBe(1024);
  expect(result.height).toBe(768);
});

test("convertHTMLToFigma - width: 0 の要素 - containerWidth で上書きされない", async () => {
  const html = '<div style="width: 0px">Test</div>';
  const options = {
    containerWidth: 1024,
    containerHeight: 768,
  };
  const result = await convertHTMLToFigma(html, options);

  expect(result.width).toBe(0);
});

test("convertHTMLToFigma - height: 0 の要素 - containerHeight で上書きされない", async () => {
  const html = '<div style="height: 0px">Test</div>';
  const options = {
    containerWidth: 1024,
    containerHeight: 768,
  };
  const result = await convertHTMLToFigma(html, options);

  expect(result.height).toBe(0);
});
