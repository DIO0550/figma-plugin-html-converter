import { test, expectTypeOf } from "vitest";
import type { SpanAttributes } from "../span-attributes";
import type { GlobalAttributes } from "../../../../base/global-attributes";

test("SpanAttributesはGlobalAttributesを継承する", () => {
  type Check = SpanAttributes extends GlobalAttributes ? true : false;
  expectTypeOf<Check>().toEqualTypeOf<true>();
});

test("GlobalAttributesのすべてのプロパティを持つ", () => {
  const attributes: SpanAttributes = {
    id: "test-id",
    class: "test-class",
    style: "color: red;",
    title: "Test Title",
    lang: "ja",
    dir: "ltr",
    tabindex: "0",
    hidden: true,
    draggable: "true",
    contenteditable: "true",
    spellcheck: "true",
  };

  expectTypeOf(attributes).toMatchTypeOf<GlobalAttributes>();
});

test("span固有の属性は持たない（GlobalAttributesのみ）", () => {
  const attributes: SpanAttributes = {
    id: "span-id",
    class: "inline-text",
  };

  // SpanAttributesはGlobalAttributesと完全に同じ型
  expectTypeOf(attributes).toMatchTypeOf<GlobalAttributes>();
  expectTypeOf<SpanAttributes>().toEqualTypeOf<GlobalAttributes>();
});

test("すべての属性はオプショナル", () => {
  const emptyAttributes: SpanAttributes = {};
  const partialAttributes: SpanAttributes = {
    id: "only-id",
  };

  expectTypeOf(emptyAttributes).toMatchTypeOf<SpanAttributes>();
  expectTypeOf(partialAttributes).toMatchTypeOf<SpanAttributes>();
});
