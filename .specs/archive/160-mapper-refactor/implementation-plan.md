# 実装計画: mapHTMLNodeToFigma フェーズ分割リファクタリング

**Issue**: #230 - [Medium] mapHTMLNodeToFigma が巨大化し意図の追跡が困難
**対象ファイル**: `src/converter/mapper.ts`

## システム図

### 状態マシン図（現在の処理フロー）

```
┌─────────────────────────────────────────────────┐
│            mapHTMLNodeToFigma (入口)              │
│  (htmlNode, options) => FigmaNodeConfig          │
└─────────┬───────────────────────────────────────┘
          │
          ▼
┌──────────────────┐   Yes   ┌──────────────┐
│ isText / isComment├────────►│ 早期リターン   │
└────────┬─────────┘         └──────────────┘
         │ No
         ▼
┌──────────────────┐
│ resolveByTag      │  タグ名で要素判定
│ (L67-L209)        │  → nodeConfig を決定
└────────┬─────────┘
         ▼
┌──────────────────┐
│ applyStyles       │  style属性がある場合のみ
│ (L211-L434)       │
│ ├─ autoLayout     │  (L218-L233)
│ ├─ padding        │  (L235-L263)
│ ├─ positioning    │  (L265-L320)
│ ├─ margin         │  (L322-L326)
│ ├─ sizing         │  (L328-L414)
│ └─ visual         │  (L416-L433)
└────────┬─────────┘
         ▼
┌──────────────────┐
│ appendChildren    │  子要素がある場合のみ
│ (L437-L490)       │
│ ├─ 子要素再帰     │
│ ├─ display補正    │
│ └─ コンテナサイズ  │
└────────┬─────────┘
         ▼
    return nodeConfig
```

### データフロー図

```
HTMLNode + ConversionOptions
        │
        ▼
┌───────────────┐
│ resolveByTag  │──► FigmaNodeConfig (初期状態)
└───────┬───────┘
        │ nodeConfig (mutable)
        ▼
┌───────────────┐
│ parseStyles   │──► Styles (パース済みスタイル)
└───────┬───────┘
        │ styles
        ├──────────────────────────────────────┐
        ▼                                      ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│applyAutoLayout│  │ applyPadding │  │applyPosition │
│ styles→node  │  │ styles→node  │  │ styles→node  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  ▼
       ├─────────────────┴──────────────────┤
       ▼                                    │
┌──────────────┐  ┌──────────────┐          │
│ applySizing  │  │applyVisualSt │          │
│ styles→node  │  │ styles→node  │          │
└──────┬───────┘  └──────┬───────┘          │
       │                 │                  │
       ▼                 ▼                  ▼
       ├─────────────────┴──────────────────┤
       ▼
┌──────────────┐
│appendChildren│──► nodeConfig (最終状態)
│ htmlNode,    │
│ options→node │
└──────┬───────┘
       ▼
  FigmaNodeConfig (return)
```

## 変更ファイル一覧

| ファイル | タグ | 概要 |
|---------|------|------|
| `src/converter/mapper.ts` | `[MODIFY]` | フェーズ関数への分割リファクタリング |
| `src/converter/mapper-phases-*.test.ts` | `[NEW]` | フェーズ動作の統合・回帰テスト（resolve/styles/fallback/children の4ファイルに分割） |

## 変更内容

### `src/converter/mapper.ts` [MODIFY]

現在の `mapHTMLNodeToFigma` 関数（約490行）を以下の7つのプライベート関数に分割する：

#### 1. `resolveByTag(htmlNode, tagName, normalizedOptions)` → `ResolveResult`

戻り値の型定義：
```typescript
type ResolveResult =
  | { earlyReturn: true; nodeConfig: FigmaNodeConfig }
  | { earlyReturn: false; nodeConfig: FigmaNodeConfig };
```

- **責務**: タグ名に基づいて初期 FigmaNodeConfig を決定
- **対象行**: 現L67〜L209
- **内容**: p/a/interactive/progress/meter/inlineSemantic/img/video/audio/iframe/embed/object/text/list の判定と初期ノード生成
- **早期リターン要素**（p, a, summary, details, dialog, progress, meter, inlineSemantic）は専用コンバーターが**非nullを返した場合のみ** `{ earlyReturn: true, nodeConfig }` を返す。`null` の場合は通常のフレーム生成フローに進み `{ earlyReturn: false, nodeConfig }` を返す。呼び出し元は `earlyReturn === true` の場合に即座に return

#### 2. `applyAutoLayout(nodeConfig, styles)` → `void`
- **責務**: Flexbox → AutoLayout の変換
- **対象行**: 現L218〜L233
- **内容**: layoutMode, primaryAxisAlignItems, counterAxisAlignItems, padding, itemSpacing, layoutWrap の設定

