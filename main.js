'use strict'

const logger = require('console-files')
const sqlite = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const { ecomAuth, setup } = require('ecomplus-app-sdk')
const express = require('express')
const app = express()
const port = process.env.PORT || 4222
setup('/var/dbs/ses.sqlite')
const db = new sqlite.Database(process.env.ECOM_AUTH_DB)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./lib/routes')({ ecomAuth, db }))

app.listen(port)
logger.log(`--> Starting web app on port :${port}`)

// daemon processes
// prevent running background process on multiple servers
if (process.env.SCHEDULED_DEPLOYS === 'true' || process.env.SCHEDULED_DEPLOYS === true) {
  require('./lib/services/cart-is-abandoned')({ ecomAuth, db })
  require('./lib/services/setup-procedures')
}
