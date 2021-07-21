"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidCompletionEngine = void 0;
const Parser = require("web-tree-sitter");
const shopifyConfig_1 = require("./shopifyConfig");
class LiquidCompletionEngine {
    constructor(configFile) {
        Parser.init().then(() => {
            this.parser = new Parser();
            Parser.Language.load('./lib/tree-sitter-liquid.wasm').then((language) => {
                this.parser.setLanguage(language);
            });
        });
    }
    complete(text, cursorPosition) {
        if (this.parser) {
            const query = this.parser.getLanguage().query("(filter name: (identifier) @filter.name)");
            const tree = this.parser.parse(text);
            const line = cursorPosition.row;
            const character = cursorPosition.column;
            const captures = query.captures(tree.rootNode, { row: line, column: character - 1 }, { row: line, column: character });
            if (captures.length > 0) {
                return shopifyConfig_1.Filters;
            }
        }
        return [];
    }
}
exports.LiquidCompletionEngine = LiquidCompletionEngine;
//# sourceMappingURL=liquidCompletionEngine.js.map