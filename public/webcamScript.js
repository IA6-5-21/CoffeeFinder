window.addEventListener("DOMContentLoaded", function() {
    const snap = document.getElementById("snap");
    const canvas = document.getElementById('canvas');
    const canvasFastAI = document.getElementById('returnPicNew');
    const canvasOpenCV = document.getElementById('returnPicCv');
    const video = document.getElementById('video');
    const errorMsgElement = document.querySelector('span#errorMsg');
    const Http = new XMLHttpRequest();
    var incomming = new DataVariableClass();

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
        Http.open('POST', '/', true);
        Http.setRequestHeader('Content-type', 'application/json');
        var tmptxt = JSON.stringify(myobj)
        Http.send(tmptxt);
    }

    Http.onreadystatechange = () => {
        if (Http.readyState === XMLHttpRequest.DONE) {
            var status = Http.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                var encoded = Http.responseText;
                var jsonObject = JSON.parse(encoded);
                for (let i = 1; i >= 0; i--) {
                    var element = jsonObject[i]
                    incomming.Image = element.image;
                    // incomming.Name = element.name;
                    // incomming.Level = element.level;

                    if (incomming.Image) {
                        Base64ToImage(incomming.Image, function(img) {
                            var element = jsonObject[i]
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
                            // incomming.Image = null;
                            // incomming.Name = null;
                            // incomming.Level = null;
                        });
                    }
                }
            } else {
                document.getElementById('returnPicNew').innerHTML = "Error! Statuscode:  " + status;
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