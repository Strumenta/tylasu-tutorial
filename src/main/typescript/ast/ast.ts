import { Node } from "@strumenta/tylasu";

export class JSONValue extends Node { }

export class JSONNumber extends JSONValue {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }
}

export class JSONString extends JSONValue {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }
}

export class JSONBoolean extends JSONValue {
    value: boolean;

    constructor(value: boolean) {
        super();
        this.value = value;
    }
}

export class JSONNull extends JSONValue { }

export class JSONArray extends JSONValue {
    elements: JSONValue[];

    constructor(...elements: JSONValue[]) {
        super();
        this.elements = elements;
    }
}

export class JSONObject extends JSONValue {
    members: JSONMember[];

    constructor(...members: JSONMember[]) {
        super();
        this.members = members;
    }
}

export class JSONMember extends Node {
    name: string;
    value: JSONValue;

    constructor(name: string, value: JSONValue = new JSONValue()) {
        super();
        this.name = name;
        this.value = value;
    }
}