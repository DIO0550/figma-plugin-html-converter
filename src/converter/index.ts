import type { FigmaNodeConfig } from './types';
import { ConversionOptions } from './types';
import type { ConversionOptions as ConversionOptionsType } from './types';
import { HTML } from './models/html';
import { mapHTMLNodeToFigma } from './mapper';

export async function convertHTMLToFigma(
  html: string,
  options: ConversionOptionsType = {}
): Promise<FigmaNodeConfig> {
  // オプションを正規化
  const normalizedOptions = ConversionOptions.from(options);
  
  // 空のHTMLの場合はデフォルトのフレームを返す
  if (!html || !html.trim()) {
    return {
      type: 'FRAME',
      name: 'Root',
      width: normalizedOptions.containerWidth,
      height: normalizedOptions.containerHeight
    };
  }

  // HTMLをパースしてHTMLNodeに変換
  const htmlAsHTML = HTML.from(html);
  const htmlNode = HTML.toHTMLNode(htmlAsHTML);
  
  // HTMLNodeをFigmaNodeConfigに変換
  const figmaNode = mapHTMLNodeToFigma(htmlNode, normalizedOptions);
  
  // コンテナサイズが指定されている場合は適用
  if (normalizedOptions.containerWidth && !figmaNode.width) {
    figmaNode.width = normalizedOptions.containerWidth;
  }
  if (normalizedOptions.containerHeight && !figmaNode.height) {
    figmaNode.height = normalizedOptions.containerHeight;
  }
  
  return figmaNode;
}