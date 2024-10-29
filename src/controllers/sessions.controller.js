import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { createError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      const error = createError("INCOMPLETE_VALUES");

      return res
        .status(error.status)
        .send({ status: "error", error: error.message });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists)
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    let result = await usersService.create(user);
    logger.debug(result);
    res.send({
      status: "success",
      payload: result._id,
      message: "Session registered successfully",
    });
  } catch (error) {}
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });

  const user = await usersService.getUserByEmail(email);
  if (!user)
    return res
      .status(404)
      .send({ status: "error", error: "User doesn't exist" });

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect password" });

  user.last_connection = new Date();
  await usersService.update(user._id, {
    last_connection: user.last_connection,
  });

  const token = jwt.sign(user.toObject(), "tokenSecretJWT", {
    expiresIn: "1h",
  });
  res
    .cookie("authCookie", token, { maxAge: 3600000 })
    .send({ status: "success", message: "Logged in successfully" });
};

const current = async (req, res) => {
  const cookie = req.cookies["coderCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) return res.send({ status: "success", payload: user });
};

const unprotectedLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });

  const user = await usersService.getUserByEmail(email);
  if (!user)
    return res
      .status(404)
      .send({ status: "error", error: "User doesn't exist" });

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect password" });

  user.last_connection = new Date();
  await usersService.update(user._id, {
    last_connection: user.last_connection,
  });

  const token = jwt.sign(user.toObject(), "tokenSecretJWT", {
    expiresIn: "1h",
  });
  res
    .cookie("unprotectedCookie", token, { maxAge: 3600000 })
    .send({ status: "success", message: "Unprotected Logged in" });
};

const logout = async (req, res) => {
  const token = req.cookies["authCookie"];
  if (!token)
    return res
      .status(400)
      .send({ status: "error", error: "No token provided" });

  const user = jwt.verify(token, "tokenSecretJWT");
  if (!user)
    return res.status(400).send({ status: "error", error: "Invalid token" });

  await usersService.update(user._id, { last_connection: new Date() });

  res
    .clearCookie("authCookie")
    .send({ status: "success", message: "Logged out successfully" });
};

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) return res.send({ status: "success", payload: user });
};

export default {
  current,
  login,
  register,
  unprotectedLogin,
  logout,
  unprotectedCurrent,
};
