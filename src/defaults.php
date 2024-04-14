<?php

$defaultValues = array(
	'ub/advanced-heading'           => array(
		'attributes' => array(
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'anchor'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'content'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'level'            => array(
				'type'    => 'string',
				'default' => 'h1'
			),
			'alignment'        => array(
				'type'    => 'string',
				'default' => 'none'
			),
			'textColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'backgroundColor'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'fontSize'         => array(
				'type'    => 'number',
				'default' => 0
			),
			'letterSpacing'    => array(
				'type'    => 'number',
				'default' => 0,
			),
			'textTransform'    => array(
				'type'    => 'string',
				'default' => 'None',
			),
			'fontFamily'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'fontWeight'       => array(
				'type'    => 'string',
				'default' => 'Normal',
			),
			'lineHeight'       => array(
				'type'    => 'number',
				'default' => 0
			),
			'highlightBgColor' => array(
				'type'    => 'string',
				'default' => 'None',
			),
			'padding' => array(
				'type'    => 'array',
				'default' => array(),
			),
			'margin' => array(
				'type'    => 'array',
				'default' => array(),
			),
		)
	),
	'ub/advanced-video'             => array(
		'attributes' => array(
			'blockID'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'border'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'borderRadius'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'margin'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'aspectRatio'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'videoId'              => array(
				'type'    => 'number',
				'default' => - 1,
			),
			'videoSource'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'url'                  => array(
				'type'    => 'string',
				'default' => '',
			),
			'playerStyle'          => array(
				//custom border styles placed outside embedded player
				'type'    => 'string',
				'default' => '',
			),
			'vimeoShowDetails'     => array(
				//vimeo only
				'type'    => 'boolean',
				'default' => true,
			),
			'vimeoShowLogo'        => array(
				//vimeo only
				'type'    => 'boolean',
				'default' => true,
			),
			'enableYoutubeCookies' => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'autoplay'             => array(
				//applies to: videopress, vimeo, dailymotion, youtube
				'type'    => 'boolean',
				'default' => false,
			),
			'loop'                 => array(
				//applies to youtube, vimeo, videopress
				'type'    => 'boolean',
				'default' => false,
			),
			'mute'                 => array(
				//applies to youtube, dailymotion, vimeo
				'type'    => 'boolean',
				'default' => false,
			),
			'showPlayerControls'   => array(
				//applies to dailymotion, youtube
				'type'    => 'boolean',
				'default' => true,
			),
			'playInline'           => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'thumbnail'            => array(
				//replaces embed code, click through thumbnail before seeing embedded player in youtube
				'type'    => 'string',
				'default' => '',
			),
			'videoEmbedCode'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'startTime'            => array(
				//applies to youtube, dailymotion, videopress, vimeo
				'type'    => 'number',
				'default' => 0,
			),
			'height'               => array(
				'type'    => 'number',
				'default' => 370,
			),
			'width'                => array(
				'type'    => 'number',
				'default' => 100,
			),
			'origHeight'           => array(
				'type'    => 'number',
				'default' => 0,
			),
			'origWidth'            => array(
				'type'    => 'number',
				'default' => 0,
			),
			'autofit'              => array(
				'type'    => 'boolean',
				'default' => true,
			),

			//begin border attributes for each side
			'topBorderSize'        => array(
				'type'    => 'number',
				'default' => 0
			),
			'rightBorderSize'      => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomBorderSize'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'leftBorderSize'       => array(
				'type'    => 'number',
				'default' => 0
			),

			'topBorderStyle'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'rightBorderStyle'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'bottomBorderStyle' => array(
				'type'    => 'string',
				'default' => ''
			),
			'leftBorderStyle'   => array(
				'type'    => 'string',
				'default' => ''
			),

			'topBorderColor'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'rightBorderColor'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'bottomBorderColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'leftBorderColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			//end border attributes for each side

			//begin corner attributes
			'topLeftRadius'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'topRightRadius'    => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomLeftRadius'  => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomRightRadius' => array(
				'type'    => 'number',
				'default' => 0
			),
			//end corner attributes

			'showInDesktop' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'showInTablet'  => array(
				'type'    => 'boolean',
				'default' => true
			),
			'showInMobile'  => array(
				'type'    => 'boolean',
				'default' => true
			),
			'channelId'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'shadow'	   => array(
				'type'	=> 'array',
				'default' => array(
					array(
						"angle" => 0,
						"radius" => 0,
						"color" => "#000000",
						"transparency" => 0,
						"blur" => 0,
						"spread" => 0
					)
				)
			)
		)
	),
	'ub/button'                     => array(
		'attributes' => array(
			'blockID'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'placeholder'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'buttonText'           => array(
				'type'    => 'string',
				'default' => 'Button Text'
			),
			'orientation'              => array(
				'type'    => 'string',
				'default' => 'row',
			),
			'align'                => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'url'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'size'                 => array(
				'type'    => 'string',
				'default' => 'medium'
			),
			'buttonColor'          => array(
				'type'    => 'string',
				'default' => '#313131'
			),
			'buttonHoverColor'     => array(
				'type'    => 'string',
				'default' => '#313131'
			),
			'buttonTextColor'      => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'buttonTextHoverColor' => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'isFlexWrap'        => array(
				'type'    => 'boolean',
				'default' => true
			),
			'buttonRounded'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'chosenIcon'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'iconPosition'         => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'buttonIsTransparent'  => array(
				'type'    => 'boolean',
				'default' => false
			),
			'addNofollow'          => array(
				'type'    => 'boolean',
				'default' => false
			),
			'openInNewTab'         => array(
				'type'    => 'boolean',
				'default' => true
			),
			'buttonWidth'          => array(
				'type'    => 'string',
				'default' => 'fixed'
			),
			'buttons'			   => array(
				'type'	=> 'array',
				'default' => array()
			),
		)
	),
	'ub/call-to-action-block'       => array(
		'attributes' => array(
			'blockID'                         => array(
				'type'    => 'string',
				'default' => ''
			),
			'margin'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'padding'              => array(
				'type'    => 'array',
				'default' => array()
			),
			'ub_call_to_action_headline_text' => array(
				'type'    => 'string',
				'default' => ''
			),
			'ub_cta_content_text'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'ub_cta_button_text'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'headFontSize'                    => array(
				'type'    => 'number',
				'default' => 30
			),
			'headColor'                       => array(
				'type'    => 'string',
				'default' => ''
			),
			'headAlign'                       => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'contentFontSize'                 => array(
				'type'    => 'number',
				'default' => 15
			),
			'contentColor'                    => array(
				'type'    => 'string',
				'default' => ''
			),
			'buttonFontSize'                  => array(
				'type'    => 'number',
				'default' => 14
			),
			'buttonColor'                     => array(
				'type'    => 'string',
				'default' => '#E27330'
			),
			'buttonTextColor'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'buttonWidth'                     => array(
				'type'    => 'number',
				'default' => 250
			),
			'ctaBackgroundColor'              => array(
				'type'    => 'string',
				'default' => '#f8f8f8'
			),
			'ctaBorderColor'                  => array(
				'type'    => 'string',
				'default' => '#ECECEC'
			),
			'ctaBorderSize'                   => array(
				'type'    => 'number',
				'default' => 2
			),
			'url'                             => array(
				'type'    => 'string',
				'default' => ''
			),
			'contentAlign'                    => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'addNofollow'                     => array(
				'type'    => 'boolean',
				'default' => false
			),
			'openInNewTab'                    => array(
				'type'    => 'boolean',
				'default' => false
			),
			'linkIsSponsored'                 => array(
				'type'    => 'boolean',
				'default' => false
			),
			'useHeadingTag'                   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'selectedHeadingTag'              => array(
				'type'    => 'string',
				'default' => 'h2'
			)
		)
	),
	'ub/click-to-tweet'             => array(
		'attributes' => array(
			'blockID'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'ubTweet'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'tweetFontSize' => array(
				'type'    => 'number',
				'default' => 20
			),
			'tweetColor'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'borderColor'   => array(
				'type'    => 'string',
				'default' => '#CCCCCC'
			),
			'padding'   => array(
				'type'    => 'array',
				'default' => array()
			),
			'margin'   => array(
				'type'    => 'array',
				'default' => array()
			),
		)
	),
	'ub/content-filter-block'       => array(
		'attributes' => array(
			'blockID'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'filterButtonAlignment' => array(
				'type'    => 'string',
				'default' => ''
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'filterArray' => array(
				'type' => 'array',
				'default' => array()
			),
			'buttonColor'           => array(
				'type'    => 'string',
				'default' => '#eeeeee'
			),
			'buttonTextColor'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'activeButtonColor'     => array(
				'type'    => 'string',
				'default' => '#fcb900'
			),
			'activeButtonTextColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'initiallyShowAll'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'matchingOption'        => array(
				'type'    => 'string',
				'default' => ''
			)
		)
	),
	'ub/content-toggle-block'       => array(
		'attributes' => array(
			'blockID'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'hasFAQSchema'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'theme'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'collapsed'         => array(
				'type'    => 'boolean',
				'default' => false
			),
			'collapsedOnMobile' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'titleColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'titleLinkColor'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'preventCollapse'   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'showOnlyOne'       => array(
				'type'    => 'boolean',
				'default' => false
			)
		)
	),
	'ub/content-toggle-panel-block' => array(
		'attributes' => array(
			'index'           => array(
				'type'    => 'number',
				'default' => 0
			),
			'parentID'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'defaultOpen'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'theme'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'collapsed'       => array(
				'type'    => 'boolean',
				'default' => false
			),
			'titleColor'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'titleLinkColor'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'panelTitle'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'titleTag'        => array(
				'type'    => 'string',
				'default' => 'p'
			),
			'preventCollapse' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'toggleLocation'  => array(
				'type'    => 'string',
				'default' => 'right'
			),
			'toggleColor'     => array(
				'type'    => 'string',
				'default' => '#000000'
			),
			'toggleIcon'      => array(
				'type'    => 'string',
				'default' => 'chevron'
			),
			'toggleID'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'useToggleInToC'  => array(
				'type'    => 'boolean',
				'default' => false
			),
			'border'          => array(
				'type'    => 'boolean',
				'default' => true
			),
			'showOnlyOne'     => array(
				'type'    => 'boolean',
				'default' => false
			),
			'newBlockPosition' => array(
				'type'    => 'string',
				'default' => 'none'
			)
		)
	),
	'ub/countdown'                  => array(
		'attributes' => array(
			'blockID'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'endDate'       => array(
				'type'    => 'number',
				'default' => 1728565920
			),
			'style'         => array(
				'type'    => 'string',
				'default' => 'Odometer'
			),
			'expiryMessage' => array(
				'type'    => 'string',
				'default' => 'Timer expired'
			),
			'messageAlign'  => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'circleColor'   => array(
				'type'    => 'string',
				'default' => '#2DB7F5'
			),
			'countdownColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'unitColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'circleSize'    => array(
				'type'    => 'number',
				'default' => 70
			),
			'largestUnit'   => array(
				'type'    => 'string',
				'default' => 'week'
			),
			'smallestUnit'  => array(
				'type'    => 'string',
				'default' => 'second'
			),
			'padding'  => array(
				'type'    => 'array',
				'default' => array()
			),
			'margin'  => array(
				'type'    => 'array',
				'default' => array()
			)
		)
	),
	'ub/divider'                    => array(
		'attributes' => array(
			'lineHeight'      => array(
				'type'    => 'string',
				'default' => '300px'
			),
			'orientation'      => array(
				'type'    => 'string',
				'default' => 'horizontal'
			),
			'blockID'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'borderSize'   => array(
				'type'    => 'number',
				'default' => 2
			),
			'borderStyle'  => array(
				'type'    => 'string',
				'default' => 'solid'
			),
			'borderColor'  => array(
				'type'    => 'string',
				'default' => '#ccc'
			),
			'borderHeight' => array(
				'type'    => 'number',
				'default' => 2
			),
			'width'        => array(
				'type'    => 'number',
				'default' => 100
			),
			'alignment'    => array(
				'type'    => 'string',
				'default' => 'center'
			)
		)
	),
	'ub/expand'                     => array(
		'attributes' => array(
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'initialShow'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'toggleAlign'      => array(
				'type'    => 'string',
				'default' => 'left'
			),
			  'expandButtonColor' => array(
				  'type' => "string", 
				  'default' => "",				
			  ),
			'expandButtonBgColor' => array(
				'type' => "string", 
				'default' => "" ,
			) ,
			'expandButtonBgGradient' => array(
				'type' => "string", 
				'default' => "" ,
			) ,
			'expandButtonPadding' => array(
				'type' => "array", 
				'default' => array(
					'top' => "8px",
					'right' => "30px",
					'bottom' => "8px",
					'left' => "30px",
				),
			) ,
			'expandButtonBorder' => array(
				'type' => "array", 
				'default' => array() ,
			) ,
			'expandButtonBorderRadius' => array(
				'type' => "array",
				'default' => array(
					'topLeft' => "100px",
					'topRight' => "100px",
					'bottomLeft' => "100px",
					'bottomRight' => "100px",
				),
			),
			'allowScroll'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'scrollOption'     => array(
				'type'    => 'string',
				'default' => 'auto' //other options: namedelement, fixedamount, off
			),
			'scrollOffset'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'scrollTarget'     => array(
				'type'    => 'string',
				'default' => ''
			),
			'scrollTargetType' => array(
				'type'    => 'string',
				'default' => 'id' //other types: class, element
			)
		)
	),
	'ub/expand-portion'             => array(
		'attributes' => array(
			'clickText'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'displayType' => array(
				'type'    => 'string',
				'default' => ''
			),
			'isVisible'   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'toggleAlign'   => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'parentID'    => array(
				'type'    => 'string',
				'default' => ''
			)
		)
	),
	'ub/feature-box-block'          => array(
		'attributes' => array(
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'column'           => array(
				'type'    => 'string',
				'default' => '2'
			),
			'columnOneTitle'   => array(
				'type'    => 'string',
				'default' => 'Title One'
			),
			'title1Align'      => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnTwoTitle'   => array(
				'type'    => 'string',
				'default' => 'Title Two'
			),
			'title2Align'      => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnThreeTitle' => array(
				'type'    => 'string',
				'default' => 'Title Three'
			),
			'title3Align'      => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnOneBody'    => array(
				'type'    => 'string',
				'default' => 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
			),
			'body1Align'       => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'columnTwoBody'    => array(
				'type'    => 'string',
				'default' => 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
			),
			'body2Align'       => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'columnThreeBody'  => array(
				'type'    => 'string',
				'default' => 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
			),
			'body3Align'       => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'imgOneURL'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgOneID'         => array(
				'type'    => 'number',
				'default' => - 1
			),
			'imgOneAlt'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgTwoURL'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgTwoID'         => array(
				'type'    => 'number',
				'default' => - 1
			),
			'imgTwoAlt'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgThreeURL'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgThreeID'       => array(
				'type'    => 'number',
				'default' => - 1
			),
			'imgThreeAlt'      => array(
				'type'    => 'string',
				'default' => ''
			)
		)
	),
	'ub/how-to'                     => array(
		'attributes' => array(
			'blockID'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'title'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'introduction'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'advancedMode'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'includeToolsList'    => array(
				'type'    => 'boolean',
				'default' => false
			),
			'addToolImages'       => array(
				'type'    => 'boolean',
				'default' => false
			),
			'toolsIntro'          => array(
				'type'    => 'string',
				'default' => __( 'Required tools' )
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'tools' => array(
				'type' => 'array',
				'default' => array(),
			),
			'toolsListStyle'      => array(
				'type'    => 'string',
				'default' => 'none'
			),
			'addSupplyImages'     => array(
				'type'    => 'boolean',
				'default' => false
			),
			'includeSuppliesList' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'suppliesIntro'       => array(
				'type'    => 'string',
				'default' => __( 'Required supplies' )
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'supplies' => array(
				'type' => 'array',
				'default' => array(),
			),
			'suppliesListStyle'   => array(
				'type'    => 'string',
				'default' => 'none'
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'section' => array(
				'type' => 'array',
				'default' => array(
					array(
						'sectionName' => '',
						'steps' => array()
					)
				)
			),
			'sectionListStyle'    => array(
				'type'    => 'string',
				'default' => 'none'
			),
			'timeIntro'           => array(
				'type'    => 'string',
				'default' => __( 'Duration' )
			),
			'totalTime'           => array(
				'type'    => 'array',
				'default' => array_fill( 0, 7, 0 ),
				'items'   => array(
					'type' => 'number'
				)
			),
			'totalTimeText'       => array(
				'type'    => 'string',
				'default' => __( 'Total time: ' )
			),
			'cost'                => array(
				'type'    => 'number',
				'default' => 0
			),
			'costCurrency'        => array(
				'type'    => 'string',
				'default' => 'USD'
			),
			'costDisplayText'     => array(
				'type'    => 'string',
				'default' => __( 'Total cost: ' )
			),
			'showUnitFirst'       => array(
				'type'    => 'boolean',
				'default' => true
			),
			'howToYield'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoURL'            => array(
				'type'    => 'string', //videoobject
				'default' => '' //url
			),
			'videoThumbnailURL'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoName'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoDescription'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoUploadDate'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'videoEmbedCode'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoDuration'       => array(
				'type'    => 'number',
				'default' => 0
			),
			'useSections'         => array(
				'type'    => 'boolean',
				'default' => false
			),
			'resultIntro'         => array(
				'type'    => 'string',
				'default' => __( 'Result' )
			),
			'finalImageID'        => array(
				'type'    => 'number',
				'default' => - 1
			),
			'finalImageAlt'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'finalImageURL'       => array(
				'type'    => 'string',
				'default' => ''
			),
			'finalImageCaption'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'finalImageWidth'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'finalImageFloat'     => array(
				'type'    => 'string',
				'default' => 'none'
			),
			'firstLevelTag'       => array(
				'type'    => 'string',
				'default' => 'h2',
			),
			'secondLevelTag'      => array(
				'type'    => 'string',
				'default' => 'h3',
			),
			'thirdLevelTag'       => array(
				'type'    => 'string',
				'default' => 'h4',
			),
		)
	),
	'ub/image-slider'               => array(
		'attributes' => array(
			'align'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			//retained for reverse compatibility
			'images'           => array(
				'type'    => 'string',
				'default' => '[]'
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'pics' => array(
				'type' => 'array',
				'default' => array()
			),
			//retained for reverse compatibility
			'captions'         => array(
				'type'    => 'string',
				'default' => '[]'
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
			'descriptions' => array(
				'type' => 'array',
				'default' => array()
			),
			'wrapsAround'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'isDraggable'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'autoplays'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'autoplayDuration' => array(
				'type'    => 'number',
				'default' => 3
			),
			'spaceBetween' => array(
				'type'    => 'number',
				'default' => 20
			),
			'slidesPerView' => array(
				'type'    => 'number',
				'default' => 1
			),
			'sliderHeight'     => array(
				'type'    => 'number',
				'default' => 250
			),
			'showPageDots'     => array(
				'type'    => 'boolean',
				'default' => true
			),
			'useNavigation'    => array(
				'type'    => 'boolean',
				'default' => true
			),
			'usePagination'    => array(
				'type'    => 'boolean',
				'default' => true
			),
			'paginationType'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'transition'       => array(
				'type'    => 'string',
				'default' => 'slide'
			),
			//for cube, coverflow and flip
			'slideShadows'     => array(
				'type'    => 'boolean',
				'default' => true
			),
			//exclusive for coverflow
			'rotate'           => array(
				'type'    => 'number',
				'default' => 50 //degrees
			),
			'stretch'          => array(
				'type'    => 'number',
				'default' => 0 //pixels
			),
			'depth'            => array(
				'type'    => 'number',
				'default' => 100 //pixels, z-axis
			),
			'modifier'         => array(
				'type'    => 'number',
				'default' => 1 //effect multiplier
			),
			//exclusive for flip
			'limitRotation'    => array(
				'type'    => 'boolean',
				'default' => true
			),
			//exclusive for cube
			'shadow'           => array(
				'type'    => 'boolean',
				'default' => true
			),
			'shadowOffset'     => array(
				'type'    => 'number',
				'default' => 20
			),
			'shadowScale'      => array(
				'type'    => 'number',
				'default' => 0.94
			)
		)
	),
	'ub/notification-box-block'     => array(
		'attributes' => array(
			'blockID'            => array(
				'type'    => 'string',
				'default' => ''
			),
			'ub_selected_notify' => array(
				'type'    => 'string',
				'default' => 'ub_notify_info'
			),
			'ub_notify_info'     => array(
				'type'    => 'string',
				'default' => ''
			),
			'align'              => array(
				'type'    => 'string',
				'default' => 'left'
			)
		)
	),
	'ub/number-box-block'           => array(
		'attributes' => array(
			'blockID'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'column'            => array(
				'type'    => 'string',
				'default' => '2'
			),
			'columnOneNumber'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'columnOneTitle'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'title1Align'       => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnTwoNumber'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'columnTwoTitle'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'title2Align'       => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnThreeNumber' => array(
				'type'    => 'string',
				'default' => ''
			),
			'columnThreeTitle'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'title3Align'       => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'columnOneBody'     => array(
				'type'    => 'string',
				'default' => ''
			),
			'body1Align'        => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'columnTwoBody'     => array(
				'type'    => 'string',
				'default' => ''
			),
			'body2Align'        => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'columnThreeBody'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'body3Align'        => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'numberBackground'  => array(
				'type'    => 'string',
				'default' => '#CCCCCC'
			),
			'numberColor'       => array(
				'type'    => 'string',
				'default' => '#000000'
			),
			'borderColor'       => array(
				'type'    => 'string',
				'default' => '#CCCCCC'
			)
		)
	),
	'ub/post-grid'                  => array(
		'attributes' => array(
			'rowGap'                      => array(
				'type'    => 'string',
				'default' => '32px'
			),
			'columnGap'                      => array(
				'type'    => 'string',
				'default' => '32px'
			),
			'blockID'                      => array(
				'type'    => 'string',
				'default' => ''
			),
			'postType' => array(
				'type'    => 'string',
				'default' => 'post'
			),
			'paginationAlignment' => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'paginationColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'paginationBackground' => array(
				'type'    => 'string',
				'default' => ''
			),
			'paginationGradient' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationBackground' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationGradient' => array(
				'type'    => 'string',
				'default' => ''
			),
			'isEqualHeight' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'pagination' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'contentPadding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'postPadding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'linkPadding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'postTitleColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'authorColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'dateColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'excerptColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundGradientHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundGradientHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postTitleColor' => array(
				'type' => 'string',
				'default' => null
			),
			'authorColor' => array(
				'type' => 'string',
				'default' => null
			),
			'dateColor' => array(
				'type' => 'string',
				'default' => null
			),
			'excerptColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundColor' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'postBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'linkBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'imageBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'wrapAlignment'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'categories'                   => array(
				'type'    => 'string',
				'default' => ''
			),
			'categoryArray'                => array(
				'type'    => 'array',
				'default' => [],
			),
			'excludedCategories'		   => array(
				'type' => 'array',
				'default' => [],
			),
			'className'                    => array(
				'type'    => 'string',
				'default' => ''
			),
			'amountPosts'                  => array(
				'type'    => 'number',
				'default' => 6,
			),
			'checkPostDate'                => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostExcerpt'             => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostAuthor'              => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostImage'               => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'postImageWidth'               => array(
				'type'    => 'number',
				'default' => 600,
			),
			'preservePostImageAspectRatio' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'postImageHeight'              => array(
				'type'    => 'number',
				'default' => 400
			),
			'checkPostLink'                => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostTitle'               => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'postLayout'                   => array(
				'type'    => 'string',
				'default' => 'grid',
			),
			'columns'                      => array(
				'type'    => 'number',
				'default' => 2,
			),
			'width'                        => array(
				'type'    => 'string',
				'default' => 'wide',
			),
			'order'                        => array(
				'type'    => 'string',
				'default' => 'desc',
			),
			'orderBy'                      => array(
				'type'    => 'string',
				'default' => 'date',
			),
			'readMoreText'                 => array(
				'type'    => 'string',
				'default' => 'Continue Reading',
			),
			'offset'                       => array(
				'type'    => 'number',
				'default' => 0,
			),
			'excerptLength'                => array(
				'type'    => 'number',
				'default' => 55,
			),
			'postTitleTag'                 => array(
				'type'    => 'string',
				'default' => 'h2'
			),
			'tagArray'                     => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'number'
				)
			),
			'authorArray'                  => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'number'
				)
			)
		)
	),
	'ub/progress-bar'               => array(
		'attributes' => array(
			'blockID'            => array(
				'type'    => 'string',
				'default' => ''
			),
			'numberPrefix'            => array(
				'type'    => 'string',
				'default' => ''
			),
			'numberSuffix'            => array(
				'type'    => 'string',
				'default' => '%'
			),
			'showNumber'            => array(
				'type'    => 'boolean',
				'default' => true
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'percentage'         => array(
				'type'    => 'number',
				'default' => - 1
			),
			'barType'            => array(
				'type'    => 'string',
				'default' => 'linear'
			),
			'detail'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'detailAlign'        => array(
				'type'    => 'string',
				'default' => 'center'
			),
			'barColor'           => array(
				'type'    => 'string',
				'default' => '#2db7f5'
			),
			'barBackgroundColor' => array(
				'type'    => 'string',
				'default' => '#d9d9d9'
			),
			'barThickness'       => array(
				'type'    => 'number',
				'default' => 1
			),
			'circleSize'         => array(
				'type'    => 'number',
				'default' => 150
			),
			'labelColor'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'percentagePosition' => array(
				'type'    => 'string',
				'default' => 'bottom'
			),
			'isStripe'         	 => array(
				'type'    => 'boolean',
				'default' => false
			),
			'isCircleRounded'    => array(
				'type'    => 'boolean',
				'default' => true
			)
		)
	),
	'ub/review'                     => array(
		'attributes' => array(
			'ID'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'blockID'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'authorName'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemName'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemPage'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemType'                => array(
				'type'    => 'string',
				'default' => 'Product'
			),
			'itemSubtype'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemSubsubtype'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'valueType'               => array(
				'type'    => 'string',
				'default' => 'star'
			),
			'description'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'enableDescription'       => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'descriptionAlign'        => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'imgPosition'             => array(
				'type'    => 'string',
				'default' => 'right'
			),
			'imgURL'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgID'                   => array(
				'type'    => 'number',
				'default' => - 1
			),
			'imgAlt'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'enableImage'             => array(
				'type'    => 'boolean',
				'default' => false
			),
			'items'                   => array(
				'type'    => 'string',
				'default' => '[{"label": "", "value": 0}]'
			),
			'starCount'               => array(
				'type'    => 'number',
				'default' => 5
			),
			'useSummary'              => array(
				'type'    => 'boolean',
				'default' => true
			),
			'summaryTitle'            => array(
				'type'    => 'string',
				'default' => 'Summary'
			),
			'summaryDescription'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionText'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionFontSize'    => array(
				'type'    => 'number',
				'default' => 0
			),
			'callToActionURL'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionBackColor'   => array(
				'type'    => 'string',
				'default' => '#e11b4c'
			),
			'callToActionBorderColor' => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'callToActionForeColor'   => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'inactiveStarColor'       => array(
				'type'    => 'string',
				'default' => '#888888'
			),
			'activeStarColor'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePercentBarColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'percentBarColor'         => array(
				'type'    => 'string',
				'default' => ''
			),
			//retained for backwards compatibility
			'selectedStarColor'       => array(
				'type'    => 'string',
				'default' => '#ffff00'
			),
			'titleAlign'              => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'authorAlign'             => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'enableCTA'               => array(
				'type'    => 'boolean',
				'default' => true
			),
			'ctaNoFollow'             => array(
				'type'    => 'boolean',
				'default' => true
			),
			'parts'             	=> array(
				'type'    => 'array',
				'default' => array(
					array (
						'label' => '',
						'value' => 0
					)
				)
			),
			'ctaOpenInNewTab'         => array(
				'type'    => 'boolean',
				'default' => true
			),
			'ctaIsSponsored'          => array(
				'type'    => 'boolean',
				'default' => false
			),
			'ctaAlignment'            => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'enableReviewSchema'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'starOutlineColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imageSize'               => array(
				'type'    => 'number',
				'default' => 100
			),
			'brand'                   => array(
				'type'    => 'string',
				'default' => ''
			),
			'sku'                     => array(
				'type'    => 'string',
				'default' => ''
			),
			'identifier'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'identifierType'          => array(
				'type'    => 'string',
				'default' => 'gtin'
			),
			'offerType'               => array(
				'type'    => 'string',
				'default' => 'Offer'
			),
			'offerStatus'             => array(
				'type'    => 'string',
				'default' => 'InStock'
			),
			'offerHighPrice'          => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerLowPrice'           => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerCount'              => array(
				'type'    => 'number',
				'default' => 1
			),
			'offerPrice'              => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerCurrency'           => array(
				'type'    => 'string',
				'default' => 'USD'
			),
			'offerExpiry'             => array(
				'type'    => 'number',
				'default' => 0
			),
			//BEGIN SOFTWAREAPPLICATION ATTRIBUTES
			'appCategory'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'operatingSystem'         => array(
				'type'    => 'string',
				'default' => ''
			),
			//END SOFTWAREAPPLICATION ATTRIBUTES
			'servesCuisine'           => array( //FOR FOODESTABLISHMENT AND SUBTYPES ONLY
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'string'
				)
			),
			//BEGIN LOCALBUSINESS/ORGANIZATION ATTRIIBUTES
			'telephone'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'addressName'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'address'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'priceRange'              => array(
				'type'    => 'string',
				'default' => ''
			),
			//END LOCALBUSINESS/ORGANIZATION ATTRIBUTES
			//BEGIN BOOK ATTRIBUTES
			'bookAuthorName'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'isbn'                    => array(
				'type'    => 'string',
				'default' => ''
			),
			'reviewPublisher'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'publicationDate'         => array(
				'type'    => 'number',
				'default' => time()
			),
			//END BOOK ATTRIBUTES
			//BEGIN EVENT ATTRIBUTES
			'eventStartDate'          => array(
				'type'    => 'number',
				'default' => time() + 86400
			),
			'eventEndDate'            => array(
				'type'    => 'number',
				'default' => 0
			),
			'usePhysicalAddress'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'eventPage'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'organizer'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'performer'               => array(
				'type'    => 'string',
				'default' => ''
			),
			//END EVENT ATTRIBUTES
			//BEGIN VIDEO OBJECT ATTRIBUTES
			'videoUploadDate'         => array(
				'type'    => 'number',
				'default' => time()
			),
			'videoURL'                => array(
				'type'    => 'string',
				'default' => ''
			)
			//END VIDEO OBJECT ATTRIBUTES
		)
	),
	'ub/social-share'               => array(
		'attributes' => array(
			'blockID'            => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'showFacebookIcon'   => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'facebookCaption'    => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'showTwitterIcon'    => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'twitterCaption'     => array(
				'type'    => 'string',
				'default' => 'tweet'
			),
			'showLinkedInIcon'   => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'linkedInCaption'    => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'showPinterestIcon'  => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'pinterestCaption'   => array(
				'type'    => 'string',
				'default' => 'pin'
			),
			'showRedditIcon'     => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'redditCaption'      => array(
				'type'    => 'string',
				'default' => 'post'
			),
			'showGooglePlusIcon' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'showTumblrIcon'     => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'tumblrCaption'      => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'iconSize'           => array(
				'type'    => 'string',
				'default' => 'normal',
			),
			'iconShape'          => array(
				'type'    => 'string',
				'default' => 'none',
			),
			'align'              => array(
				'type'    => 'string',
				'default' => 'left',
			),
			'orientation'              => array(
				'type'    => 'string',
				'default' => 'row',
			),
			'iconOrder'          => array(
				'type'    => 'array',
				'default' => array( 'facebook', 'twitter', 'linkedin', 'pinterest', 'reddit', 'tumblr' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'buttonColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'useCaptions'        => array(
				'type'    => 'boolean',
				'default' => true
			),
			'addOutline'         => array(
				'type'    => 'boolean',
				'default' => true
			)
		)
	),
	'ub/star-rating-block'          => array(
		'attributes' => array(
			'textFontSize'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'blockID'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'starCount'       => array(
				'type'    => 'number',
				'default' => 5
			),
			'starSize'        => array(
				'type'    => 'number',
				'default' => 20
			),
			'starColor'       => array(
				'type'    => 'string',
				'default' => '#ffff00'
			),
			'selectedStars'   => array(
				'type'    => 'number',
				'default' => 0
			),
			'reviewText'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'reviewTextAlign' => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'reviewTextColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'isShowReviewText' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'starAlign'       => array(
				'type'    => 'string',
				'default' => 'left'
			)
		)
	),
	'ub/styled-box'                 => array(
		'attributes' => array(
			'blockID'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'mode'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'title'                 => array(
				'type'    => 'array',
				'default' => array( '' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'titleAlign'            => array(
				'type'    => 'array',
				'default' => array( 'center' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'text'                  => array(
				'type'    => 'array',
				'default' => array( '' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'textAlign'             => array(
				'type'    => 'array',
				'default' => array( 'left' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'number'                => array(
				'type'    => 'array',
				'default' => array( '1', '2', '3' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			// UNCOMMENTED OUT, IN JS BLOCK GET UNDEFINED AND BREAK. 
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
			'boxColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'outlineColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'outlineStyle' => array(
				'type' => 'string',
				'default' => 'solid'
			),
			'outlineThickness' => array(
				'type' => 'number',
				'default' => 1
			),
			'outlineRoundingRadius' => array(
				'type' => 'number',
				'default' => 0
			),
			'outlineRadiusUnit' => array(
				'type' => 'string',
				'default' => 'percent'
			)
        	)
    ),
    'ub/styled-list' => array(
        'attributes' => array(
            'listAlignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => 'left'
            ),
		  'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'list' => array(
                'type' => 'string',
                'default' => '' //phased out, formerly <li>Item 1</li><li>Item 2</li><li>Item 3</li>'
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
            ),
            'fontSize' => array(
                'type' => 'number',
                'default' => 0
            ),
            'itemSpacing' => array(
                'type' => 'number',
                'default' => 0
            ),
            'columns' => array(
                'type' => 'number',
                'default' => 1
            ),
            'maxMobileColumns' => array(
                'type' => 'number',
                'default' => 2
            ),
            'isRootList' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'textColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'backgroundColor' => array(
                'type' => 'string',
                'default' => ''
            ),
        )
    ),
    'ub/styled-list-item' => array(
        'attributes' => array(
            'alignment' => array(
                'type' => 'string',
                'default' => 'left'
            ),
		  'padding' => array(
		  	'type' 	=> 'array',
		  	'default' => array()
		  	),
		  'margin' => array(
		  	'type' 	=> 'array',
		  	'default' => array()
		  ),
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'itemText' => array(
                'type' => 'string',
                'default' => ''
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
            ),
            'fontSize' => array(
                'type' => 'number',
                'default' => 0
            )
        )
    ),
    'ub/tab-block' => array(
        'attributes' => array(
            'index' => array(
                'type' => 'number',
                'default' => 0
            ),
            'isActive' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'parentID' => array(
                'type' => 'string',
                'default' => ''
            ),
        )
    ),
    'ub/tabbed-content-block' => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
            'contentColor' => array(
                'type' => 'string',
                'default' => null
            ),
            'contentBackground' => array(
                'type' => 'string',
                'default' => null
            ),
		  'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
            'activeTab' => array(
                'type' => 'number',
                'default' => 0
            ),
            'theme' => array(
                'type' => 'string',
                'default' => '#eeeeee'
            ),
            'normalColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'titleColor' => array(
                'type' => 'string',
                'default' => '' //should be empty
            ),
            'normalTitleColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#d3d3d3'
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
            'tabsAnchor' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'useAnchors' => array(
                'type' => 'boolean',
                'default' => false
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
            ),
            'tabletTabDisplay' => array(
                'type' => 'string',
                'default' => 'horizontaltab'
            ),
            'mobileTabDisplay' => array(
                'type' => 'string',
                'default' => 'horizontaltab'
            ),
            'tabStyle' => array(
                'type' => 'string',
                'default' => 'tabs'
            ),
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
		  'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
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
            'hideOnMobile' => array(
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
            ),
            'removeDiacritics' => array (
                'type' => 'boolean',
                'default' => false,
            ),
            'scrollOption' => array(
                'type' => 'string',
                'default' => 'auto' //other options: namedelement, fixedamount, off
            ),
            'scrollOffset' => array(
                'type' => 'number',
                'default' => 0
            ),
            'scrollTarget' => array(
                'type' => 'string',
                'default' => ''
            ),
            'scrollTargetType' => array(
                'type' => 'string',
                'default' => 'id' //other types: class, element
            ),
            'titleColor' => array(
                'type' => 'string',
                'default' => '',
            ),
            'titleBackgroundColor' => array(
                'type' => 'string',
                'default' => '',
            ),
            'listColor' => array(
                'type' => 'string',
                'default' => '',
            ),
            'listBackgroundColor' => array(
                'type' => 'string',
                'default' => '',
            ),
            'listIconColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'showText' => array(
                'type' => 'string',
                'default' => 'show'
            ),
            'hideText' => array(
                'type' => 'string',
                'default' => 'hide'
            ),
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
            'padding' => array(
                'type' => 'array',
                'default' => array()
            ),
            'margin' => array(
                'type' => 'array',
                'default' => array()
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
                'default' => ''
            ),
            'textSize' => array(
                'type' => 'number',
                'default' => 17
            )
        )
    ),
	'ub/icon-innerblock'            => [
		'attributes' => [
			'iconName' => [
				'type'    => 'string',
				'default' => ''
			],
			'size'     => [
				'type'    => 'number',
				'default' => 30
			]
		]
	],
	'ub/icon'            => array(
		'attributes' => array(
			'icon' => array(
				'type'    => 'array',
				'default' => array()
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'svgIcon'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'size'     => array(
				'type'    => 'string',
				'default' => "40px"
			),
			'iconColor' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'iconHoverColor' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'iconBackground' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'iconHoverBackground' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'iconGradientBackground' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'iconHoverGradientBackground' 	=> array(
				'type'		=> "string",
				'default'		=> null
			),
			'justification' 	=> array(
				'type'		=> "string",
				'default'		=> 'center'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default'	=> ''
			),
			'linkRel' => array(
				'type' => 'string',
				'default'	=> ''
			),
			'linkTarget' => array(
				'type' => 'string',
				'default'	=> ''
			),
			'iconRotation' => array(
				'type' => 'number',
				'default'	=> 0
			),
		)
		),
		'ub/counter'	 => array(
			'attributes' => array (
				'labelColor' => array(
					'type' => 'string',
					'default' => ''
				),
				'startNumber' => array(
					'type' => 'string',
					'default' => '0'
				),
				'endNumber' => array(
					'type' => 'string',
					'default' => '500'
				),
				'labelFontSize' => array(
					'type' => 'string',
					'default' => '16px'
				),
				'counterFontSize' => array(
					'type' => 'string',
					'default' => '48px'
				),
				'prefix' => array(
					'type' => 'string',
					'default' => ''
				),
				'suffix' => array(
					'type' => 'string',
					'default' => ''
				),
				'animationDuration' => array(
					'type' => 'number',
					'default' => 2
				),
				'alignment' => array(
					'type' => 'string',
					'default' => 'center'
				),
				'label' => array(
					'type' => 'string',
					'default' => ''
				),
				'labelPosition' => array(
					'type' => 'string',
					'default' => 'bottom'
				),
				'padding' => array(
					'type' 	=> 'array',
					'default' => array()
				),
				'margin' => array(
					'type' 	=> 'array',
					'default' => array()
				),
			)
		)
);
