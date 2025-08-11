import { Styles } from "../styles";
import type { 
  FlexDirection, 
  PrimaryAxisAlignItems, 
  CounterAxisAlignItems 
} from "../auto-layout";
import {
  CSS_DISPLAY,
  CSS_FLEX_DIRECTION,
  CSS_JUSTIFY_CONTENT,
  CSS_ALIGN_ITEMS,
  CSS_DEFAULTS,
  CSS_SHORTHAND,
  CSS_BOX_MODEL_INDEX
} from "../../constants";

// Flexbox変換ユーティリティのコンパニオンオブジェクト
export const Flexbox = {
  // Flexコンテナかどうかを判定
  isFlexContainer(styles: Styles): boolean {
    const display = Styles.get(styles, "display");
    return display === CSS_DISPLAY.FLEX || 
           display === CSS_DISPLAY.INLINE_FLEX;
  },

  // flex-directionを取得
  getFlexDirection(styles: Styles): FlexDirection {
    const flexDirection = Styles.get(styles, "flex-direction") || CSS_DEFAULTS.FLEX_DIRECTION;

    switch (flexDirection) {
      case CSS_FLEX_DIRECTION.COLUMN:
      case CSS_FLEX_DIRECTION.COLUMN_REVERSE:
        return "VERTICAL";
      case CSS_FLEX_DIRECTION.ROW:
      case CSS_FLEX_DIRECTION.ROW_REVERSE:
      default:
        return "HORIZONTAL";
    }
  },

  // justify-contentを取得
  getJustifyContent(styles: Styles): PrimaryAxisAlignItems {
    const justifyContent = Styles.get(styles, "justify-content") || CSS_DEFAULTS.JUSTIFY_CONTENT;

    switch (justifyContent) {
      case CSS_JUSTIFY_CONTENT.FLEX_START:
        return "MIN";
      case CSS_JUSTIFY_CONTENT.FLEX_END:
        return "MAX";
      case CSS_JUSTIFY_CONTENT.CENTER:
        return "CENTER";
      case CSS_JUSTIFY_CONTENT.SPACE_BETWEEN:
      case CSS_JUSTIFY_CONTENT.SPACE_AROUND:
      case CSS_JUSTIFY_CONTENT.SPACE_EVENLY:
        return "SPACE_BETWEEN";
      default:
        return "MIN";
    }
  },

  // align-itemsを取得
  getAlignItems(styles: Styles): CounterAxisAlignItems {
    const alignItems = Styles.get(styles, "align-items") || CSS_DEFAULTS.ALIGN_ITEMS;

    switch (alignItems) {
      case CSS_ALIGN_ITEMS.FLEX_START:
        return "MIN";
      case CSS_ALIGN_ITEMS.FLEX_END:
        return "MAX";
      case CSS_ALIGN_ITEMS.CENTER:
        return "CENTER";
      case CSS_ALIGN_ITEMS.BASELINE:
        return "CENTER";  // baselineはCENTERにマッピング
      case CSS_ALIGN_ITEMS.STRETCH:
      default:
        return "MIN";  // stretchはMINにマッピング（Figmaのデフォルト）
    }
  },

  // スペーシング値をパース
  parseSpacing(value: string | undefined): number {
    if (!value) return CSS_DEFAULTS.SPACING;

    // calc()のサポート
    if (value.includes('calc')) {
      // calc(1rem + 5px) のような簡単なケースを処理
      const match = value.match(/calc\(([^)]+)\)/);
      if (match) {
        const expr = match[1];
        
        // 簡単な加算・減算のみサポート
        const addMatch = expr.match(/(\d+(?:\.\d+)?)(vw|vh|px|%|rem|em)?\s*\+\s*(\d+(?:\.\d+)?)(px|%|rem|em)?/);
        if (addMatch) {
          const val1 = parseFloat(addMatch[1]);
          const unit1 = addMatch[2] || 'px';
          const val2 = parseFloat(addMatch[3]);
          const unit2 = addMatch[4] || 'px';
          
          // 異なる単位の場合、ピクセルに変換
          let result = 0;
          if (unit1 === 'vh') result += val1 * 10.8; // 1080 / 100
          else if (unit1 === 'vw') result += val1 * 19.2; // 1920 / 100
          else if (unit1 === 'rem' || unit1 === 'em') result += val1 * 16;
          else result += val1;
          
          if (unit2 === 'rem' || unit2 === 'em') result += val2 * 16;
          else result += val2;
          
          return result;
        }
      }
    }

    const num = parseFloat(value);
    return isNaN(num) ? CSS_DEFAULTS.SPACING : num;
  },

  // gap値をパース（row-gap, column-gapも対応）
  parseGap(styles: Styles): { rowGap: number; columnGap: number } {
    const gap = Styles.get(styles, "gap");
    const rowGap = Styles.get(styles, "row-gap");
    const columnGap = Styles.get(styles, "column-gap");

    // 個別のgap値が指定されている場合
    if (rowGap || columnGap) {
      return {
        rowGap: Flexbox.parseSpacing(rowGap),
        columnGap: Flexbox.parseSpacing(columnGap)
      };
    }

    // gapショートハンドが指定されている場合
    if (gap) {
      const parts = gap.split(" ").map((p) => Flexbox.parseSpacing(p));
      
      if (parts.length === 1) {
        // 単一値の場合、行と列の両方に適用
        return {
          rowGap: parts[0],
          columnGap: parts[0]
        };
      } else if (parts.length === 2) {
        // 2つの値の場合、1つ目が行、2つ目が列
        return {
          rowGap: parts[0],
          columnGap: parts[1]
        };
      }
    }

    return {
      rowGap: CSS_DEFAULTS.SPACING,
      columnGap: CSS_DEFAULTS.SPACING
    };
  },

  // margin値をパース
  parseMargin(styles: Styles): {
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
  } {
    const margin = Styles.get(styles, "margin");
    let marginLeft = Flexbox.parseSpacing(Styles.get(styles, "margin-left"));
    let marginRight = Flexbox.parseSpacing(Styles.get(styles, "margin-right"));
    let marginTop = Flexbox.parseSpacing(Styles.get(styles, "margin-top"));
    let marginBottom = Flexbox.parseSpacing(Styles.get(styles, "margin-bottom"));

    if (margin) {
      const parts = margin.split(" ").map((p) => Flexbox.parseSpacing(p));

      if (parts.length === CSS_SHORTHAND.SINGLE_VALUE) {
        marginLeft = marginRight = marginTop = marginBottom = parts[CSS_BOX_MODEL_INDEX.TOP];
      } else if (parts.length === CSS_SHORTHAND.TWO_VALUES) {
        marginTop = marginBottom = parts[CSS_BOX_MODEL_INDEX.TOP];
        marginLeft = marginRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
      } else if (parts.length === CSS_SHORTHAND.THREE_VALUES) {
        marginTop = parts[CSS_BOX_MODEL_INDEX.TOP];
        marginLeft = marginRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
        marginBottom = parts[CSS_BOX_MODEL_INDEX.BOTTOM];
      } else if (parts.length === CSS_SHORTHAND.FOUR_VALUES) {
        marginTop = parts[CSS_BOX_MODEL_INDEX.TOP];
        marginRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
        marginBottom = parts[CSS_BOX_MODEL_INDEX.BOTTOM];
        marginLeft = parts[CSS_BOX_MODEL_INDEX.LEFT];
      }
    }

    return {
      marginLeft: marginLeft || 0,
      marginRight: marginRight || 0,
      marginTop: marginTop || 0,
      marginBottom: marginBottom || 0,
    };
  },

  // flex-wrapを取得
  getFlexWrap(styles: Styles): boolean {
    const flexWrap = Styles.get(styles, "flex-wrap");
    return flexWrap === "wrap" || flexWrap === "wrap-reverse";
  },

  // padding値をパース
  parsePadding(styles: Styles): {
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
  } {
    const padding = Styles.get(styles, "padding");
    let paddingLeft = Flexbox.parseSpacing(Styles.get(styles, "padding-left"));
    let paddingRight = Flexbox.parseSpacing(Styles.get(styles, "padding-right"));
    let paddingTop = Flexbox.parseSpacing(Styles.get(styles, "padding-top"));
    let paddingBottom = Flexbox.parseSpacing(Styles.get(styles, "padding-bottom"));

    if (padding) {
      const parts = padding.split(" ").map((p) => Flexbox.parseSpacing(p));

      if (parts.length === CSS_SHORTHAND.SINGLE_VALUE) {
        paddingLeft = paddingRight = paddingTop = paddingBottom = parts[CSS_BOX_MODEL_INDEX.TOP];
      } else if (parts.length === CSS_SHORTHAND.TWO_VALUES) {
        paddingTop = paddingBottom = parts[CSS_BOX_MODEL_INDEX.TOP];
        paddingLeft = paddingRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
      } else if (parts.length === CSS_SHORTHAND.THREE_VALUES) {
        paddingTop = parts[CSS_BOX_MODEL_INDEX.TOP];
        paddingLeft = paddingRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
        paddingBottom = parts[CSS_BOX_MODEL_INDEX.BOTTOM];
      } else if (parts.length === CSS_SHORTHAND.FOUR_VALUES) {
        paddingTop = parts[CSS_BOX_MODEL_INDEX.TOP];
        paddingRight = parts[CSS_BOX_MODEL_INDEX.RIGHT];
        paddingBottom = parts[CSS_BOX_MODEL_INDEX.BOTTOM];
        paddingLeft = parts[CSS_BOX_MODEL_INDEX.LEFT];
      }
    }

    return {
      paddingLeft: paddingLeft || CSS_DEFAULTS.SPACING,
      paddingRight: paddingRight || CSS_DEFAULTS.SPACING,
      paddingTop: paddingTop || CSS_DEFAULTS.SPACING,
      paddingBottom: paddingBottom || CSS_DEFAULTS.SPACING,
    };
  }
};
