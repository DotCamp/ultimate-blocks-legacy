<?php

namespace Ultimate_Blocks\includes\common\traits;

/**
 * Singleton trait.
 */
trait Singleton_Trait {
	/**
	 * Class instance options.
	 * @private
	 * @var array
	 */
	private $class_options = [];

	/**
	 * Manager base instance.
	 * @var null|object
	 */
	protected static $instance = null;

	/**
	 * Class instance constructor.
	 *
	 * @param array $const_args constructor args
	 */
	protected function __construct( $const_args = [] ) {
		$this->class_options = $const_args;
	}

	/**
	 * Get class instance.
	 *
	 * @param array $constructor_args constructor args
	 * @param string|null $class_name class name to create instance
	 *
	 * @return object object instance
	 */
	public static function get_instance( $constructor_args = [], $class_name = null ) {
		if ( is_null( static::$instance ) ) {
			static::create_instance( $constructor_args, $class_name );
		}

		return static::$instance;
	}

	/**
	 * Force create instance of singleton if it there is none.
	 *
	 * @param array $constructor_args constructor args
	 * @param string|null $class_name class name to create instance
	 *
	 * @return void
	 */
	protected static final function create_instance( $constructor_args = [], $class_name = null ) {
		if ( is_null( static::$instance ) ) {
			$class_name = __CLASS__;

			if ( ! is_null( $class_name ) ) {
				$class_name = class_exists( $class_name ) ? $class_name : __CLASS__;
			}

			static::$instance = new $class_name( $constructor_args );
		}
	}
}
