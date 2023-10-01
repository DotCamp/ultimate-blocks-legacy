<?php

namespace Ultimate_Blocks\includes\pro_manager\base;

use Ultimate_Blocks\includes\managers\Ub_Fs_Handler;
use function trailingslashit;

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
	public abstract function add_upsell_data();

	/**
	 * Add data for editor sidebar upsell dummy controls.
	 *
	 * Override this function to actually send data, default is an empty array.
	 *
	 * @return array editor control data
	 */
	public function add_editor_dummy_control_data() {
		return [];
	}

	public final function get_upsell_data() {
		return Ub_Fs_Handler::with_filesystem( [ $this, 'get_upsell_data_logic' ] );
	}

	/**
	 * Get extension upsell data.
	 *
	 * @return array upsell data
	 */
	public function get_upsell_data_logic( $ub_filesystem = null ) {
		// add upsell data only once and generate them for the first time if none is available at the time this function is called
		if ( ! is_array( $this->upsell_data ) ) {
			$extension_upsell_data = $this->add_upsell_data();

			if ( is_array( $extension_upsell_data ) ) {
				foreach ( $extension_upsell_data as $feature_id => $feature_data ) {
					call_user_func_array( [ $this, 'generate_upsell_data' ],
						array_merge( [ $ub_filesystem, $feature_id ], $feature_data ) );
				}
			}
		}

		return [
			$this->block_id => [
				'featureData'       => $this->upsell_data,
				'dummyControlsData' => $this->add_editor_dummy_control_data()
			]
		];
	}

	/**
	 * Generate upsell data for various extension functionality.
	 *
	 * @param string $upsell_feature_id feature id
	 * @param string $upsell_name name of functionality
	 * @param string $description short description of feature
	 * @param string|null $upsell_img image path for feature relative to pro_manager/assets/img folder, null to either not use any image for that feature or automatically search for image within img folder inside a folder named after block id minus plugin prefix.
	 *
	 */
	protected final function generate_upsell_data(
		$ub_filesystem,
		$upsell_feature_id,
		$upsell_name,
		$description,
		$upsell_img = null
	) {
		$image_url = null;

		if ( $ub_filesystem ) {
			if ( ! is_null( $upsell_img ) ) {
				$image_relative_path = self::UB_PRO_EXTENSION_ASSET_RELATIVE_PATH . '/img/' . $upsell_img;
				$image_path          = path_join( trailingslashit( ULTIMATE_BLOCKS_PATH ), $image_relative_path );

				if ( $ub_filesystem->exists( $image_path ) && $ub_filesystem->is_file( $image_path ) ) {
					$image_url = path_join( trailingslashit( ULTIMATE_BLOCKS_URL ), $image_relative_path );
				}
			} else {
				$matches = [];
				preg_match( '/^ub\/(.+)$/', $this->block_id, $matches );

				// automatically search for a fitting image file under asset folders
				if ( isset( $matches[1] ) ) {
					$target_extension_upsell_dir_name = $matches[1];
					$allowed_file_extensions          = [ 'png', 'gif' ];

					foreach ( $allowed_file_extensions as $extension ) {
						$relative_path_to_file = sprintf( '%s/img/%s/%s.%s',
							self::UB_PRO_EXTENSION_ASSET_RELATIVE_PATH, $target_extension_upsell_dir_name,
							$upsell_feature_id, $extension );

						$image_path = path_join( trailingslashit( ULTIMATE_BLOCKS_PATH ), $relative_path_to_file );

						if ( $ub_filesystem->exists( $image_path ) && $ub_filesystem->is_file( $image_path ) ) {
							$image_url = path_join( trailingslashit( ULTIMATE_BLOCKS_URL ), $relative_path_to_file );
						}
					}
				}
			}
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
