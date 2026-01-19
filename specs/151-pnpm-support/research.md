# Research: pnpm対応

**Feature**: 151-pnpm-support
**Date**: 2025-12-28

## 調査概要

npmからpnpmへの移行に必要な技術調査を実施。

## 1. pnpmバージョン選定

### Decision: pnpm 9.15.x

**Rationale**:
- 2025年12月時点での最新安定版
- corepackと完全互換
- Node.js 20.xとの互換性確認済み
- `pnpm import`コマンドでnpmロックファイルからの移行をサポート

**Alternatives considered**:
| バージョン | 評価 | 却下理由 |
|-----------|------|----------|
| pnpm 8.x | 安定 | EOL近い、新機能なし |
| pnpm 10.x (beta) | 最新 | ベータ版、本番使用に不向き |

## 2. GitHub Actions pnpmセットアップ

### Decision: pnpm/action-setup@v4

**Rationale**:
- pnpm公式のGitHub Action
- 自動キャッシュ対応
- corepackとの統合
- packageManagerフィールドから自動でバージョン検出

**Implementation**:
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'
```

**Alternatives considered**:
| 方法 | 評価 | 却下理由 |
|------|------|----------|
| npm install -g pnpm | シンプル | キャッシュ管理が複雑 |
| corepack enable | 標準 | GitHub Actionsでの安定性に懸念 |

## 3. Renovate pnpm対応

### Decision: minimumReleaseAge: "7200 seconds"

**Rationale**:
- ユーザー要件どおり（7200秒 = 2時間）
- リリース直後の不安定なパッケージを回避
- Renovateはデフォルトでpnpm-lock.yamlをサポート

**Configuration**:
```json
{
  "minimumReleaseAge": "7200 seconds"
}
```

**Alternatives considered**:
| 値 | 評価 | 却下理由 |
|----|------|----------|
| 3 days | 安全 | 更新が遅すぎる |
| 0 | 即時 | 不安定なリリースを取り込むリスク |

## 4. packageManagerフィールド

### Decision: corepack対応形式

**Rationale**:
- Node.js 16.9+のcorepack機能と互換
- チーム全体で同一バージョンを強制
- CI/CDでの再現性を確保

**Format**:
```json
{
  "packageManager": "pnpm@9.15.0"
}
```

## 5. 移行リスク評価

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 依存関係の解決差異 | 低 | pnpm importで既存ロックファイルから移行 |
| CI/CDの失敗 | 中 | ローカルで事前検証、段階的移行 |
| 開発者の学習コスト | 低 | pnpmはnpmと互換性のあるCLI |
| Renovateの互換性 | 低 | デフォルトでpnpm対応済み |

## 結論

すべての調査項目で「NEEDS CLARIFICATION」は解消。実装に進む準備完了。
