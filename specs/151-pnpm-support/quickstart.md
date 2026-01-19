# Quickstart: pnpm対応

**Feature**: 151-pnpm-support
**Date**: 2025-12-28

## 概要

このガイドでは、プロジェクトのパッケージマネージャをnpmからpnpmに移行する手順を説明します。

## 前提条件

- Node.js 20.x以上
- pnpm 9.x（未インストールの場合は下記参照）

### pnpmのインストール

```bash
# corepackを使用（推奨）
corepack enable
corepack prepare pnpm@9.15.0 --activate

# または npm経由
npm install -g pnpm@9.15.0
```

## 移行手順

### Step 1: ロックファイルの変換

```bash
# 既存のpackage-lock.jsonからpnpm-lock.yamlを生成
pnpm import
```

### Step 2: 依存関係のインストール

```bash
pnpm install
```

### Step 3: 動作確認

```bash
# テスト実行
pnpm test

# ビルド確認
pnpm run build

# リント確認
pnpm run lint

# 型チェック
pnpm run type-check
```

### Step 4: 開発サーバー起動

```bash
pnpm run dev
```

## npmからpnpmへのコマンド対応表

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm ci` | `pnpm install --frozen-lockfile` |
| `npm run <script>` | `pnpm run <script>` または `pnpm <script>` |
| `npm test` | `pnpm test` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` |

## トラブルシューティング

### エラー: pnpmが見つからない

```bash
# corepackを有効化
corepack enable

# pnpmを準備
corepack prepare pnpm@9.15.0 --activate
```

### エラー: ロックファイルの不整合

```bash
# ロックファイルを再生成
rm pnpm-lock.yaml
pnpm install
```

### エラー: node_modulesの問題

```bash
# クリーンインストール
rm -rf node_modules
pnpm install
```

## CI/CDでの使用

GitHub Actionsでのpnpm使用例：

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## 関連ドキュメント

- [pnpm公式ドキュメント](https://pnpm.io/)
- [pnpm import](https://pnpm.io/cli/import)
- [GitHub Actions setup](https://github.com/pnpm/action-setup)
