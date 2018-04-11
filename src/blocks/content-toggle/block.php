<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function add_frontend_assets() {
	wp_enqueue_script(
		'ultimate_blocks-content-toggle-front-script',
		plugins_url( 'content-toggle/front.js', dirname( __FILE__ ) ),
		array( 'jquery' ),
		'',
		true
	);
}

add_action( 'wp_enqueue_scripts', 'add_frontend_assets' );
