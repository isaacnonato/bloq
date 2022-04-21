import { Application } from "express-serve-static-core";

const express = require("express");
const app: Application = express();
require("./routes.ts")(app);

const port = 8000;
app.listen(port, () => {
  console.log("blockchain service running at port " + port);
});
