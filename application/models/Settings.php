<?php

namespace application\models;

use application\core\Model;

class Settings extends Model {

    public function getLoggedUserData() {
        if (!isset($_SESSION['uid'])) {
            return false;
        } else {
            $sql = 'SELECT username, user_logo FROM users WHERE uid= :uid';
            $params = array('uid' => $_SESSION['uid']);
            return $this->db->row($sql, $params);
        }
    }
}