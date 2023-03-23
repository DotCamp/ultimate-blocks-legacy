<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;

/**
 * Tabbed content block extension.
 */
class Content_Toggle_Extension extends Pro_Extension_Upsell {

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
			'search' => [
				__( 'Call to Action', 'ultimate-blocks' ),
				__( "Add a search bar feature that lets your users effortlessly search within your minimized content.",
					'ultimate-blocks' )
			],
		];
	}
}
