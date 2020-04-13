export interface ISerializeable {
    serialize: () => string;
}

export function serializable (...fields: string[]) {
    return function (a: Function) {
        a.prototype.serialize = function(): string {
            const ob: {[key: string]: any} = {};
            for (const field of fields) {
                //const varName = "get" + field.substr(0,1).toUpperCase() + field.substr(1);
                ob[field] = this[field];
            }
            return JSON.stringify(ob);
        }

    }
}