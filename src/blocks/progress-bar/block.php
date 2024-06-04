<?php
require_once dirname(dirname(dirname(__DIR__))) . '/includes/ultimate-blocks-styles-css-generator.php';

function ub_is_undefined($value) {
    return $value === null || !isset($value) || empty($value);
}
function ub_generate_css_string($styles) {
    $css_string = '';

    foreach ($styles as $key => $value) {
        if (!ub_is_undefined($value) && $value !== false && trim($value) !== '' && trim($value) !== 'undefined undefined undefined' && !empty($value)) {
            $css_string .= $key . ': ' . $value . '; ';
        }
    }

    return $css_string;
}
function ub_progress_bar_styles($attributes){
    $padding = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
    $margin = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );

    $styles = [
        '--ub-bar-top-left-radius'      => isset( $attributes['barBorderRadius']['topLeft'] ) ? $attributes['barBorderRadius']['topLeft'] : '',
        '--ub-bar-top-right-radius'     => isset( $attributes['barBorderRadius']['topRight'] ) ? $attributes['barBorderRadius']['topRight'] : '',
        '--ub-bar-bottom-left-radius'   => isset( $attributes['barBorderRadius']['bottomLeft'] ) ? $attributes['barBorderRadius']['bottomLeft'] : '',
        '--ub-bar-bottom-right-radius'  => isset( $attributes['barBorderRadius']['bottomRight'] ) ? $attributes['barBorderRadius']['bottomRight'] : '',
        '--ub-progress-bar-padding-top'      => isset($padding['top']) ? esc_attr($padding['top']) : "",
        '--ub-progress-bar-padding-right'    => isset($padding['right']) ? esc_attr($padding['right']) : "",
        '--ub-progress-bar-padding-bottom'   => isset($padding['bottom']) ? esc_attr($padding['bottom']) : "",
        '--ub-progress-bar-padding-left'     => isset($padding['left']) ? esc_attr($padding['left']) : "",
        '--ub-progress-bar-margin-top'       => isset($margin['top']) ? esc_attr($margin['top'])  : "",
        '--ub-progress-bar-margin-right'     => isset($margin['left']) ? esc_attr($margin['left'])  : "",
        '--ub-progress-bar-margin-bottom'    => isset($margin['right']) ? esc_attr($margin['right'])  : "",
        '--ub-progress-bar-margin-left'      => isset($margin['bottom']) ? esc_attr($margin['bottom'])  : "",
        '--ub-progress-bar-label-font-size'  => isset($attributes['barThickness']) ? ($attributes['barThickness'] + 5) . '%' : "6%",
    ];
    return ub_generate_css_string($styles);
}
function ub_render_progress_bar_block($attributes, $block_content, $block){
    extract($attributes);
    $blockName = 'ub_progress-bar';
    $chosenProgressBar = '';

    $is_style_circle = isset($attributes['className']) ? strpos($attributes['className'], "is-style-ub-progress-bar-circle-wrapper") !== false : "";
    $is_style_half_circle = isset($attributes['className']) ? strpos($className, "is-style-ub-progress-bar-half-circle-wrapper") !== false : "";

    $percentage_position = $attributes['percentagePosition'];
    $is_stripe = $attributes['isStripe'];

    $show_number                = isset($attributes['showNumber']) ? $attributes['showNumber'] : true;
    $number_prefix              = isset($attributes['numberPrefix']) ? $attributes['numberPrefix'] : '';
    $number_suffix              = isset($attributes['numberSuffix']) ? $attributes['numberSuffix'] : '%';
    $inside_percentage_class    = $percentage_position === 'inside' ? " ub_progress-bar-label-inside" : '';
    $stripe_style               = $is_stripe ? " ub_progress-bar-stripe" : '';
    $detail_text                = '<div class="ub_progress-bar-text"><p' . ($blockID === '' ? ' style="justify-content: ' . esc_attr($detailAlign) . ';"' : '') . '>' . wp_kses_post($detail) . '</p></div>';
    $percentage_text            = '<div class="' . $blockName . '-label'. ( $percentage_position === 'top' ? ' ub_progress-bar-label-top' : '' )  . '"' . ($blockID === '' ? ' style="width:' . esc_attr($percentage) . '%;"' : '') . '><p>
                                    <span class="ub-progress-number-prefix">' . wp_kses_post($number_prefix) . '</span>
                                    <span class="ub-progress-number-value">' . wp_kses_post($percentage) . '</span>
                                    <span class="ub-progress-number-suffix">' . wp_kses_post($number_suffix) . '</span>
                                  </p></div>';

    $top_percentage = $show_number && $percentage_position === 'top'  ?
    '<div class="ub_progress-detail-wrapper">
         ' . $detail_text . '
         ' . $percentage_text . '
    </div>' : '<div class="ub_progress-detail-wrapper">
         ' . $detail_text . '
    </div>';
    $inside_percentage = $show_number && $percentage_position === 'inside'  ?
    '<foreignObject width="100%" height="100%" viewBox="0 0 120 10" x="0" y="0">
        ' . $percentage_text . '
    </foreignObject>' : "";
    $bottom_percentage = $show_number && $percentage_position === 'bottom' ? $percentage_text : "";

    $stripe_element = $is_stripe ?
        '<foreignObject width="100%" height="100%">
			<div class="ub_progress-bar-line-stripe" ></div>
		</foreignObject>' : '';
    $circle_percentage = $show_number ? '<div class="' . $blockName . '-label">
                                    <span class="ub-progress-number-prefix">' . wp_kses_post($number_prefix) . '</span>
                                    <span class="ub-progress-number-value">' . wp_kses_post($percentage) . '</span>
                                    <span class="ub-progress-number-suffix">' . wp_kses_post($number_suffix) . '</span></div>' : '';
    if(!$is_style_circle && !$is_style_half_circle){
        $progressBarPath = 'M' . ($barThickness / 2) . ',' . ($barThickness / 2)
                            . 'L' . (100 - $barThickness / 2) . ',' . ($barThickness / 2);
        $chosenProgressBar = '<div class="' . $blockName . '-container' . $inside_percentage_class . $stripe_style . '" id="' . esc_attr($blockID) . '">
        ' . $top_percentage . ' <svg class="' . $blockName . '-line" viewBox="0 0 100 ' . esc_attr($barThickness) . '" preserveAspectRatio="none">
            <path class="' . $blockName . '-line-trail" d="' . $progressBarPath . '" stroke="' . esc_attr($barBackgroundColor) . '" stroke-width="' . esc_attr($barThickness) . '"/>
            <path class="' . $blockName . '-line-path" d="' . $progressBarPath . '" stroke="' . esc_attr($barColor) . '"
                stroke-width="' . esc_attr($barThickness) . '"' . ($blockID === '' ? ' style="stroke-dashoffset:' .  (100 - $percentage) . 'px;"' : '') . '/>
                ' . $stripe_element . $inside_percentage . '
        </svg>' . $bottom_percentage . '</div>';
    }
    else if ($is_style_circle) {
        $circleRadius = 50 - ($barThickness + 3) / 2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,' . (-$circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * $circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="' . $blockName.'-container" ' . ($blockID === '' ? 'style="height: ' . esc_attr($circleSize) . 'px; width: ' . esc_attr($circleSize) . 'px;"' : 'id="' . esc_attr($blockID) . '"') . '>
        <svg class="' . $blockName . '-circle" height="' . esc_attr($circleSize) . '" width="' . esc_attr($circleSize) . '" viewBox = "0 0 100 100">
            <path class="' . $blockName . '-circle-trail" d="' . $progressBarPath . '" stroke="' . esc_attr($barBackgroundColor) . '" stroke-width="' . ($barThickness + 2) . '"'.
                ($blockID === '' ? ' style = "stroke-dasharray: ' . $circlePathLength . 'px,' . $circlePathLength . 'px"':'') . '/>
            <path class="' . $blockName . '-circle-path" d="' . $progressBarPath . '" stroke="' . esc_attr($barColor) . '"
                stroke-width="' . ($barThickness + 2) . '" stroke-linecap="butt"'.
                ($blockID === '' ? ' style="stroke-dasharray: ' . $strokeArcLength . 'px, ' . $circlePathLength . 'px"':'').'/>
        </svg>
       '. $circle_percentage .'</div>';
    } else if ($is_style_half_circle){
        $halfCircleRadius = 50 - ($barThickness + 2) / 2;
        $halfCirclePathLength = $halfCircleRadius * M_PI;
        $halfCircleStrokeArcLength = ($halfCirclePathLength * $percentage) / 100;
        $halfCircleProgressBarPath = 'M 50,50 m -' . $halfCircleRadius . ',0 ' .
            'a ' . $halfCircleRadius . ',' . $halfCircleRadius . ' 0 1 1 ' . ($halfCircleRadius * 2) . ',0';

        $chosenProgressBar = '<div class="' . $blockName . '-container" ' . ($blockID === '' ? 'style="height: ' . esc_attr($circleSize) . 'px; width: ' . esc_attr($circleSize) . 'px;"' : 'id="' . esc_attr($blockID) . '"') . '>
            <svg class="' . $blockName . '-circle" height="' . esc_attr($circleSize) . '" width="' . esc_attr($circleSize) . '" viewBox="0 0 100 100">
                <path class="' . $blockName . '-circle-trail" d="' . $halfCircleProgressBarPath . '" stroke="' . esc_attr($barBackgroundColor) . '" stroke-width="' . ($barThickness + 2) . '"'.
                ($blockID === '' ? ' style="stroke-dasharray: ' . $halfCirclePathLength . 'px,' . $halfCirclePathLength . 'px"':'') . '/>
                <path class="' . $blockName . '-circle-path" d="' . $halfCircleProgressBarPath . '" stroke="' . esc_attr($barColor) . '"
                    stroke-width="' . ($barThickness + 2) . '" stroke-linecap="butt"'.
                    ($blockID === '' ? ' style="stroke-dasharray: ' . $halfCircleStrokeArcLength . 'px, ' . $halfCirclePathLength . 'px"':'').'/>
            </svg>
          ' . $circle_percentage . '</div>';

        }
    $classes = array( 'wp-block-ub-progress-bar', 'ub_progress-bar' );
    if(isset($className)){
        $classes[] = $className;
    }
    if(($is_style_circle || $is_style_half_circle) && $isCircleRounded){
        $classes[] = 'rounded-circle';
    }

    $block_attributes = isset($block->parsed_block["attrs"]) ? $block->parsed_block["attrs"] : $attributes;
    $block_styles = ub_progress_bar_styles($block_attributes);
    $block_wrapper_attributes = get_block_wrapper_attributes(
        array(
            'class' => implode(' ', $classes),
            'style' => $block_styles
        )
    );
    return '<div ' . $block_wrapper_attributes .
            '"' . ($blockID === '' ? '' : ' id="ub-progress-bar-' . esc_attr($blockID) . '"') . '>
                '. ( $is_style_circle || $is_style_half_circle ? $detail_text : "" ) . $chosenProgressBar
        . '</div>';
}

function ub_register_progress_bar_block() {
	if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/progress-bar', array(
            'attributes' => $defaultValues['ub/progress-bar']['attributes'],
            'render_callback' => 'ub_render_progress_bar_block'));
    }
}

function ub_progress_bar_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/progress-bar'){
            wp_enqueue_script(
                'ultimate_blocks-progress-bar-front-script',
                plugins_url( 'progress-bar/front.build.js', dirname( __FILE__ ) ),
                array( ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            break;
        }
    }
}

add_action( 'init', 'ub_register_progress_bar_block' );
add_action( 'wp_enqueue_scripts', 'ub_progress_bar_add_frontend_assets' );
