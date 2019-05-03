<?php

namespace application\controllers;

use application\core\Controller;

class AccountController extends Controller {
    public function loginAction() {
        if (!empty($_POST)) {
            $result = $this->model->checkLoginData($_POST['username'], $_POST['password']);    
            if (!$result) {
                $this->view->render('Login page', array('msg' => 'Wrong password'));
            }
            else {
                session_start();
                $_SESSION['uid'] = $result['uid'];
                $this->view->redirect('/');
            }
        } else {
            $this->view->render('Login page');
        }
    }

    public function registerAction() {
        $this->view->render('Register page');
    }
}
