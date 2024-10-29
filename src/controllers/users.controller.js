import { usersService } from "../services/index.js";
import logger from "../utils/logger.js";

const getAllUsers = async (_req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warning(`User not found: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    logger.error(`Error fetching user: ${error}`);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warning(`User not found: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  try {
    await usersService.getUserById(userId);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const uploadDocuments = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) {
    return res.status(404).send({ status: "error", error: "User not found" });
  }

  const documents = req.files.map((file) => ({
    name: file.originalname,
    reference: file.path,
  }));

  user.documents.push(...documents);
  await usersService.update(user._id, { documents: user.documents });

  res.send({ status: "success", message: "Documents uploaded successfully" });
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  uploadDocuments,
};
