<?php

namespace application\controllers;

use application\core\Controller;

class MainController extends Controller {
    
    public function indexAction() {
        if (!isset($_SESSION['uid'])) {
            $this->view->redirect('/account/login');
        } else {
        $this->view->render('Main page');
        }
    }
}
