import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const generateId = () => Math.random().toString(36).slice(2, 10);

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

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) return undefined;
  const deleted = users["users_list"].splice(index, 1)[0]; 
  return deleted;
};

app.post("/users", (req, res) => {
    const userToAdd = addUser(req.body);
    res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const deleted = deleteUserById(id);
  if (deleted === undefined) {
    res.status(404).send("Resource Not Found.");
  } else {
    res.status(200).send(deleted);
  }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    const result = findUsersByNameAndJob(name, job);
    res.send({ users_list: result });
    return;
  }

  if (name !== undefined) {
    const result = findUserByName(name);
    res.send({ users_list: result });
    return;
  }

  res.send(users);
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource Not Found.");
    } else {
        res.send(result);
    }
});

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

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});