<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */



function ub_render_button_block($attributes){
    extract($attributes);

    require dirname(dirname(__DIR__)) . '/common.php';
    
    $iconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    return '<div class="ub-button-container align-button-'.$align.(isset($className) ? ' ' . esc_attr($className) : '').'"' . (!isset($blockID) || $blockID == '' ? ' ': ' id="ub-button-'.$blockID.'"') . '>
                <a href="'.esc_url($url).'" target="'.($openInNewTab ? '_blank' : '_self').'"
                rel="noopener noreferrer'.($addNofollow ? ' nofollow' : '').'"
                class="ub-button-block-main ub-button-' . $size .
                ($buttonWidth == 'full' ? ' ub-button-full-width' :
                    ($buttonWidth == 'flex' ? ' ub-button-flex-'. $size : '')) . '"' .
                (isset($blockID) && $blockID != '' ? '': 'data-defaultColor="'.$buttonColor.'"
                data-defaultTextColor="'.$buttonTextColor.'"
                data-hoverColor="'.$buttonHoverColor.'"
                data-hoverTextColor="'.$buttonTextHoverColor.'"
                data-buttonIsTransparent="'.json_encode($buttonIsTransparent).'"
                style="background-color: '.($buttonIsTransparent ? 'transparent' : $buttonColor).';'.
                'color: '.($buttonIsTransparent ? $buttonColor : $buttonTextColor).';'.
                'border-radius: '.($buttonRounded ? '60' : '0').'px;'.
                'border: '.($buttonIsTransparent ? ('3px solid '.$buttonColor) : 'none').';"').'>
                <div class="ub-button-content-holder">'.
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
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if(($block['blockName'] == 'ub/button' && !isset($block['attrs']['blockID'])) || $block['blockName'] == 'ub/button-block'){
            wp_enqueue_script(
                'ultimate_blocks-button-front-script',
                plugins_url( 'button/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            break;
        }
    }
}

function ub_register_button_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/button', array(
            'attributes' => $defaultValues['ub/button']['attributes'],
			'render_callback' => 'ub_render_button_block'));
	}
}

add_action('init', 'ub_register_button_block');

add_action( 'wp_enqueue_scripts', 'ub_button_add_frontend_assets' );