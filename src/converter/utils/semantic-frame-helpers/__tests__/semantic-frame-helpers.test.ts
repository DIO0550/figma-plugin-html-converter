import { describe, it, expect } from "vitest";
import {
  normalizeClassNameAttribute,
  initializeSemanticFramePadding,
  generateNodeName,
} from "../semantic-frame-helpers";
import type { FigmaNodeConfig } from "../../../models/figma-node";

describe("semantic-frame-helpers", () => {
  describe("normalizeClassNameAttribute", () => {
    it("classNameをclassに変換する", () => {
      const attributes = { className: "btn primary", id: "button1" };
      const result = normalizeClassNameAttribute(attributes);

      expect(result).toEqual({
        className: "btn primary",
        id: "button1",
        class: "btn primary",
      });
    });

    it("classが既に存在する場合はそのまま使用する", () => {
      const attributes = { class: "existing", id: "elem1" };
      const result = normalizeClassNameAttribute(attributes);

      expect(result).toEqual({
        class: "existing",
        id: "elem1",
      });
    });

    it("classNameとclassが両方存在する場合はclassを優先する", () => {
      const attributes = {
        className: "from-classname",
        class: "from-class",
        id: "elem1",
      };
      const result = normalizeClassNameAttribute(attributes);

      expect(result.class).toBe("from-class");
    });

    it("undefinedの場合は空オブジェクトを返す", () => {
      const result = normalizeClassNameAttribute(undefined);
      expect(result).toEqual({});
    });

    it("classNameがundefinedの場合はclassを追加しない", () => {
      const attributes = { id: "elem1" };
      const result = normalizeClassNameAttribute(attributes);

      expect(result).toEqual({ id: "elem1" });
      expect(result.class).toBeUndefined();
    });
  });

  describe("initializeSemanticFramePadding", () => {
    it("すべてのpadding値とitemSpacingを0で初期化する", () => {
      const config: FigmaNodeConfig = {
        type: "FRAME",
        name: "test",
        layoutMode: "VERTICAL",
      };

      const result = initializeSemanticFramePadding(config);

      expect(result.paddingLeft).toBe(0);
      expect(result.paddingRight).toBe(0);
      expect(result.paddingTop).toBe(0);
      expect(result.paddingBottom).toBe(0);
      expect(result.itemSpacing).toBe(0);
    });

    it("既存のconfigプロパティを保持する", () => {
      const config: FigmaNodeConfig = {
        type: "FRAME",
        name: "test",
        layoutMode: "HORIZONTAL",
        width: 100,
        height: 200,
      };

      const result = initializeSemanticFramePadding(config);

      expect(result.type).toBe("FRAME");
      expect(result.name).toBe("test");
      expect(result.layoutMode).toBe("HORIZONTAL");
      expect(result.width).toBe(100);
      expect(result.height).toBe(200);
    });

    it("既存のpadding値を上書きする", () => {
      const config: FigmaNodeConfig = {
        type: "FRAME",
        name: "test",
        paddingLeft: 10,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 40,
        itemSpacing: 5,
      };

      const result = initializeSemanticFramePadding(config);

      expect(result.paddingLeft).toBe(0);
      expect(result.paddingRight).toBe(0);
      expect(result.paddingTop).toBe(0);
      expect(result.paddingBottom).toBe(0);
      expect(result.itemSpacing).toBe(0);
    });
  });

  describe("generateNodeName", () => {
    describe("IDとクラスの組み合わせ", () => {
      it("IDとクラスが両方ある場合: tagName#id.class1.class2", () => {
        const result = generateNodeName("header", "main-header", "nav primary");
        expect(result).toBe("header#main-header.nav.primary");
      });

      it("IDのみの場合: tagName#id", () => {
        const result = generateNodeName("main", "content", undefined);
        expect(result).toBe("main#content");
      });

      it("クラスのみの場合: tagName.class1.class2", () => {
        const result = generateNodeName("footer", undefined, "dark compact");
        expect(result).toBe("footer.dark.compact");
      });

      it("IDもクラスもない場合: tagName", () => {
        const result = generateNodeName("section", undefined, undefined);
        expect(result).toBe("section");
      });
    });

    describe("複数クラスの処理", () => {
      it("単一クラスの場合", () => {
        const result = generateNodeName("nav", undefined, "primary");
        expect(result).toBe("nav.primary");
      });

      it("複数クラス（2つ）の場合", () => {
        const result = generateNodeName(
          "aside",
          undefined,
          "sidebar collapsed",
        );
        expect(result).toBe("aside.sidebar.collapsed");
      });

      it("複数クラス（3つ以上）の場合", () => {
        const result = generateNodeName(
          "article",
          undefined,
          "post featured large",
        );
        expect(result).toBe("article.post.featured.large");
      });

      it("前後の空白を除去する", () => {
        const result = generateNodeName("div", undefined, "  btn   primary  ");
        expect(result).toBe("div.btn.primary");
      });

      it("連続する空白を正しく処理する", () => {
        const result = generateNodeName(
          "span",
          undefined,
          "text    bold    red",
        );
        expect(result).toBe("span.text.bold.red");
      });
    });

    describe("エッジケース", () => {
      it("空文字列のクラス名は無視される", () => {
        const result = generateNodeName("header", undefined, "");
        expect(result).toBe("header");
      });

      it("空白のみのクラス名は無視される", () => {
        const result = generateNodeName("footer", undefined, "   ");
        expect(result).toBe("footer");
      });

      it("空文字列のIDは無視される", () => {
        const result = generateNodeName("main", "", "content");
        expect(result).toBe("main.content");
      });
    });

    describe("既存コードとの互換性", () => {
      it("headerの既存パターンと一致する", () => {
        // header-element.ts の行127-133と同じ結果
        const id = "site-header";
        const className = "sticky dark";
        const result = generateNodeName("header", id, className);
        expect(result).toBe("header#site-header.sticky.dark");
      });

      it("mainの既存パターンと一致する", () => {
        // main-element.ts の行126-133と同じ結果
        const id = undefined;
        const className = "container wide";
        const result = generateNodeName("main", id, className);
        expect(result).toBe("main.container.wide");
      });
    });
  });
});
