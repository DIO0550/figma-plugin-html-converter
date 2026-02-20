import { expect, vi, test, beforeEach } from "vitest";
import { handleConvertHtml, MAX_HTML_SIZE } from "../convert-html-tool";

// convertHTMLToFigma をモック
vi.mock("../../../../converter", () => ({
  convertHTMLToFigma: vi.fn(),
}));

import { convertHTMLToFigma } from "../../../../converter";

const mockConvertHTMLToFigma = vi.mocked(convertHTMLToFigma);

beforeEach(() => {
  vi.clearAllMocks();
});

test("正常なHTML入力でFigmaNodeConfig JSONを返す", async () => {
  const mockResult = {
    type: "FRAME",
    name: "div",
    width: 800,
    height: 600,
  };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({ html: "<div>test</div>" });

  expect(result.isError).toBeUndefined();
  expect(result.content).toHaveLength(1);
  expect(result.content[0]).toEqual({
    type: "text",
    text: JSON.stringify(mockResult),
  });
});

test("空HTML入力でRootフレームを返す", async () => {
  const mockResult = {
    type: "FRAME",
    name: "Root",
    width: 800,
    height: 600,
  };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({ html: "" });

  expect(result.isError).toBeUndefined();
  expect(result.content[0].type).toBe("text");
  const parsed = JSON.parse(
    (result.content[0] as { type: "text"; text: string }).text,
  );
  expect(parsed.type).toBe("FRAME");
  expect(parsed.name).toBe("Root");
});

test("containerWidth/Heightオプションが反映される", async () => {
  const mockResult = {
    type: "FRAME",
    name: "div",
    width: 1024,
    height: 768,
  };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  await handleConvertHtml({
    html: "<div>test</div>",
    options: { containerWidth: 1024, containerHeight: 768 },
  });

  expect(mockConvertHTMLToFigma).toHaveBeenCalledWith("<div>test</div>", {
    containerWidth: 1024,
    containerHeight: 768,
  });
});

test("1MBを超えるHTMLでサイズ超過エラーを返す", async () => {
  const largeHtml = "a".repeat(MAX_HTML_SIZE + 1);

  const result = await handleConvertHtml({ html: largeHtml });

  expect(result.isError).toBe(true);
  const errorText = (result.content[0] as { type: "text"; text: string }).text;
  expect(errorText).toContain("入力HTMLのサイズが上限");
  expect(errorText).toContain(MAX_HTML_SIZE.toLocaleString());
  expect(mockConvertHTMLToFigma).not.toHaveBeenCalled();
});

test("ちょうど1MBのHTML（境界値）は正常処理される", async () => {
  const exactHtml = "a".repeat(MAX_HTML_SIZE);
  const mockResult = { type: "FRAME", name: "Root" };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({ html: exactHtml });

  expect(result.isError).toBeUndefined();
  expect(mockConvertHTMLToFigma).toHaveBeenCalled();
});

test("converter例外時にisError: trueのエラー応答を返す", async () => {
  mockConvertHTMLToFigma.mockRejectedValue(new Error("パースエラー"));

  const result = await handleConvertHtml({ html: "<invalid>" });

  expect(result.isError).toBe(true);
  expect((result.content[0] as { type: "text"; text: string }).text).toBe(
    "変換エラー: パースエラー",
  );
});

test("レスポンス形式が正しい（content[0].type === 'text'）", async () => {
  const mockResult = { type: "FRAME", name: "div" };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({ html: "<div></div>" });

  expect(result.content[0].type).toBe("text");
});

test("524,288個の絵文字（= 1,048,576 code units）は許可される", async () => {
  // "\u{1F600}" は string.length = 2（サロゲートペア）
  const emoji = "\u{1F600}";
  const html = emoji.repeat(524_288); // 524,288 * 2 = 1,048,576 code units
  expect(html.length).toBe(MAX_HTML_SIZE);

  const mockResult = { type: "FRAME", name: "Root" };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({ html });

  expect(result.isError).toBeUndefined();
});

test("524,289個の絵文字（= 1,048,578 code units）は超過エラーになる", async () => {
  const emoji = "\u{1F600}";
  const html = emoji.repeat(524_289); // 524,289 * 2 = 1,048,578 code units
  expect(html.length).toBeGreaterThan(MAX_HTML_SIZE);

  const result = await handleConvertHtml({ html });

  expect(result.isError).toBe(true);
  const errorText = (result.content[0] as { type: "text"; text: string }).text;
  expect(errorText).toContain("入力HTMLのサイズが上限");
  expect(errorText).toContain(MAX_HTML_SIZE.toLocaleString());
});

test("Error以外の例外もstring化してエラー応答を返す", async () => {
  mockConvertHTMLToFigma.mockRejectedValue("文字列エラー");

  const result = await handleConvertHtml({ html: "<div></div>" });

  expect(result.isError).toBe(true);
  expect((result.content[0] as { type: "text"; text: string }).text).toBe(
    "変換エラー: 文字列エラー",
  );
});

test("負値オプションがconverterにそのまま転送される", async () => {
  const mockResult = { type: "FRAME", name: "div", width: 800, height: 600 };
  mockConvertHTMLToFigma.mockResolvedValue(mockResult);

  const result = await handleConvertHtml({
    html: "<div>test</div>",
    options: { containerWidth: -500, containerHeight: -400 },
  });

  expect(mockConvertHTMLToFigma).toHaveBeenCalledWith("<div>test</div>", {
    containerWidth: -500,
    containerHeight: -400,
  });
  expect(result.isError).toBeUndefined();
});
