<?php

namespace Ultimate_Blocks\includes\pro_manager\base;

/**
 * Base class for pro extension upsells.
 */
abstract class All_Blocks_Pro_Extension_Upsell {
	/**
	 * Pro block name.
	 * This is the registered name of the block with proper plugin prefix.
	 * Not to be confused with block `label`
	 *
	 * @return string block name
	 */
	public abstract function extension_name();
	/**
	 * Extension label.
	 * This is the meaningful name of the extension.
	 * Not to be confused with extension `name`
	 *
	 * @return string;
	 */
	public abstract function extension_label();

	/**
	 * Extension icon html.
	 * @return null | string;
	 */
	public abstract function extension_icon();

	/**
	 * Short extension description.
	 * @return string
	 */
	public abstract function extension_description();

	/**
	 * Pro extension screenshot image url location.
	 * @return string image url location
	 */
	public abstract function extension_upsell_screenshot();

}
