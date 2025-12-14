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
   *   - SVG仕様には他の変換コマンドも存在するが、現在の実装では基本的な
   *     変換（translate, rotate, scale, skewX, skewY, matrix）のみをサポート
   * - 正規表現 `/(\w+)\s*\(([^)]*)\)/g` にマッチする部分のみを抽出
   *   - 注意: ネストされた括弧には対応していない（transform属性では不要）
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
   *
   * SVG仕様に基づくデフォルト値:
   * - translate: ty省略時は0
   * - rotate: cx, cy省略時は0（原点を中心とした回転）
   * - scale: sy省略時はsxと同じ値（均等スケール）、引数なしは1
   * - skewX/skewY: angle省略時は0
   * - matrix: SVG単位行列のデフォルト値
   *
   * @param commandType コマンドタイプ文字列（小文字化済み）
   * @param args 解析された数値引数の配列
   * @returns TransformCommand、または未知のコマンドの場合はnull
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
   *
   * @param bounds - 変換対象の境界ボックス
   * @param commands - 適用する変換コマンドの配列
   * @returns 変換後の境界ボックス
   */
  calculateTransformedBounds(
    bounds: TransformedBounds,
    commands: TransformCommand[],
  ): TransformedBounds {
    if (commands.length === 0) {
      return bounds;
    }

    let transformedBounds = { ...bounds };

    for (const command of commands) {
      transformedBounds = this.applyCommand(transformedBounds, command);
    }

    return transformedBounds;
  },

  /**
   * 単一のコマンドを境界ボックスに適用する
   *
   * @param bounds - 適用対象の境界ボックス
   * @param command - 適用する変換コマンド
   * @returns 変換後の境界ボックス
   *
   * 制限事項:
   * - rotate, skewX, skewY, matrixは完全な実装には4隅の座標を変換行列で
   *   計算し、新しい境界ボックスを算出する必要があるため、現在は境界ボックスを
   *   そのまま返す
   * - scaleは原点(0,0)を基準としたスケーリングを想定。
   *   SVGのtransform-origin属性には未対応
   * - 負のスケール値（反転）の場合、Figmaでは負のwidth/heightは
   *   許容されないため、絶対値を使用する
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
        return {
          x: bounds.x * command.sx,
          y: bounds.y * command.sy,
          width: Math.abs(bounds.width * command.sx),
          height: Math.abs(bounds.height * command.sy),
        };

      case "rotate":
      case "skewX":
      case "skewY":
      case "matrix":
        return bounds;

      default:
        return bounds;
    }
  },

  /**
   * コマンド配列から累積移動量（translateのみ）を抽出する
   *
   * @param commands - 解析対象の変換コマンド配列
   * @returns コマンド全体の累積移動量（x, y）
   *
   * 設計意図:
   * 本関数はSVGのtransform属性に含まれる「translate」コマンドのみを抽出し、
   * 他の変換（rotate, skewX, skewY, matrix, scale）は無視する。
   * これは、移動量のみを必要とするユースケース（例: Figma座標系への単純な位置変換）
   * を想定しているため。回転や歪み、行列変換を正確に反映するには、より高度な
   * 行列演算が必要となり、単純なx/y移動量として表現できないため対象外としている。
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
