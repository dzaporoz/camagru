<?php

namespace application\models;

use application\core\Model;

class Photo extends Model {

    public function getLoggedUserData() {
        if (!isset($_SESSION['uid'])) {
            return false;
        } else {
            $sql = 'SELECT username, user_logo FROM users WHERE uid= :uid';
            $params = array('uid' => $_SESSION['uid']);
            return $this->db->row($sql, $params);
        }
    }

    public function addPost($imgUrl, $description) {
        if (!isset($_SESSION['uid'])) {
            return false;
        }
        $sql = 'INSERT INTO images (uid, img_url, img_title) VALUES (:uid, :img_url, :img_title)';
        $params = array('uid' => $_SESSION['uid'], 'img_url' => $imgUrl, 'img_title' => $description);
        return $this->db->insert($sql, $params);    
    }

    public function getPosts()
    {
        $sql = "SELECT images.img_id, images.uid, images.img_url FROM images WHERE images.uid = :uid";
        $params = array('uid' => $_SESSION['uid']);
        return $this->db->table($sql, $params);
    }
}