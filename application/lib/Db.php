<?php

namespace application\lib;

use PDO;

class Db {
    
    protected $db;

    public function __construct() {
        $config = require 'application/config/db.php';
        try {
            $this->db = new PDO("mysql:host={$config['host']};dbname={$config['dbname']}", $config['user'], $config['password']);
        } catch (\PDOException $e) {
            die ('Unable to connect to the database');
        }
    }
  
    public function query($sql, $params = []) {
        $eval = $this->db->prepare($sql);
        if (!empty($params)) {
            foreach ($params as $key => $value) {
                $eval->bindValue(':'.$key, $value);
            }
        }
        $eval->execute();
        return $eval;
    }

    public function row($sql, $params = []) {
        $result = $this->query($sql, $params);
        return $result->fetch(PDO::FETCH_ASSOC);
    }

    public function table($sql, $params = []) {
        $result = $this->query($sql, $params);
        return $result->fetchAll(PDO::FETCH_ASSOC);
    }

    public function column($sql, $params = []) {
        $result = $this->query($sql, $params);
        return $result->fetchColumn();
    }

    public function insert($sql, $params = []) {
        $result = $this->query($sql, $params)->errorCode();
        return ((int)$result) ? false : true;
    }

    public function delete($sql, $params = []) {
        $result = $this->query($sql, $params);
        return ((int)$result->errorCode()) ? false : $result->rowCount();
    }
}
