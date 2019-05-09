if( document.readyState !== 'loading' ) {
  prepareVideo();
} else {
  document.addEventListener('DOMContentLoaded', function () {
      prepareVideo();
  });
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
    document.querySelector('#snapShot').style.display = "none";
    document.querySelector('#photoBtn').style.display = "block";
    document.querySelector('#loadBtn').style.display = "block";
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

document.getElementById("photoBtn").addEventListener("click", takePhoto);
document.getElementById("cancelBtn").addEventListener("click", cancelPhoto);
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
      image = document.querySelector('#snapShot'),

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
  document.querySelector('#snapShot').style.display = "block";
  document.querySelector('#okBtn').style.display = "block";
  document.querySelector('#cancelBtn').style.display = "block";
  var imageDataURL = hidden_canvas.toDataURL('image/png');

  // Set the dataURL as source of an image element, showing the captured photo.
  image.setAttribute('src', imageDataURL); 
}

function loadPhoto() {
  var preview = document.querySelector('#snapShot');
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader();

  // when user select an image, `reader.readAsDataURL(file)` will be triggered
  // reader instance will hold the result (base64) data
  // next, event listener will be triggered and we call `reader.result` to get
  // the base64 data and replace it with the image tag src attribute
  reader.addEventListener("load", function() {
    document.querySelector("video").style.display = "none";
    document.querySelector('#snapShot').style.display = "block";
    document.querySelector('#photoBtn').style.display = "none";
    document.querySelector('#loadBtn').style.display = "none";
    document.querySelector('#okBtn').style.display = "block";
    document.querySelector('#cancelBtn').style.display = "block";
    preview.src = reader.result;
  }, false);

  if (file) {
    console.log('inside if');
    reader.readAsDataURL(file);
  } else {
    console.log('inside else');



//   var reader = new FileReader();
//  reader.onload = function()
//  {
//   var output = document.getElementById('snapShot');

//   video.style.display = "none";
//   document.querySelector('#photoBtn').style.display = "none";
//   document.querySelector('#loadBtn').style.display = "none";
//   document.querySelector('#okBtn').style.display = "inline";
//   document.querySelector('#cancelBtn').style.display = "inline";

//   output.src = reader.result;
//  }
//  reader.readAsDataURL(event.target.files[0]);
}
}

function cancelPhoto() {
  document.querySelector('#snapShot').src = "";
  document.querySelector('video').style.display = "block";
  document.querySelector('#photoBtn').style.display = "block";
  document.querySelector('#loadBtn').style.display = "block";
  document.querySelector('#okBtn').style.display = "none";
  document.querySelector('#cancelBtn').style.display = "none";
  document.querySelector('#snapShot').style.display = "none";
}