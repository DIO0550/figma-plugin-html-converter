# Implementation Tasks: tr要素（テーブル行）の実装

**Feature**: tr要素（テーブル行）のFigma変換機能
**Branch**: `149-tr-element-implementation`
**Status**: Ready for Implementation
**Estimated Effort**: 1日

## 概要

HTMLのテーブル行要素（`<tr>`）をFigmaのFrameNodeに変換する機能をTDD（テスト駆動開発）アプローチで実装します。既存のtd/th要素のパターンを踏襲し、型安全で保守性の高い実装を提供します。

## 実装戦略

- **MVP**: 単一の完全な機能（tr要素の完全実装）
- **Incremental Delivery**: TDDサイクルに従った段階的実装
- **Quality Gates**: 各フェーズ完了時に品質チェック実施

## Phase 1: Setup（プロジェクト初期化）

このフェーズでは、tr要素実装に必要なディレクトリ構造を作成します。

### Tasks

- [X] T001 src/converter/elements/table/tr ディレクトリを作成
- [X] T002 src/converter/elements/table/tr/tr-attributes ディレクトリを作成
- [X] T003 src/converter/elements/table/tr/tr-attributes/__tests__ ディレクトリを作成
- [X] T004 src/converter/elements/table/tr/tr-element ディレクトリを作成
- [X] T005 src/converter/elements/table/tr/tr-element/__tests__ ディレクトリを作成

**Phase 1 完了条件**:
- すべてのディレクトリが正しい場所に作成されている
- ディレクトリ構造が既存のtd/th要素と一致している

---

## Phase 2: User Story 1 - tr要素の実装（TDD）

**Story Goal**: HTMLの`<tr>`要素をFigmaのFrameNodeに変換する完全な機能を実装

**Independent Test Criteria**:
- TrAttributes型が正しく定義され、テストが通る
- TrElement型が正しく定義され、すべてのCompanion Objectメソッドが動作する
- すべての単体テストが成功する（カバレッジ90%以上）
- ESLint/型チェックがパスする

### Step 1: TrAttributes型定義（テストファースト）

- [X] T006 [US1] TrAttributes型定義のテストを作成 in src/converter/elements/table/tr/tr-attributes/__tests__/tr-attributes.test.ts
- [X] T007 [US1] TrAttributes型定義を実装 in src/converter/elements/table/tr/tr-attributes/tr-attributes.ts
- [X] T008 [US1] TrAttributes型のエクスポートを追加 in src/converter/elements/table/tr/tr-attributes/index.ts
- [X] T009 [US1] T006-T008のテストを実行して成功を確認

### Step 2: TrElement.create()実装（テストファースト）

- [X] T010 [US1] TrElement.create()のテストを作成 in src/converter/elements/table/tr/tr-element/__tests__/tr-element.factory.test.ts
- [X] T011 [US1] TrElement型定義とcreate()メソッドを実装 in src/converter/elements/table/tr/tr-element/tr-element.ts
- [X] T012 [US1] T010-T011のテストを実行して成功を確認

### Step 3: TrElement.isTrElement()実装（テストファースト）

- [X] T013 [US1] TrElement.isTrElement()のテストを作成 in src/converter/elements/table/tr/tr-element/__tests__/tr-element.typeguards.test.ts
- [X] T014 [US1] TrElement.isTrElement()メソッドを実装 in src/converter/elements/table/tr/tr-element/tr-element.ts
- [X] T015 [US1] T013-T014のテストを実行して成功を確認

### Step 4: TrElement.toFigmaNode()実装（テストファースト）

- [X] T016 [US1] TrElement.toFigmaNode()のテストを作成 in src/converter/elements/table/tr/tr-element/__tests__/tr-element.toFigmaNode.test.ts
- [X] T017 [US1] TrElement.toFigmaNode()メソッドを実装 in src/converter/elements/table/tr/tr-element/tr-element.ts
- [X] T018 [US1] T016-T017のテストを実行して成功を確認

### Step 5: TrElement.mapToFigma()実装（テストファースト）

- [X] T019 [US1] TrElement.mapToFigma()のテストを作成 in src/converter/elements/table/tr/tr-element/__tests__/tr-element.mapToFigma.test.ts
- [X] T020 [US1] TrElement.mapToFigma()メソッドを実装 in src/converter/elements/table/tr/tr-element/tr-element.ts
- [X] T021 [US1] T019-T020のテストを実行して成功を確認

### Step 6: エクスポート設定

- [X] T022 [US1] TrElementのエクスポートを追加 in src/converter/elements/table/tr/tr-element/index.ts
- [X] T023 [US1] tr/index.tsでTrElementとTrAttributesをエクスポート in src/converter/elements/table/tr/index.ts

**Phase 2 完了条件**:
- すべてのテストが成功（グリーン）
- TrAttributesとTrElementが正しく定義されている
- Companion Objectの4つのメソッドすべてが実装され、動作する
- エクスポートが正しく設定されている

---

## Phase 3: Polish & Cross-Cutting Concerns（最終調整）

このフェーズでは、実装の統合、品質チェック、エクスポートの追加を行います。

### Tasks

- [X] T024 TrElementとTrAttributesをtable/index.tsにエクスポート in src/converter/elements/table/index.ts
- [X] T025 全テストスイートを実行して成功を確認（npm test）
- [X] T026 カバレッジレポートを生成して90%以上を確認（npm run coverage）
- [X] T027 ESLintチェックを実行してエラーがないことを確認（npm run lint）
- [X] T028 型チェックを実行してエラーがないことを確認（npm run type-check）

