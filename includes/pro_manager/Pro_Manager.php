<?php

namespace Ultimate_Blocks\includes\pro_manager;


use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use Ultimate_Blocks\includes\Editor_Data_Manager;
use Ultimate_Blocks\includes\pro_manager\extensions\Button_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Content_Toggle_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Divider_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Expand_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Image_Slider_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Review_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Social_Share_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Tabbed_Content_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Table_Of_Contents_Extension;

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
		// check if ULTIMATE_BLOCKS_PRO_LICENSE is defined and its value is true
		return defined( 'ULTIMATE_BLOCKS_PRO_LICENSE' ) && ULTIMATE_BLOCKS_PRO_LICENSE;
	}

	/**
	 * Prepare upsell related extension data.
	 * @return array upsell data
	 */
	private function prepare_priority_upsell_data() {
		// Tabbed content extension
		$tabbed_content_upsell      = new Tabbed_Content_Extension( 'ub/tabbed-content-block' );
		$tabbed_content_upsell_data = $tabbed_content_upsell->get_upsell_data();

		// Button extension
		$button_upsell      = new Button_Extension( 'ub/button' );
		$button_upsell_data = $button_upsell->get_upsell_data();

		// Content toggle extension
		$content_toggle_upsell = new Content_Toggle_Extension( 'ub/content-toggle-block' );
		$content_toggle_data   = $content_toggle_upsell->get_upsell_data();

		// Content toggle panel extension
		$content_toggle_panel_upsell = new Content_Toggle_Extension( 'ub/content-toggle-panel-block' );
		$content_toggle_panel_data   = $content_toggle_panel_upsell->get_upsell_data();

		// Divider extension
		$divider_upsell      = new Divider_Extension( 'ub/divider' );
		$divider_upsell_data = $divider_upsell->get_upsell_data();

		// Expand extension
		$expand_upsell      = new Expand_Extension( 'ub/expand' );
		$expand_upsell_data = $expand_upsell->get_upsell_data();

		// Image slider extension
		$image_slider_upsell      = new Image_Slider_Extension( 'ub/image-slider' );
		$image_slider_upsell_data = $image_slider_upsell->get_upsell_data();

		// Review extension
		$review_upsell      = new Review_Extension( 'ub/review' );
		$review_upsell_data = $review_upsell->get_upsell_data();

		// Table of contents extension
		$table_of_contents_upsell      = new Table_Of_Contents_Extension( 'ub/table-of-contents-block' );
		$table_of_contents_upsell_data = $table_of_contents_upsell->get_upsell_data();

		// Social share extension
		$social_share_upsell      = new Social_Share_Extension( 'ub/social-share' );
		$social_share_upsell_data = $social_share_upsell->get_upsell_data();

		$final_upsell_extension_data = array_merge_recursive( [], $tabbed_content_upsell_data, $button_upsell_data,
			$content_toggle_data, $content_toggle_panel_data, $divider_upsell_data, $expand_upsell_data,
			$image_slider_upsell_data,
			$review_upsell_data, $table_of_contents_upsell_data, $social_share_upsell_data );

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
			Editor_Data_Manager::get_instance()->add_editor_data( $this->prepare_priority_upsell_data() );
		}

		Editor_Data_Manager::get_instance()->add_editor_data( [
			'proStatus' => json_encode( $this->is_pro() ),
			'assets'    => [
				'logoUrl' => trailingslashit( ULTIMATE_BLOCKS_URL ) . '/admin/images/logos/icon-128x128.png',
				'proUrl'  => 'https://www.google.com/'
			]
		] );
	}
}
