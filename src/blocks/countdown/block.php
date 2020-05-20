<?php

function ub_filter_time_display($timeArray, $largestUnit, $smallestUnit){
    $timeUnits = ["week", "day", "hour", "minute", "second"];
    return array_slice($timeArray, array_search($largestUnit, $timeUnits), 
    (array_search($smallestUnit, $timeUnits)-array_search($largestUnit, $timeUnits)+1) );
}

function ub_render_countdown_block($attributes){
    //used to display initial rendering
    extract($attributes);

    $timeUnits = ["week", "day", "hour", "minute", "second"];

    $timeLeft = $endDate - time();
    $seconds = $timeLeft % 60;
    $minutes = (($timeLeft - $seconds) % 3600) / 60;

    $hours = ($timeLeft - $minutes * 60 - $seconds) / 3600;

    if(array_search($largestUnit, $timeUnits) < 2 ){
        $hours %= 24;
    }

    $days = ($timeLeft - $hours * 3600 - $minutes * 60 - $seconds) / 86400;

    if($largestUnit == 'week'){
        $days %= 7;
    }

    $weeks = ($timeLeft - $days * 86400 - $hours * 3600 - $minutes * 60 - $seconds) / 604800;

    $defaultFormatValues = ['<span class="ub_countdown_week">' . $weeks . '</span> ' . __( 'weeks', 'ultimate-blocks' ),
    '<span class="ub_countdown_day">' . $days . '</span> ' . __('days', 'ultimate-blocks'),
    '<span class="ub_countdown_hour">' . $hours . '</span> ' . __( 'hours', 'ultimate-blocks' ),
    '<span class="ub_countdown_minute">' . $minutes . '</span> ' . __( 'minutes', 'ultimate-blocks' ),
    '<span class="ub_countdown_second">' . $seconds . '</span> ' . __( 'seconds', 'ultimate-blocks' )];

    $defaultFormat = implode(' ', ub_filter_time_display($defaultFormatValues, $largestUnit, $smallestUnit) );

    if(!function_exists('ub_generateCircle')){
        function ub_generateCircle($label, $value, $limit, $color){
            $circlePath="M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70";
            $prefix="ub_countdown_circle_";
            return '<div class="'.$prefix.$label.'">
                        <svg height="70" width="70" viewBox="0 0 100 100">
                            <path class="'.$prefix.'trail" d="'.$circlePath.'" stroke-width="3" ></path>
                            <path class="'.$prefix.'path" d="'.$circlePath.'" stroke="'.$color.
                                '" stroke-width="3" style="stroke-dasharray: '.$value*219.911/$limit.'px, 219.911px;"></path>
                        </svg>
                        <div class="'.$prefix.'label ub_countdown_'.$label.'">'.$value.'</div>
                    </div>';
        }
    }

    $circularFormatValues = [ub_generateCircle("week", $weeks, 52, $circleColor),
    ub_generateCircle("day", $days, 7, $circleColor),
    ub_generateCircle("hour", $hours, 24, $circleColor),
    ub_generateCircle("minute", $minutes, 60, $circleColor),
    ub_generateCircle("second", $seconds, 60, $circleColor)];

    $circularFormatLabels =  [ '<p>'.__( 'Weeks', 'ultimate-blocks' ).'</p>',
    '<p>'.__( 'Days', 'ultimate-blocks' ).'</p>',
    '<p>'.__( 'Hours', 'ultimate-blocks' ).'</p>',
    '<p>'.__( 'Minutes', 'ultimate-blocks' ).'</p>',
    '<p>'.__( 'Seconds', 'ultimate-blocks' ).'</p>'];
    
    $circularFormat = '<div class="ub_countdown_circular_container">'.
                implode('', ub_filter_time_display($circularFormatValues, $largestUnit, $smallestUnit)  ).
                implode('', ub_filter_time_display($circularFormatLabels, $largestUnit, $smallestUnit)  ).
                    '</div>';

    $odometerValues = ['<div class="ub-countdown-odometer ub_countdown_week">' . $weeks .'</div>', 
        '<div class="ub-countdown-odometer ub_countdown_day">' . $days . '</div>',
        '<div class="ub-countdown-odometer ub_countdown_hour">' . ($hours < 10 ? '0' . $hours : $hours) . '</div>',
        '<div class="ub-countdown-odometer ub_countdown_minute">' . ($minutes < 10 ? '0' . $minutes : $minutes) . '</div>',
        '<div class="ub-countdown-odometer ub_countdown_second">' . ($seconds < 10 ? '0' . $seconds : $seconds) . '</div>'];

    $odometerLabels = ['<span>'.__( 'Weeks', 'ultimate-blocks' ).'</span>',
        '<span>'.__( 'Days', 'ultimate-blocks' ).'</span>',
        '<span>'.__( 'Hours', 'ultimate-blocks' ).'</span>',
        '<span>'.__( 'Minutes', 'ultimate-blocks' ).'</span>',
        '<span>'.__( 'Seconds', 'ultimate-blocks' ).'</span>'];

    $odometerFormat = '<div class="ub-countdown-odometer-container">'.
        implode('<span></span>', ub_filter_time_display($odometerLabels, $largestUnit, $smallestUnit)).
        implode('<span class="ub-countdown-separator">:</span>', ub_filter_time_display($odometerValues, $largestUnit, $smallestUnit))
        .'</div>';

    $selctedFormat = $defaultFormat;
    
    if($style=='Regular'){
        $selectedFormat = $defaultFormat;
    }
    elseif ($style=='Circular') {
        $selectedFormat = $circularFormat;
    }
    else{
        $selectedFormat = $odometerFormat;
    }

    if($timeLeft > 0){
        return '<div '.($blockID==''?'': 'id="ub_countdown_'.$blockID.'"' ).'class="ub-countdown'.
                (isset($className)?' '.esc_attr($className):'').
                '" data-expirymessage="'.$expiryMessage.'" data-enddate="'.$endDate
                .'" data-largestUnit="'.$largestUnit.'" data-smallestunit="'.$smallestUnit.'">
            '.$selectedFormat
            .'</div>';
    }
    else return '<div class="ub-countdown'.(isset($className) ? ' ' . esc_attr($className) : '').'" '.
        ($blockID==''?'style="text-align:'.$messageAlign.';' :'id="ub_countdown_'.$blockID.'"').'>'.$expiryMessage.'</div>';
}

function ub_register_countdown_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/countdown', array(
            'attributes' => $defaultValues['ub/countdown']['attributes'],
            'render_callback' => 'ub_render_countdown_block'));
    }
}

add_action( 'init', 'ub_register_countdown_block' );

function ub_countdown_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] == 'ub/countdown'){
            wp_enqueue_script(
                'ultimate_blocks-countdown-script',
                plugins_url( 'countdown/front.build.js', dirname( __FILE__ ) ),
                array(  ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
            if(!isset($block['attrs']['style'])){ //odometer, the default style, is selected
                wp_enqueue_script(
                    'ultimate_blocks-countdown-odometer-script',
                    plugins_url( 'countdown/odometer.js', dirname( __FILE__ ) ),
                    array(  ),
                    Ultimate_Blocks_Constants::plugin_version(),
                    true
                );
                break;
            }
        }
    }
}

add_action( 'wp_enqueue_scripts', 'ub_countdown_add_frontend_assets' );