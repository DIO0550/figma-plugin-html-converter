# Implementation Plan: index.ts のトップレベル副作用の分離

## Issue

- [#228](https://github.com/DIO0550/figma-plugin-html-converter/issues/228)

## 概要

`src/mcp-server/index.ts` のトップレベルで `main().catch(...)` と `process.on("unhandledRejection", ...)` が無条件実行されるため、import時に副作用が発生する。CLI起動ロジックを専用ファイルに分離し、`index.ts` を純粋な公開APIモジュールにする。

## 状態マシン図

```
┌─────────────────────────────────────────────────────┐
│              モジュールのライフサイクル                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Before: index.ts]                                 │
│                                                     │
│  ┌──────────┐    import    ┌──────────────────────┐ │
│  │ Not      │─────────────→│ Loaded               │ │
│  │ Imported │              │ (副作用即時実行)       │ │
│  └──────────┘              │  ├ unhandledRejection │ │
│                            │  └ main().catch()     │ │
│                            └──────────┬───────────┘ │
│                                       │             │
│                                       ▼             │
│                            ┌──────────────────────┐ │
│                            │ Running              │ │
│                            │ (CLI起動・常駐)       │ │
│                            └──────────────────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [After: index.ts + run.ts]                         │
│                                                     │
│  ┌──────────┐  import index  ┌─────────────────┐   │
│  │ Not      │───────────────→│ API Ready       │   │
│  │ Imported │                │ (副作用なし)      │   │
│  └──────────┘                │ exportのみ公開    │   │
│       │                      └─────────────────┘   │
│       │                                             │
│       │    import run     ┌──────────────────────┐  │
│       └──────────────────→│ CLI Starting         │  │
│                           │ (副作用実行)          │  │
│                           │  ├ unhandledRejection │  │
│                           │  └ main().catch()     │  │
│                           └──────────┬───────────┘  │
│                                      ▼              │
│                           ┌──────────────────────┐  │
│                           │ Running              │  │
│                           │ (CLI起動・常駐)       │  │
│                           └──────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## データフロー図

```
[CLI実行: node dist-mcp/index.js]
  │
  ▼
run.ts (ビルドエントリポイント)
  │
  ├─→ process.on("unhandledRejection")  ← グローバルエラーハンドラ登録
  │
  ├─→ main()
  │     │
  │     ├─→ parseArgs(process.argv.slice(2))  ← cli.ts
  │     │     └─→ CliOptions { transport, port, warnings }
  │     │
  │     ├─→ [transport === "stdio"]
  │     │     └─→ startStdio()  ← index.ts (API)
  │     │           └─→ createServer() + StdioServerTransport
  │     │
  │     └─→ [transport === "http"]
  │           └─→ startHttp(port)  ← index.ts (API)
  │                 └─→ createMcpExpressApp() + StreamableHTTPServerTransport
  │
  └─→ main().catch() → console.error → process.exit(1)


[ライブラリ利用: import from "./index"]
  │
  ▼
index.ts (純粋モジュール)
  │
  ├─→ createServer   (re-export from server.ts)
  ├─→ startStdio()   (stdio起動関数)
  └─→ startHttp()    (HTTP起動関数)
       └─→ 副作用なし、関数のみが取得される
```

## 変更ファイル一覧

| ファイル | タグ | 変更内容 |
|---|---|---|
| `src/mcp-server/run.ts` | `[NEW]` | CLIエントリポイント。main関数、unhandledRejectionハンドラ、main().catch()を配置 |
| `src/mcp-server/index.ts` | `[MODIFY]` | main関数、unhandledRejectionハンドラ、main().catch()を削除。parseArgsのimportも削除 |
| `src/mcp-server/__tests__/index.sideeffect.test.ts` | `[NEW]` | import副作用なし検証テスト（動的import + vi.resetModules使用） |
| `src/mcp-server/__tests__/run.test.ts` | `[NEW]` | run.tsの配線検証テスト（モック + 動的import使用） |
| `vite.mcp.config.ts` | `[MODIFY]` | ビルドエントリポイントを `index.ts` → `run.ts` に変更 |

## 詳細設計

### 1. `src/mcp-server/run.ts` [NEW]

```typescript
import { parseArgs } from "./cli";
import { startStdio, startHttp } from "./index";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  for (const w of options.warnings) {
    console.warn(w);
  }
  if (options.transport === "stdio") {
    await startStdio();
  } else {
    await startHttp(options.port);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error(
    `未処理のPromise rejection: ${reason instanceof Error ? reason.message : String(reason)}`,
  );
});

