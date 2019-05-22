var error = false;

if( document.readyState !== 'loading' ) {
  prepareVideo();
} else {
  document.addEventListener('DOMContentLoaded', function () {
      prepareVideo();
  });
}

function prepareVideo() {
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

navigator.mediaDevices.getUserMedia({ audio: false, video: true })
.then(function(stream) {
  var video = document.querySelector('video');
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
  changeInterface(true);
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
  error = true;
  changeInterface(true);
});

document.getElementById("photoBtn").addEventListener("click", takePhoto);
document.getElementById("cancelBtn").addEventListener("click", cancelPhoto);
document.getElementById("okBtn").addEventListener("click", post);
document.querySelector("input[type=file]").addEventListener("change", loadPhoto);

}

function takePhoto(){
  var hidden_canvas = document.querySelector('canvas'),
      video = document.querySelector('video'),
      width = video.videoWidth,
      height = video.videoHeight,
      context = hidden_canvas.getContext('2d');
  hidden_canvas.width = width;
  hidden_canvas.height = height;
  context.drawImage(video, 0, 0, width, height);
  changeInterface(false);
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
      finalWidth = canvas.width;
      finalHeight = tempImg.height * (finalWidth / tempImg.width);
      x = 0;
      y = (canvas.height - finalHeight) / 2;
    } else if (imgAsRatio > canvAsRatio) {
      finalHeight = canvas.height;
      finalWidth = tempImg.width * (finalHeight / tempImg.height);
      y = 0;
      x = (canvas.width - finalWidth) / 2;
    } else {
      x = 0;
      y = 0;
      finalHeight = canvas.height;
      finalWidth = canvas.width;
    }
    context.drawImage(tempImg, x, y, finalWidth, finalHeight);
  };    

  reader.addEventListener("load", function() {
    changeInterface(false);
    tempImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  } else {
    errorMsg('An error has occurred. Wrong file.');
  }
}

function cancelPhoto() {
  changeInterface(true);
}

function changeInterface(toVideoScreen) {
  if (toVideoScreen) {
    if (!error) {
      document.querySelector('video').style.display = "block";
      document.querySelector('#photoBtn').style.display = "block";
    } else {
      document.querySelector('#video-error').style.display = "block";  
      document.querySelector('video').style.display = "none";
      document.querySelector('#photoBtn').style.display = "none";
    }
    document.querySelector('#loadBtn').style.display = "block";
    document.querySelector('#okBtn').style.display = "none";
    document.querySelector('#cancelBtn').style.display = "none";
    document.querySelector('canvas').style.display = "none";
  } else {
    document.querySelector('#photoBtn').style.display = "none";
    document.querySelector('#loadBtn').style.display = "none";
    document.querySelector('video').style.display = "none";
    document.querySelector('#video-error').style.display = "none";
    document.querySelector('canvas').style.display = "block";
    document.querySelector('#okBtn').style.display = "block";
    document.querySelector('#cancelBtn').style.display = "block";
  }
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
        errorMsg(xhr.responseText);
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
  changeInterface(true);
}