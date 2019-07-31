<?php

function ub_render_progress_bar_block($attributes){
    extract($attributes);
    $blockName = 'ub_progress-bar';
    $chosenProgressBar = '';

    if($barType=='linear'){
        $progressBarPath = 'M'.($barThickness / 2).','.($barThickness/2)
                            .'L'.(100 - $barThickness / 2).','.($barThickness/2);
        $chosenProgressBar = '<div class="'.$blockName.'-container" id="'.$blockID.'">
        <svg class="'.$blockName.'-line" viewBox="0 0 100 '.$barThickness.'" preserveAspectRatio="none">
            <path class="'.$blockName.'-line-trail" d="'.$progressBarPath.'" strokeWidth="1"/>
            <path class="'.$blockName.'-line-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.$barThickness.'" />
        </svg>
        <div class="'.$blockName.'-label">'.$percentage.'%</div></div>';
    }
    else {
        $circleRadius = 50 - ($barThickness + 3)/2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,'.(-$circleRadius).
                            'a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * $circleRadius).
                            'a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="'.$blockName.'-container" id="'.$blockID.'">
        <svg class="'.$blockName.'-circle" height="150" width="150" viewBox = "0 0 100 100">
            <path class="'.$blockName.'-circle-trail" d="'.$progressBarPath.'" strokeWidth="3"/>
            <path class="'.$blockName.'-circle-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.($barThickness+2).'" stroke-linecap="butt"/>
        </svg>
        <div class="'.$blockName.'-label">'.$percentage.'%</div>';
    }

    return '<div class="ub_progress-bar '.esc_attr($className).'" id="ub-progress-bar-'.$blockID.'">
                <div class="ub_progress-bar-text">
                <p>'.$detail.'</p></div>'
            . $chosenProgressBar
        . '</div>';
}

function ub_register_progress_bar_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/progress-bar', array(
            'attributes' => $GLOBALS['defaultValues']['ub/progress-bar']['attributes'],
            'render_callback' => 'ub_render_progress_bar_block'));
    }
}

function ub_progress_bar_add_frontend_assets() {
    if ( has_block( 'ub/progress-bar' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-progress-bar-front-script',
            plugins_url( 'progress-bar/front.build.js', dirname( __FILE__ ) ),
            array( ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action( 'init', 'ub_register_progress_bar_block' );
add_action( 'wp_enqueue_scripts', 'ub_progress_bar_add_frontend_assets' );