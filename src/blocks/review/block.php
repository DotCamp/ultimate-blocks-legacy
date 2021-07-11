<?php

function ub_generatePercentageBar($value, $id, $activeColor, $inactiveColor ){
    $percentBar = "M 0.5,0.5 L 99.5,0.5";
    return '<div class="ub_review_percentage">
            <svg class="ub_review_percentage_bar" viewBox="0 0 100 1" preserveAspectRatio="none" height="10">
                <path
                    class="ub_review_percentage_bar_trail"
                    d="' . $percentBar . '" stroke="' . $inactiveColor . '"
                    stroke-width="1"
                ></path>
                <path
                    class="ub_review_percentage_bar_path"
                    d="' . $percentBar . '" stroke="' . $activeColor . '"
                    stroke-width="1" stroke-dashoffset="' . (100 - $value) . 'px"
                ></path>
            </svg>
            <div>' . $value . '%</div>
    </div>';
}

function ub_render_review_block($attributes){
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

    $offerCode = '"offers":{
        "@type": "' . $offerType . '",
        "priceCurrency": "' . wp_filter_nohtml_kses($offerCurrency) . '",' .
            ($offerType === 'AggregateOffer' ? 
                '"lowPrice": "' . $offerLowPrice . '",
                "highPrice": "' . $offerHighPrice . '",
                "offerCount": "' . absint($offerCount) . '"' 
            : '"price": "' . $offerPrice . '",
                "url": "' . esc_url($callToActionURL) . '"' .
                ($offerExpiry > 0 ? (', "priceValidUntil": "' . date("Y-m-d", $offerExpiry) . '"') : '')).
    '}';

    $itemExtras = '';

    switch ($itemType){
        case 'Book':
            $itemExtras = '"author": "'. wp_filter_nohtml_kses($bookAuthorName) . '",
                            "isbn": "'. wp_filter_nohtml_kses($isbn) . '",
                            "saveAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Course':
            $itemExtras = '"provider": "' . wp_filter_nohtml_kses($provider) . '"';
        break;
        case 'Event':
            $itemExtras = $offerCode . ',
            "startDate": "'. date("Y-m-d", $eventStartDate) . '",' .
            ($eventEndDate > 0 ? '"endDate": "'. date("Y-m-d", $eventEndDate) . '",' : '').
            '"location":{
                "@type":'. ($usePhysicalAddress ?
                            '"Place",
                "name": "' . wp_filter_nohtml_kses($addressName) . '",
                "address": "' . wp_filter_nohtml_kses($address) . '"' :
                            '"VirtualLocation",
                "url": "' . esc_url($eventPage) . '"').
            '},
            "organizer": "' . wp_filter_nohtml_kses($organizer) . '",
            "performer": "' . wp_filter_nohtml_kses($performer) . '"';
        break;
        case 'Product':
            $itemExtras = '"brand": {
                                "@type": "Brand",
                                "name": "' . wp_filter_nohtml_kses($brand) . '"
                            },
                            "sku": "'. wp_filter_nohtml_kses($sku) .'",
                            "' . wp_filter_nohtml_kses($identifierType) . '": "' . wp_filter_nohtml_kses($identifier) . '",' . $offerCode;
        break;
        case 'LocalBusiness':
            $itemExtras =  isset($cuisines) ? ( '"servesCuisine":' . json_encode($cuisines) . ',') : '' .
                            '"address": "' . wp_filter_nohtml_kses($address) . '",
                            "telephone": "' . wp_filter_nohtml_kses($telephone) . '",
                            "priceRange": "' . wp_filter_nohtml_kses($priceRange) . '",
                            "saveAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Movie':
            $itemExtras = '"saveAs": "' . esc_url($itemPage) . '"';
        break;
        case 'Organization':
            $itemExtras = (in_array($itemSubsubtype, array('Dentist', 'Hospital', 'MedicalClinic', 'Pharmacy', 'Physician')) ? ('"priceRange":"' . wp_filter_nohtml_kses($priceRange) . '",'): '').
            '"address": "' . wp_filter_nohtml_kses($address) . '",
            "telephone": "' . wp_filter_nohtml_kses($telephone) . '"';
        break;
        case 'SoftwareApplication':
            $itemExtras = '"applicationCategory": "' . wp_filter_nohtml_kses($appCategory) . '",
                            "operatingSystem": "' . wp_filter_nohtml_kses($operatingSystem) . '",' . $offerCode;
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

    return '<div class="ub_review_block' . (isset($className) ? ' ' . esc_attr($className) : '') .
                '" id="ub_review_' . $blockID . '">
        <p class="ub_review_item_name"' . ($blockID === '' ? ' style="text-align: ' . $titleAlign . ';"' : '') . '>' .
            $itemName . '</p><p class="ub_review_author_name"' .
            ($blockID === '' ? ' style="text-align: ' . $authorAlign . ';"' : '') . '>' . $authorName . '</p>' .
        (($enableImage || $enableDescription) && ($imgURL !== '' || $description !== '') ?
        '<div class="ub_review_description_container">' .
            (!$enableImage || $imgURL === '' ? '' : '<img class="ub_review_image" src="' . $imgURL . '" alt = "' . $imgAlt . '">') .
            (!$enableDescription || $description === '' ? '' : '<div class="ub_review_description">' . $description . '</div>') .
        '</div>' : '').
            $ratings
    .'<div class="ub_review_summary">' .
        ($useSummary ? '<p class="ub_review_summary_title">' . $summaryTitle . '</p>' : '') .
        '<div class="ub_review_overall_value">' .
            ($useSummary ? '<p>' . $summaryDescription . '</p>' : '') .
            '<div class="ub_review_average"><span class="ub_review_rating">' . $average . ($valueType === 'percent' ? '%':'') . '</span>' .
            ($valueType === 'star' ? ub_generateStarDisplay($average, $starCount, $blockID . '-average',
            $inactiveStarColor, $activeStarColor, $starOutlineColor, "ub_review_average_stars", "ub_review_star_filter-") : '' ).
            '</div>
        </div>
        <div class="ub_review_cta_panel">' .
        ($enableCTA && $callToActionURL !== '' ? '<div class="ub_review_cta_main">
            <a href="' . esc_url($callToActionURL) .
                '" ' . ($ctaOpenInNewTab ? 'target="_blank" ' : '') . 'rel="' . ($ctaNoFollow ? 'nofollow ' : '') . ($ctaIsSponsored ? 'sponsored ': '') . 'noopener noreferrer"' .
                    ($blockID === '' ? '  style="color: ' . $callToActionForeColor . ';"' : '') . '>
                <button class="ub_review_cta_btn"' . ($blockID === '' ? ' style="background-color: ' . $callToActionBackColor
                . '; border-color: ' . $callToActionForeColor . '; color: ' . $callToActionForeColor . ';"' : '') . '>' .
                    ($callToActionText === '' ? 'Click here' : $callToActionText) . '</button></a></div>' : '') .
                '</div></div>' . ($enableReviewSchema ? preg_replace( '/\s+/', ' ', ('<script type="application/ld+json">{
        "@context": "http://schema.org/",
        "@type": "Review",' .
        ($useSummary ? '"reviewBody": "' . wp_filter_nohtml_kses($summaryDescription) . '",' : '') .
        '"description": "' . wp_filter_nohtml_kses($description) . '",
        "itemReviewed": {
            "@type":"' . ($itemSubsubtype ?: $itemSubtype ?: $itemType) . '",' .
            ($itemName ? ('"name":"' . wp_filter_nohtml_kses($itemName) . '",') : '') .
            ($imgURL ? (($itemSubtype === 'VideoObject' ? '"thumbnailUrl' : '"image') . '": "' . esc_url($imgURL) . '",') : '') .
            '"description": "' . wp_filter_nohtml_kses($description) .'"'
                . ($itemExtras === '' ? '' : ',' . $itemExtras ) .
        '},
        "reviewRating":{
            "@type": "Rating",
            "ratingValue": "' . ($average % 1 === 0 ? $average : number_format($average, 1, '.', '')) . '",
            "bestRating": "' . ($valueType === 'star' ? $starCount : '100') . '"
        },
        "author":{
            "@type": "Person",
            "name": "'. wp_filter_nohtml_kses($authorName) .'"
        },
        "publisher": "' . wp_filter_nohtml_kses($reviewPublisher) . '",
        "datePublished": "' . date("Y-m-d", $publicationDate) . '",
        "url": "' . get_permalink() . '"
    }</script>')) : '')
    . '</div>';
}

function ub_register_review_block() {
	if( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/review', array(           
            'attributes' => $defaultValues['ub/review']['attributes'],
            'render_callback' => 'ub_render_review_block'));
    }
}

add_action('init', 'ub_register_review_block');