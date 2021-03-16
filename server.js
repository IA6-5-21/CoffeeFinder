var http = require('http');
const express = require('express')
const app = express()
var server = http.createServer(app);
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send()
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})