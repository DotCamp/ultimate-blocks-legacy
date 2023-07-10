<?php

/**
 * Register icon.
 * @return void
 */
function register_icon_block() {
	if ( function_exists( 'register_block_type' ) ) {
		require( trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'src/defaults.php' );

		$block_type_id = 'ub/icon';

		register_block_type( $block_type_id, [
			'attributes'      => $defaultValues[ $block_type_id ]['attributes'],
			'render_callback' => null
		] );

	}

}

add_action( 'init', 'register_icon_block', 10, 1 );
