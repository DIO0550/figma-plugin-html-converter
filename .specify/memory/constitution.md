# Figma Plugin HTML Converter Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)
TDD（テスト駆動開発）は必須です：
- テストを先に書く → ユーザー承認 → テストが失敗することを確認 → 実装
- Red-Green-Refactorサイクルを厳格に遵守
- 全ての機能に対してユニットテストと統合テストを実装
- コードカバレッジ95%以上を維持

### II. Type Safety First
TypeScriptの型安全性を最大限に活用：
- strict モードを有効化
- 型推論を活用した使いやすいAPI
- unknown型の適切な使用と型ガード
- any型の使用を禁止

### III. Modular Architecture
モジュラーなアーキテクチャを維持：
- 各HTML要素に対応する独立したコンバーター
- 明確な責任分離（属性、要素、変換ロジック）
- 共通機能はユーティリティとして抽出
- 再利用可能なコンポーネント設計

### IV. Consistency with Existing Patterns
既存の実装パターンを踏襲：
- 同じディレクトリ構造を維持
- 命名規則の統一
- コーディングスタイルの一貫性
- 既存のユーティリティ関数を活用

### V. Documentation and Clarity
明確なドキュメントとコメント：
- JSDocコメントを全ての公開APIに記載
- 型定義に詳細な説明を含める
- 複雑なロジックには実装コメントを追加
- READMEとCLAUDE.mdを最新に保つ

## Quality Gates

### Pre-Implementation Gates
1. **仕様の明確化**: 実装前に詳細な仕様書（spec.md）を作成
2. **設計レビュー**: アーキテクチャの決定を文書化
3. **テスト計画**: 実装前にテストケースを定義

### Implementation Gates
1. **テストファースト**: 必ず失敗するテストを先に書く
2. **小さなステップ**: 一度に一つの機能を実装
3. **リファクタリング**: 動作するコードを綺麗にする

### Pre-Commit Gates
1. **全テストの通過**: `npm run test` がパスすること
2. **Lintチェック**: `npm run lint` がエラーなしで完了すること
3. **型チェック**: `npm run type-check` がエラーなしで完了すること
4. **カバレッジ**: 95%以上のコードカバレッジを維持

### Code Review Gates
1. **パターン一貫性**: 既存実装と同じパターンを使用
2. **型安全性**: any型の使用がないこと
3. **ドキュメント**: JSDocとコメントが適切に記載されていること
4. **テスト品質**: エッジケースがカバーされていること

## Development Workflow

### 1. ブランチ戦略
- `main`: 安定版ブランチ
- `001-feature-name`: SpecKit準拠の機能ブランチ
- `feature/issue-xxx-element-name`: 従来型の機能ブランチ

### 2. 実装フロー
1. **計画**: `/speckit.plan` でspec.md、research.md、data-model.mdを生成
2. **タスク分解**: `/speckit.tasks` でtasks.mdを生成
3. **実装**: TDDサイクルで実装
4. **品質チェック**: test、lint、type-checkを実行
5. **コミット**: コミットルールに従ってコミット
6. **PR作成**: テンプレートに従ってPR作成

### 3. コミット規則
- 絵文字プレフィックス使用
- 日本語でのコミットメッセージ
- 変更内容の明確な記述
- `commit.prompt.md` のルールに従う

## Technology Stack

### Core Technologies
- **Language**: TypeScript（strict mode）
- **Testing**: Vitest
- **Linting**: ESLint
- **Runtime**: Figma Plugin Sandbox

### Key Dependencies
- Figma Plugin API
- HTML Parser (parse5等、必要に応じて)
- 既存のユーティリティ関数群

### Constraints
- Figmaプラグインはサンドボックス環境で実行
- UIとプラグインコード間はpostMessageで通信
- ブラウザDOMは使用不可

## Complexity Management

### When to Justify Complexity
以下の場合のみ、複雑性の導入を許可（要文書化）：
1. **パフォーマンス要件**: 明確な測定値と改善幅を示す
2. **Figma API制約**: API制限による回避策
3. **ユーザー要件**: 実際のユースケースに基づく必要性

### Simplicity Principles
- YAGNI（You Aren't Gonna Need It）の原則を適用
- 最もシンプルな実装から開始
- 早期の最適化を避ける
- 抽象化は具体的なニーズが明確になってから

## Governance

### Constitution Updates
- Constitution の更新には理由の文書化が必要
- 重大な変更はチーム承認が必要
- 変更履歴をバージョンと共に記録

### Compliance Verification
- 全てのPR/レビューでConstitution準拠を確認
- 違反は正当な理由がない限り却下
- 継続的な改善を推奨

**Version**: 1.0.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
