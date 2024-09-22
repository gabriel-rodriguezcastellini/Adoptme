import { Router } from "express";
import { generateMockPets } from "../utils/mockingPets.js";
import { generateMockUsers } from "../utils/mockingUsers.js";
import { usersService, petsService } from "../services/index.js";

const router = Router();

router.get("/mockingpets", (_req, res) => {
  const mockPets = generateMockPets(100);
  res.send({ status: "success", payload: mockPets });
});

router.get("/mockingusers", (_req, res) => {
  const mockUsers = generateMockUsers(50);
  res.send({ status: "success", payload: mockUsers });
});

router.post("/generateData", async (req, res) => {
  const { users, pets } = req.body;
  const mockUsers = generateMockUsers(users);
  const mockPets = generateMockPets(pets);

  try {
    for (const user of mockUsers) {
      await usersService.create(user);
    }
    for (const pet of mockPets) {
      await petsService.create(pet);
    }
    res.send({ status: "success", message: "Data generated and inserted" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
