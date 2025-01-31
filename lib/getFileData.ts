import { promises as fs } from "fs";

export const getFileData = async (path: string): Promise<string> => {
  try {
    const file = await fs.readFile(process.cwd() + path, "utf8");
    return file;
  } catch (error) {
    console.log("getFileData error: ", error);
    return "";
  }
};
