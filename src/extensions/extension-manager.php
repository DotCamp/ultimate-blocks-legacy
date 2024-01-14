<?php

class Ultimate_Blocks_Extension_Manager{
     public function __construct() {
          require_once dirname(__DIR__) . '/extensions/responsive-control/class-responsive-control.php';
          require_once dirname(__DIR__) . '/extensions/custom-css/class-custom-css.php';
          add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
     }

     public function enqueue_assets(){
          wp_enqueue_style(
               'ub-extension-style-css',
               plugins_url( 'style.css', __FILE__ ),
               array(),
               false
          );
     }

}

new Ultimate_Blocks_Extension_Manager();