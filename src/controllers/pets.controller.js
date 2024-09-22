import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { createError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

const getAllPets = async (_req, res) => {
  const pets = await petsService.getAll();
  res.send({ status: "success", payload: pets });
};

const createPet = async (req, res) => {
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate) {
    const error = createError("INCOMPLETE_VALUES");
    return res
      .status(error.status)
      .send({ status: "error", error: error.message });
  }
  const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
  const result = await petsService.create(pet);
  res.send({ status: "success", payload: result });
};

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;
  const petId = req.params.pid;
  await petsService.update(petId, petUpdateBody);
  res.send({ status: "success", message: "pet updated" });
};

const deletePet = async (req, res) => {
  const petId = req.params.pid;
  await petsService.delete(petId);
  res.send({ status: "success", message: "pet deleted" });
};

const createPetWithImage = async (req, res) => {
  const file = req.file;
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  logger.debug(file);
  const pet = PetDTO.getPetInputFrom({
    name,
    specie,
    birthDate,
    image: `${__dirname}/../public/img/${file.filename}`,
  });
  logger.debug(pet);
  const result = await petsService.create(pet);
  res.send({ status: "success", payload: result });
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
