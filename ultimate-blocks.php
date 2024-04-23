<?php
/**
 * Plugin Name: Ultimate Blocks
 * Plugin URI: https://ultimateblocks.com/
 * Description: Custom Blocks for Bloggers and Marketers. Create Better Content With Gutenberg.
 * Author: Ultimate Blocks
 * Author URI: https://ultimateblocks.com/
 * Version: 3.1.7
 * License: GPL3+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: ultimate-blocks
 * Domain Path: /languages
 *
 * @package UB
 */

// Exit if accessed directly.
use Ultimate_Blocks\includes\Env_Manager;
use Ultimate_Blocks\includes\pro_manager\Pro_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once 'includes/class-ultimate-blocks-constants.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 */
define( 'ULTIMATE_BLOCKS_VERSION', Ultimate_Blocks_Constants::plugin_version() );
/**
 * Plugin Name
 */
define( 'ULTIMATE_BLOCKS_NAME', Ultimate_Blocks_Constants::plugin_name() );
/**
 * Plugin Path
 */
define( 'ULTIMATE_BLOCKS_PATH', Ultimate_Blocks_Constants::plugin_path() );
/**
 * Plugin URL
 */
define( 'ULTIMATE_BLOCKS_URL', Ultimate_Blocks_Constants::plugin_url() );
/**
 * Plugin TextDomain
 */
define( 'ULTIMATE_BLOCKS_TEXT_DOMAIN', Ultimate_Blocks_Constants::text_domain() );

/**
 * Plugin __FILE__
 */
define( 'ULTIMATE_BLOCKS_PLUGIN_FILE', __FILE__ );

require_once trailingslashit( ULTIMATE_BLOCKS_PATH ) . 'vendor/autoload.php';

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';


/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-ultimate-blocks-activator.php
 */
function activate_ultimate_blocks() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ultimate-blocks-activator.php';
	Ultimate_Blocks_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-ultimate-blocks-deactivator.php
 */
function deactivate_ultimate_blocks() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ultimate-blocks-deactivator.php';
	Ultimate_Blocks_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_ultimate_blocks' );
register_deactivation_hook( __FILE__, 'deactivate_ultimate_blocks' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-ultimate-blocks.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.2
 */
function run_ultimate_blocks() {

	$plugin = new Ultimate_Blocks();
	$plugin->run();
}

// initialize env manager.
Env_Manager::init();

// initialize license provider.
Pro_Manager::init_freemius();

add_action( 'plugins_loaded', 'run_ultimate_blocks', 10, 1 );
