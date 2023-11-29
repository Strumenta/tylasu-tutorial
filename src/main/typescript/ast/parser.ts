import { ANTLRTokenFactory, TylasuANTLRToken, TylasuParser } from "@strumenta/tylasu/parsing";
import { JSONParser, JsonContext } from "../../antlr/JSONParser";
import { Issue, Node, Source } from "@strumenta/tylasu";
import { TokenStream, CharStream, Lexer } from "antlr4ts";
import { JSONLexer } from "../../antlr/JSONLexer";

export class JSONTylasuParser extends TylasuParser<Node, JSONParser, JsonContext, TylasuANTLRToken>
{
    constructor() {
        super(new ANTLRTokenFactory());
    }

    protected createANTLRLexer(inputStream: CharStream): Lexer | undefined {
        let lexer = new JSONLexer(inputStream);
        lexer.removeErrorListeners();
        return lexer;
    }

    protected createANTLRParser(tokenStream: TokenStream): JSONParser {
        let parser = new JSONParser(tokenStream);
        parser.removeErrorListeners();
        return parser;
    }

    protected parseTreeToAst(parseTreeRoot: JsonContext, considerPosition: boolean, issues: Issue[], source?: Source | undefined): Node | undefined {
        return undefined;
    }
}