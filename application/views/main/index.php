<h1>Latest posts</h1>
<div id="feed">
</div>
<div id="feedLoad">
</div>
<div id="post-window">
    <div>
        <img id="post-image" src="/public/img/default/1px.png" />
        <div id="comment-form">
    <?php
    if (!isset($_SESSION['uid'])) {
        echo '<span>only registered users can leave comments</span>';
    } else {
        echo <<< COMMENTFORM

        <textarea rows="7" cols="50"  maxlength="200" placeholder = "Leave your comment..." id="comment-text"></textarea>
        <input type="image" id="delete-post" class="delete" src="/public/img/default/1px.png" />
        <input type="image" id="add-comment" src="/public/img/default/1px.png">

COMMENTFORM;
    }
    ?>
    </div>
</div>
    <div id="post-data">
        <div id="post-head">
            <div id="post-author-field"><a id="post-author" href="javascript:void(0)">test1</a></div>
            <span id="post-description"></span>
        </div>
        <div id="middle-section">
            <div id="post-likes">
                <span>X</span>
                <input type="image" id="like-post" class="liked" src="/public/img/default/1px.png" />
            </div>
            <span id="post-comments-num"></span>
        </div>
        <div id="post-comments">
        </div>
    <img id="close-post" src="/public/img/default/1px.png" />
    </div>
</div>

<div id="overlay"></div>
