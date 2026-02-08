/**
 * object要素の属性定義テスト
 */

import { test, expect } from "vitest";
import { ObjectAttributes } from "../object-attributes";

test(
  "ObjectAttributes.parseSize - width/height未指定 - デフォルトサイズを返す",
  () => {
    const attributes: ObjectAttributes = {};
    const { width, height } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(300);
    expect(height).toBe(150);
  },
);

test(
  "ObjectAttributes.parseSize - width属性指定 - widthを解析する",
  () => {
    const attributes: ObjectAttributes = { width: "640" };
    const { width, height } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(640);
    expect(height).toBe(150);
  },
);

test(
  "ObjectAttributes.parseSize - height属性指定 - heightを解析する",
  () => {
    const attributes: ObjectAttributes = { height: "360" };
    const { width, height } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(300);
    expect(height).toBe(360);
  },
);

test(
  "ObjectAttributes.parseSize - width/height属性指定 - 両方を解析する",
  () => {
    const attributes: ObjectAttributes = { width: "800", height: "600" };
    const { width, height } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(800);
    expect(height).toBe(600);
  },
);

test(
  "ObjectAttributes.parseSize - 無効なwidth値 - デフォルトwidthを使用する",
  () => {
    const attributes: ObjectAttributes = { width: "invalid" };
    const { width } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(300);
  },
);

test(
  "ObjectAttributes.parseSize - 無効なheight値 - デフォルトheightを使用する",
  () => {
    const attributes: ObjectAttributes = { height: "invalid" };
    const { height } = ObjectAttributes.parseSize(attributes);
    expect(height).toBe(150);
  },
);

test("ObjectAttributes.parseSize - 負の値 - デフォルトサイズを使用する", () => {
  const attributes: ObjectAttributes = { width: "-100", height: "-50" };
  const { width, height } = ObjectAttributes.parseSize(attributes);
  expect(width).toBe(300);
  expect(height).toBe(150);
});

test("ObjectAttributes.parseSize - 0指定 - デフォルトサイズを使用する", () => {
  const attributes: ObjectAttributes = { width: "0", height: "0" };
  const { width, height } = ObjectAttributes.parseSize(attributes);
  expect(width).toBe(300);
  expect(height).toBe(150);
});

test(
  "ObjectAttributes.parseSize - styleのwidth指定 - styleを優先する",
  () => {
    const attributes: ObjectAttributes = {
      width: "640",
      style: "width: 800px;",
    };
    const { width } = ObjectAttributes.parseSize(attributes);
    expect(width).toBe(800);
  },
);

test(
  "ObjectAttributes.parseSize - styleのheight指定 - styleを優先する",
  () => {
    const attributes: ObjectAttributes = {
      height: "360",
      style: "height: 480px;",
    };
    const { height } = ObjectAttributes.parseSize(attributes);
    expect(height).toBe(480);
  },
);

test("ObjectAttributes.getData - data属性あり - dataを返す", () => {
  const attributes: ObjectAttributes = {
    data: "https://example.com/content.swf",
  };
  expect(ObjectAttributes.getData(attributes)).toBe(
    "https://example.com/content.swf",
  );
});

test("ObjectAttributes.getData - data未設定 - nullを返す", () => {
  const attributes: ObjectAttributes = {};
  expect(ObjectAttributes.getData(attributes)).toBeNull();
});

test("ObjectAttributes.getData - javascript:URL - nullを返す", () => {
  const attributes: ObjectAttributes = { data: "javascript:alert(1)" };
  expect(ObjectAttributes.getData(attributes)).toBeNull();
});

test("ObjectAttributes.getData - data:URL - nullを返す", () => {
  const attributes: ObjectAttributes = {
    data: "data:text/html,<h1>Hello</h1>",
  };
  expect(ObjectAttributes.getData(attributes)).toBeNull();
});

test("ObjectAttributes.getData - 相対パス - そのまま返す", () => {
  const attributes: ObjectAttributes = { data: "/content/sample.swf" };
  expect(ObjectAttributes.getData(attributes)).toBe("/content/sample.swf");
});

test("ObjectAttributes.getType - type属性あり - typeを返す", () => {
  const attributes: ObjectAttributes = {
    type: "application/x-shockwave-flash",
  };
  expect(ObjectAttributes.getType(attributes)).toBe(
    "application/x-shockwave-flash",
  );
});

test("ObjectAttributes.getType - type未設定 - nullを返す", () => {
  const attributes: ObjectAttributes = {};
  expect(ObjectAttributes.getType(attributes)).toBeNull();
});

test("ObjectAttributes.getType - application/pdf - typeを返す", () => {
  const attributes: ObjectAttributes = { type: "application/pdf" };
  expect(ObjectAttributes.getType(attributes)).toBe("application/pdf");
});

test("ObjectAttributes.getName - name属性あり - nameを返す", () => {
  const attributes: ObjectAttributes = { name: "myObject" };
  expect(ObjectAttributes.getName(attributes)).toBe("myObject");
});

test("ObjectAttributes.getName - name未設定 - nullを返す", () => {
  const attributes: ObjectAttributes = {};
  expect(ObjectAttributes.getName(attributes)).toBeNull();
});

test("ObjectAttributes.getBorder - style属性あり - border情報を返す", () => {
  const attributes: ObjectAttributes = { style: "border: 1px solid #000" };
  const border = ObjectAttributes.getBorder(attributes);
  expect(border).not.toBeNull();
  expect(border?.width).toBe(1);
});

test("ObjectAttributes.getBorder - style未設定 - nullを返す", () => {
  const attributes: ObjectAttributes = {};
  expect(ObjectAttributes.getBorder(attributes)).toBeNull();
});

test(
  "ObjectAttributes.getBorderRadius - style属性あり - 角丸を返す",
  () => {
    const attributes: ObjectAttributes = { style: "border-radius: 8px" };
    const borderRadius = ObjectAttributes.getBorderRadius(attributes);
    expect(borderRadius).toBe(8);
  },
);

test("ObjectAttributes.getBorderRadius - style未設定 - nullを返す", () => {
  const attributes: ObjectAttributes = {};
  expect(ObjectAttributes.getBorderRadius(attributes)).toBeNull();
});
