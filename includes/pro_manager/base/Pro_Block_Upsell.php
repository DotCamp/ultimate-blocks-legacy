<?php

namespace Ultimate_Blocks\includes\pro_manager\base;

/**
 * Base class for pro block upsells.
 */
abstract class Pro_Block_Upsell {
	/**
	 * Pro block name.
	 * This is the registered name of the block with proper plugin prefix.
	 * Not to be confused with block `label`
	 *
	 * @return string block name
	 */
	public abstract function block_name();

	/**
	 * Block label.
	 * This is the meaningful name of the block.
	 * Not to be confused with block `name`
	 *
	 * @return string;
	 */
	public abstract function block_label();

	/**
	 * Block icon html.
	 * @return null | string;
	 */
	public abstract function block_icon();

	/**
	 * Short block description.
	 * @return string
	 */
	public abstract function block_description();

	/**
	 * Pro block screenshot image url location.
	 * @return string image url location
	 */
	public abstract function block_upsell_screenshot();

}
