# Data Model: Table Header Element (th)

**Date**: 2025-11-17
**Feature**: 001-table-header-element

## Overview

このドキュメントはth要素の実装に必要なデータモデルを定義します。

## 1. Entity Definitions

### 1.1 ThAttributes

テーブルヘッダーセルの属性を表すインターフェース。

```typescript
import type { GlobalAttributes } from "../../../base";

/**
 * th要素の属性インターフェース
 *
 * th要素はテーブルのヘッダーセルを表します。
 * GlobalAttributesを拡張し、th要素固有の属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th
 */
export interface ThAttributes extends GlobalAttributes {
  /**
   * セルの幅
   *
   * ピクセル値または相対値を指定できます。
   * 例: "100px", "50%"
   */
  width?: string;

  /**
   * セルの高さ
   *
   * ピクセル値または相対値を指定できます。
   * 例: "50px", "auto"
   */
  height?: string;

  /**
   * ヘッダーセルの適用範囲
   *
   * - "col": 列のヘッダー
   * - "row": 行のヘッダー
   * - "colgroup": 列グループのヘッダー
   * - "rowgroup": 行グループのヘッダー
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#scope
   */
  scope?: "col" | "row" | "colgroup" | "rowgroup";

  /**
   * ヘッダーセルの省略形テキスト
   *
   * スクリーンリーダーなどの支援技術で使用されます。
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#abbr
   */
  abbr?: string;

  /**
   * セルが水平方向に結合する列数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#colspan
   */
  colspan?: string;

  /**
   * セルが垂直方向に結合する行数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#rowspan
   */
  rowspan?: string;
}
```

#### フィールド詳細

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| width | string | No | undefined | CSS length value | セルの幅 |
| height | string | No | undefined | CSS length value | セルの高さ |
| scope | enum | No | undefined | "col" \| "row" \| "colgroup" \| "rowspan" | ヘッダーの適用範囲 |
| abbr | string | No | undefined | - | ヘッダーの省略形 |
| colspan | string | No | "1" | Positive integer string | 列の結合数 |
| rowspan | string | No | "1" | Positive integer string | 行の結合数 |

#### 状態遷移

ThAttributes自体に状態遷移はありません（イミュータブル）。

### 1.2 ThElement

テーブルヘッダーセル要素を表すインターフェース。

```typescript
import type { BaseElement } from "../../../base/base-element";
import type { ThAttributes } from "../th-attributes";

/**
 * th要素の型定義
 *
 * BaseElementを継承した専用の型。
 * テーブルのヘッダーセルを表します。
 */
export interface ThElement extends BaseElement<"th", ThAttributes> {
  /**
   * 子要素
   *
   * th要素は通常、テキストノードまたは他のインライン要素を子に持ちます。
   * 現時点では空配列またはThElement配列をサポート。
   */
  children: ThElement[] | [];
}
```

#### フィールド詳細

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| type | "element" | Yes | "element" | ノードタイプ（BaseElementから継承） |
| tagName | "th" | Yes | "th" | HTMLタグ名 |
| attributes | ThAttributes | Yes | {} | th要素の属性 |
| children | ThElement[] \| [] | Yes | [] | 子要素の配列 |

### 1.3 ThElementコンパニオンオブジェクト

ThElement型に関連する操作を提供するコンパニオンオブジェクト。

```typescript
export const ThElement = {
  /**
   * ThElement型ガード
   *
   * 与えられたオブジェクトがThElementかどうかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns ThElementの場合true、それ以外はfalse
   */
  isThElement(node: unknown): node is ThElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "th"
    );
  },

  /**
   * ThElementファクトリメソッド
   *
   * 新しいThElementインスタンスを作成します。
   *
   * @param attributes - th要素の属性（省略可）
   * @returns 新しいThElement
   */
  create(attributes: Partial<ThAttributes> = {}): ThElement {
    return {
      type: "element",
      tagName: "th",
      attributes: attributes as ThAttributes,
      children: [],
    };
  },

  /**
   * ThElementをFigmaNodeConfigに変換
   *
   * th要素をFigma FrameNodeに変換します。
   * デフォルトスタイル（太字、中央揃え）とユーザー指定のスタイルを適用します。
   *
   * @param element - 変換対象のThElement
   * @returns 変換されたFigmaNodeConfig
   */
  toFigmaNode(element: ThElement): FigmaNodeConfig {
    // 実装詳細はPhase 2で定義
  },

  /**
   * unknown型のノードをThElementに変換し、FigmaNodeConfigにマッピング
   *
   * @param node - 変換対象のノード
   * @returns FigmaNodeConfig または null
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    // 実装詳細はPhase 2で定義
  },
};
```

## 2. Relationships

### 2.1 エンティティ間の関係

```
GlobalAttributes (base)
    ↑
    | extends
    |
ThAttributes
    ↑
    | used by
    |
ThElement
    ↓
    | converts to
    |
FigmaNodeConfig
```

### 2.2 依存関係

- **ThAttributes**:
  - Depends on: `GlobalAttributes` (from base)

- **ThElement**:
  - Depends on: `BaseElement` (from base)
  - Depends on: `ThAttributes`

- **ThElement Companion**:
  - Depends on: `FigmaNodeConfig` (from models/figma-node)
  - Depends on: `FigmaNode` (from models/figma-node)
  - Depends on: `element-utils` (from utils)
  - Depends on: `to-figma-node-with` (from utils)

## 3. Data Validation Rules

### 3.1 ThAttributes Validation

