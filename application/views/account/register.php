<h3>Registration</h3>
<form id="form" action="/account/register" method="post">
    <p>Login*</p>
    <p><input id="username" type="text" name="username" minlength="4" maxlength="16"></p>
    <div class="hint" id="usernamehint"></div>
    <p>E-mail*</p>
    <p><input id="email" type="email" name="email"></p>
    <div class="hint" id="emailhint"> </div>
    <p>Password* (6 characters minimum)</p>
    <p><input id="password" type="password" name="password" minlength="4" maxlength="20"></p>
    <div class="hint" id="passwordhint"> </div>
    <p>Password confirmation*</p>
    <p><input id="confirmation" type="password" name="confirmation"></p>
    <div class="hint" id="confirmationhint"> </div>
    <p><button id="button" type="submit" disabled>Register</button></p>
</form>