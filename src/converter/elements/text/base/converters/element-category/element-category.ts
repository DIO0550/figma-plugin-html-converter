/**
 * 要素タイプのカテゴリ
 */
export type ElementCategory =
  | "heading"
  | "paragraph"
  | "inline"
  | "code"
  | "quote"
  | "list";

/**
 * ElementCategoryのコンパニオンオブジェクト
 */
export const ElementCategory = {
  /**
   * 要素タイプからカテゴリを判定
   */
  from(elementType?: string): ElementCategory {
    if (!elementType) {
      return "paragraph";
    }

    switch (elementType.toLowerCase()) {
      // 見出し要素
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return "heading";

      // インライン要素（将来的に追加）
      case "span":
      case "a":
      case "abbr":
      case "cite":
      case "mark":
      case "small":
      case "sub":
      case "sup":
        return "inline";

      // コード要素（将来的に追加）
      case "code":
      case "pre":
      case "kbd":
      case "samp":
      case "var":
        return "code";

      // 引用要素（将来的に追加）
      case "blockquote":
      case "q":
        return "quote";

      // リスト要素（将来的に追加）
      case "ul":
      case "ol":
      case "li":
      case "dl":
      case "dt":
      case "dd":
        return "list";

      // 段落要素（デフォルト）
      case "p":
      case "div":
      case "section":
      case "article":
      case "aside":
      case "nav":
      case "header":
      case "footer":
      case "main":
      default:
        return "paragraph";
    }
  },

  /**
   * カテゴリが見出しかどうかを判定
   */
  isHeading(elementType?: string): boolean {
    return this.from(elementType) === "heading";
  },

  /**
   * カテゴリが段落かどうかを判定
   */
  isParagraph(elementType?: string): boolean {
    return this.from(elementType) === "paragraph";
  },

  /**
   * カテゴリがインラインかどうかを判定
   */
  isInline(elementType?: string): boolean {
    return this.from(elementType) === "inline";
  },

  /**
   * カテゴリがコードかどうかを判定
   */
  isCode(elementType?: string): boolean {
    return this.from(elementType) === "code";
  },

  /**
   * カテゴリが引用かどうかを判定
   */
  isQuote(elementType?: string): boolean {
    return this.from(elementType) === "quote";
  },

  /**
   * カテゴリがリストかどうかを判定
   */
  isList(elementType?: string): boolean {
    return this.from(elementType) === "list";
  },
} as const;
