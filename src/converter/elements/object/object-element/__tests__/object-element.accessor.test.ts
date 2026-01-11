/**
 * object要素のアクセサテスト
 */

import { describe, test, expect } from "vitest";
import { ObjectElement } from "../object-element";

describe("ObjectElement accessors", () => {
  describe("getData", () => {
    test("data属性を取得できる", () => {
      const element = ObjectElement.create({
        data: "https://example.com/content.swf",
      });
      expect(ObjectElement.getData(element)).toBe(
        "https://example.com/content.swf",
      );
    });

    test("data未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getData(element)).toBeUndefined();
    });
  });

  describe("getWidth", () => {
    test("width属性を取得できる", () => {
      const element = ObjectElement.create({ width: "640" });
      expect(ObjectElement.getWidth(element)).toBe("640");
    });

    test("width未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getWidth(element)).toBeUndefined();
    });
  });

  describe("getHeight", () => {
    test("height属性を取得できる", () => {
      const element = ObjectElement.create({ height: "360" });
      expect(ObjectElement.getHeight(element)).toBe("360");
    });

    test("height未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getHeight(element)).toBeUndefined();
    });
  });

  describe("getType", () => {
    test("type属性を取得できる", () => {
      const element = ObjectElement.create({
        type: "application/x-shockwave-flash",
      });
      expect(ObjectElement.getType(element)).toBe(
        "application/x-shockwave-flash",
      );
    });

    test("type未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getType(element)).toBeUndefined();
    });
  });

  describe("getName", () => {
    test("name属性を取得できる", () => {
      const element = ObjectElement.create({ name: "myObject" });
      expect(ObjectElement.getName(element)).toBe("myObject");
    });

    test("name未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getName(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    test("style属性を取得できる", () => {
      const element = ObjectElement.create({ style: "width: 100%;" });
      expect(ObjectElement.getStyle(element)).toBe("width: 100%;");
    });

    test("style未設定の場合はundefinedを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getNodeName", () => {
    test("name属性がある場合はobject: nameの形式で返す", () => {
      const element = ObjectElement.create({ name: "myObject" });
      expect(ObjectElement.getNodeName(element)).toBe("object: myObject");
    });

    test("type属性がある場合はobject: typeの形式で返す", () => {
      const element = ObjectElement.create({ type: "application/pdf" });
      expect(ObjectElement.getNodeName(element)).toBe(
        "object: application/pdf",
      );
    });

    test("dataのみの場合はホスト名を使用する", () => {
      const element = ObjectElement.create({
        data: "https://example.com/content.swf",
      });
      expect(ObjectElement.getNodeName(element)).toBe("object: example.com");
    });

    test("nameとtypeがある場合はnameを優先する", () => {
      const element = ObjectElement.create({
        name: "myObject",
        type: "application/pdf",
      });
      expect(ObjectElement.getNodeName(element)).toBe("object: myObject");
    });

    test("typeとdataがある場合はtypeを優先する", () => {
      const element = ObjectElement.create({
        data: "https://example.com/content.swf",
        type: "application/pdf",
      });
      expect(ObjectElement.getNodeName(element)).toBe(
        "object: application/pdf",
      );
    });

    test("属性がない場合はobjectを返す", () => {
      const element = ObjectElement.create({});
      expect(ObjectElement.getNodeName(element)).toBe("object");
    });

    test("不正なdataの場合はobjectを返す", () => {
      const element = ObjectElement.create({ data: "invalid-url" });
      expect(ObjectElement.getNodeName(element)).toBe("object");
    });
  });
});
