<?php

namespace Ultimate_Blocks\includes;

use Dotenv\Dotenv;
use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function trailingslashit;

/**
 * Manager for handling .env file data.
 */
class Env_Manager {
	use Manager_Base_Trait;

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		if ( file_exists( trailingslashit( ULTIMATE_BLOCKS_PATH ) . '.env' ) ) {
			$dotenv = Dotenv::createImmutable( ULTIMATE_BLOCKS_PATH );
			$dotenv->safeLoad();
		}
	}

	/**
	 * Get value from .env file.
	 *
	 * @param string $key key to get value for
	 *
	 * @return string|null value for given key, null if not set
	 */
	public static function get( $key ) {
		return isset( $_ENV[ $key ] ) ? $_ENV[ $key ] : null;
	}
}
