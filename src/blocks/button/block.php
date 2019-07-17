<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */

function ub_render_button_block($attributes){
    extract($attributes);

    require_once  dirname(dirname(__DIR__)) . '/common.php';

    $iconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    return '<div class="ub-button-container align-button-'.$align.'">
                <a href="'.$url.'" target="'.($openInNewTab ? '_blank' : '_self').'"
                rel="noopener noreferrer'.($addNofollow ? ' nofollow' : '').'"
                class="ub-button-block-main ub-button-'.$size.'"
                data-defaultColor="'.$buttonColor.'"
                data-defaultTextColor="'.$buttonTextColor.'"
                data-hoverColor="'.$buttonHoverColor.'"
                data-hoverTextColor="'.$buttonTextHoverColor.'"
                data-buttonIsTransparent="'.json_encode($buttonIsTransparent).'"
                style="background-color: '.($buttonIsTransparent ? 'transparent' : $buttonColor).';
                    color: '.($buttonIsTransparent ? $buttonColor : $buttonTextColor).';
                    border-radius: '.($buttonRounded ? '60' : '0').'px;
                    border: '.($buttonIsTransparent ? ('3px solid '.$buttonColor) : 'none').';">
                <div class="ub-button-content-holder"
                    style="flex-direction: '.($iconPosition === 'left' ? 'row' : 'row-reverse').';">'.
                    ($chosenIcon != '' ? '<span class="ub-button-icon-holder"><svg xmlns="http://www.w3.org/2000/svg"
                    height="'.$iconSize[$size].'", width="'.$iconSize[$size].'"
                    viewBox="0, 0, '.$fontAwesomeIcon[$chosenIcon][0].', '.$fontAwesomeIcon[$chosenIcon][1]
                    .'"><path fill="currentColor" d="'.$fontAwesomeIcon[$chosenIcon][2].'"></svg></span>    ': '')
                    .'<span class="ub-button-block-btn">'.$buttonText.'</span>
                </div>
            </a>
        </div>';
}

function ub_button_add_frontend_assets() {
    if ( has_block( 'ub/button-block' ) || has_block('ub/button')) {
        wp_enqueue_script(
            'ultimate_blocks-button-front-script',
            plugins_url( 'button/front.build.js', dirname( __FILE__ ) ),
            array( ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

function ub_register_button_block() {
	if ( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/button', array(
            'attributes' => array(
                'buttonText' => array(
                    'type' => 'string',
                    'default' => 'Button Text'
                ),
                'align' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
                'url' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'size' => array(
                    'type' => 'string',
                    'default' => 'medium'
                ),
                'buttonColor' => array(
                    'type' => 'string',
                    'default' => '#313131'
                ),
                'buttonHoverColor' => array(
                    'type' => 'string',
                    'default' => '#313131'
                ),
                'buttonTextColor' => array(
                    'type' => 'string',
                    'default' => '#ffffff'
                ),
                'buttonTextHoverColor' => array(
                    'type' => 'string',
                    'default' => '#ffffff'
                ),
                'buttonRounded' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'chosenIcon' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'iconPosition' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'buttonIsTransparent' => array(
                    'type' => 'boolean',
                    'default'=> false
                ),
                'addNofollow' => array(
                    'type' => 'boolean',
                    'default'=> false
                ),
                'openInNewTab' => array(
                    'type' => 'boolean',
                    'default'=> false
                )
            ),
			'render_callback' => 'ub_render_button_block'));
	}
}

add_action('init', 'ub_register_button_block');

add_action( 'wp_enqueue_scripts', 'ub_button_add_frontend_assets' );