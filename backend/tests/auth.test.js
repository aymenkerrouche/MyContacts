const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth routes", () => {
  test("register success", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "pass1234" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("register duplicate", async () => {
    await User.create({ email: "dup@example.com", password: "hashed" });
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "dup@example.com", password: "whatever" });
    expect(res.statusCode).toBe(400);
  });

  test("login success", async () => {
    const bcrypt = require("bcrypt");
    const hashed = await bcrypt.hash(
      "mypassword",
      +process.env.BCRYPT_SALT_ROUNDS,
    );
    await User.create({ email: "login@example.com", password: hashed });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@example.com", password: "mypassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("login fail", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nope@example.com", password: "x" });
    expect(res.statusCode).toBe(400);
  });
});
