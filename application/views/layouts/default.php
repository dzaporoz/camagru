<?php
    if (isset($_SESSION['uid'])) {
        if (isset($username)) {
            $corner = <<<REGISTERED
                <li id="header-corner" class="header-button"><a href="/?uid={$_SESSION['uid']}" >$username</a>
                    <ul class="side-menu">
                        <li><a href="/photo">Add a photo</a></li>
                        <li><a href="/settings">Settings</a></li>
                        <li><a href="/account/logout">Log out</a></li>
                    </ul>
                </li>
REGISTERED;
        }
        else {
            $corner = '';
        }
    } else {
        $corner = <<<UNREGISTERED
        <li class="header-button"><a href="/account/register" tabindex="1" >Sign up</a></li>
        <li class="header-button"><a href="/account/login" tabindex="1" >Log in</a></li>
UNREGISTERED;
    }
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title><?php echo $title ?></title>
    <link rel="shortcut icon" href="/public/img/default/favicon.png" />
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
        <img id="mobile-post-close" src="/public/img/default/1px.png" >
        <a id="header-name" href="/"><img src="/public/img/default/1px.png" /></a> 
    <?php echo $corner ?>
    </ul>
    <div id="msg" class="err-msg" <?php if(!isset($msg)) echo 'style="display:none"' ?>>
        <?php if(isset($msg)) echo $msg ?>
    </div>
    <?php echo $content; ?>
    <div class="footer">
        <p>Camagru project. Made by Dmytro Zaporozhchenko for School42. <a id="credits" href="javascript:void(0)">&lt;Credits&gt;</a></p>
    </div>
</body>
</html>