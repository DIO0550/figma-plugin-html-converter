import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

test("TextTransform.applyToConfig - UPPERCASEを適用した場合 - configにUPPERCASEが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const transform = TextTransform.create("UPPERCASE");
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("UPPERCASE");
  expect(result).toBe(config); // should return same object
});

test("TextTransform.applyToConfig - LOWERCASEを適用した場合 - configにLOWERCASEが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const transform = TextTransform.create("LOWERCASE");
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("LOWERCASE");
});

test("TextTransform.applyToConfig - CAPITALIZEを適用した場合 - configにCAPITALIZEが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const transform = TextTransform.create("CAPITALIZE");
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("CAPITALIZE");
});

test("TextTransform.applyToConfig - ORIGINALを適用した場合 - configにORIGINALが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const transform = TextTransform.create("ORIGINAL");
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("ORIGINAL");
});

test("TextTransform.applyToConfig - undefinedを渡した場合 - configを変更しない", () => {
  const config = { style: {} } as TextNodeConfig;
  const result = TextTransform.applyToConfig(config, undefined);

  expect(result.style.textCase).toBeUndefined();
  expect(result).toBe(config);
});

test("TextTransform.applyToConfig - 既存のtransformがある場合 - 新しい値で上書きする", () => {
  const config = { style: { textCase: "UPPERCASE" } } as TextNodeConfig;
  const transform = TextTransform.create("LOWERCASE");
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("LOWERCASE");
});
