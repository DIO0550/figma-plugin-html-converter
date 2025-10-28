import type { RGB, RGBA } from "../colors";

// ペイントタイプの定数
const PAINT_TYPE = {
  SOLID: "SOLID",
  GRADIENT_LINEAR: "GRADIENT_LINEAR",
  GRADIENT_RADIAL: "GRADIENT_RADIAL",
  GRADIENT_ANGULAR: "GRADIENT_ANGULAR",
  GRADIENT_DIAMOND: "GRADIENT_DIAMOND",
  IMAGE: "IMAGE",
  EMOJI: "EMOJI",
} as const;

export type PaintType = (typeof PAINT_TYPE)[keyof typeof PAINT_TYPE];

// ブレンドモードの定数
const BLEND_MODE = {
  NORMAL: "NORMAL",
  DARKEN: "DARKEN",
  MULTIPLY: "MULTIPLY",
  COLOR_BURN: "COLOR_BURN",
  LIGHTEN: "LIGHTEN",
  SCREEN: "SCREEN",
  COLOR_DODGE: "COLOR_DODGE",
  OVERLAY: "OVERLAY",
  SOFT_LIGHT: "SOFT_LIGHT",
  HARD_LIGHT: "HARD_LIGHT",
  DIFFERENCE: "DIFFERENCE",
  EXCLUSION: "EXCLUSION",
  HUE: "HUE",
  SATURATION: "SATURATION",
  COLOR: "COLOR",
  LUMINOSITY: "LUMINOSITY",
} as const;

export type BlendMode = (typeof BLEND_MODE)[keyof typeof BLEND_MODE];

// グラデーションのカラーストップ
export interface ColorStop {
  position: number; // 0-1
  color: RGBA;
}

// 変換行列（2D）
export interface Transform {
  a: number; // scale x
  b: number; // skew y
  c: number; // skew x
  d: number; // scale y
  tx: number; // translate x
  ty: number; // translate y
}

// 画像のスケールモード
const SCALE_MODE = {
  FILL: "FILL",
  FIT: "FIT",
  CROP: "CROP",
  TILE: "TILE",
} as const;

export type ScaleMode = (typeof SCALE_MODE)[keyof typeof SCALE_MODE];

// ベースペイント
interface BasePaint {
  type: PaintType;
  visible?: boolean;
  opacity?: number; // 0-1
  blendMode?: BlendMode;
}

// ソリッドペイント
export interface SolidPaint extends BasePaint {
  type: typeof PAINT_TYPE.SOLID;
  color: RGB;
}

// グラデーション共通
interface GradientPaint extends BasePaint {
  type:
    | typeof PAINT_TYPE.GRADIENT_LINEAR
    | typeof PAINT_TYPE.GRADIENT_RADIAL
    | typeof PAINT_TYPE.GRADIENT_ANGULAR
    | typeof PAINT_TYPE.GRADIENT_DIAMOND;
  gradientTransform?: Transform;
  gradientStops: ColorStop[];
}

// 線形グラデーション
export interface LinearGradientPaint extends GradientPaint {
  type: typeof PAINT_TYPE.GRADIENT_LINEAR;
}

// 放射グラデーション
export interface RadialGradientPaint extends GradientPaint {
  type: typeof PAINT_TYPE.GRADIENT_RADIAL;
}

// 角度グラデーション
export interface AngularGradientPaint extends GradientPaint {
  type: typeof PAINT_TYPE.GRADIENT_ANGULAR;
}

// ダイヤモンドグラデーション
export interface DiamondGradientPaint extends GradientPaint {
  type: typeof PAINT_TYPE.GRADIENT_DIAMOND;
}

// 画像ペイント
export interface ImagePaint extends BasePaint {
  type: typeof PAINT_TYPE.IMAGE;
  scaleMode: ScaleMode;
  imageHash?: string;
  imageUrl?: string; // URLも追加
  imageTransform?: Transform;
  scalingFactor?: number;
  rotation?: number; // degrees
  filters?: {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    temperature?: number;
    tint?: number;
    highlights?: number;
    shadows?: number;
  };
}

// 統合Paint型
export type Paint =
  | SolidPaint
  | LinearGradientPaint
  | RadialGradientPaint
  | AngularGradientPaint
  | DiamondGradientPaint
  | ImagePaint;

