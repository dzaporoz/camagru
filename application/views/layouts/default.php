<?php
    if (isset($_SESSION['uid'])) {
        $corner = <<<REGISTERED
        <li id="header-corner"><a href="javascript:void(0);" >$username</a>
        
        </li>
        <ul class="side-menu">
            <li><a href="/photo">Add a photo</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/account/logout">Log out</a></li>
        </ul>
REGISTERED;
    } else {
        $corner = <<<UNREGISTERED
        <li id="header-corner"><a href="/account/login" tabindex="1" >Log in</a></li>
UNREGISTERED;
    }
?>
<!DOCTYPE HTML>
<html>
<head>
    <title><?php echo $title ?></title>
    <link rel="stylesheet" href="/public/css/default/header.css">
    <link rel="stylesheet" href="/public/css/default/form.css">
    <script type="text/javascript" src="/public/scripts/default/layout.js" async></script>
    <?php if (isset($styles)) foreach ($styles as $styleUrl) { 
        echo "<link rel=\"stylesheet\" href=\"/public/css/default/$styleUrl\">"; }?>
    <?php if (isset($scripts)) foreach ($scripts as $scriptUrl) {
        echo "<script type=\"text/javascript\" src=\"/public/scripts/default/$scriptUrl\" async></script>"; }?>
</head>
<body>
    <ul id="menu-bar">
     <!-- <a id="header-logo" href="/"><img src="/public/img/default/1px.png" /></a> --> 
        <a id="header-name" href="/"><img src="/public/img/default/1px.png" /></a> 
    <?php echo $corner ?>
    </ul>
    <h1 style="margin-top: 4vw;">Posting a photo</h1>
    <div id="msg" class="err-msg" <?php if(!isset($msg)) echo 'style="display:none"' ?>>
        <?php if(isset($msg)) echo $msg ?>
    </div>
    <?php echo $content; ?>
</body>
</html>