#### 3. `applyPadding(nodeConfig, styles)` → `void`
- **責務**: padding のみの適用（AutoLayout がない場合）
- **対象行**: 現L235〜L263
- **内容**: 個別padding → ショートハンドpadding の優先順位処理
- **適用条件**: `!nodeConfig.layoutMode || nodeConfig.layoutMode === "NONE"` の場合にのみ実行（現行実装L235と同一条件）

#### 4. `applyPositioning(nodeConfig, styles)` → `void`
- **責務**: position, constraints, z-index の適用
- **対象行**: 現L265〜L320
- **内容**: absolute/fixed/relative のハンドリング、constraint 計算
- **z-index適用条件**: `position` が non-static（`absolute`/`fixed`/`relative`）の場合にのみ `zIndex` を設定する（現行互換）。`position` 未指定や `static` の場合は `z-index` スタイルがあっても無視する

#### 5. `applySizing(nodeConfig, styles)` → `void`
- **責務**: width/height/min/max/aspectRatio/flex/margin の適用
- **対象行**: 現L322〜L414
- **内容**: margin、px/% サイズ、min/max サイズ、aspectRatio 計算、flexGrow/Shrink、constraints補完

#### 6. `applyVisualStyles(nodeConfig, styles)` → `void`
- **責務**: 背景色、ボーダー、角丸の適用
- **対象行**: 現L416〜L433
- **内容**: backgroundColor → fills、border → strokes、borderRadius → cornerRadius

#### 7. `appendChildren(nodeConfig, htmlNode, tagName, normalizedOptions, styles)` → `void`
- **責務**: 子要素の再帰処理とコンテナ補正
- **対象行**: 現L437〜L490
- **内容**: 子要素再帰、display補正、body/html/divのコンテナサイズ補正
- **styles引数**: `Styles | null` 型。display補正（L454-L469）でstyle情報を参照するため、Phase 2でパース済みのstylesを受け取る。style属性がない場合は `null`
- **適用条件**: `htmlNode.children && htmlNode.children.length > 0` の場合のみ処理を実行する（現行実装と同一条件）。子要素が空の場合は何もしない
- **コメント除外後の早期return**: コメントノード除外後に `children.length === 0` の場合はdisplay補正・コンテナサイズ補正を実行せず即return（コメントのみ子要素のケースに対応）

### リファクタリング後の `mapHTMLNodeToFigma` 構造

```typescript
export function mapHTMLNodeToFigma(
  htmlNode: HTMLNode,
  options: ConversionOptions = {},
): FigmaNodeConfig {
  const normalizedOptions = ConversionOptions.from(options);

  // テキスト・コメントの早期リターン
  if (HTMLNode.isText(htmlNode)) { ... }
  if (HTMLNode.isComment(htmlNode)) { ... }

  const tagName = htmlNode.tagName || "unknown";

  // Phase 1: タグによるノード解決
  const resolved = resolveByTag(htmlNode, tagName, normalizedOptions);
  if (resolved.earlyReturn) return resolved.nodeConfig;
  const nodeConfig = resolved.nodeConfig;

  // スタイルのパースは1回のみ
  let styles: Styles | null = null;
  if (htmlNode.attributes?.style) {
    const attributes = Attributes.from(htmlNode.attributes);
    const styleStr = Attributes.getStyle(attributes);
    if (styleStr) {
      styles = Styles.parse(styleStr);
    }
  }

  // Phase 2: スタイル適用
  if (styles) {
    applyAutoLayout(nodeConfig, styles);
    applyPadding(nodeConfig, styles);
    applyPositioning(nodeConfig, styles);
    applySizing(nodeConfig, styles);
    applyVisualStyles(nodeConfig, styles);
  }

  // Phase 3: 子要素処理（stylesはdisplay補正に必要なため渡す）
  appendChildren(nodeConfig, htmlNode, tagName, normalizedOptions, styles);

  return nodeConfig;
}
```

### `src/converter/mapper-phases.test.ts` [NEW]

mapHTMLNodeToFigma の公開APIを通じた統合・回帰テスト。各フェーズの動作を検証：

