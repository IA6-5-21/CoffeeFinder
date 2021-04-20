window.addEventListener("DOMContentLoaded", function() {
    
    
    const snap = document.getElementById("snap");
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    const errorMsgElement = document.querySelector('span#errorMsg');
    //const returnPic = document.getElementById('returnPic');  
    //var video = document.querySelector("#videoElement");

    const Http = new XMLHttpRequest();
    
    
    const constraints = {
        audio: false,
        video: {
            width: 400, height: 300
        }
    };
    
    async function init(){
        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccsess(stream);
        }   catch(e){
            errorMsgElement.innerHTML ="navigator.getUserMedia error:"+ e.toString();
        }
    }
    
    function sendPic(d){
        var msg = `${encodeURIComponent(d)}`;
        var myobj = {"name":"eirik","image":d};
        //var myobj = {"name":"eirik"};
        // POST TO SELF
        //Http.open('POST','/',true);
        // THIS IS FOR LOCAL TESTING!!!!
        //Http.open('POST','http://localhost:7071/api/pythonHttpTrigger',true);//for azurefunction localy
        //Http.open('POST','http://20.82.252.29/fastai/predict',true);
        Http.open('POST','http://localhost:3000',true);
        // THIS IS FOR DEPLOYMENT - ONLINE TERSING
        //Http.open('POST','https://coffeetestfunction.azurewebsites.net/api/HttpTrigger_test',true);        
        
        Http.setRequestHeader('Content-type', 'application/json');
        var tmptxt = JSON.stringify(myobj)
        Http.send(tmptxt);         
    
    }
    Http.onreadystatechange = () => {
        //console.log('Response:')
        //console.log(Http.responseText)
        
        if (Http.readyState === XMLHttpRequest.DONE){
            var status = Http.status;
            if (status === 0 || (status >=200 && status <400)){
                
                var encoded = Http.responseText;
                var jsonObject = JSON.parse(encoded)
                var incommingImage = jsonObject.image;
                var incommingName = jsonObject.name;
                var incommingLevel= jsonObject.level;
                
                if (incommingImage){
                    Base64ToImage(incommingImage,function(img){
                        var fastainame = "fastai";
                        var opencvname = "opencv";
                        var canvasid = "";
                       if(incommingName == fastainame)
                       {
                           canvasid = "returnPicNew"
                           document.getElementById('returnMsg').innerHTML = "The level in the tank is:" + incommingLevel;
                       }
                       else if(incommingName == opencvname){
                           canvasid = "returnPicCv"
                           document.getElementById('returnMsgCV').innerHTML = "The level in the tank is:" + incommingLevel;
                       }
                        //document.getElementById('returnPicNew').innerHTML = "";
                        //document.getElementById('returnPicNew').appendChild(img);
                        var canvas = document.getElementById(canvasid);
                        context = canvas.getContext('2d');
                        context.drawImage(img,0,0,400,300);
                        incommingImage = null;
                        incommingName = null;
                        incommingLevel = null;
                    //  OLD Method
                    //var tmpImg = new Image();
                    //tmpImg.src = encoded;
                    //var context = returnPic.getContext('2d');
                    //var base64Data = encoded.replace(/^data:image\/png;base64,/, "");
                    //context.drawImage(tmpImg, 0, 0, 640, 480);                     
                    });
                }
            }
            else {
                document.getElementById('returnPicNew').innerHTML = "Error! Statuscode:  " + status ;
                console.log("Error! Statuscode:  " + status)
            }
        }
    }    
    function Base64ToImage(base64img, callback) {
        var img = new Image();        
        img.onload = function() {

            callback(img);
        };
        img.src = base64img;
    }
    
    //Success
    function handleSuccsess(stream){
        window.stream = stream;
        video.srcObject = stream;
        
        
    }
    
    //load init
    init();
    

    // Draw Image
    var context = canvas.getContext('2d');
    snap.addEventListener("click", param => {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(video,0,0,400,300);
        var d = canvas.toDataURL("image/png");
        sendPic(d);
        // var img = new Image(); //midlertidig
        // img.src = '95.jpg';
        // img.onload = function(){context.drawImage(img,0,0,400,300);}
        // var f = canvas.toDataURL("image/jpeg");
        // console.log(f)
        // sendPic(f)
        });
});
        