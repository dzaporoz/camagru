<h1>Latest posts</h1>
<div id="feed">
</div>
<div id="feedLoad">
</div>
<div id="post-window">
    <div id="main-data">
        <img id="post-image" src="/public/img/default/1px.png" />
        <div id="post_data">
            <div id="post-head">
                <a id="post-author" href="javascript:void(0)">test1</a>
                <input type="image" id="delete-post" class="delete" src="/public/img/default/1px.png" />
                <div id="post-likes">
                    <span>X</span>
                    <input type="image" id="like-post" class="liked" src="/public/img/default/1px.png" />
                </div>
                <span id="post-comments-num"></span>
                <span id="post-description"></span>
            </div>

        </div>
    </div>
    <div id="post-data">
        <div id="comment-form">
            <?php
            if (!isset($_SESSION['uid'])) {
                echo '<span>only registered users can leave comments</span>';
            } else {
                echo <<< COMMENTFORM
        
                <textarea rows="7" cols="50"  maxlength="200" placeholder = "Leave your comment..." id="comment-text"></textarea>
                <input type="image" id="add-comment" src="/public/img/default/1px.png">

COMMENTFORM;
            }
            ?>
        </div>
        <img id="close-post" src="/public/img/default/1px.png" />
        <div id="post-comments">
        </div>
    </div>
</div>

<div id="overlay"></div>
