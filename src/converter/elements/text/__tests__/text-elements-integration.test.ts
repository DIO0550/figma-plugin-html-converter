import { test, expect } from "vitest";
import { DelElement, DelConverter } from "../del";
import { InsElement, InsConverter } from "../ins";
import { SubElement, SubConverter } from "../sub";
import { SupElement, SupConverter } from "../sup";
import { PElement, PConverter } from "../p";
import type { HTMLNode } from "../../../models/html-node";

// 化学式のテストケース
test("H₂Oの化学式をp要素内のsub要素で正しく表現できる", () => {
  const h2oElement = PElement.create({}, [
    { type: "text", textContent: "H" },
    {
      type: "element",
      tagName: "sub",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
    { type: "text", textContent: "O" },
  ]);

  const figmaNode = PConverter.toFigmaNode(h2oElement);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(3);

  // H
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "H",
  });

  // ₂ (sub要素)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
  expect(figmaNode.children![1].style.fontSize).toBeLessThan(16); // デフォルトより小さい

  // O
  expect(figmaNode.children![2]).toMatchObject({
    type: "TEXT",
    content: "O",
  });
});

test("CO₂の化学式をp要素内のsub要素で正しく表現できる", () => {
  const co2Element = PElement.create({}, [
    { type: "text", textContent: "CO" },
    {
      type: "element",
      tagName: "sub",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(co2Element);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(2);

  // CO
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "CO",
  });

  // ₂ (sub要素)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
});

// 数式のテストケース
test("x² + y² = r²の円の方程式をp要素内のsup要素で正しく表現できる", () => {
  const circleEquation = PElement.create({}, [
    { type: "text", textContent: "x" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
    { type: "text", textContent: " + y" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
    { type: "text", textContent: " = r" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(circleEquation);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(6);

  // x²の²部分を確認
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
  expect(figmaNode.children![1].style.fontSize).toBeLessThan(16); // デフォルトより小さい
});

test("E = mc²のアインシュタインの方程式をp要素内のsup要素で正しく表現できる", () => {
  const einsteinEquation = PElement.create({}, [
    { type: "text", textContent: "E = mc" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(einsteinEquation);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(2);

  // E = mc
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "E = mc",
  });

  // ² (sup要素)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
});

// 価格変更のテストケース
test("価格変更をp要素内のdel/ins要素で正しく表現できる", () => {
  const priceChange = PElement.create({}, [
    {
      type: "element",
      tagName: "del",
      attributes: {},
      children: [{ type: "text", textContent: "¥1,000" }],
    } as HTMLNode,
    { type: "text", textContent: " " },
    {
      type: "element",
      tagName: "ins",
      attributes: {},
      children: [{ type: "text", textContent: "¥800" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(priceChange);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(3);

  // 削除された価格
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "¥1,000",
  });
  expect(figmaNode.children![0].style.textDecoration).toBe("STRIKETHROUGH");

  // スペース
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: " ",
  });

  // 挿入された価格
  expect(figmaNode.children![2]).toMatchObject({
    type: "TEXT",
    content: "¥800",
  });
  expect(figmaNode.children![2].style.textDecoration).toBe("UNDERLINE");
});

// ネストのテストケース
test("削除された強調テキストをdel要素内のstrong要素で正しく表現できる", () => {
  const delElement = DelElement.create({}, [
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", textContent: "削除された強調テキスト" }],
    } as HTMLNode,
  ]);

  const figmaNode = DelConverter.toFigmaNode(delElement);
  expect(figmaNode.type).toBe("TEXT");
  expect(figmaNode.content).toBe("削除された強調テキスト");
  expect(figmaNode.style.textDecoration).toBe("STRIKETHROUGH");
});

test("挿入された強調テキストをins要素内のem要素で正しく表現できる", () => {
  const insElement = InsElement.create({}, [
    {
      type: "element",
      tagName: "em",
      attributes: {},
      children: [{ type: "text", textContent: "挿入された強調テキスト" }],
    } as HTMLNode,
  ]);

  const figmaNode = InsConverter.toFigmaNode(insElement);
  expect(figmaNode.type).toBe("TEXT");
  expect(figmaNode.content).toBe("挿入された強調テキスト");
  expect(figmaNode.style.textDecoration).toBe("UNDERLINE");
});

// 複合パターンのテストケース
test("脚注付き価格変更をp要素内でsup/del/ins要素を組み合わせて正しく表現できる", () => {
  const complexPattern = PElement.create({}, [
    { type: "text", textContent: "脚注" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "1" }],
    } as HTMLNode,
    { type: "text", textContent: ": " },
    {
      type: "element",
      tagName: "del",
      attributes: {},
      children: [{ type: "text", textContent: "旧情報" }],
    } as HTMLNode,
    { type: "text", textContent: " " },
    {
      type: "element",
      tagName: "ins",
      attributes: {},
      children: [{ type: "text", textContent: "新情報" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(complexPattern);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(6);

  // 脚注
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "脚注",
  });

  // ¹ (sup要素)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "1",
  });
  expect(figmaNode.children![1].style.fontSize).toBeLessThan(16);

  // :
  expect(figmaNode.children![2]).toMatchObject({
    type: "TEXT",
    content: ": ",
  });

  // 旧情報 (del要素)
  expect(figmaNode.children![3]).toMatchObject({
    type: "TEXT",
    content: "旧情報",
  });
  expect(figmaNode.children![3].style.textDecoration).toBe("STRIKETHROUGH");

  // スペース
  expect(figmaNode.children![4]).toMatchObject({
    type: "TEXT",
    content: " ",
  });

  // 新情報 (ins要素)
  expect(figmaNode.children![5]).toMatchObject({
    type: "TEXT",
    content: "新情報",
  });
  expect(figmaNode.children![5].style.textDecoration).toBe("UNDERLINE");
});

test("sub要素とsup要素を同時に使用した複合パターンを正しく表現できる", () => {
  const mixedPattern = PElement.create({}, [
    { type: "text", textContent: "H" },
    {
      type: "element",
      tagName: "sub",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
    { type: "text", textContent: "O と x" },
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "2" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(mixedPattern);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(4);

  // H
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "H",
  });

  // ₂ (sub要素)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
  expect(figmaNode.children![1].style.fontSize).toBeLessThan(16);

  // O と x
  expect(figmaNode.children![2]).toMatchObject({
    type: "TEXT",
    content: "O と x",
  });

  // ² (sup要素)
  expect(figmaNode.children![3]).toMatchObject({
    type: "TEXT",
    content: "2",
  });
  expect(figmaNode.children![3].style.fontSize).toBeLessThan(16);
});

test("del/ins/sub/sup要素を全て使用した完全な複合パターンを正しく表現できる", () => {
  const fullPattern = PElement.create({}, [
    { type: "text", textContent: "化学式: " },
    {
      type: "element",
      tagName: "del",
      attributes: {},
      children: [{ type: "text", textContent: "H₃O" }],
    } as HTMLNode,
    { type: "text", textContent: " " },
    {
      type: "element",
      tagName: "ins",
      attributes: {},
      children: [{ type: "text", textContent: "H₂O" }],
    } as HTMLNode,
    {
      type: "element",
      tagName: "sup",
      attributes: {},
      children: [{ type: "text", textContent: "*" }],
    } as HTMLNode,
  ]);

  const figmaNode = PConverter.toFigmaNode(fullPattern);
  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.children).toHaveLength(5);

  // 化学式:
  expect(figmaNode.children![0]).toMatchObject({
    type: "TEXT",
    content: "化学式: ",
  });

  // H₃O (del要素内)
  expect(figmaNode.children![1]).toMatchObject({
    type: "TEXT",
    content: "H₃O",
  });
  expect(figmaNode.children![1].style.textDecoration).toBe("STRIKETHROUGH");

  // スペース
  expect(figmaNode.children![2]).toMatchObject({
    type: "TEXT",
    content: " ",
  });

  // H₂O (ins要素内)
  expect(figmaNode.children![3]).toMatchObject({
    type: "TEXT",
    content: "H₂O",
  });
  expect(figmaNode.children![3].style.textDecoration).toBe("UNDERLINE");

  // * (sup要素)
  expect(figmaNode.children![4]).toMatchObject({
    type: "TEXT",
    content: "*",
  });
  expect(figmaNode.children![4].style.fontSize).toBeLessThan(16);
});

// 親要素との組み合わせテスト
test("各要素を単独でコンバーターを使って変換できる", () => {
  const delElement = DelElement.create({}, [
    { type: "text", textContent: "削除" },
  ]);
  const insElement = InsElement.create({}, [
    { type: "text", textContent: "挿入" },
  ]);
  const subElement = SubElement.create({}, [
    { type: "text", textContent: "2" },
  ]);
  const supElement = SupElement.create({}, [
    { type: "text", textContent: "2" },
  ]);

  const delNode = DelConverter.toFigmaNode(delElement);
  const insNode = InsConverter.toFigmaNode(insElement);
  const subNode = SubConverter.toFigmaNode(subElement);
  const supNode = SupConverter.toFigmaNode(supElement);

  expect(delNode.type).toBe("TEXT");
  expect(delNode.content).toBe("削除");
  expect(delNode.style.textDecoration).toBe("STRIKETHROUGH");

  expect(insNode.type).toBe("TEXT");
  expect(insNode.content).toBe("挿入");
  expect(insNode.style.textDecoration).toBe("UNDERLINE");

  expect(subNode.type).toBe("TEXT");
  expect(subNode.content).toBe("2");

  expect(supNode.type).toBe("TEXT");
  expect(supNode.content).toBe("2");
});

test("各要素のファクトリーメソッドで作成した要素を型ガードで検証できる", () => {
  const delElement = DelElement.create();
  const insElement = InsElement.create();
  const subElement = SubElement.create();
  const supElement = SupElement.create();

  expect(DelElement.isDelElement(delElement)).toBe(true);
  expect(InsElement.isInsElement(insElement)).toBe(true);
  expect(SubElement.isSubElement(subElement)).toBe(true);
  expect(SupElement.isSupElement(supElement)).toBe(true);
});

test("mapToFigmaメソッドで各要素を正しく型チェックして変換できる", () => {
  const delNode = {
    type: "element" as const,
    tagName: "del" as const,
    attributes: {},
    children: [{ type: "text" as const, textContent: "削除" }],
  };

  const insNode = {
    type: "element" as const,
    tagName: "ins" as const,
    attributes: {},
    children: [{ type: "text" as const, textContent: "挿入" }],
  };

  const subNode = {
    type: "element" as const,
    tagName: "sub" as const,
    attributes: {},
    children: [{ type: "text" as const, textContent: "2" }],
  };

  const supNode = {
    type: "element" as const,
    tagName: "sup" as const,
    attributes: {},
    children: [{ type: "text" as const, textContent: "2" }],
  };

  const delResult = DelConverter.mapToFigma(delNode);
  const insResult = InsConverter.mapToFigma(insNode);
  const subResult = SubConverter.mapToFigma(subNode);
  const supResult = SupConverter.mapToFigma(supNode);

  expect(delResult).not.toBeNull();
  expect(delResult?.type).toBe("TEXT");

  expect(insResult).not.toBeNull();
  expect(insResult?.type).toBe("TEXT");

  expect(subResult).not.toBeNull();
  expect(subResult?.type).toBe("TEXT");

  expect(supResult).not.toBeNull();
  expect(supResult?.type).toBe("TEXT");
});
