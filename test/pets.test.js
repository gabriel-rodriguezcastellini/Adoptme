import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import petModel from "../src/dao/models/Pet.js";

const { expect } = chai;
const request = supertest(app);

let validPetId;

before(async () => {
  mongoose.connect(process.env.URL_MONGO_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await petModel.deleteMany({});

  const pet = await petModel.create({
    name: "Buddy",
    specie: "Dog",
    age: 2,
    breed: "Golden Retriever",
    adopted: false,
  });
  validPetId = pet._id;
});

after(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
});

describe("Pets API", () => {
  it("should get all pets", (done) => {
    request.get("/api/pets").end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
      done();
    });
  });

  it("should get a single pet by ID", (done) => {
    request.get(`/api/pets/${validPetId}`).end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id");
      expect(res.body.payload._id).to.equal(validPetId.toString());
      done();
    });
  });

  it("should create a new pet", (done) => {
    const newPet = {
      name: "Max",
      specie: "Cat",
      age: 3,
      breed: "Siamese",
      adopted: false,
    };
    request
      .post("/api/pets")
      .send(newPet)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("_id");
        done();
      });
  });

  it("should create a new pet with image", (done) => {
    request
      .post("/api/pets/withimage")
      .field("name", "Bella")
      .field("specie", "Dog")
      .field("age", 4)
      .field("breed", "Labrador")
      .attach("image", "test/fixtures/dog.jpg")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("_id");
        done();
      });
  });

  it("should update a pet by ID", (done) => {
    const updatePet = {
      name: "Max",
    };
    request
      .put(`/api/pets/${validPetId}`)
      .send(updatePet)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.message).to.equal("pet updated");
        done();
      });
  });

  it("should delete a pet by ID", (done) => {
    request.delete(`/api/pets/${validPetId}`).end((err, res) => {
      if (err) return done(err);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.message).to.equal("pet deleted");
      done();
    });
  });
});
