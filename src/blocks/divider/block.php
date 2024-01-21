<?php

function ub_render_divider_block($attributes){
    extract($attributes);
    $divider_style = $orientation === 'horizontal' ?
        'margin-top: ' . $borderHeight . 'px; margin-bottom: ' . $borderHeight . 'px;"' :
        'width:fit-content; height:'. $lineHeight .'';
    return '<div id="ub_divider_' . $blockID.'" class="wp-block-ub-divider ub-divider-orientation-'. $orientation .'"><hr class="ub_divider'.(isset($className) ? ' ' . esc_attr($className) : '').'" '.
    ($blockID === '' ? 'style="'.($orientation === 'horizontal' ? 'border-top' : 'border-left').': ' . $borderSize . 'px ' . $borderStyle . ' ' . $borderColor . ';'. $divider_style .'' :'') . '></hr></div>';
}

function ub_register_divider_block(){
    if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/divider', array(
            'attributes' => $defaultValues['ub/divider']['attributes'],
            'render_callback' => 'ub_render_divider_block'));
    }
}

add_action('init', 'ub_register_divider_block');