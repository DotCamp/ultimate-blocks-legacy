<?php

/**
 * Fired during plugin activation
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.2
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 * @author     Imtiaz Rayhan <imtiazrayhan@gmail.com>
 */
class Ultimate_Blocks_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.2
	 */
	public static function activate() {

		set_transient( '_welcome_redirect_ub', true, 60 );

		require_once ULTIMATE_BLOCKS_PATH . 'includes/class-ultimate-blocks-util.php';

		$blocks = get_option( 'ultimate_blocks', false );

		if ( ! $blocks ) {
			update_option( 'ultimate_blocks', Ultimate_Blocks_Util::blocks() );
		}

		if(!get_option('ultimate_blocks_css_version')){
			add_option( 'ultimate_blocks_css_version', Ultimate_Blocks_Constants::plugin_version());
		}

		add_option( 'UltimateBlocks_installDate', date( 'Y-m-d h:i:s' ) );
		add_option( 'UltimateBlocks_review_notify', 'no' );

	}

}
