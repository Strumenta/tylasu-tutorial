import * as monaco from "monaco-editor";
import { JSONTylasuParser } from "./ast/parser";
import { Issue } from "@strumenta/tylasu";

const editor = monaco.editor.create(document.getElementById("editor")!, { theme: "vs-dark", fontSize: 22 });
const parser = new JSONTylasuParser();

editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    const parsingResult = parser.parse(code);

    visualizeIssues(parsingResult.issues);
});

function visualizeIssues(issues: Issue[]) {
    const diagnostics: monaco.editor.IMarkerData[] = [];
    for (const issue of issues) {
        if (issue.position) {
            diagnostics.push({
                severity: monaco.MarkerSeverity.Error,
                message: issue.message,
                startLineNumber: issue.position.start.line,
                startColumn: issue.position.start.column + 1,
                endLineNumber: issue.position.end.line,
                endColumn: issue.position.end.column + 1
            });
        }
    }
    monaco.editor.setModelMarkers(editor.getModel()!, "json", diagnostics);
}