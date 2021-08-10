const Database = require("sqlite-async");
const fastify = require("fastify");
const { getUsersHandler } = require("./controllers/usersController");

const SUPPORTED_CITIES = ["Vilnius", "Kaunas", "Mars colony"];

async function dbInit() {
  const db = await Database.open(":memory:");
  await db.run(
    "CREATE TABLE users (FIRST_NAME VARCHAR, LAST_NAME VARCHAR, AGE INTEGER, city VARCHAR, IS_ACTIVE BOOLEAN)"
  );
  await db.run(
    "insert into users VALUES ('Vardenis', 'Pavardenis', 47, 'Vilnius', true)"
  );
  await db.run(
    "insert into users VALUES ('John', 'Doe', 24, 'Vilnius', false)"
  );
  await db.run("insert into users VALUES ('Jane', 'Doe', 31, 'Vilnius', true)");
  await db.run(
    "insert into users VALUES ('X', '119', 105, 'Mars colony', true)"
  );
  return db;
}

async function appInit(db) {
  const app = fastify({
    logger: true,
  });

  app.route({
    method: "GET",
    url: "/users",

    // This is a big-ball-of-mud version of the endpoint that you should use as a starting point.
    // Split it across the layers: controller, domain service, repository. You may or may not want to use a mapper as well.
    handler: async (req, reply) => {
      const { city } = req.query;
      const isActive = true;
      if (!SUPPORTED_CITIES.includes(city)) {
        return reply.status(400).send({
          message: `Invalid city: ${city}`,
        });
      }

      const users = await db.all(
        "SELECT * from users WHERE city = ? AND IS_ACTIVE = ?",
        [city, isActive]
      );

      const usersWithEligibility = users.map((user) => {
        const isEligibleForDiscount = user.AGE >= 25 && user.AGE <= 45;
        return {
          name: `${user.FIRST_NAME} ${user.LAST_NAME}`,
          city: user.city,
          isEligibleForDiscount,
        };
      });

      return reply.send(usersWithEligibility);
    },
  });

  app.route({
    method: "GET",
    url: "/users-new",
    handler: getUsersHandler,
  });

  await app.ready();
  return app;
}

module.exports = {
  appInit,
  dbInit,
};