**Phase 3 完了条件**:
- table/index.tsにTrElement/TrAttributesがエクスポートされている
- すべてのテストが成功
- カバレッジが90%以上
- ESLint/型チェックがパス
- 実装がproduction ready

---

## Dependencies（依存関係）

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (US1: tr要素の実装)
    ↓
Phase 3 (Polish)
```

**Notes**:
- すべてのフェーズは順次実行する必要がある
- Phase 2内のStepは順次実行（TDDサイクル）
- 各ステップ内のテスト→実装→確認は必ず順守

### Task-Level Dependencies

- T006-T009: TrAttributes型定義（並列不可、TDDサイクル）
- T010-T012: create()実装（T006-T009完了後）
- T013-T015: isTrElement()実装（T010-T012完了後）
- T016-T018: toFigmaNode()実装（T013-T015完了後）
- T019-T021: mapToFigma()実装（T016-T018完了後）
- T022-T023: エクスポート設定（T019-T021完了後）
- T024-T028: Polish（T022-T023完了後）

---

## Parallel Execution Opportunities（並列実行の可能性）

このプロジェクトはTDD（テスト駆動開発）を厳守するため、**並列実行可能なタスクはありません**。すべてのタスクは以下のサイクルに従って順次実行する必要があります：

```
Red (テスト作成・失敗確認)
  → Green (実装・テスト成功)
  → Refactor (リファクタリング)
  → 次のステップ
```

---

## Quality Checkpoints（品質チェックポイント）

各フェーズ完了時に以下を確認：

### Phase 1 完了時
- [ ] ディレクトリ構造が正しい

### Phase 2 完了時（各ステップごと）
- [ ] テストが先に作成されている
- [ ] テストが失敗することを確認（Red）
- [ ] 実装後にテストが成功することを確認（Green）
- [ ] 必要に応じてリファクタリング

### Phase 3 完了時
- [ ] すべてのテストが成功
- [ ] カバレッジ90%以上
- [ ] ESLintエラーなし
- [ ] 型エラーなし
- [ ] エクスポートが正しく設定されている

---

## Implementation Notes（実装上の注意）

### TDD必須事項

1. **テストファースト**
   - 必ず実装前にテストを書く
   - テストが失敗することを確認（Red）
   - 実装してテストを成功させる（Green）
   - 必要に応じてリファクタリング

2. **既存パターンの踏襲**
   - td/th要素の実装を参考にする
   - 同じコンパニオンオブジェクトパターン
   - 同じテストファイル構成

3. **型安全性**
   - TypeScript strict mode準拠
   - 明示的な型定義
   - 型ガードの活用

4. **コード品質**
   - ESLintルール厳守
   - eslint-disableディレクティブ禁止
   - npxコマンド使用禁止（npm runスクリプト使用）
   - JSDocドキュメント完備

### 参考実装

- **TrAttributes参考**: `src/converter/elements/table/td/td-attributes/td-attributes.ts`
- **TrElement参考**: `src/converter/elements/table/td/td-element/td-element.ts`
- **テスト参考**: `src/converter/elements/table/td/td-element/__tests__/`

### データモデル

**TrAttributes**:
```typescript
interface TrAttributes extends GlobalAttributes {
  width?: string;
  height?: string;
}
```

**TrElement**:
```typescript
interface TrElement extends BaseElement<"tr", TrAttributes> {
  children: TdElement[] | ThElement[] | [];
}
```

**Companion Object**:
- `isTrElement(node: unknown): node is TrElement`
- `create(attributes?: Partial<TrAttributes>): TrElement`
- `toFigmaNode(element: TrElement): FigmaNodeConfig`
- `mapToFigma(node: unknown): FigmaNodeConfig | null`

---

## Task Summary（タスクサマリー）

**Total Tasks**: 28

### By Phase
- Phase 1 (Setup): 5 tasks
- Phase 2 (US1): 18 tasks
- Phase 3 (Polish): 5 tasks

### By Category
- Setup/Infrastructure: 5 tasks
- Test Creation: 9 tasks (TDD)
- Implementation: 9 tasks (TDD)
- Integration/Export: 3 tasks
- Quality Checks: 2 tasks

**Parallel Opportunities**: 0（TDD必須のため、すべて順次実行）

**Test Coverage Goal**: 90%以上

**Independent Test Criteria**: Phase 2完了時点でtr要素の完全な機能が独立してテスト可能

---

## Validation Checklist（検証チェックリスト）

実装完了時に以下をすべて確認：

### 機能要件
- [ ] tr要素がFigma FrameNodeに正しく変換される
- [ ] 横方向（HORIZONTAL）のAuto Layoutが設定されている
- [ ] width/height属性がサポートされている
- [ ] スタイル属性（border、background-color、padding）が適用される

### 技術要件
- [ ] TypeScript strict mode準拠
- [ ] すべてのテストが成功
- [ ] カバレッジ90%以上
- [ ] ESLint/型チェックがパス
- [ ] JSDocドキュメントが完備

### 統合要件
- [ ] table/index.tsにエクスポート追加
- [ ] 既存のtd/th要素と一貫性のある実装
- [ ] 依存関係（BaseElement、TdElement、ThElement）が正しく参照されている

---

## Next Steps（次のステップ）

1. **実装開始**: `/speckit.implement` コマンドで自動実装を開始
2. **手動実装**: quickstart.mdを参照して手動実装
3. **PR作成**: 実装完了後、PRを作成してレビュー依頼

**推定完了時間**: 1日（TDDサイクルを含む）

---

**Generated**: 2025-11-20
**Last Updated**: 2025-11-20
