import { describe, it, expectTypeOf } from "vitest";
import type { FooterAttributes } from "../footer-attributes";
import type { GlobalAttributes } from "../../../../base/global-attributes";

describe("FooterAttributes", () => {
  it("GlobalAttributesを継承していること", () => {
    expectTypeOf<FooterAttributes>().toEqualTypeOf<GlobalAttributes>();
  });

  it("id属性を持つこと", () => {
    const attrs: FooterAttributes = { id: "footer" };
    expectTypeOf(attrs.id).toEqualTypeOf<string | undefined>();
  });

  it("className属性を持つこと", () => {
    const attrs: FooterAttributes = { className: "footer" };
    expectTypeOf(attrs.className).toEqualTypeOf<string | undefined>();
  });

  it("style属性を持つこと", () => {
    const attrs: FooterAttributes = { style: "padding: 10px;" };
    expectTypeOf(attrs.style).toEqualTypeOf<string | undefined>();
  });

  it("data-*属性を持つこと", () => {
    const attrs: FooterAttributes = {
      "data-test": "value",
      "data-id": "123",
    };
    expectTypeOf(attrs["data-test"]).toEqualTypeOf<string | undefined>();
  });

  it("aria-*属性を持つこと", () => {
    const attrs: FooterAttributes = {
      "aria-label": "フッター",
      "aria-labelledby": "footer-heading",
    };
    expectTypeOf(attrs["aria-label"]).toEqualTypeOf<string | undefined>();
  });
});
