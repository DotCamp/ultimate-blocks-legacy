<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */

function ub_render_tab_block($attributes, $contents){
    extract($attributes);
    return '<div class="wp-block-ub-tabbed-content-tab-content-wrap '.($isActive ? 'active' : 'ub-hide').'">
    '.$contents.'
</div>';
}

function ub_register_tab_block(){
    if(function_exists('register_block_type')){
        register_block_type('ub/tab-block', array(
            'attributes' => array(
                'isActive' => array(
                    'type' => 'boolean',
                    'default' => true
                )
            ), 'render_callback' =>  'ub_render_tab_block'));
    }
}

function ub_render_tabbed_content_block($attributes, $contents){
    extract($attributes);
    $blockName = 'wp-block-ub-tabbed-content';

    $tabs = '';

    foreach($tabsTitle as $key=>$title){
        $tabs .= '<div class = "'.$blockName.'-tab-title-wrap'.($activeTab == $key ? ' active' : '').'"
        style="background-color: '.($activeTab == $key ? $theme : 'initial')
            .'; border-color: '.($activeTab == $key ? $theme : 'lightgrey').
            '; color: '.($activeTab == $key ? $titleColor : '#000000').';">
            <div class="'.$blockName.'-tab-title">'.$title.'</div></div>';
    }

    return '<div class="'.$blockName.' '.$blockName.'-holder '.$className.'">
    <div class="'.$blockName.'-tabs-title"}>'.
    $tabs.'</div>
    <div class="'.$blockName.'-tabs-content">'.
    $contents.'</div>
</div>';
}

function ub_register_tabbed_content_block(){
    if(function_exists('register_block_type')){
        register_block_type('ub/tabbed-content-block', array(
            'attributes' => array(
                'activeTab' => array(
                    'type' => 'number',
                    'default' => 0
                ),
                'theme' => array(
                    'type' => 'string',
                    'default' => '#eeeeee'
                ),
                'titleColor' => array(
                    'type' => 'string',
                    'default' => '#000000'
                ),
                'tabsTitle' => array(
                    'type' => 'array',
                    'default' => array()
                )
            ), 'render_callback' =>  'ub_render_tabbed_content_block'));
    }
}

function ub_tabbed_content_add_frontend_assets() {
    if ( has_block( 'ub/tabbed-content') or has_block('ub/tabbed-content-block') ) {
        wp_enqueue_script(
            'ultimate_blocks-tabbed-content-front-script',
            plugins_url( 'tabbed-content/front.js', dirname( __FILE__ ) ),
            array(),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action( 'wp_enqueue_scripts', 'ub_tabbed_content_add_frontend_assets' );
add_action('init', 'ub_register_tabbed_content_block');
add_action('init', 'ub_register_tab_block');