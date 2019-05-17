<?php

/**
 * Enqueue frontend script for table fo contents block
 *
 * @return void
 */
function ub_content_filter_add_frontend_assets() {
    if ( has_block( 'ub/content-filter' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-table-of-contents-front-script',
            plugins_url( 'content-filter/front.js', dirname( __FILE__ ) ),
            array( 'jquery' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action( 'wp_enqueue_scripts', 'ub_content_filter_add_frontend_assets' );