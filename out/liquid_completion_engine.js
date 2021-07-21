"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidCompletionEngine = void 0;
const fs_1 = require("fs");
const Parser = require("web-tree-sitter");
const YAML = require("yaml");
class LiquidCompletionEngine {
    constructor(configFile) {
        Parser.init().then(() => {
            this.parser = new Parser();
            Parser.Language.load('./lib/tree-sitter-liquid.wasm').then((language) => {
                this.parser.setLanguage(language);
            });
        });
        const file = fs_1.readFileSync(configFile);
        const config = YAML.parse(file.toString());
        this.filters = Object.values(config).flat().map((val, idx) => {
            return {
                label: val,
                data: idx,
            };
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
                return this.filters;
            }
        }
        return [];
    }
}
exports.LiquidCompletionEngine = LiquidCompletionEngine;
//# sourceMappingURL=liquid_completion_engine.js.map