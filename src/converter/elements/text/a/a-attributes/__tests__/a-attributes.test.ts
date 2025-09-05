import { test, expect } from "vitest";
import type { AAttributes } from "../a-attributes";

// ===============================
// 型定義の基本的な使用確認テスト
// ===============================

test("AAttributes - 型定義として基本的な属性を受け入れることを確認", () => {
  // Arrange & Act
  const attributes: AAttributes = {
    href: "https://example.com",
    target: "_blank",
    rel: "noopener",
    download: "file.pdf",
    id: "link-1",
    class: "nav-link",
    style: "color: blue;",
  };

  // Assert - 型エラーが出ないことが重要
  expect(attributes.href).toBe("https://example.com");
  expect(attributes.target).toBe("_blank");
  expect(attributes.id).toBe("link-1");
});

test("AAttributes - 空のオブジェクトを受け入れることを確認", () => {
  // Arrange & Act
  const attributes: AAttributes = {};

  // Assert
  expect(attributes).toEqual({});
});

test("AAttributes - download属性がboolean型を受け入れることを確認", () => {
  // Arrange & Act
  const attributes: AAttributes = {
    href: "#",
    download: true,
  };

  // Assert
  expect(attributes.download).toBe(true);
});
