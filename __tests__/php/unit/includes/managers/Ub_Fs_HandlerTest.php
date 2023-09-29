<?php

namespace Ultimate_Blocks\includes\managers;

use Ultimate_Blocks\__tests__\php\test_bases\TestBase;
use Brain\Monkey\Functions;

/**
 * Test class for Ub_Fs_Handler.
 */
class Ub_Fs_HandlerTest extends TestBase {

	public function testGeneratedArgs() {
		$generated_args = $this->invoke_private_method( Ub_Fs_Handler::class, 'generate_args' );

		$this->assertArrayHasKey( Ub_Fs_Handler::IDENTIFIER, $generated_args );
	}

	public function testWithFilesystem() {
		Functions\expect( 'get_filesystem_method' )
			->never();

		// will not be called because non-callable is passed.
		Ub_Fs_Handler::with_filesystem( 'not_a_callable' );

		Functions\expect( 'get_filesystem_method' )
			->once();
		Functions\when( 'WP_Filesystem' )
			->justReturn( true );

		$expected_return_val = 'wp_filesystem_return_val';
		$return_val          = Ub_Fs_Handler::with_filesystem( function () use ( $expected_return_val ) {
			return $expected_return_val;
		} );

		// will be called because callable is passed
		$this->assertEquals( $expected_return_val, $return_val );
	}

	/**
	 * Mock get_filesystem_method function.
	 *
	 * @param string $return_val return value of get_filesystem_method
	 *
	 * @return void
	 */
	private function getFileSystemMethodMock( string $return_val ) {
		Functions\when( 'get_filesystem_method' )->justReturn( $return_val );
	}

	public function testGetFilesystem() {
		global $wp_filesystem;

		$file_system_types = [
			'default' => 'wp_filesystem_default',
			'direct'  => 'wp_filesystem_direct',
		];

		Functions\when( 'WP_Filesystem' )->alias( function ( $args = null ) use (
			&$wp_filesystem,
			$file_system_types
		) {
			if ( is_null( $args ) ) {
				$wp_filesystem = $file_system_types['default'];
			} else {
				$wp_filesystem = $file_system_types['direct'];
			}

			return true;
		} );

		/** Test:start will return current wp_filesystem */
		$this->getFileSystemMethodMock( 'direct' );
		$status = Ub_Fs_Handler::get_filesystem();
		$this->assertEquals( $file_system_types['default'], $status );
		/** Test:end */

		/** Test:start will return direct filesystem because filesystem method is not direct */
		$this->getFileSystemMethodMock( 'ftpext' );
		$status = Ub_Fs_Handler::get_filesystem();
		$this->assertEquals( $file_system_types['direct'], $status );
		/** Test:end */

		/** Test:start when filesystem method is direct and $wp_filesystem global is available, it will not recreate wp_filesystem */
		$wp_filesystem = 'wp_filesystem_direct';
		$this->getFileSystemMethodMock( 'direct' );
		Functions\expect( 'WP_Filesystem' )->never();
		Ub_Fs_Handler::get_filesystem();
		/** Test:end */

		/** Test:start when filesystem method is direct and $wp_filesystem global is not available, it will attempt to recreate wp_filesystem with defaults */
		$wp_filesystem = null;
		$this->getFileSystemMethodMock( 'direct' );
		$status = Ub_Fs_Handler::get_filesystem();
		$this->assertEquals( $file_system_types['default'], $status );
		/** Test:end */
	}

	public function testFilesystemMethodFilter(  ) {
		$this->markTestIncomplete();
	}
}

