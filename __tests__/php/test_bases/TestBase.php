<?php

namespace Ultimate_Blocks\__tests__\php\test_bases;

use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionException;

class TestBase extends TestCase {
	/**
	 * Call private method of an object.
	 *
	 * @param object $object target object
	 * @param string $method_name method name
	 * @param array $args optional method arguments.
	 *
	 * @return mixed method return value
	 * @throws ReflectionException
	 */
	public function invoke_private_method( &$object, $method_name, $args = [] ) {
		$reflection_handler = new ReflectionClass( get_class( $object ) );
		$target_method      = $reflection_handler->getMethod( $method_name );
		$target_method->setAccessible( true );

		return $target_method->invokeArgs( $object, $args );
	}
}
