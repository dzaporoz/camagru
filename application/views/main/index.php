<p>Main page</p>
<div id="feed">
</div>
<div id="feedLoad">
</div>
<div id="post-window">
    <div>
        <img id="post-image" src="/public/img/default/1px.png" />

    <?php
    if (!isset($_SESSION['uid'])) {
        echo '<span>only registered users can leave comments</span>';
    } else {
        echo <<< COMMENTFORM
    <div id="comment-form">
        <textarea rows="7" cols="50"  maxlength="200" placeholder = "Leave your comment..." id="comment-text"></textarea>
        <input type="image" id="add-comment" src="/public/img/default/1px.png">
    </div>
COMMENTFORM;
    }
    ?>
</div>
    <div id="post-data">
        <a id="post-author" href="javascript:void(0)">test1</a>
        <img id="delete-post" class="delete" src="/public/img/default/1px.png" />
        <div id="post-likes">
            <span>X</span>
            <img id="like-post" class="liked" src="/public/img/default/1px.png" />
        </div>    
        <span id="post-description"></span>
        
    <span id="post-comments-num"></span>
    <div id="post-comments">
    </div>
    <img id="close-post" src="/public/img/default/1px.png" />
    </div>
</div>

<div id="overlay"></div>
