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

<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

<div class="container">
    <div class="ultimate-blocks">
        <h1>Welcome to Ultimate Blocks!</h1>
        <h5>Essential Collection of Blocks for Gutenberg Editor</h5>
    </div>
    <div class="intro">
        <p>Ultimate Blocks comes with the essential Gutenberg blocks you need to create better content with Gutenberg.</p> 
        <h2><span class="color-red">11 awesome blocks.</span> More in the making...</h2>
        <div class="button-wrap ultimate-blocks-clear">
            <div class="left">
                <a href="<?php echo admin_url( 'admin.php?page=ultimate-blocks' ); ?>" class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-red">
                        <?php esc_html_e( 'Manage the Blocks', 'ultimate-blocks' ); ?>
                </a>
            </div>
            <div class="right">
                <a href="http://ultimateblocks.io/"
                        class="ultimate-blocks-btn ultimate-blocks-btn-block ultimate-blocks-btn-lg ultimate-blocks-btn-grey" target="_blank" rel="noopener noreferrer">
                        <?php esc_html_e( 'Learn More', 'ultimate-blocks-coupon' ); ?>
                </a>
            </div>
        </div>
    </div>
</div>
