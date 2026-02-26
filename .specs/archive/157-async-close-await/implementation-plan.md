# 157: 非同期 close() の未待機により失敗が見えない (#227)

## システム図

### 状態マシン図: startStdio ライフサイクル（変更後）

```
                          ┌──────────────┐
                          │   Initial    │
                          └──────┬───────┘
                                 │
                     シグナルハンドラ登録
                     (名前付き参照, process.on)
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Connecting  │──── SIGINT/SIGTERM(1回目) ────┐
                          └──────┬───────┘                              │
                                 │                                      │
                           connect()完了                                │
                                 │                                      │
                                 ▼                                      │
                          ┌──────────────┐                              │
                          │   Running    │──── SIGINT/SIGTERM(1回目) ────┤
                          └──────────────┘                              │
                                                                        │
                                                                        ▼
                                                         ┌─────────────────────┐
                     2回目シグナル ──────────────────────►│  Cleaning Up        │
                     → 強制exit(1)                       │  cleanupPromise     │
                                                         │  allSettled(        │
                                                         │   transport.close,  │
                                                         │   server.close)     │
                                                         └──────────┬──────────┘
                                                                    │
                                                         ┌──────────┴──────────┐
                                                         │                     │
                                                         ▼                     ▼
                                                 ┌──────────────┐    ┌──────────────────┐
                                                 │  Clean Exit  │    │  Exit with Log   │
                                                 │  (code 0)    │    │  (close失敗ログ) │
                                                 │              │    │  → exit(0)       │
                                                 └──────────────┘    └──────────────────┘
```

### データフロー図: cleanupPromise パターン + 強制終了

```
  [1回目のシグナル]              [2回目のシグナル]
        │                              │
        ▼                              ▼
  ┌────────────────────┐    ┌─────────────────────────┐
  │ cleanupPromise     │    │ cleanupPromise != null   │
  │ == null            │    │ → 強制 process.exit(1)   │
  │ → cleanup実行      │    │ (closeハング対策)        │
  │ → Promiseキャッシュ │    └─────────────────────────┘
  └───────┬────────────┘
          │
          ▼
  ┌─────────────────────────┐
  │  Promise.allSettled([   │
  │    transport.close(),   │
  │    server.close()       │
  │  ])                     │
  │  rejected → console.err │
  │  ("MCPクリーンアップ    │
  │   エラー (stdio):")     │
  └────────┬────────────────┘
           │
           ▼
  リスナー解除 + process.exit(0)
```

## 現状分析

### startHttp（対応済み）
- `cleanup` 関数は `async` で `await Promise.allSettled` を使用
- 二重呼び出し防止（`cleaned` フラグ）
- 失敗時のエラーログ出力済み
- テストも網羅的に存在

### startStdio（未対応 ← 今回の対象）
- `server.connect(transport)` 後にクリーンアップ処理がない
- プロセス終了時に `transport.close()` / `server.close()` が呼ばれない
- シグナルハンドリングが未実装

## 変更案

### [MODIFY] `src/mcp-server/index.ts`

**startStdio 関数にシグナルハンドリングとcleanup処理を追加:**

```typescript
export async function startStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  let cleanupPromise: Promise<void> | null = null;
  const cleanup = (): Promise<void> => {
    if (cleanupPromise) return cleanupPromise;
    cleanupPromise = (async () => {
      const results = await Promise.allSettled([
        transport.close(),
        server.close(),
      ]);
      for (const result of results) {
        if (result.status === "rejected") {
          console.error("MCPクリーンアップエラー (stdio):", result.reason);
        }
      }
    })();
    return cleanupPromise;
  };

  const removeSignalHandlers = () => {
    process.removeListener("SIGINT", onSigint);
    process.removeListener("SIGTERM", onSigterm);
  };

  const onSignal = (signal: string) => {
    // 2回目のシグナル: closeがハングしている場合の強制終了
    if (cleanupPromise) {
      console.error(`シグナル ${signal} を再受信しました。強制終了します。`);
      process.exit(1);
      return;
    }
    console.error(`シグナル ${signal} を受信しました。クリーンアップを実行します...`);
    cleanup().finally(() => {
      removeSignalHandlers();
      process.exit(0);
    });
  };

  const onSigint = () => onSignal("SIGINT");
  const onSigterm = () => onSignal("SIGTERM");

  // connect前にシグナルハンドラを登録（connect中のシグナルも捕捉）
  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);

  try {
    await server.connect(transport);
  } catch (err) {
    // シャットダウン中のconnect失敗は握りつぶす（cleanup側で処理される）
    if (cleanupPromise) {
      await cleanupPromise;
      return;
    }
    removeSignalHandlers();
    throw err;
  }

  console.error("MCPサーバーを起動しました（トランスポート: stdio）");
}
```

