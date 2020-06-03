require("dotenv").config();
const massive = require("massive");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;
const middle = require('./middleware/middleware')
const authCtrl = require('./ctrl/authctrl')

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("bruh");
  app.listen(SERVER_PORT, () =>
    console.log(`server activated port ${SERVER_PORT}`)
  );
});

app.post('/auth/register', middle.checkUsername, authCtrl.register)
app.post('/auth/login', middle.checkUsername, authCtrl.login)
app.post('/auth/logout', middle.checkUsername, authCtrl.logout)
app.get('/api/user', authCtrl.getUser)