const express = require("express");
const router = express.Router({mergeParams: true});
const driver = require("../db/db");
const Node = require('../db/Node')

const validNodeLabels = ['patients', 'problems', 'medClasses']
const validRelLabels = ['TREATS_DISEASE', 'ALLERGIC_TO_MED_CLASS', 'HAS_PROBLEM']
// const validRelProps = ...

router.use((req, res, next) => {
    const {node1, node1Id, node2, node2Id} = req.params;
    const relLabel = req.body.relLabel
    // const relProps = req.body.relProps || {}
    let valid = true
    while (valid) {
        valid += validNodeLabels.includes(node1)
        valid += validNodeLabels.includes(node2)
        valid += Boolean(Number(node1Id)) && Number(node1Id)>=0
        valid += Boolean(Number(node2Id)) && Number(node2Id)>=0
        valid += validRelLabels.includes(relLabel)
        // validate relProps
        break
    }
    if (valid) {
        next()
    } else {
        const error = new Error()
        error.message = 'Invalid api route to create relationship'
        error.status = '201'
        next(error)
    }
})

router.post("/", (req, res, next) => {
    const {node1, node1Id, node2, node2Id} = req.params;
    const node1Label = node1==='medClasses' ? 'medClass' : node1.slice(0,node1.length-1)
    const node2Label = node2==='medClasses' ? 'medClass' : node2.slice(0,node2.length-1)
    const relLabel = req.body.relLabel
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (node1:${node1Label}) \
        WHERE ID(node1) = ${node1Id} \
        MATCH (node2:${node2Label}) \
        WHERE ID(node2) = ${node2Id} \
        MERGE (node1)-[:${relLabel}]->(node2) \
        RETURN node1, node2`
        ;
        return tx.run(query);
      })
      .then(result => {
          session.close();
        res.status(200).json({[node1Label]: new Node(result.records[0].get("node1")), [node2Label]: new Node(result.records[0].get("node2"))});
      })
      .catch(error => {
          session.close();
        error.status = 401;
        error.message = `Unable to add relationship (${node1Label})-[:${relLabel}]->(${node2Label})`;
        next(error);
      });
  });

  router.delete("/", (req, res, next) => {
    const {node1, node1Id, node2, node2Id} = req.params;
    const node1Label = node1==='medClasses' ? 'medClass' : node1.slice(0,node1.length-1)
    const node2Label = node2==='medClasses' ? 'medClass' : node2.slice(0,node2.length-1)
    const relLabel = req.body.relLabel
    console.log(relLabel)
    const session = driver.session();
    session
      .writeTransaction(tx => {
        let query = `MATCH (node1:${node1Label})-[rel:${relLabel}]-(node2:${node2Label}) \
        WHERE ID(node1) = ${node1Id} AND ID(node2) = ${node2Id} \
        DELETE rel`
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
        error.message = `Unable to delete relationship (${node1Label})-[:${relLabel}]->(${node2Label})`;
        next(error);
      });
  });

module.exports = router