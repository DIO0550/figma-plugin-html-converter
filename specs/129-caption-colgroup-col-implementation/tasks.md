# Tasks: Caption, Colgroup, Col 要素の実装

**Input**: Design documents from `/specs/129-caption-colgroup-col-implementation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD必須（Constitution Checkで指定）- テストを先に書いてから実装

**Organization**: 機能要件（FR-1〜FR-4）ごとにタスクを整理

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: 対応する機能要件（FR1, FR2, FR3, FR4）
- 正確なファイルパスを含む

## Path Conventions

- **Project Type**: Single project - Figma Plugin
- **Source**: `src/converter/elements/table/`
- **Tests**: 各ディレクトリ内の `__tests__/`

---

## Phase 1: Setup (共有インフラストラクチャ)

**Purpose**: ディレクトリ構造の作成と基本設定

- [ ] T001 caption要素のディレクトリ構造を作成: `src/converter/elements/table/caption/`, `caption-attributes/`, `caption-element/`, `__tests__/`
- [ ] T002 [P] col要素のディレクトリ構造を作成: `src/converter/elements/table/col/`, `col-attributes/`, `col-element/`, `__tests__/`
- [ ] T003 [P] colgroup要素のディレクトリ構造を作成: `src/converter/elements/table/colgroup/`, `colgroup-attributes/`, `colgroup-element/`, `__tests__/`

---

## Phase 2: Foundational (基盤タスク)

**Purpose**: 全機能要件で共通して必要な基盤コンポーネント

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの作業は開始できません

- [ ] T004 [P] caption/index.ts エクスポートファイルを作成: `src/converter/elements/table/caption/index.ts`
- [ ] T005 [P] col/index.ts エクスポートファイルを作成: `src/converter/elements/table/col/index.ts`
- [ ] T006 [P] colgroup/index.ts エクスポートファイルを作成: `src/converter/elements/table/colgroup/index.ts`
- [ ] T007 [P] caption-attributes/index.ts エクスポートファイルを作成: `src/converter/elements/table/caption/caption-attributes/index.ts`
- [ ] T008 [P] col-attributes/index.ts エクスポートファイルを作成: `src/converter/elements/table/col/col-attributes/index.ts`
- [ ] T009 [P] colgroup-attributes/index.ts エクスポートファイルを作成: `src/converter/elements/table/colgroup/colgroup-attributes/index.ts`
- [ ] T010 [P] caption-element/index.ts エクスポートファイルを作成: `src/converter/elements/table/caption/caption-element/index.ts`
- [ ] T011 [P] col-element/index.ts エクスポートファイルを作成: `src/converter/elements/table/col/col-element/index.ts`
- [ ] T012 [P] colgroup-element/index.ts エクスポートファイルを作成: `src/converter/elements/table/colgroup/colgroup-element/index.ts`

**Checkpoint**: 基盤準備完了 - 機能要件の実装を開始可能

---

## Phase 3: FR-1 Caption要素の変換 (Priority: P1) 🎯 MVP

**Goal**: caption要素をFigma FrameNodeに変換し、テーブルの上部/下部に配置

**Independent Test**: `npm run test -- --run src/converter/elements/table/caption/`

### Tests for FR-1 (TDD: 先にテストを書く)

- [ ] T013 [P] [FR1] caption-attributes型テストを作成: `src/converter/elements/table/caption/caption-attributes/__tests__/caption-attributes.test.ts`
- [ ] T014 [P] [FR1] caption-element.factory テストを作成: `src/converter/elements/table/caption/caption-element/__tests__/caption-element.factory.test.ts`
- [ ] T015 [P] [FR1] caption-element.typeguards テストを作成: `src/converter/elements/table/caption/caption-element/__tests__/caption-element.typeguards.test.ts`
- [ ] T016 [P] [FR1] caption-element.toFigmaNode テストを作成: `src/converter/elements/table/caption/caption-element/__tests__/caption-element.toFigmaNode.test.ts`
- [ ] T017 [P] [FR1] caption-element.mapToFigma テストを作成: `src/converter/elements/table/caption/caption-element/__tests__/caption-element.mapToFigma.test.ts`

### Implementation for FR-1

- [ ] T018 [FR1] CaptionAttributes インターフェースを実装: `src/converter/elements/table/caption/caption-attributes/caption-attributes.ts`
- [ ] T019 [FR1] CaptionElement 型定義とコンパニオンオブジェクトを実装: `src/converter/elements/table/caption/caption-element/caption-element.ts`

### Integration Tests for FR-1

- [ ] T020 [P] [FR1] caption統合テスト（基本）を作成: `src/converter/elements/table/caption/__tests__/caption-integration.basic.test.ts`
- [ ] T021 [P] [FR1] caption統合テスト（スタイル）を作成: `src/converter/elements/table/caption/__tests__/caption-integration.styles.test.ts`

**Checkpoint**: Caption要素が独立して機能し、テスト可能な状態

---

## Phase 4: FR-3 Col要素の処理 (Priority: P2)

**Goal**: col要素をパースし、span/width属性を処理してメタデータとして保持

**Independent Test**: `npm run test -- --run src/converter/elements/table/col/`

### Tests for FR-3 (TDD: 先にテストを書く)

- [ ] T022 [P] [FR3] col-attributes型テストを作成: `src/converter/elements/table/col/col-attributes/__tests__/col-attributes.test.ts`
- [ ] T023 [P] [FR3] col-element.factory テストを作成: `src/converter/elements/table/col/col-element/__tests__/col-element.factory.test.ts`
- [ ] T024 [P] [FR3] col-element.typeguards テストを作成: `src/converter/elements/table/col/col-element/__tests__/col-element.typeguards.test.ts`
- [ ] T025 [P] [FR3] col-element.mapToFigma テストを作成: `src/converter/elements/table/col/col-element/__tests__/col-element.mapToFigma.test.ts`

### Implementation for FR-3

- [ ] T026 [FR3] ColAttributes インターフェースを実装（span, width属性）: `src/converter/elements/table/col/col-attributes/col-attributes.ts`
- [ ] T027 [FR3] ColElement 型定義とコンパニオンオブジェクトを実装（getSpan, getWidth含む）: `src/converter/elements/table/col/col-element/col-element.ts`

### Integration Tests for FR-3

- [ ] T028 [FR3] col統合テストを作成: `src/converter/elements/table/col/__tests__/col-integration.test.ts`

**Checkpoint**: Col要素が独立して機能し、テスト可能な状態

---

## Phase 5: FR-2 Colgroup要素の処理 (Priority: P3)

**Goal**: colgroup要素をパースし、子col要素を収集、span属性を処理

**Independent Test**: `npm run test -- --run src/converter/elements/table/colgroup/`

**Dependencies**: FR-3 (Col要素) の完了が必要（ColgroupはColを子として持つ）

### Tests for FR-2 (TDD: 先にテストを書く)

- [ ] T029 [P] [FR2] colgroup-attributes型テストを作成: `src/converter/elements/table/colgroup/colgroup-attributes/__tests__/colgroup-attributes.test.ts`
- [ ] T030 [P] [FR2] colgroup-element.factory テストを作成: `src/converter/elements/table/colgroup/colgroup-element/__tests__/colgroup-element.factory.test.ts`
- [ ] T031 [P] [FR2] colgroup-element.typeguards テストを作成: `src/converter/elements/table/colgroup/colgroup-element/__tests__/colgroup-element.typeguards.test.ts`
- [ ] T032 [P] [FR2] colgroup-element.mapToFigma テストを作成: `src/converter/elements/table/colgroup/colgroup-element/__tests__/colgroup-element.mapToFigma.test.ts`

### Implementation for FR-2

- [ ] T033 [FR2] ColgroupAttributes インターフェースを実装（span属性）: `src/converter/elements/table/colgroup/colgroup-attributes/colgroup-attributes.ts`
- [ ] T034 [FR2] ColgroupElement 型定義とコンパニオンオブジェクトを実装（getColumnCount含む）: `src/converter/elements/table/colgroup/colgroup-element/colgroup-element.ts`

### Integration Tests for FR-2

- [ ] T035 [FR2] colgroup統合テストを作成: `src/converter/elements/table/colgroup/__tests__/colgroup-integration.test.ts`

**Checkpoint**: Colgroup要素が独立して機能し、テスト可能な状態

---

## Phase 6: FR-4 統合 (Priority: P1)

**Goal**: table要素へのエクスポート追加、caption/colgroup/colの統合テスト

**Independent Test**: `npm run test -- --run src/converter/elements/table/__tests__/table-caption-col-integration.test.ts`

**Dependencies**: FR-1, FR-2, FR-3 の完了が必要

### Tests for FR-4 (TDD: 先にテストを書く)

- [ ] T036 [FR4] table-caption-col 統合テストを作成: `src/converter/elements/table/__tests__/table-caption-col-integration.test.ts`

### Implementation for FR-4

- [ ] T037 [FR4] table/index.ts にCaption, Colgroup, Colのエクスポートを追加: `src/converter/elements/table/index.ts`

**Checkpoint**: 全要素が統合され、テーブル全体として機能する状態

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 品質保証と最終チェック

- [ ] T038 全テスト実行と品質チェック: `npm run test && npm run lint && npm run type-check`
- [ ] T039 カバレッジ確認（90%以上）: `npm run coverage -- --run src/converter/elements/table/caption/ src/converter/elements/table/col/ src/converter/elements/table/colgroup/`
- [ ] T040 JSDoc完備確認: 全パブリックAPIにドキュメントがあることを確認

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - 即座に開始可能
- **Foundational (Phase 2)**: Setup完了後 - 全機能要件をブロック
- **FR-1 Caption (Phase 3)**: Foundational完了後
- **FR-3 Col (Phase 4)**: Foundational完了後
- **FR-2 Colgroup (Phase 5)**: FR-3 Col完了後（ColはColgroupの子）
- **FR-4 統合 (Phase 6)**: FR-1, FR-2, FR-3 全て完了後
- **Polish (Phase 7)**: FR-4完了後

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
    ├── Phase 3 (FR-1 Caption) ─────────────────┐
    │                                           │
    └── Phase 4 (FR-3 Col) ──→ Phase 5 (FR-2 Colgroup)
                                                │
                                                ↓
                                    Phase 6 (FR-4 統合)
                                                ↓
                                    Phase 7 (Polish)
```

