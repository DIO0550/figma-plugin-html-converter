import type { Brand } from '../../../types';
import type { HTMLNode } from '../html-node';
import { Attributes } from '../attributes';

// HTMLのブランド型
export type HTML = Brand<string, 'HTML'>;

// 定数定義
const NODE_TYPE = {
  ELEMENT: 'element',
  TEXT: 'text',
  ROOT: 'root'
} as const;

const TAG_PATTERN = {
  OPEN_CLOSE: /<\/?(\w+)[^>]*>/g,
  FULL_TAG: /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/,
  NEXT_TAG: /<(\w+)[^>]*>/,
  CLOSING_TAG_PREFIX: '</',
  SELF_CLOSING_SUFFIX: '/>'
} as const;

// HTMLコンパニオンオブジェクト
export const HTML = {
  // 文字列からHTML型を作成
  from(value: string): HTML {
    // 型アサーションのみでブランド型として扱う
    return value as HTML;
  },

  // 基本的なバリデーション
  isValid(value: string): boolean {
    if (!value.trim()) return true; // 空文字列は有効

    // 簡易的なタグのバランスチェック
    const openTags: string[] = [];
    const tagRegex = TAG_PATTERN.OPEN_CLOSE;
    let match;

    while ((match = tagRegex.exec(value)) !== null) {
      const [fullMatch, tagName] = match;
      
      if (fullMatch.startsWith(TAG_PATTERN.CLOSING_TAG_PREFIX)) {
        // 閉じタグ
        if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
          return false; // 対応する開きタグがない
        }
        openTags.pop();
      } else if (!fullMatch.endsWith(TAG_PATTERN.SELF_CLOSING_SUFFIX)) {
        // 開きタグ（セルフクロージングでない）
        openTags.push(tagName);
      }
    }

    return openTags.length === 0; // すべてのタグが閉じられている
  },

  // HTMLをサニタイズ（前後の空白を削除）
  sanitize(value: string): HTML {
    return HTML.from(value.trim());
  },

  // HTMLを安全に作成（バリデーション付き）
  tryFrom(value: string): HTML | null {
    if (!HTML.isValid(value)) {
      return null;
    }
    return HTML.from(value);
  },

  // HTMLをHTMLNodeに変換
  toHTMLNode(html: HTML): HTMLNode {
    const htmlString = html as string;
    return parseHTMLString(htmlString);
  }
};

// 内部パース関数
function parseHTMLString(html: string): HTMLNode {
  const trimmed = html.trim();
  
  // 空のHTMLの場合
  if (!trimmed) {
    return {
      type: NODE_TYPE.ELEMENT,
      tagName: NODE_TYPE.ROOT,
      children: []
    };
  }

  // タグの正規表現パターン
  const match = trimmed.match(TAG_PATTERN.FULL_TAG);

  if (!match) {
    // タグが見つからない場合はテキストとして処理
    const root: HTMLNode = {
      type: NODE_TYPE.ELEMENT,
      tagName: NODE_TYPE.ROOT,
      children: []
    };
    if (trimmed) {
      root.children!.push({
        type: NODE_TYPE.TEXT,
        textContent: trimmed
      });
    }
    return root;
  }

  const [, tagName, attributesStr, content] = match;
  const node: HTMLNode = {
    type: NODE_TYPE.ELEMENT,
    tagName,
    children: []
  };

  // 属性の解析
  if (attributesStr) {
    const attributes = Attributes.parse(attributesStr);
    if (!Attributes.isEmpty(attributes)) {
      node.attributes = attributes;
    }
  }

  // 子要素の解析
  if (content) {
    parseChildren(node, content.trim());
  }

  return node;
}


function parseChildren(parent: HTMLNode, content: string): void {
  let remaining = content;
  
  while (remaining) {
    // 次のタグを探す
    const nextTagMatch = remaining.match(TAG_PATTERN.NEXT_TAG);
    
    if (!nextTagMatch) {
      // タグが見つからない場合は残りをテキストとして追加
      if (remaining.trim()) {
        if (!parent.children) parent.children = [];
        parent.children.push({
          type: NODE_TYPE.TEXT,
          textContent: remaining.trim()
        });
      }
      break;
    }
    
    // タグの前のテキストを追加
    if (nextTagMatch.index! > 0) {
      const text = remaining.substring(0, nextTagMatch.index).trim();
      if (text) {
        if (!parent.children) parent.children = [];
        parent.children.push({
          type: NODE_TYPE.TEXT,
          textContent: text
        });
      }
    }
    
    // 閉じタグを探す
    const tagName = nextTagMatch[1];
    const startPos = nextTagMatch.index! + nextTagMatch[0].length;
    
    let depth = 1;
    let searchPos = startPos;
    let closeTagMatch = null;
    
    // 同じタグ名のネストを考慮して閉じタグを探す
    while (depth > 0 && searchPos < remaining.length) {
      const openPattern = new RegExp(`<${tagName}[^>]*>`, 'g');
      const closePattern = new RegExp(`</${tagName}>`, 'g');
      
      openPattern.lastIndex = searchPos;
      closePattern.lastIndex = searchPos;
      
      const openMatch = openPattern.exec(remaining);
      const closeMatch = closePattern.exec(remaining);
      
      if (!closeMatch) break;
      
      if (openMatch && openMatch.index < closeMatch.index) {
        depth++;
        searchPos = openMatch.index + 1;
      } else {
        depth--;
        if (depth === 0) {
          closeTagMatch = closeMatch.index + closeMatch[0].length;
        } else {
          searchPos = closeMatch.index + 1;
        }
      }
    }
    
    if (closeTagMatch) {
      // 完全なタグを抽出して解析
      const fullTag = remaining.substring(nextTagMatch.index!, closeTagMatch);
      const childNode = parseHTMLString(fullTag);
      if (!parent.children) parent.children = [];
      parent.children.push(childNode);
      
      remaining = remaining.substring(closeTagMatch);
    } else {
      // 閉じタグが見つからない場合は残りをテキストとして追加
      if (!parent.children) parent.children = [];
      parent.children.push({
        type: NODE_TYPE.TEXT,
        textContent: remaining
      });
      break;
    }
  }
}