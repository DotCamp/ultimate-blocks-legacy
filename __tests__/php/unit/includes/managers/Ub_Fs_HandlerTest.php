<?php

namespace Ultimate_Blocks\includes\managers;


use Ultimate_Blocks\__tests__\php\test_bases\TestBase;

/**
 * Test class for Ub_Fs_Handler.
 */
class Ub_Fs_HandlerTest extends TestBase {

	public function testGeneratedArgs(  ) {
		$generated_args = $this->invoke_private_method( Ub_Fs_Handler::class, 'generate_args' );

		$this->assertArrayHasKey(Ub_Fs_Handler::IDENTIFIER, $generated_args);
	}
}

