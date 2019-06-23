<h1>User settings</h1>
<div class="form-style-4 settings-form">

    <div>
        <h2>Personal settings</h2>
        <div class="settings-block">
            <h3>Change login:</h3>
            <input id="username" type="text" name="username" minlength="4" maxlength="16" value="<?php echo $username; ?>">
            <div class="hint" id="usernamehint"></div>
            <input type="image" id="usernameChangeBtn" class="buttons ok" alt="change login" src="/public/img/default/1px.png">
        </div>
    </div>
<hr>
    <div>
        <h2>Security settings</h2>
        <div class="settings-block">
            <h3>Change password:</h3>
            <p>Old password:</p>
            <input id="oldpassword" type="password" name="oldpassword" minlength="4" maxlength="20">
            <p>New password (6 characters minimum)</p>
            <p><input id="password" type="password" name="password" minlength="4" maxlength="20"></p>
            <div class="hint" id="passwordhint"> </div>
            <p>Password confirmation*</p>
            <p><input id="confirmation" type="password" name="confirmation"></p>
            <div class="hint" id="confirmationhint"> </div>
            <br>
            <input type="image" id="passwordChangeBtn" class="buttons ok" alt="change login" src="/public/img/default/1px.png">
        </div>
    </div>
<hr>
    <div>
        <h2>Contact and notification settings</h2>
        <div class="settings-block">
            <?php
            if (!$email_confirmed) {
                echo "<div class=\"hint\">Your e-mail is not verified. Please, follow a confirmaiton link in letter to verify your e-mail.</div><br>";
                echo "<a id=\"resendNotif\" href=\"JavaScript:Void(0);\">Re-send activation letter</a>";
            }
            ?>
            <h3>Change e-mail:</h3>
            <input id="email" type="email" name="email" value="<?php echo $email; ?>">
            <div class="hint" id="emailhint"> </div>
            <input type="image" id="emailChangeBtn" class="buttons ok" alt="change login" src="/public/img/default/1px.png">
            <h3>Send notifications about new comments</h3>
            <input type="image" id="notifChangeButton" class="buttons <?php echo ($send_notif) ? 'check' : 'uncheck' ?>" alt="change login" src="/public/img/default/1px.png">
        </div>
    </div>

</div>