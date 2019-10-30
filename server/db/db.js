const neo4j = require("neo4j-driver");

const driver = neo4j.default.driver(
  "bolt://localhost:7687",
  neo4j.default.auth.basic("neo4j", "BetterRx")
);

module.exports = driver