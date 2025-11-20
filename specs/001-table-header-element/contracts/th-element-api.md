# ThElement API Contract

**Version**: 1.0.0
**Date**: 2025-11-17

## Overview

このドキュメントはThElement APIの契約を定義します。

## Module Exports

### `th-attributes/index.ts`

```typescript
export type { ThAttributes } from "./th-attributes";
```

### `th-element/index.ts`

```typescript
export { ThElement } from "./th-element";
export type { ThElement as ThElementType } from "./th-element";
```

### `table/th/index.ts`

```typescript
export { ThElement } from "./th-element";
export type { ThElement as ThElementType } from "./th-element";
export type { ThAttributes } from "./th-attributes";
```

## Type Definitions

### ThAttributes

```typescript
interface ThAttributes extends GlobalAttributes {
  width?: string;
  height?: string;
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  abbr?: string;
  colspan?: string;
  rowspan?: string;
}
```

**Contract**:
- MUST extend `GlobalAttributes`
- ALL fields MUST be optional
- `scope` MUST be one of four literal values
- `width`, `height`, `colspan`, `rowspan` MUST be strings
- `abbr` MUST be a string

### ThElement

```typescript
interface ThElement extends BaseElement<"th", ThAttributes> {
  type: "element";
  tagName: "th";
  attributes: ThAttributes;
  children: ThElement[] | [];
}
```

**Contract**:
- MUST extend `BaseElement<"th", ThAttributes>`
- `type` MUST always be `"element"`
- `tagName` MUST always be `"th"`
- `attributes` MUST be of type `ThAttributes`
- `children` MUST be either `ThElement[]` or empty array `[]`

## Static Methods

### `ThElement.isThElement(node: unknown): node is ThElement`

**Purpose**: 型ガード関数。与えられたオブジェクトがThElementかどうかを判定。

**Contract**:
- **Input**: `unknown` type
- **Output**: boolean (type predicate)
- **Behavior**:
  - MUST return `true` if node is a valid ThElement
  - MUST return `false` otherwise
  - MUST NOT throw errors
  - MUST handle null and undefined safely

**Examples**:

```typescript
// Valid ThElement
const validNode = {
  type: "element",
  tagName: "th",
  attributes: {},
  children: [],
};
ThElement.isThElement(validNode); // → true

// Invalid: wrong tagName
const invalidNode = {
  type: "element",
  tagName: "td",
  attributes: {},
  children: [],
};
ThElement.isThElement(invalidNode); // → false

// Invalid: null
ThElement.isThElement(null); // → false

// Invalid: undefined
ThElement.isThElement(undefined); // → false
```

### `ThElement.create(attributes?: Partial<ThAttributes>): ThElement`

**Purpose**: ファクトリメソッド。新しいThElementインスタンスを作成。

**Contract**:
- **Input**: `Partial<ThAttributes>` (optional)
- **Output**: `ThElement`
- **Behavior**:
  - MUST create a valid ThElement
  - MUST set `type` to `"element"`
  - MUST set `tagName` to `"th"`
  - MUST initialize `children` to empty array
  - MUST merge provided attributes with defaults
  - MUST NOT mutate input parameter

**Examples**:

```typescript
// No attributes
const th1 = ThElement.create();
// → { type: "element", tagName: "th", attributes: {}, children: [] }

// With attributes
const th2 = ThElement.create({ scope: "col", width: "100px" });
// → { type: "element", tagName: "th", attributes: { scope: "col", width: "100px" }, children: [] }
```

### `ThElement.toFigmaNode(element: ThElement): FigmaNodeConfig`

**Purpose**: ThElementをFigmaNodeConfigに変換。

**Contract**:
- **Input**: `ThElement`
- **Output**: `FigmaNodeConfig`
- **Behavior**:
  - MUST create a FRAME type node
  - MUST apply default styles (bold, center-aligned)
  - MUST apply user-specified styles (overrides defaults)
  - MUST set node name based on scope attribute
  - MUST apply common styles (border, background, padding, size)
  - MUST NOT mutate input element

