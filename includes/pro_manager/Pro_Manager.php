<?php

namespace Ultimate_Blocks\includes\pro_manager;


use Freemius;
use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use Ultimate_Blocks\includes\Editor_Data_Manager;
use Ultimate_Blocks\includes\Env_Manager;
use Ultimate_Blocks\includes\pro_manager\extensions\Button_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Content_Toggle_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Divider_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Expand_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Image_Slider_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Review_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Social_Share_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Tabbed_Content_Extension;
use Ultimate_Blocks\includes\pro_manager\extensions\Table_Of_Contents_Extension;
use function add_action;
use function add_filter;
use function do_action;
use function get_transient;
use function set_transient;

/**
 * Manager for handling features based on availability of pro version from base version.
 */
class Pro_Manager {
	use Manager_Base_Trait;

	/**
	 * Transient key for dashboard sidebar notification.
	 */
	const DASHBOARD_SIDEBAR_NOTIFICATION_TRANSIENT_KEY = 'ultimate_blocks_dashboard_sidebar_notification';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		// only start this operations if pro version is not available
		if ( ! $this->is_pro() ) {
			Editor_Data_Manager::get_instance()->add_editor_data( $this->prepare_priority_upsell_data() );

			// @deprecated removed for better user experience
//			add_filter( 'add_menu_classes', [ $this, 'pro_dashboard_sidebar_notifications' ], 10, 1 );

			add_action( 'admin_enqueue_scripts', [ $this, 'menu_operations' ], 10, 1 );
		}

		add_filter( 'ub/filter/admin_settings_menu_data', [ $this, 'add_menu_data' ], 10, 1 );

