/// <reference types="@figma/plugin-typings" />

import { A11yChecker } from "./accessibility/checker";
import { generateReport } from "./accessibility/report";
import { DEFAULT_A11Y_CONFIG } from "./accessibility/constants";
import type {
  ParsedHtmlNode,
  FigmaNodeInfo,
  A11yCheckerConfig,
} from "./accessibility/types";

import type { OptimizationMode } from "./converter/models/styles/style-optimizer/types";

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

    try {
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

  if (msg.type === "optimize-styles") {
    try {
      const html = msg.html as string;
      const { StyleAnalyzer } =
        await import("./converter/models/styles/style-analyzer");
      const { StyleOptimizer } =
        await import("./converter/models/styles/style-optimizer");
      const { HTML } = await import("./converter/models/html");

      const htmlObj = HTML.from(html);
      const htmlNode = HTML.toHTMLNode(htmlObj);
      const analysis = StyleAnalyzer.analyze(htmlNode);

      const allProposals: unknown[] = [];
      const allResults: unknown[] = [];
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
        allResults.push({ result, comparison });
      }

      const totalIssues = analysis.totalIssues;
      const appliedCount = allProposals.length;

      figma.ui.postMessage({
        type: "optimization-result",
        result: {
          proposals: allProposals,
          summary: {
            totalIssues,
            applied: appliedCount,
            skipped: 0,
            reductionPercentage: 0,
            byType: {},
          },
          comparison: {
            added: {},
            removed: {},
            changed: [],
            unchanged: {},
            reductionPercentage: 0,
          },
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Style optimization error:", error);
      figma.ui.postMessage({
        type: "optimization-error",
        message: `スタイル最適化でエラーが発生しました: ${errorMessage}`,
      });
    }
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
