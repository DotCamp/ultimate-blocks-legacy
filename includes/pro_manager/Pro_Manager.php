<?php

namespace Ultimate_Blocks\includes\pro_manager;


use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;

/**
 * Manager for handling pro version of plugin.
 */
class Pro_Manager {
	use Manager_Base_Trait;

	/**
	 * Get pro status of plugin.
	 * @return void
	 */
	public function is_pro() {
		// TODO [ErdemBircan] implement real check logic after provider implementation
		return false;
	}

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
	}
}
