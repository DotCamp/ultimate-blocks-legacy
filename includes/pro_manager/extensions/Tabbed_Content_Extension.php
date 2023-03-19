<?php

namespace Ultimate_Blocks\includes\pro_manager\extensions;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Extension_Upsell;

/**
 * Tabbed content block extension.
 */
class Tabbed_Content_Extension extends Pro_Extension_Upsell {

	/**
	 * Use generate_upsell_data inside this function to generate your extension upsell data.
	 */
	public function add_upsell_data() {
		$this->generate_upsell_data( 'callToAction', __( 'Call to Action', 'ultimate-blocks' ),
			__( 'Turn your tabs into links for quick and easy URL interactions.', 'ultimate-blocks' ) );

		$this->generate_upsell_data( 'titleSecondaryText', __( 'Tab Title Secondary Text', 'ultimate-blocks' ),
			__( 'Add secondary text to add more context to your titles.', 'ultimate-blocks' ) );

		$this->generate_upsell_data( 'titleIcon', __( 'Tab Title Icons', 'ultimate-blocks' ),
			__( 'Add icons to your tab titles.', 'ultimate-blocks' ) );
	}
}
