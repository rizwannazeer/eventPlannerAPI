const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const db = require( "./db");

db.initDb();
const app = express()
var jsonParser = bodyParser.json()

app.use(jsonParser)
app.use(cors());

const port = process.env.PORT || 8080

app.use('/auth', require('./routes/auth'));
app.use('/services', require('./routes/services'));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
