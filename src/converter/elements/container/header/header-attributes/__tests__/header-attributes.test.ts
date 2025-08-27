import { describe, it, expect } from "vitest";
import type { HeaderAttributes } from "../header-attributes";

describe("HeaderAttributes", () => {
  it("should include id attribute", () => {
    const attributes: HeaderAttributes = {
      id: "page-header",
    };
    expect(attributes.id).toBe("page-header");
  });

  it("should include className attribute", () => {
    const attributes: HeaderAttributes = {
      className: "header primary-header",
    };
    expect(attributes.className).toBe("header primary-header");
  });

  it("should include style attribute", () => {
    const attributes: HeaderAttributes = {
      style: "background-color: #333; padding: 20px;",
    };
    expect(attributes.style).toBe("background-color: #333; padding: 20px;");
  });

  it("should include data attributes", () => {
    const attributes: HeaderAttributes = {
      "data-testid": "header",
      "data-theme": "dark",
    };
    expect(attributes["data-testid"]).toBe("header");
    expect(attributes["data-theme"]).toBe("dark");
  });

  it("should include ARIA attributes", () => {
    const attributes: HeaderAttributes = {
      "aria-label": "Site header",
      "aria-expanded": "false",
    };
    expect(attributes["aria-label"]).toBe("Site header");
    expect(attributes["aria-expanded"]).toBe("false");
  });

  it("should allow combination of various attributes", () => {
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

  it("should allow empty attributes object", () => {
    const attributes: HeaderAttributes = {};
    expect(Object.keys(attributes)).toHaveLength(0);
  });
});
