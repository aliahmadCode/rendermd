export {};

declare global {

  interface StructureComponentStates {
    opts: ComponentStates[];
  }

  const enum ComponentTypes {
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
    ITALIC = "only italic", // _ _
    CODE = "code", // ``````
    BOLD = "bold", // ** **
    BOLDITALIC = "bold italic", // **_ _**
    LINE = "line", // ___
  }

  interface ComponentStates {
    type: ComponentTypes;
    payload: string;
    lang?: string;
    id?: string;
  }
}
