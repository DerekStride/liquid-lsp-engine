import {readFileSync} from 'fs';
import * as Parser from 'web-tree-sitter';
import * as YAML from 'yaml';
import {Filters} from './shopifyConfig';

interface Position {
  row: number;
  column: number;
}

export class LiquidCompletionEngine {
  parser: Parser | undefined;

  constructor(
    configFile: string,
  ) {
    Parser.init().then(() => {
      this.parser = new Parser();
      Parser.Language.load('./lib/tree-sitter-liquid.wasm').then((language) => {
        this.parser!.setLanguage(language);
      })
    });
  }

  complete(
    text: string,
    cursorPosition: Position
  ) : any {
    if (this.parser) {
      const query = this.parser.getLanguage().query("(filter name: (identifier) @filter.name)");
      const tree = this.parser.parse(text);
      const line = cursorPosition.row;
      const character = cursorPosition.column;

      const captures = query.captures(
        tree.rootNode,
        { row: line, column: character - 1 },
        { row: line, column: character }
      );

      if (captures.length > 0) {
        return Filters;
      }
    }
    return [];
  }
}