main().catch((err) => {
  console.error(
    `エラー: 予期しないエラーが発生しました: ${err instanceof Error ? err.message : String(err)}`,
  );
  process.exit(1);
});
```

### 2. `src/mcp-server/index.ts` [MODIFY]

- `main()` 関数を削除
- `process.on("unhandledRejection", ...)` を削除
- `main().catch(...)` を削除
- `import { parseArgs } from "./cli"` を削除（startStdio/startHttpが直接parseArgsを使わないため）
- 既存のexport（`createServer`, `startStdio`, `startHttp`）はそのまま維持

### 3. `vite.mcp.config.ts` [MODIFY]

```typescript
entry: resolve(__dirname, "src/mcp-server/run.ts"),
```

### 4. テスト

#### `src/mcp-server/__tests__/index.sideeffect.test.ts` [NEW]

import副作用なし検証の専用テストファイル。静的importでは監視開始前にモジュールが評価されるため、動的importを使用する。

検証対象: import時に以下が発生しないこと
- `process.on("unhandledRejection", ...)` によるリスナー追加
- `process.exit()` の呼び出し

実装方針:
```typescript
import { test, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

test("index.tsをimportしてもunhandledRejectionリスナーが追加されない", async () => {
  const listenersBefore = process.listeners("unhandledRejection").length;
  await import("../index");
  const listenersAfter = process.listeners("unhandledRejection").length;
  expect(listenersAfter).toBe(listenersBefore);
});

test("index.tsをimportしてもprocess.exitが呼ばれない", async () => {
  const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
  await import("../index");
  expect(exitSpy).not.toHaveBeenCalled();
  exitSpy.mockRestore();
});

test("index.tsをimportしてもstartStdio/startHttpが実行されない", async () => {
  // parseArgsがモックされていなくても、main()が存在しなければ呼ばれない
  // main()削除後はこのテストで配線ミスの回帰を検出する
  const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  await import("../index");
  expect(exitSpy).not.toHaveBeenCalled();
  expect(errorSpy).not.toHaveBeenCalled();
  exitSpy.mockRestore();
  errorSpy.mockRestore();
});
```

#### `src/mcp-server/__tests__/run.test.ts` [NEW]

`run.ts` の配線（main関数の分岐・エラーハンドリング）を検証する軽量統合テスト。
`./cli` と `./index` をモックし、以下を検証:
- `parseArgs` → `startStdio` の配線（stdio分岐）
- `parseArgs` → `startHttp(port)` の配線（http分岐）
- `startStdio` / `startHttp` がrejectした場合に `process.exit(1)` が呼ばれること

実装方針:
- テストファイルからの相対パスで `vi.mock("../cli")` / `vi.mock("../index")` でモック化
- `vi.resetModules()` + 動的 `import("../run")` でテスト実行
- `parseArgs` がthrowした場合に `main().catch` → `console.error` → `process.exit(1)` の経路も検証
- `beforeEach/afterEach` で `unhandledRejection` リスナー配列をスナップショットし、追加分を関数参照で除去。`vi.restoreAllMocks()` も必須で呼び出す

## 検証計画

1. **index.tsテスト**: `pnpm run test src/mcp-server/__tests__/index.test.ts` - startStdio/startHttpの既存テスト通過
2. **副作用テスト**: `pnpm run test src/mcp-server/__tests__/index.sideeffect.test.ts` - import副作用なし検証通過
3. **run.tsテスト**: `pnpm run test src/mcp-server/__tests__/run.test.ts` - 配線検証テスト通過
4. **ビルド検証**: `pnpm run mcp:build` - ビルドが成功し `dist-mcp/index.js` が生成される
5. **CLI起動経路確認**: `node dist-mcp/index.js --transport=invalid` を実行し、`main().catch` 経由でエラー出力＆プロセス終了（exit code 1）することを確認
6. **型チェック**: `pnpm run type-check` - 型エラーなし
7. **リント**: `pnpm run lint` - リントエラーなし
8. **全テスト**: `pnpm test` - プロジェクト全体のテストスイートが通過

## 影響範囲

- MCPサーバーの起動方法（`pnpm run mcp:start` / `pnpm run mcp:dev:http`）に変更なし（ビルド成果物のエントリが変わるだけ）
- `dist-mcp/index.js` は非公開CLI成果物でありAPI互換対象外。`run.ts` がエントリポイントとなり、副作用（main実行・unhandledRejection登録）を含む。外部からのAPI利用はソースモジュール `src/mcp-server/index.ts` を直接参照する想定
- 既存のexport API (`createServer`, `startStdio`, `startHttp`) に変更なし
- グローバル例外ハンドリング（`unhandledRejection`）はCLIエントリ（`run.ts`）側の責務へ移動。ライブラリとしてimportする場合、利用者側で独自のエラーハンドリングを設定する必要がある
- テストの大半は既存のindex.test.tsをそのまま利用可能
