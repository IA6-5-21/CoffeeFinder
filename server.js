var http = require('http');
const express = require('express')
const app = express()
var server = http.createServer(app);
const port = 3000
var fetch = require('node-fetch');
const { json } = require('express');


let val;
let fastai = "";
let opencv = "";
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send()
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  //console.log(req.body)
  sendApi(req.body)
  res.send(opencv);
  //res.send(fastai);
  //res.end();

})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// FastAI = Http.open('POST','http://20.82.252.29/fastai/predict',true);
// OpenCV = http://roger.northeurope.azurecontainer.io/opencv/predict

// function sendApi(body) {
//   console.log("This is body: " + body.name)
//   fetch('http://localhost:5000/opencv/predict',
//     {
//       method: 'POST',
//       body: JSON.stringify(body),
//       headers: { 'Constant-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     //.then(json => setVal(json));
//     .then(json => console.log("This is json: " + json));

// }

// function setVal(json) {
//   val = json
// }

function sendApi(body) {

  Promise.all([
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
        //console.log(responses);
        return response.json();

      }));
    })
    .then(function (data) {
      fastai = data[1];
      opencv = JSON.stringify(data[0]);
      console.log("This is opencv: " + data[0]["name"]);
      console.log("This is fastai: " + data[1]["name"]);
    })
    .catch(function (error) {
      console.log(error);
    });

}