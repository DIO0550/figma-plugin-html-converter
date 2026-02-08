/**
 * object要素のアクセサテスト
 */

import { test, expect } from "vitest";
import { ObjectElement } from "../object-element";

test("ObjectElement.getData - data属性あり - dataを返す", () => {
  const element = ObjectElement.create({
    data: "https://example.com/content.swf",
  });
  expect(ObjectElement.getData(element)).toBe(
    "https://example.com/content.swf",
  );
});

test("ObjectElement.getData - data未設定の場合 - undefinedを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getData(element)).toBeUndefined();
});

test("ObjectElement.getWidth - width属性あり - widthを返す", () => {
  const element = ObjectElement.create({ width: "640" });
  expect(ObjectElement.getWidth(element)).toBe("640");
});

test("ObjectElement.getWidth - width未設定の場合 - undefinedを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getWidth(element)).toBeUndefined();
});

test("ObjectElement.getHeight - height属性あり - heightを返す", () => {
  const element = ObjectElement.create({ height: "360" });
  expect(ObjectElement.getHeight(element)).toBe("360");
});

test(
  "ObjectElement.getHeight - height未設定の場合 - undefinedを返す",
  () => {
    const element = ObjectElement.create({});
    expect(ObjectElement.getHeight(element)).toBeUndefined();
  },
);

test("ObjectElement.getType - type属性あり - typeを返す", () => {
  const element = ObjectElement.create({
    type: "application/x-shockwave-flash",
  });
  expect(ObjectElement.getType(element)).toBe("application/x-shockwave-flash");
});

test("ObjectElement.getType - type未設定の場合 - undefinedを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getType(element)).toBeUndefined();
});

test("ObjectElement.getName - name属性あり - nameを返す", () => {
  const element = ObjectElement.create({ name: "myObject" });
  expect(ObjectElement.getName(element)).toBe("myObject");
});

test("ObjectElement.getName - name未設定の場合 - undefinedを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getName(element)).toBeUndefined();
});

test("ObjectElement.getStyle - style属性あり - styleを返す", () => {
  const element = ObjectElement.create({ style: "width: 100%;" });
  expect(ObjectElement.getStyle(element)).toBe("width: 100%;");
});

test("ObjectElement.getStyle - style未設定の場合 - undefinedを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getStyle(element)).toBeUndefined();
});

test(
  "ObjectElement.getNodeName - name属性がある場合 - object: name形式で返す",
  () => {
    const element = ObjectElement.create({ name: "myObject" });
    expect(ObjectElement.getNodeName(element)).toBe("object: myObject");
  },
);

test(
  "ObjectElement.getNodeName - type属性がある場合 - object: type形式で返す",
  () => {
    const element = ObjectElement.create({ type: "application/pdf" });
    expect(ObjectElement.getNodeName(element)).toBe(
      "object: application/pdf",
    );
  },
);

test(
  "ObjectElement.getNodeName - dataのみの場合 - ホスト名を返す",
  () => {
    const element = ObjectElement.create({
      data: "https://example.com/content.swf",
    });
    expect(ObjectElement.getNodeName(element)).toBe("object: example.com");
  },
);

test(
  "ObjectElement.getNodeName - nameとtypeがある場合 - nameを優先して返す",
  () => {
    const element = ObjectElement.create({
      name: "myObject",
      type: "application/pdf",
    });
    expect(ObjectElement.getNodeName(element)).toBe("object: myObject");
  },
);

test(
  "ObjectElement.getNodeName - typeとdataがある場合 - typeを優先して返す",
  () => {
    const element = ObjectElement.create({
      data: "https://example.com/content.swf",
      type: "application/pdf",
    });
    expect(ObjectElement.getNodeName(element)).toBe(
      "object: application/pdf",
    );
  },
);

test("ObjectElement.getNodeName - 属性がない場合 - objectを返す", () => {
  const element = ObjectElement.create({});
  expect(ObjectElement.getNodeName(element)).toBe("object");
});

test("ObjectElement.getNodeName - 不正なdataの場合 - objectを返す", () => {
  const element = ObjectElement.create({ data: "invalid-url" });
  expect(ObjectElement.getNodeName(element)).toBe("object");
});
