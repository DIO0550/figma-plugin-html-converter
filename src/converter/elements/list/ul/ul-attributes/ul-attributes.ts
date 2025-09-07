import { GlobalAttributes } from "../../../base/global-attributes";

export interface UlAttributesProps extends GlobalAttributes {
  type?: string;
  compact?: boolean;
}

export class UlAttributes implements UlAttributesProps {
  readonly type?: string;
  readonly compact?: boolean;
  readonly id?: string;
  readonly className?: string;

  // 内部でオブジェクトとして管理
  private _style?: string | Record<string, string>;

  // publicインターフェースはstringとして公開
  get style(): string | undefined {
    if (this._style === undefined) return undefined;
    if (this._style === "") return "";
    if (!this._style) return undefined;
    if (typeof this._style === "string") return this._style;
    // オブジェクトの場合は文字列に変換
    return Object.entries(this._style)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }

  // Index signature to satisfy GlobalAttributes
  [key: string]: unknown;

  constructor(props: UlAttributesProps = {}) {
    this.type = props.type;
    this.compact = props.compact;
    this.id = props.id;
    this.className = props.className;

    // styleはstring, Record<string, string>, またはanyを受け入れる
    if (props.style !== undefined) {
      if (typeof props.style === "string") {
        this._style = props.style;
      } else if (typeof props.style === "object") {
        // オブジェクトをそのまま保存
        const styleObj: Record<string, string> = {};
        Object.entries(props.style).forEach(([key, value]) => {
          if (typeof value === "string") {
            styleObj[key] = value;
          }
        });
        this._style = styleObj;
      }
    }
  }

  // 内部用メソッド: styleをオブジェクトとして取得
  getStyleAsObject(): Record<string, string> | undefined {
    if (!this._style) return undefined;
    if (typeof this._style === "string") {
      // 文字列をパース
      const styleObj: Record<string, string> = {};
      this._style.split(";").forEach((rule) => {
        const [key, value] = rule.split(":").map((s) => s.trim());
        if (key && value) {
          styleObj[key] = value;
        }
      });
      return styleObj;
    }
    return this._style;
  }

  static from(attributes: Record<string, string>): UlAttributes {
    const props: UlAttributesProps = {};

    if (attributes.type) {
      props.type = attributes.type;
    }

    if (attributes.compact) {
      props.compact = attributes.compact === "true";
    }

    if (attributes.id) {
      props.id = attributes.id;
    }

    if (attributes.class) {
      props.className = attributes.class;
    }

    if (attributes.style) {
      // styleを文字列として保持
      props.style = attributes.style;
    }

    return new UlAttributes(props);
  }
}
