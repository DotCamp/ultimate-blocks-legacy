const { createBlock } = wp.blocks;

const transforms = {
	from: [
		{
			type: "prefix",
			prefix: "#h1",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h1" });
			}
		},
		{
			type: "prefix",
			prefix: "#h2",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h2" });
			}
		},
		{
			type: "prefix",
			prefix: "#h3",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h3" });
			}
        },
        {
			type: "prefix",
			prefix: "#h4",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h4" });
			}
		},
		{
			type: "prefix",
			prefix: "#h5",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h5" });
			}
		},
		{
			type: "prefix",
			prefix: "#h6",
			transform: () => {
				return createBlock("ub/advanced-heading", { level: "h6" });
			}
		}
	]
};

export default transforms;