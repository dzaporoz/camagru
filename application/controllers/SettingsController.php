<?php

namespace application\controllers;

use application\core\Controller;

class SettingsController extends Controller {
    
    public function showAction() {
        if (!isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        } else {
            $vars = $this->model->getLoggedUserData();
            $vars['styles'] = array('settings.css');
            $vars['scripts'] = array('formCheck.js', 'settings.js');
            $this->view->render('User settings', $vars);
        }
    }

    public function changeUsernameAction()
    {
        if (!isset($_SESSION['uid'])) {
            echo "Unable to identificate user, Please, try login again";
        } elseif (!isset($_POST['username'])) {
            echo "Invalid data. Please, try again";
        } elseif (!preg_match('/^[a-zA-Z0-9\-_]{4,16}$/', $_POST['username'])) {
            echo 'Username has invalid characters';
        } else {
            if ($this->model->updateUsername($_SESSION['uid'], $_POST['username'])) {
                echo 'ok';
            } else {
                echo 'user with the same login already exist';
            }
        }
    }

    public function changePasswordAction()
    {
        if (!isset($_SESSION['uid'])) {
            echo "Unable to identificate user, Please, try login again";
        } elseif (!isset($_POST['oldpassword']) || !isset($_POST['password'])) {
            echo "Invalid data. Please, try again";
        } elseif (strlen($_POST['password']) < 6) {
            echo 'Password is too short';
        } else {


            if ($this->model->updatePassword($_SESSION['uid'], urldecode($_POST['oldpassword']),
                urldecode($_POST['password']))) {
                echo 'ok';
            } else {
                echo 'Invalid old password';
            }
        }
    }

    public function changeEmailAction()
    {
        if (!isset($_SESSION['uid'])) {
            echo "Unable to identificate user, Please, try login again";
        } elseif (!isset($_POST['email'])) {
            echo "Invalid data. Please, try again";
        } elseif (!preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $_POST['email'])) {
            echo "Wrong e-mail format. Please repeat input";
        } else {
            if ($this->model->updateEmail($_SESSION['uid'], $_POST['email'])) {
                echo 'ok';
            } else {
                echo 'user with the same e-mail already exist';
            }
        }
    }
}