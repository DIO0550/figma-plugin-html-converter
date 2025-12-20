# API Contract: TableElement

**Version**: 1.0.0
**Date**: 2025-11-21

## 概要

TableElementのパブリックAPIコントラクトを定義します。このコントラクトは、TableElementコンパニオンオブジェクトが提供するすべての公開メソッドのシグネチャと動作を保証します。

## 型定義契約

### TableAttributes

```typescript
interface TableAttributes extends GlobalAttributes {
  border?: string;
}
```

**契約**:
- GlobalAttributesの全フィールドを継承
- `border`はオプショナル文字列
- 全フィールドはオプショナル（部分型として使用可能）

### TableElement

```typescript
interface TableElement extends BaseElement<"table", TableAttributes> {
  children: TrElement[];
}
```

**契約**:
- `type`は常に`"element"`
- `tagName`は常に`"table"`
- `children`は`TrElement[]`型（空配列も可）
- `attributes`は`TableAttributes`型またはundefined

## メソッド契約

### create

#### シグネチャ

```typescript
create(attributes?: Partial<TableAttributes>): TableElement
```

#### 契約

**入力**:
- `attributes`: TableAttributesの部分型（省略可）
  - 省略時は空オブジェクト`{}`として扱う
  - 全フィールドオプショナル

**出力**:
- TableElement型のオブジェクト
- `type: "element"`
- `tagName: "table"`
- `attributes`: 入力されたattributesをそのまま使用
- `children: []`（空配列）

**保証**:
- 常に有効なTableElementを返す
- 例外をスローしない
- 副作用なし（純粋関数）

#### テストケース

```typescript
import { test, expect } from "vitest";

test("引数なしでデフォルト値のtable要素が作成される", () => {
  const table = TableElement.create();
  expect(table.type).toBe("element");
  expect(table.tagName).toBe("table");
  expect(Array.isArray(table.children)).toBe(true);
  expect(table.children.length).toBe(0);
});

test("border属性を指定してtable要素が作成される", () => {
  const table = TableElement.create({ border: "1" });
  expect(table.attributes?.border).toBe("1");
});

test("複数の属性を指定してtable要素が作成される", () => {
  const table = TableElement.create({
    border: "1",
    class: "my-table",
    style: "background-color: #fff;",
  });
  expect(table.attributes?.border).toBe("1");
  expect(table.attributes?.class).toBe("my-table");
});
```

### isTableElement

#### シグネチャ

```typescript
isTableElement(node: unknown): node is TableElement
```

#### 契約

**入力**:
- `node`: 任意の型（unknown）

**出力**:
- `true`: nodeがTableElement型である
- `false`: nodeがTableElement型でない

**保証**:
- 型ガードとして機能
- 以下をチェック:
  1. `node`がobjectかつnullでない
  2. `type`プロパティが存在し、値が`"element"`
  3. `tagName`プロパティが存在し、値が`"table"`
- 例外をスローしない

#### テストケース

```typescript
import { test, expect } from "vitest";

test("正常なTableElementに対してtrueを返す", () => {
  const table = TableElement.create();
  expect(TableElement.isTableElement(table)).toBe(true);
});

test("nullに対してfalseを返す", () => {
  expect(TableElement.isTableElement(null)).toBe(false);
});

test("他の要素に対してfalseを返す", () => {
  const div = { type: "element", tagName: "div" };
  expect(TableElement.isTableElement(div)).toBe(false);
});

test("不完全なオブジェクトに対してfalseを返す", () => {
  const invalid = { type: "element" };
  expect(TableElement.isTableElement(invalid)).toBe(false);
});
```

### toFigmaNode

#### シグネチャ

```typescript
toFigmaNode(element: TableElement): FigmaNodeConfig
```

#### 契約

**入力**:
- `element`: TableElement型のオブジェクト

**出力**:
- FigmaNodeConfig型のオブジェクト
- node.type === "FRAME"
- node.name === "table"

