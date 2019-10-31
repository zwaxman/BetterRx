const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

const {isAdmin, isUser} = require("./middleware")

router.get("/", isAdmin, (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (admin:admin) \
        RETURN admin";
      return tx.run(query, req.body);
    })
    .then(result => {
      const admins = result.records.map(
        admin => new Node(admin.get("admin"))
      );
      session.close();
      res.status(200).json(admins);
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = "Unable to fetch admins";
      next(error);
    });
});

router.get("/:id", isAdmin, (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (admin:admin) \
            WHERE ID(admin) = ${id} \
          RETURN admin`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const adminNode = result.records[0].get("admin");
      const admin = new Node(adminNode);
      res.status(200).json(admin)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch admin with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", isAdmin, isUser, (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (admin:admin) \
            WHERE ID(admin) = ${id} \
          DETACH DELETE admin`;
      return tx.run(query);
    })
    .then(() => {
      session.close();
      res.sendStatus(200);
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to delete admin with id: ${id}`;
      next(error);
    });
});

router.put("/:id", isAdmin, isUser, (req, res, next) => {
  const admin = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = `MATCH (admin:admin) \
        WHERE ID(admin) = ${req.params.id}`;
      for (let key in admin) {
        query +=
          key !== "id" || "problems" ? ` SET admin.${key} = $${key}` : "";
      }
      query += " RETURN admin";
      return tx.run(query, admin);
    })
    .then(result => {
      session.close();
      res.status(200).json(new Node(result.records[0].get("admin")));
    })
    .catch(error => {
      session.close();
      error.status = 401;
      error.message = "Unable to edit admin";
      next(error);
    });
});

module.exports = router;
