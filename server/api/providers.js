const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

const {isProviderOrAdmin} = require("./middleware")

router.get("/", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (provider:provider) \
        RETURN provider";
      return tx.run(query, req.body);
    })
    .then(result => {
      const providers = result.records.map(
        provider => new Node(provider.get("provider"))
      );
      session.close();
      res.status(200).json(providers);
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = "Unable to fetch providers";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (provider:provider) \
            WHERE ID(provider) = ${id} \
          RETURN provider`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const providerNode = result.records[0].get("provider");
      const provider = new Node(providerNode);
      res.status(200).json(provider)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch provider with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", isProviderOrAdmin, (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (provider:provider) \
            WHERE ID(provider) = ${id} \
          DETACH DELETE provider`;
      return tx.run(query);
    })
    .then(() => {
      session.close();
      res.sendStatus(200);
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to delete provider with id: ${id}`;
      next(error);
    });
});

router.put("/:id", isProviderOrAdmin, (req, res, next) => {
  const provider = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = `MATCH (provider:provider) \
        WHERE ID(provider) = ${req.params.id}`;
      for (let key in provider) {
        query +=
          key !== "id" || "problems" ? ` SET provider.${key} = $${key}` : "";
      }
      query += " RETURN provider";
      return tx.run(query, provider);
    })
    .then(result => {
      session.close();
      res.status(200).json(new Node(result.records[0].get("provider")));
    })
    .catch(error => {
      session.close();
      error.status = 401;
      error.message = "Unable to edit provider";
      next(error);
    });
});

module.exports = router;
