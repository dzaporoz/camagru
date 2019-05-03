<?php

namespace application\models;

use application\core\Model;

class Account extends Model {
    
#    public function __construct() {
#        echo 'model works';
#    }

    public function checkLoginData($login, $password) {
        $hash = hash('whirlpool', $password);
        $sql = 'SELECT uid FROM users WHERE username = :username AND password = :password';
        $params = array('username' => $login, 'password' => $hash);
        return $this->db->row($sql, $params);
    }

    public function register($login, $password) {
        $sql = 'SELECT uid FROM users WHERE username = :username';
        $params = array('username' => $login);
        if ($this->db->row($sql, $params)) {
            return false;
        } else {
            $hash = whirlpool($password);
            $sql = 'INSERT INTO users (username,password) VALUES (:username, :pasword)';
            $params = array('username' => $login, 'password' => $hash);
            $this->db->query($sql, $params);
            return true;
        }
    }
}