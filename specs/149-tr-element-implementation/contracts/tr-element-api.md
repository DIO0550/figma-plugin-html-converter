# API Contract: TrElement

**Version**: 1.0.0
**Status**: Draft
**Date**: 2025-11-20

## 概要

TrElement（テーブル行要素）のAPI契約を定義します。このドキュメントは、TrElementの公開インターフェース、メソッドシグネチャ、および動作保証を記述します。

## 型定義

### TrAttributes型

```typescript
/**
 * tr要素の属性
 */
interface TrAttributes extends GlobalAttributes {
  /** 行の幅（オプショナル） */
  width?: string;
  /** 行の高さ（オプショナル） */
  height?: string;
}
```

**契約**:
- `GlobalAttributes`のすべてのフィールドを継承
- `width`と`height`はオプショナル（未指定でも有効）
- 文字列型のCSS値形式（例: "100px", "50%", "auto"）

### TrElement型

```typescript
/**
 * tr要素のインターフェース
 */
interface TrElement extends BaseElement<"tr", TrAttributes> {
  /** tr要素の子要素（TdElement、ThElement、または空配列） */
  children: TdElement[] | ThElement[] | [];
}
```

**契約**:
- `type`フィールドは常に`"element"`
- `tagName`フィールドは常に`"tr"`
- `children`は以下のいずれか:
  - `TdElement[]`（データセルの配列）
  - `ThElement[]`（ヘッダーセルの配列）
  - `[]`（空配列）

## Companion Objectメソッド

### isTrElement(node: unknown): node is TrElement

**用途**: ランタイム型ガード

**シグネチャ**:
```typescript
function isTrElement(node: unknown): node is TrElement
```

**パラメータ**:
- `node`: 任意の値

**戻り値**:
- `boolean`: `node`がTrElementの形式に適合する場合は`true`

**契約**:
- `node`が以下の条件をすべて満たす場合に`true`を返す:
  1. オブジェクトである（`typeof node === "object"`）
  2. `null`でない
  3. `type`プロパティが存在し、値が`"element"`
  4. `tagName`プロパティが存在し、値が`"tr"`
- それ以外の場合は`false`を返す
- 副作用なし（Pure Function）

**使用例**:
```typescript
if (TrElement.isTrElement(node)) {
  // この中ではnodeの型がTrElementにナローイングされる
  console.log(node.tagName); // "tr"
}
```

---

### create(attributes?: Partial\<TrAttributes\>): TrElement

**用途**: TrElementの生成

**シグネチャ**:
```typescript
function create(attributes?: Partial<TrAttributes>): TrElement
```

**パラメータ**:
- `attributes` (オプショナル): TrAttributesの部分的なオブジェクト

**戻り値**:
- `TrElement`: 新しいTrElementオブジェクト

**契約**:
1. **デフォルト値**:
   - `type`: `"element"`
   - `tagName`: `"tr"`
   - `children`: `[]`（空配列）
   - `attributes`: 引数で渡された値、または空オブジェクト

2. **属性のマージ**:
   - 渡された`attributes`はそのまま使用（デフォルト値とのマージなし）
   - 部分的な属性指定が可能

3. **不変性**:
   - 新しいオブジェクトを生成（既存オブジェクトを変更しない）

**使用例**:
```typescript
// デフォルト属性
const tr1 = TrElement.create();
// { type: "element", tagName: "tr", attributes: {}, children: [] }

// 属性指定
const tr2 = TrElement.create({ width: "100px", className: "row" });
// { type: "element", tagName: "tr", attributes: { width: "100px", className: "row" }, children: [] }
```

---

### toFigmaNode(element: TrElement): FigmaNodeConfig

**用途**: TrElementをFigmaNodeConfigに変換

**シグネチャ**:
```typescript
function toFigmaNode(element: TrElement): FigmaNodeConfig
```

**パラメータ**:
- `element`: 変換対象のTrElement

**戻り値**:
- `FigmaNodeConfig`: Figma FrameNodeの設定オブジェクト

**契約**:
1. **基本構造**:
   - `name`: `"tr"`
   - `layoutMode`: `"HORIZONTAL"`（横方向レイアウト）

2. **Auto Layout**:
   - `primaryAxisAlignItems`: `"MIN"`（左揃え）
   - `counterAxisAlignItems`: `"MIN"`（上揃え）
   - `itemSpacing`: `0`（セル間隔なし）

