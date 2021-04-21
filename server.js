var http = require('http');
const express = require('express')
const app = express()
var server = http.createServer(app);
const port = 3000
var fetch = require('node-fetch');
const { json } = require('express');
const { read } = require('fs');

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.send()
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  sendApi(req.body, (a) => {
    res.send(a)
  })
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sendApi(body, callback) {
  var test = Promise.all([
    fetch('http://0.0.0.0:8080/opencv/predict', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Constant-Type': 'application/json' },
    }),
    fetch('http://0.0.0.0:8080/fastai/predict', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Constant-Type': 'application/json' },
    })
  ])
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    })
    .then(function (data) {
      console.log("Level OpenCv: " + data[0]["level"] + "%");
      console.log("Level FastAi: " + data[1]["level"] + "%");
      console.log("-------------------")
      callback(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
