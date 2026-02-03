import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users")
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const toApiUser = (doc) => {
  if(!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    _id: obj._id?.toString(),
    name: obj.name,
    job: obj.job
  }
}

app.post("/users", (req, res) => {
    userService
    .addUser(req.body)
    .then((created) => {
      res.status(201).send(toApiUser(created));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server error creating user");
    });
});

app.delete("/users/:id", (req, res) => {
  userService.deleteUserById(req.params.id)
    .then(deleted => {
      if (!deleted) return res.status(404).send("Resource Not Found.");
      res.status(200).send(toApiUser(deleted));
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Server error on deletion");
    });
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
  userService.findUserById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).send("Resource Not Found.");
      res.send(toApiUser(user));
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Server error with ID");
    });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});

/*
// const generateId = () => Math.random().toString(36).slice(2, 10);

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