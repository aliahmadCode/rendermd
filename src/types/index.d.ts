export {};


export interface StructureComponentStates {
  opts: ComponentStates[];
}

export const enum ComponentTypes {
  // done
  HEAD1 = "head1", // #
  HEAD2 = "head2", // ##
  HEAD3 = "head3", // ###
  HEAD4 = "head4", // ####
  HEAD5 = "head5", // #####
  HEAD6 = "head6", // ######
  PARA = "paragrapph", // TEXT
  LINK = "link", // []()
  IMG = "img", // ![]()
  SNIP = "snippet", // ``
  ITALIC = "only italic", // _ _ | * *
  CODE = "code", // ```js ```
  BOLD = "bold", // ** **
  BOLDITALIC = "bold italic", // **_ _**
  LINE = "line", // ___

  // today
  LIST = "list",
  BLOCKQUOTE = "Blockquote" // >

}
export interface LineAnalyzerStates {
  tempstr: string,
  tempStore: ComponentStates[]
}

export interface ListStates {

}

export  interface ComponentStates {
  type: ComponentTypes;
  payload: string | List[];
  lang?: string;
  id?: string;
}
