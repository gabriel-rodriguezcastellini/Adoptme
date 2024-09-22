import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import uploader from "../utils/uploader.js";
import { generateMockPets } from "../utils/mockingPets.js";

const router = Router();

router.get("/", petsController.getAllPets);
router.post("/", petsController.createPet);
router.post(
  "/withimage",
  uploader.single("image"),
  petsController.createPetWithImage
);
router.put("/:pid", petsController.updatePet);
router.delete("/:pid", petsController.deletePet);

router.get("/mockingpets", (_req, res) => {
  const mockPets = generateMockPets(100);
  res.send({ status: "success", payload: mockPets });
});

export default router;
