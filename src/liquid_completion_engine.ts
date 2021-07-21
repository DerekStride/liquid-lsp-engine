import {readFileSync} from 'fs';
import * as Parser from 'web-tree-sitter';
import * as YAML from 'yaml';

interface Position {
  row: number;
  column: number;
}

export class LiquidCompletionEngine {
  parser: Parser | undefined;
  filters: any;

  constructor(
    configFile: string,
  ) {
    Parser.init().then(() => {
      this.parser = new Parser();
      Parser.Language.load('./lib/tree-sitter-liquid.wasm').then((language) => {
        this.parser!.setLanguage(language);
      })
    });

    const file = readFileSync(configFile);
    const config = YAML.parse(file.toString());
    this.filters = Object.values(config).flat().map((val, idx) => {
      return {
        label: val,
        data: idx,
      }
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
        return this.filters;
      }
    }
    return [];
  }
}
