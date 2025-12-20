# Feature Specification: tr要素（テーブル行）の実装

**Issue**: [#149](https://github.com/DIO0550/figma-plugin-html-converter/issues/149)
**Status**: In Progress
**Created**: 2025-11-20

## 概要

HTMLのテーブル行要素（`<tr>`）をFigmaのFrameNodeに変換する機能を実装します。tr要素は複数のtd要素（データセル）やth要素（ヘッダーセル）を子要素として持ち、横方向のAuto Layoutで配置します。

## 目的

- テーブルの行を表すtr要素のFigma変換機能を提供
- td要素を横方向に整列させるレイアウトを実現
- テーブルスタイル（border、background-color、padding）のサポート

## 要件

### 機能要件

1. **要素変換**
   - `<tr>` 要素をFigma FrameNodeに変換
   - 横方向（HORIZONTAL）のAuto Layoutで子要素を配置
   - 子要素（TdElement[]）の変換と配置

2. **属性サポート**
   - グローバル属性（id, className, style等）
   - width/height属性（テーブル行のサイズ指定）

3. **スタイリング**
   - border（ボーダー）の変換
   - background-color（背景色）の変換
   - padding（内部余白）の変換

### 非機能要件

1. **テストカバレッジ**
   - 単体テストのカバレッジ90%以上
   - 型ガード、ファクトリメソッド、変換ロジックの包括的なテスト

2. **コード品質**
   - TypeScript strict mode準拠
   - ESLint/型チェックのパス
   - JSDocによるAPIドキュメント完備

3. **パフォーマンス**
   - 変換処理の効率性
   - 不要な再計算の回避

## 技術仕様

### データモデル

#### TrAttributes型
```typescript
interface TrAttributes extends GlobalAttributes {
  width?: string;   // 行の幅（"100px", "50%"等）
  height?: string;  // 行の高さ（"50px", "auto"等）
}
```

#### TrElement型
```typescript
interface TrElement extends BaseElement<"tr", TrAttributes> {
  children: TdElement[] | ThElement[] | [];
}
```

### Figma変換仕様

#### ノード構成
- **Figmaノード**: FrameNode
- **レイアウトモード**: HORIZONTAL（横方向）
- **primaryAxisAlignItems**: MIN（左揃え）
- **counterAxisAlignItems**: MIN（上揃え）
- **itemSpacing**: 0（セル間隔なし、ボーダーで表現）

#### スタイル変換
1. **Border**: strokes配列に変換
2. **Background Color**: fills配列に変換
3. **Padding**: paddingLeft/Right/Top/Bottom に変換

### API設計

#### TrElement Companion Object

```typescript
const TrElement = {
  // 型ガード
  isTrElement(node: unknown): node is TrElement;

  // ファクトリメソッド
  create(attributes?: Partial<TrAttributes>): TrElement;

  // Figma変換
  toFigmaNode(element: TrElement): FigmaNodeConfig;

  // マッピング
  mapToFigma(node: unknown): FigmaNodeConfig | null;
}
```

## 実装範囲

### 含まれるもの
- ✅ TrAttributes型定義
- ✅ TrElement型定義
- ✅ TrElement.create()ファクトリメソッド
- ✅ TrElement.isTrElement()型ガード
- ✅ TrElement.toFigmaNode()変換ロジック
- ✅ TrElement.mapToFigma()マッピング
- ✅ 包括的な単体テスト

### 含まれないもの
- ❌ table要素の実装（別Issue）
- ❌ thead/tbody/tfoot要素の実装（別Issue）
- ❌ colspan/rowspan属性のサポート（将来の拡張）

## 依存関係

### 前提条件
- ✅ td要素の実装が完了していること（Issue #148）
- ✅ th要素の実装が完了していること

### 影響を受けるコンポーネント
- `src/converter/elements/table/index.ts` - エクスポートの追加
- `src/converter/mapper.ts` - 要素マッピングへの追加（将来的に）

## テスト戦略

### 単体テスト
1. **Factory Tests** (`tr-element.factory.test.ts`)
   - デフォルト属性での生成
   - 指定属性での生成
   - width/height属性のテスト

2. **Type Guard Tests** (`tr-element.typeguards.test.ts`)
   - 正常なtr要素の判定
   - 不正なオブジェクトの判定
   - エッジケースの処理

3. **toFigmaNode Tests** (`tr-element.toFigmaNode.test.ts`)
   - 基本的なFrameNode生成
   - Auto Layout設定の検証
   - スタイル適用の検証
   - 子要素（td）の変換と配置

4. **mapToFigma Tests** (`tr-element.mapToFigma.test.ts`)
   - 正常なマッピング
   - 無効な入力の処理

### カバレッジ目標
- ライン: 90%以上
- ブランチ: 85%以上
- 関数: 100%

## 完了条件

- [ ] 全てのテストがパス（グリーン）
- [ ] カバレッジ目標を達成
- [ ] tr要素が正しくFigma FrameNodeに変換される
- [ ] 子要素（td/th）が横方向に配置される
- [ ] スタイル属性が適切に適用される
- [ ] JSDocドキュメントが完備
- [ ] ESLint/型チェックがパス
- [ ] src/converter/elements/table/index.tsにエクスポート追加

## 見積もり

**工数**: 1日

### 内訳
- 型定義とファクトリ実装: 2時間
- 変換ロジック実装: 3時間
- テスト実装: 3時間

## 参考資料

- [MDN: \<tr\> element](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr)
- [Figma Plugin API: FrameNode](https://www.figma.com/plugin-docs/api/FrameNode/)
- Issue #148: td要素の実装
- Issue #126: Phase 1-1 基本テーブル構造の実装
