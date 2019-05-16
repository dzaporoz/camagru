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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_POST['hidden_data']) || strpos($_POST['hidden_data'], 'data:image/png;base64,') !== 0 || strlen($_POST['hidden_data']) > 5000000) {
                die("An error occured with image data. It's empty, broken or image is too big. Please, try another image.");
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
                    unlink($file) or die("An error occured with our database. Please write us about this error.");
                    echo 'An error occured with our database. Please write us about this error.';
                }
            } else {
                echo 'An error occured with our file system. Please write us about this error.';
            }
        }
    }
}