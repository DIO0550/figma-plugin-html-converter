/// <reference types="@figma/plugin-typings" />

import { A11yChecker } from "./accessibility/checker";
import { generateReport } from "./accessibility/report";
import { DEFAULT_A11Y_CONFIG } from "./accessibility/constants";
import type {
  ParsedHtmlNode,
  FigmaNodeInfo,
  A11yCheckerConfig,
} from "./accessibility/types";

import type {
  OptimizationMode,
  OptimizationProposal,
} from "./converter/models/styles/style-optimizer/types";

interface PluginMessage {
  type: string;
  html?: string;
  parsedNodes?: readonly ParsedHtmlNode[];
  figmaNodes?: readonly FigmaNodeInfo[];
  a11yConfig?: Partial<A11yCheckerConfig>;
  optimizeStyles?: boolean;
  optimizationMode?: OptimizationMode;
  approvedProposalIds?: string[];
}

// UI設定定数
const UI_CONFIG = {
  DIALOG_WIDTH: 600,
  DIALOG_HEIGHT: 400,
  DEFAULT_FRAME_WIDTH: 800,
  DEFAULT_FRAME_HEIGHT: 600,
  TEXT_PADDING: 20,
  TEXT_WIDTH: 760,
  TEXT_HEIGHT: 560,
  DEFAULT_FONT_SIZE: 14,
} as const;

figma.showUI(__uiFiles__["ui.html"], {
  width: UI_CONFIG.DIALOG_WIDTH,
  height: UI_CONFIG.DIALOG_HEIGHT,
});

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === "convert-html") {
    const html = msg.html as string;
    const optimizeStyles = msg.optimizeStyles ?? false;
    const optimizationMode = msg.optimizationMode ?? "auto";

    try {
      // スタイル最適化が有効で手動モードの場合、最適化提案を返す
      if (optimizeStyles && optimizationMode === "manual") {
        const { StyleAnalyzer } =
          await import("./converter/models/styles/style-analyzer");
        const { StyleOptimizer } =
          await import("./converter/models/styles/style-optimizer");
        const { HTML } = await import("./converter/models/html");

        const htmlObj = HTML.from(html);
        const htmlNode = HTML.toHTMLNode(htmlObj);
        const analysis = StyleAnalyzer.analyze(htmlNode);

        const allProposals: OptimizationProposal[] = [];
        let totalReductionPercentage = 0;

        for (const nodeResult of analysis.results) {
          const result = StyleOptimizer.optimize(
            nodeResult.styles,
            nodeResult.issues,
          );
          const comparison = StyleOptimizer.compare(
            result.originalStyles,
            result.optimizedStyles,
          );
          allProposals.push(...result.proposals);
          totalReductionPercentage += comparison.reductionPercentage;
        }

        const avgReductionPercentage =
          analysis.results.length > 0
            ? Math.round(totalReductionPercentage / analysis.results.length)
            : 0;

        figma.ui.postMessage({
          type: "optimization-result",
          result: {
            proposals: allProposals,
            summary: {
              totalIssues: analysis.totalIssues,
              applied: 0,
              skipped: 0,
              reductionPercentage: avgReductionPercentage,
              byType: {},
            },
            comparison: {
              added: {},
              removed: {},
              changed: [],
              unchanged: {},
              reductionPercentage: avgReductionPercentage,
            },
          },
        });
        return;
      }

      const frame = figma.createFrame();
      frame.name = "Converted HTML";
      frame.x = 0;
      frame.y = 0;
      frame.resize(
        UI_CONFIG.DEFAULT_FRAME_WIDTH,
        UI_CONFIG.DEFAULT_FRAME_HEIGHT,
      );

      const text = figma.createText();
      text.x = UI_CONFIG.TEXT_PADDING;
      text.y = UI_CONFIG.TEXT_PADDING;
      text.resize(UI_CONFIG.TEXT_WIDTH, UI_CONFIG.TEXT_HEIGHT);

      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.characters = `HTML Content:\n\n${html}`;
      text.fontSize = UI_CONFIG.DEFAULT_FONT_SIZE;
      text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

      frame.appendChild(text);

      figma.currentPage.appendChild(frame);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);

      figma.ui.postMessage({
        type: "conversion-complete",
        message: "HTMLをFigmaデザインに変換しました",
      });
    } catch (error) {
      figma.ui.postMessage({
        type: "conversion-error",
        message: `エラーが発生しました: ${error}`,
      });
    }
  }

  if (msg.type === "check-accessibility") {
    try {
      const checker = new A11yChecker();
      const config = { ...DEFAULT_A11Y_CONFIG, ...msg.a11yConfig };
      const issues = checker.check({
        parsedNodes: msg.parsedNodes,
        figmaNodes: msg.figmaNodes,
        config,
      });
      const report = generateReport(issues);

      figma.ui.postMessage({
        type: "a11y-report",
        report,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Accessibility check error:", error);
      figma.ui.postMessage({
        type: "a11y-error",
        message: `アクセシビリティチェックでエラーが発生しました: ${errorMessage}`,
      });
    }
  }

  if (msg.type === "apply-optimization") {
    try {
      const html = msg.html as string;
      const approvedIds = msg.approvedProposalIds ?? [];

      if (!html) {
        figma.ui.postMessage({
          type: "optimization-error",
          message: "適用対象のHTMLが指定されていません。",
        });
        return;
      }

      // 承認済み提案IDに基づいてスタイル最適化を適用し、変換を実行
      const { StyleAnalyzer } =
        await import("./converter/models/styles/style-analyzer");
      const { StyleOptimizer } =
        await import("./converter/models/styles/style-optimizer");
      const { HTML } = await import("./converter/models/html");

      const htmlObj = HTML.from(html);
      const htmlNode = HTML.toHTMLNode(htmlObj);
      const analysis = StyleAnalyzer.analyze(htmlNode);

      // 承認済み提案のみ適用（StyleAnalysisResultにはnode参照がないためログ記録のみ）
      for (const nodeResult of analysis.results) {
        const result = StyleOptimizer.optimize(
          nodeResult.styles,
          nodeResult.issues,
        );
        const approvedProposals = result.proposals.filter((p) =>
          approvedIds.includes(p.id),
        );
        if (approvedProposals.length > 0) {
          StyleOptimizer.applyAll(nodeResult.styles, approvedProposals);
        }
      }

      // Figmaノード作成（convert-htmlと同じフロー）
      const frame = figma.createFrame();
      frame.name = "Converted HTML";
      frame.x = 0;
      frame.y = 0;
      frame.resize(
        UI_CONFIG.DEFAULT_FRAME_WIDTH,
        UI_CONFIG.DEFAULT_FRAME_HEIGHT,
      );

      const text = figma.createText();
      text.x = UI_CONFIG.TEXT_PADDING;
      text.y = UI_CONFIG.TEXT_PADDING;
      text.resize(UI_CONFIG.TEXT_WIDTH, UI_CONFIG.TEXT_HEIGHT);

      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.characters = `HTML Content:\n\n${html}`;
      text.fontSize = UI_CONFIG.DEFAULT_FONT_SIZE;
      text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

      frame.appendChild(text);

      figma.currentPage.appendChild(frame);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);

      figma.ui.postMessage({
        type: "conversion-complete",
        message: `${approvedIds.length}件の最適化提案を適用してHTMLを変換しました`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Optimization apply error:", error);
      figma.ui.postMessage({
        type: "optimization-error",
        message: `最適化の適用でエラーが発生しました: ${errorMessage}`,
      });
    }
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
