const express = require("express");
const router = express.Router();
const driver = require("../db/db");
const Problem = require("../db/Problem");

router.get("/", (req, res, next) => {
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = "MATCH (problem:problem) \
        RETURN problem";
      return tx.run(query, req.body);
    })
    .then(result => {
      const problems = result.records.map(
        problem => new Problem(problem.get("problem"))
      );
      session.close();
      res.status(200).json(problems);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = "Unable to fetch problems";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const problem = req.body;
  const session = driver.session();
  session
    .writeTransaction(tx => {
      let query = "CREATE (problem:problem)";
      for (let key in problem) {
        query += ` SET problem.${key} = $${key}`;
      }
      query += " RETURN problem";
      return tx.run(query, problem);
    })
    .then(result => {
        session.close();
      res.status(201).json(new Problem(result.records[0].get("problem")));
    })
    .catch(error => {
        session.close();
      error.status = 401;
      error.message = "Unable to create problem";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const session = driver.session();
  session
    .writeTransaction(tx => {
      query = `MATCH (problem:problem) \
            WHERE ID(problem) = ${id} \
          RETURN problem`;
      return tx.run(query);
    })
    .then(result => {
        session.close();
      res.status(200).json(new Problem(result.records[0].get("problem")));
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
      query = `MATCH (problem:problem) \
            WHERE ID(problem) = ${id} \
          DETACH DELETE problem`;
      return tx.run(query);
    })
    .then(() => {
        session.close();
      res.sendStatus(200);
    })
    .catch(error => {
        session.close();
      error.status = 404;
      error.message = `Unable to delete problem with id: ${id}`;
      next(error);
    });
})

router.put("/:id", (req, res, next) => {
    const problem = req.body;
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (problem:problem) \
        WHERE ID(problem) = ${problem.id}`;
        for (let key in problem) {
          query += key!=='id' ? ` SET problem.${key} = $${key}` : '';
        }
        query += " RETURN problem";
        return tx.run(query, problem);
      })
      .then(result => {
          session.close();
        res.status(200).json(new Problem(result.records[0].get("problem")));
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = "Unable to edit problem";
        next(error);
      });
  });

module.exports = router;
