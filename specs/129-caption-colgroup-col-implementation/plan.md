# Implementation Plan: Caption, Colgroup, Col 要素の実装

**Branch**: `129-caption-colgroup-col-implementation` | **Date**: 2025-11-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/129-caption-colgroup-col-implementation/spec.md`

## Summary

テーブルキャプション（caption）とカラムグループ（colgroup, col）要素のFigma変換機能を実装します。captionはFrameNodeとして変換し、colgroup/colはメタデータとして処理して列幅情報をセルに適用します。

## Technical Context

**Language/Version**: TypeScript 5.4.3 (strict mode有効)
**Primary Dependencies**: Figma Plugin API
**Storage**: N/A（Figmaプラグイン、ローカルストレージのみ）
**Testing**: Vitest 3.2.4
**Target Platform**: Figma Desktop App（プラグイン実行環境）
**Project Type**: Single project - Figma Plugin
**Performance Goals**: 100行×10列のテーブルでも許容範囲内の処理速度
**Constraints**: Figma Auto Layoutの制約内で列幅を制御
**Scale/Scope**: 既存テーブル要素（table, tr, td, th, thead, tbody, tfoot）との統合

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| TDD (Test-First) | ✅ PASS | テストを先に書いてから実装 |
| 既存パターン準拠 | ✅ PASS | thead/tbody/tfootと同じ構造 |
| JSDoc完備 | ✅ PASS | 全パブリックAPIにドキュメント |
| カバレッジ90%以上 | ✅ PASS | 目標として設定 |
| npx使用禁止 | ✅ PASS | npm run scriptsのみ使用 |
| ESLint無効化禁止 | ✅ PASS | 設定変更で対応 |

## Project Structure

### Documentation (this feature)

```text
specs/129-caption-colgroup-col-implementation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── element-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/converter/elements/table/
├── caption/
│   ├── index.ts
│   ├── caption-attributes/
│   │   ├── index.ts
│   │   ├── caption-attributes.ts
│   │   └── __tests__/
│   │       └── caption-attributes.test.ts
│   ├── caption-element/
│   │   ├── index.ts
│   │   ├── caption-element.ts
│   │   └── __tests__/
│   │       ├── caption-element.factory.test.ts
│   │       ├── caption-element.typeguards.test.ts
│   │       ├── caption-element.toFigmaNode.test.ts
│   │       └── caption-element.mapToFigma.test.ts
│   └── __tests__/
│       ├── caption-integration.basic.test.ts
│       └── caption-integration.styles.test.ts
├── colgroup/
│   ├── index.ts
│   ├── colgroup-attributes/
│   │   ├── index.ts
│   │   ├── colgroup-attributes.ts
│   │   └── __tests__/
│   │       └── colgroup-attributes.test.ts
│   ├── colgroup-element/
│   │   ├── index.ts
│   │   ├── colgroup-element.ts
│   │   └── __tests__/
│   │       ├── colgroup-element.factory.test.ts
│   │       ├── colgroup-element.typeguards.test.ts
│   │       └── colgroup-element.mapToFigma.test.ts
│   └── __tests__/
│       └── colgroup-integration.test.ts
├── col/
│   ├── index.ts
│   ├── col-attributes/
│   │   ├── index.ts
│   │   ├── col-attributes.ts
│   │   └── __tests__/
│   │       └── col-attributes.test.ts
│   ├── col-element/
│   │   ├── index.ts
│   │   ├── col-element.ts
│   │   └── __tests__/
│   │       ├── col-element.factory.test.ts
│   │       ├── col-element.typeguards.test.ts
│   │       └── col-element.mapToFigma.test.ts
│   └── __tests__/
│       └── col-integration.test.ts
├── __tests__/
│   └── table-caption-col-integration.test.ts  # 新規追加
└── index.ts  # エクスポート追加
```

**Structure Decision**: 既存のテーブル要素（thead, tbody, tfoot）と同じディレクトリ構造を採用。各要素ごとに attributes と element のサブディレクトリを持ち、テストは `__tests__` ディレクトリに配置。

## Implementation Phases

### Phase 1: Caption要素の実装 (優先度: 高)

1. caption-attributes.ts の作成
2. caption-element.ts の作成（型ガード、ファクトリ、Figma変換）
3. 単体テスト作成
4. 統合テスト作成

**成果物**:
- `src/converter/elements/table/caption/` ディレクトリ一式
- カバレッジ90%以上

### Phase 2: Col要素の実装 (優先度: 中)

1. col-attributes.ts の作成（span, width属性）
2. col-element.ts の作成（メタデータ要素）
3. 単体テスト作成
4. ユーティリティ関数（getSpan, getWidth）

**成果物**:
- `src/converter/elements/table/col/` ディレクトリ一式
- カバレッジ90%以上

### Phase 3: Colgroup要素の実装 (優先度: 中)

1. colgroup-attributes.ts の作成（span属性）
2. colgroup-element.ts の作成（col要素のコンテナ）
3. 単体テスト作成
4. ユーティリティ関数（getColumnCount）

**成果物**:
- `src/converter/elements/table/colgroup/` ディレクトリ一式
- カバレッジ90%以上

### Phase 4: 統合 (優先度: 高)

1. table/index.ts のエクスポート更新
2. 統合テスト作成（caption + colgroup/col + table）
3. 列幅情報のセルへの適用ロジック（必要に応じて）

**成果物**:
- `table-caption-col-integration.test.ts`
- 更新された `table/index.ts`

## Complexity Tracking

特になし - 既存パターンに準拠した実装のため、複雑性の追加はありません。

## Dependencies

- 既存の `BaseElement` 型
- 既存の `GlobalAttributes` 型
- 既存の `FigmaNodeConfig`, `FigmaNode` モデル
- 既存のユーティリティ関数（`mapToFigmaWith`, `toFigmaNodeWith`）

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Auto Layoutでの列幅制御の制限 | Medium | Medium | 代替アプローチを事前に検討済み |
| caption-side: bottom の実装複雑度 | Low | Low | 既存のAuto Layout順序制御で対応可能 |

## Next Steps

1. `/speckit.tasks` コマンドで tasks.md を生成
2. TDDで Phase 1 (Caption) から実装開始
3. 各フェーズ完了後に品質チェック（test, lint, type-check）
