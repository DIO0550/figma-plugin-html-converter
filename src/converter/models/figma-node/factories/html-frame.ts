import type { FigmaNodeConfig } from "../config/figma-node-config";
import { FigmaNodeConfig as FigmaNode } from "../config/figma-node-config";

/**
 * HTML要素の記述用データ型（関数を持たない純粋なオブジェクト）
 */
export type HTMLFrame = {
  tagName: string;
  attributes?: { id?: string; class?: string; [key: string]: unknown };
};

/**
 * HTMLFrameのコンパニオンオブジェクト
 */
export const HTMLFrame = {
  /**
   * 生データから HTMLFrame を生成
   */
  from(
    tagName: string,
    attributes?: { id?: string; class?: string; [key: string]: unknown },
  ): HTMLFrame {
    return { tagName, attributes };
  },
  /**
   * データからFigmaのFRAMEノード設定を構築
   */
  toFigmaNodeConfig(input: HTMLFrame): FigmaNodeConfig {
    const initial = FigmaNode.createFrame(input.tagName);
    return FigmaNode.applyHtmlElementDefaults(
      initial,
      input.tagName,
      input.attributes,
    );
  },
} as const;
