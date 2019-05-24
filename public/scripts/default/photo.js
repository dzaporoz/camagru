var error = false,
image = new Image(),
frame = new Image(),
onlay = new Image();

frame.setAttribute('is-visible', 'false');
onlay.setAttribute('is-visible', 'false');
image.onload = function() { renderPhoto(); };
frame.onload = function() { renderPhoto(); };
onlay.onload = function() { renderPhoto(); };

if (document.readyState !== 'loading') {
  prepareScripts();
} else {
  document.addEventListener('DOMContentLoaded', prepareScripts);
}

function prepareScripts() {
  launchVideo();

  document.querySelector("input[type=file]").addEventListener("change", loadPhoto);
  document.addEventListener('click', function (event) {
    if (event.target.id == 'photoBtn') {
      getImageData(document.querySelector('video'));
      changeInterface(false);
    } else if (event.target.id == 'cancelBtn') {
      changeInterface(true); 
    } else if (event.target.id == 'okBtn') {
      post(); 
    } else if (event.target.className.match(/(?:^|\s)frame(?!\S)/)) {
      applyFrame(event.target); 
    } else if (event.target.className.match(/(?:^|\s)onlay(?!\S)/)) {
      applyOnlay(event.target); 
    }
  });
}

function launchVideo() {
  if (navigator.mediaDevices === undefined) { navigator.mediaDevices = {}; }
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
}


function getImageData(source) {
  var canvas = document.querySelector('canvas'),
  context = canvas.getContext('2d'),
  sourceWidth, sourceHeight;

  if (source.tagName == 'VIDEO') {
    sourceWidth = source.videoWidth;
    sourceHeight = source.videoHeight;
  } else {
    sourceWidth = source.width;
    sourceHeight = source.height;
  }

  canvas.width = 1024;
  canvas.height = 768;
  var canvasRatio = canvas.width / canvas.height,
      contentRatio = sourceWidth / sourceHeight,
      x, y, finalHeight, finalWidth;
    if (contentRatio < canvasRatio) {
      finalWidth = canvas.width;
      finalHeight = sourceHeight * (finalWidth / sourceWidth);
      x = 0;
      y = (canvas.height - finalHeight) / 2;
    } else if (contentRatio > canvasRatio) {
      finalHeight = canvas.height;
      finalWidth = sourceWidth * (finalHeight / sourceHeight);
      y = 0;
      x = (canvas.width - finalWidth) / 2;
    } else {
      x = 0;
      y = 0;
      finalHeight = canvas.height;
      finalWidth = canvas.width;
    }

    context.drawImage(source, x, y, finalWidth, finalHeight);
    image.src = canvas.toDataURL("image/png");
}

function loadPhoto() {
  var file = document.querySelector('input[type=file]').files[0],
      reader = new FileReader(),
      tempImg = new Image();
  
  tempImg.onload = function() {
    getImageData(tempImg);
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

function applyOnlay(element) {
  if (element.id == "no-onlay") {
    onlay.setAttribute('is-visible', 'false');
    renderPhoto();
  } else {
    onlay.setAttribute('is-visible', 'true');
    var style = element.currentStyle || window.getComputedStyle(element, false),
      bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
    onlay.src = bi;
  }
}

function applyFrame(element) {
  if (element.id == "no-frame") {
    frame.setAttribute('is-visible', 'false');
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
  width = 1024, height = 768,
  startX, startY, endX, endY;

  canvas.width = width;
  canvas.height = height;

  if (frame.getAttribute('is-visible') == 'true') {
    startX = width * 0.07;
    startY = width * 0.07;
    endX = width - startX * 2;
    endY = height * (endX / width);
  } else {
    startX = startY = 0;
    endX = width;
    endY = height;
  }
  context.drawImage(image, startX, startY, endX, endY);
  
  if (onlay.getAttribute('is-visible') == 'true') {

    alert('onlWidth - '+onlay.width+
    '\nonlHeig - '+onlay.height+
    '\nonlMult -' + (canvas.width * 0.4) / onlay.width +
    'onlWidth - '+onlay.width * (canvas.width * 0.4) / onlay.width +
    '\nonlHeig - '+onlay.height * (canvas.width * 0.4) / onlay.width);
    
    var onlayMult = (canvas.width * 0.4) / onlay.width;
    onlay.width *= onlayMult;
    onlay.height *= onlayMult; 
    onlayX = Math.random() * (+(endX - onlay.width) - +startX) + +startX;
    onlayY = Math.random() * (+(endY - onlay.height) - +startY) + +startY;

    alert('onlWidth - '+onlay.width+
    '\nonlHeig - '+onlay.height+
    '\nonlX - '+onlayX+
    '\nonlY - '+onlayY+
    '\nendX -' +endX+
    '\nendY -' +endY);

    context.drawImage(onlay, onlayX, onlayY, onlay.width + onlayX, onlayY + onlay.height );
  }
  if (frame.getAttribute('is-visible') == 'true') {
    context.drawImage(frame, 0, 0, width, height);
  }
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
    document.querySelector('#onlays').style.visibility = "hidden";
    document.querySelector('#description').style.display = "none";
  } else {
    frame.setAttribute('is-visible', 'false');
    document.querySelector('#photoBtn').style.display = "none";
    document.querySelector('#loadBtn').style.display = "none";
    document.querySelector('video').style.display = "none";
    document.querySelector('#video-error').style.display = "none";
    document.querySelector('canvas').style.display = "block";
    document.querySelector('#okBtn').style.display = "block";
    document.querySelector('#cancelBtn').style.display = "block";
    document.querySelector('#frames').style.visibility = "visible";
    document.querySelector('#onlays').style.visibility = "visible";
    document.querySelector('#description').style.display = "block";
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