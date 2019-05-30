<h3>Registration</h3>
<form id="form" action="/account/register" method="post">
    <p>Login</p>
    <p><input type="text" name="username" minlength="4" maxlength="16"></p>
    <p>E-mail</p>
    <p><input type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 3}$"></p>
    <p>Password</p>
    <p><input type="password" name="password" minlength="4" maxlength="20"></p>
    <p>Password confirmation</p>
    <p><input type="text" name="confirmation"></p>
    <p><button type="submit">Register</button></p>
</form>