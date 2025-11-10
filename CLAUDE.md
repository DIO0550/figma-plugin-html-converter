# CLAUDE.md

日本語で必ず応答して下さい。
必ず最初に、`prompt-mcp-server`を利用して、実装のルールを確認して下さい

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HTML を Figma デザインに変換する Figma プラグインプロジェクトです。HTML 要素を解析し、対応する Figma ノードに変換する機能を提供します。

## Key Features

1. **HTML to Figma Conversion**: HTML 入力を受け付け、Figma デザイン要素に変換
2. **要素別コンバーター実装**: 各 HTML 要素ごとに専用のコンバーターを実装
3. **スタイル属性のサポート**: CSS スタイルを Figma のスタイル属性にマッピング
4. **テスト駆動開発**: 全ての機能に対して包括的なテストを実装

## Project Structure

```
src/
├── code.ts                   # メインのプラグインロジック
├── ui.html                   # プラグイン UI
└── converter/               # コンバーターのコア実装
    ├── elements/            # HTML 要素別のコンバーター
    │   ├── base/           # 基底要素クラス
    │   ├── container/      # コンテナ要素（div, section）
    │   └── image/          # 画像要素（img）
    ├── models/             # データモデル
    │   ├── attributes/     # 属性管理
    │   ├── auto-layout/    # Figma オートレイアウト
    │   ├── colors/         # カラー処理
    │   ├── css-values/     # CSS 値のパーサー
    │   ├── figma-node/     # Figma ノード設定
    │   ├── flexbox/        # Flexbox レイアウト
    │   ├── html-node/      # HTML ノード処理
    │   ├── paint/          # ペイント設定
    │   └── styles/         # スタイル処理
    ├── constants/          # 定数定義
    ├── mapper.ts           # HTML から Figma へのマッピング
    └── types.ts            # 型定義
```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- TypeScript
- Figma Desktop App（プラグイン実行用）

### Common Commands

```bash
# 依存関係のインストール
npm install

# 開発モード（ファイル監視）
npm run dev

# プロダクションビルド
npm run build

# テスト実行
npm test

# テスト UI モード
npm run test:ui

# カバレッジレポート
npm run coverage

# リンティング
npm run lint

# 型チェック
npm run type-check
```

## Architecture Notes

### Plugin Architecture

- **UI Layer**: `ui.html` - ユーザーインターフェース
- **Plugin Code**: `code.ts` - Figma サンドボックス環境で実行
- **Converter System**: モジュラーなコンバーターアーキテクチャ
  - 各 HTML 要素に対応するコンバータークラス
  - ファクトリーパターンによる要素生成
  - スタイル属性の一元管理

### 実装済み要素

- **Container Elements**:

  - `<div>`: Flexbox レイアウト対応、スタイル属性サポート
  - `<section>`: セマンティック要素、div と同様の機能

- **Image Elements**:
  - `<img>`: 画像サイズ、アスペクト比、代替テキスト対応

### Key Considerations

- Figma プラグインはサンドボックス環境で実行（制限されたアクセス）
- UI とプラグインコード間の通信は postMessage を使用
- HTML パーシングは様々な HTML 構造に対応
- TDD（テスト駆動開発）による高い信頼性とカバレッジ

### Testing Strategy

- **Unit Tests**: 各コンバーター、モデル、ユーティリティ関数
- **Integration Tests**: 要素間の連携、マッピング処理
- **Coverage Target**: 高いコードカバレッジを維持
- **Test Framework**: Vitest

## ドキュメント構造

**⚠️ 重要**: `docs/` フォルダは Git の管理外です（`.gitignore` に含まれています）。これらのドキュメントはローカル環境でのみ作成・編集され、リポジトリにはコミットされません。

プロジェクトのドキュメントは `docs/` フォルダで管理します。

### フォルダ構成

```
docs/
├── implementation/          # 実装予定・実装中のタスクドキュメント
│   └── {機能カテゴリ名}/    # 機能に応じて柔軟にフォルダを追加
├── design/                 # 設計ドキュメント（実装前・検討中）
│   ├── proposals/          # 提案・検討中の設計
│   └── current/            # 現在採用している設計
├── adr/                    # Architecture Decision Records
│   └── template.md         # ADRテンプレート
├── archive/                # 使わなくなったドキュメント
│   ├── completed/          # 実装完了したドキュメント（歴史的記録として保持）
│   │   └── {機能カテゴリ名}/
│   ├── deprecated/         # 非推奨になったもの
│   └── rejected/           # 却下された提案
└── guides/                 # 開発ガイド・チュートリアル
```

