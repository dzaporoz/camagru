<?php

namespace application\models;

use application\core\Model;

class Account extends Model {
    
#    public function __construct() {
#        echo 'model works';
#    }

    public function login($login, $password) {
        $hash = hash('whirlpool', $password);
        $sql = 'SELECT uid FROM users WHERE username = :username AND password = :password';
        $params = array('username' => $login, 'password' => $hash);
        return $this->db->row($sql, $params);
    }

    public function register($login, $password, $email) {
        $sql = 'SELECT uid FROM users WHERE username = :username OR email = :email';
        $params = array('username' => $login, 'email' => $email);
        if ($this->db->row($sql, $params)) {
            return 'The user with the same login or e-mail is already exist.';
        } else {
            $hash = hash('whirlpool', $password);
            $sql = 'INSERT INTO users (username,password,email) VALUES ( :username, :password, :email)';
            $params = array('username' => $login, 'password' => $hash, 'email' => $email);
            return ($this->db->query($sql, $params)) ? true : false;
        }
    }
}