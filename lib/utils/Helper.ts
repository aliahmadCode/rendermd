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

export const capitalize = (name: string): string => {
  return name[0].toUpperCase() + name.substring(1).toLowerCase();
};

export const showDate = (date: string[]): string => {
  return capitalize(date[0]) + " " + date[1] + ", " + date[2];
};
