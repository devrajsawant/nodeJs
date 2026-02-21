const express = require("express");
const app = express();
const PORT = 8001;
const urlRoute = require("./routes/url");
const connectToMongoDb = require("./connect");
app.use(express.json());

connectToMongoDb("mongodb://127.0.0.1:27017/shortUrl")
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));
app.listen(PORT, () => console.log("Server running on port 8001"));

app.use("/url", urlRoute);
app.get("/:id", urlRoute)