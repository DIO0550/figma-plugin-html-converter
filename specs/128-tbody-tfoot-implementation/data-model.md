# Data Model: テーブルセクション（tbody, tfoot）

**Date**: 2025-11-23
**Status**: Design Phase

## 概要

tbody/tfoot要素のデータモデル定義です。既存のthead要素と同じパターンに従い、型安全性と一貫性を確保します。

## エンティティ

### 1. TbodyAttributes

テーブルボディセクションの属性を表すインターフェース。

#### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| id | string | ❌ | 要素のID |
| class | string | ❌ | CSSクラス名 |
| style | string | ❌ | インラインスタイル |

#### 型定義

```typescript
export interface TbodyAttributes {
  /** 要素のID */
  id?: string;
  /** CSSクラス名 */
  class?: string;
  /** インラインスタイル */
  style?: string;
}
```

#### バリデーション

- 全てのプロパティはオプショナル
- HTML標準のグローバル属性に準拠

### 2. TbodyElement

テーブルボディセクション要素を表すインターフェース。

#### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| type | "element" | ✅ | 要素タイプ（常に"element"） |
| tagName | "tbody" | ✅ | タグ名（常に"tbody"） |
| attributes | TbodyAttributes | ✅ | 属性オブジェクト |
| children | TrElement[] | ✅ | 子要素（tr要素の配列） |

#### 型定義

```typescript
export interface TbodyElement extends BaseElement<"tbody", TbodyAttributes> {
  /** 子要素（行要素の配列） */
  children: TrElement[];
}
```

#### 制約

- `children`は`TrElement[]`型である必要がある
- `tagName`は常に`"tbody"`
- `BaseElement`インターフェースを継承

### 3. TbodyElementコンパニオンオブジェクト

TbodyElementの生成、検証、変換を提供する静的メソッド群。

#### メソッド

##### 3.1 create()

新しいTbodyElementを生成します。

**シグネチャ**:
```typescript
create(attributes?: Partial<TbodyAttributes>): TbodyElement
```

**パラメータ**:
- `attributes`: 属性オブジェクト（オプショナル）

**戻り値**:
- 新しいTbodyElementオブジェクト

**例**:
```typescript
const tbody = TbodyElement.create();
const tbodyWithClass = TbodyElement.create({ class: "table-body" });
```

##### 3.2 isTbodyElement()

型ガード関数。オブジェクトがTbodyElement型であるかを判定します。

**シグネチャ**:
```typescript
isTbodyElement(node: unknown): node is TbodyElement
```

**パラメータ**:
- `node`: 判定対象のオブジェクト

**戻り値**:
- TbodyElementであれば`true`、そうでなければ`false`

**例**:
```typescript
if (TbodyElement.isTbodyElement(node)) {
  // nodeはTbodyElement型として扱える
}
```

##### 3.3 toFigmaNode()

TbodyElementをFigma FrameNodeConfigに変換します。

**シグネチャ**:
```typescript
toFigmaNode(element: TbodyElement): FigmaNodeConfig
```

**パラメータ**:
- `element`: 変換対象のTbodyElement

**戻り値**:
- FigmaNodeConfig（FrameNode設定）

**変換仕様**:
- `layoutMode`: "VERTICAL"（子要素を縦方向に配置）
- `primaryAxisAlignItems`: "MIN"
- `counterAxisAlignItems`: "MIN"
- `itemSpacing`: 0

**例**:
```typescript
const tbody = TbodyElement.create();
const config = TbodyElement.toFigmaNode(tbody);
```

##### 3.4 mapToFigma()

未知のオブジェクトをTbodyElementとして解釈し、Figma変換します。

**シグネチャ**:
```typescript
mapToFigma(node: unknown): FigmaNodeConfig | null
```

**パラメータ**:
- `node`: マッピング対象のオブジェクト

**戻り値**:
- 成功時: FigmaNodeConfig
- 失敗時: null

**例**:
```typescript
const config = TbodyElement.mapToFigma(unknownNode);
if (config) {
  // 変換成功
}
```

### 4. TfootAttributes

テーブルフッターセクションの属性を表すインターフェース。

#### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| id | string | ❌ | 要素のID |
| class | string | ❌ | CSSクラス名 |
| style | string | ❌ | インラインスタイル |

#### 型定義

```typescript
export interface TfootAttributes {
  /** 要素のID */
  id?: string;
  /** CSSクラス名 */
  class?: string;
  /** インラインスタイル */
  style?: string;
}
```

#### バリデーション

- 全てのプロパティはオプショナル
- HTML標準のグローバル属性に準拠

### 5. TfootElement

テーブルフッターセクション要素を表すインターフェース。

#### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| type | "element" | ✅ | 要素タイプ（常に"element"） |
| tagName | "tfoot" | ✅ | タグ名（常に"tfoot"） |
| attributes | TfootAttributes | ✅ | 属性オブジェクト |
| children | TrElement[] | ✅ | 子要素（tr要素の配列） |

#### 型定義

```typescript
export interface TfootElement extends BaseElement<"tfoot", TfootAttributes> {
  /** 子要素（行要素の配列） */
  children: TrElement[];
}
```

#### 制約

- `children`は`TrElement[]`型である必要がある
- `tagName`は常に`"tfoot"`
- `BaseElement`インターフェースを継承

### 6. TfootElementコンパニオンオブジェクト

TfootElementの生成、検証、変換を提供する静的メソッド群。

#### メソッド

##### 6.1 create()

新しいTfootElementを生成します。

**シグネチャ**:
```typescript
create(attributes?: Partial<TfootAttributes>): TfootElement
```

