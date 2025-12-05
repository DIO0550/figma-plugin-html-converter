/**
 * SVGパスパーサー
 *
 * SVGのpath要素のd属性を解析してPathCommandの配列を返します。
 */

import type { PathCommandType } from "./path-command";
import {
  MoveToCommand,
  LineToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand,
  CubicBezierCommand,
  SmoothCubicBezierCommand,
  QuadraticBezierCommand,
  SmoothQuadraticBezierCommand,
  ArcCommand,
  ClosePathCommand,
} from "./path-command";

/**
 * 数値の正規表現パターン
 * 整数、小数、指数表記に対応
 */
const NUMBER_PATTERN = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;

/**
 * SVGパスコマンドが必要とするパラメータ数
 * SVG仕様に基づく各コマンドの引数数を定義
 */
const COMMAND_PARAM_COUNTS = {
  /** M/m: x, y */
  MOVE_TO: 2,
  /** L/l: x, y */
  LINE_TO: 2,
  /** H/h: x */
  HORIZONTAL_LINE_TO: 1,
  /** V/v: y */
  VERTICAL_LINE_TO: 1,
  /** C/c: x1, y1, x2, y2, x, y */
  CUBIC_BEZIER: 6,
  /** S/s: x2, y2, x, y */
  SMOOTH_CUBIC_BEZIER: 4,
  /** Q/q: x1, y1, x, y */
  QUADRATIC_BEZIER: 4,
  /** T/t: x, y */
  SMOOTH_QUADRATIC_BEZIER: 2,
  /** A/a: rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y */
  ARC: 7,
} as const;

/**
 * コマンドセグメントを分割するための正規表現
 * コマンド文字の後に続く引数すべてを1つのグループとしてキャプチャ
 */
const COMMAND_SEGMENT_PATTERN =
  /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;

/**
 * パスパーサー
 */
