<?php
/**
 * Help Page Content.
 *
 * This file is used to markup the help page the plugin.
 *
 * @link       http://ultimateblocks.io/
 * @since      1.0.2
 *
 * @package    ultimate_blocks
 * @subpackage ultimate_blocks/admin/templates/help/help-page
 */

?>

<div class="ub-container">
    <div class="ultimate-blocks">
        <h1><?php esc_html_e( 'Welcome to Ultimate Blocks!', 'ultimate-blocks' ); ?></h1>
        <h5><?php esc_html_e( 'Essential Collection of Blocks for Gutenberg Editor', 'ultimate-blocks' ); ?></h5>
    </div>
    <div class="ub-intro">
        <p><?php esc_html_e( 'Ultimate Blocks comes with the essential Gutenberg blocks you need to create better content with Gutenberg.', 'ultimate-blocks' ); ?></p>
        <h2><span class="color-red"><?php esc_html_e( '22 awesome blocks.', 'ultimate-blocks' ); ?></span> <?php esc_html_e( 'More in the making...', 'ultimate-blocks' ); ?></h2>
        <div class="ub-button-wrap ultimate-blocks-clear">
            <div class="left">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=ultimate-blocks-settings' ) ); ?>" class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-red">
                        <?php esc_html_e( 'Manage the Blocks', 'ultimate-blocks' ); ?>
                </a>
            </div>
            <div class="right">
                <a href="https://ultimateblocks.com/"
                        class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-grey" target="_blank" rel="noopener noreferrer">
                        <?php esc_html_e( 'Learn More', 'ultimate-blocks-coupon' ); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="ub-container">
    <div class="ub-social-intro">
        <h2><?php esc_html_e( 'Stay Connected with Us!', 'ultimate-blocks' ); ?></h2>
        <p><?php esc_html_e( 'For upcoming plugins updates, news, tips and tutorials on Gutenberg in general you can stay connected with us.', 'ultimate-blocks' ); ?></p>
        <div class="ub-social-button-wrap ultimate-blocks-clear">
            <div class="left">
                <a href="https://twitter.com/Ultimate_Blocks" target="_blank" class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-twitter">
                        <?php esc_html_e( 'Follow Us On Twitter!', 'ultimate-blocks' ); ?>
                </a>
            </div>
            <div class="right">
                <a href="https://www.facebook.com/groups/ultimateblocks/"
                        class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-facebook" target="_blank" rel="noopener noreferrer">
                        <?php esc_html_e( 'Join Our Facebook Group!', 'ultimate-blocks' ); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="ub-container">
	<div class="ub-social-intro" style="min-height: 250px;">
		<h2><?php esc_html_e( 'Other Plugins From Us', 'ultimate-blocks' ); ?></h2>
		<div class="left">
			<p style="text-align: left;"><a href="https://wordpress.org/plugins/wp-table-builder/" target="_blank"><?php esc_html_e( 'WP Table Builder', 'ultimate-blocks' ); ?></a> - Drag & drop responsive table builder.</p>		
		</div>
		<div class="right">
			<p style="text-align: left;"><a href="https://wordpress.org/plugins/wp-coupons-and-deals/" target="_blank""><?php esc_html_e( 'WP Coupons and Deals', 'ultimate-blocks' ); ?></a> Coupons & deals plugin for affiliate marketers.</p>
		</div>
	</div>
</div>