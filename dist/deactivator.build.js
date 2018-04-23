/* eslint-disable */

if (window.ultimate_blocks) {

	var deactivatedBlocks = window.ultimate_blocks;

	deactivatedBlocks.forEach( block => {
		if(!block.active) {
			console.log('uregister', block.name)
			wp.blocks.unregisterBlockType(block.name);
		}
	});

}
