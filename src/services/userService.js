import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      console.log(">>> check is exist", isExist);
      if (isExist) {
        //find user

        let user = await db.User.findOne({
          where: { email: email },
          attributes: ["email", "roleId", "password"],
          raw: true,
        });
        console.log(">>>>>Check User data return ", user);

        if (user) {
          //compare password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = `Password is ok`;
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = `Password is wrong`;
          }
        } else {
          userData.errCode = 2;
          userData.message = `User not found`;
        }
        // compare password

        resolve(userData);
      } else {
        //return error
        userData.errCode = 1;
        userData.message = `email does not exist`;
        resolve(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
        raw: true,
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
};
