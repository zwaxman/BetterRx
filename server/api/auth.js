const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

router.put("/login", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (user:${req.body.role}) \
            WHERE ID(user) = ${req.body.id} \
          RETURN user`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      if (result.records.length === 0) {
        res.sendStatus(401);
      } else {
        const userNode = result.records[0].get("user");
        if (userNode.properties.password !== req.body.password) {
          res.sendStatus(401);
        } else {
          const user = new Node(userNode);
          req.login(user, err => {
            if (err) next(err);
            else res.json(user);
          });
        }
      }
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `CREATE (user:${req.body.role}) \
              SET user.name = "${req.body.name}" \
              SET user.password = "${req.body.password}"
            RETURN user`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const userNode = result.records[0].get("user");
      const user = new Node(userNode);
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

router.delete('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy()
  res.sendStatus(204);
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
