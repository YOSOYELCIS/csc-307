import express from "express";
import cors from "cors";
import userService from ".user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const generateId = () => Math.random().toString(36).slice(2, 10);

/*
Code that isn't needed since connecting mongodb to the backend
const users = {
  users_list: [
    {
      id: generateId(),
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: generateId(),
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: generateId(),
      name: "Mac",
      job: "Professor"
    },
    {
      id: generateId(),
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: generateId(),
      name: "Dennis",
      job: "Bartender"
    },
    {
      id: generateId(),
      job: "Zookeeper",
      name: "Cindy"
    }
  ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) => 
    users["users_list"].find((user) => user["id"] === id);

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const addUser = (user) => {
    user.id = generateId();
    users.users_list.push(user);
    return user;
};

//secondary app.get(users) link
// app.get("/users", (req, res) => {
//     const name= req.query.name;
//     if(name != undefined) {
//         let result = findUserByName(name);
//         result = { users_list: result }
//         res.send(result);
//     } else {
//         res.send(users);
//     }
// });

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) return undefined;
  const deleted = users["users_list"].splice(index, 1)[0]; 
  return deleted;
};

*/
const toApiUser = (doc) => {
  if(!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    id: (obj._id ?? obj.id)?.toString(),
    name: obj.name,
    job: obj.job
  }
}

app.post("/users", (req, res) => {
    const userToAdd = addUser(req.body);
    res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  try {
    const id = req.params["id"];
    const deleted = deleteUserById(id);
    if (deleted === undefined) {
      res.status(404).send("Resource Not Found.");
    } else {
      res.status(200).send(toApiUser(deleted));
  }} catch (err) {
    console.log(err);
    res.status(500).send("Server error on deletion");
  }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
  userService.getUsers(req.query.name, req.query.job)
    .then(users => res.send({ users_list: users.map(toApiUser) }))
    .catch(err => {
      console.error(err);
      res.status(500).send("Server error on retrieving users");
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    const result = findUserById(id);

    try {
      if (result === undefined) {
          res.status(404).send("Resource Not Found.");
      } else {
          res.send({ users_list: result.map(toApiUser) });
    }} catch(err) {
      console.log(err);
      res.status(500).send("Server error with ID");
    }
});


app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});