<?php

function ub_render_divider_block($attributes){
    extract($attributes);
    return '<div class="ub_divider '.esc_attr($className).'" style="border-top: '.$borderSize.'px '.$borderStyle.' '.$borderColor
        .'; margin-top: '.$borderHeight.'px; margin-bottom: '.$borderHeight.'px;"></div>';
}

function ub_register_divider_block(){
    if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/divider', array(
            'attributes' => array(
                'blockID' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'borderSize' => array(
                    'type' => 'number',
                    'default' => 2
                ),
                'borderStyle' => array(
                    'type' => 'string',
                    'default' => 'solid'
                ),
                'borderColor' => array(
                    'type' => 'string',
                    'default' => '#ccc'
                ),
                'borderHeight' => array(
                    'type' => 'number',
                    'default' => 20
                )
            ),
            'render_callback' => 'ub_render_divider_block'));
    }
}

add_action('init', 'ub_register_divider_block');