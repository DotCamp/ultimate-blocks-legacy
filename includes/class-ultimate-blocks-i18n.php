<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.2
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/includes
 * @author     Imtiaz Rayhan <imtiazrayhan@gmail.com>
 */
class Ultimate_Blocks_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.2
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'ultimate-blocks',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}

}
