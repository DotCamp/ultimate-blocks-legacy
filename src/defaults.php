<?php

$defaultValues = array(
    'ub/button' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Button Text'
            ),
            'align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'url' => array(
                'type' => 'string',
                'default' => ''
            ),
            'size' => array(
                'type' => 'string',
                'default' => 'medium'
            ),
            'buttonColor' => array(
                'type' => 'string',
                'default' => '#313131'
            ),
            'buttonHoverColor' => array(
                'type' => 'string',
                'default' => '#313131'
            ),
            'buttonTextColor' => array(
                'type' => 'string',
                'default' => '#ffffff'
            ),
            'buttonTextHoverColor' => array(
                'type' => 'string',
                'default' => '#ffffff'
            ),
            'buttonRounded' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'chosenIcon' => array(
                'type' => 'string',
                'default' => ''
            ),
            'iconPosition' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'buttonIsTransparent' => array(
                'type' => 'boolean',
                'default'=> false
            ),
            'addNofollow' => array(
                'type' => 'boolean',
                'default'=> true
            ),
            'openInNewTab' => array(
                'type' => 'boolean',
                'default'=> true
            ),
            'buttonWidth' => array(
                'type' => 'string',
                'default' => 'fixed'
            )
        )
    ),
    'ub/call-to-action-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ub_call_to_action_headline_text' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ub_cta_content_text' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ub_cta_button_text' => array(
                'type' => 'string',
                'default' => ''
            ),
            'headFontSize' => array(
                'type' => 'number',
                'default' => 30
            ),
            'headColor' => array(
                'type' => 'string',
                'default' => '#444444'
            ),
            'headAlign' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'contentFontSize' => array(
                'type' => 'number',
                'default' => 15
            ),
            'contentColor' => array(
                'type' => 'string',
                'default' => '#444444'
            ),
            'buttonFontSize' => array(
                'type' => 'number',
                'default' => 14
            ),
            'buttonColor' => array(
                'type' => 'string',
                'default' => '#E27330'
            ),
            'buttonTextColor' => array(
                'type' => 'string',
                'default' => '#ffffff'
            ),
            'buttonWidth' => array(
                'type' => 'number',
                'default' => 250
            ),
            'ctaBackgroundColor' => array(
                'type' => 'string',
                'default' => '#f8f8f8'
            ),
            'ctaBorderColor' => array(
                'type' => 'string',
                'default' => '#ECECEC'
            ),
            'ctaBorderSize' => array(
                'type' => 'number',
                'default' => 2
            ),
            'url' => array(
                'type' => 'string',
                'default' => ''
            ),
            'contentAlign' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'addNofollow' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'openInNewTab' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'useHeadingTag' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'selectedHeadingTag' => array(
                'type' => 'string',
                'default' => 'h2'
            )
        )
    ),
    'ub/click-to-tweet' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ubTweet' => array(
                'type' => 'string',
                'default' => ''
            ),
            'tweetFontSize' => array(
                'type' => 'number',
                'default' => 20
            ),
            'tweetColor' => array(
                'type' => 'string',
                'default' => '#444444'
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#CCCCCC'
            ),
        )
    ),
    'ub/content-filter-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'filterArray' => array(
                'type' => 'array',
                'default' => array()
            ),
            'buttonColor' => array(
                'type' => 'string',
                'default' => '#eeeeee'
            ),
            'buttonTextColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'activeButtonColor' => array(
                'type' => 'string',
                'default' => '#fcb900'
            ),
            'activeButtonTextColor' => array(
                'type' => 'string',
                'default' => '#ffffff'
            ),
            'initiallyShowAll' => array(
                'type' => 'boolean',
                'default' => true
            )
        )
    ),
    'ub/content-toggle-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'hasFAQSchema' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'preventCollapse' => array(
                'type' => 'boolean',
                'default' => false
            )
        )
    ),
    'ub/content-toggle-panel-block' => array(
        'attributes' => array(
            'parentID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'theme' => array(
                'type' => 'string',
                'default' => '#f63d3d'
            ),
            'collapsed' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'titleColor' => array(
                'type' => 'string',
                'default' => '#ffffff'
            ),
            'panelTitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'titleTag' => array(
                'type' => 'string',
                'default' => 'p'
            ),
            'preventCollapse' => array(
                'type' => 'boolean',
                'default' => false
            )
        )
    ),
    'ub/countdown' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
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
        )
    ),
    'ub/divider' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'borderSize' => array(
                'type' => 'number',
                'default' => 2
            ),
            'borderStyle' => array(
                'type' => 'string',
                'default' => 'solid'
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#ccc'
            ),
            'borderHeight' => array(
                'type' => 'number',
                'default' => 20
            )
        )
    ),
    'ub/expand' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'initialShow' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'toggleAlign'=> array(
                'type' => 'string',
                'default' => 'left'
            )
        )
    ),
    'ub/expand-portion' => array(
        'attributes' => array(
            'clickText' => array(
                'type' => 'string',
                'default' => ''
            ),
            'displayType' => array(
                'type' => 'string',
                'default' => ''
            ),
            'isVisible' => array(
                'type' => 'boolean',
                'default' => false
            )
        )
    ),
    'ub/feature-box-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'column' => array(
                'type' => 'string',
                'default' => '2'
            ),
            'columnOneTitle' => array(
                'type' => 'string',
                'default' => 'Title One'
            ),
            'title1Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnTwoTitle' => array(
                'type' => 'string',
                'default' => 'Title Two'
            ),
            'title2Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnThreeTitle' => array(
                'type' => 'string',
                'default' => 'Title Three'
            ),
            'title3Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnOneBody' => array(
                'type' => 'string',
                'default' =>  'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
            ),
            'body1Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'columnTwoBody' => array(
                'type' => 'string',
                'default' =>  'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
            ),
            'body2Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'columnThreeBody' => array(
                'type' => 'string',
                'default' =>  'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
            ),
            'body3Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'imgOneURL' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'imgOneID' => array(
                'type' => 'number',
                'default' => -1
            ),
            'imgOneAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imgTwoURL' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'imgTwoID' => array(
                'type' => 'number',
                'default' => -1
            ),
            'imgTwoAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imgThreeURL' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'imgThreeID' => array(
                'type' => 'number',
                'default' => -1
            ),
            'imgThreeAlt' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ),
    'ub/image-slider' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            //retained for reverse compatibility
            'images' => array(
                'type' => 'string',
                'default' => '[]'
            ),
            'pics' => array(
                'type' => 'array',
                'default' => array()
            ),
            //retained for reverse compatibility
            'captions' => array(
                'type' => 'string',
                'default' => '[]'
            ),
            'descriptions' => array(
                'type' => 'array',
                'default' => array()
            ),
            'wrapsAround' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'isDraggable' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'autoplays' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'autoplayDuration' => array(
                'type' => 'number',
                'default' => 3
            ),
            'sliderHeight' => array(
                'type' => 'number',
                'default' => 250
            ),
            'showPageDots' => array(
                'type' => 'boolean',
                'default' => true
            )
        )
    ),
    'ub/notification-box-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ub_selected_notify' => array(
                'type' => 'string',
                'default' => 'ub_notify_info'
            ),
            'ub_notify_info' => array(
                'type' => 'string',
                'default' => ''
            ),
            'align' => array(
                'type' => 'string',
                'default' => 'left'
            )
        )
    ),
    'ub/number-box-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' =>  'string',
                'default' => ''
            ),
            'column' => array(
                'type' => 'string',
                'default' => '2'
            ),
            'columnOneNumber' => array(
                'type' => 'string',
                'default' => ''
            ),
            'columnOneTitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title1Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnTwoNumber' => array(
                'type' => 'string',
                'default' => ''
            ),
            'columnTwoTitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title2Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnThreeNumber' => array(
                'type' => 'string',
                'default' => ''
            ),
            'columnThreeTitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title3Align' => array(
                'type' => 'string',
                'default' => 'center'
            ),
            'columnOneBody' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'body1Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'columnTwoBody' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'body2Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'columnThreeBody' => array(
                'type' => 'string',
                'default' =>  ''
            ),
            'body3Align' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'numberBackground' => array(
                'type' => 'string',
                'default' => '#CCCCCC'
            ),
            'numberColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#CCCCCC'
            )
        )
    ),
    'ub/progress-bar' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
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
            'detailAlign' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'barColor' => array(
                'type' => 'string',
                'default' => '#2db7f5'
            ),
            'barThickness' => array(
                'type' => 'number',
                'default' => 1
            ),
        )
    ),
    'ub/review' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'authorName' => array(
                'type' => 'string',
                'default' => ''
            ),
            'itemName' => array(
                'type' => 'string',
                'default' => ''
            ),
            'description' => array(
                'type' => 'string',
                'default' => ''
            ),
            'enableDescription' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'descriptionAlign' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'imgURL' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imgID' => array(
                'type' => 'number',
                'default' => -1
            ),
            'imgAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'enableImage' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'items' => array(
                'type' => 'string',
                'default' => '[{"label": "", "value": 0}]'
            ),
            'starCount' => array(
                'type' => 'number',
                'default' => 5
            ),
            'summaryTitle' => array(
                'type' => 'string',
                'default' => 'Summary'
            ),
            'summaryDescription' => array(
                'type' => 'string',
                'default' => ''
            ),
            'callToActionText' => array(
                'type' => 'string',
                'default' => ''
            ),
            'callToActionURL' => array(
                'type' => 'string',
                'default' => ''
            ),
            'callToActionBackColor' => array(
                'type' => 'string',
                'default' => '#f63d3d'
            ),
            'callToActionForeColor' => array(
                'type' => 'string',
                'default' => '#ffffff'                    
            ),
            'inactiveStarColor' => array(
                'type' => 'string',
                'default' => '#888888'
            ),
            'activeStarColor' => array(
                'type' => 'string',
                'default' => '#eeee00'
            ),
            //retained for backwards compatibility
            'selectedStarColor' => array(
                'type' => 'string',
                'default' => '#ffff00'
            ),
            'titleAlign' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'authorAlign' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'enableCTA' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'ctaNoFollow' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'ctaOpenInNewTab' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'enableReviewSchema' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'starOutlineColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'imageSize' => array(
                'type' => 'number',
                'default' => 100
            ),
            'brand' => array(
                'type' => 'string',
                'default' => ''
            ),
            'sku' => array(
                'type' => 'string',
                'default' => ''
            ),
            'identifier' => array(
                'type' => 'string',
                'default' => ''
            ),
            'identifierType' => array(
                'type' => 'string',
                'default' => 'gtin'
            ),
            'offerType' => array(
                'type' => 'string',
                'default' => 'Offer'
            ),
            'offerStatus' => array(
                'type' => 'string',
                'default' => 'InStock'
            ),
            'offerHighPrice' => array(
                'type' => 'number',
                'default' => 0
            ),
            'offerLowPrice' => array(
                'type' => 'number',
                'default' => 0
            ),
            'offerCount' => array(
                'type' => 'number',
                'default' => 1
            ),
            'offerPrice' => array(
                'type' => 'number',
                'default' => 0
            ),
            'offerCurrency' => array(
                'type' => 'string',
                'default' => 'USD'
            ),
            'offerExpiry' => array(
                'type' => 'number',
                'default' => time() + 10800
            )
        )
    ),
    'ub/social-share' => array(
        'attributes'      => array(
            'blockID'=>array(
                'type' => 'string',
                'default' => ''
            ),
            'showFacebookIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showTwitterIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showLinkedInIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showPinterestIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showRedditIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showGooglePlusIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'showTumblrIcon' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'iconSize'    => array(
                'type'    => 'string',
                'default' => 'normal',
            ),
            'iconShape'   => array(
                'type'    => 'string',
                'default' => 'circle',
            ),
            'align'       => array(
                'type'    => 'string',
                'default' => 'left',
            ),
        )
    ),
    'ub/star-rating-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'starCount' => array(
                'type' => 'number',
                'default' => 5
            ),
            'starSize' => array(
                'type' => 'number',
                'default' => 20
            ),
            'starColor' => array(
                'type' => 'string',
                'default' => '#ffff00'
            ),
            'selectedStars' => array(
                'type' => 'number',
                'default' => 0
            ),
            'reviewText' => array(
                'type' => 'string',
                'default' => ''
            ),
            'reviewTextAlign' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'starAlign' => array(
                'type' => 'string',
                'default' => 'left'
            )
        )
    ),
    'ub/styled-box' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'mode' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title' => array(
                'type' => 'array',
                'default' => array(''),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'titleAlign' => array(
                'type' => 'array',
                'default' => array('center'),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'text' => array(
                'type' => 'array',
                'default' => array(''),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'textAlign' => array(
                'type' => 'array',
                'default' => array('left'),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'number' => array(
                'type' => 'array',
                'default' => array(''),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'image' => array(
                'type' => 'array',
                'default' => array(
                    array(
                        'id' => null,
                        'alt' => null,
                        'url' => null
                    )
                )
            ),
            'foreColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'backColor' => array(
                'type' => 'string',
                'default' => '#CCCCCC'
            ),
            'outlineColor' => array(
                'type' => 'string',
                'default' => '#000000'
            )
        )
    ),
    'ub/styled-list' => array(
        'attributes' => array(
            'alignment' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'list' => array(
                'type' => 'text',
                'default' => '<li>Item 1</li><li>Item 2</li><li>Item 3</li>'
            ),
            'listItem' => array(
                'type' => 'array',
                'default' => array_fill(0, 3,
                    array(
                        'text' => '',
                        'selectedIcon' => 'check',
                        'indent' => 0
                    )
                )
            ),
            'selectedIcon' => array(
                'type' => 'string',
                'default' => 'check'
            ),
            'iconColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'iconSize' => array(
                'type' => 'number',
                'default' => 5
            )
        )
    ),
    'ub/tabbed-content-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'activeTab' => array(
                'type' => 'number',
                'default' => 0
            ),
            'theme' => array(
                'type' => 'string',
                'default' => '#eeeeee'
            ),
            'titleColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'tabsAlignment' => array(
                'type' => 'string',
                'default'=> 'left'
            ),
            'tabsTitle' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'tabsTitleAlignment' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'tabVertical' => array(
                'type' => 'boolean',
                'default' => false
            )
        )
    ),
    'ub/table-of-contents-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            'allowedHeaders' => array(
                'type' => 'array',
                'default' => array_fill(0, 6, true), 
                'items' => array(
                    'type' => 'boolean'
                )
            ),
            'links' => array(
                'type' => 'string',
                'default' => ''
            ),
            'allowToCHiding' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'showList' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'numColumns' => array(
                'type' => 'number',
                'default' => 1
            ),
            'listStyle' => array(
                'type' => 'string',
                'default' => 'bulleted'
            ),
            'enableSmoothScroll' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'titleAlignment' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'gaps' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'number'
                )
            )
        )
    ),
    'ub/testimonial' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ub_testimonial_text' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textAlign' => array(
                'type' => 'string',
                'default' => 'justify'
            ),
            'ub_testimonial_author' => array(
                'type' => 'string',
                'default' => ''
            ),
            'authorAlign' => array(
                'type' => 'string',
                'default' => 'right'
            ),
            'ub_testimonial_author_role' => array(
                'type' => 'string',
                'default' => ''
            ),
            'authorRoleAlign' => array(
                'type' => 'string',
                'default' => 'right'
            ),
            'imgURL' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imgID' => array(
                'type' => 'number',
                'default' => 0
            ),
            'imgAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'backgroundColor' => array(
                'type' => 'string',
                'default' => '#f4f6f6'
            ),
            'textColor' => array(
                'type' => 'string',
                'default' => '#444444'
            ),
            'textSize' => array(
                'type' => 'number',
                'default' => 17
            )
        )
    ),
    'ub/post-grid' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'categories' => array(
                'type' => 'string',
            ),
            'className' => array(
                'type' => 'string',
            ),
            'amountPosts' => array(
                'type'    => 'number',
                'default' => 6,
            ),
            'checkPostDate' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'checkPostExcerpt' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'checkPostAuthor' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'checkPostImage'    => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'checkPostLink' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'checkPostTitle' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'postLayout' => array(
                'type'    => 'string',
                'default' => 'grid',
            ),
            'columns' => array(
                'type'    => 'number',
                'default' => 2,
            ),
            'width' => array(
                'type'    => 'string',
                'default' => 'wide',
            ),
            'order' => array(
                'type'    => 'string',
                'default' => 'desc',
            ),
            'orderBy' => array(
                'type'    => 'string',
                'default' => 'date',
            ),
            'readMoreText' => array(
                'type'    => 'string',
                'default' => 'Continue Reading',
            ),
            'offset' => array(
                'type'    => 'number',
                'default' => 0,
            ),
            'excerptLength' => array(
                'type'    => 'number',
                'default' => 55,
            ),
            'postType' => array(
                'type'    => 'string',
                'default' => 'post',
            ),
        )
    )
);