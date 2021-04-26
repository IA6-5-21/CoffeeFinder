window.addEventListener("DOMContentLoaded", function() {
    const snap = document.getElementById("snap");
    const canvas = document.getElementById('canvas');
    const canvasFastAI = document.getElementById('returnPicNew');
    const canvasOpenCV = document.getElementById('returnPicCv');
    const video = document.getElementById('video');
    const errorMsgElement = document.querySelector('span#errorMsg');
           
    var incomming = new DataVariableClass();
    //Defining a unique http-data handler for both opencv and fastai 
    const HttpFastai = new XMLHttpRequest();     
    const HttpOpenCv = new XMLHttpRequest();

    const constraints = {
        audio: false,
        video: {
            width: 400,
            height: 300
        }
    };

    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccsess(stream);
        } catch (e) {
            errorMsgElement.innerHTML = "navigator.getUserMedia error:" + e.toString();
        }
    }

    function sendPic(d) {
        var msg = `${encodeURIComponent(d)}`;
        var myobj = { "name": "Webpage", "image": d };
        var tmptxt = JSON.stringify(myobj)
        
        //XMLHttpRequest for opencv
        HttpOpenCv.open('POST', 'https://20.73.201.64/opencv/predict', true);
        HttpOpenCv.setRequestHeader('Content-type', 'application/json');
        
        HttpOpenCv.onload = function () {
            console.log("OPENCV: Certificate accepted OK");
        };
        HttpOpenCv.onerror = function () {
            console.log("OPENCV: Validation error  - Certificate");
             document.getElementById('returnMsg').innerHTML = "Certificate error: <br> Visit <a href='https://52.142.127.98/' target = '_blank'>https://52.142.127.98/</a>";
        };
        HttpOpenCv.send(tmptxt);
        //XMLHttpRequest for fastai
        HttpFastai.open('POST', 'https://20.73.201.64/fastai/predict', true);
        HttpFastai.setRequestHeader('Content-type', 'application/json');

        HttpFastai.onload = function () {
            console.log("FASTAI: Certificate accepted OK");
        };
        HttpFastai.onerror = function () {
            console.log("FASTAI: Validation error  - Certificate");
             document.getElementById('returnMsg').innerHTML = "Certificate error: <br> Visit <a href='https://52.142.127.98/' target = '_blank'>https://52.142.127.98/</a>";

        };
        HttpFastai.send(tmptxt);
    } 
    //Handler for fastai XMLHttpRequest 
    HttpFastai.onreadystatechange = () => {
        if (HttpFastai.readyState === XMLHttpRequest.DONE) {
            var status = HttpFastai.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                var encoded1 = HttpFastai.responseText;
                handledata(encoded1);  // Send jsondata to datahandler function
            }
            else {
                document.getElementById('returnPicNew').innerHTML = "Error! Statuscode:  " + status;
                console.log("Error! Statuscode:  " + status)
               
            }
        }
    }
    //Handler for opencv XMLHttpRequest 
    HttpOpenCv.onreadystatechange = () => {
        if (HttpOpenCv.readyState === XMLHttpRequest.DONE) {
            var status = HttpOpenCv.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                var encoded2 = HttpOpenCv.responseText;                
                handledata(encoded2); // Send jsondata to datahandler function
            }
            else {
                document.getElementById('returnPicNew').innerHTML = "Error! Statuscode:  " + status;
                console.log("Error! Statuscode:  " + status)
            }
        }
    }
    //prediction data handler input: jsondata
    function handledata(encoded){
         
        var jsonObject = JSON.parse(encoded);
        var element = jsonObject;
        incomming.Image = element.image;

        if (incomming.Image) {
            Base64ToImage(incomming.Image, function(img) {
                var element = jsonObject;
                incomming.Image = element.image;
                incomming.Name = element.name;
                incomming.Level = element.level;
                var fastainame = "fastai";
                var opencvname = "opencv";
                var canvasid = "";

                if (incomming.Name == fastainame) {
                    canvasid = "returnPicNew"
                    document.getElementById('returnMsg').innerHTML = "The level in the tank is: " + incomming.Level + "%";
                } else if (incomming.Name == opencvname) {
                    canvasid = "returnPicCv"
                    document.getElementById('returnMsgCV').innerHTML = "The level in the tank is: " + incomming.Level + "%";
                }

                var resultCanvas = document.getElementById(canvasid);
                resultContext = resultCanvas.getContext('2d');
                resultContext.drawImage(img, 0, 0, 400, 300);                    
            });
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
    function handleSuccsess(stream) {
        window.stream = stream;
        video.srcObject = stream;
    }
    //load init
    init();

    // Draw Image
    var context = canvas.getContext('2d');
    var contextFastAI = canvasFastAI.getContext('2d');
    var contextOpenCV = canvasOpenCV.getContext('2d');
    snap.addEventListener("click", param => {
        document.getElementById('returnMsg').innerHTML = "Calculating level... ";
        document.getElementById('returnMsgCV').innerHTML = "Calculating level... ";
        contextFastAI.clearRect(0, 0, canvasFastAI.width, canvasFastAI.height);
        contextOpenCV.clearRect(0, 0, canvasOpenCV.width, canvasOpenCV.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, 400, 300);
        var d = canvas.toDataURL("image/png");
        sendPic(d);
    });
});
class DataVariableClass {
    static Image;
    static Name;
    static Level;
}