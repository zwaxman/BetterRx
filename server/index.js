const express = require('express')
const app = express()
const path = require('path')
const driver = require('./db/db')
// const neo4j = require("neo4j-driver");
// const driver = neo4j.default.driver(
//   "bolt://localhost:7687",
//   neo4j.default.auth.basic("neo4j", "BetterRx")
// );


app.use(require('morgan')('dev'))

app.use(express.static(path.join(__dirname,'..','public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./api'))

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname,'..','index.html'))
})

app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    try {
        console.log(`App listening on port ${port}`)
    } catch (error) {
        
    }
})