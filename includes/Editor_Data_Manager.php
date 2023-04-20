<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function add_filter;
use function apply_filters;
use function wp_localize_script;

/**
 * Manager responsible for extra data to be used in client editor.
 */
class Editor_Data_Manager {
	use Manager_Base_Trait;

	/**
	 * Registered attributes of our plugin.
	 * @var array
	 */
	public $registered_plugin_block_attributes = [];

	/**
	 * Filter hook name for client priority data.
	 * @var string
	 */
	private $editor_priority_data_filter_hook = 'ub/filter/priority-editor-data';

	/**
	 * Filter hook name for client data.
	 * @var string
	 */
	private $editor_data_filter_hook = 'ub/filter/editor-client-data';

	/**
	 * Object name of data in editor.
	 * @var string
	 */
	private $editor_data_object_name = 'ubEditorClientData';

	/**
	 * Object name of priority data in editor.
	 * @var string
	 */
	private $editor_priority_data_object_name = 'ubPriorityData';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'register_block_type_args', [ $this, 'block_registered_args' ], 100, 2 );
	}

	/**
	 * Add priority data.
	 *
	 * This function will add given data to already localized base data for priority scripts.
	 *
	 * @param array $data data to be added
	 *
	 * @return void
	 */
	public function add_priority_data( $data ) {
		add_filter( $this->editor_priority_data_filter_hook, function ( $priority_data ) use ( $data ) {
			return array_merge_recursive( $priority_data, $data );
		} );
	}

	/**
	 * Add editor data.
	 *
	 * @param array $data data to be added
	 *
	 * @return void
	 */
	public function add_editor_data( $data ) {
		add_filter( $this->editor_data_filter_hook, function ( $editor_data ) use ( $data ) {
			return array_merge_recursive( $editor_data, $data );
		} );
	}

	/**
	 * Attach editor data to script.
	 *
	 * @param array $base_data base data to start
	 * @param string $script_handler script handler name which this data will be attached
	 *
	 * @return void
	 */
	public function attach_editor_data( $base_data, $script_handler ) {
		// add priority related data to base data too since there might be components that are using it
		$base_data   = $this->generate_priority_base_data( $base_data );
		$editor_data = apply_filters( $this->editor_data_filter_hook, $base_data );

		wp_localize_script( $script_handler, $this->editor_data_object_name, $editor_data );
	}

	/**
	 * Attach priority data to script.
	 *
	 * @param array $base_data base data to start
	 * @param string $script_handler script handler name which this data will be attached
	 *
	 * @return void
	 */
	public function attach_priority_data( $base_data, $script_handler ) {
		$base_data     = $this->generate_priority_base_data( $base_data );
		$priority_data = apply_filters( $this->editor_priority_data_filter_hook, $base_data );

		wp_localize_script( $script_handler, $this->editor_priority_data_object_name, $priority_data );
	}

	/**
	 * Generate base startup data for priority data.
	 *
	 * @return array priority base data
	 */
	public function generate_priority_base_data( $base_data ) {
		$base_extra_data = [
			'blockAttributes' => $this->registered_plugin_block_attributes,
		];

		return array_merge_recursive( $base_data, $base_extra_data );
	}

	/**
	 * Callback for registered arguments of block types.
	 *
	 * @param array $args block arguments
	 * @param string $block_type block type id
	 *
	 * @return array filtered block arguments
	 */
	public function block_registered_args( $args, $block_type ) {
		if ( strpos( $block_type, 'ub/' ) === 0 ) {
			$plugin_block_attributes                                 = $args['attributes'];
			$this->registered_plugin_block_attributes[ $block_type ] = $plugin_block_attributes;
		}

		return $args;
	}
}


