<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( !function_exists( 'get_current_screen' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/screen.php' );
}

/**
 * Check if the current page is the Gutenberg block editor.
 * @return bool
 */
function ub_check_is_gutenberg_page() {

	// The Gutenberg plugin is on.
    if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) { 
        return true;
    }
	
	// Gutenberg page on WordPress 5+.
	$current_screen = get_current_screen();
	if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
        return true;
	}
	
    return false;

}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */

function ub_load_assets() {
    if (file_exists(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css') &&
        filemtime(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css') <
        filemtime(dirname(__DIR__) . '/dist/blocks.style.build.css')){
        $frontStyleFile = fopen(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css', 'w');
        $blockDir = dirname(__DIR__) . '/src/blocks/';
        $blockList = get_option( 'ultimate_blocks', false );

        foreach ( $blockList as $key => $block ) {
            $blockDirName = strtolower(str_replace(' ', '-', 
            trim(preg_replace('/\(.+\)/', '', $blockList[ $key ]['label']))
                ));
            $frontStyleLocation = $blockDir . $blockDirName . '/style.css';

            if(file_exists($frontStyleLocation) && $blockList[ $key ]['active']){ //also detect if block is enabled
                fwrite($frontStyleFile, file_get_contents($frontStyleLocation));
            }
            if($block['name'] === 'ub/styled-box' && $blockList[$key]['active']){
                //add css for blocks phased out by styled box
                fwrite($frontStyleFile, file_get_contents($blockDir . 'feature-box' . '/style.css'));
                fwrite($frontStyleFile, file_get_contents($blockDir . 'notification-box' . '/style.css'));
                fwrite($frontStyleFile, file_get_contents($blockDir . 'number-box' . '/style.css'));
            }
        }
        fclose($frontStyleFile);
    }

    wp_enqueue_style(
        'ultimate_blocks-cgb-style-css', // Handle.
        file_exists(dirname(dirname(dirname(__DIR__))) . '/uploads/ultimate-blocks') ?
            content_url('/uploads/ultimate-blocks/blocks.style.build.css') :
            plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
        array(), // Dependency to include the CSS after it.
        Ultimate_Blocks_Constants::plugin_version()  // Version: latest version number.
    );
}

function ultimate_blocks_cgb_block_assets() {
	// Styles.
	if ( is_singular() and has_blocks() ){
        require_once plugin_dir_path(__FILE__) . 'common.php';
        
        $presentBlocks = ub_getPresentBlocks();

        foreach( $presentBlocks as $block ){
            if( strpos($block['blockName'], 'ub/' )===0){
                ub_load_assets();
                break;
            }
        }
    }
    elseif ( ub_check_is_gutenberg_page() ){
        ub_load_assets();
    }
} // End function ultimate_blocks_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'ultimate_blocks_cgb_block_assets' );

function ub_include_block_attribute_css() {
    require plugin_dir_path(__FILE__) . 'defaults.php';
    require_once plugin_dir_path(__FILE__) . 'common.php';

    $presentBlocks = ub_getPresentBlocks();
    $blockStylesheets = "";

    $hasNoSmoothScroll = true;

    foreach( $presentBlocks as $block ){
        if(array_key_exists($block['blockName'], $defaultValues)){
            $attributes = array_merge(array_map(function($attribute){
                return $attribute['default'];
            }, $defaultValues[$block['blockName']]['attributes']), $block['attrs']);
        }

        if(isset($attributes) && array_key_exists('blockID', $attributes) && $attributes['blockID'] != ''){
            switch ($block['blockName']){
                default:
                    //nothing could be done
                    break;
                case 'ub/button':
                    $prefix = '#ub-button-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' a{' . PHP_EOL;
                    if($attributes['buttonIsTransparent']){
                        $blockStylesheets .= 'background-color: transparent;' . PHP_EOL . 
                        'color: '.$attributes['buttonColor'].';' . PHP_EOL .
                        'border: 3px solid '.$attributes['buttonColor'].';';
                    }
                    else{
                        $blockStylesheets .= 'background-color: '.$attributes['buttonColor'].';' . PHP_EOL . 
                        'color: '.$attributes['buttonTextColor'].';' . PHP_EOL .
                        'border: none;';
                    }
                    $blockStylesheets .= 'border-radius: '.($attributes['buttonRounded'] ? '60' : '0').'px;' . PHP_EOL .
                    '}' . PHP_EOL . 

                    $prefix . ' a:hover{' . PHP_EOL;
                    if($attributes['buttonIsTransparent']){
                        $blockStylesheets .= 'color: '.$attributes['buttonHoverColor'].';' . PHP_EOL .
                        'border: 3px solid '.$attributes['buttonHoverColor'].';';
                    }
                    else{
                        $blockStylesheets .= 'background-color: '.$attributes['buttonHoverColor'].';' . PHP_EOL . 
                        'color: '.$attributes['buttonTextHoverColor'].';' . PHP_EOL .
                        'border: none;';
                    }
                    $blockStylesheets .= '}' . PHP_EOL . 
                    $prefix. ' ub-button-content-holder{' . PHP_EOL .
                        'flex-direction: '.($attributes['iconPosition']=='left'?'row':'row-reverse').';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/call-to-action-block':
                    $prefix = '#ub_call_to_action_' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . '{' . PHP_EOL .
                        'background-color: '.$attributes['ctaBackgroundColor'].';' . PHP_EOL . 
                        'border-width: '.$attributes['ctaBorderSize'].'px;' . PHP_EOL . 
                        'border-color: '.$attributes['ctaBorderColor'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_call_to_action_headline_text{' . PHP_EOL .
                        'font-size: '.$attributes['headFontSize'].'px;' . PHP_EOL .
                        'color: '.$attributes['headColor'].';' . PHP_EOL .
                        'text-align: '.$attributes['headAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL . 
                    $prefix . ' .ub_cta_content_text{' . PHP_EOL .
                        'font-size: '.$attributes['contentFontSize'].'px;' . PHP_EOL .
                        'color: '.$attributes['contentColor'].';' . PHP_EOL .
                        'text-align: '.$attributes['contentAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_cta_button{' . PHP_EOL .
                        'background-color: '.$attributes['buttonColor'].';' . PHP_EOL .
                        'width: '.$attributes['buttonWidth'].'px;' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_cta_button_text{' . PHP_EOL .
                        'color: '.$attributes['buttonTextColor'].';' . PHP_EOL .
                        'font-size: '.$attributes['buttonFontSize'].'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/click-to-tweet':
                    $prefix = '#ub_click_to_tweet_' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . '{' . PHP_EOL .
                        'border-color: '.$attributes['borderColor'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_tweet{' . PHP_EOL .
                        'color: '.$attributes['tweetColor'].';' . PHP_EOL .
                        'font-size: '.$attributes['tweetFontSize'].'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/content-filter-block':
                    $prefix = '#ub-content-filter-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .ub-content-filter-tag{' . PHP_EOL .
                        'background-color: ' . $attributes['buttonColor'] . ';' . PHP_EOL .
                        'color: ' . $attributes['buttonTextColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub-content-filter-tag.ub-selected{' . PHP_EOL .
                        'background-color: ' . $attributes['activeButtonColor'] . ';' . PHP_EOL .
                        'color: ' . $attributes['activeButtonTextColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/content-toggle-block':
                    $attributes = array_merge($attributes,
                        array_map(function($attribute){
                            return $attribute['default'];
                        }, $defaultValues['ub/content-toggle-panel-block']['attributes']),
                        $block['innerBlocks'][0]['attrs']);
                    $prefix = '#ub-content-toggle-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .wp-block-ub-content-toggle-accordion{' . PHP_EOL .
                        'border-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                    '}' . PHP_EOL . 
                    $prefix . ' .wp-block-ub-content-toggle-accordion-title-wrap{' . PHP_EOL .
                        'background-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                    '}' . PHP_EOL . 
                    $prefix . ' .wp-block-ub-content-toggle-accordion-title{' . PHP_EOL .
                        'color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/countdown':
                    $blockStylesheets .= '#ub_countdown_'. $attributes['blockID'] . '{' . PHP_EOL .
                        'text-align: ' . $attributes['messageAlign'] . PHP_EOL .
                    '}';
                    break;
                case 'ub/divider':
                    $blockStylesheets .= '#ub_divider_' . $attributes['blockID'] . '{' . PHP_EOL .
                                        'border-top: '.$attributes['borderSize'].'px '.$attributes['borderStyle'].' '.$attributes['borderColor'] .';' . PHP_EOL .
                                        'margin-top: '.$attributes['borderHeight'].'px;' . PHP_EOL .
                                        'margin-bottom: '.$attributes['borderHeight'].'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/expand':
                    $blockStylesheets .= '#ub-expand-' . $attributes['blockID'] . ' .ub-expand-toggle-button{' . PHP_EOL .
                        'text-align: '.$attributes['toggleAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/feature-box-block':
                    $prefix = '#ub_feature_box_' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .ub_feature_one_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title1Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_feature_two_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title2Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_feature_three_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title3Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_feature_one_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body1Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix. ' .ub_feature_two_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body2Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_feature_three_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body3Align'] . ';' . PHP_EOL .
                    '}' ;
                    break;
                case 'ub/image-slider':
                    $prefix = '#ub_image_slider_' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .flickity-slider img{' . PHP_EOL .
                        'max-height: ' . $attributes['sliderHeight'] . 'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/notification-box-block':
                    $blockStylesheets .= '#ub-notification-box-' . $attributes['blockID'] . ' .ub_notify_text{' . PHP_EOL .
                        'text-align: ' . $attributes['align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/number-box-block':
                    $prefix = '#ub-number-box-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .ub_number_one_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title1Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix. ' .ub_number_two_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title2Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix. ' .ub_number_three_title{' . PHP_EOL .
                        'text-align: ' . $attributes['title3Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_number_one_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body1Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_number_two_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body2Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix. ' .ub_number_three_body{' . PHP_EOL .
                        'text-align: ' . $attributes['body3Align'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_number_column{' . PHP_EOL .
                        'text-align: ' . $attributes['borderColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_number_box_number{' . PHP_EOL .
                        'background-color: ' . $attributes['numberBackground'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_number_box_number>p{' . PHP_EOL .
                        'color: ' . $attributes['numberColor'] . ';' . PHP_EOL .
                    '}';
                    break;
                case 'ub/progress-bar':
                    $prefix = '#ub-progress-bar-'. $attributes['blockID'];
                    $blockStylesheets .=  $prefix . ' .ub_progress-bar-text p{' . PHP_EOL .
                        'text-align: ' . $attributes['detailAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL . 
                    $prefix . ' .ub_progress-bar-text p{' . PHP_EOL .
                        'text-align: ' . $attributes['detailAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL;

                    if($attributes['barType']=='linear'){
                        $blockStylesheets .= $prefix . ' .ub_progress-bar-line-path{' . PHP_EOL .
                            'stroke-dashoffset: 100px;' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' .ub_progress-bar-label{' . PHP_EOL .
                            'width: '.$attributes['percentage'].'%;' . PHP_EOL;
                    }
                    else{
                        $circleRadius = 50 - ($attributes['barThickness'] + 3)/2;
                        $circlePathLength = $circleRadius * M_PI * 2;
                        $blockStylesheets .= '#ub-progress-bar-'. $attributes['blockID'] . ' .ub_progress-bar-container{' . PHP_EOL .
                            'height: 150px;' . PHP_EOL . 'width: 150px;' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' .ub_progress-bar-circle-trail{' . PHP_EOL . 
                            'stroke-dasharray: '.$circlePathLength.'px,'.$circlePathLength.'px' . PHP_EOL . 
                        '}' . PHP_EOL .
                        $prefix . ' .ub_progress-bar-circle-path{' . PHP_EOL .
                            'stroke-dasharray: 0px, '.$circlePathLength.'px' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' .ub_progress-bar-label{' . PHP_EOL;                                
                    }
                    $blockStylesheets .= 'visibility: hidden;' . PHP_EOL . 
                    '}' . PHP_EOL .
                    $prefix . '.ub_progress-bar-filled .ub_progress-bar-label{' . PHP_EOL . 
                        'visibility: visible;' . PHP_EOL .
                    '}' . PHP_EOL;
                    if($attributes['barType']=='linear'){
                        $blockStylesheets .= $prefix. '.ub_progress-bar-filled .ub_progress-bar-line-path{' . PHP_EOL .
                            'stroke-dashoffset: ' . (100-$attributes['percentage']) . 'px';
                    }
                    else{
                        $strokeArcLength = $circlePathLength * $attributes['percentage'] / 100;
                        $blockStylesheets .= $prefix . '.ub_progress-bar-filled .ub_progress-bar-circle-path{' . PHP_EOL .
                            'stroke-linecap: round;' . PHP_EOL . 
                            'stroke-dasharray: '.$strokeArcLength.'px, '.$circlePathLength.'px;' . PHP_EOL;
                    }
                    $blockStylesheets .= '}';
                    break;
                case 'ub/review':
                    $prefix = '#ub_review_' . $attributes['blockID'];
                    $blockStylesheets .=  $prefix . ' .ub_review_item_name{' . PHP_EOL . 
                        'text-align: ' . $attributes['titleAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_review_author_name{' . PHP_EOL . 
                        'text-align: ' . $attributes['authorAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_review_description{' . PHP_EOL . 
                        'text-align: ' . $attributes['descriptionAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_review_cta_main>a{' . PHP_EOL . 
                        'color: ' . $attributes['callToActionForeColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_review_cta_btn{' . PHP_EOL . 
                        'color: ' . $attributes['callToActionForeColor'] . ';' . PHP_EOL .
                        'border-color: ' . $attributes['callToActionForeColor'] . ';' . PHP_EOL .
                        'background-color: ' . $attributes['callToActionBackColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_review_image{' . PHP_EOL .
                        'max-height: ' . $attributes['imageSize'] . 'px;' . PHP_EOL .
                        'max-width: ' . $attributes['imageSize'] . 'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/social-share':
                    $icon_sizes = array(
                        'normal' => 20,
                        'medium' => 30,
                        'large'  => 40,
                    );
                    $icon_size  = $icon_sizes[$attributes['iconSize']];
                    $blockStylesheets .= '#ub-social-share-' . $attributes['blockID'] . ' .social-share-icon{' . PHP_EOL .
                        'width:' . ( $icon_size * 1.5 ) . 'px;' . PHP_EOL .
                        'height:' . ( $icon_size * 1.5 ) . 'px;' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/star-rating-block':
                    $prefix = '#ub-star-rating-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .ub-star-outer-container{' . PHP_EOL .
                        'justify-content: '. ($attributes['starAlign'] == 'center' ? 'center' :
                            ('flex-'.$attributes['starAlign'] == 'left' ? 'start' : 'end')).';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub-review-text{' . PHP_EOL .
                        'text-align: '. $attributes['reviewTextAlign'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' svg{' . PHP_EOL .
                        'fill: ' . $attributes['starColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/styled-box':
                    $prefix = '#ub-styled-box-' . $attributes['blockID'];
                    if($attributes['mode'] == 'notification'){
                        $blockStylesheets .= $prefix . ' .ub-notification-text{'. PHP_EOL .
                            'background-color: ' . $attributes['backColor'] . ';' . PHP_EOL .
                            'color: ' . $attributes['foreColor'] . ';' . PHP_EOL .
                            'border-left-color: ' . $attributes['outlineColor'] . ';' . PHP_EOL .
                            'text-align: ' . $attributes['textAlign'][0] . ';' . PHP_EOL .
                        '}' . PHP_EOL;
                    }
                    else if($attributes['mode'] == 'feature'){
                        foreach(range(1, count($attributes['text'])) as $i){
                            $blockStylesheets .= $prefix . ' .ub-feature:nth-child('.$i.') .ub-feature-title{'. PHP_EOL .
                                'text-align: ' . $attributes['titleAlign'][$i-1] . ';' . PHP_EOL .
                            '}' . PHP_EOL .
                            $prefix . ' .ub-feature:nth-child('.$i.') .ub-feature-body{'. PHP_EOL .
                                'text-align: ' . $attributes['textAlign'][$i-1] . ';' . PHP_EOL .
                            '}' . PHP_EOL;
                        }
                    }
                    else if($attributes['mode'] == 'number'){
                        $blockStylesheets .= $prefix . ' .ub-number-panel{' . PHP_EOL .
                            'border-color: ' . $attributes['outlineColor'] . ';' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' .ub-number-container{' . PHP_EOL .
                            'background-color: ' . $attributes['backColor'] . ';' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' .ub-number-display{' . PHP_EOL .
                            'color: ' . $attributes['foreColor'] . ';' . PHP_EOL .
                        '}' . PHP_EOL;
                        foreach(range(1, count($attributes['text'])) as $i){
                            $blockStylesheets .= $prefix . ' .ub-number-panel:nth-child('.$i.') .ub-number-box-title{'. PHP_EOL .
                                'text-align: ' . $attributes['titleAlign'][$i-1] . ';' . PHP_EOL .
                            '}' . PHP_EOL .
                            $prefix . ' .ub-number-panel:nth-child('.$i.') .ub-number-box-body{'. PHP_EOL .
                                'text-align: ' . $attributes['textAlign'][$i-1] . ';' . PHP_EOL .
                            '}' . PHP_EOL;
                        }
                    }
                    break;
                case 'ub/styled-list':
                    $prefix = '#ub_styled_list-' . $attributes['blockID'];
                    if($attributes['iconSize'] < 3){
                        $blockStylesheets .= $prefix . ' .fa-li{' . PHP_EOL .
                            'top: -0.1em;' . PHP_EOL .
                        '}' . PHP_EOL;
                    } elseif($attributes['iconSize'] >= 5){
                        $blockStylesheets .= $prefix . ' .fa-li{' . PHP_EOL .
                            'top: 3px;' . PHP_EOL .
                        '}' . PHP_EOL;
                    }
                    $blockStylesheets .= $prefix . '{' . PHP_EOL .
                        'justify-content: ' . ($attributes['alignment'] == 'center' ? 'center' :
                            'flex-' . ($attributes['alignment'] == 'left' ? 'start' : 'end')) . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/tabbed-content-block':
                    $prefix = '#ub-tabbed-content-' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . ' .wp-block-ub-tabbed-content-tab-title-wrap{' . PHP_EOL .
                        'background-color: initial;' . PHP_EOL .
                        'border-color: lightgrey;' . PHP_EOL .
                        'color: #000000;' . PHP_EOL .
                    '}' . PHP_EOL . 
                    $prefix . ' .wp-block-ub-tabbed-content-tab-title-wrap.active{' . PHP_EOL .
                        'background-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                        'border-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                        'color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active{' . PHP_EOL .
                        'background-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                        'border-color: ' . $attributes['theme'] . ';' . PHP_EOL .
                        'color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
                    '}' .
                    $prefix . ' .wp-block-ub-tabbed-content-tabs-title{' . PHP_EOL .
                        'justify-content: ' . ($attributes['tabsAlignment'] == 'center' ? 'center' :
                            'flex-' . ($attributes['tabsAlignment'] == 'left' ? 'start' : 'end' )) . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    foreach($attributes['tabsTitleAlignment'] as $key => $titleAlign){
                        $blockStylesheets .= $prefix . ' .wp-block-ub-tabbed-content-tab-title-wrap:nth-child('.($key+1).'){' . PHP_EOL .
                            'text-align: ' . $titleAlign . ';' . PHP_EOL .
                        '}' . PHP_EOL;
                    }
                    break;
                case 'ub/table-of-contents-block':
                    $prefix = '#ub_table-of-contents-' . $attributes['blockID'];
                    if($attributes['listStyle']=='plain'){
                        $blockStylesheets .= $prefix . ' ul{' . PHP_EOL .
                            'list-style: none;' . PHP_EOL .
                        '}' . PHP_EOL;
                    }
                    if($attributes['enableSmoothScroll'] && $hasNoSmoothScroll){
                        $blockStylesheets .= 'html {' . PHP_EOL .
                            'scroll-behavior: smooth;' . PHP_EOL .
                        '}' . PHP_EOL;
                        $hasNoSmoothScroll = false;
                    }
                    $blockStylesheets .= $prefix . ' .ub_table-of-contents-header{' . PHP_EOL .
                        'justify-self: ' . ($attributes['titleAlignment'] == 'center' ? 'center' :
                            'flex-' . ($attributes['titleAlignment'] == 'left' ? 'start' : 'end')) . ';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/testimonial':
                    $prefix = '#ub_testimonial_' . $attributes['blockID'];
                    $blockStylesheets .= $prefix . '{' . PHP_EOL .
                        'background-color: '.$attributes['backgroundColor'].';' . PHP_EOL .
                        'color: '.$attributes['textColor'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_testimonial_text{' . PHP_EOL .
                        'font-size: '.$attributes['textSize'].';'. PHP_EOL .
                        'text-align: '.$attributes['textAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix. ' .ub_testimonial_author{' . PHP_EOL .
                        'text-align: '.$attributes['authorAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL .
                    $prefix . ' .ub_testimonial_author_role{' . PHP_EOL .
                        'text-align: '.$attributes['authorRoleAlign'].';' . PHP_EOL .
                    '}' . PHP_EOL;
                    break;
                case 'ub/post-grid':
                    $prefix = '#ub_post-grid-block_' . $attributes['blockID'];
                    break;
            }
        }
    }
    $blockStylesheets = preg_replace( '/\s+/', ' ', $blockStylesheets );
    ob_start(); ?>

<style><?php echo($blockStylesheets); ?></style>
    
    <?php
    ob_end_flush();
}
add_action('wp_head', 'ub_include_block_attribute_css');

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function ultimate_blocks_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'ultimate_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor'), // Dependencies, defined above.
		Ultimate_Blocks_Constants::plugin_version(), true  // Version: latest version number.
	);

	wp_enqueue_script(
		'ultimate_blocks-cgb-deactivator-js', // Handle.
		plugins_url( '/dist/deactivator.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-editor', 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
		Ultimate_Blocks_Constants::plugin_version(), // Version: latest version number.
		true
	);

    // Styles.

    if (file_exists(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css') && 
        filemtime(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css') <
        filemtime(dirname(__DIR__) . '/dist/blocks.editor.build.css')){
        $adminStyleFile = fopen(wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css', 'w');
        $blockDir = dirname(__DIR__) . '/src/blocks/';
        $blockList = get_option( 'ultimate_blocks', false );

        foreach ( $blockList as $key => $block ) {
            $blockDirName = strtolower(str_replace(' ', '-', 
            trim(preg_replace('/\(.+\)/', '', $blockList[ $key ]['label']))
                ));
            $adminStyleLocation = $blockDir . $blockDirName . '/editor.css';

            if(file_exists($adminStyleLocation) && $blockList[ $key ]['active']){ //also detect if block is enabled
                fwrite($adminStyleFile, file_get_contents($adminStyleLocation));
            }
            if($block['name'] === 'ub/styled-box' && $blockList[$key]['active']){
                //add css for blocks phased out by styled box
                fwrite($adminStyleFile, file_get_contents($blockDir . 'feature-box' . '/style.css'));
                fwrite($adminStyleFile, file_get_contents($blockDir . 'number-box' . '/style.css'));
            }
        }
        fclose($adminStyleFile);
    }

	wp_enqueue_style(
		'ultimate_blocks-cgb-block-editor-css', // Handle.
        file_exists(dirname(dirname(dirname(__DIR__))) . '/uploads/ultimate-blocks') ?
            content_url('/uploads/ultimate-blocks/blocks.editor.build.css') :
            plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		Ultimate_Blocks_Constants::plugin_version() // Version: latest version number
	);
} // End function ultimate_blocks_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'ultimate_blocks_cgb_editor_assets' );



/**
 * Rank Math ToC Plugins List.
 */
add_filter( 'rank_math/researches/toc_plugins', function( $toc_plugins ) {
	$toc_plugins['ultimate-blocks/ultimate-blocks.php'] = 'Ultimate Blocks';
 	return $toc_plugins;
});

// Click to Tweet Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/click-to-tweet/block.php';

// Social Share Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/social-share/block.php';

// Content toggle Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/content-toggle/block.php';

// Tabbed Content Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/tabbed-content/block.php';

// Progress Bar Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/progress-bar/block.php';

// Countdown Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/countdown/block.php';

// Image Slider Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/image-slider/block.php';

// Table of Contents Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/table-of-contents/block.php';

// Button Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/button/block.php';

// Content Filter Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/content-filter/block.php';

// Call to Action Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/call-to-action/block.php';

// Feature Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/feature-box/block.php';

// Notification Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/notification-box/block.php';

// Number Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/number-box/block.php';

// Star Rating
require_once plugin_dir_path( __FILE__ ) . 'blocks/star-rating/block.php';

// Testimonial
require_once plugin_dir_path( __FILE__ ) . 'blocks/testimonial/block.php';

// Review
require_once plugin_dir_path( __FILE__ ) . 'blocks/review/block.php';

// Divider
require_once plugin_dir_path( __FILE__ ) . 'blocks/divider/block.php';

//Post-Grid
require_once plugin_dir_path( __File__ ) . 'blocks/post-grid/block.php';

//Styled Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/styled-box/block.php';

//Expand
require_once plugin_dir_path( __FILE__ ) . 'blocks/expand/block.php';

// Styled List
require_once plugin_dir_path( __FILE__ ) . 'blocks/styled-list/block.php';
