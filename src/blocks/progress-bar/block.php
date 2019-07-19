<?php

function ub_render_progress_bar_block($attributes){
    extract($attributes);
    $blockName = 'ub_progress-bar';
    $elementID = $blockName .'-'. ub_generateBlockID();
    $chosenProgressBar = '';
    $initializationCode = '';

    if($attributes['barType']=='linear'){
        $progressBarPath = 'M'.($barThickness / 2).','.($barThickness/2)
                            .'L'.(100 - $barThickness / 2).','.($barThickness/2);
        $chosenProgressBar = '<div class="'.$blockName.'-container" id="'.$elementID.'">
        <svg class="'.$blockName.'-line" viewBox="0 0 100 '.$barThickness.'" preserveAspectRatio="none">
            <path class="'.$blockName.'-line-trail" d="'.$progressBarPath.'" strokeWidth="1"/>
            <path class="'.$blockName.'-line-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.$barThickness.'" style="stroke-dashoffset:100px"/>
        </svg>
        <div class="'.$blockName.'-label" style="width:'.$percentage.'%; visibility:hidden; 
                    text-align:right; min-width:24px;">
            '.$percentage.'%
        </div></div>';
        $initializationCode = 'let indicator = container.getElementsByClassName("'.$blockName.'-line-path")[0];
                                indicator.style.strokeDashoffset = "'.(100-$percentage).'px";';
        }
    else {
        $circleRadius = 50 - ($barThickness + 3)/2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,'.(-$circleRadius).'
                            a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * $circleRadius).'
                            a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="'.$blockName.'-container" id="'.$elementID.'" style="height: 150px; width: 150px">
        <svg class="'.$blockName.'-circle" height="150" width="150" viewBox = "0 0 100 100" style="position: absolute">
            <path class="'.$blockName.'-circle-trail" d="'.$progressBarPath.'" strokeWidth="3"
                style = "stroke-dasharray: '.$circlePathLength.'px,'.$circlePathLength.'px"/>
            <path class="'.$blockName.'-circle-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.($barThickness+2).'" stroke-linecap="butt"
                style="stroke-dasharray: 0px, '.$circlePathLength.'px"/>
        </svg>
        <div class="'.$blockName.'-label" style="visibility: hidden; position: relative;
            top: 50%; transform: translateY(-50%); margin: auto; text-align: center">
        '.$percentage.'%
        </div>';
        $initializationCode = 'let indicator = container.getElementsByClassName("'.$blockName.'-circle-path")[0];
                                indicator.style.strokeDasharray = "'.$strokeArcLength.'px, '.$circlePathLength.'px";
                                indicator.style.strokeLinecap = "round";';
    }

    return '<div class="ub_progress-bar '.$className.'">
                <div class="ub_progress-bar-text">
                <p  style="text-align: '. $detailAlign .';">'.$detail.'</p></div>'
            . $chosenProgressBar
        . '</div>
        <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function() {
            let container = document.getElementById("'.$elementID.'");
            let label = container.getElementsByClassName("ub_progress-bar-label")[0];
            '. $initializationCode
            . 'label.style.visibility = "visible";
        });
        </script>';
}

function ub_register_progress_bar_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/progress-bar', array(
            'attributes' => array(
                'percentage' => array(
                    'type' => 'number',
                    'default' => 25
                ),
                'barType' => array(
                    'type' => 'string',
                    'default' => 'linear'
                ),
                'detail' => array(
                    'type' => 'string',
                    'default' => ''
                ),             
                'detailAlign' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'barColor' => array(
                    'type' => 'string',
                    'default' => '#2db7f5'
                ),
                'barThickness' => array(
                    'type' => 'number',
                    'default' => 1
                ),
            ),
            'render_callback' => 'ub_render_progress_bar_block'));
    }
}

add_action( 'init', 'ub_register_progress_bar_block' );