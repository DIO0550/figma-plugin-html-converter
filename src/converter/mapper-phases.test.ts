import { describe, test, expect, vi } from "vitest";
import { mapHTMLNodeToFigma } from "./mapper";
import { HTMLNode } from "./models/html-node";
import { HTML } from "./models/html";
import { Styles } from "./models/styles";

/**
 * HTMLNodeを作成するヘルパー関数
 */
function createHTMLNode(html: string): HTMLNode {
  const parsed = HTML.from(html);
  return HTML.toHTMLNode(parsed);
}

// --- 入口（text/comment）回帰テスト ---

describe("入口（text/comment）回帰テスト", () => {
  test("テキストノード → TEXT返却", () => {
    const textNode: HTMLNode = {
      type: "text",
      textContent: "Hello",
    };

    const result = mapHTMLNodeToFigma(textNode);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("Text");
  });

  test("コメントノード → Commentフレーム返却", () => {
    const commentNode: HTMLNode = {
      type: "comment",
    };

    const result = mapHTMLNodeToFigma(commentNode);

    expect(result.type).toBe("FRAME");
    expect(result.name).toBe("Comment");
  });
});

// --- resolveByTag 統合テスト ---

describe("resolveByTag 統合テスト", () => {
  test("div要素 → フレーム生成", () => {
    const node = createHTMLNode("<div>test</div>");
    const result = mapHTMLNodeToFigma(node);

    expect(result.type).toBe("FRAME");
    expect(result.name).toBe("div");
  });

  test("img要素 → 画像ノード生成", () => {
    const node: HTMLNode = {
      type: "element",
      tagName: "img",
      attributes: { src: "test.png", alt: "test" },
    };
    const result = mapHTMLNodeToFigma(node);

    expect(result.name).toContain("img");
  });

  test("video要素 → ビデオノード生成", () => {
    const node = createHTMLNode('<video src="test.mp4"></video>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.name).toContain("video");
  });

  test("audio要素 → オーディオノード生成", () => {
    const node = createHTMLNode('<audio src="test.mp3"></audio>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.name).toContain("audio");
  });

  test("iframe要素 → iframeノード生成", () => {
    const node = createHTMLNode('<iframe src="https://example.com"></iframe>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.name).toContain("iframe");
  });

  test("ul要素 → VERTICAL autoLayout", () => {
    const node = createHTMLNode("<ul><li>item</li></ul>");
    const result = mapHTMLNodeToFigma(node);

    expect(result.type).toBe("FRAME");
    expect(result.layoutMode).toBe("VERTICAL");
  });

  test("li要素 → HORIZONTAL autoLayout", () => {
    const node = createHTMLNode("<li>item</li>");
    const result = mapHTMLNodeToFigma(node);

    expect(result.type).toBe("FRAME");
    expect(result.layoutMode).toBe("HORIZONTAL");
  });

  test("span要素 → テキストノード生成", () => {
    const node = createHTMLNode("<span>text content</span>");
    const result = mapHTMLNodeToFigma(node);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("span");
  });

  test("h1要素 → テキストノード生成", () => {
    const node = createHTMLNode("<h1>heading</h1>");
    const result = mapHTMLNodeToFigma(node);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("h1");
  });
});

// --- applyAutoLayout 統合テスト ---

describe("applyAutoLayout 統合テスト", () => {
  test("display: flex → layoutMode 設定", () => {
    const node = createHTMLNode('<div style="display: flex">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutMode).toBeDefined();
    expect(["HORIZONTAL", "VERTICAL"]).toContain(result.layoutMode);
  });

  test("flex-wrap: wrap → layoutWrap WRAP", () => {
    const node = createHTMLNode(
      '<div style="display: flex; flex-wrap: wrap">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutWrap).toBe("WRAP");
  });

  test("display: flex + gap → itemSpacing 設定", () => {
    const node = createHTMLNode(
      '<div style="display: flex; gap: 16px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.itemSpacing).toBe(16);
  });
});

// --- applyPadding 統合テスト ---

describe("applyPadding 統合テスト", () => {
  test("padding 個別指定", () => {
    const node = createHTMLNode(
      '<div style="display: block; padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.paddingTop).toBe(10);
    expect(result.paddingRight).toBe(20);
    expect(result.paddingBottom).toBe(30);
    expect(result.paddingLeft).toBe(40);
  });

  test("padding ショートハンド", () => {
    const node = createHTMLNode(
      '<div style="display: block; padding: 15px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.paddingTop).toBe(15);
    expect(result.paddingRight).toBe(15);
    expect(result.paddingBottom).toBe(15);
    expect(result.paddingLeft).toBe(15);
  });

  test("flex要素ではapplyPaddingが適用されない（autoLayoutのpaddingが優先）", () => {
    const node = createHTMLNode(
      '<div style="display: flex; padding-top: 10px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    // flexの場合、applyAutoLayoutでpaddingが設定される
    // applyPaddingはlayoutMode判定で実行されない
    expect(result.layoutMode).toBeDefined();
  });
});

// --- applyPositioning 統合テスト ---

describe("applyPositioning 統合テスト", () => {
  test("position: absolute + top/left → x/y設定", () => {
    const node = createHTMLNode(
      '<div style="position: absolute; top: 10px; left: 20px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.x).toBe(20);
    expect(result.y).toBe(10);
  });

  test("position: absolute + left/right → STRETCH constraint", () => {
    const node = createHTMLNode(
      '<div style="position: absolute; left: 0px; right: 0px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.constraints?.horizontal).toBe("STRETCH");
  });

  test("position: absolute + right のみ → MAX constraint", () => {
    const node = createHTMLNode(
      '<div style="position: absolute; right: 10px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.constraints?.horizontal).toBe("MAX");
  });

  test("position: fixed + left:0 right:0 → STRETCH", () => {
    const node = createHTMLNode(
      '<div style="position: fixed; left: 0px; right: 0px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.constraints?.horizontal).toBe("STRETCH");
  });

  test("position: relative + left/top → x/y設定", () => {
    const node = createHTMLNode(
      '<div style="position: relative; top: 5px; left: 15px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.x).toBe(15);
    expect(result.y).toBe(5);
  });

  test("z-index は position non-static 時のみ適用", () => {
    const node = createHTMLNode(
      '<div style="position: absolute; z-index: 10">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.zIndex).toBe(10);
  });

  test("z-index は position 未指定時に適用されない", () => {
    const node = createHTMLNode('<div style="z-index: 10">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.zIndex).toBeUndefined();
  });
});

// --- applySizing 統合テスト ---

describe("applySizing 統合テスト", () => {
  test("width/height px 設定", () => {
    const node = createHTMLNode(
      '<div style="width: 200px; height: 100px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.width).toBe(200);
    expect(result.height).toBe(100);
  });

  test("width: 100% → FILL", () => {
    const node = createHTMLNode('<div style="width: 100%">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutSizingHorizontal).toBe("FILL");
  });

  test("height: auto → HUG", () => {
    const node = createHTMLNode('<div style="height: auto">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutSizingVertical).toBe("HUG");
  });

  test("min-width/max-width 設定", () => {
    const node = createHTMLNode(
      '<div style="min-width: 100px; max-width: 500px">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.minWidth).toBe(100);
    expect(result.maxWidth).toBe(500);
  });

  test("aspect-ratio 正常値 → aspectRatio 設定", () => {
    const node = createHTMLNode(
      '<div style="width: 160px; aspect-ratio: 16/9">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.aspectRatio).toBeCloseTo(16 / 9);
    expect(result.height).toBeCloseTo(90);
  });

  test("flex-grow: 1 → layoutGrow + FILL", () => {
    const node = createHTMLNode('<div style="flex-grow: 1">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutGrow).toBe(1);
    expect(result.layoutSizingHorizontal).toBe("FILL");
  });

  test("flex-shrink: 0 → layoutGrow: 0", () => {
    const node = createHTMLNode('<div style="flex-shrink: 0">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.layoutGrow).toBe(0);
  });
});

// --- applyVisualStyles 統合テスト ---

describe("applyVisualStyles 統合テスト", () => {
  test("background-color 設定 → fills", () => {
    const node = createHTMLNode(
      '<div style="background-color: rgb(255, 0, 0)">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.fills).toBeDefined();
    expect(result.fills).toHaveLength(1);
  });

  test("border 設定 → strokes", () => {
    const node = createHTMLNode(
      '<div style="border: 1px solid rgb(0, 0, 0)">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.strokes).toBeDefined();
    expect(result.strokeWeight).toBe(1);
  });

  test("border-radius 設定 → cornerRadius", () => {
    const node = createHTMLNode('<div style="border-radius: 8px">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.cornerRadius).toBe(8);
  });
});

// --- appendChildren 統合テスト ---

describe("appendChildren 統合テスト", () => {
  test("子要素の再帰処理", () => {
    const node = createHTMLNode(
      "<div><span>child1</span><span>child2</span></div>",
    );
    const result = mapHTMLNodeToFigma(node);

    const children = (result as unknown as { children: unknown[] }).children;
    expect(children).toBeDefined();
    expect(children).toHaveLength(2);
  });

  test("コメントノード除外", () => {
    const node: HTMLNode = {
      type: "element",
      tagName: "div",
      children: [
        { type: "comment" },
        {
          type: "element",
          tagName: "span",
          children: [{ type: "text", textContent: "text" }],
        },
      ],
    };
    const result = mapHTMLNodeToFigma(node);

    const children = (result as unknown as { children: unknown[] }).children;
    expect(children).toHaveLength(1);
  });

  test("子要素がコメントのみの場合 → childrenが設定されない", () => {
    const node: HTMLNode = {
      type: "element",
      tagName: "div",
      children: [{ type: "comment" }, { type: "comment" }],
    };
    const result = mapHTMLNodeToFigma(node);

    const children = (result as unknown as { children?: unknown[] }).children;
    expect(children).toBeUndefined();
  });

  test("子要素なし要素 → appendChildrenは何もしない", () => {
    const node = createHTMLNode("<div></div>");
    const result = mapHTMLNodeToFigma(node);

    const children = (result as unknown as { children?: unknown[] }).children;
    expect(children).toBeUndefined();
  });

  test("display: block でflex解除", () => {
    const node = createHTMLNode(
      '<div style="display: block"><span>child</span></div>',
    );
    const result = mapHTMLNodeToFigma(node);

    // display: block なのでlayoutModeが削除される（VERTICAL→未定義）
    expect(result.layoutMode).toBeUndefined();
  });

  test("body要素 + containerSize → width/height設定", () => {
    const node = createHTMLNode("<body><div>child</div></body>");
    const result = mapHTMLNodeToFigma(node, {
      containerWidth: 1024,
      containerHeight: 768,
    });

    expect(result.width).toBe(1024);
    expect(result.height).toBe(768);
  });
});

// --- nullフォールバック回帰テスト ---

describe("nullフォールバック回帰テスト", () => {
  test("p要素 → pコンバーターが変換し早期リターン", () => {
    const node = createHTMLNode("<p>paragraph text</p>");
    const result = mapHTMLNodeToFigma(node);

    // pコンバーターが正常に動作する場合
    expect(result).toBeDefined();
  });

  test("a要素 → aコンバーターが変換し早期リターン", () => {
    const node = createHTMLNode('<a href="https://example.com">link</a>');
    const result = mapHTMLNodeToFigma(node);

    expect(result).toBeDefined();
  });
});

// --- Styles.parse パース回数テスト ---

describe("Styles.parse パース回数テスト", () => {
  test("style属性あり + childrenありのケースでStyles.parseが1回のみ呼ばれる", () => {
    const parseSpy = vi.spyOn(Styles, "parse");

    const node = createHTMLNode(
      '<div style="width: 100px"><span>child</span></div>',
    );
    mapHTMLNodeToFigma(node);

    // div自体のparse呼び出しは1回のみ（子要素のspanにはstyleがないので0回）
    const divParseCalls = parseSpy.mock.calls.filter(
      (call) => call[0] === "width: 100px",
    );
    expect(divParseCalls).toHaveLength(1);

    parseSpy.mockRestore();
  });
});

// --- z-index適用条件テスト ---

describe("z-index適用条件テスト", () => {
  test("position未指定 + z-index指定 → zIndexが設定されない", () => {
    const node = createHTMLNode('<div style="z-index: 5">test</div>');
    const result = mapHTMLNodeToFigma(node);

    expect(result.zIndex).toBeUndefined();
  });

  test("position: static + z-index指定 → zIndexが設定されない", () => {
    const node = createHTMLNode(
      '<div style="position: static; z-index: 5">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.zIndex).toBeUndefined();
  });

  test("position: absolute + z-index指定 → zIndexが設定される", () => {
    const node = createHTMLNode(
      '<div style="position: absolute; z-index: 5">test</div>',
    );
    const result = mapHTMLNodeToFigma(node);

    expect(result.zIndex).toBe(5);
  });
});

// --- コメントのみ子要素テスト ---

describe("コメントのみ子要素テスト", () => {
  test("コメントのみ子要素ではdisplay補正・コンテナ補正が実行されない", () => {
    const node: HTMLNode = {
      type: "element",
      tagName: "body",
      children: [{ type: "comment" }],
    };
    const result = mapHTMLNodeToFigma(node, {
      containerWidth: 800,
      containerHeight: 600,
    });

    // コメントのみなのでchildrenがフィルタ後に空 → コンテナサイズ補正が実行されない
    expect(result.width).toBeUndefined();
    expect(result.height).toBeUndefined();
  });
});
