import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { convertHTMLToFigma } from "../../../converter";

// 1,048,576 UTF-16 code unit（= string.length 基準）
export const MAX_HTML_SIZE = 1_048_576;

export async function handleConvertHtml(args: {
  html: string;
  options?: { containerWidth?: number; containerHeight?: number };
}): Promise<CallToolResult> {
  if (args.html.length > MAX_HTML_SIZE) {
    return {
      content: [
        { type: "text", text: "入力HTMLのサイズが上限（1MB）を超えています" },
      ],
      isError: true,
    };
  }

  try {
    const result = await convertHTMLToFigma(args.html, args.options ?? {});

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `変換エラー: ${message}` }],
      isError: true,
    };
  }
}
