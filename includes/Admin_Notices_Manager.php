<?php

namespace Ultimate_Blocks\includes;

use function add_action;

/**
 * Class Admin_Notices_Manager
 *
 * Manager for handling admin notice messages.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Admin_Notices_Manager {
	/**
	 * Notice warning type.
	 */
	const WARNING = 'notice-warning';

	/**
	 * Notice info type.
	 */
	const INFO = 'updated notice';

	/**
	 * Error info type.
	 */
	const ERROR = 'notice-error';

	/**
	 * Add supplied callable to admin notices hook.
	 *
	 * @param callable $callable
	 */
	protected static function add_admin_action( $callable ) {
		add_action( 'admin_notices', $callable );
	}

	/**
	 * Show admin notice.
	 *
	 * @param string $message message
	 * @param string $type notice type, use defined notice type constants
	 * @param callable $callback_before callable to be called before printing message to admin notice
	 */
	public static function show_notice( $message, $type = self::INFO, $callback_before = null ) {
		if ( $callback_before !== null && is_callable( $callback_before ) ) {
			call_user_func( $callback_before );
		}

		static::add_admin_action( function () use ( $message, $type ) {
			printf( '<div class="notice is-dismissible %1$s"><p>%2$s</p></div>', esc_attr( $type ), $message );
		} );
	}
}
