const { appInit } = require("../../src/init");
const { dbInit } = require("../../src/init");
const { expect } = require("chai");

describe("Users", () => {
  let app;
  beforeEach(async () => {
    const db = await dbInit();
    app = await appInit(db);
  });

  describe("GET /users", () => {
    it("Returns all users", async () => {
      const response = await app.inject().get("/users?city=Vilnius").end();
      expect(response.json()).to.eql([
        {
          city: "Vilnius",
          isEligibleForDiscount: false,
          name: "Vardenis Pavardenis",
        },
        {
          city: "Vilnius",
          isEligibleForDiscount: true,
          name: "Jane Doe",
        },
      ]);
    });
    it("Throws an error for invalid city", async () => {
      const response = await app.inject().get("/users?city=Oslo").end();
      expect(response.statusCode).to.eql(400);
      expect(response.json()).to.eql({ message: "Invalid city: Oslo" });
    });
  });

  describe("GET /users-new", () => {
    it("Returns all users", async () => {
      const response = await app.inject().get("/users-new?city=Vilnius").end();
      expect(response.json()).to.eql([
        {
          city: "Vilnius",
          isEligibleForDiscount: false,
          name: "Vardenis Pavardenis",
        },
        {
          city: "Vilnius",
          isEligibleForDiscount: true,
          name: "Jane Doe",
        },
      ]);
    });

    it("Throws an error for invalid city", async () => {
      const response = await app.inject().get("/users-new?city=Oslo").end();
      expect(response.statusCode).to.eql(400);
      expect(response.json()).to.eql({ message: "Invalid city: Oslo" });
    });
  });
});
