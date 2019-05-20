<?php

namespace application\controllers;

use application\core\Controller;

class MainController extends Controller {
    
    public function indexAction() {
        $vars = $this->model->getLoggedUserData();
        $vars['styles'] = array('main.css');
        $vars['scripts'] = array('main.js');
        $this->view->render('Main page', $vars);
    }

    public function actionAction() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
            if ($_POST['action'] == 'loadFeed' && isset($_POST['img_num']) && is_numeric($_POST['img_num'])) {
                $this->loadFeed((isset($_POST['uid']) && is_numeric($_POST['uid'])) ? $_POST['uid'] : 0, $_POST['img_num']);
            } else if ($_POST['action'] == 'addLike' && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->addLike($_POST['image_id']);
            } else if ($_POST['action'] == 'removeLike' && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->removeLike($_POST['image_id']);
            } else if ($_POST['action'] == 'deleteImage' && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->deleteImage($_POST['image_id']);
            } else if ($_POST['action'] == 'getPost' && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->getPost($_POST['image_id']);
            }
        }
    }

    protected function loadFeed($uid, $img_num) {
        if ($imgData = $this->model->loadFeed($img_num, $uid)) {
            $htmlItem = (string)count($imgData);
            $currentUid = isset($_SESSION['uid']) ? $_SESSION['uid'] : 0;
            foreach ($imgData as $image) {
                $user = ($image["username"]) ? $image["username"] : "user ID: {$image["uid"]}";
                $isLiked = ($image["liked"]) ? 'liked' : 'unliked';
                $delete = ($image['uid'] == $currentUid) ? "<img class=\"delete\" image_id=\"{$image["img_id"]}\" src=\"/public/img/default/1px.png\">" : "";
                $htmlItem .= <<< FEED_ITEM
                    <div class="element" image_id="{$image["img_id"]}" style="background-image: url('{$image["img_url"]}')">
                        <div class="elementData">
                            <div class="username"><a href="?uid={$image["uid"]}">$user</a></div>
                            <div class="likes">
                                <span>{$image["img_likes"]}</span>
                                <img class="$isLiked" image_id="{$image["img_id"]}" src="public/img/default/1px.png"/>
                            </div>
                            $delete
                            <div class="elementTitle">{$image["img_title"]}</div>
                            <a class="comments" href="javascript:void(0)">{$image["img_comments"]} comments</a>
                        </div>
                    </div>
FEED_ITEM;
            }
            echo $htmlItem;
        } else {
            echo "";
        }
    }

    protected function addLike($image_id) {
        if (!isset($_SESSION['uid'])) {
            die ('Only registered users can like images');
        }
        if ($this->model->addLike($image_id)) {
            echo "ok";
        } else {
            echo "ko";
        }
    }

    protected function removeLike($image_id) {
        if (!isset($_SESSION['uid'])) {
            die ('You logged out. Please sign in again to unlike images');
        }
        if ($this->model->removeLike($image_id)) {
            echo "ok";
        } else {
            echo "ko";
        }
    }

    protected function deleteImage($image_id) {
        if (!isset($_SESSION['uid'])) {
            die ('You logged out. Please sign in again to unlike images');
        }
        $result = $this->model->deleteImage($image_id);
        if ($result) {
            if ($result !== true && file_exists($result)) {
                unlink($result);
            }
            echo "ok";
        } else {
            echo "There is something wrong with our database or image doesn't exist. Please, write us about this error";
        }
    }

    protected function getPost($image_id) {
        if ($postData = $this->model->getPost($image_id)) {
            $postData['owner'] = (isset($postData['uid']) && $postData['uid'] == $_SESSION['uid']) ? 1 : 0;
            echo json_encode($postData);
        } else {
            echo "null";
        }
    }
}