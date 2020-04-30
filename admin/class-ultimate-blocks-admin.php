<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/admin
 * @author     Imtiaz Rayhan <imtiazrayhan@gmail.com>
 */
class Ultimate_Blocks_Admin {

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
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.2
	 */
	public function enqueue_styles( $hook ) {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Ultimate_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Ultimate_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		global $menu_page;

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/ultimate-blocks-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.2
	 */
	public function enqueue_scripts( $hook ) {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Ultimate_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Ultimate_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		global $menu_page;

		if ( $hook != $menu_page ) {
			return;
		}

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/ultimate-blocks-admin.js', array( 'jquery' ), $this->version, false );

	}


	/**
	 * Register Setting Pages for the admin area.
	 *
	 * @since    1.0.2
	 */
	public function register_admin_menus() {

		global $menu_page;

		$menu_page = add_menu_page(
			'Ultimate Blocks Settings',
			'Ultimate Blocks',
			'manage_options',
			'ultimate-blocks-settings',
			array( $this, 'main_menu_template_cb' ),
			plugin_dir_url( __FILE__ ) . 'images/logos/menu-icon.svg'
		);

	}

	/**
	 * Set template for main setting page
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function main_menu_template_cb() {

		require_once $this->plugin_path . 'admin/templates/menus/main-menu.php';

	}

	/**
	 * Enable/Disable Block
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function toggle_block_status() {

		check_ajax_referer( 'toggle_block_status' );

		$block_name = sanitize_text_field( $_POST['block_name'] );

		$enable = sanitize_text_field( $_POST['enable'] );

		if ( ! $this->block_exists( $block_name ) ) {
			wp_send_json_error( array(
				'error_message' => 'Unknown block name',
			));
		}

		$uploadDir = dirname(dirname(dirname(__DIR__))) . '/uploads';
		$canMakeCustomFile = is_writable($uploadDir);

		$saved_blocks = get_option( 'ultimate_blocks', false );
		if ( $saved_blocks ) {

			if($canMakeCustomFile){
				if(!file_exists($uploadDir . '/ultimate-blocks')){
					mkdir($uploadDir . '/ultimate-blocks');
				}
				$frontStyleFile = fopen($uploadDir . '/ultimate-blocks/blocks.style.build.css', 'w');
				$adminStyleFile = fopen($uploadDir . '/ultimate-blocks/blocks.editor.build.css', 'w');
				$blockDir = dirname(__DIR__) . '/src/blocks/';
			}

			foreach ( $saved_blocks as $key => $block ) {
				if ( $block['name'] === $block_name ) {
					$saved_blocks[ $key ]['active'] = ( $enable === 'true' );
				}

				if($canMakeCustomFile){
					$blockDirName = strtolower(str_replace(' ', '-', 
					trim(preg_replace('/\(.+\)/', '', $saved_blocks[ $key ]['label']))
						));
					$frontStyleLocation = $blockDir . $blockDirName . '/style.css';
					$adminStyleLocation = $blockDir . $blockDirName . '/editor.css';
	
					if(file_exists($frontStyleLocation) && $saved_blocks[ $key ]['active']){ //also detect if block is enabled
						if($block['name'] == 'ub/click-to-tweet'){
							fwrite($frontStyleFile, str_replace("src/blocks/click-to-tweet/icons", "ultimate-blocks", file_get_contents($frontStyleLocation)));
						}
						else{
							fwrite($frontStyleFile, file_get_contents($frontStyleLocation));
						}
					}
					if(file_exists($adminStyleLocation) && $saved_blocks[ $key ]['active']){
						fwrite($adminStyleFile, file_get_contents($adminStyleLocation));
					}

					if($block['name'] === 'ub/styled-box' && $saved_blocks[$key]['active']){
						//add css for blocks phased out by styled box
						fwrite($frontStyleFile, file_get_contents($blockDir . 'feature-box' . '/style.css'));
						fwrite($frontStyleFile, file_get_contents($blockDir . 'notification-box' . '/style.css'));
						fwrite($frontStyleFile, file_get_contents($blockDir . 'number-box' . '/style.css'));

						fwrite($adminStyleFile, file_get_contents($blockDir . 'feature-box' . '/editor.css'));
						fwrite($adminStyleFile, file_get_contents($blockDir . 'number-box' . '/editor.css'));
					}
				}
			}
			
			if($canMakeCustomFile){
				fclose($frontStyleFile);
				fclose($adminStyleFile);
				copy(dirname(__DIR__) . '/src/blocks/click-to-tweet/icons/sprite-twitter.png', wp_upload_dir()['basedir'] . '/ultimate-blocks/sprite-twitter.png');
			}

			update_option( 'ultimate_blocks', $saved_blocks );
		} else {
			update_option( 'ultimate_blocks', $this->blocks() );
		}

		wp_send_json_success( get_option( 'ultimate_blocks', false ) );
	}

	/**
	 * Insert Blocks Settings as a Js Global variable.
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function insert_blocks_settings() {
		$ultimate_blocks_settings = wp_json_encode( get_option( 'ultimate_blocks', array() ) );
		?>

		<script> window.ultimate_blocks=<?php echo $ultimate_blocks_settings; ?> </script>

		<?php
	}

	/**
	 * Execute functions when admin area is loaded.
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function on_admin_init() {
		$this->register_new_blocks();
	}

	/**
	 * Insert Blocks Settings as a Js Global variable.
	 *
	 * @since    1.0.2
	 * @return void
	 */
	public function register_new_blocks() {
		$blocks = $this->blocks();

		$registered_blocks = get_option( 'ultimate_blocks', false );

		$new_blocks = [];

		if ( $registered_blocks ) {
			foreach ( $blocks as $block ) {
				if ( ! $this->is_block_registered( $block['name'], $registered_blocks ) ) {
					$new_blocks[] = $block;
				}
			}
			$registered_blocks = array_merge( $registered_blocks, $new_blocks );
			update_option( 'ultimate_blocks', $registered_blocks );
		} else {
			update_option( 'ultimate_blocks', $blocks );
		}
	}

	/**
	 * Check block exists.
	 *
	 * @since    1.0.2
	 * @param string $name Block Name.
	 * @return bool
	 */
	protected function block_exists( $name ) {
		$blocks = $this->blocks();

		$unknown_block = true;
		foreach ( $blocks as $key => $block ) {
			if ( $block['name'] === $name ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Check block is registered.
	 *
	 * @since    1.0.2
	 * @param string $name Block Name.
	 * @return bool
	 */
	protected function is_block_registered( $name, $registered_blocks ) {
		$blocks = $registered_blocks;

		$unknown_block = true;
		foreach ( $blocks as $key => $block ) {
			if ( $block['name'] === $name ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get Plugin BLOCKS
	 *
	 * @since    1.0.2
	 * @return array
	 */
	protected static function blocks() {

		require_once ULTIMATE_BLOCKS_PATH . 'includes/class-ultimate-blocks-util.php';

		return Ultimate_Blocks_Util::blocks();
	}

	/**
	 * Generating the review notice.
	 *
	 * @since 2.1.6
	 */
	public static function UltimateBlocks_review_notice() {
        
        $install_date = get_option( 'UltimateBlocks_installDate' );
        $display_date = date( 'Y-m-d h:i:s' );
        $datetime1 = new DateTime( $install_date );
        $datetime2 = new DateTime( $display_date );
        $diff_intrval = round( ($datetime2->format( 'U' ) - $datetime1->format( 'U' )) / (60 * 60 * 24) );
		if ( $diff_intrval >= 14 && get_option( 'UltimateBlocks_review_notify' ) == "no" ) {
			?>
            <div class="UltimateBlocks-review-notice notice notice-info">
                <p style="font-size: 14px;">
					<?php _e( 'Hey,<br> I noticed that you have been using <strong>Ultimate Blocks Plugin</strong> for a while now - that’s awesome! Could you please do me a BIG favor and <b>give it a 5-star rating on WordPress</b>? Just to help us spread the word and boost our motivation. <br>~ Imtiaz Rayhan<br>~ Lead Developer, Ultimate Blocks.', 'ultimate-blocks' ); ?>
                </p>
                <ul>
                    <li><a style="margin-right: 5px; margin-bottom: 5px;" class="button-primary"
                           href="https://wordpress.org/support/plugin/ultimate-blocks/reviews/?filter=5#new-post"
                           target="_blank">Sure, you deserve it.</a>
                        <a style="margin-right: 5px;" class="UltimateBlocks_HideReview_Notice button" href="javascript:void(0);">I already did.</a>
                        <a class="UltimateBlocks_HideReview_Notice button" href="javascript:void(0);">No, not good enough.</a>
                    </li>
                </ul>
            </div>
            <script>
                jQuery(document).ready(function ($) {
                    jQuery('.UltimateBlocks_HideReview_Notice').click(function () {
                        var data = {'action': 'UltimateBlocksReviewNoticeHide'};
                        jQuery.ajax({
                            url: "<?php echo admin_url( 'admin-ajax.php' ); ?>",
                            type: "post",
                            data: data,
                            dataType: "json",
                            async: !0,
                            success: function (notice_hide) {
                                if (notice_hide == "success") {
                                    jQuery('.UltimateBlocks-review-notice').slideUp('fast');
                                }
                            }
                        });
                    });
                });
            </script>
			<?php
		}
	}
	/**
	 * Hides the review notice.
	 *
	 * @since 2.1.6
	 */
	public function UltimateBlocks_hide_review_notify() {
		update_option( 'UltimateBlocks_review_notify', 'yes' );
		echo json_encode( array( "success" ) );
		exit;
	}

}
