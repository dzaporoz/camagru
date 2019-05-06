<?php

namespace application\controllers;

use application\core\Controller;

class AccountController extends Controller {
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

    public function registerAction() {
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        $vars = array('corner' => '<a href="/account/login">Log in</a>');
        if (empty($_POST)) {
            $this->view->render('Register page', $vars);
        } else {
            $result = $this->model->register($_POST['username'], $_POST['password'], $_POST['email']);    
            if (!$result) {
                $vars['msg'] = 'Error. Try again';
                $this->view->render('Register page', $vars);
            }
            else {
                $this->view->redirect('/account/login');
            }
        }
    }
}