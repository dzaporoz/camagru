<p>Main page</p>
<div id="feed">
</div>
<div id="feedLoad">
</div>
<div id="post-window">
    <img id="post-image" src="/public/img/default/1px.png" />
    <div id="post-data">
        <a id="post-author" href="javascript:void(0)">test1</a>
        <img id="delete-post" class="delete" src="/public/img/default/1px.png" />
        <div id="post-likes">
            <span>X</span>
            <img id="like-post" class="liked" src="/public/img/default/1px.png" />
        </div>    
        <span id="post-description">++++++++10++++++++20++++++++30++++++++40++++++++50++++++++60++++++++70++++++++80++++++++90+++++++100+++++++110+++++++120+++++++130+++++++140+++++++150+++++++160+++++++170+++++++180+++++++190+++++++200+++++++210+++++++220+++++++230+++++++240+++++++250+++++++260+++++++270+++++++280+++++++290+++++++300+++++++310+++++++320+++++++330+++++++340+++++++350</span>
    </div>
    <img id="close-post" src="/public/img/default/1px.png" />
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
    <span id="post-comments-num"></span>
    <div id="post-comments">
        <div class="comment" comment_id="2">
            <a href="#">test1</a>, 21-07-2019
            <span>This is test comment. It doesn't have any sense, but it helps me to test and debug work of my new 42sh project- Camagru. According to this project I should create a site which will be similar to Insta</span>
            <hr/>
        </div>
    </div>
</div>
<div id="overlay"></div>
