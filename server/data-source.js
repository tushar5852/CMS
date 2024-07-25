const { DataSource } = require("typeorm");
const path = require("path");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "cmsdb",
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "./src/entity/*.js")],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

module.exports = AppDataSource;
