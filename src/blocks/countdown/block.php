<?php

function ub_render_countdown_block($attributes){
    //used to display initial rendering
    extract($attributes);

    $timeLeft = $endDate - time();
    $seconds = $timeLeft % 60;
    $minutes = (($timeLeft - $seconds) % 3600) / 60;
    $hours = (($timeLeft - $minutes * 60 - $seconds) % 86400) / 3600;
    $days = (($timeLeft - $hours * 3600 - $minutes * 60 - $seconds) % 604800) / 86400;
    $weeks = ($timeLeft - $days * 86400 - $hours * 3600 - $minutes * 60 - $seconds) / 604800;

    $defaultFormat = $weeks . ' ' . __( 'weeks', 'ultimate-blocks' ) . ' ' . $days . ' ' . __('days', 'ultimate-blocks') . ' ' . $hours . ' ' . __( 'hours', 'ultimate-blocks' ) . ' ' . $minutes . ' ' . __( 'minutes', 'ultimate-blocks' ) . ' ' . $seconds . ' ' . __( 'seconds', 'ultimate-blocks' );

    $defaultUpdate = 'document.getElementById("ub_countdown_'.$blockID.'").innerHTML = `${weeks} ' . __( 'weeks', 'ultimate-blocks' ) . ' ${days} ' . __( 'days', 'ultimate-blocks' ) . ' ${hours} ' . __( 'hours', 'ultimate-blocks' ) . ' ${minutes} ' . __( 'minutes', 'ultimate-blocks' ) . ' ${seconds} ' . __( 'seconds', 'ultimate-blocks' ) . '`;';

    if(!function_exists('ub_generateCircle')){
        function ub_generateCircle($label, $value, $limit, $color){
            $circlePath="M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70";
            $prefix="ub_countdown_circle_";
            return '<div class="ub_countdown_'.$label.'">
                        <svg height="70" width="70" viewBox="0 0 100 100">
                            <path class="'.$prefix.'trail" d="'.$circlePath.'" stroke-width="3" ></path>
                            <path class="'.$prefix.'path" d="'.$circlePath.'" stroke="'.$color.'" stroke-width="3" style="stroke-dasharray: '.$value*219.911/$limit.'px, 219.911px;"></path>
                        </svg>
                        <div class="'.$prefix.'label">'.$value.'</div>
                    </div>';
        }
    }

    
    $circularFormat = '<div class="ub_countdown_circular_container">
                        '.ub_generateCircle("week", $weeks, 52, $circleColor)
                        .ub_generateCircle("day", $days, 7, $circleColor)
                        .ub_generateCircle("hour", $hours, 24, $circleColor)
                        .ub_generateCircle("minute", $minutes, 60, $circleColor)
                        .ub_generateCircle("second", $seconds, 60, $circleColor).'
                        <p>'.__( 'Weeks', 'ultimate-blocks' ).'</p>
                        <p>'.__( 'Days', 'ultimate-blocks' ).'</p>
                        <p>'.__( 'Hours', 'ultimate-blocks' ).'</p>
                        <p>'.__( 'Minutes', 'ultimate-blocks' ).'</p>
                        <p>'.__( 'Seconds', 'ultimate-blocks' ).'</p>
                    </div>';
    
    if(!function_exists('ub_circleUpdate')){
        function ub_circleUpdate($part, $limit, $ID){
            return 'document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_path").style.strokeDasharray = `${'.$part.'s * 219.911 / '.$limit.'}px, 219.911px`;
            document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_path").style.strokeLinecap = `${'.$part.'s > 0 ? "round": "butt"}`;
            document.querySelector("#ub_countdown_'.$ID.' .ub_countdown_'.$part.' .ub_countdown_circle_label").innerHTML = '.$part.'s;';
        }
    }
    
    $circularUpdate = ub_circleUpdate("week", 52, $blockID) . ub_circleUpdate("day", 7, $blockID) . ub_circleUpdate("hour", 24, $blockID) . ub_circleUpdate("minute", 60, $blockID) . ub_circleUpdate("second", 60, $blockID);

    $odometerSeparator = '<span class="ub-countdown-separator">:</span>';

    $odometerFormat = '<div class="ub-countdown-odometer-container">
                        <span>'.__( 'Weeks', 'ultimate-blocks' ).'</span><span></span><span>'.__( 'Days', 'ultimate-blocks' ).'</span><span></span><span>'.__( 'Hours', 'ultimate-blocks' ).'</span><span></span>
                        <span>'.__( 'Minutes', 'ultimate-blocks' ).'</span><span></span><span>'.__( 'Seconds', 'ultimate-blocks' ).'</span>
                        <div class="ub-countdown-odometer ub_countdown_week">' . ($weeks < 0 ? $weeks : $weeks + pow(10, ($weeks > 0 ? floor(log10($weeks) + 1) : 1))).'</div> 
                        '. $odometerSeparator.' <div class="ub-countdown-odometer ub_countdown_day">' . ($days < 0 ? $days : $days + 10) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_hour">' . ($hours < 0 ? $hours : $hours + 100) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_minute">' . ($minutes < 0 ? $minutes : $minutes + 100) . '</div>
                        '. $odometerSeparator.'<div class="ub-countdown-odometer ub_countdown_second">' . ($seconds < 0 ? $seconds : $seconds + 100) . '</div></div>
                    <script src="'.plugin_dir_url( __FILE__ ) . 'odometer.js"></script>';

    $odometerUpdate = 'document.querySelector("#ub_countdown_'.$blockID.' .ub_countdown_week").innerHTML = weeks < 0 ? weeks : weeks + 10 ** (weeks > 0 ? Math.floor(Math.log10(weeks) + 1) : 1);
                        document.querySelector("#ub_countdown_'.$blockID.' .ub_countdown_day").innerHTML = days < 0 ? days : days + 10;
                        document.querySelector("#ub_countdown_'.$blockID.' .ub_countdown_hour").innerHTML = hours < 0 ? hours : hours + 100;
                        document.querySelector("#ub_countdown_'.$blockID.' .ub_countdown_minute").innerHTML = minutes < 0 ? minutes : minutes +100;
                        document.querySelector("#ub_countdown_'.$blockID.' .ub_countdown_second").innerHTML = seconds < 0 ? seconds : seconds + 100';

    $selctedFormat = $defaultFormat;
    $selectedUpdate = $defaultUpdate;
    
    if($style=='Regular'){
        $selectedFormat = $defaultFormat;
        $selectedUpdate = $defaultUpdate;
    }
    elseif ($style=='Circular') {
        $selectedFormat = $circularFormat;
        $selectedUpdate = $circularUpdate;
    }
    else{
        $selectedFormat = $odometerFormat;
        $selectedUpdate = $odometerUpdate;
    }

    if($timeLeft > 0){
        return '<div id="ub_countdown_'.$blockID.'" class="ub-countdown '.esc_attr($className).'">
            '.$selectedFormat
            .'</div><script type="text/javascript">
                let timer_'.implode("", explode("-",$blockID)).' = setInterval(function(){
                    const timeLeft = '.$endDate.'-Math.floor(Date.now() / 1000);
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
                        clearInterval(timer_'.implode("",explode("-",$blockID)).');
                        document.getElementById("ub_countdown_'.$blockID.'").innerHTML="'.$expiryMessage.'";
                    }
                }, 1000);</script>';
    }
    else return '<div class="ub-countdown '.esc_attr($className).'" id="ub_countdown_'.$blockID.'">'.$expiryMessage.'</div>';
}

function ub_register_countdown_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/countdown', array(
            'attributes' => $GLOBALS['defaultValues']['ub/countdown']['attributes'],
            'render_callback' => 'ub_render_countdown_block'));
    }
}

add_action( 'init', 'ub_register_countdown_block' );