import { log } from "console";
import { getFileData } from "./getFileData.js";
import {
  addStore,
  addTempStore,
  getSubString,
  getSubStrNexIndx,
  getType,
  lineAnalyzer,
} from "./handlers.js";
import {
  ComponentStates,
  ComponentTypes,
  StructureComponentStates,
} from "./types/index.js";

// i have confirmed that, after 1 year of writing javascript, that
// arrays are pass by reference in javascript, i have learned that a long ago
// but i didn't believe or may be i was afraid.

export const storeAnalyzer = async (
  path: string,
): Promise<StructureComponentStates[]> => {
  const store: StructureComponentStates[] = [];
  let tempstr: string = "";
  const filePayload: string = await getFileData(path);
  const filePayloadSplitted = filePayload.split("\n");

  for (let i = 0; i < filePayloadSplitted.length; i++) {
    const temp = filePayloadSplitted[i];

    if (temp == "") {
      continue;
    }


    // everything starts from # covers the headings
    if (checkConditions(temp, "#")) {
      // it will give everything onward the heading
      const { substr, end } = getSubStrNexIndx(" ", 0, temp);
      tempstr = getSubString(end + 2, temp.length - 1, temp);

      let type: ComponentTypes | undefined = getType(substr);

      if (!type) {
        tempstr = "";
        continue;
      }

      // then adding the headings in it, here id means
      // that i will in id="#id" for current hashes
      tempstr = addStore(store, tempstr, type, undefined, tempstr);
    } else if (checkConditions(temp, ">")) {
      let k = i + 1;
      const { end } = getSubStrNexIndx(" ", 0, temp);
      tempstr = getSubString(end + 2, temp.length - 1, temp);
      tempstr = addStore(
        store,
        tempstr,
        ComponentTypes.BLOCKQUOTE,
        undefined,
        undefined,
      );
    } else if (checkConditions(temp, "```")) {
      let k = i + 1;
      // gather the language name
      const language = getSubString(3, temp.length - 1, temp);

      // loop till the next appearence of ```
      for (; !filePayloadSplitted[k].startsWith("```"); k++) {
        tempstr += filePayloadSplitted[k] + "\n";
      }

      i = k;

      tempstr = addStore(
        store,
        tempstr,
        ComponentTypes.CODE,
        language,
        undefined,
      );
    } else if (checkEmptyLineCondition(temp)) {
      tempstr = addStore(store, temp, ComponentTypes.LINE);
    } else {
      let { tempStore, tempstr } = lineAnalyzer(temp);
      tempstr = addTempStore(tempStore, ComponentTypes.PARA, tempstr);
      store.push({ opts: tempStore });
    }
  }
  return store;
};

export function checkEmptyLineCondition(temp: string): boolean {
  if (temp) {
    return (
      temp.startsWith("---") || temp.startsWith("___") || temp.startsWith("***")
    );
  } else {
    return false;
  }
}

export function checkConditions(temp: string, delimiter: string): boolean {
  if (temp) {
    return temp.startsWith(delimiter);
  } else {
    return false;
  }
}
