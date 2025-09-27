import type {
  TextNodeConfig,
  TextStyle,
} from "../../../../../models/figma-node";

/**
 * デフォルトのテキストスタイル
 */
export const defaultTextStyle: TextStyle = {
  fontFamily: "Arial",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: { unit: "AUTO", value: 100 },
  letterSpacing: 0,
  textAlign: "LEFT",
  verticalAlign: "baseline",
};

/**
 * テスト用のTextNodeConfigを作成するヘルパー関数
 * @param overrides - 上書きする設定
 * @returns TextNodeConfig
 */
export const createTextNodeConfig = (overrides?: {
  name?: string;
  content?: string;
  style?: Partial<TextStyle>;
}): TextNodeConfig => ({
  type: "TEXT",
  name: overrides?.name ?? "Text",
  content: overrides?.content ?? "test",
  style: {
    ...defaultTextStyle,
    ...overrides?.style,
  },
});

/**
 * 最小限のTextNodeConfigを作成
 */
export const createMinimalTextNodeConfig = (): TextNodeConfig => ({
  type: "TEXT",
  name: "Minimal",
  content: "",
  style: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: 400,
    lineHeight: { unit: "AUTO", value: 100 },
    letterSpacing: 0,
    textAlign: "LEFT",
    verticalAlign: "baseline",
  },
});

/**
 * RTL用のTextNodeConfigを作成
 */
export const createRTLTextNodeConfig = (): TextNodeConfig => ({
  type: "TEXT",
  name: "RTL Text",
  content: "مرحبا بالعالم", // "Hello World" in Arabic
  style: {
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: { unit: "AUTO", value: 100 },
    letterSpacing: 0,
    textAlign: "RIGHT",
    verticalAlign: "baseline",
  },
});

/**
 * 縦書き用のTextNodeConfigを作成
 */
export const createVerticalTextNodeConfig = (): TextNodeConfig => ({
  type: "TEXT",
  name: "Vertical Text",
  content: "縦書きテキスト",
  style: {
    fontFamily: "Noto Sans JP",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: { unit: "AUTO", value: 100 },
    letterSpacing: 0,
    textAlign: "LEFT",
    verticalAlign: "baseline",
  },
});