export const PathParser = {
  /**
   * SVGパスデータをパースしてコマンド配列を返す
   * @param pathData SVGパスのd属性値
   * @returns パスコマンドの配列
   */
  parse(pathData: string): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const trimmed = pathData.trim();

    if (!trimmed) {
      return commands;
    }

    // コマンドセグメントを正規表現で分割
    const segments = this.splitIntoCommandSegments(trimmed);

    for (const segment of segments) {
      const commandChar = segment.command;
      const argsString = segment.args;

      // SVG仕様: 大文字は絶対座標、小文字は相対座標を表す
      const command = commandChar.toUpperCase();
      const isRelative = commandChar === commandChar.toLowerCase();

      // Zコマンドはパラメータを持たないため、早期に処理して継続
      if (command === "Z") {
        commands.push(ClosePathCommand.create());
        continue;
      }

      const numbers = this.parseNumbers(argsString);
      const newCommands = this.createCommands(command, numbers, isRelative);
      commands.push(...newCommands);
    }

    return commands;
  },

  /**
   * パスデータをコマンドセグメントに分割
   */
  splitIntoCommandSegments(
    pathData: string,
  ): Array<{ command: string; args: string }> {
    const segments: Array<{ command: string; args: string }> = [];

    // 正規表現をリセット
    COMMAND_SEGMENT_PATTERN.lastIndex = 0;

    let match;
    while ((match = COMMAND_SEGMENT_PATTERN.exec(pathData)) !== null) {
      segments.push({
        command: match[1],
        args: match[2].trim(),
      });
    }

    return segments;
  },

  /**
   * 文字列から数値の配列を抽出
   */
  parseNumbers(str: string): number[] {
    const matches = str.match(NUMBER_PATTERN);
    if (!matches) {
      return [];
    }
    return matches.map((m) => parseFloat(m));
  },

  /**
   * コマンドと引数からPathCommandを作成
   */
  createCommands(
    command: string,
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];

    switch (command) {
      case "M":
        commands.push(...this.createMoveToCommands(numbers, relative));
        break;
      case "L":
        commands.push(...this.createLineToCommands(numbers, relative));
        break;
      case "H":
        commands.push(
          ...this.createHorizontalLineToCommands(numbers, relative),
        );
        break;
      case "V":
        commands.push(...this.createVerticalLineToCommands(numbers, relative));
        break;
      case "C":
        commands.push(...this.createCubicBezierCommands(numbers, relative));
        break;
      case "S":
        commands.push(
          ...this.createSmoothCubicBezierCommands(numbers, relative),
        );
        break;
      case "Q":
        commands.push(...this.createQuadraticBezierCommands(numbers, relative));
        break;
      case "T":
        commands.push(
          ...this.createSmoothQuadraticBezierCommands(numbers, relative),
        );
        break;
      case "A":
        commands.push(...this.createArcCommands(numbers, relative));
        break;
      case "Z":
        commands.push(ClosePathCommand.create());
        break;
    }

    return commands;
  },

  /**
   * MoveToコマンドを作成
   *
   * SVG仕様: M/mコマンドの後に続く座標ペアは暗黙的にL/lコマンドとして解釈される
   * 例: "M 10 20 30 40" は "M 10 20 L 30 40" と同等
   */
  createMoveToCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.MOVE_TO;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      if (i === 0) {
        commands.push(
          MoveToCommand.create(numbers[i], numbers[i + 1], relative),
        );
      } else {
        // SVG仕様: 最初の座標ペア以降はLineToとして解釈される
        commands.push(
          LineToCommand.create(numbers[i], numbers[i + 1], relative),
        );
      }
    }

    return commands;
  },

  /**
   * LineToコマンドを作成
   */
  createLineToCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.LINE_TO;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      commands.push(LineToCommand.create(numbers[i], numbers[i + 1], relative));
    }

    return commands;
  },

  /**
   * HorizontalLineToコマンドを作成
   */
  createHorizontalLineToCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    return numbers.map((x) => HorizontalLineToCommand.create(x, relative));
  },

  /**
   * VerticalLineToコマンドを作成
   */
  createVerticalLineToCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    return numbers.map((y) => VerticalLineToCommand.create(y, relative));
  },

  /**
   * CubicBezierコマンドを作成
   */
  createCubicBezierCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.CUBIC_BEZIER;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      commands.push(
        CubicBezierCommand.create(
          numbers[i],
          numbers[i + 1],
          numbers[i + 2],
          numbers[i + 3],
          numbers[i + 4],
          numbers[i + 5],
          relative,
        ),
      );
    }

    return commands;
  },

  /**
   * SmoothCubicBezierコマンドを作成
   */
  createSmoothCubicBezierCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.SMOOTH_CUBIC_BEZIER;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      commands.push(
        SmoothCubicBezierCommand.create(
          numbers[i],
          numbers[i + 1],
          numbers[i + 2],
          numbers[i + 3],
          relative,
        ),
      );
    }

    return commands;
  },

  /**
   * QuadraticBezierコマンドを作成
   */
  createQuadraticBezierCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.QUADRATIC_BEZIER;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      commands.push(
        QuadraticBezierCommand.create(
          numbers[i],
          numbers[i + 1],
          numbers[i + 2],
          numbers[i + 3],
          relative,
        ),
      );
    }

    return commands;
  },

  /**
   * SmoothQuadraticBezierコマンドを作成
   */
  createSmoothQuadraticBezierCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.SMOOTH_QUADRATIC_BEZIER;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      commands.push(
        SmoothQuadraticBezierCommand.create(
          numbers[i],
          numbers[i + 1],
          relative,
        ),
      );
    }

    return commands;
  },

  /**
   * Arcコマンドを作成
   */
  createArcCommands(numbers: number[], relative: boolean): PathCommandType[] {
    const commands: PathCommandType[] = [];
    const paramCount = COMMAND_PARAM_COUNTS.ARC;

    for (let i = 0; i + paramCount - 1 < numbers.length; i += paramCount) {
      // 配列分割で各パラメータを明示的に抽出（可読性向上）
      const [rx, ry, xAxisRotation, largeArcFlagNum, sweepFlagNum, x, y] =
        numbers.slice(i, i + paramCount);

      commands.push(
        ArcCommand.create(
          rx,
          ry,
          xAxisRotation,
          largeArcFlagNum !== 0,
          sweepFlagNum !== 0,
          x,
          y,
          relative,
        ),
      );
    }

    return commands;
  },
};
