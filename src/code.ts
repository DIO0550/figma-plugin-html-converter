/// <reference types="@figma/plugin-typings" />

interface PluginMessage {
  type: string;
  html?: string;
}

// UI設定定数
const UI_CONFIG = {
  DIALOG_WIDTH: 600,
  DIALOG_HEIGHT: 400,
  DEFAULT_FRAME_WIDTH: 800,
  DEFAULT_FRAME_HEIGHT: 600,
  TEXT_PADDING: 20,
  TEXT_WIDTH: 760,
  TEXT_HEIGHT: 560,
  DEFAULT_FONT_SIZE: 14
} as const;

figma.showUI(__uiFiles__['ui.html'], { 
  width: UI_CONFIG.DIALOG_WIDTH, 
  height: UI_CONFIG.DIALOG_HEIGHT 
});

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'convert-html') {
    const html = msg.html as string;
    
    try {
      const frame = figma.createFrame();
      frame.name = 'Converted HTML';
      frame.x = 0;
      frame.y = 0;
      frame.resize(UI_CONFIG.DEFAULT_FRAME_WIDTH, UI_CONFIG.DEFAULT_FRAME_HEIGHT);
      
      const text = figma.createText();
      text.x = UI_CONFIG.TEXT_PADDING;
      text.y = UI_CONFIG.TEXT_PADDING;
      text.resize(UI_CONFIG.TEXT_WIDTH, UI_CONFIG.TEXT_HEIGHT);
      
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.characters = `HTML Content:\n\n${html}`;
      text.fontSize = UI_CONFIG.DEFAULT_FONT_SIZE;
      text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      
      frame.appendChild(text);
      
      figma.currentPage.appendChild(frame);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
      
      figma.ui.postMessage({
        type: 'conversion-complete',
        message: 'HTMLをFigmaデザインに変換しました'
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'conversion-error',
        message: `エラーが発生しました: ${error}`
      });
    }
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};