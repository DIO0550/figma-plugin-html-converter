import { test, expect } from "vitest";
import { normalizeClassNameAttribute } from "../semantic-frame-helpers";

test("normalizeClassNameAttribute - classNameプロパティをclassプロパティに変換すると、両方のプロパティが存在する", () => {
  // Arrange
  const attributes = { className: "btn primary", id: "button1" };

  // Act
  const result = normalizeClassNameAttribute(attributes);

  // Assert
  expect(result).toEqual({
    className: "btn primary",
    id: "button1",
    class: "btn primary",
  });
});

test("normalizeClassNameAttribute - classプロパティが既に存在する場合、そのまま使用される", () => {
  // Arrange
  const attributes = { class: "existing", id: "elem1" };

  // Act
  const result = normalizeClassNameAttribute(attributes);

  // Assert
  expect(result).toEqual({
    class: "existing",
    id: "elem1",
  });
});

test("normalizeClassNameAttribute - classNameとclassが両方存在する場合、classが優先される", () => {
  // Arrange
  const attributes = {
    className: "from-classname",
    class: "from-class",
    id: "elem1",
  };

  // Act
  const result = normalizeClassNameAttribute(attributes);

  // Assert
  expect(result.class).toBe("from-class");
});

test("normalizeClassNameAttribute - undefinedを渡すと、空オブジェクトが返される", () => {
  // Arrange & Act
  const result = normalizeClassNameAttribute(undefined);

  // Assert
  expect(result).toEqual({});
});

test("normalizeClassNameAttribute - classNameプロパティが存在しない場合、classプロパティは追加されない", () => {
  // Arrange
  const attributes = { id: "elem1" };

  // Act
  const result = normalizeClassNameAttribute(attributes);

  // Assert
  expect(result).toEqual({ id: "elem1" });
  expect(result.class).toBeUndefined();
});
