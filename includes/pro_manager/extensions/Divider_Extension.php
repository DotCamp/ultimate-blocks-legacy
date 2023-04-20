<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Divider block extension.
 */
class Divider_Extension extends Pro_Extension_Upsell {

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
		return [
			'icon' => [
				__( 'Icon', 'ultimate-blocks' ),
				__( "Add visually appealing icons to your divider elements and enhance user engagement.",
					'ultimate-blocks' )
			],
		];
	}

	/**
	 * Add data for editor sidebar upsell dummy controls.
	 *
	 * Override this function to actually send data, default is an empty array.
	 *
	 * @return array editor control data
	 */
	public function add_editor_dummy_control_data() {
		$icon_panel_content = [
			Pro_Editor_Control_Data::generate_icon_control_data( 'icon',
				__( 'Icon', 'ultimate-blocks' ) ),
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'iconPanel', __( 'Divider Icon', 'ultimate-blocks' ),
				$icon_panel_content ),
		];
	}
}
