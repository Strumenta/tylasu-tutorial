import * as monaco from "monaco-editor";
import { JSONTylasuParser } from "./ast/parser";
import { Issue } from "@strumenta/tylasu";
import { Node } from "@strumenta/tylasu";
import { JSONArray, JSONBoolean, JSONMember, JSONNull, JSONNumber, JSONObject, JSONString } from "./ast/ast";

const editor = monaco.editor.create(document.getElementById("editor")!, { theme: "vs-dark", fontSize: 22 });
const parser = new JSONTylasuParser();
let decorations: string[] = [];

editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    const parsingResult = parser.parse(code);

    visualizeIssues(parsingResult.issues);

    colorizeMembers(parsingResult.data);

    applyMonacoConfiguration(parsingResult.data);
});

function visualizeIssues(issues: Issue[]) {
    const diagnostics: monaco.editor.IMarkerData[] = [];
    for (const issue of issues) {
        if (!issue.position) continue;
        diagnostics.push({
            severity: monaco.MarkerSeverity.Error,
            message: issue.message,
            startLineNumber: issue.position.start.line,
            startColumn: issue.position.start.column + 1,
            endLineNumber: issue.position.end.line,
            endColumn: issue.position.end.column + 1
        });
    }
    monaco.editor.setModelMarkers(editor.getModel()!, "json", diagnostics);
}

function colorizeMembers(root?: Node) {
    if (!root) return;

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
    for (const node of root.walk()) {
        if (node instanceof JSONMember) {
            if (!node.position) continue;
            let className: string = "";
            if (node.value instanceof JSONNumber) {
                className = "number-member";
            } else if (node.value instanceof JSONString) {
                className = "string-member";
            } else if (node.value instanceof JSONBoolean) {
                className = "boolean-member";
            } else if (node.value instanceof JSONNull) {
                className = "null-member";
            } else if (node.value instanceof JSONArray) {
                className = "array-member";
            } else if (node.value instanceof JSONObject) {
                className = "object-member";
            }
            newDecorations.push({
                range: new monaco.Range(
                    node.position?.start.line,
                    node.position?.start.column + 2,
                    node.position?.start.line,
                    node.position?.start.column + 2 + node.name.length),
                options: { inlineClassName: className }
            });
        }
    }
    decorations = editor.deltaDecorations(decorations, newDecorations);
}

function applyMonacoConfiguration(root?: Node) {
    let diagnostics: monaco.editor.IMarkerData[] = [];

    const configuration = {
        applyMonacoConfiguration: JSONBoolean,
        fontSize: JSONNumber,
        theme: JSONString,
        lineNumbers: JSONBoolean
    };

    if (((root as JSONObject)?.members?.find(x => x.name === "applyMonacoConfiguration")?.value as JSONBoolean)?.value) {
        for (const member of (root as JSONObject).members) {
            if (!(member.name in configuration)) {
                diagnostics.push({
                    severity: monaco.MarkerSeverity.Error,
                    message: "Unexpected configuration member",
                    startLineNumber: member.position!.start.line,
                    startColumn: member.position!.start.column + 2,
                    endLineNumber: member.position!.start.line,
                    endColumn: member.position!.start.column + 2 + member.name.length
                });
            }
            else if (!(member.value instanceof configuration[member.name])) {
                diagnostics.push({
                    severity: monaco.MarkerSeverity.Error,
                    message: "Unexpected member type",
                    startLineNumber: member.value.position!.start.line,
                    startColumn: member.value.position!.start.column + 2,
                    endLineNumber: member.value.position!.start.line,
                    endColumn: member.value.position!.start.column + 2 + member.name.length
                });
            }
        }
        monaco.editor.setModelMarkers(editor.getModel()!, "json", diagnostics);

        if (!diagnostics.length) {
            editor.updateOptions(JSON.parse(editor.getValue()));
        }
    }
}