- **入口（text/comment）回帰テスト**: テキストノード → TEXT返却、コメントノード → "Comment"フレーム返却
- **resolveByTag 統合テスト**: 各タグ種別（div/img/video/audio/iframe/text/list等）での初期ノード生成
- **applyAutoLayout 統合テスト**: flexbox スタイルでの AutoLayout 設定（layoutMode, itemSpacing, wrap）
- **applyPadding 統合テスト**: padding 個別/ショートハンド適用
- **applyPositioning 統合テスト**: position absolute/fixed/relative + constraints
- **applySizing 統合テスト**: width/height px/%, min/max, aspectRatio, flex
- **applyVisualStyles 統合テスト**: backgroundColor, border, borderRadius
- **appendChildren 統合テスト**: 子要素再帰、display補正、コメントノード除外、子要素なし要素での無処理
- **nullフォールバック回帰テスト**: `vi.mock`（hoisted）で以下のimportパスごとにモック。テスト間の汚染を防ぐため `vi.resetModules()` + `vi.doMock()/vi.unmock()` を使用する：
  - `./elements/text/p` → `mapToFigma` を `null` 返却
  - `./elements/text/a` → `AConverter.mapToFigma` を `null` 返却
  - `./elements/interactive` → `SummaryElement/DetailsElement/DialogElement.mapToFigma` を `null` 返却
  - `./elements/form/progress` → `mapToFigma` を `null` 返却
  - `./elements/form/meter` → `mapToFigma` を `null` 返却
  - `./elements/text/time` → `TimeConverter.mapToFigma` を `null` 返却（inlineSemantic代表）
  - 各ケースでフォールバック（通常フレーム生成）が動作することを検証
- **Styles.parseパース回数テスト**: style属性あり + children ありのケースで `vi.spyOn(Styles, 'parse')` を使い、呼び出し回数が1回であることを検証
- **z-index適用条件テスト**: `position` 未指定 + `z-index` 指定時にzIndexが設定されないことを検証
- **コメントのみ子要素テスト**: 子要素がコメントノードのみの場合にdisplay補正・コンテナ補正が実行されないことを検証

※ フェーズ関数は非エクスポートのため、公開API（mapHTMLNodeToFigma）経由で統合テストとして実施

## 設計判断

1. **関数はエクスポートしない**: フェーズ関数は mapper.ts 内部のプライベート関数。外部APIは変更なし
2. **nodeConfig のミュータブル操作を維持**: 現在の動作を変えず、各フェーズ関数が nodeConfig を直接変更するスタイルを維持
3. **resolveByTag の戻り値**: `ResolveResult` 型（`{ earlyReturn: true/false, nodeConfig }` の判別共用体）で早期リターンを型安全に制御
4. **styles のパースは1回のみ**: スタイル文字列のパースは mapHTMLNodeToFigma 内で1度だけ行い、`styles` 変数を Phase 2 と Phase 3 で共有する

## 挙動不変条件

リファクタリング後も以下の挙動が変わらないことを保証する：

1. **0値の維持**: `spacing: 0`, `paddingTop: 0`, `width: 0`, `height: 0` がデフォルト値で上書きされない
2. **コメントノード除外**: 子要素処理でコメントノード（`name === "Comment"`）が children に含まれない
3. **body/html サイズ補正**: `containerWidth`/`containerHeight` が width/height 未設定の body/html 要素にのみ適用される（0も設定済みとして扱う）
4. **aspectRatio ガード**: `aspectRatio === 0` や `Infinity` の場合に nodeConfig に設定されない
5. **display補正**: `display: block/inline-block` で flex 以外の場合に autoLayout が解除される
6. **早期リターン要素**: p/a/summary/details/dialog/progress/meter/inlineSemantic の専用コンバーターが `null` 以外を返した場合、スタイル適用・子要素処理をスキップして即返却
7. **nullフォールバック**: 早期リターン要素の専用コンバーターが `null` を返した場合、通常のフレーム生成フロー（isTextElement 判定やデフォルトフレーム生成）に進む
8. **子要素なしの要素**: `htmlNode.children` が空または未定義の場合、appendChildren は何もしない（display補正もコンテナサイズ補正も実行しない）
9. **コメントのみ子要素**: コメントノードのみの子要素リストはフィルタ後に空となり、display補正・コンテナ補正は実行しない
10. **z-index条件**: `z-index` は `position` が non-static の場合にのみ適用。`position` 未指定 + `z-index` 指定では nodeConfig に `zIndex` を設定しない

## 検証計画

1. **既存テスト通過**: `pnpm run test src/converter/mapper.test.ts` が全パス
2. **統合テスト通過**: `pnpm run test src/converter/__tests__/style-optimization-integration.test.ts` が全パス
3. **関連テスト通過**: 以下のmapper直接呼び出しテストが全パス
   - `src/converter/elements/embed/__tests__/embed-integration.test.ts`（mapHTMLNodeToFigma直接呼び出し）
   - `src/converter/elements/object/__tests__/object-integration.test.ts`（mapHTMLNodeToFigma直接呼び出し）
   ※ container要素テスト（article/aside/footer/header/main）はmapperをモックしているため回帰検証には含めない
4. **新規テスト**: `pnpm run test src/converter/mapper-phases.test.ts` が全パス
5. **全体テスト**: `pnpm test` が全パス
6. **型チェック**: `pnpm run type-check` がエラーなし
7. **ビルド**: `pnpm run build` が成功
