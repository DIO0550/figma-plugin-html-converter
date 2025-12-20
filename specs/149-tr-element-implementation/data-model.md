# Data Model: tr要素実装

**Feature**: tr要素（テーブル行）の実装
**Date**: 2025-11-20

## 概要

tr要素の実装に必要なデータモデルを定義します。既存のtd/th要素のパターンを踏襲し、型安全性と保守性を確保します。

## エンティティ定義

### 1. TrAttributes

テーブル行要素の属性を定義するインターフェース。

```typescript
/**
 * tr要素の属性インターフェース
 *
 * tr要素はテーブルの行を表します。
 * GlobalAttributesを拡張し、width/height属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr
 */
export interface TrAttributes extends GlobalAttributes {
  /**
   * 行の幅
   *
   * ピクセル値または相対値を指定できます。
   * 例: "100px", "50%"
   */
  width?: string;

  /**
   * 行の高さ
   *
   * ピクセル値または相対値を指定できます。
   * 例: "50px", "auto"
   */
  height?: string;
}
```

**フィールド**:
- `width`: オプショナル。行全体の幅を指定
- `height`: オプショナル。行全体の高さを指定
- その他のGlobalAttributes継承フィールド（id, className, style等）

**検証ルール**:
- width/heightは文字列型（CSS値形式）
- 無効な値はFigma変換時に無視またはデフォルト値を使用

**状態遷移**: N/A（イミュータブルなデータ構造）

### 2. TrElement

テーブル行要素の完全な定義。

```typescript
/**
 * tr要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TrElement extends BaseElement<"tr", TrAttributes> {
  /**
   * tr要素の子要素
   * TdElement（データセル）またはThElement（ヘッダーセル）の配列
   * 空配列も許容（空の行）
   */
  children: TdElement[] | ThElement[] | [];
}
```

**フィールド**:
- `type`: "element"（固定値、BaseElementから継承）
- `tagName`: "tr"（固定値、BaseElementから継承）
- `attributes`: TrAttributes型（オプショナル）
- `children`: TdElement[]、ThElement[]、または空配列

**関係性**:
- `TrElement` は `BaseElement<"tr", TrAttributes>` を継承
- `TrElement` は 0個以上の `TdElement` または `ThElement` を子として持つ
- 将来的に `TableElement` が親要素となる可能性

**検証ルール**:
- `type` は必ず "element"
- `tagName` は必ず "tr"
- `children` はTdElement配列、ThElement配列、または空配列のいずれか
- 混在（TdElementとThElementの両方を含む）は許容（HTML仕様に準拠）

**状態遷移**: N/A（イミュータブルなデータ構造）

## Figma変換モデル

### FigmaNodeConfig

tr要素から生成されるFigmaノードの設定。

```typescript
// toFigmaNodeメソッドの戻り値型
interface FigmaNodeConfig {
  // FrameNodeの基本設定
  name: string;                    // "tr"
  layoutMode: "HORIZONTAL";        // 横方向レイアウト

  // Auto Layout設定
  primaryAxisAlignItems: "MIN";    // 左揃え
  counterAxisAlignItems: "MIN";    // 上揃え
  itemSpacing: number;             // 0（セル間隔なし）

  // スタイル設定
  fills: Paint[];                  // 背景色
  strokes: Paint[];                // ボーダー
  strokeWeight: number;            // ボーダー幅

  // パディング
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;

  // サイズ
  width?: number;
  height?: number;

  // 子要素
  children: FigmaNodeConfig[];     // 変換されたtd/th要素
}
```

**変換ルール**:
1. **基本構造**
   - `FigmaNode.createFrame("tr")` でFrameNode生成
   - `FigmaNodeConfig.applyHtmlElementDefaults()` でデフォルト設定適用

2. **レイアウト**
   - `layoutMode`: "HORIZONTAL"（横方向）
   - `itemSpacing`: 0（ボーダーで区切り表現）

3. **スタイル**
   - `background-color` → `fills`配列
   - `border` → `strokes`配列と`strokeWeight`
   - `padding` → `paddingLeft/Right/Top/Bottom`

4. **子要素**
   - 各子要素（TdElement/ThElement）を`toFigmaNode()`で変換
   - 変換結果を`children`配列に追加

## コンパニオンオブジェクト

### TrElement Companion Object

TrElement型に関連する操作を提供する。

