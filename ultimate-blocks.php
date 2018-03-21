<?php
/**
 * Plugin Name: Ultimate Blocks
 * Plugin URI: https://profiles.wordpress.org/imtiazrayhan#content-plugins
 * Description: Ultimate Blocks for Gutenberg.
 * Author: Imtiaz Rayhan
 * Author URI: http://imtiazrayhan.com/
 * Version: 1.0.2
 * License: GPL3+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 *
 * @package UB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// Create a helper function for easy SDK access.
function ub_fs() {
	global $ub_fs;

	if ( ! isset( $ub_fs ) ) {
		// Include Freemius SDK.
		require_once dirname(__FILE__) . '/freemius/start.php';

		$ub_fs = fs_dynamic_init( array(
			'id'                  => '1798',
			'slug'                => 'ultimate-blocks',
			'type'                => 'plugin',
			'public_key'          => 'pk_bd3d3c8e255543256632fd4bb9842',
			'is_premium'          => false,
			'has_addons'          => false,
			'has_paid_plans'      => false,
			'menu'                => array(
				'first-path'     => 'plugins.php',
				'account'        => false,
				'contact'        => false,
			),
		) );
	}

	return $ub_fs;
}

// Init Freemius.
ub_fs();
// Signal that SDK was initiated.
do_action( 'ub_fs_loaded' );


/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';