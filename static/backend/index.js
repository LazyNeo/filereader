var express = require('express')
var app = express()
const Sequelize = require('sequelize');
const sequelize = new Sequelize('o2o', 'm6shake', 'm6shake', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
})
app.get('/', function (req, res) {
  sequelize
  .query('SELECT * FROM `m6_config`', { raw: true })
  .then(projects => {
    // Each record will now be mapped to the project's model.
    console.log(projects)
    res.send(projects)
  })
  // res.send('Hello Wo222rld!')
})

var server = app.listen(3009, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})