<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */
function ub_render_single_button_block($attributes){
    require_once dirname(dirname(dirname(__DIR__))) . '/common.php';
    extract($attributes);

    $presetIconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    $buttonDisplay = '
    <a href="' . esc_url($url) . '" target="' . ($openInNewTab ? '_blank' : '_self') . '"
    rel="noopener noreferrer' . ($addNofollow ? ' nofollow' : '') . ($addSponsored ? ' sponsored' : '') . '"
    class="ub-button-block-main ub-button-' . $size .
    ($buttonWidth === 'full' ? ' ub-button-full-width' :
        ($buttonWidth === 'flex' ? ' ub-button-flex-'. $size : '')) . '" role="button">
    <div class="ub-button-content-holder">'.
        (($chosenIcon !== '' && !is_null($chosenIcon))? '<span class="ub-button-icon-holder">' .
        '<svg xmlns="http://www.w3.org/2000/svg"' .
        'height="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em':'') .
        '", width="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em' :'') . '"' .
        'viewBox="0, 0, ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0] . ', ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1]
        . '"><path fill="currentColor" d="' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2] . '"></svg>'
        . '</span>': '')
        .'<span class="ub-button-block-btn">' . wp_kses_post($buttonText) . '</span>
    </div></a>';

    $classes = array('ub-button');
    $block_attributes = get_block_wrapper_attributes(
            array(
                'class' => implode(" ", $classes),
                'id' => 'ub-button-' . $blockID . ''
            )
    );

	return '<div '. $block_attributes . '>' . $buttonDisplay . '</div>';
}
function ub_get_single_button_styles($attributes){
	$padding			= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['padding']) ? $attributes['padding'] : array() );
	$margin 			= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['margin']) ? $attributes['margin'] : array() );
	$border 			= Ultimate_Blocks\includes\get_border_variables_css(!empty($attributes['border']) ? $attributes['border'] : array(), 'button');

	$border_radius = array(
		"--ub-button-top-left-radius"		=> !empty($attributes['borderRadius']['topLeft']) ? $attributes['borderRadius']['topLeft'] : "",
		"--ub-button-top-right-radius"		=> !empty($attributes['borderRadius']['topRight']) ? $attributes['borderRadius']['topRight'] : "",
		"--ub-button-bottom-left-radius"	=> !empty($attributes['borderRadius']['bottomLeft']) ? $attributes['borderRadius']['bottomLeft'] : "",
		"--ub-button-bottom-right-radius"	=> !empty($attributes['borderRadius']['bottomRight']) ? $attributes['borderRadius']['bottomRight'] : "",
	);

	$is_transparent				= isset($attributes['buttonIsTransparent']) && $attributes['buttonIsTransparent'];
	$gradient_value				= !Ultimate_Blocks\includes\is_undefined($attributes['buttonGradientColor']) ? $attributes['buttonGradientColor'] : '';
	$bg_color_value  			= !Ultimate_Blocks\includes\is_undefined($attributes['buttonColor']) ? $attributes['buttonColor'] : '';
	$button_text_color  		= !Ultimate_Blocks\includes\is_undefined($attributes['buttonTextColor']) ? $attributes['buttonTextColor'] : '';
	$button_hover_text_color  	= !Ultimate_Blocks\includes\is_undefined($attributes['buttonTextHoverColor']) ? $attributes['buttonTextHoverColor'] : '';
	$bg_hover_color_value  		= !Ultimate_Blocks\includes\is_undefined($attributes['buttonHoverColor']) ? $attributes['buttonHoverColor'] : '';
	$bg_hover_gradient_value  	= !Ultimate_Blocks\includes\is_undefined($attributes['buttonHoverGradientColor']) ? $attributes['buttonHoverGradientColor'] : '';
	$bg_hover_color				= !empty($bg_color_value) ? $bg_hover_color_value : $bg_hover_gradient_value;
	$button_bg_hover_color	 	= $is_transparent ? 'transparent' : $bg_hover_color;
	$bg_color  					= !empty($bg_color_value) ? $bg_color_value : $gradient_value;
	$button_bg_color 			= $is_transparent ? "transparent" : $bg_color;

	$styles = array(
		// Colors
		"--ub-button-bg-color" 						=> $button_bg_color,
		"--ub-button-text-color" 					=> $is_transparent ? $bg_color_value : $button_text_color,
		"--ub-button-hover-bg-color" 				=> $button_bg_hover_color,
		"--ub-button-hover-text-color" 				=> $is_transparent ? $bg_hover_color_value : $button_hover_text_color,
		'padding-left'        						=> isset($padding['left']) ? $padding['left'] : "",
		'padding-right'       						=> isset($padding['right']) ? $padding['right'] : "",
		'padding-bottom'      						=> isset($padding['bottom']) ? $padding['bottom'] : "",
		'margin-top'         						=> !empty($margin['top']) ? $margin['top'] . " !important" : "",
		'margin-left'        						=> !empty($margin['left']) ? $margin['left'] . " !important" : "",
		'margin-right'       						=> !empty($margin['right']) ? $margin['right'] . " !important" : "",
		'margin-bottom'      						=> !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
	);
	$styles = array_merge( $styles, $border_radius, $border );

	$css = Ultimate_Blocks\includes\generate_css_string($styles);

	return $css;
}
function ub_single_button_add_frontend_assets() {
    require_once dirname(dirname(dirname(__DIR__))) . '/common.php';

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

function ub_register_single_button_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(dirname(__DIR__))) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(dirname(__DIR__)))) . '/dist/blocks/buttons/button', array(
            'attributes' => $defaultValues['ub/single-button']['attributes'],
			'render_callback' => 'ub_render_single_button_block'));
	}
}

add_action('init', 'ub_register_single_button_block');

add_action( 'wp_enqueue_scripts', 'ub_single_button_add_frontend_assets' );
