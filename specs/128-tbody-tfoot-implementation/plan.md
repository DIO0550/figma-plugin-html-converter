# Implementation Plan: テーブルセクション（tbody, tfoot）の実装

**Branch**: `128-tbody-tfoot-implementation` | **Date**: 2025-11-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/128-tbody-tfoot-implementation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

HTMLテーブルのセクション要素（tbody, tfoot）をFigma FrameNodeに変換する機能を実装します。既存のthead要素実装と同様のパターンで、TbodyElementとTfootElementを作成し、テーブル構造の完全サポートを実現します。TDD（テスト駆動開発）により、高いコードカバレッジと信頼性を確保します。

## Technical Context

**Language/Version**: TypeScript 5.4.3 (strict mode有効)
**Primary Dependencies**: Figma Plugin API、Vitest 3.2.4
**Storage**: N/A (Figmaプラグイン、ローカルストレージのみ)
**Testing**: Vitest 3.2.4（単体テスト、統合テスト、カバレッジ）
**Target Platform**: Figma Desktop App（サンドボックス環境）
**Project Type**: single（Figmaプラグイン）
**Performance Goals**: 大量の行を含むテーブルでも適切に動作（具体的な数値目標は既存実装に準拠）
**Constraints**: Figmaサンドボックス環境の制限内で動作、カバレッジ90%以上維持
**Scale/Scope**: 既存のtable要素実装に2つの新しいセクション要素を追加（tbody, tfoot）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ TDD（テスト駆動開発）- 必須原則

**Status**: PASS ✓

**要件**:
- テストファースト: 実装前に必ずテストを書く
- Red-Green-Refactor: テスト失敗 → 実装 → リファクタリングの順序を守る
- カバレッジ90%以上を維持

**この機能での遵守**:
- tbody/tfoot要素の実装は既存のthead要素と同じTDDパターンに従う
- 単体テスト、統合テストを先に記述してから実装
- 既存のテストスイート（table要素関連）への影響も検証

### ✅ 型安全性

**Status**: PASS ✓

**要件**:
- TypeScript strict モード有効
- 適切な型定義とインターフェース
- 型ガード関数の実装

**この機能での遵守**:
- TbodyElement/TfootElementインターフェースを適切に定義
- BaseElement継承による型安全性の確保
- 既存パターンに準拠した型ガード実装

### ✅ コード品質

**Status**: PASS ✓

**要件**:
- ESLint による静的解析
- 適切なエラーハンドリング
- 既存コードスタイルとパターンへの準拠

**この機能での遵守**:
- thead要素実装と同じパターンを踏襲
- 一貫性のあるコードスタイル
- テストなしでのコード追加は禁止

### ✅ ドキュメント

**Status**: PASS ✓

**要件**:
- JSDocによるAPIドキュメント
- 使用例の提供
- 実装ガイドラインの更新

**この機能での遵守**:
- 全ての公開API にJSDocコメント
- 統合テスト内に使用例を含める
- quickstart.mdに使用方法を記載

