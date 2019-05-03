<?php
namespace application\core;

use application\core\View;

abstract class Controller {

    public $route;
    public $viev;
    public $model;

    public function __construct($route) {
        $this->route = $route;
        $this->view = New View($route);
        $this->model = $this->loadModel($route['controller']);
    }

    public function loadModel($name) {
        $path = 'application\models\\'.ucfirst($name);
        if (class_exists($path)) {
            return new $path();
        }
    }
}
