import type { Brand } from '../../../types';

// Attributesのブランド型
export type Attributes = Brand<Record<string, string>, 'Attributes'>;

// Attributesコンパニオンオブジェクト
export const Attributes = {
  // 空のAttributes作成
  empty(): Attributes {
    return {} as Attributes;
  },

  // オブジェクトからAttributes型を作成
  from(value: Record<string, string>): Attributes {
    return value as Attributes;
  },

  // HTML属性文字列をパース
  parse(attributesStr: string): Attributes {
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+)(?:="([^"]*)")?/g;
    let match;

    while ((match = attrRegex.exec(attributesStr)) !== null) {
      attributes[match[1]] = match[2] || '';
    }

    return Attributes.from(attributes);
  },

  // Attributesをマージ
  merge(base: Attributes, override: Attributes): Attributes {
    return Attributes.from({ ...base, ...override });
  },

  // 特定の属性を取得
  get(attributes: Attributes, key: string): string | undefined {
    return attributes[key];
  },

  // 特定の属性を設定
  set(attributes: Attributes, key: string, value: string): Attributes {
    return Attributes.from({ ...attributes, [key]: value });
  },

  // 特定の属性を削除
  remove(attributes: Attributes, key: string): Attributes {
    const { [key]: _, ...rest } = attributes;
    return Attributes.from(rest);
  },

  // Attributesが空かどうか
  isEmpty(attributes: Attributes): boolean {
    return Object.keys(attributes).length === 0;
  },

  // class属性をパース
  parseClasses(classStr: string): string[] {
    return classStr.trim().split(/\s+/).filter(Boolean);
  },

  // class属性に追加
  addClass(attributes: Attributes, className: string): Attributes {
    const current = attributes.class || '';
    const classes = Attributes.parseClasses(current);
    
    if (!classes.includes(className)) {
      classes.push(className);
    }
    
    return Attributes.set(attributes, 'class', classes.join(' '));
  },

  // class属性から削除
  removeClass(attributes: Attributes, className: string): Attributes {
    const current = attributes.class || '';
    const classes = Attributes.parseClasses(current);
    const filtered = classes.filter(c => c !== className);
    
    if (filtered.length === 0) {
      return Attributes.remove(attributes, 'class');
    }
    
    return Attributes.set(attributes, 'class', filtered.join(' '));
  },

  // id属性を取得
  getId(attributes: Attributes): string | undefined {
    return attributes.id;
  },

  // style属性を取得
  getStyle(attributes: Attributes): string | undefined {
    return attributes.style;
  }
};