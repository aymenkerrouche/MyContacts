const request = require("supertest");
const app = require("../src/app");

describe("Contacts routes (protected)", () => {
  let token;

  beforeEach(async () => {
    // register a user and obtain token
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "user@example.com", password: "pass1234" });
    token = res.body.token;
  });

  test("create contact success", async () => {
    const res = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Jean", lastName: "Dupont", phone: "0612345678" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.phone).toBe("0612345678");
  });

  test("create contact invalid phone", async () => {
    const res = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Bad", lastName: "Phone", phone: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.type).toBe("ValidationError");
  });

  test("get contacts returns created", async () => {
    await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "A", lastName: "B", phone: "0612345678" });

    const res = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("update contact and delete contact", async () => {
    const create = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "ToUpdate", lastName: "Me", phone: "0612345678" });

    const id = create.body._id;

    const patch = await request(app)
      .patch(`/contacts/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0698765432" });

    expect(patch.statusCode).toBe(200);
    expect(patch.body.phone).toBe("0698765432");

    const del = await request(app)
      .delete(`/contacts/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe("Contact supprimé");
  });
});
