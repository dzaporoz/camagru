<?php

namespace application\models;

use application\core\Model;

class Main extends Model {

    public function getLoggedUserData() {
        if (!isset($_SESSION['uid'])) {
            return false;
        } else {
            $sql = 'SELECT username, user_logo FROM users WHERE uid= :uid';
            $params = array('uid' => $_SESSION['uid']);
            return $this->db->row($sql, $params);
        }
    }

    public function loadFeed($img_num, $uid) {
        $current_uid = (isset($_SESSION['uid'])) ? $_SESSION['uid'] : 0;
        $params = array('current_uid' => $current_uid);
        $condition = "";
        if ($uid) {
            $condition = "WHERE images.uid = :uid";
            $params['uid'] = $uid;
        }
        $sql = "SELECT images.img_id, images.uid, images.img_url, images.img_likes, images.img_title, images.img_time, images.img_comments, users.username,
        CASE WHEN EXISTS(SELECT like_id FROM likes WHERE likes.uid = :current_uid AND image_id = images.img_id) THEN 1 ELSE 0 END AS 'liked'
        FROM images LEFT JOIN users ON images.uid = users.uid $condition ORDER BY img_time DESC LIMIT $img_num, 9;";
        return $this->db->table($sql, $params);
    }

    public function addLike($image_id) {
        if (!isset($_SESSION['uid'])) {
            return false;
        }
        $sql = 'SELECT * FROM likes WHERE uid= :uid AND image_id= :image_id';
        $params = array('uid' => $_SESSION['uid'], 'image_id' => $image_id);
        if ($this->db->row($sql, $params)) {
            return true;
        } else {
            $sql = 'INSERT INTO likes(uid, image_id) VALUES (:uid, :image_id)';
            if ($this->db->insert($sql, $params)) {
                $sql = 'UPDATE images SET img_likes = img_likes + 1 WHERE img_id = :img_id';
                $params = array('img_id' => $image_id);
                $this->db->query($sql, $params);
                return true;
            } else {
                return false;
            }
        }
    }

    public function removeLike($image_id) {
        if (!isset($_SESSION['uid'])) {
            return false;
        }
        $sql = 'DELETE FROM likes WHERE uid= :uid AND image_id= :image_id';
        $params = array('uid' => $_SESSION['uid'], 'image_id' => $image_id);
        if ($this->db->delete($sql, $params)) {
            $sql = 'UPDATE images SET img_likes = img_likes - 1 WHERE img_id = :img_id AND img_likes > 0';
            $params = array('img_id' => $image_id);
            $this->db->query($sql, $params);
            return true;
        } else {
            return false;
        }
    }

    public function deleteImage($image_id) {
        if (!isset($_SESSION['uid'])) {
            return false;
        }
        $sql = 'SELECT img_url FROM images WHERE img_id= :img_id';
        $params = array('img_id' => $image_id);
        $img = $this->db->row($sql, $params);
        $sql = 'DELETE FROM images WHERE uid= :uid AND img_id= :img_id';
        //$params = array('uid' => $_SESSION['uid'], 'img_id' => $image_id);
        $params['uid'] = $_SESSION['uid'];
        if ($this->db->delete($sql, $params)) {
            $sql = 'DELETE FROM likes WHERE image_id= :image_id';
            $params = array('image_id' => $image_id);
            $this->db->query($sql, $params);
            if (!$img || !isset($img['img_url'])) {
                return true;
            } else {
            return trim($img['img_url'], '/');
            }
        } else {
            return false;
        }
    }

    public function getPost($image_id) {
        $sql = 'SELECT * FROM images WHERE img_id= :img_id';
        $params = array('img_id' => $image_id);
        return $this->db->row($sql, $params);
    }

    public function addComment($image_id, $comment_text) {
        if (!isset($_SESSION['uid'])) {
            return false;
        }
        $sql = 'INSERT INTO comments(uid, image_id, comment_text) VALUES (:uid, :image_id, :comment_text)';
        $params = array('uid' => $_SESSION['uid'], 'image_id' => $image_id, 'comment_text' => $comment_text);
        if ($this->db->insert($sql, $params)) {
            $sql = 'UPDATE images SET img_comments = img_comments + 1 WHERE img_id = :img_id';
                $params = array('img_id' => $image_id);
                $this->db->query($sql, $params);
                return true;
        }
    }
}