const express = require('express')
const morgan = require('morgan');


const router = require('./router')

const app = express()


app.use(express.json())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

router(app)


module.exports = app


