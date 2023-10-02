<?php
/**
 * Load @@pkg.title custom block categories.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @license   @@pkg.license
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main @@pkg.title Block Category Class
 *
 * @since 1.1.1
 */
class UltimateBlocks_Block_Category {

	/**
	 * This class's instance.
	 *
	 * @var UltimateBlocks_Block_Category
	 */
	private static $instance;

	/**
	 * Registers the class.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new UltimateBlocks_Block_Category();
		}
	}

	/**
	 * The Constructor.
	 */
	private function __construct() {
		if ( version_compare( $GLOBALS['wp_version'], '5.8.0', '<' ) ) {
			add_filter( 'block_categories', array( $this, 'block_categories' ), 9999999 );
		} else {
			add_filter( 'block_categories_all', array( $this, 'block_categories' ), 9999999 );
		}
	}

	/**
	 * Register our custom block category.
	 *
	 * @access public
	 *
	 * @param array $categories All categories.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/extensibility/extending-blocks/#managing-block-categories
	 */
	public function block_categories( $categories ) {

		return array_merge(
			array(
				array(
					'slug'  => 'ultimateblocks',
					'title' => __( 'Ultimate Blocks', 'ultimate-blocks' ),
				),
			),
			$categories
		);
	}
}

UltimateBlocks_Block_Category::register();
