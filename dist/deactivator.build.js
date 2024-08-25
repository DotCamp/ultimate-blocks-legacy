/* eslint-disable */

if (window.ultimate_blocks) {
	window.ultimate_blocks.forEach((block) => {
		if (!block.active) {
			wp.blocks.unregisterBlockType(block.name);
		}
	});
}
