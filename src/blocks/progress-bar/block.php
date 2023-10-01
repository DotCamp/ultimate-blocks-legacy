<?php
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
    $styles = [
        '--ub-bar-top-left-radius'      => $attributes['barBorderRadius']['topLeft'] ?? '',
        '--ub-bar-top-right-radius'     => $attributes['barBorderRadius']['topRight'] ?? '',
        '--ub-bar-bottom-left-radius'   => $attributes['barBorderRadius']['bottomLeft'] ?? '',
        '--ub-bar-bottom-right-radius'  => $attributes['barBorderRadius']['bottomRight'] ?? '',
    ];
    return ub_generate_css_string($styles);
}
function ub_render_progress_bar_block($attributes){
    extract($attributes);
    $blockName = 'ub_progress-bar';
    $chosenProgressBar = '';

    $is_style_circle = isset($attributes['className']) ? strpos($attributes['className'], "is-style-ub-progress-bar-circle-wrapper") !== false : "";
    $is_style_half_circle = isset($attributes['className']) ? strpos($className, "is-style-ub-progress-bar-half-circle-wrapper") !== false : "";

    $percentage_position = $attributes['percentagePosition'];
    $is_stripe = $attributes['isStripe'];

    $percentage_text = '<div class="' . $blockName . '-label"' . ($blockID === '' ? ' style="width:' . $percentage . '%;"' : '') . '>' . $percentage . '%</div>';

    $inside_percentage = $percentage_position === 'inside' ? " ub_progress-bar-label-inside" : '';
    $stripe_style = $is_stripe ? " ub_progress-bar-stripe" : '';

    $top_percentage = $percentage_position === 'top'  ? $percentage_text : "";
    $bottom_percentage = $percentage_position === 'bottom' || $percentage_position === 'inside' ? $percentage_text : "";

    $stripe_element = $is_stripe ? 
        '<foreignObject width="100%" height="100%">
			<div class="ub_progress-bar-line-stripe" ></div>
		</foreignObject>' : '';
    
    if(!$is_style_circle && !$is_style_half_circle){
        $progressBarPath = 'M' . ($barThickness / 2) . ',' . ($barThickness / 2)
                            . 'L' . (100 - $barThickness / 2) . ',' . ($barThickness / 2);
        $chosenProgressBar = '<div class="' . $blockName . '-container' . $inside_percentage . $stripe_style . '" id="' . $blockID . '">
        ' . $top_percentage . ' <svg class="' . $blockName . '-line" viewBox="0 0 100 ' . $barThickness . '" preserveAspectRatio="none">
            <path class="' . $blockName . '-line-trail" d="' . $progressBarPath . '" stroke="' . $barBackgroundColor . '" stroke-width="' . $barThickness . '"/>
            <path class="' . $blockName . '-line-path" d="' . $progressBarPath . '" stroke="' . $barColor . '"
                stroke-width="' . $barThickness . '"' . ($blockID === '' ? ' style="stroke-dashoffset:' .  (100 - $percentage) . 'px;"' : '') . '/>
                ' . $stripe_element . '
        </svg>' . $bottom_percentage;
    }
    else if ($is_style_circle) {
        $circleRadius = 50 - ($barThickness + 3) / 2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,' . (-$circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * $circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="' . $blockName.'-container" ' . ($blockID === '' ? 'style="height: ' . $circleSize . 'px; width: ' . $circleSize . 'px;"' : 'id="' . $blockID . '"') . '>
        <svg class="' . $blockName . '-circle" height="' . $circleSize . '" width="' . $circleSize . '" viewBox = "0 0 100 100">
            <path class="' . $blockName . '-circle-trail" d="' . $progressBarPath . '" stroke="' . $barBackgroundColor . '" stroke-width="' . ($barThickness + 2) . '"'.
                ($blockID === '' ? ' style = "stroke-dasharray: ' . $circlePathLength . 'px,' . $circlePathLength . 'px"':'') . '/>
            <path class="' . $blockName . '-circle-path" d="' . $progressBarPath . '" stroke="' . $barColor . '"
                stroke-width="' . ($barThickness + 2) . '" stroke-linecap="butt"'.
                ($blockID === '' ? ' style="stroke-dasharray: ' . $strokeArcLength . 'px, ' . $circlePathLength . 'px"':'').'/>
        </svg>
        <div class="' . $blockName . '-label">' . $percentage . '%</div></div>';
    } else if ($is_style_half_circle){
        $halfCircleRadius = 50 - ($barThickness + 2) / 2;
        $halfCirclePathLength = $halfCircleRadius * M_PI;
        $halfCircleStrokeArcLength = ($halfCirclePathLength * $percentage) / 100;
        $halfCircleProgressBarPath = 'M 50,50 m -' . $halfCircleRadius . ',0 ' .
            'a ' . $halfCircleRadius . ',' . $halfCircleRadius . ' 0 1 1 ' . ($halfCircleRadius * 2) . ',0';

        $chosenProgressBar = '<div class="' . $blockName . '-container" ' . ($blockID === '' ? 'style="height: ' . $circleSize . 'px; width: ' . $circleSize . 'px;"' : 'id="' . $blockID . '"') . '>
            <svg class="' . $blockName . '-circle" height="' . $circleSize . '" width="' . $circleSize . '" viewBox="0 0 100 100">
                <path class="' . $blockName . '-circle-trail" d="' . $halfCircleProgressBarPath . '" stroke="' . $barBackgroundColor . '" stroke-width="' . ($barThickness + 2) . '"'. 
                ($blockID === '' ? ' style="stroke-dasharray: ' . $halfCirclePathLength . 'px,' . $halfCirclePathLength . 'px"':'') . '/>
                <path class="' . $blockName . '-circle-path" d="' . $halfCircleProgressBarPath . '" stroke="' . $barColor . '"
                    stroke-width="' . ($barThickness + 2) . '" stroke-linecap="butt"'.
                    ($blockID === '' ? ' style="stroke-dasharray: ' . $halfCircleStrokeArcLength . 'px, ' . $halfCirclePathLength . 'px"':'').'/>
            </svg>
            <div class="' . $blockName . '-label">' . $percentage . '%</div></div>';

        }
    
    $block_styles = ub_progress_bar_styles($attributes);

    return '<div style="' . $block_styles . '" class="ub_progress-bar' . (isset($className) ? ' ' . esc_attr($className) : '').
            '"' . ($blockID === '' ? '' : ' id="ub-progress-bar-' . $blockID . '"') . '>
                <div class="ub_progress-bar-text">
                <p' . ($blockID === '' ? ' style="text-align: ' . $detailAlign . ';"' : '') . '>' . $detail . '</p></div>'
            . $chosenProgressBar
        . '</div>';
}

function ub_register_progress_bar_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/progress-bar', array(
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