// Paintのコンパニオンオブジェクト
export const Paint = {
  // 定数エクスポート
  Type: PAINT_TYPE,
  BlendMode: BLEND_MODE,
  ScaleMode: SCALE_MODE,

  // ファクトリーメソッド
  solid(color: RGB, opacity: number = 1): SolidPaint {
    return {
      type: PAINT_TYPE.SOLID,
      color,
      opacity,
    };
  },

  linearGradient(
    stops: ColorStop[],
    transform?: Transform,
  ): LinearGradientPaint {
    return {
      type: PAINT_TYPE.GRADIENT_LINEAR,
      gradientStops: stops,
      gradientTransform: transform,
      visible: true,
    };
  },

  radialGradient(
    stops: ColorStop[],
    transform?: Transform,
  ): RadialGradientPaint {
    return {
      type: PAINT_TYPE.GRADIENT_RADIAL,
      gradientStops: stops,
      gradientTransform: transform,
      visible: true,
    };
  },

  image(
    imageUrlOrHash: string,
    scaleMode: ScaleMode = SCALE_MODE.FILL,
  ): ImagePaint {
    // URLかハッシュかを判別
    const isUrl =
      imageUrlOrHash.startsWith("http") ||
      imageUrlOrHash.startsWith("data:") ||
      imageUrlOrHash.startsWith("/") ||
      imageUrlOrHash.includes(".");

    return {
      type: PAINT_TYPE.IMAGE,
      ...(isUrl ? { imageUrl: imageUrlOrHash } : { imageHash: imageUrlOrHash }),
      scaleMode,
      visible: true,
    };
  },

  // カラーストップ作成
  colorStop(position: number, color: RGB | RGBA, opacity?: number): ColorStop {
    const rgba = "a" in color ? color : { ...color, a: opacity ?? 1 };
    return {
      position: Math.max(0, Math.min(1, position)),
      color: rgba,
    };
  },

  // 型ガード
  isSolid(paint: Paint): paint is SolidPaint {
    return paint.type === PAINT_TYPE.SOLID;
  },

  isGradient(paint: Paint): paint is GradientPaint {
    return (
      paint.type === PAINT_TYPE.GRADIENT_LINEAR ||
      paint.type === PAINT_TYPE.GRADIENT_RADIAL ||
      paint.type === PAINT_TYPE.GRADIENT_ANGULAR ||
      paint.type === PAINT_TYPE.GRADIENT_DIAMOND
    );
  },

  isLinearGradient(paint: Paint): paint is LinearGradientPaint {
    return paint.type === PAINT_TYPE.GRADIENT_LINEAR;
  },

  isRadialGradient(paint: Paint): paint is RadialGradientPaint {
    return paint.type === PAINT_TYPE.GRADIENT_RADIAL;
  },

  isImage(paint: Paint): paint is ImagePaint {
    return paint.type === PAINT_TYPE.IMAGE;
  },

  // ユーティリティ
  setOpacity(paint: Paint, opacity: number): Paint {
    return { ...paint, opacity: Math.max(0, Math.min(1, opacity)) };
  },

  setBlendMode(paint: Paint, blendMode: BlendMode): Paint {
    return { ...paint, blendMode };
  },

  setVisible(paint: Paint, visible: boolean): Paint {
    return { ...paint, visible };
  },

  // グラデーション作成ヘルパー
  twoColorGradient(
    startColor: RGB,
    endColor: RGB,
    type: "linear" | "radial" = "linear",
  ): LinearGradientPaint | RadialGradientPaint {
    const stops = [
      Paint.colorStop(0, startColor),
      Paint.colorStop(1, endColor),
    ];

    return type === "linear"
      ? Paint.linearGradient(stops)
      : Paint.radialGradient(stops);
  },

  // 透明度グラデーション
  fadeGradient(
    color: RGB,
    direction: "in" | "out" = "out",
  ): LinearGradientPaint {
    const stops =
      direction === "out"
        ? [Paint.colorStop(0, color, 1), Paint.colorStop(1, color, 0)]
        : [Paint.colorStop(0, color, 0), Paint.colorStop(1, color, 1)];

    return Paint.linearGradient(stops);
  },

  // 変換行列作成
  transform(
    scaleX: number = 1,
    scaleY: number = 1,
    skewX: number = 0,
    skewY: number = 0,
    translateX: number = 0,
    translateY: number = 0,
  ): Transform {
    return {
      a: scaleX,
      b: skewY,
      c: skewX,
      d: scaleY,
      tx: translateX,
      ty: translateY,
    };
  },

  // 単位行列
  identityTransform(): Transform {
    return Paint.transform();
  },

  // 回転変換
  rotationTransform(
    degrees: number,
    centerX: number = 0,
    centerY: number = 0,
  ): Transform {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return {
      a: cos,
      b: sin,
      c: -sin,
      d: cos,
      tx: centerX - centerX * cos + centerY * sin,
      ty: centerY - centerX * sin - centerY * cos,
    };
  },
};
