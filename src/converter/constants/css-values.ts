/**
 * CSS標準値の定数定義
 * CSSの仕様に基づく標準的な値を定義
 */

// Display関連
export const CSS_DISPLAY = {
  NONE: "none",
  BLOCK: "block",
  INLINE: "inline",
  INLINE_BLOCK: "inline-block",
  FLEX: "flex",
  INLINE_FLEX: "inline-flex",
  GRID: "grid",
  INLINE_GRID: "inline-grid",
  TABLE: "table",
  TABLE_CELL: "table-cell",
  TABLE_ROW: "table-row",
  LIST_ITEM: "list-item"
} as const;

// Flexbox関連
export const CSS_FLEX_DIRECTION = {
  ROW: "row",
  ROW_REVERSE: "row-reverse",
  COLUMN: "column",
  COLUMN_REVERSE: "column-reverse"
} as const;

export const CSS_JUSTIFY_CONTENT = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  SPACE_EVENLY: "space-evenly",
  START: "start",
  END: "end",
  LEFT: "left",
  RIGHT: "right"
} as const;

export const CSS_ALIGN_ITEMS = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  BASELINE: "baseline",
  STRETCH: "stretch",
  START: "start",
  END: "end",
  SELF_START: "self-start",
  SELF_END: "self-end"
} as const;

export const CSS_ALIGN_CONTENT = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  SPACE_EVENLY: "space-evenly",
  STRETCH: "stretch",
  START: "start",
  END: "end"
} as const;

export const CSS_FLEX_WRAP = {
  NOWRAP: "nowrap",
  WRAP: "wrap",
  WRAP_REVERSE: "wrap-reverse"
} as const;

// Position関連
export const CSS_POSITION = {
  STATIC: "static",
  RELATIVE: "relative",
  ABSOLUTE: "absolute",
  FIXED: "fixed",
  STICKY: "sticky"
} as const;

// Box Sizing関連
export const CSS_BOX_SIZING = {
  CONTENT_BOX: "content-box",
  BORDER_BOX: "border-box"
} as const;

// Overflow関連
export const CSS_OVERFLOW = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
  SCROLL: "scroll",
  AUTO: "auto",
  CLIP: "clip"
} as const;

// Text Align関連
export const CSS_TEXT_ALIGN = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFY: "justify",
  START: "start",
  END: "end"
} as const;

// Font Weight関連
export const CSS_FONT_WEIGHT = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900
} as const;

// 単位関連
export const CSS_UNITS = {
  // 絶対単位
  PX: "px",
  PT: "pt",
  PC: "pc",
  IN: "in",
  CM: "cm",
  MM: "mm",
  
  // 相対単位
  EM: "em",
  REM: "rem",
  PERCENT: "%",
  VW: "vw",
  VH: "vh",
  VMIN: "vmin",
  VMAX: "vmax",
  CH: "ch",
  EX: "ex",
  
  // その他
  AUTO: "auto",
  INHERIT: "inherit",
  INITIAL: "initial",
  UNSET: "unset"
} as const;

// Border Style関連
export const CSS_BORDER_STYLE = {
  NONE: "none",
  HIDDEN: "hidden",
  DOTTED: "dotted",
  DASHED: "dashed",
  SOLID: "solid",
  DOUBLE: "double",
  GROOVE: "groove",
  RIDGE: "ridge",
  INSET: "inset",
  OUTSET: "outset"
} as const;

// Cursor関連
export const CSS_CURSOR = {
  AUTO: "auto",
  DEFAULT: "default",
  NONE: "none",
  POINTER: "pointer",
  PROGRESS: "progress",
  WAIT: "wait",
  TEXT: "text",
  MOVE: "move",
  NOT_ALLOWED: "not-allowed",
  GRAB: "grab",
  GRABBING: "grabbing"
} as const;

// デフォルト値
export const CSS_DEFAULTS = {
  // Flexbox
  FLEX_DIRECTION: CSS_FLEX_DIRECTION.ROW,
  JUSTIFY_CONTENT: CSS_JUSTIFY_CONTENT.FLEX_START,
  ALIGN_ITEMS: CSS_ALIGN_ITEMS.STRETCH,
  FLEX_WRAP: CSS_FLEX_WRAP.NOWRAP,
  
  // Display
  DISPLAY: CSS_DISPLAY.BLOCK,
  
  // Position
  POSITION: CSS_POSITION.STATIC,
  
  // Box Model
  BOX_SIZING: CSS_BOX_SIZING.CONTENT_BOX,
  
  // Text
  TEXT_ALIGN: CSS_TEXT_ALIGN.LEFT,
  
  // Font
  FONT_WEIGHT: CSS_FONT_WEIGHT.NORMAL,
  
  // Overflow
  OVERFLOW: CSS_OVERFLOW.VISIBLE,
  
  // Border
  BORDER_STYLE: CSS_BORDER_STYLE.NONE,
  
  // Cursor
  CURSOR: CSS_CURSOR.AUTO,
  
  // Numeric
  SPACING: 0,
  PADDING: 0,
  MARGIN: 0
} as const;

// パディング/マージンのショートハンド記法
export const CSS_SHORTHAND = {
  SINGLE_VALUE: 1,
  TWO_VALUES: 2,
  THREE_VALUES: 3,
  FOUR_VALUES: 4
} as const;

// パディング/マージンの配列インデックス
export const CSS_BOX_MODEL_INDEX = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
} as const;

// 型定義のエクスポート
export type CSSDisplay = typeof CSS_DISPLAY[keyof typeof CSS_DISPLAY];
export type CSSFlexDirection = typeof CSS_FLEX_DIRECTION[keyof typeof CSS_FLEX_DIRECTION];
export type CSSJustifyContent = typeof CSS_JUSTIFY_CONTENT[keyof typeof CSS_JUSTIFY_CONTENT];
export type CSSAlignItems = typeof CSS_ALIGN_ITEMS[keyof typeof CSS_ALIGN_ITEMS];
export type CSSAlignContent = typeof CSS_ALIGN_CONTENT[keyof typeof CSS_ALIGN_CONTENT];
export type CSSFlexWrap = typeof CSS_FLEX_WRAP[keyof typeof CSS_FLEX_WRAP];
export type CSSPosition = typeof CSS_POSITION[keyof typeof CSS_POSITION];
export type CSSBoxSizing = typeof CSS_BOX_SIZING[keyof typeof CSS_BOX_SIZING];
export type CSSOverflow = typeof CSS_OVERFLOW[keyof typeof CSS_OVERFLOW];
export type CSSTextAlign = typeof CSS_TEXT_ALIGN[keyof typeof CSS_TEXT_ALIGN];
export type CSSBorderStyle = typeof CSS_BORDER_STYLE[keyof typeof CSS_BORDER_STYLE];
export type CSSCursor = typeof CSS_CURSOR[keyof typeof CSS_CURSOR];
export type CSSUnit = typeof CSS_UNITS[keyof typeof CSS_UNITS];