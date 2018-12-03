<?php

function generateRandomString($length = 10) {
    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

function ub_render_progress_bar_block($attributes){
    $elementID = generateRandomString();
    $chosenProgressBar = '';
    $initializationCode = '';
    $className = 'ub_progress-bar';
    $barThickness = $attributes['barThickness'];
    $barColor = $attributes['barColor'];
    $percentage = $attributes['percentage'];

    if($attributes['barType']=='linear'){
        $progressBarPath = 'M'.($barThickness / 2).','.($barThickness/2)
                            .'L'.(100 - $barThickness / 2).','.($barThickness/2);
        $chosenProgressBar = '<div class="'.$className.'-container" id="'.$elementID.'">
        <svg class="'.$className.'-line" viewBox="0 0 100 '.$barThickness.'" preserveAspectRatio="none">
            <path class="'.$className.'-line-trail" d="'.$progressBarPath.'" strokeWidth="1"/>
            <path class="'.$className.'-line-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.$barThickness.'" style="stroke-dashoffset:100px"/>
        </svg>
        <div class="'.$className.'-label" style="width:'.$percentage.'%; visibility:hidden; 
                    text-align:right; min-width:24px;">
            '.$percentage.'%
        </div></div>';
        $initializationCode = 'let indicator = container.getElementsByClassName("'.$className.'-line-path")[0];
                                indicator.style.strokeDashoffset = "'.(100-$percentage).'px";';
        }
    else {
        $circleRadius = 50 - ($barThickness + 3)/2;
        $circlePathLength = $circleRadius * M_PI * 2;
        $progressBarPath = 'M 50,50 m 0,'.(-$circleRadius).'
                            a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * $circleRadius).'
                            a '.$circleRadius.','.$circleRadius.' 0 1 1 0,'.(2 * -$circleRadius);
        $strokeArcLength = $circlePathLength * $percentage / 100;

        $chosenProgressBar = '<div class="'.$className.'-container" id="'.$elementID.'" style="height: 150px; width: 150px">
        <svg class="'.$className.'-circle" height="150" width="150" viewBox = "0 0 100 100" style="position: absolute">
            <path class="'.$className.'-circle-trail" d="'.$progressBarPath.'" strokeWidth="3"
                style = "stroke-dasharray: '.$circlePathLength.'px,'.$circlePathLength.'px"/>
            <path class="'.$className.'-circle-path" d="'.$progressBarPath.'" stroke="'.$barColor.'"
                stroke-width="'.($barThickness+2).'" stroke-linecap="butt"
                style="stroke-dasharray: 0px, '.$circlePathLength.'px"/>
        </svg>
        <div class="'.$className.'-label" style="visibility: hidden; position: relative;
            top: 50%; transform: translateY(-50%); margin: auto; text-align: center">
        '.$percentage.'%
        </div>';
        $initializationCode = 'let indicator = container.getElementsByClassName("'.$className.'-circle-path")[0];
                                indicator.style.strokeDasharray = "'.$strokeArcLength.'px, '.$circlePathLength.'px";
                                indicator.style.strokeLinecap = "round";';
    }

    return '<div class="ub_progress-bar">
                <div class="ub_progress-bar-text">
                <p>'.$attributes['detail'].'</p></div>'
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