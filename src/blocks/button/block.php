<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */


function ub_buttons_parse($b){
    require_once dirname(dirname(__DIR__)) . '/common.php';

    //defaults
    $buttonWidth = 'fixed' ;
    $url = '';
    $openInNewTab = true;
    $addNofollow = true;
    $addSponsored = false;
    $size = 'medium';
    $iconSize = 0;
    $chosenIcon = '';
    $buttonText = 'Button Text';
    $iconUnit = 'px';

    extract($b); //should overwrite the values above if they exist in the array

    $presetIconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    return '<div class="ub-button-container' . ($buttonWidth === 'full' ? ' ub-button-full-container' : '') . '">
    <a href="' . esc_url($url) . '" target="' . ($openInNewTab ? '_blank' : '_self') . '"
    rel="noopener noreferrer' . ($addNofollow ? ' nofollow' : '') . ($addSponsored ? ' sponsored' : '') . '"
    class="ub-button-block-main ub-button-' . $size .
    ($buttonWidth === 'full' ? ' ub-button-full-width' :
        ($buttonWidth === 'flex' ? ' ub-button-flex-'. $size : '')) . '" role="button">
    <div class="ub-button-content-holder">'.
        ($chosenIcon !== '' ? '<span class="ub-button-icon-holder">' . 
        '<svg xmlns="http://www.w3.org/2000/svg"' .
        'height="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em':'') .
        '", width="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em' :'') . '"' .
        'viewBox="0, 0, ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0] . ', ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1]
        . '"><path fill="currentColor" d="' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2] . '"></svg>'
        . '</span>': '')
        .'<span class="ub-button-block-btn">' . $buttonText . '</span>
    </div></a></div>';
}


function ub_render_button_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);

    $iconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    $buttonDisplay = (!isset($buttons) || count($buttons) === 0 ? '<div class="ub-button-container align-button-' . $align . (isset($className) ? ' ' . esc_attr($className) : '') . '"' . (!isset($blockID) || $blockID === '' ? ' ': ' id="ub-button-' . $blockID . '"') . '>
    <a href="' . esc_url($url) . '" target="' . ($openInNewTab ? '_blank' : '_self') . '"
    rel="noopener noreferrer' . ($addNofollow ? ' nofollow' : '').'"
    class="ub-button-block-main ub-button-' . $size .
    ($buttonWidth === 'full' ? ' ub-button-full-width' :
        ($buttonWidth === 'flex' ? ' ub-button-flex-' . $size : '')) . '">
    <div class="ub-button-content-holder">' .
        ($chosenIcon !== '' ? '<span class="ub-button-icon-holder"><svg xmlns="http://www.w3.org/2000/svg"
        height="' . $iconSize[$size] . '", width="' . $iconSize[$size] . '"
        viewBox="0, 0, ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0] . ', ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1]
        .'"><path fill="currentColor" d="' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2] . '"></svg></span>': '')
        .'<span class="ub-button-block-btn">' . $buttonText . '</span>
    </div></a></div>' : join('', array_map('ub_buttons_parse', $buttons)));

    return '<div class="' . (isset($buttons) && count($buttons) > 0 ? 'ub-buttons' : 'ub-button') . (isset($buttons) && count($buttons) > 0 ? ' align-button-' . ($align === '' ? 'center' : $align) : '')
    .(isset($className) ? ' ' . esc_attr($className) : '') . '" ' .(!isset($blockID) || $blockID === '' ? ' ': ' id="ub-button-' . $blockID . '"') . '>' .$buttonDisplay . '</div>';
}

function ub_button_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if(($block['blockName'] === 'ub/button' && !isset($block['attrs']['blockID'])) || $block['blockName'] === 'ub/button-block'){
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
