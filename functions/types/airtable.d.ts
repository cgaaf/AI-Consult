export = airtable;
declare class airtable {
    static base(baseId: any): any;
    static configure(opts: any): void;
    static default_config(): any;
    static extend(prop: any): any;
    constructor(...args: any[]);
    base(baseId: any): any;
    init(opts: any): void;
}
declare namespace airtable {
    class Base {
        static createFunctor(airtable: any, baseId: any): any;
        static extend(prop: any): any;
        constructor(...args: any[]);
        doCall(tableName: any): any;
        getId(): any;
        init(airtable: any, baseId: any): void;
        runAction(method: any, path: any, queryParams: any, bodyData: any, callback: any): void;
        table(tableName: any): any;
    }
    class Error {
        static extend(prop: any): any;
        constructor(...args: any[]);
        init(error: any, message: any, statusCode: any): void;
    }
    class Record {
        static extend(prop: any): any;
        constructor(...args: any[]);
        destroy(done: any): void;
        fetch(done: any): void;
        get(columnName: any): any;
        getId(): any;
        init(table: any, recordId: any, recordJson: any): void;
        patchUpdate(cellValuesByName: any, opts: any, done: any): void;
        putUpdate(cellValuesByName: any, opts: any, done: any): void;
        save(done: any): void;
        set(columnName: any, columnValue: any): void;
        setRawJson(rawJson: any): void;
    }
    class Table {
        static extend(prop: any): any;
        constructor(...args: any[]);
        init(base: any, tableId: any, tableName: any): void;
    }
}
