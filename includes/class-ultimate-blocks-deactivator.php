<?php

/**
 * Fired during plugin deactivation
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.2
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 * @author     Imtiaz Rayhan <imtiazrayhan@gmail.com>
 */
class Ultimate_Blocks_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.2
	 */
	public static function deactivate() {

		delete_option( 'ultimate_blocks' );
		delete_transient( '_welcome_redirect_ub' );
		delete_option( 'UltimateBlocks_installDate', date( 'Y-m-d h:i:s' ) );
		delete_option( 'UltimateBlocks_review_notify', 'no' );

	}

}
