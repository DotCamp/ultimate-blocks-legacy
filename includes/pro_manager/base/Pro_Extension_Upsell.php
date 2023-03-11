<?php

namespace Ultimate_Blocks\includes\pro_manager\base;

/**
 * Pro extension upsell.
 */
abstract class Pro_Extension_Upsell {

	/**
	 * Relative path to pro manager asset directory.
	 * @var string
	 */
	const UB_PRO_EXTENSION_ASSET_RELATIVE_PATH = 'includes/pro_manager/assets';

	/**
	 * Block id this extension belongs to.
	 * @var string
	 */
	protected $block_id;

	/**
	 * Generated upsell data.
	 * @var array
	 */
	protected $upsell_data;

	/**
	 * Class constructor.
	 *
	 * @param string $block_id extension block id.
	 */
	public function __construct( $block_id ) {
		$this->block_id = $block_id;
	}

	/**
	 * Use generate_upsell_data inside this function to generate your extension upsell data.
	 */
	public abstract function add_upsell_data();


	/**
	 * Get extension upsell data
	 * @return array upsell data
	 */
	public final function get_upsell_data() {
		// add upsell data only once and generate them for the first time if none is available at the time this function is called
		if ( ! is_array( $this->upsell_data ) ) {
			$this->add_upsell_data();
		}

		return [ $this->block_id => $this->upsell_data ];
	}


	/**
	 * Generate upsell data for various extension functionality.
	 *
	 * @param string $upsell_feature_id feature id
	 * @param string $upsell_name name of functionality
	 * @param string $description short description of feature
	 * @param string|null $upsell_img image path for feature relative to pro_manager/assets/img folder, null to not use any image for that feature.
	 *
	 */
	protected final function generate_upsell_data( $upsell_feature_id, $upsell_name, $description, $upsell_img = null ) {
		$image_url = null;

		if ( ! is_null( $upsell_img ) ) {
			$image_url = trailingslashit( ULTIMATE_BLOCKS_URL ) . '/img/' . '$upsell_img';
		}

		$data = [
			'name'        => $upsell_name,
			'description' => $description,
			'imageUrl'    => $image_url,
		];

		if ( ! is_array( $this->upsell_data ) ) {
			$this->upsell_data = [];
		}

		$this->upsell_data[ $upsell_feature_id ] = $data;
	}
}
