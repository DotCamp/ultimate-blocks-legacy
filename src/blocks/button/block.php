<?php

/**
 * Enqueue frontend script for button block
 *
 * @return void
 */

function ub_faIconNameIsBrandname($name){
    $fabList = ["500px","accessible-icon","accusoft","acquisitions-incorporated","adn",
    "adobe","adversal","affiliatetheme","airbnb","algolia","alipay","amazon","amazon-pay",
    "amilia","android","angellist","angrycreative","angular","app-store","app-store-ios",
    "apper","apple","apple-pay","artstation","asymmetrik","atlassian","audible","autoprefixer",
    "avianex","aviato","aws","bandcamp","battle-net","behance","behance-square","bimobject",
    "bitbucket","bitcoin","bity","black-tie","blackberry","blogger","blogger-b","bluetooth",
    "bluetooth-b","bootstrap","btc","buffer","buromobelexperte","buysellads","canadian-maple-leaf",
    "cc-amazon-pay","cc-amex","cc-apple-pay","cc-diners-club","cc-discover","cc-jcb","cc-mastercard",
    "cc-paypal","cc-stripe","cc-visa","centercode","centos","chrome","chromecast","cloudscale",
    "cloudsmith","cloudversify","codepen","codiepie","confluence","connectdevelop","contao",
    "cpanel","creative-commons","creative-commons-by","creative-commons-nc",
    "creative-commons-nc-eu","creative-commons-nc-jp","creative-commons-nd","creative-commons-pd",
    "creative-commons-pd-alt","creative-commons-remix","creative-commons-sa","creative-commons-sampling",
    "creative-commons-sampling-plus","creative-commons-share","creative-commons-zero","critical-role",
    "css3","css3-alt","cuttlefish","d-and-d","d-and-d-beyond","dashcube","delicious","deploydog",
    "deskpro","dev","deviantart","dhl","diaspora","digg","digital-ocean","discord","discourse",
    "dochub","docker","draft2digital","dribbble","dribbble-square","dropbox","drupal","dyalog",
    "earlybirds","ebay","edge","elementor","ello","ember","empire","envira","erlang","ethereum",
    "etsy","evernote","expeditedssl","facebook","facebook-f","facebook-messenger","facebook-square",
    "fantasy-flight-games","fedex","fedora","figma","firefox","first-order","first-order-alt",
    "firstdraft","flickr","flipboard","fly","font-awesome","font-awesome-alt","font-awesome-flag",
    "font-awesome-logo-full","fonticons","fonticons-fi","fort-awesome","fort-awesome-alt",
    "forumbee","foursquare","free-code-camp","freebsd","fulcrum","galactic-republic","galactic-senate",
    "get-pocket","gg","gg-circle","git","git-square","github","github-alt","github-square","gitkraken",
    "gitlab","gitter","glide","glide-g","gofore","goodreads","goodreads-g","google","google-drive",
    "google-play","google-plus","google-plus-g","google-plus-square","google-wallet","gratipay","grav",
    "gripfire","grunt","gulp","hacker-news","hacker-news-square","hackerrank","hips","hire-a-helper",
    "hooli","hornbill","hotjar","houzz","html5","hubspot","imdb","instagram","intercom",
    "internet-explorer","invision","ioxhost","itch-io","itunes","itunes-note","java","jedi-order",
    "jenkins","jira","joget","joomla","js","js-square","jsfiddle","kaggle","keybase","keycdn",
    "kickstarter","kickstarter-k","korvue","laravel","lastfm","lastfm-square","leanpub","less",
    "line","linkedin","linkedin-in","linode","linux","lyft","magento","mailchimp","mandalorian",
    "markdown","mastodon","maxcdn","medapps","medium","medium-m","medrt","meetup","megaport",
    "mendeley","microsoft","mix","mixcloud","mizuni","modx","monero","napster","neos","nimblr",
    "nintendo-switch","node","node-js","npm","ns8","nutritionix","odnoklassniki",
    "odnoklassniki-square","old-republic","opencart","openid","opera","optin-monster","osi",
    "page4","pagelines","palfed","patreon","paypal","penny-arcade","periscope","phabricator",
    "phoenix-framework","phoenix-squadron","php","pied-piper","pied-piper-alt","pied-piper-hat",
    "pied-piper-pp","pinterest","pinterest-p","pinterest-square","playstation","product-hunt",
    "pushed","python","qq","quinscape","quora","r-project","raspberry-pi","ravelry","react",
    "reacteurope","readme","rebel","red-river","reddit","reddit-alien","reddit-square","redhat",
    "renren","replyd","researchgate","resolving","rev","rocketchat","rockrms","safari","salesforce",
    "sass","schlix","scribd","searchengin","sellcast","sellsy","servicestack","shirtsinbulk",
    "shopware","simplybuilt","sistrix","sith","sketch","skyatlas","skype","slack","slack-hash",
    "slideshare","snapchat","snapchat-ghost","snapchat-square","soundcloud","sourcetree","speakap",
    "speaker-deck","spotify","squarespace","stack-exchange","stack-overflow","staylinked","steam",
    "steam-square","steam-symbol","sticker-mule","strava","stripe","stripe-s","studiovinari",
    "stumbleupon","stumbleupon-circle","superpowers","supple","suse","symfony","teamspeak",
    "telegram","telegram-plane","tencent-weibo","the-red-yeti","themeco","themeisle","think-peaks",
    "trade-federation","trello","tripadvisor","tumblr","tumblr-square","twitch","twitter",
    "twitter-square","typo3","uber","ubuntu","uikit","uniregistry","untappd","ups","usb",
    "usps","ussunnah","vaadin","viacoin","viadeo","viadeo-square","viber","vimeo","vimeo-square",
    "vimeo-v","vine","vk","vnv","vuejs","waze","weebly","weibo","weixin","whatsapp","whatsapp-square",
    "whmcs","wikipedia-w","windows","wix","wizards-of-the-coast","wolf-pack-battalion","wordpress",
    "wordpress-simple","wpbeginner","wpexplorer","wpforms","wpressr","xbox","xing","xing-square",
    "y-combinator","yahoo","yammer","yandex","yandex-international","yarn","yelp","yoast","youtube",
    "youtube-square","zhihu"];
    return in_array($name, $fabList);
}

