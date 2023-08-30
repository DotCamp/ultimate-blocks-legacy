<?php

namespace Ultimate_Blocks;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class PHP_Unit_CheckTest extends TestCase {

	/**
	 * Simple test to see phpunit is working
	 * @return void
	 */
	public function testWorking() {
		$this->assertTrue( true );
	}

	public static function dataProvider() {
		return [
			[ 'test', 'message' ]
		];
	}

	#[DataProvider( 'dataProvider' )]
	public function testDataProvider( string $first_arg, string $second_arg ): void {
		$this->assertEquals( 'test', $first_arg );
		$this->assertEquals( 'message', $second_arg );
	}
}
