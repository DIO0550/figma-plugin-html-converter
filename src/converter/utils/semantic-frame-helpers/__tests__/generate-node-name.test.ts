import { test, expect } from "vitest";
import { generateNodeName } from "../semantic-frame-helpers";

// IDとクラスの組み合わせテスト
test("generateNodeName - IDとクラスが両方指定されると、tagName#id.class1.class2形式で生成される", () => {
  // Arrange
  const tagName = "header";
  const id = "main-header";
  const className = "nav primary";

  // Act
  const result = generateNodeName(tagName, id, className);

  // Assert
  expect(result).toBe("header#main-header.nav.primary");
});

test("generateNodeName - IDのみ指定されると、tagName#id形式で生成される", () => {
  // Arrange
  const tagName = "main";
  const id = "content";
  const className = undefined;

  // Act
  const result = generateNodeName(tagName, id, className);

  // Assert
  expect(result).toBe("main#content");
});

test("generateNodeName - クラスのみ指定されると、tagName.class1.class2形式で生成される", () => {
  // Arrange
  const tagName = "footer";
  const id = undefined;
  const className = "dark compact";

  // Act
  const result = generateNodeName(tagName, id, className);

  // Assert
  expect(result).toBe("footer.dark.compact");
});

test("generateNodeName - IDもクラスも指定されないと、tagName のみが返される", () => {
  // Arrange
  const tagName = "section";
  const id = undefined;
  const className = undefined;

  // Act
  const result = generateNodeName(tagName, id, className);

  // Assert
  expect(result).toBe("section");
});

// 複数クラスの処理テスト
test("generateNodeName - 単一クラスを指定すると、tagName.class形式で生成される", () => {
  // Arrange
  const tagName = "nav";
  const className = "primary";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("nav.primary");
});

test("generateNodeName - 2つのクラスを指定すると、ドット区切りで連結される", () => {
  // Arrange
  const tagName = "aside";
  const className = "sidebar collapsed";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("aside.sidebar.collapsed");
});

test("generateNodeName - 3つ以上のクラスを指定すると、すべてドット区切りで連結される", () => {
  // Arrange
  const tagName = "article";
  const className = "post featured large";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("article.post.featured.large");
});

test("generateNodeName - クラス名の前後の空白を除去して処理される", () => {
  // Arrange
  const tagName = "div";
  const className = "  btn   primary  ";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("div.btn.primary");
});

test("generateNodeName - 連続する空白を正規化して処理される", () => {
  // Arrange
  const tagName = "span";
  const className = "text    bold    red";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("span.text.bold.red");
});

// エッジケーステスト
test("generateNodeName - 空文字列のクラス名は無視される", () => {
  // Arrange
  const tagName = "header";
  const className = "";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("header");
});

test("generateNodeName - 空白のみのクラス名は無視される", () => {
  // Arrange
  const tagName = "footer";
  const className = "   ";

  // Act
  const result = generateNodeName(tagName, undefined, className);

  // Assert
  expect(result).toBe("footer");
});

test("generateNodeName - 空文字列のIDは無視される", () => {
  // Arrange
  const tagName = "main";
  const id = "";
  const className = "content";

  // Act
  const result = generateNodeName(tagName, id, className);

  // Assert
  expect(result).toBe("main.content");
});

// 既存コードとの互換性テスト
test("generateNodeName - headerの既存パターンと一致する（ID+クラス複数）", () => {
  // Arrange
  const id = "site-header";
  const className = "sticky dark";

  // Act
  const result = generateNodeName("header", id, className);

  // Assert
  expect(result).toBe("header#site-header.sticky.dark");
});

test("generateNodeName - mainの既存パターンと一致する（クラス複数のみ）", () => {
  // Arrange
  const id = undefined;
  const className = "container wide";

  // Act
  const result = generateNodeName("main", id, className);

  // Assert
  expect(result).toBe("main.container.wide");
});
