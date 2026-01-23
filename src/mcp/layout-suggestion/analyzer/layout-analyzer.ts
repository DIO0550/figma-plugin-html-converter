/**
 * レイアウト分析器
 *
 * HTML構造を分析し、レイアウトの問題点を検出する
 */
import type {
  LayoutAnalysisContext,
  LayoutAnalysisResult,
  LayoutProblem,
  LayoutProblemType,
  ProblemSeverity,
  NodePath,
} from "../types";
import { createNodePath } from "../types";

/**
 * HTML5 void要素（閉じタグを必要としない要素）のリスト
 *
 * これらの要素は自己閉じタグとして扱われ、終了タグを持ちません。
 * 参考: https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 *
 * パフォーマンス最適化:
 * - 関数外に配置することで、countDirectChildren()の呼び出しごとの配列再生成を回避
 * - Setを使用することでO(1)のルックアップを実現
 *
 * 型安全性:
 * - `as const` を使用した readonly tuple では `.includes()` との型互換性に問題が発生するため、
 *   Setを使用して `.has()` メソッドで型安全なチェックを行う
 */
const VOID_ELEMENTS: ReadonlySet<string> = new Set([
  "img",
  "br",
  "hr",
  "input",
  "meta",
  "link",
  "area",
  "base",
  "col",
  "embed",
  "source",
  "track",
  "wbr",
]);

/**
 * HTMLパーサーのセキュリティ制限値
 *
 * これらの制限は以下のリスクを軽減するために設定されています：
 * - ReDoS（正規表現サービス拒否）攻撃
 * - 過度のメモリ消費
 * - 深くネストされた構造による無限ループ
 */
const HTML_PARSER_LIMITS = {
  /**
   * 入力HTMLの最大サイズ（バイト）
   * 100KBを超えるHTMLは処理を拒否
   */
  MAX_HTML_SIZE_BYTES: 100 * 1024, // 100KB

  /**
   * 許容される最大ネスト深度
   * これを超える深さの要素は解析をスキップ
   */
  MAX_NESTING_DEPTH: 50,

  /**
   * 処理する最大要素数
   * ReDoS対策として、この数を超える要素がある場合は処理を打ち切り
   */
  MAX_ELEMENTS: 1000,
} as const;

/**
 * 分析サマリー
 */
export interface AnalysisSummary {
  /** 問題の総数 */
  totalProblems: number;
  /** 問題タイプ別の数 */
  problemsByType: Partial<Record<LayoutProblemType, number>>;
  /** 重大度別の数 */
  problemsBySeverity: Partial<Record<ProblemSeverity, number>>;
}

/**
 * スタイル解析結果
 */
interface ParsedStyles {
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: string;
}

/**
 * ノード情報
 */
interface NodeInfo {
  tagName: string;
  styles: ParsedStyles;
  childCount: number;
  path: NodePath;
}

/**
 * レイアウト分析器のコンパニオンオブジェクト
 */
