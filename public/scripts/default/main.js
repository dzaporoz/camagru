function $(x) {return document.getElementById(x);}

var LoadedImgs = 0,
    getData = parseGetData(),
    href = window.location.href,
    imageIdGet = null;

if( document.readyState !== 'loading' ) {
  initializeFeed()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initializeFeed();
  });
}

function initializeFeed() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('unliked')) {
      if (event.target.hasAttribute('image_id')) {
      addLike(event.target);
      }
    } else if (event.target.classList.contains('liked')) {
      if (event.target.hasAttribute('image_id')) {
        removeLike(event.target);
      }
    } else if (event.target.classList.contains('delete')) {
      if (event.target.hasAttribute('image_id')) {
        deleteImage(event.target);
      } else if (event.target.parentElement.hasAttribute('comment_id')) {
        deleteComment(event.target.parentElement);
      }
    } else if (!event.target.classList.contains('username') && (event.target.classList.contains('element') ||
    event.target.classList.contains('elementData') || event.target.classList.contains('elementTitle') ||
    event.target.classList.contains('comments'))) {
      openPost(event.target);
    } else if (event.target.id == 'overlay' || event.target.id == 'close-post' || event.target.id == 'mobile-post-close') {
      closePost();
    } else if (event.target.id == 'add-comment') {
      addComment();
    }
  }, false);

  document.addEventListener('scroll', function (event) {
    var scroll = document.body.scrollTop || window.scrollY;
    if (document.body.scrollHeight -
        scroll - window.innerHeight < 500) {
        loadFeed();
    }
  });

  if (getData && getData['img_id']) {
    imageIdGet = getData['img_id'];
  }
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
        changelike(button);
      } else if (xhr.responseText != 'ko') {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function removeLike (button)
{
  var xhr = new XMLHttpRequest(),
  image_id = button.getAttribute('image_id');
  params = 'action=removeLike&image_id=' + image_id;
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        changelike(button);
      } else if (xhr.responseText != 'ko') {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function changelike(likeButton) {
  var postWindowLikes, feedLikes, likesCount, imageId;
  if (!(imageId = likeButton.getAttribute('image_id')) || !(postWindowLikes = document.querySelector('#post-likes'))
  || !(feedLikes = document.querySelector(".element[image_id='" + imageId + "'] .likes"))) {
    return;
  }
  likesCount = parseInt(feedLikes.querySelector('span').innerHTML);
  if (likeButton.className.match(/(?:^|\s)liked(?!\S)/) ) {
    postWindowLikes.querySelector('input').className = postWindowLikes.querySelector('input').className.replace(/(?:^|\s)liked(?!\S)/g , '');
    postWindowLikes.querySelector('input').className += "unliked";
    feedLikes.querySelector('input').className = feedLikes.querySelector('input').className.replace(/(?:^|\s)liked(?!\S)/g , '');
    feedLikes.querySelector('input').className += "unliked";
    if (likesCount > 0) {
      postWindowLikes.querySelector('span').innerHTML = likesCount - 1;
      feedLikes.querySelector('span').innerHTML = likesCount - 1;
    }
  } else {
    postWindowLikes.querySelector('input').className = postWindowLikes.querySelector('input').className.replace(/(?:^|\s)unliked(?!\S)/g , '');
    postWindowLikes.querySelector('input').className += "liked";
    feedLikes.querySelector('input').className = feedLikes.querySelector('input').className.replace(/(?:^|\s)unliked(?!\S)/g , '');
    feedLikes.querySelector('input').className += "liked";
    postWindowLikes.querySelector('span').innerHTML = likesCount + 1;
    feedLikes.querySelector('span').innerHTML = likesCount + 1;
  }
}

function deleteImage (button)
{
  if (!confirm('Are you sure want to delete this post.')) { return; }
  xhr = new XMLHttpRequest(),
  imageId = button.getAttribute('image_id');
  params = 'action=deleteImage&image_id=' + imageId;
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        closePost();
        document.querySelector('#feed').removeChild(document.querySelector(".element[image_id='" + imageId + "']"));
      } else {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}

function openPost(element) {
  if (element == null) {
    errorMsg('Error occured. Reload page and try again');
    return;
  }
  $('overlay').style.display = "block";
  let post = document.querySelector('#post-window'),
      scroll = document.body.scrollTop || window.scrollY,
      currentGetData = "?",
      ampersand = false,
      imageId = getPostId(element);
  if (screen.width < 612) {
    $('header-name').style.display = "none";
    $('mobile-post-close').style.display = "inline";
    scroll += 50;
  }
  post.style.display = "flex";
  post.style.top = scroll + 70 + 'px';
  if (!element.className.match(/(?:^|\s)element(?!\S)/) && element.parentElement) {
    element = element.parentElement;
    if (!element.className.match(/(?:^|\s)element(?!\S)/) && element.parentElement) {
      element = element.parentElement;
    }
  }
  if (!imageIdGet) {
    if (getData) {
      for (let prop in getData) {
        if (ampersand) {
          currentGetData += '&';
        }
        currentGetData += prop + "=" + getData[prop];
        ampersand = true;
      }

    }
    window.history.pushState("", "", ((getData) ? (currentGetData + '&') : ('/?')) + 'img_id=' + imageId);
    post.scrollTop = 0;
  }

  $('post-window').setAttribute('image_id', imageId);
  $('post-image').style.backgroundImage = element.style.backgroundImage;
  $('like-post').className = element.querySelector('.likes input').className;
  $('like-post').setAttribute('image_id', imageId);
  document.querySelector('#post-likes span').innerHTML = element.querySelector('.likes span').innerHTML;
  $('post-description').innerHTML = element.querySelector('.elementTitle').innerHTML;
  $('post-author').innerHTML = element.querySelector('.username a').innerHTML;
  $('post-author').href = element.querySelector('.username a').href;
  $('delete-post').setAttribute('image_id', imageId);
  $('delete-post').style.display = (element.querySelector('.delete')) ? "inline": "none";
  $('post-comments-num').innerHTML = element.querySelector('.comments').innerHTML;
  showComments(imageId);
}

function closePost() {
  if (screen.width < 612) {
    $('header-name').style.display = "inline";
    $('mobile-post-close').style.display = "none";
  }
  $('overlay').style.display = "none";
  $('post-window').style.display = "none";
  if ($('comment-text')) {
    $('comment-text').value = "";
  }
  if (getData) {
    if (getData['uid']) {
      href = href.split("?")[0] + '?uid=' + getData['uid'];
    } else {
      href = href.split("?")[0];
    }
  }
  window.history.pushState("", "", href);
  if (getData && getData['img_id']) {
    delete getData["img_id"];
    if (!getData['uid']) {
      getData = null;
    }
    imageIdGet = null;
  }
}

function addComment() {
  var textarea = document.querySelector('#comment-text');
  if (textarea.value.length < 3 || textarea.value.length > 200) {
    errorMsg("Comment must have lenght between 3 and 200 characters.");
  } else {
    var xhr = new XMLHttpRequest(),
    image_id = $('post-window').getAttribute('image_id'),
    params = 'action=addComment&comment_text=' + encodeURIComponent(textarea.value) + '&image_id=' +
      image_id;
    xhr.open('POST', 'main/action', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText == 'ok') {
          changeCommentsNum(image_id, 1);
          textarea.value = "";
          showComments(image_id);
        } else {
          errorMsg(xhr.responseText);
        }
      }
  }
  xhr.send(params);  
  }
}

