const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

//routes
// get users list
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// use :id for dynamic route like [slug]
//get user specific to ID
app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log(body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, Data) => {
    return res.json({ status: "status", id: users.length });
  });
});

app.patch("/api/users/:id", (req, res) => {
  return res.json({ status: "pending" });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  // find index of user
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // remove user from array
  users.splice(index, 1);

  // write updated data back to file
  fs.writeFile(
    "./MOCK_DATA.json",
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete user" });
      }

      return res.json({
        status: "success",
        message: "User deleted",
      });
    }
  );
});

app.listen(PORT, () => {
  console.log("server runnning at port : " + PORT);
});
