<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;
use Ultimate_Blocks\includes\pro_manager\inc\Pro_Editor_Control_Data;
use function __;

/**
 * Tabbed content block extension.
 */
class Tabbed_Content_Extension extends Pro_Extension_Upsell {

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
			'callToAction'       => [
				__( 'Call to Action', 'ultimate-blocks' ),
				__( "Transform your tab headers into clickable buttons that redirect to your desired web page  and simplify your visitors's journey by directing them straight to your desired pages.",
					'ultimate-blocks' )
			],
			'titleSecondaryText' => [
				__( 'Tab Title Secondary Text', 'ultimate-blocks' ),
				__( "Elevate your website's user experience with secondary tab headers, allowing for easy differentiation between tabs and ensuring your users find the content they need quickly and efficiently.",
					'ultimate-blocks' )
			],
			'titleIcon'          => [
				__( 'Tab Title Icons', 'ultimate-blocks' ),
				__( "Add icons to your tab headers, making it easier for your users to quickly identify and navigate to the content they're looking for.",
					'ultimate-blocks' )
			]
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
		$cta_content_data = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'callToAction',
				__( 'Convert current tab into call to action', 'ultimate-blocks' ), __(
					'Call to action tab will direct your users to assigned url instead of showing a tab content.',
					'ultimate-blocks'
				) ),
		];

		$general_content_data = [
			Pro_Editor_Control_Data::generate_toggle_control_data( 'titleSecondaryText',
				__( 'Tab title secondary text', 'ultimate-blocks' ) ),
			Pro_Editor_Control_Data::generate_toggle_control_data( 'titleIcon',
				__( 'Tab title icons', 'ultimate-blocks' ) ),
		];


		return [
			Pro_Editor_Control_Data::generate_panel_data( 'generalPanel', __( 'General', 'ultimate-blocks' ),
				$general_content_data ),
			Pro_Editor_Control_Data::generate_panel_data( 'callToActionPanel',
				__( 'Call to Action', 'ultimate-blocks' ),
				$cta_content_data )
		];
	}
}