### Parallel Opportunities

- Setup: T001, T002, T003 は並列実行可能
- Foundational: T004〜T012 は全て並列実行可能
- FR-1 Tests: T013〜T017 は並列実行可能
- FR-3 Tests: T022〜T025 は並列実行可能
- FR-2 Tests: T029〜T032 は並列実行可能
- FR-1 と FR-3 は並列実行可能（依存関係なし）

---

## Parallel Example: FR-1 Caption

```bash
# FR-1のテストを並列起動:
Task: "caption-attributes型テストを作成"
Task: "caption-element.factory テストを作成"
Task: "caption-element.typeguards テストを作成"
Task: "caption-element.toFigmaNode テストを作成"
Task: "caption-element.mapToFigma テストを作成"

# FR-1の統合テストを並列起動:
Task: "caption統合テスト（基本）を作成"
Task: "caption統合テスト（スタイル）を作成"
```

---

## Implementation Strategy

### MVP First (FR-1 Caption Only)

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了
3. Phase 3: FR-1 Caption 完了
4. **STOP and VALIDATE**: Caption要素を独立してテスト
5. 必要に応じてデプロイ/デモ

### Incremental Delivery

1. Setup + Foundational → 基盤準備完了
2. FR-1 Caption → 独立テスト → MVP!
3. FR-3 Col → 独立テスト
4. FR-2 Colgroup → 独立テスト
5. FR-4 統合 → 全体テスト → 完成!

---

## Summary

| Phase | タスク数 | 並列可能 |
|-------|----------|----------|
| Phase 1: Setup | 3 | 3 |
| Phase 2: Foundational | 9 | 9 |
| Phase 3: FR-1 Caption | 9 | 7 |
| Phase 4: FR-3 Col | 7 | 5 |
| Phase 5: FR-2 Colgroup | 7 | 5 |
| Phase 6: FR-4 統合 | 2 | 0 |
| Phase 7: Polish | 3 | 0 |
| **Total** | **40** | **29** |

---

## Notes

- [P] タスク = 異なるファイル、依存関係なし
- [FR*] ラベル = 対応する機能要件へのマッピング
- TDD必須: テストを先に書き、失敗することを確認してから実装
- 各チェックポイントで独立してストーリーを検証可能
- タスクまたは論理グループごとにコミット
