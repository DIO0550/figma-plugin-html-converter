# Research: Table Header Element (th)

**Date**: 2025-11-17
**Feature**: 001-table-header-element

## Overview

このドキュメントはth要素実装に必要な技術調査の結果をまとめます。

## 1. th要素とtd要素の違い

### 1.1 セマンティクスの違い

**決定**: th要素はヘッダーセル、td要素はデータセル

**根拠**:
- HTML仕様では、th要素はテーブルのヘッダーセルを表す
- td要素は通常のデータセルを表す
- セマンティック的には異なるが、視覚的な表現は類似

**代替案**:
- th要素とtd要素を統合する → 却下（セマンティックの違いを明確にすべき）

### 1.2 デフォルトスタイルの違い

**決定**: th要素はデフォルトで太字・中央揃え

**根拠**:
- MDNドキュメント: https://developer.mozilla.org/ja/docs/Web/HTML/Element/th
- ブラウザのデフォルトスタイル:
  - `font-weight: bold`
  - `text-align: center`
  - `vertical-align: middle`

**実装方法**:
```typescript
// Figma変換時にデフォルトスタイルを適用
// font-weight: bold → FigmaのテキストノードのfontWeight設定
// text-align: center → Figma AutoLayoutのhorizontalAlign設定
```

**代替案検討**:
- ユーザー指定のスタイルで上書きする → 採用（CSSの優先順位に従う）
- 常に太字にする → 却下（柔軟性が失われる）

## 2. scope属性の仕様と実装方法

### 2.1 scope属性の仕様

**決定**: scope属性は"col" | "row" | "colgroup" | "rowgroup"の4つの値をサポート

**根拠**:
- HTML仕様: https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope
- scope属性は、ヘッダーセルがどの範囲（列、行、列グループ、行グループ）に適用されるかを示す
- アクセシビリティのために重要な属性

**実装方針**:
```typescript
export interface ThAttributes extends GlobalAttributes {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  // ...
}
```

### 2.2 Figma変換での扱い

**決定**: scope属性はFigmaノードのnameに反映する

**根拠**:
- Figma APIにはscope属性に直接対応する機能がない
- ノード名に含めることで、後から識別可能にする
- 例: `th-col`, `th-row`, `th-colgroup`, `th-rowgroup`

**実装例**:
```typescript
const nodeName = element.attributes.scope
  ? `th-${element.attributes.scope}`
  : "th";
```

**代替案検討**:
- プラグインデータとして保存 → 却下（Figma UI上で分かりにくい）
- 無視する → 却下（アクセシビリティ情報が失われる）

## 3. Figmaでの太字・中央揃えの実装方法

### 3.1 太字の実装

**決定**: FigmaのフォントウェイトをboldまたはBold（700）に設定

**根拠**:
- Figma API: `fontWeight`プロパティを使用
- 数値（100-900）または文字列（"Bold", "Medium"など）をサポート

**実装方法**:
```typescript
// テキストノードのfontWeightを設定
textNode.fontWeight = 700; // または "Bold"
```

**技術的制約**:
- フォントファミリーによって利用可能なウェイトが異なる
- デフォルトフォントでboldが利用可能であることを確認済み

### 3.2 中央揃えの実装

**決定**: Figma AutoLayoutのhorizontalAlign="CENTER"を使用

**根拠**:
- Figma AutoLayoutは水平方向の配置をサポート
- `horizontalAlign`プロパティで制御可能
- td要素と同じアプローチを使用

**実装方法**:
```typescript
// AutoLayout設定
config.layoutMode = "HORIZONTAL";
config.primaryAxisAlignItems = "CENTER"; // 水平方向の中央揃え
config.counterAxisAlignItems = "CENTER"; // 垂直方向の中央揃え
```

**代替案検討**:
- テキストノードのtextAlign → 採用（テキスト自体の配置に使用）
- マニュアルでx座標を調整 → 却下（レスポンシブ性が失われる）

## 4. 既存td要素実装の詳細分析

### 4.1 td要素の構造

**分析結果**:

```
src/converter/elements/table/td/
├── index.ts                              # エクスポート定義
├── td-element/
│   ├── index.ts                          # エクスポート
│   ├── td-element.ts                     # TdElement型と変換ロジック
│   └── __tests__/
│       └── td-element.test.ts            # ユニットテスト
├── td-attributes/
│   ├── index.ts                          # エクスポート
│   ├── td-attributes.ts                  # TdAttributes型定義
│   └── __tests__/
│       └── td-attributes.test.ts         # 属性テスト
└── __tests__/
    └── td-integration.test.ts            # 統合テスト
```

**決定**: th要素も同じ構造を採用

**根拠**:
- 一貫性の維持
- テストの組織化が明確
- モジュール性の向上

### 4.2 td要素の変換ロジック

**分析**:

```typescript
TdElement.toFigmaNode(element: TdElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      const config = FigmaNode.createFrame("td");
      return FigmaNodeConfig.applyHtmlElementDefaults(
        config,
        "td",
        el.attributes,
      );
    },
    {
      applyCommonStyles: true,
    },
  );
}
```

**決定**: th要素でも`toFigmaNodeWith`ヘルパーを使用

**根拠**:
- コードの再利用
- 一貫した変換プロセス
- メンテナンス性の向上

**th要素での拡張ポイント**:
- デフォルトスタイル（太字・中央揃え）の追加
- scope属性のノード名への反映

