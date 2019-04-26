<?php
namespace application\core;

use application\core\View;

abstract class Controller {

    public $route;
    public $viev;

    public function __construct($route) {
        $this->route = $route;
        $this->view = New View($route);
    }
}
