import {
  ComponentStates,
  ComponentTypes,
  LineAnalyzerStates,
  StructureComponentStates,
  StructureComponentTypes,
} from "./types/index.js";

export const capitalize = (name: string): string => {
  return name[0].toUpperCase() + name.substring(1).toLowerCase();
};

export const showDate = (date: string[]): string => {
  return capitalize(date[0]) + " " + date[1] + ", " + date[2];
};

export const split = (str: string, delimiter: string): string[] => {
  let temp: string = "";
  const result: string[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == delimiter) {
      result.push(temp);
      temp = "";
      continue;
    }
    temp += str[i];
  }

  result.push(temp);
  return result;
};

export const getNextIndex = (
  expected: string,
  current: number,
  temp: string,
): number => {
  for (; current < temp.length; current++) {
    if (temp[current] == expected) {
      return current - 1;
    }
  }
  return -1;
};

// here end and start receives implicit values
export const getSubString = (
  start: number,
  end: number,
  temp: string,
): string => {
  let theStr: string = "";

  if (end < temp.length) {
    for (; start <= end; start++) {
      theStr += temp[start];
    }
  }

  return theStr;
};

// every thing is implicit
export const getSubStrNexIndx = (
  expected: string,
  start: number,
  temp: string,
): {
  substr: string;
  end: number;
} => {
  let tempstr: string = "";
  for (; start < temp.length; start++) {
    if (temp[start] === expected) {
      return {
        substr: tempstr,
        end: start - 1,
      };
    }
    tempstr += temp[start];
  }

  return {
    substr: "",
    end: -1,
  };
};

export function lineAnalyzer(temp: string): LineAnalyzerStates {
  const tempStore: ComponentStates[] = [];
  let tempstr: string = "";
  for (let j: number = 0; j < temp.length;) {
    // covers the code snippets, links, italics

    if (
      temp[j] === "`" ||
      temp[j] === "_" ||
      temp[j] === "*" ||
      temp[j] === "~"
    ) {
      tempstr = addTempStore(
        tempStore,
        "para",
        tempstr,
        undefined,
        undefined,
      );

      if (temp[j] === "~" || temp[j + 1] === "~") {
        const obj = getSubStrNexIndx(temp[j + 1], j + 2, temp);
        tempstr = obj.substr;
        j = obj.end + 3;
        tempstr = addTempStore(
          tempStore,
          "line-through",
          tempstr,
          undefined,
          undefined,
        );
        continue;
      } else if (temp[j] === "*" && temp[j + 1] === "*") {
        if (temp[j + 2] === "_") {
          const obj = getSubStrNexIndx(temp[j + 2], j + 3, temp);
          tempstr = obj.substr;

          j = obj.end + 4;

          tempstr = addTempStore(
            tempStore,
            "bold-italic",
            tempstr,
            undefined,
            undefined,
          );
        } else {
          const obj = getSubStrNexIndx(temp[j + 1], j + 2, temp);
          tempstr = obj.substr;

          j = obj.end + 3;

          tempstr = addTempStore(
            tempStore,
            "bold",
            tempstr,
            undefined,
            undefined,
          );
        }
        continue;
      }

      const isnip: boolean = temp[j] === "`" ? true : false;

      const obj = getSubStrNexIndx(temp[j], ++j, temp);
      tempstr = obj.substr;

      if (isnip) {
        tempstr = addTempStore(
          tempStore,
          "snip",
          tempstr,
          undefined,
          undefined,
        );
      } else {
        tempstr = addTempStore(
          tempStore,
          "italic",
          tempstr,
          undefined,
          undefined,
        );
      }

      j = obj.end + 2;
    } else if ((temp[j] === "!" && temp[j + 1] === "[") || temp[j] === "[") {
      console.log("using it again", tempstr);
      tempstr = addTempStore(
        tempStore,
        "para",
        tempstr,
        undefined,
        undefined,
      );

      const isimage: boolean = temp[j] === "!" ? true : false;

      if (isimage) {
        j++;
      }

      const obj = getSubStrNexIndx("]", ++j, temp);

      j = obj.end + 2;

      obj.substr += "|";

      if (temp[j] === "(") {
        const get_another_sub = getSubStrNexIndx(")", ++j, temp);
        obj.substr += get_another_sub.substr;
        j = get_another_sub.end + 2;
      }

      tempstr = obj.substr;

      if (isimage) {
        tempstr = addTempStore(
          tempStore,
          "img",
          tempstr,
          undefined,
          undefined,
        );
      } else {
        tempstr = addTempStore(
          tempStore,
          "link",
          tempstr,
          undefined,
          undefined,
        );
      }
      continue;
    } else {
      tempstr += temp[j++];
    }
  }
  return { tempStore, tempstr };
}

export function addTempStore(
  tempStore: ComponentStates[],
  type: ComponentTypes,
  payload: string,
  lang?: string,
  id?: string,
): string {
  if (payload) {
    tempStore.push({
      type: type,
      payload: payload,
      lang: lang,
      id: id,
    });
  }
  return "";
}

export function addStore(
  store: StructureComponentStates[],
  storeType: StructureComponentTypes | undefined,
  payload: string,
  type: ComponentTypes | undefined,
  lang?: string,
  id?: string,
): string {
  store.push({
    opts: [{ payload: payload, type: type, lang: lang, id: id }], type: storeType
  });

  return "";
}

export function getType(substr: string) {
  let t: ComponentTypes | undefined = undefined;

  switch (substr) {
    case "#":
      t = "head1";
      break;
    case "##":
      t = "head2";
      break;
    case "###":
      t = "head3";
      break;
    case "####":
      t = "head4";
      break;
    case "#####":
      t = "head5";
      break;
    case "######":
      t = "head6";
      break;
    default:
      return undefined;
  }
  return t;
}
