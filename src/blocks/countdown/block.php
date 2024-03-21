<?php
function ub_countdown_styles($attributes){
    $unit_color = $attributes['unitColor'];
    $countdown_color = $attributes['countdownColor'];

    $styles = array(
        "--ub-countdown-unit-color" => $unit_color,
		"--ub-countdown-digit-color" => $countdown_color,
    );

	return Ultimate_Blocks\includes\generate_css_string( $styles );
}
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

    if($largestUnit === 'week'){
        $days %= 7;
    }

    $weeks = ($timeLeft - $days * 86400 - $hours * 3600 - $minutes * 60 - $seconds) / 604800;

    $defaultFormatValues = ['<span class="ub_countdown_week ub-countdown-digit">' . $weeks . '</span> <span class="ub-countdown-unit">' . __( 'weeks', 'ultimate-blocks' ),
    '</span> <span class="ub_countdown_day ub-countdown-digit">' . $days . '</span> <span class="ub-countdown-unit">' . __('days', 'ultimate-blocks'),
    '</span> <span class="ub_countdown_hour ub-countdown-digit">' . $hours . '</span> <span class="ub-countdown-unit">' . __( 'hours', 'ultimate-blocks' ),
    '</span> <span class="ub_countdown_minute ub-countdown-digit">' . $minutes . '</span> <span class="ub-countdown-unit">' . __( 'minutes', 'ultimate-blocks' ),
    '</span> <span class="ub_countdown_second ub-countdown-digit">' . $seconds . '</span> <span class="ub-countdown-unit">' . __( 'seconds', 'ultimate-blocks' ) . '</span>',];

    $defaultFormat = implode(' ', ub_filter_time_display($defaultFormatValues, $largestUnit, $smallestUnit) );

    if(!function_exists('ub_generateCircle')){
        function ub_generateCircle($label, $value, $limit, $color, $size){
            $circlePath = "M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70";
            $prefix = "ub_countdown_circle_";
            return '<div class="' . $prefix . $label . '">
                        <svg height="' . $size . '" width="' . $size . '" viewBox="0 0 100 100">
                            <path class="' . $prefix . 'trail" d="' . $circlePath . '" stroke-width="3" ></path>
                            <path class="' . $prefix . 'path" d="'.$circlePath.'" stroke="' . $color .
                                '" stroke-width="3" style="stroke-dasharray: ' . $value * 219.911/$limit . 'px, 219.911px;"></path>
                        </svg>
                        <div class="' . $prefix . 'label ub_countdown_' . $label . ' ub-countdown-digit">' . $value . '</div>
                    </div>';
        }
    }

    $circularFormatValues = [ub_generateCircle("week", $weeks, 52, $circleColor, $circleSize),
    ub_generateCircle("day", $days, 7, $circleColor, $circleSize),
    ub_generateCircle("hour", $hours, 24, $circleColor, $circleSize),
    ub_generateCircle("minute", $minutes, 60, $circleColor, $circleSize),
    ub_generateCircle("second", $seconds, 60, $circleColor, $circleSize)];

    $circularFormatLabels =  [ '<p class="ub-countdown-unit">'.__( 'Weeks', 'ultimate-blocks' ).'</p>',
    '<p class="ub-countdown-unit">'.__( 'Days', 'ultimate-blocks' ).'</p>',
    '<p class="ub-countdown-unit">'.__( 'Hours', 'ultimate-blocks' ).'</p>',
    '<p class="ub-countdown-unit">'.__( 'Minutes', 'ultimate-blocks' ).'</p>',
    '<p class="ub-countdown-unit">'.__( 'Seconds', 'ultimate-blocks' ).'</p>'];
    
    $circularFormat = '<div class="ub_countdown_circular_container">'.
                implode('', ub_filter_time_display($circularFormatValues, $largestUnit, $smallestUnit)  ).
                implode('', ub_filter_time_display($circularFormatLabels, $largestUnit, $smallestUnit)  ).
                    '</div>';

    if(!function_exists('ub_generateDigitArray')){
        function ub_generateDigitArray($value, $maxValue = 0){
            $digits = [];

            while($value > 0){
                $digits[] = $value % 10;
                $value  = ((int) ($value/10));
            }

            $missingDigits = ($maxValue ? floor(log10($maxValue)) + 1 : 1) - count($digits);

            $digits = array_merge( ( $missingDigits > 0 ?  array_fill(0, $missingDigits, 0) : []),
                                 array_reverse($digits));

            return array_map(function($digit){
                return '<div class="ub-countdown-odometer-digit">' . $digit . '</div>';
            }, $digits);
        }
    }

    $odometerValues = ['<div class="ub-countdown-odometer ub-countdown-digit-container ub_countdown_week ub-countdown-digit">' . implode(ub_generateDigitArray($weeks)) .'</div>', 
        '<div class="ub-countdown-odometer ub-countdown-digit-container ub_countdown_day ub-countdown-digit">' . implode(ub_generateDigitArray($days, $largestUnit === 'day' ? 0 : 6) ) . '</div>',
        '<div class="ub-countdown-odometer ub-countdown-digit-container ub_countdown_hour ub-countdown-digit">' . implode(ub_generateDigitArray($hours, $largestUnit === 'hour' ? 0 : 23) )  . '</div>',
        '<div class="ub-countdown-odometer ub-countdown-digit-container ub_countdown_minute ub-countdown-digit">' . implode(ub_generateDigitArray($minutes, 59) ) . '</div>',
        '<div class="ub-countdown-odometer ub-countdown-digit-container ub_countdown_second ub-countdown-digit">' . implode(ub_generateDigitArray($seconds, 59) ). '</div>'];

    $odometerLabels = ['<span class="ub-countdown-unit">'.__( 'Weeks', 'ultimate-blocks' ).'</span>',
        '<span class="ub-countdown-unit">'.__( 'Days', 'ultimate-blocks' ).'</span>',
        '<span class="ub-countdown-unit">'.__( 'Hours', 'ultimate-blocks' ).'</span>',
        '<span class="ub-countdown-unit">'.__( 'Minutes', 'ultimate-blocks' ).'</span>',
        '<span class="ub-countdown-unit">'.__( 'Seconds', 'ultimate-blocks' ).'</span>'];

    $odometerFormat = '<div class="ub-countdown-odometer-container">'.
        implode('<span></span>', ub_filter_time_display($odometerLabels, $largestUnit, $smallestUnit)).
        implode('<span class="ub-countdown-separator">:</span>', ub_filter_time_display($odometerValues, $largestUnit, $smallestUnit))
        .'</div>';

    $selctedFormat = $defaultFormat;
    
    if($style === 'Regular'){
        $selectedFormat = $defaultFormat;
    }
    elseif ($style === 'Circular') {
        $selectedFormat = $circularFormat;
    }
    else{
        $selectedFormat = $odometerFormat;
    }
    $styles = ub_countdown_styles($attributes);
    if($timeLeft > 0){
        return '<div style="' . $styles . '" '.($blockID === ''?'': 'id="ub_countdown_'.$blockID.'"' ).'class="wp-block-ub-countdown ub-countdown ub-countdown-wrapper'.
                (isset($className)?' '.esc_attr($className):'').
                '" data-expirymessage="'.$expiryMessage.'" data-enddate="'.$endDate
                .'" data-largestUnit="'.$largestUnit.'" data-smallestunit="'.$smallestUnit.'">
            '.$selectedFormat
            .'</div>';
    }
    else return '<div class="wp-block-ub-count-down ub-countdown'.(isset($className) ? ' ' . esc_attr($className) : '').'" '.
        ($blockID === ''?'style="text-align:'.$messageAlign.';' :'id="ub_countdown_'.$blockID.'"').'>'.$expiryMessage.'</div>';
}

function ub_register_countdown_block() {
	if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/countdown', array(
            'attributes' => $defaultValues['ub/countdown']['attributes'],
            'render_callback' => 'ub_render_countdown_block'));
    }
}

add_action( 'init', 'ub_register_countdown_block' );

function ub_countdown_add_frontend_assets() {
    require_once dirname(dirname(__DIR__)) . '/common.php';

    $presentBlocks = ub_getPresentBlocks();

    foreach( $presentBlocks as $block ){
        if($block['blockName'] === 'ub/countdown'){
            wp_enqueue_script(
                'ultimate_blocks-countdown-script',
                plugins_url( 'countdown/front.build.js', dirname( __FILE__ ) ),
                array(  ),
                Ultimate_Blocks_Constants::plugin_version(),
                true
            );
        }
    }
}

add_action( 'wp_enqueue_scripts', 'ub_countdown_add_frontend_assets' );