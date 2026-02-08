import type { FigmaNodeConfig } from "./types";
import { ConversionOptions } from "./types";
import { HTML } from "./models/html";
import { HTMLNode } from "./models/html-node";
import { Styles } from "./models/styles";
import { mapHTMLNodeToFigma } from "./mapper";
import { RedundancyDetector } from "./models/styles/redundancy-detector";
import type { RedundancyIssue } from "./models/styles/redundancy-detector";
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
  traverseNodeStyles(node, ({ styles, issues, pathStr, node: currentNode }) => {
    if (mode === "manual") {
      // manualモード: 提案生成のみ行い、実際の適用はしない
      const proposals = StyleOptimizer.generateProposals(issues, pathStr);
      results.push({
        originalStyles: styles,
        optimizedStyles: styles,
        proposals,
        appliedCount: 0,
        skippedCount: proposals.length,
        summary: {
          totalIssues: issues.length,
          applied: 0,
          skipped: proposals.length,
          reductionPercentage: 0,
          byType: issues.reduce(
            (acc, issue) => {
              acc[issue.type] = (acc[issue.type] || 0) + 1;
              return acc;
            },
            {
              "duplicate-property": 0,
              "default-value": 0,
              "shorthand-opportunity": 0,
            } as OptimizationResult["summary"]["byType"],
          ),
        },
      });
    } else {
      // autoモード: shorthand/longhand混在の自動削除は危険なため除外
      // （CSSの宣言順でlonghandがshorthandを上書きするケースがある）
      const safeIssues = issues.filter((i) => i.type !== "duplicate-property");
      const result = StyleOptimizer.optimize(styles, safeIssues, pathStr);
      results.push(result);

      // autoモードの場合: 最適化済みスタイルをHTMLNodeに反映
      // NOTE: 意図的なミューテーション（詳細はtraverseNodeStylesのJSDocを参照）
      const optimizedStyleStr = Styles.toString(result.optimizedStyles);
      if (currentNode.attributes) {
        currentNode.attributes.style = optimizedStyleStr;
      }
    }
  });
  return results;
}

/**
 * HTMLNodeツリーを再帰的に走査し、スタイルを持つ各要素に対してコールバックを呼び出す共通関数
 *
 * 各要素について、スタイルのパース→冗長検出を行い、問題がある場合にコールバックを呼び出す。
 * コールバック内でnode.attributes.styleを更新することで最適化を適用できる。
 *
 * NOTE: コールバック内でのHTMLNode.attributes.styleの直接更新は意図的なミューテーション
 * - HTMLNodeツリーは呼び出し元で生成されたローカルな値であり、外部で再利用されない
 * - 新しいHTMLNodeツリーをコピー生成するとメモリ・計算コストが増大するため、
 *   パイプライン内部での直接変更が最適
 */
export interface NodeStyleContext {
  node: HTMLNode;
  styles: Styles;
  issues: RedundancyIssue[];
  pathStr: string;
}

export function traverseNodeStyles(
  node: HTMLNode,
  callback: (context: NodeStyleContext) => void,
  parentPath: string[] = [],
  siblingIndex?: number,
): void {
  if (!HTMLNode.isElement(node)) return;

  const tagName = node.tagName ?? "unknown";
  const { currentPath, pathStr } = HTMLNode.buildElementPath(
    tagName,
    parentPath,
    siblingIndex,
  );

  const styleAttr = node.attributes?.style;

  if (styleAttr) {
    const styles = Styles.parse(styleAttr);

    if (!Styles.isEmpty(styles)) {
      const issues = RedundancyDetector.detect(styles, tagName);

      if (issues.length > 0) {
        callback({ node, styles, issues, pathStr });
      }
    }
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      traverseNodeStyles(node.children[i], callback, currentPath, i);
    }
  }
}
