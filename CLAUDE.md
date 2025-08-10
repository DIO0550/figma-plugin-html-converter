# CLAUDE.md

日本語で必ず応答して下さい。
必ず最初に、`prompt-mcp-server`を利用して、実装のルールを確認して下さい

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin project that converts HTML into Figma designs. The plugin will also integrate with an MCP (Model Context Protocol) server to receive HTML from AI and convert it to Figma designs.

## Key Features

1. **HTML to Figma Conversion**: Accepts HTML input and converts it into Figma design elements
2. **MCP Server Integration**: Plans to implement a local MCP server that allows AI to send HTML through the plugin for design conversion

## Development Setup

### Figma Plugin Structure

- `manifest.json`: Figma plugin configuration
- `code.ts` or `code.js`: Main plugin logic
- `ui.html`: Plugin UI interface

### Common Commands

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes during development
npm run watch

# Run linting
npm run lint

# Run tests
npm test
```

## Architecture Notes

### Plugin Architecture

- **UI Layer**: HTML interface for user interaction
- **Plugin Code**: Runs in Figma's sandbox environment
- **HTML Parser**: Converts HTML to Figma nodes
- **MCP Server**: Local server for AI communication (planned)

### Key Considerations

- Figma plugins run in a sandboxed environment with limited access
- Communication between UI and plugin code happens via postMessage
- HTML parsing should handle various HTML structures and convert them to appropriate Figma elements (frames, text, shapes, etc.)
- MCP server will need to handle authentication and message routing between AI and the plugin

### Development Flow

1. Set up the basic Figma plugin structure
2. Implement HTML parsing and Figma node creation
3. Create UI for HTML input
4. Integrate MCP server for AI communication
5. Test with various HTML inputs

## Important Files to Create

- `manifest.json`: Plugin manifest
- `code.ts`: Main plugin logic
- `ui.html`: User interface
- `package.json`: Node.js dependencies
- `tsconfig.json`: TypeScript configuration
- `webpack.config.js` or similar: Build configuration