**Default Styles**:
```typescript
{
  fontWeight: "bold" | 700,
  textAlign: "center",
  verticalAlign: "middle"
}
```

**Node Naming**:
- If `scope` is defined: `"th-{scope}"` (e.g., "th-col", "th-row")
- If `scope` is undefined: `"th"`

**Examples**:

```typescript
// Basic conversion
const element = ThElement.create();
const config = ThElement.toFigmaNode(element);
// → FigmaNodeConfig with type="FRAME", name="th", default styles applied

// With scope
const elementWithScope = ThElement.create({ scope: "col" });
const configWithScope = ThElement.toFigmaNode(elementWithScope);
// → FigmaNodeConfig with name="th-col"

// With custom styles
const elementWithStyles = ThElement.create({
  style: "font-weight: normal; text-align: left; background-color: #f0f0f0;"
});
const configWithStyles = ThElement.toFigmaNode(elementWithStyles);
// → FigmaNodeConfig with user styles overriding defaults
```

### `ThElement.mapToFigma(node: unknown): FigmaNodeConfig | null`

**Purpose**: unknown型のノードをThElementに変換し、FigmaNodeConfigにマッピング。

**Contract**:
- **Input**: `unknown`
- **Output**: `FigmaNodeConfig | null`
- **Behavior**:
  - MUST return `null` if node is not a ThElement
  - MUST return `FigmaNodeConfig` if node is a valid ThElement
  - MUST use `isThElement` for type checking
  - MUST use `toFigmaNode` for conversion
  - MUST NOT throw errors for invalid input

**Examples**:

```typescript
// Valid ThElement
const validNode = ThElement.create({ scope: "row" });
const result1 = ThElement.mapToFigma(validNode);
// → FigmaNodeConfig with name="th-row"

// Invalid node
const invalidNode = { type: "text", content: "Hello" };
const result2 = ThElement.mapToFigma(invalidNode);
// → null

// Null input
const result3 = ThElement.mapToFigma(null);
// → null
```

## Error Handling

### Type Guard Errors

`isThElement` MUST NOT throw errors:
- Handle null/undefined gracefully
- Handle primitive values gracefully
- Handle objects missing required properties gracefully

### Factory Errors

`create` MAY throw errors for:
- Invalid attribute values (implementation-defined)
- Type mismatches (TypeScript compile-time)

`create` MUST NOT throw errors for:
- Missing attributes (all are optional)
- Partial attributes

### Conversion Errors

`toFigmaNode` MAY throw errors for:
- Invalid CSS values in style attribute
- Unsupported Figma features

`mapToFigma` MUST NOT throw errors:
- MUST return `null` for invalid input
- MUST handle all error cases internally

## Compatibility

### Backward Compatibility

- Type signatures MUST NOT change in minor versions
- Default behavior MUST NOT change in minor versions
- New optional parameters MAY be added in minor versions

### Forward Compatibility

- Future versions MAY add new attributes to ThAttributes
- Future versions MAY add new methods to ThElement companion
- Future versions MUST maintain existing method signatures

## Testing Contract

### Unit Tests MUST Cover

1. **Type Guard**:
   - Valid ThElement returns true
   - Invalid nodes return false
   - Null/undefined returns false
   - Edge cases (missing properties, wrong types)

2. **Factory**:
   - Creates valid ThElement
   - Handles no attributes
   - Handles partial attributes
   - Handles all attributes
   - Does not mutate input

3. **Conversion**:
   - Applies default styles
   - Applies user styles (overrides defaults)
   - Sets correct node name (with/without scope)
   - Applies common styles

4. **Mapping**:
   - Returns FigmaNodeConfig for valid input
   - Returns null for invalid input
   - Does not throw errors

### Integration Tests MUST Cover

1. End-to-end conversion from HTML to Figma
2. Style precedence (defaults vs user styles)
3. Attribute handling (scope, colspan, rowspan)
4. Complex scenarios (nested elements, multiple styles)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-17 | Initial API definition |
