<?php

/**
 * Enqueue frontend script for table fo contents block
 *
 * @return void
 */
function ub_table_of_contents_add_frontend_assets() {
	wp_enqueue_script(
		'ultimate_blocks-table-of-contents-front-script',
		plugins_url( 'table-of-contents/front.js', dirname( __FILE__ ) ),
		array( 'jquery' ),
		'1.0',
		true
	);
}

add_action( 'wp_enqueue_scripts', 'ub_table_of_contents_add_frontend_assets' );