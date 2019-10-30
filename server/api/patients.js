const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Patient = require("../db/Patient");
const Problem = require("../db/Problem");

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
      res.status(201).json(new Patient(result.records[0].get("patient")));
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
          RETURN patient, collect(problem) AS problems`;
      return tx.run(query);
    })
    .then(result => {
        session.close();
        const patientNode = result.records[0].get("patient")
        patientNode.properties.problems = result.records[0].get("problems").map(problem => new Problem(problem))
        const patient = new Patient(patientNode)
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
    console.log(req.body)
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
        res.status(200).json(new Patient(result.records[0].get("patient")));
      })
      .catch(error => {
        console.log(error)
          session.close();
        error.status = 401;
        error.message = "Unable to edit patient";
        next(error);
      });
  });

  router.post("/:patientId/problems/:problemId", (req, res, next) => {
    const {patientId, problemId} = req.params
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (patient:patient) \
        WHERE ID(patient) = ${patientId} \
        MATCH (problem:problem) \
        WHERE ID(problem) = ${problemId} \
        MERGE (patient)-[:HAS_PROBLEM]->(problem) \
        RETURN patient, problem`
        ;
        return tx.run(query);
      })
      .then(result => {
          session.close();
        res.status(200).json({patient: new Patient(result.records[0].get("patient")), problem: new Problem(result.records[0].get("problem"))});
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to add problem";
        next(error);
      });
  });

  router.delete("/:patientId/problems/:problemId", (req, res, next) => {
    const {patientId, problemId} = req.params
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (patient:patient)-[has_problem:HAS_PROBLEM]-(problem:problem) \
        WHERE ID(patient) = ${patientId} AND ID(problem) = ${problemId} \
        DELETE has_problem`
        ;
        return tx.run(query);
      })
      .then(result => {
          session.close();
        res.sendStatus(200)
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to delete problem";
        next(error);
      });
  });

module.exports = router;