**設計ポイント（Codexレビュー4回分の指摘対応）:**

1. **cleanupPromise パターン**: `cleaned` フラグではなく `cleanupPromise` をキャッシュ。1回目のシグナルではclose()完了を待ってからexit
2. **2回目シグナル = 強制終了**: `cleanupPromise != null` なら close がハングしていると判断し、`process.exit(1)` で即時強制終了
3. **名前付きハンドラ参照**: `onSigint`/`onSigterm` を変数化。cleanup完了後に `removeListener` で確実に解除（リーク防止）
4. **シグナルハンドラ登録タイミング**: `connect()` の前に登録し、connect中のシグナルも捕捉
5. **connect中シグナル競合の解消**: `try/catch` で `connect` を囲み、`cleanupPromise` が存在する場合（＝シャットダウン中）はconnect失敗を握りつぶしてcleanup完了を待つ。通常のconnect失敗時はハンドラを解除してrethrow
6. **終了コード方針**:
   - 正常シャットダウン（1回目シグナル、cleanup完了）: `exit(0)` — close失敗時もログ出力後にexit(0)（startHttpと同じ方針。close失敗はログで可観測、プロセス終了自体は正常扱い）
   - 強制終了（2回目シグナル、closeハング）: `exit(1)`
   - 予期しないエラー: 既存の `exit(1)` で処理

### [MODIFY] `src/mcp-server/__tests__/index.test.ts`

**テスト前提の修正:**
- `StdioServerTransport` モックに `close` メソッドを追加（現状 `{}` 返却のため）
- `process.exit` を `vi.spyOn` でモック化し、実装を空にする（テストプロセスの終了防止）
- シグナル発火は `process.emit("SIGINT")` を使用
- テスト前後でリスナー参照を追跡し、追加分のみ `removeListener` で解除（`removeAllListeners` は使用しない）

**追加テスト:**

1. `startStdio: SIGINTでtransport.closeとserver.closeが呼ばれること`
2. `startStdio: SIGTERMでtransport.closeとserver.closeが呼ばれること`
3. `startStdio: cleanup内のclose()が失敗した時にエラーログが出力されること`
4. `startStdio: 複数シグナルでもcloseは各1回のみ`
5. `startStdio: close()完了前にprocess.exitが呼ばれないこと（Deferredパターン）`
6. `startStdio: 2回目のシグナルでprocess.exit(1)による強制終了`
7. `startStdio: シグナルハンドラがconnect前に登録されること`

## 検証計画

1. **ユニットテスト**: `pnpm run test src/mcp-server/__tests__/index.test.ts`
2. **型チェック**: `pnpm run type-check`
3. **リント**: `pnpm run lint`
4. **既存テストの回帰確認**: 全テスト実行 `pnpm test`

## リスク

- `process.exit` のモックが必須（未モックだとテストプロセスが終了）
- テスト間でシグナルリスナーが残らないよう、テストで追加したリスナーのみを `removeListener` で解除
- `StdioServerTransport` モックに `close` メソッド追加が必要（現状 `{}` 返却のため）
- `process.emit("SIGINT")` はVitestのwatch modeではプロセスに影響するため、CI環境での安定性を確認する
- `index.ts` の `main()` はimport時に実行されるが、既存テストのvi.mockで `parseArgs`/`createServer` がモック化されているため問題なし
