<?php

function ub_render_progress_bar_block($attributes){
    extract($attributes);
    $blockName = 'ub_progress-bar';
    $chosenProgressBar = '';

    if($barType === 'linear'){
        $progressBarPath = 'M' . ($barThickness / 2) . ',' . ($barThickness / 2)
                            . 'L' . (100 - $barThickness / 2) . ',' . ($barThickness / 2);
        $chosenProgressBar = '<div class="' . $blockName . '-container" id="' . $blockID . '">
        <svg class="' . $blockName . '-line" viewBox="0 0 100 ' . $barThickness . '" preserveAspectRatio="none">
            <path class="' . $blockName . '-line-trail" d="' . $progressBarPath . '" strokeWidth="1"/>
            <path class="' . $blockName . '-line-path" d="' . $progressBarPath . '" stroke="' . $barColor . '"
                stroke-width="' . $barThickness . '"' . ($blockID === '' ? ' style="stroke-dashoffset:' .  (100 - $percentage) . 'px;"' : '') . '/>
        </svg>
        <div class="' . $blockName . '-label"' . ($blockID === '' ? ' style="width:' . $percentage . '%;"' : '') . '>' . $percentage . '%</div></div>';
    }
    else {
        $circleRadius = 50 - ($barThickness + 3) / 2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,' . (-$circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * $circleRadius).
                            'a ' . $circleRadius . ',' . $circleRadius . ' 0 1 1 0,' . (2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="' . $blockName.'-container" ' . ($blockID === '' ? 'style="height: 150px; width: 150px;"' : 'id="' . $blockID . '"') . '>
        <svg class="' . $blockName . '-circle" height="150" width="150" viewBox = "0 0 100 100">
            <path class="' . $blockName . '-circle-trail" d="' . $progressBarPath . '" strokeWidth="3"'.
                ($blockID === '' ? ' style = "stroke-dasharray: ' . $circlePathLength.'px,' . $circlePathLength . 'px"':'') . '/>
            <path class="' . $blockName . '-circle-path" d="' . $progressBarPath . '" stroke="' . $barColor . '"
                stroke-width="' . ($barThickness + 2) . '" stroke-linecap="butt"'.
                ($blockID === '' ? ' style="stroke-dasharray: ' . $strokeArcLength . 'px, ' . $circlePathLength . 'px"':'').'/>
        </svg>
        <div class="' . $blockName . '-label">' . $percentage . '%</div></div>';
    }

    return '<div class="ub_progress-bar' . (isset($className) ? ' ' . esc_attr($className) : '').
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