# TextChildrenExecutor リファクタリング設計書

## 現状の問題点

### 1. TextChildrenExecutorの問題

現在の`TextChildrenExecutor`は以下の問題を抱えています：

```typescript
// 現在の実装
export type TextChildrenExecutor<T = unknown> =
  | { kind: "standard" }
  | { kind: "paragraph" }
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { kind: "sequence"; executors: TextChildrenExecutor<T>[] }
  | { kind: "strategy"; name: string; options?: T };
```

**問題点：**
- 過度に複雑な抽象化（strategy、sequenceなど実際には使われていない）
- 実際の処理が`runStandard`に集約され、結局`HTMLTextChildren.toFigmaNodes`を呼ぶだけ
- データ型自体に意味がない（kindだけの判定）
- コンパニオンオブジェクトパターンが不完全

### 2. 子要素処理の再帰的な構造が不明瞭

現在の実装では、HTMLの入れ子構造（`<p>text <strong>bold <em>italic</em></strong></p>`）を処理する際の再帰的な変換が明確でありません。

## 改善案

### 方針1: シンプルなコンパニオンオブジェクトパターン

```typescript
// ========================================
// データ型の定義（純粋なオブジェクト）
// ========================================

// 子要素の変換コンテキスト
type ChildrenContext = {
  parentStyle?: string;
  elementType?: string;
  depth?: number; // ネストの深さ
};

// 変換結果
type ChildrenResult = {
  nodes: FigmaNodeConfig[];
  metadata?: {
    nodeCount: number;
    hasTextNodes: boolean;
    hasBoldNodes: boolean;
    hasItalicNodes: boolean;
  };
};

// ========================================
// HTMLChildrenConverter コンパニオンオブジェクト
// ========================================

export const HTMLChildrenConverter = {
  // コンテキストファクトリ
  createContext(
    elementType?: string,
    parentStyle?: string,
    depth: number = 0
  ): ChildrenContext {
    return { elementType, parentStyle, depth };
  },

  // メイン変換処理
  toFigmaNodes(
    children: HTMLNode[],
    context: ChildrenContext
  ): ChildrenResult {
    if (!children.length) {
      return {
        nodes: [],
        metadata: {
          nodeCount: 0,
          hasTextNodes: false,
          hasBoldNodes: false,
          hasItalicNodes: false,
        }
      };
    }

    const nodes: FigmaNodeConfig[] = [];
    let hasTextNodes = false;
    let hasBoldNodes = false;
    let hasItalicNodes = false;

    for (const child of children) {
      const result = this.convertChild(child, context);
      if (result) {
        nodes.push(result.node);
        // メタデータ更新
        hasTextNodes = hasTextNodes || result.isText;
        hasBoldNodes = hasBoldNodes || result.isBold;
        hasItalicNodes = hasItalicNodes || result.isItalic;
      }
    }

    return {
      nodes,
      metadata: {
        nodeCount: nodes.length,
        hasTextNodes,
        hasBoldNodes,
        hasItalicNodes,
      }
    };
  },

  // 個別の子要素変換
  convertChild(
    child: HTMLNode,
    context: ChildrenContext
  ): { node: FigmaNodeConfig | TextNodeConfig; isText: boolean; isBold: boolean; isItalic: boolean } | null {
    const isHeading = context.elementType && /^h[1-6]$/.test(context.elementType);

    if (isHeading) {
      return this.convertHeadingChild(child, context);
    }
    return this.convertParagraphChild(child, context);
  },

  // 実装の詳細...
};
```

### 方針2: より明確な再帰処理のためのAST風アプローチ

