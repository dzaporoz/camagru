<?php

namespace application\controllers;

use application\core\Controller;

class PhotoController extends Controller {
    
    public function addAction() {
        if (!isset($_SESSION['uid'])) {
            $this->view->redirect('/');
            exit();
        } else {
            $vars = $this->model->getLoggedUserData();
            $vars['styles'] = array('photo.css');
            $vars['scripts'] = array('photo.js');
            $this->view->render('Adding a photo', $vars);
        }
    }
}