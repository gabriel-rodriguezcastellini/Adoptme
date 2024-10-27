import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllPets = async (_req, res) => {
  const pets = await petsService.getAll();
  res.send({ status: "success", payload: pets });
};

const createPet = async (req, res) => {
  try {
    const pet = req.body;
    const result = await petsService.create(pet);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
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
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }
    const pet = req.body;
    const result = await petsService.create(pet);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const getPetById = async (req, res) => {
  const petId = req.params.pid;
  const pet = await petsService.getBy({ _id: petId });
  if (!pet) {
    return res.status(404).send({ status: "error", error: "Pet not found" });
  }
  res.send({ status: "success", payload: pet });
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
  getPetById,
};
