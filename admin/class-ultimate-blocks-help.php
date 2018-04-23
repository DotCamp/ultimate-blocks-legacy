<?php

class Ultimate_Blocks_Help {
    /**
	 * The ID of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The PATH of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string    $plugin_name    The PATH of this plugin.
	 */
	private $plugin_path;

	/**
	 * The URL of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string    $plugin_name    The URL of this plugin.
	 */
	private $plugin_url;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.2
	 */
	public function __construct() {

		$this->plugin_name = ULTIMATE_BLOCKS_NAME;
		$this->version     = ULTIMATE_BLOCKS_VERSION;
		$this->plugin_path = ULTIMATE_BLOCKS_PATH;
		$this->plugin_url  = ULTIMATE_BLOCKS_URL;

	}
	
	/**
	 * Register the stylesheets for the help page.
	 *
	 * @since    1.0.2
	 */
	public function enqueue_styles( $hook ) {

		global $help_page;

		if ( $hook != $help_page ) {
			return;
		}

		wp_enqueue_style( $this->plugin_name . '-help-css', plugin_dir_url( __FILE__ ) . 'css/ultimate-blocks-help.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the help page.
	 *
	 * @since    1.0.2
	 */
	public function enqueue_scripts( $hook ) {

		global $help_page;

		if ( $hook != $help_page ) {
			return;
		}

		wp_enqueue_script( $this->plugin_name. '-help-js', plugin_dir_url( __FILE__ ) . 'js/ultimate-blocks-help.js', array( 'jquery' ), $this->version, false );

	}
    
    /**
	 * Register Help Page for the admin area.
	 *
	 * @since    1.0.2
	 */
    public function register_help_admin_menu() {
		
		global $help_page;

        $help_page = add_submenu_page(
            'ultimate-blocks',
            'Ultimate Blocks Help',
            'Help',
            'manage_options',
            'ultimate-blocks-help',
            array( $this, 'help_page_cb' )
        );

    }

    /**
	 * Content for Help Page
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function help_page_cb() {

		require_once $this->plugin_path . 'admin/templates/help/help-page.php';

	}

}