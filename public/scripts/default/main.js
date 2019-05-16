var LoadedImgs = 0, getData = parseGetData();

if( document.readyState !== 'loading' ) {
  initializeFeed()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initializeFeed();
  });
}

function initializeFeed() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('unliked') && event.target.hasAttribute('image_id')) {
      addLike(event.target);
    } else if (event.target.classList.contains('liked') && event.target.hasAttribute('image_id')) {
      removeLike(event.target);
    } else if (event.target.classList.contains('delete') && event.target.hasAttribute('image_id')) {
      deleteImage(event.target);
    }
      
  }, false);

  document.addEventListener('scroll', function (event) {
    var scroll = document.body.scrollTop || window.scrollY;
    if (document.body.scrollHeight -
        scroll - window.innerHeight < 500) {
        loadFeed();
    }
  });
  loadFeed();  
}

function addLike (button)
{
  xhr = new XMLHttpRequest(),
  params = 'action=addLike&image_id=' + button.getAttribute('image_id');
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        if (button.className.match(/(?:^|\s)unliked(?!\S)/) ) {
          button.className = button.className.replace( /(?:^|\s)unliked(?!\S)/g , '' );
        }
        if (!button.className.match(/(?:^|\s)liked(?!\S)/) ) {
          button.className += " liked";
        }
        var numLikesElem = button.parentElement.querySelector('span');
        numLikesElem.innerHTML = parseInt(numLikesElem.innerHTML) + 1;
      } else if (xhr.responseText != 'ko') {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function removeLike (button)
{
  xhr = new XMLHttpRequest(),
  params = 'action=removeLike&image_id=' + button.getAttribute('image_id');
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        if (button.className.match(/(?:^|\s)liked(?!\S)/) ) {
          button.className = button.className.replace(/(?:^|\s)liked(?!\S)/g , '');
        }
        if (!button.className.match(/(?:^|\s)unliked(?!\S)/) ) {
          button.className += " unliked";
        }
        var numLikesElem = button.parentElement.querySelector('span');
        var likesNum = parseInt(numLikesElem.innerHTML);
        if (likesNum > 0) {
          numLikesElem.innerHTML = likesNum - 1;
        }
      } else if (xhr.responseText != 'ko') {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function deleteImage (button)
{
  if (!confirm('Are you sure want to delete this post.')) { return; }
  xhr = new XMLHttpRequest(),
  params = 'action=deleteImage&image_id=' + button.getAttribute('image_id');
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        var post = button.parentElement.parentElement;
        document.querySelector("#feed").removeChild(post);
      } else {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function loadFeed() {
  if (LoadedImgs < 0) { return; }
  var loadIcon = document.querySelector('#feedLoad'),
  xhr = new XMLHttpRequest(),
  params = 'action=loadFeed&img_num=' + LoadedImgs;
  if (getData && getData['uid']) {
    params += "&uid=" + getData['uid'];
  }
  loadIcon.style.display = "block";
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
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
      loadIcon.style.display = "none";
    }
  }
  xhr.send(params);
}

function parseGetData() {
  var queryString = window.location.search.slice(1);
  if (!queryString) return null;
  queryString = queryString.split('#')[0];
  var arr = queryString.split('&'), obj = {};
  for (var i = 0; i < arr.length; i++) {
    var a = arr[i].split('=');
    var paramName = decodeURIComponent(a[0]);
    var paramValue = typeof (a[1]) === 'undefined' ? true : decodeURIComponent(a[1]);
    paramName = paramName.toLowerCase();
    obj[paramName] = paramValue;
  }
  return obj;
}

function errorMsg(msgString) {
  msgBox = document.getElementById("msg");
  msgBox.innerHTML = msgString;
  msgBox.className = "err-msg";
  msgBox.style.display = "block";
}