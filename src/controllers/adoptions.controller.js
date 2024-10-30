import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";

import { createError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

const getAllAdoptions = async (_req, res) => {
  const result = await adoptionsService.getAll();
  res.send({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption)
    return res
      .status(404)
      .send({ status: "error", error: "Adoption not found" });
  res.send({ status: "success", payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;
  logger.info(`Creating adoption for user: ${uid} and pet: ${pid}`);

  try {
    const user = await usersService.getUserById(uid);
    logger.info(`Fetched user: ${JSON.stringify(user)}`);

    if (!user) {
      const error = createError("USER_NOT_FOUND");
      logger.error(`User not found: ${uid}`);
      return res
        .status(error.status)
        .send({ status: "error", error: error.message });
    }

    const pet = await petsService.getBy({ _id: pid });
    logger.info(`Fetched pet: ${JSON.stringify(pet)}`);

    if (!pet) {
      const error = createError("PET_NOT_FOUND");
      logger.error(`Pet not found: ${pid}`);
      return res
        .status(error.status)
        .send({ status: "error", error: error.message });
    }

    if (pet.adopted) {
      const error = createError("PET_ALREADY_ADOPTED");
      logger.error(`Pet already adopted: ${pid}`);
      return res
        .status(error.status)
        .send({ status: "error", error: error.message });
    }

    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    const adoption = await adoptionsService.create({
      owner: user._id,
      pet: pet._id,
    });
    res.send({ status: "success", message: "Pet adopted", payload: adoption });
  } catch (error) {
    logger.error(`Error creating adoption: ${error}`);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
