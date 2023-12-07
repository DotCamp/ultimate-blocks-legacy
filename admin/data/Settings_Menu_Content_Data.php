<?php
/**
 * Content data for settings menu.
 *
 * @package ultimate-blocks
 */

namespace Ultimate_Blocks\admin\data;

use Ultimate_Blocks\includes\common\interfaces\I_Plugin_Data;

/**
 * Content data for settings menu.
 */
class Settings_Menu_Content_Data implements I_Plugin_Data {

	/**
	 * Get data.
	 *
	 * @return mixed data
	 */
	public static function get_data() {
		$defaultContent = esc_html__(
			'All the essential Gutenberg blocks you need in one plugin! Ultimate Blocks comes with blocks to take your content to the next level!',
			'ultimate-blocks'
		);

		return array(
			'welcome'       => array(
				'title'   => esc_html__( 'Welcome to Ultimate Blocks', 'ultimate-blocks' ),
				'content' => $defaultContent,
			),
			'documentation' => array(
				'title'   => esc_html__( 'Documentation', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Find detailed documentation and usage instructions for all Ultimate Blocks features.',
					'ultimate-blocks'
				),
			),
			'support'       => array(
				'title'   => esc_html__( 'Support', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Need help or have questions? Our support team is here to assist you.',
					'ultimate-blocks'
				),
			),
			'community'     => array(
				'title'   => esc_html__( 'Community', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Join our community forums to connect with other users and share your experiences.',
					'ultimate-blocks'
				),
			),
			'upgrade'       => array(
				'title'   => esc_html__( 'Upgrade to Ultimate Blocks PRO!', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Unlock a world of enhanced capabilities and premium functionalities with Ultimate Blocks Pro. Upgrading allows you to access advanced tools and take your content to new heights. Experience the full potential of Ultimate Blocks Pro by upgrading now!',
					'ultimate-blocks'
				),
			),
			'globalControl' => array(
				'title'   => esc_html__( 'Global Control', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Global control allows users to easily enable or disable all available blocks together, simplifying block management',
					'ultimate-blocks'
				),
			),
			'extensionGlobalControl' => array(
				'title'   => esc_html__( 'Global Control', 'ultimate-blocks' ),
				'content' => esc_html__(
					'Global control allows users to easily enable or disable all available extensions together, simplifying extension management',
					'ultimate-blocks'
				),
			),
		);
	}
}
