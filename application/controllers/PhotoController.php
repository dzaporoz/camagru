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
            $vars['posts'] = $this->model->getPosts();
            $this->view->render('Adding a photo', $vars);
        }
    }

    public function loadAction() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_SESSION['uid'])) {
                die('This page is accessible only for logged in users.');
            } elseif ($_SESSION['verified_user'] != 1) {
                die('Please confirm your registration for images posting.');
            }
            if (!isset($_POST['hidden_data']) || strpos($_POST['hidden_data'], 'data:image/png;base64,') !== 0 ||
                strlen($_POST['hidden_data']) > 5000000 || !isset($_POST['onlay']) || !isset($_POST['frame'])) {
                die("An error occured with image data. It's empty, broken or image is too big. Please, try another image.");
            }
            $upload_dir = "public/content/";
            $descr = isset($_POST['description']) ? $_POST['description'] : "";
            $descr = substr(trim($descr), 0, 200);
            $exploded = explode(',', $_POST['hidden_data'], 2);
            $encoded = $exploded[1];
            $decoded = base64_decode($encoded);
            if (!($image = imagecreatefromstring($decoded)) || imagesx($image) != 1024 && imagesy($image) != 768) {
                die ('Wrong image size');
            }
            if ($_POST['onlay'] || $_POST['frame']) {
                $cut = imagecreatetruecolor(1024, 768);
                imagecopy($cut, $image, 0, 0, 0, 0, 1024, 768);
                if ($_POST['frame']) {
                    if (!isset($_POST['frameURL']) || strpos($_POST['frameURL'], 'http://localhost') !== 0) {
                        die ('Invalid frame image data');
                    } elseif (!($frame = imagecreatefrompng($_POST['frameURL']))) {
                        die ('Unable to load frame image. Try again later');
                    }
                    imagecopy($cut, $frame, 0, 0, 0, 0, 1024, 768);
                }
                if ($_POST['onlay']) {
                    if (!isset($_POST['onlayURL']) || strpos($_POST['onlayURL'], 'http://localhost') !== 0) {
                        die ('Invalid onlay image data');
                    } elseif (!isset($_POST['onlayX']) || !isset($_POST['onlayY'])) {
                        die ('Invelid onlay position data');
                    } elseif (!isset($_POST['onlayScale']) || $_POST['onlayScale'] < 1.0 || $_POST['onlayScale'] > 2.1) {
                        die ('Invalid onlay scale data');
                    } elseif (!($onlay = imagecreatefrompng($_POST['onlayURL']))) {
                        die ('Unable to load onlay image');
                    }
                    $scaledOnlay = imagecreatetruecolor(imagesx($onlay) * $_POST['onlayScale'], imagesy($onlay) * $_POST['onlayScale']);
                    imagealphablending($scaledOnlay, false);
                    imagesavealpha($scaledOnlay, true);
                    $transparent = imagecolorallocatealpha($scaledOnlay, 255, 255, 255, 127);
                    imagefilledrectangle($scaledOnlay, 0, 0, imagesx($onlay), imagesy($onlay), $transparent);
                    imagecopyresampled($scaledOnlay, $onlay, 0, 0, 0, 0, imagesx($onlay) * $_POST['onlayScale'], imagesy($onlay) * $_POST['onlayScale'], imagesx($onlay), imagesy($onlay));
                    imagecopy($cut, $scaledOnlay, $_POST['onlayX'], $_POST['onlayY'], 0, 0, imagesx($scaledOnlay), imagesy($scaledOnlay));
                }
                    imagecopy($image, $cut, 0, 0, 0, 0, 1024, 768);
            }
            $path = $upload_dir . time() . ".png";
            if (!imagepng($image, $path)) {
                die ('Error occured while trying to create image file on the server. Please, try again later');
            } else {
                $result = $this->model->addPost($path, $descr);
                if ($result) {
                    echo 'ok';
                } else {
                    unlink($path) or die("An error occured with our database. Please write us about this error.");
                    echo 'An error occured with our database. Please write us about this error.';
                }
            }
        }
    }
}