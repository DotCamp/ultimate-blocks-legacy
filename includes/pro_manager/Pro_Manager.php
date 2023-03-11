<?php

namespace Ultimate_Blocks\includes\pro_manager;


use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use Ultimate_Blocks\includes\Editor_Data_Manager;
use Ultimate_Blocks\includes\pro_manager\extensions\Tabbed_Content_Extension;

/**
 * Manager for handling features based on availability of pro version from base version.
 */
class Pro_Manager {
	use Manager_Base_Trait;

	/**
	 * Get pro status of plugin.
	 * @return boolean pro status
	 */
	public function is_pro() {
		// TODO [ErdemBircan] implement real check logic after provider implementation
		return false;
	}

	/**
	 * Prepare upsell related extension data.
	 * @return array upsell data
	 */
	private function prepare_priority_upsell_data() {
		// Tabbed content extension
		$tabbed_content_upsell      = new Tabbed_Content_Extension( 'ub/tabbed-content-block' );
		$tabbed_content_upsell_data = $tabbed_content_upsell->get_upsell_data();

		$final_upsell_extension_data = array_merge_recursive( [], $tabbed_content_upsell_data );

		return [
			'upsellExtensionData' => $final_upsell_extension_data
		];
	}

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		if ( ! $this->is_pro() ) {
			Editor_Data_Manager::get_instance()->add_priority_data( $this->prepare_priority_upsell_data() );
		}

		Editor_Data_Manager::get_instance()->add_priority_data( [
			'proStatus' => json_encode( $this->is_pro() )
		] );
	}
}
