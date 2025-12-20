# Implementation Plan: table要素の実装

**Branch**: `150-table-element-implementation` | **Date**: 2025-11-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/150-table-element-implementation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

HTMLのtable要素をFigmaのFrameNodeに変換する機能を実装します。縦方向のAuto Layoutで複数のtr要素（行）を配置し、既存のtd/tr要素と組み合わせて完全なテーブル構造を表現します。既存のdiv/tr/td要素と同じコンパニオンオブジェクトパターンを使用し、toFigmaNodeWith/mapToFigmaWithユーティリティで実装します。

## Technical Context

**Language/Version**: TypeScript 5.4.3 (strict mode有効)
**Primary Dependencies**: Figma Plugin API、Vitest 3.2.4
**Storage**: N/A (Figmaプラグイン、ローカルストレージのみ)
**Testing**: Vitest (単体テスト・統合テスト)
**Target Platform**: Figma Desktop App (プラグインサンドボックス環境)
**Project Type**: single (Figmaプラグイン)
**Performance Goals**: リアルタイム変換 (<1秒でFigmaノード生成)
**Constraints**: Figmaプラグインサンドボックス制約、メモリ使用最小化
**Scale/Scope**: 単一table要素実装、既存tr/td要素との統合

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 開発原則の遵守

✅ **TDD（テスト駆動開発）**
- テストファーストで実装
- Red-Green-Refactorサイクル
- 全テストは`npm test`で確認

✅ **TypeScript Strict Mode**
- TypeScript 5.4.3 strict mode有効
- `any`の使用禁止
- 型安全性の確保

✅ **コーディング規約**
- ESLint/Prettier準拠
- コンパニオンオブジェクトパターン使用
- 早期returnによるネスト削減
- マジックナンバー禁止（定数化）

✅ **既存パターンへの準拠**
- td、tr、div要素と同じ実装パターン
- `toFigmaNodeWith`/`mapToFigmaWith`ユーティリティ使用
- `FigmaNodeConfig.applyHtmlElementDefaults`使用

### 品質ゲート

✅ **テストカバレッジ**: 90%以上を維持
✅ **Lint**: `npm run lint`がパス
✅ **型チェック**: `npm run type-check`がパス
✅ **ビルド**: エラーなく完了

### 違反なし

この実装は既存パターンに従うため、新たな複雑性の導入はありません。

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
├── table-element/
│   ├── table-element.ts           # TableElement実装
│   ├── __tests__/
│   │   ├── table-element.factory.test.ts
│   │   ├── table-element.typeguards.test.ts
│   │   ├── table-element.toFigmaNode.test.ts
│   │   └── table-element.mapToFigma.test.ts
│   └── index.ts
├── table-attributes/
│   ├── table-attributes.ts        # TableAttributes型定義
│   ├── __tests__/
│   │   └── table-attributes.test.ts
│   └── index.ts
├── tr/                            # 既存（依存）
├── td/                            # 既存（依存）
├── th/                            # 既存（依存）
└── index.ts                       # table関連要素のエクスポート

src/converter/
├── models/
│   ├── figma-node/                # 既存（使用）
│   └── styles/                    # 既存（使用）
└── utils/
    ├── element-utils.ts           # 既存（使用: mapToFigmaWith）
    └── to-figma-node-with.ts      # 既存（使用: toFigmaNodeWith）
```

**Structure Decision**:
既存のtable要素ディレクトリ配下に、table-element/とtable-attributes/を追加します。
これにより、tr/td/th要素と同じ階層で管理され、table/index.tsで一括エクスポートします。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
