import { test, expect } from "vitest";
import { HTMLNode } from "../../../html-node";
import { StyleAnalyzer } from "../style-analyzer";

test("StyleAnalyzer.analyze - スタイルなしツリー - 空結果を返す", () => {
    const node = HTMLNode.createElement("div");
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(0);
    expect(result.totalIssues).toBe(0);
});

test("StyleAnalyzer.analyze - 単一要素 - 結果に1件含める", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static; color: red",
    });
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].tagName).toBe("div");
    expect(result.results[0].issues.length).toBeGreaterThan(0);
});

test("StyleAnalyzer.analyze - ネスト要素 - パスを含める", () => {
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

test("StyleAnalyzer.analyze - 複数要素 - totalIssuesが合計になる", () => {
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

test("StyleAnalyzer.analyze - テキストノード含む - resultsに含めない", () => {
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

test("StyleAnalyzer.analyze - 空style属性 - 結果が空", () => {
    const node = HTMLNode.createElement("div", { style: "" });
    const result = StyleAnalyzer.analyze(node);
    expect(result.results).toHaveLength(0);
});

test("StyleAnalyzer.analyzeNode - styleあり要素 - issuesを返す", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static",
    });
    const result = StyleAnalyzer.analyzeNode(node);
    expect(result).not.toBeNull();
    expect(result!.tagName).toBe("div");
    expect(result!.issues).toHaveLength(1);
    expect(result!.issues[0].type).toBe("default-value");
});

test("StyleAnalyzer.analyzeNode - styleなし要素 - nullを返す", () => {
    const node = HTMLNode.createElement("div");
    expect(StyleAnalyzer.analyzeNode(node)).toBeNull();
});

test("StyleAnalyzer.analyzeNode - テキストノード - nullを返す", () => {
    const node = HTMLNode.createText("Hello");
    expect(StyleAnalyzer.analyzeNode(node)).toBeNull();
});

test("StyleAnalyzer.analyzeNode - tagName別display - デフォルト値判定が変わる", () => {
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

test("StyleAnalyzer.analyzeNode - カスタムパス指定 - pathに反映", () => {
    const node = HTMLNode.createElement("div", {
      style: "position: static",
    });
    const result = StyleAnalyzer.analyzeNode(node, "body > div");
    expect(result!.path).toBe("body > div");
});