#### 各フォルダの概要

- **implementation/**: 実装予定・実装中のタスクドキュメント（機能カテゴリごとに管理）
- **design/**: 設計段階のドキュメント（実装前の提案や現在採用している設計）
- **adr/**: アーキテクチャ上の重要な決定事項の記録（技術選定、設計方針など）
- **archive/**: 過去のドキュメント（実装完了記録、非推奨になった内容、却下された提案）
- **guides/**: 開発者向けの手順書やガイド（開発方法、テスト手順、コントリビューション方法）

### 利用ルール

- **implementation/** 配下は機能やコンポーネントの種類に応じてフォルダを作成
  - フォルダ名はプロジェクトの実装構造や機能カテゴリに合わせて柔軟に決定
  - 例：elements/、layout/、styles/、data-models/ など
  - 実装中のタスクドキュメントのみを配置（設計ドキュメントは `design/current/` に残す）
  - 実装完了後は `archive/completed/` へ移動
- **design/** は設計段階のドキュメントを管理
  - 設計ドキュメントのライフサイクル：
    1. 新規提案は `design/proposals/` に配置
    2. 採用された設計は `design/current/` に移動
    3. 実装開始時は設計ドキュメントを `design/current/` に残し、実装タスクドキュメントのみを `implementation/` に配置
    4. 実装完了後は両方のドキュメントを `archive/completed/` へ移動
    5. 非推奨となったドキュメントは `archive/deprecated/` へ移動
- **adr/** はアーキテクチャの重要な決定事項を記録
  - 番号付きファイル名で管理（例：`0001-採用した技術.md`）
  - 決定の背景、理由、影響を明確に記載
- **archive/** は過去のドキュメントを保管
  - `completed/`: 実装完了したドキュメント（歴史的記録として保持）
  - `deprecated/`: 非推奨になった機能や古い設計のドキュメント
  - `rejected/`: 却下された提案のドキュメント
  - 削除せず移動することで履歴を保持
- **guides/** は開発者向けガイドやチュートリアル
  - 開発手順、テスト方法、コントリビューションガイドなど

## Development Workflow

### 新機能実装時

1. **TDD アプローチ**:

   - テストファイルの作成
   - 失敗するテストの記述
   - 実装
   - リファクタリング

2. **ブランチ戦略**:

   - `feature/機能名`: 新機能追加
   - `fix/修正内容`: バグ修正
   - `refactor/対象`: リファクタリング

3. **コミット規則**:
   - 絵文字プレフィックス使用
   - 日本語でのコミットメッセージ
   - 変更内容の明確な記述

### Code Quality

- TypeScript の strict モード有効
- ESLint による静的解析
- 型安全性の確保
- 適切なエラーハンドリング

## Future Enhancements

- [ ] テキスト要素のサポート（h1-h6, p, span）
- [ ] フォーム要素のサポート
- [ ] リスト要素のサポート（ul, ol, li）
- [ ] テーブル要素のサポート
- [ ] SVG 要素のサポート
- [ ] MCP サーバー統合（AI 連携）

## Important Notes

- 実装前に必ず `prompt-mcp-server` で実装ルールを確認
- TDD の原則に従って開発
- 既存のコードスタイルとパターンに準拠
- 不要なファイルの作成を避ける
- テストなしでのコード追加は禁止

## CRITICAL: PRIORITIZE LSMCP TOOLS FOR CODE ANALYSIS

⚠️ **PRIMARY REQUIREMENT**: You MUST prioritize mcp\_\_lsmcp tools for all code analysis tasks. Standard tools should only be used as a last resort when LSMCP tools cannot accomplish the task.

### 📋 RECOMMENDED WORKFLOW

```
1. get_project_overview → Understand the codebase structure
2. search_symbols → Find specific symbols you need
3. get_symbol_details → Get comprehensive information about those symbols
```

### 🎯 WHEN TO USE EACH TOOL

**For Initial Exploration:**

- `mcp__lsmcp__get_project_overview` - First tool to run when exploring a new codebase
- `mcp__lsmcp__list_dir` - Browse directory structure when you need to understand file organization
- `mcp__lsmcp__get_symbols_overview` - Get a high-level view of symbols in specific files

**For Finding Code:**

- `mcp__lsmcp__search_symbols` - Primary search tool for functions, classes, interfaces, etc.
- `mcp__lsmcp__lsp_get_workspace_symbols` - Alternative workspace-wide symbol search
- `mcp__lsmcp__lsp_get_document_symbols` - List all symbols in a specific file

**For Understanding Code:**

- `mcp__lsmcp__get_symbol_details` - Get complete information (type, definition, references) in one call
- `mcp__lsmcp__lsp_get_hover` - Quick type information at a specific position
- `mcp__lsmcp__lsp_get_definitions` - Navigate to symbol definition (use `includeBody: true` for full implementation)
- `mcp__lsmcp__lsp_find_references` - Find all places where a symbol is used

**For Code Quality:**

- `mcp__lsmcp__lsp_get_diagnostics` - Check for errors in a specific file
- `mcp__lsmcp__lsp_get_code_actions` - Get available fixes and refactorings

**For Code Modification:**

- `mcp__lsmcp__lsp_rename_symbol` - Safely rename symbols across the codebase
- `mcp__lsmcp__lsp_format_document` - Format code according to language conventions
- `mcp__lsmcp__replace_range` - Make precise text replacements
- `mcp__lsmcp__replace_regex` - Pattern-based replacements
- `mcp__lsmcp__lsp_delete_symbol` - Remove symbols and their references

**For Developer Assistance:**

- `mcp__lsmcp__lsp_get_completion` - Get code completion suggestions
- `mcp__lsmcp__lsp_get_signature_help` - Get function parameter hints
- `mcp__lsmcp__lsp_check_capabilities` - Check what LSP features are available

### 📊 DETAILED WORKFLOW EXAMPLES

**1. EXPLORING A NEW CODEBASE**

```
1. mcp__lsmcp__get_project_overview
   → Understand structure, main components, statistics
2. mcp__lsmcp__search_symbols --kind "class"
   → Find all classes in the project
3. mcp__lsmcp__get_symbol_details --symbol "MainClass"
   → Deep dive into specific class implementation
```

**2. INVESTIGATING A BUG**

```
1. mcp__lsmcp__search_symbols --name "problematicFunction"
   → Locate the function
2. mcp__lsmcp__get_symbol_details --symbol "problematicFunction"
   → Understand its type, implementation, and usage
3. mcp__lsmcp__lsp_find_references --symbolName "problematicFunction"
   → See all places it's called
4. mcp__lsmcp__lsp_get_diagnostics --relativePath "path/to/file.ts"
   → Check for errors
```

**3. REFACTORING CODE**

```
1. mcp__lsmcp__search_symbols --name "oldMethodName"
   → Find the method to refactor
2. mcp__lsmcp__get_symbol_details --symbol "oldMethodName"
   → Understand current implementation and usage
3. mcp__lsmcp__lsp_rename_symbol --symbolName "oldMethodName" --newName "newMethodName"
   → Safely rename across codebase
4. mcp__lsmcp__lsp_format_document --relativePath "path/to/file.ts"
   → Clean up formatting
```

**4. ADDING NEW FEATURES**

```
1. mcp__lsmcp__get_project_overview
   → Understand existing architecture
2. mcp__lsmcp__search_symbols --kind "interface"
   → Find relevant interfaces to implement
3. mcp__lsmcp__get_symbol_details --symbol "IUserService"
   → Understand interface requirements
4. mcp__lsmcp__lsp_get_completion --line 50
   → Get suggestions while writing new code
```

**FALLBACK TOOLS (USE ONLY WHEN NECESSARY):**

- ⚠️ `Read` - Only when you need to see non-code files or LSMCP tools fail
- ⚠️ `Grep` - For text pattern searches in files (replaces removed search_for_pattern tool)
- ⚠️ `Glob` - Only when LSMCP file finding doesn't work
- ⚠️ `LS` - Only for basic directory listing when LSMCP fails
- ⚠️ `Bash` commands - Only for non-code operations or troubleshooting

### WHEN TO USE FALLBACK TOOLS

Use standard tools ONLY in these situations:

1. **Non-code files**: README, documentation, configuration files
2. **LSMCP tool failures**: When LSMCP tools return errors or no results
3. **Debugging**: When troubleshooting why LSMCP tools aren't working
4. **Special file formats**: Files that LSMCP doesn't support
5. **Quick verification**: Double-checking LSMCP results when needed

## Memory System

You have access to project memories stored in `.lsmcp/memories/`. Use these tools:

- `mcp__lsmcp__list_memories` - List available memory files
- `mcp__lsmcp__read_memory` - Read specific memory content
- `mcp__lsmcp__write_memory` - Create or update memories
- `mcp__lsmcp__delete_memory` - Delete a memory file

Memories contain important project context, conventions, and guidelines that help maintain consistency.

The context and modes of operation are described below. From them you can infer how to interact with your user
and which tasks and kinds of interactions are expected of you.
