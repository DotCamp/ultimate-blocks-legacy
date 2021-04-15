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

		if(file_exists(wp_upload_dir()['basedir'] . '/ultimate-blocks')){
			unlink(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css');
			unlink(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css');
			unlink(wp_upload_dir()['basedir'] . '/ultimate-blocks/sprite-twitter.png');
			rmdir(wp_upload_dir()['basedir'] . '/ultimate-blocks');
		}

		delete_option('ultimate_blocks_css_version');
		delete_transient( '_welcome_redirect_ub' );
		delete_option( 'UltimateBlocks_installDate', date( 'Y-m-d h:i:s' ) );

		//undefine variables here
		delete_option('ub_icon_choices');
		unregister_setting('ub_settings', 'ub_icon_choices');
	}
	
}
