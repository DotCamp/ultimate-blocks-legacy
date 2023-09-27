<?php

namespace Ultimate_Blocks\includes\managers;

use WP_Filesystem_Base;
use function add_filter;

/**
 * Class to handle plugin filesystem operations.
 */
class Ub_Fs_Handler {

	private static function add_filesystem_method_filter() {
		add_filter( 'filesystem_method', function ( $method, $filter_args ) {
			if ( ! empty( $filter_args['ub_fs_handler'] ) && $filter_args['ub_fs_handler'] === true ) {
				$method = 'direct';
			}

			return $method;
		}, 10, 2 );
	}

	private static function generate_args() {
		return [
			'ub_fs_handler' => true
		];
	}

	/**
	 * Get WordPress filesystem instance.
	 * @return WP_Filesystem_Base | false WP_Filesystem_Base object on success, false on failure
	 */
	public static function get_filesystem() {
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
		}
		global $wp_filesystem;

		self::add_filesystem_method_filter( self::generate_args() );

		$status = WP_Filesystem( self::generate_args() );

		return $status ? $wp_filesystem : false;
	}

	public static function with_filesystem( $callable ) {
		if ( is_callable( $callable ) ) {
			$return_val = call_user_func( $callable, self::get_filesystem() );

			WP_Filesystem();
			return $return_val;
		}
	}
}
