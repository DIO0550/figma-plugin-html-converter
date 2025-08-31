import { test, expect } from "vitest";
import {
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
  HeadingConverter,
} from "../index";

test("全ての見出し要素をインポートできる", () => {
  expect(H1Element).toBeDefined();
  expect(H2Element).toBeDefined();
  expect(H3Element).toBeDefined();
  expect(H4Element).toBeDefined();
  expect(H5Element).toBeDefined();
  expect(H6Element).toBeDefined();
  expect(HeadingConverter).toBeDefined();
});

test("各見出し要素を作成できる", () => {
  const h1 = H1Element.create({ id: "h1" }, [
    { type: "text", content: "Heading 1" },
  ]);
  const h2 = H2Element.create({ id: "h2" }, [
    { type: "text", content: "Heading 2" },
  ]);
  const h3 = H3Element.create({ id: "h3" }, [
    { type: "text", content: "Heading 3" },
  ]);
  const h4 = H4Element.create({ id: "h4" }, [
    { type: "text", content: "Heading 4" },
  ]);
  const h5 = H5Element.create({ id: "h5" }, [
    { type: "text", content: "Heading 5" },
  ]);
  const h6 = H6Element.create({ id: "h6" }, [
    { type: "text", content: "Heading 6" },
  ]);

  expect(h1.tagName).toBe("h1");
  expect(h2.tagName).toBe("h2");
  expect(h3.tagName).toBe("h3");
  expect(h4.tagName).toBe("h4");
  expect(h5.tagName).toBe("h5");
  expect(h6.tagName).toBe("h6");
});

test("各見出し要素の型ガードが正しく機能する", () => {
  const h1 = H1Element.create();
  const h2 = H2Element.create();
  const h3 = H3Element.create();
  const h4 = H4Element.create();
  const h5 = H5Element.create();
  const h6 = H6Element.create();

  expect(H1Element.isH1Element(h1)).toBe(true);
  expect(H1Element.isH1Element(h2)).toBe(false);

  expect(H2Element.isH2Element(h2)).toBe(true);
  expect(H2Element.isH2Element(h3)).toBe(false);

  expect(H3Element.isH3Element(h3)).toBe(true);
  expect(H3Element.isH3Element(h4)).toBe(false);

  expect(H4Element.isH4Element(h4)).toBe(true);
  expect(H4Element.isH4Element(h5)).toBe(false);

  expect(H5Element.isH5Element(h5)).toBe(true);
  expect(H5Element.isH5Element(h6)).toBe(false);

  expect(H6Element.isH6Element(h6)).toBe(true);
  expect(H6Element.isH6Element(h1)).toBe(false);
});

test("HeadingConverterで全ての見出しレベルをFigmaノードに変換できる", () => {
  const h1 = H1Element.create({}, [{ type: "text", content: "H1 Text" }]);
  const h2 = H2Element.create({}, [{ type: "text", content: "H2 Text" }]);
  const h3 = H3Element.create({}, [{ type: "text", content: "H3 Text" }]);
  const h4 = H4Element.create({}, [{ type: "text", content: "H4 Text" }]);
  const h5 = H5Element.create({}, [{ type: "text", content: "H5 Text" }]);
  const h6 = H6Element.create({}, [{ type: "text", content: "H6 Text" }]);

  const h1Node = HeadingConverter.toFigmaNode(h1);
  const h2Node = HeadingConverter.toFigmaNode(h2);
  const h3Node = HeadingConverter.toFigmaNode(h3);
  const h4Node = HeadingConverter.toFigmaNode(h4);
  const h5Node = HeadingConverter.toFigmaNode(h5);
  const h6Node = HeadingConverter.toFigmaNode(h6);

  // 各ノードが正しく変換されていることを確認
  expect(h1Node.name).toBe("h1");
  expect(h1Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H1 Text",
    style: { fontSize: 32, fontWeight: 700 },
  });

  expect(h2Node.name).toBe("h2");
  expect(h2Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H2 Text",
    style: { fontSize: 24, fontWeight: 700 },
  });

  expect(h3Node.name).toBe("h3");
  expect(h3Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H3 Text",
    style: { fontSize: 20, fontWeight: 700 },
  });

  expect(h4Node.name).toBe("h4");
  expect(h4Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H4 Text",
    style: { fontSize: 18, fontWeight: 700 },
  });

  expect(h5Node.name).toBe("h5");
  expect(h5Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H5 Text",
    style: { fontSize: 16, fontWeight: 700 },
  });

  expect(h6Node.name).toBe("h6");
  expect(h6Node.children![0]).toMatchObject({
    type: "TEXT",
    content: "H6 Text",
    style: { fontSize: 14, fontWeight: 700 },
  });
});

test("複雑な見出し構造を処理できる", () => {
  const h1 = H1Element.create(
    {
      id: "main-title",
      class: "title large",
      style: "color: #333; text-align: center;",
    },
    [
      { type: "text", content: "Welcome to " },
      {
        type: "element",
        tagName: "em",
        attributes: {},
        children: [{ type: "text", content: "Our" }],
      },
      { type: "text", content: " " },
      {
        type: "element",
        tagName: "strong",
        attributes: {},
        children: [{ type: "text", content: "Website" }],
      },
    ],
  );

  const node = HeadingConverter.toFigmaNode(h1);

  expect(node.name).toBe("h1#main-title");
  expect(node.children).toHaveLength(4);

  // 通常のテキスト
  expect(node.children![0]).toMatchObject({
    type: "TEXT",
    content: "Welcome to ",
    style: { fontWeight: 700 },
  });

  // 斜体テキスト
  expect(node.children![1]).toMatchObject({
    type: "TEXT",
    content: "Our",
    style: { fontWeight: 700, fontStyle: "ITALIC" },
  });

  // スペース
  expect(node.children![2]).toMatchObject({
    type: "TEXT",
    content: " ",
    style: { fontWeight: 700 },
  });

  // 太字テキスト（見出しは既に太字なので変わらない）
  expect(node.children![3]).toMatchObject({
    type: "TEXT",
    content: "Website",
    style: { fontWeight: 700 },
  });
});
