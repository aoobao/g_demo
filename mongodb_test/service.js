const express = require('express')
const mongoose = require('mongoose')

const DB_URL = 'mongodb://new.fengtengfei.cn:27017/test'

mongoose.connect(DB_URL)
mongoose.connection.on('connected', function () {
  console.log('mongo connect success')
});

const app = express();

app.get('/', function (req, res) {
  res.send('<h1>hello</h1>');
})

app.listen(9000, function () {
  console.log('express start port 9000')
})