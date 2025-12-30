import { test, expect } from "vitest";
import { VideoAttributes } from "../video-attributes";

// parseSize テスト
test("parseSize: 属性なしの場合デフォルトサイズ(300x150)を返す", () => {
  const result = VideoAttributes.parseSize({});
  expect(result).toEqual({ width: 300, height: 150 });
});

test("parseSize: width/height属性からサイズを取得する", () => {
  const result = VideoAttributes.parseSize({
    width: "640",
    height: "360",
  });
  expect(result).toEqual({ width: 640, height: 360 });
});

test("parseSize: widthのみ指定された場合heightはデフォルト値を使用", () => {
  const result = VideoAttributes.parseSize({
    width: "800",
  });
  expect(result).toEqual({ width: 800, height: 150 });
});

test("parseSize: heightのみ指定された場合widthはデフォルト値を使用", () => {
  const result = VideoAttributes.parseSize({
    height: "450",
  });
  expect(result).toEqual({ width: 300, height: 450 });
});

test("parseSize: 無効な数値は無視されデフォルト値を使用", () => {
  const result = VideoAttributes.parseSize({
    width: "auto",
    height: "invalid",
  });
  expect(result).toEqual({ width: 300, height: 150 });
});

test("parseSize: style属性がwidth/height属性より優先される", () => {
  const result = VideoAttributes.parseSize({
    width: "640",
    height: "360",
    style: "width: 1280px; height: 720px;",
  });
  expect(result).toEqual({ width: 1280, height: 720 });
});

test("parseSize: style属性の一部のみ指定された場合は属性値を使用", () => {
  const result = VideoAttributes.parseSize({
    width: "640",
    height: "360",
    style: "width: 1920px;",
  });
  expect(result).toEqual({ width: 1920, height: 360 });
});

// isValidUrl テスト
test("isValidUrl: undefinedはfalseを返す", () => {
  expect(VideoAttributes.isValidUrl(undefined)).toBe(false);
});

test("isValidUrl: 空文字はfalseを返す", () => {
  expect(VideoAttributes.isValidUrl("")).toBe(false);
});

test("isValidUrl: httpsURLは有効", () => {
  expect(VideoAttributes.isValidUrl("https://example.com/video.mp4")).toBe(
    true,
  );
});

test("isValidUrl: httpURLは有効", () => {
  expect(VideoAttributes.isValidUrl("http://example.com/video.mp4")).toBe(true);
});

test.each(["/videos/sample.mp4", "./video.mp4", "../assets/video.mp4"])(
  "isValidUrl: 相対パス '%s' は有効",
  (path) => {
    expect(VideoAttributes.isValidUrl(path)).toBe(true);
  },
);

test("isValidUrl: ファイル名のみは有効", () => {
  expect(VideoAttributes.isValidUrl("video.mp4")).toBe(true);
});

test("isValidUrl: data:video URLは有効", () => {
  expect(VideoAttributes.isValidUrl("data:video/mp4;base64,AAAA")).toBe(true);
});

test("isValidUrl: data:image URLは有効（poster用）", () => {
  expect(VideoAttributes.isValidUrl("data:image/png;base64,AAAA")).toBe(true);
});

test.each(["javascript:alert(1)", "JAVASCRIPT:alert(1)"])(
  "isValidUrl: javascript: URL '%s' は無効（XSS対策）",
  (url) => {
    expect(VideoAttributes.isValidUrl(url)).toBe(false);
  },
);

test.each(["<script>alert(1)</script>", 'video.mp4"><script>'])(
  "isValidUrl: HTMLタグを含むURL '%s' は無効（XSS対策）",
  (url) => {
    expect(VideoAttributes.isValidUrl(url)).toBe(false);
  },
);

test("isValidUrl: 不正なdata URLは無効", () => {
  expect(
    VideoAttributes.isValidUrl("data:text/html,<script>alert(1)</script>"),
  ).toBe(false);
});

