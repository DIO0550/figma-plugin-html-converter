/**
 * 子ノード型の統合エクスポート
 */

// 基底型とコンテキスト
export * from "./base";

// 全ノード型（BaseChildNodeを継承）
export * from "./text-node";
export * from "./bold-node";
export * from "./italic-node";
export * from "./strong-node";
export * from "./em-node";
export * from "./b-node";
export * from "./i-node";
export * from "./other-node";

// 統合コンバーター
export * from "./child-node-converter";

// Union型の定義
import type { TextChildNode } from "./text-node";
import type { BoldChildNode } from "./bold-node";
import type { ItalicChildNode } from "./italic-node";
import type { StrongChildNode } from "./strong-node";
import type { EmChildNode } from "./em-node";
import type { BChildNode } from "./b-node";
import type { IChildNode } from "./i-node";
import type { OtherChildNode } from "./other-node";

/**
 * 子ノードのUnion型
 */
export type ChildNode =
  | TextChildNode
  | BoldChildNode
  | ItalicChildNode
  | StrongChildNode
  | EmChildNode
  | BChildNode
  | IChildNode
  | OtherChildNode;
