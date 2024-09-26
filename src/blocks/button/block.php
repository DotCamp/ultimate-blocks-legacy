<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */

function ub_multi_buttons_parse($b){
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

	if ($chosenIcon !== '' && !is_null($chosenIcon)) {
		$icon = sprintf(
			'<span class="ub-button-icon-holder">
				<svg xmlns="http://www.w3.org/2000/svg" height="%1$s", width="%2$s" viewBox="0, 0, %3$s, %4$s">
					<path fill="currentColor" d="%5$s">
				</svg>
			</span>',
			($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em':''),
			($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em' :''),
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0],
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1],
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2],
		);
	} else {
		$icon = '';
	}

	$link_rel = sprintf(
		'noopener noreferrer %1$s %2$s',
		$addNofollow ? ' nofollow' : '',
		$addSponsored ? ' sponsored' : '',
	);

	$link_class = sprintf(
		'ub-button-block-main ub-button-%1$s %2$s %3$s',
		$size,
		$buttonWidth === 'full' ? ' ub-button-full-width' : '',
		$buttonWidth === 'flex' ? ' ub-button-flex-'. $size : ''
	);

	$style_vars = [
		'--ub-button-background-color'			=> $buttonIsTransparent ? 'transparent' : esc_attr($buttonColor),
		'--ub-button-color'						=> $buttonIsTransparent ? esc_attr($buttonColor) : ($buttonTextColor ? esc_attr($buttonTextColor) : 'inherit'),
		'--ub-button-border'					=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonColor) : 'none',
		'--ub-button-hover-background-color'	=> $buttonIsTransparent ? '' : esc_attr($buttonHoverColor),
		'--ub-button-hover-color'				=> $buttonIsTransparent ? esc_attr($buttonHoverColor) : esc_attr($buttonTextHoverColor),
		'--ub-button-hover-border'				=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonHoverColor) : 'none',
	];
	$link_style = Ultimate_Blocks\includes\generate_css_string($style_vars);

	if (isset($isBorderComponentChanged) && $isBorderComponentChanged) {
		$link_border_radius_styles = [
			'border-top-left-radius' => !empty( $borderRadius['topLeft'] ) ? esc_attr($borderRadius['topLeft']) . ';': "",
			'border-top-right-radius' => !empty( $borderRadius['topRight'] ) ?  esc_attr($borderRadius['topRight']) . ';': "",
			'border-bottom-left-radius' => !empty( $borderRadius['bottomLeft'] ) ?  esc_attr($borderRadius['bottomLeft']) . ';': "",
			'border-bottom-right-radius' => !empty( $borderRadius['bottomRight'] ) ?  esc_attr($borderRadius['bottomRight']) . ';': "",
		];
	} elseif ($buttonRounded) {
		if ( array_key_exists( 'topLeftRadius', $b ) && array_key_exists( 'topLeftRadiusUnit', $b ) && array_key_exists( 'topRightRadius', $b ) && array_key_exists( 'topRightRadiusUnit', $b ) && array_key_exists( 'bottomLeftRadius', $b ) && array_key_exists( 'bottomLeftRadiusUnit', $b ) && array_key_exists( 'bottomRightRadius', $b ) && array_key_exists( 'bottomRightRadiusUnit', $b ) ) {
			if ( count( array_unique( [ $b['topLeftRadius'], $b['topRightRadius'], $b['bottomLeftRadius'], $b['bottomRightRadius'] ] ) ) === 1 && count( array_unique( [ $b['topLeftRadiusUnit'], $b['topRightRadiusUnit'], $b['bottomLeftRadiusUnit'], $b['bottomRightRadiusUnit'] ] ) ) === 1 ) {
				$link_border_radius_styles = [
					'border-radius' => $b['topLeftRadius'] . $b['topLeftRadiusUnit']
				];
			} else {
				$link_border_radius_styles = [
					'border-radius' => $b['topLeftRadius'] . $b['topLeftRadiusUnit'] . ' ' . $b['topRightRadius'] . $b['topRightRadiusUnit'] . ' ' . $b['bottomRightRadius'] . $b['bottomRightRadiusUnit'] . ' ' . $b['bottomLeftRadius'] . $b['bottomLeftRadiusUnit']
				];
			}
		} else {
			$link_border_radius_styles = [
				'border-radius' => ( array_key_exists( 'buttonRadius', $b ) && $buttonRadius ? $buttonRadius : '60' ) . ( array_key_exists( 'buttonRadiusUnit', $b ) && $buttonRadiusUnit ? $buttonRadiusUnit : 'px' )
			];
		}
	} else {
		$link_border_radius_styles = [
			'border-radius' => '0'
		];
	}

	$link_style .= Ultimate_Blocks\includes\generate_css_string($link_border_radius_styles);

	return sprintf(
		'<div class="ub-button-container%1$s">
			<a href="%2$s" target="%3$s" rel="%4$s" class="%5$s" role="button" style="%9$s">
				<div class="ub-button-content-holder" style="flex-direction: %8$s">
					%6$s<span class="ub-button-block-btn">%7$s</span>
				</div>
			</a>
		</div>',
		($buttonWidth === 'full' ? ' ub-button-full-container' : ''),
		esc_url($url),
		($openInNewTab ? '_blank' : '_self'),
		$link_rel,
		$link_class,
		$icon,
		$buttonText,
		$iconPosition === 'left' ? 'row' : 'row-reverse',
		$link_style
	);
}