### 4.3 ユーティリティ関数の活用

**分析結果**:

td要素は以下のユーティリティ関数を使用：
1. `toFigmaNodeWith`: 汎用的な変換ロジック
2. `mapToFigmaWith`: 型ガードとファクトリを組み合わせた変換
3. `FigmaNode.createFrame`: Figma Frameノードの作成
4. `FigmaNodeConfig.applyHtmlElementDefaults`: HTML要素のデフォルト設定

**決定**: th要素でも同じユーティリティを使用

**根拠**:
- 既存のベストプラクティスに従う
- コードの重複を避ける
- バグのリスクを減らす

### 4.4 属性定義のパターン

**分析**:

```typescript
export interface TdAttributes extends GlobalAttributes {
  width?: string;
  height?: string;
}
```

**決定**: th要素では追加の属性をサポート

**th要素の属性**:
```typescript
export interface ThAttributes extends GlobalAttributes {
  width?: string;
  height?: string;
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  abbr?: string;
  colspan?: string;
  rowspan?: string;
}
```

**根拠**:
- HTML仕様に従う
- 将来的な拡張性を確保
- アクセシビリティのサポート

## 5. TypeScript型定義のベストプラクティス

### 5.1 型ガードの実装

**決定**: 型ガード関数を実装

```typescript
isThElement(node: unknown): node is ThElement {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    node.type === "element" &&
    node.tagName === "th"
  );
}
```

**根拠**:
- 型安全性の向上
- ランタイムでの型チェック
- エラーの早期発見

### 5.2 コンパニオンオブジェクトパターン

**決定**: td要素と同じコンパニオンオブジェクトパターンを採用

```typescript
export interface ThElement extends BaseElement<"th", ThAttributes> {
  children: ThElement[] | [];
}

export const ThElement = {
  isThElement: (...) => ...,
  create: (...) => ...,
  toFigmaNode: (...) => ...,
  mapToFigma: (...) => ...,
};
```

**根拠**:
- 型と実装の統合
- 名前空間の整理
- 既存パターンとの一貫性

## 6. テスト戦略

### 6.1 ユニットテスト

**決定**: 以下の項目をテスト

1. **型ガード**:
   - 正常なth要素を正しく識別
   - 不正なオブジェクトを拒否

2. **ファクトリメソッド**:
   - デフォルト値で要素を生成
   - 属性を指定して要素を生成

3. **Figma変換**:
   - 基本的な変換が正しく動作
   - scope属性がノード名に反映
   - デフォルトスタイルが適用

### 6.2 統合テスト

**決定**: 実際のHTML要素を変換してFigmaノードを生成

テストケース:
1. 基本的なth要素
2. scope属性付きth要素
3. colspan/rowspan付きth要素
4. カスタムスタイル付きth要素

### 6.3 カバレッジ目標

**決定**: 95%以上のコードカバレッジを維持

**根拠**:
- プロジェクトの品質基準
- 既存実装と同等の品質保証

## 7. 実装上の技術的課題と解決策

### 7.1 デフォルトスタイルの適用タイミング

**課題**: デフォルトスタイルとユーザー指定スタイルの競合

**解決策**:
1. デフォルトスタイルを最初に適用
2. ユーザー指定のスタイル属性で上書き
3. CSSのカスケードルールに従う

**実装**:
```typescript
// 1. デフォルトスタイルを設定
const defaultStyles = {
  fontWeight: "bold",
  textAlign: "center",
};

// 2. ユーザースタイルとマージ
const mergedStyles = {
  ...defaultStyles,
  ...parseUserStyles(element.attributes.style),
};
```

### 7.2 scope属性のFigmaでの表現

**課題**: Figmaにscope概念がない

**解決策**:
- ノード名にscope情報を含める
- 例: `th-col`, `th-row`
- プラグインデータとしても保存（将来の拡張用）

### 7.3 フォントウェイトの互換性

**課題**: フォントによってはboldが利用できない可能性

**解決策**:
1. デフォルトでは数値700を使用
2. フォントが対応していない場合はフォールバック
3. エラーハンドリングを実装

## 8. まとめと次のステップ

### 調査結果のまとめ

1. ✅ th要素とtd要素の違いを明確化
2. ✅ scope属性の実装方針を決定
3. ✅ Figmaでの太字・中央揃え実装方法を確認
4. ✅ 既存td要素実装パターンを分析
5. ✅ テスト戦略を策定

### すべての NEEDS CLARIFICATION が解決されました

- **Language/Version**: TypeScript 5.x (strict mode) ✅
- **Primary Dependencies**: Figma Plugin API, Vitest, 既存ユーティリティ ✅
- **Testing**: Vitest（ユニット + 統合） ✅
- **Target Platform**: Figma Plugin Sandbox ✅
- **Performance Goals**: < 10ms/要素 ✅
- **Constraints**: Sandbox制限、postMessage通信 ✅
- **Scale/Scope**: 1要素、既存パターン再利用 ✅

### 次のフェーズ（Phase 1）への準備完了

Phase 1では以下を作成します：
1. `data-model.md`: データモデルの詳細定義
2. `contracts/`: 型定義とAPI仕様
3. `quickstart.md`: 使用方法のクイックガイド

**すべての技術的な不明点が解決され、Phase 1に進む準備が整いました。**
