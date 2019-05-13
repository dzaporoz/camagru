<div id="myOnlineCamera">
    <input type="file" name="file" id="file" class="inputfile" accept="image/*" />
    <form action="/photo/load" method="post" enctype="multipart/form-data" accept-charset="utf-8" name="uploading-form">
            <input name="MAX_FILE_SIZE" type="hidden" value="20971520" />        
            <input name="hidden_data" id='hidden_data' type="hidden"/>
            <input name="description" id='description' type="text"/>
    </form>
    <video>Webcam preview is not supported</video>
    <canvas></canvas>
    <input type="image" id="photoBtn" class="buttons" alt="take a photo" src="/public/img/default/1px.png">
    <label for="file"><img id="loadBtn" class="buttons" alt="load a photo" src="/public/img/default/1px.png"></label>
    <input type="image" id="okBtn" class="buttons" alt="ok" src="/public/img/default/1px.png">
    <input type="image" id="cancelBtn" class="buttons" alt="cancel" src="/public/img/default/1px.png">
</div>