import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";
import petModel from "../src/dao/models/Pet.js";
import adoptionModel from "../src/dao/models/Adoption.js";
import "./setup.js";

const { expect } = chai;
const request = supertest(app);

let validUserId;
let validPetId;
let validAdoptionId;

beforeEach(async () => {
  const user = await userModel.create({
    first_name: "John",
    last_name: "Doe",
    email: "gabriel@example.com",
    password: process.env.USER_PASSWORD,
  });
  validUserId = user._id;

  const pet = await petModel.create({
    name: "Buddy",
    specie: "Dog",
    birthDate: new Date(),
    adopted: false,
  });
  validPetId = pet._id;

  const adoption = await adoptionModel.create({
    user: validUserId,
    pet: validPetId,
  });
  validAdoptionId = adoption._id;
});

describe("Adoptions API", () => {
  it("should create a new adoption", (done) => {
    request
      .post(`/api/adoptions/${validUserId}/${validPetId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.message).to.equal("Pet adopted");
        done();
      });
  });

  it("should get all adoptions", (done) => {
    request.get("/api/adoptions").end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
      done();
    });
  });

  it("should get a single adoption by ID", (done) => {
    request.get(`/api/adoptions/${validAdoptionId}`).end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id");
      expect(res.body.payload._id).to.equal(validAdoptionId.toString());
      done();
    });
  });
});
