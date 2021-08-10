const { appInit, dbInit } = require("./init");

async function run() {
  const db = await dbInit();
  const app = await appInit(db);
}

run();
