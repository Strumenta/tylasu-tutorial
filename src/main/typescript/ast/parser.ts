import { ANTLRTokenFactory, TylasuANTLRToken, TylasuParser } from "@strumenta/tylasu/parsing";
import { JSONParser, JsonContext } from "../../antlr/JSONParser";
import { Issue, Node, Source, registerNodeChild, registerNodeProperty } from "@strumenta/tylasu";
import { TokenStream, CharStream, Lexer } from "antlr4ts";
import { JSONLexer } from "../../antlr/JSONLexer";
import { JSONArray, JSONMember, JSONObject } from "./ast";
import { transformer } from "./transformer";

export class JSONTylasuParser extends TylasuParser<Node, JSONParser, JsonContext, TylasuANTLRToken>
{
    constructor() {
        super(new ANTLRTokenFactory());
        this.createNodeDefinitions();
    }

    createNodeDefinitions() {
        registerNodeChild(JSONArray, "elements", true);
        registerNodeChild(JSONObject, "members", true);
        registerNodeChild(JSONMember, "name", false);
        registerNodeChild(JSONMember, "value", false);
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
        return transformer.transform(parseTreeRoot);
    }
}