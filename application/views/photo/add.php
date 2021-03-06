<h1>Creating a new post</h1>
<div id="flexbox">
    <div id="frames">
        <?php
            echo "<img id=\"no-frame\" class=\"frame\" src=\"/public/img/default/no-frame.png\" />";
            $images = glob('./public/frames/preview/*.png');
            foreach ($images as $frame) {
                $frame = ltrim($frame, ".");
                echo "<img class=\"frame\" src=\"/public/img/default/1px.png\" style=\"background-image: url('$frame');\" />";
            }
        ?>
    </div>
    <div id="myOnlineCamera">
        <input type="file" name="file" id="file" class="inputfile" accept="image/*" />
        <video id = "video">Webcam preview is not supported</video>
        <label for="file">
            <div id="video-error">
                <p>It seems that your browser doesn't support work with webcam or webcam not found.</p>
                <p>Maybe you click "deny" button, when browser asks you for the permission to use webcam. Check browser settings.</p>
                <p>Now you can only upload an existing image from your device.</p>
            </div>
        </label>
        <canvas id="main-canvas"></canvas>
        <canvas id="onlay-canvas"></canvas>
        <img id="photoBtn" class="buttons" alt="take a photo" src="/public/img/default/1px.png">
        <label for="file"><img id="loadBtn" class="buttons" alt="load a photo" src="/public/img/default/1px.png"></label>
        <img id="okBtn" class="buttons" alt="ok" src="/public/img/default/1px.png">
        <img id="cancelBtn" class="buttons" alt="cancel" src="/public/img/default/1px.png">
    </div>
    <div id="onlays">
        <?php
            echo "<img id=\"no-onlay\" class=\"onlay\" src=\"/public/img/default/no-frame.png\" />";
            $onlays = New FilesystemIterator('public/onlays', FilesystemIterator::UNIX_PATHS);
            foreach ($onlays as $onlay) {
                if (pathinfo($onlay)['extension'] == 'png') {
                    echo "<img class=\"onlay\" src=\"/public/img/default/1px.png\" style=\"background-image: url('$onlay');\" />";
                }
            }
        ?>
    </div>
</div>
<form action="/photo/load" method="post" enctype="multipart/form-data" accept-charset="utf-8" name="uploading-form">
    <input name="MAX_FILE_SIZE" type="hidden" value="20971520" />
    <input name="hidden_data" id='hidden_data' type="hidden"/>
    <textarea name="description" id='description' maxlength="200" placeholder="Add image description..."></textarea>
</form>

<div class="posts-block">
    <?php if ($posts):?>
    <h2 align="center" style="color: #FFFFFF">Your latest posts</h2>
    <div class="posts">
        <?php
        foreach ($posts as $post) {
            echo "<a href=\"http://{$_SERVER['HTTP_HOST']}\?uid={$_SESSION['uid']}&img_id={$post['img_id']}\"><img src=\"{$post['img_url']}\" /></a>";
        }
        ?>
    </div>
    <?php endif; ?>
</div>
