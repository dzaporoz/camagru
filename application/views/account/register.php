<div class="forme">
<h1>Registration to Camagru project</h1>
<form id="form" action="/account/register" method="post">
    <p><input id="username" type="text" name="username" minlength="4" maxlength="16" placeholder="Username" required="required"></p>
    <div class="hint" id="usernamehint"></div>
    <p><input id="email" type="email" name="email" placeholder="E-mail" required="required"></p>
    <div class="hint" id="emailhint"> </div>
    <p><input id="password" type="password" name="password" minlength="4" maxlength="20" placeholder="Password" required="required"></p>
    <div class="hint" id="passwordhint"> </div>
    <p><input id="confirmation" type="password" name="confirmation" placeholder="Password confirmation" required="required"></p>
    <div class="hint" id="confirmationhint"> </div>
    <p><button id="button" type="submit" disabled class="btn btn-primary btn-block btn-large">Register</button></p>
    <p><a href="/account/login">Go back to login page</a></p>
</form>
</div>