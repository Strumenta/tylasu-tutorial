import * as monaco from "monaco-editor";
import { CharStreams, CommonTokenStream } from "antlr4ts";
import { JSONLexer } from "../antlr/JSONLexer";
import { JSONParser } from "../antlr/JSONParser";

const editor = monaco.editor.create(document.getElementById("editor")!, { theme: "vs-dark", fontSize: 22 });

editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    const characters = CharStreams.fromString(code);
    const lexer = new JSONLexer(characters);
    const tokens = new CommonTokenStream(lexer);
    const parser = new JSONParser(tokens);
    const tree = parser.json();
    console.log(tree);
});