<?php

namespace Ultimate_Blocks\includes\pro_manager\blocks\coupon;

use Ultimate_Blocks\includes\pro_manager\base\Pro_Block_Upsell;
use function esc_html__;
use function trailingslashit;

/**
 * Coupon pro block upsell.
 */
class Coupon_Pro_Block extends Pro_Block_Upsell {

	/**
	 * Pro block name.
	 * This is the registered name of the block with proper plugin prefix.
	 * Not to be confused with block `label`
	 *
	 * @return string block name
	 */
	public function block_name() {
		return 'ub/coupon';
	}

	/**
	 * Block label.
	 * This is the meaningful name of the block.
	 * Not to be confused with block `name`
	 *
	 * @return string;
	 */
	public function block_label() {
		return esc_html__( 'coupon' );
	}

	/**
	 * Block icon html.
	 * @return null | string;
	 */
	public function block_icon() {
		require( __DIR__ . '/icon.php' );

		return $coupon_block_icon;
	}

	/**
	 * Short block description.
	 * @return string
	 */
	public function block_description() {
		return esc_html__( 'Enhance engagement and sales by easily displaying enticing discounts.' );
	}

	/**
	 * Pro block screenshot image url location.
	 * @return string image url location
	 */
	public function block_upsell_screenshot() {
		return trailingslashit( ULTIMATE_BLOCKS_URL ) . 'includes/pro_manager/blocks/coupon/assets/coupon-ss.png';
	}
}
