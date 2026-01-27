import React, { useState, useEffect} from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);
    
    function removeOneCharacter(index) {
      const id = characters[index].id;
      deleteUser(id)
        .then((res) => {
          if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
          return fetchUsers();
        })
        .then((res) => res.json())
        .then((json) => setCharacters(json.users_list))
        .catch((error) => {
          console.log(error);
        })
    }

function postUser(person) {
  const promise = fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });
  return promise;
}

function updateList(person) {
  postUser(person)
    .then((res) => res.json())
    .then((newUser) => setCharacters((prev) => [...prev, newUser]))
    .catch((error) => {
      console.log(error);
    });
}

function deleteUser(id) {
  return fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  });
}

function fetchUsers() {
  const promise = fetch("http://localhost:8000/users");
  return promise;
}

useEffect(() => {
  fetchUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => {
      console.log(error);
    });
}, []);

  return (
    <div className="container">
      <Table 
      characterData={characters}
      removeCharacter={removeOneCharacter} 
      />
      <Form handleSubmit={updateList} />
    </div>
  );

    
}

export default MyApp;