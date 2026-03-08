# Tasks: constraints計算ロジックのテスト網羅化

Issue: #233

## タスク一覧

✅ Implementation
  ✅ A. applyPositioning - vertical constraints テスト追加（5ケース）
    ✅ A1: absolute + top のみ → vertical: "MIN"
    ✅ A2: absolute + bottom のみ → vertical: "MAX"
    ✅ A3: absolute + top + bottom → vertical: "STRETCH"
    ✅ A4: absolute + left のみ → vertical: "MIN"（デフォルト確認）
    ✅ A5: fixed + top + bottom → vertical: "STRETCH"
  ✅ B. applyPositioning - horizontal デフォルト テスト追加（1ケース）
    ✅ B1: absolute + left のみ → horizontal: "MIN"
  ✅ C. applySizing - constraints テスト追加（4ケース）
    ✅ C1: min-width のみ → horizontal: "SCALE", vertical: "MIN"
    ✅ C2: max-width のみ → horizontal: "SCALE"
    ✅ C3: min-height のみ → horizontal: "MIN", vertical: "MIN"
    ✅ C4: min-width + min-height → horizontal: "SCALE", vertical: "MIN"
  ✅ D. applySizing - constraints 優先度テスト追加（1ケース）
    ✅ D1: position: absolute + min-width → applyPositioning の constraints が優先

✅ Verification
  ✅ テスト実行: pnpm run test src/converter/mapper-phases-styles.test.ts
  ✅ 既存テスト影響なし確認
