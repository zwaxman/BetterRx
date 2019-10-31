const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Node = require("../db/Node");

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
            OPTIONAL MATCH (patient)-[:TAKES_MED]-(med:med) \
            OPTIONAL MATCH (patient)-[:TAKES_MED]-(allergyAlert:med)-[:BELONGS_TO_MED_CLASS]-(medClass)
            OPTIONAL MATCH (patient)-[:TAKES_MED]-(interactionMed1:med)-[:BELONGS_TO_MED_CLASS]-(interactionMedClass1:medClass)-[:INTERACTS_WITH_MED_CLASS]->(interactionMedClass2:medClass)-[:BELONGS_TO_MED_CLASS]-(interactionMed2:med)-[:TAKES_MED]-(patient)
          RETURN patient, collect(DISTINCT problem) AS problems, \
          collect(DISTINCT medClass) AS allergies, \
          collect(DISTINCT med) AS meds, \
          collect(DISTINCT allergyAlert) AS allergyAlerts,
          interactionMed1, interactionMed2, interactionMedClass1, interactionMedClass2`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      patientNode = result.records[0].get("patient");
      patientNode.properties.problems = result.records[0]
        .get("problems")
        .map(problem => new Node(problem));
      patientNode.properties.allergies = result.records[0]
        .get("allergies")
        .map(allergy => new Node(allergy));
      patientNode.properties.meds = result.records[0]
        .get("meds")
        .map(med => new Node(med));
        patientNode.properties.allergyAlerts = result.records[0]
        .get("allergyAlerts")
        .map(med => new Node(med));
      const patient = new Node(patientNode);
      res.status(200).json(patient)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch patient with id: ${id}`;
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  const id = Number(req.params.id);
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
});

router.put("/:id", (req, res, next) => {
  const patient = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = `MATCH (patient:patient) \
        WHERE ID(patient) = ${req.params.id}`;
      for (let key in patient) {
        query +=
          key !== "id" || "problems" ? ` SET patient.${key} = $${key}` : "";
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

router.get("/:id/interactions", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (patient:patient) \
            WHERE ID(patient) = ${id} \
            MATCH (patient)-[:TAKES_MED]-(med1:med)-[:BELONGS_TO_MED_CLASS]-(medClass1:medClass)-[:INTERACTS_WITH_MED_CLASS]->(medClass2:medClass)-[:BELONGS_TO_MED_CLASS]-(med2:med)-[:TAKES_MED]-(patient)
          RETURN med1, med2, medClass1, medClass2`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const interactions=[];
      result.records.forEach(record => {
        const med1 = new Node(record.get('med1'))
        const med2 = new Node(record.get('med2'))
        const medClass1 = new Node(record.get('medClass1'))
        const medClass2 = new Node(record.get('medClass2'))
        interactions.push({med: med1, medClass: medClass1, interactionMed: med2, interactionMedClass: medClass2})
        interactions.push({med: med2, medClass: medClass2, interactionMed: med1, interactionMedClass: medClass1})
      })
      res.status(200).json(interactions)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch patient with id: ${id}`;
      next(error);
    });
});

router.get("/:id/orphanMeds", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (patient:patient) \
      WHERE ID(patient)=${id} \
      MATCH (patient)-[:TAKES_MED]-(med:med) \
      WHERE NOT exists((patient)-[:HAS_PROBLEM]-(:problem)-[:TREATS_PROBLEM]-(:medClass)-[:BELONGS_TO_MED_CLASS]-(med)) \
      RETURN med`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const orphanMeds=result.records.map(record => new Node(record.get('med')))
      res.status(200).json(orphanMeds)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch orphan medication for patient with id: ${id}`;
      next(error);
    });
});

router.get("/:id/orphanProblems", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (patient:patient) \
      WHERE ID(patient)=${id} \
      MATCH (patient)-[:HAS_PROBLEM]-(problem:problem) \
      WHERE NOT exists((patient)-[:TAKES_MED]-(:med)-[:BELONGS_TO_MED_CLASS]-(:medClass)-[:TREATS_PROBLEM]-(problem)) \
      RETURN problem`;
      return tx.run(query);
    })
    .then(result => {
      session.close();
      const orphanProblems=result.records.map(record => new Node(record.get('problem')))
      res.status(200).json(orphanProblems)
    })
    .catch(error => {
      session.close();
      error.status = 404;
      error.message = `Unable to fetch orphan problems for patient with id: ${id}`;
      next(error);
    });
});

module.exports = router;
