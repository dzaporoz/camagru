var LoadedImgs = 0;

if( document.readyState !== 'loading' ) {
  initializeFeed()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initializeFeed();
  });
}

function initializeFeed() {
//  document.addEventListener('click', likeFunction (event));
  document.addEventListener('scroll', function (event) {
    var scroll = document.body.scrollTop || window.scrollY;
    if (document.body.scrollHeight -
        scroll - window.innerHeight < 500) {
        loadFeed();
    }
  /*  alert('document.body.scrollHeight: '+document.body.scrollHeight+'\n'+
    'document.body.scrollTop: '+scroll+'\n'+
    'window.innerHeight: '+window.innerHeight);
    */
});
loadFeed();  
}

function likeFunction (event)
{
  event = event || window.event;
  //var target = event.target || event.srcElement;
  alert(event);
}

function loadFeed() {
  if (LoadedImgs < 0) { return; }
  var loadIcon = document.querySelector('#feedLoad'),
  xhr = new XMLHttpRequest(),
  params = 'action=loadFeed&img_num=' + LoadedImgs;
  loadIcon.style.display = "block";
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == 4 && xhr.status == 200) {
      var feed = document.querySelector('#feed'),
      response = xhr.responseText;
      if (response == "") {
        LoadedImgs = -1;
        loadIcon.style.display = "none";
        return;
      }
      LoadedImgs += parseInt(response);
      response = response.substring(response.indexOf("<"));
      feed.innerHTML = feed.innerHTML + response;  
      //alert(xhr.responseText);
      loadIcon.style.display = "none";
    }
  }
  xhr.send(params);
}




function prepareVideo() {
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

navigator.mediaDevices.getUserMedia({ audio: false, video: true })
.then(function(stream) {
  var video = document.querySelector('video');
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
    document.querySelector('canvas').style.display = "none";
    document.querySelector('#photoBtn').style.display = "block";
    document.querySelector('#loadBtn').style.display = "block";
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

document.getElementById("photoBtn").addEventListener("click", takePhoto);
document.getElementById("cancelBtn").addEventListener("click", cancelPhoto);
document.getElementById("okBtn").addEventListener("click", post);
document.querySelector("input[type=file]").addEventListener("change", loadPhoto);
}




// function prepareVideo() {
//   var videoObj    = { "video": {
//     width: { min: 1024, ideal: 1280, max: 1920 },
//     height: { min: 776, ideal: 720, max: 1080 },} 
//   },
//     errBack        = function(error){
//       alert("Your browser doesn't support use of webcam. You can upload an image. Error: ", error.code);
//     };
//   if (navigator.MediaDevices.getUserMedia) {
//     navigator.MediaDevices.getUserMedia(videoObj, startWebcam, errBack);
//   }else if(navigator.getUserMedia){                    // Standard
//     navigator.getUserMedia(videoObj, startWebcam, errBack);
//   }else if(navigator.webkitGetUserMedia){        // WebKit
//     navigator.webkitGetUserMedia(videoObj, startWebcam, errBack);
//   }else if(navigator.mozGetUserMedia){        // Firefox
//     navigator.mozGetUserMedia(videoObj, startWebcam, errBack);
//   };
//   document.getElementById("photoBtn").addEventListener("click", takePhoto);
// }

function takePhoto(){

  var hidden_canvas = document.querySelector('canvas'),
      video = document.querySelector('video'),

      // Get the exact size of the video element.
      width = video.videoWidth,
      height = video.videoHeight,

      // Context object for working with the canvas.
      context = hidden_canvas.getContext('2d');

  // Set the canvas to the same dimensions as the video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;

  // Draw a copy of the current frame from the video on the canvas.
  context.drawImage(video, 0, 0, width, height);

  // Get an image dataURL from the canvas.

  video.style.display = "none";
  document.querySelector('#photoBtn').style.display = "none";
  document.querySelector('#loadBtn').style.display = "none";
  document.querySelector('canvas').style.display = "block";
  document.querySelector('#okBtn').style.display = "block";
  document.querySelector('#cancelBtn').style.display = "block";
}

function loadPhoto() {
  var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d"),  
      file = document.querySelector('input[type=file]').files[0],
      reader = new FileReader(),
      tempImg = new Image();
  tempImg.onload = function() {
    canvas.width = 1024;
    canvas.height = 768;
    var canvAsRatio = canvas.width / canvas.height,
        imgAsRatio = tempImg.width / tempImg.height,
        x, y, finalHeight, finalWidth;
    if (imgAsRatio < canvAsRatio) {
      finalHeight = canvas.height;
      finalWidth = tempImg.width * (finalHeight / tempImg.height);
      x = (canvas.width - finalWidth) / 2
      y = 0;
    } else if (imgAsRatio > canvAsRatio) {
      finalWidth = canvas.width;
      finalHeight = tempImg.height * (finalWidth / tempImg.width);
      x = 0;
      y = (canvas.height - finalHeight) / 2;
    } else {
      x = 0;
      y = 0;
      finalHeight = canvas.height;
      finalWidth = canvas.width;
    }
    context.drawImage(tempImg, x, y, finalWidth, finalHeight);
  };    

  // when user select an image, `reader.readAsDataURL(file)` will be triggered
  // reader instance will hold the result (base64) data
  // next, event listener will be triggered and we call `reader.result` to get
  // the base64 data and replace it with the image tag src attribute
  reader.addEventListener("load", function() {
    document.querySelector("video").style.display = "none";
    document.querySelector('canvas').style.display = "block";
    document.querySelector('#photoBtn').style.display = "none";
    document.querySelector('#loadBtn').style.display = "none";
    document.querySelector('#okBtn').style.display = "block";
    document.querySelector('#cancelBtn').style.display = "block";
    tempImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  } else {
    errorMsg('An error has occurred. Wrong file.');
  }
}

function cancelPhoto() {
  document.querySelector('video').style.display = "block";
  document.querySelector('#photoBtn').style.display = "block";
  document.querySelector('#loadBtn').style.display = "block";
  document.querySelector('#okBtn').style.display = "none";
  document.querySelector('#cancelBtn').style.display = "none";
  document.querySelector('canvas').style.display = "none";
}

function post() {
  var canvas = document.querySelector("canvas");
  var dataURL = canvas.toDataURL("image/png");
  document.getElementById('hidden_data').value = dataURL;
  var fd = new FormData(document.forms["uploading-form"]);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200 && xhr.responseText == 'ok') {
      window.location.href = '/';
      } else {
        errorMsg('An error has occurred. Please try again.');
        /*
        msgBox = document.getElementById("msg");
        msgBox.innerHTML = "An error has occurred. Please try again.";
        msgBox.className = "err-msg";
        msgBox.style.display = "block";
        cancelPhoto();*/
      }
    }
  };
  xhr.open('POST', '/photo/load', true);
  xhr.send(fd);
};

function errorMsg(msgString) {
  msgBox = document.getElementById("msg");
  msgBox.innerHTML = msgString;
  msgBox.className = "err-msg";
  msgBox.style.display = "block";
  cancelPhoto();
}