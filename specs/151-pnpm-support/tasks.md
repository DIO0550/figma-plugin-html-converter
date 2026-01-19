# Tasks: pnpm対応

**Input**: Design documents from `/specs/151-pnpm-support/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: テスト不要（設定ファイル変更のみ）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: pnpm移行の準備

- [ ] T001 package.jsonにpackageManagerフィールドを追加 (`"packageManager": "pnpm@9.15.0"`) in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: pnpmロックファイルの生成と検証

**⚠️ CRITICAL**: User Story 1を完了するまで、他のストーリーは開始できません

- [ ] T002 `pnpm import`を実行してpackage-lock.jsonからpnpm-lock.yamlを生成
- [ ] T003 `pnpm install`を実行して依存関係を検証
- [ ] T004 `pnpm test`を実行してすべてのテストが通ることを確認
- [ ] T005 `pnpm run build`を実行してビルドが成功することを確認
- [ ] T006 `pnpm run lint`を実行してリントが通ることを確認
- [ ] T007 `pnpm run type-check`を実行して型チェックが通ることを確認

**Checkpoint**: ローカルでpnpm環境が完全に動作することを確認

---

## Phase 3: User Story 1 - 開発者がpnpmで依存関係をインストールする (Priority: P1) 🎯 MVP

**Goal**: 開発者がpnpmを使用して依存関係をインストールし、開発を開始できる

**Independent Test**: `pnpm install`を実行し、すべての依存関係が正しくインストールされることを確認

### Implementation for User Story 1

- [ ] T008 [US1] package-lock.jsonを削除（pnpm-lock.yamlへの移行完了後）
- [ ] T009 [US1] .gitignoreにpackage-lock.jsonを追加（誤って再生成されないように）in .gitignore

**Checkpoint**: User Story 1が完全に機能し、独立してテスト可能

---

## Phase 4: User Story 2 - CIでpnpmを使用したビルドとテスト (Priority: P2)

**Goal**: CI/CDパイプラインがpnpmを使用してビルド、テスト、リントを実行

**Independent Test**: プルリクエストを作成し、CIワークフローがpnpmで正常に完了することを確認

### Implementation for User Story 2

- [ ] T010 [US2] CI testジョブにpnpm/action-setup@v4を追加 in .github/workflows/ci.yml
- [ ] T011 [US2] CI testジョブのactions/setup-nodeでcache: 'pnpm'に変更 in .github/workflows/ci.yml
- [ ] T012 [US2] CI testジョブの`npm ci`を`pnpm install --frozen-lockfile`に変更 in .github/workflows/ci.yml
- [ ] T013 [US2] CI testジョブの`npm run`を`pnpm run`に変更 in .github/workflows/ci.yml
- [ ] T014 [US2] CI buildジョブを同様にpnpm対応に更新 in .github/workflows/ci.yml
- [ ] T015 [US2] CI coverage-commentジョブを同様にpnpm対応に更新 in .github/workflows/ci.yml

**Checkpoint**: CIワークフローがpnpmで正常に動作

---

## Phase 5: User Story 3 - Renovateによる自動依存関係更新 (Priority: P3)

**Goal**: Renovateが依存関係を自動更新し、minimumReleaseAge=7200秒で設定

**Independent Test**: Renovate設定が正しく認識され、依存関係更新PRが作成されることを確認

### Implementation for User Story 3

- [ ] T016 [US3] renovate.jsonを作成（minimumReleaseAge: "7200 seconds"、推奨設定を継承）in renovate.json

**Checkpoint**: Renovate設定が完了し、pnpm-lock.yamlを正しく更新できる

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: ドキュメント更新と最終確認

- [ ] T017 [P] CLAUDE.mdのCommon Commandsセクションをpnpmコマンドに更新 in CLAUDE.md
- [ ] T018 [P] READMEがあれば、npmコマンドをpnpmコマンドに更新
- [ ] T019 最終検証: すべてのpnpmコマンドが正常に動作することを確認

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - 即座に開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - すべてのユーザーストーリーをブロック
- **User Story 1 (Phase 3)**: Foundationalの完了に依存
- **User Story 2 (Phase 4)**: User Story 1の完了に依存（pnpm-lock.yamlが必要）
- **User Story 3 (Phase 5)**: User Story 1の完了に依存
- **Polish (Phase 6)**: すべてのユーザーストーリーの完了に依存

### User Story Dependencies

- **User Story 1 (P1)**: Foundational完了後に開始可能 - 他のストーリーに依存しない
- **User Story 2 (P2)**: User Story 1完了後に開始可能（pnpm-lock.yamlがCIで必要）
- **User Story 3 (P3)**: User Story 1完了後に開始可能（Renovateがpnpm-lock.yamlを更新）

### Parallel Opportunities

- User Story 2とUser Story 3はUser Story 1完了後に並行実行可能
- Phase 6のT017とT018は並行実行可能

---

## Parallel Example: After User Story 1

```bash
# User Story 1完了後、以下を並行で実行可能:
Task: "[US2] CI testジョブにpnpm/action-setup@v4を追加"
Task: "[US3] renovate.jsonを作成"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup完了 - packageManagerフィールド追加
2. Phase 2: Foundational完了 - pnpm import、install、テスト確認
3. Phase 3: User Story 1完了 - package-lock.json削除
4. **STOP and VALIDATE**: `pnpm install`と`pnpm test`が正常動作することを確認
5. ローカル開発環境でのpnpm使用が可能に

### Incremental Delivery

1. User Story 1完了 → ローカルでpnpm使用可能（MVP!）
2. User Story 2完了 → CIがpnpmで動作
3. User Story 3完了 → Renovateによる自動更新が有効

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 19 |
| **User Story 1 Tasks** | 2 |
| **User Story 2 Tasks** | 6 |
| **User Story 3 Tasks** | 1 |
| **Setup/Foundational Tasks** | 7 |
| **Polish Tasks** | 3 |
| **Parallel Opportunities** | US2とUS3は並行可能、T017とT018は並行可能 |
| **MVP Scope** | Phase 1-3（User Story 1まで） |

---

## Notes

- [P] tasks = 異なるファイル、依存関係なし
- [Story] ラベルで特定のユーザーストーリーへのマッピング
- 各ユーザーストーリーは独立して完了・テスト可能
- タスク完了後または論理的なグループ後にコミット
- チェックポイントでストーリーを独立して検証可能
