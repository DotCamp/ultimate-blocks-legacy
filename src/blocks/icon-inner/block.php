<?php

/**
 * Register icon innerblock.
 * @return void
 */
function register_icon_inner() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
		require( trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'src/defaults.php' );

		$block_type_id = 'ub/icon-innerblock';

		register_block_type_from_metadata( $block_type_id, [
			'attributes'      => $defaultValues[ $block_type_id ]['attributes'],
			'render_callback' => null
		] );

	}

}

add_action( 'init', 'register_icon_inner', 10, 1 );
