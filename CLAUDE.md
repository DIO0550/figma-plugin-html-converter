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