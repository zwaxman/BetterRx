const neo4j = require("neo4j-driver");

const driver = neo4j.default.driver(
  "bolt://localhost:7687",
  neo4j.default.auth.basic("neo4j", "BetterRx")
);

module.exports = driver

// const patient = {
//   name: "Scarlett Acevedo",
//   // age: 64,
//   // ethnicity: 'asian',
//   // sex: 'female',
//   // allergies:
//   //  [ 'HCTZ',
//   //    'Metoprolol',
//   //    'Clopidogrel',
//   //    'Carvedilol',
//   //    'Hydromorphone',
//   //    'Ipratropium',
//   //    'Valsartan',
//   //    'Prednisone',
//   //    'Carbamazepine' ],
//   // insurance: 'BCBS',
//   relations: {
//       HAS_DISEASE: 'A'
//   }
// };

// let query = "CREATE (a:patient {name: 'Zach'}) \
// CREATE (b:disease {name: 'Asthma'}) \
// CREATE (c:class {name: 'Steroid'}) \
// CREATE (d:drug {name: 'Prednisone'}) \
// CREATE (a)-[:HAS_DISEASE]->(b) \
// CREATE (b)-[:TREATED_BY_CLASS]->(c) \
// CREATE (d)-[:BELONGS_TO_CLASS]->(c)"

// let session = driver.session();
// let resultPromise = session.writeTransaction(tx => {
// //   let query = "CREATE (a:patient)";
// //   for (let key in patient) {
// //     query += ` SET a.${key} = $${key}`;
// //   }
// //   query += " RETURN a";

// //   tx.run(query, patient);
// tx.run(query);
// });
// resultPromise.then(result => {
//   session.close();
// });

// driver.close();
// // })
