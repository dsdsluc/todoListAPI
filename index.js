const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
require('dotenv').config();
const routerApiV1 = require("./api/v1/routers/index.routers");

const database = require("./config/database");
database.connect();

app.use(cors());

app.use(cookieParser())
// parse application/json
app.use(bodyParser.json())

routerApiV1(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})