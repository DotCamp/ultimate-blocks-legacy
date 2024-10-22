<?php

function ub_generate_review_block_styling($attributes){
	$summary_title_font_size	= isset($attributes['summaryTitleFontSize']) ? $attributes['summaryTitleFontSize'] : "";
	$main_title_font_size 			= isset($attributes['mainTitleFontSize']) ? $attributes['mainTitleFontSize'] : "";

	$styles = array(
		"--ub-review-summary-title-font-size"	=> $summary_title_font_size,
		"--ub-review-title-font-size"			=> $main_title_font_size,
	);

	$css = Ultimate_Blocks\includes\generate_css_string($styles);

	return $css;
}

function ub_generatePercentageBar($value, $id, $activeColor, $inactiveColor ){
    $percentBar = "M 0.5,0.5 L 99.5,0.5";
    return '<div class="ub_review_percentage">
            <svg class="ub_review_percentage_bar" viewBox="0 0 100 1" preserveAspectRatio="none" height="10">
                <path
                    class="ub_review_percentage_bar_trail"
                    d="' . $percentBar . '" stroke="' . esc_attr($inactiveColor) . '"
                    stroke-width="1"
                ></path>
                <path
                    class="ub_review_percentage_bar_path"
                    d="' . $percentBar . '" stroke="' . esc_attr($activeColor) . '"
                    stroke-width="1" stroke-dashoffset="' . (100 - $value) . 'px"
                ></path>
            </svg>
            <div>' . wp_kses_post($value) . '%</div>
    </div>';
}

function ub_filterJsonldString($string){
    return str_replace("\'", "'", wp_kses_post(urlencode($string)));
}

