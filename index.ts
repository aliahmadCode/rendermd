import fs from "node:fs";

import { getFileData } from "./lib/getFileData.js";
import { storeAnalyzer } from "./lib/StoreAnalyzer.js";

const data = await getFileData("/test.md");
const dataSplitted = data.split("\n");

try {
  const store = await storeAnalyzer(dataSplitted);
} finally {
  console.log(dataSplitted);
}
