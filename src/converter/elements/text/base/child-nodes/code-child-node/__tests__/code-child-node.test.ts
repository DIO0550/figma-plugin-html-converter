import { describe, it, expect } from "vitest";
import { CodeChildNode } from "../code-child-node";
import type { ChildNodeContext } from "../../base";

describe("CodeChildNode", () => {
  describe("create", () => {
    it("content付きでCodeChildNodeを作成できる", () => {
      const node = CodeChildNode.create("const x = 10;");

      expect(node.kind).toBe("code");
      expect(node.content).toBe("const x = 10;");
      expect(node.styles).toBeUndefined();
    });

    it("styles付きでCodeChildNodeを作成できる", () => {
      const styles = { color: "red", "font-size": "14px" };
      const node = CodeChildNode.create("function test() {}", styles);

      expect(node.kind).toBe("code");
      expect(node.content).toBe("function test() {}");
      expect(node.styles).toEqual(styles);
    });
  });

  describe("from", () => {
    it("fromメソッドでCodeChildNodeを作成できる", () => {
      const node = CodeChildNode.from("console.log('test');");

      expect(node.kind).toBe("code");
      expect(node.content).toBe("console.log('test');");
    });
  });

  describe("toFigmaNode", () => {
    it("デフォルトスタイルでFigmaノードに変換できる", () => {
      const node = CodeChildNode.create("const x = 10;");
      const context: ChildNodeContext = {
        elementType: "p",
        isHeading: false,
      };

      const result = CodeChildNode.toFigmaNode(node, context);

      expect(result.node.type).toBe("TEXT");
      expect(result.node.content).toBe("const x = 10;");
      expect(result.node.style.fontFamily).toBe("Courier New");
      expect(result.node.style.fontSize).toBe(14);
      expect(result.metadata.isText).toBe(true);
      expect(result.metadata.tagName).toBe("code");
    });

    it("親スタイルを継承してFigmaノードに変換できる", () => {
      const node = CodeChildNode.create("const x = 10;");
      const context: ChildNodeContext = {
        elementType: "p",
        isHeading: false,
        parentStyle: "color: blue; font-size: 16px;",
      };

      const result = CodeChildNode.toFigmaNode(node, context);

      expect(result.node.type).toBe("TEXT");
      // codeのデフォルトスタイル（font-family, font-size）が優先される
      expect(result.node.style.fontFamily).toBe("Courier New");
      expect(result.node.style.fontSize).toBe(14);
    });

    it("カスタムスタイルを適用してFigmaノードに変換できる", () => {
      const styles = { color: "red", "font-size": "12px" };
      const node = CodeChildNode.create("const x = 10;", styles);
      const context: ChildNodeContext = {
        elementType: "p",
        isHeading: false,
      };

      const result = CodeChildNode.toFigmaNode(node, context);

      expect(result.node.type).toBe("TEXT");
      // カスタムfont-sizeが適用される
      expect(result.node.style.fontSize).toBe(12);
    });

    it("見出し内ではtagNameを付与しない", () => {
      const node = CodeChildNode.create("const x = 10;");
      const context: ChildNodeContext = {
        elementType: "h1",
        isHeading: true,
      };

      const result = CodeChildNode.toFigmaNode(node, context);

      expect(result.metadata.tagName).toBeUndefined();
    });

    it("段落内ではtagNameを付与する", () => {
      const node = CodeChildNode.create("const x = 10;");
      const context: ChildNodeContext = {
        elementType: "p",
        isHeading: false,
      };

      const result = CodeChildNode.toFigmaNode(node, context);

      expect(result.metadata.tagName).toBe("code");
    });
  });
});
