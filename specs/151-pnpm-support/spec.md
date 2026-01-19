# Feature Specification: pnpm対応

**Feature Branch**: `151-pnpm-support`
**Created**: 2025-12-28
**Status**: Draft
**Input**: User description: "pnpmの対応を追加。minimumReleaseAgeは7200にする"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 開発者がpnpmで依存関係をインストールする (Priority: P1)

開発者として、プロジェクトをクローンした後、pnpmを使用して依存関係をインストールし、開発を開始したい。

**Why this priority**: pnpmでの開発環境構築は、このプロジェクトに参加するすべての開発者が最初に行う必須アクションであり、最も基本的な機能。

**Independent Test**: `pnpm install` を実行し、すべての依存関係が正しくインストールされることを確認することで独立してテスト可能。

**Acceptance Scenarios**:

1. **Given** プロジェクトをクローンした状態, **When** `pnpm install`を実行, **Then** すべての依存関係がnode_modulesにインストールされ、pnpm-lock.yamlが生成・更新される
2. **Given** 依存関係がインストールされた状態, **When** `pnpm run dev`を実行, **Then** 開発サーバーが正常に起動する
3. **Given** 依存関係がインストールされた状態, **When** `pnpm test`を実行, **Then** すべてのテストが実行される
4. **Given** 既存のpackage-lock.jsonがある状態, **When** `pnpm import`を実行, **Then** package-lock.jsonからpnpm-lock.yamlが生成される

---

### User Story 2 - CIでpnpmを使用したビルドとテスト (Priority: P2)

CI/CDパイプラインとして、pnpmを使用してプロジェクトのビルド、テスト、リントを実行し、品質を担保したい。

**Why this priority**: 自動化されたCI/CDは品質保証の要であり、pnpmへの移行後も継続的なデプロイとテストが必要。

**Independent Test**: プルリクエストを作成し、CIワークフローがpnpmを使用して正常に完了することで独立してテスト可能。

**Acceptance Scenarios**:

1. **Given** プルリクエストが作成された状態, **When** CIワークフローが実行される, **Then** pnpmで依存関係がインストールされ、テストが成功する
2. **Given** CIワークフローが実行中, **When** ビルドステップが実行される, **Then** pnpmを使用してビルドが成功し、成果物が生成される
3. **Given** CIワークフローが実行中, **When** リントとタイプチェックが実行される, **Then** pnpmを使用してすべてのチェックが通過する

---

### User Story 3 - Renovateによる自動依存関係更新 (Priority: P3)

プロジェクトメンテナーとして、Renovateが依存関係を自動的に更新し、セキュリティと最新機能を維持したい。minimumReleaseAgeを7200秒に設定して、リリース直後の不安定なバージョンを避けたい。

**Why this priority**: 依存関係の自動更新は長期的なプロジェクト健全性に重要だが、日常の開発作業に直接影響しない。

**Independent Test**: 新しいパッケージバージョンがリリースされた後、7200秒（2時間）以上経過してからRenovateがPRを作成することで独立してテスト可能。

**Acceptance Scenarios**:

1. **Given** Renovateが有効化された状態, **When** 新しいパッケージバージョンがリリースされてから7200秒未満, **Then** PRは作成されない
2. **Given** Renovateが有効化された状態, **When** 新しいパッケージバージョンがリリースされてから7200秒以上経過, **Then** 自動的にPRが作成される
3. **Given** RenovateによるPRが作成された状態, **When** PRをマージ, **Then** pnpm-lock.yamlが正しく更新される

---

### Edge Cases

- pnpmがインストールされていない環境でプロジェクトをセットアップしようとした場合、適切なエラーメッセージが表示されるか？
- package-lock.jsonとpnpm-lock.yamlが両方存在する場合、どちらが優先されるか？
- CI環境でpnpmのキャッシュが正しく機能するか？
- Renovateがpnpm-lock.yamlを正しく更新できるか？

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: プロジェクトはpnpmをプライマリパッケージマネージャとして使用すること
- **FR-002**: `pnpm install`コマンドで全ての依存関係がインストールできること
- **FR-003**: 全てのnpm scriptsがpnpmで正常に動作すること（dev, build, test, lint, type-check, coverage）
- **FR-004**: CI/CDワークフローはpnpmを使用してビルドとテストを実行すること
- **FR-005**: Renovate設定でminimumReleaseAgeを7200秒（2時間）に設定すること
- **FR-006**: pnpm-lock.yamlがバージョン管理されること
- **FR-007**: package.jsonにpackageManagerフィールドを追加し、使用するpnpmバージョンを明示すること
- **FR-008**: `pnpm import`を使用して既存のpackage-lock.jsonからpnpm-lock.yamlを生成すること
- **FR-009**: 移行完了後、不要になったpackage-lock.jsonを削除すること

### Key Entities

- **pnpm-lock.yaml**: 依存関係のロックファイル。すべての依存パッケージの正確なバージョンとハッシュを記録
- **renovate.json**: Renovate設定ファイル。依存関係の自動更新ルールを定義
- **package.json**: プロジェクト設定ファイル。packageManagerフィールドでpnpmバージョンを指定

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm install`が30秒以内に完了する（初回インストール時、キャッシュなし）
- **SC-002**: すべての既存テスト（100%）がpnpm環境で通過する
- **SC-003**: CIパイプラインの実行時間が従来のnpm使用時と同等または高速になる
- **SC-004**: Renovateが新パッケージリリースから7200秒経過後に更新PRを作成する
- **SC-005**: 開発者がpnpmコマンドを使用して、すべての開発タスク（ビルド、テスト、リント）を完了できる

## Assumptions

- pnpm v9系を使用する（最新の安定版）
- 既存のnpm scriptsは変更不要（pnpmはnpm scriptsと互換性がある）
- Renovateは既にGitHubアプリとして利用可能
- 開発者はpnpmをローカル環境にインストールできる
