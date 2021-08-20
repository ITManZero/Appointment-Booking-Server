require("dotenv").config();

const ONE_HOUR = 1000 * 60 * 60;

const THIRTY_MINUTES = ONE_HOUR / 2;

const SIX_HOURS = ONE_HOUR * 6;

const SESSION_IDLE_TIMEOUT = THIRTY_MINUTES;

const TWELVE_HOURS = ONE_HOUR * 12;

// Bcrypt

const BCRYPT_WORK_FACTOR = 12;

const BCRYPT_MAX_BYTES = 72;

// Verification email

const EMAIL_VERIFICATION_TIMEOUT = ONE_HOUR;

// sha1 -> 160 bits / 8 = 20 bytes * 2 (hex) = 40 bytes
const EMAIL_VERIFICATION_TOKEN_BYTES = 40;

// sha256 -> 256 bits / 8 = 32 bytes * 2 (hex) = 64 bytes
const EMAIL_VERIFICATION_SIGNATURE_BYTES = 64;

// Password reset

const PASSWORD_RESET_BYTES = 40;

const PASSWORD_RESET_TIMEOUT = ONE_HOUR;

const {
  SESSION_SECRET,
  SESSION_NAME,
  MONGO_URI,
  NODE_ENV,
  APP_HOSTNAME,
  APP_PROTOCOL,
  APP_PORT,
  APP_SECRET,
} = process.env;

module.exports = {
  SESSION_OPTIONS: {
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    cookie: {
      maxAge: +SESSION_IDLE_TIMEOUT,
      secure: false,
      sameSite: true,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  },
  SESSION_ABSOLUTE_TIMEOUT: +SIX_HOURS,
  SESSION_NAME,
  validSpecilaties: ["اطفال", "عظمية", "عام", "اسنان"],
  MONGO_OPTIONS: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  MONGO_URI,
  NODE_ENV,
  APP_HOSTNAME,
  APP_PROTOCOL,
  APP_PORT,
  APP_SECRET,
  APP_ORIGIN: `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`,
  BCRYPT_WORK_FACTOR,
  BCRYPT_MAX_BYTES,
  EMAIL_VERIFICATION_TIMEOUT,
  EMAIL_VERIFICATION_TOKEN_BYTES,
  EMAIL_VERIFICATION_SIGNATURE_BYTES,
};
