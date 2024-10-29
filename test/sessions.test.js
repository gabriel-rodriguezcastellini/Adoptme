import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import userModel from "../src/dao/models/User.js";

const { expect } = chai;
const request = supertest(app);

before(async () => {
  mongoose.connect(process.env.URL_MONGO_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await userModel.deleteMany({});
});

after(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
});

describe("Sessions API", () => {
  describe("POST /api/sessions/register", () => {
    it("should register a new session", (done) => {
      request
        .post("/api/sessions/register")
        .send({
          first_name: "Jane",
          last_name: "Doe",
          email: "jane.doe@example.com",
          password: process.env.USER_PASSWORD,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal("success");
          expect(res.body.message).to.equal("Session registered successfully");
          done();
        });
    });
  });

  describe("POST /api/sessions/login", () => {
    it("should login to a session", (done) => {
      request
        .post("/api/sessions/login")
        .send({
          email: "jane.doe@example.com",
          password: process.env.USER_PASSWORD,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal("success");
          expect(res.body.message).to.equal("Logged in successfully");
          done();
        });
    });
  });
});
