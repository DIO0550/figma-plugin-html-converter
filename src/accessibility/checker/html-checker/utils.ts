/**
 * HTMLチェッカー共通ユーティリティ
 */
import type { ParsedHtmlNode } from "../../types";

/**
 * ネストされたノードツリーをフラットな配列に展開する
 */
export function flattenNodes(
  nodes: readonly ParsedHtmlNode[],
): ParsedHtmlNode[] {
  const result: ParsedHtmlNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children.length > 0) {
      result.push(...flattenNodes(node.children));
    }
  }
  return result;
}