**処理**:
1. `toFigmaNodeWith`ユーティリティを使用
2. FrameNode作成
3. 基本スタイル適用（`applyHtmlElementDefaults`）
4. Auto Layout設定:
   - layoutMode: "VERTICAL"
   - primaryAxisAlignItems: "MIN"
   - counterAxisAlignItems: "MIN"
   - itemSpacing: 0
5. 子要素（TrElement[]）を変換してchildren配列に追加

**保証**:
- 常に有効なFigmaNodeConfigを返す
- 子要素がない場合も正常に動作（空のchildren）
- attributesのスタイルが適用される

#### テストケース

```typescript
import { test, expect } from "vitest";

test("空のテーブルがFigma FrameNodeに変換される", () => {
  const table = TableElement.create();
  const config = TableElement.toFigmaNode(table);
  expect(config.node.type).toBe("FRAME");
  expect(config.node.name).toBe("table");
  expect(config.node.children.length).toBe(0);
});

test("border属性がstrokesとして適用される", () => {
  const table = TableElement.create({ border: "1" });
  const config = TableElement.toFigmaNode(table);
  expect(config.node.strokes).toBeDefined();
});

test("子要素（tr）が正しく変換されて配置される", () => {
  const tableWithRows: TableElement = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [TrElement.create(), TrElement.create()],
  };
  const config = TableElement.toFigmaNode(tableWithRows);
  expect(config.node.children.length).toBe(2);
});
```

### mapToFigma

#### シグネチャ

```typescript
mapToFigma(node: unknown): FigmaNodeConfig | null
```

#### 契約

**入力**:
- `node`: 任意の型（unknown）

**出力**:
- FigmaNodeConfig: nodeが有効なtable要素の場合
- null: nodeが無効またはtable要素でない場合

**処理**:
1. `mapToFigmaWith`ユーティリティを使用
2. 型ガード（`isTableElement`）で検証
3. 失敗時は`create`でデフォルト値作成
4. `toFigmaNode`で変換

**保証**:
- nullまたは有効なFigmaNodeConfigを返す
- 例外をスローしない（エラー時はnull）

#### テストケース

```typescript
import { test, expect } from "vitest";

test("有効なtable要素がFigmaNodeConfigに変換される", () => {
  const validNode = {
    type: "element",
    tagName: "table",
    attributes: {},
    children: [],
  };
  const result = TableElement.mapToFigma(validNode);
  expect(result).not.toBeNull();
  expect(result?.node.type).toBe("FRAME");
});

test("無効なノードに対してnullを返す", () => {
  const invalid = { tagName: "div" };
  const result = TableElement.mapToFigma(invalid);
  expect(result).toBeNull();
});

test("nullに対してnullを返す", () => {
  const result = TableElement.mapToFigma(null);
  expect(result).toBeNull();
});
```

## 互換性保証

### セマンティックバージョニング

- **MAJOR**: 破壊的変更（シグネチャ変更、契約違反）
- **MINOR**: 後方互換性のある機能追加
- **PATCH**: バグ修正、内部実装の改善

### 現在のバージョン: 1.0.0

初期リリース。以下を保証:
- 全メソッドのシグネチャ
- 入出力の型
- 動作契約

## 依存API

### 内部依存

- `BaseElement<T, A>`: 基底型
- `GlobalAttributes`: グローバル属性型
- `TrElement`: 子要素型

### 外部依存

- `FigmaNode.createFrame()`: FrameNode作成
- `FigmaNodeConfig.applyHtmlElementDefaults()`: スタイル適用
- `toFigmaNodeWith()`: 変換ユーティリティ
- `mapToFigmaWith()`: マッピングユーティリティ

## 非機能要件

### パフォーマンス

- `create`: O(1)
- `isTableElement`: O(1)
- `toFigmaNode`: O(n) - nは子要素数
- `mapToFigma`: O(n)

### メモリ

- 各メソッドは不要なオブジェクトコピーを作成しない
- 子要素の配列は参照を保持（不変性前提）

## 変更履歴

### 1.0.0 (2025-11-21)

- 初期リリース
- 全メソッドの実装と契約定義