function ub_render_button_block($attributes){
    extract($attributes);

    return '<div class="ub-button-container align-button-'.$align.'">
                <a href="'.$url.'" target="'.($openInNewTab ? '_blank' : '_self').'"
                rel="noopener noreferrer'.($addNofollow ? ' nofollow' : '').'"
                class="ub-button-block-main ub-button-'.$size.'"
                data-defaultColor="'.$buttonColor.'"
                data-defaultTextColor="'.$buttonTextColor.'"
                data-hoverColor="'.$buttonHoverColor.'"
                data-hoverTextColor="'.$buttonTextHoverColor.'"
                data-buttonIsTransparent="'.json_encode($buttonIsTransparent).'"
                style="background-color: '.($buttonIsTransparent ? 'transparent' : $buttonColor).';
                    color: '.($buttonIsTransparent ? $buttonColor : $buttonTextColor).';
                    border-radius: '.($buttonRounded ? '60' : '0').'px;
                    border: '.($buttonIsTransparent ? ('3px solid '.$buttonColor) : 'none').';">
                <div class="ub-button-content-holder"
                    style="flex-direction: '.($iconPosition === 'left' ? 'row' : 'row-reverse').';">'.
                    ($chosenIcon != '' ? '<span class="'.(ub_faIconNameIsBrandname($chosenIcon) ? 'fab' : 'fas')
                                            .' fa-'.$chosenIcon.'"></span>' :'')
                    .'<span class="ub-button-block-btn">'.$buttonText.'</span>
                </div>
            </a>
        </div>';
}

function ub_button_add_frontend_assets() {
    if ( has_block( 'ub/button-block' ) || has_block('ub/button')) {
        wp_enqueue_script(
            'ultimate_blocks-button-front-script',
            plugins_url( 'button/front.js', dirname( __FILE__ ) ),
            array( '' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

function ub_register_button_block() {
	if ( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/button', array(
            'attributes' => array(
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
                    'default'=> false
                ),
                'openInNewTab' => array(
                    'type' => 'boolean',
                    'default'=> false
                )
            ),
			'render_callback' => 'ub_render_button_block'));
	}
}

add_action('init', 'ub_register_button_block');

add_action( 'wp_enqueue_scripts', 'ub_button_add_frontend_assets' );