const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Patient = require("../db/Patient");

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
        patient => new Patient(patient.get("patient"))
      );
      res.json(patients);
      session.close();
    })
    .catch(error => {
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
      return tx.run(query, req.body);
    })
    .then(result => {
      res.json(new Patient(result.records[0].get("patient")));
      session.close();
    })
    .catch(error => {
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
          RETURN patient`;
      return tx.run(query);
    })
    .then(result => {
      res.json(new Patient(result.records[0].get("patient")));
      session.close();
    })
    .catch(error => {
      error.status = 404;
      error.message = `Unable to fetch patient with id: ${id}`;
      next(error);
    });
});

module.exports = router;
