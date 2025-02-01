export {};


export interface StructureComponentStates {
  opts: ComponentStates[];
}

export const enum ComponentTypes {
  // done
  HEAD1 = "HEAD1", // #
  HEAD2 = "HEAD2", // ##
  HEAD3 = "HEAD3", // ###
  HEAD4 = "HEAD4", // ####
  HEAD5 = "HEAD5", // #####
  HEAD6 = "HEAD6", // ######
  PARA = "PARA", // TEXT
  LINK = "LINK", // []()
  IMG = "IMG", // ![]()
  SNIP = "SNIP", // ``
  ITALIC = "ITALIC", // _ _ | * *
  CODE = "CODE", // ```js ```
  BOLD = "BOLD", // ** **
  BOLDITALIC = "BOLDITALIC", // **_ _**
  LINE = "LINE", // ___
  BLOCKQUOTE = "BLOCKQUOTE", // >

  // adding today
  LIST = "LIST",
  TABLE = "TABLE",
  LINETHROUGH = "LINETHROUGH"


}
export interface LineAnalyzerStates {
  tempstr: string;
  tempStore: ComponentStates[]

}

export type ListType = "ordered" | "unordered";
export interface ListStates {
  id: number,
  payload: string,
  indent: number,
  type: ListType,
  next: ListStates[]
}

export  interface ComponentStates {
  type: ComponentTypes;
  payload: string | ListStates[];
  lang?: string;
  id?: string;
}

