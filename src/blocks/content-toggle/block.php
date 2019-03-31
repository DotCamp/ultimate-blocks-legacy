<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function ub_content_toggle_add_frontend_assets() {
    if ( has_block( 'ub/content-toggle' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-content-toggle-front-script',
            plugins_url( 'content-toggle/front.js', dirname( __FILE__ ) ),
            array( 'jquery' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action( 'wp_enqueue_scripts', 'ub_content_toggle_add_frontend_assets' );
