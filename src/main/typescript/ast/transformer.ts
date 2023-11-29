import { ParseTreeToASTTransformer } from "@strumenta/tylasu/mapping";
import { ArrContext, JsonContext, ObjContext, PairContext, ValueContext } from "../../antlr/JSONParser";
import { JSONArray, JSONBoolean, JSONMember, JSONNull, JSONNumber, JSONObject, JSONString, JSONValue } from "./ast";

export const transformer = new ParseTreeToASTTransformer();

transformer.registerNodeFactory(JsonContext, (context: JsonContext) => transformer.transform(context.value()));

transformer.registerNodeFactory(ValueContext, (x: ValueContext) => {
    if (x.NUMBER()) return new JSONNumber(parseFloat(x.NUMBER()!.text));
    if (x.STRING()) return new JSONString(x.STRING()!.text.substring(1, x.STRING()!.text.length));
    if (x.text === "true") return new JSONBoolean(true);
    if (x.text === "false") return new JSONBoolean(false);
    if (x.text === "null") return new JSONNull();
    if (x.arr()) return transformer.transform(x.arr());
    if (x.obj()) return transformer.transform(x.obj());
});

transformer.registerNodeFactory(ArrContext, (context: ArrContext) => new JSONArray()).withChild(
    x => x.value(),
    (node: JSONArray, elements?: JSONValue[]) => node.elements = elements || [],
    "elements",
    ArrContext
);

transformer.registerNodeFactory(ObjContext, (context: ObjContext) => new JSONObject()).withChild(
    x => x.pair(),
    (node: JSONObject, members?: JSONMember[]) => node.members = members || [],
    "members",
    ObjContext
);

transformer.registerNodeFactory(PairContext, (context: PairContext) => new JSONMember(context.STRING().text.substring(1, context.STRING().text.length - 1))).withChild(
    x => x.value(),
    (node: JSONMember, value?: JSONValue) => node.value = value || new JSONValue(),
    "value",
    PairContext
);