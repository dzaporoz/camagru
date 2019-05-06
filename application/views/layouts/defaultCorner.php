<?php
if (isset($_SESSION['uid'])) {
    echo <<< REGISTERED

REGISTERED;
} else {
    echo <<< UNREGISTERED
        <li id="header-corner"><a href="javascript:void(0);" tabindex="1" >Log in<img src="/public/img/default/not-logged.png" alt="not logged"></a></li>
        <ul class="side-menu">
        <li><a href="#1">подпункт 1</a></li>
        <li><a href="#2">подпункт 2</a></li>
        <li><a href="#3">подпункт 3</a></li>
        </ul>
UNREGISTERED;
}
?>