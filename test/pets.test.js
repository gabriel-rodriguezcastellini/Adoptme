import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import petModel from "../src/dao/models/Pet.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { expect } = chai;
const request = supertest(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let validPetId;
let imagePath;

before(async () => {
  mongoose.connect(process.env.URL_MONGO_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const pet = await petModel.create({
    name: "Test Pet",
    specie: "Dog",
    birthDate: "2020-01-01",
  });
  validPetId = pet._id.toString();
});

after(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
  if (imagePath) {
    fs.unlink(imagePath, () => {});
  }
});

describe("Pets API", function () {
  this.timeout(30000);

  it("should get all pets", (done) => {
    request.get("/api/pets").end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
      done();
    });
  });

  it("should get a single pet by ID", (done) => {
    request.get(`/api/pets/${validPetId}`).end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id").eql(validPetId);
      done();
    });
  });

  it("should create a new pet", (done) => {
    const newPet = {
      name: "Buddy",
      specie: "Dog",
      birthDate: "2020-01-01",
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
    const newPet = {
      name: "Buddy",
      specie: "Dog",
      birthDate: "2020-01-01",
    };
    request
      .post("/api/pets/withimage")
      .field("name", newPet.name)
      .field("specie", newPet.specie)
      .field("birthDate", newPet.birthDate)
      .attach(
        "image",
        path.resolve(__dirname, "../src/public/img/1671549990926-coderDog.jpg")
      )
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("_id");
        imagePath = res.body.payload.image;
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