// getPoster テスト
test("getPoster: poster属性がない場合はnullを返す", () => {
  expect(VideoAttributes.getPoster({})).toBeNull();
});

test("getPoster: 有効なposter URLを返す", () => {
  const attrs: VideoAttributes = {
    poster: "https://example.com/thumbnail.jpg",
  };
  expect(VideoAttributes.getPoster(attrs)).toBe(
    "https://example.com/thumbnail.jpg",
  );
});

test("getPoster: 無効なposter URL（javascript:）はnullを返す", () => {
  const attrs: VideoAttributes = {
    poster: "javascript:alert(1)",
  };
  expect(VideoAttributes.getPoster(attrs)).toBeNull();
});

// hasControls テスト
test("hasControls: controls属性がない場合はfalseを返す", () => {
  expect(VideoAttributes.hasControls({})).toBe(false);
});

test("hasControls: controls属性がtrueの場合はtrueを返す", () => {
  expect(VideoAttributes.hasControls({ controls: true })).toBe(true);
});

test("hasControls: controls属性が空文字の場合はtrueを返す（HTML属性として存在）", () => {
  expect(
    VideoAttributes.hasControls({ controls: "" as unknown as boolean }),
  ).toBe(true);
});

test("hasControls: controls属性がfalseの場合はfalseを返す", () => {
  expect(VideoAttributes.hasControls({ controls: false })).toBe(false);
});

// getVideoSrc テスト
test("getVideoSrc: src属性からソースを取得する", () => {
  const attrs: VideoAttributes = {
    src: "https://example.com/video.mp4",
  };
  expect(VideoAttributes.getVideoSrc(attrs)).toBe(
    "https://example.com/video.mp4",
  );
});

test("getVideoSrc: src属性がない場合はnullを返す", () => {
  expect(VideoAttributes.getVideoSrc({})).toBeNull();
});

test("getVideoSrc: 無効なsrc URL（javascript:）はnullを返す", () => {
  const attrs: VideoAttributes = {
    src: "javascript:alert(1)",
  };
  expect(VideoAttributes.getVideoSrc(attrs)).toBeNull();
});

// getPreload テスト
test("getPreload: 属性なしの場合デフォルト値autoを返す", () => {
  expect(VideoAttributes.getPreload({})).toBe("auto");
});

test.each([
  { preload: "none" as const, expected: "none" },
  { preload: "metadata" as const, expected: "metadata" },
  { preload: "auto" as const, expected: "auto" },
])(
  "getPreload: preload=$preload の場合 $expected を返す",
  ({ preload, expected }) => {
    expect(VideoAttributes.getPreload({ preload })).toBe(expected);
  },
);

// getBorder テスト
test("getBorder: style属性がない場合はnullを返す", () => {
  expect(VideoAttributes.getBorder({})).toBeNull();
});

test("getBorder: ボーダー情報を正しく取得する", () => {
  const attrs: VideoAttributes = {
    style: "border: 2px solid #000;",
  };
  const border = VideoAttributes.getBorder(attrs);
  expect(border).toEqual({
    width: 2,
    style: "solid",
    color: { r: 0, g: 0, b: 0 },
  });
});

test("getBorder: 色付きボーダーを正しく取得する", () => {
  const attrs: VideoAttributes = {
    style: "border: 3px solid red;",
  };
  const border = VideoAttributes.getBorder(attrs);
  expect(border).toEqual({
    width: 3,
    style: "solid",
    color: { r: 1, g: 0, b: 0 },
  });
});

// getBorderRadius テスト
test("getBorderRadius: style属性がない場合はnullを返す", () => {
  expect(VideoAttributes.getBorderRadius({})).toBeNull();
});

test("getBorderRadius: 角丸値を正しく取得する", () => {
  const attrs: VideoAttributes = {
    style: "border-radius: 8px;",
  };
  expect(VideoAttributes.getBorderRadius(attrs)).toBe(8);
});