**パラメータ**:
- `attributes`: 属性オブジェクト（オプショナル）

**戻り値**:
- 新しいTfootElementオブジェクト

**例**:
```typescript
const tfoot = TfootElement.create();
const tfootWithClass = TfootElement.create({ class: "table-footer" });
```

##### 6.2 isTfootElement()

型ガード関数。オブジェクトがTfootElement型であるかを判定します。

**シグネチャ**:
```typescript
isTfootElement(node: unknown): node is TfootElement
```

**パラメータ**:
- `node`: 判定対象のオブジェクト

**戻り値**:
- TfootElementであれば`true`、そうでなければ`false`

**例**:
```typescript
if (TfootElement.isTfootElement(node)) {
  // nodeはTfootElement型として扱える
}
```

##### 6.3 toFigmaNode()

TfootElementをFigma FrameNodeConfigに変換します。

**シグネチャ**:
```typescript
toFigmaNode(element: TfootElement): FigmaNodeConfig
```

**パラメータ**:
- `element`: 変換対象のTfootElement

**戻り値**:
- FigmaNodeConfig（FrameNode設定）

**変換仕様**:
- `layoutMode`: "VERTICAL"（子要素を縦方向に配置）
- `primaryAxisAlignItems`: "MIN"
- `counterAxisAlignItems`: "MIN"
- `itemSpacing`: 0

**例**:
```typescript
const tfoot = TfootElement.create();
const config = TfootElement.toFigmaNode(tfoot);
```

##### 6.4 mapToFigma()

未知のオブジェクトをTfootElementとして解釈し、Figma変換します。

**シグネチャ**:
```typescript
mapToFigma(node: unknown): FigmaNodeConfig | null
```

**パラメータ**:
- `node`: マッピング対象のオブジェクト

**戻り値**:
- 成功時: FigmaNodeConfig
- 失敗時: null

**例**:
```typescript
const config = TfootElement.mapToFigma(unknownNode);
if (config) {
  // 変換成功
}
```

## リレーションシップ

### エンティティ関係図

```
BaseElement (抽象)
    ↑
    ├── TbodyElement
    │   ├── contains: TbodyAttributes
    │   └── has many: TrElement[]
    │
    └── TfootElement
        ├── contains: TfootAttributes
        └── has many: TrElement[]

TrElement (既存)
    ├── has many: TdElement[] | ThElement[]
    └── used by: TbodyElement, TfootElement, TheadElement

TheadElement (既存)
    └── has many: TrElement[]
```

### 関連性

1. **継承**:
   - TbodyElement → BaseElement<"tbody", TbodyAttributes>
   - TfootElement → BaseElement<"tfoot", TfootAttributes>

2. **コンポジション**:
   - TbodyElement contains TbodyAttributes
   - TbodyElement has many TrElement
   - TfootElement contains TfootAttributes
   - TfootElement has many TrElement

3. **使用**:
   - TrElement は TbodyElement, TfootElement, TheadElement で使用される

## 状態遷移

### TbodyElement/TfootElementのライフサイクル

```
[未生成]
    ↓ create()
[空のElement（children: []）]
    ↓ 子要素追加
[子要素を持つElement]
    ↓ toFigmaNode()
[FigmaNodeConfig生成]
    ↓ Figma API
[Figma FrameNode]
```

### 状態

1. **未生成**: まだインスタンスが存在しない
2. **空のElement**: 生成されたが子要素がない
3. **子要素を持つElement**: tr要素が追加された
4. **FigmaNodeConfig生成**: Figma変換済み
5. **Figma FrameNode**: Figma上に配置済み

## バリデーションルール

### TbodyElement

1. **型検証**:
   - `type === "element"`
   - `tagName === "tbody"`
   - `children`が配列である

2. **子要素検証**:
   - 全ての子要素がTrElement型である
   - 空配列も許可される

3. **属性検証**:
   - `id`, `class`, `style`は文字列型（存在する場合）

### TfootElement

1. **型検証**:
   - `type === "element"`
   - `tagName === "tfoot"`
   - `children`が配列である

2. **子要素検証**:
   - 全ての子要素がTrElement型である
   - 空配列も許可される

3. **属性検証**:
   - `id`, `class`, `style`は文字列型（存在する場合）

## 実装の考慮事項

### 1. 型安全性

- TypeScript strict mode下で完全な型安全性を確保
- 型ガード関数による実行時の型チェック
- BaseElement継承による型の一貫性

### 2. 不変性

- エンティティの不変性を維持（作成後の変更は新しいオブジェクトを生成）
- readonly プロパティの活用（必要に応じて）

### 3. パフォーマンス

- 軽量なオブジェクト構造
- 遅延評価の活用（Figma変換は必要時のみ）

### 4. 拡張性

- 将来的な属性追加に対応可能な設計
- インターフェースベースの実装により容易な拡張

## 依存関係

### 依存するモジュール

- `BaseElement`: 基底要素インターフェース
- `TrElement`: 行要素（子要素として使用）
- `FigmaNodeConfig`: Figma変換の設定
- `FigmaNode`: Figmaノード生成ユーティリティ
- `toFigmaNodeWith`: Figma変換ユーティリティ
- `mapToFigmaWith`: マッピングユーティリティ

### 被依存モジュール

- table要素（将来的に、現在は独立）
- HTML to Figma変換パイプライン

## 次のステップ

1. contracts/の作成（このプロジェクトではN/A）
2. quickstart.mdの作成
3. Agent contextの更新
4. Phase 2: tasks.mdの作成（別コマンド）
