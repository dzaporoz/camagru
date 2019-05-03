<?php if(isset($msg)) {
    echo "<div class=\"msg\">$msg</div>";
}
?>
<h3>Registration</h3>
<form action="/account/register" method="post">
    <p>Login</p>
    <p><input type="text" name="username"></p>
    <p>E-mail</p>
    <p><input type="text" name="email"></p>
    <p>Password</p>
    <p><input type="text" name="password"></p>
    <p>Confirmation</p>
    <p><input type="text" name="confirmation"></p>
    <p><button type="submit">Register</button></p>
</form>