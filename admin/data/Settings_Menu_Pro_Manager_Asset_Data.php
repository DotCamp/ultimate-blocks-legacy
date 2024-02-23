<?php
/**
 * Asset data for settings menu.
 *
 * @package ultimate-blocks
 */

namespace Ultimate_Blocks\admin\data;

use Ultimate_Blocks\includes\common\interfaces\I_Plugin_Data;

/**
 * Asset data for settings menu.
 */
class Settings_Menu_Pro_Manager_Asset_Data implements I_Plugin_Data {

	/**
	 * Get data.
	 *
	 * @return mixed data
	 */
	public static function get_data() {
		return array(
			'proBuyUrl'      => 'https://ultimateblocks.com/pricing/',
			'youtubeVideoId' => 'I1LEsUvxGDc',
			'documentsUrl'   => 'https://ultimateblocks.com/docs/',
			'supportUrl'     => 'https://ultimateblocks.com/community/',
			'facebookUrl'    => 'https://www.facebook.com/UltimateBlocks',
			'twitterUrl'     => 'https://twitter.com/Ultimate_Blocks',
			'youtubeUrl'     => 'https://www.youtube.com/@ultimateblockswp',
		);
	}
}
