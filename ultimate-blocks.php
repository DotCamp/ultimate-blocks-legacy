<?php
/**
 * Plugin Name: Ultimate Blocks
 * Plugin URI: https://profiles.wordpress.org/imtiazrayhan#content-plugins
 * Description: Ultimate Blocks for Gutenberg.
 * Author: Imtiaz Rayhan
 * Author URI: https://imtiazrayhan.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package UB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
