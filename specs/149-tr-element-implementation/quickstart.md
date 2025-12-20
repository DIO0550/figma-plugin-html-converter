# Quick Start: tr要素の実装

**Feature**: tr要素（テーブル行）
**Target Audience**: プロジェクト開発者
**Estimated Time**: 1日

## 概要

このガイドでは、TDD（テスト駆動開発）アプローチでtr要素を実装する手順を説明します。既存のtd/th要素のパターンを踏襲し、段階的に実装を進めます。

## 前提条件

### 必須環境
- Node.js >= 18.0.0
- TypeScript 5.4.3
- Git

### 必須知識
- TypeScript（特にGenerics、Union Types）
- Vitest（テストフレームワーク）
- Figma Plugin API（基本）

### 確認すべき依存関係
```bash
# td要素とth要素が実装済みであることを確認
ls src/converter/elements/table/td
ls src/converter/elements/table/th
```

## セットアップ

### 1. ブランチ作成

```bash
# 必ずmainブランチから開始
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b 149-tr-element-implementation
```

### 2. ディレクトリ構造の作成

```bash
# tr要素用のディレクトリを作成
mkdir -p src/converter/elements/table/tr/tr-attributes/__tests__
mkdir -p src/converter/elements/table/tr/tr-element/__tests__
```

### 3. 依存関係の確認

```bash
# パッケージが最新であることを確認
npm install

# 型チェックが通ることを確認
npm run type-check

# テストが通ることを確認
npm test
```

## 実装手順（TDDサイクル）

### Step 1: TrAttributes型の実装

**Phase**: RED → GREEN → REFACTOR

#### 1.1 テストファイルを作成（RED）

`src/converter/elements/table/tr/tr-attributes/__tests__/tr-attributes.test.ts`

```typescript
import { test, expect } from "vitest";
import type { TrAttributes } from "../tr-attributes";

test("TrAttributes - width属性を持つ", () => {
  const attrs: TrAttributes = {
    width: "100px",
  };

  expect(attrs.width).toBe("100px");
});

test("TrAttributes - height属性を持つ", () => {
  const attrs: TrAttributes = {
    height: "50px",
  };

  expect(attrs.height).toBe("50px");
});

test("TrAttributes - GlobalAttributesを継承する", () => {
  const attrs: TrAttributes = {
    id: "row-1",
    className: "table-row",
    style: "background-color: white;",
  };

  expect(attrs.id).toBe("row-1");
  expect(attrs.className).toBe("table-row");
  expect(attrs.style).toBe("background-color: white;");
});
```

#### 1.2 テストを実行（失敗を確認）

```bash
npm test -- tr-attributes.test.ts
# → FAILを確認
```

#### 1.3 型定義を実装（GREEN）

`src/converter/elements/table/tr/tr-attributes/tr-attributes.ts`

```typescript
/**
 * @fileoverview tr要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

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

#### 1.4 エクスポートを追加

`src/converter/elements/table/tr/tr-attributes/index.ts`

```typescript
export type { TrAttributes } from "./tr-attributes";
```

#### 1.5 テストを再実行（成功を確認）

```bash
npm test -- tr-attributes.test.ts
# → PASSを確認
```

---

### Step 2: TrElement.create()の実装

#### 2.1 テストファイルを作成（RED）

`src/converter/elements/table/tr/tr-element/__tests__/tr-element.factory.test.ts`

```typescript
import { test, expect } from "vitest";
import { TrElement } from "../tr-element";
import type { TrAttributes } from "../../tr-attributes";

test("TrElement.create() - デフォルト属性で基本的なtr要素を作成する", () => {
  const element = TrElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tr");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TrElement.create() - 指定された属性でtr要素を作成する", () => {
  const attributes: TrAttributes = {
    id: "row-1",
    className: "table-row",
    width: "100%",
    height: "50px",
  };

  const element = TrElement.create(attributes);

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("tr");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TrElement.create() - width属性のみでtr要素を作成する", () => {
  const element = TrElement.create({ width: "100%" });

  expect(element.attributes?.width).toBe("100%");
  expect(element.attributes?.height).toBeUndefined();
});

test("TrElement.create() - height属性のみでtr要素を作成する", () => {
  const element = TrElement.create({ height: "50px" });

  expect(element.attributes?.height).toBe("50px");
  expect(element.attributes?.width).toBeUndefined();
});

test("TrElement.create() - style属性でtr要素を作成する", () => {
  const element = TrElement.create({
    style: "border: 1px solid black; padding: 10px;",
  });

  expect(element.attributes?.style).toBe(
    "border: 1px solid black; padding: 10px;",
  );
});
```

#### 2.2 テストを実行（失敗を確認）

```bash
npm test -- tr-element.factory.test.ts
# → FAILを確認
```

#### 2.3 実装（GREEN）

`src/converter/elements/table/tr/tr-element/tr-element.ts`

```typescript
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TrAttributes } from "../tr-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * tr要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TrElement extends BaseElement<"tr", TrAttributes> {
  children: TrElement[] | [];
}

