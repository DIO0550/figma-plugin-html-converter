import { test, expect, describe } from "vitest";
import { HTMLNode } from "../../../html-node";
import { StyleAnalyzer } from "../style-analyzer";

describe("StyleAnalyzer.analyze", () => {
  test("スタイルのないツリーでは空の結果を返す", () => {
    const node = HTMLNode.createElement("div");
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(0);
    expect(result.totalIssues).toBe(0);
  });

  test("単一要素のスタイルを分析", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static; color: red",
    });
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].tagName).toBe("div");
    expect(result.results[0].issues.length).toBeGreaterThan(0);
  });

  test("ネストされた要素を再帰的に分析", () => {
    const parent = HTMLNode.createElement("div", {
      style: "opacity: 1",
    });
    const child = HTMLNode.createElement("span", {
      style: "float: none",
    });
    HTMLNode.appendChild(parent, child);

    const result = StyleAnalyzer.analyze(parent);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].path).toBe("div");
    expect(result.results[1].path).toBe("div > span[0]");
  });

  test("totalIssuesは全要素の問題数の合計", () => {
    const parent = HTMLNode.createElement("div", {
      style: "position: static",
    });
    const child = HTMLNode.createElement("p", {
      style: "opacity: 1; visibility: visible",
    });
    HTMLNode.appendChild(parent, child);

    const result = StyleAnalyzer.analyze(parent);
    const totalFromResults = result.results.reduce(
      (sum, r) => sum + r.issues.length,
      0,
    );
    expect(result.totalIssues).toBe(totalFromResults);
  });

  test("テキストノードはスキップされる", () => {
    const parent = HTMLNode.createElement("div", {
      style: "color: red",
    });
    const textNode = HTMLNode.createText("Hello");
    HTMLNode.appendChild(parent, textNode);

    const result = StyleAnalyzer.analyze(parent);
    // テキストノードはスタイルを持たないのでresultsは1（divのみ）
    // ただしdivのcolor: redはデフォルト値ではないので問題なし
    expect(result.results.length).toBeLessThanOrEqual(1);
  });

  test("空のスタイル属性は無視される", () => {
    const node = HTMLNode.createElement("div", { style: "" });
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(0);
  });
});

describe("StyleAnalyzer.analyzeNode", () => {
  test("要素ノードのスタイルを分析", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static",
    });
    const result = StyleAnalyzer.analyzeNode(node);
    expect(result).not.toBeNull();
    expect(result!.tagName).toBe("div");
    expect(result!.issues).toHaveLength(1);
    expect(result!.issues[0].type).toBe("default-value");
  });

  test("スタイルのない要素はnullを返す", () => {
    const node = HTMLNode.createElement("div");
    expect(StyleAnalyzer.analyzeNode(node)).toBeNull();
  });

  test("テキストノードはnullを返す", () => {
    const node = HTMLNode.createText("Hello");
    expect(StyleAnalyzer.analyzeNode(node)).toBeNull();
  });

  test("タグ名を考慮したデフォルト値検出", () => {
    const divNode = HTMLNode.createElement("div", {
      style: "display: block",
    });
    const spanNode = HTMLNode.createElement("span", {
      style: "display: block",
    });

    const divResult = StyleAnalyzer.analyzeNode(divNode);
    const spanResult = StyleAnalyzer.analyzeNode(spanNode);

    // divのdisplay: blockはデフォルト値なので検出される
    expect(divResult!.issues.length).toBeGreaterThan(0);
    // spanのdisplay: blockはデフォルト値ではないので検出されない
    expect(spanResult!.issues).toHaveLength(0);
  });

  test("カスタムパスを指定できる", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static",
    });
    const result = StyleAnalyzer.analyzeNode(node, "body > div");
    expect(result!.path).toBe("body > div");
  });
});
