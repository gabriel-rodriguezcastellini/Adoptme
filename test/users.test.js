import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import userModel from "../src/dao/models/User.js";

const { expect } = chai;
const request = supertest(app);

let validUserId;

before(async () => {
  mongoose.connect(process.env.URL_MONGO_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = await userModel.create({
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    password: process.env.USER_PASSWORD,
  });
  validUserId = user._id;
});

after(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

describe("Users API", () => {
  it("should get all users", (done) => {
    request.get("/api/users").end((_err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
      done();
    });
  });

  it("should get a single user by ID", (done) => {
    request.get(`/api/users/${validUserId}`).end((_err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload)
        .to.have.property("_id")
        .eql(validUserId.toString());
      done();
    });
  });

  it("should create a new user", (done) => {
    const newUser = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      password: process.env.USER_PASSWORD,
      role: "user",
    };
    request
      .post("/api/users")
      .send(newUser)
      .end((_err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("_id");
        done();
      });
  });

  it("should update a user by ID", (done) => {
    const updateUser = {
      first_name: "Jane",
      last_name: "Smith",
    };
    request
      .put(`/api/users/${validUserId}`)
      .send(updateUser)
      .end((_err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.message).to.equal("User updated");
        done();
      });
  });

  it("should delete a user by ID", (done) => {
    request.delete(`/api/users/${validUserId}`).end((_err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.message).to.equal("User deleted");
      done();
    });
  });
});