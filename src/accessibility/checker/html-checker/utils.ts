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
  const stack: ParsedHtmlNode[] = [];

  for (let i = nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i]);
  }

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) break;
    result.push(node);

    if (node.children.length > 0) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }

  return result;
}
