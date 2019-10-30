const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

router.get("/", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (med:med) \
        RETURN med";
      return tx.run(query, req.body);
    })
    .then(result => {
      const meds = result.records.map(
        med => new Node(med.get("med"))
      );
      session.close();
      res.status(200).json(meds);
    })
    .catch(error => {
      console.log(error)
        session.close();
      error.status = 404;
      error.message = "Unable to fetch meds";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const med = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = "CREATE (med:med)";
      for (let key in med) {
        query += ` SET med.${key} = $${key}`;
      }
      query += " RETURN med";
      return tx.run(query, med);
    })
    .then(result => {
        session.close();
      res.status(201).json(new Node(result.records[0].get("med")));
    })
    .catch(error => {
        session.close();
      error.status = 401;
      error.message = "Unable to create med";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (med:med) \
            WHERE ID(med) = ${id} \
            OPTIONAL MATCH (med)-[:BELONGS_TO_MED_CLASS]-(medClass:medClass)
          RETURN med, collect(DISTINCT medClass) as medClasses`;
      return tx.run(query);
    })
    .then(result => {
        session.close();
        const medNode = result.records[0].get("med")
        medNode.properties.medClasses = result.records[0].get("medClasses").map(txClass => new Node(txClass))
        const med = new Node(medNode)
      res.status(200).json(med);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to fetch problem with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
    const id = Number(req.params.id)
    const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (med:med) \
            WHERE ID(med) = ${id} \
          DETACH DELETE med`;
      return tx.run(query);
    })
    .then(() => {
        session.close();
      res.sendStatus(200);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to delete med with id: ${id}`;
      next(error);
    });
})

router.put("/:id", (req, res, next) => {
    const med = req.body;
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (med:med) \
        WHERE ID(med) = ${med.id}`;
        for (let key in med) {
          query += key!=='id' ? ` SET med.${key} = $${key}` : '';
        }
        query += " RETURN med";
        return tx.run(query, med);
      })
      .then(result => {
          session.close();
        res.status(200).json(new Node(result.records[0].get("med")));
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to edit med";
        next(error);
      });
  });

module.exports = router;
