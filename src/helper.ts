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
  LineAnalyzerStates,
  ListStates,
  ListType,
  StructureComponentStates,
} from "./types/index.js";

// i have confirmed that, after 1 year of writing javascript, that
// arrays are pass by reference in javascript, i have learned that a long ago
// but i didn't believe or may be i was afraid.

interface CheckOrderedReturn {
  type: ListType | "none";
  payload?: string;
}

function checkWhatOrder(temp: string): CheckOrderedReturn {
  const checkerord = temp.split(".");
  const checkerunord = temp.split(" ");

  if (!isNaN(parseInt(checkerord[0]))) {
    return {
      type: "ordered",
      payload: checkerord[1],
    };
  } else if (
    checkerunord[0] === "-" ||
    checkerunord[0] === "*" ||
    checkerunord[0] === "+"
  ) {
    return {
      type: "unordered",
      payload: checkerunord[1],
    };
  } else {
    return {
      type: "none",
      payload: temp,
    };
  }
}

function addTempList(
  tempList: ListStates[],
  i: number,
  filePayloadSplitted: string[],
): number {
  while (true) {
    let whatorder: CheckOrderedReturn = checkWhatOrder(filePayloadSplitted[i]);

    console.log(whatorder.payload);

    if (whatorder.type !== "none") {
      let { tempStore, tempstr }: LineAnalyzerStates = lineAnalyzer(
        whatorder.payload as string,
      );

      tempstr = addTempStore(tempStore, "para", tempstr, undefined, undefined);
      tempList.push({
        type: whatorder.type,
        indent: 0,
        payload: tempStore,
        next: [],
      });
      i++;
    } else {
      break;
    }
  }

  return i;
}

export const storeAnalyzer = async (
  path: string,
): Promise<StructureComponentStates[]> => {
  const store: StructureComponentStates[] = [];
  let tempstr: string = "";
  const filePayload: string = await getFileData(path);
  const filePayloadSplitted = filePayload.split("\n");

  for (let i = 0; i < filePayloadSplitted.length; i++) {
    let temp = filePayloadSplitted[i];

    if (temp == "") {
      continue;
    }

    const tempList: ListStates[] = [];
    i = addTempList(tempList, i, filePayloadSplitted);
    store.push({ opts: tempList, type: "list" });

    if (i < filePayloadSplitted.length) {
      temp = filePayloadSplitted[i];
    }

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
      tempstr = addStore(store, undefined, tempstr, type, undefined, tempstr);
    } else if (checkConditions(temp, ">")) {
      let k = i + 1;
      const { end } = getSubStrNexIndx(" ", 0, temp);
      tempstr = getSubString(end + 2, temp.length - 1, temp);
      tempstr = addStore(
        store,
        "blockquote",
        tempstr,
        undefined,
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
        "code",
        tempstr,
        undefined,
        language,
        undefined,
      );
    } else if (checkEmptyLineCondition(temp)) {
      tempstr = addStore(store, "line", temp, undefined, undefined, undefined);
    } else {
      let { tempStore, tempstr } = lineAnalyzer(temp);
      tempstr = addTempStore(tempStore, "para", tempstr, undefined, undefined);
      store.push({ opts: tempStore, type: "para" });
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
