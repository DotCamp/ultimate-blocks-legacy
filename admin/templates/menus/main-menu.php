<?php
/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://imtiazrayhan.com/
 * @since      1.0.2
 *
 * @package    ultimate_blocks
 * @subpackage ultimate_blocks/admin/templates/menus/main-menu
 */

?>

<div id="ub__main-menu">

	<div id="ub__main-menu__header">
		<div class="ub__header-container">
			<img src="<?php echo esc_url( ULTIMATE_BLOCKS_URL . 'admin/images/banners/banner-772x250.png' ); ?>" alt="Ultimate Blocks" />
			<div class="ub_collection_filter">
				<span class="filter-action active" data-filter-status="all"><?php esc_html_e( 'All', 'ultimate-blocks' ); ?></span>
				<span class="filter-action" data-filter-status="enabled"><?php esc_html_e( 'Enabled', 'ultimate-blocks' ); ?></span>
				<span class="filter-action" data-filter-status="disabled"><?php esc_html_e( 'Disabled', 'ultimate-blocks' ); ?></span>
			</div>
		</div>
	</div>

	<div id="ub__main-menu__body">

		<div class="ub__collection <?php echo count( get_option( 'ultimate_blocks', [] ) ) === 0 ? 'empty' : ''; ?>">

			<?php foreach ( get_option( 'ultimate_blocks', array() ) as $block ) : ?>
				<div class="ub__collection__item <?php echo $block['active'] ? 'active' : ''; ?> " data-id="<?php echo esc_html( $block['name'] ); ?>">
					<div class="ub__collection__item__header">
						<h3 class="ub__collection__item__title"><?php printf( esc_html__( '%s', 'ultimate-blocks' ), $block['label'] ); ?></h3>
						<label class="ub-switch-input">
							<input type="checkbox" name="block_status" <?php echo $block['active'] ? 'checked' : ''; ?>>
							<span class="ub-switch-input-slider"></span>
						</label>
					</div>
				</div>
			<?php endforeach; ?>

		</div>
		<input type="hidden" name="ultimate_blocks_nonce" value="<?php echo esc_html( wp_create_nonce( 'toggle_block_status' ) ); ?>">
		<input type="hidden" name="ultimate_blocks_ajax_url" value="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
	</div>

	<div id="ub__settings_cta">
		<div class="ub__settings_column">
			<h3><?php esc_html_e( 'Further Actions', 'ultimate-blocks' ); ?></h3>
			<ul class="ub__settings_list">
				<li><a href="<?php echo esc_url( admin_url( 'post-new.php' ) ); ?>"><?php esc_html_e( 'Create New Post', 'ultimate-blocks' ); ?></a></li>
				<li><a href="<?php echo esc_url( admin_url( 'edit.php' ) ); ?>"><?php esc_html_e( 'Edit Posts', 'ultimate-blocks' ); ?></a></li>
			</ul>
		</div>
		<div class="ub__settings_column">
			<h3><?php esc_html_e( 'Stay Connected with Us', 'ultimate-blocks' ); ?></h3>
			<ul class="ub__settings_list">
				<li><a href="https://www.facebook.com/groups/ultimateblocks/" target="_blank"><?php esc_html_e( 'Join Our Facebook Group!', 'ultimate-blocks' ); ?></a></li>
				<li><a href="https://twitter.com/Ultimate_Blocks" target="_blank"><?php esc_html_e( 'Follow Us on Twitter!', 'ultimate-blocks' ); ?></a></li>
			</ul>
		</div>
	</div>
	<div id="ub__settings_cta">
		<div class="ub__settings_column">
			<h3 style="text-align: left"><?php esc_html_e( 'Other Plugins From Us', 'ultimate-blocks' ); ?></h3>
			<ul class="ub__settings_list">
				<li><a href="https://wordpress.org/plugins/wp-table-builder/" target="_blank"><?php esc_html_e( 'WP Table Builder ', 'ultimate-blocks' ); ?></a> - Drag & drop responsive table builder.</li>
				<li><a href="https://wordpress.org/plugins/wp-coupons-and-deals/" target="_blank"><?php esc_html_e( 'WP Coupons and Deals', 'ultimate-blocks' ); ?></a> - Coupons & deals plugin for affiliate marketers.</li>
			</ul>
		</div>	
	</div>

</div>
