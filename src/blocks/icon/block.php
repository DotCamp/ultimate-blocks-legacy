<?php



function ub_render_icon_block($attributes, $block_content, $block_instance){
	$attrs = $block_instance->parsed_block['attrs'];
	if(!empty($attrs['margin'])){
		$block_content = str_replace('class="wp-block-ub-icon', 'class="wp-block-ub-icon has-ub-icon-margin', $block_content);
	}
	if(!empty($attrs['padding'])){
		$block_content = str_replace('class="wp-block-ub-icon', 'class="wp-block-ub-icon has-ub-icon-padding', $block_content);
	}
	return $block_content;
}

/**
 * Register icon.
 * @return void
 */
function register_icon_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
		require( trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'src/defaults.php' );

		$block_type_id = 'ub/icon';

		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/icon', [
			'attributes'      => $defaultValues[ $block_type_id ]['attributes'],
			'render_callback' => 'ub_render_icon_block'
		] );

	}

}

add_action( 'init', 'register_icon_block', 10, 1 );
