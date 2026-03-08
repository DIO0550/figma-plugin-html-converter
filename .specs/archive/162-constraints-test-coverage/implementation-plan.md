# 実装計画: constraints計算ロジックのテスト網羅化

## 概要

Issue #233 のテスト観点「constraints計算ロジックの期待値をケース別に固定化する」を実施する。
コード修正（冗長な三項演算子の除去）は commit dd17674e で完了済み。本計画はテスト追加のみ。

## 背景

`mapper.ts` の constraints 設定は2箇所に存在する：

1. **applyPositioning** (L253-304): `position: absolute/fixed` 時の constraints
2. **applySizing** (L393-405): `min-width/max-width/min-height/max-height` 存在時の constraints

既存テストは applyPositioning の horizontal constraints を部分的にカバーしているが、以下が不足：

- applyPositioning の **vertical** constraints（全パターン未テスト）
- applySizing の constraints 設定（全パターン未テスト）
- applyPositioning の horizontal **デフォルト値 MIN**

## システム図

### 状態マシン図: applyPositioning の constraints 決定

```
position 値
    │
    ├── static / 未指定 → constraints 設定なし
    ├── relative → constraints 設定なし
    └── absolute / fixed
            │
            ├── horizontal constraint 決定
            │       │
            │       ├── left + right あり → "STRETCH"
            │       ├── right のみ → "MAX"
            │       ├── fixed + left:0 + right:0 → "STRETCH" (上書き)
            │       └── それ以外 → "MIN" (デフォルト)
            │
            └── vertical constraint 決定
                    │
                    ├── top + bottom あり → "STRETCH"
                    ├── bottom のみ → "MAX"
                    └── それ以外 → "MIN" (デフォルト)
```

### 状態マシン図: applySizing の constraints 決定

```
min/max サイズ値の有無
    │
    ├── すべて null → constraints 設定なし
    └── いずれか非null
            │
            ├── nodeConfig.constraints 既に存在 → スキップ（上書きしない）
            └── nodeConfig.constraints 未設定
                    │
                    ├── horizontal:
                    │       ├── minWidth/maxWidth いずれか非null → "SCALE"
                    │       └── それ以外 → "MIN"
                    │
                    └── vertical: 常に "MIN"
```

### データフロー図

```
HTML style属性
      │
      ▼
  Styles.parse()
      │
      ├─── position, top, right, bottom, left
      │         │
      │         ▼
      │    applyPositioning()
      │         │
      │         └── nodeConfig.constraints = { horizontal, vertical }
      │
      ├─── width, height, minWidth, maxWidth, minHeight, maxHeight
      │         │
      │         ▼
      │    applySizing()
      │         │
      │         └── nodeConfig.constraints = { horizontal, vertical }
      │              ※ applyPositioning で既設定の場合はスキップ
      │
      ▼
  FigmaNodeConfig (constraints プロパティ)
```

## 対象ファイル

| ファイル | 操作 | 説明 |
|---------|------|------|
| `src/converter/mapper-phases-styles.test.ts` | [MODIFY] | constraints テストケース追加 |

## テストケース一覧

### A. applyPositioning - vertical constraints（新規5ケース）

| # | 条件 | 期待値 |
|---|------|--------|
| A1 | absolute + top のみ | vertical: "MIN" |
| A2 | absolute + bottom のみ | vertical: "MAX" |
| A3 | absolute + top + bottom | vertical: "STRETCH" |
| A4 | absolute + left のみ（verticalデフォルト確認） | vertical: "MIN" |
| A5 | fixed + top + bottom | vertical: "STRETCH" |

### B. applyPositioning - horizontal デフォルト（新規1ケース）

| # | 条件 | 期待値 |
|---|------|--------|
| B1 | absolute + left のみ | horizontal: "MIN" |

### C. applySizing - constraints 設定（新規4ケース）

| # | 条件 | 期待値 |
|---|------|--------|
| C1 | min-width のみ | constraints.horizontal: "SCALE", constraints.vertical: "MIN" |
| C2 | max-width のみ | constraints.horizontal: "SCALE" |
| C3 | min-height のみ | constraints.horizontal: "MIN", constraints.vertical: "MIN" |
| C4 | min-width + min-height | constraints.horizontal: "SCALE", constraints.vertical: "MIN" |

### D. applySizing - constraints 優先度（新規1ケース）

| # | 条件 | 期待値 |
|---|------|--------|
| D1 | position: absolute + min-width | applyPositioning の constraints が優先される |

## 検証計画

- `pnpm run test src/converter/mapper-phases-styles.test.ts` で全テストがパスすること
- 既存テストに影響がないこと
