# Implementation Plan: pnpm対応

**Branch**: `151-pnpm-support` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/151-pnpm-support/spec.md`

## Summary

プロジェクトのパッケージマネージャをnpmからpnpmに移行し、Renovateによる自動依存関係更新を設定する。`pnpm import`を使用して既存のpackage-lock.jsonから移行し、CI/CDワークフローをpnpm対応に更新する。minimumReleaseAgeは7200秒（2時間）に設定。

## Technical Context

**Language/Version**: TypeScript 5.4.3 (strict mode有効)
**Primary Dependencies**: Vitest 3.2.4, Vite 5.2.6, ESLint 9.33.0
**Storage**: N/A（Figmaプラグイン、ローカルストレージのみ）
**Testing**: Vitest 3.2.4
**Target Platform**: Figma Desktop App（プラグイン）、Node.js 20.x（開発環境）
**Project Type**: single（Figmaプラグイン）
**Performance Goals**: pnpm installが30秒以内に完了
**Constraints**: 既存のnpm scriptsとの互換性維持
**Scale/Scope**: 開発者向けツール、小〜中規模プロジェクト

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution未設定（テンプレート状態）のため、プロジェクトの既存ルール（CLAUDE.md）に準拠：

| Gate | Status | Note |
|------|--------|------|
| TDD必須 | N/A | 設定ファイル変更のため、テストコード不要 |
| 品質チェック | ✅ | lint, type-check, testを実行 |
| コミットルール | ✅ | commit.prompt.mdに従う |
| ブランチ戦略 | ✅ | feature/ブランチで作業中 |

## Project Structure

### Documentation (this feature)

```text
specs/151-pnpm-support/
├── spec.md              # 仕様書（作成済み）
├── plan.md              # このファイル
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # 仕様品質チェックリスト（作成済み）
```

### Source Code (repository root)

```text
# 変更対象ファイル
package.json             # packageManagerフィールド追加
pnpm-lock.yaml          # 新規作成（pnpm importで生成）
renovate.json           # 新規作成
.github/workflows/ci.yml # pnpm対応に更新

# 削除対象ファイル
package-lock.json       # pnpm移行後に削除
```

**Structure Decision**: 既存のプロジェクト構造を維持し、パッケージマネージャ関連ファイルのみを変更。

## Complexity Tracking

該当なし。シンプルな設定変更のため、複雑性の正当化は不要。

## Phase 0: Research

### 調査項目

1. **pnpmバージョン選定**: v9系最新安定版を使用
2. **GitHub Actions pnpmセットアップ**: pnpm/action-setup@v4を使用
3. **Renovate pnpm対応**: デフォルトでpnpm-lock.yaml対応済み

### 決定事項

| 項目 | 決定 | 理由 |
|------|------|------|
| pnpmバージョン | 9.15.x | 最新安定版、corepackと互換性あり |
| CI pnpmセットアップ | pnpm/action-setup@v4 | 公式アクション、キャッシュ対応 |
| Renovate設定 | minimumReleaseAge: 7200 | ユーザー要件どおり |
| packageManager | corepack対応形式 | `pnpm@9.15.x`形式で指定 |

## Phase 1: Implementation Design

### 1. package.json更新

```json
{
  "packageManager": "pnpm@9.15.0"
}
```

### 2. renovate.json設定

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "minimumReleaseAge": "7200 seconds",
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    },
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "automergeType": "pr"
    }
  ]
}
```

### 3. CI/CD更新 (.github/workflows/ci.yml)

変更点：
- `actions/setup-node`のcache: 'npm' → cache: 'pnpm'
- `pnpm/action-setup@v4`を追加
- `npm ci` → `pnpm install --frozen-lockfile`
- `npm run` → `pnpm run`

### 4. 移行手順

1. `pnpm import` - package-lock.jsonからpnpm-lock.yaml生成
2. `pnpm install` - 依存関係検証
3. `pnpm test` - テスト実行確認
4. package-lock.json削除
5. CI/CD更新
6. renovate.json追加

## Implementation Tasks

1. **Task 1**: package.jsonにpackageManagerフィールド追加
2. **Task 2**: pnpm importでロックファイル生成
3. **Task 3**: pnpm環境でテスト実行確認
4. **Task 4**: CI/CDワークフロー更新
5. **Task 5**: renovate.json作成
6. **Task 6**: package-lock.json削除
7. **Task 7**: ドキュメント更新（CLAUDE.md等）
