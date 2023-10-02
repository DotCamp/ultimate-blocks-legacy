<?php

namespace Ultimate_Blocks\__tests__\php\test_bases;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use ReflectionClass;
use ReflectionException;

class TestBase extends TestCase {
	use MockeryPHPUnitIntegration;

	/**
	 * Call private method of an object.
	 *
	 * @param object | string $class_or_object target object or class
	 * @param string $method_name method name
	 * @param array $args optional method arguments.
	 *
	 * @return mixed method return value
	 * @throws ReflectionException
	 */
	public function invoke_private_method( $class_or_object, $method_name, $args = [] ) {
		$is_static = is_string( $class_or_object );

		$reflection_handler = new ReflectionClass( $is_static ? $class_or_object : get_class( $class_or_object ) );
		$target_method      = $reflection_handler->getMethod( $method_name );
		$target_method->setAccessible( true );

		return $target_method->invokeArgs( $is_static ? null : $class_or_object, $args );
	}

	protected function setUp():void {
		parent::setUp();
		Monkey\setUp();
	}


	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}
}