/**
 * TrElementコンパニオンオブジェクト
 */
export const TrElement = {
  create(attributes: Partial<TrAttributes> = {}): TrElement {
    return {
      type: "element",
      tagName: "tr",
      attributes: attributes as TrAttributes,
      children: [],
    };
  },

  // 他のメソッドは後で実装
};
```

#### 2.4 テストを再実行（成功を確認）

```bash
npm test -- tr-element.factory.test.ts
# → PASSを確認
```

---

### Step 3: TrElement.isTrElement()の実装

**同様の手順でテスト作成 → 実装 → 確認を繰り返します**

詳細は `tr-element.typeguards.test.ts` 参照。

---

### Step 4: TrElement.toFigmaNode()の実装

**同様の手順でテスト作成 → 実装 → 確認を繰り返します**

詳細は `tr-element.toFigmaNode.test.ts` 参照。

---

### Step 5: TrElement.mapToFigma()の実装

**同様の手順でテスト作成 → 実装 → 確認を繰り返します**

詳細は `tr-element.mapToFigma.test.ts` 参照。

---

### Step 6: エクスポートの追加

#### 6.1 tr-element/index.ts

```typescript
export { TrElement } from "./tr-element";
export type { TrElement as TrElementType } from "./tr-element";
```

#### 6.2 tr/index.ts

```typescript
export { TrElement } from "./tr-element";
export type { TrAttributes } from "./tr-attributes";
```

#### 6.3 table/index.ts（更新）

```typescript
export { TdElement } from "./td";
export type { TdAttributes } from "./td";
export { ThElement } from "./th";
export type { ThAttributes } from "./th";
export { TrElement } from "./tr";  // ⬅ 追加
export type { TrAttributes } from "./tr";  // ⬅ 追加
```

---

## 品質チェック

### すべてのテストが通ることを確認

```bash
npm test
# すべてPASSを確認
```

### カバレッジを確認

```bash
npm run coverage
# カバレッジ90%以上を確認
```

### Lintチェック

```bash
npm run lint
# エラーがないことを確認
```

### 型チェック

```bash
npm run type-check
# エラーがないことを確認
```

## コミット

### コミットメッセージ規約

プロジェクトのコミット規約（commit.prompt.md）に従ってコミットします。

```bash
# ステージング
git add src/converter/elements/table/tr
git add src/converter/elements/table/index.ts

# コミット（例）
git commit -m "✨ [New Feature]: tr要素（テーブル行）の実装

- TrAttributes型定義とテスト
- TrElement型定義とコンパニオンオブジェクト
- ファクトリメソッド、型ガード、Figma変換メソッド
- 包括的な単体テスト（カバレッジ90%以上）
- table/index.tsへのエクスポート追加

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

## トラブルシューティング

### テストが失敗する

```bash
# 詳細なエラーメッセージを確認
npm test -- --reporter=verbose

# 特定のテストファイルのみ実行
npm test -- tr-element.factory.test.ts
```

### 型エラーが出る

```bash
# 型チェックで詳細を確認
npm run type-check

# 依存する型定義を確認
# - BaseElement
# - TdElement
# - ThElement
# - GlobalAttributes
```

### Lintエラーが出る

```bash
# エラー箇所を確認
npm run lint

# 注意: eslint-disableディレクティブは使用禁止
# コードを修正して対応する
```

## 次のステップ

1. **PR作成**
   - `/speckit.tasks` でtasks.mdを生成
   - 実装計画に従ってPR作成

2. **統合テスト**
   - table要素と統合した時のテスト
   - 複雑なテーブル構造のテスト

3. **ドキュメント**
   - README更新（必要に応じて）
   - APIドキュメント生成

## 参考資料

- [spec.md](./spec.md) - 機能仕様
- [data-model.md](./data-model.md) - データモデル
- [contracts/tr-element-api.md](./contracts/tr-element-api.md) - API契約
- [research.md](./research.md) - 技術調査

### プロジェクト既存実装
- `src/converter/elements/table/td/` - td要素の参考実装
- `src/converter/elements/table/th/` - th要素の参考実装

### 外部ドキュメント
- [MDN: \<tr\> element](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr)
- [Figma Plugin API](https://www.figma.com/plugin-docs/api/FrameNode/)
- [Vitest Documentation](https://vitest.dev/)
