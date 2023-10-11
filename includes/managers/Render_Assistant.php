<?php
/**
 * Render_Assistant class.
 *
 * @package ultimate-blocks
 */

namespace Ultimate_Blocks\includes\managers;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function add_filter;

/**
 * Assistant to improve render operations of plugin blocks.
 */
class Render_Assistant {
	use Manager_Base_Trait;

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'render_block_data', array( $this, 'inject_render_data' ), 10, 1 );
	}

	/**
	 * Inject render data to plugin blocks.
	 *
	 * @param array $block array representation of block.
	 *
	 * @return array block render data
	 */
	public function inject_render_data( $block ) {
		$block_name      = $block['blockName'];
		$is_plugin_block = ! is_null( $block_name ) && preg_match( '/^ub\/(.+)$/', $block_name );

		// only inject render data to plugin blocks.
		if ( $is_plugin_block ) {
			require trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'src/defaults.php';

			// inject data if default values are available.
			if ( isset( $defaultValues[ $block_name ]['attributes'] ) ) {
				$block_default_attrs = $defaultValues[ $block_name ]['attributes'];
				unset( $block_default_attrs['blockID'] );

				// parse default attrs into key=>value format.
				$parsed_default_attrs = array_reduce(
					array_keys( $block_default_attrs ),
					function ( $carry, $attr_id ) use ( $block_default_attrs ) {
						if ( isset( $block_default_attrs[ $attr_id ]['default'] ) ) {
							$carry[ $attr_id ] = $block_default_attrs[ $attr_id ]['default'];
						}

						return $carry;
					},
					array()
				);

				// inject default block attributes into supplied ones.
				$block['attrs'] = array_merge( $parsed_default_attrs, $block['attrs'] );
			}
		}

		return $block;
	}
}
