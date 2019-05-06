<?php
    if (isset($_SESSION['uid'])) {
        if ($user_logo == NULL) {
            $user_logo = '/public/img/default/not-logged.png';
        } 
        $corner = <<<REGISTERED
        <li id="header-corner"><a href="javascript:void(0);" tabindex="1" >$username<img src="$user_logo" alt="not logged"></a></li>
        <ul class="side-menu">
        <li><a href="#1">Add a photo</a></li>
        <li><a href="#2">Settings</a></li>
        <li><a href="/account/logout">Log out</a></li>
        </ul>
REGISTERED;
    } else {
        $corner = <<<UNREGISTERED
        <li id="header-corner"><a href="/account/login" tabindex="1" >Log in<img src="/public/img/default/not-logged.png" alt="not logged"></a></li>
UNREGISTERED;
    }
?>
<!DOCTYPE HTML>
<html>
<head>
    <title><?php echo $title ?></title>
    <link rel="stylesheet" href="/public/css/default/header.css">
    <link rel="stylesheet" href="/public/css/default/hidden-menu.css">
    <link rel="stylesheet" href="/public/css/default/form.css">
</head>
<body>
    <ul id="menu-bar">
        <li id="header-logo"><a href="/">Logo</a></li>
        <li id="header-name"><a href="/">Camagru</a></li>
        <li id="corner"><?php echo $corner ?></li>
    </ul>
    <?php echo $content; ?>
</body>
</html>