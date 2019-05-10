<div id="myOnlineCamera">
    <input type="file" name="file" id="file" class="inputfile" accept="image/*" />
    <form action="/photo/load" method="post" accept-charset="utf-8" name="uploading-form">
            <input name="hidden_data" id='hidden_data' type="hidden"/>
            <input name="description" id='description' tupe="text"/>
    </form>
    <video>Webcam preview is not supported</video>
    <img id="snapShot">
    <canvas></canvas>
    <input type="image" id="photoBtn" class="buttons" alt="take a photo" src="/public/img/default/1px.png">
    <label for="file"><img id="loadBtn" class="buttons" alt="load a photo" src="/public/img/default/1px.png"></label>
    <input type="image" id="okBtn" class="buttons" alt="ok" src="/public/img/default/1px.png">
    <input type="image" id="cancelBtn" class="buttons" alt="cancel" src="/public/img/default/1px.png">
</div>