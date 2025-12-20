# Implementation Plan: Table Header Element (th)

**Branch**: `001-table-header-element` | **Date**: 2025-11-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-table-header-element/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

HTMLの`<th>`要素（テーブルヘッダーセル）をFigmaノードに変換する機能を実装します。既存のtd要素実装パターンを踏襲しつつ、th要素固有の特性（太字、中央揃え、scope属性など）をサポートします。TDD（テスト駆動開発）を徹底し、既存のユーティリティ関数を活用して型安全性と保守性の高い実装を目指します。

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode有効)
**Primary Dependencies**:
- Figma Plugin API
- Vitest (テストフレームワーク)
- 既存ユーティリティ: `element-utils`, `to-figma-node-with`

**Storage**: N/A（インメモリ変換）
**Testing**: Vitest（ユニットテスト + 統合テスト）
**Target Platform**: Figma Plugin Sandbox環境
**Project Type**: Single project（Figma Plugin）
**Performance Goals**:
- 要素変換: < 10ms/要素
- メモリ使用: 既存実装と同等

**Constraints**:
- Figmaプラグインサンドボックス環境の制限
- ブラウザDOM API使用不可
- postMessageベースのUI通信

**Scale/Scope**:
- 1つの新規HTML要素サポート（th）
- 既存パターンの再利用
- コードカバレッジ95%以上維持

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Test-First Development (NON-NEGOTIABLE)
- **Status**: 準拠
- **Plan**: TDDサイクルを厳格に適用
  1. テストケース定義
  2. 失敗するテストを作成
  3. 最小限の実装
  4. リファクタリング

### ✅ II. Type Safety First
- **Status**: 準拠
- **Plan**:
  - strict mode有効
  - 型ガード関数の実装
  - any型の使用禁止

### ✅ III. Modular Architecture
- **Status**: 準拠
- **Plan**:
  - th要素専用ディレクトリ構造
  - 属性、要素、変換ロジックの分離
  - 既存ユーティリティの活用

### ✅ IV. Consistency with Existing Patterns
- **Status**: 準拠
- **Plan**:
  - td要素と同じディレクトリ構造
  - 同じ命名規則とコーディングスタイル
  - 同じユーティリティ関数の使用

### ✅ V. Documentation and Clarity
- **Status**: 準拠
- **Plan**:
  - JSDocコメント完備
  - 詳細な型定義
  - 実装コメント追加

### Quality Gates

#### Pre-Implementation
- [x] spec.md作成完了
- [ ] research.md作成（Phase 0で実施）
- [ ] data-model.md作成（Phase 1で実施）

#### Implementation
- [ ] テストファースト実施
- [ ] 小さなステップでの実装
- [ ] リファクタリング実施

#### Pre-Commit
- [ ] `npm run test` パス
- [ ] `npm run lint` エラーなし
- [ ] `npm run type-check` エラーなし
- [ ] コードカバレッジ95%以上

## Project Structure

### Documentation (this feature)

```text
specs/001-table-header-element/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (pending)
├── data-model.md        # Phase 1 output (pending)
├── quickstart.md        # Phase 1 output (pending)
└── contracts/           # Phase 1 output (pending)
```

### Source Code (repository root)

```text
src/converter/elements/table/
├── th/                              # 新規作成
│   ├── index.ts                     # エクスポート定義
│   ├── th-element/
│   │   ├── index.ts
│   │   ├── th-element.ts            # ThElement型と変換ロジック
│   │   └── __tests__/
│   │       └── th-element.test.ts   # ユニットテスト
│   ├── th-attributes/
│   │   ├── index.ts
│   │   ├── th-attributes.ts         # ThAttributes型定義
│   │   └── __tests__/
│   │       └── th-attributes.test.ts
│   └── __tests__/
│       └── th-integration.test.ts   # 統合テスト
├── td/                              # 既存（参考実装）
│   └── ...
└── index.ts                         # th要素のエクスポート追加

# 既存の依存関係
src/
├── converter/
│   ├── elements/
│   │   └── base/                    # BaseElement, GlobalAttributes
│   ├── models/
│   │   └── figma-node/              # FigmaNode, FigmaNodeConfig
│   └── utils/
│       ├── element-utils.ts         # mapToFigmaWith
│       └── to-figma-node-with.ts    # toFigmaNodeWith
└── types.ts
```

**Structure Decision**:
- Single project構造を採用
- 既存のtable/td/パターンを踏襲してtable/th/を作成
- 共通ユーティリティは既存のutilsを活用
- テストは`__tests__`ディレクトリに配置

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | すべてのConstitution原則に準拠 | - |

---

## Phase 0: Research & Investigation (Pending)

このフェーズでは、以下を調査・文書化します：

### 調査項目
1. th要素とtd要素の違い（セマンティクス、デフォルトスタイル）
2. scope属性の仕様と実装方法
3. Figmaでの太字・中央揃えの実装方法
4. 既存td要素実装の詳細分析

### 成果物
- `research.md`: 調査結果と技術的決定事項の記録

---

## Phase 1: Design & Contracts (Pending)

このフェーズでは、以下を設計・生成します：

### データモデル設計
1. ThAttributes型の詳細定義
2. ThElement型の詳細定義
3. FigmaNodeConfigへのマッピング定義

### API契約
1. 型定義のエクスポート
2. 公開APIの仕様
3. ユーティリティ関数のインターフェース

### 成果物
- `data-model.md`: データモデルの詳細定義
- `contracts/`: 型定義とAPI仕様
- `quickstart.md`: 使用方法のクイックガイド

---

## Phase 2: Implementation Plan (Not created by /speckit.plan)

このフェーズは `/speckit.tasks` コマンドで `tasks.md` を生成します。

### 実装ステップ（概要）
1. ThAttributes型の実装とテスト
2. ThElement型の実装とテスト
3. toFigmaNode関数の実装とテスト
4. 統合テストの実装
5. ドキュメントの完成

---

## Next Steps

1. ✅ Spec作成完了
2. ✅ Constitution定義完了
3. ✅ Plan作成完了
4. ✅ Phase 0: research.mdの作成完了
5. ✅ Phase 1: data-model.md、contracts/、quickstart.mdの作成完了
6. ⏳ Phase 2: tasks.mdの生成（別コマンド `/speckit.tasks` で実行）

**このドキュメントの完成により、`/speckit.plan`コマンドの実行は完了しました。**

## 成果物サマリー

### Phase 0: Research & Investigation ✅

- ✅ [`research.md`](./research.md)
  - th要素とtd要素の違いを明確化
  - scope属性の実装方針を決定
  - Figmaでの太字・中央揃え実装方法を確認
  - 既存td要素実装パターンを分析
  - テスト戦略を策定
  - すべてのNEEDS CLARIFICATIONを解決

### Phase 1: Design & Contracts ✅

- ✅ [`data-model.md`](./data-model.md)
  - ThAttributes型の詳細定義
  - ThElement型の詳細定義
  - バリデーションルールの定義
  - Figma変換モデルの定義

- ✅ [`contracts/th-element-api.md`](./contracts/th-element-api.md)
  - 公開API契約の定義
  - メソッドシグネチャとコントラクト
  - エラーハンドリング規約
  - テストカバレッジ要件

- ✅ [`quickstart.md`](./quickstart.md)
  - 基本的な使用方法のガイド
  - よくある使用例
  - ベストプラクティス
  - トラブルシューティング

### 次のステップ

実装を開始するには、以下のコマンドを実行してください：

```bash
/speckit.tasks
```

これにより、`tasks.md` が生成され、実装タスクが依存関係順に整理されます。
