import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";

import { createError } from "../utils/errorHandler.js";

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
  const user = await usersService.getUserById(uid);

  if (!user) {
    const error = createError("USER_NOT_FOUND");

    return res
      .status(error.status)
      .send({ status: "error", error: error.message });
  }

  const pet = await petsService.getBy({ _id: pid });

  if (!pet) {
    const error = createError("PET_NOT_FOUND");

    return res
      .status(error.status)
      .send({ status: "error", error: error.message });
  }

  if (pet.adopted) {
    const error = createError("PET_ALREADY_ADOPTED");

    return res
      .status(error.status)
      .send({ status: "error", error: error.message });
  }

  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });
  await adoptionsService.create({ owner: user._id, pet: pet._id });
  res.send({ status: "success", message: "Pet adopted" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
