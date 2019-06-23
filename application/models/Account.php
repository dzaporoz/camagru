<?php

namespace application\models;

use application\core\Model;

class Account extends Model {

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
            $hashedPassword = hash('whirlpool', $password);
            $hash = md5( rand(0,1000) );
            $sql = 'INSERT INTO users (username,password,email,hash) VALUES ( :username, :password, :email, :hash)';
            $params = array('username' => $login, 'password' => $hashedPassword, 'email' => $email, 'hash' => $hash);
            return ($this->db->query($sql, $params)) ? true : false;
        }
    }

    public function getUserHash($login) {
        $sql = 'SELECT hash FROM users WHERE username = :username OR email = :username';
        $params = array('username' => $login);
        return ($this->db->row($sql, $params));
    }

    public function confirmUserByEmail($email) {
        $sql = 'SELECT uid FROM users WHERE email = :email';
        $params = array('email' => $email);
        return ($this->db->row($sql, $params));
    }

    public function verifyUser($email, $hash) {
        $sql = 'SELECT * FROM users WHERE email = :email AND hash = :hash';
        $params = array('email' => $email, 'hash' => $hash);
        if ($this->db->row($sql, $params)) {
            $sql = 'UPDATE users SET email_confirmed = 1 WHERE users.email = :email';
            $params = array('email' => $email);
            return $this->db->query($sql, $params);
        } else {
            return false;
        }
    }

    public function updatePassword($email, $hash, $password) {
        $sql = 'UPDATE users SET password = :password WHERE email = :email AND hash = :hash';
        $params = array('email' => $email, 'hash' => $hash, 'password' => hash('whirlpool', $password));
        return $this->db->query($sql, $params);
    }

    public function getReverificationData($uid)
    {
        if (!$uid) {return false; }
        $sql = 'SELECT email, hash, email_confirmed FROM users WHERE uid = :uid';
        $params = array('uid' => $uid);
        return $this->db->row($sql, $params);
    }
}