**Constitution Gate Result**: ✅ PASS - Phase 0に進行可能

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/converter/elements/table/
├── tbody/
│   ├── index.ts                                    # エクスポート集約
│   ├── tbody-attributes/
│   │   ├── index.ts
│   │   ├── tbody-attributes.ts                     # 属性型定義
│   │   └── __tests__/
│   │       └── tbody-attributes.test.ts
│   ├── tbody-element/
│   │   ├── index.ts
│   │   ├── tbody-element.ts                        # 要素実装
│   │   └── __tests__/
│   │       ├── tbody-element.factory.test.ts       # create()テスト
│   │       ├── tbody-element.mapToFigma.test.ts    # mapToFigma()テスト
│   │       ├── tbody-element.toFigmaNode.test.ts   # toFigmaNode()テスト
│   │       └── tbody-element.typeguards.test.ts    # isTbodyElement()テスト
│   └── __tests__/
│       ├── tbody-integration.basic.test.ts         # 基本統合テスト
│       ├── tbody-integration.scenarios.test.ts     # シナリオテスト
│       └── tbody-integration.styles.test.ts        # スタイルテスト
│
├── tfoot/
│   ├── index.ts                                    # エクスポート集約
│   ├── tfoot-attributes/
│   │   ├── index.ts
│   │   ├── tfoot-attributes.ts                     # 属性型定義
│   │   └── __tests__/
│   │       └── tfoot-attributes.test.ts
│   ├── tfoot-element/
│   │   ├── index.ts
│   │   ├── tfoot-element.ts                        # 要素実装
│   │   └── __tests__/
│   │       ├── tfoot-element.factory.test.ts       # create()テスト
│   │       ├── tfoot-element.mapToFigma.test.ts    # mapToFigma()テスト
│   │       ├── tfoot-element.toFigmaNode.test.ts   # toFigmaNode()テスト
│   │       └── tfoot-element.typeguards.test.ts    # isTfootElement()テスト
│   └── __tests__/
│       ├── tfoot-integration.basic.test.ts         # 基本統合テスト
│       ├── tfoot-integration.scenarios.test.ts     # シナリオテスト
│       └── tfoot-integration.styles.test.ts        # スタイルテスト
│
├── __tests__/
│   └── table-sections-integration.test.ts          # thead/tbody/tfoot統合テスト
│
└── index.ts                                        # tbody/tfootエクスポート追加
```

**Structure Decision**: 既存のthead要素と同じディレクトリ構造を踏襲します。単一プロジェクト構成で、各要素ごとに属性（attributes）と要素本体（element）を分離し、それぞれに独立したテストスイートを配置します。統合テストは要素ルートの`__tests__/`に配置し、セクション間の連携をテストします。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Phase Completion Log

### Phase 0: Outline & Research ✅

**Status**: COMPLETED
**Date**: 2025-11-23

**Outputs**:
- ✅ research.md - 技術的調査と決定事項

**Key Findings**:
- thead要素と同じパターンを踏襲することを決定
- BaseElement継承、コンパニオンオブジェクトパターンを採用
- TDD、型安全性、高カバレッジを維持

### Phase 1: Design & Contracts ✅

**Status**: COMPLETED
**Date**: 2025-11-23

**Outputs**:
- ✅ data-model.md - データモデル定義
- ✅ contracts/ - 契約ディレクトリ（README.mdのみ）
- ✅ quickstart.md - クイックスタートガイド
- ✅ CLAUDE.md - Agent context更新済み

**Key Design Decisions**:
- TbodyElement/TfootElement インターフェース定義
- BaseElement<"tbody"|"tfoot", Attributes>継承
- TrElement[]を子要素として保持
- Figma FrameNode変換（VERTICAL Auto Layout）

**Constitution Re-check**: ✅ PASS

全てのConstitution要件を満たしています:
- ✅ TDD原則に従った設計
- ✅ TypeScript strict mode対応
- ✅ 既存パターンとの一貫性
- ✅ 包括的なドキュメント

### Phase 2: Tasks Generation

**Status**: NOT STARTED
**Note**: Phase 2は `/speckit.tasks` コマンドで実行されます。

**Expected Output**:
- tasks.md - 実装タスクの詳細リスト

## Next Steps

1. **タスク生成**: `/speckit.tasks` コマンドを実行してtasks.mdを生成
2. **実装開始**: TDDに従ってtbody要素から実装
3. **テスト実行**: 各ステップでテストを確認
4. **レビュー**: 完了後にコードレビュー

## Summary

Phase 0とPhase 1が正常に完了しました。以下のアーティファクトが生成されています:

**Phase 0 Outputs**:
- `/workspace/specs/128-tbody-tfoot-implementation/research.md`

**Phase 1 Outputs**:
- `/workspace/specs/128-tbody-tfoot-implementation/data-model.md`
- `/workspace/specs/128-tbody-tfoot-implementation/contracts/README.md`
- `/workspace/specs/128-tbody-tfoot-implementation/quickstart.md`
- `/workspace/CLAUDE.md` (updated)

**Branch**: `128-tbody-tfoot-implementation`

次は `/speckit.tasks` コマンドでPhase 2（実装タスクの生成）に進んでください。
