<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @package ultimate-blocks
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    Ultimate_Blocks
 * @subpackage Ultimate_Blocks/admin
 */

use Ultimate_Blocks\admin\data\block_demos\Block_Demos_Data;
use Ultimate_Blocks\admin\data\Block_Menu_Info_Data;
use Ultimate_Blocks\admin\data\Settings_Menu_Content_Data;
use Ultimate_Blocks\includes\pro_manager\Pro_Manager;

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
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The PATH of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string $plugin_name The PATH of this plugin.
	 */
	private $plugin_path;

	/**
	 * The URL of this plugin.
	 *
	 * @since    1.0.2
	 * @access   private
	 * @var      string $plugin_name The URL of this plugin.
	 */
	private $plugin_url;

	/**
	 * Pro sub menu slug.
	 *
	 * @var string
	 */
	private $pro_menu_slug = 'ultimate-blocks-settings-pro';

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

		add_filter( 'ub/filter/admin_settings_menu_data', array( $this, 'add_settings_menu_data' ), 1, 1 );
	}

	/**
	 * Add data for admin settings menu frontend.
	 *
	 * @param array $data frontend data.
	 *
	 * @return array filtered frontend data
	 */
	public function add_settings_menu_data( $data ) {
		$data['assets'] = array(
			'logo'        => trailingslashit( $this->plugin_url ) . 'admin/images/logos/menu-icon-colored.svg',
			'ajax'        => array(
				'toggleStatus' => array(
					'url'    => get_admin_url( null, 'admin-ajax.php' ),
					'action' => 'toggle_block_status',
					'nonce'  => wp_create_nonce( 'toggle_block_status' ),
				),
				'toggleExtensionStatus' => array(
					'url'    => get_admin_url( null, 'admin-ajax.php' ),
					'action' => 'toggle_extension_status',
					'nonce'  => wp_create_nonce( 'toggle_extension_status' ),
				),
			),
			'proMenuSlug' => $this->pro_menu_slug,
			'blockDemos'  => Block_Demos_Data::get_data(),
			'contentData' => Settings_Menu_Content_Data::get_data(),
		);

		$data['blocks'] = array(
			'statusData' => get_option( 'ultimate_blocks', false ),
			'info'       => Block_Menu_Info_Data::get_data(),
		);
		$data['extensions'] = array(
			'statusData' => get_option( 'ultimate_blocks_extensions', false ),
		);

		return $data;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.2
	 */
	public function enqueue_styles() {

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

		wp_enqueue_style(
			$this->plugin_name,
			trailingslashit( $this->plugin_url ) . 'bundle-dist/ub-admin-settings.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @param string $hook current page hook.
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
		global $ub_pro_page;

		if ( $hook !== $menu_page && $hook !== $ub_pro_page ) {
			return;
		}		
		
		wp_enqueue_script(
			$this->plugin_name . '_registered_blocks',
			trailingslashit( $this->plugin_url ) . 'dist/blocks.build.js',
			array(
				'wp-blocks',
				'wp-i18n',
				'wp-element',
				'wp-editor',
				'wp-hooks',
				'wp-api',
				'lodash'
			),
			$this->version,
			true
		);

		// ub/action/settings_menu_block_registry action hook.
		do_action( 'ub/action/settings_menu_block_registry' );

		wp_enqueue_script(
			$this->plugin_name,
			trailingslashit( $this->plugin_url ) . 'bundle-dist/ub-admin-settings.js',
			array(),
			$this->version,
			true
		);

		// ub/filter/admin_settings_menu_data filter hook.
		$frontend_script_data = apply_filters( 'ub/filter/admin_settings_menu_data', array() );

		wp_localize_script( $this->plugin_name, 'ubAdminMenuData', $frontend_script_data );
	}


	/**
	 * Register Setting Pages for the admin area.
	 *
	 * @since    1.0.2
	 */
	public function register_admin_menus() {

		// assign global variables.
		global $menu_page;
		global $menu_page_slug;
		global $ub_pro_page;
		global $ub_pro_page_slug;

		$ub_pro_page_slug = $this->pro_menu_slug;
		$menu_page_slug   = 'ultimate-blocks-settings';

		$menu_page = add_menu_page(
			'Ultimate Blocks Settings',
			'Ultimate Blocks',
			'manage_options',
			$menu_page_slug,
			array( $this, 'main_menu_template_cb' ),
			plugin_dir_url( __FILE__ ) . 'images/logos/menu-icon.svg'
		);
	}

	/**
	 * Set template for main setting page
	 *
	 * @return void
	 * @since    1.0.2
	 */
	public function main_menu_template_cb() {
		require_once $this->plugin_path . 'admin/templates/menus/main-menu.php';
	}

	/**
	 * Toggle extension status ajax endpoint.
	 *
	 * @return void
	 */
	public function toggle_extension_status() {
		check_ajax_referer( 'toggle_extension_status' );

		if ( isset( $_POST['extension_name'] ) && isset( $_POST['enable'] ) ) {
			// phpcs:disable
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitization done before foreach loop below.
			$extension_name_array = $_POST['extension_name'];
			// phpcs:enable

			if ( is_null( $extension_name_array ) || ! is_array( $extension_name_array ) ) {
				wp_send_json_error(
					array(
						'error_message' => __( 'Invalid JSON object supplied for extension names.', 'ultimate-blocks' ),
					)
				);
			} else {
				$enable           = sanitize_text_field( wp_unslash( $_POST['enable'] ) );
				$extension_name_array = array_map( 'sanitize_text_field', $extension_name_array );
				foreach ( $extension_name_array as $extension_name ) {
					$this->toggle_extension_status_individual( $extension_name, $enable );
				}
			}
		} else {
			wp_send_json_error(
				array(
					'error_message' => __( 'Extension name is not supplied', 'ultimate-blocks' ),
				)
			);
		}
		die();
	}
	/**
	 * Toggle block status ajax endpoint.
	 *
	 * @return void
	 */
	public function toggle_block_status() {
		check_ajax_referer( 'toggle_block_status' );

		if ( isset( $_POST['block_name'] ) && isset( $_POST['enable'] ) ) {
			// phpcs:disable
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitization done before foreach loop below.
			$block_name_array = $_POST['block_name'];
			// phpcs:enable

			if ( is_null( $block_name_array ) || ! is_array( $block_name_array ) ) {
				wp_send_json_error(
					array(
						'error_message' => __( 'Invalid JSON object supplied for block names.', 'ultimate-blocks' ),
					)
				);
			} else {
				$enable           = sanitize_text_field( wp_unslash( $_POST['enable'] ) );
				$block_name_array = array_map( 'sanitize_text_field', $block_name_array );
				foreach ( $block_name_array as $block_name ) {
					$this->toggle_block_status_individual( $block_name, $enable );
				}
			}
		} else {
			wp_send_json_error(
				array(
					'error_message' => __( 'Block name is not supplied', 'ultimate-blocks' ),
				)
			);
		}
		die();
	}


	/**
	 * Enable/Disable Block
	 *
	 * @param string $block_name block name.
	 * @param bool   $enable block status.
	 *
	 * @return void
	 * @since    1.0.2
	 */
	private function toggle_block_status_individual( $block_name, $enable ) {
		do_action( 'ub/action/block_toggle_ajax_before_exist_check', $block_name, rest_sanitize_boolean( $enable ) );

		if ( ! $this->block_exists( $block_name ) ) {
			wp_send_json_error(
				array(
					'error_message' => 'Unknown block name',
				)
			);
		}

		$uploadDir         = dirname( dirname( dirname( __DIR__ ) ) ) . '/uploads';
		$canMakeCustomFile = is_writable( $uploadDir );

		$saved_blocks = get_option( 'ultimate_blocks', false );
		if ( $saved_blocks ) {

			if ( $canMakeCustomFile ) {
				if ( ! file_exists( $uploadDir . '/ultimate-blocks' ) ) {
					mkdir( $uploadDir . '/ultimate-blocks' );
				}
				$frontStyleFile = fopen( $uploadDir . '/ultimate-blocks/blocks.style.build.css', 'w' );
				$adminStyleFile = fopen( $uploadDir . '/ultimate-blocks/blocks.editor.build.css', 'w' );
				$blockDir       = dirname( __DIR__ ) . '/src/blocks/';
			}

			foreach ( $saved_blocks as $key => $block ) {
				if ( $block['name'] === $block_name ) {
					$saved_blocks[ $key ]['active'] = ( $enable === 'true' );
				}

				if ( $canMakeCustomFile ) {
					$blockDirName       = strtolower(
						str_replace(
							' ',
							'-',
							trim( preg_replace( '/\(.+\)/', '', $saved_blocks[ $key ]['label'] ) )
						)
					);
					$frontStyleLocation = $blockDir . $blockDirName . '/style.css';
					$adminStyleLocation = $blockDir . $blockDirName . '/editor.css';

					if ( file_exists( $frontStyleLocation ) && $saved_blocks[ $key ]['active'] ) { // also detect if block is enabled
						if ( $block['name'] == 'ub/click-to-tweet' ) {
							fwrite(
								$frontStyleFile,
								str_replace(
									'src/blocks/click-to-tweet/icons',
									'ultimate-blocks',
									file_get_contents( $frontStyleLocation )
								)
							);
						} else {
							fwrite( $frontStyleFile, file_get_contents( $frontStyleLocation ) );
						}
					}
					if ( file_exists( $adminStyleLocation ) && $saved_blocks[ $key ]['active'] ) {
						fwrite( $adminStyleFile, file_get_contents( $adminStyleLocation ) );
					}

					if ( $block['name'] === 'ub/styled-box' && $saved_blocks[ $key ]['active'] ) {
						// add css for blocks phased out by styled box
						fwrite( $frontStyleFile, file_get_contents( $blockDir . 'feature-box' . '/style.css' ) );
						fwrite( $frontStyleFile, file_get_contents( $blockDir . 'notification-box' . '/style.css' ) );
						fwrite( $frontStyleFile, file_get_contents( $blockDir . 'number-box' . '/style.css' ) );

						fwrite( $adminStyleFile, file_get_contents( $blockDir . 'feature-box' . '/editor.css' ) );
						fwrite( $adminStyleFile, file_get_contents( $blockDir . 'number-box' . '/editor.css' ) );
					}
				}
			}

			if ( $canMakeCustomFile ) {
				fclose( $frontStyleFile );
				fclose( $adminStyleFile );
				copy(
					dirname( __DIR__ ) . '/src/blocks/click-to-tweet/icons/sprite-twitter.png',
					wp_upload_dir()['basedir'] . '/ultimate-blocks/sprite-twitter.png'
				);
			}

			update_option( 'ultimate_blocks', $saved_blocks );
		} else {
			update_option( 'ultimate_blocks', $this->blocks() );
		}

		// wp_send_json_success( get_option( 'ultimate_blocks', false ) );
	}
	/**
	 * Enable/Disable Extension
	 *
	 * @param string $extension_name extension name.
	 * @param bool   $enable extension status.
	 *
	 * @return void
	 * @since    3.0.9
	 */
	private function toggle_extension_status_individual( $extension_name, $enable ) {
		do_action( 'ub/action/extension_toggle_ajax_before_exist_check', $extension_name, rest_sanitize_boolean( $enable ) );

		if ( ! $this->extension_exists( $extension_name ) ) {
			wp_send_json_error(
				array(
					'error_message' => 'Unknown extension name',
				)
			);
		}
		$saved_extensions = get_option( 'ultimate_blocks_extensions', false );
		if ( $saved_extensions ) {
			foreach ( $saved_extensions as $key => $extension ) {
				if ( $extension['name'] === $extension_name ) {
					$saved_extensions[ $key ]['active'] = ( $enable === 'true' );
				}
			}
			update_option( 'ultimate_blocks_extensions', $saved_extensions );
		} else {
			update_option( 'ultimate_blocks_extensions', $this->extensions() );
		}
	}

	/**
	 * Insert Blocks Settings as a Js Global variable.
	 *
	 * @return void
	 * @since    1.0.2
	 */
	public function insert_blocks_settings() {
		$ultimate_blocks_settings = wp_json_encode( get_option( 'ultimate_blocks', array() ) );
		?>

		<script> window.ultimate_blocks =<?php echo $ultimate_blocks_settings; ?> </script>

		<?php
	}

	/**
	 * Execute functions when admin area is loaded.
	 *
	 * @return void
	 * @since    1.0.2
	 */
	public function on_admin_init() {
		$this->register_new_blocks();
		$this->update_new_extensions();
	}

	/**
	 * Update Extensions Settings as a Js Global variable.
	 *
	 * @return void
	 * @since    3.0.9
	 */
	public function update_new_extensions(){
		$extensions = $this->extensions();
		
		update_option( 'ultimate_blocks_extensions', $extensions );
	}
	/**
	 * Insert Blocks Settings as a Js Global variable.
	 *
	 * @return void
	 * @since    1.0.2
	 */
	public function register_new_blocks() {
		$blocks = $this->blocks();

		$registered_blocks = get_option( 'ultimate_blocks', false );

		$new_blocks = array();

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
	 * Check extension exists.
	 *
	 * @param string $name Block Name.
	 *
	 * @return bool
	 * @since    3.0.9
	 */
	protected function extension_exists( $name ) {
		$extensions = $this->extensions();

		foreach ( $extensions as $key => $extension ) {
			if ( $extension['name'] === $name ) {
				return true;
			}
		}

		return false;
	}
	/**
	 * Check block exists.
	 *
	 * @param string $name Block Name.
	 *
	 * @return bool
	 * @since    1.0.2
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
	 * Check extensions is registered.
	 *
	 * @param string $name Extension Name.
	 *
	 * @return bool
	 * @since    3.0.9
	 */
	protected function is_extension_registered( $name, $registered_extensions ) {
		$extensions = $registered_extensions;

		foreach ( $extensions as $key => $extension ) {
			if ( $extension['name'] === $name ) {
				return true;
			}
		}

		return false;
	}
	/**
	 * Check block is registered.
	 *
	 * @param string $name Block Name.
	 *
	 * @return bool
	 * @since    1.0.2
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
	 * @return array
	 * @since    3.0.9
	 */
	protected static function extensions() {

		require_once ULTIMATE_BLOCKS_PATH . 'includes/class-ultimate-blocks-util.php';

		return Ultimate_Blocks_Util::extensions();
	}
	/**
	 * Get Plugin BLOCKS
	 *
	 * @return array
	 * @since    1.0.2
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
		$datetime1    = new DateTime( $install_date );
		$datetime2    = new DateTime( $display_date );
		$diff_intrval = round( ( $datetime2->format( 'U' ) - $datetime1->format( 'U' ) ) / ( 60 * 60 * 24 ) );
		if ( $diff_intrval >= 21 && get_option( 'UltimateBlocks_review_notify' ) == 'no' ) {
			?>
			<div class="UltimateBlocks-review-notice notice notice-info">
				<p style="font-size: 14px;">
					<?php
					_e(
						'Hey,<br> I noticed that you have been using <strong>Ultimate Blocks Plugin</strong> for a while now - that’s awesome! Could you please do me a BIG favor and <b>give it a 5-star rating on WordPress</b>? Just to help us spread the word and boost our motivation. <br>~ Imtiaz Rayhan<br>~ Lead Developer, Ultimate Blocks.',
						'ultimate-blocks'
					);
					?>
				</p>
				<ul>
					<li><a style="margin-right: 5px; margin-bottom: 5px;" class="button-primary"
							href="https://wordpress.org/support/plugin/ultimate-blocks/reviews/?filter=5#new-post"
							target="_blank">Sure, you deserve it.</a>
						<a style="margin-right: 5px;" class="UltimateBlocks_HideReview_Notice button"
							href="javascript:void(0);">I already did.</a>
						<a class="UltimateBlocks_HideReview_Notice button" href="javascript:void(0);">No, not good
							enough.</a>
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
		echo json_encode( array( 'success' ) );
		exit;
	}
}
