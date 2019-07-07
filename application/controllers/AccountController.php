<?php

namespace application\controllers;

use application\core\Controller;

class AccountController extends Controller {

    public function registerAction() {
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        $vars = array('corner' => '<a href="/account/login">Log in</a>',
            'scripts' => array('formCheck.js'),
            'styles' => array('account.css'));
        if (empty($_POST)) {
            $this->view->render('Register page', $vars);
        } else {
            $result = null;
            if (!isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['email'])) {
                $vars['msg'] = 'Data incomplete. Registration failed';
            } elseif (strlen($_POST['username']) < 4) {
                $vars['msg'] = 'User login cannot be shorter than 4 characters';
            } elseif (strlen($_POST['password']) < 6) {
                $vars['msg'] = 'Password cannot be shorter than 6 characters';
            } elseif (!preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $_POST['email'])) {
                $vars['msg'] = 'E-mail has wrong format';
            } elseif (!preg_match('/^[a-zA-Z0-9\-_]{4,16}$/', $_POST['username'])) {
                $vars['msg'] = 'Username has invalid characters';
            } else {
                $result = $this->model->register($_POST['username'], $_POST['password'], $_POST['email']);
                if (!$result) {
                    $vars['msg'] = 'Database error. Try again';
                } elseif ($result === true) {
                    $this->sendConfirmLetter($_POST['username'], $_POST['password'], $_POST['email']);
                    $this->view->redirect('/account/login');
                } else {
                    $vars['msg'] = $result;
                    $result = null;
                }
            }
            if (!$result) {
                $this->view->render('Register page', $vars);
            }
        }
    }

    public function reSendVerificationLetterAction() {
        if (!isset($_SESSION['uid'])) {
            exit('This option available only for logged in users');
        } elseif (!($data = $this->model->getReverificationData($_SESSION['uid']))) {
            exit('Wrong data. Please login again and press the link');
        } elseif (isset($data['email_confirmed']) && $data['email_confirmed']) {
            exit('You have already confirmed your e-mail');
        }
        $subject = "Confirm registration to Camagru project";
        $message = <<< MESSAGE
Good day!
You receive this letter because someone request to send verification letter again.
If you didn't do any actions - just ignore this letter.

Please follow this link to activate your account:
http://{$_SERVER['HTTP_HOST']}/account/verify?email={$data['email']}&hash={$data["hash"]}
MESSAGE;
        $this->sendEmail($data['email'], $subject, $message);
        echo 'ok';
    }

    public function verifyAction() {
        if(!isset($_GET['email']) || !isset($_GET['hash']) || !$this->model->verifyUser($_GET['email'], $_GET['hash'])) {
            $vars['message'] = "Incorrect verification link. Please try again to follow this link from your email";
        } else {
            if (!isset($_SESSION['uid'])) {
                $vars['message'] = "Your account has been activated, you can login now";
            } else {
                $vars['message'] = "Your account has been activated, you have full access to all features now";
            }
        }
        $this->view->render('Verification page', $vars);
    }

    public function loginAction() {
        $vars = array('corner' => '<a href="/account/register">Register</a>');
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        if (!empty($_POST)) {
            $result = $this->model->login($_POST['username'], $_POST['password']);
            if (!$result) {
                $vars['msg'] = 'Wrong login/pasword';
                $this->view->render('Login page', $vars);
            }
            else {
                $_SESSION['uid'] = $result['uid'];
                $_SESSION['verified_user'] = $result['email_confirmed'];
                $this->view->redirect('/');
            }
        } else {
            $this->view->render('Login page', $vars);
        }
    }

    public function logoutAction() {
        if (isset($_SESSION['uid'])) {
            unset($_SESSION['uid']);
        }
        $this->view->redirect('/');
        exit();
    }

    public function restoreAction() {
        $vars = array();

        $startForm = <<<EMAIL_FORM
<form id="form" action="/account/restore" method="post">
<p><span>Please type in your e-mail. The password recovery instructions will be sent on it.</span></p>
<p><input id="email" type="email" name="email" placeholder="e-mail" required="required"></p>
<a href="/account/login">Return to login page</a>
<p><button id="button" type="submit" class="btn btn-primary btn-block btn-large">Send recovery letter</button></p>
</form>
EMAIL_FORM;
        $incorrectForm = <<<INCORRECT_FORM
<div id=\"form\" class="forme">
<p>Error occured. Try again or follow this link from your e-mail again</p>
</div>
INCORRECT_FORM;

        if (filter_input(INPUT_SERVER, 'REQUEST_METHOD') === 'POST') {
            $email = filter_input(INPUT_POST, 'email');
            $hash = filter_input(INPUT_POST, 'hash');
            $password = filter_input(INPUT_POST, 'password');

            if ($email && $hash && $password) {
                if ($this->model->updatePassword($email, $hash, $password)) {
                    $vars['form'] = "<div id=\"form\" class='forme'>
<p>Password was changed successfully. You can <a href='/account/login'>login</a> now.</p>
</div>";
                } else {
                    $vars['form'] = $incorrectForm;
                }
            } elseif ($email) {
                if ($this->model->confirmUserByEmail($email)) {
                    $this->sendRecoveryLetter($email);
                    $vars["form"] = "<div id=\"form\" class='forme'>
<p>Letter with recovery instructions was sent on $email (in case if e-mail is verified)</p> 
Please check your e-mail.</div>";
                } else {
                    $vars["form"] = $startForm;
                    $vars['msg'] = "User with this e-mail unexist. Try again";
                }
            } else {
                $vars['form'] = $incorrectForm;
            }
        } elseif (filter_input(INPUT_SERVER, 'REQUEST_METHOD') === 'GET') {
            $email = filter_input(INPUT_GET, 'email');
            $hash = filter_input(INPUT_GET, 'hash');

            if (!$email && !$hash) {
                $vars["form"] = $startForm;
            } elseif ($this->model->verifyUser($email, $hash)) {
                $vars['form'] = <<<PASSWORD_RECOVERY_FORM
<form id="form" action="/account/restore" method="post">
<p>Please type your new password and it confirmation in bellowing fields:</p>
<p>Password* (6 characters minimum)</p>
<p><input id="password" type="password" name="password" minlength="4" maxlength="20"></p>
<div class="hint" id="passwordhint"> </div>
<p>Password confirmation*</p>
<p><input id="confirmation" type="password" name="confirmation"></p>
<div class="hint" id="confirmationhint"> </div>
<p><button id="button" type="submit" >Recover</button></p>
<input type="hidden" name="email" value="{$_GET['email']}">
<input type="hidden" name="hash" value="{$_GET['hash']}">
</form>
PASSWORD_RECOVERY_FORM;
            } else {
                $vars['form'] = $incorrectForm;
            }
        }

        $vars['styles'] = array('account.css');
        $this->view->render('Password recovering page', $vars);
    }

    protected function sendRecoveryLetter($email) {
        if ($hashData = $this->model->getUserHash($email)) {
            $subject = "Pasword recovery for Camagru user";
            $message = <<< MESSAGE
Good day!<br>
You receive this letter because of password recovery procedure was initiated on Camagru project.<br>
If you didn't do any actions for register - just ignore this letter.<br>
-----<br>
Please follow this link to move to password recovery page:<br>
http://localhost:8080/account/restore?email=$email&hash={$hashData["hash"]}<br>
MESSAGE;
            $this->sendEmail($email, $subject, $message);
        }
    }


    protected function sendConfirmLetter($login, $password, $email) {
        if ($hashData = $this->model->getUserHash($login)) {


            $subject = "Confirm registration to Camagru project";
            $message = <<< MESSAGE
Good day!
You receive this letter because of registration to Camagroo project.
If you didn't do any actions for register - just ignore this letter.
------------------------
Username: $login
Password: $password
------------------------
Please follow this link to activate your account:
http://localhost:8080/account/verify?email=$email&hash={$hashData["hash"]}
MESSAGE;
            $this->sendEmail($email, $subject, $message);
        }
    }

    protected function sendEmail($recipient, $mail_subject, $mail_message) {
        $encoding = "utf-8";
        $sender_mail = "dzaporoz@student.unit.ua";
        $preferences = array(
            "input-charset" => $encoding,
            "output-charset" => $encoding,
            "line-length" => 76,
            "line-break-chars" => "\r\n"
        );

        $header = "Content-type: text/html; charset=$encoding \r\n";
        $header .= "From: $sender_mail \r\n";
        $header .= "MIME-Version: 1.0 \r\n";
        $header .= "Content-Transfer-Encoding: 8bit \r\n";
        $header .= "Date: ".date("r (T)")." \r\n";
        $header .= iconv_mime_encode("Subject", $mail_subject, $preferences);
        $result = mail($recipient, $mail_subject, $mail_message, $header);
        if (!$result) {
            echo error_get_last()['message'];
        }
    }
}