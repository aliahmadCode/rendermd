export {};

export  type ComponentTypes = "head1" | "head2" | "head3" | "head4" |
 "head5" | "head6" | "para" | "link" | "img" | "snip" | "italic" | "bold" | "bold-italic"| "line-through";

export type StructureComponentTypes = "list" | "table" | "para" | "code" | "line" | "blockquote";

export interface StructureComponentStates {
  opts: ComponentStates[] | ListStates[];
  type?: StructureComponentTypes ;
}

export interface LineAnalyzerStates {
  tempstr: string;
  tempStore: ComponentStates[];
}

export type ListType = "ordered" | "unordered";

export interface ListStates {
  payload: ComponentStates[];
  indent: number;
  type: ListType;
  next: ListStates[];
}

export interface ComponentStates {
  type?: ComponentTypes;
  payload: string;
  lang?: string;
  id?: string;
}
