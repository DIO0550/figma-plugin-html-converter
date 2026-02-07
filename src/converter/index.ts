import type { FigmaNodeConfig } from "./types";
import { ConversionOptions } from "./types";
import { HTML } from "./models/html";
import { HTMLNode } from "./models/html-node";
import { Styles } from "./models/styles";
import { mapHTMLNodeToFigma } from "./mapper";
import { RedundancyDetector } from "./models/styles/redundancy-detector";
import { StyleOptimizer } from "./models/styles/style-optimizer";
import type {
  OptimizationMode,
  OptimizationResult,
} from "./models/styles/style-optimizer";

export interface ConversionResult {
  figmaNode: FigmaNodeConfig;
  optimizationResults?: OptimizationResult[];
}

export async function convertHTMLToFigma(
  html: string,
  options: ConversionOptions = {},
): Promise<FigmaNodeConfig> {
  const result = await convertHTMLToFigmaWithOptimization(html, options);
  return result.figmaNode;
}

export async function convertHTMLToFigmaWithOptimization(
  html: string,
  options: ConversionOptions = {},
): Promise<ConversionResult> {
  // オプションを正規化
  const normalizedOptions = ConversionOptions.from(options);

  // 空のHTMLの場合はデフォルトのフレームを返す
  if (HTML.isEmpty(html)) {
    return {
      figmaNode: {
        type: "FRAME",
        name: "Root",
        width: normalizedOptions.containerWidth,
        height: normalizedOptions.containerHeight,
      },
    };
  }

  // HTMLをパースしてHTMLNodeに変換
  const htmlAsHTML = HTML.from(html);
  const htmlNode = HTML.toHTMLNode(htmlAsHTML);

  // スタイル最適化（有効な場合）
  let optimizationResults: OptimizationResult[] | undefined;
  if (normalizedOptions.optimizeStyles) {
    optimizationResults = optimizeNodeStyles(
      htmlNode,
      normalizedOptions.optimizationMode ?? "auto",
    );
  }

  // HTMLNodeをFigmaNodeConfigに変換
  const figmaNode = mapHTMLNodeToFigma(htmlNode, normalizedOptions);

  // コンテナサイズが指定されている場合は適用
  if (normalizedOptions.containerWidth && !figmaNode.width) {
    figmaNode.width = normalizedOptions.containerWidth;
  }
  if (normalizedOptions.containerHeight && !figmaNode.height) {
    figmaNode.height = normalizedOptions.containerHeight;
  }

  return { figmaNode, optimizationResults };
}

/**
 * HTMLNodeツリーの各要素のスタイルを最適化
 * autoモードの場合、最適化済みスタイルをHTMLNodeのstyle属性に反映
 */
function optimizeNodeStyles(
  node: HTMLNode,
  mode: OptimizationMode,
): OptimizationResult[] {
  const results: OptimizationResult[] = [];
  optimizeNodeStylesRecursive(node, mode, results);
  return results;
}

function optimizeNodeStylesRecursive(
  node: HTMLNode,
  mode: OptimizationMode,
  results: OptimizationResult[],
  parentPath: string[] = [],
  siblingIndex?: number,
): void {
  if (!HTMLNode.isElement(node)) return;

  const tagName = node.tagName ?? "unknown";
  // StyleAnalyzer.walkNodeと同じパス生成ロジック
  const segment =
    siblingIndex !== undefined ? `${tagName}[${siblingIndex}]` : tagName;
  const currentPath = [...parentPath, segment];
  const pathStr = currentPath.join(" > ");

  const styleAttr = node.attributes?.style;

  if (styleAttr) {
    const styles = Styles.parse(styleAttr);

    if (!Styles.isEmpty(styles)) {
      const issues = RedundancyDetector.detect(styles, tagName);

      if (issues.length > 0) {
        // autoモードではshorthand/longhand混在の自動削除は危険なため除外
        // （CSSの宣言順でlonghandがshorthandを上書きするケースがある）
        const safeIssues =
          mode === "auto"
            ? issues.filter((i) => i.type !== "duplicate-property")
            : issues;
        const result = StyleOptimizer.optimize(styles, safeIssues, pathStr);
        results.push(result);

        // autoモードの場合: 最適化済みスタイルをHTMLNodeに反映
        // NOTE: 意図的なミューテーション
        // - HTMLNodeツリーはconvertHTMLToFigmaWithOptimization内で生成されたローカルな値であり、
        //   この関数外で再利用されることはない
        // - 新しいHTMLNodeツリーをコピー生成するとメモリ・計算コストが増大するため、
        //   パイプライン内部での直接変更が最適
        // - mapHTMLNodeToFigma()呼び出し前にスタイルを差し替える必要がある
        if (mode === "auto") {
          const optimizedStyleStr = Styles.toString(result.optimizedStyles);
          if (node.attributes) {
            node.attributes.style = optimizedStyleStr;
          }
        }
      }
    }
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      optimizeNodeStylesRecursive(
        node.children[i],
        mode,
        results,
        currentPath,
        i,
      );
    }
  }
}
