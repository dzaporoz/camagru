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
            if (!isset($_POST['hidden_data']) || strpos($_POST['hidden_data'], 'data:image/png;base64,') !== 0 ||
                strlen($_POST['hidden_data']) > 5000000 || !isset($_POST['onlay']) || !isset($_POST['frame'])) {
                die("An error occured with image data. It's empty, broken or image is too big. Please, try another image.");
            }
            $upload_dir = "public/content/";
            $descr = isset($_POST['description']) ? $_POST['description'] : "";
            $descr = substr(trim($descr), 0, 200);






            if (!($image = imagecreatefromstring($_POST['hidden_data'])) || imagesx($image) != 1024 && imagesy($image) != 768) {
                die ('Wrong image size');
            }
            if ($_POST['frame']) {
                if (!isset($_POST['frameURL']) || strpos($_POST['frameURL'], 'http://localhost') !== 0) {
                    die ('Invalid frame image data');
                } elseif (!($frame = imagecreatefrompng($_POST['frameURL']))) {
                    die ('Unable to load frame image');
                }
                //tut nalojenie ramki
            }

            if ($_POST['onlay']) {
                if (!isset($_POST['onlayURL']) || strpos($_POST['onlayURL'], 'http://localhost') !== 0) {
                    die ('Invalid onlay image data');
                } elseif (!($frame = imagecreatefrompng($_POST['onlayURL']))) {
                    die ('Unable to load onlay image');
                } elseif (!isset($_POST['onlayX']) || !isset($_POST['onlayY'])) {
                    die ('Invelid onlay posiiton data');
                } elseif (!isset($_POST['onlayScale']) || $_POST['onlayScale'] < 1 || $_POST['onlayScale'] > 2) {
                    die ('Invalid onlay scale data');
                }
                //tut nalojenie ramki
            }




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