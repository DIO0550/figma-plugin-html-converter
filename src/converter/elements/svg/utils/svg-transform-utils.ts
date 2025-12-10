/**
 * SVG transform属性の変換コマンド型定義
 */
export type TransformCommand =
  | TranslateCommand
  | RotateCommand
  | ScaleCommand
  | SkewXCommand
  | SkewYCommand
  | MatrixCommand;

export interface TranslateCommand {
  type: "translate";
  tx: number;
  ty: number;
}

export interface RotateCommand {
  type: "rotate";
  angle: number;
  cx: number;
  cy: number;
}

export interface ScaleCommand {
  type: "scale";
  sx: number;
  sy: number;
}

export interface SkewXCommand {
  type: "skewX";
  angle: number;
}

export interface SkewYCommand {
  type: "skewY";
  angle: number;
}

export interface MatrixCommand {
  type: "matrix";
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export interface TransformedBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * SVG transform属性を解析・適用するユーティリティ
 */
export const SvgTransformUtils = {
  /**
   * transform属性文字列を解析してコマンド配列に変換する
   *
   * - 未知のコマンドは無視される（配列に含まれない）
   * - 正規表現 `/(\w+)\s*\(([^)]*)\)/g` にマッチする部分のみを抽出
   * - 厳密な構文チェックは行わない
   * - 不正な引数（数値変換できない値）はNaNとしてフィルタリングされる
   *
   * @param transform SVGのtransform属性文字列
   * @returns 解析されたTransformCommandの配列
   */
  parseTransform(transform: string | undefined): TransformCommand[] {
    if (!transform || transform.trim() === "") {
      return [];
    }

    const commands: TransformCommand[] = [];
    const regex = /(\w+)\s*\(([^)]*)\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(transform)) !== null) {
      const commandType = match[1].toLowerCase();
      const argsString = match[2];
      const args = this.parseArgs(argsString);

      const command = this.createCommand(commandType, args);
      if (command) {
        commands.push(command);
      }
    }

    return commands;
  },

  /**
   * 引数文字列を数値配列に変換する
   *
   * 空白とカンマの両方を区切り文字として扱います。
   * 不正な値（NaNとなる文字列）はフィルタリングされます。
   *
   * @param argsString 変換する引数文字列（例: "10, 20" または "10 20"）
   * @returns パースされた数値の配列（NaNは除外）
   */
  parseArgs(argsString: string): number[] {
    return argsString
      .split(/[\s,]+/)
      .filter((s) => s.trim() !== "")
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
  },

  /**
   * コマンドタイプと引数からTransformCommandを作成する
   */
  createCommand(commandType: string, args: number[]): TransformCommand | null {
    switch (commandType) {
      case "translate":
        return {
          type: "translate",
          tx: args[0] ?? 0,
          ty: args[1] ?? 0,
        };

      case "rotate":
        return {
          type: "rotate",
          angle: args[0] ?? 0,
          cx: args[1] ?? 0,
          cy: args[2] ?? 0,
        };

      case "scale": {
        const sx = args[0] ?? 1;
        const sy = args[1] ?? sx;
        return {
          type: "scale",
          sx,
          sy,
        };
      }

      case "skewx":
        return {
          type: "skewX",
          angle: args[0] ?? 0,
        };

      case "skewy":
        return {
          type: "skewY",
          angle: args[0] ?? 0,
        };

      case "matrix":
        return {
          type: "matrix",
          a: args[0] ?? 1,
          b: args[1] ?? 0,
          c: args[2] ?? 0,
          d: args[3] ?? 1,
          e: args[4] ?? 0,
          f: args[5] ?? 0,
        };

      default:
        return null;
    }
  },

  /**
   * 境界ボックスに変換コマンドを適用した結果を計算する
   */
  calculateTransformedBounds(
    bounds: TransformedBounds,
    commands: TransformCommand[],
  ): TransformedBounds {
    if (commands.length === 0) {
      return bounds;
    }

    let result = { ...bounds };

    for (const command of commands) {
      result = this.applyCommand(result, command);
    }

    return result;
  },

  /**
   * 単一のコマンドを境界ボックスに適用する
   *
   * 注意: rotate, skewX, skewY, matrixは簡易実装のため、
   * 境界ボックスの変形計算は行わず、そのまま返します。
   * 完全な実装には行列演算による4隅の座標変換が必要です。
   */
  applyCommand(
    bounds: TransformedBounds,
    command: TransformCommand,
  ): TransformedBounds {
    switch (command.type) {
      case "translate":
        return {
          ...bounds,
          x: bounds.x + command.tx,
          y: bounds.y + command.ty,
        };

      case "scale":
        // 注意: 原点(0,0)を基準としたスケーリングを想定
        // SVGのtransform-origin属性には未対応
        return {
          x: bounds.x * command.sx,
          y: bounds.y * command.sy,
          width: bounds.width * command.sx,
          height: bounds.height * command.sy,
        };

      case "rotate":
      case "skewX":
      case "skewY":
      case "matrix":
        // 回転・スキュー・行列変換は簡易実装（境界ボックスをそのまま返す）
        return bounds;

      default:
        return bounds;
    }
  },

  /**
   * コマンド配列から累積移動量を抽出する
   */
  extractTranslation(commands: TransformCommand[]): { x: number; y: number } {
    let x = 0;
    let y = 0;

    for (const command of commands) {
      if (command.type === "translate") {
        x += command.tx;
        y += command.ty;
      }
    }

    return { x, y };
  },
};
