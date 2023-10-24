<?php
/**
 * Demo data related to plugin blocks.
 *
 * @package ultimate-blocks
 */

namespace Ultimate_Blocks\admin\data\block_demos;

use Ultimate_Blocks\includes\common\interfaces\I_Plugin_Data;

/**
 * Demo data related to plugin blocks.
 */
class Block_Demos_Data implements I_Plugin_Data {

	/**
	 * Get data.
	 *
	 * @return mixed data
	 */
	public static function get_data() {
		ob_start();
		require_once trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'admin/data/block_demos/block-demos.json';
		$block_demos_raw = ob_get_contents();
		ob_end_clean();

		return json_decode( $block_demos_raw, true );
	}
}
