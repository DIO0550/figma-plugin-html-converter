# Tasks: table要素の実装

**Input**: Design documents from `/specs/150-table-element-implementation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: テストタスクを含みます（TDD要件により必須）

**Organization**: table要素の実装は単一のユーザーストーリーとして構成されています。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: タスクが属するユーザーストーリー（US1）
- ファイルパスを明示

## Path Conventions

このプロジェクトは単一プロジェクト構成を使用:
- `src/converter/elements/table/` - table要素の実装
- Vitestテストは実装ファイルと同じディレクトリの`__tests__/`配下

---

## Phase 1: Setup（共通インフラストラクチャ）

**目的**: ディレクトリ構造の作成

- [X] T001 Create table-attributes directory in src/converter/elements/table/table-attributes/
- [X] T002 Create table-attributes tests directory in src/converter/elements/table/table-attributes/__tests__/
- [X] T003 Create table-element directory in src/converter/elements/table/table-element/
- [X] T004 Create table-element tests directory in src/converter/elements/table/table-element/__tests__/

---

## Phase 2: Foundational（前提条件の確認）

**目的**: 依存要素の確認とユーティリティの検証

**⚠️ CRITICAL**: このフェーズ完了後にUser Story 1の実装を開始

- [X] T005 Verify TrElement exists in src/converter/elements/table/tr/tr-element/tr-element.ts
- [X] T006 Verify TdElement exists in src/converter/elements/table/td/td-element/td-element.ts
- [X] T007 Verify BaseElement type exists in src/converter/elements/base/base-element/base-element.ts
- [X] T008 Verify toFigmaNodeWith utility exists in src/converter/utils/to-figma-node-with.ts
- [X] T009 Verify mapToFigmaWith utility exists in src/converter/utils/element-utils.ts

**Checkpoint**: 依存関係確認完了 - table要素の実装を開始可能

---

## Phase 3: User Story 1 - table要素の完全実装 (Priority: P1) 🎯 MVP

**Goal**: HTMLのtable要素をFigmaのFrameNodeに変換し、tr要素を縦方向に配置する機能を提供する

**Independent Test**:
- 空のtable要素が作成できる
- border属性付きtable要素が作成できる
- table要素がFigma FrameNodeに変換される
- 2x2、3x3のテーブルが正しく変換される

### Tests for User Story 1（TDD必須）⚠️

> **NOTE: これらのテストを最初に書き、実装前に失敗することを確認する（Red）**

#### TableAttributes Tests

- [ ] T010 [P] [US1] Write test for TableAttributes extends GlobalAttributes in src/converter/elements/table/table-attributes/__tests__/table-attributes.test.ts
- [ ] T011 [P] [US1] Write test for border attribute support in src/converter/elements/table/table-attributes/__tests__/table-attributes.test.ts
- [ ] T012 [P] [US1] Write test for optional attributes in src/converter/elements/table/table-attributes/__tests__/table-attributes.test.ts

#### TableElement Factory Tests

- [ ] T013 [P] [US1] Write test for TableElement.create() with default values in src/converter/elements/table/table-element/__tests__/table-element.factory.test.ts
- [ ] T014 [P] [US1] Write test for TableElement.create() with border attribute in src/converter/elements/table/table-element/__tests__/table-element.factory.test.ts
- [ ] T015 [P] [US1] Write test for TableElement.create() with multiple attributes in src/converter/elements/table/table-element/__tests__/table-element.factory.test.ts

#### TableElement Type Guards Tests

- [ ] T016 [P] [US1] Write test for TableElement.isTableElement() with valid table element in src/converter/elements/table/table-element/__tests__/table-element.typeguards.test.ts
- [ ] T017 [P] [US1] Write test for TableElement.isTableElement() with null in src/converter/elements/table/table-element/__tests__/table-element.typeguards.test.ts
- [ ] T018 [P] [US1] Write test for TableElement.isTableElement() with other elements in src/converter/elements/table/table-element/__tests__/table-element.typeguards.test.ts
- [ ] T019 [P] [US1] Write test for TableElement.isTableElement() with incomplete object in src/converter/elements/table/table-element/__tests__/table-element.typeguards.test.ts

#### TableElement toFigmaNode Tests

- [ ] T020 [P] [US1] Write test for toFigmaNode() with empty table in src/converter/elements/table/table-element/__tests__/table-element.toFigmaNode.test.ts
- [ ] T021 [P] [US1] Write test for toFigmaNode() with border attribute in src/converter/elements/table/table-element/__tests__/table-element.toFigmaNode.test.ts
- [ ] T022 [P] [US1] Write test for toFigmaNode() with child TrElements in src/converter/elements/table/table-element/__tests__/table-element.toFigmaNode.test.ts
- [ ] T023 [P] [US1] Write test for toFigmaNode() Auto Layout settings (VERTICAL) in src/converter/elements/table/table-element/__tests__/table-element.toFigmaNode.test.ts

#### TableElement mapToFigma Tests

- [ ] T024 [P] [US1] Write test for mapToFigma() with valid table element in src/converter/elements/table/table-element/__tests__/table-element.mapToFigma.test.ts
- [ ] T025 [P] [US1] Write test for mapToFigma() with invalid node in src/converter/elements/table/table-element/__tests__/table-element.mapToFigma.test.ts
- [ ] T026 [P] [US1] Write test for mapToFigma() with null in src/converter/elements/table/table-element/__tests__/table-element.mapToFigma.test.ts

**Checkpoint**: 全テスト作成完了 - `npm test`で全テストが失敗することを確認（Red）

### Implementation for User Story 1

#### TableAttributes Implementation

- [ ] T027 [US1] Implement TableAttributes interface in src/converter/elements/table/table-attributes/table-attributes.ts
- [ ] T028 [US1] Add JSDoc documentation for TableAttributes in src/converter/elements/table/table-attributes/table-attributes.ts
- [ ] T029 [US1] Create index.ts export for TableAttributes in src/converter/elements/table/table-attributes/index.ts
- [ ] T030 [US1] Run `npm test -- table-attributes.test.ts` and verify tests pass (Green)

#### TableElement Implementation

- [ ] T031 [US1] Implement TableElement interface in src/converter/elements/table/table-element/table-element.ts
- [ ] T032 [US1] Implement TableElement.isTableElement() type guard in src/converter/elements/table/table-element/table-element.ts
- [ ] T033 [US1] Implement TableElement.create() factory method in src/converter/elements/table/table-element/table-element.ts
- [ ] T034 [US1] Implement TableElement.toFigmaNode() conversion logic in src/converter/elements/table/table-element/table-element.ts
- [ ] T035 [US1] Implement TableElement.mapToFigma() mapping method in src/converter/elements/table/table-element/table-element.ts
- [ ] T036 [US1] Add JSDoc documentation for all TableElement methods in src/converter/elements/table/table-element/table-element.ts
- [ ] T037 [US1] Create index.ts export for TableElement in src/converter/elements/table/table-element/index.ts
- [ ] T038 [US1] Run `npm test -- table-element` and verify all tests pass (Green)

#### Integration and Export

- [ ] T039 [US1] Add TableElement exports to src/converter/elements/table/index.ts
- [ ] T040 [US1] Add TableAttributes exports to src/converter/elements/table/index.ts
- [ ] T041 [US1] Run `npm test` and verify all table-related tests pass

### Integration Tests for User Story 1

- [ ] T042 [P] [US1] Write integration test for empty table creation and Figma conversion in src/converter/elements/table/__tests__/table-integration.basic.test.ts
- [ ] T043 [P] [US1] Write integration test for 1x1 table (1 row, 1 cell) in src/converter/elements/table/__tests__/table-integration.basic.test.ts
- [ ] T044 [P] [US1] Write integration test for 2x2 table conversion in src/converter/elements/table/__tests__/table-integration.scenarios.test.ts
- [ ] T045 [P] [US1] Write integration test for 3x3 table conversion in src/converter/elements/table/__tests__/table-integration.scenarios.test.ts
- [ ] T046 [P] [US1] Write integration test for table with border attribute in src/converter/elements/table/__tests__/table-integration.styles.test.ts
- [ ] T047 [P] [US1] Write integration test for table with background-color in src/converter/elements/table/__tests__/table-integration.styles.test.ts
- [ ] T048 [P] [US1] Write integration test for table with padding in src/converter/elements/table/__tests__/table-integration.styles.test.ts
- [ ] T049 [US1] Run `npm test -- table-integration` and verify all integration tests pass

**Checkpoint**: table要素が完全に機能し、独立してテスト可能

---

## Phase 4: Polish & Cross-Cutting Concerns

**目的**: 品質チェックとドキュメント整備

- [ ] T050 [P] Run `npm run lint` and fix any ESLint errors
- [ ] T051 [P] Run `npm run type-check` and fix any TypeScript errors
- [ ] T052 Run `npm run coverage` and verify 90%+ coverage for table element
- [ ] T053 [P] Review and update JSDoc comments for clarity
- [ ] T054 [P] Verify all tests follow TDD principles (Red-Green-Refactor)
- [ ] T055 Run final `npm test` to confirm all tests pass
- [ ] T056 Review quickstart.md and verify implementation matches guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - 即座に開始可能
- **Foundational (Phase 2)**: Setup完了後 - User Story 1をブロック
- **User Story 1 (Phase 3)**: Foundational完了後 - 単一ストーリーのため並列なし
- **Polish (Phase 4)**: User Story 1完了後

### Within User Story 1

#### テストフェーズ（T010-T026）
- TableAttributes tests (T010-T012): 並列実行可能
- Factory tests (T013-T015): 並列実行可能
- Type guards tests (T016-T019): 並列実行可能
- toFigmaNode tests (T020-T023): 並列実行可能
- mapToFigma tests (T024-T026): 並列実行可能
- **全テストは実装前に作成し、失敗することを確認（Red）**

#### 実装フェーズ（T027-T041）
- TableAttributes implementation (T027-T030): テスト完了後に実施
- TableElement implementation (T031-T038): TableAttributes完了後に実施
- Integration and export (T039-T041): TableElement完了後に実施

#### 統合テストフェーズ（T042-T049）
- Basic tests (T042-T043): 並列実行可能
- Scenario tests (T044-T045): 並列実行可能
- Style tests (T046-T048): 並列実行可能
- Final verification (T049): 全統合テスト完了後

### Parallel Opportunities

```text
# Phase 1: Setup - 全タスク並列可能
T001, T002, T003, T004

