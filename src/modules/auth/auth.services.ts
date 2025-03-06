import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import authUtill from "./auth.utill";
import { StudentModel, UserModel } from "../user/user.model";
import idConverter from "../../util/idConvirter";
import { userRole } from "../../constents";



const logIn = async (email: string, password: string) => {
  let progres;

  const findUserWithEmail = await UserModel.findOne({ email: email }).select(
    "+password",
  );

  if (!findUserWithEmail) {
    throw Error("no user found with this email");
  }

  const match = await bcrypt.compare(password, findUserWithEmail.password);
  if (!match) {
    throw Error("password is not matched");
  }

  const findUserAndUpdate = await UserModel.findOneAndUpdate(
    { email: email },
    { isLoggedIn: true },
    { new: true }
  );

  if(findUserWithEmail.role === userRole.student) {
    const student = await StudentModel.findOne({ user: findUserWithEmail._id })
    progres = student?.progress;

  }

  const modifyFindUserAndUpdate = {findUserAndUpdate, progres}

  if (!findUserWithEmail) {
    throw Error("no; user found with this email");
  }

  // Tokenize user data
  const tokenizeData = {
    id: findUserWithEmail._id.toHexString(),
    role: findUserWithEmail.role,
    username: findUserAndUpdate?.name,
  };

  console.log("Token", tokenizeData);

  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn
  );

  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn
  );

  // console.log(approvalToken, refreshToken, findUserWithEmail)

  return { approvalToken, refreshToken, modifyFindUserAndUpdate };
};

const logOut = async (userId: string) => {
  
 const convertedId = idConverter(userId)

  const findUserById = await UserModel.findOneAndUpdate(
    { _id: convertedId },
    { isLoggedIn: false, loggedOutTime: new Date() },
    { new: true }
  );
  return findUserById;
};

const authSercvices = {
  logIn,
  logOut,
};
export default authSercvices;
