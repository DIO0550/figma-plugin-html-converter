/// <reference types="@figma/plugin-typings" />

interface PluginMessage {
  type: string;
  html?: string;
}

figma.showUI(__uiFiles__['ui.html'], { width: 600, height: 400 });

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'convert-html') {
    const html = msg.html as string;
    
    try {
      const frame = figma.createFrame();
      frame.name = 'Converted HTML';
      frame.x = 0;
      frame.y = 0;
      frame.resize(800, 600);
      
      const text = figma.createText();
      text.x = 20;
      text.y = 20;
      text.resize(760, 560);
      
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.characters = `HTML Content:\n\n${html}`;
      text.fontSize = 14;
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