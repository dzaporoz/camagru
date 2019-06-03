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
        'scripts' => array('register.js'),
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

    public function loginAction() {
        $vars = array('corner' => '<a href="/account/register">Register</a>');
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        if (!empty($_POST)) {
            $result = $this->model->login($_POST['username'], $_POST['password']);    
            if (!$result) {
                $vars['msg'] = 'Wrong pasword';
                $this->view->render('Login page', $vars);
            }
            else {
                $_SESSION['uid'] = $result['uid'];
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
}