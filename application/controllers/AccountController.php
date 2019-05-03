<?php

namespace application\controllers;

use application\core\Controller;

class AccountController extends Controller {
    public function loginAction() {
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        if (!empty($_POST)) {
            $result = $this->model->login($_POST['username'], $_POST['password']);    
            if (!$result) {
                $this->view->render('Login page', array('msg' => 'Wrong password'));
            }
            else {
                $_SESSION['uid'] = $result['uid'];
                $this->view->redirect('/');
            }
        } else {
            $this->view->render('Login page');
        }
    }

    public function registerAction() {
        if (isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        }
        if (empty($_POST)) {
            $this->view->render('Register page');
        } else {
            $result = $this->model->register($_POST['username'], $_POST['password'], $_POST['email']);    
            if (!$result) {
                $this->view->render('Register page', array('msg' => 'Error. Try again'));
            }
            else {
                var_dump($result);
                $this->view->redirect('/account/login');
            }
        }
    }
}