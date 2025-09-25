/**
 * 子ノード関連のユーティリティ関数
 */

/**
 * スタイル文字列をパースしてオブジェクトに変換
 *
 * @param styleString - パース対象のスタイル文字列（JSON形式）
 * @returns パースされたスタイルオブジェクト、失敗時は空オブジェクト
 */
export function parseStyles(styleString: string): Record<string, string> {
  try {
    return JSON.parse(styleString);
  } catch {
    return {};
  }
}
