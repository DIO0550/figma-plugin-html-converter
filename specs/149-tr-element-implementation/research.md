# Research: tr要素実装のための技術調査

**Feature**: tr要素（テーブル行）の実装
**Date**: 2025-11-20

## 概要

tr要素の実装に必要な技術的決定事項と、既存のtd/th要素実装から得られた知見をまとめます。

## 技術スタック確認

### 言語・フレームワーク
- **TypeScript**: 5.4.3（strict mode有効）
- **Node.js**: >= 18.0.0
- **テストフレームワーク**: Vitest 3.2.4
- **ビルドツール**: Vite 5.2.6
- **Linter**: ESLint 9.33.0

### プロジェクト構造
```
src/converter/elements/table/
├── td/                    # 既存：データセル要素
│   ├── td-attributes/
│   └── td-element/
├── th/                    # 既存：ヘッダーセル要素
│   ├── th-attributes/
│   └── th-element/
└── tr/                    # 新規：テーブル行要素
    ├── tr-attributes/
    └── tr-element/
```

## 決定事項

### 1. コンパニオンオブジェクトパターンの採用

**決定**: td/th要素と同様に、コンパニオンオブジェクトパターンを使用

**理由**:
- プロジェクト全体で統一されたパターン
- 型とその操作を1つの名前空間で管理
- `TrElement.create()`, `TrElement.isTrElement()` など直感的なAPI

**代替案**:
- クラスベースの実装 → 却下（プロジェクトの方針と異なる）
- 独立した関数 → 却下（名前空間の汚染、一貫性の欠如）

**参考実装**: `src/converter/elements/table/td/td-element/td-element.ts`

### 2. Auto Layout設定

**決定**: 横方向（HORIZONTAL）のAuto Layoutを使用

**理由**:
- tr要素はtd/th要素を横に並べる行構造
- Figmaの `layoutMode: "HORIZONTAL"` が最適
- セル間隔は0に設定し、ボーダーで表現

**設定値**:
```typescript
{
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "MIN",      // 左揃え
  counterAxisAlignItems: "MIN",      // 上揃え
  itemSpacing: 0,                    // セル間隔なし
}
```

**代替案**:
- 絶対位置配置 → 却下（レスポンシブ性の欠如）
- VERTICALレイアウト → 却下（行の概念に合わない）

### 3. 子要素の型定義

**決定**: `children: TdElement[] | ThElement[] | []`

**理由**:
- 実際のHTML仕様に準拠（trはtdまたはthを子に持つ）
- 型安全性の確保
- 空配列も許容（空の行のサポート）

**代替案**:
- `children: unknown[]` → 却下（型安全性の欠如）
- `children: (TdElement | ThElement)[]` → 検討したが、より厳密な型を選択

### 4. 属性の拡張

**決定**: GlobalAttributesを拡張し、width/height属性を追加

**理由**:
- td要素と同様の設計パターン
- テーブル行のサイズ指定をサポート
- HTMLの実装に合致

```typescript
interface TrAttributes extends GlobalAttributes {
  width?: string;
  height?: string;
}
```

**代替案**:
- GlobalAttributesのみ → 却下（width/heightのサポート不足）
- より多くの属性追加 → 却下（YAGNI原則、必要になったら追加）

### 5. スタイル変換戦略

**決定**: `toFigmaNodeWith` ユーティリティを使用し、共通スタイルを自動適用

**理由**:
- 既存のtd/th要素と同じパターン
- border, background-color, paddingの自動変換
- `applyCommonStyles: true` オプションで一貫性を保証

**実装例**:
```typescript
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
}
```

**代替案**:
- 手動でのスタイル適用 → 却下（重複コード、メンテナンス性低下）
- カスタムスタイル変換 → 却下（既存ユーティリティで十分）

### 6. テスト構造

**決定**: td要素と同じテストファイル構成を採用

**テストファイル**:
1. `tr-element.factory.test.ts` - ファクトリメソッドのテスト
2. `tr-element.typeguards.test.ts` - 型ガードのテスト
3. `tr-element.toFigmaNode.test.ts` - Figma変換のテスト
4. `tr-element.mapToFigma.test.ts` - マッピングのテスト

**理由**:
- 関心の分離（各ファイルが1つの責務）
- テストの可読性向上
- メンテナンス性の向上

**代替案**:
- 単一のテストファイル → 却下（大きくなりすぎる、可読性低下）

## ベストプラクティス

### 既存実装から学んだパターン

1. **型安全性の徹底**
   - strict modeの活用
   - 明示的な型定義
   - 型ガードによるランタイム検証

2. **TDD（テスト駆動開発）**
   - Red → Green → Refactor サイクル
   - テストファースト
   - 高いカバレッジ目標（90%以上）

3. **コード規約**
   - ESLintルールの遵守
   - `npx`コマンドの使用禁止（`npm run`を使用）
   - eslint-disableディレクティブの禁止

4. **ドキュメント**
   - JSDocによる詳細なAPIドキュメント
   - 型定義への説明コメント
   - 使用例の提供

## 技術的課題と解決策

### 課題1: 子要素の型の厳密性

**課題**: TdElementとThElementの両方をサポートする必要がある

**解決策**: ユニオン型で両方を許容
```typescript
children: TdElement[] | ThElement[] | []
```

### 課題2: Auto Layoutの設定

**課題**: 横方向の配置とセル間隔の管理

**解決策**:
- `itemSpacing: 0` でセル間隔をなくす
- ボーダーで視覚的な区切りを表現
- `primaryAxisAlignItems: "MIN"` で左揃え

### 課題3: スタイル継承

**課題**: td要素のスタイルとtr要素のスタイルの関係

**解決策**:
- tr要素は自身のスタイルのみを適用
- 子要素（td/th）は独自のスタイルを持つ
- スタイルの継承は自然なカスケーディングで処理

## パフォーマンス考慮事項

1. **不要な再計算の回避**
   - `toFigmaNodeWith`の最適化された実装を活用
   - スタイル計算のキャッシング（ユーティリティ内で実装済み）

2. **メモリ効率**
   - 子要素の配列は参照を保持（コピー不要）
   - 不要なオブジェクト生成を避ける

## 統合の考慮事項

### エクスポートの追加

`src/converter/elements/table/index.ts` に以下を追加:
```typescript
export { TrElement } from "./tr";
export type { TrAttributes } from "./tr";
```

### 将来の拡張性

以下は現時点では実装せず、必要になった時点で追加:
- colspan/rowspan属性のサポート
- セル結合のロジック
- 高度なテーブルスタイリング（alternating colors等）

## 結論

tr要素の実装は、既存のtd/th要素のパターンを踏襲することで、プロジェクトの一貫性を保ちながら、効率的に実装できます。横方向のAuto Layoutと型安全な子要素管理により、Figmaでの直感的なテーブル構造を実現します。

## 参考資料

- [MDN: \<tr\> element](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr)
- [Figma Plugin API: Auto Layout](https://www.figma.com/plugin-docs/api/properties/nodes-autolayout/)
- プロジェクト既存実装: `src/converter/elements/table/td/`
- プロジェクト既存実装: `src/converter/elements/table/th/`
