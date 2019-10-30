const express = require('express')
const router = express.Router()

router.use('/:node1/:node1Id/:node2/:node2Id', require('./rel'))

router.use('/patients', require('./patients'))

router.use('/problems', require('./problems'))

router.use('/medClasses', require('./medClasses'))

router.use('/meds', require('./meds'))

router.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

module.exports = router