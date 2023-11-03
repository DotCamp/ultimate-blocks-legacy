<?php

function ub_render_divider_block($attributes){
    extract($attributes);
    return '<div id="ub_divider_' . $blockID.'"><hr class="ub_divider'.(isset($className) ? ' ' . esc_attr($className) : '').'" '.
    ($blockID === '' ? 'style="border-top: ' . $borderSize . 'px ' . $borderStyle . ' ' . $borderColor . '; margin-top: ' . $borderHeight . 'px; margin-bottom: ' . $borderHeight . 'px;"' :'') . '></hr></div>';
}

function ub_register_divider_block(){
    if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/divider', array(
            'attributes' => $defaultValues['ub/divider']['attributes'],
            'render_callback' => 'ub_render_divider_block'));
    }
}

add_action('init', 'ub_register_divider_block');