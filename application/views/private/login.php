<h3 style="margin-top: 4vw;">Log in</h3>
<?php if(isset($msg)) {
    echo "<div class=\"msg\">$msg</div>";
}
?>
<form id="form" action="/account/login" method="post">
    <p>Login</p>
    <p><input type="text" name="username"></p>
    <p>Password</p>
    <p><input type="text" name="password"></p>
    <p><button type="submit">Log in</button></p>
</form>