function ub_render_review_block($attributes, $block_content, $block_instance){
    require_once dirname(dirname(__DIR__)) . '/common.php';

    extract($attributes);
    $parsedItems = isset($parts) ? $parts : json_decode($items, true);

    if($blockID === ''){
        $blockID = $ID;
    }

    $extractedValues = array_map(function($item){
                                    return $item['value'];
                                }, $parsedItems);

    $average = round(array_sum($extractedValues) / count($extractedValues), 1);

    $ratings = '';

    foreach($parsedItems as $key => $item){
        $ratings .= '<div class="ub_review_' . ($valueType === 'percent' ? 'percentage_' : '') . 'entry"><span>' . $item['label'] . '</span>' .
        ($valueType === 'star' ? ub_generateStarDisplay($item['value'], $starCount, $blockID . '-' . $key,
                                $inactiveStarColor, $activeStarColor, $starOutlineColor, "ub_review_stars", "ub_review_star_filter-")
                                : ub_generatePercentageBar($item['value'], $blockID . '-' . $key, $activePercentBarColor, $percentBarColor ?: '#d9d9d9')  ) . '</div>';
    }
    $button_block = !empty($block_instance->parsed_block['innerBlocks']) ? $block_instance->parsed_block['innerBlocks'][0] : array();
    $buttons = isset($button_block['attrs']['buttons']) ? $button_block['attrs']['buttons'] : array();

    $offers = array();

    foreach ($buttons as $button) {
        $offer = array(
            "@type" => "Offer",
            "url" => esc_url($button['url']),
            "priceCurrency" => ub_filterJsonldString($offerCurrency),
            "price" => ub_filterJsonldString($offerPrice),
        );
        if($offerExpiry > 0){
            array_merge($offer, array('priceValidUntil'=>date("Y-m-d", $offerExpiry)));
        }

        $offers[] = $offer;
    }

    $all_buttons_offer = json_encode($offers, JSON_UNESCAPED_SLASHES);
    $aggregate_offer = '{
        "@type": "' . $offerType . '",
        "priceCurrency": "' . ub_filterJsonldString($offerCurrency) . '",' .
        '"lowPrice": "' . $offerLowPrice . '",
        "highPrice": "' . $offerHighPrice . '",
        "offerCount": "' . absint($offerCount) . '"
    }';
    $offerCode = '"offers":' . ($offerType === 'AggregateOffer' ? $aggregate_offer : $all_buttons_offer );

    $itemExtras = '';

    switch ($itemType){
        case 'Book':
            $itemExtras = '"author": "'. ub_filterJsonldString($bookAuthorName) . '",
                            "isbn": "'. ub_filterJsonldString($isbn) . '",
                            "sameAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Course':
            $itemExtras = '"provider": "' . ub_filterJsonldString($provider) . '"';
        break;
        case 'Event':
            $itemExtras = $offerCode . ',
            "startDate": "'. date("Y-m-d", $eventStartDate) . '",' .
            ($eventEndDate > 0 ? '"endDate": "'. date("Y-m-d", $eventEndDate) . '",' : '').
            '"location":{
                "@type":'. ($usePhysicalAddress ?
                            '"Place",
                "name": "' . ub_filterJsonldString($addressName) . '",
                "address": "' . ub_filterJsonldString($address) . '"' :
                            '"VirtualLocation",
                "url": "' . esc_url($eventPage) . '"').
            '},
            "organizer": "' . ub_filterJsonldString($organizer) . '",
            "performer": "' . ub_filterJsonldString($performer) . '"';
        break;
        case 'Product':
            $itemExtras = '"brand": {
                                "@type": "Brand",
                                "name": "' . ub_filterJsonldString($brand) . '"
                            },
                            "sku": "'. ub_filterJsonldString($sku) .'",
                            "' . ub_filterJsonldString($identifierType) . '": "' . ub_filterJsonldString($identifier) . '",' . $offerCode;
        break;
        case 'LocalBusiness':
            $itemExtras =  isset($cuisines) && !empty($cuisines) ? ( '"servesCuisine":' . json_encode($cuisines) . ',') : '' .
                            '"address": "' . ub_filterJsonldString($address) . '",
                            "telephone": "' . ub_filterJsonldString($telephone) . '",
                            "priceRange": "' . ub_filterJsonldString($priceRange) . '",
                            "sameAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Movie':
            $itemExtras = '"sameAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Organization':
            $itemExtras = (in_array($itemSubsubtype, array('Dentist', 'Hospital', 'MedicalClinic', 'Pharmacy', 'Physician')) ? ('"priceRange":"' . ub_filterJsonldString($priceRange) . '",'): '').
            '"address": "' . ub_filterJsonldString($address) . '",
            "telephone": "' . ub_filterJsonldString($telephone) . '"';
        break;
        case 'SoftwareApplication':
            $itemExtras = '"applicationCategory": "' . ub_filterJsonldString($appCategory) . '",
                            "operatingSystem": "' . ub_filterJsonldString($operatingSystem) . '",' . $offerCode;
        break;
        case 'MediaObject':
            $itemExtras = $itemSubtype === 'VideoObject' ?
                    ('"uploadDate": "' . date("Y-m-d", $videoUploadDate) . '",
                    "contentUrl": "' . esc_url($videoURL) . '"') : '';
        break;
        default:
            $itemExtras = '';
        break;
    }

    $schema_json_content = '{
        "@context": "http://schema.org/",
        "@type": "Review",' .
        ($useSummary ? '"reviewBody": "' . ub_filterJsonldString($summaryDescription) . '",' : '') .
        '"description": "' . ub_filterJsonldString($description) . '",
        "itemReviewed": {
            "@type":"' . ($itemSubsubtype ?: $itemSubtype ?: $itemType) . '",' .
            ($itemName ? ('"name":"' . ub_filterJsonldString($itemName) . '",') : '') .
            ($imgURL ? (($itemSubtype === 'VideoObject' ? '"thumbnailUrl' : '"image') . '": "' . esc_url($imgURL) . '",') : '') .
            '"description": "' . ub_filterJsonldString($description) .'"'
                . ($itemExtras === '' ? '' : ',' . $itemExtras ) .
        '},
        "reviewRating":{
            "@type": "Rating",
            "ratingValue": "' . ((int)$average % 1 === 0 ? $average : number_format($average, 1, '.', '')) . '",
            "bestRating": "' . ($valueType === 'star' ? $starCount : '100') . '"
        },
        "author":{
            "@type": "Person",
            "name": "'. ub_filterJsonldString($authorName) .'"
        },
        "publisher": "' . ub_filterJsonldString($reviewPublisher) . '",
        "datePublished": "' . date("Y-m-d", $publicationDate) . '",
        "url": "' . get_permalink() . '"
    }';

	// review schema filter hook
	$schema_json_content = apply_filters('ultimate-blocks/filter/review_schema', $enableReviewSchema ? $schema_json_content : '', $attributes);

	$schema_json_ld = ($enableReviewSchema ? preg_replace( '/\s+/', ' ', ('<script type="application/ld+json">' .$schema_json_content . '</script>')) : '');

    return '<div class="wp-block-ub-review ub_review_block' . (isset($className) ? ' ' . esc_attr($className) : '') .
                '" id="ub_review_' . esc_attr($blockID) . '">
        <p class="ub_review_item_name"' . ($blockID === '' ? ' style="text-align: ' . esc_attr($titleAlign) . ';"' : '') . '>' .
            wp_kses_post($itemName) . '</p><p class="ub_review_author_name"' .
            ($blockID === '' ? ' style="text-align: ' . esc_attr($authorAlign) . ';"' : '') . '>' . wp_kses_post($authorName) . '</p>' .
        (($enableImage || $enableDescription) && ($imgURL !== '' || $description !== '') ?
        '<div class="ub_review_description_container ub_review_' . esc_attr($imgPosition) . '_image">' .
            (!$enableImage || $imgURL === '' ? '' : '<img class="ub_review_image" src="' . esc_url($imgURL) . '" alt = "' . esc_attr($imgAlt) . '">') .
            (!$enableDescription || $description === '' ? '' : '<div class="ub_review_description">' . wp_kses_post($description) . '</div>') .
        '</div>' : '').
            $ratings
    .'<div class="ub_review_summary">' .
        ($useSummary ? '<p class="ub_review_summary_title">' . wp_kses_post($summaryTitle) . '</p>' : '') .
        '<div class="ub_review_overall_value">' .
            ($useSummary ? '<p>' . wp_kses_post($summaryDescription) . '</p>' : '') .
            '<div class="ub_review_average"><span class="ub_review_rating">' . $average . ($valueType === 'percent' ? '%':'') . '</span>' .
            ($valueType === 'star' ? ub_generateStarDisplay($average, $starCount, $blockID . '-average',
            $inactiveStarColor, $activeStarColor, $starOutlineColor, "ub_review_average_stars", "ub_review_star_filter-") : '' ).
            '</div>
        </div>
        <div class="ub_review_cta_panel">' .
        ($enableCTA  ? '<div class="ub_review_cta_main">' . $block_content . '</div>' : '') .
                '</div></div>' . $schema_json_ld
    . '</div>';
}

function ub_register_review_block() {
	if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/review/block.json', array(
            'attributes' => $defaultValues['ub/review']['attributes'],
            'render_callback' => 'ub_render_review_block'));
    }
}

add_action('init', 'ub_register_review_block');
