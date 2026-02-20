const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const { type } = require("os");
const app = express();
const PORT = 8000;

// app.use(express.urlencoded({ extended: false }));

//connecting mongooose
mongoose
  .connect("mongodb://127.0.0.1:27017/project-01-restApi")
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => {
    console.log(err);
  });

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    job: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }, // generate createdAt and updatedAt time stamps
);

//modal
const MongoooseUser = mongoose.model("users", userSchema);

// Rest API in file system
//routes
// get users list
// app.get("/api/users", (req, res) => {
//   return res.json(users);
// });

// use :id for dynamic route like [slug]
//get user specific to ID
// app.get("/api/users/:id", (req, res) => {
//   const userId = Number(req.params.id);
//   const user = users.find((u) => u.id === userId);
//   return res.json(user);
// });

// app.post("/api/users", (req, res) => {
//   const body = req.body;
//   console.log(body);
//   users.push({ ...body, id: users.length + 1 });
//   MongoooseUser.create({ body });
//   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, Data) => {
//     return res.json({ status: "status", id: users.length });
//   });
// });

// app.patch("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

// app.delete("/api/users/:id", (req, res) => {
//   const userId = Number(req.params.id);

//   // find index of user
//   const index = users.findIndex((u) => u.id === userId);

//   if (index === -1) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // remove user from array
//   users.splice(index, 1);

//   // write updated data back to file
//   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to delete user" });
//     }

//     return res.json({
//       status: "success",
//       message: "User deleted",
//     });
//   });
// });

// Rest API in Mongoose
app.post("/api/users", (req, res) => {
  const body = req.body;
  MongoooseUser.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    job: body.job,
  });

  return res.status(200).json({ msg: "user created successfully" });
});

app.get("/api/users", async (req, res) => {
  const allUser = await MongoooseUser.find({});
  return res.json(allUser);
});

app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const singleUser = await MongoooseUser.findById(userId);
  if (!singleUser) return res.status(404).json({ msg: "user not found" });
  return res.json(singleUser);
});

app.patch("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const singleUser = await MongoooseUser.findByIdAndUpdate(userId, {
    firstName: "updated",
  });
  if (!singleUser) return res.status(404).json({ msg: "user not found" });
  return res.json(singleUser);
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const singleUser = await MongoooseUser.findByIdAndDelete(userId);
  if (!singleUser) return res.status(404).json({ msg: "user not found" });
  return res.json(singleUser);
});

app.listen(PORT, () => {
  console.log("server runnning at port : " + PORT);
});
