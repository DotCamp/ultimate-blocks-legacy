<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;

/**
 * Table of Contents block extension.
 */
class Table_Of_Contents_Extension extends Pro_Extension_Upsell {

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
				__( 'Section Icons', 'ultimate-blocks' ),
				__( "Add icons to your table of contents sections for better visual identification.",
					'ultimate-blocks' )
			]
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
		$additional_settings_panel_controls = [
			Pro_Editor_Control_Data::generate_icon_control_data( 'icon',
				__( 'Current icon', 'ultimate-blocks' ), 'book-bookmark' ),
		];

		return [
			Pro_Editor_Control_Data::generate_panel_data( 'additionalSettingsPanel',
				__( 'Additional Settings', 'ultimate-blocks' ),
				$additional_settings_panel_controls ),
		];
	}
}
