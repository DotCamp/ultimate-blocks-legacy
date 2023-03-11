<?php

namespace Ultimate_Blocks\includes\pro_manager\base;

use function trailingslashit;
use function WP_Filesystem;

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
	 * @param string|null $upsell_img image path for feature relative to pro_manager/assets/img folder, null to either not use any image for that feature or automatically search for image within img folder inside a folder named after block id minus plugin prefix.
	 *
	 */
	protected final function generate_upsell_data(
		$upsell_feature_id,
		$upsell_name,
		$description,
		$upsell_img = null
	) {
		global $wp_filesystem;

		// set native filesystem
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once( trailingslashit( ABSPATH ) . '/wp-admin/includes/file.php' );
		}
		WP_Filesystem( true );

		$image_url = null;

		if ( ! is_null( $upsell_img ) ) {
			$image_relative_path = self::UB_PRO_EXTENSION_ASSET_RELATIVE_PATH . '/img/' . $upsell_img;
			$image_path          = path_join( trailingslashit( ULTIMATE_BLOCKS_PATH ), $image_relative_path );

			if ( $wp_filesystem->exists( $image_path ) && $wp_filesystem->is_file( $image_path ) ) {
				$image_url = path_join( trailingslashit( ULTIMATE_BLOCKS_URL ), $image_relative_path );
			}
		} else {
			$matches = [];
			preg_match( '/^ub\/(.+)$/', $this->block_id, $matches );

			// automatically search for a fitting image file under asset folders
			if ( isset( $matches[1] ) ) {
				$target_extension_upsell_dir_name = $matches[1];
				$relative_path_to_file            = sprintf( '%s/img/%s/%s.png',
					self::UB_PRO_EXTENSION_ASSET_RELATIVE_PATH, $target_extension_upsell_dir_name, $upsell_feature_id );

				$image_path = path_join( trailingslashit( ULTIMATE_BLOCKS_PATH ), $relative_path_to_file );

				if ( $wp_filesystem->exists( $image_path ) && $wp_filesystem->is_file( $image_path ) ) {
					$image_url = path_join( trailingslashit( ULTIMATE_BLOCKS_URL ), $relative_path_to_file );
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
