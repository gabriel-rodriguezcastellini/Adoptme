import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const generateMockUsers = (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("coder123", 10),
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    };
    users.push(user);
  }
  return users;
};
