import { storeAnalyzer } from "./helper.js";

const store = await storeAnalyzer("/test.md");
console.dir(store, {depth: null});
