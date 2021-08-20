const express = require("express");

const session = require("express-session");

const { connectDB } = require("./db");

const {
  profile,
  auth,
  doctor,
  settings,
  verification,
} = require("./src/routes");

const { APP_PORT, APP_ORIGIN, SESSION_OPTIONS } = require("./src/config");

const { notFound } = require("./src/errors");

connectDB();

const app = express();

app.use(express.json());

app.use(session({ ...SESSION_OPTIONS }));

app.use("/auth", auth);

app.use("/profile", profile);

app.use("/settings", settings);

app.use("/doctor", doctor);

app.use("/email", verification);

app.use(notFound);

app.listen(APP_PORT, () => console.log(`listening on ${APP_ORIGIN}`));
