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

    public function loadAction() {
        if (!isset($_POST['hidden_data'])) {
            die('ko');
        }
        $upload_dir = "public/content/";
        $descr = isset($_POST['description']) ? $_POST['description'] : "";
        $descr = substr(trim($descr), 0, 200);
        $img = $_POST['hidden_data'];
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data = base64_decode($img);
        $file = $upload_dir . time() . ".png";
        $result = file_put_contents($file, $data);
        if ($result) {           
            $result = $this->model->addPost($file, $descr);
            if ($result) {
                echo 'ok';
            } else {
                unlink($file) or die("ko");
                echo 'ko';
           }
        } else {
            echo 'ko';
        }
    }
}