<?php

function ub_render_countdown_block($attributes){
    //used to display initial rendering
    $timeLeft = $attributes['endDate'] - time();
    $seconds = $timeLeft % 60;
    $minutes = (($timeLeft - $seconds) % 3600) / 60;
    $hours = (($timeLeft - $minutes * 60 - $seconds) % 86400) / 3600;
    $days = (($timeLeft - $hours * 3600 - $minutes * 60 - $seconds) % 604800) / 86400;
    $weeks = ($timeLeft - $days * 86400 - $hours * 3600 - $minutes * 60 - $seconds) / 604800;
    
    $elementID = ub_generateBlockID();

    $defaultFormat = $weeks . ' weeks ' . $days . ' days ' . $hours . ' hours ' .
                    $minutes . ' minutes ' . $seconds . ' seconds ';

    $defaultUpdate = 'document.getElementById("ub_countdown_'.$elementID.'").innerHTML = `${weeks} weeks ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;';

    if(!function_exists('ub_generateCircle')){
        function ub_generateCircle($label, $value, $limit, $color){
            $circlePath="M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70";
            $prefix="ub_countdown_circle_";
            return '<div style="height: 70px; width: 70px;" class="ub_countdown_'.$label.'">
                        <svg height="70" width="70" viewBox="0 0 100 100" style="position: absolute;">
                            <path class="'.$prefix.'trail" d="'.$circlePath.'" stroke-width="3" style="stroke-dasharray: 219.911px, 219.911px;"></path>
                            <path class="'.$prefix.'path" d="'.$circlePath.'" stroke="'.$color.'" stroke-width="3" style="stroke-dasharray: '.$value*219.911/$limit.'px, 219.911px; stroke-linecap=\'round\';"></path>
                        </svg>
                        <div class="'.$prefix.'label">'.$value.'</div>
                    </div>';
        }
    }

    
    $circularFormat = '<div class="ub_countdown_circular_container">
                        '.ub_generateCircle("week", $weeks, 52, $attributes['circleColor'])
                        .ub_generateCircle("day", $days, 7, $attributes['circleColor'])
                        .ub_generateCircle("hour", $hours, 24, $attributes['circleColor'])
                        .ub_generateCircle("minute", $minutes, 60, $attributes['circleColor'])
                        .ub_generateCircle("second", $seconds, 60, $attributes['circleColor']).'
                        <p>Weeks</p>
                        <p>Days</p>
                        <p>Hours</p>
                        <p>Minutes</p>
                        <p>Seconds</p>
                    </div>';
    
    if(!function_exists('ub_circleUpdate')){
        function ub_circleUpdate($part, $limit, $ID){
            return 'document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_path").style.strokeDasharray = `${'.$part.'s * 219.911 / '.$limit.'}px, 219.911px`;
            document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_path").style.strokeLinecap = `${'.$part.'s > 0 ? "round": "butt"}`;
            document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_label").innerHTML = '.$part.'s;';
        }
    }
    
    $circularUpdate = ub_circleUpdate("week", 52, $elementID) . ub_circleUpdate("day", 7, $elementID) . ub_circleUpdate("hour", 24, $elementID) . ub_circleUpdate("minute", 60, $elementID) . ub_circleUpdate("second", 60, $elementID);

    $odometerSeparator = '<span class="ub-countdown-separator">:</span>';

    $odometerFormat = '<div class="ub-countdown-odometer-container">
                        <span>Weeks</span><span></span><span>Days</span><span></span><span>Hours</span><span></span>
                        <span>Minutes</span><span></span><span>Seconds</span>
                        <div class="ub-countdown-odometer ub_countdown_week">' . ($weeks < 0 ? $weeks : $weeks + pow(10, ($weeks > 0 ? floor(log10($weeks) + 1) : 1))).'</div> 
                        '. $odometerSeparator.' <div class="ub-countdown-odometer ub_countdown_day">' . ($days < 0 ? $days : $days + 10) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_hour">' . ($hours < 0 ? $hours : $hours + 100) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_minute">' . ($minutes < 0 ? $minutes : $minutes + 100) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_second">' . ($seconds < 0 ? $seconds : $seconds + 100) . '</div></div>
                    <script src="'.plugin_dir_url( __FILE__ ) . 'odometer.js"></script>';

    $odometerUpdate = 'document.querySelector("#ub_countdown_'.$elementID.' .ub_countdown_week").innerHTML = weeks < 0 ? weeks : weeks + 10 ** (weeks > 0 ? Math.floor(Math.log10(weeks) + 1) : 1);
                        document.querySelector("#ub_countdown_'.$elementID.' .ub_countdown_day").innerHTML = days < 0 ? days : days + 10;
                        document.querySelector("#ub_countdown_'.$elementID.' .ub_countdown_hour").innerHTML = hours < 0 ? hours : hours + 100;
                        document.querySelector("#ub_countdown_'.$elementID.' .ub_countdown_minute").innerHTML = minutes < 0 ? minutes : minutes +100;
                        document.querySelector("#ub_countdown_'.$elementID.' .ub_countdown_second").innerHTML = seconds < 0 ? seconds : seconds + 100';

    $selctedFormat = $defaultFormat;
    $selectedUpdate = $defaultUpdate;
    
    if($attributes['style']=='Regular'){
        $selectedFormat = $defaultFormat;
        $selectedUpdate = $defaultUpdate;
    }
    elseif ($attributes['style']=='Circular') {
        $selectedFormat = $circularFormat;
        $selectedUpdate = $circularUpdate;
    }
    else{
        $selectedFormat = $odometerFormat;
        $selectedUpdate = $odometerUpdate;
    }

    if($timeLeft > 0){
        return '<div id="ub_countdown_'.$elementID.'">
            '.$selectedFormat
            .'</div><script type="text/javascript">
                let timer_'.$elementID.' = setInterval(function(){
                    const timeLeft = '.$attributes['endDate'].'-Math.floor(Date.now() / 1000);
                    const seconds = timeLeft % 60;
                    const minutes = ((timeLeft - seconds) % 3600) / 60;
                    const hours = ((timeLeft - minutes * 60 - seconds) % 86400) / 3600;
                    const days =
                        ((timeLeft - hours * 3600 - minutes * 60 - seconds) % 604800) /
                        86400;
                    const weeks =
                        (timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
                        604800;
                    if(timeLeft >= 0){
                        '.$selectedUpdate.'
                    }
                    else{
                        clearInterval(timer_'.$elementID.');
                        document.getElementById("ub_countdown_'.$elementID.'").innerHTML="'.$attributes['expiryMessage'].'";
                    }
                }, 1000);</script>';
    }
    else return '<div style="text-align:'.$attributes['messageAlign'].';">'.$attributes['expiryMessage'].'</div>';
}

function ub_register_countdown_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/countdown', array(
            'attributes' => array(
                'endDate' => array(
                    'type' => 'number',
                    'default' => time()+86400
                ),
                'style'=> array(
                    'type' => 'string',
                    'default' => 'Odometer'
                ),
                'expiryMessage' => array(
                    'type' => 'string',
                    'default' => 'Timer expired'
                ),
                'messageAlign' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'circleColor' => array(
                    'type' => 'string',
                    'default' => '#2DB7F5'
                )
            ),
            'render_callback' => 'ub_render_countdown_block'));
    }
}

add_action( 'init', 'ub_register_countdown_block' );