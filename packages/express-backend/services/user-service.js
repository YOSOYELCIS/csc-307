import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  if (!name && !job) return userModel.find();
  if (name && job) return userModel.find({ name, job });
  if (name && !job) return findUserByName(name);
  if (!name && job) return findUserByJob(job);
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
//   const promise = userToAdd.save(); //can remove the promise setup
  return userToAdd.save();
}

function deleteUserById(id) {
    return userModel.findByIdAndDelete(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  deleteUserById,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
};