import { HTMLNode } from '../html-node';
import { FigmaNodeConfig } from '../figma-node';
import { Paint } from '../paint';
import { Styles } from '../styles';

/**
 * 画像要素の属性インターフェース
 */
export interface ImageAttributes {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  style?: string;
}

/**
 * object-fitプロパティとFigmaのScaleModeのマッピング
 */
const OBJECT_FIT_TO_SCALE_MODE = {
  'cover': 'FILL',
  'contain': 'FIT',
  'fill': 'FILL',
  'none': 'CROP',
  'scale-down': 'FIT'
} as const;

/**
 * 画像要素の変換を管理するコンパニオンオブジェクト
 */
export const ImageElement = {
  /**
   * img要素かどうかを判定
   */
  isImageElement(htmlNode: HTMLNode): boolean {
    return HTMLNode.isElement(htmlNode) && htmlNode.tagName === 'img';
  },

  /**
   * 画像のノード名を生成
   */
  getNodeName(attributes: ImageAttributes): string {
    if (attributes.alt) {
      return `img: ${attributes.alt}`;
    }
    return 'img';
  },

  /**
   * 画像のfillsを作成
   */
  createImageFills(src: string | undefined): Paint[] {
    if (src) {
      return [Paint.image(src)];
    }
    // プレースホルダー（グレーの背景）
    return [Paint.solid({ r: 0.8, g: 0.8, b: 0.8 })];
  },

  /**
   * 画像のサイズを取得
   */
  getImageSize(attributes: ImageAttributes): { width: number; height: number } {
    let width = 100; // デフォルト幅
    let height = 100; // デフォルト高さ

    // width/height属性から取得
    if (attributes.width) {
      const parsedWidth = parseInt(attributes.width, 10);
      if (!isNaN(parsedWidth)) {
        width = parsedWidth;
      }
    }

    if (attributes.height) {
      const parsedHeight = parseInt(attributes.height, 10);
      if (!isNaN(parsedHeight)) {
        height = parsedHeight;
      }
    }

    // スタイル属性が優先される
    if (attributes.style) {
      const styles = Styles.parse(attributes.style);
      
      const styleWidth = Styles.getWidth(styles);
      if (typeof styleWidth === 'number') {
        width = styleWidth;
      }

      const styleHeight = Styles.getHeight(styles);
      if (typeof styleHeight === 'number') {
        height = styleHeight;
      }
    }

    return { width, height };
  },

  /**
   * object-fitプロパティを処理してScaleModeを設定
   */
  applyObjectFit(nodeConfig: FigmaNodeConfig, styles: Styles | null): void {
    if (!styles || !nodeConfig.fills || nodeConfig.fills.length === 0) {
      return;
    }

    const objectFit = Styles.get(styles, 'object-fit');
    if (!objectFit) {
      return;
    }

    const fill = nodeConfig.fills[0];
    if (fill.type !== 'IMAGE') {
      return;
    }

    // object-fitをFigmaのscaleModeにマッピング
    const scaleMode = OBJECT_FIT_TO_SCALE_MODE[objectFit as keyof typeof OBJECT_FIT_TO_SCALE_MODE];
    if (scaleMode) {
      fill.scaleMode = scaleMode;
    } else {
      // デフォルトはFILL
      fill.scaleMode = 'FILL';
    }
  },

  /**
   * img要素をFigmaノードに変換
   */
  convert(htmlNode: HTMLNode): FigmaNodeConfig | null {
    if (!this.isImageElement(htmlNode)) {
      return null;
    }

    const attributes = htmlNode.attributes as ImageAttributes || {};
    
    // Rectangleノードを作成
    const nodeConfig: FigmaNodeConfig = {
      type: 'RECTANGLE',
      name: this.getNodeName(attributes),
      fills: this.createImageFills(attributes.src)
    };

    // サイズを設定
    const { width, height } = this.getImageSize(attributes);
    nodeConfig.width = width;
    nodeConfig.height = height;

    // object-fitプロパティを処理
    if (attributes.style) {
      const styles = Styles.parse(attributes.style);
      this.applyObjectFit(nodeConfig, styles);
    }

    return nodeConfig;
  }
};