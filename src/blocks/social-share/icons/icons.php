<?php
/**
 * Generate Svg Icons.
 *
 * @category Block Icons
 * @package   SocialShareBlockIcons
 */

/**
 * Get facebook svg icon
 *
 * @param array $props passs options.
 * @return string
 */
function facebook_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 264 512"><path d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229" /></svg>';
}


/**
 * Get Twitter svg icon
 *
 * @param array $props passs options.
 * @return string
 */
function twitter_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="color:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584l-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>';
}

/**
 * Get LinkedIn svg icon
 *
 * @param array $props pass options.
 * @return string
 */
function linkedin_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 448 512"><path d="M100.3 480H7.4V180.9h92.9V480zM53.8 140.1C24.1 140.1 0 115.5 0 85.8 0 56.1 24.1 32 53.8 32c29.7 0 53.8 24.1 53.8 53.8 0 29.7-24.1 54.3-53.8 54.3zM448 480h-92.7V334.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V480h-92.8V180.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V480z" /></svg>';
}

/**
 * Get Pinterest svg icon
 *
 * @param array $props pass options.
 * @return string
 */
function pinterest_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 384 512"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" /></svg>';
}


/**
 * Get Reddit svg icon
 *
 * @param array $props pass options.
 * @return string
 */
function reddit_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 512 512"><path d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z" /></svg>';
}

/**
 * Get Google Plus svg icon
 *
 * @param array $props pass options.
 * @return string
 */
function googleplus_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 640 512"><path d="M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599-65.484 0-118.92 54.221-118.92 121.277 0 67.056 53.436 121.277 118.92 121.277 75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z" /></svg>';
}


/**
 * Get Tumblr svg icon
 *
 * @param array $props pass options.
 * @return string
 */
function tumblr_icon( array $props ) {
    extract($props);
    if($color === ''){
        $color = '#ffffff';
    }

	return '<svg xmlns="http://www.w3.org/2000/svg" style="fill:' . $color . '" fill="' . $color . '" width="' . $width . '" height="' . $height . '" viewBox="0 0 320 512"><path d="M309.8 480.3c-13.6 14.5-50 31.7-97.4 31.7-120.8 0-147-88.8-147-140.6v-144H17.9c-5.5 0-10-4.5-10-10v-68c0-7.2 4.5-13.6 11.3-16 62-21.8 81.5-76 84.3-117.1.8-11 6.5-16.3 16.1-16.3h70.9c5.5 0 10 4.5 10 10v115.2h83c5.5 0 10 4.4 10 9.9v81.7c0 5.5-4.5 10-10 10h-83.4V360c0 34.2 23.7 53.6 68 35.8 4.8-1.9 9-3.2 12.7-2.2 3.5.9 5.8 3.4 7.4 7.9l22 64.3c1.8 5 3.3 10.6-.4 14.5z" /></svg>';
}
