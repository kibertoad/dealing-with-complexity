const Database = require("sqlite-async");
const fastify = require("fastify");

let db;
async function dbInit() {
  db = await Database.open(":memory:");
  await db.run("CREATE TABLE users (username VARCHAR, city VARCHAR)");
  await db.run("insert into users VALUES ('test', 'Vilnius')");
  await db.run("insert into users VALUES ('test2', 'Vilnius')");
  await db.run("insert into users VALUES ('test3', 'Kaunas')");
}

let app
async function appInit() {
  app = fastify({
    logger: true,
  });

  app.route({
    method: "GET",
    url: "/users",
    handler: async (req, reply) => {
      const users = await db.all("SELECT * from users");
      return reply.send(users);
    },
  });

  await app.ready();
  return app;
}

async function run() {
    await dbInit()
    await appInit()

    const response = await app.inject()
        .get('/users')
        .end()
    console.log(`Response: ${JSON.stringify(response.json())}`)
}

run()
