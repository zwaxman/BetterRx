const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

router.get("/", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (medClass:medClass) \
        RETURN medClass";
      return tx.run(query, req.body);
    })
    .then(result => {
      const medClasss = result.records.map(
        medClass => new Node(medClass.get("medClass"))
      );
      session.close();
      res.status(200).json(medClasss);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = "Unable to fetch medClasss";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const medClass = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = "CREATE (medClass:medClass)";
      for (let key in medClass) {
        query += ` SET medClass.${key} = $${key}`;
      }
      query += " RETURN medClass";
      return tx.run(query, medClass);
    })
    .then(result => {
        session.close();
      res.status(201).json(new Node(result.records[0].get("medClass")));
    })
    .catch(error => {
        session.close();
      error.status = 401;
      error.message = "Unable to create medClass";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (medClass:medClass) \
            WHERE ID(medClass) = ${id} \
          RETURN medClass`;
      return tx.run(query);
    })
    .then(result => {
        session.close();
      res.status(200).json(new Node(result.records[0].get("medClass")));
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to fetch medClass with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
    const id = Number(req.params.id)
    const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (medClass:medClass) \
            WHERE ID(medClass) = ${id} \
          DETACH DELETE medClass`;
      return tx.run(query);
    })
    .then(() => {
        session.close();
      res.sendStatus(200);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to delete medClass with id: ${id}`;
      next(error);
    });
})

router.put("/:id", (req, res, next) => {
    const medClass = req.body;
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (medClass:medClass) \
        WHERE ID(medClass) = ${medClass.id}`;
        for (let key in medClass) {
          query += key!=='id' ? ` SET medClass.${key} = $${key}` : '';
        }
        query += " RETURN medClass";
        return tx.run(query, medClass);
      })
      .then(result => {
          session.close();
        res.status(200).json(new Node(result.records[0].get("medClass")));
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to edit medClass";
        next(error);
      });
  });

module.exports = router;
