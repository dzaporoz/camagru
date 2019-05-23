var error = false,
image = new Image(),
frame = new Image(),
onlay = new Image();

frame.setAttribute('is-visible', 'false');
image.onload = function() { renderPhoto(); };
frame.onload = function() { renderPhoto(); };
onlay.onload = function() { renderPhoto(); };

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
document.addEventListener('click', function (event) {
  if (event.target.className.match(/(?:^|\s)frame(?!\S)/)) {
    applyFrame(event.target); 
  }
});
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
  removeFrame();
  image.src = hidden_canvas.toDataURL("image/png");
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
    removeFrame();
    image.src = canvas.toDataURL("image/png");
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

function removeFrame() {
  frame.setAttribute('is-visible', 'false');
}

function applyFrame(element) {
  if (element.id == "no-frame") {
    removeFrame();
    renderPhoto();
  } else {
    frame.setAttribute('is-visible', 'true');
    var style = element.currentStyle || window.getComputedStyle(element, false),
      bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
      bi = bi.replace(/preview\// , "");
    frame.src = bi;
  }
}

function renderPhoto() {
  var canvas = document.querySelector('canvas'),
  context = canvas.getContext("2d"),
  width = canvas.width, height = canvas.height,
  startX, startY, endX, endY;

  if (frame.getAttribute('is-visible') == 'true') {
    startX = width * 0.07;
    startY = width * 0.07;
    endX = width - startX * 2;
    endY = height * (endX / width);
    /*
    endX = width - 50;
    endY = height - 50;
*/
  } else {
    startX = startY = 0;
    endX = width;
    endY = height;
  }
  alert('width - ' + width + ' height - ' + height +
  '\nsX - ' + startX + '  sY - ' + startY +
  '\neX - ' + endX + '  eY - ' + endY +
  '\n frame - ' + frame.src);

  context.drawImage(image, startX, startY, endX, endY);
  if (onlay.src) {
    context.drawImage(onlay, 0, 0, width, height);
  }
  if (frame.getAttribute('is-visible') == 'true') {
    context.drawImage(frame, 0, 0, width, height);
  }
}

function cancelPhoto() {
  onlay.src="";
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
    document.querySelector('#frames').style.visibility = "hidden";
  } else {
    document.querySelector('#photoBtn').style.display = "none";
    document.querySelector('#loadBtn').style.display = "none";
    document.querySelector('video').style.display = "none";
    document.querySelector('#video-error').style.display = "none";
    document.querySelector('canvas').style.display = "block";
    document.querySelector('#okBtn').style.display = "block";
    document.querySelector('#cancelBtn').style.display = "block";
    document.querySelector('#frames').style.visibility = "visible";
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