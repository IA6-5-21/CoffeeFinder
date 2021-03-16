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
            width: 128, height: 96
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
        var newMsg = 'name=testing';
        var msg = `${encodeURIComponent(d)}`;
        var myobj = {name:"This data was sendt to the function, this is a return loop",image:d};
        // POST TO SELF
        //Http.open('POST','/',true);
        
        // THIS IS FOR LOCAL TESTING!!!!
        Http.open('POST','http://localhost:7071/api/pythonHttpTrigger',true);
        // THIS IS FOR DEPLOYMENT - ONLINE TERSING
        //Http.open('POST','https://coffeetestfunction.azurewebsites.net/api/HttpTrigger_test',true);        
        
        Http.setRequestHeader('Content-type', 'application/json');
        var tmptxt = JSON.stringify(myobj)
        Http.send(tmptxt);         

    }
    Http.onreadystatechange = (e) => {
        console.log('Response:')
        console.log(Http.responseText)
        
        if (Http.readyState === XMLHttpRequest.DONE){
            var status = Http.status;
            if (status === 0 || (status >=200 && status <400)){
                
                var encoded = Http.responseText;
                var jsonObject = JSON.parse(encoded)
                var incommingImage = jsonObject.image;
                var incommingName = jsonObject.name;
                
                document.getElementById('returnMsg').innerHTML = incommingName;
                if (incommingImage){
                    Base64ToImage(incommingImage,function(img){
                        document.getElementById('returnPicNew').innerHTML = "";
                        document.getElementById('returnPicNew').appendChild(img);
                    
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
        //context.drawImage(video,0,0, 128, 96);
        context.drawImage(video,0,0, 128,96);
        var d = canvas.toDataURL("image/png");
        sendPic(d);
        });
});
        