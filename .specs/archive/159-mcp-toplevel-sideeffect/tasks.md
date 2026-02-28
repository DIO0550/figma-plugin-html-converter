# Tasks: index.ts のトップレベル副作用の分離

## Issue

- [#228](https://github.com/DIO0550/figma-plugin-html-converter/issues/228)

## Research & Planning

- [x] R-1: 現在の `index.ts` の副作用コード特定（main関数、unhandledRejectionハンドラ、main().catch()）
- [x] R-2: 既存テスト（index.test.ts）の構造確認
- [x] R-3: ビルド設定（vite.mcp.config.ts）とスクリプト（package.json）の確認
- [x] R-4: ファイル命名決定（run.ts）

## Implementation

- [x] I-1: `src/mcp-server/run.ts` を新規作成
  - index.tsからmain関数、process.on("unhandledRejection")、main().catch()を移動
  - import先を `./cli`（parseArgs）と `./index`（startStdio, startHttp）に設定
- [x] I-2: `src/mcp-server/index.ts` から副作用コードを削除
  - main()関数の削除
  - process.on("unhandledRejection", ...)の削除
  - main().catch(...)の削除
  - `import { parseArgs } from "./cli"` の削除
  - 既存export（createServer, startStdio, startHttp）は維持
- [x] I-3: `vite.mcp.config.ts` のエントリポイント変更
  - entry: `src/mcp-server/index.ts` → `src/mcp-server/run.ts`
- [x] I-4: `src/mcp-server/__tests__/index.sideeffect.test.ts` を新規作成
  - vi.resetModules() + 動的importでimport副作用なし検証
  - unhandledRejectionリスナー追加なし検証
  - process.exit呼び出しなし検証
  - startStdio/startHttp非実行検証
- [x] I-5: `src/mcp-server/__tests__/run.test.ts` を新規作成
  - vi.mock("../cli") + vi.mock("../index") でモック化
  - stdio分岐（parseArgs → startStdio）の配線検証
  - http分岐（parseArgs → startHttp(port)）の配線検証
  - parseArgs throw時のprocess.exit(1)検証
  - beforeEach/afterEachでunhandledRejectionリスナーのスナップショット・復元

## Verification

- [x] V-1: `pnpm run test src/mcp-server/__tests__/index.test.ts` - 既存テスト通過
- [x] V-2: `pnpm run test src/mcp-server/__tests__/index.sideeffect.test.ts` - 副作用テスト通過
- [x] V-3: `pnpm run test src/mcp-server/__tests__/run.test.ts` - 配線テスト通過
- [x] V-4: `pnpm run mcp:build` - ビルド成功
- [x] V-5: `node dist-mcp/index.js --transport=invalid` - エラー出力＆exit code 1
- [x] V-6: `pnpm run type-check` - 型エラーなし
- [x] V-7: `pnpm run lint` - リントエラーなし
- [x] V-8: `pnpm test` - 全テスト通過
