import { faker } from "@faker-js/faker";
import PetDTO from "../dto/Pet.dto.js";

export const generateMockPets = (num) => {
  const pets = [];
  for (let i = 0; i < num; i++) {
    const pet = PetDTO.getPetInputFrom({
      name: faker.person.firstName(),
      specie: faker.animal.type(),
      birthDate: faker.date.past().toISOString().split("T")[0],
      adopted: false,
      image: faker.image.urlLoremFlickr({
        width: 640,
        height: 480,
        category: "animals",
      }),
    });
    pets.push(pet);
  }
  return pets;
};
