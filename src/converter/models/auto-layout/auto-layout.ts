import type { Brand } from '../../../types';
import { Styles } from "../styles";
import { Flexbox } from "../flexbox";

// Flexbox方向の型
export type FlexDirection = "HORIZONTAL" | "VERTICAL";

// 主軸の配置
export type PrimaryAxisAlignItems = "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";

// 交差軸の配置
export type CounterAxisAlignItems = "MIN" | "CENTER" | "MAX";

// AutoLayoutのデフォルト値
const AUTO_LAYOUT_DEFAULTS = {
  LAYOUT_MODE: 'HORIZONTAL' as FlexDirection,
  PRIMARY_AXIS_ALIGN: 'MIN' as PrimaryAxisAlignItems,
  COUNTER_AXIS_ALIGN: 'MIN' as CounterAxisAlignItems,
  PADDING: 0,
  SPACING: 0
} as const;

// AutoLayoutPropertiesのブランド型
export type AutoLayoutProperties = Brand<{
  layoutMode: FlexDirection;
  primaryAxisAlignItems: PrimaryAxisAlignItems;
  counterAxisAlignItems: CounterAxisAlignItems;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
}, 'AutoLayoutProperties'>;

// AutoLayoutPropertiesコンパニオンオブジェクト
export const AutoLayoutProperties = {
  // 空のAutoLayoutプロパティを作成
  empty(): AutoLayoutProperties {
    return {
      layoutMode: AUTO_LAYOUT_DEFAULTS.LAYOUT_MODE,
      primaryAxisAlignItems: AUTO_LAYOUT_DEFAULTS.PRIMARY_AXIS_ALIGN,
      counterAxisAlignItems: AUTO_LAYOUT_DEFAULTS.COUNTER_AXIS_ALIGN,
      paddingLeft: AUTO_LAYOUT_DEFAULTS.PADDING,
      paddingRight: AUTO_LAYOUT_DEFAULTS.PADDING,
      paddingTop: AUTO_LAYOUT_DEFAULTS.PADDING,
      paddingBottom: AUTO_LAYOUT_DEFAULTS.PADDING,
      itemSpacing: AUTO_LAYOUT_DEFAULTS.SPACING
    } as AutoLayoutProperties;
  },

  // オブジェクトからAutoLayoutPropertiesを作成
  from(value: {
    layoutMode: FlexDirection;
    primaryAxisAlignItems: PrimaryAxisAlignItems;
    counterAxisAlignItems: CounterAxisAlignItems;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    itemSpacing: number;
  }): AutoLayoutProperties {
    return value as AutoLayoutProperties;
  },

  // StylesからAutoLayoutPropertiesに変換
  fromStyles(styles: Styles): AutoLayoutProperties | null {
    if (!Flexbox.isFlexContainer(styles)) {
      return null;
    }

    const layoutMode = Flexbox.getFlexDirection(styles);
    const primaryAxisAlignItems = Flexbox.getJustifyContent(styles);
    const counterAxisAlignItems = Flexbox.getAlignItems(styles);
    
    // gap処理の改善：direction に応じて適切なgapを使用
    const gap = Flexbox.parseGap(styles);
    const itemSpacing = layoutMode === "HORIZONTAL" ? gap.columnGap : gap.rowGap;
    
    const padding = Flexbox.parsePadding(styles);

    return AutoLayoutProperties.from({
      layoutMode,
      primaryAxisAlignItems,
      counterAxisAlignItems,
      ...padding,
      itemSpacing
    });
  },

  // レイアウトモードを設定
  setLayoutMode(properties: AutoLayoutProperties, mode: FlexDirection): AutoLayoutProperties {
    return AutoLayoutProperties.from({
      ...properties,
      layoutMode: mode
    });
  },

  // 主軸の配置を設定
  setPrimaryAxisAlign(properties: AutoLayoutProperties, align: PrimaryAxisAlignItems): AutoLayoutProperties {
    return AutoLayoutProperties.from({
      ...properties,
      primaryAxisAlignItems: align
    });
  },

  // 交差軸の配置を設定
  setCounterAxisAlign(properties: AutoLayoutProperties, align: CounterAxisAlignItems): AutoLayoutProperties {
    return AutoLayoutProperties.from({
      ...properties,
      counterAxisAlignItems: align
    });
  },

  // アイテム間のスペーシングを設定
  setItemSpacing(properties: AutoLayoutProperties, spacing: number): AutoLayoutProperties {
    return AutoLayoutProperties.from({
      ...properties,
      itemSpacing: spacing
    });
  },

  // パディングを設定
  setPadding(properties: AutoLayoutProperties, padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }): AutoLayoutProperties {
    return AutoLayoutProperties.from({
      ...properties,
      paddingTop: padding.top ?? properties.paddingTop,
      paddingRight: padding.right ?? properties.paddingRight,
      paddingBottom: padding.bottom ?? properties.paddingBottom,
      paddingLeft: padding.left ?? properties.paddingLeft
    });
  }
};