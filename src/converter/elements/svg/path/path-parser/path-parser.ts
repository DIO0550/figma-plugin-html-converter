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

    let implicitCommand = "";
    let implicitRelative = false;

    for (const segment of segments) {
      const commandChar = segment.command;
      const argsString = segment.args;

      const command = commandChar.toUpperCase();
      const isRelative = commandChar === commandChar.toLowerCase();

      if (command === "Z") {
        commands.push(ClosePathCommand.create());
        continue;
      }

      const numbers = this.parseNumbers(argsString);
      const newCommands = this.createCommands(command, numbers, isRelative, "");
      commands.push(...newCommands);

      // Mの後の暗黙的なLineToに対応
      if (command === "M") {
        implicitCommand = "L";
        implicitRelative = isRelative;
      } else {
        implicitCommand = command;
        implicitRelative = isRelative;
      }
    }

    // 暗黙的なコマンドの処理（現時点では使用しない）
    void implicitCommand;
    void implicitRelative;

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
    _lastCommand: string,
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
   */
  createMoveToCommands(
    numbers: number[],
    relative: boolean,
  ): PathCommandType[] {
    const commands: PathCommandType[] = [];

    for (let i = 0; i + 1 < numbers.length; i += 2) {
      if (i === 0) {
        commands.push(
          MoveToCommand.create(numbers[i], numbers[i + 1], relative),
        );
      } else {
        // 最初以降はLineToとして扱う
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

    for (let i = 0; i + 1 < numbers.length; i += 2) {
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

    for (let i = 0; i + 5 < numbers.length; i += 6) {
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

    for (let i = 0; i + 3 < numbers.length; i += 4) {
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

    for (let i = 0; i + 3 < numbers.length; i += 4) {
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

    for (let i = 0; i + 1 < numbers.length; i += 2) {
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

    for (let i = 0; i + 6 < numbers.length; i += 7) {
      commands.push(
        ArcCommand.create(
          numbers[i], // rx
          numbers[i + 1], // ry
          numbers[i + 2], // xAxisRotation
          numbers[i + 3] !== 0, // largeArcFlag
          numbers[i + 4] !== 0, // sweepFlag
          numbers[i + 5], // x
          numbers[i + 6], // y
          relative,
        ),
      );
    }

    return commands;
  },
};