```typescript
/**
 * ThAttributes の妥当性検証
 */
function validateThAttributes(attrs: ThAttributes): ValidationResult {
  const errors: string[] = [];

  // width検証
  if (attrs.width !== undefined) {
    if (!isValidCssLength(attrs.width)) {
      errors.push(`Invalid width value: ${attrs.width}`);
    }
  }

  // height検証
  if (attrs.height !== undefined) {
    if (!isValidCssLength(attrs.height)) {
      errors.push(`Invalid height value: ${attrs.height}`);
    }
  }

  // scope検証
  if (attrs.scope !== undefined) {
    const validScopes = ["col", "row", "colgroup", "rowgroup"];
    if (!validScopes.includes(attrs.scope)) {
      errors.push(`Invalid scope value: ${attrs.scope}`);
    }
  }

  // colspan検証
  if (attrs.colspan !== undefined) {
    const num = parseInt(attrs.colspan, 10);
    if (isNaN(num) || num < 1) {
      errors.push(`Invalid colspan value: ${attrs.colspan}`);
    }
  }

  // rowspan検証
  if (attrs.rowspan !== undefined) {
    const num = parseInt(attrs.rowspan, 10);
    if (isNaN(num) || num < 1) {
      errors.push(`Invalid rowspan value: ${attrs.rowspan}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### 3.2 ThElement Validation

```typescript
/**
 * ThElement の妥当性検証
 */
function validateThElement(element: unknown): element is ThElement {
  if (!ThElement.isThElement(element)) {
    return false;
  }

  // 属性の検証
  const attrValidation = validateThAttributes(element.attributes);
  if (!attrValidation.isValid) {
    console.warn("Invalid ThElement attributes:", attrValidation.errors);
    return false;
  }

  return true;
}
```

## 4. Figma Conversion Model

### 4.1 FigmaNodeConfig構造

```typescript
/**
 * th要素のFigma変換結果
 */
interface ThFigmaNodeConfig extends FigmaNodeConfig {
  /**
   * ノードタイプ: "FRAME"
   */
  type: "FRAME";

  /**
   * ノード名
   *
   * scope属性がある場合: "th-{scope}" (例: "th-col", "th-row")
   * scope属性がない場合: "th"
   */
  name: string;

  /**
   * デフォルトスタイル適用
   *
   * - font-weight: bold (700)
   * - text-align: center
   * - vertical-align: middle
   */
  // Figma固有のプロパティで表現
}
```

### 4.2 変換マッピング

| HTML Attribute | Figma Property | Transformation |
|---------------|----------------|----------------|
| width | width | CSS length → px |
| height | height | CSS length → px |
| scope | name | "th" → "th-{scope}" |
| style.font-weight | fontWeight | CSS → Figma weight (default: bold) |
| style.text-align | primaryAxisAlignItems | CSS → Figma align (default: CENTER) |
| style.background-color | fills | CSS color → Figma paint |
| style.border | strokes | CSS border → Figma stroke |
| style.padding | paddingLeft/Right/Top/Bottom | CSS → px |
| colspan | (metadata) | プラグインデータとして保存 |
| rowspan | (metadata) | プラグインデータとして保存 |

### 4.3 デフォルトスタイルの適用順序

1. **ステップ1**: 基本Frameノード作成
   ```typescript
   const config = FigmaNode.createFrame("th");
   ```

2. **ステップ2**: HTML要素のデフォルト設定適用
   ```typescript
   config = FigmaNodeConfig.applyHtmlElementDefaults(
     config,
     "th",
     element.attributes
   );
   ```

3. **ステップ3**: th要素固有のデフォルトスタイル適用
   ```typescript
   config = applyThDefaultStyles(config);
   // - fontWeight: bold
   // - textAlign: center
   ```

4. **ステップ4**: ユーザー指定のstyle属性で上書き
   ```typescript
   config = applyUserStyles(config, element.attributes.style);
   ```

5. **ステップ5**: scope属性をノード名に反映
   ```typescript
   config.name = element.attributes.scope
     ? `th-${element.attributes.scope}`
     : "th";
   ```

## 5. API Contract

### 5.1 公開API

```typescript
// th-attributes/index.ts
export type { ThAttributes } from "./th-attributes";

// th-element/index.ts
export { ThElement } from "./th-element";
export type { ThElement as ThElementType } from "./th-element";

// table/th/index.ts
export { ThElement } from "./th-element";
export type { ThElement as ThElementType } from "./th-element";
export type { ThAttributes } from "./th-attributes";
```

### 5.2 使用例

```typescript
import { ThElement } from "@/converter/elements/table/th";
import type { ThAttributes } from "@/converter/elements/table/th";

// パターン1: ファクトリメソッドで作成
const headerCell = ThElement.create({
  scope: "col",
  style: "width: 100px; text-align: left;",
});

// パターン2: 型ガードで検証
if (ThElement.isThElement(node)) {
  const figmaNode = ThElement.toFigmaNode(node);
  // ...
}

// パターン3: mapToFigmaで変換
const figmaConfig = ThElement.mapToFigma(unknownNode);
if (figmaConfig) {
  // ...
}
```

## 6. まとめ

### データモデルの完成

1. ✅ ThAttributes型の詳細定義
2. ✅ ThElement型の詳細定義
3. ✅ バリデーションルールの定義
4. ✅ Figma変換モデルの定義
5. ✅ API契約の定義

### 次のステップ

Phase 1の残りのタスク：
1. `contracts/`: API仕様の詳細ドキュメント
2. `quickstart.md`: 使用方法のクイックガイド
