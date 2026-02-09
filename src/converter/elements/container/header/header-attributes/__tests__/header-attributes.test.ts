import { it, expect } from "vitest";
import type { HeaderAttributes } from "../header-attributes";

it("HeaderAttributes.type - id属性あり - idを保持する", () => {
  const attributes: HeaderAttributes = {
    id: "page-header",
  };
  expect(attributes.id).toBe("page-header");
});

it(
  "HeaderAttributes.type - className属性あり - classNameを保持する",
  () => {
    const attributes: HeaderAttributes = {
      className: "header primary-header",
    };
    expect(attributes.className).toBe("header primary-header");
  }
);

it("HeaderAttributes.type - style属性あり - styleを保持する", () => {
  const attributes: HeaderAttributes = {
    style: "background-color: #333; padding: 20px;",
  };
  expect(attributes.style).toBe("background-color: #333; padding: 20px;");
});

it("HeaderAttributes.type - data属性あり - data属性を保持する", () => {
  const attributes: HeaderAttributes = {
    "data-testid": "header",
    "data-theme": "dark",
  };
  expect(attributes["data-testid"]).toBe("header");
  expect(attributes["data-theme"]).toBe("dark");
});

it("HeaderAttributes.type - aria属性あり - aria属性を保持する", () => {
  const attributes: HeaderAttributes = {
    "aria-label": "Site header",
    "aria-expanded": "false",
  };
  expect(attributes["aria-label"]).toBe("Site header");
  expect(attributes["aria-expanded"]).toBe("false");
});

it("HeaderAttributes.type - 複数属性あり - 各属性を保持する", () => {
  const attributes: HeaderAttributes = {
    id: "header",
    className: "site-header sticky-header",
    style: "position: sticky; top: 0; z-index: 1000;",
    "data-scroll": "true",
    "aria-label": "Main navigation",
  };
  expect(attributes.id).toBe("header");
  expect(attributes.className).toBe("site-header sticky-header");
  expect(attributes.style).toBe("position: sticky; top: 0; z-index: 1000;");
  expect(attributes["data-scroll"]).toBe("true");
  expect(attributes["aria-label"]).toBe("Main navigation");
});

it("HeaderAttributes.type - 空のオブジェクト - 空オブジェクトを許容する", () => {
  const attributes: HeaderAttributes = {};
  expect(Object.keys(attributes)).toHaveLength(0);
});
