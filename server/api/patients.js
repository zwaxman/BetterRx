const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node")

router.get("/", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (patient:patient) \
        RETURN patient";
      return tx.run(query, req.body);
    })
    .then(result => {
      const patients = result.records.map(
        patient => new Node(patient.get("patient"))
      );
      session.close();
      res.status(200).json(patients);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = "Unable to fetch patients";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const patient = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = "CREATE (patient:patient)";
      for (let key in patient) {
        query += ` SET patient.${key} = $${key}`;
      }
      query += " RETURN patient";
      return tx.run(query, patient);
    })
    .then(result => {
        session.close();
      res.status(201).json(new Node(result.records[0].get("patient")));
    })
    .catch(error => {
        session.close();
      error.status = 401;
      error.message = "Unable to create patient";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (patient:patient) \
            WHERE ID(patient) = ${id} \
            OPTIONAL MATCH (patient)-[:HAS_PROBLEM]-(problem:problem) \
            OPTIONAL MATCH (patient)-[:ALLERGIC_TO_MED_CLASS]-(medClass:medClass) \
          RETURN patient, collect(DISTINCT problem) AS problems, collect(DISTINCT medClass) AS allergies`;
      return tx.run(query);
    })
    .then(result => {
        session.close();
        const patientNode = result.records[0].get("patient")
        patientNode.properties.problems = result.records[0].get("problems").map(problem => new Node(problem))
        patientNode.properties.allergies = result.records[0].get("allergies").map(allergy => new Node(allergy))
        const patient = new Node(patientNode)
      res.status(200).json(patient);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to fetch patient with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
    const id = Number(req.params.id)
    const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (patient:patient) \
            WHERE ID(patient) = ${id} \
          DETACH DELETE patient`;
      return tx.run(query);
    })
    .then(() => {
        session.close();
      res.sendStatus(200);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to delete patient with id: ${id}`;
      next(error);
    });
})

router.put("/:id", (req, res, next) => {
    const patient = req.body;
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (patient:patient) \
        WHERE ID(patient) = ${req.params.id}`;
        for (let key in patient) {
          query += key!=='id' || 'problems' ? ` SET patient.${key} = $${key}` : '';
        }
        query += " RETURN patient";
        return tx.run(query, patient);
      })
      .then(result => {
          session.close();
        res.status(200).json(new Node(result.records[0].get("patient")));
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to edit patient";
        next(error);
      });
  });

module.exports = router;
