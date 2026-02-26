# 157: 非同期 close() の未待機により失敗が見えない (#227) - タスク

## Research & Planning

- [x] Issue #227 の要件確認
- [x] 現在のコード状態の分析（startHttp は対応済み、startStdio は未対応）
- [x] implementation-plan.md の作成
- [x] Codexレビュー（4ラウンド完了、全指摘対応済み）

## Implementation

### 1. StdioServerTransport モックの拡張
- [x] `mockStdioTransportInstance` に `close` メソッドを追加
- [x] 既存の startStdio テストが引き続きパスすることを確認

### 2. startStdio の cleanup + シグナルハンドリング実装
- [x] `cleanupPromise` パターンの実装
- [x] `onSignal` / `onSigint` / `onSigterm` ハンドラの実装
- [x] `removeSignalHandlers` による明示的リスナー解除
- [x] `connect()` の try/catch（シャットダウン中の競合対策）
- [x] JSDoc の更新（シグナルハンドリングの説明追加）

### 3. startStdio シグナルハンドリングのテスト追加
- [x] `startStdio: SIGINTでtransport.closeとserver.closeが呼ばれること`
- [x] `startStdio: SIGTERMでtransport.closeとserver.closeが呼ばれること`
- [x] `startStdio: cleanup内のclose()が失敗した時にエラーログが出力されること`
- [x] `startStdio: 複数シグナルでもcloseは各1回のみ`
- [x] `startStdio: close()完了前にprocess.exitが呼ばれないこと（Deferredパターン）`
- [x] `startStdio: 2回目のシグナルでprocess.exit(1)による強制終了`
- [x] `startStdio: シグナルハンドラがconnect前に登録されること`

## Verification

- [x] `pnpm run test src/mcp-server/__tests__/index.test.ts` — 新規テスト + 既存テスト全パス
- [x] `pnpm run type-check` — 型エラーなし
- [x] `pnpm run lint` — リントエラーなし
- [x] `pnpm test` — 全テストスイートの回帰確認
