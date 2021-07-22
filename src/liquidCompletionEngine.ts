import {readFileSync} from 'fs';
import * as Parser from 'web-tree-sitter';
import * as YAML from 'yaml';
import {Filters} from './shopifyConfig';

interface Position {
  row: number;
  column: number;
}

export class LiquidCompletionEngine {
  parser: Parser;

  constructor(
    parser: Parser,
  ) {
    this.parser = parser
  }

  complete(
    text: string,
    cursorPosition: Position
  ) : any[] {
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
      const filterText = captures[0].node.text
      return Filters.filter(option => option.startsWith(filterText));
    }
    return [];
  }
}