# Phase 2: Foundational - 全タスク並列可能
T005, T006, T007, T008, T009

# Phase 3: Tests - カテゴリごとに並列可能
# TableAttributes tests
T010, T011, T012

# Factory tests
T013, T014, T015

# Type guards tests
T016, T017, T018, T019

# toFigmaNode tests
T020, T021, T022, T023

# mapToFigma tests
T024, T025, T026

# Integration tests - カテゴリごとに並列可能
# Basic tests
T042, T043

# Scenario tests
T044, T045

# Style tests
T046, T047, T048

# Phase 4: Polish - Lint/Type-check並列可能
T050, T051, T053, T054
```

---

## Parallel Example: User Story 1 Test Phase

```bash
# Launch all TableAttributes tests together:
Task: "Write test for TableAttributes extends GlobalAttributes"
Task: "Write test for border attribute support"
Task: "Write test for optional attributes"

# Launch all Factory tests together:
Task: "Write test for TableElement.create() with default values"
Task: "Write test for TableElement.create() with border attribute"
Task: "Write test for TableElement.create() with multiple attributes"

# Launch all Type Guards tests together:
Task: "Write test for TableElement.isTableElement() with valid table element"
Task: "Write test for TableElement.isTableElement() with null"
Task: "Write test for TableElement.isTableElement() with other elements"
Task: "Write test for TableElement.isTableElement() with incomplete object"
```

---

## Implementation Strategy

### TDD Workflow（Red-Green-Refactor）

1. **Red Phase**:
   - Complete Phase 1: Setup
   - Complete Phase 2: Foundational
   - Complete all test tasks (T010-T026)
   - Run `npm test` - **全テストが失敗することを確認**

2. **Green Phase**:
   - Implement TableAttributes (T027-T030)
   - Run `npm test -- table-attributes.test.ts` - **テストがパスすることを確認**
   - Implement TableElement (T031-T038)
   - Run `npm test -- table-element` - **テストがパスすることを確認**
   - Add exports (T039-T041)
   - Run `npm test` - **全テストがパスすることを確認**

3. **Integration**:
   - Write integration tests (T042-T048)
   - Run integration tests (T049)
   - Verify 2x2, 3x3 tables work correctly

4. **Refactor Phase**:
   - Complete Phase 4: Polish
   - Run lint/type-check
   - Verify coverage
   - Clean up code

### MVP Definition

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**

この実装は単一ストーリーのため、全フェーズ完了がMVPとなります。

### Validation Checkpoints

1. **After T009**: 依存関係が全て存在することを確認
2. **After T026**: 全テストが失敗することを確認（Red）
3. **After T030**: TableAttributesのテストがパスすることを確認（Green）
4. **After T038**: TableElementのテストがパスすることを確認（Green）
5. **After T041**: 全ユニットテストがパスすることを確認
6. **After T049**: 全統合テストがパスすることを確認
7. **After T055**: 最終品質チェック完了

---

## Notes

- **[P] tasks**: 異なるファイル、依存関係なし、並列実行可能
- **[US1] label**: User Story 1（table要素実装）に属するタスク
- **TDD必須**: テストを先に書き、失敗を確認してから実装（Red-Green-Refactor）
- **テスト実行**: 各実装後に`npm test`でテストがパスすることを確認
- **コミット**: 各タスクまたは論理的なグループごとにコミット
- **品質ゲート**: lint、type-check、coverage 90%以上を維持
- **既存パターン準拠**: tr、td、div要素と同じ実装パターンを使用

---

## Task Summary

- **Total Tasks**: 56
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (User Story 1)**: 43 tasks
  - Tests: 17 tasks (T010-T026)
  - Implementation: 15 tasks (T027-T041)
  - Integration Tests: 8 tasks (T042-T049)
  - Integration: 3 tasks
- **Phase 4 (Polish)**: 7 tasks
- **Parallel Opportunities**: 35 tasks marked [P]
- **Test Coverage Required**: 90%+ for table element
