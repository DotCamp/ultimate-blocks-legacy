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
        <h5><?php esc_html_e( 'Essential Collection of Blocks for Block Editor', 'ultimate-blocks' ); ?></h5>
    </div>
    <div class="ub-intro">
        <p style="font-size: 25px; font-weight: bold; margin-top: 0;"><?php esc_html_e( "Ultimate Blocks plugin makes building content in WordPress a breeze!", 'ultimate-blocks' ); ?></p>
		<p><?php esc_html_e( "With its cool customizable blocks, like table of contents, tabbed content,", 'ultimate-blocks');?>
		<?php esc_html_e( "content toggle and buttons, you can create engaging and attractive content in no time.", "ultimate-blocks" ); ?>
		<?php esc_html_e( "Plus, it's SEO-friendly, so your content stays fresh and easy to find.", "ultimate-blocks");?></p>
		<p><?php esc_html_e( "Say hello to a better online presence with Ultimate Blocks!", "ultimate-blocks");?></p>
		<p><?php esc_html_e( "Here's a short video showing how you can get started with Ultimate Blocks.", "ultimate-blocks");?></p>
		<iframe class="ub-welcome-youtube-video" src="https://www.youtube.com/embed/I1LEsUvxGDc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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
	<div class="ub-social-intro" style="min-height: 250px;">
		<h2><?php esc_html_e( 'Get Our Free WordPress Block Theme', 'ultimate-blocks' ); ?></h2>
		<p><?php esc_html_e( "GroundWP is a free, lightweight WordPress theme centered around block patterns. Its blazing-fast speed and block-based design let you create stunning, responsive websites with ease. Experience seamless customization and top-notch performance with GroundWP!", "ultimate-block"); ?></p>
		
		<img src="https://i0.wp.com/themes.svn.wordpress.org/groundwp/1.5.5/screenshot.png" style="max-width: 100%" alt="" srcset="">
		<a target="_blank" href="https://wordpress.org/themes/groundwp/" style="display: block;width: 300px;margin: 50px auto 10px auto;" class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-red"><?php esc_html_e( 'Download GroundWP Free!', 'ultimate-blocks' ); ?></a>
		<h2><?php esc_html_e( 'Combine Ultimate Blocks With GroundWP to Create Better Content and Better Website!', 'ultimate-blocks' ); ?></h2>
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

