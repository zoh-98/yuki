declare type variablesObject = {
    [variableName: string]: any;
};
export declare const flatMap: (arg: any, callback: any) => any;
export declare const isString: (arg: any) => boolean;
export declare const isArray: (arg: any) => arg is any[];
export declare const isObject: (arg: any) => boolean;
export declare const graphQlQueryToJson: (query: string, options?: {
    variables: variablesObject;
}) => any;
export {};
