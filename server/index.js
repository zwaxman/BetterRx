const express = require("express");
const app = express();
const path = require("path");
const driver = require("./db/db");
const session = require("express-session");
const Node = require('./db/Node')

app.use(require("morgan")("dev"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    resave: false,
    saveUninitialized: false
  })
);

const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  try {
    done(null, { id: user.id, role: user.label });
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(({ id, role }, done) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (user:${role}) \
            WHERE ID(user) = ${id} \
          RETURN user`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const userNode = result.records[0].get("user");
      const user = new Node(userNode);
      done(null, user);
    })
    .catch(done);
});

app.use("/api", require("./api"));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  try {
    console.log(`App listening on port ${port}`);
  } catch (error) {}
});
