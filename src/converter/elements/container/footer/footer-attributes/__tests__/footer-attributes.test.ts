import { test, expectTypeOf } from "vitest";
import type { FooterAttributes } from "../footer-attributes";
import type { GlobalAttributes } from "../../../../base/global-attributes";

test(
  "FooterAttributes.type - GlobalAttributes継承 - 型互換である",
  () => {
    expectTypeOf<FooterAttributes>().toEqualTypeOf<GlobalAttributes>();
  }
);

test("FooterAttributes.type - id属性あり - idの型を持つ", () => {
  const attrs: FooterAttributes = { id: "footer" };
  expectTypeOf(attrs.id).toEqualTypeOf<string | undefined>();
});

test(
  "FooterAttributes.type - className属性あり - classNameの型を持つ",
  () => {
    const attrs: FooterAttributes = { className: "footer" };
    expectTypeOf(attrs.className).toEqualTypeOf<string | undefined>();
  }
);

test("FooterAttributes.type - style属性あり - styleの型を持つ", () => {
  const attrs: FooterAttributes = { style: "padding: 10px;" };
  expectTypeOf(attrs.style).toEqualTypeOf<string | undefined>();
});

test("FooterAttributes.type - data属性あり - data属性の型を持つ", () => {
  const attrs: FooterAttributes = {
    "data-test": "value",
    "data-id": "123",
  };
  expectTypeOf(attrs["data-test"]).toEqualTypeOf<string | undefined>();
});

test("FooterAttributes.type - aria属性あり - aria属性の型を持つ", () => {
  const attrs: FooterAttributes = {
    "aria-label": "フッター",
    "aria-labelledby": "footer-heading",
  };
  expectTypeOf(attrs["aria-label"]).toEqualTypeOf<string | undefined>();
});
