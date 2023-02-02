import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcript = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcript,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("ok created new User Success");
    } catch (e) {
      reject(e);
    }
  });
  console.log("data from service");
  console.log(data);
  console.log(hashPasswordFromBcript);
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        console.log("User not found");
        resolve();
      }
    } catch (e) {}
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
};
