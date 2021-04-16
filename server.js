var http = require('http');
const express = require('express')
const app = express()
var server = http.createServer(app);
const port = 3000
var fetch = require('node-fetch');
const { json } = require('express');

let val;
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send()
})
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
//console.log(req.body)
sendApi(req.body)
console.log(val)
res.send(val)
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


  // Http.open('POST','http://20.82.252.29/fastai/predict',true);

function sendApi(body){  
  fetch('http://roger.northeurope.azurecontainer.io/opencv/predict',
    {
      
      method:'post',
      body:JSON.stringify(body),
      headers:{'Constant-Type':'application/json'},
    })
      .then(res => res.json())
      .then(json => setVal(json));
    
    }
function setVal(json){
  val=json
}
