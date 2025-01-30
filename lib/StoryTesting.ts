import { storeAnalyzer } from "./StoreAnalyzer.js";

export const Testing = async (path: string) => {
  const store = await storeAnalyzer(path);
  console.log(store);
}

