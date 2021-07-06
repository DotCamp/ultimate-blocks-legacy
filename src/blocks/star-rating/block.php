<?php

function ub_render_star_rating_block($attributes){
    require_once dirname(dirname(__DIR__)) . '/common.php';

    extract($attributes);
    
    $stars = ub_generateStarDisplay($selectedStars, $starCount, $blockID,
    'none', $starColor, $starColor, "", "ub_star_rating_filter-", $starSize);

    if($blockID === ''){
        $stars = preg_replace_callback('/<svg ([^>]+)>/', function($svgAttributes){
            if(preg_match('/fill=\"([^"]+)\"/', $svgAttributes[1], $matches)){
                return '<svg ' . $svgAttributes[1] . ' style="fill:' . $matches[1] . ';">';
            }
            return $svgAttributes[0];
        }, $stars);
    }

    return '<div class="ub-star-rating' . (isset($className) ? ' ' . esc_attr($className) : '') .
            '"' . ($blockID === '' ? '' : ' id="ub-star-rating-' . $blockID . '"') . '>
                <div class="ub-star-outer-container"' .
                    ($blockID === '' ? '  style="justify-content:' . ($starAlign === 'center' ? 'center' :
                    ('flex-' . $starAlign === 'left' ? 'start' : 'end')) . ';"' : '').'>
                    <div class="ub-star-inner-container">'.$stars.'</div>
                </div>'.
                ($reviewText === '' ? '' : '<div class="ub-review-text"' . ($blockID === '' ? ' style="text-align:' . $reviewTextAlign . ';"' : '') . '>' . 
                    $reviewText
                . '</div>') .
            '</div>';
}

function ub_register_star_rating_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/star-rating-block', array(
            'attributes' => $defaultValues['ub/star-rating-block']['attributes'],
            'render_callback' => 'ub_render_star_rating_block'));
    }
}

add_action('init', 'ub_register_star_rating_block');