function ub_single_button_parse($b) {
    require_once dirname(dirname(__DIR__)) . '/common.php';

	extract($b);

    $iconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

	$link_class = sprintf(
		'ub-button-block-main ub-button-%1$s %2$s %3$s',
		esc_attr($size),
		$buttonWidth === 'full' ? 'ub-button-full-width' : '',
		$buttonWidth === 'flex' ? 'ub-button-flex-' . esc_attr($size) : ''
	);

	$link_style = sprintf('border-radius: %1$spx;', $buttonRounded ? '60' : '0');

	$style_vars = [
		'--ub-button-background-color'			=> $buttonIsTransparent ? 'transparent' : esc_attr($buttonColor),
		'--ub-button-color'						=> $buttonIsTransparent ? esc_attr($buttonColor) : esc_attr($buttonTextColor),
		'--ub-button-border'					=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonColor) : 'none',
		'--ub-button-hover-background-color'	=> $buttonIsTransparent ? '' : esc_attr($buttonHoverColor),
		'--ub-button-hover-color'				=> $buttonIsTransparent ? esc_attr($buttonHoverColor) : esc_attr($buttonTextHoverColor),
		'--ub-button-hover-border'				=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonHoverColor) : 'none',
	];
	$link_style .= Ultimate_Blocks\includes\generate_css_string($style_vars);

	$link_attrs = sprintf(
		'href="%1$s" target="%2$s" rel="noopener noreferrer%3$s" class="%4$s" style="%5$s"',
		esc_url($url),
		($openInNewTab ? '_blank' : '_self'),
		($addNofollow ? ' nofollow' : ''),
		$link_class,
		$link_style,
	);

	if ($chosenIcon !== '') {
		$icon = sprintf(
			'<span class="ub-button-icon-holder">
				<svg xmlns="http://www.w3.org/2000/svg" height="%1$s", width="%2$s" viewBox="0, 0, %3$s, %4$s">
					<path fill="currentColor" d="%5$s">
				</svg>
			</span>',
			esc_attr($iconSize[$size]),
			esc_attr($iconSize[$size]),
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0],
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1],
			Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2]
		);
	} else {
		$icon = '';
	}

	return sprintf(
		'<div %1$s>
			<a %2$s>
				<div class="ub-button-content-holder" style="flex-direction: %3$s">
					%4$s<span class="ub-button-block-btn">%5$s</span>
				</div>
			</a>
		</div>',
		$container_attrs,
		$link_attrs,
		$attributes['iconPosition'] === 'left' ? 'row' : 'row-reverse',
		$icon,
		wp_kses_post($buttonText),
	);
}

function ub_render_button_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';
    extract($attributes);

	$multiButton = isset($buttons) && count($buttons) > 0;

    $classes = array();

	$styles = ub_get_spacing_styles($attributes);
	$styles .= !Ultimate_Blocks\includes\is_undefined( $blockSpacing ) ? '--ub-button-improved-block-spacing:' . Ultimate_Blocks\includes\spacing_preset_css_var($blockSpacing['all'])  . ';': "";

	if ($multiButton) {
		foreach ($buttons as $key => &$b) {
			$b['isBorderComponentChanged'] = $isBorderComponentChanged;
		}
		$buttonDisplay = join('', array_map('ub_multi_buttons_parse', $buttons));

		$classes[] = $align === '' ? 'align-button-center' : 'align-button-' . esc_attr($align);
		$classes[] = 'ub-buttons';

		$spacing = !Ultimate_Blocks\includes\is_undefined( $attributes['blockSpacing'] ) ?
			Ultimate_Blocks\includes\spacing_preset_css_var($attributes['blockSpacing']['all']) :
			'20px';
		$styles .= sprintf('gap: %1$s;', $spacing);
	} else {
		$buttonDisplay = ub_single_button_parse($attributes);
		$classes[] = 'ub-button';
	}

    $classes[] = 'orientation-button-' . esc_attr($orientation) . '';
	$classes[] = $isFlexWrap ?? 'ub-flex-wrap';

    $block_attributes = get_block_wrapper_attributes(
            array(
				'class' => esc_attr(implode(" ", $classes)),
				'style' => esc_attr($styles),
            )
    );

	if (isset($blockID) && $blockID !== '') {
		$id = sprintf('id="ub-button-%1$s"', esc_attr($blockID));
	} else {
		$id = '';
	}

	return sprintf(
		'<div %1$s %2$s>%3$s</div>',
		$block_attributes,
		$id,
		$buttonDisplay,
	);
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
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/button', array(
            'attributes' => $defaultValues['ub/button']['attributes'],
			'render_callback' => 'ub_render_button_block'));
	}
}

add_action('init', 'ub_register_button_block');

add_action( 'wp_enqueue_scripts', 'ub_button_add_frontend_assets' );
