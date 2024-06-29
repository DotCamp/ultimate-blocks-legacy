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
	$classes = array( 'ub-star-rating' );
	if( !empty($textPosition) ){
		$classes[] = 'ub-star-rating-text-' . esc_attr($textPosition) ;
	}
	if( !empty($starAlign) ){
		$classes[] = 'ub-star-rating-align-' . esc_attr($starAlign) ;
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode(' ', $classes)
		)
	);
    return '<div ' . $wrapper_attributes .
            '"' . ($blockID === '' ? '' : ' id="ub-star-rating-' . esc_attr($blockID) . '"') . '>
                <div class="ub-star-outer-container"' .
                    ($blockID === '' ? '  style="justify-content:' . ($starAlign === 'center' ? 'center' :
                    ('flex-' . $starAlign === 'left' ? 'start' : 'end')) . ';"' : '').'>
                    <div class="ub-star-inner-container">'.$stars.'</div>
                </div>'.
                ($reviewText === '' || false === $isShowReviewText ? '' : '<div class="ub-review-text"' . ($blockID === '' ? ' style="text-align:' . esc_attr($reviewTextAlign) . ';"' : '') . '>' .
                    wp_kses_post($reviewText)
                . '</div>') .
            '</div>';
}

function ub_register_star_rating_block() {
	if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/star-rating', array(
            'attributes' => $defaultValues['ub/star-rating-block']['attributes'],
            'render_callback' => 'ub_render_star_rating_block'));
    }
}

add_action('init', 'ub_register_star_rating_block');
