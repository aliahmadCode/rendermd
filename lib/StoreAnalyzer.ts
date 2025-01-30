import { getFileData } from "./getFileData.js";
import { getSubString, getSubStrNexIndx } from "./utils/Helper.js";

export const storeAnalyzer = async (
  path: string,
): Promise<StructureComponentStates[]> => {
  const store: StructureComponentStates[] = [];

  const filePayload: string = await getFileData(path);
  const filePayloadSplitted = filePayload.split("\n");

  for (let i = 0; i < filePayloadSplitted.length; i++) {
    const temp = filePayloadSplitted[i];
    if (temp == "") continue;

    // everything starts from # covers the headings
    if (temp.startsWith("#")) {
      const { substr, end } = getSubStrNexIndx(" ", 0, temp);
      const tempStr = getSubString(end + 2, temp.length - 1, temp);

      let type: ComponentTypes | undefined = undefined;
      switch (substr) {
        case "#":
          type = ComponentTypes.HEAD1;
          break;
        case "##":
          type = ComponentTypes.HEAD2;
          break;
        case "###":
          type = ComponentTypes.HEAD3;
          break;
        case "####":
          type = ComponentTypes.HEAD4;
          break;
        case "#####":
          type = ComponentTypes.HEAD5;
          break;
        case "######":
          type = ComponentTypes.HEAD6;
          break;
        default:
          continue;
      }

      // then adding the headings in it
      store.push({
        opts: [
          {
            payload: tempStr,
            type: type,
            id: tempStr,
          },
        ],
      });
    } else if (temp.startsWith("```")) {
      let k = i + 1;
      const language = getSubString(3, temp.length - 1, temp);
      let tempstr: string = "";

      for (; !filePayloadSplitted[k].startsWith("```"); k++) {
        tempstr += filePayloadSplitted[k] + "\n";
      }
      i = k;

      store.push({
        opts: [
          {
            payload: tempstr,
            type: ComponentTypes.CODE,
            lang: language,
          },
        ],
      });

      continue;
    } else if (temp.startsWith("---") || temp.startsWith("___")) {
      store.push({
        opts: [
          {
            payload: "___",
            type: ComponentTypes.LINE,
          },
        ],
      });
      continue;
    } else {
      // some vars
      let tempStr: string = "";
      const tempStore: ComponentStates[] = [];

      for (let j: number = 0; j < temp.length;) {
        // covers the code snippets, links, italics

        if (temp[j] === "`" || temp[j] === "_" || temp[j] === "*") {
          tempStore.push({
            type: ComponentTypes.PARA,
            payload: tempStr,
          });
          tempStr = "";
          if (temp[j] === "*" && temp[j + 1] === "*") {
            // bold and italic
            if (temp[j + 2] === "_") {
              const obj = getSubStrNexIndx(
                temp[j + 2],
                j + 3,
                temp,
              );
              if (obj.end === -1) {
                continue;
              }
              tempStr = obj.substr;
              j = obj.end + 4;

              tempStore.push({
                type: ComponentTypes.BOLDITALIC,
                payload: tempStr,
              });
              tempStr = "";
              continue;
            } else {
              const obj = getSubStrNexIndx(
                temp[j + 1],
                j + 2,
                temp,
              );
              if (obj.end === -1) {
                continue;
              }
              tempStr = obj.substr;
              j = obj.end + 3;
              tempStore.push({
                type: ComponentTypes.BOLD,
                payload: tempStr,
              });

              tempStr = "";
              continue;
            }
          }
          // O(n)
          const obj = getSubStrNexIndx(temp[j], j + 1, temp);
          tempStr = obj.substr;

          if (temp[j] == "`") {
            tempStore.push({
              type: ComponentTypes.SNIP,
              payload: tempStr,
            });
          } else {
            tempStore.push({
              type: ComponentTypes.ITALIC,
              payload: tempStr,
            });
          }
          j = obj.end + 2;
          tempStr = "";
        } else if (temp[j] == "[") {
          // push the stupid paragraph if any
          tempStore.push({
            type: ComponentTypes.PARA,
            payload: tempStr,
          });
          tempStr = "";

          // O(n)
          const obj = getSubStrNexIndx("]", j + 1, temp);
          obj.substr += "|";

          j = obj.end + 2;
          if (temp[j] === "(") {
            const get_another_sub = getSubStrNexIndx(
              ")",
              j + 1,
              temp,
            );
            obj.substr += get_another_sub.substr;
            j = get_another_sub.end + 2;
          }

          tempStore.push({
            type: ComponentTypes.LINK,
            payload: obj.substr,
          });

          continue;
        } else {
          tempStr += temp[j];
          j++;
        }
      }
      if (tempStr) {
        tempStore.push({
          type: ComponentTypes.PARA,
          payload: tempStr,
        });
      }

      store.push({ opts: tempStore });
    }
  }
  return store;
};


