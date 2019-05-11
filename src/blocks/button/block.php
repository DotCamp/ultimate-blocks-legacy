<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */
function ub_button_add_frontend_assets() {
    if ( has_block( 'ub/button-block' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-button-front-script',
            plugins_url( 'button/front.js', dirname( __FILE__ ) ),
            array( 'jquery' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action( 'wp_enqueue_scripts', 'ub_button_add_frontend_assets' );