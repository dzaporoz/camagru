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
            } else if ($_POST['action'] == 'addComment' && isset($_POST['comment_text']) && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->addComment($_POST['comment_text'], $_POST['image_id']);
            } else if ($_POST['action'] == 'showComments' && isset($_POST['image_id']) && is_numeric($_POST['image_id'])) {
                $this->showComments($_POST['image_id']);
            } else if ($_POST['action'] == 'deleteComment' && isset($_POST['comment_id']) && is_numeric($_POST['comment_id'])) {
                $this->deleteComment($_POST['comment_id']);
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
                $commentS = ($image['img_comments'] == 1) ? "" : "s";
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
                            <a class="comments" href="javascript:void(0)">{$image["img_comments"]} comment$commentS</a>
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
            $postData['img_title'] = htmlspecialchars($postData['img_title']);
            echo json_encode($postData);
        } else {
            echo "null";
        }
    }

    protected function addComment($comment_text, $image_id) {
        if (isset($_SESSION['uid'])) {
            if ($this->model->addComment($image_id, $comment_text)) {
                echo 'ok';
                if (($mailData = $this->model->getCommentMailData($_SESSION['uid'], $image_id)) && $mailData['email_confirmed'] && $mailData['send_notif']) {
                    $recipient = $mailData['email'];
                    $mail_subject = "You have a new comment under your post";
                    $userData = (isset($mailData['username']) && $mailData['username']) ?
                        "User <a href=\"\">{$mailData['username']}<a>" : "Some user";
                    $mail_message = <<< LETTER_TEXT
$userData leave comment under your post:<br>$comment_text
LETTER_TEXT;
                    var_dump($mailData);
                    die;
               }
            } else {
                echo "There is something wrong with our database or image doesn't exist. Please, write us about this error";
            }
        } else {
            echo 'You logged out. Please sign in again to unlike images';
        }
    }

    protected function showComments($image_id) {
        $uid = (isset($_SESSION['uid'])) ? $_SESSION['uid'] : 0;
        if ($comments = $this->model->getComments($image_id)) {
            foreach ($comments as $comment) {
                $user = ($comment["username"]) ? $comment["username"] : "user ID: {$comment["uid"]}";
                $delete = ($uid == $comment['uid']) ? "<img class=\"delete\" src=\"/public/img/default/1px.png\"/>" : "";
                $commentText = htmlspecialchars($comment['comment_text']);
                echo <<< COMMENT
                    <div class="comment" comment_id="{$comment["comment_id"]}">
                        <a href="?uid={$comment["uid"]}">$user</a>,  {$comment["comment_time"]}$delete
                        <span>$commentText</span>
                        <hr/>
                    </div>
COMMENT;
            }
        } else if ($comments === false) {
            echo 'ko';
        } else {
            echo "";
        }
    }

    protected function deleteComment($comment_id) {
        if (!isset($_SESSION['uid'])) {
            die('You logged out. Please sign in again to delete comments');
        }
        $result = $this->model->deleteComment($comment_id);
        if ($result) {
            echo "ok";
        } else if ($result === 0) {
            echo "The comment_id / user_id pair is enexist";
        } else {
            echo "There is something wrong with our database or image doesn't exist. Please, write us about this error";
        }
    }

    protected function sendEmail($recipient, $mail_subject, $mail_message) {
        $encoding = "utf-8";
        $sender_mail = "dzaporoz@student.unit.ua";
        $preferences = array(
            "input-charset" => $encoding,
            "output-charset" => $encoding,
            "line-length" => 76,
            "line-break-chars" => "\r\n"
        );

        $header = "Content-type: text/html; charset=$encoding \r\n";
        $header .= "From: $sender_mail \r\n";
        $header .= "MIME-Version: 1.0 \r\n";
        $header .= "Content-Transfer-Encoding: 8bit \r\n";
        $header .= "Date: ".date("r (T)")." \r\n";
        $header .= iconv_mime_encode("Subject", $mail_subject, $preferences);
        $result = mail($recipient, $mail_subject, $mail_message, $header);
        var_dump($result);
        if (!$result) {
            echo error_get_last()['message'];
        }
    }
}