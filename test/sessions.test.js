import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";
import "./setup.js";
import bcrypt from "bcrypt";

const { expect } = chai;
const request = supertest(app);

let authToken;

beforeEach(async () => {
  await userModel.create({
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: bcrypt.hashSync(process.env.USER_PASSWORD, 10),
  });
});

describe("Sessions API", () => {
  it("should register a new user session", (done) => {
    const newUser = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      password: process.env.USER_PASSWORD,
    };
    request
      .post("/api/sessions/register")
      .send(newUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.a("string");
        done();
      });
  });

  it("should login to a user session", (done) => {
    const loginUser = {
      email: "john@example.com",
      password: process.env.USER_PASSWORD,
    };
    request
      .post("/api/sessions/login")
      .send(loginUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        authToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
        done();
      });
  });

  it("should get the current session", (done) => {
    request
      .get("/api/sessions/current")
      .set("Cookie", `coderCookie=${authToken}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("email");
        expect(res.body.payload.email).to.equal("john@example.com");
        done();
      });
  });

  it("should perform an unprotected login", (done) => {
    const loginUser = {
      email: "john@example.com",
      password: process.env.USER_PASSWORD,
    };
    request
      .get("/api/sessions/unprotectedLogin")
      .send(loginUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        done();
      });
  });

  it("should get the unprotected current session", (done) => {
    request
      .get("/api/sessions/unprotectedCurrent")
      .set("Cookie", `unprotectedCookie=${authToken}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.have.property("email");
        expect(res.body.payload.email).to.equal("john@example.com");
        done();
      });
  });

  it("should logout from a session", (done) => {
    request
      .post("/api/sessions/logout")
      .set("Cookie", `authCookie=${authToken}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        done();
      });
  });
});
