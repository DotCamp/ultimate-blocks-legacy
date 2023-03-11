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
	}
}
