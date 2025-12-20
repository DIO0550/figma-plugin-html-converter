# Research: テーブルセクション（tbody, tfoot）の実装

**Date**: 2025-11-23
**Status**: Complete

## 概要

tbody/tfoot要素の実装に必要な技術的な調査と決定事項をまとめます。既存のthead要素実装パターンを基に、一貫性のある実装方針を確立します。

## 調査項目

### 1. 既存実装パターンの分析

**調査内容**: thead要素の実装パターンを分析し、tbody/tfootに適用可能か検証

**結果**:
- ✅ thead要素は`BaseElement<"thead", TheadAttributes>`を継承
- ✅ コンパニオンオブジェクトパターンで`create()`, `isXxxElement()`, `toFigmaNode()`, `mapToFigma()`を実装
- ✅ テストは単体テスト（factory, mapToFigma, toFigmaNode, typeguards）と統合テスト（basic, scenarios, styles）に分離
- ✅ Figma変換は`toFigmaNodeWith()`ユーティリティを使用してFrameNodeを生成

**決定**: tbody/tfootもthead要素と同じパターンを踏襲する

**根拠**: コードの一貫性、保守性、学習コストの低減

### 2. HTML仕様の確認

**調査内容**: tbody/tfootのHTML仕様とセマンティクス

**tbody仕様** (https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody):
- テーブルの本体（メインコンテンツ）を表すセクション
- 複数のtr要素を子要素として持つ
- thead、tfootと組み合わせて使用
- 省略可能だが、明示的に記述することでセマンティクスが向上

**tfoot仕様** (https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot):
- テーブルのフッター（集計、合計など）を表すセクション
- 複数のtr要素を子要素として持つ
- HTML5ではtable内のどの位置にも配置可能（レンダリング時は最下部）

**決定**: セマンティクスを尊重し、各セクションを独立したFrameNodeとして実装

**根拠**: HTMLの構造をFigmaで忠実に再現し、デザイナーがセクションごとに編集可能にする

### 3. 子要素の型定義

**調査内容**: tbody/tfootの子要素の型を確認

**thead実装**:
```typescript
interface TheadElement extends BaseElement<"thead", TheadAttributes> {
  children: TrElement[];
}
```

**決定**: tbody/tfootも同じ型定義を使用

```typescript
interface TbodyElement extends BaseElement<"tbody", TbodyAttributes> {
  children: TrElement[];
}

interface TfootElement extends BaseElement<"tfoot", TfootAttributes> {
  children: TrElement[];
}
```

**根拠**: thead/tbody/tfootは全てtr要素のコンテナであり、同じ構造を持つ

### 4. Figma Auto Layout設定

**調査内容**: thead要素のAuto Layout設定を確認

**thead実装**:
```typescript
config.layoutMode = "VERTICAL";
config.primaryAxisAlignItems = "MIN";
config.counterAxisAlignItems = "MIN";
config.itemSpacing = 0;
```

**決定**: tbody/tfootも同じAuto Layout設定を使用

**根拠**: 全てのセクションで子要素（tr）を縦方向に配置する必要がある

### 5. 属性の実装

**調査内容**: thead要素の属性実装を確認

**thead実装**:
- `TheadAttributes`は共通属性（id, class, styleなど）のみを含む
- HTML標準のグローバル属性をサポート

**決定**: tbody/tfootも同様の属性実装

```typescript
export interface TbodyAttributes {
  // 共通のHTML属性
  id?: string;
  class?: string;
  style?: string;
  // その他のグローバル属性
}

export interface TfootAttributes {
  // 共通のHTML属性
  id?: string;
  class?: string;
  style?: string;
  // その他のグローバル属性
}
```

**根拠**: tbody/tfoot要素固有の属性は存在しないため、グローバル属性のみで十分

### 6. テスト戦略

**調査内容**: thead要素のテスト構成を分析

**thead実装のテスト構成**:
1. **単体テスト**:
   - `factory.test.ts`: create()メソッドのテスト
   - `mapToFigma.test.ts`: mapToFigma()メソッドのテスト
   - `toFigmaNode.test.ts`: toFigmaNode()メソッドのテスト
   - `typeguards.test.ts`: 型ガード関数のテスト

2. **統合テスト**:
   - `integration.basic.test.ts`: 基本的な機能のテスト
   - `integration.scenarios.test.ts`: 実用的なシナリオのテスト
   - `integration.styles.test.ts`: スタイル適用のテスト

**決定**: tbody/tfootも同じテスト構成を踏襲し、さらにthead/tbody/tfoot統合テストを追加

**根拠**: 包括的なテストカバレッジと既存パターンとの一貫性

### 7. セクション間の統合

**調査内容**: thead/tbody/tfootを含む完全なテーブル構造の実装方法

**課題**:
- table要素のchildren型が現在`TrElement[]`になっている
- thead/tbody/tfootを子要素として受け入れる必要がある

**決定**:
- 初期実装では既存のtable要素の型定義を変更しない
- tbody/tfootを独立した要素として実装
- 将来的にtable要素の型定義を拡張（別Issue）

**根拠**:
- 既存実装への影響を最小化
- 段階的な拡張により安全性を確保
- tbody/tfoot単独でも有用

### 8. ベストプラクティス

**調査内容**: TypeScript + Vitestのベストプラクティス

**適用するベストプラクティス**:
1. **型安全性**:
   - strict mode有効
   - 明示的な型アノテーション
   - 適切な型ガード関数

2. **テスト**:
   - TDD（テスト駆動開発）
   - テストの独立性（各テストは他のテストに依存しない）
   - Arrange-Act-Assert パターン

3. **コード品質**:
   - ESLintルールの遵守
   - DRY（Don't Repeat Yourself）原則
   - 単一責任の原則

**決定**: これらのベストプラクティスを全て適用

**根拠**: 既存コードベースとの整合性、保守性の向上

## 技術的決定のまとめ

### 決定1: 実装パターン

**選択**: thead要素と同じパターンを踏襲

**理由**:
- コードの一貫性
- 学習コストの低減
- 保守性の向上

**代替案**:
- 新しいパターンの導入 → 却下（一貫性が失われる）
- 全セクションを統合したクラス → 却下（責任の分離が不明確）

### 決定2: 型定義

**選択**: `BaseElement<"tbody"|"tfoot", Attributes>`を継承

**理由**:
- 既存の型システムとの整合性
- 型安全性の確保
- 再利用性

**代替案**:
- 独自の型定義 → 却下（車輪の再発明）

### 決定3: Figma変換

**選択**: FrameNodeとして変換、VERTICAL Auto Layout

**理由**:
- HTMLのセマンティクスとの対応
- tr要素の縦方向配置の必要性
- 既存のthead実装との一貫性

**代替案**:
- Groupとして実装 → 却下（Auto Layoutが使えない）
- セクションを結合 → 却下（編集性が低下）

### 決定4: テスト戦略

**選択**: 単体テスト + 統合テスト + セクション間統合テスト

**理由**:
- 包括的なカバレッジ
- リグレッションの防止
- TDDの実践

**代替案**:
- 統合テストのみ → 却下（問題の特定が困難）
- 最小限のテスト → 却下（品質基準を満たさない）

## 未解決の課題

なし（全ての技術的な疑問点が解決されました）

## 次のステップ

Phase 1（設計フェーズ）に進み、以下を実施:
1. data-model.mdの作成
2. contracts/の作成（該当する場合）
3. quickstart.mdの作成
4. Agent contextの更新