```typescript
export const TrElement = {
  /**
   * 型ガード：オブジェクトがTrElementかどうかを判定
   *
   * @param node - 判定対象のオブジェクト
   * @returns TrElementであればtrue
   */
  isTrElement(node: unknown): node is TrElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "tr"
    );
  },

  /**
   * ファクトリメソッド：TrElementを生成
   *
   * @param attributes - tr要素の属性（オプショナル）
   * @returns 新しいTrElementオブジェクト
   */
  create(attributes: Partial<TrAttributes> = {}): TrElement {
    return {
      type: "element",
      tagName: "tr",
      attributes: attributes as TrAttributes,
      children: [],
    };
  },

  /**
   * Figma変換：TrElementをFigmaNodeConfigに変換
   *
   * @param element - 変換対象のTrElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TrElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("tr");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "tr",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * マッピング：unknownオブジェクトをTrElementとして解釈し、変換
   *
   * @param node - マッピング対象のオブジェクト
   * @returns FigmaNodeConfigまたはnull（変換失敗時）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "tr",
      this.isTrElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
```

**メソッド説明**:

1. **isTrElement(node)** - 型ガード
   - ランタイムでの型チェック
   - TypeScriptの型ナローイングをサポート

2. **create(attributes)** - ファクトリメソッド
   - 新しいTrElementの生成
   - デフォルト値の設定（空の子要素配列）

3. **toFigmaNode(element)** - Figma変換
   - TrElementをFigmaNodeConfigに変換
   - `toFigmaNodeWith`ユーティリティを使用
   - 共通スタイル（border, background, padding）を自動適用

4. **mapToFigma(node)** - マッピング
   - unknownオブジェクトからの変換
   - 型ガード、ファクトリ、変換を統合

## データフロー

```
Input (HTML/JSON)
    ↓
[mapToFigma] - 型チェックとオブジェクト生成
    ↓
TrElement
    ↓
[toFigmaNode] - Figma変換
    ↓
FigmaNodeConfig
    ↓
Figma FrameNode (最終出力)
```

1. **入力データ検証**
   - `mapToFigma()`または`isTrElement()`で型を確認
   - 不正なデータは早期にリジェクト

2. **TrElement生成**
   - `create()`で標準化されたTrElementを生成
   - 属性のデフォルト値を設定

3. **Figma変換**
   - `toFigmaNode()`でFigmaNodeConfigに変換
   - 子要素の再帰的変換
   - スタイル属性の適用

4. **出力**
   - FigmaNodeConfigからFrameNodeを生成
   - Figma Canvasに配置

## エンティティ関係図

```
BaseElement<T, A>
    ↑
    | extends
    |
TrElement
    |
    | has
    |
    ├─ TrAttributes (extends GlobalAttributes)
    |     ├─ width?: string
    |     ├─ height?: string
    |     └─ ...GlobalAttributes
    |
    └─ children: TdElement[] | ThElement[] | []
              ↓
         [0..*] TdElement/ThElement
```

## 型安全性の保証

### TypeScript型システム活用

1. **Strict Mode**
   - すべての型は明示的に定義
   - `null`/`undefined`の厳密なチェック

2. **型ガード**
   - `isTrElement()`によるランタイム型チェック
   - TypeScriptコンパイラとの連携

3. **Generics活用**
   - `BaseElement<"tr", TrAttributes>`
   - 型パラメータによる柔軟性と安全性

4. **ユニオン型**
   - `children: TdElement[] | ThElement[] | []`
   - 子要素の型を厳密に制限

## パフォーマンス考慮事項

1. **イミュータブルデータ**
   - すべてのエンティティは不変
   - 予測可能な動作

2. **遅延評価**
   - Figma変換は必要な時のみ実行
   - 中間データ構造の最小化

3. **メモリ効率**
   - オプショナルフィールドの活用
   - 不要なデータの保持を回避

## 拡張性

### 将来の拡張ポイント

1. **colspan/rowspan属性**
   ```typescript
   interface TrAttributes extends GlobalAttributes {
     // ... existing fields
     colspan?: number;  // 将来追加
     rowspan?: number;  // 将来追加
   }
   ```

2. **テーブルグループ要素（thead/tbody/tfoot）**
   ```typescript
   // TrElementの親要素として追加予定
   interface TheadElement {
     children: TrElement[];
   }
   ```

3. **スタイルプリセット**
   ```typescript
   // よく使うスタイルの組み合わせ
   TrElement.createWithPreset("striped")
   TrElement.createWithPreset("bordered")
   ```

## まとめ

TrElementのデータモデルは、以下を実現します：
- ✅ 型安全なHTML表現
- ✅ Figmaへの効率的な変換
- ✅ 既存パターンとの一貫性
- ✅ 将来の拡張性
- ✅ テストしやすい設計