3. **スタイル適用** (`applyCommonStyles: true`):
   - `background-color` → `fills`配列
   - `border` → `strokes`配列と`strokeWeight`
   - `padding` → `paddingLeft/Right/Top/Bottom`

4. **子要素**:
   - `element.children`の各要素を再帰的に変換
   - 変換結果を`children`配列に追加

5. **エラーハンドリング**:
   - 不正なスタイル値は無視またはデフォルト値を使用
   - 変換失敗時は例外をスロー（エラーメッセージ付き）

**使用例**:
```typescript
const element = TrElement.create({
  width: "100%",
  style: "background-color: #f0f0f0; border: 1px solid #ccc;"
});

const config = TrElement.toFigmaNode(element);
// FigmaNodeConfig {
//   name: "tr",
//   layoutMode: "HORIZONTAL",
//   fills: [{ type: "SOLID", color: { r: 0.94, g: 0.94, b: 0.94 } }],
//   strokes: [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }],
//   strokeWeight: 1,
//   ...
// }
```

---

### mapToFigma(node: unknown): FigmaNodeConfig | null

**用途**: 任意のオブジェクトをTrElementとして変換

**シグネチャ**:
```typescript
function mapToFigma(node: unknown): FigmaNodeConfig | null
```

**パラメータ**:
- `node`: 任意の値

**戻り値**:
- `FigmaNodeConfig`: 変換成功時
- `null`: `node`がTrElementでない場合

**契約**:
1. **変換フロー**:
   ```
   node → isTrElement() → create() → toFigmaNode() → FigmaNodeConfig
   ```

2. **型チェック**:
   - `isTrElement(node)`で型を検証
   - 不合格の場合は即座に`null`を返す

3. **変換実行**:
   - 型チェック合格時は`toFigmaNode()`を呼び出し
   - 結果をそのまま返す

**使用例**:
```typescript
const validNode = { type: "element", tagName: "tr", attributes: {}, children: [] };
const config = TrElement.mapToFigma(validNode);
// FigmaNodeConfig { ... }

const invalidNode = { type: "text", content: "Hello" };
const result = TrElement.mapToFigma(invalidNode);
// null
```

## 動作保証

### 不変性

すべてのメソッドは引数を変更せず、新しいオブジェクトを返します。

```typescript
const attrs = { width: "100px" };
const element = TrElement.create(attrs);
attrs.width = "200px";
// element.attributes.width は依然として "100px"（変更されない）
```

### Pure Functions

以下のメソッドは純粋関数です（同じ入力に対して常に同じ出力）:
- `isTrElement()`
- `create()`

以下のメソッドは副作用を持ちません:
- `toFigmaNode()` - スタイル計算のキャッシングは内部で管理
- `mapToFigma()` - 型チェックと変換のみ

### エラーハンドリング

**型エラー**:
- `isTrElement()`は例外をスローせず、常に`boolean`を返す
- `mapToFigma()`は不正な入力に対して`null`を返す

**変換エラー**:
- `toFigmaNode()`は致命的エラー時のみ例外をスロー
- スタイル値の不正は警告を出して無視

## 互換性

### TypeScript

- 必須バージョン: >= 5.0.0
- Strict mode必須

### 依存関係

```typescript
import type { BaseElement } from "../../../base/base-element";
import type { TdElement } from "../../td";
import type { ThElement } from "../../th";
import type { GlobalAttributes } from "../../../base/global-attributes";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
```

## テスト要件

API契約を検証するために、以下のテストが必須です:

1. **型ガードテスト** (`tr-element.typeguards.test.ts`)
   - 正常なTrElementの判定
   - 不正なオブジェクトの判定

2. **ファクトリテスト** (`tr-element.factory.test.ts`)
   - デフォルト属性での生成
   - カスタム属性での生成

3. **変換テスト** (`tr-element.toFigmaNode.test.ts`)
   - 基本的なFigmaNode生成
   - スタイル適用の検証

4. **マッピングテスト** (`tr-element.mapToFigma.test.ts`)
   - 正常なマッピング
   - 無効な入力の処理

## バージョニング

**Semantic Versioning**に従います:
- **Major**: 破壊的変更（例: メソッドシグネチャの変更）
- **Minor**: 後方互換性のある機能追加
- **Patch**: バグフィックス

**Current Version**: 1.0.0 (Initial Release)

## 変更履歴

### 1.0.0 (2025-11-20)
- 初版リリース
- TrElement型とCompanion Objectメソッドの定義
