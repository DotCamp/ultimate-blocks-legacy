<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Advanced Video  block extension.
 */
class Advanced_Video_Extension extends Pro_Extension_Upsell {

	/**
	 * Use generate_upsell_data inside this function to generate your extension upsell data.
	 *
	 * Returned data array structure:
	 *
	 *  [
	 *      [ feature_id =>
	 *          [feature_name, feature_description, feature_screenshot(can be omitted for auto search)]
	 *      ],
	 *      ...
	 *  ]
	 *
	 *  Beside feature_id, remaining data should match arguments of `generate_upsell_data` method.
	 *
	 * @return array data
	 */
	public function add_upsell_data() {
		$base_data = [
			'channelDetails'         => [
				__( 'Channel Details', 'ultimate-blocks' ),
				__( "Add youtube channel details, which includes youtube channel logo, channel name, and subscribe button.", 'ultimate-blocks' )
			],
		];

		return Saved_Styles_Common::inject_upsell_data( $base_data );
	}

	/**
	 * Add data for editor sidebar upsell dummy controls.
	 *
	 * Override this function to actually send data, default is an empty array.
	 *
	 * @return array editor control data
	 */
	public function add_editor_dummy_control_data() {
		$channel_details = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'channelDetails',
				__( 'Channel Details', 'ultimate-blocks' ) ),
		];


		return [
			Pro_Editor_Control_Data::generate_panel_data( 'channelDetailsPanel', __( 'Channel Details', 'ultimate-blocks' ),
				$channel_details ),
		];
	}
}
