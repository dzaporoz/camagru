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
            $vars['scripts'] = array('settings.js');
            $this->view->render('User settings', $vars);
        }
    }
}