export const LayoutAnalyzer = {
  /**
   * HTMLを分析してレイアウト問題を検出する
   *
   * @param context - 分析コンテキスト
   * @returns 分析結果
   */
  analyze(context: LayoutAnalysisContext): LayoutAnalysisResult {
    const { html } = context;

    if (!html || html.trim() === "") {
      return {
        problems: [],
        analyzedNodeCount: 0,
        analyzedAt: new Date(),
      };
    }

    const problems: LayoutProblem[] = [];
    const nodes = LayoutAnalyzer.parseHTML(html);

    for (const node of nodes) {
      const nodeProblems = LayoutAnalyzer.analyzeNodeInfo(node);
      problems.push(...nodeProblems);
    }

    return {
      problems,
      analyzedNodeCount: nodes.length,
      analyzedAt: new Date(),
    };
  },

  /**
   * 単一ノードを分析する
   *
   * @param html - HTML文字列
   * @param pathPrefix - パスのプレフィックス（親ノードのパス）
   * @returns 検出された問題のリスト
   */
  analyzeNode(html: string, pathPrefix: NodePath): LayoutProblem[] {
    const nodes = LayoutAnalyzer.parseHTML(html);
    const problems: LayoutProblem[] = [];

    for (const node of nodes) {
      const originalPath = String(node.path);
      const prefixString = String(pathPrefix);

      let combinedPath: string;

      // pathPrefix が空の場合は parseHTML が付与したパスをそのまま利用する
      if (!prefixString || prefixString.trim() === "") {
        combinedPath = originalPath;
      } else {
        // parseHTMLが付与した "root > " プレフィックスを除去して相対パスを取得
        const rootPrefix = "root > ";
        const relativePath = originalPath.startsWith(rootPrefix)
          ? originalPath.slice(rootPrefix.length)
          : originalPath;

        combinedPath =
          relativePath && relativePath.trim().length > 0
            ? `${prefixString} > ${relativePath}`
            : prefixString;
      }

      const updatedNode = {
        ...node,
        path: createNodePath(combinedPath),
      };
      const nodeProblems = LayoutAnalyzer.analyzeNodeInfo(updatedNode);
      problems.push(...nodeProblems);
    }

    return problems;
  },

  /**
   * 分析結果のサマリーを取得する
   *
   * @param result - 分析結果
   * @returns サマリー
   */
  getAnalysisSummary(result: LayoutAnalysisResult): AnalysisSummary {
    const problemsByType: Partial<Record<LayoutProblemType, number>> = {};
    const problemsBySeverity: Partial<Record<ProblemSeverity, number>> = {};

    for (const problem of result.problems) {
      problemsByType[problem.type] = (problemsByType[problem.type] || 0) + 1;
      problemsBySeverity[problem.severity] =
        (problemsBySeverity[problem.severity] || 0) + 1;
    }

    return {
      totalProblems: result.problems.length,
      problemsByType,
      problemsBySeverity,
    };
  },

  /**
   * HTMLをパースしてノード情報を抽出する
   *
   * 制限事項:
   * - この実装は正規表現ベースのシンプルなパーサーです
   * - 自己閉じタグ（<img />, <br />など）は検出されません
   * - 深くネストされた同名タグは正しく解析できない場合があります
   * - より堅牢な解析が必要な場合は、DOMParser、jsdom、htmlparser2などの
   *   ライブラリの使用を検討してください
   *
   * パフォーマンスに関する注意:
   * - 正規表現の繰り返し実行と再帰呼び出しにより、大きなHTMLでは
   *   O(n²)に近い計算量になる可能性があります
   * - 現在のレイアウト提案用途（通常数十要素程度）では問題ありませんが、
   *   100要素以上の大規模なHTMLを処理する場合はパフォーマンスが低下する
   *   可能性があります
   * - 大規模なHTML処理が必要な場合は、最適化されたパーサーライブラリの
   *   使用を検討してください
   *
   * セキュリティ対策:
   * - 入力サイズ制限: MAX_HTML_SIZE_BYTES (100KB) を超えるHTMLは空配列を返す
   * - ネスト深度制限: MAX_NESTING_DEPTH (50) を超える深さは解析をスキップ
   * - 要素数制限: MAX_ELEMENTS (1000) を超える要素は処理を打ち切り
   * - これにより ReDoS 攻撃や過度のメモリ消費を防止
   *
   * @param html - HTML文字列
   * @param currentDepth - 現在のネスト深度（内部使用）
   * @param elementCount - 処理済み要素数への参照（内部使用）
   * @returns ノード情報のリスト
   */
  parseHTML(
    html: string,
    currentDepth: number = 0,
    elementCount: { count: number } = { count: 0 },
  ): NodeInfo[] {
    // セキュリティチェック: 入力サイズ制限
    // バイト数ではなく文字数で近似的にチェック（日本語等のマルチバイト文字も考慮）
    if (html.length > HTML_PARSER_LIMITS.MAX_HTML_SIZE_BYTES) {
      return [];
    }

    // セキュリティチェック: ネスト深度制限
    if (currentDepth > HTML_PARSER_LIMITS.MAX_NESTING_DEPTH) {
      return [];
    }

    const nodes: NodeInfo[] = [];
    // 注: この正規表現は開始タグと終了タグのペアを検出します
    // 自己閉じタグには対応していません
    const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = tagRegex.exec(html)) !== null) {
      // セキュリティチェック: 要素数制限
      if (elementCount.count >= HTML_PARSER_LIMITS.MAX_ELEMENTS) {
        break;
      }
      elementCount.count++;

      const tagName = match[1];
      const attributes = match[2];
      const content = match[3];

      const styles = LayoutAnalyzer.parseStyleAttribute(attributes);
      const childCount = LayoutAnalyzer.countDirectChildren(content);

      nodes.push({
        tagName,
        styles,
        childCount,
        path: createNodePath(`root > ${tagName}[${index}]`),
      });

      // 子要素も再帰的にパース（深度制限内の場合のみ）
      if (
        content.includes("<") &&
        currentDepth + 1 <= HTML_PARSER_LIMITS.MAX_NESTING_DEPTH
      ) {
        const childNodes = LayoutAnalyzer.parseHTML(
          content,
          currentDepth + 1,
          elementCount,
        );
        for (const childNode of childNodes) {
          nodes.push({
            ...childNode,
            path: createNodePath(
              `root > ${tagName}[${index}] > ${childNode.tagName}`,
            ),
          });
        }
      }

      index++;
    }

    return nodes;
  },

  /**
   * style属性をパースする
   *
   * @param attributes - 属性文字列
   * @returns パースされたスタイル
   */
  parseStyleAttribute(attributes: string): ParsedStyles {
    const styleMatch = attributes.match(/style="([^"]*)"/);
    if (!styleMatch) {
      return {};
    }

    const styleString = styleMatch[1];
    const styles: ParsedStyles = {};

    const declarations = styleString.split(";").filter((s) => s.trim());
    for (const declaration of declarations) {
      const [property, value] = declaration.split(":").map((s) => s.trim());
      if (!property || !value) continue;

      switch (property) {
        case "display":
          styles.display = value;
          break;
        case "flex-direction":
          styles.flexDirection = value;
          break;
        case "justify-content":
          styles.justifyContent = value;
          break;
        case "align-items":
          styles.alignItems = value;
          break;
        case "gap":
          styles.gap = value;
          break;
        case "padding":
          styles.padding = value;
          break;
      }
    }

    return styles;
  },

  /**
   * 直接の子要素数をカウントする
   *
   * タグを順に走査し、ネスト深度を追跡して直接の子要素のみをカウントする
   *
   * @param content - HTML内容
   * @returns 子要素数
   */
  countDirectChildren(content: string): number {
    const tagRegex = /<\/?([a-zA-Z][\w-]*)([^>]*)>/g;
    let depth = 0;
    let count = 0;

    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(content)) !== null) {
      const fullMatch = match[0];

      // 終了タグ
      if (fullMatch.startsWith("</")) {
        if (depth > 0) {
          depth -= 1;
        }
        continue;
      }

      // 自己閉じタグの検出:
      // 1. 明示的な自己閉じ: `<img />`, `<br/>`（スラッシュで終わる）
      // 2. HTML5 void要素: VOID_ELEMENTS定数で定義（ファイル先頭参照）
      const tagName = match[1]?.toLowerCase() ?? "";
      const isSelfClosing =
        /\/\s*>$/.test(fullMatch) || VOID_ELEMENTS.has(tagName);

      if (isSelfClosing) {
        // 自己閉じタグは現在の深さが 0 のときのみ直接の子要素としてカウント
        if (depth === 0) {
          count += 1;
        }
        continue;
      }

      // 開始タグの場合、現在の深さが 0 のときのみ直接の子要素としてカウント
      if (depth === 0) {
        count += 1;
      }

      depth += 1;
    }

    return count;
  },

  /**
   * ノード情報を分析して問題を検出する
   *
   * @param node - ノード情報
   * @returns 検出された問題のリスト
   */
  analyzeNodeInfo(node: NodeInfo): LayoutProblem[] {
    const problems: LayoutProblem[] = [];

    // 子要素が複数あるがFlexコンテナでない場合
    if (node.childCount > 1 && node.styles.display !== "flex") {
      problems.push({
        type: "missing-flex-container",
        severity: "medium",
        location: node.path,
        description: `${node.tagName}要素に${node.childCount}個の子要素がありますが、Flexコンテナではありません`,
        currentValue: node.styles.display || "block",
      });
    }

    // Flexコンテナだが配置指定がない場合
    if (
      node.styles.display === "flex" &&
      !node.styles.justifyContent &&
      !node.styles.alignItems
    ) {
      problems.push({
        type: "missing-alignment",
        severity: "low",
        location: node.path,
        description: `${node.tagName}要素はFlexコンテナですが、justify-contentとalign-itemsが指定されていません`,
      });
    }

    return problems;
  },
};
