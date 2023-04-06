<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

/**
 * Extension data for saved styles functionality that can be used throughout supported blocks.
 */
class Saved_Styles_Common {

	/**
	 * Upsell data for saved styles.
	 *
	 * @param array $base_data base data
	 *
	 * @return array upsell data
	 */
	public static function inject_upsell_data( $base_data ) {
		$saved_styles_upsell_data = [
			'savedStylesMain' => [
				__( 'Saved Styles', 'ultimate-blocks' ),
				__( 'Upgrade your editor with the new style saving and updating feature. Save time by reusing styles assigned to blocks and automatically applying default styles to related blocks.',
					'ultimate-blocks' ),
				'common/savedStylesMain.png'
			]
		];

		return array_merge( $base_data, $saved_styles_upsell_data );
	}
}