		Editor_Data_Manager::get_instance()->add_editor_data( [
			'proStatus' => json_encode( $this->is_pro() ),
			'assets'    => [
				'logoUrl' => trailingslashit( ULTIMATE_BLOCKS_URL ) . '/admin/images/logos/menu-icon-colored.svg',
				'proUrl'  => 'https://ultimateblocks.com/pricing/'
			]
		] );
	}

	/**
	 * Add menu data.
	 *
	 * @param array $menu_data menu data
	 *
	 * @return array menu data
	 */
	public static function add_menu_data( $menu_data ) {
		if ( ! isset( $menu_data['assets'] ) ) {
			$menu_data['assets'] = [];
		}

		$assets = [
			'proBuyUrl' => 'https://ultimateblocks.com/pricing/'
		];

		// merge assets
		$menu_data['assets'] = array_merge( $menu_data['assets'], $assets );

		return $menu_data;
	}

	/**
	 * Menu related operations.
	 *
	 * @param string $hook current menu hook
	 *
	 * @return void
	 */
	public function menu_operations( $hook ) {
		global $ub_pro_page;

		// check if current page is pro dashboard page
		if ( $hook === $ub_pro_page ) {
			// don't show pro admin notifications for a month
			set_transient( self::DASHBOARD_SIDEBAR_NOTIFICATION_TRANSIENT_KEY, true, 60 * 60 * 24 * 30 );
		}
	}

	/**
	 * Get pro status of plugin.
	 * @return boolean pro status
	 */
	public function is_pro() {
		// check if ULTIMATE_BLOCKS_PRO_LICENSE is defined and its value is true
		return defined( 'ULTIMATE_BLOCKS_PRO_LICENSE' ) && ULTIMATE_BLOCKS_PRO_LICENSE;
	}

	/**
	 * Get freemius instance.
	 *
	 * This function will initialize freemius if not already initialized.
	 *
	 * @return Freemius freemius instance
	 */
	public static function init_freemius() {
		global $ub_fs;
		if ( ! isset( $ub_fs ) ) {
			// Include Freemius SDK.
			require_once ULTIMATE_BLOCKS_PATH . 'library/freemius/start.php';

			$ub_fs = fs_dynamic_init( [
				'id'                  => '1798',
				'slug'                => 'ultimate-blocks',
				'premium_slug'        => 'ultimate-blocks-pro',
				'type'                => 'plugin',
				'public_key'          => 'pk_bd3d3c8e255543256632fd4bb9842',
				'is_premium'          => false,
				'premium_suffix'      => 'pro',
				'has_premium_version' => false,
				'has_paid_plans'      => false,
				'has_addons'          => true,
				'menu'                => [
					'slug'       => 'ultimate-blocks-settings',
					'first-path' => 'admin.php?page=ultimate-blocks-help',
					'account'    => true,
					'contact'    => true,
					'support'    => false,
				],
				'secret_key'          => Env_Manager::get( 'FS_SECRET_KEY' ),
			] );

			do_action( 'ub_fs_loaded' );
		}

		return $ub_fs;
	}


	/**
	 * Prepare upsell related extension data.
	 * @return array upsell data
	 */
	private function prepare_priority_upsell_data() {
		// Tabbed content extension
		$tabbed_content_upsell      = new Tabbed_Content_Extension( 'ub/tabbed-content-block' );
		$tabbed_content_upsell_data = $tabbed_content_upsell->get_upsell_data();

		// Button extension
		$button_upsell      = new Button_Extension( 'ub/button' );
		$button_upsell_data = $button_upsell->get_upsell_data();

		// Content toggle extension
		$content_toggle_upsell = new Content_Toggle_Extension( 'ub/content-toggle-block' );
		$content_toggle_data   = $content_toggle_upsell->get_upsell_data();

		// Content toggle panel extension
		$content_toggle_panel_upsell = new Content_Toggle_Extension( 'ub/content-toggle-panel-block' );
		$content_toggle_panel_data   = $content_toggle_panel_upsell->get_upsell_data();

		// Divider extension
		$divider_upsell      = new Divider_Extension( 'ub/divider' );
		$divider_upsell_data = $divider_upsell->get_upsell_data();

		// Expand extension
		$expand_upsell      = new Expand_Extension( 'ub/expand' );
		$expand_upsell_data = $expand_upsell->get_upsell_data();

		// Image slider extension
		$image_slider_upsell      = new Image_Slider_Extension( 'ub/image-slider' );
		$image_slider_upsell_data = $image_slider_upsell->get_upsell_data();

		// Review extension
		$review_upsell      = new Review_Extension( 'ub/review' );
		$review_upsell_data = $review_upsell->get_upsell_data();

		// Table of contents extension
		$table_of_contents_upsell      = new Table_Of_Contents_Extension( 'ub/table-of-contents-block' );
		$table_of_contents_upsell_data = $table_of_contents_upsell->get_upsell_data();

		// Social share extension
		$social_share_upsell      = new Social_Share_Extension( 'ub/social-share' );
		$social_share_upsell_data = $social_share_upsell->get_upsell_data();

		$final_upsell_extension_data = array_merge_recursive( [], $tabbed_content_upsell_data, $button_upsell_data,
			$content_toggle_data, $content_toggle_panel_data, $divider_upsell_data, $expand_upsell_data,
			$image_slider_upsell_data,
			$review_upsell_data, $table_of_contents_upsell_data, $social_share_upsell_data );

		return [
			'upsellExtensionData' => $final_upsell_extension_data
		];
	}

	/**
	 * Add notification to sidebar menu title.
	 *
	 * @param string $original_title title
	 *
	 * @return string modified title
	 */
	private function generate_title_with_notification( $original_title ) {
		return sprintf( '%s<span class="update-plugins" style="background-color: #EAB308 !important; text-shadow: ">
<span>💡</span></span>', $original_title );
	}

	/**
	 * Add sidebar notifications to menu.
	 *
	 * @param array $menu menu array
	 *
	 * @return array menu array
	 */
	public function pro_dashboard_sidebar_notifications( $menu ) {
		global $submenu;
		global $menu_page_slug;
		global $ub_pro_page_slug;

		// check if notification is already shown
		$notification_status = get_transient( self::DASHBOARD_SIDEBAR_NOTIFICATION_TRANSIENT_KEY );

		if ( ! $notification_status && isset( $submenu ) ) {
			if ( isset( $submenu[ $menu_page_slug ] ) ) {
				// add to submenu
				$index = array_search( $ub_pro_page_slug, array_column( $submenu[ $menu_page_slug ], 2 ) );

				if ( $index !== false ) {
					$original_pro_title                      = $submenu[ $menu_page_slug ][ $index ][0];
					$original_pro_title                      = $this->generate_title_with_notification( $original_pro_title );
					$submenu[ $menu_page_slug ][ $index ][0] = $original_pro_title;
				}

				// add to menu
				$index = array_search( $menu_page_slug, array_column( $menu, 2 ) );
				if ( $index !== false ) {
					$menu_key       = array_keys( $menu )[ $index ];
					$original_title = $menu[ $menu_key ][0];

					$original_title       = $this->generate_title_with_notification( $original_title );
					$menu[ $menu_key ][0] = $original_title;
				}
			}
		}

		return $menu;
	}

}
