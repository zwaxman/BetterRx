const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

module.exports = router