```typescript
// ========================================
// 中間表現（AST風）のデータ型
// ========================================

type TextNode = {
  kind: "text";
  content: string;
  styles: Record<string, string>;
};

type BoldNode = {
  kind: "bold";
  children: ChildNode[];
  styles: Record<string, string>;
};

type ItalicNode = {
  kind: "italic";
  children: ChildNode[];
  styles: Record<string, string>;
};

type ElementNode = {
  kind: "element";
  tagName: string;
  children: ChildNode[];
  styles: Record<string, string>;
};

type ChildNode = TextNode | BoldNode | ItalicNode | ElementNode;

// ========================================
// 各ノードタイプのコンパニオンオブジェクト
// ========================================

const TextNode = {
  from(content: string, styles: Record<string, string> = {}): TextNode {
    return { kind: "text", content, styles };
  },

  toFigmaNode(node: TextNode, context: ChildrenContext): TextNodeConfig {
    const baseConfig = TextNodeConfig.create(node.content);
    return Typography.applyToTextNode(baseConfig, node.styles, context.elementType);
  }
};

const BoldNode = {
  from(children: ChildNode[], styles: Record<string, string> = {}): BoldNode {
    return { kind: "bold", children, styles };
  },

  toFigmaNodes(node: BoldNode, context: ChildrenContext): (TextNodeConfig | FigmaNodeConfig)[] {
    const boldStyles = { ...node.styles, "font-weight": "700" };
    const boldContext = { ...context, parentStyle: JSON.stringify(boldStyles) };

    return node.children.flatMap(child =>
      ChildNodeConverter.toFigmaNodes(child, boldContext)
    );
  }
};

const ItalicNode = {
  from(children: ChildNode[], styles: Record<string, string> = {}): ItalicNode {
    return { kind: "italic", children, styles };
  },

  toFigmaNodes(node: ItalicNode, context: ChildrenContext): (TextNodeConfig | FigmaNodeConfig)[] {
    const italicStyles = { ...node.styles, "font-style": "italic" };
    const italicContext = { ...context, parentStyle: JSON.stringify(italicStyles) };

    return node.children.flatMap(child =>
      ChildNodeConverter.toFigmaNodes(child, italicContext)
    );
  }
};

// ========================================
// 統合コンバーター
// ========================================

const ChildNodeConverter = {
  // HTMLNodeを中間表現に変換
  fromHTMLNode(node: HTMLNode, parentStyles: Record<string, string> = {}): ChildNode | null {
    if (HTMLNode.isTextNode(node)) {
      return TextNode.from(node.content, parentStyles);
    }

    if (!HTMLNode.isElementNode(node)) {
      return null;
    }

    const tagName = node.tagName.toLowerCase();

    // 子要素を再帰的に変換
    const children = node.children
      ? node.children
          .map(child => this.fromHTMLNode(child, parentStyles))
          .filter((c): c is ChildNode => c !== null)
      : [];

    switch(tagName) {
      case "strong":
      case "b":
        return BoldNode.from(children, parentStyles);
      case "em":
      case "i":
        return ItalicNode.from(children, parentStyles);
      default:
        // テキストコンテンツのみ抽出
        const textContent = HTMLNode.extractTextContent(node);
        if (textContent) {
          return TextNode.from(textContent, parentStyles);
        }
        return null;
    }
  },

  // 中間表現をFigmaNodeに変換
  toFigmaNodes(node: ChildNode, context: ChildrenContext): (TextNodeConfig | FigmaNodeConfig)[] {
    switch(node.kind) {
      case "text":
        return [TextNode.toFigmaNode(node, context)];
      case "bold":
        return BoldNode.toFigmaNodes(node, context);
      case "italic":
        return ItalicNode.toFigmaNodes(node, context);
      case "element":
        return ElementNode.toFigmaNodes(node, context);
    }
  },

  // HTMLNode配列を一括変換（エントリポイント）
  convertChildren(
    children: HTMLNode[],
    options: { parentStyle?: string; elementType?: string }
  ): FigmaNodeConfig[] {
    const context = {
      parentStyle: options.parentStyle,
      elementType: options.elementType,
      depth: 0
    };

    const parentStyles = options.parentStyle
      ? Styles.parse(options.parentStyle)
      : {};

    const results: (TextNodeConfig | FigmaNodeConfig)[] = [];

    for (const child of children) {
      const childNode = this.fromHTMLNode(child, parentStyles);
      if (childNode) {
        results.push(...this.toFigmaNodes(childNode, context));
      }
    }

    return results as FigmaNodeConfig[];
  }
};
```

## 推奨する実装方針

### 方針1（シンプル版）を推奨する理由：

1. **現在の実装からの移行が容易**
2. **過度な抽象化を避けられる**
3. **テストが書きやすい**
4. **パフォーマンスが良い**

### 方針2（AST版）を選ぶべきケース：

1. **より複雑な入れ子構造を扱う場合**
2. **中間表現を他の目的でも使いたい場合**
3. **変換ロジックを段階的に分離したい場合**

## 実装手順

### Step 1: TextChildrenExecutorの削除
- `text-element-builder.ts`から`TextChildrenExecutor`関連のコードを削除

### Step 2: 新しいコンバーターの実装
- `text-children.ts`を新しい設計で書き換え
- コンパニオンオブジェクトパターンの適用

### Step 3: text-element-builderの簡略化
- `TextElementBase`から新しいコンバーターを呼び出す
- 不要な抽象化を削除

### Step 4: テストの確認
- 既存のテストがすべて通ることを確認
- 必要に応じてテストを調整

### Step 5: リントと型チェック
- ESLintでコード品質を確認
- TypeScriptの型チェックを実行

## 期待される効果

1. **コードの簡潔性**: 約30-40%のコード削減
2. **可読性の向上**: 明確な責任分離
3. **保守性の向上**: シンプルな構造
4. **拡張性**: 新しい要素タイプの追加が容易
5. **型安全性**: より厳密な型定義

## まとめ

現在の`TextChildrenExecutor`は過度に複雑で、実際の処理と乖離しています。
シンプルなコンパニオンオブジェクトパターンに置き換えることで、
より明確で保守しやすいコードになります。