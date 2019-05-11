<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( !function_exists( 'get_current_screen' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/screen.php' );
}

/**
 * Check if the current page is the Gutenberg block editor.
 * @return bool
 */
function ub_check_is_gutenberg_page() {

	// The Gutenberg plugin is on.
    if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) { 
        return true;
    }
	
	// Gutenberg page on WordPress 5+.
	$current_screen = get_current_screen();
	if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
        return true;
	}
	
    return false;

}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */

function ub_load_assets(){
    wp_enqueue_style(
        'ultimate_blocks-cgb-style-css', // Handle.
        plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
        array(), // Dependency to include the CSS after it.
        Ultimate_Blocks_Constants::plugin_version()  // Version: latest version number.
    );
}

function ultimate_blocks_cgb_block_assets() {
	// Styles.
	if ( is_singular() and has_blocks() ){
        function ub_getNamesOfPresentBlocks($value){
            return $value['blockName'];
        }

        $presentBlocks = array_map( 'ub_getNamesOfPresentBlocks',
                                    parse_blocks( get_post()->post_content ) );

        foreach( $presentBlocks as $blockName ){
            if( strpos($blockName, 'ub/' )===0){
                ub_load_assets();
                break;
            }
        }
    }
    elseif ( ub_check_is_gutenberg_page() ){
        ub_load_assets();
    }
} // End function ultimate_blocks_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'ultimate_blocks_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function ultimate_blocks_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'ultimate_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor'), // Dependencies, defined above.
		Ultimate_Blocks_Constants::plugin_version()  // Version: latest version number.
	);

	wp_enqueue_script(
		'ultimate_blocks-cgb-deactivator-js', // Handle.
		plugins_url( '/dist/deactivator.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-editor', 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
		Ultimate_Blocks_Constants::plugin_version(), // Version: latest version number.
		true
	);

	// Styles.
	wp_enqueue_style(
		'ultimate_blocks-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		Ultimate_Blocks_Constants::plugin_version() // Version: latest version number
	);
} // End function ultimate_blocks_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'ultimate_blocks_cgb_editor_assets' );

function ub_generateBlockID($length = 10) {
    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

// Click to Tweet Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/click-to-tweet/block.php';

// Social Share Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/social-share/block.php';

// Content toggle Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/content-toggle/block.php';

// Tabbed Content Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/tabbed-content/block.php';

// Progress Bar Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/progress-bar/block.php';

// Countdown Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/countdown/block.php';

// Image Slider Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/image-slider/block.php';

// Table of Contents Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/table-of-contents/block.php';

// Button Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/button/block.php';