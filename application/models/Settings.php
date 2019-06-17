<?php

namespace application\models;

use application\core\Model;

class Settings extends Model {

    public function getLoggedUserData() {
        if (!isset($_SESSION['uid'])) {
            return false;
        } else {
            $sql = 'SELECT username, email, email_confirmed, send_notif FROM users WHERE uid= :uid';
            $params = array('uid' => $_SESSION['uid']);
            return $this->db->row($sql, $params);
        }
    }

    public function updateUsername($uid, $username)
    {
        $sql = 'SELECT uid FROM users WHERE username= :username';
        $params = array('username' => $username);
        if ($this->db->row($sql, $params)) {
            return false;
        } else {
            $sql = 'UPDATE users SET username = :username WHERE uid = :uid';
            $params['uid'] = $uid;
            return $this->db->query($sql, $params);
        }
    }

    public function updatePassword($uid, $oldPassword, $password)
    {
        $sql = 'SELECT uid FROM users WHERE uid= :uid AND password= :password';
        $params = array('uid' => $uid, 'password' => hash('whirlpool', $oldPassword));
        if ($this->db->row($sql, $params)) {
            return false;
        } else {
            $sql = 'UPDATE users SET password = :password WHERE uid = :uid';
            $params['password'] = hash('whirlpool', $password);
            return $this->db->query($sql, $params);
     return true;
        }
    }

    public function updateEmail($uid, $email)
    {
        $sql = 'SELECT uid FROM users WHERE email= :email';
        $params = array('email' => $email);
        if ($this->db->row($sql, $params)) {
            return false;
        } else {
            $sql = 'UPDATE users SET email = :email WHERE uid = :uid';
            $params['uid'] = $uid;
            return $this->db->query($sql, $params);
        }
    }

    public function updateNotif($uid, $action)
    {
        $status = ($action == "check") ? "1" : "0";
        $sql = 'UPDATE users SET send_notif = :status WHERE uid = :uid';
        $params = array('status' => $status, 'uid' => $uid);
        return $this->db->query($sql, $params);
    }
}