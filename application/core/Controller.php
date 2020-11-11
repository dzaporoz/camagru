<?php
namespace application\core;

abstract class Controller {

    public $route;
    public $view;
    public $model;

    public function __construct($route) {
        $this->route = $route;
        $this->view = New View($route);
        $this->model = $this->loadModel($route['controller']);
        if (session_status() != PHP_SESSION_ACTIVE) {
            session_start();
        }
    }

    public function loadModel($name) {
        $path = 'application\models\\'.ucfirst($name);
        if (class_exists($path)) {
            return new $path();
        }
    }
}
