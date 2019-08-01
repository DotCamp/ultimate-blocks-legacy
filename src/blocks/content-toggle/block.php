<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function ub_content_toggle_add_frontend_assets() {
    if ( has_block( 'ub/content-toggle' ) or has_block('ub/content-toggle-panel') or
        has_block( 'ub/content-toggle-block' ) or has_block('ub/content-toggle-panel-block') ) {
        wp_enqueue_script(
            'ultimate_blocks-content-toggle-front-script',
            plugins_url( 'content-toggle/front.build.js', dirname( __FILE__ ) ),
            array(  ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

function ub_render_content_toggle_block($attributes, $content){
    return '<div class="wp-block-ub-content-toggle'.(isset($className) ? ' ' . esc_attr($className) : '')
            .'" id="ub-content-toggle-'.$attributes['blockID'].'">'.$content.'</div>';
}

function ub_render_content_toggle_panel_block($attributes, $content){
    $classNamePrefix = 'wp-block-ub-content-toggle';
    extract($attributes);

    return '<div class="'.$classNamePrefix.'-accordion'.(isset($className) ? ' ' . esc_attr($className) : '').'">
                <div class="'.$classNamePrefix.'-accordion-title-wrap">
                    <span class="'.$classNamePrefix.'-accordion-title">'.$panelTitle.'</span>
                    <span class="'.$classNamePrefix.
                        '-accordion-state-indicator dashicons dashicons-arrow-right-alt2 '.
                        ($collapsed ? '' : 'open').'"></span>
                </div><div class="'.$classNamePrefix.'-accordion-content-wrap'.
                        ($collapsed?' ub-hide':' ').'">'. $content
                .'</div></div>' ;
}

function ub_register_content_toggle_panel_block() {
	if ( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/content-toggle-panel-block', array(
            'attributes' => $GLOBALS['defaultValues']['ub/content-toggle-panel-block']['attributes'],
			'render_callback' => 'ub_render_content_toggle_panel_block'));
	}
}

function ub_register_content_toggle_block() {
	if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/content-toggle-block',
            array('attributes' => $GLOBALS['defaultValues']['ub/content-toggle-block']['attributes'],
             'render_callback' => 'ub_render_content_toggle_block'));
	}
}

add_action('init', 'ub_register_content_toggle_block');

add_action('init', 'ub_register_content_toggle_panel_block');

add_action( 'wp_enqueue_scripts', 'ub_content_toggle_add_frontend_assets' );
