import type { HTMLNode } from "../../html-node";
import { HTMLNode as HTMLNodeObj } from "../../html-node";
import { Styles } from "../styles";
import { RedundancyDetector } from "../redundancy-detector";
import type { RedundancyIssue } from "../redundancy-detector";

/**
 * スタイル分析結果
 */
export interface StyleAnalysisResult {
  /** 要素のパス（例: "div > p > span"） */
  path: string;
  /** 要素のタグ名 */
  tagName: string;
  /** 解析済みスタイル */
  styles: Styles;
  /** 検出された冗長性の問題 */
  issues: RedundancyIssue[];
}

/**
 * ツリー全体の分析結果
 */
export interface TreeAnalysisResult {
  /** 各要素の分析結果 */
  results: StyleAnalysisResult[];
  /** 検出された問題の総数 */
  totalIssues: number;
}

/**
 * HTMLNodeツリーからスタイル情報を収集・分析するモジュール
 * コンパニオンオブジェクトパターンで実装
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StyleAnalyzer {
  /**
   * HTMLNodeツリー全体を分析し、各要素の冗長なスタイルを検出
   */
  export function analyze(node: HTMLNode): TreeAnalysisResult {
    const results: StyleAnalysisResult[] = [];
    walkNode(node, [], results);

    return {
      results,
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
    };
  }

  /**
   * 単一ノードのスタイルを分析
   */
  export function analyzeNode(
    node: HTMLNode,
    path: string = "",
  ): StyleAnalysisResult | null {
    if (!HTMLNodeObj.isElement(node)) return null;

    const tagName = node.tagName ?? "unknown";
    const styleAttr = node.attributes?.style;

    if (!styleAttr) return null;

    const styles = Styles.parse(styleAttr);

    if (Styles.isEmpty(styles)) return null;

    const issues = RedundancyDetector.detect(styles, tagName);

    return {
      path: path || tagName,
      tagName,
      styles,
      issues,
    };
  }

  /**
   * HTMLNodeツリーを再帰的に走査
   * 兄弟インデックスを含めたパスを生成し、同一構造の兄弟要素でも一意になるようにする
   */
  function walkNode(
    node: HTMLNode,
    parentPath: string[],
    results: StyleAnalysisResult[],
    siblingIndex?: number,
  ): void {
    if (!HTMLNodeObj.isElement(node)) return;

    const tagName = node.tagName ?? "unknown";
    const segment =
      siblingIndex !== undefined ? `${tagName}[${siblingIndex}]` : tagName;
    const currentPath = [...parentPath, segment];
    const pathStr = currentPath.join(" > ");

    const result = analyzeNode(node, pathStr);
    if (result) {
      results.push(result);
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        walkNode(node.children[i], currentPath, results, i);
      }
    }
  }
}
