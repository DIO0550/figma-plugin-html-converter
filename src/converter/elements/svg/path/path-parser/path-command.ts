/**
 * SVGパスコマンドの型定義
 *
 * SVGのpath要素のd属性で使用されるコマンドを表現します。
 * 各コマンドは絶対座標（大文字）と相対座標（小文字）の両方をサポートします。
 */

/**
 * MoveTo (M/m) コマンド
 * パスの開始点または新しいサブパスの開始点に移動
 */
export interface MoveToCommand {
  type: "M";
  x: number;
  y: number;
  relative: boolean;
}

export const MoveToCommand = {
  create(x: number, y: number, relative: boolean): MoveToCommand {
    return { type: "M", x, y, relative };
  },

  isMoveToCommand(command: unknown): command is MoveToCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "M"
    );
  },
};

/**
 * LineTo (L/l) コマンド
 * 現在位置から指定点まで直線を描画
 */
export interface LineToCommand {
  type: "L";
  x: number;
  y: number;
  relative: boolean;
}

export const LineToCommand = {
  create(x: number, y: number, relative: boolean): LineToCommand {
    return { type: "L", x, y, relative };
  },

  isLineToCommand(command: unknown): command is LineToCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "L"
    );
  },
};

/**
 * HorizontalLineTo (H/h) コマンド
 * 現在位置から水平方向に直線を描画
 */
export interface HorizontalLineToCommand {
  type: "H";
  x: number;
  relative: boolean;
}

export const HorizontalLineToCommand = {
  create(x: number, relative: boolean): HorizontalLineToCommand {
    return { type: "H", x, relative };
  },

  isHorizontalLineToCommand(
    command: unknown,
  ): command is HorizontalLineToCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "H"
    );
  },
};

/**
 * VerticalLineTo (V/v) コマンド
 * 現在位置から垂直方向に直線を描画
 */
export interface VerticalLineToCommand {
  type: "V";
  y: number;
  relative: boolean;
}

export const VerticalLineToCommand = {
  create(y: number, relative: boolean): VerticalLineToCommand {
    return { type: "V", y, relative };
  },

  isVerticalLineToCommand(command: unknown): command is VerticalLineToCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "V"
    );
  },
};

/**
 * CubicBezier (C/c) コマンド
 * 3次ベジェ曲線を描画
 * (x1, y1): 開始点の制御点
 * (x2, y2): 終了点の制御点
 * (x, y): 終了点
 */
export interface CubicBezierCommand {
  type: "C";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
  relative: boolean;
}

export const CubicBezierCommand = {
  create(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number,
    relative: boolean,
  ): CubicBezierCommand {
    return { type: "C", x1, y1, x2, y2, x, y, relative };
  },

  isCubicBezierCommand(command: unknown): command is CubicBezierCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "C"
    );
  },
};

/**
 * SmoothCubicBezier (S/s) コマンド
 * 滑らかな3次ベジェ曲線を描画
 * 開始点の制御点は前のコマンドから自動計算
 */
export interface SmoothCubicBezierCommand {
  type: "S";
  x2: number;
  y2: number;
  x: number;
  y: number;
  relative: boolean;
}

export const SmoothCubicBezierCommand = {
  create(
    x2: number,
    y2: number,
    x: number,
    y: number,
    relative: boolean,
  ): SmoothCubicBezierCommand {
    return { type: "S", x2, y2, x, y, relative };
  },

  isSmoothCubicBezierCommand(
    command: unknown,
  ): command is SmoothCubicBezierCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "S"
    );
  },
};

/**
 * QuadraticBezier (Q/q) コマンド
 * 2次ベジェ曲線を描画
 * (x1, y1): 制御点
 * (x, y): 終了点
 */
export interface QuadraticBezierCommand {
  type: "Q";
  x1: number;
  y1: number;
  x: number;
  y: number;
  relative: boolean;
}

export const QuadraticBezierCommand = {
  create(
    x1: number,
    y1: number,
    x: number,
    y: number,
    relative: boolean,
  ): QuadraticBezierCommand {
    return { type: "Q", x1, y1, x, y, relative };
  },

  isQuadraticBezierCommand(
    command: unknown,
  ): command is QuadraticBezierCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "Q"
    );
  },
};

/**
 * SmoothQuadraticBezier (T/t) コマンド
 * 滑らかな2次ベジェ曲線を描画
 * 制御点は前のコマンドから自動計算
 */
export interface SmoothQuadraticBezierCommand {
  type: "T";
  x: number;
  y: number;
  relative: boolean;
}

export const SmoothQuadraticBezierCommand = {
  create(
    x: number,
    y: number,
    relative: boolean,
  ): SmoothQuadraticBezierCommand {
    return { type: "T", x, y, relative };
  },

  isSmoothQuadraticBezierCommand(
    command: unknown,
  ): command is SmoothQuadraticBezierCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "T"
    );
  },
};

/**
 * Arc (A/a) コマンド
 * 楕円弧を描画
 * rx, ry: 楕円の半径
 * xAxisRotation: X軸回転角度（度）
 * largeArcFlag: 大きい弧を使用するか
 * sweepFlag: 時計回りに描画するか
 * (x, y): 終了点
 */
export interface ArcCommand {
  type: "A";
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArcFlag: boolean;
  sweepFlag: boolean;
  x: number;
  y: number;
  relative: boolean;
}

export const ArcCommand = {
  create(
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: boolean,
    sweepFlag: boolean,
    x: number,
    y: number,
    relative: boolean,
  ): ArcCommand {
    return {
      type: "A",
      rx,
      ry,
      xAxisRotation,
      largeArcFlag,
      sweepFlag,
      x,
      y,
      relative,
    };
  },

  isArcCommand(command: unknown): command is ArcCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "A"
    );
  },
};

/**
 * ClosePath (Z/z) コマンド
 * 現在のサブパスを閉じる
 */
export interface ClosePathCommand {
  type: "Z";
}

export const ClosePathCommand = {
  create(): ClosePathCommand {
    return { type: "Z" };
  },

  isClosePathCommand(command: unknown): command is ClosePathCommand {
    return (
      typeof command === "object" &&
      command !== null &&
      "type" in command &&
      command.type === "Z"
    );
  },
};

/**
 * 全てのパスコマンドの共用体型
 */
export type PathCommandType =
  | MoveToCommand
  | LineToCommand
  | HorizontalLineToCommand
  | VerticalLineToCommand
  | CubicBezierCommand
  | SmoothCubicBezierCommand
  | QuadraticBezierCommand
  | SmoothQuadraticBezierCommand
  | ArcCommand
  | ClosePathCommand;

/**
 * パスコマンドユーティリティ
 */
export const PathCommand = {
  isPathCommand(command: unknown): command is PathCommandType {
    return (
      MoveToCommand.isMoveToCommand(command) ||
      LineToCommand.isLineToCommand(command) ||
      HorizontalLineToCommand.isHorizontalLineToCommand(command) ||
      VerticalLineToCommand.isVerticalLineToCommand(command) ||
      CubicBezierCommand.isCubicBezierCommand(command) ||
      SmoothCubicBezierCommand.isSmoothCubicBezierCommand(command) ||
      QuadraticBezierCommand.isQuadraticBezierCommand(command) ||
      SmoothQuadraticBezierCommand.isSmoothQuadraticBezierCommand(command) ||
      ArcCommand.isArcCommand(command) ||
      ClosePathCommand.isClosePathCommand(command)
    );
  },
};
