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

<div id="ultimate-blocks__main-menu">

	<div id="ultimate-blocks__main-menu__header">
		<img src="<?php echo esc_url( ULTIMATE_BLOCKS_URL . 'admin/images/banners/banner-772x250.png' ); ?>" alt="Ultimate Blocks" />
	</div>

	<div id="ultimate-blocks__main-menu__body">

		<div class="ultimate-blocks__collection <?php echo esc_html( get_option( 'ultimate_blocks', 'empty' ) ); ?>">

			<?php foreach ( get_option( 'ultimate_blocks', [] ) as $block ) : ?>
				<div class="ultimate-blocks__collection__item" data-id="<?php echo esc_html( $block['name'] ); ?>">
					<div class="ultimate-blocks__collection__item_header">
						<h3 class="ultimate-blocks__collection__item__title"><?php printf( esc_html__( '%s', 'ultimate-blocks' ), $block['title'] ); ?></h3>
						<label class="switch">
							<input type="checkbox" name="block_status">
							<span class="slider"></span>
						</label>
					</div>
				</div>
			<?php endforeach; ?>

		</div>

	</div>

</div>
