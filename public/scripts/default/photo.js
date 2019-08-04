function $(x) {return document.getElementById(x);}

let error = false,
image = new Image(),
frame = new Image(),
onlay = new Image(),
isDraggable = false,
onlayCanvas,
onlayContext,
onlayScale = 1,
currentX = 0,
currentY = 0,
frameURL, onlayURL;

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

  onlayCanvas = document.querySelector('#onlay-canvas');
  onlayContext = onlayCanvas.getContext('2d');
  $('description').value = "";

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
      let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
    let video = document.querySelector('video');
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
  let canvas = $('main-canvas'),
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
  let canvasRatio = canvas.width / canvas.height,
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
  let file = document.querySelector('input[type=file]').files[0],
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
    $('onlay-canvas').style.display = "none";
    renderPhoto();
  } else {
    onlay.setAttribute('is-visible', 'true');
    $('onlay-canvas').style.display = "block";
    currentX = (onlayCanvas.width - onlay.width) / 2;
    currentY = (onlayCanvas.height - onlay.height) / 2;
    onlayScale = 1;
    let style = element.currentStyle || window.getComputedStyle(element, false),
      bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
    onlay.src = bi;
    onlayURL = bi;
  }
}

function applyFrame(element) {
  if (element.id == "no-frame") {
    frame.setAttribute('is-visible', 'false');
    renderPhoto();
  } else {
    frame.setAttribute('is-visible', 'true');
    let style = element.currentStyle || window.getComputedStyle(element, false),
      bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
      bi = bi.replace(/preview\// , "");
    frame.src = bi;
    frameURL = bi;
  }
}

function renderPhoto() {
  let canvas = $('main-canvas'),
  context = canvas.getContext("2d"),
  width = 1024, height = 768,
  startX, startY, endX, endY;

  canvas.width = width;
  canvas.height = height;
  onlayCanvas.width = width;
  onlayCanvas.height = height;

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
    showDragableOnlay();
  }
  if (frame.getAttribute('is-visible') == 'true') {
    context.drawImage(frame, 0, 0, width, height);
  }
}

function showDragableOnlay() {
  let rect, mouseX, mouseY, modifX, modifY, click;

  onlayCanvas.onmousedown = function(e) {
    e.preventDefault();
    click = true;
    rect = this.getBoundingClientRect();
    mouseX = onlayCanvas.width * (e.pageX - rect.left) / rect.width;
    mouseY = onlayCanvas.height * (e.pageY - rect.top) / rect.height;
    if (mouseX >= (currentX) && mouseX <= (currentX + onlay.width * onlayScale) &&
        mouseY >= (currentY) && mouseY <= (currentY + onlay.height * onlayScale)) {
      modifX = mouseX - currentX;
      modifY = mouseY - currentY;
      isDraggable = true;
    }
  };
  onlayCanvas.onmouseup = function(e) {
    isDraggable = false;
    if(click) {
console.log(onlayScale);
      if (onlayScale >= 2) {
        onlayScale = 1;
      } else {
        onlayScale += 0.1;
      }
    }
  };
  onlayCanvas.onmouseout = function(e) {
    isDraggable = false;
  };
  onlayCanvas.onmousemove = function(e) {
    click = false;
    if (isDraggable) {
        mouseX = onlayCanvas.width * (e.pageX - rect.left) / rect.width;
        mouseY = onlayCanvas.height * (e.pageY - rect.top) / rect.height;
        currentX = mouseX - modifX;
        currentY = mouseY - modifY;
     }
  };
  setInterval(function() {
    onlayContext.clearRect(0, 0, onlayCanvas.width, onlayCanvas.height);
    if (onlay.getAttribute('is-visible') === 'true') {
      onlayContext.drawImage(onlay, currentX, currentY, onlay.width * onlayScale, onlay.height * onlayScale);
    }
  }, 1000/30);
}

function changeInterface(toVideoScreen) {
  if (toVideoScreen) {
    if (!error) {
      $('video').style.display = "block";
      $('photoBtn').style.display = "block";
    } else {
      $('video-error').style.display = "block";
      $('video').style.display = "none";
      $('photoBtn').style.display = "none";
    }
    $('loadBtn').style.display = "block";
    $('okBtn').style.display = "none";
    $('cancelBtn').style.display = "none";
    $('main-canvas').style.display = "none";
    $('onlay-canvas').style.display = "none";
    $('frames').style.visibility = "hidden";
    $('onlays').style.visibility = "hidden";
    $('description').style.display = "none";
    if (screen.width < 612) {
      document.querySelector('.posts-block').style.display = "inline";
    }
  } else {
    frame.setAttribute('is-visible', 'false');
    onlay.setAttribute('is-visible', 'false');
    $('photoBtn').style.display = "none";
    $('loadBtn').style.display = "none";
    $('video').style.display = "none";
    $('video-error').style.display = "none";
    $('main-canvas').style.display = "block";
    $('okBtn').style.display = "block";
    $('cancelBtn').style.display = "block";
    $('frames').style.visibility = "visible";
    $('onlays').style.visibility = "visible";
    $('description').style.display = "block";
    if (screen.width < 612) {
      document.querySelector('.posts-block').style.display = "none";
    }
  }
}

function post() {
  $('okBtn').style.display = "none";
  $('cancelBtn').style.display = "none";
  let canvas = $("main-canvas");
  canvas.getContext('2d').drawImage(frame, 0, 0, canvas.width, canvas.height);
  let dataURL = canvas.toDataURL("image/png");
  $('hidden_data').value = dataURL;
  let fd = new FormData(document.forms["uploading-form"]);
  if (frame.getAttribute('is-visible') == 'true') {
    fd.set('frame', 'true');
    fd.set('frameURL', frameURL);
  } else {
    fd.set('frame', '');
  }
  if (onlay.getAttribute('is-visible') == 'true') {
    fd.set('onlay', 'true');
    fd.set('onlayScale', onlayScale);
    fd.set('onlayX', currentX);
    fd.set('onlayY', currentY);
    fd.set('onlayURL', onlayURL);
  } else {
    fd.set('onlay', '');
  }
  let xhr = new XMLHttpRequest();
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
}

function errorMsg(msgString) {
  msgBox = $("msg");
  msgBox.innerHTML = msgString;
  msgBox.className = "err-msg";
  msgBox.style.display = "block";
  changeInterface(true);
}