function showComments(imageId) {
  var xhr = new XMLHttpRequest(),
  params = 'action=showComments&image_id=' + imageId;
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() { 
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText != 'ko') {
        $('post-comments').innerHTML = xhr.responseText;
      } else {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params); 
}

function deleteComment(comment) {
  if (!confirm('Are you sure want to delete your comment')) {
    return;
  }
  var xhr = new XMLHttpRequest(),
  params = 'action=deleteComment&comment_id=' + comment.getAttribute('comment_id');
  xhr.open('POST', 'main/action', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() { 
    if(xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText == 'ok') {
        comment.parentElement.removeChild(comment);
        changeCommentsNum($('post-window').getAttribute('image_id'), -1);
      } else {
        errorMsg(xhr.responseText);
      }
    }
  }
  xhr.send(params); 
}

function changeCommentsNum(imageId, value) {
  var postCom = $('post-comments-num'),
  feedCom = feedLikes = document.querySelector(".element[image_id='" + imageId + "'] .comments");
  if (!postCom || !feedCom) {
    return;
  }
  comNumber = parseInt(feedCom.innerHTML) + value;
  feedCom.innerHTML = comNumber + ' comment' + ((comNumber == 1) ? '' : 's');
  postCom.innerHTML = feedCom.innerHTML;
}

function loadFeed() {
  if (LoadedImgs < 0) { return; }
  var loadIcon = $('feedLoad'),
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
      var feed = $('feed'),
      response = xhr.responseText;
      if (response == "") {
        LoadedImgs = -1;
        loadIcon.style.display = "none";
        return false;
      }
      var givenImages = parseInt(response);
      if (givenImages == 9) {
        LoadedImgs += parseInt(response);
      } else {
        LoadedImgs = -1;
      }
      response = response.substring(response.indexOf("<"));
      feed.innerHTML = feed.innerHTML + response;  
      loadIcon.style.display = "none";
      if (imageIdGet && document.querySelector('.element[image_id="'+ imageIdGet + '"]')) {
        openPost(document.querySelector('.element[image_id="' + imageIdGet + '"]'));
      } else if (imageIdGet && LoadedImgs < 0) {
        errorMsg('Wrong url');
      } else {
        loadFeed();
      }
      return true;
    }
  }
  xhr.send(params);
}

function getPostId(element) {
  var postId;
  if (postId = element.getAttribute('image_id')) {
    return postId;
  } else if (!element.className.match(/(?:^|\s)element(?!\S)/) && (element = element.parentElement)) {
    if (postId = element.getAttribute('image_id')) {
      return postId;
    } else if (!element.className.match(/(?:^|\s)element(?!\S)/) && (element = element.parentElement)) {
      if (postId = element.getAttribute('image_id')) {
        return postId;
      }
    }
  }
  return null;
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
  msgBox.style.opacity = "1";
}